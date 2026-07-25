# Micro-interactions

The small, high-frequency stuff — buttons, inputs, toggles, cards. These
happen constantly across every page, so consistency here matters more than
cleverness. If you're building a new interactive element, check this list
before inventing a new hover/press style.

## Buttons

Already standardized in `src/components/ui/button.tsx` — reuse it rather
than hand-rolling button styles:

- **Hover**: lift (`-translate-y-0.5`), slight scale (`scale-[1.02]`), and
  (primary variant) a colored glow shadow. Purely a state change, not a
  decorative flourish — it's confirming "this is interactive" before commit.
- **Press**: scale down (`scale-[0.98]`), faster duration than hover
  (`active:duration-100`) — presses should feel immediate, hovers can ease.
- **Click**: ripple from the exact pointer position (`RippleLayer` in
  `button.tsx`), respecting `motion-reduce:hidden`. This is feedback that
  the click registered, independent of whatever the click's real consequence
  is (navigation, form submit, animation sequence).

## Cards

Standard card hover (`SpotlightCard`): lift + border color shift toward
brand purple + a cursor-tracked radial glow positioned via CSS custom
properties (`--spotlight-x/y`) updated on `mousemove` — deliberately *not*
React state, so it costs zero re-renders. If adding a new hover-glow effect
anywhere, follow this pattern (CSS vars + direct style mutation) rather than
`useState` + re-render on every mouse move.

## Form inputs

- Focus state: brand-purple caret color where the input is doubling as a
  literal address-bar/search metaphor (see `domains-hero.tsx`,
  `domain-search.tsx`, `knowledge-search.tsx`); standard focus ring
  (`focus-visible` global rule) otherwise.
- A controlled input standing in for a "real" system value (a domain name
  being processed, a sanitized version of what the user typed) must be kept
  in sync with that value once processing starts — don't let the visible
  input silently diverge from the value being acted on. (This was a real
  shipped bug: after a deploy sequence completed, the input reappeared
  showing the raw typed text instead of the sanitized domain being
  celebrated below it.)

## Step / checklist rows (deploy sequences, multi-stage processes)

The pattern used in `Hero`'s deployment checklist — reuse this shape rather
than inventing a new one for the next multi-step process:

- Three states per row: `pending` (dim icon, disabled-color text),
  `active` (brand-purple icon/border, per-row progress bar filling over
  that step's real duration), `done` (checkmark, success color).
- Detail line under the label shows the *real* spec being referenced
  (e.g. "LiteSpeed · NVMe", "Let's Encrypt") — never a placeholder.
- Status changes are driven by discrete state (`activeStep` index), not by
  continuously re-deriving state from a scrub position — this is a
  time-driven sequence, not scroll-driven (see `scroll-choreography.md` for
  when scroll-driven is and isn't the right call).

## Success / error feedback

- **Success**: glow/settle (a border or icon shifts to success color with a
  brief scale or opacity pulse), never more elaborate than that unless it's
  a genuine terminal "you completed the whole flow" moment (see the hero's
  celebration screen — party-popper icon, one-line confirmation, then real
  next-action buttons, not an animation for its own sake).
- **Error**: shake (small horizontal translate oscillation, 2-3 cycles,
  <300ms total) plus a color/icon state change — the shake alone is not
  sufficient feedback, it must be paired with legible error text.
- Neither should block interaction — a user must be able to immediately
  retry/dismiss, not wait out an animation.

## Dropdowns / menus / modals

Built on the same `bg-card` / `bg-surface-raised` glass tokens as everything
else (see `globals.css`) — don't give a new dropdown a bespoke opaque
background; it'll look inconsistent with nav dropdowns and cards that
already use the shared glass treatment. Enter/exit should be a short
opacity+y transition (~150-250ms), consistent with `AnimatePresence` usage
elsewhere, not a bounce or a slide-from-edge unless the trigger element is
literally at that edge (e.g. a mobile menu sliding from where the hamburger
icon is).
