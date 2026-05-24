# @hive/analytics

Analytics initialization and event tracking for Hive products.

**Status:** Stub — implement when first product deploys.

**Platform:** Next.js (web) and React Native (mobile).

---

## What it provides

- `AnalyticsProvider` — root provider that initializes PostHog
- `track(event, properties)` — sends a custom event
- `identify(userId, properties)` — associates events with a user
- Standard event name constants (to avoid typos and inconsistent naming)

## Standard event names (to implement consistently across all products)

```ts
export const Events = {
  PAGE_VIEW: "page_view",
  TOOL_USED: "tool_used",
  CHECKOUT_STARTED: "checkout_started",
  PURCHASE_COMPLETED: "purchase_completed",
  AD_SHOWN: "ad_shown",
  AD_REWARDED: "ad_rewarded",
  CREDITS_SPENT: "credits_spent",
} as const;
```

## Required environment variables

```
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

## Dependencies (when implemented)

- `posthog-js` (web)
- `posthog-react-native` (mobile)

## Notes

PostHog's free tier is generous (1M events/month). For lightweight traffic analytics without session recording, Plausible is a privacy-friendly alternative with a lower footprint.
