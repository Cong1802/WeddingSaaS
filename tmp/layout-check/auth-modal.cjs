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
  for (const [name, width, height] of [['desktop', 1748, 900], ['mobile', 390, 844], ['small', 320, 740]]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: name !== 'desktop' });
    await send('Page.navigate', { url: 'http://127.0.0.1:8000' });
    await delay(1600);
    await evaluate(`localStorage.removeItem('auth_token'); location.reload();`);
    await delay(1200);
    await evaluate(`[...document.querySelectorAll('.landing-header button')].find(button => button.textContent.trim() === 'Đăng nhập').click()`);
    await delay(300);
    await evaluate('document.fonts.ready');
    await evaluate(`Promise.all([...document.querySelectorAll('.auth-modal img')].map(image => image.decode().catch(() => {})))`);
    const layout = await evaluate(`(() => { const modal = document.querySelector('.auth-modal'); const r = modal.getBoundingClientRect(); return { width: r.width, height: r.height, left: r.left, right: r.right, top: r.top, bottom: r.bottom, overflow: modal.scrollWidth > modal.clientWidth + 1, focus: document.activeElement.id }; })()`);
    if(layout.left < 0 || layout.right > width || layout.top < 0 || layout.bottom > height || layout.overflow) throw Error('Modal overflows ' + name);
    console.log(name, layout);
    const shot = await send('Page.captureScreenshot', {format:'png'});
    fs.writeFileSync(path.join(root, `auth-${name}.png`), Buffer.from(shot.data, 'base64'));
    await evaluate(`window.__authCalls = []; window.fetch = async (url, options = {}) => { window.__authCalls.push({url, body: options.body ? JSON.parse(options.body) : null}); return {ok:false, json: async () => ({success:false,message:'Thông tin đăng nhập không đúng.'})}; };`);
    await evaluate(`document.querySelector('.auth-modal__password-toggle').click()`);
    if(await evaluate(`document.querySelector('#auth-password').type`) !== 'text') throw Error('Password toggle failed');
    await evaluate(`document.querySelector('.auth-modal__tabs button:last-child').click()`);
    if(!await evaluate(`!!document.querySelector('#auth-name') && document.querySelector('#auth-password').type === 'password'`)) throw Error('Register tab failed');
    await evaluate(`(() => { const change = (id, value) => { const input = document.getElementById(id); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, value); input.dispatchEvent(new Event('input', {bubbles:true})); }; change('auth-name','Khách Kiểm Tra'); change('auth-email','layout-test@example.com'); change('auth-password','layout-test-password'); })()`);
    await delay(100);
    await evaluate(`document.querySelector('.auth-modal__form').requestSubmit()`);
    await delay(150);
    if(!await evaluate(`window.__authCalls[0]?.url === '/api/auth/register' && window.__authCalls[0]?.body.name === 'Khách Kiểm Tra' && !!document.querySelector('[role=alert]')`)) throw Error('Registration payload or error display failed');
    await evaluate(`document.querySelector('.auth-modal__demo').click()`);
    await delay(150);
    if(!await evaluate(`window.__authCalls.at(-1)?.url === '/api/auth/login' && window.__authCalls.at(-1)?.body.email === 'admin@example.com'`)) throw Error('Demo admin credentials failed');
    await evaluate(`document.querySelector('.auth-modal__google').click()`);
    await delay(150);
    if(!await evaluate(`window.__authCalls.at(-1)?.url === '/api/auth/google'`)) throw Error('Google action failed');
    await evaluate(`document.querySelector('.auth-modal__demo').focus(); document.dispatchEvent(new KeyboardEvent('keydown',{key:'Tab',bubbles:true}));`);
    if(!await evaluate(`document.activeElement.classList.contains('auth-modal__close')`)) throw Error('Focus trap failed');
    await evaluate(`document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));`);
    await delay(100);
    if(await evaluate(`!!document.querySelector('.auth-modal') || document.body.style.overflow === 'hidden'`)) throw Error('Escape or scroll restoration failed');
    console.log(name, 'form payloads, errors, Google action, demo admin, password visibility, focus trap and Escape passed');
  }
  await send('Browser.close');
})().catch(e => { console.error(e.message); process.exitCode = 1; }).finally(() => { socket?.close(); chrome.kill(); });
