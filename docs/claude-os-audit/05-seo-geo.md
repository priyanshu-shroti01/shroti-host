# Claude OS audit — Technical SEO & GEO (2026-08-23)

Skills: seo/technical-seo, seo/geo. 22 URLs fetched, all 73 sitemap URLs status-swept, every JSON-LD block parsed.

## Scorecard highlights
PASS: titles unique; canonicals self-referencing on real pages (survive UTM); internal linking complete (no orphans); robots.txt; sitemap complete + all 200; HSTS; llms.txt accurate; Service schema; chunk independence in posts.
FAIL: soft-404s on dynamic blog routes (200 + noindex+index conflict + canonical → home); `www.` serves duplicate 200 site; `/legal` is a 200 meta-refresh; OG/Twitter tags are the homepage's on every non-blog page; blog posts lack og:image; FAQPage marks up answers not in DOM; WebSite SearchAction target not implemented; sitemap lastmod = build time for 52/73 URLs.
WARN: 19/21 blog titles 64–80 chars; 8 descriptions >160; footer h3s precede h1 (loading.tsx streaming); prices SSR "₹ 0" while Product schema says 39; Organization schema thin (empty sameAs, no description/contactPoint/address); identical FAQ on 7 pages; thin/pre-launch pages indexable; no `<time>`; no breadcrumbs trail for BreadcrumbList; AI-crawler policy undecided.

## Findings (prioritized)
P0-1 — Soft-404s on `/blog/[slug]`, `/blog/category/[category]`, `/blog/tag/[tag]`. Fix: `export const dynamicParams = false;` in each.
P0-2 — `www.` host duplicates the site (https://www → 200). Fix (Apache): 301 www → apex in one hop. **[server]**
P0-3 — `/legal` is a 200 meta-refresh. Fix: delete `src/app/legal/page.tsx`; `redirects()` in next.config: `/legal` → `/legal/terms` permanent.
P1-4 — OG/Twitter inherited from layout on every non-blog page; posts have no og/twitter image. Fix: in layout `openGraph` keep only siteName/locale/type; in `twitter` keep only card; blog generateMetadata: `openGraph.images: ["/opengraph-image"]` + `twitter {card, title, description, images}`; optional per-page `openGraph.url` via a `pageMeta` helper.
P1-5 — Prices SSR "₹ 0" (AnimatedCounter). Fix: `useMotionValue(value)` + render formatted value initially; animate from 0 only client-side after inView.
P1-6 — FAQPage answers not in DOM (accordion renders only open item). Fix: keep every answer mounted (`initial={false}`, animate height/opacity, `aria-hidden` when closed); remove AnimatePresence/exit.
P1-7 — Sitemap lastmod = build timestamp. Fix: omit `lastModified` for static/category/tag entries (keep post dates).
P1-8 — 404 renders inherit homepage canonical + conflicting robots. Fix: remove `alternates.canonical:"/"` and `robots` block from layout; add canonical "/" to `src/app/page.tsx`.
P1-9 — Blog titles 64–80 chars; 8 descriptions >160. Fix: blog `title: { absolute: post.title }`; shorten long titles in blog data; trim descriptions in services.ts (5), hosting, portfolio.
P1-10 — Organization schema thin / no entity statement. Fix: description, areaServed IN, logo → /icon.png, contactPoint (email, en/hi); remove empty sameAs; **owner decision** on legal name/address.
P1-11 — WebSite SearchAction points at a search that doesn't exist. Fix: remove `potentialAction` (or implement `?query=` on /domains).
P2-12 — JobPosting missing validThrough, hiringOrganization.url/logo. Fix: add; derive validThrough from a `closes` field.
P2-13 — Footer `<h3>`s precede `<h1>` in DOM. Fix: `<p>` labels; drop root loading.tsx.
P2-14 — Identical 5-question FAQ/FAQPage on 7 pages. Fix: `items` prop; page-specific Q/As per hosting line.
P2-15 — Home H1/hero has no entity statement. Fix: first paragraph = extractable definition ("ShrotiHost is an Indian web hosting and development company: … from ₹39/mo … since 2023"); title "ShrotiHost — Web Hosting & Domains in India".
P2-16 — Thin/pre-launch pages indexable (status, vps, master, alpha). Fix: status `robots:{index:false}` + remove from sitemap; decide on coming-soon pages.
P2-17 — Category/tag metadata templated ("guides on guides"). Fix: per-category description or special-case guides.
P2-18 — Article/Product schema lack `image`. Fix: add `${SITE_URL}/opengraph-image`.
P2-19 — BreadcrumbList without visible trail. Fix: small breadcrumb nav from the same trail array (or drop the schema).
P2-20 — Dates not `<time>`; no author bios. Fix: `<time dateTime>`; owner decision on named authors.
P2-21 — Page weight: both logos preloaded; bundle work with performance audit.
P2-22 — `lang="en"` vs `og:locale en_IN`. Optional: `lang="en-IN"`.
P2-23 — AI-crawler policy undecided (robots allow-all). **[owner decision]**: allow citation bots (OAI-SearchBot, PerplexityBot, ClaudeBot), optionally block training-only (Google-Extended, CCBot, Bytespider).

Quick wins: dynamicParams ×3; www 301; /legal redirect; layout OG/Twitter strip + blog images; AnimatedCounter SSR value; accordion mounted; sitemap lastmod; canonical/robots cleanup.
