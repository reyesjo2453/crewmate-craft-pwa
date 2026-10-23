# Crewmate Craft: Tycoon & Obby

A self-contained, portrait-first Canvas PWA. No dependencies at runtime, external assets, ads, analytics, accounts or paid purchases. Procedural Canvas characters and Web Audio sounds; all progress is stored locally.

## Play

Serve this folder over HTTPS (or localhost). On iPhone, use Safari → Share → Add to Home Screen. Open online once, wait for the service worker to finish installing, then play offline. The runtime creates a 180px PNG Apple Touch Icon; the manifest has an inline-vector source icon. iOS Home Screen behavior should be checked on a physical iPhone.

Drag anywhere on the left side to move. Tap the large right button to jump, use vents, or fix a nearby bot/reactor. Keyboard: arrows/WASD and Space. Green pads buy upgrades automatically; the purple portal opens the obby. Checkpoints occur every three islands. Return home at any time. Pets boost coins; diamonds are treasure trophies. Settings offers a three-second hold to reset.

## GitHub Pages deployment

The workflow deploys the `main` branch using GitHub Actions. If automatic Pages enablement is denied, open **Settings → Pages → Build and deployment → Source → GitHub Actions**, then run **Actions → Deploy game to GitHub Pages → Run workflow**.

With a GitHub login permitted to create public repositories:

```sh
gh auth login
gh repo create crewmate-craft-pwa --public --source=. --remote=origin
git push -u origin main
```

Repository: https://github.com/reyesjo2453/crewmate-craft-pwa

Pages URL: https://reyesjo2453.github.io/crewmate-craft-pwa/

Never place credentials in this folder.

## Local verification

```sh
python3 -m http.server 8000 --bind 127.0.0.1
node --check game.js
node --check sw.js
# In a separate terminal, with Playwright installed:
node tests/smoke.cjs
node tests/progression.cjs
```

Tests use local Chromium at `/usr/bin/chromium`; change that executable path for your machine. Smoke coverage includes real pointer input and cancellation, portal travel, jump, return home, save reload, phone viewport resizing, offline reload and browser exceptions. Screenshots live in `tests/`. This is Chromium verification, not physical iOS Safari certification or a guaranteed 60fps benchmark. Rendering uses requestAnimationFrame with a capped device pixel ratio and delta time.

## Files

`index.html`, `style.css`, `game.js`, `manifest.json`, `sw.js` are the complete app. Bump the cache version in `sw.js` when shipping updates. Progress autosaves every two seconds and on page hide. Storage failure displays a notice and allows play to continue; private browsing/cleared website data can remove progress. Timers pause in menus; background frame time is capped.
