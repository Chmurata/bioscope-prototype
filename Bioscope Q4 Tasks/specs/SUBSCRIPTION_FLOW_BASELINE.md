# Subscription flow — existing baseline

The microdrama subscribe flow already built in `Bioscope Prototype/`. **Task D reuses this rather than designing a new one.** Documented here at rebuild fidelity so the tweaks can be expressed as a delta.

Source files: `src/components/SubscribeSheet.jsx`, `PlanCard.jsx`, `PaymentMethodList.jsx`, `OTTLogoStrip.jsx`, `src/data/plans.js`, `src/data/paymentMethods.js`.

---

## Shell

Bottom sheet, not full-screen.

- Overlay `absolute inset-0 z-[60]`, framer opacity `0→1→0`
- Scrim `absolute inset-0 bg-black/80`, tap-to-close
- Sheet `absolute bottom-0 inset-x-0 bg-[#0A090B] rounded-t-[20px] overflow-hidden h-[95%] flex flex-col ring-1 ring-white/5`
- Entrance `initial={{y:'100%'}} animate={{y:0}} exit={{y:'100%'}}`, `spring damping:34 stiffness:320`
- Each stage is `flex-1 flex flex-col overflow-hidden`. Stage swaps are plain state changes — **no transition between stages**

---

## Stage 1 — Plans

Header (back arrow only, `px-4 pt-5 pb-4`, `ArrowLeft size=20 strokeWidth=2`) → scrollable body `flex-1 overflow-y-auto overscroll-contain px-4 pb-8`.

**Copy in order**
1. "Choose Your Plan" — `text-[26px] font-bold text-white mb-5`
2. "Make your own plan" — 18/700/white `leading-[28px]`
3. "Make your custom plan in 2 simple steps" — 12/400/white `leading-[18px] mt-0.5`
4. "Create Package" — 12/500/`#2A2A2A`
5. "Or" — `text-[12px] text-white/50`

**Flexiplan hero** `rounded-[16px] bg-[#212628] ring-1 ring-[#373A3D] p-4 mb-3 flex flex-col gap-4`. Crown SVG 44×44 + text block; CTA `w-full h-[30px] bg-white rounded-[8px]` with `Plus size=16`.

**Divider** `flex items-center gap-3 my-4`, two `flex-1 h-px bg-white/10` flanking "Or".

**Plans** three stacked `PlanCard`s, `space-y-3`. Tapping one selects **and immediately routes to checkout** — no confirm step.

---

## Stage 2 — Checkout

Header → scrollable body `px-4 pb-6` → **sticky footer** `shrink-0 bg-[#212628]`.

**Copy in order**
1. "Checkout" — 26/700/white `mb-5`
2. Plan title e.g. "Bioscope+ Super" — 20/700/white
3. Duration e.g. "1 month" — 13/500/`white/85`, beside `Clock size=14`
4. Plan subtitle — 12/400/`white/70`
5. "Select Payment Method" — 15/700/white
6. "Amount Payable" — 14/700/white
7. Struck price `৳{round(price*1.5)}` — 14/300 `text-[#9DA4AE] line-through tabular-nums`
8. Live price `৳{price}` — 14/700/white `tabular-nums`
9. "Proceed to Payment" — 14/500/`#2A2A2A`
10. "By continuing you are agreeing to our Terms & condition" — 10/400/`#9DA4AE` centered; "Terms & condition" inline span `#00BBFF`, no underline

**Plan summary card** `rounded-[16px] bg-[#1E2224] ring-1 ring-white/8 px-4 pt-4 pb-4 mb-5`. Order: title `mb-3` → duration row `gap-1.5 mb-3` → subtitle `mb-3 leading-snug` → poster row `flex gap-1.5 mb-3`, ≤3 thumbs `76×44 rounded-[6px] bg-black/30 object-cover` → `OTTLogoStrip size=38 cols=7`.

**Collapsed payment row** `w-full flex items-center gap-2 rounded-[10px] bg-transparent ring-1 ring-[#00BBFF] px-3 py-3 mb-6`. Left: `PAYMENT_PREVIEW` chips `h-[22px] min-w-[34px] px-1.5 rounded-[3px]` white bg, `gap-1.5`. Right: `20×20` circle `bg-[#00BBFF]` + `Check size=12 text-[#0A090B] strokeWidth=3`.

**Footer** `flex flex-col gap-3 px-3 py-3`; amount row `justify-between`, prices `flex items-baseline gap-1.5`. CTA `w-full h-[40px] bg-white rounded-[8px]` + `ArrowRight size=16`.

---

## Stage 3 — Payment method

**The only stage on a white body.** Header stays dark `bg-[#0A090B]`; body `flex-1 overflow-y-auto px-4 pt-5 pb-6 bg-white`; footer `shrink-0 bg-white px-4 pt-3 pb-5 border-t border-black/5`.

