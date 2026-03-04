import { NextResponse } from "next/server";
import { getData, applyResultUpdate } from "@/lib/data";
import { LIVE_RESULTS_ENABLED } from "@/lib/feature-flags";
import type { ElectionResultUpdate, NotableRaceUpdate, PresidentialStateUpdate } from "@/types/election";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getData();
    data.showLiveResults = LIVE_RESULTS_ENABLED;
    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to load election data" },
      { status: 500 }
    );
  }
}

/** PATCH body must be exactly one of: { notableRace: { id, ... } } or { presidentialState: { stateCode, ... } }. One election per request; only result fields are updated. */
export async function PATCH(request: Request) {
  const secret = process.env.ELECTION_UPDATE_SECRET;
  const isProduction = process.env.NODE_ENV === "production";
  if (isProduction && !secret) {
    console.error("ELECTION_UPDATE_SECRET is not set; PATCH is disabled in production.");
    return NextResponse.json(
      { error: "Updates are disabled" },
      { status: 503 }
    );
  }
  if (secret) {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : request.headers.get("x-election-secret");
    if (token !== secret) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const hasNotable = "notableRace" in body && body.notableRace != null && typeof body.notableRace === "object";
    const hasPresidential = "presidentialState" in body && body.presidentialState != null && typeof body.presidentialState === "object";
    if (Number(hasNotable) + Number(hasPresidential) !== 1) {
      return NextResponse.json(
        { error: "Body must include exactly one of: notableRace, presidentialState" },
        { status: 400 }
      );
    }
    if (hasNotable) {
      const nr = body.notableRace as { id?: unknown };
      if (typeof nr.id !== "string") {
        return NextResponse.json(
          { error: "notableRace.id is required and must be a string" },
          { status: 400 }
        );
      }
    } else {
      const ps = body.presidentialState as { stateCode?: unknown };
      if (typeof ps.stateCode !== "string") {
        return NextResponse.json(
          { error: "presidentialState.stateCode is required and must be a string" },
          { status: 400 }
        );
      }
    }
    const update: ElectionResultUpdate = hasNotable
      ? { notableRace: body.notableRace as NotableRaceUpdate }
      : { presidentialState: body.presidentialState as PresidentialStateUpdate };
    const data = await applyResultUpdate(update);
    return NextResponse.json(data);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to update election data";
    const isNotFound = message.startsWith("Notable race not found:");
    console.error(e);
    return NextResponse.json(
      { error: message },
      { status: isNotFound ? 404 : 500 }
    );
  }
}
