import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import assert from 'node:assert/strict';

const source='laravel-backend/public/templates/mau-thiep-2/w.ladicdn.com/644bd195fdccd700206206ea/imgi_8_thiet-ke-chua-co-ten-1-20260614052835-lwso_-20260827085346-mytm-.gif';
const assets='laravel-backend/public/templates/mau-thiep-8/assets';
const basename='royal-butterflies-burgundy-gold-v1';
const reference=path.join(assets,'royal-butterflies-burgundy-gold-reference-v1.png');
const {data,info}=await sharp(reference).resize({width:836}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
const reds=[];
const golds=[];
const luminance=([r,g,b])=>(.2126*r+.7152*g+.0722*b)/255;
for(let offset=0;offset<data.length;offset+=info.channels*2){
  const [r,g,b,a]=data.subarray(offset,offset+4);
  if(a<200)continue;
  const pixel=[r,g,b];
  if(r>g*1.3&&r>b*1.08)reds.push(pixel);
  if(r>g*1.05&&r<g*1.8&&g>b*1.25)golds.push(pixel);
}
assert.ok(reds.length>500&&golds.length>50,'Generated color reference contains the burgundy and gold palette');
reds.sort((a,b)=>luminance(a)-luminance(b));
golds.sort((a,b)=>luminance(a)-luminance(b));
const quantile=(list,q)=>list[Math.min(list.length-1,Math.floor(q*(list.length-1)))];
const gold=quantile(golds,.8);
const stops=[
  [0,quantile(reds,.01)],
  [.35,quantile(reds,.05)],
  [.65,quantile(reds,.25)],
  [.86,quantile(reds,.6)],
  [.96,[226,207,171]],
  [1,[246,237,219]]
];
const blend=(a,b,amount)=>a.map((value,index)=>Math.round(value*(1-amount)+b[index]*amount));
const recolor=(rgb)=>{
  const light=luminance(rgb);
  let upper=stops.findIndex(([position])=>position>=light);
  if(upper<1)upper=1;
  const [start,first]=stops[upper-1];
  const [end,last]=stops[upper];
  const wine=blend(first,last,Math.max(0,Math.min(1,(light-start)/(end-start))));
  // The original fine dark green veins become restrained antique-gold accents.
  const veinGold=.7*Math.exp(-.5*((light-.34)/.085)**2);
  return blend(wine,gold,veinGold);
};

// Change GIF color tables, leaving every frame, position, alpha index and delay intact.
const buffer=Buffer.from(await fs.readFile(source));
let cursor=13;
let frames=0;
let palettes=0;
const mapPalette=(count)=>{
  for(let index=0;index<count;index++){
    const offset=cursor+index*3;
    const rgb=recolor([buffer[offset],buffer[offset+1],buffer[offset+2]]);
    for(let channel=0;channel<3;channel++)buffer[offset+channel]=rgb[channel];
  }
  cursor+=count*3;
  palettes++;
};
const skipSubBlocks=()=>{
  for(;;){const length=buffer[cursor++];if(!length)break;cursor+=length;}
};
if(buffer[10]&128)mapPalette(1<<((buffer[10]&7)+1));
while(cursor<buffer.length){
  const block=buffer[cursor++];
  if(block===0x3b)break;
  if(block===0x21){cursor++;skipSubBlocks();continue;}
  assert.equal(block,0x2c,'Valid GIF image descriptor');
  const packed=buffer[cursor+8];
  cursor+=9;
  if(packed&128)mapPalette(1<<((packed&7)+1));
  cursor++; // LZW minimum code size; the image payload remains unchanged.
  skipSubBlocks();
  frames++;
}
assert.equal(frames,156);
const full='tmp/gif-reference/royal-butterflies-full-recolored.gif';
await fs.writeFile(full,buffer);
console.log(JSON.stringify({frames,palettes,referenceColors:{wine:stops.map(([,rgb])=>rgb),gold}}));

const gifPath=path.join(assets,`${basename}.gif`);
await sharp(full,{animated:true}).resize({width:768}).gif({colours:256,dither:.15,effort:7,interFrameMaxError:0,keepDuplicateFrames:true}).toFile(gifPath);
console.log(`GIF saved: ${(await fs.stat(gifPath)).size} bytes`);
const webpPath=path.join(assets,`${basename}.webp`);
await sharp(full,{animated:true}).resize({width:768}).webp({quality:84,alphaQuality:100,effort:4,loop:0}).toFile(webpPath);
console.log(`Animated WebP saved: ${(await fs.stat(webpPath)).size} bytes`);

const original=await sharp(source,{animated:true}).metadata();
for(const target of [gifPath,webpPath]){
  const metadata=await sharp(target,{animated:true}).metadata();
  assert.equal(metadata.pages,original.pages,'All animation frames are preserved');
  assert.deepEqual(metadata.delay,original.delay,'Original animation timing is preserved');
  assert.equal(metadata.hasAlpha,true,'Transparent background is preserved');
  assert.equal(metadata.loop,0,'Infinite loop');
  console.log(JSON.stringify({path:target,width:metadata.width,height:metadata.pageHeight,frames:metadata.pages,bytes:(await fs.stat(target)).size}));
  for(const mirror of ['public/templates/mau-thiep-8/assets','laravel-backend/public/dist/templates/mau-thiep-8/assets'])await fs.copyFile(target,path.join(mirror,path.basename(target)));
}
await sharp(gifPath,{page:0}).png().toFile('tmp/gif-reference/royal-result-frame-0.png');
const indices=[0,31,62,93,124,155];
const contact=await Promise.all(indices.map(async(page,index)=>({input:await sharp(gifPath,{page}).resize(300,300,{fit:'contain',background:'#f2e8d8'}).flatten({background:'#f2e8d8'}).png().toBuffer(),left:index%3*300,top:Math.floor(index/3)*300})));
await sharp({create:{width:900,height:600,channels:4,background:'#f2e8d8'}}).composite(contact).png().toFile('tmp/gif-reference/royal-result-contact.png');
await fs.writeFile('tmp/gif-reference/royal-result-info.json',JSON.stringify({source,reference,frames,palettes,gifPath,webpPath,referenceColors:{stops,gold}},null,2));
