# Bioscope+ Q4 — Assigned Design Scope

**Four mother tasks**, drawn from rows 4–7 of the roadmap sheet. Only the first is ticketed in ClickUp so far; its four tickets are subtasks of it, not tasks in their own right.

| # | Mother task | Sheet row | Status | Spec |
|---|---|---|---|---|
| **1** | Play Journey Improvement | 4 | `WIP` — 4 subtasks ticketed | `specs/M1_PLAY_JOURNEY.md` |
| **2** | Pack page revamp | 5 | Unblocked — GP wireframe landed | `specs/M2_PACK_PAGE_REVAMP.md` |
| **3** | Digital Subscription Product Selling | 6 | Unblocked — demo vouchers | `specs/M3_VOUCHER_MARKETPLACE.md` |
| **4** | Dynamic Discounting | 7 | Unblocked — depends on #2 | `specs/M4_DYNAMIC_DISCOUNTING.md` |

Out of scope: Shorts capability enhancement (row 1, `Done`), New Partner Integration (row 2, no UI), Monetization capability & Journey Enhancement (row 8) and Monetization Capability (row 9) — both backend plumbing, though **auto-renewal and gifting live in row 8 and auto-renewal surfaces as UI inside our checkout.**

---

## Mother task 1 — Play Journey Improvement

The only one with ClickUp tickets. All four created 25 Aug 2026 by Shakin Ul Alam, assigned to Anik Roy, `TO DO`, tagged `p4`, no descriptions.

| Subtask | ClickUp title | Screens | Spec |
|---|---|---|---|
| 1a | Content playable in portrait mode | ~8 | `specs/M1a_PORTRAIT_MODE.md` |
| 1b | Content preview before paywall, Preview Button | ~5 | `specs/M1b_PREVIEW_PAYWALL.md` |
| 1c | Auto play logic after trailer completion | ~4 | `specs/M1c_TRAILER_AUTOPLAY.md` |
| 1d | Clear CTA for subscription paywall | ~6 | `specs/M1d_PAYWALL_CTA.md` ✅ |

**The rule they implement:** preview outranks trailer, subscription outranks both. 1b and 1c are two entry paths into the same exit; **1d is that exit.** 1a is orthogonal.

## Mother task 2 — Pack page revamp

Catalogue with validity × platform filtering, a hoisted recommended pack, the shared pack card, entitlement visibility, and the extended checkout. **~10 screens**, plus **~10** more for the mobile balance rail (`specs/PAYMENT_MOBILE_BALANCE.md`).

Its **pack card (P4)** is consumed by subtask 1d's compact paywall sheet — build it here first.

## Mother task 3 — Digital Subscription Product Selling

Third-party OTT vouchers (Netflix, Prime, OneGames, YouTube Premium, Spotify). A different commerce model: the user buys a **code**, not access. **~12 screens**, built on demo vouchers — the outstanding Tapshop wireframe can refine the storefront later without blocking the flow.

## Mother task 4 — Dynamic Discounting

Segment-based and time-bound pricing. Attaches to the "Discount ⌄" expander already present in the live checkout. **~7 screens**, provisional — written once mother task 2's price presentation exists.

Its **campaign control panel** is an internal admin tool, a separate product. Confirm scope before designing it.

---

## Totals

| Mother task | Screens | Confidence |
|---|---|---|
| 1 — Play Journey | ~20 | 1d specced; 1a–1c await player references |
| 2 — Pack page | ~20 | Specced |
| 3 — Voucher marketplace | ~12 | Specced |
| 4 — Dynamic discounting | ~7 | Provisional |
| | **~59** | |

---

## Shared prerequisites

Cross-cutting, unblocked, and required by more than one mother task. Build before any of them.

1. **A subscribed state that screens actually read** — `isVip` is written and never read, so subscribing changes nothing. Needed by mother tasks 1, 2 and 3.
2. **Long-form content fixtures with clip types** — main, trailer, preview — plus a content detail page and a long-form player. The prototype has only microdrama objects and a vertical player. Mother task 1.
3. **The pack card** — mother task 2's P4, consumed by 1d and by 2's own catalogue and content-detail strip.
4. **One paywall moment** — subtask 1d, entered from three places.

See `DATA_MODEL.md` and `PROTOTYPE_STATE.md`.

## Blockers

**None.** Everything outstanding has been resolved or worked around:

| Was blocking | Resolution |
|---|---|
| GP pack page wireframe | Delivered 30 Aug 2026 |
| Full pack catalogue | Demo catalogue of 12 packs — `FIXTURES.md` §1 |
| Tapshop wireframe · voucher partner spec | Demo vouchers — `FIXTURES.md` §3. Wireframes can refine the storefront later |
| Rental term | 48 hours from first play |
| GP's RnD on trailer-forward | Decided — paywall rises over the held final frame, no countdown. `M1c` |
| Rental on every title? | `bangla-original` has none, so the single-CTA layout is reachable |
| X-RAY badge | Dropped — mislabelled genre tag |
