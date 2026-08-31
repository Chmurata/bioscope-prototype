# Subtask 1c — Auto play logic after trailer completion

**Mother task:** `M1_PLAY_JOURNEY.md` · Q4
**Sheet notes:** *"If user is already subscribed then trailer would not play, actual would play (follow deepto journey)"* · *"For unsubscribed user first trailer will play, then it will forward user to subscribe page (need RnD)"*
**References:** `../references/player/01-single-content-detail-player.png` · `../references/subscription/01-mobile-balance-payment-flow.png` frame 1

---

## What the references reframe

The trailer is **something the user chooses**, not something that ambushes them:

- **Home hero** — `Play Trailer` sits beside `Play Now` as a primary CTA
- **Detail page** — `Trailer` is a circular icon action in the row beneath the CTAs

So this subtask is not about an interruption. It is about **what happens when a trailer the user deliberately started reaches its end.**

That makes the "forward to subscribe page" note less aggressive than it first reads — but it is still a redirect away from a player the user opened, and it is the piece the sheet flags as needing RnD.

## The two branches

**Subscribed** — the trailer does not play at all. The feature plays directly. The `Play Trailer` CTA presumably remains available as a deliberate choice, but nothing auto-substitutes.

**Unsubscribed** — the trailer plays, and at the end the user is forwarded to subscribe.

## Screens

| # | Screen | Notes |
|---|---|---|
| C1 | Subscribed — content plays directly | No trailer substitution |
| C2 | Trailer playing — unsubscribed | Entered from the hero CTA or the detail action row |
| C3 | Trailer ending — last frame holds | The frame the paywall rises over |
| C4 | Trailer end → paywall | Hands to `M1d_PAYWALL_CTA.md`, origin `trailer-end` |

## The trailer-end mechanism — decided

**At trailer completion, the last frame holds and the paywall rises over it immediately (0.3s slide-up). No countdown.**

The reasoning against a countdown: the user opened a trailer for a title they cannot watch. The trailer ending *is* the signal — there is no ambiguity about what they were doing or what comes next. A countdown that everyone waits through is a step with no decision in it, and "5… 4… 3…" before a sales screen reads as pressure rather than courtesy.

The escape hatch is the paywall's own dismiss, which is always visible. That satisfies the sheet's "forward user to subscribe page" literally, without trapping anyone.

**Three rules make it safe:**

1. **Only completion triggers it.** Backing out mid-trailer returns to the detail page with no paywall. The user who stops watching has already said no.
2. **Dismissing returns to the detail page,** not to a dead player sitting on a final frame.
3. **It fires once per title per session.** Replaying the trailer after dismissing does not raise the paywall again. Without this rule the trailer becomes a trap, and someone rewatching a scene gets a sales screen every time.

C3 is therefore not a countdown card — it is the **trailer's final seconds with the last frame settling**, which is what the paywall then sits on top of. It stays a distinct screen because the held frame is what connects the paywall to what was being watched.

## Open questions

1. **If the content has a preview, does the trailer still appear anywhere?** Yes. Preview outranks trailer on the *paywall path*, but `Trailer` stays a separate icon action in the detail row — both remain user choices.
2. **GP's RnD** may land on a different mechanism. The decision above is defensible on its own and can be swapped without disturbing anything else, since the paywall shell is shared.
