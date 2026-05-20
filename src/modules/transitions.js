import { gsap } from 'gsap';

// Sayfa geçişleri — clip-path perde animasyonu ile full reload.
// SPA değil; ancak görsel olarak akıcı bir geçiş hissi yaratır.
// Vite bundle'ı tarayıcı cache'inde tutulduğu için reload hızlıdır.

const SAME_ORIGIN_LINKS = 'a[href]:not([target="_blank"]):not([data-no-transition]):not([download])';

function isInternalNav(a) {
  try {
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return false;
    // Yalnızca .html veya / linkleri
    if (!url.pathname.endsWith('.html') && url.pathname !== '/' && url.pathname !== '') return false;
    // Aynı sayfa hash'i — atla
    if (url.pathname === location.pathname && url.hash) return false;
    if (url.href === location.href) return false;
    return true;
  } catch {
    return false;
  }
}

function createCurtain() {
  const c = document.createElement('div');
  c.className = 'page-curtain';
  c.innerHTML = '<div class="page-curtain__inner"></div>';
  document.body.appendChild(c);
  return c;
}

function playEnterAnimation(curtain) {
  // Sayfa yüklendiğinde — curtain en üst pozisyondaysa aşağı çek (açılış)
  return gsap
    .timeline()
    .set(curtain, { display: 'block', clipPath: 'inset(0% 0% 0% 0%)' })
    .to(curtain, {
      clipPath: 'inset(100% 0% 0% 0%)',
      duration: 0.85,
      ease: 'expo.inOut',
      delay: 0.1,
    })
    .set(curtain, { display: 'none', clipPath: 'inset(0% 0% 100% 0%)' });
}

function playLeaveAnimation(curtain, onComplete) {
  return gsap
    .timeline({ onComplete })
    .set(curtain, { display: 'block', clipPath: 'inset(0% 0% 100% 0%)' })
    .to(curtain, {
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: 0.7,
      ease: 'expo.inOut',
    });
}

let isLeaving = false;

export function initPageTransitions() {
  const curtain = createCurtain();

  // Açılış animasyonu — sayfa yüklendiğinde curtain aşağı çekilir
  // Sadece tarayıcı history'den geliyorsa (referrer aynı origin)
  const fromInternal = document.referrer && new URL(document.referrer).origin === location.origin;
  if (fromInternal) {
    playEnterAnimation(curtain);
  }

  document.addEventListener('click', (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    const a = e.target.closest(SAME_ORIGIN_LINKS);
    if (!a) return;
    if (!isInternalNav(a)) return;
    if (isLeaving) {
      e.preventDefault();
      return;
    }
    e.preventDefault();
    isLeaving = true;
    document.documentElement.classList.add('is-transitioning');
    playLeaveAnimation(curtain, () => {
      location.href = a.href;
    });
  });
}
