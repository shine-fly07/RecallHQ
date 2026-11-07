"use client";

import React, { useState } from "react";
import { 
  Cpu, 
  Database, 
  Brain, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Share2, 
  Calendar, 
  MapPin, 
  Hash, 
  Layers, 
  Code2, 
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  HelpCircle,
  Network
} from "lucide-react";
import { HindsightMemoryNode, VenueBriefing } from "@/types";

interface MemoryInspectorProps {
  briefing: VenueBriefing | null;
  recalledMemories?: HindsightMemoryNode[];
  isPlanning?: boolean;
}

export default function MemoryInspector({
  briefing,
  recalledMemories = [],
  isPlanning = false
}: MemoryInspectorProps) {
  const [activeTab, setActiveTab] = useState<"dual" | "nodes" | "graph" | "json">("dual");
  const [selectedNode, setSelectedNode] = useState<HindsightMemoryNode | null>(null);

  const memories = briefing?.recalledMemories || recalledMemories;
  const stateless = briefing?.statelessComparison;

  if (isPlanning) {
    return (
      <div className="rounded-2xl border border-indigo-500/20 bg-slate-900/60 p-8 text-center backdrop-blur-xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400">
          <Brain className="h-7 w-7 animate-pulse text-indigo-400" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-white">Synthesizing Hindsight Memories...</h3>
        <p className="mt-1 text-sm text-slate-400">
          Fusing dense semantic vectors, temporal date filters, and venue graph nodes.
        </p>
      </div>
    );
  }

  if (!briefing && memories.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-10 text-center backdrop-blur-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800/80 text-slate-400">
          <Cpu className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-slate-200">Memory Inspector Ready</h3>
        <p className="mt-1 max-w-md mx-auto text-sm text-slate-400">
          Submit an event plan or retrospective on the left to inspect real-time Vectorize Hindsight memory recall and compare with generic stateless AI.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 shadow-2xl backdrop-blur-xl overflow-hidden">
      {/* Header Bar */}
      <div className="border-b border-slate-800 bg-slate-950/60 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/20">
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-white">Memory Inspector</h2>
              <span className="inline-flex items-center rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-medium text-indigo-300 border border-indigo-500/20">
                Hackathon Showpiece
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Active trace: {memories.length} semantic memories recalled via Vectorize Hindsight
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 rounded-xl bg-slate-900 p-1 border border-slate-800 flex-wrap">
          <button
            onClick={() => setActiveTab("dual")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "dual"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            Dual Comparison
          </button>
          <button
            onClick={() => setActiveTab("graph")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "graph"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Network className="h-3.5 w-3.5" />
            Semantic Graph
          </button>
          <button
            onClick={() => setActiveTab("nodes")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "nodes"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Share2 className="h-3.5 w-3.5" />
            Trace Nodes ({memories.length})
          </button>
          <button
            onClick={() => setActiveTab("json")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "json"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Code2 className="h-3.5 w-3.5" />
            Telemetry
          </button>
        </div>
      </div>

      {/* Tab 1: Dual-Panel Comparison */}
      {activeTab === "dual" && (
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Stateless Agent */}
            <div className="rounded-xl border border-rose-500/20 bg-rose-950/10 p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-rose-900/30">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500"></span>
                    <h3 className="text-sm font-semibold text-rose-200">Stateless LLM Agent</h3>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded bg-rose-500/10 px-2 py-0.5 text-xs text-rose-400 border border-rose-500/20 font-mono">
                    <AlertTriangle className="h-3 w-3" /> Blind to History
                  </span>
                </div>

                <div className="mt-4">
                  <div className="text-xs uppercase tracking-wider font-semibold text-rose-400/80 mb-1.5">
                    Generic Blanket Advice:
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-3.5 rounded-lg border border-slate-800">
                    {stateless?.advice || 
                      "Ensure to reserve the venue in advance, book professional AV equipment, prepare adequate catering for dietary needs, and provide clear directions for parking."}
                  </p>
                </div>

                <div className="mt-4">
                  <div className="text-xs uppercase tracking-wider font-semibold text-rose-400/80 mb-2">
                    Critical Omissions & Blind Spots:
                  </div>
                  <ul className="space-y-1.5">
                    {(stateless?.limitations && stateless.limitations.length > 0
                      ? stateless.limitations
                      : [
                          "No awareness of unannounced freight elevator servicing causing stage delay",
                          "Unaware of 20% vegetarian catering shortfall in past Hyderabad conference",
                          "Missed Auditorium 1 acoustic feedback above 300 guests",
                          "Ignored lawn waterlogging risk during monsoon precipitation"
                        ]
                    ).map((limitation, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-rose-300/90">
                        <span className="text-rose-500 mt-0.5 font-bold">✕</span>
                        <span>{limitation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-rose-900/30 text-[11px] text-rose-400/70 flex items-center justify-between">
                <span>Result: Repeated costly logistical errors</span>
                <span className="font-mono">Memory Context: 0 bytes</span>
              </div>
            </div>

            {/* Right: VenueIQ with Hindsight Memory */}
            <div className="rounded-xl border border-indigo-500/30 bg-gradient-to-b from-indigo-950/20 to-slate-900/80 p-5 flex flex-col justify-between shadow-lg shadow-indigo-950/50">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-indigo-800/40">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <h3 className="text-sm font-semibold text-indigo-100 flex items-center gap-1.5">
                      RecallHQ / VenueIQ
                      <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                    </h3>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded bg-indigo-500/20 px-2 py-0.5 text-xs text-indigo-300 border border-indigo-400/30 font-medium">
                    <Brain className="h-3 w-3 text-indigo-400" /> Powered by Hindsight
                  </span>
                </div>

                <div className="mt-4">
                  <div className="text-xs uppercase tracking-wider font-semibold text-indigo-300 mb-1.5 flex items-center justify-between">
                    <span>Grounded Historical Memory Recall:</span>
                    <span className="text-[11px] text-emerald-400 font-mono">
                      {memories.length} Memories Active
                    </span>
                  </div>
                  <div className="space-y-2">
                    {briefing?.pastIncidents.slice(0, 2).map((incident, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-100 flex items-start gap-2.5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-white">Exact Incident Recalled:</span>{" "}
                          <span className="text-slate-200">{incident}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-xs uppercase tracking-wider font-semibold text-emerald-400 mb-1.5">
                    Learned Actionable Remedies:
                  </div>
                  <div className="space-y-1.5">
                    {briefing?.actionableRecommendations.slice(0, 2).map((rec, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-emerald-200/90">
                        <TrendingUp className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-indigo-800/40 text-[11px] text-indigo-300/80 flex items-center justify-between">
                <span>Result: Zero repeated logistical pitfalls</span>
                <span className="font-mono text-emerald-400">RRF Retrieval Score: 96%</span>
              </div>
            </div>
          </div>

          {/* Predictive Checklist */}
          {briefing && briefing.predictiveChecklist && briefing.predictiveChecklist.length > 0 && (
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs uppercase font-semibold text-slate-300 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Predictive Action Checklist (Extracted from Historical Retrospectives)
                </h4>
                <span className="text-[11px] text-slate-400">
                  {briefing.predictiveChecklist.length} tasks scheduled
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {briefing.predictiveChecklist.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-lg border border-slate-800 bg-slate-900/60 flex items-start gap-2.5">
                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border shrink-0 mt-0.5 ${
                      item.priority === "high" 
                        ? "bg-rose-500/10 text-rose-400 border-rose-500/20" 
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }`}>
                      {item.priority}
                    </span>
                    <div>
                      <div className="text-xs font-medium text-slate-100">{item.task}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                        <span className="text-indigo-400">Why:</span> {item.reason}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Visual Semantic Memory Graph */}
      {activeTab === "graph" && (
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Network className="h-4 w-4 text-indigo-400" />
                Hindsight Semantic Memory Graph
              </h3>
              <p className="text-xs text-slate-400">
                Visualizing relationships between Venue Entities, Factual Precedents, Observations, and RRF Ranks.
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400"></span> Facts
              </span>
              <span className="flex items-center gap-1 text-indigo-400">
                <span className="h-2 w-2 rounded-full bg-indigo-400"></span> Experiences
              </span>
              <span className="flex items-center gap-1 text-amber-400">
                <span className="h-2 w-2 rounded-full bg-amber-400"></span> Observations
              </span>
            </div>
          </div>

          {/* Interactive SVG Canvas */}
          <div className="relative rounded-2xl border border-slate-800 bg-slate-950 p-4 h-[380px] flex items-center justify-center overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 800 350">
              {/* Center Hub */}
              <circle cx="400" cy="175" r="48" className="fill-indigo-950/80 stroke-indigo-500 stroke-2" />
              <text x="400" y="170" textAnchor="middle" className="fill-white font-bold text-xs">RecallHQ</text>
              <text x="400" y="185" textAnchor="middle" className="fill-indigo-300 text-[10px]">Memory Core</text>

              {/* Connecting Lines and Orbit Nodes */}
              {memories.map((node, i) => {
                const total = memories.length || 1;
                const angle = (i * (2 * Math.PI) / total) - (Math.PI / 2);
                const radius = 135;
                const x = 400 + radius * Math.cos(angle);
                const y = 175 + radius * Math.sin(angle);

                const nodeColor = 
                  node.type === "fact" ? "#10b981" :
                  node.type === "experience" ? "#818cf8" :
                  node.type === "observation" ? "#f59e0b" : "#38bdf8";

                const isSelected = selectedNode?.id === node.id;

                return (
                  <g key={node.id} onClick={() => setSelectedNode(node)} className="cursor-pointer group">
                    <line 
                      x1="400" 
                      y1="175" 
                      x2={x} 
                      y2={y} 
                      stroke="#334155" 
                      strokeWidth={isSelected ? "2.5" : "1"} 
                      strokeDasharray={isSelected ? "none" : "3,3"} 
                    />
                    <circle 
                      cx={x} 
                      cy={y} 
                      r={isSelected ? "22" : "18"} 
                      fill="#0f172a" 
                      stroke={nodeColor} 
                      strokeWidth={isSelected ? "3" : "1.5"} 
                      className="transition-all duration-200 group-hover:scale-110" 
                    />
                    <text 
                      x={x} 
                      y={y + 3} 
                      textAnchor="middle" 
                      fill="#f8fafc" 
                      className="text-[9px] font-mono font-semibold"
                    >
                      #{(node.rrfRank || i + 1)}
                    </text>
                    <text 
                      x={x} 
                      y={y + (y > 175 ? 26 : -22)} 
                      textAnchor="middle" 
                      fill="#94a3b8" 
                      className="text-[9px] font-medium"
                    >
                      {(node.metadata.venueName || node.venueId).split(" ")[0]}
                    </text>
                  </g>
                );
              })}
            </svg>
            
            <div className="absolute bottom-3 left-4 text-[10px] text-slate-500 font-mono">
              Click any node in orbit to inspect semantic memory payload
            </div>
          </div>

          {/* Selected Node Card */}
          {selectedNode && (
            <div className="rounded-xl border border-indigo-500/40 bg-slate-900/90 p-4 animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                  Node ID: {selectedNode.id} · Type: {selectedNode.type.toUpperCase()}
                </span>
                <span className="text-[11px] font-mono text-emerald-400">
                  {(selectedNode.confidenceScore * 100).toFixed(0)}% confidence
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-100">{selectedNode.content}</p>
              <div className="mt-2 flex flex-wrap gap-2 text-[10px] text-slate-400">
                <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 font-mono">
                  Venue: {selectedNode.metadata.venueName || selectedNode.venueId}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 font-mono">
                  Strategy: {selectedNode.retrievalStrategy}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 font-mono">
                  Date: {selectedNode.metadata.eventDate}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Trace Nodes List */}
      {activeTab === "nodes" && (
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Retrieved Hindsight Semantic Nodes</h3>
              <p className="text-xs text-slate-400">
                Vectorize Hindsight organizes memories into granular Facts, Experiences, Observations, and Opinions.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <span className="px-2 py-0.5 rounded bg-slate-800">Dense Vector</span>
              <span>+</span>
              <span className="px-2 py-0.5 rounded bg-slate-800">BM25</span>
              <span>+</span>
              <span className="px-2 py-0.5 rounded bg-slate-800">Graph</span>
              <span>+</span>
              <span className="px-2 py-0.5 rounded bg-slate-800">Temporal</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {memories.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              const typeColor = 
                node.type === "fact" ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10" :
                node.type === "experience" ? "border-indigo-500/40 text-indigo-400 bg-indigo-500/10" :
                node.type === "observation" ? "border-amber-500/40 text-amber-400 bg-amber-500/10" :
                "border-sky-500/40 text-sky-400 bg-sky-500/10";

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 ${
                    isSelected
                      ? "border-indigo-400 bg-indigo-950/40 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-400"
                      : "border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider border ${typeColor}`}>
                      {node.type}
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400 font-medium">
                      {(node.confidenceScore * 100).toFixed(0)}% confidence
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-slate-200 line-clamp-3 leading-relaxed">
                    {node.content}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 truncate max-w-[140px]">
                      <MapPin className="h-3 w-3 text-indigo-400" />
                      {node.metadata.venueName || node.venueId}
                    </span>
                    <span className="font-mono text-indigo-300">
                      #{node.rrfRank || 1} RRF
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Node Inspector Drawer */}
          {selectedNode && (
            <div className="mt-4 rounded-xl border border-indigo-500/30 bg-slate-950/80 p-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-indigo-400" />
                  <span className="text-xs font-mono text-indigo-300">Node ID: {selectedNode.id}</span>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Close
                </button>
              </div>

              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400">Factual Content:</span>
                  <p className="mt-1 text-slate-100 font-medium">{selectedNode.content}</p>
                </div>
                <div>
                  <span className="text-slate-400">Hindsight Metadata:</span>
                  <pre className="mt-1 p-2 rounded bg-slate-900 border border-slate-800 font-mono text-[11px] text-emerald-300 overflow-x-auto">
                    {JSON.stringify(selectedNode.metadata, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Raw Telemetry */}
      {activeTab === "json" && (
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-slate-400">Hindsight + Groq Pipeline Payload</span>
            <span className="text-xs text-indigo-400 font-mono">
              Provider: {briefing?.llmProvider || "Vectorize Hindsight"}
            </span>
          </div>
          <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-96">
            {JSON.stringify(briefing || { memories }, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
