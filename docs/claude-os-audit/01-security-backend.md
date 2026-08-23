# Claude OS audit — Security & Backend (2026-08-23)

Skills: security/secure-coding, security/secrets-hygiene, backend/api-standards, backend/data-safety. Read-only audit of `/root/shroti-host-repo` + live site. A third route `src/app/api/project-enquiry/route.ts` (near-copy of careers) shares every finding.

## Scorecard highlights
- PASS: no injection sinks; CSV cells quoted; URL scheme allowlist; CORS closed; HSTS/nosniff/XFO/Referrer/Permissions headers; HTTP→HTTPS; outbound RDAP timeout 3.5s; no secrets in code/history/bundles; 500s leak nothing; Next bound to 127.0.0.1.
- FAIL: no CSP; no rate limit on /api/domain-check; careers/enquiry rate limit bypassable via client X-Forwarded-For; `npm audit` 4 high (next 16.2.10 → 16.3.2, postcss, sharp, nanoid); no `.env.example`; config silently defaults; hand-rolled validation crashes (500) on non-string fields; inconsistent error envelope; no request logging/real health check; no tests; PII CSV world-readable on shared host; no retention/deletion path; no working backups (JetBackup license suspended 2026-06-12).

## Findings (prioritized)
1. HIGH — No working backups of PII CSVs. Fix: re-license JetBackup or WHM backups; interim root cron tar of /home/shrotihost/shared-data to /root/backups (30-day rotation) + one restore drill. **[server: interim cron installed 2026-08-23]**
2. HIGH — Root cron ran a user-writable script (`/home/shrotihost/whmcs-tools/catch-audit-walker.sh`) → local privilege escalation. Fix: move to /usr/local/sbin root-owned, log to /var/log. **[server: done]**
3. HIGH — Next.js 16.2.10 has open advisories (Server Action DoS/SSRF/disclosure); journal shows Server Action probing. Fix: `next`/`eslint-config-next` → 16.3.2; deploy script: drop `--no-audit`, add `npm audit --omit=dev --audit-level=high` gate.
4. HIGH — Rate limit bypass / IP spoofing via client-supplied X-Forwarded-For (Apache appends, app takes first element). Fix: Apache `RequestHeader set X-Forwarded-For "%{REMOTE_ADDR}s"` **[server: done]**; code: take the LAST element of XFF.
5. HIGH — Applicant PII file world-readable (`-rw-r--r--`, dir 755, no CageFS, 4 tenants). Fix: chmod 700 dir / 600 files **[server: done]**; routes: `mkdir(..., {mode:0o700})`, `appendFile(..., {mode:0o600})`.
6. MEDIUM — No request-body size limit; email/portfolio/resumeUrl/phone unbounded (3 MB JSON accepted). Fix: Apache LimitRequestBody 64 KB on /api/ **[server: attempted; enforce in code too]**; routes: reject content-length > 16 KB with 413; cap email 254, portfolio/resumeUrl 2048, phone 32.
7. MEDIUM — Non-string JSON fields crash handler (500): `{"name":["a"]}`. Fix: `str()` coercion helper; reject non-object bodies with 400.
8. MEDIUM — /api/domain-check is an unauthenticated outbound amplifier (≤14 RDAP fetches per call, no limit/cache; rdap.org throttles after bursts; `example.com?x=1` → tld `.comx1`). Fix: sanitize at `[/?#:@]`, validate base label `^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$` else 400; per-IP limiter 30/min; 60s in-memory cache in checkOne.
9. MEDIUM — No Content-Security-Policy. Fix: add report-only CSP first: `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'self'; base-uri 'self'; object-src 'none'; form-action 'self' https://portal.shrotihost.in` (+ analytics hosts if GA is added).
10. MEDIUM — No retention limit/deletion path; privacy policy §8 silent on applicant/enquiry data. Fix: add "kept for 12 months, then deleted" to `src/lib/legal-content.ts` §8; monthly prune cron; consider dropping user_agent.
11. LOW — Build/npm ci run as root with install scripts. Fix: `--ignore-scripts` if sharp still works, or run build as shrotihost.
12. LOW — Rate-limit Map grows unbounded. Fix: prune stale keys periodically; refuse when size > 10k.
13. LOW — CSV escaping gaps: lone `\r` not stripped; `|` (DDE) not neutralized; phones stored as `'+91…`. Fix: `/[\r\n]+/g`, guard regex `/^[=+\-@\t\r|]/`, store phone digits only.
14. LOW — Inconsistent error envelope; no correlation id/request logs; GET health checks nothing. Fix: `{ok:false, code, message, fields?, requestId}`; GET → `access(dir, W_OK)` → 503 on failure.
15. LOW — No `.env.example`; no boot-time config validation. Fix: add `.env.example` (CAREERS_CSV_FILE, PROJECT_ENQUIRIES_CSV_FILE, TLD_PRICING_FILE); fail clearly when unset in production.
16. LOW — API not excluded from crawlers; API responses lack Cache-Control. Fix: robots disallow `/api/`; `Cache-Control: no-store` on all API responses.
17. LOW — Duplicate submissions on retry. Fix: 10-minute dedupe on sha256(email+role).
18. INFO — systemd hardening could add ProtectHome=tmpfs + BindPaths, PrivateDevices, ProtectKernelTunables, RestrictAddressFamilies, MemoryMax, UMask=0077.
19. INFO — Public repo exposes internals (no secrets). Decide private vs accept.
