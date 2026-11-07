"use client";

import React from "react";
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck, 
  Brain, 
  ArrowRight,
  ListTodo,
  FileCheck
} from "lucide-react";
import { VenueBriefing } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface VenueBriefingCardProps {
  briefing: VenueBriefing;
  onOpenInspector: () => void;
}

export default function VenueBriefingCard({ briefing, onOpenInspector }: VenueBriefingCardProps) {
  return (
    <div className="rounded-2xl border border-indigo-500/30 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-xl space-y-6">
      {/* Briefing Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
              ● Briefing Synthesized
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Grounding: {briefing.recalledMemories.length} Hindsight Precedents
            </span>
          </div>
          <h2 className="mt-2 text-xl font-bold text-white flex items-center gap-2">
            <Building2 className="h-5 w-5 text-indigo-400" />
            {briefing.venueName}
          </h2>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-slate-500" />
              {briefing.location}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-slate-500" />
              {briefing.plannedDate}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5 text-slate-500" />
              {briefing.capacity} pax ({briefing.eventType})
            </span>
            <span>•</span>
            <span>Budget: {formatCurrency(briefing.budget)}</span>
          </div>
        </div>

        <button
          onClick={onOpenInspector}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
        >
          <Brain className="h-4 w-4" />
          <span>Inspect Hindsight Memory Trace</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Grid of Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Past Incidents & Watchouts */}
        <div className="rounded-xl border border-rose-500/20 bg-rose-950/10 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-300 uppercase tracking-wider mb-3">
            <AlertTriangle className="h-4 w-4 text-rose-400" />
            Past Incidents & Watchouts (Learned from Memory)
          </div>
          <div className="space-y-2">
            {briefing.pastIncidents.map((inc, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-slate-200">
                <span className="text-rose-400 font-bold shrink-0 mt-0.5">•</span>
                <span className="leading-relaxed">{inc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actionable Recommendations */}
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/10 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-3">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            Actionable Recommendations
          </div>
          <div className="space-y-2">
            {briefing.actionableRecommendations.map((rec, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-slate-200">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{rec}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Budget & Vendor Recollections */}
      {briefing.budgetAndVendorRecollections.length > 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-indigo-400" />
            Budget & Vendor Recollections
          </div>
          <div className="space-y-1.5">
            {briefing.budgetAndVendorRecollections.map((item, i) => (
              <p key={i} className="text-xs text-slate-300 leading-relaxed">
                {item}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Predictive Checklist */}
      {briefing.predictiveChecklist && briefing.predictiveChecklist.length > 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs uppercase font-semibold text-white tracking-wider flex items-center gap-2">
              <ListTodo className="h-4 w-4 text-indigo-400" />
              Predictive Logistical Checklist (Mitigating Past Failures)
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">
              {briefing.predictiveChecklist.length} action items
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {briefing.predictiveChecklist.map((item, idx) => (
              <div key={idx} className="p-3 rounded-lg border border-slate-800 bg-slate-900/90 flex items-start gap-2.5">
                <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded border shrink-0 mt-0.5 ${
                  item.priority === "high" 
                    ? "bg-rose-500/10 text-rose-400 border-rose-500/20" 
                    : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                }`}>
                  {item.priority}
                </span>
                <div>
                  <div className="text-xs font-medium text-white">{item.task}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    <span className="text-indigo-400 font-medium">Precedent Reason:</span> {item.reason}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-mono">
                    Owner: {item.department}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mitigation Plan with Precedent Citations */}
      {briefing.mitigationPlan && briefing.mitigationPlan.length > 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-5">
          <div className="text-xs uppercase font-semibold text-white tracking-wider mb-3 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            Risk Mitigation Protocol with Precedent Citations
          </div>

          <div className="space-y-2.5">
            {briefing.mitigationPlan.map((m, idx) => (
              <div key={idx} className="p-3 rounded-lg border border-slate-800/80 bg-slate-900/60 text-xs">
                <div className="flex items-center justify-between text-slate-200 font-medium">
                  <span className="text-rose-300 font-semibold">Risk: {m.risk}</span>
                  <span className="text-[10px] text-indigo-400 font-mono">Ref: {m.precedent}</span>
                </div>
                <div className="mt-1 text-slate-300 flex items-start gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong className="text-emerald-400">Mitigation:</strong> {m.mitigation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

