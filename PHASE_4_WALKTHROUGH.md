# Bioscope+ Phase 4 (Q4) Walkthrough

Phase 4 gave Bioscope+ a way to actually sell things. Before this build the app had one flag — "VIP, yes or no" — and nothing read it, so subscribing changed nothing on screen. This build adds a real content detail page for full-length movies and shows, a proper video player with a working seekbar, a pack catalogue people can filter and compare, a storefront for buying third-party streaming vouchers (Netflix, Prime, Spotify, and so on), a real account page, and one shared paywall that several moments in the app all lead into. It also starts remembering things about the person using the app — what they're subscribed to, what they've rented, what vouchers they own — instead of just an on/off switch. Shorts (the vertical video feed) was also rebuilt this quarter but is covered in a separate walkthrough; it does not appear below.

All artwork is local to the repo now — no remote placeholder images anywhere in the flows below.

## How to run the demo

From the repo root:

```
npm install   # first time only
npm run dev
```

This starts Vite on port 5181, bound to all interfaces, so it's reachable both at `http://localhost:5181` and at the machine's LAN address if you want to demo from a phone on the same network. There's no backend to start — everything runs off local fixture data.

## The demo path

The build ships with an on-screen demo panel purpose-built for this walkthrough. Look for the small "DEMO" pill, top right of the screen, on every page. Tapping it opens a list of ready-made scenarios grouped by topic; each one sets up the right state and drops you straight into the right screen, so you never have to fumble through real navigation to reach a state. This is also the *only* way to reach the new content detail page right now — there is no poster or row on the home screen that leads to it yet, so start every walkthrough from this panel.

1. **Preview, then paywall.** Group "Watching & paying." Opens Shaan. The preview auto-plays, warns near the end as it approaches its cutoff, then the paywall rises over the frozen final frame. The round transport button on the detail page reads "Preview" for this one, and its trailer sits below as a static "Trailers & Clips" card.
2. **Trailer, then paywall.** Opens Khan, which has no preview, only a trailer — so the round button reads "Trailer" and there's no rail underneath. The trailer plays, ends, paywall appears. Replay it afterwards from the detail page to show it does *not* re-trigger the paywall a second time in the same visit.
3. **Nothing to play.** Opens Chokro 2, which has neither a preview nor a trailer. The round transport button sits visibly disabled, and tapping Subscribe opens the paywall directly — there's no dead player to sit through.
4. **Browse all packs.** Group "Choosing a pack." Opens the pack catalogue — 11 packs, filterable by how long they last and which platforms they cover.
5. **Buy a voucher.** Group "Vouchers." Opens the storefront on its Store tab — brand, product, disclosure, payment, then a revealed code.
6. **My vouchers.** Same page, on the "My vouchers" tab, seeded with three at once — one unredeemed and ready to redeem, one redeemed and still running, one that expired unused. Tap into each to show the three states.
7. **Discount for your operator / flash sale / late-night offer.** Group "Offers & discounts." Six flows here show a segment discount, a ticking flash-sale timer (including one that expires mid-checkout), and the three states of a time-window offer (upcoming, live, ended) on the pack catalogue. Opening any of these scrolls the affected pack into view automatically, so there's no manual scrolling needed to find it.

Mobile balance is still a fully working payment method inside checkout — OTP step, spending limits, the two numbers wired to fail on purpose — but it no longer has its own demo panel entries. If someone asks about it, choose Mobile Balance by hand from any checkout's payment list and walk through it live.

## 1. Content detail and entitlement

Tapping into a title (via the demo panel, for now) opens a single scrollable page: a video area pinned to the top, then title, genres, duration and quality/rating badges, then a row of action buttons, then a synopsis, then — for a title with both a preview and a trailer — a "Trailers & Clips" card, then "More like this."

The app decides what happens when you press play by checking, in order: is this free, does your subscription cover it, have you rented it, does it have a preview, does it have a trailer, or is there nothing to show at all. Subscription or rental beats everything else — if you're covered, you go straight to the full feature with no trailer first. Otherwise a preview (if the title has one) always wins over a trailer for the play button; the two never both play automatically. A preview is a real clip of the actual content, cut short at a fixed point (40 seconds in this build) with a warning as it approaches the cutoff. A trailer is the separate promotional clip. Either one ends by handing off to the paywall, which lands the person straight back on this same title once they pay — nowhere generic.

The row of round action buttons is Like, a transport button, My List, Share (Download was removed this quarter). The transport button is the pinned player's control, not a separate CTA: it reads "Preview" when the title has one, "Trailer" when it only has a trailer, and sits visibly disabled when it has neither. While its clip is playing the circle inverts to solid white with a pause mark; tapping it again pauses. When a title carries both a preview and a trailer, the preview owns that button and auto-plays, and the trailer moves down the page as a static "Trailers & Clips" card between the synopsis and "More like this" — that card is deliberately not clickable, it's layout only, standing in for a future trailer-in-place-of-poster treatment. A trailer-only title shows no such card at all.

