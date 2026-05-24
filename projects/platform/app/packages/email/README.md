# @hive/email

Transactional email helpers for Hive products.

**Status:** Stub — implement when first product needs email sending.

**Platform:** Node.js / Next.js API routes (server-side only).

---

## What it provides

- `sendTransactional(template, to, data)` — sends an email using a named template
- Standard templates: `welcome`, `purchase-receipt`, `credits-added`

## Required environment variables

```
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@yourdomain.com
```

## Dependencies (when implemented)

- `resend`
- `react-email` (for template rendering)

## Notes

Resend's free tier allows 3,000 emails/month and 100/day. Sufficient for early products. Domain verification is required in the Resend dashboard before production use.
