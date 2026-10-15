import {parseHTML} from 'linkedom';import {readFileSync} from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';const {document,window}=parseHTML(readFileSync('public/templates/passport/index.html','utf8'));
window.innerWidth=390;
vm.runInNewContext(readFileSync('public/templates/passport/assets/passport.js','utf8'),{document,window,Date,Math,String,setInterval:()=>0,setTimeout:()=>0});
assert(document.querySelector('#passport-SECTION2').textContent.includes('Tháng 9 - 2026'));
assert(document.querySelector('#passport-IMAGE103'), 'Calendar must retain airplane');
const cover=document.querySelector('#passport-TAB_ITEM1');document.querySelector('#passport-T01').dispatchEvent(new window.Event('click'));
assert.equal(cover.style.display,'none');assert.equal(document.querySelector('#passport-TAB_ITEM2').style.display,'block');assert(document.querySelector('#passport-IMAGE103').style.animation.includes('passport-takeoff'));
console.log('PASS: passport opens, calendar renders and runtime executes without publisher code.');
