# Mother task 2 — Pack page revamp

**Sheet row 5** · confirmed ours 30 Aug 2026 · **unblocked** — GP's wireframe has landed.

Sheet capabilities: simplified pack comparison · highlight "Best Value" packs · content-led pack messaging · clear entitlement visibility · data pack catalogue · pack visibility in content details page · compact pack page.

## Inputs

| Source | Contributes |
|---|---|
| `../references/OTT_PACKAGE_SELECTION.md` | GP's wireframe — **structure and IA only**, not visuals |
| `../references/subscription/01-mobile-balance-payment-flow.png` | The live app — real packs, real checkout, real prices |
| `SUBSCRIPTION_FLOW_BASELINE.md` | The built checkout to extend |
| `PAYMENT_MOBILE_BALANCE.md` | Carrier billing rail, MB1–MB10 |
| `../DATA_MODEL.md` §1, §5 | Subscription and pack shapes |
| `../FIXTURES.md` §1 | The 12-pack demo catalogue |

Neither reference has both halves. Structure comes from the wireframe; content comes from the live app. The reconciliation table in `../references/OTT_PACKAGE_SELECTION.md` records which contributes what.

---

## Screens

| # | Screen | Notes |
|---|---|---|
| P1 | Catalogue — default | Recommended pack hoisted above the filtered list |
| P2 | Catalogue — filters applied | Validity × platform chip rows |
| P3 | Catalogue — empty | "No packs match these filters", one-tap clear |
| P4 | **Pack card — full anatomy** | The load-bearing component |
| P5 | Pack card — ineligible | Segment-gated. **Nobody has designed this** |
| P6 | Pack detail / comparison | What each unlocks, side by side |
| P7 | Pack strip on content detail | "Available in X pack" — the cross-sell hook |
| P8 | Checkout | Auto-renewal toggle, discount expander, saved instruments |
| P9 | My Subscriptions | Held pack, what it covers, expiry, renewal |

### P1 — Catalogue

Header: back, "Select Your Pack", subtitle naming what is on offer.

Two labelled horizontally-scrolling chip rows — **Validity** (All · 1 Day · 7 Days · 28 Days · 90 Days · 365 Days) and **Platform** (All · providers · Combo · Data+OTT).

Then the **recommended pack**, hoisted in its own emphasised block, **exempt from filtering** — it stays put as chips change. This answers "highlight Best Value" without ranking the whole list.

Then the filtered list. Then **Flexiplan**, which exists in the live app and must not be lost. Then footer microcopy: VAT-inclusive pricing, auto-renewal manageable later.

### P4 — Pack card anatomy

Appears in the catalogue, in subtask 1d's compact paywall sheet, and in P7's content-detail strip. **Built once here, consumed everywhere.** It must survive all three widths.

| Element | From | Notes |
|---|---|---|
| Segment badge | Live app | "Recommended for All" / "Best for GP Users" / "Only for Skitto Users" — eligibility, not decoration |
| Title | Both | |
| Duration | Both | |
| Telco value chip | Live app | `5 GB Internet`, `30 Min + 100 SMS` — beside the duration |
| Coverage line | Live app | "Get access to 10 OTT platforms" |
| OTT logo strip | Live app | Reuse `OTTLogoStrip.jsx` — real logos, not letter monograms |
| Price | Live app | Struck `originalPrice` + current. **Real prices, not `price × 1.5`** |
| Price unit | Wireframe | `/ 7 days`, so durations compare at a glance |
| Payment eligibility | Wireframe | Only the rails this pack supports |
| CTA | Wireframe | Recommended gets the direct verb; list packs the select verb |

### P5 — Ineligible pack

**Undesigned by anyone.** "Only for Skitto Users" implies packs some users cannot buy. The wireframe's filter model cannot express it; the live app shows no treatment.

**Decided: show the pack with its requirement stated and no CTA.** Hiding it is cleaner but makes the catalogue silently differ between users, which reads as a bug the moment two people compare screens. Disabling with a route to eligibility assumes a path to becoming a Skitto user that we do not control.

### P8 — Checkout

Extends the built checkout with three things the live reference shows and the prototype lacks:

- **Auto-renewal toggle**, off by default, opt-in
- **Discount expander**, collapsed *(the surface Dynamic Discounting — mother task 4 — will fill)*
- **Saved instruments** as real masked rows (`016####029 · Saved by bKash`), ranked above fresh methods, replacing the prototype's decorative permanently-unchecked box

Mobile Balance sits first and pre-selected, per the reference.

### P9 — My Subscriptions

Does not exist today. The wireframe's footer already refers to it — *"Auto-renewal can be turned off anytime from My Subscriptions"* — so the surface is assumed by copy that ships. Shows the held pack, what it covers, when it expires, and the renewal toggle.

---

## Build order

1. Pack fixtures (`../DATA_MODEL.md` §5), including one ineligible pack
2. **P4 pack card** — before anything that renders it, including subtask 1d
3. Catalogue P1–P3
4. Checkout P8, then the mobile balance rail
5. My Subscriptions P9
6. P5, P6, P7

## Open questions

1. **Is the recommended pack global or per-segment?** The wireframe implies one "Most Popular"; the live app's badges are segment-aware. If per-segment, it overlaps mother task 4.
2. ~~Full catalogue?~~ **Resolved** — a 12-pack demo catalogue is specced in `../FIXTURES.md` §1, sized so every validity chip returns results, some filter pairs return none (so P3's empty state is reachable), and one pack is ineligible by segment.
