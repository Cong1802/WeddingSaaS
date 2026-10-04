const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--disable-gpu', '--no-first-run', '--remote-debugging-port=9227', `--user-data-dir=${path.join(root, 'profile')}`, 'about:blank'], { windowsHide: true, stdio: 'ignore' });
const delay = ms => new Promise(r => setTimeout(r, ms));
let socket;
(async () => {
  let tabs;
  for (let i = 0; i < 40; i++) {
    try { tabs = await (await fetch('http://127.0.0.1:9227/json')).json(); if (tabs.length) break; } catch {}
    await delay(250);
  }
  socket = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => socket.addEventListener('open', r, { once: true }));
  let id = 0;
  const pending = new Map();
  socket.addEventListener('message', e => { const msg = JSON.parse(e.data); if (pending.has(msg.id)) { const { resolve, reject } = pending.get(msg.id); pending.delete(msg.id); if (msg.error) reject(Error(JSON.stringify(msg.error))); else resolve(msg.result); } });
  const send = (method, params = {}) => new Promise((resolve, reject) => { const next = ++id; pending.set(next, { resolve, reject }); socket.send(JSON.stringify({ id: next, method, params })); });
  await send('Page.enable');
  for (const [name, width, height] of [['desktop', 1920, 1080], ['mobile', 390, 844]]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: name === 'mobile' });
    await send('Page.navigate', { url: 'http://127.0.0.1:8000' });
    await delay(1800);
    await send('Runtime.evaluate', { expression: 'document.fonts.ready', awaitPromise: true });
    const result = await send('Runtime.evaluate', { returnByValue: true, expression: `JSON.stringify((() => { const r = s => document.querySelector(s).getBoundingClientRect(); const footer = r('.wedding-reviews'); return { width: innerWidth, documentWidth: document.documentElement.scrollWidth, footerHeight: footer.height, top: footer.top + scrollY, links: document.querySelectorAll('.wedding-reviews a').length }; })())` });
    console.log(name, result.result.value);
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, Math.max(0, document.querySelector('.wedding-reviews').offsetTop))` });
    await delay(250);
    const footerRect = JSON.parse(result.result.value);
    const interactions = await send('Runtime.evaluate', { returnByValue: true, awaitPromise: true, expression: `(async () => { const tick = () => new Promise(r => requestAnimationFrame(r)); const name = () => document.querySelector('.wedding-reviews__card.is-active h3').textContent; const before = name(); document.querySelector('.wedding-reviews__arrow--right').click(); await tick(); const nextWorks = name() !== before; const favorite = document.querySelector('.wedding-reviews__card.is-active .wedding-reviews__card-bottom button'); favorite.click(); await tick(); const favoriteWorks = favorite.getAttribute('aria-pressed') === 'true'; document.querySelector('.wedding-reviews__dots button').click(); await tick(); const dotWorks = document.querySelector('.wedding-reviews__dots button').getAttribute('aria-pressed') === 'true'; return { nextWorks, favoriteWorks, dotWorks }; })()` });
    console.log(name, 'interactions', interactions.result.value);
    if (!Object.values(interactions.result.value).every(Boolean)) throw new Error('Carousel check failed');
    const capture = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: footerRect.top, width, height: footerRect.footerHeight, scale: 1 } });
    fs.writeFileSync(path.join(root, `reviews-${name}.png`), Buffer.from(capture.data, 'base64'));
  }
  await send('Browser.close');
})().catch(e => { console.error(e.message); process.exitCode = 1; }).finally(() => { socket?.close(); chrome.kill(); });
