# Build order

One ordered sequence across all four mother tasks. Follow it top to bottom; each stage only depends on the ones above it.

---

## Read this before anything else

**Take the build phases from this file only. Do not infer scope, phase names or next steps from code already in the repo.**

The codebase contains a large amount of pre-existing microdrama and shorts work — `MicroDramaScreen`, `src/components/shorts/`, `src/data/dramas.js`, `SCREENS.MICRODRAMA`, `PlayerScreen` (the vertical player). **None of it is in scope.** It is described in `PROTOTYPE_STATE.md` only so it is not mistaken for something to extend, and referenced in the specs only as the thing the new long-form work sits beside.

There is no microdrama phase, no shorts phase, and no expansion of either. If a phase name does not appear in the Stage map below, it is not a phase.

### Stage map — the only six phases that exist

| Stage | Mother task | Name | Spec |
|---|---|---|---|
| **0** | — | Foundations | `FIXTURES.md`, `DATA_MODEL.md` |
| **1** | — | Shared components | `specs/M1a_PORTRAIT_MODE.md`, `specs/M2_PACK_PAGE_REVAMP.md`, `specs/M1d_PAYWALL_CTA.md` |
| **2** | Mother 1 | Play Journey Improvement | `specs/M1a`–`M1d` |
| **3** | Mother 2 | Pack page revamp | `specs/M2_PACK_PAGE_REVAMP.md` |
| **4** | Mother 4 | **Dynamic Discounting** | `specs/M4_DYNAMIC_DISCOUNTING.md` |
| **5** | Mother 3 | Voucher marketplace | `specs/M3_VOUCHER_MARKETPLACE.md` |

**Note the stage and mother-task numbers do not line up at the end.** Stage 4 is Mother task **4** (Dynamic Discounting); Stage 5 is Mother task **3** (Voucher marketplace). Dynamic Discounting comes first because it depends on Stage 3's price presentation; the voucher marketplace depends on nothing and goes last. **Always resolve a stage by its spec filename, not by its number.**

The references in `references/` are a **starting point, not a contract.** They come from Anik's own Figma, so add what a flow needs and discard what is wrong. Two corrections are already baked in: `X-RAY` is dropped, play/pause is added.

---

## Stage 0 — Foundations

Nothing renders correctly until these exist.

| | What | Where |
|---|---|---|
| 0.1 | **Subscription + rental state that screens read.** `isVip` is written and never read — replace it. `DATA_MODEL.md` §1 | `src/contexts/AppContext.jsx` |
| 0.2 | **All fixtures** — 12 packs, 8 titles, 7 vouchers, one demo user. Everything is written out in `FIXTURES.md`; transcribe it | `src/data/` |
| 0.3 | **Compress and wire the two videos** — `FIXTURES.md` §5. 252 MB will not survive a dev server; transcode to 720p first | `media/` → `src/assets/video/` |
| 0.4 | **Dev panel controls** — subscribed/not + which pack, rented/not, content case, orientation, paywall origin, carrier account known/unknown. `DATA_MODEL.md` §7 | `src/components/ControlPanel.jsx` |

Without 0.3 the prototype cannot be demoed — every branch would have to be reached by tapping through.

## Stage 1 — Shared components

Built once, consumed by several screens. Building these before their containers is the whole point of this ordering.

| | What | Consumed by |
|---|---|---|
| 1.1 | **Pack card** (`specs/M2_PACK_PAGE_REVAMP.md` P4) — segment badge, telco chip, coverage line, OTT strip, struck price + unit, payment eligibility | M2 catalogue, M1d compact sheet, M2 content-detail strip |
| 1.2 | **Long-form player** (`specs/M1a_PORTRAIT_MODE.md`) — inline 16:9, both chrome rows, centre play/pause + skip, seekbar on real duration | M1a, M1b, M1c |
| 1.3 | **Content detail page** (`specs/M1a_PORTRAIT_MODE.md`) — title, genres, meta, CTA area, action row, See more, More like this | M1a, M1b, M1c, M1d, M2 |
| 1.4 | **Paywall shell** (`specs/M1d_PAYWALL_CTA.md`) — one component, four origins, two purchase paths | M1b, M1c, M1d |

## Stage 2 — Play Journey Improvement (Mother task 1)

