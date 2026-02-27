#!/bin/bash
# Post-process web export for demo:
# 1. Patch import.meta.env (Zustand devtools crash)
# 2. Add phone frame wrapper
# 3. Copy MSW service worker

DIST="$1"
if [ -z "$DIST" ]; then echo "Usage: $0 <dist-dir>"; exit 1; fi

# 1. Patch import.meta.env in JS bundle
for f in "$DIST"/_expo/static/js/web/entry-*.js; do
  sed -i '' 's/import\.meta\.env?import\.meta\.env\.MODE:void 0/{MODE:"production"}?{MODE:"production"}.MODE:void 0/g' "$f"
  echo "Patched import.meta.env in $(basename $f)"
done

# 2. Copy MSW service worker
if [ -f "public/mockServiceWorker.js" ]; then
  cp public/mockServiceWorker.js "$DIST/"
  echo "Copied mockServiceWorker.js"
fi

# 3. Add phone frame to all HTML files
for f in $(find "$DIST" -name '*.html' -not -path '*/_expo/*'); do
  # Inject phone frame CSS + wrapper into <head> and <body>
  sed -i '' 's|<style id="expo-reset">#root,body,html{height:100%}body{overflow:hidden}#root{display:flex}</style>|<style id="expo-reset">#root,body,html{height:100%}body{overflow:hidden;background:#1a1a2e;display:flex;align-items:center;justify-content:center;margin:0}#root{display:flex;width:402px;height:874px;border-radius:44px;overflow:hidden;box-shadow:0 0 0 12px #2d2d3f,0 0 0 14px #444,0 20px 60px rgba(0,0,0,0.6);position:relative}@media(max-width:430px){body{background:none}#root{width:100%;height:100%;border-radius:0;box-shadow:none}}</style><style id="demo-bar">.demo-bar{position:fixed;top:16px;left:50%;transform:translateX(-50%);z-index:9999;display:flex;gap:8px;font-family:-apple-system,sans-serif;font-size:13px}.demo-bar a{color:#aaa;background:#2d2d3f;padding:6px 14px;border-radius:20px;text-decoration:none;transition:all .2s}.demo-bar a:hover,.demo-bar a.active{color:#fff;background:#39FF14;color:#000}@media(max-width:430px){.demo-bar{top:4px;font-size:11px}.demo-bar a{padding:4px 10px}}</style>|' "$f"

  # Add theme switcher bar before root div
  sed -i '' 's|<div id="root">|<div class="demo-bar"><a href="/atletika--mvp/" id="link-obs">Obsidian</a><a href="/atletika--mvp/?theme=kinetic" id="link-kin">Kinetic</a></div><div id="root">|' "$f"
done
echo "Patched $(find "$DIST" -name '*.html' -not -path '*/_expo/*' | wc -l | tr -d ' ') HTML files with phone frame"

echo "Done!"
