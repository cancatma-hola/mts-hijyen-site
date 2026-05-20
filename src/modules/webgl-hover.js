import { Renderer, Program, Mesh, Plane, Texture } from 'ogl';

// [data-webgl-hover] attribute'lu görselleri OGL plane'e dönüştürür.
// Hover'da görsel sıvı gibi displacement uygular.

const vertex = /* glsl */ `
  attribute vec2 uv;
  attribute vec3 position;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  uniform sampler2D tImage;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uHover;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    float d = distance(uv, uMouse);
    float ripple = sin(d * 24.0 - uTime * 4.0) * exp(-d * 6.0) * uHover * 0.04;
    vec2 dir = normalize(uv - uMouse + 0.0001);
    uv += dir * ripple;
    vec3 col = texture2D(tImage, uv).rgb;
    // Hafif renk pulse
    col *= 1.0 + uHover * 0.06;
    gl_FragColor = vec4(col, 1.0);
  }
`;

function makePlane(img) {
  const rect = img.getBoundingClientRect();
  const canvas = document.createElement('canvas');
  canvas.className = 'webgl-hover-canvas';
  canvas.style.cssText = `
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
  `;

  const wrap = img.parentNode;
  const wrapStyle = getComputedStyle(wrap);
  if (wrapStyle.position === 'static') wrap.style.position = 'relative';
  wrap.appendChild(canvas);

  const renderer = new Renderer({ canvas, alpha: true, dpr: Math.min(window.devicePixelRatio, 2) });
  const gl = renderer.gl;
  renderer.setSize(rect.width, rect.height);

  const tex = new Texture(gl, { generateMipmaps: false });
  const tmp = new Image();
  tmp.crossOrigin = 'anonymous';
  tmp.src = img.src;
  tmp.onload = () => {
    tex.image = tmp;
  };

  const geometry = new Plane(gl);
  const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: {
      tImage: { value: tex },
      uTime: { value: 0 },
      uMouse: { value: [0.5, 0.5] },
      uHover: { value: 0 },
    },
  });
  const mesh = new Mesh(gl, { geometry, program });

  let hovered = 0;
  const mouse = [0.5, 0.5];

  img.addEventListener('mouseenter', () => {
    canvas.style.opacity = '1';
    img.style.opacity = '0';
    hovered = 1;
  });
  img.addEventListener('mouseleave', () => {
    canvas.style.opacity = '0';
    img.style.opacity = '';
    hovered = 0;
  });
  img.addEventListener('mousemove', (e) => {
    const r = img.getBoundingClientRect();
    mouse[0] = (e.clientX - r.left) / r.width;
    mouse[1] = 1 - (e.clientY - r.top) / r.height;
  });

  function resize() {
    const r = img.getBoundingClientRect();
    renderer.setSize(r.width, r.height);
  }
  window.addEventListener('resize', resize);

  function frame(t) {
    program.uniforms.uTime.value = t * 0.001;
    program.uniforms.uMouse.value = mouse;
    program.uniforms.uHover.value += (hovered - program.uniforms.uHover.value) * 0.1;
    renderer.render({ scene: mesh });
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

export function initWebglHover() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(hover: none)').matches) return;

  const imgs = document.querySelectorAll('img[data-webgl-hover]');
  imgs.forEach((img) => {
    if (img.complete) makePlane(img);
    else img.addEventListener('load', () => makePlane(img), { once: true });
  });
}
