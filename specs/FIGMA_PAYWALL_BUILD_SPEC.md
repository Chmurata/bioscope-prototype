Bioscope+ Paywall — Figma Build Spec

Source: src/components/PaywallSheet.jsx (+ PaymentMethodList.jsx, PackCard.jsx, data/packs.js, data/plans.js, data/vouchers.js, index.css, contexts/AppContext.jsx)


═══════════════════════════════════════════════════════
0. STAGE MACHINE — ordered, exact code keys
═══════════════════════════════════════════════════════

`stage` state in PaywallSheet.jsx, in the order they appear as JSX blocks (numbered comments in the file):

1. `prompt`          — "1. Initial Prompt"
2. `packs`           — "2. Compact Packs Sheet"
3. `rent-checkout`   — "3. Rent Checkout"
4. `sub-checkout`    — "4. Sub Checkout"
5. `payment`         — "5. Payment Methods List"
6. `carrier-1`       — "5a. Carrier Stage 1 (Number)"
7. `carrier-2`       — "5b. Carrier Stage 2 (OTP & Limit)"
8. `carrier-failed`  — "5c. Carrier Stage Failed (MB9)"
9. `processing`      — "6. Processing"
10. `success`        — "7. Success"

That is **10 distinct stage keys**, not 12. Several stages carry internal copy/UI variants driven by other state (not `stage`):

- `carrier-failed` has 2 copy variants via `failureKind`: `'limit'` | `'declined'`.
- `success` has 2 body-copy variants via `isRentFlow`, and the CTA label additionally forks on `origin === 'generic'`.
- `sub-checkout` has several footer/discount-panel variants via `activeDiscountLabel`, `discountOpen`, `appliedCoupon`, `couponError`, `toastMessage`.
- `carrier-1` / `carrier-2` each have an inline validation-error variant.

Counting stage keys × meaningful copy variants gets you into the low-20s (see §1 frame list) — likely what "12" was a rough estimate of. Treat the 10 keys above as canonical.

**Origin framings.** `FRAMING` object has 4 keys, but `generic` never renders the `prompt` stage (the origin-init effect routes `generic` straight to `packs`). So only 3 framings are ever visible in the `prompt` stage:

```js
const FRAMING = {
  'preview-end': "You've watched the free preview",
  'trailer-end': "Trailer finished; the content is paywalled",
  'locked-tap':  "Unlock to start watching",
  'generic':     "Choose Your Plan"   // defined but unreachable as prompt copy
};
```

Origin also affects (no new frame needed, annotated inline instead):
- `packs` stage back-button target: `origin === 'generic' ? onClose() : setStage('prompt')`. Visual is identical either way.
- `success` stage CTA label: `origin === 'generic' ? 'Browse Home' : 'Start Watching'`.


═══════════════════════════════════════════════════════
1. GLOBAL CONSTANTS
═══════════════════════════════════════════════════════

- Artboard: **360×780**, name pattern `Paywall / <NN> <stage> / <framing>`.
- Page/canvas background behind the artboard: **#111618** (`--color-bg`).
- Font family everywhere: **Inter**. Weight → Figma style name: 400 Regular, 500 Medium, 600 "Semi Bold", 700 Bold. (No 800/900 used anywhere in these files.)
- Overlay scrim (all stages, full-bleed behind the sheet): rectangle 360×780, fill `#000000` opacity **60%**, plus background blur **2px** (Figma "Background blur" effect, 2px) — `bg-black/60 backdrop-blur-[2px]`.
- Sheet container: bottom-anchored, width 360, rounded top corners **20px** (`rounded-t-[20px]`), stroke `#FFFFFF` opacity 5% width 1px inside (`ring-1 ring-white/5`), fill `#0A090B` (`--color-dark`, class `bg-dark`).
  - Compact stages (`prompt`, `packs`): height = hug contents, **max-height 663px** (85% of 780).
  - All other stages: fixed height **741px** (95% of 780).

### 1.1 Resolved color token table (everything used across these 3 components)

| Token / class | Hex / value |
|---|---|
| `--color-bg` (page bg) | `#111618` |
| `--color-dark` (`bg-dark`, sheet fill) | `#0A090B` |
| `--color-surface-dark` (`bg-surface-dark`) | `#1E2224` |
| `--color-surface-alt` (`bg-surface-alt`, sticky footers) | `#212628` |
| `--color-cyan` | `#00BBFF` |
| `--color-cyan-light` | `#73F5FD` |
| `--color-amber` | `#FF9900` |
| `--color-pink` | `#FF2E93` |
| `--color-gp-blue` | `#0055A5` |
| `--color-campaign-accent` | `#FF8A00` |
| `--color-icon-subtle` | `#D2D6DB` |
| `--color-card` (`text-card`) | `#262b30` |
| `--color-divider-light` | `#E5E7EB` |
| `--color-select-blue` | `#1E40E8` |
| `--color-select-tint` | `#E7EFFF` |
| `--color-outline-light` | `#9DA4AE` |
| `--premium-linear-1` | `#FFDC86` |
| `--premium-linear-2` | `#FFD160` |
| White / black at opacity (Tailwind `/NN` suffix) | `#FFFFFF` or `#000000` at NN% opacity — resolve per-layer, don't flatten |
| Tailwind default `red-100` (bg, carrier-failed icon disc) | `#FEE2E2` |
| Tailwind default `red-500` (icon/text) | `#EF4444` |
| Tailwind default `red-600` (inline validation text) | `#DC2626` |

### 1.2 Gradients

