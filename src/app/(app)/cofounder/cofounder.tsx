"use client";

import { useEffect, useRef, useState } from "react";
import type { StartupContext } from "@/lib/startup";
import { STAGE_LABELS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { Sparkles, Send, Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ConversationSummary {
  id: string;
  title: string;
  updatedAt: string;
}

export function CoFounderWorkspace({ ctx }: { ctx: StartupContext }) {
  const { toast } = useToast();
  const startup = ctx.startup;
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/chat")
      .then((r) => r.json())
      .then((d) => setConversations(d.conversations ?? []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  async function send() {
    const text = input.trim();
    if (!text || sending) return;
    setInput("");
    setMessages((prev) => [...prev, { id: uid(), role: "user", content: text }]);
    setSending(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          startupId: startup?.id,
          conversationId: activeId ?? undefined,
        }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Request failed");
      setMessages((prev) => [...prev, { id: uid(), role: "assistant", content: body.reply }]);
      setActiveId(body.conversationId);
      // refresh conversation list
      const listRes = await fetch("/api/chat");
      const listBody = await listRes.json();
      setConversations(listBody.conversations ?? []);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not reach Zorvyn", "error");
    } finally {
      setSending(false);
    }
  }

  function uid(): string {
    return Math.random().toString(36).slice(2);
  }

  const contextPanelItems = startup
    ? [
        { label: "Startup Stage", value: STAGE_LABELS[startup.stage] ?? startup.stage },
        { label: "Current Goal", value: "Validate demand" },
        { label: "Top Opportunity", value: "First 10 paying customers" },
        { label: "Top Risk", value: "Pricing hypothesis unvalidated" },
        { label: "MVP Progress", value: "Blueprint generated" },
        { label: "Active Priorities", value: "Market & competitive analysis" },
      ]
    : [];

  return (
    <div className="grid h-[calc(100vh-7rem)] gap-4 xl:grid-cols-4">
      {/* Conversation history */}
      <div className="hidden flex-col rounded-xl border border-[var(--border-soft)] bg-[var(--surface)] lg:flex">
        <div className="flex items-center justify-between border-b border-[var(--border-soft)] px-4 py-3">
          <p className="text-sm font-semibold text-[var(--fg)]">Conversations</p>
          <button
            onClick={() => {
              setActiveId(null);
              setMessages([]);
            }}
            className="rounded-lg p-1.5 text-[var(--fg-secondary)] hover:bg-[var(--border-soft)] hover:text-[var(--fg)]"
            title="New conversation"
          >
            <Plus className="size-4" />
          </button>
        </div>
        <div className="flex-1 space-y-1 overflow-y-auto p-2">
          {conversations.length === 0 && (
            <p className="px-2 py-4 text-xs text-[var(--fg-muted)]">No conversations yet.</p>
          )}
          {conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setActiveId(c.id);
                setMessages([]);
                toast("Loading conversation history…", "info");
              }}
              className={cn(
                "w-full rounded-lg px-3 py-2 text-left text-xs transition-colors",
                activeId === c.id
                  ? "bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] text-[var(--fg)]"
                  : "hover:bg-[var(--border-soft)] text-[var(--fg-secondary)]",
              )}
            >
              {c.title}
            </button>
          ))}
        </div>
      </div>

      {/* Center chat */}
      <div className="flex flex-col rounded-xl border border-[var(--border-soft)] bg-[var(--surface)] lg:col-span-2">
        <div className="flex items-center gap-2 border-b border-[var(--border-soft)] px-4 py-3">
          <div className="flex size-7 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--accent)_20%,transparent)]">
            <Sparkles className="size-3.5 text-[var(--accent)]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--fg)]">Zorvyn AI</p>
            <p className="text-[11px] text-[var(--fg-muted)]">Your AI co-founder</p>
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5">
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--accent)_20%,transparent)]">
                <Sparkles className="size-5 text-[var(--accent)]" />
              </div>
              <p className="max-w-xs text-sm text-[var(--fg-secondary)]">
                {startup
                  ? "Ask Zorvyn anything about your startup — strategy, scope, pricing, next moves."
                  : "Create a startup first, then discuss strategy with Zorvyn."}
              </p>
              <div className="grid w-full max-w-md gap-2 text-left">
                {[
                  "How should I differentiate from my competitors?",
                  "Reduce my MVP to five features.",
                  "Create pricing tiers for my product.",
                  "What is my biggest risk right now?",
                ].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setInput(s);
                    }}
                    className="rounded-lg border border-[var(--border-soft)] bg-[var(--elevated)] px-3 py-2.5 text-xs text-[var(--fg-secondary)] transition-colors hover:border-[var(--accent)] hover:text-[var(--fg)]"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) => (
            <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[85%] whitespace-pre-wrap rounded-xl px-4 py-3 text-sm leading-relaxed",
                  m.role === "user"
                    ? "bg-[var(--accent)] text-[var(--accent-fg)]"
                    : "border border-[var(--border-soft)] bg-[var(--elevated)] text-[var(--fg-secondary)]",
                )}
              >
                {m.content}
              </div>
            </div>
          ))}

          {sending && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-xl border border-[var(--border-soft)] bg-[var(--elevated)] px-4 py-3">
                <Loader2 className="size-3.5 animate-spin text-[var(--accent)]" />
                <span className="text-xs text-[var(--fg-muted)]">Zorvyn is thinking…</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="flex items-center gap-2 border-t border-[var(--border-soft)] p-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="What should we solve next?"
            disabled={sending || !startup}
          />
          <Button size="md" onClick={send} disabled={sending || !input.trim() || !startup}>
            <Send className="size-4" />
          </Button>
        </div>
      </div>

      {/* Startup context panel */}
      <div className="hidden flex-col overflow-y-auto rounded-xl border border-[var(--border-soft)] bg-[var(--surface)] xl:flex">
        <div className="border-b border-[var(--border-soft)] px-4 py-3">
          <p className="text-sm font-semibold text-[var(--fg)]">Startup context</p>
          <p className="text-[11px] text-[var(--fg-muted)]">What Zorvyn can see</p>
        </div>
        {startup ? (
          <div className="space-y-4 p-4">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--fg-muted)]">Project</p>
              <p className="mt-1 text-sm font-medium text-[var(--fg)]">{startup.name}</p>
            </div>
            {contextPanelItems.map((item) => (
              <div key={item.label}>
                <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--fg-muted)]">{item.label}</p>
                <p className="mt-1 text-sm text-[var(--fg-secondary)]">{item.value}</p>
              </div>
            ))}
            <div className="rounded-lg border border-[var(--border-soft)] bg-[var(--elevated)] p-3">
              <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--fg-muted)]">How it works</p>
              <p className="mt-1 text-xs leading-relaxed text-[var(--fg-secondary)]">
                Zorvyn reads your blueprint sections and suggests actions, scopes, and priorities grounded in your startup data.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4">
            <p className="text-xs text-[var(--fg-muted)]">Create a startup to give Zorvyn a project to work on.</p>
          </div>
        )}
      </div>
    </div>
  );
}