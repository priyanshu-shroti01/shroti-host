# Open Source Notices — ShrotiHost Redesign

License audit of every repository cloned as a reference and every package installed
for the redesign. Reference clones live in `~/shrotihost-references/` and are NOT
part of the production source tree. Audit date: 2026-08-20.

---

## Installed npm dependencies (in `package.json`)

### three
- URL: https://github.com/mrdoob/three.js
- Version: 0.185.1
- License: MIT
- How used: WebGL infrastructure — geometry, materials, cameras, lighting, GLTF.
- Code copied: No — npm dependency only.

### @react-three/fiber
- URL: https://github.com/pmndrs/react-three-fiber
- Version: 9.7.0 (reference clone at commit `0a10741`)
- License: MIT
- How used: React renderer for Three.js — 3D scenes, infrastructure visualization,
  exploded-view animations. Compatible with project React 19.2.4 (peer: `>=19 <19.3`).
- Code copied: No — npm dependency; clone is documentation/examples reference only.

### @react-three/drei
- URL: https://github.com/pmndrs/drei
- Version: 10.7.8 (reference clone at commit `ffa15b9`)
- License: MIT
- How used: R3F helpers — loaders, cameras, controls, environments, text, HTML overlays.
- Code copied: No — npm dependency; clone is examples reference only.

### gsap
- URL: https://github.com/greensock/GSAP
- Version: 3.15.0 (reference clone at commit `13e2b79`)
- License: GSAP Standard "no charge" license — https://gsap.com/standard-license
  (NOT an OSI open-source license; free for commercial use since the Webflow
  acquisition, but redistribution of the library itself is restricted).
- How used: Timelines, ScrollTrigger, camera choreography, section/exploded-view
  transitions, text animation, micro-interactions.
- Code copied: No — npm dependency only.

### lenis
- URL: https://github.com/darkroomengineering/lenis
- Version: 1.3.26 (reference clone at commit `eea7159`)
- License: MIT
- How used: Smooth scrolling + scroll interpolation, integrated with the GSAP
  ticker / ScrollTrigger architecture.
- Code copied: No — npm dependency only.

### postprocessing
- URL: https://github.com/pmndrs/postprocessing
- Version: 6.39.4 (reference clone at commit `703a175`)
- License: Zlib
- How used: Selective cinematic effects (bloom, vignette, tone mapping) with
  mobile/low-power fallbacks. Peer range `>= 0.168 < 0.186` satisfied by three 0.185.1.
- Code copied: No — npm dependency only.

### @types/three (dev)
- URL: https://github.com/DefinitelyTyped/DefinitelyTyped
- Version: 0.185.0
- License: MIT
- How used: TypeScript types for three.
- Code copied: No.

---

## Reference-only repositories (never shipped, no code in production bundle)

### ruflo (claude-flow)
- URL: https://github.com/ruvnet/ruflo
- Version: 3.38.12 (clone at commit `fa13ee4`; runtime installed via `npx -y ruflo@latest`)
- License: MIT
- How used: Development-time agent orchestration only (MCP server + CLI). Never
  part of the shipped site.
- Code copied: No.

### magicui
- URL: https://github.com/magicuidesign/magicui
- Version: clone at commit `2d671cc`
- License: MIT (LICENSE.md in repo)
- How used: Selected components (buttons, animated text, cards, borders, marquees)
  may be copied and restyled into the ShrotiHost design system, as the MIT license
  permits. Attribution preserved via this notice.
- Code copied: Permitted — record specific components here when adopted.

### magicui blog-template
- URL: https://github.com/magicuidesign/blog-template
- Version: clone at commit `bc0cb81`
- License: **NONE FOUND** — no LICENSE file, no license field in package.json.
  All rights reserved by default.
- How used: Architectural reference ONLY (MDX architecture, blog routing, article
  structure, metadata patterns). **No code may be copied from this repository.**
- Code copied: No — and must remain No unless a license is added upstream.

### product-configurator-3d (exploded-view reference)
- URL: https://github.com/gorhorvat/product-configurator-3d
- Version: clone at commit `cd903a6`
- License: **NONE FOUND** — no LICENSE file, no license field in package.json.
  All rights reserved by default.
- How used: Technical reference ONLY (model loading, object separation, camera
  control, exploded positioning, animation architecture). The ShrotiHost
  exploded-view implementation is original.
- Code copied: No — and must remain No. No branding, text, or assets reused.

---

## Evaluated, not yet installed

### Aceternity UI
- Official site: https://ui.aceternity.com (verified live 2026-08-20)
- Official repository: none published — components are distributed copy-paste /
  via Aceternity's own CLI from the website, shadcn-registry style.
- npm packages named `aceternity-ui` / `aceternity` are **unofficial third-party
  wrappers** (e.g. Puskar-Roy/Aceternity-UI-CLI) — do not install them.
- Pricing/license: freemium — free core components permit commercial use per the
  site FAQ; premium blocks require the All-Access Pass.
- Decision: install individual free components only if a specific design need
  arises; record each one here with its source URL when adopted.
