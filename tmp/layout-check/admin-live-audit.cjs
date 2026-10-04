const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--disable-gpu', '--no-first-run', '--remote-debugging-port=9241', `--user-data-dir=${path.join(root, 'profile-admin-live-audit')}`, 'about:blank'], { windowsHide: true, stdio: 'ignore' });
const delay = ms => new Promise(r => setTimeout(r, ms));
let socket;
(async () => {
  let tabs;
  for (let i = 0; i < 40; i++) {
    try { tabs = await (await fetch('http://127.0.0.1:9241/json')).json(); if (tabs.length) break; } catch {}
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



  const response=await fetch('http://127.0.0.1:8000/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({email:'admin@example.com',password:process.env.ADMIN_AUDIT_PASSWORD})});
  const auth=await response.json(); if(!response.ok || !auth.token) throw Error('Live admin login failed');
  const authToken=auth.token;
  try {
    const initScript=await send('Page.addScriptToEvaluateOnNewDocument',{source:`localStorage.setItem('auth_token',${JSON.stringify(authToken)}); window.__apiErrors=[]; window.__pending=0; const realFetch=window.fetch; window.fetch=async (...args)=> {window.__pending++;try {const r=await realFetch(...args); if(String(args[0]).startsWith('/api/admin/') && !r.ok) window.__apiErrors.push({url:args[0],status:r.status});return r;}finally{window.__pending--;}};`});
    const exceptions=[];socket.addEventListener('message',e=>{const message=JSON.parse(e.data);if(message.method==='Runtime.exceptionThrown')exceptions.push(message.params.exceptionDetails.text);});
    await send('Runtime.enable');
    await send('Page.navigate',{url:'http://127.0.0.1:8000/admin/dashboard'});await delay(1400);
    const modules=['dashboard','templates','users','plans','orders','cards','music','settings'];
    for(let i=0;i<modules.length;i++) {
      await evaluate(`document.querySelectorAll('nav button')[${i}].click()`);await delay(300);
      for(let j=0;j<30;j++){if(await evaluate('window.__pending===0'))break;await delay(100);}
      if(await evaluate('location.pathname') !== '/admin/'+modules[i]) throw Error('Wrong URL: '+modules[i]);
      if(await evaluate('window.__apiErrors.length')) throw Error('Admin API error '+JSON.stringify(await evaluate('window.__apiErrors')));
      if(['templates','plans','music'].includes(modules[i])) {
        const opened=await evaluate(`(()=>{const button=[...document.querySelectorAll('button')].find(b=>b.querySelector('svg')?.classList.value.match(/lucide-(square-pen|pen-line|edit-3|edit)(?: |$)/));if(!button)return false;button.click();return true;})()`);await delay(200);
        if(opened) {
          if(!await evaluate('!!document.querySelector("form")'))throw Error('Edit form failed '+modules[i]+'; exceptions='+JSON.stringify(exceptions));
          if(modules[i]==='plans'){for(let j=0;j<35;j++){if(await evaluate('!!window.tinymce?.activeEditor?.initialized'))break;await delay(200);}}
          await evaluate(`[...document.querySelectorAll('form button')].find(b=>b.textContent.trim()==='H\u1ee7y').click()`);await delay(100);
        }
      }
      console.log('PASS live module:',modules[i]);
    }
    await send('Page.reload');await delay(300);
    for(let j=0;j<100;j++){if(await evaluate('!!document.querySelector("form") && window.__pending===0'))break;await delay(100);}
    if(!await evaluate(`location.pathname==='/admin/settings' && !!document.querySelector('form')`))throw Error('Settings reload failed');
    await evaluate('history.back()');await delay(300);await evaluate('history.forward()');await delay(300);
    if(exceptions.length)throw Error('Browser exceptions: '+exceptions.join(','));
    await send('Page.removeScriptToEvaluateOnNewDocument',{identifier:initScript.identifier});
    await evaluate(`localStorage.setItem('auth_token','invalid-token');location.reload()`);await delay(300);
    for(let j=0;j<100;j++){if(await evaluate('!!document.querySelector("input[type=password]")'))break;await delay(100);}
    if(await evaluate('!!document.querySelector("nav button")'))throw Error('Invalid token still grants admin UI');
    console.log('PASS: real admin APIs, edit dialogs, refresh/history and invalid-token gate; no JavaScript exceptions');
  } finally {
    await fetch('http://127.0.0.1:8000/api/auth/logout',{method:'POST',headers:{Authorization:'Bearer '+authToken,Accept:'application/json'}});
  }
  await send('Browser.close');
})().catch(e=>{console.error(e.message);process.exitCode=1;}).finally(()=>{socket?.close();chrome.kill();});
