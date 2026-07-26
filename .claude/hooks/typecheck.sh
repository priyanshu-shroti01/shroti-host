#!/usr/bin/env bash
# PostToolUse hook: after Edit/Write touches a .ts/.tsx file, lint that file
# and typecheck the project. Non-zero exit surfaces stderr back into the
# conversation so an error gets fixed immediately instead of at the next
# `npm run build`.
set -u

input="$(cat)"
file_path="$(printf '%s' "$input" | python3 -c 'import json,sys; d=json.load(sys.stdin); print(d.get("tool_input",{}).get("file_path",""))' 2>/dev/null)"

case "$file_path" in
  *.ts|*.tsx) ;;
  *) exit 0 ;;
esac

cd "$(dirname "$0")/../.." || exit 0

lint_output="$(npx eslint "$file_path" 2>&1)"
lint_status=$?

tsc_output="$(npx tsc --noEmit 2>&1)"
tsc_status=$?

if [ "$lint_status" -ne 0 ] || [ "$tsc_status" -ne 0 ]; then
  echo "typecheck/lint failed for $file_path" >&2
  [ "$lint_status" -ne 0 ] && echo "--- eslint ---" >&2 && echo "$lint_output" >&2
  [ "$tsc_status" -ne 0 ] && echo "--- tsc --noEmit ---" >&2 && echo "$tsc_output" >&2
  exit 2
fi

exit 0
