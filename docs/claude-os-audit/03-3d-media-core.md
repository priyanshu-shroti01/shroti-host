# Claude OS audit — 3D, Media, Core (2026-08-23)

Skills: 3d/exploded-views, 3d/r3f-scenes, media/image-generation, media/video-generation, core/quality-pipeline, core/skill-router, core/memory, core/graph-knowledge.

## Highlights
- Exploded view: mode/honesty PASS (logical layers of the real stack); separation, scroll-scrub (no pin), labels with leader lines, reduced-motion static, CSS fallback on every failure path — PASS. FAIL: no keyboard/accessible path; per-part focus mouse-only; real-GPU/CPU-throttle QA never run; reduced-motion path unverified live; model licences (`OPEN_SOURCE_NOTICES.md`) gitignored.
- r3f: versions correct (fiber 9 / drei 10 / three 0.185 / React 19); canvas lazy + IO-gated; single `useFrame`, no allocations; frameloop gated; DPR cap + PerformanceMonitor; context-loss → CSS; SSR safe; three chunk (976 KB raw / 248 KB br) off the initial path. PARTIAL: 15 materials lerped every frame incl. redundant `emissive.copy`; eligibility viewport-only (no pointer:fine/deviceMemory); `powerPreference:"high-performance"`.
- Media: code-over-raster discipline PASS (zero raster content images; OG generated); PARTIAL: OG has no `alt`; both theme logos preloaded; logo SVGs raw Inkscape exports; favicon set incomplete.
- Core: quality pipeline evidence missing — no tests/CI/gate table; PRODUCTION_READINESS 0/50; implementer self-QA; initial JS 273 KB br vs ≤200 KB gz budget; no GRAPH_REPORT.md; 28 unrelated ruflo/agentdb skills advertised per session.

## Findings (prioritized)
1. HIGH — No keyboard path to the explosion / per-part focus. Fix: infra list rows `tabIndex={0}`, onFocus→setActiveIndex(i), onBlur→null; optional sr-only range input bound to gap.
2. HIGH — Real-GPU / 4× CPU-throttle QA never run (60 fps floor unproven). Fix: one pass on mid-range laptop + r3f-perf; record numbers in phase-3 report. **[needs device]**
3. HIGH — Initial-route JS over budget (273 KB br vs ≤200 KB gz). Fix: bundle analyzer; framer `LazyMotion`+`m` for layout components; defer chatbot/welcome-offer chunks; or record explicit override.
4. MEDIUM — Quality-pipeline evidence missing. Fix: commit DESIGN/PRODUCTION_READINESS/PROJECT_REPORT; mark items; add `test` script (Playwright smoke vs next start); gate table in report.
5. MEDIUM — OS-level reduced-motion path unverified. Fix: run `/verify` with reducedMotion:"reduce" once; record screenshot.
6. MEDIUM — CSS→WebGL swap seam mid-scrub (plates re-explode from collapsed when canvas lands). Fix: after ScrollTrigger.create, `gapSpring.jump(COLLAPSED_GAP + (PLATE_GAP-COLLAPSED_GAP)*progress)`.
7. MEDIUM — Per-frame mutation of all 15 materials at rest. Fix: delete the per-frame `face.emissive.copy` (set in JSX); skip writes when |target−current|<1e-3.
8. MEDIUM — Low-power detection viewport-only. Fix: add `(pointer: fine)` (+ optional deviceMemory≥4) to eligibility; drop `powerPreference`.
9. MEDIUM — Licence record gitignored. Fix: un-ignore and commit `OPEN_SOURCE_NOTICES.md` (or move to docs/dependencies.md).
10. MEDIUM — Knowledge graph absent; GRAPH_REPORT.md missing. Fix: run graphify on src/, write GRAPH_REPORT.md.
11. LOW — OG image: no `alt` export, one image for all routes, non-brand font. Fix: `export const alt`; load Geist; segment OG images later.
12. LOW — Both theme logos preloaded; SVGs unoptimised. Fix: drop `priority`; svgo both.
13. LOW — create-next-app leftovers in public/ (next.svg, vercel.svg, file.svg, globe.svg, window.svg). Fix: delete.
14. LOW — `postprocessing` installed, unused, pins three <0.186. Fix: uninstall.
15. LOW — Claude OS hooks created but not registered. **[done 2026-08-23]**
16. LOW — Memory hygiene: composite WebGL memory with structural detail. Fix: split; move structure to GRAPH_REPORT.md.
17. LOW — Skill-router noise: 28 unrelated ruflo/agentdb/v3 skills. Fix: minimal ruflo skill set or delete unrelated dirs.
18. LOW — `failed` latch never clears; module geometries never disposed. Acceptable by design — comment it.
19. LOW — Favicon set incomplete (no SVG icon, no manifest). Fix: `src/app/icon.svg` + `manifest.ts`.
