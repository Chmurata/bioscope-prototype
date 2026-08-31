# Bioscope Token Decisions — the 44 unresolved rows

Source: `TOKEN_ADOPTION_SPEC.md` §3 (44 rows marked `UNRESOLVED — ask Anik`), cross-checked against `bioscope-design-system.md` (37-colour Figma "Colors" collection, Dark Mode). Evidence gathered fresh via `grep -rn` on `src/` (2026-08-30) and CIEDE2000 computed by hand (no library) between each item's Lab value and all 37 Figma primitives.

## How to use this

Five buckets. **A, C, E are mechanical — no reply needed**, agy can execute them directly (rename to nearest Figma token / merge / delete). **Only B and D need your call** — jump to "DECISIONS NEEDED" at the bottom, 12 questions, yes/no or A-or-B.

- **A — Adopt nearest** (ΔE ≤ 3): rename straight to the Figma token, no visible change.
- **B — Extension token**: partner-brand or campaign colour Figma doesn't cover by design. Namespace as `--color-ext-*`.
- **C — Drift, merge** (ΔE 3–10): collapse into nearest Figma token, small but real visible shift.
- **D — Genuine gap** (ΔE > 10, meaningfully used, not a partner colour): design system is missing something — recommend adding to Figma.
- **E — Delete**: unused or a redundant one-off duplicate.

---

## Bucket A — Adopt nearest (7 items)

| Token/hex | Usage | Files | Nearest Figma token | ΔE2000 | Recommendation |
|---|---|---|---|---|---|
| `--color-dark` `#0A090B` | 33× (31 class + 2 raw) | App.jsx, HomeScreen, MicroDramaScreen, ContentDetailScreen, VoucherStorefrontScreen, PackCatalogueScreen, MySubscriptionsSheet, PaywallSheet, SubscribeSheet, PackComparisonSheet, VoucherPurchaseSheet, OwnedVoucherDetailSheet, ContentLabel, home/CircleRail, PosterRail | `base/Black` `#000000` | 1.81 | Rename `--color-dark` → alias `base/Black`. |
| `--color-surface-dark` `#1E2224` | 30× | VoucherStorefrontScreen, PackCatalogueScreen, MySubscriptionsSheet, OwnedVoucherDetailSheet, PlanCard, PaywallSheet, SubscribeSheet, PackComparisonSheet, PackCard, VoucherPurchaseSheet, home/MicroDramaRail, home/SectionHeader, home/OTTPlatformsBlock, home/PosterRail, episode/EpisodeGridV2 | `bg/card-light` `#212628` | 1.33 | Rename → alias `bg/card-light`. |
| `--color-surface-panel` `#252a2d` | 2× | PackComparisonSheet.jsx (sticky table header/cell) | `bg/card-light` `#212628` | 1.47 | Rename → alias `bg/card-light` (same as surface-dark — consider merging both into one alias). |
| `--color-select-tint` `#E7EFFF` | 1× | PaymentMethodList.jsx | `primary/50` `#EDF0FE` | 2.19 | Rename → alias `primary/50`. |
| `#1a1d22` | 1× | BrowseScreen.jsx (list-item card bg) | `bg/card` `#181D1F` | 2.92 | Replace literal with `bg-card`. |
| `#242628` | 1× | episode/RangeChip.jsx (dropdown menu bg) | `bg/card-light` `#212628` | 1.85 | Replace literal with `bg-card-light`. |
| `#FFCF60` | 1× | home/HeroTopBar.jsx (subscribe-CTA pill) | `premium/linear-2` `#FFD160` | 0.77 | Near-exact — replace literal with `premium-linear-2`. |

---

## Bucket B — Extension token (5 items, needs your call — see below)

| Token/hex | Usage | Files | Why Figma can't cover it |
|---|---|---|---|
| `--color-gp-blue` `#0055A5` | 10× | PaywallSheet.jsx (Grameenphone carrier-billing/OTP flow) | Third-party telco partner brand blue (Grameenphone), not a Bioscope UI colour. |
| `--color-pink` `#FF2E93` | 12× | PaywallSheet.jsx (coupon UI), PackCard.jsx (campaign ring/gradient) | Bioscope's own promo/campaign accent, not a core UI semantic colour — Figma's Colors collection has no campaign family. |
| `--color-campaign-accent` `#FF8A00` | 1× | PackCard.jsx (campaign badge gradient, paired with pink) | Same campaign family as `--color-pink` above. |
| `--gradient-recommended` (4-stop navy) | 1× | PackCard.jsx (`bg-[image:var(--gradient-recommended)]`, "Recommended" pack card) | Bespoke per-component gradient; Figma's Colors collection has zero background-gradient primitives (only the Premium linear-1→2 ramp exists as a style, not a variable). |
| `#3a2c2c` | 1× | home/HeroTopBar.jsx (`tint` prop default) | Per-content hero-tint fallback — same category as the already-out-of-scope `heroSlides.tint` art-direction field. |

---

## Bucket C — Drift, merge (14 items)

