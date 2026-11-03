#!/bin/bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/dist"
PROJECT="$OUT/SwiftinXcode"
APP_NAME="Swiftin Global AI Translator"
BUNDLE_ID="dev.swiftin.translator.safari"
mkdir -p "$OUT"
rm -rf "$PROJECT"

command -v xcrun >/dev/null || { echo 'ERROR: Run this script on macOS with Xcode installed.' >&2; exit 2; }
xcrun safari-web-extension-converter "$ROOT" \
  --project-location "$PROJECT" \
  --app-name "$APP_NAME" \
  --bundle-identifier "$BUNDLE_ID" \
  --no-prompt

PROJ=$(find "$PROJECT" -maxdepth 1 -name '*.xcodeproj' -print -quit)
[ -n "$PROJ" ] || { echo 'ERROR: Xcode project was not generated.' >&2; exit 3; }
SCHEME=$(xcodebuild -list -json -project "$PROJ" | python3 -c 'import json,sys; d=json.load(sys.stdin); print(d["project"]["schemes"][0])')
xcodebuild -project "$PROJ" -scheme "$SCHEME" -configuration Release \
  -destination 'platform=macOS' -derivedDataPath "$OUT/DerivedData" \
  CODE_SIGNING_ALLOWED=YES CODE_SIGN_IDENTITY='-' build
APP=$(find "$OUT/DerivedData/Build/Products/Release" -maxdepth 1 -name '*.app' -print -quit)
[ -n "$APP" ] || { echo 'ERROR: App bundle not found after build.' >&2; exit 4; }
# Ad-hoc signing is suitable for local testing, not public distribution/notarization.
codesign --force --deep --sign - "$APP"
mkdir -p "$OUT/dmg-root"
rm -rf "$OUT/dmg-root"/*
cp -R "$APP" "$OUT/dmg-root/"
ln -s /Applications "$OUT/dmg-root/Applications"
hdiutil create -volname "$APP_NAME" -srcfolder "$OUT/dmg-root" -ov -format UDZO "$OUT/Swiftin-Safari-macOS.dmg"
echo "BUILD SUCCESS: $OUT/Swiftin-Safari-macOS.dmg"
