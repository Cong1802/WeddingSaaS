import {readFileSync,existsSync} from 'node:fs';import {parseHTML} from 'linkedom';import assert from 'node:assert/strict';import path from 'node:path';
const missing=[];
for(let number=1;number<=5;number++){
const relative=`templates/mau-thiep-${number}/mau-thiep-${number}.html`;const response=await fetch('http://127.0.0.1:8000/'+relative);assert.equal(response.status,200);const {document:d}=parseHTML(await response.text());let checked=0;
for(const element of d.querySelectorAll('[src],[href]')){const url=element.getAttribute('src')||element.getAttribute('href');if(!url||/^(https?:|data:|tel:|mailto:|javascript:|chrome-extension:|#)/.test(url))continue;const clean=decodeURIComponent(url.split('?')[0].split('#')[0]);const file=clean.startsWith('/')?'laravel-backend/public'+clean:path.join('laravel-backend/public',path.dirname(relative),clean);if(!existsSync(file))missing.push({number,url});checked++;}
console.log(`Design ${number}: HTTP 200, ${checked} local dependencies checked.`);
}
console.log('Missing references:',JSON.stringify(missing.slice(0,12)));assert.equal(missing.length,0);
for(const url of ['/template.html','/templates/passport/index.html','/templates/minimalism_red/minimalism_red.html','/templates/pearl/pearl.html']){const r=await fetch('http://127.0.0.1:8000'+url,{redirect:'manual'});assert.equal(r.status,302);assert(r.headers.get('location').includes('mau-thiep-'));}
const catalog=await(await fetch('http://127.0.0.1:8000/api/public/templates')).json();for(const template of catalog.templates)assert(template.file_url.match(/^\/templates\/mau-thiep-\d+\/mau-thiep-\d+\.html$/));console.log('PASS: canonical HTMLs, all local dependencies, legacy redirects and stored catalog paths.');
