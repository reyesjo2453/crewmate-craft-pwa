const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8000');await page.waitForFunction(()=>document.documentElement.dataset.offline==='ready');
 assert(await page.locator('#apple-icon').getAttribute('href').then(s=>s.startsWith('data:image/png')));
 await page.click('#play');await page.screenshot({path:'tests/iphone-hub.png'});
 await page.click('#locker');assert.equal(await page.locator('#items button').count(),6);await page.click('[data-tab="pets"]');assert.equal(await page.locator('#items button').count(),4);await page.click('#close-shop');
 // Actual pointer capture and release, including cancellation path.
 await page.mouse.move(90,500);await page.mouse.down();await page.mouse.move(110,480);await page.dispatchEvent('#game','pointercancel',{pointerId:1});await page.mouse.up();
 await page.keyboard.down('ArrowUp');await page.waitForTimeout(1600);await page.keyboard.up('ArrowUp');
 await page.keyboard.down('ArrowRight');await page.waitForTimeout(1350);await page.keyboard.up('ArrowRight');
 await page.waitForTimeout(300);assert.match(await page.locator('#mode').textContent(),/OBBY/);
 await page.locator('#action').dispatchEvent('pointerdown');await page.screenshot({path:'tests/iphone-obby.png'});
 await page.click('#home');assert.match(await page.locator('#mode').textContent(),/BASE/);
 await page.waitForTimeout(2200);const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('crewmate-craft-v1')));assert(saved.coins>=50);
 await page.reload();await page.click('#play');assert.equal(await page.locator('#coins').textContent(),Math.floor(saved.coins).toLocaleString());
 for(const size of [{width:320,height:568},{width:430,height:932},{width:844,height:390}]){await page.setViewportSize(size);await page.waitForTimeout(100);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),size.width);}
 await context.setOffline(true);await page.reload();await page.waitForSelector('#play');await page.click('#play');assert(await page.locator('#game').isVisible());
 assert.deepEqual(errors,[]);console.log('PASS: icon, UI, touch cancellation, movement, portal, jump, home, persistence, resize, offline; no browser exceptions.');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
