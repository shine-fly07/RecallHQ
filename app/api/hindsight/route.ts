import { NextRequest, NextResponse } from "next/server";
import { getAllMemories, getHindsightStatus, resetHindsightMemories } from "@/lib/hindsight";
import { getGroqStatus } from "@/lib/groq";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const venueId = searchParams.get("venueId") || undefined;
    const memories = getAllMemories(venueId);
    const hindsightStatus = getHindsightStatus();
    const groqStatus = getGroqStatus();

    return NextResponse.json({
      success: true,
      hindsight: hindsightStatus,
      groq: groqStatus,
      memories,
      count: memories.length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (body.action === "reset") {
      resetHindsightMemories();
      return NextResponse.json({
        success: true,
        message: "Hindsight memory bank reset to baseline nodes.",
        memories: getAllMemories()
      });
    }
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

