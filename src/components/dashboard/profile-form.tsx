"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input, Field } from "@/components/ui/input";
import { fetcher } from "@/lib/utils";
import type { StartupProfile } from "@/lib/types";

export function ProfileForm({ startupId, profile }: { startupId: string; profile: StartupProfile }) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    idea: profile.idea,
    audience: profile.audience,
    problem: profile.problem,
    monetization: profile.monetization,
  });

  async function save() {
    setSaving(true);
    try {
      await fetcher("/api/profile", {
        method: "PUT",
        body: JSON.stringify({ startupId, ...form }),
      });
      toast("Profile saved", "success");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Save failed", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <Field label="The idea — one or two honest sentences">
        <Input value={form.idea} onChange={(e) => setForm((f) => ({ ...f, idea: e.target.value }))} placeholder="What are you building, and for whom? Why now?" />
      </Field>
      <Field label="Who it's for — the first paying customer">
        <Input value={form.audience} onChange={(e) => setForm((f) => ({ ...f, audience: e.target.value }))} placeholder="Describe the 500 people you can reach this year." />
      </Field>
      <Field label="The problem — why this hurts enough to pay">
        <Input value={form.problem} onChange={(e) => setForm((f) => ({ ...f, problem: e.target.value }))} placeholder="What's broken today, and what does it cost them?" />
      </Field>
      <Field label="The money — how this becomes revenue">
        <Input value={form.monetization} onChange={(e) => setForm((f) => ({ ...f, monetization: e.target.value }))} placeholder="What do they pay, and how?" />
      </Field>
      <div className="flex justify-end">
        <Button size="sm" onClick={save} loading={saving}>Save profile</Button>
      </div>
    </div>
  );
}