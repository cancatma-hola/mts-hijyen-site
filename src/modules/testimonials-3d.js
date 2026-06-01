import { gsap } from 'gsap';

// Mevcut .testimonials-track (CSS marquee) → 3D perspective + drag carousel.
// Kart pozisyonuna göre scale/opacity, ortadaki kart vurgulanır.

export function initTestimonials3D() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  // Mobilde mevcut CSS marquee kalsın — 3D perspective dokunmatikte sorun çıkarıyor
  if (window.matchMedia('(max-width: 900px)').matches) return;

  const wrapper = document.querySelector('.testimonials-track-wrapper');
  const track = wrapper?.querySelector('.testimonials-track');
  if (!wrapper || !track) return;

  const cards = Array.from(track.querySelectorAll('.testimonial-card'));
  if (cards.length < 3) return;

  wrapper.classList.add('testimonials-3d');
  // Mevcut CSS marquee animasyonunu durdur
  track.style.animation = 'none';
  track.style.willChange = 'transform';

  let offset = 0;
  // Layout ölçüleri — sadece resize/refresh anında oku, frame içinde değil
  let cw = 0;          // tek kart genişliği + gap
  let total = 0;       // wrap mesafesi
  let trackLeft = 0;   // track'in viewport-relative sol kenarı (yatay)
  let viewportCenter = 0;
  function measure() {
    cw = cards[0].getBoundingClientRect().width + 24;
    total = cw * (cards.length / 2);
    const tr = track.getBoundingClientRect();
    trackLeft = tr.left + offset; // offset'i geri ekle: translate-bağımsız sol kenar
    viewportCenter = window.innerWidth / 2;
  }
  measure();

  function update() {
    track.style.transform = `translate3d(${-offset}px, 0, 0)`;
    // Card center'ları offset math ile — getBoundingClientRect yok, forced layout yok
    for (let i = 0; i < cards.length; i++) {
      const c = cards[i];
      const cx = trackLeft + i * cw + cw / 2 - offset;
      const dist = (cx - viewportCenter) / window.innerWidth;
      const absD = Math.abs(dist);
      const scale = 1 - Math.min(absD * 0.35, 0.3);
      const ry = -dist * 22;
      const z = -absD * 220;
      const op = 1 - Math.min(absD * 0.9, 0.65);
      c.style.transform = `perspective(1100px) translateZ(${z}px) rotateY(${ry}deg) scale(${scale})`;
      c.style.opacity = String(op);
      c.style.zIndex = String(Math.round(100 - absD * 50));
    }
  }
  update();

  // Otomatik akış — sadece görünürken
  let auto = true;
  let visible = true;
  const io = new IntersectionObserver(
    (entries) => { visible = entries[0].isIntersecting; },
    { threshold: 0 }
  );
  io.observe(wrapper);

  const tick = (dt) => {
    if (auto) offset += dt * 0.04;
    if (offset > total) offset -= total;
    if (offset < 0) offset += total;
    update();
  };
  let last = 0;
  function loop(t) {
    const dt = t - last;
    last = t;
    if (visible && !document.hidden && dt < 100) tick(dt);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  // Drag interaction
  let dragging = false;
  let startX = 0;
  let startOffset = 0;
  wrapper.addEventListener('mousedown', (e) => {
    dragging = true;
    auto = false;
    startX = e.clientX;
    startOffset = offset;
    document.body.classList.add('is-dragging');
  });
  window.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    offset = startOffset - (e.clientX - startX);
    update();
  });
  window.addEventListener('mouseup', () => {
    if (!dragging) return;
    dragging = false;
    document.body.classList.remove('is-dragging');
    setTimeout(() => { auto = true; }, 1200);
  });

  wrapper.addEventListener('mouseenter', () => { auto = false; });
  wrapper.addEventListener('mouseleave', () => { auto = true; });

  window.addEventListener('resize', () => { measure(); update(); });
  // Scroll listener kaldırıldı — loop zaten her frame update ediyor, scroll'da ek
  // forced-layout maliyeti gereksizdi. Yatay merkez hesabı vertical scroll'dan etkilenmiyor.
}
