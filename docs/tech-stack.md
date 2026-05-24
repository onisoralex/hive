# Hive Tech Stack Reference

Canonical reference for all technology available to or used by Hive projects. Two sections: what we *can* use (experience exists), and what we *do* use (active decisions with rationale).

Last updated: 2026-05-24

---

## Section 1: Available Experience

### Frontend & Web

| Technology | Experience | Notes |
|---|---|---|
| React | Comfortable | Used in multiple projects |
| Vite | Comfortable | Build tool / dev server for React SPAs |
| Next.js | Learning | SSR/full-stack React framework; preferred for public tools |
| TypeScript | Comfortable | Preferred over plain JS in all projects |
| CSS / CSS Custom Properties | Comfortable | Variables-first; no scattered literals |
| Tailwind CSS | Available | Utility-first CSS; paired with shadcn/ui |
| Material UI (MUI) | Available | Google Material Design component library; not the default choice |

### Backend & APIs

| Technology | Experience | Notes |
|---|---|---|
| Node.js | Comfortable | Primary backend runtime |
| Express.js | Comfortable | HTTP server / API layer |
| Socket.io | Comfortable | Real-time bidirectional communication |

### Databases & ORMs

| Technology | Experience | Notes |
|---|---|---|
| PostgreSQL | Comfortable | Primary relational database |
| Prisma | Comfortable | ORM for PostgreSQL; used in all relational projects |
| Qdrant | Available | Vector database for embeddings and semantic search |

> **Qdrant payload pattern:** The payload is a first-class citizen, not just metadata. Store source text, summaries, and reconstruction data directly in the payload. When chunking a large document: chunk, embed, and store the authoritative summary in each chunk's payload. At retrieval time, read the summary from payload rather than re-summarizing from source. This guarantees consistency — the same text is returned every time regardless of source availability. Useful for expensive AI-generated summaries you don't want to recompute. The tradeoff: Qdrant payload filtering is weaker than SQL; best used when the retrieval path is "find similar → read associated text", not complex multi-criteria filtering.

### Local AI / LLM

| Technology | Experience | Notes |
|---|---|---|
| llama.cpp | Comfortable | Local LLM inference; runs in Docker in server mode; accessed via HTTP API |
| Ollama | Recommended upgrade | Wrapper around llama.cpp exposing a clean REST API (OpenAI-compatible). Same models, lower integration friction. See note below. |

> **Ollama recommendation:** Ollama wraps llama.cpp with an HTTP API that is OpenAI-compatible — meaning you can use the OpenAI Node.js SDK pointed at `http://localhost:11434` to talk to local models. Since the same models run underneath, switching from raw llama.cpp to Ollama is low-effort and removes the friction of integrating llama.cpp directly. Worth doing before the first project that uses local AI.

> **Claude API / OpenRouter:** Not in active use. The current AI capability comes from llama.cpp (local models) accessed via HTTP. Claude API is a future option when budget allows. OpenRouter (multi-provider routing) is relevant only if multiple AI providers need balancing — skip for now.

### DevOps & Infrastructure

| Technology | Experience | Notes |
|---|---|---|
| Docker | Comfortable | Local dev environments; multi-service compose setups |
| Git / GitHub | Comfortable | Version control |
| GitHub Actions | Available | CI/CD pipelines |
| Vercel | Available | Frontend / Next.js deployment; zero-config |
| Railway | Available | Backend services, databases, worker processes |

### Automation & Orchestration

| Technology | Experience | Notes |
|---|---|---|
| N8N | Comfortable | Visual workflow automation; Docker-hosted; integration pipelines |

### Mobile

| Technology | Experience | Notes |
|---|---|---|
| Android (general) | Tester background | Strong QA instinct; app building is new |
| React Native + Expo | Learning | Cross-platform mobile with React syntax; preferred starting point |
| Capacitor | Available | Web-to-Android bridge; viable if product is web-first |
| Flutter | Available | Dart-based cross-platform; mentioned in research; not the primary choice |

---

## Section 2: Active Stack — What We Use and Why

Decided technology choices for Hive projects. Deviations require a rationale in the project's `mind/decisions.md`.

### Frontend

| Technology | Purpose | Why this over alternatives |
|---|---|---|
| Next.js | Public-facing tools, full-stack apps | SSR for SEO (crawlers see rendered content); API routes colocate backend; Vercel-native |
| React + Vite | Internal tools, dashboards, SPAs with a separate backend | Simpler, faster dev server when SSR is not needed |
| TypeScript | All JS/TS code | Type safety catches AI-generated type errors; better DX |
| shadcn/ui + Tailwind | UI components and styling | Components are copied into the project (full ownership, full customization); Radix UI accessibility underneath; no design system lock-in |

> **Why not MUI?** MUI imposes Google Material Design at the architecture level. Deviating from it is a fight. shadcn/ui gives equivalent component coverage with zero imposed visual language. Use MUI only if a project explicitly wants Material Design.

### Backend

