import fs from "fs";
import path from "path";
import { EventRecord } from "@/types";
import { getSeasonFromDate } from "./utils";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "events.json");

export const SEED_EVENTS: EventRecord[] = [
  {
    id: "evt_hicc_2025_07_15",
    venueId: "venue_hicc_novotel",
    venueName: "HICC Novotel",
    location: "HITEC City, Hyderabad",
    date: "2025-07-15",
    season: "Monsoon",
    capacity: 650,
    eventType: "Conference",
    budget: 1800000,
    actualSpend: 1950000,
    retrospectiveNotes: "Freight elevator delay caused 1-hour delay for stage setup; catering ran 20% short on vegetarian options during lunch peak.",
    incidents: [
      "Freight elevator service maintenance without notice caused a 60-minute delay for main stage LED truss setup.",
      "Catering vegetarian buffet was exhausted by 1:30 PM due to higher than projected vegetarian attendance (65% actual vs 45% projected)."
    ],
    insights: [
      "Always reserve the dedicated North freight elevator 48 hours prior and obtain direct phone number of facility technician.",
      "For Hyderabad tech conferences, bump vegetarian food allocation to at least 65-70% ratio."
    ],
    status: "completed",
    hindsightMemoryId: "hs_mem_hicc_001",
    createdAt: "2025-07-16T10:00:00.000Z"
  },
  {
    id: "evt_thub_2025_11_12",
    venueId: "venue_thub_p2",
    venueName: "T-Hub Phase 2",
    location: "Knowledge City, Raidurg, Hyderabad",
    date: "2025-11-12",
    season: "Winter",
    capacity: 350,
    eventType: "Hackathon",
    budget: 850000,
    actualSpend: 820000,
    retrospectiveNotes: "AV mic feedback in Auditorium 1 when over 300 guests attend; solved by hiring external sound technician with feedback suppressors.",
    incidents: [
      "Auditorium 1 house soundboard experienced severe acoustic feedback loop once seating occupancy exceeded 300.",
      "Audience Q&A roving wireless mics picked up interference from guest Wi-Fi access points."
    ],
    insights: [
      "In-house soundboard lacks notch filters; must hire third-party audio engineer with hardware DSP suppressors for >250 attendees.",
      "Auditorium 1 acoustics improve significantly when stage carpeting and foam baffles are installed."
    ],
    status: "completed",
    hindsightMemoryId: "hs_mem_thub_002",
    createdAt: "2025-11-13T09:30:00.000Z"
  },
  {
    id: "evt_cyberpearl_2025_08_20",
    venueId: "venue_cyberpearl_lawn",
    venueName: "Cyber Pearl Open Lawn",
    location: "HITEC City, Madhapur, Hyderabad",
    date: "2025-08-20",
    season: "Monsoon",
    capacity: 220,
    eventType: "Meetup",
    budget: 450000,
    actualSpend: 540000,
    retrospectiveNotes: "Monsoon rain waterlogged the lawn; had to move indoors to Basement 2 with poor ventilation and zero cell reception.",
    incidents: [
      "Sudden 4:00 PM downpour flooded the lawn drainage channels within 20 minutes.",
      "Emergency shift to indoor Basement 2 resulted in suffocating humidity, HVAC failure, and complete cellular signal loss for attendees."
    ],
    insights: [
      "Never book Cyber Pearl open lawn between July 1 and September 15 without a pre-contracted weather marquee or guaranteed upper-floor backup hall.",
      "Basement 2 requires temporary 4G/5G repeater boxes and industrial pedestal fans if utilized as backup."
    ],
    status: "completed",
    hindsightMemoryId: "hs_mem_cyberpearl_003",
    createdAt: "2025-08-21T11:15:00.000Z"
  },
  {
    id: "evt_itc_2026_01_10",
    venueId: "venue_itc_kohenur",
    venueName: "ITC Kohenur",
    location: "HITEC City, Durgam Cheruvu Lake, Hyderabad",
    date: "2026-01-10",
    season: "Winter",
    capacity: 400,
    eventType: "Executive Dinner",
    budget: 2500000,
    actualSpend: 2480000,
    retrospectiveNotes: "Smooth execution, but valet parking reached maximum capacity by 6:30 PM causing a 30-minute gridlock on Inorbit Mall road.",
    incidents: [
      "Valet staging bays filled up at 6:30 PM due to concurrent wedding in Grand Ballroom.",
      "VVIP delegates arrived late because traffic backed up to Inorbit Durgam Cheruvu bridge."
    ],
    insights: [
      "Coordinate with hotel management 5 days early to cross-verify other banquet hall bookings.",
      "Contract the adjacent Mindspace commercial parking lot for overflow self-parking with an electric golf cart shuttle."
    ],
    status: "completed",
    hindsightMemoryId: "hs_mem_itc_004",
    createdAt: "2026-01-11T14:00:00.000Z"
  }
];

let memoryEvents: EventRecord[] = [...SEED_EVENTS];

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    console.warn("Could not create data dir, using in-memory store", err);
  }
}

export function getEvents(): EventRecord[] {
  ensureDataDir();
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryEvents = parsed;
        return parsed;
      }
    }
    // If not existing, write seed events
    fs.writeFileSync(DB_FILE, JSON.stringify(SEED_EVENTS, null, 2), "utf-8");
  } catch (err) {
    console.warn("Error reading DB file, returning in-memory events", err);
  }
  return memoryEvents;
}

export function saveEvent(event: Omit<EventRecord, "id" | "createdAt" | "season"> & { id?: string; season?: EventRecord["season"] }): EventRecord {
  const currentEvents = getEvents();
  const season = event.season || getSeasonFromDate(event.date);
  
  const newRecord: EventRecord = {
    ...event,
    id: event.id || `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    season,
    createdAt: new Date().toISOString(),
    incidents: event.incidents && event.incidents.length > 0 
      ? event.incidents 
      : (event.retrospectiveNotes ? [event.retrospectiveNotes] : []),
    insights: event.insights && event.insights.length > 0
      ? event.insights
      : ["Captured from retrospective log"]
  };

  currentEvents.unshift(newRecord);
  memoryEvents = currentEvents;

  ensureDataDir();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(currentEvents, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not save to file, updated in memory only", err);
  }

  return newRecord;
}

export function resetToSeedEvents(): EventRecord[] {
  memoryEvents = [...SEED_EVENTS];
  ensureDataDir();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(SEED_EVENTS, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not rewrite seed events to file", err);
  }
  return memoryEvents;
}

export function findEventById(id: string): EventRecord | undefined {
  const events = getEvents();
  return events.find(e => e.id === id);
}

export function findEventsByVenue(venueNameOrId: string): EventRecord[] {
  const events = getEvents();
  const lower = venueNameOrId.toLowerCase();
  return events.filter(e => 
    e.venueId.toLowerCase().includes(lower) || 
    e.venueName.toLowerCase().includes(lower)
  );
}

