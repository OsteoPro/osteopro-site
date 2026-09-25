(() => {
  'use strict';
  const scriptBase = new URL('.', document.currentScript.src);
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  document.documentElement.classList.add('js');
  if (menu && nav) {
    menu.hidden = false;
    const closeMenu = () => {
      menu.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
    };
    menu.addEventListener('click', () => {
      const open = menu.getAttribute('aria-expanded') !== 'true';
      menu.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
    });
    nav.addEventListener('click', event => {
      if (event.target.closest('a')) closeMenu();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        menu.focus();
      }
    });
    window.matchMedia('(min-width: 951px)').addEventListener('change', closeMenu);
  }

  const loadScript = src => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.onload = resolve;
    script.onerror = reject;
    document.head.append(script);
  });

  let motionController;
  let scrollContext;
  let started = false;
  const art = document.querySelector('.hero-art');
  const supportsWebGL = () => {
    try {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: true });
      if (!context) return false;
      context.getExtension('WEBGL_lose_context')?.loseContext();
      return true;
    } catch { return false; }
  };

  const startEnhancements = async () => {
    if (started || media.matches || navigator.connection?.saveData) return;
    started = true;
    try {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js');
      if (media.matches) return;
      if (art && supportsWebGL()) {
        Promise.all([
          import('https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js'),
          import(new URL('hero.js', scriptBase).href)
        ]).then(([THREE, hero]) => {
          if (!media.matches) motionController = hero.createHero(THREE, window.gsap, art);
        }).catch(() => { art.classList.remove('is-live'); });
      }
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js');
      if (media.matches) return;
      window.gsap.registerPlugin(window.ScrollTrigger);
      scrollContext = window.gsap.matchMedia();
      scrollContext.add('(prefers-reduced-motion: no-preference)', () => {
        document.querySelectorAll('[data-reveal]').forEach(element => {
          window.ScrollTrigger.create({
            trigger: element,
            start: 'top 95%',
            once: true,
            onEnter: () => window.gsap.fromTo(element, { y: 18, opacity: .35 }, {
              y: 0,
              opacity: 1,
              duration: .7,
              ease: 'power2.out',
              clearProps: 'transform,opacity'
            })
          });
        });
      });
    } catch {
      // Content and navigation stay available if a CDN cannot be reached.
      scrollContext?.revert();
    }
  };

  const schedule = () => {
    if ('requestIdleCallback' in window) window.requestIdleCallback(startEnhancements, { timeout: 1400 });
    else window.setTimeout(startEnhancements, 150);
  };
  if (document.readyState === 'complete') schedule();
  else window.addEventListener('load', schedule, { once: true });
  media.addEventListener('change', () => {
    if (media.matches) {
      motionController?.dispose();
      motionController = undefined;
      scrollContext?.revert();
      scrollContext = undefined;
      started = false;
    } else schedule();
  });
})();