| Technology | Purpose | Why |
|---|---|---|
| Node.js | Primary product backend, APIs, SaaS layer | Existing experience; TypeScript consistency; sufficient for web APIs |
| Express.js | HTTP API server | Minimal, familiar |
| Python | AI/ML pipelines, embeddings, scraping, batch processing | Richer AI/data ecosystem; used only where it clearly outperforms Node.js |

> **Node.js vs Python decision rule:** Default to Node.js. Switch to Python only for AI/ML pipelines, Qdrant operations, embeddings, heavy automation, or batch processing where Python's ecosystem is clearly superior. Never mix both languages in the same service.

### Database

| Technology | Purpose |
|---|---|
| PostgreSQL | Primary relational store |
| Prisma | ORM / schema management; type-safe queries; migration system |

### Real-time

| Technology | Purpose |
|---|---|
| Socket.io | Real-time bidirectional features (live updates, collaborative tools) |

### Local AI

| Technology | Purpose |
|---|---|
| Ollama (wrapping llama.cpp) | Local LLM inference; accessed via REST API; OpenAI-compatible endpoint |

### Mobile

| Technology | Purpose | Status |
|---|---|---|
| React Native + Expo | Android utility apps; iOS available later | Active — first mobile project upcoming |

> **Why React Native over Capacitor?** Capacitor runs a web view — the app is a browser window. React Native compiles to native components. For utility tools on mid-range Android devices (the real target audience), native rendering is noticeably better. Use Capacitor only if the product already exists as a Next.js web app and a quick Android port with no native features is the goal.

### Infrastructure

| Technology | Purpose |
|---|---|
| Docker | Local dev; service composition; hot reload via `nodemon --legacy-watch` |
| Vercel | Next.js / frontend deployment (no 24/7 local server) |
| Railway | Backend services, databases, background workers |
| GitHub Actions | CI/CD |

### Automation

| Technology | Purpose |
|---|---|
| N8N (Docker-hosted) | Integration workflows, webhooks, scheduled automations, cross-service pipelines |

---

## Section 3: Testing Stack

| Context | Tool | Notes |
|---|---|---|
| Next.js / React components | Vitest + React Testing Library | Faster than Jest, better TypeScript/ESM support |
| Node.js / API unit tests | Vitest | Consistent with web stack |
| Web E2E flows | Playwright | Industry standard; excellent TypeScript support |
| React Native components | Jest | Vitest is not supported by Metro bundler |
| Mobile E2E (automated) | Detox | When automated mobile E2E is required |
| Python services | pytest | Standard Python testing |

> **Why Vitest over Jest for web?** Vitest is Jest API-compatible (same test syntax, same matchers) but runs on Vite — dramatically faster, better ESM and TypeScript support. The migration cost from Jest to Vitest is near zero. The exception is React Native, where Metro's bundler cannot process Vitest.

---

## Section 4: Auth & Payments

| Purpose | Technology | Notes |
|---|---|---|
| Authentication | Clerk | Auth-only service; 10k MAU free tier; excellent Next.js integration; pre-built UI components |
| Payments | Stripe | Checkout sessions, webhooks; one-time purchases and subscriptions |

> **Why Clerk over Supabase for auth?** Hive projects use Prisma + PostgreSQL for data. Supabase adds a second database provider with no benefit. Clerk is auth-only — clean separation of concerns. The only case for Supabase is a tiny project that has no DB at all.

---

## Section 5: Monetization Stack

See `projects/platform/docs/monetization.md` for the full model. Summary:

- **Default:** Free tier + one-time credit packs (non-expiring). Ads removed for any paid user.
- **For tools without ongoing costs:** One-time premium unlock.
- **For tools with per-use AI costs:** Credits model. Higher packs = lower per-credit price.
- **Subscriptions:** Only when the product has genuine ongoing per-user server costs.
- **Donations:** Ko-fi or Buy Me a Coffee in every free-tier footer.

---

## Section 6: Ads Stack

See `projects/platform/docs/ads-policy.md` for placement rules. Summary:

- Mobile: AdMob. Banner at fixed bottom. Rewarded for optional unlocks. No interstitials.
- Web: Display banners. Sidebar or below fold. No pop-ups.
- Ads never shown to paid users. Never in professional tools.

---

## Section 7: Available But Not Active

| Technology | When to reach for it |
|---|---|
| Qdrant | Semantic search, RAG, embedding-based features |
| Flutter | If React Native underperforms for a specific project's needs |
| Capacitor | Web-first product needing a quick Android presence |

---

## Platform Notes

- **Windows Docker hot reload:** `nodemon --legacy-watch` required — standard inotify watching does not work on Windows/Docker.
- **Default new web project stack:** Next.js + TypeScript + Prisma + PostgreSQL + shadcn/ui + Tailwind + Docker (local) + Vercel/Railway (deploy).
- **Default new mobile project stack:** React Native + Expo + TypeScript + AsyncStorage/SQLite + AdMob.
- **Monorepo:** npm workspaces at the Hive root for sharing platform packages. No Turborepo or Nx needed at current scale.
- **No separate domain per product:** All web tools deploy under the same domain. See `projects/platform/docs/url-structure.md`.
