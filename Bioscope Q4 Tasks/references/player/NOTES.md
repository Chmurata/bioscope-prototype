# Player reference notes

| File | Shows | Settles |
|---|---|---|
| `01-single-content-detail-player.png` | 3 frames — "Single Content" (entitled) and two "Single Content - Subscribe" CTA layouts | Portrait layout, player chrome, CTA states, action row, TVOD rental |

---

# Single Content — detail page with inline player

Three frames of the same screen. Frame 1 is the entitled state; frames 2 and 3 are **two CTA layout options** for the unentitled state.

## The layout question is answered

**Portrait is an inline 16:9 player pinned to the top of a scrolling detail page** — the YouTube / MyGP pattern, not a full-bleed vertical player. Everything below the video scrolls under it. This settles the open question in subtask 1a.

---

## Player region

**Status bar** — 11:11, signal, battery. The media area begins at/behind it.

**Top control row, over the video:**
- Left: **back arrow**
- Right, in order: **picture-in-picture**, **cast**, **settings gear**

**Bottom control row, over the video, all on one line:**
- Left: elapsed / total — `00:12 / 3:30`
- Centre: **seekbar** — cyan filled track, light unfilled remainder, circular scrubber handle
- Right: **expand to fullscreen** (diagonal arrows) — the route to landscape

**Play/pause is missing from the reference by omission, not by design** — confirmed. The player has explicit play/pause controls; they were simply not drawn in the source Figma. Add them.

**The duration is the finding.** `3:30` against a title billed as `2 h 35 min`. The inline player is running a short asset — a trailer or preview — not the feature. Consistent across all three frames, including the entitled one where "Play Now" is offered. So the detail page's inline player is a promo surface, and the feature plays elsewhere or on demand.

*Uncertain:* whether it autoplays on arrival or waits for a tap. The frames all show it mid-playback at `00:12`, which suggests autoplay but does not prove it.

---

## Content block — centred

1. **Title** — large, bold, white, centred
2. **Genre row** — `Drama • Action`, each genre **underlined** (so: tappable), bullet-separated
3. **Meta row** — `2 h 35 min` followed by outlined pill badges: ~~X-RAY~~ **HD**, **16+**

**Correction (confirmed):** `X-RAY` is not a real capability — it was a mislabelled genre tag in the Figma source. **Drop the badge.** Genres already live in the row above; the meta row carries duration, quality and maturity only.

---

## CTAs — the state that varies

### Frame 1 — entitled
Single full-width **white pill**: ▶ **Play Now**

### Frame 2 — unentitled, stacked
- **Amber pill**, crown icon: **Subscribe**
- Below, full-width **white pill**: **Rent for TK 99**

### Frame 3 — unentitled, side by side
- **Amber pill** crown **Subscribe** (left) · **white pill** **Rent for TK 99** (right), one row

**Frames 2 and 3 are alternatives, not a sequence.** A layout decision to make: stacked gives both CTAs full width and a clear hierarchy; side-by-side keeps the action row above the fold. Stacked reads as the safer default — Subscribe is the higher-value path and deserves the full-width primary position, and side-by-side sets two differently-priced commitments at visually equal weight.

### Rental is new

**`Rent for TK 99` is TVOD on long-form** — pay once for this title, no subscription. **Rental term: 48 hours** (confirmed). It appears in no spec so far. The roadmap sheet mentions TVOD only under Shorts (pay-per-short / pay-per-series); here it is a first-class CTA on a feature film.

This changes subtask 1d materially: **the paywall is a choice between two purchase paths, not a single subscribe prompt.**

---

## Action row — 5 items, centred, evenly spaced

Circular icon buttons with labels beneath:

| Icon | Label | Note |
|---|---|---|
| Thumbs up | **7.8k** | The count *is* the label — social proof, not "Like" |
| Play in circle | **Trailer** | Trailer is a secondary icon action here, not a primary CTA |
| Plus | **My List** | |
| Share | **Share** | Currently a no-op in the prototype |
| Download arrow | **Download** | Offline downloads |

**Trailer's placement matters.** On the home hero (`../subscription/01-mobile-balance-payment-flow.png`, frame 1) "Play Trailer" is a primary CTA beside "Play Now". Here on the detail page it demotes to an icon action. Two different weights for the same asset, depending on surface.

---

## Below the fold

**See more ⌄** — centred, cyan, chevron-down. Expands to synopsis / cast / details.

**More like this** — left-aligned heading, then a 3-across grid of portrait posters with titles beneath. At least two rows.

---

## Colour observations

Near-black ground; white title; light-grey meta and outlined badges; **cyan** for the seekbar fill and the "See more" link — the same accent family as the subscribe flow's `#00BBFF`; **amber/gold** reserved for Subscribe, matching the home top-bar Subscribe pill.

Amber = subscription. Cyan = interactive text and progress. White = primary action.

---

## Status of this reference

These frames come from Anik's own Figma, not from a shipped build. They are the **starting point, not the contract** — elements may be added where the flow needs them and discarded where they are wrong. Two corrections are already applied above (X-RAY, play/pause).

## What this adds that no spec covered

- **Rental / TVOD** as a second purchase path
- **Picture-in-picture** and **cast** in the player chrome
- **Download** for offline
- **My List**
- **Like with a visible count**
- **More like this** rail on the detail page
- **See more** expander for synopsis
