# Prototype state — what exists, what is fake

Audit of `Bioscope Prototype/` as of 30 Aug 2026, read against the four Play Journey tasks. Paths are relative to the prototype root.

---

## Stack

React 19 · Vite 8 · Tailwind v4 · Framer Motion 12 · lucide-react + heroicons. Single-page, no router — screen switching is state in `src/contexts/AppContext.jsx`. Pure client-side, no backend, no real video anywhere.

Deployed to Vercel as `bioscope-prototype`. Git repo on `main` with a substantial uncommitted working tree (new `DramaSheet`, `components/episode/`, `components/shorts/`).

---

## What already exists and is reusable

| Thing | Where | Reuse for |
|---|---|---|
| Phone frame + status bar shell | `src/components/PhoneFrame.jsx`, `StatusBar.jsx` | All four tasks |
| Screen router with slide-up overlay pattern | `src/App.jsx`, `src/contexts/AppContext.jsx` | Player entry, paywall overlay |
| Bottom sheet pattern | `src/components/DramaSheet.jsx` | Compact pack sheet (Task D4) |
| 5-stage subscribe flow | `src/components/SubscribeSheet.jsx` | Task D handoff — reworked, not reused as-is |
| Plan cards + BD payment rails | `src/components/PlanCard.jsx`, `PaymentMethodList.jsx`, `src/data/plans.js`, `paymentMethods.js` | Task D pack handoff |
| Seekbar | `src/components/Seekbar.jsx` | Portrait/landscape player controls |
| Settings sheet — quality, speed, CC | `src/components/PlayerSettingsSheet.jsx` | Task A player controls |
| Dev control panel | `src/components/ControlPanel.jsx` | Needs new entitlement toggles — see below |
| Design tokens | `src/index.css` `@theme` block | Everything |

---

## What does not exist and must be built

These four are prerequisites, not nice-to-haves. Every assigned task branches on at least one of them.

1. **A long-form player.** The only player is `src/screens/PlayerScreen.jsx` — a vertical, full-bleed, swipe-between-episodes microdrama player. It is the wrong shape for Task A. Long-form needs its own player with portrait and landscape layouts.

2. **A long-form content detail page.** `DramaSheet.jsx` is a microdrama bottom sheet. Tasks A, B and D all launch from a detail page that does not exist.

3. **A content model with clip types.** `src/data/dramas.js` holds microdrama objects; episodes are bare integers with no per-episode asset. There is no notion of a main asset, trailer or preview clip. See `DATA_MODEL.md`.

4. **A subscribed state that actually does something.** See below.

---

## What is fake, and matters

**`isVip` is write-only.** Declared in `src/contexts/AppContext.jsx`, set `true` by `SubscribeSheet.handlePay()`, and **never read anywhere else.** So subscribing changes nothing on screen:

- Subscribing unlocks nothing. Episode locking in `src/components/episode/EpisodeGridV2.jsx` only checks `drama.isPremium && ep > drama.freeEpisodes` — it never consults `isVip`.
- Ads are not suppressed for subscribers. `FullPageAd`, `InlineAdStrip` and `home/AdBanner` all render unconditionally.
- `PremiumChip` ("Unlock Premium") renders even after subscribing.
- Nothing persists across reload. There is no plan or tier stored — just a boolean.

**Payment is a 1400ms `setTimeout`.** `SubscribeSheet.handlePay()` fakes latency, flips `isVip`, and advances to success. No validation, no card or phone fields, and the selected `paymentId` is never branched on.

**`PremiumBadge.jsx` always returns `null`** — a deliberate stub, "currently hidden across all surfaces", despite being called from `BrowseScreen` and `DramaSheet`.

**Playback timings are inconsistent.** `Seekbar` in `PlayerScreen` runs a fixed 15-second fake progress, unrelated to the 120-second `EPISODE_TOTAL_SECONDS` used to write `progressByDrama`. A 5-minute preview window cannot be demonstrated honestly on top of that.

**No account concept.** No auth, no user object, no profile. The `Account` slot in `src/components/BottomNavbar.jsx` is `screen: null`. The `userState: 'new' | 'returning'` flag exists but is only settable by editing source.

---

## Dead code worth knowing about

- `src/screens/BrowseScreen.jsx` — fully built with three variants, but nothing ever navigates to it.
- `PlayerScreen` V2 and V3 layout variants, and `BrowseScreen` V2/V3 — unreachable; no UI sets `variants.*`.
- `FLEXIPLAN`'s "Create Package" button in `src/data/plans.js` — dead.
- `ActionColumn`'s Share action — a no-op.

Do not spend time on these. They are not in scope and are noted only so they are not mistaken for working features.

---

## Token hygiene

`src/index.css` defines a Tailwind v4 `@theme` block: `--color-bg #111618`, `--color-surface`, `--color-card`, brand teal `--color-brand #2b9c9c` / `--color-brand-light #46ffff`, accent `--color-accent #4664f5`, a text scale, and `--font-sans: Inter`.

Large parts of the app ignore it. Screen backgrounds hardcode `bg-[#0A090B]` (which does not match `--color-bg`); `DramaSheet.jsx` hardcodes `ACCENT = '#46ffff'`; the whole subscription flow uses untokenized `#00BBFF`, `#00DF00`, `#212628`, `#1E2224`.

**New work should not extend this.** Any colour the reference screenshots introduce gets a token in `@theme` first.

---

## Dev panel gaps

`ControlPanel.jsx` currently exposes only Navigate (Home / Microdrama / Shorts / Open Player) and Ads (single, 2-streak, 3-streak).

For these four tasks it needs, at minimum: **subscribed / unsubscribed toggle**, **content has-preview / no-preview toggle**, and **portrait / landscape**. Without those, every branch of the play journey has to be reached by tapping all the way through — which makes the clickthrough prototypes hard to demo.
