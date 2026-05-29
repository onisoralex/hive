# Architecture — Platform

**Status:** Defined. Packages are stubs until implemented by a Developer worker.
**Last updated:** 2026-05-24

---

## Package Structure

All packages live under `app/packages/`. Each is scoped as `@hive/<name>` in package.json.

```
app/
  packages/
    ui/           @hive/ui        Shared shadcn/ui component library
    auth/         @hive/auth      Clerk integration helpers
    billing/      @hive/billing   Stripe checkout, credits, one-time purchases
    analytics/    @hive/analytics PostHog/Plausible initialization and events
    ads/          @hive/ads       AdMob (mobile) and web ad unit components
    email/        @hive/email     Transactional email helpers
    seo/          @hive/seo       Next.js SEO utilities (metadata, sitemap)
```

---

## Package Design Principles

- **Thin wrappers.** Each package wraps one external service. It applies Hive conventions (naming, error handling, TypeScript types) but does not reinvent the service.
- **Zero business logic.** No product-specific decision-making. If a question arises like "should the user see ads?", the answer comes from the product code, not this package.
- **Separate platform targets.** A package that works on both Next.js and React Native documents both. A package that only works on one platform says so explicitly.
- **Environment variables are injected by the consuming product.** Packages never hard-code credentials. The consuming product's `.env` provides them.

---

## Third-Party Services

| Package | Service | Notes |
|---|---|---|
| `@hive/auth` | Clerk | Default auth; 10k MAU free tier |
| `@hive/billing` | Stripe | Checkout sessions, webhooks, credit management |
| `@hive/analytics` | PostHog | Event tracking, session recording (web); Plausible as lightweight alternative |
| `@hive/ads` | Google AdMob | Mobile; Google AdSense or direct placement for web |
| `@hive/email` | Resend | Transactional email; simple API, generous free tier |
| `@hive/ui` | shadcn/ui + Radix UI | Component primitives; Tailwind for styling |

---

## npm Workspaces Setup

To consume platform packages in a product project, configure npm workspaces at the Hive root level:

**`package.json` at `C:\hive\`** (create if not present when first needed):
```json
{
  "name": "hive",
  "private": true,
  "workspaces": [
    "projects/platform/app/packages/*",
    "projects/*/app"
  ]
}
```

Products then add platform packages as dependencies:
```json
{
  "dependencies": {
    "@hive/auth": "*",
    "@hive/billing": "*",
    "@hive/analytics": "*"
  }
}
```

No Turborepo or Nx required. npm workspaces resolve package references. Add build orchestration only when build times become a problem.

---

## Hosting & Deployment

### Runtimes

| Language | Use case |
|---|---|
| Node.js (TypeScript) | All web products, API servers, tooling |
| Python | Data processing, ML/AI scripts, automation |

### Hosting services

| Workload type | Primary | Alternative | Notes |
|---|---|---|---|
| Next.js frontend / API routes | Vercel | — | First-class Next.js support; ISR, edge CDN, preview deployments built in |
| Persistent server (WebSockets, Socket.io) | Render | Railway | Render has a genuine free tier; Railway's "free" tier is a $5/month credit |
| Database | Supabase / Neon | PlanetScale | External managed DB; each product manages its own Prisma schema |

### Why Vercel for Next.js

Vercel was built by the Next.js team. It has native support for Next.js's hybrid rendering model — routes are automatically optimized as static (SSG), server-rendered (SSR), or incrementally regenerated (ISR) depending on their behavior. Running Next.js on Render or Railway works, but the entire app runs as a persistent Node.js process and loses the static optimization layer.

**Vercel limitation:** No persistent server processes. Each request is handled by a serverless function that spins up, runs, and terminates after the response. WebSockets and Socket.io are not supported. Short-lived data transformations and standard API calls are the correct use case.

### Why Render for persistent servers

Render supports long-running Node.js and Python processes with WebSocket connections. Free tier is available but services spin down after 15 minutes of inactivity.

**Keeping Render free-tier services alive:** Use an N8N workflow to send a periodic HTTP request (every ~14 minutes) to the service. This prevents spin-down without upgrading to a paid plan.

Railway is a valid alternative — it has slightly better DX and more predictable behavior — but its "free" tier is a $5/month credit rather than a genuinely free tier, making Render the default for budget-conscious projects.

---

## Environment Variables Reference

Each package requires specific environment variables in the consuming product's `.env`:

| Package | Variable | Where to get it |
|---|---|---|
| `@hive/auth` | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk dashboard |
| `@hive/auth` | `CLERK_SECRET_KEY` | Clerk dashboard |
| `@hive/billing` | `STRIPE_SECRET_KEY` | Stripe dashboard |
| `@hive/billing` | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe dashboard |
| `@hive/billing` | `STRIPE_WEBHOOK_SECRET` | Stripe webhook endpoint settings |
| `@hive/analytics` | `NEXT_PUBLIC_POSTHOG_KEY` | PostHog project settings |
| `@hive/ads` | `ADMOB_ANDROID_APP_ID` | AdMob dashboard |
| `@hive/email` | `RESEND_API_KEY` | Resend dashboard |
