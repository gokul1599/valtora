"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input, Field } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { fetcher } from "@/lib/utils";
import type { User, Subscription } from "@/lib/types";

export function SettingsPage({ user, subscription }: { user: User; subscription: Subscription | null }) {
  const { toast } = useToast();

  const [name, setName] = useState(user.name);
  const [savingName, setSavingName] = useState(false);
  const [pw, setPw] = useState({ current: "", next: "" });
  const [savingPw, setSavingPw] = useState(false);

  async function saveName() {
    if (name.trim().length < 2) return;
    setSavingName(true);
    try {
      await fetcher("/api/settings/profile", { method: "PUT", body: JSON.stringify({ name }) });
      toast("Name updated", "success");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Save failed", "error");
    } finally {
      setSavingName(false);
    }
  }

  async function savePassword() {
    setSavingPw(true);
    try {
      await fetcher("/api/settings/profile", {
        method: "POST",
        body: JSON.stringify({ currentPassword: pw.current, newPassword: pw.next }),
      });
      setPw({ current: "", next: "" });
      toast("Password changed", "success");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not change password", "error");
    } finally {
      setSavingPw(false);
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="card p-5">
        <h2 className="text-sm font-semibold text-[var(--fg)]">Profile</h2>
        <p className="mt-0.5 text-xs text-[var(--muted)]">{user.email} · signed in with {user.authProvider}</p>
        <div className="mt-4 space-y-3">
          <Field label="Display name">
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Button size="sm" onClick={saveName} loading={savingName} disabled={name.trim().length < 2}>Save name</Button>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="text-sm font-semibold text-[var(--fg)]">Password</h2>
        <p className="mt-0.5 text-xs text-[var(--muted)]">
          {user.authProvider === "google" ? "Password login isn't used for Google accounts." : "Change your login password."}
        </p>
        {user.authProvider === "credentials" && (
          <div className="mt-4 space-y-3">
            <Field label="Current password">
              <Input type="password" value={pw.current} onChange={(e) => setPw((f) => ({ ...f, current: e.target.value }))} />
            </Field>
            <Field label="New password (8+ characters)">
              <Input type="password" value={pw.next} onChange={(e) => setPw((f) => ({ ...f, next: e.target.value }))} />
            </Field>
            <Button size="sm" onClick={savePassword} loading={savingPw} disabled={pw.next.length < 8}>Change password</Button>
          </div>
        )}
      </div>

      <div className="card p-5 lg:col-span-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-[var(--fg)]">Plan</h2>
            <p className="mt-0.5 text-xs text-[var(--muted)]">
              {subscription
                ? `${capitalize(subscription.plan)} plan · ${subscription.status}${subscription.currentPeriodEnd ? ` · renews ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}` : ""}`
                : "Free plan — AI generations included in your monthly allowance."}
            </p>
          </div>
          <Badge tone={user.plan === "founder" ? "brand" : "neutral"}>{capitalize(user.plan)}</Badge>
        </div>
      </div>
    </div>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}