// ETG site — v2 interactions

// ═══════════════════════════════════════════════════════════
// CURSOR — bulletproof
// ═══════════════════════════════════════════════════════════
try {
  (function() {
    const cur = document.getElementById('cur') || document.querySelector('.cursor-dot');
    const ring = document.getElementById('cur-ring') || document.querySelector('.cursor-ring');
    if (!cur || !ring) return;

    // Bail on touch devices
    if (window.matchMedia && window.matchMedia('(hover: none), (pointer: coarse)').matches) {
      cur.style.display = 'none';
      ring.style.display = 'none';
      document.documentElement.style.cursor = 'auto';
      document.body.style.cursor = 'auto';
      return;
    }

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx, ry = my;

    // Force critical styles inline — defeat any CSS shenanigans
    function applyStyles(el) {
      el.style.position = 'fixed';
      el.style.top = '0';
      el.style.left = '0';
      el.style.pointerEvents = 'none';
      el.style.zIndex = '2147483647';
      el.style.opacity = '1';
      el.style.display = 'block';
    }
    applyStyles(cur);
    applyStyles(ring);

    function track(e) {
      if (typeof e.clientX === 'number') {
        mx = e.clientX;
        my = e.clientY;
      }
    }
    document.addEventListener('mousemove', track, { passive: true, capture: true });
    document.addEventListener('mousedown', track, { passive: true, capture: true });
    document.addEventListener('mouseover', track, { passive: true, capture: true });
    document.addEventListener('pointermove', track, { passive: true, capture: true });

    function loop() {
      try {
        rx += (mx - rx) * 0.18;
        ry += (my - ry) * 0.18;
        cur.style.transform = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-50%)';
        ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';
      } catch (e) {}
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    // Hover grow effect on interactive elements
    document.querySelectorAll('a, button, [data-hover], input, textarea, select, label').forEach(function(el) {
      el.addEventListener('mouseenter', function() { document.body.classList.add('ch'); });
      el.addEventListener('mouseleave', function() { document.body.classList.remove('ch'); });
    });
  })();
} catch (e) {
  // If cursor JS fails entirely, restore native cursor so user isn't left without one
  document.documentElement.style.cursor = 'auto';
  if (document.body) document.body.style.cursor = 'auto';
  console.warn('Custom cursor failed:', e);
}

// ═══════════════════════════════════════════════════════════
// Hero slideshow
// ═══════════════════════════════════════════════════════════
(function() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  const counter = document.getElementById('slideCounter');
  if (!slides.length) return;
  let cur = 0;
  function goTo(n) {
    slides[cur].classList.remove('active');
    if (dots[cur]) dots[cur].classList.remove('active');
    cur = n;
    slides[cur].classList.add('active');
    if (dots[cur]) dots[cur].classList.add('active');
    if (counter) counter.textContent = String(cur+1).padStart(2,'0') + ' / ' + String(slides.length).padStart(2,'0');
  }
  dots.forEach(function(d) { d.addEventListener('click', function() { goTo(+d.dataset.idx); }); });
  setInterval(function() { goTo((cur+1) % slides.length); }, 5500);
})();

// ═══════════════════════════════════════════════════════════
// Reveal on scroll
// ═══════════════════════════════════════════════════════════
(function() {
  const io = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: .08 });
  document.querySelectorAll('.reveal').forEach(function(el) { io.observe(el); });
})();

// ═══════════════════════════════════════════════════════════
// Mobile nav toggle
// ═══════════════════════════════════════════════════════════
(function() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', function() { links.classList.toggle('open'); });
})();
