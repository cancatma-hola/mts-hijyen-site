import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Comparison section'a sürüklenebilir wipe slider ekler.
// Klasik (bad) panelin üzerine MTS (good) panel clip-path ile bindirilir;
// handle sürüklenince MTS paneli açılır/kapanır.

export function initCompareSlider() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(max-width: 900px)').matches) return;

  const section = document.querySelector('.compare-section');
  if (!section) return;
  const wrap = section.querySelector('.compare-wrap');
  if (!wrap) return;
  const colBad = wrap.querySelector('.compare-col--bad');
  const colGood = wrap.querySelector('.compare-col--good');
  const mid = wrap.querySelector('.compare-mid');
  if (!colBad || !colGood) return;

  // Wrap'i overlay moda al
  wrap.classList.add('compare-wrap--slider');
  if (mid) mid.style.display = 'none';

  // Handle ekle
  const handle = document.createElement('div');
  handle.className = 'compare-handle';
  handle.setAttribute('aria-label', 'Karşılaştırma kaydırıcısı');
  handle.setAttribute('data-cursor', 'drag');
  handle.setAttribute('data-cursor-label', 'SÜRÜKLE');
  handle.innerHTML = `
    <div class="compare-handle-line"></div>
    <div class="compare-handle-knob">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6"/>
        <polyline points="9 18 15 12 9 6" transform="translate(8 0)"/>
      </svg>
    </div>
    <div class="compare-handle-line"></div>
  `;
  wrap.appendChild(handle);

  const state = { progress: 0.5 };

  function apply() {
    const p = Math.max(0, Math.min(1, state.progress));
    colGood.style.clipPath = `inset(0 0 0 ${(1 - p) * 100}%)`;
    handle.style.left = `${p * 100}%`;
  }
  apply();

  // Scroll'la otomatik başlangıç animasyonu
  gsap.fromTo(
    state,
    { progress: 0.08 },
    {
      progress: 0.55,
      ease: 'power2.out',
      duration: 1.4,
      scrollTrigger: {
        trigger: section,
        start: 'top 70%',
        toggleActions: 'play none none reverse',
      },
      onUpdate: apply,
    }
  );

  // Drag interaction
  let dragging = false;
  const setFromX = (clientX) => {
    const r = wrap.getBoundingClientRect();
    state.progress = (clientX - r.left) / r.width;
    apply();
  };
  handle.addEventListener('mousedown', (e) => {
    dragging = true;
    e.preventDefault();
    document.body.classList.add('is-dragging');
  });
  window.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    setFromX(e.clientX);
  });
  window.addEventListener('mouseup', () => {
    dragging = false;
    document.body.classList.remove('is-dragging');
  });
  // Touch
  handle.addEventListener('touchstart', (e) => {
    dragging = true;
  }, { passive: true });
  window.addEventListener('touchmove', (e) => {
    if (!dragging) return;
    setFromX(e.touches[0].clientX);
  }, { passive: true });
  window.addEventListener('touchend', () => { dragging = false; });

  // Click-to-position (sadece wrap üstünde, handle dışında)
  wrap.addEventListener('click', (e) => {
    if (handle.contains(e.target)) return;
    setFromX(e.clientX);
  });
}
