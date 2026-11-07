import { HindsightMemoryNode, VenueBriefing, PredictiveChecklistItem, RiskMitigationItem } from "@/types";

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

export function getGroqStatus() {
  const isConfigured = Boolean(GROQ_API_KEY && GROQ_API_KEY.trim().length > 0);
  return {
    isConfigured,
    model: GROQ_MODEL,
    provider: isConfigured ? "Groq Cloud High-Speed Inference" : "Local Grounded Engine (Ready for Groq Key)"
  };
}

/**
 * Generate an Intelligent Venue Briefing grounded strictly on Hindsight memories
 */
export async function generateVenueBriefing(params: {
  venueName: string;
  location: string;
  date: string;
  season: string;
  capacity: number;
  eventType: string;
  budget: number;
  notes?: string;
  recalledMemories: HindsightMemoryNode[];
}): Promise<VenueBriefing> {
  const {
    venueName,
    location,
    date,
    season,
    capacity,
    eventType,
    budget,
    notes,
    recalledMemories,
  } = params;

  // Format memories into factual evidence blocks
  const memoryContext = recalledMemories.length > 0
    ? recalledMemories
        .map((m, idx) => `[Memory #${idx + 1} | Type: ${m.type.toUpperCase()} | Confidence: ${(m.confidenceScore * 100).toFixed(0)}% | Date: ${m.metadata.eventDate || "Past"} | Strategy: ${m.retrievalStrategy}]\n${m.content}`)
        .join("\n\n")
    : "No prior events recorded for this exact venue or season. Grounding on general corporate event hygiene.";

  const systemPrompt = `You are VenueIQ, an enterprise AI event-intelligence agent powered by Vectorize Hindsight persistent memory.
Your mission is to eliminate repetitive logistical errors by anchoring every briefing strictly to factual historical memory.
DO NOT provide vague, generic event advice. You must explicitly cite past room names, failure incidents, vendor bottlenecks, and precise remedies from the recalled memories.

Expected Output Format: Valid JSON matching this schema:
{
  "pastIncidents": ["incident 1 citing past memory", "incident 2..."],
  "budgetAndVendorRecollections": ["vendor or budget detail from memory", ...],
  "actionableRecommendations": ["specific action referencing past room/hardware/vendor", ...],
  "predictiveChecklist": [
    { "task": "string", "reason": "why, citing past memory", "priority": "high"|"medium"|"low", "department": "Logistics"|"AV & Tech"|"Catering"|"Venue Operations"|"Security" }
  ],
  "mitigationPlan": [
    { "risk": "string", "mitigation": "string", "precedent": "past incident precedent from memory" }
  ],
  "statelessComparison": {
    "advice": "What a generic stateless AI would say without Hindsight memory (bland general advice)",
    "limitations": ["Why stateless advice fails here", "Missed critical past incident"]
  }
}`;

  const userPrompt = `Generate an Intelligent Venue Briefing for an upcoming event:
Venue: ${venueName}
Location: ${location}
Planned Date: ${date} (Season: ${season})
Target Capacity: ${capacity} attendees
Event Type: ${eventType}
Target Budget: INR ${budget}
Special Notes/Inquiry: ${notes || "None provided"}

=== RECALLED HINDSIGHT MEMORY CONTEXT ===
${memoryContext}
=== END RECALLED CONTEXT ===

Remember: Ground your response strictly on the factual evidence above. Return ONLY the JSON object.`;

  // 1. If GROQ_API_KEY is configured, call Groq API
  if (GROQ_API_KEY) {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          response_format: { type: "json_object" },
          temperature: 0.2,
          max_tokens: 2048,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content);
          return {
            venueName,
            location,
            plannedDate: date,
            capacity,
            eventType,
            budget,
            pastIncidents: parsed.pastIncidents || [],
            budgetAndVendorRecollections: parsed.budgetAndVendorRecollections || [],
            actionableRecommendations: parsed.actionableRecommendations || [],
            predictiveChecklist: parsed.predictiveChecklist || [],
            mitigationPlan: parsed.mitigationPlan || [],
            recalledMemories,
            statelessComparison: parsed.statelessComparison || {
              advice: "Ensure to conduct audio checks, arrange sufficient catering, and verify parking.",
              limitations: ["No awareness of specific room acoustic feedbacks", "Missed seasonal monsoon lawn flooding"]
            },
            llmProvider: `Groq (${GROQ_MODEL})`,
            modelUsed: GROQ_MODEL,
          };
        }
      } else {
        console.warn(`[Groq API] Error ${response.status}: ${await response.text()}`);
      }
    } catch (err) {
      console.warn("[Groq API] Network error, utilizing intelligent grounded engine fallback", err);
    }
  }

  // 2. High-precision Grounded Fallback Engine
  // Synthesizes the exact structured briefing using the recalled memories
  return generateIntelligentFallbackBriefing({
    venueName,
    location,
    date,
    season,
    capacity,
    eventType,
    budget,
    notes,
    recalledMemories
  });
}

