"use client";

import { useState } from "react";
import type { StartupContext } from "@/lib/startup";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import {
  Sparkles,
  Eye,
  Pencil,
  Check,
  RefreshCw,
  Rocket,
  TrendingUp,
  Swords,
  Users,
  Store,
  Package,
  Cpu,
  Map as MapIcon,
  Megaphone,
  Send,
  AlertTriangle,
} from "lucide-react";
import { fetcher } from "@/lib/utils";

interface SectionDef {
  key: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}

const sectionsDef: SectionDef[] = [
  { key: "vision", title: "Vision", icon: Eye },
  { key: "problem", title: "Problem", icon: AlertTriangle },
  { key: "targetCustomers", title: "Target Customers", icon: Users },
  { key: "valueProposition", title: "Value Proposition", icon: Sparkles },
  { key: "market", title: "Market", icon: TrendingUp },
  { key: "competitors", title: "Competitors", icon: Swords },
  { key: "differentiation", title: "Differentiation", icon: Sparkles },
  { key: "businessModel", title: "Business Model", icon: Store },
  { key: "pricing", title: "Pricing", icon: Store },
  { key: "product", title: "Product", icon: Package },
  { key: "mvp", title: "MVP", icon: Rocket },
  { key: "technology", title: "Technology", icon: Cpu },
  { key: "roadmap", title: "Roadmap", icon: MapIcon },
  { key: "marketing", title: "Marketing", icon: Megaphone },
  { key: "launch", title: "Launch", icon: Send },
  { key: "risks", title: "Risks", icon: AlertTriangle },
];

