# Monetization Model

Standard monetization decisions for all Hive products. Individual products may deviate — deviations must be documented in that project's `mind/decisions.md`.

---

## Default Tier Structure

| Tier | Type | Price | Features | Ads |
|---|---|---|---|---|
| Free | Free | €0 | Core features, limited credits/uses per month | Shown |
| Starter Pack | One-time | €2–5 | Credits added (non-expiring); 500–1000 credits | Removed |
| Standard Pack | One-time | €7–15 | More credits at lower per-credit cost | Removed |
| Premium | One-time | €15–30 | All features unlocked; credits; no ads ever | Removed |
| Subscription | Monthly | Only when justified | Ongoing-value features only (sync, live data updates) | Removed |

Pricing is per-product. These are reference ranges, not fixed prices.

---

## Credits System

Credits apply to AI-powered features and any action with a real per-unit cost.

- Credits do not expire.
- Higher-tier packs offer a lower cost-per-credit (volume discount).
- Free tier receives a starting credit grant on signup.
- Free tier may receive a small monthly credit refresh (optional per product).
- The credit system is implemented in `@hive/billing`.

---

## One-Time vs. Subscription Decision Rule

**Use a one-time purchase when:**
- The product's value doesn't require ongoing server costs per user
- The user pays once and the product remains useful indefinitely (offline tools, calculators, templates)
- There is no ongoing content, data refresh, or compute cost tied to each user

**Use a subscription only when:**
- There are genuine ongoing per-user server costs (AI API calls on every use, live data feeds, cloud storage)
- The product updates continuously and the recurring charge maps to a concrete recurring benefit
- The user can clearly articulate what they're paying for each month

Avoid subscriptions for tools that work the same way after day one as they did at purchase. Subscriptions for static utility apps are perceived as rent-seeking and generate negative reviews.

---

## Ads

Ads are shown to free-tier users only. Any paid purchase — even the smallest credit pack — removes ads permanently for that user.

See `docs/ads-policy.md` for placement rules.

---

## Donations

All free-tier products include a low-friction donation link (Ko-fi or Buy Me a Coffee) in the footer or about screen. Never interruptive. It is framed as "support development" — not a paywall, not a guilt mechanism.

---

## Pricing Guidance by Product Type

| Product type | Recommended model |
|---|---|
| Offline utility tool (calculator, converter) | Free + ads, optional €2–5 one-time to remove ads |
| AI-powered tool (resume tailor, summarizer) | Free with limited credits, credit packs for more |
| Professional/developer tool (QA helper, formatter) | Free with limited uses, one-time premium unlock |
| Live-data tool (shop offers, market tracker) | Free with ads, subscription justified for live refresh cost |
| Template/content store | One-time purchase per item (Gumroad) |
| Android utility app | Free + AdMob, optional in-app purchase to remove ads |
