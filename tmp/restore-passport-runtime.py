from pathlib import Path
import json
for root in ['public/templates/passport','laravel-backend/public/templates/passport']:
 p=Path(root)/'assets/passport.js';s=p.read_text(encoding='utf-8')
 # Keep the original calendar artwork; only its repeated labels are synchronized.
 start=s.index("    const calendar = byId('SECTION2')")
 end=s.index('    const seconds =',start)
 s=s[:start]+'''    const monthLabel = byId('PARAGRAPH10')?.querySelector('.ladi-paragraph');
    if (date && monthLabel) monthLabel.textContent = `Tháng ${date.getMonth() + 1} - ${date.getFullYear()}`;
'''+s[end:]
 animations=(Path(root)/'assets/animations.json').read_text()
 insertion='''
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (!reducedMotion) {
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
    const animations = ANIMATION_DATA;
    const animate = entry => {
      const element = document.getElementById(entry.id);
      const child = element?.firstElementChild;
      if (child) child.style.animation = `${entry.name} ${entry.duration}s ease ${entry.repeat ? 'infinite' : 'both'}`;
    };
    if (typeof IntersectionObserver !== 'undefined') {
      const entries = new Map(animations.map(entry => [entry.id, entry]));
      const observer = new IntersectionObserver(changes => {
        changes.forEach(change => {
          if (change.isIntersecting) { animate(entries.get(change.target.id)); observer.unobserve(change.target); }
        });
      }, { threshold: 0.08 });
      animations.forEach(entry => {
        const element = document.getElementById(entry.id);
        if (element) observer.observe(element);
      });
    } else animations.forEach(animate);
  }
'''.replace('ANIMATION_DATA',animations)
 s=s.replace('  const countdown = () => {',insertion+'\n  const countdown = () => {')
 p.write_text(s,encoding='utf-8')
# Update the DOM runtime harness to support the restored particle lifecycle.
p=Path('tmp/verify-passport-runtime.mjs');s=p.read_text(encoding='utf-8');s=s.replace('setInterval:()=>0','setInterval:()=>0,setTimeout:()=>0');p.write_text(s,encoding='utf-8')
