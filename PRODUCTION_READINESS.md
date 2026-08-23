# Production Readiness — The "Real Website" Checklist

A website or product is not finished because it builds and renders. It is
finished when the applicable items below are satisfied and verified. The
production-agent audits against this list; `workflows/production-audit/`
runs it. Items marked ⚑ are legal/business judgment calls — flag them to the
human rather than deciding unilaterally.

Copy this file into each project (done by `scripts/project-init.sh`) and mark
items DONE / N/A-with-reason / BLOCKED. Unmarked items block release.

## A. Content & conversion

- [x] 1. DONE 2026-08-23 — Custom 404 page (branded, helpful, links back in)
- [x] 2. DONE 2026-08-23 (hero "See plans — from ₹39/mo"; plan pages) — Primary CTA visible above the fold on key landing pages
- [x] 3. DONE 2026-08-23 (money pages carry price + India) — Unique meta title per page (≤60 chars, keyword-aware)
- [x] 4. DONE 2026-08-23 (trimmed ≤160) — Unique meta description per page (≤160 chars)
- [x] 5. DONE 2026-08-23 (layout no longer leaks homepage OG; posts carry images) — Open Graph image (1200×630) + og/twitter card tags per page type
- [x] 6. DONE 2026-08-23 (icon.svg, icon.png, apple-icon, manifest.ts) — Favicon set (SVG + PNG sizes + apple-touch-icon + manifest icons)
- [x] 7. DONE (Disallow /api/) — `robots.txt` (correct allow/disallow, sitemap reference)
- [x] 8. DONE (72 URLs, lastmod only where real) — `sitemap.xml` generated and submitted-ready
- [x] 9. DONE (SVG-only site; OG alt exported) — Meaningful alt text on all content images
- [ ] 10. PARTIAL — 375 px audited (no overflow, targets fixed); 320/390/430/tablet not yet — All mobile breakpoints tested (320/375/390/430/tablet/desktop)
- [x] 11. DONE — Sticky mobile CTA where appropriate to the conversion path
- [x] 12. DONE (form sending, domain-check spinner; root route loader removed on purpose) — Loading states for all async UI
- [x] 13. DONE 2026-08-23 (server 422 + aria-invalid/describedby, first-invalid focus) — Form validation + designed error states (inline, specific)
- [ ] 14. PARTIAL — inline success panels with next step; no conversion event yet — Success / thank-you page (with next step, conversion tracking)
- [x] 15. ⚑ DONE 2026-08-23 (retention §8, GA4 disclosure) — Privacy policy page (real, applicable to actual data practices)
- [x] 16. ⚑ PRESENT — Terms of service where applicable
- [ ] 17. ⚑ OWNER — GA4 now sets cookies; decide on a consent banner — Cookie consent where legally required (region-aware)
- [ ] 18. PARTIAL — GA4 installed with cross-domain linker + select_plan; firing not yet verified in GA — Analytics installed and verified firing (see §F)
- [ ] 19. ⚑ OWNER — legal entity name / address / GSTIN still missing — Legitimate business/contact information present
- [x] 20. DONE (no raster content images; OG PNG 90 KB) — All raster images compressed + correctly sized

## B. Technical

- [x] DONE 2026-08-23 (CSP report-only; tighten after a week) — Security headers: CSP, X-Content-Type-Options, Referrer-Policy,
      Permissions-Policy, HSTS (see `references/security/headers.md`)
- [x] DONE — HTTPS enforced; HTTP→HTTPS redirect
- [x] DONE 2026-08-23 (www→apex 301, /legal 308) — Redirect map for changed/legacy URLs (301s, no chains)
- [x] DONE — Canonical URLs on every page
- [ ] PARTIAL — Organization/WebSite/Product/Service/Article/JobPosting/FAQ present; not yet run through the Rich Results validator — Structured data (Organization + page-type schemas), validated
- [x] DONE 2026-08-23 (error.tsx, global-error.tsx, API envelope) — 404 and 500 handled gracefully (no stack traces to users)
- [x] DONE — Caching strategy: static assets fingerprinted + long-cache, HTML sane
- [x] DONE (next/image; SVG-only content) — Image optimization pipeline (modern formats, responsive `srcset`, lazy)
- [x] DONE 2026-08-23 (2 families, Plus Jakarta preloaded) — Font optimization (subset, `font-display`, preload critical, ≤2 families)
- [x] DONE 2026-08-23 (.env.example; prod gate) — Environment variables documented; no secrets in client bundles

## C. Quality gates (run their workflows)

- [ ] PARTIAL — frontend audit fixes applied (contrast tokens, focus, ARIA); no WCAG tool run — Accessibility audit passed — WCAG 2.2 AA floor (`workflows/accessibility-audit/`)
- [ ] OPEN — initial JS 263 KB br, above the 200 KB gz budget — Performance audit passed — budgets met (`workflows/performance-audit/`)
- [ ] PARTIAL — Chromium 1440/375 dark+light audited; Firefox/WebKit not run — Visual QA passed across browsers/viewports (`workflows/visual-audit/`)
- [x] DONE 2026-08-23 (docs/claude-os-audit/06; scripts/smoke.sh gates every deploy) — Functional QA passed (forms, nav, states) (qa-agent)
- [x] DONE 2026-08-23 (docs/claude-os-audit/05, P0/P1 fixed) — SEO audit passed (`workflows/seo-audit/`)
- [ ] PARTIAL — docs/claude-os-audit/07 fixes applied; re-run pending — Anti-slop gate passed (`skills/design/anti-slop/`)
- [x] DONE 2026-08-23 (docs/claude-os-audit/01; npm audit 0) — Security review passed (`workflows/security-audit/`)
- [ ] OPEN — Cross-browser tested (Chromium, Firefox, WebKit)

## D. Performance budgets (defaults; override per project)

| Metric | Budget |
|---|---|
| LCP | ≤ 2.5s (p75, mobile) |
| CLS | ≤ 0.1 |
| INP | ≤ 200ms |
| TTFB | ≤ 800ms |
| JS shipped (initial route) | ≤ 200KB gzipped |
| Largest image | ≤ 200KB (hero exceptions documented) |

## E. Operations

- [ ] OPEN — errors carry requestId in journald; no Sentry-class tool — Error tracking wired (e.g. Sentry-class tool) and verified
- [ ] OWNER — point an external monitor at /api/health — Monitoring/uptime check configured
- [x] DONE 2026-08-23 (journald capped; CSV 0600; 12-month prune) — Logging in place, secrets/PII-free, retention sane
- [ ] PARTIAL — interim nightly cron to /root/backups; JetBackup licence suspended (owner) — Backup & recovery path exists and is documented (data-bearing apps)
- [x] DONE 2026-08-23 (blue/green; deploy-site.sh --rollback) — Rollback procedure stated before deploy
- [ ] OPEN — Analytics events validated end-to-end (not just installed)

## F. Sign-off

- [x] DONE — docs/claude-os-audit.md (7 reports) — Production-agent audit report attached
- [ ] **Human approval recorded** — Level 5 deploy is never autonomous

A release with open non-N/A items is a decision the human makes explicitly,
never a default.
