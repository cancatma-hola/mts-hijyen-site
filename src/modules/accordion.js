// Mobil (≤768px) akordeon davranışı — birden çok bölümde (sektörler, toptan alım
// avantajları, kataloglar) ortak. Masaüstünde bölümler grid olarak kalır; bu modül
// orada hiçbir şey yapmaz. Başlığa dokununca o öğenin gövdesi açılır, aynı gruptaki
// diğerleri kapanır (tek-açık). Her grubun ilk öğesi HTML'de `is-open` ile açık başlar.

const CONFIGS = [
  { grid: '.sectors-tilt-grid', item: '.tilt-card',    head: '.tilt-head' },
  { grid: '.b2b-grid',          item: '.b2b-card',      head: '.b2b-head' },
  { grid: '.catalogs-grid',     item: '.catalog-card',  head: '.catalog-head' },
];

export function initAccordions() {
  const mq = window.matchMedia('(max-width: 768px)');
  const bound = new WeakMap();

  const groups = CONFIGS.map((cfg) => {
    const grid = document.querySelector(cfg.grid);
    if (!grid) return null;
    const items = Array.from(grid.querySelectorAll(cfg.item));
    if (!items.length) return null;
    return { items, headSel: cfg.head };
  }).filter(Boolean);

  if (!groups.length) return;

  const headOf = (item, sel) => item.querySelector(sel);

  function setOpen(item, sel, open) {
    item.classList.toggle('is-open', open);
    const head = headOf(item, sel);
    if (head) head.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function toggle(group, item) {
    if (item.classList.contains('is-open')) {
      setOpen(item, group.headSel, false);          // açık olana dokunmak kapatır
    } else {
      group.items.forEach((it) => setOpen(it, group.headSel, it === item)); // tek-açık
    }
  }

  function enable() {
    groups.forEach((group) => {
      group.items.forEach((item) => {
        const head = headOf(item, group.headSel);
        if (!head || bound.has(head)) return;
        head.setAttribute('role', 'button');
        head.setAttribute('tabindex', '0');
        head.setAttribute('aria-expanded', item.classList.contains('is-open') ? 'true' : 'false');
        const onClick = () => toggle(group, item);
        const onKey = (e) => {
          if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
            e.preventDefault();
            toggle(group, item);
          }
        };
        head.addEventListener('click', onClick);
        head.addEventListener('keydown', onKey);
        bound.set(head, { onClick, onKey });
      });
    });
  }

  function disable() {
    groups.forEach((group) => {
      group.items.forEach((item) => {
        const head = headOf(item, group.headSel);
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
    });
  }

  const apply = () => (mq.matches ? enable() : disable());
  apply();
  if (mq.addEventListener) mq.addEventListener('change', apply);
  else if (mq.addListener) mq.addListener(apply);
}
