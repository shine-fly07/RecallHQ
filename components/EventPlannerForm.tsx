"use client";

import React, { useState } from "react";
import { 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign, 
  FileText, 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle,
  Building2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap
} from "lucide-react";
import { VenueBriefing } from "@/types";

interface EventPlannerFormProps {
  onPlanGenerated: (briefing: VenueBriefing) => void;
  onPlanningStateChange?: (isPlanning: boolean) => void;
}

const PRESETS = [
  {
    label: "Cyber Pearl Meetup (Monsoon/Oct)",
    venueName: "Cyber Pearl Open Lawn",
    location: "HITEC City, Madhapur, Hyderabad",
    date: "2026-10-14",
    capacity: 200,
    eventType: "Meetup",
    budget: 450000,
    notes: "Planning a 200-person evening developer meetup with dinner and lighting talks."
  },
  {
    label: "T-Hub Hackathon (Winter/Nov)",
    venueName: "T-Hub Phase 2",
    location: "Knowledge City, Raidurg, Hyderabad",
    date: "2026-11-12",
    capacity: 350,
    eventType: "Hackathon",
    budget: 850000,
    notes: "Hackathon with live keynote and 350 active laptops in Auditorium 1."
  },
  {
    label: "HICC Novotel Summit (Monsoon/July)",
    venueName: "HICC Novotel",
    location: "HITEC City, Hyderabad",
    date: "2026-07-15",
    capacity: 650,
    eventType: "Conference",
    budget: 1800000,
    notes: "Annual technology leadership conference with heavy stage LED truss rig."
  },
  {
    label: "ITC Kohenur Banquet (Winter/Jan)",
    venueName: "ITC Kohenur",
    location: "HITEC City, Durgam Cheruvu Lake, Hyderabad",
    date: "2027-01-10",
    capacity: 400,
    eventType: "Executive Dinner",
    budget: 2500000,
    notes: "High-profile VIP investor dinner running concurrently with other hotel events."
  }
];

export default function EventPlannerForm({ 
  onPlanGenerated, 
  onPlanningStateChange 
}: EventPlannerFormProps) {
  const [venueName, setVenueName] = useState(PRESETS[0].venueName);
  const [location, setLocation] = useState(PRESETS[0].location);
  const [date, setDate] = useState(PRESETS[0].date);
  const [capacity, setCapacity] = useState(PRESETS[0].capacity);
  const [eventType, setEventType] = useState(PRESETS[0].eventType);
  const [budget, setBudget] = useState(PRESETS[0].budget);
  const [notes, setNotes] = useState(PRESETS[0].notes);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApplyPreset = (preset: typeof PRESETS[0]) => {
    setVenueName(preset.venueName);
    setLocation(preset.location);
    setDate(preset.date);
    setCapacity(preset.capacity);
    setEventType(preset.eventType);
    setBudget(preset.budget);
    setNotes(preset.notes);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    if (onPlanningStateChange) onPlanningStateChange(true);

    try {
      const response = await fetch("/api/plan-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          venueName,
          location,
          date,
          capacity,
          eventType,
          budget,
          notes,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate venue briefing.");
      }

      onPlanGenerated(data.data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
      if (onPlanningStateChange) onPlanningStateChange(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur-xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-white">Contextual Recall & Planner</h2>
            <span className="flex h-2 w-2 rounded-full bg-emerald-400"></span>
          </div>
          <p className="text-xs text-slate-400">
            Query Hindsight memory to predict logistical bottlenecks before signing venue contracts.
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-500/10 px-2.5 py-1 text-xs font-medium text-indigo-300 border border-indigo-500/20">
          <Zap className="h-3.5 w-3.5 text-indigo-400" /> Auto-Recall Active
        </span>
      </div>

      {/* Quick Presets */}
      <div className="mt-4">
        <label className="text-[11px] font-medium uppercase tracking-wider text-slate-400 mb-1.5 block">
          Quick Demo Presets (Hyderabad Hackathon Venues):
        </label>
        <div className="grid grid-cols-2 gap-2">
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(p)}
              className="text-left p-2.5 rounded-lg border border-slate-800 bg-slate-950/60 hover:border-indigo-500/50 hover:bg-slate-900 transition-all text-xs"
            >
              <div className="font-medium text-slate-200 truncate">{p.label}</div>
              <div className="text-[11px] text-slate-400 truncate mt-0.5">
                {p.venueName} · {p.capacity} pax
              </div>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5 mb-1">
              <Building2 className="h-3.5 w-3.5 text-indigo-400" />
              Venue Name
            </label>
            <input
              type="text"
              required
              value={venueName}
              onChange={(e) => setVenueName(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950/80 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="e.g. Cyber Pearl Open Lawn"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5 mb-1">
              <MapPin className="h-3.5 w-3.5 text-indigo-400" />
              Location / City
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950/80 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="e.g. HITEC City, Hyderabad"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5 mb-1">
              <Calendar className="h-3.5 w-3.5 text-indigo-400" />
              Target Date
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950/80 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5 mb-1">
              <Users className="h-3.5 w-3.5 text-indigo-400" />
              Capacity (Pax)
            </label>
            <input
              type="number"
              min="10"
              max="10000"
              required
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-800 bg-slate-950/80 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5 mb-1">
              <DollarSign className="h-3.5 w-3.5 text-indigo-400" />
              Budget (INR)
            </label>
            <input
              type="number"
              step="50000"
              min="50000"
              required
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-800 bg-slate-950/80 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5 mb-1">
            <FileText className="h-3.5 w-3.5 text-indigo-400" />
            Special Notes / Context for Agent
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-950/80 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
            placeholder="e.g. Planning a 200-person tech meetup at Cyber Pearl on Oct 14"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-500 hover:to-violet-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 transition-all cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-white" />
              <span>Querying Vectorize Hindsight & Groq LLM...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 text-indigo-200" />
              <span>Generate Intelligent Venue Briefing with Hindsight</span>
              <ArrowRight className="h-3.5 w-3.5 text-indigo-200" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

