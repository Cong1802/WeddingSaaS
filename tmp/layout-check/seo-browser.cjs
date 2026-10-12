const { spawn } = require('node:child_process');
const path = require('node:path');
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--disable-gpu', '--no-first-run', '--remote-debugging-port=9238', `--user-data-dir=${path.join(__dirname, 'profile-seo')}`, 'about:blank'], { windowsHide: true, stdio: 'ignore' });
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
let socket;
(async () => {
  let tabs;
  for (let i = 0; i < 80; i++) {
    try { tabs = await (await fetch('http://127.0.0.1:9238/json')).json(); if (tabs.length) break; } catch {}
    await delay(250);
  }
  socket = new WebSocket(tabs.find(tab => tab.type === 'page').webSocketDebuggerUrl);
  await new Promise(resolve => socket.addEventListener('open', resolve, { once: true }));
  let id = 0;
  const pending = new Map();
  const exceptions = [];
  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params.exceptionDetails.text);
    if (pending.has(message.id)) { pending.get(message.id)(message.result); pending.delete(message.id); }
  });
  const send = (method, params = {}) => new Promise(resolve => { const next = ++id; pending.set(next, resolve); socket.send(JSON.stringify({ id: next, method, params })); });
  const evaluate = async expression => {
    const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    return result.result.value;
  };
  const assert = (condition, message) => { if (!condition) throw Error(message); };
  await send('Runtime.enable');
  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 393, height: 852, deviceScaleFactor: 1, mobile: true });
  await send('Page.navigate', { url: 'http://127.0.0.1:8000/' });
  let ready = false;
  for (let i = 0; i < 120; i++) {
    ready = await evaluate(`(() => { const button = document.querySelector('.landing-header__menu-toggle'); return !!button && Object.keys(button).some(key => key.startsWith('__reactProps')); })()`);
    if (ready) break;
    await delay(250);
  }
  assert(ready, 'React did not become interactive');
  assert(exceptions.length === 0, 'Browser exceptions: ' + exceptions.join(', '));
  const seo = await evaluate(`({title:document.title,lang:document.documentElement.lang,canonical:document.querySelector('link[rel="canonical"]').href,h1:document.querySelectorAll('h1').length,overflow:document.documentElement.scrollWidth>innerWidth+1,images:[...document.querySelectorAll('.landing-hero img')].map(img=>img.complete&&img.naturalWidth>0)})`);
  assert(seo.lang === 'vi' && seo.h1 === 1 && seo.canonical === 'https://weddingsaas.online/' && !seo.overflow, 'Landing SEO/layout failed');
  await evaluate(`document.querySelector('.landing-header__menu-toggle').click()`);
  await delay(600);
  const menu = await evaluate(`({left:document.querySelector('.landing-mobile-menu__panel').getBoundingClientRect().left,expanded:document.querySelector('.landing-header__menu-toggle').getAttribute('aria-expanded'),overflow:document.body.style.overflow})`);
  assert(menu.left >= 0 && menu.left < 393 && menu.expanded === 'true' && menu.overflow === 'hidden', 'Menu failed: ' + JSON.stringify(menu));
  await evaluate(`document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}))`);
  await delay(200);
  assert(await evaluate(`document.querySelector('.landing-header__menu-toggle').getAttribute('aria-expanded')==='false' && document.body.style.overflow!=='hidden'`), 'Menu did not close');
  await evaluate(`document.querySelector('.landing-header__nav a[href="/templates"]').click()`);
  await delay(500);
  assert(await evaluate(`location.pathname==='/templates' && document.querySelector('meta[name="robots"]').content==='noindex, follow' && !document.querySelector('link[rel="canonical"]')`), 'SPA metadata did not update');
  console.log(JSON.stringify({ seo, menu, exceptions, navigation: 'passed' }));
  await send('Browser.close');
})().catch(error => { console.error(error.message); process.exitCode = 1; }).finally(() => { socket?.close(); chrome.kill(); });
