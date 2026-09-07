# Watching & Paying — Revision Plan (matrix v2)

Source: Anik's 6-row matrix (User Type × Trailer? × Preview? → On Load / PopUp / Primary CTA / CTA Action), 2026-09-07.

## Matrix

| # | User | Trailer | Preview | On load | Popup after 1st action | Primary CTA | CTA action |
|---|------|---------|---------|---------|------------------------|-------------|------------|
| 1 | Non-sub | No | No | Thumbnail show | N/A | Subscribe / Rent | Subscribe page filtered by content |
| 2 | Sub | No | No | Play content, portrait | N/A | — | — |
| 3 | Non-sub | Yes | No | Play trailer | Modal | Subscribe / Rent | Subscribe page filtered by content |
| 4 | Sub | Yes | No | Play content, portrait | N/A | — | — |
| 5 | Non-sub | Yes | Yes | Play preview | Modal | Subscribe / Rent | Subscribe page filtered by content |
| 6 | Sub | Yes | Yes | Play content, portrait | N/A | — | — |

## What already matches

- **On-load autoplay** is already the behaviour: `ContentDetailScreen.jsx:21` has `playing` defaulting to `true`, so playback starts as soon as `playState.mode !== 'none'`.
- **Rows 2/4/6** — subscribed/entitled resolves to `playState.mode === 'content'`, playing `feature.mp4` uncapped inline in the portrait `aspect-video` container (`:41`, `:115`). No route change. Correct as-is.
- **Row 1 on-load** — not entitled with neither clip gives `mode:'none'` (`:54`), showing poster/backdrop. That is the "thumbnail show" state.
- **Rows 3/5 on-load** — preview wins over trailer (`:46` capped at `endTime: 40`, `:50` trailer uncapped). Correct precedence.
- Popup fires once per visit only; that guard already exists.

## Deltas to build

### D1 — Primary CTA becomes "Subscribe / Rent", unconditionally, for every non-subscribed row
Today the primary CTA is conditional: **"Subscribe"** (crown, gradient pill, `:186-192`) only when the title is paywalled *and* a recommended pack resolves; otherwise it falls back to **"Play Now"** (`:194-202`). The matrix says every non-subscribed row shows one CTA reading *Subscribe / Rent*, and play is owned by the transport/thumbnail affordance, not the primary CTA. So:
- Drop the "Play Now" fallback from the primary CTA slot for non-subscribed users.
- New single CTA labelled per the matrix. Rent is currently only reachable *inside* `PaywallSheet`'s `rent-checkout` stage (`PaywallSheet.jsx:105`) — there is no Rent entry point on the detail page at all today.
- Subscribed rows show no primary CTA (matrix column is "—"), which is a removal, not a relabel.
- Titles with `rentPrice: null` need a decision (see Q3).

### D2 — CTA destination changes from paywall sheet to a content-filtered pack catalogue
Today the CTA calls `setPaywallContext({ origin: 'locked-tap', content, initialPackId })` and opens the bottom sheet in place. The matrix wants "Subscribe Page filtered by Content", i.e. `PackCatalogueScreen` showing only packs that cover this title. Work:
- `PackCatalogueScreen` currently accepts **zero props** and is rendered bare (`App.jsx:173`), and navigation carries no content context (`AppContext.jsx:160`, `navigate(SCREENS.PACK_CATALOGUE)`). Thread a `contentId` (or `contentFilter`) through the navigate call, context, and screen.
- The data already supports it: each fixture carries `packs: [id, ...]` (e.g. `shaan: ['standard','super','premium-annual']`), and `PaywallSheet.jsx:79-81` already filters on exactly that field. Reuse that predicate, don't invent a second one.
- Its existing filters are `VALIDITY_OPTIONS` and `PLATFORM_OPTIONS` (`PackCatalogueScreen.jsx:8-9,23-24`). The content filter has to compose with those, and needs a visible, dismissible indicator ("Packs for <title>") plus a way back to the unfiltered catalogue — otherwise the filtered view is a dead end that looks like the whole catalogue.
- Checkout itself stays in `PaywallSheet` (rent + subscribe stages), now launched from a pack card in the catalogue rather than from the detail page.

### D3 — Post-playback paywall becomes a modal, not the 85% bottom sheet
`handleBoundaryReached` (`ContentDetailScreen.jsx:64-75`) currently opens `PaywallSheet` — an `absolute bottom-0 rounded-t-[20px]` sheet at `max-h-[85%]`, growing to `h-[95%]` for checkout stages (`PaywallSheet.jsx:230`). The matrix calls this a **Modal**. That splits one surface into two:
- **Interrupt modal** — small, centred, over the frozen final frame: what you just watched was a preview/trailer, and one Subscribe / Rent action leading to D2's filtered catalogue. Dismissible back to the detail page.
- **Checkout sheet** — the existing tall sheet, kept for the actual purchase stages.
This is the largest single change and the one with the most ambiguity (Q1).

### D4 — Row 1 must not open the paywall on a thumbnail tap
Today `handlePlayTap` (`:77-83`) fires the paywall with `origin: 'locked-tap'` when there is nothing to play. Row 1's popup column is explicitly N/A, so that tap should no longer summon the paywall; the only path is the primary CTA. Confirm this is a deliberate removal rather than an omission from the matrix (Q2).

