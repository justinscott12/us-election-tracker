import { NextResponse } from "next/server";
import { getData, applyResultUpdate } from "@/lib/data";
import type { ElectionResultUpdate } from "@/types/election";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getData();
    return NextResponse.json(data);
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
    const update = body as ElectionResultUpdate;
    if (hasNotable && typeof (update.notableRace as { id?: unknown }).id !== "string") {
      return NextResponse.json(
        { error: "notableRace.id is required and must be a string" },
        { status: 400 }
      );
    }
    if (hasPresidential && typeof (update.presidentialState as { stateCode?: unknown }).stateCode !== "string") {
      return NextResponse.json(
        { error: "presidentialState.stateCode is required and must be a string" },
        { status: 400 }
      );
    }
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
