# Mother task 4 — Dynamic Discounting

**Sheet row 7** · **unblocked** · depends on mother task 2's price presentation existing first.

Personalised, time-bound pricing. Sheet capabilities: segment-based offers · timer-based discounts · campaign control pane.

Direction notes: *"Segment based coupon code · Timer based coupon activation visulization · Specific time wise visulization like 12.00 A.M to 2.00 AM"*

---

## Two audiences in one row

**Customer-facing** — the discount as the subscriber experiences it. Ours.

**Campaign control panel** — an internal admin tool for authoring and scheduling offers. **Out of scope.** A separate product with its own users and no relationship to the mobile app's design language; folding it into a mobile clickthrough prototype would produce something neither audience can use. Flag it if that is wrong.

The sheet leaves the `UI Required` column blank for this row, but every line of its direction notes is a display requirement — "visulization" three times over. The work is real; the column was just unfilled.

## Where it attaches

The live checkout already has the socket: a collapsed **"Discount ⌄" expander** sitting above Amount Payable (`../references/subscription/01-mobile-balance-payment-flow.png`, frame 3). Mother task 2 rebuilds that checkout; this task fills the expander.

The pack card's struck-price treatment is the other attachment point — and it is `originalPrice` in the live app, a real former price, so a campaign discount is a **third** price state, not a reuse of the existing strike.

## Provisional screen set

Not a spec. Written after mother task 2's price presentation lands.

Pack page with segment offer active · offer countdown · time-window offer (upcoming / active / ended) · coupon entry · coupon applied with itemised breakdown · coupon rejected (invalid / expired / not eligible for segment) · offer ending mid-session. **~7 screens.**

## Open questions

1. **Segment offer vs segment eligibility.** The live app already uses segment badges for *eligibility* ("Only for Skitto Users"). Segment-based *pricing* is a second use of the same idea on the same card. They have to be visually distinguishable.
2. **Does a campaign discount stack** with a pack's existing struck `originalPrice`? Three prices on one card does not work — so either it replaces the strike or it is shown somewhere else.
3. **What happens to an offer that expires mid-checkout?** Selecting at one price and confirming at another is a trust problem. Worth a screen either way.
