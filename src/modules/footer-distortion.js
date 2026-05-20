import { Renderer, Program, Mesh, Triangle } from 'ogl';

// Footer'a "MTS HIJYEN" tipografisini mouse-reactive distortion ile gösteren
// büyük WebGL katmanı ekler.

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
  uniform float uActive;
  uniform sampler2D uText;

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    vec2 p = uv;

    // Mouse-driven displacement
    vec2 m = uMouse;
    float d = distance(p, m);
    float falloff = exp(-d * 4.0) * uActive;

    vec2 dir = (p - m) / max(d, 0.0001);
    p += dir * falloff * 0.05;

    // Subtle wave
    p.x += sin(p.y * 12.0 + uTime * 0.6) * 0.004 * uActive;

    vec4 tex = texture2D(uText, p);

    // Glow on hovered region
    vec3 col = tex.rgb + vec3(0.0, 0.45, 1.0) * falloff * tex.a;
    gl_FragColor = vec4(col, tex.a);
  }
`;

function renderTextToCanvas() {
  const canvas = document.createElement('canvas');
  const dpr = Math.min(window.devicePixelRatio, 2);
  const w = 2048;
  const h = 512;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.fillStyle = 'rgba(0,0,0,0)';
  ctx.fillRect(0, 0, w, h);
  const grad = ctx.createLinearGradient(0, 0, w, 0);
  grad.addColorStop(0, '#fff');
  grad.addColorStop(0.5, '#b6e5ff');
  grad.addColorStop(1, '#38bdf8');
  ctx.fillStyle = grad;
  ctx.font = 'bold 380px "Syne", "Playfair Display", serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('MTS HIJYEN', w / 2, h / 2);
  return canvas;
}

export function initFooterDistortion() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const footer = document.querySelector('.site-footer');
  if (!footer) return;

  const host = document.createElement('div');
  host.className = 'footer-distortion';
  footer.insertBefore(host, footer.firstChild);

  const renderer = new Renderer({ alpha: true, antialias: false, dpr: Math.min(window.devicePixelRatio, 2) });
  const gl = renderer.gl;
  host.appendChild(gl.canvas);

  function resize() {
    const r = host.getBoundingClientRect();
    renderer.setSize(r.width, r.height);
  }
  resize();
  window.addEventListener('resize', resize);

  const textCanvas = renderTextToCanvas();
  const texture = (() => {
    const t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    return t;
  })();

  // OGL'in texture binding wrap'i:
  const oglTex = { texture, type: gl.TEXTURE_2D };

  const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: {
      uResolution: { value: [gl.canvas.width, gl.canvas.height] },
      uTime: { value: 0 },
      uMouse: { value: [0.5, 0.5] },
      uActive: { value: 0 },
      uText: { value: oglTex },
    },
    transparent: true,
  });
  const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

  const mouse = { x: 0.5, y: 0.5, active: 0 };
  host.addEventListener('mousemove', (e) => {
    const r = host.getBoundingClientRect();
    mouse.x = (e.clientX - r.left) / r.width;
    mouse.y = 1 - (e.clientY - r.top) / r.height;
    mouse.active = 1;
  });
  host.addEventListener('mouseleave', () => {
    mouse.active = 0;
  });

  // Aktif olmadığı sürece her frame'de render yapma — IntersectionObserver
  let visible = false;
  const io = new IntersectionObserver(
    (entries) => {
      visible = entries[0].isIntersecting;
    },
    { threshold: 0.05 }
  );
  io.observe(footer);

  function frame(t) {
    if (visible) {
      program.uniforms.uTime.value = t * 0.001;
      program.uniforms.uResolution.value = [gl.canvas.width, gl.canvas.height];
      program.uniforms.uMouse.value = [mouse.x, mouse.y];
      program.uniforms.uActive.value += (mouse.active - program.uniforms.uActive.value) * 0.08;
      renderer.render({ scene: mesh });
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
