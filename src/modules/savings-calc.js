// Tasarruf Hesaplayıcı — perakende vs MTS toptan karşılaştırması
// Animasyonlu counter, slider fill viz, preset profiller, per-ürün tasarruf yüzdesi
const AR_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
function fmt(n) {
  const s = Math.round(n).toLocaleString('tr-TR');
  if (document.documentElement.lang === 'ar') {
    return s.replace(/\d/g, d => AR_DIGITS[+d]);
  }
  return s;
}
function fmtPct(n) {
  const v = Math.round(n);
  if (document.documentElement.lang === 'ar') {
    return v.toString().replace(/\d/g, d => AR_DIGITS[+d]);
  }
  return String(v);
}

// Ürün ID → preset değerleri
const PRESETS = {
  small:  { tp: 60,  soap: 15, bag: 12, disinf: 12 },
  medium: { tp: 200, soap: 60, bag: 40, disinf: 50 },
  large:  { tp: 500, soap: 140, bag: 110, disinf: 130 },
};

export function initSavingsCalc() {
  const root = document.querySelector('.savings-calc-section');
  if (!root) return;

  const products = Array.from(root.querySelectorAll('.sc-product'));
  const retailEl = root.querySelector('[data-counter="retail"]');
  const mtsEl = root.querySelector('[data-counter="mts"]');
  const saveMonthEl = root.querySelector('[data-counter="save-month"]');
  const saveYearEl = root.querySelector('[data-counter="save-year"]');
  const savePctEl = root.querySelector('[data-counter="save-pct"]');
  const retailBar = root.querySelector('.sc-bar--retail .sc-bar-fill');
  const mtsBar = root.querySelector('.sc-bar--mts .sc-bar-fill');
  const presets = Array.from(root.querySelectorAll('.sc-preset'));

  // Counter tween state
  const tweens = new WeakMap();

  function tweenCounter(el, to, isPct = false) {
    if (!el) return;
    const prev = tweens.get(el);
    if (prev) cancelAnimationFrame(prev.raf);
    const from = parseFloat(el.dataset.cur || '0');
    const start = performance.now();
    const dur = 520;
    const ease = (t) => 1 - Math.pow(1 - t, 3);

    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const v = from + (to - from) * ease(t);
      el.dataset.cur = String(v);
      el.textContent = isPct ? fmtPct(v) : fmt(v);
      if (t < 1) {
        const raf = requestAnimationFrame(tick);
        tweens.set(el, { raf });
      } else {
        tweens.delete(el);
      }
    };
    tweens.set(el, { raf: requestAnimationFrame(tick) });
  }

  function updateSliderFill(slider) {
    const min = +slider.min || 0;
    const max = +slider.max || 100;
    const val = +slider.value || 0;
    const pct = ((val - min) / (max - min)) * 100;
    slider.style.setProperty('--sc-fill', pct + '%');
  }

  function compute(opts = { tween: true }) {
    let totalRetail = 0;
    let totalMts = 0;

    products.forEach(p => {
      const qty = parseFloat(p.querySelector('.sc-slider').value) || 0;
      const retail = parseFloat(p.dataset.retail) || 0;
      const wholesale = parseFloat(p.dataset.wholesale) || 0;
      const itemRetail = qty * retail;
      const itemMts = qty * wholesale;
      totalRetail += itemRetail;
      totalMts += itemMts;

      // Slider değeri (anlık, tween yok — kullanıcı sürüklerken senkron)
      const valEl = p.querySelector('.sc-value');
      if (valEl) valEl.textContent = fmt(qty);

      // Per-ürün tasarruf yüzdesi rozeti
      const pctEl = p.querySelector('.sc-product-save');
      if (pctEl) {
        const itemPct = retail > 0 ? ((retail - wholesale) / retail) * 100 : 0;
        pctEl.textContent = '−%' + fmtPct(itemPct);
      }

      // Slider fill viz
      const slider = p.querySelector('.sc-slider');
      updateSliderFill(slider);
    });

    const save = Math.max(0, totalRetail - totalMts);
    const savePct = totalRetail > 0 ? (save / totalRetail) * 100 : 0;

    if (opts.tween) {
      tweenCounter(retailEl, totalRetail);
      tweenCounter(mtsEl, totalMts);
      tweenCounter(saveMonthEl, save);
      tweenCounter(saveYearEl, save * 12);
      if (savePctEl) tweenCounter(savePctEl, savePct, true);
    } else {
      retailEl.textContent = fmt(totalRetail);
      mtsEl.textContent = fmt(totalMts);
      saveMonthEl.textContent = fmt(save);
      saveYearEl.textContent = fmt(save * 12);
      if (savePctEl) savePctEl.textContent = fmtPct(savePct);
      retailEl.dataset.cur = String(totalRetail);
      mtsEl.dataset.cur = String(totalMts);
      saveMonthEl.dataset.cur = String(save);
      saveYearEl.dataset.cur = String(save * 12);
      if (savePctEl) savePctEl.dataset.cur = String(savePct);
    }

    // Bar yükseklikleri
    retailBar.style.height = '100%';
    mtsBar.style.height = totalRetail > 0 ? `${(totalMts / totalRetail) * 100}%` : '0%';
  }

  // Slider olayları
  products.forEach(p => {
    const slider = p.querySelector('.sc-slider');
    slider.addEventListener('input', () => {
      compute({ tween: false });   // sürükleme sırasında snappy
      p.classList.add('is-active');
    });
    slider.addEventListener('change', () => {
      compute({ tween: true });    // bırakınca son değere yumuşak in
      setTimeout(() => p.classList.remove('is-active'), 350);
    });
    updateSliderFill(slider);
  });

  // Preset profilleri
  presets.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.preset;
      const profile = PRESETS[key];
      if (!profile) return;
      products.forEach(p => {
        const id = p.dataset.id;
        if (profile[id] !== undefined) {
          p.querySelector('.sc-slider').value = profile[id];
        }
      });
      presets.forEach(b => b.classList.toggle('is-active', b === btn));
      compute({ tween: true });
    });
  });

  // Dil değişiminde sayıları yeniden formatla (anlık snap)
  window.addEventListener('mts:lang-changed', () => compute({ tween: false }));

  // İlk render — IntersectionObserver ile section görünür olunca tween ile gir
  let firstShown = false;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !firstShown) {
        firstShown = true;
        compute({ tween: true });
        io.disconnect();
      }
    });
  }, { threshold: 0.2 });
  io.observe(root);

  // İlk anlık dolum (görünmeyene kadar 0 göstermesin)
  compute({ tween: false });
}
