# Mother task 1 — Play Journey Improvement

**Sheet row 4** · UX Status `WIP` · the only mother task already ticketed in ClickUp.

Four subtasks, all created 25 Aug 2026 by Shakin Ul Alam, assigned to Anik Roy, `TO DO`, tagged `p4`, none with a description.

| Subtask | ClickUp title | Spec | Quarter |
|---|---|---|---|
| **1a** | Content playable in portrait mode | `M1a_PORTRAIT_MODE.md` ✅ | Q3 |
| **1b** | Content preview before paywall (Preview as a Clip Type can be binded with a content), Preview Button | `M1b_PREVIEW_PAYWALL.md` ✅ | — |
| **1c** | Auto play logic after trailer completion | `M1c_TRAILER_AUTOPLAY.md` ✅ | Q4 |
| **1d** | Clear CTA for subscription paywall | `M1d_PAYWALL_CTA.md` ✅ | Q4 |

All four specced against `../references/player/01-single-content-detail-player.png`.

---

## The rule these four implement

**Preview outranks trailer, and subscription outranks both.**

```
Subscribed?
├─ yes → content plays directly, no trailer                    [1c]
└─ no
   ├─ preview clip bound to content? → preview → paywall       [1b, 1d]
   └─ no preview                     → trailer → paywall       [1c, 1d]
```

1b and 1c are two entry paths into the same exit. **1d is that exit** — one paywall moment with three lead-ins, not three screens. 1a is orthogonal: it changes the player's orientation regardless of which path got the user there.

## Two things the references added

**Portrait is settled** — an inline 16:9 player pinned to the top of a scrolling detail page, not a full-bleed vertical player. Landscape via an expand control at the video's bottom-right.

**Rental exists.** The detail page offers `Subscribe` and `Rent for TK 99` side by side. TVOD on long-form appears nowhere in the roadmap sheet — it mentions pay-per-view only under Shorts. Subtask 1d now carries both purchase paths.

## What the live app already tells us

From `../references/subscription/01-mobile-balance-payment-flow.png`, frame 1: the hero carries **"Play Now" and "Play Trailer" as sibling CTAs**. The trailer is a deliberate user choice, not something that auto-rolls.

That reframes 1c — it is not an interruption to design around, it is what happens after a trailer the user chose to start. And 1b's Preview button joins that same CTA group rather than replacing anything.

## Prerequisites

Both are prototype-side, unblocked, and shared by all four subtasks. Neither exists today.

1. **Entitlement state** — `isVip` in `src/contexts/AppContext.jsx` is written and never read. Every subtask branches on subscription status. See `../DATA_MODEL.md` §1.
2. **A long-form content model with clip types** — main, trailer, preview — plus a content detail page and a long-form player. The prototype has only microdrama objects and a vertical player. See `../DATA_MODEL.md` §2–3.

## Blocker

The unsubscribed trailer → subscribe forward (1c) is flagged **"need RnD"** in the sheet. Everything else here can proceed without it.
