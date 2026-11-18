// The fan menu on the left: a round button that unfolds five rounded fan-blade pieces.
// Drawn in SVG with the round button's centre at (0, 0); lengths are design pixels of the 1920-wide layout.
const R_IN = 72, R_OUT = 248, R_LABEL = 160;   // inner edge, outer edge and label distance from the centre
const HALF = 13.4, STEP = 30, CORNER = 11;     // half-width and spacing of the pieces in degrees; corner radius

// One piece pointing to the right (the SVG group is then turned to its place).
function piecePath() {
  const h = HALF * Math.PI / 180, f = (n) => n.toFixed(2);
  const p = (r, a) => `${f(r * Math.cos(a))} ${f(r * Math.sin(a))}`;
  const outA = h - Math.asin(CORNER / (R_OUT - CORNER)), outD = Math.sqrt((R_OUT - CORNER) ** 2 - CORNER ** 2);
  const inA = h - Math.asin(CORNER / (R_IN + CORNER)), inD = Math.sqrt((R_IN + CORNER) ** 2 - CORNER ** 2);
  const c = `A ${CORNER} ${CORNER} 0 0 1`;
  return `M ${p(inD, -h)} L ${p(outD, -h)} ${c} ${p(R_OUT, -outA)} A ${R_OUT} ${R_OUT} 0 0 1 ${p(R_OUT, outA)} ${c} ${p(outD, h)}`
    + ` L ${p(inD, h)} ${c} ${p(R_IN, inA)} A ${R_IN} ${R_IN} 0 0 0 ${p(R_IN, -inA)} ${c} ${p(inD, -h)} Z`;
}

// menus: [{ id, label }]. onOpen(open) and onPick(id) report what the user did; the frame decides what follows.
export function createFan(menus, { onOpen, onPick }) {
  const el = document.createElement('div');
  el.className = 'fan';
  const angle = (i) => (i - (menus.length - 1) / 2) * STEP;
  el.innerHTML = `
    <svg viewBox="-50 -262 312 524">${menus.map((menu, i) => `
      <g class="seg" role="button" tabindex="-1" aria-pressed="false" data-menu="${menu.id}" style="--a:${angle(i)}deg">
        <path d="${piecePath()}"/><text x="${R_LABEL}" y="0">${menu.label}</text>
      </g>`).join('')}
    </svg>
    <button class="fan-toggle" type="button" aria-expanded="false" aria-label="메뉴">
      <span class="fan-word">메뉴</span>
      <svg class="fan-x" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5 5 19" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>
    </button>`;

  const toggle = el.querySelector('.fan-toggle'), segs = [...el.querySelectorAll('.seg')];
  let open = false;
  toggle.addEventListener('click', () => onOpen(!open));
  for (const seg of segs) {
    const pick = () => { if (open && !seg.classList.contains('off')) onPick(seg.dataset.menu); };
    seg.addEventListener('click', pick);
    seg.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
  }

  return {
    el, toggle,
    get open() { return open; },
    // how far the label of a piece sits above (-) or below (+) the centre, in design pixels
    labelY: (id) => R_LABEL * Math.sin(angle(menus.findIndex((menu) => menu.id === id)) * Math.PI / 180),
    setOpen(on) {
      open = on;
      el.classList.toggle('open', on);
      toggle.setAttribute('aria-expanded', on);
      for (const seg of segs) seg.tabIndex = on && !seg.classList.contains('off') ? 0 : -1;
    },
    select(id) {
      for (const seg of segs) {
        const on = seg.dataset.menu === id;
        seg.classList.toggle('on', on); seg.setAttribute('aria-pressed', on);
      }
    },
    setDisabled(id, off) {
      const seg = segs.find((one) => one.dataset.menu === id);
      seg.classList.toggle('off', off); seg.setAttribute('aria-disabled', off);
      seg.tabIndex = open && !off ? 0 : -1;
    },
  };
}
