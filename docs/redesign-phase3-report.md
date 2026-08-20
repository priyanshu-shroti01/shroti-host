# Phase 3 Delivery Report — Literal WebGL (Owner Opt-In)

Per the owner brief's output requirements. Written 2026-08-20.
Branch: `redesign/premium-shrotihost` (from main @ 23b6a0a). NOT yet merged
or deployed.

## What this phase is

The phase-2 report reserved React Three Fiber as "an opt-in follow-up if
the owner wants literal WebGL." The 2026-08-20 owner brief exercised that
option, mandating the R3F/drei/three/GSAP/Lenis stack. This phase delivers
it scoped to ONE flagship scene — the exploded infrastructure stack — plus
the site-wide motion foundation, keeping everything phase 1–2 shipped
intact.

## Architecture

- **`src/lib/gsap.ts`** — single GSAP + ScrollTrigger registration point.
- **`src/components/motion/lenis-root.tsx`** — site-wide Lenis on the
  official GSAP wiring (one ticker: `gsap.ticker` drives `lenis.raf`,
  Lenis scroll drives `ScrollTrigger.update`, `lagSmoothing(0)`).
  `anchors: true` + a focus-follow click handler (keyboard users land
  focus with the scroll); route-change scroll reset (Next 16 no longer
  does this) that skips back/forward and #hash navigations; Lenis's
  `respectReducedMotion` covers the a11y scroll path. Mounted in
  `layout.tsx` inside `CurrencyProvider`.
- **`src/components/home/infra-stack-webgl.tsx`** — the R3F scene. Five
  extruded rounded plates (geometry shared module-level), token-driven
  materials resolved from CSS custom properties via a probe element and
  re-read on `data-theme` mutation; EdgesGeometry borders in the CSS
  border recipe; per-plate lucide icons via drei `Html transform`; DOM
  callout labels REUSED from the CSS version (`CalloutLabel` export) so
  type stays crisp; packet loop at `PACKET_LOOP_MS` parity; camera dolly
  on scroll + pointer-parallax orbit (Tilt3D parity, ±4°).
  **Data flow: one ScrollTrigger reads raw progress (no easing under
  scrub) → one framer spring smooths it for BOTH the WebGL plates and the
  DOM callouts → one `useFrame` writes all three.js state. No per-frame
  setState anywhere.** `frameloop="never"` when off-screen
  (IntersectionObserver); dpr capped [1, 1.75] with PerformanceMonitor
  step-down (→1.25 → 1).
- **`src/components/home/infra-stack-loader.tsx`** — the render-path
  contract (scroll-choreography a11y rules): WebGL only for lg+ viewports
  with WebGL2 and no reduced-motion preference; everything else — SSR /
  first paint, reduced motion, <lg, scene crash (error boundary), GL
  context loss — gets the shipped CSS-3D stack. `ssr:false` lives here
  (Client Component), chatbot-loader pattern.
- `infrastructure.tsx` now mounts `InfraStackVisual` (loader) — this is
  the only consumer change; `/hosting` inherits it automatically.

## Dependencies (added and committed, fa7908a)

three@0.185.1, @react-three/fiber@9.7.0 (peer `>=19 <19.3` ✓ React
19.2.4), @react-three/drei@10.7.8, gsap@3.15.0, lenis@1.3.26,
postprocessing@6.39.4 (peer three `>=0.168 <0.186` ✓), @types/three (dev).
All recorded in OPEN_SOURCE_NOTICES.md with licenses (GSAP is the
non-OSI "no charge" standard license — free commercial use).

**Installed but not yet used:** `postprocessing`. Bloom/vignette were
deliberately deferred — the scene reads well without them and the brief
ranks performance over effects. If wanted, the wiring is a raw
EffectComposer with a positive-priority useFrame, or add
`@react-three/postprocessing`. Selective bloom on the active plate is the
candidate effect.

**Evaluated, not adopted (unchanged from phase 2):** Magic UI, Aceternity
UI (no verified official npm component package; site distributes via
copy-paste/CLI; token system already covers the component language),
MDX (blog stays typed TS data), Playwright (QA runs on the gstack browse
harness).

## Repositories used (reference clones in ~/shrotihost-references/)

react-three-fiber@0a10741 (MIT), drei@ffa15b9 (MIT), lenis@eea7159 (MIT),
GSAP@13e2b79 (standard license), magicui@2d671cc (MIT),
blog-template@bc0cb81 (no license file — reference only),
postprocessing@703a175 (Zlib), product-configurator-3d@cd903a6
(**no license — concepts only, zero code copied**; contributed the
"cache base position + offset = base + dir × t" exploded-view pattern and
the warning against setState-per-tick explosion), ruflo → /root/ruflo
symlink (MIT). No code was copied from any clone; all patterns
reimplemented against this repo's conventions.

## Ruflo

CLI verified working (`ruflo v3.38.12` via `npx -y ruflo@latest`; the
/root/ruflo source clone has no built dist — the npm package is the
functional install; MCP server registered for this project in
.claude.json). Used for decision memory (`arch/webgl-decision` key).
Note: running the CLI auto-starts a background daemon
(`ruflo daemon stop` to stop it).

## QA performed (headless Chromium via gstack browse, dev server)

- Production build green (82 static pages), tsc clean, eslint 0 errors
  (1 pre-existing warning elsewhere; generated .claude/ tooling now
  lint-ignored).
- Desktop 1440×900 dark: scene renders; zero console errors (only the
  upstream THREE.Clock deprecation warning from R3F). Exploded state:
  borders, labels riding exact plates, icons upright, base grid, packet,
  contact shadow, auto-narration walk.
- Hover linkage: list row → plate lift + glow + edge highlight + label
  activation + sibling dimming.
- Theme: flipping `data-theme` live re-materializes the scene (light
  verified visually).
- 375×812: canvas unmounts (matchMedia listener), beam fallback intact,
  no horizontal overflow.
- Lazy-load: the three.js chunk graph does not load below lg; crossing
  the breakpoint loads it and mounts the canvas. Production chunk:
  **259KB gz** (956KB raw) — paid only by lg+WebGL2 visitors.
- Lenis: route navigation resets scroll to top; "Try the Demo" scrolls
  via Lenis with correct clamp and focus.
- Fixed during QA: plate borders missing (EdgesGeometry added), icon
  orientation, label/plate drift (GAP_WORLD_SCALE 0.78), active glow too
  hot (emissive 0.28→0.2), React 19 ref-write-in-render violation.

## Honesty ledger

- The scene visualizes the real stack (Cloudflare → LiteSpeed →
  CloudLinux → site) — same content as the CSS version, no invented
  metrics or capabilities.
- Headless SwiftShader is not a real GPU: fps/thermals on actual
  hardware are NOT yet measured.

## Remaining work / needs human verification

1. **Real-hardware pass**: fps + thermals on a mid-range laptop and an
   external monitor; Lighthouse (LCP/CLS/INP) on the production build —
   the WebGL section is below-fold so LCP should be untouched, verify.
2. **OS-level reduced-motion**: automated media emulation is blocked in
   the QA harness (CDP allowlist); toggle it manually once — expected:
   CSS static-exploded path, Lenis 1:1.
3. **Keyboard/wheel/touch scroll parity** under Lenis on real devices
   (the motion-system doc makes this the condition of Lenis adoption).
4. Optional polish: selective bloom on the active plate (postprocessing
   already installed); scroll-snap detents per layer (`snap: 1/4`).
5. Merge + deploy decision is the owner's (branch is unmerged;
   deploy-site.sh builds whatever the checkout has — keep main checked
   out until this is approved).
