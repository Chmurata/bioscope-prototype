Bioscope+ Play Journey — Figma Build Spec

Source: src/screens/ContentDetailScreen.jsx, src/components/LongFormPlayer.jsx, src/components/PlayerSettingsSheet.jsx, src/components/Seekbar.jsx, src/components/DramaSheet.jsx (+ episode/EpisodeGridV2.jsx, RangeChip.jsx, WatchedBadge.jsx, PlayingBadge.jsx), src/components/StatusBar.jsx, src/components/PremiumChip.jsx, src/components/PremiumBadge.jsx, src/data/content.js, src/data/dramas.js, src/index.css, src/App.jsx, src/contexts/AppContext.jsx, src/components/PhoneFrame.jsx.

Companion doc: specs/FIGMA_PAYWALL_BUILD_SPEC.md (PaywallSheet). This spec picks up everywhere that spec doesn't: the content detail page, the long-form video player itself (portrait + fullscreen), its settings sheet, the drama/episode browsing sheet, and the small standalone components that live inside them.


═══════════════════════════════════════════════════════
0. STATE MACHINE — two independent flows, ordered, exact code keys
═══════════════════════════════════════════════════════

There is no single `stage` enum here (unlike PaywallSheet). Screen state is derived from several independent pieces of context state. Two separate playback experiences share this file set:

**Flow A — Long-form (movies).** `ContentDetailScreen.jsx` → embeds `LongFormPlayer.jsx` → opens `PlayerSettingsSheet.jsx`. Reached via `SCREENS.CONTENT_DETAIL`.

Player/CTA state is a `playState` object computed in a `useMemo`, keyed off:
- `explicitMode` (local state: `null | 'trailer'`) — set by tapping the "Trailer" action button.
- `entitled` = `isFree || isCoveredBySub || isRented` where `isFree = !selectedDrama.isPaywalled`, `isCoveredBySub = subscription && selectedDrama.packs.includes(subscription.packId)`, `isRented = rentals.includes(selectedDrama.id)`.
- `selectedDrama.hasPreview` / `selectedDrama.hasTrailer`.

Resulting `playState.mode` (top player region only): `'trailer'` (explicit tap, overrides everything else) → else if `entitled` → `'content'` → else if `hasPreview` → `'preview'` (endTime **hardcoded to `40`**, ignoring the `previewMinutes` field entirely — see §6) → else if `hasTrailer` → `'trailer'` (origin `'trailer-end'`) → else `'none'`.

