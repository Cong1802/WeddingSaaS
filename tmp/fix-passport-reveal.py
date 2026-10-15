from pathlib import Path
for root in ['public/templates/passport','laravel-backend/public/templates/passport']:
 p=Path(root)/'assets/passport.js';s=p.read_text(encoding='utf-8')
 start=s.index('    const animate = entry => {');end=s.index('\n  }\n\n  const countdown',start)
 s=s[:start]+'''    const animate = entry => {
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
    } else animations.forEach(animate);'''+s[end:]
 p.write_text(s,encoding='utf-8')
 p=Path(root)/'index.html';s=p.read_text(encoding='utf-8').replace('effects-3','reveal-4');p.write_text(s,encoding='utf-8')