- `--gradient-subscribe` (Subscribe button, prompt stage): **linear, 90°**, stop 1 `#FFDC86` @ 40%, stop 2 `#FFD160` @ 100%.
- `--gradient-recommended` (recommended PackCard background): **linear, 135°**, stops: `#1E2A6B` @ 0%, `#111A42` @ 40%, `#0A0F28` @ 75%, `#050813` @ 100%.
- Success icon circle: `bg-gradient-to-tr from-cyan to-cyan-light` → **linear, ~45° (bottom-left to top-right)**, stop 1 `#00BBFF` @ 0%, stop 2 `#73F5FD` @ 100%.
- Campaign badge (live state, used inside PackCard, not itself a paywall stage but embedded in `packs`): `bg-gradient-to-r from-pink to-campaign-accent` → **linear, 0° (left→right)**, stop 1 `#FF2E93` @ 0%, stop 2 `#FF8A00` @ 100%, plus drop shadow `0 0 12px rgba(255,46,147,0.3)`.

### 1.3 Reusable text styles (referenced as T1, T2… below)

| ID | Size | Weight | Line height | Notes |
|---|---|---|---|---|
| T-h1 | 24px | Bold (700) | 120% (29px) | Success heading |
| T-h2 | 22px | Bold (700) | 120% (26px) | Prompt content title |
| T-h3-20 | 20px | Bold (700) | 120% (24px) | Checkout card titles |
| T-h3-18 | 18px | Bold (700) | 120% (22px) | Section headers, carrier crown-row title |
| T-body-16 | 16px | Bold (700) | 120% (19px) | Primary CTA labels |
| T-body-15 | 15px | Bold (700) | 120% (18px) | Secondary CTA labels |
| T-body-15-med | 15px | Medium (500) | normal | Inputs |
| T-body-14 | 14px | Semi Bold (600) | normal | Row labels |
| T-body-14-reg | 14px | Regular (400) | normal | Body copy |
| T-caption-13 | 13px | Regular (400) | 150% (leading-relaxed) | Rental blurb, disclaimers |
| T-caption-13-bold | 13px | Bold (700) | normal | Amounts, small headers |
| T-caption-12 | 12px | Regular (400) | normal | Fine print |
| T-caption-12-bold | 12px | Bold (700) | normal | Uppercase eyebrow (`Rental` badge) |
| T-caption-11 | 11px | Regular (400) | normal | Micro fine print |
| T-mono-12 | 12px | Regular (400), **monospace** (`font-mono`, not Inter) | normal | Carrier limit ledger block |

Colors are called out per layer below since they vary (white / white-opacity / cyan / pink / amber / black).


═══════════════════════════════════════════════════════
2. FRAME LIST (22 frames total — see §4 for count math)
═══════════════════════════════════════════════════════

1. `Paywall / 01 prompt / preview-end`
2. `Paywall / 01 prompt / trailer-end`
3. `Paywall / 01 prompt / locked-tap`
4. `Paywall / 02 packs / generic`  *(single visual; see §3.2 note on back-button target)*
5. `Paywall / 03 rent-checkout / generic`
6. `Paywall / 04 sub-checkout / default`
7. `Paywall / 04 sub-checkout / discount-applied`
8. `Paywall / 04 sub-checkout / discount-panel-empty`
9. `Paywall / 04 sub-checkout / discount-panel-applied`
10. `Paywall / 04 sub-checkout / discount-panel-error`
11. `Paywall / 04 sub-checkout / toast-offer-expired`
12. `Paywall / 05 payment / default`
13. `Paywall / 05a carrier-1 / default`
14. `Paywall / 05a carrier-1 / invalid-number-error`
15. `Paywall / 05b carrier-2 / default`
16. `Paywall / 05b carrier-2 / otp-error`
17. `Paywall / 05c carrier-failed / limit`
18. `Paywall / 05c carrier-failed / declined`
19. `Paywall / 06 processing / default`
20. `Paywall / 07 success / sub-generic`
21. `Paywall / 07 success / sub-nongeneric`
22. `Paywall / 07 success / rent`


═══════════════════════════════════════════════════════
3. PER-STAGE LAYER SPECS
═══════════════════════════════════════════════════════

Every frame below sits inside the shared shell: full-bleed 360×780 scrim rectangle (see §1) + the bottom-sheet container (fill `#0A090B`, top-radius 20, stroke `#FFFFFF` 5% 1px). Only the sheet's *inner content* is detailed per stage; don't re-derive the scrim/sheet each time.

---

### 3.1 Stage `prompt` — frames 1–3

Origin changes ONLY the eyebrow text (T-caption line under it is the FRAMING string). Layout otherwise identical across all 3 framings.

Sheet: auto-layout **vertical**, padding **20px** all sides (`p-5`), gap 0 (children use explicit margins below), fill `#0A090B`, width 360, height = hug (max 663).

Layer tree, top→bottom:
- `Header Row` — auto-layout horizontal, width fill, justify space-between, align flex-start, margin-bottom 16px (`mb-4`)
  - `Title Group` — auto-layout vertical, gap 4px
    - `Eyebrow` — text, **VERBATIM per framing**: preview-end → `You've watched the free preview` / trailer-end → `Trailer finished; the content is paywalled` / locked-tap → `Unlock to start watching`. Style: 14px, Semi Bold (600), color `#00BBFF` (cyan), align left, margin-bottom 4px.
    - `Content Title` — text, **VERBATIM**: `{content?.title}` — **UNRESOLVED**: drama title comes from `content` prop (dramas.js, not read for this spec). Use placeholder string `Content Title` and swap per real content when instancing. Style: T-h2, color `#FFFFFF`.
  - `Close Button` — 32×32 circle, fill `#FFFFFF` opacity 10% (`bg-white/10`), corner radius 999 (full), padding 4px, centered icon: `[icon placeholder 20×20 "x-close"]` fill `#333333`.
