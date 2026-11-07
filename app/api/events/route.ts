import { NextRequest, NextResponse } from "next/server";
import { getEvents, resetToSeedEvents } from "@/lib/db";
import { resetHindsightMemories } from "@/lib/hindsight";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const venue = searchParams.get("venue");
    
    let events = getEvents();
    if (venue) {
      const lower = venue.toLowerCase();
      events = events.filter(e => 
        e.venueName.toLowerCase().includes(lower) || 
        e.venueId.toLowerCase().includes(lower)
      );
    }

    return NextResponse.json({
      success: true,
      events,
      count: events.length
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (body.action === "reset_seed") {
      const events = resetToSeedEvents();
      resetHindsightMemories();
      return NextResponse.json({
        success: true,
        message: "Database and Hindsight memory bank restored to 4 canonical HackwithHyderabad seed scenarios.",
        events
      });
    }
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

