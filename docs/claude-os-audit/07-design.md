# Claude OS audit — Design (anti-slop, design-direction, design-review, project design-system + cinematic skills) (2026-08-23)

Scope: live site at 1440×900 and 375×812, dark + light, 10 pages; source scan. Screenshots under the session scratchpad (`audit-*.png`, `sheet-*.png`).

**Verdict:** well-built and unusually honest in content (real Trustpilot quotes, real prices, real careers), but the homepage composition is a competitor template by its own code comments, the gradient/purple system fails WCAG on the dark default theme, and the design-system skill no longer describes the shipped code.

## Gate results
- Anti-slop: FAIL (8/10; Composition 2, Typography 2) — centered hero + one-liner + two buttons on 5 pages; identical-card rows ×6 on home; page order annotated as copied from RankHostZone (`page.tsx:47,52,55`); 15/16 home H2 centered at 36px, every section `py-20 sm:py-28`; 23 gradient-text headline spans; blob in `domain-search.tsx:49`; 63 `<Reveal>` wrappers; hover lift on non-link cards.
- Design-direction: PARTIAL — no type scale; contrast pairs unchecked; dark-mode stance contradictory (`globals.css:11-13` "light is default" vs `theme-script.tsx` "dark is brand default"); doc drift unrecorded.
- Design-review: hierarchy FAIL (3 hero buttons + launch arrow + 2 header CTAs + announcement + modal at 2.5 s); magic values FAIL (16 hex literals, literal shadows, `leading-[1.03]`, `mt-[7px]`); consistency FAIL (H1 60/800/-3px home vs 48/600/-1.2px elsewhere; 3 eyebrow pills; 4 content widths 1280/1200/1152/1024); states PASS; 375px PARTIAL (no overflow, no <12px text; 39–72 sub-44px targets per page; cycle toggle wraps); composition FAIL (200–300px voids under /contact and /portfolio heroes; gradient buttons on gradient); voice PASS (minor).
- Design-system compliance: hex in `ui/browser-frame.tsx:18,26-28`, `home/infra-stack-webgl.tsx:307,331,344`; 60px H2 mid-page (`domain-search.tsx`); off-tier radii ×10; hand `backdrop-blur` ×2; `shadow-2xl` ×7; `border-2 + shadow` stacked in 6 files; container 1200 vs header 1280 vs heroes 1152.
- Cinematic pre-build: home hero copy overload (H1 + tagline + para + 3 buttons + 4 badges); /domains orbit scene squeezed to ~120px; grid floor + radial glow generic.

