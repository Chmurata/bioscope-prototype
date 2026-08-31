# Subtask 1d — Clear CTA for subscription paywall

**Mother task:** `M1_PLAY_JOURNEY.md` · **ClickUp:** UI - UX | Play journey improvement | Clear CTA for subscription paywall

The convergence point of the play journey. Preview-end (1b), trailer-end (1c) and a tapped locked title all arrive here.

**The paywall offers two purchase paths, not one.** The detail-page reference shows `Subscribe` (amber, crown) and `Rent for TK 99` (white) as siblings — subscription and TVOD rental. The paywall must carry both.

**Scope note:** the pack *page* is a separate mother task (`M2_PACK_PAGE_REVAMP.md`). This subtask owns the paywall moment and the compact in-player pack sheet it escalates to — not the catalogue.

## Inputs

| Source | What it gives |
|---|---|
| `SUBSCRIPTION_FLOW_BASELINE.md` | The built 5-stage sheet at rebuild fidelity — reuse, don't redesign |
| `../references/subscription/01-mobile-balance-payment-flow.png` | Real checkout and success behaviour |
| `../DATA_MODEL.md` §4 | `paywall.origin`, `resumeAt` |

---

## One shell, three lead-ins

`paywall.origin` decides the framing copy and what sits behind the scrim. Nothing else varies.

| Origin | Behind the scrim | Framing | After payment |
|---|---|---|---|
| `preview-end` | Preview's last frame, held | The free window is spent | **Player, this content** |
| `trailer-end` | Trailer's last frame | Trailer finished; the content is paywalled | **Player, this content** |
| `locked-tap` | Content detail page | No video — the user never started playing | **Player, this content** |
| `generic` | Wherever Subscribe was pressed | No content in context | **Home** |

`generic` is the amber Subscribe pill in the home top bar. Nothing to return to, so payment ends at Home — matching the live reference's "Browse Home".

## Screens

| # | Screen | Notes |
|---|---|---|
| D1 | Paywall — preview end | "You've watched the free 5 minutes" |
| D2 | Paywall — trailer end | Different lead-in, same shell |
| D3 | Paywall — locked tap | No video behind it |
| D4 | Compact pack sheet | Packs that unlock *this* content, recommended first. **No filters** — those live on the pack page this links out to |
| D5 | Rent confirmation | `TK 99` · **48 hours from first play** · straight to checkout |
| D6 | Post-purchase return | Player for a content-origin paywall; Home for `generic` |

### Shell

Built on the existing sheet (`bg-[#0A090B] rounded-t-[20px] ring-1 ring-white/5`, spring `damping:34 stiffness:320`) but **compact, not `h-[95%]`** — full height over a paused player buries what the user was watching.

Top→bottom: origin framing → the content's title, so it is obvious what is being unlocked → **the two purchase paths** → "See all packs" → dismiss.

**Subscribe vs Rent.** Subscribe is the higher-value path and takes the primary amber treatment; Rent is the white secondary. The rental price is content-specific (`TK 99`) while the subscription price is not, so rent states a price and subscribe states a value — "unlock this title" against "unlock everything".

Rent skips pack selection entirely: one price, straight to checkout. That makes it the shorter path, which is worth watching — the cheaper immediate option should not out-compete the subscription by being three taps faster.

**Rental term: 48 hours from first play.** State it on the CTA area or the confirmation, not only in fine print — a rental whose clock the user does not understand generates support load and distrust. The confirmation should also make clear the window starts on first play, not on purchase.

Dismiss must be real and obvious. `locked-tap` in particular was entered from a page the user was browsing; a paywall they cannot back out of is a trap.

### D4 — packs filtered by content

A paywall raised on a specific title surfaces the packs whose `scope` covers it, not the whole catalogue. Each shows price, duration and per-pack payment eligibility, using the shared pack card from `M2_PACK_PAGE_REVAMP.md` — **built there, consumed here.**

---

## What must change in the built flow

1. **Framing block above the plans**, varying by origin — the sheet currently always opens on "Choose Your Plan".
2. **Compact variant** of the shell.
3. **Success copy** — *"All microdramas unlocked"* is wrong for long-form.
4. **Success must route by origin, not just close** — player for content-origin, Home for `generic`. The CTA label follows: "Start watching" vs "Browse Home".
5. **The unlock has to be real** — `handlePay` flips `isVip`, which nothing reads. Without this the journey dead-ends at success.
6. **Plans filtered by `requiredPacks`** — all three currently always show.

## Open questions

1. **Does the compact sheet show filters?** Specced as no — filters belong on the pack page it links out to.
2. ~~Does rental appear on every paywalled title?~~ **Resolved for the prototype** — `bangla-original` in `../FIXTURES.md` §2 carries no rent price, so the single-CTA paywall layout is reachable from a normal browse.
3. **Stacked or side-by-side CTAs?** **Decided: stacked.** Full width for each, and it avoids setting two differently-priced commitments at equal visual weight.
