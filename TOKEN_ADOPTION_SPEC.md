# Bioscope Token Adoption — Executable Spec

> **Resolution of UNRESOLVED rows:** every row marked `UNRESOLVED — ask Anik` in the migration map below is adjudicated in **`TOKEN_DECISIONS.md`** (same directory). Execute buckets **A** (adopt nearest), **C** (drift → merge) and **E** (delete) exactly as written there. **Do NOT act on buckets B or D** — those 12 items are awaiting Anik's decision; leave their current values untouched and skip them in the codemod.

Cold-start spec for an AI coding agent with zero prior context on this project. Self-contained: no links out to files above the project root. Decisions here were made by Anik Roy on 2026-08-30 (see `TOKEN_ADOPTION_PLAN.md` in this same directory — that file explains *why*; this file tells you *what to run*).

---

## 0. Preamble

**Project root:** `/Users/anikroy/Desktop/Gotipath/Bioscope Prototype`
**Stack:** React 19.2, Vite 8.0, Tailwind CSS 4.2 (via `@tailwindcss/vite` — no `tailwind.config.js`, all config lives in `@theme` inside `src/index.css`). Plain JavaScript (`.jsx`/`.js`), **no TypeScript** — there is no `tsconfig.json`, `jsconfig.json`, or `tsc` binary anywhere in this project.
**Package manager:** npm (`package-lock.json` present).

### Locked decisions (do not re-litigate)

1. **Font = Telenor Evolution.** Figma wins over the current Inter/Google-Fonts setup. No metric-compatible fallback exists — expect line-length and vertical-rhythm shifts on every screen; Stage 5 re-checks truncation and button widths.
2. **Colour = Figma replaces prototype wholesale.** The prototype's teal `#2b9c9c`, accent `#4664f5`, and card `#262b30` are drift and get codemodded out in favour of Figma's `#00BBFF` brand, `primary/50–500` indigo ramp, and `#181D1F` card. No exceptions list, no "keep both" compromise.

### Do-not-do list

- **No light mode.** Figma's Colors collection is single-mode ("Dark Mode," no counterpart). Do not build light theming, do not add a `data-theme` toggle, do not scaffold light tokens "for later."
- **Do not touch the ~90 icon components** in Figma or their prototype equivalents (`src/assets/icons/`, inline SVGs in components) — they are unsystematised standalone 24×24 components, explicitly out of scope for this token pass.
- **Never mention or add `prefers-reduced-motion`** — not in code, comments, or commit messages. If you're asked to do an accessibility pass, that's a different task; this one is tokens only.
- Do not touch third-party brand logo colours (payment provider SVGs, OTT platform swatches in `src/data/plans.js`) — see §3 for the full carve-out list.
- Do not run `npm run build` while a dev server may be running (kills it, see §6).

---

## 1. Token tables (inlined from the Figma audit — do not go looking for the source file)

### 1.1 Colour primitives (Colors collection, "Dark Mode" mode, 37 vars, all literal — none are aliases)

