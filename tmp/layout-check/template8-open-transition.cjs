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
        const scripts=[...document.scripts].map(script=>script.src);
        return {images,background,galleryAfterOpening:scripts.findIndex(src=>src.includes('local-interactions.js'))<scripts.findIndex(src=>src.includes('fancybox.umd.js')),galleryCSSAsync:document.querySelector('link[href*="fancybox.css"]').hasAttribute('onload'),backgroundPreloaded:!!document.querySelector('link[rel="preload"][href*="royal-opening-paper-screen"]')};
      })()`);
      assert.ok(opening.images.every(image=>image.width>0),'Opening artwork loads successfully');
      if(profileLabel==='after'){
        assert.equal(opening.galleryAfterOpening,true,'Gallery does not delay the opening script');
        assert.equal(opening.galleryCSSAsync,true,'Gallery stylesheet is nonblocking');
        assert.equal(opening.backgroundPreloaded,true,'Opening background loads with priority');
      }
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
      const seal=document.querySelector('.royal-opening-wax-seal').getBoundingClientRect();
      return {cardX:card.x,cardWidth:card.width,sealX:seal.x+seal.width/2,sealY:seal.y+seal.height/2,locked:getComputedStyle(document.documentElement).overflowY==='hidden'};
    })()`);
    assert.equal(before.locked,true,'Opening screen locks scrolling');
    const immediate=await evaluate(`(()=>{
      const card=document.querySelector('.royal-invitation');
      window.__openFrames=[];
      window.__openedEvents=0;
      document.addEventListener('royal-opening-finished',()=>window.__openedEvents++);
      const start=performance.now();
      const sample=()=>{
        const rect=card.getBoundingClientRect();
        const cover=document.querySelector('.royal-opening-screen');
        const coverOpacity=cover?Number(getComputedStyle(cover).opacity):0;
        const contentOpacity=cover?Number(getComputedStyle(cover.querySelector('.royal-opening-content')).opacity):0;
        window.__openFrames.push({ms:performance.now()-start,overlay:!!cover,coverOpacity,contentOpacity,x:rect.x,width:rect.width,scrollY});
        if(performance.now()-start<3000)requestAnimationFrame(sample);
      };
      document.querySelector('.royal-opening-envelope').click();
      requestAnimationFrame(sample);
      return {overlay:!!document.querySelector('.royal-opening-screen'),state:document.querySelector('.royal-opening-screen')?.dataset.state,opened:document.documentElement.dataset.minimalOpened,inert:document.querySelector('main').inert,scrollY,overflow:getComputedStyle(document.documentElement).overflowY};
    })()`);
    assert.equal(immediate.overlay,true,'Cover stays mounted during the fade');
    assert.equal(immediate.state,'opening','Fade starts immediately on click');
    assert.equal(immediate.opened,'true','Main entrance starts with the cover fade');
    assert.equal(immediate.inert,true,'Main page stays inert during the transition');
    assert.equal(immediate.overflow,'hidden','Scrolling remains locked while fading');
    assert.equal(immediate.scrollY,0);
    await evaluate("document.querySelector('.royal-opening-screen').dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}))");
    await pause(700);
    const during=await evaluate(`(()=>{
      const screen=document.querySelector('.royal-opening-screen');
      const burst=document.querySelector('.royal-opening-burst');
      const bounds=burst?.getBoundingClientRect();
      return {state:screen?.dataset.state,coverOpacity:screen&&Number(getComputedStyle(screen).opacity),contentOpacity:screen&&Number(getComputedStyle(screen.querySelector('.royal-opening-content')).opacity),particles:burst?.children.length,colors:burst&&new Set([...burst.children].map(heart=>heart.style.color)).size,originX:bounds&&bounds.x+parseFloat(burst.style.getPropertyValue('--burst-origin-x')),originY:bounds&&bounds.y+parseFloat(burst.style.getPropertyValue('--burst-origin-y')),photoState:document.querySelector('.royal-photo').getAnimations()[0]?.playState,events:window.__openedEvents};
    })()`);
    assert.equal(during.state,'away','Hearts burst while the screen fades');
    assert.ok(during.contentOpacity>0&&during.contentOpacity<1,'Opening content fades gradually rather than disappearing first');
    assert.ok(during.coverOpacity>0&&during.coverOpacity<1,'Cover fades smoothly');
    assert.ok(Math.abs(during.coverOpacity-during.contentOpacity)<.05,'Content and backdrop share the same animation clock');
    assert.equal(during.particles,28,'One burst of 28 hearts');
    assert.equal(during.colors,4,'Four reference burst colors');
    assert.ok(Math.abs(during.originX-before.sealX)<1&&Math.abs(during.originY-before.sealY)<1,'Hearts originate at the wax seal');
    assert.equal(during.photoState,'running','Hero emerges while the cover fades');
    assert.equal(during.events,0,'Opening is not announced before the fade ends');
    if(name==='mobile'){
      const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
      fs.writeFileSync(path.join(__dirname,'template8-opening-burst-mid.png'),Buffer.from(shot.data,'base64'));
    }
    await pause(1800);
    await evaluate("Promise.all([...document.querySelectorAll('.royal-photo,.royal-flowers-left')].flatMap(element=>element.getAnimations().map(animation=>animation.finished.catch(()=>{}))))");
    const after=await evaluate(`(()=>{
      const photo=document.querySelector('.royal-photo');
      const flower=document.querySelector('.royal-flowers-left');
      const animation=element=>element.getAnimations().map(item=>({name:item.animationName,time:item.currentTime,duration:item.effect.getTiming().duration,state:item.playState}));
      const rect=document.querySelector('.royal-invitation').getBoundingClientRect();
      return {frames:window.__openFrames,cardX:rect.x,cardWidth:rect.width,photo:animation(photo),flower:animation(flower),flowerTransform:getComputedStyle(flower).transform,heartLayers:document.querySelectorAll('body>.royal-falling-hearts').length,burstLayers:document.querySelectorAll('.royal-opening-burst').length,events:window.__openedEvents,opened:document.documentElement.dataset.minimalOpened,inert:document.querySelector('main').inert,overflow:getComputedStyle(document.documentElement).overflowY};
    })()`);
    assert.ok(after.frames.length>5,'Recorded frames during transition');
    assert.equal(after.cardWidth,before.cardWidth,'Card width remains unchanged when scrolling unlocks');
    assert.ok(Math.abs(after.cardX-before.cardX)<.1,'Card does not shift when the scrollbar returns');
    const removedAt=after.frames.findIndex(frame=>!frame.overlay);
    assert.ok(removedAt>0,'Cover is removed after its exit animation');
    assert.ok(after.frames.slice(removedAt).every(frame=>!frame.overlay),'No overlay reappears after fading');
    const fadingFrames=after.frames.filter(frame=>frame.coverOpacity>.1&&frame.coverOpacity<.9);
    assert.ok(fadingFrames.length>10,'Fade includes many intermediate frames');
    assert.ok(after.frames.every(frame=>frame.coverOpacity*frame.contentOpacity+1-frame.coverOpacity>=.7),'No interval shows only the empty backdrop');
    assert.ok(after.frames[removedAt-1].coverOpacity<.05,'Cover is removed only once it is almost transparent');
    assert.ok(after.frames.every(frame=>frame.scrollY===0),'No scroll jump');
    assert.ok(after.frames.every(frame=>frame.width===after.cardWidth&&Math.abs(frame.x-after.cardX)<.1),'Stable card position after click');
    assert.equal(after.photo[0].duration,1400,'Photo animation retains 1.4 seconds');
    assert.equal(after.flower[0].duration,1400,'Flower animation retains 1.4 seconds');
    assert.equal(after.photo[0].state,'finished');
    assert.equal(after.flower[0].state,'finished');
    assert.equal(after.heartLayers,1,'Falling hearts transfer to main invitation');
    assert.equal(after.burstLayers,0,'Temporary particles are cleaned up');
    assert.equal(after.events,1,'Repeated clicks do not duplicate the opening');
    assert.equal(after.opened,'true');
    assert.equal(after.inert,false);
    assert.notEqual(after.overflow,'hidden','Scrolling resumes after the fade');
    if(name==='mobile'){
      const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
      fs.writeFileSync(path.join(__dirname,'template8-open-transition-mobile.png'),Buffer.from(shot.data,'base64'));
    }
    if(name==='desktop'){
      for(let n=0;n<100;n++){
        if(await evaluate("typeof window.Fancybox?.bind==='function'"))break;
        await pause(100);
      }
      await evaluate("document.querySelector('[data-fancybox=royal-album]').click()");
      await pause(400);
      assert.equal(await evaluate("!!document.querySelector('.fancybox__container')"),true,'Album lightbox still opens with deferred gallery assets');
    }
    reports.push({name,before,immediate,during,after:{cardX:after.cardX,cardWidth:after.cardWidth,frames:after.frames.length,photo:after.photo,flower:after.flower,events:after.events}});
  }
  assert.deepEqual(errors,[],'No browser script exceptions');
  console.log(JSON.stringify({reports,errors},null,2));
  socket.close();browser.kill();
})().catch(error=>{console.error(error);socket?.close();browser.kill();process.exitCode=1;});
