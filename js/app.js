/* ==========================================================================
   L'Obsidienne — suites, atelier, booking, modals
   ========================================================================== */

(function () {
  const SUITE_BASE = [
    {
      id: 'obsidian-penthouse',
      category: 'penthouse',
      size: '320 m² / 96 坪',
      floor: '88F',
      priceTWD: 68000,
      priceUSD: 2150,
      image: 'assets/images/penthouse_suite.jpg'
    },
    {
      id: 'imperial-onyx-pool',
      category: 'pool',
      size: '240 m² / 72 坪',
      floor: '82F',
      priceTWD: 52000,
      priceUSD: 1650,
      image: 'assets/images/onyx_pool_suite.jpg'
    },
    {
      id: 'royal-sovereign-marble',
      category: 'royal',
      size: '185 m² / 56 坪',
      floor: '76F–80F',
      priceTWD: 38000,
      priceUSD: 1200,
      image: 'assets/images/royal_marble_suite.jpg'
    }
  ];

  const HOTSPOT_VALUES = [
    ['94%', '98 GU', '99.2%'],
    ['99.9%', '97%', '95%'],
    ['96%', '98%', '99%'],
    ['99%', '96%', '98%']
  ];

  const ADDON_BASE = [
    { id: 'rolls-royce', priceTWD: 8800, priceUSD: 280 },
    { id: 'michelin-tasting', priceTWD: 16800, priceUSD: 530 },
    { id: 'midnight-spa', priceTWD: 12000, priceUSD: 380 },
    { id: 'sommelier-caviar', priceTWD: 22000, priceUSD: 690 }
  ];

  function tt(key, vars) {
    return window.ObsidianI18n ? window.ObsidianI18n.t(key, vars) : key;
  }

  function getSuites() {
    return SUITE_BASE.map((base) => {
      const loc = window.ObsidianI18n ? window.ObsidianI18n.getSuite(base.id) : {};
      return Object.assign({}, base, loc);
    });
  }

  function getHotspot(index) {
    const loc = window.ObsidianI18n
      ? window.ObsidianI18n.getHotspot(index)
      : { title: '', subtitle: '', desc: '', metrics: [{}, {}, {}] };
    const values = HOTSPOT_VALUES[index] || HOTSPOT_VALUES[0];
    return {
      index,
      code: 'SPEC — 0' + (index + 1),
      title: loc.title,
      subtitle: loc.subtitle,
      desc: loc.desc,
      metrics: loc.metrics.map((m, i) => ({ label: m.label, value: values[i] }))
    };
  }

  function getAddons() {
    return ADDON_BASE.map((base) => ({
      id: base.id,
      priceTWD: base.priceTWD,
      priceUSD: base.priceUSD,
      name: window.ObsidianI18n ? window.ObsidianI18n.getAddonName(base.id) : base.id
    }));
  }

  let currentFilter = 'all';
  let currentCurrency = 'TWD';
  let selectedSuiteId = 'obsidian-penthouse';
  let selectedAddons = new Set(['rolls-royce']);
  let nightsCount = 2;
  let guestsCount = 2;
  let soundEnabled = false;
  let audioCtx = null;
  let isSubmitting = false;
  let activeOverlay = null;
  let overlayHistoryPushed = false;

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function playLuxuryChime(freqBase = 432) {
    if (!soundEnabled) return;
    try {
      if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;
        audioCtx = new AudioContextClass();
      }
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const now = audioCtx.currentTime;
      ;[freqBase, freqBase * 1.25, freqBase * 1.5].forEach((f, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = idx === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(f, now);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.035 / (idx + 1), now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 1.85);
      });
    } catch (err) {
      /* ignore audio restrictions */
    }
  }

  function formatMoney(twd, usd) {
    if (currentCurrency === 'USD') return `US$ ${usd.toLocaleString()}`;
    return `NT$ ${twd.toLocaleString()}`;
  }

  function scrollToSection(targetId) {
    const targetEl = document.getElementById(targetId);
    if (!targetEl) return;
    const header = document.getElementById('site-header');
    const offset = header ? header.offsetHeight + 8 : 80;
    const top = targetEl.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }

  function setBodyScrollLock(locked) {
    document.body.classList.toggle('is-modal-open', locked);
  }

  function pushOverlayHistory(id) {
    if (overlayHistoryPushed) return;
    try {
      history.pushState({ overlay: id }, '');
      overlayHistoryPushed = true;
    } catch (err) {
      /* ignore */
    }
  }

  function clearOverlayHistoryFlag() {
    overlayHistoryPushed = false;
  }

  function openOverlay(modal, focusEl) {
    if (!modal) return;
    activeOverlay = modal;
    modal.hidden = false;
    modal.classList.add('is-open');
    setBodyScrollLock(true);
    pushOverlayHistory(modal.id);
    const focusTarget = focusEl || modal.querySelector('.modal-close, .modal-panel');
    if (focusTarget) {
      window.setTimeout(() => focusTarget.focus(), 30);
    }
  }

  function closeOverlay(modal, fromPopstate) {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.hidden = true;
    if (activeOverlay === modal) activeOverlay = null;
    const anyOpen = document.querySelector('.modal.is-open');
    if (!anyOpen) setBodyScrollLock(false);

    if (!fromPopstate && overlayHistoryPushed) {
      clearOverlayHistoryFlag();
      try {
        history.back();
      } catch (err) {
        /* ignore */
      }
    } else if (fromPopstate) {
      clearOverlayHistoryFlag();
    }
  }

  function closeSuiteModal(fromPopstate) {
    closeOverlay(document.getElementById('suite-detail-modal'), fromPopstate);
  }

  function closePassModal(fromPopstate) {
    closeOverlay(document.getElementById('vip-pass-modal'), fromPopstate);
    isSubmitting = false;
    const submitBtn = document.getElementById('btn-submit-booking');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = tt('summary_submit');
    }
  }

  function closeMobileMenu() {
    const drawer = document.getElementById('mobile-nav-drawer');
    const btn = document.getElementById('btn-mobile-menu');
    if (!drawer) return;
    drawer.classList.remove('is-open');
    drawer.hidden = true;
    if (btn) {
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', tt('aria_menu_open'));
    }
  }

  function openMobileMenu() {
    const drawer = document.getElementById('mobile-nav-drawer');
    const btn = document.getElementById('btn-mobile-menu');
    if (!drawer) return;
    drawer.hidden = false;
    drawer.classList.add('is-open');
    if (btn) {
      btn.setAttribute('aria-expanded', 'true');
      btn.setAttribute('aria-label', tt('aria_menu_close'));
    }
  }

  function renderSuites() {
    const grid = document.getElementById('suites-grid');
    if (!grid) return;
    const SUITES = getSuites();

    const filtered =
      currentFilter === 'all' ? SUITES : SUITES.filter((s) => s.category === currentFilter);

    grid.innerHTML = filtered
      .map((s) => {
        const priceStr = formatMoney(s.priceTWD, s.priceUSD);
        return `
        <article class="suite-card" data-suite-id="${escapeHtml(s.id)}">
          <div class="suite-card-media">
            <img src="${escapeHtml(s.image)}" alt="${escapeHtml(s.name)}" loading="lazy" decoding="async" width="800" height="1000" />
          </div>
          <div class="suite-card-meta">
            <p class="cat">${escapeHtml(s.categoryLabel)}</p>
            <h3>${escapeHtml(s.name)}</h3>
            <p class="desc">${escapeHtml(s.description)}</p>
          </div>
          <div class="suite-card-foot">
            <div class="suite-price">${escapeHtml(priceStr)}<span>${escapeHtml(tt('suite_per_night'))}</span></div>
            <div class="suite-actions">
              <button type="button" class="btn-suite-detail" data-suite-id="${escapeHtml(s.id)}">${escapeHtml(tt('suite_detail'))}</button>
              <button type="button" class="btn-suite-book" data-suite-id="${escapeHtml(s.id)}">${escapeHtml(tt('suite_book'))}</button>
            </div>
          </div>
        </article>`;
      })
      .join('');

    if (typeof window.attachSuiteCardTilt === 'function') window.attachSuiteCardTilt();
    if (typeof window.refreshSuiteScrollAnims === 'function') window.refreshSuiteScrollAnims();

    grid.querySelectorAll('.btn-suite-detail').forEach((btn) => {
      btn.addEventListener('click', () => {
        playLuxuryChime(528);
        openSuiteModal(btn.getAttribute('data-suite-id'));
      });
    });

    grid.querySelectorAll('.btn-suite-book').forEach((btn) => {
      btn.addEventListener('click', () => {
        playLuxuryChime(587);
        selectSuiteForBooking(btn.getAttribute('data-suite-id'), true);
      });
    });
  }

  function openSuiteModal(suiteId) {
    const suite = getSuites().find((s) => s.id === suiteId);
    const modal = document.getElementById('suite-detail-modal');
    const content = document.getElementById('suite-detail-body');
    if (!suite || !modal || !content) return;

    const priceStr = formatMoney(suite.priceTWD, suite.priceUSD);
    content.innerHTML = `
      <div class="suite-modal-grid">
        <div class="suite-modal-media">
          <img src="${escapeHtml(suite.image)}" alt="${escapeHtml(suite.name)}" width="900" height="560" />
        </div>
        <div>
          <p class="section-label">${escapeHtml(suite.categoryLabel)}</p>
          <h3 id="suite-modal-title" class="section-title suite-modal-title">${escapeHtml(suite.name)}</h3>
          <p class="section-lede">${escapeHtml(suite.description)}</p>
          <p class="suite-modal-meta">${escapeHtml(suite.size)} · ${escapeHtml(suite.floor)} · ${escapeHtml(suite.guests)}</p>
          <ul class="suite-modal-features">
            ${suite.features
              .map((f) => `<li>${escapeHtml(f)}</li>`)
              .join('')}
          </ul>
          <div class="suite-modal-foot">
            <div>
              <span class="suite-modal-price-label">${escapeHtml(tt('suite_nightly'))}</span>
              <span class="suite-price suite-modal-price">${escapeHtml(priceStr)}</span>
            </div>
            <button type="button" id="modal-select-suite-btn" data-suite-id="${escapeHtml(suite.id)}" class="btn-solid">${escapeHtml(tt('suite_select'))}</button>
          </div>
        </div>
      </div>`;

    openOverlay(modal, document.getElementById('btn-close-suite-modal'));

    if (typeof gsap !== 'undefined') {
      gsap.fromTo(
        '#suite-detail-card',
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, ease: 'power3.out' }
      );
    }

    const selectBtn = document.getElementById('modal-select-suite-btn');
    if (selectBtn) {
      selectBtn.addEventListener('click', () => {
        closeSuiteModal();
        selectSuiteForBooking(suite.id, true);
      });
    }
  }

  function renderHotspotDetail(idx) {
    const item = getHotspot(idx);
    const codeEl = document.getElementById('atelier-spec-code');
    const titleEl = document.getElementById('atelier-spec-title');
    const subEl = document.getElementById('atelier-spec-subtitle');
    const descEl = document.getElementById('atelier-spec-desc');
    const metricsEl = document.getElementById('atelier-spec-metrics');

    if (codeEl) codeEl.textContent = item.code;
    if (titleEl) titleEl.textContent = item.title;
    if (subEl) subEl.textContent = item.subtitle;
    if (descEl) descEl.textContent = item.desc;

    if (metricsEl) {
      metricsEl.innerHTML = item.metrics
        .map((m) => {
          const width = m.value.includes('%') ? m.value : '96%';
          return `
        <div class="metric-row">
          <div class="top">
            <span>${escapeHtml(m.label)}</span>
            <strong>${escapeHtml(m.value)}</strong>
          </div>
          <div class="metric-track">
            <div class="metric-fill atelier-bar-fill" data-width="${escapeHtml(width)}"></div>
          </div>
        </div>`;
        })
        .join('');

      if (typeof gsap !== 'undefined') {
        gsap.fromTo(
          metricsEl.querySelectorAll('.metric-fill'),
          { width: '0%' },
          {
            width: (i, el) => el.getAttribute('data-width') || '96%',
            duration: 0.8,
            stagger: 0.08,
            ease: 'power2.out'
          }
        );
      }
    }

    if (typeof gsap !== 'undefined') {
      gsap.fromTo(
        '#atelier-detail-box',
        { opacity: 0.4, y: 16 },
        { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }
      );
    }

    if (window.ObsidianScene) window.ObsidianScene.focusHotspot(idx);
  }

  function selectSuiteForBooking(suiteId, scrollToBooking) {
    selectedSuiteId = suiteId;
    const selectEl = document.getElementById('booking-suite-select');
    if (selectEl) selectEl.value = suiteId;
    updateBookingSummary();
    if (scrollToBooking) scrollToSection('section-reservation');
  }

  function renderAddonsList() {
    const container = document.getElementById('booking-addons-list');
    if (!container) return;
    const ADDONS = getAddons();

    container.innerHTML = ADDONS.map((addon) => {
      const active = selectedAddons.has(addon.id);
      const priceStr = formatMoney(addon.priceTWD, addon.priceUSD);
      return `
        <button type="button" data-addon-id="${escapeHtml(addon.id)}" class="addon-toggle-btn${active ? ' is-active' : ''}" aria-pressed="${active ? 'true' : 'false'}">
          <span class="addon-left">
            <span class="mark" aria-hidden="true"></span>
            <span>${escapeHtml(addon.name)}</span>
          </span>
          <span>+ ${escapeHtml(priceStr)}</span>
        </button>`;
    }).join('');

    container.querySelectorAll('.addon-toggle-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-addon-id');
        if (selectedAddons.has(id)) selectedAddons.delete(id);
        else selectedAddons.add(id);
        playLuxuryChime(480);
        renderAddonsList();
        updateBookingSummary();
      });
    });
  }

  function updateBookingSummary() {
    const SUITES = getSuites();
    const ADDONS = getAddons();
    const suite = SUITES.find((s) => s.id === selectedSuiteId) || SUITES[0];
    const suitePriceTWD = suite.priceTWD * nightsCount;
    const suitePriceUSD = suite.priceUSD * nightsCount;

    let addonsTWD = 0;
    let addonsUSD = 0;
    selectedAddons.forEach((id) => {
      const a = ADDONS.find((x) => x.id === id);
      if (a) {
        addonsTWD += a.priceTWD;
        addonsUSD += a.priceUSD;
      }
    });

    const nameEl = document.getElementById('summary-suite-name');
    const nightsEl = document.getElementById('summary-nights-text');
    const roomCostEl = document.getElementById('summary-room-cost');
    const addonCostEl = document.getElementById('summary-addon-cost');
    const totalEl = document.getElementById('summary-total-cost');

    if (nameEl) nameEl.textContent = suite.name;
    if (nightsEl) nightsEl.textContent = tt('trip_line', { nights: nightsCount, guests: guestsCount });
    if (roomCostEl) roomCostEl.textContent = formatMoney(suitePriceTWD, suitePriceUSD);
    if (addonCostEl) addonCostEl.textContent = formatMoney(addonsTWD, addonsUSD);
    if (totalEl) totalEl.textContent = formatMoney(suitePriceTWD + addonsTWD, suitePriceUSD + addonsUSD);
  }

  function syncCurrencyBadge() {
    const badge = document.getElementById('currency-badge');
    if (badge) badge.textContent = currentCurrency === 'TWD' ? 'NT$' : 'US$';
    const currencyBtn = document.getElementById('btn-currency-toggle');
    if (currencyBtn) {
      currencyBtn.dataset.currency = currentCurrency;
      currencyBtn.setAttribute('title', tt('aria_currency') + ' · ' + currentCurrency);
    }
  }

  function syncSoundIcons() {
    const soundBtn = document.getElementById('btn-sound-toggle');
    if (!soundBtn) return;
    const offIcon = soundBtn.querySelector('.icon-sound-off');
    const onIcon = soundBtn.querySelector('.icon-sound-on');
    if (offIcon) offIcon.hidden = soundEnabled;
    if (onIcon) onIcon.hidden = !soundEnabled;
    soundBtn.classList.toggle('is-active', soundEnabled);
    soundBtn.setAttribute('aria-pressed', soundEnabled ? 'true' : 'false');
    const ariaKey = soundEnabled ? 'aria_sound_on' : 'aria_sound_off';
    soundBtn.setAttribute('aria-label', tt(ariaKey));
    soundBtn.setAttribute('title', tt(ariaKey));
    soundBtn.setAttribute('data-i18n-aria', ariaKey);
    soundBtn.setAttribute('data-i18n-title', ariaKey);
  }

  function refreshLocalizedDynamic() {
    const notes = document.getElementById('booking-special-notes');
    if (notes && (!notes.dataset.touched || notes.value === notes.dataset.lastDefault)) {
      notes.value = tt('notes_default');
      notes.dataset.lastDefault = notes.value;
    }
    renderSuites();
    renderAddonsList();
    updateBookingSummary();
    const activeHotspot = document.querySelector('.btn-atelier-hotspot.is-active');
    const idx = activeHotspot ? parseInt(activeHotspot.getAttribute('data-hotspot'), 10) || 0 : 0;
    renderHotspotDetail(idx);

    const explodeBtn = document.getElementById('btn-3d-explode');
    if (explodeBtn) {
      const on = explodeBtn.classList.contains('is-active');
      const key = on ? 'explode_on' : 'explode';
      explodeBtn.textContent = tt(key);
      explodeBtn.setAttribute('data-i18n', key);
    }
    const orbitBtn = document.getElementById('btn-3d-orbit');
    if (orbitBtn) {
      const on = orbitBtn.classList.contains('is-active');
      const key = on ? 'orbit_on' : 'orbit';
      orbitBtn.textContent = tt(key);
      orbitBtn.setAttribute('data-i18n', key);
    }

    syncCurrencyBadge();
    syncSoundIcons();

    const menuBtn = document.getElementById('btn-mobile-menu');
    const drawer = document.getElementById('mobile-nav-drawer');
    if (menuBtn && drawer) {
      const open = drawer.classList.contains('is-open');
      const menuKey = open ? 'aria_menu_close' : 'aria_menu_open';
      menuBtn.setAttribute('aria-label', tt(menuKey));
      menuBtn.setAttribute('data-i18n-aria', menuKey);
    }
  }

  function validateBookingForm() {
    const nameInput = document.getElementById('booking-guest-name');
    const dateInput = document.getElementById('booking-checkin-date');
    const errName = document.getElementById('err-guest-name');
    const errDate = document.getElementById('err-checkin');
    let ok = true;

    const name = (nameInput?.value || '').trim();
    if (!name || name.length > 60) {
      if (errName) errName.hidden = false;
      if (nameInput) nameInput.setAttribute('aria-invalid', 'true');
      ok = false;
    } else {
      if (errName) errName.hidden = true;
      if (nameInput) nameInput.removeAttribute('aria-invalid');
    }

    const dateVal = dateInput?.value || '';
    if (!dateVal) {
      if (errDate) errDate.hidden = false;
      if (dateInput) dateInput.setAttribute('aria-invalid', 'true');
      ok = false;
    } else {
      if (errDate) errDate.hidden = true;
      if (dateInput) dateInput.removeAttribute('aria-invalid');
    }

    return ok;
  }

  window.addEventListener('DOMContentLoaded', () => {
    const notesField = document.getElementById('booking-special-notes');
    if (notesField) {
      notesField.value = tt('notes_default');
      notesField.dataset.lastDefault = notesField.value;
      notesField.addEventListener('input', () => {
        notesField.dataset.touched = '1';
      });
    }

    renderSuites();
    renderHotspotDetail(0);
    renderAddonsList();
    updateBookingSummary();
    syncCurrencyBadge();
    syncSoundIcons();

    if (window.ObsidianI18n && typeof window.ObsidianI18n.onChange === 'function') {
      window.ObsidianI18n.onChange(() => refreshLocalizedDynamic());
    } else {
      document.addEventListener('obsidian:localechange', () => refreshLocalizedDynamic());
    }

    document.querySelectorAll('[data-scroll-to]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-scroll-to');
        playLuxuryChime(440);
        scrollToSection(targetId);
        closeMobileMenu();
      });
    });

    const mobileMenuBtn = document.getElementById('btn-mobile-menu');
    const mobileMenuDrawer = document.getElementById('mobile-nav-drawer');
    if (mobileMenuBtn && mobileMenuDrawer) {
      mobileMenuBtn.addEventListener('click', () => {
        const open = mobileMenuDrawer.classList.contains('is-open');
        if (open) closeMobileMenu();
        else openMobileMenu();
      });
    }

    const currencyBtn = document.getElementById('btn-currency-toggle');
    if (currencyBtn) {
      currencyBtn.addEventListener('click', () => {
        currentCurrency = currentCurrency === 'TWD' ? 'USD' : 'TWD';
        syncCurrencyBadge();
        playLuxuryChime(512);
        renderSuites();
        renderAddonsList();
        updateBookingSummary();
      });
    }

    const soundBtn = document.getElementById('btn-sound-toggle');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        syncSoundIcons();
        if (soundEnabled) playLuxuryChime(432);
      });
    }

    document.querySelectorAll('.btn-marble-theme').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.btn-marble-theme').forEach((b) => {
          b.classList.remove('is-active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-pressed', 'true');
        playLuxuryChime(495);
        if (window.ObsidianScene) window.ObsidianScene.setMarbleTheme(btn.getAttribute('data-theme'));
      });
    });

    const explodeBtn = document.getElementById('btn-3d-explode');
    if (explodeBtn) {
      explodeBtn.addEventListener('click', () => {
        playLuxuryChime(396);
        if (window.ObsidianScene) {
          const isExp = window.ObsidianScene.toggleExplode();
          explodeBtn.classList.toggle('is-active', isExp);
          explodeBtn.setAttribute('aria-pressed', isExp ? 'true' : 'false');
          const key = isExp ? 'explode_on' : 'explode';
          explodeBtn.textContent = tt(key);
          explodeBtn.setAttribute('data-i18n', key);
        }
      });
    }

    const orbitBtn = document.getElementById('btn-3d-orbit');
    if (orbitBtn) {
      orbitBtn.addEventListener('click', () => {
        playLuxuryChime(528);
        if (window.ObsidianScene) {
          const isOrb = window.ObsidianScene.toggleOrbitInspect();
          orbitBtn.classList.toggle('is-active', isOrb);
          orbitBtn.setAttribute('aria-pressed', isOrb ? 'true' : 'false');
          const key = isOrb ? 'orbit_on' : 'orbit';
          orbitBtn.textContent = tt(key);
          orbitBtn.setAttribute('data-i18n', key);
          const webgl = document.getElementById('webgl-container');
          if (webgl) webgl.classList.toggle('is-interactive', isOrb);
        }
      });
    }

    document.querySelectorAll('.btn-suite-filter').forEach((btn) => {
      btn.addEventListener('click', () => {
        currentFilter = btn.getAttribute('data-filter');
        document.querySelectorAll('.btn-suite-filter').forEach((b) => {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');
        playLuxuryChime(460);
        renderSuites();
      });
    });

    document.querySelectorAll('.btn-atelier-hotspot').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-hotspot'), 10) || 0;
        document.querySelectorAll('.btn-atelier-hotspot').forEach((b) => {
          b.classList.remove('is-active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-pressed', 'true');
        playLuxuryChime(540);
        renderHotspotDetail(idx);
      });
    });

    const closeSuiteBtn = document.getElementById('btn-close-suite-modal');
    if (closeSuiteBtn) closeSuiteBtn.addEventListener('click', () => closeSuiteModal());

    const closePassBtn = document.getElementById('btn-close-vip-pass');
    if (closePassBtn) closePassBtn.addEventListener('click', () => closePassModal());

    document.querySelectorAll('.modal').forEach((modal) => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          if (modal.id === 'suite-detail-modal') closeSuiteModal();
          if (modal.id === 'vip-pass-modal') closePassModal();
        }
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      if (activeOverlay) {
        if (activeOverlay.id === 'vip-pass-modal') closePassModal();
        else if (activeOverlay.id === 'suite-detail-modal') closeSuiteModal();
        return;
      }
      closeMobileMenu();
    });

    window.addEventListener('popstate', () => {
      if (activeOverlay) {
        if (activeOverlay.id === 'vip-pass-modal') closePassModal(true);
        else if (activeOverlay.id === 'suite-detail-modal') closeSuiteModal(true);
      }
    });

    const suiteSelect = document.getElementById('booking-suite-select');
    if (suiteSelect) {
      suiteSelect.addEventListener('change', (e) => {
        selectedSuiteId = e.target.value;
        updateBookingSummary();
      });
    }

    const nightsInput = document.getElementById('booking-nights-select');
    if (nightsInput) {
      nightsInput.addEventListener('change', (e) => {
        nightsCount = parseInt(e.target.value, 10) || 2;
        updateBookingSummary();
      });
    }

    const guestsInput = document.getElementById('booking-guests-select');
    if (guestsInput) {
      guestsInput.addEventListener('change', (e) => {
        guestsCount = parseInt(e.target.value, 10) || 2;
        updateBookingSummary();
      });
    }

    const bookingForm = document.getElementById('bespoke-reservation-form');
    if (bookingForm) {
      bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        if (!validateBookingForm()) return;

        isSubmitting = true;
        const submitBtn = document.getElementById('btn-submit-booking');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = tt('summary_submitting');
        }

        playLuxuryChime(660);

        const guestName = (
          document.getElementById('booking-guest-name')?.value || tt('guest_fallback')
        )
          .trim()
          .slice(0, 60);
        const checkInDate = document.getElementById('booking-checkin-date')?.value || '';
        const specialReq = (document.getElementById('booking-special-notes')?.value || '')
          .trim()
          .slice(0, 200);
        const SUITES = getSuites();
        const suite = SUITES.find((s) => s.id === selectedSuiteId) || SUITES[0];
        const totalText = document.getElementById('summary-total-cost')?.textContent || '';
        const code = 'OBS-' + Math.floor(100000 + Math.random() * 900000);

        const passModal = document.getElementById('vip-pass-modal');
        const passBody = document.getElementById('vip-pass-body');
        if (passModal && passBody) {
          passBody.innerHTML = `
            <div>
              <p class="section-label">${escapeHtml(tt('pass_label'))}</p>
              <h4 id="vip-pass-title" class="section-title suite-modal-title">${escapeHtml(tt('pass_title'))}</h4>
              <p id="vip-pass-code" class="pass-code">${escapeHtml(code)}</p>
              <div class="summary-lines pass-lines">
                <div><span>${escapeHtml(tt('pass_guest'))}</span><strong>${escapeHtml(guestName)}</strong></div>
                <div><span>${escapeHtml(tt('pass_checkin'))}</span><strong>${escapeHtml(
                  tt('pass_stay', { date: checkInDate, nights: nightsCount, guests: guestsCount })
                )}</strong></div>
                <div><span>${escapeHtml(tt('pass_suite'))}</span><strong>${escapeHtml(suite.name)}</strong></div>
                <div><span>${escapeHtml(tt('pass_notes'))}</span><strong>${escapeHtml(
                  specialReq || tt('pass_none')
                )}</strong></div>
              </div>
              <div class="summary-total">
                <span class="label">${escapeHtml(tt('pass_total'))}</span>
                <span class="value pass-total">${escapeHtml(totalText)}</span>
              </div>
              <button type="button" id="btn-copy-pass-code" data-code="${escapeHtml(code)}" class="btn-solid btn-block">${escapeHtml(
                tt('pass_copy')
              )}</button>
            </div>`;

          openOverlay(passModal, document.getElementById('btn-close-vip-pass'));

          if (typeof gsap !== 'undefined') {
            gsap.fromTo(
              '#vip-pass-modal .modal-panel',
              { y: 24, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }
            );
          }

          const copyBtn = document.getElementById('btn-copy-pass-code');
          if (copyBtn) {
            copyBtn.addEventListener('click', async () => {
              const c = copyBtn.getAttribute('data-code') || code;
              try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                  await navigator.clipboard.writeText(c);
                } else {
                  const tempInput = document.createElement('textarea');
                  tempInput.value = c;
                  document.body.appendChild(tempInput);
                  tempInput.select();
                  document.execCommand('copy');
                  document.body.removeChild(tempInput);
                }
                copyBtn.textContent = tt('pass_copied', { code: c });
              } catch (err) {
                copyBtn.textContent = tt('pass_copy_fail', { code: c });
              }
            });
          }
        } else {
          isSubmitting = false;
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = tt('summary_submit');
          }
        }
      });
    }
  });
})();
