(() => {
  const number = Number(document.documentElement.dataset.designNumber);
  if(number===8){
    const invitation=document.querySelector('.royal-invitation');
    const motionPreference=window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if(invitation&&!motionPreference?.matches&&'IntersectionObserver'in window){
      const groups=[
        ['.royal-ceremony__content > *',64],
        ['.royal-album__heading, .royal-album__card',72],
        ['.royal-reception',0],
        ['.royal-venue-board',0],
        ['.royal-schedule-panel',0],
        ['.royal-guestbook-panel',0],
        ['.royal-dress-code__inner > *',64],
        ['.royal-invitation__footer > *',64]
      ];
      const targets=[];
      groups.forEach(([selector,stagger])=>{
        invitation.querySelectorAll(selector).forEach((element,index)=>{
          element.classList.add('royal-reveal');
          element.style.setProperty('--royal-reveal-delay',`${Math.min(index*stagger,280)}ms`);
          targets.push(element);
        });
      });
      if(targets.length){
        const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
          if(!entry.isIntersecting)return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }),{threshold:.08,rootMargin:'0px 0px -6% 0px'});
        let started=false;
        const startReveal=()=>{
          if(started)return;
          started=true;
          invitation.classList.add('has-scroll-reveal');
          targets.forEach(target=>observer.observe(target));
        };
        if(document.documentElement.dataset.minimalOpened==='true')startReveal();
        else document.addEventListener('royal-envelope-toggle',event=>{if(event.detail?.opened)startReveal();});
      }
    }
  }
  if(number===8){
    const sourceNames=document.querySelector('.royal-hero .royal-names');
    if(sourceNames){
      const screen=document.createElement('section');
      screen.className='royal-opening-screen';
      screen.setAttribute('role','dialog');
      screen.setAttribute('aria-modal','true');
      screen.setAttribute('aria-label','Thiệp mời cưới');
      screen.innerHTML='<div class="royal-opening-content"><button class="royal-opening-envelope" type="button" aria-label="Mở thiệp"><img class="royal-opening-envelope-art" src="./assets/envelope-tabs-removed-v6.webp" alt=""><span class="royal-opening-wax-seal" aria-hidden="true"><svg viewBox="0 0 40 44"><path d="M20 39C21 29 20 19 15 8M20 29C25 27 29 23 31 18M19 23C14 22 11 19 9 15M22 33C17 32 14 30 12 27"/><path d="M15 8c4 1 6 4 6 7-4 0-6-3-6-7ZM31 18c-4 0-7 2-8 6 4 1 7-2 8-6ZM9 15c4 0 7 2 8 5-4 1-7-1-8-5Z"/></svg></span></button><div class="royal-opening-caption"></div><div class="royal-opening-divider" aria-hidden="true"><span>❧</span></div><p class="royal-opening-date"></p></div>';
      const names=sourceNames.cloneNode(true);
      names.classList.add('royal-opening-names');
      screen.querySelector('.royal-opening-caption').appendChild(names);
      const dateGrid=document.querySelector('.royal-ceremony__date-grid');
      const day=dateGrid?.querySelector('.royal-ceremony__date-number')?.textContent.trim();
      const month=dateGrid?.querySelector('.royal-ceremony__month strong')?.textContent.match(/\d+/)?.[0];
      const year=dateGrid?.querySelector('.royal-ceremony__month span:last-child')?.textContent.trim();
      screen.querySelector('.royal-opening-date').textContent=day&&month&&year?`${day} tháng ${month}, ${year}`:'';
      const page=document.querySelector('main');
      const previousHtmlOverflow=document.documentElement.style.overflow;
      const previousBodyOverflow=document.body.style.overflow;
      document.documentElement.style.overflow='hidden';
      document.body.style.overflow='hidden';
      if(page)page.inert=true;
      const openButton=screen.querySelector('.royal-opening-envelope');
      const openInvitation=()=>{
        if(screen.dataset.opened==='true')return;
        screen.dataset.opened='true';
        const bloomFlower=document.querySelector('.royal-flowers.royal-flowers-left');
        if(bloomFlower){
          bloomFlower.classList.add('is-blooming');
          void bloomFlower.offsetWidth;
          window.setTimeout(()=>bloomFlower.classList.remove('is-blooming'),2600);
        }
        document.dispatchEvent(new Event('royal-opening-finished'));
        document.documentElement.dataset.minimalOpened='true';
        if(page)page.inert=false;
        document.documentElement.style.overflow=previousHtmlOverflow;
        document.body.style.overflow=previousBodyOverflow;
        screen.remove();
        window.scrollTo({top:0,behavior:'instant'});
        document.dispatchEvent(new CustomEvent('invitation-opened'));
        const audio=document.getElementById('bg-music');
        audio?.play?.().catch(()=>{});
      };
      openButton.addEventListener('click',openInvitation);
      screen.addEventListener('keydown',event=>{if(event.key==='Escape')openInvitation();});
      document.body.appendChild(screen);
      requestAnimationFrame(()=>openButton.focus({preventScroll:true}));
    }
  }
  if(number===8){
    const hearts=document.createElement('div');
    hearts.className='royal-falling-hearts';
    hearts.setAttribute('aria-hidden','true');
    hearts.style.cssText='position:absolute;top:0;bottom:0;left:50%;width:min(100vw,430px);transform:translateX(-50%);z-index:3;overflow:hidden;pointer-events:none';
    const style=document.createElement('style');
    style.textContent='@keyframes royal-heart-fall{0%{top:-36px;transform:translateX(0) rotate(var(--heart-rotation));opacity:0}8%{opacity:.72}50%{transform:translateX(var(--heart-sway)) rotate(var(--heart-opposite-rotation))}88%{opacity:.72}100%{top:110vh;transform:translateX(0) rotate(var(--heart-rotation));opacity:0}}@media(prefers-reduced-motion:reduce){.royal-falling-hearts span{animation-duration:18s!important;opacity:.4}}';
    document.head.appendChild(style);
    const count=14;
    for(let index=0;index<count;index++){
      const heart=document.createElement('span');
      const duration=8+Math.random()*3;
      heart.textContent='♥';
      const color=index%3?'#b12732':'#f8efe6';
      const left=((index+Math.random()*.8)/count)*100;
      heart.style.cssText=`position:absolute;top:-36px;left:${left}%;font-size:${15+Math.random()*11}px;color:${color};opacity:.82;animation:royal-heart-fall ${duration}s linear ${-Math.random()*duration}s infinite normal;filter:drop-shadow(0 1px 3px rgba(76,18,21,.48))`;
      heart.style.setProperty('--heart-sway',`${Math.round(Math.random()*48-24)}px`);
      const rotation=Math.round(Math.random()*16-8);
      heart.style.setProperty('--heart-rotation',`${rotation}deg`);
      heart.style.setProperty('--heart-opposite-rotation',`${-rotation}deg`);
      hearts.appendChild(heart);
    }
    const openingScreen=document.querySelector('.royal-opening-screen');
    if(openingScreen){
      openingScreen.prepend(hearts);
      document.addEventListener('royal-opening-finished',()=>{
        hearts.remove();
        hearts.style.cssText='position:fixed;top:0;bottom:0;left:50%;width:min(100vw,430px);transform:translateX(-50%);z-index:35;overflow:hidden;pointer-events:none';
        document.body.appendChild(hearts);
      },{once:true});
    }else{
      hearts.style.cssText='position:fixed;top:0;bottom:0;left:50%;width:min(100vw,430px);transform:translateX(-50%);z-index:35;overflow:hidden;pointer-events:none';
      document.body.appendChild(hearts);
    }
  }
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
  if(number===3||number===8){
    const opening=document.getElementById('minimal-opening');
    const countdownGrid=document.querySelector('.royal-reception__countdown-grid');
    if(countdownGrid){
      const cells=Array.from(countdownGrid.querySelectorAll(':scope > div'));
      if(cells.length>=4){
        const target=Date.now()+7*24*60*60*1000;
        let timer=null;
        const renderCountdown=()=>{
          let seconds=Math.max(0,Math.ceil((target-Date.now())/1000));
          const values=[Math.floor(seconds/86400)];
          seconds%=86400;values.push(Math.floor(seconds/3600));
          seconds%=3600;values.push(Math.floor(seconds/60));
          values.push(seconds%60);
          values.forEach((value,index)=>{const node=cells[index].querySelector('strong');if(node)node.textContent=String(value);});
          if(seconds===0&&target<=Date.now()&&timer!==null){clearInterval(timer);timer=null;}
        };
        timer=window.setInterval(renderCountdown,1000);
        renderCountdown();
      }
    }
    const observer=typeof IntersectionObserver!=='undefined'?new IntersectionObserver(changes=>changes.forEach(change=>{if(change.isIntersecting&&document.documentElement.dataset.minimalOpened==='true'){change.target.style.opacity='1';change.target.style.transform='none';observer.unobserve(change.target);}}),{threshold:.05}):null;
    document.querySelectorAll('[style]').forEach(element=>{if(element.style.opacity==='0'){element.style.transition='opacity .8s ease, transform .8s ease';if(observer)observer.observe(element);else{element.style.opacity='1';element.style.transform='none';}}});
    const update=()=>document.querySelectorAll('[style]').forEach(element=>{if(element.style.opacity==='0'&&observer){observer.unobserve(element);observer.observe(element);}});
    document.addEventListener('invitation-opened',update);
    const audio=document.getElementById('bg-music');document.querySelector('main button')?.addEventListener('click',()=>{if(audio)audio.paused?audio.play().catch(()=>{}):audio.pause();});
    document.querySelectorAll('button').forEach(button=>{if(button.textContent.trim()==='XÁC NHẬN THAM DỰ')button.onclick=()=>document.querySelector('form')?.scrollIntoView({behavior:'smooth',block:'center'});});
    document.querySelectorAll('img').forEach(image=>{if(!image.closest('#minimal-opening, .royal-opening-screen, .royal-album'))image.addEventListener('click',()=>{if(/flower|background|envelope|paper|castle/.test(image.src))return;const dialog=document.createElement('dialog');dialog.style.cssText='padding:10px;border:0;border-radius:10px;background:#fff;max-width:90vw';const picture=document.createElement('img');picture.src=image.src;picture.style.cssText='max-width:85vw;max-height:85vh';dialog.appendChild(picture);dialog.onclick=()=>{dialog.close();dialog.remove();};document.body.appendChild(dialog);dialog.showModal();});});
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
