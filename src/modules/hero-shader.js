import { Renderer, Program, Mesh, Triangle } from 'ogl';

// Hero video üzerine yerleştirilen WebGL sıvı/dalga distortion katmanı.
// Mouse pozisyonu shader'a uniform olarak gider; cursor çevresinde dalga oluşur.

const vertex = /* glsl */ `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  uniform vec2 uResolution;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uMouseStrength;

  // Simplex-ish noise (cheap)
  vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }
  float noise(in vec2 p) {
    const float K1 = 0.366025404;
    const float K2 = 0.211324865;
    vec2 i = floor(p + (p.x + p.y) * K1);
    vec2 a = p - i + (i.x + i.y) * K2;
    float m = step(a.y, a.x);
    vec2 o = vec2(m, 1.0 - m);
    vec2 b = a - o + K2;
    vec2 c = a - 1.0 + 2.0 * K2;
    vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
    vec3 n = h * h * h * h * vec3(dot(a, hash(i + 0.0)), dot(b, hash(i + o)), dot(c, hash(i + 1.0)));
    return dot(n, vec3(70.0));
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    vec2 p = uv;
    p.x *= uResolution.x / uResolution.y;

    float t = uTime * 0.18;
    float n1 = noise(p * 2.4 + vec2(t, t * 0.7));
    float n2 = noise(p * 4.6 + vec2(-t * 0.5, t * 0.9));
    float n = n1 * 0.6 + n2 * 0.4;

    // Mouse halkası
    vec2 m = uMouse;
    m.x *= uResolution.x / uResolution.y;
    float d = distance(p, m);
    float ring = smoothstep(0.32, 0.0, d) * uMouseStrength;
    n += ring * 0.6 * sin(d * 28.0 - uTime * 4.0);

    // Renk paleti: cyan / aqua gradient
    vec3 c1 = vec3(0.02, 0.18, 0.32);
    vec3 c2 = vec3(0.05, 0.55, 0.78);
    vec3 c3 = vec3(0.40, 0.86, 1.0);
    float v = clamp(n * 0.5 + 0.5, 0.0, 1.0);
    vec3 col = mix(c1, c2, v);
    col = mix(col, c3, smoothstep(0.65, 1.0, v));

    // Alpha — sahnenin video arka planını öldürmesin diye düşük
    float alpha = 0.22 + ring * 0.5;
    gl_FragColor = vec4(col, alpha);
  }
`;

export function initHeroShader() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(max-width: 768px)').matches) return;

  const hero = document.querySelector('.hero');
  if (!hero) return;

  const renderer = new Renderer({ alpha: true, antialias: false, dpr: Math.min(window.devicePixelRatio, 2) });
  const gl = renderer.gl;
  const canvas = gl.canvas;
  canvas.className = 'hero-shader-canvas';
  canvas.style.cssText = `
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 2;
    mix-blend-mode: screen;
    opacity: 0.55;
  `;

  // hero-video-full'in hemen sonrasına yerleştir
  const video = hero.querySelector('.hero-video-full');
  if (video && video.parentNode === hero) {
    video.insertAdjacentElement('afterend', canvas);
  } else {
    hero.insertBefore(canvas, hero.firstChild);
  }

  function resize() {
    const rect = hero.getBoundingClientRect();
    renderer.setSize(rect.width, rect.height);
  }
  resize();
  window.addEventListener('resize', resize);

  const geometry = new Triangle(gl);
  const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: {
      uResolution: { value: [gl.canvas.width, gl.canvas.height] },
      uTime: { value: 0 },
      uMouse: { value: [0.5, 0.5] },
      uMouseStrength: { value: 0 },
    },
  });
  const mesh = new Mesh(gl, { geometry, program });

  const mouse = { x: 0.5, y: 0.5, strength: 0 };
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    mouse.x = (e.clientX - rect.left) / rect.width;
    mouse.y = 1 - (e.clientY - rect.top) / rect.height;
    mouse.strength = 1;
  });
  hero.addEventListener('mouseleave', () => {
    mouse.strength = 0;
  });

  let raf;
  function frame(t) {
    program.uniforms.uTime.value = t * 0.001;
    program.uniforms.uResolution.value = [gl.canvas.width, gl.canvas.height];
    program.uniforms.uMouse.value = [mouse.x, mouse.y];
    // smooth decay
    program.uniforms.uMouseStrength.value += (mouse.strength - program.uniforms.uMouseStrength.value) * 0.08;
    renderer.render({ scene: mesh });
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);

  // Scroll'la opaklığı azalt
  window.addEventListener(
    'scroll',
    () => {
      const rect = hero.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, 1 - rect.bottom / window.innerHeight));
      canvas.style.opacity = String(0.55 * (1 - progress * 1.2));
    },
    { passive: true }
  );

  return () => {
    cancelAnimationFrame(raf);
    canvas.remove();
  };
}
