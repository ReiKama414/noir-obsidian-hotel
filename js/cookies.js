/* ==========================================================================
   L'Obsidienne — cookie consent (DEMO, 2024-style)
   ========================================================================== */

(function () {
  const COOKIE_NAME = 'lob_consent';
  const STORAGE_KEY = 'obsidian-cookie-consent';
  const MAX_AGE = 60 * 60 * 24 * 180; // 180 days

  function readCookie(name) {
    const match = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/[$()*+.?[\\\]^{|}]/g, '\\$&') + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : '';
  }

  function writeCookie(name, value) {
    document.cookie =
      name +
      '=' +
      encodeURIComponent(value) +
      '; Path=/; Max-Age=' +
      MAX_AGE +
      '; SameSite=Lax';
  }

  function getStoredChoice() {
    const fromCookie = readCookie(COOKIE_NAME);
    if (fromCookie) return fromCookie;
    try {
      return localStorage.getItem(STORAGE_KEY) || '';
    } catch (err) {
      return '';
    }
  }

  function saveChoice(choice) {
    // Value shaped like a 2024 hotel CMP token
    const payload = '2024.11|' + choice + '|demo';
    writeCookie(COOKIE_NAME, payload);
    try {
      localStorage.setItem(STORAGE_KEY, payload);
    } catch (err) {
      /* ignore */
    }
  }

  function hideBar(bar) {
    if (!bar) return;
    bar.classList.add('is-hiding');
    window.setTimeout(() => {
      bar.hidden = true;
      bar.classList.remove('is-open', 'is-hiding');
    }, 320);
  }

  function showBar(bar) {
    if (!bar) return;
    bar.hidden = false;
    requestAnimationFrame(() => bar.classList.add('is-open'));
  }

  function bind() {
    const bar = document.getElementById('cookie-consent');
    if (!bar) return;

    const existing = getStoredChoice();
    if (existing) {
      bar.hidden = true;
      return;
    }

    showBar(bar);

    const acceptBtn = document.getElementById('cookie-accept');
    const essentialBtn = document.getElementById('cookie-essential');

    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => {
        saveChoice('all');
        hideBar(bar);
      });
    }

    if (essentialBtn) {
      essentialBtn.addEventListener('click', () => {
        saveChoice('essential');
        hideBar(bar);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }
})();
