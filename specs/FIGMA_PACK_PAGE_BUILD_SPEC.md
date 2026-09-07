Bioscope+ Pack Page (M2) — Figma Build Spec

Source: src/screens/PackCatalogueScreen.jsx (+ PackCard.jsx, PackComparisonSheet.jsx, OTTLogoStrip.jsx, data/packs.js, index.css, contexts/AppContext.jsx, components/ControlPanel.jsx for real campaign-demo data)

Format and rigour match `specs/FIGMA_PAYWALL_BUILD_SPEC.md`. The PackCard base definition in that doc's §5.1 is reused **verbatim** here — this spec only extends it with the campaign-badge variants it explicitly deferred. Divergence against the existing Figma "Choose Your Plan" frame (`specs/FIGMA_SUBSCRIPTION_SPEC.md`, node 11781:112304) is called out in §7, not silently resolved.


═══════════════════════════════════════════════════════
0. SCREEN LIST — ordered, exact code keys / prop combos
═══════════════════════════════════════════════════════

Unlike the paywall (one component with a `stage` state machine), the Pack Page flow is two independent screens/overlays:

1. **PackCatalogueScreen** — full-page screen (`SCREENS.PACK_CATALOGUE`), reached from `handlePackSelect`'s caller or the paywall's "See all packs" link. State: `selectedValidity` (default `'All'`), `selectedPlatform` (default `'All'`), plus the global `activeCampaign` context value (default `null`).
2. **PackComparisonSheet** — bottom-sheet overlay, `open` boolean toggled by the catalogue screen's "Compare all packs" button. No internal state; content is fully derived from `packs.js` on every open.

Both screens share one visual atom, **PackCard**, whose look forks on `pack.eligible`, `pack.recommended`, `pack.badge`, and the runtime `activeCampaign` object (not a `packs.js` field — see §6).

Buildable states, in build order:

| # | Frame state | Drivers |
|---|---|---|
| 1 | catalogue / default | `selectedValidity='All'`, `selectedPlatform='All'`, `activeCampaign=null` |
| 2 | catalogue / filters-empty | `selectedValidity='1 Day'`, `selectedPlatform='chorki'` → 0 filtered matches (recommended card still shows — see note below) |
| 3 | catalogue / campaign-segment | `activeCampaign={packId:'standard', type:'segment', label:'GP Users save 20%', discount:20}` |
| 4 | catalogue / campaign-timer-live | `activeCampaign={packId:'duo-binge', type:'timer', label:'Flash Sale', discount:30, expiresAt: now+10min}` |
| 5 | catalogue / campaign-window-upcoming | `activeCampaign={packId:'super', type:'window', windowState:'upcoming', label:'Midnight offer', discount:25, windowLabel:'12:00 AM – 2:00 AM'}` |
| 6 | catalogue / campaign-window-active | same, `windowState:'active'` |
| 7 | catalogue / campaign-window-ended | same, `windowState:'ended'` |
| 8 | comparison / default | `open=true`, no filters apply — table always lists all 11 `eligible !== false` packs |

All 7 campaign combos above (rows 3–7) are **not invented** — they're copy-pasted from the demo-panel trigger functions in `src/components/ControlPanel.jsx` (lines ~102–117), which is the only place in the codebase that ever calls `setActiveCampaign`. `packs.js` itself carries no campaign fields at all. Flag resolved: see §6.

**Important hoisting note**: `recommendedPack` (the `standard` pack) renders unconditionally above the filtered list — it is never subject to `selectedValidity`/`selectedPlatform`. Frame 2 (filters-empty) still shows the full "Most Popular" Standard card at top; only the section below it collapses to the empty-state block.


═══════════════════════════════════════════════════════
1. GLOBAL CONSTANTS
═══════════════════════════════════════════════════════

