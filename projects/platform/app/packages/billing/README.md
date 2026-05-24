# @hive/billing

Stripe integration for one-time purchases, credit pack management, and optional subscriptions.

**Status:** Stub — implement when first product project needs payments.

**Platform:** Next.js (web). React Native uses in-app purchase APIs directly for mobile payments.

---

## What it provides

- `createCheckoutSession(priceId, userId)` — creates a Stripe Checkout session for a one-time purchase
- `getCreditBalance(userId)` — returns current credit balance from the database
- `addCredits(userId, amount)` — credits the user's account (called from webhook handler)
- `stripeWebhookHandler` — validates and processes `checkout.session.completed` events
- `hasActivePurchase(userId)` — returns true if user has any paid tier (used to remove ads)

## Required environment variables

```
STRIPE_SECRET_KEY=sk_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Database requirement

This package requires a `credits` or `users` table with a credit balance field. Each product's Prisma schema handles this — the package does not own the schema.

## Dependencies (when implemented)

- `stripe`
- `@stripe/stripe-js` (client-side)

## Notes

Test with Stripe's test mode and test card `4242 4242 4242 4242`. Never test with real cards in development.
