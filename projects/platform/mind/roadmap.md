# Roadmap — Platform

Status legend: `[ ]` not started · `[~]` in progress · `[x]` done · `[!]` blocked

---

## Phase 1 — Auth & Billing Foundation
_Implement when the first product project requires these._

- [ ] `@hive/auth`: Clerk middleware for Next.js App Router
- [ ] `@hive/auth`: `useCurrentUser` hook
- [ ] `@hive/billing`: Stripe one-time credit pack checkout session
- [ ] `@hive/billing`: Credit balance read/write helpers
- [ ] `@hive/billing`: Webhook handler for `checkout.session.completed`

## Phase 2 — Analytics & Ads
_Implement when first product is live._

- [ ] `@hive/analytics`: PostHog provider wrapper for Next.js
- [ ] `@hive/analytics`: Standard event names and types
- [ ] `@hive/ads`: AdMob banner component (React Native)
- [ ] `@hive/ads`: Rewarded ad hook (React Native)
- [ ] `@hive/ads`: Web display ad slot component (Next.js)

## Phase 3 — UI & SEO
_Implement when multiple products share UI patterns._

- [ ] `@hive/ui`: Base component set (Button, Input, Card, Badge, Dialog)
- [ ] `@hive/ui`: Theme tokens (colors, spacing, typography)
- [ ] `@hive/seo`: `generateMetadata` helper for Next.js
- [ ] `@hive/seo`: Sitemap generator

## Phase 4 — Email & Notifications
- [ ] `@hive/email`: Transactional email via Resend or similar
- [ ] `@hive/email`: Standard templates (welcome, receipt, password reset)
