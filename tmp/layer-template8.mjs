import fs from 'node:fs';
import {parseHTML} from 'linkedom';
const base='public/templates/mau-thiep-8';
const {document}=parseHTML(fs.readFileSync(`${base}/mau-thiep-8.html`,'utf8'));
const artwork=document.querySelector('.royal-envelope');
const scene=document.createElement('div');
scene.className='royal-scene';
scene.dataset.animation='idle';
scene.innerHTML=`
  <img class="royal-palace" data-layer="background" src="./assets/castle-background.webp" alt="" aria-hidden="true">
  <div class="royal-envelope-back" data-layer="envelope-back" aria-hidden="true"></div>
  <div class="royal-photo" data-layer="photo"><img src="./assets/7da552dc-ae82-4a2c-b48f-f8d480416d20.webp" alt="Đức Long và Hương Châu" fetchpriority="high" width="800" height="1066"></div>
  <div class="royal-flowers royal-flowers-left" data-layer="flowers-left" aria-hidden="true"><img src="./assets/flower2-decoration.webp" alt=""></div>
  <div class="royal-flowers royal-flowers-right" data-layer="flowers-right" aria-hidden="true"><img src="./assets/flower2-decoration.webp" alt=""></div>
  <div class="royal-envelope-pocket" data-layer="envelope-pocket" aria-hidden="true"></div>
  <div class="royal-envelope-wing royal-envelope-wing-left" data-layer="envelope-left" aria-hidden="true"></div>
  <div class="royal-envelope-wing royal-envelope-wing-right" data-layer="envelope-right" aria-hidden="true"></div>
  <div class="royal-envelope-front" data-layer="envelope-front" aria-hidden="true"></div>
  <button class="royal-wax-seal" data-layer="seal" type="button" aria-label="Mở phong bì cưới" aria-pressed="false"><span aria-hidden="true">♡</span></button>
  <span class="royal-petal royal-petal-one" data-layer="petal-one" aria-hidden="true"></span>
  <span class="royal-petal royal-petal-two" data-layer="petal-two" aria-hidden="true"></span>`;
artwork.replaceWith(scene);
document.querySelector('link[href*="royal-burgundy.css"]').href='./assets/royal-burgundy.css?v=layers-20261017';
const script=document.createElement('script');script.src='./assets/royal-scene.js?v=layers-20261017';document.body.appendChild(script);
fs.writeFileSync(`${base}/mau-thiep-8.html`,'<!DOCTYPE html>\n'+document.documentElement.outerHTML);