- `Actions Column` — auto-layout vertical, gap **12px** (`gap-3`), margin-top **16px** (`mt-4`)
  - `Subscribe Button` — auto-layout horizontal, width fill, height **52px**, corner radius **12px**, justify center, align center, gap 8px, fill = gradient-subscribe (linear 90°, `#FFDC86`@40% → `#FFD160`@100%), effect: drop shadow `0px 4px 14px rgba(255,153,0,0.3)`.
    - `[icon placeholder 20×20 "crown"]` fill `#333333` (rendered black in code, stroke 2.5, but per instructions icons are always the grey placeholder)
    - `Label` — text `Subscribe to Unlock`, T-body-16, color `#000000`.
  - `Rent Button` — **only present if `content?.rentPrice` exists** — auto-layout horizontal, width fill, height 52px, corner radius 12px, fill `#FFFFFF`, justify/align center.
    - `Label` — text `Rent for ৳{content.rentPrice}` — **UNRESOLVED**: exact rentPrice not available from the files read (lives on drama content objects in dramas.js). Placeholder text: `Rent for ৳49`. Style T-body-16, color `#000000`.
- `Footer Row` — auto-layout horizontal, justify center, margin-top 16px (`mt-4`)
  - `See all packs` — text, VERBATIM `See all packs`, 13px Regular, color `#FFFFFF` opacity 50%.

---

### 3.2 Stage `packs` — frame 4

Note: entered either from `prompt` (back arrow → `prompt`) or directly when `origin === 'generic'` (back arrow → closes sheet entirely). Visual is identical; annotate the prototype interaction only, don't build 2 frames.

Sheet: auto-layout **vertical**, fill `#0A090B`, height = hug (max 663), no outer padding on the sheet itself (children carry their own).

Layer tree:
- `Header` — auto-layout horizontal, padding `20px top / 16px bottom / 16px left+right` (`px-4 pt-5 pb-4`), justify space-between, align center, fill none (inherits sheet).
  - `Back Button` — `[icon placeholder 24×24 "arrow-left"]` fill `#333333`, 4px padding hit-area.
  - `Title` — text VERBATIM `Select a Pack`, T-h3-18, color `#FFFFFF`, centered.
  - `Spacer` — 32×32 empty box (`w-[32px]`), no fill — keeps title centered.
- `Pack List (scroll)` — auto-layout vertical, padding `0px 16px 24px` (`px-4 pb-6`), gap **12px** (`space-y-3`), width fill, height fill (scrollable region).
  - Children: one `PackCard` component instance per pack in `displayPacks` (all 12 from packs.js, `standard` pack floats first because `recommended: true`, remainder keep source array order). See §5 for the full PackCard component spec + the per-pack data table.

---

### 3.3 Stage `rent-checkout` — frame 5

Sheet fixed height **741px**, auto-layout vertical, 3 sections: header (shrink 0), scroll body (flex fill), sticky footer (shrink 0).

- `Header` — auto-layout horizontal, gap 12px, padding `20px top / 16px bottom / 16px sides` (`px-4 pt-5 pb-4`), align center.
  - `[icon placeholder 24×24 "arrow-left"]` fill `#333333`.
  - `Title` — text VERBATIM `Checkout`, 18px Bold, color `#FFFFFF`.
- `Body (scroll)` — auto-layout vertical, padding `0 16px 24px` (`px-4 pb-6`), fill container.
  - `Info Card` — auto-layout vertical, padding 16px (`p-4`), corner radius 16px, fill `#1E2224` (surface-dark), stroke `#FFFFFF` 10% 1px inside, margin-bottom 20px (`mb-5`).
    - `Eyebrow` — text VERBATIM `Rental`, T-caption-12-bold, uppercase, letter-spacing wide, color `#FF9900` (amber), margin-bottom 4px.
    - `Title` — text `{content?.title}` — **UNRESOLVED placeholder**: `Content Title`. T-h3-20, color `#FFFFFF`, margin-bottom 8px.
    - `Body` — rich text, 13px Regular, line-height 150%, color `#FFFFFF` opacity 70%: `Access to this title for ` + **bold span** `48 hours` + `. The rental period starts when you first press play.`
  - `Section Label` — text VERBATIM `Select Payment Method`, 15px Bold, color `#FFFFFF`, margin-bottom 12px.
  - `Payment Preview Row` — auto-layout horizontal, width fill, justify space-between, align center, padding `16px/12px` (`px-4 py-3`), corner radius 10px, fill transparent, stroke `#00BBFF` (cyan) 1px, margin-bottom 24px (`mb-6`).
    - `Logo Group` — auto-layout horizontal, gap 8px, align center.
      - 3× `[icon placeholder 22h×~34w "payment-logo-tile"]` — white rounded tile (radius 3px) each holding one of the first 3 `PAYMENT_PREVIEW` logos (bKash, Nagad, Visa) — logo itself is the icon-placeholder per instructions.
      - `Ellipsis` — text VERBATIM `...`, 12px Regular, color `#FFFFFF` opacity 50%, margin-left 4px.
    - `Check Badge` — 20×20 circle, fill `#00BBFF` (cyan), centered `[icon placeholder 12×12 "check"]` fill `#333333`.
- `Footer` — shrink 0, fill `#212628` (surface-alt), padding 16px (`p-4`).
  - `Amount Row` — auto-layout horizontal, justify space-between, align center, margin-bottom 16px.
    - `Label` — text VERBATIM `Amount Payable`, 14px Regular, color `#FFFFFF`.
    - `Value` — text `৳{content?.rentPrice}` — placeholder `৳49`, 18px Bold, tabular numerals, color `#FFFFFF`.
  - `Proceed Button` — auto-layout horizontal, height 48px, width fill, corner radius 12px, fill `#FFFFFF`, justify/align center, gap 8px.
    - `Label` — text VERBATIM `Proceed to Payment`, T-body-15, color `#000000`.
    - `[icon placeholder 18×18 "arrow-right"]` fill `#333333`.

---

### 3.4 Stage `sub-checkout` — frames 6–11

Shared shell: header identical pattern to §3.3 (arrow-left + `Checkout` title), fixed sheet height 741px, scroll body + sticky footer.

