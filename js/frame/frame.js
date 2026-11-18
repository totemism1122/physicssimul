// The simulation screen shared by every simulation: title, play/pause, mode buttons, fan menu,
// detailed menu, control panels and the viewpoint bar. Each simulation supplies its menus (js/sims/*.js).
import { createFan } from './fan.js';
import { buildPanel } from './panel.js';
import { createClock } from './clock.js';

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
  const flat = spec.view === '2d';
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
        <span class="beyond"><i class="beyond-mark"></i>교육과정 밖</span>
      </div>
    </header>
    <div class="submenu"></div>
    <div class="panel-host"></div>
    <div class="dock"></div>
    <div class="bottom">
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
    view: { kind: flat ? 'fixed' : 'free', dir: spec.fixedViews.includes('front') ? 'front' : spec.fixedViews[0] },
    on(type, fn) { (listeners[type] = listeners[type] || []).push(fn); },
    emit(type, ...args) { (listeners[type] || []).forEach((fn) => fn(...args)); },
    set(id, value) { ctx.values[id] = value; ctx.emit('change', id, value); },
  };
  for (const items of Object.values(spec.menus)) for (const item of items) {
    ctx.values[item.id] = item.kind === 'toggle' ? false : item.value;
  }
  const visible = (item) => !item.advanced || ctx.advanced;

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
  ctx.on('change', (id, value) => { if (id === 'slow') clock.rate = value ? 0.25 : 1; });
  ctx.on('action', (id) => {
    if (id === 'reset') { setPlaying(false); clock.reset(); }
    if (id === 'step') { setPlaying(false); clock.step(0.05); }
  });

  // ---------- fan menu, detailed menu, panels ----------
  let menu = null;             // id of the chosen fan piece
  let open = null;             // the unpinned panel on show: { id, panel }
  const pinned = new Map();    // id -> panel, in the order they were pinned
  const tall = window.matchMedia('(max-aspect-ratio: 4/5)');
  const compact = window.matchMedia('(max-width: 700px), (max-height: 500px)');

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
      <button class="sub ${item.kind}" type="button" data-id="${item.id}">${item.label}${item.advanced ? '<i class="beyond-mark"></i>' : ''}</button>`).join('');
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
    if (item.kind === 'toggle') ctx.set(item.id, !ctx.values[item.id]);
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
    host.replaceChildren(panel.el);
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
      if (tall.matches) for (const other of [...pinned.keys()]) togglePin(other);   // tall screens keep one pinned panel
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
    const shift = menu && !compact.matches && !isTall ? fan.labelY(menu) * 1.47 * scale : 0;
    const top = Math.max(ceiling, Math.min(floor - submenu.offsetHeight, height / 2 + shift - submenu.offsetHeight / 2));
    submenu.style.top = `${top}px`;
    dock.style.top = `${isTall ? ceiling : ceiling + 100 * scale}px`;
    if (isTall) { host.style.left = host.style.top = ''; return; }
    const left = Math.min(submenu.offsetLeft + submenu.offsetWidth + Math.max(10, 24 * scale), width - host.offsetWidth - 8);
    host.style.left = `${Math.max(8, left)}px`;
    host.style.top = `${Math.max(ceiling, Math.min(top, floor - host.offsetHeight))}px`;
  }

  // ---------- modes ----------
  function applyModes() {
    el.classList.toggle('adv', ctx.advanced); el.classList.toggle('use-class', ctx.classUse);
    for (const b of el.querySelectorAll('[data-mode]')) b.setAttribute('aria-pressed', (b.dataset.mode === 'adv') === ctx.advanced);
    for (const b of el.querySelectorAll('[data-use]')) b.setAttribute('aria-pressed', (b.dataset.use === 'class') === ctx.classUse);
    fan.setDisabled('inquiry', ctx.classUse);
    if (ctx.classUse && menu === 'inquiry') { menu = null; fan.select(null); closePanel(); }
    if (!ctx.advanced) {   // leaving the advanced mode puts away whatever belongs only to it
      for (const items of Object.values(spec.menus)) for (const item of items) {
        if (item.advanced) {
          if (open && open.id === item.id) closePanel();
          if (pinned.has(item.id)) togglePin(item.id);
          if (item.kind === 'toggle' && ctx.values[item.id]) ctx.set(item.id, false);
        }
        const chosen = item.options && item.options.find((option) => option.id === ctx.values[item.id]);
        if (chosen && chosen.advanced) ctx.set(item.id, item.value);
      }
    }
    if (open) open.panel.refresh();
    for (const panel of pinned.values()) panel.refresh();
    showSubmenu();
    ctx.emit('mode');
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
      b.disabled = flat && b.dataset.kind === 'free';
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

  // ---------- the scene ----------
  // 3D: the shared laboratory (three.js, fetched only now) with the simulation's apparatus on the bench.
  const sceneCanvas = $('.sim-scene');
  let view3d = null;
  if (!flat) {
    const [T, { createKit }, { buildLab }, { createView3D }] = await Promise.all([
      import('../vendor/three.module.min.js'), import('./kit.js'), import('./lab.js'), import('./view3d.js')]);
    const kit = createKit(T);
    view3d = createView3D(T, sceneCanvas, ctx, spec.camera);
    const lab = buildLab(T, kit, view3d.scene, spec.board);
    view3d.onQuality(lab.setShadowLevel);
    const scene = spec.create({ T, kit, view: view3d, world: lab.world, ctx });
    view3d.onUpdate(scene.update);
    el.scene = scene; el.view = view3d;   // for checking from the browser console
  }
  // 2D: a plain bright room for now, until the Canvas 2D scenes arrive (stage 5).
  function drawScene() {
    if (!flat) return;
    const w = sceneCanvas.clientWidth, h = sceneCanvas.clientHeight, ratio = Math.min(window.devicePixelRatio || 1, 2);
    if (!w || !h) return;
    sceneCanvas.width = w * ratio; sceneCanvas.height = h * ratio;
    const g = sceneCanvas.getContext('2d');
    g.setTransform(ratio, 0, 0, ratio, 0, 0);
    g.fillStyle = '#efe7d9'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#c9ad84'; g.fillRect(w * 0.3, h * 0.1, w * 0.58, h * 0.32);
    g.fillStyle = '#2f5247'; g.fillRect(w * 0.3 + 8, h * 0.1 + 8, w * 0.58 - 16, h * 0.32 - 16);
    g.fillStyle = '#e3cfad'; g.fillRect(0, h * 0.5, w, h * 0.5);
    g.fillStyle = '#f0eeea'; g.fillRect(0, h * 0.56, w, h * 0.44);
    g.strokeStyle = 'rgba(117, 116, 112, 0.35)'; g.lineWidth = 1.5;
    for (let i = 0; i < 7; i++) { g.beginPath(); g.moveTo(w * (0.08 + i * 0.15), h * 0.56); g.bezierCurveTo(w * (0.02 + i * 0.16), h * 0.7, w * (0.2 + i * 0.13), h * 0.82, w * (0.1 + i * 0.15), h); g.stroke(); }
  }

  const onResize = () => {
    if (tall.matches && open && fan.open) { setFan(false); submenu.classList.remove('on'); }   // e.g. a phone turned upright
    drawScene(); place();
  };
  window.addEventListener('resize', onResize);
  tall.addEventListener('change', onResize);

  applyModes();
  applyView();
  return {
    el, title: `${found.sim.name} · ${found.subject.name}`,
    enter() { if (view3d) view3d.start(); drawScene(); place(); },
    leave() {
      clock.pause(); closePanel(); if (view3d) view3d.dispose();
      for (const panel of pinned.values()) panel.stop();
      window.removeEventListener('resize', onResize); tall.removeEventListener('change', onResize);
    },
  };
}
