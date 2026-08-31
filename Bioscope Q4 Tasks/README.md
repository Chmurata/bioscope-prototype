# Bioscope+ Q4 — Design & Build Package

Four mother tasks from the Q4 roadmap. Written to be read by a coding agent as much as by a person.

**Target codebase:** the parent directory — `Bioscope Prototype/` (React 19 + Vite 8 + Tailwind v4 + Framer Motion, no backend).

---

## Scope guard

**Build phases come from `BUILD_ORDER.md` only.** The repo contains a lot of pre-existing microdrama and shorts code — it is out of scope, described only so it is not mistaken for something to extend. There is no microdrama or shorts phase. Resolve any stage by its spec filename, not its number: **Stage 4 is Dynamic Discounting, Stage 5 is the voucher marketplace.**

## Read in this order

| File | What it gives you |
|---|---|
| `DESIGN_SCOPE.md` | **Start here.** The four mother tasks, their subtasks, screen counts, blockers |
| `BUILD_ORDER.md` | **Then here.** One ordered sequence across all four, plus what not to build |
| `REVISION_BRIEF.md` | Post-build review — R1–R8, all closed |
| `SESSION_LOG.md` | What happened, decisions taken, defects fixed |
| `FIXTURES.md` | The demo catalogue — 12 packs, 8 titles, 7 vouchers, one user, two videos |
| `PROTOTYPE_STATE.md` | What exists in the codebase, what is fake, what must be built first |
| `DATA_MODEL.md` | Screen states and fixtures — subscription, long-form content, packs, paywall origin |
| `specs/` | Per-task build specs |
| `references/` | GP's wireframe and live-app captures, with direction reads |
| `Q4_ROADMAP_ANALYSIS.md` | Wider roadmap context. Background, not scope |
| `_source/` | Raw roadmap sheet export |

### specs/

| File | |
|---|---|
| `M1_PLAY_JOURNEY.md` | Mother 1 — framing + subtask index |
| `M1a_PORTRAIT_MODE.md` | Subtask 1a — portrait inline player |
| `M1b_PREVIEW_PAYWALL.md` | Subtask 1b — preview clip + free window |
| `M1c_TRAILER_AUTOPLAY.md` | Subtask 1c — trailer end handling |
| `M1d_PAYWALL_CTA.md` | Subtask 1d — the paywall moment |
| `M2_PACK_PAGE_REVAMP.md` | Mother 2 — catalogue, pack card, checkout, entitlement |
| `M3_VOUCHER_MARKETPLACE.md` | Mother 3 — framing only, blocked |
| `M4_DYNAMIC_DISCOUNTING.md` | Mother 4 — framing only |
| `SUBSCRIPTION_FLOW_BASELINE.md` | The built subscribe flow at rebuild fidelity — shared |
| `PAYMENT_MOBILE_BALANCE.md` | Direct carrier billing, MB1–MB10 — shared |

---

## Scope in one paragraph

Four mother tasks. **Play Journey Improvement** implements one rule — preview outranks trailer, subscription outranks both — across four ticketed subtasks, plus portrait playback. **Pack page revamp** rebuilds pack selection around validity × platform filtering with a hoisted recommended pack. **Digital Subscription Product Selling** sells third-party OTT vouchers, a code-based commerce model unlike anything else in the app. **Dynamic Discounting** adds segment-based and time-bound pricing on top of the pack page's price presentation.

Roughly 59 screens, and **no blockers** — everything outstanding is either decided or covered by demo fixtures. Shorts, partner integration and the platform monetisation rows are out of scope.

---

## Conventions for anyone building from this

- **Follow the reference captures, not the current prototype CSS.** The prototype's monetisation UI bypasses its own `@theme` tokens with raw hex; do not propagate that.
- **GP's wireframe is structure, not style.** Its "modernist" design system, square borders, monogram badges and placeholder brands are not a direction. Its information architecture is.
- **Design tokens live in `src/index.css`** as a Tailwind v4 `@theme` block. New colour needs a token, not a hex literal.
- **The paywall is one component with three lead-ins**, not three screens.
- **The pack card is one component** used in three places at three widths.
- **Real video now exists** — two files in `media/`, mapped in `FIXTURES.md` §5. Compress them before use. The seekbar tracks real `currentTime`, not the old fixed 15-second fake.
- Every screen in a spec should be reachable by clicking. These are clickthrough prototypes, not static comps.
- **Payment routes by where the paywall came from.** Raised on a specific title → that content's player. Raised by the generic Subscribe pill → Home.
- **Two purchase paths.** Subscribe (amber, crown) and Rent (white) — rental is 48 hours from first play.
- **The references are a starting point, not a contract.** They come from Anik's Figma; add what a flow needs, discard what is wrong. `X-RAY` is already dropped, play/pause already added.

---

## Status

| | |
|---|---|
| Roadmap read | Done |
| Scope confirmed against ClickUp | Done — 4 mother tasks, 4 subtasks under mother 1 |
| Subscription baseline documented | Done |
| Mobile balance flow | Done — from live-app reference |
| GP pack wireframe read | Done — mother 2 unblocked |
| Mother 1 — all 4 subtasks | Specced |
| Mother 2 — pack page | Specced |
| Mother 3 — vouchers | Specced on demo fixtures |
| Mother 4 — discounting | Framed |
| Demo fixtures | Done — `FIXTURES.md` |
| Build order | Done — `BUILD_ORDER.md` |
| Build — stages 0–5 | Done by Antigravity |
| Review | Done — `REVISION_BRIEF.md`, 8 items |
