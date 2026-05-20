import { gsap } from 'gsap';

// Custom cursor + magnetic buttons
// Usage:
//   - [data-magnetic] üzerine cursor yaklaşınca buton cursor'a doğru çekilir
//   - [data-cursor="view|drag|link"] cursor stilini değiştirir

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(hover: none)').matches;

export function initCursor() {
  if (prefersReducedMotion || isTouch) return;

  const root = document.createElement('div');
  root.className = 'mts-cursor';
  root.innerHTML = `
    <div class="mts-cursor__dot"></div>
    <div class="mts-cursor__ring"></div>
    <div class="mts-cursor__label"></div>
  `;
  document.body.appendChild(root);
  document.documentElement.classList.add('has-custom-cursor');

  const dot = root.querySelector('.mts-cursor__dot');
  const ring = root.querySelector('.mts-cursor__ring');
  const label = root.querySelector('.mts-cursor__label');

  const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const ringPos = { x: pos.x, y: pos.y };

  window.addEventListener('mousemove', (e) => {
    pos.x = e.clientX;
    pos.y = e.clientY;
    gsap.to(dot, { x: pos.x, y: pos.y, duration: 0.12, ease: 'power2.out' });
  });

  gsap.ticker.add(() => {
    ringPos.x += (pos.x - ringPos.x) * 0.14;
    ringPos.y += (pos.y - ringPos.y) * 0.14;
    ring.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px) translate(-50%, -50%)`;
    label.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px) translate(-50%, -50%)`;
  });

  // Hover states
  const hoverables = 'a, button, [data-cursor], [data-magnetic], .btn, input, textarea';
  document.querySelectorAll(hoverables).forEach((el) => {
    el.addEventListener('mouseenter', () => {
      root.classList.add('is-hover');
      const cType = el.dataset.cursor;
      if (cType) {
        root.classList.add(`is-${cType}`);
        const txt = el.dataset.cursorLabel || cType;
        label.textContent = txt;
      }
    });
    el.addEventListener('mouseleave', () => {
      root.classList.remove('is-hover');
      ['view', 'drag', 'link'].forEach((c) => root.classList.remove(`is-${c}`));
      label.textContent = '';
    });
  });

  // Magnetic
  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    const strength = parseFloat(el.dataset.magnetic || '0.4');
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * strength;
      const dy = (e.clientY - cy) * strength;
      gsap.to(el, { x: dx, y: dy, duration: 0.5, ease: 'power3.out' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
    });
  });

  // Click pulse
  window.addEventListener('mousedown', () => root.classList.add('is-down'));
  window.addEventListener('mouseup', () => root.classList.remove('is-down'));
}
