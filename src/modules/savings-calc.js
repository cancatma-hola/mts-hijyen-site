// Tasarruf Hesaplayıcı — perakende vs MTS toptan karşılaştırması
const AR_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
function fmt(n) {
  const s = Math.round(n).toLocaleString('tr-TR');
  if (document.documentElement.lang === 'ar') {
    return s.replace(/\d/g, d => AR_DIGITS[+d]);
  }
  return s;
}

export function initSavingsCalc() {
  const root = document.querySelector('.savings-calc-section');
  if (!root) return;

  const products = Array.from(root.querySelectorAll('.sc-product'));
  const retailEl = root.querySelector('[data-counter="retail"]');
  const mtsEl = root.querySelector('[data-counter="mts"]');
  const saveMonthEl = root.querySelector('[data-counter="save-month"]');
  const saveYearEl = root.querySelector('[data-counter="save-year"]');
  const retailBar = root.querySelector('.sc-bar--retail .sc-bar-fill');
  const mtsBar = root.querySelector('.sc-bar--mts .sc-bar-fill');

  function compute() {
    let totalRetail = 0;
    let totalMts = 0;
    products.forEach(p => {
      const qty = parseFloat(p.querySelector('.sc-slider').value) || 0;
      const retail = parseFloat(p.dataset.retail) || 0;
      const wholesale = parseFloat(p.dataset.wholesale) || 0;
      totalRetail += qty * retail;
      totalMts += qty * wholesale;
      const valEl = p.querySelector('.sc-value');
      if (valEl) valEl.textContent = fmt(qty);
    });
    const save = Math.max(0, totalRetail - totalMts);
    retailEl.textContent = fmt(totalRetail);
    mtsEl.textContent = fmt(totalMts);
    saveMonthEl.textContent = fmt(save);
    saveYearEl.textContent = fmt(save * 12);

    // Bar yükseklikleri — perakende %100, MTS oranlı
    retailBar.style.height = '100%';
    mtsBar.style.height = totalRetail > 0 ? `${(totalMts / totalRetail) * 100}%` : '0%';
  }

  products.forEach(p => {
    const slider = p.querySelector('.sc-slider');
    slider.addEventListener('input', compute);
  });

  // Dil değişiminde sayıları yeniden formatla
  window.addEventListener('mts:lang-changed', compute);

  compute();
}
