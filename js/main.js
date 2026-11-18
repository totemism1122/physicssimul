// Address handling and the dissolve between screens.
//   #/                      first screen (subject cards)
//   #/physics               unit list of a subject
//   #/physics/P-13?mode=adv&use=class   a simulation; options after "?" (advanced mode, classroom use)
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
  if (screen.enter) screen.enter();
  screen.el.getBoundingClientRect();   // settle the starting opacity before fading in
  screen.el.classList.add('on');
  if (previous) {
    previous.el.classList.remove('on');
    previous.el.inert = true;
    setTimeout(() => { previous.el.remove(); if (previous.leave) previous.leave(); }, DISSOLVE_MS + 40);
  }
}

// The simulation frame and its style sheet are fetched only when a simulation is opened,
// so the first screen and the unit list stay light.
function loadStyle(href) {
  if (document.querySelector(`link[href="${href}"]`)) return Promise.resolve();
  return new Promise((done) => {
    const link = Object.assign(document.createElement('link'), { rel: 'stylesheet', href, onload: done, onerror: done });
    document.head.append(link);
  });
}
async function simScreenFor(found, query) {
  const [{ simScreen }] = await Promise.all([import('./frame/frame.js'), loadStyle('css/sim.css')]);
  return simScreen(found, query, setAddress);
}

function screenFor(hash) {
  const [path, options] = hash.replace(/^#\/?/, '').split('?');
  const [subjectId, code] = path.split('/').filter(Boolean);
  const subject = findSubject(subjectId);
  if (!subject) return firstScreen();
  const found = code && findSim(code);
  if (found && found.sim.ready && found.subject === subject) return simScreenFor(found, new URLSearchParams(options || ''));
  return unitsScreen(subject);
}

// The trail of addresses visited in this tab, so the on-screen back arrow can use the browser's own "back"
// when that leads to the same place (no duplicate history entries).
const trail = [];
let turn = 0;
async function route() {
  const hash = location.hash || '#/';
  if (trail[trail.length - 2] === hash) trail.pop();
  else if (trail[trail.length - 1] !== hash) trail.push(hash);
  const mine = ++turn;
  const screen = await screenFor(hash);   // a simulation takes a moment; the screen before it stays until it is ready
  if (mine === turn) show(screen);
  else if (screen.leave) screen.leave();
}
// Changes the address without leaving the screen (the mode buttons of a simulation).
function setAddress(hash) {
  trail[trail.length - 1] = hash;
  history.replaceState(null, '', hash);
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
