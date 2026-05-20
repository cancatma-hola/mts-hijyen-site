import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Hero giriş animasyonu — preloader bittikten sonra çalışır.
// h1 içindeki kelime kelime mask reveal, alt metin blur-in, butonlar pop.

function splitWords(el) {
  const text = el.textContent.trim();
  el.textContent = '';
  return text.split(/\s+/).map((w) => {
    const wrap = document.createElement('span');
    wrap.className = 'hero-word-wrap';
    wrap.style.display = 'inline-block';
    wrap.style.overflow = 'hidden';
    wrap.style.verticalAlign = 'bottom';
    wrap.style.lineHeight = '1.05';

    const inner = document.createElement('span');
    inner.className = 'hero-word';
    inner.textContent = w;
    inner.style.display = 'inline-block';
    inner.style.willChange = 'transform, opacity';

    wrap.appendChild(inner);
    el.appendChild(wrap);
    el.appendChild(document.createTextNode(' '));
    return inner;
  });
}

export function initHeroAnim() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const hero = document.querySelector('.hero');
  if (!hero) return;

  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  const h1Spans = hero.querySelectorAll('h1 > span, h1 > em');
  const desc = hero.querySelector('.hero-desc');
  const buttons = hero.querySelectorAll('.hero-buttons .btn');
  const badge = hero.querySelector('.hero-badge');
  const stats = hero.querySelectorAll('.hero-stats > div');
  const scrollInd = hero.querySelector('.hero-scroll-indicator');

  // Başlangıçta gizle
  gsap.set([badge, desc, buttons, stats, scrollInd], { autoAlpha: 0, y: 30 });
  const words = [];
  h1Spans.forEach((s) => words.push(...splitWords(s)));
  gsap.set(words, { yPercent: 110, opacity: 0 });

  function play() {
    const tl = gsap.timeline();
    tl.to(badge, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out' })
      .to(
        words,
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.0,
          ease: 'expo.out',
          stagger: 0.06,
        },
        '-=0.4'
      )
      .to(
        desc,
        { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: 'power3.out' },
        '-=0.5'
      )
      .to(
        buttons,
        { autoAlpha: 1, y: 0, duration: 0.7, ease: 'back.out(1.6)', stagger: 0.1 },
        '-=0.5'
      )
      .to(
        stats,
        { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.08 },
        '-=0.4'
      )
      .to(scrollInd, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3');
  }

  // Preloader bitince çal, yoksa direkt
  if (document.documentElement.classList.contains('is-loaded')) {
    play();
  } else {
    window.addEventListener('mts:loaded', play, { once: true });
    // Fallback — preloader hiç açılmadıysa
    setTimeout(() => {
      if (!document.documentElement.classList.contains('is-loaded')) play();
    }, 2500);
  }

  // Scroll'la hero içeriği parallax + opacity — mobilde devre dışı (pin'leme yok)
  if (!isMobile) {
    gsap.to(hero.querySelector('.hero-content'), {
      y: -80,
      opacity: 0.3,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  // Lamp efekti scroll'la söner
  const lamp = hero.querySelector('.hero-lamp');
  if (lamp) {
    gsap.to(lamp, {
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom 30%',
        scrub: true,
      },
    });
  }
}
