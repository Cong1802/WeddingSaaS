const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--disable-gpu', '--no-first-run', '--remote-debugging-port=9239', `--user-data-dir=${path.join(root, 'profile-desktop-editor')}`, 'about:blank'], { windowsHide: true, stdio: 'ignore' });
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
  await send('Emulation.setDeviceMetricsOverride',{width:1920,height:1000,deviceScaleFactor:1,mobile:false});
  await send('Page.navigate',{url:'http://127.0.0.1:8000/editor'});
  await delay(2500);
  const layout=await evaluate(`(() => {
    const frame=document.querySelector('.editor-phone-frame').getBoundingClientRect();
    const template=document.querySelector('.editor-preview-template').getBoundingClientRect();
    const share=document.querySelector('.editor-preview-share').getBoundingClientRect();
    return {topbarHidden:getComputedStyle(document.querySelector('.editor-mobile-header')).display==='none',templateAbove:template.bottom<=frame.top,shareBelow:share.top>=frame.bottom,shareVisible:share.bottom<=innerHeight,menuColor:getComputedStyle(document.querySelector('.editor-navigation')).backgroundColor};
  })()`);
  console.log(layout);
  if(!layout.topbarHidden||!layout.templateAbove||!layout.shareBelow||!layout.shareVisible)throw Error('Desktop actions layout failed');
  await evaluate(`document.querySelectorAll('.editor-navigation>button')[5].click()`);
  await delay(300);
  console.log(await evaluate(`({rows:document.querySelectorAll('.editor-image-row').length,overflow:document.documentElement.scrollWidth>innerWidth})`));
  console.log(await evaluate(`(() => {
    const results=[];
    for(const [index,field] of [[1,'field-title'],[2,'field-groomName'],[3,'field-groomAddress']]) {
      document.querySelectorAll('.editor-navigation>button')[index].click();
      results.push(index);
    }
    return {stepsClicked:results};
  })()`));
  await delay(200);
  if(!await evaluate(`!!document.querySelector('.editor-step-event')`)) throw Error('Step navigation failed');
  await evaluate(`document.querySelectorAll('.editor-navigation>button')[2].click()`);
  await delay(200);
  console.log(await evaluate(`(() => {const input=document.querySelector('#field-groomName'); const parent=input.getBoundingClientRect();return {inputWidth:parent.width,font:getComputedStyle(input).fontSize,compactPhotos:document.querySelectorAll('.editor-section-couple .editor-image-row').length};})()`));
  const shot=await send('Page.captureScreenshot' ,{format:'png'});
  fs.writeFileSync(path.join(root,'desktop-editor.png'),Buffer.from(shot.data,'base64'));
  await send('Emulation.setDeviceMetricsOverride',{width:393,height:852,deviceScaleFactor:1,mobile:true});
  console.log(await evaluate(`({mobilePanelHidden:getComputedStyle(document.querySelector('.editor-panel-container')).display==='none',mobileOverflow:document.documentElement.scrollWidth>innerWidth})`));
  socket.close();chrome.kill();
})().catch(e=>{console.error(e);socket?.close();chrome.kill();process.exitCode=1;});
