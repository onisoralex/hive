# @hive/seo

SEO utilities for Hive Next.js web products.

**Status:** Stub — implement when first web product needs structured SEO.

**Platform:** Next.js (web only).

---

## What it provides

- `generateMetadata(options)` — produces a Next.js `Metadata` object with consistent defaults (Open Graph, Twitter Card, canonical URL)
- `generateSitemap(routes)` — generates a `sitemap.xml` response
- `generateRobotsTxt()` — generates a `robots.txt` response
- JSON-LD structured data helpers for common types (WebApplication, FAQPage)

## Usage (when implemented)

```ts
// app/tools/invoice-parser/page.tsx
import { generateMetadata } from "@hive/seo";

export const metadata = generateMetadata({
  title: "Free Invoice Parser",
  description: "Extract data from PDF invoices instantly.",
  path: "/tools/invoice-parser",
});
```

## Notes

Next.js App Router handles most SEO automatically via the `metadata` export. This package adds consistency defaults and prevents common mistakes (missing canonical URLs, inconsistent OG images). See `docs/url-structure.md` for routing context.