**Body content (all sub-checkout variants share this except where noted):**
- `Toast` (frame 11 only, `toast-offer-expired`) — absolutely positioned top 16px / sides 16px, auto-layout horizontal, justify space-between, align center, padding `10px 16px` (`px-4 py-2.5`), corner radius 8px, fill `#FF2E93` (pink), drop shadow (Figma default "lg" shadow).
  - `Message` — text VERBATIM `Offer expired. The price has been updated.`, 13px Bold, color `#FFFFFF`.
  - `[icon placeholder 14×14 "x"]` fill `#333333`.
- `Plan Card` — auto-layout vertical, padding 16px, corner radius 16px, fill `#1E2224`, stroke `#FFFFFF` 10% 1px, margin-bottom 20px.
  - `Title` — text `{selectedPack?.title}` — resolve from packs.js per instance, e.g. for the `standard` pack: `Standard`. T-h3-20, color `#FFFFFF`, margin-bottom 8px.
  - `Duration` — text `{selectedPack?.duration}` e.g. `1 Week`. 13px Regular, color `#FFFFFF` opacity 70%, margin-bottom 12px.
  - `Coverage` — text `{selectedPack?.coverage}` e.g. `Get access to 10 OTT platforms`. 12px Regular, color `#FFFFFF` opacity 50%, margin-bottom 16px.
  - `Auto-renew Row` — auto-layout horizontal, justify space-between, align center, padding-top 16px, top stroke `#FFFFFF` 10% 1px (border-t).
    - `Label` — text VERBATIM `Auto renewal`, 14px Regular, color `#FFFFFF`.
    - `Toggle` — 44×24 pill, corner radius 999. OFF state: fill `#FFFFFF` opacity 20%. ON state: fill `#00BBFF`. Knob: 20×20 circle fill `#FFFFFF`, inset 2px, positioned left (off) or right (on).
  - Default variants (6–11) all show toggle OFF (`autoRenew` initializes false) unless you want to add a 7th toggle-on state — not required by the code's default render path.
- `PaymentMethodList` component instance, theme = **dark** (see §5.2). `allowedMethods` = `selectedPack.payWith` filtered by `carrierKnown` (default true) — for the `standard` pack example: `['balance','bkash','nagad','card']`, all 4 rows shown, default selection `bkash`.
- `Discount Row` (collapsed header, always visible) — auto-layout horizontal, width fill, justify space-between, align center, padding `12px 16px` (`px-4 py-3`), corner radius 10px, fill `#1E2224`, stroke `#FFFFFF` 10% 1px.
  - `Label` — text VERBATIM `Discount`, 14px Bold, color `#FFFFFF`.
  - `Right Group` — auto-layout horizontal, gap 8px, align center.
    - `Applied Pill` — **only in frame 9** (`discount-panel-applied`) and frame 7 if a coupon is the active discount — text VERBATIM `1 Applied`, 12px Bold, color `#FF2E93`.
    - `[icon placeholder 16×16 "chevron"]` fill `#333333`, rotate 90° when collapsed, -90° when expanded (frames 8/9/10 show expanded chevron).
  - Frames 6, 7, 11: panel collapsed, only this row renders.
- `Discount Panel` (expanded body) — **frames 8, 9, 10 only** — auto-layout vertical, padding `16px sides, 8px top, 16px bottom` (`p-4 pt-2`), fill `#1E2224` at 50% opacity, side+bottom stroke `#FFFFFF` 5% 1px, bottom corner radius 10px (attaches under Discount Row).
  - **Frame 8 (`discount-panel-empty`)**:
    - `Input Row` — auto-layout horizontal, gap 8px, align center.
      - `Coupon Input` — height 40px, fill container, fill `#000000` opacity 20%, stroke `#FFFFFF` 10% 1px, corner radius 8px, padding-left 12px, placeholder text VERBATIM `Enter Coupon Code`, 14px Regular, color `#FFFFFF` (placeholder shown dimmed).
      - `Apply Button` — height 40px, padding-x 16px, fill `#FFFFFF`, corner radius 8px, opacity 50% (disabled — empty input), text VERBATIM `Apply`, 13px Bold, color `#000000`.
  - **Frame 9 (`discount-panel-applied`)**:
    - `Applied Chip` — auto-layout horizontal, justify space-between, align center, padding 12px, corner radius 8px, fill `#000000` opacity 20%, stroke `#FF2E93` opacity 30% 1px.
      - `Left Group` — gap 8px, align center: `[icon placeholder 16×16 "check"]` color `#FF2E93`; `Code` text VERBATIM `{appliedCoupon.code}` uppercase e.g. `VALID50`, 13px Bold, color `#FFFFFF`; `Amount` text `-৳{appliedCoupon.discount}` e.g. `-৳50`, 13px Regular, color `#FFFFFF` opacity 70%.
      - `Remove` — text VERBATIM `Remove`, 12px Bold, color `#FF2E93`.
  - **Frame 10 (`discount-panel-error`)**: same as frame 8's Input Row (Apply button enabled — fill `#FFFFFF` full opacity, since input has text) plus:
    - `Error Text` — text VERBATIM one of: `Invalid coupon code.` (generic wrong code) / `This coupon code has expired.` (`EXPIRED`) / `This coupon is not valid for the selected pack.` (`NOT_ELIGIBLE`). Use `Invalid coupon code.` as the frame's default. 11px Regular, color `#FF2E93`, margin-top 8px.
- `Legal` — text VERBATIM `By continuing you are agreeing to Bioscope+'s Terms of Use and Refund Policy`, 11px Regular, color `#FFFFFF` opacity 50%, align center, margin-bottom 24px.

