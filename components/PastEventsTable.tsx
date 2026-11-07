"use client";

import React, { useState, useEffect } from "react";
import { 
  Database, 
  Plus, 
  RotateCcw, 
  Calendar, 
  MapPin, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  Brain,
  Sparkles,
  Loader2,
  DollarSign
} from "lucide-react";
import { EventRecord } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface PastEventsTableProps {
  onEventLogged?: () => void;
}

export default function PastEventsTable({ onEventLogged }: PastEventsTableProps) {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>("evt_hicc_2025_07_15");
  const [showLogModal, setShowLogModal] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // New Retrospective Form State
  const [newVenueName, setNewVenueName] = useState("");
  const [newLocation, setNewLocation] = useState("Hyderabad");
  const [newDate, setNewDate] = useState("2026-03-25");
  const [newCapacity, setNewCapacity] = useState(300);
  const [newEventType, setNewEventType] = useState<EventRecord["eventType"]>("Conference");
  const [newBudget, setNewBudget] = useState(1200000);
  const [newRetroNotes, setNewRetroNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/events");
      const data = await res.json();
      if (data.events) {
        setEvents(data.events);
      }
    } catch (err) {
      console.error("Failed to load events", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleResetSeed = async () => {
    try {
      setIsResetting(true);
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset_seed" }),
      });
      const data = await res.json();
      if (data.events) {
        setEvents(data.events);
        setStatusMessage("Reset to 4 canonical HackwithHyderabad seed events & Hindsight nodes.");
        setTimeout(() => setStatusMessage(null), 4000);
        if (onEventLogged) onEventLogged();
      }
    } catch (err) {
      console.error("Failed to reset seed", err);
    } finally {
      setIsResetting(false);
    }
  };

  const handleLogRetrospective = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVenueName || !newDate || !newRetroNotes) return;

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/ingest-retrospective", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          venueName: newVenueName,
          location: newLocation,
          date: newDate,
          capacity: newCapacity,
          eventType: newEventType,
          budget: newBudget,
          retrospectiveNotes: newRetroNotes,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatusMessage(`Successfully committed retrospective to Hindsight (Node: ${data.memoryNode.id})`);
        setShowLogModal(false);
        setNewVenueName("");
        setNewRetroNotes("");
        await fetchEvents();
        if (onEventLogged) onEventLogged();
        setTimeout(() => setStatusMessage(null), 5000);
      }
    } catch (err) {
      console.error("Failed to log retrospective", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 shadow-xl backdrop-blur-xl overflow-hidden">
      {/* Table Header */}
      <div className="border-b border-slate-800 bg-slate-950/60 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-indigo-400" />
            <h2 className="text-base font-semibold text-white">Event Retrospective Memory Bank</h2>
            <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs font-mono text-slate-300">
              {events.length} Records
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Historical retrospectives ingested and indexed in Vectorize Hindsight memory.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetSeed}
            disabled={isResetting}
            title="Reset to 4 canonical seed events"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium transition-all"
          >
            <RotateCcw className={`h-3.5 w-3.5 ${isResetting ? "animate-spin text-indigo-400" : ""}`} />
            Reset Seed Data
          </button>
          <button
            onClick={() => setShowLogModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Ingest Retrospective
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="bg-emerald-950/40 border-b border-emerald-500/20 px-6 py-2.5 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Modal for Ingesting Retrospective */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-indigo-400" />
                <h3 className="text-sm font-semibold text-white">Log Event Retrospective into Hindsight</h3>
              </div>
              <button
                onClick={() => setShowLogModal(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleLogRetrospective} className="mt-4 space-y-3">
              <div>
                <label className="text-xs text-slate-300 mb-1 block">Venue Name</label>
                <input
                  type="text"
                  required
                  value={newVenueName}
                  onChange={(e) => setNewVenueName(e.target.value)}
                  placeholder="e.g. HICC Novotel or T-Hub Phase 2"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 mb-1 block">City / Area</label>
                  <input
                    type="text"
                    required
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 mb-1 block">Event Date</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-slate-300 mb-1 block">Capacity</label>
                  <input
                    type="number"
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 mb-1 block">Type</label>
                  <select
                    value={newEventType}
                    onChange={(e) => setNewEventType(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-2 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Conference">Conference</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Meetup">Meetup</option>
                    <option value="Executive Dinner">Executive Dinner</option>
                    <option value="Product Launch">Product Launch</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-300 mb-1 block">Budget (INR)</label>
                  <input
                    type="number"
                    value={newBudget}
                    onChange={(e) => setNewBudget(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 mb-1 block">
                  Post-Event Retrospective & Failure Incidents (What happened?)
                </label>
                <textarea
                  rows={3}
                  required
                  value={newRetroNotes}
                  onChange={(e) => setNewRetroNotes(e.target.value)}
                  placeholder="Document precise failure points: e.g. Sound acoustic feedback in Auditorium 1, freight elevator servicing delay, or vegetarian catering shortfall..."
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-800 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Retaining in Hindsight...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5" />
                      Commit to Hindsight Memory
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Events List / Table */}
      {isLoading ? (
        <div className="p-8 text-center text-xs text-slate-400">Loading historical event records...</div>
      ) : events.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-400">No events found. Click "Reset Seed Data" to load scenarios.</div>
      ) : (
        <div className="divide-y divide-slate-800/80">
          {events.map((event) => {
            const isExpanded = expandedId === event.id;
            const seasonColor = 
              event.season === "Monsoon" ? "bg-sky-500/10 text-sky-400 border-sky-500/20" :
              event.season === "Winter" ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" :
              "bg-amber-500/10 text-amber-400 border-amber-500/20";

            return (
              <div key={event.id} className="transition-colors hover:bg-slate-950/30">
                <div 
                  onClick={() => setExpandedId(isExpanded ? null : event.id)}
                  className="px-6 py-4 flex flex-wrap items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-indigo-400">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-semibold text-white">{event.venueName}</h3>
                        <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium border ${seasonColor}`}>
                          {event.season} Season
                        </span>
                        <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-medium text-slate-300">
                          {event.eventType}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-slate-500" />
                          {event.location}
                        </span>
                        <span>•</span>
                        <span>{event.date}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3 text-slate-500" />
                          {event.capacity} pax
                        </span>
                        <span>•</span>
                        <span>{formatCurrency(event.budget)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1 rounded bg-indigo-500/10 px-2 py-0.5 text-[11px] font-mono text-indigo-300 border border-indigo-500/20">
                      <Brain className="h-3 w-3 text-indigo-400" />
                      Hindsight Synced
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Retrospective Accordion */}
                {isExpanded && (
                  <div className="px-6 pb-5 pt-1 bg-slate-950/50 border-t border-slate-900 space-y-3">
                    <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/80">
                      <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-1">
                        Post-Event Retrospective & Observed Failure Modes:
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed">
                        {event.retrospectiveNotes}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-lg border border-rose-500/20 bg-rose-950/10">
                        <span className="text-[11px] font-semibold text-rose-300 flex items-center gap-1 mb-1.5">
                          <AlertCircle className="h-3.5 w-3.5 text-rose-400" />
                          Documented Incidents:
                        </span>
                        <ul className="space-y-1 text-slate-300 text-[11px]">
                          {event.incidents.map((inc, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-rose-400 mt-0.5">•</span>
                              <span>{inc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-950/10">
                        <span className="text-[11px] font-semibold text-emerald-300 flex items-center gap-1 mb-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                          Hindsight Mitigation Insights:
                        </span>
                        <ul className="space-y-1 text-slate-300 text-[11px]">
                          {event.insights.map((ins, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-emerald-400 mt-0.5">•</span>
                              <span>{ins}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

