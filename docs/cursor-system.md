# Cursor System — ShrotiHost's Signature Interaction

**Status: proposed, not yet implemented.** This document specifies the
design; nothing in the codebase currently changes the cursor. Written now so
the spec exists before the build starts, per `animation-principles.md`'s
"consistent, not invented per-page" rule.

## The idea

No hosting provider currently uses a consistent cursor-as-infrastructure
metaphor. ShrotiHost's cursor *is* a network packet moving through real
infrastructure, everywhere on the site, all the time — not just in one hero
demo. This is the thing that makes the site recognizable independent of any
single page's layout.

## Default state

- The pointer is replaced by a small glowing dot (packet), trailed by a
  faint fading path showing its last ~150ms of movement — not a decorative
  comet, a literal "this is a request in flight" visual (same visual
  language already shipped in the old hero's comet-trail loading indicator;
  reuse that technique rather than inventing a new one).
- Must degrade to the **real system cursor** on any device without reliable
  fine pointer input (touch, most tablets) — detect via
  `window.matchMedia("(pointer: fine)")`, not user-agent sniffing. Don't ship
  a custom cursor that fights with touch scrolling.
- Must respect `prefers-reduced-motion`: reduced-motion visitors get the
  system cursor, full stop. A custom animated cursor is inherently
  motion-heavy; there's no honest "static" version of it.

## Hover states — node activation

When the packet-cursor crosses specific "infrastructure node" elements
(marked with a data attribute, e.g. `data-node="cloudflare"`), that node
visually activates (glow/scale pulse) as if the packet touched it. The
sequence a visitor can trigger by moving across a real infrastructure
diagram: **Cloudflare → LiteSpeed → CloudLinux → NVMe → Your Website** — this
should map onto the *real* infrastructure stack already listed in
`TrustedTech` and `lib/plans.ts`'s `commonFeatures`, not an invented one.

Implementation note: this needs the nodes to physically exist somewhere in
the layout (the trusted-tech strip is the obvious first candidate) — the
cursor system's job is to react to real DOM elements, not to draw its own
disconnected diagram.

## Click — travel + confirmation

Clicking a primary CTA sends the packet on a defined path (SVG motion path or
a sequence of DOM waypoints) ending in a "Website Live" confirmation state —
this is the click-triggered version of the same deploy-sequence pattern
already shipped in `Hero`'s checklist. Reuse that step-list/checkmark
language; don't invent a second visual vocabulary for the same concept.

**Honesty boundary applies directly here**: the click animation dramatizes
what happens on real conversion actions (checkout, signup) — it must not
delay or obscure the actual navigation/submission, and it must not imply a
site went live if the click was just "learn more" or a nav link. Reserve the
full travel+confirmation sequence for actions that actually result in a real
account/order (checkout, plan selection) — everything else gets the lighter
ripple-only click feedback from `motion-system.md`.

## Build order (recommended, not yet started)

1. Prototype the cursor-replacement + trail on one page behind a feature
   flag or dev-only route — verify perf and reduced-motion/touch fallback
   before it touches shared layout.
2. Wire node activation into the existing `TrustedTech` strip (real nodes
   already exist there).
3. Wire click-travel into one real conversion CTA (e.g. a plan's "Choose
   Grow" button) end to end, confirm it doesn't add latency to the actual
   checkout navigation.
4. Only then consider rolling it out further. Do not implement a global
   custom cursor across the whole site in one pass — this is exactly the
   scope of change that has needed multiple correction rounds every other
   time it happened in this project (see the hero's three full rebuilds).
