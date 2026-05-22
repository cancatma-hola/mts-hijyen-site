// Tesise göre paket konfigüratörü — 4 adımlı wizard
const AR_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
function fmt(n) {
  const s = Math.round(n).toLocaleString('tr-TR');
  if (document.documentElement.lang === 'ar') return s.replace(/\d/g, d => AR_DIGITS[+d]);
  return s;
}

// Sektör → temel kişi başı aylık hijyen maliyet katsayısı (₺), ürün önerisi paketleri
const SECTOR_DATA = {
  otel:    { perStaff: 95,  perRoom: 180, pkg: 'Premium Konaklama',  desc: { tr: 'Misafir deneyimi odaklı yumuşak doku + premium amenities', en: 'Guest-experience first: soft tissue + premium amenities', de: 'Gast-fokussiert: weiches Gewebe + Premium-Amenities', ar: 'تجربة الضيف أولاً: مناديل ناعمة + مستلزمات فاخرة' }, items: ['Premium tuvalet kağıdı', 'El sabunu & krem dispenseri', 'Banyo amenities seti', 'Yüzey dezenfektan', 'Çöp poşeti'] },
  hastane: { perStaff: 140, perBed: 220, pkg: 'Klinik Hijyen Pro', desc: { tr: 'Tıbbi standartta dezenfeksiyon + tek kullanımlık ürün ağırlıklı', en: 'Medical-grade disinfection + disposable-heavy', de: 'Medizinische Desinfektion + Einwegfokus', ar: 'تطهير طبي + منتجات يمكن التخلص منها' }, items: ['ULV dezenfektan', 'Cerrahi maske & eldiven', 'Antibakteriyel sabun', 'Klinik silme bezi', 'Tıbbi atık poşeti', 'Tuvalet kağıdı'] },
  okul:    { perStaff: 35,  perRoom: 0,   pkg: 'Eğitim Tesisi', desc: { tr: 'Yüksek hacim + ekonomik formül + güvenli kimyasal', en: 'High volume + economical + child-safe chemicals', de: 'Großvolumen + ökonomisch + kinderfreundlich', ar: 'حجم كبير + اقتصادي + آمن للأطفال' }, items: ['Jumbo tuvalet kağıdı', 'Köpük el sabunu', 'Yüzey temizleyici', 'Çöp poşeti', 'Kağıt havlu'] },
  ofis:    { perStaff: 55,  perRoom: 0,   pkg: 'Modern Ofis', desc: { tr: 'Z-katlama havlu, otomatik dispenser, kahve molası ürünleri', en: 'Z-fold towels, auto dispensers, breakroom essentials', de: 'Z-Falt-Handtücher, Auto-Spender, Pausenraum-Produkte', ar: 'مناشف Z، موزعات أوتوماتيكية، أساسيات الاستراحة' }, items: ['Z-katlama havlu', 'El sabunu dispenseri', 'Yüzey dezenfektanı', 'Tuvalet kağıdı', 'Mutfak temizleyici'] },
  fabrika: { perStaff: 110, perRoom: 0,   pkg: 'Endüstriyel Pro', desc: { tr: 'Ağır kir & yağ formülleri + endüstriyel ekipman', en: 'Heavy-duty grease & oil formulas + industrial gear', de: 'Schwere Verschmutzung + Industrieausrüstung', ar: 'صيغ شحوم وزيوت ثقيلة + معدات صناعية' }, items: ['Endüstriyel degreaser', 'Sanayi tipi sabun', 'Mikrofiber bez (büyük)', 'Çöp poşeti (XL)', 'Koruyucu eldiven'] },
  avm:     { perStaff: 75,  perRoom: 0,   pkg: 'AVM & Perakende', desc: { tr: 'Yoğun trafik dezenfeksiyonu + cila/parlatıcı', en: 'High-traffic disinfection + polish/wax', de: 'Hochfrequenz-Desinfektion + Polierprodukte', ar: 'تطهير عالي الكثافة + مواد تلميع' }, items: ['Yüzey dezenfektanı', 'Cam temizleyici', 'Zemin cilası', 'Tuvalet kağıdı', 'Otomatik koku gidericisi'] },
};

const TRAFFIC_MULT = { low: 0.75, mid: 1, high: 1.4 };

