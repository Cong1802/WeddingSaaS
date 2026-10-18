(() => {
  const byId = id => document.getElementById('passport-' + id);
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) viewport.content = window.innerWidth < 420 ? 'width=420' : 'width=device-width, initial-scale=1';
  const cover = byId('TAB_ITEM1');
  const invitation = byId('TAB_ITEM2');
  const plane = byId('IMAGE103');
  if (plane) { plane.style.animation = 'none'; plane.style.visibility = 'hidden'; }
  let opened = false;
  document.documentElement.dataset.passportState = 'closed';
  window.scrollTo?.(0, 0);
  const preventClosedScroll = event => {
    if (!opened) event.preventDefault();
  };
  document.addEventListener('wheel', preventClosedScroll, { passive: false });
  document.addEventListener('touchmove', preventClosedScroll, { passive: false });
  const preventClosedKeys = event => {
    if (!opened && ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)
      && event.target !== byId('T01')) event.preventDefault();
  };
  document.addEventListener('keydown', preventClosedKeys);

  const open = () => {
    if (opened) return;
    opened = true;
    document.documentElement.dataset.passportState = 'open';
    document.removeEventListener('wheel', preventClosedScroll);
    document.removeEventListener('touchmove', preventClosedScroll);
    document.removeEventListener('keydown', preventClosedKeys);
    window.scrollTo?.(0, 0);
    cover.style.setProperty('display', 'none', 'important');
    invitation.style.setProperty('display', 'block', 'important');
    invitation.classList.add('selected');
    if (plane) {
      plane.style.visibility = 'visible';
      plane.style.animation = 'passport-takeoff 4s ease-in-out forwards';
      plane.addEventListener('animationend', () => { plane.style.visibility = 'hidden'; }, { once: true });
    }
  };
  byId('T01')?.addEventListener('click', open);
  byId('T01')?.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); }
  });

  // This invitation explicitly enables the visual effects requested for this design.
  {
    const particles = document.createElement('div');
    particles.className = 'passport-particles';
    particles.setAttribute('aria-hidden', 'true');
    document.body.appendChild(particles);
    const drop = (heart, initial = false) => {
      const particle = document.createElement('span');
      particle.className = 'passport-particle ' + (heart ? 'passport-heart' : 'passport-snow');
      particle.textContent = heart ? '♥' : '❅';
      const duration = heart ? 10 + Math.random() * 5 : 14 + Math.random() * 6;
      particle.style.left = Math.random() * 100 + '%';
      particle.style.fontSize = (heart ? 16 + Math.random() * 13 : 10 + Math.random() * 8) + 'px';
      particle.style.setProperty('--duration', duration + 's');
      particle.style.setProperty('--drift', Math.random() * 120 - 60 + 'px');
      if (initial) particle.style.animationDelay = -Math.random() * duration + 's';
      particles.appendChild(particle);
      particle.addEventListener('animationend', () => particle.remove(), { once: true });
      setTimeout(() => particle.remove(), duration * 1000 + 1000);
    };
    for (let index = 0; index < 8; index++) drop(index % 2 === 0, true);
    setInterval(() => { if (!document.hidden) drop(true); }, 2400);
    setInterval(() => { if (!document.hidden) drop(false); }, 3000);
    const animations = [{"id":"passport-HEADLINE3","name":"fadeInDown","duration":1.2,"repeat":false},{"id":"passport-IMAGE10","name":"tada","duration":1.2,"repeat":false},{"id":"passport-IMAGE11","name":"swing","duration":1.2,"repeat":false},{"id":"passport-PARAGRAPH42","name":"fadeInDown","duration":1.2,"repeat":false},{"id":"passport-GROUP9","name":"fadeInRight","duration":1.2,"repeat":false},{"id":"passport-IMAGE12","name":"bounceIn","duration":1.2,"repeat":false},{"id":"HEADLINE3","name":"fadeInDown","duration":1.2,"repeat":false},{"id":"passport-GROUP11","name":"fadeInLeft","duration":1.2,"repeat":false},{"id":"PARAGRAPH5","name":"fadeInRight","duration":1.2,"repeat":false},{"id":"PARAGRAPH3","name":"fadeInLeft","duration":1.2,"repeat":false},{"id":"passport-PARAGRAPH62","name":"bounceIn","duration":1.2,"repeat":false},{"id":"passport-PARAGRAPH78","name":"fadeInDown","duration":1.2,"repeat":false},{"id":"passport-PARAGRAPH79","name":"fadeInUp","duration":1.2,"repeat":false},{"id":"passport-IMAGE36","name":"fadeInLeft","duration":1.2,"repeat":false},{"id":"passport-IMAGE37","name":"fadeInLeft","duration":1.2,"repeat":false},{"id":"passport-IMAGE38","name":"fadeInRight","duration":1.2,"repeat":false},{"id":"passport-IMAGE39","name":"fadeInRight","duration":1.2,"repeat":false},{"id":"passport-IMAGE40","name":"fadeInDown","duration":1.2,"repeat":false},{"id":"passport-IMAGE41","name":"fadeInDown","duration":1.2,"repeat":false},{"id":"passport-IMAGE42","name":"fadeInUp","duration":1.2,"repeat":false},{"id":"passport-IMAGE43","name":"fadeInUp","duration":1.2,"repeat":false},{"id":"passport-IMAGE44","name":"fadeInLeft","duration":1.2,"repeat":false},{"id":"passport-IMAGE45","name":"fadeInRight","duration":1.2,"repeat":false},{"id":"passport-GROUP37","name":"fadeInDown","duration":1.2,"repeat":false},{"id":"passport-PARAGRAPH82","name":"fadeIn","duration":1.2,"repeat":false},{"id":"passport-GROUP36","name":"pulse","duration":3,"repeat":true},{"id":"passport-PARAGRAPH83","name":"fadeInRight","duration":1.2,"repeat":false},{"id":"passport-PARAGRAPH84","name":"fadeInRight","duration":1.2,"repeat":false},{"id":"passport-PARAGRAPH85","name":"fadeInRight","duration":1.2,"repeat":false},{"id":"passport-PARAGRAPH86","name":"fadeInRight","duration":1.2,"repeat":false},{"id":"passport-GROUP40","name":"fadeInUp","duration":1.2,"repeat":false},{"id":"passport-PARAGRAPH2","name":"fadeInLeft","duration":1.2,"repeat":false},{"id":"passport-PARAGRAPH1","name":"fadeInRight","duration":1.2,"repeat":false},{"id":"passport-T01","name":"pulse","duration":3,"repeat":true},{"id":"BUTTON10","name":"pulse","duration":3,"repeat":true},{"id":"passport-IMAGE71","name":"fadeInLeft","duration":1.2,"repeat":false},{"id":"passport-IMAGE72","name":"fadeInRight","duration":1.2,"repeat":false},{"id":"passport-IMAGE73","name":"fadeInLeft","duration":1.2,"repeat":false},{"id":"passport-IMAGE74","name":"fadeInRight","duration":1.2,"repeat":false},{"id":"passport-IMAGE81","name":"fadeInLeft","duration":1.2,"repeat":false},{"id":"passport-PARAGRAPH103","name":"fadeInRight","duration":1.2,"repeat":false},{"id":"passport-PARAGRAPH102","name":"fadeInLeft","duration":1.2,"repeat":false},{"id":"passport-PARAGRAPH101","name":"fadeInRight","duration":1.2,"repeat":false},{"id":"passport-IMAGE77","name":"fadeInRight","duration":1.2,"repeat":false},{"id":"passport-IMAGE76","name":"fadeInLeft","duration":1.2,"repeat":false},{"id":"passport-IMAGE106","name":"fadeInLeft","duration":1.2,"repeat":false},{"id":"passport-PARAGRAPH117","name":"fadeInRight","duration":1.2,"repeat":false},{"id":"passport-IMAGE107","name":"fadeInLeft","duration":1.2,"repeat":false},{"id":"passport-PARAGRAPH118","name":"fadeInLeft","duration":1.2,"repeat":false},{"id":"passport-IMAGE108","name":"fadeInRight","duration":1.2,"repeat":false},{"id":"passport-PARAGRAPH119","name":"fadeInRight","duration":1.2,"repeat":false}];
    const animate = entry => {
      const element = document.getElementById(entry.id);
      const child = element?.firstElementChild;
      if (!child || element.dataset.reveal === 'visible') return;
      element.dataset.reveal = 'visible';
      child.style.opacity = '1';
      child.style.animation = `${entry.name} ${entry.duration}s ease ${entry.repeat ? 'infinite' : 'both'}`;
    };
    if (typeof IntersectionObserver !== 'undefined') {
      const entries = new Map(animations.map(entry => [entry.id, entry]));
      const observer = new IntersectionObserver(changes => {
        changes.forEach(change => {
          if (change.isIntersecting) {
            animate(entries.get(change.target.id));
            observer.unobserve(change.target);
          }
        });
      }, { threshold: 0.05, rootMargin: '0px 0px -6% 0px' });
      animations.forEach(entry => {
        const element = document.getElementById(entry.id);
        const child = element?.firstElementChild;
        if (!child) return;
        // Hide only the visual child; the parent keeps its dimensions for observation.
        element.dataset.reveal = 'pending';
        child.style.animation = 'none';
        child.style.opacity = entry.repeat ? '1' : '0';
        observer.observe(element);
      });
    } else animations.forEach(animate);
  }

  const form = document.querySelector('#passport-FORM2 form');
  form?.addEventListener('submit', async event => {
    event.preventDefault();
    const status = document.getElementById('passport-rsvp-status');
    const slug = document.documentElement.dataset.cardSlug;
    if (!slug) {
      status.textContent = 'Đây là bản xem mẫu. Xác nhận sẽ được gửi khi mở link thiệp đã xuất bản.';
      return;
    }
    const button = form.querySelector('button[type="submit"]');
    if (button.disabled) return;
    button.disabled = true;
    status.textContent = 'Đang gửi…';
    try {
      const values = new FormData(form);
      const response = await fetch(`/api/cards/view/${encodeURIComponent(slug)}/rsvp`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({name: values.get('name'), attendance: values.get('attendance'), guest_count: Number(values.get('form_item8') || 1), message: values.get('message')})
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || 'Chưa gửi được xác nhận. Vui lòng thử lại.');
      status.textContent = result.message;
      form.reset();
    } catch (error) { status.textContent = error.message || 'Lỗi kết nối. Vui lòng thử lại.'; }
    finally { button.disabled = false; }
  });
  const countdown = () => {
    const text = document.querySelector('[data-card-field="weddingDate"]')?.textContent || '';
    const match = text.replace(/\s/g, '').match(/(\d{1,2})[./-](\d{1,2})[./-](\d{4})/);
    const date = match ? new Date(+match[3], +match[2] - 1, +match[1]) : null;
    const monthLabel = byId('PARAGRAPH10')?.querySelector('.ladi-paragraph');
    if (date && monthLabel) monthLabel.textContent = `Tháng ${date.getMonth() + 1} - ${date.getFullYear()}`;
    const seconds = date ? Math.max(0, Math.floor((date - Date.now()) / 1000)) : 0;
    [Math.floor(seconds / 86400), Math.floor(seconds / 3600) % 24, Math.floor(seconds / 60) % 60, seconds % 60].forEach((value, index) => {
      const item = byId('COUNTDOWN_ITEM' + (index + 1));
      if (item) item.textContent = String(value).padStart(2, '0');
    });
  };
  countdown(); setInterval(countdown, 1000);
  const map = document.getElementById('BUTTON10');
  if (map) {
    map.setAttribute('role', 'link'); map.tabIndex = 0;
    const showMap = () => {
      const address = document.querySelector('[data-card-field="brideAddress"]')?.textContent || '';
      window.open('https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(address), '_blank', 'noopener');
    };
    map.addEventListener('click', showMap);
    map.addEventListener('keydown', event => { if (event.key === 'Enter') showMap(); });
  }
})();
