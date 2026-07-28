---
name: cinematic-product-design
description: The philosophy behind why premium product sites (reference point — GetLayers.ai) feel expensive, adapted for a hosting company. Load this before designing or reviewing any new page, hero, or section at the concept level — before reaching for docs/motion-system.md (the "how to animate") or the design-system skill (the concrete tokens). This is the "what and why" layer above both.
---

# Cinematic Product Design

GetLayers.ai's actual product isn't templates — it's a design language. The
pattern behind almost every one of its layers: one dominant visual, one
clear message, one memorable interaction, one smooth transition, very
little text, large typography, high-quality motion, strong atmosphere.
That's the whole reason those pages read as expensive. Nothing here is
about copying GetLayers' layouts, colors, or components — it's the four
words in the sourcing note at the bottom that matter: **principles, not
pixels.**

## The rule this whole skill reduces to

**Every viewport has one dominant visual, one message, and motion that
explains the product rather than decorating it.** If you can't name the
one thing a viewport is saying, it's saying too many things.

This is the same rule already codified as the "one sentence justification
test" in `docs/animation-principles.md` ("this animation exists so the
user understands ___") — that doc governs individual animations; this
skill governs the composition a viewport is built from in the first place.
Read both before designing a new section: this skill for what the section
should be *about*, `animation-principles.md` for whether each motion in it
earns its place.

## Scene thinking, applied correctly

Reframe a page as scenes, each with a single purpose:

```
Launch your website → Choose a domain → Deploy → Infrastructure → Dashboard → Scale
```

**This does not mean rebuilding the homepage into one pinned, scroll-jacked
narrative.** That was tried on this exact project (an 8-chapter cinematic
scroll story) and explicitly reverted — see `docs/scroll-choreography.md`:
"a hero is conventionally the above-the-fold moment, not a multi-screen
commitment." Apply scene-thinking *within* normal page structure instead:
each existing section (hero, pricing, developer features, migration...)
should independently read as one scene with one dominant visual and one
message, the way the shipped hero already does (one screen, one story: type
a domain, watch it deploy). Don't chain sections into a forced single
journey to get this effect — get it section by section.

## Show, don't list

A feature grid ("LiteSpeed · CloudLinux · Daily Backup · NVMe SSD") tells.
A simulated flow shows:

```
Visitor → Cloudflare → Firewall → LiteSpeed → CloudLinux → NVMe → Website Live
```

The hero's deploy checklist already proves this works on this project
(search domain → server ready → SSL → DNS → deploy, as a real animated
sequence, not a bullet list). `trusted-tech.tsx` currently is *not* this —
it's a plain scrolling name marquee (Cloudflare, LiteSpeed, CloudLinux...
as static text). That's the clearest concrete candidate on this site for
applying this principle, if a future task asks for it: turn the trust
strip into a connected pipeline instead of a list of names. Don't build it
unprompted — flag it as an option when relevant.

Same logic applies to screenshots: a simulated, honestly-labeled live
state (see the `dashboard-preview.tsx` "Illustrative preview" pattern)
beats a static screenshot every time, because it demonstrates the product
working rather than describing it.

## Atmosphere, not decoration

Subtle lighting, depth, gradient, glow, and motion — used to make a scene
feel like a real, dimensional space rather than a flat document — is the
part of "premium" that's easiest to get wrong by overdoing it. The
existing tokens already provide this: `--gradient-glow`, the brand
purple/blue gradient pair, the glass surface tokens (`bg-card` /
`bg-surface-raised`, see the design-system skill). Reach for those before
inventing a new atmosphere primitive. Atmosphere should be felt, not
noticed — if a reviewer's first comment is about the background effect
rather than the product, it's too loud.

## What not to copy

Explicitly avoid, regardless of how common they are on AI-agency or
portfolio sites: cursor spotlights with no informational payload, floating
decorative blobs, particle fields that don't map to anything, glass
panels/cards added purely because they look premium, and gradients chosen
because they're trendy rather than because they're the brand's own purple
→ blue. Every one of these is banned for the same reason
`animation-principles.md` already bans decorative-only motion: **this is a
hosting company, and every visual choice should reinforce hosting** — a
domain resolving, a server provisioning, a certificate issuing, traffic
flowing through real infrastructure. If a visual doesn't reinforce that,
it belongs on an AI-agency site, not this one.

One clarification since this project already shipped site-wide
glassmorphism: that's a structural surface-hierarchy system (page canvas
vs. raised panel, applied consistently via design tokens, not a decorative
flourish added per-component) — it's compatible with this rule. The rule
here is about *adding more* decorative glass/blur/particle effects because
a reference site has them, not about the token system already in place.

## Large typography, minimal copy

Say less, bigger. A one-line headline that states the outcome ("Launch a
website. Watch it happen.") beats a paragraph explaining features. If a
section needs three sentences to explain what it does, the visual isn't
doing enough work yet.

## Pre-build checklist

Before shipping a new section, hero, or page-level visual, it should pass:

- [ ] One dominant visual — not three competing for attention
- [ ] One sentence of copy could replace the current amount and lose
      nothing essential
- [ ] The motion in it explains a real product mechanic (see
      `animation-principles.md`'s justification test), not decoration
- [ ] At least one interaction a visitor can actually do, not just watch
- [ ] Scene transitions in/out use shared-element continuity or an honest
      crossfade (see `docs/scene-transitions.md`), not a hard cut
- [ ] Reduced-motion has a real, non-degraded fallback (see
      `docs/scroll-choreography.md`'s accessibility section)
- [ ] Nothing in it is decoration that could be swapped for any other
      SaaS product's decoration without changing the meaning

## Sourcing note

GetLayers (and sites like it) are useful for exactly one thing: reverse-
engineering *why* a pattern feels premium, so the underlying principle can
be re-applied to hosting-specific content. Never carry over their actual
prompts, copy, layout structure, or asset choices — GetLayers' own
documentation says to treat its prompts as a starting point to adapt, not
ship unchanged, and that's the right posture toward any reference site.
The deliverable is always a distinctive hosting experience built around
deployment, infrastructure, and developer workflows — not a reskin of
someone else's landing page.