**Footer — 2 variants:**
- Frame 6 (`default`, no discount): auto-layout horizontal, justify space-between, align flex-end, margin-bottom 16px.
  - `Label` — VERBATIM `Amount Payable`, 14px Regular, color `#FFFFFF`.
  - `Price Group` — auto-layout horizontal, gap 8px, align flex-end: optional `Original Price` strikethrough (only if `selectedPack.originalPrice` set) e.g. `৳149`, 14px Medium, color `#FFFFFF` opacity 50%, strikethrough; `Final Price` e.g. `৳99`, 20px Bold, tabular nums, leading-none, color `#FFFFFF`.
- Frames 7, 9, 11 (`discount-applied` — active coupon or campaign): auto-layout vertical, margin-bottom 16px.
  - `Subtotal Row` — justify space-between: `Subtotal` 13px Regular color `#FFFFFF` opacity 70%; value e.g. `৳99` 13px Regular tabular color `#FFFFFF`.
  - `Discount Row` — justify space-between, padding-bottom 8px, bottom stroke `#FFFFFF` 10% 1px: label `{activeDiscountLabel}` e.g. `Coupon (VALID50)` 13px Regular color `#FF2E93`; value `-৳{discountAmount}` e.g. `-৳50`, 13px Regular tabular color `#FF2E93`.
  - `Total Row` — justify space-between: `Amount Payable` 14px Bold color `#FFFFFF`; value e.g. `৳49` 20px Bold tabular leading-none color `#FFFFFF`.
- Frame 8, 10 (panel-open states without a resolved discount) reuse the frame-6 default footer.
- `Continue Button` (all sub-checkout frames) — height 48px, width fill, corner radius 12px, fill `#FFFFFF`, justify/align center, gap 8px: `Label` VERBATIM `Continue to Payment`, T-body-15, color `#000000`; `[icon placeholder 18×18 "arrow-right"]` fill `#333333`.

Footer container itself: fill `#212628`, padding 16px, shrink 0.

---

### 3.5 Stage `payment` — frame 12

Sheet background overrides to **white** for this stage only (`bg-white` on the flex container) while the very top strip stays dark.
- `Header Strip` — fill `#0A090B` (dark), padding `20px top/16px bottom/16px sides`, shrink 0.
  - `[icon placeholder 24×24 "arrow-left"]` fill `#333333` (rendered white in code — placeholder rule still applies, keep grey per instructions, but note actual icon color is white in-app).
- `Body (scroll)` — fill `#FFFFFF`, padding `20px top/16px sides/24px bottom` (`px-4 pt-5 pb-6`).
  - `PaymentMethodList` component instance, theme = **light** (see §5.2), unfiltered (`allowedMethods` undefined → all 6 methods render): balance, bkash, rocket, nagad, cards, upay.
- `Footer` — fill `#FFFFFF`, top stroke `#000000` 5% 1px, padding 16px, shrink 0.
  - `Pay Button` — height 48px, width fill, corner radius 12px, fill `#FFFFFF`, stroke `#000000` 20% 1px, justify/align center, gap 8px.
    - `Label` — text `Pay ৳{isRentFlow ? content?.rentPrice : selectedPack?.price}` — for the sub-flow example (`standard` pack): `Pay ৳99`. T-body-15, color `#000000`.
    - `[icon placeholder 18×18 "arrow-right"]` fill `#333333`.

---

### 3.6 Stage `carrier-1` — frames 13, 14

White background throughout.
- `Header` — fill `#FFFFFF`, bottom stroke `#000000` 10% 1px, padding `20px top/16px bottom/16px sides`, auto-layout horizontal, justify space-between, align center.
  - `Brand Group` — gap 12px, align center: 32×32 circle fill `#0055A5` (gp-blue) with centered text `gp` VERBATIM, 14px Bold, color `#FFFFFF`, leading-none; `Title` text VERBATIM `Checkout`, 18px Bold, color `#000000`.
- `Body` — padding `24px top/16px sides/24px bottom`.
  - `Pack Summary Row` — auto-layout horizontal, gap 16px, align center, margin-bottom 32px.
    - `Icon Tile` — 60×60, corner radius 8px, fill `#000000`, centered `[icon placeholder 28×28 "crown"]` (rendered cyan in code — note as color hint, keep placeholder grey `#333333` per instruction).
    - `Text Group`: `Title` `{selectedPack?.title}` e.g. `Standard`, 18px Bold, color `#000000`, margin-bottom 4px; `Duration` `{selectedPack?.duration}` e.g. `1 Week`, 14px Regular, color `#000000` opacity 60%.
  - `Mobile Field` — margin-bottom 32px.
    - `Label` — VERBATIM `Mobile Number:`, 14px Bold, color `#000000`, margin-bottom 8px.
    - `Input Row` — auto-layout horizontal, height 48px, corner radius 8px, stroke `#000000` 20% 1px (focus state: stroke `#0055A5` + 1px ring same color — build as a separate "focused" sub-variant if desired, not required).
      - `Prefix` — fixed box, padding-x 12px, fill `#000000` opacity 5%, right stroke `#000000` 10% 1px, text VERBATIM `+880`, 15px Medium, color `#000000`.
      - `Value` — fill container, padding-x 12px, placeholder text VERBATIM `17XXXXXXXX`, 15px Medium, color `#000000` (dimmed for placeholder).
  - `Ack Row` — auto-layout horizontal, gap 12px, align flex-start, margin-bottom 32px.
    - `Checkbox` — 20×20, corner radius 4px, fill `#0055A5`, centered `[icon placeholder 14×14 "check"]` fill `#FFFFFF`.
    - `Text` — rich text 12px Regular, line-height tight, color `#000000` opacity 60%: `I acknowledge and accept that charges for ` + `{selectedPack?.duration}` (e.g. `1 Week`) + ` will be made to my mobile balance.`
  - `Error Text` — **frame 14 only** — text VERBATIM `Enter a valid 11-digit Bangladeshi mobile number, e.g. 01711092617`, 12px Regular, color `#DC2626` (red-600), margin-bottom 12px, margin-top -8px.
  - `Button Row` — auto-layout horizontal, gap 12px.
    - `Cancel` — height 48px, fill container, corner radius 8px, stroke `#000000` 20% 1px, text VERBATIM `Cancel`, 15px Bold, color `#000000`.
    - `Get OTP` — height 48px, fill container, corner radius 8px. Frame 13 (valid or empty number — default/enabled look): fill `#0055A5`, text color `#FFFFFF`. Frame 14 (invalid, non-empty number — disabled look): fill `#000000` opacity 20%, text color `#FFFFFF`. Text VERBATIM `Get OTP`, 15px Bold.

