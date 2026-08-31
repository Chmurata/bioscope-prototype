# Session log — 30 Aug 2026

## What happened

Started from a Google Sheet of Bioscope+ Q4 roadmap items and ended with a built, running clickthrough prototype plus a full spec folder.

**Scope resolved in stages.** The sheet's rows 4–7 became four mother tasks: Play Journey Improvement (4 ClickUp subtasks), Pack page revamp, Digital Subscription Product Selling, Dynamic Discounting. Rows 1, 2, 8 and 9 are out of scope. Pack page and vouchers were initially blocked; both were unblocked — GP's wireframe arrived, and vouchers were built on demo fixtures instead of waiting on partner specs.

**References received and analysed:** GP's OTT package-selection wireframe (structure only — its visual language was explicitly not a direction), the live-app mobile-balance payment flow (9 frames), and the single-content detail/player screens from Anik's Figma (3 frames).

**Antigravity built stages 0–5.** Two review passes followed: an initial audit (two crash-level defects found and fixed), then a revision brief of 8 items, all now closed.

## Decisions taken

| Decision | |
|---|---|
| Post-payment routing | Paywall raised on a title → that content's player. Generic Subscribe pill → Home |
| Rental | ৳99, **48 hours from first play**, stated on the confirmation |
| Trailer end | Last frame holds, paywall rises immediately, no countdown. Only completion triggers it; dismiss returns to the detail page; fires once per title per session |
| Ineligible packs | Shown with the requirement stated and no CTA — hiding makes catalogues silently differ between users |
| CTA layout | Stacked, not side-by-side |
| Preview label | "Free preview" with a spatial seekbar boundary, not a minute count — the demo asset is 1:57, so "5 minutes" would be a visible lie |
| X-RAY badge | Dropped — a mislabelled genre tag, not a real capability |
| Campaign control panel | Out of scope — internal admin tool |
| Inline player | Autoplays muted with the promo clip |

## Corrections made along the way

- **Mother-task grouping.** First read treated Play Journey as one task and pulled in three others as siblings. The four ClickUp tickets are subtasks *of* Play Journey; rows 5–7 are separate mothers.
- **Pack page merge.** Folded into Task D, then un-folded when the mother-task structure became clear. The coupling survives as a build-order constraint: the pack card is built in mother 2 and consumed by 1d.
- **Mobile balance spec.** First draft assumed balance shown inline, prepaid/postpaid split, and a recharge path. The real flow has none of those — it has OTP auth and regulatory spending-limit disclosure. Rewritten from the frames.
- **Backend jargon.** Specs initially carried entitlement plumbing, settlement semantics and function signatures. Stripped — this is a design prototype, and `DATA_MODEL.md` is now fixture shape only.

## Defects found and fixed

**From the first audit**
- `ContentDetailScreen.jsx` used `useEffect` and `Crown` without importing them — `ReferenceError` on mount, taking down the whole detail chain
- `vouchers.js` seeded the locker with a schema the components did not read, so every row resolved to null

**Revision brief R1–R8** — all closed
- R1 `orientation` / `carrierKnown` were written but never read
- R2 payment list ignored `pack.payWith`
- R3 pack strip raised the paywall with the wrong origin, dumping payers at Home
- R4 trailer paywall dismissal left a dead final-frame player mounted
- R5 comparison sheet was hardcoded tiers
- R6 window campaigns had no upcoming/active/ended states
- R7 no field error on invalid number; one failure path instead of two
- R8 ~176 raw hex literals → 0 across six files, 46 tokens in `@theme`

**Layout fixes**
- Five sheets used `fixed` and escaped the phone frame → `absolute`
- Sheet heights used `vh` (browser window) → `%` (frame)
- Status bar sat at z-40 beneath screens at z-45, and vanished on the player → hoisted to z-200 above everything
- PackCatalogue was mounting twice

## Doc defect worth remembering

Antigravity named Stage 4 "microdrama expansion". Cause was in the docs, not the agent: Stage 4 was the only stage whose Spec column gave no resolvable filename, and stage numbers cross-wire with mother-task numbers at the end (Stage 4 → Mother 4, Stage 5 → Mother 3). Fixed with a Stage map, full filenames everywhere, and a scope guard moved to the top of the file.

## State at end of session

Dev server on **5181**, LAN-exposed. All specs in this folder; `BUILD_ORDER.md` and `REVISION_BRIEF.md` are the working documents.

**Open:**
- `PaymentMethodList.jsx` and the payment UI inside `PaywallSheet.jsx` are still two components doing one job
- Most screens likely need a design revision pass — they have been reviewed for correctness, not for craft

---

# Session 2 — 30 Aug 2026 (later)

## What happened

Connected to the Figma file **Bioscope x Gotipath**, audited its design system, planned the token adoption, specced the subscription screen — then a codemod run in Antigravity broke the prototype's colours and typography, and the rest of the session was spent recovering them.

**Design system audit.** 104 variables across three collections: Tokens (Saas) — duplicate Padding/Spacing scales plus corner radii; Typography (Value) — 16 sizes, 16 line-heights, 4 weights, family Telenor Evolution; Colors (Dark Mode) — 37 primitives with **no alias layer and no light mode**. Plus 64 text styles, 3 paint styles, 201 components. Full audit at `../../bioscope-design-system.md`.

**Adoption planned.** Spacing, radius and typography were a clean import (the prototype had no scales at all). Colour was not — the palettes genuinely disagreed. Three documents produced in `../`: `TOKEN_ADOPTION_PLAN.md` (rationale), `TOKEN_ADOPTION_SPEC.md` (cold-start executable, all tables inlined), `TOKEN_DECISIONS.md` (44 unresolved rows bucketed by ΔE2000 + usage).

