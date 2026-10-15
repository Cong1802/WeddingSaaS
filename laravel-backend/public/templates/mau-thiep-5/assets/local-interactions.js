(() => {
  const number = Number(document.documentElement.dataset.designNumber);
  const send = async (name, message, attendance = 'yes', guestCount = 1) => {
    const slug = document.documentElement.dataset.cardSlug;
    if (!slug) return 'Đây là bản xem mẫu. Phản hồi chỉ được gửi qua link thiệp đã xuất bản.';
    const response=await fetch(`/api/cards/view/${encodeURIComponent(slug)}/rsvp`,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({name,message,attendance,guest_count:guestCount})});
    const result=await response.json();if(!response.ok||!result.success)throw Error(result.message||'Chưa gửi được phản hồi.');return result.message;
  };
  document.querySelectorAll('form').forEach(form=>{
    form.removeAttribute('action');form.removeAttribute('method');
    const submit=async event=>{
      event.preventDefault();if(form.dataset.submitting==='true')return;
      if(!form.reportValidity())return;
      const name=form.querySelector('[name="name"],[name="form_item13"],input[placeholder*="tên"],input[placeholder*="Tên"]')?.value?.trim()||'';
      const message=form.querySelector('textarea,[name="form_item15"]')?.value?.trim()||'';
      const selection=form.querySelector('select[name="form_item17"],select[name="form_item7"],input[type="radio"]:checked')?.value||'yes';
      const attendance=/không|xin lỗi|tiếc/i.test(selection)?'no':'yes';
      const count=Number(form.querySelector('[name="form_item14"][type],#RSVP_GUEST_COUNT_SELECT select')?.value||1)||1;
      if(!name){alert('Vui lòng nhập họ tên.');return;}
      form.dataset.submitting='true';
      try{alert(await send(name,message,attendance,count));if(document.documentElement.dataset.cardSlug)form.reset();}catch(error){alert(error.message);}finally{delete form.dataset.submitting;}
    };
    form.addEventListener('submit',submit);
    form.querySelectorAll('.ladi-button').forEach(button=>{button.setAttribute('role','button');button.tabIndex=0;button.addEventListener('click',event=>{event.preventDefault();form.requestSubmit();});button.addEventListener('keydown',event=>{if(event.key==='Enter')form.requestSubmit();});});
  });
  if(number===3){
    const opening=document.getElementById('minimal-opening');
    const observer=typeof IntersectionObserver!=='undefined'?new IntersectionObserver(changes=>changes.forEach(change=>{if(change.isIntersecting&&document.documentElement.dataset.minimalOpened==='true'){change.target.style.opacity='1';change.target.style.transform='none';observer.unobserve(change.target);}}),{threshold:.05}):null;
    document.querySelectorAll('[style]').forEach(element=>{if(element.style.opacity==='0'){if(observer)observer.observe(element);else{element.style.opacity='1';element.style.transform='none';}}});
    const update=()=>document.querySelectorAll('[style]').forEach(element=>{if(element.style.opacity==='0')observer?.observe(element);});
    document.addEventListener('invitation-opened',update);
    const audio=document.getElementById('bg-music');document.querySelector('main button')?.addEventListener('click',()=>{if(audio)audio.paused?audio.play().catch(()=>{}):audio.pause();});
    document.querySelectorAll('button').forEach(button=>{if(button.textContent.trim()==='XÁC NHẬN THAM DỰ')button.onclick=()=>document.querySelector('form')?.scrollIntoView({behavior:'smooth',block:'center'});});
    document.querySelectorAll('img').forEach(image=>{if(!image.closest('#minimal-opening'))image.addEventListener('click',()=>{if(/flower|background|envelope|paper|castle/.test(image.src))return;const dialog=document.createElement('dialog');dialog.style.cssText='padding:10px;border:0;border-radius:10px;background:#fff;max-width:90vw';const picture=document.createElement('img');picture.src=image.src;picture.style.cssText='max-width:85vw;max-height:85vh';dialog.appendChild(picture);dialog.onclick=()=>{dialog.close();dialog.remove();};document.body.appendChild(dialog);dialog.showModal();});});
  }
  if(number===5){
    const attach=(id,callback)=>document.getElementById(id)?.addEventListener('click',async()=>{try{const message=await callback();if(message)alert(message);}catch(error){alert(error.message);}});
    attach('WISH_SUBMIT_BUTTON',()=>send(document.querySelector('#WISH_NAME_INPUT input')?.value||'',document.querySelector('#WISH_MESSAGE_TEXTAREA textarea')?.value||document.querySelector('#WISH_PREDEFINED_SELECT select')?.value||''));
    attach('RSVP_SUBMIT_BUTTON',()=>send(document.querySelector('#RSVP_NAME_INPUT input')?.value||'',document.querySelector('#RSVP_MESSAGE_TEXTAREA textarea')?.value||'',/không|tiếc/i.test(document.querySelector('#RSVP_ATTENDING_RADIO input:checked')?.value||'')?'no':'yes',Number(document.querySelector('#RSVP_GUEST_COUNT_SELECT select')?.value||1)));
  }
  if(number===1||number===2){
    const particles=document.createElement('div');particles.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:900;overflow:hidden';particles.setAttribute('aria-hidden','true');document.body.appendChild(particles);
    const style=document.createElement('style');style.textContent='@keyframes local-heart-fall{from{transform:translateY(-40px);opacity:.8}to{transform:translateY(110vh) rotate(50deg);opacity:.2}}';document.head.appendChild(style);
    const drop=()=>{const heart=document.createElement('span');heart.textContent='♥';heart.style.cssText=`position:absolute;top:-30px;left:${Math.random()*100}%;font-size:${16+Math.random()*12}px;color:#ff5687;animation:local-heart-fall 12s linear forwards`;particles.appendChild(heart);setTimeout(()=>heart.remove(),12500);};for(let i=0;i<5;i++)drop();setInterval(()=>{if(!document.hidden)drop();},2400);
  }
})();
