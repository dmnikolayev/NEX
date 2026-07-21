#!/usr/bin/env bash
set -euo pipefail
ROOT="${1:-.}"
STAMP="$(date +%Y%m%d-%H%M%S)"
for f in index.html styles.css config.js layout.json README.md; do
  [[ -f "$ROOT/$f" ]] && cp "$ROOT/$f" "$ROOT/$f.bak-$STAMP"
  cp "$(dirname "$0")/$f" "$ROOT/$f"
done
mkdir -p "$ROOT/js" "$ROOT/assets"
cp "$(dirname "$0")"/js/*.js "$ROOT/js/"
cp "$(dirname "$0")"/assets/house-concept-v5.png "$ROOT/assets/house-concept-v5.png"
echo "NEX v5 installed. Backups: *.bak-$STAMP"
