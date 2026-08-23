# shrotihost.in — DESIGN.md (visual law)

Concrete tokens and rules live in `.claude/skills/design-system/SKILL.md`
(read from `src/app/globals.css`) and the concept layer in
`.claude/skills/cinematic-product-design/SKILL.md`. This file is the index.

- **Canvas**: dark-first `#0a0a0f`, surface `#131318`, glass cards
  `rgb(22 22 29/.6)` + 20px blur via tokens (`bg-card`, `bg-surface-raised`).
- **Brand**: purple `#a810c7` → blue `#3fa7ff` gradient for primary actions;
  success/warning/error tokens only for state.
- **Type**: Geist (body/UI), Plus Jakarta (display accents); Tailwind scale
  xs→6xl, no arbitrary px sizes.
- **Shape**: `rounded-full` buttons/pills, `rounded-2xl` cards, `rounded-3xl`
  hero containers; three shadow tiers.
- **Motion**: explains a product mechanic or it doesn't ship; GPU-only
  properties; reduced-motion gets a real static state. See
  `docs/motion-system.md`, `docs/animation-principles.md`.
- **Anti-slop**: no decorative particles/blobs/spotlights; every visual
  reinforces hosting infrastructure (requests, servers, DNS, SSL).