**Subscription screen specced.** Figma frame "Choose Your Plan" (`11781:112304`, 360×1226) → `../specs/FIGMA_SUBSCRIPTION_SPEC.md`. Existing prototype flow inventoried → `../specs/PROTOTYPE_SUBSCRIPTION_INVENTORY.md`. The comparison: Figma is ahead on card anatomy (OTT logo chips, duration/data chip, a working Flexiplan entry with 2-step tracker); the prototype is ahead on behaviour (Figma has no selected, error, empty or campaign states at all).

## Decisions taken

| Decision | |
|---|---|
| Font | **Telenor Evolution** over Inter. Installed locally as OTF (Light/Normal/Medium/Bold); to be converted to woff2 and vendored, not relied on as a system font |
| Colour | **Figma wins, replace all.** Prototype teal `#2b9c9c` and card `#262b30` treated as drift. No exceptions list |
| `--color-accent` | **Not a conflict** — `#4664f5` is an exact match for Figma `primary/300`; rename only, no value change |
| Light mode | Not built. Figma has no light mode to adopt |
| Icons | The ~90 unsystematised 24×24 Figma icon components are not adopted |

## The codemod incident

`token_pass.cjs` + a generated `fix_missed.cjs` were run against `src/`. An Antigravity undo then reverted **`src/index.css` only** — leaving every component referencing tokens that no longer existed. Symptoms: wrong colours across the app, subscribe button among them.

**Two distinct failure modes, both mechanical:**

1. **Prefix concatenation.** The new token names carried their own role prefix (`bg-card-light`, `text-brand`), and the codemod appended the utility prefix on top — producing `bg-bg-card-light`, `text-text-brand`, and in a few places `bg-bg-bg-bg-card`. Invalid classes render as no colour, silently.
2. **Bare tokens into strings.** `fix_missed.cjs` did raw find-and-replace on hex, so it also rewrote values inside comments, inline styles and SVG attributes — `background: '#7A7A7A'` became `background: 'text-quaternary'`, and `fill="#0A090B"` became `fill="base-black"`.

**A third, quieter one:** the codemod also converted all 333 arbitrary `text-[Npx]` classes to named steps. The project has no named type scale, so `text-tn` (70 sites) rendered at inherited size and the rest silently resolved to stock Tailwind sizes.

## How it was recovered

`dist/` had been built at 17:04, **before** the codemod — a lossless snapshot of the original authored class strings. Every restoration was read off that bundle rather than inferred. Git was not usable: all Q4 work is uncommitted, so `HEAD` predates the entire build.

- `fix_missed.cjs` damage inverted exactly (file-scoped and 1:1) — 15 restorations
- `base-white` → `white` (601 sites), `*-text-brand` → `*-cyan` (45), `base-black` → `dark` (31), `primary-*` → `accent`/`select-blue`/`select-tint`
- `bg-bg-card-light` (40) split back to its true `surface-dark` / `surface-alt` / `surface-panel` mix rather than collapsed to one
- 305 of 333 font sizes restored exactly

**Own error worth recording:** `text-text-muted` was flagged as broken and collapsed to `text-muted`. It was legitimate all along — `--color-text-muted` correctly yields `text-text-muted` in Tailwind v4. Caught and reverted. The lesson is that a role-prefixed token name looks identical to a doubled prefix; the token list is the arbiter, not the pattern.

## Lessons

- **A codemod that renames tokens must know the utility grammar**, not just the strings. Role-prefixed token names (`text-*`, `bg-*`) make naive prefix concatenation produce plausible-looking dead classes.
- **Never find-and-replace hex globally** — hex appears in comments, inline styles and SVG attributes where a class name is meaningless.
- **A stale `dist/` is a recovery asset.** It was the only lossless record of pre-codemod state; don't clean it before a risky migration.
- **Many-to-one mappings destroy information.** Seven different hexes collapsed to `bg-card`, and four px sizes to `text-tn` — neither is invertible from the source alone.

## State at end of session

Colours and typography restored and verified: no named size classes remain, every colour class resolves to a real token, no double-role artifacts. `npm run lint` reports 58 pre-existing problems (unused vars, hooks) — none from the repair. Backup of `src/` from before the repair is in the session scratchpad.

**Open:**
- 28 font sizes in `SubscribeSheet.jsx` (22), `PlanCard.jsx` (5) and `SwipeHint.jsx` (1) are the codemod's equivalent px, not recovered values — these files post-date the 17:04 build. Within ~1px, worth an eyeball
- 4 colour values inferred in the same files: `ring-icon-subtle`, `text-outline-light` ×2, `text-badge-ink`
- `token_pass.cjs` and `fix_missed.cjs` are still on disk and should be deleted so neither can be re-run
- Token adoption itself is **not done** — it was reverted, not completed. `TOKEN_ADOPTION_SPEC.md` still stands, but Stage 4's codemod must be rewritten to be grammar-aware before any re-run
- 12 of the 44 token decisions still need Anik: 5 extension tokens, 7 genuine gaps. Most consequential are `--color-text-muted` (20 usages), `--color-brand-light` `#46ffff` (9), and `--color-gp-blue` (Grameenphone's carrier blue — a partner colour, not a design-system one)
- Carried over from session 1: `PaymentMethodList.jsx` / `PaywallSheet.jsx` still duplicate the payment UI; screens still need a craft pass
