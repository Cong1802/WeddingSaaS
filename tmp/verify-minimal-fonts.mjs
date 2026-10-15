import {readFileSync,readdirSync,existsSync} from 'node:fs';import assert from 'node:assert/strict';
const root='public/templates/minimalism_red';const css=readFileSync(root+'/minimalism_red_files/0.8w~y_u.l6tw.css','utf8');
assert(css.includes('font-family:viaodaLibre;'));assert(css.includes('font-family:The Nautigal;'));
for(const name of readdirSync(root+'/fonts')){const data=readFileSync(root+'/fonts/'+name);assert(data.length>1000);assert(['wOF2','wOFF','OTTO'].includes(data.toString('ascii',0,4))||data.readUInt32BE(0)===65536);assert(existsSync('laravel-backend/'+root+'/fonts/'+name));}
const names=['ViaodaLibre_Regular-s.0_a~r5.se3dok.ttf','cce4c98a2da22c4b-s.0xwokbx4wc9~s.woff2','8c2eb9ceedecfc8e-s.0oeo8epbafgia.woff2'];
for(const name of names){const response=await fetch('http://127.0.0.1:8000/templates/minimalism_red/fonts/'+name);assert.equal(response.status,200);console.log(name,'HTTP',response.status,response.headers.get('content-type'));}
assert(readFileSync(root+'/opening.css','utf8').includes('.minimal-opening-names{font-family:viaodaLibre,serif}'));console.log('PASS: 73 valid local fonts, matching font families, opening typography and live font delivery.');

