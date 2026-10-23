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

  // Tap / click a figure to view it full screen, with previous / next
  var imgs = Array.prototype.slice.call(document.querySelectorAll('figure img, .logo-stack img.tps'));
  if (!imgs.length) return;
  var box = document.createElement('div');
  box.className = 'lightbox';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.innerHTML =
    '<button class="lightbox-close" type="button" aria-label="Close">×</button>' +
    '<button class="lightbox-nav prev" type="button" aria-label="Previous image">‹</button>' +
    '<div class="lightbox-scroll"><img alt=""></div>' +
    '<button class="lightbox-nav next" type="button" aria-label="Next image">›</button>' +
    '<p class="lightbox-cap"></p><p class="lightbox-count"></p>';
  document.body.appendChild(box);
  var big = box.querySelector('img'), cap = box.querySelector('.lightbox-cap'),
      count = box.querySelector('.lightbox-count'),
      prev = box.querySelector('.prev'), next = box.querySelector('.next');
  var group = [], idx = 0;

  // Photos in the same gallery browse together; other figures browse with the rest of the page
  function groupFor(img) {
    var g = img.closest('.gallery');
    return g ? imgs.filter(function (i) { return g.contains(i); })
             : imgs.filter(function (i) { return !i.closest('.gallery'); });
  }
  function show(i) {
    idx = (i + group.length) % group.length;
    var img = group[idx];
    big.src = img.currentSrc || img.src;
    big.alt = img.alt;
    var fc = img.closest('figure') && img.closest('figure').querySelector('figcaption');
    cap.textContent = fc ? fc.textContent : img.alt;
    var many = group.length > 1;
    prev.style.display = next.style.display = many ? '' : 'none';
    count.textContent = many ? (idx + 1) + ' / ' + group.length : '';
  }
  function open(img) {
    group = groupFor(img);
    show(group.indexOf(img));
    box.classList.add('show'); document.body.classList.add('no-scroll');
  }
  function close() { box.classList.remove('show'); document.body.classList.remove('no-scroll'); }

  imgs.forEach(function (img) {
    img.classList.add('zoomable');
    img.setAttribute('tabindex', '0');
    img.addEventListener('click', function (e) { e.preventDefault(); open(img); });
    img.addEventListener('keydown', function (e) { if (e.key === 'Enter') open(img); });
  });
  prev.addEventListener('click', function (e) { e.stopPropagation(); show(idx - 1); });
  next.addEventListener('click', function (e) { e.stopPropagation(); show(idx + 1); });
  big.addEventListener('click', function (e) { e.stopPropagation(); });
  box.addEventListener('click', close);
  document.addEventListener('keydown', function (e) {
    if (!box.classList.contains('show')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(idx - 1);
    else if (e.key === 'ArrowRight') show(idx + 1);
  });
  // Swipe left / right on phones
  var x0 = null;
  box.addEventListener('touchstart', function (e) { if (e.touches.length === 1) x0 = e.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0; x0 = null;
    if (Math.abs(dx) > 50 && group.length > 1) show(idx + (dx < 0 ? 1 : -1));
  });
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
