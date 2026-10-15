import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';import {parseHTML} from 'linkedom';import {syncPassportTemplate} from '../src/templates/passportTemplate.js';
const html=readFileSync('public/templates/passport/index.html','utf8');const {document:d}=parseHTML(html);
assert(!/chrome-extension:|new Function|ldpform|lovecard\.click|10003972660/.test(html));
const ids=[...d.querySelectorAll('[id]')].map(e=>e.id);assert.equal(ids.length,new Set(ids).size);
for(const e of d.querySelectorAll('[src],[href]')){const url=e.getAttribute('src')||e.getAttribute('href');if(url?.startsWith('./'))assert(existsSync('public/templates/passport/'+url.split('?')[0].slice(2)),url);}
syncPassportTemplate(d,{groomName:'Chú rể thử',brideName:'Cô dâu thử',weddingDate:'25/12/2026',groomAddress:'Địa chỉ thử'});
for(const e of d.querySelectorAll('[data-card-field="groomName"]'))assert.equal(e.textContent,'Chú rể thử');
for(const e of d.querySelectorAll('[data-card-field="brideName"]'))assert.equal(e.textContent,'Cô dâu thử');
assert.equal(d.querySelector('#passport-PARAGRAPH5').textContent,'Ngày');
const data=await(await fetch('http://127.0.0.1:8000/api/public/templates')).json();assert(data.templates.some(t=>t.code==='template_passport'));
for(const url of ['/templates/passport/index.html','/templates/passport/assets/passport.js','/templates/passport/assets/image-004.png'])assert.equal((await fetch('http://127.0.0.1:8000'+url)).status,200);
console.log('PASS: clean HTML, unique IDs, local resources, repeated fields, unchanged countdown labels, live catalog and HTTP assets.');
