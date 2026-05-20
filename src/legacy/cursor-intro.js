'use strict';
(function () {

  var overlay = document.getElementById('cursor-intro-overlay');
  var canvas  = document.getElementById('cursor-intro-canvas');
  if (!overlay || !canvas) return;

  /* ---- Context ---- */
  var ctx = canvas.getContext('2d');
  ctx.running = true;
  ctx.frame   = 1;

  /* ---- Physics config ---- */
  var E = {
    friction:   0.5,
    trails:     80,
    size:       50,
    dampening:  0.025,
    tension:    0.99
  };

  var colorVal = 0;
  var pos      = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  var lines    = [];
  var started  = false;

  /* ---- Color wave oscillator ---- */
  function Wave(o) {
    this.phase     = o.phase     || 0;
    this.offset    = o.offset    || 0;
    this.frequency = o.frequency || 0.001;
    this.amplitude = o.amplitude || 1;
  }
  Wave.prototype.update = function () {
    this.phase += this.frequency;
    colorVal = this.offset + Math.sin(this.phase) * this.amplitude;
    return colorVal;
  };

  /* ---- Spring node ---- */
  function Node() { this.x = 0; this.y = 0; this.vx = 0; this.vy = 0; }

  /* ---- Trailing line ---- */
  function Line(o) {
    this.spring  = o.spring + 0.1 * Math.random() - 0.05;
    this.friction = E.friction + 0.01 * Math.random() - 0.005;
    this.nodes   = [];
    for (var i = 0; i < E.size; i++) {
      var nd = new Node();
      nd.x = pos.x; nd.y = pos.y;
      this.nodes.push(nd);
    }
  }
  Line.prototype.update = function () {
    var sp = this.spring, t = this.nodes[0];
    t.vx += (pos.x - t.x) * sp;
    t.vy += (pos.y - t.y) * sp;
    for (var n, i = 0, len = this.nodes.length; i < len; i++) {
      t = this.nodes[i];
      if (i > 0) {
        n = this.nodes[i - 1];
        t.vx += (n.x - t.x) * sp;
        t.vy += (n.y - t.y) * sp;
        t.vx += n.vx * E.dampening;
        t.vy += n.vy * E.dampening;
      }
      t.vx *= this.friction;
      t.vy *= this.friction;
      t.x  += t.vx;
      t.y  += t.vy;
      sp   *= E.tension;
    }
  };
  Line.prototype.draw = function () {
    var nx = this.nodes[0].x, ny = this.nodes[0].y;
    ctx.beginPath();
    ctx.moveTo(nx, ny);
    var a, o, nd, nxt;
    for (a = 1, o = this.nodes.length - 2; a < o; a++) {
      nd  = this.nodes[a];
      nxt = this.nodes[a + 1];
      nx  = 0.5 * (nd.x + nxt.x);
      ny  = 0.5 * (nd.y + nxt.y);
      ctx.quadraticCurveTo(nd.x, nd.y, nx, ny);
    }
    nd  = this.nodes[a];
    nxt = this.nodes[a + 1];
    ctx.quadraticCurveTo(nd.x, nd.y, nxt.x, nxt.y);
    ctx.stroke();
    ctx.closePath();
  };

  /* ---- Init trail lines ---- */
  function initLines() {
    lines = [];
    for (var i = 0; i < E.trails; i++) {
      lines.push(new Line({ spring: 0.45 + (i / E.trails) * 0.025 }));
    }
  }

  /* ---- Render loop ---- */
  var wave = new Wave({
    phase:     Math.random() * 2 * Math.PI,
    amplitude: 85,
    frequency: 0.0015,
    offset:    285
  });

  function render() {
    if (!ctx.running) return;
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = 'hsla(' + Math.round(wave.update()) + ',100%,55%,0.04)';
    ctx.lineWidth   = 12;
    for (var i = 0; i < E.trails; i++) {
      lines[i].update();
      lines[i].draw();
    }
    ctx.frame++;
    requestAnimationFrame(render);
  }

  /* ---- Mouse / touch tracking ---- */
  function handleMove(ev) {
    if (ev.touches) {
      pos.x = ev.touches[0].pageX;
      pos.y = ev.touches[0].pageY;
    } else {
      pos.x = ev.clientX;
      pos.y = ev.clientY;
    }
    if (!started) {
      started = true;
      /* Hide the hint text the moment user interacts */
      var hint = document.getElementById('cursor-intro-hint');
      if (hint) { hint.style.opacity = '0'; hint.style.transition = 'opacity 0.4s'; }
    }
  }

  /* ---- Resize ---- */
  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  initLines();
  render();

  window.addEventListener('resize', resizeCanvas);
  document.addEventListener('mousemove', handleMove, { passive: true });
  document.addEventListener('touchstart', handleMove, { passive: true });
  document.addEventListener('touchmove',  handleMove, { passive: true });

  /* ---- Dismiss: fade out after 4 s, then trigger hero animations ---- */
  setTimeout(function () {
    overlay.classList.add('outro');
    setTimeout(function () {
      ctx.running = false;
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      /* Hero animasyonları buradan sıfırdan başlar */
      document.body.classList.add('hero-ready');
    }, 900);
  }, 4000);

})();
