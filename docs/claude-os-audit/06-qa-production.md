# Claude OS audit — Functional QA + Production readiness (2026-08-23)

Skills: qa/functional-qa, qa/visual-qa (checklist only), production/production-readiness, production/deployment-gates. 27 static routes + 73 sitemap URLs + dynamic blog routes exercised over HTTPS; 3 API routes probed; deploy script, systemd unit, Apache includes, journal/domlog, cron, backups inspected. Nothing modified.

**Release recommendation: NOT READY by the checklist bar** (PRODUCTION_READINESS.md 0 items marked; 1 Critical + 5 High below).

## Functional QA results
- PASS: all static routes 200 (20–45 ms, cache HIT); all 73 sitemap URLs 200; robots; http→https 301 with query preserved; trailing slash 308; case 404; custom 404 (no-store); careers API method/parse/honeypot/server validation/happy path; enquiry validation; domain-check empty/emoji/URL input/POST 405; portal links (8) + wa.me; theme persistence.
- PARTIAL: www serves full site (no apex 301); `/legal` = 200 meta-refresh; domain-check IDN → silently empty; dotted input treats everything after first dot as TLD; currency flashes INR before stored USD/EUR; no error.tsx/global-error.tsx.
- FAIL: unknown blog slug/category/tag → **200** with 404 UI, cached 1 year (`s-maxage=31536000`), conflicting robots metas; non-string JSON field → **500** (`(t.name ?? "").trim is not a function`); rate limit bypass via spoofed X-Forwarded-For (5 spoofed POSTs then real IP → no 429); domain-check accepts 1000/5000-char `q` (76 KB response, 14 RDAP fetches each); `-bad-.com`/`example.` returned as priced rows.

## Production readiness (selected)
- Content: titles unique (NVMe post 67 chars); `/hosting` desc 164, `/careers` 165; blog posts emit empty og:image; favicon set lacks SVG icon + manifest (404); success states inline only, no conversion tracking; privacy policy claims "analytics cookies" while no analytics installed; no cookie consent (none may be required — decide); **no legal entity name/address/GSTIN anywhere**.
- Technical: no CSP; www not canonicalised; API 500 bare; 3 font families; env names only in the unit file.
- Quality gates: homepage JS 273.6 KB brotli (> 200 KB budget); eslint 0 errors/1 warning (unused `readFile` in careers route); no test script/tests/CI.
- Operations: no error tracking; no uptime monitor on host; journald no SystemMaxUse; CSVs store IP + UA with no retention; JetBackup daemon active but `/backup` empty; rollback = single `.old` generation, undocumented; README is create-next-app boilerplate; `docs/planning/41_DEPLOYMENT_AND_DEVOPS.md` describes staging/auto-rollback that don't exist.
- Deployment gates: deploys cause public 503s at restart (Googlebot 22/Aug 23:54:24, bingbot 23/Aug 00:09:30 — exact `systemd Started/Stopped` timestamps); smoke check runs only after the swap; no approval/deploy record.

## Prioritized findings
1. **CRITICAL** — Legacy `public_html` artifacts live on the production domain via `ProxyPass !` exclusions: `/ethara-ecommerce.zip` 227 MB (36,880 entries incl. `.env.example`s), `/rankhostzone.in.zip` 23 MB, `/caterserv.zip`, `/ccavenue_proxy.zip` (contains `config.php`), `/chatbot.zip`; `/ccavenue/`, `/ccavenue_proxy/`, `/pay4bit-test/` payment-gateway callback scripts; `/register.php` (WhatsApp Graph API registration, `phone_number_id`); `/export.php`; `/tools/` "Dev Tools Dashboard" (ioncube_checker, zipfile.php, master_tool); `/PostController.php`; `/new/`; 19 MB mp4. Fix: move everything except `.well-known` to `/home/shrotihost/legacy-archive/`, delete the matching `ProxyPass … !` lines, graceful. Interim: deny `*.zip` in `.htaccess`. Treat zip contents as leaked.
2. HIGH — API 500 on non-string JSON fields (`careers/apply/route.ts:76-81`, `project-enquiry/route.ts:77-84`). Fix: `str()` coercion.
3. HIGH — Rate-limit bypass + IP forgery via client XFF (Apache `ProxyAddHeaders` appends; code takes first). Fix: take last hop / Apache `RequestHeader set` **[server: done]**.
4. HIGH — Soft 404s on dynamic blog routes, cached for a year. Fix: `dynamicParams = false` ×3.
5. HIGH — Deploys cause public 503s; no pre-swap health gate or rollback automation. Fix: start new bundle on a second port, health-check, flip ProxyPass target, graceful, stop old; `--rollback`.
6. HIGH — No error tracking, uptime check or health endpoint. Fix: `src/app/api/health/route.ts` `{ok, buildId, pricingUpdatedAt}`; external monitor; `journalctl -p err` → mail.
7. HIGH — No tests/CI/staging. Fix: `scripts/smoke.sh` (route codes, 404 for unknown slug, API 400/422/405, sitemap count) called before swap; `typecheck` script.
8. MEDIUM — 4 high npm advisories (sharp via next 16.2.10; CVE-2026-33327/33328/35590/35591). Fix: next 16.3.2.
9. MEDIUM — PII world-readable, no retention **[server perms: done]**; drop/truncate user_agent; privacy text.
10. MEDIUM — domain-check unthrottled/uncapped. Fix: label regex + limiter 30/min/IP.
11. MEDIUM — No CSP. Fix: report-only first.
12. MEDIUM — www duplicate. Fix: RewriteRule 301 in both proxy includes.
13. MEDIUM — `/status` hard-coded uptime bars. Fix: real monitor or remove + label as manual notice board.
14. MEDIUM — Initial JS 273 KB br. Fix: confirm scene chunk dynamic; analyzer.
15. MEDIUM — Rollback undocumented, README boilerplate. Fix: "Rollback" section in AGENTS.md; keep two `.old` generations.
16. LOW — `/legal` meta-refresh → next.config redirect.
17. LOW — Blog og:image empty.
18. LOW — Meta length overruns (/hosting 164, /careers 165, NVMe title 67).
19. LOW — Favicon set incomplete (icon.svg, manifest.ts).
20. LOW ⚑ — Legal/business substance for the owner: analytics-cookie claim, cookie consent decision, entity name/address/GSTIN.
21. LOW — Log hygiene: Server Action probe noise, `/autodiscover` 400s, errors without request path, no journald cap (`SystemMaxUse=500M`).
22. LOW — Sitemap lastmod = build time for 52 routes.
23. LOW — create-next-app SVG leftovers served publicly.
24. LOW — Currency flashes INR before stored USD/EUR (read in useEffect). Fix: inline pre-paint script like ThemeScript.
25. LOW — Domain-check input semantics (IDN message, invalid labels, longest-TLD match).

## Data note
Auditor's test submission is line 3 of `/home/shrotihost/shared-data/job-applications.csv` (`2026-08-23T05:31:37Z`, "Claude OS audit test", `qa-audit@shrotihost.in`) **[purged 2026-08-23]**. `project-enquiries.csv` has never been written in production.
