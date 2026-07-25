---
description: Run the project's accessibility audit pattern (aria-hidden on decorative motion, tabIndex on hidden controls, single H1, reduced-motion parity, skip link, focus rings) against the current page or the whole site.
---

Run the accessibility audit pattern established in
`docs/scroll-choreography.md`'s "Accessibility" section and the fixes
already shipped this project (missing-H1 bug, scroll-jacking gap). Target
the page(s) relevant to the current change, or all routes if asked to check
the whole site.

For each route, using a headless Playwright script written to the
scratchpad (not the repo):

1. **Exactly one `<h1>` per page.** This project shipped a real bug where a
   full component swap silently dropped the page's only H1 — check, don't
   assume.
2. **Any decorative/pinned/animated visual region has `aria-hidden="true"`**,
   with the same information available as ordinary `sr-only` content in
   normal document flow — not trapped inside the hidden region.
3. **No focusable control is reachable via Tab while visually hidden.** Tab
   through the page and confirm nothing with `opacity-0` or
   `visibility:hidden` receives focus. This was a real shipped bug
   (progress-nav dots stranding keyboard users).
4. **A skip link exists and works** — first Tab press should reveal a
   functional "skip to content" link, not something invisibly stuck behind
   other elements (this project had a real skip-link-overlapping-the-logo
   bug — check it's actually visible on focus, not just present in the DOM).
5. **Reduced-motion parity**: reload with a Playwright context using
   `reducedMotion: "reduce"` and confirm the page renders complete,
   information-equivalent content — not a frozen mid-animation frame or
   missing content that only appeared via a motion-gated effect.
6. **Focus-visible rings** are present on every interactive element reached
   via keyboard (the global `:focus-visible` rule in `globals.css` should
   apply — flag anything that suppresses it with `outline-none` and no
   replacement).
7. **Color contrast**: spot-check `--color-text-secondary` /
   `--color-text-muted` against their surface in both themes stays at or
   above WCAG AA for body text — these are the two tokens most likely to
   drift below threshold if a component sits on an unexpected surface.

Report findings per-route, most severe first. If something's broken, fix it
and re-run before reporting done — don't report a partial pass.
