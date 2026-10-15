import {readFileSync,writeFileSync} from 'node:fs';import {parseHTML} from 'linkedom';
const {document:o}=parseHTML(readFileSync('C:/Users/Administrator/Pictures/template thiệp 4/Thư Mời Lễ Cưới Phương Linh & Văn Đạt.html','utf8'));
for(const root of ['public/templates/passport','laravel-backend/public/templates/passport']){
 const {document:d}=parseHTML(readFileSync(root+'/index.html','utf8'));
 for(const id of ['FORM2','PARAGRAPH80','PARAGRAPH81']){
  const element=o.getElementById(id).cloneNode(true);
  for(const node of [element,...element.querySelectorAll('*')]){
    if(node.id) node.id='passport-'+node.id;
    for(const attr of [...node.attributes])if(attr.name.startsWith('on')||attr.name.startsWith('data-')||attr.name==='is_auto_funnel')node.removeAttribute(attr.name);
  }
  const container=id==='FORM2'?d.querySelector('#passport-SECTION8 .ladi-container'):d.querySelector('#passport-GROUP37 .ladi-group');
  container.appendChild(element);
 }
 const form=d.querySelector('#passport-FORM2 form');form.removeAttribute('method');
 form.querySelector('button.ladi-hidden')?.remove();
 const original=form.querySelector('#passport-BUTTON4');const button=d.createElement('button');button.id=original.id;button.className=original.className;button.type='submit';button.innerHTML=original.innerHTML;button.style.cssText='border:0;padding:0;background:transparent;cursor:pointer';original.replaceWith(button);
 const name=form.querySelector('[name="name"]');name.maxLength=150;name.setAttribute('aria-label','Họ và tên');
 const wish=form.querySelector('[name="message"]');wish.maxLength=2000;wish.removeAttribute('required');wish.setAttribute('aria-label','Lời chúc');
 const count=form.querySelector('[name="form_item8"]');count.type='number';count.min='1';count.max='50';count.value='1';count.setAttribute('aria-label','Số người tham dự');
 form.querySelectorAll('[type="radio"]').forEach((input,i)=>{input.name='attendance';input.value=i?'no':'yes';input.required=true;if(i===0)input.setAttribute('checked','');const label=d.createElement('label');label.className=input.parentElement.className;label.innerHTML=input.parentElement.innerHTML;input.parentElement.replaceWith(label);});
 const status=d.createElement('p');status.setAttribute('role','status');status.id='passport-rsvp-status';status.style.cssText='position:absolute;top:100%;left:0;width:100%;font-size:13px;text-align:center;line-height:1.5;color:#735b33;margin-top:8px';form.appendChild(status);
 for(const style of d.querySelectorAll('style'))style.textContent=style.textContent.replace('.ladi-form{display:none!important}','');
 const css=d.createElement('style');css.textContent='#passport-FORM2 .ladi-form{display:block}#passport-FORM2 input[type=radio]{display:inline-block!important;position:static!important;appearance:auto!important;width:13px!important;height:13px!important;margin-right:6px;opacity:1!important}#passport-FORM2 label{cursor:pointer}#passport-FORM2 button:disabled{opacity:.6}';d.head.appendChild(css);
 writeFileSync(root+'/index.html','<!doctype html>\n'+d.documentElement.outerHTML.replace('reveal-4','rsvp-5'));
}
