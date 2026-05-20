import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Three.js dinamik import — bundle ön yüklemesin
let THREE = null;

async function ensureThree() {
  if (!THREE) THREE = await import('three');
  return THREE;
}

function injectSection() {
  if (document.querySelector('.product-3d-section')) {
    return document.querySelector('.product-3d-section');
  }
  const section = document.createElement('section');
  section.className = 'product-3d-section';
  section.setAttribute('aria-label', '3D Ürün Sahnesi');
  section.innerHTML = `
    <div class="p3d-canvas-wrap"></div>
    <div class="p3d-content">
      <span class="p3d-label" data-tr="3D Ürün Sahnesi" data-en="3D Product Scene" data-de="3D-Produktszene" data-ar="مشهد المنتج ثلاثي الأبعاد">3D Ürün Sahnesi</span>
      <h2 class="p3d-title">
        <span>Hijyenin</span><br>
        <em>üç boyutu</em>
      </h2>
      <p class="p3d-desc">Kağıt · Kimyasal · Sarf — tek tedarikçide birleşen üç ana grup, fabrikadan rafınıza.</p>
      <div class="p3d-cues">
        <span class="p3d-cue">SCROLL</span>
        <span class="p3d-line"></span>
        <span class="p3d-cue">DÖNDÜR</span>
      </div>
    </div>
  `;

  const target = document.querySelector('.products-section');
  if (target) target.parentNode.insertBefore(section, target);
  else document.body.appendChild(section);

  return section;
}

