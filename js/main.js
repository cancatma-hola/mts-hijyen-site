/* ============================================================
   MTS HİJYEN — Ana JavaScript v3.0 (TR/EN/DE/AR)
   ============================================================ */
'use strict';

/* ---- Header scroll ---- */
(function () {
  const header = document.querySelector('.site-header');
  if (!header) return;
  function update() { header.classList.toggle('scrolled', window.scrollY > 30); }
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ---- Mobil Menü ---- */
(function () {
  const btn = document.querySelector('.hamburger');
  const nav = document.querySelector('.mobile-nav');
  if (!btn || !nav) return;
  let open = false;

  function set(state) {
    open = state;
    btn.classList.toggle('active', open);
    nav.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    const s = btn.querySelectorAll('span');
    s[0].style.transform = open ? 'translateY(7px) rotate(45deg)' : '';
    s[1].style.opacity  = open ? '0' : '';
    s[2].style.transform = open ? 'translateY(-7px) rotate(-45deg)' : '';
  }

  btn.addEventListener('click', () => set(!open));
  nav.querySelectorAll('.mobile-nav-link').forEach(l => l.addEventListener('click', () => set(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && open) set(false); });
})();

/* ============================================================
   ÇOK DİLLİ SİSTEM — TR / EN / DE / AR
   ============================================================ */
(function () {
  const KEY = 'mts-lang';

  function applyLang(lang) {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    /* innerHTML */
    document.querySelectorAll('[data-tr]').forEach(el => {
      const txt = el.dataset[lang] || el.dataset.tr;
      if (txt !== undefined) el.innerHTML = txt;
    });

    /* Placeholder */
    document.querySelectorAll('[data-tr-ph]').forEach(el => {
      const key = lang === 'tr' ? 'trPh' : lang === 'en' ? 'enPh' : lang === 'de' ? 'dePh' : 'arPh';
      el.placeholder = el.dataset[key] || el.dataset.trPh || '';
    });

    /* Select options */
    document.querySelectorAll('[data-tr-opt]').forEach(el => {
      const key = lang === 'tr' ? 'trOpt' : lang === 'en' ? 'enOpt' : lang === 'de' ? 'deOpt' : 'arOpt';
      el.textContent = el.dataset[key] || el.dataset.trOpt || '';
    });

    /* Aktif buton */
    document.querySelectorAll('.lang-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.lang === lang);
    });
  }

  function set(lang) {
    localStorage.setItem(KEY, lang);
    applyLang(lang);
  }

  const saved = localStorage.getItem(KEY) || 'tr';
  applyLang(saved);

  document.querySelectorAll('.lang-btn').forEach(b => {
    b.addEventListener('click', () => set(b.dataset.lang));
  });

  window.MTS = window.MTS || {};
  window.MTS.setLang = set;
})();

/* ---- Scroll Animasyonları ---- */
(function () {
  const els = document.querySelectorAll('.fade-up');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const d = parseInt(entry.target.dataset.delay || 0);
      setTimeout(() => entry.target.classList.add('visible'), d);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.1 });
  els.forEach(el => io.observe(el));
})();

/* ---- Sayaç Animasyonu ---- */
(function () {
  const els = document.querySelectorAll('.counter');
  if (!els.length) return;
  function anim(el) {
    const target = parseInt(el.dataset.target || el.textContent, 10);
    const dur = 1800;
    const step = Math.ceil(target / (dur / 16));
    let cur = 0;
    const t = setInterval(() => {
      cur = Math.min(cur + step, target);
      el.textContent = cur;
      if (cur >= target) clearInterval(t);
    }, 16);
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      anim(e.target);
      io.unobserve(e.target);
    });
  }, { threshold: 0.5 });
  els.forEach(el => io.observe(el));
})();

