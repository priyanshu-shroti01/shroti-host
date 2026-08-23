# shrotihost.in — DESIGN.md (visual law)

Concrete tokens and rules live in `.claude/skills/design-system/SKILL.md`
(read from `src/app/globals.css`) and the concept layer in
`.claude/skills/cinematic-product-design/SKILL.md`. This file is the index.

- **Canvas**: dark-first `#0a0a0f`, surface `#131318`, opaque cards
  `#17171f` + 1px border + shadow tokens (`bg-card`, `bg-surface-raised`).
  Light palette lives on `:root`; no glass, no blur outside sticky chrome.
- **Brand**: purple `#a810c7`; `--gradient-hero-deep` behind any white text
  (buttons, CTA panel), `--gradient-hero` for decoration only;
  success/warning/error tokens only for state.
- **Type**: Plus Jakarta Sans (body/UI/display), Geist Mono (code, domains);
  Tailwind scale xs→6xl, no arbitrary px sizes.
- **Shape**: `rounded-full` buttons/pills, `rounded-2xl` cards, `rounded-3xl`
  hero containers; three shadow tiers.
- **Motion**: explains a product mechanic or it doesn't ship; GPU-only
  properties; reduced-motion gets a real static state. See
  `docs/motion-system.md`, `docs/animation-principles.md`.
- **Anti-slop**: no decorative particles/blobs/spotlights; every visual
  reinforces hosting infrastructure (requests, servers, DNS, SSL).

## 2026-08-23 design audit — decisions

Recorded from `docs/claude-os-audit/07-design.md` (25 findings) and the
growth audit; implemented across `globals.css`, `ui/*`, the home sections
and every hero.

- **One H1 recipe**: `text-4xl font-extrabold leading-none tracking-tighter
  sm:text-5xl lg:text-6xl` on every page. No `leading-[1.03]`, no per-page
  weight.
- **Gradient text only on the H1** — one phrase per page. Every section H2
  is plain `text-text-primary`; service/module pages no longer split
  `headline[0]/[1]` for H2s.
- **One eyebrow**: `<Eyebrow>` for page/section labels; `Badge` for in-card
  status only.
- **One width**: `Container` = 1200px. Hero grids dropped `max-w-6xl`;
  `max-w-5xl/2xl` are for prose.
- **Contrast tokens**: `--color-brand-purple-text` (`#a810c7` light /
  `#cf6cf2` dark, AA on bg and card) for purple words; `text-brand-purple`
  stays for icons. `--gradient-hero-deep` behind all white-on-gradient text.
- **Depth**: 1px border + shadow token per card; `border-2` reserved for
  `Badge`. No hover lift on non-interactive cards. `shadow-2xl` only on the
  hero launch card and the welcome modal; `--shadow-raised` elsewhere. New
  tokens `--shadow-cta/-cta-hover/-spotlight`, `--glow-dot`,
  `--ease-out-quart`, `--duration-fast`.
- **Rhythm**: `Section compact` (`py-12 sm:py-16`) for testimonials / FAQ /
  project selector; split sections (pricing, comparison, HOST→BUILD→SCALE)
  keep a left-aligned intro; one `<Reveal>` per section, no per-item
  staggers, pricing cards static on arrival.
- **Touch targets ≥ 44px**: hero launch arrow `h-11 w-11`, cycle tabs
  `py-2.5` in a 4-col grid on phones, `.chip` padding `0.625rem 0.875rem`.
- **Sections removed from the homepage** (composition was a documented
  competitor template): `#everything`, `#steps`, `#why` — the comparison
  table is the single feature statement. `why-choose.tsx` /
  `everything-included.tsx` stay in the tree only until nothing imports them.
- **Honesty**: fabricated uptime bars removed from `/status` (manual notice
  board); Trustpilot aggregate printed (4.1/5 from 12 reviews); comparison
  "others" column says "Varies by host" with a dated footnote; "24/7" → 
  "Priority support (WhatsApp + tickets)"; promo copy names the code and
  has no invented end date (owner must set `expiresAt`).
- **Hero**: "Launch a website. Watch it happen." + one extractable
  definition sentence; primary CTA "See plans — from ₹39/mo" (price read
  from `lib/plans`); demo labelled "Interactive demo"; end state routes to
  `/hosting#compare`; "AI-Powered Infra" badge → "Daily Backups".
