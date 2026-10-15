import {readFileSync,writeFileSync,mkdirSync,cpSync} from 'node:fs';import {parseHTML} from 'linkedom';
mkdirSync('tmp/template-independent-backup',{recursive:true});
for(let number=1;number<=5;number++){
const root=`public/templates/mau-thiep-${number}`;cpSync(root,`tmp/template-independent-backup/mau-thiep-${number}`,{recursive:true});
const file=`${root}/mau-thiep-${number}.html`;const {document:d}=parseHTML(readFileSync(file,'utf8'));
for(const node of [...d.documentElement.children])if(!['HEAD','BODY'].includes(node.tagName))node.remove();
for(const node of d.querySelectorAll('link[rel="canonical"],link[rel="preconnect"],link[rel="dns-prefetch"],link[rel="preload"],meta[property],meta[name="twitter:card"],next-route-announcer'))node.remove();
if(number===1||number===2){
const events=JSON.parse(d.querySelector('#script_event_data').textContent);const animations=Object.entries(events).filter(([id,e])=>e.D&&d.getElementById(id)).map(([id,e])=>({id,name:e.D,repeat:e.D==='pulse'}));
const actions=Object.entries(events).flatMap(([id,e])=>(e.cs||[]).map(action=>({id,...action}))).filter(e=>!['phone'].includes(e.a)&&!(e.a==='link'&&!/maps/.test(e.dw||'')));
const config={width:420,animations,actions,tabs:Object.entries(events).filter(([id,e])=>e.a==='tabs').map(([id,e])=>({id,initial:e.aP})),countdowns:Object.entries(events).filter(([id,e])=>e.a==='countdown').map(([id,e])=>({id,date:e.bT})),countdownParts:Object.entries(events).filter(([id,e])=>e.a==='countdown_item').map(([id,e])=>({id,unit:e.bY}))};
mkdirSync(root+'/assets',{recursive:true});writeFileSync(root+'/assets/design-config.json',JSON.stringify(config));
for(const script of d.querySelectorAll('script'))script.remove();
for(const node of d.querySelectorAll('#live-editor-bar,#image-upload-input'))node.remove();
for(const [id,e] of Object.entries(events))if(e.cs?.some(a=>a.a==='phone'||a.a==='link'&&/lovecard|facebook|zalo|tiktok/.test(a.dw||'')))d.getElementById(id)?.remove();
const css=d.createElement('style');css.textContent=`body.lazyload{opacity:1}.ladi-animation{opacity:1}.ladi-lazyload{visibility:visible}html[data-invitation-closed=true],html[data-invitation-closed=true] body{overflow:hidden!important}html[data-invitation-closed=true] .ladi-wraper>.ladi-section:not(:first-child){visibility:hidden}html[data-invitation-closed=true] .ladi-wraper>.ladi-section:first-child{height:100vh!important;overflow:hidden}.standalone-popup-backdrop{position:fixed;inset:0;z-index:9998;background:#0007}.standalone-popup-close{position:absolute;right:12px;top:12px;z-index:10002;border:0;background:white;color:#4c2437;width:32px;height:32px;border-radius:50%;font-size:22px;cursor:pointer}.ladi-popup-container{z-index:9999}`;d.head.appendChild(css);
const configScript=d.createElement('script');configScript.type='application/json';configScript.id='standalone-design-config';configScript.textContent=JSON.stringify(config);d.body.appendChild(configScript);
const script=d.createElement('script');script.src='./assets/standalone.js';script.defer=true;d.body.appendChild(script);
}
if(number===3){for(const script of d.querySelectorAll('script'))if(!script.getAttribute('src')?.startsWith('./opening.js'))script.remove();for(const node of d.querySelectorAll('link[as="script"],section[aria-label="Notifications alt+T"]'))node.remove();}
if(number===5){const fake=d.querySelector('#wedding_rsvp_and_wishes_clean');if(fake){let text=fake.textContent;const start=text.indexOf('    // Submit Wish Event');const end=text.indexOf('    // Popup loop');fake.textContent=text.slice(0,start)+text.slice(end);}}
for(const node of d.querySelectorAll('[href]')){const href=node.getAttribute('href');if(/lovecard|zalo\.me|facebook\.com|tiktok\.com/.test(href||''))node.remove();}
for(const node of d.querySelectorAll('iframe[src^="http"]')){
const url=node.getAttribute('src');const card=d.createElement('div');card.className=node.className;card.style.cssText='display:flex;align-items:center;justify-content:center;padding:30px;text-align:center;background:#f1e6d8;';const link=d.createElement('a');link.href=url.replace('&output=embed','');link.target='_blank';link.rel='noopener noreferrer';link.textContent='📍 '+(node.getAttribute('title')||'Xem địa điểm')+' — Mở bản đồ';card.appendChild(link);node.replaceWith(card);
}
if(number!==4){const script=d.createElement('script');script.src='./assets/local-interactions.js';script.defer=true;d.body.appendChild(script);}
const csp=d.createElement('meta');csp.setAttribute('http-equiv','Content-Security-Policy');csp.content="default-src 'self' data: blob:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; media-src 'self' data: blob:; connect-src 'self'; frame-src 'self'; base-uri 'self'; form-action 'self'; object-src 'none'";d.head.prepend(csp);
writeFileSync(file,'<!doctype html>\n'+d.documentElement.outerHTML.replace(/<!--[^]*?-->/g,''));
console.log(`Prepared independent source ${number}.`);
}
