// ETG site — interactions
// Custom cursor removed — using standard OS cursor everywhere.

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
