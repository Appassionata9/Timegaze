#!/bin/zsh
set -euo pipefail

ROOT="${0:A:h:h}"
OUTPUT="$ROOT/macos/AppIconHighRes.png"

if [[ -f "$OUTPUT" ]]; then
  exit 0
fi

PARTS=("$ROOT"/macos/AppIconHighRes.png.base64.*(N))
if (( ${#PARTS} == 0 )); then
  echo "Missing AppIconHighRes.png base64 parts" >&2
  exit 1
fi

cat "$ROOT"/macos/AppIconHighRes.png.base64.* | base64 -D > "$OUTPUT"
