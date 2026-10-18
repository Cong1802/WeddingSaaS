(() => {
  const toast = document.querySelector('.lily-toast');
  let toastTimer;

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2600);
  };

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) {
    const scale = Math.min(1, window.innerWidth / 420);
    viewport.content = `width=420, initial-scale=${scale}, maximum-scale=4, user-scalable=yes, viewport-fit=cover`;
  }

  const lazyElements = document.querySelectorAll('.lazy');
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove('lazy');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '240px 0px' });

    lazyElements.forEach((element) => imageObserver.observe(element));
  } else {
    lazyElements.forEach((element) => element.classList.remove('lazy'));
  }

  const entranceElements = document.querySelectorAll('.animation');
  const animatedChildSelector = '.group-container, .text-block-css, .image-block-css, .rectangle-css, .button-css';
  const restartEntrance = (element) => {
    element.classList.remove('is-inview');
    element.querySelectorAll(animatedChildSelector).forEach((target) => {
      if (window.getComputedStyle(target).animationName === 'none') return;
      target.style.setProperty('animation', 'none', 'important');
      void target.offsetWidth;
      target.style.removeProperty('animation');
    });
    element.classList.add('is-inview');
  };

  if (entranceElements.length) {
    if ('IntersectionObserver' in window) {
      const entranceObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          restartEntrance(entry.target);
          observer.unobserve(entry.target);
        });
      }, { rootMargin: '0px 0px 10% 0px', threshold: 0 });

      entranceElements.forEach((element) => entranceObserver.observe(element));
    } else {
      entranceElements.forEach((element) => element.classList.add('is-inview'));
    }
  }

  const music = document.getElementById('bgMusic');
  const musicButton = document.getElementById('music-btn');
  if (music && musicButton) {
    musicButton.classList.remove('is-playing');
    musicButton.setAttribute('role', 'button');
    musicButton.setAttribute('tabindex', '0');
    musicButton.setAttribute('aria-label', 'Bật hoặc tắt nhạc nền');
    musicButton.setAttribute('aria-pressed', 'false');

    const toggleMusic = async () => {
      if (music.paused) {
        try {
          await music.play();
          musicButton.classList.add('is-playing');
          musicButton.setAttribute('aria-pressed', 'true');
        } catch {
          showToast('Chạm lại để phát nhạc nền nhé.');
        }
        return;
      }

      music.pause();
      musicButton.classList.remove('is-playing');
      musicButton.setAttribute('aria-pressed', 'false');
    };

    musicButton.addEventListener('click', toggleMusic);
    musicButton.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      toggleMusic();
    });
    music.addEventListener('pause', () => {
      musicButton.classList.remove('is-playing');
      musicButton.setAttribute('aria-pressed', 'false');
    });
  }

  const wishForm = document.getElementById('wishForm');
  const wishes = document.getElementById('wishesContainer');
  if (wishForm && wishes) {
    wishForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = wishForm.querySelector('#senderName')?.value.trim();
      const message = wishForm.querySelector('#senderMessage')?.value.trim();
      if (!name || !message) return;

      wishes.querySelector('.loading-text')?.remove();
      const item = document.createElement('div');
      item.className = 'wish-item';
      const sender = document.createElement('div');
      sender.className = 'wish-name';
      sender.textContent = name;
      const text = document.createElement('div');
      text.className = 'wish-content';
      text.textContent = message;
      item.append(sender, text);
      wishes.prepend(item);
      wishForm.reset();
      showToast('Đã thêm lời chúc vào bản xem thiệp.');
    });
  }

  document.querySelectorAll('form:not(#wishForm)').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      showToast('Cảm ơn bạn đã xác nhận tham dự.');
    });

    form.querySelector('.com-button')?.addEventListener('click', (event) => {
      event.preventDefault();
      showToast('Cảm ơn bạn đã xác nhận tham dự.');
    });
  });

  const lightbox = document.querySelector('.lily-lightbox');
  const lightboxImage = lightbox?.querySelector('img');
  const closeLightbox = () => {
    lightbox?.classList.remove('is-open');
    if (lightboxImage) lightboxImage.removeAttribute('src');
  };

  document.getElementById('w-vlt060mf')?.addEventListener('click', (event) => {
    const imageBlock = event.target.closest('.com-image-block');
    const imageLayer = imageBlock?.querySelector('.image-background');
    if (!imageLayer || !lightbox || !lightboxImage) return;
    const backgroundImage = window.getComputedStyle(imageLayer).backgroundImage;
    const source = backgroundImage.match(/url\(["']?(.*?)["']?\)/)?.[1];
    if (!source || source === 'none') return;
    lightboxImage.src = source;
    lightbox.classList.add('is-open');
  });

  lightbox?.querySelector('button')?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeLightbox();
  });

  const canvas = document.getElementById('heartCanvas');
  const context = canvas?.getContext?.('2d');
  if (canvas && context && !reducedMotion) {
    const particles = [];
    const particleCount = window.innerWidth < 600 ? 13 : 22;
    let width = 0;
    let height = 0;
    let frameId;

    const resizeCanvas = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const makeParticle = (initial = false) => ({
      x: Math.random() * width,
      y: initial ? Math.random() * height : -12,
      size: 5 + Math.random() * 4,
      speed: 0.35 + Math.random() * 0.55,
      drift: (Math.random() - 0.5) * 0.35,
      alpha: 0.25 + Math.random() * 0.32,
    });

    const drawHeart = (particle) => {
      const { x, y, size } = particle;
      context.beginPath();
      context.moveTo(x, y + size * 0.32);
      context.bezierCurveTo(x, y, x - size * 0.62, y, x - size * 0.62, y + size * 0.34);
      context.bezierCurveTo(x - size * 0.62, y + size * 0.78, x, y + size * 0.95, x, y + size);
      context.bezierCurveTo(x, y + size * 0.95, x + size * 0.62, y + size * 0.78, x + size * 0.62, y + size * 0.34);
      context.bezierCurveTo(x + size * 0.62, y, x, y, x, y + size * 0.32);
      context.fill();
    };

    const animateHearts = () => {
      context.clearRect(0, 0, width, height);
      particles.forEach((particle, index) => {
        particle.y += particle.speed;
        particle.x += particle.drift;
        if (particle.y > height + 16) particles[index] = makeParticle();
        context.globalAlpha = particle.alpha;
        context.fillStyle = index % 4 === 0 ? '#c69a56' : '#df9cad';
        drawHeart(particles[index]);
      });
      context.globalAlpha = 1;
      frameId = window.requestAnimationFrame(animateHearts);
    };

    resizeCanvas();
    for (let index = 0; index < particleCount; index += 1) particles.push(makeParticle(true));
    window.addEventListener('resize', resizeCanvas, { passive: true });
    animateHearts();
    window.addEventListener('pagehide', () => window.cancelAnimationFrame(frameId), { once: true });
  } else if (canvas) {
    canvas.remove();
  }
})();
