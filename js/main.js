// Address handling and the dissolve between screens.
//   #/                      first screen (subject cards)
//   #/physics               unit list of a subject
//   #/physics/P-13?mode=…   a simulation (options after "?")
import { findSubject, findSim } from './data/units.js';
import { firstScreen } from './home/first.js';
import { unitsScreen } from './home/units.js';
import { startSky } from './home/sky.js';

const app = document.getElementById('app');
const DISSOLVE_MS = 260;   // matches the .screen transition in css/base.css
let current = null;

function show(screen) {
  const previous = current;
  current = screen;
  document.title = screen.title;
  screen.el.classList.add('screen');
  app.append(screen.el);
  screen.el.getBoundingClientRect();   // settle the starting opacity before fading in
  screen.el.classList.add('on');
  if (previous) {
    previous.el.classList.remove('on');
    previous.el.inert = true;
    setTimeout(() => { previous.el.remove(); if (previous.leave) previous.leave(); }, DISSOLVE_MS + 40);
  }
}

// Temporary: stands in for the simulation screen until the common frame is built (stage 2).
function placeholderScreen(found) {
  const el = document.createElement('section');
  el.className = 'units';
  el.innerHTML = `
    <a class="back" href="#/${found.subject.id}" data-up>${chevron}<span>Physics</span></a>
    <header class="units-head"><h1>${found.number} ${found.sim.name}</h1><p>${found.subject.name} · ${found.part.roman} ${found.part.name}</p></header>`;
  return { el, title: `${found.sim.name} · ${found.subject.name}` };
}
const chevron = '<svg viewBox="0 0 12 20" aria-hidden="true"><path d="M10 2 2 10l8 8" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function screenFor(hash) {
  const [subjectId, code] = hash.replace(/^#\/?/, '').split('?')[0].split('/').filter(Boolean);
  const subject = findSubject(subjectId);
  if (!subject) return firstScreen();
  const found = code && findSim(code);
  if (found && found.sim.ready && found.subject === subject) return placeholderScreen(found);
  return unitsScreen(subject);
}

// The trail of addresses visited in this tab, so the on-screen back arrow can use the browser's own "back"
// when that leads to the same place (no duplicate history entries).
const trail = [];
function route() {
  const hash = location.hash || '#/';
  if (trail[trail.length - 2] === hash) trail.pop();
  else if (trail[trail.length - 1] !== hash) trail.push(hash);
  show(screenFor(hash));
}
document.addEventListener('click', (e) => {
  const up = e.target.closest('a[data-up]');
  if (!up || e.metaKey || e.ctrlKey || e.shiftKey) return;
  e.preventDefault();
  const target = up.getAttribute('href');
  if (trail[trail.length - 2] === target) history.back();
  else { trail.pop(); location.replace(target); }
});

window.addEventListener('hashchange', route);
startSky(document.getElementById('sky'));
route();