| Token/hex | Usage | Files | Nearest Figma token | ΔE2000 | Recommendation |
|---|---|---|---|---|---|
| `--color-text-secondary` `#bfbfbf` | 5× | BrowseScreen, GenreFilter, EpisodeTransition, DramaSheet, episode/RangeChip | `text/tertiary` `#D2D6DB` | 6.21 | Merge into `text/tertiary`. **Name collision**: Figma's own `text/secondary` is `#E5E7EB`, a different hex — do not just rename to `text-secondary`, that would silently swap in the wrong colour. Rename to `--color-text-tertiary`. |
| `--color-text-dim` `#555555` | 3× | BrowseScreen, EpisodeTransition, DramaSheet | `border/dark` `#373A3D` | 9.51 | Nearest match is a border token, not a text token — semantically odd. Merge anyway (low-visibility use, 3 spots) or confirm `text/quaternary` is preferred despite slightly larger ΔE. |
| `--color-sheet` `#1a1b1f` | 3× (raw hex; token itself unused) | PlayerSettingsSheet, episode/RangeChip, DramaSheet | `bg/card` `#181D1F` | 3.42 | Merge into `bg/card`, replace literals. Barely-there shift. |
| `--color-ink` `#1A1A1A` | 2× | PaymentMethodList.jsx (light-theme payment sheet text) | `bg/card` `#181D1F` | 3.22 | Merge into `bg/card`. Note: this file implements a light-theme payment sheet, which conflicts with the spec's "no light mode" rule — flag separately, not a pure token issue. |
| `--color-select-blue` `#1E40E8` | 2× | PaymentMethodList.jsx | `primary/400` `#3146AC` | 7.77 | Merge into `primary/400`. |
| `#1a1a1a` | 1× | App.jsx (loading-state body bg) | `bg/card` `#181D1F` | 3.22 | Replace literal with `bg-card`. |
| `#1b1b1b` | 1× | MicroDramaScreen.jsx (sticky header bg) | `bg/card` `#181D1F` | 3.17 | Replace literal with `bg-card`. |
| `#1e2028` | 1× | ControlPanel.jsx (debug panel bg) | `bg/card` `#181D1F` | 5.35 | Merge. |
| `#2a2d36` | 1× | ControlPanel.jsx | `text/invert-light` `#25323D` | 4.82 | Merge (odd semantic match — it's a background use, not text). |
| `#2e3038` | 1× | ControlPanel.jsx | `border/dark` `#373A3D` | 4.67 | Merge. |
| `#33363f` | 1× | ControlPanel.jsx | `border/dark` `#373A3D` | 3.99 | Merge. All 4 ControlPanel greys read like a debug/dev settings panel — confirm this screen ships to production before spending migration effort here. |
| `#4085F4` | 1× | EpisodeTransition.jsx (SVG spinner stroke) | `primary/200` `#657EF7` | 6.44 | Merge into `primary/200`. |
| `#ff3b5c` | 2× | DoubleTapHeart.jsx (like-heart micro-interaction) | `error/primary` `#FF474B` | 5.97 | Merge into `error/primary` — but flag: this reuses the app's error-red for a "like" heart, two very different meanings sharing one hue. Confirm that's acceptable. |
| `#00DF00` | 2× | SubscribeSheet.jsx (confirmation checkmark) | `premium/badge` `#1CC749` | 8.00 | Merge into `premium/badge`, though `success/primary` `#16B364` is the more semantically obvious green for a checkmark — pick one. |

---

## Bucket D — Genuine gap (8 items, needs your call — see below)

| Token/hex | Usage | Files | Nearest Figma token | ΔE2000 | Role |
|---|---|---|---|---|---|
| `--color-brand-light` `#46ffff` | 7× across 6 files | index.css, DramaSheet (`ACCENT` const), episode/EpisodeGridV2 (×2), episode/PlayingBadge, shorts/ShortsSeekbar, home/PosterRail | `success/tertiary` `#DAFFE8` | 17.93 | Consistent "electric teal" active/progress-fill accent (episode progress bars, playing-badge ring, seekbar). No teal primitive anywhere in Figma. |
| `#062a2a` | 2× | episode/PlayingBadge.jsx (text + dot bg) | `bg/footer` `#121818` | 10.68 | Dark-teal companion to `--color-brand-light` above — same "Now Playing" badge, same gap. |
| `--color-badge-completed` `#2b9c9c` | 1× | DramaSheet.jsx ("Completed" status badge) | `text/brand` `#00BBFF` | 22.07 | Status-badge system, paired with badge-ongoing below. |
| `--color-badge-ongoing` `#b39331` | 1× | DramaSheet.jsx ("Ongoing" status badge) | `premium/linear-2` `#FFD160` | 17.61 | Same status-badge system. |
| `--color-text-muted` `#808080` | 20× (widest usage of all 44) | BrowseScreen, ShortsScreen, PlayerScreen, BottomNavbar, PlayerSettingsSheet, DramaCard, EpisodeTransition, DramaSheet, ControlPanel | `text/quaternary` `#9DA4AE` | 12.98 | Core tertiary/quaternary text tier, used everywhere. Flat neutral grey vs. Figma's cooler blue-grey. |
| `--color-amber` `#FF9900` | 10× | PackCatalogueScreen, LongFormPlayer, MySubscriptionsSheet, PaywallSheet, PackComparisonSheet, PackCard, VoucherPurchaseSheet | `premium/linear-2` `#FFD160` | 17.17 | Premium/rental/preview labels + crown icons — same functional slot as Figma's premium ramp, but flat orange vs. warm gold. |
| `--color-error-surface` `#2A1A1A` | 1× | OwnedVoucherDetailSheet.jsx (error-state card bg) | `text/invert-dark` `#2A2A2A` | 10.39 | Dark error-surface. Figma's `error/*` family is light-only (`#FFFBFA`/`#FECDCA`) — no dark-mode error surface exists at all. |
| `#E11D48` | 1× in-scope (`home/PosterRail.jsx`; 4 more hits are in `plans.js`, out-of-scope OTT swatches, excluded) | home/PosterRail.jsx (ribbon/badge) | `error/primary` `#FF474B` | 10.84 | Borderline — content ribbon red, only just over the ΔE10 line. |

---

## Bucket E — Delete (10 items)

| Token/hex | Usage | Files | Reason |
|---|---|---|---|
| `--color-surface` `#1a1d2e` | 0 real | The one grep hit in PaymentMethodList.jsx references `var(--color-surface-raised)` — a **different, undefined** token name, not this one. `--color-surface` is dead. **Separately flag**: `--color-surface-raised` is a broken reference and needs fixing regardless of this decision. |
| `--color-card-hover` `#2e3338` | 0 | Never referenced as a class or literal anywhere. |
| `--color-border` `#2e3338` | 0 | Never referenced. Identical hex to `--color-card-hover` above — duplicate dead token. |
| `--color-brand-mid` `#31b3b3` | 0 | Never referenced. |
| `--color-amber-light` `#FFB03A` | 0 | Never referenced. |
| `--color-campaign-notch` `#A81155` | 0 | Never referenced. |
| `--color-overlay` `rgba(0,0,0,.6)` | 0 | Never referenced as a class. (Five unrelated `rgba(0,0,0,0.6)` literals exist in ThemedBlock/EpisodeGridV2/ShortCaption but those are `drop-shadow`/`textShadow` effects, not this token — different use case entirely.) |
| `--color-badge-notch` / `#7A7A7A` | 1× | PlanCard.jsx (decorative notch/ribbon grey) | Single decorative use, no structural role. |
| `#facc15` | 1× | BrowseScreen.jsx — Star icon `fill`, redundant with the `text-yellow-400` Tailwind class already on the same element (same stock Tailwind hex, hardcoded twice). Delete, use `fill="currentColor"`. |
| `#fcd34d` | 1× | PremiumChip.jsx — Crown icon `fill`, redundant with `text-amber-300` already on the same element (same stock Tailwind hex). Delete, use `fill="currentColor"`. |

---

## DECISIONS NEEDED (12 — from Buckets B and D only)

1. Keep `--color-gp-blue` (#0055A5, 10× in PaywallSheet carrier-billing) as `--color-ext-gp-blue`, a Grameenphone partner colour outside the Figma token set? (yes/no)
2. Keep `--color-pink` (#FF2E93, 12× coupon UI + campaign ring) as `--color-ext-campaign-pink`, Bioscope's own promo accent? (yes/no)
3. Fold `--color-campaign-accent` (#FF8A00, 1×) into the same campaign-extension pair as pink above? (yes/no)
4. Keep `--gradient-recommended` (PackCard "Recommended" bg) as a bespoke `--gradient-ext-recommended`, since Figma has no background-gradient primitives? (yes/no)
5. `#3a2c2c` (HeroTopBar tint default) — treat as art-direction carve-out like `heroSlides.tint` (leave literal), or does it need a real token? (A: carve-out / B: needs token)
6. `--color-brand-light` #46ffff + its dark companion `#062a2a` (7+2 uses, "electric teal" active/progress accent) — propose adding a teal primitive to Figma, or retire the teal system in favour of the existing brand blue `#00BBFF`? (A: add to Figma / B: retire, use brand blue)
7. `--color-badge-completed` / `--color-badge-ongoing` status badges — map to Figma's `success/primary` + `premium/linear-2`, or add dedicated status-badge colours to Figma? (A: reuse existing / B: add new)
8. `--color-text-muted` #808080 (20× — biggest-volume item on this whole list) — adopt `text/quaternary` #9DA4AE (visible cooler-grey shift across 20 spots), or flag as a genuine gap and keep the flatter grey? (A: adopt / B: keep as gap)
9. `--color-amber` #FF9900 (10× premium/rental labels) — collapse into `premium/linear-2` gold (visible orange→gold shift), or keep Amber as a deliberate distinct "rental" accent to add to Figma? (A: collapse to gold / B: add as new)
10. `--color-error-surface` #2A1A1A (1×, dark error card) — should Figma add a dark-mode error-surface variant, since only light error tones exist today? (yes/no)
11. `#E11D48` (PosterRail ribbon, borderline ΔE 10.84) — collapse into `error/primary` #FF474B (visible crimson→coral shift), or keep as a distinct ribbon red? (A: collapse / B: keep distinct)
