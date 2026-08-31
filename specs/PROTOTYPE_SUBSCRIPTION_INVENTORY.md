# Subscription / Pack-Selection Experience — Prototype Inventory

Source of truth for comparing the existing clickthrough prototype against a Figma design. Covers every screen and component in the pack-selection → checkout → payment → success path. All file paths relative to `Bioscope Prototype/`.

---

## 1. Components

### `src/screens/PackCatalogueScreen.jsx`
Full-screen pack browser (M2 "Pack page revamp"). Reached as its own route, not a sheet.

**Structure (top to bottom):**
1. Header — back arrow, "Select Your Pack" title, "Unlock premium entertainment" subtitle.
2. Sticky filter bar — two horizontally-scrolling pill rows: validity (`All, 1 Day, 7 Days, 28 Days, 90 Days, 365 Days`) and platform (`All, bioscope→"Bioscope+", hoichoi, chorki, Combo, Data+OTT`).
3. Hoisted "Most Popular" section — the single `recommended` pack pulled out of the list and shown first under a Crown-icon label.
4. Filtered pack list — `PackCard` per match; recommended pack excluded from this list (filter: `if (p.recommended) return false`).
5. Empty state — search-emoji icon, "No packs match these filters", "Try selecting a different validity or platform.", Clear Filters button.
6. Inert Flexiplan card — "Make your custom plan in 2 simple steps", "+ Create Package" button is `cursor-default opacity-80` (dead, no handler).
7. Footer — "Compare all packs" link opens `PackComparisonSheet`; VAT/auto-renewal microcopy.

**State:** `selectedValidity`, `selectedPlatform`, `showComparison`. **Props:** none (screen-level, reads `packs` data directly).
**Selection:** tapping a card calls `setPaywallContext({ origin: 'generic', content: null, initialPackId: packId })` — routes into `PaywallSheet` at the `sub-checkout` stage, skipping the pack-list stage.

### `src/components/PackCard.jsx`
The pack card, used in both `PackCatalogueScreen` and `PaywallSheet`'s `packs` stage.

**Props:** `pack`, `onSelect(packId)`.
**Structure:** badges row → title → duration+telco-value row → coverage text → OTT logo strip → price/payment/CTA footer (pinned via `mt-auto`).
**Variants:**
- Default: `bg-bg-card-light`, `ring-1 ring-base-white/10`.
- Recommended (`pack.recommended`): `bg-[image:var(--gradient-recommended)]` gradient fill; CTA is `bg-amber text-black` "Select Best Value" vs `bg-base-white text-black` "Select Pack".
- Campaign-active: `ring-2 ring-pink` regardless of recommended state.
- Ineligible (`pack.eligible === false`): CTA area replaced with a disabled-look row — `bg-base-white/5 ring-1 ring-base-white/10`, "Requirement not met" — no button, no handler (matches the "ineligible packs shown, not hidden" decision in SESSION_LOG.md).

**Badges:** static text badge (`pack.badge`, e.g. "Recommended for All", "Best for GP Users", "Only for Skitto Users", "Best Value") shown only when no campaign is active; campaign badge is mutually exclusive with the static badge and has 3 icon variants (Timer/Clock/Flame for timer/window/other campaigns).

**Price block:** strikethrough `struckPrice` (campaign→original price, else `pack.originalPrice`) + live `displayPrice` (`pack.price - campaign.discount` if a campaign applies) + `priceUnit` suffix (e.g. "/ 28 days"). Price turns pink when a campaign is active.

**Pay-with row:** small grayscale/inverted icon chips for `pack.payWith` methods (balance shows as text "Mobile Balance", others as logos), `mix-blend-screen` styling.

**Dynamic/interactive behavior not visible in a static design:**
- Countdown timer (line 29-48): `timeLeft` recomputed every second via `setInterval`, formatted `MM:SS`, shown inline after the campaign label for `type: 'timer'` campaigns.
- Window campaigns have 3 live states — `upcoming` ("Starts <time>"), `active` (discount applies, "<label> • ends <time>"), `ended` ("<label> ended", badge stays but discount stops applying, and badge dims from full pink/gradient to a plain ring style). This upcoming/active/ended state machine is a whole discounting product decision (SESSION_LOG.md R6), not something a static comp would encode.

