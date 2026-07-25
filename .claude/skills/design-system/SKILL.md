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

## Color tokens (`globals.css` `:root` / `[data-theme="light"]`)

All color is theme-aware via CSS custom properties, switched by
`[data-theme]` (not `prefers-color-scheme` — see `@custom-variant dark` at
the top of `globals.css`). Never hardcode a hex value in a component; use the
Tailwind utility that maps to the token (`bg-card`, `text-text-secondary`,
`border-border-strong`, etc.).

| Token | Dark | Light | Use for |
|---|---|---|---|
| `--color-bg` | `#0a0a0f` | `#ffffff` | Page canvas — opaque, never glass |
| `--color-surface` | `#131318` | `#f6f6f8` | Section alternation (`bg-surface/30`) — opaque |
| `--color-surface-raised` | `rgb(25 25 33 / .65)` | `rgb(255 255 255 / .7)` | Dropdowns, nav — glass (see Glassmorphism below) |
| `--color-card` | `rgb(22 22 29 / .6)` | `rgb(255 255 255 / .62)` | Cards, panels — glass |
| `--color-border` / `-strong` | `white/.14` / `white/.22` | `black/.12` / `black/.18` | Default vs. emphasized borders |
| `--color-text-primary/secondary/muted/disabled` | `#f5f5f7` → `#4b4b52` | `#0f0f14` → `#a1a1aa` | Text hierarchy, four steps |
| `--color-brand-purple` | `#a810c7` | same | Primary actions, links, focus ring — official logo color, not a placeholder |
| `--color-brand-blue` | `#3fa7ff` | `#1f87e8` | Secondary accent, gradient partner |
| `--color-success/warning/error/info` | `#22c55e` / `#f5a524` / `#f0576b` / `#3fa7ff` | `#15803d` / `#b45309` / `#dc2626` / `#1f87e8` | Semantic states |

**Glassmorphism is automatic**, not per-component: any element using
`bg-card` or `bg-surface-raised` gets `backdrop-filter: blur(20px)` from a
single global rule (see `globals.css`, bottom). Don't add
`backdrop-blur-*` utilities by hand — use the token classes and the blur
comes for free. Opt an element out with `data-glass="off"` (used for
terminal-style mockups that should read as solid black, not frosted).

## Spacing

8px-based scale (Tailwind defaults: `1`=4px, `2`=8px, `3`=12px, `4`=16px,
`6`=24px, `8`=32px...). Real usage across the codebase, most to least common:
`gap-2`/`gap-3` (inline icon+label groups), `px-4`/`px-6` + `py-2`/`py-3`
(button/pill padding), `p-5`/`p-6` (card interior padding), `gap-6` (grid/
section spacing). Don't reach for arbitrary values (`gap-[13px]`) — the scale
already covers the range this site uses.

## Typography

No custom type scale is defined in `@theme` — this project uses Tailwind's
default `text-*` steps directly. Real distribution: `text-sm`/`text-xs` for
body/meta copy (by far the most common), `text-base`/`text-lg` for lead
paragraphs, `text-3xl`/`text-4xl` for section headings, `text-5xl`/`text-6xl`
reserved for hero H1s only — don't use display sizes below the hero without
a specific reason, it flattens the hierarchy. Font is `--font-geist-sans`
(`--font-sans` in `@theme inline`), monospace contexts (code, terminal
mockups) use `--font-mono`.

## Border radius

Not a single global value — three real tiers by element type:

- `rounded-full` — buttons, pills, badges, avatars (the most common radius
  in the codebase by a wide margin)
- `rounded-xl` / `rounded-2xl` — cards, panels, the hero's address-bar card
- `rounded-3xl` — larger hero-scale containers only

Pick the tier by element type, not by eye. And: **give an element its final
radius as a static base style from first paint** — never leave `border-radius`
to be set only by a later GSAP tween (see `docs/scroll-choreography.md`'s
"shape morphs should commit to a shape" section — this was a real shipped
bug).

## Elevation

Three real shadow tiers, matching `docs/planning/14`'s intent (cards /
dropdowns / dialogs) but with actual values: `shadow-lg`/`shadow-xl` for
raised cards, `shadow-2xl` for the most prominent single element on a screen
(the hero card, a modal) — used sparingly, not on every card. Avoid stacking
shadow with heavy borders; pick one depth cue per element, per
`animation-principles.md`'s "one scene one message" rule applied to statics.

## Motion tokens

Full detail lives in `docs/motion-system.md` / `docs/animation-principles.md`
/ `docs/micro-interactions.md` — this skill doesn't duplicate them, just
points here. In short: Framer Motion for component state, GSAP+ScrollTrigger
for timelines, `ease: "none"` under scrub always, GPU-only properties
(`transform`/`opacity`) except the one documented block-morph exception.

## Grid / layout

12-column responsive grid, mobile-first (Tailwind breakpoints `sm`/`md`/
`lg`/`xl`). Content max-width `1280px` inside a `1440px` outer container
(`docs/planning/14_UI_DESIGN_SYSTEM.md`) — check existing `Section`/layout
components for the actual container classes rather than re-adding a new
max-width utility per page.

## Component reference

- **Buttons** (`src/components/ui/button.tsx`): three variants (primary/
  secondary/ghost), two sizes (md/lg), built-in ripple-from-pointer-position
  on click (`RippleLayer`), hover lift + scale, `active:duration-100` for a
  snappier press than hover-ease. Reuse this component — don't hand-roll a
  new button style.
- **Cards** (`SpotlightCard` pattern, see `docs/micro-interactions.md`):
  cursor-tracked radial glow via CSS custom properties updated on
  `mousemove` directly (not React state — zero re-render cost). Follow this
  pattern for any new hover-glow element.
- **Step/checklist rows**: the `Hero` deployment checklist's
  pending/active/done pattern is the canonical shape for any future
  multi-stage process UI — see `docs/micro-interactions.md`.

## Before styling something new

1. Check this skill for the token/tier that applies.
2. If genuinely new ground, check the relevant `docs/planning/*.md` for
   stated intent.
3. Only introduce a new value if neither covers it — and if you do, it
   should generalize (add it to the scale/tier list here), not be a one-off.
