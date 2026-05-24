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
