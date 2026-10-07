/* ============================================================
   ZONA CARIBE · MODULO MENU
   No conoce ni modifica variables internas de otros modulos.
   Comunica la navegación con el evento: zc:menu:navigate
   ============================================================ */
(() => {
  'use strict';

  const trigger = document.getElementById('zc-menu-trigger');
  const menu = document.getElementById('zc-menu');
  const pull = document.getElementById('zc-menu-pull');
  const pullPath = document.getElementById('zc-menu-pull-path');

  if (!trigger || !menu) return;

  const items = [...menu.querySelectorAll('.zc-menu__item')];
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  let open = false;
  let activeItem = items.find(item => item.classList.contains('is-active')) || items[0] || null;
  let lastFocused = null;
  let raf = 0;
  let pointerX = 0;
  let pointerY = 0;

  const colorMap = {
    inicio:   { hex: '#1677c4', rgb: '22,119,196' },
    agenda:   { hex: '#28a10f', rgb: '40,161,15' },
    servicios:{ hex: '#d2510e', rgb: '210,81,14' },
    geoubi:   { hex: '#b81180', rgb: '184,17,128' },
    evaluador:{ hex: '#b81180', rgb: '184,17,128' },
    asistencia:{ hex: '#168fa5', rgb: '22,143,165' }
  };

  function applyAccent(key) {
    const color = colorMap[key] || colorMap.inicio;
    root.style.setProperty('--zc-menu-accent', color.hex);
    root.style.setProperty('--zc-menu-accent-rgb', color.rgb);
  }

  function setActive(item, { navigate = false } = {}) {
    if (!item) return;

    items.forEach(el => el.classList.toggle('is-active', el === item));
    activeItem = item;

    const key = item.dataset.menuTarget || 'inicio';
    applyAccent(key);

    if (navigate) {
      document.dispatchEvent(new CustomEvent('zc:menu:navigate', {
        detail: { module: key }
      }));

      const knownTargets = {
        inicio: '#hero-module',
        agenda: '#agenda-module',
        servicios: '#servicios-module',
        geoubi: '#geoubi-module',
        evaluador: '#evaluador-module'
      };

      const target = document.querySelector(knownTargets[key]);
      if (target && key !== 'inicio') {
        target.dispatchEvent(new CustomEvent('zc:module:activate', { bubbles: true }));
      }
    }
  }

  function openMenu() {
    if (open) return;
    open = true;
    lastFocused = document.activeElement;
    document.body.classList.add('zc-menu-lock');
    trigger.setAttribute('aria-expanded', 'true');
    trigger.setAttribute('aria-label', 'Cerrar menú');
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    applyAccent(activeItem?.dataset.menuTarget || 'inicio');
    resetMagnet();

    const firstFocusable = menu.querySelector('.zc-menu__item');
    if (firstFocusable) {
      window.setTimeout(() => firstFocusable.focus({ preventScroll: true }), reduceMotion ? 0 : 330);
    }
  }

  function closeMenu({ restoreFocus = true } = {}) {
    if (!open) return;
    open = false;
    document.body.classList.remove('zc-menu-lock');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-label', 'Abrir menú');
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');

    if (restoreFocus && lastFocused && typeof lastFocused.focus === 'function') {
      window.setTimeout(() => lastFocused.focus({ preventScroll: true }), reduceMotion ? 0 : 120);
    }
  }

  function toggleMenu() {
    open ? closeMenu() : openMenu();
  }

  function trapFocus(event) {
    if (!open || event.key !== 'Tab') return;

    const focusable = [trigger, ...items].filter(el => !el.disabled);
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  trigger.addEventListener('click', toggleMenu);

  items.forEach(item => {
    item.addEventListener('pointerenter', () => {
      setActive(item);
    });

    item.addEventListener('focus', () => {
      setActive(item);
    });

    item.addEventListener('click', () => {
      const externalUrl = item.dataset.externalUrl;

      /*
        Asistencia es un acceso externo, no un módulo interno.
        Se abre directamente desde el gesto del usuario para evitar
        que el navegador bloquee la nueva pestaña como un popup.
      */
      if (externalUrl) {
        setActive(item);
        window.open(externalUrl, '_blank', 'noopener,noreferrer');
        window.setTimeout(() => closeMenu({ restoreFocus: false }), reduceMotion ? 0 : 120);
        return;
      }

      setActive(item, { navigate: true });
      window.setTimeout(() => closeMenu({ restoreFocus: false }), reduceMotion ? 0 : 170);
    });
  });

  menu.addEventListener('click', event => {
    if (event.target === menu) closeMenu();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && open) {
      event.preventDefault();
      closeMenu();
      return;
    }
    trapFocus(event);
  });

  /* ----------------------------------------------------------
     Efecto magnético / gravedad inspirado en la referencia.
     Solo funciona con mouse/trackpad; en táctil se desactiva.
     ---------------------------------------------------------- */
  function resetMagnet() {
    root.style.setProperty('--zc-menu-trigger-x', '0px');
    root.style.setProperty('--zc-menu-trigger-y', '0px');
    if (pull) pull.classList.remove('is-active');
  }

  function drawPull() {
    raf = 0;
    if (!canHover || open || !pull || !pullPath) return;

    const rect = trigger.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = pointerX - cx;
    const dy = pointerY - cy;
    const distance = Math.hypot(dx, dy);
    const zone = 165;

    if (distance >= zone) {
      resetMagnet();
      return;
    }

    const strength = 1 - (distance / zone);
    const tx = Math.max(-10, Math.min(18, dx * strength * .18));
    const ty = Math.max(-10, Math.min(18, dy * strength * .18));

    root.style.setProperty('--zc-menu-trigger-x', `${tx.toFixed(2)}px`);
    root.style.setProperty('--zc-menu-trigger-y', `${ty.toFixed(2)}px`);
    pull.classList.add('is-active');

    const h = Math.max(600, window.innerHeight);
    const y = Math.max(80, Math.min(h - 80, pointerY));
    const viewY = (y / h) * 1000;
    const bulge = 38 + strength * 72;
    const anchor = 150;
    const top = Math.max(0, viewY - anchor);
    const bottom = Math.min(1000, viewY + anchor);
    const curve = 115;

    const d = [
      'M0,0',
      'H40',
      `V${top.toFixed(1)}`,
      `C40,${(top + curve * .45).toFixed(1)} ${bulge.toFixed(1)},${(viewY - curve * .55).toFixed(1)} ${bulge.toFixed(1)},${viewY.toFixed(1)}`,
      `S40,${(viewY + curve * .55).toFixed(1)} 40,${bottom.toFixed(1)}`,
      'V1000',
      'H0Z'
    ].join(' ');

    pullPath.setAttribute('d', d);
  }

  function requestPullUpdate() {
    if (raf) return;
    raf = window.requestAnimationFrame(drawPull);
  }

  if (canHover && !reduceMotion) {
    window.addEventListener('pointermove', event => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      requestPullUpdate();
    }, { passive: true });

    window.addEventListener('pointerleave', resetMagnet, { passive: true });
    window.addEventListener('resize', resetMagnet, { passive: true });
  }

  /* Estado inicial */
  setActive(activeItem);
})();
