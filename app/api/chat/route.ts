import { NextRequest, NextResponse } from "next/server";
import { recallVenueHistory } from "@/lib/hindsight";
import { answerEventQuery } from "@/lib/groq";

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // 1. Recall relevant Hindsight memories
    const recallResult = await recallVenueHistory(query);

    // 2. Synthesize dual answers: grounded in persistent memory vs stateless generic AI
    const response = await answerEventQuery(query, recallResult.memories);

    return NextResponse.json({
      success: true,
      query,
      groundedAnswer: response.groundedAnswer,
      statelessAnswer: response.statelessAnswer,
      evidence: response.evidence,
      retrievalMeta: {
        totalRecalled: recallResult.memories.length,
        executionTimeMs: recallResult.executionTimeMs,
        source: recallResult.source,
      }
    });
  } catch (error: any) {
    console.error("[API chat] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

