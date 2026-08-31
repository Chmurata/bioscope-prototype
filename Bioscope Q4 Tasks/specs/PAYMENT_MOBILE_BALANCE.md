# Mobile balance payment — direct carrier billing

**Confirmed required** (30 Aug 2026).
**Reference:** `references/subscription/01-mobile-balance-payment-flow.png` — 9 frames, home through payment success.

This supersedes an earlier speculative version of this spec. Several assumptions in it were wrong; they are called out at the bottom so they are not repeated.

---

## The flow as designed

```
Home (logged in)
└─ Subscribe
   └─ Choose Your Plan                          [Bioscope+ dark]
      └─ Checkout                               [Bioscope+ dark]
         plan summary · auto-renewal · payment method · discount · amount
         └─ Continue to Payment
            └─ Carrier panel                    [Grameenphone, white]
               1. mobile number + consent  → Get OTP
               2. limit disclosure + OTP    → Confirm Payment
               └─ Payment Successful         [Bioscope+ dark]
```

The carrier stage is **an operator-branded white panel nested inside the Bioscope+ dark Checkout shell** — the dark "Checkout" header stays, the body below it becomes Grameenphone's. This is co-branding, not a theme flip. It settles the open question in `SUBSCRIPTION_FLOW_BASELINE.md` about the existing white payment stage: white is correct, but it should carry operator identity rather than read as a generic light screen.

---

## Frame by frame

### F1 — Home, logged in
Bioscope+ logo, search, and an **orange/amber "Subscribe" pill** in the top bar — the persistent entry point. Category chips: Movie · TV Shows · Categories. Hero ("Wicked", `Drama · Action · PG 13`) carries **two sibling CTAs: "Play Now" and "Play Trailer"**, both with play icons, primary and secondary. Continue Watching rail with "See all →". Bottom nav: Home · Shorts · New · Live TV · Account.

**Relevant beyond payment:** the trailer is an explicit user choice on the hero, not something that auto-rolls. Task B's Preview button joins this CTA group — and Task C's "auto-play after trailer completion" applies to a trailer the user deliberately started. That reframes Task C: it is not an interruption, it is what happens after a chosen trailer ends.

Live TV is a bottom-nav tab here. Our prototype dropped it for the Microdrama tab.

### F2 — Choose Your Plan
Back arrow, "Choose Your Plan". Flexiplan card (crown, "Make your custom plan in 2 simple steps", "+ Create Package"). "or" divider. Then plan cards:

| Plan | Badge | Duration | Telco value | Price |
|---|---|---|---|---|
| Standard | Recommended for All | 1 Week | `5 GB Internet` | ~~৳149~~ **৳99** |
| Duo Binge + GP User Plan with Minutes | Best for GP Users | 1 Month | `30 Min + 100 SMS` | ~~৳299~~ **৳179** |
| Family + 5GB Internet | Only for Skitto Users | 3 Months | — | ~~৳345~~ **৳229** |

Each says "Get access to 10 OTT platforms" above an OTT logo strip.

**Three findings.** Packs bundle **telco value** — data, minutes, SMS — shown as a coloured chip beside the duration. Badges are **segment-targeted eligibility**, not just marketing: "Best for GP Users", "Only for Skitto Users". And the struck-through price is a **real former price**, not the `price × 1.5` the prototype invents.

### F3 — Checkout (Bioscope+)
Centered "Checkout" header. Plan card: title, `30 Days` with clock, "Get access to 10 OTT platforms" + logo strip, a description paragraph, then an **"Auto renewal" toggle (off by default)**.

"Select Payment Method" list, in order:
1. **Buy with Mobile Balance** — selected, highlighted, radio checked
2. `016####029` — "Saved by bKash" (saved instrument, masked)
3. bKash
4. Nagad

Then "Amount Payable" ~~৳699~~ **৳399**, a collapsed **"Discount ⌄"** expander, "Continue to Payment →", and "By continuing you are agreeing to Bioscope+'s Terms of Use and Refund Policy".

**Three more findings.** The **auto-renewal toggle lives at checkout** — that is the POL autorenewal roadmap row surfacing as UI, and it is opt-in. The **discount expander** is where Dynamic Discounting lands. And **saved instruments are real rows** with masked numbers, ranked above fresh methods — which is what the prototype's dead, permanently-unchecked "Saved by bKash" checkbox was gesturing at.

Mobile Balance is listed **first and pre-selected.**

### F4 — Carrier panel, number entry
Grameenphone logo, "Checkout", product row (Bioscope+ mark, "Bioscope+ Super", "30 Days"). "Mobile Number:" field, `+880` placeholder, empty. Checked consent box: *"I acknowledge and accept that charges for 30 Days Will be made to my mobile balance."* Buttons: **"Get OTP" (disabled)** and "Cancel".

