(() => {
  const scene = document.querySelector('.royal-scene');
  const seal = scene?.querySelector('.royal-wax-seal');
  if (!seal) return;
  // Each data-layer is independent; the scene state coordinates the opening.
  seal.addEventListener('click', () => {
    const opened = scene.dataset.animation !== 'opened';
    scene.dataset.animation = opened ? 'opened' : 'idle';
    seal.setAttribute('aria-pressed', String(opened));
    seal.setAttribute('aria-label', opened ? 'Đóng phong bì cưới' : 'Mở phong bì cưới');
    scene.dispatchEvent(new CustomEvent('royal-envelope-toggle', {bubbles: true, detail: {opened}}));
  });
})();
