import { NextRequest, NextResponse } from "next/server";
import { rememberEvent } from "@/lib/hindsight";
import { saveEvent } from "@/lib/db";
import { getSeasonFromDate } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      venueName,
      location = "Hyderabad",
      date,
      capacity = 100,
      eventType = "Conference",
      budget = 500000,
      actualSpend,
      retrospectiveNotes,
      incidents = [],
      insights = [],
    } = body;

    if (!venueName || !date || !retrospectiveNotes) {
      return NextResponse.json(
        { error: "Venue name, date, and retrospective notes are required." },
        { status: 400 }
      );
    }

    const season = getSeasonFromDate(date);
    const venueId = venueName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "_")
      .replace(/_+/g, "_");

    // 1. Ingest into Vectorize Hindsight Memory
    // Tags memory with venue_id, location, date_season, and event_type
    const memoryNode = await rememberEvent(venueId, date, retrospectiveNotes, {
      venueName,
      location,
      season,
      dateSeason: season,
      eventType,
      capacity: Number(capacity),
      budget: Number(budget),
      actualSpend: actualSpend ? Number(actualSpend) : undefined,
    });

    // 2. Persist Event Record into Database
    const savedEvent = saveEvent({
      venueId,
      venueName,
      location,
      date,
      season,
      capacity: Number(capacity),
      eventType,
      budget: Number(budget),
      actualSpend: actualSpend ? Number(actualSpend) : undefined,
      retrospectiveNotes,
      incidents: incidents.length > 0 ? incidents : [retrospectiveNotes],
      insights: insights.length > 0 ? insights : ["Logged into RecallHQ Hindsight Memory Bank"],
      status: "completed",
      hindsightMemoryId: memoryNode.id,
    });

    return NextResponse.json({
      success: true,
      message: "Retrospective and factual observations successfully committed to Hindsight memory bank.",
      event: savedEvent,
      memoryNode,
    });
  } catch (error: any) {
    console.error("[API ingest-retrospective] Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to commit retrospective to memory." },
      { status: 500 }
    );
  }
}

