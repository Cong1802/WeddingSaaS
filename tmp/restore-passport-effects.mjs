import {readFileSync,writeFileSync} from 'node:fs';import {parseHTML} from 'linkedom';
const {document:o}=parseHTML(readFileSync('C:/Users/Administrator/Pictures/template thiệp 4/Thư Mời Lễ Cưới Phương Linh & Văn Đạt.html','utf8'));
const events=JSON.parse(o.querySelector('#script_event_data').textContent);
const aliases={PARAGRAPH61:'PARAGRAPH3',PARAGRAPH60:'PARAGRAPH5',HEADLINE16:'PARAGRAPH2',PARAGRAPH54:'PARAGRAPH6',PARAGRAPH53:'PARAGRAPH8',PARAGRAPH58:'PARAGRAPH9',PARAGRAPH56:'HEADLINE3',IMAGE35:'IMAGE3',BUTTON5:'BUTTON10'};
const originalIds=[...o.querySelectorAll('[id]')].map(e=>e.id);const rename=id=>aliases[id]||'passport-'+id;
for(const e of o.querySelectorAll('script,link,meta[property],meta[name="description"],audio,#toggleMusic,.snowflakes,.hearts,#SECTION_POPUP,#BUTTON3,#FORM2,#PARAGRAPH80,#PARAGRAPH81'))e.remove();
const urls=[...new Set([...o.documentElement.outerHTML.matchAll(/https:\/\/[^\s"'()<>]+/g)].map(m=>m[0]).filter(u=>/\.(png|jpe?g|webp|gif)(\?|$)/i.test(u)))];
const urlMap=new Map(urls.map((url,i)=>[url,`./assets/image-${String(i+1).padStart(3,'0')}.${url.match(/\.(png|jpe?g|webp|gif)/i)[1]}`]));
for(const root of ['public/templates/passport','laravel-backend/public/templates/passport']){
 const {document:d}=parseHTML(readFileSync(root+'/index.html','utf8'));
 for(const id of ['style_ladi','style_element']){let css=o.getElementById(id).textContent;css=css.replace(/#([A-Za-z][\w-]*)/g,(m,id)=>originalIds.includes(id)?'#'+rename(id):m);for(const [url,local] of urlMap)css=css.split(url).join(local);d.getElementById('passport-'+id).textContent=css;}
 for(const style of d.querySelectorAll('style')){style.textContent=style.textContent.replace('.ladi-animation{animation:none!important;opacity:1!important}','').replace('body,img,p,div,span,a{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}img{pointer-events:none}','');}
 const style=d.createElement('style');style.id='passport-restored-effects';style.textContent=`
 #passport-IMAGE6{animation:passport-globe-spin 3s linear infinite;transform-origin:center}
 @keyframes passport-globe-spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
 .passport-particles{position:fixed;inset:0;z-index:1000;pointer-events:none;overflow:hidden}
 .passport-particle{position:absolute;top:-40px;pointer-events:none;animation:passport-fall var(--duration) linear forwards;will-change:transform}
 .passport-heart{color:#ff5687;text-shadow:0 1px 4px #ffb0c4}
 .passport-snow{color:#fff;text-shadow:0 0 3px #999}
 @keyframes passport-fall{from{transform:translate(0,-30px) rotate(0);opacity:.85}to{transform:translate(var(--drift),110vh) rotate(35deg);opacity:.25}}
 @media(prefers-reduced-motion:reduce){.passport-particles{display:none}#passport-IMAGE6{animation:none}}
 `;d.head.appendChild(style);
 const animations=Object.entries(events).filter(([id,e])=>e.D&&d.getElementById(rename(id))).map(([id,e])=>({id:rename(id),name:e.D,duration:e.D==='pulse'?3:1.2,repeat:e.D==='pulse'}));
 writeFileSync(root+'/assets/animations.json',JSON.stringify(animations));
 writeFileSync(root+'/index.html','<!doctype html>\n'+d.documentElement.outerHTML);
}
console.log('Restored original layout CSS and animation metadata.');