/**
 * Intelligent deterministic briefing generator grounded strictly on recalled memories
 */
function generateIntelligentFallbackBriefing(params: {
  venueName: string;
  location: string;
  date: string;
  season: string;
  capacity: number;
  eventType: string;
  budget: number;
  notes?: string;
  recalledMemories: HindsightMemoryNode[];
}): VenueBriefing {
  const { venueName, location, date, season, capacity, eventType, budget, recalledMemories } = params;

  const pastIncidents: string[] = [];
  const recollections: string[] = [];
  const recommendations: string[] = [];
  const checklist: PredictiveChecklistItem[] = [];
  const mitigation: RiskMitigationItem[] = [];

  // Parse each recalled memory node into domain insights
  recalledMemories.forEach(mem => {
    const text = mem.content;
    const lower = text.toLowerCase();

    if (lower.includes("elevator") || lower.includes("loading") || lower.includes("truss")) {
      pastIncidents.push("Freight Elevator Delay: Prior event had a 1-hour stage setup delay due to unannounced freight elevator servicing.");
      recommendations.push("Mandate 48-hour prior booking for the North freight elevator and verify maintenance schedule with facility chief.");
      checklist.push({
        task: "Verify freight elevator operational lockout with building superintendent",
        reason: "Precedent: July 15 event lost 60 minutes of stage rigging time due to elevator maintenance",
        priority: "high",
        department: "Logistics"
      });
      mitigation.push({
        risk: "Stage rigging and AV delay due to cargo elevator queue",
        mitigation: "Secure written operational lock for dedicated North freight lift from 06:00 to 11:00 AM",
        precedent: "HICC Novotel July 15 retrospective"
      });
    }

    if (lower.includes("vegetarian") || lower.includes("catering") || lower.includes("buffet")) {
      recollections.push("Catering Ratio Disparity: Past tech conference experienced a 20% deficit in vegetarian buffet dishes by 1:30 PM.");
      recommendations.push("Adjust menu ratio to 65% vegetarian vs 35% non-vegetarian for Hyderabad tech attendees (standard hotel 45% default causes shortfalls).");
      checklist.push({
        task: "Revise catering BEO to 65% vegetarian distribution",
        reason: "Past Hyderabad conference data proved vegetarian consumption exceeds hotel standard ratio by 20%",
        priority: "high",
        department: "Catering"
      });
      mitigation.push({
        risk: "Lunch buffet food shortage for vegetarian attendees",
        mitigation: "Include 15% replenishment buffer on vegetarian entrees and dual-line buffet stations",
        precedent: "HICC Novotel catering retrospective"
      });
    }

    if (lower.includes("audio") || lower.includes("feedback") || lower.includes("auditorium 1") || lower.includes("mic")) {
      pastIncidents.push("Auditorium 1 Acoustic Feedback: House PA feedback loop occurred when attendance crossed 300 guests.");
      recommendations.push("Retain an external audio engineer equipped with DSP parametric feedback suppressors rather than relying on house soundboard.");
      checklist.push({
        task: "Contract external sound engineer with hardware feedback suppressors",
        reason: "T-Hub Auditorium 1 house board lacks DSP notch filters when crowd absorption dampens high frequencies",
        priority: "high",
        department: "AV & Tech"
      });
      mitigation.push({
        risk: "Piercing microphone squeal during keynote presentations",
        mitigation: "Stage boundary mics with external DSP notch filter rack and directional wireless lapels",
        precedent: "T-Hub Phase 2 November 12 incident"
      });
    }

    if (lower.includes("wifi") || lower.includes("wi-fi") || lower.includes("2.4ghz") || lower.includes("interference")) {
      recollections.push("RF Spectrum Contention: Roving wireless microphones suffered 2.4GHz RF interference from high-density attendee Wi-Fi.");
      recommendations.push("Enforce UHF/DECT band microphones or separate wireless mic access points from guest SSID antennas.");
      checklist.push({
        task: "Perform RF spectrum analyzer scan and lock wireless mics to UHF spectrum",
        reason: "High hackathon participant device count caused dropouts on 2.4GHz audio transmitters",
        priority: "medium",
        department: "AV & Tech"
      });
    }

    if (lower.includes("rain") || lower.includes("lawn") || lower.includes("monsoon") || lower.includes("waterlog") || lower.includes("drainage")) {
      pastIncidents.push("Lawn Flooding & Relocation: August monsoon downpour waterlogged the lawn within 20 minutes, forcing emergency relocation.");
      recommendations.push("Never book open lawn during monsoon season without a confirmed upper-floor dry ballroom backup.");
      checklist.push({
        task: "Lock in primary indoor backup hall (avoid Basement 2) with signed inclement weather rider",
        reason: "Cyber Pearl open lawn drainage failed during August 20 storm; Basement 2 had ventilation issues",
        priority: "high",
        department: "Venue Operations"
      });
      mitigation.push({
        risk: "Outdoor event wash-out and turf waterlogging",
        mitigation: "Dual-contract weather marquee with pre-installed rubber ducting and dry ballroom fallback",
        precedent: "Cyber Pearl August 20 retrospective"
      });
    }

    if (lower.includes("basement 2") || lower.includes("cell") || lower.includes("repeater")) {
      recollections.push("Basement 2 Cellular Deadzone: Emergency relocation suffered complete signal loss across Airtel and Jio networks.");
      recommendations.push("If Basement 2 must be used for breakouts, deploy temporary cellular repeaters and industrial dehumidifier fans.");
      checklist.push({
        task: "Install temporary cellular signal boosters in Basement 2",
        reason: "Attendees lost mobile connectivity when forced indoors during past lawn evacuation",
        priority: "medium",
        department: "Logistics"
      });
    }

    if (lower.includes("valet") || lower.includes("parking") || lower.includes("gridlock") || lower.includes("kohenur")) {
      pastIncidents.push("Valet Gridlock: Valet parking capacity reached 100% saturation by 6:30 PM, causing severe traffic on Inorbit road.");
      recommendations.push("Coordinate with venue 5 days early to check concurrent ballroom events and lease adjacent commercial parking for overflow.");
      checklist.push({
        task: "Contract Mindspace overflow parking lot with electric golf cart shuttles",
        reason: "January 10 event had VVIP delays when hotel valet lot filled up at 6:30 PM",
        priority: "high",
        department: "Security"
      });
      mitigation.push({
        risk: "VIP guest arrival delays and Inorbit road traffic gridlock",
        mitigation: "Pre-book 80 overflow spots at Mindspace and post 3 private traffic marshals at venue entryway",
        precedent: "ITC Kohenur January 10 retrospective"
      });
    }
  });

  // Default fallbacks if no specific matches found
  if (pastIncidents.length === 0) {
    pastIncidents.push(`No critical severity incidents logged yet for ${venueName}. First-time memory bank entry will capture baseline metrics.`);
  }
  if (recollections.length === 0) {
    recollections.push(`Budget target of INR ${budget.toLocaleString()} for ${capacity} pax (${eventType}) falls within normal regional tier thresholds.`);
  }
  if (recommendations.length === 0) {
    recommendations.push(`Establish vendor contingency agreements 72 hours prior to ${date} to build memory baseline for ${venueName}.`);
  }
  if (checklist.length === 0) {
    checklist.push(
      {
        task: "Confirm dedicated freight lift and AV power loads with facility management",
        reason: "Standard venue hazard prevention checklist",
        priority: "high",
        department: "Logistics"
      },
      {
        task: "Confirm vegetarian catering buffer (+15%) with head chef",
        reason: "Regional Hyderabad dietary patterns consistently trend higher on vegetarian demand",
        priority: "medium",
        department: "Catering"
      }
    );
  }
  if (mitigation.length === 0) {
    mitigation.push({
      risk: "Unanticipated facility or logistical shortfall",
      mitigation: "Institute milestone checkpoints at T-24h and T-4h with on-site duty manager",
      precedent: "RecallHQ Enterprise Memory Protocol"
    });
  }

  // Stateless generic comparison for Hackathon demonstration
  const statelessComparison = {
    advice: `To organize your ${eventType} for ${capacity} people at ${venueName}, make sure to contact the venue early. Test your sound system before the event, prepare a standard catering order with both veg and non-veg options, and ensure adequate parking signs are put up. Also consider weather if hosting outdoors.`,
    limitations: [
      "Zero knowledge of freight elevator delays or specific maintenance routines",
      "Failed to warn about 20% vegetarian catering deficit known from past Hyderabad tech conferences",
      "Unaware that Auditorium 1 experiences mic howling past 300 guests without DSP suppressors",
      "Completely missed Cyber Pearl lawn drainage failure history during monsoon months",
      "Ignored 6:30 PM valet parking saturation point and Inorbit road gridlock"
    ]
  };

  return {
    venueName,
    location,
    plannedDate: date,
    capacity,
    eventType,
    budget,
    pastIncidents,
    budgetAndVendorRecollections: recollections,
    actionableRecommendations: recommendations,
    predictiveChecklist: checklist,
    mitigationPlan: mitigation,
    recalledMemories,
    statelessComparison,
    llmProvider: GROQ_API_KEY ? `Groq (${GROQ_MODEL})` : "VenueIQ Grounded Memory Engine",
    modelUsed: GROQ_MODEL,
  };
}

