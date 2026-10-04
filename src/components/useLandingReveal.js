import { useEffect } from 'react';

// Reveal groups once, without interfering with Swiper transforms or hover styles.
const selectors = [
  '.landing-hero__heading', '.landing-hero__visual', '.landing-hero__description',
  '.landing-hero__actions', '.landing-hero__benefits', '.landing-hero__trust',
  '.why-us__heading', '.why-us__visual', '.why-us__feature', '.why-us__card',
  '.template-gallery__heading', '.template-gallery__filters', '.template-gallery__carousel',
  '.wedding-steps__heading', '.wedding-steps__card', '.wedding-steps__step',
  '.wedding-features__heading', '.wedding-features__visual', '.wedding-features__card',
  '.wedding-pricing__heading', '.wedding-pricing__card', '.wedding-pricing__benefits',
  '.wedding-reviews__heading', '.wedding-reviews__carousel', '.wedding-reviews__action',
  '.wedding-faq__heading', '.wedding-faq__item', '.wedding-faq__visual',
  '.landing-final-cta', '.landing-final-cta__inner',
  '.site-footer__brand', '.site-footer__links', '.site-footer__newsletter',
].join(',');

export default function useLandingReveal() {
  useEffect(() => {
    const root = document.querySelector('.landing-page');
    if (!root || !window.IntersectionObserver) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const elements = [...root.querySelectorAll(selectors)];
    const observer = new IntersectionObserver(entries => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        target.classList.add('landing-reveal--visible');
        observer.unobserve(target);
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' });
    elements.forEach(element => {
      const siblings = [...element.parentElement.children].filter(child => child.matches(selectors));
      element.style.setProperty('--reveal-delay', `${Math.min(siblings.indexOf(element), 5) * 85}ms`);
      element.classList.add('landing-reveal');
      if (motion.matches) element.classList.add('landing-reveal--visible');
      else observer.observe(element);
    });
    const showAll = () => {
      if (!motion.matches) return;
      observer.disconnect();
      elements.forEach(element => element.classList.add('landing-reveal--visible'));
    };
    const revealFocused = event => {
      const element = event.target.closest('.landing-reveal');
      element?.classList.add('landing-reveal--visible');
    };
    motion.addEventListener('change', showAll);
    root.addEventListener('focusin', revealFocused);
    return () => {
      observer.disconnect();
      motion.removeEventListener('change', showAll);
      root.removeEventListener('focusin', revealFocused);
      elements.forEach(element => {
        element.classList.remove('landing-reveal', 'landing-reveal--visible');
        element.style.removeProperty('--reveal-delay');
      });
    };
  }, []);
}
