// P-18 Energy bands and semiconductors (3D).
//
// Bands: atoms of a material gather on a plate, one after another (as the dots gather on the screen of the double
// slit in P-16). A board behind shows the two outermost energy levels of their electrons: with one atom two lines,
// with N atoms each split into N lines (the electrons of all the atoms fill them from the lowest, two to a line), and
// as the plate fills the lines crowd into two bands. A metal conducts in either of two ways, as the textbook says:
// copper has one outer electron to an atom, so that its lower band is only partly filled (the upper band is drawn
// just touching it); magnesium has two, which would fill the lower band, but the two bands lie one over the other,
// so that the electrons fill both up to one height. Either way empty levels are right above the filled ones. In
// silicon and diamond two electrons to an atom fill the lower band, and a small gap parts it from the upper one in
// silicon, a large one in diamond. When the plate is full, the two rods of a tester (a battery and a lamp, after the
// textbook's activity) touch it: the lamp lights if current flows.
// How wide a band of N atoms is comes from a row of N atoms (its levels reach E0 ± 2t cos(π ÷ (N + 1))); within it
// the N levels are spaced evenly. (In the row they crowd at the edges of the band, which a solid does not: there the
// levels are fewest at the edges. Crowded lines were seen as a bright stripe, like a level of its own.) With 1, 2 or
// 3 atoms the levels are those of the row. Where the bands lie and how wide they are is a rough drawing, only the
// gap between them is the measured one.
//
// Doping: a crystal of silicon drawn flat, as the textbook draws it (each atom shares two electrons with each of its
// four neighbours). An atom of phosphorus or of boron is carried to a place in the crystal. Phosphorus has an
// electron to spare, which goes about the crystal freely; boron has one too few, so that a place for an electron
// stays empty: a hole, drawn as a ball with a dotted rim, which goes from bond to bond as an electron of a bond
// beside it steps into it. While the clock runs both go about at random, this way and that (no current); with the
// switch closed the battery's voltage is on the crystal, and their going leans to one side: the electron towards
// the (+) side, the hole towards the (−) side (a current).
//
// The diode: a light-emitting diode in a circuit with a supply and a 100 Ω resistor, as in the textbook's activity,
// and behind it its junction drawn large: the p side with its holes, the n side with its electrons. With the p side
// joined to (+) and the voltage high enough, holes and electrons come to the junction and join there, each pair
// giving a grain of light of the diode's colour, while others come in from the wires: a current. Joined the other
// way, they draw back from the junction and nothing flows. The voltage of the supply is raised by its knob to find
// where each of five diodes begins to light; that voltage is kept against the frequency of the light.
//
// What is set by hand can be set from the menu as well.
const FULL = '#7fb2e6', BARE = '#f0c987';   // (as the textbook draws them: what is filled blue, what is empty yellow)
const KB = 8.617e-5, CHARGE = 1.602e-19;   // Boltzmann's constant (eV/K); the charge of an electron (C)
// the materials: what they are, the gap between the bands (eV), the two levels of one atom (eV, on the board) and
// how far each spreads either way (2 × reach) in the solid, its outer electrons to an atom; a metal: why it conducts
// (part: its band is partly filled, over: two bands overlap), what it resists at 293 K (Ω m) and how much more for
// each kelvin (of that), the highest temperature it is brought to (K: magnesium melts at 923 K), whether its line on
// the graph is broken (dashed: it lies nearly on copper's). mark: its symbol, which names its line on the graph (as the textbook's graph does: the names would not fit); a semiconductor or insulator: how easily the electrons and holes move (m²/V s)
const STUFF = {
  copper: { name: '구리', mark: 'Cu', kind: '도체', gap: 0, at: [3, 7.4], reach: [1.0, 1.2], outer: 1, why: 'part', rho: [1.68e-8, 0.0039], tint: 0xc8824a },
  magnesium: { name: '마그네슘', mark: 'Mg', kind: '도체', gap: 0, at: [3, 6], reach: [1.0, 1.2], outer: 2, why: 'over', rho: [4.39e-8, 0.0038], most: 900, melt: 923, dashed: true, tint: 0xc3c6cd },
  silicon: { name: '규소', mark: 'Si', kind: '반도체', gap: 1.11, at: [3, 6.51], reach: [0.6, 0.6], outer: 2, tint: 0x8d9bb5, mobile: 0.183 },
  diamond: { name: '다이아몬드', mark: 'C', kind: '부도체', gap: 5.5, at: [2, 9.1], reach: [0.4, 0.4], outer: 2, tint: 0xd6ecf2, mobile: 0.4 },
};
// (doping) what is put into the silicon: its name and sign, what the silicon is then called, how many outer electrons it has and what it leaves
const DOPANTS = {
  none: { name: '없음', kind: '고유 반도체', own: 4, makes: '–' },
  p: { name: '인', mark: 'P', kind: 'n형 반도체', own: 5, makes: '여분의 전자', tint: 0xe8a33d },
  b: { name: '붕소', mark: 'B', kind: 'p형 반도체', own: 3, makes: '양공', tint: 0x9c8cf0 },
};
const onBand = (v) => v.scene === 'band', onDope = (v) => v.scene === 'dope', onLed = (v) => v.scene === 'led';   // which arrangement an item of a menu belongs to
const COLS = 24, ROWS = 15, MOST = COLS * ROWS, PACE = { slow: 2, mid: 20, fast: 100 };   // the places on the plate; atoms a second
// the levels of n atoms of a material, from the lowest: each with its energy, the band it is in (0 the lower), how many
// electrons it holds (0, 1 or 2), and whether it holds any. The electrons of all the atoms fill them from the lowest, whichever band they are in
function levelsOf(id, n) {
  const stuff = STUFF[id], all = [];
  stuff.at.forEach((mid, band) => {
    const half = 2 * stuff.reach[band] * Math.cos(Math.PI / (n + 1));   // (half the width, as in a row of n atoms)
    for (let k = 1; k <= n; k++) all.push({ e: n === 1 ? mid : mid + half * (2 * k - n - 1) / (n - 1), band });   // (evenly within it)
  });
  let left = stuff.outer * n;
  return all.sort((a, b) => a.e - b.e).map(({ e, band }) => { const held = Math.min(2, left); left -= held; return { e, band, held, full: held > 0 }; });
}
// how many electrons of a m³ the heat has lifted over the gap, at the temperature T (K)
const lifted = (id, T) => 5.2e21 * T ** 1.5 * Math.exp(-STUFF[id].gap / (2 * KB * T));
// how much a metre cube of it resists a current (Ω m) at the temperature T (K)
function resist(id, T) {
  if (STUFF[id].rho) { const [warm, rise] = STUFF[id].rho; return Math.max(2e-10, warm * (1 + rise * (T - 293))); }   // (a metal: it grows with the temperature, as the atoms shake more)
  return Math.min(1e14, 1 / (CHARGE * lifted(id, T) * STUFF[id].mobile * (T / 300) ** -2.2));   // (no real insulator resists more than some 10^14: what is mixed in it carries a little)
}
// (the diode) the light-emitting diodes: the wavelength of their light (nm) and the least voltage at which they light
// (V: about what such diodes show, so not quite on one line against the frequency)
const LEDS = {
  ir: { name: '적외선', wave: 940, on: 1.05, tint: 0x9a3a3a, dome: 0x4a4458 },
  red: { name: '적색', wave: 630, on: 1.65, tint: 0xff3b30 },
  yellow: { name: '황색', wave: 590, on: 1.8, tint: 0xffc61a },
  green: { name: '녹색', wave: 525, on: 2.25, tint: 0x35d46a },
  blue: { name: '청색', wave: 470, on: 2.5, tint: 0x3d7bff },
};
const PLANCK = 4.136e-15, hertz = (id) => 2.998e8 / (LEDS[id].wave * 1e-9) / 1e14;   // Planck's constant (eV s); the frequency of a diode's light (10^14 Hz)
const FREQS = Object.keys(LEDS).sort((a, b) => hertz(a) - hertz(b));   // the diodes from the lowest frequency
const SEEN = 0.07, FULL_MA = 20, VOLT_MAX = 4;   // the current (mA) from which the light is seen, and at which it is as bright as it is drawn; the most the supply gives (V)
// (advanced) the photodiode: where it begins to carry a current forwards (V), and the current the light makes in it,
// the other way, for each % of the lamp (mA). How much is mixed into the two sides: how many holes and electrons are drawn
const PHOTO = { name: '광 다이오드', on: 0.7, tint: 0x000000, dome: 0x2a2c34, each: 0.04 };
const DOSES = { low: { name: '낮음', n: 6 }, mid: { name: '보통', n: 10 }, high: { name: '높음', n: 14 } };
// the resistor, and what the diode itself resists with the usual amount mixed in (kΩ): the more is mixed in, the less (as 1 ÷ it)
const LOAD = 0.1, INNER = 0.03, inner = (n) => INNER * 10 / n;
// the junction's own barrier (V) is taken this much above the voltage at which the diode begins to carry a current: the
// voltage on the junction stays below it whatever the supply gives, so that the strip without holes and electrons grows
// thin but is never gone (its width goes as √(barrier − voltage on the junction), as for a junction mixed evenly)
const BARRIER = 0.3;
// the current (mA) through a diode and the resistor with the supply at volt, the diode joined forwards:
// current = 0.1 mA × e^((voltage on the junction − on) ÷ 0.05 V) − lit,
// voltage on the junction = volt − current × (the resistor + the diode's own resistance)
// (lit: what the light makes in a photodiode: the current is then below nought, the other way. n: how much is mixed in)
function flow(id, volt, lit = 0, n = 10) {
  const on = (LEDS[id] || PHOTO).on, ohms = LOAD + inner(n);
  let lo = -lit, hi = volt / ohms;
  for (let k = 0; k < 40; k++) { const mid = (lo + hi) / 2; if (0.1 * Math.exp((volt - mid * ohms - on) / 0.05) - lit > mid) lo = mid; else hi = mid; }
  return (lo + hi) / 2;
}
const plain = (value) => { if (!(value > 0)) return '0'; const n = Math.floor(Math.log10(value)); return `${(value / 10 ** n).toFixed(1)}×10${[...String(n)].map((c) => '¯⁰¹²³⁴⁵⁶⁷⁸⁹'['-0123456789'.indexOf(c)]).join('')}`; };   // a number as power() below writes it, but without marks (¯ for the raised minus, which the Korean face draws a whole square wide): for the graph
const TEMPS = Array.from({ length: 41 }, (_, k) => 200 + 20 * k), INKS = { copper: '#e39a6c', magnesium: '#c59be8', silicon: '#7fb2e6', diamond: '#8fd19e' };   // (advanced) the temperatures of the graph (K) and the colours of its lines
const READ = { stuff: '' };   // (the material on the plate: the one whose value is written where the graph is pressed)
const COLD = 200, HOT = 1000, ROOM = 300;   // (advanced) the temperatures the plate can be brought to (K), and that of the room
const topOf = (id) => STUFF[id].most || HOT;   // (the highest for a material: below where it melts)
const power = (value) => { const n = Math.floor(Math.log10(value)); return `${(value / 10 ** n).toFixed(1)} ×10<sup>${String(n).replace('-', '−')}</sup>`; };   // a number as it is written

