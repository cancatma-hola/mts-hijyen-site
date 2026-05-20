// HTML'i değiştirmeden çalışma anında data-magnetic ve data-reveal eklenir.
// Böylece mevcut sayfalar tek seferde "awwwards-tier" davranışa kavuşur.

export function autoDecorate() {
  // Magnetic: tüm primary butonlar
  document.querySelectorAll('.btn, .btn-primary, .btn-outline-white, .btn-white').forEach((el) => {
    if (!el.hasAttribute('data-magnetic')) {
      el.setAttribute('data-magnetic', '0.35');
    }
    if (!el.hasAttribute('data-cursor')) {
      el.setAttribute('data-cursor', 'link');
      el.setAttribute('data-cursor-label', '');
    }
  });

  // Reveal: tüm h2 başlıklar split, p ve section içerikleri fade-up
  document.querySelectorAll('section h2, .section h2').forEach((el) => {
    if (!el.hasAttribute('data-reveal')) {
      el.setAttribute('data-reveal', 'words');
      el.setAttribute('data-reveal-stagger', '0.05');
    }
  });

  document.querySelectorAll('section p, .section p, section .lead, section .subtitle').forEach((el) => {
    if (!el.hasAttribute('data-reveal') && el.textContent.trim().length > 0) {
      el.setAttribute('data-reveal', 'fade-up');
      el.setAttribute('data-reveal-delay', '0.15');
    }
  });

  // Kart grid'leri: stagger
  document.querySelectorAll('.cards, .grid, .sector-grid, .benefits-grid, .product-groups').forEach((el) => {
    if (!el.hasAttribute('data-reveal')) {
      el.setAttribute('data-reveal', 'stagger');
      el.setAttribute('data-reveal-stagger', '0.1');
    }
  });
}
