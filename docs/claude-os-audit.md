# Claude OS audit of shrotihost.in — 2026-08-23

Every skill in [claude-skills](https://github.com/priyanshu-shroti01/claude-skills) was
applied to the live site and this repo by seven auditors (one per skill family),
then the findings were implemented in one pass. Full reports with evidence:

| # | Report | Skills | Findings |
|---|---|---|---|
| 01 | [Security & backend](claude-os-audit/01-security-backend.md) | secure-coding, secrets-hygiene, api-standards, data-safety | 19 |
| 02 | [Growth & research](claude-os-audit/02-growth-research.md) | growth-analysis, competitor-analysis, research-intelligence | 22 + competitor matrix |
| 03 | [3D, media, core](claude-os-audit/03-3d-media-core.md) | exploded-views, r3f-scenes, image/video-generation, quality-pipeline, skill-router, memory, graph-knowledge | 19 |
| 04 | [Frontend](claude-os-audit/04-frontend.md) | frontend-standards, component-quality | 21 |
| 05 | [SEO & GEO](claude-os-audit/05-seo-geo.md) | technical-seo, geo | 23 |
| 06 | [QA & production](claude-os-audit/06-qa-production.md) | functional-qa, visual-qa, production-readiness, deployment-gates | 25 |
| 07 | [Design](claude-os-audit/07-design.md) | anti-slop, design-direction, design-review, design-system, cinematic-product-design | 25 |

## What was found (the short version)

- **Critical** — legacy `public_html` artifacts (227 MB source zips, payment-gateway configs,
  an unauthenticated "Dev Tools Dashboard", WhatsApp/WHMCS utility scripts) were publicly
  reachable through the Apache `ProxyPass !` exclusions.
- **High** — API routes crashed (500) on non-string JSON; rate limit bypassable via spoofed
  `X-Forwarded-For`; Next 16.2.10 had 4 high advisories; no CSP; PII CSV world-readable with
  no retention; no working backups (JetBackup licence suspended); soft-404s on unknown blog
  URLs cached for a year; `www.` served a duplicate site; every page streamed behind the
  root `loading.tsx`; no error boundaries; deploys caused public 503s; no analytics;
  fabricated uptime chart on `/status`; brand purple text 3.35:1 on dark (WCAG fail);
  white on gradient 2.57:1; homepage composition documented as a competitor template.
- **Medium/Low** — 100+ items: OG/Twitter inheritance, schema gaps, fonts, a11y keyboard
  models, touch targets, magic values, copy honesty ("24/7", "Real, verified reviews"),
  bundle weight, docs drift.

## What changed

### Server (done, live)
- `public_html/.htaccess` denies `*.zip|log|sql|ini`, `config.php` and the stray utility
  scripts; `tools/` denied entirely; gateway folders protect config/lib/logs. Payment
  callback endpoints (`/ccavenue*`, `/pay4bit-test`) were **left reachable** — owner to
  confirm whether they are still used by any gateway, then they can be archived.
- `www.shrotihost.in` → `https://shrotihost.in` 301 (single hop).
- Apache sets `X-Forwarded-For` to the real client address.
- **Blue/green deploys**: `deploy-site.sh` builds into the idle slot, waits for
  `/api/health`, runs `scripts/smoke.sh`, gates on `npm audit --audit-level=high`, then
  flips the Apache port and reloads — no public 503s. `--rollback` / `--status`.
  Hardened templated systemd unit (`ProtectSystem=strict`, `MemoryMax`, `UMask=0077`).
- PII: `shared-data` 700/600; monthly 12-month retention prune (matches privacy §8);
  interim nightly backup to `/root/backups` until JetBackup is re-licensed; journald capped.
- Root cron no longer executes a user-writable script.

### Code (this commit)
- **Security/API**: shared `api-utils` (string coercion, last-hop IP, no-store, pruned
  limiter, CSV formula/DDE guard, error envelope with `requestId`), 413 over 16 KB, length
  caps, 0700/0600 file modes, 10-min dedupe, production config gate, optional
  `ENQUIRY_WEBHOOK_URL`; domain-check sanitiser (longest-TLD split, label regex, IDN
  message, 30/min limiter, 60 s cache); `/api/health`; CSP report-only; `/legal` 308;
  robots `Disallow: /api/`; Next 16.3.2 (`npm audit`: 0); vitest (33 tests); smoke script;
  `.env.example`; README/AGENTS deploy + rollback docs.
- **SEO/GEO**: `dynamicParams=false` on blog routes; layout OG/Twitter no longer inherited;
  blog OG images + absolute titles; canonical/robots cleanup; sitemap lastmod only on posts;
  Organization/WebSite/Article/Product/JobPosting schema enriched; line-specific FAQs;
  `/status` noindex; money-page titles with price + "India"; `lang="en-IN"`; icon.svg +
  manifest; error boundaries; GA4 with cross-domain linker, `select_plan` event and UTM on
  every portal link.
- **Frontend/a11y/perf**: root `loading.tsx` removed; Plus Jakarta preloaded, Geist sans
  dropped; `MotionConfig reducedMotion="user"`; LazyMotion in layout chrome; native
  currency `<select>`; focus management for dropdowns/chatbot; accordion answers stay
  mounted (FAQ schema honesty); prices SSR real values; form fields `aria-invalid`/
  `aria-describedby` + first-invalid focus; 44 px targets; storage reads guarded;
  3D stack keyboard-reachable, per-frame material writes skipped at rest, `pointer: fine`
  gate, swap-seam fix.
- **Design/copy**: WCAG tokens (`--color-brand-purple-text`, `--gradient-hero-deep`);
  gradient text only on H1s; one H1 recipe, one eyebrow, one 1200 px container; 1 px card
  borders; no hover-lift on static cards; one Reveal per section; left-aligned intros;
  compact sections; 4-col cycle toggle on mobile; hero rewritten ("Launch a website. Watch
  it happen." + definition sentence + "See plans — from ₹39/mo"); final CTA hierarchy;
  blob removed; contact/portfolio voids fixed; `#everything` and `#why` duplicate sections
  removed from the homepage; fabricated uptime chart removed; honest Trustpilot aggregate;
  "24/7" → "Priority support (WhatsApp + tickets)"; sales path → WhatsApp; promo wording;
  design-system skill + DESIGN.md rewritten to match the code.

## Still open (needs the owner)
1. **Legal identity** — legal entity name, registered address, GSTIN for the footer and
   Organization schema (every competitor shows this; trust score 2/5 without it).
2. **Legacy payment folders** — confirm `/ccavenue`, `/ccavenue_proxy`, `/pay4bit-test`
   are unused so they can be archived out of `public_html`.
3. **JetBackup licence** (suspended 2026-06-12) — interim cron backup is not a real DR plan.
4. **Promo end date** (`src/lib/promo.ts` `expiresAt`) — or the "40% off" is permanent.
5. **WHMCS "Tax @ 15%"** on checkout vs 18% GST — verify in WHMCS tax rules.
6. **Product decisions** — 30-day money-back (competitors), free domain on annual, annual
   discount; whether VPS/Master/Alpha "coming soon" pages stay indexable.
7. **AI-crawler policy** in robots.txt; named blog authors; uptime monitor + error tracking
   (point an external monitor at `/api/health`); real-GPU QA pass of the WebGL scene;
   Cloudflare/HTTP-2 decision for India latency.
