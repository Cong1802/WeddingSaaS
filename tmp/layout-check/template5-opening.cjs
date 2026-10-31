const {spawn}=require('node:child_process');
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const before=process.argv.includes('--before');
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const browser=spawn('C:/Program Files/Google/Chrome/Application/chrome.exe',[
  '--headless=new','--no-first-run','--remote-debugging-port=9260',
  `--user-data-dir=${path.join(__dirname,'profile-template5-opening-realistic')}`,'about:blank'
],{windowsHide:true,stdio:'ignore'});
let socket;
(async()=>{
  let tabs;
  for(let n=0;n<50;n++){
    try{tabs=await(await fetch('http://127.0.0.1:9260/json')).json();if(tabs.some(tab=>tab.type==='page'))break;}catch{}
    await pause(200);
  }
  assert.ok(tabs?.length,'Headless browser starts');
  socket=new WebSocket(tabs.find(tab=>tab.type==='page').webSocketDebuggerUrl);
  await new Promise(resolve=>socket.addEventListener('open',resolve,{once:true}));
  let next=0;const pending=new Map();const errors=[];
  socket.addEventListener('message',event=>{
    const message=JSON.parse(event.data);
    if(message.method==='Runtime.exceptionThrown')errors.push(message.params.exceptionDetails.exception?.description||message.params.exceptionDetails.text);
    const request=pending.get(message.id);
    if(request){pending.delete(message.id);message.error?request.reject(Error(JSON.stringify(message.error))):request.resolve(message.result);}
  });
  const send=(method,params={})=>new Promise((resolve,reject)=>{
    const id=++next;pending.set(id,{resolve,reject});socket.send(JSON.stringify({id,method,params}));
  });
  const evaluate=async expression=>{
    const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
    if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);
    return r.result.value;
  };
  await send('Page.enable');await send('Runtime.enable');await send('Network.enable');
  await send('Network.setCacheDisabled',{cacheDisabled:true});
  const reports=[];
  for(const [name,width,height] of (before?[['mobile',393,852]]:[['mobile',393,852],['small',320,640],['short',393,640],['desktop',1440,900],['landscape',852,393]])){
    await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:name!=='desktop'});
    await send('Page.navigate',{url:'http://127.0.0.1:8000/templates/mau-thiep-5/mau-thiep-5.html'});
    for(let n=0;n<120;n++){
      if(await evaluate("document.readyState==='complete'&&document.body.classList.contains('locked')"))break;
      await pause(100);
    }
    await evaluate('document.fonts.ready');await pause(700);
    const opening=await evaluate(`(()=>{
      const o=document.querySelector('#opening'),b=document.querySelector('#open-invitation'),r=b.getBoundingClientRect();
      const bounds=selector=>{const r=document.querySelector(selector).getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height,bottom:r.bottom};};
      return {visible:getComputedStyle(o).visibility,locked:document.body.classList.contains('locked'),scroll:o.scrollHeight-o.clientHeight,button:{x:r.x,y:r.y,width:r.width,height:r.height},inner:bounds('.opening-inner'),scene:bounds('.opening-scene'),card:bounds('.opening-card'),background:getComputedStyle(document.querySelector('.opening-inner')).backgroundImage,images:[...o.querySelectorAll('img')].map(i=>({url:i.currentSrc,loaded:i.complete&&i.naturalWidth>0})),text:o.textContent};
    })()`);
    assert.equal(opening.visible,'visible');assert.equal(opening.locked,true);
    assert.ok(opening.button.y>=0&&opening.button.y+opening.button.height<=height,'Open button fits viewport');
    assert.ok(opening.images.every(i=>i.loaded),'Opening artwork loads');
    const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
    fs.writeFileSync(path.join(__dirname,`template5-opening-${before?'before-':''}${name}.png`),Buffer.from(shot.data,'base64'));
    if(!before){
      assert.ok(opening.scroll<=1,'Opening does not scroll');
      assert.ok(Math.abs(opening.inner.y)<1&&Math.abs(opening.inner.height-height)<1,'Paper covers full viewport height');
      assert.ok(Math.abs(opening.scene.height-height)<1,'Composition fills the paper height');
      if(width<=480&&height>500)assert.ok(Math.abs(opening.inner.width-width)<1&&Math.abs(opening.inner.x)<1,'Paper covers the full phone width');
      assert.ok(opening.background.includes('opening-paper-real-v1.webp'),'Full opening has the paper background');
      assert.ok(opening.card.bottom<opening.button.y,'Card does not overlap the open button');
      assert.ok(opening.button.height<=44,'Open button label stays on one line');
      assert.ok(opening.text.includes('Phương Linh')&&opening.text.includes('Văn Đạt'),'Names remain live text');
      const button=opening.button;
      await send('Input.dispatchMouseEvent',{type:'mousePressed',x:button.x+button.width/2,y:button.y+button.height/2,button:'left',clickCount:1});
      await send('Input.dispatchMouseEvent',{type:'mouseReleased',x:button.x+button.width/2,y:button.y+button.height/2,button:'left',clickCount:1});
      await pause(240);
      const middle=await evaluate("({opacity:Number(getComputedStyle(document.querySelector('#opening')).opacity),opening:document.querySelector('#opening').classList.contains('is-opening')})");
      assert.equal(middle.opening,true);assert.ok(middle.opacity>0&&middle.opacity<1,'Opening fades smoothly');
      await pause(1100);
      assert.equal(await evaluate("document.querySelector('#opening').classList.contains('is-hidden')&&!document.querySelector('#invitation').inert&&!document.body.classList.contains('locked')"),true,'Invitation opens and scrolling unlocks');
      await evaluate("document.querySelector('.replay-opening').click()");await pause(900);
      assert.equal(await evaluate("!document.querySelector('#opening').classList.contains('is-hidden')&&document.body.classList.contains('locked')&&document.querySelector('#invitation').inert"),true,'Replay restores opening');
      opening.fade=middle;
    }
    reports.push({name,...opening});
  }
  assert.deepEqual(errors,[],'No browser exceptions');
  fs.writeFileSync(path.join(__dirname,'template5-opening-report.json'),JSON.stringify({reports,errors},null,2));
  console.log(JSON.stringify({reports,errors},null,2));
  socket.close();browser.kill();
})().catch(error=>{console.error(error);socket?.close();browser.kill();process.exitCode=1;});
