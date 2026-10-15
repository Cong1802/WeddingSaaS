(() => {
  const config = JSON.parse(document.getElementById('standalone-design-config').textContent);
  const byId = id => document.getElementById(id);
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) viewport.content = window.innerWidth < 420 ? 'width=420' : 'width=device-width, initial-scale=1';
  document.body.classList.remove('lazyload');
  document.querySelectorAll('.ladi-lazyload').forEach(node => node.classList.remove('ladi-lazyload'));
  let closed = config.tabs.length > 0;
  if (closed) { document.documentElement.dataset.invitationClosed = 'true'; window.scrollTo(0, 0); }
  const preventScroll = event => { if (closed) event.preventDefault(); };
  document.addEventListener('wheel', preventScroll, { passive: false });
  document.addEventListener('touchmove', preventScroll, { passive: false });
  const selectTab = (id, index) => {
    const tabs = byId(id)?.querySelectorAll('.ladi-tabs > [data-index]');
    tabs?.forEach(tab => { const active = Number(tab.dataset.index) === index; tab.classList.toggle('selected', active); tab.style.display = active ? 'block' : 'none'; });
  };
  config.tabs.forEach(tab => { const first = byId(tab.initial); selectTab(tab.id, Number(first?.dataset.index || 1)); });
  const open = (id, index) => {
    selectTab(id, index); closed = false;
    document.documentElement.dataset.invitationClosed = 'false';
    document.removeEventListener('wheel', preventScroll); document.removeEventListener('touchmove', preventScroll);
    document.dispatchEvent(new CustomEvent('invitation-opened')); window.scrollTo(0, 0);
    document.querySelector('audio')?.play()?.catch(() => {});
  };
  let activePopup = null, backdrop = null;
  const closePopup = () => { if (activePopup) activePopup.style.setProperty('display', 'none', 'important'); backdrop?.remove(); activePopup = null; };
  const showPopup = id => {
    closePopup();
    const popup = byId(id); if (!popup) return;
    let ancestor = popup.parentElement;
    while (ancestor && ancestor !== document.body) { ancestor.style.display = 'block'; ancestor = ancestor.parentElement; }
    popup.style.setProperty('display', 'block', 'important');
    Object.assign(popup.style, { position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', zIndex: '9999', maxHeight: '90vh', overflowY: 'auto' });
    popup.setAttribute('role', 'dialog'); popup.setAttribute('aria-modal', 'true');
    if (!popup.querySelector('.standalone-popup-close')) {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'standalone-popup-close'; button.textContent = '×'; button.setAttribute('aria-label','Đóng'); button.onclick = closePopup; popup.appendChild(button);
    }
    backdrop = document.createElement('div'); backdrop.className = 'standalone-popup-backdrop'; backdrop.onclick = closePopup; document.body.appendChild(backdrop); activePopup = popup;
  };
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closePopup(); });
  config.actions.forEach(action => {
    const element = byId(action.id); if (!element) return;
    element.style.cursor = 'pointer'; element.setAttribute('tabindex','0'); element.setAttribute('role','button');
    const perform = event => {
      event.preventDefault();
      if (action.a === 'change_index') open(action.dw, action.dH);
      if (action.a === 'popup' && action.dw) showPopup(action.dw);
      if (action.a === 'link' && action.dw) window.open(action.dw, '_blank', 'noopener');
      if (action.a === 'copy_clipboard') navigator.clipboard?.writeText(action.dL || '').catch(() => {});
    };
    element.addEventListener('click', perform); element.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') perform(event); });
  });
  const seal = byId('GROUP89'), doors = byId('GROUP88');
  if (seal && doors) { seal.style.cursor='pointer'; seal.onclick=()=>{doors.classList.add('door-open');setTimeout(()=>doors.classList.add('door-closed-hidden'),800);}; }
  const animate = entry => {
    const element = byId(entry.id), child = element?.firstElementChild;
    if (!child || element.dataset.revealed) return;
    element.dataset.revealed = 'true'; child.style.opacity='1'; child.style.animation=`${entry.name} 1.2s ease ${entry.repeat?'infinite':'both'}`;
  };
  if (typeof IntersectionObserver !== 'undefined') {
    const entries = new Map(config.animations.map(entry=>[entry.id,entry]));
    const observer = new IntersectionObserver(changes=>changes.forEach(change=>{if(change.isIntersecting && !closed){animate(entries.get(change.target.id));observer.unobserve(change.target);}}),{threshold:.05});
    config.animations.forEach(entry=>{const element=byId(entry.id);if(element){if(!entry.repeat&&element.firstElementChild)element.firstElementChild.style.opacity='0';observer.observe(element);}});
    document.addEventListener('invitation-opened',()=>config.animations.forEach(entry=>{const element=byId(entry.id);if(element&&!element.dataset.revealed){observer.unobserve(element);observer.observe(element);}}));
  } else config.animations.forEach(animate);
  const countdown = () => config.countdowns.forEach(countdown=>{
    const seconds=Math.max(0,Math.floor((countdown.date-Date.now())/1000));
    const values={day:Math.floor(seconds/86400),hour:Math.floor(seconds/3600)%24,minute:Math.floor(seconds/60)%60,seconds:seconds%60};
    config.countdownParts.forEach(part=>{const item=byId(part.id);if(item&&byId(countdown.id)?.contains(item)){const target=item.querySelector('.ladi-countdown-text')||item;target.textContent=String(values[part.unit]||0).padStart(2,'0');}});
  }); countdown();setInterval(countdown,1000);
  const audio = document.querySelector('audio');
  const music = byId('toggleMusic');
  music?.addEventListener('click',()=>{if(audio){audio.paused?audio.play().catch(()=>{}):audio.pause();music.classList.toggle('rippling',!audio.paused);}});
  const guest=byId('HEADLINE732');if(guest)guest.textContent=new URLSearchParams(window.location.search).get('Ten')||'Quý khách';
})();
