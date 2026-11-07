import { NextRequest, NextResponse } from "next/server";
import { recallVenueHistory } from "@/lib/hindsight";
import { generateVenueBriefing } from "@/lib/groq";
import { getSeasonFromDate } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      venueName,
      location = "Hyderabad",
      date,
      capacity = 250,
      eventType = "Conference",
      budget = 1000000,
      notes = "",
    } = body;

    if (!venueName || !date) {
      return NextResponse.json(
        { error: "Venue name and planned date are required." },
        { status: 400 }
      );
    }

    // 1. Calculate season & normalized venue identifier
    const season = getSeasonFromDate(date);
    const normalizedVenueId = venueName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "_")
      .replace(/_+/g, "_");

    // 2. Query Hindsight Memory Layer
    // Constructs dual retrieval query targeting venue history + seasonal constraints
    const recallQuery = `${venueName} ${location} ${eventType} ${season} incidents limitations audio parking catering delay rain`;
    
    const recallResult = await recallVenueHistory(recallQuery, normalizedVenueId, {
      season,
      start: date
    });

    // 3. Orchestrate LLM Reasoning pipeline strictly grounded on Hindsight memories
    const briefing = await generateVenueBriefing({
      venueName,
      location,
      date,
      season,
      capacity: Number(capacity),
      eventType,
      budget: Number(budget),
      notes,
      recalledMemories: recallResult.memories,
    });

    return NextResponse.json({
      success: true,
      data: briefing,
      hindsightMeta: {
        totalMemoriesRecalled: recallResult.memories.length,
        retrievalSummary: recallResult.retrievalSummary,
        executionTimeMs: recallResult.executionTimeMs,
        source: recallResult.source,
      }
    });
  } catch (error: any) {
    console.error("[API plan-event] Error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error during event planning pipeline." },
      { status: 500 }
    );
  }
}

