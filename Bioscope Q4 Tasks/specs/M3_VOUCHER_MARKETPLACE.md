# Mother task 3 — Digital Subscription Product Selling

**Sheet row 6** · **unblocked for prototype purposes** — built on demo vouchers rather than waiting on partner specs.

Selling **third-party** OTT subscriptions out of platform: Netflix, Prime Video, OneGames and others.

Sheet capabilities: non-streaming product catalog · purchase & entitlement management · voucher delivery · disclosure & redirection flows · **voucher validity and package validity separation** · voucher marketplace UI.

**Reference:** [Figma — Bioscope · Meemnur, node 99-342](https://www.figma.com/design/o8cdupE6gPnXho8TDmt44B/Bioscope----Meemnur?node-id=99-342)
**Fixtures:** `../FIXTURES.md` §3 — 7 products, 3 pre-owned in the locker

The Tapshop wireframe and the partner API spec are still outstanding, but neither blocks a clickthrough. Demo vouchers show how the flow integrates; the wireframes can refine the storefront later.

---

## Why this is not a variant of the pack page

Everywhere else the user buys **access** the app itself honours. Here they buy a **code**, redeemed on someone else's service. Four consequences:

1. **It is a possession, not a state.** A voucher is a thing the user holds and must be able to find again.
2. **Two clocks.** Code validity (how long it stays redeemable) and package validity (what it grants once redeemed). They diverge — that divergence is the design problem the sheet is naming.
3. **Retrieval.** A code bought today is wanted next week. That needs a locker.
4. **Leaving.** Redemption happens off-platform, so the handoff and the return both need designing.

---

## Where it lives

Two entry points, no new bottom-nav tab:

- **Account** → "Vouchers & Gift Cards" — the browse entry
- **My Subscriptions** → owned vouchers appear alongside the active pack — the retrieval entry

Keeping it out of the bottom nav is deliberate. It is a secondary commerce surface, and the nav already has five slots with two dead.

---

## Screens

| # | Screen | Notes |
|---|---|---|
| V1 | Storefront | Grouped: Streaming · Music · Games. Brand tiles with price-from |
| V2 | Category / brand list | All products for one brand — Netflix Mobile 1m, Basic 3m, etc. |
| V3 | Product detail | Price, what it grants, **code validity stated up front**, what redemption involves |
| V4 | Disclosure | Third-party terms, non-refundable once revealed, redemption is off-platform |
| V5 | Checkout | Reuses the pack payment rails, minus Mobile Balance where partners disallow it |
| V6 | Success — code reveal | The code, a copy action, and the redeem link-out |
| V7 | Voucher locker | Owned vouchers, three states visible at once |
| V8 | Voucher detail — unredeemed | **Both clocks shown.** Code, days left to redeem, what it will grant |
| V9 | Voucher detail — redeemed | Package validity counting down; code shown spent |
| V10 | Voucher detail — expired unredeemed | The failure case. What happened, and why |
| V11 | Redirection handoff | Leaving Bioscope+ for the partner, with a way back |
| V12 | Locker empty | Before any purchase |

---

## The two clocks

The screen that earns this whole task. A voucher carries two independent countdowns and the user has to hold both in their head:

```
Bought 12 Aug          Code valid until 10 Nov  (90 days)
   │                          │
   └── redeemed 24 Aug ───────┴──> Package runs 24 Aug → 24 Sep (1 month)
```

**Design rule: only one clock is ever primary.** Before redemption, the code-validity countdown is the urgent one and the package duration is a static fact ("grants 1 month"). After redemption, they swap — the package countdown becomes primary and the code becomes history.

Showing both as equal countdowns is what makes this confusing, and it is the obvious thing to draw first. Do not.

**V10 exists because this can fail.** A code bought and never redeemed simply dies. That is the only screen in the app where a user has paid and received nothing, so it has to explain itself plainly rather than just showing a grey "Expired" chip.

---

## Purchase flow

```
Storefront → product → disclosure → checkout → code reveal → locker
```

Disclosure is a real step, not a checkbox. Three things must land before payment: the code is redeemed on the partner's own service, not in Bioscope+; it is non-refundable once revealed; and it must be redeemed within its validity window or it is lost.

---

## Open questions

1. **Delivery channel** — the locker is the source of truth. Whether SMS/email also fire is a business decision that does not change these screens.
2. **Does an unredeemed voucher appear in My Subscriptions?** Specced as yes, in its own group, visibly distinct from the active pack — it is bought but grants nothing yet.
3. **Refunds on a revealed code** — specced as no, and stated at disclosure.
