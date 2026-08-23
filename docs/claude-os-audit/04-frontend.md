# Claude OS audit — Frontend standards & component quality (2026-08-23)

Skills: frontend/frontend-standards, frontend/component-quality. Source + curl (no browser).

## Scorecard highlights
PASS: semantic landmarks (one header/nav/main/footer), one h1 per page, all clickables are button/a, tokens via `@theme`, no `!important` escalation, server-first data (getDomainPricing), single context, fetch idiom with loading/error, forms validated both sides, images dimensioned, one visual language (.chip + Button), labelled icon buttons, aria-pressed toggles, mobile menu + welcome dialog have full focus management.
FAIL/PARTIAL: heading skip (footer h3 before h1, 404 h1→h3); keyboard models (currency listbox, desktop dropdown, chatbot dialog); inputs `outline-none` defeat focus ring; fonts 3 families with preload on the wrong face; no error boundaries; root `loading.tsx` outlines every page; no tests; framer in every route bundle; 15 framer components ignore reduced-motion; SSR prices "₹0".

## Findings (prioritized)
F1 HIGH — Root `src/app/loading.tsx` puts every page's content behind a loader in prerendered HTML (content after `<footer>` in a hidden div, moved by `$RC`): LCP waits, layout shift every visit, screen readers hear "Loading" on static pages, heading order footer-h3 → h1. Fix: delete `src/app/loading.tsx`; if a nav indicator is wanted, do it client-side (e.g. `useLinkStatus`) not as a route boundary.
F2 HIGH — Preload spent on the fallback font; body font (Plus Jakarta, per `globals.css:92 --font-sans`) has `preload:false`; 3 families. Fix: remove `preload:false` from Plus_Jakarta_Sans; delete Geist import/variable; `--font-sans: var(--font-jakarta)`. Result: 2 families, critical face preloaded.
F3 HIGH — No route error boundaries; unguarded storage reads throw in Safari private mode (`currency-provider.tsx:22`, `theme-toggle.tsx:21`, `mobile-sticky-cta.tsx:41`, `announcement-bar.tsx:75`, `chatbot-widget.tsx:118`). Fix: add `src/app/error.tsx` + `global-error.tsx` (reuse not-found composition, "Try again" → reset()); wrap the five reads in try/catch like `welcome-offer.tsx:36-40`.
F4 MEDIUM — framer-motion in every route's critical bundle via layout components (header, welcome-offer, mobile-sticky-cta). Fix: `LazyMotion`+`domAnimation`+`m` in those three (or CSS transitions).
F5 MEDIUM — 15 framer components ignore prefers-reduced-motion. Fix: wrap children in `<MotionConfig reducedMotion="user">` in `currency-provider.tsx` (the client root).
F6 MEDIUM — Chatbot dialog `aria-modal` without focus management; locks body scroll for a corner panel (races header/welcome). Fix: remove aria-modal + overflow lock; focus first button on open, return focus to FAB on close.
F7 MEDIUM — Currency switcher invalid ARIA (`role=option` on buttons in listbox), no keyboard model. Fix: native `<select aria-label="Currency">`.
F8 MEDIUM — No automated tests for pricing/recommendation/sanitizers. Fix: vitest + `test` script; tests for currency, plans, domain-check sanitizeInput; move `recommendPlan`/`sanitizeDomain` into lib.
F9 MEDIUM — Inputs remove focus-visible ring (`outline-none` in enquiry-form/apply-form). Fix: delete `outline-none`.
F10 MEDIUM — Field errors not exposed programmatically (no aria-invalid/aria-describedby; focus stays on submit). Fix: Field sets id/aria-describedby + aria-invalid; focus first invalid after 422.
F11 LOW — Footer headings `<h3>`. Fix: `<p>` (or h2).
F12 LOW — Desktop nav dropdown: no Escape/focus-out close, no aria-controls. Fix: onKeyDown Escape, onBlur outside → close, aria-controls/id.
F13 LOW — Accordion trigger not linked to panel. Fix: useId, aria-controls, panel id/role=region/aria-labelledby.
F14 LOW — Async results change silently (domain results dropdown, hero checklist). Fix: aria-live="polite" / role="status".
F15 LOW — Both logo variants rendered + preloaded every page (48 KB). Fix: drop `preload`; svgo; or inline LogoMark with currentColor.
F16 LOW — Plan prices SSR as "₹0" (AnimatedCounter). Fix: SSR the real formatted value; jump to 0 only client-side inside the inView effect.
F17 LOW — Button has no `loading` state; four callers hand-roll spinners. Fix: `loading` prop → spinner + aria-busy + disabled.
F18 LOW — Ad-hoc z-index ladder. Fix: `@theme` z tokens.
F19 LOW — design-system SKILL.md contradicts code (glass rule, card token, primary font). Fix: rewrite those sections from globals.css.
F20 LOW — No theme-color meta while dark is forced. Fix: `export const viewport: Viewport = { themeColor: [...] }` in layout.
F21 LOW — Reduced-motion hook false on first frame; 10 set-state-in-effect suppressions. Fix: `useSyncExternalStore(subscribe, () => mql.matches, () => false)`.