| | What | Spec |
|---|---|---|
| 2.1 | Portrait player states — chrome visible / hidden / paused, settings sheet | `specs/M1a_PORTRAIT_MODE.md` A3–A5, A9 |
| 2.2 | Landscape + rotation handoff | `specs/M1a_PORTRAIT_MODE.md` A6–A7 |
| 2.3 | Preview CTA, free-window indicator, approach-to-end, preview end | `specs/M1b_PREVIEW_PAYWALL.md` B1–B5 |
| 2.4 | Trailer play, next-up countdown card, trailer end | `specs/M1c_TRAILER_AUTOPLAY.md` C1–C4 |
| 2.5 | Paywall by origin, compact pack sheet, rent confirmation, post-purchase routing | `specs/M1d_PAYWALL_CTA.md` D1–D6 |
| 2.6 | Picture-in-picture | `specs/M1a_PORTRAIT_MODE.md` A8 |

## Stage 3 — Pack page revamp (Mother task 2)

| | What | Spec |
|---|---|---|
| 3.1 | Catalogue — default, filtered, empty | `specs/M2_PACK_PAGE_REVAMP.md` P1–P3 |
| 3.2 | Ineligible pack state | `specs/M2_PACK_PAGE_REVAMP.md` P5 |
| 3.3 | Checkout — auto-renewal toggle, discount expander, saved instruments | `specs/M2_PACK_PAGE_REVAMP.md` P8 |
| 3.4 | Mobile balance rail — number + consent, OTP + limit disclosure, success, failures | `specs/PAYMENT_MOBILE_BALANCE.md` MB1–MB10 |
| 3.5 | My Subscriptions | `specs/M2_PACK_PAGE_REVAMP.md` P9 |
| 3.6 | Pack detail / comparison, content-detail pack strip | `specs/M2_PACK_PAGE_REVAMP.md` P6–P7 |

## Stage 4 — Dynamic Discounting (Mother task 4)

Segment-based and time-bound pricing. Attaches to the collapsed **"Discount" expander** already present in the Stage 3 checkout, and to the pack card's struck-price treatment. Needs Stage 3's price presentation to exist first.

Nothing in this stage relates to microdrama, shorts, or content expansion of any kind.

| | What | Spec |
|---|---|---|
| 4.1 | Segment offer on the pack card, countdown, time-window states (upcoming / active / ended) | `specs/M4_DYNAMIC_DISCOUNTING.md` |
| 4.2 | Coupon entry at checkout, applied with itemised breakdown, rejected (invalid / expired / not eligible) | `specs/M4_DYNAMIC_DISCOUNTING.md` |

## Stage 5 — Voucher marketplace (Mother task 3)

| | What | Spec |
|---|---|---|
| 5.1 | Storefront, category, product detail, disclosure | `specs/M3_VOUCHER_MARKETPLACE.md` V1–V4 |
| 5.2 | Checkout, code reveal | `specs/M3_VOUCHER_MARKETPLACE.md` V5–V6 |
| 5.3 | Locker + the three voucher states | `specs/M3_VOUCHER_MARKETPLACE.md` V7–V10, V12 |
| 5.4 | Redirection handoff | `specs/M3_VOUCHER_MARKETPLACE.md` V11 |

Independent of stages 2–4 — it shares only the payment rails. Can run in parallel if there is capacity.

---

## Do not build — and do not take scope cues from

Present in the codebase, not in scope, and easy to mistake for working features or for hints about what to build next:

- `src/screens/BrowseScreen.jsx` — fully built, three variants, nothing navigates to it
- `PlayerScreen` V2/V3 and `BrowseScreen` V2/V3 — unreachable, no UI sets `variants.*`
- Flexiplan's "Create Package" button — dead in the live app too; keep the card, keep the button inert
- `ActionColumn`'s Share — a no-op
- Anything in `src/components/shorts/` or the microdrama player — out of scope

## Carry these through

- **Tokens.** `src/index.css` `@theme`. The existing monetisation UI bypasses it with raw hex — do not extend that. New colour gets a token.
- **Amber = subscription. Cyan = interactive text and progress. White = primary action.** Consistent across both references.
- **Honest fake timings.** A 5-minute preview window cannot sit on the 15-second fake `Seekbar` runs today.
- **Everything clickable.** These are clickthrough prototypes, not static comps.
