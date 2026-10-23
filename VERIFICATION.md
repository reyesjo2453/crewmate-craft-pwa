# Verification report

- `node --check game.js` and `node --check sw.js`: passed.
- Chromium phone smoke: passed. Covers dynamic Apple icon, locker, real pointer input/cancellation, keyboard movement, portal entry, jump, return home, local save reload, 320×568 / 390×844 / 430×932 / 844×390 viewports, and offline reload after service worker activation. No browser exceptions.
- Deterministic simulation suite: passed. Covers all five dropper tiers, three conveyor speed upgrades, walls, turret, hatchery, pet purchase, sabotage, three-tap rescue, checkpoint recovery, vent shortcut, treasure payout. Simulation controls are injected only by the test runner and are absent from production.
- Screenshots: `tests/iphone-hub.png`, `tests/iphone-obby.png`.
- Physical iOS Safari and sustained device performance: not tested in this environment. The renderer targets the display refresh rate using requestAnimationFrame; actual fps depends on the phone.
- GitHub repository creation: attempted using the requested command; GitHub returned `GraphQL: Resource not accessible by integration (createRepository)`. No remote repository or live Pages URL was created. Local `main` commit and deployment workflow are ready.
