"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/input";
import { Icon } from "@/components/ui/icon";
import { useToast } from "@/components/ui/toast";
import { fetcher } from "@/lib/utils";
import { ROADMAP_PHASES } from "@/lib/types";
import type { RoadmapTask, RoadmapPhase } from "@/lib/types";

const statusTone: Record<RoadmapTask["status"], "neutral" | "warning" | "success"> = {
  todo: "neutral",
  "in-progress": "warning",
  done: "success",
};

export function RoadmapBoard({ startupId, tasks }: { startupId: string; tasks: RoadmapTask[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [adding, setAdding] = useState<RoadmapPhase | null>(null);
  const [form, setForm] = useState({ title: "", description: "", priority: "med" });

  const grouped = useMemo(() => {
    const g = new Map<RoadmapPhase, RoadmapTask[]>(ROADMAP_PHASES.map((p) => [p.id, []]));
    for (const t of tasks) g.get(t.phase)?.push(t);
    for (const arr of g.values()) arr.sort((a, b) => a.order - b.order);
    return g;
  }, [tasks]);

  async function setStatus(t: RoadmapTask, status: RoadmapTask["status"]) {
    await fetcher(`/api/roadmap/${t.id}`, { method: "PUT", body: JSON.stringify({ status }) }).catch(() => {});
    router.refresh();
  }
  async function setPriority(t: RoadmapTask, priority: RoadmapTask["priority"]) {
    await fetcher(`/api/roadmap/${t.id}`, { method: "PUT", body: JSON.stringify({ priority }) }).catch(() => {});
    router.refresh();
  }
  async function remove(t: RoadmapTask) {
    if (!window.confirm(`Remove "${t.title}"?`)) return;
    await fetcher(`/api/roadmap/${t.id}`, { method: "DELETE" }).catch(() => {});
    router.refresh();
  }
  async function add(phase: RoadmapPhase) {
    if (!form.title.trim()) return;
    await fetcher("/api/roadmap", {
      method: "POST",
      body: JSON.stringify({ startupId, phase, ...form }),
    }).catch((e) => toast(e instanceof Error ? e.message : "Add failed", "error"));
    setForm({ title: "", description: "", priority: "med" });
    setAdding(null);
    toast("Task added", "success");
    router.refresh();
  }

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-5">
        {ROADMAP_PHASES.map((phase) => {
          const items = grouped.get(phase.id) ?? [];
          const done = items.filter((t) => t.status === "done").length;
          return (
            <div key={phase.id} className="card flex min-h-[10rem] flex-col p-0">
              <div className="border-b border-[var(--border)] px-4 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-[0.8125rem] font-semibold text-[var(--fg)]">{phase.label}</p>
                  <Badge tone="neutral">{done}/{items.length}</Badge>
                </div>
                {items.length > 0 && (
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-[var(--surface-2)]">
                    <div className="h-full rounded-full bg-[var(--color-brand-500)] transition-all" style={{ width: items.length ? `${(done / items.length) * 100}%` : "0%" }} />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2 p-3">
                {items.map((t) => (
                  <div key={t.id} className="group rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3">
                    <div className="flex items-start justify-between gap-2">
                      <button onClick={() => setStatus(t, t.status === "done" ? "todo" : t.status === "todo" ? "in-progress" : "done")} className="text-left">
                        <span className={`text-[0.8125rem] font-medium ${t.status === "done" ? "text-[var(--muted)] line-through" : "text-[var(--fg)]"}`}>{t.title}</span>
                      </button>
                      <Badge tone={statusTone[t.status]}>{t.status}</Badge>
                    </div>
                    {t.description && <p className="mt-1 line-clamp-2 text-[0.6875rem] text-[var(--muted)]">{t.description}</p>}
                    <div className="mt-2 flex items-center justify-between">
                      <select
                        value={t.priority}
                        onChange={(e) => setPriority(t, e.target.value as RoadmapTask["priority"])}
                        className="rounded-md border border-[var(--border)] bg-transparent px-1.5 py-0.5 text-[0.65rem] text-[var(--muted)] outline-none"
                        title="Priority"
                      >
                        <option value="low">low</option>
                        <option value="med">med</option>
                        <option value="high">high</option>
                      </select>
                      <button onClick={() => remove(t)} className="rounded p-1 text-[var(--muted)] hover:bg-red-500/10 hover:text-red-500" aria-label="Delete task">
                        <Icon name="trash" size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-2.5">
                <Button variant="ghost" size="sm" className="w-full" onClick={() => setAdding(phase.id)} icon={<Icon name="spark" size={12} />}>
                  Add task
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {adding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setAdding(null)}>
          <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-float)]" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-semibold text-[var(--fg)]">Add task · {ROADMAP_PHASES.find((p) => p.id === adding)?.label}</h3>
            <div className="mt-4 space-y-3">
              <Field label="Title">
                <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g. Ship landing page" />
              </Field>
              <Field label="Description">
                <Input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
              </Field>
              <Field label="Priority">
                <Select value={form.priority} onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}>
                  <option value="low">Low</option>
                  <option value="med">Med</option>
                  <option value="high">High</option>
                </Select>
              </Field>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setAdding(null)}>Cancel</Button>
              <Button size="sm" onClick={() => add(adding)} disabled={!form.title.trim()}>Add</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}