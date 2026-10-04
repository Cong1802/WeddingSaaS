const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--disable-gpu', '--no-first-run', '--remote-debugging-port=9238', `--user-data-dir=${path.join(root, 'profile-auth-security')}`, 'about:blank'], { windowsHide: true, stdio: 'ignore' });
const delay = ms => new Promise(r => setTimeout(r, ms));
let socket;
(async () => {
  let tabs;
  for (let i = 0; i < 40; i++) {
    try { tabs = await (await fetch('http://127.0.0.1:9238/json')).json(); if (tabs.length) break; } catch {}
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

  await send('Page.navigate', { url: 'http://127.0.0.1:8000/?reset_token=ui-test-token&reset_email=ui-test%40example.com' });
  await delay(1800);
  if (!await evaluate("!!document.querySelector('#auth-confirm-password') && document.querySelector('#auth-email').value === 'ui-test@example.com' && !location.search.includes('reset_token')")) throw Error('Reset link UI initialization failed');
  await evaluate(`window.__authCalls = []; window.fetch = async (url, options = {}) => { window.__authCalls.push({url,body:options.body ? JSON.parse(options.body) : null}); return {ok:true,json:async()=>({success:true,message:'Done'})}; };`);
  const fill = async (id, value) => {
    await evaluate(`(() => { const input = document.getElementById(${JSON.stringify(id)}); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,${JSON.stringify(value)}); input.dispatchEvent(new Event('input',{bubbles:true})); })()`);
    await delay(100);
  };
  await fill('auth-password','newPassword12345');
  await fill('auth-confirm-password','newPassword12345');
  await evaluate("document.querySelector('.auth-modal__form').requestSubmit()");
  await delay(250);
  if (!await evaluate("window.__authCalls.at(-1)?.url === '/api/auth/reset-password' && window.__authCalls.at(-1)?.body.token === 'ui-test-token' && !document.querySelector('#auth-confirm-password')")) throw Error('Reset submission failed');
  await evaluate("document.querySelector('.auth-modal__forgot').click()");
  await delay(100);
  if (await evaluate("!!document.querySelector('#auth-password')")) throw Error('Forgot form still requires password');
  await fill('auth-email','ui-test@example.com');
  await evaluate("document.querySelector('.auth-modal__form').requestSubmit()");
  await delay(150);
  if (!await evaluate("window.__authCalls.at(-1)?.url === '/api/auth/forgot-password' && !!document.querySelector('[role=status]')")) throw Error('Forgot submission failed');
  console.log('PASS: reset-link initialization, token removal from URL, reset payload, return to login, forgot-password form and submission');
  await send('Browser.close');
})().catch(e => { console.error(e.message); process.exitCode = 1; }).finally(() => { socket?.close(); chrome.kill(); });