Consent is **pre-checked** and precedes OTP.

### F5 — Number entered
`+880 1711092617`. "Get OTP" becomes enabled, operator blue. Nothing else changes.

### F6 — Limit disclosure + OTP
The panel expands. Product row now carries **`299 BDT`** and **`(15% VAT included)`**. Below it:

```
Mobile Number:              +880 1711092617
Monthly Limit Used:         BDT 260
Yearly Limit Used:          BDT 2680
Mobile Number:              +880 1711092617      ← duplicated in the mock
Monthly Limit will Remain:  BDT 21441
Yearly Limit will Remain:   BDT 9021
```

"Please Enter OTP:" with a focused empty input. "Confirm Payment" (disabled) and "Cancel".

**This is the most important frame.** Direct carrier billing carries **regulatory spending-limit disclosure** — monthly and yearly, used and remaining. It is a compliance surface, not a courtesy, and it appears *after* OTP is requested rather than at method selection. It also settles VAT: **prices are VAT-inclusive at 15%, stated on the carrier panel.**

The duplicated "Mobile Number" row is a mock error, not a requirement.

### F7 — OTP entered
`9261`. "Confirm Payment" becomes enabled, operator blue.

### F8 — Payment Successful
Back to Bioscope+ dark. Green circled check, "Payment Successful", then: *"Payment successful. It may take a moment to reflect on your account. please be patient."* Single CTA: **"Browse Home"**.

**Settlement is asynchronous.** The user is told entitlement may not be active yet. This is materially different from the prototype's instant "You're Premium! — All microdramas unlocked", and it means the success state cannot promise immediate access.

The CTA returns to Home. It does **not** resume anything.

---

## What this changes elsewhere

**Stage 3 of the subscribe sheet becomes two sub-stages,** not one: number + consent, then OTP + limit disclosure. Each gates its CTA disabled→enabled.

**Success routes by origin.** The reference ends at "Browse Home", which is right for a paywall with no content in context. A paywall raised on a specific title returns to that content's player instead — see `M1d_PAYWALL_CTA.md`.

**Checkout gains** an auto-renewal toggle (off by default), a collapsed discount expander, and saved instruments as real masked rows ranked above fresh methods.

**Pack cards gain** telco value chips, segment badges, and real struck prices — see `../DATA_MODEL.md` §5.

## Screens to build

| # | Screen | State |
|---|---|---|
| MB1 | Checkout — Mobile Balance selected | First in list, pre-selected; auto-renewal toggle; discount collapsed |
| MB2 | Carrier panel — empty number | Consent pre-checked, Get OTP disabled |
| MB3 | Carrier panel — number valid | Get OTP enabled |
| MB4 | Carrier panel — number invalid | Not in the reference; needed |
| MB5 | Carrier panel — OTP requested | Limit disclosure visible, OTP empty, Confirm disabled |
| MB6 | Carrier panel — OTP entered | Confirm enabled |
| MB7 | Carrier panel — OTP wrong | Not in the reference; needed. Retry and resend |
| MB8 | Payment Successful | Async settlement copy, "Browse Home" |
| MB9 | Payment failed | Not in the reference; needed. Limit exceeded vs carrier decline |
| MB10 | Row hidden / ineligible | Pack excludes `balance`, or subscriber unidentified |

MB4, MB7, MB9 and MB10 are ours to design — the reference only covers the happy path.

---

## Open questions

1. **Is the limit disclosure block mandated in that exact form?** It reads as a regulatory template. If it is, reproduce it rather than redesign it.
2. **What does limit exhaustion look like?** Not in the reference, and it is the interesting failure — a hard stop the user cannot resolve by topping up.
3. **Does the OTP resend?** No resend affordance appears in the reference.

## Corrections to the earlier draft of this spec

Recorded so they are not reintroduced:

- **Balance is never shown.** The earlier draft assumed showing available balance inline was the rail's main advantage. The real flow shows **regulatory spending limits**, not balance, and only after OTP is requested.
- **No prepaid/postpaid distinction** appears anywhere in the flow.
- **No insufficient-balance state** appears. The constraint surfaced is the spending limit, not the balance.
- **There is no recharge path.** The earlier draft specced insufficient-balance → recharge link-out. Not present.
- **OTP is the auth step**, and it was missing entirely from the earlier draft.
- **VAT is settled**: 15%, included in the displayed price, stated on the carrier panel.
- **No prepaid/postpaid split, no insufficient-balance state, no recharge path** — none appear. The constraint on screen is the spending limit, not the balance.
