// A control panel for one item of a detailed menu: a slider, a choice, a graph, a record table or a short note.
// Every panel can be pinned (kept on screen); sliders and choices can also be locked (value held).
import { createGraph, createBars } from './graph.js';

const text = (item, value) => (item.digits ? value.toFixed(item.digits) : String(value)) + (item.unit || '');

// ctx: the frame's shared state (values, locked, advanced, set, traces, tables).  on: { pin(), close() }.
export function buildPanel(item, ctx, on) {
  const el = document.createElement('section');
  el.className = `panel panel-${item.kind}${(item.plots && item.plots.length > 1) || Array.isArray(item.bars) ? ' stacked' : ''}${item.wide ? ' wide' : ''}`;
  const canLock = item.kind === 'slider' || item.kind === 'choice';
  el.innerHTML = `
    <header><h3>${item.label}</h3>${item.kind === 'slider' ? '<output></output>' : ''}</header>
    <div class="panel-body"></div>
    <footer class="chips">
      ${canLock ? '<button class="chip lock" type="button" aria-pressed="false">잠금</button>' : ''}
      ${item.kind === 'table' ? '<button class="chip wipe" type="button">지우기</button>' : ''}
      <button class="chip pin" type="button" aria-pressed="false">고정</button>
      <button class="chip close" type="button">닫기</button>
    </footer>`;
  const body = el.querySelector('.panel-body'), lock = el.querySelector('.lock'), pin = el.querySelector('.pin');
  let refresh = () => {}, stop = () => {};

  if (item.kind === 'slider') {
    const out = el.querySelector('output');
    body.innerHTML = `<input type="range" min="${item.min}" max="${item.max}" step="${item.step}" aria-label="${item.label}">`;
    const input = body.firstChild;
    refresh = () => {
      input.value = ctx.values[item.id]; input.disabled = ctx.locked.has(item.id);
      input.style.setProperty('--p', (ctx.values[item.id] - item.min) / (item.max - item.min));
      out.textContent = text(item, ctx.values[item.id]);
    };
    input.addEventListener('input', () => { ctx.set(item.id, Number(input.value)); refresh(); });
  } else if (item.kind === 'choice') {
    body.classList.add('chips');
    refresh = () => {
      body.innerHTML = item.options.filter((option) => !option.advanced || ctx.advanced).map((option) => `
        <button class="chip option" type="button" data-id="${option.id}" aria-pressed="${ctx.values[item.id] === option.id}"
          ${ctx.locked.has(item.id) ? 'disabled' : ''}>${option.label}</button>`).join('');
    };
    body.addEventListener('click', (e) => {
      const option = e.target.closest('.option');
      if (option && !option.disabled) { ctx.set(item.id, option.dataset.id); refresh(); }
    });
  } else if (item.kind === 'graph') {
    body.innerHTML = '<canvas></canvas>';
    stop = (item.bars ? createBars(body.firstChild, [].concat(item.bars).map((id) => ctx.charts[id])) : createGraph(body.firstChild, item, ctx.traces)).stop;
  } else if (item.kind === 'table') {
    // rows are added by the simulation (ctx.tables[id].rows); a cell that differs from the row above is marked
    const table = ctx.tables[item.id];
    refresh = () => {
      const columns = item.columns.map((column, i) => [column, i]).filter(([column]) => !column.advanced || ctx.advanced);
      body.innerHTML = table.rows.length ? `<table><thead><tr>${columns.map(([column]) => `<th>${column.label}<small>${column.unit || ''}</small></th>`).join('')}</tr></thead><tbody>${
        table.rows.map((row, r) => `<tr>${columns.map(([column, i]) =>
          `<td${r && !column.result && table.rows[r - 1][i] !== row[i] ? ' class="changed"' : ''}>${row[i]}</td>`).join('')}</tr>`).join('')}</tbody></table>`
        : `<p>${item.text || ''}</p>`;
    };
    el.querySelector('.wipe').addEventListener('click', () => table.clear());
  } else {
    body.innerHTML = `<p>${item.text || ''}</p>`;
  }

  if (lock) lock.addEventListener('click', () => {
    const locked = !ctx.locked.has(item.id);
    if (locked) ctx.locked.add(item.id); else ctx.locked.delete(item.id);
    lock.setAttribute('aria-pressed', locked);
    refresh();
  });
  pin.addEventListener('click', on.pin);
  el.querySelector('.close').addEventListener('click', on.close);
  if (lock) lock.setAttribute('aria-pressed', ctx.locked.has(item.id));
  refresh();

  return { el, item, refresh, stop, setPinned(pinned) { pin.setAttribute('aria-pressed', pinned); el.classList.toggle('pinned', pinned); } };
}
