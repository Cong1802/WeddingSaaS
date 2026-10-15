import {readFileSync} from 'node:fs';import {parseHTML} from 'linkedom';import vm from 'node:vm';import assert from 'node:assert/strict';
for(let number=1;number<=5;number++){
const root=`public/templates/mau-thiep-${number}`;const html=readFileSync(`${root}/mau-thiep-${number}.html`,'utf8');const {document,window}=parseHTML(html);window.innerWidth=420;window.location={search:""};window.scrollTo=()=>{};window.scrollBy=()=>{};window.top=window;window.self=window;
for(const form of document.querySelectorAll('form')){form.reportValidity=()=>true;form.requestSubmit=()=>form.dispatchEvent(new window.Event('submit',{cancelable:true}));}
for(const audio of document.querySelectorAll('audio')){audio.play=()=>Promise.resolve();audio.pause=()=>{};}
const timers=[];const context={window,document,console,Math,Date,String,Number,Array,JSON,Map,URL,URLSearchParams,CustomEvent:window.Event,MutationObserver:class{observe(){}disconnect(){}},navigator:{clipboard:{writeText:async()=>{}}},localStorage:{getItem:()=>null,setItem:()=>{}},setInterval:()=>1,clearInterval:()=>{},setTimeout:(fn,delay)=>{timers.push({fn,delay});return 1;},clearTimeout:()=>{},requestAnimationFrame:()=>1,cancelAnimationFrame:()=>{},alert:()=>{},fetch:()=>{throw Error('Unexpected network call while loading template');}};
const beforeImages=document.querySelectorAll('img,.ladi-image').length;
for(const script of document.querySelectorAll('script')){if(script.type==='application/json')continue;const src=script.getAttribute('src');const code=src?readFileSync(root+'/'+src.split('?')[0].replace(/^\.\//,''),'utf8'):script.textContent;vm.runInNewContext(code,context,{timeout:3000});}
document.dispatchEvent(new window.Event('DOMContentLoaded'));
assert.equal(document.querySelectorAll('img,.ladi-image').length>=beforeImages,true);
const csp=document.querySelector('meta[http-equiv="Content-Security-Policy"]');assert(csp.content.includes("connect-src 'self'"));
if(number===2){assert.equal(document.documentElement.dataset.invitationClosed,'true');document.getElementById('T01').dispatchEvent(new window.Event('click',{cancelable:true}));assert.equal(document.documentElement.dataset.invitationClosed,'false');}
if(number===3){const gate=document.getElementById('minimal-opening');assert(gate);gate.querySelector('button').dispatchEvent(new window.Event('click'));timers.find(t=>t.delay===500).fn();assert.equal(gate.querySelectorAll('.minimal-opening-burst').length,28);timers.find(t=>t.delay===1300).fn();assert.equal(document.documentElement.dataset.minimalOpened,'true');}
if(number===4){assert.equal(document.documentElement.dataset.passportState,'closed');document.getElementById('passport-T01').dispatchEvent(new window.Event('click'));assert.equal(document.documentElement.dataset.passportState,'open');assert.equal(document.querySelectorAll('.passport-particle').length,8);}
assert(![...document.querySelectorAll('script[src],img[src],audio[src],source[src],iframe[src],link[href]')].some(e=>/^https?:/.test(e.getAttribute('src')||e.getAttribute('href'))));
console.log(`PASS design ${number}: scripts run without network, images retained, local-only loaded resources and CSP.`);
}

