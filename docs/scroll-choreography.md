# Scroll Choreography

Rules for any scroll-driven or pinned sequence, distilled from three full
build cycles on this homepage (a domain-purchase scroll story, then a
Server→VPS→Cloud infrastructure morph, before the hero was rebuilt as a
non-scroll, time-driven sequence instead). Read this before building another
pinned scroll section — it exists specifically so the same mistakes aren't
repeated.

## First question: does this need to be scroll-driven at all?

Not everything benefits from scroll-scrubbing. This project's **hero is
deliberately NOT scroll-driven** — it's a GSAP timeline triggered by
interaction (typing a domain + Enter) or auto-play, playing out over real
time. That turned out to be the right call for a hero specifically:

- A "hero" is conventionally the above-the-fold moment, not a multi-screen
  commitment. Turning it into an 8-chapter, ~800vh pinned journey (an earlier
  version of this build) made the single most important part of the page
  the most demanding to sit through.
- Time-driven sequences sidestep the entire class of scroll-jacking
  accessibility problems below, because nothing hijacks scroll at all.

Reach for pinned/scrubbed scroll only when the content is genuinely long-form
storytelling further down the page — not as the default mechanism for "make
this feel cinematic."

## If it is scroll-driven: the pin + scrub pattern

```
<section style={{ height: `${chapters.length * N}vh` }}>  {/* scroll budget */}
  <div className="sticky top-0 h-screen overflow-hidden">  {/* the "stage" */}
    ...scene content, all chapters stacked absolutely...
  </div>
</section>
```

Prefer CSS `position: sticky` for the stage over GSAP's `pin: true`. Sticky
is handled natively by the browser (including mobile Safari's address-bar
resize behavior, which GSAP's manual pin/unpin has historically fought with)
— GSAP's `ScrollTrigger` is then used purely to compute scroll progress and
drive a scrubbed timeline, not to manage pinning itself.

## Timing rules (see also `motion-system.md`'s performance section)

- `ease: "none"` on every scrubbed tween. Non-negotiable — this was the
  direct cause of a real "jarring, not smooth" bug report.
- No dead zones: every scroll-pixel in a chapter's budget should correspond
  to visible motion. If a chapter's animations finish with scroll budget
  left over, either extend the choreography to fill it or shrink the budget.
- Track absolute timeline positions explicitly when you want effects to
  overlap rather than silently extend total duration (see `motion-system.md`).
- Give every chapter roughly the same scroll-budget-per-unit-of-content —
  wildly uneven pacing between chapters is as jarring as non-linear easing.

## Accessibility — this is the part that's easy to get wrong

Pinned scroll sections are a well-known trap for screen reader and
keyboard-only users, **independent of `prefers-reduced-motion`** — most
assistive-tech users never set that OS flag, so gating accessibility only on
it is not sufficient.

The pattern that shipped and passed verification:

1. **Reduced-motion gets a completely different, non-pinned render path** —
   not the same pinned markup with animations skipped. Render each chapter
   as normal stacked content with a simple reveal-on-view fade, no `height:
   N*vh` scroll hijacking at all. Decide the render path with a `mounted`
   boolean set in an effect, defaulting to the static/accessible path for
   SSR and first paint (avoids hydration mismatch), only switching to the
   pinned path once the client confirms `!prefersReducedMotion`.
2. **Watch for stale closures on `prefersReducedMotion`.** The hook that
   reads `matchMedia` starts at `false` and updates asynchronously in its
   own effect. Any effect that captures `prefersReducedMotion` in a `[]`
   dependency array (or worse, in a `setTimeout` scheduled once) freezes to
   the stale default and silently ignores a real reduced-motion preference.
   Depend on the live value explicitly, or read it via a ref kept in sync.
3. **The decorative pinned visual gets `aria-hidden="true"` entirely** — it
   is not primary content, it's an illustration. Provide the same
   information (chapter headings/copy) as ordinary `sr-only` content in
   normal, non-hijacked document flow, so screen reader users get the same
   information without being trapped in the pinned region.
4. **Every focusable control inside the pinned region needs `tabIndex={-1}`
   while the section isn't in view** — a progress-nav dot that's invisible
   (`opacity-0`) is still keyboard-tabbable by default, which strands
   keyboard users on dead controls. Toggle `tabIndex` with the same
   `storyInView` state that drives the visual fade.
5. **Always ship a skip link** to jump straight past the pinned region for
   anyone who doesn't want to scroll through it.

## Fixed-pixel geometry breaks on small viewports

Any scene built from hand-computed pixel coordinates (a morph target, an SVG
`viewBox`, a circle-of-nodes radius) needs an explicit check against narrow
viewports — a composition sized for desktop can clip itself inside its own
`overflow-hidden` stage on a 360px phone. Cheapest fix: wrap the whole
composition in a responsively-scaled container (`scale-[0.72] sm:scale-90
md:scale-100`) rather than reworking the coordinate math per breakpoint.

## Shape morphs should commit to a shape, not animate corner-radius late

If a card/panel's `border-radius` is only ever set by a GSAP tween (i.e. no
base value in its className or inline style), it renders with **sharp
rectangular corners for however long it takes that tween to fire** — this
was a real, user-reported bug ("box appears as rectangle then corners get
round"). Either give the element its final shape as a static base style from
first paint, or if the shape genuinely needs to morph, set the *initial*
shape via `gsap.set()` synchronously before first paint is visible, never
leave a shape property to its unstyled default.
