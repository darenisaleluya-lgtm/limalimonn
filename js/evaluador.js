/* ============================================================
   ZONA CARIBE · MÓDULO EVALUADOR
   Archivo entregado como .txt. Renombrar a evaluador.js.
   ============================================================ */
(() => {
  'use strict';

  const moduleEl = document.getElementById('evaluador-module');
  const formEl = document.getElementById('evaluador-form');
  const inputEl = document.getElementById('evaluador-code');
  const submitBtn = document.getElementById('evaluador-submit');
  const closeBtn = document.getElementById('evaluador-close');
  const resetBtn = document.getElementById('evaluador-reset');
  const errorEl = document.getElementById('evaluador-error');
  const resultsEl = document.getElementById('evaluador-results');
  const summaryNameEl = document.getElementById('evaluador-name');
  const summaryModeEl = document.getElementById('evaluador-mode');
  const daysEl = document.getElementById('evaluador-days');

  if (!moduleEl || !formEl || !inputEl || !window.ZC_EVALUADOR_DATA) return;

  const DATA = window.ZC_EVALUADOR_DATA;
  const FORM_URL = DATA.formUrl || 'https://forms.gle/bttJJArJSLYki8oS9';
  const evaluadores = DATA.evaluadores || {};
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let isOpen = false;
  let currentEvaluator = null;

  const EVENT_COLORS = ['#1677c4', '#28a10f', '#d2510e', '#b81180'];

  const calendarIcon = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 3v3M17 3v3M4.5 9h15M5 5.5h14v14H5z"/>
    </svg>`;

  const clockIcon = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8"/>
      <path d="M12 8v4l3 2"/>
    </svg>`;

  const pinIcon = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21s6-5.7 6-11a6 6 0 1 0-12 0c0 5.3 6 11 6 11Z"/>
      <circle cx="12" cy="10" r="2"/>
    </svg>`;

  const turnIcon = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 7h12M6 12h8M6 17h5"/>
    </svg>`;

  function normalizeCode(value) {
    return String(value || '').replace(/\D+/g, '');
  }

  function sha256Fallback(ascii) {
    const rightRotate = (value, amount) => (value >>> amount) | (value << (32 - amount));
    const maxWord = Math.pow(2, 32);
    let result = '';
    const words = [];
    const asciiBitLength = ascii.length * 8;
    const hash = sha256Fallback.h = sha256Fallback.h || [];
    const k = sha256Fallback.k = sha256Fallback.k || [];
    let primeCounter = k.length;
    const isComposite = {};

    for (let candidate = 2; primeCounter < 64; candidate++) {
      if (!isComposite[candidate]) {
        for (let i = 0; i < 313; i += candidate) isComposite[i] = candidate;
        hash[primeCounter] = (Math.pow(candidate, .5) * maxWord) | 0;
        k[primeCounter++] = (Math.pow(candidate, 1 / 3) * maxWord) | 0;
      }
    }

    ascii += '\x80';
    while (ascii.length % 64 - 56) ascii += '\x00';

    for (let i = 0; i < ascii.length; i++) {
      const j = ascii.charCodeAt(i);
      words[i >> 2] |= j << ((3 - i) % 4) * 8;
    }

    words[words.length] = (asciiBitLength / maxWord) | 0;
    words[words.length] = asciiBitLength;

    for (let j = 0; j < words.length;) {
      const w = words.slice(j, j += 16);
      const oldHash = hash.slice(0);
      let workingHash = hash.slice(0, 8);

      for (let i = 0; i < 64; i++) {
        const w15 = w[i - 15];
        const w2 = w[i - 2];
        const a = workingHash[0];
        const e = workingHash[4];

        const temp1 = workingHash[7]
          + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25))
          + ((e & workingHash[5]) ^ ((~e) & workingHash[6]))
          + k[i]
          + (w[i] = i < 16 ? w[i] : (
              w[i - 16]
              + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3))
              + w[i - 7]
              + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))
            ) | 0);

        const temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22))
          + ((a & workingHash[1]) ^ (a & workingHash[2]) ^ (workingHash[1] & workingHash[2]));

        workingHash = [(temp1 + temp2) | 0].concat(workingHash);
        workingHash[4] = (workingHash[4] + temp1) | 0;
        workingHash.pop();
      }

      for (let i = 0; i < 8; i++) {
        hash[i] = (workingHash[i] + oldHash[i]) | 0;
      }
    }

    for (let i = 0; i < 8; i++) {
      for (let j = 3; j + 1; j--) {
        const b = (hash[i] >> (j * 8)) & 255;
        result += (b < 16 ? '0' : '') + b.toString(16);
      }
    }

    return result;
  }

  async function sha256Hex(value) {
    if (window.crypto && window.crypto.subtle && window.TextEncoder) {
      const bytes = new TextEncoder().encode(value);
      const digest = await window.crypto.subtle.digest('SHA-256', bytes);
      return Array.from(new Uint8Array(digest))
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
    }

    /* Respaldo para pruebas locales file:// donde SubtleCrypto puede no estar disponible. */
    return sha256Fallback(value);
  }

  function setError(message = '') {
    errorEl.textContent = message;
    errorEl.hidden = !message;
    inputEl.setAttribute('aria-invalid', message ? 'true' : 'false');
  }

  function setLoading(loading) {
    submitBtn.disabled = loading;
    submitBtn.classList.toggle('is-loading', loading);
    submitBtn.querySelector('.evaluador-search__button-label').textContent = loading
      ? 'Consultando…'
      : 'Consultar';
  }

  function dayTitle(day) {
    return Number(day) === 1
      ? 'Día 1 · Jueves 1 de octubre'
      : 'Día 2 · Viernes 2 de octubre';
  }

  function createMetaPill(icon, text, className = '') {
    const pill = document.createElement('span');
    pill.className = `evaluador-pill ${className}`.trim();
    pill.innerHTML = icon;

    const label = document.createElement('span');
    label.textContent = text;
    pill.appendChild(label);

    return pill;
  }

  function createTimeBlock(item) {
    const wrap = document.createElement('div');
    wrap.className = 'evaluador-assignment__times';

    if (item.sinLimite) {
      const unlimited = createMetaPill(clockIcon, 'Tiempo: Sin límite', 'is-unlimited');
      wrap.appendChild(unlimited);
      return wrap;
    }

    if (item.inicio) {
      wrap.appendChild(createTimeDetail('Inicio', item.inicio));
    }

    if (item.finExposicion) {
      wrap.appendChild(createTimeDetail('Fin exposición', item.finExposicion));
    }

    if (item.finPreguntas) {
      wrap.appendChild(createTimeDetail('Fin preguntas', item.finPreguntas));
    }

    return wrap;
  }

  function createTimeDetail(label, value) {
    const item = document.createElement('div');
    item.className = 'evaluador-time';

    const dot = document.createElement('span');
    dot.className = 'evaluador-time__dot';
    dot.setAttribute('aria-hidden', 'true');

    const copy = document.createElement('span');
    copy.className = 'evaluador-time__copy';

    const labelEl = document.createElement('small');
    labelEl.textContent = label;

    const valueEl = document.createElement('strong');
    valueEl.textContent = value;

    copy.append(labelEl, valueEl);
    item.append(dot, copy);
    return item;
  }

  function createEvaluateButton() {
    const link = document.createElement('a');
    link.className = 'evaluador-assignment__evaluate';
    link.href = FORM_URL;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', 'Abrir formulario de evaluación en una nueva ventana');
    link.innerHTML = `
      <span>Evaluar</span>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 16 16 8M10 8h6v6"/>
      </svg>`;
    return link;
  }

  function createAssignmentCard(item, index) {
    const card = document.createElement('article');
    card.className = 'evaluador-assignment';
    card.style.setProperty('--assignment-accent', EVENT_COLORS[index % EVENT_COLORS.length]);
    card.style.setProperty('--assignment-delay', `${Math.min(index * 45, 260)}ms`);

    const top = document.createElement('div');
    top.className = 'evaluador-assignment__top';

    const place = createMetaPill(pinIcon, item.ubicacion || 'Espacio por confirmar', 'is-place');
    top.appendChild(place);

    if (item.turno !== null && item.turno !== undefined && String(item.turno).trim() !== '') {
      top.appendChild(createMetaPill(turnIcon, `Turno ${item.turno}`, 'is-turn'));
    }

    const title = document.createElement('h4');
    title.className = 'evaluador-assignment__title';
    title.textContent = item.titulo || 'Asignación';

    const times = createTimeBlock(item);
    const evaluate = createEvaluateButton();

    card.append(top, title, times, evaluate);
    return card;
  }

  function createDaySection(day, items) {
    const section = document.createElement('section');
    section.className = 'evaluador-day';

    const head = document.createElement('header');
    head.className = 'evaluador-day__header';

    const heading = document.createElement('div');
    heading.className = 'evaluador-day__heading';
    heading.innerHTML = calendarIcon;

    const text = document.createElement('div');

    const eyebrow = document.createElement('span');
    eyebrow.className = 'evaluador-day__eyebrow';
    eyebrow.textContent = `Día ${day}`;

    const title = document.createElement('h3');
    title.className = 'evaluador-day__title';
    title.textContent = dayTitle(day);

    text.append(eyebrow, title);
    heading.appendChild(text);

    const count = document.createElement('span');
    count.className = 'evaluador-day__count';
    count.textContent = `${items.length} ${items.length === 1 ? 'asignación' : 'asignaciones'}`;

    head.append(heading, count);

    const list = document.createElement('div');
    list.className = 'evaluador-day__list';

    items.forEach((item, index) => {
      list.appendChild(createAssignmentCard(item, index + (day === 2 ? 1 : 0)));
    });

    section.append(head, list);
    return section;
  }

  function renderEvaluator(evaluator) {
    currentEvaluator = evaluator;
    setError('');

    summaryNameEl.textContent = evaluator.nombre || 'Evaluador';
    summaryModeEl.textContent = evaluator.modalidad
      ? `${evaluator.modalidad} · Encuentro 2026`
      : 'Encuentro 2026';

    daysEl.replaceChildren();

    const assignments = Array.isArray(evaluator.asignaciones)
      ? evaluator.asignaciones
      : [];

    const day1 = assignments.filter(item => Number(item.dia) === 1);
    const day2 = assignments.filter(item => Number(item.dia) === 2);

    if (day1.length) daysEl.appendChild(createDaySection(1, day1));
    if (day2.length) daysEl.appendChild(createDaySection(2, day2));

    if (!assignments.length) {
      const empty = document.createElement('div');
      empty.className = 'evaluador-empty';
      empty.innerHTML = `
        <span class="evaluador-empty__icon" aria-hidden="true">✓</span>
        <div>
          <strong>Código validado</strong>
          <p>No hay asignaciones registradas para este evaluador.</p>
        </div>`;
      daysEl.appendChild(empty);
    }

    resultsEl.hidden = false;
    formEl.classList.add('has-result');
    inputEl.value = '';

    if (!reduceMotion) {
      resultsEl.animate(
        [
          { opacity: 0, transform: 'translateY(10px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ],
        { duration: 420, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both' }
      );
    }

    window.setTimeout(() => resultsEl.scrollIntoView({ block: 'start', behavior: reduceMotion ? 'auto' : 'smooth' }), 80);
  }

  async function lookup(code) {
    const normalized = normalizeCode(code);

    if (normalized.length < 6) {
      setError('Ingresa un código válido.');
      inputEl.focus();
      return;
    }

    setLoading(true);
    setError('');

    try {
      const hash = await sha256Hex(normalized);
      const evaluator = evaluadores[hash];

      if (!evaluator) {
        setError('No encontramos asignaciones asociadas a ese código. Verifica el dato e inténtalo nuevamente.');
        inputEl.focus();
        return;
      }

      renderEvaluator(evaluator);
    } catch (_) {
      setError('No fue posible validar el código en este navegador. Intenta actualizar la página.');
    } finally {
      setLoading(false);
    }
  }

  function resetLookup() {
    currentEvaluator = null;
    resultsEl.hidden = true;
    daysEl.replaceChildren();
    summaryNameEl.textContent = '';
    summaryModeEl.textContent = '';
    formEl.classList.remove('has-result');
    inputEl.value = '';
    setError('');
    window.setTimeout(() => inputEl.focus(), 60);
  }

  function openEvaluator() {
    if (isOpen) return;
    isOpen = true;
    moduleEl.classList.add('is-active');
    moduleEl.setAttribute('aria-hidden', 'false');
    document.body.classList.add('zc-evaluator-open');

    window.setTimeout(() => {
      if (!currentEvaluator) inputEl.focus({ preventScroll: true });
    }, reduceMotion ? 0 : 280);
  }

  function closeEvaluator() {
    if (!isOpen) return;
    isOpen = false;
    moduleEl.classList.remove('is-active');
    moduleEl.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('zc-evaluator-open');
  }

  formEl.addEventListener('submit', event => {
    event.preventDefault();
    lookup(inputEl.value);
  });

  inputEl.addEventListener('input', () => {
    const clean = normalizeCode(inputEl.value);
    if (inputEl.value !== clean) inputEl.value = clean;
    if (errorEl.textContent) setError('');
  });

  resetBtn?.addEventListener('click', resetLookup);

  closeBtn?.addEventListener('click', () => {
    const home = document.querySelector('.zc-menu__item[data-menu-target="inicio"]');
    if (home) home.click();
    else closeEvaluator();
  });

  document.addEventListener('zc:menu:navigate', event => {
    const target = event.detail?.module;
    if (target === 'evaluador') openEvaluator();
    else closeEvaluator();
  });

  moduleEl.addEventListener('zc:module:activate', openEvaluator);

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && isOpen) closeEvaluator();
  });
})();