---

### 3.7 Stage `carrier-2` — frames 15, 16

Same header pattern as §3.6.
- `Body` — padding `24px top/16px sides/24px bottom`.
  - `Summary Row` — auto-layout horizontal, justify space-between, align center, margin-bottom 32px.
    - Left: same Icon Tile + Text Group pattern as carrier-1 (title/duration).
    - Right: auto-layout vertical, align flex-end: `Price` text `{selectedPack?.price} BDT` e.g. `99 BDT`, 18px Bold, color `#000000`; `VAT Note` VERBATIM `(15% VAT included)`, 11px Regular, color `#000000` opacity 50%.
  - `Ledger Block` — fill `#000000` opacity 5%, corner radius 8px, padding 16px, margin-bottom 32px, auto-layout vertical, gap 4px, font **monospace** (T-mono-12) for all rows, base color `#000000` opacity 80%.
    - Row: `Mobile Number:` (label opacity 50%) / value VERBATIM `+880 {mobileNumber}` e.g. `+880 1712345678`.
    - Row: `Monthly Limit Used:` / value VERBATIM `BDT 260`.
    - Row: `Yearly Limit Used:` / value VERBATIM `BDT 2680`.
    - `Divider` — 1px horizontal rule, fill `#000000` opacity 10%, margin `8px 0`.
    - Row: `Monthly Limit will Remain:` / value VERBATIM `BDT 21441`.
    - Row: `Yearly Limit will Remain:` / value VERBATIM `BDT 9021`.
  - `OTP Field` — margin-bottom 32px.
    - `Label` — VERBATIM `Please Enter OTP:`, 14px Bold, color `#000000`, margin-bottom 8px.
    - `Input` — height 48px, width fill, padding-x 16px, stroke `#000000` 20% 1px, corner radius 8px, placeholder VERBATIM `XXXX`, 15px Bold, color `#000000`.
    - `Error Text` — **frame 16 only** — text VERBATIM `Incorrect OTP entered`, 12px Regular, color `#EF4444` (red-500), margin-top 8px.
  - `Button Row` — same pattern as carrier-1: `Cancel` (outline) + `Confirm Payment`. Frame 15 (OTP <4 chars, disabled look): fill `#000000` opacity 20%. Frame 16 (OTP entered, enabled look — since error only fires after a 4-digit `0000` submit): fill `#0055A5`. Text VERBATIM `Confirm Payment`, 15px Bold, color `#FFFFFF`.

---

### 3.8 Stage `carrier-failed` — frames 17, 18

Same header pattern as §3.6.
- `Body` — auto-layout vertical, align center, justify center, fill container, padding 24px, text-align center.
  - `Icon Disc` — 64×64 circle, fill `#FEE2E2` (red-100), centered `[icon placeholder 32×32 "x"]`, note actual icon color `#EF4444` (red-500).
  - `Heading` — text VERBATIM, frame 17 (`limit`): `Spending limit reached` / frame 18 (`declined`): `Payment declined`. 20px Bold, color `#000000`, margin-bottom 8px.
  - `Body` — max-width 260px, text-align center, 14px Regular, color `#000000` opacity 60%, margin-bottom 32px. VERBATIM:
    - frame 17: `You have used your monthly mobile balance limit. It resets next month — until then, please pay another way.`
    - frame 18: `Your operator could not complete this charge. You can try again, or pay another way.`
  - `Button Column` — auto-layout vertical, gap 8px, width fill.
    - `Try again` — **frame 18 only**: height 48px, fill `#0055A5`, corner radius 12px, text VERBATIM `Try again`, 15px Bold, color `#FFFFFF`.
    - `Choose another method` — both frames, height 48px, corner radius 12px, text VERBATIM `Choose another method`, 15px Bold. Frame 17 (`limit`, only button — primary look): fill `#0055A5`, text color `#FFFFFF`. Frame 18 (`declined`, secondary look next to Try again): stroke `#000000` 20% 1px, no fill, text color `#000000`.

---

### 3.9 Stage `processing` — frame 19

Dark sheet, body auto-layout vertical, align/justify center, fill container.
- `Spinner` — 48×48 circle, stroke width 3px, base stroke `#00BBFF` opacity 20% (full ring), animated arc stroke `#00BBFF` full opacity on top (rotating — static frame: show as a ring with one quarter-arc in solid cyan, rest at 20% opacity), margin-bottom 24px.
- `Label` — text VERBATIM `Processing Payment...`, 16px Bold, color `#FFFFFF`.

---

### 3.10 Stage `success` — frames 20, 21, 22

Dark sheet, body auto-layout vertical, align/justify center, fill container, padding 24px, text-align center.
- `Icon Circle` — 64×64 circle, fill = gradient (linear ~45°, `#00BBFF` → `#73F5FD`), centered `[icon placeholder 32×32 "check"]`, note actual icon color black, margin-bottom 24px.
- `Heading` — text VERBATIM `Payment Successful!`, T-h1, color `#FFFFFF`, margin-bottom 8px.
- `Body` — max-width 240px, 14px Regular, color `#FFFFFF` opacity 60%, margin-bottom 32px. VERBATIM per frame:
  - Frame 22 (`rent`): `You have rented {content?.title}. Your 48 hour window begins when you press play.` — placeholder title `Content Title`.
  - Frames 20/21 (sub flow): `Payment successful. It may take a moment to reflect on your account. please be patient.` (lowercase "please" is verbatim from source — do not autocorrect).
