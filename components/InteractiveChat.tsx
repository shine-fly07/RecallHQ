"use client";

import React, { useState } from "react";
import { 
  MessageSquare, 
  Send, 
  Brain, 
  Sparkles, 
  Loader2, 
  AlertTriangle, 
  CheckCircle2, 
  Layers,
  HelpCircle,
  Clock,
  ArrowRight
} from "lucide-react";
import { HindsightMemoryNode } from "@/types";

interface ChatItem {
  id: string;
  role: "user" | "assistant";
  query?: string;
  groundedAnswer?: string;
  statelessAnswer?: string;
  evidence?: HindsightMemoryNode[];
  timestamp: string;
}

const SAMPLE_QUESTIONS = [
  "What issues did we face last time we hosted in Hyderabad during October?",
  "What went wrong with audio and mics at T-Hub Auditorium 1?",
  "Did we have catering shortages at HICC Novotel?",
  "What valet and parking bottlenecks happened at ITC Kohenur?"
];

export default function InteractiveChat() {
  const [messages, setMessages] = useState<ChatItem[]>([
    {
      id: "initial_welcome",
      role: "assistant",
      groundedAnswer: `Hello! I am **RecallHQ / VenueIQ**, your persistent event intelligence agent powered by Vectorize Hindsight memory. Ask me anything about past venue limitations, unannounced maintenance delays, monsoon flooding, catering ratios, or AV feedback across Hyderabad venues.`,
      statelessAnswer: `Hello! I am an AI event assistant. I can give general recommendations on booking venues, budgeting, and planning logistics.`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showStateless, setShowStateless] = useState(false);

  const handleSend = async (queryText?: string) => {
    const text = queryText || inputQuery;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatItem = {
      id: `usr_${Date.now()}`,
      role: "user",
      query: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: text }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to query agent.");

      const assistantMsg: ChatItem = {
        id: `ast_${Date.now()}`,
        role: "assistant",
        groundedAnswer: data.groundedAnswer,
        statelessAnswer: data.statelessAnswer,
        evidence: data.evidence,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: ChatItem = {
        id: `err_${Date.now()}`,
        role: "assistant",
        groundedAnswer: `Apologies, I encountered an error: ${err.message}`,
        statelessAnswer: "An error occurred.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 shadow-xl backdrop-blur-xl overflow-hidden flex flex-col h-[650px]">
      {/* Chat Header */}
      <div className="border-b border-slate-800 bg-slate-950/60 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-white">Interactive Venue Memory Agent</h2>
              <span className="flex h-2 w-2 rounded-full bg-emerald-400"></span>
            </div>
            <p className="text-xs text-slate-400">
              Query persistent hindsight memory across all past Hyderabad venues & dates.
            </p>
          </div>
        </div>

        {/* Toggle to inspect Stateless vs Grounded side-by-side */}
        <button
          onClick={() => setShowStateless(!showStateless)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
            showStateless 
              ? "bg-indigo-600/20 border-indigo-500/40 text-indigo-300" 
              : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          {showStateless ? "Hide Stateless View" : "Show Stateless Comparison"}
        </button>
      </div>

      {/* Suggested Quick Questions */}
      <div className="bg-slate-950/40 border-b border-slate-800/80 px-6 py-2.5 flex items-center gap-2 overflow-x-auto">
        <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap">Try asking:</span>
        {SAMPLE_QUESTIONS.map((q, i) => (
          <button
            key={i}
            onClick={() => handleSend(q)}
            disabled={isLoading}
            className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 hover:text-white transition-all disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {messages.map((msg) => {
          if (msg.role === "user") {
            return (
              <div key={msg.id} className="flex justify-end">
                <div className="max-w-xl rounded-2xl bg-indigo-600 px-4 py-3 text-xs text-white shadow-md">
                  <p className="leading-relaxed">{msg.query}</p>
                  <span className="block mt-1 text-[10px] text-indigo-200 text-right">{msg.timestamp}</span>
                </div>
              </div>
            );
          }

          return (
            <div key={msg.id} className="space-y-3">
              {/* Grounded Response */}
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow">
                  <Brain className="h-4 w-4" />
                </div>
                <div className="flex-1 rounded-2xl border border-indigo-500/20 bg-slate-950/60 p-4 text-xs text-slate-200 shadow-sm">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                    <span className="font-semibold text-indigo-300 flex items-center gap-1.5">
                      VenueIQ (Grounded on Hindsight Memory)
                      <Sparkles className="h-3 w-3 text-indigo-400" />
                    </span>
                    <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                  </div>

                  <div className="whitespace-pre-line leading-relaxed text-slate-200">
                    {msg.groundedAnswer}
                  </div>

                  {/* Evidence Nodes */}
                  {msg.evidence && msg.evidence.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-800">
                      <span className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider block mb-1.5">
                        Retrieved Grounding Evidence:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.evidence.map((ev) => (
                          <span
                            key={ev.id}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-950/40 border border-indigo-500/20 text-[10px] text-indigo-300 font-mono"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                            {ev.metadata.venueName || ev.venueId} ({(ev.confidenceScore * 100).toFixed(0)}%)
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Stateless AI Comparison (if toggled) */}
              {showStateless && msg.statelessAnswer && (
                <div className="ml-11 rounded-xl border border-rose-500/20 bg-rose-950/10 p-3.5 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-rose-900/30 text-rose-300 font-semibold">
                    <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
                    Generic Stateless AI (Without Hindsight Memory):
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px] italic">
                    "{msg.statelessAnswer}"
                  </p>
                  <p className="mt-2 text-[10px] text-rose-400/80">
                    ⚠️ Note how the stateless AI cannot recall specific past failure modes or room acoustic feedback.
                  </p>
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-indigo-400">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-xs text-slate-400 flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
              <span>Searching Vectorize Hindsight memory graph & synthesizing answer...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="border-t border-slate-800 bg-slate-950/80 p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask about past venue issues, seasonal monsoon bottlenecks, sound equipment..."
            className="flex-1 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 transition-all cursor-pointer"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

