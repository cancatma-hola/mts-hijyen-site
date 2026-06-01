// MTS Hijyen — Vite entry point
//
// CSS strategy:
//   * Universal stiller (her sayfada lazım) statik import edilir.
//   * Sayfa-spesifik stiller (calc, products-pin, compare-slider) ilgili JS modülünün
//     içinden DİNAMİK import edilir — Vite ayrı chunk oluşturur, sadece DOM varsa indirilir.

// Universal styles — her sayfa
import './styles/style.css';
import './styles/premium.css';
import './styles/awwwards.css';
import './styles/preloader.css';
import './styles/transitions.css';
import './styles/footer-distortion.css';
import './styles/mobile.css';

import { initPreloader } from './modules/preloader.js';

// Preloader DOM hazır olmadan başlasın
initPreloader();

import './legacy/main.js';

// Universal modules
import { initLenis } from './modules/lenis-setup.js';
import { initReveal } from './modules/reveal.js';
import { initCursor } from './modules/cursor.js';
import { autoDecorate } from './modules/auto-decorate.js';
import { initHeroShader } from './modules/hero-shader.js';
import { initHeroAnim } from './modules/hero-anim.js';
import { initWebglHover } from './modules/webgl-hover.js';
import { initPageTransitions } from './modules/transitions.js';
import { initFooterDistortion } from './modules/footer-distortion.js';
import { initAnimPause } from './modules/anim-pause.js';

// Sayfa-spesifik modülleri DOM kontrolüyle dinamik yükle.
// Sayfada ilgili section yoksa CSS+JS chunk hiç indirilmez.
async function loadPageSpecific() {
  if (document.querySelector('.products-section')) {
    const [, mod] = await Promise.all([
      import('./styles/products-pin.css'),
      import('./modules/products-pin.js'),
    ]);
    mod.initProductsPin();
  }
  if (document.querySelector('.savings-calc-section')) {
    const [, mod] = await Promise.all([
      import('./styles/calc-config.css'),
      import('./modules/savings-calc.js'),
    ]);
    mod.initSavingsCalc();
  }
  if (document.querySelector('.testimonials-track-wrapper')) {
    const mod = await import('./modules/testimonials-3d.js');
    mod.initTestimonials3D();
  }
  if (document.querySelector('.configurator-section, [data-configurator]')) {
    const mod = await import('./modules/configurator.js');
    mod.initConfigurator();
  }
}

function boot() {
  autoDecorate();
  initLenis();
  initReveal();
  initCursor();
  initHeroShader();
  initHeroAnim();
  initWebglHover();
  initFooterDistortion();
  initPageTransitions();
  loadPageSpecific();
  // En son: yukarıdaki modüller DOM'a dekoratif elementler ekledikten sonra observe et
  requestAnimationFrame(() => initAnimPause());
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
