import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import {
  Sparkles,
  FileText,
  TrendingUp,
  Swords,
  Users,
  Rocket,
  Cpu,
  Map,
  Megaphone,
  Send,
  Package,
  ArrowRight,
  Check,
  Menu,
  Quote,
} from "lucide-react";

const navLinks = [
  { href: "#product", label: "Product" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#intelligence", label: "Intelligence" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "Resources" },
];

const problemList = [
  { title: "Scattered research", desc: "Market, customers, and competitors live in twenty different tabs." },
  { title: "Unclear product scope", desc: "Features balloon before a single customer validates them." },
  { title: "Poor prioritization", desc: "Everything feels urgent, so the real next move stays hidden." },
  { title: "Competitive uncertainty", desc: "You don't know who you're really competing against — or where the gap is." },
  { title: "Technical complexity", desc: "Scaling, architecture, and security decisions feel overwhelming alone." },
  { title: "Launch planning", desc: "Launch day arrives with no campaign, no metrics, and no feedback loop." },
];

const howItWorks = [
  { num: "01", title: "Describe the idea", desc: "In one sentence. \"An AI platform that helps small manufacturers predict machine failures.\"" },
  { num: "02", title: "VALTORA understands it", desc: "Zorvyn, your AI co-founder, interprets the idea within your startup context." },
  { num: "03", title: "VALTORA structures the opportunity", desc: "Market, customers, competitors, and business model take shape as structured assets." },
  { num: "04", title: "VALTORA generates the blueprint", desc: "A complete, editable, linked startup blueprint arrives in under a minute." },
  { num: "05", title: "VALTORA helps you execute", desc: "Roadmap, MVP, marketing, and launch plan — with continuous next actions." },
];

const intelligence = [
  { icon: TrendingUp, title: "Market Intelligence", desc: "TAM, SAM, SOM, growth drivers, and honest assumptions — clearly labeled." },
  { icon: Swords, title: "Competitor Intelligence", desc: "A comparison matrix showing your differentiation opportunity." },
  { icon: Users, title: "Customer Intelligence", desc: "Personas with goals, pain points, and willingness-to-pay hypotheses." },
  { icon: Package, title: "Product Intelligence", desc: "Features prioritized by impact × confidence ÷ effort." },
];

const features = [
  { icon: Sparkles, title: "AI Co-Founder", desc: "Zorvyn, a startup-aware AI that knows your context and history." },
  { icon: FileText, title: "Startup Blueprint", desc: "Vision, market, product, MVP, and more — all editable and linked." },
  { icon: TrendingUp, title: "Market Analysis", desc: "Structured market intelligence without fabricated research." },
  { icon: Swords, title: "Competitor Intelligence", desc: "Know the landscape and your wedge." },
  { icon: Rocket, title: "MVP Generator", desc: "Generate → review → approve → roadmap." },
  { icon: Cpu, title: "Technical Architect", desc: "Frontend, backend, database, and infrastructure plans." },
  { icon: Map, title: "Roadmap", desc: "Interactive execution plan with priorities." },
  { icon: Megaphone, title: "Marketing", desc: "Positioning, messaging, and acquisition channels." },
  { icon: Send, title: "Launch", desc: "A checklist-driven launch plan with completion tracking." },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    desc: "Validate a single idea.",
    features: ["1 startup", "Startup blueprint", "20 AI generations / month", "Dashboard & next actions"],
    cta: "Start Free",
    href: "/signup",
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    desc: "For founders building seriously.",
    features: [
      "10 startups",
      "Advanced AI · 200 generations / month",
      "Market & competitor intelligence",
      "MVP generator & technical architecture",
      "Interactive roadmap",
      "Export suite",
    ],
    cta: "Start Pro",
    href: "/signup",
    highlight: true,
  },
  {
    name: "Founder",
    price: "$99",
    period: "/month",
    desc: "For teams and power founders.",
    features: [
      "100 startups",
      "Highest AI usage · 1000 generations / month",
      "Team collaboration",
      "AI automation",
      "Advanced reports",
      "Priority processing",
    ],
    cta: "Start Founder",
    href: "/signup",
  },
];

