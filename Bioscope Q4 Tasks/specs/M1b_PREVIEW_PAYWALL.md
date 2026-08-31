# Subtask 1b — Content preview before paywall + Preview button

**Mother task:** `M1_PLAY_JOURNEY.md`
**Sheet note:** *"Watch preview where preview type of clip is attach with a content. gp will create clip and set first 5 mins free for that content. Then go to subscribe page for purchase. Preview will get higher priority over trailer."*
**Reference:** `../references/player/01-single-content-detail-player.png`

Preview is a **clip bound to the content**, authored by GP with the first ~5 minutes free. Not a truncation of the feature. It **outranks the trailer** when both exist.

---

## Where the Preview button goes

The reference's detail page has two candidate homes, and they carry different weight:

- **Primary CTA area** — currently `Play Now` when entitled, `Subscribe` / `Rent for TK 99` when not
- **Action row** — where `Trailer` already lives as a circular icon

Since preview outranks trailer, and the unentitled CTA area is already carrying two purchase paths, **put Preview in the CTA area as the free-to-try option and leave Trailer in the action row.** That gives the unentitled page three actions in a clear order: try it free, subscribe, or rent.

*This is a design proposal, not something the reference settles.* The reference has no preview state.

## Screens

| # | Screen | Notes |
|---|---|---|
| B1 | Detail page — preview available | Preview CTA present alongside Subscribe / Rent |
| B2 | Detail page — no preview | Preview CTA absent; Trailer remains in the action row. The fallback into 1c |
| B3 | Preview playing | Free-window indicator — how much of the 5 minutes remains |
| B4 | Preview approaching end | Warning before the cut |
| B5 | Preview ended | Hands to `M1d_PAYWALL_CTA.md`, origin `preview-end` |

## The free-window indicator

The one piece with no precedent in either reference. The user needs to know, without being nagged, that they are inside a limited window. It has to survive the chrome-hidden resting state — a countdown that vanishes when the controls do is useless.

Options worth drawing: a persistent small label near the seekbar; a marked end-point on the seekbar track itself; or a segment of the track styled as free with the remainder as locked. The third reads best — it makes the boundary spatial rather than numeric, and it keeps working when the chrome hides.

## Open questions

1. **Is 5 minutes fixed platform-wide, or per content?** The sheet says "first 5 mins" for a specific case.
2. **When the preview ends, does the frame hold or cut to the poster?** Holding the last frame keeps the paywall connected to what was being watched.
3. **Can the preview be replayed** after the paywall is dismissed, or is it one-shot?
