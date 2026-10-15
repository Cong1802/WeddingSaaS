import {readFileSync,writeFileSync} from 'node:fs';import {parseHTML} from 'linkedom';
for(let number=1;number<=5;number++){
const file=`public/templates/mau-thiep-${number}/mau-thiep-${number}.html`;const {document:d}=parseHTML(readFileSync(file,'utf8'));
d.documentElement.classList.remove('trancy-vi');
for(const node of d.querySelectorAll('script[src],link[rel="stylesheet"][href]')){const attr=node.tagName==='SCRIPT'?'src':'href';const url=node.getAttribute(attr);if(url?.startsWith('./'))node.setAttribute(attr,url.split('?')[0]+'?v=standalone-20261014');}
if(number===2){const node=d.getElementById('standalone-design-config');const config=JSON.parse(node.textContent);config.actions.forEach(action=>{if(action.a==='popup'&&action.dw==='POPUP2')action.dw='POPUP9';});node.textContent=JSON.stringify(config);}
writeFileSync(file,'<!doctype html>\n'+d.documentElement.outerHTML);
}