### `src/components/PlanCard.jsx`
Simpler card used only by `SubscribeSheet`'s legacy 5-stage plan flow (separate from `PackCard`/pack catalogue — two parallel, not-yet-unified card systems).

**Props:** `plan`, `selected`, `onSelect(planId)`.
**Two visual variants:** `primary` (navy gradient fill, e.g. Bioscope+ Super) and `neutral` (flat dark grey card, e.g. Bioscope+ Bangla/Weekly) — driven by `plan.variant`.
**Selected state:** cyan ring + glow shadow, no radio control — "selection is carried by the card ring" (code comment, line 8).
**Structure:** optional folded-ribbon badge (absolutely positioned pill + clip-path triangle tail) → title → duration+price row → subtitle → up to 3 poster thumbnails → OTT logo strip.
No strikethrough/discount on the card itself; the discount only appears later in checkout.

### `src/components/PaywallSheet.jsx`
The primary, most-complete flow — a single component covering 12 stages via one `stage` state string: `prompt → packs → rent-checkout | sub-checkout → payment → carrier-1 → carrier-2 → carrier-failed → processing → success`.

**Props:** `origin` ('generic' | 'preview-end' | 'trailer-end' | 'locked-tap'), `content`, `initialPackId`, `onClose`.
**Framing copy by origin** (`FRAMING` map, line 10-15): "You've watched the free preview" / "Trailer finished; the content is paywalled" / "Unlock to start watching" / "Choose Your Plan".

**Stages:**
1. `prompt` — Subscribe / Rent (if `content.rentPrice`) / "See all packs" link.
2. `packs` — pack list sorted recommended-first (`displayPacks`).
3. `rent-checkout` — rental terms card ("Access to this title for 48 hours...") + payment-method preview row + sticky amount/Proceed.
4. `sub-checkout` — pack summary card, auto-renew toggle, `PaymentMethodList`, collapsible Discount/coupon expander, sticky subtotal/discount/amount-payable breakdown, Continue to Payment.
5. `payment` — full `PaymentMethodList` (light theme), sticky Pay button.
6. `carrier-1/2/failed` — GP mobile-balance flow: phone number entry → OTP + monthly/yearly spend-limit disclosure → success or one of two failure states.
7. `processing` — spinner, 1400ms fake latency.
8. `success` — check icon, copy branches on rent vs. subscribe, CTA "Browse Home" (generic origin) vs "Start Watching".

