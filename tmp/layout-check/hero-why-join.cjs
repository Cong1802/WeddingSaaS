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
  for (const [name, width, height] of [['mobile', 390, 844], ['desktop', 1920, 1080]]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: name === 'mobile' });
    await send('Page.navigate', { url: 'http://127.0.0.1:8000' });
    await delay(1800);
    await send('Runtime.evaluate', { expression: 'document.fonts.ready', awaitPromise: true });
    await send('Runtime.evaluate',{expression:`document.querySelectorAll('.landing-page img').forEach(img=>img.loading='eager'); Promise.all([...document.querySelectorAll('.landing-page img')].map(img=>img.decode().catch(()=>{})))`,awaitPromise:true});
    const result = await send('Runtime.evaluate',{returnByValue:true,expression:`(() => { const sections=[...document.querySelectorAll('.landing-intro > section, .landing-flow > section, .landing-finale > section, .site-footer')]; return sections.map(e=>{const r=e.getBoundingClientRect(),c=getComputedStyle(e);return {id:e.id||'footer',top:r.top+scrollY,bottom:r.bottom+scrollY,height:r.height,paddingTop:c.paddingTop,paddingBottom:c.paddingBottom};}); })()`});
    console.log(name,JSON.stringify(result.result.value));
    const gaps=result.result.value.slice(1).map((s,i)=>s.top-result.result.value[i].bottom); if(gaps.some(g=>Math.abs(g)>1)) throw Error('Section gap');
    const overflow=await send('Runtime.evaluate',{returnByValue:true,expression:'document.documentElement.scrollWidth > innerWidth'}); if(overflow.result.value) throw Error('Horizontal overflow');
    const stage = process.argv[2] || 'before';
    for(const section of result.result.value.filter(section => section.id === 'whyus')) {
      const capture=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:{x:0,y:Math.max(0,section.top-300),width,height:650,scale:1}});
      fs.writeFileSync(path.join(root,`join-${stage}-${name}-${section.id}.png`),Buffer.from(capture.data,'base64'));
    }
  }
  await send('Browser.close');
})().catch(e => { console.error(e.message); process.exitCode = 1; }).finally(() => { socket?.close(); chrome.kill(); });
