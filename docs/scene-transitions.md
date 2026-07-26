# Scene Transitions

How one scene becomes the next. The rule from the brief: **never fade a
whole section out and a new one in.** A cut is cheap and forgettable; a
transition that carries something across is what makes a site feel like one
continuous space instead of stacked documents.

## Shared-element continuity, not crossfade

The technique that's actually shipped in this codebase, twice, in two
different forms:

1. **Same DOM node repositioned/reshaped**, not swapped for a different
   node. The Server → VPS → Cloud homepage sequence used exactly 8 `<div>`
   elements throughout its entire runtime — the "VPS square" and the "cloud
   node" are the *same element* as the "server rack unit," just tweened to
   new `x`/`y`/`width`/`height`/`borderRadius`. This is what makes it a
   genuine morph rather than a slideshow: there is no moment where content
   disappears and different content appears in its place.
2. **A persistent "carried" element traveling between scenes.** An earlier
   version of the homepage story kept a single domain-name chip on screen
   throughout, tweening its position/scale from "large, centered, in the
   search box" down to "small badge in the browser chrome" as the scenes
   progressed — same technique, applied to a single small element rather
   than a whole composition.

Default to technique 1 (same elements reshape) when the *whole scene's*
subject persists across the transition (a diagram, a data structure). Use
technique 2 (one element travels) when a *specific piece of information*
(a name, a status, a value) needs to visibly carry forward while everything
else around it changes.

## What crossfading is still for

Text captions, labels, and any content that's genuinely being *replaced*
(not transformed) still crossfade — that's honest, because the old and new
text aren't the same thing reshaped. Keep crossfades short (~200-350ms) and
use `AnimatePresence mode="wait"` so the outgoing and incoming content don't
render simultaneously and overlap illegibly.

## Camera language

"Camera" moves (pan, zoom/dolly) are simulated via `transform: scale()` and
`translate()` on a container that holds multiple scene elements — there is
no actual camera, so the trick is scaling/moving the *content* opposite to
where a camera would move, consistently, so it reads as one coherent space
being viewed rather than elements independently flying around.

- **Zoom in** = the focal element's container scales up while everything
  else either scales with it (staying in frame) or fades if it should exit
  the "shot."
- **Dolly / pan** = the whole stage translates; elements at different
  effective "depths" can translate at different rates (nearer = faster) if
  a parallax feel is wanted, but don't add parallax purely for texture — it
  needs to be establishing that some elements are closer/further in the
  story's space, or it's decoration (see `animation-principles.md`).

## Boundary conditions

- A scene transition should never be the *only* signal that content changed
  — always pair it with a text/label change (a heading, a kicker) so the
  transition is reinforcing a change the user can also read, not the sole
  carrier of meaning (accessibility: motion alone isn't perceivable by
  everyone).
- Don't chain more than one transition technique across a single boundary.
  Picking a morph AND a camera pan AND a crossfade for the same cut is how
  a scene transition stops reading as one idea and starts reading as noise.
