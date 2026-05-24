# URL Structure & Routing Conventions

All web products deploy under a single main domain. This gives shared SEO authority, one auth system, and unified analytics.

---

## Route Groups

| Prefix | Contents |
|---|---|
| `/tools/*` | Single-purpose web utilities (calculators, converters, generators, cleaners) |
| `/apps/*` | More complete web applications with user accounts and persistent data |
| `/labs/*` | Experimental projects not yet considered production-ready |

---

## Deployment Approaches

### Option A — Monolith Portal (default for new tools)

All tools are routes in a single Next.js app. Simple, shared auth, one deployment, one bundle of SEO authority.

```
app/
  tools/
    invoice-parser/
      page.tsx
    csv-cleaner/
      page.tsx
    testcase-generator/
      page.tsx
  apps/
    [app-name]/
      page.tsx
  labs/
    [experiment]/
      page.tsx
  page.tsx          ← main landing page / tool directory
```

Suitable for: simple tools, tools in early validation, tools that share auth state.

### Option B — Independent Deploy with Vercel Rewrites

When a product grows large enough to warrant its own deployment or codebase, it can be deployed independently while still appearing at the correct URL via `vercel.json` rewrites:

```json
{
  "rewrites": [
    {
      "source": "/tools/invoice-parser/:path*",
      "destination": "https://invoice-parser-<hash>.vercel.app/:path*"
    }
  ]
}
```

This keeps URLs stable, preserves SEO authority, and lets the product evolve independently. The shared backend (auth, billing, analytics) remains connected.

Suitable for: products with significant features, products that might be sold, products needing independent deployment cycles.

---

## Subdomain Strategy

Use subdomains for products with distinct branding or significant independent identity:

```
tools.example.com        ← tool suite
app.example.com          ← main SaaS app
[product].example.com    ← product with its own identity
```

---

## When to Buy a Separate Domain

Only when a product:
- Has clear standalone branding that conflicts with the parent domain's identity
- Might be sold or spun off independently
- Targets a completely different audience
- Has legal/business reasons for separation

Even then: the shared backend (auth, billing) can remain shared while only the frontend/domain changes.

---

## SEO Implications

All tools under the same domain accumulate authority together. A new tool at `/tools/new-thing` benefits immediately from the domain's existing ranking. Twenty tools on twenty separate domains start from zero each time.

This is the core reason to default to the monolith/portal approach.