**base/**
| Name | Hex |
|---|---|
| base/White | #FFFFFF |
| base/Black | #000000 |
| base/white-alpha | #FFFFFF29 (16%) |
| base/black-alpha | #0000001F (12%) |

**text/**
| Name | Hex |
|---|---|
| text/primary | #FFFFFF |
| text/secondary | #E5E7EB |
| text/tertiary | #D2D6DB |
| text/quaternary | #9DA4AE |
| text/brand | #00BBFF |
| text/invert-light | #25323D |
| text/invert-dark | #2A2A2A |

**bg/**
| Name | Hex |
|---|---|
| bg/page | #111618 |
| bg/card | #181D1F |
| bg/card-light | #212628 |
| bg/card-lighter | #282D2E |
| bg/card-lightest | #2E3334 |
| bg/footer | #121818 |

**border/**
| Name | Hex |
|---|---|
| border/dark | #373A3D |
| border/tsp-light | #FFFFFF1F (12%) |
| border/tsp-dark | #0000001F (12%) |

**primary/** (brand indigo ramp)
| Name | Hex |
|---|---|
| primary/50 | #EDF0FE |
| primary/75 | #B3BFFB |
| primary/100 | #94A5F9 |
| primary/200 | #657EF7 |
| primary/300 | #4664F5 |
| primary/400 | #3146AC |
| primary/500 | #2B3D95 |

**success/**
| Name | Hex |
|---|---|
| success/tertiary | #DAFFE8 |
| success/secondary | #AAF0C4 |
| success/primary | #16B364 |

**error/**
| Name | Hex |
|---|---|
| error/tertiary | #FFFBFA |
| error/secondary | #FECDCA |
| error/primary | #FF474B |

**premium/**
| Name | Hex |
|---|---|
| premium/text | #602906 |
| premium/linear-1 | #FFDC86 |
| premium/linear-2 | #FFD160 |
| premium/badge | #1CC749 |

Unbound raw-hex paint styles (not in the Colors collection, exist only as Figma paint styles — carry over as literal gradients if used, don't invent a variable for them): Badge gradient `#73F5FD → #45EDFF`; Brand Gradient `#72F4FC → #757CF6 (47%) → #D637F3`.

### 1.2 Spacing (Tokens collection, "Saas" mode — Padding and Spacing were two byte-for-byte identical 11-step scales; **collapse into one `--spacing-*` scale**, drop the `pd-`/`sp-` prefix split)

| Step | Value (px) |
|---|---|
| 0 | 0 |
| mc | 2 |
| tn | 4 |
| xs | 6 |
| sm | 8 |
| md | 12 |
| lg | 16 |
| xl | 20 |
| 2xl | 24 |
| 3xl | 28 |
| 4xl | 32 |

Emit as `--spacing-0`, `--spacing-mc`, `--spacing-tn`, `--spacing-xs`, `--spacing-sm`, `--spacing-md`, `--spacing-lg`, `--spacing-xl`, `--spacing-2xl`, `--spacing-3xl`, `--spacing-4xl`.

### 1.3 Corner radius (Tokens collection, "Saas" mode) — keep names as-is

| Step | Value (px) |
|---|---|
| na | 0 |
| sm | 2 |
| default | 4 |
| md | 6 |
| lg | 8 |
| xl | 12 |
| 2xl | 16 |
| 3xl | 20 |
| full | 100 |

Emit as `--radius-na`, `--radius-sm`, `--radius-default`, `--radius-md`, `--radius-lg`, `--radius-xl`, `--radius-2xl`, `--radius-3xl`, `--radius-full`.

### 1.4 Type scale (Typography collection, "Value" mode — 16 sizes, 16 line-heights, 4 weights)

The source has a naming clash: the variable ladder ends `…s-9xl(52) → s-xxl(56) → text-xxl-2(60)`, but the matching *text styles* rename the top step to `xxxl`. **Chosen ladder for this project (state this explicitly in code and don't deviate): continue the numeric pattern through `10xl` and `11xl` instead of `xxl`/`xxl-2`/`xxxl`.** So the top two steps become `10xl` (56) and `11xl` (60). Also fix the collection's own typo: `line-hight` → `--leading-*`.

| Step (chosen name) | Size (px) | Leading (px) | Figma's original size name | Figma's original leading name |
|---|---|---|---|---|
| tn | 10 | 14 | s-tn | lh-tn |
| xs | 12 | 18 | s-xs | lh-xs |
| sm | 14 | 20 | s-sm | lh-sm |
| base | 16 | 24 | s-base | lh-base |
| lg | 18 | 28 | s-lg | lh-lg |
| xl | 20 | 32 | s-xl | lh-xl |
| 2xl | 24 | 32 | s-2xl | lh-2xl |
| 3xl | 28 | 36 | s-3xl | lh-3xl |
| 4xl | 32 | 40 | s-4xl | lh-4xl |
| 5xl | 36 | 40 | s-5xl | lh-5xl |
| 6xl | 40 | 44 | s-6xl | lh-6xl |
| 7xl | 44 | 48 | s-7xl | lh-7xl |
| 8xl | 48 | 56 | s-8xl | lh-8xl |
| 9xl | 52 | 60 | s-9xl | lh-9xl |
| **10xl** | 56 | 64 | s-xxl | lh-xxl |
| **11xl** | 60 | 68 | text-xxl-2 | lh-xxl-2 |

Emit as `--text-tn` … `--text-11xl` and `--leading-tn` … `--leading-11xl` (paired 1:1 by index, e.g. `--text-lg: 18px` pairs with `--leading-lg: 28px`).

Weights (string values in Figma — map to numeric CSS weights):
| Figma name | CSS weight |
|---|---|
| Light | 300 |
| Normal | 400 |
| Medium | 500 |
| Bold | 700 |

Emit as `--font-weight-light: 300`, `--font-weight-normal: 400`, `--font-weight-medium: 500`, `--font-weight-bold: 700`.

Known gaps to carry forward, not fix silently: `text-base/regular` is the one text style with zero variable bindings (raw 16px/24px/Normal) — treat it as identical to the `base` row above, nothing to reconcile. Only `text-sm/regular` (-1%) and `text-sm/medium` (-2%) have non-zero letter-spacing; every other size/weight pair is 0% — apply `letter-spacing: -0.01em` / `-0.02em` only on those two `sm` text styles if/when letter-spacing is implemented, otherwise leave unset.

---

## 2. Current prototype token names (from `src/index.css`, verified by reading the file — 47 `@theme` entries as of 2026-08-30)

```
--color-bg, --color-surface, --color-card, --color-card-hover,
--color-brand, --color-brand-light, --color-brand-mid,
--color-accent, --color-accent-light,
--color-badge-completed, --color-badge-new, --color-badge-ongoing,
--color-white, --color-text-primary, --color-text-secondary, --color-text-muted, --color-text-dim,
--color-border, --color-sheet, --color-overlay, --color-pill-active, --color-pill-inactive,
--color-cyan, --color-amber, --color-dark, --color-surface-dark, --color-pink, --color-gp-blue,
--color-cyan-light, --color-amber-light, --color-surface-alt, --color-surface-panel, --color-error-surface,
--color-ink, --color-divider-light, --color-select-blue, --color-select-tint, --color-outline-light,
--color-badge-ink, --color-badge-notch, --color-campaign-notch, --color-campaign-accent, --color-icon-subtle,
--color-bkash-red,
--premium-linear-1, --premium-linear-2,
--gradient-recommended, --gradient-subscribe,
--font-sans
```

---

## 3. Migration map

Method: `grep -rnoE '#[0-9a-fA-F]{3,8}' src` → **250 hex occurrences, 118 distinct hex values** across `src/`. Every row below is either (a) an **exact hex match** to a §1.1 primitive, (b) a plan-decided conflict (C2–C4, see `TOKEN_ADOPTION_PLAN.md` §2), or (c) genuinely unresolved. Nothing here is invented — where no defensible match exists, the row says so.

**Out-of-scope carve-out first** (do not touch, not part of this migration): third-party brand colours hard-coded per-provider in `src/data/plans.js` (OTT platform swatches: Lionsgate `#F5C518`/`#000000`, iscreen `#BF1F2E`, Chorki `#F08232→#E11D48`, shemaroo `#FFB800`/`#6E2E86`, EPIC ON `#FFC629`, Bongo `#6E0A10`, Deepto `#0F1623`/`#00BBFF`, Klikk `#F2F2F2`/`#E11D48`) and every hex inside `src/assets/payment-logos/*.svg` (amex, visa, mastercard, upay, bkash, rocket, nagad) plus `--color-bkash-red` in `index.css`. Also out of scope: boilerplate `src/assets/vite.svg` / `react.svg`, and `src/assets/crown.svg`'s three gold hexes. Also out of scope: per-content art-direction gradients — `src/data/heroSlides.js` (`tint` field, 5 hexes), `src/data/homeRows.js` (`themeGradient`, 4 hexes), `src/components/home/ThemedBlock.jsx` (2 hexes), `src/components/home/PromoBanner.jsx` (3 hexes) — these are bespoke per-poster/per-promo backgrounds, not systematic tokens; leave as literal hex unless Anik says otherwise.

### 3a. `@theme` tokens (src/index.css) → new token

| Current token (hex) | New token | Confidence |
|---|---|---|
| `--color-bg` (#111618) | `--color-bg-page` (bg/page, exact) | High |
| `--color-card` (#262b30) | `--color-bg-card` (#181D1F, plan decision C4) | High |
| `--color-brand` (#2b9c9c) | `--color-text-brand` (#00BBFF, plan decision C2) | High |
| `--color-accent` (#4664f5) | `--color-primary-300` (primary/300, exact match — **note**: plan describes this as a conflict needing a decision, but the literal hex already equals Figma's primary/300; only the *name* needs to change) | High |
| `--color-accent-light` (#657ef7) | `--color-primary-200` (primary/200, exact match) | High |
| `--color-badge-new` (#4664f5) | `--color-primary-300` (exact match) | High |
| `--color-white` (#ffffff) | `--color-base-white` (base/White, exact) | High |
| `--color-text-primary` (#ffffff) | `--color-text-primary` (text/primary, exact) | High |
| `--color-pill-active` (#ffffff) | `--color-base-white` (exact) | High |
| `--color-pill-inactive` (#262b30) | `--color-bg-card` (#181D1F, plan decision C4) | High |
| `--color-cyan` (#00BBFF) | `--color-text-brand` (text/brand, exact) | High |
| `--color-surface-alt` (#212628) | `--color-bg-card-light` (bg/card-light, exact) | High |
| `--color-divider-light` (#E5E7EB) | `--color-text-secondary` (text/secondary, exact — likely a coincidence given this is a light-theme payment-sheet token; confirm it's meant to be the same value) | High |
| `--color-outline-light` (#9DA4AE) | `--color-text-quaternary` (text/quaternary, exact) | High |
| `--color-badge-ink` (#25323D) | `--color-text-invert-light` (text/invert-light, exact) | High |
| `--color-icon-subtle` (#D2D6DB) | `--color-text-tertiary` (text/tertiary, exact) | High |
| `--premium-linear-1` (#FFDC86) | `--color-premium-linear-1` (premium/linear-1, exact) | High |
| `--premium-linear-2` (#FFD160) | `--color-premium-linear-2` (premium/linear-2, exact) | High |
| `--color-cyan-light` (#73F5FD) | matches the unbound "Badge" paint-style stop, not a Colors variable | Medium |
| `--color-surface` (#1a1d2e) | UNRESOLVED — ask Anik | — |
| `--color-card-hover` (#2e3338) | UNRESOLVED — ask Anik which of bg/card-light #212628 / bg/card-lighter #282D2E / bg/card-lightest #2E3334 is the intended "hover" step | — |
| `--color-brand-light` (#46ffff) | UNRESOLVED — ask Anik (old teal-brand derivative, no Figma cyan/indigo "light" primitive fits) | — |
| `--color-brand-mid` (#31b3b3) | UNRESOLVED — ask Anik | — |
| `--color-badge-completed` (#2b9c9c) | UNRESOLVED — ask Anik whether "completed" should use primary/300 or success/primary #16B364 | — |
| `--color-badge-ongoing` (#b39331) | UNRESOLVED — ask Anik | — |
| `--color-text-secondary` (#bfbfbf) | UNRESOLVED — ask Anik (name collides with Figma's own `text/secondary` #E5E7EB, which is a different hex; needs a rename decision, not just a hex swap) | — |
| `--color-text-muted` (#808080) | UNRESOLVED — ask Anik | — |
| `--color-text-dim` (#555555) | UNRESOLVED — ask Anik | — |
| `--color-border` (#2e3338) | UNRESOLVED — ask Anik (border/dark is #373A3D, close but not exact) | — |
| `--color-sheet` (#1a1b1f) | UNRESOLVED — ask Anik (close to bg/card #181D1F, not exact) | — |
| `--color-overlay` (rgba(0,0,0,.6)) | UNRESOLVED — ask Anik (base/black-alpha is 12%, not 60%) | — |
| `--color-amber` (#FF9900) | UNRESOLVED — ask Anik (no amber primitive in Colors collection) | — |
| `--color-dark` (#0A090B) | UNRESOLVED — ask Anik | — |
| `--color-surface-dark` (#1E2224) | UNRESOLVED — ask Anik | — |
| `--color-pink` (#FF2E93) | UNRESOLVED — ask Anik (no Figma equivalent at all) | — |
| `--color-gp-blue` (#0055A5) | UNRESOLVED — ask Anik (Gotipath partner-brand blue, may be intentionally outside the Bioscope token set) | — |
| `--color-amber-light` (#FFB03A) | UNRESOLVED — ask Anik | — |
| `--color-surface-panel` (#252a2d) | UNRESOLVED — ask Anik | — |
| `--color-error-surface` (#2A1A1A) | UNRESOLVED — ask Anik (error/tertiary #FFFBFA is a light colour, doesn't fit a dark surface use) | — |
| `--color-ink` (#1A1A1A) | UNRESOLVED — ask Anik | — |
| `--color-select-blue` (#1E40E8) | UNRESOLVED — ask Anik | — |
| `--color-select-tint` (#E7EFFF) | UNRESOLVED — ask Anik (close to primary/50 #EDF0FE, not exact) | — |
| `--color-badge-notch` (#7A7A7A) | UNRESOLVED — ask Anik | — |
| `--color-campaign-notch` (#A81155) | UNRESOLVED — ask Anik | — |
| `--color-campaign-accent` (#FF8A00) | UNRESOLVED — ask Anik | — |
| `--gradient-recommended` (4-stop navy gradient) | No Figma equivalent — bespoke gradient, keep as-is unless Anik wants it retinted | — |

### 3b. Raw hex literals in components/screens/data (excluding the out-of-scope carve-out above)

| Hex / file | New token | Confidence |
|---|---|---|
| `#2A2A2A` — `SubscribeSheet.jsx`, `DramaSheet.jsx`; lowercase `#2a2a2a` — `CategoryTabs.jsx`, `HeroCarousel.jsx` | `--color-text-invert-dark` (text/invert-dark, exact) | High |
| `#373A3D` — `SubscribeSheet.jsx` | `--color-border-dark` (border/dark, exact) | High |
| `#9DA4AE` — `SubscribeSheet.jsx` | `--color-text-quaternary` (exact) | High |
| `#D2D6DB` — `SubscribeSheet.jsx`, `PlanCard.jsx` | `--color-text-tertiary` (exact) | High |
| `#FFFFFF` — `PlanCard.jsx`, `paymentMethods.js` (non-logo usages) | `--color-base-white` (exact) | High |
| `#00DF00` — `SubscribeSheet.jsx` | UNRESOLVED — ask Anik | — |
| `#062a2a` — `PlayingBadge.jsx` | UNRESOLVED — ask Anik | — |
| `#0A090B` — `SubscribeSheet.jsx`, `PosterRail.jsx` | UNRESOLVED — ask Anik (tied to `--color-dark` above) | — |
| `#1a1a1a` — `App.jsx` body bg | UNRESOLVED — ask Anik (close to bg/page #111618, not exact) | — |
| `#1a1b1f` — `PlayerSettingsSheet.jsx`, `episode/RangeChip.jsx`, `DramaSheet.jsx` | UNRESOLVED — ask Anik (tied to `--color-sheet`) | — |
| `#1a1d22` — `BrowseScreen.jsx` | UNRESOLVED — ask Anik | — |
| `#1b1b1b` — `MicroDramaScreen.jsx` | UNRESOLVED — ask Anik | — |
| `#1e2028`, `#2a2d36`, `#2e3038`, `#33363f` — `ControlPanel.jsx` (player control-panel greys) | UNRESOLVED — ask Anik (no exact Figma match for any of the four) | — |
| `#242628` — `episode/RangeChip.jsx` | UNRESOLVED — ask Anik | — |
| `#3a2c2c` — `home/HeroTopBar.jsx` | UNRESOLVED — ask Anik | — |
| `#4085F4` — `EpisodeTransition.jsx` | UNRESOLVED — ask Anik (near primary/300 #4664F5 but not exact) | — |
| `#46ffff` — `index.css`, `DramaSheet.jsx`, `episode/EpisodeGridV2.jsx`, `episode/PlayingBadge.jsx`, `shorts/ShortsSeekbar.jsx`, `home/PosterRail.jsx` | UNRESOLVED — ask Anik (tied to `--color-brand-light`, propagates across 5 component files) | — |
| `#7A7A7A` — `PlanCard.jsx` | UNRESOLVED — ask Anik (tied to `--color-badge-notch`) | — |
| `#E11D48` — `home/PosterRail.jsx` | UNRESOLVED — ask Anik (error/primary is #FF474B, not exact) | — |
| `#FFCF60` — `home/HeroTopBar.jsx` | UNRESOLVED — ask Anik | — |
| `#facc15` — `BrowseScreen.jsx` | UNRESOLVED — ask Anik | — |
| `#fcd34d` — `PremiumChip.jsx` | UNRESOLVED — ask Anik (doesn't match either premium/linear stop) | — |
| `#ff3b5c` — `DoubleTapHeart.jsx` | UNRESOLVED — ask Anik (near error/primary #FF474B but not exact) | — |

**Total: 118 distinct hex values inventoried; 44 rows marked UNRESOLVED (27 in the `@theme` table, 17 in the component/data table). Do not resolve these by guessing — surface the list to Anik before Stage 4 runs.**

---

## 4. Font procedure

Source files (already installed, verified present):
```
~/Library/Fonts/TelenorEvolution-Light.otf
~/Library/Fonts/TelenorEvolution-Normal.otf
~/Library/Fonts/TelenorEvolution-Medium.otf
~/Library/Fonts/TelenorEvolution-Bold.otf
```
(A fifth weight, `TelenorEvolution-ExtraBoldSlanted.otf`, also exists but is not one of the four weights Figma's `w-*` variables use — do not vendor it.)

1. Install conversion tools if not present:
```bash
pip3 install fonttools brotli
```
2. Convert each OTF to WOFF2 (repeat per weight):
```bash
mkdir -p "/Users/anikroy/Desktop/Gotipath/Bioscope Prototype/src/assets/fonts"
fonttools ttLib.woff2 compress -o "/Users/anikroy/Desktop/Gotipath/Bioscope Prototype/src/assets/fonts/TelenorEvolution-Light.woff2" ~/Library/Fonts/TelenorEvolution-Light.otf
fonttools ttLib.woff2 compress -o "/Users/anikroy/Desktop/Gotipath/Bioscope Prototype/src/assets/fonts/TelenorEvolution-Normal.woff2" ~/Library/Fonts/TelenorEvolution-Normal.otf
fonttools ttLib.woff2 compress -o "/Users/anikroy/Desktop/Gotipath/Bioscope Prototype/src/assets/fonts/TelenorEvolution-Medium.woff2" ~/Library/Fonts/TelenorEvolution-Medium.otf
fonttools ttLib.woff2 compress -o "/Users/anikroy/Desktop/Gotipath/Bioscope Prototype/src/assets/fonts/TelenorEvolution-Bold.woff2" ~/Library/Fonts/TelenorEvolution-Bold.otf
```
(Equivalent alternate command if `ttLib.woff2` subcommand form isn't available in the installed fonttools version: `fonttools varLib.instancer` isn't relevant here since these are static OTFs; use `python3 -m fontTools.ttLib.woff2 compress -o OUT.woff2 IN.otf` as the fallback invocation.)

3. Add to `src/index.css` (or a new `src/tokens/fonts.css` imported before `@theme`):
```css
@font-face {
  font-family: "Telenor Evolution";
  src: url("./assets/fonts/TelenorEvolution-Light.woff2") format("woff2");
  font-weight: 300;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "Telenor Evolution";
  src: url("./assets/fonts/TelenorEvolution-Normal.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "Telenor Evolution";
  src: url("./assets/fonts/TelenorEvolution-Medium.woff2") format("woff2");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "Telenor Evolution";
  src: url("./assets/fonts/TelenorEvolution-Bold.woff2") format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```
4. Update `--font-sans` in `src/index.css` from `"Inter", system-ui, -apple-system, sans-serif` to `"Telenor Evolution", system-ui, -apple-system, sans-serif`.
5. Remove the Inter link block from `index.html` (verified present at lines 8–10):
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
```
Delete all three lines.

Weight name → numeric CSS weight (repeated from §1.4 for convenience): Light=300, Normal=400, Medium=500, Bold=700.

---

## 5. Per-stage acceptance criteria

**Stage 0 (Decisions) — already RESOLVED**, nothing to check.

**Stage 1 (Primitive layer)**
Pass: `src/tokens/primitives.css` exists and contains every §1.1–§1.4 value as a CSS custom property (37 colour + 11 spacing + 9 radius + 16 size + 16 leading + 4 weight = 93 declarations minimum). Check:
```bash
grep -c '^\s*--' "/Users/anikroy/Desktop/Gotipath/Bioscope Prototype/src/tokens/primitives.css"
```
Expect ≥ 93. Also verify no `Padding`/`Spacing` duplication: `grep -c '\-\-spacing-' src/tokens/primitives.css` should be exactly 11, not 22.

**Stage 2 (Semantic layer)**
Pass: `src/tokens/semantic.css` exists, is `@import`ed by `src/index.css`, and defines every alias listed in the plan (`--color-text-{primary,secondary,tertiary,quaternary,brand}`, `--color-bg-{page,card,card-alt,footer}`, `--color-border-*`, `--color-state-{success,error}`, `--color-premium-*`). Check:
```bash
grep -n "tokens/semantic.css" "/Users/anikroy/Desktop/Gotipath/Bioscope Prototype/src/index.css"
```
Expect one `@import` line. Also confirm no light-mode selector was added: `grep -c 'prefers-color-scheme\|data-theme' src/tokens/semantic.css` must be 0.

**Stage 3 (Type scale)**
Pass: `grep -rn 'text-\[[0-9]*px\]' src` returns zero matches (no more arbitrary pixel text sizes); `--text-*`/`--leading-*`/`--font-weight-*` are defined and consumed via Tailwind's generated `text-tn`…`text-11xl` utility classes.

**Stage 4 (Migration codemod)**
Pass: rewritten `token_pass.cjs` handles all resolved (non-UNRESOLVED) rows from §3, not just the original 6. After running it:
```bash
grep -rnoE '#[0-9a-fA-F]{3,8}' src --include='*.jsx' --include='*.js' | grep -v 'src/data/plans.js\|src/assets/payment-logos\|src/data/heroSlides.js\|src/data/homeRows.js\|ThemedBlock.jsx\|PromoBanner.jsx' | wc -l
```
Expect this count to equal exactly the number of still-UNRESOLVED hex literals from §3b (17, unless Anik has since resolved some) — every resolvable hex should be gone, only UNRESOLVED + explicitly-out-of-scope ones remain.

**Stage 5 (Per-screen sweep)**
Pass: for each of M1 → M2 → M4 → M3 (build order, see §7), the corresponding spec file's acceptance section is satisfied and a manual visual pass by Anik is done — this one is not fully automatable. Minimum automated check per screen: no console errors on load (`npm run dev`, open the screen, check devtools console manually — do not use an automated browser tool for this per project rules).

**Stage 6 (Verify)**
Pass:
```bash
grep -rE '#[0-9a-fA-F]{6}' "/Users/anikroy/Desktop/Gotipath/Bioscope Prototype/src" --include='*.jsx' --include='*.js' | grep -v 'src/index.css\|src/tokens/'
```
returns only the explicitly out-of-scope carve-out files listed in §3 (payment logos, plans.js OTT swatches, heroSlides/homeRows/ThemedBlock/PromoBanner art-direction gradients). There is **no `tsc -b` in this project** (no TypeScript, no `tsc` binary in `node_modules/.bin`) — the plan's Stage 6 line referencing `tsc -b` does not apply; use `npm run lint` (ESLint via `eslint.config.js`) instead, expect zero errors. Final step is Anik's manual visual pass — do not attempt to self-verify visually per project rules.

---

## 6. How to run

Verified from `package.json` (scripts) and `vite.config.js`:

- **Dev server:** `npm run dev` → runs `vite`. `vite.config.js` already sets `server: { port: 5181, host: true, strictPort: true }` — this already binds all interfaces (`host: true` = `0.0.0.0`), so LAN access works out of the box at `http://<mac-lan-ip>:5181`. No extra `--host` flag needed; it's baked into the config.
- **Lint / static check:** `npm run lint` → `eslint .`. This is the only static-check command that exists — there is no typecheck script (no TypeScript in this project).
- **Build:** `npm run build` → `vite build`. **Warning: do not run this while `npm run dev` may be running** — it can kill the dev server. If you need to sanity-check compile correctness without touching the running dev server, use `npm run lint` instead; it's non-destructive.
- **Preview built output:** `npm run preview` → `vite preview` (only meaningful after a build).

---

## 7. Where things live (verified via `ls`, 2026-08-30)

- Plan (context/rationale, not this file): `/Users/anikroy/Desktop/Gotipath/Bioscope Prototype/TOKEN_ADOPTION_PLAN.md`
- This spec: `/Users/anikroy/Desktop/Gotipath/Bioscope Prototype/TOKEN_ADOPTION_SPEC.md`
- Figma audit (context only — already inlined into §1 of this file, no need to re-read): `/Users/anikroy/Desktop/Gotipath/bioscope-design-system.md`
- Build order: `/Users/anikroy/Desktop/Gotipath/Bioscope Prototype/Bioscope Q4 Tasks/BUILD_ORDER.md`
- Prototype state: `/Users/anikroy/Desktop/Gotipath/Bioscope Prototype/Bioscope Q4 Tasks/PROTOTYPE_STATE.md`
- Session log: `/Users/anikroy/Desktop/Gotipath/Bioscope Prototype/Bioscope Q4 Tasks/SESSION_LOG.md`
- Stage-5 mother-task specs:
  - M1 (Play Journey): `Bioscope Q4 Tasks/specs/M1_PLAY_JOURNEY.md` (+ sub-specs `M1a_PORTRAIT_MODE.md`, `M1b_PREVIEW_PAYWALL.md`, `M1c_TRAILER_AUTOPLAY.md`, `M1d_PAYWALL_CTA.md`)
  - M2 (Pack Page Revamp): `Bioscope Q4 Tasks/specs/M2_PACK_PAGE_REVAMP.md`
  - M3 (Voucher Marketplace): `Bioscope Q4 Tasks/specs/M3_VOUCHER_MARKETPLACE.md`
  - M4 (Dynamic Discounting): `Bioscope Q4 Tasks/specs/M4_DYNAMIC_DISCOUNTING.md`
- Codemod script to rewrite in Stage 4: `/Users/anikroy/Desktop/Gotipath/Bioscope Prototype/token_pass.cjs` (currently only handles 6 of the ~118 hex values — see §5 Stage 4 for what "done" looks like)
- Token source file to edit in Stages 1–4: `/Users/anikroy/Desktop/Gotipath/Bioscope Prototype/src/index.css`
- New token files to create: `src/tokens/primitives.css`, `src/tokens/semantic.css` (directory `src/tokens/` does not exist yet — create it)
- Component directory: `src/components/` (28 flat files + subfolders `home/`, `episode/`, `shorts/`)
- Screen directory: `src/screens/` (8 files: `BrowseScreen.jsx`, `ContentDetailScreen.jsx`, `HomeScreen.jsx`, `MicroDramaScreen.jsx`, `PackCatalogueScreen.jsx`, `PlayerScreen.jsx`, `ShortsScreen.jsx`, `VoucherStorefrontScreen.jsx`)
- Data directory (contains the out-of-scope brand-colour files): `src/data/` (`plans.js`, `heroSlides.js`, `homeRows.js`, `paymentMethods.js`, `dramas.js`, others)
- Icon assets (do not touch, per §0): `src/assets/icons/`

**Note on repo state:** this is not a git repo at the parent level but `Bioscope Prototype/` itself has a `.git`. As of this audit `git status` shows substantial uncommitted work in progress (modified `App.jsx`, several components, `src/index.css`, deleted `DetailSheet.jsx`/`EpisodeSelector.jsx`, new `DramaSheet.jsx`, untracked `Bioscope Q4 Tasks/` and this plan/spec). Do not assume a clean starting tree — check `git status` before starting Stage 1.
