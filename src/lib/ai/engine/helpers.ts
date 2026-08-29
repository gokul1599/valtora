import type { JourneyStage, StartupStage } from "../../types";

export function titleCase(s: string): string {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

export function lower(s: string): string {
  const t = s.trim();
  return t ? t.charAt(0).toLowerCase() + t.slice(1) : t;
}

export function capitalize(s: string): string {
  const t = s.trim();
  return t ? t.charAt(0).toUpperCase() + t.slice(1) : t;
}

export function sentenceCase(s: string): string {
  const t = s.trim();
  return t ? t[0].toUpperCase() + t.slice(1) : t;
}

export function firstSentence(paragraph: string): string {
  const m = paragraph.match(/^[^.]+\./);
  return m ? m[0] : paragraph;
}

export function sentences(paragraph: string): string[] {
  return paragraph
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Pull distinctive words from a block of text for phrase-level reuse. */
export function keywords(text: string, top = 5): string[] {
  const stop = new Set([
    "the", "a", "an", "and", "or", "but", "for", "with", "that", "this",
    "these", "those", "from", "into", "onto", "about", "which", "what",
    "when", "where", "how", "who", "their", "them", "they", "there", "can",
    "could", "will", "would", "should", "have", "having", "make", "makes",
    "making", "help", "helps", "helping", "build", "builds", "building",
    "people", "user", "users", "customer", "customers", "product", "business",
    "startup", "company", "want", "wanting", "need", "needs", "get", "way",
    "world", "still", "just", "also", "one", "every", "work", "works",
  ]);
  const counts = new Map<string, number>();
  for (const word of text.toLowerCase().split(/[^a-z0-9']+/)) {
    if (word.length < 4 || stop.has(word)) continue;
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, top)
    .map(([w]) => w);
}

export function stageFromJourney(journey: JourneyStage): StartupStage {
  switch (journey) {
    case "just-idea":
    case "researching":
      return "idea";
    case "building-mvp":
      return "mvp";
    case "have-mvp":
      return "beta";
    case "have-customers":
      return "launch";
    case "growing":
      return "growth";
  }
}

export function stageLabel(stage: StartupStage): string {
  const map: Record<StartupStage, string> = {
    idea: "Idea",
    validation: "Validation",
    mvp: "MVP",
    beta: "Beta",
    launch: "Launch",
    growth: "Growth",
  };
  return map[stage];
}

export function journeyLabel(j: JourneyStage): string {
  const map: Record<JourneyStage, string> = {
    "just-idea": "Just an idea",
    researching: "Researching",
    "building-mvp": "Building MVP",
    "have-mvp": "Have an MVP",
    "have-customers": "Have customers",
    growing: "Growing",
  };
  return map[j];
}

/** Industry heuristics powering market sizing. Clearly marked as estimates. */
export function industryMultipliers(idea: string): {
  tamBase: number;
  growth: string;
  trendLabels: string[];
} {
  const lower = idea.toLowerCase();
  if (/(solar|energy|climate|battery|esg|carbon)/.test(lower))
    return {
      tamBase: 1_500_000_000_000,
      growth: "plus 12–15% annually",
      trendLabels: [
        "Sustainability mandates and carbon reporting are becoming regulatory",
        "Energy costs are rising enough to shift buying behavior",
        "Green financing pools are growing quickly",
      ],
    };
  if (/(health|fitness|wellness|medic|clinic|therapy)/.test(lower))
    return {
      tamBase: 6_000_000_000_000,
      growth: "plus 8–10% annually",
      trendLabels: [
        "Consumers increasingly pay out-of-pocket for wellness",
        "Wearables and remote care expand addressable moments",
        "Employer benefits providers are consolidating around prevention",
      ],
    };
  if (/(finance|fintech|money|payment|bank|invest|loan)/.test(lower))
    return {
      tamBase: 12_000_000_000_000,
      growth: "plus 10–14% annually",
      trendLabels: [
        "Embedded finance is becoming a default expectation",
        "Digital-first banks gain share from incumbents",
        "Regulation is creating both risk and opportunity (open banking)",
      ],
    };
  if (/(school|learn|education|student|course|training)/.test(lower))
    return {
      tamBase: 7_000_000_000_000,
      growth: "plus 7–9% annually",
      trendLabels: [
        "Lifelong reskilling demand continues climbing",
        "Employers fund more of the learning stack",
        "AI tutoring makes 1:1 instruction economically viable",
      ],
    };
  if (/(restaurant|catering|food|meal|kitchen)/.test(lower))
    return {
      tamBase: 8_000_000_000_000,
      growth: "plus 5–7% annually",
      trendLabels: [
        "Online ordering share is still rising",
        "Supply chain fragility pushes operators to manage cost software",
        "Ghost kitchens press on margins and margin data",
      ],
    };
  if (/(market|shop|ecommerce|retail|commerce|store|saas|software|platform|app|tool|b2b)/.test(lower))
    return {
      tamBase: 200_000_000_000,
      growth: "plus 12–18% annually",
      trendLabels: [
        "Businesses keep shifting to vertical SaaS and tooling",
        "Buyers consolidate vendors and want fewer, deeper tools",
        "AI-native features are becoming table stakes in software",
      ],
    };
  return {
    tamBase: 50_000_000_000,
    growth: "plus 8–12% annually",
    trendLabels: [
      "Digitization is moving this category online faster than expected",
      "Buyers increasingly evaluate in weeks, not quarters",
      "AI erosion is lowering switching costs and startup barriers",
    ],
  };
}

/** Rough willingness-to-pay signal based on who gets the product. */
export function willingnessSignal(audience: string): { strength: number; note: string } {
  const lower = audience.toLowerCase();
  if (/(business|company|enterprise|smb|b2b|team|agency|startup|founder|professional|firm|shop|restaurant|clinic|school|saas)/.test(lower))
    return { strength: 0.8, note: "Business buyers pay for productivity gains and can justify a monthly fee quickly." };
  if (/(developer|engineer|designer|creator|consultant|freelancer)/.test(lower))
    return { strength: 0.65, note: "Individual professionals pay for time saved but churn if value isn't visible within a few weeks." };
  if (/(consumer|customer|home|parent|student|patient|people|everyone|individual)/.test(lower))
    return { strength: 0.35, note: "Consumer pricing pressure is high; monetization usually needs high volume or freemium." };
  return { strength: 0.5, note: "Willingness to pay is unclear — run paid-interest tests before building." };
}

/** Build a working startup name from the founder's idea text. */
export function deriveStartupName(idea: string): string {
  const kws = keywords(idea, 5).filter((w) => w.length >= 4);
  const base = kws[0] ?? "venture";
  const joined = titleCase(base.replace(/[^a-z0-9]/gi, ""));
  const suffix = /(s|x|z)$/.test(joined.toLowerCase()) ? "" : "";
  const suffixPool = ["", "", "Fund", "Ops"];
  const pick = suffixPool[hash(idea) % suffixPool.length];
  return `${joined}${pick || suffix}`.slice(0, 24) || "Untitled Venture";
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return Math.abs(h);
}