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

## Owner decisions (2026-08-23) and what followed
- **Legal identity**: Shroti Enterprises, Udyam Reg. UDYAM-UP-36-0017127, Ruheri, Hathras,
  Uttar Pradesh 204101 — now in the footer, Organization schema (`legalName`, `address`,
  `identifier`, `foundingDate` 2023-03-30), Terms §1 and Privacy §1. No GSTIN: the business
  charges generic tax, so the site never says "GST".
- **Legacy payment folders** (`/ccavenue*`, `/pay4bit-test`) stay in place — still in use.
  Only archives, configs, logs, the dev-tools dashboard and stray scripts are denied.
- **Cookies/analytics**: no banner; GA4 stays on with a per-browser "Turn analytics off"
  control on `/legal/privacy` (sets the official `ga-disable` flag before gtag loads).
- **Coming-soon lines** (`/vps`, `/master-reseller-hosting`, `/alpha-reseller-hosting`):
  `noindex,follow` and out of the sitemap until they launch.
- **AI crawlers**: citation/AI bots stay allowed; only Bytespider is blocked.
- **Promo**: kept, no invented end date (no fake countdown); wording clarified.
- **Uptime**: `/usr/local/sbin/shrotihost-watchdog.sh` (cron, 5 min) checks `/api/health`,
  the homepage and the portal; emails support@shrotihost.in after 2 consecutive failures
  and on recovery. WhatsApp alerts can be added once the washroti keys are provided to it.

## Still open
1. **JetBackup licence** (suspended 2026-06-12) — the nightly cron to `/root/backups` is
   an interim, not disaster recovery.
2. **Performance budget** — initial JS 263 KB brotli vs the 200 KB target; next step is a
   bundle-analyzer pass on the home route (framer-motion is still in most sections).
3. **Real-GPU QA** of the WebGL infra stack on a mid-range laptop; Firefox/WebKit visual pass.
4. **GA4 verification** in the GA property (events `page_view`/`select_plan`, cross-domain).
5. **CSP**: switch from report-only to enforcing after a week without violations.
6. **Product decisions**: 30-day money-back, free domain on annual, annual discount;
   named blog authors; Cloudflare/HTTP-2 for India latency.

## Re-audit round 2 (2026-08-23, afternoon)
Four more auditors (responsive 375/768/1024/1440, dark/light theme, interaction latency + bundle, WHMCS WhatsApp module) — all findings implemented:
- **Menu taps felt dead**: Next 16 `prefetch={false}` disables prefetch entirely; nav/CTA links now prefetch, all menu routes are warmed on idle, the mobile sheet shows a spinner on the tapped item and closes only when the new route renders, a transform-only progress bar runs under the header, Apache keep-alive 20 s on this vhost, GA loads `lazyOnload`, hero demo/3D fallback/CSS sweeps no longer burn the main thread on phones.
- **Theme**: white-on-white final-CTA button in dark (new `inverse` Button variant); purple/blue used as text now use contrast-safe text tokens (new `--color-brand-blue-text`); pending step labels readable; token shadows; theme-color meta follows the toggle.
- **Responsive**: header controls were hidden at 1024–1279; flagship card overlap; footer 8-col squeeze and bottom-bar wrap/FAB collision; pricing 2-up on tablets; sticky first column + swipe hint on phone tables; touch targets ≥44 px on footer/toggle/chips/menu.
- **WHMCS WhatsApp module**: `shell_exec` fatal fixed (guarded; campaign start uses `proc_open`); the per-request bootstrap that wrote 1.4M audit rows is gated to 24 h; audit table swapped to an indexed 4.4k-row copy; the real portal-freezing walker was WHMCS's Daily Email Backup → disabled, replaced by a nightly lock-free `mysqldump`; stored-XSS escapes, connect timeouts, GET-only retries, cron logging, invoice-PDF URLs unguessable, storage dirs denied, sync-on-view off.