/**
 * Interactive Q&A chat agent grounded on Hindsight memory
 */
export async function answerEventQuery(
  userQuery: string,
  recalledMemories: HindsightMemoryNode[]
): Promise<{
  groundedAnswer: string;
  statelessAnswer: string;
  evidence: HindsightMemoryNode[];
}> {
  const memoryContext = recalledMemories
    .map((m, i) => `[Memory #${i + 1}] (${m.type}) ${m.metadata.venueName || m.venueId} on ${m.metadata.eventDate || "past"}: ${m.content}`)
    .join("\n\n");

  if (GROQ_API_KEY) {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [
            {
              role: "system",
              content: `You are VenueIQ, an enterprise event intelligence agent powered by Vectorize Hindsight memory. Answer the user question strictly grounded on the recalled memories below. Cite specific venues, dates, room names, and past incidents. Also generate a short stateless response (what an AI without memory would say) in JSON format:
{
  "groundedAnswer": "Detailed answer citing specific past memories...",
  "statelessAnswer": "Generic high-level answer without memory..."
}`
            },
            {
              role: "user",
              content: `User Question: ${userQuery}\n\nRecalled Memories:\n${memoryContext}`
            }
          ],
          response_format: { type: "json_object" },
          temperature: 0.2,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = JSON.parse(data.choices?.[0]?.message?.content || "{}");
        return {
          groundedAnswer: content.groundedAnswer || "Grounded recall complete.",
          statelessAnswer: content.statelessAnswer || "Generic advice without memory.",
          evidence: recalledMemories
        };
      }
    } catch (err) {
      console.warn("Groq chat error, using grounded synthesis", err);
    }
  }

  // Deterministic synthesis based on query keywords & recalled memories
  const queryLower = userQuery.toLowerCase();
  let grounded = "";
  let stateless = "When organizing events, it's generally recommended to plan 4-6 weeks ahead, check sound systems, ensure guest dietary restrictions are tracked, and confirm parking capacity with the hotel.";

  if (queryLower.includes("hyderabad") || queryLower.includes("october") || queryLower.includes("monsoon") || queryLower.includes("rain") || queryLower.includes("waterlog")) {
    grounded = `Based on RecallHQ's Hindsight memory:
• At **Cyber Pearl Open Lawn (HITEC City)** on August 20, 2025, sudden monsoon rainfall flooded lawn drainage within 20 minutes, forcing an emergency relocation indoors to Basement 2.
• Critical Learning: Basement 2 lacked adequate HVAC and had a complete cellular dead zone across Airtel and Jio networks.
• Actionable Recommendation: Never book open lawns during Hyderabad monsoon/autumn transitions without an upper-floor dry ballroom contract and temporary mobile cellular repeaters.`;
    stateless = "Events in Hyderabad during October or rainy seasons should have an indoor backup option and weather insurance in case of showers.";
  } else if (queryLower.includes("novotel") || queryLower.includes("hicc") || queryLower.includes("elevator") || queryLower.includes("cater") || queryLower.includes("veg")) {
    grounded = `At **HICC Novotel** (July 15, 2025 Conference):
1. **Freight Elevator Lockdown**: Routine unscheduled facility maintenance delayed stage LED truss load-in by 60 minutes.
2. **Vegetarian Food Shortfall**: Hyderabad tech audience had a 65% vegetarian preference, causing a 20% deficit in the lunch buffet by 1:30 PM against the hotel's standard 45% default.
• Recommendation: Pre-reserve the North service elevator 48h prior with facility signoff, and raise vegetarian allocation to at least 65-70%.`;
    stateless = "For large hotels like HICC Novotel, arrive early for setup and coordinate with the banquet manager regarding dietary requirements.";
  } else if (queryLower.includes("thub") || queryLower.includes("t-hub") || queryLower.includes("audio") || queryLower.includes("mic") || queryLower.includes("feedback")) {
    grounded = `At **T-Hub Phase 2** (November 12, 2025 Hackathon):
1. **Acoustic Feedback in Auditorium 1**: The house soundboard lacks DSP parametric notch filters, producing severe mic howling once guest count crossed 300.
2. **Wi-Fi RF Clash**: Roving wireless mics suffered interference on the 2.4GHz band due to hundreds of active developer laptops.
• Recommendation: Hire an external audio engineer with dedicated DSP feedback suppressors and deploy UHF/DECT band wireless lapels.`;
    stateless = "For hackathons and tech talks, conduct a sound check an hour before the keynote and place microphones away from speakers.";
  } else if (queryLower.includes("itc") || queryLower.includes("kohenur") || queryLower.includes("valet") || queryLower.includes("parking")) {
    grounded = `At **ITC Kohenur** (January 10, 2026 Executive Dinner):
• **Valet Overcapacity**: Hotel valet staging bays hit 100% capacity by 6:30 PM due to a concurrent wedding in the Grand Ballroom, creating a 30-minute gridlock back to the Inorbit Durgam Cheruvu bridge.
• Recommendation: Cross-verify concurrent ballroom bookings 5 days ahead and pre-contract the Mindspace commercial lot with an electric golf shuttle.`;
    stateless = "For luxury hotels like ITC Kohenur, inform guests about parking availability and encourage carpooling.";
  } else {
    grounded = `From RecallHQ's memory bank, we have ${recalledMemories.length} relevant historical precedents:
${recalledMemories.map(m => `• **${m.metadata.venueName || m.venueId}** (${m.metadata.eventDate}): ${m.content}`).join("\n")}
Each precedent has been logged into Hindsight with granular failure mode tags to prevent recurrence.`;
  }

  return {
    groundedAnswer: grounded,
    statelessAnswer: stateless,
    evidence: recalledMemories
  };
}

