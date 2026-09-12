/* site reportage — logic (router, theme, language, galleries) */
(function () {
  var app = document.getElementById('app');
  var footer = document.getElementById('site-footer');

  /* ---------- theme ---------- */
  var root = document.documentElement;
  var saved = null;
  try { saved = localStorage.getItem('tema'); } catch (e) {}
  if (!saved) {
    var mc = document.cookie.match(/(?:^|;\s*)tema=(dark|light)/);
    if (mc) saved = mc[1];
  }
  if (saved) root.setAttribute('data-theme', saved);

  var ICON_SUN  = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4.2" stroke="currentColor" stroke-width="1.8"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M19.4 4.6l-1.8 1.8M6.4 17.6l-1.8 1.8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
  var ICON_MOON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20 13.5A8 8 0 1 1 10.5 4 6.5 6.5 0 0 0 20 13.5z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>';

  var themeBtn = document.getElementById('theme-toggle');
  function paintThemeBtn() {
    var dark = root.getAttribute('data-theme') === 'dark';
    themeBtn.innerHTML = dark ? ICON_SUN : ICON_MOON;
    themeBtn.setAttribute('title', dark ? 'light theme' : 'dark theme');
  }
  themeBtn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('tema', next); } catch (e) {}
    document.cookie = 'tema=' + next + ';path=/;max-age=31536000';
    paintThemeBtn();
  });
  paintThemeBtn();

  /* ---------- language ---------- */
  var LANG = 'en';
  try { var ls = localStorage.getItem('lang'); if (ls === 'it' || ls === 'en') LANG = ls; } catch (e) {}
  root.setAttribute('lang', LANG);

  function ui(k) { return (UI[LANG] && UI[LANG][k]) || UI.en[k] || k; }
  function T(obj, base) {
    var v = obj[base + '_' + LANG];
    if (!v) v = obj[base + '_en'];
    return v || '';
  }
  function setLang(l) {
    LANG = l;
    try { localStorage.setItem('lang', l); } catch (e) {}
    root.setAttribute('lang', l);
    var btns = document.querySelectorAll('.lang-sel button');
    for (var i = 0; i < btns.length; i++) btns[i].classList.toggle('on', btns[i].getAttribute('data-lang') === l);
    route();
  }
  (function () {
    var btns = document.querySelectorAll('.lang-sel button');
    for (var i = 0; i < btns.length; i++) {
      btns[i].classList.toggle('on', btns[i].getAttribute('data-lang') === LANG);
      (function (b) {
        b.addEventListener('click', function () { if (b.getAttribute('data-lang') !== LANG) setLang(b.getAttribute('data-lang')); });
      })(btns[i]);
    }
  })();

  /* ---------- mobile menu ---------- */
  var nav = document.getElementById('site-nav');
  document.getElementById('menu-toggle').addEventListener('click', function () {
    nav.classList.toggle('open');
  });

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function stories() { return (CONTENT && CONTENT.stories) || []; }
  function pubs() { return (CONTENT && CONTENT.publications) || []; }
  function bio() {
    if (LANG === 'it' && CONTENT.bio_it) return CONTENT.bio_it;
    return CONTENT.bio_en || '';
  }
  function itemsOf(s) {
    var raw = (s.items && s.items.length) ? s.items : [];
    var out = [];
    for (var i = 0; i < raw.length; i++) {
      var it = raw[i] || {};
      out.push({
        type: it.type === 'slide' ? 'slide' : 'photo',
        image: it.image || it.src || '',
        caption_en: it.caption_en || (typeof it.caption === 'string' ? it.caption : '') || '',
        caption_it: it.caption_it || '',
        text_en: it.text_en || '', text_it: it.text_it || ''
      });
    }
    return out;
  }
  function firstPhoto(s) {
    var its = itemsOf(s);
    for (var i = 0; i < its.length; i++) if (its[i].type === 'photo') return its[i].image;
    return '';
  }
  function coverOf(s) { return s.cover || firstPhoto(s); }
  function photoCount(s) {
    var its = itemsOf(s), n = 0;
    for (var i = 0; i < its.length; i++) if (its[i].type === 'photo') n++;
    return n;
  }
  function metaOf(s) {
    var parts = [];
    if (s.location) parts.push(s.location);
    if (s.year) parts.push(s.year);
    var n = photoCount(s);
    if (n) parts.push(n + (n === 1 ? ' photo' : ' photos'));
    return parts.join(' \u00b7 ');
  }
  function renderFooter() {
    var s = (CONTENT.socials || []).map(function (x) {
      return '<a href="' + esc(x.url) + '" target="_blank" rel="noopener">' + esc(x.name) + '</a>';
    }).join('');
    footer.innerHTML =
      '<div class="socials">' + s + '</div>' +
      '<div class="foot-text">' + esc(CONTENT.footer || '') + '</div>';
  }
  function setActive(route) {
    var links = nav.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute('href');
      links[i].textContent = ui(href === '#/stories' ? 'stories' : href === '#/published' ? 'published' : 'about');
      links[i].classList.toggle('on',
        href === route || (route.indexOf('#/stories') === 0 && href === '#/stories'));
    }
    nav.classList.remove('open');
  }

  /* ---------- home ---------- */
  function viewHome() {
    setActive('#/');
    var hs = stories()[0];
    var hero = hs ? coverOf(hs) : '';
    app.innerHTML =
      '<section class="hero">' +
        (hero ? '<img src="' + esc(hero) + '" alt="">' : '') +
        '<div class="hero-overlay">' +
          '<div class="hero-name">' + esc(CONTENT.name || '') + '</div>' +
          '<div class="hero-sub">' + esc(bio()) + '</div>' +
          '<a class="hero-enter" href="#/stories">' + esc(ui('enter')) +
          ' <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></a>' +
        '</div>' +
      '</section>';
  }

  /* ---------- stories sidebar ---------- */
  function viewStories() {
    setActive('#/stories');
    var list = stories();
    var groups = {}, order = [];
    list.forEach(function (s) {
      var g = s.group || ui('stories');
      if (!groups[g]) { groups[g] = []; order.push(g); }
      groups[g].push(s);
    });
    var html = '<div class="stories-layout"><aside class="side-index">';
    order.forEach(function (g) {
      html += '<div class="idx-group">' + esc(g) + '</div>';
      groups[g].forEach(function (s) {
        html += '<a class="story-row" data-slug="' + esc(s.slug) + '" href="#/stories/' + esc(s.slug) + '">' +
                '<span class="t">' + esc(T(s, 'title')) + '</span>' +
                '<span class="m">' + esc(metaOf(s)) + '</span></a>';
      });
    });
    html += '</aside>' +
            '<div class="side-preview" id="side-preview" title="' + esc(ui('open_story')) + '">' +
            (list.length ? '<img src="' + esc(coverOf(list[0])) + '" alt="">' : '') +
            '</div></div>';
    app.innerHTML = html;

    var cur = list.length ? list[0].slug : null;
    var pimg = document.querySelector('#side-preview img');
    var rows = app.querySelectorAll('.story-row');
    for (var i = 0; i < rows.length; i++) {
      (function (row) {
        row.addEventListener('mouseenter', function () {
          cur = row.getAttribute('data-slug');
          for (var j = 0; j < list.length; j++) {
            if (list[j].slug === cur && pimg) pimg.src = coverOf(list[j]);
          }
        });
      })(rows[i]);
    }
    document.getElementById('side-preview').addEventListener('click', function () {
      if (cur) location.hash = '#/stories/' + cur;
    });
  }

  /* ---------- story page ---------- */
  var current = { story: null, items: [], i: 0 };

  function renderItem() {
    var it = current.items[current.i];
    var img = document.getElementById('photo');
    var slide = document.getElementById('slide');
    var cap = document.getElementById('caption');
    if (it.type === 'slide') {
      img.style.display = 'none';
      slide.style.display = 'flex';
      slide.querySelector('p').textContent = T(it, 'text');
      cap.textContent = '';
    } else {
      slide.style.display = 'none';
      img.style.display = '';
      img.src = it.image;
      img.alt = T(it, 'caption') || T(current.story, 'title');
      cap.textContent = T(it, 'caption');
    }
    document.getElementById('counter').textContent = (current.i + 1) + ' / ' + current.items.length;
  }
  function step(d) {
    var n = current.items.length;
    current.i = (current.i + d + n) % n;
    renderItem();
  }

  function viewStory(slug) {
    setActive('#/stories');
    var s = null;
    for (var i = 0; i < stories().length; i++) {
      if (stories()[i].slug === slug) s = stories()[i];
    }
    if (!s) { location.hash = '#/stories'; return; }
    current.story = s;
    current.items = itemsOf(s);
    var dEn = (s.description_en || '').trim(), dIt = (s.description_it || '').trim();
    if (dEn || dIt) {
      current.items = [{
        type: 'slide', image: '', caption_en: '', caption_it: '',
        text_en: dEn, text_it: dIt
      }].concat(current.items);
    }
    current.i = 0;

    var preloads = current.items.map(function (it, idx) {
      if (it.type !== 'photo') return '';
      return '<img src="' + esc(it.image) + '" alt="" loading="lazy" data-idx="' + idx + '" style="display:none">';
    }).join('');

    app.innerHTML =
      '<div class="viewer">' +
        '<button class="icon-btn nav-arrow" id="prev" aria-label="' + esc(ui('prev')) + '">' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20 12H5M11 6l-6 6 6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
        '<div class="frame">' +
          '<img id="photo" src="" alt="">' +
          '<div class="slide-block" id="slide" style="display:none"><p></p></div>' +
          preloads +
          '<span class="cap-under" id="caption"></span>' +
        '</div>' +
        '<button class="icon-btn nav-arrow" id="next" aria-label="' + esc(ui('next')) + '">' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
        '<button class="icon-btn viewer-close" id="story-close" aria-label="' + esc(ui('close')) + '" title="' + esc(ui('close')) + '">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 5l14 14M19 5L5 19" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button>' +
      '</div>' +
      '<div class="info-bar">' +
        '<span class="ib-left">' +
          '<span class="ib-title">' + esc(T(s, 'title')) + '</span>' +
          '<span class="story-meta">' + esc(metaOf(s)) + '</span>' +
        '</span>' +
        '<span class="counter" id="counter"></span>' +
      '</div>';

    var photoEl = document.getElementById('photo');
    photoEl.addEventListener('click', function (e) {
      var r = photoEl.getBoundingClientRect();
      if (photoEl.style.display !== 'none') step(e.clientX - r.left > r.width / 2 ? 1 : -1);
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
    renderItem();
    syncCaption();
    document.getElementById('prev').addEventListener('click', function () { step(-1); });
    document.getElementById('next').addEventListener('click', function () { step(1); });
    document.getElementById('story-close').addEventListener('click', function () {
      location.hash = '#/stories';
    });
    document.getElementById('slide').addEventListener('click', function (e) {
      var r = e.currentTarget.getBoundingClientRect();
      step(e.clientX - r.left > r.width / 2 ? 1 : -1);
    });
  }

  document.addEventListener('keydown', function (e) {
    if (!current.story) return;
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });

  /* ---------- published ---------- */
  var curPub = 0;

  function renderPubDetail() {
    var d = document.getElementById('pub-detail');
    var list = pubs();
    if (!list.length) { d.innerHTML = '<div class="story-meta">' + esc(ui('no_pubs')) + '</div>'; return; }
    if (curPub >= list.length) curPub = 0;
    var p = list[curPub];
    var meta = [];
    if (p.story_title) meta.push(ui('from_story') + ': ' + p.story_title);
    if (p.country) meta.push(p.country);
    if (p.date) meta.push(p.date);
    var fileHtml = '';
    if (p.file) {
      if (/\.pdf$/i.test(p.file)) {
        fileHtml = '<a class="pub-file" href="' + esc(p.file) + '" target="_blank" rel="noopener">' +
                   '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg> ' +
                   esc(ui('download_pdf')) + '</a>';
      } else {
        fileHtml = '<img class="pub-img" src="' + esc(p.file) + '" alt="">';
      }
    }
    d.innerHTML =
      '<div class="pub-mag">' + esc(p.magazine || '') + '</div>' +
      '<div class="pub-title">' + esc(p.article_title || '') + '</div>' +
      '<div class="story-meta">' + esc(meta.join(' \u00b7 ')) + '</div>' +
      fileHtml;
  }

  function viewPublished() {
    setActive('#/published');
    var list = pubs();
    var rows = list.map(function (p, idx) {
      var title = p.article_title || p.magazine || '—';
      var meta = [p.magazine, p.date].filter(Boolean).join(' \u00b7 ');
      return '<a class="story-row' + (idx === curPub ? ' sel' : '') + '" data-idx="' + idx + '">' +
             '<span class="t">' + esc(title) + '</span>' +
             '<span class="m">' + esc(meta) + '</span></a>';
    }).join('');
    app.innerHTML =
      '<div class="stories-layout">' +
        '<aside class="side-index">' +
          '<div class="idx-group">' + esc(ui('published')) + '</div>' + rows +
        '</aside>' +
        '<div class="side-preview pub-detail" id="pub-detail"></div>' +
      '</div>';
    var rowEls = app.querySelectorAll('.story-row');
    for (var i = 0; i < rowEls.length; i++) {
      (function (row) {
        row.addEventListener('click', function () {
          curPub = parseInt(row.getAttribute('data-idx'), 10) || 0;
          for (var j = 0; j < rowEls.length; j++) rowEls[j].classList.remove('sel');
          row.classList.add('sel');
          renderPubDetail();
        });
      })(rowEls[i]);
    }
    renderPubDetail();
  }

  /* ---------- about ---------- */
  function viewAbout() {
    setActive('#/about');
    app.innerHTML =
      '<div class="wrap about">' +
        '<div class="page-title">' + esc(ui('about')) + '</div>' +
        '<p>' + esc(bio()) + '</p>' +
        '<p>' + esc(ui('commissions')) + '<br>' +
        '<a class="mail" href="mailto:' + esc(CONTENT.email || '') + '">' + esc(CONTENT.email || '') + '</a></p>' +
      '</div>';
  }

  /* ---------- router + boot ---------- */
  var CONTENT = null;

  function route() {
    if (!CONTENT) return;
    renderFooter();
    var h = location.hash || '#/';
    if (h === '#/' || h === '#') return viewHome();
    if (h === '#/stories') return viewStories();
    if (h.indexOf('#/stories/') === 0) return viewStory(h.slice(10));
    if (h === '#/published') return viewPublished();
    if (h === '#/about') return viewAbout();
    viewHome();
  }
  window.addEventListener('hashchange', route);

  function byOrder(a, b) { return (Number(a.order) || 999) - (Number(b.order) || 999); }

  var bust = '?v=' + Date.now();
  Promise.all([
    fetch('content/settings.json' + bust),
    fetch('content/bundle.json' + bust)
  ]).then(function (rs) {
    return Promise.all(rs.map(function (r) { if (!r.ok) throw new Error('missing'); return r.json(); }));
  }).then(function (js) {
    CONTENT = Object.assign({}, js[0], js[1]);
    CONTENT.stories = (CONTENT.stories || []).slice().sort(byOrder);
    CONTENT.publications = (CONTENT.publications || []).slice().sort(byOrder);
    route();
  }).catch(function () {
    CONTENT = JSON.parse(JSON.stringify(SITE));
    CONTENT.stories = (CONTENT.stories || []).slice().sort(byOrder);
    CONTENT.publications = (CONTENT.publications || []).slice().sort(byOrder);
    route();
  });
})();
