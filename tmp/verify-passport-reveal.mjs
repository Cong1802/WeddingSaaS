import {readFileSync} from 'node:fs';import {parseHTML} from 'linkedom';import assert from 'node:assert/strict';import vm from 'node:vm';
const {document,window}=parseHTML(readFileSync('public/templates/passport/index.html','utf8'));window.innerWidth=420;
let notify;const observed=new Set();class IntersectionObserver{constructor(callback){notify=callback;}observe(el){observed.add(el);}unobserve(el){observed.delete(el);}}
vm.runInNewContext(readFileSync('public/templates/passport/assets/passport.js','utf8'),{document,window,IntersectionObserver,Date,Math,String,setInterval:()=>0,setTimeout:()=>0});
const element=document.getElementById('passport-GROUP9');const child=element.firstElementChild;
assert.equal(element.dataset.reveal,'pending');assert.equal(child.style.opacity,'0');assert.equal(child.style.animation,'none');
notify([{target:element,isIntersecting:false}]);assert.equal(child.style.opacity,'0');
notify([{target:element,isIntersecting:true}]);assert.equal(element.dataset.reveal,'visible');assert.equal(child.style.opacity,'1');assert(child.style.animation.includes('fadeInRight'));assert(!observed.has(element));
assert(observed.has(document.getElementById('passport-IMAGE36')));
console.log('PASS: section elements stay hidden before viewport entry, reveal with the correct animation on intersection, and are observed individually.');
