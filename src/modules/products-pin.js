import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// .products-section'ı pin'leyip içindeki .products-grid'i yatay kaydırır.
// 3 kart yan yana viewport'tan geniş bir şerit olur, dikey scroll yatay harekete dönüşür.

export function initProductsPin() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(max-width: 900px)').matches) return;

  const section = document.querySelector('.products-section');
  if (!section) return;
  const grid = section.querySelector('.products-grid');
  if (!grid) return;
  const cards = grid.querySelectorAll('.product-card');
  if (cards.length < 2) return;

  section.classList.add('products-section--pinned');

  // .fade-up sınıfı eski IntersectionObserver ile çatışmasın
  cards.forEach((c) => c.classList.remove('fade-up'));

  // Her kartı zenginleştir: index, stat, accent, big-letter, CTA
  const enrichments = [
    { idx: '01', accent: '#0ea5e9', stat: '450+', statLbl: 'çeşit ürün', letter: 'K', kw: 'PAPER · TISSUE · NAPKIN', bg: 'linear-gradient(135deg,#e0f2fe 0%,#dbeafe 100%)' },
    { idx: '02', accent: '#06b6d4', stat: '320+', statLbl: 'kimyasal formül', letter: 'C', kw: 'CHEM · DISINFECT · CLEAN', bg: 'linear-gradient(135deg,#cffafe 0%,#e0f2fe 100%)' },
    { idx: '03', accent: '#10b981', stat: '430+', statLbl: 'sarf kalemi', letter: 'S', kw: 'CONSUM · GLOVES · BAGS', bg: 'linear-gradient(135deg,#d1fae5 0%,#ecfdf5 100%)' },
  ];
  cards.forEach((card, i) => {
    const e = enrichments[i] || enrichments[0];
    card.style.setProperty('--card-accent', e.accent);
    card.style.background = e.bg;

    // Üst bar: index + keyword sticker
    const topBar = document.createElement('div');
    topBar.className = 'pc-top';
    topBar.innerHTML = `
      <span class="pc-index">${e.idx} <span>/ 03</span></span>
      <span class="pc-kw">${e.kw}</span>
    `;
    card.insertBefore(topBar, card.firstChild);

    // Devasa letter — arka planda dekoratif
    const bigLetter = document.createElement('span');
    bigLetter.className = 'pc-big-letter';
    bigLetter.textContent = e.letter;
    bigLetter.setAttribute('aria-hidden', 'true');
    card.appendChild(bigLetter);

    // Alt stat barı
    const statBar = document.createElement('div');
    statBar.className = 'pc-stat-bar';
    statBar.innerHTML = `
      <div class="pc-stat">
        <span class="pc-stat-num">${e.stat}</span>
        <span class="pc-stat-lbl">${e.statLbl}</span>
      </div>
      <div class="pc-arrow" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"/>
          <polyline points="12 5 19 12 12 19"/>
        </svg>
      </div>
    `;
    card.appendChild(statBar);

    // Existing prod-link'i statBar'ın içine taşı (mevcut "Ürünleri Gör" linki)
    const existingLink = card.querySelector('.prod-link');
    if (existingLink) {
      existingLink.setAttribute('data-magnetic', '0.35');
      existingLink.classList.add('pc-cta');
    }
  });

  // Progress dots — kart pozisyonunu gösteren göstergeler
  const progress = document.createElement('div');
  progress.className = 'pc-progress';
  cards.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = 'pc-progress-dot' + (i === 0 ? ' is-active' : '');
    dot.dataset.idx = String(i);
    progress.appendChild(dot);
  });
  section.appendChild(progress);
  const dots = progress.querySelectorAll('.pc-progress-dot');

  // Yatay strip genişliği — kart sayısına göre
  const cardCount = cards.length;
  const stripWidth = cardCount * 78; // her kart ~78vw

  // Stil
  grid.style.display = 'flex';
  grid.style.flexWrap = 'nowrap';
  grid.style.gap = '4vw';
  grid.style.width = `${stripWidth}vw`;
  cards.forEach((c) => {
    c.style.flex = `0 0 70vw`;
    c.style.maxWidth = '70vw';
    c.style.minWidth = '0';
    c.style.height = '70vh';
  });

  // Wrap grid in viewport-clip
  const viewport = document.createElement('div');
  viewport.className = 'products-pin-viewport';
  viewport.style.cssText = `
    overflow: hidden;
    width: 100%;
    position: relative;
  `;
  grid.parentNode.insertBefore(viewport, grid);
  viewport.appendChild(grid);

  // Hareket mesafesi: strip genişliği - viewport genişliği
  const getDistance = () => Math.max(0, grid.scrollWidth - window.innerWidth);

  // Sticky header yüksekliği — pin başlangıcını header'ın altından başlat
  const headerH = (document.querySelector('.site-header')?.offsetHeight || 74);

  // Section'a pin sırasında stabil layout için min-height ver
  section.style.minHeight = '100vh';

  gsap.to(grid, {
    x: () => -getDistance(),
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: () => `top top+=${headerH}`,
      end: () => `+=${getDistance()}`,
      pin: true,
      pinSpacing: true,
      pinType: 'transform', // Lenis ile uyumlu — position:fixed yerine CSS transform, "tak" sıçramayı önler
      scrub: 1,
      invalidateOnRefresh: true,
      anticipatePin: 1,
      fastScrollEnd: true,
      onUpdate: (st) => {
        const active = Math.round(st.progress * (cards.length - 1));
        dots.forEach((d, i) => d.classList.toggle('is-active', i === active));
      },
    },
  });

  // Her kart için giriş animasyonu (yatay scroll ilerledikçe)
  cards.forEach((card, i) => {
    const inner = card.children;
    gsap.from(inner, {
      y: 50,
      opacity: 0,
      duration: 0.6,
      stagger: 0.06,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: card,
        containerAnimation: ScrollTrigger.getAll().find((st) => st.pin === section)?.animation,
        start: 'left 80%',
        toggleActions: 'play none none reverse',
      },
    });
  });

  // İlk refresh — DOM hazır
  ScrollTrigger.refresh();

  // İkinci refresh — fontlar + imajlar yüklendikten sonra ölçüler kesinleşsin
  // (yanlış scrollWidth ile başlayıp sonradan pin spacer yüksekliğinin değişmesini engeller)
  if (document.readyState === 'complete') {
    requestAnimationFrame(() => ScrollTrigger.refresh());
  } else {
    window.addEventListener('load', () => {
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, { once: true });
  }
}
