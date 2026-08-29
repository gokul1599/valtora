"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { Icon } from "@/components/ui/icon";
import { useToast } from "@/components/ui/toast";
import { fetcher } from "@/lib/utils";
import type { LaunchItem } from "@/lib/types";

const statusTone: Record<LaunchItem["status"], "neutral" | "warning" | "success"> = {
  pending: "neutral",
  "in-progress": "warning",
  done: "success",
};

export function LaunchBoard({ startupId, items }: { startupId: string; items: LaunchItem[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", category: "Operations" });

  async function setStatus(item: LaunchItem, status: LaunchItem["status"]) {
    await fetcher(`/api/launch/${item.id}`, { method: "PUT", body: JSON.stringify({ status }) }).catch(() => {});
    router.refresh();
  }
  async function add() {
    if (!form.title.trim()) return;
    await fetcher("/api/launch", { method: "POST", body: JSON.stringify({ startupId, ...form }) }).catch((e) => toast(e instanceof Error ? e.message : "Add failed", "error"));
    setForm({ title: "", description: "", category: "Operations" });
    setAdding(false);
    toast("Added", "success");
    router.refresh();
  }

  const done = items.filter((i) => i.status === "done").length;

  return (
    <div className="card">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
        <p className="text-sm text-[var(--muted)]">
          <span className="text-lg font-semibold tabular-nums text-[var(--fg)]">{done}</span> / {items.length} shipped
        </p>
        <Button variant="soft" size="sm" icon={<Icon name="spark" size={13} />} onClick={() => setAdding(true)}>Add item</Button>
      </div>

      <div className="divide-y divide-[var(--border)]">
        {items.length === 0 && (
          <p className="px-5 py-8 text-center text-sm text-[var(--muted)]">No launch items yet — regenerate or add your own.</p>
        )}
        {items.map((item) => (
          <div key={item.id} className="group flex items-center gap-3 px-5 py-3.5">
            <button
              aria-label="Toggle status"
              onClick={() => setStatus(item, item.status === "done" ? "pending" : item.status === "pending" ? "in-progress" : "done")}
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${item.status === "done" ? "border-[var(--color-success)] bg-[var(--color-success)] text-white" : "border-[var(--border)] bg-[var(--surface)] text-transparent hover:border-[var(--color-brand-500)]"}`}
            >
              ✓
            </button>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className={`truncate text-sm font-medium ${item.status === "done" ? "text-[var(--muted)] line-through" : "text-[var(--fg)]"}`}>{item.title}</p>
                <Badge tone="neutral">{item.category}</Badge>
              </div>
              {item.description && <p className="mt-0.5 line-clamp-1 text-xs text-[var(--muted)]">{item.description}</p>}
            </div>
            <Badge tone={statusTone[item.status]} dot className="capitalize">{item.status.replace("-", " ")}</Badge>
          </div>
        ))}
      </div>

      {adding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setAdding(false)}>
          <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-float)]" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-semibold text-[var(--fg)]">Add launch item</h3>
            <div className="mt-4 space-y-3">
              <Field label="Title">
                <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g. Product Hunt launch" />
              </Field>
              <Field label="Description">
                <Input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
              </Field>
              <Field label="Category">
                <Input value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} placeholder="Operations / Growth / PR" />
              </Field>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setAdding(false)}>Cancel</Button>
              <Button size="sm" onClick={add} disabled={!form.title.trim()}>Add</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}