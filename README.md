# VALTORA

VALTORA is a premium AI co-founder platform. It turns a raw startup idea into a complete, structured, persisted startup — market intelligence, customer personas, competitor analysis, MVP plans, tech architecture, roadmaps, and a launch plan.

**Zorvyn AI** acts as your AI co-founder: every result is a real, structured, database-persisted startup asset (not just chat text), and every section can be regenerated or edited individually.

## Stack

- **Next.js 16** (App Router, React 19, TypeScript, Tailwind CSS v4)
- **Prisma 7** + SQLite locally (`@prisma/adapter-libsql`), PostgreSQL-ready
- **Groq** (server-side only) for Zorvyn AI generation and chat
- **jose** JWT session cookies, **bcryptjs** password hashing, **zod** validation

## Getting Started

```bash
npm install        # also runs `prisma generate`
cp .env.example dev.env  # if present, or create from .env.example
npx prisma migrate dev   # only if the dev database is missing
npm run dev
```

Environment variables (see `.env`):

```bash
DATABASE_URL="file:./dev.db"        # SQLite locally; PostgreSQL URL in production
GROQ_API_KEY=...                    # enables Zorvyn AI generation & chat
AUTH_SECRET=...                     # fallback: "valtora-dev-secret-change-me"
```

> **AI is disabled until `GROQ_API_KEY` is set** — generation and chat return a 503 with a clear message.

## Scripts

```bash
npm run dev        # development server
npm run build      # prisma generate + next build
npm run start      # production server
npm run lint       # eslint
npx prisma studio  # inspect the database
```

## Auth & Data Model

Users sign up/log in, create one or more startups via the onboarding flow, and Zorvyn generates a blueprint across 16 sections (`StartupSection` rows keyed per startup). All AI activity is recorded with token usage against per-plan monthly limits:

- Free: 1 startup, 20 generations/month
- Pro: 10 startups, 200 generations/month
- Founder: 100 startups, 1000 generations/month

Core models: `User`, `Startup`, `StartupSection`, `Feature`, `Task`, `StartupDecision`, `StartupVersion`, `AiConversation`, `AiMessage`, `AiGeneration`, `Notification`, `Document`, `Usage`, `Subscription`.

## Prod Notes

- The generated client lives in `src/generated/prisma` (gitignored); `npm run build` regenerates it. Production uses Postgres — change the `provider` in `prisma/schema.prisma` to `postgresql`, set `DATABASE_URL`, and run `npx prisma migrate deploy`.
- The AI provider is a thin wrapper (`src/lib/ai/provider.ts`) so providers can be swapped per the `AI_PROVIDER` env var.