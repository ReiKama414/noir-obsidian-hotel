/* ==========================================================================
   L'Obsidienne — GSAP + ScrollTrigger choreography
   ========================================================================== */

(function () {
  if (typeof gsap === 'undefined') return;

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  const suiteTriggers = [];
  const sceneTriggers = [];

  function wrapRevealUnits(el) {
    if (!el || el.dataset.wordsWrapped) return;
    const text = el.textContent.trim();
    el.textContent = '';
    const isCjk = /[\u3400-\u9fff]/.test(text);

    if (isCjk) {
      Array.from(text).forEach((ch) => {
        if (ch === '\n' || ch === '\r') return;
        const span = document.createElement('span');
        span.className = 'word word--cjk';
        span.textContent = ch === ' ' ? '\u00a0' : ch;
        el.appendChild(span);
      });
    } else {
      text.split(/\s+/).forEach((word) => {
        const span = document.createElement('span');
        span.className = 'word';
        span.textContent = word;
        el.appendChild(span);
        el.appendChild(document.createTextNode(' '));
      });
    }
    el.dataset.wordsWrapped = '1';
  }

  function waitForScene(cb, tries = 0) {
    if (window.ObsidianScene) {
      cb(window.ObsidianScene);
      return;
    }
    if (tries > 40) return;
    setTimeout(() => waitForScene(cb, tries + 1), 100);
  }

  function killSuiteTriggers() {
    while (suiteTriggers.length) {
      const t = suiteTriggers.pop();
      if (t && t.kill) t.kill();
    }
  }

  function killSceneTriggers() {
    while (sceneTriggers.length) {
      const t = sceneTriggers.pop();
      if (t && t.kill) t.kill();
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dur = reduceMotion ? 0.01 : 1;

    const header = document.getElementById('site-header');
    if (header && typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        start: 80,
        onUpdate: (self) => {
          header.classList.toggle('is-solid', self.scroll() > 80);
        }
      });
    }

    const progress = document.getElementById('scroll-progress');
    if (progress && typeof ScrollTrigger !== 'undefined') {
      gsap.to(progress, {
        scaleX: 1,
        transformOrigin: 'left center',
        ease: 'none',
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.4
        }
      });
      gsap.set(progress, { scaleX: 0, width: '100%' });
    }

    if (typeof ScrollTrigger !== 'undefined') {
      const navButtons = document.querySelectorAll('[data-nav-section]');
      const sectionIds = Array.from(navButtons).map((b) => b.getAttribute('data-nav-section'));
      sectionIds.forEach((id) => {
        const section = document.getElementById(id);
        if (!section) return;
        ScrollTrigger.create({
          trigger: section,
          start: 'top 42%',
          end: 'bottom 42%',
          onToggle: (self) => {
            if (!self.isActive) return;
            navButtons.forEach((b) => {
              b.classList.toggle('is-nav-active', b.getAttribute('data-nav-section') === id);
            });
          }
        });
      });
    }

    /* ------------------------------------------------------------------ */
    /* Hero entrance — mask rise, then quiet settle                        */
    /* ------------------------------------------------------------------ */
    gsap.set('.hero-brand .line span', { yPercent: 105 });
    gsap.set(['.gsap-hero-place', '.gsap-hero-subtitle', '.gsap-hero-cta'], {
      y: 18,
      opacity: 0
    });

    const heroTl = gsap.timeline({
      defaults: { ease: 'power4.out' },
      delay: reduceMotion ? 0 : 0.15
    });

    heroTl
      .to('.hero-brand .line span', {
        yPercent: 0,
        duration: reduceMotion ? 0.01 : 1.35
      })
      .to(
        '.gsap-hero-place',
        { y: 0, opacity: 1, duration: reduceMotion ? 0.01 : 0.8, ease: 'power3.out' },
        '-=0.7'
      )
      .to(
        '.gsap-hero-subtitle',
        { y: 0, opacity: 1, duration: reduceMotion ? 0.01 : 0.85, ease: 'power3.out' },
        '-=0.55'
      )
      .to(
        '.gsap-hero-cta',
        { y: 0, opacity: 1, duration: reduceMotion ? 0.01 : 0.7, ease: 'power3.out' },
        '-=0.45'
      );

    if (typeof ScrollTrigger !== 'undefined' && !reduceMotion) {
      // Exit: dissolve down-left — never fly through the monolith
      gsap.to('.hero-inner', {
        y: 36,
        opacity: 0,
        filter: 'blur(6px)',
        ease: 'none',
        scrollTrigger: {
          trigger: '#section-hero',
          start: 'top top',
          end: '65% top',
          scrub: 0.55
        }
      });

      gsap.to('.hero-veil', {
        opacity: 1.35,
        ease: 'none',
        scrollTrigger: {
          trigger: '#section-hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }

    /* ------------------------------------------------------------------ */
    /* Intro pin — character / word reveal                                 */
    /* ------------------------------------------------------------------ */
    let introTrigger = null;

    function setupIntroPin() {
      if (typeof ScrollTrigger === 'undefined') return;
      const quoteEl = document.querySelector('.gsap-intro-quote');
      if (!quoteEl) return;

      if (introTrigger) {
        introTrigger.kill();
        introTrigger = null;
      }

      delete quoteEl.dataset.wordsWrapped;
      // Restore plain text if spans remain from a prior locale
      if (quoteEl.querySelector('.word')) {
        quoteEl.textContent = quoteEl.textContent.replace(/\s+/g, (m) => (m.includes('\u00a0') ? ' ' : m));
      }

      wrapRevealUnits(quoteEl);
      const words = quoteEl.querySelectorAll('.word');
      const isCjk = /[\u3400-\u9fff]/.test(quoteEl.textContent || '');

      gsap.set('.gsap-intro-left', { y: reduceMotion ? 0 : 28, opacity: reduceMotion ? 1 : 0.25 });
      gsap.set(words, {
        opacity: reduceMotion ? 1 : 0.12,
        y: reduceMotion ? 0 : 10
      });

      if (reduceMotion) {
        gsap.set(['.gsap-intro-left', words], { clearProps: 'opacity,y' });
        return;
      }

      const introTl = gsap.timeline({
        scrollTrigger: {
          trigger: '#section-intro',
          start: 'top top',
          end: '+=140%',
          pin: true,
          scrub: 0.7,
          anticipatePin: 1
        }
      });

      introTl
        .to('.gsap-intro-left', { y: 0, opacity: 1, duration: 0.4, ease: 'none' }, 0)
        .to(
          words,
          {
            opacity: 1,
            y: 0,
            stagger: isCjk ? 0.018 : 0.045,
            duration: isCjk ? 0.28 : 0.45,
            ease: 'none'
          },
          0.12
        )
        .to({}, { duration: 0.25 });

      introTrigger = introTl.scrollTrigger;
    }

    setupIntroPin();
    document.addEventListener('obsidian:localechange', () => {
      requestAnimationFrame(() => {
        setupIntroPin();
        if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
      });
    });

    if (typeof ScrollTrigger !== 'undefined') {
      gsap.utils.toArray('.gsap-reveal').forEach((el) => {
        gsap.fromTo(
          el,
          { y: reduceMotion ? 0 : 40, opacity: reduceMotion ? 1 : 0 },
          {
            y: 0,
            opacity: 1,
            duration: reduceMotion ? 0.01 : 1.05,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 86%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });
    }

    function animateSuiteCards() {
      if (typeof ScrollTrigger === 'undefined') return;
      killSuiteTriggers();

      gsap.utils.toArray('.suite-card').forEach((card, i) => {
        const reveal = gsap.fromTo(
          card,
          { y: reduceMotion ? 0 : 48, opacity: reduceMotion ? 1 : 0 },
          {
            y: 0,
            opacity: 1,
            duration: reduceMotion ? 0.01 : 0.95,
            delay: reduceMotion ? 0 : i * 0.05,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
              toggleActions: 'play none none reverse'
            }
          }
        );
        if (reveal.scrollTrigger) suiteTriggers.push(reveal.scrollTrigger);

        const img = card.querySelector('img');
        if (img && !reduceMotion) {
          const parallax = gsap.fromTo(
            img,
            { yPercent: -5, scale: 1.06 },
            {
              yPercent: 5,
              scale: 1.06,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
              }
            }
          );
          if (parallax.scrollTrigger) suiteTriggers.push(parallax.scrollTrigger);
        }
      });

      ScrollTrigger.refresh();
    }

    window.refreshSuiteScrollAnims = animateSuiteCards;
    setTimeout(animateSuiteCards, 120);

    if (typeof ScrollTrigger !== 'undefined' && !reduceMotion) {
      const gasImg = document.querySelector('.gastronomy-visual img');
      if (gasImg) {
        gsap.fromTo(
          gasImg,
          { scale: 1.12, yPercent: -4 },
          {
            scale: 1.04,
            yPercent: 4,
            ease: 'none',
            scrollTrigger: {
              trigger: '#section-gastronomy',
              start: 'top bottom',
              end: 'bottom top',
              scrub: true
            }
          }
        );
      }
    }

    /* ------------------------------------------------------------------ */
    /* 3D scene — section-linked, restrained scrub (no mid-scroll explode) */
    /* ------------------------------------------------------------------ */
    waitForScene((sceneApi) => {
      if (typeof ScrollTrigger === 'undefined' || reduceMotion) return;
      killSceneTriggers();

      const proxy = {
        x: 0,
        y: 0.15,
        z: 0,
        camZ: 9.6,
        camY: 0.55,
        rotY: 0.08,
        rotX: 0.02,
        explode: 0
      };

      const applyScene = () => {
        if (!sceneApi || !sceneApi.monolithGroup || !sceneApi.camera || !sceneApi.state) return;
        if (sceneApi.state.orbitMode) return;
        sceneApi.monolithGroup.position.x = proxy.x;
        sceneApi.monolithGroup.position.y = proxy.y;
        sceneApi.monolithGroup.position.z = proxy.z;
        sceneApi.monolithGroup.rotation.y = proxy.rotY;
        sceneApi.monolithGroup.rotation.x = proxy.rotX;
        sceneApi.camera.position.z = proxy.camZ;
        sceneApi.camera.position.y = proxy.camY;
        sceneApi.state.explosionFactor = proxy.explode;
      };

      applyScene();

      const beats = [
        {
          trigger: '#section-hero',
          start: 'top top',
          end: 'bottom top',
          from: { x: 0, y: 0.15, camZ: 9.6, camY: 0.55, rotY: 0.08, rotX: 0.02, explode: 0 },
          to: { x: 0.35, y: 0.2, camZ: 9.1, camY: 0.45, rotY: 0.22, rotX: 0.04, explode: 0 }
        },
        {
          trigger: '#section-intro',
          start: 'top bottom',
          end: 'bottom top',
          from: { x: 0.35, y: 0.2, camZ: 9.1, camY: 0.45, rotY: 0.22, rotX: 0.04, explode: 0 },
          to: { x: 1.55, y: 0.1, camZ: 8.6, camY: 0.35, rotY: 0.48, rotX: 0.06, explode: 0 }
        },
        {
          trigger: '#section-sanctuaries',
          start: 'top bottom',
          end: 'bottom top',
          from: { x: 1.55, y: 0.1, camZ: 8.6, camY: 0.35, rotY: 0.48, rotX: 0.06, explode: 0 },
          to: { x: 2.1, y: 0.05, camZ: 8.3, camY: 0.3, rotY: 0.65, rotX: 0.02, explode: 0.04 }
        },
        {
          trigger: '#section-atelier',
          start: 'top bottom',
          end: 'bottom top',
          from: { x: 2.1, y: 0.05, camZ: 8.3, camY: 0.3, rotY: 0.65, rotX: 0.02, explode: 0.04 },
          to: { x: -0.15, y: 0.2, camZ: 7.4, camY: 0.2, rotY: -0.15, rotX: 0.08, explode: 0.35 }
        },
        {
          trigger: '#section-gastronomy',
          start: 'top bottom',
          end: 'bottom top',
          from: { x: -0.15, y: 0.2, camZ: 7.4, camY: 0.2, rotY: -0.15, rotX: 0.08, explode: 0.35 },
          to: { x: 0.4, y: 0.35, camZ: 9.2, camY: 0.5, rotY: 0.2, rotX: 0.03, explode: 0.08 }
        },
        {
          trigger: '#section-reservation',
          start: 'top bottom',
          end: 'bottom bottom',
          from: { x: 0.4, y: 0.35, camZ: 9.2, camY: 0.5, rotY: 0.2, rotX: 0.03, explode: 0.08 },
          to: { x: 0, y: 0.55, camZ: 10.8, camY: 0.7, rotY: 0.35, rotX: 0, explode: 0 }
        }
      ];

      beats.forEach((beat) => {
        const tween = gsap.fromTo(proxy, beat.from, {
          ...beat.to,
          ease: 'none',
          onUpdate: applyScene,
          scrollTrigger: {
            trigger: beat.trigger,
            start: beat.start,
            end: beat.end,
            scrub: 1.15
          }
        });
        if (tween.scrollTrigger) sceneTriggers.push(tween.scrollTrigger);
      });

      const webgl = document.getElementById('webgl-container');
      if (webgl) {
        const fade = gsap.fromTo(
          webgl,
          { opacity: 1 },
          {
            opacity: 0.28,
            ease: 'none',
            scrollTrigger: {
              trigger: '#section-reservation',
              start: 'top 75%',
              end: 'bottom bottom',
              scrub: true
            }
          }
        );
        if (fade.scrollTrigger) sceneTriggers.push(fade.scrollTrigger);
      }
    });

    function attachCardTilt() {
      if (reduceMotion || window.matchMedia('(hover: none)').matches) return;

      document.querySelectorAll('.suite-card').forEach((card) => {
        if (card.dataset.tiltBound) return;
        card.dataset.tiltBound = '1';

        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width;
          const y = (e.clientY - rect.top) / rect.height;
          gsap.to(card, {
            rotateX: (0.5 - y) * 3.5,
            rotateY: (x - 0.5) * 4.5,
            transformPerspective: 900,
            duration: 0.5,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.75,
            ease: 'power3.out'
          });
        });
      });
    }

    window.attachSuiteCardTilt = attachCardTilt;
    attachCardTilt();

    let resizeTimer = 0;
    window.addEventListener('resize', () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
      }, 150);
    });

    window.addEventListener('load', () => {
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
      });
    }

    window.addEventListener('pagehide', () => {
      killSuiteTriggers();
      killSceneTriggers();
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.getAll().forEach((t) => t.kill());
      gsap.globalTimeline.clear();
    });
  });
})();
