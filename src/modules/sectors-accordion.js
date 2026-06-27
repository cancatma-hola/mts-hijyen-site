// Sektörler bölümü — mobilde (≤768px) AKORDEON davranışı.
// Masaüstünde bölüm 3D tilt grid olarak kalır; bu modül orada hiçbir şey yapmaz.
// Başlığa (.tilt-head) dokununca o sektörün gövdesi açılır, diğerleri kapanır (tek-açık).
// İlk kart HTML'de `is-open` ile açık başlar.

export function initSectorsAccordion() {
  const grid = document.querySelector('.sectors-tilt-grid');
  if (!grid) return;
  const cards = Array.from(grid.querySelectorAll('.tilt-card'));
  if (!cards.length) return;

  const mq = window.matchMedia('(max-width: 768px)');
  const bound = new WeakMap();

  const headOf = (card) => card.querySelector('.tilt-head');

  function setOpen(card, open) {
    card.classList.toggle('is-open', open);
    const head = headOf(card);
    if (head) head.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function toggle(card) {
    if (card.classList.contains('is-open')) {
      setOpen(card, false); // açık olana dokunmak kapatır
    } else {
      cards.forEach((c) => setOpen(c, c === card)); // tek-açık: diğerlerini kapat
    }
  }

  function enable() {
    cards.forEach((card) => {
      const head = headOf(card);
      if (!head || bound.has(head)) return;
      head.setAttribute('role', 'button');
      head.setAttribute('tabindex', '0');
      head.setAttribute('aria-expanded', card.classList.contains('is-open') ? 'true' : 'false');
      const onClick = () => toggle(card);
      const onKey = (e) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
          e.preventDefault();
          toggle(card);
        }
      };
      head.addEventListener('click', onClick);
      head.addEventListener('keydown', onKey);
      bound.set(head, { onClick, onKey });
    });
  }

  function disable() {
    cards.forEach((card) => {
      const head = headOf(card);
      if (!head) return;
      const h = bound.get(head);
      if (h) {
        head.removeEventListener('click', h.onClick);
        head.removeEventListener('keydown', h.onKey);
        bound.delete(head);
      }
      head.removeAttribute('role');
      head.removeAttribute('tabindex');
      head.removeAttribute('aria-expanded');
    });
  }

  const apply = () => (mq.matches ? enable() : disable());
  apply();
  // Yön değişimi / yeniden boyutlandırmada mobil↔masaüstü geçişini yakala
  if (mq.addEventListener) mq.addEventListener('change', apply);
  else if (mq.addListener) mq.addListener(apply); // eski Safari
}
