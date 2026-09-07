# Bioscope+ Phase 4 — Walkthrough Shot List

Dev server: http://localhost:5181. Open the app, click the **DEMO** button (top right) to open the flow panel — every "Get there" step below starts from clicking a flow inside it. The panel resets state cleanly each time you click a flow, so you can jump between shots in any order without leftover state, but the list is written to be shot top to bottom in one pass.

Shorts is out of scope — nothing below touches it.

**Browser window:** the phone frame is fixed at 360×780 CSS px with an 8px border and a 4px glow ring, centered in the viewport. Resize the browser (or use Chrome's device toolbar, custom size) to roughly **480 × 900** so the frame sits centered with even margin on all sides — that gives you a consistent, repeatable crop. Crop every screenshot down to just the rounded phone frame (including its notch), not the browser chrome or the DEMO button.

**Known issues to plan around (not shot-list items, just heads-up):**
- The mobile-number field validates against a 10-digit number **without** the leading 0 (regex `1[3-9]XXXXXXXX`). The demo panel's own description text shows numbers *with* a leading 0 (e.g. `01711092617`) — typing that exact string will fail validation and the button will stay disabled. Use the numbers exactly as given in shots 14/17/18 below (no leading 0), not the panel's copy.
- Opening the **redeemed** voucher's detail sheet (tap the Netflix row inside "My vouchers") throws a runtime error — `OwnedVoucherDetailSheet.jsx` renders a `<Check>` icon it never imports from `lucide-react`. Shot 26 works around this by capturing the list view only, which shows all three states without opening the broken detail sheet. Don't tap into the redeemed voucher for a screenshot until that import is fixed.

---

## A. The problem we solved

**01-title-locked.png**
- Get there: Demo panel → **Watching & paying** → **Nothing to play**.
- Capture: Content page for *Love Rosie*, loaded but not tapped — backdrop with a centered play circle, no video running, and below it the "Subscribe" and "Rent for TK 99" buttons stacked (this title has no free preview and no trailer).
- Why it's in the deck: shows a real title sitting behind the paywall before anyone touches it — the starting problem.
- Caption draft: Some titles are locked from the very first tap.

**02-paywall-raised.png**
- Get there: from shot 01, tap the **cyan play circle** over the backdrop (not the Subscribe button below it).
- Capture: the paywall sheet raised from the bottom, headline "Unlock to start watching", *Love Rosie* title, Subscribe to Unlock (gradient) and Rent for ৳79 (white) buttons both visible.
- Why it's in the deck: this is the actual moment of the block — no preview, no trailer, straight to "pay to continue."
- Caption draft: No free look at this one — you pay before you press play.

## B. Watching and paying

**03-free-title-plays.png**
- Get there: Demo panel → **Watching & paying** → **Free film — just plays**.
- Capture: *Wicked*'s content page, video already playing in the player area at the top, no lock icon or paywall anywhere on screen.
- Why it's in the deck: proves not everything is paywalled — some content is just free to build the library out.
- Caption draft: Some titles are free, full stop.

**04-preview-then-paywall.png**
- Get there: Demo panel → **Watching & paying** → **Preview, then paywall**. Let the preview run for about 40 seconds (a "Preview ends in Xs" badge appears near the end) until it stops itself.
- Capture: the paywall sheet that appears automatically, headline "You've watched the free preview", *Seoul Vibe* title, Subscribe and Rent ৳99 buttons.
- Why it's in the deck: shows the "try before you buy" pattern — a real timed sample, then the ask.
- Caption draft: Watch a free preview, then decide.

**05-trailer-then-paywall.png**
- Get there: Demo panel → **Watching & paying** → **Trailer, then paywall**. Drag the seek dot near the right end of the bar and let the last second or two play out so the trailer finishes.
- Capture: the paywall sheet, headline "Trailer finished; the content is paywalled", *The Bike Riders* title, Subscribe and Rent ৳99 buttons.
- Why it's in the deck: shows the fallback for titles with no preview clip — the trailer stands in, then the paywall follows.
- Caption draft: No preview for this one, so the trailer does the selling.

**06-subscribe-or-rent.png**
- Get there: Demo panel → **Watching & paying** → **Subscribe or rent**.
- Capture: paywall sheet already open on *Seoul Vibe*, both Subscribe to Unlock and "Rent for ৳99" buttons visible side by side.
- Why it's in the deck: the two ways to pay for one piece of content — own an all-access pack, or pay once for 48 hours.
- Caption draft: Subscribe for everything, or rent just this one.

**07-subscribe-only-title.png**
- Get there: Demo panel → **Watching & paying** → **Subscribe-only title**.
- Capture: paywall sheet on *Nishiddho*, only the single "Subscribe to Unlock" button — no rent option present.
- Why it's in the deck: compare directly against shot 06 — some titles (originals) can only be unlocked by subscribing, never rented.
- Caption draft: This one's subscription-only — no rent option.

**08-already-subscribed.png**
- Get there: Demo panel → **Watching & paying** → **Already subscribed**.
- Capture: *Seoul Vibe*'s content page, video playing immediately, no paywall, no lock — this viewer already holds the Standard pack.
- Why it's in the deck: compare against shot 04 — same film, but once you're subscribed the preview and paywall both disappear.
- Caption draft: Once you've subscribed, it just plays.

**09-fullscreen-player.png**
- Get there: Demo panel → **Watching & paying** → **Full screen**.
- Capture: the player filling the whole phone frame edge to edge (landscape/full-bleed mode), controls visible.
- Why it's in the deck: shows the viewing experience isn't a cramped little box — it goes full screen like any real streaming app.
- Caption draft: Full-screen playback, same as any streaming app.

## C. Choosing a pack

**10-pack-catalogue.png**
- Get there: Demo panel → **Choosing a pack** → **Browse all packs**.
- Capture: top of the Select Your Pack screen — the two filter rows (validity, platform) and the "Most Popular" Standard pack card fully visible.
- Why it's in the deck: the whole commercial menu in one frame — how many ways in, and which one we push hardest.
- Caption draft: Twelve packs, one obvious "start here."

**11-pack-you-cant-buy.png**
- Get there: from shot 10, tap the **90 Days** validity filter, then scroll to the "Family + 5GB Internet" card.
- Capture: the card with its "Only for Skitto Users" badge, full price and coverage shown, and a greyed "Requirement not met" bar in place of a buy button.
- Why it's in the deck: shows packs can be operator-gated — visible to everyone, buyable only by the right carrier's customers.
- Caption draft: Visible to everyone, buyable only on Skitto.

**12-compare-packs.png**
- Get there: from shot 10, clear filters back to "All", scroll to the bottom, tap **Compare all packs**.
- Capture: the comparison table sheet — pack names across the top, price/duration/platform rows underneath.
- Why it's in the deck: this is the tool a hesitant buyer uses to actually decide — worth showing it exists.
- Caption draft: Side-by-side, so nobody has to guess.

## D. Paying

**13-payment-method-list.png**
- Get there: Demo panel → **Paying with mobile balance** → **Pay from mobile balance** → tap **Subscribe to Unlock** → tap the Standard pack's **Select Best Value** → on the checkout screen, tap the **Pay from Mobile Balance** row to select it.
- Capture: the checkout screen with the payment method list, "Pay from Mobile Balance" row selected (filled radio), other methods (bKash, Rocket, Nagad, etc.) listed below it.
- Why it's in the deck: shows the payment menu itself — mobile balance sits right alongside the wallets and cards, not buried.
- Caption draft: Pay however you already pay for things.

**14-mobile-number-step.png**
- Get there: from shot 13, tap **Continue to Payment**. On the number screen, type `1711092617` into the Mobile Number field (do not include the leading 0).
- Capture: the GP-branded number entry screen, the number typed in, "Get OTP" button now enabled (blue).
- Why it's in the deck: this is the actual carrier-billing step — no app, no card, just a phone number.
- Caption draft: Just a phone number — no card, no app.

**15-otp-step.png**
- Get there: from shot 14, tap **Get OTP**. Type any 4 digits other than `0000` (e.g. `1234`) into the OTP field.
- Capture: the OTP screen with the monthly/yearly spending-limit figures visible above the field, OTP typed in, "Confirm Payment" enabled.
- Why it's in the deck: shows the spend caps are shown up front — the buyer knows exactly what this will use before confirming.
- Caption draft: One code, and the limits are shown before you confirm.

**16-payment-success.png**
- Get there: from shot 15, tap **Confirm Payment** and wait for the short processing spinner.
- Capture: "Payment Successful!" screen, confirmation copy, "Start Watching" button.
- Why it's in the deck: the payoff — closes the loop from locked title to paid access in one continuous flow.
- Caption draft: Paid. Ready to watch.

**17-limit-reached.png**
- Get there: Demo panel → **Paying with mobile balance** → **Monthly limit used up** → tap **Subscribe to Unlock** → Standard pack → select **Pay from Mobile Balance** → **Continue to Payment** → type `1799999999` (no leading 0) → tap **Get OTP**.
- Capture: the red "Spending limit reached" screen, explanation copy, single "Choose another method" button (no retry).
- Why it's in the deck: an honest dead end — some declines can't be retried, only worked around by paying a different way.
- Caption draft: Some declines are final — the app says so plainly.

**18-operator-declined.png**
- Get there: Demo panel → **Paying with mobile balance** → **Operator declined** → tap **Subscribe to Unlock** → Standard pack → select **Pay from Mobile Balance** → **Continue to Payment** → type `1788888888` (no leading 0) → tap **Get OTP**.
- Capture: the "Payment declined" screen — compare directly against shot 17: this one has both "Try again" and "Choose another method" buttons.
- Why it's in the deck: contrast with shot 17 — this decline is retryable, and the app tells you that too.
- Caption draft: Other declines just need a retry.

**19-number-not-recognised.png**
- Get there: Demo panel → **Paying with mobile balance** → **Number not recognised** → tap **Subscribe to Unlock** → tap the Standard pack.
- Capture: the checkout screen's payment method list — compare against shot 13: "Pay from Mobile Balance" is gone entirely, only the wallet/card options remain.
- Why it's in the deck: shows the app quietly protects against billing a number it can't identify — it just removes the option rather than letting it fail later.
- Caption draft: If we can't identify the number, we don't offer it.

## E. Vouchers

**20-voucher-storefront.png**
- Get there: Demo panel → **Vouchers** → **Buy a Netflix voucher**.
- Capture: the Digital Vouchers storefront, categories (Streaming, Music, Games) with brand tiles and "From ৳__" pricing.
- Why it's in the deck: a second revenue line beyond Bioscope+ itself — other apps' subscriptions sold through us.
- Caption draft: We also sell other people's subscriptions.

**21-voucher-brand-page.png**
- Get there: from shot 20, tap the **Netflix** tile.
- Capture: the Netflix product list — "Mobile plan · 1 month" ৳250 and "Basic · 3 months" ৳1400 cards.
- Why it's in the deck: shows the actual products on offer for one brand, priced individually.
- Caption draft: Pick the plan length, see the price up front.

**22-voucher-purchase-sheet.png**
- Get there: from shot 21, tap the **"Mobile plan · 1 month"** card.
- Capture: the "Purchase Digital Code" sheet — Netflix, product name, price ৳250, the code-validity and redemption terms box, "Buy Now" button.
- Why it's in the deck: sets expectations before money changes hands — how long the code stays valid, where it's redeemed.
- Caption draft: Clear terms before you pay.

**23-voucher-code-revealed.png**
- Get there: from shot 22, tap **Buy Now** → tick the agreement checkbox → tap **Agree and Continue** → tap **Pay ৳250** and wait for the short spinner.
- Capture: "Here is your code!" screen, the generated code in the mono-font box, "Redeem Now" and "I'll do it later" buttons.
- Why it's in the deck: the actual deliverable — a real code, handed over immediately after payment.
- Caption draft: The code, the moment payment clears.

## F. What you own afterwards

**24-my-subscriptions-active.png**
- Get there: Demo panel → **Choosing a pack** → **What I am subscribed to**.
- Capture: the My Subscriptions sheet — "Duo Binge + GP User Plan with Minutes" pack, expiry date, the row of included platform logos.
- Why it's in the deck: what a subscriber sees when they check what they're actually paying for.
- Caption draft: Everything you're subscribed to, in one place.

**25-auto-renewal-on.png**
- Get there: from shot 24, tap the **Auto renewal** toggle to turn it on.
- Capture: the toggle in its "on" (filled cyan) state, with the "Next charge ৳179" line visible underneath.
- Why it's in the deck: shows renewal is opt-in and visible, not a hidden default — and exactly what it'll charge next.
- Caption draft: Renewal is a switch you can see and flip.

**26-my-vouchers-three-states.png**
- Get there: Demo panel → **Vouchers** → **My vouchers**.
- Capture: the Digital Vouchers section of the My Subscriptions sheet, showing all three rows at once — Prime Video "Ready to redeem", Netflix "Redeemed", OneGames "Expired".
- Why it's in the deck: shows the full lifecycle of a bought voucher in one screenshot — live, used, and lost value if ignored.
- Caption draft: A code is only worth something until it isn't.

## G. Offers and discounts

**27-segment-discount.png**
- Get there: Demo panel → **Offers & discounts** → **Discount for your operator**.
- Capture: top of the Pack Catalogue, "Most Popular" Standard card, pink "GP Users save 20%" badge in place of its usual badge, discounted price shown.
- Why it's in the deck: pricing that changes based on which network the viewer is on — a targeted discount, not a blanket one.
- Caption draft: Your network, your price.

**28-flash-sale-expires-midcheckout.png**
- Get there: Demo panel → **Offers & discounts** → **Sale ends while you are paying** → scroll to the "Duo Binge + GP User Plan with Minutes" card and tap **Select Pack**. Wait one to two seconds on the checkout screen.
- Capture: the checkout screen with the pink "Offer expired. The price has been updated." toast banner at the top.
- Why it's in the deck: shows the app doesn't let a stale discount slip through — the price is re-checked live, mid-payment.
- Caption draft: If the deal ends while you're paying, the price updates — no stale discounts.

**29-midnight-offer-live.png**
- Get there: Demo panel → **Offers & discounts** → **Late-night offer — live now** → scroll past the flash-sale Duo Binge card to the plain "Bioscope+ Super" card.
- Capture: the card with its "Midnight offer • ends 2:00 AM" badge active (pink/glowing) and the discounted price showing.
- Why it's in the deck: a scheduled, time-boxed discount that's currently live — different mechanic from the flash-sale timer.
- Caption draft: Some offers only run at certain hours — and this one's live right now.

**30-midnight-offer-upcoming.png**
- Get there: Demo panel → **Offers & discounts** → **Late-night offer — starts later** → scroll to the same "Bioscope+ Super" card.
- Capture: the card with a greyed "Starts 12:00 AM" badge, full (non-discounted) price still showing — compare directly against shot 29.
- Why it's in the deck: shows the same offer before its window opens — visible so people know to come back, but honestly priced until then.
- Caption draft: Same offer, before its hours start — full price until it does.