## Open questions for Anik

1. **Modal shape** — is "Modal" a genuinely different, smaller centred dialog, or just shorthand for "the paywall interrupts here"? If it is a real modal, does the existing tall sheet survive for checkout, or does everything become modal?
2. **Row 1 tap** — should tapping the locked thumbnail do nothing at all, or still be a shortcut into the CTA's destination?
3. **"Subscribe / Rent"** — one button opening a choice, two side-by-side buttons, or one button whose label depends on whether `rentPrice` exists on the title?
4. **Filtered subscribe page** — is it a filtered state of the existing catalogue (recommended), or a separate screen? And should rent appear there too, or stay inside checkout?
5. Rows cover trailer-yes/preview-yes but the matrix has no **preview-without-trailer** row. Assume it behaves as row 5 (preview plays, modal after)?

## Files in scope

- `src/screens/ContentDetailScreen.jsx` — `playState` memo, `handlePlayTap`, `handleBoundaryReached`, CTA block (`:186-202`)
- `src/components/.../PaywallSheet.jsx` — split interrupt vs checkout; `contentPacks` predicate at `:79-81`
- `src/screens/PackCatalogueScreen.jsx` — accept + apply content filter, filter indicator
- `src/App.jsx` (`:173`), `src/context/AppContext.jsx` (`:160`) — thread content context through navigation
- `src/data/content.js` — no schema change needed; `packs`, `hasTrailer`, `hasPreview`, `isPaywalled`, `rentPrice`, `rentHours` all already present

---

# Reconciliation with the 07 Sep review meeting