If a title genuinely has neither a preview nor a trailer and isn't unlocked, the paywall opens the moment you tap play (from the Subscribe button, since there's no transport to press), rather than opening an empty player and having nothing happen. That "nothing to play" state shows a plain white play button, not the brand cyan used elsewhere.

(Files: `src/screens/ContentDetailScreen.jsx`, entitlement logic in its `playState` memo; content fixtures in `src/data/content.js`.)

## 2. The long-form player

This is a proper single video player for movies and long shows, distinct from the vertical microdrama player used elsewhere in the app. It's wired to a real `<video>` element: the seekbar tracks actual playback position, dragging it seeks the real video, and the preview cutoff and trailer-end moments are genuine video events, not a countdown clock. There's no poster frame any more — the clip starts straight away rather than waiting on a static image. Playback attempts to autoplay with sound first and, if the browser blocks that, silently falls back to starting muted, so don't be thrown if the first clip you see in a session is playing without audio — unmute it and move on.

Tapping the screen shows the chrome — back button, cast, picture-in-picture, and a settings gear top right; play/pause and 10-second skip buttons center; a live time readout and seekbar along the bottom. The settings sheet behind the gear lists audio track, quality and playback speed as selectable rows, though changing them in this build doesn't yet do anything to the actual video — it's a stub UI, not wired to real tracks. Rotating to landscape switches the player into a fullscreen landscape layout.

(File: `src/components/LongFormPlayer.jsx`.)

## 3. Episode selector rebuild

This applies to long-running microdrama titles, not the long-form films above. The episode picker is a single combined sheet with a Details tab and an Episodes tab. Episodes render as an edge-to-edge, three-column poster grid. For shows with more than 30 episodes, a small pill above the grid ("EP 1–30" etc.) opens a dropdown to jump between ranges.

Each tile carries a state: the episode currently playing gets a bright cyan ring and a "Playing" badge; anything already finished gets a dimmed, darkened tile with a "Watched" badge; episodes gated behind a subscription (past a title's free-episode count) show a small lock badge instead and can't be tapped into — tapping one opens the paywall instead of playing.

(File: `src/components/episode/EpisodeGridV2.jsx`, used from `src/components/DramaSheet.jsx`; supporting pieces `RangeChip.jsx`, `WatchedBadge.jsx`, `PlayingBadge.jsx` in the same folder.)

## 4. Packs

A pack is what actually gets sold — a bundle covering some mix of duration, platforms and, sometimes, phone credit (data or minutes) thrown in by the carrier. The catalogue holds 12 packs in the fixture data, but only 11 ever show up on screen: Family + 5GB requires being on Skitto, which the demo user isn't, and packs someone isn't eligible for are filtered out of the list entirely now rather than being shown greyed out. One pack is hoisted to the top as "Most Popular" and sits outside the filters; the rest can be filtered by how long they last and which platform they cover. The filter pills are noticeably smaller than before, and the header above them no longer carries a subtitle.

Each pack card is now the whole tap target — there's no "Select Pack" / "Select Best Value" button and no divider stroke inside the card; tapping anywhere on it picks the pack. The card still shows badge (if any), duration, any telco value pill, a short coverage line, small platform logos, and the price (with the original price struck through where there's a discount). Opening the catalogue with an offer campaign active scrolls that campaign's pack into view automatically, so the offer flows in the demo panel no longer need any manual scrolling to find what changed.

"Compare all packs" opens a real side-by-side table built from the actual pack list — price, duration, telco value, which of the four headline platforms each one includes, what it unlocks, and which payment methods it accepts.

(Files: `src/screens/PackCatalogueScreen.jsx`, `src/components/PackCard.jsx`, `src/components/PackComparisonSheet.jsx`, data in `src/data/packs.js`.)

## 5. Rent

Renting no longer has its own button on the content detail page or on the paywall's first prompt. Instead, opening "See all packs" from the paywall shows a slim row above the pack cards — "Rent this title · 48 hours from first play · ৳X" — for any title that has a rent price. Tapping it goes to a rental checkout that explains the 48-hour window starts at first press of play. The pack sheet itself shows at most two packs for a title, not every pack it happens to belong to.

(File: `src/components/PaywallSheet.jsx`.)

## 6. Vouchers

This is a different kind of product entirely — instead of buying access inside Bioscope+, you're buying a redemption code for someone else's service (Netflix, Prime Video, Spotify, YouTube Premium, OneGames). The page opens with a segmented control at the top: "Store" and "My vouchers · N" — buying and owning both live under this one entry rather than being split across two menu items.