**Interaction/logic not visible in a static design:**
- Live coupon engine: `VALID50` (-৳50), `EXPIRED`, `NOT_ELIGIBLE`, anything else → "Invalid coupon code." (lines 193-207).
- Coupon vs. campaign are mutually exclusive and both compute a real subtotal/discount/payable breakdown (lines 174-191).
- Mid-checkout campaign-expiry watcher: if a timer campaign expires while the user is sitting on `sub-checkout`, a pink toast slides in — "Offer expired. The price has been updated." — and price recalculates live (lines 44-52, `nowTick` state ticking every second specifically so this isn't a stale `Date.now()` read).
- `allowedMethods` is derived per-pack from `pack.payWith`, further filtered by `carrierKnown` (mobile balance hidden entirely if the carrier can't be determined) — lines 168-172.
- Two distinct carrier decline demo triggers: `1799999999` → hard "spending limit reached" (no retry, must choose another method) vs `1788888888` → ordinary "payment declined" (retryable) — lines 119-135, with different button sets per failure kind (lines 665-673).
- OTP `0000` → inline "Incorrect OTP entered" error, no stage change.
- Bottom sheet spring physics (`framer-motion`, `damping: 34, stiffness: 320`), backdrop blur, sheet height flexes (`85%` compact stages vs `95%` deep stages).

### `src/components/SubscribeSheet.jsx`
Older, parallel 5-stage subscribe flow (`plans → checkout → payment → processing → success`) built around `PlanCard`/`PLANS`, not `PackCard`/`packs`. Per SESSION_LOG.md this was the Task D handoff, "reworked, not reused as-is" — i.e. it's legacy/reference, not the live catalogue-driven path.

**Notable:** tap-to-advance plan selection (no confirm button — selecting commits and routes straight to checkout, line 27-28 comment); Flexiplan hero card with dead "+Create Package" button; success stage has a spring pop-in badge with a looping pulsing ring (`animate: scale [1,1.5], opacity [0.6,0], repeat: Infinity`) and a static perks checklist (Ad-free playback / Full HD + multi-audio / Offline downloads) — this checklist and its icon are hardcoded, not data-driven.
**Bug of note:** checkout stage always shows a strikethrough at `Math.round(price * 1.5)` (line 202) — a fabricated "was" price with no backing data, unlike `PaywallSheet` which uses a real `originalPrice` field.

### `src/components/PaymentMethodList.jsx`
Shared payment-method radio list, light or dark themed.
**Props:** `value`, `onChange`, `allowedMethods` (optional filter), `theme` ('light' default | 'dark').
First method in the (filtered) list is always visually "highlighted" (primary/bKash-style treatment) regardless of which one is actually `value`-selected — a fixed "primary" position, not selection-driven.
**Known duplication issue** (see §4): this component's UI logic is partially re-implemented inline inside `PaywallSheet`'s `rent-checkout` and `carrier-*` stages rather than reused.

### `src/components/PackComparisonSheet.jsx`
Feature-comparison table sheet, launched from the catalogue footer.
**Props:** `open`, `onClose`. Filters out ineligible packs (`p.eligible !== false`) — comparison table only ever shows purchasable packs.
Rows: Price, Duration, Telco Value, Bioscope+/Hoichoi/Chorki/SonyLIV check-or-X, Unlocks, Pay With. Sticky first column, horizontal scroll for many packs, recommended pack's header cell tinted amber.

---

## 2. Data model (`src/data/packs.js`, `src/data/plans.js`)

12 packs, fields: `id, title, badge, duration, durationDays, kind, telcoValue, price, originalPrice, priceUnit, providers[], payWith[], eligible, recommended, coverage, unlocks[]`. One pack (`family-5gb`) is `eligible: false` for testing the disabled state; one (`standard`) is `recommended: true`.
`PLANS` (legacy, plans.js): 3 entries (`super` primary/recommended, `bangla` neutral, `weekly` neutral/"Best for New Users"), each with poster thumbnails sourced from `dramas` data and an `ottBrands` list rendered through a hand-built brand-tile palette (`OTT_BRANDS`) since no PNG logos were available.

---

## 3. Hardcoded copy strings (representative, not exhaustive)

- "Select Your Pack" / "Unlock premium entertainment" (PackCatalogueScreen)
- "No packs match these filters" / "Try selecting a different validity or platform."
- "Make your custom plan in 2 simple steps" / "Choose your preferred data, voice, and OTTs." / "+ Create Package"
- "Prices are inclusive of 15% VAT.\nAuto-renewal can be managed anytime from My Subscriptions."
- FRAMING map: "You've watched the free preview" / "Trailer finished; the content is paywalled" / "Unlock to start watching" / "Choose Your Plan"
- "Access to this title for 48 hours. The rental period starts when you first press play."
- "Offer expired. The price has been updated."
- "This coupon code has expired." / "This coupon is not valid for the selected pack." / "Invalid coupon code."
- "By continuing you are agreeing to Bioscope+'s Terms of Use and Refund Policy"
- "I acknowledge and accept that charges for {duration} will be made to my mobile balance."
- "Enter a valid 11-digit Bangladeshi mobile number, e.g. 01711092617"
- "Spending limit reached" / "You have used your monthly mobile balance limit. It resets next month — until then, please pay another way."
- "Payment declined" / "Your operator could not complete this charge. You can try again, or pay another way."
- "Payment successful. It may take a moment to reflect on your account. please be patient." (SubscribeSheet has a typo-cased "please")
- "You're Premium!" / "All microdramas unlocked — ad-free, HD, downloadable."
- Comparison sheet footer: "Comparison is for illustrative purposes. Actual limits may vary based on publisher terms and device capability."

---

## 4. Improvements the prototype has that likely aren't in a static Figma design

Verified in code, not speculative:

1. **Window-campaign 3-state lifecycle** (`PackCard.jsx` lines 22-27, 74-84) — upcoming/active/ended badge + discount states, so a scheduled offer degrades gracefully instead of just vanishing or showing a stale price. A static frame can show one state at a time; this is a real rule ("discount only applies while active, badge still communicates status outside the window").
2. **Live mid-checkout expiry handling** (`PaywallSheet.jsx` lines 44-52, `nowTick` ticked every second) — if a timer campaign expires while the user is on the checkout screen, price recalculates and a toast explains why, instead of silently charging the old price or leaving a stale total. Directly prevents a real billing-trust bug.
3. **Ineligible packs shown with reason, not hidden** (`PackCard.jsx` lines 144-155; decision recorded in SESSION_LOG.md) — "Requirement not met" instead of removing the card, so catalogues don't silently differ user to user (auditable, avoids "why did my friend see a pack I didn't" support tickets).
4. **Payment-method allowlist derived from pack + carrier state** (`PaywallSheet.jsx` lines 168-172) — mobile-balance option only offered when `pack.payWith` includes it AND the carrier is actually known; a static design typically shows one fixed payment list.
5. **Two distinct, differently-recoverable carrier failure paths** (`PaywallSheet.jsx` lines 119-135, 642-677) — hard-stop "spending limit reached" (no retry CTA, must switch method) vs. retryable "payment declined" (Try again + Choose another). Different button sets per failure kind is a real edge-case UX decision, not a generic error screen.
5b. **Real coupon-code validation with distinct failure copy** (lines 193-207) — expired vs. not-eligible vs. invalid all get different messages, and a valid coupon vs. active campaign are mutually exclusive with a proper subtotal/discount/payable breakdown, rather than a single generic "invalid code" state.
6. **Trailer-end paywall fires once per title per session, no countdown, holds last frame** (documented decision in SESSION_LOG.md, driven by `ContentDetailScreen`/player logic) — avoids re-interrupting a user who already saw the paywall, and avoids a fake countdown that doesn't match actual asset length ("Free preview" label instead of a lying minute count).

Additional smaller ones worth noting: inline field validation on the mobile-number entry (regex `^1[3-9]\d{8}$`, live error text) instead of only failing on submit; OTP `0000` demo path exercises a real inline-error state without changing stage.

---

## 5. Known issues / incomplete (from SESSION_LOG.md, PROTOTYPE_STATE.md, and direct code reading)

- **`PaymentMethodList.jsx` and the payment UI inside `PaywallSheet.jsx` are two components doing one job** — explicitly flagged as open in SESSION_LOG.md; the `rent-checkout` and `carrier-*` stages in `PaywallSheet.jsx` hand-roll their own payment-preview rows instead of reusing `PaymentMethodList`.
- **`isVip` is write-only** (PROTOTYPE_STATE.md) — `SubscribeSheet.handlePay()` sets it but nothing reads it: episode locking (`EpisodeGridV2.jsx`) ignores it, ads render unconditionally, `PremiumChip` still shows post-purchase, nothing persists across reload.
- **`PackCard` and `PlanCard` are two unreconciled card systems** — the catalogue/paywall path uses `PackCard`+`packs.js`; the older `SubscribeSheet` uses `PlanCard`+`plans.js`. No shared data model or visual language between them (e.g. `PlanCard` has no discount/strikethrough at all, `PackCard` does).
- **`SubscribeSheet`'s checkout strikethrough price is fabricated** (`Math.round(selectedPlan.price * 1.5)`, line 202) — not backed by any `originalPrice` field, inconsistent with how `PaywallSheet`/`PackCard` compute discounts.
- **Payment is entirely faked**: both sheets use a 1400ms `setTimeout` with no validation, no card/OTP branching by `paymentId` (PROTOTYPE_STATE.md).
- **Flexiplan "Create Package" CTA is dead** in both `PackCatalogueScreen` (`cursor-default opacity-80`, no handler) and `SubscribeSheet` (no onClick at all).
- **Token adoption incomplete** — subscription flow still uses untokenized raw hex (`#00BBFF`, `#00DF00`, `#212628`, `#1E2224` per PROTOTYPE_STATE.md), so colors in the prototype may not match a token-driven Figma file 1:1.
- Historical defects already fixed this session (context only, not currently open): R2 payment list previously ignored `pack.payWith`; R3 wrong paywall origin; R6 window campaigns previously had no upcoming/active/ended states; PackCatalogue previously double-mounted.
- General: "Most screens likely need a design revision pass — they have been reviewed for correctness, not for craft" (SESSION_LOG.md closing note) — visual/craft parity with Figma should not be assumed even where logic is solid.
