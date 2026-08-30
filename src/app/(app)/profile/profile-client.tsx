"use client";

import { useState } from "react";
import type { StartupContext } from "@/lib/startup";
import { PLAN_LIMITS } from "@/lib/constants";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { fetcher } from "@/lib/utils";

export function ProfileClient({ ctx }: { ctx: StartupContext }) {
  const { toast } = useToast();
  const [name, setName] = useState(ctx.user.name);
  const [email] = useState(ctx.user.email);
  const [saving, setSaving] = useState(false);
  const plan = PLAN_LIMITS[ctx.user.plan as keyof typeof PLAN_LIMITS] ?? PLAN_LIMITS.free;

  async function save() {
    setSaving(true);
    try {
      const res = await fetcher<{ ok: boolean; user: { name: string } }>("/api/profile", {
        method: "PATCH",
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        toast("Profile updated", "success");
      }
    } catch (err) {
      toast(err instanceof Error ? err.message : "Update failed", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--fg)]">Profile</h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">Your account information and plan.</p>
      </div>

      <Card>
        <CardHeader title="Account" />
        <CardBody className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={email} disabled />
          </div>
          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-[var(--fg-muted)]">Email changes are not yet supported.</p>
            <Button size="sm" onClick={save} loading={saving}>
              Save changes
            </Button>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="Plan"
          action={<Badge tone="accent">{plan.label}</Badge>}
        />
        <CardBody>
          <p className="text-sm text-[var(--fg-secondary)]">{plan.tagline}</p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {plan.features.map((f) => (
              <li key={f} className="text-sm text-[var(--fg-secondary)]">
                • {f}
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>
    </div>
  );
}