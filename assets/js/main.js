// ETG site — v2 interactions

// Cursor
(function() {
  const cur = document.getElementById('cur') || document.querySelector('.cursor-dot');
  const ring = document.getElementById('cur-ring') || document.querySelector('.cursor-ring');
  if (!cur || !ring) return;
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; });
  (function loop(){
    rx += (mx-rx)*.13;
    ry += (my-ry)*.13;
    cur.style.cssText = `left:${mx}px;top:${my}px`;
    ring.style.cssText = `left:${rx}px;top:${ry}px`;
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll('a, button, .hero-dot, [data-hover]').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('ch'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('ch'));
  });
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
