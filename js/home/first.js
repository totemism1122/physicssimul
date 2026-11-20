// First screen: the title and the three subject cards.
import { SUBJECTS } from '../data/units.js';

// Where each bust sits inside its card's picture box: [file, left %, top %, width %], back to front.
// The box clips whatever falls outside it, as in the approved mockup.
const BUSTS = {
  physics: [['galileo', 6, 6, 88], ['faraday', -6.5, 36, 73], ['young', 34, 37, 79]],
  mechanics: [['einstein', 32.5, 1.5, 67.5], ['newton', -5.5, 32.5, 60]],
  quantum: [['bohr', 37, 7.5, 63], ['maxwell', -1, 29, 69]],
};

// Phones fetch only the small pictures (about 350 KB less): students come in over mobile data.
const phone = window.matchMedia('(max-width: 700px), (max-height: 500px)').matches;
function bustImage([name, left, top, width]) {
  const source = phone ? `src="assets/img/${name}-360.webp"`
    : `src="assets/img/${name}-760.webp" srcset="assets/img/${name}-360.webp 360w, assets/img/${name}-760.webp 760w" sizes="(max-aspect-ratio: 4/5) 38vw, 19vw"`;
  return `<img ${source} alt="" draggable="false" style="left:${left}%;top:${top}%;width:${width}%">`;
}

export function firstScreen() {
  const el = document.createElement('section');
  el.className = 'first';
  el.innerHTML = `
    <div class="first-in">
      <h1 class="logo">Physics</h1>
      <nav class="subjects">${SUBJECTS.map((subject) => `
        <a class="subject" href="#/${subject.id}">
          <span class="busts">${BUSTS[subject.id].map(bustImage).join('')}</span>
          <span class="rule"></span>
          <span class="subject-name">${subject.name}</span>
        </a>`).join('')}
      </nav>
    </div>`;

  for (const card of el.querySelectorAll('.subject')) {
    // The figures of a card fade in together once all of them have arrived, rather than popping in one by one.
    const busts = card.querySelector('.busts');
    Promise.all([...busts.querySelectorAll('img')].map((img) => img.decode().catch(() => {}))).then(() => busts.classList.add('in'));
    // Touch screens have no hover, so the figures grow for as long as the finger is down.
    const press = (on) => card.classList.toggle('pressed', on);
    card.addEventListener('pointerdown', () => press(true));
    for (const type of ['pointerup', 'pointercancel', 'pointerleave']) card.addEventListener(type, () => press(false));
  }
  return { el, title: 'Physics' };
}
