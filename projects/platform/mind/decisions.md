# Decisions — Platform

Append-only. One entry per significant decision.

Format:
```
## <slug or topic> — <date>
**Decision:** <what was decided>
**Rejected:** <what was considered and not chosen>
**Why:** <rationale>
```

---

## auth-provider — 2026-05-24
**Decision:** Clerk is the default auth provider for all Hive web products.
**Rejected:** Supabase Auth
**Why:** Hive projects already use Prisma + PostgreSQL for data. Supabase adds a second database provider with no benefit over what we already have. Clerk is auth-only, with a generous free tier (10k MAU), excellent Next.js middleware integration, and pre-built UI components. The only reason to choose Supabase is if a project has no DB at all — then Supabase all-in-one is simpler.

## monetization-model — 2026-05-24
**Decision:** Default monetization uses one-time credit packs (non-expiring) and one-time premium unlocks. Subscriptions are reserved for features with genuine ongoing per-user costs (live data, cloud sync). Free tier users see ads; paid users do not.
**Rejected:** Subscription-first model
**Why:** Subscription fatigue is real. One-time purchases have lower psychological friction and map honestly to tools that don't change after purchase. Credits align cost to usage for AI-powered features. Donations are included as a low-friction option for free-tier users.

## ad-policy — 2026-05-24
**Decision:** Banners only on mobile (bottom-fixed), display ads on web (sidebar/below-fold). No interstitials, no full-page. Rewarded ads permitted for optional unlocks only. See `docs/ads-policy.md`.
**Rejected:** Interstitial and full-page ad formats
**Why:** Intrusive formats damage ratings and retention, especially on utility apps where the user came for a specific quick task. The goal is sustainable passive income from apps people keep installed, not aggressive monetization that drives uninstalls.

## testing-stack — 2026-05-24
**Decision:** Vitest for all web/Node.js tests, Jest for React Native (Metro bundler incompatibility with Vitest), Playwright for web E2E, Detox for mobile E2E when needed.
**Rejected:** Jest for web (slower, worse ESM/TypeScript support than Vitest)
**Why:** Vitest is API-compatible with Jest but faster and better integrated with the Vite/TypeScript ecosystem. React Native is the exception because Metro (RN's bundler) cannot process Vitest.

## ui-library — 2026-05-24
**Decision:** shadcn/ui + Tailwind CSS for all web products.
**Rejected:** Material UI (MUI)
**Why:** MUI imposes Google Material Design aesthetics at the architecture level — customizing away from it is a constant fight. shadcn/ui copies component source into the project (you own it, you modify it), is built on Radix UI accessible primitives, and works natively with Tailwind. No design system lock-in.

## hosting-frontend — 2026-05-27
**Decision:** Vercel is the default hosting platform for all Next.js web products.
**Rejected:** Render and Railway for Next.js hosting.
**Why:** Vercel was built by the Next.js team and has native support for Next.js's hybrid rendering model. Static pages are served from a global CDN; serverless functions handle dynamic routes; ISR works out of the box. Running Next.js on other hosts works but treats the entire app as a persistent process, losing static optimization. Vercel's free tier is generous for frontend workloads.

## hosting-persistent-server — 2026-05-27
**Decision:** Render is the default host for persistent server processes (WebSocket servers, Socket.io, long-running APIs). Railway is the named alternative.
**Rejected:** Vercel for persistent servers.
**Why:** Vercel's serverless model terminates the process after each response — persistent connections (WebSockets, Socket.io) are not supported. Render and Railway both support long-running Node.js and Python processes. Render has a genuine free tier (services spin down after 15 min inactivity, mitigated by N8N keep-alive pings every ~14 minutes). Railway's "free" tier is a $5/month credit, making Render the cost-first default. Railway is preferred when DX matters more than cost.
