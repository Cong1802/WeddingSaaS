const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--disable-gpu', '--no-first-run', '--remote-debugging-port=9239', `--user-data-dir=${path.join(root, 'profile-admin-routes')}`, 'about:blank'], { windowsHide: true, stdio: 'ignore' });
const delay = ms => new Promise(r => setTimeout(r, ms));
let socket;
(async () => {
  let tabs;
  for (let i = 0; i < 40; i++) {
    try { tabs = await (await fetch('http://127.0.0.1:9239/json')).json(); if (tabs.length) break; } catch {}
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


  await send('Page.addScriptToEvaluateOnNewDocument', {source: `localStorage.setItem('auth_token','route-test'); const realFetch=window.fetch; window.fetch=async (url,options)=> { if(url==='/api/auth/me') return {ok:true,json:async()=>({success:true,user:{id:999,name:'Route Test',role:'admin'}})}; if(String(url).startsWith('/api/admin/')) return {ok:true,json:async()=>({success:true,users:[],templates:[],plans:[],orders:[],cards:[],music:[],settings:{},stats:{total_users:0,total_cards:0,total_views:0,total_orders:0,total_revenue:0,pending_orders:0,templates:[],recent_users:[],recent_orders:[]}})}; return realFetch(url,options); };`});
  await send('Page.navigate',{url:'http://127.0.0.1:8000/admin/templates'});
  await delay(1400);
  const modules=['dashboard','templates','users','plans','orders','cards','music','settings'];
  for(let i=0;i<modules.length;i++) {
    await evaluate(`document.querySelectorAll('nav button')[${i}].click()`);
    await delay(120);
    if(await evaluate('location.pathname') !== '/admin/'+modules[i]) throw Error('Navigation failed: '+modules[i]);
  }
  await evaluate('history.back()'); await delay(200);
  if(await evaluate('location.pathname') !== '/admin/music') throw Error('Back failed');
  if(!await evaluate(`document.querySelectorAll('nav button')[6].style.color === 'rgb(192, 132, 252)'`)) throw Error('Back did not update active module');
  await evaluate('history.forward()'); await delay(200);
  if(!await evaluate(`location.pathname === '/admin/settings' && document.querySelectorAll('nav button')[7].style.color === 'rgb(192, 132, 252)'`)) throw Error('Forward failed');
  await send('Page.reload'); await delay(1000);
  if(!await evaluate(`location.pathname === '/admin/settings' && document.querySelectorAll('nav button')[7].style.color === 'rgb(192, 132, 252)'`)) throw Error('Refresh deep link failed');
  await evaluate(`[...document.querySelectorAll('button')].find(button => button.textContent.includes('Quay L\u1ea1i Website')).click()`);
  await delay(250);
  if(await evaluate('location.pathname') !== '/') throw Error('Return to website kept admin URL');
  await evaluate('history.back()'); await delay(500);
  if(!await evaluate(`location.pathname === '/admin/settings' && !!document.querySelectorAll('nav button')[7]`)) throw Error('Back from site failed');
  console.log('PASS: eight admin module URLs, direct link, reload, Back/Forward and return to website');
  await send('Browser.close');
})().catch(e=>{ console.error(e.message);process.exitCode=1; }).finally(()=>{socket?.close();chrome.kill();});