export async function initProduct3D() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(max-width: 900px)').matches) return;

  const section = injectSection();
  const wrap = section.querySelector('.p3d-canvas-wrap');

  const T = await ensureThree();

  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 1.2, 5.4);
  camera.lookAt(0, 0.6, 0);

  const renderer = new T.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = T.SRGBColorSpace;
  wrap.appendChild(renderer.domElement);

  function resize() {
    const r = wrap.getBoundingClientRect();
    renderer.setSize(r.width, r.height);
    camera.aspect = r.width / r.height;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  // Lighting
  const key = new T.DirectionalLight(0xffffff, 1.6);
  key.position.set(3, 5, 4);
  scene.add(key);
  const rim = new T.DirectionalLight(0x60c4ff, 1.4);
  rim.position.set(-4, 2, -3);
  scene.add(rim);
  scene.add(new T.AmbientLight(0xffffff, 0.25));

  // MTS Hijyen logosu — sahnenin merkez objesi
  const loader = new T.TextureLoader();
  const logoTex = loader.load('img/logo.png', (tex) => {
    // Aspect ratio'yu logo boyutundan hesapla
    const aspect = tex.image.width / tex.image.height;
    logoPlane.scale.x = aspect;
  });
  logoTex.colorSpace = T.SRGBColorSpace;
  logoTex.anisotropy = 8;

  const logoGroup = new T.Group();
  scene.add(logoGroup);

  // Ana ön yüz (logo)
  const logoPlane = new T.Mesh(
    new T.PlaneGeometry(1, 1),
    new T.MeshBasicMaterial({ map: logoTex, transparent: true, side: T.DoubleSide })
  );
  logoPlane.scale.set(2.6, 2.6, 1);
  logoPlane.position.y = 1.1;
  logoGroup.add(logoPlane);

  // Cam zemin / yansıma efekti
  const reflection = new T.Mesh(
    new T.PlaneGeometry(1, 1),
    new T.MeshBasicMaterial({ map: logoTex, transparent: true, opacity: 0.22, side: T.DoubleSide })
  );
  reflection.scale.set(2.6, -2.6, 1); // ters çevir
  reflection.position.y = -1.15;
  logoGroup.add(reflection);

  // Yansımayı aşağıya doğru fadeout — siyah maske
  const fadeMask = new T.Mesh(
    new T.PlaneGeometry(6, 2),
    new T.MeshBasicMaterial({
      transparent: true,
      depthWrite: false,
      map: (() => {
        const c = document.createElement('canvas');
        c.width = 4; c.height = 256;
        const ctx = c.getContext('2d');
        const g = ctx.createLinearGradient(0, 0, 0, 256);
        g.addColorStop(0, 'rgba(2,5,13,0)');
        g.addColorStop(1, 'rgba(2,5,13,1)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 4, 256);
        const t = new T.CanvasTexture(c);
        t.colorSpace = T.SRGBColorSpace;
        return t;
      })(),
    })
  );
  fadeMask.position.set(0, -1.15, 0.01);
  scene.add(fadeMask);

  // Halo arka plan — yumuşak cyan glow halkası
  const halo = new T.Mesh(
    new T.RingGeometry(1.5, 2.6, 64),
    new T.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.18,
      side: T.DoubleSide,
      depthWrite: false,
    })
  );
  halo.position.set(0, 1.1, -0.4);
  scene.add(halo);

  // Yörünge halkası (dekoratif)
  const ringTorus = new T.Mesh(
    new T.TorusGeometry(2.4, 0.012, 16, 128),
    new T.MeshBasicMaterial({ color: 0x60c4ff, transparent: true, opacity: 0.55 })
  );
  ringTorus.rotation.x = Math.PI / 2;
  ringTorus.position.y = 1.1;
  scene.add(ringTorus);

  // Orbiting label sprites (Kağıt / Kimyasal / Sarf)
  const makeLabelSprite = (text) => {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(255,255,255,0.0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = 'bold 64px "Syne", sans-serif';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    const tex = new T.CanvasTexture(canvas);
    tex.colorSpace = T.SRGBColorSpace;
    const mat = new T.SpriteMaterial({ map: tex, transparent: true });
    const sprite = new T.Sprite(mat);
    sprite.scale.set(2.2, 0.55, 1);
    return sprite;
  };

  const orbitGroup = new T.Group();
  scene.add(orbitGroup);
  const labels = ['KAĞIT', 'KİMYASAL', 'SARF'].map((t) => {
    const s = makeLabelSprite(t);
    orbitGroup.add(s);
    return s;
  });
  function positionLabels(angle) {
    labels.forEach((s, i) => {
      const a = angle + (i * Math.PI * 2) / labels.length;
      s.position.set(Math.cos(a) * 1.9, 1.2 + Math.sin(a * 1.3) * 0.15, Math.sin(a) * 1.9);
    });
  }

  // State
  const state = { rotation: 0, camY: 1.2, camZ: 5.4 };

  // Scroll → rotation + camera dolly
  gsap.to(state, {
    rotation: Math.PI * 1.6,
    camY: 1.8,
    camZ: 4.6,
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
    },
  });

  // Render loop
  let raf;
  let lastT = 0;
  function frame(t) {
    const dt = (t - lastT) * 0.001;
    lastT = t;
    // Logoyu scroll'a göre Y ekseninde döndür + hafif yüzdür
    logoGroup.rotation.y = state.rotation + t * 0.0003;
    logoPlane.position.y = 1.1 + Math.sin(t * 0.001) * 0.05;
    halo.rotation.z = t * 0.0002;
    ringTorus.rotation.z = t * 0.0003;
    positionLabels(t * 0.0005);
    orbitGroup.rotation.y = -t * 0.0004;
    camera.position.y = state.camY;
    camera.position.z = state.camZ;
    camera.lookAt(0, 0.9, 0);
    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);

  // İçerik reveal
  const content = section.querySelector('.p3d-content');
  gsap.from(content.children, {
    y: 40,
    opacity: 0,
    duration: 0.9,
    stagger: 0.12,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: section,
      start: 'top 70%',
      toggleActions: 'play none none reverse',
    },
  });

  return () => {
    cancelAnimationFrame(raf);
    renderer.dispose();
  };
}