export default {
  // what is taken for granted, written on screen by the frame
  premise: (v, advanced) => (onLed(v) ? (v.led === 'pd' ? '전자와 양공은 실제보다 훨씬 크고 느리며 수도 적게 그렸습니다. 광 다이오드에는 빛의 세기 100 %에서 4 mA가 흐른다고 두었습니다' : '전자와 양공은 실제보다 훨씬 크고 느리며 수도 적게 그렸습니다. 적외선은 눈에 보이지 않지만 흐린 붉은빛으로 그렸습니다') + (advanced ? '. 다이오드 자체의 저항은 도핑 농도에 반비례하고, 접합면의 전위 장벽은 작동 전압보다 0.3 V 높다고 두었습니다' : '. 다이오드 자체에도 저항(30 Ω)이 있다고 두었습니다') : onDope(v) ? '공유 결합을 평면에 펴서 그렸습니다. 전자와 양공은 실제보다 훨씬 크고 느리게 그렸습니다(제멋대로인 움직임은 실제로는 한쪽으로 쏠리는 이동보다 훨씬 빠름). 불순물은 실제로는 규소 원자 수백만 개에 하나쯤입니다' + (advanced ? '. 열로 생긴 전자와 양공의 쌍은 수가 100배가 될 때마다 1쌍씩 그렸습니다' : '') : `가장 바깥의 두 준위만 그렸습니다. 띠의 너비는 원자가 한 줄로 이어졌을 때의 식으로 어림하고 띠 안의 준위는 고르게 놓았으며, 띠 간격만 실제 값입니다${advanced ? '. 전도띠로 올라간 전자는 수가 10배가 될 때마다 점 2개씩 늘려 그렸습니다' : ''}`),
  fixedViews: ['front'],
  camera: { target: [0.2, 2.9, 0], r: 16.5, theta: 0, phi: 1.3, rMax: 40 },
  // (the diode) not against time: the least voltage of the supply at which each diode has been seen alight (V), against
  // the frequency of its light (10^14 Hz). Every line has a place for each diode, in the order of FREQS, empty (NaN)
  // but for its own; v0 is empty throughout (the first line: it gives the graph its axes and is never what is read)
  // (the bands, advanced) how much the full plate resists at each temperature it has been at, a line for each material
  // and (rnow) a point for where it is now. Kept by tenfolds, as the textbook draws it: log10(ρ in Ω m) + 10, so that
  // the axis runs from 10^-10 to 10^16. Every line has a place for each of TEMPS, empty (NaN) where the plate has not been
  traces: {
    ...Object.fromEntries(['0', ...Object.keys(LEDS)].map((id) => [`v${id}`, { range: 3, read: (volt) => (Number.isFinite(volt) ? `${volt.toFixed(2)} V` : '') }])),
    ...Object.fromEntries([...Object.keys(STUFF), 'now'].map((id) => [`r${id}`, { window: 1e6, range: 26, read: (value) => (id === READ.stuff && !(STUFF[id] && STUFF[id].dashed) && Number.isFinite(value) ? `${plain(10 ** (value - 10))} Ω·m` : '') }])),
    // (a dashed line has places left empty, where it could not be read: an unseen line of all its values, rnameAll, is read instead, its symbol written with the value)
    ...Object.fromEntries(Object.keys(STUFF).filter((id) => STUFF[id].dashed).map((id) => [`r${id}All`, { window: 1e6, range: 26, read: (value) => (id === READ.stuff && Number.isFinite(value) ? `${STUFF[id].mark} ${plain(10 ** (value - 10))} Ω·m` : '') }])),
  },
  menus: {
    vars: [
      { id: 'scene', label: '장면 선택', kind: 'choice', value: 'band', options: [{ id: 'band', label: '에너지띠' }, { id: 'dope', label: '불순물 반도체' }, { id: 'led', label: '발광 다이오드' }] },
      { id: 'led', label: (v, advanced) => (advanced ? '다이오드' : '발광 다이오드의 색'), kind: 'choice', value: 'red', when: onLed, options: [...Object.keys(LEDS).map((id) => ({ id, label: LEDS[id].name })), { id: 'pd', label: PHOTO.name, advanced: true }] },   // (advanced: the photodiode is one of them)
      { id: 'light', label: '빛의 세기', kind: 'slider', min: 0, max: 100, step: 5, value: 50, unit: '%', advanced: true, when: (v) => onLed(v) && v.led === 'pd' },
      { id: 'volt', label: '전원 장치의 전압', kind: 'slider', min: 0, max: VOLT_MAX, step: 0.05, value: 0, unit: 'V', when: (v) => onLed(v) && v.led !== 'pd' },
      { id: 'turned', label: '반대로 연결', kind: 'toggle', when: (v) => onLed(v) && v.led !== 'pd' },
      { id: 'dose', label: '도핑 농도', kind: 'choice', value: 'mid', advanced: true, when: onLed, options: Object.keys(DOSES).map((id) => ({ id, label: DOSES[id].name })) },
      { id: 'dopant', label: '불순물', kind: 'choice', value: 'none', options: [{ id: 'none', label: '없음 (고유 반도체)' }, { id: 'p', label: '인 (P)' }, { id: 'b', label: '붕소 (B)' }], when: onDope },
      { id: 'many', label: '불순물의 수', kind: 'slider', min: 1, max: 4, step: 1, value: 1, unit: '개', advanced: true, when: (v) => onDope(v) && v.dopant !== 'none' },
      { id: 'warm', label: '온도', kind: 'slider', min: COLD, max: HOT, step: 20, value: ROOM, unit: 'K', advanced: true, when: onDope },
      { id: 'closed', label: '스위치 닫기', kind: 'toggle', when: onDope },
      { id: 'stuff', label: '물질', kind: 'choice', value: 'copper', when: onBand, options: Object.keys(STUFF).map((id) => ({ id, label: `${STUFF[id].name} (${STUFF[id].kind})` })) },
      { id: 'atoms', label: '원자의 수', kind: 'slider', min: 1, max: MOST, step: 1, value: 1, unit: '개', when: onBand },
      { id: 'temp', label: '온도', kind: 'slider', min: COLD, max: (v) => topOf(v.stuff), step: 20, value: ROOM, unit: 'K', advanced: true, when: onBand },
      { id: 'pace', label: '쌓는 빠르기', kind: 'choice', value: 'mid', when: onBand, options: [{ id: 'slow', label: '1초에 2개' }, { id: 'mid', label: '1초에 20개' }, { id: 'fast', label: '1초에 100개' }] },
    ],
    graph: [
      { id: 'rhoTemp', label: '비저항–온도', kind: 'graph', x: '온도(K)', xUnit: 'K', span: [0, HOT + 100], marks: [200, 400, 600, 800, 1000].map((at) => [at, String(at)]), advanced: true, when: onBand,
        plots: [{ y: '비저항(Ω·m)', floor: true, marks: [[2, '10¯⁸'], [6, '10¯⁴'], [10, '1'], [14, '10⁴'], [18, '10⁸'], [22, '10¹²']],
          lines: [...Object.keys(STUFF).map((id) => ({ trace: `r${id}`, color: INKS[id], name: STUFF[id].mark })), ...Object.keys(STUFF).filter((id) => STUFF[id].dashed).map((id) => ({ trace: `r${id}All`, color: 'rgba(0,0,0,0)' })), { trace: 'rnow', color: '#e3c26b', dots: true }] }] },
      { id: 'voltFreq', label: '작동 전압–진동수', kind: 'graph', x: '빛의 진동수(f)', xUnit: '×10¹⁴ Hz', span: [0, 8], when: onLed,
        plots: [{ y: '작동 전압', dots: true, floor: true, lines: [{ trace: 'v0', color: 'rgba(0,0,0,0)' }, ...Object.keys(LEDS).map((id) => ({ trace: `v${id}`, color: `#${(id === 'ir' ? 0xc98a8a : LEDS[id].tint).toString(16)}` }))] }] },
    ],
    time: [
      { id: 'reset', label: '처음으로', kind: 'action' },
    ],
    layers: [
      { id: 'numbers', label: '값', kind: 'toggle' },
    ],
    inquiry: [
      { id: 'table3', label: '기록 표', kind: 'table', rows: 5, when: onLed, text: '불이 켜진 가장 낮은 전압이 색마다 적힙니다.',
        columns: [{ label: '색' }, { label: '파장', unit: 'nm' }, { label: '진동수', unit: '×10¹⁴ Hz' }, { label: '작동 전압', unit: 'V', result: true }] },
      { id: 'table2', label: '기록 표', kind: 'table', rows: 8, when: onDope, text: '불순물을 바꿀 때마다 한 줄씩 적힙니다.',
        columns: [{ label: '불순물' }, { label: '원자가<br>전자', unit: '개' }, { label: '생긴 것', result: true }, { label: '반도체의<br>종류', result: true }] },
      { id: 'table', label: '기록 표', kind: 'table', rows: 8, when: onBand, text: '판이 다 차서 측정기가 닿을 때마다 한 줄씩 적힙니다.',
        columns: [{ label: '물질' }, { label: '띠 간격', unit: 'eV' }, { label: '온도', unit: 'K', advanced: true }, { label: '불빛', result: true }, { label: '구분', result: true }] },
    ],
  },

  // writing on the chalkboard (1024 x 400)
  board(g) {
    g.fillStyle = 'rgba(255,255,255,0.9)'; g.font = '56px Georgia, serif'; g.fillText('에너지띠와 반도체', 60, 96);
    g.strokeStyle = 'rgba(255,255,255,0.85)'; g.lineWidth = 4;
    // one level, two, three, and a band
    for (const [x, ys] of [[90, [250]], [230, [240, 260]], [370, [232, 250, 268]]]) for (const y of ys) { g.beginPath(); g.moveTo(x, y); g.lineTo(x + 100, y); g.stroke(); }
    g.strokeRect(520, 222, 130, 56); g.strokeRect(520, 130, 130, 50);
    for (let y = 230; y < 278; y += 8) { g.beginPath(); g.moveTo(524, y); g.lineTo(646, y); g.stroke(); }
  },

  // Builds the apparatus on the bench (world) and returns { update(dt) }.
  create({ T, kit, world, view, ctx }) {
    const { mat, add, box, cyl } = kit;
    world.userData.things.visible = false;
    const way = new T.Vector3(), hit = new T.Vector3();
    const M = { dark: mat(0x3a4057), steel: mat(0x9aa1b1, { roughness: 0.5, metalness: 0.5 }), slate: mat(0x23262f, { roughness: 0.9 }) };
    const tipSpot = new T.Vector3(), tip = view.label(tipSpot);   // a word beside what is handled
    let moved = true, tipTime = 0, framed = false, grab = null, running = false;   // (running: the clock runs)
    function say(text, x, y, z, seconds = 0) { tip.write(text); tipSpot.set(x, y, z); tip.show(true); tipTime = seconds; moved = true; }
    // a wire drawn anew: its points written over the old ones (a wire keeps the number of its points)
    function reshape(line, points) { const at = line.geometry.attributes.position; points.forEach((p, k) => at.setXYZ(k, p.x, p.y, p.z)); at.needsUpdate = true; }
    const tall = () => window.matchMedia('(max-aspect-ratio: 4/5)').matches;

    // ====================================== the bands ======================================
    // ---------- the board, the plate with the atoms, and the tester ----------
    // The board stands at the back: the energy E (eV, from an arbitrary nought) is drawn FACE.lo + 0.35 + E × EV
    // high. In front of it the plate leans on the bench (PLATE.lean from the level), with COLS × ROWS places for
    // atoms, CELL apart. A spare atom lies in a dish at the left, to be carried to the plate. When the plate is
    // full, the two rods of the tester (at the right) touch its sides.
    const FACE = { x: 0, z: -1.7, w: 5.2, lo: 1.1, hi: 7.5, px: 128 }, EV = 0.56;
    const PLATE = { x: 0, y: 0.08, z: 2.75, lean: 0.4, w: 5.6, long: 3.6 }, CELL = 0.22, DISH = new T.Vector3(-4.5, 0.42, 1.7);
    const onPlate = (x, up, out) => out.set(PLATE.x + x, PLATE.y + up * Math.sin(PLATE.lean), PLATE.z - up * Math.cos(PLATE.lean));   // a point of the plate: x across it, up its slope from the lower edge
    const rig = new T.Group(); world.add(rig);
    add(rig, box(FACE.w + 0.2, FACE.hi - FACE.lo + 0.2, 0.12), M.slate, FACE.x, (FACE.hi + FACE.lo) / 2, FACE.z - 0.07);
    for (const x of [-2, 2]) { add(rig, box(0.14, FACE.lo, 0.14), M.steel, FACE.x + x, FACE.lo / 2, FACE.z - 0.07); add(rig, box(0.5, 0.1, 1.2), M.dark, FACE.x + x, 0.05, FACE.z - 0.07); }
    const sheet = kit.canvasTexture(Math.round(FACE.w * FACE.px), Math.round((FACE.hi - FACE.lo) * FACE.px), () => {}), ink = sheet.image.getContext('2d');
    add(rig, new T.PlaneGeometry(FACE.w, FACE.hi - FACE.lo), new T.MeshBasicMaterial({ map: sheet, toneMapped: false }), FACE.x, (FACE.hi + FACE.lo) / 2, FACE.z, false, false);
    const plate = new T.Group(); plate.position.set(PLATE.x, PLATE.y, PLATE.z); plate.rotation.x = -(Math.PI / 2 - PLATE.lean); rig.add(plate);
    const plateInk = new T.MeshStandardMaterial({ color: 0x23262f, roughness: 0.9 });   // (its own: it glows when it is hot)
    add(plate, box(PLATE.w, PLATE.long, 0.1), plateInk, 0, PLATE.long / 2, -0.06);
    for (const x of [-2.6, 2.6]) { onPlate(x, PLATE.long - 0.1, way); add(rig, box(0.12, way.y, 0.12), M.steel, way.x, way.y / 2, way.z - 0.1); }
    const atomInk = new T.MeshStandardMaterial({ color: STUFF.copper.tint, roughness: 0.45, metalness: 0.3 }), ball = new T.SphereGeometry(0.095, 14, 10);
    const heap = new T.InstancedMesh(ball, atomInk, MOST); heap.frustumCulled = false; heap.castShadow = false; plate.add(heap);
    // (the places are taken in no order, as the atoms happen to land)
    const order = Array.from({ length: MOST }, (unused, k) => k), spotOf = (k, out) => out.set((k % COLS - (COLS - 1) / 2) * CELL, 0.26 + Math.floor(k / COLS) * CELL, 0.09);
    function shuffle() {
      for (let k = MOST - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [order[k], order[j]] = [order[j], order[k]]; }
      const place = new T.Matrix4(); order.forEach((site, k) => heap.setMatrixAt(k, place.makeTranslation(spotOf(site, way).x, way.y, way.z))); heap.instanceMatrix.needsUpdate = true;
    }
    add(rig, cyl(0.7, 0.55, 0.14, 28), mat(0xd9dde6, { roughness: 0.6 }), DISH.x, 0.07, DISH.z);
    const big = new T.SphereGeometry(0.26, 24, 16), spare = add(rig, big, atomInk, DISH.x, DISH.y, DISH.z), carried = add(rig, big, atomInk, 0, 0, 0); carried.visible = false;
    const addHandle = add(rig, box(1.3, 1.0, 1.3), M.dark, DISH.x, DISH.y, DISH.z, false, false); addHandle.visible = false; addHandle.userData.grip = { kind: 'add' };
    // the tester: a battery in a box, a lamp on it, and two rods on wires
    const TEST = new T.Vector3(4.5, 0, 1.3), ENDS = [onPlate(-PLATE.w / 2, PLATE.long / 2, new T.Vector3()), onPlate(PLATE.w / 2, PLATE.long / 2, new T.Vector3())];
    add(rig, box(1.5, 0.8, 1.0), M.dark, TEST.x, 0.4, TEST.z); add(rig, cyl(0.16, 0.2, 0.22, 16), M.steel, TEST.x, 0.91, TEST.z);
    const lamp = add(rig, new T.SphereGeometry(0.3, 24, 16), new T.MeshBasicMaterial({ color: 0x55524a }), TEST.x, 1.28, TEST.z, false, false);
    const rods = [0, 1].map(() => add(rig, cyl(0.045, 0.045, 1.1, 10), M.steel, 0, 0, 0));
    const wires = [0xb8433a, 0x2b2d36].map((color) => { const line = new T.Line(new T.BufferGeometry().setFromPoints([new T.Vector3(), new T.Vector3(), new T.Vector3()]), new T.LineBasicMaterial({ color })); line.frustumCulled = false; rig.add(line); return line; });
    // (advanced) what heats and cools: a box with a meter and a knob, which is pulled sideways to turn it.
    // kind: what its knob is called when it is taken hold of. show(kelvin): the meter and the knob at that temperature
    function stove(parent, kind) {
      const group = new T.Group(); parent.add(group);
      add(group, box(1.5, 0.9, 0.9), M.dark, 0, 0.45, 0);
      const face = kit.canvasTexture(256, 112, () => {}), ink = face.image.getContext('2d');
      add(group, new T.PlaneGeometry(0.85, 0.4), new T.MeshBasicMaterial({ map: face, toneMapped: false }), -0.24, 0.5, 0.456, false, false);
      const knob = new T.Group(); knob.position.set(0.48, 0.5, 0.46); group.add(knob);
      add(knob, cyl(0.17, 0.17, 0.1, 24), M.steel, 0, 0, 0.04).rotation.x = Math.PI / 2; add(knob, box(0.045, 0.15, 0.03), mat(0x23262f), 0, 0.09, 0.1, false, false);
      const handle = add(group, box(0.8, 0.8, 0.5), M.dark, 0.48, 0.5, 0.6, false, false); handle.visible = false; handle.userData.grip = { kind };
      function show(kelvin) {
        ink.fillStyle = '#10141c'; ink.fillRect(0, 0, 256, 112);
        ink.fillStyle = '#ffc98a'; ink.font = '700 60px Georgia, serif'; ink.textAlign = 'center'; ink.textBaseline = 'middle'; ink.fillText(`${kelvin} K`, 128, 60);
        face.needsUpdate = true; knob.rotation.z = 2.3 - (kelvin - COLD) / (HOT - COLD) * 4.6;
      }
      return { group, handle, show };
    }
    // the one that heats the plate, on a wire to it
    const HEAT = new T.Vector3(-4.2, 0, -0.3), stove1 = stove(rig, 'heat'), heater = stove1.group, heatHandle = stove1.handle; heater.position.copy(HEAT);
    const heatWire = new T.Line(new T.BufferGeometry().setFromPoints([new T.Vector3(), new T.Vector3(), new T.Vector3()]), new T.LineBasicMaterial({ color: 0x2b2d36 })), corner = onPlate(-2.7, PLATE.long - 0.25, new T.Vector3()); heatWire.frustumCulled = false; heater.add(heatWire);
    const spots = { heap: onPlate(-3.1, PLATE.long - 0.3, new T.Vector3()), dish: new T.Vector3(DISH.x, DISH.y + 0.45, DISH.z), lamp: new T.Vector3(TEST.x, 1.75, TEST.z), list: new T.Vector3() };
    const labels = { heap: view.label(spots.heap), dish: view.label(spots.dish), lamp: view.label(spots.lamp), list: view.label(spots.list, true) };

    // ---------- physics ----------
    // The lamp's battery gives VOLT through the lamp (OHM) and the full plate (as wide and long as it is drawn, a
    // centimetre to a unit, and a millimetre thick).
    // (advanced) The plate is brought to a temperature: in silicon and diamond the heat lifts electrons over the gap
    // into the upper band (pairs(): drawn two more for each tenfold, from 10^10 in a m³), in a metal the atoms shake
    // more; resist() gives what comes of it. tried: for each material, what it resisted at the temperatures it has been at
    // (all of those on the way, when the temperature is changed). last: what was kept last; still: nothing is kept (while all is put back).
    const VOLT = 3, OHM = 10;
    const count = () => ctx.values.atoms, whole = () => count() === MOST, stuff = () => STUFF[ctx.values.stuff], temp = () => (ctx.advanced ? Math.min(ctx.values.temp, topOf(ctx.values.stuff)) : ROOM);
    const current = () => VOLT / (OHM + resist(ctx.values.stuff, temp()) * (PLATE.w / 100) / (PLATE.long / 100 * 0.001));   // (A)
    const pairs = () => (ctx.advanced && whole() && stuff().gap ? Math.max(0, Math.min(40, Math.round(2 * (Math.log10(lifted(ctx.values.stuff, temp())) - 10)))) : 0);
    const tried = {}, risen = new Map();   // (risen: when each pair on the board began to rise)
    let rising = false, last = null, still = false;
    const place = (value) => Math.log10(value) + 10;   // (where a resistivity stands on the graph)
    function mark() {
      const id = ctx.values.stuff, kelvin = temp(), on = ctx.advanced && whole() && !still;
      READ.stuff = id;
      if (on) {
        if (!tried[id]) tried[id] = new Map();
        const from = last && last.id === id ? last.kelvin : kelvin;
        for (const at of TEMPS) if (at >= Math.min(from, kelvin) && at <= Math.max(from, kelvin)) tried[id].set(at, resist(id, at));
      }
      last = on ? { id, kelvin } : null;
      for (const one of Object.keys(STUFF)) {
        const trace = ctx.traces[`r${one}`];
        trace.clear();
        TEMPS.forEach((at, k) => trace.add(at, tried[one] && tried[one].has(at) && !(STUFF[one].dashed && k % 4 === 3) ? place(tried[one].get(at)) : NaN));   // (a dashed line: every fourth place left empty)
        if (!STUFF[one].dashed) continue;
        const whole = ctx.traces[`r${one}All`];
        whole.clear();
        for (const at of TEMPS) whole.add(at, tried[one] && tried[one].has(at) ? place(tried[one].get(at)) : NaN);
      }
      ctx.traces.rnow.clear();
      for (const at of TEMPS) ctx.traces.rnow.add(at, on && at === kelvin ? place(resist(id, kelvin)) : NaN);
    }
    function paintGauge() { stove1.show(temp()); }
    const glow = () => (whole() ? Math.min(1, current() / (VOLT / OHM) / 0.6) ** 2 : 0);   // how bright the lamp is, of all it can be
    const state = { due: 0 };
    function gather(by) { const to = Math.max(1, Math.min(MOST, count() + by)); if (to !== count()) ctx.set('atoms', to); }
    // (the number of atoms locked: the clock does not stack them. It says so and stops, rather than run with nothing going on)
    function barred() {
      if (!ctx.locked.has('atoms')) return false;
      say('잠금', DISH.x, DISH.y + 0.7, DISH.z, 1.2); ctx.setPlaying(false);
      return true;
    }
    function note() {
      if (!whole() || still) return;   // (nothing is written while all is put back: the material is changed there before the plate is emptied)
      const table = ctx.tables.table, above = table.rows[table.rows.length - 1], one = stuff();
      const row = [one.name, one.gap ? one.gap.toFixed(2) : '없음', String(temp()), glow() > 0.05 ? '켜짐' : '꺼짐', one.kind];   // (the lamp as it is now, at the plate's temperature: that is a column of the advanced mode, and the room's in the basic one)
      if (!(above && above.every((cell, i) => cell === row[i]))) table.add(row);
    }
    function advance(t, dt) {   // (while the clock runs the atoms land one after another, until the plate is full)
      if (whole()) { ctx.setPlaying(false); return; }
      if (barred()) return;
      state.due += PACE[ctx.values.pace] * dt;
      const some = Math.floor(state.due);
      if (some) { state.due -= some; gather(some); }
    }
    function toStart() {
      shuffle(); still = true;
      for (const [key, value] of [['stuff', 'copper'], ['atoms', 1], ['pace', 'mid'], ['temp', ROOM]]) if (!ctx.locked.has(key) && ctx.values[key] !== value) ctx.set(key, value);
      still = false; state.due = 0; note(); paint(); mark(); moved = true;   // (a plate still full, its number of atoms locked, is written as it now is)
    }

    // the board: a line for each level (the electrons it holds as dots, while they are few enough to be seen); the names of the bands once the plate is full
    function paint() {
      const px = FACE.px, W = sheet.image.width, H = sheet.image.height, X = (x) => (x + FACE.w / 2) * px, Y = (e) => H - (0.35 + e * EV) * px, one = stuff(), n = count();
      rising = false; if (!whole()) risen.clear();
      ink.fillStyle = '#1b1e27'; ink.fillRect(0, 0, W, H);
      ink.strokeStyle = ink.fillStyle = '#8f98ad'; ink.lineWidth = 3;
      ink.beginPath(); ink.moveTo(X(-2.3), Y(-0.3)); ink.lineTo(X(-2.3), Y(10.4)); ink.stroke();
      ink.beginPath(); ink.moveTo(X(-2.3), Y(10.75)); ink.lineTo(X(-2.4), Y(10.35)); ink.lineTo(X(-2.2), Y(10.35)); ink.fill();
      ink.font = '26px Georgia, serif'; ink.textAlign = 'left'; ink.textBaseline = 'middle'; ink.fillText('에너지', X(-2.15), Y(10.6));
      // (the lines grow thinner as they grow more, smoothly, so that how much of the board they cover never jumps)
      const left = X(-1.9), right = X(0.9), thick = Math.max(1, Math.min(3.5, 3.5 * Math.sqrt(16 / n)));
      // (where the lines come closer than 3 pixels they would show stripes, like levels of their own, as their spacing
      // beats against the pixels: there each band is two sheets, the filled part and the empty, each as dense as its
      // lines would be. Both bands turn to sheets together, when the closer of their lines are under 3 pixels apart;
      // the filled sheets end where the electrons end, at one height for both bands, and keep within their band)
      const levels = levelsOf(ctx.values.stuff, n);
      const halves = one.at.map((mid, band) => 2 * one.reach[band] * Math.cos(Math.PI / (n + 1)));   // (half the width of each band, eV)
      const steps = halves.map((half) => (n > 1 ? (Y(0) - Y(2 * half)) / (n - 1) : Infinity)), sheets = Math.min(...steps) < 3;   // (between two lines, px)
      if (sheets) {
        const filled = levels.filter((level) => level.full), empty = levels.filter((level) => !level.full);
        const edge = Y(empty.length ? (filled[filled.length - 1].e + empty[0].e) / 2 : Infinity);   // (where the filled levels end)
        one.at.forEach((mid, band) => {
          const top = Y(mid + halves[band]), bottom = Y(mid - halves[band]);
          for (const full of [true, false]) {
            const from = Math.round(full ? Math.max(top, edge) : top), to = Math.round(full ? bottom : Math.min(bottom, edge));   // (on whole pixels: no seam where two sheets meet)
            if (to <= from) continue;
            ink.globalAlpha = Math.min(1, (full ? thick : thick * 0.8) / steps[band]); ink.fillStyle = full ? FULL : BARE;
            ink.fillRect(left, from, right - left, to - from);
          }
        });
        ink.globalAlpha = 1;
      }
      if (!sheets) for (const level of levels) {
        const y = Y(level.e);
        ink.strokeStyle = level.full ? FULL : BARE; ink.lineWidth = level.full ? thick : thick * 0.8; ink.beginPath(); ink.moveTo(left, y); ink.lineTo(right, y); ink.stroke();
        if (level.full && n <= 8) { ink.fillStyle = '#dcebff'; for (const dx of [-0.16, 0.16].slice(0, level.held)) { ink.beginPath(); ink.arc((left + right) / 2 + dx * px, y, 7, 0, Math.PI * 2); ink.fill(); } }
      }
      if (whole()) {
        const spans = one.at.map((mid, band) => [mid - 2 * one.reach[band], mid + 2 * one.reach[band]]);
        ink.strokeStyle = '#dfe6f5'; ink.lineWidth = 2;
        if (one.why === 'part') { ink.strokeRect(left, Y(spans[1][1]), right - left, Y(spans[0][0]) - Y(spans[1][1])); ink.beginPath(); ink.moveTo(left, Y(spans[0][1])); ink.lineTo(right, Y(spans[0][1])); ink.stroke(); }   // (bands that touch: one rim, and one line where they meet)
        else for (const [lo, hi] of spans) ink.strokeRect(left, Y(hi), right - left, Y(lo) - Y(hi));
        // (the names stand aside from the middle of their bands where something else is written there: the overlap, or how far the lower band is filled)
        const top = Math.max(...levels.filter((level) => level.full).map((level) => level.e));
        ink.fillStyle = '#f3eedf'; ink.fillText('전도띠', X(1.05), Y((spans[1][0] + spans[1][1]) / 2 + (one.why === 'over' ? 0.6 : 0))); ink.fillText('원자가 띠', X(1.05), Y((spans[0][0] + spans[0][1]) / 2 - (one.why ? 0.6 : 0)));
        ink.fillStyle = '#aab2c5'; ink.font = '22px Georgia, serif';
        if (one.why === 'part') ink.fillText('일부만 채워짐', X(1.05), Y(top + 0.3));
        else ink.fillText(one.why === 'over' ? '두 띠가 겹침' : ctx.values.numbers ? `띠 간격 ${one.gap.toFixed(2)} eV` : '띠 간격', X(1.05), Y((spans[0][1] + spans[1][0]) / 2));
        // (advanced) the electrons the heat has lifted: each a dot that rises from the lower band, leaving an empty ring there
        const some = pairs(), now = performance.now();
        for (const k of [...risen.keys()]) if (k >= some) risen.delete(k);
        for (let k = 0; k < some; k++) {
          if (!risen.has(k)) risen.set(k, now);
          const far = Math.min(1, (now - risen.get(k)) / 600), ease = far * far * (3 - 2 * far), x = left + (0.04 + 0.92 * ((k * 0.618034) % 1)) * (right - left);
          const from = spans[0][1] - 0.08 - ((k * 0.377) % 1) * 0.45, to = spans[1][0] + 0.08 + ((k * 0.533) % 1) * 0.45;
          if (far < 1) rising = true;
          ink.strokeStyle = '#eef4ff'; ink.lineWidth = 2; ink.fillStyle = '#1b1e27'; ink.beginPath(); ink.arc(x, Y(from), 6, 0, Math.PI * 2); ink.fill(); ink.stroke();
          ink.fillStyle = '#eef4ff'; ink.beginPath(); ink.arc(x, Y(from + (to - from) * ease), 6, 0, Math.PI * 2); ink.fill();
        }
        if (rising) moved = true;
      }
      sheet.needsUpdate = true;
    }

    // ---------- handling ----------
    // The spare atom is carried from the dish to the plate, in the plane that faces the eye (pressed, it goes there of itself).
    const ray = new T.Raycaster(), plane = new T.Plane(), middle = onPlate(0, PLATE.long / 2, new T.Vector3());
    const bandTool = {
      handles: () => [...(whole() ? [] : [addHandle]), ...(ctx.advanced ? [heatHandle] : [])],
      start(grip, r) {
        if (grip.kind === 'heat') {
          if (ctx.locked.has('temp')) { say('잠금', heater.position.x, 1.6, HEAT.z, 1.2); return false; }
          plane.setFromNormalAndCoplanarPoint(way.copy(r.direction).negate(), hit.set(heater.position.x + 0.48, 0.5, HEAT.z + 0.5));
          if (!r.intersectPlane(plane, hit)) return false;
          grab = { ...grip, start: hit.clone(), from: temp() };
          return true;
        }
        plane.setFromNormalAndCoplanarPoint(way.copy(r.direction).negate(), DISH);
        if (!r.intersectPlane(plane, hit)) return false;
        if (ctx.locked.has('atoms')) { say('잠금', DISH.x, DISH.y + 0.7, DISH.z, 1.2); return false; }
        grab = { ...grip, off: DISH.clone().sub(hit), start: hit.clone(), at: DISH.clone(), moved: false, near: false };
        return true;
      },
      move(r) {
        if (!r.intersectPlane(plane, hit)) return;
        if (grab.kind === 'heat') {   // (250 K for each unit of the bench it is pulled)
          const want = Math.round((grab.from + (hit.x - grab.start.x + hit.y - grab.start.y) * 250) / 20) * 20, one = stuff(), to = Math.max(COLD, Math.min(topOf(ctx.values.stuff), want));
          if (one.melt && want > to) { say(`${one.name}은 ${one.melt} K에서 녹음`, heater.position.x, 0.85, HEAT.z); grab.melting = true; }   // (said while it is pulled past the highest)
          else if (grab.melting) { tip.show(false); grab.melting = false; moved = true; }
          if (to !== ctx.values.temp) ctx.set('temp', to);
          return;
        }
        if (!grab.moved && hit.distanceTo(grab.start) < 0.12) return;   // (a press is not a pull)
        grab.moved = true; grab.at.copy(hit).add(grab.off); grab.at.y = Math.max(0.3, grab.at.y);
        grab.near = r.distanceToPoint(middle) < 2.4;
      },
      end(done) { if (done.kind === 'add' && (!done.moved || done.near)) gather(1); },
    };

    function draw() {
      const v = ctx.values, one = stuff(), n = count(), all = whole(), lit = glow(), adding = grab && grab.kind === 'add' && grab.moved, hot = Math.max(0, Math.min(1, (temp() - 400) / (HOT - 400)));
      if (rising) paint();
      atomInk.color.setHex(one.tint); heap.count = n;
      heater.visible = ctx.advanced; heater.position.x = tall() ? HEAT.x : HEAT.x - 0.7; plateInk.emissive.setRGB(0.45 * hot, 0.07 * hot, 0);
      reshape(heatWire, [way.set(0.75, 0.2, 0).clone(), way.set(1.2, 0.06, 0.8).clone(), way.copy(corner).sub(heater.position).clone()]);
      spare.visible = !all && !adding; carried.visible = Boolean(adding);
      if (adding) carried.position.copy(grab.at);
      // the tester: its rods on the sides of the full plate, or lying by it
      lamp.material.color.setRGB(0.33 + 0.67 * lit, 0.32 + 0.6 * lit, 0.29 + 0.3 * lit, T.SRGBColorSpace);
      rods.forEach((rod, k) => {
        const foot = all ? ENDS[k] : way.set(TEST.x - 1.6 + 0.5 * k, 0.1, TEST.z + 0.9 + 0.25 * k), lean = all ? (k ? 0.5 : -0.5) : Math.PI / 2 - 0.1;
        rod.position.set(foot.x + 0.55 * Math.sin(lean), foot.y + 0.55 * Math.cos(lean), foot.z); rod.rotation.set(0, 0, -lean);
        const head = hit.set(foot.x + 1.1 * Math.sin(lean), foot.y + 1.1 * Math.cos(lean), foot.z), line = wires[k].geometry.attributes.position;
        line.setXYZ(0, head.x, head.y, head.z); line.setXYZ(1, (head.x + TEST.x) / 2, Math.max(head.y, 0.9) + 0.9, (head.z + TEST.z) / 2); line.setXYZ(2, TEST.x - 0.4 + 0.8 * k, 0.8, TEST.z); line.needsUpdate = true;
      });
      onPlate(tall() && ctx.advanced ? -2.3 : -3.1, PLATE.long - 0.3, spots.heap);   // (longer with the temperature: on a tall screen nearer the middle)
      labels.heap.write(`<b>${one.name}</b> 원자 <b>${n}개</b>${all ? ' (고체)' : ''}${ctx.advanced ? ` · <b>${temp()} K</b>` : ''}`); labels.heap.show(true);
      labels.dish.write('원자'); labels.dish.show(!all && !adding);
      labels.lamp.write(all ? (lit > 0.05 ? '<b>불빛 켜짐</b>' : '불빛 꺼짐') : tall() ? '측정기' : '전기 전도성 측정기'); labels.lamp.show(true);   // (short, where the screen is narrow)
      labels.list.show(v.numbers);
      if (v.numbers) {
        const lines = [`<b>${one.name}</b> (${one.kind}) 원자 ${n}개`, n === 1 ? '준위 하나에 전자 2개까지' : `준위 하나가 <b>${n}개</b>로 갈라짐`, `전자 ${one.outer * n}개가 아래 준위부터 채움`];
        if (all && ctx.advanced) lines.push(`온도(T) <b>${temp()} K</b>`, !one.gap ? '온도가 오르면 원자의 진동이 커져 전자의 이동을 방해함' : `전도띠로 올라간 전자 <b>${lifted(v.stuff, temp()) >= 1e6 ? `1 cm³에 ${power(lifted(v.stuff, temp()) / 1e6)}개` : '거의 없음'}</b>`);
        if (all) lines.push(one.gap ? `띠 간격 <b>${one.gap.toFixed(2)} eV</b>` : one.why === 'part' ? '띠 간격 없음 (원자가 띠의 일부만 채워짐)' : '띠 간격 없음 (두 띠가 겹침)', `비저항 <b>${power(resist(v.stuff, temp()))} Ω·m</b>`, `측정기의 전류 <b>${current() >= 0.005 ? `${current().toFixed(2)} A` : `${power(current())} A`}</b>`);   // (below 0.005 A two decimals would write 0.00)
        labels.list.write(lines.join('<br>'));
        if (tall()) spots.list.set(FACE.x, FACE.hi + 0.25, FACE.z); else spots.list.set(FACE.x + (ctx.advanced ? 5.4 : 4.7), 3.6, FACE.z);
      }
    }

    const bandScene = {
      rig, ids: ['stuff', 'atoms', 'temp'],
      look: [{ target: [0.2, 2.9, 0], r: 16.5, theta: 0, phi: 1.3 }, { target: [0, 3.4, 0], r: 28, theta: 0, phi: 1.3 }],
      handles: bandTool.handles, start: bandTool.start, move: bandTool.move, end: bandTool.end,
      enter() { rig.visible = true; paint(); paintGauge(); mark(); },
      leave() { rig.visible = false; for (const label of Object.values(labels)) label.show(false); },
      changed(id) {
        if (id === 'stuff' && ctx.values.temp > topOf(ctx.values.stuff)) ctx.set('temp', topOf(ctx.values.stuff));   // (to a material that would melt there: brought down to its highest, even when the temperature is locked)
        if (id === 'temp') paintGauge(); else note();
        paint(); mark();
      },
      play(on) { if (on && !barred()) { state.due = 0; if (whole()) { shuffle(); ctx.set('atoms', 1); } } },   // (played again when the plate is full: from one atom anew)
      tick: advance, toStart, draw, numbers: paint, mode() { paint(); paintGauge(); mark(); },
    };

    // ====================================== doping ======================================
    // ---------- the crystal, the impurities, the battery and the switch ----------
    // The crystal is a board: 5 × 4 atoms a unit apart (the atom of the row r and column c at x = c − 2,
    // y = MID + 1.5 − r of the board), a line for each bond and two electrons on it; the bonds at the rim go on to
    // atoms that are not drawn. places: every place of an electron on a bond (x, y, and the atom it is nearer to);
    // beside: for each place, the places an electron can step from into it (the other of its bond, and those of
    // the other bonds of its atom).
    const LAT = { w: 5.8, lo: 1.0, hi: 5.8, px: 128, z: -1.7 }, MID = (LAT.lo + LAT.hi) / 2;
    const SITES = [[1, 2], [2, 0], [0, 3], [3, 3]], seat = (k) => ({ x: SITES[k][1] - 2, y: MID + 1.5 - SITES[k][0] });   // the atoms (row, column) an impurity takes the place of: the first, and in the advanced mode three more; where each is on the board
    const rig2 = new T.Group(); world.add(rig2);
    const lattice = new T.Group(); rig2.add(lattice);
    add(lattice, box(LAT.w + 0.2, LAT.hi - LAT.lo + 0.2, 0.12), M.slate, 0, MID, -0.07);
    for (const x of [-2.3, 2.3]) { add(lattice, box(0.14, LAT.lo, 0.14), M.steel, x, LAT.lo / 2, -0.07); add(lattice, box(0.5, 0.1, 1.2), M.dark, x, 0.05, -0.07); }
    const slab = kit.canvasTexture(Math.round(LAT.w * LAT.px), Math.round((LAT.hi - LAT.lo) * LAT.px), () => {}), quill = slab.image.getContext('2d');
    add(lattice, new T.PlaneGeometry(LAT.w, LAT.hi - LAT.lo), new T.MeshBasicMaterial({ map: slab, toneMapped: false }), 0, MID, 0, false, false);
    for (const [x, tint] of [[-2.95, 0x2b2d36], [2.95, 0xb8433a]]) add(lattice, box(0.1, LAT.hi - LAT.lo, 0.16), mat(tint), x, MID, 0.03);   // the two sides the battery is joined to: (−) at the left, (+) at the right
    const places = [];
    for (let row = 0; row < 4; row++) for (let k = 0; k < 6; k++) for (const j of [0, 1]) places.push({ x: k - 3 + (j ? 0.64 : 0.36), y: MID + 1.5 - row, atom: `${row}/${k - 1 + j}`, bond: `h${row}/${k}` });
    for (let col = 0; col < 5; col++) for (let k = 0; k < 5; k++) for (const j of [0, 1]) places.push({ x: col - 2, y: MID + 2.5 - k - (j ? 0.64 : 0.36), atom: `${k - 1 + j}/${col}`, bond: `v${col}/${k}` });
    const drawn = (atom) => { const [row, col] = atom.split('/').map(Number); return row >= 0 && row < 4 && col >= 0 && col < 5; };
    const beside = places.map((one, k) => places.map((other, n) => n).filter((n) => n !== k && (places[n].bond === one.bond || (places[n].atom === one.atom && drawn(one.atom)))));
    const firstOf = (k) => places.findIndex((one) => one.atom === SITES[k].join('/') && one.bond.startsWith('h') && one.x > SITES[k][1] - 2);   // (where a hole is at first: on the bond to the right of its boron)
    // an electron that is free, one that is stepping into a hole, and a hole (a faint ball with a dotted rim); then as many of each as there can be
    const mote = add(lattice, new T.SphereGeometry(0.11, 16, 12), kit.glow(0x4f8fe0), 0, 0, 0.16, false, false), hopper = add(lattice, new T.SphereGeometry(0.085, 14, 10), kit.glow(0x4f8fe0), 0, 0, 0.14, false, false);
    const hole = new T.Group(); lattice.add(hole);
    add(hole, new T.SphereGeometry(0.13, 16, 12), new T.MeshBasicMaterial({ color: 0xb9a7ff, transparent: true, opacity: 0.2, depthWrite: false }), 0, 0, 0, false, false);
    add(hole, new T.PlaneGeometry(0.36, 0.36), new T.MeshBasicMaterial({ map: kit.canvasTexture(128, 128, (g) => { g.strokeStyle = '#d6caff'; g.lineWidth = 10; g.setLineDash([17, 13]); g.beginPath(); g.arc(64, 64, 52, 0, Math.PI * 2); g.stroke(); }), transparent: true, depthWrite: false, toneMapped: false }), 0, 0, 0.02, false, false).renderOrder = 5;
    const motes = [mote], hoppers = [hopper], holes = [hole];
    for (let k = 1; k < 8; k++) {
      motes.push(add(lattice, mote.geometry, mote.material, 0, 0, 0.16, false, false)); hoppers.push(add(lattice, hopper.geometry, hopper.material, 0, 0, 0.14, false, false));
      const copy = new T.Group(); lattice.add(copy); holes.push(copy);
      for (const part of hole.children) { const one = add(copy, part.geometry, part.material, part.position.x, part.position.y, part.position.z, false, false); one.renderOrder = part.renderOrder; }
    }
    const ring = add(lattice, new T.TorusGeometry(0.42, 0.03, 8, 40), kit.glow(0xe3c26b), 0, 0, 0.1, false, false);   // (the place an impurity goes to, while one is carried)
    const siteGrips = SITES.map((site, k) => { const grip = add(lattice, box(0.7, 0.7, 0.3), M.dark, seat(k).x, seat(k).y, 0.1, false, false); grip.visible = false; grip.userData.grip = { kind: 'site', k }; return grip; });   // (advanced: an impurity in the crystal is pressed to take it out)
    // (advanced) the heater of the crystal, under the board, on a wire to its stand
    const STOVE2 = { x: 0, z: -1.15 }, stove2 = stove(rig2, 'warm');
    const stoveWire = new T.Line(new T.BufferGeometry().setFromPoints([new T.Vector3(), new T.Vector3(), new T.Vector3()]), new T.LineBasicMaterial({ color: 0x2b2d36 })); stoveWire.frustumCulled = false; rig2.add(stoveWire);
    // the impurities, in a tray on the bench: each a ball with its sign
    const TRAY = new T.Vector3(-4.3, 0.42, 1.45), NARROW = 0.95;   // (on a tall screen the tray stands NARROW nearer the middle, so that it is in sight)
    const dish2 = add(rig2, box(2.3, 0.1, 1.1), mat(0xd9dde6, { roughness: 0.6 }), TRAY.x + 0.5, 0.05, TRAY.z);
    const things = Object.fromEntries(['p', 'b'].map((id, k) => {
      const group = new T.Group(), rest = new T.Vector3(TRAY.x + k * 1.0, TRAY.y, TRAY.z); group.position.copy(rest); rig2.add(group);
      add(group, new T.SphereGeometry(0.32, 24, 16), mat(DOPANTS[id].tint, { roughness: 0.5 }), 0, 0, 0);
      add(group, new T.PlaneGeometry(0.42, 0.42), new T.MeshBasicMaterial({ map: kit.letterTexture(DOPANTS[id].mark), transparent: true, depthWrite: false }), 0, 0, 0.33, false, false);
      const grip = add(group, box(0.9, 0.9, 0.9), M.dark, 0, 0, 0, false, false); grip.visible = false; grip.userData.grip = { kind: 'dopant', id };
      const spot = new T.Vector3(rest.x, rest.y + 0.5, rest.z);
      return [id, { id, group, rest, grip, spot, k, label: view.label(spot) }];
    }));
    // the battery and the switch, on wires to the two sides of the crystal: the switch is pressed to close it and to open it
    const CELL2 = new T.Vector3(-0.2, 0.3, 2.3), KEY = new T.Vector3(2.3, 0.1, 2.3);
    add(rig2, box(1.7, 0.6, 0.8), M.dark, CELL2.x, CELL2.y, CELL2.z); add(rig2, box(0.12, 0.3, 0.3), mat(0xb8433a), CELL2.x + 0.9, CELL2.y, CELL2.z); add(rig2, box(0.08, 0.2, 0.3), M.steel, CELL2.x - 0.88, CELL2.y, CELL2.z);
    add(rig2, box(1.3, 0.12, 0.6), mat(0xd9dde6, { roughness: 0.6 }), KEY.x, 0.06, KEY.z); for (const x of [-0.45, 0.45]) add(rig2, cyl(0.07, 0.07, 0.16, 12), M.steel, KEY.x + x, 0.2, KEY.z);
    const lever = new T.Group(); lever.position.set(KEY.x - 0.45, 0.28, KEY.z); rig2.add(lever); add(lever, box(1.0, 0.06, 0.14), M.steel, 0.45, 0, 0);
    const keyHandle = add(rig2, box(1.6, 1.0, 1.0), M.dark, KEY.x, 0.4, KEY.z, false, false); keyHandle.visible = false; keyHandle.userData.grip = { kind: 'key' };
    const leads = [0x2b2d36, 0xb8433a, 0xb8433a].map((color) => { const line = new T.Line(new T.BufferGeometry().setFromPoints([new T.Vector3(), new T.Vector3(), new T.Vector3()]), new T.LineBasicMaterial({ color })); line.frustumCulled = false; rig2.add(line); return line; });
    const spots2 = { kind: new T.Vector3(), minus: new T.Vector3(), plus: new T.Vector3(), cell: new T.Vector3(CELL2.x, CELL2.y + 0.45, CELL2.z), key: new T.Vector3(KEY.x, 0.75, KEY.z), list: new T.Vector3() };
    const labels2 = { kind: view.label(spots2.kind), minus: view.label(spots2.minus), plus: view.label(spots2.plus), cell: view.label(spots2.cell), key: view.label(spots2.key), list: view.label(spots2.list, true) };

    // ---------- what goes on ----------
    // frees: the electrons that are free (where each is on the board, which way it goes, how long until it turns
    // again, and for how long yet it cannot fall into a hole: fresh). gaps: the holes (at: the place; step: the
    // electron on its way into where the hole was — from where, to where, how far: 0 to 1; wait: how long until
    // the next electron steps). filled: which of SITES hold an impurity. With the switch closed the electrons'
    // going has DRIFT added towards the (+) side, and the electrons that step into a hole come more often from
    // the (−) side.
    // (advanced) The heat breaks bonds: an electron leaves its place and goes free, and a hole is left. pairs2()
    // such pairs are kept up (one more for each hundredfold of what silicon has, from 10^16 in a m³); an electron
    // that meets a hole falls into it, and where there are more pairs than that the electrons make for the holes.
    // So electrons − holes stays what the impurities give. All of it goes faster as it is hotter (as √T).
    const SWIFT = 1.5, DRIFT = 0.6, TURN = 0.35, HOP = 0.45, EDGE = 2.75, MEET2 = 0.28;
    const state2 = { frees: [], gaps: [], filled: SITES.map((one, k) => !k), brew: 0, dirty: true, still: false };
    const dopant = () => DOPANTS[ctx.values.dopant], closed = () => ctx.values.closed === true;
    const warm = () => (ctx.advanced ? ctx.values.warm : ROOM), many = () => (ctx.advanced ? ctx.values.many : 1);
    const pairs2 = () => Math.max(0, Math.min(4, Math.round((Math.log10(lifted('silicon', warm())) - 16) / 2)));
    const vacant = () => { const all = new Set(); for (const gap of state2.gaps) { all.add(gap.at); if (gap.step) all.add(gap.step.to); } return all; };
    // an impurity into the place k, with what it brings; and out of it, with one of what it brought (the nearest)
    function put(k) {
      const id = ctx.values.dopant, at = seat(k);
      state2.filled[k] = true; state2.dirty = true;
      if (id === 'p') state2.frees.push({ x: at.x + 0.42, y: at.y + 0.42, way: Math.random() * 2 * Math.PI, turn: TURN, fresh: 0 });
      if (id !== 'b') return;
      const empty = vacant(), own = firstOf(k), other = places.findIndex((one, n) => !empty.has(n) && one.atom === places[own].atom);
      state2.gaps.push({ at: empty.has(own) && other >= 0 ? other : own, step: null, wait: HOP * (0.5 + Math.random()) });
    }
    function take(k) {
      const id = ctx.values.dopant, at = seat(k), list = id === 'p' ? state2.frees : id === 'b' ? state2.gaps : [];
      state2.filled[k] = false; state2.dirty = true;
      if (!list.length) return;
      const far = (one) => (id === 'p' ? Math.hypot(one.x - at.x, one.y - at.y) : Math.hypot(places[one.at].x - at.x, places[one.at].y - at.y) + (one.step ? 100 : 0));
      list.splice(list.reduce((best, one, n) => (far(one) < far(list[best]) ? n : best), 0), 1);
    }
    const lined = () => { state2.filled = SITES.map((one, k) => k < many()); };   // (the first of the places, as many as there are impurities)
    function match() {   // (as many as the menu says: into the first place that is empty, out of the last that is filled)
      for (let n = state2.filled.filter(Boolean).length; n < many(); n++) put(state2.filled.indexOf(false));
      for (let n = state2.filled.filter(Boolean).length; n > many(); n--) take(state2.filled.lastIndexOf(true));
    }
    function settle() {
      state2.frees = []; state2.gaps = []; state2.brew = 0.4; state2.dirty = true;
      if (ctx.values.dopant !== 'none') state2.filled.forEach((on, k) => { if (on) put(k); });
    }
    function note2() {
      const table = ctx.tables.table2, above = table.rows[table.rows.length - 1], one = dopant(), row = [one.name, String(one.own), one.makes, one.kind];
      if (!(above && above.every((cell, i) => cell === row[i]))) table.add(row);
    }
    function advance2(t, dt) {
      const on = closed(), quick = Math.sqrt(warm() / ROOM), most = pairs2(), spare = Math.min(state2.frees.length, state2.gaps.length) > most;
      // each goes straight a little while, then some other way; it comes back from the rim (with the switch closed it leaves at the (+) side, and another comes in at the (−) side)
      for (const free of state2.frees) {
        free.fresh -= dt; free.turn -= dt * quick;
        if (free.turn <= 0) {
          free.turn = TURN * (0.5 + Math.random()); free.way = Math.random() * 2 * Math.PI;
          if (spare) { const to = state2.gaps.map((gap) => places[gap.at]).sort((a, b) => Math.hypot(a.x - free.x, a.y - free.y) - Math.hypot(b.x - free.x, b.y - free.y))[0]; free.way = Math.atan2(to.y - free.y, to.x - free.x); }
        }
        free.x += (SWIFT * quick * Math.cos(free.way) + (on ? DRIFT : 0)) * dt; free.y += SWIFT * quick * Math.sin(free.way) * dt;
        if (free.y > LAT.hi - 0.25 || free.y < LAT.lo + 0.25) { free.y = Math.max(LAT.lo + 0.25, Math.min(LAT.hi - 0.25, free.y)); free.way = -free.way; }
        if (free.x > EDGE) { if (on) free.x = -EDGE; else { free.x = EDGE; free.way = Math.PI - free.way; } }
        if (free.x < -EDGE) { free.x = -EDGE; free.way = Math.PI - free.way; }
      }
      // into each hole an electron steps from beside it: any of those there, as likely as the others; with the voltage on, rather one from the (−) side
      const empty = vacant();
      for (const gap of state2.gaps) {
        if (gap.step) { gap.step.far += dt / 0.28 * quick; if (gap.step.far >= 1) { gap.step = null; state2.dirty = true; } continue; }
        gap.wait -= dt * quick;
        if (gap.wait > 0) continue;
        gap.wait = HOP * (0.7 + 0.6 * Math.random());
        const here = places[gap.at];
        let from = -1, to = -1;
        if (on && here.x < -2.5) {   // (at the (−) side an electron comes in from the wire; at the (+) side one has left, and the hole is there)
          const rim = places.map((one, k) => k).filter((k) => places[k].x > 2.5 && !empty.has(k));
          if (!rim.length) continue;
          to = rim[Math.floor(Math.random() * rim.length)];
        } else {
          const near = beside[gap.at].filter((k) => !empty.has(k)), odds = near.map((k) => (on ? Math.exp(-2.2 * (places[k].x - here.x)) : 1));
          if (!near.length) continue;
          let pick = Math.random() * odds.reduce((sum, one) => sum + one, 0);
          from = near[near.length - 1];
          for (let k = 0; k < near.length; k++) { pick -= odds[k]; if (pick <= 0) { from = near[k]; break; } }
          to = from;
        }
        gap.step = { from, to: gap.at, far: 0 }; gap.at = to; empty.add(to); state2.dirty = true;
      }
      // an electron that comes upon a hole falls into it
      for (let i = state2.frees.length - 1; i >= 0; i--) {
        const free = state2.frees[i], j = free.fresh > 0 ? -1 : state2.gaps.findIndex((gap) => !gap.step && Math.hypot(places[gap.at].x - free.x, places[gap.at].y - free.y) < MEET2);
        if (j < 0) continue;
        state2.frees.splice(i, 1); state2.gaps.splice(j, 1); state2.brew = 0.3 + Math.random() * 0.5; state2.dirty = true;
      }
      // the heat breaks a bond, while there are fewer pairs than it keeps up
      state2.brew -= dt;
      if (state2.brew > 0 || Math.min(state2.frees.length, state2.gaps.length) >= most) return;
      const whole = places.map((one, k) => k).filter((k) => !empty.has(k) && Math.abs(places[k].x) < 2.4), k = whole[Math.floor(Math.random() * whole.length)];
      state2.gaps.push({ at: k, step: null, wait: HOP * (0.5 + Math.random()) });
      state2.frees.push({ x: places[k].x, y: places[k].y, way: Math.random() * 2 * Math.PI, turn: TURN, fresh: 0.8 });
      state2.brew = 0.3; state2.dirty = true;
    }
    function toStart2() {
      state2.still = true;
      for (const [key, value] of [['dopant', 'none'], ['closed', false], ['many', 1], ['warm', ROOM]]) if (!ctx.locked.has(key) && ctx.values[key] !== value) ctx.set(key, value);
      state2.still = false; lined(); settle(); stove2.show(warm()); moved = true;
    }

    // the crystal: the bonds, the electrons on them (none where a hole is, nor where one is still on its way), and the atoms
    function paintCrystal() {
      const px = LAT.px, X = (x) => (x + LAT.w / 2) * px, Y = (y) => (LAT.hi - y) * px, id = ctx.values.dopant, empty = vacant();
      quill.fillStyle = '#1b1e27'; quill.fillRect(0, 0, slab.image.width, slab.image.height);
      quill.strokeStyle = '#59627a'; quill.lineWidth = 3; quill.beginPath();
      for (let row = 0; row < 4; row++) { quill.moveTo(X(-2.85), Y(MID + 1.5 - row)); quill.lineTo(X(2.85), Y(MID + 1.5 - row)); }
      for (let col = 0; col < 5; col++) { quill.moveTo(X(col - 2), Y(LAT.lo + 0.08)); quill.lineTo(X(col - 2), Y(LAT.hi - 0.08)); }
      quill.stroke();
      quill.fillStyle = '#7fb2e6';
      places.forEach((one, k) => { if (empty.has(k)) return; quill.beginPath(); quill.arc(X(one.x), Y(one.y), 9, 0, Math.PI * 2); quill.fill(); });
      quill.textAlign = 'center'; quill.textBaseline = 'middle'; quill.font = '700 34px Georgia, serif';
      for (let row = 0; row < 4; row++) for (let col = 0; col < 5; col++) {
        const mine = id !== 'none' && SITES.some((site, k) => state2.filled[k] && site[0] === row && site[1] === col);
        quill.fillStyle = mine ? `#${DOPANTS[id].tint.toString(16)}` : '#8d9bb5'; quill.beginPath(); quill.arc(X(col - 2), Y(MID + 1.5 - row), 0.3 * px, 0, Math.PI * 2); quill.fill();
        quill.fillStyle = '#14161d'; quill.fillText(mine ? DOPANTS[id].mark : 'Si', X(col - 2), Y(MID + 1.5 - row) + 2);
      }
      slab.needsUpdate = true;
    }

    // ---------- handling ----------
    // An impurity is carried from the tray in the plane that faces the eye; near its place in the crystal it goes
    // into it (pressed, it goes there of itself). Let go anywhere else, it goes back to the tray. The switch is pressed.
    // (advanced) One more of the same goes into the next place, up to four; one in the crystal, pressed, comes out.
    // The knob of the heater is pulled sideways.
    const home2 = new T.Vector3();
    const dopeTool = {
      handles: () => [things.p.grip, things.b.grip, keyHandle, ...(ctx.advanced ? [stove2.handle, ...siteGrips.filter((grip, k) => ctx.values.dopant !== 'none' && state2.filled[k])] : [])],
      start(grip, r) {
        if (grip.kind === 'key') { grab = { ...grip }; return true; }
        if (grip.kind === 'site') { if (ctx.locked.has('many') || ctx.locked.has('dopant')) { say('잠금', lattice.position.x + seat(grip.k).x, seat(grip.k).y + 0.6, LAT.z, 1.2); return false; } grab = { ...grip }; return true; }
        if (grip.kind === 'warm') {
          const at = stove2.group.position;
          if (ctx.locked.has('warm')) { say('잠금', at.x, 1.6, at.z, 1.2); return false; }
          plane.setFromNormalAndCoplanarPoint(way.copy(r.direction).negate(), hit.set(at.x + 0.48, 0.5, at.z + 0.5));
          if (!r.intersectPlane(plane, hit)) return false;
          grab = { ...grip, start: hit.clone(), from: warm() };
          return true;
        }
        const one = things[grip.id];
        plane.setFromNormalAndCoplanarPoint(way.copy(r.direction).negate(), one.rest);
        if (!r.intersectPlane(plane, hit)) return false;
        if (ctx.locked.has('dopant')) { say('잠금', one.rest.x, one.rest.y + 0.7, one.rest.z, 1.2); return false; }
        grab = { ...grip, off: one.rest.clone().sub(hit), start: hit.clone(), at: one.rest.clone(), moved: false, near: false };
        return true;
      },
      move(r) {
        if (grab.kind === 'key' || grab.kind === 'site' || !r.intersectPlane(plane, hit)) return;
        if (grab.kind === 'warm') {   // (250 K for each unit of the bench it is pulled)
          const to = Math.max(COLD, Math.min(HOT, Math.round((grab.from + (hit.x - grab.start.x + hit.y - grab.start.y) * 250) / 20) * 20));
          if (to !== ctx.values.warm) ctx.set('warm', to);
          return;
        }
        if (!grab.moved && hit.distanceTo(grab.start) < 0.12) return;   // (a press is not a pull)
        grab.moved = true; grab.at.copy(hit).add(grab.off); grab.at.y = Math.max(0.35, grab.at.y);
        grab.near = r.distanceToPoint(home2) < 0.8;
      },
      end(done) {
        if (done.kind === 'key') { ctx.set('closed', !closed()); return; }
        if (done.kind === 'warm') return;
        if (done.kind === 'site') {
          const left = state2.filled.filter(Boolean).length - 1;
          take(done.k);
          if (left) ctx.set('many', left); else ctx.set('dopant', 'none');
          return;
        }
        if (!(!done.moved || done.near)) return;
        if (ctx.values.dopant !== done.id) { if (ctx.advanced && ctx.values.many !== 1 && !ctx.locked.has('many')) ctx.set('many', 1); ctx.set('dopant', done.id); }
        else if (ctx.advanced && many() < SITES.length && !ctx.locked.has('many')) ctx.set('many', many() + 1);
        else if (!running) ctx.setPlaying(true);   // (the one that is in already, pressed again: it goes on as well)
      },
    };

    function draw2() {
      const v = ctx.values, id = v.dopant, one = dopant(), up = tall(), on = closed(), adv = ctx.advanced, carried2 = grab && grab.kind === 'dopant' && grab.moved ? grab : null;
      if (state2.dirty) { state2.dirty = false; paintCrystal(); }
      lattice.position.set(up ? 0 : -0.3, 0, LAT.z);
      const next = seat(grab && grab.kind === 'dopant' && adv && grab.id === id && state2.filled.includes(false) ? state2.filled.indexOf(false) : 0);   // (where the one that is carried goes)
      home2.set(next.x, next.y, 0.1).add(lattice.position); ring.position.set(next.x, next.y, 0.1);
      ring.visible = Boolean(grab && grab.kind === 'dopant');
      dish2.position.x = TRAY.x + 0.5 + (up ? NARROW : 0);
      for (const thing of Object.values(things)) {
        const mine = carried2 && carried2.id === thing.id;
        thing.rest.x = thing.spot.x = TRAY.x + thing.k * 1.0 + (up ? NARROW : 0);
        if (mine && carried2.near) thing.group.position.copy(home2).setZ(home2.z + 0.3); else if (mine) thing.group.position.copy(carried2.at); else thing.group.position.copy(thing.rest);
        thing.label.write(DOPANTS[thing.id].name); thing.label.show(!mine);
      }
      // the electrons that are free, and the holes with the electrons that step into them
      motes.forEach((ball, k) => { const free = state2.frees[k]; ball.visible = Boolean(free); if (free) ball.position.set(free.x, free.y, 0.16); });
      holes.forEach((ball, k) => {
        const gap = state2.gaps[k];
        ball.visible = Boolean(gap); hoppers[k].visible = Boolean(gap && gap.step);
        if (!gap) return;
        ball.position.set(places[gap.at].x, places[gap.at].y, 0.12);
        if (gap.step) { const to = places[gap.step.to], from = gap.step.from < 0 ? { x: -2.9, y: to.y } : places[gap.step.from], far = gap.step.far; hoppers[k].position.set(from.x + (to.x - from.x) * far, from.y + (to.y - from.y) * far, 0.14); }
      });
      // the heater, the switch, the wires, and the writing
      stove2.group.visible = adv; stove2.group.position.set(lattice.position.x + STOVE2.x, 0, STOVE2.z);
      stoveWire.visible = adv; reshape(stoveWire, [way.set(stove2.group.position.x + 0.75, 0.2, STOVE2.z).clone(), way.set(lattice.position.x + 1.6, 0.06, STOVE2.z - 0.3).clone(), way.set(lattice.position.x + 2.3, 0.12, LAT.z).clone()]);
      lever.rotation.z = on ? 0 : 0.6;
      [[-2.95, CELL2.x - 0.9, CELL2.y], [2.95, KEY.x + 0.45, 0.2]].forEach(([x, toX, toY], k) => { const line = leads[k].geometry.attributes.position, foot = way.set(lattice.position.x + x, LAT.lo, LAT.z + 0.1); line.setXYZ(0, foot.x, foot.y, foot.z); line.setXYZ(1, foot.x, 0.15, CELL2.z); line.setXYZ(2, toX, toY, CELL2.z); line.needsUpdate = true; });
      { const line = leads[2].geometry.attributes.position; line.setXYZ(0, KEY.x - 0.45, 0.2, KEY.z); line.setXYZ(1, (KEY.x + CELL2.x) / 2 + 0.2, 0.12, KEY.z); line.setXYZ(2, CELL2.x + 0.95, CELL2.y, CELL2.z); line.needsUpdate = true; }
      const n = state2.filled.filter(Boolean).length, heat = adv ? ` · ${warm()} K` : '', some = state2.frees.length + state2.gaps.length > 0;
      spots2.kind.set(lattice.position.x - (up && adv ? 0.9 : 1.6), LAT.hi + 0.2, LAT.z); labels2.kind.write(id === 'none' ? `규소 결정 · <b>고유 반도체</b>${heat}` : `규소 + ${one.name}${adv && n > 1 ? ` ${n}개` : ''} · <b>${one.kind}</b>${heat}`); labels2.kind.show(true);
      spots2.minus.set(lattice.position.x - 3.3, MID, LAT.z); spots2.plus.set(lattice.position.x + 3.3, MID, LAT.z);
      labels2.minus.write('(−)'); labels2.plus.write('(+)'); labels2.minus.show(true); labels2.plus.show(true);
      labels2.cell.write(!running ? '전지' : !on ? '전류가 흐르지 않음' : !some ? '전류가 거의 흐르지 않음' : '<b>전류가 흐름</b>'); labels2.cell.show(true);
      labels2.key.write(on ? '스위치 <b>닫힘</b>' : '스위치 열림'); labels2.key.show(true);
      labels2.list.show(v.numbers);
      if (v.numbers) {
        const lines = id === 'none' ? ['규소: 원자가 전자 <b>4개</b>', '이웃 원자 넷과 전자를 2개씩 공유', pairs2() ? '열로 공유 결합이 끊어져 전자와 양공이 쌍으로 생김' : '움직일 수 있는 전자와 양공이 거의 없음']
          : id === 'p' ? ['인: 원자가 전자 <b>5개</b>', '공유 결합을 하고 <b>전자 1개</b>가 남음', '→ 남은 전자가 결정 안을 돌아다님 (n형)']
            : ['붕소: 원자가 전자 <b>3개</b>', '공유 결합에 전자 1개가 모자람 → <b>양공</b>', '→ 이웃 결합의 전자가 건너오며 양공이 옮겨 감 (p형)'];
        if (id !== 'none') lines.push(on ? `스위치 닫힘: ${id === 'p' ? '전자가 (+)쪽' : '양공이 (−)쪽'}으로 쏠림 → 전류` : '스위치 열림: 제멋대로 움직임 → 전류 0');
        else if (pairs2()) lines.push(on ? '스위치 닫힘: 전자는 (+)쪽, 양공은 (−)쪽으로 쏠림 → 전류' : '스위치 열림: 제멋대로 움직임 → 전류 0');
        if (adv) lines.push(`온도(T) <b>${warm()} K</b>`, `움직일 수 있는 전자 <b>${state2.frees.length}개</b> · 양공 <b>${state2.gaps.length}개</b>`);
        labels2.list.write(lines.join('<br>'));
        if (up) spots2.list.set(0, LAT.hi + 0.9, LAT.z); else spots2.list.set(lattice.position.x + 6.3, 2.6, LAT.z);
      }
    }
    const dopeScene = {
      rig: rig2, ids: ['dopant', 'closed', 'many', 'warm'],
      look: [{ target: [0.5, 2.4, 0], r: 14.5, theta: 0, phi: 1.3 }, { target: [0, 3.5, 0], r: 19, theta: 0, phi: 1.3 }],
      handles: dopeTool.handles, start: dopeTool.start, move: dopeTool.move, end: dopeTool.end,
      enter() { rig2.visible = true; lined(); settle(); stove2.show(warm()); },
      leave() { rig2.visible = false; for (const label of [...Object.values(labels2), things.p.label, things.b.label]) label.show(false); },
      // (an impurity put in, or the heat changed: what comes of it is shown at once, without the play button)
      changed(id) {
        if (id === 'closed') return;
        if (id === 'warm') stove2.show(warm()); else if (id === 'many') match(); else { lined(); settle(); note2(); }
        if (!state2.still && !running && (id === 'warm' || ctx.values.dopant !== 'none')) ctx.setPlaying(true);
      },
      play() {}, tick: advance2, toStart: toStart2, draw: draw2, numbers() {}, mode() { lined(); settle(); stove2.show(warm()); },
    };

    // ====================================== the diode ======================================
    // ---------- the junction drawn large, and the circuit on the bench ----------
    // The board at the back is the junction of the diode: its left half the p side, its right half the n side
    // (x from −HALF to HALF across it). Holes go about on the p side and as many electrons on the n side: ten of each,
    // and in the advanced mode fewer or more as less or more is mixed in (MOST3 at the most).
    // On the bench (row3: made smaller on a tall screen, so that all of it is in sight) stand the supply with its
    // knob and its two posts, the resistor, the diode in its holder, and a rack with the other diodes. The wire
    // from the resistor goes to the red post (+) and the one from the n side to the black post (−); pressed, the
    // two change posts.
    const JUN = { w: 5.8, lo: 1.5, hi: 5.1, px: 96, z: -1.7 }, MID3 = (JUN.lo + JUN.hi) / 2, HALF = 2.75, MOST3 = 14;
    const rig3 = new T.Group(); world.add(rig3);
    const junction = new T.Group(); rig3.add(junction);
    add(junction, box(JUN.w + 0.2, JUN.hi - JUN.lo + 0.2, 0.12), M.slate, 0, MID3, -0.07);
    for (const x of [-2.3, 2.3]) { add(junction, box(0.14, JUN.lo, 0.14), M.steel, x, JUN.lo / 2, -0.07); add(junction, box(0.5, 0.1, 1.2), M.dark, x, 0.05, -0.07); }
    add(junction, new T.PlaneGeometry(JUN.w, JUN.hi - JUN.lo), new T.MeshBasicMaterial({ toneMapped: false, map: kit.canvasTexture(Math.round(JUN.w * JUN.px), Math.round((JUN.hi - JUN.lo) * JUN.px), (g, w, h) => {
      g.fillStyle = '#1b1e27'; g.fillRect(0, 0, w, h);
      g.fillStyle = 'rgba(156,140,240,0.2)'; g.fillRect(0, 0, w / 2, h); g.fillStyle = 'rgba(232,163,61,0.17)'; g.fillRect(w / 2, 0, w / 2, h);
      g.strokeStyle = 'rgba(255,255,255,0.5)'; g.lineWidth = 3; g.setLineDash([12, 10]); g.beginPath(); g.moveTo(w / 2, 0); g.lineTo(w / 2, h); g.stroke();
    }) }), 0, MID3, 0, false, false);
    // (advanced) the strip at the junction that the holes and electrons keep out of: over it a plate that shows, as wide
    // as the strip is, the atoms mixed in that stay there, charged: (−) on the p side, (+) on the n side
    const bare3 = kit.canvasTexture(Math.round(JUN.w * JUN.px), Math.round((JUN.hi - JUN.lo) * JUN.px), (g, w, h) => {
      g.fillStyle = 'rgba(255,255,255,0.09)'; g.fillRect(0, 0, w, h);
      g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '700 22px Georgia, serif'; g.lineWidth = 2;
      for (let col = 0; col < 5; col++) for (const side of [-1, 1]) for (let row = 0; row * 0.45 + 0.3 < JUN.hi - JUN.lo - 0.2; row++) {
        const x = w / 2 + side * (0.15 + col * 0.3) * JUN.px, y = (0.3 + row * 0.45 + (col % 2 ? 0.22 : 0)) * JUN.px;
        if (y > h - 0.2 * JUN.px) continue;
        g.strokeStyle = g.fillStyle = side < 0 ? '#b9a7ff' : '#f0b860'; g.beginPath(); g.arc(x, y, 11, 0, Math.PI * 2); g.stroke(); g.fillText(side < 0 ? '−' : '+', x, y + 1);
      }
    });
    const strip = add(junction, new T.PlaneGeometry(1, JUN.hi - JUN.lo), new T.MeshBasicMaterial({ map: bare3, transparent: true, depthWrite: false, toneMapped: false }), 0, MID3, 0.02, false, false);
    const SIGN = { plus: mat(0xb8433a), minus: mat(0x2b2d36) }, bars = [-2.95, 2.95].map((x) => add(junction, box(0.1, JUN.hi - JUN.lo, 0.16), SIGN.plus, x, MID3, 0.03));   // (the two sides the wires are joined to)
    // the holes and the electrons (drawn as in the crystal), and the grains of light: a bright head with a tail
    const movers = Array.from({ length: MOST3 * 2 }, (unused, k) => {
      if (k >= MOST3) return add(junction, mote.geometry, mote.material, 0, 0, 0.16, false, false);
      const group = new T.Group(); junction.add(group);
      for (const part of hole.children) { const copy = new T.Mesh(part.geometry, part.material); copy.position.copy(part.position); copy.renderOrder = part.renderOrder; group.add(copy); }
      return group;
    });
    const LIFE = 0.8, UPRIGHT = new T.Vector3(0, 1, 0), spark = new T.SphereGeometry(0.09, 12, 8), streak = new T.ConeGeometry(0.075, 0.7, 10);
    const beams = Array.from({ length: 12 }, () => {
      const group = new T.Group(), ink = new T.MeshBasicMaterial({ transparent: true, depthWrite: false, blending: T.AdditiveBlending }), trail = new T.MeshBasicMaterial({ transparent: true, depthWrite: false, blending: T.AdditiveBlending });   // (light: it adds to what is behind it, and fades to nothing)
      add(group, spark, ink, 0, 0, 0, false, false); add(group, streak, trail, 0, -0.38, 0, false, false).rotation.x = Math.PI;
      group.visible = false; junction.add(group);
      return { group, ink, trail, age: LIFE, from: new T.Vector3(), dir: new T.Vector3(), faint: 1, inward: false, to: { x: 0, y: 0 } };
    });
    // on the bench: the supply (a box with a meter, a knob and two posts) …
    const row3 = new T.Group(); rig3.add(row3);
    const SUP = -3.5, POST = { plus: new T.Vector3(SUP + 0.45, 1.12, 0), minus: new T.Vector3(SUP - 0.45, 1.12, 0) }, OHM_AT = -1.3, LAMP = new T.Vector3(0.6, 0, 0.25), RACK = 2.1, APART = 0.5;
    add(row3, box(1.9, 1.0, 1.1), M.dark, SUP, 0.5, 0);
    const dial = kit.canvasTexture(256, 112, () => {}), dialInk = dial.image.getContext('2d');
    add(row3, new T.PlaneGeometry(1.15, 0.5), new T.MeshBasicMaterial({ map: dial, toneMapped: false }), SUP - 0.28, 0.56, 0.556, false, false);
    const knob = new T.Group(); knob.position.set(SUP + 0.62, 0.54, 0.56); row3.add(knob);
    add(knob, cyl(0.2, 0.2, 0.12, 24), M.steel, 0, 0, 0.05).rotation.x = Math.PI / 2; add(knob, box(0.05, 0.17, 0.03), mat(0x23262f), 0, 0.1, 0.12, false, false);
    const knobHandle = add(row3, box(0.8, 0.8, 0.5), M.dark, SUP + 0.62, 0.54, 0.7, false, false); knobHandle.visible = false; knobHandle.userData.grip = { kind: 'knob' };
    add(row3, cyl(0.09, 0.09, 0.16, 14), SIGN.plus, POST.plus.x, 1.07, 0); add(row3, cyl(0.09, 0.09, 0.16, 14), SIGN.minus, POST.minus.x, 1.07, 0);
    const plugHandle = add(row3, box(1.6, 0.7, 1.0), M.dark, SUP, 1.3, 0, false, false); plugHandle.visible = false; plugHandle.userData.grip = { kind: 'plug' };
    // … the resistor, the diode in its holder (its head takes the colour of the one put in, and shines) …
    add(row3, cyl(0.12, 0.12, 0.7, 16), mat(0xd8c7a0, { roughness: 0.7 }), OHM_AT, 0.2, 0.25).rotation.z = Math.PI / 2;
    [[-0.2, 0x7a4a2a], [-0.05, 0x23262f], [0.1, 0x7a4a2a]].forEach(([x, tint]) => { add(row3, cyl(0.125, 0.125, 0.06, 16), mat(tint), OHM_AT + x, 0.2, 0.25).rotation.z = Math.PI / 2; });
    add(row3, box(0.8, 0.14, 0.5), mat(0xd9dde6, { roughness: 0.6 }), LAMP.x, 0.07, LAMP.z); for (const x of [-0.18, 0.18]) add(row3, cyl(0.025, 0.025, 0.45, 8), M.steel, LAMP.x + x, 0.36, LAMP.z);
    const headInk = new T.MeshStandardMaterial({ roughness: 0.3, transparent: true, opacity: 0.9 }), haloInk = new T.MeshBasicMaterial({ transparent: true, depthWrite: false, opacity: 0 });
    const headShape = cyl(0.26, 0.26, 0.36, 24), capShape = new T.SphereGeometry(0.26, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), rimShape = cyl(0.31, 0.31, 0.06, 24);
    add(row3, rimShape, headInk, LAMP.x, 0.6, LAMP.z); add(row3, headShape, headInk, LAMP.x, 0.8, LAMP.z); add(row3, capShape, headInk, LAMP.x, 0.98, LAMP.z);
    const halo = add(row3, new T.SphereGeometry(0.5, 20, 14), haloInk, LAMP.x, 0.9, LAMP.z, false, false);
    // … and the rack: the five diodes, each to be carried to the holder (pressed, it goes there of itself)
    add(row3, box(APART * 4 + 0.7, 0.12, 0.7), mat(0xd9dde6, { roughness: 0.6 }), RACK + APART * 2, 0.06, 0);
    const spares = Object.fromEntries([...Object.keys(LEDS), 'pd'].map((id, k) => {   // (the photodiode stands there in the advanced mode only, the six then a little closer)
      const kind = LEDS[id] || PHOTO, group = new T.Group(), rest = new T.Vector3(RACK + k * APART, 0.12, 0), ink = new T.MeshStandardMaterial({ color: new T.Color(kind.dome || kind.tint).multiplyScalar(kind.dome ? 1 : 0.75), roughness: 0.3, transparent: true, opacity: 0.9 });
      group.position.copy(rest); row3.add(group);
      for (const x of [-0.07, 0.07]) add(group, cyl(0.015, 0.015, 0.3, 6), M.steel, x, 0.15, 0);
      for (const [shape, y] of [[rimShape, 0.3], [headShape, 0.4], [capShape, 0.49]]) add(group, shape, ink, 0, y, 0).scale.setScalar(0.5);
      const grip = add(group, box(APART - 0.04, 0.9, 0.8), M.dark, 0, 0.35, 0, false, false); grip.visible = false; grip.userData.grip = { kind: 'led', id };
      return [id, { id, group, rest, grip, k }];
    }));
    // (advanced) the lamp that shines on the photodiode: a stand behind the rack with its head turned to the holder, the light a faint cone. It is pulled sideways to make it brighter
    const SHADE = new T.Vector3(LAMP.x + 1.25, 0, -0.95), torch = new T.Group(); torch.position.copy(SHADE); row3.add(torch);
    add(torch, box(0.7, 0.12, 0.5), M.dark, 0, 0.06, 0); add(torch, cyl(0.04, 0.04, 1.2, 10), M.steel, 0, 0.7, 0);
    const lampHead = new T.Group(); lampHead.position.set(0, 1.3, 0); torch.add(lampHead); lampHead.lookAt(row3.localToWorld(new T.Vector3(LAMP.x, 0.9, LAMP.z)));
    const bulbInk = new T.MeshStandardMaterial({ color: 0xfff2c0, roughness: 0.4 }), glowInk = new T.MeshBasicMaterial({ color: 0xfff2c0, transparent: true, depthWrite: false, opacity: 0 });
    add(lampHead, cyl(0.24, 0.12, 0.3, 20), M.dark, 0, 0, 0.1).rotation.x = Math.PI / 2; add(lampHead, new T.SphereGeometry(0.13, 16, 10), bulbInk, 0, 0, 0.22);
    add(lampHead, new T.ConeGeometry(0.42, 1.6, 20, 1, true), glowInk, 0, 0, 1.0, false, false).rotation.x = -Math.PI / 2;
    const lampHandle = add(torch, box(0.9, 1.7, 0.9), M.dark, 0, 0.85, 0, false, false); lampHandle.visible = false; lampHandle.userData.grip = { kind: 'lamp' };
    // the wires: from a post to the resistor, from the resistor to the diode, from the diode back to the other post; and two faint lines from the diode to the board that shows its inside
    const wire = (color, n, parent = row3) => { const line = new T.Line(new T.BufferGeometry().setFromPoints(Array.from({ length: n }, () => new T.Vector3())), new T.LineBasicMaterial({ color })); line.frustumCulled = false; parent.add(line); return line; };
    const leadOut = wire(0xb8433a, 4), leadBack = wire(0x2b2d36, 5), link = wire(0x2b2d36, 3), zoom = [wire(0xd9dde6, 2, rig3), wire(0xd9dde6, 2, rig3)];
    link.geometry.setFromPoints([new T.Vector3(OHM_AT + 0.4, 0.2, 0.25), new T.Vector3(LAMP.x - 0.18, 0.2, 0.25), new T.Vector3(LAMP.x - 0.18, 0.3, 0.25)]);
    for (const line of zoom) { line.material.transparent = true; line.material.opacity = 0.55; }
    const spots3 = { p: new T.Vector3(), n: new T.Vector3(), layer: new T.Vector3(), left: new T.Vector3(), right: new T.Vector3(), supply: new T.Vector3(), ohm: new T.Vector3(), lamp: new T.Vector3(), rack: new T.Vector3(), torch: new T.Vector3(), list: new T.Vector3() };
    const labels3 = Object.fromEntries(Object.keys(spots3).map((key) => [key, view.label(spots3[key], key === 'list')]));

    // ---------- what goes on ----------
    // Each hole and electron goes about at random on its own side (far: how far it is from the junction). They
    // keep out of a strip at the junction, clear() wide either way: CLEAR with no voltage, wider joined backwards,
    // narrower joined forwards but never gone (thin(): by the voltage on the junction itself, not the supply's). With a current, they are drawn to the
    // junction as fast as they join there: JOIN pairs a second for each mA. A pair that joins gives a grain of
    // light, and a hole comes in at the (+) side, an electron at the (−) side. found: for each diode, the least
    // voltage of the supply at which it has been seen alight.
    // (advanced) The strip is the narrower the more is mixed in (as 1 ÷ √ of it), and the diode itself resists the less
    // (as 1 ÷ it), so that the current is the greater. In the photodiode the lamp's light comes to the strip grain by
    // grain, as many a second as the current it makes asks for; each makes a hole and an electron there, which the
    // strip drives out, the hole to the p side and the electron to the n side, while one of each leaves by the wires:
    // a current the other way than that of a diode alight. The supply is then at nought (its knob and posts are not
    // to be handled), and what is read is the voltage that current puts on the resistor.
    const SWIFT3 = 1.2, CLEAR = 0.45, JOIN = 0.3, MEET = 2.2;
    const state3 = { all: [], due: 0, lit: 0, joined: 0, made: 0 }, found = new Map();
    let quiet = false;   // (while all is put back to the start: nothing begins of itself)
    const photo = () => ctx.values.led === 'pd', led = () => (photo() ? PHOTO : LEDS[ctx.values.led]), forward = () => photo() || ctx.values.turned !== true, volts = () => (photo() ? 0 : ctx.values.volt);
    const many3 = () => DOSES[ctx.advanced ? ctx.values.dose : 'mid'].n, glare = () => (photo() ? PHOTO.each * ctx.values.light : 0);   // how many holes (and electrons); the current the light makes (mA)
    const amps = () => (forward() ? flow(ctx.values.led, volts(), glare(), many3()) : 0);   // mA (below nought: the other way)
    // the voltage on the junction itself (forwards above nought): the supply's less what the resistor and the diode's own
    // resistance take (the photodiode: what its current puts on them); and how wide the strip is, of its width with no voltage
    const across = () => (forward() ? volts() - amps() * (LOAD + inner(many3())) : -volts());
    const thin = () => Math.sqrt(1 - across() / (led().on + BARRIER));
    const clear = () => CLEAR * Math.sqrt(10 / many3()) * thin();
    const anyY = () => JUN.lo + 0.3 + Math.random() * (JUN.hi - JUN.lo - 0.6);
    function settle3() {
      const n = many3(), bare = clear();
      state3.all = Array.from({ length: n * 2 }, (unused, k) => ({ side: k < n ? -1 : 1, x: (k < n ? -1 : 1) * (bare + Math.random() * (HALF - bare)), y: anyY(), way: Math.random() * 2 * Math.PI, turn: Math.random() * TURN, mate: null }));
      state3.due = 0; state3.lit = 0; for (const beam of beams) beam.age = LIFE;
    }
    function glint(x, y) {
      const beam = beams.find((one) => one.age >= LIFE), round = Math.random() * 2 * Math.PI;
      state3.joined++;
      if (!beam || photo()) return;   // (the photodiode gives no light: what a pair gives up there goes to heat)
      beam.age = 0; beam.inward = false; beam.from.set(x, y, 0.2); beam.dir.set(0.7 * Math.cos(round), 0.7 * Math.sin(round), 0.75).normalize(); beam.group.quaternion.setFromUnitVectors(UPRIGHT, beam.dir);
      beam.ink.color.set(led().tint); beam.trail.color.set(led().tint); beam.faint = ctx.values.led === 'ir' ? 0.5 : 1;
    }
    // a grain of the lamp's light on its way to the strip; and where it is taken up, a hole and an electron (those nearest the wires leave by them)
    function shaft() {
      const beam = beams.find((one) => one.age >= LIFE), round = Math.random() * 2 * Math.PI;
      if (!beam) return;
      beam.to.x = (Math.random() - 0.5) * 0.16; beam.to.y = anyY();
      beam.age = 0; beam.inward = true; beam.dir.set(-0.5 * Math.cos(round), -0.5 * Math.sin(round), -0.87).normalize(); beam.from.set(beam.to.x, beam.to.y, 0.2).addScaledVector(beam.dir, -3.5 * LIFE);
      beam.group.quaternion.setFromUnitVectors(UPRIGHT, beam.dir); beam.ink.color.set(0xfff2c0); beam.trail.color.set(0xfff2c0); beam.faint = 1;
    }
    function pair(x, y) {
      state3.made++;
      for (const side of [-1, 1]) {
        const one = state3.all.filter((each) => each.side === side && !each.mate).sort((a, b) => side * (b.x - a.x))[0];
        if (one) Object.assign(one, { x: side * 0.06 + x, y, way: Math.random() * 2 * Math.PI });
      }
    }
    function advance3(t, dt) {
      const current = amps(), bare = clear(), pull = HALF / many3() * JOIN * current;
      state3.due = Math.min(2, state3.due + JOIN * Math.max(0, current) * dt);
      state3.lit += JOIN * Math.max(0, -current) * dt;
      if (state3.lit >= 1) { state3.lit -= 1; shaft(); }
      for (const one of state3.all) {
        if (one.mate) continue;
        one.turn -= dt; if (one.turn <= 0) { one.turn = TURN * (0.5 + Math.random()); one.way = Math.random() * 2 * Math.PI; }
        const was = one.side * one.x;
        let far = was + (SWIFT3 * Math.cos(one.way) - pull) * dt;
        one.y += SWIFT3 * Math.sin(one.way) * dt;
        if (far < bare) { far = Math.min(bare, Math.max(far, was + 2.5 * dt)); if (Math.cos(one.way) < 0) one.way = Math.PI - one.way; }   // (out of the strip; if the strip has grown over it, it is driven out)
        if (far > HALF) { far = HALF; one.way = Math.PI - one.way; }
        if (one.y > JUN.hi - 0.25 || one.y < JUN.lo + 0.25) { one.y = Math.max(JUN.lo + 0.25, Math.min(JUN.hi - 0.25, one.y)); one.way = -one.way; }
        one.x = one.side * far;
      }
      if (state3.due >= 1) {   // a pair is due: the hole nearest the junction, and of the electrons at the junction the one nearest that hole
        const free = state3.all.filter((one) => !one.mate && Math.abs(one.x) < 0.5), gap = free.filter((one) => one.side < 0).sort((a, b) => b.x - a.x)[0];
        const mate = gap && free.filter((one) => one.side > 0).sort((a, b) => Math.abs(a.y - gap.y) - Math.abs(b.y - gap.y))[0];
        if (mate) { gap.mate = mate; mate.mate = gap; state3.due -= 1; }
      }
      for (const one of state3.all) {
        if (!one.mate || one.side > 0) continue;
        const other = one.mate, dx = other.x - one.x, dy = other.y - one.y, apart = Math.hypot(dx, dy), step = MEET * dt;
        if (apart <= 2 * step + 0.05) {
          glint((one.x + other.x) / 2, (one.y + other.y) / 2);
          for (const gone of [one, other]) Object.assign(gone, { mate: null, x: gone.side * HALF, y: anyY(), way: Math.random() * 2 * Math.PI });   // (others come in from the wires)
          continue;
        }
        one.x += dx / apart * step; one.y += dy / apart * step; other.x -= dx / apart * step; other.y -= dy / apart * step;
      }
      for (const beam of beams) if (beam.age < LIFE) { beam.age += dt; if (beam.inward && beam.age >= LIFE) pair(beam.to.x, beam.to.y); }
    }
    function paintDial() {
      dialInk.fillStyle = '#10141c'; dialInk.fillRect(0, 0, 256, 112);
      dialInk.fillStyle = '#9ff0c0'; dialInk.font = '700 64px Georgia, serif'; dialInk.textAlign = 'center'; dialInk.textBaseline = 'middle'; dialInk.fillText(`${volts().toFixed(2)} V`, 128, 60);
      dial.needsUpdate = true;
    }
    // what has been found, written anew in the table and on the graph. The table's own clear() (its 지우기 button) is made
    // to forget what was found as well: the dots go with the rows, and a diode wiped is found afresh
    const wipe3 = ctx.tables.table3.clear;
    function write3() {
      wipe3();
      for (const key of Object.keys(LEDS)) {
        ctx.traces[`v${key}`].clear();
        for (const one of FREQS) ctx.traces[`v${key}`].add(hertz(one), one === key && found.has(key) ? found.get(key) : NaN);
        if (!found.has(key)) continue;
        ctx.tables.table3.add([LEDS[key].name, String(LEDS[key].wave), hertz(key).toFixed(2), found.get(key).toFixed(2)]);
      }
    }
    ctx.tables.table3.clear = () => { found.clear(); write3(); };
    // the least voltage at which the diode in the holder has been seen alight: kept, and written in the table and on the graph.
    // Nothing is kept while all is put back (quiet), nor while the frame takes the photodiode out on leaving the advanced
    // mode (wasAdvanced, below, is not brought up to date until that is done): the voltage is then one set for another diode
    function note3() {
      const id = ctx.values.led, volt = ctx.values.volt;
      if (quiet || ctx.advanced !== wasAdvanced || photo() || amps() < SEEN || (found.has(id) && found.get(id) <= volt)) return;
      found.set(id, volt); write3();
    }
    function toStart3() {
      quiet = true;
      for (const [key, value] of [['led', 'red'], ['volt', 0], ['turned', false], ['dose', 'mid'], ['light', 50]]) if (!ctx.locked.has(key) && ctx.values[key] !== value) ctx.set(key, value);
      quiet = false; settle3(); paintDial(); moved = true;
    }

    // ---------- handling ----------
    // The knob of the supply is pulled sideways (or up and down) to turn it; the posts are pressed to change the
    // wires over; a diode of the rack is carried to the holder, or pressed. (advanced) The lamp is pulled sideways.
    const home3 = new T.Vector3(), onRow = (x, y, z, out) => out.set(x, y, z).multiplyScalar(row3.scale.x).add(row3.position);   // a point of the bench row, as the labels and the hand need it
    const ledTool = {
      handles: () => [...(photo() ? [lampHandle] : [knobHandle, plugHandle]), ...Object.values(spares).filter((one) => one.id !== ctx.values.led && (one.id !== 'pd' || ctx.advanced)).map((one) => one.grip)],   // (the one in the holder is not in the rack: its place there is not to be handled)
      start(grip, r) {
        const key = { knob: 'volt', led: 'led', lamp: 'light' }[grip.kind], one = spares[grip.id];   // (what can be locked: the posts cannot)
        onRow(...(grip.kind === 'knob' ? [SUP + 0.62, 0.54, 0.6] : grip.kind === 'plug' ? [SUP, 1.2, 0] : grip.kind === 'lamp' ? [SHADE.x, 0.9, SHADE.z] : [one.rest.x, 0.5, 0]), way);
        if (ctx.locked.has(key)) { say('잠금', way.x, way.y + 0.6, way.z, 1.2); return false; }
        const at = way.clone();
        plane.setFromNormalAndCoplanarPoint(way.copy(r.direction).negate(), at);
        if (!r.intersectPlane(plane, hit)) return false;
        grab = { ...grip, off: at.clone().sub(hit), start: hit.clone(), at, from: grip.kind === 'lamp' ? ctx.values.light : ctx.values.volt, moved: false, near: false };
        return true;
      },
      move(r) {
        if (grab.kind === 'plug' || !r.intersectPlane(plane, hit)) return;
        if (grab.kind === 'knob') {   // (1 V for each 1.5 of the bench it is pulled)
          const to = Math.max(0, Math.min(VOLT_MAX, Math.round((grab.from + (hit.x - grab.start.x + hit.y - grab.start.y) / 1.5) / 0.05) * 0.05));
          if (Math.abs(to - ctx.values.volt) > 1e-6) ctx.set('volt', Number(to.toFixed(2)));
          return;
        }
        if (grab.kind === 'lamp') {   // (50 % for each unit of the bench it is pulled)
          const to = Math.max(0, Math.min(100, Math.round((grab.from + (hit.x - grab.start.x + hit.y - grab.start.y) * 50) / 5) * 5));
          if (to !== ctx.values.light) ctx.set('light', to);
          return;
        }
        if (!grab.moved && hit.distanceTo(grab.start) < 0.12) return;   // (a press is not a pull)
        grab.moved = true; grab.at.copy(hit).add(grab.off); grab.at.y = Math.max(0.2, grab.at.y);
        grab.near = r.distanceToPoint(home3) < 0.8;
      },
      end(done) {
        if (done.kind === 'plug') { ctx.set('turned', forward()); return; }
        if (done.kind !== 'led' || !(!done.moved || done.near)) return;
        ctx.set('led', done.id);
      },
    };

    function draw3() {
      const v = ctx.values, one = led(), up = tall(), adv = ctx.advanced, pd = photo(), size = up ? 0.8 : 1, current = amps(), drop = Math.abs(current) * LOAD, on = !pd && current >= SEEN, fore = forward(), faint = v.led === 'ir' ? 0.5 : 1;
      const shine = pd ? 0 : Math.min(1, Math.sqrt(current / FULL_MA));   // (as the eye takes it: a little current is seen already)
      const n = state3.all.length / 2, bare = clear();
      const carried3 = grab && grab.kind === 'led' && grab.moved ? grab : null;
      junction.position.set(up ? 0 : -0.3, 0, JUN.z); row3.position.set(up ? 0.1 : 0, 0, 2.2); row3.scale.setScalar(size);
      onRow(LAMP.x, 0.8, LAMP.z, home3);
      bars[0].material = fore ? SIGN.plus : SIGN.minus; bars[1].material = fore ? SIGN.minus : SIGN.plus;
      movers.forEach((ball, k) => {
        const gap = k < MOST3, i = gap ? k : k - MOST3, mover = i < n ? state3.all[gap ? i : n + i] : null;
        ball.visible = Boolean(mover);
        if (mover) ball.position.set(mover.x, mover.y, gap ? 0.12 : 0.16);
      });
      strip.visible = adv; strip.scale.x = 2 * bare; bare3.repeat.x = 2 * bare / JUN.w; bare3.offset.x = 0.5 - bare / JUN.w;
      torch.visible = pd; glowInk.opacity = 0.32 * v.light / 100; bulbInk.emissive.setScalar(v.light / 100);
      for (const beam of beams) {
        beam.group.visible = beam.age < LIFE;
        if (!beam.group.visible) continue;
        beam.group.position.copy(beam.from).addScaledVector(beam.dir, 3.5 * beam.age);
        beam.ink.opacity = (beam.inward ? Math.min(1, 3 * beam.age / LIFE) : 1 - beam.age / LIFE) * beam.faint; beam.trail.opacity = 0.5 * beam.ink.opacity;
      }
      // the supply, the wires (which post each is on), the diode and the rack
      knob.rotation.z = 2.3 - volts() / VOLT_MAX * 4.6;
      const out = fore ? POST.plus : POST.minus, back = fore ? POST.minus : POST.plus;
      reshape(leadOut, [out, way.set(SUP + 1.15, 0.9, 0.25).clone(), way.set(SUP + 1.3, 0.2, 0.25).clone(), way.set(OHM_AT - 0.4, 0.2, 0.25).clone()]);
      reshape(leadBack, [way.set(LAMP.x + 0.18, 0.3, LAMP.z).clone(), way.set(LAMP.x + 0.6, 0.12, -0.5).clone(), way.set(SUP + 1.2, 0.12, -0.8).clone(), way.set(back.x, 0.95, -0.6).clone(), back]);
      headInk.color.set(one.dome || one.tint).multiplyScalar(one.dome ? 1 : 0.6 + 0.4 * shine); headInk.emissive.set(one.tint).multiplyScalar(shine * faint);
      haloInk.color.set(one.tint); haloInk.opacity = 0.5 * shine * faint; halo.scale.setScalar(0.7 + 0.9 * shine); halo.visible = shine > 0.01;
      for (const spare of Object.values(spares)) {
        const mine = carried3 && carried3.id === spare.id;
        spare.rest.x = RACK + spare.k * (adv ? APART * 0.82 : APART);
        spare.group.visible = (Boolean(mine) || spare.id !== v.led) && (spare.id !== 'pd' || adv);   // (the one in the holder is not in the rack)
        if (mine) { way.copy(carried3.near ? home3 : carried3.at).sub(row3.position).divideScalar(size); spare.group.position.copy(way); if (carried3.near) spare.group.position.y -= 0.3; } else spare.group.position.copy(spare.rest);
      }
      onRow(LAMP.x, 0.95, LAMP.z, way);
      zoom.forEach((line, k) => reshape(line, [way.clone(), hit.set(junction.position.x + (k ? 2.9 : -2.9), JUN.lo - 0.1, JUN.z + 0.05).clone()]));
      // the writing
      spots3.p.set(junction.position.x - (adv ? 1.85 : 1.45), JUN.hi + 0.2, JUN.z); spots3.n.set(junction.position.x + (adv ? 1.85 : 1.45), JUN.hi + 0.2, JUN.z);   // (advanced: apart, with the name of the strip between them)
      spots3.left.set(junction.position.x - 3.3, MID3, JUN.z); spots3.right.set(junction.position.x + 3.3, MID3, JUN.z);
      onRow(SUP, 1.5, 0, spots3.supply); onRow(OHM_AT, 0.5, 0.25, spots3.ohm); onRow(LAMP.x, up ? 1.7 : 1.5, LAMP.z, spots3.lamp); onRow(RACK + APART * 2, up ? 0.7 : 0.85, 0, spots3.rack);
      spots3.layer.set(junction.position.x, JUN.hi + 0.2, JUN.z); labels3.layer.write('공핍층');
      labels3.p.write('p형 반도체'); labels3.n.write('n형 반도체'); labels3.left.write(fore ? '(+)' : '(−)'); labels3.right.write(fore ? '(−)' : '(+)');
      labels3.supply.write(pd ? '<b>0.00 V</b>' : `<b>${v.volt.toFixed(2)} V</b>${up ? '<br>' : ' · '}${fore ? '순방향 연결' : '<b>역방향 연결</b>'}`);
      labels3.ohm.write(pd ? `저항 100 Ω${up ? '<br>' : ' · '}<b>${drop.toFixed(2)} V</b>` : '저항 100 Ω');   // (the photodiode: the voltage its current puts on the resistor)
      onRow(SHADE.x, 1.62, SHADE.z, spots3.torch); labels3.torch.write(`빛의 세기 <b>${v.light} %</b>`);
      labels3.lamp.write(pd ? (up ? `${one.name}<br>빛의 세기 <b>${v.light} %</b>` : one.name) : `${one.name} · ${on ? '<b>불빛 켜짐</b>' : '불빛 꺼짐'}`); labels3.rack.write(adv && !pd ? '다이오드' : '발광 다이오드');   // (advanced: the photodiode stands in the rack as well, unless it is in the holder)
      for (const key of Object.keys(labels3)) labels3[key].show(key === 'list' ? v.numbers : key === 'layer' ? strip.visible : key === 'torch' ? pd && !up : key === 'left' || key === 'right' ? !pd || drop >= 0.005 : true);   // (the photodiode: the p side is the higher while a current is made)
      if (v.numbers) {
        const size2 = Math.abs(current), amount = `<b>${size2 < 1 ? size2.toFixed(2) : size2.toFixed(1)} mA</b>`, lines = [];
        if (pd) {
          lines.push(`빛의 세기 <b>${v.light} %</b>`, `저항에 걸리는 전압 <b>${drop.toFixed(2)} V</b>`,
            ...(drop >= 0.005 ? ['전류의 방향: 발광 다이오드와 반대', '빛을 받아 접합면 부근에 전자와 양공이 생김<br>→ 양공은 p형, 전자는 n형 쪽으로 이동'] : ['빛이 없으면 전류가 흐르지 않음']));
        } else {
          const f = hertz(v.led);
          lines.push(`전원 장치의 전압 <b>${v.volt.toFixed(2)} V</b>`, `전류 ${amount}`, `빛의 파장 <b>${one.wave} nm</b> · 진동수(f) <b>${f.toFixed(2)} ×10¹⁴ Hz</b>`, `광자 1개의 에너지 = hf = <b>${(PLANCK * f * 1e14).toFixed(2)} eV</b>`,
            !fore ? '역방향: 전자와 양공이 접합면에서 멀어짐 → 전류 0' : on ? '순방향: 전자와 양공이 접합면에서 만나 빛을 냄' : '전압이 낮아 전자와 양공이 접합면에서 만나지 못함');
        }
        if (adv) lines.push(`도핑 농도 <b>${DOSES[v.dose].name}</b> · 다이오드 자체의 저항 <b>${Math.round(inner(many3()) * 1000)} Ω</b>`);
        if (adv) lines.push(`공핍층의 두께: ${pd ? '빛' : '전압'}이 없을 때의 <b>${thin().toFixed(2)}배</b>`);
        labels3.list.write(lines.join('<br>'));
        if (up) spots3.list.set(0, JUN.hi + 0.9, JUN.z); else spots3.list.set(junction.position.x + 6.6, 2.4, JUN.z);
      }
    }
    const ledScene = {
      rig: rig3, ids: ['led', 'volt', 'turned', 'dose', 'light'],
      look: [{ target: [0.5, 2.4, 0], r: 14.5, theta: 0, phi: 1.3 }, { target: [0, 3.2, 0], r: 19, theta: 0, phi: 1.3 }],
      handles: ledTool.handles, start: ledTool.start, move: ledTool.move, end: ledTool.end,
      enter() { rig3.visible = true; settle3(); paintDial(); },
      leave() { rig3.visible = false; for (const label of Object.values(labels3)) label.show(false); },
      changed(id) { if (id === 'volt' || id === 'led') paintDial(); if (id === 'dose') settle3(); if (id === 'led') { state3.lit = 0; for (const beam of beams) beam.age = LIFE; } note3(); if (!quiet && !running) ctx.setPlaying(true); },   // (what is changed is shown at once, without the play button)
      play() {}, tick: advance3, toStart: toStart3, draw: draw3, numbers() {}, mode() { settle3(); },
    };

    const SCENES = { band: bandScene, dope: dopeScene, led: ledScene }, scene = () => SCENES[ctx.values.scene];
    const frame = () => view.look(scene().look[tall() ? 1 : 0]);
    view.setTool({
      pick(r) {
        ray.ray.copy(r); scene().rig.updateMatrixWorld(true);
        const found = ray.intersectObjects(scene().handles(), false)[0];
        return found ? found.object.userData.grip : null;
      },
      cursor: (grip) => (!grip ? '' : 'grab'),
      start: (grip, r) => scene().start(grip, r),
      move(r) { scene().move(r); moved = true; },
      end() {
        const done = grab;
        grab = null; tip.show(false); tipTime = 0; moved = true;
        if (done) scene().end(done);
      },
    });
    ctx.on('play', (on) => { running = on; scene().play(on); moved = true; });
    ctx.on('tick', (t, dt) => { if (!dt) return; scene().tick(t, dt); moved = true; });
    ctx.on('action', (id) => { if (id === 'reset') scene().toStart(); });
    ctx.on('view', () => { moved = true; });
    ctx.on('change', (id, value) => {
      const at = scene();
      moved = true;
      if (id === 'scene') {   // the other arrangement: the clock at nought
        for (const one of Object.values(SCENES)) if (one !== at) one.leave();
        at.enter(); frame(); ctx.setPlaying(false); ctx.seek(0); tip.show(false); tipTime = 0;
        return;
      }
      if (id === 'numbers') at.numbers();
      if (at.ids.includes(id)) at.changed(id, value);
    });
    // (the frame tells of the class and inquiry buttons as well: only a change between basic and advanced counts here)
    let wasAdvanced = ctx.advanced;
    ctx.on('mode', () => { moved = true; if (ctx.advanced === wasAdvanced) return; wasAdvanced = ctx.advanced; scene().mode(); });

    for (const id of ['0', ...FREQS]) for (const one of FREQS) ctx.traces[`v${id}`].add(hertz(one), NaN);
    shuffle(); dopeScene.leave(); ledScene.leave(); bandScene.enter();
    return {
      led: () => ({ led: ctx.values.led, volt: volts(), forward: forward(), amps: amps(), drop: Math.abs(amps()) * LOAD, own: inner(many3()), across: across(), thin: thin(), clear: clear(), joined: state3.joined, made: state3.made, n: many3(), holes: state3.all.filter((one) => one.side < 0).map((one) => one.x), electrons: state3.all.filter((one) => one.side > 0).map((one) => one.x), found: [...found] }),
      flow: (id, volt, lit, n) => flow(id, volt, lit, n),
      dope: () => ({ dopant: ctx.values.dopant, closed: closed(), warm: warm(), pairs: pairs2(), filled: state2.filled.slice(), frees: state2.frees.map((one) => ({ ...one })), gaps: state2.gaps.map((one) => ({ at: one.at, x: places[one.at].x, y: places[one.at].y, step: Boolean(one.step) })) }),
      band: () => ({ temp: temp(), pairs: pairs(), lifted: lifted(ctx.values.stuff, temp()), rho: resist(ctx.values.stuff, temp()), tried: Object.fromEntries(Object.entries(tried).map(([id, map]) => [id, [...map]])), atoms: count(), levels: levelsOf(ctx.values.stuff, Math.min(count(), 8)), glow: glow(), current: current(), resist: (id, kelvin) => resist(id, kelvin) }),
      update(dt) {
        if (!framed) { framed = true; if (tall()) frame(); }
        if (tipTime > 0) { tipTime -= dt; if (tipTime <= 0) { tip.show(false); moved = true; } }
        if (!moved) return false;
        moved = false; scene().draw();
        return true;
      },
    };
  },
};
