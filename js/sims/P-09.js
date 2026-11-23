// P-09 Electric power (3D).
//
// The circuit board: a supply, a switch and places for resistors, after the textbook's inquiry. Two places, A and B,
// lie one after the other in the line of the circuit; a third, C, lies on a branch across B. With resistors in A and
// B they are in series; with resistors in B and C (and a plain link in A) they are in parallel; with one alone the
// board shows Ohm's law. Resistors are taken from a rack and clipped into the places. A voltmeter and an ammeter are
// carried, each by itself, to where they belong: the voltmeter beside a part, joined to its two ends; the ammeter
// into the line that leads to it. A resistor uses the power P = V I = I^2 R = V^2 / R and glows with it.
// Advanced: two more places, D in the line and E on a second branch across B, for three resistors in series, in
// parallel or mixed; and what goes into a junction and round a loop is written out (Kirchhoff's laws).
//
// The power strip: six appliances beside a strip of six sockets on the 220 V mains. A plug is carried to the strip and
// the appliance runs; pressed, an appliance is switched off and on by itself, for they are all side by side. Each
// takes the current I = P / V, and the currents add up in the strip and its cord. The strip is rated for 16 A: a row
// of lamps on it shows the current, 1 A a lamp, and with more than 16 A the strip cuts itself off. (The mains is
// alternating, so no arrows and no drifting electrons are drawn here.)
// Advanced: the cord of the strip has a resistance r. It is in series with all the appliances together, so with the
// current I it takes the voltage I r for itself and turns I^2 r into heat, and the appliances get 220 V - I r.
//
// What is set by hand can be set from the menu as well, over the same ranges and in the same steps.
// One unit of the scene is 10 cm. Resistances are whole ohms from 1 to 6 and the supply goes from 1.5 V to 9 V, so
// that the textbook's worked examples can be tried as they stand.
const GOLD = '#e3c26b', RED = '#e58373', BLUE = '#7fa6e6', GREEN = '#7fcf9f', VIOLET = '#b79be6', SLATE = '#a9bbd6';
const OHM = '<span style="font-family: Georgia, serif">Ω</span>';   // the Korean face draws Greek letters full width
const PLACES = ['a', 'b', 'c', 'd', 'e'], NAMES = { a: 'A', b: 'B', c: 'C', d: 'D', e: 'E', all: '전체' };
const LINE = { kind: 'slider', min: 0, max: 6, step: 1, unit: ' Ω' }, BRANCH = { kind: 'slider', min: 1, max: 6, step: 1, unit: ' Ω' };   // a place in the line holds a plain link at 0; one on a branch is empty unless it is switched on
const two = (value) => value.toFixed(2);
const onBoard = (values) => values.scene === 'board', onStrip = (values) => values.scene === 'strip';
// The strip: the mains, the current it is rated for, the power that makes at this voltage and the 70 % of it that is advised.
const MAINS = 220, RATED = 16, ALLOWED = MAINS * RATED, ADVISED = 0.7 * ALLOWED;
// The appliances, each with the power it uses at 220 V (chosen so that the currents are round: 0.1, 0.25, 1, 5, 7 and 10 A).
const UNITS = [{ id: 'uLamp', name: '전등', watts: 22 }, { id: 'uFan', name: '선풍기', watts: 55 }, { id: 'uTv', name: '텔레비전', short: 'TV', watts: 220 },
  { id: 'uCooker', name: '전기밥솥', short: '밥솥', watts: 1100 }, { id: 'uDryer', name: '헤어드라이어', short: '드라이어', watts: 1540 }, { id: 'uHeater', name: '전기난로', short: '난로', watts: 2200 }];
const SHADES = [SLATE, GREEN, BLUE, VIOLET, RED, '#e6a15c'];   // the colour of each appliance's bar
const inOhms = (value) => (value >= 100 ? value.toFixed(0) : value.toFixed(1));
// what a meter may be on: a place, or the whole circuit (the two ends of the supply; the line that leaves it)
const SPOTS = [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }, { id: 'c', label: 'C' }, { id: 'd', label: 'D', advanced: true }, { id: 'e', label: 'E', advanced: true }, { id: 'all', label: '전체' }];

