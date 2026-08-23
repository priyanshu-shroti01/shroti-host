#!/usr/bin/env bash
# Smoke test for shrotihost.in — run against a freshly started bundle BEFORE
# swapping it into production, or against the live site after a deploy.
#
#   scripts/smoke.sh                      # http://127.0.0.1:3001
#   scripts/smoke.sh https://shrotihost.in
#   BASE_URL=http://127.0.0.1:3002 scripts/smoke.sh
#
# Exits non-zero if any check fails. Needs only bash + curl.
set -u

BASE_URL="${1:-${BASE_URL:-http://127.0.0.1:3001}}"
BASE_URL="${BASE_URL%/}"
CURL=(curl -sS -o /dev/null -m 20 -H "User-Agent: shrotihost-smoke/1")

pass=0; fail=0
rows=()

record() { # status name expected actual
  local status="$1" name="$2" expected="$3" actual="$4"
  rows+=("$(printf '%-4s  %-42s  %-10s  %s' "$status" "$name" "$expected" "$actual")")
  if [ "$status" = "PASS" ]; then pass=$((pass+1)); else fail=$((fail+1)); fi
}

expect_code() { # method path expected [curl args...]
  local method="$1" path="$2" expected="$3"; shift 3
  local code
  code="$("${CURL[@]}" -X "$method" -w '%{http_code}' "$@" "$BASE_URL$path" 2>/dev/null || echo "ERR")"
  if [[ ",$expected," == *",$code,"* ]]; then
    record PASS "$method $path" "$expected" "$code"
  else
    record FAIL "$method $path" "$expected" "$code"
  fi
}

for p in / /hosting /domains /blog /careers /contact /legal/privacy /sitemap.xml /robots.txt; do
  expect_code GET "$p" 200
done
expect_code GET /blog/this-does-not-exist 404
expect_code GET /nope 404
expect_code GET /legal "301,308"
expect_code GET /api/health 200
# Intake health: 503 here means CAREERS_CSV_FILE / PROJECT_ENQUIRIES_CSV_FILE is
# unset in the unit or the shared-data dir is not writable — fix before swapping.
expect_code GET /api/careers/apply 200
expect_code GET /api/project-enquiry 200
expect_code PUT /api/careers/apply 405
expect_code POST /api/careers/apply 400 -H 'Content-Type: application/json' --data 'not json'
expect_code POST /api/careers/apply 400 -H 'Content-Type: application/json' --data '[1,2]'
expect_code POST /api/careers/apply 422 -H 'Content-Type: application/json' --data '{}'
expect_code POST /api/careers/apply 422 -H 'Content-Type: application/json' --data '{"name":123,"email":["x"]}'
expect_code POST /api/project-enquiry 422 -H 'Content-Type: application/json' --data '{}'
expect_code GET "/api/domain-check?q=-bad-.com" 400
expect_code GET "/api/domain-check?q=" 200

# Sitemap must list the whole site (73 URLs at the time of writing).
locs="$(curl -sS -m 20 "$BASE_URL/sitemap.xml" 2>/dev/null | grep -o '<loc>' | wc -l | tr -d ' ')"
if [ "${locs:-0}" -ge 65 ]; then
  record PASS "sitemap <loc> count" ">=65" "$locs"
else
  record FAIL "sitemap <loc> count" ">=65" "${locs:-0}"
fi

# Health body must say ok:true.
health="$(curl -sS -m 20 "$BASE_URL/api/health" 2>/dev/null || true)"
if [[ "$health" == *'"ok":true'* ]]; then
  record PASS "health body ok:true" "ok:true" "yes"
else
  record FAIL "health body ok:true" "ok:true" "${health:0:60}"
fi

echo "Smoke: $BASE_URL"
printf '%-4s  %-42s  %-10s  %s\n' "RES" "CHECK" "EXPECTED" "ACTUAL"
printf '%s\n' "${rows[@]}"
echo "----"
echo "passed=$pass failed=$fail"
[ "$fail" -eq 0 ]