const I18N = {
  tr: { sectorTitle: 'Tesis tipini seçin', scaleTitle: 'Ölçeğiniz nedir?', trafficTitle: 'Günlük ziyaretçi trafiği', back: '← Geri', next: 'İleri →', finish: 'Sonucu Gör →', restart: 'Baştan başla', m2: 'Yaklaşık alan (m²)', staff: 'Personel sayısı', rooms: 'Oda / yatak sayısı', resultLabel: 'Önerilen Paket', priceLabel: 'Tahmini Aylık Maliyet', priceFoot: '+KDV · Net teklif için saha analizi gerekli', cta: 'Saha Analizi Talep Et →', tLow: 'Düşük', tMid: 'Orta', tHigh: 'Yüksek', tLowDesc: '< 100 kişi/gün', tMidDesc: '100–500 kişi/gün', tHighDesc: '500+ kişi/gün' },
  en: { sectorTitle: 'Select facility type', scaleTitle: 'What is your scale?', trafficTitle: 'Daily visitor traffic', back: '← Back', next: 'Next →', finish: 'See Result →', restart: 'Start over', m2: 'Approximate area (m²)', staff: 'Number of staff', rooms: 'Rooms / beds', resultLabel: 'Recommended Package', priceLabel: 'Estimated Monthly Cost', priceFoot: '+VAT · Net quote requires site analysis', cta: 'Request Site Analysis →', tLow: 'Low', tMid: 'Medium', tHigh: 'High', tLowDesc: '< 100 people/day', tMidDesc: '100–500 people/day', tHighDesc: '500+ people/day' },
  de: { sectorTitle: 'Einrichtungstyp wählen', scaleTitle: 'Wie groß ist Ihr Betrieb?', trafficTitle: 'Tägliche Besucherzahl', back: '← Zurück', next: 'Weiter →', finish: 'Ergebnis →', restart: 'Neu starten', m2: 'Fläche (m²)', staff: 'Mitarbeiteranzahl', rooms: 'Zimmer / Betten', resultLabel: 'Empfohlenes Paket', priceLabel: 'Geschätzte monatliche Kosten', priceFoot: '+MwSt · Netto-Angebot nach Standortanalyse', cta: 'Standortanalyse anfordern →', tLow: 'Niedrig', tMid: 'Mittel', tHigh: 'Hoch', tLowDesc: '< 100 Pers./Tag', tMidDesc: '100–500 Pers./Tag', tHighDesc: '500+ Pers./Tag' },
  ar: { sectorTitle: 'اختر نوع المنشأة', scaleTitle: 'ما حجم منشأتك؟', trafficTitle: 'حركة الزوار اليومية', back: '← رجوع', next: 'التالي →', finish: 'عرض النتيجة →', restart: 'البدء من جديد', m2: 'المساحة التقريبية (م²)', staff: 'عدد الموظفين', rooms: 'الغرف / الأسرّة', resultLabel: 'الباقة الموصى بها', priceLabel: 'التكلفة الشهرية التقديرية', priceFoot: '+ضريبة · العرض النهائي يتطلب تحليل الموقع', cta: 'اطلب تحليل الموقع →', tLow: 'منخفض', tMid: 'متوسط', tHigh: 'مرتفع', tLowDesc: '< 100 شخص/يوم', tMidDesc: '100–500 شخص/يوم', tHighDesc: '500+ شخص/يوم' },
};

