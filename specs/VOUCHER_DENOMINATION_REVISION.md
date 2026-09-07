# Vouchers — denomination revision

Source: Bioscope review meeting, 07 Sep 2026. Evan's correction, the clearest product call in that session: **a voucher is a money instrument, not a subscription duration.** "ভাউচার হচ্ছে মানি, রুপিতে" — vouchers are sold in currency denominations, five-thousand / ten-thousand style tiers, and "এটাই ইউনিভার্সালি সব জায়গায় এটাই থাকে". He named **Netflix's gift-card depth as the reference** and is sending a screenshot. He also asked to **grid the voucher cards** with an accent treatment on the card image.

Today the entire voucher surface is duration-framed, and that framing is wrong at the data layer, not just in the copy.

## Currency model (Anik, 07 Sep)

**The denomination is in US dollars; the customer pays in BDT.** This is how gift cards for these brands actually work in Bangladesh — the card carries a `$10` face value, and Bioscope charges the taka equivalent. So the two amounts are genuinely different fields, not the same number twice:

- `faceValue` — the denomination, in **USD**, and the card's identity: `$5`, `$10`, `$25`.
- `price` — what the customer is charged, in **BDT**, shown with `৳`.

Conversion lives in one place: a `USD_BDT` constant in `src/data/vouchers.js`, set to `122`, with each product's BDT price derived from it and rounded to the nearest 10 so the storefront shows clean numbers. One constant to edit when the rate moves — never a second hardcoded taka figure anywhere in a component.

Both symbols appear together throughout, and the hierarchy is fixed: the **dollar denomination is the headline**, the taka price is the transactional line beneath it. Never show a taka figure as the denomination, and never imply the $ amount is what gets charged.

Remaining assumption, stated not confirmed: **redemption gives account credit, not a plan.** This is what makes the duration framing collapse — a $10 Netflix voucher becomes $10 of Netflix credit, and Netflix decides what that buys. Bioscope cannot know, and must not claim, how many months it grants.

## What is wrong today

`src/data/vouchers.js` has 7 products across 5 brands, each carrying:
- `product` — a display string that *encodes duration as text*: `'Mobile plan · 1 month'`, `'12 months'` (`:14-20`). The title itself is the duration.
- `grants` — free text, `'1 month'` / `'3 months'` / `'12 months'`, never parsed.
- `codeValidDays` — the redemption window, e.g. `90`.
- `price`, `brand`, `logo`, `category`. **No face-value field exists anywhere.**

Duration text is rendered in nine places: `VoucherPurchaseSheet.jsx:84, 89, 140, 226`, `OwnedVoucherDetailSheet.jsx:91, 98, 123, 142`, `VoucherStorefrontScreen.jsx:237`.

Two consequences worth naming:
- The redeemed state computes "N days remaining" off `packageExpiresAt`, a hand-authored fixture value. Nothing converts `grants` into a date, and runtime purchases never set the field at all (`VoucherPurchaseSheet.jsx:34-41`), so a voucher bought and then redeemed in one session has no expiry to show. Under the credit model this whole computation disappears rather than needing a fix.
- Runtime-created instances use a different shape from the fixture ones — `instanceId` vs `id`, epoch ms vs date strings, and no `redeemedAt` / `packageExpiresAt` keys. A latent bug, in scope because the purchase path is being touched anyway.

## Target model

Product fields become: `id`, `brand`, `logo`, `faceValue` (number, **USD**), `price` (number, **BDT**), `codeValidDays`, `category`. **`product` and `grants` are removed.** The card's identity is its denomination — derive the label from `faceValue`, never store a duplicate display string, or it drifts the way `product` already did.

`codeValidDays` **stays.** It is not a duration of service, it is how long the code itself remains redeemable — a real and separate constraint that survives the model change.

Denominations, widened so the brand-list intermediate screen has a reason to exist for more than one brand (today only Netflix has two products, which is why that screen is barely reachable):

| Brand | Denominations (USD) | Charged (BDT, @122) |
|---|---|---|
| Netflix | $5, $10, $25 | ৳610, ৳1,220, ৳3,050 |
| Prime Video | $5, $10, $20 | ৳610, ৳1,220, ৳2,440 |
| Spotify | $5, $10 | ৳610, ৳1,220 |
| YouTube Premium | $5, $15 | ৳610, ৳1,830 |
| OneGames | $3, $10 | ৳370, ৳1,220 |

`codeValidDays: 90` throughout unless a brand needs otherwise.

## Surfaces to change

**1. Brand product list → grid (Evan's explicit ask).** `VoucherStorefrontScreen.jsx:219-243` is a vertical list of 76px rows. It becomes a **2-column grid** of denomination cards. Each card: the brand mark, the dollar denomination set large as the card's headline (`$10`), the BDT charge as a secondary line (`৳1,220`), a quiet `Voucher` line, and the taka price beneath it. The accent treatment Evan asked for comes from the existing `BRAND_ACCENTS` map (`vouchers.js:5-11`) — a tinted wash or accent edge behind the brand mark, not a flat grey tile. Thousands separators on every taka amount.

**2. Storefront rows.** `Code valid {codeValidDays} days` on the product row (`:237`) is replaced by the denomination as the row's primary label. Brand-wall rows keep `From ৳{min} · N options` (`:186-209`) — still correct, and now more meaningful with 2-3 options per brand.

**3. Quick picks rail** (`:152-172`) keeps its shape; `৳{minPrice}` becomes `From $ {min face value}` with the taka equivalent as the secondary line, matching the card hierarchy.

**4. Purchase sheet** (`VoucherPurchaseSheet.jsx`), stages `detail → disclosure → checkout → processing → success`:
- `:84` — `Grants access to {brand} for {grants}` becomes credit framing: `${faceValue} of {brand} credit, applied when you redeem.`
- `:89` Code Validity card and `:140` disclosure bullet keep `codeValidDays` — unchanged, still true.
- `:226` success reminder keeps the redemption window.
- Nowhere may the sheet claim a number of months.

**5. Owned voucher detail** (`OwnedVoucherDetailSheet.jsx`):
- Unredeemed: keep the `codeExpiresAt` countdown (`:91`); `:98` becomes `Adds ${faceValue} to your {brand} account once redeemed`.
- Redeemed: **drop the `packageExpiresAt` countdown at `:123`** and its `calculateDaysLeft` call, replaced by `${faceValue} credit applied on {redeemedAt}`. Bioscope has no visibility into what the credit buys, so the honest statement is the amount and the date.
- Expired: `:142` keeps the `codeValidDays` window framing.
- Leave `state` authored-not-computed as it is today; making expiry transition at runtime is out of scope.

**6. Instance shape.** Align the runtime-created instance (`VoucherPurchaseSheet.jsx:34-41`) with the fixture shape in `demoLocker` — same key names (`id`, not `instanceId`), same date representation, and `redeemedAt: null` present. `packageExpiresAt` is dropped from both, since nothing consumes it after change 5.

## Out of scope

Offers & Discounts card design — Evan is supplying that himself. Voucher brand-list screen coverage beyond what the wider denominations naturally give. Runtime expiry transitions.
