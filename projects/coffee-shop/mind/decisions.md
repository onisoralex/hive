# coffee-shop — Decisions

Historical decision log lives in `app/docs/TRACKER.md` under "Decision log".

Append new Hive-session decisions below as they are made.

## Socket room cleanup — view:leave event — 2026-06-19
**Decision:** Add a `view:leave` event that each view emits in its effect cleanup, so Socket.io rooms are vacated on navigation.
**Rejected:** Leaving rooms entirely to the server (e.g. clearing all rooms on reconnect, or tracking per-socket which views are mounted).
**Why:** The SPA never reconnects between navigations — only on actual network drops — so server-side cleanup never fires. The symmetric leave-on-unmount pattern keeps room membership accurate with minimal server logic. The existing `connect` re-join handler still fires only on genuine reconnects, which is the correct place for it.

## Select aria-hidden fix — onClose blur instead of disableRestoreFocus — 2026-06-19
**Decision:** Fix the "Blocked aria-hidden on element" warning by calling `(document.activeElement as HTMLElement)?.blur()` in `MenuProps.onClose` on every MUI Select.
**Rejected:** `disableRestoreFocus` prop (tried first — has no effect on the warning).
**Why:** The warning fires during menu close when a `<li>` MenuItem retains focus while React's batched state update applies `aria-hidden` to the portal. `onClose` runs synchronously in the same call stack *before* the batched update is flushed, so blurring there moves focus before `aria-hidden` is applied. `disableRestoreFocus` only controls post-close focus restoration, not the in-flight focus state during close.

## Browser alert/confirm replaced with MUI Dialog — 2026-06-19
**Decision:** Replace `window.confirm()` / `window.alert()` calls in MenuSection and TablesSection with a MUI Dialog (shared `confirmDialog` state per component).
**Rejected:** Keeping browser dialogs.
**Why:** Browser dialogs block the thread, are unstyled, cannot show inline errors (e.g. when the server rejects the delete), and are inconsistent with the rest of the app's UX. The new dialog allows showing an error Alert inside the dialog if the API call fails, without closing the dialog.

## MUI X date pickers — Desktop variants only — 2026-06-19
**Decision:** Use `DesktopDatePicker` / `DesktopTimePicker` exclusively, not the Mobile variants.
**Rejected:** `MobileDatePicker` / `MobileTimePicker`.
**Why:** Mobile variants treat the entire text field as a touch target and never render an icon button — `openPickerButtonPosition` is silently ignored. The management screen is always used on a desktop browser, so the Desktop variants (popper-based, always show icon) are the correct choice.

## Date-range validation in Orders filter — inline, no useMemo — 2026-06-19
**Decision:** Compute `rangeInvalid` inline from the four filter state variables (no useMemo, no effect) and use it both to suppress the API call in the `load` callback and to disable the Refresh button and show an error caption.
**Rejected:** Validating inside `useEffect` with separate error state; validating only on button click.
**Why:** The computation is a single boolean comparison — cheap enough that memoization adds complexity with no benefit. Deriving it inline keeps the logic visible at the usage site and avoids a stale-closure issue that would arise from putting the check in the `load` callback's dependency list separately.
