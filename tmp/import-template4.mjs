import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {parseHTML} from 'linkedom';
const source='C:/Users/Administrator/Pictures/template thiệp 4/Thư Mời Lễ Cưới Phương Linh & Văn Đạt.html';
const {document:d}=parseHTML(readFileSync(source,'utf8'));
for(const e of d.querySelectorAll('script,link,meta[property],meta[name="description"],audio,#toggleMusic,.snowflakes,.hearts,#SECTION_POPUP,#BUTTON3'))e.remove();
// The original form posts to the original publisher. RSVP is handled by the SaaS guest page.
for(const e of d.querySelectorAll('#FORM2,#PARAGRAPH80,#PARAGRAPH81'))e.remove();
for(const e of d.querySelectorAll('*'))for(const a of [...e.attributes])if(/^on/i.test(a.name)||a.name==='data-action')e.removeAttribute(a.name);
d.documentElement.className=''; d.documentElement.setAttribute('data-template','passport');d.title='Thiệp cưới Passport – Hành trình yêu thương';
const bindings={groomName:['HEADLINE18','PARAGRAPH2','PARAGRAPH61','PARAGRAPH85'],brideName:['HEADLINE17','PARAGRAPH1','PARAGRAPH60','PARAGRAPH83'],weddingDate:['HEADLINE16','PARAGRAPH4','PARAGRAPH64'],groomParents:['PARAGRAPH53'],brideParents:['PARAGRAPH58'],groomAddress:['PARAGRAPH54'],brideAddress:['PARAGRAPH59','PARAGRAPH67'],title:['PARAGRAPH56']};
for(const [field,ids] of Object.entries(bindings))for(const id of ids){const e=d.getElementById(id)?.querySelector('.ladi-headline,.ladi-paragraph');if(e)e.setAttribute('data-card-field',field);}
const aliases={PARAGRAPH61:'PARAGRAPH3',PARAGRAPH60:'PARAGRAPH5',HEADLINE16:'PARAGRAPH2',PARAGRAPH54:'PARAGRAPH6',PARAGRAPH53:'PARAGRAPH8',PARAGRAPH58:'PARAGRAPH9',PARAGRAPH56:'HEADLINE3',IMAGE35:'IMAGE3',BUTTON5:'BUTTON10'};
const ids=[...d.querySelectorAll('[id]')].map(e=>e.id);const renames=new Map(ids.map(id=>[id,aliases[id]||'passport-'+id]));
for(const e of d.querySelectorAll('[id]'))e.id=renames.get(e.id);
for(const style of d.querySelectorAll('style'))style.textContent=style.textContent.replace(/#([A-Za-z][\w-]*)/g,(m,id)=>renames.has(id)?'#'+renames.get(id):m);
const opener=d.getElementById('passport-T01');opener?.setAttribute('role','button');opener?.setAttribute('tabindex','0');opener?.setAttribute('aria-label','Mở thiệp cưới');
const css=d.createElement('style');css.textContent=`html,body{overflow-x:hidden}body{margin:0}.ladi-animation{animation:none!important;opacity:1!important}.ladi-lazyload{background-image:inherit}#passport-T01{cursor:pointer}#passport-TAB_ITEM1{display:none}#passport-TAB_ITEM2{display:block}#passport-PARAGRAPH106{pointer-events:none}#passport-PARAGRAPH65{display:none}.ladi-form{display:none!important}@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}`;d.head.appendChild(css);
const fonts=d.createElement('link');fonts.rel='stylesheet';fonts.href='./assets/fonts.css';d.head.appendChild(fonts);
const script=d.createElement('script');script.src='./assets/passport.js';script.defer=true;d.body.appendChild(script);
let html='<!doctype html>\n'+d.documentElement.outerHTML;html=html.replace(/<!--[^]*?-->/g,'');
const urls=[...new Set([...html.matchAll(/https:\/\/[^\s"'()<>]+/g)].map(m=>m[0]).filter(u=>/\.(png|jpe?g|webp|gif)(\?|$)/i.test(u)))];
const root='public/templates/passport';mkdirSync(root+'/assets',{recursive:true});
const queue=urls.map((url,i)=>({url,name:`image-${String(i+1).padStart(3,'0')}.${url.match(/\.(png|jpe?g|webp|gif)/i)[1]}`}));
for(let i=0;i<queue.length;i+=6)await Promise.all(queue.slice(i,i+6).map(async({url,name})=>{const res=await fetch(url);if(!res.ok)throw new Error(`${res.status}: ${url}`);writeFileSync(root+'/assets/'+name,Buffer.from(await res.arrayBuffer()));html=html.split(url).join('./assets/'+name);}));
writeFileSync(root+'/index.html',html);
writeFileSync(root+'/assets/fonts.css',readFileSync('C:/Users/Administrator/Pictures/template thiệp 4/Thư Mời Lễ Cưới Phương Linh & Văn Đạt_files/css2'));
const thumbnail=queue.find(x=>x.url.includes('daafa-'));writeFileSync('tmp/passport-thumbnail.txt',thumbnail.name);
console.log(`Cleaned HTML; downloaded ${queue.length} images. Thumbnail: ${thumbnail.name}`);
