# Redesign Plan — Phase 2: HOST / BUILD / SCALE (2026-08-19)

Phase 1 (`docs/redesign-plan.md`, shipped through `61d0e49`) delivered the
premium-motion HOST side: exploded infrastructure stack, glass depth pass,
request-pipeline trust strip, live WHMCS TLD pricing, careers system.
Phase 2 executes the owner's expansion brief: reposition ShrotiHost from a
hosting brand into a **HOST / BUILD / SCALE** technology partner — hosting +
software development + infrastructure — with a real SEO content engine.

## Gap analysis vs. the owner brief

| Brief area | Current state | Phase 2 action |
|---|---|---|
| HOST (hosting/domains/VPS pages, pricing, portal links) | Complete, live pricing, deep links | Preserve untouched |
| Exploded 3D hero + scroll choreography | Shipped (CSS-3D, scroll-linked, labeled layers) | Keep; extend narrative to BUILD/SCALE |
| BUILD (web dev, app dev, e-commerce, SaaS, custom software) | **Absent — no pages, no nav, no copy** | Core of this phase |
| SCALE positioning | Implicit only (VPS coming-soon, migration copy) | Explicit section + service copy |
| Portfolio | Absent | Real products only (WHMCS modules, this site); owner must supply client work |
| Project selector ("What are you building?") | Absent | Build as conversion router |
| Project enquiry flow | Absent (careers has the form+API pattern) | Reuse careers API pattern (validated route, honeypot, rate-limit, CSV) |
| Blog engine | 6 posts, no categories/tags/TOC/related | Upgrade engine + initial content library |
| Topic clusters / content calendar | Absent | ~15 launch articles + calendar doc |
| Technical SEO | Solid (sitemap, robots, schema, canonicals) | Extend to new routes; Service + BreadcrumbList schema |
| Navigation | Hosting/Domains dropdowns | Add Build/Development group + Resources; footer column |
| Hero copy | "Launch a website. Watch it happen." | Brief prescribes "Build. Deploy. Scale." headline; supporting copy per brief §9 |

## Decisions and honest deviations from the brief

1. **WebGL / React Three Fiber: not added.** The repo's design constitution
   already evaluated and rejected WebGL for this site twice
   (`docs/redesign-plan.md`: "WebGL is explicitly rejected — CSS 3D covers
   the need at zero bundle cost"; scroll-jacked cinematic chapters tried and
   reverted per `docs/scroll-choreography.md`). The shipped exploded-view is
   CSS-3D, scroll-linked, labeled, reduced-motion-safe, and costs 0 KB of
   WebGL runtime. The brief's own rules (§6 no redundant deps, §58 don't let
   3D destroy rendering performance, §62 adapt to superior existing
   architecture, §77 don't optimize for "lots of animation") support keeping
   it. R3F remains available as an opt-in follow-up if the owner wants
   literal WebGL after seeing this phase.
2. **GSAP / Lenis / Magic UI / Aceternity: not added.** framer-motion is the
   installed, documented motion system (`docs/motion-system.md`) and covers
   scroll-linked animation; native scroll is a constitution decision (no
   scroll-jacking). Component effects come from the existing token system.
3. **Ruflo: not installed in this environment** (verified: no binary, no npm
   package here). The 13-role coordinated workflow the brief describes is
   executed with Claude Code's native agent orchestration instead (scout,
   writer fan-out, design-review, motion-review, QA agents). Phase 1's scan
   memory lives on the owner's machine; its plan file is in-repo and used.
4. **No fabrication.** No invented clients, reviews, stats, awards, or
   portfolio items. Development services carry no fake price ranges — the
   enquiry flow replaces "starting at ₹X" until the owner supplies real
   pricing. No location/doorway pages until the owner confirms served
   locations beyond "India".
5. **MDX: not introduced.** The blog is a typed-TS content system with SSG +
   schema already wired; the engine upgrade extends it (categories, tags,
   TOC, related, CTAs) rather than migrating formats mid-phase.

## Implementation order (each a logical commit)

1. `feat(build): services data model + five service routes`
   `/web-development`, `/app-development`, `/ecommerce-development`,
   `/saas-development`, `/custom-software` — one scene per section,
   process pipeline visual (Design → Frontend → API → Database →
   Infrastructure → Production), honest deliverables, FAQs, Service schema.
2. `feat(build): project enquiry flow` — `/api/project-enquiry` mirroring
   the careers route's validation/honeypot/rate-limit/CSV pattern + premium
   form; CTA target for every BUILD surface.
3. `feat(build): portfolio + project selector` — real products only;
   "What are you building?" router (7 options → service/hosting paths).
4. `feat(home): HOST / BUILD / SCALE narrative` — hero headline per brief,
   three-panel brand section, development section, final CTA
   ("Build what's next."), nav Development group, footer column.
5. `feat(blog): engine upgrade` — categories, tags, TOC, related articles,
   reading time, contextual service CTAs, BlogPosting/Breadcrumb schema.
6. `feat(blog): launch content library` — ~15 articles across hosting /
   domains / VPS / web-dev / app-dev clusters (agent fan-out, human-first,
   real search intent, internal links, zero invented statistics) +
   `docs/planning/44_CONTENT_CALENDAR.md`.
7. `feat(seo): wiring` — metadata, sitemap, llms.txt, internal link graph.
8. QA loop: build + browser QA (desktop/mobile/reduced-motion) +
   design-review + motion-review agents + a11y pass → fix → repeat → push.

## Acceptance (from brief §75, scoped to this phase)

- BUILD is prominent: nav, homepage, five substantive service pages
- Hosting purchase paths untouched and verified
- Enquiry flow works end-to-end (validated API, no secrets client-side)
- Blog: categories/tags/TOC/related live; ≥15 quality articles; schema valid
- No fabricated claims anywhere; production build green; no console errors
- Reduced-motion, keyboard, and mobile verified on every new surface
