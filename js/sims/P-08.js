// P-08 The electric field and the potential difference (3D): charges on a board, in three arrangements chosen in the menu.
//
// The electric force: two charged balls on insulating stands, A and B, stand in a line along a rule on the board,
// after the textbook's figure. Each pushes or pulls the other with a force of the same size, F = k q1 q2 / r^2
// (Coulomb's law): a quarter as large at twice the distance, twice as large with twice the charge on one of them. The
// stands hold the balls where they are; only the forces on them are shown. A stand may be put anywhere along the rule,
// and steps over another that is in its way.
// Advanced: a third charge, C, on the same line. The force on each is then the sum of the forces from the other two,
// and C can be put where the forces on B cancel (the textbook's worked example). A graph in three parts shows the
// force on each of the three against the place of the one that is being moved, whichever it is.
//
// The electric field: one charge or two stand anywhere on the board, and a small test charge on a stand of its own is
// carried about among them. The field of the charges is there whether the test charge is or not: it is drawn as
// arrows all over the board, each as long as the field is strong where it starts, or as lines (a model: how many are
// drawn is a matter of choice). The test charge feels
// the force F = q E, so the field where it stands is E = F / q, whatever its own charge. It is only carried about and
// never let go: a charge that is let go does not travel along the lines of the field.
// Advanced: a negative test charge, which is pushed against the field.
//
// A uniform field and potential difference: two long bars joined to a supply stand across the board, after the
// textbook's figure, and the field between them is the same everywhere. A charged puck that slides on the board is
// carried towards the positive bar against the force on it, which takes the work q E d and gives it that much
// potential energy; the potential there is V = U / q. Let go, the puck is driven back to the negative bar and its
// potential energy becomes kinetic energy. Only here is a charge let go, for only here does it follow the field.
// Advanced: a negative charge; the mass of the puck; a speed along the bars at the start, with which the puck
// follows a parabola and not the lines of the field.
//
// What is set by hand can be set from the menu as well, over the same ranges and in the same steps (places on the
// board are set by hand only).
// One unit of the scene is 10 cm. Charges are in microcoulombs; places are in whole centimetres.
const GOLD = '#e3c26b', GREEN = '#7fcf9f', SLATE = '#a9bbd6', RED = '#e58373', BLUE = '#7fa6e6';
const MICRO = '<span style="font-family: Georgia, serif">μ</span>C';   // the Korean face draws Greek letters full width
const K = 0.009;                                // k q1 q2 / r^2 in N with the charges in microcoulombs and r in m: 9.0e9 x 1e-12
const LOW = 0, HIGH = 90, DEEP = 50, NEAR = 10;   // cm: the ends of the line, which are those of the rule; how deep the board is for charges; how near two charges may stand
const IDS = ['a', 'b', 'c'], NAMES = ['A', 'B', 'C'];
// which arrangement an item of a menu belongs to; on the line, whether it belongs to two charges or to three
const onLine = (values) => values.scene === 'line', onField = (values) => values.scene === 'field', onPlates = (values) => values.scene === 'plates';
const pair = (values) => onLine(values) && !values.third, three = (values) => onLine(values) && values.third;
const probing = (values) => (onField(values) && values.probe) || onPlates(values);   // there is a test charge to be set
const minus = (text) => text.replace('-', '−');
const KIND = { kind: 'choice', value: 'plus', options: [{ id: 'plus', label: '양(+)전하' }, { id: 'minus', label: '음(−)전하' }] };
const AMOUNT = { kind: 'slider', min: 1, max: 3, step: 1, value: 1, unit: ' μC' };
const amount = (q) => `${q > 0 ? '+' : '−'}${Math.abs(q)}`;                                                  // a charge with its sign: +1, −2
const aimed = (f) => (Math.abs(f) < 0.0005 ? '0.000' : `${f > 0 ? '→' : '←'} ${Math.abs(f).toFixed(3)}`);     // a force along the line: which way, and how large (N)
// a field given in units of 1e5 N/C, written out in N/C as a number times a power of ten
function powers(e5) {
  if (e5 < 0.0005) return '0';
  let power = Math.floor(Math.log10(e5 * 1e5)), lead = e5 * 1e5 / 10 ** power;
  if (lead >= 9.995) { lead /= 10; power++; }
  return `${lead.toFixed(2)}×10<sup>${power}</sup>`;
}

