"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Markdown } from "@/components/ui/markdown";
import { useToast } from "@/components/ui/toast";
import { fetcher } from "@/lib/utils";
import type { BlueprintSection } from "@/lib/types";

const statusTone: Record<BlueprintSection["status"], "warning" | "brand" | "success"> = {
  draft: "warning",
  reviewed: "brand",
  approved: "success",
};

export function BlueprintViewer({ startupId, sections }: { startupId: string; sections: BlueprintSection[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [activeSlug, setActiveSlug] = useState<string>(sections[0]?.slug ?? "");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);

  const active = useMemo(
    () => sections.find((s) => s.slug === activeSlug) ?? sections[0],
    [sections, activeSlug]
  );
  if (!active) {
    return (
      <p className="py-10 text-center text-sm text-[var(--muted)]">
        No blueprint yet — generate one to get started.
      </p>
    );
  }

  const status = statusTone[active.status];

  async function save() {
    setSaving(true);
    try {
      await fetcher("/api/blueprint/section", {
        method: "PUT",
        body: JSON.stringify({ startupId, slug: active.slug, content: draft }),
      });
      setEditing(false);
      toast("Section saved", "success");
      router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Save failed", "error");
    } finally {
      setSaving(false);
    }
  }

  async function regenerate() {
    setLoadingSlug(active.slug);
    try {
      await fetcher("/api/ai/generate", {
        method: "POST",
        body: JSON.stringify({ kind: "blueprint-section", section: active.slug, startupId }),
      });
      toast("Section regenerated", "success");
      router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Regeneration failed", "error");
    } finally {
      setLoadingSlug(null);
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
      <div className="card max-h-[calc(100vh-10rem)] self-start overflow-y-auto p-2">
        <p className="px-2 pt-1 pb-2 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
          Startup Blueprint
        </p>
        {sections.map((s, i) => (
          <button
            key={s.slug}
            onClick={() => { setActiveSlug(s.slug); setEditing(false); }}
            className={cn(
              "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
              s.slug === active.slug
                ? "bg-[var(--color-brand-500)]/10 font-medium text-[var(--fg)]"
                : "text-[var(--muted)] hover:bg-[var(--surface-2)]"
            )}
          >
            <span className="w-5 shrink-0 font-mono text-[0.7rem] text-[var(--muted)]">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="truncate">{s.title}</span>
            <span className={cn("ml-auto h-1.5 w-1.5 shrink-0 rounded-full", toneDot(s.status))} />
          </button>
        ))}
      </div>

      <div className="card">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--border)] px-5 py-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold tracking-tight text-[var(--fg)]">{active.title}</h2>
              <Badge tone={status} dot>{active.status}</Badge>
            </div>
            <p className="mt-0.5 text-xs text-[var(--muted)]">
              Updated {new Date(active.updatedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
            </p>
          </div>
          <div className="flex gap-2">
            {!editing && (
              <Button variant="ghost" size="sm" onClick={() => { setDraft(active.content); setEditing(true); }} icon={<Icon name="spark" size={13} />}>
                Edit
              </Button>
            )}
            <Button variant="soft" size="sm" onClick={regenerate} loading={loadingSlug === active.slug} icon={<Icon name="refresh" size={13} />}>
              {loadingSlug === active.slug ? "Working…" : "Regenerate"}
            </Button>
          </div>
        </div>

        <div className="px-5 py-5">
          {editing ? (
            <div className="space-y-3">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={18}
                className="min-h-[24rem] w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 font-mono text-[0.8125rem] text-[var(--fg)] outline-none focus:border-[var(--color-brand-500)]"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={save} loading={saving}>Save section</Button>
                <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <Markdown content={active.content} />
          )}
        </div>
      </div>
    </div>
  );
}

function toneDot(status: BlueprintSection["status"]): string {
  switch (status) {
    case "approved": return "bg-[var(--color-success)]";
    case "reviewed": return "bg-[var(--color-brand-500)]";
    default: return "bg-[var(--color-warning)]";
  }
}