The Store side leads with a "Quick picks" horizontal rail — the three lowest entry prices across every brand — then brand rows grouped under category headers (Streaming, Music, Games), each row tinted with that brand's own colour. Tapping a brand with more than one product opens an intermediate product list; a single-product brand goes straight to the product. Buying one walks through: product detail and price, a mandatory terms screen (the code is non-refundable once revealed — you have to tick a box acknowledging that), a payment step, and finally the code itself, shown once with a copy button and a "redeem now" handoff screen that explicitly says you're leaving Bioscope+ for the partner's app. Every sheet in this flow now shows the real brand logo rather than the plain brand-name text it used to render.

The "My vouchers" side is the locker. The seeded demo data holds three at once: one unredeemed and ready to redeem (a countdown on how long the code itself stays valid before it expires unused), one redeemed and running (the code is spent, and a second, separate clock — the subscription period it granted — is what matters now), and one expired unredeemed (paid for, never used, dead code, no refund). Tapping any of them opens the voucher detail sheet for that state.

(Files: `src/screens/VoucherStorefrontScreen.jsx`, `src/components/VoucherPurchaseSheet.jsx`, `src/components/OwnedVoucherDetailSheet.jsx`, data in `src/data/vouchers.js`.)

## 7. The paywall

One sheet handles every "you need to pay for this" moment in the app, and it opens differently depending on how you got there:

- **Title-specific** (tapping a locked title, or a locked episode) — shows the film's own title and a framing line, with Subscribe as the way in; Rent lives one screen further in, inside "See all packs." Paying returns you to that exact title's player.
- **Trailer-end** — the same sheet rises over the trailer's held final frame with framing copy that says the trailer just finished. Only fires once per title in a single visit, so replaying the trailer afterwards doesn't paywall you again.
- **Generic** — reached from the amber Subscribe pill in the home top bar, with no specific title behind it, so the copy is plain ("Choose Your Plan") and it skips straight to the pack list. Paying from here returns you to Home, not to any particular title, since there was nothing to return to.

From any of these, choosing a pack opens the same checkout: pack summary, auto-renewal toggle, a payment method list, and a discount expander where a coupon code can be applied (`VALID50` works in the demo; a couple of other codes demonstrate expired/ineligible errors).

(File: `src/components/PaywallSheet.jsx`, framing copy at the top of the file keyed by origin.)

## 8. Payments

The payment method list is one shared component used everywhere money changes hands — checkout inside the paywall, rentals, and voucher purchases all use it, rather than each screen inventing its own row of buttons. Which methods actually show up depends on the specific pack or voucher being bought: annual packs, for instance, deliberately don't accept Mobile Balance, and the list reflects that rather than always showing every option.

Real logos are wired in for bKash, Nagad, Rocket, upay and Grameenphone (the Mobile Balance option), plus generic Visa/Mastercard/Amex art for "Other Cards & MFS." Choosing "Pay from Mobile Balance" branches into a Grameenphone-styled sub-flow: enter a Bangladeshi mobile number, accept a charge-authorization checkbox, request an OTP, and confirm it against a mocked screen showing your monthly/yearly spending limits. Two numbers are wired to fail on purpose for demo purposes — one hits a hard "limit exhausted" stop with no retry, the other is an ordinary declined charge you can retry or route around. If the app doesn't recognise the phone number as belonging to a known carrier, Mobile Balance disappears from the list entirely rather than being shown and then failing. None of this has its own demo panel entry any more; it's reached by hand from any checkout screen.

(Files: `src/components/PaymentMethodList.jsx`, carrier flow inside `src/components/PaywallSheet.jsx`, logos in `src/assets/payment-logos/`.)

## 9. The account page

The bottom nav's Account tab now opens a real profile page instead of dropping straight into the voucher storefront. At the top sits a profile switcher — a selected profile tile plus an "Add User" tile — and a "Manage Profiles" row underneath. Below that is a plain menu: My List, Watch History, Rent, Liked Content, My Account, Payment & Subscription, Vouchers (carrying a "New" badge), Connect TV & Devices, App Settings, Rate us, Help & Support, Send Feedback, and Sign Out. Only Payment & Subscription and Vouchers actually go anywhere right now; everything else is an inert placeholder row, worth naming as such if someone taps one expecting it to work. The avatar is a placeholder gradient disc with an initial, not final art.

(File: `src/screens/ProfileScreen.jsx`.)

## 10. Payment & Subscription

