# shrotihost.in

Marketing site, careers page and domain tools for [ShrotiHost](https://shrotihost.in)
(web hosting, domains, custom projects). Checkout and account management live in
WHMCS at portal.shrotihost.in; this repo is the public-facing Next.js site plus the
`whmcs-theme/` portal theme source.

Stack: Next.js 16 (App Router, standalone output), React 19, Tailwind 4,
framer-motion, one gated three/r3f scene. Self-hosted behind Apache on the
ShrotiHost cPanel server; no Vercel.

## Commands

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production bundle → .next/standalone
npm start            # serve the build
npm run typecheck    # tsc --noEmit
npm run lint         # eslint
npm test             # vitest (src/**/*.test.ts)
scripts/smoke.sh [BASE_URL]   # route/API smoke test against a running server
```

## Environment variables

See `.env.example` for the full list with descriptions. In production they are set
in the `shrotihost-next` systemd unit.

| Variable | Purpose |
| --- | --- |
| `CAREERS_CSV_FILE` | Job-application CSV path (required in production) |
| `PROJECT_ENQUIRIES_CSV_FILE` | Project-enquiry CSV path (required in production) |
| `TLD_PRICING_FILE` | Daily WHMCS TLD pricing export (JSON); static fallback if missing |
| `ENQUIRY_WEBHOOK_URL` | Optional: receives a JSON summary of each stored submission |

All three files live under `/home/shrotihost/shared-data/`, outside the deployed
app directory and any web root.

## API routes

| Route | Notes |
| --- | --- |
| `GET /api/health` | `{ok, buildId, pricingUpdatedAt}` — used by the deploy script and monitors |
| `GET /api/domain-check?q=` | RDAP availability + catalog pricing; 30 req/min/IP |
| `POST /api/careers/apply` | Job application intake → CSV; 5/hour/IP |
| `POST /api/project-enquiry` | Project enquiry intake → CSV; 5/hour/IP |

Errors use one envelope: `{ok:false, code, message, fields?, requestId}`
(`error`/`errors` are emitted as aliases for the current forms).

## Deploy

On the server, as root:

```bash
bash /home/shrotihost/deploy-site.sh [--pull]
```

The script builds the standalone bundle, swaps `shroti-host-app` ↔
`shroti-host-app.old` and restarts `shrotihost-next`. Run `scripts/smoke.sh`
against the new bundle before the swap whenever possible.

### Rollback

Deploys are blue/green: `deploy-site.sh` builds into the idle slot
(`shroti-host-app-a` :3001 / `shroti-host-app-b` :3002, systemd
`shrotihost-next@a|b`), waits for `/api/health`, runs `scripts/smoke.sh`
against it, and only then points Apache at the new port. The previous slot
stays on disk, stopped. To roll back:

```bash
bash /home/shrotihost/deploy-site.sh --rollback   # flips Apache back, restarts the old slot
bash /home/shrotihost/deploy-site.sh --status     # which slot is live
```

Then confirm `curl -s https://shrotihost.in/api/health` reports the expected
`buildId`, and investigate `shroti-host-app.failed` before deleting it.

## Project conventions

`AGENTS.md` (Claude OS charter + project specifics), `DESIGN.md` (visual law),
`PRODUCTION_READINESS.md` (release gate), `docs/` (planning, audits).
