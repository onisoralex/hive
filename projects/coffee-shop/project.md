# Project Brief — coffee-shop

The Mind reads this file at the start of every session. Keep it non-technical and high-level — the "what and why." Technical decisions and implementation details live in the app files under `app/docs/`; the `mind/` files are thin pointers into those.

---

## What we're building

A real-time coffee shop ordering system for a physical coffee shop with a 4-person paper-ticket workflow (prep person, barista, counter person, servers). Customers order via kiosk at the bar or by scanning a QR code at their table. Staff see live queues. A pickup display shows ready order numbers.

Five screens, each scoped to one role:
- `/order` — customers and staff place orders (kiosk + QR mobile)
- `/barista` — shared screen for prep and finishing barista; two panels, one role per panel
- `/counter` — counter staff manage non-coffee items and the pickup display
- `/pickup` — big read-only screen customers watch for their number
- `/management` — admin CRUD for menu, tables, settings; JWT-protected

## Who it's for

A specific coffee shop with a real 4-person workflow. The screen design maps directly to that paper-ticket operation. Decisions that look unusual almost always have a real-world operational reason.

## Ownership

The project repo (`app/`) belongs to the organisation. Alex is the sole developer. Other devs may have access but currently none are active.

## Goals

- Replace paper-ticket chaos with a real-time digital queue
- Staff can place and track orders from any screen without navigating
- Customers at tables get live status on their phones via QR
- Management can update the menu, configure settings, and review order history without a developer

## Key constraints

- Runs on a local network over plain HTTP — not HTTPS, not internet-facing
- No payment processing
- Single admin credential (v1)
- Deployed on a Linux server at `/opt/coffee-shop` via Docker Compose

## Current state — last updated 2026-06-16

Phases 1–10 complete and running in production. Phase 11 in progress — items 11–13 remain (per-device settings, table label on counter badges, ready indicator on Open tab). See `mind/backlog.md` for details.

---

## References

- Current task board: `mind/state.md`
- Backlog: `mind/backlog.md`
- Decisions (historical log): `app/docs/TRACKER.md` — "Decision log" section
- Roadmap: `app/docs/PLANNING.md` (summary pointer: `mind/roadmap.md`)
- App AI context (stack, conventions, domain logic): `app/AGENTS.md`
- Architecture, events, API endpoints: `app/docs/ARCHITECTURE.md`
- UX design principles: `app/docs/SOUL.md`
