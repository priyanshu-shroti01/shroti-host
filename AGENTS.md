<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# gstack

Use the `/browse` skill from gstack for all web browsing. Never use
`mcp__claude-in-chrome__*` tools.

Available skills: /office-hours, /plan-ceo-review, /plan-eng-review,
/plan-design-review, /design-consultation, /design-shotgun, /design-html,
/review, /ship, /land-and-deploy, /canary, /benchmark, /browse,
/connect-chrome, /qa, /qa-only, /design-review, /setup-browser-cookies,
/setup-deploy, /setup-gbrain, /retro, /investigate, /document-release,
/document-generate, /codex, /cso, /autoplan, /plan-devex-review,
/devex-review, /careful, /freeze, /guard, /unfreeze, /gstack-upgrade, /learn.

Don't have these skills? Install gstack:

```
git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack \
  && cd ~/.claude/skills/gstack && ./setup
```

# Claude OS

This project runs on **Claude OS** (`/root/claude-skills` on the server —
github.com/priyanshu-shroti01/claude-skills). Its charter, SECURITY.md and
permission model are binding here; this section adds project specifics.

- **What it is**: shrotihost.in — ShrotiHost's marketing site + careers +
  domain tools (Next.js 16, React 19, Tailwind 4, framer-motion, one gated
  three/r3f scene). Checkout lives on WHMCS at portal.shrotihost.in.
- **Commands**: `npm run build` · `npm run dev` · `npx tsc --noEmit` · `npx eslint`
  (no test runner yet — see PRODUCTION_READINESS.md).
- **Deploy**: `bash /home/shrotihost/deploy-site.sh [--pull]` (server only).
- **Visual law**: `DESIGN.md` + `.claude/skills/design-system` +
  `.claude/skills/cinematic-product-design` (project skills win over generic
  OS design skills when they conflict).
- **Key paths**: `src/app` routes · `src/components` · `src/lib` (plans,
  services, blog, careers, navigation, whmcs, currency) · `src/app/api`
  (domain-check, careers/apply) · `whmcs-theme/` (portal theme source).
- **Routing**: load only the skills a task needs via `.claude/skills/skill-router`;
  apply the quality-pipeline gates; `PRODUCTION_READINESS.md` gates releases.
- OS skill links under `.claude/skills/` are absolute symlinks created by
  `scripts/project-init.sh` and are gitignored — run project-init on your
  machine to recreate them.
