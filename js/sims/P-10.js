// P-10 Capacitors (3D).
//
// Charging and discharging: a supply, a capacitor of two parallel plates, a resistor, a light-emitting diode and a
// switch with three places, after the textbook's figures. With the switch on the side of the supply, the supply
// moves electrons from one plate round to the other until the voltage between the plates is that of the supply
// (charging); with the switch open the charge stays; with the switch on the side of the diode the electrons go back
// through it and it lights up while they do (discharging). The charge on the plates is drawn as signs on them, 25 μC
// a sign; the current as an arrow beside the lines, as long as it is strong.
// Advanced: the resistance of the circuit and the capacitance are set, the voltage and the current are drawn against
// time, the time the charge takes to change by 63 % is measured (the time constant R C), and what the supply has
// done, what the capacitor holds and what the resistor has used up are compared.
//
// The gap and the area: two square plates joined to a supply of 100 V. One plate is carried along the axis (the gap,
// 1 cm to 5 cm), the other is slid sideways (the area that faces the other plate), and a corner is pulled to make both
// larger or smaller (10 cm to 30 cm a side). The charge is C V with C = ε0 A / d: drawn as signs on the faces, 0.1 nC a
// sign, and as lines of the field, one from each sign, so that they stand as close as the field is strong.
// Advanced: the voltage of the supply is set, the supply is taken off (the charge then stays and the voltage changes),
// and a slab of a dielectric fills the gap (C is κ times as large; the charges on its faces end part of the lines).
//
// Uses: a key of a keyboard and a condenser microphone, each a pair of plates joined to a supply through a
// galvanometer. While the key is held down its upper plate comes nearer to the lower one, the charge grows and a
// current flows for as long as the gap is changing; let go, the charge goes back the other way. In the microphone
// the air moved by a sound carries the thin plate to and fro, and the current follows it: drawn far slower than a
// real sound, so that it can be watched. Advanced: the time the key takes to go down.
//
// What is set by hand can be set from the menu as well, over the same ranges and in the same steps.
// One unit of the scene is 10 cm. In the circuit charges are in μC, capacitances in μF, resistances in kΩ, currents in
// mA, energies in μJ; between the plates of the second arrangement charges are in nC, capacitances in pF, energies in nJ.
// The key is drawn 5 times its size (one unit: 2 mm), with charges in pC and currents in pA; the microphone has its gap
// drawn 12000 times its size (0.6 units: 50 μm), with charges in nC and currents in nA.
const GOLD = '#e3c26b', RED = '#e58373', BLUE = '#7fa6e6';
const MU = '<span style="font-family: Georgia, serif">μ</span>', OHM = '<span style="font-family: Georgia, serif">Ω</span>';   // the Korean face draws Greek letters full width
const two = (value) => value.toFixed(2), whole = (value) => value.toFixed(0);
const SIGN = 25;   // the charge one sign on a plate stands for in the circuit (μC)
const GRAIN = 0.1;   // and between the plates of the second arrangement (nC)
const KAPPA = { teflon: 2.1, paper: 3.5, glass: 4.7 }, STUFF = { teflon: '테플론', paper: '종이', glass: '유리' };   // the dielectric constants of what the slab may be made of
const onCircuit = (values) => values.scene === 'circuit', onGap = (values) => values.scene === 'gap', onUse = (values) => values.scene === 'use';   // which arrangement an item of a menu belongs to
const onKey = (values) => onUse(values) && values.device === 'key', onMic = (values) => onUse(values) && values.device === 'mic';
const one = (value) => value.toFixed(1);
const SQ = 'cm<sup>2</sup>';