/* ---- Ürün Filtresi ---- */
(function () {
  const btns  = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.product-item');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      items.forEach(item => {
        const show = cat === 'all' || item.dataset.cat === cat;
        if (show) {
          item.style.display = '';
          requestAnimationFrame(() => { item.style.opacity = '1'; });
        } else {
          item.style.opacity = '0';
          setTimeout(() => { item.style.display = 'none'; }, 250);
        }
      });
    });
  });
})();

/* ---- İletişim Formu ---- */
(function () {
  const form = document.querySelector('#contactForm');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn  = form.querySelector('.form-submit');
    const lang = localStorage.getItem('mts-lang') || 'tr';
    const ok   = { tr: '✓ Mesajınız iletildi!',    en: '✓ Message sent!',          de: '✓ Nachricht gesendet!',  ar: '✓ تم إرسال الرسالة!' };
    const err  = { tr: '✗ Gönderim başarısız.',     en: '✗ Sending failed.',         de: '✗ Versand fehlgeschlagen.',ar: '✗ فشل الإرسال.' };
    const wait = { tr: 'Gönderiliyor…',             en: 'Sending…',                  de: 'Senden…',               ar: 'جارٍ الإرسال…' };

    const orig    = btn.textContent;
    btn.textContent = wait[lang] || wait.tr;
    btn.disabled  = true;

    try {
      const res  = await fetch('gonderici.php', { method: 'POST', body: new FormData(form) });
      const data = await res.json();

      if (data.ok) {
        btn.textContent    = ok[lang] || ok.tr;
        btn.style.background = '#10B981';
        form.reset();
        setTimeout(() => { btn.textContent = orig; btn.style.background = ''; btn.disabled = false; }, 4000);
      } else {
        throw new Error(data.msg);
      }
    } catch {
      btn.textContent    = err[lang] || err.tr;
      btn.style.background = '#EF4444';
      setTimeout(() => { btn.textContent = orig; btn.style.background = ''; btn.disabled = false; }, 4000);
    }
  });
})();

/* ---- 3D Tilt Kartlar — Cursor tracking ---- */
(function () {
  const cards = document.querySelectorAll('.tilt-card');
  if (!cards.length) return;

  const STRENGTH = 10; // derece

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const r   = card.getBoundingClientRect();
      const x   = (e.clientX - r.left) / r.width;
      const y   = (e.clientY - r.top)  / r.height;
      const rx  = (y - 0.5) * -STRENGTH;
      const ry  = (x - 0.5) *  STRENGTH;
      card.style.setProperty('--rx', rx + 'deg');
      card.style.setProperty('--ry', ry + 'deg');
      card.style.setProperty('--gx', (x * 100) + '%');
      card.style.setProperty('--gy', (y * 100) + '%');
    });

    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });
})();

/* ---- MFG Section — Cursor spotlight ---- */
(function () {
  const mfg = document.querySelector('.mfg-section');
  if (!mfg) return;
  mfg.addEventListener('mousemove', e => {
    const r = mfg.getBoundingClientRect();
    mfg.style.setProperty('--cx', (e.clientX - r.left) + 'px');
    mfg.style.setProperty('--cy', (e.clientY - r.top)  + 'px');
  });
})();

/* ---- Compare list — staggered reveal ---- */
(function () {
  const items = document.querySelectorAll('.compare-list li');
  if (!items.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('compare-item-in');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.2 });
  items.forEach((li, i) => {
    li.style.transitionDelay = (i % 6 * 70) + 'ms';
    io.observe(li);
  });
})();

/* ---- Aktif Nav ---- */
(function () {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(l => {
    if ((l.getAttribute('href') || '') === page || (page === '' && l.getAttribute('href') === 'index.html')) {
      l.classList.add('active');
    }
  });
})();

