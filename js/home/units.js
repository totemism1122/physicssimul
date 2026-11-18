// Unit list of one subject: a card per part; an open card lists its chapters and sections.
const openPart = {};   // subject id -> index of the card left open, kept while the page stays loaded

const backArrow = '<svg viewBox="0 0 12 20" aria-hidden="true"><path d="M10 2 2 10l8 8" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const openArrow = '<svg class="arrow" viewBox="0 0 12 20" aria-hidden="true"><path d="m2 2 8 8-8 8" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function partCard(subject, part, index) {
  let row = 0;   // order of appearance, for the top-to-bottom reveal
  const chapters = part.chapters.map((chapter, c) => `
    <h3 class="chapter row" style="--i:${row++}">${c + 1}. ${chapter.name}</h3>
    <ul>${chapter.sims.map((sim, n) => {
      const inner = `<span class="num">${String(n + 1).padStart(2, '0')}</span><span class="entry-name">${sim.name}</span>`;
      return `<li class="row" style="--i:${row++}">${sim.ready
        ? `<a class="entry" href="#/${subject.id}/${sim.code}">${inner}</a>`
        : `<span class="entry off" aria-disabled="true">${inner}</span>`}</li>`;
    }).join('')}</ul>`).join('');
  const count = part.chapters.reduce((sum, chapter) => sum + chapter.sims.length, 0);
  return `
    <section class="part">
      <button class="part-head" type="button" aria-expanded="false" aria-controls="part-${index}">
        <span class="roman">${part.roman}</span><span class="part-name">${part.name}</span>
        <span class="count">${count}개</span>${openArrow}
      </button>
      <div class="part-body" id="part-${index}" inert><div class="part-body-in"><div class="part-list">${chapters}</div></div></div>
    </section>`;
}

export function unitsScreen(subject) {
  const el = document.createElement('section');
  el.className = 'units';
  el.innerHTML = `
    <a class="back" href="#/" data-up>${backArrow}<span>Physics</span></a>
    <header class="units-head"><h1>${subject.name}</h1><p>대단원을 눌러 펼치세요</p></header>
    <div class="parts">${subject.parts.map((part, i) => partCard(subject, part, i)).join('')}</div>`;

  const parts = el.querySelector('.parts'), cards = [...el.querySelectorAll('.part')];
  function open(index, scroll) {
    openPart[subject.id] = index;
    parts.classList.toggle('has-open', index >= 0);
    cards.forEach((card, i) => {
      const on = i === index;
      card.classList.toggle('open', on);
      card.querySelector('.part-head').setAttribute('aria-expanded', on);
      card.querySelector('.part-body').inert = !on;
    });
    if (scroll && index >= 0) setTimeout(() => cards[index].scrollIntoView({ block: 'nearest', behavior: 'smooth' }), 340);
  }
  cards.forEach((card, i) => card.querySelector('.part-head').addEventListener('click', () => open(card.classList.contains('open') ? -1 : i, true)));
  if (openPart[subject.id] >= 0) open(openPart[subject.id], false);

  return { el, title: `${subject.name} · Physics` };
}
