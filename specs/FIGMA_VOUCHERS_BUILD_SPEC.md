Bioscope+ Vouchers / Subscriptions (M3) — Figma Build Spec

Source: src/screens/VoucherStorefrontScreen.jsx, src/components/VoucherPurchaseSheet.jsx, src/components/OwnedVoucherDetailSheet.jsx, src/components/MySubscriptionsSheet.jsx, src/components/OTTLogoStrip.jsx, src/components/PaymentMethodList.jsx, src/data/vouchers.js, src/data/plans.js, src/data/paymentMethods.js, src/data/packs.js, src/index.css, src/contexts/AppContext.jsx, src/components/ControlPanel.jsx.

Format and rigour match `specs/FIGMA_PAYWALL_BUILD_SPEC.md`. The scrim+sheet shell and `PaymentMethodList` are reused **verbatim** from that doc's §1 and §5.2 — not re-derived here. No PackCard/campaign-badge reuse needed on this flow (no pack-catalogue chrome appears inside any voucher/subscription screen except a plain provider-logo strip, see §4.2).


═══════════════════════════════════════════════════════
0. SCREEN / STATE LIST — ordered, exact code keys or prop combos
═══════════════════════════════════════════════════════

Four independent components, no shared state machine. Listed in the order a user would hit them end to end.

**A. VoucherStorefrontScreen** — full-page screen (`SCREENS.VOUCHER_STORE`). One piece of state, `selectedBrand` (`useState(null)`):
1. `selectedBrand === null` — categorised storefront (brand tiles grouped by `category`).
2. `selectedBrand === 'Netflix'` — per-brand product list (exemplar brand; any of the 7 works identically).

**B. VoucherPurchaseSheet** — bottom sheet, `stage` state (`useState('detail')`), reset to `'detail'` whenever `voucherId` changes:
3. `detail` — Purchase Digital Code (code comment `V3`).
4. `disclosure` — Important Terms (`V4`).
5. `checkout` — Select Payment (`V5`).
6. `processing` — Generating Code… (no comment tag, between V5 and V6).
7. `success` — Here is your code! (`V6`).

Exemplar voucher throughout §3.2: `netflix-mobile-1m` (matches `walkthrough/SHOT_LIST.md` shots 22–23).

**C. OwnedVoucherDetailSheet** — bottom sheet, `stage` state (`useState('detail')`), plus the owned instance's own `state` field drives 3 mutually exclusive content variants inside the `detail` stage:
8. `stage='detail'`, `voucherInstance.state='unredeemed'` (`V8`).
9. `stage='detail'`, `voucherInstance.state='redeemed'` (`V9`).
10. `stage='detail'`, `voucherInstance.state='expired'` (`V10`).
11. `stage='handoff'` (`V11`) — reachable only from the `unredeemed` variant's "Redeem Now" button.

**Confirmed: exactly 3 owned states**, exact code keys `'unredeemed' | 'redeemed' | 'expired'` (read directly off `OwnedVoucherDetailSheet.jsx` lines 20–22 and the 3 `demoLocker` records in `vouchers.js`). Matches the docs/SHOT_LIST claim of "3 owned states" — confirmed, not just assumed.