Reached from the Account page, this is the new home for everything subscription-related, replacing the old "My Subscriptions" sheet. It shows a Subscribe button up top, then a plan card that reads either "No Active Subscription" or the active pack with its expiry label and an auto-renewal toggle, then four rows: Vouchers & codes (which shows a live count of active vouchers and deep-links straight into the "My vouchers" side of the voucher locker), Redeem Code, View Payment History and Saved Payment Method — the last three are placeholder rows for now.

(File: `src/screens/PaymentSubscriptionScreen.jsx`.)

## 11. What the app now remembers about you

Before this quarter there was a single `isVip` flag that nothing in the app actually read — subscribing was cosmetic. Now the app tracks four separate things about the person using it: whether they hold a subscription and which pack, which titles they've rented (and that a rental is meant to be a 48-hour window starting from the first time you press play, though that countdown is only stated in the copy right now, not actually timed — more on that below), which vouchers they own and in what state, and whether their phone number is recognised as belonging to a known carrier.

That's a meaningfully different shape than a yes/no flag, because access questions in a real subscription product are never binary: someone can be subscribed but to the wrong pack for this particular title, or not subscribed but holding a rental, or a carrier customer whose number the system just doesn't happen to recognise yet. Every entitlement check across the content detail page, the episode grid and the paywall now reads from this richer state, so toggling any one of these four things (via the demo panel, or by hand for the flows it no longer covers) visibly changes what a person can watch and what they're offered to pay for — which is the whole point of the quarter's work.

(State lives in `src/contexts/AppContext.jsx`: `subscription`, `rentals`, `ownedVouchers`, `carrierKnown`.)

## What's real vs. what's faked

There is no backend anywhere in this build — everything above runs off fixture data in `src/data/`, held in memory for the session. Refreshing the page resets it. A few things worth being upfront about if someone in the room pokes at them:

- The rental's 48-hour window is a promise made in copy only. Renting a title just adds its id to a list forever in this session; nothing actually starts or expires a clock.
- The content detail page (and therefore the whole play journey) has no real entry point yet — it's only reachable through the demo panel. There is no poster, row or search result on the home screen that leads to it.
- BrowseScreen exists in the code but nothing navigates to it — it's unreachable from any real button.
- The bottom nav's "New" tab is unwired (does nothing).
- Share, on the content detail page, is a no-op button.
- Flexiplan's "Create Package" button on the pack catalogue is inert by design — visible, styled disabled, no handler.
- `PremiumBadge` is a component that unconditionally returns null — the premium crown badge was pulled from every surface that used to show it, but the component was left in place rather than removed everywhere it's called.
- The player settings sheet (audio/quality/speed) is a real-looking UI with no live video track switching behind it.
- On the Account page, only Payment & Subscription and Vouchers do anything; every other row (My List, Watch History, Rent, Liked Content, My Account, Connect TV & Devices, App Settings, Rate us, Help & Support, Send Feedback, Sign Out) is a placeholder.
- On the Payment & Subscription page, Redeem Code, View Payment History and Saved Payment Method are placeholder rows; only Vouchers & codes actually navigates anywhere.
- The "Trailers & Clips" card that appears for titles with both a preview and a trailer is deliberately not clickable — it's design only, not a stub awaiting a handler.

## Known gaps / what's next

The design-token migration to the Figma "Bioscope x Gotipath" system did not land this quarter. `src/index.css` still carries the old teal brand palette (`#2b9c9c` and friends) sitting alongside the newer Q4 colours (`#00BBFF` cyan, `#FF9900` amber), and the base font is still Inter, not Telenor Evolution. A full audit (`TOKEN_DECISIONS.md`) catalogued roughly 44 unresolved colour tokens across five buckets, and narrowed it down to 12 outstanding calls Anik needs to make — things like whether the Grameenphone blue and the campaign pink get formally adopted as partner/campaign extension tokens, whether the "electric teal" progress-bar accent gets added to Figma or retired in favour of the brand blue, and what to do with a scattered set of drifted greys. None of that blocks demoing the flows above, but it means the app is currently running on a coherent-but-undeclared palette rather than the actual design system.

A handful of specced states from the review pass are still missing outright: an invalid-mobile-number error state on the carrier billing screen, a proper "brand list" intermediate screen for every voucher brand (currently only Netflix, which has two products, triggers it), and the rotation handoff animation for orientation changes. The internal admin tool for controlling discount campaigns (as opposed to the demo panel that fakes them) hasn't been scoped yet and is a separate product decision. The Account page's placeholder rows and the Payment & Subscription page's Redeem Code / History / Saved Payment Method rows are the next candidates for real screens once that's prioritised.

Structurally, the payment method list itself is already a single shared component (`PaymentMethodList.jsx`) reused by the paywall, rentals and vouchers — that consolidation has already happened. What hasn't happened is wiring the content detail page into real navigation, and deciding whether the rental countdown needs to become a real timestamp before this goes further than a demo.
