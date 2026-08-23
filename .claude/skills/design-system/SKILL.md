---
name: design-system
description: ShrotiHost's concrete design tokens and component patterns — spacing, type scale, radii, elevation, color, motion, grid. Load this before styling any new component or reviewing one for consistency, instead of re-deriving values from scratch or copying a nearby component by eye.
---

# ShrotiHost Design System

This is the concrete, shipped design language — every value below is read from
`src/app/globals.css` and the components that actually use it, not invented.
`docs/planning/14_UI_DESIGN_SYSTEM.md` through `21_COMPONENT_LIBRARY.md` are
the original aspirational vision docs (goals, principles, "why") — read them
for intent, but where they're abstract ("use consistent radius") and the code
is concrete, **the code in this skill is the source of truth.** One
correction to flag: `14_UI_DESIGN_SYSTEM.md` says "prefer skeleton loaders
over spinners" — that was explicitly overturned mid-project (see
`docs/scroll-choreography.md` / the hero's checklist pattern); real
deployment states beat skeleton placeholders. Trust the shipped pattern, not
the earlier draft, when they conflict.

Last reconciled with `globals.css`: 2026-08-23 design audit (see `DESIGN.md`).

## Theme model

- `:root` holds the **light** palette. `[data-theme="dark"]` holds the dark
  palette. Tailwind's `dark:` variant is remapped to `[data-theme="dark"]`
  (`@custom-variant dark` at the top of `globals.css`), never to
  `prefers-color-scheme`.
- **Dark is the brand default.** `theme-script.tsx` stamps
  `data-theme="dark"` before first paint unless the visitor has chosen light
  via `ThemeToggle` (persisted in storage). When you screenshot or reason
  about "the site", reason about dark first, then check light.
- Never hardcode a hex value in a component; use the Tailwind utility that
  maps to the token (`bg-card`, `text-text-secondary`, `border-border-strong`,
  `bg-error`, …). Both palettes are opaque. There is no glassmorphism.
- **Blur exception (the only one):** sticky chrome — the site header and the
  mobile sticky CTA — may use `backdrop-blur` over a translucent
  `bg-surface-raised/95`. Nothing else blurs. Do not add `backdrop-blur-*`
  to cards, panels, dropdowns or dialogs.

## Color tokens (`globals.css`)

| Token | Light `:root` | Dark `[data-theme="dark"]` (default via theme-script) | Use for |
|---|---|---|---|
| `--color-bg` | `#ffffff` | `#0a0a0f` | Page canvas — opaque |
| `--color-surface` | `#f7f5fa` | `#131318` | Section alternation (`bg-surface/30`) — opaque |
| `--color-surface-raised` | `#ffffff` | `#191921` | Dropdowns, nav, card headers — opaque |
| `--color-card` | `#ffffff` | `#17171f` | Cards, panels — opaque, shadow-elevated |
| `--color-border` / `-strong` | `#e6e1ec` / `#d3cadd` | `white/.14` / `white/.22` | Default vs. emphasized borders |
| `--color-text-primary/secondary/muted/disabled` | `#15111c` → `#a8a2b3` | `#f5f5f7` → `#4b4b52` | Text hierarchy, four steps |
| `--color-brand-purple` (`-hover`, `-active`) | `#a810c7` (`#c817ea`, `#8b0da3`) | same | Fills, icons, focus ring, decoration — official logo color |
| **`--color-brand-purple-text`** | `#a810c7` (5.9:1 on white) | `#cf6cf2` (5.5:1 on bg) | **Purple as text on a surface**: eyebrows, badges, small links, "Renews at the same price". Never use plain `text-brand-purple` for running text — it is 3.35:1 on the dark canvas. |
| `--color-brand-blue` | `#1f87e8` | `#3fa7ff` | Secondary accent, gradient partner, packets |
| `--color-success/warning/error/info` | `#15803d` / `#b45309` / `#dc2626` / `#1f87e8` | `#22c55e` / `#f5a524` / `#f0576b` / `#3fa7ff` | Semantic states (and the browser-frame traffic lights) |