const faqs = [
  { q: "Is VALTORA another AI chatbot?", a: "No. VALTORA is a structured startup operating system. Zorvyn the AI generates real, persisted, linked startup assets — market intelligence, MVP plans, roadmaps — not just chat text." },
  { q: "Are your market numbers real?", a: "We clearly label every estimate, assumption, and AI analysis. VALTORA never displays fabricated market statistics as verified fact." },
  { q: "Do I need technical skills?", a: "No. VALTORA handles the analysis, architecture, and planning. You focus on decisions and execution." },
  { q: "Can I edit AI output?", a: "Everything is editable and persisted. Regenerate a single section without rebuilding your whole blueprint." },
  { q: "What does the Free plan include?", a: "One startup, a full blue print, and 20 AI generations per month — enough to validate an idea." },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Sticky nav */}
      <header className="sticky top-0 z-50 border-b border-[var(--border-soft)] bg-[var(--bg)]/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="text-lg font-bold tracking-tight text-[var(--fg)]">
            VALTORA
          </Link>
          <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="text-sm font-medium text-[var(--fg-secondary)] transition-colors hover:text-[var(--fg)]">
                {l.label}
              </a>
            ))}
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            <Link href="/login" className="text-sm font-medium text-[var(--fg-secondary)] hover:text-[var(--fg)]">
              Sign In
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent-fg)] hover:bg-[var(--accent-soft)]"
            >
              Start Building
            </Link>
          </div>
          <button className="rounded-lg p-2 text-[var(--fg-secondary)] md:hidden" aria-label="Open menu">
            <Menu className="size-5" />
          </button>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,107,255,0.12),transparent_55%)]" />
          <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-24 text-center">
            <Badge tone="accent" className="mb-6 animate-fade-up">
              <Sparkles className="size-3" /> Your AI Co-Founder
            </Badge>
            <h1 className="mx-auto max-w-3xl animate-fade-up text-4xl font-bold leading-[1.1] tracking-tight text-[var(--fg)] md:text-6xl">
              Turn an idea into{" "}
              <span className="text-gradient">a company.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl animate-fade-up text-base leading-relaxed text-[var(--fg-secondary)] md:text-lg">
              VALTORA is your AI co-founder for validating ideas, understanding markets,
              designing products, planning technology, and launching with confidence.
            </p>
            <div className="mt-8 flex animate-fade-up flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/signup">
                <Button size="lg">
                  Build My Startup <ArrowRight className="size-4" />
                </Button>
              </Link>
              <a href="#product">
                <Button size="lg" variant="outline">
                  Explore VALTORA
                </Button>
              </a>
            </div>
          </div>

          {/* Hero live preview */}
          <div className="mx-auto max-w-4xl px-4 pb-16">
            <div className="relative rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl animate-fade-up">
              <div className="mb-5 grid grid-cols-3 gap-4">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--fg-muted)]">Startup Score</p>
                  <p className="mt-1 text-3xl font-bold tracking-tight text-[var(--fg)]">82<span className="text-sm font-medium text-[var(--fg-muted)]">/100</span></p>
                  <Progress value={82} tone="success" className="mt-2" />
                </div>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--fg-muted)]">Current Stage</p>
                  <p className="mt-1 text-sm font-semibold text-[var(--fg)]">MVP Development</p>
                </div>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--fg-muted)]">MVP Progress</p>
                  <p className="mt-1 text-sm font-semibold text-[var(--fg)]">6/14 core features</p>
                  <Progress value={43} className="mt-2" />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-[var(--border-soft)] bg-[var(--elevated)] p-4">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--fg-muted)]">AI Insight</p>
                  <p className="mt-2 text-xs leading-relaxed text-[var(--fg-secondary)]">
                    Your MVP lists 14 features. Zorvyn recommends focusing on 6 core capabilities to ship faster.
                  </p>
                </div>
                <div className="rounded-xl border border-[var(--border-soft)] bg-[var(--elevated)] p-4">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--fg-muted)]">Market Snapshot</p>
                  <div className="mt-2 space-y-1.5 text-xs text-[var(--fg-secondary)]">
                    <p>TAM · $4.8B <span className="text-[var(--fg-muted)]">(estimate)</span></p>
                    <p>Competitors mapped · 6</p>
                    <p>Differentiation opportunity · identified</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 rounded-xl border border-[var(--border-soft)] bg-[var(--elevated)] p-4">
                <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--fg-muted)]">Next Best Action</p>
                <p className="mt-1.5 text-sm font-medium text-[var(--fg)]">
                  Validate willingness to pay with 10 target customer interviews.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PROBLEM / SOLUTION */}
        <section className="border-y border-[var(--border-soft)] bg-[var(--surface)]">
          <div className="mx-auto max-w-6xl px-4 py-20">
            <div className="grid gap-12 md:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[var(--accent)]">The problem</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--fg)]">
                  Founders drown in chaos before they can execute.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-[var(--fg-secondary)]">
                  Great startup ideas die from disorganization, not lack of ambition. Research fragmented,
                  priorities unclear, and nobody to pressure-test you.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {problemList.map((p) => (
                  <div key={p.title} className="rounded-xl border border-[var(--border-soft)] bg-[var(--elevated)] p-4">
                    <p className="text-sm font-semibold text-[var(--fg)]">{p.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-[var(--fg-muted)]">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-16 rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-8 md:p-12">
              <div className="grid items-center gap-8 md:grid-cols-2">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-[var(--accent)]">The solution</p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--fg)]">
                    One operating system for your entire startup.
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-[var(--fg-secondary)]">
                    VALTORA connects the whole lifecycle — idea, market, product, technology, roadmap,
                    marketing, launch — so every decision builds on the last.
                  </p>
                </div>
                <div className="rounded-xl border border-[var(--border-soft)] bg-[var(--surface)] p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge>Idea</Badge>
                    <ArrowRight className="size-3 text-[var(--fg-muted)]" />
                    <Badge>Validation</Badge>
                    <ArrowRight className="size-3 text-[var(--fg-muted)]" />
                    <Badge tone="accent">Market</Badge>
                    <ArrowRight className="size-3 text-[var(--fg-muted)]" />
                    <Badge>Product</Badge>
                    <ArrowRight className="size-3 text-[var(--fg-muted)]" />
                    <Badge>MVP</Badge>
                    <ArrowRight className="size-3 text-[var(--fg-muted)]" />
                    <Badge tone="success">Launch</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-20">
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--accent)]">How it works</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--fg)]">From one sentence to a company</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-5">
            {howItWorks.map((s) => (
              <div key={s.num} className="relative rounded-xl border border-[var(--border-soft)] bg-[var(--surface)] p-5">
                <span className="font-mono text-xs text-[var(--accent)]">{s.num}</span>
                <h3 className="mt-3 text-sm font-semibold text-[var(--fg)]">{s.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-[var(--fg-muted)]">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 md:p-10">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-xl border border-[var(--border-soft)] bg-[var(--bg)] p-5">
                <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--fg-muted)]">One-sentence idea</p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--fg-secondary)]">
                  &ldquo;I want to build an AI platform that helps small manufacturers predict machine failures.&rdquo;
                </p>
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--fg-muted)]">Complete startup blueprint</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {["Problem", "Target market", "Personas", "Competitors", "Business model", "Pricing", "MVP", "Roadmap", "Launch"].map((tag) => (
                    <Badge key={tag} tone="accent">✓ {tag}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* INTELLIGENCE */}
        <section id="intelligence" className="border-y border-[var(--border-soft)] bg-[var(--surface)]">
          <div className="mx-auto max-w-6xl px-4 py-20">
            <div className="text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--accent)]">Intelligence</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--fg)]">
                Four kinds of intelligence, one connected platform
              </h2>
            </div>
            <div className="mt-12 grid gap-4 md:grid-cols-4">
              {intelligence.map((f) => (
                <div key={f.title} className="rounded-xl border border-[var(--border-soft)] bg-[var(--bg)] p-5">
                  <f.icon className="size-5 text-[var(--accent)]" />
                  <h3 className="mt-3 text-sm font-semibold text-[var(--fg)]">{f.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-[var(--fg-muted)]">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="mx-auto max-w-6xl px-4 py-20">
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--accent)]">Features</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--fg)]">
              Everything your startup needs to go from idea to execution
            </h2>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-xl border border-[var(--border-soft)] bg-[var(--surface)] p-5 transition-colors hover:border-[var(--border)]">
                <f.icon className="size-5 text-[var(--accent)]" />
                <h3 className="mt-3 text-sm font-semibold text-[var(--fg)]">{f.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-[var(--fg-muted)]">{f.desc}</p>
              </div>
            ))}
          </div>
          <Card className="mt-12 p-8">
            <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[var(--accent)]">Signature feature</p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--fg)]">
                  AI conversations that turn into actions
                </h3>
                <p className="mt-2 max-w-lg text-sm leading-relaxed text-[var(--fg-secondary)]">
                  When Zorvyn suggests something, you can turn it into a structured product action —
                  an MVP revision, an interview plan, a pricing experiment.
                </p>
              </div>
              <div className="rounded-xl border border-[var(--border-soft)] bg-[var(--elevated)] p-4 text-xs text-[var(--fg-secondary)]">
                <p><Quote className="mb-1 inline size-3 text-[var(--accent)]" /> I recommend reducing your MVP from 12 features to 5.</p>
                <div className="mt-2 flex gap-2">
                  <Badge tone="accent">Create MVP Revision</Badge>
                  <Badge>Ask a question</Badge>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* PRICING */}
        <section id="pricing" className="border-y border-[var(--border-soft)] bg-[var(--surface)]">
          <div className="mx-auto max-w-6xl px-4 py-20">
            <div className="text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--accent)]">Pricing</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--fg)]">Start free. Scale when you validate.</h2>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {plans.map((p) => (
                <div
                  key={p.name}
                  className={p.highlight
                    ? "relative rounded-2xl border border-[var(--accent)] bg-[var(--bg)] p-6"
                    : "rounded-2xl border border-[var(--border-soft)] bg-[var(--bg)] p-6"}
                >
                  {p.highlight && (
                    <span className="absolute -top-3 left-6 rounded-full bg-[var(--accent)] px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--accent-fg)]">
                      Most popular
                    </span>
                  )}
                  <h3 className="text-lg font-semibold text-[var(--fg)]">{p.name}</h3>
                  <p className="mt-1 text-xs text-[var(--fg-muted)]">{p.desc}</p>
                  <p className="mt-4 text-3xl font-bold tracking-tight text-[var(--fg)]">
                    {p.price}<span className="text-sm font-medium text-[var(--fg-muted)]">{p.period}</span>
                  </p>
                  <ul className="mt-5 space-y-2.5">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs text-[var(--fg-secondary)]">
                        <Check className="mt-0.5 size-3.5 shrink-0 text-[var(--success)]" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href={p.href} className="mt-6 block">
                    <Button variant={p.highlight ? "primary" : "secondary"} fullWidth>
                      {p.cta}
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-3xl px-4 py-20">
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--accent)]">Resources</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--fg)]">Frequently asked questions</h2>
          </div>
          <div className="mt-10 space-y-3">
            {faqs.map((f) => (
              <details key={f.q} className="group rounded-xl border border-[var(--border-soft)] bg-[var(--surface)] p-5">
                <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-[var(--fg)]">
                  {f.q}
                  <ArrowRight className="size-4 shrink-0 text-[var(--fg-muted)] transition-transform group-open:rotate-90" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-[var(--fg-secondary)]">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="relative overflow-hidden border-t border-[var(--border-soft)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(124,107,255,0.15),transparent_60%)]" />
          <div className="relative mx-auto max-w-3xl px-4 py-24 text-center">
            <h2 className="text-4xl font-bold tracking-tight text-[var(--fg)]">
              Your next company starts with an idea.
            </h2>
            <p className="mt-4 text-base text-[var(--fg-secondary)]">
              Join VALTORA and let Zorvyn turn it into a structured, executable startup.
            </p>
            <div className="mt-8">
              <Link href="/signup">
                <Button size="lg">
                  Build with VALTORA <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-xs text-[var(--fg-muted)]">From idea to execution.</p>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--border-soft)]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row">
          <Link href="/" className="text-sm font-bold tracking-tight text-[var(--fg)]">
            VALTORA
          </Link>
          <p className="text-xs text-[var(--fg-muted)]">Your AI Co-Founder · Turn an idea into a company.</p>
          <div className="flex gap-4 text-xs text-[var(--fg-muted)]">
            <a href="#pricing" className="hover:text-[var(--fg)]">Pricing</a>
            <a href="#faq" className="hover:text-[var(--fg)]">FAQ</a>
            <Link href="/login" className="hover:text-[var(--fg)]">Sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}