- `CTA Button` — height 48px, width fill, corner radius 12px, fill `#FFFFFF`, text color `#000000`, T-body-15. Label VERBATIM: frame 20 (`sub-generic`) → `Browse Home`; frames 21/22 (`sub-nongeneric`, `rent`) → `Start Watching`.


═══════════════════════════════════════════════════════
4. FRAME COUNT
═══════════════════════════════════════════════════════

10 code stage keys → 22 buildable frames once origin-framing (prompt ×3) and meaningful state variants (sub-checkout ×6, carrier-1 ×2, carrier-2 ×2, carrier-failed ×2, success ×3) are multiplied out; packs/rent-checkout/payment/processing contribute 1 each. See §2 for the literal list.


═══════════════════════════════════════════════════════
5. SHARED COMPONENTS
═══════════════════════════════════════════════════════

### 5.1 PackCard (used inside frame 4, `packs` stage)

Base card, auto-layout vertical, width fill, height fill (stretches in scroll list — actually intrinsic per card, list uses `space-y-3` so treat each as hug-height), padding 20px (`p-5`), corner radius 16px, gap: implicit via child margins below.

Fill: recommended pack → gradient-recommended (linear 135°, `#1E2A6B`→`#111A42`→`#0A0F28`→`#050813` at 0/40/75/100%); all others → `#1E2224` (surface-dark).
Stroke: if a campaign is active on this pack → `#FF2E93` 2px; else `#FFFFFF` opacity 10% 1px.

Layer tree (exemplar = `standard` pack, id `standard`, which is both `recommended: true` and carries `badge: 'Recommended for All'`):
- `Badges Row` — auto-layout horizontal, wrap, gap 8px, margin-bottom 16px. Present only if `pack.badge` or an active campaign exists.
  - `Static Badge` — shown when `pack.badge` set and no campaign: padding `4px 10px`, corner radius 6px, fill `#FFFFFF` opacity 10%, stroke `#FFFFFF` opacity 20% 1px, text uppercase VERBATIM = `pack.badge` value (e.g. `Recommended for All`), 10px Bold, color `#FFFFFF`, tracking wide, leading-none.
  - `Campaign Badge` — only if a campaign targets this pack (none active by default in packs.js — this is state driven by AppContext `activeCampaign`, not by data files; omit from the default 12-card build, mention as a reusable sub-component only).
- `Title` — text = `pack.title` VERBATIM, 18px Bold, color `#FFFFFF`, line-height 24px explicit, margin-bottom 8px.
- `Meta Row` — auto-layout horizontal, wrap, gap 8px, margin-bottom 12px.
  - `Duration Group` — gap 6px, align center: `[icon placeholder 14×14 "clock"]` color `#D2D6DB` (icon-subtle); text = `pack.duration` VERBATIM, 14px Medium, color `#FFFFFF`.
  - `Telco Pill` — only if `pack.telcoValue` set: padding `2px 8px`, corner radius 999, fill `#00BBFF` opacity 15%, stroke `#00BBFF` opacity 30% 1px, text = `pack.telcoValue` VERBATIM, 11px Bold, color `#73F5FD` (cyan-light).
- `Coverage` — text = `pack.coverage` VERBATIM, 12px Regular, color `#FFFFFF` opacity 80%, line-height 18px, margin-bottom 12px.
- `Providers Strip` — only if `pack.providers.length`: row of `[icon placeholder 24×24 "<brand>-logo"]` tiles, one per id in `pack.providers`, margin-bottom 16px.
- `Footer Group` — margin-top auto (pushes to bottom), padding-top 8px, top stroke `#FFFFFF` opacity 10% 1px, auto-layout vertical, gap 12px.
  - `Price Row` — auto-layout horizontal, align flex-end, gap 6px.
    - `Struck Price` — only if `pack.originalPrice` set (or campaign active, not in default data): text `৳{originalPrice}` e.g. `৳149`, 14px Medium, color `#FFFFFF` opacity 50%, strikethrough, tabular nums.
    - `Price` — text `৳{price}` e.g. `৳99`, 28px Bold, tabular nums, tight tracking, color `#FFFFFF` (or `#FF2E93` if campaign active — n/a by default).
    - `Unit` — text = `pack.priceUnit` VERBATIM e.g. `/ 7 days`, 13px Medium, color `#FFFFFF` opacity 70%.
  - `Pay-With Row` — only if `pack.payWith.length`: padding `6px 10px`, corner radius 8px, fill `#FFFFFF` opacity 5%, hug width, row of `[icon placeholder ~12h "payment-mark-<method>"]` per method id.
  - `CTA` — height 44px, width fill, corner radius 8px, justify/align center. Eligible (`pack.eligible: true`, all packs except `family-5gb`): fill `#FFFFFF` (or `#FF9900`/amber if `recommended`), text color `#000000`, T-body-15, label VERBATIM = `Select Best Value` (recommended) or `Select Pack` (all others). Ineligible (`family-5gb` only): fill `#FFFFFF` opacity 5%, stroke `#FFFFFF` opacity 10% 1px, text VERBATIM `Requirement not met`, 14px Medium, color `#FFFFFF` opacity 50%.

**Per-pack data table** (drive 12 PackCard instances from this; order = `standard` first, then source order):

