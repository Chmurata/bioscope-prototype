# Prototype states & fixtures

What the clickthrough prototype needs to hold in order to show every screen. Not an API contract — this is fixture shape and screen state, nothing more.

---

## 1. Subscription state

One thing, two values: **subscribed or not**, and if subscribed, **which pack**.

```js
subscription = null | { packId, expiresLabel: 'Expires 12 Sep' }
rentals = ['ctn-001']     // titles rented outright — 48h from first play
```

That is enough. Every screen in scope branches on "does this user have a pack that covers this content" — which for prototype purposes is a lookup against the pack's coverage, not a computation.

The dev panel toggles it directly.

## 2. Long-form content

The prototype has microdrama objects only. Long-form needs its own fixture with the three clip types the play journey depends on.

```js
content = {
  id, title, poster, backdrop,
  synopsis, cast, genres, duration, year, rating, provider,

  isPaywalled: true,
  packs: ['standard', 'duo-binge'],   // which packs unlock it

  hasTrailer: true,
  hasPreview: true,
  previewMinutes: 5,

  rentPrice: 99,          // null when the title cannot be rented
  rentHours: 48,          // from first play, not from purchase
  likes: '7.8k',
  badges: ['HD', '16+'],  // quality + maturity only — no X-RAY
  moreLikeThis: [ /* poster + title */ ],
}

// fixtures need at least one title with rentPrice: null,
// so the single-CTA paywall layout is reachable
```

Fixtures must cover four cases so every branch is clickable:

| Case | Paywalled | Preview | Trailer |
|---|---|---|---|
| Free | no | — | optional |
| Paywalled, preview bound | yes | yes | yes |
| Paywalled, trailer only | yes | no | yes |
| Paywalled, nothing to play | yes | no | no |

The last case goes straight to the paywall from the detail page rather than opening an empty player. It is not in the sheet — it is just what has to happen.

## 3. What plays

Preview outranks trailer; subscription outranks both.

1. Not paywalled → **content**
2. Subscribed and covered, or rented → **content** *(no trailer — subtask 1c)*
3. Has preview → **preview**, paywall at the end *(1b)*
4. Has trailer → **trailer**, paywall at the end *(1c)*
5. Otherwise → **paywall**, no player

## 4. Paywall

```js
paywall = { origin, content }
```

`origin` is `'preview-end' | 'trailer-end' | 'locked-tap' | 'generic'`.

It decides two things and nothing else — **the framing copy**, and **where the user lands after paying**:

| Origin | Behind the paywall | After payment |
|---|---|---|
| `preview-end` | Preview's last frame | **Player, this content** |
| `trailer-end` | Trailer's last frame | **Player, this content** |
| `locked-tap` | Content detail page | **Player, this content** |
| `generic` | Wherever the Subscribe button was pressed | **Home** |

`generic` is the amber Subscribe pill in the home top bar — no content in context, so there is nothing to return to.

## 5. Packs

```js
pack = {
  id, title, subtitle,
  badge: 'Recommended for All' | 'Best for GP Users' | 'Only for Skitto Users' | null,
  eligible: true,                  // false = user cannot buy this one
  recommended: false,              // one pack; sits above the list, exempt from filters
  duration: '1 Week',
  durationDays: 7,                 // so the validity filter works
  telcoValue: '5 GB Internet',     // or '30 Min + 100 SMS', or null
  coverage: 'Get access to 10 OTT platforms',
  providers: ['hoichoi', 'deepto', ...],   // OTTLogoStrip tiles
  price: 99,
  originalPrice: 149,              // real former price, not price × 1.5
  priceUnit: '/ 7 days',
  kind: 'ott' | 'ott+tvod' | 'data+ott',
  payWith: ['balance', 'bkash', 'nagad', 'card'],
  unlocks: ['ctn-001', ...],       // or a coverage tag — whatever is simplest to fake
}
```

Real values from the live app, for the fixture:

| Pack | Badge | Duration | Telco value | Price |
|---|---|---|---|---|
| Standard | Recommended for All | 1 Week | 5 GB Internet | ~~৳149~~ ৳99 |
| Duo Binge + GP User Plan with Minutes | Best for GP Users | 1 Month | 30 Min + 100 SMS | ~~৳299~~ ৳179 |
| Family + 5GB Internet | Only for Skitto Users | 3 Months | — | ~~৳345~~ ৳229 |

Fixtures need at least one `eligible: false` pack so P5 is reachable.

## 6. Player

```js
player = {
  orientation: 'portrait' | 'landscape',
  chromeVisible: true,
  playing: true,
  mode: 'content' | 'preview' | 'trailer',
  position: 0,        // seconds
}
```

Play/pause and skip live at the centre of the video surface, revealed and hidden with the rest of the chrome. They are missing from the reference frames by omission, not by design.

Fake playback timings should match the flow being shown. A 5-minute preview window and its approaching-end warning cannot be demonstrated on the 15-second fake the current `Seekbar` runs.

## 7. Dev panel

`ControlPanel.jsx` must reach every branch directly, or the prototype is undemoable:

- Subscribed / not subscribed, and which pack
- Rented / not rented, for the current title
- Content case — free / preview / trailer only / nothing
- Orientation — portrait / landscape
- Jump to paywall by origin
- Carrier account — known / unknown (shows or hides Mobile Balance)
