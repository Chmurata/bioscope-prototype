# Revision brief 01

Post-build review of the Stage 0–5 work. Ordered by severity — R1 and R2 make things unusable, R7 is cosmetic.

Read `BUILD_ORDER.md`'s scope guard first. Nothing in this brief touches microdrama, Shorts or Live TV.

---

## Already fixed — do not redo

Two crash-level defects were patched during review:

- **`src/screens/ContentDetailScreen.jsx`** — `useEffect` (line 57) and `Crown` (line 176) were used without being imported, throwing a `ReferenceError` on every mount and taking the whole detail screen down with it. Imports added.
- **`src/data/vouchers.js`** — `demoLocker` used an older schema (`voucherId`, `daysRemaining`, `redeemedDaysAgo`) while `MySubscriptionsSheet.jsx` and `OwnedVoucherDetailSheet.jsx` read `productId`, `codeExpiresAt`, `redeemedAt`, `packageExpiresAt`. Every row resolved to null. Reseeded to the schema the components read, with dates that make both clocks count correctly.

**`src/components/ControlPanel.jsx` was also rewritten** for Q4 scope only — microdrama nav, the `dramas[0]` fallback and the ad-streak controls are gone, replaced by one-tap access to every branch in the specs, grouped by mother task. Use it to reach the states below; do not re-add anything to it.

---

## What is good — leave alone

Fixture fidelity is exact: all 12 packs, 8 titles and 7 voucher products match `FIXTURES.md`. Real video is properly wired — `LongFormPlayer.jsx` drives a real `<video>` off `currentTime`/`duration`, with the preview cut and trailer end as real events rather than timers. `subscription` and `rentals` are read live. And no scope was invented; gaps were left as gaps.

---

## R1 — `orientation` and `carrierKnown` are dead state

**Severity: blocking.** Both are written by `AppContext.jsx` and `ControlPanel.jsx` and **read by no other file.** Confirmed by grep across `src/`.

