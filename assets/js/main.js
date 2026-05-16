// ETG site — v2 interactions

// Cursor
(function() {
  const cur = document.getElementById('cur') || document.querySelector('.cursor-dot');
  const ring = document.getElementById('cur-ring') || document.querySelector('.cursor-ring');
  if (!cur || !ring) return;

  // Hide cursor system-wide on touch devices
  if (matchMedia && matchMedia('(hover: none), (pointer: coarse)').matches) {
    cur.style.display = 'none';
    ring.style.display = 'none';
    document.body.style.cursor = 'auto';
    return;
  }

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;
  let visible = false;

  function show() {
    if (!visible) { visible = true; cur.style.opacity = '1'; ring.style.opacity = '1'; }
  }
  function hide() {
    if (visible) { visible = false; cur.style.opacity = '0'; ring.style.opacity = '0'; }
  }

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    show();
  }, { passive: true });
  document.addEventListener('mouseleave', hide);
  document.addEventListener('mouseenter', show);
  window.addEventListener('blur', hide);
  window.addEventListener('focus', show);

  // Initialize hidden until first mousemove
  cur.style.opacity = '0';
  ring.style.opacity = '0';
  cur.style.transition = 'opacity .2s, width .2s, height .2s';
  ring.style.transition = 'opacity .25s, width .28s, height .28s, border-color .25s';

  (function loop(){
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    // Use transform only — never overwrite full cssText
    cur.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  })();

  // Hover state
  function bindHover(scope) {
    scope.querySelectorAll('a, button, [data-hover], input, textarea, select, label').forEach(el => {
      if (el.dataset.curBound) return;
      el.dataset.curBound = '1';
      el.addEventListener('mouseenter', () => document.body.classList.add('ch'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('ch'));
    });
  }
  bindHover(document);
  // Re-bind on DOM changes (in case content loads later)
  const mo = new MutationObserver(() => bindHover(document));
  mo.observe(document.body, { childList: true, subtree: true });
})();

// Hero slideshow
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
    if (counter) counter.textContent = `${String(cur+1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;
  }
  dots.forEach(d => d.addEventListener('click', () => goTo(+d.dataset.idx)));
  setInterval(() => goTo((cur+1) % slides.length), 5500);
})();

// Reveal on scroll
(function() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: .08 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();

// Mobile nav toggle
(function() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => links.classList.toggle('open'));
})();