CTA block below the player is a **separate, independent** condition — it does NOT check `playState.mode`:
- Primary slot: `!entitled && isPaywalled && recommendedPack` → renders **Subscribe + Rent** buttons (both together, unconditionally — the Rent button is NOT gated on `content.rentPrice` existing, unlike PaywallSheet's prompt stage). Else → **Play Now** button only.
- Secondary slot (independent, stacks below primary): `!entitled && hasPreview` → **Watch Free Preview** button.

So for a not-entitled, paywalled title with `hasPreview: true` (Seoul Vibe), **three buttons stack**: Subscribe, Rent, Watch Free Preview. This is a real quirk, not a spec error — build it exactly as coded.

LongFormPlayer's own state: `controlsVisible` (auto-hides 3s after play, via `resetHideTimer`), `isFullscreen` (local toggle) OR `orientation === 'landscape'` (global demo-panel state) → both drive `activeFullscreen`, `isPip` (Picture-in-Picture simulated overlay), `currentTime`/`duration`/`endTime` (seek + "ends in Xs" warning).

**Flow B — Episodic (micro-drama).** `DramaSheet.jsx` (Details/Episodes tabs) → `EpisodeGridV2.jsx` grid → (out of scope: `PlayerScreen.jsx` + `Seekbar.jsx`, the vertical episode player — not in the requested file list, only the standalone `Seekbar` component is specced here as a shared component). Reached via `showDetail` / `showEpisodeSelector` context flags, globally mounted in `App.jsx` (not screen-routed).

DramaSheet has 2 orthogonal axes: `tab` (`'details' | 'episodes'`) and `snap` (`'half' | 'expanded'`, translateY 30%/20% of the full-height container). Episode tile state is per-episode, computed in `EpisodeGridV2`: `locked` (`drama.isPremium && ep > (drama.freeEpisodes ?? 3)`), `watched` (`!locked && drama.watchedEpisodes.includes(ep) && ep !== currentEpisode`), `isCurrent` (`ep === currentEpisode`), `pct` (progress, only meaningful for the current episode).

**Global chrome.** `StatusBar.jsx` is hoisted in `App.jsx` above every screen/sheet (`z-[200]`, `pointer-events-none`) — it is present on every portrait frame in this spec. `PremiumChip.jsx` and `PremiumBadge.jsx` are NOT used by any file in this flow (`PremiumChip` lives in `PlayerScreen`/`ShortsScreen`; `PremiumBadge` always `return null` and is only referenced by Browse/DramaCard/MicroDramaRail) — both noted in §6, neither needs a frame here.


═══════════════════════════════════════════════════════
1. GLOBAL CONSTANTS
═══════════════════════════════════════════════════════

- Portrait artboard: **360×780**, name pattern `Play / <NN> <screen> / <state>`.
- Landscape artboard: **780×360** — used only for the 3 fullscreen-player frames (§3.2). **Important caveat**: `PhoneFrame.jsx` is a hard-coded 360×780 container that never physically rotates (`width:'360px', aspectRatio:'360/780'`). Setting `orientation: 'landscape'` in this prototype just toggles `activeFullscreen = true` and the player fills the *same* 360×780 portrait viewport (`absolute inset-0 !h-full !w-full`) — it does not produce a rotated canvas. The 780×360 frames in this spec are a **deliberate extrapolation** of what the code's own safe-area classes imply (`px-[max(env(safe-area-inset-left),1rem)]` only makes sense on a genuinely rotated device with a side notch) — i.e. this is the intended real-device behavior, not a literal screenshot-able state of the current build. Flagged again in §6.
- Font family everywhere: **Inter**. Weight → Figma style name: 400 Regular, 500 Medium, 600 "Semi Bold", 700 Bold.
- Status bar (portrait frames only — see caveat below): instance of `StatusBar` component (§5.5), pinned top, full-width, height 30px, `pointer-events-none`, sits above all other content (`z-200` equivalent = top of layer stack). **Not present on the 3 landscape frames** — a rotated real device swaps to a landscape status bar (or hides it), the code doesn't model this; treat its absence there as a judgment call, not a code fact.
- Global page/canvas bg: **#111618** (`--color-bg`).

### 1.1 Resolved color token table (everything used across these files)

| Token / class | Hex / value |
|---|---|
| `--color-bg` (page bg) | `#111618` |
| `--color-dark` (`bg-dark`, ContentDetailScreen root) | `#0A090B` |
| `--color-card` (`bg-card`, DramaSheet + PlayerSettingsSheet fill) | `#262b30` |
| `--color-card-hover` | `#2E3338` |
| `--color-surface-dark` (`bg-surface-dark`, episode tile bg) | `#1E2224` |
| `--color-cyan` (`bg-cyan`, `text-cyan`) | `#00BBFF` |
| `--color-amber` (`text-amber`, preview-ending pill) | `#FF9900` |
| `--color-badge-completed` | `#2B9C9C` |
| `--color-badge-new` / `--color-accent` | `#4664F5` |
| `--color-badge-ongoing` | `#B39331` |
| `--color-text-primary` | `#FFFFFF` |
| `--color-text-secondary` (`text-text-secondary`) | `#BFBFBF` |
| `--color-text-muted` (`text-text-muted`) | `#808080` |
| `--color-text-dim` (`bg-text-dim`, DramaSheet drag handle) | `#555555` |
| `--color-border` | `#2E3338` |
| Brand teal ACCENT (hardcoded `'#46ffff'` in DramaSheet.jsx, matches `--color-brand-light`) | `#46FFFF` |
| PlayingBadge text ink (hardcoded `#062a2a`) | `#062A2A` |
| Tailwind default `amber-200` (lock badge ring, `/50` opacity) | `#FDE68A` |
| Tailwind default `amber-300` (lock badge gradient start, Picker active-check icon) | `#FCD34D` |
| Tailwind default `amber-500` (lock badge gradient end) | `#F59E0B` |
| Tailwind default `amber-950` (lock icon ink) | `#451A03` |
| White / black at opacity | `#FFFFFF` / `#000000` at stated % — resolve per layer, don't flatten |
| Poster/backdrop/video/icon placeholders | `#333333` flat fill (per instructions — never real imagery) |

### 1.2 Gradients

- `--gradient-subscribe` (ContentDetailScreen Subscribe button — same token as PaywallSheet): **linear 90°**, `#FFDC86`@40% → `#FFD160`@100%.
- Backdrop veil in `content-detail / locked-none` (`bg-gradient-to-t from-dark to-transparent`): **linear 0°** (bottom→top), `#0A090B`@0% → transparent@100%.
- Episode tile bottom-strip veil (`bg-gradient-to-t from-black/85 via-black/40 to-transparent`): **linear 0°**, `#000000` 85% opacity @0%, `#000000` 40% opacity @50%, transparent @100%.
- Lock badge disc (`bg-gradient-to-br from-amber-300 to-amber-500`): **linear 135°**, `#FCD34D`@0% → `#F59E0B`@100%.
- Cyan play-circle glow (mode `none`): not a gradient — drop shadow `0 0 20px rgba(0,187,255,0.4)`.

### 1.3 Reusable text styles (T-IDs match the paywall spec's naming where the same size/weight recurs)

| ID | Size | Weight | Line height | Used for |
|---|---|---|---|---|
| T-title-28 | 28px | Bold (700) | leading-tight (~34px) | Content detail h1 title |
| T-h3-18 | 18px | Bold (700) | normal | "More like this", DramaSheet section headers |
| T-body-16 | 16px | Bold (700) | normal | Subscribe/Rent/Play Now/Watch Free Preview labels |
| T-body-15-med | 15px | Bold (700) | normal | PlayerSettingsSheet header, DramaSheet play button |
| T-body-14-semi | 14px | Semi Bold (600) | normal | DramaSheet title, PlayerSettingsSheet row labels |
| T-body-14-title | 14px | Bold (700) | normal | DramaSheet header title |
| T-caption-13 | 13px | Regular (400) | leading-[20px] | Synopsis body copy |
| T-caption-13-bold | 13px | Bold (700) | normal | Genre pills, duration |
| T-caption-12 | 12px | Regular/Medium | normal | Action-row labels, EP grid text, more-like-this captions |
| T-caption-11 | 11px | Regular/Bold | normal | Badges, meta rows |
| T-caption-10 | 10px | Semi Bold (600) | normal | EP number label |
| T-caption-9 | 9px | Bold/Medium | normal | Status pill, Watched/Playing badges |


═══════════════════════════════════════════════════════
2. FRAME LIST (20 frames — 17 portrait, 3 landscape)
═══════════════════════════════════════════════════════

1. `Play / 01 content-detail / locked-preview-playing` — Seoul Vibe
2. `Play / 01 content-detail / locked-preview-ending-warning` — Seoul Vibe
3. `Play / 01 content-detail / trailer-explicit` — Seoul Vibe
4. `Play / 01 content-detail / locked-none` — **Love Rosie** (data substitution, flagged §6)
5. `Play / 01 content-detail / entitled-playing` — Seoul Vibe (subscribed)
6. `Play / 01 content-detail / entitled-chrome-hidden` — Seoul Vibe (subscribed, idle)
7. `Play / 01 content-detail / free-entitled` — Wicked
8. `Play / 01 content-detail / synopsis-expanded` — Seoul Vibe
9. `Play / 01 content-detail / pip-active` — Seoul Vibe (entitled)
10. `Play / 02 player-fullscreen / controls-visible` — **LANDSCAPE**
11. `Play / 02 player-fullscreen / controls-hidden` — **LANDSCAPE**
12. `Play / 02 player-fullscreen / paused` — **LANDSCAPE**
13. `Play / 03 settings-sheet / root`
14. `Play / 03 settings-sheet / speed-picker`
15. `Play / 03 settings-sheet / quality-picker`
16. `Play / 03 settings-sheet / audio-picker`
17. `Play / 04 drama-sheet / details-half` — Choddobeshi Valobasha
18. `Play / 04 drama-sheet / episodes-half` — Choddobeshi Valobasha
19. `Play / 04 drama-sheet / episodes-expanded` — Choddobeshi Valobasha
20. `Play / 04 drama-sheet / range-chip-open` — Choddobeshi Valobasha


═══════════════════════════════════════════════════════
3. PER-SCREEN LAYER SPECS
═══════════════════════════════════════════════════════

## 3.1 Screen `content-detail` — frames 1–9 (PORTRAIT 360×780)

Shared shell (all 9 frames): root frame, auto-layout vertical, fill `#0A090B`, width 360, height 780, `StatusBar` instance pinned top (§5.5).

**Anchor data — Seoul Vibe** (`content.js`, id `seoul-vibe`): title `Seoul Vibe`, genres `Action`, `Comedy`, duration `2 h 35 min`, badges `HD`, `16+`, likes `8.5k`, synopsis `A crew of drivers get tangled in a massive slush fund investigation.`, cast `Yoo Ah-in, Go Kyung-pyo`, isPaywalled true, hasPreview true, hasTrailer true, rentPrice `99` (unused by the on-screen button — see stub note below), packs `['standard','super','premium-annual']`.

### Layer tree (base structure, all 9 frames)

- `Player Region` — 360×202.5 (16:9, `aspect-video`), fill `#000000`, align/justify center. Content per frame: either the `mode:'none'` overlay (frame 4 only) or a `LongFormPlayer (Embedded)` component instance (§5.1) — frames 1,2,3,5,6,7,8,9.
- `Detail Scroll Area` — auto-layout vertical, fill container, padding `20px top / 16px sides / 32px bottom` (`px-4 pt-5 pb-8`).
  - `Meta Block` — auto-layout vertical, align center, margin-bottom 24px (`mb-6`).
    - `Title` — text `{selectedDrama.title}` VERBATIM e.g. `Seoul Vibe`, T-title-28, color `#FFFFFF`, align center, margin-bottom 8px.
    - `Genres Row` — auto-layout horizontal, gap 6px, align center, margin-bottom 8px: per genre, text VERBATIM (e.g. `Action`), 13px Regular, color `#FFFFFF` opacity 80%, bottom stroke `#FFFFFF` opacity 40% 1px (2px inset — draw as a 1px line 2px below text); between genres, `•` separator 10px Regular color `#FFFFFF` opacity 40%.
    - `Meta Row` — auto-layout horizontal, gap 12px, align center, justify center: `Duration` text VERBATIM e.g. `2 h 35 min`, 13px Regular, color `#FFFFFF` opacity 80%; `Badges Group` — auto-layout horizontal, gap 6px: per badge (e.g. `HD`, `16+`), text 11px Bold, color `#FFFFFF` opacity 70%, border `#FFFFFF` opacity 20% 1px, corner radius 4px, padding `6px/2px`.
  - `CTA Column` — auto-layout vertical, gap 12px, margin-bottom 24px (`mb-6`). Content varies per frame — see per-frame notes below.
  - `Action Row` — auto-layout horizontal, width fill, justify space-between, align center, padding `0 8px`, margin-bottom 32px. 5× `ActionBtn`: icon in 48×48 circle, fill `#FFFFFF` opacity 5%, stroke `#FFFFFF` opacity 20% 1px (`ring-1 ring-white/20`), icon 20px centered, stroke-width 1.5; label below, gap 8px, text 12px Medium, color `#FFFFFF` opacity 90%.
    - `[icon placeholder 20×20 "thumbs-up"]` fill `#333333` (liked state: stroke/fill `#00BBFF` — note only, keep placeholder grey), label = `{selectedDrama.likes}` VERBATIM e.g. `8.5k`.
    - `[icon placeholder 20×20 "film"]`, label VERBATIM `Trailer` — **tap sets `explicitMode:'trailer'`, produces frame 3**.
    - `[icon placeholder 20×20 "plus"]` (in-list state: stroke `#00BBFF`, placeholder stays grey), label VERBATIM `My List`.
    - `[icon placeholder 20×20 "share-2"]`, label VERBATIM `Share` — **dead control, `onClick={() => {}}`, no-op. Build but mark as non-functional.**
    - `[icon placeholder 20×20 "download"]`, label VERBATIM `Download` — no onClick handler at all (dead, unwired).
  - `Synopsis Block` — auto-layout vertical, top stroke `#FFFFFF` opacity 10% 1px, padding-top 16px, margin-bottom 32px. Default (collapsed) shown in frames 1,2,3,4,5,6,7,9; expanded variant is frame 8 only — see §3.1.8.
    - `Body` — text = `{selectedDrama.synopsis}` VERBATIM, T-caption-13, line-height 20px, color `#FFFFFF` opacity 80%, clamped to 2 lines (collapsed state).
    - `See More Row` — auto-layout horizontal, gap 6px, justify center, width fill, margin-top 12px, padding `4px 0`: text VERBATIM `See more`, 14px Medium, color `#00BBFF`; `[icon placeholder 16×16 "chevron-down"]` color `#00BBFF`.
  - `More Like This` — auto-layout vertical.
    - `Heading` — text VERBATIM `More like this`, T-h3-18, color `#FFFFFF`, margin-bottom 16px.
    - `Grid` — 3-column grid, gap 12px. Each cell: auto-layout vertical, gap 8px — `Poster` 2:3 aspect placeholder rect, corner radius 8px, fill `#333333` (over `#FFFFFF` 5% base); `Caption` text = title VERBATIM, 12px Medium, color `#FFFFFF` opacity 90%, align center, truncate, padding `0 4px`.
    - **Seoul Vibe's exact `moreLikeThis` (first 4 other titles, source array order):** `Wicked`, `Me Before You`, `The Bike Riders`, `Love Rosie`.

### 3.1.1 Frame 1 — `locked-preview-playing`

Player Region: `LongFormPlayer (Embedded)` in mode `preview`, `controlsVisible: true`, `playing: true`, mid-progress (e.g. currentTime 12s of endTime 40s → progress ~30%), no "ending" warning yet.

CTA Column (3 buttons, exact stack order):
- `Subscribe Button` — height 48px, width fill, corner radius 999 (full), fill = gradient-subscribe (linear 90°), justify/align center, gap 8px. `[icon placeholder 20×20 "crown"]` fill `#333333`; `Label` text VERBATIM `Subscribe`, T-body-16, color `#000000`. **Note: copy is `Subscribe` here, NOT `Subscribe to Unlock` like the PaywallSheet button — different string, don't reuse.**
- `Rent Button` — height 48px, width fill, corner radius 999, fill `#FFFFFF`, justify/align center. `Label` text VERBATIM **`Rent for TK 99`**, T-body-16, color `#000000`. **Dead/stub control — this string is hardcoded in JSX, not `Rent for ৳{content.rentPrice}`. It always reads exactly "Rent for TK 99" regardless of the title's actual `rentPrice` (even `null`). Build verbatim, flag as stub in dev handoff.**
- `Watch Free Preview Button` — height 48px, width fill, corner radius 999, fill `#FFFFFF`, justify/align center. `Label` text VERBATIM `Watch Free Preview`, T-body-16, color `#000000`.

### 3.1.2 Frame 2 — `locked-preview-ending-warning`

Identical to frame 1, except Player Region shows the `LongFormPlayer (Embedded)` "ends-in" warning pill (§5.1): currentTime 36s of endTime 40s → text `Preview ends in 4s`.

### 3.1.3 Frame 3 — `trailer-explicit`

Player Region: `LongFormPlayer (Embedded)` in mode `trailer` (`explicitMode:'trailer'` set by tapping the Trailer action button; `endTime: null`, full-length trailer, no ending-warning pill possible since `endTime` is null). CTA Column: **identical 3-button stack as frame 1** — tapping Trailer does NOT change entitlement, so the paywall CTAs stay put underneath even while the trailer plays. Flag this as an intentional quirk worth confirming with product, not a build error.

### 3.1.4 Frame 4 — `locked-none` (Love Rosie substitution)

**Data note:** Seoul Vibe always has `hasPreview:true`, so `playState.mode:'none'` is unreachable with it — this state only exists for titles with both `hasPreview:false` and `hasTrailer:false`. Only **Love Rosie** (`content.js`) matches. Use it here; every other frame in this section stays on Seoul Vibe.

Love Rosie data: title `Love Rosie`, genres `Romance`, `Comedy`, duration `1 h 42 min`, badges `HD`, `16+`, likes `11k`, synopsis `Rosie and Alex have been best friends since they were 5, so they couldn't possibly be right for one another...or could they?`, cast `Lily Collins, Sam Claflin`.

Player Region layer tree (replaces the LongFormPlayer instance):
- `Backdrop` — 360×202.5 placeholder rect, fill `#333333`, opacity 50%.
- `Veil` — gradient overlay, linear 0° (to top), `#0A090B`@0% → transparent@100%, full-bleed over backdrop.
- `Back Button` — 40×40 circle, fill `#000000` opacity 30%, background blur 4px (`backdrop-blur-sm`), positioned top 32px / left 16px. `[icon placeholder 24×24 "arrow-left"]` fill `#333333` (rendered white stroke in code).
- `Play Circle` — 64×64 circle, fill `#00BBFF`, drop shadow `0 0 20px rgba(0,187,255,0.4)`, centered. `[icon placeholder 32×32 "play"]` fill `#0A090B`, offset +2px right (`ml-1`).

CTA Column (2 buttons — no "Watch Free Preview" since `hasPreview:false`):
- `Subscribe Button` — same as §3.1.1, label `Subscribe`.
- `Rent Button` — same styling, label VERBATIM **`Rent for TK 99`** (stub, unchanged regardless of Love Rosie's real `rentPrice:79`).

### 3.1.5 Frame 5 — `entitled-playing`

Context: `subscription = { packId: 'standard' }` (covers `seoul-vibe` via its `packs` array) or `rentals.includes('seoul-vibe')` — either satisfies `entitled`. Player Region: `LongFormPlayer (Embedded)` mode `content`, `endTime: null`, `controlsVisible: true`, `playing: true`. CTA Column: single **Play Now** button — height 48px, width fill, corner radius 999, fill `#FFFFFF`, justify/align center, gap 8px: `[icon placeholder 20×20 "play"]` fill `#333333`; `Label` text VERBATIM `Play Now`, T-body-16, color `#000000`. No secondary button (entitled hides the preview-CTA path entirely).

### 3.1.6 Frame 6 — `entitled-chrome-hidden`

Same as frame 5, but Player Region shows the `LongFormPlayer (Embedded)` chrome-hidden variant (§5.1) — controls faded out after 3s idle, video/poster placeholder fills the region with zero UI on top.

### 3.1.7 Frame 7 — `free-entitled` (Wicked)

Data: title `Wicked`, genres `Musical`, `Fantasy`, duration `2 h 35 min`, badges `HD`, `PG-13`, likes `12k`, synopsis `A misunderstood young woman discovers her true power.`, cast `Cynthia Erivo, Ariana Grande`. `isPaywalled:false` → always entitled regardless of subscription/rental state, `hasPreview:false`. Player Region: `LongFormPlayer (Embedded)` mode `content`. CTA Column: **Play Now** only (same as §3.1.5). No lock path ever reachable for this title — useful contrast frame.

### 3.1.8 Frame 8 — `synopsis-expanded`

Base = frame 1 (Seoul Vibe, locked-preview-playing, 3-button CTA). Synopsis Block swaps to the expanded layer tree (mirrors `seeMore:true`):
- `Body` — full synopsis text, NOT clamped, same T-caption-13 style, margin-bottom 12px.
- `Cast Line` — rich text 13px, color `#FFFFFF` opacity 60%: `Cast: ` (span color `#FFFFFF` opacity 40%) + `Yoo Ah-in, Go Kyung-pyo` VERBATIM, margin-bottom 4px.
- `Director Line` — rich text 13px, color `#FFFFFF` opacity 60%: `Director: ` (span opacity 40%) + **`John Doe`** — **hardcoded stub. This string is literal in the JSX (`Director: John Doe`), not sourced from any drama field, and never changes per title. Flag for dev.**
- `See Less Row` — same styling as See More, label VERBATIM `See less`, icon `chevron-up`.

### 3.1.9 Frame 9 — `pip-active`

Base = frame 5 (Seoul Vibe, entitled). When `isPip:true`, `LongFormPlayer` returns an entirely different render (not the embedded chrome):
- Player Region — 360×202.5, fill `#000000`, centered text `Playing in Picture-in-Picture`, 14px Regular, color `#FFFFFF` opacity 50%.
- `Mini Player` — floating, absolutely positioned, bottom 80px / right 16px (relative to the phone frame, above the bottom nav), 160×90 (16:9), corner radius 8px, fill `#333333` (video placeholder), stroke `#FFFFFF` opacity 20% 1px, drop shadow (Figma default "2xl"), `z-index` above the detail scroll content.
  - `Close Button` — 20×20 circle, fill `#000000` opacity 50%, top-right inset 4px, `[icon placeholder 14×14 "x"]` fill `#333333`.
- Rest of the detail scroll area (title, CTA = Play Now, action row, synopsis, more-like-this) unchanged from frame 5, sitting underneath.

---

## 3.2 Screen `player-fullscreen` — frames 10–12 (LANDSCAPE 780×360)

See §1's caveat: these are the extrapolated real-device fullscreen treatment, not a literal capture of the desktop-fixed prototype. Root: fill `#000000`, no StatusBar instance (see §1).

- `Video` — placeholder rect, fill `#333333`, `object-contain` behavior: video is 16:9, frame is 780×360 (≈2.17:1, wider than 16:9) → video renders at 640×360 centered horizontally, **letterboxed with black bars 70px each side** (`#000000`, full height).
- `Chrome Overlay` — full-bleed 780×360, fill `#000000` opacity 40% (`bg-black/40`), auto-layout vertical, justify space-between, padding — present in frames 10 and 12, fully removed (opacity 0 / no layer) in frame 11.
  - `Top Row` — auto-layout horizontal, justify space-between, align center, padding `16px top / 24px sides` (extra side padding vs. portrait, standing in for `safe-area-inset-left/right` on a notched landscape device).
    - `[icon placeholder 24×24 "arrow-left"]` fill `#333333` (white in code), drop shadow.
    - `Right Group` — auto-layout horizontal, gap 16px, align center: `[icon placeholder 20×20 "picture-in-picture"]`, `[icon placeholder 20×20 "cast"]`, `[icon placeholder 20×20 "settings"]` — all fill `#333333`, drop shadow, opens `PlayerSettingsSheet` (§3.3).
  - `Center Row` — auto-layout horizontal, gap 32px, align/justify center.
    - `Skip Back` — 44×44 circle, fill `#000000` opacity 30%, centered `[icon placeholder 28×28 "rotate-ccw"]` fill `#333333`.
    - `Play/Pause` — 60×60 circle, fill `#FFFFFF` opacity 10%, background blur 8px (`backdrop-blur-md`), stroke `#FFFFFF` opacity 20% 1px, centered `[icon placeholder 36×36 "pause"]` (frames 10/11 = playing → Pause icon; frame 12 = paused → Play icon, fill `#333333`, offset +2px if Play).
    - `Skip Forward` — 44×44 circle, fill `#000000` opacity 30%, centered `[icon placeholder 28×28 "rotate-cw"]` fill `#333333`.
  - `Bottom Block` — auto-layout vertical, padding `16px sides / 16px bottom`, gap 8px.
    - `Time Row` — auto-layout horizontal, justify space-between, align center: `Time` text e.g. `1:24 / 2:35`, 12px Medium, tabular nums, color `#FFFFFF`, drop shadow; `[icon placeholder 18×18 "minimize"]` fill `#333333` (shown because `activeFullscreen` is true — toggling calls `setIsFullscreen(false)`, in the prototype this does NOT exit fullscreen if `orientation` is still `'landscape'`, since `activeFullscreen = isFullscreen || orientation==='landscape'` — flag as a possible dead-end control in landscape).
    - `Seekbar` — height 6px, width fill, fill `#FFFFFF` opacity 30%, corner radius 999, relative. `Remaining Segment` (only if `endTime` set and content is longer, e.g. a preview) — absolute, fill `#FFFFFF` opacity 20%, from `endTime%` to 100%. `Progress Fill` — absolute left 0, fill `#00BBFF`, corner radius 999, width = progress%. `Scrub Knob` — 12×12 circle, fill `#FFFFFF`, stroke `#00BBFF` 2px, positioned at progress% minus half its width.
  - `Ending Warning Pill` (frame 10 only, optional overlay) — absolute, top 24px, centered horizontally, auto-layout horizontal, padding `6px 16px`, corner radius 999, fill `#000000` opacity 70%, background blur 8px, stroke `#FFFFFF` opacity 10% 1px: text VERBATIM `Preview ends in {n}s` e.g. `Preview ends in 4s`, 12px Bold, color `#FF9900`.

### Frame 10 — `controls-visible`: chrome as above, Play/Pause = Pause icon (playing), no ending-warning pill (mid-content, not near boundary).
### Frame 11 — `controls-hidden`: Chrome Overlay layer removed entirely (opacity 0, `AnimatePresence` exit) — only the letterboxed `Video` placeholder remains, nothing else.
### Frame 12 — `paused`: chrome forced visible (pausing clears the hide-timer and re-shows controls), Play/Pause = Play icon (not playing).

---

## 3.3 Screen `settings-sheet` — frames 13–16 (PORTRAIT 360×780, overlay)

Shared shell: full-bleed 360×780 scrim, fill `#000000` opacity 60% (`bg-black/60`) — no backdrop blur (unlike PaywallSheet's scrim, which has `backdrop-blur-[2px]`; this one doesn't). Sheet: bottom-anchored, width 360, height = hug, corner radius top 16px (`rounded-t-[16px]`), fill `#262b30` (`bg-card`), overflow hidden.

Layer tree, top→bottom:
- `Drag Handle Row` — auto-layout horizontal, justify center, padding `12px top / 4px bottom`. `Handle` — 40×4 pill, corner radius 999, fill `#FFFFFF` opacity 20%.
- **Root view (frame 13)**:
  - `Header` — auto-layout horizontal, justify space-between, align center, padding `8px 20px`. `Title` text VERBATIM `Player settings`, T-body-15-med, color `#FFFFFF`. `Close Button` — 28×28 circle, fill `#FFFFFF` opacity 10%, centered `[icon placeholder 14×14 "x"]` fill `#333333`.
  - `Row List` — auto-layout vertical, padding-bottom 16px. 3× `Row` (§5.3): `Zap` icon / `Playback speed` / value `1x`; `Gauge` icon / `Video quality` / value `Auto`; `Globe2` icon / `Audio` / value `Bangla (Original)`.
- **Picker views (frames 14–16)** — replace Root view entirely (not stacked):
  - `Picker Header` — auto-layout horizontal, gap 12px, align center, padding `12px 20px`, bottom stroke `#FFFFFF` opacity 5% 1px. `Back Chevron` text VERBATIM `‹`, 18px Regular, color `#FFFFFF` opacity 70%, leading-none. `Title` text VERBATIM per picker (`Playback speed` / `Video quality` / `Audio`), T-body-14-semi, color `#FFFFFF`.
  - `Option List` — auto-layout vertical, padding `4px 0`. Per option: `Row` — auto-layout horizontal, justify space-between, align center, padding `12px 20px`. `Label` text VERBATIM (option string), 13px Regular, color `#FFFFFF`, align left. `Check` — only on the active option — `[icon placeholder 15×15 "check"]` fill `#FCD34D` (Tailwind `amber-300`).

**Frame 14 — `speed-picker`**: options VERBATIM `0.5x`, `0.75x`, `1x`, `1.25x`, `1.5x`, `2x` — active = `1x`.
**Frame 15 — `quality-picker`**: options VERBATIM `Auto`, `1080p`, `720p`, `480p`, `360p` — active = `Auto`.
**Frame 16 — `audio-picker`**: options VERBATIM `Bangla (Original)`, `English (Dubbed)`, `Hindi (Dubbed)` — active = `Bangla (Original)`.

---

## 3.4 Screen `drama-sheet` — frames 17–20 (PORTRAIT 360×780, overlay)

**Anchor data — `dramas.js` id 4, "Choddobeshi Valobasha"** (chosen because it's the only drama whose `currentEpisode` sits at or below `freeEpisodes`, avoiding a data/logic conflict present in ids 1/2 — see §6): title `Choddobeshi Valobasha`, status `Ongoing`, totalEpisodes `60`, views `57K`, genres `Romance`, `Comedy`, `Family`, currentEpisode `3`, watchedEpisodes `[1,2,3]`, isPremium `true`, freeEpisodes `3`, progress `{episodeNumber:3, secondsWatched:88, totalSeconds:125}` → 70% progress on episode 3, cast `Tasnia Farin (Lead F)`, `Sariful Razz (Lead M)`, synopsis `A software engineer pretends to be her rival's fiancée to win a family trust fund — only to realize the fake romance is becoming dangerously real.`

Shared shell: scrim full-bleed 360×780, fill `#000000` opacity 55% (`bg-black/55`). Sheet: full-height container (top 0, bottom 0), fill `#262b30`, corner radius top 16px, translated down by 30% (HALF, y=234, visible height 546px) or 20% (EXPANDED, y=156, visible height 624px) — in Figma, build as a 360×780 frame with the sheet positioned/clipped accordingly (top of sheet at the stated y, rest of the 780 canvas above it shows the dimmed scrim only).

### Sticky header (identical across all 4 frames)
- `Drag Handle` — 40×4 pill, fill `#555555` (`text-dim`), centered, padding `12px top / 8px bottom`.
- `Header Row` — auto-layout horizontal, gap 12px, align center, padding `0 20px`, margin-bottom 12px.
  - `Poster` — 40×56, corner radius 4px, fill `#333333`.
  - `Text Group` — auto-layout vertical, fill container: `Title` text VERBATIM `Choddobeshi Valobasha`, T-body-14-title, color `#FFFFFF`, truncate. `Meta Row` — auto-layout horizontal, gap 8px, align center, margin-top 4px: `Status Pill` text VERBATIM `Ongoing`, T-caption-9 Bold, color `#FFFFFF`, fill `#B39331` (`bg-badge-ongoing` — Ongoing status; `Completed` → `#2B9C9C`, `New` → `#4664F5`), corner radius 3px, padding `6px/2px`; `Count/Views` text VERBATIM `60 EP · 57K Views`, 11px Regular, color `#808080`.
  - `Close Button` — 28×28 circle, fill `#FFFFFF` opacity 10%, centered `[icon placeholder 14×14 "x"]` fill `#333333`.
- `Tab Row` — auto-layout horizontal, padding `0 20px`, bottom stroke `#FFFFFF` opacity 10% 1px, margin-top 4px. 2× `Tab`: padding `10px 12px`, text VERBATIM `Details` / `Episodes` (source strings lowercase, displayed via CSS `capitalize`) — active: 13px Semi Bold, color `#FFFFFF`, plus a 2px bottom underline fill `#FFFFFF` full width of the tab; inactive: 13px Medium, color `#808080`.

### Frame 17 — `details-half` (tab = Details, snap = half, sheet visible height 546px)

Body — auto-layout vertical, padding `4px 20px 32px`.
- `Synopsis` — full text (NOT clamped — `DetailsTab`'s `expanded` state defaults to `true`), text VERBATIM as above, 12px Regular, color `#FFFFFF`, line-height 18px, margin-bottom 16px.
- `Detail Rows` — auto-layout vertical, gap 12px, margin-bottom 20px. Each row: auto-layout horizontal, gap 8px. `Label` text e.g. `Genres:`, 12px Regular, color `#808080`. `Values` — wrap, gap `12px/4px`, per value text 12px Regular, color `#FFFFFF`, underlined (`underline underline-offset-2 decoration-white/40`) if `linked`.
  - `Genres:` → `Romance`, `Comedy`, `Family` (linked)
  - `Content-providers:` → `Hoichoi` (linked, fallback value — field absent on this drama)
  - `Directors:` → `Mainak Bhaumik` (linked, fallback)
  - `Casts:` → `Tasnia Farin`, `Sariful Razz` (linked)
  - `Producers:` → `Nandy Movies` (linked, fallback)
  - `Runtime:` → `120 min total` (derived: `totalEpisodes(60) × 2`, not linked)
  - `Release Date:` → `2025-01-01` (fallback, not linked)
  - `Maturity Rating:` → `Adults Only` (derived: `isPremium:true`, not linked)
- `See Less Row` — inline-flex, gap 4px, margin-top 4px, margin-bottom 20px: text VERBATIM `See less`, 13px Semi Bold, color `#46FFFF`; `[icon placeholder 14×14 "chevron-up"]` color `#46FFFF`.
- `Play Button` — height 44px, width fill, corner radius 8px, fill `#FFFFFF`, justify/align center, gap 8px: `[icon placeholder 14×14 "play"]` fill `#2A2A2A`; `Label` text VERBATIM `Play EP.1` (userState `'new'`; if `'returning'`, label becomes `Continue EP.3` — annotate inline, no separate frame), 14px Semi Bold, color `#2A2A2A`.
- `More Like This Rail` — auto-layout horizontal, gap 12px, margin-top 20px, horizontal scroll. 5× card, width 90px: `Poster` 90×127, corner radius 6px, fill `#333333` (over `bg-card`); `Caption` text VERBATIM (title), 9px Regular, color `#BFBFBF`, margin-top 4px, truncate. **Exact order (first 5 dramas excluding self, source array order):** `Shahoshika`, `Ondhokar Shohor`, `Oshomapto Shomporko`, `Criminal`, `Survive`.

### Frame 18 — `episodes-half` (tab = Episodes, snap = half, visible height 546px)

Body — no outer padding on the tab content itself (RangeChip row and grid carry their own).
- `RangeChip Row` — padding `16px top / 12px sides / 12px bottom`. `RangeChip` instance (§5.4), collapsed, showing `EP 1–30` (active range, since `activeRange:0` default; `totalEpisodes:60` → 2 ranges: `1–30`, `31–60`).
- `Episode Grid` — 3-column grid, gap 3px, edge-to-edge (no side padding). Episodes 1–30 rendered (30 tiles); sheet is clipped at 546px visible height so only the first ~3 rows of tiles are visible before the fold — build the full 30-tile grid regardless (scrollable content), just note the visible crop line at y=546 from frame top.
  - Tile (§5.6 `EpisodeGridV2 Tile`) states present in this data set: EP1–2 → `watched`; EP3 → `current/playing` with 70% progress bar; EP4–30 → `locked` (since `isPremium:true`, `freeEpisodes:3`, all ep>3 are locked — **note: episodes 4+ are ALSO absent from `watchedEpisodes`, so there's no watched/locked conflict for this anchor, unlike dramas id 1/2 — see §6**).

### Frame 19 — `episodes-expanded` (tab = Episodes, snap = expanded, visible height 624px)

Same content as frame 18, sheet pulled up further (top at y=156 instead of y=234) — used to demonstrate the auto-expand-on-scroll behavior (`onContentScroll` snaps to `expanded` once the grid is scrolled). Purely a vertical-position difference; grid/RangeChip content identical to frame 18.

### Frame 20 — `range-chip-open`

Base = frame 18 (episodes-half). `RangeChip` (§5.4) in its open/expanded state: dropdown panel anchored below the pill, min-width 140px, fill `#262b30` (`bg-card`), corner radius 10px, stroke `#FFFFFF` opacity 10% 1px, drop shadow `0 8px 24px rgba(0,0,0,0.5)`, positioned at top offset 34px from the pill's top, overlapping the grid below it.
- 2× `Range Option` — auto-layout horizontal, justify space-between, padding `10px 12px`. `EP 1–30` (active): text 12px Semi Bold, color `#FFFFFF`, fill `#FFFFFF` opacity 5% row background, `[icon placeholder 14×14 "check"]` color `#FFFFFF`. `EP 31–60` (inactive): text 12px Regular, color `#BFBFBF`, no check.


═══════════════════════════════════════════════════════
4. FRAME COUNT
═══════════════════════════════════════════════════════

**20 frames total — 17 portrait (360×780), 3 landscape (780×360).** Portrait: `content-detail` ×9, `settings-sheet` ×4, `drama-sheet` ×4. Landscape: `player-fullscreen` ×3. See §2 for the literal list.


═══════════════════════════════════════════════════════
5. SHARED COMPONENTS
═══════════════════════════════════════════════════════

### 5.1 LongFormPlayer (Embedded) — used inside content-detail frames 1, 2, 3, 5, 6

Base component, 360×202.5 (16:9), fill `#000000`, `object-contain` video placeholder centered (fills the full region since 16:9 matches the 16:9 container exactly — no letterboxing at this size, unlike the fullscreen landscape variant).

- `Video` — placeholder rect, fill `#333333`, full-bleed.
- `Chrome Overlay` — full-bleed, fill `#000000` opacity 40%, auto-layout vertical, justify space-between. Present when `controlsVisible:true` (frames 1,2,3,5); fully absent when hidden (frame 6).
  - `Top Row` — auto-layout horizontal, justify space-between, align center, padding `16px top / 16px sides`. `[icon placeholder 24×24 "arrow-left"]` fill `#333333`, drop shadow. `Right Group` — gap 16px: `[icon placeholder 20×20 "picture-in-picture"]`, `[icon placeholder 20×20 "cast"]`, `[icon placeholder 20×20 "settings"]`, all fill `#333333`, drop shadow.
  - `Center Row` — auto-layout horizontal, gap 32px, align/justify center. `Skip Back` 44×44 circle fill `#000000` opacity 30%, `[icon 28×28 "rotate-ccw"]`; `Play/Pause` 60×60 circle fill `#FFFFFF` opacity 10%, blur 8px, stroke `#FFFFFF` opacity 20% 1px, `[icon 36×36 "pause"/"play"]` fill `#333333`; `Skip Forward` mirrors Skip Back with `"rotate-cw"`.
  - `Bottom Block` — padding `16px sides / 16px bottom`, gap 8px. `Time Row` — justify space-between: `Time` text e.g. `0:12 / 0:40` (preview) or `1:24 / 2:35` (content), 12px Medium tabular, color `#FFFFFF`; `[icon 18×18 "maximize"]` fill `#333333` (not yet fullscreen — this is the embedded variant). `Seekbar` — 6px height, fill `#FFFFFF` opacity 30%, corner radius 999; Progress Fill `#00BBFF`; Scrub Knob 12×12 fill `#FFFFFF` stroke `#00BBFF` 2px.
  - `Ending Warning Pill` (frame 2 only) — absolute top 24px centered, padding `6px 16px`, corner radius 999, fill `#000000` opacity 70%, blur 8px, stroke `#FFFFFF` opacity 10% 1px: text VERBATIM `Preview ends in 4s`, 12px Bold, color `#FF9900`.

**Chrome-hidden variant** (frame 6): `Chrome Overlay` layer removed entirely — only `Video` remains.

### 5.2 Picture-in-Picture mini player — see §3.1.9, not repeated here.

### 5.3 PlayerSettingsSheet `Row` (root view)

Auto-layout horizontal, width fill, gap 12px, padding `14px 20px`. `[icon 18×18]` (`Zap`/`Gauge`/`Globe2`) color `#FFFFFF` opacity 70%, stroke-width 1.5. `Label` — fill container, text 14px Medium, color `#FFFFFF`. `Value` — text 12px Regular, color `#808080` (`text-text-muted`). `Chevron` — text VERBATIM `›`, 18px Regular, color `#FFFFFF` opacity 40%, leading-none.

### 5.4 RangeChip

Closed pill — inline-flex, gap 4px, height 28px, padding `0 12px`, corner radius 999, fill `#242628`, stroke `#FFFFFF` opacity 10% 1px, align center: `Label` text `EP {range}` VERBATIM e.g. `EP 1–30`, 12px Medium, color `#FFFFFF`, leading-none; `[icon 12×12 "chevron-down"]` color `#FFFFFF`, rotates 180° when open. Open panel — see §3.4 frame 20.

### 5.5 StatusBar

Height 30px, width fill, padding `0 24px`, auto-layout horizontal, justify space-between, align center, fill transparent, drop shadow filter `0 1px 2px rgba(0,0,0,0.4)` applied to the whole bar (not per-layer). `Time` text VERBATIM `11:11`, 12px Semi Bold, color `#FFFFFF`. `Icon Group` — gap 4px: signal-bars icon (4 ascending bars, white fill, 16×10) and battery icon (rounded-rect outline 18×9 + terminal nub + white fill at ~67% width, 22×10) — both vector, not placeholders (simple enough to build as real shapes, not `#333333` rects).

### 5.6 EpisodeGridV2 Tile

Base tile: aspect 9:16, fill `#1E2224` (`bg-surface-dark`), `Poster` placeholder fill `#333333` full-bleed. `isCurrent` adds a 2px inset ring, color `#46FFFF`.

- **Watched state**: `Veil` — full-bleed, fill `#000000` opacity 65%. `Bottom Strip` — gradient (linear 0°, `#000000` 85%@0% → 40%@50% → transparent@100%), padding `6px/6px/6px`, auto-layout horizontal, justify space-between, align flex-end: `EP Label` text `EP {n}` VERBATIM, T-caption-10, color `#FFFFFF`, tabular, drop shadow; `WatchedBadge` — text VERBATIM `Watched`, T-caption-9 Medium, color `#FFFFFF`, fill `#000000` opacity 75%, background blur (`backdrop-blur-sm`), corner radius 5px, padding `6px/3px`.
- **Current/playing state**: same Bottom Strip, `EP Label` + `PlayingBadge` — inline-flex, gap 4px, T-caption-9 Bold, color `#062A2A`, fill `#46FFFF`, corner radius 5px, padding `6px/3px`: `Dot` 5×5 circle fill `#062A2A` (pulsing in code, static in Figma) + text VERBATIM `Playing`. `Progress Bar` — absolute bottom, height 2px, width fill, track fill `#FFFFFF` opacity 10%, fill `#46FFFF` at `{pct}%` width (70% for the anchor's EP3).
- **Locked state**: no veil (`watched` and `locked` are mutually exclusive by design — `!locked` guards `watched`). `Lock Badge` — 20×20 circle, top 6px / right 6px, fill = gradient (linear 135°, `#FCD34D`@0% → `#F59E0B`@100%), stroke `#FDE68A` opacity 50% 1px, drop shadow `0 1px 3px rgba(0,0,0,0.4)`, centered `[icon 10×10 "lock"]` fill `#451A03`. `Bottom Strip` — same gradient/padding, `EP Label` only (no badge).
- **Plain/unlocked-unwatched-not-current state** (not present in the anchor drama's episodes 1–30, but exists in the component logic — e.g. any free, never-watched, non-current episode): `Bottom Strip` with `EP Label` only, no lock badge, no veil, no progress bar.

### 5.7 Seekbar (standalone component, `src/components/Seekbar.jsx`)

**Not embedded in any frame in this spec** — it's used exclusively inside `PlayerScreen.jsx` (the vertical micro-drama episode player), which was not in the requested file list and is out of scope here. Documented as a component swatch only, for dev handoff continuity:
- Track — height 3px, width fill, fill `#FFFFFF` opacity 20%, no rounding (`rounded-none` — flat rectangle, unlike every other progress bar in this app which uses `rounded-full`).
- Fill — height fill (3px), fill `--color-accent` (`#4664F5` — note: this resolves to the **blue** accent token, not the cyan `#00BBFF` used everywhere else in the player chrome. Different color family, confirm intentional before reusing cyan here).
- Knob — 10×10 circle, fill `--color-accent` (`#4664F5`), positioned at the right edge of the fill, drop shadow (Figma default "lg").
- 3 states to swatch: `0%` (empty track only), `~45%` (mid-progress, e.g. driven by a 15000ms default duration), `100%` (full fill, triggers `onComplete`).


═══════════════════════════════════════════════════════
6. UNRESOLVED / NEEDS FOLLOW-UP / DEAD-STUB CONTROLS
═══════════════════════════════════════════════════════

1. **Rent CTA on ContentDetailScreen is a hardcoded stub.** The button always reads exactly `Rent for TK 99` regardless of the title's real `content.rentPrice` (even when `null`, e.g. Nishiddho). It never varies. Contrast with `PaywallSheet`'s prompt-stage Rent button, which correctly renders `Rent for ৳{content.rentPrice}` and is conditionally hidden when `rentPrice` is absent. Build the ContentDetailScreen version verbatim as `Rent for TK 99` and flag it to dev as needing the same fix PaywallSheet already has.
2. **Share action button is dead** (`onClick={() => {}}`, no-op) and **Download has no handler at all**. Both render fine visually; neither does anything. Build both, mark non-functional.
3. **Director line is a hardcoded stub**: `Director: John Doe` is a literal string in `ContentDetailScreen.jsx`'s expanded-synopsis block, not read from any drama field, identical on every title. Flag for dev.
4. **`previewMinutes` field is dead data.** `content.js` sets `previewMinutes: 5` on preview-eligible titles, but `ContentDetailScreen.jsx`'s `playState` logic hardcodes `endTime: 40` (seconds) regardless of that field's value. The field is read nowhere. Flag before assuming preview length is configurable per title.
5. **Landscape/fullscreen frames (10–12) are an extrapolation, not a literal code state.** `PhoneFrame.jsx` never physically rotates (fixed 360×780). Setting `orientation:'landscape'` only sets `activeFullscreen:true`, filling the same portrait viewport. The 780×360 frames here follow the safe-area-inset-left padding class that only makes sense on a genuinely rotated device — built as the intended real-device behavior, flagged as a design decision to confirm, not a pixel-for-pixel screenshot source.
6. **Fullscreen-toggle dead-end in simulated landscape**: tapping the Minimize icon while `orientation==='landscape'` calls `setIsFullscreen(false)`, but `activeFullscreen = isFullscreen || orientation === 'landscape'` stays true because `orientation` itself is unchanged — the button visually does nothing in that state. Confirm whether a real device would rotate back (exiting landscape) or whether this is a genuine dead control in the demo.
7. **Episode watched/locked data conflict in dramas.js ids 1 and 2** (not built, informational only): both have `currentEpisode` (5, 12) greater than `freeEpisodes` (3), with `watchedEpisodes` including episodes past the free cutoff. `EpisodeGridV2`'s `isLocked` check fires first and `watched` is guarded by `!locked`, so those "watched" episodes actually render as **locked** tiles (lock badge, no watched pill) — the data disagrees with what the UI shows. Chose id 4 as the anchor specifically to avoid building a frame around this inconsistency; flag it to whoever owns `dramas.js` if ids 1/2 need those states shown correctly.
8. **`isCurrent` and `locked` are independent conditions** — a drama whose `currentEpisode` sits past its `freeEpisodes` cutoff (e.g. id 1, ep 5) would render BOTH the lock badge (top-right) and the Playing pill (bottom strip) on the same tile simultaneously. Not built as a frame (see #7), but worth a UX flag.
9. **PremiumChip and PremiumBadge are out of scope for this flow.** `PremiumChip.jsx` (glass "Unlock Premium" pill) is only used in `PlayerScreen.jsx`/`ShortsScreen.jsx`, neither in this spec's file list. `PremiumBadge.jsx` unconditionally `return null` everywhere it's referenced (`BrowseScreen`, `DramaCard`, `MicroDramaRail`) — genuinely dead, no visual output, no frame possible.
10. **`--color-surface-panel` (`#252a2d`) and a few other theme tokens** appear in `index.css` but aren't consumed by any file read for this spec — not used, no action needed, noted only so nobody goes looking for them here.

**Figma API gotcha (build-time, not a design fact):** `counterAxisAlignItems` on auto-layout frames only accepts `MIN` / `MAX` / `CENTER` / `BASELINE` — never `END`. Anywhere this spec says "align flex-end" (e.g. §3.4 Price-adjacent rows are absent here, but any bottom-aligned row you build from this spec), map it to `MAX`, not `END`, when scripting the plugin calls.
