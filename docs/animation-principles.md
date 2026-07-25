# Animation Principles

The rule every other doc in this folder exists to serve: **animation explains, it never decorates.**

## The test for every motion decision

Before adding or approving any animation, answer this in one sentence:

> "This moves because it's showing the user ______."

If you can't finish that sentence with something real — a state change, a causal
relationship, a piece of feedback, a location in a process — the animation
doesn't belong. "It looks cool" is not an answer. Delete it.

Concretely, this project has already rejected, in order:

- Floating decorative cards with no relationship to the content near them
- Ambient background blobs that don't respond to anything
- A domain-purchase narrative that was really "advertise our infrastructure"
  wearing a story's clothes
- Skeleton loading bars standing in for a real deployment sequence
- A pill-to-card shape morph whose only job was to look neat (dropped in favor
  of a fixed shape once it caused a real "renders as a rectangle before it
  rounds" bug — see `scroll-choreography.md`)

Each of those looked fine in isolation. None of them passed the one-sentence test.

## What "explains" means in practice

Map every motion to one of these, and only these:

| Category | What it's proving to the user |
|---|---|
| Progress | Something is happening between a start and an end state, and this is how far along it is |
| Connection | These two things are related / this caused that |
| Feedback | The system received your input and here's what it did with it |
| Deployment / process | A real (or realistically-modeled) sequence of infrastructure steps |
| Network | Data or a request is moving from one place to another |
| Security | A boundary changed state (unsecured → secured) |

If a motion doesn't fit one of these, it's decoration. See `motion-system.md`
for the concrete cursor/hover/click/scroll mapping.

## One scene, one message

Every distinct "scene" — a hero, a pinned scroll chapter, a card that reveals
on hover — gets exactly one dominant message, one primary interaction, and one
payoff. Not three. If a section is doing too much, it's not one scene, it's
several that need to be split apart or sequenced.

Symptom that a scene is overloaded: you can't describe what it's showing in
one clause. ("It shows DNS resolving, and also the server specs, and also—"
— that's two scenes wearing one card's clothes.)

## The honesty boundary (non-negotiable)

This is specific to ShrotiHost and overrides generic Awwwards-style guidance:
**motion must never imply a real backend capability, a real measurement, or
real customer data that doesn't exist.**

Established precedent in this codebase:

- Deploy sequences, DNS records, and SSL flows on marketing pages are clearly
  illustrative/simulated — never claimed as a live check against real
  infrastructure.
- "Deployed in X.Xs" style readouts must be a **genuine measurement of the
  animation's own runtime** (`performance.now()` deltas), not an invented number.
- No fabricated uptime SLAs, no fake live monitoring data. The `/status` page
  is explicitly labeled "Preview — not live monitoring yet" for exactly this
  reason.
- If a feature doesn't exist yet (e.g. "AI-Powered Infrastructure" as of this
  writing), it can appear as aspirational marketing copy only with the
  business owner's explicit, informed sign-off — never invented unprompted.
- Real actions (checkout, support tickets, billing, migration requests) always
  route to the real WHMCS portal (`portal.shrotihost.in`) — a slick animated
  demo is never a substitute for or disguise of a real transaction.

When in doubt: label it ("Simulated", "Illustrative", "Preview") rather than
let the motion imply more than the product actually does.

## Quality bar

Before shipping any new interaction, it should survive:

- **Would this still make sense with the sound off, at half speed, described
  to someone over the phone?** If the "cool" is only in the speed/flash, it's
  decoration.
- **Does it hold up on a slow, low-end device?** GPU-accelerated transforms
  only (`transform`, `opacity`) for anything performance-sensitive — see
  `motion-system.md` for the specific technique notes on when this project
  chose "layout-triggering but simple" over "compositor-only but complex."
- **Does it still work for someone who can't see it?** Every scroll-driven or
  auto-playing sequence needs a reduced-motion path that isn't just "the
  animation, but instant" — see `scroll-choreography.md`.
