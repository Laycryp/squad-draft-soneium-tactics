// src/app/api/simulate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { simulateBattle } from "~/game/simulateBattle";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    if (!body || !Array.isArray(body.squadIds)) {
      return NextResponse.json(
        { error: "Invalid body. Expected { squadIds: number[] }" },
        { status: 400 }
      );
    }

    const squadIds = body.squadIds as number[];

    if (squadIds.length === 0) {
      return NextResponse.json(
        { error: "squadIds must not be empty." },
        { status: 400 }
      );
    }

    const result = simulateBattle(squadIds);

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error("Error in /api/simulate:", err);
    return NextResponse.json(
      { error: "Simulation failed on server." },
      { status: 500 }
    );
  }
}
