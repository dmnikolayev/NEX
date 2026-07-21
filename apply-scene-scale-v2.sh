#!/usr/bin/env bash
set -euo pipefail

ROOT="${1:-.}"

if [[ ! -f "$ROOT/styles.css" || ! -f "$ROOT/layout.json" ]]; then
  echo "Run from the NEX repository root, or pass its path:" >&2
  echo "  ./apply-scene-scale-v2.sh /path/to/NEX" >&2
  exit 1
fi

STAMP="$(date +%Y%m%d-%H%M%S)"
cp "$ROOT/styles.css" "$ROOT/styles.css.backup-$STAMP"
cp "$ROOT/layout.json" "$ROOT/layout.json.backup-$STAMP"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cp "$SCRIPT_DIR/styles.css" "$ROOT/styles.css"
cp "$SCRIPT_DIR/layout.json" "$ROOT/layout.json"

echo "Updated styles.css and layout.json"
echo "Backups: *.backup-$STAMP"
