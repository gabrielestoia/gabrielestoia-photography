/* sito reportage — logica (router, tema, gallerie) */
(function () {
  var app = document.getElementById('app');

  /* ---------- tema chiaro/scuro ---------- */
  var root = document.documentElement;
  var saved = null;
  try { saved = localStorage.getItem('tema'); } catch (e) {}
  if (!saved) {
    var m = document.cookie.match(/(?:^|;\s*)tema=(dark|light)/);
    if (m) saved = m[1];
  }
  if (saved) root.setAttribute('data-theme', saved);

  var ICON_SUN  = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4.2" stroke="currentColor" stroke-width="1.8"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M19.4 4.6l-1.8 1.8M6.4 17.6l-1.8 1.8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
  var ICON_MOON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20 13.5A8 8 0 1 1 10.5 4 6.5 6.5 0 0 0 20 13.5z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>';

  var themeBtn = document.getElementById('theme-toggle');
  function paintThemeBtn() {
    var dark = root.getAttribute('data-theme') === 'dark';
    themeBtn.innerHTML = dark ? ICON_SUN : ICON_MOON;
    themeBtn.setAttribute('aria-label', dark ? 'switch to light theme' : 'switch to dark theme');
  }
  themeBtn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('tema', next); } catch (e) {}
    document.cookie = 'tema=' + next + ';path=/;max-age=31536000';
    paintThemeBtn();
  });
  paintThemeBtn();

  /* ---------- menu mobile ---------- */
  var nav = document.getElementById('site-nav');
  document.getElementById('menu-toggle').addEventListener('click', function () {
    nav.classList.toggle('open');
  });

  /* ---------- utility ---------- */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function setActive(route) {
    var links = nav.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute('href');
      links[i].classList.toggle('on',
        href === route ||
        (route.indexOf('#/stories') === 0 && href === '#/stories'));
    }
    nav.classList.remove('open');
  }

  /* ---------- viste ---------- */
  function viewHome() {
    setActive('#/');
    app.innerHTML =
      '<section class="hero">' +
        '<img src="' + SITE.hero + '" alt="">' +
        '<div class="hero-overlay">' +
          '<div class="hero-name">' + esc(SITE.name) + '</div>' +
          '<div class="hero-sub">' + esc(SITE.aboutIntro) + '</div>' +
          '<a class="hero-enter" href="#/stories">Enter the stories' +
          ' <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></a>' +
        '</div>' +
      '</section>';
  }

  function viewStories() {
    setActive('#/stories');
    var groups = {}, order = [];
    SITE.stories.forEach(function (s) {
      var g = s.group || 'Stories';
      if (!groups[g]) { groups[g] = []; order.push(g); }
      groups[g].push(s);
    });
    var html = '<div class="stories-layout"><aside class="side-index">';
    order.forEach(function (g) {
      html += '<div class="idx-group">' + esc(g) + '</div>';
      groups[g].forEach(function (s) {
        html += '<a class="story-row" data-slug="' + s.slug + '" href="#/stories/' + s.slug + '">' +
                '<span class="t">' + esc(s.title) + '</span>' +
                '<span class="m">' + esc(s.meta) + '</span></a>';
      });
    });
    html += '</aside>' +
            '<div class="side-preview" id="side-preview" title="open story">' +
            '<img src="' + SITE.stories[0].photos[0].src + '" alt=""></div></div>';
    app.innerHTML = html;

    var cur = SITE.stories[0].slug;
    var pimg = document.querySelector('#side-preview img');
    var rows = app.querySelectorAll('.story-row');
    for (var i = 0; i < rows.length; i++) {
      (function (row) {
        row.addEventListener('mouseenter', function () {
          cur = row.getAttribute('data-slug');
          for (var j = 0; j < SITE.stories.length; j++) {
            if (SITE.stories[j].slug === cur) pimg.src = SITE.stories[j].photos[0].src;
          }
        });
      })(rows[i]);
    }
    document.getElementById('side-preview').addEventListener('click', function () {
      location.hash = '#/stories/' + cur;
    });
  }

  var current = { story: null, i: 0 };

  function renderPhoto() {
    var s = current.story, p = s.photos[current.i];
    var img = document.getElementById('photo');
    img.src = p.src;
    img.alt = p.caption || s.title;
    var cap = document.getElementById('caption');
    cap.textContent = p.caption || '';
    cap.style.display = p.caption ? '' : 'none';
    document.getElementById('counter').textContent = (current.i + 1) + ' / ' + s.photos.length;
  }
  function step(d) {
    var n = current.story.photos.length;
    current.i = (current.i + d + n) % n;
    renderPhoto();
  }

  function viewStory(slug) {
    setActive('#/stories');
    var s = null;
    for (var i = 0; i < SITE.stories.length; i++) {
      if (SITE.stories[i].slug === slug) s = SITE.stories[i];
    }
    if (!s) { location.hash = '#/stories'; return; }
    current.story = s; current.i = 0;

    var photos = s.photos.map(function (p, idx) {
      return '<img src="' + p.src + '" alt="" loading="lazy" data-idx="' + idx + '" style="display:none">';
    }).join('');

    app.innerHTML =
      (s.intro ? '<div class="story-head"><p class="story-intro">' + esc(s.intro) + '</p></div>' : '') +
      '<div class="viewer">' +
        '<button class="icon-btn nav-arrow" id="prev" aria-label="previous photo">' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20 12H5M11 6l-6 6 6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
        '<div class="frame"><img id="photo" src="" alt="">' + photos +
        '<span class="cap-under" id="caption"></span></div>' +
        '<button class="icon-btn nav-arrow" id="next" aria-label="next photo">' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
        '<button class="icon-btn viewer-close" id="story-close" aria-label="close story" title="chiudi">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 5l14 14M19 5L5 19" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button>' +
      '</div>' +
      '<div class="info-bar">' +
        '<span class="ib-left">' +
          '<span class="ib-title">' + esc(s.title) + '</span>' +
          '<span class="story-meta">' + esc(s.meta) + '</span>' +
        '</span>' +
        '<span class="counter" id="counter"></span>' +
      '</div>';

    var photoEl = document.getElementById('photo');
    photoEl.addEventListener('click', function (e) {
      var r = photoEl.getBoundingClientRect();
      step(e.clientX - r.left > r.width / 2 ? 1 : -1);
    });
    photoEl.addEventListener('mousemove', function (e) {
      var r = photoEl.getBoundingClientRect();
      photoEl.style.cursor = (e.clientX - r.left > r.width / 2) ? 'e-resize' : 'w-resize';
    });
    function syncCaption() {
      var cap = document.getElementById('caption');
      if (cap) cap.style.width = photoEl.clientWidth + 'px';
    }
    photoEl.addEventListener('load', syncCaption);
    window.addEventListener('resize', syncCaption);
    syncCaption();
    renderPhoto();
    document.getElementById('prev').addEventListener('click', function () { step(-1); });
    document.getElementById('next').addEventListener('click', function () { step(1); });
    document.getElementById('story-close').addEventListener('click', function () {
      location.hash = '#/stories';
    });
  }

  document.addEventListener('keydown', function (e) {
    if (!current.story) return;
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });

  function viewPublished() {
    setActive('#/published');
    var rows = SITE.published.map(function (c) {
      return '<div class="clip"><span>' + esc(c.name) + '</span>' +
             '<span class="story-meta">' + esc(c.year) + '</span></div>';
    }).join('');
    app.innerHTML =
      '<div class="wrap">' +
        '<div class="page-title">Published</div>' +
        '<div class="page-note">Selected publications.</div>' +
        rows +
      '</div>';
  }

  function viewAbout() {
    setActive('#/about');
    app.innerHTML =
      '<div class="wrap about">' +
        '<div class="page-title">About</div>' +
        '<p>' + esc(SITE.aboutIntro) + '</p>' +
        '<p>For commissions, prints or exhibitions:<br>' +
        '<a class="mail" href="mailto:' + esc(SITE.email) + '">' + esc(SITE.email) + '</a></p>' +
      '</div>';
  }

  /* ---------- router ---------- */
  function route() {
    var h = location.hash || '#/';
    if (h === '#/' || h === '#') return viewHome();
    if (h === '#/stories') return viewStories();
    if (h.indexOf('#/stories/') === 0) return viewStory(h.slice(10));
    if (h === '#/published') return viewPublished();
    if (h === '#/about') return viewAbout();
    viewHome();
  }
  window.addEventListener('hashchange', route);
  route();
})();
