# Redesign Plan — Premium Live-Animation Pass (2026-08-19)

Produced from a ruflo-assisted full-site scan (16 pages, per-section
motion/glass/3D instrumentation — see ruflo memory `site/redesign/*`) plus the
repo's design constitution (`docs/animation-principles.md`,
`docs/motion-system.md`, `.claude/skills/cinematic-product-design`,
`.claude/skills/design-system`).

## Research summary

**What the scan found.** Motion and 3D are concentrated in heroes and the
pricing grid; the middle of every page goes flat. The flattest, most repeated
surfaces sitewide:

| Surface | Where | Scan reading |
|---|---|---|
| `PlanSpecTable` ("Every spec, in the open") | all 6 hosting pages | anim=1 glass=1 3d=0 |
| Home comparison ("vs. typical shared hosting") | / | anim=1 glass=0 3d=0 |
| FAQ accordions | every page | glass=0 |
| WHMCS module page heroes | 2 pages | anim=1 glass=0 |
| About timeline / VPS roadmap / status services | 3 pages | glass=0 |
| `InfraStack3D` | / + hosting pages | stacked 3D exists, but **no exploded view** — plates never separate to reveal anatomy |

**Constitution constraints that shape every item below** (non-negotiable):
motion must explain a product mechanic (one-sentence justification test);
GPU-only properties under animation; `prefers-reduced-motion` gets a real
static fallback, not a broken layout; glass comes from tokens (`bg-card` /
`bg-surface-raised`), never hand-added blur; no scroll-jacking (the 8-chapter
cinematic scroll was tried and reverted); radius/elevation tiers fixed.

## Direction

Not a reskin — the identity (dark glass, purple→blue, isometric plates) is
right. The redesign deepens three axes the scan showed are shallow:

1. **Exploded 3D** — the stack should *come apart*. Scroll-driven explosion
   of the infrastructure plates: collapsed as a solid server object at rest,
   separating into labeled layers as the section enters the viewport.
   Justification: "this animation exists so the user understands the hosting
   stack has independent, inspectable layers."
2. **Glass depth everywhere content sits** — every content container the
   user reads from should sit on the token glass hierarchy; flat
   border-only surfaces read as unfinished next to the heroes.
3. **Live-data motion** — animation attached to real signals (request
   pipeline pulse, status pulses, deploy checklist) in more places; never
   decorative particles.

## Changes (this pass)

- **ExplodedStack** — `InfraStack3D` gains scroll-linked explosion:
  `useScroll` on the section maps progress → plate separation
  (spring-smoothed, transform-only). Hover/focus still lifts one layer.
  Reduced motion: statically exploded with labels (the informative state).
- **PlanSpecTable** — recommended-tier column gets a brand accent + tinted
  band; spec-group headers restyled as eyebrow rows; row hover highlight;
  CSS-only (stays a server component). Touches all 6 hosting pages.
- **Home comparison** — glass container, animated ✓/✗ stagger, "us" column
  brand-tinted.
- **FAQ** — accordion items move onto `bg-card` glass with the radius tier,
  active-item brand edge; motion unchanged (height animation exists).
- **WHMCS module heroes** — gain `HeroAtmosphere` backdrop + glass framing
  so the product pages match the rest of the site.
- **About timeline / VPS roadmap / status services** — flat borders → glass
  cards, staggered reveals.

## Later (not this pass)

- Plan-card "anatomy" micro-exploded views on hover (needs design spike).
- ~~WebGL is explicitly rejected — CSS 3D covers the need at zero bundle
  cost.~~ **Amended 2026-08-20:** the owner brief opted into literal WebGL
  (the "R3F as opt-in follow-up" path the phase-2 report reserved). The
  exploded stack now renders via R3F on qualifying desktops with the CSS-3D
  version as the fallback path — see `docs/motion-system.md` (WebGL entry)
  and `src/components/home/infra-stack-loader.tsx` for the contract.
- Live status data feed into the status page scene (needs an uptime API).

## Budgets

No new dependencies; JS delta target < 3 KB gz (scroll wiring only); CLS 0
(explosion animates transforms, never layout); every change passes the
pre-build checklist in `cinematic-product-design`.
