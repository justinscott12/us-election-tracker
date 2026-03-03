import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import os from "os";
import { getStore } from "@netlify/blobs";
import type {
  ElectionData,
  ElectionResultUpdate,
  NotableRace,
  NotableRaceResultUpdate,
  StateResult,
} from "@/types/election";
import { SEED_DATA } from "./seed-data";

const isNetlify = !!process.env.NETLIFY;

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "election.json");

const BLOB_STORE_NAME = process.env.ELECTION_BLOB_STORE || "election-tracker";
const BLOB_KEY = process.env.ELECTION_BLOB_KEY || "election.json";

async function readFromBlob(): Promise<ElectionData | null> {
  if (!isNetlify) return null;
  try {
    const store = getStore(BLOB_STORE_NAME);
    const value = await store.get(BLOB_KEY, { type: "json" });
    if (!value) return null;
    return value as ElectionData;
  } catch {
    return null;
  }
}

async function writeToBlob(data: ElectionData): Promise<void> {
  if (!isNetlify) return;
  const store = getStore(BLOB_STORE_NAME);
  await store.set(BLOB_KEY, JSON.stringify(data), { contentType: "application/json" });
}

export async function getData(): Promise<ElectionData> {
  // In Netlify production, prefer durable blob store
  if (isNetlify) {
    const blobData = await readFromBlob();
    if (blobData) {
      return blobData;
    }
  }

  // Fallback to local JSON file (development or when blob missing)
  try {
    const raw = await readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw) as ElectionData;
  } catch {
    return SEED_DATA;
  }
}

/** Merge updated result fields into existing candidate row by name */
function mergeResultRow(
  existing: { name: string; party?: string; pct?: number; votes?: number; winner?: boolean },
  update: NotableRaceResultUpdate
): typeof existing {
  return {
    ...existing,
    ...(update.pct !== undefined && { pct: update.pct }),
    ...(update.votes !== undefined && { votes: update.votes }),
    ...(update.winner !== undefined && { winner: update.winner }),
    ...(update.party !== undefined && { party: update.party }),
  };
}

/** Apply a single result update (one notable race or one presidential state). Does not replace other data. */
export async function applyResultUpdate(update: ElectionResultUpdate): Promise<ElectionData> {
  const current = await getData();

  if ("notableRace" in update) {
    const { id, status, votesCountedPct, results } = update.notableRace;
    const raceIndex = current.notableRaces.findIndex((r) => r.id === id);
    if (raceIndex === -1) {
      throw new Error(`Notable race not found: ${id}`);
    }
    const race = current.notableRaces[raceIndex];
    const existingResults = race.results ?? [];
    const nextResults = results
      ? (() => {
          const byName = new Map(existingResults.map((r) => [r.name, { ...r }]));
          for (const u of results) {
            const existing = byName.get(u.name);
            byName.set(
              u.name,
              existing
                ? mergeResultRow(
                    {
                      name: existing.name,
                      party: existing.party,
                      pct: existing.pct,
                      votes: existing.votes,
                      winner: existing.winner,
                    },
                    u
                  )
                : { name: u.name, party: u.party, pct: u.pct, votes: u.votes, winner: u.winner }
            );
          }
          return Array.from(byName.values());
        })()
      : existingResults;
    const nextRace: NotableRace = {
      ...race,
      ...(status !== undefined && { status }),
      ...(votesCountedPct !== undefined && { votesCountedPct }),
      results: nextResults,
      lastUpdated: new Date().toISOString(),
    };
    const next: ElectionData = {
      ...current,
      notableRaces: current.notableRaces.map((r, i) => (i === raceIndex ? nextRace : r)),
    };
    await mkdir(DATA_DIR, { recursive: true });
    await writeFile(DATA_FILE, JSON.stringify(next, null, 2), "utf-8");
    await writeToBlob(next);
    return next;
  }

  if ("presidentialState" in update) {
    const { stateCode, stateFill, stateResult } = update.presidentialState;
    const nextFills = { ...current.stateOfNation.presidential.stateFills };
    if (stateFill !== undefined) nextFills[stateCode] = stateFill;
    const nextStateResults = { ...(current.stateOfNation.presidential.stateResults ?? {}) };
    if (stateResult !== undefined) {
      const existing = nextStateResults[stateCode];
      nextStateResults[stateCode] = { ...existing, ...stateResult } as StateResult;
    }
    const next: ElectionData = {
      ...current,
      stateOfNation: {
        ...current.stateOfNation,
        presidential: {
          ...current.stateOfNation.presidential,
          stateFills: nextFills,
          stateResults: nextStateResults,
          lastUpdated: new Date().toISOString(),
        },
      },
    };
    await mkdir(DATA_DIR, { recursive: true });
    await writeFile(DATA_FILE, JSON.stringify(next, null, 2), "utf-8");
    await writeToBlob(next);
    return next;
  }

  throw new Error("Request body must include exactly one of: notableRace, presidentialState");
}
