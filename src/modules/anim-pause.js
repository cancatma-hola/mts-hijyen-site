// Görünmeyen elementlerdeki sonsuz CSS animasyonlarını otomatik duraklatır.
// Paint-heavy keyframe'ler (box-shadow, large gradients) viewport dışındayken CPU/GPU yemesin.
// Element viewport'a girince anında resume eder — görsel hiçbir feature değişmez.

const SELECTORS = [
  // Hero dekoratif
  '.hero-orb',
  '.hero-orb-glow',
  '.hero-badge-float',
  // MTS premium card — box-shadow 5 layer paint
  '[style*="mtsCardGlow"], .mts-premium-card',
  // CTA & buton parıltıları
  '.cta-section',
  '.btn-shimmer, [class*="btn-primary"]',
  // Cinema bg + sweep
  '.cinema-bg, [class*="cinema"]',
  // WhatsApp float
  '.whatsapp-float',
  // Calc sonuç kartı glow + shimmer
  '.sc-result',
  '.savings-calc-section',
  // Tickers & marquee
  '.ticker, .testimonials-track-wrapper, [class*="smq-"]',
  // Why-section + connectors
  '.why-section',
  '[class*="connector"]',
];

export function initAnimPause() {
  if (!('IntersectionObserver' in window)) return;

  const candidates = new Set();
  SELECTORS.forEach((sel) => {
    try {
      document.querySelectorAll(sel).forEach((el) => candidates.add(el));
    } catch (_) { /* invalid selector — yoksay */ }
  });
  if (candidates.size === 0) return;

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        // Sadece animation-play-state'i değiştir; başka stil dokunulmuyor
        e.target.style.animationPlayState = e.isIntersecting ? 'running' : 'paused';
      }
    },
    { rootMargin: '120px 0px', threshold: 0 }
  );
  candidates.forEach((el) => io.observe(el));

  // Sekme arka plana atılınca tüm aday animasyonları durdur — geri dönünce devam
  document.addEventListener('visibilitychange', () => {
    const hidden = document.hidden;
    candidates.forEach((el) => {
      if (hidden) {
        el.dataset._wasRunning = el.style.animationPlayState || 'running';
        el.style.animationPlayState = 'paused';
      } else {
        el.style.animationPlayState = el.dataset._wasRunning || 'running';
        delete el.dataset._wasRunning;
      }
    });
  });
}
