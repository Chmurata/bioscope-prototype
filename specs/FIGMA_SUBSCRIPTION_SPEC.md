# Figma Subscription Screen Spec — "Choose Your Plan"

Source: Figma file "Bioscope x Gotipath", page "Subscription", frame node **11781:112304**, name **"Choose Your Plan"**. Auto-layout FRAME, 360×1226, VERTICAL, gap 0, padding 0, sizingH=FIXED, sizingV=HUG. Background fill `bg/page` (#111618).

Captured via Desktop Bridge plugin (`figma_get_component_for_development_deep` was unavailable — `figma_execute` used instead to walk the live node tree, resolving `boundVariables` to variable names).

## Screenshot description (what's actually on screen)

Dark mobile screen, status bar "11:11" at top, header with Bioscope+ logo centered and a back arrow, page title "Choose Your Plan". Below it a row of 3 small feature callouts (TV/web/mobile, 100+ channels, 4K/HD). Then a "Flexiplan" custom-package card with a crown icon, description, and a white "+ Create Package" pill button. An "or" divider follows. Below that, a vertical stack of 5 subscription pack cards, each with a plan name, a corner ribbon/badge (audience targeting), duration + a data/minutes chip, strikethrough original price + current price, a short "Get access to N OTT platforms" line, and a row of OTT platform logo chips (aha, GP Play, erosnow, ADT+, Toffee, Cinemax/CVN, Bioscope, Cinematic, aha (dup?), Sony). Cards 2–5 have a footer bar with "Learn More →" and a "Save ৳X" amount, plus a 3-dot progress indicator. Bottom navbar (Home / Shorts / New / Live TV / Account) + home indicator.

## Structure, top to bottom

1. **System / Status Bar** (360×30) — black rect background, cellular/battery icon group, "11:11" time text.
2. **Header** (instance "Property 1=Logo - Middle", 360×56, HORIZONTAL, padding 4/16, gap 42, SPACE_BETWEEN/CENTER, fill #111111) — contains:
   - Play-Logo-V3.0 image (left brand mark)
   - "Bioscope-Logo-(White)-Transparent" wordmark SVG group (white, 142×24)
   - Two duplicate "trailing-icon" frames (each holding 3× circular icon buttons: attach_file, today/calendar, more_vert) — looks like leftover/duplicated header icon set, likely unused cruft (see Gaps).
   - "Logout" pill (icon + "Logout" text, `text/tertiary`)
   - "Search Icon Container" with an "Arrow Left" back-arrow instance (this is the actual back button seen in the screenshot; the header instance's own icon rows appear to be hidden/overlapping duplicates not visible in the render).
3. **Frame 1686553238** (360×1106, VERTICAL, padding 16 all sides, gap 16, sizeH=FILL/sizeV=HUG) — the scrollable content body. Bound: itemSpacing→`Spacing/sp-lg`, padding→`Padding/pd-lg`. Contains, in order:
   - **Title block** ("Frame 1686553250"→"Frame 1686553249", gap 4): "Choose Your Plan" (H1) + 3-up feature row ("just text" frame, SPACE_BETWEEN, gap 16): TV/web/mobile icon+label, TV remote icon+label, Full-HD icon+label. Labels are 10px `text/quaternary`, 2-line.
   - **Flexiplan card** ("Subscription Pack", 328×122, radius 16, fill `bg/card-light` #212628, stroke `border/dark` #373a3d 1px): crown icon (fi_17301418), "Flexiplan" title (18px bold) + "Make your custom plan in 2 simple steps" (12px), a step tracker row ("Select OTT and Duration" → line → "Pay and Subscribe", both 12px `text/tertiary`, connecting `Line 20`), and a full-width white "Create Package" primary button (296×30, radius 8, fill `base/White`, dot+plus icon, 12px medium dark text, trailing arrow). Also carries two stray/leftover elements not part of the visible design: a "Cancel" secondary button + "RECOMMENDED" pill (both appear to be hidden/overlapping debug leftovers), a toggle switch instance, and a floating "Current Device" chip — none of these render in the screenshot; flag as design-file cruft, not intended states (see Gaps).
   - **"or" divider** (Frame 1686553239): two 133×1 `border/dark` rules either side of "or" text (14px medium, `text/quaternary`).
   - **5× "Subscription Pack" cards** (component "State=Recommended" for card 1, "State=Regular" for cards 2–5), each `sizeH=FILL`, corner radius 16, listed below.

## Subscription Pack card — shared anatomy

Two states exist as components: **State=Recommended** (card 1 only) and **State=Regular** (cards 2–5).

- Outer instance: VERTICAL, gap 0, padding 0, radius 16, drop shadow (green-tinted, `rgba(72,225,126,0.2)`, blur 14, y0).
  - Recommended: fill is `GRADIENT_LINEAR` (green-tinted, not a flat card fill) — visually distinct from the flat `bg/card-light` used by Regular cards.
  - Regular: fill `bg/card-light` #212628.
- **"info" frame** (296 content width after 16px padding all sides, gap 12, VERTICAL):
  - **Header row** ("2"): plan name TEXT, 18px Bold (`Size/text-lg`/`weight/w-bold`), `text/primary` white. Overlaid top-right: a **"Badge/GP Users" instance** (audience targeting ribbon) — white pill, `Change text` component-property drives the copy (values seen: "Recommended for All", "Best for GP Users", "Only for Skitto Users", "For GP + Skitto Users"), plus small circular network-logo swatches (image fills) and boolean props for GP Logo/GP Tail/Skitto‑Lead/Skitto‑Tail that presumably swap logos per plan (all false in observed instances — logos come from the two `image` rectangle fills instead). Text: 9px Medium, `text/invert-light` (#25323d) on white.
  - **Duration + price row** ("info", SPACE_BETWEEN):
    - Left: clock-circle icon (14×14, stroke `text/tertiary`) + duration text (14px, `text/tertiary`, e.g. "1 Week", "1 Month", "3 Months", "6 Months", "1 Year") + a gradient **"Text Badge" instance** (component "Size=M, Position=Top") showing a secondary detail via its `Rename Badge` text prop — 10px Medium `text/invert-light` on a gradient chip (values: "5 GB Internet", "30 Min + 100 SMS", nothing for cards 3–5 in this row per screenshot but present as instance).
    - Right: **Price Container** (strikethrough original price, small, `text/quaternary` #9da4ae, ৳ symbol 10px + amount 14px Light, struck through by a `Line 19` vector) directly followed by **Price** (current price, ৳ symbol 18px Bold + amount 18px Bold, both `base/White`, `Size/text-lg`/`weight/w-bold`).
  - **Access line + OTT row** ("Frame 1686553291", gap 8): "Get access to N OTT platforms" (12px `text/primary`, note the source text literally has a double trailing space and "platformes" typo — see Gaps), then a horizontal row of exactly **10 "OTT Icon" instances** (component "Status=Active, Size=M", 26×26, radius 4, stroke `base/white-alpha` 16%) — each wraps one "OTT Platforms" instance (logo). Card 5 label reads "Get access to 16 OTT platformes" but the icon row still only renders 10 chips — the extra 6 platforms are not represented (see Gaps).
- **Footer bar** ("Frame 1686553245", 328×32, fixed width, radius bottom-only 16, fill differs by state — Recommended card's footer is `bg/card-light` #212628, Regular cards' footer is `bg/card-lighter` #282d2e): left "Learn More" (12px `text/tertiary`) + chevron icon; right-aligned "Save ৳X" (12px, `text/brand` #00bbff). Directly below the footer, still inside the "info"/card group, a **3-dot progress/rating indicator** ("Frame 1686553248"): three 10×2 pill rects, first filled `text/brand` blue, remaining two `bg/card-lightest` #2e3334 — purpose unclear (see Gaps).

## Card-by-card content (top to bottom)

| # | Name | Badge copy | Duration | Chip | Was / Now price | Access | Save |
|---|---|---|---|---|---|---|---|
| 1 | Flexiplan (custom, not a pack) | — | — | — | — | — | — |
| 2 | Standard (State=Recommended) | "Recommended for All" | 1 Week | 5 GB Internet | ৳149 → ৳99 | Get access to 10 OTT platforms | ৳50 |
| 3 | Duo Binge + GP User Plan with Minutes | "Best for GP Users" | 1 Month | 30 Min + 100 SMS | ৳299 → ৳179 | 10 OTT platforms | ৳120 |
| 4 | Family + 5GB Internet | "Only for Skitto Users" | 3 Months | (none rendered) | ৳349 → ৳229 | 10 OTT platforms | ৳120 (repeated value in tree, likely stale) |
| 5 | GP Star Pack | "For GP + Skitto Users" | 6 Months | (none rendered) | ৳599 → ৳349 | 10 OTT platforms | ৳250 |
| 6 | Family Entertainment | (badge present, text not confirmed in this pass) | 1 Year | (none rendered) | ৳799 → ৳449 | 16 OTT platforms (icon row still shows 10) | ৳350 |

## Icons / imagery

- Flexiplan crown: `fi_17301418` — flat multi-vector icon (yellow/orange crown), not a component instance, decorative only.
- Clock-circle: `Linear / Time / Clock Circle` instance, stroke-only, `text/tertiary`.
- OTT platform chips: `OTT Icon` (component "Status=Active, Size=M") wrapping an "OTT Platforms" instance per logo — reused 10× per card, always the same fixed set/order across all 5 cards (aha, GP Play triangle, erosnow, ADT+/AAF, Toffee, Cinemax/CVN, Bioscope "C", aha (again), Sony LIV) per the screenshot.
- Learn More chevron: `Outline / Arrows / Alt Arrow Right`.
- Create Package button: dot instance (`Misc / Dot`, green #01a63e) + `gear-filled` icon (unclear why a settings gear appears on a "create package" CTA — possibly a copy/paste leftover from a generic secondary-button component).
- Primary CTA "Create Package": `Misc / Dot` (red #a8153a? — bound to `Icon Colors/button-icon-light`, renders as decorative dot not visible as red in screenshot, likely masked) + "Plus" icon + `Outline / Arrows / Arrow Right`.
- Bottom navbar icons: Home, Shorts, Fire ("New"), Live TV, User ("Account") — all `text/secondary` (#e5e7eb), 10px labels.

## Variables referenced (token names)

Colour: `bg/page`, `bg/card-light`, `bg/card-lighter`, `bg/card-lightest`, `border/dark`, `border/tsp-dark`, `base/White`, `base/white-alpha`, `text/primary`, `text/secondary`, `text/tertiary`, `text/quaternary`, `text/brand`, `text/invert-light`, `text/invert-dark`, `Icon Colors/button-icon-light`, `Color Components/Icons & Text/text-icon-primary`.
Spacing/padding: `Spacing/sp-0`, `sp-tn`, `sp-xs`, `sp-sm`, `sp-md`, `sp-lg`, `sp-mc`, `Padding/pd-0`, `pd-tn`, `pd-xs`, `pd-sm`, `pd-md`, `pd-lg`, `pd-mc`.
Radius: `Corner Radius/radius-default`, `radius-sm`, `radius-md`, `radius-2xl`, `radius-full`, `radius-na`.
Type: `Size/text-xs`, `text-sm`, `text-lg`, `text-xl`, `size/s-tn`, `s-xs`, `s-sm`, `weight/w-regular`, `w-normal`, `w-medium`, `w-bold`, `w-light`, `family/label`, `line-hight/lh-xs`, `lh-sm`, `lh-lg`, `lh-xl`, `lh-tn`, `lh-2xl`.
Sizing: `Neumerics/nm-6`, `nm-8`, `Button Size/button-icon-2x-small`, `button-icon-medium`.

Two font families are mixed on this one screen: **Inter** (status bar time, a stray body-copy TEXT node inside the Flexiplan card, price ৳ glyph in one place) and **"Telenor Evolution"** (everything else — headings, labels, prices, buttons). Confirm with Anik whether Inter usage is intentional or leftover from a template.

## Explicit gaps / oddities (not shown or unclear)

- **No empty/error/loading state** for the pack list — nothing indicates what renders while packs are fetching or if none are available.
- **No selected/active state** visible on any card — every card looks like a static list item; there's no visual treatment for "currently subscribed to this plan" or a tap/pressed state.
- **Card 1 ("Standard") is the only "State=Recommended" instance** — the other 4 are "State=Regular", so only two variants exist even though 4 different audience badges are shown; the recommended treatment (gradient fill + green shadow) is not tied to badge copy.
- **Header contains duplicated/hidden icon clusters** (two "trailing-icon" frames with attach_file/calendar/more_vert, each rendered twice) that don't appear in the screenshot — likely stale layers, not real header content. Actual back button comes from a separate "Search Icon Container → Arrow Left" instance.
- **Flexiplan card contains a hidden "Cancel" button + "RECOMMENDED" pill + toggle switch + "Current Device" chip** — none visible in the render; these read as leftover/duplicated elements from another component, not intentional design.
- **Card body copy has a typo** ("10 OTT platformes") and inconsistent counts (card 6 claims "16 OTT platformes" but only 10 icon chips are laid out — the OTT icon row doesn't scale with the stated count).
- **"Save ৳X" amounts don't all reconcile** with the shown before/after price deltas exactly the same way across cards (worth a numbers check before build) — flagging for Anik rather than asserting a fix.
- **3-dot indicator under each footer** has no visible label or legend — its meaning (progress? rating? step?) isn't discoverable from the design alone.
- **Two font families mixed** (Inter + Telenor Evolution) on one screen — likely unintentional.
- Badge component (`Badge/GP Users`) has boolean props for GP/Skitto logos that are all `false` in every instance seen — the logos on screen come from two generic `image` rectangle fills instead, so the "real" logo-swap mechanism this component was built for isn't actually being used.
