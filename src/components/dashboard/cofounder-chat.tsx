"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Markdown } from "@/components/ui/markdown";
import { useToast } from "@/components/ui/toast";
import { fetcher } from "@/lib/utils";
import type { AiConversation, Startup } from "@/lib/types";

const suggestions = [
  "What advisors do I need to find?",
  "Add the feature: onboarding checklist",
  "What risks should I watch for?",
  "Generate a launch plan",
];

export function CofounderChat({
  startup,
  initialConversations,
}: {
  startup: Startup;
  initialConversations: AiConversation[];
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<AiConversation[]>(initialConversations);
  const [activeId, setActiveId] = useState<string>(initialConversations[0]?.id ?? "");
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const active = conversations.find((c) => c.id === activeId) ?? null;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [active?.messages.length, activeId, active]);

  async function send(text: string) {
    const message = text.trim();
    if (!message || sending) return;
    setSending(true);
    setInput("");
    try {
      const res = await fetcher<{ conversation: AiConversation }>("/api/ai/chat", {
        method: "POST",
        body: JSON.stringify({ startupId: startup.id, message, conversationId: activeId || undefined }),
      });
      setConversations((prev) => {
        const next = prev.filter((c) => c.id !== res.conversation.id);
        return [res.conversation, ...next];
      });
      setActiveId(res.conversation.id);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not reach your advisor — check your AI key.", "error");
      setInput(message);
    } finally {
      setSending(false);
    }
  }

  async function decide(messageId: string, actionId: string, approve: boolean) {
    if (!active) return;
    try {
      await fetcher("/api/ai/action", {
        method: "POST",
        body: JSON.stringify({ conversationId: active.id, actionId, approve }),
      });
      setConversations((prev) =>
        prev.map((c) =>
          c.id === active.id
            ? {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === messageId && m.action
                    ? { ...m, action: { ...m.action, status: approve ? "applied" : "rejected" } }
                    : m
                ),
              }
            : c
        )
      );
      toast(approve ? "Applied to your workspace" : "Change ignored", "success");
      router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Action failed", "error");
    }
  }

  function newChat() {
    setActiveId("");
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
      <div className="card max-h-[calc(100vh-10rem)] self-start overflow-y-auto p-2">
        <Button variant="soft" size="sm" className="mb-2 w-full" onClick={newChat} icon={<Icon name="spark" size={13} />}>
          New conversation
        </Button>
        {conversations.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveId(c.id)}
            className={`w-full truncate rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${
              c.id === activeId ? "bg-[var(--color-brand-500)]/10 font-medium text-[var(--fg)]" : "text-[var(--muted)] hover:bg-[var(--surface-2)]"
            }`}
          >
            {c.title || "New conversation"}
          </button>
        ))}
      </div>

      <div className="card flex max-h-[calc(100vh-10rem)] min-h-[28rem] flex-col p-0">
        <div className="flex items-center gap-2.5 border-b border-[var(--border)] px-5 py-3.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-brand-500)] to-violet-500 text-xs font-bold text-white">
            FC
          </span>
          <div>
            <p className="text-sm font-semibold text-[var(--fg)]">Forge cofounder</p>
            <p className="text-[0.7rem] text-[var(--muted)]">Working on {startup.name} — advises, edits, and files changes you approve</p>
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
          {!active || active.messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center px-6 text-center">
              <Icon name="cofounder" size={30} />
              <p className="mt-3 text-sm font-medium text-[var(--fg)]">What should we work through?</p>
              <p className="mt-1 max-w-sm text-xs text-[var(--muted)]">
                Ask for analysis or a plan, or ask me to make a change — I&apos;ll propose it and you approve before it touches your workspace.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs text-[var(--muted)] transition-colors hover:border-[var(--color-brand-500)]/50 hover:text-[var(--fg)]"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            active.messages.map((m) => (
              <div key={m.id} className="flex flex-col">
                <div className={`max-w-[85%] ${m.role === "user" ? "self-end" : "self-start"}`}>
                  {m.role === "user" ? (
                    <div className="rounded-2xl rounded-br-sm bg-[var(--color-brand-500)] px-4 py-2.5 text-sm text-white">
                      {m.content}
                    </div>
                  ) : (
                    <div className="rounded-2xl rounded-bl-sm border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
                      <Markdown content={m.content} />
                      {m.action && m.action.status === "pending-approval" && (
                        <div className="mt-3 rounded-xl border border-[var(--color-brand-500)]/30 bg-[var(--color-brand-500)]/6 p-3">
                          <p className="text-xs font-semibold text-[var(--fg)]">Proposed change</p>
                          <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">{m.action.summary}</p>
                          <div className="mt-2.5 flex gap-2">
                            <Button size="sm" onClick={() => decide(m.id, m.action!.id, true)} icon={<Icon name="check" size={12} />}>
                              Apply
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => decide(m.id, m.action!.id, false)}>Reject</Button>
                          </div>
                        </div>
                      )}
                      {m.action && m.action.status === "applied" && (
                        <p className="mt-2.5 text-xs font-medium text-[var(--color-success)]">✓ Change applied</p>
                      )}
                      {m.action && m.action.status === "rejected" && (
                        <p className="mt-2.5 text-xs font-medium text-[var(--muted)]">— Change rejected</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={endRef} />
        </div>

        <div className="border-t border-[var(--border)] p-3">
          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="flex items-end gap-2"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); }
              }}
              rows={2}
              placeholder="Ask for advice, or say &apos;add this feature…&apos;"
              className="flex-1 resize-none rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--fg)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--color-brand-500)]"
            />
            <Button type="submit" size="sm" loading={sending} disabled={!input.trim()} className="h-[2.6rem]">
              Send
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}