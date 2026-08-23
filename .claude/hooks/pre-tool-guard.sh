#!/usr/bin/env bash
# Claude OS — PreToolUse guard.
# Mechanical backstop for SECURITY.md: blocks writes to secret-bearing paths
# and clearly destructive shell commands. Exit 2 = block (stderr shown to
# Claude); exit 0 = allow. Deliberately narrow: policy lives in SECURITY.md,
# this only catches the unambiguous cases.
set -u

INPUT="$(cat)"

if ! command -v python3 >/dev/null 2>&1; then
  # python3 is a system requirement (doctor flags it); don't brick the session.
  exit 0
fi

python3 - "$INPUT" <<'PYEOF'
import json, re, sys

try:
    data = json.loads(sys.argv[1])
except Exception:
    sys.exit(0)

tool = data.get("tool_name", "")
tin = data.get("tool_input", {}) or {}

def block(reason):
    print(f"BLOCKED by Claude OS pre-tool-guard: {reason} "
          f"See SECURITY.md. If this is genuinely needed, the human must do "
          f"it or explicitly approve it.", file=sys.stderr)
    sys.exit(2)

SECRET_PATHS = [
    r"(^|/)\.env$", r"(^|/)\.env\.[^/]*$", r"\.pem$", r"\.key$",
    r"(^|/)id_rsa", r"(^|/)id_ed25519", r"credentials[^/]*\.json$",
    r"(^|/)\.aws/", r"(^|/)\.ssh/", r"(^|/)\.netrc$", r"\.p12$", r"\.pfx$",
]
ALLOWED = [r"\.env\.example$", r"\.env\.template$"]

if tool in ("Write", "Edit", "MultiEdit"):
    path = tin.get("file_path", "")
    if any(re.search(p, path) for p in ALLOWED):
        sys.exit(0)
    for pat in SECRET_PATHS:
        if re.search(pat, path):
            block(f"write to secret-bearing path '{path}'.")
    content = tin.get("content", "") or tin.get("new_string", "") or ""
    LEAKS = [
        r"sk-ant-[A-Za-z0-9\-_]{20,}",
        r"ghp_[A-Za-z0-9]{36}",
        r"github_pat_[A-Za-z0-9_]{22,}",
        r"AKIA[0-9A-Z]{16}",
        r"-----BEGIN (RSA|EC|OPENSSH|DSA) PRIVATE KEY-----",
    ]
    for pat in LEAKS:
        if re.search(pat, content):
            block("content appears to contain a real credential.")

elif tool == "Bash":
    cmd = tin.get("command", "") or ""
    DESTRUCTIVE = [
        (r"\brm\s+(-[a-zA-Z]*\s+)*(/|~|\$HOME)(\s|$)", "recursive delete of / or home"),
        (r"\bsudo\b", "sudo requires human approval"),
        (r"\bmkfs\b", "filesystem format"),
        (r"\bdd\s+[^|]*of=/dev/", "raw write to block device"),
        (r"git\s+push\s+[^|;&]*(--force|-f)\b[^|;&]*\b(main|master)\b", "force-push to protected branch"),
        (r"(curl|wget)\s+[^|;&]*\|\s*(ba)?sh", "piping downloaded code into a shell — inspect first (SECURITY.md §4)"),
        (r"\bDROP\s+(DATABASE|TABLE)\b", "destructive SQL requires human approval"),
        (r"chmod\s+(-[a-zA-Z]*\s+)*777\s+/", "world-writable root path"),
        (r"(^|[;&|]\s*)cat\s+[^|;&]*\.env(\s|$)", "reading .env — use documented env vars instead"),
        (r"\b(ufw|iptables|firewall-cmd)\b", "firewall changes require human approval"),
    ]
    for pat, why in DESTRUCTIVE:
        if re.search(pat, cmd, re.IGNORECASE):
            block(f"command matches '{why}': {cmd[:120]}")

sys.exit(0)
PYEOF
exit $?
