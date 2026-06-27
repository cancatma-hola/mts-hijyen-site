// Hero arka plan videosu — mobil autoplay garantisi.
//
// HTML'de zaten `autoplay muted playsinline` var; ama bazı mobil tarayıcılar
// (iOS Safari Low Power Mode, agresif autoplay heuristic'leri, bazı Android
// data-saver modları) videoyu yine de durdurup ekranın ortasında bir play
// butonu gösteriyor. Bu modül üç şeyi garanti eder:
//   1. muted/playsinline property seviyesinde set edilir (attribute tek başına
//      bazı tarayıcılarda autoplay için yeterli sayılmıyor).
//   2. play() programatik denenir; döndürdüğü Promise reddedilirse yakalanır.
//   3. Reddedilirse ilk kullanıcı etkileşiminde (dokunuş/scroll/tıklama) tekrar
//      denenir — böylece kullanıcı butona basmadan, herhangi bir hareketle başlar.

export function initHeroVideo() {
  const video = document.querySelector('.hero-video-full');
  if (!video) return;

  // Autoplay için muted property'si set EDİLMİŞ olmalı (HTML attribute yetmeyebilir).
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');

  const tryPlay = () => {
    const p = video.play();
    if (p && typeof p.then === 'function') {
      return p.then(() => true).catch(() => false);
    }
    return Promise.resolve(true);
  };

  const armRetry = () => {
    const events = ['touchstart', 'pointerdown', 'click', 'scroll', 'keydown'];
    const onInteract = () => {
      events.forEach((ev) => window.removeEventListener(ev, onInteract));
      tryPlay();
    };
    events.forEach((ev) =>
      window.addEventListener(ev, onInteract, { once: true, passive: true })
    );
  };

  // İlk denemeyi videonun oynatılabilir olmasına bağla — metadata preload ile
  // play() çok erken çağrılırsa bazı tarayıcılarda sessizce başarısız oluyor.
  const start = () => tryPlay().then((ok) => { if (!ok) armRetry(); });

  if (video.readyState >= 2) {
    start();
  } else {
    video.addEventListener('loadeddata', start, { once: true });
    // loadeddata hiç gelmezse (metadata preload gecikmesi) yine de dene.
    video.addEventListener('canplay', start, { once: true });
    start();
  }

  // Sekme arkaplandan dönünce duraklamış kalmışsa tekrar başlat.
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && video.paused) tryPlay();
  });
}
