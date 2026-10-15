import {readFileSync,writeFileSync,copyFileSync} from 'node:fs';import {parseHTML} from 'linkedom';
for(const root of ['public/templates/minimalism_red','laravel-backend/public/templates/minimalism_red']){
 const {document:d}=parseHTML(readFileSync(root+'/minimalism_red.html','utf8'));
 d.documentElement.setAttribute('data-minimal-opened','false');
 const css=d.createElement('link');css.rel='stylesheet';css.href='./opening.css?v=1';d.head.appendChild(css);
 const gate=d.createElement('div');gate.id='minimal-opening';gate.dataset.state='idle';gate.setAttribute('role','dialog');gate.setAttribute('aria-label','Mở thiệp cưới');gate.setAttribute('aria-modal','true');
 gate.innerHTML=`<div class="minimal-opening-card"><img class="minimal-opening-flower left" src="./minimalism_red_files/flower2-decoration.webp" alt=""><img class="minimal-opening-flower right" src="./minimalism_red_files/flower2-decoration.webp" alt=""><div class="minimal-opening-seal" aria-hidden="true">♥</div><h1 class="minimal-opening-names"><span>Đức Long</span><small>&amp;</small><span>Hương Châu</span></h1><div class="minimal-opening-ornament" aria-hidden="true">── ❦ ──</div><p class="minimal-opening-date">3 tháng 1, 2026</p><p class="minimal-opening-greeting">Thân Mời</p><button type="button">Mở thiệp</button></div>`;
 d.body.appendChild(gate);const script=d.createElement('script');script.src='./opening.js?v=1';d.body.appendChild(script);
 writeFileSync(root+'/minimalism_red.html','<!doctype html>\n'+d.documentElement.outerHTML);
 if(root.startsWith('laravel'))for(const name of ['opening.js','opening.css'])copyFileSync('public/templates/minimalism_red/'+name,root+'/'+name);
}
