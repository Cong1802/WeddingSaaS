import fs from 'node:fs';import{parseHTML}from'linkedom';
const base='public/templates/mau-thiep-8';
const{document:d}=parseHTML(fs.readFileSync(`${base}/mau-thiep-8.html`,'utf8'));
d.querySelector('.royal-pocket-art').src='./assets/pocket-shadow-v3.png';
d.querySelector('.royal-wax-seal img').src='./assets/seal-shadow-v3.png';
for(const petal of d.querySelectorAll('.royal-petal')){const img=d.createElement('img');img.className=petal.className;img.dataset.layer=petal.dataset.layer;img.src='./assets/petal-shadow-v3.png';img.alt='';img.setAttribute('aria-hidden','true');petal.replaceWith(img);}
d.querySelector('link[href*="template8.css"]').href='./assets/template8.css?v=baked-shadows-20261017-12';
fs.writeFileSync(`${base}/mau-thiep-8.html`,'<!DOCTYPE html>\n'+d.documentElement.outerHTML);
const p=`${base}/assets/template8.css`;let css=fs.readFileSync(p,'utf8');
css=css.replace(/\.royal-pocket-art\{[^}]+\}/,`.royal-pocket-art{position:absolute;z-index:5;left:1.5%;bottom:5.5%;width:97%;height:52%;object-fit:fill;pointer-events:none;transform-origin:center bottom;transition:transform 1.2s ease}`);
css=css.replace(/\.royal-wax-seal img\{[^}]+\}/,`.royal-wax-seal img{position:relative;z-index:1;display:block;width:100%;height:100%;object-fit:contain}`);
css=css.replace('left:42%;top:64%;width:17%','left:39.5%;top:61.5%;width:22%');
css=css.replace(/\.royal-petal\{[^}]+\}/,`.royal-petal{position:absolute;z-index:7;width:10%;height:auto;pointer-events:none;object-fit:contain}`);
css=css.replace(/\.royal-petal-one\{[^}]+\}/,`.royal-petal-one{top:1%;left:13%;transform:rotate(48deg);animation:royal-petal-sway 9s ease-in-out infinite}`);
css=css.replace(/\.royal-petal-two\{[^}]+\}/,`.royal-petal-two{bottom:4%;left:19%;transform:rotate(15deg)}`);
css=css.replace(/\.royal-petal-three\{[^}]+\}/,`.royal-petal-three{right:1%;top:51%;width:9%;transform:rotate(-52deg)}`);
css=css.replace(/\.royal-scene:after\{[^}]+\}/,'');
fs.writeFileSync(p,css);