Consequences: the landscape toggle does nothing (subtask 1a's A6/A7 cannot be demonstrated), and the Mobile Balance row never hides for a subscriber whose number is unknown (MB10 unreachable).

**Done when:** `LongFormPlayer.jsx` renders its landscape layout from `orientation`, and the payment method list hides Mobile Balance when `carrierKnown` is false. Both toggles visibly change the UI.

Spec: `specs/M1a_PORTRAIT_MODE.md` A6–A7 · `specs/PAYMENT_MOBILE_BALANCE.md` MB10

## R2 — Payment methods ignore `pack.payWith`

**Severity: blocking.** `src/components/PaywallSheet.jsx:351–366` hardcodes Mobile Balance, saved bKash and the rest as literal buttons. It never consults `selectedPack.payWith` or `carrierKnown`.

`annual-bangla` and `premium-annual` deliberately exclude `'balance'` in `FIXTURES.md` §1 precisely so per-pack eligibility is visible rather than theoretical. Right now filtering to 365 days and reaching checkout still offers carrier billing.

**Done when:** the method list is derived from `pack.payWith`, and Mobile Balance additionally requires `carrierKnown`. Selecting a 365-day pack visibly drops it.

Spec: `specs/M2_PACK_PAGE_REVAMP.md` P8 · `specs/PAYMENT_MOBILE_BALANCE.md` MB10

## R3 — Pack strip raises the paywall with the wrong origin

`src/screens/ContentDetailScreen.jsx:172` passes `origin: 'generic'` while `selectedDrama` is in context.

Per the origin table, `generic` means "no content in context" and routes to **Home** after payment. So a user who taps "Available in X pack" on a title, pays, and lands on the home screen instead of the title they were trying to watch.

**Done when:** that call passes `origin: 'locked-tap'` with the content, and payment returns to the player for that title. `generic` should only ever come from the amber Subscribe pill in the home top bar.

Spec: `specs/M1d_PAYWALL_CTA.md` — origin table, D6

## R4 — Trailer paywall re-fires on every replay

`specs/M1c_TRAILER_AUTOPLAY.md` sets three rules for the trailer-end paywall. The third — **"it fires once per title per session"** — is not implemented. There is no per-title flag, so `handleBoundaryReached` (`ContentDetailScreen.jsx:61`) raises the paywall every time the trailer ends.

The rule exists so that someone rewatching a scene does not get a sales screen each time. Without it the trailer is a trap, which is the exact outcome the spec was written to avoid.

Check rules 1 and 2 while you are in there: backing out mid-trailer must **not** raise the paywall (only completion does), and dismissing must return to the detail page rather than a dead player sitting on a final frame.

**Done when:** trailer → paywall → dismiss → replay trailer → no paywall, within the same session.

## R5 — `PackComparisonSheet` is hardcoded

`src/components/PackComparisonSheet.jsx:37–39` renders a static Basic / Standard / Premium table, disconnected from the 12-pack fixture. Comparison is one of the sheet's stated capabilities ("simplified pack comparison"), and comparing three invented tiers demonstrates nothing.

**Done when:** it compares real packs from `src/data/packs.js` — what each unlocks, duration, telco value, price, supported rails — driven by selection rather than hardcoded columns.

Spec: `specs/M2_PACK_PAGE_REVAMP.md` P6

## R6 — Time-window campaign never renders

`src/components/PackCard.jsx:19` branches only on `campaign?.type === 'timer'`. A `type: 'window'` campaign falls through to the generic badge and its `windowLabel` is never displayed.

The 12:00 AM – 2:00 AM case is one of the three things the roadmap sheet explicitly asks to visualise, and the dev panel already emits a `window` campaign to exercise it.

**Done when:** a window campaign shows its active hours, and reads differently in its upcoming, active and ended states.

Spec: `specs/M4_DYNAMIC_DISCOUNTING.md`

## R7 — Missing states

Four specced screens do not exist. All are reachable-by-design once built; none require new fixtures.

| State | Spec | Note |
|---|---|---|
| MB4 — invalid mobile number | `specs/PAYMENT_MOBILE_BALANCE.md` | Get OTP stays disabled, error on the field |
| MB9 — payment failed | `specs/PAYMENT_MOBILE_BALANCE.md` | Split limit-exhausted from carrier decline; limit exhaustion is a hard stop with no top-up escape |
| V2 — brand list | `specs/M3_VOUCHER_MARKETPLACE.md` | Brand tiles currently jump straight to a product; Netflix has two products and needs the intermediate list |
| A7 — rotation handoff | `specs/M1a_PORTRAIT_MODE.md` | Depends on R1 |

Also: **V1 is unreachable from real navigation.** The Account tab in `src/components/BottomNavbar.jsx` is still `screen: null`, so the voucher storefront is only reachable from the dev panel. Wire Account, per `specs/M3_VOUCHER_MARKETPLACE.md` — "Account → Vouchers & Gift Cards".

## R8 — Token pass

**Do this last, as its own pass — not folded into the fixes above.**

Roughly 176 raw hex literals across the 16 new files, and zero uses of the `@theme` tokens in `src/index.css`. Worst offenders: `PaywallSheet.jsx` (60), `VoucherPurchaseSheet.jsx` (20), `PackCard.jsx` (18), `PackComparisonSheet.jsx` (16).

The palette in use (`#00BBFF`, `#FF9900`, `#0A090B`, `#1E2224`) is coherent — it is simply not declared. So this is mostly mechanical:

1. Add the recurring values to the `@theme` block in `src/index.css` as named tokens
2. Replace the literals with token classes
3. Keep the semantic split the references establish — **amber for subscription, cyan for interactive text and progress, white for primary action**

Also consolidate the two payment-method UIs that now coexist: the masked-row list inside `PaywallSheet.jsx` and the older `src/components/PaymentMethodList.jsx`, which still carries the dead permanently-unchecked "Saved by bKash" ghost checkbox. One component, used everywhere.

---

## Order

R1 and R2 first — they unblock demoing two whole branches. R3 and R4 next; both are small and both currently produce actively wrong behaviour a reviewer will hit immediately. Then R5, R6, R7. R8 last, in one sweep.

Do not start R8 until R1–R7 are done, or the token pass will have to be repeated over the new code.
