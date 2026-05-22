// MTS Hijyen — Vite entry point

import './styles/style.css';
import './styles/premium.css';
import './styles/awwwards.css';
import './styles/preloader.css';
import './styles/products-pin.css';
import './styles/compare-slider.css';
import './styles/transitions.css';
import './styles/footer-distortion.css';
import './styles/calc-config.css';
import './styles/mobile.css';

import { initPreloader } from './modules/preloader.js';

// Preloader DOM hazır olmadan başlasın
initPreloader();

import './legacy/main.js';
// cursor-intro.js devre dışı — yeni preloader kullanılıyor
// import './legacy/cursor-intro.js';

import { initLenis } from './modules/lenis-setup.js';
import { initReveal } from './modules/reveal.js';
import { initCursor } from './modules/cursor.js';
import { autoDecorate } from './modules/auto-decorate.js';
import { initHeroShader } from './modules/hero-shader.js';
import { initHeroAnim } from './modules/hero-anim.js';
import { initProductsPin } from './modules/products-pin.js';
import { initWebglHover } from './modules/webgl-hover.js';
import { initTestimonials3D } from './modules/testimonials-3d.js';
import { initPageTransitions } from './modules/transitions.js';
import { initFooterDistortion } from './modules/footer-distortion.js';
import { initSavingsCalc } from './modules/savings-calc.js';
import { initConfigurator } from './modules/configurator.js';

function boot() {
  autoDecorate();
  initLenis();
  initReveal();
  initCursor();
  initHeroShader();
  initHeroAnim();
  initProductsPin();
  initWebglHover();
  initTestimonials3D();
  initFooterDistortion();
  initPageTransitions();
  initSavingsCalc();
  initConfigurator();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
