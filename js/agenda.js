/* ============================================================
   ZONA CARIBE · AGENDA INTELIGENTE + MINUTOGRAMA · V11
   ------------------------------------------------------------
   Entrega en .txt por solicitud del usuario.
   En producción renombrar como: agenda.js

   MEJORAS V11
   - No reconstruye la agenda cada 30 segundos.
   - El contador sí se actualiza cada segundo, sin recrear el DOM.
   - Al volver a la pestaña solo sincroniza estados; no parpadea.
   - Los eventos vencidos desaparecen individualmente.
   - Conserva abierto el minutograma que el usuario haya desplegado.
   - Admite grupos internos dentro del minutograma.
   ============================================================ */

(() => {
  'use strict';

  function initAgenda() {
    const moduleEl = document.getElementById('agenda-module');
    const listEl = document.getElementById('agenda-list');
    const scrollEl = document.getElementById('agenda-scroll');
    const emptyEl = document.getElementById('agenda-empty');
    const closeBtn = document.getElementById('agenda-close');
    const motionPath = document.getElementById('agenda-motion-line');
    const titleEl = document.getElementById('agenda-title');

    if (!moduleEl || !listEl || !scrollEl || !window.ZC_AGENDA_CONFIG) return false;
    if (moduleEl.dataset.zcAgendaReady === '1') return true;

    moduleEl.dataset.zcAgendaReady = '1';
    window.__ZC_AGENDA_READY = true;

    const config = window.ZC_AGENDA_CONFIG;
    const sourceEvents = Array.isArray(config.eventos) ? config.eventos : [];
    const offset = config.offsetISO || '-05:00';
    const fallbackRoom = 'Por confirmar';
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches;

    const palette = ['#1677c4', '#28a10f', '#d2510e', '#b81180'];
    const expandedMinutes = new Set();

    const spotlight = {
      label: document.getElementById('agenda-status-label'),
      time: document.getElementById('agenda-status-time'),
      title: document.getElementById('agenda-status-title'),
      room: document.getElementById('agenda-status-room'),
      countdown: document.getElementById('agenda-status-countdown'),
      day: document.getElementById('agenda-orbit-day'),
      month: document.getElementById('agenda-orbit-month'),
      orbit: document.getElementById('agenda-orbit')
    };

    const iconClock = `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="8"></circle>
        <path d="M12 8v4l3 2"></path>
      </svg>`;

    const iconRoom = `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 20V7.5A1.5 1.5 0 0 1 7.5 6H18v14"></path>
        <path d="M6 20H4"></path>
        <path d="M14 12h.01"></path>
      </svg>`;

    let isOpen = false;
    let tickTimer = null;
    let animationId = 0;
    let observer = null;
    let renderedDate = null;
    let spotlightKey = '';
    let selectedRef = null;
    let firstRenderDone = false;

    let pointerY = 500;
    let pointerPull = 0;
    let currentY = 500;
    let currentPull = 0;

    function dateAt(fecha, hora) {
      if (!fecha || !hora) return null;
      const value = new Date(`${fecha}T${hora}:00${offset}`);
      return Number.isNaN(value.getTime()) ? null : value;
    }

    function normalizeEvent(event, index) {
      const startAt = dateAt(event.fecha, event.inicio);
      const endAt = dateAt(event.fecha, event.fin);

      return {
        ...event,
        index,
        startAt,
        endAt,
        prioridad: Number.isFinite(event.prioridad) ? event.prioridad : 1
      };
    }

    const events = sourceEvents
      .map(normalizeEvent)
      .filter(event => event.startAt && event.endAt)
      .sort((a, b) => a.startAt - b.startAt || a.endAt - b.endAt || a.index - b.index);

    function roomValue(value) {
      return (!value || value === '—') ? fallbackRoom : String(value).trim();
    }

    function formatRoomLabel(value) {
      const room = roomValue(value);
      return /^\d+$/.test(room) ? `Salón ${room}` : room;
    }

    function formatHour(value) {
      const [h, m] = String(value).split(':').map(Number);
      const suffix = h >= 12 ? 'p. m.' : 'a. m.';
      const hour = h % 12 || 12;
      return `${hour}:${String(m).padStart(2, '0')} ${suffix}`;
    }

    function formatRange(event) {
      return `${formatHour(event.inicio)} – ${formatHour(event.fin)}`;
    }

    function getDayParts(dateString) {
      const date = new Date(`${dateString}T12:00:00${offset}`);
      return {
        day: new Intl.DateTimeFormat('es-CO', { day: '2-digit' }).format(date),
        month: new Intl.DateTimeFormat('es-CO', { month: 'short' })
          .format(date)
          .replace('.', '')
          .toUpperCase()
      };
    }

    function formatDisplayDate(dateString) {
      if (!dateString) return 'Agenda del encuentro';

      const date = new Date(`${dateString}T12:00:00${offset}`);
      const parts = new Intl.DateTimeFormat('es-CO', {
        day: 'numeric',
        month: 'long'
      }).formatToParts(date);

      const day = parts.find(part => part.type === 'day')?.value || '';
      const month = (parts.find(part => part.type === 'month')?.value || '').toLowerCase();
      return `Agenda del ${day} de ${month}`;
    }

    function accentFor(event, index = 0) {
      return event.color || palette[(event.index + index) % palette.length];
    }

    function futureEvents(now) {
      return events.filter(event => event.endAt > now);
    }

    function isCurrent(event, now) {
      return event.startAt <= now && now < event.endAt;
    }

    function displayDateFor(items, now) {
      if (!items.length) return null;

      const currentMain = items.find(event => event.prioridad > 0 && isCurrent(event, now));
      if (currentMain) return currentMain.fecha;

      return items[0].fecha;
    }

    function eventsForDate(items, date) {
      return items.filter(event => event.fecha === date);
    }

    function groupEvents(items) {
      const map = new Map();
      const groups = [];

      items.forEach(event => {
        const key = `${event.fecha}|${event.inicio}|${event.fin}`;

        if (!map.has(key)) {
          const group = {
            key,
            fecha: event.fecha,
            inicio: event.inicio,
            fin: event.fin,
            startAt: event.startAt,
            endAt: event.endAt,
            events: []
          };
          map.set(key, group);
          groups.push(group);
        }

        map.get(key).events.push(event);
      });

      return groups;
    }

    function minuteState(event, step, now) {
      const start = dateAt(event.fecha, step.inicio);
      const end = dateAt(event.fecha, step.fin);

      if (!start || !end) return 'is-next';
      if (now >= end) return 'is-done';
      if (now >= start && now < end) return 'is-live';
      return 'is-next';
    }

    function createMinuteGroupLabel(label) {
      const group = document.createElement('div');
      group.className = 'agenda-minute__group';
      group.innerHTML = `
        <span class="agenda-minute__group-line" aria-hidden="true"></span>
        <span>${label}</span>
      `;
      return group;
    }

    function buildMinuteDetail(event, accent, now) {
      const steps = Array.isArray(event.detalle) ? event.detalle : [];
      if (!steps.length && !event.nota) return null;

      const wrapper = document.createElement('div');
      wrapper.className = 'agenda-minute';
      wrapper.id = `agenda-minute-${event.id}`;
      wrapper.style.setProperty('--slot-accent', accent);

      const shouldOpen = expandedMinutes.has(event.id);
      wrapper.hidden = !shouldOpen;

      if (steps.length) {
        const timeline = document.createElement('div');
        timeline.className = 'agenda-minute__timeline';

        let previousGroup = '';

        steps.forEach(step => {
          const group = String(step.grupo || '').trim();

          if (group && group !== previousGroup) {
            timeline.appendChild(createMinuteGroupLabel(group));
            previousGroup = group;
          }

          const start = dateAt(event.fecha, step.inicio);
          const end = dateAt(event.fecha, step.fin);

          const item = document.createElement('article');
          item.className = `agenda-minute__step ${minuteState(event, step, now)}`;
          item.dataset.startMs = start ? String(start.getTime()) : '';
          item.dataset.endMs = end ? String(end.getTime()) : '';

          const marker = document.createElement('span');
          marker.className = 'agenda-minute__marker';
          marker.setAttribute('aria-hidden', 'true');

          const body = document.createElement('div');
          body.className = 'agenda-minute__body';

          const top = document.createElement('div');
          top.className = 'agenda-minute__top';

          const time = document.createElement('span');
          time.className = 'agenda-minute__time';
          time.textContent = `${formatHour(step.inicio)} – ${formatHour(step.fin)}`;

          const live = document.createElement('span');
          live.className = 'agenda-minute__live';
          live.textContent = 'Ahora';
          live.hidden = !item.classList.contains('is-live');

          top.append(time, live);

          const copy = document.createElement('p');
          copy.className = 'agenda-minute__copy';
          copy.textContent = step.actividad;

          body.append(top, copy);

          if (step.salon) {
            const room = document.createElement('span');
            room.className = 'agenda-minute__room';
            room.innerHTML = `${iconRoom}<span>${formatRoomLabel(step.salon)}</span>`;
            body.appendChild(room);
          }

          item.append(marker, body);
          timeline.appendChild(item);
        });

        wrapper.appendChild(timeline);
      }

      if (event.nota) {
        const note = document.createElement('div');
        note.className = 'agenda-minute__note';
        note.textContent = event.nota;
        wrapper.appendChild(note);
      }

      return wrapper;
    }

    function toggleMinute(eventId, row, button, panel) {
      const open = button.getAttribute('aria-expanded') === 'true';
      const nextOpen = !open;

      button.setAttribute('aria-expanded', String(nextOpen));
      panel.hidden = !nextOpen;
      row.classList.toggle('is-minute-open', nextOpen);

      if (nextOpen) {
        expandedMinutes.add(eventId);
      } else {
        expandedMinutes.delete(eventId);
      }
    }

    function buildActivity(event, accent, now) {
      const row = document.createElement('article');
      row.className = 'agenda-activity';
      row.dataset.eventId = event.id;
      row.dataset.startMs = String(event.startAt.getTime());
      row.dataset.endMs = String(event.endAt.getTime());
      row.style.setProperty('--slot-accent', accent);

      if (isCurrent(event, now)) row.classList.add('is-current-activity');
      if (event.simultanea) row.classList.add('is-simultaneous');

      const main = document.createElement('div');
      main.className = 'agenda-activity__main';

      const title = document.createElement('h4');
      title.className = 'agenda-activity__title';
      title.textContent = event.evento;
      main.appendChild(title);

      if (event.resumen) {
        const summary = document.createElement('p');
        summary.className = 'agenda-activity__summary';
        summary.textContent = event.resumen;
        main.appendChild(summary);
      }

      const meta = document.createElement('div');
      meta.className = 'agenda-activity__meta';

      const timeChip = document.createElement('span');
      timeChip.className = 'agenda-activity__time-chip';
      timeChip.innerHTML = `${iconClock}<span>${formatRange(event)}</span>`;

      const room = document.createElement('span');
      room.className = 'agenda-activity__room';
      room.innerHTML = `${iconRoom}<span>${formatRoomLabel(event.salon)}</span>`;

      meta.append(timeChip, room);

      if (event.simultanea) {
        const badge = document.createElement('span');
        badge.className = 'agenda-activity__simultaneous';
        badge.textContent = 'Simultánea';
        meta.appendChild(badge);
      }

      main.appendChild(meta);

      const minutePanel = buildMinuteDetail(event, accent, now);

      if (minutePanel) {
        row.classList.add('has-minutograma');

        const stepsCount = Array.isArray(event.detalle) ? event.detalle.length : 0;
        const toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'agenda-activity__toggle';
        toggle.setAttribute('aria-expanded', String(expandedMinutes.has(event.id)));
        toggle.setAttribute('aria-controls', minutePanel.id);
        toggle.innerHTML = `
          <span class="agenda-activity__toggle-dot" aria-hidden="true"></span>
          <span>${stepsCount ? `Minuto a minuto · ${stepsCount}` : 'Ver detalle'}</span>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5"/></svg>`;

        if (expandedMinutes.has(event.id)) row.classList.add('is-minute-open');

        toggle.addEventListener('click', () => {
          toggleMinute(event.id, row, toggle, minutePanel);
        });

        main.append(toggle, minutePanel);
      }

      row.appendChild(main);
      return row;
    }

    function buildSlot(group, slotIndex, now, animateIn) {
      const primary = group.events[0];
      const accent = accentFor(primary, slotIndex);
      const motionModes = ['orbit', 'drift', 'breathe', 'glide'];

      const slot = document.createElement('section');
      slot.className = 'agenda__slot';
      slot.dataset.key = group.key;
      slot.dataset.startMs = String(group.startAt.getTime());
      slot.dataset.endMs = String(group.endAt.getTime());
      slot.dataset.motion = motionModes[slotIndex % motionModes.length];
      slot.style.setProperty('--slot-accent', accent);
      slot.style.setProperty('--orbit-duration', `${4.8 + (slotIndex % 4) * 0.55}s`);
      slot.style.setProperty('--spark-duration', `${2.7 + (slotIndex % 5) * 0.28}s`);
      slot.style.setProperty('--trail-duration', `${3.8 + (slotIndex % 4) * 0.45}s`);
      slot.style.setProperty('--halo-duration', `${5.4 + (slotIndex % 3) * 0.6}s`);
      slot.style.setProperty('--motion-delay', `${(slotIndex % 6) * 0.22}s`);

      if (isCurrent(primary, now)) slot.classList.add('is-current');
      if (!animateIn) slot.classList.add('is-visible');

      const track = document.createElement('div');
      track.className = 'agenda__slot__track';

      ['node', 'halo', 'orbit', 'spark', 'trail'].forEach(name => {
        const element = document.createElement('span');
        element.className = `agenda__slot__${name}`;
        track.appendChild(element);
      });

      const activities = document.createElement('div');
      activities.className = 'agenda__slot__activities';

      group.events.forEach((event, index) => {
        activities.appendChild(
          buildActivity(event, index === 0 ? accent : accentFor(event, index), now)
        );
      });

      slot.append(track, activities);
      return slot;
    }

    function installRevealObserver() {
      if (observer) observer.disconnect();

      const pending = [...listEl.querySelectorAll('.agenda__slot:not(.is-visible)')];
      if (!pending.length) return;

      if (reduceMotion || !('IntersectionObserver' in window)) {
        pending.forEach(slot => slot.classList.add('is-visible'));
        return;
      }

      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      }, {
        root: scrollEl,
        threshold: 0.10,
        rootMargin: '0px 0px -5% 0px'
      });

      pending.forEach(slot => observer.observe(slot));
    }

    function renderDay(date, now, { animate = false, preserveScroll = true } = {}) {
      const allFuture = futureEvents(now);
      const items = date ? eventsForDate(allFuture, date) : [];
      const oldTop = scrollEl.scrollTop;

      renderedDate = date;
      titleEl.textContent = formatDisplayDate(date);
      listEl.replaceChildren();

      if (!items.length) {
        emptyEl.classList.add('is-visible');
        return;
      }

      emptyEl.classList.remove('is-visible');

      const fragment = document.createDocumentFragment();
      const groups = groupEvents(items);

      groups.forEach((group, index) => {
        fragment.appendChild(buildSlot(group, index, now, animate));
      });

      listEl.appendChild(fragment);

      if (animate) installRevealObserver();
      if (preserveScroll) scrollEl.scrollTop = Math.min(oldTop, Math.max(0, scrollEl.scrollHeight - scrollEl.clientHeight));

      firstRenderDone = true;
    }

    function pruneExpired(now, instant = false) {
      const slots = [...listEl.querySelectorAll('.agenda__slot')];

      slots.forEach(slot => {
        const endMs = Number(slot.dataset.endMs || 0);
        if (!endMs || now.getTime() < endMs) return;

        if (instant || reduceMotion) {
          slot.remove();
          return;
        }

        if (slot.classList.contains('is-expiring')) return;
        slot.classList.add('is-expiring');
        window.setTimeout(() => slot.remove(), 260);
      });
    }

    function refreshSlotStates(now) {
      const nowMs = now.getTime();

      listEl.querySelectorAll('.agenda__slot').forEach(slot => {
        const start = Number(slot.dataset.startMs || 0);
        const end = Number(slot.dataset.endMs || 0);
        slot.classList.toggle('is-current', start <= nowMs && nowMs < end);
      });

      listEl.querySelectorAll('.agenda-activity').forEach(card => {
        const start = Number(card.dataset.startMs || 0);
        const end = Number(card.dataset.endMs || 0);
        card.classList.toggle('is-current-activity', start <= nowMs && nowMs < end);
      });
    }

    function refreshMinuteStates(now) {
      const nowMs = now.getTime();

      listEl.querySelectorAll('.agenda-minute__step').forEach(step => {
        const start = Number(step.dataset.startMs || 0);
        const end = Number(step.dataset.endMs || 0);
        const live = start <= nowMs && nowMs < end;
        const done = end && nowMs >= end;

        step.classList.toggle('is-live', live);
        step.classList.toggle('is-done', done);
        step.classList.toggle('is-next', !live && !done);

        const badge = step.querySelector('.agenda-minute__live');
        if (badge) badge.hidden = !live;
      });
    }

    function pickSpotlight(items, now) {
      if (!items.length) return null;

      const currentMain = items
        .filter(event => event.prioridad > 0 && isCurrent(event, now))
        .sort((a, b) => b.prioridad - a.prioridad || a.startAt - b.startAt);

      if (currentMain.length) return currentMain[0];

      const nextMain = items.find(event => event.prioridad > 0 && event.startAt > now);
      if (nextMain) return nextMain;

      return items[0];
    }

    function ensureCountdownShell() {
      if (!spotlight.countdown) return null;
      let shell = spotlight.countdown.querySelector('.agenda__count-clock');

      if (!shell) {
        spotlight.countdown.innerHTML = `
          <span class="agenda__count-label"></span>
          <span class="agenda__count-clock" aria-live="off">
            <span data-count="h">00</span>
            <span class="agenda__count-sep">:</span>
            <span data-count="m">00</span>
            <span class="agenda__count-sep">:</span>
            <span data-count="s">00</span>
          </span>`;
        shell = spotlight.countdown.querySelector('.agenda__count-clock');
      }

      return {
        label: spotlight.countdown.querySelector('.agenda__count-label'),
        h: spotlight.countdown.querySelector('[data-count="h"]'),
        m: spotlight.countdown.querySelector('[data-count="m"]'),
        s: spotlight.countdown.querySelector('[data-count="s"]')
      };
    }

    function paintCountdown(now) {
      if (!selectedRef || !spotlight.countdown) return;

      const active = isCurrent(selectedRef, now);
      const target = active ? selectedRef.endAt : selectedRef.startAt;
      const total = Math.max(0, Math.floor((target - now) / 1000));
      const h = Math.floor(total / 3600);
      const m = Math.floor((total % 3600) / 60);
      const s = total % 60;
      const ui = ensureCountdownShell();

      if (!ui) return;
      ui.label.textContent = active ? 'Termina en' : 'Inicia en';
      ui.h.textContent = String(h).padStart(2, '0');
      ui.m.textContent = String(m).padStart(2, '0');
      ui.s.textContent = String(s).padStart(2, '0');

      if (active) {
        const elapsed = Math.max(0, now - selectedRef.startAt);
        const duration = Math.max(1, selectedRef.endAt - selectedRef.startAt);
        const progress = Math.min(1, elapsed / duration);
        spotlight.orbit.style.setProperty('--agenda-progress', `${Math.round(progress * 360)}deg`);
      } else {
        spotlight.orbit.style.setProperty('--agenda-progress', '0deg');
      }
    }

    function paintSpotlight(now, visibleItems) {
      const selected = pickSpotlight(visibleItems, now);

      if (!selected) {
        selectedRef = null;
        spotlightKey = 'done';
        spotlight.label.textContent = 'Agenda finalizada';
        spotlight.time.innerHTML = `${iconClock}<span>${config.lugar || 'CIP Curumaní'}</span>`;
        spotlight.title.textContent = 'Gracias por vivir este encuentro con nosotros.';
        spotlight.room.hidden = true;
        spotlight.countdown.textContent = '';
        spotlight.day.textContent = '✓';
        spotlight.month.textContent = 'LISTO';
        spotlight.orbit.style.setProperty('--agenda-progress', '360deg');
        spotlight.orbit.style.setProperty('--agenda-orbit-color', '#28a10f');
        return;
      }

      const active = isCurrent(selected, now);
      const key = `${selected.id}|${active ? 'live' : 'next'}`;
      selectedRef = selected;

      if (key !== spotlightKey) {
        spotlightKey = key;
        const parts = getDayParts(selected.fecha);
        const accent = accentFor(selected);

        spotlight.label.textContent = active ? 'En curso' : 'Lo próximo';
        spotlight.time.innerHTML = `${iconClock}<span>${formatRange(selected)}</span>`;
        spotlight.title.textContent = selected.evento;
        spotlight.day.textContent = parts.day;
        spotlight.month.textContent = parts.month;
        spotlight.orbit.style.setProperty('--agenda-orbit-color', accent);
        spotlight.room.hidden = false;
        spotlight.room.innerHTML = `${iconRoom}<span>${formatRoomLabel(selected.salon)}</span>`;

        /* Se crea una sola vez; luego solo cambian sus números. */
        spotlight.countdown.replaceChildren();
      }

      paintCountdown(now);
    }

    function syncAgenda(now = new Date(), { instant = false, initial = false } = {}) {
      const allFuture = futureEvents(now);
      const date = displayDateFor(allFuture, now);

      if (date !== renderedDate) {
        renderDay(date, now, {
          animate: initial && !firstRenderDone,
          preserveScroll: !initial
        });
      } else {
        pruneExpired(now, instant);
      }

      const visibleItems = date ? eventsForDate(allFuture, date) : [];
      titleEl.textContent = formatDisplayDate(date);
      emptyEl.classList.toggle('is-visible', !visibleItems.length);

      refreshSlotStates(now);
      refreshMinuteStates(now);
      paintSpotlight(now, visibleItems);
    }

    function tick() {
      if (!isOpen || document.hidden) return;
      syncAgenda(new Date());
    }

    function startTicker() {
      if (!isOpen || document.hidden || tickTimer) return;
      tickTimer = window.setInterval(tick, 1000);
    }

    function stopTicker() {
      if (!tickTimer) return;
      window.clearInterval(tickTimer);
      tickTimer = null;
    }

    function openAgenda() {
      if (isOpen) {
        syncAgenda(new Date(), { instant: true });
        return;
      }

      isOpen = true;
      moduleEl.classList.add('is-active');
      moduleEl.classList.remove('is-suspended');
      moduleEl.setAttribute('aria-hidden', 'false');
      document.body.classList.add('zc-agenda-open');

      syncAgenda(new Date(), { instant: true, initial: true });
      startTicker();
      startMotionLine();

      window.setTimeout(() => {
        scrollEl.focus({ preventScroll: true });
      }, reduceMotion ? 0 : 240);
    }

    function closeAgenda() {
      if (!isOpen) return;

      isOpen = false;
      moduleEl.classList.remove('is-active', 'is-suspended');
      moduleEl.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('zc-agenda-open');

      stopTicker();
      stopMotionLine();

      if (observer) {
        observer.disconnect();
        observer = null;
      }
    }

    document.addEventListener('zc:menu:navigate', event => {
      if (event.detail?.module === 'agenda') openAgenda();
      else closeAgenda();
    });

    moduleEl.addEventListener('zc:module:activate', openAgenda);

    closeBtn?.addEventListener('click', () => {
      const home = document.querySelector('.zc-menu__item[data-menu-target="inicio"]');
      if (home) home.click();
      else closeAgenda();
    });

    function updateMotionLine(time = 0) {
      if (!isOpen || document.hidden || !motionPath) {
        animationId = 0;
        return;
      }

      currentY += (pointerY - currentY) * 0.075;
      currentPull += (pointerPull - currentPull) * 0.08;

      const ambient = reduceMotion ? 0 : Math.sin(time / 1700) * 0.7;
      const x = 23 + currentPull + ambient;
      const y = Math.max(120, Math.min(880, currentY));
      const y1 = Math.max(0, y - 170);
      const y2 = Math.min(1000, y + 170);

      motionPath.setAttribute(
        'd',
        `M23 0 V${y1.toFixed(1)} C23 ${(y1 + 68).toFixed(1)} ${x.toFixed(1)} ${(y - 72).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)} S23 ${(y + 72).toFixed(1)} 23 ${y2.toFixed(1)} V1000`
      );

      animationId = window.requestAnimationFrame(updateMotionLine);
    }

    function startMotionLine() {
      if (animationId || reduceMotion || document.hidden || !isOpen) return;
      animationId = window.requestAnimationFrame(updateMotionLine);
    }

    function stopMotionLine() {
      if (animationId) window.cancelAnimationFrame(animationId);
      animationId = 0;
      pointerPull = 0;
    }

    if (finePointer) {
      moduleEl.addEventListener('pointermove', event => {
        if (!isOpen) return;

        pointerY = (event.clientY / Math.max(1, window.innerHeight)) * 1000;
        const railX = window.innerWidth * 0.15;
        const distance = Math.abs(event.clientX - railX);
        const railZone = Math.min(220, window.innerWidth * 0.30);
        const proximity = Math.max(0, 1 - (distance / railZone));
        const direction = event.clientX >= railX ? 1 : -1;
        pointerPull = proximity * 3.2 * direction;
      }, { passive: true });

      moduleEl.addEventListener('pointerleave', () => {
        pointerPull = 0;
      }, { passive: true });
    }

    scrollEl.addEventListener('scroll', () => {
      if (!isOpen || finePointer) return;

      const max = Math.max(1, scrollEl.scrollHeight - scrollEl.clientHeight);
      const progress = scrollEl.scrollTop / max;
      pointerY = 140 + progress * 720;
      pointerPull = Math.sin(progress * Math.PI) * 1.8;
    }, { passive: true });

    /*
      CORRECCIÓN DEL PARPADEO:
      Al ocultarse la pestaña no se destruye nada.
      Solo se pausan el temporizador y la línea animada.
      Al volver, se sincronizan estados sin reconstruir el DOM salvo
      que realmente haya cambiado de día.
    */
    document.addEventListener('visibilitychange', () => {
      if (!isOpen) return;

      if (document.hidden) {
        moduleEl.classList.add('is-suspended');
        stopTicker();
        stopMotionLine();
        return;
      }

      moduleEl.classList.remove('is-suspended');
      syncAgenda(new Date(), { instant: true });
      startTicker();
      startMotionLine();
    });

    return true;
  }

  function bootAgenda() {
    if (initAgenda()) return;

    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      if (initAgenda() || attempts >= 40) window.clearInterval(timer);
    }, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootAgenda, { once: true });
  } else {
    bootAgenda();
  }
})();
