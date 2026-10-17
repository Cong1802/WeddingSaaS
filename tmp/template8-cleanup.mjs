import fs from 'node:fs';import{parseHTML}from'linkedom';
const base='public/templates/mau-thiep-8';const{document:d}=parseHTML(fs.readFileSync(`${base}/mau-thiep-8.html`,'utf8'));
for(const x of d.querySelectorAll('img[src*="flower2-decoration"]'))(x.closest('span[aria-hidden="true"]')||x).remove();
for(const x of d.querySelectorAll('img[src*="paper.webp"],img[src*="castle-background"],img[src*="papernote-background"]'))x.remove();
for(const x of d.querySelectorAll('[style]'))if(/paper\.webp/.test(x.getAttribute('style')))x.remove();
for(const x of d.querySelectorAll('img[src*="minimalism_darkred"]')){x.src='./assets/royal-pocket-cutout.png';x.className='royal-gift-art';x.removeAttribute('style');}
d.querySelector('.royal-envelope-back').src='./assets/royal-back-cutout.png';
for(const x of d.querySelectorAll('link[href*="royal-burgundy"],link[href*="mobile-layers"]'))x.remove();
const style=d.createElement('link');style.rel='stylesheet';style.href='./assets/template8.css?v=clean-20261017-3';d.head.appendChild(style);
d.querySelector('script[src*="royal-scene.js"]').src='./assets/royal-scene.js?v=clean-20261017-3';
// Use real ornamental paths rather than a font-dependent corner glyph.
const ornament='<svg viewBox="0 0 60 60" fill="none" aria-hidden="true"><g stroke="currentColor" stroke-width="1.2"><path d="M3 57V3h54M8 51V8h43M7 8c24 0 4 28 23 23 13-4-1-21-8-11-5 9 17 14 21-4M8 8c0 24 28 4 23 23-4 13-21-1-11-8 9-5 14 17-4 21M9 10c6 7 7 16 3 24M10 9c7 6 16 7 24 3"/><path d="M12 34c-7 6-8 11-4 15 9 1 11-9 4-15ZM34 12c6-7 11-8 15-4 1 9-9 11-15 4Z"/></g></svg>';
for(const x of d.querySelectorAll('.royal-corner'))x.innerHTML=ornament;
fs.writeFileSync(`${base}/mau-thiep-8.html`,'<!DOCTYPE html>\n'+d.documentElement.outerHTML);