export default {
  // what is taken for granted, written on screen by the frame
  premise: (v) => (onPlates(v) ? '마찰은 없고, 판 사이의 전기장은 어디서나 같다고 봅니다<br>전기적 위치 에너지의 기준점은 (−)판으로 설정했습니다' : ''),
  fixedViews: ['front', 'top'],
  camera: { target: [0, 0.9, 0], r: 13, theta: 0.22, phi: 1.2, rMax: 30 },
  stepTime: 0.08,                 // "one step at a time": the demonstration moves its charge on by 1 cm
  traces: {
    byGap: { window: 100, range: 0.1, read: (f) => `${f.toFixed(3)} N` },   // the force against the distance (m), not against time
    // the force on each of three charges against the place of the one that is moved (m); right is +
    netA: { window: 100, range: 0.1, read: (f) => `${aimed(f)} N` }, netB: { window: 100, range: 0.1, read: (f) => `${aimed(f)} N` }, netC: { window: 100, range: 0.1, read: (f) => `${aimed(f)} N` },
    fieldGap: { window: 100, range: 1, read: (e) => `${e.toFixed(2)} ×10⁵ N/C` },   // the field of one charge (in 1e5 N/C) against the distance from it (m)
  },
  charts: {
    byCharge: { names: ['N'], colors: [GOLD], groups: [''], signed: false, range: 0.1, read: (f) => f.toFixed(3) },
    // the energies of the puck between the bars (J); with a negative charge its potential energy is negative, and the bars may point down
    energy: { names: ['위치 에너지', '운동 에너지', '합'], colors: [BLUE, RED, GOLD], groups: ['J'], signed: false, range: 0.02, read: (e) => e.toFixed(3) },
    energySigned: { names: ['위치 에너지', '운동 에너지', '합'], colors: [BLUE, RED, GOLD], groups: ['J'], range: 0.02, read: (e) => minus(e.toFixed(3)) },
  },
  menus: {
    vars: [
      { id: 'scene', label: '장면 선택', kind: 'choice', value: 'line', options: [{ id: 'line', label: '전기력' }, { id: 'field', label: '전기장' }, { id: 'plates', label: '균일한 전기장과 전위차' }] },
      { id: 'aSign', label: 'A의 전하의 종류', ...KIND, when: (v) => !onPlates(v) }, { id: 'aCharge', label: 'A의 전하량', ...AMOUNT, when: (v) => !onPlates(v) },
      { id: 'second', label: '전하 B 놓기', kind: 'toggle', when: onField },
      { id: 'bSign', label: 'B의 전하의 종류', ...KIND, when: (v) => onLine(v) || v.second }, { id: 'bCharge', label: 'B의 전하량', ...AMOUNT, when: (v) => onLine(v) || v.second },
      { id: 'gap', label: (v) => (v.third ? 'A와 B 사이의 거리' : '두 전하 사이의 거리'), kind: 'slider', min: NEAR / 100, max: (HIGH - LOW) / 100, step: 0.01, value: 0.1, digits: 2, unit: ' m', when: onLine },
      { id: 'third', label: '전하 C 놓기', kind: 'toggle', advanced: true, when: onLine },
      { id: 'cSign', label: 'C의 전하의 종류', ...KIND, advanced: true, when: three }, { id: 'cCharge', label: 'C의 전하량', ...AMOUNT, advanced: true, when: three },
      { id: 'cPos', label: 'C의 위치', kind: 'slider', min: LOW / 100, max: HIGH / 100, step: 0.01, value: 0.75, digits: 2, unit: ' m', advanced: true, when: three },   // read on the rule
      { id: 'probe', label: '시험 전하 놓기', kind: 'toggle', value: true, when: onField },   // switched on whenever the field is shown (see create)
      { id: 'probeCharge', label: '시험 전하의 전하량', ...AMOUNT, when: probing },
      { id: 'probeSign', label: '시험 전하의 종류', ...KIND, advanced: true, when: probing },
      { id: 'fieldE', label: '전기장의 세기', kind: 'slider', min: 0.5, max: 2, step: 0.5, value: 1, digits: 1, unit: ' ×10⁵ N/C', when: onPlates },
      { id: 'drop', label: '놓는 위치((−)판에서)', kind: 'slider', min: 0, max: 0.4, step: 0.01, value: 0.2, digits: 2, unit: ' m', when: onPlates },
      { id: 'mass', label: '질량', kind: 'slider', min: 0.05, max: 0.2, step: 0.05, value: 0.1, digits: 2, unit: ' kg', advanced: true, when: onPlates },
      { id: 'speed0', label: '처음 속도(판에 나란히)', kind: 'slider', min: 0, max: 0.5, step: 0.1, value: 0, digits: 1, unit: ' m/s', advanced: true, when: onPlates },
    ],
    graph: [
      // a point for every distance tried with the present charges
      { id: 'forceGap', label: '전기력–거리', kind: 'graph', x: '거리', xUnit: 'm', span: [0, (HIGH - LOW) / 100], plots: [{ y: '전기력', trace: 'byGap', dots: true }], when: pair },
      { id: 'forceCharge', label: '전기력–전하량', kind: 'graph', bars: 'byCharge', when: pair },
      // With three charges: a point in each part for every place the charge last moved has stood in, while the other two
      // and the charges stay as they are. The scene names the axis after that charge.
      { id: 'netPlace', label: '합력–전하의 위치', kind: 'graph', x: 'C의 위치', xUnit: 'm', span: [0, (HIGH - LOW) / 100], advanced: true, when: three,
        plots: [{ y: 'A가 받는 합력 (→ +)', dots: true, lines: [{ trace: 'netA', color: GOLD }] }, { y: 'B가 받는 합력 (→ +)', dots: true, lines: [{ trace: 'netB', color: GREEN }] },
          { y: 'C가 받는 합력 (→ +)', dots: true, lines: [{ trace: 'netC', color: SLATE }] }] },
      // the field of one charge: a point for every distance from it at which the test charge has stood
      { id: 'fieldGap', label: '전기장–거리', kind: 'graph', x: 'A에서의 거리', xUnit: 'm', span: [0, 1], plots: [{ y: '전기장', trace: 'fieldGap', dots: true }], when: (v) => onField(v) && !v.second },
      { id: 'energyBars', label: '에너지 막대', kind: 'graph', bars: 'energy', when: (v) => onPlates(v) && v.probeSign !== 'minus' },
      { id: 'energyBarsSigned', label: '에너지 막대', kind: 'graph', bars: 'energySigned', advanced: true, when: (v) => onPlates(v) && v.probeSign === 'minus' },
    ],
    time: [
      { id: 'slow', label: '느리게', kind: 'toggle' },
      { id: 'reset', label: '처음으로', kind: 'action' },
      { id: 'step', label: '한 단계씩', kind: 'action', advanced: true },
    ],
    layers: [
      { id: 'arrows', label: '전기장 화살표', kind: 'toggle', value: true, when: (v) => !onLine(v) },   // switched on whenever a field is shown (see create)
      { id: 'lines', label: '전기장 선(모형)', kind: 'toggle', when: (v) => !onLine(v) },
      { id: 'lineCount', label: '선의 개수(1 μC당)', kind: 'slider', min: 4, max: 16, step: 4, value: 8, unit: '개', when: (v) => onField(v) && v.lines },
      { id: 'forces', label: '전기력 화살표', kind: 'toggle', value: true },
      // the force from each of the others, beside their sum: on the line with three charges, in the field with two and the test charge
      { id: 'parts', label: '전하별 전기력', kind: 'toggle', when: (v) => (onField(v) ? v.second && v.probe : v.third) },
      { id: 'volts', label: '전위 눈금', kind: 'toggle', when: onPlates },                  // the potential every 10 cm from the negative bar
      { id: 'marks', label: '같은 시간 간격의 위치', kind: 'toggle', when: onPlates },   // where the puck is every 0.1 s
      { id: 'span', label: '거리', kind: 'toggle' },
      { id: 'numbers', label: '값', kind: 'toggle' },
    ],
    inquiry: [
      { id: 'table', label: '기록 표', kind: 'table', wide: true, when: pair, text: '전하를 옮기거나 값을 바꿀 때마다 한 줄씩 적힙니다.',
        columns: [{ label: 'A 전하량', unit: 'μC' }, { label: 'B 전하량', unit: 'μC' }, { label: '거리', unit: 'm' }, { label: '전기력', unit: 'N', result: true }, { label: '종류', result: true }] },
      { id: 'table3', label: '기록 표', kind: 'table', wide: true, advanced: true, when: three, text: '전하를 옮기거나 값을 바꿀 때마다 한 줄씩 적힙니다. 전하마다 전하량과 위치(자의 눈금)를 적습니다.',
        columns: [{ label: 'A', unit: 'μC · m' }, { label: 'B', unit: 'μC · m' }, { label: 'C', unit: 'μC · m' },
          { label: 'A가 받는<br>합력', unit: 'N', result: true }, { label: 'B가 받는<br>합력', unit: 'N', result: true }, { label: 'C가 받는<br>합력', unit: 'N', result: true }] },
      { id: 'fieldTable', label: '기록 표', kind: 'table', wide: true, when: onField, text: '시험 전하를 옮기거나 값을 바꿀 때마다 한 줄씩 적힙니다. A, B 칸에는 전하량과 시험 전하까지의 거리를 적습니다.',
        columns: [{ label: 'A', unit: 'μC · m' }, { label: 'B', unit: 'μC · m' }, { label: '시험<br>전하', unit: 'μC' }, { label: '전기력', unit: 'N', result: true }, { label: '전기장', unit: '×10<sup>5</sup> N/C', result: true }] },
      { id: 'plateTable', label: '기록 표', kind: 'table', wide: true, when: onPlates, text: '시험 전하를 놓을 때마다 한 줄씩 적힙니다. 위치 에너지(전기적 위치 에너지)와 전위는 (−)판을 기준으로 한 값입니다.',
        columns: [{ label: '전기장', unit: '×10<sup>5</sup> N/C' }, { label: '시험<br>전하', unit: 'μC' }, { label: '(−)판에서<br>거리', unit: 'm' }, { label: '전기력', unit: 'N', result: true },
          { label: '위치<br>에너지', unit: 'J', result: true }, { label: '전위', unit: 'V', result: true }, { label: '질량', unit: 'kg', advanced: true }, { label: '끝<br>속력', unit: 'm/s', result: true, advanced: true }] },
      { id: 'law', label: '쿨롱 법칙', kind: 'note', when: onLine,
        text: `전기력 <i style="font-family: Georgia, serif">F = k q</i><sub>1</sub><i style="font-family: Georgia, serif">q</i><sub>2</sub> ÷ <i style="font-family: Georgia, serif">r</i><sup>2</sup><br><br><i style="font-family: Georgia, serif">k</i> = 9.0 × 10<sup>9</sup> N·m<sup>2</sup>/C<sup>2</sup><br>1 ${MICRO} = 0.000001 C` },
      { id: 'fieldNote', label: '전기장', kind: 'note', when: onField,
        text: `전기장 <i style="font-family: Georgia, serif">E = F</i> ÷ <i style="font-family: Georgia, serif">q</i> (N/C)<br>시험 전하가 받는 전기력을 시험 전하의 전하량으로 나눈 값입니다. 1 ${MICRO} = 0.000001 C<br><br>화살표의 방향은 그 자리에 양(+)전하를 놓으면 받는 힘의 방향이고, 길이는 전기장의 세기에 비례합니다(1×10<sup>5</sup> N/C에 0.5 cm). 전하에서 10 cm보다 가까운 곳에는 그리지 않습니다.<br><br>전기장 선은 전기장의 모습을 나타내는 모형입니다. 선을 몇 개 그릴지는 정하기 나름입니다.` },
      { id: 'plateNote', label: '위치 에너지와 전위', kind: 'note', when: onPlates,
        text: `전기력 <i style="font-family: Georgia, serif">F = qE</i><br>전기적 위치 에너지 <i style="font-family: Georgia, serif">U = qEd</i> ((−)판에서의 거리 <i style="font-family: Georgia, serif">d</i>)<br>전위 <i style="font-family: Georgia, serif">V = U</i> ÷ <i style="font-family: Georgia, serif">q</i><br><br>두 점 사이의 전위의 차이가 전위차(전압)입니다.<br>1 ${MICRO} × 1 V = 0.000001 J` },
    ],
  },

  // writing on the chalkboard (1024 x 400)
  board(g) {
    g.fillStyle = 'rgba(255,255,255,0.9)'; g.font = '56px Georgia, serif'; g.fillText('전기장과 전위차', 60, 96);
    // a line of italic writing; level 1: set low and small, level 2: set high and small
    const write = (parts, x, y) => {
      for (const [text, level = 0] of parts) {
        g.font = `italic ${level ? 32 : 58}px Georgia, serif`; g.fillText(text, x, y + (level === 1 ? 14 : level === 2 ? -26 : 0));
        x += g.measureText(text).width + (level ? 6 : 0);
      }
    };
    write([['F = k '], ['q'], ['1', 1], ['q'], ['2', 1], [' / r'], ['2', 2]], 60, 205);
    write([['E = F / q']], 60, 318); write([['V = U / q']], 400, 318);
    // two charges that pull each other
    g.strokeStyle = 'rgba(255,255,255,0.85)'; g.lineWidth = 5;
    for (const [x, sign] of [[720, 1], [920, -1]]) {
      g.beginPath(); g.arc(x, 200, 34, 0, 7); g.stroke();
      g.beginPath(); g.moveTo(x - 15, 200); g.lineTo(x + 15, 200); if (sign > 0) { g.moveTo(x, 185); g.lineTo(x, 215); } g.stroke();
      const from = x + sign * 46, to = x + sign * 86;
      g.beginPath(); g.moveTo(from, 200); g.lineTo(to, 200); g.moveTo(to - sign * 14, 188); g.lineTo(to, 200); g.lineTo(to - sign * 14, 212); g.stroke();
    }
  },

  // Builds the apparatus on the bench (world) and returns { update(dt) }.
  create({ T, kit, world, view, ctx }) {
    const { mat, glow, add, box, cyl, canvasTexture, letterTexture } = kit;
    world.userData.things.visible = false;   // the board takes the middle of the bench
    const M = { board: mat(0xc3cedb, { roughness: 0.8 }), dark: mat(0x3a4057), rod: mat(0xe9eef2, { roughness: 0.4 }), rule: mat(0xf2d675) };
    const INK = { force: 0x7b3fc4, span: 0x1d2440, field: 0x24345c }, PLATE = [0xb8862f, 0x3f8f6a, 0x5b6b8c];   // PLATE: the name plate of each charge, and the forces that come from it
    const TINT = { plus: new T.Color(0xd9584a), minus: new T.Color(0x3f6fd0) };

    // ---------- a board, a rule along it, three balls on insulating stands, a smaller one for the test charge ----------
    // TOP: the top of the board; H: the height of the middle of a ball above the bench (LEVEL: on the board of the field,
    // where the stands are short, so that the field drawn at the height of the balls lies near the board); R: its radius
    const TOP = 0.12, H = 1.3, LEVEL = 0.8, R = 0.25, MID = (LOW + HIGH) / 2;
    const rig = new T.Group(); world.add(rig);
    add(rig, box(10.4, TOP, 6), M.board, 0, TOP / 2, 0);
    const RULE = { long: 9.2, wide: 0.46, z: 1.05 };   // it reads in cm; its 0 is 0.1 from its left end
    const rule = new T.Group(); rig.add(rule);
    add(rule, box(RULE.long, 0.05, RULE.wide), M.rule, 0, TOP + 0.025, RULE.z);
    add(rule, new T.PlaneGeometry(RULE.long, RULE.wide), mat(0xffffff, { map: canvasTexture(2048, 102, (g, w, h) => {
      g.fillStyle = '#f2d675'; g.fillRect(0, 0, w, h); g.strokeStyle = g.fillStyle = '#4a3f1c';
      g.font = '700 40px Helvetica, Arial, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'alphabetic';
      for (let c = 0; c <= 90; c++) {
        const x = (c + 1) * w / 92, long = c % 10 === 0 ? 0.46 : c % 5 === 0 ? 0.34 : 0.2;
        g.lineWidth = c % 10 === 0 ? 4 : 2; g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h * long); g.stroke();
        if (c % 10 === 0) g.fillText(String(c), x, h - 10);
      }
    }) }), 0, TOP + 0.052, RULE.z, false).rotation.x = -Math.PI / 2;
    // where a place is in the scene: along the rule (cm from its 0), and across the board (cm from its far edge for charges)
    const X = (cm) => (cm - MID) / 10, Z = (cm) => (cm - DEEP / 2) / 10;

    // the marks on a ball: as many signs as it has microcoulombs
    const marks = new Map();
    function markOf(q) {
      if (!marks.has(q)) marks.set(q, canvasTexture(128, 128, (g) => {
        const n = Math.abs(q), s = [0, 26, 19, 17][n], at = [[], [[64, 64]], [[38, 64], [90, 64]], [[64, 40], [38, 86], [90, 86]]][n];
        g.fillStyle = '#ffffff';
        for (const [x, y] of at) { g.fillRect(x - s, y - s * 0.24, s * 2, s * 0.48); if (q > 0) g.fillRect(x - s * 0.24, y - s, s * 0.48, s * 2); }
      }));
      return marks.get(q);
    }
    // A ball of radius r on a stand whose foot is wide across, with its name on a sloping plate, to be read from the
    // front and from above. The whole stand is what is taken hold of.
    function stand(name, colour, grip, r, wide) {
      const group = new T.Group(); group.position.y = TOP; rig.add(group);
      add(group, box(wide, 0.12, wide), M.dark, 0, 0.06, 0);
      const rod = add(group, cyl(r * 0.16, r * 0.16, 1, 12), M.rod, 0, 0, 0);
      const ball = add(group, new T.SphereGeometry(r, 32, 20), new T.MeshStandardMaterial({ roughness: 0.55 }), 0, H - TOP, 0);
      const sign = new T.Sprite(new T.SpriteMaterial({ map: markOf(1), depthTest: false })); sign.scale.set(r * 1.76, r * 1.76, 1); sign.renderOrder = 11; ball.add(sign);
      const plate = add(group, box(wide * 0.58, wide * 0.58, 0.04), mat(colour), 0, 0.12 + wide * 0.21, wide * 0.35); plate.rotation.x = -0.9;
      const letter = new T.Mesh(new T.PlaneGeometry(wide * 0.5, wide * 0.5), new T.MeshBasicMaterial({ map: letterTexture(name), transparent: true })); letter.position.z = 0.022; plate.add(letter);
      const handle = add(group, box(wide + 0.28, H + r, wide + 0.28), M.dark, 0, (H + r) / 2 - TOP, 0, false, false); handle.visible = false;
      handle.userData.grip = grip;
      // the ball stands with its middle at the height h above the bench
      function raise(h) {
        rod.scale.y = h - TOP - 0.12; rod.position.y = 0.12 + rod.scale.y / 2; ball.position.y = h - TOP;
        handle.scale.y = (h + r) / (H + r); handle.position.y = (h + r) / 2 - TOP;
      }
      raise(H);
      return { group, ball, sign, handle, raise };
    }
    // an arrow for a force; least: the shortest it can be and keep its shape
    const forceArrow = (colour, thick) => { const arrow = kit.arrow(colour, thick); arrow.userData.least = thick * 7; rig.add(arrow); return arrow; };
    const stands = NAMES.map((name, i) => {
      const one = stand(name, PLATE[i], { i }, R, 0.72);
      one.needle = add(one.group, box(0.03, 0.02, 0.64), glow(0xc8392f), 0, 0.075, 0.66, false, false);   // a pointer to the rule
      one.net = forceArrow(INK.force, 0.035); one.from = NAMES.map((other, j) => forceArrow(PLATE[j], 0.024));
      return one;
    });
    const probe = stand('q', 0x7a4f8f, { i: 2 }, 0.14, 0.44);
    probe.net = forceArrow(INK.force, 0.035); probe.from = [0, 1].map((j) => forceArrow(PLATE[j], 0.024));
    // a distance: a line under the balls with a stroke at each end, and its length written under it
    const spans = [0, 1].map(() => {
      const paint = new T.MeshBasicMaterial({ color: INK.span, depthTest: false, transparent: true, opacity: 0.85 });
      const group = new T.Group(), line = new T.Mesh(box(1, 0.028, 0.028), paint), ends = [0, 1].map(() => new T.Mesh(box(0.028, 0.22, 0.028), paint));
      for (const part of [line, ...ends]) part.renderOrder = 10;
      group.add(line, ...ends); rig.add(group);
      const spot = new T.Vector3(), label = view.label(spot, false, -0.14);
      // from (x1, z1) to (x2, z2) in the scene at the height y, which are so many metres apart
      function lay(x1, z1, x2, z2, y, metres) {
        const long = Math.hypot(x2 - x1, z2 - z1);
        group.position.set((x1 + x2) / 2, y, (z1 + z2) / 2); group.rotation.y = Math.atan2(z1 - z2, x2 - x1);
        line.scale.x = long; ends[0].position.x = -long / 2; ends[1].position.x = long / 2;
        spot.copy(group.position); label.write(`${metres.toFixed(2)} m`);
        group.visible = true; label.show(true);
      }
      return { group, label, lay };
    });
    const tipSpot = new T.Vector3(), tip = view.label(tipSpot);   // what is being set, while something is handled
    const readSpot = new T.Vector3(), readout = view.label(readSpot, true, -0.1);   // the values, in one place
    const NEWTON = 0.8;   // the length of an arrow for 1 N: the largest force between two charges, 8.1 N, is then 65 cm long
    const way = new T.Vector3();
    // An arrow for the force (fx, fz) in N, lying level, from (x, y, z). One too short for its head is flattened along
    // its length and stays as wide.
    function lay(arrow, x, y, z, fx, fz, newton = NEWTON) {
      const f = Math.hypot(fx, fz);
      arrow.visible = f >= 0.0005;
      if (!arrow.visible) return;
      const long = newton * f, least = arrow.userData.least;
      arrow.setLength(Math.max(long, least)); arrow.scale.y = Math.min(1, long / least);
      arrow.position.set(x, y, z); arrow.aim(way.set(fx / f, 0, fz / f));
    }

    // ---------- state shared by the two arrangements ----------
    // auto: the demonstration is under way; fresh: the arrangement has changed since a line was last written; since: when it last changed (ms);
    // stale: the picture of the field must be made anew
    let moved = true, auto = false, stopSoon = false, byScene = false, fresh = true, since = 0, stale = true, tipTime = 0, framed = false, grab = null;
    const demo = { wait: 0, time: 0 };
    function say(text, x, y, z, seconds = 0) { tip.write(text); tipSpot.set(x, y, z); tip.show(true); tipTime = seconds; moved = true; }
    const tall = () => window.matchMedia('(max-aspect-ratio: 4/5)').matches;
    const changed = () => { fresh = true; since = performance.now(); stale = true; moved = true; };
    const charge = (id) => (ctx.values[`${id}Sign`] === 'minus' ? -1 : 1) * ctx.values[`${id}Charge`];
    const START = Object.fromEntries(['aSign', 'aCharge', 'bSign', 'bCharge', 'cSign', 'cCharge', 'probeSign', 'probeCharge'].map((id) => [id, ctx.values[id]]));
    function chargesToStart() {   // the charges the page opens with; what is locked stays as it is
      byScene = true;
      for (const [id, value] of Object.entries(START)) if (!ctx.locked.has(id) && ctx.values[id] !== value) ctx.set(id, value);
      byScene = false;
    }
    // a line of a table, unless it is the line last written
    const addRow = (table, row) => { const last = table.rows[table.rows.length - 1]; if (!last || last.join() !== row.join()) table.add(row); };
    const ray = new T.Raycaster(), upright = new T.Plane(new T.Vector3(0, 0, 1), 0), level = new T.Plane(new T.Vector3(0, 1, 0), -H), low = new T.Plane(new T.Vector3(0, 1, 0), -LEVEL), hit = new T.Vector3();

    // ====================================== the electric force: charges in a line ======================================
    // Coulomb's law: charges q1 and q2 a distance r apart act on each other with a force of size k q1 q2 / r^2 along the
    // line between them, away from each other when they are of one kind and towards each other when they are not.
    // With three in a line the force on each is the sum of the forces from the other two. Along the line, right is +.
    // pos: where each stands on the rule (cm); q: its charge (microcoulombs); push: the force on each (N): from[j] from charge j, net their sum.
    const pos = [40, 50, 75], q = [1, 1, 1], push = NAMES.map(() => ({ net: 0, from: [0, 0, 0] }));
    const tried = new Map();   // "distance in cm / product of the charges" -> force (N), for every pair of charges that has stood on the board
    // With three: mover is the charge last moved, and swept holds the place it stood in (cm) -> the forces on A, B and C,
    // for as long as the other two and the charges stay as they are (key).
    const swept = { key: '', at: new Map() }, netGraph = ctx.spec.menus.graph.find((item) => item.id === 'netPlace');
    let mover = 2;
    const shown = () => (ctx.values.third ? [0, 1, 2] : [0, 1]);
    const apartNow = () => Math.abs(pos[1] - pos[0]);   // how far A and B stand apart (cm)
    // whether charge i may stand at x: on the line and clear of the others
    function free(i, x) {
      if (x < LOW || x > HIGH) return false;
      for (const j of shown()) if (j !== i && Math.abs(x - pos[j]) < NEAR) return false;
      return true;
    }
    function nearest(i, x) {   // the place nearest x where charge i may stand: a charge steps over another that is in its way
      let best = pos[i];
      for (let to = LOW; to <= HIGH; to++) if (free(i, to) && (!free(i, best) || Math.abs(to - x) < Math.abs(best - x))) best = to;
      return best;
    }
    // where the pointer is along the line
    function along(r) {
      if (Math.abs(r.direction.z) > 0.25 && r.intersectPlane(upright, hit)) return hit.x;
      return r.intersectPlane(level, hit) ? hit.x : null;
    }
    const line = {
      ids: ['aSign', 'aCharge', 'bSign', 'bCharge', 'gap', 'third', 'cSign', 'cCharge', 'cPos'],
      look: [{ target: [0, 0.9, 0], r: 13, theta: 0.22, phi: 1.2 }, { target: [0, 0.9, 0], r: 16, theta: 0.85, phi: 1.15 }],   // an upright screen looks along the line from one side, so that all of it is in sight
      enter() { for (const one of stands) one.raise(H); },
      reckon() {
        const v = ctx.values, on = shown();
        IDS.forEach((id, i) => { q[i] = charge(id); push[i].net = 0; push[i].from.fill(0); });
        for (const i of on) for (const j of on) if (i !== j) {
          const r = (pos[i] - pos[j]) / 100, f = K * q[i] * q[j] / (r * r) * Math.sign(r);
          push[i].from[j] = f; push[i].net += f;
        }
        if (!v.third) { tried.set(`${apartNow()}/${Math.abs(q[0] * q[1])}`, Math.abs(push[0].net)); line.graphs(); } else line.sweep();
        changed();
      },
      // The graph: a point for every distance tried with the present product of the charges. The bars: one for every
      // product tried at the present distance, set out in even steps, so that their tops show how the force goes with it.
      graphs() {
        const gap = apartNow(), product = Math.abs(q[0] * q[1]), all = [...tried].map(([key, f]) => [...key.split('/').map(Number), f]);
        const trace = ctx.traces.byGap, chart = ctx.charts.byCharge;
        trace.clear();
        for (const [far, , f] of all.filter((one) => one[1] === product).sort((one, two) => one[0] - two[0])) trace.add(far / 100, f);
        const here = new Map(all.filter((one) => one[0] === gap).map(([, p, f]) => [p, f])), steps = Array.from({ length: Math.max(...here.keys()) }, (_, k) => k + 1);
        chart.title = `거리 ${(gap / 100).toFixed(2)} m · 가로 전하량의 곱`;
        chart.groups = steps.map((p) => (here.has(p) ? String(p) : '')); chart.values = steps.map((p) => (here.has(p) ? [here.get(p)] : null)); chart.stamp++;
      },
      // With three charges: a point in each part of the graph for every place the charge last moved has stood in. Once
      // another is moved or a charge is changed, the points that were there no longer hold, and the graph starts afresh.
      sweep() {
        const key = `${mover}/${pos.filter((x, i) => i !== mover)}/${q.join()}`, traces = [ctx.traces.netA, ctx.traces.netB, ctx.traces.netC];
        if (key !== swept.key) { swept.key = key; swept.at.clear(); }
        netGraph.x = `${NAMES[mover]}의 위치`;
        swept.at.set(pos[mover], push.map((one) => one.net));
        for (const trace of traces) trace.clear();
        for (const [x, nets] of [...swept.at].sort((one, two) => one[0] - two[0])) traces.forEach((trace, i) => trace.add(x / 100, nets[i]));
      },
      // the menu follows what was moved in the scene
      tell() {
        byScene = true;
        const gap = apartNow() / 100, c = pos[2] / 100;
        if (ctx.values.gap !== gap) ctx.set('gap', gap);
        if (ctx.values.cPos !== c) ctx.set('cPos', c);
        byScene = false;
        line.reckon();
      },
      // a line of the table: once an arrangement made by hand has stood for a moment, and wherever the demonstration waits
      note() {
        fresh = false;
        const place = (i) => (pos[i] / 100).toFixed(2);
        if (ctx.values.third) addRow(ctx.tables.table3, [...[0, 1, 2].map((i) => `${amount(q[i])} · ${place(i)}`), ...push.map((one) => aimed(one.net))]);
        else addRow(ctx.tables.table, [amount(q[0]), amount(q[1]), (apartNow() / 100).toFixed(2), Math.abs(push[0].net).toFixed(3), q[0] * q[1] > 0 ? '척력' : '인력']);
      },
      toStart() {   // the arrangement the scene opens with; what is locked stays as it is
        chargesToStart();
        const fixed = ctx.values.third && ctx.locked.has('cPos') && [40, 50].some((x) => Math.abs(x - pos[2]) < NEAR);   // C is held where A or B would go: they stay
        if (!ctx.locked.has('gap') && !fixed) { pos[0] = 40; pos[1] = 50; }
        if (!ctx.locked.has('cPos')) pos[2] = 75;
        pos[2] = nearest(2, pos[2]);
        mover = 2; line.tell();
      },
      // The demonstration: B comes in towards A from as far away as it may stand on its side of A, 1 cm at a time. A
      // line is written where it starts, at 0.80, 0.40 and 0.20 m, where it waits a moment, and where it ends.
      // With three charges it is the charge last moved that goes (C at first): from the left end of the line to the right
      // end, stepping over the other two, and it waits wherever the forces on one of the three cancel.
      startDemo() {
        const withC = ctx.values.third, m = withC ? mover : 1, held = m === 2 ? 'cPos' : 'gap';
        if (ctx.locked.has(held)) { say(`${m === 2 ? 'C의 위치' : '거리'} · 잠금`, X(pos[m]), 0.3, 1.6, 2.5); stopSoon = true; return false; }
        const away = withC ? 1 : pos[1] > pos[0] ? 1 : -1;
        let first = withC ? LOW : pos[1];
        if (withC) while (!free(m, first)) first++; else while (free(1, first + away)) first += away;
        auto = true; demo.wait = 0.8; demo.time = 0; ctx.seek(0);
        pos[m] = first; line.tell(); line.note();
        return true;
      },
      demoTick(dt) {
        if (demo.wait > 0) { demo.wait -= dt; return; }
        demo.time += dt;
        while (auto && demo.time >= 0.08) {
          demo.time -= 0.08;
          if (ctx.values.third) {
            let next = pos[mover] + 1;
            while (next <= HIGH && !free(mover, next)) next++;
            if (next > HIGH) { auto = false; stopSoon = true; line.note(); break; }   // the far end: the demonstration is over
            pos[mover] = next; line.tell();
            if (push.some((one) => Math.abs(one.net) < 0.0005)) { demo.wait = 1.2; demo.time = 0; line.note(); break; }
            continue;
          }
          const to = pos[1] + (pos[1] > pos[0] ? -1 : 1);
          if (!free(1, to)) { auto = false; stopSoon = true; line.note(); break; }   // as near as it may come: the demonstration is over
          pos[1] = to; line.tell();
          if ([80, 40, 20].includes(apartNow())) { demo.wait = 0.8; demo.time = 0; line.note(); break; }
        }
      },
      // handling: a stand is slid along the line; pressed without being moved, its charge becomes the other kind
      handles: () => shown().map((i) => stands[i].handle),
      start(grip, r) {
        const x = along(r);
        if (x === null) return false;
        grab = { i: grip.i, from: x, offset: x - X(pos[grip.i]), moved: false };
        return true;
      },
      move(r) {
        const x = along(r);
        if (x === null || (!grab.moved && Math.abs(x - grab.from) < 0.12)) return;
        grab.moved = true;
        const i = grab.i, with3 = ctx.values.third;
        if (ctx.locked.has(i === 2 ? 'cPos' : 'gap')) { say('잠금', X(pos[i]), 0.3, 1.6); return; }
        const to = nearest(i, Math.round((x - grab.offset) * 10 + MID));
        if (to !== pos[i]) { pos[i] = to; if (with3) mover = i; line.tell(); }
        say(shown().filter((j) => j !== i).map((j) => `${with3 ? `${NAMES[j]}까지 ` : '거리 '}${(Math.abs(pos[i] - pos[j]) / 100).toFixed(2)} m`).join(' · '), X(pos[i]), 0.3, 1.6);
      },
      end(held) {
        const id = `${IDS[held.i]}Sign`;
        if (!held.moved && !ctx.locked.has(id)) ctx.set(id, ctx.values[id] === 'minus' ? 'plus' : 'minus');
      },
      changed(id, value) {
        if (id === 'gap') {   // B goes to that distance from A, on the side of A it is on; near the end of the line A makes room
          const gap = Math.round(value * 100), side = pos[1] > pos[0] ? 1 : -1;
          pos[1] = Math.max(LOW, Math.min(HIGH, pos[0] + side * gap)); pos[0] = pos[1] - side * gap;
          mover = 1;
        }
        if (id === 'cPos' || (id === 'third' && value)) mover = 2;   // C is moved, or has just been put on the board
        if (id === 'cPos') pos[2] = Math.round(value * 100);
        pos[2] = nearest(2, pos[2]);   // C keeps clear of the other two
        line.tell();
      },
      draw() {
        const v = ctx.values, on = shown(), parts = Boolean(v.third && v.parts);
        rule.visible = true;
        stands.forEach((one, i) => {
          const here = on.includes(i), x = X(pos[i]);
          one.group.visible = here; one.needle.visible = true;
          if (!here) return;
          one.group.position.set(x, TOP, 0); one.ball.material.color.copy(q[i] > 0 ? TINT.plus : TINT.minus); one.sign.material.map = markOf(q[i]);
          // The force on it starts at the side of the ball it points to. The three stand a little apart in height and
          // depth, so that long arrows that pass one another can be told apart.
          const f = push[i].net;
          if (v.forces) lay(one.net, x + Math.sign(f) * R, H + (1 - i) * 0.1, (1 - i) * 0.1, f, 0);
          if (parts) on.filter((j) => j !== i).forEach((j, k) => lay(one.from[j], x, H + R + 0.2 + k * 0.2, 0, push[i].from[j], 0));
        });
        if (v.numbers) {
          if (tall()) readSpot.set(0, v.third ? 5.6 : 4.4, 0); else readSpot.set(0, 0.1, 1.7);   // in front of the rule; on an upright screen high over the balls, clear of the panel that rises from below
          // with three, a line for each: the force from each of the other two and their sum (in two lines on an upright screen, which is narrow)
          readout.write(v.third ? on.map((i) => `<b>${NAMES[i]}</b> ${amount(q[i])} ${MICRO}${tall() ? ` · 합력 <b>${aimed(push[i].net)} N</b><br>` : ' · '}${on.filter((j) => j !== i).map((j) => `${NAMES[j]}에게서 ${aimed(push[i].from[j])} N`).join(' · ')}${tall() ? '' : ` · 합력 <b>${aimed(push[i].net)} N</b>`}`).join('<br>')
            : `<b>A</b> ${amount(q[0])} ${MICRO} · <b>B</b> ${amount(q[1])} ${MICRO}<br>거리 ${(apartNow() / 100).toFixed(2)} m<br>전기력 <b>${Math.abs(push[0].net).toFixed(3)} N</b> (${q[0] * q[1] > 0 ? '척력' : '인력'})`);
          readout.show(true);
        }
        if (!v.span) return;
        const row = on.slice().sort((one, two) => pos[one] - pos[two]);   // each beside its neighbour
        for (let k = 0; k < row.length - 1; k++) spans[k].lay(X(pos[row[k]]), 0.02, X(pos[row[k + 1]]), 0.02, H - 0.55, (pos[row[k + 1]] - pos[row[k]]) / 100);
      },
    };

    // ====================================== the electric field: charges on the board ======================================
    // The field of a point charge Q at a distance r is k Q / r^2, away from it if it is positive and towards it if it
    // is negative; the field of two is the sum of theirs. A test charge q feels the force F = q E. Fields are kept in
    // units of 1e5 N/C: with Q in microcoulombs and r in m that is 0.09 Q / r^2, and the force on q (microcoulombs) is
    // 0.1 q E newtons.
    // at: where A, B and the test charge stand on the board (cm: along it, and from its far edge); here: what the test
    // charge meets where it stands: e, the field (1e5 N/C), f, the force on it (N), from[j] the force from charge j, far[j] its distance from j (m).
    const at = [[30, 25], [70, 25], [50, 25]], HOME = at.map((one) => [...one]), PROBE = 2;
    const here = { e: 0, f: [0, 0], from: [[0, 0], [0, 0]], far: [0, 0] }, charges = [1, 1, 1];   // charges: of A, of B and of the test charge
    const seen = { key: 0, at: new Map() };   // one charge alone: distance from it (m) -> its field there, while its charge stays as it is (key)
    const sources = () => (ctx.values.second ? [0, 1] : [0]), inPlay = () => (ctx.values.probe ? [...sources(), PROBE] : sources());
    // the field at (x, z) in the scene (units of 1e5 N/C) of the charges that stand on the board, put into out
    function fieldAt(x, z, out) {
      out[0] = out[1] = 0;
      for (const j of sources()) {
        const dx = (x - X(at[j][0])) / 10, dz = (z - Z(at[j][1])) / 10, r2 = dx * dx + dz * dz;
        if (r2 < 1e-10) continue;
        const k = 0.09 * charges[j] / (r2 * Math.sqrt(r2));
        out[0] += k * dx; out[1] += k * dz;
      }
      return out;
    }
    // whether thing i may stand at (x, z): on the board and clear of the others
    function room(i, x, z) {
      if (x < LOW || x > HIGH || z < 0 || z > DEEP) return false;
      for (const j of inPlay()) if (j !== i && Math.hypot(x - at[j][0], z - at[j][1]) < NEAR - 1e-9) return false;
      return true;
    }
    function nearby(i, x, z) {   // the place nearest (x, z) where thing i may stand
      const cx = Math.max(LOW, Math.min(HIGH, Math.round(x))), cz = Math.max(0, Math.min(DEEP, Math.round(z)));
      if (room(i, cx, cz)) return [cx, cz];
      let best = at[i], least = Infinity;
      for (let px = cx - NEAR - 2; px <= cx + NEAR + 2; px++) for (let pz = cz - NEAR - 2; pz <= cz + NEAR + 2; pz++) {
        const d = Math.hypot(px - x, pz - z);
        if (d < least && room(i, px, pz)) { least = d; best = [px, pz]; }
      }
      return best;
    }
    // ---------- the field drawn as arrows: one at every 5 cm of the board, its tail at that point, as long as the field
    // there is strong. So the arrows of one charge follow the inverse square law: a quarter as long at twice the
    // distance. An arrow is a shaft and a head, each set out many times over; one shorter than its head is the head
    // alone, flattened along its length. ----------
    const fieldGroup = new T.Group(); fieldGroup.position.y = LEVEL; rig.add(fieldGroup);
    const FIELD = 0.05, TIP = 0.12, CLEAR = 0.95;   // FIELD: the length of an arrow for 1e5 N/C (0.5 cm); TIP: the length of its head; CLEAR: no arrows nearer a charge than this (the test charge comes no nearer either)
    const flat = (points) => { const shape = new T.BufferGeometry(); shape.setAttribute('position', new T.Float32BufferAttribute(points, 3)); return shape; };
    const COLS = (HIGH - LOW) / 5 + 1, ROWS = DEEP / 5 + 1, navy = new T.MeshBasicMaterial({ color: INK.field, side: T.DoubleSide });
    const shafts = new T.InstancedMesh(flat([0, 0, -0.022, 1, 0, -0.022, 1, 0, 0.022, 0, 0, -0.022, 1, 0, 0.022, 0, 0, 0.022]), navy, COLS * ROWS);   // lying level, from the tail along +x, one unit long
    const tips = new T.InstancedMesh(flat([0, 0, -0.075, TIP, 0, 0, 0, 0, 0.075]), navy, COLS * ROWS);
    for (const mesh of [shafts, tips]) { mesh.frustumCulled = false; fieldGroup.add(mesh); }
    const place = new T.Matrix4(), turn = new T.Quaternion(), size = new T.Vector3(), where = new T.Vector3(), UPWARD = new T.Vector3(0, 1, 0), e2 = [0, 0];
    function drawDarts() {
      for (let c = 0, n = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++, n++) {
        const x = X(LOW + c * 5), z = Z(r * 5), [ex, ez] = fieldAt(x, z, e2), e = Math.hypot(ex, ez);
        const hidden = e < 1e-6 || sources().some((j) => Math.hypot(x - X(at[j][0]), z - Z(at[j][1])) < CLEAR);
        const long = hidden ? 0 : FIELD * e, shaft = Math.max(0, long - TIP);
        turn.setFromAxisAngle(UPWARD, Math.atan2(-ez, ex));
        shafts.setMatrixAt(n, place.compose(where.set(x, 0, z), turn, size.set(shaft, shaft ? 1 : 0, shaft ? 1 : 0)));
        if (!hidden) where.set(x + ex / e * shaft, 0, z + ez / e * shaft);
        tips.setMatrixAt(n, place.compose(where, turn, size.set(Math.min(1, long / TIP), hidden ? 0 : 1, hidden ? 0 : 1)));
      }
      shafts.instanceMatrix.needsUpdate = true; tips.instanceMatrix.needsUpdate = true;
    }
    // ---------- the field drawn as lines (a model): they leave positive charges and end on negative ones, so many for each
    // microcoulomb. A line is followed from where it leaves a ball, a short step at a time along the field, until it meets
    // a ball of the other kind or leaves the board. ----------
    const STEP = 0.08, MOST = { lines: 2 * 3 * 16, steps: 300 };
    const strands = new T.LineSegments(new T.BufferGeometry(), new T.LineBasicMaterial({ color: INK.field, transparent: true, opacity: 0.8 })); strands.frustumCulled = false; fieldGroup.add(strands);
    const strandAt = new T.BufferAttribute(new Float32Array(MOST.lines * MOST.steps * 6), 3); strands.geometry.setAttribute('position', strandAt);
    const head = new T.BufferGeometry(); head.setAttribute('position', new T.Float32BufferAttribute([-0.09, 0, -0.08, 0.13, 0, 0, -0.09, 0, 0.08], 3));
    const heads = new T.InstancedMesh(head, new T.MeshBasicMaterial({ color: INK.field, side: T.DoubleSide }), MOST.lines); heads.frustumCulled = false; fieldGroup.add(heads);
    let filled = 0, drawn = 0;   // how much of the lines' store is in use, and how many lines have a head
    // Follows one line from ball s, leaving it at the angle given: forwards along the field (dir 1) or backwards (dir -1).
    // Returns the ball it ends on and the angle at which it arrives there, or null.
    function strand(s, angle, dir) {
      const array = strandAt.array, ends = sources().filter((j) => charges[j] * dir < 0);
      let x = X(at[s][0]) + R * Math.cos(angle), z = Z(at[s][1]) + R * Math.sin(angle), long = 0, marked = false, met = null;
      for (let n = 0; n < MOST.steps && !met; n++) {
        let [ex, ez] = fieldAt(x, z, e2), e = Math.hypot(ex, ez);
        if (e < 1e-6) break;
        [ex, ez] = fieldAt(x + dir * ex / e * STEP / 2, z + dir * ez / e * STEP / 2, e2); e = Math.hypot(ex, ez);   // the direction half a step on
        if (e < 1e-6) break;
        const nx = x + dir * ex / e * STEP, nz = z + dir * ez / e * STEP;
        array.set([x, 0, z, nx, 0, nz], filled); filled += 6; long += STEP;
        if (!marked && long >= 1) {   // an arrowhead a little way along it, pointing the way of the field
          marked = true; turn.setFromAxisAngle(UPWARD, Math.atan2(-ez, ex));
          heads.setMatrixAt(drawn++, place.compose(where.set(nx, 0, nz), turn, size.setScalar(1)));
        }
        x = nx; z = nz;
        if (Math.abs(x) > 5.2 || Math.abs(z) > 3) break;   // the edge of the board
        for (const j of ends) if (Math.hypot(x - X(at[j][0]), z - Z(at[j][1])) < R) met = [j, Math.atan2(z - Z(at[j][1]), x - X(at[j][0]))];
      }
      return met;
    }
    function drawStrands() {
      const on = sources(), each = ctx.values.lineCount, came = on.map(() => []);
      // the lines of a ball are set evenly round it, turned so that none runs straight at the other ball
      const facing = (s) => (on.length > 1 ? Math.atan2(Z(at[1 - s][1]) - Z(at[s][1]), X(at[1 - s][0]) - X(at[s][0])) : 0);
      filled = drawn = 0;
      for (const s of on) if (charges[s] > 0) {
        const n = each * charges[s];
        for (let k = 0; k < n; k++) { const met = strand(s, facing(s) + (k + 0.5) * 2 * Math.PI / n, 1); if (met) came[on.indexOf(met[0])].push(met[1]); }
      }
      // A negative ball has as many lines as its charge asks for: those that have not come to it from a positive ball are
      // followed backwards from it, set evenly in the widest gap between the lines that have come.
      for (const s of on) if (charges[s] < 0) {
        const n = each * -charges[s], angles = came[on.indexOf(s)].sort((one, two) => one - two), lack = n - angles.length;
        if (lack <= 0) continue;
        let from = facing(s), wide = 2 * Math.PI;
        if (angles.length) { wide = 0; angles.forEach((angle, k) => { const gap = (k + 1 < angles.length ? angles[k + 1] : angles[0] + 2 * Math.PI) - angle; if (gap > wide) { wide = gap; from = angle; } }); }
        for (let k = 0; k < lack; k++) strand(s, from + (k + 0.5) * wide / lack, -1);
      }
      strandAt.needsUpdate = true; strands.geometry.setDrawRange(0, filled / 3); heads.count = drawn; heads.instanceMatrix.needsUpdate = true;
    }
    // where the pointer is on the level of the balls, in cm
    function across(r) { return r.intersectPlane(low, hit) ? [hit.x * 10 + MID, hit.z * 10 + DEEP / 2] : null; }
    const field = {
      ids: ['aSign', 'aCharge', 'bSign', 'bCharge', 'second', 'probe', 'probeCharge', 'probeSign'],
      look: [{ target: [0, 0.7, 0.2], r: 12.5, theta: 0, phi: 0.72 }, { target: [0, 0.7, 0], r: 13.5, theta: Math.PI / 2, phi: 0.62 }],   // from above; an upright screen from one end, so that the long side of the board runs up it
      // the test charge and the arrows of the field are there whenever the field is shown (the frame switches off what is out of sight)
      enter() {
        for (const one of [...stands, probe]) one.raise(LEVEL);
        for (const id of ['probe', 'arrows']) if (!ctx.values[id]) ctx.set(id, true);
      },
      reckon() {
        const v = ctx.values;
        charges[0] = charge('a'); charges[1] = charge('b'); charges[PROBE] = charge('probe');
        for (const k of [0, 1]) if (!room(k, ...at[k]) && inPlay().includes(k)) at[k] = nearby(k, ...at[k]);   // (a ball newly put on the board keeps clear of the others)
        if (v.probe && !room(PROBE, ...at[PROBE])) at[PROBE] = nearby(PROBE, ...at[PROBE]);
        const px = X(at[PROBE][0]), pz = Z(at[PROBE][1]), qp = charges[PROBE];
        here.f[0] = here.f[1] = 0;
        for (const j of [0, 1]) {
          const dx = (px - X(at[j][0])) / 10, dz = (pz - Z(at[j][1])) / 10, r = Math.hypot(dx, dz), f = sources().includes(j) && r > 1e-6 ? K * charges[j] * qp / (r * r * r) : 0;   // (a test charge that is put away may lie under a ball)
          here.far[j] = r; here.from[j][0] = f * dx; here.from[j][1] = f * dz;
          here.f[0] += here.from[j][0]; here.f[1] += here.from[j][1];
        }
        here.e = Math.hypot(...fieldAt(px, pz, e2));
        // one charge alone: its field against the distance from it
        if (v.probe && !v.second) {
          if (seen.key !== Math.abs(charges[0])) { seen.key = Math.abs(charges[0]); seen.at.clear(); }
          seen.at.set(Number(here.far[0].toFixed(3)), here.e);
          ctx.traces.fieldGap.clear();
          for (const [r, e] of [...seen.at].sort((one, two) => one[0] - two[0])) ctx.traces.fieldGap.add(r, e);
        }
        changed();
      },
      // a line of the table: once the test charge has stood for a moment where it was put, and wherever the demonstration waits
      note() {
        fresh = false;
        if (!ctx.values.probe) return;
        addRow(ctx.tables.fieldTable, [`${amount(charges[0])} · ${here.far[0].toFixed(2)}`, ctx.values.second ? `${amount(charges[1])} · ${here.far[1].toFixed(2)}` : '–',
          amount(charges[PROBE]), Math.hypot(...here.f).toFixed(3), here.e.toFixed(2)]);
      },
      toStart() { chargesToStart(); at.forEach((one, i) => { at[i] = [...HOME[i]]; }); field.reckon(); },
      // The demonstration: the test charge is carried straight away from A, from 10 cm from it to the edge of the board,
      // 1 cm at a time. A line is written where it starts, at 0.20 and 0.40 m, where it waits a moment, and where it ends.
      path: [],
      startDemo() {
        if (!ctx.values.probe) { say('시험 전하를 놓으면 A에서 멀어지며 전기장을 잽니다', 0, LEVEL + 0.6, 0, 3); stopSoon = true; return false; }
        const [ax, az] = at[0], far = Math.hypot(at[PROBE][0] - ax, at[PROBE][1] - az), ux = (at[PROBE][0] - ax) / far, uz = (at[PROBE][1] - az) / far;
        field.path = [];
        for (let d = NEAR; d < 120; d++) {   // every whole centimetre along that line that is on the board and clear of B
          const x = Math.round(ax + ux * d), z = Math.round(az + uz * d), last = field.path[field.path.length - 1];
          if (x < LOW || x > HIGH || z < 0 || z > DEEP) break;
          if (Math.hypot(x - ax, z - az) < NEAR || (ctx.values.second && Math.hypot(x - at[1][0], z - at[1][1]) < NEAR) || (last && last[0] === x && last[1] === z)) continue;
          field.path.push([x, z, d]);
        }
        if (!field.path.length) { stopSoon = true; return false; }
        auto = true; demo.wait = 0.8; demo.time = 0; ctx.seek(0);
        at[PROBE] = field.path.shift().slice(0, 2); field.reckon(); field.note();
        return true;
      },
      demoTick(dt) {
        if (demo.wait > 0) { demo.wait -= dt; return; }
        demo.time += dt;
        while (auto && demo.time >= 0.08) {
          demo.time -= 0.08;
          const next = field.path.shift();
          if (!next) { auto = false; stopSoon = true; field.note(); break; }   // the edge of the board: the demonstration is over
          at[PROBE] = next.slice(0, 2); field.reckon();
          if (next[2] === 20 || next[2] === 40) { demo.wait = 0.8; demo.time = 0; field.note(); break; }
        }
      },
      // handling: a stand is carried about the board; pressed without being moved, its charge becomes the other kind
      // (the test charge only in the advanced mode, where it may be negative)
      handles: () => [stands[0].handle, ...(ctx.values.second ? [stands[1].handle] : []), ...(ctx.values.probe ? [probe.handle] : [])],
      start(grip, r) {
        const p = across(r);
        if (!p) return false;
        grab = { i: grip.i, from: p, offset: [p[0] - at[grip.i][0], p[1] - at[grip.i][1]], moved: false };
        return true;
      },
      move(r) {
        const p = across(r);
        if (!p || (!grab.moved && Math.hypot(p[0] - grab.from[0], p[1] - grab.from[1]) < 1.2)) return;
        grab.moved = true;
        const i = grab.i, to = nearby(i, p[0] - grab.offset[0], p[1] - grab.offset[1]);
        if (to[0] !== at[i][0] || to[1] !== at[i][1]) { at[i] = to; field.reckon(); }
        if (ctx.values.probe) say(sources().map((j) => `${NAMES[j]}에서 ${here.far[j].toFixed(2)} m`).join(' · '), X(at[i][0]), LEVEL + 0.55, Z(at[i][1]));
      },
      end(held) {
        const id = `${['a', 'b', 'probe'][held.i]}Sign`;
        if (!held.moved && !ctx.locked.has(id) && (held.i !== PROBE || ctx.advanced)) ctx.set(id, ctx.values[id] === 'minus' ? 'plus' : 'minus');
      },
      changed() { field.reckon(); },
      draw() {
        const v = ctx.values, on = sources(), qp = charges[PROBE], px = X(at[PROBE][0]), pz = Z(at[PROBE][1]);
        rule.visible = false;
        stands.forEach((one, i) => {
          one.group.visible = on.includes(i); one.needle.visible = false;
          if (!one.group.visible) return;
          one.group.position.set(X(at[i][0]), TOP, Z(at[i][1])); one.ball.material.color.copy(charges[i] > 0 ? TINT.plus : TINT.minus); one.sign.material.map = markOf(charges[i]);
        });
        probe.group.visible = v.probe;
        probe.group.position.set(px, TOP, pz); probe.ball.material.color.copy(qp > 0 ? TINT.plus : TINT.minus); probe.sign.material.map = markOf(Math.sign(qp));
        fieldGroup.visible = true; fieldGroup.position.y = LEVEL; shafts.visible = tips.visible = v.arrows; strands.visible = heads.visible = v.lines;
        if (stale) { stale = false; if (v.arrows) drawDarts(); if (v.lines) drawStrands(); }
        if (v.probe) {
          const f = Math.hypot(...here.f);
          // the force on the test charge starts at the side of the ball it points to; the force from each charge is drawn from its middle
          if (v.forces && f >= 0.0005) lay(probe.net, px + here.f[0] / f * 0.14, LEVEL, pz + here.f[1] / f * 0.14, ...here.f);
          if (v.parts && v.second) on.forEach((j) => lay(probe.from[j], px, LEVEL + 0.06, pz, ...here.from[j]));
        }
        if (v.span) {   // from each charge to the test charge; without one, from A to B
          if (v.probe) on.forEach((j) => spans[j].lay(X(at[j][0]), Z(at[j][1]), px, pz, LEVEL, here.far[j]));
          else if (v.second) spans[0].lay(X(at[0][0]), Z(at[0][1]), X(at[1][0]), Z(at[1][1]), LEVEL, Math.hypot(at[1][0] - at[0][0], at[1][1] - at[0][1]) / 100);
        }
        if (!v.numbers) return;
        if (tall()) readSpot.set(-6.9, 0.2, 0); else readSpot.set(3.9, 0.1, 3.15);   // at the front edge of the board, to the right, clear of the bar of viewpoints; on an upright screen beyond the end of the board that is uppermost
        const names = on.map((j) => `<b>${NAMES[j]}</b> ${amount(charges[j])} ${MICRO}`).join(' · ');
        readout.write(!v.probe ? names : `${names} · <b>시험 전하</b> ${amount(qp)} ${MICRO}<br>${on.map((j) => `${NAMES[j]}에서 ${here.far[j].toFixed(2)} m`).join(' · ')}<br>${
          v.parts && v.second ? `${on.map((j) => `${NAMES[j]}에게서 ${Math.hypot(...here.from[j]).toFixed(3)} N`).join(' · ')}<br>` : ''
        }전기력 <b>${Math.hypot(...here.f).toFixed(3)} N</b><br>전기장 <b>${powers(here.e)} N/C</b> (전기력 ÷ 시험 전하량)`);
        readout.show(true);
      },
    };

    // ====================================== a uniform field: a charge between two bars ======================================
    // Two long bars stand across the board, joined to a supply: the far one positive, the near one negative. Between
    // them the field E is the same everywhere and points from the far bar to the near one. A charged puck slides on the
    // board between them, and under their edges, so that its middle can come right up to the face of a bar.
    // The force on the puck is F = q E. Potential energy is counted from the negative bar: at the distance d from it
    // the puck has U = q E d, the work it takes to carry it there, and the potential there is V = U / q = E d.
    // Let go from rest it gains speed evenly, a = q E / m, straight towards the bar that pulls it, and U + K stays as
    // it was. With a speed along the bars at the start it keeps that speed and follows a parabola.
    const GAP = 40, SIDE = [18, 72], FAR_Z = 5;   // cm: between the faces of the bars; how far along the board the puck may be; where the face of the far (positive) bar is
    const PUSH = 4, EVEN = 0.2;                    // the length of an arrow for 1 N here, where forces are small, and for a field of 1e5 N/C
    const plateRig = new T.Group(); rig.add(plateRig);
    const signs = (negative) => canvasTexture(1260, 64, (g, w, h) => { g.fillStyle = '#ffffff'; for (let x = 45; x < w; x += 90) { g.fillRect(x - 14, h / 2 - 3.5, 28, 7); if (!negative) g.fillRect(x - 3.5, h / 2 - 14, 7, 28); } });
    for (const [z, out, colour, negative] of [[Z(FAR_Z), -1, 0xd9584a, false], [Z(FAR_Z + GAP), 1, 0x3f6fd0, true]]) {   // a bar on a post at each end, its face at z, with the signs of its charge on it
      const mid = z + out * 0.08, marked = new T.MeshBasicMaterial({ map: signs(negative), transparent: true });
      add(plateRig, box(6.3, 0.5, 0.16), mat(colour), 0, TOP + 0.38, mid);
      for (const x of [-3.07, 3.07]) add(plateRig, box(0.16, 0.13, 0.16), M.dark, x, TOP + 0.065, mid);
      add(plateRig, new T.PlaneGeometry(6.3, 0.16), marked, 0, TOP + 0.632, mid, false, false).rotation.x = -Math.PI / 2;
      for (const side of [-1, 1]) add(plateRig, new T.PlaneGeometry(6.3, 0.32), marked, 0, TOP + 0.38, mid + side * 0.082, false, false).rotation.y = side > 0 ? 0 : Math.PI;
    }
    // the supply, with a lead to each bar
    add(plateRig, box(0.9, 0.5, 0.7), M.dark, 4.3, TOP + 0.25, 0);
    add(plateRig, box(0.5, 0.2, 0.02), glow(0xcfe9d2), 4.3, TOP + 0.33, 0.36, false, false);
    for (const [z, colour, to] of [[-0.2, 0xc8392f, Z(FAR_Z) - 0.08], [0.2, 0x2b2b2b, Z(FAR_Z + GAP) + 0.08]]) {
      add(plateRig, cyl(0.05, 0.05, 0.08, 12).rotateZ(Math.PI / 2), mat(colour), 3.82, TOP + 0.2, z, false);
      const long = Math.hypot(3.8 - 3.07, z - to), lead = add(plateRig, box(long, 0.03, 0.03), mat(colour), (3.8 + 3.07) / 2, TOP + 0.02, (z + to) / 2, false);
      lead.rotation.y = Math.atan2(to - z, 3.8 - 3.07);
    }
    // a rule beside the bars that reads in cm from the face of the negative bar
    add(plateRig, box(0.46, 0.05, 4.2), M.rule, -3.5, TOP + 0.025, 0);
    add(plateRig, new T.PlaneGeometry(0.46, 4.2), mat(0xffffff, { map: canvasTexture(104, 950, (g, w, h) => {
      g.fillStyle = '#f2d675'; g.fillRect(0, 0, w, h); g.strokeStyle = g.fillStyle = '#4a3f1c';
      g.font = '700 38px Helvetica, Arial, sans-serif'; g.textAlign = 'left'; g.textBaseline = 'middle';
      for (let c = 0; c <= GAP; c++) {
        const y = h - (c + 1) * h / 42, long = c % 10 === 0 ? 0.46 : c % 5 === 0 ? 0.34 : 0.2;
        g.lineWidth = c % 10 === 0 ? 4 : 2; g.beginPath(); g.moveTo(w, y); g.lineTo(w * (1 - long), y); g.stroke();
        if (c % 10 === 0) g.fillText(String(c), 6, y);
      }
    }) }), -3.5, TOP + 0.052, 0, false).rotation.x = -Math.PI / 2;
    // the potential every 10 cm: a line across the board and its value beside the rule
    const voltLines = new T.Group(); plateRig.add(voltLines);
    const volts = [0, 1, 2, 3, 4].map((k) => {
      const z = Z(FAR_Z + GAP - 10 * k);
      add(voltLines, box(6, 0.012, 0.025), glow(0x8a6d1f), 0, TOP + 0.008, z, false, false);
      return { spot: new T.Vector3(-4.45, TOP, z), z };
    });
    for (const one of volts) one.label = view.label(one.spot);
    // the puck, the force on it and the force of the hand that holds it, and where it has been at even times
    const puck = new T.Group(); puck.position.y = TOP; plateRig.add(puck);
    const disc = add(puck, cyl(0.22, 0.22, 0.09, 32), new T.MeshStandardMaterial({ roughness: 0.55 }), 0, 0.045, 0);
    const puckSign = new T.Sprite(new T.SpriteMaterial({ map: markOf(1), depthTest: false })); puckSign.scale.set(0.3, 0.3, 1); puckSign.position.y = 0.1; puckSign.renderOrder = 11; puck.add(puckSign);
    const puckHandle = add(puck, cyl(0.42, 0.42, 0.5, 16), M.dark, 0, 0.25, 0, false, false); puckHandle.visible = false; puckHandle.userData.grip = { i: 0 };
    const pull = forceArrow(INK.force, 0.035), hold = forceArrow(0x4a4f61, 0.035);
    const trail = new T.InstancedMesh(cyl(0.05, 0.05, 0.012, 12), glow(INK.span), 80); trail.frustumCulled = false; plateRig.add(trail);
    const floor = new T.Plane(new T.Vector3(0, 1, 0), -(TOP + 0.05));
    // where the pointer is on the board, in cm
    function onBoard(r) { return r.intersectPlane(floor, hit) ? [hit.x * 10 + MID, hit.z * 10 + DEEP / 2] : null; }
    // run: e: the field (1e5 N/C); q: the charge of the puck (microcoulombs); m: its mass (kg); f: the force on it (N), towards the
    // negative bar if it is positive; a: its acceleration (m/s^2); v0: its speed along the bars at the start (m/s);
    // x0, s0: where it is let go (m along the board; m from the negative bar); t: seconds since; until: when it ends;
    // x, s, v: where it is and how fast now; edge: it passes the end of the bars before it meets one; dots: places kept so far;
    // home: where along the board it was last put by hand.
    const run = { state: 'ready', e: 1, q: 1, m: 0.1, f: 0.1, a: 1, v0: 0, home: 0.45, x0: 0.45, s0: 0.2, t: 0, until: 0, x: 0.45, s: 0.2, v: 0, edge: false, dots: 0, row: null };
    const bars = {
      ids: ['fieldE', 'probeCharge', 'probeSign', 'drop', 'mass', 'speed0'],
      look: [{ target: [0.3, 0.4, 0.9], r: 12, theta: 0, phi: 0.72 }, { target: [-0.35, 0.4, 0], r: 16.5, theta: 0, phi: 0.5 }],   // from above the near side; an upright screen holds the rule and the bars, not the supply
      enter() { if (!ctx.values.arrows) ctx.set('arrows', true); },
      // where the puck is t seconds after it is let go
      at(t) {
        const fall = run.a * t * t / 2;
        run.s = run.q > 0 ? Math.max(0, run.s0 - fall) : Math.min(GAP / 100, run.s0 + fall); run.x = run.x0 + run.v0 * t; run.v = Math.hypot(run.v0, run.a * t);
      },
      energies() { const u = run.f * run.s, k = run.m * run.v * run.v / 2; return [u, k, u + k]; },
      // the puck held where it is to be let go, with the values as they are set
      toStart() {
        const v = ctx.values;
        Object.assign(run, { state: 'ready', e: v.fieldE, q: charge('probe'), m: ctx.advanced ? v.mass : 0.1, v0: ctx.advanced ? v.speed0 : 0, s0: v.drop, t: 0, dots: 0, row: null });
        run.x0 = run.v0 > 0 ? SIDE[0] / 100 : run.home;   // with a speed along the bars it starts from their left end
        run.f = 0.1 * run.q * run.e; run.a = Math.abs(run.f) / run.m;
        const far = run.q > 0 ? run.s0 : GAP / 100 - run.s0, meets = Math.sqrt(2 * far / run.a), leaves = run.v0 > 0 ? (SIDE[1] / 100 - run.x0) / run.v0 : Infinity;   // to the bar that pulls it; to the end of the bars
        run.until = Math.min(meets, leaves); run.edge = leaves < meets;
        bars.at(0); bars.chart(); changed();
      },
      // What is on show once a run is over is what the puck had at the moment it met the bar (or passed the end of the
      // bars): its kinetic energy is still there. What becomes of it afterwards is not followed.
      ended: () => (run.state !== 'done' ? '' : run.edge ? '판의 끝을 지나는 순간' : `${run.q > 0 ? '(−)' : '(+)'}판에 닿는 순간`),
      chart() {
        const now3 = bars.energies();
        for (const chart of [ctx.charts.energy, ctx.charts.energySigned]) { chart.groups = [bars.ended() ? `J · ${bars.ended()}` : 'J']; chart.set(0, now3); }   // (written under the bars, beside the unit)
      },
      reckon() { bars.toStart(); },
      note() { fresh = false; },   // (a line is written when the puck is let go)
      // let go: a line of the table with what it has where it starts; how fast it ends is written into that line when it ends
      startDemo() {
        if (run.state !== 'ready') bars.toStart();
        run.state = 'run'; auto = true; ctx.seek(0);
        run.row = [run.e.toFixed(1), amount(run.q), run.s0.toFixed(2), Math.abs(run.f).toFixed(3), minus((run.f * run.s0).toFixed(3)), (run.e * 1e5 * run.s0).toFixed(0), run.m.toFixed(2), '–'];
        ctx.tables.plateTable.add(run.row);
        return true;
      },
      demoTick(dt) {
        run.t = Math.min(run.until, run.t + dt);
        for (; run.dots < 80 && run.dots * 0.1 <= run.t + 1e-9; run.dots++) {   // where it is every 0.1 s
          bars.at(run.dots * 0.1);
          trail.setMatrixAt(run.dots, place.makeTranslation(X(run.x * 100), TOP + 0.006, Z(FAR_Z + GAP - run.s * 100)));
        }
        trail.instanceMatrix.needsUpdate = true;
        bars.at(run.t); bars.chart(); moved = true;
        if (run.t >= run.until - 1e-9) bars.finish();
      },
      finish() {
        run.state = 'done'; auto = false; stopSoon = true;
        const rows = ctx.tables.plateTable.rows;
        if (rows[rows.length - 1] === run.row) ctx.tables.plateTable.add([...run.row.slice(0, 7), run.v.toFixed(2)], true);
        bars.chart();
        if (run.edge) say('판의 끝을 지나 균일한 전기장을 벗어났습니다', X(run.x * 100), TOP + 0.9, Z(FAR_Z + GAP - run.s * 100), 3.5);
        moved = true;
      },
      // Handling: the puck is carried about between the bars and let go. Carried towards or away from the negative bar
      // it is set at another distance; along the bars only its place changes. After a run a press on it puts it back.
      handles: () => [puckHandle],
      start(grip, r) {
        if (run.state !== 'ready') { ctx.emit('action', 'reset'); return false; }
        const p = onBoard(r);
        if (!p) return false;
        grab = { from: p, offset: [p[0] - run.x0 * 100, p[1] - (FAR_Z + GAP - run.s0 * 100)], moved: false };
        return true;
      },
      move(r) {
        const p = onBoard(r);
        if (!p || (!grab.moved && Math.hypot(p[0] - grab.from[0], p[1] - grab.from[1]) < 1.2)) return;
        grab.moved = true;
        if (run.v0 === 0) run.home = Math.max(SIDE[0], Math.min(SIDE[1], Math.round(p[0] - grab.offset[0]))) / 100;
        const s = Math.max(0, Math.min(GAP, Math.round(FAR_Z + GAP - (p[1] - grab.offset[1])))) / 100;
        if (s !== ctx.values.drop && !ctx.locked.has('drop')) { byScene = true; ctx.set('drop', s); byScene = false; }
        bars.toStart();
        say(`${ctx.locked.has('drop') && s !== run.s0 ? '잠금 · ' : ''}(−)판에서 ${run.s0.toFixed(2)} m · 전위 ${(run.e * 1e5 * run.s0).toFixed(0)} V`, X(run.x0 * 100), TOP + 0.9, Z(FAR_Z + GAP - run.s0 * 100));
      },
      end(held) {
        if (held.moved) { ctx.setPlaying(true); return; }   // let go: it starts at once
        if (ctx.advanced && !ctx.locked.has('probeSign')) ctx.set('probeSign', ctx.values.probeSign === 'minus' ? 'plus' : 'minus');   // pressed without being moved: the other kind of charge
      },
      changed() { if (run.state !== 'ready') ctx.emit('action', 'reset'); else bars.toStart(); },   // a run under way is taken back first
      mode() { bars.changed(); },   // the mass and the speed at the start belong to the advanced mode
      // the field: an arrow at every 5 cm between the bars, all alike; or straight lines from bar to bar, more of them for a stronger field
      drawEven() {
        const long = EVEN * run.e, shaft = Math.max(0, long - TIP);
        let n = 0;
        turn.setFromAxisAngle(UPWARD, -Math.PI / 2);   // from the far bar towards the near one
        for (let x = 20; x <= 70; x += 5) for (let z = FAR_Z + 5; z < FAR_Z + GAP; z += 5, n++) {
          shafts.setMatrixAt(n, place.compose(where.set(X(x), 0, Z(z)), turn, size.set(shaft, shaft ? 1 : 0, shaft ? 1 : 0)));
          tips.setMatrixAt(n, place.compose(where.set(X(x), 0, Z(z) + shaft), turn, size.set(Math.min(1, long / TIP), 1, 1)));
        }
        for (place.makeScale(0, 0, 0); n < COLS * ROWS; n++) { shafts.setMatrixAt(n, place); tips.setMatrixAt(n, place); }
        shafts.instanceMatrix.needsUpdate = true; tips.instanceMatrix.needsUpdate = true;
      },
      drawStraight() {
        const count = Math.round(8 * run.e), array = strandAt.array;
        turn.setFromAxisAngle(UPWARD, -Math.PI / 2);
        for (let k = 0; k < count; k++) {
          const x = -2.8 + (k + 0.5) * 5.6 / count;
          array.set([x, 0, Z(FAR_Z), x, 0, Z(FAR_Z + GAP)], k * 6);
          heads.setMatrixAt(k, place.compose(where.set(x, 0, 0), turn, size.setScalar(1)));
        }
        filled = count * 6; drawn = count;
        strandAt.needsUpdate = true; strands.geometry.setDrawRange(0, count * 2); heads.count = count; heads.instanceMatrix.needsUpdate = true;
      },
      draw() {
        const v = ctx.values, px = X(run.x * 100), pz = Z(FAR_Z + GAP - run.s * 100), way3 = Math.sign(run.f);   // the force is towards the near bar (+z) on a positive charge
        plateRig.visible = true;
        puck.position.set(px, TOP, pz); disc.material.color.copy(run.q > 0 ? TINT.plus : TINT.minus); puckSign.material.map = markOf(Math.sign(run.q));
        fieldGroup.visible = true; fieldGroup.position.y = TOP + 0.03; shafts.visible = tips.visible = v.arrows; strands.visible = heads.visible = v.lines;
        if (stale) { stale = false; if (v.arrows) bars.drawEven(); if (v.lines) bars.drawStraight(); }
        if (v.forces) {   // while it is held in the hand, the hand's force as well: as large, the other way
          lay(pull, px, TOP + 0.12, pz + way3 * 0.22, 0, run.f, PUSH);
          if (grab) lay(hold, px, TOP + 0.12, pz - way3 * 0.22, 0, -run.f, PUSH);
        }
        trail.visible = v.marks; trail.count = run.dots;
        voltLines.visible = v.volts;
        volts.forEach((one, k) => {   // beside the rule; on an upright screen, which is narrow, at the other end of the lines (clear of the menu button)
          one.label.show(v.volts);
          if (v.volts) { one.spot.x = tall() ? 2.6 : -4.45; one.label.write(`${(run.e * 1e4 * k).toFixed(0)} V`); }
        });
        if (v.span && run.s > 0.005) spans[0].lay(px, Z(FAR_Z + GAP), px, pz, TOP + 0.12, run.s);
        if (!v.numbers) return;
        if (tall()) readSpot.set(-0.35, 3.2, -3.2); else readSpot.set(3.7, 0.1, 2.5);   // in front of the near bar, to the right; on an upright screen beyond the far edge of the board
        const [u, k] = bars.energies();
        readout.write(`${bars.ended() ? `<b>${bars.ended()}</b><br>` : ''}전기장 ${powers(run.e)} N/C · 두 판 사이의 전위차 ${(run.e * 1e5 * GAP / 100).toFixed(0)} V<br><b>시험 전하</b> ${amount(run.q)} ${MICRO} · 전기력 ${Math.abs(run.f).toFixed(3)} N<br>(−)판에서 ${run.s.toFixed(2)} m · 전위 <b>${(run.e * 1e5 * run.s).toFixed(0)} V</b><br>전기적 위치 에너지 <b>${minus(u.toFixed(3))} J</b> · 운동 에너지 ${k.toFixed(3)} J${
          ctx.advanced ? `<br>질량 ${run.m.toFixed(2)} kg · 속력 ${run.v.toFixed(2)} m/s` : ''}`);
        readout.show(true);
      },
    };

    // ====================================== all three arrangements ======================================
    const SCENES = { line, field, plates: bars }, now = () => SCENES[ctx.values.scene];
    const frame = () => view.look(now().look[tall() ? 1 : 0]);
    view.setTool({
      pick(r) {
        ray.ray.copy(r); rig.updateMatrixWorld(true);
        const found = ray.intersectObjects(now().handles(), false)[0];
        return found ? found.object.userData.grip : null;
      },
      cursor: (grip) => (grip ? 'grab' : ''),
      start(grip, r) {
        if (now().start(grip, r) === false) return false;
        ctx.setPlaying(false); auto = false;
        return true;
      },
      move(r) { if (grab) now().move(r); },
      end() {
        const held = grab;
        grab = null; tip.show(false); tipTime = 0; moved = true;
        if (held) now().end(held);
      },
    });
    ctx.on('play', (on) => { if (on && !auto) now().startDemo(); });
    ctx.on('tick', (t, dt) => {
      if (!dt || stopSoon) return;
      if (!auto && !now().startDemo()) return;
      now().demoTick(dt);
    });
    ctx.on('action', (id) => { if (id === 'reset') { auto = false; now().toStart(); } });
    ctx.on('change', (id, value) => {
      moved = stale = true;
      if (id === 'scene') {   // the other arrangement starts afresh
        now().enter(); frame();
        ctx.emit('action', 'reset');
        return;
      }
      if (byScene || !now().ids.includes(id)) return;   // set from the scene: what follows is done there
      if (auto) { auto = false; stopSoon = true; }        // set anew by hand: the demonstration is over
      now().changed(id, value);
    });
    ctx.on('mode', () => {   // a negative test charge belongs to the advanced mode
      if (auto) { auto = false; stopSoon = true; }
      if (!ctx.advanced && ctx.values.probeSign !== 'plus') ctx.set('probeSign', 'plus');
      if (now().mode) now().mode();
      moved = true;
    });
    function draw() {   // each arrangement shows what belongs to it
      for (const one of [...stands, probe]) { one.group.visible = false; one.net.visible = false; for (const arrow of one.from) arrow.visible = false; }
      for (const span of spans) { span.group.visible = false; span.label.show(false); }
      for (const one of volts) one.label.show(false);
      rule.visible = fieldGroup.visible = plateRig.visible = pull.visible = hold.visible = false; readout.show(false);
      now().draw();
    }

    netGraph.x = 'C의 위치';   // (the menu is shared by every visit to this page)
    line.reckon();
    return {
      state: () => ({ scene: ctx.values.scene, pos: [...pos], q: [...q], push: push.map((one) => ({ net: one.net, from: [...one.from] })), at: at.map((one) => [...one]), charges: [...charges],
        here: { e: here.e, f: [...here.f], from: here.from.map((one) => [...one]), far: [...here.far] }, auto, lines: filled / 6, heads: drawn, run: { ...run, row: null }, energies: bars.energies() }),
      update(dt) {
        if (!framed) { framed = true; if (tall()) frame(); }
        if (stopSoon) { stopSoon = false; ctx.setPlaying(false); }
        if (tipTime > 0) { tipTime -= dt; if (tipTime <= 0) { tip.show(false); moved = true; } }
        if (fresh && !grab && !auto && performance.now() - since >= 500) now().note();
        if (!moved) return false;
        moved = false; draw();
        return true;
      },
    };
  },
};
