# Demo fixtures

Invented content for the clickthrough prototype. Built to make every flow, filter and state reachable — **not** a claim about Bioscope+'s real commercial offering.

Three real packs are carried over from the live-app reference and marked as such. Everything else is designed to fill gaps in the demo matrix.

---

## 1. Pack catalogue — 12 packs

Sized so the validity × platform filters actually demonstrate something. Every duration chip returns results; every pack kind is represented; segments and payment eligibility both vary.

| id | Title | Badge | Duration | Days | Kind | Telco value | Price | Was |
|---|---|---|---|---|---|---|---|---|
| `day-pass` | Day Pass | — | 1 Day | 1 | ott | — | ৳19 | — |
| `movie-night` | Movie Night | — | 1 Day | 1 | ott+tvod | — | ৳49 | — |
| `standard` ★ | Standard | Recommended for All | 1 Week | 7 | data+ott | 5 GB Internet | **৳99** | ৳149 |
| `bangla-weekly` | Bangla Weekly | — | 1 Week | 7 | ott | — | ৳79 | — |
| `duo-binge` ★ | Duo Binge + GP User Plan with Minutes | Best for GP Users | 1 Month | 28 | data+ott | 30 Min + 100 SMS | **৳179** | ৳299 |
| `super` | Bioscope+ Super | — | 1 Month | 28 | ott | — | ৳299 | — |
| `data-ent` | Data + Entertainment | — | 1 Month | 28 | data+ott | 2 GB Internet | ৳299 | — |
| `kids` | Kids Pack | — | 1 Month | 28 | ott | — | ৳99 | — |
| `sports-season` | Sports Season Pass | — | 3 Months | 90 | ott+tvod | — | ৳799 | — |
| `family-5gb` ★ | Family + 5GB Internet | Only for Skitto Users | 3 Months | 90 | data+ott | 5 GB Internet | **৳229** | ৳345 |
| `annual-bangla` | Annual Bangla | — | 1 Year | 365 | ott | — | **৳999** | ৳1499 |
| `premium-annual` | Premium Annual | Best Value | 1 Year | 365 | ott | — | **৳1999** | ৳2999 |

★ = carried from the live-app reference, real values.

### Filter coverage

**Validity chips** — All · 1 Day (2) · 7 Days (2) · 28 Days (4) · 90 Days (2) · 365 Days (2). Every chip returns results, and no chip returns everything.

**Platform chips** — All · Bioscope+ · Hoichoi · Chorki · Deepto · Combo · Data+OTT. Combined with a validity chip, some pairs return **nothing** — which is how P3's empty state becomes reachable without contriving it. `1 Day × Data+OTT` is the cleanest zero.

### Other fields

| Pack | Providers | Pay with | Segment |
|---|---|---|---|
| `day-pass` | bioscope | balance | all |
| `movie-night` | bioscope | balance, bkash | all |
| `standard` | 10 platforms | balance, bkash, nagad, card | all |
| `bangla-weekly` | hoichoi, deepto, iscreen | balance, bkash, nagad | all |
| `duo-binge` | 10 platforms | balance, bkash, nagad, card | **gp-users** |
| `super` | 10 platforms | balance, bkash, nagad, card | all |
| `data-ent` | bioscope, hoichoi | balance, bkash | all |
| `kids` | bioscope, shemaroo | balance, bkash, nagad | all |
| `sports-season` | bioscope, sonyliv | balance, bkash, nagad, card | all |
| `family-5gb` | 10 platforms | balance, bkash, card | **skitto-users** |
| `annual-bangla` | hoichoi, chorki, deepto | bkash, nagad, card | all |
| `premium-annual` | 10 platforms | bkash, nagad, card | all |

**`standard` is `recommended: true`** — it sits hoisted above the list, exempt from filtering.

**`family-5gb` is the ineligible demo** — the default demo user is a GP subscriber, not Skitto, so P5's "show with requirement stated, no CTA" state is reachable from a normal browse.

**`annual-bangla` and `premium-annual` exclude `balance`** — long, expensive packs that carrier billing does not carry. That makes per-pack payment eligibility visible rather than theoretical: switch to a 365-day filter and the Mobile Balance row disappears at checkout.

---

## 2. Long-form content — 8 titles

Covers all four paywall cases, both CTA layouts, and both purchase paths.

| id | Title | Runtime | Paywalled | Preview | Trailer | Rent | In packs |
|---|---|---|---|---|---|---|---|
| `wicked` | Wicked | 2 h 35 min | no | — | yes | — | — |
| `seoul-vibe` | Seoul Vibe | 2 h 35 min | yes | yes (5 min) | yes | ৳99 | standard, super, premium-annual |
| `me-before-you` | Me Before You | 1 h 50 min | yes | yes (5 min) | yes | ৳79 | standard, super |
| `bike-riders` | The Bike Riders | 1 h 56 min | yes | **no** | yes | ৳99 | super, premium-annual |
| `love-rosie` | Love Rosie | 1 h 42 min | yes | **no** | **no** | ৳79 | standard, super |
| `bangla-original` | Nishiddho | 2 h 10 min | yes | yes (5 min) | yes | **no rent** | bangla-weekly, annual-bangla |
| `kids-feature` | Chander Buri | 1 h 30 min | yes | no | yes | ৳49 | kids, super |
| `match-replay` | BPL Final 2026 | 3 h 20 min | yes | no | yes | ৳149 | sports-season |

**Why each exists**

