# Production Readiness — The "Real Website" Checklist

A website or product is not finished because it builds and renders. It is
finished when the applicable items below are satisfied and verified. The
production-agent audits against this list; `workflows/production-audit/`
runs it. Items marked ⚑ are legal/business judgment calls — flag them to the
human rather than deciding unilaterally.

Copy this file into each project (done by `scripts/project-init.sh`) and mark
items DONE / N/A-with-reason / BLOCKED. Unmarked items block release.

## A. Content & conversion

- [ ] 1. Custom 404 page (branded, helpful, links back in)
- [ ] 2. Primary CTA visible above the fold on key landing pages
- [ ] 3. Unique meta title per page (≤60 chars, keyword-aware)
- [ ] 4. Unique meta description per page (≤160 chars)
- [ ] 5. Open Graph image (1200×630) + og/twitter card tags per page type
- [ ] 6. Favicon set (SVG + PNG sizes + apple-touch-icon + manifest icons)
- [ ] 7. `robots.txt` (correct allow/disallow, sitemap reference)
- [ ] 8. `sitemap.xml` generated and submitted-ready
- [ ] 9. Meaningful alt text on all content images
- [ ] 10. All mobile breakpoints tested (320/375/390/430/tablet/desktop)
- [ ] 11. Sticky mobile CTA where appropriate to the conversion path
- [ ] 12. Loading states for all async UI
- [ ] 13. Form validation + designed error states (inline, specific)
- [ ] 14. Success / thank-you page (with next step, conversion tracking)
- [ ] 15. ⚑ Privacy policy page (real, applicable to actual data practices)
- [ ] 16. ⚑ Terms of service where applicable
- [ ] 17. ⚑ Cookie consent where legally required (region-aware)
- [ ] 18. Analytics installed and verified firing (see §F)
- [ ] 19. ⚑ Legitimate business/contact information present
- [ ] 20. All raster images compressed + correctly sized

## B. Technical

- [ ] Security headers: CSP, X-Content-Type-Options, Referrer-Policy,
      Permissions-Policy, HSTS (see `references/security/headers.md`)
- [ ] HTTPS enforced; HTTP→HTTPS redirect
- [ ] Redirect map for changed/legacy URLs (301s, no chains)
- [ ] Canonical URLs on every page
- [ ] Structured data (Organization + page-type schemas), validated
- [ ] 404 and 500 handled gracefully (no stack traces to users)
- [ ] Caching strategy: static assets fingerprinted + long-cache, HTML sane
- [ ] Image optimization pipeline (modern formats, responsive `srcset`, lazy)
- [ ] Font optimization (subset, `font-display`, preload critical, ≤2 families)
- [ ] Environment variables documented; no secrets in client bundles

## C. Quality gates (run their workflows)

- [ ] Accessibility audit passed — WCAG 2.2 AA floor (`workflows/accessibility-audit/`)
- [ ] Performance audit passed — budgets met (`workflows/performance-audit/`)
- [ ] Visual QA passed across browsers/viewports (`workflows/visual-audit/`)
- [ ] Functional QA passed (forms, nav, states) (qa-agent)
- [ ] SEO audit passed (`workflows/seo-audit/`)
- [ ] Anti-slop gate passed (`skills/design/anti-slop/`)
- [ ] Security review passed (`workflows/security-audit/`)
- [ ] Cross-browser tested (Chromium, Firefox, WebKit)

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

- [ ] Error tracking wired (e.g. Sentry-class tool) and verified
- [ ] Monitoring/uptime check configured
- [ ] Logging in place, secrets/PII-free, retention sane
- [ ] Backup & recovery path exists and is documented (data-bearing apps)
- [ ] Rollback procedure stated before deploy
- [ ] Analytics events validated end-to-end (not just installed)

## F. Sign-off

- [ ] Production-agent audit report attached
- [ ] **Human approval recorded** — Level 5 deploy is never autonomous

A release with open non-N/A items is a decision the human makes explicitly,
never a default.
