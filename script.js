/* ------------------------------------------------------------------
   EDIT THIS PART. Everything on the page comes from this one object.
   Replace the placeholder text with your own, save, and refresh.
------------------------------------------------------------------- */
var CONFIG = {
  name: 'Simran Rekhi',                    // shown big in the hero
  tagline: 'Write one sentence about what you do and what you care about.',
  badge: 'hello • hello • hello • hello • ', // text around the spinning circle
  githubUser: 'HelloSimi',                 // projects are loaded from this GitHub account
  sections: {                              // true = show, false = hide (the text below is kept either way)
    tagline: false,
    about: false,
    skills: false,
    projects: true,
    contact: true
  },
  photo: true,                             // portrait photo; works even when the About text is hidden
  pinned: [],                              // repository names to show first, e.g. ['my-best-project']
  hideRepos: [],                           // repository names to leave out
  about: [
    'Write two or three sentences about yourself here: who you are, what you are learning or building, and what you want to do next.',
    'A second short paragraph is optional.'
  ],
  skills: [
    { title: 'Skill or service one', text: 'One line about what this means in practice.' },
    { title: 'Skill or service two', text: 'One line about what this means in practice.' },
    { title: 'Skill or service three', text: 'One line about what this means in practice.' }
  ],
  contactText: 'Add how people can reach you.',
  links: [
    { label: 'GitHub', url: 'https://github.com/HelloSimi' }
    // { label: 'Email', url: 'mailto:you@example.com' },
    // { label: 'LinkedIn', url: 'https://www.linkedin.com/in/your-name' }
  ]
};
/* ------------------------------------------------------------------ */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (id) { return document.getElementById(id); };
  document.documentElement.classList.add('js');

  /* page title and sharing text come from CONFIG */
  var pageTitle = CONFIG.name + ' · Portfolio';
  document.title = pageTitle;
  $('logo').textContent = (CONFIG.name.trim().charAt(0) || 'h').toLowerCase();
  $('badge-text').textContent = CONFIG.badge;
  $('foot').textContent = '© ' + new Date().getFullYear() + ' ' + CONFIG.name;

  /* name, split into letters that decode on load and wobble when touched */
  var nameEl = $('name');
  var letters = [];
  nameEl.setAttribute('aria-label', CONFIG.name);
  CONFIG.name.split('').forEach(function (ch, i) {
    var s = document.createElement('span');
    s.className = 'ch';
    s.setAttribute('aria-hidden', 'true');
    s.textContent = ch === ' ' ? ' ' : ch;
    letters.push({ el: s, ch: ch });
    s.addEventListener('pointerenter', function () {
      if (reduceMotion) return;
      s.classList.remove('wob');
      void s.offsetWidth;
      s.classList.add('wob');
    });
    nameEl.appendChild(s);
  });

  /* each letter flickers through random glyphs, then settles; total under 1.2s.
     Widths are fixed first so the line does not jiggle while glyphs change. */
  function decodeName() {
    var glyphs = 'abcdefghijklmnopqrstuvwxyz0123456789<>/_-+*=#';
    letters.forEach(function (l) { l.el.style.width = l.el.offsetWidth + 'px'; });
    if (reduceMotion) { letters.forEach(function (l) { l.el.classList.add('on'); }); return; }
    var start = performance.now();
    (function frame(now) {
      var t = now - start, done = true;
      letters.forEach(function (l, i) {
        var settle = 350 + i * Math.min(60, 800 / letters.length);
        if (l.ch === ' ' || t >= settle) {
          if (l.ch !== ' ' && l.el.textContent !== l.ch) l.el.textContent = l.ch;
          l.el.classList.remove('scr');
        } else {
          done = false;
          if (t > i * 25) {
            l.el.classList.add('on', 'scr');
            l.el.textContent = glyphs.charAt(Math.floor(Math.random() * glyphs.length));
          }
        }
        if (t >= i * 25) l.el.classList.add('on');
      });
      if (!done) requestAnimationFrame(frame);
    })(start);
  }
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(decodeName);

  /* optional parts: a part that is off or empty is removed from the page entirely */
  var flags = CONFIG.sections || {};
  var has = function (v) { return !!(v && (typeof v === 'string' ? v.trim() : v.length)); };
  var on = {
    tagline: flags.tagline && has(CONFIG.tagline),
    about: flags.about && has(CONFIG.about),
    skills: flags.skills && has(CONFIG.skills),
    projects: !!flags.projects,
    contact: flags.contact && (has(CONFIG.contactText) || has(CONFIG.links))
  };
  function drop(el) { if (el && el.parentNode) el.parentNode.removeChild(el); }

  var blurb = on.tagline ? CONFIG.tagline.trim() : 'Portfolio of ' + CONFIG.name + '.';
  [['name', 'description'], ['property', 'og:title'], ['property', 'og:description']].forEach(function (m) {
    var tag = document.querySelector('meta[' + m[0] + '="' + m[1] + '"]');
    if (tag) tag.setAttribute('content', m[1] === 'og:title' ? pageTitle : blurb);
  });

  if (on.tagline) $('tagline').textContent = CONFIG.tagline; else drop($('tagline'));

  var photoFig = document.querySelector('.photo');
  if (!on.about) {
    drop($('about'));
    if (CONFIG.photo) {
      var portrait = document.createElement('section');
      portrait.className = 'portrait';
      portrait.setAttribute('aria-label', 'Portrait of ' + CONFIG.name);
      portrait.appendChild(photoFig);
      document.querySelector('.hero').insertAdjacentElement('afterend', portrait);
    }
  } else {
    if (CONFIG.photo) $('about').querySelector('.about-wrap').classList.add('has-photo'); else drop(photoFig);
    CONFIG.about.forEach(function (t) {
      var p = document.createElement('p');
      p.textContent = t;
      $('about-body').appendChild(p);
    });
  }

  if (!on.skills) drop($('work'));
  if (!on.projects) drop($('projects'));
  if (!on.contact) drop($('contact'));
  else if (has(CONFIG.contactText)) $('contact-text').textContent = CONFIG.contactText;
  else drop($('contact-text'));

  var cta = document.querySelector('.cta');
  if (!on.projects) {
    if (on.contact) { cta.setAttribute('href', '#contact'); cta.textContent = 'Get in touch'; }
    else drop(cta);
  }

  var nav = document.querySelector('.top nav');
  nav.querySelectorAll('a').forEach(function (a) {
    if (!$(a.getAttribute('href').slice(1))) drop(a);
  });
  if (!nav.children.length) drop(nav);

  (on.skills ? CONFIG.skills : []).forEach(function (s) {
    var li = document.createElement('li');
    var h = document.createElement('h3');
    var p = document.createElement('p');
    h.textContent = s.title;
    p.textContent = s.text;
    li.appendChild(h);
    li.appendChild(p);
    $('skills').appendChild(li);
  });

  (on.contact ? CONFIG.links : []).forEach(function (l) {
    var li = document.createElement('li');
    var a = document.createElement('a');
    a.href = l.url;
    a.textContent = l.label;
    if (/^https?:/.test(l.url)) { a.target = '_blank'; a.rel = 'me noopener'; a.appendChild(el('span', 'sr-only', ' (opens in a new tab)')); }
    li.appendChild(a);
    $('links').appendChild(li);
  });

  /* sections reveal with staggered children when scrolled into view */
  var blocks = document.querySelectorAll('.block, .portrait');
  blocks.forEach(function (b) {
    var items = b.matches('.portrait') ? [b.firstElementChild] : [b.querySelector('h2')].concat(
      Array.prototype.slice.call(b.querySelector('.block-body').children).reduce(function (all, el) {
        return all.concat(el.matches('.skills, .links') ? Array.prototype.slice.call(el.children) : [el]);
      }, []));
    items.forEach(function (el, i) { if (!el) return; el.classList.add('rv'); el.style.setProperty('--d', i); });
  });
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    blocks.forEach(function (b) { io.observe(b); });
  } else {
    blocks.forEach(function (b) { b.classList.add('in'); });
  }

  /* light / dark toggle; the saved choice was already applied in <head> */
  var root = document.documentElement;
  var toggle = $('theme-toggle');
  var themeColor = document.querySelector('meta[name="theme-color"]');
  function showTheme() {
    var dark = root.getAttribute('data-theme') !== 'light';
    toggle.setAttribute('aria-pressed', dark ? 'true' : 'false');
    if (themeColor) themeColor.setAttribute('content', dark ? '#0b1020' : '#f5f7fd');
  }
  showTheme();
  toggle.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    if (!reduceMotion) {
      root.classList.add('theme-fade');
      setTimeout(function () { root.classList.remove('theme-fade'); }, 450);
    }
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    showTheme();
  });
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function (e) {
    var saved = null;
    try { saved = localStorage.getItem('theme'); } catch (err) {}
    if (saved) return;
    root.setAttribute('data-theme', e.matches ? 'light' : 'dark');
    showTheme();
  });

  /* pointer effects: glow, avatar parallax, magnetic button. Fine pointers only. */
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var art = document.querySelector('.hero-art');
  var glow = document.querySelector('.glow');
  var ptr = { x: 0, y: 0, raf: 0 };
  function tick() {
    ptr.raf = 0;
    glow.style.transform = 'translate3d(' + ptr.x + 'px,' + ptr.y + 'px,0)';
    art.style.setProperty('--px', ((ptr.x / innerWidth - 0.5) * 16).toFixed(1) + 'px');
    art.style.setProperty('--py', ((ptr.y / innerHeight - 0.5) * 12).toFixed(1) + 'px');
    if (cta.parentNode) {
      var r = cta.getBoundingClientRect(), dx = ptr.x - (r.left + r.width / 2), dy = ptr.y - (r.top + r.height / 2);
      var near = Math.hypot(dx, dy) < r.width / 2 + 70;
      cta.style.setProperty('--mx', near ? (dx * 0.25).toFixed(1) + 'px' : '0px');
      cta.style.setProperty('--my', near ? (dy * 0.35).toFixed(1) + 'px' : '0px');
    }
  }
  if (fine && !reduceMotion) {
    window.addEventListener('pointermove', function (e) {
      ptr.x = e.clientX; ptr.y = e.clientY;
      glow.classList.add('on');
      if (!ptr.raf) ptr.raf = requestAnimationFrame(tick);
    }, { passive: true });
    document.documentElement.addEventListener('pointerleave', function () { glow.classList.remove('on'); });
  }

  /* thin scroll progress bar */
  var bar = document.querySelector('.progress');
  var barRaf = 0;
  function progress() {
    barRaf = 0;
    var max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, scrollY / max) : 0) + ')';
  }
  window.addEventListener('scroll', function () { if (!barRaf) barRaf = requestAnimationFrame(progress); }, { passive: true });
  window.addEventListener('resize', progress);
  progress();

  /* stop the ambient animation while the tab is hidden */
  document.addEventListener('visibilitychange', function () {
    document.documentElement.classList.toggle('paused', document.hidden);
  });

  /* projects from GitHub */
  var list = $('repo-list');
  if (!list) return;
  var profileUrl = 'https://github.com/' + encodeURIComponent(CONFIG.githubUser);
  var CACHE_KEY = 'repos:' + CONFIG.githubUser.toLowerCase();
  var CACHE_MS = 10 * 60 * 1000;
  var chipBox = null;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }
  function readCache() {
    try {
      var c = JSON.parse(sessionStorage.getItem(CACHE_KEY));
      if (c && Array.isArray(c.repos) && Date.now() - c.t < CACHE_MS) return c.repos;
    } catch (e) {}
    return null;
  }
  function writeCache(repos) {
    try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), repos: repos })); } catch (e) {}
  }
  function slim(r) {
    return {
      name: r.name, html_url: r.html_url, description: r.description, language: r.language,
      stars: r.stargazers_count || 0, fork: !!r.fork, pushed: r.pushed_at || r.updated_at
    };
  }

  function setStatus(node) {
    list.innerHTML = '';
    list.removeAttribute('aria-busy');
    if (chipBox) { drop(chipBox); chipBox = null; }
    var li = el('li', 'repo-status');
    li.appendChild(node);
    list.appendChild(li);
  }
  function profileLink() {
    var a = el('a', null, 'github.com/' + CONFIG.githubUser);
    a.href = profileUrl; a.target = '_blank'; a.rel = 'noopener';
    a.appendChild(el('span', 'sr-only', ' (opens in a new tab)'));
    return a;
  }
  function showError(limited) {
    var p = el('p', 'repo-note', limited
      ? 'GitHub is limiting requests for a moment, so projects cannot load right now. Try again in a few minutes, or see them at '
      : 'Projects could not be loaded right now. You can see them at ');
    p.appendChild(profileLink());
    p.appendChild(document.createTextNode('.'));
    setStatus(p);
  }
  function showEmpty() {
    var box = el('div', 'empty');
    box.innerHTML = '<svg viewBox="0 0 120 80" aria-hidden="true"><path class="e-line" d="M20 60 H60 V20 H100"/><circle class="e-node" cx="20" cy="60" r="6"/><circle class="e-node" cx="60" cy="20" r="6"/><circle class="e-pulse" cx="100" cy="20" r="6"/></svg>';
    box.appendChild(el('p', null, 'Projects will show up here automatically after the first public repository is created.'));
    setStatus(box);
  }
  function showSkeleton() {
    list.innerHTML = '';
    list.setAttribute('aria-busy', 'true');
    list.appendChild(el('li', 'sr-only', 'Loading projects from GitHub…'));
    for (var i = 0; i < 3; i++) {
      var li = el('li', 'repo skel');
      li.setAttribute('aria-hidden', 'true');
      li.innerHTML = '<span class="bar w40"></span><span class="bar w90"></span><span class="bar w25"></span>';
      list.appendChild(li);
    }
  }

  function card(repo, i) {
    var li = el('li', 'repo');
    li.style.setProperty('--i', i);
    var a = el('a');
    a.href = repo.html_url; a.target = '_blank'; a.rel = 'noopener';
    a.appendChild(el('span', 'repo-name', repo.name));
    a.appendChild(el('span', 'sr-only', ' (opens in a new tab)'));
    if (repo.description) a.appendChild(el('span', 'repo-desc', repo.description));
    var m = el('span', 'repo-meta');
    if (repo.language) m.appendChild(el('span', 'lang', repo.language));
    if (repo.stars) m.appendChild(el('span', 'stars', '★ ' + repo.stars));
    m.appendChild(el('span', null, 'Updated ' + new Date(repo.pushed).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })));
    a.appendChild(m);
    li.appendChild(a);
    li.dataset.lang = repo.language || '';
    if (fine && !reduceMotion) tilt(li);
    return li;
  }

  /* gentle 3D tilt with a soft highlight that follows the pointer */
  function tilt(li) {
    li.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      var r = li.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      li.style.setProperty('--ry', ((x - 0.5) * 6).toFixed(2) + 'deg');
      li.style.setProperty('--rx', ((0.5 - y) * 5).toFixed(2) + 'deg');
      li.style.setProperty('--hx', (x * 100).toFixed(0) + '%');
      li.style.setProperty('--hy', (y * 100).toFixed(0) + '%');
    });
    li.addEventListener('pointerleave', function () {
      li.style.removeProperty('--rx');
      li.style.removeProperty('--ry');
    });
  }

  /* pinned first (in the order listed), hidden ones removed, forks only when pinned */
  function arrange(repos) {
    var low = function (a) { return (a || []).map(function (n) { return String(n).toLowerCase(); }); };
    var pinned = low(CONFIG.pinned), hidden = low(CONFIG.hideRepos);
    var rest = repos.filter(function (r) {
      var n = r.name.toLowerCase();
      return hidden.indexOf(n) < 0 && pinned.indexOf(n) < 0 && !r.fork;
    });
    var first = [];
    pinned.forEach(function (n) {
      repos.forEach(function (r) { if (r.name.toLowerCase() === n && hidden.indexOf(n) < 0) first.push(r); });
    });
    return first.concat(rest).slice(0, Math.max(12, first.length));
  }

  function replay(items) {
    items.forEach(function (li, n) {
      li.style.setProperty('--i', n);
      li.style.animation = 'none';
      void li.offsetWidth;
      li.style.animation = '';
    });
  }

  function buildChips(cards) {
    var langs = [];
    cards.forEach(function (c) { if (c.dataset.lang && langs.indexOf(c.dataset.lang) < 0) langs.push(c.dataset.lang); });
    if (langs.length < 2) return;
    chipBox = el('div', 'chips');
    chipBox.setAttribute('role', 'group');
    chipBox.setAttribute('aria-label', 'Filter projects by language');
    ['All'].concat(langs).forEach(function (name, idx) {
      var b = el('button', 'chip', name);
      b.type = 'button';
      b.setAttribute('aria-pressed', idx === 0 ? 'true' : 'false');
      b.addEventListener('click', function () {
        Array.prototype.forEach.call(chipBox.children, function (o) { o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); });
        var apply = function () {
          var shown = [];
          cards.forEach(function (c) {
            var ok = idx === 0 || c.dataset.lang === name;
            c.hidden = !ok;
            if (ok) shown.push(c);
          });
          list.classList.remove('filtering');
          if (!reduceMotion) replay(shown);
        };
        if (reduceMotion) { apply(); return; }
        list.classList.add('filtering');
        setTimeout(apply, 180);
      });
      chipBox.appendChild(b);
    });
    list.parentNode.insertBefore(chipBox, list);
  }

  function render(repos) {
    var items = arrange(repos);
    if (!items.length) { showEmpty(); return; }
    list.innerHTML = '';
    list.removeAttribute('aria-busy');
    var cards = items.map(card);
    cards.forEach(function (c) { list.appendChild(c); });
    buildChips(cards);
  }

  /* cards animate in once the list is on screen */
  if ('IntersectionObserver' in window && !reduceMotion) {
    var seen = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { list.classList.add('go'); seen.disconnect(); }
    }, { threshold: 0.1 });
    seen.observe(list);
  } else {
    list.classList.add('go');
  }

  var cached = readCache();
  if (cached) { render(cached); return; }
  showSkeleton();
  fetch('https://api.github.com/users/' + encodeURIComponent(CONFIG.githubUser) + '/repos?sort=pushed&per_page=100')
    .then(function (r) {
      if (!r.ok) { var err = new Error(r.status); err.status = r.status; throw err; }
      return r.json();
    })
    .then(function (repos) {
      var data = repos.map(slim);
      writeCache(data);
      render(data);
    })
    .catch(function (err) { showError(err && (err.status === 403 || err.status === 429)); });
})();