- `wicked` — the free / entitled state. `Play Now`, single CTA.
- `seoul-vibe` — the full journey. Preview → paywall → subscribe or rent. The primary demo path.
- `bike-riders` — **trailer only, no preview.** Exercises subtask 1c's fallback branch.
- `love-rosie` — **nothing to play.** Paywalled with no preview and no trailer, so the paywall fires straight from the detail page with no player behind it. This is the case the roadmap sheet never addresses.
- `bangla-original` — **no rental.** Forces the single-CTA paywall layout, so it is reachable without editing fixtures.
- `match-replay` — sits in a `ott+tvod` pack, at a higher rent price. Shows rental scaling with content value.

All eight appear in each other's **More like this** rails.

---

## 3. Vouchers — 7 products

Third-party subscriptions sold as codes (mother task 3). The two validity clocks the sheet asks to separate are modelled explicitly: **code validity** is how long the code stays redeemable; **package validity** is what the code buys once redeemed.

| id | Brand | Product | Price | Code valid | Grants |
|---|---|---|---|---|---|
| `netflix-mobile-1m` | Netflix | Mobile plan · 1 month | ৳250 | 90 days | 1 month |
| `netflix-basic-3m` | Netflix | Basic · 3 months | ৳1400 | 90 days | 3 months |
| `prime-1m` | Prime Video | 1 month | ৳150 | 60 days | 1 month |
| `prime-12m` | Prime Video | 12 months | ৳1499 | 90 days | 12 months |
| `onegames-1m` | OneGames | 1 month | ৳199 | 30 days | 1 month |
| `youtube-premium-1m` | YouTube Premium | 1 month | ৳180 | 60 days | 1 month |
| `spotify-3m` | Spotify | Premium · 3 months | ৳350 | 90 days | 3 months |

**Demo locker state** — the fixture should ship with three vouchers already owned, so the locker is not empty on first view and every state is visible at once:

| Voucher | State | Shows |
|---|---|---|
| `prime-1m` | **Unredeemed**, code valid 46 more days | Code revealed, copy action, redeem link-out |
| `netflix-mobile-1m` | **Redeemed** 12 days ago | Package validity counting down, code spent |
| `onegames-1m` | **Expired unredeemed** | The failure case — bought, never used, code dead |

That third row is the one that justifies separating the two clocks. A user holding an expired-unredeemed code needs to understand what happened, and no other screen in the app explains it.

**Storefront grouping** — Streaming (Netflix, Prime, YouTube) · Music (Spotify) · Games (OneGames). Enough to show category structure without inventing a category with one member and no siblings.

---

## 4. Demo user

One user, so state is predictable:

```
Grameenphone subscriber, number known (One Tap Binding satisfied)
→ Mobile Balance is offered
Not a Skitto subscriber
→ family-5gb shows as ineligible
No active subscription by default
→ every paywall is reachable; dev panel grants a pack when needed
One rented title in the reference state: none
→ rental is demonstrated live, not pre-seeded
```

The dev panel overrides all of it.

---

## 5. Video assets

Two real files in `media/`. The prototype has never had real video — these replace the fake timers for the play journey.

| File | Resolution | Duration | Size | Role |
|---|---|---|---|---|
| `Sample Video_2.mp4` | 1920×1080 · 25fps | **1:57** (117.5s) | **252 MB** | Feature content **and** preview source |
| `Sample Video_ Maloti.mp4` | 1280×720 · 25fps | **0:16** (15.8s) | 9.2 MB | Trailer |

### Compress before use — required

**252 MB will not survive a dev server or a Vercel deploy.** Transcode both to web weight first; keep the originals.

```bash
cd "Bioscope Q4 Tasks/media"
ffmpeg -i "Sample Video_2.mp4" -vf scale=-2:720 -c:v libx264 -crf 26 -preset slow \
  -c:a aac -b:a 96k -movflags +faststart feature.mp4
ffmpeg -i "Sample Video_ Maloti.mp4" -vf scale=-2:720 -c:v libx264 -crf 26 -preset slow \
  -c:a aac -b:a 96k -movflags +faststart trailer.mp4
```

Expect roughly 20 MB and 3 MB. `+faststart` matters — without it the browser waits for the whole file before playing.

Then copy into the app: `src/assets/video/feature.mp4`, `trailer.mp4`.

### Mapping onto the three clip types

| Clip type | Source | Plays | Notes |
|---|---|---|---|
| **main** | `feature.mp4` | full 1:57 | Long enough to scrub, seek, pause and hide chrome against |
| **trailer** | `trailer.mp4` | full 0:16 | Short. Its *completion* is what triggers the paywall in subtask 1c — a 16s clip makes that easy to demo repeatedly |
| **preview** | `feature.mp4`, cut at **0:40** | first 40s | The free window. Cutting the feature itself is correct — a preview is a bound clip of the content, not separate footage |

### The free-window label

The sheet says GP sets the first 5 minutes free. The demo asset is 1:57, so a literal "5 minutes" would be a visible lie against a seekbar the user can see.

**Use "Free preview" as the label and let the seekbar carry the boundary** — the free portion styled as available, the remainder as locked, with the cut point marked. The mechanic reads correctly at any duration, and it is the better design regardless: a spatial boundary survives the chrome hiding, where a numeric countdown does not.

### What this replaces

`Seekbar.jsx` currently runs a fixed 15-second fake unrelated to any content. With real video the seekbar tracks real `currentTime` and `duration`, and the preview cut, the trailer-end trigger and the paywall's held final frame all become real events rather than timer approximations.

### Assignment in fixtures

Every paywalled title in §2 uses the same two files. `seoul-vibe` is the primary demo path and should carry all three clip types; `bike-riders` gets trailer only; `love-rosie` gets neither, so its detail page has a poster where the player would be — which is the correct treatment for a title with nothing to play.