Rule of thumb: `text-brand-purple` is for **icons and decoration**;
`text-brand-purple-text` is for **words**.

### Gradients

| Token | Value | Use for |
|---|---|---|
| `--gradient-hero` | purple → blue (`#1f87e8` light / `#3fa7ff` dark) | **Decoration only**: the one gradient word in each page's H1, progress bars, packets, rules. Never behind white text — the blue end is 2.57:1 against white. |
| `--gradient-hero-deep` | `--color-brand-purple-active` → `#1a5fb4` | **Every text-bearing gradient**: `Button` primary, the final-CTA panel, the announcement bar, the welcome offer. White text stays AA across the whole sweep. |
| `--gradient-glow` | radial purple haze from the top | `HeroAtmosphere` backdrop only |

### Gradient text

Exactly one gradient phrase per page, and only inside the `<h1>`. Section
H2s are plain `text-text-primary`. Do not split a headline into
`headline[0]` / `headline[1]` for an H2.

## Elevation

Shadow tokens, registered in `@theme inline` (use as
`shadow-[var(--shadow-card)]` to match the codebase, or `shadow-card`):

| Token | Role |
|---|---|
| `--shadow-card` | Resting card (`Card`, `SpotlightCard`, status rows, pills) |
| `--shadow-raised` | Hovered/elevated card, browser frames, install demo, dropdowns |
| `--shadow-popular` | The recommended pricing card only (purple-tinted) |
| `--shadow-cta` / `--shadow-cta-hover` | `Button` primary at rest / hover |
| `--shadow-spotlight` | `SpotlightCard` hover (1px purple ring + soft purple drop) |
| `--shadow-overhang` | Upward shadow under bottom-pinned bars |
| Tailwind `shadow-2xl` | The single most prominent element on a screen: the hero launch card and the welcome modal. Nowhere else. |

Glows are **state signals**, not elevation: `--glow-active` (activated
slab/face), `--glow-packet` (blue request packet), `--glow-dot` (purple
journey dot in HOST → BUILD → SCALE).

**One depth cue per element.** Cards are `border` (1px) + `shadow-card`.
`border-2` is reserved for `Badge` (and the `Button` secondary outline);
never stack `border-2` with a shadow on a card. Non-interactive cards do not
lift on hover — `SpotlightCard` answers hover with its spotlight and
`--shadow-spotlight`, `Card glow` with `--shadow-raised`, neither with a
`translate`.

## Spacing

8px-based scale (Tailwind defaults: `1`=4px, `2`=8px, `3`=12px, `4`=16px,
`6`=24px, `8`=32px...). Real usage across the codebase, most to least common:
`gap-2`/`gap-3` (inline icon+label groups), `px-4`/`px-6` + `py-2`/`py-3`
(button/pill padding), `p-5`/`p-6` (card interior padding), `gap-6` (grid/
section spacing). Don't reach for arbitrary values (`gap-[13px]`) — the scale
already covers the range this site uses.

Touch targets are **≥ 44px**: icon buttons `h-11 w-11`, toggle tabs
`py-2.5`, `.chip` padding `0.625rem 0.875rem`.

### Section rhythm

`Section` (`ui/section.tsx`) is `py-20 sm:py-28` by default and
`py-12 sm:py-16` with `compact`. Supporting sections — testimonials, FAQ,
the project selector — take `compact` so the page doesn't read as equal
112px slabs. Split sections (pricing, comparison, HOST/BUILD/SCALE) keep a
left-aligned intro (`max-w-2xl`, no `mx-auto text-center`).

## Typography

Font is **Plus Jakarta Sans** (`--font-jakarta` → `--font-sans`); monospace
contexts (code, terminal mockups, domain inputs) use **Geist Mono**
(`--font-geist-mono` → `--font-mono`). No custom type scale is defined in
`@theme` — Tailwind's default `text-*` steps are used directly:
`text-sm`/`text-xs` for body/meta copy, `text-base`/`text-lg` for lead
paragraphs, `text-3xl sm:text-4xl` for every section H2 (`font-semibold
tracking-tight`), display sizes for the H1 only.

