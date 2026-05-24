# @hive/ads

Ad unit components for Hive products. Implements the ad policy from `docs/ads-policy.md`.

**Status:** Stub — implement when first ad-supported product is ready.

**Platform:** React Native (AdMob mobile) and Next.js (web display ads).

---

## What it provides

**React Native (mobile):**
- `BannerAd` — fixed bottom banner. Renders nothing if user has an active purchase.
- `useRewardedAd(adUnitId)` — hook to load and show a rewarded ad; returns `{ show, isLoaded, reward }`

**Next.js (web):**
- `WebAdSlot` — renders a display ad container. Renders nothing if user has an active purchase.

## Key behavior

All ad components check `hasActivePurchase(userId)` before rendering. Paid users never see ads — this check is built into the component, not left to each product to implement.

## Required environment variables

```
NEXT_PUBLIC_ADMOB_ANDROID_APP_ID=ca-app-pub-...
```

Ad unit IDs are passed as props or constants per product. In development, use test IDs from `react-native-google-mobile-ads`.

## Dependencies (when implemented)

- `react-native-google-mobile-ads` (mobile)
- Web: standard `<script>` tag or Google Ad Manager SDK

## Notes

AdMob requires app verification in the Google AdMob console. Do this before submitting to the Play Store. Revenue is low initially — see `docs/monetization.md` for realistic projections.
