import { gsap } from 'gsap';

export function initPreloader() {
  const root = document.createElement('div');
  root.className = 'mts-preloader';
  root.innerHTML = `
    <div class="mts-preloader__bg"></div>
    <div class="mts-preloader__content">
      <div class="mts-preloader__brand">
        <span class="mts-preloader__letter">M</span><span class="mts-preloader__letter">T</span><span class="mts-preloader__letter">S</span>
        <span class="mts-preloader__sep"></span>
        <span class="mts-preloader__sub">HİJYEN</span>
      </div>
      <div class="mts-preloader__bar"><div class="mts-preloader__fill"></div></div>
      <div class="mts-preloader__count">0%</div>
    </div>
  `;
  document.body.appendChild(root);
  document.documentElement.classList.add('is-loading');

  const fill = root.querySelector('.mts-preloader__fill');
  const count = root.querySelector('.mts-preloader__count');
  const letters = root.querySelectorAll('.mts-preloader__letter, .mts-preloader__sub');

  const state = { progress: 0 };

  gsap.from(letters, {
    yPercent: 100,
    opacity: 0,
    duration: 0.9,
    ease: 'expo.out',
    stagger: 0.08,
  });

  const tween = gsap.to(state, {
    progress: 1,
    duration: 1.6,
    ease: 'power2.inOut',
    onUpdate: () => {
      const p = Math.round(state.progress * 100);
      fill.style.transform = `scaleX(${state.progress})`;
      count.textContent = `${p}%`;
    },
  });

  function finish() {
    tween.progress(1);

    // Sayfa içeriği preloader çıkarken cross-fade ile belirsin
    // (is-loaded sınıfı opacity transition'ı tetikler — CSS head inline)
    document.documentElement.classList.remove('is-loading');
    document.documentElement.classList.add('is-loaded');
    document.body.classList.add('hero-ready');
    window.dispatchEvent(new Event('mts:loaded'));

    const tl = gsap.timeline({
      onComplete: () => {
        root.remove();
      },
    });
    tl.to(root.querySelector('.mts-preloader__content'), {
      opacity: 0,
      y: -16,
      duration: 0.55,
      ease: 'power2.in',
    })
      .to(
        root,
        {
          clipPath: 'inset(0% 0% 100% 0%)',
          duration: 1.1,
          ease: 'expo.inOut',
        },
        '-=0.35'
      );
  }

  if (document.readyState === 'complete') {
    setTimeout(finish, 600);
  } else {
    window.addEventListener('load', () => setTimeout(finish, 400));
  }
}
