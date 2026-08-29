import { LandingNav } from "@/components/landing/navbar";
import { HeroPreview } from "@/components/landing/hero-preview";
import { Wordmark } from "@/components/ui/logo";

export default function LandingPage() {
  return (
    <main className="bg-[var(--bg)] text-[var(--fg)]">
      <LandingNav />
      <Hero />
      <Problem />
      <HowItWorks />
      <Capabilities />
      <Workspace />
      <Example />
      <Competitive />
      <ProductPlanning />
      <TechnicalPlanning />
      <LaunchPlanning />
      <Pricing />
      <Faq />
      <FinalCta />
      <Footer />
    </main>
  );
}

/* ── Sections ─────────────────────────────────────────────── */

function Section({
  id,
  eyebrow,
  title,
  sub,
  children,
  className = "",
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  sub?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24 ${className}`}>
      <div className="mx-auto mb-12 max-w-2xl text-center">
        {eyebrow && (
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-500)]">
            {eyebrow}
          </p>
        )}
        <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
        {sub && <p className="mt-4 text-pretty text-[0.9375rem] leading-relaxed text-[var(--muted)]">{sub}</p>}
      </div>
      {children}
    </section>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden pb-10 pt-16 sm:pt-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,color-mix(in_oklab,var(--color-brand-500)_7%,transparent),transparent)]" />
      <div className="relative mx-auto max-w-6xl px-4 pt-4 text-center sm:px-6">
        <p className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-3.5 py-1 text-xs font-medium text-[var(--muted)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-success)]" />
          Trusted by first-time founders and serial builders
        </p>
        <h1 className="mx-auto max-w-3xl text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl">
          Turn an idea into a{" "}
          <span className="text-[var(--color-brand-500)]">startup.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-[var(--muted)] sm:text-lg">
          ForgeAI acts as your AI co-founder — validating your idea, researching the
          market, designing your MVP, and turning your vision into an executable startup plan.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="/signup"
            className="btn btn-primary h-12 w-full px-7 text-base sm:w-auto"
          >
            Build My Startup
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a href="#how" className="btn btn-ghost h-12 w-full px-7 text-base sm:w-auto">
            See How It Works
          </a>
        </div>
        <div className="mt-14 sm:mt-16">
          <HeroPreview />
        </div>
      </div>
    </section>
  );
}

function Problem() {
  const items = [
    {
      title: "Most startups die of fog, not competition.",
      body: "The killer isn't a flawed idea — it's an unvalidated one. Founders burn months building products no one asked for, chasing markets they never sized, and pricing on feelings instead of evidence.",
    },
    {
      title: "Founders are solo, but building is a team sport.",
      body: "Every decision needs a different hat: researcher, product designer, technical architect, growth lead. Early-stage founders wear all of them at once — while their startup waits.",
    },
    {
      title: "Knowledge exists. Context doesn't.",
      body: "You can watch a hundred startup frameworks. None of them know what YOUR customers said, what YOUR competitors charge, or what YOUR thin advantage is. Generic advice is exactly what you can't act on.",
    },
  ];
  return (
    <Section
      eyebrow="The problem"
      title="Real companies fail for boring reasons"
      sub="The biggest risks are invisible at the start — and they compound quietly while you build the wrong thing."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((it) => (
          <div key={it.title} className="card card-hover p-6">
            <h3 className="text-[0.9375rem] font-semibold tracking-tight">{it.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{it.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Tell it what you're building",
      body: "Five honest questions: the idea, the people, the problem, the money, and how far you've gotten.",
    },
    {
      n: "02",
      title: "Get your Startup Blueprint",
      body: "Sixteen structured sections — problem, market, competition, product, tech, launch. Editable, not a lecture.",
    },
    {
      n: "03",
      title: "Work with your AI co-founder",
      body: "Ask questions, cut your MVP to five features, set pricing, plan the launch. Every answer converts into a workspace asset.",
    },
    {
      n: "04",
      title: "Executing, not planning",
      body: "Roadmaps you can drag, MVPs you can build to spec, launch checklists you can actually check off.",
    },
  ];
  return (
    <Section
      id="how"
      eyebrow="How ForgeAI works"
      title="From rough idea to operating plan"
      sub="It doesn't tell you what a startup looks like in general. It converts your specific decisions into assets you can build and ship."
    >
      <div className="grid gap-px overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--border)] md:grid-cols-4">
        {steps.map((s) => (
          <div key={s.n} className="bg-[var(--card)] p-6">
            <span className="font-mono text-sm font-medium text-[var(--color-brand-500)]">{s.n}</span>
            <h3 className="mt-4 text-[0.9375rem] font-semibold tracking-tight">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{s.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Capabilities() {
  const caps = [
    ["Startup Intelligence", "A transparent 7-axis score. Strengths, risks and next actions — labeled as estimates where they are."],
    ["Competitive Intelligence", "Track competitors, their pricing, strengths and the gap you drive into. A live matrix, not a one-time report."],
    ["Market Estimation", "TAM, SAM and SOM with the math shown and the estimates flagged. Triangulate with real research when you're ready."],
    ["Product Builder", "Vision, personas, user stories and a Must/Should/Could/Not-now backlog your team can actually work from."],
    ["MVP Generator", "Objective, core features, screens, data model, APIs and dev tasks. Generate → edit → approve → hand to your team."],
    ["Technical Architect", "Frontend, backend, database, auth, infra and AI architecture diagrams — scoped to where you are today."],
    ["Roadmap", "Five phases from validation to growth. Add tasks, drag them, mark done, set deadlines."],
    ["Marketing & Launch", "Positioning, taglines, channel plans, and a launch checklist that tracks real progress."],
  ];
  return (
    <Section
      id="capabilities"
      eyebrow="Capabilities"
      title="One workspace. Eight working parts."
      sub="Every tool in the box writes into the same live startup record — so nothing you generate ever lives in a vacuum."
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {caps.map(([t, b]) => (
          <div key={t} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
            <span className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-brand-500)]/10 text-[var(--color-brand-500)]">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 2l1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9L12 2z" />
              </svg>
            </span>
            <h3 className="text-[0.875rem] font-semibold tracking-tight">{t}</h3>
            <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-[var(--muted)]">{b}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Workspace() {
  const rows = [
    ["Startup score", "72", "healthy — improve differentiation, tighten monetization", "success"],
    ["Market snapshot", "TAM $5.2T / SAM $340M / SOM $42M", "estimates flagged for verification", "brand"],
    ["Competitors", "3 tracked · 1 verified", "DIY workaround is your real rival", "ai"],
    ["Roadmap", "5 of 12 tasks done", "next: publish paid-interest page", "warning"],
  ];
  return (
    <Section
      eyebrow="Workspace"
      title="Your startup, as a live data model"
      sub="Not a document you read once — a workspace that updates as you make decisions."
    >
      <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]">
        <div className="grid grid-cols-12 gap-3 border-b border-[var(--border)] bg-[var(--surface)] px-5 py-3 text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
          <span className="col-span-4">Area</span>
          <span className="col-span-4">Snapshot</span>
          <span className="col-span-4">Signal</span>
        </div>
        {rows.map(([a, b, c, tone]) => (
          <div key={a} className="grid grid-cols-12 items-center gap-3 border-b border-[var(--border)] px-5 py-4 last:border-0">
            <span className="col-span-4 text-sm font-semibold text-[var(--fg)]">{a}</span>
            <span className="col-span-4 text-sm text-[var(--muted)]">{b}</span>
            <span className="col-span-4 text-sm text-[var(--muted)]">
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${tone === "success" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : tone === "brand" ? "bg-[var(--color-brand-500)]/10 text-[var(--color-brand-500)]" : tone === "ai" ? "bg-[var(--color-ai-500)]/10 text-[var(--color-ai-500)]" : "bg-[var(--color-warning)]/10 text-amber-600 dark:text-amber-400"}`}>
                {c}
              </span>
            </span>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Example() {
  const before = [
    "Rough idea: 'something for restaurants to manage refunds'",
    "No market size, no competitors,\nno pricing logic",
    "Six months of guesswork before\nanyone saw the product",
  ];
  const after = [
    "Named startup with a tagline and stage",
    "16-section blueprint, 7-axis score, market estimates flagged",
    "Feature backlog prioritized, roadmap scheduled, launch checklist live",
  ];
  return (
    <Section
      eyebrow="Transformation"
      title="What one afternoon changes"
      sub="A before-and-after from the founder's seat — the inputs are yours, the structure is ForgeAI's."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Before</p>
          <ul className="space-y-3">
            {before.map((b, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-[var(--muted)]">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-[0.6rem] text-red-500">×</span>
                {b.split("\n").map((l, j) => <span key={j} className="block whitespace-pre-line">{l}</span>)}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-[var(--color-brand-500)]/25 bg-[var(--card)] p-6">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[var(--color-brand-500)]">After</p>
          <ul className="space-y-3">
            {after.map((b, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-[var(--fg)]">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-[0.6rem] text-emerald-500">✓</span>
                {b.split("\n").map((l, j) => <span key={j} className="block whitespace-pre-line">{l}</span>)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

function Competitive() {
  const comps = [
    ["Competitor A", "Full platform, broad", "$49 / mo", "Deep market share", "Your wedge is a roadmap ticket" ],
    ["Manual / DIY", "Spreadsheets + email", "Free-ish", "Zero switching cost", "Does not scale, errors compound"],
    ["Your startup", "One job, finished", "$19", "Specialist depth", "Proven with focus"],
  ];
  return (
    <Section
      eyebrow="Competitive intelligence"
      title="Your positioning, against a real field"
      sub="A live competitive matrix with pricing, strengths and weaknesses — and the gap you drive into."
    >
      <div className="overflow-x-auto">
        <div className="min-w-[640px] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]">
          <div className="grid grid-cols-4 gap-3 border-b border-[var(--border)] bg-[var(--surface)] px-5 py-3 text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
            <span>Player</span>
            <span>Offer</span>
            <span>Pricing</span>
            <span>Playing field</span>
          </div>
          {comps.map(([n, o, p, s, w]) => (
            <div key={n} className={`grid grid-cols-4 items-center gap-3 border-b border-[var(--border)] px-5 py-4 last:border-0 ${n === "Your startup" ? "bg-[var(--color-brand-500)]/5" : ""}`}>
              <span className={`text-sm font-semibold ${n === "Your startup" ? "text-[var(--color-brand-500)]" : "text-[var(--fg)]"}`}>{n}</span>
              <span className="text-sm text-[var(--muted)]">{o}</span>
              <span className="text-sm text-[var(--muted)]">{p}</span>
              <span className="text-sm text-[var(--muted)]">{s} — {w}</span>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

function ProductPlanning() {
  return (
    <Section
      eyebrow="Product planning"
      title="Ship the right ten percent"
      sub="Prioritize with Must / Should / Could / Not now — and a user flow your engineer can build against."
    >
      <div className="grid gap-3 sm:grid-cols-4">
        {[
          ["Must Have", "The one job, done end to end", "border-[var(--color-brand-500)]/40"],
          ["Should Have", "History and sharing", "border-[var(--border)]"],
          ["Could Have", "Reminders, exports", "border-[var(--border)]"],
          ["Not Now", "Teams, SSO, mobile apps", "border-[var(--border)]"],
        ].map(([t, b, c]) => (
          <div key={t} className={`rounded-xl border ${c} bg-[var(--card)] p-5`}>
            <h3 className="text-sm font-semibold tracking-tight">{t}</h3>
            <p className="mt-1.5 text-[0.8125rem] text-[var(--muted)]">{b}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">User flow</p>
        <div className="flex flex-wrap items-center gap-2">
          {["Landing", "Signup", "Onboarding", "Dashboard", "Core Product", "Payment", "Retention"].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <span className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--fg)]">{s}</span>
              {i < 6 && <span className="text-xs text-[var(--muted)]">→</span>}
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

function TechnicalPlanning() {
  const cols = [
    ["Frontend", "Next.js · React · TypeScript · Server components where possible"],
    ["Backend", "Typed API routes · zod validation · ownership checks on every write"],
    ["Database", "Postgres, err on the side of boring · indices on (startupId)"],
    ["Authentication", "Session cookies · OAuth-ready provider seam"],
    ["Infrastructure", "Managed edge/cloud, object storage, no self-managed servers"],
    ["AI", "Provider-abstracted generation with documented fallbacks"],
  ];
  return (
    <Section
      eyebrow="Technical planning"
      title="An architecture your future team can read"
      sub="A generated technical plan scoped to today — not a fantasy of scale — with data models and integrations named."
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cols.map(([t, b]) => (
          <div key={t} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
            <h3 className="text-sm font-semibold tracking-tight">{t}</h3>
            <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-[var(--muted)]">{b}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function LaunchPlanning() {
  const items = ["Product ready", "Landing page", "Pricing", "Analytics", "Authentication", "Payment", "Documentation", "Beta users", "Feedback system", "Launch announcement", "Product Hunt", "Social campaign"];
  return (
    <Section
      eyebrow="Launch planning"
      title="A launch you can actually check off"
      sub="Twelve checklist items with real progress tracking — so launch day stops being a cloud and starts being a sequence."
    >
      <div className="mx-auto grid max-w-xl gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 sm:grid-cols-2">
        {items.slice(0, 8).map((i) => (
          <div key={i} className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-[var(--fg)]">
            <span className="flex h-4 w-4 items-center justify-center rounded border border-[var(--border)] text-xs text-[var(--muted)]">□</span>
            {i}
          </div>
        ))}
        <div className="flex items-center gap-2.5 rounded-lg bg-[var(--surface)] px-2 py-1.5 text-sm">
          <span className="flex h-4 w-4 items-center justify-center rounded bg-[var(--color-success)] text-[0.6rem] text-white">✓</span>
          <span className="text-[var(--fg)]">{items[11]}</span>
        </div>
        <div className="flex items-center gap-2.5 rounded-lg bg-[var(--surface)] px-2 py-1.5 text-sm">
          <span className="flex items-center gap-2">
            <ProgressMini />
            <span className="text-[var(--muted)]">Progress day-by-day</span>
          </span>
        </div>
      </div>
    </Section>
  );
}

function ProgressMini() {
  return (
    <svg width="52" height="10" viewBox="0 0 52 10" className="rounded-full" aria-hidden>
      <rect width="52" height="10" rx="5" fill="var(--surface-2)" />
      <rect width="38" height="10" rx="5" fill="var(--color-success)" />
    </svg>
  );
}

function Pricing() {
  const plans = [
    { name: "Free", price: "$0", tagline: "Run your first idea through the Forge.", features: ["1 active startup", "Basic blueprints", "20 AI generations / month", "Startup score", "Roadmap basics"], cta: "Start free", hot: false },
    { name: "Pro", price: "$29", tagline: "For founders building for real.", features: ["10 startup projects", "Advanced AI analysis", "Competitor intelligence", "MVP generator & technical architect", "Full export suite", "200 AI generations / month"], cta: "Go Pro", hot: true },
    { name: "Founder", price: "$79", tagline: "The full co-founder experience.", features: ["Unlimited projects", "Advanced research & reports", "AI automation & structured actions", "Team collaboration", "1,000 AI generations / month"], cta: "Become a Founder", hot: false },
  ];
  return (
    <Section
      id="pricing"
      eyebrow="Pricing"
      title="Cheaper than six months of guesswork"
      sub="Start free. Upgrade when ForgeAI starts saving you real hours."
    >
      <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-3">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`card flex flex-col p-6 ${p.hot ? "relative border-[var(--color-brand-500)]/60 bg-[var(--color-brand-500)]/4" : ""}`}
          >
            {p.hot && (
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-[var(--color-brand-500)] px-2.5 py-0.5 text-[0.65rem] font-semibold text-white">
                Most popular
              </span>
            )}
            <h3 className="text-base font-semibold">{p.name}</h3>
            <p className="mt-0.5 text-xs text-[var(--muted)]">{p.tagline}</p>
            <p className="mt-4 text-3xl font-semibold tracking-tight">
              {p.price}
              <span className="text-sm font-normal text-[var(--muted)]">/mo</span>
            </p>
            <ul className="mt-5 flex-1 space-y-2.5">
              {p.features.map((f) => (
                <li key={f} className="flex gap-2 text-[0.8125rem] text-[var(--fg)]">
                  <span className="mt-0.5 text-[var(--color-brand-500)]">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <a href="/signup" className={`btn mt-6 w-full ${p.hot ? "btn-primary" : "btn-ghost"}`}>
              {p.cta}
            </a>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Faq() {
  const faqs = [
    ["Do you fabricate research?", "No. Generated market figures are explicitly labeled as estimates, derived from transparent sizing heuristics. Verified research is stored separately and shown as verified. ForgeAI will never dress an estimate up as a fact."],
    ["Is the AI actually creating my plan, or filling templates?", "It generates from your specific inputs using your startup's live context — then you edit the result. The difference: everything you see is grounded in what you told it, and every section is yours to change."],
    ["Can I bring my own AI provider?", "The AI layer is provider-abstracted (OpenAI/Anthropic-compatible) behind environment keys — swap providers without touching the product."],
    ["What happens with my data?", "Your startup data is scoped to your account and never used for training. Authorization is enforced on every request, and exports remove nothing — you keep copies of anything you generate."],
    ["How fast can I go from signup to execution?", "One onboarding pass (about ten minutes) produces your blueprint, score, market snapshot and roadmap. Most founders open the Roadmap or AI Co-Founder next."],
    ["Can I upgrade and downgrade plans?", "Yes. Plan limits are enforced on usage (startup count, monthly AI generations). Billing is wired for Stripe so upgrades respect your current period."],
  ];
  return (
    <Section
      id="faq"
      eyebrow="FAQ"
      title="Straight answers"
    >
      <div className="mx-auto grid max-w-3xl gap-3">
        {faqs.map(([q, a]) => (
          <details key={q} className="group rounded-xl border border-[var(--border)] bg-[var(--card)]">
            <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-[0.9375rem] font-medium text-[var(--fg)] marker:content-none list-none [&::-webkit-details-marker]:hidden">
              {q}
              <span className="text-[var(--muted)] transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="px-5 pb-5 text-sm leading-relaxed text-[var(--muted)]">{a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}

function FinalCta() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
      <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] px-8 py-16 text-center sm:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_0%,color-mix(in_oklab,var(--color-brand-500)_12%,transparent),transparent)]" />
        <div className="relative">
          <h2 className="mx-auto max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
            Your idea is 10 minutes from a plan.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-[var(--muted)]">
            Answer five questions. Get a blueprint, a score, a market snapshot and a roadmap. Then start building for real.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href="/signup" className="btn btn-primary h-12 w-full px-8 text-base sm:w-auto">
              Build My Startup
            </a>
            <a href="/signup" className="btn btn-ghost h-12 w-full px-8 text-base sm:w-auto">
              Create free account
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[var(--border)] py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
        <div className="flex items-center gap-2 opacity-80">
          <Wordmark />
        </div>
        <p className="text-xs text-[var(--muted)]">© {new Date().getFullYear()} ForgeAI. Est. in 2026. Built for founders, by an AI co-founder.</p>
      </div>
    </footer>
  );
}