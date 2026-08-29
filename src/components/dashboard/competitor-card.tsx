"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input, Textarea, Field } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { fetcher } from "@/lib/utils";
import type { Competitor } from "@/lib/types";

export function CompetitorCard({ c }: { c: Competitor }) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[0.9375rem] font-semibold tracking-tight text-[var(--fg)]">{c.company}</h3>
          <p className="mt-0.5 text-xs text-[var(--muted)]">{c.product}</p>
        </div>
        <Badge tone={c.verified ? "success" : "warning"} dot>
          {c.verified ? "verified" : "estimate"}
        </Badge>
      </div>

      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-[var(--muted)]">Target users</p>
          <p className="mt-0.5 leading-relaxed text-[var(--fg)]">{c.targetUsers}</p>
        </div>
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-[var(--muted)]">Pricing</p>
          <p className="mt-0.5 leading-relaxed text-[var(--fg)]">{c.pricing}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="mb-1.5 text-[0.65rem] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Strengths</p>
          <ul className="space-y-1">
            {c.strengths.map((s, i) => (
              <li key={i} className="flex gap-1.5 text-[0.8125rem] text-[var(--muted)]">
                <span className="text-emerald-500">+</span> {s}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-1.5 text-[0.65rem] font-semibold uppercase tracking-wider text-red-600 dark:text-red-400">Weaknesses</p>
          <ul className="space-y-1">
            {c.weaknesses.map((w, i) => (
              <li key={i} className="flex gap-1.5 text-[0.8125rem] text-[var(--muted)]">
                <span className="text-red-500">−</span> {w}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-[var(--color-brand-500)]/20 bg-[var(--color-brand-500)]/4 px-3 py-2.5 text-[0.8125rem] leading-relaxed text-[var(--fg)]">
        <span className="font-semibold text-[var(--color-brand-500)]">Your wedge: </span>
        {c.differentiation}
      </div>

      <div className="mt-4 flex justify-end">
        <EditCompetitor c={c} />
      </div>
    </div>
  );
}

function EditCompetitor({ c }: { c: Competitor }) {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    company: c.company,
    product: c.product,
    targetUsers: c.targetUsers,
    pricing: c.pricing,
    differentiation: c.differentiation,
  });
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function save() {
    setSaving(true);
    try {
      await fetcher(`/api/competitors/${c.id}`, {
        method: "PUT",
        body: JSON.stringify({ ...form }),
      });
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
    if (!window.confirm(`Remove ${c.company} from the radar?`)) return;
    try {
      await fetcher(`/api/competitors/${c.id}`, { method: "DELETE" });
      toast("Removed", "success");
      router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not remove", "error");
    }
  }

  return (
    <div className="flex items-center gap-1">
      <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--fg)]">
        <Icon name="spark" size={12} /> Edit
      </button>
      <button onClick={remove} className="rounded-lg p-1.5 text-[var(--muted)] hover:bg-red-500/10 hover:text-red-500" aria-label="Delete">
        <Icon name="trash" size={13} />
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-float)]" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-semibold text-[var(--fg)]">Edit competitor</h3>
            <div className="mt-4 space-y-3">
              <Field label="Company">
                <Input value={form.company} onChange={(e) => set("company")(e.target.value)} />
              </Field>
              <Field label="Product">
                <Input value={form.product} onChange={(e) => set("product")(e.target.value)} />
              </Field>
              <Field label="Target users">
                <Input value={form.targetUsers} onChange={(e) => set("targetUsers")(e.target.value)} />
              </Field>
              <Field label="Pricing">
                <Input value={form.pricing} onChange={(e) => set("pricing")(e.target.value)} />
              </Field>
              <Field label="Differentiation / your wedge">
                <Textarea value={form.differentiation} onChange={(e) => set("differentiation")(e.target.value)} />
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