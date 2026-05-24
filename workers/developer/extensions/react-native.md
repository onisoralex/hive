# Developer Extension: React Native (Expo)

This extension is included when a task involves React Native / Expo mobile development. It supplements and overrides base Developer instructions where there is a conflict.

---

## Environment & Setup

- All React Native projects use Expo (managed workflow). Only eject if a native module absolutely requires it — treat ejecting as a last resort.
- Use `expo-router` for navigation. It is file-based, same mental model as Next.js App Router.
- Target Android first. iOS builds are deferred until Apple hardware is available.
- Development: `npx expo start`. Test on a physical mid-range Android device or an emulator.
- Production builds: `eas build --platform android`. Submission: `eas submit`.

---

## Project Structure

```
app/
  (tabs)/             # bottom-tab navigation group
  _layout.tsx         # root layout — providers go here
  index.tsx           # home screen
assets/
  images/
  fonts/
components/           # reusable components
constants/
  Colors.ts           # all color tokens
  Layout.ts           # spacing, font sizes
hooks/                # custom hooks
utils/                # pure helper functions
.env                  # environment variables (never committed)
app.json              # Expo config
eas.json              # EAS build config
```

---

## Component Conventions

- Use React Native primitives: `View`, `Text`, `TouchableOpacity`, `ScrollView`, `FlatList`. Never `div`, `p`, `button`.
- Use `StyleSheet.create()` for all styles. Inline styles only for values computed at render time.
- Prefer `FlatList` over `ScrollView` + `.map()` for any list that could grow — `FlatList` virtualizes, `ScrollView` does not.
- All colors, font sizes, and spacing must reference constants from `constants/Colors.ts` and `constants/Layout.ts`. Never use literal values in styles.

---

## Navigation

- `expo-router` handles navigation via the file system under `app/`.
- Use `<Link>` for declarative navigation, `router.push()` / `router.replace()` for imperative.
- Back button behavior: Expo Router handles Android back button automatically for stack navigators. Verify on device that back navigation makes sense from every screen.

---

## Local Persistence

- Simple key-value: `AsyncStorage` via `@react-native-async-storage/async-storage`.
- Structured local data: `expo-sqlite`.
- Offline-first tools should never require a network connection for core functionality.

---

## AdMob Integration

- Package: `react-native-google-mobile-ads`.
- All ad unit IDs go in environment variables. Use `TestIds` in development (import from the package), real IDs in production.

**Placement rules (mandatory):**
- **Banner ads:** Fixed at the very bottom of the screen. The banner sits below all scrollable content, above the system navigation bar. Never float over content.
- **Rewarded ads:** Only for explicitly optional actions — "watch an ad to earn 10 credits", "watch an ad to remove ads for this session". Never required for core functionality.
- **Interstitial ads:** Not used.
- **Full-page / app open ads:** Not used.
- Ads are not shown to users on any paid tier. Check payment status before rendering any ad component.

---

## Performance

- Wrap list item components and expensive renders in `React.memo`.
- Avoid creating new functions in JSX props for components rendered inside `FlatList` — use `useCallback`.
- Test on a mid-range Android device. Emulator performance does not reflect real-world experience on budget hardware.

---

## Testing

- Unit and component tests: Jest (Vitest is not supported by Metro bundler).
- E2E: Detox if automated coverage is required. For utility apps, a documented manual QA checklist is acceptable.

---

## Environment Variables

- Use `.env` at the project root. Never commit this file.
- Access via `expo-constants` (`Constants.expoConfig.extra`) after configuring `app.json`.
- Required variables are documented in each project's `docs/architecture.md`.