/* ---- Scroll Showcase — ContainerScroll 3D Parallax ---- */
(function () {
  const stage = document.getElementById('showcaseStage');
  const card  = document.getElementById('showcaseCard');
  if (!stage || !card) return;

  function update() {
    const rect    = stage.getBoundingClientRect();
    const viewH   = window.innerHeight;
    // progress: 0 when bottom of stage hits viewport bottom, 1 when top hits viewport center
    const raw     = (viewH - rect.top) / (viewH + rect.height * 0.5);
    const progress = Math.max(0, Math.min(1, raw));

    const rotateX  = 22 * (1 - progress);
    const scale    = 0.78 + 0.22 * progress;
    const opacity  = 0.3 + 0.7 * Math.min(1, progress * 2);

    card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) scale(${scale})`;
    card.style.opacity   = opacity;
  }

  // Initial state
  card.style.transition = 'transform 0.05s linear, opacity 0.1s linear';
  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
})();

/* ---- Showcase bar animations — animate on entry ---- */
(function () {
  const bars = document.querySelectorAll('.spg-bar-fill');
  if (!bars.length) return;
  const widths = Array.from(bars).map(b => b.style.width);
  bars.forEach(b => { b.style.width = '0%'; });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      bars.forEach((b, i) => {
        setTimeout(() => { b.style.transition = 'width 1.4s cubic-bezier(0.4,0,0.2,1)'; b.style.width = widths[i]; }, i * 120);
      });
      io.disconnect();
    });
  }, { threshold: 0.3 });

  const showcase = document.querySelector('.showcase-card');
  if (showcase) io.observe(showcase);
})();

/* ---- Smooth scroll for hero indicator ---- */
(function () {
  const indicator = document.querySelector('.hero-scroll-indicator');
  if (!indicator) return;
  indicator.addEventListener('click', () => {
    const target = document.querySelector('.scroll-showcase-section') || document.querySelector('.b2b-ticker');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
})();

/* ============================================================
   v4.1 — HAVALISI MAX
   ============================================================ */

/* ---- Custom Cursor ---- */
(function () {
  if (!matchMedia('(pointer: fine)').matches) return;

  const dot  = document.createElement('div');
  const ring = document.createElement('div');
  dot.className  = 'cursor-dot';
  ring.className = 'cursor-ring';
  document.body.append(dot, ring);

  let mx = -200, my = -200;
  let rx = -200, ry = -200;

  /* Dot: instant */
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  }, { passive: true });

  /* Ring: lerp */
  function lerp(a, b, t) { return a + (b - a) * t; }
  (function animRing() {
    rx = lerp(rx, mx, 0.13);
    ry = lerp(ry, my, 0.13);
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  /* Hover detection */
  const HOVER_SEL = 'a, button, [role="button"], label, .product-card, .tilt-card, .why-card, .b2b-card, .partner-item, .catalog-card, .lang-btn, .filter-btn, .testimonial-card, .contact-card';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(HOVER_SEL)) {
      dot.classList.add('cursor-hover');
      ring.classList.add('cursor-hover');
    }
  }, { passive: true });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(HOVER_SEL)) {
      dot.classList.remove('cursor-hover');
      ring.classList.remove('cursor-hover');
    }
  }, { passive: true });

  /* Dark section detection */
  const DARK_SEL = '.why-section, .mfg-section, .compare-section, .numbers-section, .cta-section, .site-footer, .mobile-nav, .b2b-ticker';
  document.addEventListener('mousemove', e => {
    const el = document.elementFromPoint(e.clientX, e.clientY);
    if (el && el.closest(DARK_SEL)) {
      dot.classList.add('cursor-dark');
      ring.classList.add('cursor-dark');
    } else {
      dot.classList.remove('cursor-dark');
      ring.classList.remove('cursor-dark');
    }
  }, { passive: true });

  /* Click pulse */
  document.addEventListener('mousedown', () => {
    dot.classList.add('cursor-click');
    ring.classList.add('cursor-click');
  });
  document.addEventListener('mouseup', () => {
    dot.classList.remove('cursor-click');
    ring.classList.remove('cursor-click');
  });

  /* Hide/show on window edge */
  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
})();

/* ---- Scroll Progress Bar ---- */
(function () {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.prepend(bar);
  function update() {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (total > 0 ? (window.scrollY / total) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ---- Hero Particles (pure JS, no extra HTML) ---- */
(function () {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const container = document.createElement('div');
  container.className = 'hero-particles';
  hero.insertBefore(container, hero.firstChild);

  const COUNT = 22;
  for (let i = 0; i < COUNT; i++) {
    const p    = document.createElement('span');
    p.className = 'hero-particle';
    const size  = (Math.random() * 3 + 2).toFixed(1);
    const dur   = (Math.random() * 9 + 5).toFixed(1);
    const dx    = ((Math.random() - 0.5) * 70).toFixed(1);
    const dy    = ((Math.random() - 0.5) * 55).toFixed(1);
    const op    = (Math.random() * 0.32 + 0.07).toFixed(2);
    const delay = '-' + (Math.random() * 8).toFixed(1);
    p.style.cssText = `left:${(Math.random()*90+5).toFixed(1)}%;top:${(Math.random()*75+10).toFixed(1)}%;width:${size}px;height:${size}px;--dur:${dur}s;--delay:${delay}s;--dx:${dx}px;--dy:${dy}px;--op:${op};`;
    container.appendChild(p);
  }
})();

/* ---- Numbers Section — Staggered Reveal ---- */
(function () {
  const items = document.querySelectorAll('.numbers-item');
  if (!items.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach((entry, idx) => {
      if (!entry.isIntersecting) return;
      setTimeout(() => entry.target.classList.add('visible'), idx * 130);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.2 });
  items.forEach(item => io.observe(item));
})();

/* ---- Sticky CTA — shows after scrolling past hero ---- */
(function () {
  const hero = document.querySelector('.hero');
  const cta  = document.getElementById('stickyCta');
  if (!hero || !cta) return;
  const io = new IntersectionObserver(entries => {
    const visible = !entries[0].isIntersecting;
    cta.classList.toggle('visible', visible);
    cta.setAttribute('aria-hidden', String(!visible));
    const btn = cta.querySelector('a');
    if (btn) btn.tabIndex = visible ? 0 : -1;
  }, { threshold: 0.15 });
  io.observe(hero);
})();

/* ---- Why Section — Cursor Spotlight ---- */
(function () {
  const why = document.querySelector('.why-section');
  if (!why) return;
  const spotlight = document.createElement('div');
  spotlight.className = 'why-spotlight';
  why.insertBefore(spotlight, why.firstChild);
  why.addEventListener('mousemove', e => {
    const r = why.getBoundingClientRect();
    why.style.setProperty('--wx', (e.clientX - r.left) + 'px');
    why.style.setProperty('--wy', (e.clientY - r.top) + 'px');
  }, { passive: true });
})();

/* ---- Extend 3D Tilt to Product Cards ---- */
(function () {
  const cards = document.querySelectorAll('.product-card');
  if (!cards.length) return;
  const S = 7;
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const rx = ((e.clientY - r.top)  / r.height - 0.5) * -S;
      const ry = ((e.clientX - r.left) / r.width  - 0.5) *  S;
      card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-7px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
})();

/* ---- Sector Tilt Cards — inject hover overlay ---- */
(function () {
  document.querySelectorAll('.tilt-card').forEach(card => {
    if (!card.querySelector('.tilt-card-overlay')) {
      const overlay = document.createElement('div');
      overlay.className = 'tilt-card-overlay';
      card.appendChild(overlay);
    }
  });
})();

/* ---- Magnetic Buttons — subtle drift toward cursor ---- */
(function () {
  if (!matchMedia('(pointer: fine)').matches) return;
  const btns = document.querySelectorAll('.btn-primary, .btn-white, .sticky-cta-btn');
  btns.forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width  / 2)) * 0.22;
      const dy = (e.clientY - (r.top  + r.height / 2)) * 0.22;
      btn.style.transform = `translate(${dx}px, ${dy}px) translateY(-2px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
})();
