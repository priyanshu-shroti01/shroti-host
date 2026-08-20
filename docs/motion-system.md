# Motion System

The concrete input → output mapping. If you're building a new interaction and
it's not on this table, it either belongs on the table (add it, deliberately)
or it's decoration (see `animation-principles.md`).

## The mapping

| Input | Output | Why |
|---|---|---|
| Cursor | Network packet (ShrotiHost's signature — see `cursor-system.md`) | The cursor *is* a request moving through infrastructure, not a pointer |
| Hover | Node activation | Confirms "this is a real, distinct thing you can act on" |
| Hover over a spatial surface | 3D tilt (`Tilt3D`) — replaces, never stacks with, the standard lift | Node activation expressed spatially; on the 3D infra scene it's camera depth. See `micro-interactions.md` "3D tilt" for the sanctioned uses |
| Click | Ripple + the action's real consequence | Confirms the input registered before the consequence resolves |
| Scroll | Camera dolly (position/zoom change), never a fade | Scroll is spatial movement through a story, not a slideshow advance |
| Section change | Morph (shared element continuity) | The site is one continuous space, not stacked documents |
| Success | Glow / settle | A state resolved cleanly |
| Error | Shake | A state failed to resolve — never silent |
| Loading | Timeline (named stages, not a spinner) | A spinner says "wait." A timeline says "here's what's happening and where it is" |
| Deployment | Progress animation with real named steps | See `scroll-choreography.md` for the concrete step-list pattern already shipped in `Hero` |

## Stack

- **Framer Motion** — component-level UI state (hover, tap, enter/exit,
  `AnimatePresence` crossfades, layout animations). Default choice for
  anything tied to React state.
- **GSAP (`gsap` + `ScrollTrigger`)** — timelines: multi-step sequences with
  precise relative timing, scroll-scrubbed sequences, anything that needs a
  single coordinated timeline across many DOM refs at once.
- **Lenis** — installed and mounted site-wide (2026-08-20, owner brief
  opt-in) via `src/components/motion/lenis-root.tsx`: the official GSAP
  wiring (Lenis raf on `gsap.ticker`, `ScrollTrigger.update` on Lenis
  scroll, `lagSmoothing(0)`), `anchors: true` plus a focus-follow handler
  for keyboard users, and a route-change scroll reset (Next 16 no longer
  resets scroll itself). Reduced motion is handled by Lenis's own
  `respectReducedMotion` (1:1 input, instant jumps, live-updating).
  Keyboard/wheel/touch parity is a standing QA item for every release.
- **SVG path morphing / motion paths** — for literal "this travels along a
  route" moments (the abandoned Concept A "Signal Path" hero used this
  pattern: a glowing point interpolated along an SVG path with waypoint
  labels). No MorphSVG-plugin dependency in this project — use `clip-path`
  interpolation or shared-element position/size tweening instead (see the
  block-morph technique below), since MorphSVG is a paid GreenSock Club
  plugin this project doesn't have a license for.
- **Canvas** — only for genuinely per-pixel or high-particle-count work
  (hundreds of independent nodes). Everything shipped so far in this project
  (8-block infrastructure morph, deploy sequences) stayed in the DOM with
  GSAP/Framer because the element counts are small (≤12) and DOM gives free
  accessibility/hit-testing that Canvas doesn't.
- **WebGL (three + @react-three/fiber + drei)** — owner-brief opt-in
  (2026-08-20), superseding the earlier "CSS 3D covers the need" rejection
  for ONE flagship scene: the exploded infrastructure stack
  (`infra-stack-webgl.tsx`). Rules of engagement: the CSS-3D version
  remains a genuinely different fallback path (SSR/first paint, reduced
  motion, no WebGL2, <lg, context loss — see `infra-stack-loader.tsx`);
  scroll state flows ScrollTrigger → one framer spring → one `useFrame`
  writer, never `setState`; labels stay screen-space DOM; the canvas
  freezes (`frameloop="never"`) outside the viewport. Do not add more
  WebGL scenes without the same fallback contract and a measured
  performance budget.
- **React Spring** — not currently used. Only reach for it over Framer Motion
  if a specific interaction needs physically-modeled spring chaining Framer
  can't express cleanly; don't run two animation libraries doing the same
  job on the same page.

## Performance rules

- **GPU-accelerated properties only** for anything that runs continuously or
  during scroll: `transform` (translate/scale/rotate) and `opacity`. Never
  animate `top`/`left`/`margin` in a loop.
- **Exception, deliberately made once already**: the Server → VPS → Cloud
  hero morph animates `width`/`height`/`borderRadius` directly (layout-
  triggering) rather than using `scale` transforms. This was a conscious
  trade-off: the shapes needed genuine non-uniform reshaping (a 208×20 bar
  becoming a 78×78 square becoming a 34×34 circle), and scale-based
  transforms would have non-uniformly distorted the icons and detail
  elements inside each block. With only 8 small, `position: absolute`
  elements (no reflow cascade to siblings), the layout cost was judged and
  measured as acceptable. Don't copy this pattern for large element counts
  or elements inside normal document flow without re-making that trade-off
  deliberately.
- **Linear easing under scroll-scrub, always.** Any GSAP tween driven by
  `ScrollTrigger`'s `scrub` must use `ease: "none"`. An eased tween has
  non-constant velocity across its own duration; under scrub (which maps
  scroll distance directly onto timeline position) that reads as motion
  lagging behind the scroll and then snapping to catch up. This was a real,
  user-reported bug ("transitions feel jarring, not smooth") traced to
  `power2.inOut` defaults on a scrubbed timeline. Time-driven (non-scroll)
  timelines don't have this constraint — normal eases are fine there.
- **No dead zones in scrubbed timelines.** If a chapter's choreography
  finishes early, the remaining scroll distance for that chapter renders as
  a frozen frame — which reads as broken, not restful. Give every segment of
  a scrubbed timeline continuous motion across its whole allotted scroll
  range; don't let tweens front-load into a burst and leave the tail idle.
- **Watch for tweens that silently extend total duration.** A "snap" or
  pulse effect added via GSAP's default sequential positioning (no explicit
  time parameter) appends its own duration to the timeline rather than
  overlapping — four ~0.3s pulses added this way stretched a hero sequence
  from ~3.5s to ~6.4s unintentionally. Track absolute timestamps explicitly
  (`const land = start + duration`) rather than relying on GSAP's implicit
  "end of timeline" cursor when you want an effect to overlap rather than extend.
- **60fps or the interaction gets simplified, not shipped janky.** No
  profiling harness exists in this project yet — verify by eye at scroll
  speed extremes (very slow drag, fast flick) before considering a scroll
  sequence done.
