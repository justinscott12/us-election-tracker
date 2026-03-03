import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import os from "os";
import type {
  ElectionData,
  ElectionResultUpdate,
  NotableRace,
  NotableRaceResultUpdate,
  StateResult,
} from "@/types/election";
import { SEED_DATA } from "./seed-data";

const isServerless =
  !!process.env.NETLIFY || !!process.env.VERCEL || !!process.env.AWS_LAMBDA_FUNCTION_NAME;
const DATA_DIR = isServerless
  ? path.join(os.tmpdir(), "election-tracker-data")
  : path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "election.json");

export async function getData(): Promise<ElectionData> {
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
        },
      },
    };
    await mkdir(DATA_DIR, { recursive: true });
    await writeFile(DATA_FILE, JSON.stringify(next, null, 2), "utf-8");
    return next;
  }

  throw new Error("Request body must include exactly one of: notableRace, presidentialState");
}