**D. MySubscriptionsSheet** — bottom sheet, no internal state; entirely driven by the two AppContext values `subscription` (`null` by default) and `ownedVouchers` (`demoLocker` by default), plus a local `autoRenew` toggle on the subscription object once one exists. Reachable combos, per the only real triggers that exist in `ControlPanel.jsx`:
12. `subscription={packId:'duo-binge', expiresLabel:'Expires 20 Sep'}`, `ownedVouchers=demoLocker` (3 items), `autoRenew=false` — trigger "What I am subscribed to". This is the richest default demo state (both an active pack card and a full 3-row locker render together — the ControlPanel button only touches `subscription`, so `ownedVouchers` stays at its app-boot default).
13. Same as 12 but `autoRenew=true` — reachable only by tapping the toggle after landing on state 12 (SHOT_LIST shot 25 explicitly demos this, so it's demo-relevant despite being a manual toggle, not a ControlPanel button).
14. `subscription=null`, `ownedVouchers=demoLocker` — trigger "My vouchers" (only sets `ownedVouchers`; `subscription` is whatever it was, `null` on a fresh app boot). Shows the "No Active Subscriptions" empty block **above** the full 3-row locker.
15. `subscription=null`, `ownedVouchers=[]` — trigger "No vouchers yet". Both sections show their empty states.

`subscription=<pack> + ownedVouchers=[]` is reachable in the UI (chain two ControlPanel triggers manually) but has no single canonical demo trigger — not built as its own frame, noted only.


═══════════════════════════════════════════════════════
1. GLOBAL CONSTANTS
═══════════════════════════════════════════════════════

- Font: **Inter** everywhere. Weight → Figma style: 400 Regular, 500 Medium, 600 "Semi Bold", 700 Bold. One exception: the generated/owned voucher code strings use **monospace** (`font-mono`), not Inter — flag per-layer.
- Frame A (VoucherStorefrontScreen): **360 wide, sizingV = HUG** — full-page screen, same convention as `FIGMA_PACK_PAGE_BUILD_SPEC.md`'s catalogue frame (a scrolling page, not a fixed-height sheet). Background fill `#0A090B` (`--color-dark`).
- Frames B, C, D: canvas **360×780 fixed** (device viewport), scrim + bottom-sheet shell reused verbatim from `FIGMA_PAYWALL_BUILD_SPEC.md` §1 — full-bleed 360×780 scrim rectangle, fill `#000000` opacity 60%, background blur 2px; sheet bottom-anchored, width 360, rounded top corners 20px, stroke `#FFFFFF` opacity 5% 1px, fill `#0A090B`.
  - VoucherPurchaseSheet sheet height: **90%** of 780 = **702px** (`h-[90%]`) — a third height value not used in the paywall spec (which only used 85%/95%). Note it explicitly.
  - OwnedVoucherDetailSheet sheet height: **85%** = 663px (`h-[85%]`).
  - MySubscriptionsSheet sheet height: **70%** = 546px (`h-[70%]`).

### 1.1 Resolved color token table (hex from `index.css` `@theme`)

| Token / class | Hex |
|---|---|
| `--color-dark` (`bg-dark`) | `#0A090B` |
| `--color-surface-dark` (`bg-surface-dark`) | `#1E2224` |
| `--color-surface-alt` (`bg-surface-alt`, sticky footers) | `#212628` |
| `--color-cyan` | `#00BBFF` |
| `--color-amber` | `#FF9900` |
| `--color-error-surface` (`bg-error-surface`, expired-voucher card) | `#2A1A1A` |
| Tailwind default `red-500` (`text-red-500`, "Expired" label + ShieldAlert icon) | `#EF4444` |
| White/black at Tailwind `/NN` opacity | resolve per layer, don't flatten |

No gradients appear anywhere in this flow — every accent fill (cyan/20, amber/20, white/10, red-500/20 discs) is a flat single-color opacity fill, not a gradient. `--gradient-recommended` / `--gradient-subscribe` from the paywall spec are **not used** here.

### 1.2 Text styles (new IDs used only in this doc; reuse paywall spec's T-* IDs where sizes match exactly)

| ID | Size | Weight | Line height | Used for |
|---|---|---|---|---|
| T-v-h1-24 | 24px | Bold (700) | normal | Purchase-detail product title |
| T-v-h2-20 | 20px | Bold (700) | normal | "Here is your code!", owned-detail title, plan title (amber) |
| T-v-h3-18 | 18px | Bold (700) | normal | Sheet header titles, brand-list header, product name rows |
| T-v-body-16 | 16px | Bold (700) | normal | Sheet header labels ("Purchase Digital Code" etc.) |
| T-v-body-15 | 15px | Bold (700) | normal | Primary CTA labels |
| T-v-body-14-bold | 14px | Bold (700) | normal | Row labels, brand names |
| T-v-body-14-reg | 14px | Regular (400) | normal | Body copy, subtitle |
| T-v-caption-13 | 13px | Regular (400) | normal / 150% where noted | Secondary copy, price/status lines |
| T-v-caption-13-bold | 13px | Bold (700) | normal | Amounts, "Redeemed"/"Expired" status |
| T-v-caption-12 | 12px | Regular (400) | normal / 150% | Fine print, category header eyebrow |
| T-v-caption-12-bold | 12px | Bold (700) | uppercase, tracking wide | Eyebrow labels ("Code Validity", "Digital Code") |
| T-v-caption-11 | 11px | Regular (400) | normal | Micro fine print |
| T-v-mono-18 | 18px | Bold (700), **monospace** | tracking widest | Owned-code display (compact box) |
| T-v-mono-28 | 28px | Bold (700), **monospace** | tracking widest, `break-all` | Purchase-success code reveal (large box) |


═══════════════════════════════════════════════════════
2. FRAME LIST (15 frames total)
═══════════════════════════════════════════════════════

1. `Voucher / 01 storefront / categorized`
2. `Voucher / 02 brand-list / netflix`
3. `Voucher / 03 purchase-detail / netflix-mobile-1m`
4. `Voucher / 04 purchase-disclosure / netflix-mobile-1m`
5. `Voucher / 05 purchase-checkout / netflix-mobile-1m`
6. `Voucher / 06 purchase-processing / default`
7. `Voucher / 07 purchase-success / netflix-mobile-1m`
8. `Voucher / 08 owned-detail / unredeemed`
9. `Voucher / 09 owned-detail / redeemed`
10. `Voucher / 10 owned-detail / expired`
11. `Voucher / 11 owned-handoff / default`
12. `Voucher / 12 my-subscriptions / active-full`
13. `Voucher / 13 my-subscriptions / active-full-autorenew-on`
14. `Voucher / 14 my-subscriptions / no-subscription-vouchers-full`
15. `Voucher / 15 my-subscriptions / empty-both`


═══════════════════════════════════════════════════════
3. PER-SCREEN LAYER SPECS
═══════════════════════════════════════════════════════

### 3.0 Reusable atom: "Brand Text Tile" — used in frames 3–15 wherever a voucher/brand appears outside the storefront

**Important real-code divergence, not a spec simplification**: only the storefront screen (frames 1–2) renders the actual brand **logo image** (`voucher.logo`, from `VOUCHER_LOGOS`). Every downstream screen — purchase detail, purchase checkout header, purchase success, owned-detail, handoff, and the My Subscriptions voucher rows — **ignores the logo entirely** and renders a plain white rounded square with the brand's full name as bold black text. Build these as **text layers inside a white tile**, not as logo-image placeholders, matching source exactly:
- Purchase-detail (frame 3): 80×80, corner radius 16px, fill `#FFFFFF`, drop shadow (Figma default "lg"), centered text = `voucher.brand` (e.g. `Netflix`), 16px Bold, color `#000000`.
- Owned-detail (frames 8–10): 64×64, corner radius 12px, fill `#FFFFFF`, drop shadow "lg", centered text 13px Bold, color `#000000`.
- Handoff (frame 11): 48×48, corner radius 999 (circle), fill `#FFFFFF`, centered text 10px Bold, color `#000000`.
- My Subscriptions voucher row (frames 12–14): 40×40, corner radius 8px, fill `#FFFFFF`, centered text 10px Bold, color `#000000`.
- Purchase-checkout header (frame 5): no tile at all — just the plain text `voucher.brand`, 14px Bold, color `#FFFFFF`.

**Flag**: at 80×80/16px text, a long brand name like `YouTube Premium` will wrap or overflow — reproduce as-is (the code does no truncation or font-scaling), don't silently shrink it.

---

### 3.1 Frame 1 — `storefront / categorized`

Root: auto-layout vertical, width 360, height HUG, fill `#0A090B`.
- `Header` — auto-layout horizontal, gap 12px, padding `40px top / 16px bottom / 16px sides` (`px-4 pt-10 pb-4`), align center, bottom stroke `#FFFFFF` opacity 10% 1px, shrink 0.
  - `[icon placeholder 24×24 "arrow-left"]` fill `#333333`.
  - `Title Group` — auto-layout vertical, gap 0:
    - `Title` — text VERBATIM `Digital Vouchers`, T-v-h3-18, color `#FFFFFF`, leading tight.
    - `Subtitle` — text VERBATIM `Buy codes for your favourite apps`, T-v-caption-13, color `#FFFFFF` opacity 60%.
- `Body (scroll)` — auto-layout vertical, gap 32px (`mb-8` per section), padding `24px top / 16px sides / 48px bottom` (`px-4 pt-6 pb-12`).
  - 3× `Category Section`, auto-layout vertical, gap 16px:
    - `Category Header` — auto-layout horizontal, gap 8px, align center, margin-bottom 16px: `[icon placeholder 16×16]` color `#FFFFFF` opacity 70% (`Tv` for Streaming, `Headphones` for Music, `Gamepad2` for Games); `Label` text = category name VERBATIM uppercase, tracking wide, 16px Bold, color `#FFFFFF`.
    - `Brand Grid` — CSS grid 2 columns, gap 12px. Each cell = `Brand Tile`: aspect-square, auto-layout vertical, align/justify center, padding 16px (`p-4`), corner radius 12px, fill `#1E2224` (surface-dark), stroke `#FFFFFF` opacity 10% 1px.
      - `[icon/image placeholder 60×60 "<brand>-logo"]` fill `#333333`, margin-bottom 12px.
      - `Price Label` — text `From ৳{minPrice}` VERBATIM per brand, 12px Medium, color `#FFFFFF` opacity 50%.

**Category → brand grouping and per-brand min price** (derived from `vouchers.js`, grouped by `category`, brand's cheapest SKU):

| Category | Brands (min price) |
|---|---|
| Streaming | Netflix (৳250), Prime Video (৳150), YouTube Premium (৳180) |
| Music | Spotify (৳350) |
| Games | OneGames (৳199) |

Grid order within a category follows first-appearance order in `vouchers.js`: Streaming → Netflix, Prime Video, YouTube Premium (3 items, 2-col grid = row1 Netflix+Prime, row2 YouTube Premium alone). Category section order (object key insertion order) = Streaming, Games, Music — **not** alphabetical: Netflix is item 1 (Streaming), Prime is item 3 (Streaming), OneGames is item 5 (**Games**, inserted before Music), YouTube is item 6 (Streaming, already-open Streaming bucket), Spotify is item 7 (Music). Because `reduce` inserts a category key on first encounter, **section render order is: Streaming, Games, Music** (Games' first entry, OneGames, appears at array index 4, before Spotify's Music at index 6). Build accordingly — don't assume the doc-listed order above is also the render order.

---

### 3.2 Frame 2 — `brand-list / netflix` (diff against frame 1's shell)

Header changes to the in-page back state:
- `Sub-header` — auto-layout horizontal, gap 12px, align center, padding-bottom 16px (`mb-6 pb-4`), bottom stroke `#FFFFFF` opacity 10% 1px.
  - `Back Button` — 32×32 circle (hug), fill `#FFFFFF` opacity 10%, corner radius 999, centered `[icon placeholder 18×18 "arrow-left"]` fill `#333333`.
  - `Title` — text VERBATIM `Netflix Vouchers`, T-v-h3-18, color `#FFFFFF`.
- `Product Grid` — 2-column grid, gap 12px, padding `24px top / 16px sides / 48px bottom` (inherits body padding from frame 1's shell).
  - `Product Card` × 2 (Netflix's 2 SKUs), auto-layout vertical, align items flex-start, padding 12px (`p-3`), corner radius 12px, fill `#1E2224`, stroke `#FFFFFF` opacity 10% 1px.
    - `[image placeholder 24h×auto "netflix-logo"]` fill `#333333`, margin-bottom 8px.
    - `Product Label` — text = `voucher.product` VERBATIM, 11px Regular, color `#FFFFFF` opacity 60%, fixed height 28px (2-line clamp), margin-bottom 12px.
    - `Price` — text `৳{price}` VERBATIM, 15px Bold, color `#00BBFF` (cyan).

**Netflix SKUs** (source order): `Mobile plan · 1 month` — ৳250; `Basic · 3 months` — ৳1400.

---

### 3.3 Frame 3 — `purchase-detail / netflix-mobile-1m`

Sheet fixed height 702px (90%), auto-layout vertical: header (shrink 0) / scroll body (fill) / sticky footer (shrink 0).
- `Header` — auto-layout horizontal, justify space-between, align center, padding `20px top / 16px bottom / 16px sides` (`px-4 pt-5 pb-4`), bottom stroke `#FFFFFF` opacity 10% 1px.
  - `[icon placeholder 24×24 "x-close"]` fill `#333333`.
  - `Title` — text VERBATIM `Purchase Digital Code`, T-v-body-16, color `#FFFFFF`.
  - `Spacer` — 32×32 empty box.
- `Body (scroll)` — auto-layout vertical, align center, text-align center, padding `24px top / 16px sides / 24px bottom` (`px-4 pt-6 pb-6`).
  - `Brand Text Tile` (see §3.0), margin-bottom 16px, centered.
  - `Product Title` — text = `voucher.product` VERBATIM: `Mobile plan · 1 month`, T-v-h1-24, color `#FFFFFF`, margin-bottom 4px.
  - `Blurb` — text `Grants access to {brand} for {grants}` VERBATIM: `Grants access to Netflix for 1 month`, T-v-body-14-reg, color `#FFFFFF` opacity 60%, margin-bottom 32px.
  - `Info Card` — auto-layout vertical, gap 16px, padding 16px, corner radius 12px, fill `#1E2224`, stroke `#FFFFFF` opacity 10% 1px, text-align left, margin-bottom 24px.
    - `Section 1`: `Eyebrow` VERBATIM `Code Validity`, T-v-caption-12-bold, color `#FFFFFF` opacity 50%, margin-bottom 4px; `Body` rich text 14px Regular color `#FFFFFF`: `Must be redeemed within ` + bold amber span `90 days` + ` of purchase.`
    - `Divider` — 1px rule, fill `#FFFFFF` opacity 5%.
    - `Section 2`: `Eyebrow` VERBATIM `Redemption`, same style; `Body` text VERBATIM `Redeemable only on the Netflix app or website.`, 14px Regular, color `#FFFFFF`.
- `Footer` — fill `#212628` (surface-alt), padding 16px, auto-layout horizontal, justify space-between, align center.
  - `Price Group` — auto-layout vertical: `Label` VERBATIM `Price`, T-v-caption-13, color `#FFFFFF` opacity 60%, margin-bottom 2px; `Value` `৳{price}` = `৳250`, T-v-h2-20 equivalent at 22px Bold tabular nums, color `#FFFFFF` (exact code size 22px, not 20 — use a one-off 22px Bold style here).
  - `Buy Now Button` — height 48px, padding-x 24px, corner radius 12px, fill `#FFFFFF`, auto-layout horizontal, gap 8px, justify/align center: `Label` VERBATIM `Buy Now`, T-v-body-15, color `#000000`; `[icon placeholder 18×18 "arrow-right"]` fill `#333333`.

---

### 3.4 Frame 4 — `purchase-disclosure / netflix-mobile-1m`

Same sheet shell, same header pattern but back-arrow (not X):
- `Header` — bottom stroke `#FFFFFF` opacity 10% 1px, padding `20px top/16px bottom/16px sides`, gap 12px: `[icon placeholder 24×24 "arrow-left"]`; `Title` VERBATIM `Important Terms`, T-v-body-16, color `#FFFFFF`.
- `Body (scroll)` — padding `24px top/16px sides/24px bottom`, align left.
  - `Icon Disc` — 48×48 circle, fill `#FF9900` opacity 20% (`bg-amber/20`), centered `[icon placeholder 24×24 "alert-circle"]` color `#FF9900`, margin-bottom 24px.
  - `Heading` — text VERBATIM `Before you purchase`, T-v-h3-18 at 20px (one-off 20px Bold), color `#FFFFFF`, margin-bottom 24px.
  - `Bullet List` — auto-layout vertical, gap 16px, margin-bottom 32px. 3× `Bullet Row` — auto-layout horizontal, gap 12px, align flex-start: `[icon placeholder 20×20 "check"]` color `#00BBFF` (cyan); `Text` 14px Regular, line-height 150%, color `#FFFFFF` opacity 80%, VERBATIM per row:
    1. `This is a digital code. It will be revealed immediately after payment.`
    2. Rich text: `It is ` + bold white span `non-refundable` + ` once the code is revealed, even if you do not use it.`
    3. `You must redeem it on the partner's service within 90 days.` (codeValidDays interpolated)
  - `Ack Card` — auto-layout horizontal, gap 12px, align flex-start, padding 16px, corner radius 12px, fill `#1E2224`, stroke `#FFFFFF` opacity 10% 1px.
    - `Checkbox` — 20×20, corner radius 4px, border 1px. Default/unchecked: border `#FFFFFF` opacity 30%, no fill, no icon. (Checked state exists but isn't a required separate frame — annotate as an interaction state: fill/border `#00BBFF`, centered `[icon placeholder 14×14 "check"]` color `#000000`.)
    - `Label` — text VERBATIM `I understand and accept these terms, and acknowledge this purchase cannot be refunded.`, 13px Regular, line-height 150%, color `#FFFFFF`, text-align left.
- `Footer` — fill `#212628`, padding 16px.
  - `Continue Button` — height 48px, width fill, corner radius 12px, fill `#FFFFFF`, opacity **30%** (disabled — `agreed` is false by default whenever this stage is entered), auto-layout horizontal gap 8px, justify/align center: `Label` VERBATIM `Agree and Continue`, T-v-body-15, color `#000000`; `[icon placeholder 18×18 "arrow-right"]`.

---

### 3.5 Frame 5 — `purchase-checkout / netflix-mobile-1m`

Sheet content switches to **white background** for this stage only (header strip stays dark).
- `Header Strip` — fill `#0A090B`, padding `20px top/16px bottom/16px sides`, gap 12px, shrink 0: `[icon placeholder 24×24 "arrow-left"]` fill `#333333`; `Title` VERBATIM `Select Payment`, T-v-body-16, color `#FFFFFF`.
- `Order Summary Strip` — fill `#1E2224`, padding 16px, bottom stroke `#FFFFFF` opacity 10% 1px, auto-layout horizontal, justify space-between, align center, shrink 0.
  - `Text Group` — auto-layout vertical: `Brand` text VERBATIM `Netflix`, 14px Bold, color `#FFFFFF`; `Product` text VERBATIM `Mobile plan · 1 month`, 12px Regular, color `#FFFFFF` opacity 60%.
  - `Price` — text `৳250`, 18px Bold, tabular nums, color `#FFFFFF`.
- `Body (scroll)` — fill `#FFFFFF`, padding `20px top/16px sides/24px bottom`.
  - `PaymentMethodList` component instance, **theme = light (default)**, `allowedMethods = ['bkash','nagad','card']`. **Flag**: `vouchers.js` has no `payWith` field on any of the 7 SKUs, so every voucher purchase falls back to this same hardcoded 3-method list (`bkash, nagad, card`) — `balance`, `rocket`, `upay` never appear here regardless of brand. Default selected = `payWith[0]` from the sheet's own fallback logic = `bkash`. Reuse the paywall spec's §5.2 row anatomy verbatim (light theme): bKash highlighted row + divider + Nagad + Other Cards & MFS rows below.
- `Footer` — fill `#FFFFFF`, top stroke `#000000` opacity 5% 1px, padding 16px.
  - `Pay Button` — height 48px, width fill, corner radius 12px, fill `#FFFFFF`, stroke `#000000` opacity 20% 1px, auto-layout horizontal gap 8px, justify/align center: `Label` `Pay ৳250` VERBATIM, T-v-body-15, color `#000000`; `[icon placeholder 18×18 "arrow-right"]`.

---

### 3.6 Frame 6 — `purchase-processing / default`

Dark sheet, body auto-layout vertical, align/justify center, fill container.
- `Spinner` — 48×48 circle, stroke 3px, base ring `#00BBFF` opacity 20%, one quarter-arc solid `#00BBFF` (static representation of the CSS spin), margin-bottom 24px.
- `Label` — text VERBATIM `Generating Code...`, T-v-body-16, color `#FFFFFF`.

Brand-agnostic — no per-voucher variant needed (identical across all 7 vouchers).

---

### 3.7 Frame 7 — `purchase-success / netflix-mobile-1m`

- `Header` — auto-layout horizontal, justify space-between, align center, padding `20px top/16px bottom/16px sides`, shrink 0.
  - `Spacer` 24×24.
  - `Title` — text VERBATIM `Payment Successful`, T-v-body-16, color `#FFFFFF`.
  - `[icon placeholder 24×24 "x-close"]` fill `#333333`.
- `Body (scroll)` — align center, text-align center, padding `24px top/16px sides/24px bottom`.
  - `Icon Circle` — 64×64, fill `#00BBFF` opacity 20% (`bg-cyan/20`), centered `[icon placeholder 32×32 "check"]` color `#00BBFF`, stroke-width 3, margin-bottom 24px.
  - `Heading` — text VERBATIM `Here is your code!`, T-v-h2-20, color `#FFFFFF`, margin-bottom 8px.
  - `Body` — max-width 280px, centered, text VERBATIM `Your purchase is complete. You must redeem this code within 90 days.`, T-v-body-14-reg, color `#FFFFFF` opacity 60%, margin-bottom 32px.
  - `Code Card` — padding 24px, corner radius 12px, fill `#FFFFFF` opacity 5%, stroke `#FFFFFF` opacity 20% 1px, margin-bottom 32px, auto-layout vertical, align center.
    - `Eyebrow` — text VERBATIM `Digital Code`, T-v-caption-12-bold, color `#FFFFFF` opacity 40%, margin-bottom 12px.
    - `Code` — text, T-v-mono-28, color `#FFFFFF`. **Placeholder value** (code is `Math.random()`-generated at runtime, not deterministic): `NETF-K3P9-VCHR` — format is `{first 4 letters of brand, uppercase}-{4 random base36 chars, uppercase}-VCHR`. Use this exact placeholder; note it's illustrative, not a fixed value to reproduce pixel-for-pixel across rebuilds.
    - `Copy Button` — margin-top 24px, height 36px, padding-x 24px, corner radius 999, fill `#FFFFFF` opacity 10%, auto-layout horizontal gap 8px, align center: `[icon placeholder 14×14 "copy"]`; `Label` VERBATIM `Copy Code`, 13px Bold, color `#FFFFFF`.
- `Footer` — fill `#212628`, padding 16px, auto-layout vertical, gap 12px.
  - `Redeem Now Button` — height 48px, width fill, corner radius 12px, fill `#FFFFFF`, auto-layout horizontal gap 8px, justify/align center: `[icon placeholder 18×18 "external-link"]`; `Label` VERBATIM `Redeem Now`, T-v-body-15, color `#000000`.
  - `Save Later Link` — height 48px, width fill, fill transparent, centered text VERBATIM `I'll do it later (Save to Locker)`, 14px Bold, color `#FFFFFF`.

---

### 3.8 Frames 8–10 — `owned-detail / unredeemed | redeemed | expired`

Shared shell: sheet fixed 663px (85%), header identical across all 3: auto-layout horizontal, gap 12px, padding `20px top/16px bottom/16px sides`, bottom stroke `#FFFFFF` opacity 10% 1px: `[icon placeholder 24×24 "arrow-left"]`; `Title` VERBATIM `Voucher Details`, T-v-body-16, color `#FFFFFF`.

Shared `Header Info` row (identical across all 3, sits above the state-specific card): auto-layout horizontal, gap 16px, align center, margin-bottom 32px.
- `Brand Text Tile` 64×64 (see §3.0).
- `Text Group`: `Product` = `product.product` VERBATIM, T-v-h3-18, color `#FFFFFF`, margin-bottom 4px; `Purchased` text `Bought {date}` — locale date string from `purchasedAt`, T-v-caption-13, color `#FFFFFF` opacity 60%.

**Frame 8 — `unredeemed`** (exemplar: `own-1`, product `prime-1m`):
- `Header Info`: Brand Text Tile text `Prime Video`; Product `1 month`; Purchased `Bought 8/16/2026`.
- `State Card` — padding 20px, corner radius 12px, fill `#1E2224`, stroke `#00BBFF` opacity 30% 1px, text-align center, margin-bottom 24px.
  - `Eyebrow` VERBATIM `Code Valid For`, T-v-caption-12-bold, color `#00BBFF`, margin-bottom 4px.
  - `Countdown Row` — auto-layout horizontal, gap 8px, justify center, align center, margin-bottom 16px: `[icon placeholder 18×18 "timer"]` color `#FFFFFF`; `Value` text `{days} days`, T-v-h2-20, color `#FFFFFF`. **Real code bug**: `calculateDaysLeft` subtracts `Date.now()` (a number) from `codeExpiresAt`, which in `demoLocker` is a **date string** (`'2026-10-15'`), not a timestamp — string-minus-number coerces to `NaN`, so the live prototype actually renders `NaN days`. For the static Figma frame, use the correct value computed from the real dates (`purchasedAt` 2026-08-16 → `codeExpiresAt` 2026-10-15, ~43 days remaining as of the current spec date) rather than reproducing the NaN artifact — this is a data-shape bug worth fixing in code, not a visual to preserve. Flagged again in §6.
  - `Code Row` — auto-layout horizontal, justify space-between, align center, padding `12px 16px`, corner radius 8px, fill `#000000` opacity 20%, stroke `#FFFFFF` opacity 10% 1px, margin-bottom 16px: `Code` text VERBATIM `PRIME-X8Y2-9A4B`, T-v-mono-18, color `#FFFFFF`; `[icon placeholder 20×20 "copy"]` color `#00BBFF`.
  - `Footnote` — text `Grants {grants} once redeemed.` VERBATIM: `Grants 1 month once redeemed.`, T-v-caption-12, color `#FFFFFF` opacity 60%.
- `Redeem Button` — height 48px, width fill, corner radius 12px, fill `#00BBFF`, drop shadow `0 10px 15px rgba(0,187,255,0.2)`-equivalent (Tailwind `shadow-lg shadow-cyan/20`), auto-layout horizontal gap 8px, justify/align center: `[icon placeholder 18×18 "external-link"]` color `#000000`; `Label` VERBATIM `Redeem Now`, T-v-body-15, color `#000000`.

**Frame 9 — `redeemed`** (exemplar: `own-2`, product `netflix-mobile-1m`):
- `Header Info`: Brand Text Tile text `Netflix`; Product `Mobile plan · 1 month`; Purchased `Bought 8/16/2026`.
- `State Card` — padding 20px, corner radius 12px, fill `#1E2224`, stroke `#FFFFFF` opacity 10% 1px, text-align center, margin-bottom 24px.
  - `Icon Disc` — 48×48 circle, fill `#FFFFFF` opacity 10%, centered `[icon placeholder 24×24 "check"]` color `#FFFFFF`, margin-bottom 16px. **Real code bug**: this block renders a bare `<Check>` JSX element that is **never imported** in `OwnedVoucherDetailSheet.jsx` (only `ArrowLeft, Copy, ExternalLink, ShieldAlert, Timer, X` are imported) — tapping into this state throws a runtime `ReferenceError` in the live prototype today (confirmed in `walkthrough/SHOT_LIST.md` line 11: "Opening the redeemed voucher's detail sheet... throws a runtime error"). Build the Figma frame with the intended checkmark icon; flag the missing import as a code fix needed before this screen is safe to demo live. See §6.
  - `Title` — text VERBATIM `Redeemed Successfully`, T-v-body-14-bold, color `#FFFFFF`, margin-bottom 8px.
  - `Body` — text `You redeemed this code on {date}.` VERBATIM: `You redeemed this code on 8/18/2026.`, T-v-caption-13, color `#FFFFFF` opacity 60%, margin-bottom 24px.
  - `Package Validity Box` — padding 16px, corner radius 8px, fill `#000000` opacity 20%, text-align left, margin-bottom 24px.
    - `Eyebrow` VERBATIM `Package Validity`, T-v-caption-12-bold, color `#FFFFFF` opacity 40%, margin-bottom 4px.
    - `Days Remaining` — text `{days} days remaining`, 16px Bold, color `#00BBFF`, margin-bottom 4px. Computed from `packageExpiresAt` 2026-09-18 (~16 days from the reference date used above) — subject to the same string-arithmetic bug noted in frame 8, corrected here likewise.
    - `Ends Date` — text `Ends {date}` VERBATIM: `Ends 9/18/2026`, T-v-caption-13, color `#FFFFFF` opacity 60%.
  - `Divider` — top stroke `#FFFFFF` opacity 10% 1px, padding-top 16px, text-align left.
    - `Eyebrow` VERBATIM `Spent Code`, 11px Regular, color `#FFFFFF` opacity 40%, margin-bottom 4px.
    - `Code` — text VERBATIM `NFLX-M1-AB12`, T-v-mono-18 at 14px (one-off, mono, tracking wide), color `#FFFFFF` opacity 30%, **strikethrough**.

No CTA button in this state (info-only, matches source — no button renders after the redeemed card).

**Frame 10 — `expired`** (exemplar: `own-3`, product `onegames-1m`):
- `Header Info`: Brand Text Tile text `OneGames`; Product `1 month`; Purchased `Bought 12/1/2025`.
- `State Card` — padding 20px, corner radius 12px, fill `#2A1A1A` (`bg-error-surface`), stroke `#EF4444` opacity 30% 1px (`ring-red-500/30`), text-align center, margin-bottom 24px.
  - `Icon Disc` — 48×48 circle, fill `#EF4444` opacity 20% (`bg-red-500/20`), centered `[icon placeholder 24×24 "shield-alert"]` color `#EF4444`, margin-bottom 16px.
  - `Title` — text VERBATIM `Voucher Expired`, T-v-h3-18 at 16px (one-off 16px Bold), color `#FFFFFF`, margin-bottom 8px.
  - `Body` — text `This digital code was not redeemed within its {codeValidDays}-day validity window. It has expired and can no longer be used or refunded.` VERBATIM (30-day for OneGames): `This digital code was not redeemed within its 30-day validity window. It has expired and can no longer be used or refunded.`, T-v-caption-13, line-height 150%, color `#FFFFFF` opacity 70%, margin-bottom 24px.
  - `Divider` — top stroke `#EF4444` opacity 20% 1px, padding-top 16px, text-align left.
    - `Eyebrow` VERBATIM `Dead Code`, 11px Regular, color `#FFFFFF` opacity 40%, margin-bottom 4px.
    - `Code` — text VERBATIM `ONEG-EX-1234`, T-v-mono-18 at 14px, color `#FFFFFF` opacity 30%, strikethrough.

No CTA button.

---

### 3.9 Frame 11 — `owned-handoff / default`

Reached from frame 8's "Redeem Now" (unredeemed state only — redeemed/expired have no path here). Exemplar continues Prime Video.
- `Header` — same pattern as §3.8, `Title` VERBATIM `Redeem Code`.
- `Body` — auto-layout vertical, align/justify center, fill container, padding 24px, text-align center.
  - `Route Row` — auto-layout horizontal, gap (implicit via flex-1 connector), align center, justify center, max-width 200px, margin-bottom 32px.
    - `Bioscope Node` — 48×48 circle, fill `#00BBFF`, centered text VERBATIM `B+`, 20px Bold, color `#000000`.
    - `Connector` — flex-1 height 1px, fill `#FFFFFF` opacity 20%, with a small chevron notch (8×8, rotate 45°, border-top+right `#FFFFFF` opacity 20% 1px) at its right end.
    - `Brand Node` — 48×48 circle, fill `#FFFFFF`, centered `Brand Text Tile`-style text = `product.brand` (e.g. `Prime Video`), 10px Bold, color `#000000`.
  - `Heading` — text VERBATIM `Leaving Bioscope+`, T-v-h3-18 at 20px (one-off 20px Bold), color `#FFFFFF`, margin-bottom 16px.
  - `Body` — max-width 260px, text `You will now be redirected to {brand}'s website to redeem your code. Please ensure you are logged into your {brand} account.` VERBATIM: `You will now be redirected to Prime Video's website to redeem your code. Please ensure you are logged into your Prime Video account.`, T-v-body-14-reg, line-height 150%, color `#FFFFFF` opacity 60%, margin-bottom 32px.
  - `Button Column` — auto-layout vertical, gap 12px, width fill:
    - `Continue Button` — height 48px, corner radius 12px, fill `#FFFFFF`, text `Continue to {brand}` VERBATIM: `Continue to Prime Video`, T-v-body-15, color `#000000`.
    - `Cancel Button` — height 48px, fill transparent, text VERBATIM `Cancel`, T-v-body-14-bold, color `#FFFFFF`.


---

### 3.10 Frames 12–15 — `my-subscriptions / *`

Shared shell across all 4: scrim + sheet (fixed 546px, 70%). Header — auto-layout horizontal, gap 12px, padding `20px top/16px bottom/16px sides`, shrink 0, no bottom stroke (code has none on this header, unlike the other sheets): `[icon placeholder 24×24 "arrow-left"]` fill `#333333`; `Title` VERBATIM `My Subscriptions`, T-v-h3-18, color `#FFFFFF`.

Body — auto-layout vertical, padding `0 16px 32px` (`px-4 pb-8`), scroll region.

**Frame 12 — `active-full`** (subscription = duo-binge, autoRenew off, vouchers = full 3-row locker):
- `Subscription Card` — padding 20px, corner radius 16px, fill `#1E2224`, stroke `#FFFFFF` opacity 10% 1px.
  - `Top Row` — auto-layout horizontal, justify space-between, align center, margin-bottom 8px: `Title` text = `pack.title` VERBATIM `Duo Binge + GP User Plan with Minutes`, T-v-h2-20, color `#FF9900` (amber); `Crown Badge` 32×32 circle, fill `#000000`, centered `[icon placeholder 16×16 "crown"]` color `#FF9900`.
  - `Expiry` — text = `subscription.expiresLabel` VERBATIM `Expires 20 Sep`, T-v-caption-13, color `#FFFFFF` opacity 70%, margin-bottom 16px.
  - `Platforms Box` — padding 12px, corner radius 12px, fill `#000000` opacity 20%, margin-bottom 24px.
    - `Eyebrow` VERBATIM `Included Platforms`, 12px Regular, color `#FFFFFF` opacity 50%, margin-bottom 8px.
    - `Logo Strip` — auto-layout horizontal, wrap, gap 4px. **Flag, two stacked real code bugs** (see §6 for full detail): (1) this component is called as `<OTTLogoStrip providers={pack.providers} />` but the component's prop is named `brands`, not `providers` — as written, `brands` always defaults to `[]` and the strip renders **nothing**; (2) even with the prop name fixed, most of `duo-binge`'s provider ids (`sonyliv`, `lion`, `one`, `bioscope`) don't match any key in `OTT_BRANDS`/`BRAND_LOGO` (casing/naming mismatches — e.g. `sonyliv` vs `sonyLiv`), so only `hoichoi`, `chorki`, `deepto`, `iscreen`, `shemaroo`, `bongo` (6 of 10) would render even after the prop fix. Build this frame with the **intended** 6-tile row (best-effort reconstruction of design intent), each `[image placeholder 44×44 "<brand>-logo"]`, corner radius 5px, fill `#FFFFFF` background tile — don't build an empty box, but don't claim this matches current live behavior either.
  - `Auto-renew Row` — top stroke `#FFFFFF` opacity 10% 1px, padding-top 16px, auto-layout horizontal, justify space-between, align center.
    - `Text Group`: `Label` VERBATIM `Auto renewal`, T-v-body-14-bold, color `#FFFFFF`, margin-bottom 2px; `Next Charge` text `Next charge ৳{price}` VERBATIM `Next charge ৳179`, 12px Regular, color `#FFFFFF` opacity 50%.
    - `Toggle` — 44×24 pill, corner radius 999, OFF: fill `#FFFFFF` opacity 20%; knob 20×20 circle fill `#FFFFFF`, inset 2px, left-aligned.
- `Vouchers Section` — margin-top 32px, top stroke `#FFFFFF` opacity 10% 1px, padding-top 24px.
  - `Section Title` — text VERBATIM `Digital Vouchers`, T-v-h3-18 at 16px (one-off 16px Bold), color `#FFFFFF`, margin-bottom 16px.
  - `Voucher Row` × 3, auto-layout vertical list gap 12px. Each row: auto-layout horizontal, justify space-between, align center, padding 16px, corner radius 12px, fill `#1E2224`, stroke `#FFFFFF` opacity 10% 1px.
    - Left: `Brand Text Tile` 40×40 (§3.0) + `Text Group` (`Product` T-v-body-14-bold white; `Status` T-v-caption-13-bold, color/text per state: unredeemed → `Ready to redeem` color `#00BBFF`; redeemed → `Redeemed` color `#FFFFFF` opacity 50% (12px Regular, not bold — matches code's `text-white/50` with no font-bold class); expired → `Expired` color `#EF4444`.
    - Right: `[icon placeholder 18×18 "chevron-right"]` color `#FFFFFF` opacity 30%.
  - Row order & content (from `demoLocker`): 1) Prime Video / `1 month` / Ready to redeem. 2) Netflix / `Mobile plan · 1 month` / Redeemed. 3) OneGames / `1 month` / Expired.

**Frame 13 — `active-full-autorenew-on`**: identical to frame 12 except `Toggle` ON — fill `#00BBFF`, knob translated to right (inset 2px from right edge).

**Frame 14 — `no-subscription-vouchers-full`**: `Subscription Card` replaced by:
- `Empty Sub State` — auto-layout vertical, align/justify center, padding `48px 0` (`py-12`), text-align center.
  - `Icon Disc` — 64×64 circle, fill `#FFFFFF` opacity 5%, centered `[icon placeholder 28×28 "crown"]` color `#FFFFFF` opacity 30%, margin-bottom 16px.
  - `Title` — text VERBATIM `No Active Subscriptions`, T-v-h3-18 at 18px, color `#FFFFFF`, margin-bottom 8px.
  - `Body` — max-width 240px, text VERBATIM `You don't have any active packs at the moment.`, T-v-caption-13 at 14px, color `#FFFFFF` opacity 50%.
`Vouchers Section` unchanged from frame 12 (same 3 rows).

**Frame 15 — `empty-both`**: Empty Sub State (same as frame 14) + `Vouchers Section` replaced by:
- `Section Title` unchanged (`Digital Vouchers`).
- `Empty Locker Card` — padding 24px, corner radius 12px, fill `#1E2224`, stroke `#FFFFFF` opacity 10% 1px, auto-layout vertical, align/justify center, text-align center.
  - `Icon Disc` — 48×48 circle, fill `#FFFFFF` opacity 5%, centered `[icon placeholder 24×24 "ticket"]` color `#FFFFFF` opacity 30%, margin-bottom 12px.
  - `Title` — text VERBATIM `Your Locker is Empty`, T-v-body-14-bold, color `#FFFFFF`, margin-bottom 4px.
  - `Body` — text VERBATIM `You have no digital vouchers. Buy subscriptions for other apps in the store.`, T-v-caption-13, color `#FFFFFF` opacity 50%, margin-bottom 16px.
  - `CTA` — height 36px, padding-x 24px, corner radius 999, fill `#FFFFFF` opacity 10%, centered text VERBATIM `Visit Voucher Store`, 13px Bold, color `#FFFFFF`.


═══════════════════════════════════════════════════════
4. SHARED COMPONENTS — reused vs extended
═══════════════════════════════════════════════════════

### 4.1 Reused verbatim from `FIGMA_PAYWALL_BUILD_SPEC.md`
- **Scrim + bottom-sheet shell** (§1) — full-bleed 60%-black + 2px blur scrim, rounded-top-20 sheet, `#FFFFFF` 5% 1px stroke, `#0A090B` fill. Only the sheet height percentage changes per component (90% / 85% / 70% here vs 85%/95% in the paywall).
- **PaymentMethodList** (§5.2) — light theme row anatomy (brand tile, name, radio) reused exactly for frame 5's checkout. No dark-theme instance appears anywhere in this flow (unlike the paywall's sub-checkout stage).

### 4.2 New / extended in this doc
- **Brand Text Tile** (§3.0) — a new reusable atom this flow introduces: a plain white rounded tile with the brand name as bold black text, used everywhere except the storefront (frames 1–2), which instead shows the real logo image. Not present in either prior spec — this flow is the first to need a text-only brand fallback pattern at 4 different sizes (80/64/48/40px).
- **OTTLogoStrip** — not previously specced (paywall/pack-page docs use `PackCard`'s own `Providers Strip`, a different component). Extended here only enough to cover its one call site (frame 12's Platforms Box); flagged as carrying 2 real bugs (§3.10, §6) rather than fully re-derived as a general-purpose component.


═══════════════════════════════════════════════════════
5. FIGMA API GOTCHAS (bake into build script)
═══════════════════════════════════════════════════════

- `counterAxisAlignItems` accepts **only** `MIN` / `MAX` / `CENTER` / `BASELINE` — never `END`. Anywhere this spec says "align flex-end" (e.g. the price group in frame 3's footer, the price-group baseline in prior specs' footers), map it to `MAX`.
- `layoutPositioning = 'ABSOLUTE'` must be set **after** `appendChild`, never before. Relevant here for: the code-reveal card's decorative hover-gradient overlay (frame 7, if built as a separate absolutely-positioned layer instead of omitted), and the connector chevron notch in frame 11's Route Row.


═══════════════════════════════════════════════════════
6. GAPS / UNRESOLVED — do not build without this context
═══════════════════════════════════════════════════════

1. **"Generic voucher-brand list screen" — confirmed NOT present in code.** `VoucherStorefrontScreen.jsx` has exactly two views: the category-grouped storefront (frame 1, brands bucketed under Streaming/Music/Games headers) and the single-brand product list (frame 2). There is no third, flatter "all brands, ungrouped" listing screen anywhere in the codebase. If the earlier audit meant something distinct from both of these, it does not exist in source — **not built**, listed here as a genuine gap rather than invented.
2. **Runtime bug — missing `Check` import.** `OwnedVoucherDetailSheet.jsx` renders `<Check>` in the `redeemed` state (frame 9) without importing it from `lucide-react` (only `ArrowLeft, Copy, ExternalLink, ShieldAlert, Timer, X` are imported). This throws in the live prototype today — confirmed by `walkthrough/SHOT_LIST.md`'s own note that shot 26 works around it by never opening this state. Fix needed in code before frame 9's live equivalent is demoable; the Figma frame itself is unaffected (it's a static mock of the intended UI).
3. **Data bug — date-string arithmetic yields `NaN`.** `demoLocker`'s `codeExpiresAt`/`packageExpiresAt`/`purchasedAt` fields are ISO date **strings** (`'2026-10-15'`), but `calculateDaysLeft()` does `targetDate - Date.now()`, a string-minus-number that coerces to `NaN`. Both "days left" displays (frames 8 and 9) are affected. Figma frames use the arithmetically-correct day counts instead of reproducing `NaN` — flagged as a fix-in-code item, not preserved as a "real" visual.
4. **Prop-name + key-casing bugs in the platform logo strip.** `MySubscriptionsSheet.jsx` passes `<OTTLogoStrip providers={pack.providers} />`, but `OTTLogoStrip` destructures `{ brands = [] }` — the prop is silently dropped and the strip renders empty regardless of pack. Separately, even if the prop name were corrected, `packs.js`'s provider ids for `duo-binge` (`sonyliv`, `lion`, `one`, `bioscope`) don't match `OTT_BRANDS`'s keys (`sonyLiv`, `lionsgate`, no `one`/`bioscope` equivalent at all) — only 6 of 10 providers would resolve to a tile. Frame 12/13/14's Platforms Box is built as the intended 6-tile reconstruction, not a literal capture of current (broken) behavior.
5. **`vouchers.js` has no `payWith` field on any SKU.** Every voucher purchase checkout (frame 5) therefore always falls back to the same hardcoded `['bkash','nagad','card']` list in `VoucherPurchaseSheet.jsx` — there's no per-brand payment-method variation to spec, unlike the pack/paywall flows.
6. **Generated voucher codes are non-deterministic** (`Math.random()`-based). Frame 7's code string is a representative placeholder in the correct format (`{BRAND4}-{4 random base36}-VCHR`), not a fixed value to match exactly on rebuild.
