# @hive/auth

Clerk authentication helpers and middleware for Hive web products.

**Status:** Stub — implement when first product project needs auth.

**Platform:** Next.js (web). React Native uses Clerk's native SDK directly.

---

## What it provides

- `ClerkProvider` — root provider wrapper
- `useCurrentUser()` — typed hook returning the current user or null
- `requireAuth` — Next.js middleware helper that redirects unauthenticated users
- `withAuth` — route handler wrapper for API routes

## Required environment variables

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
```

## Dependencies (when implemented)

- `@clerk/nextjs`

## Notes

Clerk's free tier supports 10,000 monthly active users. The paid tier starts when you exceed this. For early products, you will never hit the limit.
