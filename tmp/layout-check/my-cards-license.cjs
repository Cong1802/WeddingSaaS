const fs = require('node:fs');
const base = fs.readFileSync(require('node:path').join(__dirname, 'admin-routes.cjs'), 'utf8').replaceAll('9239', '9244').replaceAll('profile-admin-routes', 'profile-my-cards-license');
const prefix = base.slice(0, base.indexOf("  await send('Page.addScriptToEvaluateOnNewDocument'"));
const suffix = base.slice(base.indexOf("  await send('Browser.close');"));
async function checks() {
  await send('Network.enable');
  await send('Network.clearBrowserCache');
  const cover = '/dist/assets/' + fs.readdirSync(require('node:path').resolve(__dirname, '../../laravel-backend/public/dist/assets')).find(name => name.startsWith('traditional-'));
  await send('Page.addScriptToEvaluateOnNewDocument', { source: `
    localStorage.setItem('auth_token','my-cards-test');
    const realFetch=window.fetch;
    const templates=[{id:1,code:'template_01',name:'Thiệp hoa truyền thống',category:'Sang Trọng',thumbnail:'/logo.png',file_url:'/template.html'}, {id:2,code:'template_02',name:'Thiệp hoa anh đào',category:'Hiện Đại',thumbnail:'/logo.png',file_url:'/https___www.lovecard.click_thiepso48/www.lovecard.click/thiepso48.html'}];
    const expires=new Date();expires.setMonth(expires.getMonth()+6);
    let licenses=[{template_code:'template_01',expires_at:expires.toISOString()}];
    const card={id:1,slug:'minh-anh-hoang-nam',template_id:'template_01',template:templates[0],is_published:true,views_count:856,access:{active:!sessionStorage.getItem('audit_expired'),expires_at:expires.toISOString()},card_data:{title:'Minh Anh & Hoàng Nam',groomName:'Hoàng Nam',brideName:'Minh Anh',weddingDate:'20 . 12 . 2026',heroImage:${JSON.stringify(cover)}}};
    window.__save=null;window.__order=null;window.__paid=false;
    window.alert=message=>{window.__alert=message};window.confirm=()=>true;
    window.fetch=async (url,options={})=>{
      if(url==='/api/cards/view/expired-test')return {ok:false,status:410,json:async()=>({message:'Mẫu thiệp đã hết hạn.'})};
      let data;const method=options.method||'GET';
      if(url==='/api/auth/me')data={success:true,user:{id:999,name:'Minh Anh',role:'user'}};
      if(url==='/api/public/templates')data={success:true,templates};
      if(url==='/api/public/plans')data={success:true,plans:[{code:'pro',name:'Gói Pro',price:99000,description:'Mẫu thiệp · 6 tháng'}]};
      if(url==='/api/user/cards')data={success:true,cards:sessionStorage.getItem('audit_empty')?[]:[card],card_slug:card.slug,card_url:location.origin+'/v/'+card.slug,licenses:sessionStorage.getItem('audit_expired')||sessionStorage.getItem('audit_empty')?[]:licenses,legacy_cards:[],archived_count:0};
      if(url==='/api/orders/create'){window.__order=JSON.parse(options.body);data={success:true,order:{id:34,order_code:'PAY_TEST',status:'pending'},qr_url:'/logo.png',bank_info:{bank_name:'MB',account_no:'123',account_name:'TEST',amount:99000,transfer_content:'PAY_TEST'}};}
      if(url==='/api/orders/my-orders'){if(window.__paid&&!licenses.some(l=>l.template_code===window.__order.template_code))licenses.push({template_code:window.__order.template_code,expires_at:expires.toISOString()});data={success:true,orders:[{id:34,status:window.__paid?'completed':'pending'}]};}
      if(url==='/api/cards/save'&&method==='POST'){window.__save=JSON.parse(options.body);card.template_id=window.__save.template_id;card.template=templates.find(t=>t.code===card.template_id);data={success:true,slug:card.slug,card_url:location.origin+'/v/'+card.slug};}
      if(url==='/api/user/cards/visibility'){card.is_published=JSON.parse(options.body).is_published;data={success:true};}
      if(data)return {ok:true,status:200,json:async()=>data};return realFetch(url,options);
    };
  ` });
  const exceptions=[];
  socket.addEventListener('message', e => {const message=JSON.parse(e.data);if(message.method==='Runtime.exceptionThrown')exceptions.push(JSON.stringify(message.params.exceptionDetails));});
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1100,deviceScaleFactor:1,mobile:false});
  await send('Page.navigate',{url:'http://127.0.0.1:8000/my-cards'});await delay(500);
  await evaluate("sessionStorage.removeItem('audit_empty');sessionStorage.removeItem('audit_expired')");
  await send('Page.reload');await delay(1400);
  if(!await evaluate(`document.querySelectorAll('.my-card-feature').length===1&&document.body.textContent.includes('Minh Anh & Hoàng Nam')`))throw Error('Single card dashboard missing');
  fs.writeFileSync(require('node:path').join(__dirname,'my-cards-desktop.png'),Buffer.from((await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true})).data,'base64'));
  await evaluate(`[...document.querySelectorAll('button')].find(b=>b.textContent==='Ẩn thiệp').click()`);await delay(200);
  if(!await evaluate(`document.body.textContent.includes('Đang ẩn')`))throw Error('Hide card failed');
  await evaluate(`[...document.querySelectorAll('button')].find(b=>b.textContent==='Hiển thị thiệp').click()`);await delay(200);
  await evaluate(`[...document.querySelectorAll('button')].find(b=>b.textContent==='Đổi mẫu thiệp').click()`);await delay(200);
  await evaluate(`[...document.querySelectorAll('.my-card-catalog button')].find(b=>b.textContent.includes('Mua mẫu')).click()`);await delay(400);
  await evaluate(`[...document.querySelectorAll('button')].find(b=>b.textContent.includes('Tiếp Tục Thanh Toán')).click()`);await delay(250);
  if(!await evaluate(`window.__order.template_code==='template_02'&&window.__order.plan_code==='pro'`))throw Error('Purchase not bound to template');
  await evaluate(`[...document.querySelectorAll('button')].find(b=>b.textContent.includes('Tôi Đã')||b.textContent.includes('đã chuyển')||b.textContent.includes('Đã Chuyển')).click()`);await delay(200);
  if(!await evaluate(`!window.__save&&!!document.querySelector('.app-modal-container')`))throw Error('Transfer acknowledgement granted access');
  await evaluate('window.__paid=true');await delay(4600);
  await evaluate(`[...document.querySelectorAll('.my-card-catalog article')].find(a=>a.textContent.includes('hoa anh đào')).querySelector('button').click()`);await delay(400);
  if(!await evaluate(`window.__save.slug==='minh-anh-hoang-nam'&&window.__save.template_id==='template_02'&&location.pathname==='/editor'`))throw Error('Switch did not preserve URL');
  await evaluate(`sessionStorage.setItem('audit_expired','1')`);
  await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await send('Page.navigate',{url:'http://127.0.0.1:8000/my-cards'});await delay(900);
  if(!await evaluate(`document.body.textContent.includes('Đã khóa')&&!document.querySelector('.my-card-actions a')?.getAttribute('href')`))throw Error('Expired card not locked in UI');
  if(await evaluate('document.documentElement.scrollWidth>innerWidth+1'))throw Error('Mobile horizontal overflow');
  fs.writeFileSync(require('node:path').join(__dirname,'my-cards-mobile.png'),Buffer.from((await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true})).data,'base64'));
  await evaluate(`sessionStorage.removeItem('audit_expired');sessionStorage.setItem('audit_empty','1')`);
  await send('Page.reload');await delay(800);
  if(!await evaluate(`document.body.textContent.includes('Chọn mẫu thiệp')&&!document.querySelector('.my-card-feature')`))throw Error('Empty state failed');
  await send('Page.navigate',{url:'http://127.0.0.1:8000/v/expired-test'});await delay(800);
  if(!await evaluate(`document.body.textContent.includes('Thiệp hiện đang khóa')&&!document.querySelector('iframe')`))throw Error('Public expired card still displayed');
  const vendorErrors=exceptions.filter(details=>/ladipage.*\.js|builder\/js/.test(JSON.parse(details).url||''));
  const appErrors=exceptions.filter(details=>!vendorErrors.includes(details));
  if(appErrors.length)throw Error('Application JavaScript exceptions: '+appErrors.join(','));
  if(vendorErrors.length)console.log('NOTE: imported LadiPage iframe has a separate vendor dependency error; account and purchase checks passed.');
  console.log('PASS: single card, visibility, template checkout, pending payment protection, approved switch with same URL, expiry, mobile and empty state');
}
const body=checks.toString();
eval(prefix+body.slice(body.indexOf('{')+1,body.lastIndexOf('}'))+suffix);
