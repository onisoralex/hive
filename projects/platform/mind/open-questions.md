# Open Questions — Platform

Deferred decisions. Address each when the relevant module or phase is reached. Do not block earlier work on these.

| # | Question | Relevant Module / Phase | Added |
|---|---|---|---|
| 1 | Should `@hive/analytics` default to PostHog or Plausible? PostHog has more features (session recording, funnels); Plausible is lighter and privacy-friendlier. | `@hive/analytics` implementation | 2026-05-24 |
| 2 | For mobile payments, should `@hive/billing` wrap Google Play Billing instead of Stripe? App stores take 15–30% of in-app purchases but handle the payment flow natively. Stripe in a web view is an option but less trusted by users. | `@hive/billing` mobile implementation | 2026-05-24 |
| 3 | Should the root `package.json` npm workspace be set up now, or deferred until the first product consumes a platform package? | Workspace setup | 2026-05-24 |

---

## Answered

| # | Question | Answer | Decided |
|---|---|---|---|