## Findings (25)
1. CRITICAL — Homepage is a documented competitor template (feature list restated 4×). Fix: remove `#everything`, `#steps`, `#why` sections from `src/app/page.tsx`; keep comparison-table as the single feature statement (~2,000 px shorter).
2. HIGH — `text-brand-purple` (#a810c7) on dark bg = 3.35:1 / card 3.02:1 (AA 4.5). Fix: `--color-brand-purple-text` (#cf6cf2 dark 5.5:1; #a810c7 light 5.9:1) registered in `@theme inline`; use for badge, eyebrow, "Renews…" line, host-build-scale links, `.chip:hover`.
3. HIGH — White on gradient blue end (#3fa7ff) = 2.57:1 on all primary buttons/final CTA/announcement/modal. Fix: `--gradient-hero-deep: linear-gradient(135deg, var(--color-brand-purple-active) 0%, #1a5fb4 100%)` for every text-bearing gradient (button, final-cta, announcement, welcome CTA); keep `--gradient-hero` for decoration.
4. HIGH — Welcome-offer modal duplicates the announcement bar (same promo id/code) and scroll-locks at 2.5 s. Fix: remove `<WelcomeOffer />` from layout (or at minimum delay ≥20 s and skip on mobile — growth audit).
5. HIGH — Gradient text on 23 headlines. Fix: keep it for the hero H1 only; render other headline words in `text-text-primary`; stop splitting `headline[0]/[1]` in service-page/module-page.
6. HIGH — `.claude/skills/design-system/SKILL.md` contradicts code (glass rule, surface hex, `:root` theme, font, Button sizes). Fix: rewrite those sections from `globals.css`; add shadow/glow tokens.
7. MEDIUM — Four content widths. Fix: header → `max-w-[1200px]`; drop `max-w-6xl` from hero grids; keep `max-w-5xl/2xl` for prose only.
8. MEDIUM — Cards stack `border-2` + shadow (`card.tsx`, `spotlight-card.tsx`, `accordion.tsx`, `comparison-table.tsx`, `hero.tsx:213,248`, `status-board.tsx:39`). Fix: `border` (1px) + shadow; reserve `border-2` for Badge.
9. MEDIUM — Hover lift on non-interactive cards (`why-choose.tsx:55` glow; `spotlight-card.tsx:29`). Fix: remove lift, keep spotlight.
10. MEDIUM — Entrance animation + stagger on every card incl. pricing. Fix: one `<Reveal>` per section root; delete per-item delays in hosting-plans/testimonials/why-choose.
11. MEDIUM — Every section centered/equal padding. Fix: left-align intros in split sections (hosting-plans, comparison-table, host-build-scale); `Section compact` prop (`py-12 sm:py-16`) for testimonials/faq/project-selector.
12. MEDIUM — H1 recipe differs per page. Fix: `text-4xl font-extrabold tracking-tighter sm:text-5xl lg:text-6xl` everywhere.
13. MEDIUM — Three eyebrow pill implementations. Fix: `<Eyebrow>` for page-level eyebrows; `Badge` only for in-card status.
14. MEDIUM — Final CTA: gradient buttons on gradient, three CTAs. Fix: one solid white button; others outline white; panel uses gradient-deep.
15. MEDIUM — Touch targets <44px (announcement dismiss 24px/copy 22px; hero arrow 36; cycle tabs 36; chips 32–36; footer links 20). Fix: `h-11`, `py-2.5`, `.chip` padding `0.625rem 0.875rem`, footer links `inline-block py-1.5`.
16. MEDIUM — Cycle toggle wraps "Annual" on mobile. Fix: `grid grid-cols-4 gap-1 … sm:inline-flex`; `px-2 text-xs sm:px-5 sm:text-sm`.
17. MEDIUM — Blob + dot grid in domain-search panel; 60px H2 mid-page. Fix: delete lines 40-51; H2 `text-3xl sm:text-4xl`.
18. MEDIUM — Voids under /contact and /portfolio heroes. Fix: tighter hero Section padding; drop HeroAtmosphere on portfolio.
19. LOW — Magic values: button/spotlight/chatbot literal shadows, `duration-[180ms]`, browser-frame hex, webgl hex, `mt-[7px]`, `leading-[1.03]`. Fix: `--shadow-cta/-cta-hover/-spotlight`, `--ease-out-quart`, `--duration-fast`; `bg-error/warning/success`; `readCssColor`; `mt-2`; `leading-none`.
20. LOW — `shadow-2xl` ×7. Fix: `--shadow-raised` for browser-frame/domains-hero/wp-install-demo; keep 2xl on hero card + modal.
21. LOW — Off-tier radii (`rounded-lg` ×7, `rounded-md` ×2, `rounded-sm` ×1). Fix: inputs/chips `rounded-full`, boxes `rounded-xl`.
22. LOW — Hand `backdrop-blur` in header/mobile-sticky-cta contradicts skill. Fix: record the exception ("sticky chrome may blur; nothing else") or go opaque.
23. LOW — Hero copy overload; generic H1 "Build. Deploy. Scale.". Fix: H1 "Launch a website. Watch it happen."; drop paragraph; remove ghost "Try the Demo".
24. LOW — Residual generic copy ("Empower people to launch", "Build What's Next" ×9, "Get online in 3 simple steps", "Lightning NVMe SSD"). Fix: hosting-specific lines.
25. LOW — Light theme: "Most Popular" card force-flipped dark (`hosting-plans.tsx:93 data-theme`). Fix: remove; emphasise with `--shadow-popular` + `border-brand-purple/40`.

**Protect:** hero deploy demo, request-path infra stack, terminal strip, pipeline trust strip, real Trustpilot reviews with dates, honest "Coming soon"/"Illustrative preview" labels, reduced-motion handling, visible focus rings, zero console errors, no overflow/sub-12px text at 375px.
