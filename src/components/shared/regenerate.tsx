"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { useToast } from "@/components/ui/toast";
import { fetcher } from "@/lib/utils";

export function Regenerate({
  kind,
  label = "Regenerate",
  startupId,
  onDone,
  confirm,
}: {
  kind: string;
  label?: string;
  startupId: string;
  onDone?: (result: unknown) => void;
  confirm?: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  async function run() {
    if (confirm && !window.confirm(confirm)) return;
    setLoading(true);
    try {
      const res = await fetcher<{ ok: boolean; result: unknown }>("/api/ai/generate", {
        method: "POST",
        body: JSON.stringify({ kind, startupId }),
      });
      toast("Regenerated. Changes are saved.", "success");
      onDone?.(res.result);
      router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Generation failed", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant="soft" size="sm" onClick={run} loading={loading} icon={<Icon name="refresh" size={13} />}>
      {loading ? "Working…" : label}
    </Button>
  );
}