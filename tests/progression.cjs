const {chromium}=require('playwright');const assert=require('node:assert/strict');const fs=require('node:fs');
(async()=>{
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});const page=await browser.newPage({viewport:{width:390,height:844}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
// Test-only instrumentation exposes simulation controls; production has no cheats/API.
const hook=`window.testGame={step(seconds){for(let i=0;i<seconds*60;i++)update(1/60)},move(x,y){player.x=x;player.y=y},snapshot(){return {state:JSON.parse(JSON.stringify(state)),mode,checkpoint,bot:!!bot,pausedBelt,mini:!!mini,x:player.x,y:player.y}},pads(){return pads.map(p=>({x:p.x,y:p.y,key:p.key}))},enter:enterObby};`;
await page.route('**/game.js',r=>r.fulfill({contentType:'application/javascript',body:fs.readFileSync('game.js','utf8').replace(/\}\)\(\);\s*$/,hook+'})();')}));
await page.addInitScript(()=>localStorage.setItem('crewmate-craft-v1',JSON.stringify({coins:100000,owned:['Red','Space Sprout','Baby Slime Cube']})));
await page.goto('http://127.0.0.1:8000');await page.click('#play');
for(const p of await page.evaluate(()=>testGame.pads()))await page.evaluate(p=>{testGame.move(p.x,p.y);testGame.step(7)},p);
let snap=await page.evaluate(()=>testGame.snapshot());assert.equal(snap.state.level,4);assert.equal(snap.state.speed,3);for(const key of ['walls','turret','hatchery'])assert.equal(snap.state[key],1);
await page.click('#locker');await page.click('[data-tab="pets"]');await page.locator('#items button').nth(2).click();await page.click('#close-shop');assert.equal((await page.evaluate(()=>testGame.snapshot())).state.pet,'Golden Dragon Cube');
await page.evaluate(()=>{testGame.move(242,210);testGame.step(55)});assert((await page.evaluate(()=>testGame.snapshot())).bot);await page.locator('#action').dispatchEvent('pointerdown');assert(await page.locator('#challenge').isVisible());for(let i=0;i<3;i++)await page.click('#bonk');assert(!(await page.evaluate(()=>testGame.snapshot())).bot);assert.match(await page.locator('#toast').textContent(),/Bot bonked/);
await page.evaluate(()=>{testGame.enter();testGame.move(330,259);testGame.step(.1)});assert.equal((await page.evaluate(()=>testGame.snapshot())).checkpoint,3);
await page.evaluate(()=>{testGame.move(40,180);testGame.step(.1)});assert.equal((await page.evaluate(()=>testGame.snapshot())).y,259);
await page.evaluate(()=>{testGame.move(165,-101);testGame.step(.1)});await page.locator('#action').dispatchEvent('pointerdown');snap=await page.evaluate(()=>testGame.snapshot());assert.equal(snap.y,-245);assert.equal(snap.checkpoint,9);
const before=snap.state.gems;await page.evaluate(()=>{testGame.move(165,-389);testGame.step(.1)});snap=await page.evaluate(()=>testGame.snapshot());assert.equal(snap.mode,'hub');assert.equal(snap.state.gems,before+25);assert.deepEqual(errors,[]);console.log('PASS: every tycoon upgrade, pet purchase, sabotage/rescue, checkpoint recovery, vent shortcut, treasure payout.');await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
