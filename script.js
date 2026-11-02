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

  document.title = CONFIG.name + ' · Portfolio';
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
    if (/^https?:/.test(l.url)) { a.target = '_blank'; a.rel = 'me noopener'; }
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
  function setStatus(msg) {
    list.innerHTML = '';
    var li = document.createElement('li');
    li.className = 'repo-status';
    li.textContent = msg;
    list.appendChild(li);
  }
  function card(repo) {
    var li = document.createElement('li');
    li.className = 'repo';
    var a = document.createElement('a');
    a.href = repo.html_url; a.target = '_blank'; a.rel = 'noopener';
    var n = document.createElement('span'); n.className = 'repo-name'; n.textContent = repo.name;
    a.appendChild(n);
    if (repo.description) {
      var d = document.createElement('span'); d.className = 'repo-desc'; d.textContent = repo.description;
      a.appendChild(d);
    }
    var bits = [];
    if (repo.language) bits.push(repo.language);
    bits.push('Updated ' + new Date(repo.pushed_at || repo.updated_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }));
    var m = document.createElement('span'); m.className = 'repo-meta'; m.textContent = bits.join(', ');
    a.appendChild(m);
    li.appendChild(a);
    return li;
  }

  fetch('https://api.github.com/users/' + encodeURIComponent(CONFIG.githubUser) + '/repos?sort=pushed&per_page=12')
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (repos) {
      var shown = repos.filter(function (r) { return !r.fork; });
      if (!shown.length) { setStatus('Projects will show up here as soon as the first public repository is created.'); return; }
      list.innerHTML = '';
      shown.forEach(function (r) { list.appendChild(card(r)); });
    })
    .catch(function () {
      setStatus('Projects could not be loaded right now. See them on github.com/' + CONFIG.githubUser + '.');
    });
})();
