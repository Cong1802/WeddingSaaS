const fs = require('node:fs');
const base = fs.readFileSync(require('node:path').join(__dirname, 'admin-routes.cjs'), 'utf8');
const prefix = base.slice(0, base.indexOf("  await send('Page.addScriptToEvaluateOnNewDocument'"));
const suffix = base.slice(base.indexOf("  await send('Browser.close');"));
async function checks() {
  await send('Page.addScriptToEvaluateOnNewDocument', {source: `localStorage.setItem('auth_token','catalog-test');
    const realFetch=window.fetch;
    const designs=[{url:'/template.html',name:'Traditional'},{url:'/https___www.lovecard.click_thiepso48/www.lovecard.click/thiepso48.html',name:'48'}];
    const templates=[{id:99,code:'template_catalog_test',name:'Catalog Sample',category:'Vintage',thumbnail:'/logo.png',file_url:designs[1].url,is_active:true}];
    window.fetch=async(url,options)=>{
      if(url==='/api/auth/me') return {ok:true,json:async()=>({success:true,user:{id:999,name:'Audit',role:'admin'}})};
      if(url==='/api/public/templates'||url==='/api/admin/templates') return {ok:true,json:async()=>({success:true,templates,designs})};
      return realFetch(url,options);
    };`});
  await send('Page.navigate',{url:'http://127.0.0.1:8000/admin/templates'});await delay(1800);
  await evaluate(`[...document.querySelectorAll('button')].find(b=>b.textContent.includes('Thêm Mẫu Thiệp Mới')).click()`);await delay(200);
  if(!await evaluate(`document.querySelector('form select')?.options.length===2`))throw Error('Design selector missing');
  if(await evaluate(`[...document.querySelectorAll('form label')].some(l=>/Mã Mẫu|Giá/.test(l.textContent))`))throw Error('Manual code/price remains');
  await evaluate(`[...document.querySelectorAll('form button')].find(b=>b.textContent.trim()==='Hủy').click()`);
  await evaluate(`[...document.querySelectorAll('button')].find(b=>b.textContent.includes('Quay Lại Website')).click()`);await delay(1200);
  if(!await evaluate(`!!document.querySelector('button[aria-label="Dùng mẫu Catalog Sample"]')`))throw Error('Catalog not connected to gallery');
  await evaluate(`document.querySelector('button[aria-label="Dùng mẫu Catalog Sample"]').click()`);await delay(800);
  if(!await evaluate(`location.pathname==='/editor'&&document.querySelector('iframe')?.getAttribute('src').includes('thiepso48.html')`))throw Error('Chosen design not used in editor');
  if(!await evaluate(`document.body.textContent.includes('Catalog Sample')`))throw Error('Editor still uses hardcoded template name');
  console.log('PASS: admin design selector, automatic code/package pricing UI, public catalog and chosen editor HTML');
}
const body = checks.toString();
eval(prefix + body.slice(body.indexOf('{') + 1, body.lastIndexOf('}')) + suffix);