export function initConfigurator() {
  const root = document.querySelector('.cfg-section');
  if (!root) return;

  const wizard = root.querySelector('.cfg-wizard');
  const stepsBar = root.querySelectorAll('.cfg-step');
  const panes = root.querySelectorAll('.cfg-step-pane');
  const prevBtn = root.querySelector('.cfg-prev');
  const nextBtn = root.querySelector('.cfg-next');
  const restartBtn = root.querySelector('.cfg-restart');

  const state = { step: 1, sector: null, m2: 1000, staff: 50, rooms: 0, traffic: 'mid' };
  const TOTAL_STEPS = 4;

  function lang() { return document.documentElement.lang || 'tr'; }
  function t() { return I18N[lang()] || I18N.tr; }

  function refreshLabels() {
    const L = t();
    root.querySelector('[data-cfg-i="sectorTitle"]').textContent = L.sectorTitle;
    root.querySelector('[data-cfg-i="scaleTitle"]').textContent = L.scaleTitle;
    root.querySelector('[data-cfg-i="trafficTitle"]').textContent = L.trafficTitle;
    root.querySelector('[data-cfg-i="m2"]').textContent = L.m2;
    root.querySelector('[data-cfg-i="staff"]').textContent = L.staff;
    const roomsLbl = root.querySelector('[data-cfg-i="rooms"]');
    if (roomsLbl) roomsLbl.textContent = L.rooms;
    prevBtn.textContent = L.back;
    nextBtn.textContent = state.step === TOTAL_STEPS - 1 ? L.finish : L.next;
    restartBtn.textContent = L.restart;
    root.querySelector('[data-cfg-i="resultLabel"]').textContent = L.resultLabel;
    root.querySelector('[data-cfg-i="priceLabel"]').textContent = L.priceLabel;
    root.querySelector('[data-cfg-i="priceFoot"]').textContent = L.priceFoot;
    root.querySelector('.cfg-result-cta .btn-primary').textContent = L.cta;

    // Trafik buton metinleri
    root.querySelectorAll('.cfg-options--traffic .cfg-opt').forEach(b => {
      const k = b.dataset.value;
      b.querySelector('strong').textContent = L[`t${k[0].toUpperCase() + k.slice(1)}`] || k;
      b.querySelector('span').textContent = L[`t${k[0].toUpperCase() + k.slice(1)}Desc`] || '';
    });
  }

  function render() {
    panes.forEach(p => p.classList.toggle('is-active', +p.dataset.pane === state.step));
    stepsBar.forEach(s => {
      const n = +s.dataset.step;
      s.classList.toggle('is-active', n === state.step);
      s.classList.toggle('is-done', n < state.step);
    });
    prevBtn.style.visibility = state.step === 1 ? 'hidden' : 'visible';
    nextBtn.style.display = state.step === TOTAL_STEPS ? 'none' : '';
    nextBtn.textContent = state.step === TOTAL_STEPS - 1 ? t().finish : t().next;
    nextBtn.disabled = (state.step === 1 && !state.sector) || (state.step === 3 && !state.traffic);

    // Otel/hastane → oda/yatak görünür
    const roomLabel = root.querySelector('.cfg-extra');
    if (roomLabel) {
      const showFor = (roomLabel.dataset.showFor || '').split(' ');
      roomLabel.style.display = showFor.includes(state.sector) ? '' : 'none';
    }

    if (state.step === 4) renderResult();
  }

  function renderResult() {
    const data = SECTOR_DATA[state.sector];
    if (!data) return;
    const trafficMult = TRAFFIC_MULT[state.traffic] || 1;
    const base = (data.perStaff * state.staff) + (data.perRoom * state.rooms);
    const center = base * trafficMult;
    const min = center * 0.80;
    const max = center * 1.25;

    root.querySelector('.cfg-result-name').textContent = data.pkg;
    root.querySelector('.cfg-result-desc').textContent = data.desc[lang()] || data.desc.tr;
    const list = root.querySelector('.cfg-result-list');
    list.innerHTML = '';
    data.items.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg><span>${item}</span>`;
      list.appendChild(li);
    });
    root.querySelector('[data-cfg-min]').textContent = fmt(min);
    root.querySelector('[data-cfg-max]').textContent = fmt(max);

    // CTA href'e parametre ekle
    const cta = root.querySelector('.cfg-result-cta .btn-primary');
    cta.setAttribute('href', `iletisim.html?from=config&sector=${state.sector}&pkg=${encodeURIComponent(data.pkg)}`);
  }

  // Olay bağlayıcıları
  root.querySelectorAll('[data-pane="1"] .cfg-opt').forEach(b => {
    b.addEventListener('click', () => {
      state.sector = b.dataset.value;
      root.querySelectorAll('[data-pane="1"] .cfg-opt').forEach(o => o.classList.toggle('is-selected', o === b));
      render();
    });
  });
  root.querySelector('[data-pane="2"] input[name="alan"]').addEventListener('input', e => { state.m2 = +e.target.value || 0; });
  root.querySelector('[data-pane="2"] input[name="personel"]').addEventListener('input', e => { state.staff = +e.target.value || 0; });
  const roomsInput = root.querySelector('[data-pane="2"] input[name="oda"]');
  if (roomsInput) roomsInput.addEventListener('input', e => { state.rooms = +e.target.value || 0; });

  root.querySelectorAll('[data-pane="3"] .cfg-opt').forEach(b => {
    b.addEventListener('click', () => {
      state.traffic = b.dataset.value;
      root.querySelectorAll('[data-pane="3"] .cfg-opt').forEach(o => o.classList.toggle('is-selected', o === b));
      render();
    });
  });

  nextBtn.addEventListener('click', () => { if (state.step < TOTAL_STEPS) { state.step++; render(); refreshLabels(); }});
  prevBtn.addEventListener('click', () => { if (state.step > 1) { state.step--; render(); refreshLabels(); }});
  restartBtn.addEventListener('click', () => {
    state.step = 1; state.sector = null; state.traffic = 'mid';
    root.querySelectorAll('.cfg-opt.is-selected').forEach(o => o.classList.remove('is-selected'));
    render(); refreshLabels();
  });

  window.addEventListener('mts:lang-changed', () => { refreshLabels(); if (state.step === 4) renderResult(); });

  refreshLabels();
  render();
}
