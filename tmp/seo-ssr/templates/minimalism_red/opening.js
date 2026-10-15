(() => {
  const gate = document.getElementById('minimal-opening');
  const card = gate.querySelector('.minimal-opening-card');
  const button = gate.querySelector('button');
  let opened = false;
  for (let index = 0; index < 14; index++) {
    const heart = document.createElement('span');
    heart.className = 'minimal-opening-heart';heart.textContent = '♥';
    heart.setAttribute('aria-hidden', 'true');
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDelay = -Math.random() * 12 + 's';
    heart.style.color = index % 3 ? '#b12732' : '#f8efe6';
    gate.appendChild(heart);
  }
  window.scrollTo(0, 0);
  const blockScroll = event => { if (!opened) event.preventDefault(); };
  document.addEventListener('wheel', blockScroll, { passive: false });
  document.addEventListener('touchmove', blockScroll, { passive: false });
  button.addEventListener('click', () => {
    if (gate.dataset.state !== 'idle') return;
    gate.dataset.state = 'opening'; button.disabled = true;
    button.setAttribute('aria-busy', 'true');
    const audio = document.getElementById('bg-music');
    audio?.play?.()?.catch(() => {});
    setTimeout(() => {
      gate.dataset.state = 'away';
      for (let index = 0; index < 28; index++) {
        const particle = document.createElement('span');
        particle.className = 'minimal-opening-burst'; particle.textContent = '♥';
        const angle = index / 28 * Math.PI * 2;
        particle.style.setProperty('--x', Math.cos(angle) * (140 + Math.random() * 160) + 'px');
        particle.style.setProperty('--y', Math.sin(angle) * (140 + Math.random() * 160) + 'px');
        particle.style.color = ['#7a1f26','#a8323b','#c9a24a','#ece4d8'][index % 4];
        gate.appendChild(particle);
      }
    }, 500);
    setTimeout(() => {
      opened = true;
      document.documentElement.dataset.minimalOpened = 'true';
      document.removeEventListener('wheel', blockScroll);
      document.removeEventListener('touchmove', blockScroll);
      gate.remove(); window.scrollTo(0, 0);
    }, 1300);
  });
})();
