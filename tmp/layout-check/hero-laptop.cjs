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
  for (const [name, width, height] of [['small-laptop', 1130, 900]]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: name === 'mobile' });
    await send('Page.navigate', { url: 'http://127.0.0.1:8000' });
    await delay(1800);
    await send('Runtime.evaluate', { expression: 'document.fonts.ready', awaitPromise: true });
    await send('Runtime.evaluate', {expression: `document.querySelector('.landing-intro').scrollIntoView(); document.querySelectorAll('.landing-intro img').forEach(img => img.loading = 'eager'); Promise.all([...document.querySelectorAll('.landing-intro img')].map(img => img.decode().catch(() => {})))`, awaitPromise:true});
    const result = await send('Runtime.evaluate', {returnByValue:true,expression:`(() => {const section = document.querySelector('.landing-intro'); const r = section.getBoundingClientRect(); const escaped = [...section.querySelectorAll('h1, h2, p, button, .landing-hero__badge, .why-us__badge')].filter(e => { const b=e.getBoundingClientRect(); return b.width && (b.left < -1 || b.right > innerWidth + 1); }).map(e=>e.className); return {top:r.top+scrollY,height:r.height,escaped,cards:section.querySelectorAll('article').length};})()`});
    console.log(name, result.result.value);
    if(result.result.value.escaped.length) throw Error('Features layout failed');
    const capture = await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:{x:0,y:result.result.value.top,width,height:result.result.value.height,scale:1}});
    fs.writeFileSync(path.join(root, `intro-${name}.png`),Buffer.from(capture.data,'base64'));
  }
  await send('Browser.close');
})().catch(e => { console.error(e.message); process.exitCode = 1; }).finally(() => { socket?.close(); chrome.kill(); });