**Copy:** "Payment Method" (15/700/`#1A1A1A`) · "bKash" · "Rocket" · "Nagad" · "Other Cards & MFS" · "upay" (15/600/`#1A1A1A`) · "Saved by bKash" (13/400/`#6B7280`) · `Continue to pay ৳{price}` (14/500/`#2A2A2A`) + `ArrowRight size=16`.

Footer CTA is `bg-white ring-1 ring-[#D2D6DB] rounded-[8px]` — **the only ringed CTA in the flow.**

**MethodRow** `w-full flex items-center gap-3 rounded-[8px] px-3 py-3`. bKash highlighted with `bg-[#E7EFFF]`; others transparent with `hover:bg-black/[0.02]`. Tile `w-[48px] h-[32px] rounded-[4px] ring-1 ring-black/10 p-1`, `tileBg #FFFFFF`, logo `object-contain`. Name `flex-1 15/600 #1A1A1A`. Radio `w-[20px] h-[20px] rounded-full ring-1` — selected `ring-[#1E40E8]` + inner `w-[10px] h-[10px] bg-[#1E40E8]`; unselected `ring-[#9DA4AE]`.

**Ghost checkbox row** — static, non-interactive, always unchecked. `flex items-center gap-2 pl-1 py-2.5 mb-1`, box `w-[16px] h-[16px] rounded-[3px] ring-1 ring-[#9DA4AE]`.

**Divider** `h-px bg-[#E5E7EB] mb-1` between ghost row and remaining methods.

---

## Stage 4 — Processing

`flex-1 flex flex-col items-center justify-center px-5`, dark bg, no header, no scroll.

Spinner is CSS not framer: `w-[56px] h-[56px] rounded-full border-[3px] border-[#00BBFF]/20 border-t-[#00BBFF] animate-spin`.

Copy: "Processing payment…" 15/600/white `mt-5` · "Securing your subscription" 12/400/`white/55` `mt-1`.

Advances after a hardcoded **1400ms** `setTimeout`.

---

## Stage 5 — Success

`flex-1 flex flex-col items-center justify-center px-5 pb-8`.

**Badge** `w-[80px] h-[80px] rounded-full bg-gradient-to-br from-[#73F5FD] to-[#00BBFF] shadow-[0_10px_32px_rgba(0,187,255,0.55)]`, `Crown size=40 fill="#0A090B" strokeWidth=2`.
- Entrance `initial={{scale:0, rotate:-15}} animate={{scale:1, rotate:0}}`, `spring damping:12 stiffness:200`
- Halo `absolute inset-0 rounded-full ring-2 ring-[#73F5FD]/60`, `animate={{scale:[1,1.5], opacity:[0.6,0]}}`, `duration:1.2 repeat:Infinity`

**Copy:** "You're Premium!" 22/700/white `mt-5` · `{plan.title} is active. All microdramas unlocked — ad-free, HD, downloadable.` 13/400/`white/60` `max-w-[280px] mt-1.5` · perks "Ad-free playback" / "Full HD + multi-audio" / "Offline downloads" 13/400/`white/90` · "Start watching".

**Perks card** `w-full mt-6 rounded-[12px] bg-[#1E2224] ring-1 ring-white/8 px-4 py-3 space-y-2`; each row `flex items-center gap-2.5` with chip `w-[18px] h-[18px] rounded-full bg-[#00DF00]/20` + `Check size=11 text-[#00DF00] strokeWidth=3`.

**CTA** `w-full mt-6 bg-white text-[#0A090B] font-semibold text-[15px] rounded-full py-3.5` — **the only pill-shaped button in the flow**; every other CTA is `rounded-[8px]`.

---

## PlanCard

Root `<button>` `rounded-[16px] px-4 pt-4 pb-4 relative transition-all`.

| Variant | Background |
|---|---|
| `primary` (Super) | `linear-gradient(135deg,#1E2A6B 0%,#111A42 40%,#0A0F28 75%,#050813 100%)` |
| `neutral` (Bangla, Weekly) | `#1E2224` |

**Selected** `ring-1 ring-[#00BBFF]/60` + `shadow-[0_0_0_1px_rgba(0,187,255,0.1),0_10px_30px_rgba(0,187,255,0.18)]`
**Unselected** `ring-1 ring-white/8`

Selection is communicated **only** by ring and glow — no radio, no checkmark.

**Ribbon** (when `plan.badge` exists) — pill `absolute z-20 bg-white px-2`, inline `top:22 right:-5 height:17`, `borderRadius:'4px 4px 0 4px'`, `boxShadow:'-4px 2px 6px rgba(0,0,0,0.5)'`, text 9/500/`#25323D`. Folded tail `absolute z-10 top:39 right:-5 w:5 h:6 background:#7A7A7A`, `clipPath:'polygon(100% 0, 0 0, 100% 100%)'`.