Source: Bioscope Review Meeting, 07 Sep 2026 (46 min, Bengali; https://fathom.video/share/x7xPNy2a4BTGyd6u6vsxfdYmNvzp-N4X). Transcript is ASR-garbled with long repeated blocks — everything below is what was recoverable with reasonable confidence. Items marked **[low confidence]** need confirming against the recording or Evan's written feedback (he committed to mailing the full list).

The meeting **resolves most of the open questions above and changes three of the four deltas.** Read this section as authoritative over the matrix-only reading where they disagree.

## R1 — The popup is a bottom sheet with two buttons, not a small modal (resolves Q1)

Evan was explicit: *bottom sheet*, repeatedly. And: two buttons live in it, of which only one is active today ("দুইটা button আছে... এখন একটা button active, but ওখানে কিন্তু দুইটা button আছে"). The second is **Rent** — present when the title carries a `rentPrice`, absent when it doesn't ("এটা যদি রেঞ্চ থাকে তাহলে ভালো হয়ে আসবে... আর যদি হচ্ছে নি").

So **D3 is largely cancelled.** The existing `PaywallSheet` bottom sheet stays as the post-clip interrupt. The work shrinks to: surface Subscribe *and* Rent as two peer buttons in the `prompt` stage, conditional on `rentPrice`, instead of routing rent through a later stage only.

## R2 — Top CTA is Subscribe alone; Rent is not a top-level CTA (revises D1, resolves Q3)

The matrix column reads "Subscribe / Rent", but in the meeting Evan rejected two CTAs at the top of the detail page — "দুইটা, জাস্ট টপ দরকার নাই" (don't need two at the top), twice. Subscribe goes straight through: "সাবস্ক্রাইব করলে ডায়ারেক্ট সাবস্ক্রাইব পাঠায়... ওই ভিওডি পেজে চলে যাবে."

Reading: "Subscribe / Rent" in the matrix cell is *the pair of paths available*, not one button's label. On the page it is a single **Subscribe** CTA. Rent is reached from the bottom sheet (R1). D2's destination — subscribe page filtered by the content — is confirmed unchanged.

## R3 — The big round transport button is demoted, split, and stays portrait (new, largest change)

This is the substantial new requirement and it is not in the matrix at all.

- **Two separate affordances, Trailer and Preview.** Today one round transport button changes its label between them. Evan wants both reachable: the button at the bottom auto-starts the trailer, so a user who wants the *preview* has no way to ask for it — hence a secondary Play Preview action ("নিচে... secondary, play preview").
- **Each carries a playing/active state.** "প্রিভিউ বাটনটা প্লেইং এর একটা স্টেট থাকা উচিত" — so it is visible which clip is running and there is no confusion between the two. Applies to both buttons.
- **Shrink them and move them next to Like.** "লাইক এর পাশে ট্রেলারের... ছোট করে, আর এখানে স্টেটটা মার্ক করা" — small icon buttons in the action row beside Like, not the current large round transport control.
- **Playback stays portrait.** Tapping trailer currently ends up landscape; Evan does not want that — "এটা যে আপনার পোর্ট্রেটে প্লে হবে". Check `LongFormPlayer.jsx:31`, where `activeFullscreen = isFullscreen || orientation === 'landscape'`, for whether trailer/preview playback is inheriting that path.
- **UI polish flagged** on these icons ("UI-টা একটু cool করা যাবে") — icon treatment, not layout.

## R4 — The two buttons' copy collides; needs new wording (new)

"ওয়ার্ডিংটা সেম হয়ে যাচ্ছে না?" — the two buttons read too alike. Evan asked for user-friendly copy and gestured at a continue-watching phrasing, then asked **Anik to draft the copy options and bring them back**. Colours he signed off as-is ("কালার ঠিক আছে").

Action: produce 2-3 labelled copy options for the sheet's Subscribe/Rent pair (and for the trailer vs preview buttons, which have the same collision problem), for Evan to pick from.

## R5 — Confirmed as already correct

- Non-subscribed with neither trailer nor preview → content zone shows the thumbnail, tap to play is the CTA path. "এটা তোমাদের অলরেডি আছে."
- Subscribed → just play the content, no interruption. "Subscribe user-এর... আমি basically কিছু করতে চাই না, আমি play করাই দিবো content-টা."

## Out of scope for Watching & Paying, but raised in the same meeting

These belong to the Vouchers and Offers sections; logged here so they aren't lost, and should move into their own specs.

- **Voucher denominations are money, not durations.** The single clearest product correction in the meeting: voucher cards currently show validity as "1 month / 12 months", but vouchers are sold in currency denominations — "ভাউচার হচ্ছে মানি, রুপিতে", five-thousand / ten-thousand style tiers — and "এটাই ইউনিভার্সালি সব জায়গায় এটাই থাকে". The duration framing on both the card and the detail is wrong and needs replacing with denomination. Evan is sending a screenshot; he named **Netflix's voucher depth as the reference** to follow.
- **Grid the voucher cards** — "ভাউচারগুলো গ্রিড করে ফেলো", with an accent/emphasis treatment on the card image.
- **Offers & Discounts cards** have drifted from the prototype. Evan's position: the *concept* is fine, the cards aren't exactly the design, and he will supply the design later — so don't rebuild them speculatively.
- **[low confidence]** A block about mobile browser, player at the top and a banner below it ("player is up there... banner is down there", repeated many times by the ASR). Possibly a mobile-web layout requirement — player pinned top, promotional banner beneath. Do not act on this until confirmed.
- Evan will send the **full written feedback by mail**; treat that as the closing list for this round.

## Revised open questions

Q1 (modal shape) and Q3 (Subscribe/Rent labelling) are answered by R1 and R2. Remaining:

1. **Q2 stands** — for a non-subscribed title with nothing to play, does tapping the thumbnail open the sheet, or is the top Subscribe CTA the only route? The meeting confirmed the thumbnail state but not the tap behaviour.
2. **Q4 stands** — is the content-filtered subscribe page a filtered state of the existing catalogue, or a distinct screen? Evan said "direct subscribe / VOD page" without settling which.
3. **Q5 stands** — no matrix row covers preview-without-trailer; assume it behaves as row 5.
4. **New** — where does the Preview button sit relative to Trailer once both shrink into the Like row, and what is the order of that row?
5. **New** — when both trailer and preview exist, does the trailer still auto-start on load, or does the preview (matrix row 5 says preview plays; the meeting describes the bottom button auto-starting the trailer)? These may conflict.

---

## R6 — Autoplay priority settled (Anik, 07 Sep)

Preview outranks trailer. When a title carries both, the **preview** auto-plays on load; the trailer is reachable only through its own small button in the Like row. When only one of the two exists, that one auto-plays. When neither exists, the thumbnail state stands (R5).

This closes the matrix-vs-meeting conflict noted in the previous revised-questions list, and it matches the code as it already stands: `ContentDetailScreen.jsx:46` (preview branch, capped at `endTime: 40`) is evaluated before `:50` (trailer branch). No change to `playState` precedence is needed — only the two buttons and their playing states (R3) are new.

Consequence for R3: the button that "auto-starts" is whichever clip is playing, so the *other* button is the one that needs to read as an idle, tappable alternative. Both still need a playing state, because either can be the running clip depending on the title.

## R7 — Remaining calls, settled (Anik, 07 Sep)

1. **Locked thumbnail tap does nothing.** For a non-subscribed title with neither preview nor trailer, the top Subscribe CTA is the *only* route to the paywall. The `origin: 'locked-tap'` paywall trigger in `handlePlayTap` (`ContentDetailScreen.jsx:77-83`) comes out.
2. **Filtered state of the existing catalogue** (Anik's call: "choose your own"). No new screen — `PackCatalogueScreen` accepts an optional content filter and composes it with its existing validity/platform filters, with a dismissible "Packs for <title>" indicator that clears back to the full catalogue. Rationale: the pack cards, filter chrome and checkout entry already live there; a second screen would duplicate all of it and drift.
3. **Action row order** (Anik's call: "you decide"): `Like · Preview · Trailer · My List · Share`. Rationale: the two clip buttons sit adjacent so they read as one either/or pair rather than two unrelated controls, and they take the centre of the row where the old round transport button already drew the eye. Preview precedes Trailer to mirror the autoplay priority in R6. Titles missing one of the two simply omit that button rather than showing it disabled — a disabled clip button next to an identical enabled one is the confusion Evan flagged in R4.
