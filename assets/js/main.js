// ETG site — v2 interactions

// ═══════════════════════════════════════════════════════════
// CURSOR — bulletproof
// ═══════════════════════════════════════════════════════════
try {
  (function() {
    // Bail on touch devices BEFORE doing anything else
    if (window.matchMedia && window.matchMedia('(hover: none), (pointer: coarse)').matches) {
      document.documentElement.style.cursor = 'auto';
      if (document.body) document.body.style.cursor = 'auto';
      var existingDot = document.querySelector('.cursor-dot, #cur');
      var existingRing = document.querySelector('.cursor-ring, #cur-ring');
      if (existingDot) existingDot.style.display = 'none';
      if (existingRing) existingRing.style.display = 'none';
      return;
    }

    function init() {
      var cur = document.getElementById('cur') || document.querySelector('.cursor-dot');
      var ring = document.getElementById('cur-ring') || document.querySelector('.cursor-ring');

      // If markup is missing, CREATE the elements so cursor always exists
      if (!cur) {
        cur = document.createElement('div');
        cur.className = 'cursor-dot';
        document.body.appendChild(cur);
      }
      if (!ring) {
        ring = document.createElement('div');
        ring.className = 'cursor-ring';
        document.body.appendChild(ring);
      }

      // Re-parent to END of body so DOM stacking also favors the cursor
      // (in addition to z-index). Append puts them last among siblings.
      document.body.appendChild(ring);
      document.body.appendChild(cur);

      // Force critical styles inline — defeat any CSS shenanigans
      function applyStyles(el) {
        el.style.position = 'fixed';
        el.style.top = '0';
        el.style.left = '0';
        el.style.pointerEvents = 'none';
        el.style.zIndex = '2147483647';
        el.style.opacity = '1';
        el.style.display = 'block';
        el.style.visibility = 'visible';
        el.style.willChange = 'transform';
      }
      applyStyles(cur);
      applyStyles(ring);

      var mx = window.innerWidth / 2;
      var my = window.innerHeight / 2;
      var rx = mx, ry = my;
      var hasMoved = false;

      function track(e) {
        if (typeof e.clientX === 'number') {
          mx = e.clientX;
          my = e.clientY;
          hasMoved = true;
        }
      }
      document.addEventListener('mousemove', track, { passive: true, capture: true });
      document.addEventListener('mousedown', track, { passive: true, capture: true });
      document.addEventListener('mouseover', track, { passive: true, capture: true });
      document.addEventListener('pointermove', track, { passive: true, capture: true });
      document.addEventListener('pointerover', track, { passive: true, capture: true });

      // If the user enters the page from outside the viewport, mouse position
      // is unknown until first move. Hide until then.
      cur.style.opacity = '0';
      ring.style.opacity = '0';

      function loop() {
        try {
          rx += (mx - rx) * 0.18;
          ry += (my - ry) * 0.18;
          // translate3d forces GPU compositing — keeps cursor on its own layer
          // ABOVE any other compositing layers (image filters, will-change, etc.)
          cur.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0) translate3d(-50%,-50%,0)';
          ring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0) translate3d(-50%,-50%,0)';
          if (hasMoved && cur.style.opacity === '0') {
            cur.style.opacity = '1';
            ring.style.opacity = '1';
          }
        } catch (e) {}
        requestAnimationFrame(loop);
      }
      requestAnimationFrame(loop);

      // Hover grow effect on interactive elements
      function bindHover(root) {
        var nodes = (root || document).querySelectorAll('a, button, [data-hover], input, textarea, select, label');
        nodes.forEach(function(el) {
          if (el.__cursorBound) return;
          el.__cursorBound = true;
          el.addEventListener('mouseenter', function() { document.body.classList.add('ch'); });
          el.addEventListener('mouseleave', function() { document.body.classList.remove('ch'); });
        });
      }
      bindHover(document);

      // Re-bind to any elements added later (rare, but safe)
      var mo = new MutationObserver(function(muts) {
        for (var i = 0; i < muts.length; i++) {
          if (muts[i].addedNodes && muts[i].addedNodes.length) {
            bindHover(document);
            break;
          }
        }
      });
      mo.observe(document.body, { childList: true, subtree: true });

      // Safety net: every 2s verify the cursor is still in the DOM and visible.
      // If anything strips it (third-party scripts, etc.), restore it.
      setInterval(function() {
        if (!cur.isConnected) document.body.appendChild(cur);
        if (!ring.isConnected) document.body.appendChild(ring);
        applyStyles(cur);
        applyStyles(ring);
      }, 2000);
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
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
