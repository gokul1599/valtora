"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { StartupContext } from "@/lib/startup";
import { PLAN_LIMITS } from "@/lib/constants";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { fetcher } from "@/lib/utils";

export function SettingsClient({ ctx }: { ctx: StartupContext }) {
  const router = useRouter();
  const [usage, setUsage] = useState<number | null>(null);
  const plan = PLAN_LIMITS[ctx.user.plan as keyof typeof PLAN_LIMITS] ?? PLAN_LIMITS.free;

  if (usage === null) {
    fetch("/api/usage").then(async (r) => {
      const d = await r.json();
      if (r.ok && typeof d.generations === "number") setUsage(d.generations);
    }).catch(() => {});
  }

  const percent = usage === null ? 0 : Math.min(100, Math.round((usage / plan.aiGenerationsPerMonth) * 100));

  async function signOut() {
    try {
      await fetcher("/api/auth/logout", { method: "POST" });
    } catch {
      // proceed to redirect regardless
    }
    router.push("/");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--fg)]">Settings</h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">Manage your workspace, usage, and account.</p>
      </div>

      <Card>
        <CardHeader
          title="AI Usage"
          action={<Badge tone="accent">{plan.label}</Badge>}
        />
        <CardBody className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--fg-secondary)]">Generations this month</span>
            <span className="font-medium text-[var(--fg)]">
              {usage === null ? "—" : `${usage} / ${plan.aiGenerationsPerMonth}`}
            </span>
          </div>
          <Progress value={percent} tone="accent" />
          <p className="text-xs text-[var(--fg-muted)]">
            {usage === null
              ? "Loading usage…"
              : percent >= 90
                ? "You are approaching your monthly limit."
                : "Generations reset at the start of each month."}
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Account" />
        <CardBody className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--fg)]">{ctx.user.name}</p>
              <p className="text-xs text-[var(--fg-muted)]">{ctx.user.email}</p>
            </div>
            <Button size="sm" variant="outline" onClick={signOut}>
              Sign out
            </Button>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Data" />
        <CardBody className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--fg)]">Startup data</p>
              <p className="text-xs text-[var(--fg-muted)]">The dashboard, blueprint and AI history for your current startup.</p>
            </div>
            <Badge tone="default">Persisted</Badge>
          </div>
          <p className="text-xs text-[var(--fg-muted)]">
            Data export and full account deletion are coming soon.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}