# Ads Policy

Rules that apply to all Hive products. No exceptions without a documented decision in the project's `mind/decisions.md`.

---

## When Ads Are Shown

- Free-tier users, on products where ads are appropriate (see below).

## When Ads Are Never Shown

- Any user who has made any purchase (credit pack, premium, subscription).
- Professional tools where ads undermine credibility (B2B tools, developer tools, QA tools).
- Admin views, account management screens, settings.
- Onboarding and permission request flows.
- Payment and checkout flows.
- Error states.

---

## Mobile Ad Rules (AdMob)

| Format | Allowed | Rules |
|---|---|---|
| **Banner** | Yes | Fixed at the bottom of the screen. Sits below all content. Never floats over interactive elements. Never covers system navigation bar gestures. |
| **Rewarded** | Yes | Only for explicitly optional actions: "Watch an ad to earn X credits", "Watch an ad to remove ads for this session". User must opt in. Never required for core functionality. |
| **Interstitial** | No | Not permitted. |
| **App Open** | No | Not permitted. |
| **Full-page / overlay** | No | Not permitted. |

---

## Web Ad Rules

| Format | Allowed | Rules |
|---|---|---|
| **Display banner** | Yes | Sidebar or below the main content fold. |
| **In-content banner** | Conditional | Only between clearly separated content sections. Never between a form and its submit button. Never inside a tool's active work area. |
| **Pop-up / overlay** | No | Not permitted. |
| **Auto-playing video** | No | Not permitted. |

---

## Rewarded Ad Model (detail)

The rewarded format is the only intrusive format permitted, subject to these conditions:

1. The reward is clearly stated before the user chooses to watch.
2. The user opted in — they tapped a button to start the ad.
3. The core functionality of the app works without watching the ad.
4. The reward is delivered immediately after the ad completes.

Acceptable reward examples:
- "Watch an ad → earn 10 credits"
- "Watch an ad → remove ads for this session"
- "Watch an ad → unlock the export feature for today"

Not acceptable:
- "Watch an ad to continue using the app" (blocks core use)
- "Watch an ad to see your result" (core feature gated)

---

## Implementation

Ad logic is handled by `@hive/ads`. That package checks the user's paid status before rendering any ad component. Products do not implement this check themselves.
