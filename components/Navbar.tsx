"use client";

import React, { useState, useEffect } from "react";
import { 
  Brain, 
  Sparkles, 
  Key, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  Layers,
  Cpu,
  RefreshCw,
  Zap
} from "lucide-react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [hindsightStatus, setHindsightStatus] = useState<any>({
    isConfigured: false,
    activeEngine: "Hindsight Neural Engine (Local Hybrid)",
    bankId: "recallhq_venue_memory"
  });
  const [groqStatus, setGroqStatus] = useState<any>({
    isConfigured: false,
    model: "llama-3.3-70b-versatile",
    provider: "Grounded Memory Engine"
  });

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/hindsight");
      const data = await res.json();
      if (data.hindsight) setHindsightStatus(data.hindsight);
      if (data.groq) setGroqStatus(data.groq);
    } catch (err) {
      console.warn("Could not fetch status", err);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const navTabs = [
    { id: "planner", label: "Briefing & Planner" },
    { id: "inspector", label: "Memory Inspector (Showpiece)" },
    { id: "events", label: "Memory Bank & Retrospectives" },
    { id: "chat", label: "Interactive Q&A Agent" },
    { id: "timeline", label: "Seasonal Heatmap" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/25">
              <Brain className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-white">RecallHQ</span>
                <span className="inline-flex items-center rounded-md bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-400 border border-indigo-500/20">
                  HackwithHyderabad 3.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                The headquarters for your event memory · Powered by Vectorize Hindsight
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 rounded-xl bg-slate-900/80 p-1 border border-slate-800">
            {navTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Status & Key Config Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowConfigModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/90 text-xs font-medium text-slate-200 hover:border-indigo-500/50 hover:bg-slate-800 transition-all cursor-pointer"
            >
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="hidden sm:inline">Engine Config</span>
              <Key className="h-3.5 w-3.5 text-indigo-400" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden border-t border-slate-800/80 px-4 py-2 flex items-center gap-1 overflow-x-auto">
          {navTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Engine Status & Credentials Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Key className="h-5 w-5 text-indigo-400" />
                <h3 className="text-sm font-semibold text-white">Engine & API Credentials</h3>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {/* Vectorize Hindsight Status */}
              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-indigo-400" />
                    <span className="text-xs font-semibold text-white">Vectorize Hindsight</span>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    hindsightStatus.isConfigured 
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-indigo-500/10 text-indigo-300 border-indigo-500/20"
                  }`}>
                    {hindsightStatus.isConfigured ? "Live Cloud Connected" : "Local Neural Engine"}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Bank ID: <code className="text-indigo-300 font-mono">{hindsightStatus.bankId}</code>
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Endpoint: <code className="text-slate-300 font-mono">{hindsightStatus.apiUrl}</code>
                </p>
                <div className="mt-2 text-[10px] text-slate-500">
                  To connect your live Hindsight API key, set <code className="text-indigo-300">HINDSIGHT_API_KEY</code> in <code className="text-slate-300">.env.local</code>.
                </div>
              </div>

              {/* Groq LLM Status */}
              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-400" />
                    <span className="text-xs font-semibold text-white">Groq API Inference</span>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    groqStatus.isConfigured 
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-300 border-amber-500/20"
                  }`}>
                    {groqStatus.isConfigured ? "Groq Cloud Active" : "Grounded Fallback Engine"}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Target Model: <code className="text-amber-300 font-mono">{groqStatus.model}</code>
                </p>
                <div className="mt-2 text-[10px] text-slate-500">
                  To enable live Groq cloud inference, set <code className="text-amber-300">GROQ_API_KEY</code> in <code className="text-slate-300">.env.local</code>.
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

