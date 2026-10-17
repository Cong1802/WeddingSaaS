import fs from 'node:fs';
import { parseHTML } from 'linkedom';

const base = 'public/templates/mau-thiep-8';
const { document } = parseHTML(fs.readFileSync(`${base}/mau-thiep-8.html`, 'utf8'));
document.title = 'Thiệp cưới Đức Long & Hương Châu | Mẫu 8';
document.documentElement.dataset.designNumber = '8';
document.documentElement.dataset.minimalOpened = 'true';
document.querySelector('#minimal-opening')?.remove();
document.querySelector('script[src*="opening.js"]')?.remove();
document.querySelector('link[href*="opening.css"]')?.remove();
const style = document.createElement('link');
style.rel = 'stylesheet';
style.href = './assets/royal-burgundy.css?v=20261017';
document.head.appendChild(style);
const container = document.querySelector('[data-testid] > div');
container.classList.add('royal-invitation');
const header = container.querySelector('header');
header.className = 'royal-hero';
header.innerHTML = `<div class="royal-corner corner-left" aria-hidden="true">❦</div><div class="royal-corner corner-right" aria-hidden="true">❦</div>
  <p class="royal-eyebrow">SAVE THE DATE</p>
  <div class="royal-divider" aria-hidden="true"><span>✥</span></div>
  <img class="royal-envelope" src="./assets/royal-envelope.png" alt="Ảnh cô dâu chú rể trong phong bì đỏ rượu vang, hoa hồng và con dấu sáp vàng" fetchpriority="high" width="1024" height="1280">
  <h1 class="royal-names"><span>Đức Long</span><em>&amp;</em><span>Hương Châu</span></h1>
  <div class="royal-divider royal-divider-bottom" aria-hidden="true"><span>✥</span></div>`;
container.querySelector(':scope > section').classList.add('royal-ceremony');
fs.writeFileSync(`${base}/mau-thiep-8.html`, '<!DOCTYPE html>\n' + document.documentElement.outerHTML);
const interactions = `${base}/assets/local-interactions.js`;
fs.writeFileSync(interactions, fs.readFileSync(interactions, 'utf8').replace('if(number===3){', 'if(number===3||number===8){'));
