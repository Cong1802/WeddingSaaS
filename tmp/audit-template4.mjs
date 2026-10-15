import {readFileSync} from 'node:fs';
import {parseHTML} from 'linkedom';
const {document:d}=parseHTML(readFileSync('C:/Users/Administrator/Pictures/template thiệp 4/Thư Mời Lễ Cưới Phương Linh & Văn Đạt.html','utf8'));
console.log('scripts', [...d.querySelectorAll('script')].map(s=>({src:s.src, id:s.id, size:s.textContent.length, start:s.textContent.slice(0,220)})));
console.log('links',[...d.querySelectorAll('link')].map(s=>s.outerHTML));
console.log('texts',[...d.querySelectorAll('.ladi-headline,.ladi-paragraph')].map(s=>[s.parentElement.id,s.textContent]));
console.log('iframes',[...d.querySelectorAll('iframe')].map(s=>s.outerHTML.slice(0,400)));
