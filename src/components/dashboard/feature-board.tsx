"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/input";
import { Icon } from "@/components/ui/icon";
import { useToast } from "@/components/ui/toast";
import { fetcher } from "@/lib/utils";
import type { Feature, FeatureCategory } from "@/lib/types";

const columns: { key: FeatureCategory; label: string; dot: string }[] = [
  { key: "must", label: "Must — the cut line", dot: "bg-[var(--color-brand-500)]" },
  { key: "should", label: "Should — widen the win", dot: "bg-[var(--color-warning)]" },
  { key: "could", label: "Could — luxury, later", dot: "bg-sky-500" },
  { key: "not-now", label: "Not now — the discipline", dot: "bg-[var(--muted)]" },
];

const categoryOrder: FeatureCategory[] = ["must", "should", "could", "not-now"];

export function FeatureBoard({ startupId, features }: { startupId: string; features: Feature[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [editing, setEditing] = useState<Feature | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", category: "should" as FeatureCategory, userStory: "" });
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const grouped = useMemo(() => {
    const g = new Map<FeatureCategory, Feature[]>(categoryOrder.map((c) => [c, []]));
    for (const f of features) g.get(f.category)?.push(f);
    return g;
  }, [features]);

  async function saveFeature(id: string | null) {
    setSaving(true);
    try {
      if (id) {
        await fetcher(`/api/features/${id}`, { method: "PUT", body: JSON.stringify(form) });
      } else {
        await fetcher("/api/features", { method: "POST", body: JSON.stringify({ startupId, ...form }) });
      }
      setEditing(null);
      setCreating(false);
      setForm({ name: "", description: "", category: "should", userStory: "" });
      toast(id ? "Feature updated" : "Feature added", "success");
      router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Save failed", "error");
    } finally {
      setSaving(false);
    }
  }

  async function bump(feature: Feature) {
    const idx = categoryOrder.indexOf(feature.category);
    const next = categoryOrder[(idx + 1) % categoryOrder.length];
    await fetcher(`/api/features/${feature.id}`, { method: "PUT", body: JSON.stringify({ category: next }) }).catch(() => {});
    router.refresh();
  }

  async function toggleStatus(feature: Feature) {
    const next = feature.status === "done" ? "planned" : feature.status === "planned" ? "in-progress" : "done";
    await fetcher(`/api/features/${feature.id}`, { method: "PUT", body: JSON.stringify({ status: next }) }).catch(() => {});
    router.refresh();
  }

  async function remove(feature: Feature) {
    if (!window.confirm(`Remove "${feature.name}" from the scope?`)) return;
    await fetcher(`/api/features/${feature.id}`, { method: "DELETE" }).catch(() => {});
    toast("Removed", "success");
    router.refresh();
  }

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-4">
        {columns.map((col) => (
          <div key={col.key} className="card flex min-h-[12rem] flex-col p-0">
            <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-3">
              <span className={`h-2 w-2 rounded-full ${col.dot}`} />
              <p className="text-[0.8125rem] font-semibold text-[var(--fg)]">{col.label}</p>
              <Badge tone="neutral" className="ml-auto">{grouped.get(col.key)?.length ?? 0}</Badge>
            </div>
            <div className="flex-1 space-y-2 p-3">
              {(grouped.get(col.key) ?? []).map((f) => (
                <div key={f.id} className="group rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 transition-colors hover:border-[var(--color-brand-500)]/40">
                  <button onClick={() => toggleStatus(f)} className="flex w-full items-start gap-2 text-left">
                    <span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${f.status === "done" ? "bg-[var(--color-success)]" : f.status === "in-progress" ? "bg-[var(--color-warning)]" : "bg-[var(--muted)]"}`} />
                    <span className={`text-sm font-medium ${f.status === "done" ? "text-[var(--muted)] line-through" : "text-[var(--fg)]"}`}>
                      {f.name}
                    </span>
                  </button>
                  {f.description && (
                    <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[var(--muted)]">{f.description}</p>
                  )}
                  <div className="mt-2 flex items-center justify-between opacity-0 transition-opacity group-hover:opacity-100">
                    <button onClick={() => { setEditing(f); setForm({ name: f.name, description: f.description ?? "", category: f.category, userStory: f.userStory ?? "" }); }} className="rounded p-1 text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--fg)]" aria-label="Edit">
                      <Icon name="spark" size={12} />
                    </button>
                    <div className="flex items-center gap-1">
                      <button onClick={() => bump(f)} className="rounded p-1 text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--fg)]" title="Move category">
                        <Icon name="arrow" size={12} />
                      </button>
                      <button onClick={() => remove(f)} className="rounded p-1 text-[var(--muted)] hover:bg-red-500/10 hover:text-red-500" aria-label="Delete">
                        <Icon name="trash" size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {col.key === "not-now" && (grouped.get(col.key)?.length ?? 0) === 0 && (
                <p className="rounded-lg border border-dashed border-[var(--border)] px-3 py-2 text-center text-[0.7rem] text-[var(--muted)]">
                  Scope discipline: say no early.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <Button variant="soft" size="sm" icon={<Icon name="spark" size={13} />} onClick={() => { setCreating(true); setForm({ name: "", description: "", category: "should", userStory: "" }); }}>
        Add feature
      </Button>

      {(editing || creating) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => { setEditing(null); setCreating(false); }}>
          <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-float)]" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-semibold text-[var(--fg)]">{editing ? "Edit feature" : "Add feature"}</h3>
            <div className="mt-4 space-y-3">
              <Field label="Name">
                <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Drag-and-drop builder" />
              </Field>
              <Field label="Description">
                <Input value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="What it does, why it matters" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Category">
                  <Select value={form.category} onChange={(e) => set("category", e.target.value)}>
                    {categoryOrder.map((c) => <option key={c} value={c}>{c}</option>)}
                  </Select>
                </Field>
                <Field label="User story">
                  <Input value={form.userStory} onChange={(e) => set("userStory", e.target.value)} placeholder="As a… I want… so that…" />
                </Field>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => { setEditing(null); setCreating(false); }}>Cancel</Button>
              <Button size="sm" onClick={() => saveFeature(editing?.id ?? null)} loading={saving} disabled={!form.name.trim()}>
                {editing ? "Save" : "Add"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}