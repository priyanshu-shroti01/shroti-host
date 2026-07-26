---
description: Run the project's standard visual/functional verification pass (build, dev server, Playwright across desktop/mobile, both themes, reduced-motion) before calling a UI change done.
---

Run the full verification pass this project has used after every hero/motion
change so far. Do not skip steps or claim success without having actually
run them.

1. **Build check**: `npm run build`. Fix any TypeScript/ESLint errors before
   continuing — don't verify visuals on top of a broken build.
2. **Start the dev server** in the background (`npm run dev`, background) and
   wait for it to be ready.
3. **Write a throwaway Playwright script** to the scratchpad directory (not
   the repo) that, for each route affected by the current change:
   - Loads the page at desktop viewport (1440×900) and mobile viewport
     (375×812).
   - Screenshots both themes — toggle `data-theme` via the site's theme
     toggle or by setting the attribute directly, whichever the page
     actually supports; don't assume, check.
   - Re-loads with a Playwright context created with
     `reducedMotion: "reduce"` and screenshots that too — this is a separate
     required pass, not a nice-to-have (see `docs/scroll-choreography.md`,
     "reduced-motion gets a completely different render path" — a bug here
     is invisible in the normal-motion screenshots).
   - Checks for console errors during load/interaction.
4. **Look at every screenshot** before reporting anything — don't infer
   success from "the script exited 0." A visually broken page can still
   return exit code 0.
5. Report concretely what was checked (routes, viewports, themes,
   reduced-motion) and what — if anything — needs fixing. If something's
   broken, fix it and re-run this same pass, don't report partial success.

If the current change is homepage-hero-specific, also confirm: the demo
input is focusable and typeable, the deploy sequence completes without a
dead end (per `docs/micro-interactions.md`'s domain-input-sync bug), and the
celebration screen's three CTAs resolve to real destinations (WHMCS portal /
`/dashboard` / share).
