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
  const evaluate = async expression => {
    const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (result.exceptionDetails) throw Error(result.exceptionDetails.text + ' ' + result.exceptionDetails.exception?.description);
    return result.result.value;
  };
  const assert = (value, message) => { if(!value) throw Error(message); };
  for (const [name, width, height] of [['iphone',393,852],['small',320,740],['tablet',760,1024],['desktop',1774,1000]]) {
    await send('Emulation.setDeviceMetricsOverride', {width,height,deviceScaleFactor:1,mobile: name !== 'desktop'});
    await send('Page.navigate',{url:'http://127.0.0.1:8000'});
    await delay(1600);
    await evaluate('document.fonts.ready');
    await evaluate(`document.querySelector('.landing-hero__visual img').decode()`);
    const layout = await evaluate(`(() => { const hero = document.querySelector('.landing-hero__visual img').getBoundingClientRect(); const nav = getComputedStyle(document.querySelector('.landing-header__nav')); return {imageTop:hero.top,imageBottom:hero.bottom,imageHeight:hero.height,navVisible:nav.display !== 'none',overflow:document.documentElement.scrollWidth>innerWidth+1}; })()`);
    assert(!layout.overflow,'Horizontal page overflow '+name);
    if(name !== 'desktop') {
      assert(layout.imageTop > 72 && layout.imageBottom < height && layout.imageHeight > 180,'Hero artwork not in first screen '+name);
      assert(!layout.navVisible,'Mobile nav still visible');
    } else assert(layout.navVisible,'Desktop navigation disappeared');
    const shot = await send('Page.captureScreenshot',{format:'png'});
    fs.writeFileSync(path.join(root,`hero-menu-${name}.png`),Buffer.from(shot.data,'base64'));
    if(name === 'desktop'){console.log(name,layout);continue;}
    await evaluate(`document.querySelector('.landing-header__menu-toggle').click()`);
    await delay(300);
    assert(await evaluate(`document.querySelector('.landing-mobile-menu__panel').getBoundingClientRect().left === 0 && document.body.style.overflow === 'hidden' && document.querySelector('.landing-header__menu-toggle').getAttribute('aria-expanded') === 'true'`),'Drawer not open at left');
    const drawerShot = await send('Page.captureScreenshot',{format:'png'});
    fs.writeFileSync(path.join(root,`left-menu-${name}.png`),Buffer.from(drawerShot.data,'base64'));
    await evaluate(`document.querySelector('.landing-mobile-menu__create').focus(); document.dispatchEvent(new KeyboardEvent('keydown',{key:'Tab',bubbles:true}));`);
    assert(await evaluate(`document.activeElement.getAttribute('aria-label') === 'Đóng menu'`),'Drawer focus trap failed');
    await evaluate(`document.querySelector('.landing-mobile-menu a[href="#templates"]').click()`);
    await delay(650);
    assert(await evaluate(`!document.querySelector('.landing-mobile-menu') && document.body.style.overflow !== 'hidden' && document.querySelector('.landing-header__menu-toggle').getAttribute('aria-expanded') === 'false'`),'Drawer navigation did not close');
    assert(await evaluate(`Math.abs(document.querySelector('#templates').getBoundingClientRect().top) < 160`),'Drawer navigation failed');
    await evaluate(`window.scrollTo(0,0); document.querySelector('.landing-header__menu-toggle').click()`);
    await delay(280);
    await evaluate(`document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));`);
    await delay(100);
    assert(await evaluate(`!document.querySelector('.landing-mobile-menu')`),'Escape did not close drawer');
    await evaluate(`document.querySelector('.landing-header__menu-toggle').click()`);
    await delay(280);
    await evaluate(`document.querySelector('.landing-mobile-menu__actions button:first-child').click()`);
    await delay(200);
    assert(await evaluate(`!!document.querySelector('.auth-modal') && !document.querySelector('.landing-mobile-menu')`),'Login action failed');
    await evaluate(`document.querySelector('.auth-modal__close').click()`);
    await delay(100);
    assert(await evaluate(`document.body.style.overflow !== 'hidden'`),'Body remained locked after login close');
    console.log(name, layout, 'left drawer, focus trap, navigation, Escape, login and scroll restoration passed');
  }
  await send('Browser.close');
})().catch(e => { console.error(e.message); process.exitCode = 1; }).finally(() => { socket?.close(); chrome.kill(); });
