import {readFileSync} from 'node:fs';import {parseHTML} from 'linkedom';import assert from 'node:assert/strict';
const paths=['C:/Users/Administrator/Pictures/template thiệp 1/Thiệp Mời Cưới Mẫu Pearl - GÓI VIP.html','laravel-backend/public/templates/pearl/pearl.html'];
for(const path of paths){const {document:d}=parseHTML(readFileSync(path,'utf8'));console.log(JSON.stringify({path,title:d.title,headings:[...d.querySelectorAll('h1,h2,h3')].map(e=>e.textContent.trim()).filter(Boolean).slice(0,8)}));}
const response=await fetch('http://127.0.0.1:8000/templates/pearl/pearl.html');console.log('HTTP',response.status);
