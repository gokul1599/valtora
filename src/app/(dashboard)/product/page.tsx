import { loadDashboardData } from "@/lib/startup";
import { getFeatures } from "@/lib/db";
import { SectionTitle } from "@/components/ui/card";
import { Regenerate } from "@/components/shared/regenerate";
import { FeatureBoard } from "@/components/dashboard/feature-board";

export const dynamic = "force-dynamic";

export default async function ProductPage() {
  const { startup } = await loadDashboardData();
  const features = await getFeatures(startup.id);

  return (
    <div className="space-y-5">
      <SectionTitle
        title="Product & vision"
        sub="Your product vision, and the prioritized feature cut that protects the musts from the wishes."
        action={
          <div className="flex gap-2">
            <Regenerate kind="product-vision" startupId={startup.id} label="Generate vision" confirm="Replace product vision with a fresh generation?" />
            <Regenerate kind="mvp" startupId={startup.id} label="Scope MVP" confirm="Replace the MVP scope with a fresh cut?" />
          </div>
        }
      />

      <FeatureBoard startupId={startup.id} features={features} />
    </div>
  );
}