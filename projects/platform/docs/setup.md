# Setup Guide — Using Platform Packages

How to connect a new Hive product project to the shared platform.

---

## Step 1: Configure npm Workspaces

If not already done, add a `package.json` at `C:\hive\` (the Hive root):

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

Then run `npm install` from the Hive root to link workspaces.

---

## Step 2: Add Dependencies to Your Product

In your product's `projects/<name>/app/package.json`, add the packages you need:

```json
{
  "dependencies": {
    "@hive/auth": "*",
    "@hive/billing": "*",
    "@hive/analytics": "*",
    "@hive/ui": "*"
  }
}
```

Run `npm install` again from the Hive root.

---

## Step 3: Set Environment Variables

Copy the required environment variables into your product's `.env` file. See `docs/architecture.md` for the full list per package.

---

## Step 4: Initialize in Your App

Each package has a provider or initializer. Typical Next.js App Router setup:

**`app/layout.tsx`:**
```tsx
import { ClerkProvider } from "@hive/auth";
import { AnalyticsProvider } from "@hive/analytics";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <AnalyticsProvider>
        {children}
      </AnalyticsProvider>
    </ClerkProvider>
  );
}
```

---

## What Each Package Provides

See individual package READMEs in `app/packages/<name>/README.md` for the full API.

| Package | Key exports |
|---|---|
| `@hive/auth` | `ClerkProvider`, `useCurrentUser`, `requireAuth` middleware |
| `@hive/billing` | `createCheckoutSession`, `getCreditBalance`, `stripeWebhookHandler` |
| `@hive/analytics` | `AnalyticsProvider`, `track`, `identify` |
| `@hive/ads` | `BannerAd` (RN), `RewardedAd` (RN), `WebAdSlot` (Next.js) |
| `@hive/ui` | `Button`, `Input`, `Card`, `Badge`, `Dialog`, `Spinner` |
| `@hive/email` | `sendTransactional`, standard template helpers |
| `@hive/seo` | `generateMetadata`, `generateSitemap` |

---

## Checklist for a New Product

- [ ] Workspaces configured and `npm install` run from Hive root
- [ ] Dependencies added to product `package.json`
- [ ] `.env` populated with required variables (never commit `.env`)
- [ ] Providers initialized in `app/layout.tsx` (web) or `app/_layout.tsx` (RN)
- [ ] Auth middleware applied to protected routes
- [ ] Analytics initialized and at least one page-view event confirmed in PostHog
