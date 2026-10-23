/* Site-wide behaviour: mobile menu + tap-to-enlarge figures */
(function () {
  // ☰ mobile menu
  var btn = document.querySelector('.menu-toggle');
  var nav = document.getElementById('site-nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
  }

  // Tap / click a figure to view it full screen
  var imgs = document.querySelectorAll('figure img, .logo-stack img.tps');
  if (!imgs.length) return;
  var box = document.createElement('div');
  box.className = 'lightbox';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.innerHTML = '<button class="lightbox-close" type="button" aria-label="Close">×</button>' +
                  '<div class="lightbox-scroll"><img alt=""></div><p class="lightbox-cap"></p>';
  document.body.appendChild(box);
  var big = box.querySelector('img'), cap = box.querySelector('.lightbox-cap');

  function close() { box.classList.remove('show'); document.body.classList.remove('no-scroll'); }
  function open(img) {
    big.src = img.currentSrc || img.src;
    big.alt = img.alt;
    var fc = img.closest('figure') && img.closest('figure').querySelector('figcaption');
    cap.textContent = fc ? fc.textContent : img.alt;
    box.classList.add('show'); document.body.classList.add('no-scroll');
  }
  imgs.forEach(function (img) {
    img.classList.add('zoomable');
    img.setAttribute('tabindex', '0');
    img.addEventListener('click', function (e) { e.preventDefault(); open(img); });
    img.addEventListener('keydown', function (e) { if (e.key === 'Enter') open(img); });
  });
  box.addEventListener('click', function (e) { if (e.target !== big) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
})();

/* Back-to-top button: appears after scrolling down, returns to the top of the page */
(function () {
  var b = document.createElement('button');
  b.className = 'to-top'; b.type = 'button'; b.setAttribute('aria-label', 'Back to top');
  b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5l-7 7 1.4 1.4L11 8.8V20h2V8.8l4.6 4.6L19 12z"/></svg><span>Top</span>';
  document.body.appendChild(b);
  function update() { b.classList.toggle('show', window.scrollY > 500); }
  window.addEventListener('scroll', update, { passive: true }); update();
  b.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (location.hash) history.replaceState(null, '', location.pathname + location.search);
  });
})();
