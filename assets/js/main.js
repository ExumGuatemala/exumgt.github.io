(function () {
  'use strict';

  // Mobile nav toggle
  var navToggle = document.getElementById('nav-toggle');
  var navLinks = document.getElementById('nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var open = navToggle.classList.toggle('open');
      navLinks.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Country / pricing panel switch (igroom pages only).
  // All three countries' prices are already in the HTML; this only
  // decides which one is visible — no content is fetched or swapped.
  var countrySwitch = document.getElementById('country-switch');
  if (countrySwitch) {
    var SUPPORTED_COUNTRIES = ['US', 'GT', 'HN'];

    countrySwitch.addEventListener('change', function () {
      document.body.setAttribute('data-country', countrySwitch.value);
    });

    var ipinfoToken = '5b51fdcfac5412';
    var controller = new AbortController();
    var timeout = setTimeout(function () { controller.abort(); }, 3000);

    fetch('https://api.ipinfo.io/lite/me', {
      headers: { Authorization: 'Bearer ' + ipinfoToken },
      signal: controller.signal
    })
      .then(function (response) {
        if (!response.ok) throw new Error('geo lookup failed');
        return response.json();
      })
      .then(function (data) {
        var code = data && data.country_code;
        if (code && SUPPORTED_COUNTRIES.indexOf(code) !== -1) {
          countrySwitch.value = code;
          document.body.setAttribute('data-country', code);
        }
      })
      .catch(function () {
        // Network error, timeout, or unsupported country: keep the
        // server-rendered default (Guatemala).
      })
      .finally(function () { clearTimeout(timeout); });
  }

  // GA4 contact events (guia-seo.md section 8.1)
  document.querySelectorAll('[data-evento]').forEach(function (el) {
    el.addEventListener('click', function () {
      if (typeof gtag === 'function') {
        gtag('event', el.dataset.evento, { ubicacion: el.dataset.ubicacion });
      }
    });
  });
})();
