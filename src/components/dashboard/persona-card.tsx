"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Field, Input, Textarea, Select } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { fetcher } from "@/lib/utils";
import type { Persona } from "@/lib/types";

export function PersonaCard({ p }: { p: Persona }) {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: p.name,
    role: p.role,
    demographics: p.demographics,
    goals: p.goals,
    painPoints: p.painPoints,
    quote: p.quote,
    channel: p.channel,
    priority: p.priority,
  });
  const set = <K extends keyof typeof form>(k: K, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function save() {
    setSaving(true);
    try {
      await fetcher(`/api/personas/${p.id}`, { method: "PUT", body: JSON.stringify(form) });
      setOpen(false);
      toast("Saved", "success");
      router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Save failed", "error");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!window.confirm(`Remove "${p.name}"?`)) return;
    try {
      await fetcher(`/api/personas/${p.id}`, { method: "DELETE" });
      toast("Removed", "success");
      router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not remove", "error");
    }
  }

  return (
    <div className="card flex flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-brand-500)]/12 text-sm font-bold text-[var(--color-brand-600)] dark:text-[var(--color-brand-300)]">
            {p.name.charAt(0)}
          </span>
          <div>
            <h3 className="text-[0.9375rem] font-semibold tracking-tight text-[var(--fg)]">{p.name}</h3>
            <p className="mt-0.5 text-xs text-[var(--muted)]">{p.role}</p>
          </div>
        </div>
        <Badge tone={p.priority === "primary" ? "brand" : "neutral"} dot>
          {p.priority}
        </Badge>
      </div>

      <p className="mt-4 text-xs text-[var(--muted)]">{p.demographics}</p>

      <div className="mt-4 space-y-3 text-sm">
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-[var(--muted)]">Goals</p>
          <p className="mt-0.5 leading-relaxed text-[var(--fg)]">{p.goals}</p>
        </div>
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-red-600 dark:text-red-400">Pain points</p>
          <p className="mt-0.5 leading-relaxed text-[var(--muted)]">{p.painPoints}</p>
        </div>
      </div>

      <blockquote className="mt-4 rounded-lg border-l-2 border-[var(--color-brand-500)] bg-[var(--color-brand-500)]/5 px-3 py-2 text-[0.8125rem] italic text-[var(--fg)]">
        {p.quote}
      </blockquote>

      <p className="mt-3 text-xs text-[var(--muted)]">
        <span className="font-medium text-[var(--fg)]">Reach:</span> {p.channel}
      </p>

      <div className="mt-4 flex items-center justify-end gap-1">
        <button onClick={() => setOpen(true)} className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--fg)]">
          <Icon name="spark" size={12} /> Edit
        </button>
        <button onClick={remove} className="rounded-lg p-1.5 text-[var(--muted)] hover:bg-red-500/10 hover:text-red-500" aria-label="Delete">
          <Icon name="trash" size={13} />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setOpen(false)}>
          <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-float)]" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-semibold text-[var(--fg)]">Edit persona</h3>
            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Name">
                  <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
                </Field>
                <Field label="Priority">
                  <Select value={form.priority} onChange={(e) => set("priority", e.target.value)}>
                    <option value="primary">Primary</option>
                    <option value="secondary">Secondary</option>
                  </Select>
                </Field>
              </div>
              <Field label="Role">
                <Input value={form.role} onChange={(e) => set("role", e.target.value)} />
              </Field>
              <Field label="Demographics">
                <Input value={form.demographics} onChange={(e) => set("demographics", e.target.value)} />
              </Field>
              <Field label="Goals">
                <Textarea value={form.goals} onChange={(e) => set("goals", e.target.value)} />
              </Field>
              <Field label="Pain points">
                <Textarea value={form.painPoints} onChange={(e) => set("painPoints", e.target.value)} />
              </Field>
              <Field label="Quote">
                <Input value={form.quote} onChange={(e) => set("quote", e.target.value)} />
              </Field>
              <Field label="Channels">
                <Input value={form.channel} onChange={(e) => set("channel", e.target.value)} />
              </Field>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
              <Button size="sm" onClick={save} loading={saving}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}