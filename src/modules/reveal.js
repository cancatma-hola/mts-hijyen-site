import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Reveal sistemi: [data-reveal="fade-up|fade|mask|split|stagger"]
// Ekstra: [data-reveal-delay="0.2"], [data-reveal-stagger="0.08"]

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function splitToChars(el) {
  const text = el.textContent;
  el.textContent = '';
  const frag = document.createDocumentFragment();
  for (const ch of text) {
    if (ch === ' ') {
      frag.appendChild(document.createTextNode(' '));
      continue;
    }
    const span = document.createElement('span');
    span.className = 'reveal-char';
    span.textContent = ch;
    span.style.display = 'inline-block';
    span.style.willChange = 'transform, opacity';
    frag.appendChild(span);
  }
  el.appendChild(frag);
  return el.querySelectorAll('.reveal-char');
}

function splitToWords(el) {
  const words = el.textContent.split(/\s+/);
  el.textContent = '';
  const spans = words.map((w) => {
    const span = document.createElement('span');
    span.className = 'reveal-word';
    span.textContent = w;
    span.style.display = 'inline-block';
    span.style.marginRight = '0.28em';
    span.style.willChange = 'transform, opacity, filter';
    el.appendChild(span);
    return span;
  });
  return spans;
}

function applyReveal(el) {
  const type = el.dataset.reveal || 'fade-up';
  const delay = parseFloat(el.dataset.revealDelay || '0');
  const stagger = parseFloat(el.dataset.revealStagger || '0.06');
  const trigger = {
    trigger: el,
    start: 'top 85%',
    toggleActions: 'play none none none',
  };

  if (prefersReducedMotion) {
    gsap.set(el, { autoAlpha: 1 });
    return;
  }

  if (type === 'split') {
    const chars = splitToChars(el);
    gsap.set(el, { autoAlpha: 1 });
    gsap.from(chars, {
      yPercent: 110,
      rotate: 6,
      opacity: 0,
      duration: 0.9,
      ease: 'expo.out',
      stagger,
      delay,
      scrollTrigger: trigger,
    });
  } else if (type === 'words') {
    const words = splitToWords(el);
    gsap.set(el, { autoAlpha: 1 });
    gsap.from(words, {
      y: 24,
      opacity: 0,
      filter: 'blur(8px)',
      duration: 0.9,
      ease: 'power3.out',
      stagger,
      delay,
      scrollTrigger: trigger,
    });
  } else if (type === 'mask') {
    el.style.overflow = 'hidden';
    const inner = document.createElement('span');
    inner.style.display = 'inline-block';
    inner.style.willChange = 'transform';
    while (el.firstChild) inner.appendChild(el.firstChild);
    el.appendChild(inner);
    gsap.set(el, { autoAlpha: 1 });
    gsap.from(inner, {
      yPercent: 110,
      duration: 1.1,
      ease: 'expo.out',
      delay,
      scrollTrigger: trigger,
    });
  } else if (type === 'stagger') {
    const children = el.children;
    gsap.set(el, { autoAlpha: 1 });
    gsap.from(children, {
      y: 40,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      stagger,
      delay,
      scrollTrigger: trigger,
    });
  } else if (type === 'fade') {
    gsap.fromTo(
      el,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1.1,
        ease: 'power2.out',
        delay,
        scrollTrigger: trigger,
      }
    );
  } else {
    // fade-up (default)
    gsap.fromTo(
      el,
      { y: 48, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.0,
        ease: 'power3.out',
        delay,
        scrollTrigger: trigger,
      }
    );
  }
}

export function initReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  els.forEach(applyReveal);
}
