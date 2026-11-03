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
    treks: false,
    projects: true,
    contact: true
  },
  photo: true,                             // portrait photo; works even when the About text is hidden
  treks: [                                 // walks and treks, shown when sections.treks is true
    // { place: 'Trail or peak name', note: 'One short line about it.', year: '2024' }
  ],
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
    treks: flags.treks && has(CONFIG.treks),
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

  /* the cut-out now stands at the camp beside her avatar; when About is on, the framed photo
     also sits beside that text. With photo off, the avatar keeps camp on her own. */
  var photoFig = document.querySelector('.photo');
  var portrait = $('portrait');
  var first = CONFIG.name.trim().split(/\s+/)[0] || CONFIG.name;
  if (!on.about) drop($('about'));
  if (!CONFIG.photo) {
    drop(photoFig);
    document.querySelectorAll('.camp-person, .p-only').forEach(drop);
    $('camp-title').textContent = 'Cartoon of ' + first + ' in a mountain valley, roaming between the forest, her campfire and the river';
  } else {
    $('camp-title').textContent = first + ' and her cartoon avatar in a mountain valley, roaming between the forest, their campfire and the river';
    if (on.about) {
      var wrap = $('about').querySelector('.about-wrap');
      wrap.classList.add('has-photo');
      wrap.insertBefore(photoFig, $('about-body'));
    }
  }
  drop(portrait);
  if (on.about) CONFIG.about.forEach(function (t) {
    var p = document.createElement('p');
    p.textContent = t;
    $('about-body').appendChild(p);
  });

  if (!on.skills) drop($('work'));
  if (!on.treks) drop($('treks'));
  else CONFIG.treks.forEach(function (t) {
    var li = document.createElement('li');
    var gear = ['icon-boot', 'icon-pack', 'icon-lantern'];
    li.innerHTML = '<svg class="gi" aria-hidden="true" focusable="false"><use href="#' + gear[$('trek-list').children.length % 3] + '"/></svg>';
    var mid = el('div');
    mid.appendChild(el('span', 'trek-place', t.place || ''));
    if (t.note) mid.appendChild(el('span', 'trek-note', t.note));
    li.appendChild(mid);
    if (t.year) li.appendChild(el('span', 'trek-year', String(t.year)));
    $('trek-list').appendChild(li);
  });
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

  /* ridge and pine silhouettes stand in for plain rules between the sections that survived */
  var shown = document.querySelectorAll('main .block');
  for (var di = 1; di < shown.length; di++) {
    shown[di].insertAdjacentElement('beforebegin', divider(di));
  }
  if (shown.length) document.querySelector('.foot').insertAdjacentElement('beforebegin', divider(shown.length));
  function divider(i) {
    var t = $(i % 2 ? 'div-pine' : 'div-ridge');
    var holder = document.createElement('div');
    holder.className = 'divider';
    holder.setAttribute('aria-hidden', 'true');
    if (t) holder.appendChild(t.content.cloneNode(true));
    return holder;
  }

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
        return all.concat(el.matches('.skills, .links, .treks') ? Array.prototype.slice.call(el.children) : [el]);
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

  /* a few small flakes drifting behind the hero */
  var snowRefresh = null;
  (function setupSnow() {
    var canvas = $('snow');
    if (!canvas) return;
    if (reduceMotion) { drop(canvas); return; }
    var band = document.querySelector('.scene-band');
    var ctx = canvas.getContext('2d');
    var flakes = [], w = 0, h = 0, raf = 0, last = 0, onScreen = true;
    var tones = ['169, 201, 226', '207, 226, 242'];

    function readColors() {
      var cs = getComputedStyle(document.documentElement);
      ['--snow-a', '--snow-b'].forEach(function (name, i) {
        var v = cs.getPropertyValue(name).trim();
        if (v) tones[i] = v;
      });
    }
    function flake(y) {
      return {
        x: Math.random() * w,
        y: y,
        r: 0.9 + Math.random() * 1.5,
        fall: 9 + Math.random() * 15,
        sway: 5 + Math.random() * 9,
        phase: Math.random() * Math.PI * 2,
        tone: Math.random() < 0.5 ? 0 : 1,
        alpha: 0.35 + Math.random() * 0.4
      };
    }
    function size() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = band.clientWidth;
      h = band.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.max(8, Math.min(30, Math.round(w / 40)));
      while (flakes.length > count) flakes.pop();
      while (flakes.length < count) flakes.push(flake(Math.random() * h));
    }
    function draw(now) {
      raf = requestAnimationFrame(draw);
      var dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < flakes.length; i++) {
        var f = flakes[i];
        f.y += f.fall * dt;
        f.phase += dt;
        if (f.y - f.r > h) { flakes[i] = flake(-4); continue; }
        ctx.beginPath();
        ctx.arc(f.x + Math.sin(f.phase) * f.sway, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + tones[f.tone] + ', ' + f.alpha + ')';
        ctx.fill();
      }
    }
    function run(go) {
      if (go && !raf) { last = performance.now(); raf = requestAnimationFrame(draw); }
      if (!go && raf) { cancelAnimationFrame(raf); raf = 0; }
    }

    readColors();
    size();
    run(true);
    snowRefresh = readColors;

    if (window.ResizeObserver) new ResizeObserver(size).observe(band);
    else window.addEventListener('resize', size);
    document.addEventListener('visibilitychange', function () { run(!document.hidden && onScreen); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        onScreen = entries[0].isIntersecting;
        run(onScreen && !document.hidden);
      }).observe(band);
    }
  })();

  /* time of day: Day (light), Evening or Night (dark). The saved choice was applied in <head>;
     the stored values stay "light" and "dark" so the 404 page keeps reading them. */
  var root = document.documentElement;
  var themeColor = document.querySelector('meta[name="theme-color"]');
  var BAR = { light: '#fbfaff', evening: '#2a2233', dark: '#241f2e' };
  var radios = document.querySelectorAll('#daytime input');
  var badge = document.querySelector('.badge');
  var fadeTimer = 0, orbRaf = 0;
  function mode() { var m = root.getAttribute('data-theme'); return BAR[m] ? m : 'light'; }
  function showTheme() {
    var m = mode();
    radios.forEach(function (r) { r.checked = r.value === m; });
    if (themeColor) themeColor.setAttribute('content', BAR[m]);
  }
  /* the sun or moon glides from where it was to its new place along a raised arc */
  function travel(from) {
    if (!badge || !from) return;
    cancelAnimationFrame(orbRaf);
    badge.style.transform = '';
    var to = badge.getBoundingClientRect(), dx = from.left - to.left, dy = from.top - to.top;
    var rise = Math.min(160, 50 + Math.hypot(dx, dy) * 0.35), start = performance.now();
    (function step(now) {
      var u = Math.min(1, (now - start) / 1100), w = u * u * (3 - 2 * u);
      badge.style.transform = 'translate(' + (dx * (1 - w)).toFixed(1) + 'px, ' + (dy * (1 - w) - rise * Math.sin(Math.PI * w)).toFixed(1) + 'px)';
      if (u < 1) orbRaf = requestAnimationFrame(step); else badge.style.transform = '';
    })(start);
  }
  function setMode(m) {
    if (m === mode()) return;
    var from = !reduceMotion && badge ? badge.getBoundingClientRect() : null;   // mid-flight too
    if (!reduceMotion) {
      root.classList.add('tod-fade');
      clearTimeout(fadeTimer);
      fadeTimer = setTimeout(function () { root.classList.remove('tod-fade'); }, 1300);
    }
    root.setAttribute('data-theme', m);
    try { localStorage.setItem('theme', m); } catch (e) {}
    showTheme();
    if (from) travel(from);
    if (snowRefresh) snowRefresh();
  }
  showTheme();
  radios.forEach(function (r) {
    r.addEventListener('change', function () { if (r.checked) setMode(r.value); });
  });

  /* the main button leans toward a nearby pointer. Fine pointers only. */
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var ptr = { x: 0, y: 0, raf: 0 };
  function tick() {
    ptr.raf = 0;
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
      if (!ptr.raf) ptr.raf = requestAnimationFrame(tick);
    }, { passive: true });
  }

  /* the walker climbs the trail as the page scrolls, and the ridge drifts a little */
  var trail = document.querySelector('.trail');
  var scene = document.querySelector('.hero-scene');
  var header = document.querySelector('.top');
  var hero = document.querySelector('.hero');
  var sceneBand = document.querySelector('.scene-band');
  var scrollRaf = 0;
  function progress() {
    scrollRaf = 0;
    var max = document.documentElement.scrollHeight - innerHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    trail.style.setProperty('--p', p.toFixed(4));
    if (header && hero) header.classList.toggle('on-sky', window.scrollY < hero.offsetHeight - header.offsetHeight * 2);
    if (trekTrail) {
      /* boot prints appear as the ground line climbs into view */
      var g = sceneBand.getBoundingClientRect();
      var seen = reduceMotion ? 1 : (innerHeight - g.bottom) / Math.max(1, innerHeight * 0.55) + 0.35;
      trekTrail.style.setProperty('--draw', Math.min(1, Math.max(0, seen)).toFixed(3));
    }
    if (scene && !reduceMotion) {
      /* 0 at the top of the page, 1 once the band has scrolled by its own height */
      var moved = Math.min(1.4, Math.max(0, window.scrollY / Math.max(1, sceneBand.offsetHeight)));
      hero.style.setProperty('--sy', moved.toFixed(3));
    }
  }

  var trekTrail = document.querySelector('.trek-trail');

  /* the compass needle settles the first time the footer comes into view */
  var compass = document.querySelector('.compass');
  if (compass) {
    if (reduceMotion || !('IntersectionObserver' in window)) compass.classList.add('in');
    else {
      var cio = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { compass.classList.add('in'); cio.disconnect(); }
      }, { threshold: 0.4 });
      cio.observe(compass);
    }
  }

  /* the camp only burns while it is on screen */
  if (sceneBand && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      sceneBand.classList.toggle('band-rest', !entries[0].isIntersecting);
    }).observe(sceneBand);
  }
  window.addEventListener('scroll', function () { if (!scrollRaf) scrollRaf = requestAnimationFrame(progress); }, { passive: true });
  window.addEventListener('resize', progress);
  progress();

  /* stop the ambient animation while the tab is hidden */
  document.addEventListener('visibilitychange', function () {
    document.documentElement.classList.toggle('paused', document.hidden);
  });

  /* life in the valley: the portrait and her cartoon avatar roam the meadow between the forest, their camp
     and the river. A small director picks what they do next from a pool of behaviours, shuffled so nothing
     comes round again too soon, with the spots, paths and timings varied every time.
     The avatar is her own artwork cut at the shoulders and hips, so it can walk, wave, reach and carry.
     The portrait is a single standing picture, so it walks with a gentle sway from the feet and holds what
     it is handed. Pose pictures listed in images/poses/poses.json, if there are any, take over while one of
     them walks, sits or talks. Everything they pass between them flies on a short arc from hand to hand.
     One requestAnimationFrame loop drives both, and it rests while the hero is off screen or the tab is hidden. */
  (function valley() {
    var stage = document.querySelector('.camp-stage');
    if (!stage) return;
    var q = function (sel) { return stage.querySelector(sel); };
    var layer = q('.depth'), fire = q('.fire');

    function clamp01(u) { return Math.min(1, Math.max(0, u)); }
    function bump(u) { return Math.sin(Math.PI * clamp01(u)); }
    function ease(u) { u = clamp01(u); return u * u * (3 - 2 * u); }
    function approach(c, target, dt, rate) { return c + (target - c) * (1 - Math.exp(-dt * rate)); }
    function rad(d) { return d * Math.PI / 180; }
    function deg(r) { return r * 180 / Math.PI; }
    function wrap(d) { while (d > 180) d -= 360; while (d <= -180) d += 360; return d; }
    function rnd(a, b) { return a + (b - a) * Math.random(); }
    function pick(list) { return list[Math.floor(Math.random() * list.length)]; }
    function chance(p) { return Math.random() < p; }
    function md(a, b) { return Math.hypot(b[0] - a[0], (b[1] - a[1]) * 2); }   // ground distance; depth counts double
    function lift(u) { return ease(u / 0.22) * ease((1 - u) / 0.22); }          // raise, hold, lower

    /* the ground plane runs from the far edge of the meadow (y 398) to the front (y 600); things shrink with distance */
    function depthK(y) { return 0.68 + 0.32 * (y - 400) / 190; }

    /* the river banks, read off the drawn shore so the walking area always matches the picture */
    function bank(sel) {
      var path = q(sel), len = path.getTotalLength(), pts = [];
      for (var i = 0; i <= 90; i++) { var p = path.getPointAtLength(len * i / 90); pts.push([p.x, p.y]); }
      return function (y) {
        for (var j = 1; j < pts.length; j++) if (pts[j][1] >= y) {
          var a = pts[j - 1], b = pts[j];
          return a[0] + (b[0] - a[0]) * (y - a[1]) / ((b[1] - a[1]) || 1);
        }
        return pts[pts.length - 1][0];
      };
    }
    var bankL = bank('.edge-l'), bankR = bank('.edge-r');

    /* the footbridge rises in a low arch, so whoever crosses walks up and over it */
    var BR = { x0: 1150, x1: 1322, y: 402, rise: 16 };
    function onBridge(x, y) { return Math.abs(y - BR.y) < 7 && x > BR.x0 && x < BR.x1; }
    function archAt(x) { return BR.rise * Math.sin(Math.PI * clamp01((x - BR.x0) / (BR.x1 - BR.x0))); }

    /* where feet may go: the meadow between the trees and the water, the trail into the forest, the bridge
       and a strip of the far bank. Camp things are ellipses to walk round: fire, log seat, bench, woodpile,
       tent, firewood stack, backpack, lantern. */
    var OBST = [[740, 500, 66, 22], [630, 516, 64, 11], [900, 532, 62, 10], [640, 454, 32, 9],
                [962, 428, 150, 16], [430, 422, 56, 8], [800, 455, 18, 6], [1102, 443, 10, 5]];
    var TRAIL = [[360, 452], [150, 404]];
    function forestEdge(y) { return Math.max(342, 352 - (y - 400) * 0.45); }
    function nearTrail(x, y) {
      var a = TRAIL[0], dx = TRAIL[1][0] - a[0], dy = TRAIL[1][1] - a[1];
      var u = clamp01(((x - a[0]) * dx + (y - a[1]) * dy) / (dx * dx + dy * dy));
      return Math.hypot(x - a[0] - dx * u, y - a[1] - dy * u) < 16;
    }
    function free(x, y) {
      if (y < 396 || y > 600 || x < 140 || x > 1400) return false;
      if (onBridge(x, y)) return true;
      if (x > bankL(y) - 22) return y < 414 && x > bankR(y) + 16;
      if (x < forestEdge(y) && !nearTrail(x, y)) return false;
      for (var i = 0; i < OBST.length; i++) {
        var o = OBST[i], ex = (x - o[0]) / (o[2] + 14), ey = (y - o[1]) / (o[3] + 5);
        if (ex * ex + ey * ey < 1) return false;
      }
      return true;
    }
    function segFree(a, b) {
      var len = md(a, b), n = Math.ceil(len / 7);
      for (var i = 1; i < n; i++) {
        var u = i / n;
        if (u * len < 10 || (1 - u) * len < 10) continue;       // a little give at either end
        if (!free(a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u)) return false;
      }
      return true;
    }
    function settle(p) {                                         // the nearest place one can actually stand
      if (free(p[0], p[1])) return p;
      for (var r = 6; r < 96; r += 6) for (var k = 0; k < 12; k++) {
        var x = p[0] + Math.cos(k * Math.PI / 6) * r, y = p[1] + Math.sin(k * Math.PI / 6) * r * 0.5;
        if (free(x, y)) return [x, y];
      }
      return p;
    }
    function jit(p, r) { return settle([p[0] + rnd(-r, r), p[1] + rnd(-r, r) * 0.4]); }

    /* waypoints round the camp; a walk goes straight when it can and otherwise takes the shortest way through these */
    var NODES = [[368, 452], [470, 470], [450, 560], [560, 578], [540, 486], [700, 582], [810, 588], [920, 584],
                 [1010, 576], [1090, 545], [1125, 486], [1150, 440], [1150, 404], [1336, 404], [1205, 588], [1180, 528],
                 [740, 452], [860, 480], [1050, 462], [600, 452], [520, 428], [300, 438], [210, 416], [800, 476],
                 [990, 520], [1158, 420], [700, 456]].filter(function (n) { return free(n[0], n[1]); });
    var LINKS = NODES.map(function (a, i) { return NODES.map(function (b, j) { return i !== j && segFree(a, b); }); });
    function route(from, to) {
      if (segFree(from, to)) return [to];
      var pts = NODES.concat([from, to]), n = pts.length, S = n - 2, G = n - 1, dist = [], prev = [], done = [], i;
      for (i = 0; i < n; i++) { dist[i] = Infinity; prev[i] = -1; done[i] = false; }
      dist[S] = 0;
      for (;;) {
        var u = -1;
        for (i = 0; i < n; i++) if (!done[i] && dist[i] < Infinity && (u < 0 || dist[i] < dist[u])) u = i;
        if (u < 0 || u === G) break;
        done[u] = true;
        for (var v = 0; v < n; v++) {
          if (done[v] || v === u || !(u < S && v < S ? LINKS[u][v] : segFree(pts[u], pts[v]))) continue;
          var d = dist[u] + md(pts[u], pts[v]);
          if (d < dist[v]) { dist[v] = d; prev[v] = u; }
        }
      }
      if (prev[G] < 0) return [to];
      var path = [];
      for (var c = G; c !== S; c = prev[c]) path.unshift(c === G ? to : jit(pts[c], 7));
      return path;
    }

    /* the two of them. Picture coordinates: the avatar is 413 x 900 with her feet at the bottom middle,
       the portrait 800 x 1200 with her feet at 445, 1180. */
    var RIG = { L: { sx: 122, hx: 80, hy: 615 }, R: { sx: 318, hx: 360, hy: 612 } };   // avatar shoulders and hands
    var PHAND = { L: [262, 640], R: [556, 625] };                                       // the portrait's hands
    function actor(sel, kind) {
      var el = q(sel);
      if (!el) return null;
      var a = {
        el: el, kind: kind, art: el.querySelector('.art'), rig: el.querySelector('.rig'), poseSet: el.querySelector('.pose-set'),
        S: kind === 'a' ? 0.185 : 0.245,       // stage units per picture pixel at the front of the meadow
        H: kind === 'a' ? 900 : 1162,           // standing height in picture pixels
        stride: kind === 'a' ? 17 : 26,         // ground covered per step at the front
        x: 0, y: 0, vx: 0, vy: 0, side: 0, phase: 0, g: 0, walking: false, path: null, vmax: 60, pace: 1,
        steps: [], si: 0, st: 0, cur: null, fired: {},
        j: { al: 0, ar: 0, lean: 0, sa: kind === 'a' ? -100 : -62, tilt: 0 }, tg: {}, rate: 7,
        d: { al: 0, ar: 0, bob: 0, rot: 0, kx: 1, ky: 1, sc: 0.2, dy: 0 },
        nodAt: -9, nodBy: 0, sitting: false, look: '', talking: false,
        poses: {}, frames: {}, pose: '', want: '', wantAt: 0, fade: 1, bubble: null, other: null
      };
      if (kind === 'a') {
        a.up = el.querySelectorAll('.up');
        a.armL = el.querySelector('.arm-l'); a.armR = el.querySelector('.arm-r');
        a.legL = el.querySelector('.leg-l'); a.legR = el.querySelector('.leg-r');
        a.lids = el.querySelectorAll('.lid');
      }
      return a;
    }
    var A = actor('.actor-a', 'a'), P = actor('.actor-p', 'p');
    if (!A) return;
    var duo = !!P, CAST = duo ? [A, P] : [A];
    if (duo) { A.other = P; P.other = A; }

    /* where a hand is on the stage this frame */
    function hand(a, side) {
      var d = a.d, ph = a.pose && a.poses[a.pose], lx, ly;
      if (ph) {
        var hp = ph.hands[(side === 'L') !== ph.flip ? 0 : 1];
        lx = (hp[0] - 0.5) * ph.w * (ph.flip ? -1 : 1) * d.kx;
        ly = -(1 - hp[1]) * ph.h * d.ky;
      } else if (a.kind === 'a') {
        var r = RIG[side], an = rad(side === 'L' ? d.al : d.ar), dx = r.hx - r.sx, dy = r.hy - 352;
        lx = r.sx + dx * Math.cos(an) - dy * Math.sin(an) - 206.5;
        ly = 352 + dx * Math.sin(an) + dy * Math.cos(an) + d.bob - 900;
      } else {
        lx = (PHAND[side][0] - 445) * d.kx;
        ly = (PHAND[side][1] - 1180) * d.ky;
      }
      var c = Math.cos(rad(d.rot)), s = Math.sin(rad(d.rot));
      return { x: a.x + (lx * c - ly * s) * d.sc, y: d.dy + (lx * s + ly * c) * d.sc };
    }
    /* the avatar's arm angle that points a hand at a spot on the stage */
    function aim(a, side, tx, ty) {
      var r = RIG[side], wx = a.x + (r.sx - 206.5) * a.d.sc, wy = a.d.dy + (352 - 900) * a.d.sc;
      var d = wrap(deg(Math.atan2(ty - wy, tx - wx) - Math.atan2(r.hy - 352, r.hx - r.sx)));
      return side === 'L' ? Math.min(150, Math.max(-40, d)) : Math.min(40, Math.max(-150, d));
    }

    /* optional pose pictures. images/poses/poses.json lists them by file name, e.g.
       { "c-walk-right-1.png": { "facing": "right", "kind": "stand", "set": "c" }, "b-sit.png": { "kind": "sit", "set": "b" } }.
       Each is a transparent picture with the feet at the bottom edge; it is shown as it is, never filtered. Sets a and c
       belong to the avatar and set b to the portrait, or a file name can start avatar- or person-, or "who" can say.
       What a picture is for comes from its name: walk-right, walk-away and walk-front (numbered ones become walk frames),
       sit, sit-talk, sit-mug, carry-wood, toast, hold-mug, wave, look-mountains, river-lean, crouch-fire, talk.
       Where two sets offer the same pose the avatar keeps set c, whose hair matches her original picture.
       A right-facing picture is mirrored to face left unless "mirror" is false. Anything missing keeps the original art. */
    var POSE_NAMES = [[/sit-talk/, 'sit-talk'], [/sit-mug/, 'sit-mug'], [/sit/, 'sit'], [/carry/, 'carry'], [/toast/, 'toast'], [/hold-mug/, 'mug'],
      [/wave/, 'wave'], [/look/, 'look'], [/lean/, 'lean'], [/crouch/, 'crouch'], [/talk|chat/, 'talk']];
    var FACES_RIGHT = { sit: 1, 'sit-talk': 1, 'sit-mug': 1, carry: 1, toast: 1, crouch: 1 };   // turned to face what they are doing
    var HANDS = {
      right: [[0.42, 0.56], [0.6, 0.56]], left: [[0.4, 0.56], [0.58, 0.56]], back: [[0.24, 0.6], [0.76, 0.6]], front: [[0.2, 0.66], [0.8, 0.66]],
      sit: [[0.3, 0.58], [0.7, 0.58]], 'sit-talk': [[0.3, 0.58], [0.85, 0.3]], 'sit-mug': [[0.62, 0.32], [0.68, 0.32]],
      carry: [[0.72, 0.5], [0.78, 0.5]], toast: [[0.5, 0.42], [0.5, 0.42]], mug: [[0.45, 0.3], [0.6, 0.3]], crouch: [[0.85, 0.5], [0.85, 0.6]], lean: [[0.4, 0.6], [0.72, 0.85]]
    };
    var POSE_H = { sit: 0.72, crouch: 0.62 };
    var ART_PROPS = { carry: ['log1', 'log2'], toast: ['stickA', 'stickP'], mug: ['mugA', 'mugP'], 'sit-mug': ['mugA', 'mugP'] };   // pictures that already show the thing in hand
    function roleOf(name, meta) {
      var n = name.replace(/^(avatar|person|[abc])-/, '').replace(/\.\w+$/, ''), f = meta.facing;
      for (var i = 0; i < POSE_NAMES.length; i++) if (POSE_NAMES[i][0].test(n)) return POSE_NAMES[i][1];
      if (f === 'sitting') return 'sit';
      if (f === 'back' || (!f && /away|back/.test(n))) return 'back';
      if (f === 'left' || (!f && /left/.test(n))) return 'left';
      if (f === 'right' || (!f && /right/.test(n))) return 'right';
      if (f === 'front' || /front|walk|stand/.test(n)) return 'front';
      return null;
    }
    function okHands(h) {
      return Array.isArray(h) && h.length === 2 && h.every(function (p) { return Array.isArray(p) && p.length === 2 && p.every(isFinite); });
    }
    function addPose(a, role, rank, src, nw, nh, meta) {
      var frames = a.frames[role] || [], base = a.poses[role];
      if (base && (!/^(right|left|back|front|sit)$/.test(role) || base.rank !== rank)) return;   // first set wins; only walks and sits get frames
      var key = frames.length ? role + '#' + frames.length : role;
      var mh = +meta.height > 0 ? +meta.height : POSE_H[role] || (meta.kind === 'sit' ? POSE_H.sit : meta.kind === 'crouch' ? POSE_H.crouch : 1);
      var h = a.H * mh, w = h * nw / nh;
      var img = document.createElementNS('http://www.w3.org/2000/svg', 'image');
      img.setAttribute('href', src);
      img.setAttribute('x', (-w / 2).toFixed(1));
      img.setAttribute('y', (-h).toFixed(1));
      img.setAttribute('width', w.toFixed(1));
      img.setAttribute('height', h.toFixed(1));
      a.poseSet.appendChild(img);
      var hands = okHands(meta.hands) ? meta.hands : HANDS[role] || HANDS.front;
      a.poses[key] = { el: img, w: w, h: h, hands: hands, flip: false, rank: rank, role: role, turns: !!FACES_RIGHT[role] && meta.mirror !== false };
      frames.push(key);
      a.frames[role] = frames;
      var twin = role === 'right' ? 'left' : role === 'left' ? 'right' : null;
      if (twin && meta.mirror !== false && (!a.frames[twin] || a.poses[a.frames[twin][0]].mirrorOf)) {
        var tk = twin + (frames.length > 1 ? '#' + (frames.length - 1) : '');
        a.poses[tk] = { el: img, w: w, h: h, hands: hands, flip: true, rank: rank, role: twin, mirrorOf: role };
        (a.frames[twin] = a.frames[twin] || []).push(tk);
      }
    }
    function loadPoses(then) {
      if (!window.fetch || location.protocol === 'file:') return;
      fetch('images/poses/poses.json', { cache: 'no-cache' })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (list) {
          if (!list || typeof list !== 'object') return;
          var queue = Object.keys(list).map(function (file) {
            var meta = list[file] && typeof list[file] === 'object' ? list[file] : {};
            var set = meta.set || file.charAt(0) + (file.charAt(1) === '-' ? '' : '?');
            var owner = meta.who === 'avatar' || /^avatar-/.test(file) || set === 'a' || set === 'c' ? A
              : meta.who === 'person' || /^person-/.test(file) || set === 'b' ? P : null;
            var role = owner && /^[\w.-]+\.(png|webp)$/i.test(file) && roleOf(file, meta);
            return role ? { file: file, meta: meta, owner: owner, role: role, rank: set === 'a' ? 1 : 0 } : null;
          }).filter(Boolean).sort(function (x, y) { return x.rank - y.rank || (x.file < y.file ? -1 : 1); });
          (function loadNext() {                        // one at a time, so the same list always gives the same result
            var it = queue.shift();
            if (!it) return;
            var img = new Image();
            img.onload = function () { addPose(it.owner, it.role, it.rank, 'images/poses/' + it.file, img.naturalWidth, img.naturalHeight, it.meta); then(); loadNext(); };
            img.onerror = loadNext;
            img.src = 'images/poses/' + it.file;
          })();
        })
        .catch(function () {});
    }
    function holding(a, keys) {
      var n = 0;
      keys.forEach(function (k) { var p = PR[k]; if (p && (p.at === a.kind + 'L' || p.at === a.kind + 'R')) n++; });
      return n;
    }
    function wantPose(a) {
      var doing = a.cur && a.cur.t === 'act' ? a.cur.a : '', p = a.poses;
      if (a.sitting) return a.talking && p['sit-talk'] ? 'sit-talk' : holding(a, ['mugA', 'mugP']) === 1 && p['sit-mug'] ? 'sit-mug' : 'sit';
      if (a.walking && a.g > 0.5 && Math.hypot(a.vx, a.vy) > 6) {
        if (a.vy < -Math.abs(a.vx) * 0.9) return 'back';
        if (a.vy > Math.abs(a.vx) * 1.4) return 'front';
        return p.carry && holding(a, ['log1', 'log2']) ? 'carry' : a.vx > 0 ? 'right' : 'left';
      }
      if (doing === 'wave' && p.wave) return 'wave';
      if (doing === 'toast' && p.toast) return 'toast';
      if (doing === 'warm' && p.crouch) return 'crouch';
      if (doing === 'dip' && p.lean) return 'lean';
      if (a.look === 'back') return p.look ? 'look' : 'back';
      if (p.mug && holding(a, ['mugA', 'mugP']) === 1) return 'mug';
      if (a.talking) return 'talk';
      return '';
    }
    function updatePose(a, t, now) {
      var w = wantPose(a), frames = a.frames[w];
      if (w && !frames) w = '';
      if (frames && frames.length > 1) w = a.walking ? frames[Math.floor(a.phase / Math.PI) % frames.length] : frames[0];
      if (w !== a.want) { a.want = w; a.wantAt = t; }
      var is = w && a.poses[w];
      var turned = is ? (is.turns ? (a.walking ? a.vx < 0 : (doingFire(a) ? FIRE[0] : a.other ? a.other.x : a.x + 1) < a.x) : is.flip) : false;
      if (w === a.pose && (!is || turned === is.flip)) return;
      if (w !== a.pose && !now && t - a.wantAt < 0.12) return;   // ignore flickers at corners
      var was = a.pose && a.poses[a.pose];
      if (was && was !== is) was.el.classList.remove('on');
      if (is) { is.flip = turned; is.el.setAttribute('transform', turned ? 'scale(-1 1)' : 'scale(1 1)'); is.el.classList.add('on'); }
      a.rig.classList.toggle('off', !!is);
      a.pose = w;
    }
    function doingFire(a) { return a.cur && a.cur.t === 'act' && /^(toast|warm|toss)$/.test(a.cur.a); }

    /* things that change hands. Each rests somewhere, is held, or is in the air between two places. */
    var PROP_S = 0.71;                        // props are drawn at the old camp's size; this matches them to the characters
    var REST = {                               // x, y, rotation, opacity, depth
      stack: [432, 371, 0, 1, 424.5], pile: [641, 421, 0, 1, 460.5], pileIn: [641, 426, 0, 0, 460.5],
      fire: [740, 478, -200, 0, 501.5], restA: [566, 520, -64, 1, 517.5], restP: [574, 521, -57, 1, 517.6],
      tent: [938, 426, 0, 0, 440.5]
    };
    function prop(sel, at) {
      var el = q(sel);
      return el ? { el: el, at: at, home: at, to: null, mal: 0, toast: 0, steam: 0, show: 1, eaten: false, z: 0,
        mallow: el.querySelector('.mallow-g'), toastEl: el.querySelector('.mallow.toast'), steamEl: el.querySelector('.steam-g') } : null;
    }
    var PR = {
      log1: prop('.pr-log1', 'stack'), log2: prop('.pr-log2', 'pile'),
      stickA: prop('.pr-stick-a', 'restA'), stickP: prop('.pr-stick-p', 'restP'),
      mugA: prop('.pr-mug-a', 'tent'), mugP: prop('.pr-mug-p', 'tent')
    };
    Object.keys(PR).forEach(function (k) { if (PR[k]) PR[k].key = k; else delete PR[k]; });
    function who(slot) { return slot.charAt(0) === 'a' ? A : P; }
    function heldIn(a, side) {
      var n = 0, slot = a.kind + side;
      for (var k in PR) if (PR[k].at === slot || PR[k].to === slot) n++;
      return n;
    }
    function anchor(where, p) {
      var r = REST[where];
      if (r) return { x: r[0], y: r[1], r: r[2], f: 1, o: r[3], s: PROP_S * depthK(r[4]), z: r[4] };
      var a = who(where), side = where.charAt(1), h = hand(a, side), s = PROP_S * depthK(a.y), z = a.y + 0.4;
      if (p.key === 'log1' || p.key === 'log2') return { x: h.x, y: h.y - 4 * s, r: a.kind === 'p' ? -6 : 0, f: 1, o: 1, s: s, z: z };
      if (p.key === 'stickA' || p.key === 'stickP') {
        var second = p.key === 'stickP' && PR.stickA && (PR.stickA.at === where || PR.stickA.to === where) ? 10 : 0;
        return { x: h.x, y: h.y, r: a.j.sa + (a.kind === 'a' && !a.pose ? a.d.al * 0.3 : a.d.rot) + second, f: 1, o: 1, s: s, z: z };
      }
      return { x: h.x + (side === 'L' ? 2 : -2) * s, y: h.y - 2 * s, r: 0, f: side === 'L' ? -1 : 1, o: 1, s: s, z: z };
    }
    function send(p, to, dur, up, done) {
      if (!p || p.at === to) return;
      p.from = p.at; p.to = to; p.t0 = clock; p.dur = dur; p.lift = up; p.done = done || null;
    }
    function place(p, dt) {
      var b = anchor(p.to || p.at, p), x = b.x, y = b.y, r = b.r, f = b.f, o = b.o, s = b.s, z = b.z;
      if (p.to) {
        var u = (clock - p.t0) / p.dur;
        if (u >= 1) {
          p.at = p.to; p.to = null;
          if (p.done) p.done();
        } else {
          var a = anchor(p.from, p), w = ease(u), m = 1 - w;
          var cx = (a.x + b.x) / 2, cy = Math.min(a.y, b.y) - p.lift;
          x = m * m * a.x + 2 * m * w * cx + w * w * b.x;
          y = m * m * a.y + 2 * m * w * cy + w * w * b.y;
          r = a.r + wrap(b.r - a.r) * w;
          f = a.f + (b.f - a.f) * w;
          s = a.s + (b.s - a.s) * w;
          z = a.z + (b.z - a.z) * w;
          o = b.o < a.o ? a.o + (b.o - a.o) * clamp01((u - 0.78) / 0.22) : a.o + (b.o - a.o) * clamp01(u / 0.3);
        }
      }
      if ((p.at === 'stack' || p.at === 'pile') && !p.to) { p.show = approach(p.show, 1, dt, 1.2); o *= p.show; }
      if (Math.abs(f) < 0.08) f = f < 0 ? -0.08 : 0.08;
      p.z = z;
      p.el.setAttribute('transform', 'translate(' + x.toFixed(2) + ' ' + y.toFixed(2) + ') rotate(' + r.toFixed(2) + ') scale(' + (f * s).toFixed(3) + ' ' + s.toFixed(3) + ')');
      if (!p.to && /^[ap][LR]$/.test(p.at)) {
        var holder = who(p.at), shown = holder.pose && holder.poses[holder.pose];
        if (shown && ART_PROPS[shown.role] && ART_PROPS[shown.role].indexOf(p.key) >= 0) o = 0;
      }
      p.el.style.opacity = o.toFixed(3);
      if (p.mallow) {
        var resting = /^rest/.test(p.to || p.at);
        if (resting && !p.to) p.eaten = false;                // a fresh marshmallow for next time
        p.mal = approach(p.mal, resting || p.eaten ? 0 : 1, dt, p.eaten ? 9 : 6);
        if (p.mal < 0.03) p.toast = 0;
        p.mallow.style.opacity = p.mal.toFixed(3);
        p.toastEl.style.opacity = p.toast.toFixed(3);
      }
      if (p.steamEl) p.steamEl.style.opacity = p.steam.toFixed(3);
    }

    /* drawing order: everything in the depth layer is sorted by where it stands on the ground. The scenery
       is put in order once; after that only the characters and what they carry move between the pieces. */
    var ITEMS = Array.prototype.map.call(layer.children, function (el) {
      var src = el === A.el ? A : P && el === P.el ? P : null;
      for (var k in PR) if (PR[k].el === el) src = PR[k];
      return { el: el, z: +(el.getAttribute('data-z') || 0), src: src };
    }).sort(function (a, b) { return a.z - b.z; });
    ITEMS.forEach(function (it) { layer.appendChild(it.el); });
    function sortDepth() {
      var i, it;
      for (i = 0; i < ITEMS.length; i++) {
        it = ITEMS[i];
        if (it.src) it.z = it.src.kind ? it.src.y + (it.src.kind === 'p' ? 0.05 : 0) : it.src.z;
      }
      var order = ITEMS.slice().sort(function (a, b) { return a.z - b.z; });
      var node = layer.firstElementChild, same = true;
      for (i = 0; i < order.length; i++, node = node && node.nextElementSibling) if (order[i].el !== node) { same = false; break; }
      if (same) return;
      for (i = order.length - 1; i >= 0; i--) {
        it = order[i];
        var next = i + 1 < order.length ? order[i + 1].el : null;
        if (it.src && it.el.nextElementSibling !== next) layer.insertBefore(it.el, next);
      }
    }

    /* speech bubbles: a small icon above the speaker, no words */
    var BUB = stage.querySelectorAll('.bubble');
    function icons(set) {
      var night = root.getAttribute('data-theme') === 'dark';
      var all = { view: [night ? 'moon' : 'sun', 'mountain', 'heart', night ? 'star' : 'mountain'], mug: ['mug', 'heart', 'mug'],
                  fire: ['fire', 'heart', night ? 'star' : 'sun'], any: [night ? 'moon' : 'sun', 'mountain', 'mug', 'heart', 'fire'] };
      return all[set] || all.any;
    }
    function say(a, icon, d) {
      var el = BUB[a === A ? 0 : 1];
      el.querySelector('.bub-ic').setAttribute('href', '#ic-' + icon);
      a.bubble = { el: el, t0: clock, d: d };
    }
    function drawBubble(a) {
      var b = a.bubble;
      if (!b) return;
      var u = clock - b.t0;
      if (u > b.d + 0.3) { b.el.style.opacity = '0'; a.bubble = null; return; }
      var k = depthK(a.y), grow = ease(u / 0.22), fadeOut = 1 - ease((u - b.d) / 0.3);
      var tall = (a.pose ? a.poses[a.pose].h : a.H) * a.d.sc * a.d.ky;
      var side = a.other && a.other.x < a.x ? -1 : 1;
      b.el.setAttribute('transform', 'translate(' + (a.x + side * 14 * k).toFixed(1) + ' ' + (a.d.dy - tall - 6 * k).toFixed(1) + ') scale(' + ((0.72 + 0.28 * grow) * k * 1.05).toFixed(3) + ')');
      b.el.style.opacity = (grow * fadeOut * a.fade).toFixed(3);
    }

    /* what one of them can be doing. Each sets where the joints want to be this frame; u runs 0 to 1. */
    var FIRE = [740, 462];
    function once(a, key, u, at, fn) { if (u >= at && !a.fired[key]) { a.fired[key] = true; fn(); } }
    function mainHand(a) { return a.kind === 'a' ? 'L' : 'R'; }
    function towards(a, x) { return x < a.x ? -1 : 1; }
    function reach(a, side, x, y, amount) {
      var key = side === 'L' ? 'al' : 'ar';
      a.tg[key] = a.tg[key] + (aim(a, side, x, y) - a.tg[key]) * amount;
    }
    function nod(a, by) { a.nodAt = clock; a.nodBy = by; }
    function stickAim(a, stick) {            // the stick's angle that holds its marshmallow over the fire
      var h = hand(a, mainHand(a));
      return deg(Math.atan2(FIRE[1] - h.y, FIRE[0] - h.x)) - (a.kind === 'a' && !a.pose ? a.d.al * 0.3 : a.d.rot);
    }
    var ACT = {
      wave: function (a, u, t) {
        if (a.kind === 'a' && !a.pose) { a.tg.ar = (-104 + 12 * Math.sin(t * 9)) * lift(u); a.rate = 10; }
        else { a.tg.tilt = 0.9 * bump(u / 0.45) - 0.7 * bump((u - 0.5) / 0.4); a.talking = true; }
      },
      take: function (a, u, t, dt, g) {      // pick something up from where it is
        var p = PR[g.prop], side = g.side || mainHand(a);
        if (!p) return;
        var from = p.to ? null : anchor(p.at, p);
        if (from) {
          if (a.kind === 'a') { a.tg.lean = towards(a, from.x) * 6 * bump(u); reach(a, side, from.x, from.y, bump(u)); }
          else a.tg.tilt = towards(a, from.x) * 1.4 * bump(u);
        }
        once(a, 'take', u, 0.5, function () { send(p, a.kind + side, 0.35, 4); });
      },
      take2: function (a, u, t, dt, g) {
        var p = PR[g.props[0]], side = mainHand(a), at = p ? anchor(p.at, p) : { x: a.x, y: a.y };
        if (a.kind === 'a') { a.tg.lean = towards(a, at.x) * 7 * bump(u); reach(a, side, at.x, at.y, bump(u)); }
        g.props.forEach(function (k, i) { once(a, k, u, 0.42 + i * 0.13, function () { send(PR[k], a.kind + side, 0.4, 6); }); });
      },
      put: function (a, u, t, dt, g) {       // set something down, or drop it on the pile
        var to = anchor(g.to, PR[g.prop] || {});
        if (a.kind === 'a') { a.tg.lean = towards(a, to.x) * 6 * bump(u); reach(a, mainHand(a), to.x, to.y, bump(u)); }
        else a.tg.tilt = towards(a, to.x) * 1.2 * bump(u);
        once(a, 'put', u, 0.5, function () {
          var p = PR[g.prop];
          send(p, g.to, 0.45, g.lift || 6, g.to === 'pileIn' ? function () { p.at = p.home; p.show = 0; } : null);
        });
      },
      put2: function (a, u, t, dt, g) {
        var to = anchor(g.props[0][1], {});
        if (a.kind === 'a') { a.tg.lean = towards(a, to.x) * 7 * bump(u); reach(a, mainHand(a), to.x, to.y, bump(u)); }
        g.props.forEach(function (pr, i) { once(a, pr[0], u, 0.42 + i * 0.13, function () { send(PR[pr[0]], pr[1], 0.4, 6); }); });
      },
      toss: function (a, u, t, dt, g) {      // a log onto the fire, which flares up
        if (a.kind === 'a') { a.tg.al = u < 0.3 ? -6 : u < 0.6 ? 52 : 12; a.tg.lean = u > 0.3 && u < 0.7 ? -3 : 0; a.rate = 16; }
        else a.tg.tilt = (u < 0.35 ? -1.2 : u < 0.6 ? 1.8 : 0.3) * towards(a, FIRE[0]);
        once(a, 'toss', u, 0.48, function () {
          var p = PR[g.prop];
          send(p, 'fire', 0.62, 66, function () {
            fire.classList.add('flare');
            flareUntil = clock + 1.4;
            CAST.forEach(function (c) { if (Math.abs(c.x - FIRE[0]) < 220) nod(c, -0.9 * towards(c, FIRE[0])); });   // leaning back from the flare
            p.at = p.home; p.show = 0;                       // another log waits where that one came from
          });
        });
      },
      warm: function (a, u, t) {
        if (a.kind === 'a') { a.tg.al = 30 + 3 * Math.sin(t * 5); a.tg.ar = -16 - 3 * Math.sin(t * 5 + 1.6); }
        else a.tg.tilt = 0.5 * towards(a, FIRE[0]) * ease(u * 4);
      },
      give: function (a, u, t, dt, g) {      // hand something over: arm out, it passes across, arm back
        var to = g.to, th = hand(to, g.toSide);
        if (a.kind === 'a') { reach(a, mainHand(a), th.x, th.y, lift(u)); a.tg.sa = -80; }
        else a.tg.tilt = towards(a, th.x) * 1.4 * lift(u);
        once(a, 'give', u, 0.45, function () {
          send(PR[g.prop], to.kind + g.toSide, 0.45, 6, function () { nod(to, 0.9 * towards(to, a.x)); });
        });
      },
      receive: function (a, u, t, dt, g) {
        var fh = hand(g.from, mainHand(g.from));
        if (a.kind === 'a') reach(a, mainHand(a), fh.x, fh.y, lift(u) * 0.8);
        else a.tg.tilt = towards(a, fh.x) * 1.1 * lift(u);
      },
      toast: function (a, u, t, dt, g) {
        var p = PR[g.stick];
        a.tg.sa = stickAim(a, p);
        if (a.kind === 'a') { a.tg.al = 22 + 2 * Math.sin(t * 2.3); a.tg.ar = 4; }
        else a.tg.tilt = 0.4 * towards(a, FIRE[0]);
        a.rate = 4;
        if (p && !reduceMotion) p.toast = ease((u - 0.15) / 0.75);
      },
      cool: function (a, u) {                 // lift it away from the fire and let it cool
        if (a.kind === 'a') { a.tg.al = 10; a.tg.sa = -96; } else { a.tg.sa = -70; a.tg.tilt = -0.3 * towards(a, FIRE[0]) * bump(u); }
      },
      eat: function (a, u, t, dt, g) {
        if (a.kind === 'a') { a.tg.al = 12 - 30 * bump(u); a.tg.sa = -118; a.tg.lean = towards(a, FIRE[0]) * -1.5 * bump(u); }
        else { a.tg.sa = -96; a.tg.tilt = 0.6 * bump(u); }
        once(a, 'eat', u, 0.55, function () { if (PR[g.stick]) PR[g.stick].eaten = true; });
      },
      getmugs: function (a, u, t, dt, g) {
        if (a.kind === 'a') { a.tg.ar = -14 * bump(u); a.tg.al = 14 * bump(u); a.look = u < 0.7 ? 'back' : ''; }
        else { a.tg.tilt = 0.8 * Math.sin(u * Math.PI * 2); a.look = u < 0.7 ? 'back' : ''; }
        once(a, 'm', u, 0.45, function () {
          g.mugs.forEach(function (m, i) { var p = PR[m[0]]; if (p) { p.steam = 1; send(p, a.kind + m[1], 0.5 + i * 0.08, 2); } });
        });
      },
      putmugs: function (a, u, t, dt, g) {
        if (a.kind === 'a') { a.tg.ar = -14 * bump(u); a.tg.al = 14 * bump(u); }
        else a.tg.tilt = 0.8 * Math.sin(u * Math.PI * 2);
        a.look = u > 0.3 ? 'back' : '';
        once(a, 'm', u, 0.45, function () { g.mugs.forEach(function (m) { send(PR[m], 'tent', 0.5, 2); }); });
      },
      sip: function (a, u, t, dt) {
        if (a.kind === 'a' && !a.pose) { a.tg.ar = heldIn(a, 'R') ? 10 + 26 * bump(u) : a.tg.ar; a.tg.al = heldIn(a, 'L') ? 6 - 22 * bump(u) : a.tg.al; }
        else a.tg.tilt = 0.5 * bump(u);
        coolMugs(dt * 0.25);
      },
      view: function (a, u, t, dt, g) {       // stand and take in the view
        if (a.kind === 'a') { if (!heldIn(a, 'R')) a.tg.ar = -16; a.tg.al += 2 * Math.sin(t * 0.8); a.tg.lean = 1.3 * Math.sin(t * 0.6); }
        else a.tg.tilt = 0.5 * bump(u * 1.2) * (a.other ? towards(a, a.other.x) : 1);
        if (g.back) a.look = 'back';
        if (u > 0.6) coolMugs(dt * 0.8);
      },
      talk: function (a, u, t, dt, g) {
        once(a, 'say', u, 0, function () { say(a, g.icon, a.cur.d - 0.3); });
        a.talking = true;
        var o = a.other;
        if (a.kind === 'a' && !a.pose) {
          if (!heldIn(a, 'R')) a.tg.ar = -30 * bump(u * 2) - 12 * bump(u * 2 - 1);
          a.tg.lean = (o ? towards(a, o.x) : 1) * 1.2 * bump(u);
        } else a.tg.tilt = (o ? towards(a, o.x) : 1) * 0.8 * bump(u);
      },
      listen: function (a, u) {
        var o = a.other;
        if (a.kind === 'a' && !a.pose) a.tg.lean = (o ? towards(a, o.x) : 1) * 1.4 * bump(u);
        else a.tg.tilt = (o ? towards(a, o.x) : 1) * 0.6 * bump(u);
        once(a, 'nod', u, 0.5, function () { nod(a, 0.7 * (o ? towards(a, o.x) : 1)); });
      },
      rummage: function (a, u, t) {          // a look inside the tent
        a.look = 'back';
        if (a.kind === 'a') { a.tg.al = 18 + 10 * Math.sin(t * 5); a.tg.ar = -18 - 10 * Math.sin(t * 5 + 1); a.tg.lean = 2 * Math.sin(t * 3); }
        else a.tg.tilt = 0.6 * Math.sin(t * 2);
      },
      dip: function (a, u, t, dt) { coolMugs(dt * 0.5); },
      idle: function () {}
    };
    function coolMugs(by) { ['mugA', 'mugP'].forEach(function (k) { if (PR[k]) PR[k].steam = Math.max(0, PR[k].steam - by); }); }

    /* a script is a list of steps for each of them: walk somewhere, wait, do something, or meet up (sync) */
    function go(to, sp) { return { t: 'go', to: to, sp: sp || 1 }; }
    function wait(d) { return { t: 'wait', d: d }; }
    function act(name, d, arg) { return { t: 'act', a: name, d: d, arg: arg || {} }; }
    function sync(id) { return { t: 'sync', id: id }; }
    function call(f) { return { t: 'call', f: f }; }
    function sit() { return call(function (a) { a.sitting = !!a.poses.sit; }); }
    function stand() { return call(function (a) { a.sitting = false; }); }

    function begin(a, t) {
      a.st = t; a.fired = {};
      var s = a.cur = a.steps[a.si] || null;
      if (!s) return;
      if (s.t === 'go') {
        var to = typeof s.to === 'function' ? s.to(a) : s.to, list = typeof to[0] === 'number' ? [to] : to;
        var from = [a.x, a.y], path = [];
        list.forEach(function (p) { p = settle(p); path = path.concat(route(from, p)); from = p; });
        a.path = path; a.vmax = 55 * s.sp * a.pace; a.walking = true;
      } else if (s.t === 'call') { s.f(a); next(a, t); }
    }
    function next(a, t) { a.si++; begin(a, t); }
    function stepActor(a, t, dt) {
      var s = a.cur;
      if (!s) return;
      if (s.t === 'go') { if (walk(a, dt)) { a.walking = false; next(a, t); } }
      else if (s.t === 'wait') { if (t - a.st >= s.d) next(a, t); }
      else if (s.t === 'act') {
        var u = Math.min(1, (t - a.st) / s.d);
        ACT[s.a](a, u, t, dt, s.arg);
        if (u >= 1) next(a, t);
      } else if (s.t === 'sync') {
        var o = a.other, os = o && o.cur, met = os && os.t === 'sync' && os.id === s.id;
        if (o && t - a.st > 0.8) {                             // waiting: an eye on the other one
          if (a.kind === 'a') a.tg.lean = towards(a, o.x) * 0.8; else a.tg.tilt = towards(a, o.x) * 0.4;
        }
        if (!o || !os || met || t - a.st > 30) { next(a, t); if (met) next(o, t); }
      }
    }

    /* walking: steer toward the next point with eased speed, so corners round off and arrivals slow down */
    function walk(a, dt) {
      var tgt = a.path[0], last = a.path.length === 1;
      var dx = tgt[0] - a.x, dy = (tgt[1] - a.y) * 2, d = Math.hypot(dx, dy);
      if (!last && d < 22) { a.path.shift(); return walk(a, dt); }
      if (last && (d < 1.2 || (d < 5 && a.vx * dx + a.vy * dy < 0))) {
        a.x = tgt[0]; a.y = tgt[1]; a.vx = a.vy = 0; a.path = null;
        return true;
      }
      var rest = d;
      for (var i = 1; i < a.path.length; i++) rest += md(a.path[i - 1], a.path[i]);
      var k = depthK(a.y), want = Math.min(a.vmax * k, 10 + rest * 1.7);
      a.vx = approach(a.vx, dx / d * want, dt, 5);
      a.vy = approach(a.vy, dy / d * want, dt, 5);
      var mx = a.vx * dt, my = a.vy * dt, sp = Math.hypot(a.vx, a.vy);
      a.x += mx; a.y += my / 2;
      a.side = sp > 1 ? a.vx / sp : 0;
      a.phase += Math.hypot(mx, my) / (a.stride * k) * Math.PI;
      return false;
    }

    function targets(a) {
      a.tg = a.kind === 'a'
        ? { al: heldIn(a, 'L') ? 6 : 2, ar: heldIn(a, 'R') ? 10 : -2, lean: 0, sa: -100, tilt: 0 }
        : { al: 0, ar: 0, lean: 0, sa: -62, tilt: 0 };
      a.rate = 7; a.look = ''; a.talking = false;
    }
    function settleJoints(a, dt) {
      var j = a.j, tg = a.tg;
      j.al = approach(j.al, tg.al, dt, a.rate);
      j.ar = approach(j.ar, tg.ar, dt, a.rate);
      j.lean = approach(j.lean, tg.lean, dt, 6);
      j.sa = approach(j.sa, tg.sa, dt, 4);
      j.tilt = approach(j.tilt, tg.tilt, dt, 3);
    }

    /* drawn about the feet: the depth scale, the walk, the breathing and the leaning all pivot there */
    function drawActor(a, t, dt) {
      var k = depthK(a.y), d = a.d, j = a.j, rig = a.kind === 'a' && !a.pose;
      d.sc = a.S * k;
      d.dy = a.y - (onBridge(a.x, a.y) ? archAt(a.x) : 0);
      a.g = approach(a.g, a.walking ? 1 : 0, dt, 7);
      var s = Math.sin(a.phase), g = a.g, nodNow = a.nodBy * bump((t - a.nodAt) / 1.1);
      if (rig) {
        d.bob = -5 * Math.abs(s) * g + 1.4 * Math.sin(t * 1.8) * (1 - g);
        d.rot = j.lean + nodNow * 2 + g * (1.4 * s + a.side * 1.2) + (1 - g) * 0.5 * Math.sin(t * 0.7);
        d.al = j.al + 5 * s * g + 1.2 * Math.sin(t * 1.1) * (1 - g);
        d.ar = j.ar + 5 * s * g - 1.2 * Math.sin(t * 1.3) * (1 - g);
        d.kx = d.ky = 1;
        var up = 'translate(0 ' + d.bob.toFixed(2) + ')';
        for (var i = 0; i < a.up.length; i++) a.up[i].setAttribute('transform', up);
        a.armL.setAttribute('transform', 'rotate(' + d.al.toFixed(2) + ' 122 352)');
        a.armR.setAttribute('transform', 'rotate(' + d.ar.toFixed(2) + ' 318 352)');
        a.legL.setAttribute('transform', 'translate(0 ' + (-9 * Math.max(0, s) * g).toFixed(2) + ') rotate(' + (a.side * 4 * Math.max(0, s) * g).toFixed(2) + ' 172 512)');
        a.legR.setAttribute('transform', 'translate(0 ' + (-9 * Math.max(0, -s) * g).toFixed(2) + ') rotate(' + (a.side * 4 * Math.max(0, -s) * g).toFixed(2) + ' 282 512)');
        a.art.setAttribute('transform', 'rotate(' + d.rot.toFixed(2) + ')');
      } else {
        /* a single picture: it sways a little from the feet with each step and dips a touch, never leaving the ground */
        var dip = 0.012 * Math.abs(s) * g, breath = 0.0035 * Math.sin(t * 1.7) * (1 - g);
        d.rot = (a.kind === 'a' ? j.lean * 0.3 : 0) + j.tilt + nodNow + g * (1.1 * s + a.side * 0.8) + (1 - g) * 0.35 * Math.sin(t * 0.55);
        d.kx = 1 + dip * 0.5; d.ky = 1 - dip + breath;
        d.bob = 0;
        a.art.setAttribute('transform', 'rotate(' + d.rot.toFixed(2) + ') scale(' + d.kx.toFixed(4) + ' ' + d.ky.toFixed(4) + ')');
      }
      a.el.setAttribute('transform', 'translate(' + a.x.toFixed(2) + ' ' + d.dy.toFixed(2) + ') scale(' + d.sc.toFixed(4) + ')');
      /* into the trees the trail fades them out among the trunks */
      var fade = clamp01((a.x - 178) / 54);
      if (fade !== a.fade) { a.fade = fade; a.el.style.opacity = fade < 1 ? fade.toFixed(3) : ''; }
    }

    /* spots round the valley */
    var SP = {
      standW: [666, 534], standE: [790, 535], tossW: [684, 532], tossE: [796, 532],
      pile: [640, 484], sticks: [558, 544], stack: [436, 448], trail: [352, 452], deep: [178, 410],
      door: [938, 456], bridgeW: [1156, 404], bridgeE: [1336, 404]
    };
    var FRONT = [[560, 586], [660, 590], [760, 592], [860, 588], [960, 584], [1060, 578]];
    var MEADOW = [[520, 500], [560, 560], [700, 580], [860, 580], [1000, 560], [1080, 500], [1010, 476], [580, 452], [480, 530], [940, 520], [800, 470]];
    function shore(y, inset) { return settle([bankL(y) - inset, y]); }
    function beside(b, side, gap) {           // a spot next to someone; on her right, the avatar's left hand meets the portrait's right
      return function () { return settle([b.x + side * gap * depthK(b.y), b.y + 2]); };
    }
    function besideAt(p, side, gap) { return settle([p[0] + side * gap * depthK(p[1]), p[1] + 2]); }
    function somewhere(but) {
      var list = MEADOW.filter(function (m) { return !but || md(m, but) > 90; });
      return jit(pick(list), 18);
    }
    function dipIn(a) { return a.poses.lean && chance(0.6) ? act('dip', rnd(2.5, 4)) : wait(0); }
    function chat(n, set, first) {
      var out = { a: [], p: [] }, by = first || pick(['a', 'p']), list = icons(set);
      for (var i = 0; i < n; i++) {
        var d = rnd(1.6, 2.4), icon = pick(list), id = 'c' + i;
        out.a.push(sync(id), by === 'a' ? act('talk', d, { icon: icon }) : act('listen', d), wait(rnd(0.15, 0.5)));
        out.p.push(sync(id), by === 'p' ? act('talk', d, { icon: icon }) : act('listen', d), wait(rnd(0.15, 0.5)));
        if (chance(0.75)) by = by === 'a' ? 'p' : 'a';
      }
      return out;
    }

    /* the pool. Each makes a fresh plan with its own spots, timings and roles. */
    var BEH = {
      wave: { w: 0.7, make: function () {
        var spot = jit(pick(FRONT), 14);
        var plan = { a: [go(spot), sync('w'), act('wave', rnd(2.4, 3.4)), wait(rnd(0.4, 1.2))] };
        if (duo) plan.p = [go(besideAt(spot, -1, rnd(64, 78))), sync('w'), act('wave', rnd(2, 2.8)), wait(rnd(0.2, 1))];
        return plan;
      } },
      stroll: { w: 1, make: function () {          // along the river bank together
        var line = [432, 484, 532, 584].map(function (y) { return shore(y, 30 + rnd(0, 8)); }), pace = rnd(0.7, 0.84);
        if (chance(0.5)) line.reverse();
        var gap = rnd(36, 46), off = function (p) { return settle([p[0] - gap * depthK(p[1]), p[1] + 2]); };
        if (!duo) return { a: [go(line[0]), go(line.slice(1), pace), act('view', rnd(3, 5), { back: true }), go(somewhere())] };
        var talk = chat(chance(0.5) ? 1 : 2, 'view');
        return {
          a: [go(off(line[0])), sync('s'), go(line.slice(1).map(off), pace), sync('e'), act('view', rnd(2.5, 4), { back: true })].concat(talk.a, [go(somewhere())]),
          p: [go(line[0]), sync('s'), go(line.slice(1), pace), sync('e'), act('view', rnd(2.5, 4), { back: true })].concat(talk.p, [wait(rnd(0.5, 2)), go(somewhere())])
        };
      } },
      bridge: { w: 1, make: function () {          // over the footbridge to the far bank and back
        var view = rnd(2.2, 3.8);
        if (duo && chance(0.45)) {
          return {
            a: [go([1128, 420]), sync('b0'), go([[1158, 405], [1336, 407]], 0.85), sync('b1'), act('view', view, { back: true }), sync('b2'), go([1158, 405], 0.85), go(somewhere())],
            p: [go([1112, 412]), sync('b0'), go([[1156, 399], [1338, 400]], 0.85), sync('b1'), act('view', view, { back: true }), sync('b2'), go([1156, 399], 0.85), wait(rnd(0.3, 1.5)), go(somewhere())]
          };
        }
        var X = duo ? pick(CAST) : A, cross = [go(SP.bridgeW), go(jit(SP.bridgeE, 4), 0.85), act('view', view, { back: true }), wait(rnd(0.3, 0.9)), go(SP.bridgeW, 0.85), sync('back'), go(somewhere())];
        var plan = {};
        plan[X.kind] = cross;
        if (duo) plan[X.other.kind] = [go(shore(rnd(450, 500), 40)), act('view', rnd(1.5, 3)), sync('back'), wait(rnd(0.5, 1.5))];
        return plan;
      } },
      firewood: { w: 1.1, make: function () {      // a log from the stack at the forest edge to the pile by the fire
        var at = jit(SP.stack, 8), mode = duo ? pick(['alone', 'along', 'handoff']) : 'alone';
        var a = [go(at), act('take', 1.5, { prop: 'log1' })];
        if (mode === 'handoff') return {
          a: a.concat([sync('h'), act('give', 1.6, { prop: 'log1', to: P, toSide: 'R' }), wait(rnd(0.4, 1)), go(somewhere())]),
          p: [go(besideAt(at, -1, 68)), sync('h'), act('receive', 1.6, { from: A }), go(jit(SP.pile, 5)), act('put', 1.3, { prop: 'log1', to: 'pileIn', lift: 26 })]
        };
        a.push(sync('got'), go(jit(SP.pile, 5)), act('put', 1.2, { prop: 'log1', to: 'pileIn' }), sync('done'));
        if (!duo) return { a: a };
        return { a: a, p: mode === 'along'
          ? [go(jit([486, 474], 10)), sync('got'), go(jit(SP.standW, 8)), act('warm', rnd(1.5, 3)), sync('done')]
          : [go(jit(SP.standW, 8)), act('warm', rnd(3, 6)), sync('got'), sync('done'), act('warm', rnd(1, 2))] };
      } },
      feed: { w: 1, make: function () {            // a log from the pile onto the fire
        var at = jit(SP.pile, 5);
        if (duo && chance(0.45)) return {
          a: [go(at), act('take', 1.4, { prop: 'log2' }), sync('h'), act('give', 1.6, { prop: 'log2', to: P, toSide: 'R' }), go(jit(SP.standE, 8)), act('warm', rnd(2.5, 4))],
          p: [go(besideAt(at, -1, 68)), sync('h'), act('receive', 1.6, { from: A }), go(jit(SP.tossW, 4)), act('toss', 1.5, { prop: 'log2' }), act('warm', rnd(2, 3.5))]
        };
        var plan = { a: [go(at), act('take', 1.4, { prop: 'log2' }), go(jit(SP.tossE, 4)), act('toss', 1.5, { prop: 'log2' }), act('warm', rnd(2.5, 4.5))] };
        if (duo) plan.p = [go(jit(SP.standW, 8)), act('warm', rnd(5, 8))];
        return plan;
      } },
      toast: { w: 1.2, make: function () {         // marshmallows over the fire
        var dur = rnd(5, 7.5);
        if (!duo) return { a: [go(SP.sticks), act('take', 1.4, { prop: 'stickA' }), go(jit(SP.standE, 5)), act('toast', dur, { stick: 'stickA' }),
          act('cool', 1.3), act('eat', 1.4, { stick: 'stickA' }), go(SP.sticks), act('put', 1.2, { prop: 'stickA', to: 'restA' })] };
        var spotP = jit(SP.standW, 5), talk = chat(chance(0.5) ? 1 : 2, 'fire');
        return {
          a: [go(SP.sticks), act('take2', 1.6, { props: ['stickA', 'stickP'] }), go(besideAt(spotP, 1, 68)), sync('h1'),
            act('give', 1.6, { prop: 'stickP', to: P, toSide: 'R' }), go(jit(SP.standE, 5)), sync('t'),
            act('toast', dur, { stick: 'stickA' }), act('cool', 1.3), act('eat', 1.4, { stick: 'stickA' })].concat(talk.a, [
            go(besideAt(spotP, 1, 68)), sync('h2'), act('receive', 1.5, { from: P }), go(SP.sticks),
            act('put2', 1.5, { props: [['stickA', 'restA'], ['stickP', 'restP']] })]),
          p: [go(spotP), sync('h1'), act('receive', 1.6, { from: A }), sync('t'),
            act('toast', dur + rnd(-0.6, 0.6), { stick: 'stickP' }), act('cool', 1.3), act('eat', 1.4, { stick: 'stickP' })].concat(talk.p, [
            sync('h2'), act('give', 1.5, { prop: 'stickP', to: A, toSide: 'L' }), wait(rnd(0.5, 1.5))])
        };
      } },
      mugs: { w: 1.1, make: function () {          // one fetches two mugs from the tent while the other waits
        if (!duo) return { a: [go(SP.door), act('getmugs', 1.4, { mugs: [['mugA', 'R']] }), go(shore(rnd(470, 560), 34)),
          act('view', rnd(3, 5), { back: true }), act('sip', 1.6), go(SP.door), act('putmugs', 1.2, { mugs: ['mugA'] })] };
        var X = pick(CAST), Y = X.other, where = pick(['view', 'fire', 'meadow']);
        var spotY = where === 'view' ? shore(rnd(450, 560), Y === A ? 70 : 32) : where === 'fire' ? jit(Y === A ? SP.standE : SP.standW, 6) : somewhere();
        var yMug = Y === A ? 'mugA' : 'mugP', ySide = Y === A ? 'L' : 'R', xSide = X === A ? 'L' : 'R';
        var talk = chat(2 + (chance(0.4) ? 1 : 0), 'mug');
        var plan = {};
        plan[X.kind] = [go(SP.door), act('getmugs', 1.4, { mugs: X === A ? [['mugA', 'R'], ['mugP', 'L']] : [['mugP', 'L'], ['mugA', 'R']] }),
          go(besideAt(spotY, X === A ? 1 : -1, 68)), sync('h'), act('give', 1.6, { prop: yMug, to: Y, toSide: ySide }), sync('s'),
          act('sip', rnd(1.4, 2.2))].concat(talk[X.kind], [act('view', rnd(1.5, 3)), sync('back'), act('receive', 1.5, { from: Y }),
          go(SP.door), act('putmugs', 1.3, { mugs: ['mugA', 'mugP'] })]);
        plan[Y.kind] = [go(spotY), act(where === 'fire' ? 'warm' : 'view', rnd(1.5, 3), { back: where === 'view' }), sync('h'),
          act('receive', 1.6, { from: X }), sync('s'), act('sip', rnd(1.4, 2.2))].concat(talk[Y.kind], [act('sip', rnd(1.5, 3)),
          sync('back'), act('give', 1.5, { prop: yMug, to: X, toSide: xSide }), wait(rnd(0.5, 2))]);
        return plan;
      } },
      view: { w: 1, make: function () {            // stand by the water and look up the valley
        var y = rnd(440, 580), spotP = shore(y, 30), spotA = besideAt(spotP, -1, rnd(40, 50));
        if (!duo) return { a: [go(spotP), act('view', rnd(5, 8), { back: true }), go(somewhere())] };
        var talk = chat(chance(0.6) ? 2 : 1, 'view');
        return {
          a: [go(spotA), sync('v'), act('view', rnd(3, 5), { back: true })].concat(talk.a, [act('view', rnd(1, 2.5), { back: true }), dipIn(A), go(somewhere())]),
          p: [go(spotP), sync('v'), act('view', rnd(3, 5), { back: true })].concat(talk.p, [act('view', rnd(1.5, 3.5), { back: true }), dipIn(P), go(somewhere())])
        };
      } },
      forest: { w: 0.9, make: function () {        // off along the trail into the trees, and back
        var X = duo ? pick(CAST) : A, away = rnd(2.5, 5);
        if (duo && chance(0.3)) return {
          a: [go(SP.trail), sync('f0'), go([[300, 440], SP.deep], 0.9), wait(away), go(SP.trail, 0.9), go(somewhere())],
          p: [go([392, 462]), sync('f0'), wait(0.8), go([[306, 443], [200, 418]], 0.9), wait(away - 0.4), go([370, 458], 0.9), wait(rnd(0.2, 1)), go(somewhere())]
        };
        var plan = {};
        plan[X.kind] = [go(SP.trail), go(SP.deep, 0.9), wait(away), go(jit([400, 466], 6), 0.9), sync('home')];
        if (duo) {
          var greet = chat(1, 'any', X.other.kind);
          plan[X.other.kind] = [go(jit([500, 482], 12)), act('view', rnd(2, 3)), sync('home')].concat(greet[X.other.kind]);
          plan[X.kind] = plan[X.kind].concat(greet[X.kind]);
        }
        return plan;
      } },
      chat: { w: 1.1, make: function () {          // stand or sit close and talk
        var where = pick(['log', 'bench', 'meadow', 'front']), pp, pa;
        if (where === 'log') { pp = [596, 540]; pa = [676, 542]; }
        else if (where === 'bench') { pp = [862, 550]; pa = [942, 552]; }
        else { pp = jit(pick(where === 'front' ? FRONT : MEADOW), 12); pa = besideAt(pp, 1, rnd(86, 100)); }
        var seated = where === 'log' || where === 'bench';
        if (!duo) return { a: [go(pa), seated ? sit() : wait(0), act('view', rnd(4, 6)), stand(), go(somewhere())] };
        var talk = chat(3 + Math.floor(rnd(0, 3)), seated ? 'fire' : 'any');
        return {
          a: [go(pa), sync('c'), seated ? sit() : wait(0)].concat(talk.a, [wait(rnd(0.5, 1.5)), stand(), go(somewhere(pa))]),
          p: [go(pp), sync('c'), seated ? sit() : wait(0)].concat(talk.p, [wait(rnd(1, 2.5)), stand(), wait(rnd(0, 1)), go(somewhere(pa))])
        };
      } },
      errand: { w: 0.8, make: function () {        // one pops over to the tent while the other waits
        var X = duo ? pick(CAST) : A, Y = X.other;
        if (!duo) return { a: [go(SP.door), act('rummage', rnd(1.8, 3)), go(somewhere())] };
        var spotY = jit([Y.x, Y.y], 4), greet = chat(1, 'any', X.kind), plan = {};
        plan[X.kind] = [go(SP.door), act('rummage', rnd(1.8, 3.2)), go(besideAt(spotY, X === A ? 1 : -1, 70)), sync('r')].concat(greet[X.kind]);
        plan[Y.kind] = [go(spotY), act('idle', rnd(0.5, 1)), sync('r')].concat(greet[Y.kind]);
        return plan;
      } },
      wander: { w: 0.9, make: function () {        // each potters about on their own
        var a1 = somewhere(), p1 = somewhere(a1);
        var plan = { a: [go(a1), wait(rnd(0.8, 2.2)), go(somewhere(a1)), wait(rnd(0.3, 1))] };
        if (duo) plan.p = [wait(rnd(0, 1)), go(p1), act('view', rnd(1.5, 3)), go(somewhere(p1))];
        return plan;
      } }
    };
    var recent = [];
    function direct(t) {
      var names = Object.keys(BEH).filter(function (n) { return recent.indexOf(n) < 0; });
      var total = names.reduce(function (s, n) { return s + BEH[n].w; }, 0), r = Math.random() * total, name = names[names.length - 1];
      for (var i = 0; i < names.length; i++) { r -= BEH[names[i]].w; if (r <= 0) { name = names[i]; break; } }
      if (!recent.length) name = 'wave';                       // first, a hello
      recent.unshift(name);
      if (recent.length > 4) recent.pop();
      var plan = BEH[name].make();
      A.pace = rnd(0.9, 1.08);
      if (P) P.pace = A.pace * rnd(0.97, 1.03);
      CAST.forEach(function (a) { a.steps = plan[a.kind] || []; a.si = 0; begin(a, t); });
    }

    var raf = 0, last = 0, clock = 0, onScreen = true, nextBlink = 1.5, flareUntil = 0;
    function frame(now) {
      raf = requestAnimationFrame(frame);
      var dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      clock += dt;
      tick(dt, clock);
    }
    function tick(dt, t) {
      if (!CAST.some(function (a) { return a.cur; })) direct(t);
      CAST.forEach(function (a) { targets(a); stepActor(a, t, dt); settleJoints(a, dt); });
      CAST.forEach(function (a) { updatePose(a, t); drawActor(a, t, dt); });
      for (var k in PR) place(PR[k], dt);
      sortDepth();
      CAST.forEach(drawBubble);
      if (flareUntil && t > flareUntil - 0.2) { fire.classList.remove('flare'); flareUntil = 0; }

      /* the avatar blinks every few seconds, quickly, like anyone does */
      var lid = 0;
      if (t > nextBlink) {
        var bt = (t - nextBlink) / 0.17;
        if (bt >= 1) nextBlink = t + 2.2 + Math.random() * 3.6;
        else lid = Math.sin(Math.PI * bt);
      }
      for (var i = 0; i < A.lids.length; i++) A.lids[i].style.transform = 'scaleY(' + lid.toFixed(3) + ')';
    }

    /* they start by the fire, one on each side */
    A.x = SP.standE[0]; A.y = SP.standE[1];
    if (P) { P.x = SP.standW[0]; P.y = SP.standW[1]; }

    if (reduceMotion) {
      /* a single, still moment: toasting marshmallows together by the fire */
      var still = function () {
        CAST.forEach(function (a) { a.steps = [act('toast', 1e9, { stick: a === A ? 'stickA' : 'stickP' })]; a.si = 0; begin(a, 0); });
        if (PR.stickA) { PR.stickA.at = 'aL'; PR.stickA.mal = 1; PR.stickA.toast = 0.45; }
        if (PR.stickP) { PR.stickP.at = 'pR'; PR.stickP.mal = 1; PR.stickP.toast = 0.45; }
        for (var n = 0; n < 4; n++) {
          CAST.forEach(function (a) { targets(a); stepActor(a, 0, 10); settleJoints(a, 10); updatePose(a, 0, true); drawActor(a, 0, 10); });
          for (var k in PR) place(PR[k], 10);
        }
        sortDepth();
      };
      still();
      loadPoses(still);
      return;
    }

    loadPoses(function () {});
    function run(go) {
      if (go && !raf) { last = performance.now(); raf = requestAnimationFrame(frame); }
      if (!go && raf) { cancelAnimationFrame(raf); raf = 0; }
    }
    tick(0, 0);
    run(true);
    document.addEventListener('visibilitychange', function () { run(!document.hidden && onScreen); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        onScreen = entries[0].isIntersecting;
        run(onScreen && !document.hidden);
      }).observe(stage);
    }
  })();

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
      li.style.setProperty('--ry', ((x - 0.5) * 5).toFixed(2) + 'deg');
      li.style.setProperty('--rx', ((0.5 - y) * 5).toFixed(2) + 'deg');
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