function SectionView({ data }: { data: unknown }) {
  if (data === null || typeof data === "undefined") return null;
  if (typeof data === "string") {
    return <p className="text-sm leading-relaxed text-[var(--fg-secondary)]">{data}</p>;
  }

  if (Array.isArray(data)) {
    if (data.length === 0) return <p className="text-xs text-[var(--fg-muted)]">No items.</p>;
    if (data.every((d) => typeof d === "string")) {
      return (
        <ul className="space-y-1.5">
          {data.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm leading-relaxed text-[var(--fg-secondary)]">
              <span className="mt-1.5 size-1 shrink-0 rounded-full bg-[var(--accent)]" />
              {item}
            </li>
          ))}
        </ul>
      );
    }
    return (
      <div className="space-y-3">
        {data.map((item, i) => (
          <Card key={i} className="bg-[var(--elevated)]">
            <CardBody className="px-4 py-3">
              {typeof item === "object" && item !== null ? (
                <div className="space-y-2">
                  {Object.entries(item as Record<string, unknown>).map(([k, v]) => (
                    <div key={k}>
                      <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--fg-muted)]">{k}</p>
                      {Array.isArray(v) ? (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {v.map((s, j) => (
                            <Badge key={j} tone="default">{String(s)}</Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-0.5 text-sm leading-relaxed text-[var(--fg-secondary)]">
                          {typeof v === "string" ? v : JSON.stringify(v)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[var(--fg-secondary)]">{String(item)}</p>
              )}
            </CardBody>
          </Card>
        ))}
      </div>
    );
  }

  if (typeof data === "object") {
    const entries = Object.entries(data as Record<string, unknown>);
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {entries.map(([k, v]) => (
          <div key={k} className="rounded-lg border border-[var(--border-soft)] bg-[var(--elevated)] p-4">
            <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--fg-muted)]">
              {k.replace(/([A-Z])/g, " $1")}
            </p>
            {Array.isArray(v) ? (
              v.length > 0 ? (
                <ul className="mt-2 space-y-1.5">
                  {v.map((s: unknown, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm leading-relaxed text-[var(--fg-secondary)]">
                      <span className="mt-1.5 size-1 shrink-0 rounded-full bg-[var(--accent)]" />
                      {typeof s === "string" ? s : JSON.stringify(s)}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-xs text-[var(--fg-muted)]">Empty list</p>
              )
            ) : typeof v === "string" ? (
              <p className="mt-2 text-sm leading-relaxed text-[var(--fg-secondary)]">{v}</p>
            ) : (
              <p className="mt-2 text-sm leading-relaxed text-[var(--fg-secondary)]">{JSON.stringify(v)}</p>
            )}
          </div>
        ))}
      </div>
    );
  }

  return <p className="text-sm text-[var(--fg-secondary)]">{String(data)}</p>;
}

export function BlueprintPage({ ctx }: { ctx: StartupContext }) {
  const { toast } = useToast();
  const startup = ctx.startup!;
  const [sections, setSections] = useState(ctx.sections);
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [regenerating, setRegenerating] = useState<string | null>(null);

  async function regenerate(key: string) {
    setRegenerating(key);
    try {
      const res = await fetcher<{ ok: boolean; data: unknown }>("/api/generate", {
        method: "POST",
        body: JSON.stringify({ action: "regenerate", startupId: startup.id, section: key }),
      });
      setSections((prev) => ({ ...prev, [key]: res.data }));
      toast("Section regenerated by Zorvyn", "success");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Regeneration failed", "error");
    } finally {
      setRegenerating(null);
    }
  }

  function startEdit(key: string) {
    setEditing(key);
    setEditValue(JSON.stringify(sections[key] ?? {}, null, 2));
  }

  async function saveEdit(key: string) {
    try {
      const parsed = JSON.parse(editValue);
      setSections((prev) => ({ ...prev, [key]: parsed }));
      setEditing(null);
      toast("Saved", "success");
    } catch {
      toast("Invalid JSON — check the formatting", "error");
    }
  }

  const hasData = Object.keys(sections).length > 0;

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-sm font-medium text-[var(--fg-muted)]">BLUEPRINT · <span className="text-[var(--fg)]">{startup.name}</span></h1>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--fg)]">Startup Blueprint</h2>
            <p className="mt-1 text-sm text-[var(--fg-muted)]">
              Your core knowledge base — every section is editable and regenerable.
            </p>
          </div>
          <Badge tone="accent">
            <Sparkles className="size-3" /> Generated by Zorvyn AI
          </Badge>
        </div>
      </div>

      {!hasData && (
        <Card>
          <CardBody className="py-12 text-center">
            <p className="text-sm font-medium text-[var(--fg)]">No blueprint yet</p>
            <p className="mx-auto mt-1 max-w-sm text-xs text-[var(--fg-muted)]">
              Zorvyn will generate your full startup blueprint from your onboarding answers.
              Open the AI Co-Founder and ask to generate it.
            </p>
          </CardBody>
        </Card>
      )}

      {sectionsDef.map((section) => {
        const data = sections[section.key];
        if (!data) return null;
        return (
          <Card key={section.key}>
            <CardHeader
              title={section.title}
              action={
                <div className="flex items-center gap-2">
                  {regenerating === section.key ? (
                    <Button size="sm" variant="ghost" loading>
                      Regenerating
                    </Button>
                  ) : (
                    <Button size="sm" variant="ghost" onClick={() => regenerate(section.key)}>
                      <RefreshCw className="size-3.5" /> Regenerate
                    </Button>
                  )}
                  {editing === section.key ? (
                    <Button size="sm" onClick={() => saveEdit(section.key)}>
                      <Check className="size-3.5" /> Save
                    </Button>
                  ) : (
                    <Button size="sm" variant="ghost" onClick={() => startEdit(section.key)}>
                      <Pencil className="size-3.5" /> Edit
                    </Button>
                  )}
                </div>
              }
            />
            <CardBody>
              {editing === section.key ? (
                <textarea
                  className="min-h-64 w-full rounded-lg border border-[var(--border)] bg-[var(--elevated)] p-3 font-mono text-xs text-[var(--fg)] focus:border-[var(--accent)] focus:outline-none"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  spellCheck={false}
                />
              ) : (
                <SectionView data={data} />
              )}
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
}