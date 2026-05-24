# Shared Platform

This is not a product. It is the shared infrastructure layer consumed by all products built in this Hive. It centralizes auth, billing, analytics, ads, email, and UI component decisions so each new product starts from a working foundation rather than from scratch.

---

## What this is

A set of packages, conventions, policy documents, and reference implementations. Each package is intentionally thin — it wraps a third-party service with the Hive's conventions applied, not a custom reimplementation of that service.

When a new product project needs auth, it installs `@hive/auth` and follows the setup guide rather than making its own Clerk integration decisions from scratch.

## What it is not

- A monolith. Products do not live here.
- A product. This has no end users.
- A database. Each product manages its own Prisma schema.

## Package index

All packages live under `app/packages/`. Each has a `README.md` with its purpose, dependencies, and implementation status.

| Package | Purpose | Status |
|---|---|---|
| `@hive/ui` | Shared shadcn/ui component library | Stub |
| `@hive/auth` | Clerk integration helpers and middleware | Stub |
| `@hive/billing` | Stripe checkout, one-time purchases, credit management | Stub |
| `@hive/analytics` | PostHog/Plausible initialization and event helpers | Stub |
| `@hive/ads` | AdMob (mobile) and web ad unit components | Stub |
| `@hive/email` | Transactional email helpers | Stub |
| `@hive/seo` | SEO utilities for Next.js (metadata, sitemap, structured data) | Stub |

## Key constraints

- Every package must support both Next.js (web) and React Native (mobile) where applicable. If a package is platform-specific, it is documented as such.
- No product business logic lives here — only integration plumbing and shared UI.
- A new product should reach a working auth + billing + analytics baseline in under 2 hours using this platform.

## Key documents

- `docs/setup.md` — how to consume platform packages in a new product
- `docs/architecture.md` — package design and dependencies
- `docs/monetization.md` — standard monetization model for all products
- `docs/ads-policy.md` — ad placement rules
- `docs/url-structure.md` — URL and routing conventions

## Out of scope

- Product-specific database schemas
- Product-specific routing
- Application business logic
- Deployment configuration (each product deploys independently)
