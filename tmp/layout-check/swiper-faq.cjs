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
  await send('Emulation.setEmulatedMedia', {features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
  const evaluate = async expression => {
    const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (result.exceptionDetails) throw Error(result.exceptionDetails.text + ' ' + result.exceptionDetails.exception?.description);
    return result.result.value;
  };
  const assert = (value, message) => { if(!value) throw Error(message); };
  const shot = async (section, name) => {
    const rect = await evaluate(`(() => { const e = document.querySelector('${section}'); const r = e.getBoundingClientRect(); return {top:r.top+scrollY,height:r.height}; })()`);
    const capture = await send('Page.captureScreenshot', {format:'png',captureBeyondViewport:true,clip:{x:0,y:rect.top,width:await evaluate('innerWidth'),height:rect.height,scale:1}});
    fs.writeFileSync(path.join(root, `swiper-${name}-${section.slice(1)}.png`), Buffer.from(capture.data,'base64'));
  };
  for (const [name, width, height] of [['desktop', 1774, 1000], ['mobile', 390, 844]]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: name === 'mobile' });
    await send('Page.navigate', { url: 'http://127.0.0.1:8000' });
    await delay(2000);
    await evaluate('document.fonts.ready');
    await evaluate(`document.querySelector('#templates').scrollIntoView()`);
    assert(await evaluate(`!!document.querySelector('.template-gallery__slider').swiper`), 'Gallery is not Swiper');
    const first = await evaluate(`document.querySelector('.template-gallery__slider').swiper.activeIndex`);
    await evaluate(`document.querySelector('.template-gallery__arrow--right').click()`);
    await delay(550);
    assert(await evaluate(`document.querySelector('.template-gallery__slider').swiper.activeIndex > ${first}`), 'Gallery next failed');
    await evaluate(`document.querySelector('.template-gallery__filters button:nth-child(4)').click()`);
    await delay(180);
    assert(await evaluate(`document.querySelector('.template-gallery__slider').swiper.slides.length === 1 && document.querySelector('.template-gallery__slider').swiper.activeIndex === 0 && !document.querySelector('.template-gallery__arrow')`), 'Filter/reset/locked navigation failed');
    await evaluate(`document.querySelector('.template-gallery__filters button:first-child').click()`);
    await delay(120);
    await evaluate(`document.querySelector('.template-gallery__favorite').click()`);
    assert(await evaluate(`document.querySelector('.template-gallery__favorite').getAttribute('aria-pressed') === 'true' && document.querySelector('.template-gallery__slider').swiper.activeIndex === 0`), 'Favorite navigated slider');
    await evaluate(`document.querySelector('.template-gallery__cta').click()`);
    assert(await evaluate(`document.querySelectorAll('.template-gallery__track.is-expanded article').length === 8`), 'Expanded gallery failed');
    await evaluate(`document.querySelector('.template-gallery__cta').click()`);
    await delay(120);
    assert(await evaluate(`!!document.querySelector('.template-gallery__slider').swiper`), 'Collapse Swiper failed');
    await shot('#templates', name);
    await evaluate(`document.querySelector('#testimonials').scrollIntoView()`);
    assert(await evaluate(`!!document.querySelector('.wedding-reviews__slider').swiper`), 'Reviews is not Swiper');
    const reviewIndex = await evaluate(`document.querySelector('.wedding-reviews__slider').swiper.realIndex`);
    await evaluate(`document.querySelector('.wedding-reviews__arrow--right').click()`);
    await delay(550);
    assert(await evaluate(`document.querySelector('.wedding-reviews__slider').swiper.realIndex !== ${reviewIndex}`), 'Reviews next failed');
    await evaluate(`document.querySelector('.wedding-reviews__dots button:first-child').click()`);
    await delay(550);
    assert(await evaluate(`document.querySelector('.wedding-reviews__slider').swiper.realIndex % 3 === 0 && document.querySelector('.wedding-reviews__dots button:first-child').getAttribute('aria-pressed') === 'true'`), 'Review pagination failed');
    for(let i=0;i<8;i++){ await evaluate(`document.querySelector('.wedding-reviews__arrow--right').click()`); await delay(500); }
    assert(await evaluate(`document.querySelectorAll('.wedding-reviews__slider .swiper-slide').length === 6 && document.querySelector('.wedding-reviews__slider').swiper.realIndex % 3 === 2`), 'Review loop failed');
    await evaluate("document.querySelector('.wedding-reviews__slider').scrollIntoView({block:'center'})" ); await delay(150);
    await send('Emulation.setTouchEmulationEnabled', {enabled:true,maxTouchPoints:1});
    const box = await evaluate(`(() => {const r=document.querySelector('.wedding-reviews__slider').getBoundingClientRect(); return {x:r.left+r.width*.85,y:Math.min(innerHeight-90,r.top+Math.min(140,r.height/2)),endX:r.left+r.width*.1};})()`);
    console.log(name,'touch box',box); const beforeSwipe = await evaluate(`document.querySelector('.wedding-reviews__slider').swiper.realIndex`);
    await send('Input.dispatchTouchEvent', {type:'touchStart',touchPoints:[{x:box.x,y:box.y}]});
    for(let i=1;i<=6;i++){ await send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:box.x+(box.endX-box.x)*i/6,y:box.y}]}); await delay(20); }
    await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
    await delay(550);
    assert(await evaluate(`document.querySelector('.wedding-reviews__slider').swiper.realIndex !== ${beforeSwipe}`), 'Touch swipe failed');
    await shot('#testimonials',name);
    await evaluate(`document.querySelector('#faq').scrollIntoView()`);
    const transition = await evaluate(`new Promise(resolve => { const heights=[]; const panel=document.querySelector('#faq-answer-1'); const heading=document.querySelector('#faq-question-0'); const before=heading.getBoundingClientRect().top; document.querySelector('#faq-question-1').click(); const start=performance.now(); const sample=()=>{heights.push(panel.getBoundingClientRect().height); if(performance.now()-start < 380) requestAnimationFrame(sample); else resolve({heights,headerShift:Math.abs(heading.getBoundingClientRect().top-before),open:document.querySelector('#faq-question-1').getAttribute('aria-expanded'),inactive:document.querySelector('#faq-answer-0').inert});}; requestAnimationFrame(sample); })`);
    assert(transition.open === 'true' && transition.inactive && transition.headerShift < 1,'FAQ state/heading stability failed');
    console.log(name, 'FAQ transition', transition, await evaluate("({css:getComputedStyle(document.querySelector('#faq-answer-1')).transition,rows:getComputedStyle(document.querySelector('#faq-answer-1')).gridTemplateRows,reduced:matchMedia('(prefers-reduced-motion: reduce)').matches})")); const total=Math.max(...transition.heights);
    assert(transition.heights.some(value=>value>1&&value<total-1), 'FAQ did not animate');
    assert(Math.max(...transition.heights.slice(1).map((value,index)=>Math.abs(value-transition.heights[index]))) < total*.75,'FAQ jumped');
    await evaluate(`document.querySelector('#faq-question-1').click()`);
    await delay(380);
    assert(await evaluate(`document.querySelector('#faq-answer-1').getBoundingClientRect().height < 1 && document.querySelector('#faq-answer-1').inert`), 'FAQ close failed');
    await evaluate(`document.querySelector('#faq-question-0').click()`);
    await delay(350);
    await shot('#faq',name);
    console.log(name,'Swiper arrows, filtering, favorites, expand/collapse, pagination, loop, touch swipe and smooth FAQ passed', {faqFrames:transition.heights.length, headerShift:transition.headerShift});
  }
  await send('Emulation.setEmulatedMedia', {features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await evaluate(`document.querySelector('#faq-question-2').click()`);
  await delay(60);
  assert(await evaluate(`getComputedStyle(document.querySelector('#faq-answer-2')).transition === 'none' && document.querySelector('#faq-question-2').getAttribute('aria-expanded') === 'true'`), 'Reduced-motion FAQ failed');
  console.log('Reduced-motion FAQ passed');
  await send('Browser.close');
})().catch(e => { console.error(e.message); process.exitCode = 1; }).finally(() => { socket?.close(); chrome.kill(); });