**The one H1 recipe**, used on every page:

```
text-4xl font-extrabold leading-none tracking-tighter text-text-primary sm:text-5xl lg:text-6xl
```

No `leading-[1.03]`, no per-page weight. Nothing below 12px anywhere.

**The one eyebrow:** `<Eyebrow>` from `ui/section.tsx` (outlined pill,
`text-brand-purple-text`, uppercase) for page- and section-level labels.
`Badge` is for in-card status only ("Most Popular", "Coming soon", "You are
here").

## Border radius

Three tiers by element type:

- `rounded-full` — buttons, pills, badges, chips, text inputs, avatars
- `rounded-xl` / `rounded-2xl` — boxes: icon tiles, cards, panels, the hero
  launch card
- `rounded-3xl` — larger hero-scale containers only

No `rounded-sm` / `rounded-md` / `rounded-lg`. Pick the tier by element
type, not by eye. And: **give an element its final radius as a static base
style from first paint** — never leave `border-radius` to be set only by a
later GSAP tween (see `docs/scroll-choreography.md`'s "shape morphs should
commit to a shape" section — this was a real shipped bug).

## Motion tokens

`@theme` exposes `--ease-out-quart` (`ease-out-quart` utility) and
`--duration-fast: 180ms` (`duration-(--duration-fast)`); `Button`, `Card` and
`SpotlightCard` use them — don't re-type `cubic-bezier(...)` or
`duration-[180ms]` inline. Full detail lives in `docs/motion-system.md` /
`docs/animation-principles.md` / `docs/micro-interactions.md`. In short:
Framer Motion for component state, GSAP+ScrollTrigger for timelines,
`ease: "none"` under scrub always, GPU-only properties (`transform`/`opacity`)
except the one documented block-morph exception.

**Entrance reveals:** one `<Reveal>` per section root. No per-item
`delay={i * 0.08}` staggers on card grids, and pricing cards render static
on arrival.

## Grid / layout

Mobile-first Tailwind breakpoints (`sm`/`md`/`lg`/`xl`). **One content
width: `Container` = `max-w-[1200px] px-6 lg:px-8`.** Every `Section` wraps
its children in `Container`; hero grids inherit it (no `max-w-6xl` on the
grid). `max-w-5xl` / `max-w-2xl` are for prose and intros only, never for a
second page width.

## Component reference

- **Buttons** (`src/components/ui/button.tsx`): three variants
  (primary/secondary/ghost), three sizes (`sm` 36px / `md` 44px / `lg`
  52px), and a `loading` prop (spinner + `aria-busy` + disabled; links become
  inert) — never hand-roll a spinner inside a button. Built-in
  ripple-from-pointer-position on click (`RippleLayer`), hover lift + scale,
  `active:duration-100` for a snappier press than hover-ease. Primary uses
  `--gradient-hero-deep` + `--shadow-cta`.
- **Cards** (`Card`, `SpotlightCard`): 1px border + `--shadow-card`;
  `SpotlightCard` adds a cursor-tracked radial glow via CSS custom properties
  updated on `mousemove` directly (not React state — zero re-render cost).
  Follow this pattern for any new hover-glow element.
- **BrowserFrame**: chrome around mockups, tokens only (`bg-bg` terminal
  variant, `bg-error/warning/success` traffic lights, `--shadow-raised`).
- **Step/checklist rows**: the `Hero` deployment checklist's
  pending/active/done pattern is the canonical shape for any future
  multi-stage process UI — see `docs/micro-interactions.md`. Its container
  carries `aria-live="polite"`.

## Before styling something new

1. Check this skill for the token/tier that applies.
2. If genuinely new ground, check the relevant `docs/planning/*.md` for
   stated intent.
3. Only introduce a new value if neither covers it — and if you do, it
   should generalize (add it to the scale/tier list here), not be a one-off.
