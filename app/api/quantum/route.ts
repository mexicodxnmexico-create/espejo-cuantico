import { NextRequest, NextResponse } from "next/server";
import { QuantumEngine, INITIAL_STATE, QuantumSystemState } from "@/lib/quantum-engine";

// Mock Database with multiple user states
const db: Record<string, QuantumSystemState> = {};

export async function GET(req: NextRequest) {
  const userId = req.headers.get("x-user-id") || "default";

  if (!db[userId]) {
    db[userId] = { ...INITIAL_STATE };
  }

  return NextResponse.json(db[userId]);
}

export async function POST(req: NextRequest) {
  const userId = req.headers.get("x-user-id") || "default";
  const { action } = await req.json();

  if (!action) {
    return NextResponse.json({ error: "No action provided" }, { status: 400 });
  }

  if (!db[userId]) {
    db[userId] = { ...INITIAL_STATE };
  }

  // The Backend "Brain" processes the rules for this specific user
  db[userId] = QuantumEngine.transition(db[userId], action);

  return NextResponse.json(db[userId]);
}
