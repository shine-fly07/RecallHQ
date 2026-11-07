"use client";

import React, { useState } from "react";
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Filter, 
  ChevronRight, 
  CloudRain, 
  Sun, 
  Snowflake, 
  Flame,
  Clock,
  Sparkles
} from "lucide-react";
import { EventRecord } from "@/types";

interface TimelineCalendarProps {
  events: EventRecord[];
  onSelectEvent?: (event: EventRecord) => void;
}

export default function TimelineCalendar({ events, onSelectEvent }: TimelineCalendarProps) {
  const [selectedSeason, setSelectedSeason] = useState<string>("All");
  const [selectedVenue, setSelectedVenue] = useState<string>("All");

  const seasons = ["All", "Monsoon", "Winter", "Summer", "Autumn"];
  const venues = ["All", "HICC Novotel", "T-Hub Phase 2", "Cyber Pearl Open Lawn", "ITC Kohenur"];

  const filteredEvents = events.filter(e => {
    const matchSeason = selectedSeason === "All" || e.season === selectedSeason;
    const matchVenue = selectedVenue === "All" || e.venueName.toLowerCase().includes(selectedVenue.toLowerCase());
    return matchSeason && matchVenue;
  });

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur-xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-indigo-400" />
            <h2 className="text-base font-semibold text-white">Timeline & Seasonal Memory Heatmap</h2>
          </div>
          <p className="text-xs text-slate-400">
            Historical dates and venues tagged with memory badges and environmental constraints.
          </p>
        </div>

        {/* Season Badges */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {seasons.map(s => (
            <button
              key={s}
              onClick={() => setSelectedSeason(s)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedSeason === s
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              {s === "Monsoon" && <CloudRain className="h-3 w-3 inline mr-1 text-sky-400" />}
              {s === "Winter" && <Snowflake className="h-3 w-3 inline mr-1 text-indigo-300" />}
              {s === "Summer" && <Sun className="h-3 w-3 inline mr-1 text-amber-400" />}
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Seasonal Insights Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl border border-sky-500/20 bg-sky-950/20 text-xs">
          <div className="flex items-center gap-2 font-semibold text-sky-300 mb-1">
            <CloudRain className="h-4 w-4 text-sky-400" />
            Monsoon Warning (July - Sept)
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            High risk of turf waterlogging at outdoor locations (Cyber Pearl Open Lawn). Mandatory indoor backup required.
          </p>
        </div>

        <div className="p-3.5 rounded-xl border border-indigo-500/20 bg-indigo-950/20 text-xs">
          <div className="flex items-center gap-2 font-semibold text-indigo-300 mb-1">
            <Snowflake className="h-4 w-4 text-indigo-400" />
            Winter Peak Season (Nov - Jan)
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            High conference density at T-Hub and concurrent luxury wedding peak at ITC Kohenur causes valet saturation by 6:30 PM.
          </p>
        </div>

        <div className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-950/20 text-xs">
          <div className="flex items-center gap-2 font-semibold text-amber-300 mb-1">
            <Flame className="h-4 w-4 text-amber-400" />
            Tech Demographics Ratio
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Tech conferences in HITEC City average 65% vegetarian food demand. Hotel standard 45% default causes 20% deficit.
          </p>
        </div>
      </div>

      {/* Events Timeline Cards */}
      <div className="space-y-3">
        <h3 className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
          Recorded Event Nodes ({filteredEvents.length}):
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEvents.map((evt) => {
            const hasIssue = evt.incidents && evt.incidents.length > 0;
            return (
              <div
                key={evt.id}
                onClick={() => onSelectEvent && onSelectEvent(evt)}
                className="group cursor-pointer rounded-xl border border-slate-800 bg-slate-950/60 p-4 transition-all hover:border-indigo-500/50 hover:bg-slate-900"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400">
                      {evt.date} · {evt.season}
                    </span>
                    <h4 className="text-sm font-semibold text-white group-hover:text-indigo-200 transition-colors">
                      {evt.venueName}
                    </h4>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3 text-slate-500" />
                      {evt.location}
                    </span>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium border flex items-center gap-1 shrink-0 ${
                    hasIssue 
                      ? "bg-rose-500/10 text-rose-300 border-rose-500/20"
                      : "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                  }`}>
                    {hasIssue ? (
                      <>
                        <AlertTriangle className="h-3 w-3 text-rose-400" />
                        {evt.incidents.length} Issue{evt.incidents.length > 1 ? "s" : ""} Recorded
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                        Execution Verified
                      </>
                    )}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs text-slate-300">
                  <p className="line-clamp-2 leading-relaxed">
                    {evt.retrospectiveNotes}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Capacity: {evt.capacity} pax</span>
                  <span className="text-indigo-400 group-hover:underline flex items-center gap-1">
                    Inspect memory node <ChevronRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

