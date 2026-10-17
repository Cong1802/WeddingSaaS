import fs from 'node:fs';import{parseHTML}from'linkedom';
const base='public/templates/mau-thiep-8';const{document:d}=parseHTML(fs.readFileSync(`${base}/mau-thiep-8.html`,'utf8'));
// The new image contains both folded upper corners as one continuous pocket.
// Remove the older rear envelope and the added corner rather than stacking them.
d.querySelectorAll('.royal-right-flap,.royal-envelope-back').forEach(x=>x.remove());
d.querySelector('.royal-pocket-art').src='./assets/envelope-continuous-clean-v5.png';
d.querySelector('link[href*="template8.css"]').href='./assets/template8.css?v=single-envelope-20261017-14';
fs.writeFileSync(`${base}/mau-thiep-8.html`,'<!DOCTYPE html>\n'+d.documentElement.outerHTML);
const p=`${base}/assets/template8.css`;let s=fs.readFileSync(p,'utf8');s=s.replace(/\.royal-right-flap\{[^}]+\}/g,'').replace(/\.royal-envelope-back\{[^}]+\}/g,'');fs.writeFileSync(p,s);
