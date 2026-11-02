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

  /* the cut-out stands in the scenery by default; when About is on it moves up beside that text */
  var photoFig = document.querySelector('.photo');
  var portrait = $('portrait');
  if (portrait) portrait.setAttribute('aria-label', 'Portrait of ' + CONFIG.name);
  if (!on.about) drop($('about'));
  if (!CONFIG.photo) {
    drop(photoFig);
    drop(portrait);
  } else if (on.about) {
    var wrap = $('about').querySelector('.about-wrap');
    wrap.classList.add('has-photo');
    wrap.insertBefore(photoFig, $('about-body'));
    drop(portrait);
  }
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

  /* light / dark toggle; the saved choice was already applied in <head> */
  var root = document.documentElement;
  var toggle = $('theme-toggle');
  var themeColor = document.querySelector('meta[name="theme-color"]');
  function showTheme() {
    var dark = root.getAttribute('data-theme') === 'dark';
    toggle.setAttribute('aria-pressed', dark ? 'true' : 'false');
    if (themeColor) themeColor.setAttribute('content', dark ? '#241f2e' : '#fbfaff');
  }
  showTheme();
  toggle.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    if (!reduceMotion) {
      root.classList.add('theme-fade');
      setTimeout(function () { root.classList.remove('theme-fade'); }, 450);
    }
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    showTheme();
    if (snowRefresh) snowRefresh();
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
      scene.style.setProperty('--sy', moved.toFixed(3));
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

  /* camp life: her own avatar, cut at the shoulders and hips, goes about the camp on a loop.
     One requestAnimationFrame loop drives it, and it rests while the hero is off screen. */
  (function camp() {
    var stage = document.querySelector('.camp-stage');
    if (!stage) return;
    var q = function (sel) { return stage.querySelector(sel); };
    var simi = q('.simi'), mover = q('.mover'), shadow = q('.simi-shadow');
    var armL = q('.arm-l'), armR = q('.arm-r'), legL = q('.leg-l'), legR = q('.leg-r');
    var lids = stage.querySelectorAll('.lid');
    var heldLog = q('.p-log'), stick = q('.p-stick'), toast = q('.mallow.toast'), mug = q('.p-mug');
    var thrown = q('.thrown'), fire = q('.fire');

    var S = 0.335, FEET = 560;                       // rig scale, and the ground line in stage units
    var SPOT = { door: 700, wood: 572, fire: 384, view: 612 };
    var SPEED = 86, STRIDE = 30;                     // stage units per second, units per step

    /* what she does, in order, forever */
    var plan = [
      ['wave', 2.8], ['walk', 'wood'], ['pick', 1.5], ['walk', 'fire'], ['toss', 1.5],
      ['warm', 4.5], ['toast', 7], ['walk', 'door'], ['getmug', 1.2], ['walk', 'view'],
      ['admire', 5.5], ['walk', 'fire'], ['warmmug', 4.5], ['walk', 'door'], ['putdown', 1.1]
    ];

    var pose = { x: SPOT.door, al: 0, ar: 0, lean: 0, log: 0, stick: 0, mug: 0 };
    var step = 0, stepStart = 0, phase = 0, nextBlink = 1.5, flareUntil = 0;
    var raf = 0, last = 0, clock = 0, onScreen = true, released = null;

    function bump(u) { return Math.sin(Math.PI * Math.min(1, Math.max(0, u))); }
    function ease(u) { u = Math.min(1, Math.max(0, u)); return u * u * (3 - 2 * u); }
    function approach(cur, target, dt, rate) { return cur + (target - cur) * (1 - Math.exp(-dt * rate)); }

    /* where the left hand is on the stage, so a thrown log leaves from her actual hand */
    function handPoint(al, lean, bob) {
      var a = al * Math.PI / 180, hx = 80 - 122, hy = 615 - 352;
      var px = 122 + hx * Math.cos(a) - hy * Math.sin(a);
      var py = 352 + hx * Math.sin(a) + hy * Math.cos(a) + bob;
      var l = lean * Math.PI / 180, dx = px - 206.5, dy = py - 900;
      px = 206.5 + dx * Math.cos(l) - dy * Math.sin(l);
      py = 900 + dx * Math.sin(l) + dy * Math.cos(l);
      return { x: pose.x - 206.5 * S + px * S, y: FEET - 900 * S + py * S };
    }

    function frame(now) {
      raf = requestAnimationFrame(frame);
      var dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      clock += dt;
      tick(dt, clock);
    }

    function tick(dt, t) {
      var act = plan[step], u = 0, target = { al: 2, ar: -2, lean: 0, log: pose.log, stick: 0, mug: pose.mug };
      var walking = false, dir = 0, throwU = -1;

      if (act[0] === 'walk') {
        var goal = SPOT[act[1]], dist = goal - pose.x;
        dir = dist > 0 ? 1 : -1;
        if (Math.abs(dist) < 0.6) { pose.x = goal; next(t); }
        else {
          walking = true;
          var v = SPEED * Math.min(1, Math.abs(dist) / 34 + 0.25, (t - stepStart) * 3 + 0.25);
          var moveBy = Math.min(Math.abs(dist), v * dt);
          pose.x += dir * moveBy;
          phase += moveBy / STRIDE * Math.PI;
          target.al = pose.log ? 6 : 3;
          target.ar = pose.mug ? 10 : -3;
        }
      } else {
        u = (t - stepStart) / act[1];
        if (u >= 1) { next(t); u = 1; }
        var k = act[0];
        if (k === 'wave') { var held = ease(u / 0.2) * ease((1 - u) / 0.2); target.ar = (-104 + 12 * Math.sin(t * 9)) * held; }
        else if (k === 'pick') { target.lean = -7 * bump(u); target.al = 4 + 20 * bump(u); if (u > 0.55) target.log = 1; }
        else if (k === 'toss') {
          target.al = u < 0.3 ? -6 : u < 0.6 ? 52 : 12;
          target.lean = u > 0.3 && u < 0.7 ? -3 : 0;
          if (u >= 0.48 && !released) { released = handPoint(pose.al, pose.lean, 0); }
          target.log = u >= 0.48 ? 0 : 1;
          throwU = released ? (u - 0.48) / 0.4 : -1;
        }
        else if (k === 'warm') { target.al = 30 + 3 * Math.sin(t * 5); target.ar = 16 + 3 * Math.sin(t * 5 + 1.6); }
        else if (k === 'toast') {
          target.stick = u < 0.93 ? 1 : 0;
          target.al = 36 + 2 * Math.sin(t * 2.3);
          target.ar = 4;
          toast.style.opacity = ease((u - 0.2) / 0.7).toFixed(3);
        }
        else if (k === 'getmug') { target.ar = -14 * bump(u); if (u > 0.45) target.mug = 1; }
        else if (k === 'admire') { target.ar = 9; target.al = 2 + 2 * Math.sin(t * 0.8); target.lean = 1.3 * Math.sin(t * 0.6); }
        else if (k === 'warmmug') { target.al = 28 + 2.5 * Math.sin(t * 4.5); target.ar = 10; }
        else if (k === 'putdown') { target.ar = -14 * bump(u); if (u > 0.5) target.mug = 0; }
      }

      /* ease every joint toward where the action wants it */
      pose.al = approach(pose.al, target.al, dt, act[0] === 'toss' ? 16 : 7);
      pose.ar = approach(pose.ar, target.ar, dt, act[0] === 'wave' ? 10 : 7);
      pose.lean = approach(pose.lean, target.lean, dt, 6);
      pose.log = target.log === 0 ? 0 : approach(pose.log, target.log, dt, 10);
      if (act[0] === 'walk' && pose.log) pose.log = 1;
      pose.stick = approach(pose.stick, target.stick, dt, 8);
      pose.mug = approach(pose.mug, target.mug, dt, 9);

      /* the walk cycle, breathing and a little sway layered on top */
      var s = Math.sin(phase), bob, lean = pose.lean, al = pose.al, ar = pose.ar, liftL = 0, liftR = 0, rotL = 0, rotR = 0;
      if (walking) {
        bob = -6 * Math.abs(s);
        lean += 1.5 * s + dir * 1.2;
        al += 5 * s;
        ar += 5 * s;
        liftL = -9 * Math.max(0, s);
        liftR = -9 * Math.max(0, -s);
        rotL = dir * 4 * Math.max(0, s);
        rotR = dir * 4 * Math.max(0, -s);
      } else {
        bob = 1.6 * Math.sin(t * 1.8);
        lean += 0.6 * Math.sin(t * 0.7);
        al += 1.2 * Math.sin(t * 1.1);
        ar -= 1.2 * Math.sin(t * 1.3);
      }

      simi.setAttribute('transform', 'translate(' + (pose.x - 206.5 * S).toFixed(2) + ' ' + (FEET - 900 * S).toFixed(2) + ') scale(' + S + ')');
      mover.setAttribute('transform', 'rotate(' + lean.toFixed(2) + ' 206.5 900) translate(0 ' + bob.toFixed(2) + ')');
      armL.setAttribute('transform', 'rotate(' + al.toFixed(2) + ' 122 352)');
      armR.setAttribute('transform', 'rotate(' + ar.toFixed(2) + ' 318 352)');
      legL.setAttribute('transform', 'translate(0 ' + liftL.toFixed(2) + ') rotate(' + rotL.toFixed(2) + ' 172 512)');
      legR.setAttribute('transform', 'translate(0 ' + liftR.toFixed(2) + ') rotate(' + rotR.toFixed(2) + ' 282 512)');
      shadow.setAttribute('cx', pose.x.toFixed(1));
      shadow.setAttribute('rx', (54 + bob * 0.7).toFixed(1));
      heldLog.style.opacity = pose.log.toFixed(3);
      stick.style.opacity = pose.stick.toFixed(3);
      mug.style.opacity = pose.mug.toFixed(3);
      if (act[0] !== 'toast' && pose.stick < 0.05) toast.style.opacity = '0';

      /* a log in flight: leaves her hand, arcs over and lands in the fire */
      if (throwU >= 0 && throwU <= 1) {
        var from = released, w = ease(throwU);
        var x = (1 - w) * (1 - w) * from.x + 2 * (1 - w) * w * ((from.x + 263) / 2) + w * w * 263;
        var y = (1 - w) * (1 - w) * from.y + 2 * (1 - w) * w * (Math.min(from.y, 500) - 70) + w * w * 528;
        thrown.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') rotate(' + (-200 * w).toFixed(1) + ') scale(.42 .47)');
        thrown.style.opacity = throwU < 0.92 ? '1' : '0';
        if (throwU > 0.9 && t > flareUntil) { fire.classList.add('flare'); flareUntil = t + 1.4; }
      } else {
        thrown.style.opacity = '0';
      }
      if (flareUntil && t > flareUntil - 0.2) { fire.classList.remove('flare'); }

      /* she blinks every few seconds, quickly, like anyone does */
      var lid = 0;
      if (t > nextBlink) {
        var bt = (t - nextBlink) / 0.17;
        if (bt >= 1) nextBlink = t + 2.2 + Math.random() * 3.6;
        else lid = Math.sin(Math.PI * bt);
      }
      for (var i = 0; i < lids.length; i++) lids[i].style.transform = 'scaleY(' + lid.toFixed(3) + ')';
    }

    function next(t) {
      released = null;
      step = (step + 1) % plan.length;
      stepStart = t;
    }

    if (reduceMotion) {
      /* a single, still moment by the fire */
      pose.x = SPOT.fire;
      pose.al = 28;
      pose.ar = 14;
      plan = [['warm', 1e9]];
      tick(0, 0);
      return;
    }

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