export default {
  // what is taken for granted, written on screen by the frame
  premise: (v, advanced) => (onCircuit(v) ? '전원과 도선의 저항은 없고, 발광 다이오드는 흐르는 전류의 세기만큼 밝아진다고 봅니다'
    : onKey(v) ? '극판 사이의 전기장은 균일하다고 봅니다' : onMic(v) ? '극판 사이의 전기장은 균일하다고 보고, 소리의 진동은 실제보다 훨씬 느리게 나타냈습니다'
    : advanced ? '극판 사이의 전기장은 균일하고, 유전체는 극판 사이를 빈틈없이 채운다고 봅니다' : '극판 사이의 전기장은 균일하다고 봅니다'),
  fixedViews: ['front', 'top'],
  camera: { target: [0, 0.7, -0.1], r: 10.5, theta: 0, phi: 0.92, rMax: 30 },
  stepTime: 0.05,                 // "one step at a time" moves on by this many seconds
  traces: {
    q: { window: 20, range: 300, read: (q) => `${whole(q)} μC` },   // the charge on the plates against time
    v: { window: 20, range: 3, read: (v) => `${two(v)} V` }, i: { window: 20, range: 0.3, read: (i) => `${two(i)} mA` },   // the voltage between the plates; the current (+: charging)
    // the second arrangement: the charge against the gap (cm) and against the facing area (cm²), and the voltage against the gap, for the values tried: not against time
    // the uses: the gap of the key (mm), its charge (pC) and the current (pA); how far the thin plate of the microphone is from where it rests (μm), how far its charge is from what it holds at rest (nC) and the current (nA)
    kd: { window: 8, range: 2, read: (d) => `${two(d)} mm` }, kq: { window: 8, range: 6, read: (q) => `${two(q)} pC` }, ki: { window: 8, range: 30, read: (i) => `${one(i)} pA` },
    mx: { window: 6, range: 10, read: (x) => `${one(x)} μm` }, mq: { window: 6, range: 0.5, read: (q) => `${two(q)} nC` }, mi: { window: 6, range: 3, read: (i) => `${one(i)} nA` },
    qd: { window: 100, range: 2, read: (q) => `${two(q)} nC` }, qa: { window: 2000, range: 2, read: (q) => `${two(q)} nC` }, vd: { window: 100, range: 100, read: (v) => `${whole(v)} V` },
  },
  charts: {
    energy: { names: ['전원이 한 일', '축전기', '저항'], colors: [GOLD, BLUE, RED], groups: ['μJ'], signed: false, range: 100, read: (e) => whole(e) },
  },
  menus: {
    vars: [
      { id: 'scene', label: '장면 선택', kind: 'choice', value: 'circuit', options: [{ id: 'circuit', label: '충전과 방전' }, { id: 'gap', label: '간격과 넓이' }, { id: 'use', label: '키보드와 마이크' }] },
      { id: 'throw', label: '스위치', kind: 'choice', value: 'open', options: [{ id: 'a', label: '전원 쪽' }, { id: 'open', label: '열림' }, { id: 'b', label: 'LED 쪽' }], when: onCircuit },
      { id: 'volts', label: '전원의 전압', kind: 'slider', min: 1.5, max: 6, step: 1.5, value: 3, digits: 1, unit: ' V', when: onCircuit },
      { id: 'ohms', label: '저항', kind: 'slider', min: 5, max: 20, step: 5, value: 10, unit: ' kΩ', advanced: true, when: onCircuit },
      { id: 'farads', label: '전기 용량', kind: 'slider', min: 50, max: 200, step: 50, value: 100, unit: ' μF', advanced: true, when: onCircuit },
      // the gap and the area
      { id: 'gap', label: '극판 사이의 간격', kind: 'slider', min: 1, max: 5, step: 0.1, value: 2, digits: 1, unit: ' cm', when: onGap },
      { id: 'side', label: '극판 한 변의 길이', kind: 'slider', min: 10, max: 30, step: 1, value: 20, unit: ' cm', when: onGap },
      { id: 'shift', label: '극판을 옆으로 민 거리', kind: 'slider', min: 0, max: 15, step: 1, value: 0, unit: ' cm', when: onGap },
      { id: 'volts2', label: '전원의 전압', kind: 'slider', min: 50, max: 200, step: 50, value: 100, unit: ' V', advanced: true, when: onGap },
      { id: 'cut', label: '전원 떼기', kind: 'toggle', advanced: true, when: onGap },
      { id: 'stuff', label: '유전체의 종류 (유전 상수)', kind: 'choice', value: 'paper', options: Object.keys(KAPPA).map((id) => ({ id, label: `${STUFF[id]} (${KAPPA[id].toFixed(1)})` })), advanced: true, when: onGap },
      { id: 'filled', label: '유전체 끼우기', kind: 'toggle', advanced: true, when: onGap },
      // the uses
      { id: 'device', label: '기구', kind: 'choice', value: 'key', options: [{ id: 'key', label: '키보드의 키' }, { id: 'mic', label: '콘덴서 마이크' }], when: onUse },
      { id: 'pressed', label: '키 누르기', kind: 'toggle', when: onKey },
      { id: 'travel', label: '키를 누르는 시간', kind: 'slider', min: 0.1, max: 0.5, step: 0.1, value: 0.3, digits: 1, unit: ' s', advanced: true, when: onKey },
      { id: 'loud', label: '소리의 세기', kind: 'slider', min: 1, max: 3, step: 1, value: 2, unit: ' 단계', when: onMic },
      { id: 'pitch', label: '소리의 진동수', kind: 'slider', min: 0.5, max: 2, step: 0.5, value: 1, digits: 1, unit: ' Hz', when: onMic },
    ],
    graph: [
      { id: 'chargeTime', label: '전하량–시간', kind: 'graph', x: '시간', plots: [{ y: '전하량', trace: 'q' }], when: onCircuit },
      { id: 'voltCurrent', label: '전압·전류–시간', kind: 'graph', x: '시간', advanced: true, plots: [{ y: '전압', trace: 'v' }, { y: '전류', trace: 'i' }], when: onCircuit },
      { id: 'energyBars', label: '에너지 막대', kind: 'graph', bars: 'energy', advanced: true, when: onCircuit },
      { id: 'chargeGap', label: '전하량–간격', kind: 'graph', x: '간격', xUnit: 'cm', span: [0, 5], plots: [{ y: '전하량', trace: 'qd', dots: true }], when: onGap },
      { id: 'chargeArea', label: '전하량–넓이', kind: 'graph', x: '마주 보는 넓이', xUnit: 'cm²', span: [0, 900], plots: [{ y: '전하량', trace: 'qa', dots: true }], when: onGap },
      { id: 'keyCharge', label: '간격·전하량–시간', kind: 'graph', x: '시간', plots: [{ y: '간격', trace: 'kd' }, { y: '전하량', trace: 'kq' }], when: onKey },
      { id: 'keyCurrent', label: '전류–시간', kind: 'graph', x: '시간', plots: [{ y: '전류', trace: 'ki' }], when: onKey },
      { id: 'micCharge', label: '진동판·전하량–시간', kind: 'graph', x: '시간', plots: [{ y: '진동판이 움직인 거리', trace: 'mx' }, { y: '전하량의 변화', trace: 'mq' }], when: onMic },
      { id: 'micCurrent', label: '전류–시간', kind: 'graph', x: '시간', plots: [{ y: '전류', trace: 'mi' }], when: onMic },
      { id: 'voltGap', label: '전압–간격', kind: 'graph', x: '간격', xUnit: 'cm', span: [0, 5], plots: [{ y: '전압', trace: 'vd', dots: true }], advanced: true, when: onGap },
    ],
    time: [
      { id: 'slow', label: '느리게', kind: 'toggle', when: (v) => !onGap(v) },
      { id: 'reset', label: '처음으로', kind: 'action' },
      { id: 'step', label: '한 단계씩', kind: 'action', advanced: true, when: (v) => !onGap(v) },
    ],
    layers: [
      { id: 'charges', label: '전하', kind: 'toggle', value: true },
      { id: 'arrows', label: '전류 화살표', kind: 'toggle', value: true, when: (v) => !onGap(v) },
      { id: 'drift', label: '전자의 이동(모형)', kind: 'toggle', when: onCircuit },
      { id: 'field', label: '전기장', kind: 'toggle', when: onCircuit },
      { id: 'lines', label: '전기장 선(모형)', kind: 'toggle', when: onGap },
      { id: 'numbers', label: '값', kind: 'toggle' },
    ],
    inquiry: [
      { id: 'table', label: '기록 표', kind: 'table', wide: true, rows: 8, when: onCircuit, text: '충전이나 방전이 끝나거나 도중에 멈출 때마다 한 줄씩 적힙니다.',
        columns: [{ label: '과정', result: true }, { label: '전원', unit: 'V' }, { label: '저항', unit: 'kΩ', advanced: true }, { label: '전기<br>용량', unit: 'μF', advanced: true },
          { label: '처음<br>전하량', unit: 'μC', result: true }, { label: '나중<br>전하량', unit: 'μC', result: true }, { label: '63 % 변하는<br>시간', unit: 's', result: true, advanced: true }] },
      { id: 'law', label: '전기 용량과 시간 상수', kind: 'note', advanced: true, when: onCircuit,
        text: `전하량 <i style="font-family: Georgia, serif">Q = CV</i><br>저장된 전기 에너지 <i style="font-family: Georgia, serif">U</i> = ½<i style="font-family: Georgia, serif">QV</i><br><br>시간 상수 = <i style="font-family: Georgia, serif">RC</i><br>충전이나 방전을 시작하고 <i style="font-family: Georgia, serif">RC</i>만큼 지나면 전하량이 63 % 변합니다.` },
      { id: 'table2', label: '기록 표', kind: 'table', wide: true, rows: 8, when: onGap, text: '극판을 옮기거나 값을 바꿀 때마다 한 줄씩 적힙니다.',
        columns: [{ label: '한 변', unit: 'cm' }, { label: '마주 보는<br>넓이', unit: 'cm²' }, { label: '간격', unit: 'cm' }, { label: '전압', unit: 'V' }, { label: '유전<br>상수', advanced: true },
          { label: '전기<br>용량', unit: 'pF', result: true, advanced: true }, { label: '전하량', unit: 'nC', result: true }] },
      { id: 'table3', label: '기록 표', kind: 'table', wide: true, rows: 8, when: onKey, text: '키를 누르거나 뗄 때마다 한 줄씩 적힙니다.',
        columns: [{ label: '동작', result: true }, { label: '처음<br>간격', unit: 'mm' }, { label: '나중<br>간격', unit: 'mm' }, { label: '처음<br>전하량', unit: 'pC', result: true }, { label: '나중<br>전하량', unit: 'pC', result: true },
          { label: '걸린<br>시간', unit: 's', advanced: true }, { label: '가장 센<br>전류', unit: 'pA', result: true, advanced: true }] },
      { id: 'table4', label: '기록 표', kind: 'table', wide: true, rows: 8, when: onMic, text: '소리를 틀거나 세기·진동수를 바꾸면, 한 번 진동하는 동안 잰 값이 한 줄 적힙니다.',
        columns: [{ label: '소리의<br>세기', unit: '단계' }, { label: '진동수', unit: 'Hz' }, { label: '간격이<br>변하는 폭', unit: 'μm', result: true }, { label: '전하량이<br>변하는 폭', unit: 'nC', result: true }, { label: '가장 센<br>전류', unit: 'nA', result: true }] },
      { id: 'law3', label: '전하량의 변화와 전류', kind: 'note', advanced: true, when: onUse,
        text: `전류 <i style="font-family: Georgia, serif">I</i> = 전하량의 변화 ÷ 걸린 시간<br><br>전원에 연결된 축전기는 간격이 줄면 전기 용량이 커져 전하량이 늘어납니다. 전하량이 변하는 동안에만 전류가 흐르고, 같은 전하량이 더 짧은 시간에 이동하면 전류가 더 셉니다.` },
      { id: 'law2', label: '평행판 축전기의 전기 용량', kind: 'note', advanced: true, when: onGap,
        text: `전기 용량 <i style="font-family: Georgia, serif">C</i> = <span style="font-family: Georgia, serif">ε<sub>0</sub></span><i style="font-family: Georgia, serif">A</i> ÷ <i style="font-family: Georgia, serif">d</i><br>(<span style="font-family: Georgia, serif">ε<sub>0</sub></span> = 8.85 × 10<sup>−12</sup> F/m, <i style="font-family: Georgia, serif">A</i>: 마주 보는 넓이, <i style="font-family: Georgia, serif">d</i>: 간격)<br>유전체를 채우면 <i style="font-family: Georgia, serif">C</i> = <span style="font-family: Georgia, serif">κε<sub>0</sub></span><i style="font-family: Georgia, serif">A</i> ÷ <i style="font-family: Georgia, serif">d</i> (<span style="font-family: Georgia, serif">κ</span>: 유전 상수)<br>전하량 <i style="font-family: Georgia, serif">Q = CV</i><br><br>전원을 떼면 전하량이 변하지 않으므로, 간격이나 넓이를 바꾸면 전압이 변합니다.` },
    ],
  },

  // writing on the chalkboard (1024 x 400)
  board(g) {
    g.fillStyle = 'rgba(255,255,255,0.9)'; g.font = '56px Georgia, serif'; g.fillText('축전기의 활용', 60, 96);
    // a loop with a cell, a switch and a capacitor
    g.strokeStyle = 'rgba(255,255,255,0.85)'; g.lineWidth = 5; g.lineJoin = 'round';
    g.beginPath(); g.moveTo(385, 180); g.lineTo(200, 180); g.lineTo(200, 330); g.lineTo(380, 330); g.moveTo(400, 330); g.lineTo(600, 330); g.lineTo(600, 180); g.lineTo(405, 180); g.stroke();
    g.beginPath(); g.moveTo(385, 140); g.lineTo(385, 220); g.moveTo(405, 140); g.lineTo(405, 220); g.stroke();   // the plates
    g.beginPath(); g.moveTo(380, 300); g.lineTo(380, 360); g.moveTo(400, 315); g.lineTo(400, 345); g.stroke();   // the cell
    g.font = '34px Georgia, serif'; g.fillText('+', 340, 296); g.fillText('−', 412, 296); g.fillText('+', 346, 150); g.fillText('−', 420, 150);
  },

  // Builds the apparatus on the bench (world) and returns { update(dt) }.
  create({ T, kit, world, view, ctx }) {
    const { mat, glow, add, box, cyl, canvasTexture } = kit;
    world.userData.things.visible = false;   // the board takes the middle of the bench
    const M = { board: mat(0x3d6b5a, { roughness: 0.9 }), copper: mat(0xc58a4f, { roughness: 0.45, metalness: 0.3 }), brass: mat(0xc9a35a, { roughness: 0.6 }), dark: mat(0x3a4057), steel: mat(0x8f96a8), pale: mat(0xf2efe9) };
    const INK = { current: 0xffe066, electron: 0x9fd4ff, field: 0x7fcf9f };

    // ====================================== charging and discharging ======================================
    // ---------- the board and what stands on it ----------
    // TOP: the top of the board; RAIL: the height of the lines on it.
    // The capacitor stands at the far side, turned half way towards the viewer so that the faces of its plates are seen:
    // the left one, nearer, is joined to the + of the supply. From the left plate a line runs round the left end of the board to the supply in the middle row and to the
    // diode in the near row; each of those ends at a post, A and B. From the right plate a line runs round the right end
    // through the resistor to the pivot of the switch, whose blade reaches to A, to B, or stands between them.
    const TOP = 0.14, RAIL = TOP + 0.02;
    const FAR = -1.4, MID = 0.6, NEAR = 1.9, LEFT = -3.4, RIGHT = 3.2;   // the far line, the row of the supply, the row of the diode; the two ends
    const POST = { a: [2.1, MID], b: [2.1, NEAR] }, PIVOT = [RIGHT, (MID + NEAR) / 2], REACH = Math.hypot(RIGHT - POST.a[0], PIVOT[1] - MID);
    const PLATE = { x: 0.75, wide: 2.0, tall: 1.8, low: TOP + 0.2, turn: Math.PI / 4 };   // the plates: how far each is from the middle, how wide and tall, the height of their lower edge, how far the capacitor is turned
    const FOOT = [PLATE.x * Math.cos(PLATE.turn), PLATE.x * Math.sin(PLATE.turn)];   // where the right plate stands: so far to the right of the middle and so far behind the far line (the left one: the other way)
    const rig = new T.Group(); world.add(rig);
    add(rig, box(8.6, TOP, 5.0), M.board, 0, TOP / 2, 0.2);
    // a flat line of copper from (x1, z1) to (x2, z2)
    function strip(x1, z1, x2, z2) {
      const long = Math.hypot(x2 - x1, z2 - z1), line = add(rig, box(long + 0.09, 0.03, 0.09), M.copper, (x1 + x2) / 2, RAIL, (z1 + z2) / 2, false);
      line.rotation.y = Math.atan2(z1 - z2, x2 - x1); return line;
    }
    for (const [x1, z1, x2, z2] of [[-FOOT[0], FAR + FOOT[1], -FOOT[0], FAR], [-FOOT[0], FAR, LEFT, FAR], [LEFT, FAR, LEFT, NEAR], [LEFT, MID, -2.3, MID], [-0.9, MID, POST.a[0], MID], [LEFT, NEAR, -0.75, NEAR], [-0.25, NEAR, POST.b[0], NEAR],
      [FOOT[0], FAR - FOOT[1], FOOT[0], FAR], [FOOT[0], FAR, RIGHT, FAR], [RIGHT, FAR, RIGHT, -0.8], [RIGHT, 0, RIGHT, PIVOT[1]]]) strip(x1, z1, x2, z2);
    // the capacitor: two plates on feet, clear enough for the signs on them to be seen from any side
    const plateGlass = new T.MeshStandardMaterial({ color: 0x8fb3cf, roughness: 0.35, metalness: 0.2, transparent: true, opacity: 0.6, depthWrite: false });
    const cap = new T.Group(); cap.position.set(0, 0, FAR); cap.rotation.y = PLATE.turn; rig.add(cap);
    for (const side of [-1, 1]) {
      add(cap, box(0.08, PLATE.tall, PLATE.wide), plateGlass, side * PLATE.x, PLATE.low + PLATE.tall / 2, 0, false, false);
      add(cap, box(0.16, PLATE.low - TOP, 0.3), M.pale, side * PLATE.x, (TOP + PLATE.low) / 2, 0);
    }
    // the signs on the plates: + on the left one, − on the right one, in an order that keeps them spread over the plate
    const signPicture = (plus) => canvasTexture(64, 64, (g) => {
      g.fillStyle = '#ffffff'; g.fillRect(8, 22, 48, 20); if (plus) g.fillRect(22, 8, 20, 48);   // a pale edge, so that it stands out on the plate
      g.fillStyle = plus ? '#d8402f' : '#2a5fd0'; g.fillRect(12, 26, 40, 12); if (plus) g.fillRect(26, 12, 12, 40);
    });
    const pictures = [signPicture(true), signPicture(false)];
    const SIGNS = 48, COLS = 6, ROWS = 8, paintPlus = new T.SpriteMaterial({ depthTest: false, map: pictures[0] }), paintMinus = new T.SpriteMaterial({ depthTest: false, map: pictures[1] });
    const signs = [-1, 1].map((side) => Array.from({ length: SIGNS }, (unused, k) => {
      const cell = (k * 29 + 7) % SIGNS, sprite = new T.Sprite(side < 0 ? paintPlus : paintMinus);
      sprite.scale.set(0.25, 0.25, 1); sprite.renderOrder = 11; sprite.visible = false;
      sprite.position.set(side * (PLATE.x - 0.06), PLATE.low + PLATE.tall * ((Math.floor(cell / COLS) + 0.5) / ROWS), PLATE.wide * (((cell % COLS) + 0.5) / COLS - 0.5));
      cap.add(sprite); return sprite;
    }));
    // the supply: its + at the left; a knob that sets the voltage
    const SUPPLY = { x: -1.6, wide: 1.4, tall: 0.7 };
    add(rig, box(SUPPLY.wide, SUPPLY.tall, 1.0), mat(0x5b6b8c), SUPPLY.x, TOP + SUPPLY.tall / 2, MID);
    add(rig, box(0.6, 0.02, 0.3), glow(0xcfe9d2), SUPPLY.x - 0.25, TOP + SUPPLY.tall + 0.01, MID - 0.2, false, false);
    for (const [side, colour] of [[-1, 0xc8392f], [1, 0x2b2b2b]]) add(rig, cyl(0.07, 0.07, 0.1, 12).rotateZ(Math.PI / 2), mat(colour), SUPPLY.x + side * (SUPPLY.wide / 2 + 0.04), TOP + 0.2, MID, false);
    const KNOB = [SUPPLY.x + 0.4, MID + 0.2];
    const knob = add(rig, cyl(0.18, 0.18, 0.14, 24), M.dark, KNOB[0], TOP + SUPPLY.tall + 0.07, KNOB[1]); add(knob, box(0.04, 0.02, 0.16), glow(0xf3eedf), 0, 0.075, -0.07, false, false);
    const knobHandle = add(rig, cyl(0.4, 0.4, 0.5, 12), M.dark, KNOB[0], TOP + SUPPLY.tall + 0.1, KNOB[1], false, false); knobHandle.visible = false; knobHandle.userData.grip = { kind: 'knob' };
    const supplySpot = new T.Vector3(SUPPLY.x, TOP + SUPPLY.tall + 0.35, MID - 0.3), supplyLabel = view.label(supplySpot);   // what the supply is set to, always on show
    // the resistor, across the right end, with its value written on it
    const faces = new Map(), facePaint = new T.MeshBasicMaterial();
    const face = (kilohms) => { if (!faces.has(kilohms)) faces.set(kilohms, canvasTexture(192, 64, (g) => { g.fillStyle = '#f7f1df'; g.fillRect(0, 0, 192, 64); g.fillStyle = '#2b2b2b'; g.font = '700 40px Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(`${kilohms} kΩ`, 96, 34); })); return faces.get(kilohms); };
    const resistor = new T.Group(); resistor.position.set(RIGHT, TOP + 0.2, -0.4); resistor.rotation.y = Math.PI / 2; rig.add(resistor);
    add(resistor, cyl(0.15, 0.15, 0.6, 20).rotateZ(Math.PI / 2), mat(0xd9c7a3, { roughness: 0.8 }), 0, 0, 0);
    for (const x of [-0.36, 0.36]) add(resistor, cyl(0.035, 0.035, 0.14, 8).rotateZ(Math.PI / 2), M.steel, x, 0, 0, false);
    add(resistor, new T.PlaneGeometry(0.54, 0.18), facePaint, 0, 0.152, 0, false, false).rotation.x = -Math.PI / 2;
    for (const z of [-0.8, 0]) add(rig, box(0.16, 0.2, 0.16), M.brass, RIGHT, TOP + 0.1, z);
    // the diode: a small dome on two legs; it lets the current through from left to right, and glows with it
    const LED = [-0.5, NEAR];
    const ledPaint = new T.MeshStandardMaterial({ color: 0xb8433a, roughness: 0.35, emissive: 0x000000 }), ledGlow = new T.SpriteMaterial({ depthWrite: false, transparent: true, opacity: 0, map: canvasTexture(128, 128, (g) => {
      const fade = g.createRadialGradient(64, 64, 4, 64, 64, 62); fade.addColorStop(0, 'rgba(255,170,140,1)'); fade.addColorStop(1, 'rgba(255,90,60,0)'); g.fillStyle = fade; g.fillRect(0, 0, 128, 128);
    }) });
    add(rig, cyl(0.16, 0.16, 0.2, 20), ledPaint, LED[0], TOP + 0.32, LED[1]); add(rig, new T.SphereGeometry(0.16, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), ledPaint, LED[0], TOP + 0.42, LED[1]);
    add(rig, cyl(0.19, 0.19, 0.04, 20), ledPaint, LED[0], TOP + 0.22, LED[1]);
    for (const side of [-0.25, 0.25]) { add(rig, box(0.16, 0.2, 0.16), M.brass, LED[0] + side, TOP + 0.1, LED[1]); add(rig, box(0.2, 0.03, 0.04), M.steel, LED[0] + side * 0.6, TOP + 0.2, LED[1], false); }
    const halo = new T.Sprite(ledGlow); halo.scale.set(1.5, 1.5, 1); halo.position.set(LED[0], TOP + 0.45, LED[1]); halo.renderOrder = 9; rig.add(halo);
    const ledSpot = new T.Vector3(LED[0], TOP + 0.05, LED[1] + 0.45), ledLabel = view.label(ledSpot, false, -0.04);
    // the switch: a blade hinged at the right, which reaches to post A (the supply), to post B (the diode), or stands between them
    add(rig, box(1.6, 0.06, 1.9), M.dark, (POST.a[0] + RIGHT) / 2, TOP + 0.03, PIVOT[1]);
    for (const [x, z] of [POST.a, POST.b, PIVOT]) add(rig, box(0.16, 0.2, 0.16), M.brass, x, TOP + 0.1, z);
    const blade = new T.Group(); blade.position.set(PIVOT[0], TOP + 0.23, PIVOT[1]); rig.add(blade);
    add(blade, box(REACH + 0.1, 0.04, 0.1), M.copper, -REACH / 2, 0, 0); add(blade, cyl(0.08, 0.08, 0.3, 12), mat(0xc8392f), -REACH * 0.62, 0.16, 0);
    const bladeHandle = add(rig, box(1.9, 0.9, 2.1), M.dark, (POST.a[0] + RIGHT) / 2, TOP + 0.45, PIVOT[1], false, false); bladeHandle.visible = false; bladeHandle.userData.grip = { kind: 'throw' };
    const ANGLE = { a: -Math.atan2(PIVOT[1] - MID, RIGHT - POST.a[0]), open: 0, b: Math.atan2(PIVOT[1] - MID, RIGHT - POST.a[0]) };   // how far the blade is turned about the upright (its tip to the far side for A)

    // ---------- marks ----------
    // the current: an arrow beside the far line on each side of the capacitor and one beside the row in use, as long as the current is strong
    const AMP = 2;   // the length of an arrow for 1 mA
    const flows = [{ at: [-2.0, FAR - 0.3], way: 1 }, { at: [1.9, FAR - 0.3], way: 1 }, { at: [0.6, MID - 0.3], way: -1, on: 'a' }, { at: [1.0, NEAR + 0.3], way: -1, on: 'b' }]
      .map((one) => { const arrow = kit.arrow(INK.current, 0.04); arrow.userData.least = 0.04 * 7; arrow.visible = false; rig.add(arrow); return { ...one, arrow }; });
    // the field between the plates: arrows from the + plate towards the − plate, as long as the voltage is high (the plates stay where they are)
    const FIELD = 0.22;   // the length of an arrow for 1 V
    const fields = [0.5, 1.3].flatMap((y) => [-0.6, 0, 0.6].map((z) => { const arrow = kit.arrow(INK.field, 0.03); arrow.userData.least = 0.03 * 7; arrow.visible = false; arrow.position.set(-PLATE.x + 0.06, PLATE.low + y, z); cap.add(arrow); return arrow; }));
    // The electrons in the lines (a model): they are there all along every line and move only while the plates are being
    // charged or discharged, as far as the charge that has passed. Each stretch is given the way the electrons go while
    // charging; of: whose charge moves them (q: what is on the plates; in: what has come through the supply; out: what
    // has gone through the diode, against the way given); on: the place of the switch that makes the stretch.
    const STRETCHES = [['q', -FOOT[0], FAR + FOOT[1], -FOOT[0], FAR], ['q', -FOOT[0], FAR, LEFT, FAR], ['q', LEFT, FAR, LEFT, MID], ['out', LEFT, MID, LEFT, NEAR], ['in', LEFT, MID, POST.a[0], MID], ['in', ...POST.a, ...PIVOT, 'a'],
      ['out', LEFT, NEAR, POST.b[0], NEAR], ['out', ...POST.b, ...PIVOT, 'b'], ['q', ...PIVOT, RIGHT, FAR], ['q', RIGHT, FAR, FOOT[0], FAR], ['q', FOOT[0], FAR, FOOT[0], FAR - FOOT[1]]]
      .map(([of, x1, z1, x2, z2, on]) => ({ of, x1, z1, x2, z2, on, long: Math.hypot(x2 - x1, z2 - z1) }));
    const EACH = 0.3, DRIFT = 0.005;   // how far apart the electrons are drawn; how far they move for 1 μC
    const electrons = new T.InstancedMesh(new T.SphereGeometry(0.04, 10, 8), glow(INK.electron), STRETCHES.reduce((sum, one) => sum + Math.ceil(one.long / EACH), 0));
    electrons.frustumCulled = false; electrons.visible = false; rig.add(electrons);
    const capSpot = new T.Vector3(), capLabel = view.label(capSpot, true);   // how the capacitor stands, always on show: beside it, where it hides neither plate
    const tipSpot = new T.Vector3(), tip = view.label(tipSpot);   // what is being set, while something is handled

    // ---------- physics ----------
    // The capacitor of capacitance C holds the charge q with the voltage q / C between its plates. Through the
    // resistance R it is joined to the supply of voltage V (the current is (V - q / C) / R and q goes towards C V) or
    // to the diode (the current is q / C / R and q goes towards 0): either way what is left to go falls off as
    // exp(-t / (R C)). The supply does the work V dq; the capacitor holds q^2 / (2 C); the rest is used up in the resistance.
    // run: the charge q, the current I (+: charging), the charge that has come through the supply and gone through the
    // diode, the work done and the energy used up; what: the change under way { kind, from, to, time, mark (when 63 % of it was done) }.
    const run = { q: 0, I: 0, in: 0, out: 0, work: 0, heat: 0, ever: false, what: null };
    const ohms = () => (ctx.advanced ? ctx.values.ohms : 10), farads = () => (ctx.advanced ? ctx.values.farads : 100);
    const goal = () => (ctx.values.throw === 'a' ? farads() * ctx.values.volts : ctx.values.throw === 'b' ? 0 : run.q);
    const current = () => (ctx.values.throw === 'a' ? (ctx.values.volts - run.q / farads()) / ohms() : ctx.values.throw === 'b' ? -run.q / farads() / ohms() : 0);
    // fresh: the second arrangement has changed since a line of its table was last written; since: when it last changed (ms)
    let moved = true, stopSoon = false, tipTime = 0, framed = false, grab = null, byScene = false, last = 'b', fresh = false, since = 0;
    function say(text, x, y, z, seconds = 0) { tip.write(text); tipSpot.set(x, y, z); tip.show(true); tipTime = seconds; moved = true; }
    const tall = () => window.matchMedia('(max-aspect-ratio: 4/5)').matches;
    function chart() { ctx.charts.energy.set(0, [run.work, run.q * run.q / (2 * farads()), run.heat]); }
    // the change under way is over, finished or not: a line of the table for it
    function close() {
      const what = run.what;
      run.what = null;
      if (!what || Math.abs(run.q - what.from) < 0.5) return;
      ctx.tables.table.add([what.kind, what.side === 'b' ? '–' : what.volts.toFixed(1), whole(what.ohms), whole(what.farads), whole(what.from), whole(run.q), what.mark === null ? '–' : two(what.mark)]);
    }
    // the switch, the supply or the resistor was set anew: what was under way is over, and what is to come begins
    function begin() {
      close();
      const to = goal();
      run.I = current();
      if (Math.abs(to - run.q) >= 0.5) {
        run.what = { kind: to > run.q ? '충전' : '방전', side: ctx.values.throw, from: run.q, to, time: 0, mark: null, volts: ctx.values.volts, ohms: ohms(), farads: farads() };
        run.ever = true; stopSoon = false; ctx.setPlaying(true);
      } else { run.q = to; run.I = 0; stopSoon = true; }
      moved = true;
    }
    function advance(t, dt) {
      const what = run.what, C = farads(), tau = ohms() * C / 1000, to = goal(), before = run.q;
      if (!what) { stopSoon = true; return; }   // nothing is under way: the clock stops
      const left = (before - to) / (what.from - what.to);   // how much of the change was still to come (1 at its start)
      run.q = to + (before - to) * Math.exp(-dt / tau); what.time += dt;
      if (what.mark === null && Math.abs(run.q - to) <= Math.abs(what.from - what.to) / Math.E) what.mark = what.time - dt + tau * Math.log(Math.abs(left) * Math.E);   // 63 % done, somewhere within this step
      const done = Math.abs(run.q - to) < 0.002 * Math.abs(what.from - what.to) + 0.01;
      if (done) run.q = to;
      const gain = run.q - before, stored = (run.q * run.q - before * before) / (2 * C);
      if (ctx.values.throw === 'a') { run.in += gain; run.work += ctx.values.volts * gain; run.heat += ctx.values.volts * gain - stored; } else { run.out -= gain; run.heat -= stored; }
      run.I = done ? 0 : current();
      ctx.traces.q.add(t, run.q); ctx.traces.v.add(t, run.q / C); ctx.traces.i.add(t, run.I);
      chart();
      if (done) { close(); stopSoon = true; }
    }
    function toStart() {
      run.q = run.I = run.in = run.out = run.work = run.heat = 0; run.ever = false; run.what = null; last = 'b';
      for (const id of ['q', 'v', 'i']) ctx.traces[id].clear();
      byScene = true; if (ctx.values.throw !== 'open') ctx.set('throw', 'open'); byScene = false;
      chart(); moved = true;
    }

    // ---------- handling ----------
    // The blade of the switch is carried to a post, or pressed: pressed, it goes from where it stands to the middle,
    // and from the middle to the post it was not on last. The knob of the supply is turned by sliding it sideways.
    const ray = new T.Raycaster(), level = new T.Plane(new T.Vector3(0, 1, 0), -(TOP + 0.23)), hit = new T.Vector3();
    const pointer = (r) => (r.intersectPlane(level, hit) ? [hit.x, hit.z] : null);
    const TIP = { a: POST.a, b: POST.b, open: [PIVOT[0] - REACH, PIVOT[1]] };
    const nearest = (p) => ['a', 'open', 'b'].map((id) => [id, Math.hypot(p[0] - TIP[id][0], p[1] - TIP[id][1])]).sort((one, other) => one[1] - other[1])[0][0];
    const tool = {
      handles: () => [knobHandle, bladeHandle],
      start(grip, r) {
        const p = pointer(r), id = grip.kind === 'knob' ? 'volts' : 'throw';
        if (!p) return false;
        if (ctx.locked.has(id)) { say('잠금', p[0], TOP + 1.2, p[1], 1.2); return false; }
        grab = { ...grip, from: p, at: p, volts: ctx.values.volts, moved: false };
        return true;
      },
      move(r) {
        const p = pointer(r);
        if (!p || !grab) return;
        grab.at = p; if (Math.hypot(p[0] - grab.from[0], p[1] - grab.from[1]) > 0.15) grab.moved = true;
        if (grab.kind === 'knob') {   // 3 cm sideways for each 1.5 V
          const to = Math.max(1.5, Math.min(6, grab.volts + Math.round((p[0] - grab.from[0]) / 0.3) * 1.5));
          if (to !== ctx.values.volts) ctx.set('volts', to);
          say(`${ctx.values.volts.toFixed(1)} V`, KNOB[0], TOP + 1.2, KNOB[1]);
        }
        moved = true;
      },
      end(done) {
        if (done.kind !== 'throw') return;
        const now = ctx.values.throw, to = done.moved ? nearest(done.at) : now !== 'open' ? 'open' : last === 'a' ? 'b' : 'a';
        if (to !== now) ctx.set('throw', to);
      },
    };

    const way = new T.Vector3(), place = new T.Matrix4();
    function aim(arrow, long, x, z, dx) {   // an arrow of that length from (x, z) along the board, to the right or to the left; one too short for its head is flattened along its length
      const least = arrow.userData.least;
      arrow.setLength(Math.max(long, least)); arrow.scale.y = Math.min(1, long / least);
      arrow.position.set(x - dx * long / 2, RAIL + 0.1, z); arrow.aim(way.set(dx, 0, 0));
    }
    function drawElectrons() {
      const moves = { q: run.q, in: run.in, out: -run.out };
      let n = 0;
      for (const one of STRETCHES) {
        const count = Math.ceil(one.long / EACH), here = !one.on || ctx.values.throw === one.on, shift = (((moves[one.of] * DRIFT) % EACH) + EACH) % EACH;   // (none in the air: over the gap of the switch)
        for (let k = 0; k < count; k++, n++) {
          const along = k * EACH + shift, u = along / one.long;
          place.makeTranslation(one.x1 + (one.x2 - one.x1) * u, here && along < one.long ? RAIL + 0.03 : -5, one.z1 + (one.z2 - one.z1) * u);   // (those out of use are put out of sight)
          electrons.setMatrixAt(n, place);
        }
      }
      electrons.instanceMatrix.needsUpdate = true;
    }
    // how the capacitor stands, in the words of the textbook's figures
    function standing() {
      const at = ctx.values.throw, busy = Boolean(run.what);
      if (busy) return `<b>${run.what.kind} 중</b>`;
      if (at === 'a') return '<b>완전 충전</b> · 전류가 흐르지 않음';
      if (run.q < 0.5) return run.ever ? '<b>완전 방전</b> · 전류가 흐르지 않음' : '<b>충전 전</b>';
      return '<b>충전된 상태</b>';
    }
    function draw() {
      const v = ctx.values, C = farads(), volt = run.q / C, amps = Math.abs(run.I), deep = ctx.advanced;
      // the blade: where it is held, else where the switch stands
      let turn = ANGLE[v.throw];
      if (grab && grab.kind === 'throw' && grab.moved) turn = Math.max(ANGLE.a, Math.min(ANGLE.b, Math.atan2(grab.at[1] - PIVOT[1], PIVOT[0] - grab.at[0])));
      blade.rotation.y = turn;
      knob.rotation.y = -(v.volts - 1.5) / 4.5 * 4.2;
      facePaint.map = face(ohms());
      // the signs on the plates, 25 μC each
      const count = v.charges ? Math.min(SIGNS, Math.round(run.q / SIGN)) : 0;
      for (const plate of signs) plate.forEach((sprite, k) => { sprite.visible = k < count; });
      // the diode glows with the current through it (as bright as it gets at 0.6 mA)
      const bright = v.throw === 'b' ? Math.min(1, amps / 0.6) : 0;
      ledPaint.emissive.setRGB(bright, bright * 0.25, bright * 0.15); ledGlow.opacity = bright * 0.9; halo.visible = bright > 0.01;
      // the current: to the right beside the far line while charging, to the left while discharging
      const dir = run.I > 0 ? 1 : -1;
      for (const one of flows) {
        one.arrow.visible = v.arrows && amps > 1e-4 && (!one.on || one.on === v.throw);
        if (one.arrow.visible) aim(one.arrow, AMP * amps, one.at[0], one.at[1], one.on === 'b' ? 1 : one.way * dir);
      }
      for (const arrow of fields) {
        arrow.visible = v.field && volt > 0.01;
        if (!arrow.visible) continue;
        const long = FIELD * volt, least = arrow.userData.least;
        arrow.setLength(Math.max(long, least)); arrow.scale.y = Math.min(1, long / least); arrow.aim(way.set(1, 0, 0));
      }
      electrons.visible = v.drift;
      if (v.drift) drawElectrons();
      supplyLabel.write(`전원 <b>${v.volts.toFixed(1)} V</b>`); supplyLabel.show(true);
      ledLabel.write('발광 다이오드'); ledLabel.show(true);
      const lines = [`축전기 · ${standing()}`];
      if (v.numbers) {
        lines.push(`전압 <b>${two(volt)} V</b> · 전하량 <b>${whole(run.q)} ${MU}C</b>`, `전류 ${two(amps)} mA`);
        if (deep) lines.push(`전기 용량 ${C} ${MU}F · 저장된 에너지 ${whole(run.q * run.q / (2 * C))} ${MU}J`, `시간 상수 ${ohms()} k${OHM} × ${C} ${MU}F = ${two(ohms() * C / 1000)} s`);
      }
      // (an upright screen sees the board from its right end: there the words go before that end, and those of the diode before it)
      const narrow = tall();
      capSpot.set(narrow ? 6.2 : 2.9, narrow ? 0 : 1.0, narrow ? 0.2 : FAR); ledSpot.set(LED[0] + (narrow ? 0.75 : 0), TOP + 0.05, LED[1] + (narrow ? 0 : 0.45));
      capLabel.write(lines.join('<br>')); capLabel.show(true);
    }

    const circuit = {
      rig, ids: ['throw', 'volts', 'ohms', 'farads'], keep: ['arrows', 'drift', 'field'], kept: { arrows: true, drift: false, field: false },
      look: [{ target: [0, 0.7, -0.1], r: 10.5, theta: 0, phi: 0.92 }, { target: [1.2, 0.4, 0.2], r: 16, theta: Math.PI / 2, phi: 0.62 }],
      handles: tool.handles, start: tool.start, move: tool.move, end: tool.end,
      enter() { rig.visible = true; },
      leave() { close(); toStart(); rig.visible = false; for (const one of [supplyLabel, ledLabel, capLabel]) one.show(false); },   // (what was under way gets its line of the table)
      changed(id, value) {
        if (id === 'throw') { if (value !== 'open') last = value; begin(); }
        if (id === 'volts' || id === 'ohms') begin();
        if (id === 'farads') ctx.emit('action', 'reset');   // another capacitor: it comes without a charge
      },
      play() { if (ctx.values.throw === 'open') ctx.set('throw', last === 'a' ? 'b' : 'a'); },   // pressing play with the switch open throws it, as pressing the blade does
      tick: advance, toStart, draw,
      mode() { ctx.emit('action', 'reset'); },   // the resistance and the capacitance count in the advanced mode only
    };

    // ====================================== the gap and the area ======================================
    // ---------- the plates and what stands by them ----------
    // The inner face of the left plate (+) stands at x = XL, that of the right plate (−) a gap farther to the right.
    // The right plate rides along the axis; the left one rides sideways, away from the viewer; both keep their lower
    // edge at the height LOW, and both are squares of the same side. The supply stands at the front left, its leads lying
    // on the bench: in the advanced mode the + lead has a switch in it, and a slab of a dielectric lies behind, to be
    // stood in the gap.
    const XL = -0.25, LOW = 0.45, THICK = 0.04, EDGE = 0.08, DOT = 0.14, POOL = 750;   // (EDGE: how far the signs keep from the edge of the facing part; DOT: the size of a sign; POOL: the most signs on a plate)
    const rig2 = new T.Group(); world.add(rig2);
    add(rig2, box(1.2, 0.03, 0.34), M.dark, XL + 0.4, 0.015, 0); add(rig2, box(0.34, 0.03, 2.3), M.dark, XL - 0.15, 0.015, -0.75);   // what the plates ride on
    const stands = [-1, 1].map((side) => {
      const stand = new T.Group(); rig2.add(stand);
      const plate = add(stand, box(THICK, 1, 1), plateGlass, side * THICK / 2, 0, 0, false, false);
      add(stand, cyl(0.035, 0.035, LOW - 0.09, 10), M.steel, side * THICK / 2, (LOW + 0.09) / 2, 0); add(stand, box(0.3, 0.06, 0.5), M.pale, side * 0.15, 0.06, 0);
      const handle = add(rig2, box(0.3, 1, 1), M.dark, 0, 0, 0, false, false); handle.visible = false; handle.userData.grip = { kind: side < 0 ? 'slide' : 'gap' };
      return { stand, plate, handle };
    });
    // the corner that is pulled to make the plates larger or smaller: the upper near one of the right plate
    const corner = add(rig2, new T.SphereGeometry(0.07, 16, 10), glow(0xe3c26b), 0, 0, 0, false, false);
    const cornerHandle = add(rig2, new T.SphereGeometry(0.24, 10, 8), M.dark, 0, 0, 0, false, false); cornerHandle.visible = false; cornerHandle.userData.grip = { kind: 'size' };
    // the grip the left plate is slid by: on its upper edge, where the other plate never hides it
    const grip2 = add(stands[0].stand, box(0.07, 0.1, 0.44), glow(0xe3c26b), -THICK / 2, 0, 0, false, false);
    const gripHandle = add(rig2, box(0.4, 0.5, 0.8), M.dark, 0, 0, 0, false, false); gripHandle.visible = false; gripHandle.userData.grip = { kind: 'slide', high: true };
    // the supply and its leads: the red one to the left plate, the black one to the right plate
    const SUP = { x: -2.4, z: 1.0, plus: 0.85, minus: 1.15 }, CUT = [-1.3, -0.9];   // where the supply stands and the rows its leads run along; the two posts of the switch in the red lead
    add(rig2, box(1.4, 0.7, 1.0), mat(0x5b6b8c), SUP.x, 0.35, SUP.z); add(rig2, box(0.6, 0.02, 0.3), glow(0xcfe9d2), SUP.x - 0.25, 0.71, SUP.z - 0.2, false, false);
    for (const [z, colour] of [[SUP.plus, 0xc8392f], [SUP.minus, 0x2b2b2b]]) add(rig2, cyl(0.07, 0.07, 0.1, 12).rotateZ(Math.PI / 2), mat(colour), SUP.x + 0.74, 0.1, z, false);
    const supplySpot2 = new T.Vector3(SUP.x, 1.05, SUP.z - 0.3), supplyLabel2 = view.label(supplySpot2);
    const lead = (colour) => add(rig2, box(1, 0.03, 0.05), mat(colour, { roughness: 0.7 }), 0, 0, 0, false);
    function lay(line, x1, z1, x2, z2) {   // a lead from (x1, z1) to (x2, z2), flat on the bench
      line.scale.x = Math.max(0.001, Math.hypot(x2 - x1, z2 - z1)); line.position.set((x1 + x2) / 2, 0.047, (z1 + z2) / 2); line.rotation.y = Math.atan2(z1 - z2, x2 - x1);
    }
    const red = [0, 1, 2, 3].map(() => lead(0xc8392f)), black = [0, 1].map(() => lead(0x2b2b2b));   // (red[3]: across the place of the switch, where there is none; red[2] and the black ones follow the plates)
    lay(red[0], SUP.x + 0.78, SUP.plus, CUT[0], SUP.plus); lay(red[1], CUT[1], SUP.plus, XL - 0.15, SUP.plus); lay(red[3], CUT[0], SUP.plus, CUT[1], SUP.plus);
    const cutter = new T.Group(); rig2.add(cutter);
    for (const x of CUT) add(cutter, box(0.1, 0.14, 0.1), M.brass, x, 0.07, SUP.plus);
    const lever = new T.Group(); lever.position.set(CUT[1], 0.15, SUP.plus); cutter.add(lever);
    add(lever, box(0.46, 0.03, 0.07), M.copper, -0.2, 0, 0); add(lever, cyl(0.045, 0.045, 0.16, 10), mat(0xc8392f), -0.3, 0.09, 0);
    const cutHandle = add(rig2, box(0.8, 0.7, 0.6), M.dark, (CUT[0] + CUT[1]) / 2, 0.35, SUP.plus, false, false); cutHandle.visible = false; cutHandle.userData.grip = { kind: 'cut' };
    // the slab of a dielectric: as thick as the gap, larger than the largest plates; lying behind at the left, or standing in the gap
    const SLAB = { tall: 3.6, wide: 3.2, park: [-3.0, -1.4] }, TINT = { teflon: 0xf6f6f2, paper: 0xe8d6a0, glass: 0x9fd6cc };
    const slabPaint = new T.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5, transparent: true, opacity: 0.42, depthWrite: false });
    const slab = add(rig2, box(1, SLAB.tall, SLAB.wide), slabPaint, 0, 0, 0, false, false); slab.userData.grip = { kind: 'slab' };
    const slabSpot = new T.Vector3(), slabLabel = view.label(slabSpot);

    // ---------- marks ----------
    // The signs lie on the inner faces of the plates, within the part that faces the other plate, 0.1 nC a sign, at
    // places that stay spread evenly however many there are (a Halton sequence). A line of the field runs from each +
    // sign to the − sign across, so that the lines stand as close as the field is strong. With the slab in the gap, the
    // charges on its faces (drawn smaller and paler, beside the signs they stand against) end all but one in κ of the lines.
    const flatSign = new T.PlaneGeometry(1, 1).rotateY(Math.PI / 2);
    const decal = (plus, pale, parent = rig2, pool = POOL) => {
      const mesh = new T.InstancedMesh(flatSign, new T.MeshBasicMaterial({ map: pictures[plus ? 0 : 1], transparent: true, opacity: pale ? 0.75 : 1, depthTest: false, depthWrite: false, side: T.DoubleSide }), pool);
      mesh.frustumCulled = false; mesh.renderOrder = 11; mesh.count = 0; parent.add(mesh); return mesh;
    };
    const free = [decal(true), decal(false)], bound = [decal(false, true), decal(true, true)];   // on the left plate, on the right plate; on the faces of the slab next to them
    const fieldInk = glow(INK.field);
    const lineShafts = new T.InstancedMesh(cyl(0.012, 0.012, 1, 6).rotateZ(Math.PI / 2), fieldInk, POOL), lineHeads = new T.InstancedMesh(new T.ConeGeometry(0.035, 0.08, 10).rotateZ(-Math.PI / 2), fieldInk, POOL);
    for (const mesh of [lineShafts, lineHeads]) { mesh.frustumCulled = false; mesh.count = 0; rig2.add(mesh); }
    const halton = (i, base) => { let part = 1, sum = 0; for (let n = i; n > 0; n = Math.floor(n / base)) { part /= base; sum += part * (n % base); } return sum; };
    const SPREAD = Array.from({ length: POOL }, (unused, k) => [halton(k + 1, 2), halton(k + 1, 3)]);
    const gapSpot = new T.Vector3(), gapLabel = view.label(gapSpot, true);

    // ---------- physics ----------
    // Two plates of facing area A a distance d apart, with what fills the gap of dielectric constant κ (1 for air), have
    // the capacitance C = κ ε0 A / d: with A in cm² and d in cm, 0.08854 κ A / d in pF. Joined to the supply of voltage
    // V they hold the charge Q = C V; with the supply off the charge stays, and the voltage is Q / C.
    // held: the charge (nC), the capacitance (pF), the voltage between the plates (V), the facing area (cm²), κ
    const held = { q: 0, C: 1, volt: 0, area: 400, kappa: 1 };
    const tried = { d: { key: '', at: new Map() }, a: { key: '', at: new Map() } };   // what was found for each gap, and for each area, tried with everything else as it is now
    const gapOf = () => Math.round(ctx.values.gap * 10) / 10, supplied = () => (ctx.advanced ? ctx.values.volts2 : 100);
    function reckonGap() {
      const v = ctx.values, deep = ctx.advanced, cut = deep && v.cut, gap = gapOf();
      held.kappa = deep && v.filled ? KAPPA[v.stuff] : 1; held.area = v.side * (v.side - v.shift);
      held.C = 0.08854 * held.kappa * held.area / gap;
      if (!cut) held.q = held.C * supplied() / 1000;
      held.volt = held.q * 1000 / held.C;
      // the graphs: the points found with everything but the gap as it is now, and with everything but the area as it is now
      const rest = `${held.kappa}/${cut ? `off ${held.q}` : supplied()}`;
      for (const [one, key, x] of [[tried.d, `${held.area}/${rest}`, gap], [tried.a, `${gap}/${rest}`, held.area]]) {
        if (one.key !== key) { one.key = key; one.at.clear(); }
        one.at.set(x, [held.q, held.volt]);
      }
      for (const id of ['qd', 'qa', 'vd']) ctx.traces[id].clear();
      for (const [x, [q, volt]] of [...tried.d.at].sort((one, other) => one[0] - other[0])) { ctx.traces.qd.add(x, q); ctx.traces.vd.add(x, volt); }
      for (const [x, [q]] of [...tried.a.at].sort((one, other) => one[0] - other[0])) ctx.traces.qa.add(x, q);
      fresh = true; since = performance.now(); moved = true;
    }
    // a line of the table for how things stand, unless it is the line last written
    function noteGap() {
      fresh = false;
      const row = [whole(ctx.values.side), whole(held.area), gapOf().toFixed(1), whole(held.volt), held.kappa === 1 ? '–' : held.kappa.toFixed(1), held.C.toFixed(1), two(held.q)];
      const rows = ctx.tables.table2.rows, above = rows[rows.length - 1];
      if (!above || above.some((cell, i) => cell !== row[i])) ctx.tables.table2.add(row);
    }
    function toStartGap() {
      byScene = true;
      for (const [id, value] of [['gap', 2], ['side', 20], ['shift', 0], ['volts2', 100], ['cut', false], ['stuff', 'paper'], ['filled', false]]) if (!ctx.locked.has(id) && ctx.values[id] !== value) ctx.set(id, value);
      byScene = false;
      for (const one of [tried.d, tried.a]) { one.key = ''; one.at.clear(); }
      reckonGap();
    }

    // ---------- handling ----------
    // The right plate is carried along the axis (the gap), the left one sideways (the facing area) by itself or by the
    // gold grip on its upper edge; the gold corner is pulled along the plate (the side of both plates). The switch in the lead and the slab are pressed, or the slab is
    // carried to the plates or away from them.
    const flat = new T.Plane(new T.Vector3(0, 1, 0), 0), spot2 = new T.Vector3();
    const onFlat = (r, y) => { flat.constant = -y; return r.intersectPlane(flat, spot2) ? [spot2.x, spot2.z] : null; };
    // How far the pointer is along the plate from its lower far corner, as the side of a square: read on the plane of
    // the plate where that is seen well, else (seen edge on) on the plane of its near edge, or from above on that of its upper edge.
    function reach(r, held2) {
      const o = r.origin, way2 = r.direction;
      if (held2.plane === 'x') { const t = (held2.x - o.x) / way2.x; return ((o.y + t * way2.y - LOW) + 2 * (o.z + t * way2.z)) / 2; }
      if (held2.plane === 'y') { const t = (held2.y - o.y) / way2.y; return 2 * (o.z + t * way2.z); }
      const t = (held2.z - o.z) / way2.z; return o.y + t * way2.y - LOW;
    }
    const LOCK = { gap: 'gap', slide: 'shift', size: 'side', slab: 'filled', cut: 'cut' };   // what of the menu each grip sets
    const gapTool = {
      handles: () => (ctx.advanced ? [cornerHandle, gripHandle, stands[0].handle, stands[1].handle, slab, cutHandle] : [cornerHandle, gripHandle, stands[0].handle, stands[1].handle]),
      start(grip, r) {
        const v = ctx.values, s = v.side / 10, d = gapOf() / 10, low = grip.kind === 'slab' || grip.kind === 'cut', level2 = low ? 0.1 : LOW + (grip.high ? s : s / 2), p = onFlat(r, level2);
        if (!p) return false;
        if (ctx.locked.has(LOCK[grip.kind])) { say('잠금', p[0], low ? 1.0 : LOW + s + 0.3, p[1], 1.2); return false; }
        grab = { ...grip, from: p, at: p, level: level2, gap: gapOf(), shift: v.shift, side: v.side, moved: false };
        if (grip.kind === 'size') {
          const way2 = r.direction;
          Object.assign(grab, { plane: Math.abs(way2.x) > 0.35 ? 'x' : Math.abs(way2.y) > Math.abs(way2.z) ? 'y' : 'z', x: XL + d, y: LOW + s, z: s / 2 });
          grab.first = reach(r, grab);
        }
        return true;
      },
      move(r) {
        const v = ctx.values, p = onFlat(r, grab.level);
        if (!p) return;
        grab.at = p; if (Math.hypot(p[0] - grab.from[0], p[1] - grab.from[1]) > 0.15) grab.moved = true;
        if (grab.kind === 'gap') {
          const to = Math.max(1, Math.min(5, Math.round((grab.gap + (p[0] - grab.from[0]) * 10) * 10) / 10));
          if (to !== gapOf()) ctx.set('gap', to);
          say(`간격 ${to.toFixed(1)} cm`, XL + to / 10, LOW + v.side / 10 + 0.35, 0);
        } else if (grab.kind === 'slide') {
          const to = Math.max(0, Math.min(Math.floor(v.side / 2), Math.round(grab.shift - (p[1] - grab.from[1]) * 10)));
          if (to !== v.shift) ctx.set('shift', to);
          say(`마주 보는 넓이 ${v.side * (v.side - to)} ${SQ}`, XL, LOW + v.side / 10 + 0.35, -to / 10);
        } else if (grab.kind === 'size') {
          const to = Math.max(10, Math.min(30, Math.round(grab.side + (reach(r, grab) - grab.first) * 10)));
          if (to !== v.side) ctx.set('side', to);
          say(`한 변 ${to} cm`, XL + gapOf() / 10, LOW + to / 10 + 0.35, to / 20);
        }
        moved = true;
      },
      end(done) {
        if (done.kind === 'cut') ctx.set('cut', !ctx.values.cut);
        if (done.kind === 'slab') {   // pressed: in or out; carried: in if it was let go nearer to the plates than to where it lies
          const to = done.moved ? done.at[0] > (SLAB.park[0] + XL) / 2 : !ctx.values.filled;
          if (to !== ctx.values.filled) ctx.set('filled', to);
        }
      },
    };

    function drawGap() {
      const v = ctx.values, deep = ctx.advanced, s = v.side / 10, gap = gapOf(), d = gap / 10, shift = v.shift / 10, cut = deep && v.cut, filled = deep && v.filled;
      stands[0].stand.position.set(XL, 0, -shift); stands[1].stand.position.set(XL + d, 0, 0);
      for (const { plate, handle } of stands) { plate.scale.set(1, s, s); plate.position.y = LOW + s / 2; handle.scale.set(1, LOW + s, s); }
      stands[0].handle.position.set(XL - 0.15, (LOW + s) / 2, -shift); stands[1].handle.position.set(XL + d + 0.15, (LOW + s) / 2, 0);
      corner.position.set(XL + d + THICK / 2, LOW + s, s / 2); cornerHandle.position.copy(corner.position);
      grip2.position.y = LOW + s + 0.05; gripHandle.position.set(XL - THICK / 2, LOW + s + 0.15, -shift);
      lay(red[2], XL - 0.15, SUP.plus, XL - 0.15, 0.25 - shift); lay(black[0], SUP.x + 0.78, SUP.minus, XL + d + 0.15, SUP.minus); lay(black[1], XL + d + 0.15, SUP.minus, XL + d + 0.15, 0.25);
      cutter.visible = deep; red[3].visible = !deep; lever.rotation.z = cut ? -0.6 : 0;
      // the slab: standing in the gap, or lying where it is kept
      slab.visible = deep; slabPaint.color.setHex(TINT[v.stuff]); slab.scale.x = d;
      if (filled) { slab.rotation.z = 0; slab.position.set(XL + d / 2, 0.03 + SLAB.tall / 2, 0); slabSpot.set(XL + d / 2, SLAB.tall - 0.5, -SLAB.wide / 2 - 0.15); }
      else { slab.rotation.z = Math.PI / 2; slab.position.set(SLAB.park[0], 0.01 + d / 2, SLAB.park[1]); slabSpot.set(SLAB.park[0], 0.25, SLAB.park[1]); }
      slabLabel.write(`유전체 · ${STUFF[v.stuff]}`); slabLabel.show(deep);
      // the signs, the lines of the field from those not met by a charge of the slab, and the charges of the slab beside the rest
      const all = Math.min(POOL, Math.round(held.q / GRAIN)), through = Math.min(all, Math.round(all / held.kappa));
      const signs2 = v.charges ? all : 0, pairs = v.charges && filled ? all - through : 0, drawn = v.lines ? through : 0;
      const at = (k) => [LOW + EDGE + SPREAD[k][0] * (s - 2 * EDGE), -s / 2 + EDGE + SPREAD[k][1] * (s - shift - 2 * EDGE)];
      for (let k = 0; k < signs2; k++) {
        const [y, z] = at(k);
        place.makeScale(DOT, DOT, DOT).setPosition(XL, y, z); free[0].setMatrixAt(k, place); place.setPosition(XL + d, y, z); free[1].setMatrixAt(k, place);
      }
      for (let k = 0; k < pairs; k++) {
        const [y, z] = at(through + k);
        place.makeScale(DOT * 0.6, DOT * 0.6, DOT * 0.6).setPosition(XL + 0.03, y, z + 0.1); bound[0].setMatrixAt(k, place); place.setPosition(XL + d - 0.03, y, z + 0.1); bound[1].setMatrixAt(k, place);
      }
      for (let k = 0; k < drawn; k++) {
        const [y, z] = at(k);
        place.makeScale(d, 1, 1).setPosition(XL + d / 2, y, z); lineShafts.setMatrixAt(k, place); place.makeScale(1, 1, 1).setPosition(XL + d / 2, y, z); lineHeads.setMatrixAt(k, place);
      }
      for (const [meshes, count] of [[free, signs2], [bound, pairs], [[lineShafts, lineHeads], drawn]]) for (const mesh of meshes) { mesh.count = count; mesh.instanceMatrix.needsUpdate = true; }
      supplyLabel2.write(`전원 <b>${whole(supplied())} V</b>${cut ? ' · 떼어 놓음' : ''}`); supplyLabel2.show(true);
      if (v.numbers) {
        const lines = [`간격 <b>${gap.toFixed(1)} cm</b> · 마주 보는 넓이 <b>${whole(held.area)} ${SQ}</b>`, `전압 ${whole(held.volt)} V · 전하량 <b>${two(held.q)} nC</b>`];
        if (deep) lines.push(`전기 용량 ${held.C.toFixed(1)} pF · 저장된 에너지 ${(held.q * held.volt / 2).toFixed(1)} nJ`, `전기장 ${whole(held.volt / gap * 100)} V/m${held.kappa > 1 ? ` · 유전 상수 ${held.kappa.toFixed(1)}` : ''}`);
        gapLabel.write(lines.join('<br>'));
      }
      const narrow = tall();
      gapSpot.set(narrow ? 2.0 : 2.3, narrow ? 0 : 1.0, narrow ? 1.7 : -1.9); gapLabel.show(v.numbers);   // (to the right of the plates as they are seen; on an upright screen before them)
      supplySpot2.set(SUP.x + (narrow ? 0.9 : 0), narrow ? 0.55 : 1.05, narrow ? SUP.plus : SUP.z - 0.3);   // (an upright screen shows just the near end of the supply)
    }

    const gapScene = {
      rig: rig2, ids: ['gap', 'side', 'shift', 'volts2', 'cut', 'stuff', 'filled'], keep: ['lines', 'cut', 'filled'], kept: { lines: false, cut: false, filled: false },
      look: [{ target: [0.1, 1.8, 0], r: 8, theta: 0.7, phi: 1.2 }, { target: [-0.3, 1.6, 0.3], r: 9, theta: 0.9, phi: 1.2 }],
      handles: gapTool.handles, start: gapTool.start, move: gapTool.move, end: gapTool.end,
      enter() { rig2.visible = true; reckonGap(); },
      leave() { if (fresh) noteGap(); rig2.visible = false; for (const one of [supplyLabel2, gapLabel, slabLabel]) one.show(false); },
      changed() {
        const most = Math.floor(ctx.values.side / 2);   // the left plate is slid half its side at most
        if (ctx.values.shift > most) { byScene = true; ctx.set('shift', most); byScene = false; }
        reckonGap();
      },
      play() { stopSoon = true; say('시간에 따라 변하는 것이 없는 장면입니다', XL, LOW + ctx.values.side / 10 + 0.35, 0, 2); },
      tick() { stopSoon = true; },
      toStart: toStartGap, draw: drawGap, note: noteGap,
      mode() { reckonGap(); },   // the voltage of the supply, the switch and the slab count in the advanced mode only
    };

    // ====================================== uses: a key and a microphone ======================================
    // ---------- what both are joined to ----------
    // A supply at the front left and a galvanometer at the front right, joined to each other. A red lead from the + of
    // the supply and a black one from the galvanometer run back along the two sides to (-END.x, END.z) and (END.x, END.z),
    // where the leads of the key or of the microphone take over. A current that charges the plates runs away from the
    // viewer in the red lead and towards the viewer in the black one.
    const rig3 = new T.Group(); world.add(rig3);
    const keyRig = new T.Group(), micRig = new T.Group(); rig3.add(keyRig, micRig);
    const END = { x: 3.3, z: 0.6 }, ROW = 3.0, redPaint = mat(0xc8392f, { roughness: 0.7 }), blackPaint = mat(0x2b2b2b, { roughness: 0.7 }), plateMetal = mat(0xc9a35a, { roughness: 0.5, metalness: 0.3 });
    function wire(parent, paint, x1, z1, x2, z2, y = 0.047) {   // a lead from (x1, z1) to (x2, z2), lying flat at the height y
      const line = add(parent, box(Math.hypot(x2 - x1, z2 - z1) + 0.05, 0.03, 0.05), paint, (x1 + x2) / 2, y, (z1 + z2) / 2, false);
      line.rotation.y = Math.atan2(z1 - z2, x2 - x1); return line;
    }
    add(rig3, box(1.4, 0.7, 1.0), mat(0x5b6b8c), -2.2, 0.35, ROW); add(rig3, box(0.6, 0.02, 0.3), glow(0xcfe9d2), -2.45, 0.71, ROW - 0.2, false, false);
    for (const [x, colour] of [[-2.94, 0xc8392f], [-1.46, 0x2b2b2b]]) add(rig3, cyl(0.07, 0.07, 0.1, 12).rotateZ(Math.PI / 2), mat(colour), x, 0.1, ROW, false);
    wire(rig3, redPaint, -2.98, ROW, -END.x, ROW); wire(rig3, redPaint, -END.x, ROW, -END.x, END.z);
    wire(rig3, blackPaint, -1.42, ROW, 1.45, ROW); wire(rig3, blackPaint, 2.95, ROW, END.x, ROW); wire(rig3, blackPaint, END.x, ROW, END.x, END.z);
    const supplySpot3 = new T.Vector3(-2.2, 1.05, ROW - 0.3), supplyLabel3 = view.label(supplySpot3);
    // the galvanometer: its needle stands upright with no current and leans to the right while the plates are being charged, as far as the current is strong
    const METER = { x: 2.2, swing: 0.96 };   // (swing: how far the needle leans at the full current of its scale, in radians)
    add(rig3, box(1.5, 1.2, 0.6), M.dark, METER.x, 0.6, ROW);
    add(rig3, new T.PlaneGeometry(1.3, 0.95), new T.MeshBasicMaterial({ map: canvasTexture(260, 190, (g) => {
      g.fillStyle = '#f7f1df'; g.fillRect(0, 0, 260, 190); g.strokeStyle = '#2b2b2b'; g.lineWidth = 3;
      g.beginPath(); g.arc(130, 165, 125, -Math.PI / 2 - METER.swing, -Math.PI / 2 + METER.swing); g.stroke();
      for (let k = -5; k <= 5; k++) {
        const turn = -Math.PI / 2 + k * METER.swing / 5, long = k % 5 === 0 ? 24 : 12;
        g.beginPath(); g.moveTo(130 + 125 * Math.cos(turn), 165 + 125 * Math.sin(turn)); g.lineTo(130 + (125 - long) * Math.cos(turn), 165 + (125 - long) * Math.sin(turn)); g.stroke();
      }
      g.fillStyle = '#2b2b2b'; g.font = '700 26px Georgia, serif'; g.textAlign = 'center'; g.fillText('0', 130, 86); g.fillText('G', 130, 140);
    }) }), METER.x, 0.65, ROW + 0.301, false, false);
    const needle = new T.Group(); needle.position.set(METER.x, 0.3, ROW + 0.31); rig3.add(needle);
    add(needle, box(0.03, 0.62, 0.01), mat(0xc8392f), 0, 0.31, 0, false, false);
    const meterSpot = new T.Vector3(METER.x, 1.25, ROW), meterLabel = view.label(meterSpot);
    const flows3 = [[-END.x - 0.4, -1], [END.x + 0.4, 1]].map(([x, dz]) => { const arrow = kit.arrow(INK.current, 0.04); arrow.userData.least = 0.04 * 7; arrow.visible = false; rig3.add(arrow); return { arrow, x, dz }; });
    const useSpot = new T.Vector3(), useLabel = view.label(useSpot, true);

    // ---------- the key ----------
    // Drawn 5 times its size (one unit: 2 mm): a lower plate fixed on its board, and an upper plate under the cap, held
    // up by two springs. side: the side of the plates; low: the height of the face of the lower plate; volts: the
    // supply; grain: the charge a sign stands for (pC); top: the current at the end of the galvanometer's scale (pA);
    // long: the length of an arrow for 1 pA.
    const KEY = { side: 4, low: 0.5, volts: 5, grain: 0.25, top: 120, long: 0.02, signs: 24, farads: 0.566656 };   // (farads: the capacitance in pF with a gap of 1 mm: plates of 8 mm by 8 mm)
    add(keyRig, box(5.8, 0.16, 5.8), M.board, 0, 0.08, 0); add(keyRig, box(1.4, KEY.low - 0.24, 1.4), M.pale, 0, (KEY.low + 0.08) / 2, 0);
    add(keyRig, box(KEY.side, 0.08, KEY.side), plateMetal, 0, KEY.low - 0.04, 0);
    const mover = new T.Group(); keyRig.add(mover);   // the upper plate with its tab, the stem and the cap: at the height of the lower face of the upper plate
    add(mover, box(KEY.side, 0.08, KEY.side), plateMetal, 0, 0.04, 0); add(mover, box(0.5, 0.08, 0.5), plateMetal, KEY.side / 2 + 0.25, 0.04, END.z);
    add(mover, box(1.2, 0.6, 1.2), M.dark, 0, 0.38, 0); add(mover, box(5.2, 0.7, 5.2), mat(0x2f3447, { roughness: 0.7 }), 0, 1.03, 0);
    add(mover, new T.PlaneGeometry(4.4, 4.4).rotateX(-Math.PI / 2), new T.MeshBasicMaterial({ transparent: true, map: canvasTexture(128, 128, (g) => {
      g.fillStyle = '#f3eedf'; g.font = '700 84px Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('A', 64, 70);
    }) }), 0, 1.385, 0, false, false);
    const coil = new T.TorusGeometry(0.2, 0.035, 6, 16).rotateX(Math.PI / 2);
    const springs = [-1, 1].flatMap((side) => [0, 1, 2, 3, 4, 5].map((k) => ({ k, ring: add(keyRig, coil, M.steel, side * 2.35, 0, 0, false) })));
    wire(keyRig, redPaint, -END.x, END.z, -2.9, END.z); wire(keyRig, redPaint, -2.9, END.z, -0.7, END.z, 0.175);
    wire(keyRig, blackPaint, END.x, END.z, 2.9, END.z); wire(keyRig, blackPaint, 2.9, END.z, KEY.side / 2 + 0.25, END.z, 0.175);
    const riser = add(keyRig, cyl(0.03, 0.03, 1, 8), blackPaint, KEY.side / 2 + 0.25, 0, END.z, false);   // the lead up to the tab of the upper plate
    const keySigns = [paintPlus, paintMinus].map((paint, upper) => Array.from({ length: KEY.signs }, (unused, k) => {
      const sprite = new T.Sprite(paint);
      sprite.scale.set(0.3, 0.3, 1); sprite.renderOrder = 11; sprite.visible = false;
      sprite.position.set((SPREAD[k][0] - 0.5) * (KEY.side - 0.5), upper ? -0.03 : KEY.low + 0.03, (SPREAD[k][1] - 0.5) * (KEY.side - 0.5));
      (upper ? mover : keyRig).add(sprite); return sprite;
    }));
    const keyHandle = add(keyRig, box(5.4, 2.6, 5.4), M.dark, 0, 1.6, 0, false, false); keyHandle.visible = false; keyHandle.userData.grip = { kind: 'key' };
    const keySpot = new T.Vector3(), keyLabel = view.label(keySpot);

    // ---------- the microphone ----------
    // Its axis lies along the bench at the height y. The thin plate (+) rests at x = at; the fixed plate (−) stands
    // behind it, 0.6 units away for the 50 μm of the gap. A loudspeaker at the left sets the air between them going:
    // the air is drawn as specks that move to and fro along the axis, each a little later the farther it is from the
    // loudspeaker, and the thin plate moves with the air next to it. speed: how fast the sound is drawn to travel;
    // from: where the air begins; grain, top, long: as for the key, in nC and nA.
    const MIC = { y: 2.0, r: 1.5, at: 0.2, rest: 0.6, gap: 50, volts: 48, grain: 0.1, top: 12, long: 0.17, signs: 40, speed: 4, from: -4.6, farads: 2656.2 };   // (farads: the capacitance in pF with a gap of 1 μm: plates of 3 cm²)
    add(micRig, new T.CylinderGeometry(1.7, 1.7, 2.0, 32, 1, true).rotateZ(Math.PI / 2), new T.MeshStandardMaterial({ color: 0xd9dde6, roughness: 0.5, transparent: true, opacity: 0.28, side: T.DoubleSide, depthWrite: false }), MIC.at + 0.9, MIC.y, 0, false, false);
    add(micRig, cyl(1.7, 1.7, 0.08, 32).rotateZ(Math.PI / 2), M.dark, MIC.at + 1.9, MIC.y, 0);
    add(micRig, cyl(MIC.r, MIC.r, 0.1, 32).rotateZ(Math.PI / 2), plateMetal, MIC.at + MIC.rest + 0.05, MIC.y, 0);
    const thin = add(micRig, cyl(MIC.r, MIC.r, 0.03, 32).rotateZ(Math.PI / 2), new T.MeshStandardMaterial({ color: 0xe3c26b, roughness: 0.4, metalness: 0.3, transparent: true, opacity: 0.75, depthWrite: false }), MIC.at, MIC.y, 0, false, false);
    add(micRig, cyl(0.09, 0.09, MIC.y - 1.7, 12), M.steel, MIC.at + 1.0, (MIC.y - 1.7) / 2, 0); add(micRig, box(1.3, 0.1, 1.0), M.dark, MIC.at + 1.0, 0.05, 0);
    add(micRig, cyl(0.03, 0.03, 0.42, 8), redPaint, MIC.at, 0.21, END.z, false); add(micRig, cyl(0.03, 0.03, 0.42, 8), blackPaint, MIC.at + MIC.rest + 0.05, 0.21, END.z, false);
    wire(micRig, redPaint, -END.x, END.z, MIC.at, END.z); wire(micRig, blackPaint, END.x, END.z, MIC.at + MIC.rest + 0.05, END.z);
    const speaker = add(micRig, box(0.8, 1.8, 1.8), M.dark, -5.3, MIC.y, 0); speaker.userData.grip = { kind: 'speaker' };
    add(micRig, cyl(0.6, 0.6, 0.06, 24).rotateZ(Math.PI / 2), M.pale, -4.88, MIC.y, 0, false); add(micRig, cyl(0.09, 0.09, MIC.y - 0.9, 12), M.steel, -5.3, (MIC.y - 0.9) / 2, 0); add(micRig, box(1.0, 0.1, 1.0), M.dark, -5.3, 0.05, 0);
    const AIR = 170, air = new T.InstancedMesh(new T.SphereGeometry(0.05, 8, 6), new T.MeshBasicMaterial({ color: 0x6f8fc0, transparent: true, opacity: 0.75 }), AIR);
    air.frustumCulled = false; micRig.add(air);
    const AT = Array.from({ length: AIR }, (unused, k) => {   // where each speck of air rests
      const turn = 2 * Math.PI * halton(k + 1, 3), far = 1.3 * Math.sqrt(halton(k + 1, 5));
      return [MIC.from + (MIC.at - 0.15 - MIC.from) * halton(k + 1, 2), MIC.y + far * Math.sin(turn), far * Math.cos(turn)];
    });
    const DISC = Array.from({ length: MIC.signs }, (unused, k) => { const turn = 2 * Math.PI * halton(k + 1, 3), far = 1.3 * Math.sqrt(halton(k + 1, 2)); return [MIC.y + far * Math.sin(turn), far * Math.cos(turn)]; });   // where the signs lie on the plates
    const micSigns = [decal(true, false, micRig, MIC.signs), decal(false, false, micRig, MIC.signs)];
    const thinSpot = new T.Vector3(MIC.at - 0.5, MIC.y + 1.85, 0), thinLabel = view.label(thinSpot), fixedSpot = new T.Vector3(MIC.at + 1.5, MIC.y + 1.85, 0), fixedLabel = view.label(fixedSpot);
    const speakerSpot = new T.Vector3(-5.3, MIC.y + 1.05, 0), speakerLabel = view.label(speakerSpot);

    // ---------- physics ----------
    // Either pair of plates stays joined to its supply, so it holds the charge Q = C V with C = ε0 A / d at every
    // moment, and the current is how fast that charge changes: I = -(Q / d) × (how fast the gap changes).
    // The key goes from where it is to where it is sent in the time it is given, gently at both ends (half a cosine).
    // key: depth (0: up, 1: down), the move under way { from, to, time, span }, the current, the strongest current of the move, how it stood at first;
    // letGo: the pointer left the key before it was down, so it goes up again as soon as it is (a tap is a whole stroke).
    // The thin plate of the microphone is x = a sin(phase) from where it rests (+: towards the fixed plate); the phase
    // grows by 2π × the frequency each second, and a follows the loudness (5 μm for each step) within a fraction of a second.
    // mic: since: from when a line of the table is being measured; low, high: the least and the most of x and of the charge since then; noted: the line is written.
    const key = { depth: 0, from: 0, to: 0, time: 0, span: 0, moving: false, I: 0, peak: 0, first: null, letGo: false };
    const mic = { phase: 0, a: 10, x: 0, I: 0, t: 0, since: 0, low: [0, 0], high: [0, 0], peak: 0, noted: true };
    let sounding = false;
    const travel = () => (ctx.advanced ? ctx.values.travel : 0.3);
    const keyGap = () => 2 - 1.5 * key.depth, keyCharge = () => KEY.volts * KEY.farads / keyGap();   // mm; pC
    const micGap = () => MIC.gap - mic.x, micCharge = () => MIC.volts * MIC.farads / micGap() / 1000;   // μm; nC
    // the move of the key is over, finished or not: a line of the table for it
    function closeKey() {
      if (!key.moving) return;
      key.moving = false; key.I = 0;
      if (Math.abs(keyGap() - key.first[0]) >= 0.005) ctx.tables.table3.add([key.to > key.from ? '누름' : '뗌', two(key.first[0]), two(keyGap()), two(key.first[1]), two(keyCharge()), two(key.time), one(key.peak)]);
    }
    function beginKey() {
      closeKey();
      const to = ctx.values.pressed ? 1 : 0;
      if (Math.abs(to - key.depth) < 1e-3) return;
      Object.assign(key, { from: key.depth, to, time: 0, span: travel() * Math.abs(to - key.depth), moving: true, peak: 0, first: [keyGap(), keyCharge()] });
      stopSoon = false; ctx.setPlaying(true); moved = true;
    }
    function advanceKey(t, dt) {
      if (!key.moving) { stopSoon = true; return; }   // nothing is under way: the clock stops
      key.time = Math.min(key.span, key.time + dt);
      const u = key.time / key.span, rate = u < 1 ? (key.to - key.from) * Math.PI / (2 * key.span) * Math.sin(Math.PI * u) : 0;   // how fast the depth changes
      key.depth = key.from + (key.to - key.from) * (1 - Math.cos(Math.PI * u)) / 2;
      key.I = keyCharge() / keyGap() * 1.5 * rate; key.peak = Math.max(key.peak, Math.abs(key.I));
      ctx.traces.kd.add(t, keyGap()); ctx.traces.kq.add(t, keyCharge()); ctx.traces.ki.add(t, key.I);
      if (u < 1) return;
      closeKey();
      if (key.letGo && ctx.values.pressed) { key.letGo = false; ctx.set('pressed', false); } else stopSoon = true;
    }
    // a line of the table is measured afresh, from so many seconds on (time for the plate to take up a new swing)
    function measure(wait) { mic.since = mic.t + wait; mic.noted = false; mic.peak = 0; mic.low = [Infinity, Infinity]; mic.high = [-Infinity, -Infinity]; }
    function advanceMic(t, dt) {
      const v = ctx.values, aim = 5 * v.loud, turn = 2 * Math.PI * v.pitch;
      mic.a = aim + (mic.a - aim) * Math.exp(-dt / 0.15); mic.phase += turn * dt; mic.t = t;
      mic.x = mic.a * Math.sin(mic.phase);
      const speed = (aim - mic.a) / 0.15 * Math.sin(mic.phase) + mic.a * turn * Math.cos(mic.phase), q = micCharge();   // how fast the plate moves (μm/s)
      mic.I = q / micGap() * speed;
      ctx.traces.mx.add(t, mic.x); ctx.traces.mq.add(t, q - MIC.volts * MIC.farads / MIC.gap / 1000); ctx.traces.mi.add(t, mic.I);
      if (mic.noted || t < mic.since) return;
      mic.low = [Math.min(mic.low[0], mic.x), Math.min(mic.low[1], q)]; mic.high = [Math.max(mic.high[0], mic.x), Math.max(mic.high[1], q)]; mic.peak = Math.max(mic.peak, Math.abs(mic.I));
      if (t - mic.since < 1 / v.pitch) return;
      mic.noted = true;
      const row = [whole(v.loud), one(v.pitch), one(mic.high[0] - mic.low[0]), two(mic.high[1] - mic.low[1]), one(mic.peak)], rows = ctx.tables.table4.rows, above = rows[rows.length - 1];
      if (!above || above.some((cell, i) => cell !== row[i])) ctx.tables.table4.add(row);
    }
    function toStartUse() {
      closeKey();
      Object.assign(key, { depth: 0, I: 0, letGo: false }); Object.assign(mic, { phase: 0, a: 5 * ctx.values.loud, x: 0, I: 0, t: 0, since: 0, noted: true });
      for (const id of ['kd', 'kq', 'ki', 'mx', 'mq', 'mi']) ctx.traces[id].clear();
      byScene = true; if (ctx.values.pressed) ctx.set('pressed', false); byScene = false;
      moved = true;
    }

    // ---------- handling ----------
    // The key is held down for as long as the pointer is held on it, and goes all the way down even when it is only
    // tapped; the loudspeaker is pressed to set the sound going or to stop it.
    const useTool = {
      handles: () => (ctx.values.device === 'key' ? [keyHandle] : [speaker]),
      start(grip) { grab = { ...grip }; key.letGo = false; if (grip.kind === 'key' && !ctx.values.pressed) ctx.set('pressed', true); return true; },
      move() {},
      end(done) {
        if (done.kind !== 'key') ctx.setPlaying(!sounding);
        else if (key.moving && key.to === 1) key.letGo = true;
        else if (ctx.values.pressed) ctx.set('pressed', false);
      },
    };

    const signed = (value) => (Math.abs(value) < 0.05 ? '0.0' : one(value));
    function drawUse() {
      const v = ctx.values, isKey = v.device === 'key', deep = ctx.advanced, narrow = tall(), lines = [];
      keyRig.visible = isKey; micRig.visible = !isKey;
      const I = isKey ? key.I : mic.I, top = isKey ? KEY.top : MIC.top, per = isKey ? KEY.long : MIC.long;
      needle.rotation.z = -Math.max(-1.1, Math.min(1.1, METER.swing * I / top));
      for (const flow of flows3) {
        flow.arrow.visible = v.arrows && Math.abs(I) > top / 2000;
        if (!flow.arrow.visible) continue;
        const long = per * Math.abs(I), least = flow.arrow.userData.least, dir = flow.dz * Math.sign(I);
        flow.arrow.setLength(Math.max(long, least)); flow.arrow.scale.y = Math.min(1, long / least);
        flow.arrow.position.set(flow.x, 0.15, 1.8 - dir * long / 2); flow.arrow.aim(way.set(0, 0, dir));
      }
      if (isKey) {
        const gap = keyGap(), up = gap / 2, q = keyCharge(), foot = 0.16, head = KEY.low + up + 0.68;   // (one unit: 2 mm)
        mover.position.y = KEY.low + up;
        for (const { k, ring } of springs) ring.position.y = foot + (head - foot) * (k + 0.5) / 6;
        riser.scale.y = KEY.low + up - foot; riser.position.y = foot + riser.scale.y / 2;
        const count = v.charges ? Math.min(KEY.signs, Math.round(q / KEY.grain)) : 0;
        for (const plate of keySigns) plate.forEach((sprite, k) => { sprite.visible = k < count; });
        keySpot.set(0, KEY.low + up + 1.75, 0);
        keyLabel.write(`키 · ${key.moving ? (key.to > key.from ? '<b>누르는 중</b> · 전하량이 늘어남' : '<b>떼는 중</b> · 전하량이 줄어듦') : `<b>${key.depth > 0.5 ? '눌린 상태' : '떼어 둔 상태'}</b> · 전류가 흐르지 않음`}`);
        lines.push(`간격 <b>${two(gap)} mm</b> · 전하량 <b>${two(q)} pC</b>`, `전류 ${signed(key.I)} pA`);
        if (deep) lines.push(`전기 용량 ${two(KEY.farads / gap)} pF`);
        useSpot.set(narrow ? 0.6 : 4.6, narrow ? 0 : 1.6, narrow ? 5.6 : -1.2);
      } else {
        const shift = MIC.rest * mic.x / MIC.gap, swing = MIC.rest * mic.a / MIC.gap, wave = 2 * Math.PI * v.pitch / MIC.speed, q = micCharge();
        thin.position.x = MIC.at + shift;
        for (let n = 0; n < AIR; n++) { const [x, y, z] = AT[n]; place.makeTranslation(x + swing * Math.sin(mic.phase - wave * (MIC.at - x)), y, z); air.setMatrixAt(n, place); }
        air.instanceMatrix.needsUpdate = true;
        const count = v.charges ? Math.min(MIC.signs, Math.round(q / MIC.grain)) : 0;
        for (let n = 0; n < count; n++) {
          const [y, z] = DISC[n];
          place.makeScale(0.2, 0.2, 0.2).setPosition(MIC.at + shift + 0.02, y, z); micSigns[0].setMatrixAt(n, place); place.setPosition(MIC.at + MIC.rest - 0.01, y, z); micSigns[1].setMatrixAt(n, place);
        }
        for (const mesh of micSigns) { mesh.count = count; mesh.instanceMatrix.needsUpdate = true; }
        thinLabel.write('진동판'); fixedLabel.write('고정판'); speakerLabel.write('스피커');
        lines.push(`간격 <b>${one(micGap())} ${MU}m</b> · 전하량 <b>${two(q)} nC</b>`, `전류 ${signed(mic.I)} nA`);
        if (deep) lines.push(`전기 용량 ${one(MIC.farads / micGap())} pF`);
        useSpot.set(narrow ? 1.2 : 3.6, narrow ? 0 : 2.6, narrow ? 6.6 : -1.5);
      }
      keyLabel.show(isKey); for (const label of [thinLabel, fixedLabel, speakerLabel]) label.show(!isKey);
      supplyLabel3.write(`전원 <b>${isKey ? KEY.volts : MIC.volts} V</b>`); supplyLabel3.show(true); meterLabel.write('검류계'); meterLabel.show(true);
      useLabel.write(lines.join('<br>')); useLabel.show(v.numbers);
    }

    const LOOKS = { key: [{ target: [0, 1.0, 1.2], r: 14, theta: 0.3, phi: 1.2 }, { target: [0, 0.8, 1.2], r: 18, theta: 0.3, phi: 1.15 }],
      mic: [{ target: [-1.2, 1.5, 0.8], r: 14, theta: 0.5, phi: 1.2 }, { target: [-1.0, 1.5, 0.8], r: 20, theta: 0.5, phi: 1.15 }] };
    const useScene = {
      rig: rig3, ids: ['device', 'pressed', 'travel', 'loud', 'pitch'], keep: ['arrows'], kept: { arrows: true },
      get look() { return LOOKS[ctx.values.device]; },
      handles: useTool.handles, start: useTool.start, move: useTool.move, end: useTool.end,
      enter() { rig3.visible = true; },
      leave() { toStartUse(); rig3.visible = false; for (const label of [supplyLabel3, meterLabel, useLabel, keyLabel, thinLabel, fixedLabel, speakerLabel]) label.show(false); },   // (a move of the key under way gets its line of the table)
      changed(id) {
        if (id === 'device') { toStartUse(); frame(); stopSoon = true; ctx.seek(0); }   // the other of the two: from its start
        if (id === 'pressed' && ctx.values.device === 'key') beginKey();
        if (id === 'loud' || id === 'pitch') measure(0.6);
      },
      play() { if (ctx.values.device === 'mic') { stopSoon = false; measure(0); } else if (!key.moving) ctx.set('pressed', !ctx.values.pressed); },   // pressing play presses the key or lets it go, as holding it does; it sets the sound going
      tick(t, dt) { if (ctx.values.device === 'key') advanceKey(t, dt); else advanceMic(t, dt); },
      toStart: toStartUse, draw: drawUse,
      mode() {},
    };

    const SCENES = { circuit, gap: gapScene, use: useScene }, scene = () => SCENES[ctx.values.scene];
    const frame = () => view.look(scene().look[tall() ? 1 : 0]);
    view.setTool({
      pick(r) {
        ray.ray.copy(r); scene().rig.updateMatrixWorld(true);
        const found = ray.intersectObjects(scene().handles(), false)[0];
        return found ? found.object.userData.grip : null;
      },
      cursor: (grip) => (!grip ? '' : grip.kind === 'throw' || grip.kind === 'cut' || grip.kind === 'slab' ? 'pointer' : 'grab'),
      start: (grip, r) => scene().start(grip, r),
      move(r) { scene().move(r); },
      end() {
        const done = grab;
        grab = null; tip.show(false); tipTime = 0; moved = true;
        if (done) scene().end(done);
      },
    });
    ctx.on('play', (on) => { sounding = on; if (on) scene().play(); });
    ctx.on('tick', (t, dt) => {
      if (!dt || stopSoon) return;
      scene().tick(t, dt); moved = true;
    });
    ctx.on('action', (id) => { if (id === 'reset') scene().toStart(); });
    ctx.on('change', (id, value) => {
      const at = scene();
      moved = true;
      if (id === 'scene') {   // the other arrangement: its switches as they were left, the clock at nought
        for (const one of Object.values(SCENES)) if (one !== at) one.leave();
        for (const key of at.keep) if (ctx.values[key] !== at.kept[key]) ctx.set(key, at.kept[key]);
        at.enter(); frame(); stopSoon = true; ctx.seek(0); tip.show(false); tipTime = 0;
        return;
      }
      if (at.keep.includes(id)) at.kept[id] = value;
      if (byScene || !at.ids.includes(id)) return;   // set from the scene: what follows is done there
      at.changed(id, value);
    });
    ctx.on('mode', () => { scene().mode(); moved = true; });

    gapScene.leave(); useScene.leave(); chart();
    return {
      state: () => ({ scene: ctx.values.scene, q: run.q, I: run.I, volt: run.q / farads(), in: run.in, out: run.out, work: run.work, heat: run.heat, stored: run.q * run.q / (2 * farads()), what: run.what ? { ...run.what } : null, throw: ctx.values.throw,
        gap: { ...held, signs: free[0].count, pairs: bound[0].count, lines: lineShafts.count },
        key: { ...key, gap: keyGap(), charge: keyCharge() }, mic: { ...mic, gap: micGap(), charge: micCharge() } }),
      update(dt) {
        if (!framed) { framed = true; if (tall()) frame(); }
        if (stopSoon) { stopSoon = false; ctx.setPlaying(false); }
        if (tipTime > 0) { tipTime -= dt; if (tipTime <= 0) { tip.show(false); moved = true; } }
        if (fresh && !grab && scene().note && performance.now() - since >= 500) scene().note();
        if (!moved) return false;
        moved = false; scene().draw();
        return true;
      },
    };
  },
};