- **Catalogue frame**: 360 wide, **sizingV = HUG** (this is a scrolling full-page screen, not a fixed-height sheet — content genuinely isn't 780 tall; matches the precedent set by the existing Figma "Choose Your Plan" frame, which is also 360×HUG). Background fill `#0A090B` (`--color-dark`, `bg-dark`).
- **Comparison frame**: 360×780 fixed (bottom-sheet overlay pattern, identical shell to the Paywall spec's scrim+sheet). Sheet height = **663px** (85% of 780, `h-[85%]`).
- Font: **Inter** everywhere, weight → Figma style name: 400 Regular, 500 Medium, 600 "Semi Bold", 700 Bold. No mixed font families (see §7 divergence #6 — the old Figma frame mixes Inter + "Telenor Evolution"; this build uses Inter only, per project convention).
- Icons/logos: labelled placeholder rects, fill `#333333`, sized per callout below. **One exception**: the catalogue empty-state icon is a literal emoji glyph in code (`🔍`), not a Lucide icon — see §6.

### 1.1 Resolved color tokens used on this flow (hex from `index.css` `@theme`)

| Token | Hex |
|---|---|
| `--color-dark` (`bg-dark`) | `#0A090B` |
| `--color-surface-dark` (`bg-surface-dark`) | `#1E2224` |
| `--color-surface-panel` (`bg-surface-panel`, sticky table col) | `#252a2d` |
| `--color-cyan` | `#00BBFF` |
| `--color-cyan-light` | `#73F5FD` |
| `--color-amber` | `#FF9900` |
| `--color-pink` | `#FF2E93` |
| `--color-campaign-accent` | `#FF8A00` |
| `--color-icon-subtle` | `#D2D6DB` |
| White/black at Tailwind `/NN` opacity | resolve per layer, don't flatten |

`--gradient-recommended` (linear 135°, `#1E2A6B`@0% → `#111A42`@40% → `#0A0F28`@75% → `#050813`@100%) and the campaign-badge live gradient (linear 0°, `#FF2E93`@0% → `#FF8A00`@100%, drop shadow `0 0 12px rgba(255,46,147,0.3)`) are defined in `FIGMA_PAYWALL_BUILD_SPEC.md` §1.2 — reuse verbatim, do not redefine.

Legacy tokens present in `@theme` but **not referenced by any file read for this spec** — do not use: `--color-badge-ink`, `--color-badge-notch`, `--color-campaign-notch`, `--color-bkash-red`. These look like an earlier card design's leftovers.

### 1.2 Text styles (reuse paywall spec's T-* IDs where they match; new ones used only here)

| ID | Size | Weight | Line height | Used for |
|---|---|---|---|---|
| T-h1-catalogue | 28px | Bold (700) | 120%, tight tracking | "Select Your Pack" |
| T-body-14-reg | 14px | Regular (400) | normal | Header subtitle, empty-state body |
| T-chip-14 | 14px | Bold (700) | normal | Filter chip labels |
| T-body-16-bold | 16px | Bold (700) | normal | Empty-state title |
| T-caption-13-bold-link | 13px | Bold (700) | normal | "Compare all packs" link |
| T-caption-11 | 11px | Regular (400) | 16px (`leading-[16px]`) | VAT/renewal footer microcopy |
| T-table-12 | 12px | Regular (400) | normal | Comparison table cells |
| T-table-10 | 10px | Regular (400) | tight | Unlocks/Pay With cell copy |

PackCard's own text styles are unchanged from the paywall spec's §5.1 (T-h3-18-ish title at 18px Bold/24px line-height, 14px Medium duration, 12px coverage, 28px Bold price, etc.) — not re-listed here.


═══════════════════════════════════════════════════════
2. FRAME LIST (8 frames total)
═══════════════════════════════════════════════════════

1. `Pack / 01 catalogue / default`
2. `Pack / 01 catalogue / filters-empty`
3. `Pack / 01 catalogue / campaign-segment`
4. `Pack / 01 catalogue / campaign-timer-live`
5. `Pack / 01 catalogue / campaign-window-upcoming`
6. `Pack / 01 catalogue / campaign-window-active`
7. `Pack / 01 catalogue / campaign-window-ended`
8. `Pack / 02 comparison / default`


═══════════════════════════════════════════════════════
3. PER-SCREEN LAYER SPECS
═══════════════════════════════════════════════════════

### 3.1 Frame 1 — `catalogue / default` (full layer tree; frames 2–7 are diffs against this)

Root: auto-layout **vertical**, width 360, height HUG, fill `#0A090B`, gap 0, no outer padding (sections carry their own).

- `Header` — auto-layout horizontal, gap 16px, padding `40px top / 24px bottom / 20px sides` (`px-5 pt-10 pb-6`), align center, shrink 0, fill inherits.
  - `[icon placeholder 28×28 "arrow-left"]` fill `#333333`.
  - `Title Group` — auto-layout vertical, gap 0:
    - `Title` — text VERBATIM `Select Your Pack`, T-h1-catalogue, color `#FFFFFF`.
    - `Subtitle` — text VERBATIM `Unlock premium entertainment`, T-body-14-reg, color `#FFFFFF` opacity 60%.
- `Filters` — auto-layout vertical, gap 16px, padding-bottom 16px (`pb-4`), bottom stroke `#FFFFFF` opacity 10% 1px, shrink 0, fill `#0A090B`.
  - `Validity Row` — auto-layout horizontal, gap 8px, padding-left/right 20px, margin-bottom 16px (scroll region — build as fixed row, note horizontal-scroll is a web affordance only).
    - 6× `Filter Chip`: height 40px, padding-x 20px, corner radius 999, text T-chip-14. Values in order: `All` (selected), `1 Day`, `7 Days`, `28 Days`, `90 Days`, `365 Days`.
      - Selected state: fill `#FFFFFF`, text color `#000000`.
      - Unselected state: fill `#1E2224` (surface-dark), text color `#FFFFFF`, stroke `#FFFFFF` opacity 10% 1px.
  - `Platform Row` — same chip anatomy, padding-left/right 20px, values in order: `All` (selected), `Bioscope+` (data value `bioscope`), `Hoichoi` (`hoichoi`), `Chorki` (`chorki`), `Combo`, `Data+OTT` — the last two are literal labels, not brand-mapped.
- `List` — auto-layout vertical, gap 24px (`gap-6`), padding `24px top / 20px sides / 48px bottom` (`px-5 pt-6 pb-12`).
  - `Most Popular Section` — auto-layout vertical, gap 12px (`mb-3` before card).
    - `Section Label` — auto-layout horizontal, gap 6px, align center: `[icon placeholder 16×16 "crown"]` fill `#333333`; text VERBATIM `Most Popular`, 14px Bold, uppercase, tracking wide, color `#FF9900` (amber).
    - `PackCard` instance — pack `standard` (recommended variant). See §4 for the full component spec; this is the paywall spec's PackCard §5.1 reused verbatim, no campaign badge.
  - `Filtered Packs` — auto-layout vertical, gap 16px (`gap-4`). 11 `PackCard` instances, in `packs.js` source order (recommended `standard` excluded): `day-pass`, `movie-night`, `bangla-weekly`, `duo-binge`, `super`, `data-ent`, `kids`, `sports-season`, `family-5gb` (**ineligible variant** — "Requirement not met" CTA), `annual-bangla`, `premium-annual`.
  - `Flexiplan Inert Card` — auto-layout vertical, padding 20px (`p-5`), corner radius 16px, fill `#1E2224`, stroke `#FFFFFF` opacity 10% 1px, margin-top 8px (`mt-2`).
    - `Eyebrow Row` — gap 8px, align center: `[icon placeholder 16×16 "crown"]` color `#00BBFF` (cyan); text VERBATIM `Flexiplan`, 14px Bold, color `#FFFFFF`.
    - `Title` — text VERBATIM `Make your custom plan in 2 simple steps`, 18px Bold, color `#FFFFFF`, margin-bottom 4px.
    - `Body` — text VERBATIM `Choose your preferred data, voice, and OTTs.`, 12px Regular, color `#FFFFFF` opacity 60%, margin-bottom 16px.
    - `Create Package Button` — height 44px, corner radius 8px, fill `#FFFFFF` opacity 5%, stroke `#00BBFF` opacity 20% 1px, opacity **80%** (whole button — this is a deliberately inert/decorative CTA in the prototype, `cursor-default`, no `onClick`; do not wire it to anything). Text VERBATIM `+ Create Package`, 14px Bold, color `#00BBFF`.
  - `Footer` — auto-layout vertical, align center, padding `24px top / 16px bottom` (`pt-6 pb-4`), text-align center.
    - `Compare Link` — text VERBATIM `Compare all packs`, T-caption-13-bold-link, color `#00BBFF`, margin-bottom 16px.
    - `Legal` — text VERBATIM `Prices are inclusive of 15% VAT.` + line break + `Auto-renewal can be managed anytime from My Subscriptions.`, T-caption-11, color `#FFFFFF` opacity 40%, centered.

---

### 3.2 Frame 2 — `catalogue / filters-empty` (diff only)

Same tree as 3.1. Filter chips: `Validity Row` selects `1 Day`; `Platform Row` selects `Chorki`. `Most Popular Section` (Standard card) **unchanged and still visible** — filters never touch it (see §0 note).

`Filtered Packs` section is replaced by:
- `Empty State` — auto-layout vertical, align center, justify center, padding `40px 0` (`py-10`), text-align center.
  - `Icon Disc` — 48×48 circle, fill `#FFFFFF` opacity 5%, centered content: the literal emoji `🔍` at 20px (not an icon placeholder — see §6), margin-bottom 16px.
  - `Title` — text VERBATIM `No packs match these filters`, T-body-16-bold, color `#FFFFFF`, margin-bottom 8px.
  - `Body` — text VERBATIM `Try selecting a different validity or platform.`, 13px Regular, color `#FFFFFF` opacity 50%, margin-bottom 24px.
  - `Clear Filters Button` — height 36px, padding-x 16px, corner radius 999, fill `#FFFFFF` opacity 10%, text VERBATIM `Clear Filters`, 13px Bold, color `#FFFFFF`.

Flexiplan card and footer below are unchanged from 3.1.

---

### 3.3–3.7 Frames 3–7 — campaign variants (diff only, against 3.1's PackCard component)

Each of these swaps exactly one `PackCard` instance in the `Filtered Packs` list (or the Most Popular card, for frame 3) for a campaign-active variant. Everything else in the tree — header, filters, other cards, Flexiplan card, footer — is unchanged from 3.1. See §4.2 for the full Campaign Badge component spec and the exact resolved copy/price per frame.

| Frame | Card affected | Position |
|---|---|---|
| 3 `campaign-segment` | `standard` (Most Popular section) | top |
| 4 `campaign-timer-live` | `duo-binge` | 4th card in Filtered Packs |
| 5 `campaign-window-upcoming` | `super` | 5th card |
| 6 `campaign-window-active` | `super` | 5th card |
| 7 `campaign-window-ended` | `super` | 5th card |

---

### 3.8 Frame 8 — `comparison / default`

Shared scrim+sheet shell identical to the Paywall spec §1 (full-bleed 360×780 scrim, `#000000` 60% opacity + 2px background blur; sheet bottom-anchored, width 360, rounded top corners 20px, stroke `#FFFFFF` opacity 5% 1px, fill `#0A090B`). Sheet height fixed **663px** (85%).

- `Header` — auto-layout horizontal, gap 12px, padding `20px top / 16px bottom / 16px sides` (`px-4 pt-5 pb-4`), align center, shrink 0, fill `#0A090B`.
  - `[icon placeholder 24×24 "arrow-left"]` fill `#333333`.
  - `Title` — text VERBATIM `Compare Packs`, 18px Bold, color `#FFFFFF`.
- `Body (scroll)` — auto-layout vertical, padding `0 16px 32px` (`px-4 pb-8`), fill container.
  - `Table Card` — corner radius 16px, fill `#1E2224` (surface-dark), stroke `#FFFFFF` opacity 10% 1px, overflow hidden. Contains a 12-column table (1 sticky label column + 11 pack columns — `family-5gb` excluded, `eligible: false`). Note for the Figma build: "sticky" is a web scroll affordance only; lay out the full table flat, first column visually distinguished by its own `#252a2d` fill, no functional pin needed.
    - `Header Row` — bottom stroke `#FFFFFF` opacity 10% 1px, fill `#FFFFFF` opacity 5%, all cells padding `12px` (`py-3 px-3`).
      - `Features` label cell, min-width 100px, fill `#252a2d` (surface-panel), text 12px Medium, color `#FFFFFF` opacity 60%.
      - 11× pack name cells, min-width 90px, text-align center, 12px Bold — color `#FF9900` (amber) for `standard` only, `#FFFFFF` for the other 10. Order matches `packs.js` (recommended not hoisted here — table uses plain filter/array order): `standard, day-pass, movie-night, bangla-weekly, duo-binge, super, data-ent, kids, sports-season, annual-bangla, premium-annual`.
    - 9× `Feature Row`, each with a 1px `#FFFFFF` opacity 5% divider between rows, all cells padding `12px`:
      1. `Price` — label cell text VERBATIM `Price`; value cells `{price} BDT` bold e.g. `99 BDT`.
      2. `Duration` — value cells = `pack.duration` VERBATIM e.g. `1 Week`.
      3. `Telco Value` — value cells = `pack.telcoValue` VERBATIM or `-` if null.
      4. `Bioscope+` — value cells: `[icon placeholder 16×16 "check"]` white if `providers.includes('bioscope')`, else `[icon placeholder 16×16 "x"]` white opacity 20%.
      5. `Hoichoi` — same check/x pattern against `'hoichoi'`.
      6. `Chorki` — same against `'chorki'`.
      7. `SonyLIV` — same against `'sonyliv'` (note: lowercase key in `packs.js` providers array, differs from the OTTLogoStrip brand map key `sonyLiv` — cosmetic-only, no visual impact since this column renders check/x, not the logo).
      8. `Unlocks` — value cells: `pack.unlocks.join(', ')`, T-table-10, color `#FFFFFF` opacity 70%, max-width 80px, centered, e.g. `ctn-all`.
      9. `Pay With` — value cells: `pack.payWith.join(', ')`, same T-table-10 style, e.g. `balance, bkash, nagad, card`.
  - `Caption` — text VERBATIM `Comparison is for illustrative purposes. Actual limits may vary based on publisher terms and device capability.`, 12px Regular, color `#FFFFFF` opacity 50%, centered, line-height 150%, margin-top 24px.


═══════════════════════════════════════════════════════
4. SHARED COMPONENTS
═══════════════════════════════════════════════════════

### 4.1 PackCard — reused verbatim from `FIGMA_PAYWALL_BUILD_SPEC.md` §5.1

Do not re-derive. Base layer tree, per-pack data table (all 12 packs), and `payWith` icon-row mapping are already fully specified there. This spec extends it with exactly one addition: the **Campaign Badge**, which that doc's §5.1 described structurally but explicitly left with "no concrete example instance to point to." That gap is now resolved below.

### 4.2 Campaign Badge (extension — resolves the paywall spec's flagged gap)

Source of truth: `PackCard.jsx` campaign-rendering block + the 5 real trigger payloads in `ControlPanel.jsx` (`setActiveCampaign` calls at lines ~102–117). These are actual demo-panel states shipped in the codebase, not spec-authored placeholders.

Sits in the `Badges Row` alongside (never together with) the static `pack.badge` chip — when a campaign targets a pack, its own static badge (e.g. `standard`'s "Recommended for All") is **suppressed entirely**, not shown alongside the campaign chip.

Container: auto-layout horizontal, gap 6px, padding `4px 10px` (`px-2.5 py-1`), corner radius 6px, align center.
- **Live style** (`campaignApplies` true — i.e. `segment`/`timer` types, or `window` type with `windowState==='active'`): fill = gradient linear 0°, `#FF2E93`@0% → `#FF8A00`@100%, drop shadow `0 0 12px rgba(255,46,147,0.3)`. Icon and label color `#FFFFFF`.
- **Inactive style** (`window` type with `windowState` = `upcoming` or `ended`): fill `#1E2224` (surface-dark), stroke `#FFFFFF` opacity 20% 1px. Icon and label color `#FFFFFF` opacity 50%.
- Icon (12×12, placeholder fill `#333333`, but note actual in-app icon swap): `Flame` for `type:'segment'`, `Timer` for `type:'timer'`, `Clock` for `type:'window'` (all states).
- Label, 11px Bold, tracking wide, leading-none:

| Variant | `activeCampaign` payload (verbatim from ControlPanel.jsx) | Rendered label |
|---|---|---|
| segment | `{packId:'standard', type:'segment', label:'GP Users save 20%', discount:20}` | `GP Users save 20%` |
| timer-live | `{packId:'duo-binge', type:'timer', label:'Flash Sale', discount:30, expiresAt:+10min}` | `Flash Sale • 09:58` (mm:ss countdown; any static value ≤10:00 is fine for the static frame) |
| window-upcoming | `{packId:'super', type:'window', windowState:'upcoming', label:'Midnight offer', discount:25, windowLabel:'12:00 AM – 2:00 AM'}` | `Starts 12:00 AM` |
| window-active | same, `windowState:'active'` | `Midnight offer • ends 2:00 AM` |
| window-ended | same, `windowState:'ended'` | `Midnight offer ended` |

**Ring + price side-effects — real code quirks, reproduce as-is, do not "fix":**
- Card ring becomes `#FF2E93` (pink) 2px whenever `activeCampaign` targets the card at all — including `upcoming`/`ended`, where the discount isn't even applying yet/anymore. (Base rule, unchanged: no campaign → `#FFFFFF` opacity 10% 1px.)
- Current price text color turns pink (`text-pink`) whenever a campaign targets the card, again regardless of `campaignApplies` — so an `upcoming` or `ended` card shows a pink price that is identical to its own strikethrough price (see next point), which reads as a rendering oddity but is exactly what the code does.
- **Struck price is overridden by the campaign, ignoring `pack.originalPrice`.** Normal rule: struck price = `pack.originalPrice` (or hidden if null). With any campaign active on the card, struck price becomes `pack.price` instead — even if `originalPrice` is defined. Worked examples:
  - `standard` (price 99, originalPrice 149) + segment campaign: struck shows `৳99` (not `৳149`), current shows `৳79` (99−20).
  - `duo-binge` (price 179, originalPrice 299) + timer campaign: struck shows `৳179` (not `৳299`), current shows `৳149` (179−30).
  - `super` (price 299, originalPrice null) + window-active: struck `৳299`, current `৳274` (299−25).
  - `super` + window-upcoming/ended (`campaignApplies` false): struck `৳299`, current **also** `৳299` — a strikethrough over an unchanged price, a visible artifact of the real logic, build it exactly like this.

### 4.3 PackComparisonSheet — no separate component list beyond the table structure in §3.8; it's a single-instance screen, not a reusable card set.


═══════════════════════════════════════════════════════
5. FIGMA API GOTCHAS (bake into build script)
═══════════════════════════════════════════════════════

- `counterAxisAlignItems` accepts **only** `MIN` / `MAX` / `CENTER` / `BASELINE` — never `END`. Anywhere this spec says "align flex-end" (e.g. §4.2 struck/current price baseline row), map it to `MAX`.
- `layoutPositioning = 'ABSOLUTE'` must be set **after** `appendChild`, never before — relevant for the comparison table's visually-distinguished first column and the empty-state icon disc's centered emoji glyph.


═══════════════════════════════════════════════════════
6. UNRESOLVED / NEEDS FOLLOW-UP
═══════════════════════════════════════════════════════

1. **Campaign data gap — resolved in this pass.** `packs.js` has zero campaign fields; the only real campaign payloads in the codebase live in `ControlPanel.jsx`'s demo-panel triggers. §4.2 uses those verbatim. If Anik wants additional campaign combos beyond the 5 the demo panel ships (e.g. a `segment` campaign on a non-recommended pack), those would need to be spec-authored — none exist in source today.
2. **Empty-state icon is a raw emoji** (`🔍`) in code, not a Lucide icon like everywhere else in this flow. Figma has no native emoji-as-vector; either import it as an image/text glyph (simplest, matches source exactly) or swap to an icon-placeholder rect per the house style — flagging the inconsistency rather than silently picking one.
3. Legacy `@theme` tokens `--color-badge-ink`, `--color-badge-notch`, `--color-campaign-notch`, `--color-bkash-red` are unused by every file read for this spec — likely leftovers from an earlier card design (possibly the very cruft documented in the old Figma "Badge/GP Users" component). Don't carry them into the new build.
4. Filter chip **hover** states (`hover:bg-white/10`) exist in code but are irrelevant to a static Figma build — omitted, note only.
5. "Combo" and "Data+OTT" platform filter categories are computed proxies (`providers.length > 1`, `kind === 'data+ott'`) rather than explicit pack fields — doesn't affect the visual spec, flagged for completeness only.


═══════════════════════════════════════════════════════
7. DIVERGENCE — prototype vs existing Figma "Choose Your Plan" (node 11781:112304)
═══════════════════════════════════════════════════════

The existing Figma frame and this prototype screen are not the same screen wearing different data — they're structurally different products. Key divergences, not silently resolved:

1. **Page chrome**: Figma frame has a full app header (logo, back arrow, hidden duplicate icon clusters) and a bottom tab navbar (Home/Shorts/New/Live TV/Account). Prototype's `PackCatalogueScreen` is a plain overlay screen — simple back-arrow + title header, no navbar at all.
2. **Feature callout row** (TV/web/mobile, 100+ channels, 4K/HD icons) exists only in the Figma frame. No equivalent in the prototype.
3. **Filters**: prototype adds two entire filter-chip rows (validity, platform) that don't exist in the Figma frame at all — the Figma version shows a flat, unfiltered 5-card list.
4. **Flexiplan card**: Figma's version sits at the **top** of the list (before the "or" divider and pack cards) with a working-looking "+ Create Package" button — but per that doc's own gap list, it also carries hidden cruft (dead Cancel button, stray "RECOMMENDED" pill, toggle, "Current Device" chip). Prototype's Flexiplan card sits at the **bottom** of the list, after all packs, and its CTA is deliberately inert (`opacity-80`, `cursor-default`, no handler) — a much simpler, intentionally non-functional placeholder. Build the prototype's placement and inert state; don't import the Figma cruft.
5. **Card count / scope**: Figma ships exactly 5 cards (1 recommended + 4 regular, with invented names like "GP Star Pack" and "Family Entertainment" not present anywhere in `packs.js`). Prototype has 12 real packs from `packs.js`. Use the prototype's real pack roster — the Figma frame's specific pack names/prices have no source-of-truth equivalent in this codebase.
6. **Per-card footer bar** ("Learn More →" + "Save ৳X" + a 3-dot indicator of undocumented meaning) exists on every Figma card. **The prototype's `PackCard.jsx` has none of this** — no Learn More link, no explicit "Save ৳X" callout, no dot indicator. Don't add it; the prototype's card ends at the CTA button.
7. **Badge treatment**: Figma's `Badge/GP Users` is a corner-overlay pill with (unused) per-brand logo-swap props. Prototype's badge is a plain full-width chip above the title, text-only, no logo slots — and is further extended here with the live/inactive Campaign Badge variant, which has no equivalent in the Figma file at all (its badge is static audience-copy only, never time-boxed or discount-driven).
8. **Pay-with icon row**: prototype cards show a payment-method icon strip (balance/bkash/nagad/card) at the bottom of each card. Not present on the Figma cards.
9. **Recommended-card treatment**: Figma ties a green-tinted gradient + green drop shadow to "State=Recommended" as a generic visual, independent of which pack/badge is shown. Prototype's recommended treatment is the exact 4-stop navy `--gradient-recommended` (see §1.1), no drop shadow, ring-only distinction (pink 2px if campaigned, else white/10 1px) — use the prototype's exact values, not the Figma frame's unspecified green ones.
10. **Comparison table screen** (this spec's frame 8) has **no equivalent anywhere in the Figma file** — it's a wholly new screen introduced by the prototype.
11. **Ineligible-pack state** (`family-5gb`, "Requirement not met") also has no equivalent in the Figma frame — every Figma card looks equally purchasable.
12. **Typography**: Figma frame mixes Inter and "Telenor Evolution" (flagged as likely unintentional in that doc). This build uses Inter exclusively, per project convention and per §1 above — resolving the divergence toward Inter, not reproducing the mix.
