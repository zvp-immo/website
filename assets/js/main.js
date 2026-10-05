/* ZVP Immobilien – Navigation und Kontaktformular */
(function () {
  'use strict';

  var header = document.querySelector('.site-header');
  var nav = document.getElementById('nav');
  var menuBtn = document.getElementById('menu-btn');

  // Kopfzeile: feine Linie, sobald gescrollt wurde
  function onScroll() { header.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobiles Menü
  function closeMenu() { nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); }
  menuBtn.addEventListener('click', function () {
    menuBtn.setAttribute('aria-expanded', nav.classList.toggle('open'));
  });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  // Aktiven Abschnitt in der Navigation markieren (nur Startseite)
  var links = [].slice.call(nav.querySelectorAll('a[href^="#"]:not(.btn)'));
  if (links.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['start', 'ueber-uns', 'ankauf', 'bestand', 'team', 'kontakt'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) io.observe(el);
    });
  }

  // Kontaktformular: Versand per fetch an den Cloudflare Worker (/api/kontakt)
  var form = document.getElementById('contact-form');
  if (!form) return;
  var MAIL = 'ankauf@zvp-immo.de';
  var started = Date.now();
  var status = document.getElementById('form-status');
  var submit = form.querySelector('button[type="submit"]');
  var submitLabel = submit.innerHTML;

  function mailtoFallback(d) {
    var body = [
      'Ich bin: ' + d.get('rolle'),
      'Name: ' + d.get('name'),
      'E-Mail: ' + d.get('email'),
      'Telefon: ' + (d.get('telefon') || '–'),
      'Ort des Objekts: ' + (d.get('ort') || '–'),
      'Wohneinheiten: ' + (d.get('einheiten') || '–'),
      'Kaufpreisvorstellung: ' + (d.get('preis') || '–'),
      '',
      d.get('nachricht') || ''
    ].join('\n');
    return 'mailto:' + MAIL + '?subject=' + encodeURIComponent('Objektangebot' + (d.get('ort') ? ' – ' + d.get('ort') : '')) +
      '&body=' + encodeURIComponent(body);
  }

  function showError(message, d) {
    status.innerHTML = '';
    var p = document.createElement('span');
    p.textContent = message + ' ';
    status.appendChild(p);
    var tail = document.createElement('span');
    tail.innerHTML = 'Sie erreichen uns auch direkt per E-Mail an <a href="mailto:' + MAIL + '">' + MAIL + '</a> oder telefonisch.';
    status.appendChild(tail);
    var br = document.createElement('br');
    status.appendChild(br);
    var a = document.createElement('a');
    a.className = 'btn btn-ghost btn-sm';
    a.href = mailtoFallback(d);
    a.textContent = 'Anfrage per E-Mail-Programm senden';
    status.appendChild(a);
    status.hidden = false;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var d = new FormData(form);
    d.set('dauer', String(Math.round((Date.now() - started) / 1000)));
    status.hidden = true;
    submit.disabled = true;
    submit.textContent = 'Wird gesendet …';

    fetch(form.action, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new URLSearchParams(d)
    })
      .then(function (res) {
        return res.json().catch(function () { return { ok: false }; }).then(function (data) {
          if (res.ok && data.ok) return;
          var err = new Error(data.error || 'Die Nachricht konnte leider nicht gesendet werden.');
          err.fromServer = !!data.error;
          throw err;
        });
      })
      .then(function () {
        var done = document.getElementById('form-done');
        form.hidden = true;
        done.hidden = false;
        done.focus();
      })
      .catch(function (err) {
        var msg = err && err.fromServer ? err.message : 'Die Nachricht konnte leider nicht gesendet werden.';
        showError(msg, d);
      })
      .then(function () {
        submit.disabled = false;
        submit.innerHTML = submitLabel;
      });
  });
})();
