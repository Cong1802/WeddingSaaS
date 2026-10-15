import {readFileSync,writeFileSync,readdirSync,statSync,existsSync,unlinkSync,cpSync,rmdirSync} from 'node:fs';import path from 'node:path';import {parseHTML} from 'linkedom';
const workspace=path.resolve('.');const reports=[];
function walk(folder){return readdirSync(folder).flatMap(name=>{const file=path.join(folder,name);return statSync(file).isDirectory()?walk(file):[file]});}
for(let number=1;number<=5;number++){
const root=path.resolve(`public/templates/mau-thiep-${number}`);const main=path.join(root,`mau-thiep-${number}.html`);const used=new Set(),missing=[],external=[];
function visit(file){file=path.resolve(file);if(used.has(file))return;if(!file.startsWith(root+path.sep))throw Error('Dependency outside template: '+file);if(!existsSync(file)){missing.push(file);return;}used.add(file);if(!/\.(html|css|js|svg)$/.test(file))return;
let text=readFileSync(file,'utf8');const refs=[];
if(file.endsWith('.html')){const {document:d}=parseHTML(text);for(const meta of d.querySelectorAll('svg metadata'))meta.remove();for(const node of d.querySelectorAll('a[href]')){const url=node.getAttribute('href');if(/^https?:/.test(url)){try{const parsed=new URL(url);for(const key of [...parsed.searchParams.keys()])if(/^(utm_|fbclid|g_ep|skid|g_st|coh|entry)/.test(key))parsed.searchParams.delete(key);node.setAttribute('href',parsed.href);}catch{}}}text='<!doctype html>\n'+d.documentElement.outerHTML;writeFileSync(file,text);for(const e of d.querySelectorAll('[src],[href]')){const u=e.getAttribute('src')||e.getAttribute('href');if(e.tagName==='A'&&/^http/.test(u))continue;refs.push(u);}}
for(const match of text.matchAll(/url\((['"]?)([^)'"\s]+)\1\)/g))refs.push(match[2]);
for(const match of text.matchAll(/["'](\.\.?\/[^"'\s]+\.(?:css|js|png|jpg|jpeg|webp|gif|svg|mp3|woff2?|ttf|otf)(?:\?[^"']*)?)["']/g))refs.push(match[1]);
for(const ref of refs){if(!ref||/^(#|data:|blob:|mailto:|tel:|javascript:)/.test(ref))continue;if(/^https?:/.test(ref)){external.push({file:path.relative(root,file),ref});continue;}if(ref.startsWith('/api/'))continue;const clean=decodeURIComponent(ref.replaceAll('&quot;','').split('?')[0].split('#')[0]);if(clean.startsWith('/')){missing.push('absolute resource: '+ref);continue;}visit(path.resolve(path.dirname(file),clean));}
}
visit(main);if(missing.length||external.length)throw Error(JSON.stringify({number,missing,external}));
let removed=0;for(const file of walk(root))if(!used.has(file)){if(!file.startsWith(root+path.sep))throw Error('Unsafe cleanup');unlinkSync(file);removed++;}
function emptyDirs(folder){for(const name of readdirSync(folder)){const p=path.join(folder,name);if(statSync(p).isDirectory()){emptyDirs(p);if(readdirSync(p).length===0)rmdirSync(p);}}}emptyDirs(root);
const backend=path.resolve(`laravel-backend/public/templates/mau-thiep-${number}`);if(!backend.startsWith(workspace+path.sep)||!backend.includes(path.sep+'templates'+path.sep+'mau-thiep-'))throw Error('Unsafe backend target');
// Remove only obsolete files in this explicitly named template folder, then deploy the retained files.
for(const file of walk(backend)){const relative=path.relative(backend,file);if(!existsSync(path.join(root,relative)))unlinkSync(file);}emptyDirs(backend);cpSync(root,backend,{recursive:true});
reports.push({number,files:used.size,removed,bytes:[...used].reduce((sum,file)=>sum+statSync(file).size,0),externalResources:0});console.log(JSON.stringify(reports.at(-1)));
}
writeFileSync('tmp/independent-template-validation.json',JSON.stringify(reports,null,2));

