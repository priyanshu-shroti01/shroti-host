# Phase 2 Delivery Report — HOST / BUILD / SCALE

Per the owner brief's §76 output requirements. Written 2026-08-19.

## Architecture

Next.js 16 App Router, React 19, TypeScript strict, Tailwind 4,
framer-motion. All marketing routes statically prerendered; two dynamic
API routes (domain-check, project-enquiry) plus careers/apply. Content
(plans, domains, modules, services, portfolio, blog) lives as typed TS
data modules in src/lib — no CMS, no markdown pipeline. Standalone
output for the self-hosted deploy.

New in this phase: src/lib/services.ts (BUILD data model),
src/lib/portfolio.ts, src/lib/blog-posts/* (one file per article),
src/components/services/* (service page family), three home sections
(host-build-scale, project-selector, upgraded hero/final-cta), blog
category/tag archives + TOC.

## Dependencies

Added: none. The phase was delivered entirely on the existing stack.

## Repositories / stack decisions vs. the brief

- React Three Fiber / Drei / postprocessing: NOT added. The repo's design
  constitution rejected WebGL twice (docs/redesign-plan.md: CSS 3D covers
  the need at zero bundle cost; the 8-chapter scroll story was tried and
  reverted). The shipped exploded-view is CSS-3D, scroll-linked, labeled,
  reduced-motion-safe. R3F remains an opt-in follow-up.
- GSAP / Lenis: NOT added — framer-motion is the documented motion system;
  native scroll is a constitution decision.
- Magic UI / Aceternity: NOT added as dependencies; the existing token
  design system covers the component language.
- Ruflo: not installed in this environment (verified). The 13-role
  workflow was executed with Claude Code's native orchestration: scout
  agent (repo mapping), 5-writer content workflow, design-review and
  motion-review agents, browser QA harness.

## Pages (new routes this phase)

/web-development /app-development /ecommerce-development
/saas-development /custom-software /portfolio
/blog/category/[category] /blog/tag/[tag]
API: /api/project-enquiry

## SEO

- 21 articles across 5 clusters (15 new), each with FAQ where useful,
  3-6 internal links, honest CTAs; category+tag archives; TOC on long
  posts; dateModified via `updated`.
- Schema: Service + FAQPage + BreadcrumbList on service pages;
  Article + FAQPage + BreadcrumbList on posts; existing Product/Org/
  WebSite/JobPosting unchanged.
- sitemap.xml: all new routes, archives, and per-post lastModified;
  llms.txt updated with the BUILD section and new positioning.
- Content calendar: docs/planning/44_CONTENT_CALENDAR.md (4 future
  batches, update-over-duplicate policy, explicit non-goals: no doorway
  pages, no programmatic spam).

## Performance

- No new dependencies; ProjectSelector and below-fold home sections load
  as deferred chunks (dynamic import) like the existing pattern.
- Production build: exit 0, every marketing route prerendered static.
- New motion is transform/opacity-only with reduced-motion parity.

## QA performed

- Production build green; tsc + eslint clean on all new files.
- All new routes 200 with correct H1/metadata (dev spot-checks).
- Enquiry API: validation (422 per-field), honeypot (silent 200),
  rate-limit path, CSV write with formula-injection escaping — verified
  end-to-end; careers CSV location convention respected.
- Browser: selector interaction, service-page pipeline animation, mobile
  375px (no horizontal overflow), portfolio, blog TOC/tags/archives.
- design-review + motion-review subagent audits on all new surfaces
  (findings triaged in the QA-loop commits that follow).

## Honesty ledger (things deliberately NOT done)

- No fabricated portfolio clients, reviews, stats, or awards anywhere.
- Development services carry no invented price ranges — quotes go through
  the enquiry flow.
- VPS is presented as coming soon in nav, selector, and all three VPS
  articles.
- No location/doorway pages until served locations are confirmed.
- Client case studies section exists as policy ("published only with
  permission") — needs real projects from the owner.

## Remaining risks / needs human verification

- PROJECT_ENQUIRIES_CSV_FILE path on the production server (defaults to
  the careers shared-data dir) — confirm write perms on deploy.
- Real rate cards for development services when ready (replaces
  quote-only flow).
- The WebGL decision: revisit only if the owner wants literal R3F after
  seeing this phase live.
