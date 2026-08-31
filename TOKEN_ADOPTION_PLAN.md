# Bioscope Design System → Prototype Adoption Plan

Source of truth: Figma file **Bioscope x Gotipath** (audit: `../bioscope-design-system.md`)
Target: `Bioscope Prototype/` — React 19 + Vite 8 + Tailwind 4, tokens in `src/index.css` `@theme`

---

## 1. What the check found

### Figma side (104 variables, 3 collections)

| Collection | Vars | Contents |
|---|---|---|
| Tokens (Saas) | 30 | Padding + Spacing (two **identical** 11-step scales, 0–32), Corner Radius (na/sm/default/md/lg/xl/2xl/3xl/full, 0–100) |
| Typography (Value) | 37 | 16 sizes (tn 10 → xxl 60), 16 line-heights (14–68), 4 weights, 1 family |
| Colors (Dark Mode) | 37 | base / text / bg / border / primary 50–500 / success / error / premium |

Plus 64 text styles (16 sizes × 4 weights), 3 paint styles, 1 effect style, 201 components.

### Prototype side

47 flat colour tokens, `Inter`, **no** spacing / radius / type-scale tokens at all, single dark theme, **122 raw hex literals** still in JSX.

### The honest verdict

Spacing, radius and typography are a **clean import** — the prototype has nothing there, Figma has complete scales. Colour is **not** a clean import: the two palettes genuinely disagree, and typography has a font-licensing question. Those are decisions, not merges.

---

## 2. Conflicts that need a decision before any code moves

| # | Figma | Prototype | Impact |
|---|---|---|---|
| C1 | Family = **Telenor Evolution** | **Inter** (Google Fonts) | Every screen. Needs the licensed webfont; no fallback metric-matches it. |
| C2 | Brand = **#00BBFF** (cyan) | `--color-brand: #2b9c9c` (teal) | Brand colour across all four mother tasks. |
| C3 | ~~Primary ramp conflict~~ **NOT A CONFLICT** | `--color-accent: #4664f5` | Exact match for Figma `primary/300`; `--color-accent-light` matches `primary/200`. Rename only, no value change. |
| C4 | bg-card **#181D1F** | `--color-card: #262b30` | Every card surface reads lighter today. |
| C5 | Colors collection is **Dark Mode only**, all primitives, **zero aliases** | prototype names are already semantic | We must author the semantic layer ourselves; Figma can't supply it. |

`--color-bg: #111618`, `--color-accent` / `--color-accent-light` (= `primary/300` / `primary/200`) and the premium gradient `#FFDC86 → #FFD160` already match exactly — those carry over untouched.

> Superseded by **`TOKEN_ADOPTION_SPEC.md`**, the cold-start-executable version with all tables inlined. This file is the decision record.

---

## 3. Implementation stages

### Stage 0 — Decisions (RESOLVED 2026-08-30)

- **C1 Font → Telenor Evolution.** Figma wins. Sourced: installed at `~/Library/Fonts/` as OTF — `TelenorEvolution-{Light,Normal,Medium,Bold,ExtraBoldSlanted}.otf`. All four weights Figma uses are present. Stage 1 converts them to `.woff2` (`fonttools` + `brotli`), vendors them into `src/assets/fonts/`, and adds `@font-face`; Inter is dropped from `index.html`. No metric-compatible fallback, so expect line-length and vertical-rhythm shifts on every screen — Stage 5 must re-check truncation and button widths.
- **C2–C4 Colour → Figma wins, replace all.** The prototype's teal `#2b9c9c`, accent `#4664f5` and card `#262b30` are treated as drift and codemodded out in favour of `#00BBFF`, the `primary/50–500` indigo ramp and `#181D1F`. No exceptions list.

### Stage 1 — Primitive layer
Export all 104 Figma variables into `@theme` as primitives, normalising on the way in:
- collapse duplicate **Padding**/**Spacing** into one `--spacing-*` scale
- fix `line-hight` → `--leading-*`
- reconcile the size-name clash (`s-xxl` vs `text-xxl-2` vs style `xxxl`) to one ladder
- keep radius names as-is (`sm`/`default`/`md`/`lg`/`xl`/`2xl`/`3xl`/`full`)

Deliverable: `src/tokens/primitives.css`.

### Stage 2 — Semantic layer (the piece Figma is missing)
Hand-author aliases on top of primitives: `--color-text-{primary,secondary,tertiary,quaternary,brand}`, `--color-bg-{page,card,card-alt,footer}`, `--color-border-*`, `--color-state-{success,error}`, `--color-premium-*`. Every existing prototype token name maps here so components need no rename. Single dark mode — Figma has no Light mode, so **do not** build light theming.

Deliverable: `src/tokens/semantic.css`, imported by `index.css`.

### Stage 3 — Type scale
Replace ad-hoc `text-[Npx]` with the 16-step scale paired to its line-height, plus the 4 weights. Emit as Tailwind `--text-*` / `--leading-*` / `--font-weight-*`.

### Stage 4 — Migration codemod
Rewrite `token_pass.cjs` (today it only handles 6 hex values) into a real codemod: full hex→token map for all 122 literals, old-token→new-token renames, `text-[…]`/`p-[…]`/`rounded-[…]` arbitrary values → scale steps. Run it, then hand-fix the residue.

### Stage 5 — Per-screen sweep, in the existing build order
M1 Play Journey → M2 Pack page → M4 Dynamic Discounting → M3 Vouchers. Reconcile each against its Figma component family (Buttons 120 variants, Toggle 100, Navbar/Header/Sidebar/Subscription/Player). Close the two known open items — PaymentMethodList / PaywallSheet payment-UI duplication — during M2.

### Stage 6 — Verify
`grep -rE '#[0-9a-fA-F]{6}' src` returns zero outside the token files; `npm run lint` clean (this project has **no** TypeScript — no tsconfig, no `tsc`); visual pass by Anik.

---

## 4. What we are deliberately not taking from Figma

- The ~90 unsystematised 24×24 icon components (not a component set; leave icons as-is)
- Full-page screens registered as components
- `text-base/regular` (unbound)
- The 2 raw-hex unbound gradient paint styles — re-author as tokens
- Grid style (Web/desktop only; prototype is mobile-first)
