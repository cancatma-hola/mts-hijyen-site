// Tesise göre paket konfigüratörü — 4 adımlı wizard
const AR_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
function fmt(n) {
  const s = Math.round(n).toLocaleString('tr-TR');
  if (document.documentElement.lang === 'ar') return s.replace(/\d/g, d => AR_DIGITS[+d]);
  return s;
}

// Sektör → temel kişi başı aylık hijyen maliyet katsayısı (₺), ürün önerisi paketleri
// pkg + desc + items hepsi multi-lang
const SECTOR_DATA = {
  otel: {
    perStaff: 95, perRoom: 180,
    pkg:  { tr: 'Premium Konaklama', en: 'Premium Hospitality', de: 'Premium Gastgewerbe', ar: 'باقة الفنادق الفاخرة' },
    desc: { tr: 'Misafir deneyimi odaklı yumuşak doku + premium amenities', en: 'Guest-experience first: soft tissue + premium amenities', de: 'Gast-fokussiert: weiches Gewebe + Premium-Amenities', ar: 'تجربة الضيف أولاً: مناديل ناعمة + مستلزمات فاخرة' },
    items: {
      tr: ['Premium tuvalet kağıdı', 'El sabunu & krem dispenseri', 'Banyo amenities seti', 'Yüzey dezenfektanı', 'Çöp poşeti'],
      en: ['Premium toilet paper', 'Hand soap & lotion dispenser', 'Bathroom amenities set', 'Surface disinfectant', 'Garbage bags'],
      de: ['Premium Toilettenpapier', 'Seifen- & Lotionsspender', 'Badezimmer-Amenities-Set', 'Flächendesinfektion', 'Müllbeutel'],
      ar: ['ورق تواليت فاخر', 'موزع صابون ومرطب', 'طقم مستلزمات الحمام', 'مطهر الأسطح', 'أكياس قمامة'],
    },
  },
  hastane: {
    perStaff: 140, perRoom: 220,
    pkg:  { tr: 'Klinik Hijyen Pro', en: 'Clinical Hygiene Pro', de: 'Klinische Hygiene Pro', ar: 'باقة النظافة الطبية' },
    desc: { tr: 'Tıbbi standartta dezenfeksiyon + tek kullanımlık ürün ağırlıklı', en: 'Medical-grade disinfection + disposable-heavy', de: 'Medizinische Desinfektion + Einwegfokus', ar: 'تطهير طبي + منتجات يمكن التخلص منها' },
    items: {
      tr: ['ULV dezenfektan', 'Cerrahi maske & eldiven', 'Antibakteriyel sabun', 'Klinik silme bezi', 'Tıbbi atık poşeti', 'Tuvalet kağıdı'],
      en: ['ULV disinfectant', 'Surgical masks & gloves', 'Antibacterial soap', 'Clinical wipes', 'Medical waste bags', 'Toilet paper'],
      de: ['ULV-Desinfektion', 'OP-Masken & Handschuhe', 'Antibakterielle Seife', 'Klinik-Wischtücher', 'Medizinische Abfallbeutel', 'Toilettenpapier'],
      ar: ['مطهر ULV', 'كمامات وقفازات جراحية', 'صابون مضاد للبكتيريا', 'مناديل سريرية', 'أكياس النفايات الطبية', 'ورق تواليت'],
    },
  },
  okul: {
    perStaff: 35, perRoom: 0,
    pkg:  { tr: 'Eğitim Tesisi', en: 'Education Facility', de: 'Bildungseinrichtung', ar: 'باقة المؤسسات التعليمية' },
    desc: { tr: 'Yüksek hacim + ekonomik formül + güvenli kimyasal', en: 'High volume + economical + child-safe chemicals', de: 'Großvolumen + ökonomisch + kinderfreundlich', ar: 'حجم كبير + اقتصادي + آمن للأطفال' },
    items: {
      tr: ['Jumbo tuvalet kağıdı', 'Köpük el sabunu', 'Yüzey temizleyici', 'Çöp poşeti', 'Kağıt havlu'],
      en: ['Jumbo toilet paper', 'Foam hand soap', 'Surface cleaner', 'Garbage bags', 'Paper towels'],
      de: ['Jumbo-Toilettenpapier', 'Schaumseife', 'Flächenreiniger', 'Müllbeutel', 'Papierhandtücher'],
      ar: ['ورق تواليت جامبو', 'صابون اليد الرغوي', 'منظف الأسطح', 'أكياس قمامة', 'مناشف ورقية'],
    },
  },
  ofis: {
    perStaff: 55, perRoom: 0,
    pkg:  { tr: 'Modern Ofis', en: 'Modern Office', de: 'Modernes Büro', ar: 'باقة المكاتب الحديثة' },
    desc: { tr: 'Z-katlama havlu, otomatik dispenser, kahve molası ürünleri', en: 'Z-fold towels, auto dispensers, breakroom essentials', de: 'Z-Falt-Handtücher, Auto-Spender, Pausenraum-Produkte', ar: 'مناشف Z، موزعات أوتوماتيكية، أساسيات الاستراحة' },
    items: {
      tr: ['Z-katlama havlu', 'El sabunu dispenseri', 'Yüzey dezenfektanı', 'Tuvalet kağıdı', 'Mutfak temizleyici'],
      en: ['Z-fold towels', 'Soap dispenser', 'Surface disinfectant', 'Toilet paper', 'Kitchen cleaner'],
      de: ['Z-Falt-Handtücher', 'Seifenspender', 'Flächendesinfektion', 'Toilettenpapier', 'Küchenreiniger'],
      ar: ['مناشف Z', 'موزع صابون', 'مطهر الأسطح', 'ورق تواليت', 'منظف المطبخ'],
    },
  },
  fabrika: {
    perStaff: 110, perRoom: 0,
    pkg:  { tr: 'Endüstriyel Pro', en: 'Industrial Pro', de: 'Industrie Pro', ar: 'باقة الصناعة المتقدمة' },
    desc: { tr: 'Ağır kir & yağ formülleri + endüstriyel ekipman', en: 'Heavy-duty grease & oil formulas + industrial gear', de: 'Schwere Verschmutzung + Industrieausrüstung', ar: 'صيغ شحوم وزيوت ثقيلة + معدات صناعية' },
    items: {
      tr: ['Endüstriyel degreaser', 'Sanayi tipi sabun', 'Mikrofiber bez (büyük)', 'Çöp poşeti (XL)', 'Koruyucu eldiven'],
      en: ['Industrial degreaser', 'Industrial soap', 'Microfiber cloth (large)', 'Garbage bags (XL)', 'Protective gloves'],
      de: ['Industrieller Entfetter', 'Industrieseife', 'Mikrofasertuch (groß)', 'Müllbeutel (XL)', 'Schutzhandschuhe'],
      ar: ['مزيل الشحوم الصناعي', 'صابون صناعي', 'قماش ميكروفايبر (كبير)', 'أكياس قمامة (XL)', 'قفازات واقية'],
    },
  },
  avm: {
    perStaff: 75, perRoom: 0,
    pkg:  { tr: 'AVM & Perakende', en: 'Mall & Retail', de: 'Einkaufszentrum & Einzelhandel', ar: 'باقة المراكز التجارية والتجزئة' },
    desc: { tr: 'Yoğun trafik dezenfeksiyonu + cila/parlatıcı', en: 'High-traffic disinfection + polish/wax', de: 'Hochfrequenz-Desinfektion + Polierprodukte', ar: 'تطهير عالي الكثافة + مواد تلميع' },
    items: {
      tr: ['Yüzey dezenfektanı', 'Cam temizleyici', 'Zemin cilası', 'Tuvalet kağıdı', 'Otomatik koku gidericisi'],
      en: ['Surface disinfectant', 'Glass cleaner', 'Floor polish', 'Toilet paper', 'Automatic air freshener'],
      de: ['Flächendesinfektion', 'Glasreiniger', 'Bodenpolitur', 'Toilettenpapier', 'Automatischer Lufterfrischer'],
      ar: ['مطهر الأسطح', 'منظف الزجاج', 'ملمع الأرضيات', 'ورق تواليت', 'معطر جو أوتوماتيكي'],
    },
  },
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
  const progressLine = root.querySelector('.cfg-progress-line');

  const state = { step: 1, sector: null, m2: 1000, staff: 50, rooms: 0, traffic: 'mid', dir: 1 };
  const TOTAL_STEPS = 4;

  function lang() { return document.documentElement.lang || 'tr'; }
  function t() { return I18N[lang()] || I18N.tr; }

  // ----- Counter tween (calc'taki gibi) -----
  const tweens = new WeakMap();
  function tweenCounter(el, to) {
    if (!el) return;
    const prev = tweens.get(el);
    if (prev) cancelAnimationFrame(prev.raf);
    const from = parseFloat(el.dataset.cur || '0');
    const start = performance.now();
    const dur = 600;
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const v = from + (to - from) * ease(t);
      el.dataset.cur = String(v);
      el.textContent = fmt(v);
      if (t < 1) {
        const raf = requestAnimationFrame(tick);
        tweens.set(el, { raf });
      } else {
        tweens.delete(el);
      }
    };
    tweens.set(el, { raf: requestAnimationFrame(tick) });
  }

  function refreshLabels() {
    const L = t();
    if (state.step === TOTAL_STEPS - 1) nextBtn.textContent = L.finish;
    else nextBtn.textContent = L.next;
  }

  function render() {
    // Yön-aware step pane animasyonu
    panes.forEach(p => {
      const isActive = +p.dataset.pane === state.step;
      p.classList.remove('is-enter-fwd', 'is-enter-bwd');
      if (isActive) {
        p.classList.add(state.dir > 0 ? 'is-enter-fwd' : 'is-enter-bwd');
      }
      p.classList.toggle('is-active', isActive);
    });
    stepsBar.forEach(s => {
      const n = +s.dataset.step;
      s.classList.toggle('is-active', n === state.step);
      s.classList.toggle('is-done', n < state.step);
    });
    if (progressLine) {
      const pct = ((state.step - 1) / (TOTAL_STEPS - 1)) * 100;
      progressLine.style.width = pct + '%';
    }
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

  // Seçilen sektör/trafik için lokalize etiket bul
  function getSectorLabel() {
    const btn = root.querySelector(`[data-pane="1"] .cfg-opt[data-value="${state.sector}"] span`);
    return btn ? btn.textContent : state.sector;
  }
  function getTrafficLabel() {
    const btn = root.querySelector(`[data-pane="3"] .cfg-opt[data-value="${state.traffic}"] strong`);
    return btn ? btn.textContent : state.traffic;
  }

  function renderResult() {
    const data = SECTOR_DATA[state.sector];
    if (!data) return;
    const L = lang();
    const trafficMult = TRAFFIC_MULT[state.traffic] || 1;
    const base = (data.perStaff * state.staff) + (data.perRoom * state.rooms);
    const center = base * trafficMult;
    const min = center * 0.80;
    const max = center * 1.25;

    const pkgName = (data.pkg && data.pkg[L]) || data.pkg.tr;
    root.querySelector('.cfg-result-name').textContent = pkgName;
    root.querySelector('.cfg-result-desc').textContent = (data.desc && data.desc[L]) || data.desc.tr;

    // Özet chip'leri (sektör · ölçek · trafik)
    const summary = root.querySelector('.cfg-result-summary-chips');
    if (summary) {
      const chips = [
        { icon: 'building', text: getSectorLabel() },
        { icon: 'users',    text: `${fmt(state.staff)} ${({ tr: 'kişi', en: 'people', de: 'Pers.', ar: 'شخص' })[L]}` },
        { icon: 'square',   text: `${fmt(state.m2)} m²` },
        { icon: 'pulse',    text: getTrafficLabel() },
      ];
      if (state.rooms > 0) {
        chips.splice(2, 0, { icon: 'bed', text: `${fmt(state.rooms)} ${({ tr: 'oda', en: 'rooms', de: 'Zimmer', ar: 'غرفة' })[L]}` });
      }
      summary.innerHTML = chips.map(c => `<span class="cfg-chip"><span class="cfg-chip-dot"></span>${c.text}</span>`).join('');
    }

    const list = root.querySelector('.cfg-result-list');
    list.innerHTML = '';
    const items = (data.items && data.items[L]) || data.items.tr;
    items.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg><span>${item}</span>`;
      list.appendChild(li);
    });

    // Animasyonlu fiyat aralığı
    tweenCounter(root.querySelector('[data-cfg-min]'), min);
    tweenCounter(root.querySelector('[data-cfg-max]'), max);

    // CTA href'lerine parametre ekle
    const cta = root.querySelector('.cfg-result-cta .btn-primary');
    cta.setAttribute('href', `iletisim.html?from=config&sector=${state.sector}&pkg=${encodeURIComponent(data.pkg.tr)}`);

    // WhatsApp paylaş — otomatik mesaj
    const waBtn = root.querySelector('.cfg-result-cta .cfg-wa');
    if (waBtn) {
      const msg = `Konfigüratör üzerinden ${data.pkg.tr} paketi için teklif istiyorum.\n` +
                  `Sektör: ${data.pkg.tr}\n` +
                  `Personel: ${state.staff}\n` +
                  `Alan: ${state.m2} m²\n` +
                  (state.rooms > 0 ? `Oda/Yatak: ${state.rooms}\n` : '') +
                  `Trafik: ${state.traffic}\n` +
                  `Tahmini bütçe: ₺${fmt(min)} – ₺${fmt(max)}/ay`;
      waBtn.setAttribute('href', `https://wa.me/905436835765?text=${encodeURIComponent(msg)}`);
    }
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

  nextBtn.addEventListener('click', () => {
    if (state.step < TOTAL_STEPS) { state.dir = 1; state.step++; render(); refreshLabels(); }
  });
  prevBtn.addEventListener('click', () => {
    if (state.step > 1) { state.dir = -1; state.step--; render(); refreshLabels(); }
  });
  restartBtn.addEventListener('click', () => {
    state.step = 1; state.sector = null; state.traffic = 'mid'; state.dir = -1;
    root.querySelectorAll('.cfg-opt.is-selected').forEach(o => o.classList.remove('is-selected'));
    // Reset price counter cache so next render tweens from 0
    const minEl = root.querySelector('[data-cfg-min]');
    const maxEl = root.querySelector('[data-cfg-max]');
    if (minEl) { minEl.dataset.cur = '0'; minEl.textContent = '0'; }
    if (maxEl) { maxEl.dataset.cur = '0'; maxEl.textContent = '0'; }
    render(); refreshLabels();
  });

  window.addEventListener('mts:lang-changed', () => { refreshLabels(); if (state.step === 4) renderResult(); });

  refreshLabels();
  render();
}
