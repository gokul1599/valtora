import type { MarketResearch, StartupContext } from "../../types";
import { now } from "../../db/store";
import { industryMultipliers, keywords } from "./helpers";

export function generateMarket(ctx: StartupContext): MarketResearch {
  const { profile } = ctx;
  const mult = industryMultipliers(profile.idea);
  const tamBase = mult.tamBase;
  const kws = keywords(profile.idea, 3);

  return {
    id: `market_${ctx.startup.id}`,
    startupId: ctx.startup.id,
    tam: tamBase,
    sam: tamBase * 0.04,
    som: tamBase * 0.005,
    tamNote: `Top-down estimate across the "softest" industry reading of the idea (${kws[0] ?? "core category"}). Directional only — before quoting this figure, triangulate with bottom-up counts of the actual segment.`,
    samNote: `Estimated slice reachable given geography, segment focus and the product's likely distribution ceiling. Assumes ${profile.audience.slice(0, 60)} is the beachhead.`,
    somNote: `Realistic 24–36 month obtainable share with a focused wedge. Treat as a go-to-market target, not a forecast.`,
    trends: mult.trendLabels,
    growthRate: mult.growth,
    estimationMethod:
      "Top-down industry sizing with bottom-up sanity check pending. Marked as ESTIMATE.",
    verified: false,
    generatedAt: now(),
  };
}