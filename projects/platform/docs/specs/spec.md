# Spec Template

Use this file as the format reference when writing implementation specs for platform packages. Copy it, rename it (`NN-package-name.md`), and fill in the sections. Delete sections that do not apply.

Naming convention: `NN-package-name.md` where `NN` is a zero-padded sequence number reflecting build order (e.g. `00-auth.md`, `01-billing.md`).

---

# Spec NN — Package Name

**Status:** Draft | Ready to implement | In progress | Done
**Date:** YYYY-MM-DD
**Produced by:** <worker or author>
**Depends on:** <list prior specs this one requires, or "Nothing">

---

## Overview

One paragraph. What this package provides, what problem it solves, and which products consume it.

---

## 1. Public API

List every exported function, hook, or component. For each: name, parameters (with types), return type, and purpose.

```ts
// Example
export function createCheckoutSession(
  priceId: string,
  userId: string
): Promise<{ url: string }>;
```

---

## 2. Data Requirements

If this package reads or writes to a database, list the Prisma model fields it depends on. The consuming product owns the schema — this section tells the Developer what fields must exist.

---

## 3. Environment Variables

List every environment variable the package requires, its format, and where to get it.

| Variable | Format | Source |
|---|---|---|
| `EXAMPLE_KEY` | `key_...` | Service dashboard |

---

## 4. Platform Target

- [ ] Next.js (web)
- [ ] React Native (mobile)
- [ ] Node.js (server-only)

Note any differences in behavior or setup between platforms.

---

## 5. Third-Party Service

Which external service does this package wrap? List the relevant endpoints, SDK used, and rate limits or constraints.

---

## 6. Edge Cases

Explicit list of edge cases and how each is handled.

---

## Assumptions

Explicit list of assumptions made. If any assumption is wrong, this spec needs revisiting before implementation.
