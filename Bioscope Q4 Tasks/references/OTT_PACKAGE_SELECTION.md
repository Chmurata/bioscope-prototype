# OTT Package Selection — direction read

**Source:** `OTT Package Selection Design/` — **this is the GP pack-page wireframe Meemnur shared.** Built as AI-generated HTML on a "modernist" design-system bundle.

**Status:** this artefact *is* the dependency the roadmap sheet logged as "Meem bhai will share related wireframe". **The pack page revamp is therefore no longer blocked.** Its information architecture carries client authority — it is GP's stated direction, not a reference someone found.

**How to use it:** information architecture and structure carry weight; **its visual language does not.** — ignore the design system in `_ds/`, the 2px hard borders and square corners, the monogram badges, the uppercase kickers, the type scale, and the palette. Ignore the placeholder brands (StreamMax, PlayArena, DesiFlix) and the Tk price points; they are dummy data. Bioscope+ keeps its own tokens per `PROTOTYPE_STATE.md`.

This artefact targets the **Pack page revamp**, which is not among our four assigned Play Journey tasks — but it is a real, now-unblocked task (confirmed 30 Aug 2026), and Task D hands off to pack selection, so that handoff must be compatible with this IA.

**Read it alongside `references/subscription/01-mobile-balance-payment-flow.png`,** which shows the *real* Bioscope+ plan and checkout screens. Where the two disagree, the live-app reference wins on content and the wireframe wins on structure — see the reconciliation note at the end.

---

## The ideas worth taking

### 1. Two-axis filtering — validity × platform
Two labelled horizontal chip rows: **Validity** (All · 1 Day · 7 Days · 28 Days · 90 Days · 365 Days) and **Platform** (All · per-provider · Combo · Data+OTT). Filters compose; an empty result is handled explicitly.

This is the telco pack-list pattern the roadmap's Jio reference was pointing at. It also means duration stops being a display string and becomes a filterable value.

### 2. One recommended pack hoisted above the list
A single "Most Popular" pack sits above the filtered results in its own emphasised block, and **does not participate in filtering** — it stays put as the filters change. Directly answers the sheet's "highlight Best Value packs" requirement without ranking the whole list.

### 3. Heterogeneous pack types in one list, separated by kicker
`OTT BUNDLE` · `COMBO · OTT + TVOD` · `COMBO PACK` · `DATA + OTT` — pure OTT, OTT+TVOD, and data+OTT bundles all coexist in a single scroll, distinguished by a kicker label rather than split into sections.

The strongest idea here. It solves the roadmap's "data pack catalogue" requirement without a separate destination, and it scales when new pack kinds arrive.

### 4. Payment eligibility shown per pack, at selection time
Each card lists only the methods that pack supports — Balance, Wallet, Card, Voucher. The user learns "this pack can be paid from mobile balance" *before* committing, not at checkout.

Worth taking. Our current flow shows an identical payment list for every plan, so an ineligible combination could only be discovered late.

**It also introduces mobile balance as a payment method** — direct carrier billing. Our `paymentMethods.js` has bKash, Rocket, Nagad, Other Cards & MFS and upay, but no operator balance. That is a real gap, not a styling detail.

### 5. Platform badges plus a plain-language summary
Compact monogram tiles alongside a readable line ("StreamMax + PlayArena + DesiFlix"). The *pattern* is right — a glanceable multi-provider indicator with a text fallback — even though our version should use the real OTT logo tiles we already have in `OTTLogoStrip.jsx` rather than letter monograms.

### 6. Explicit price units
`Tk 149 / 7 days` — the unit sits beside the price. Makes packs of different durations comparable at a glance. Our plan cards put duration and price on opposite ends of a row, which compares less directly.

### 7. Two CTA tiers with different verbs
Recommended pack says **"Subscribe Now"** (primary, direct). List packs say **"Select Pack"** (secondary, select-then-continue). The recommended pack gets a shorter path.

### 8. Footer legal microcopy
*"Prices include VAT. Auto-renewal can be turned off anytime from My Subscriptions."*

Two things ride along: VAT-inclusive pricing is stated, and **a "My Subscriptions" surface is assumed to exist.** We have no such screen — and autorenewal management is a separate roadmap row, currently unassigned.

### 9. Empty state
"No packs match these filters." Small, but our flow has no filtering and therefore no empty state at all.

---

## What it does not cover

Checkout, payment entry, processing, success, and any post-purchase state. It stops at pack selection. Our existing `SubscribeSheet` covers exactly the part this omits — the two are complementary, not competing.

It also has no concept of a paywall context: no notion of arriving here blocked on a specific title, and so no filtering by what actually unlocks that title. That gap is precisely Task D6.

---

## Consequences for our scope

**Task D4 (pack handoff)** should present a compact version of this: the recommended pack plus the packs that unlock the blocked content, with per-pack payment eligibility visible. Filters do not belong in the in-player sheet — they belong on the full pack page it links out to.

**`DATA_MODEL.md` needs pack fields** this artefact implies and our plan fixture lacks — see the "Pack model additions" section there.

**Confirmed 30 Aug 2026:** the pack page revamp is a real task, and **mobile balance / direct carrier billing is required.** Specced in `specs/PAYMENT_MOBILE_BALANCE.md` — it is not simply a sixth row in the payment list; it carries eligibility, prepaid/postpaid and balance-sufficiency states the MFS rails do not, and its availability depends on MSISDN identification via One Tap Binding.


---

## Reconciling the wireframe against the live app

The mobile balance reference shows the plan screens as they ship today. The two artefacts describe the same surface at different maturities.

| | GP wireframe | Live app reference |
|---|---|---|
| Filtering | Validity × platform chips | None |
| Recommended pack | Hoisted above the list, exempt from filters | Badge on an inline card ("Recommended for All") |
| Pack taxonomy | Kicker labels — OTT / OTT+TVOD / Data+OTT | Implicit; telco value shown as a chip |
| Telco value | "Data+OTT" as a platform filter | `5 GB Internet`, `30 Min + 100 SMS` chips on the card |
| Segment targeting | Absent | "Best for GP Users", "Only for Skitto Users" |
| Payment eligibility | Per-pack icons — Balance / Wallet / Card / Voucher | Not shown at plan level |
| Price | `Tk 149 / 7 days` with unit | Struck original + current, no unit |
| Empty state | "No packs match these filters." | N/A — no filtering |

**The synthesis:** take filtering, the hoisted recommended pack, per-pack payment eligibility, the price unit and the empty state from the wireframe. Take telco-value chips, segment badges and real struck pricing from the live app. Neither artefact has both halves.

**One thing only the live app has:** segment eligibility. A pack marked "Only for Skitto Users" implies packs a given user cannot buy — which the wireframe's filter model has no way to express, and which needs an ineligible state nobody has designed.
