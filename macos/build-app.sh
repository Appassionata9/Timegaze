#!/bin/zsh
set -euo pipefail

ROOT="${0:A:h:h}"
APP="$ROOT/release/观时 · Timegaze.app"
CONTENTS="$APP/Contents"
MACOS="$CONTENTS/MacOS"
RESOURCES="$CONTENTS/Resources"

mkdir -p "$MACOS" "$RESOURCES"
node "$ROOT/macos/build-icon.mjs"
cp "$ROOT/macos/Info.plist" "$CONTENTS/Info.plist"
cp "$ROOT/macos/AppIcon.png" "$RESOURCES/AppIcon.png"
rm -rf "$RESOURCES/app"
cp -R "$ROOT/macos/app" "$RESOURCES/app"

CLANG_MODULE_CACHE_PATH="$ROOT/.build/clang-module-cache" \
xcrun clang \
  -fobjc-arc \
  -O2 \
  -framework Cocoa \
  -framework WebKit \
  "$ROOT/macos/main.m" \
  -o "$MACOS/Timegaze"

codesign --force --deep --sign - "$APP"
echo "$APP"