**Stack** title `18/700/white leading-[28px] pr-[108px]` → duration+price row `justify-between mt-2 mb-2` (`Clock size=14 #D2D6DB strokeWidth=1.75` + 14/400/`#D2D6DB`; price `18/700/white tabular-nums`) → subtitle `12/400/white-90 mb-2 leading-[18px]` → posters `flex gap-1 mb-2`, ≤3 at `60×34 rounded-[4px]` → `OTTLogoStrip size=26 cols=10`.

**Plans**

| id | title | badge | duration | price | variant |
|---|---|---|---|---|---|
| super | Bioscope+ Super | Recommended for All | 1 month | ৳299 | primary |
| bangla | Bioscope+ Bangla | — | 1 month | ৳109 | neutral |
| weekly | Bioscope+ Weekly | Best for New Users | 1 week | ৳79 | neutral |

`OTTLogoStrip` — `flex gap-1 flex-wrap`, container `maxWidth = cols*(size+4)-4`. Real logo → `bg-white` + `img object-cover`; otherwise a CSS text tile in the brand's own colours from `OTT_BRANDS`, font scaled `round(fs*size/44)`. Super/Weekly carry 9 brands, Bangla 3.

---

## De-facto colour palette

None of these files reference a `@theme` token — every value is a raw hex literal.

| Role | Value |
|---|---|
| Sheet bg | `#0A090B` |
| Card bg | `#1E2224`, `#212628` |
| Ring | `white/8`, `#373A3D` |
| Accent (cyan) | `#00BBFF` |
| Accent gradient | `#73F5FD → #00BBFF` |
| Success | `#00DF00` |
| Payment radio blue | `#1E40E8` |
| Muted text | `#9DA4AE`, `#6B7280`, `#D2D6DB` |
| Light heading | `#1A1A1A` |
| Highlight wash | `#E7EFFF` |
| Light divider | `#E5E7EB` |

---

# Task D delta

What changes when this flow serves the paywall instead of a locked microdrama episode.

## Must change

**1. Three lead-ins.** Today the sheet always opens on "Choose Your Plan". Task D needs a framing block above the plans that varies by `paywall.origin`, with the paused video visible behind the scrim in two of three cases.

| Origin | Behind scrim | Lead-in |
|---|---|---|
| `preview-end` | Preview's last frame | Free window is spent |
| `trailer-end` | Trailer's last frame | Trailer finished, content is paywalled |
| `locked-tap` | Detail page | No video; entered before playback |

**2. A compact variant.** `h-[95%]` over a paused player is heavy. Task D4 needs a short sheet — framing + plans only — that escalates to the full `h-[95%]` flow on selection.

**3. Success copy is microdrama-specific.** *"All microdramas unlocked — ad-free, HD, downloadable"* is wrong for long-form. Needs to name the content or the pack's actual scope.

**4. Success must return, not close.** `close()` currently just dismisses. It has to resume the content at `paywall.resumeAt` — where the preview stopped. CTA copy should follow: "Start watching" → resume framing.

**5. The unlock has to be real.** `handlePay` flips `isVip`, which nothing reads. Against `DATA_MODEL.md` it should grant the pack so `resolvePlayback` re-resolves to `mode: 'content'`. Without this the whole journey dead-ends at success.

**6. Plans must be filtered by `requiredPacks`.** All three plans always show. A paywall raised on specific content should surface the packs that actually unlock it, and rank them.

## Worth fixing while we're in here

- **Checkout's payment row reads as pre-selected** — the cyan checked badge appears before the user has been to the payment screen. It is a preview strip, not a confirmation.
- **The white payment stage** is an abrupt mid-flow theme flip. Probably deliberate — it mirrors real MFS checkout — but confirm before carrying it into the paywall context, where it lands right after a dark video frame.
- **Two accent blues.** `#00BBFF` everywhere, `#1E40E8` for payment radios only.
- **Two button shapes.** `rounded-full` on success, `rounded-[8px]` on every other CTA.
- **"Saved by bKash" is a decorative, permanently-unchecked box.** Either wire it or drop it.
- **No stage transition.** Stage swaps are instant state changes inside a sheet that itself springs in. A cross-fade or slide would cost little.
- **Struck price is `price × 1.5`,** invented at render. Fine as a demo, but it should come from the plan fixture once discounting is real.
- **Zero token usage.** New Task D surfaces should add `@theme` tokens for at least `#0A090B`, `#1E2224`, `#00BBFF`, `#00DF00` rather than extending the hex sprawl.