| id | title | badge | duration | telcoValue | price | originalPrice | priceUnit | coverage | eligible | recommended | CTA label |
|---|---|---|---|---|---|---|---|---|---|---|---|
| standard | Standard | Recommended for All | 1 Week | 5 GB Internet | 99 | 149 | / 7 days | Get access to 10 OTT platforms | true | true | Select Best Value |
| day-pass | Day Pass | — | 1 Day | — | 19 | — | / 1 day | Get access to Bioscope+ | true | false | Select Pack |
| movie-night | Movie Night | — | 1 Day | — | 49 | — | / 1 day | Get access to Bioscope+ and Premium Movies | true | false | Select Pack |
| bangla-weekly | Bangla Weekly | — | 1 Week | — | 79 | — | / 7 days | Get access to premium Bangla content | true | false | Select Pack |
| duo-binge | Duo Binge + GP User Plan with Minutes | Best for GP Users | 1 Month | 30 Min + 100 SMS | 179 | 299 | / 28 days | Get access to 10 OTT platforms | true | false | Select Pack |
| super | Bioscope+ Super | — | 1 Month | — | 299 | — | / 28 days | Get access to 10 OTT platforms | true | false | Select Pack |
| data-ent | Data + Entertainment | — | 1 Month | 2 GB Internet | 299 | — | / 28 days | Get access to Bioscope+ and Hoichoi | true | false | Select Pack |
| kids | Kids Pack | — | 1 Month | — | 99 | — | / 28 days | Get access to Kids content | true | false | Select Pack |
| sports-season | Sports Season Pass | — | 3 Months | — | 799 | — | / 90 days | Get access to Live Sports | true | false | Select Pack |
| family-5gb | Family + 5GB Internet | Only for Skitto Users | 3 Months | 5 GB Internet | 229 | 345 | / 90 days | Get access to 10 OTT platforms | **false** | false | Requirement not met |
| annual-bangla | Annual Bangla | — | 1 Year | — | 999 | 1499 | / 365 days | Get access to premium Bangla content | true | false | Select Pack |
| premium-annual | Premium Annual | Best Value | 1 Year | — | 1999 | 2999 | / 365 days | Get access to 10 OTT platforms | true | false | Select Pack |

`payWith` per pack (for the pay-with icon row): day-pass → balance; movie-night → balance, bkash; standard → balance, bkash, nagad, card; bangla-weekly → balance, bkash, nagad; duo-binge → balance, bkash, nagad, card; super → balance, bkash, nagad, card; data-ent → balance, bkash; kids → balance, bkash, nagad; sports-season → balance, bkash, nagad, card; family-5gb → balance, bkash, card; annual-bangla → bkash, nagad, card; premium-annual → bkash, nagad, card.

### 5.2 PaymentMethodList (used inside frames 6–11 as `theme="dark"`, and frame 12 as default light theme)

Header: text VERBATIM `Select Payment Method`, 15px Bold, color `#FFFFFF` (dark theme) or `#262b30` (light theme, `text-card`), margin-bottom 16px.

Method row (repeat per method in the filtered/unfiltered `PAYMENT_METHODS` list — all 6 rows have `logo` set in the data, so every brand tile is a placeholder image, never a text wordmark fallback):
- `Row` — auto-layout horizontal, width fill, gap 12px, align center, padding `12px` (`px-3 py-3`), corner radius 8px, margin-bottom 8px.
  - Dark theme fills: selected → fill `#00BBFF` opacity 10%, stroke `#00BBFF` 1px; unselected → fill `#252a2d`-equivalent (`--color-surface-raised` — **UNRESOLVED**: this token isn't defined in the read `index.css` `@theme` block; likely defined elsewhere or a Tailwind default — flag for follow-up), stroke `#FFFFFF` opacity 10% 1px.
  - Light theme fills: highlighted primary row → fill `#E7EFFF` (select-tint); other rows → transparent, hover-only tint (ignore hover for static spec).
  - `Brand Tile` — 48×32, corner radius 4px, stroke `#000000` opacity 10% 1px, padding 4px, fill = `method.tileBg` = `#FFFFFF` for all 6 methods. Contents: `[icon placeholder ~24×16 "<method>-logo"]`.
  - `Name` — text = `method.name` VERBATIM, 14px Bold, color `#FFFFFF` (dark) / `#262b30` (light).
  - `Radio` — 20×20 circle, stroke 1px. Dark theme: selected → stroke `#00BBFF`, inner dot 10×10 fill `#00BBFF`; unselected → stroke `#FFFFFF` opacity 30%, no dot. Light theme: selected → stroke `#1E40E8` (select-blue), fill `#FFFFFF`, inner dot fill `#1E40E8`; unselected → stroke `#9DA4AE` (outline-light), fill `#FFFFFF`.
- Divider — light theme only, below the first (highlighted) row: 1px rule, fill `#E5E7EB` (divider-light), margin `16px top / 4px bottom`.

Method rows in order (id → name): `balance` → `Pay from Mobile Balance`; `bkash` → `bKash`; `rocket` → `Rocket`; `nagad` → `Nagad`; `cards` → `Other Cards & MFS`; `upay` → `upay`. In frames 6–10 (sub-checkout, dark theme), only the pack's `allowedMethods` subset renders and the divider is skipped (dark theme has no divider per code: `{theme === 'light' && <div className="h-px ..." />}`).


═══════════════════════════════════════════════════════
6. UNRESOLVED / NEEDS FOLLOW-UP
═══════════════════════════════════════════════════════

1. `content.title` and `content.rentPrice` — not resolvable from the requested files; they come from `dramas.js` (not read). Spec uses placeholder values `Content Title` / `৳49` — swap for a real drama record before build, or hand me `dramas.js` for exact values.
2. `--color-surface-raised` — referenced in PaymentMethodList.jsx (`bg-[var(--color-surface-raised)]`, dark-theme unselected row fill) but not defined in the `@theme` block read from `index.css`. Likely declared in another CSS file not in scope — flag before trusting that fill hex; I did not invent a value for it.
3. Live campaign/coupon states (`activeCampaign`, timer/window badges on PackCard) are driven by `AppContext` runtime state, not by `packs.js` data — no pack in the data file ships with an active campaign by default, so the "Campaign Badge" and pink-price PackCard variant are described structurally in §5.1 but have no concrete example instance to point to.
