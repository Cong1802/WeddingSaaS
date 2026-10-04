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
  for (const [name, width, height] of [['small', 320, 740], ['mobile', 390, 844], ['large-phone', 430, 932], ['tablet', 768, 1024], ['tablet-wide', 1024, 768], ['laptop', 1366, 900], ['desktop', 1920, 1080]]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 768 });
    await send('Page.navigate', { url: 'http://127.0.0.1:8000' });
    await delay(1800);
    await send('Runtime.evaluate', { expression: 'document.fonts.ready', awaitPromise: true });
    const result = await send('Runtime.evaluate', { returnByValue: true, expression: `JSON.stringify((() => { const r = s => document.querySelector(s).getBoundingClientRect(); const footer = r('.wedding-faq'); return { width: innerWidth, documentWidth: document.documentElement.scrollWidth, footerHeight: footer.height, top: footer.top + scrollY, links: document.querySelectorAll('.wedding-faq a').length }; })())` });
    console.log(name, result.result.value);
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, Math.max(0, document.querySelector('.wedding-faq').offsetTop))` });
    await delay(250);
    const footerRect = JSON.parse(result.result.value);
    const interactions = await send('Runtime.evaluate', { returnByValue: true, awaitPromise: true, expression: `(async () => { const tick = () => new Promise(r => requestAnimationFrame(r)); const buttons = [...document.querySelectorAll('.wedding-faq__item h3 button')]; const firstInitiallyOpen = buttons[0].getAttribute('aria-expanded') === 'true'; buttons[1].click(); await tick(); const secondOpened = buttons[1].getAttribute('aria-expanded') === 'true' && buttons[0].getAttribute('aria-expanded') === 'false'; buttons[1].click(); await tick(); const closedAgain = buttons[1].getAttribute('aria-expanded') === 'false'; buttons[0].click(); await tick(); const contactWorks = !!document.querySelector('.wedding-faq__support a').getAttribute('href'); const footerLinkWorks = !!document.querySelector('.site-footer a[href="#faq"]'); return { firstInitiallyOpen, secondOpened, closedAgain, contactWorks, footerLinkWorks }; })()` });
    console.log(name, 'interactions', interactions.result.value);
    if (!Object.values(interactions.result.value).every(Boolean)) throw new Error('FAQ check failed');
    const layout = await send('Runtime.evaluate', { returnByValue: true, awaitPromise: true, expression: `(async () => { const tick = () => new Promise(r => requestAnimationFrame(r)); const cards = [...document.querySelectorAll('.wedding-reviews__card')]; const visibleCards = cards.filter(e => getComputedStyle(e).display !== 'none').length; const before = document.querySelector('.wedding-reviews__card.is-active h3').textContent; document.querySelector('.wedding-reviews__arrow--right').click(); await tick(); const nextWorks = before !== document.querySelector('.wedding-reviews__card.is-active h3').textContent; const favorite = document.querySelector('.wedding-reviews__card.is-active .wedding-reviews__card-bottom button'); favorite.click(); await tick(); const favoriteWorks = favorite.getAttribute('aria-pressed') === 'true'; const escaped = [...document.querySelectorAll('.wedding-reviews *, .wedding-faq *')].filter(e => { const r = e.getBoundingClientRect(); return r.width && (r.left < -1 || r.right > innerWidth + 1); }).map(e => e.className); return { visibleCards, nextWorks, favoriteWorks, escaped }; })()` });
    console.log(name, 'layout', layout.result.value);
    if (!layout.result.value.nextWorks || !layout.result.value.favoriteWorks || layout.result.value.escaped.length) throw new Error('Responsive check failed');
    const review = await send('Runtime.evaluate', {returnByValue: true, expression: `(() => {const r = document.querySelector('.wedding-reviews').getBoundingClientRect(); return {top:r.top + scrollY,height:r.height};})()`});
    await send('Runtime.evaluate', {expression: `document.querySelectorAll('.wedding-reviews img, .wedding-faq img').forEach(img => img.loading = 'eager'); Promise.all([...document.querySelectorAll('.wedding-reviews img, .wedding-faq img')].map(img => img.decode().catch(() => {})))`, awaitPromise:true});
    const reviewCapture = await send('Page.captureScreenshot', {format:'png',captureBeyondViewport:true,clip:{x:0,y:review.result.value.top,width,height:review.result.value.height,scale:1}});
    fs.writeFileSync(path.join(root, `responsive-reviews-${name}.png`), Buffer.from(reviewCapture.data, 'base64'));
    const capture = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: footerRect.top, width, height: footerRect.footerHeight, scale: 1 } });
    fs.writeFileSync(path.join(root, `responsive-faq-${name}.png`), Buffer.from(capture.data, 'base64'));
  }
  await send('Browser.close');
})().catch(e => { console.error(e.message); process.exitCode = 1; }).finally(() => { socket?.close(); chrome.kill(); });
