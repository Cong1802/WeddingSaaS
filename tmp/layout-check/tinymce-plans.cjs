const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--disable-gpu', '--no-first-run', '--remote-debugging-port=9240', `--user-data-dir=${path.join(root, 'profile-tinymce')}`, 'about:blank'], { windowsHide: true, stdio: 'ignore' });
const delay = ms => new Promise(r => setTimeout(r, ms));
let socket;
(async () => {
  let tabs;
  for (let i = 0; i < 40; i++) {
    try { tabs = await (await fetch('http://127.0.0.1:9240/json')).json(); if (tabs.length) break; } catch {}
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



  await send('Page.addScriptToEvaluateOnNewDocument', {source: `localStorage.setItem('auth_token','editor-test'); const realFetch=window.fetch; window.fetch=async (url,options)=> { if(url==='/api/auth/me') return {ok:true,json:async()=>({success:true,user:{id:999,name:'Editor Test',role:'admin'}})}; if(String(url).startsWith('/api/admin/')) { if(options?.body) window.__saved=JSON.parse(options.body); return {ok:true,json:async()=>({success:true,plans:[],message:'Saved'})}; } return realFetch(url,options); };`});
  await send('Page.navigate',{url:'http://127.0.0.1:8000/admin/plans'}); await delay(1500);
  await evaluate(`[...document.querySelectorAll('button')].find(button=>button.textContent.includes('T\u1ea1o G\u00f3i')).click()`);
  let ready=false;
  for(let i=0;i<40;i++) { ready=await evaluate('!!window.tinymce?.activeEditor?.initialized'); if(ready) break; await delay(500); }
  if(!ready) throw Error('TinyMCE did not initialize');
  if(await evaluate('tinymce.activeEditor.mode.isReadOnly()')) throw Error('TinyMCE is read-only: check domain registration for the supplied key');
  await evaluate(`tinymce.activeEditor.setContent('<p><strong>Link 12 months</strong></p><p><em>VietQR</em></p>'); tinymce.activeEditor.fire('change'); undefined;`); await delay(100);
  await evaluate(`(() => {const input=document.querySelector('form input[type=text]'); const inputs=[...document.querySelectorAll('form input[type=text]')]; const last=inputs.at(-1); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(last,'Test Plan'); last.dispatchEvent(new Event('input',{bubbles:true}));})()`); await delay(100);
  await evaluate(`document.querySelector('form').requestSubmit()`); await delay(200);
  if(!await evaluate(`window.__saved?.features?.[0] === '<strong>Link 12 months</strong>' && window.__saved?.features?.[1] === '<em>VietQR</em>'`)) throw Error('Rich feature save payload failed');
  console.log('PASS: TinyMCE cloud initialization and formatted feature save payload');
  await send('Browser.close');
})().catch(e=>{console.error(e.message);process.exitCode=1;}).finally(()=>{socket?.close();chrome.kill();});
