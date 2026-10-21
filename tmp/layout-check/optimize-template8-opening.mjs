import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const taskRoot=process.cwd();
const templatePaths=[
  'laravel-backend/public/templates/mau-thiep-8',
  'public/templates/mau-thiep-8',
  'laravel-backend/public/dist/templates/mau-thiep-8'
].map(relative=>path.join(taskRoot,relative));
const assets=path.join(templatePaths[0],'assets');
const derivatives=[
  ['royal-opening-paper-user.png','royal-opening-paper-screen-v1.webp',null,86],
  ['envelope-tabs-removed-v6.png','royal-envelope-display-v1.webp',1120,88],
  ['seal-shadow-v3.png','royal-seal-display-v1.webp',256,90],
  ['album-floral-bouquet-v1.png','royal-opening-bouquet-screen-v1.webp',450,88]
];
for(const [source,target,width,quality] of derivatives){
  let encoder=sharp(path.join(assets,source));
  if(width)encoder=encoder.resize({width,withoutEnlargement:true});
  const data=await encoder.webp({quality,alphaQuality:100,effort:6}).toBuffer();
  for(const directory of templatePaths)await fs.writeFile(path.join(directory,'assets',target),data);
  console.log(`${target}: ${data.length} bytes`);
}

const replacements=[
  ['envelope-tabs-removed-v6.webp','royal-envelope-display-v1.webp'],
  ['seal-shadow-v3.webp','royal-seal-display-v1.webp'],
  ['album-floral-bouquet-v1.webp?v=userflorals-20261021-1','royal-opening-bouquet-screen-v1.webp']
];
const oldHeartStart='0%{top:-36px;transform:translateX(0) rotate(var(--heart-rotation));opacity:0}';
const newHeartStart='0%{transform:translate3d(0,0,0) rotate(var(--heart-rotation));opacity:0}';
const oldHeartMiddle='50%{transform:translateX(var(--heart-sway)) rotate(var(--heart-opposite-rotation))}';
const newHeartMiddle='50%{transform:translate3d(var(--heart-sway),calc(55vh + 18px),0) rotate(var(--heart-opposite-rotation))}';
const oldHeartEnd='100%{top:110vh;transform:translateX(0) rotate(var(--heart-rotation));opacity:0}';
const newHeartEnd='100%{transform:translate3d(0,calc(110vh + 36px),0) rotate(var(--heart-rotation));opacity:0}';

for(const directory of templatePaths){
  const scriptPath=path.join(directory,'assets/local-interactions.js');
  let script=await fs.readFile(scriptPath,'utf8');
  for(const [before,after] of replacements)script=script.replaceAll(before,after);
  for(const [before,after] of [[oldHeartStart,newHeartStart],[oldHeartMiddle,newHeartMiddle],[oldHeartEnd,newHeartEnd]]){
    if(!script.includes(before))throw Error(`Expected heart keyframe missing in ${scriptPath}`);
    script=script.replace(before,after);
  }
  script=script.replace("style.textContent='@keyframes royal-heart-fall", "style.textContent='.royal-falling-hearts{contain:layout paint}.royal-falling-hearts span{will-change:transform}@keyframes royal-heart-fall");
  for(const [className,attributes] of [
    ['royal-opening-flap','width="720" height="360" decoding="async"'],
    ['royal-opening-envelope-art','width="1120" height="747" decoding="async" fetchpriority="high"'],
    ['royal-opening-wax-seal-art','width="256" height="259" decoding="async"'],
    ['royal-opening-bouquet','width="450" height="675"']
  ])script=script.replace(`class="${className}" src=`,`class="${className}" ${attributes} src=`);
  script=script.replace("    const openingScreen=document.querySelector('.royal-opening-screen');",`    const syncHeartPlayback=()=>{
      for(const heart of hearts.children)heart.style.animationPlayState=document.hidden?'paused':'running';
    };
    document.addEventListener('visibilitychange',syncHeartPlayback);
    syncHeartPlayback();
    const openingScreen=document.querySelector('.royal-opening-screen');`);
  await fs.writeFile(scriptPath,script);

  const cssPath=path.join(directory,'assets/template8.css');
  let css=await fs.readFile(cssPath,'utf8');
  css=css.replaceAll('royal-opening-paper-user.png?v=opening-paper-20261021-1','royal-opening-paper-screen-v1.webp');
  css+='\n/* Keep the covered invitation idle until the opening screen is dismissed. */\nhtml[data-design-number="8"][data-minimal-opened="false"] .royal-invitation *{animation-play-state:paused!important}\n';
  await fs.writeFile(cssPath,css);

  const htmlPath=path.join(directory,'mau-thiep-8.html');
  let html=await fs.readFile(htmlPath,'utf8');
  // The envelope and seal are shared with the hero; reuse the display-size assets.
  for(const [before,after] of replacements.slice(0,2))html=html.replaceAll(before,after);
  html=html.replace('</head>','<link rel="preload" as="image" href="./assets/royal-opening-paper-screen-v1.webp" fetchpriority="high"></head>');
  html=html.replace(/<link rel="stylesheet" href="(https:\/\/cdn\.jsdelivr\.net\/[^"]*fancybox\.css)">/,'<link rel="stylesheet" href="$1" media="print" onload="this.media=\'all\'">');
  const fancyboxScript=html.match(/<script defer src="https:\/\/cdn\.jsdelivr\.net\/[^"]*fancybox\.umd\.js"><\/script>/)?.[0];
  if(!fancyboxScript)throw Error(`Expected Fancybox script missing in ${htmlPath}`);
  html=html.replace(fancyboxScript,'');
  html=html.replace(/(<script defer src="\.\/assets\/local-interactions\.js[^"<>]*"><\/script>)/,`$1${fancyboxScript}`);
  html=html.replace(/(local-interactions\.js\?v=)[^"<>]+/g,'$1opening-composition-20261021-22');
  html=html.replace(/(template8\.css\?v=)[^"<>]+/g,'$1opening-composition-20261021-62');
  await fs.writeFile(htmlPath,html);
}