export default {
  // what is taken for granted, written on screen by the frame
  premise: (v, advanced) => (!onStrip(v) ? '도선과 전원 장치의 저항은 없고, 저항값은 온도에 따라 변하지 않는다고 봅니다'
    : advanced ? '기구의 저항은 변하지 않고, 기구에 딸린 전선의 저항은 매우 작다고 봅니다' : '멀티탭과 전선의 저항은 매우 작아서, 기구마다 220 V가 그대로 걸린다고 봅니다'),
  fixedViews: ['top'],
  camera: { target: [0.6, 0.2, 0.7], r: 12.5, theta: 0, phi: 0.72, rMax: 30 },
  traces: {
    iv: { window: 100, range: 0.5, read: (i) => `${two(i)} A` },   // the current in what is measured against the voltage across it (V), not against time
  },
  charts: {
    power: { names: ['A', 'B', 'C', '전체'], colors: [RED, BLUE, GREEN, GOLD], groups: ['W'], signed: false, range: 1, read: (p) => two(p) },   // the scene sets the names: five places in the advanced mode
    load: { names: ['전체'], colors: [GOLD], groups: ['W'], signed: false, range: 100, read: (p) => p.toFixed(0) },   // the scene sets the names: a bar for each appliance that runs, and one for the whole
  },
  menus: {
    vars: [
      { id: 'scene', label: '장면 선택', kind: 'choice', value: 'board', options: [{ id: 'board', label: '회로판' }, { id: 'strip', label: '멀티탭과 전기 안전' }] },
      { id: 'volts', label: '전원의 전압', kind: 'slider', min: 1.5, max: 9, step: 1.5, value: 3, digits: 1, unit: ' V', when: onBoard },
      { id: 'closed', label: '스위치 닫기', kind: 'toggle', when: onBoard },
      { id: 'rA', label: 'A 자리의 저항', ...LINE, value: 2, when: onBoard }, { id: 'rB', label: 'B 자리의 저항', ...LINE, value: 3, when: onBoard },
      { id: 'cOn', label: 'C 자리에 저항 끼우기', kind: 'toggle', when: onBoard }, { id: 'rC', label: 'C 자리의 저항', ...BRANCH, value: 3, when: (v) => onBoard(v) && v.cOn },
      { id: 'rD', label: 'D 자리의 저항', ...LINE, value: 0, advanced: true, when: onBoard },
      { id: 'eOn', label: 'E 자리에 저항 끼우기', kind: 'toggle', advanced: true, when: onBoard }, { id: 'rE', label: 'E 자리의 저항', ...BRANCH, value: 6, advanced: true, when: (v) => onBoard(v) && v.eOn },
      { id: 'voltAt', label: '전압계를 대는 곳', kind: 'choice', value: 'none', options: [{ id: 'none', label: '대지 않음' }, ...SPOTS], when: onBoard },
      { id: 'ampAt', label: '전류계를 끼우는 곳', kind: 'choice', value: 'none', options: [{ id: 'none', label: '끼우지 않음' }, ...SPOTS], when: onBoard },
      // the strip: its own switch, and for each appliance whether its plug is in and whether it is switched on
      { id: 'mains', label: '멀티탭 스위치 켜기', kind: 'toggle', value: true, when: onStrip },
      ...UNITS.map((unit) => ({ id: unit.id, label: `${unit.name} (${unit.watts} W)`, kind: 'choice', value: 'out', options: [{ id: 'out', label: '뽑음' }, { id: 'off', label: '끔' }, { id: 'on', label: '켬' }], when: onStrip })),
      { id: 'wire', label: '멀티탭 전선의 저항', kind: 'slider', min: 0, max: 1, step: 0.05, value: 0.2, digits: 2, unit: ' Ω', advanced: true, when: onStrip },
    ],
    graph: [
      // a point for every voltage tried, for the part the voltmeter is on (the whole circuit if it is put away)
      { id: 'currentVolt', label: '전류–전압', kind: 'graph', x: '전압', xUnit: 'V', span: [0, 9], plots: [{ y: '전류', trace: 'iv', dots: true }], when: onBoard },
      { id: 'powerBars', label: '소비 전력 막대', kind: 'graph', bars: 'power', when: onBoard },
      { id: 'loadBars', label: '소비 전력 막대', kind: 'graph', bars: 'load', when: onStrip },
    ],
    time: [
      { id: 'slow', label: '느리게', kind: 'toggle' },
      { id: 'reset', label: '처음으로', kind: 'action' },
      { id: 'step', label: '한 단계씩', kind: 'action', advanced: true },
    ],
    layers: [
      { id: 'arrows', label: '전류 화살표', kind: 'toggle', value: true, when: onBoard },
      { id: 'drift', label: '전자의 이동(모형)', kind: 'toggle', when: onBoard },
      { id: 'heat', label: (v) => (onStrip(v) ? '전선의 발열' : '저항의 발열'), kind: 'toggle', value: true },
      { id: 'numbers', label: '값', kind: 'toggle' },
      { id: 'laws', label: '키르히호프 법칙 확인', kind: 'toggle', advanced: true, when: onBoard },
    ],
    inquiry: [
      { id: 'table', label: '기록 표', kind: 'table', wide: true, rows: 8, when: onBoard, text: '전압계나 전류계를 연결해 두면, 연결하거나 값을 바꿀 때마다 한 줄씩 적힙니다. 두 계기가 같은 부품을 잴 때 저항(전압 ÷ 전류)과 소비 전력(전압 × 전류)도 적힙니다.',
        columns: [{ label: '전원', unit: 'V' }, { label: '연결', unit: 'Ω' }, { label: '전압', unit: 'V', result: true }, { label: '전류', unit: 'A', result: true },
          { label: '저항', unit: 'Ω', result: true }, { label: '소비<br>전력', unit: 'W', result: true }] },
      { id: 'law', label: '옴의 법칙과 소비 전력', kind: 'note', when: onBoard,
        text: `옴의 법칙 <i style="font-family: Georgia, serif">V = IR</i><br>소비 전력 <i style="font-family: Georgia, serif">P = VI = I</i><sup>2</sup><i style="font-family: Georgia, serif">R = V</i><sup>2</sup> ÷ <i style="font-family: Georgia, serif">R</i> (W)<br>소비된 전기 에너지 <i style="font-family: Georgia, serif">U = Pt</i> (J)<br><br>직렬연결 <i style="font-family: Georgia, serif">R = R</i><sub>1</sub> + <i style="font-family: Georgia, serif">R</i><sub>2</sub><br>병렬연결 1 ÷ <i style="font-family: Georgia, serif">R</i> = 1 ÷ <i style="font-family: Georgia, serif">R</i><sub>1</sub> + 1 ÷ <i style="font-family: Georgia, serif">R</i><sub>2</sub>` },
      { id: 'table2', label: '기록 표', kind: 'table', wide: true, rows: 8, when: onStrip, text: '멀티탭이 켜져 있을 때 기구를 켜거나 끌 때마다 한 줄씩 적힙니다. 정격 전류를 넘어 차단될 때도 적힙니다.',
        columns: [{ label: '켠 기구' }, { label: '전체<br>저항', unit: 'Ω', result: true }, { label: '전체<br>전류', unit: 'A', result: true }, { label: '전체<br>소비 전력', unit: 'W', result: true }, { label: '상태', result: true }] },
      { id: 'rating', label: '멀티탭의 허용 전력', kind: 'note', when: onStrip,
        text: `기구는 모두 병렬로 연결되어 ${MAINS} V가 걸립니다.<br>기구에 흐르는 전류 <i style="font-family: Georgia, serif">I = P</i> ÷ <i style="font-family: Georgia, serif">V</i><br>전체 전류 = 각 기구에 흐르는 전류의 합<br><br>허용 전력 = 전압 × 정격 전류<br>= ${MAINS} V × ${RATED} A = ${ALLOWED} W<br>권장: 허용 전력의 70 %인 ${ADVISED.toFixed(0)} W까지` },
      { id: 'table3', label: '전선 기록 표', kind: 'table', wide: true, rows: 8, advanced: true, when: onStrip, text: '멀티탭이 켜져 있을 때 전선의 저항이나 켠 기구가 바뀔 때마다 한 줄씩 적힙니다.',
        columns: [{ label: '전선<br>저항', unit: 'Ω' }, { label: '전체<br>전류', unit: 'A', result: true }, { label: '멀티탭<br>전압', unit: 'V', result: true }, { label: '전선의<br>발열', unit: 'W', result: true }, { label: '기구의<br>소비 전력', unit: 'W', result: true }] },
      { id: 'drop', label: '전선의 저항과 발열', kind: 'note', advanced: true, when: onStrip,
        text: `전체 전류 <i style="font-family: Georgia, serif">I</i>, 전선의 저항 <i style="font-family: Georgia, serif">r</i>일 때<br>전선에 걸리는 전압 = <i style="font-family: Georgia, serif">I</i> × <i style="font-family: Georgia, serif">r</i><br>전선의 발열 = <i style="font-family: Georgia, serif">I</i><sup>2</sup> × <i style="font-family: Georgia, serif">r</i> (W)<br>멀티탭 전압 = ${MAINS} V − <i style="font-family: Georgia, serif">I</i> × <i style="font-family: Georgia, serif">r</i><br><br>기구의 소비 전력<br>= (멀티탭 전압)<sup>2</sup> ÷ 기구의 저항` },
    ],
  },

  // writing on the chalkboard (1024 x 400)
  board(g) {
    g.fillStyle = 'rgba(255,255,255,0.9)'; g.font = '56px Georgia, serif'; g.fillText('소비 전력', 60, 96);
    // a line of italic writing; level 1: set low and small, level 2: set high and small
    const write = (parts, x, y) => {
      for (const [text, level = 0] of parts) {
        g.font = `italic ${level ? 32 : 58}px Georgia, serif`; g.fillText(text, x, y + (level === 1 ? 14 : level === 2 ? -26 : 0));
        x += g.measureText(text).width + (level ? 6 : 0);
      }
    };
    write([['V = IR']], 60, 205);
    write([['P = VI = I'], ['2', 2], ['R = V'], ['2', 2], [' / R']], 60, 318);
    // a loop with a cell and a resistor
    g.strokeStyle = 'rgba(255,255,255,0.85)'; g.lineWidth = 5; g.lineJoin = 'round';
    g.beginPath(); g.moveTo(820, 110); g.lineTo(700, 110); g.lineTo(700, 250); g.lineTo(770, 250);
    for (let k = 0; k < 6; k++) g.lineTo(782 + k * 16, k % 2 ? 268 : 232);
    g.lineTo(880, 250); g.lineTo(950, 250); g.lineTo(950, 110); g.lineTo(840, 110); g.stroke();
    g.beginPath(); g.moveTo(820, 84); g.lineTo(820, 136); g.moveTo(840, 98); g.lineTo(840, 122); g.stroke();
  },

  // Builds the apparatus on the bench (world) and returns { update(dt) }.
  create({ T, kit, world, view, ctx }) {
    const { mat, glow, add, box, cyl, canvasTexture } = kit;
    world.userData.things.visible = false;   // the board, or the strip and its appliances, take the middle of the bench
    const M = { board: mat(0x3d6b5a, { roughness: 0.9 }), copper: mat(0xc58a4f, { roughness: 0.45, metalness: 0.3 }), brass: mat(0xc9a35a, { roughness: 0.6 }), dark: mat(0x3a4057), steel: mat(0x8f96a8), wood: mat(0xd2b084) };
    const INK = { current: 0xffe066, electron: 0x9fd4ff };

    // ====================================== the circuit board ======================================
    // ---------- the board: its lines, the places, the switch, the supply ----------
    // TOP: the top of the board; RAIL: the height of the lines on it; AXIS: the height of a resistor in its place.
    // The circuit runs from the + of the supply along the far rail through the switch, place A, the block of B with its
    // branches C and E, round the right end through place D and back along the near rail. Places are 12 cm long.
    const TOP = 0.14, RAIL = TOP + 0.02, AXIS = TOP + 0.2, HALF = 0.6;
    const SPOT = { a: [-1, -1.8, 0], b: [1.6, -1.8, 0], c: [1.6, -0.7, 0], e: [1.6, 0.4, 0], d: [3.6, 0, 1] };   // the middle of each place (x, z) and whether it lies across the board
    const ends = (id) => { const [x, z, across] = SPOT[id]; return across ? [[x, z - HALF], [x, z + HALF]] : [[x - HALF, z], [x + HALF, z]]; };   // where the current comes in and where it leaves
    const rig = new T.Group(); world.add(rig);
    add(rig, box(9.2, TOP, 5.2), M.board, 0, TOP / 2, 0);
    // a flat line of copper from (x1, z1) to (x2, z2)
    function strip(parent, x1, z1, x2, z2) {
      const long = Math.hypot(x2 - x1, z2 - z1), line = add(parent, box(long + 0.09, 0.03, 0.09), M.copper, (x1 + x2) / 2, RAIL, (z1 + z2) / 2, false);
      line.rotation.y = Math.atan2(z1 - z2, x2 - x1); return line;
    }
    for (const [x1, z1, x2, z2] of [[-3.6, -0.6, -3.6, -1.8], [-3.6, -1.8, -3.0, -1.8], [-2.2, -1.8, -1.6, -1.8], [-0.4, -1.8, 1.0, -1.8], [2.2, -1.8, 3.6, -1.8], [3.6, -1.8, 3.6, -0.6],
      [3.6, 0.6, 3.6, 1.8], [3.6, 1.8, -3.6, 1.8], [-3.6, 1.8, -3.6, 0.6], [0.4, -1.8, 0.4, -0.7], [0.4, -0.7, 1.0, -0.7], [2.2, -0.7, 2.8, -0.7], [2.8, -0.7, 2.8, -1.8]]) strip(rig, x1, z1, x2, z2);
    const second = new T.Group(); rig.add(second);   // the second branch and the clips of place D: the advanced mode
    for (const [x1, z1, x2, z2] of [[0.4, -0.7, 0.4, 0.4], [0.4, 0.4, 1.0, 0.4], [2.2, 0.4, 2.8, 0.4], [2.8, 0.4, 2.8, -0.7]]) strip(second, x1, z1, x2, z2);
    // a place: a clip at each end, its letter beside it, and a plain link that closes it when it is in the line and holds no resistor
    const letter = (text, ink = '#f3eedf') => new T.MeshBasicMaterial({ transparent: true, map: canvasTexture(96, 96, (g) => { g.fillStyle = ink; g.font = '700 76px Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, 48, 52); }) });
    const places = {};
    for (const id of PLACES) {
      const [x, z, across] = SPOT[id], [from, to] = ends(id), parent = id === 'd' || id === 'e' ? second : rig;
      for (const [cx, cz] of [from, to]) add(parent, box(0.16, 0.2, 0.16), M.brass, cx, TOP + 0.1, cz);
      const tag = add(parent, new T.PlaneGeometry(0.42, 0.42), letter(NAMES[id]), across ? x - 0.42 : x, TOP + 0.004, across ? z : z + 0.36, false, false); tag.rotation.x = -Math.PI / 2;
      const link = id === 'c' || id === 'e' ? null : strip(rig, ...from, ...to);
      places[id] = { id, x, z, across, from, to, link };
    }
    // the switch: a blade hinged at its left end, which lies down to close the circuit
    add(rig, box(1.0, 0.06, 0.4), M.dark, -2.6, TOP + 0.03, -1.8);
    for (const x of [-3.0, -2.2]) add(rig, box(0.14, 0.18, 0.2), M.brass, x, TOP + 0.09, -1.8);
    const blade = new T.Group(); blade.position.set(-3.0, TOP + 0.16, -1.8); rig.add(blade);
    add(blade, box(0.9, 0.04, 0.1), M.copper, 0.42, 0, 0); add(blade, cyl(0.07, 0.07, 0.3, 12).rotateX(Math.PI / 2), mat(0xc8392f), 0.86, 0.02, 0);
    const bladeHandle = add(rig, box(1.3, 0.9, 0.8), M.dark, -2.6, TOP + 0.45, -1.8, false, false); bladeHandle.visible = false; bladeHandle.userData.grip = { kind: 'switch' };
    // the supply: its + at the far side; a knob that sets the voltage
    add(rig, box(1.0, 0.8, 1.6), mat(0x5b6b8c), -4.15, TOP + 0.4, 0);
    add(rig, box(0.02, 0.3, 0.7), glow(0xcfe9d2), -3.645, TOP + 0.5, 0, false, false);
    for (const [z, colour] of [[-0.6, 0xc8392f], [0.6, 0x2b2b2b]]) add(rig, cyl(0.07, 0.07, 0.1, 12).rotateZ(Math.PI / 2), mat(colour), -3.6, TOP + 0.2, z, false);
    const knob = add(rig, cyl(0.2, 0.2, 0.14, 24), M.dark, -4.15, TOP + 0.87, 0.35); add(knob, box(0.04, 0.02, 0.18), glow(0xf3eedf), 0, 0.075, -0.08, false, false);
    const knobHandle = add(rig, cyl(0.38, 0.38, 0.5, 12), M.dark, -4.15, TOP + 0.9, 0.35, false, false); knobHandle.visible = false; knobHandle.userData.grip = { kind: 'knob' };
    const supplySpot = new T.Vector3(-4.15, TOP + 1.1, -0.2), supplyLabel = view.label(supplySpot);   // what the supply is set to, always on show

    // ---------- resistors: one for each place, one of each value on a rack, and one for the hand ----------
    const faces = new Map();   // the value written on a resistor
    const face = (ohms) => { if (!faces.has(ohms)) faces.set(ohms, canvasTexture(160, 64, (g) => { g.fillStyle = '#f7f1df'; g.fillRect(0, 0, 160, 64); g.fillStyle = '#2b2b2b'; g.font = '700 44px Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(`${ohms} Ω`, 80, 34); })); return faces.get(ohms); };
    const COLD = new T.Color(0x000000), HOT = new T.Color(0xff4a1a);
    function resistor(grip) {
      const group = new T.Group(); rig.add(group);
      const paint = new T.MeshStandardMaterial({ color: 0xd9c7a3, roughness: 0.8 }), plate = new T.MeshBasicMaterial({ map: face(1) });
      add(group, cyl(0.15, 0.15, 0.72, 20).rotateZ(Math.PI / 2), paint, 0, 0, 0);
      for (const x of [-0.48, 0.48]) add(group, cyl(0.035, 0.035, 0.26, 8).rotateZ(Math.PI / 2), M.steel, x, 0, 0, false);
      add(group, new T.PlaneGeometry(0.5, 0.2), plate, 0, 0.152, 0, false, false).rotation.x = -Math.PI / 2;
      const handle = add(group, box(1.2, 0.6, 0.6), M.dark, 0, 0.05, 0, false, false); handle.visible = false; handle.userData.grip = grip;
      // of so many ohms, lying at (x, z), along the board or across it; glowing by how much power it uses (0 to 1)
      function set(ohms, x, z, across, warmth = 0) {
        group.position.set(x, AXIS, z); group.rotation.y = across ? -Math.PI / 2 : 0; plate.map = face(ohms);
        paint.emissive.copy(COLD).lerp(HOT, warmth);
      }
      return { group, handle, set };
    }
    const parts = Object.fromEntries(PLACES.map((id) => [id, resistor({ kind: 'part', id })]));
    add(rig, box(8.6, 0.08, 0.8), M.wood, 0, 0.04, 3.3);
    const RACK = [1, 2, 3, 4, 5, 6].map((ohms, i) => { const one = resistor({ kind: 'rack', ohms }); one.set(ohms, -3.5 + i * 1.4, 3.3, false); one.group.position.y = 0.08 + 0.15; return one; });
    const carried = resistor(null); carried.group.visible = false;

    // ---------- the meters: each stands beside the board until it is carried to a place where it belongs. The voltmeter
    // goes beside a part (or the supply) and its two leads reach to the two ends of it: side by side with what it
    // measures. The ammeter goes into the line that leads to a part: one after the other with what it measures. ----------
    const DOCK = { volt: [5.5, -0.9], amp: [5.5, 0.7] };
    function meter(kind, wide, deep, mark) {
      const group = new T.Group(); rig.add(group);
      add(group, box(wide, 0.3, deep), mat(0xf2efe9), 0, 0.15, 0); add(group, box(wide * 0.62, 0.02, deep * 0.4), glow(0x2f3a4f), -wide * 0.12, 0.31, -deep * 0.14, false, false);
      add(group, new T.PlaneGeometry(0.2, 0.2), letter(mark, '#2b2b2b'), wide * 0.33, 0.305, deep * 0.2, false, false).rotation.x = -Math.PI / 2;
      const handle = add(group, box(wide + 0.3, 0.8, deep + 0.3), M.dark, 0, 0.3, 0, false, false); handle.visible = false; handle.userData.grip = { kind };
      const spot = new T.Vector3();
      return { group, handle, spot, label: view.label(spot) };   // what it reads is written over it
    }
    const voltmeter = meter('volt', 0.8, 0.5, 'V'), ammeter = meter('amp', 0.56, 0.44, 'A');
    const leads = [0xc8392f, 0x2b2b2b].map((colour) => add(rig, box(1, 0.03, 0.03), mat(colour), 0, 0, 0, false, false));
    // where the voltmeter stands when it measures each part (behind A and B; to the right of the branches and of D; before the supply:
    // wherever what it reads, written over it, hides no part), and where the ammeter is set into the line
    const VOLT_AT = { a: [-1, -2.35], b: [1.6, -2.35], c: [3.2, -0.7], e: [3.2, 0.4], d: [4.15, 0], all: [-2.9, 0] };
    const AMP_AT = { a: [-1.9, -1.8], b: [0.7, -1.8], c: [0.7, -0.7], e: [0.7, 0.4], d: [3.6, 1.2], all: [-3.6, -1.25] };
    const SUPPLY = [[-3.6, -0.6], [-3.6, 0.6]], middle = (id) => (id === 'all' ? [-3.9, 0] : [SPOT[id][0], SPOT[id][1]]);   // the two ends of the supply; the middle of what is measured

    // ---------- marks ----------
    // the current in each stretch of the circuit: an arrow beside the line, as long as the current is strong
    const AMP = 0.3;   // the length of an arrow for 1 A
    const flows = [{ at: [-1.55, -2.05], way: [1, 0], of: 'all' }, { at: [0.5, -2.05], way: [1, 0], of: 'b' }, { at: [0.5, -0.95], way: [1, 0], of: 'c' }, { at: [0.5, 0.15], way: [1, 0], of: 'e' }, { at: [3.3, 2.05], way: [-1, 0], of: 'all' }]
      .map((one) => { const arrow = kit.arrow(INK.current, 0.04); arrow.userData.least = 0.04 * 7; rig.add(arrow); return { ...one, arrow, way3: new T.Vector3(one.way[0], 0, one.way[1]) }; });
    // The electrons in the lines (a model): they are there all along every line, and drift against the current, slowly.
    // Each stretch runs from one point to the next the way the current goes when the + is at the far side; gap: the
    // switch or the place on a branch it bridges, where there is no line while that is open.
    const STRETCHES = [['all', -3.6, -0.6, -3.6, -1.8], ['all', -3.6, -1.8, -3.0, -1.8], ['all', -3.0, -1.8, -2.2, -1.8, 'switch'], ['all', -2.2, -1.8, 0.4, -1.8], ['b', 0.4, -1.8, 2.8, -1.8],
      ['all', 2.8, -1.8, 3.6, -1.8], ['all', 3.6, -1.8, 3.6, 1.8], ['all', 3.6, 1.8, -3.6, 1.8], ['all', -3.6, 1.8, -3.6, 0.6],
      ['ce', 0.4, -1.8, 0.4, -0.7], ['c', 0.4, -0.7, 1.0, -0.7], ['c', 1.0, -0.7, 2.2, -0.7, 'c'], ['c', 2.2, -0.7, 2.8, -0.7], ['ce', 2.8, -0.7, 2.8, -1.8],
      ['e', 0.4, -0.7, 0.4, 0.4], ['e', 0.4, 0.4, 1.0, 0.4], ['e', 1.0, 0.4, 2.2, 0.4, 'e'], ['e', 2.2, 0.4, 2.8, 0.4], ['e', 2.8, 0.4, 2.8, -0.7]]
      .map(([of, x1, z1, x2, z2, gap]) => ({ of, x1, z1, x2, z2, gap, long: Math.hypot(x2 - x1, z2 - z1), shift: 0, extra: of === 'e' }));
    const EACH = 0.3, DRIFT = 0.12;   // how far apart the electrons are drawn; how fast they drift for 1 A (1.2 cm/s)
    const electrons = new T.InstancedMesh(new T.SphereGeometry(0.04, 10, 8), glow(INK.electron), STRETCHES.reduce((sum, one) => sum + Math.ceil(one.long / EACH), 0));
    electrons.frustumCulled = false; electrons.visible = false; rig.add(electrons);
    // The values of each part and of the whole, set where they hide neither a part nor a meter: behind the far rail to the
    // left of A and to the right of B, inside the corner by D, and one under another in the bare middle of the board for C, E and the whole.
    const tags = Object.fromEntries([...PLACES, 'all'].map((id) => { const spot = new T.Vector3(); return [id, { spot, label: view.label(spot, true, id === 'd' ? -0.08 : 0) }]; }));
    const TAG_AT = { a: [-2.45, TOP + 0.45, -2.0], b: [2.95, TOP + 0.45, -2.0], c: [-0.75, TOP + 0.1, 0.0], e: [-0.75, TOP + 0.1, 0.85], d: [2.2, TOP, 0.95] };
    const lawSpot = new T.Vector3(0.2, TOP, 2.2), lawLabel = view.label(lawSpot, true, -0.1);
    const tipSpot = new T.Vector3(), tip = view.label(tipSpot);   // what is being set, while something is handled

    // ---------- physics ----------
    // The supply keeps the voltage V between its ends. In the line lie A and D; between them the block of B with its
    // branches. Resistors one after another add up; side by side their reciprocals add up: R = A + D + 1 / (1/B + 1/C + 1/E).
    // (A place in the line without a resistor holds a plain link, 0 ohm; a branch without one is open.) The current is
    // I = V / R; a resistor r with the current i has the voltage i r across it and uses the power i^2 r. A plain link in B
    // takes all the current of the block. With no resistance at all in the circuit the supply cuts the current off.
    // now: the resistance of each place (null: an open branch), the whole resistance, the current I, and for each place its voltage v, current i and power p.
    const now = { r: {}, whole: 0, I: 0, cut: false, v: {}, i: {}, p: {}, block: 0, energy: 0, seconds: 0 };
    const shown = () => (ctx.advanced ? PLACES : ['a', 'b', 'c']);
    function solve() {
      const v = ctx.values, on = v.closed, r = now.r;
      r.a = v.rA; r.b = v.rB; r.c = v.cOn ? v.rC : null; r.d = ctx.advanced ? v.rD : 0; r.e = ctx.advanced && v.eOn ? v.rE : null;
      const side = ['b', 'c', 'e'].filter((id) => r[id] !== null);
      now.block = r.b === 0 ? 0 : 1 / side.reduce((sum, id) => sum + 1 / r[id], 0);
      now.whole = r.a + r.d + now.block;
      now.cut = on && now.whole === 0;
      now.I = on && !now.cut ? v.volts / now.whole : 0;
      const across = now.I * now.block;   // the voltage across the block
      for (const id of PLACES) {
        const inLine = id === 'a' || id === 'd';
        now.i[id] = inLine ? now.I : r[id] === null ? 0 : r.b === 0 ? (id === 'b' ? now.I : 0) : across / r[id];
        now.v[id] = inLine ? now.I * r[id] : across;
        now.p[id] = now.v[id] * now.i[id];
      }
      now.i.all = now.I; now.v.all = now.cut ? 0 : v.volts; now.p.all = now.v.all * now.I;
    }
    // how the resistors are joined, in ohms: "2 + 3", "2∥3", "2 + (3∥6)"
    function joined() {
      const r = now.r, side = ['b', 'c', 'e'].filter((id) => r[id] !== null).map((id) => r[id]), terms = [];
      if (r.a) terms.push(String(r.a));
      if (r.b !== 0) terms.push(side.length > 1 ? `(${side.join('∥')})` : String(side[0]));
      if (r.d) terms.push(String(r.d));
      return terms.length === 1 ? terms[0].replace(/[()]/g, '') : terms.join(' + ') || '도선';
    }

    // ---------- state ----------
    // fresh: the arrangement has changed since a line was last written; since: when it last changed (ms); grab: what is in hand
    let moved = true, stopSoon = false, fresh = false, since = 0, tipTime = 0, framed = false, grab = null, byScene = false, tried = { key: '', at: new Map() };
    function say(text, x, z, seconds = 0) { tip.write(text); tipSpot.set(x, TOP + 0.9, z); tip.show(true); tipTime = seconds; moved = true; }
    const tall = () => window.matchMedia('(max-aspect-ratio: 4/5)').matches;
    // what a place holds, as the menu has it: its value, and for a branch whether it is in
    const KEY = { a: ['rA'], b: ['rB'], c: ['rC', 'cOn'], d: ['rD'], e: ['rE', 'eOn'] };
    const held = (id) => now.r[id];
    function put(id, ohms) {   // ohms: 0 or null takes the resistor out
      const [value, on] = KEY[id];
      byScene = true;
      if (on) { if (Boolean(ohms) !== ctx.values[on]) ctx.set(on, Boolean(ohms)); if (ohms && ctx.values[value] !== ohms) ctx.set(value, ohms); } else if (ctx.values[value] !== (ohms || 0)) ctx.set(value, ohms || 0);
      byScene = false;
    }
    const locked = (id) => KEY[id].some((key) => ctx.locked.has(key));
    function reckon() {
      solve();
      const names = shown(), chart = ctx.charts.power, v = ctx.values, target = v.voltAt === 'none' ? 'all' : v.voltAt;
      chart.names = [...names.map((id) => NAMES[id]), '전체']; chart.colors = [RED, BLUE, GREEN, VIOLET, SLATE].slice(0, names.length).concat(GOLD);
      chart.set(0, [...names.map((id) => now.p[id]), now.p.all]);
      // the graph: the current in what is measured against the voltage across it, for every voltage of the supply tried with this arrangement
      const key = `${target}/${PLACES.map((id) => now.r[id])}`;
      if (key !== tried.key) { tried.key = key; tried.at.clear(); }
      if (v.closed && !now.cut) tried.at.set(v.volts, [now.v[target], now.i[target]]);
      ctx.traces.iv.clear();
      for (const [, [volt, amp]] of [...tried.at].sort((one, other) => one[0] - other[0])) ctx.traces.iv.add(volt, amp);
      fresh = true; since = performance.now(); moved = true;
    }
    // A line of the table for what the meters read, unless it is the line last written. The resistance and the power of a
    // part can be told only when both meters are on it: the voltmeter across it and the ammeter in a line that carries
    // its current (the line through A and D and the supply is all one).
    const lineOf = (id) => (id === 'a' || id === 'd' || id === 'all' ? 'line' : id);
    function note() {
      fresh = false;
      const v = ctx.values, at = v.voltAt, on = v.ampAt;
      if (at === 'none' && on === 'none') return;
      const both = at !== 'none' && on !== 'none' && lineOf(at) === lineOf(on), volt = now.v[at], amp = now.i[on];
      const row = [v.volts.toFixed(1), now.cut ? '합선' : joined(), at === 'none' ? '–' : `${NAMES[at]} ${two(volt)}`, on === 'none' ? '–' : `${NAMES[on]} ${two(amp)}`,
        both && amp > 1e-9 ? two(volt / amp) : '–', both ? two(volt * amp) : '–'];   // (without a current the resistance cannot be told from the meters)
      const rows = ctx.tables.table.rows, last = rows[rows.length - 1];
      if (!last || last.join() !== row.join()) ctx.tables.table.add(row);
    }

    // ---------- handling ----------
    // A resistor is taken from the rack, or out of its place, and let go over a place; let go elsewhere it goes back to
    // the rack. A meter is carried to a part or to the supply and joins itself there; let go elsewhere it goes back to
    // where it stands beside the board. The knob of the supply is turned by sliding it sideways; the switch is pressed.
    const ray = new T.Raycaster(), level = new T.Plane(new T.Vector3(0, 1, 0), -AXIS), hit = new T.Vector3();
    const pointer = (r) => (r.intersectPlane(level, hit) ? [hit.x, hit.z] : null);
    const nearest = (p, list, reach = 1.1) => list.map((one) => [one, Math.hypot(p[0] - one.x, p[1] - one.z)]).filter((one) => one[1] < reach).sort((one, other) => one[1] - other[1]).map((one) => one[0])[0] || null;
    // the place a meter let go at p is meant for: the nearest of those it may stand in, or of the parts themselves
    const meant = (p, places2) => [...shown(), 'all'].map((id) => [id, Math.min(Math.hypot(p[0] - places2[id][0], p[1] - places2[id][1]), Math.hypot(p[0] - middle(id)[0], p[1] - middle(id)[1]))])
      .filter((one) => one[1] < 1.1).sort((one, other) => one[1] - other[1]).map((one) => one[0])[0] || 'none';
    const boardTool = {
      handles: () => [bladeHandle, knobHandle, voltmeter.handle, ammeter.handle, ...RACK.map((one) => one.handle), ...shown().filter((id) => held(id)).map((id) => parts[id].handle)],
      start(grip, r) {
        const p = pointer(r);
        if (!p) return false;
        if (grip.kind === 'part' && locked(grip.id)) { say('잠금', SPOT[grip.id][0], SPOT[grip.id][1], 1.2); return false; }
        if (grip.kind === 'knob' && ctx.locked.has('volts')) { say('잠금', -4.15, 0.35, 1.2); return false; }
        if ((grip.kind === 'volt' && ctx.locked.has('voltAt')) || (grip.kind === 'amp' && ctx.locked.has('ampAt'))) { say('잠금', p[0], p[1], 1.2); return false; }
        grab = { ...grip, from: p, at: p, volts: ctx.values.volts, moved: false };
        if (grip.kind === 'part') { grab.ohms = held(grip.id); put(grip.id, 0); reckon(); }   // out of its place at once: the circuit is as it is without it
        if (grip.kind === 'part' || grip.kind === 'rack') grab.ohms = grab.ohms || grip.ohms;
        return true;
      },
      move(r) {
        const p = pointer(r);
        if (!p || !grab) return;
        grab.at = p; if (Math.hypot(p[0] - grab.from[0], p[1] - grab.from[1]) > 0.15) grab.moved = true;
        if (grab.kind === 'knob') {   // 3 cm sideways for each 1.5 V
          const to = Math.max(1.5, Math.min(9, grab.volts + Math.round((p[0] - grab.from[0]) / 0.3) * 1.5));
          if (to !== ctx.values.volts) ctx.set('volts', to);
          say(`${ctx.values.volts.toFixed(1)} V`, -4.15, 0.35);
        }
        moved = true;
      },
      end(done) {
        if (done.kind === 'switch') { if (!ctx.locked.has('closed')) ctx.set('closed', !ctx.values.closed); return; }
        if (done.kind === 'volt') { if (done.moved) ctx.set('voltAt', meant(done.at, VOLT_AT)); return; }
        if (done.kind === 'amp') { if (done.moved) ctx.set('ampAt', meant(done.at, AMP_AT)); return; }
        if (done.kind !== 'part' && done.kind !== 'rack') return;
        const to = nearest(done.at, shown().map((id) => ({ id, x: SPOT[id][0], z: SPOT[id][1] })));
        if (to && locked(to.id)) { say('잠금', to.x, to.z, 1.2); if (done.kind === 'part') put(done.id, done.ohms); reckon(); return; }
        if (to) { const was = held(to.id); put(to.id, done.ohms); if (done.kind === 'part' && was && to.id !== done.id) put(done.id, was); }   // what was there changes places with it
        reckon();
      },
    };
    // places D and E belong to the advanced mode: the meters come off them
    function tidy() { for (const key of ['voltAt', 'ampAt']) if (!ctx.advanced && (ctx.values[key] === 'd' || ctx.values[key] === 'e')) ctx.set(key, 'none'); }

    const way = new T.Vector3(), place = new T.Matrix4();
    function lead(mesh, x1, z1, x2, z2) {
      const long = Math.hypot(x2 - x1, z2 - z1);
      mesh.scale.x = long; mesh.position.set((x1 + x2) / 2, TOP + 0.3, (z1 + z2) / 2); mesh.rotation.y = Math.atan2(z1 - z2, x2 - x1);
    }
    function drawElectrons(dt) {
      const on = ctx.values.drift;
      let n = 0;
      electrons.visible = on;
      if (!on) return;
      for (const one of STRETCHES) {
        const amps = one.of === 'all' ? now.I : one.of === 'ce' ? now.i.c + now.i.e : now.i[one.of], count = Math.ceil(one.long / EACH);
        const here = (!one.extra || ctx.advanced) && !(one.gap === 'switch' ? !ctx.values.closed : one.gap && now.r[one.gap] === null);   // (none in the air: over an open switch, over an empty place on a branch)
        one.shift = (((one.shift - amps * DRIFT * dt) % EACH) + EACH) % EACH;   // against the current
        for (let k = 0; k < count; k++, n++) {
          const along = k * EACH + one.shift, u = along / one.long;
          place.makeTranslation(one.x1 + (one.x2 - one.x1) * u, here && along < one.long ? RAIL + 0.03 : -5, one.z1 + (one.z2 - one.z1) * u);   // (those out of use are put out of sight)
          electrons.setMatrixAt(n, place);
        }
      }
      electrons.instanceMatrix.needsUpdate = true;
    }
    function drawBoard() {
      const v = ctx.values, on = shown(), carrying = grab && (grab.kind === 'part' || grab.kind === 'rack');
      rig.visible = true; second.visible = ctx.advanced;
      if (!v.drift) electrons.visible = false;
      blade.rotation.z = v.closed ? 0 : 0.6;
      knob.rotation.y = -(v.volts - 1.5) / 7.5 * 4.2;
      supplyLabel.write(now.cut ? `<b>합선</b> · 전류를 끊음` : `전원 <b>${v.volts.toFixed(1)} V</b>`); supplyLabel.show(true);
      for (const id of PLACES) {
        const here = on.includes(id), ohms = here ? now.r[id] : 0, spot = places[id], part = parts[id];
        part.group.visible = Boolean(ohms);
        if (ohms) part.set(ohms, spot.x, spot.z, spot.across, v.heat ? Math.min(1, now.p[id] / 20) ** 0.6 : 0);   // 20 W and more: as bright as it gets
        if (spot.link) spot.link.visible = !ohms;
      }
      carried.group.visible = Boolean(carrying);
      if (carrying) { carried.set(grab.ohms, grab.at[0], grab.at[1], false); carried.group.position.y = AXIS + 0.45; }
      // The meters: in the hand, in the place where they measure, or where they stand beside the board. The leads of the
      // voltmeter go from its near side to the two ends of what it measures.
      const carriedVolt = grab && grab.kind === 'volt', carriedAmp = grab && grab.kind === 'amp';
      const vAt = carriedVolt ? null : VOLT_AT[v.voltAt], aAt = carriedAmp ? null : AMP_AT[v.ampAt], beside = v.voltAt !== 'a' && v.voltAt !== 'b';   // beside: it stands to the right of what it measures, turned to face it
      const vPlace = carriedVolt ? grab.at : vAt || DOCK.volt, aPlace = carriedAmp ? grab.at : aAt || DOCK.amp;
      voltmeter.group.position.set(vPlace[0], carriedVolt ? TOP + 0.45 : vAt ? TOP : 0, vPlace[1]);
      ammeter.group.position.set(aPlace[0], carriedAmp ? TOP + 0.45 : aAt ? TOP : 0, aPlace[1]);
      voltmeter.group.rotation.y = vAt && beside ? Math.PI / 2 : 0;
      ammeter.group.rotation.y = aAt && (v.ampAt === 'd' || v.ampAt === 'all') ? Math.PI / 2 : 0;   // along the line it is set into
      for (const one of leads) one.visible = Boolean(vAt);
      if (vAt) {
        const [from, to] = v.voltAt === 'all' ? SUPPLY : ends(v.voltAt);
        if (beside) { lead(leads[0], vAt[0] - 0.25, vAt[1] - 0.2, ...from); lead(leads[1], vAt[0] - 0.25, vAt[1] + 0.2, ...to); }
        else { lead(leads[0], vAt[0] - 0.3, vAt[1] + 0.25, ...from); lead(leads[1], vAt[0] + 0.3, vAt[1] + 0.25, ...to); }
      }
      voltmeter.spot.copy(voltmeter.group.position).y += 0.5; ammeter.spot.copy(ammeter.group.position).y += 0.5;
      voltmeter.label.show(true); ammeter.label.show(true);
      voltmeter.label.write(vAt ? `<b>${two(now.v[v.voltAt])} V</b>` : '전압계'); ammeter.label.write(aAt ? `<b>${two(now.i[v.ampAt])} A</b>` : '전류계');
      // the arrows of the current
      for (const one of flows) {
        const amps = now.i[one.of] || 0, long = AMP * amps, least = one.arrow.userData.least;
        one.arrow.visible = v.arrows && amps > 1e-6 && (one.of !== 'e' || ctx.advanced);
        if (!one.arrow.visible) continue;
        one.arrow.setLength(Math.max(long, least)); one.arrow.scale.y = Math.min(1, long / least);   // one too short for its head is flattened along its length
        one.arrow.position.set(one.at[0], RAIL + 0.1, one.at[1]); one.arrow.aim(way.copy(one.way3));
      }
      // the values
      for (const key of [...PLACES, 'all']) tags[key].label.show(false);
      if (v.numbers) {
        const narrow = tall();   // an upright screen has no room for a tag at every part: they are written in one block with the whole
        if (!narrow) for (const key of on) if (now.r[key]) {
          tags[key].spot.set(...TAG_AT[key]);
          tags[key].label.write(`<b>${NAMES[key]}</b> ${now.r[key]} ${OHM} · <b>${two(now.p[key])} W</b><br>${two(now.v[key])} V · ${two(now.i[key])} A`); tags[key].label.show(true);
        }
        // the whole: in the bare middle of the board. On an upright screen each part's power comes first, a short line each
        // (its voltage and current are read from the meters), and the block stands lower, clear of the supply.
        tags.all.spot.set(narrow ? 0.6 : -1.6, TOP + 0.1, narrow ? 1.55 : 1.7);
        const spent = now.seconds > 0 ? `<br>${now.seconds.toFixed(1)}초 동안${narrow ? '<br>' : ' '}소비된 전기 에너지 ${now.energy.toFixed(1)} J` : '';
        tags.all.label.write(narrow
          ? `${on.filter((key) => now.r[key]).map((key) => `<b>${NAMES[key]}</b> ${now.r[key]} ${OHM} · <b>${two(now.p[key])} W</b><br>`).join('')}전체 저항 ${now.cut ? '0' : two(now.whole)} ${OHM}<br>전체 전류 ${two(now.I)} A<br>전체 소비 전력 <b>${two(now.p.all)} W</b>${spent}`
          : `전체 저항 ${now.cut ? '0' : two(now.whole)} ${OHM} · 전체 전류 ${two(now.I)} A<br>전체 소비 전력 <b>${two(now.p.all)} W</b>${spent}`);
        tags.all.label.show(true);
      }
      // Kirchhoff's laws: what comes to the first junction goes on from it; the voltages round the loop through B add up to that of the supply
      lawLabel.show(ctx.advanced && v.laws);
      if (ctx.advanced && v.laws) {
        const side = ['b', 'c', 'e'].filter((key) => now.r[key] !== null), drops = v.closed ? [['A', now.v.a], ['B', now.v.b], ['D', now.v.d]].filter((one) => one[1] > 1e-9) : [['스위치', now.v.all]];   // (open, the switch has the whole voltage across it)
        lawLabel.write(`분기점: 들어온 전류 ${two(now.I)} A = 나간 전류 ${side.map((key) => two(now.i[key])).join(' + ')} A<br>닫힌 회로: 전원 ${two(now.v.all)} V = ${drops.map((one) => `${one[0]} ${two(one[1])}`).join(' + ') || '0'} V`);
      }
    }

    // ====================================== the power strip ======================================
    // A strip of six sockets lies at the near side of the bench, its cord in an outlet at the left; six appliances stand
    // behind it, each with its plug lying before it. STRIP: where the strip lies and how high it is; SOCKETS: where its
    // sockets are along it; ROW: where the appliances stand; HOME: where a plug lies when it is out; PLUG: half the height of a plug.
    const rig2 = new T.Group(); world.add(rig2);
    const PALE = mat(0xf2efe9), STRIP = { x: -0.1, z: 1.9, top: 0.28 }, SOCKETS = [0, 1, 2, 3, 4, 5].map((k) => -1.6 + 0.8 * k), ROW = -1.3, HOME = 0.45, PLUG = 0.11;
    add(rig2, box(5.6, STRIP.top, 0.62), PALE, STRIP.x, STRIP.top / 2, STRIP.z);
    for (const x of SOCKETS) {
      add(rig2, cyl(0.2, 0.2, 0.012, 24), mat(0xd9d4c8), x, STRIP.top + 0.006, STRIP.z, false);
      for (const side of [-0.08, 0.08]) add(rig2, cyl(0.028, 0.028, 0.014, 8), M.dark, x + side, STRIP.top + 0.008, STRIP.z, false, false);
    }
    // its switch, which is also what cuts it off: a rocker, lit while the strip is on
    const rockerPaint = new T.MeshBasicMaterial({ color: 0xff6a4a }), rocker = add(rig2, box(0.36, 0.1, 0.3), rockerPaint, -2.5, STRIP.top + 0.03, STRIP.z, false);
    const rockerHandle = add(rig2, box(0.8, 0.7, 0.9), M.dark, -2.5, STRIP.top + 0.2, STRIP.z, false, false); rockerHandle.visible = false; rockerHandle.userData.grip = { kind: 'mains' };
    // a row of lamps along its near edge, one for each ampere it carries: green as far as the 70 % that is advised, amber beyond
    const GAUGE = Array.from({ length: RATED }, (unused, k) => { const paint = new T.MeshBasicMaterial({ color: 0x3a4057 }); add(rig2, box(0.22, 0.03, 0.07), paint, -1.95 + 0.3 * k, STRIP.top + 0.012, STRIP.z + 0.265, false, false); return paint; });
    // the outlet: a post at the left end of the bench with the plug of the strip in it
    add(rig2, box(0.3, 1.0, 0.9), mat(0xe4dccb), -4.6, 0.5, STRIP.z); add(rig2, box(0.03, 0.5, 0.5), PALE, -4.44, 0.55, STRIP.z, false);
    add(rig2, cyl(0.15, 0.15, 0.2, 16).rotateZ(Math.PI / 2), M.dark, -4.33, 0.55, STRIP.z);
    const outletSpot = new T.Vector3(-4.6, 1.1, STRIP.z), outletLabel = view.label(outletSpot);
    // A cord: a string of short links from one point to another, lying on the bench between them. Its paint glows with
    // the heat of the current in it.
    const LINK = cyl(0.03, 0.03, 1, 6).rotateZ(Math.PI / 2), ALONG = new T.Vector3(1, 0, 0), lowest = new T.Vector3(), p0 = new T.Vector3(), p1 = new T.Vector3();
    function cord(thick = 1) {
      const paint = new T.MeshStandardMaterial({ color: 0x3a4057, roughness: 0.9 });
      const links = Array.from({ length: 12 }, () => { const link = add(rig2, LINK, paint, 0, 0, 0, false); link.scale.set(1, thick, thick); return link; });
      const at = (out, a, b, u) => out.copy(a).multiplyScalar((1 - u) * (1 - u)).addScaledVector(lowest, 2 * u * (1 - u)).addScaledVector(b, u * u);
      function lay(a, b) {
        lowest.copy(a).add(b).multiplyScalar(0.5); lowest.y = 0.03 * thick;
        links.forEach((link, k) => {
          at(p0, a, b, k / links.length); at(p1, a, b, (k + 1) / links.length);
          link.position.copy(p0).add(p1).multiplyScalar(0.5); link.scale.x = p0.distanceTo(p1) + 0.02; link.quaternion.setFromUnitVectors(ALONG, p1.sub(p0).normalize());
        });
      }
      return { paint, lay };
    }
    const mainCord = cord(1.5); mainCord.lay(new T.Vector3(-4.23, 0.55, STRIP.z), new T.Vector3(-2.9, 0.14, STRIP.z));

    // ---------- the appliances: each is built about the point where it stands, and has a face that lights up while it runs ----------
    const lit = (dark) => new T.MeshBasicMaterial({ color: dark });
    const BUILD = {
      uLamp(g) {
        const bulb = lit(0x8d8a80), pool = new T.MeshBasicMaterial({ color: 0xfff1b8, transparent: true, opacity: 0.4, depthWrite: false });
        add(g, cyl(0.3, 0.32, 0.06, 24), M.dark, 0, 0.03, 0); add(g, cyl(0.025, 0.025, 0.95, 8), M.steel, -0.1, 0.5, 0).rotation.z = -0.2;
        add(g, cyl(0.1, 0.3, 0.26, 24), mat(0x4f6f8f), 0, 1.02, 0); add(g, new T.SphereGeometry(0.1, 16, 12), bulb, 0, 0.92, 0, false, false);
        const light = add(g, new T.CircleGeometry(0.55, 28), pool, 0, 0.012, 0, false, false); light.rotation.x = -Math.PI / 2;   // its light on the bench
        return { top: 1.2, set(on) { bulb.color.setHex(on ? 0xfff3c4 : 0x8d8a80); light.visible = on; } };
      },
      uFan(g) {
        const blades = new T.Group(); blades.position.set(0, 0.8, 0.05); g.add(blades);
        add(g, cyl(0.3, 0.34, 0.08, 24), PALE, 0, 0.04, 0); add(g, cyl(0.04, 0.04, 0.62, 10), PALE, 0, 0.39, -0.08);
        add(g, cyl(0.13, 0.13, 0.26, 16).rotateX(Math.PI / 2), PALE, 0, 0.8, -0.1);
        for (const z of [0, 0.1]) add(g, new T.TorusGeometry(0.42, 0.018, 8, 32), M.steel, 0, 0.8, z, false);
        for (let k = 0; k < 3; k++) { const arm = new T.Group(); arm.rotation.z = k * Math.PI * 2 / 3; blades.add(arm); add(arm, box(0.3, 0.14, 0.015), mat(0x7fa6c9), 0.2, 0, 0, false).rotation.x = 0.35; }
        return { top: 1.3, blades, set() {} };   // (its blades turn while it runs: see live)
      },
      uTv(g) {
        const screen = lit(0x1c2233);
        add(g, box(0.6, 0.04, 0.3), M.dark, 0, 0.02, 0); add(g, box(0.08, 0.22, 0.06), M.dark, 0, 0.15, 0); add(g, box(1.3, 0.76, 0.06), M.dark, 0, 0.64, 0);
        add(g, new T.PlaneGeometry(1.2, 0.66), screen, 0, 0.64, 0.032, false, false);
        return { top: 1.07, set(on) { screen.color.setHex(on ? 0x9fc7e8 : 0x1c2233); } };
      },
      uCooker(g) {
        const lamp = lit(0x5a2a25);
        add(g, cyl(0.42, 0.4, 0.46, 28), PALE, 0, 0.23, 0);
        add(g, new T.SphereGeometry(0.42, 28, 12, 0, Math.PI * 2, 0, Math.PI / 2), mat(0xc9685c), 0, 0.46, 0).scale.y = 0.4;
        add(g, box(0.3, 0.05, 0.1), M.dark, 0, 0.64, 0); add(g, box(0.2, 0.1, 0.02), lamp, 0, 0.26, 0.415, false, false);
        return { top: 0.72, set(on) { lamp.color.setHex(on ? 0xff5a3c : 0x5a2a25); } };
      },
      uDryer(g) {
        const mouth = lit(0x4a3030), shell = mat(0xb9778a);
        add(g, cyl(0.2, 0.22, 0.05, 20), M.dark, 0, 0.025, 0); add(g, cyl(0.07, 0.08, 0.5, 12), shell, 0, 0.3, 0);
        add(g, cyl(0.15, 0.17, 0.62, 20).rotateZ(Math.PI / 2), shell, 0.05, 0.64, 0);
        add(g, new T.CircleGeometry(0.14, 20), mouth, 0.362, 0.64, 0, false, false).rotation.y = Math.PI / 2;
        return { top: 0.9, set(on) { mouth.color.setHex(on ? 0xff8a3c : 0x4a3030); } };
      },
      uHeater(g) {
        const bars = lit(0x8a8f9c);
        add(g, box(1.0, 0.86, 0.3), mat(0x59607a), 0, 0.5, 0);
        for (const x of [-0.35, 0.35]) add(g, box(0.16, 0.07, 0.5), M.dark, x, 0.035, 0);
        add(g, new T.PlaneGeometry(0.84, 0.68), mat(0xcfd3da), 0, 0.5, 0.152, false);
        for (const y of [0.3, 0.5, 0.7]) add(g, cyl(0.035, 0.035, 0.76, 10).rotateZ(Math.PI / 2), bars, 0, y, 0.2, false, false);
        return { top: 1.0, set(on) { bars.color.setHex(on ? 0xff6a2a : 0x8a8f9c); } };
      },
    };
    // an appliance with its plug and its cord; out: where the cord leaves it; spot: where its name is written
    const units = UNITS.map((unit, k) => {
      const x = -4 + 1.6 * k, group = new T.Group(); group.position.set(x, 0, ROW); rig2.add(group);
      const body = BUILD[unit.id](group);
      const handle = add(group, box(1.3, body.top, 0.9), M.dark, 0, body.top / 2, 0, false, false); handle.visible = false; handle.userData.grip = { kind: 'unit', k };
      const plug = new T.Group(); rig2.add(plug); add(plug, cyl(0.15, 0.15, 2 * PLUG, 16), M.dark, 0, 0, 0);
      const plugHandle = add(plug, box(0.62, 0.7, 0.62), M.dark, 0, 0.1, 0, false, false); plugHandle.visible = false; plugHandle.userData.grip = { kind: 'plug', k };
      const spot = new T.Vector3(x, body.top + 0.08, ROW);
      return { ...body, x, group, handle, plug, plugHandle, line: cord(), out: new T.Vector3(x, 0.05, ROW + 0.5), end: new T.Vector3(), spot, label: view.label(spot, true) };
    });
    const stripSpot = new T.Vector3(STRIP.x, 0, STRIP.z + 0.7), stripLabel = view.label(stripSpot, true, -0.05);   // what the strip carries, always on show
    const sumSpot = new T.Vector3(), sumLabel = view.label(sumSpot, true);

    // ---------- physics ----------
    // Every appliance has the 220 V of the mains across it, whatever the others do: it takes I = P / V. The strip and its
    // cord carry the sum. With more than the 16 A it is rated for, the strip cuts itself off and stays off until its
    // switch is pressed again.
    // Advanced: the cord of the strip, of resistance r, is in series with the appliances, each of which keeps the
    // resistance V^2 / P it has at 220 V. With the current I0 they would take at 220 V, the current is I = I0 / (1 + r I0 / V),
    // the strip has V - I r, and an appliance takes its share of the current and the square of that share of its power.
    // sock: the socket each plug is in (-1: out). live: which appliances have their plugs in and are switched on, the
    // current they ask for together, the current I and the power P that flow from the outlet, the share of the 220 V
    // that reaches the strip, the heat of the cord, and the current the strip was cut off at (0: it was not).
    const sock = UNITS.map(() => -1), live = { on: UNITS.map(() => false), asked: 0, I: 0, P: 0, share: 1, lost: 0, cutAt: 0, energy: 0, seconds: 0 };
    const wire = () => (ctx.advanced ? ctx.values.wire : 0);
    const inWatts = (value) => value.toFixed(value < 99.95 ? 1 : 0);   // the heat of the cord is small beside what the appliances use
    const freeSocket = (x) => SOCKETS.map((sx, s) => [s, Math.abs(sx - x)]).filter((one) => !sock.includes(one[0])).sort((one, other) => one[1] - other[1]).map((one) => one[0])[0];
    // the names of those that run, for the table: three to a line, so that the table stays narrow enough for a phone
    const running = () => UNITS.filter((unit, k) => live.on[k]).map((unit) => unit.short || unit.name).map((name, i, all) => name + (i === all.length - 1 ? '' : i % 3 === 2 ? ',<br>' : ', ')).join('') || '없음';
    function setUnit(k, state) { byScene = true; if (ctx.values[UNITS[k].id] !== state) ctx.set(UNITS[k].id, state); byScene = false; }
    function reckonStrip() {
      UNITS.forEach((unit, k) => { live.on[k] = sock[k] >= 0 && ctx.values[unit.id] === 'on'; });
      const full = UNITS.reduce((sum, unit, k) => sum + (live.on[k] ? unit.watts : 0), 0) / MAINS, r = wire();
      live.asked = full / (1 + r * full / MAINS);
      fresh = true;
      if (ctx.values.mains && live.asked > RATED + 1e-9) {   // more than it is rated for: it cuts itself off, and that is written down at once
        live.cutAt = live.asked;
        ctx.tables.table2.add([running(), inOhms(MAINS / live.asked), two(live.asked), (live.asked * MAINS).toFixed(0), '차단']);
        byScene = true; ctx.set('mains', false); byScene = false;
        stopSoon = true; fresh = false;
      } else if (ctx.values.mains) live.cutAt = 0;
      live.I = ctx.values.mains ? live.asked : 0; live.P = live.I * MAINS; live.lost = live.I * live.I * r; live.share = 1 - live.I * r / MAINS;
      // a bar for each appliance that runs (six never run together), in the advanced mode one for the cord, and one for the whole
      const runs = UNITS.map((unit, k) => k).filter((k) => live.on[k] && ctx.values.mains), chart = ctx.charts.load, cordBar = ctx.advanced ? [live.lost] : [];
      chart.names = [...runs.map((k) => UNITS[k].short || UNITS[k].name), ...cordBar.map(() => '전선'), '전체']; chart.colors = [...runs.map((k) => SHADES[k]), ...cordBar.map(() => '#d9d4c8'), GOLD];
      chart.set(0, [...runs.map((k) => UNITS[k].watts * live.share ** 2), ...cordBar, live.P]);
      since = performance.now(); moved = true;
    }
    // a line of the table for what is running, unless it is the line last written (nothing is written while the strip is off)
    function noteStrip() {
      fresh = false;
      if (!ctx.values.mains) return;
      const row = [running(), live.I > 0 ? inOhms(MAINS / live.I) : '–', two(live.I), live.P.toFixed(0), live.P > ADVISED + 1e-6 ? '권장 초과' : '권장 이내'];
      const rows = ctx.tables.table2.rows, last = rows[rows.length - 1];
      if (!last || last.join() !== row.join()) ctx.tables.table2.add(row);
      if (!ctx.advanced) return;
      const row3 = [two(wire()), two(live.I), (MAINS * live.share).toFixed(1), inWatts(live.lost), (live.P - live.lost).toFixed(0)], rows3 = ctx.tables.table3.rows, last3 = rows3[rows3.length - 1];
      if (!last3 || last3.join() !== row3.join()) ctx.tables.table3.add(row3);
    }

    // ---------- handling ----------
    // A plug is carried to the strip and goes into the free socket nearest to where it is let go, and the appliance
    // runs; let go elsewhere it lies before its appliance again. An appliance is pressed to switch it off and on; so is
    // the switch of the strip.
    const level2 = new T.Plane(new T.Vector3(0, 1, 0), -(STRIP.top + PLUG));
    const pointer2 = (r) => (r.intersectPlane(level2, hit) ? [hit.x, hit.z] : null);
    const overStrip = (p) => Math.abs(p[1] - STRIP.z) < 0.9 && p[0] > SOCKETS[0] - 0.8 && p[0] < SOCKETS[5] + 0.8;
    const stripTool = {
      handles: () => [rockerHandle, ...units.map((one) => one.plugHandle), ...units.map((one) => one.handle)],
      start(grip, r) {
        const p = pointer2(r), id = grip.kind === 'mains' ? 'mains' : UNITS[grip.k].id;
        if (!p) return false;
        if (ctx.locked.has(id)) { say('잠금', p[0], p[1], 1.2); return false; }
        grab = { ...grip, from: p, at: p, moved: false };
        if (grip.kind === 'plug') { grab.was = [sock[grip.k], ctx.values[id]]; if (sock[grip.k] >= 0) { sock[grip.k] = -1; setUnit(grip.k, 'out'); reckonStrip(); } }   // out of its socket at once
        return true;
      },
      move(r) {
        const p = pointer2(r);
        if (!p || !grab) return;
        grab.at = p; if (Math.hypot(p[0] - grab.from[0], p[1] - grab.from[1]) > 0.15) grab.moved = true;
        moved = true;
      },
      end(done) {
        const k = done.k;
        if (done.kind === 'mains') { ctx.set('mains', !ctx.values.mains); return; }
        if (done.kind === 'unit') {   // its own switch; it cannot run with its plug out
          if (sock[k] < 0) say('플러그를 꽂으세요', units[k].x, HOME, 1.5); else { setUnit(k, ctx.values[UNITS[k].id] === 'on' ? 'off' : 'on'); reckonStrip(); }
          return;
        }
        if (!done.moved) { sock[k] = done.was[0]; setUnit(k, done.was[1]); }   // only pressed: it stays as it was
        else if (overStrip(done.at)) { sock[k] = freeSocket(done.at[0]); setUnit(k, 'on'); }
        reckonStrip();
      },
    };
    function drawStrip() {
      const v = ctx.values, narrow = tall(), warm = (amps) => (v.heat ? Math.min(1, (amps / RATED) ** 2) : 0);   // the heat in a cord goes as the square of its current; at 16 A it is as bright as it gets
      const deep = ctx.advanced, volts = MAINS * live.share;
      rig2.visible = true;
      rocker.rotation.z = v.mains ? -0.22 : 0.22; rockerPaint.color.setHex(v.mains ? 0xff6a4a : 0x6b2a25);
      GAUGE.forEach((paint, k) => paint.color.setHex(live.I > k + 1e-9 ? (k < Math.floor(0.7 * RATED) ? 0x5fd38a : 0xf2b23e) : 0x3a4057));
      mainCord.paint.emissive.copy(COLD).lerp(HOT, deep ? (v.heat ? Math.min(1, live.lost / (RATED * RATED * 0.2)) : 0) : warm(live.I));   // (advanced: as I^2 r; with 0.2 Ω it glows as it does in the basic mode)
      units.forEach((one, k) => {
        const unit = UNITS[k], runs = live.on[k] && v.mains, amps = runs ? unit.watts / MAINS * live.share : 0, carried = grab && grab.kind === 'plug' && grab.k === k;
        if (carried) one.plug.position.set(grab.at[0], STRIP.top + PLUG + 0.36, grab.at[1]);
        else if (sock[k] >= 0) one.plug.position.set(SOCKETS[sock[k]], STRIP.top + PLUG, STRIP.z);
        else one.plug.position.set(one.x, PLUG, HOME);
        one.line.lay(one.out, one.end.copy(one.plug.position).setY(one.plug.position.y + PLUG));
        one.line.paint.emissive.copy(COLD).lerp(HOT, warm(amps));
        one.set(runs);
        // On an upright screen the bench is seen from its end: the appliances turn to face that way, and their names stand beside them, not over them.
        one.group.rotation.y = narrow ? Math.PI / 2 : 0;
        one.spot.set(one.x, narrow ? 0.3 : one.top + 0.08, narrow ? ROW - 1.5 : ROW);
        one.label.write(`${unit.name}<br>${deep && !narrow ? `${MAINS} V에서 ` : ''}<b>${unit.watts} W</b>${v.numbers && !narrow ? `<br>${two(amps)} A · ${inOhms(MAINS * MAINS / unit.watts)} ${OHM}${deep && runs ? `<br>소비 전력 ${(amps * volts).toFixed(0)} W` : ''}` : ''}`); one.label.show(true);
      });
      outletLabel.write(`콘센트 <b>${MAINS} V</b>`); outletLabel.show(true);
      // What the strip carries, before it; with the values, those of the whole at its right end. An upright screen has room
      // for one block only, at the near end of the bench: there the values follow in it, those of each appliance that runs first.
      const spent = live.seconds > 0 ? `<br>${live.seconds.toFixed(1)}초 동안 소비된 전기 에너지 ${live.energy.toFixed(0)} J` : '';
      const whole = narrow ? `전체 저항 ${live.I > 0 ? inOhms(MAINS / live.I) : '–'} ${OHM} · 전체 소비 전력 <b>${live.P.toFixed(0)} W</b>${spent}`
        : `전체 저항 ${live.I > 0 ? inOhms(MAINS / live.I) : '–'} ${OHM} · 전체 전류 ${two(live.I)} A<br>전체 소비 전력 <b>${live.P.toFixed(0)} W</b> (허용 전력 ${ALLOWED} W)${deep ? `<br>= 전선 ${inWatts(live.lost)} W + 기구 ${(live.P - live.lost).toFixed(0)} W` : ''}${spent}`;
      const each = UNITS.filter((unit, k) => live.on[k] && v.mains).map((unit) => `<b>${unit.short || unit.name}</b> ${two(unit.watts / MAINS * live.share)} A · ${deep ? `${(unit.watts * live.share ** 2).toFixed(0)} W` : `${inOhms(MAINS * MAINS / unit.watts)} ${OHM}`}<br>`).join('');
      stripSpot.set(narrow ? 5.0 : STRIP.x, 0, narrow ? -0.3 : STRIP.z + 0.7);
      stripLabel.write((!v.mains ? (live.cutAt ? `<b>차단됨</b> · 전체 전류 ${two(live.cutAt)} A가${narrow ? '<br>' : ' '}정격 ${RATED} A를 넘음` : '멀티탭 꺼짐')
        : `전체 전류 <b>${two(live.I)} A</b> / 정격 ${RATED} A${deep ? `<br>멀티탭 전압 <b>${volts.toFixed(1)} V</b> · 전선의 발열 <b>${inWatts(live.lost)} W</b>` : ''}${live.P > ADVISED + 1e-6 ? `<br>허용 전력의 70 %(${ADVISED.toFixed(0)} W)를 넘음` : ''}`) + (narrow && v.numbers ? `<br>${each}${whole}` : ''));
      stripLabel.show(true);
      sumLabel.show(v.numbers && !narrow);
      if (v.numbers && !narrow) { sumSpot.set(4.3, 0.1, STRIP.z - 0.2); sumLabel.write(whole); }
    }

    // ====================================== both arrangements ======================================
    // ids: what of the menu belongs to the arrangement; keep: its switches, which the frame turns off when it puts them
    // away with the other arrangement on show, and kept: how they stood, to set them so again; look: from where it is seen
    // on a wide screen and on an upright one (from one end, so that the long side of the bench runs up the screen).
    const boardScene = { rig, ...boardTool,
      ids: ['volts', 'closed', 'rA', 'rB', 'cOn', 'rC', 'rD', 'eOn', 'rE', 'voltAt', 'ampAt'], keep: ['cOn', 'eOn', 'arrows', 'drift', 'laws'], kept: { cOn: false, eOn: false, arrows: true, drift: false, laws: false },
      look: [{ target: [0.6, 0.2, 0.7], r: 12.5, theta: 0, phi: 0.72 }, { target: [1.2, 0.2, 0.35], r: 18, theta: Math.PI / 2, phi: 0.6 }],
      enter() { tidy(); reckon(); fresh = false; },
      leave() { rig.visible = false; for (const one of [supplyLabel, voltmeter.label, ammeter.label, lawLabel, ...Object.values(tags).map((tag) => tag.label)]) one.show(false); },
      changed(id, value) { if (id === 'closed' && !value) stopSoon = true; reckon(); },   // the switch opened: the clock stops with it
      play() { if (!ctx.values.closed) ctx.set('closed', true); },   // the clock counts while the circuit is closed
      tick(dt) { if (!ctx.values.closed) ctx.set('closed', true); now.seconds += dt; now.energy += now.p.all * dt; },   // (one step at a time closes it as well)
      mode() { reckon(); },
      live(dt) { if (!ctx.values.drift || !(now.I > 0 || moved)) return false; drawElectrons(dt * (ctx.values.slow ? 0.25 : 1)); return true; },   // the electrons never rest while there is a current
      note, draw: drawBoard,
    };
    const stripScene = { rig: rig2, ...stripTool,
      ids: ['mains', 'wire', ...UNITS.map((unit) => unit.id)], keep: ['mains'], kept: { mains: true },
      look: [{ target: [-0.2, 0.4, 0.5], r: 10.5, theta: 0, phi: 0.95 }, { target: [3.1, 0.3, -0.3], r: 18, theta: Math.PI / 2, phi: 0.7 }],
      enter() { reckonStrip(); fresh = false; },
      leave() { rig2.visible = false; for (const one of [outletLabel, stripLabel, sumLabel, ...units.map((unit) => unit.label)]) one.show(false); },
      changed(id, value) {
        const k = UNITS.findIndex((unit) => unit.id === id);
        if (k >= 0) { if (value === 'out') sock[k] = -1; else if (sock[k] < 0) sock[k] = sock.includes(k) ? freeSocket(units[k].x) : k; }   // from the menu: into the socket of its own number, or the free one nearest to the appliance
        reckonStrip();
      },
      tick(dt) { live.seconds += dt; live.energy += live.P * dt; },
      mode() { reckonStrip(); },   // the resistance of the cord counts in the advanced mode only
      live(dt) { if (!live.on[1] || !ctx.values.mains) return false; units[1].blades.rotation.z -= dt * 14 * (ctx.values.slow ? 0.25 : 1); return true; },   // the fan turns while it runs
      note: noteStrip, draw: drawStrip,
    };
    const SCENES = { board: boardScene, strip: stripScene }, scene = () => SCENES[ctx.values.scene];
    const frame = () => view.look(scene().look[tall() ? 1 : 0]);
    view.setTool({
      pick(r) {
        ray.ray.copy(r); scene().rig.updateMatrixWorld(true);
        const found = ray.intersectObjects(scene().handles(), false)[0];
        return found ? found.object.userData.grip : null;
      },
      cursor: (grip) => (!grip ? '' : grip.kind === 'switch' || grip.kind === 'mains' || grip.kind === 'unit' ? 'pointer' : 'grab'),
      start: (grip, r) => scene().start(grip, r),
      move(r) { scene().move(r); },
      end() {
        const done = grab;
        grab = null; tip.show(false); tipTime = 0; moved = true;
        if (done) scene().end(done);
      },
    });
    ctx.on('play', (on) => { if (on && scene().play) scene().play(); });
    ctx.on('tick', (t, dt) => {
      if (!dt || stopSoon) return;
      scene().tick(dt); moved = true;
    });
    ctx.on('action', (id) => { if (id === 'reset') { now.seconds = now.energy = live.seconds = live.energy = 0; moved = true; } });
    ctx.on('change', (id, value) => {
      const at = scene();
      moved = true;
      if (id === 'scene') {   // the other arrangement: its switches as they were left, the clock at nought
        for (const one of Object.values(SCENES)) if (one !== at) one.leave();
        for (const key of at.keep) if (ctx.values[key] !== at.kept[key]) ctx.set(key, at.kept[key]);
        at.enter(); frame();
        ctx.emit('action', 'reset');
        return;
      }
      if (at.keep.includes(id)) at.kept[id] = value;
      if (byScene || !at.ids.includes(id)) return;   // set from the scene: what follows is done there
      at.changed(id, value);
    });
    ctx.on('mode', () => { tidy(); if (scene().mode) scene().mode(); moved = true; });

    stripScene.leave(); reckon(); fresh = false;
    return {
      state: () => ({ scene: ctx.values.scene, r: { ...now.r }, whole: now.whole, I: now.I, cut: now.cut, v: { ...now.v }, i: { ...now.i }, p: { ...now.p }, energy: now.energy, seconds: now.seconds, joined: joined(),
        strip: { sock: [...sock], on: [...live.on], asked: live.asked, I: live.I, P: live.P, volts: MAINS * live.share, lost: live.lost, cutAt: live.cutAt, energy: live.energy, seconds: live.seconds } }),
      update(dt) {
        if (!framed) { framed = true; if (tall()) frame(); }
        if (stopSoon) { stopSoon = false; ctx.setPlaying(false); }
        if (tipTime > 0) { tipTime -= dt; if (tipTime <= 0) { tip.show(false); moved = true; } }
        if (fresh && !grab && performance.now() - since >= 500) scene().note();
        if (scene().live(dt)) moved = true;
        if (!moved) return false;
        moved = false; scene().draw();
        return true;
      },
    };
  },
};
