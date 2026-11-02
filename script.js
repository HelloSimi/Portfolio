/* ------------------------------------------------------------------
   EDIT THIS PART. Everything on the page comes from this one object.
   Replace the placeholder text with your own, save, and refresh.
------------------------------------------------------------------- */
var CONFIG = {
  name: 'Simran Rekhi',                    // shown big in the hero
  tagline: 'Write one sentence about what you do and what you care about.',
  badge: 'hello • hello • hello • hello • ', // text around the spinning circle
  githubUser: 'HelloSimi',                 // projects are loaded from this GitHub account
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
  $('tagline').textContent = CONFIG.tagline;
  $('badge-text').textContent = CONFIG.badge;
  $('contact-text').textContent = CONFIG.contactText;
  $('foot').textContent = '© ' + new Date().getFullYear() + ' ' + CONFIG.name;

  /* name, split into letters that wobble when touched */
  var nameEl = $('name');
  nameEl.setAttribute('aria-label', CONFIG.name);
  CONFIG.name.split('').forEach(function (ch, i) {
    var s = document.createElement('span');
    s.className = 'ch';
    s.setAttribute('aria-hidden', 'true');
    s.textContent = ch === ' ' ? ' ' : ch;
    s.style.setProperty('--i', i);
    s.addEventListener('pointerenter', function () {
      if (reduceMotion) return;
      s.classList.remove('wob');
      void s.offsetWidth;
      s.classList.add('wob');
    });
    nameEl.appendChild(s);
  });

  CONFIG.about.forEach(function (t) {
    var p = document.createElement('p');
    p.textContent = t;
    $('about-body').appendChild(p);
  });

  CONFIG.skills.forEach(function (s) {
    var li = document.createElement('li');
    var h = document.createElement('h3');
    var p = document.createElement('p');
    h.textContent = s.title;
    p.textContent = s.text;
    li.appendChild(h);
    li.appendChild(p);
    $('skills').appendChild(li);
  });

  CONFIG.links.forEach(function (l) {
    var li = document.createElement('li');
    var a = document.createElement('a');
    a.href = l.url;
    a.textContent = l.label;
    if (/^https?:/.test(l.url)) { a.target = '_blank'; a.rel = 'me noopener'; }
    li.appendChild(a);
    $('links').appendChild(li);
  });

  /* blocks fade in when scrolled into view */
  var blocks = document.querySelectorAll('.block');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    blocks.forEach(function (b) { io.observe(b); });
  } else {
    blocks.forEach(function (b) { b.classList.add('in'); });
  }

  /* projects from GitHub */
  var list = $('repo-list');
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
