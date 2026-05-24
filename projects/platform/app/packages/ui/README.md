# @hive/ui

Shared UI component library for Hive web products. Built on shadcn/ui (Radix UI primitives + Tailwind CSS).

**Status:** Stub — implement when first product project needs shared components.

**Platform:** Next.js (web only; mobile uses React Native primitives directly)

---

## What it provides

- Base components: Button, Input, Card, Badge, Dialog, Spinner, Toast
- Theme tokens: color palette, spacing scale, typography scale (as CSS custom properties)
- Consistent design language across all products without design system lock-in

## Dependencies (when implemented)

- `tailwindcss`
- `@radix-ui/react-*` (via shadcn/ui)
- `class-variance-authority`
- `clsx`
- `tailwind-merge`

## Notes

Components are copied into this package (the shadcn/ui model). To add a new component: run `npx shadcn@latest add <component-name>` in this directory, then export from `index.ts`. You own the component source — modify directly.
