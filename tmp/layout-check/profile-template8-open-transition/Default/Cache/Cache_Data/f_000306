(() => {
  const number = Number(document.documentElement.dataset.designNumber);
  if(number===8){
    const invitation=document.querySelector('.royal-invitation');
    if(invitation&&'IntersectionObserver'in window){
      const groups=[
        ['.royal-ceremony__content > *',180,'bottom'],
        ['.royal-reception__title',0,'bottom'],
        ['.royal-reception__details > *',180,'bottom'],
        ['.royal-reception__rsvp',200,'bottom'],
        ['.royal-venue-board > div:first-child > *',180,'bottom'],
        ['.royal-venue-address',0,'bottom'],
        ['.royal-venue-directions',180,'bottom'],
        ['.royal-schedule-panel h2',0,'bottom'],
        ['.royal-schedule-panel__divider',180,'bottom'],
        ['.royal-guestbook-panel .text-center > *',180,'bottom'],
        ['.royal-guestbook-panel form',200,'bottom'],
        ['.royal-dress-code__inner > *:not(.royal-dress-code__gallery)',180,'bottom'],
        ['.royal-dress-code__card',220,'bottom'],
        ['.royal-invitation__footer-copy',0,'bottom'],
        ['.royal-invitation__footer-heart',180,'bottom']
      ];
      const revealOffsets={left:'0px 35px',right:'0px 35px',top:'0px 35px',bottom:'0px 35px'};
      const targets=[];
      groups.forEach(([selector,stagger,direction])=>{
        invitation.querySelectorAll(selector).forEach((element,index)=>{
          element.classList.add('royal-reveal');
          element.style.setProperty('--royal-reveal-from',revealOffsets[direction]);
          element.style.setProperty('--royal-reveal-delay',`${Math.min(index*stagger,1600)}ms`);
          targets.push(element);
        });
      });
      // Dedicated sequence for Royal Album: Title -> Ornament -> Subtitle -> Cards
      const albumTopRule=invitation.querySelector('.royal-album__top-rule');
      const albumTitle=invitation.querySelector('.royal-album__title');
      const albumOrnament=invitation.querySelector('.royal-album__ornament');
      const albumSubtitle=invitation.querySelector('.royal-album__subtitle');
      const albumCards=invitation.querySelectorAll('.royal-album__card');
      const albumSequenceItems=[];

      if(albumTopRule){
        albumTopRule.classList.add('royal-reveal');
        albumTopRule.style.setProperty('--royal-reveal-from','0px 35px');
        albumTopRule.style.setProperty('--royal-reveal-delay','0ms');
        albumSequenceItems.push(albumTopRule);
      }
      if(albumTitle){
        albumTitle.classList.add('royal-reveal');
        albumTitle.style.setProperty('--royal-reveal-from','0px 35px');
        albumTitle.style.setProperty('--royal-reveal-delay','60ms');
        albumSequenceItems.push(albumTitle);
      }
      if(albumOrnament){
        albumOrnament.classList.add('royal-reveal');
        albumOrnament.style.setProperty('--royal-reveal-from','0px 35px');
        albumOrnament.style.setProperty('--royal-reveal-delay','180ms');
        albumSequenceItems.push(albumOrnament);
      }
      if(albumSubtitle){
        albumSubtitle.classList.add('royal-reveal');
        albumSubtitle.style.setProperty('--royal-reveal-from','0px 35px');
        albumSubtitle.style.setProperty('--royal-reveal-delay','300ms');
        albumSequenceItems.push(albumSubtitle);
      }
      // Royal Album Cards: strict top-to-bottom row-by-row cascade
      const cardDelays=[500, 680, 960, 1140, 1420, 1700, 1880, 2160];
      albumCards.forEach((card,index)=>{
        card.classList.add('royal-reveal');
        card.style.setProperty('--royal-reveal-from','0px 35px');
        const cardDelay=cardDelays[index]||(2160+index*200);
        card.style.setProperty('--royal-reveal-delay', cardDelay + 'ms');
        albumSequenceItems.push(card);
      });
      // Separate animation for each line in royal-schedule-section
      const scheduleRows=invitation.querySelectorAll('.royal-schedule-panel ol > li');
      scheduleRows.forEach((row,rowIndex)=>{
        const rowDelay=300+rowIndex*200;
        Array.from(row.children).forEach(span=>{
          span.classList.add('royal-reveal');
          span.style.setProperty('--royal-reveal-from','0px 35px');
          span.style.setProperty('--royal-reveal-delay',`${rowDelay}ms`);
          targets.push(span);
        });
      });
      let albumTriggered=false;
      const triggerAlbumSequence=()=>{
        if(albumTriggered)return;
        albumTriggered=true;
        albumSequenceItems.forEach(item=>item.classList.add('is-visible'));
      };
      const allTargets=[...targets,...albumSequenceItems];
      if(allTargets.length){
        const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
          if(!entry.isIntersecting)return;
          if(albumSequenceItems.includes(entry.target)){
            triggerAlbumSequence();
            albumSequenceItems.forEach(item=>observer.unobserve(item));
          }else{
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        }),{threshold:.08,rootMargin:'0px 0px -6% 0px'});
        let started=false;
        const startReveal=()=>{
          if(started)return;
          started=true;
          invitation.classList.add('has-scroll-reveal');
          allTargets.forEach(target=>observer.observe(target));
        };
        if(document.documentElement.dataset.minimalOpened==='true')startReveal();
        else{
          document.addEventListener('royal-opening-finished',startReveal,{once:true});
          document.addEventListener('royal-envelope-toggle',event=>{if(event.detail?.opened)startReveal();});
        }
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
      screen.tabIndex=-1;
      screen.innerHTML='<div class="royal-opening-content"><p class="royal-opening-kicker">SAVE THE DATE</p><div class="royal-opening-kicker-rule" aria-hidden="true"><span>✥</span></div><button class="royal-opening-envelope" type="button" aria-label="Mở thiệp"><img class="royal-opening-flap" width="720" height="360" decoding="async" src="./assets/royal-opening-envelope-flap-user.webp?v=opening-flap-20261021-1" alt="" aria-hidden="true"><img class="royal-opening-envelope-art" width="1120" height="747" decoding="async" fetchpriority="high" src="./assets/royal-envelope-display-v1.webp" alt=""><span class="royal-opening-wax-seal" aria-hidden="true"><img class="royal-opening-wax-seal-art" width="256" height="259" decoding="async" src="./assets/royal-seal-display-v1.webp" alt=""></span></button><img class="royal-opening-bouquet" width="450" height="675" src="./assets/royal-opening-bouquet-screen-v1.webp" alt="" aria-hidden="true" loading="eager" decoding="async"><div class="royal-opening-caption"></div><div class="royal-opening-divider" aria-hidden="true"><span>❧</span></div><p class="royal-opening-date"></p></div>';
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
      const burstHearts=()=>{
        const seal=screen.querySelector('.royal-opening-wax-seal').getBoundingClientRect();
        const burst=document.createElement('div');
        burst.className='royal-opening-burst';
        burst.setAttribute('aria-hidden','true');
        document.body.appendChild(burst);
        const bounds=burst.getBoundingClientRect();
        burst.style.setProperty('--burst-origin-x',`${seal.x+seal.width/2-bounds.x}px`);
        burst.style.setProperty('--burst-origin-y',`${seal.y+seal.height/2-bounds.y}px`);
        const particles=document.createDocumentFragment();
        const colors=['#7a1f26','#a8323b','#c9a24a','#ece4d8'];
        for(let index=0;index<28;index++){
          const heart=document.createElement('span');
          const angle=index/28*Math.PI*2;
          const distance=Math.min(300,bounds.width*.48)*(.55+Math.random()*.45);
          heart.className='royal-opening-particle';
          heart.textContent='♥';
          heart.style.setProperty('--burst-x',`${Math.cos(angle)*distance}px`);
          heart.style.setProperty('--burst-y',`${Math.sin(angle)*distance}px`);
          heart.style.setProperty('--burst-turn',`${index%2?100:-100}deg`);
          heart.style.fontSize=`${14+Math.random()*8}px`;
          heart.style.color=colors[index%colors.length];
          particles.appendChild(heart);
        }
        burst.appendChild(particles);
        return burst;
      };
      const openInvitation=()=>{
        if(screen.dataset.opened==='true')return;
        screen.dataset.opened='true';
        screen.dataset.state='opening';
        openButton.disabled=true;
        openButton.setAttribute('aria-busy','true');
        const bloomFlower=document.querySelector('.royal-flowers.royal-flowers-left');
        const royalPhoto=document.querySelector('.royal-photo');
        const royalSpray=document.querySelector('.royal-right-spray');
        const royalNames=document.querySelector('.royal-hero .royal-names');
        const royalDivider=document.querySelector('.royal-hero .royal-divider-bottom');
        const scene=document.querySelector('.royal-scene');
        if(bloomFlower)bloomFlower.classList.add('is-blooming');
        if(royalPhoto)royalPhoto.classList.add('is-blooming');
        if(royalSpray)royalSpray.classList.add('is-blooming');
        if(royalNames)royalNames.classList.add('is-blooming');
        if(royalDivider)royalDivider.classList.add('is-blooming');
        if(scene)scene.dataset.animation='opened';
        window.scrollTo({top:0,left:0,behavior:'instant'});
        document.documentElement.dataset.minimalOpened='true';
        document.dispatchEvent(new Event('royal-opening-started'));
        // Reveal the moving hero continuously; keep input locked until the fade ends.
        const fadeOptions={duration:1200,easing:'cubic-bezier(.4,0,.6,1)',fill:'forwards'};
        const coverFade=screen.animate([{opacity:1},{opacity:0}],fadeOptions);
        screen.querySelector('.royal-opening-content').animate([{opacity:1},{opacity:0}],fadeOptions);
        let burst;
        const burstTimer=setTimeout(()=>{
          burst=burstHearts();
          screen.dataset.state='away';
        },250);
        const finishOpening=()=>{
          clearTimeout(burstTimer);
          screen.remove();
          burst?.remove();
          if(page)page.inert=false;
          document.documentElement.style.overflow=previousHtmlOverflow;
          document.body.style.overflow=previousBodyOverflow;
          document.dispatchEvent(new Event('royal-opening-finished'));
          document.dispatchEvent(new CustomEvent('invitation-opened'));
        };
        coverFade.finished.then(finishOpening,finishOpening);
        const audio=document.getElementById('bg-music');
        audio?.play?.().catch(()=>{});
      };
      openButton.addEventListener('click',openInvitation);
      screen.addEventListener('keydown',event=>{if(event.key==='Escape')openInvitation();});
      document.body.appendChild(screen);
      document.documentElement.dataset.openingReady='true';
      requestAnimationFrame(()=>screen.focus({preventScroll:true}));
    }
  }
  if(number===8){
    const hearts=document.createElement('div');
    hearts.className='royal-falling-hearts';
    hearts.setAttribute('aria-hidden','true');
    hearts.style.cssText='position:absolute;top:0;bottom:0;left:50%;width:min(100vw,430px);transform:translateX(-50%);z-index:3;overflow:hidden;pointer-events:none';
    const style=document.createElement('style');
    style.textContent='.royal-falling-hearts{contain:layout paint}.royal-falling-hearts span{will-change:transform}@keyframes royal-heart-fall{0%{transform:translate3d(0,0,0) rotate(var(--heart-rotation));opacity:0}8%{opacity:.72}50%{transform:translate3d(var(--heart-sway),calc(55vh + 18px),0) rotate(var(--heart-opposite-rotation))}88%{opacity:.72}100%{transform:translate3d(0,calc(110vh + 36px),0) rotate(var(--heart-rotation));opacity:0}}@media(prefers-reduced-motion:reduce){.royal-falling-hearts span{animation-duration:18s!important;opacity:.4}}';
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
    const syncHeartPlayback=()=>{
      for(const heart of hearts.children)heart.style.animationPlayState=document.hidden?'paused':'running';
    };
    document.addEventListener('visibilitychange',syncHeartPlayback);
    syncHeartPlayback();
    const openingScreen=document.querySelector('.royal-opening-screen');
    if(openingScreen){
      openingScreen.prepend(hearts);
      const moveHeartsToPage=zIndex=>{
        hearts.style.cssText=`position:fixed;top:0;bottom:0;left:50%;width:min(100vw,430px);transform:translateX(-50%);z-index:${zIndex};overflow:hidden;pointer-events:none`;
        if(hearts.parentNode!==document.body)document.body.appendChild(hearts);
      };
      document.addEventListener('royal-opening-started',()=>moveHeartsToPage(2147483001),{once:true});
      document.addEventListener('royal-opening-finished',()=>moveHeartsToPage(35),{once:true});
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
