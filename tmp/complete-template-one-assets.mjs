import {readFileSync,writeFileSync,mkdirSync,copyFileSync} from 'node:fs';
const source='C:/Users/Administrator/Pictures/template thiệp 4/Thư Mời Lễ Cưới Phương Linh & Văn Đạt_files';
const fonts=await fetch('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&family=Quicksand:wght@400;700&family=Cormorant+Upright:wght@400;700&family=Oswald:wght@400;700&family=Philosopher:wght@400;700&family=Tinos:wght@400;700&family=Lora:wght@400;700&family=Judson:wght@400;700&display=swap');if(!fonts.ok)throw Error(fonts.status);const css=await fonts.text();
for(const root of ['public/templates/mau-thiep-1','laravel-backend/public/templates/mau-thiep-1']){
mkdirSync(root+'/assets',{recursive:true});
copyFileSync(source+'/ladipagev3.min.js.tải xuống',root+'/assets/ladipage.js');copyFileSync(source+'/ladipage.formdata.min.js.tải xuống',root+'/assets/ladipage-formdata.js');copyFileSync(source+'/musical-notes.png',root+'/assets/musical-notes.png');writeFileSync(root+'/assets/fonts.css',css);
const path=root+'/mau-thiep-1.html';let html=readFileSync(path,'utf8');html=html.replaceAll('./Thư Mời Lễ Cưới_files/css2','./assets/fonts.css').replaceAll('./Thư Mời Lễ Cưới_files/ladipagev3.min.js.tải xuống','./assets/ladipage.js').replaceAll('./Thư Mời Lễ Cưới_files/ladipage.formdata.min.js.tải xuống','./assets/ladipage-formdata.js').replaceAll('./Thư Mời Lễ Cưới_files/musical-notes.png','./assets/musical-notes.png');writeFileSync(path,html);
}
console.log('Recovered missing local dependencies for design 1 with usable JS filenames.');
