import {readFileSync,writeFileSync} from 'node:fs';import {parseHTML} from 'linkedom';
const address='The Adora Center, 431 Hoàng Văn Thụ, Tân Bình, TP.HCM';
for(const root of ['public/templates/minimalism_red','laravel-backend/public/templates/minimalism_red']){
const {document:d}=parseHTML(readFileSync(root+'/minimalism_red.html','utf8'));
for(const iframe of d.querySelectorAll('iframe'))if(iframe.getAttribute('src')?.includes('maps.html')){
iframe.src='https://www.google.com/maps?q='+encodeURIComponent(address)+'&output=embed';
iframe.setAttribute('referrerpolicy','no-referrer-when-downgrade');iframe.setAttribute('title','Bản đồ '+address);
}
for(const link of d.querySelectorAll('a'))if(link.textContent.trim()==='Chỉ đường'){
link.setAttribute('href','https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent(address));link.target='_blank';link.rel='noopener noreferrer';
}
writeFileSync(root+'/minimalism_red.html','<!doctype html>\n'+d.documentElement.outerHTML);
}
console.log('Replaced saved map HTML with live Google Maps embed and corrected directions encoding.');
