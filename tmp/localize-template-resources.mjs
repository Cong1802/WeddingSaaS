import {readFileSync,writeFileSync,mkdirSync,existsSync,statSync} from 'node:fs';import {createHash} from 'node:crypto';import {parseHTML} from 'linkedom';import path from 'node:path';
const report=[];
const externalPattern=/https?:\/\/[^\s"'<>\\)]+/g;
const isAsset=url=>/\.(png|jpe?g|webp|gif|svg|ico|woff2?|ttf|otf|mp3|m4a|ogg|wav|css|js)(?:[?#]|$)/i.test(url)||/fonts\.googleapis\.com\/(css|css2)/.test(url)||/fonts\.gstatic\.com\/l\/font/.test(url);
for(let number=1;number<=5;number++){
 const root=path.resolve(`public/templates/mau-thiep-${number}`);mkdirSync(root+'/assets/local',{recursive:true});const downloaded=new Map();const processing=new Set();const visited=new Set();const failures=[];
 const localFile=(base,url)=>{const clean=decodeURIComponent(url.split('?')[0].split('#')[0]);return path.resolve(path.dirname(base),clean);};
 async function download(raw){
  const normalized=raw.replace(/\r?\n\s*/g,'').trim().replaceAll('&amp;','&');
  if(downloaded.has(normalized))return downloaded.get(normalized);
  const job=(async()=>{
   const response=await fetch(normalized);if(!response.ok)throw Error(`${response.status} ${normalized}`);
   const mime=response.headers.get('content-type')||'';
   let ext=normalized.split('?')[0].match(/\.(png|jpe?g|webp|gif|svg|ico|woff2?|ttf|otf|mp3|m4a|ogg|wav|css|js)$/i)?.[1]?.toLowerCase();
   if(/css|fonts\.googleapis/.test(mime+' '+normalized))ext='css';
   if(!ext)ext=/woff2/.test(mime)?'woff2':/font|octet-stream/.test(mime)?'woff2':null;
   if(!ext)throw Error(`Unknown asset type ${mime}: ${normalized}`);
   if(mime.includes('text/html'))throw Error(`HTML returned for asset ${normalized}`);
   const file=root+'/assets/local/'+createHash('sha256').update(normalized).digest('hex').slice(0,18)+'.'+ext;
   if(['css','js','svg'].includes(ext)){
    let text=await response.text();
    // Resolve external stylesheet-relative resources before localizing them.
    if(ext==='css')text=text.replace(/url\((['"]?)([^)'"\s]+)\1\)/g,(m,q,u)=>/^(data:|#)/.test(u)?m:`url("${new URL(u,normalized).href}")`);
    text=await rewrite(file,text);
    writeFileSync(file,text);
   }else writeFileSync(file,Buffer.from(await response.arrayBuffer()));
   return file;
  })();downloaded.set(normalized,job);return job;
 }
 async function rewrite(file,text){
  const urls=new Set((text.match(externalPattern)||[]).filter(isAsset));
  if(file.endsWith('.html')){const {document:d}=parseHTML(text);for(const e of d.querySelectorAll('[src],[href]')){const u=e.getAttribute('src')||e.getAttribute('href');if(/^https?:/.test(u||'')&&isAsset(u))urls.add(u);}}
  for(let i=0,items=[...urls];i<items.length;i+=6)await Promise.all(items.slice(i,i+6).map(async url=>{try{const target=await download(url);const relative='./'+path.relative(path.dirname(file),target).replaceAll('\\','/');text=text.split(url).join(relative);}catch(error){failures.push(error.message);}}));
  return text;
 }
 async function visit(file){
  file=path.resolve(file);
  if(visited.has(file)||!existsSync(file)||!file.startsWith(root+path.sep))return;visited.add(file);
  if(!/\.(html|css|js|svg)$/.test(file))return;
  let text=readFileSync(file,'utf8');text=await rewrite(file,text);writeFileSync(file,text);
  const references=[];
  if(file.endsWith('.html')){const {document:d}=parseHTML(text);for(const e of d.querySelectorAll('[src],[href]'))references.push(e.getAttribute('src')||e.getAttribute('href'));}
  for(const m of text.matchAll(/url\((['"]?)([^)'"\s]+)\1\)/g))references.push(m[2]);
  for(const m of text.matchAll(/["'](\.\.?\/[^"'\s]+\.(?:css|js|png|jpg|jpeg|webp|svg|gif|mp3|woff2?|ttf)(?:\?[^"']*)?)["']/g))references.push(m[1]);
  await Promise.all(references.filter(u=>u&&!/^(https?:|data:|#|mailto:|tel:|javascript:|blob:)/.test(u)).map(u=>visit(localFile(file,u))));
 }
 await visit(root+`/mau-thiep-${number}.html`);
 report.push({number,downloads:downloaded.size,visited:visited.size,failures});
 console.log(JSON.stringify(report.at(-1)));
 if(failures.length){writeFileSync('tmp/independent-download-report.json',JSON.stringify(report,null,2));throw Error('Asset download failed for '+number);}
}
writeFileSync('tmp/independent-download-report.json',JSON.stringify(report,null,2));

