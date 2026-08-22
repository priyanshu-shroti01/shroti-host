#!/usr/bin/env bash
# Rebuild the live ShrotiHost WHMCS theme from stock Twenty-One + our overrides.
set -euo pipefail
W=/home/shrotihost/portal.shrotihost.in; SRC="$(cd "$(dirname "$0")" && pwd)/shrotihost"; T=$W/templates/shrotihost
mkdir -p "$T"; cp -rn "$W/templates/twenty-one/." "$T/"
cp -r "$SRC/." "$T/"; sed -i '/^parent:/d' "$T/theme.yaml"
chown -R shrotihost:shrotihost "$T"; rm -rf "$W"/templates_c/*.php
echo "✓ theme deployed: $(find "$T" -name '*.tpl' | wc -l) templates"
