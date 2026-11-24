// The simulation screen shared by every simulation: title, play/pause, mode buttons, fan menu,
// detailed menu, control panels and the viewpoint bar. Each simulation supplies its menus (js/sims/*.js).
import { createFan } from './fan.js';
import { buildPanel, labelOf } from './panel.js';
import { createClock } from './clock.js';
import { createTrace, createChart } from './graph.js';

const MENUS = [
  { id: 'vars', label: '변인' }, { id: 'graph', label: '그래프' }, { id: 'time', label: '시간' },
  { id: 'layers', label: '표시' }, { id: 'inquiry', label: '탐구' },
];
const DIRS = [['left', '좌'], ['right', '우'], ['front', '정면'], ['top', '상단']];
const opensPanel = (item) => item.kind !== 'toggle' && item.kind !== 'action';

const backArrow = '<svg viewBox="0 0 12 20" aria-hidden="true"><path d="M10 2 2 10l8 8" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const playIcon = '<svg class="icon-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>'
  + '<svg class="icon-pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h3.6v14H7zM13.4 5H17v14h-3.6z" fill="currentColor"/></svg>';

// found: where the simulation sits (js/data/units.js).  query: options after "?" in the address.
// setAddress(hash): lets the frame keep the address in step with the mode buttons.
export async function simScreen(found, query, setAddress) {
  const { default: spec } = await import(`../sims/${found.sim.code}.js`);
  const el = document.createElement('section');
  el.className = 'sim';
  el.innerHTML = `
    <canvas class="sim-scene"></canvas>
    <header class="topbar">
      <div class="title-pill">
        <a class="up" href="#/${found.subject.id}" data-up aria-label="단원 목록">${backArrow}</a>
        <div class="title-text"><h1>${found.number} ${found.sim.name}</h1><p>${found.subject.name} · ${found.part.roman} ${found.part.name}</p></div>
      </div>
      <div class="play-pill"><button class="play" type="button" aria-label="재생">${playIcon}</button><output class="clock">0.0 s</output></div>
      <div class="modes">
        <div class="pair" role="group" aria-label="수준">
          <button type="button" data-mode="basic">기본</button><button type="button" data-mode="adv">심화</button>
        </div>
        <div class="pair" role="group" aria-label="쓰임">
          <button type="button" data-use="class">수업</button><button type="button" data-use="inquiry">탐구</button>
        </div>
      </div>
    </header>
    <div class="submenu"></div>
    <div class="panel-host"></div>
    <div class="dock"></div>
    <div class="bottom">
      <p class="premise" hidden></p>
      <div class="viewbar">
        <div class="view-kind" role="radiogroup" aria-label="시점">
          <button type="button" role="radio" data-kind="free"><i class="ring"></i>자유 시점</button>
          <button type="button" role="radio" data-kind="fixed"><i class="ring"></i>고정 시점</button>
        </div>
        <div class="view-dirs" role="radiogroup" aria-label="고정 시점의 방향">
          ${DIRS.map(([id, label]) => `<button type="button" role="radio" data-dir="${id}">${label}</button>`).join('')}
        </div>
      </div>
    </div>`;
  const $ = (selector) => el.querySelector(selector);
  const submenu = $('.submenu'), host = $('.panel-host'), dock = $('.dock'), bottom = $('.bottom'), topbar = $('.topbar');

  // ---------- shared state ----------
  const listeners = {};
  const ctx = {
    spec, values: {}, locked: new Set(), advanced: query.get('mode') === 'adv', classUse: query.get('use') === 'class',
    view: { kind: 'free', dir: spec.fixedViews.includes('front') ? 'front' : spec.fixedViews[0] },
    traces: {},   // id -> the record of one quantity against time (js/frame/graph.js); the simulation adds the samples
    charts: {},   // id -> the numbers behind a bar chart; the simulation sets them
    tables: {},   // id -> { rows, add(row), clear() } behind a record table; the simulation adds the rows
    on(type, fn) { (listeners[type] = listeners[type] || []).push(fn); },
    emit(type, ...args) { (listeners[type] || []).forEach((fn) => fn(...args)); },
    set(id, value) { ctx.values[id] = value; ctx.emit('change', id, value); refreshPanels(); markSubmenu(); },   // an open panel and the buttons of the detailed menu follow a value changed in the scene
  };
  for (const items of Object.values(spec.menus)) for (const item of items) {
    ctx.values[item.id] = item.kind === 'toggle' ? item.value === true : item.value;   // a toggle is off at first, unless value: true
    if (item.kind === 'table') {
      const table = ctx.tables[item.id] = {
        rows: [],
        add(row, replace) { if (replace) table.rows.pop(); table.rows.push(row); if (table.rows.length > (item.rows || 6)) table.rows.shift(); refreshPanels(); place(); },
        clear() { table.rows.length = 0; refreshPanels(); place(); },
      };
    }
  }
  for (const [id, options] of Object.entries(spec.traces || {})) ctx.traces[id] = createTrace(options);
  for (const [id, options] of Object.entries(spec.charts || {})) ctx.charts[id] = createChart(options);
  // What the simulation takes for granted (no friction, no heat lost, ...), written above the viewpoint bar.
  // spec.premise: a text, or premise(values, advanced) for one that depends on the arrangement; '' or none: nothing is written.
  const premise = $('.premise');
  function showPremise() {
    const text = (typeof spec.premise === 'function' ? spec.premise(ctx.values, ctx.advanced) : spec.premise) || '';
    premise.hidden = !text; premise.innerHTML = text && `<b>가정</b>${text}`;
  }
  ctx.on('change', showPremise);
  // an item may belong to the advanced mode only (advanced: true) or to some arrangements only (when(values))
  const visible = (item) => (!item.advanced || ctx.advanced) && (!item.when || item.when(ctx.values));
  showPremise();

  // ---------- play / pause ----------
  const clockText = $('.clock'), play = $('.play');
  const clock = createClock((t, dt) => { clockText.textContent = `${t.toFixed(1)} s`; ctx.emit('tick', t, dt); });
  function setPlaying(on) {
    if (on) clock.start(); else clock.pause();
    play.classList.toggle('playing', on); play.setAttribute('aria-label', on ? '일시정지' : '재생');
    ctx.emit('play', on);
  }
  play.addEventListener('click', () => setPlaying(!clock.running));
  ctx.setPlaying = (on) => { if (on !== clock.running) setPlaying(on); };
  ctx.seek = (t) => { clock.t = t; clockText.textContent = `${t.toFixed(1)} s`; };   // the simulation jumped to another moment
  ctx.on('change', (id, value) => { if (id === 'slow') clock.rate = value ? 0.25 : 1; });
  ctx.on('action', (id) => {
    if (id === 'reset') { setPlaying(false); clock.reset(); }
    if (id === 'step') { setPlaying(false); clock.step(spec.stepTime || 0.05); }
  });

  // ---------- fan menu, detailed menu, panels ----------
  let menu = null;             // id of the chosen fan piece
  let open = null;             // the unpinned panel on show: { id, panel }
  const pinned = new Map();    // id -> panel, in the order they were pinned
  function refreshPanels() { if (open) open.panel.refresh(); for (const panel of pinned.values()) panel.refresh(); }
  const tall = window.matchMedia('(max-aspect-ratio: 4/5)');
  const compact = window.matchMedia('(max-width: 700px), (max-height: 500px)');
  const low = window.matchMedia('(max-height: 500px)');   // a phone held sideways

  const fan = createFan(MENUS, {
    onOpen(on) {
      setFan(on);
      if (on && tall.matches) closePanel();        // tall screens: the menu and the bottom panel take turns
      if (!on && !tall.matches) closePanel();
      showSubmenu();
    },
    onPick(id) { menu = menu === id ? null : id; fan.select(menu); if (!tall.matches) closePanel(); showSubmenu(); },
  });
  el.insertBefore(fan.el, submenu);
  function setFan(on) { fan.setOpen(on); el.classList.toggle('fan-open', on); }

  function showSubmenu() {
    const items = menu ? spec.menus[menu].filter(visible) : [];
    submenu.innerHTML = items.map((item) => `
      <button class="sub ${item.kind}" type="button" data-id="${item.id}">${labelOf(item, ctx)}</button>`).join('');
    submenu.classList.toggle('on', fan.open && items.length > 0);
    markSubmenu();
    place();
  }
  function markSubmenu() {
    for (const pill of submenu.children) {
      const id = pill.dataset.id;
      const on = pill.classList.contains('toggle') ? ctx.values[id] === true : (open && open.id === id) || pinned.has(id);
      pill.classList.toggle('on', on); pill.setAttribute('aria-pressed', on);
    }
  }
  submenu.addEventListener('click', (e) => {
    const pill = e.target.closest('.sub');
    if (!pill) return;
    const item = spec.menus[menu].find((one) => one.id === pill.dataset.id);
    if (item.kind === 'toggle') ctx.set(item.id, !ctx.values[item.id]);   // the simulation may switch other toggles in answer
    else if (item.kind === 'action') ctx.emit('action', item.id);
    else if (pinned.has(item.id)) return;
    else if (open && open.id === item.id) closePanel();
    else openPanel(item);
    markSubmenu();
  });

  function openPanel(item) {
    closePanel();
    const panel = buildPanel(item, ctx, { pin: () => togglePin(item.id), close: closePanel });
    open = { id: item.id, panel };
    host.replaceChildren(panel.el); host.classList.toggle('wide', Boolean(item.wide));
    if (tall.matches) { setFan(false); submenu.classList.remove('on'); }   // the bottom panel folds the fan away
    markSubmenu(); place();
  }
  function closePanel() {
    if (!open) return;
    open.panel.stop(); open.panel.el.remove(); open = null;
    markSubmenu();
  }
  function togglePin(id) {
    if (pinned.has(id)) { const panel = pinned.get(id); panel.stop(); panel.el.remove(); pinned.delete(id); }
    else if (open && open.id === id) {
      if (tall.matches || low.matches) for (const other of [...pinned.keys()]) togglePin(other);   // small screens keep one pinned panel
      const panel = open.panel; open = null;
      pinned.set(id, panel); panel.setPinned(true); dock.append(panel.el);
    }
    markSubmenu(); place();
  }

  // Where the detailed menu and the open panel go. Wide screens: beside the fan. Tall screens: the panel
  // rises from the bottom, above the viewpoint bar (css/sim.css does the rest).
  function place() {
    const isTall = tall.matches;
    if (isTall && host.parentNode !== bottom) bottom.prepend(host);
    if (!isTall && host.parentNode !== el) el.insertBefore(host, dock);
    const scale = fan.toggle.offsetWidth / 80, height = el.clientHeight, width = el.clientWidth;
    const ceiling = topbar.offsetTop + topbar.offsetHeight + 6, floor = bottom.offsetTop - 6;
    // a detailed menu too long for the screen (a phone held sideways) is set in two columns
    submenu.classList.remove('two');
    if (submenu.offsetHeight > bottom.offsetTop + bottom.offsetHeight - ceiling) submenu.classList.add('two');
    const shift = menu && !compact.matches && !isTall ? fan.labelY(menu) * 1.47 * scale : 0;
    const top = Math.max(ceiling, Math.min(floor - submenu.offsetHeight, height / 2 + shift - submenu.offsetHeight / 2));
    submenu.style.top = `${top}px`;
    const dockTop = isTall || low.matches ? ceiling : ceiling + 100 * scale;
    dock.style.top = `${dockTop}px`; dock.style.maxHeight = isTall ? '' : `${Math.max(120, floor - dockTop)}px`;
    if (isTall) { host.style.left = host.style.top = host.style.maxWidth = ''; return; }
    // the open panel stands beside the detailed menu and keeps clear of the pinned column, narrower if it must
    const wanted = submenu.offsetLeft + submenu.offsetWidth + Math.max(10, 24 * scale), edge = pinned.size ? dock.offsetLeft - 8 : width - Math.max(8, parseFloat(getComputedStyle(topbar).paddingRight) - 2);   // the right margin holds the notch
    host.style.maxWidth = `${Math.max(200, edge - wanted)}px`;
    const left = Math.min(wanted, edge - host.offsetWidth);
    host.style.left = `${Math.max(8, left)}px`;
    host.style.top = `${Math.max(ceiling, Math.min(top, floor - host.offsetHeight))}px`;
  }

  // Puts away whatever no longer belongs on screen: an advanced item after leaving the advanced mode,
  // an item of another arrangement after the arrangement was changed.
  function putAway() {
    for (const items of Object.values(spec.menus)) for (const item of items) {
      if (!visible(item)) {
        if (open && open.id === item.id) closePanel();
        if (pinned.has(item.id)) togglePin(item.id);
        if (item.kind === 'toggle' && ctx.values[item.id]) ctx.set(item.id, false);
      }
      const chosen = item.options && item.options.find((option) => option.id === ctx.values[item.id]);
      if (chosen && chosen.advanced && !ctx.advanced) ctx.set(item.id, item.value);
    }
  }
  let listed = '';   // the items on offer and their names, to notice when a changed value brings others
  ctx.on('change', () => {
    const now = Object.values(spec.menus).flat().filter(visible).map((item) => (typeof item.label === 'function' ? item.id + labelOf(item, ctx) : item.id)).join();
    if (now === listed) return;
    listed = now; putAway(); showSubmenu();
  });

  // ---------- modes ----------
  function applyModes() {
    el.classList.toggle('adv', ctx.advanced); el.classList.toggle('use-class', ctx.classUse);
    for (const b of el.querySelectorAll('[data-mode]')) b.setAttribute('aria-pressed', (b.dataset.mode === 'adv') === ctx.advanced);
    for (const b of el.querySelectorAll('[data-use]')) b.setAttribute('aria-pressed', (b.dataset.use === 'class') === ctx.classUse);
    fan.setDisabled('inquiry', ctx.classUse);
    if (ctx.classUse && menu === 'inquiry') { menu = null; fan.select(null); closePanel(); }
    // an arrangement switched on from the inquiry menu could not be switched off again while that menu is out of reach
    if (ctx.classUse) for (const item of spec.menus.inquiry) if (item.kind === 'toggle' && ctx.values[item.id]) ctx.set(item.id, false);
    putAway();
    refreshPanels();
    showSubmenu();
    ctx.emit('mode');
    showPremise();
  }
  $('.modes').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.mode) ctx.advanced = b.dataset.mode === 'adv'; else ctx.classUse = b.dataset.use === 'class';
    applyModes();
    const options = [ctx.advanced && 'mode=adv', ctx.classUse && 'use=class'].filter(Boolean).join('&');
    setAddress(`#/${found.subject.id}/${found.sim.code}${options ? `?${options}` : ''}`);
  });

  // ---------- viewpoint ----------
  function applyView() {
    for (const b of el.querySelectorAll('[data-kind]')) {
      b.setAttribute('aria-checked', b.dataset.kind === ctx.view.kind);
    }
    for (const b of el.querySelectorAll('[data-dir]')) {
      b.setAttribute('aria-checked', b.dataset.dir === ctx.view.dir);
      b.disabled = !spec.fixedViews.includes(b.dataset.dir);
    }
    $('.viewbar').classList.toggle('fixed', ctx.view.kind === 'fixed');
    ctx.emit('view', ctx.view);
    place();
  }
  $('.viewbar').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b || b.disabled) return;
    if (b.dataset.kind) ctx.view.kind = b.dataset.kind; else ctx.view.dir = b.dataset.dir;
    applyView();
  });
  // A simulation may turn the fixed viewpoint to another of its directions, where an arrangement is best seen from there.
  ctx.setView = (dir) => { if (spec.fixedViews.includes(dir) && ctx.view.dir !== dir) { ctx.view.dir = dir; applyView(); } };

  // ---------- the scene ----------
  // The shared laboratory (three.js, fetched only now) with the simulation's apparatus on the bench.
  const sceneCanvas = $('.sim-scene');
  const [T, { createKit }, { buildLab }, { createView3D }] = await Promise.all([
    import('../vendor/three.module.min.js'), import('./kit.js'), import('./lab.js'), import('./view3d.js')]);
  const kit = createKit(T), view3d = createView3D(T, sceneCanvas, ctx, spec.camera);
  const lab = buildLab(T, kit, view3d.scene, spec.board);
  view3d.onQuality(lab.setShadowLevel);
  const scene = spec.create({ T, kit, view: view3d, world: lab.world, ctx });
  view3d.onUpdate(scene.update);
  el.scene = scene; el.view = view3d; el.ctx = ctx;   // for checking from the browser console
  const onResize = () => {
    if (tall.matches && open && fan.open) { setFan(false); submenu.classList.remove('on'); }   // e.g. a phone turned upright
    place();
  };
  window.addEventListener('resize', onResize);
  tall.addEventListener('change', onResize);

  applyModes();
  applyView();
  return {
    el, title: `${found.sim.name} · ${found.subject.name}`,
    enter() { view3d.start(); place(); },
    leave() {
      clock.pause(); closePanel(); view3d.dispose();
      for (const panel of pinned.values()) panel.stop();
      window.removeEventListener('resize', onResize); tall.removeEventListener('change', onResize);
    },
  };
}
