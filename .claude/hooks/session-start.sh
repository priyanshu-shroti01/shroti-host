#!/usr/bin/env bash
# Claude OS — SessionStart hook. Fast, offline, additive context only.
set -u

ROOT="${CLAUDE_PROJECT_DIR:-$(pwd)}"
VERSION="unknown"
[ -f "$ROOT/VERSION" ] && VERSION="$(head -1 "$ROOT/VERSION" | tr -d '[:space:]')"
AUTONOMY="${CLAUDE_OS_MAX_AUTONOMY:-3}"

cat <<EOF
[Claude OS v${VERSION}] Session context:
- Operating charter: CLAUDE.md (binding). Security: SECURITY.md. Design: DESIGN.md.
- Max autonomy level: ${AUTONOMY} (levels 4-5 and all sensitive actions need human approval).
- Route capabilities via skills/core/skill-router before loading skills.
- Implementer never approves own work; quality gates per skills/core/quality-pipeline.
- Record durable decisions/lessons in memory (skills/core/memory); never store secrets.
EOF
exit 0
