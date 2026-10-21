const {spawn}=require('node:child_process');
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const profileLabel=process.argv.find(value=>value.startsWith('--profile-opening='))?.split('=')[1];
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const browser=spawn('C:/Program Files/Google/Chrome/Application/chrome.exe',[
  '--headless=new','--no-first-run','--remote-debugging-port=9259',
  `--user-data-dir=${path.join(__dirname,'profile-template8-open-transition')}`,'about:blank'
],{windowsHide:true,stdio:'ignore'});
let socket;
(async()=>{
  let tabs;
  for(let n=0;n<60;n++){
    try{tabs=await(await fetch('http://127.0.0.1:9259/json')).json();if(tabs.some(tab=>tab.type==='page'))break;}catch{}
    await pause(200);
  }
  assert.ok(tabs?.length,'Headless Chrome started');
  socket=new WebSocket(tabs.find(tab=>tab.type==='page').webSocketDebuggerUrl);
  await new Promise(resolve=>socket.addEventListener('open',resolve,{once:true}));
  let nextId=0;
  const requests=new Map();
  const errors=[];
  socket.addEventListener('message',event=>{
    const message=JSON.parse(event.data);
    if(message.method==='Runtime.exceptionThrown')errors.push(message.params.exceptionDetails.exception?.description||message.params.exceptionDetails.text);
    const pending=requests.get(message.id);
    if(pending){requests.delete(message.id);message.error?pending.reject(Error(JSON.stringify(message.error))):pending.resolve(message.result);}
  });
  const send=(method,params={})=>new Promise((resolve,reject)=>{
    const id=++nextId;requests.set(id,{resolve,reject});socket.send(JSON.stringify({id,method,params}));
  });
  const evaluate=async expression=>{
    const response=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
    if(response.exceptionDetails)throw Error(response.exceptionDetails.exception?.description||response.exceptionDetails.text);
    return response.result.value;
  };
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Network.enable');
  await send('Network.setCacheDisabled',{cacheDisabled:true});
  await send('Performance.enable');
  const reports=[];
  for(const [name,width,height] of (profileLabel?[['mobile',393,852]]:[['mobile',393,852],['small',320,740],['desktop',1440,900]])){
    await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:name!=='desktop'});
    await send('Page.navigate',{url:'http://127.0.0.1:8000/templates/mau-thiep-8/mau-thiep-8.html'});
    let ready=false;
    for(let n=0;n<150;n++){
      ready=await evaluate("!!document.querySelector('.royal-opening-envelope')");
      if(ready)break;
      await pause(100);
    }
    assert.ok(ready,'Opening screen mounted');
    if(profileLabel){
      await pause(3500);
      const opening=await evaluate(`(()=>{
        const screen=document.querySelector('.royal-opening-screen');
        const images=[...screen.querySelectorAll('img')].map(image=>({url:image.currentSrc,width:image.naturalWidth,height:image.naturalHeight,renderWidth:image.getBoundingClientRect().width}));
        const background=getComputedStyle(screen,'::before').backgroundImage.match(/url\\(["']?(.*?)["']?\\)/)?.[1];
        return {images,background};
      })()`);
      const metricMap=response=>Object.fromEntries(response.metrics.map(metric=>[metric.name,metric.value]));
      const first=metricMap(await send('Performance.getMetrics'));
      await pause(2000);
      const last=metricMap(await send('Performance.getMetrics'));
      const metrics=Object.fromEntries(['LayoutCount','RecalcStyleCount','LayoutDuration','TaskDuration','ScriptDuration'].map(key=>[key,last[key]-first[key]]));
      const assets=[...opening.images.map(image=>image.url),opening.background].filter(Boolean).map(url=>{
        const name=path.basename(new URL(url).pathname);
        return {name,bytes:fs.statSync(path.resolve(__dirname,'../../laravel-backend/public/templates/mau-thiep-8/assets',name)).size};
      });
      const profile={opening,assets,bytes:assets.reduce((sum,asset)=>sum+asset.bytes,0),metrics};
      fs.writeFileSync(path.join(__dirname,`template8-opening-${profileLabel}.json`),JSON.stringify(profile,null,2));
      const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
      fs.writeFileSync(path.join(__dirname,`template8-opening-${profileLabel}.png`),Buffer.from(shot.data,'base64'));
      console.log(JSON.stringify({profileLabel,...profile},null,2));
    }
    const before=await evaluate(`(()=>{
      const card=document.querySelector('.royal-invitation').getBoundingClientRect();
      return {cardX:card.x,cardWidth:card.width,locked:getComputedStyle(document.documentElement).overflowY==='hidden'};
    })()`);
    assert.equal(before.locked,true,'Opening screen locks scrolling');
    const immediate=await evaluate(`(()=>{
      const card=document.querySelector('.royal-invitation');
      window.__openFrames=[];
      const start=performance.now();
      const sample=()=>{
        const rect=card.getBoundingClientRect();
        window.__openFrames.push({ms:performance.now()-start,overlay:!!document.querySelector('.royal-opening-screen'),x:rect.x,width:rect.width,scrollY});
        if(performance.now()-start<1650)requestAnimationFrame(sample);
      };
      document.querySelector('.royal-opening-envelope').click();
      requestAnimationFrame(sample);
      return {overlay:!!document.querySelector('.royal-opening-screen'),opened:document.documentElement.dataset.minimalOpened,inert:document.querySelector('main').inert,scrollY,overflow:getComputedStyle(document.documentElement).overflowY};
    })()`);
    assert.equal(immediate.overlay,false,'Opening screen removed within the click handler');
    assert.equal(immediate.opened,'true');
    assert.equal(immediate.inert,false);
    assert.notEqual(immediate.overflow,'hidden','Scrolling restored');
    assert.equal(immediate.scrollY,0);
    await pause(1750);
    await evaluate("Promise.all([...document.querySelectorAll('.royal-photo,.royal-flowers-left')].flatMap(element=>element.getAnimations().map(animation=>animation.finished.catch(()=>{}))))");
    const after=await evaluate(`(()=>{
      const photo=document.querySelector('.royal-photo');
      const flower=document.querySelector('.royal-flowers-left');
      const animation=element=>element.getAnimations().map(item=>({name:item.animationName,time:item.currentTime,duration:item.effect.getTiming().duration,state:item.playState}));
      const rect=document.querySelector('.royal-invitation').getBoundingClientRect();
      return {frames:window.__openFrames,cardX:rect.x,cardWidth:rect.width,photo:animation(photo),flower:animation(flower),flowerTransform:getComputedStyle(flower).transform,heartLayers:document.querySelectorAll('body>.royal-falling-hearts').length};
    })()`);
    assert.ok(after.frames.length>5,'Recorded frames during transition');
    assert.equal(after.cardWidth,before.cardWidth,'Card width remains unchanged when scrolling unlocks');
    assert.ok(Math.abs(after.cardX-before.cardX)<.1,'Card does not shift when the scrollbar returns');
    assert.ok(after.frames.every(frame=>!frame.overlay),'No overlay reappears during animation');
    assert.ok(after.frames.every(frame=>frame.scrollY===0),'No scroll jump');
    assert.ok(after.frames.every(frame=>frame.width===after.cardWidth&&Math.abs(frame.x-after.cardX)<.1),'Stable card position after click');
    assert.equal(after.photo[0].duration,1400,'Photo animation retains 1.4 seconds');
    assert.equal(after.flower[0].duration,1400,'Flower animation retains 1.4 seconds');
    assert.equal(after.photo[0].state,'finished');
    assert.equal(after.flower[0].state,'finished');
    assert.equal(after.heartLayers,1,'Falling hearts transfer to main invitation');
    if(name==='mobile'){
      const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
      fs.writeFileSync(path.join(__dirname,'template8-open-transition-mobile.png'),Buffer.from(shot.data,'base64'));
    }
    reports.push({name,before,immediate,after:{cardX:after.cardX,cardWidth:after.cardWidth,frames:after.frames.length,photo:after.photo,flower:after.flower}});
  }
  assert.deepEqual(errors,[],'No browser script exceptions');
  console.log(JSON.stringify({reports,errors},null,2));
  socket.close();browser.kill();
})().catch(error=>{console.error(error);socket?.close();browser.kill();process.exitCode=1;});
