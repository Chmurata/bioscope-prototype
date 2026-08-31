# Subtask 1a — Content playable in portrait mode

**Mother task:** `M1_PLAY_JOURNEY.md` · Q3
**Sheet note:** *"Currently content play occurs in landscape, need that in potrait mode as well like mygp sdk"*
**Reference:** `../references/player/01-single-content-detail-player.png`

---

## The layout, settled

Portrait is **an inline 16:9 player pinned to the top of a scrolling detail page.** Not full-bleed vertical. Everything below the video scrolls beneath it; landscape is reached through the expand control at the video's bottom-right.

This was the open question blocking this subtask. The reference answers it.

## Player chrome

**Top row, over the video:** back arrow (left) · picture-in-picture · cast · settings gear (right).

**Bottom row, over the video, one line:** `00:12 / 3:30` · seekbar (cyan fill, circular handle) · expand-to-fullscreen.

**Centre, over the video: play/pause**, plus skip back / skip forward. Absent from the reference by omission — the source Figma simply did not include them. They belong on the surface, revealed and hidden with the rest of the chrome.

Picture-in-picture and cast are both new to the prototype and both need at least a resting and an active state.

## Page beneath the player

Centred: title → genre row (underlined, bullet-separated, tappable) → meta row (`2 h 35 min`, then outlined `HD` and `16+` badges) → CTAs → action row → **See more ⌄**.

**`X-RAY` is dropped** — it was a mislabelled genre tag in the source, not a real capability. Genres live in the row above.

Then left-aligned: **More like this**, a 3-across portrait poster grid, two rows plus.

**Action row** — five circular icon buttons with labels: like with its count (`7.8k`), Trailer, My List, Share, Download.

## Screens

| # | Screen | Notes |
|---|---|---|
| A1 | Detail page — entitled | Inline player, `Play Now` |
| A2 | Detail page — See more expanded | Synopsis, cast, details |
| A3 | Player — chrome visible | Both control rows plus centre play/pause and skip |
| A4 | Player — chrome hidden | Resting state; tap reveals |
| A9 | Player — paused | Distinct from chrome-hidden; chrome stays up while paused |
| A5 | Player — settings sheet | Quality, speed, subtitles. Extend `PlayerSettingsSheet.jsx` |
| A6 | Landscape / fullscreen | The expand target |
| A7 | Rotation handoff | How A3 and A6 exchange |
| A8 | Picture-in-picture — active | Page state while PiP is running |

## Notes for the build

- The inline player in the reference runs a **3:30** asset against a **2 h 35 min** title — it is a trailer or preview, not the feature. Whatever the fixture plays inline should be short.
- `Seekbar.jsx` exists but runs a fixed 15-second fake. Portrait needs it driven by the real fixture duration.
- The prototype's only player is the vertical microdrama one. This is a new component, not a variant of it.

## Open questions

1. **Does the inline player autoplay on arrival, or wait for a tap?** All three reference frames show it mid-playback at `00:12`. **Assume autoplay, muted, with the promo clip** — it matches the frames and it is the common pattern. Easy to reverse.
2. **Cast destination picker** — the icon is enough for the clickthrough. Draw a single picker state only if there is time.
