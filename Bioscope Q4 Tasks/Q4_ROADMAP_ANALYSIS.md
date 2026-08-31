# Bioscope+ — Q2–Q4 Roadmap Analysis

**Source:** [Google Sheet — Bioscope roadmap](https://docs.google.com/spreadsheets/d/1M4SOFRK6iolhf4s1JPA3eAXvcA8TaSEDV5Lb6oCoXzA/edit) (single tab, `Sheet1`, 8 feature rows)
**Local copy:** `source-roadmap-sheet.csv`
**Read:** 30 Aug 2026
**Columns:** Feature · Details · Key Capabilities · UI Required · Nusratech understanding (per Meemnur bhai's direction) · UX Status

---

## 1. What this sheet actually is

It is a **monetisation roadmap**, not a feature roadmap. Seven of the eight rows are about turning content into revenue — paywalls, packs, vouchers, discounts, autorenewal, gifting. Only one row (New Partner Integration) is pure content supply.

The sheet mixes three quarters. Tags scattered in the capability cells resolve to:

| Quarter | Items |
|---|---|
| **Q2** | Discount & Voucher (SOL params), DOB *(done)*, One Tap Binding, New One Tap Partner *(done)*, Partner onboarding — Utshob / SRK / Tapmad |
| **Q3** | Portrait-mode content play, Bioscope+ autorenewal through POL |
| **Q4** | Auto-play after trailer completion, clear subscription CTA when paywalled |
| **Untagged** | Pack page revamp, Digital Subscription Product Selling, Dynamic Discounting, Gifting Subscription |

The untagged block is the largest design surface and has no committed quarter — that is the first thing worth pinning down.

**UX status per the sheet:** Shorts enhancement `Done` · Play Journey `WIP` · Pack page revamp *blocked, awaiting GP wireframe* · everything else blank.

---

## 2. Feature-by-feature

### 2.1 Shorts capability enhancement — Microdrama partner · UX: Done
Converts Shorts from discovery-only to monetisable: series-based episodic Shorts, TVOD (pay-per-short / pay-per-series), unlock after free previews, checkout integration, analytics (Matomo + Mixpanel), sample APIs from Deeptoplay & Tapmad, CA integration scope for Tapmad.

**Status:** marked Done and explicitly out of our current scope. Noted here only because it establishes the *unlock-after-free-preview* pattern that the Play Journey and Pack rows both reuse — the same entitlement primitive should serve all three.

### 2.2 New Partner Integration (3 partners) · UI: N/A
Utshob, SRK, Tapmad. Content ingestion, DRM & entitlement mapping, reporting & settlement readiness.

**Design impact:** the sheet says no UI, which is only true of the ingestion pipeline. Three new partners still land in the UI as brand tiles on the pack page, filter facets, and entitlement badges on content. Worth confirming whether partner branding needs design treatment before this ships.

### 2.3 Play Journey Improvement · UI: Yes · UX: WIP
The most concrete row. Four distinct capabilities:

1. **Portrait-mode content play (Q3)** — content currently plays landscape only; needs portrait like the MyGP SDK.
2. **Auto-play after trailer completion (Q4)** — if the user is already subscribed, skip the trailer entirely and play the actual content (follow the Deepto journey).
3. **Paywall CTA (Q4)** — for an unsubscribed user the trailer plays, then the user is forwarded to the subscribe page. Flagged as **needing RnD**.
4. **Preview clips** — Preview is a *clip type bound to a content item*. GP creates the clip and sets the first ~5 minutes free, then routes to the subscribe page. **Preview takes priority over trailer.** Needs a dedicated Preview button.

**Resolved precedence:** subscribed → content · unsubscribed + preview exists → preview → subscribe page · unsubscribed, no preview → trailer → subscribe page.

### 2.4 Pack page revamp · UI: reference supplied · Blocked
Seven capabilities: simplified pack comparison, "Best Value" highlighting, content-led pack messaging, clear entitlement visibility, data pack catalogue, **pack visibility on the content details page**, and a compact pack page.

**Reference:** [Jio entertainment plans](https://www.jio.com/selfcare/plans/mobility/prepaid-plans-list/?category=Entertainment%20Plans) — a telco pack-list pattern, which signals the direction: dense comparable rows, not the marketing-card layout the prototype currently uses.

**Blocker — resolved 30 Aug 2026.** The wireframe landed: `OTT Package Selection Design/`, analysed in `references/OTT_PACKAGE_SELECTION.md`. This task is no longer gated.

Note "data pack catalogue" — bundling mobile data with content packs is a telco-specific construct that has no equivalent in the prototype at all.

### 2.5 Digital Subscription Product Selling · Figma reference supplied
Selling **third-party** OTT subscriptions out of platform — Netflix, Prime, OneGames. Capabilities: non-streaming product catalogue, purchase & entitlement management, voucher delivery, disclosure & redirection flows, **voucher validity separated from package validity**, and a voucher marketplace UI.

**Reference:** [Figma — Bioscope · Meemnur, node 99-342](https://www.figma.com/design/o8cdupE6gPnXho8TDmt44B/Bioscope----Meemnur?node-id=99-342)

**Direction notes:** needs a customisation page (Tapshop-style), Meem bhai will share the wireframe, and voucher partners will push via an API or webhook — spec also pending from Meem bhai.

This is a genuinely different commerce model from everything else in the app: the user buys a **code**, not access. It needs its own object model (product → voucher → redemption → external redirect), its own validity semantics, and a place to *retrieve* a purchased voucher later. That last part implies an account surface the app does not have.

### 2.6 Dynamic Discounting · UI column blank
Personalised, time-bound pricing: segment-based offers, timer-based discounts, a campaign control panel.

**Direction notes:** segment-based coupon codes, timer-based coupon activation visualisation, and specific time-window visualisation (e.g. active 12:00 AM–2:00 AM).

Two audiences hide in one row: the **customer-facing** discount surface (coupon entry, countdown, price strike-through, eligibility messaging) and an **internal campaign control panel**. The sheet leaves the UI column empty, but both need design. Worth splitting into two tickets.

### 2.7 Monetization capability & Journey Enhancement
- **Bioscope+ autorenewal through POL (Q3)**
- **Discount & Voucher (Q2)** — pass discount parameters to SOL during Order Submit
- **Gifting Subscription** — reference Chorki's gift mechanism

**Direction notes:** updated SOL Submit-Order parameter document to be shared (twice noted — it gates both the discount and voucher legs).

Autorenewal and gifting each imply UI the app has no home for: a manage-subscription / cancel-renewal surface, and a gift purchase + redemption flow with a recipient identity.

### 2.8 Monetization Capability (platform)
DOB (Q2) **Done** · One Tap Binding (Q2) · New One Tap Partner (Q2) **Done**.

Mostly platform plumbing, but One Tap Binding has a real UX surface — consent, the bound-number confirmation, and the failure path when binding does not resolve.

---

## 3. Cross-cutting themes

Four primitives sit under most of the sheet. Designing them once beats designing them per-row.

1. **Entitlement** — a user's access state must answer: which packs are held, what content each unlocks, when it expires, whether it auto-renews, and which third-party vouchers are attached. Play Journey, Pack page, Voucher marketplace, and Autorenewal all read from this.
2. **Paywall moment** — the sheet describes the same "hit the wall → go to subscribe" transition in three places (Shorts unlock, preview end, trailer end). It should be one consistent, reusable moment, not three.
3. **Price presentation** — dynamic discounting, best-value highlighting, pack comparison, and voucher validity all mutate the same price/validity display. It needs a single model that can express base price, discount, countdown, and expiry without each surface improvising.
4. **Account / locker** — vouchers, gifts, autorenewal management, and one-tap binding all need somewhere for the user to go afterwards. There is no such place today.

---

## 4. Gap against the current prototype

Measured against `Bioscope Prototype/` as it stands:

| Roadmap need | Prototype today | Gap |
|---|---|---|
| Entitlement drives unlock | `isVip` boolean in `src/contexts/AppContext.jsx`, **written but never read** | No entitlement layer at all. Lock logic in `src/components/episode/EpisodeGridV2.jsx` only checks `drama.isPremium`/`freeEpisodes`. Subscribing unlocks nothing. |
| Pack catalogue with comparison, best-value, data packs | 3 hardcoded plans in `src/data/plans.js` (Super ৳299/mo, Bangla ৳109/mo, Weekly ৳79/wk) | Marketing-card layout, no comparison view, no data packs, no entitlement visibility. Struck-through price is a fake `price × 1.5`. |
| Pack visibility on content details page | `DramaSheet.jsx` is microdrama-only | No long-form content detail page exists. |
| Portrait long-form play, trailer → content, preview clips | Player is vertical microdrama only, no real video | No long-form player, no trailer/preview concept, no clip types. |
| Paywall CTA | `PremiumChip` renders unconditionally, even post-subscribe; `PremiumBadge.jsx` is a stub returning `null` | No paywall moment, no post-preview handoff. |
| Coupon / dynamic discount | Nothing | No promo entry, no countdown, no segment awareness. |
| Voucher marketplace | Nothing | No non-streaming product model, no locker, no redirection flow. |
| Gifting, autorenewal management | Nothing | No account, no manage-subscription surface. |
| One-tap binding, DOB | Nothing | No auth or identity anywhere; "Account" nav slot is `screen: null`. |
| Ads suppressed for subscribers | `FullPageAd`, `InlineAdStrip`, `AdBanner` all render unconditionally | Ads ignore subscription state entirely. |

The load-bearing gap is the first row. **Until `isVip` is replaced by a real entitlement model, most of this roadmap cannot be prototyped honestly** — every paywall, pack, and voucher screen would be a static mock.

---

## 5. Open questions

**Needs an answer before design starts**
1. ~~What is the real pack catalogue?~~ **Partly answered** by the live-app reference: Standard (1 Week, 5 GB Internet, ৳149→৳99), Duo Binge + GP User Plan with Minutes (1 Month, 30 Min + 100 SMS, ৳299→৳179), Family + 5GB Internet (3 Months, Skitto only, ৳345→৳229). The full catalogue is still unconfirmed.
2. ~~What is a "data pack"?~~ **Answered:** mobile data, minutes and SMS bundled *into* the content pack, shown as a chip beside the duration. Not a separate channel.
3. Do the untagged rows (Pack revamp, Voucher marketplace, Dynamic discounting, Gifting) belong to Q4 or later? Four large surfaces with no quarter is a scoping risk.
4. Dynamic discounting — is the customer-facing coupon surface and the internal campaign control panel one deliverable or two?

**Can be assumed and corrected later**
5. If a content item has no preview clip and the user is unsubscribed, the trailer plays. Assumed from the stated precedence, not written.
6. Voucher delivery lands in an in-app locker (with SMS/email as a secondary channel). No channel is specified in the sheet.
7. When voucher validity and package validity diverge, the user sees both dates independently — the sheet asks for the separation but not the presentation.

**Waiting on others**
8. **Meem bhai** — ~~GP pack page wireframe~~ *(delivered 30 Aug 2026)*; Tapshop-style customisation page wireframe *(blocks 2.5)*; voucher partner API/webhook spec *(blocks 2.5)*.
9. **Updated SOL Submit-Order parameter doc** *(blocks the discount and voucher legs of 2.7)*.
10. **RnD outcome** on forwarding unsubscribed users from trailer end to the subscribe page *(blocks 2.3)*.

---

## 6. Suggested sequencing

1. **Entitlement model first.** Replace `isVip` with a real held-packs structure — pack id, content scope, validity window, renewal flag, attached vouchers. Everything downstream reads it. This is unblocked today.
2. **Paywall moment.** One reusable transition serving preview-end, trailer-end, and locked-episode. Also unblocked.
3. **Play journey.** Portrait player, preview-over-trailer precedence, subscribed skip-trailer. Partially blocked on RnD, but the portrait player and preview button are not.
4. **Pack page.** Unblocked — the GP wireframe has landed. Confirmed a real task 30 Aug 2026.
5. **Voucher marketplace.** Blocked on two wireframes and the partner API spec.
6. **Dynamic discounting.** Depends on the pack page's price presentation existing first.
7. **Gifting + autorenewal management.** Both need an account surface; scope that surface once, serve both.

Items 1 and 2 are the ones worth starting on now — they are unblocked, and every blocked item downstream depends on them.

> **Assigned scope:** only the four Play Journey capabilities in §2.3 are ticketed to us. See `DESIGN_SCOPE.md`. The rest of this document is roadmap context.
