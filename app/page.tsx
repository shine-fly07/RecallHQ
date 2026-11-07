"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import EventPlannerForm from "@/components/EventPlannerForm";
import MemoryInspector from "@/components/MemoryInspector";
import PastEventsTable from "@/components/PastEventsTable";
import InteractiveChat from "@/components/InteractiveChat";
import TimelineCalendar from "@/components/TimelineCalendar";
import VenueBriefingCard from "@/components/VenueBriefingCard";
import { VenueBriefing, EventRecord, HindsightMemoryNode } from "@/types";
import { 
  Brain, 
  Sparkles, 
  Building2, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Zap,
  RotateCcw
} from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>("planner");
  const [currentBriefing, setCurrentBriefing] = useState<VenueBriefing | null>(null);
  const [isPlanning, setIsPlanning] = useState<boolean>(false);
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [allMemories, setAllMemories] = useState<HindsightMemoryNode[]>([]);

  // Load initial events & memories
  const loadInitialData = async () => {
    try {
      const res = await fetch("/api/events");
      const data = await res.json();
      if (data.events) {
        setEvents(data.events);
      }

      const memRes = await fetch("/api/hindsight");
      const memData = await memRes.json();
      if (memData.memories) {
        setAllMemories(memData.memories);
      }
    } catch (err) {
      console.warn("Error loading data", err);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handlePlanGenerated = (briefing: VenueBriefing) => {
    setCurrentBriefing(briefing);
  };

  const handleSelectTimelineEvent = (event: EventRecord) => {
    // Switch to planner and preset values
    setActiveTab("planner");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-indigo-950/30 via-slate-900/60 to-slate-950/80 p-6 sm:p-8 backdrop-blur-2xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
                <Brain className="h-3.5 w-3.5" />
                Persistent Event Memory · Built for HackwithHyderabad 3.0
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                RecallHQ: The Headquarters for Your Event Memory
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed">
                VenueIQ uses Vectorize Hindsight persistent memory to remember past venue limitations, unannounced freight elevator lockouts, monsoon lawn floodings, acoustic feedbacks, and catering ratio disparities across Hyderabad.
              </p>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 gap-3 shrink-0">
              <div className="p-3.5 rounded-2xl border border-slate-800 bg-slate-900/80">
                <div className="text-xs text-slate-400">Memory Bank</div>
                <div className="mt-1 text-xl font-bold text-white flex items-center gap-1.5">
                  <span className="text-emerald-400 font-mono">{allMemories.length || 8}</span>
                  <span className="text-xs text-slate-400 font-normal">nodes</span>
                </div>
                <div className="text-[10px] text-indigo-400 mt-0.5">Vectorize Hindsight</div>
              </div>

              <div className="p-3.5 rounded-2xl border border-slate-800 bg-slate-900/80">
                <div className="text-xs text-slate-400">Precedent Scenarios</div>
                <div className="mt-1 text-xl font-bold text-white flex items-center gap-1.5">
                  <span className="text-indigo-400 font-mono">{events.length || 4}</span>
                  <span className="text-xs text-slate-400 font-normal">venues</span>
                </div>
                <div className="text-[10px] text-emerald-400 mt-0.5">100% Grounded</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab 1: Briefing & Planner */}
        {activeTab === "planner" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5">
                <EventPlannerForm 
                  onPlanGenerated={handlePlanGenerated} 
                  onPlanningStateChange={setIsPlanning}
                />
              </div>

              <div className="lg:col-span-7">
                {currentBriefing ? (
                  <VenueBriefingCard 
                    briefing={currentBriefing} 
                    onOpenInspector={() => setActiveTab("inspector")}
                  />
                ) : (
                  <div className="h-full flex flex-col justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-8 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800/80 text-indigo-400">
                      <Sparkles className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-slate-200">No Briefing Generated Yet</h3>
                    <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
                      Select one of the Hyderabad hackathon presets on the left or enter your event details to trigger Hindsight memory recall.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Embedded Live Memory Inspector directly underneath */}
            <div className="pt-4">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">Live Memory Inspector</h3>
                  <p className="text-xs text-slate-400">
                    Inspecting real-time Vectorize Hindsight semantic graph nodes and comparing with stateless agent.
                  </p>
                </div>
              </div>
              <MemoryInspector 
                briefing={currentBriefing}
                recalledMemories={allMemories}
                isPlanning={isPlanning}
              />
            </div>
          </div>
        )}

        {/* Tab 2: Memory Inspector (Showpiece Full Page) */}
        {activeTab === "inspector" && (
          <div className="space-y-6">
            <MemoryInspector 
              briefing={currentBriefing} 
              recalledMemories={allMemories} 
              isPlanning={isPlanning} 
            />
          </div>
        )}

        {/* Tab 3: Retrospective Memory Bank */}
        {activeTab === "events" && (
          <div className="space-y-6">
            <PastEventsTable onEventLogged={loadInitialData} />
          </div>
        )}

        {/* Tab 4: Interactive Q&A Agent */}
        {activeTab === "chat" && (
          <div className="space-y-6">
            <InteractiveChat />
          </div>
        )}

        {/* Tab 5: Seasonal Heatmap */}
        {activeTab === "timeline" && (
          <div className="space-y-6">
            <TimelineCalendar 
              events={events} 
              onSelectEvent={handleSelectTimelineEvent} 
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            RecallHQ · The headquarters for your event memory · Built for <span className="text-slate-300 font-medium">HackwithHyderabad 3.0</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Powered by <strong className="text-indigo-400">Vectorize Hindsight</strong></span>
            <span>•</span>
            <span>Inference by <strong className="text-amber-400">Groq API</strong></span>
          </div>
        </div>
      </footer>
    </div>
  );
}

