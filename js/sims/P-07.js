// P-07 Turning thermal energy into work (3D).
//
// The work of a gas: a cylinder of gas stands on a small table with a piston on it, after the textbook's figure. A
// hot plate is put under it, and the gas, kept at the same pressure by the piston, the weights on it and the air
// above, grows and lifts them. The work it does is its pressure times the growth of its volume, W = P ΔV: the area
// under the line in the graph of pressure against volume.
// Advanced: the plate may be a cold one, which takes heat from the gas; the piston may be pinned, so that the volume
// stays as it is and only the pressure changes; the weights on the piston may be changed while the gas is kept at
// the temperature of a plate under it, so that all the heat it takes in becomes work; or the cylinder may be wrapped
// so that no heat passes, and the gas is pressed or let out by putting weights on the piston or taking them off.
//
// A heat engine: an engine stands between a hot body and a cold one, after the textbook's figure. With both against
// it, it takes heat Q1 from the hot one each turn, does the work W and gives the rest, Q2, to the cold one:
// Q1 = W + Q2, and its efficiency is W / Q1. Bands as wide as the energies show where the heat goes. Without the cold
// body it cannot go on, so not all of the heat can be turned into work.
//
// What is set by hand can be set from the menu as well, over the same ranges and in the same steps.
// One unit of the scene is 10 cm. The cylinder is 100 cm^2 across inside, so 1 L of gas stands 10 cm (one unit) high.
// Pressures are in kPa and volumes in L, so that their product is in J: 1 kPa x 1 L = 1 J.
const RED = '#e58373', BLUE = '#7fa6e6', GOLD = '#e3c26b', ORANGE = '#e8a05c';
const it = (text) => `<i style="font-family: Georgia, serif">${text}</i>`;
const one = (value) => (Math.round(value * 10 + 1e-6) / 10).toFixed(1);
const minus = (text) => text.replace('-', '−');
const signed = (value) => (Number(one(value)) > 0 ? '+' : '') + minus(one(value));   // with its sign: +90.0, −45.0, 0.0
// which arrangement an item of a menu belongs to: the gas in its cylinder (and there the advanced ones), or the engine
const inGas = (values) => values.scene !== 'engine', inEngine = (values) => values.scene === 'engine';
const byWeights = (process) => process === 'adiabatic' || process === 'isothermal';   // worked by changing the weights: no plate to choose, no time to set
const wrapped = (values) => inGas(values) && byWeights(values.process), plated = (values) => inGas(values) && !byWeights(values.process);
const cold = (values, advanced) => advanced && values.source === 'cool';   // the plate in use is the cold one
const PROCESSES = [{ id: 'isobaric', label: '등압' }, { id: 'isochoric', label: '등적' }, { id: 'isothermal', label: '등온' }, { id: 'adiabatic', label: '단열' }];

export default {
  // what is taken for granted, written on screen by the frame
  premise: (v, advanced) => (inEngine(v) ? '' : advanced && v.process === 'adiabatic' ? '열이 드나들지 않고, 추는 조금씩 천천히 바꾼다고 봅니다'
    : advanced && v.process === 'isothermal' ? '기체의 온도는 판과 늘 같고, 추는 조금씩 천천히 바꾼다고 봅니다' : '피스톤의 마찰과 새는 열은 없다고 봅니다'),
  fixedViews: ['front', 'top'],
  camera: { target: [0.4, 4, 0], r: 13.5, theta: 0.2, phi: 1.42, rMax: 34 },
  stepTime: 0.02,                 // "one step at a time" moves on by this many seconds
  traces: {
    pv: { window: 6, range: 100, read: (p) => `${p.toFixed(0)} kPa` },   // the pressure against the volume (L), not against time
    temp: { window: 6, range: 300, read: (t) => `${t.toFixed(0)} K` },
  },
  charts: {
    engine: { names: ['받은 열', '한 일', '방출한 열'], colors: [ORANGE, GOLD, BLUE], groups: ['J'], signed: false, range: 500, read: (e) => e.toFixed(0) },
    heat: { names: ['받은 열', '한 일', '내부 에너지 변화'], colors: [ORANGE, GOLD, RED], groups: ['J'], range: 50, read: (e) => minus(one(e)) },
  },
  menus: {
    vars: [
      { id: 'scene', label: '장면 선택', kind: 'choice', value: 'gas', options: [{ id: 'gas', label: '기체가 하는 일' }, { id: 'engine', label: '열기관과 열효율' }] },
      { id: 'process', label: '과정', kind: 'choice', value: 'isobaric', advanced: true, when: inGas, options: PROCESSES },
      { id: 'source', label: '판의 종류', kind: 'choice', value: 'heat', advanced: true, when: plated, options: [{ id: 'heat', label: '가열판' }, { id: 'cool', label: '냉각판' }] },
      { id: 'weights', label: '추의 개수', kind: 'slider', min: 0, max: 5, step: 1, value: 0, unit: '개', when: inGas },   // each presses 10 kPa more
      { id: 'weightsTo', label: '나중 추의 개수', kind: 'slider', min: 0, max: 5, step: 1, value: 3, unit: '개', advanced: true, when: wrapped },
      // how long the plate works, and whether it is under the table: named after the plate in use
      { id: 'seconds', label: (v, advanced) => (cold(v, advanced) ? '냉각 시간' : '가열 시간'), kind: 'slider', min: 1, max: 5, step: 1, value: 3, unit: ' s', when: plated },
      { id: 'plate', label: (v, advanced) => (cold(v, advanced) ? '냉각판 놓기' : '가열판 놓기'), kind: 'toggle', when: plated },
      { id: 'intake', label: '한 순환에 받는 열', kind: 'slider', min: 100, max: 500, step: 100, value: 300, unit: ' J', when: inEngine },
      { id: 'effic', label: '열효율', kind: 'slider', min: 10, max: 50, step: 5, value: 30, unit: ' %', when: inEngine },
      { id: 'hotT', label: '고열원의 온도', kind: 'slider', min: 400, max: 1000, step: 100, value: 600, unit: ' K', advanced: true, when: inEngine },
      { id: 'coldT', label: '저열원의 온도', kind: 'slider', min: 200, max: 400, step: 50, value: 300, unit: ' K', advanced: true, when: inEngine },
      { id: 'hotOn', label: '고열원 대기', kind: 'toggle', when: inEngine },
      { id: 'coldOn', label: '저열원 대기', kind: 'toggle', when: inEngine },   // switched on whenever the engine is shown (see create)
    ],
    graph: [
      // the area under the line is the work done by the gas: counted with its sign, so that it is negative when the gas is pressed together
      { id: 'pressureVolume', label: '압력–부피', kind: 'graph', x: '부피', xUnit: 'L', span: [0, 5], plots: [{ y: '압력', trace: 'pv', area: 'J' }], when: inGas },
      { id: 'heatBars', label: '에너지 막대', kind: 'graph', bars: 'heat', advanced: true, when: inGas },
      { id: 'tempTime', label: '온도–시간', kind: 'graph', x: '시간', plots: [{ y: '온도', trace: 'temp' }], advanced: true, when: inGas },
      { id: 'engineBars', label: '에너지 막대', kind: 'graph', bars: 'engine', when: inEngine },
    ],
    time: [
      { id: 'slow', label: '느리게', kind: 'toggle' },
      { id: 'reset', label: '처음으로', kind: 'action' },
      { id: 'step', label: '한 단계씩', kind: 'action', advanced: true },
    ],
    layers: [
      { id: 'particles', label: '입자 운동', kind: 'toggle', value: true },   // on from the start: the gas cannot be seen otherwise
      { id: 'flow', label: '열과 일 화살표', kind: 'toggle' },   // bands as wide as the heat and the work; switched on whenever the engine is shown
      { id: 'numbers', label: '값', kind: 'toggle' },
      { id: 'forceArrow', label: '힘 화살표', kind: 'toggle', advanced: true, when: inGas },
    ],
    inquiry: [
      { id: 'table', label: '기록 표', kind: 'table', wide: true, when: inGas, text: '압력이 일정한 과정이 끝날 때마다 한 줄씩 적힙니다.',
        columns: [{ label: '압력', unit: 'kPa' }, { label: '시간', unit: 's' }, { label: '처음<br>부피', unit: 'L' }, { label: '나중<br>부피', unit: 'L', result: true },
          { label: '부피<br>변화', unit: 'L', result: true }, { label: '기체가<br>한 일', unit: 'J', result: true }] },
      { id: 'processTable', label: '과정 기록 표', kind: 'table', wide: true, advanced: true, when: inGas, text: '과정이 끝날 때마다 한 줄씩 적힙니다. 받은 열 = 내부 에너지 변화 + 한 일',
        columns: [{ label: '과정' }, { label: '압력', unit: 'kPa' }, { label: '부피', unit: 'L' }, { label: '온도', unit: 'K' },
          { label: '받은<br>열', unit: 'J', result: true }, { label: '한 일', unit: 'J', result: true }, { label: '내부<br>에너지<br>변화', unit: 'J', result: true }] },
      { id: 'premise', label: '실험의 가정', kind: 'note', when: inGas,
        text: '피스톤의 마찰과 실린더 밖으로 새는 열은 없다고 봅니다. 기체의 양은 변하지 않습니다.<br><br>기체가 한 일 = 압력 × 부피 변화<br>1 kPa × 1 L = 1 J<br><br>압력 = 대기압 100 kPa + 추 한 개에 10 kPa' },
      { id: 'firstLaw', label: '과정과 에너지', kind: 'note', advanced: true, when: inGas,
        text: '받은 열 = 내부 에너지 변화 + 기체가 한 일<br><br>등압: 압력이 일정합니다. 받은 열의 일부가 일이 됩니다.<br>등적: 부피가 일정합니다(피스톤 고정). 일은 0이고, 받은 열이 모두 내부 에너지가 됩니다.<br>등온: 온도가 일정합니다(온도가 일정한 판 위). 내부 에너지가 변하지 않아, 받은 열이 모두 일이 됩니다.<br>단열: 열이 드나들지 않습니다. 기체가 한 일만큼 내부 에너지가 줄어듭니다.<br><br>열을 빼앗기면 받은 열이, 부피가 줄면 기체가 한 일이 음(−)입니다. 압력–부피 그래프의 넓이도 그때 음으로 적힙니다.' },
      { id: 'engineTable', label: '기록 표', kind: 'table', wide: true, when: inEngine, text: '열기관이 멈출 때마다 한 줄씩 적힙니다.',
        columns: [{ label: '순환<br>수' }, { label: '받은<br>열', unit: 'J' }, { label: '한 일', unit: 'J', result: true }, { label: '방출한<br>열', unit: 'J', result: true }, { label: '열효율', unit: '%', result: true },
          { label: '고열원<br>온도', unit: 'K', advanced: true }, { label: '저열원<br>온도', unit: 'K', advanced: true }, { label: '열효율의<br>한계', unit: '%', result: true, advanced: true }] },
      { id: 'engineNote', label: '열기관과 열효율', kind: 'note', when: inEngine,
        text: `열기관이 받은 열 ${it('Q')}<sub>1</sub> = 한 일 ${it('W')} + 방출한 열 ${it('Q')}<sub>2</sub><br><br>열효율 = ${it('W')} ÷ ${it('Q')}<sub>1</sub><br><br>저열원으로 열을 내보내야 순환이 이어지므로, 받은 열을 모두 일로 바꿀 수는 없습니다.` },
      { id: 'limitNote', label: '열효율의 한계', kind: 'note', advanced: true, when: inEngine,
        text: '열효율의 한계 = 1 − 저열원의 온도 ÷ 고열원의 온도 (온도는 K)<br><br>어떤 열기관도 열효율이 이보다 높을 수 없습니다. 두 열원의 온도가 같으면 한계가 0이라 일을 하지 못합니다.' },
    ],
  },

  // writing on the chalkboard (1024 x 400)
  board(g) {
    g.fillStyle = 'rgba(255,255,255,0.9)'; g.font = '56px Georgia, serif'; g.fillText('열에너지의 전환', 60, 96);
    g.font = 'italic 58px Georgia, serif'; g.fillText('W = PΔV', 60, 210); g.fillText('Q  = W + Q', 60, 320);
    g.font = 'italic 30px Georgia, serif'; g.fillText('1', 98, 336); g.fillText('2', 372, 336);
    g.strokeStyle = 'rgba(255,255,255,0.8)'; g.lineWidth = 5;
    g.beginPath(); g.moveTo(640, 330); g.lineTo(640, 100); g.moveTo(640, 330); g.lineTo(960, 330); g.stroke();   // pressure against volume: a level line, and the area under it
    g.beginPath(); g.moveTo(710, 180); g.lineTo(900, 180); g.stroke();
    g.fillStyle = 'rgba(255,255,255,0.22)'; g.fillRect(710, 180, 190, 150);
  },

  // Builds the apparatus on the bench (world) and returns { update(dt) }.
  create({ T, kit, world, view, ctx }) {
    const { mat, add, box, cyl, canvasTexture } = kit;
    world.userData.things.visible = false;   // the apparatus takes the middle of the bench
    const M = { steel: mat(0x8f96a8), dark: mat(0x3a4057), body: mat(0xd9584a), brass: mat(0xc9a35a, { roughness: 0.7 }), brassDark: mat(0xad8843, { roughness: 0.7 }), plate: mat(0x6e7486, { roughness: 0.6 }) };
    const INK = { push: 0x3f6fd0, press: 0x9a3fc2 };
    const UP = new T.Vector3(0, 1, 0), DOWN = new T.Vector3(0, -1, 0);

    // ==================== the work of a gas ====================
    // A small table with the cylinder on it and room for the plate under it. BASE: the floor of the cylinder inside;
    // BORE: its radius inside (100 cm^2 across); the gas of volume V (L) fills it up to BASE + V.
    const TABLE = 1.5, BASE = TABLE + 0.22, BORE = 0.564, TUBE = 6.7, SLAB = 0.3, PARK = 3.4;   // PARK: where the plate stands when it is not in use
    const rig = new T.Group(); world.add(rig);
    add(rig, box(2.3, 0.1, 2.3), M.plate, 0, TABLE + 0.05, 0);
    for (const x of [-1, 1]) for (const z of [-1, 1]) add(rig, cyl(0.06, 0.06, TABLE, 10).translate(0, TABLE / 2, 0), M.steel, x * 1.05, 0, z * 1.05);
    add(rig, cyl(BORE + 0.07, BORE + 0.07, 0.12, 40), M.steel, 0, BASE - 0.06, 0);                 // the floor of the cylinder: metal, which lets the heat through
    const glass = add(rig, new T.CylinderGeometry(BORE + 0.05, BORE + 0.05, TUBE, 40, 1, true), mat(0xdfe9f2, { transparent: true, opacity: 0.28, roughness: 0.2, depthWrite: false, side: T.DoubleSide }), 0, BASE + TUBE / 2, 0, false, false);
    glass.renderOrder = 3;
    add(rig, new T.TorusGeometry(BORE + 0.05, 0.03, 8, 40).rotateX(Math.PI / 2), M.steel, 0, BASE + TUBE, 0, false);
    // wrapped, for the process without heat: a sleeve round the cylinder and a pad under it
    const sleeve = new T.Group(); rig.add(sleeve);
    const wrap = add(sleeve, new T.CylinderGeometry(BORE + 0.2, BORE + 0.2, 5.2, 40, 1, true), mat(0xefe6cf, { transparent: true, opacity: 0.42, roughness: 1, depthWrite: false, side: T.DoubleSide }), 0, BASE + 2.5, 0, false, false);
    wrap.renderOrder = 4;
    add(sleeve, cyl(BORE + 0.2, BORE + 0.2, 0.14, 40), mat(0xefe6cf, { roughness: 1 }), 0, BASE - 0.19, 0);
    // a rule in L beside the cylinder: 0 at its floor
    const SCALE = { x: -1.05, long: 5.3, wide: 0.5 };
    add(rig, box(SCALE.wide, SCALE.long, 0.05), mat(0xf2d675), SCALE.x, BASE + SCALE.long / 2, -0.03);
    add(rig, box(0.9, 0.06, 0.7), M.dark, SCALE.x, TABLE + 0.13, 0);
    add(rig, new T.PlaneGeometry(SCALE.wide, SCALE.long), mat(0xffffff, { map: canvasTexture(128, 1357, (g, w, h) => {
      g.fillStyle = '#f2d675'; g.fillRect(0, 0, w, h); g.strokeStyle = g.fillStyle = '#4a3f1c';
      g.font = '700 44px Helvetica, Arial, sans-serif'; g.textAlign = 'left'; g.textBaseline = 'middle';
      for (let c = 0; c <= 53; c++) {   // every 0.1 L
        const y = h - c * h / 53, long = c % 10 === 0 ? 0.42 : c % 5 === 0 ? 0.3 : 0.17;
        g.lineWidth = c % 10 === 0 ? 5 : 2.5; g.beginPath(); g.moveTo(w, y); g.lineTo(w * (1 - long), y); g.stroke();
        if (c % 10 === 0 && c > 0) g.fillText(String(c / 10), 8, y);
      }
    }) }), SCALE.x, BASE + SCALE.long / 2, 0, false);
    // the piston with the weights on it; its underside is the top of the gas
    const piston = new T.Group(); rig.add(piston);
    add(piston, cyl(BORE - 0.01, BORE - 0.01, 0.16, 36), M.dark, 0, 0.08, 0);
    add(piston, box(0.55, 0.025, 0.025), M.body, -BORE - 0.28, 0.012, 0, false);                   // a pointer to the rule
    const slabs = Array.from({ length: 5 }, (_, i) => add(piston, cyl(BORE - 0.1, BORE - 0.1, SLAB - 0.02, 30), i % 2 ? M.brassDark : M.brass, 0, 0.16 + SLAB / 2 + i * SLAB, 0));
    const pileHandle = add(piston, cyl(BORE + 0.35, BORE + 0.35, 1, 16).translate(0, 0.5, 0), M.dark, 0, 0, 0, false, false); pileHandle.visible = false;
    pileHandle.userData.grip = { kind: 'pile' };
    // a pin through the wall of the cylinder that holds the piston where it is (the process at a fixed volume)
    const pin = new T.Group(); piston.add(pin);
    add(pin, cyl(0.05, 0.05, BORE * 2 + 0.9, 10).rotateZ(Math.PI / 2), M.body, 0, 0.08, 0);
    for (const x of [-1, 1]) add(pin, cyl(0.11, 0.11, 0.1, 14).rotateZ(Math.PI / 2), M.body, x * (BORE + 0.42), 0.08, 0);
    // the plate: a hot one or a cold one, slid under the table
    const heater = new T.Group(); rig.add(heater);
    const HOUSING = { hot: new T.Color(0x3a4057), cold: new T.Color(0xc9d6e6), even: new T.Color(0x49695a) }, housing = new T.MeshStandardMaterial({ roughness: 0.9 });
    add(heater, box(1.5, 0.9, 1.5), housing, 0, 0.45, 0);
    const coil = add(heater, cyl(0.6, 0.6, 0.08, 32), new T.MeshStandardMaterial({ color: 0x4a4f61, roughness: 0.6 }), 0, 0.94, 0);
    const lamp = add(heater, cyl(0.07, 0.07, 0.08, 12).rotateX(Math.PI / 2), new T.MeshBasicMaterial({ color: 0xd9584a }), 0.45, 0.45, 0.76, false);
    const heaterHandle = add(heater, box(1.9, 1.5, 1.9), M.dark, 0, 0.6, 0, false, false); heaterHandle.visible = false;
    heaterHandle.userData.grip = { kind: 'heater' };
    const tubeHandle = add(rig, cyl(BORE + 0.12, BORE + 0.12, TUBE, 16), M.dark, 0, BASE + TUBE / 2, 0, false, false); tubeHandle.visible = false;   // the cylinder itself: a press on it puts the gas back
    tubeHandle.userData.grip = { kind: 'tube' };
    // the colours of the plate's top when it is idle and when it works, hot and cold; and of the particles from cold to hot
    const TOP = { hot: [new T.Color(0x4a4f61), new T.Color(0xff5a2a)], cold: [new T.Color(0x8fb4d6), new T.Color(0xdff4ff)], even: [new T.Color(0x8fc7a4), new T.Color(0xb9e6c8)] };   // even: a plate that keeps the temperature of the room
    const CHILL = new T.Color(0x2f56c8), CALM = new T.Color(0x3f7fe6), QUICK = new T.Color(0xf0642a);
    // The particles of a gas: a swarm in an upright cylinder of the given radius. fly(dt, top, speed): each flies on in a
    // straight line for dt seconds and is turned back by the wall, the floor and the piston (top: its height above the floor).
    function swarm(count, radius, room) {
      const motes = Array.from({ length: count }, () => {
        const a = Math.random() * 6.283, r = Math.sqrt(Math.random()) * (radius - 0.08), b = Math.random() * 6.283, c = Math.acos(2 * Math.random() - 1);
        return { x: r * Math.cos(a), y: 0.1 + Math.random() * room, z: r * Math.sin(a), u: Math.sin(c) * Math.cos(b), v: Math.cos(c), w: Math.sin(c) * Math.sin(b) };
      });
      const mesh = new T.InstancedMesh(new T.SphereGeometry(0.06, 8, 6), new T.MeshBasicMaterial({ color: 0x3f7fe6 }), count); mesh.frustumCulled = false;
      const where = new T.Matrix4(), side = radius - 0.07;
      function fly(dt, top, speed) {
        motes.forEach((mote, i) => {
          mote.x += mote.u * speed * dt; mote.y += mote.v * speed * dt; mote.z += mote.w * speed * dt;
          const far = Math.hypot(mote.x, mote.z);
          if (far > side) {   // the wall: turned back along the line to the axis
            const nx = mote.x / far, nz = mote.z / far, out = mote.u * nx + mote.w * nz;
            if (out > 0) { mote.u -= 2 * out * nx; mote.w -= 2 * out * nz; }
            mote.x = nx * side; mote.z = nz * side;
          }
          if (mote.y < 0.07) { mote.y = 0.07; mote.v = Math.abs(mote.v); }
          if (mote.y > top - 0.07) { mote.y = top - 0.07; mote.v = -Math.abs(mote.v); }
          where.makeTranslation(mote.x, mote.y, mote.z); mesh.setMatrixAt(i, where);
        });
        mesh.instanceMatrix.needsUpdate = true;
      }
      return { mesh, fly };
    }
    const cloud = swarm(70, BORE, 1.8); cloud.mesh.position.y = BASE; rig.add(cloud.mesh);

    // ---------- marks ----------
    const push = kit.arrow(INK.push, 0.05), press = kit.arrow(INK.press, 0.05); rig.add(push, press);
    const spot = new T.Vector3(), label = view.label(spot, true), tipSpot = new T.Vector3(), tip = view.label(tipSpot);
    const NEWTON = 0.0016;   // the length of an arrow for 1 N

    // ---------- physics ----------
    // The amount of gas is fixed, such that P V = T with P in kPa, V in L and T in K (n R = 1 J/K): at 300 K under the
    // air alone (100 kPa) it fills 3 L. It is a gas of single atoms: its internal energy is U = 3/2 n R T = 1.5 T (J).
    // What rests on the piston is the air (100 kPa) and the weights (10 kPa each: 100 N on 100 cm^2).
    // Every process starts at 300 K, with the piston where the weights hold it. The plate gives 75 J every second, or
    // takes as much; the heat taken in is Q = dU + W, where W is the work the gas does.
    //   isobaric (the piston free): P stays. dT = Q / 2.5, so 30 K every second; V = T / P; W = P dV = dT (J), 2/5 of Q.
    //   isochoric (the piston pinned): V stays. W = 0, dT = Q / 1.5, so 50 K every second; P = T / V.
    //   isothermal (on a plate that stays at 300 K): T stays, so dU = 0 and Q = W. The weights are changed a little at a
    //     time; V = 300 / P, and W = n R T ln(V / V1) = 300 ln(V / V1).
    //   adiabatic (wrapped, no plate): Q = 0. The weights are changed a little at a time, and P V^(5/3) stays, so
    //     V = V1 (P1 / P)^(3/5) and T = P V; W = −dU = −1.5 dT.
    // A cold plate cannot make the gas colder than itself: it stops at FLOOR.
    // gas: kind: which process; sign: +1 heated, −1 cooled; t: seconds so far, until: when it ends; P1, V1: at the
    // start; P2: the pressure at the end (adiabatic); P, V, T now; Q: heat taken in, W: work done (J).
    const gas = { state: 'ready', kind: 'isobaric', sign: 1, t: 0, until: 3, P1: 100, V1: 3, P2: 100, P: 100, V: 3, T: 300, Q: 0, W: 0, short: false, seen: [3, 100], beat: -1 };
    const RATE = 75, ROOM = 300, FLOOR = 100, BEAT = 0.05, PACE = 1.2;   // RATE: of the plate (J/s); BEAT: how often the temperature is kept; PACE: seconds to put one weight on or take it off
    const kindNow = () => (ctx.advanced ? ctx.values.process : 'isobaric');           // the process that is set: the basic mode has the one
    const cooling = () => !byWeights(kindNow()) && cold(ctx.values, ctx.advanced);    // the plate in use takes heat from the gas
    // the gas t seconds into the process
    function at(t) {
      if (gas.kind === 'adiabatic') {
        const P = gas.P1 + (gas.P2 - gas.P1) * t / gas.until, V = gas.V1 * (gas.P1 / P) ** 0.6, temp = P * V;
        return { P, V, T: temp, Q: 0, W: -1.5 * (temp - ROOM) };
      }
      if (gas.kind === 'isothermal') {
        const P = gas.P1 + (gas.P2 - gas.P1) * t / gas.until, V = ROOM / P, W = ROOM * Math.log(V / gas.V1);
        return { P, V, T: ROOM, Q: W, W };
      }
      const Q = gas.sign * RATE * t;
      if (gas.kind === 'isochoric') { const temp = ROOM + Q / 1.5; return { P: temp / gas.V1, V: gas.V1, T: temp, Q, W: 0 }; }
      const temp = ROOM + Q / 2.5;
      return { P: gas.P1, V: temp / gas.P1, T: temp, Q, W: temp - ROOM };
    }

    // ---------- state ----------
    let moved = true, stopSoon = false, tipTime = 0, framed = false, grab = null, carry = null;   // carry: where the plate is while it is in hand
    function say(text, x, y, seconds = 0) { tip.write(text); tipSpot.set(x, y, 0); tip.show(true); tipTime = seconds; moved = true; }
    function bars() { ctx.charts.heat.set(0, [gas.Q, gas.W, gas.Q - gas.W]); }
    const tall = () => window.matchMedia('(max-aspect-ratio: 4/5)').matches;
    const work = {
      run: gas,
      // the gas as cool as the room, the piston where the weights hold it
      toStart() {
        const v = ctx.values, kind = kindNow(), sign = cooling() ? -1 : 1, P1 = 100 + 10 * v.weights, V1 = ROOM / P1;
        // how long it goes on: as set, but a cold plate stops when the gas is as cold as it is; weights go on or off one at a time
        const rate = kind === 'isochoric' ? RATE / 1.5 : RATE / 2.5, most = sign < 0 ? (ROOM - FLOOR) / rate : Infinity, set = v.seconds;
        const until = byWeights(kind) ? Math.max(1, Math.abs(v.weightsTo - v.weights)) * PACE : Math.min(set, most);
        Object.assign(gas, { state: 'ready', kind, sign, t: 0, until, short: !byWeights(kind) && set > most, P1, V1, P2: 100 + 10 * v.weightsTo, P: P1, V: V1, T: ROOM, Q: 0, W: 0, seen: [V1, P1], beat: -1 });
        bars(); moved = true;
      },
      launch() {
        work.toStart();
        const over = [0.6, BASE + gas.V + 2.6];
        if (byWeights(gas.kind)) {
          if (gas.P2 === gas.P1) { stopSoon = true; say('나중 추의 개수를 처음과 다르게 정하면 기체가 눌리거나 늘어납니다', ...over, 3); return; }
        } else if (!ctx.values.plate) {
          stopSoon = true; say(gas.sign < 0 ? '냉각판을 실린더 밑에 놓으면 기체가 냉각됩니다' : '가열판을 실린더 밑에 놓으면 기체가 가열됩니다', ...over, 3); return;
        }
        gas.state = 'run';
        for (const trace of Object.values(ctx.traces)) trace.clear();
        ctx.traces.pv.add(gas.V1, gas.P1);
        ctx.seek(0); work.advance(0);
      },
      advance(dt) {
        gas.t = Math.min(gas.until, gas.t + dt);
        Object.assign(gas, at(gas.t));
        if (Math.abs(gas.V - gas.seen[0]) >= 0.01 || Math.abs(gas.P - gas.seen[1]) >= 1) { gas.seen = [gas.V, gas.P]; ctx.traces.pv.add(gas.V, gas.P); }   // the pressure against the volume, as either changes
        while ((gas.beat + 1) * BEAT <= gas.t + 1e-9) ctx.traces.temp.add(++gas.beat * BEAT, at(gas.beat * BEAT).T);
        heatBand.map.offset.x -= dt * 1.4; workBand.map.offset.x -= dt * 1.4;   // the marks on the bands move along with the energy
        bars(); moved = true;
        if (gas.t >= gas.until - 1e-9) work.finish();
      },
      // the process is over (the time is up, or the plate has been taken away): a line of each table
      finish() {
        if (gas.state !== 'run') return;
        gas.state = 'done'; stopSoon = true;
        ctx.traces.pv.add(gas.V, gas.P);
        if (gas.kind === 'isobaric') ctx.tables.table.add([String(gas.P1), gas.t.toFixed(1), gas.V1.toFixed(3), gas.V.toFixed(3), minus((gas.V - gas.V1).toFixed(3)), minus(one(gas.W))]);
        ctx.tables.processTable.add([PROCESSES.find((process) => process.id === gas.kind).label, `${gas.P1.toFixed(0)}→${gas.P.toFixed(0)}`, `${gas.V1.toFixed(2)}→${gas.V.toFixed(2)}`, `${ROOM}→${gas.T.toFixed(0)}`,   // from → to, kept short so that the table fits an upright phone
          signed(gas.Q), signed(gas.W), signed(gas.Q - gas.W)]);
        if (gas.short && gas.t >= gas.until - 1e-9) say('기체가 냉각판만큼 차가워져 열이 더 빠져나가지 않습니다', 0.6, BASE + gas.V + 2.6, 3.5);
        moved = true;
      },
      // after a run the plate can still be handled; a press on the cylinder (or on the piston in it) puts the gas back
      touch: (state, grip) => (grip.kind === 'heater' ? grip : { kind: 'reset' }),
      handles: [heaterHandle, pileHandle, tubeHandle],
      at: () => heater.position.x,                                                   // where what is taken hold of stands
      fly(dt) { cloud.fly(dt, gas.V, 2.4 * Math.sqrt(gas.T / 300)); },             // the particles: faster when the gas is hotter
      // what a handle sets: the pile is the weights at the start, or wrapped the weights at the end
      dial: (grip) => (grip.kind !== 'pile' ? 'plate' : byWeights(kindNow()) ? 'weightsTo' : 'weights'),
      move(p) {
        const v = ctx.values, id = grab.id;
        if (grab.kind === 'heater') {   // slid along the bench
          if (ctx.locked.has(id)) { say('잠금', heater.position.x, 2.2); return; }
          carry = Math.max(-0.4, Math.min(PARK + 0.8, grab.at + p.x - grab.from.x)); grab.moved = true; moved = true;
          return;
        }
        const beside = [1.9, BASE + gas.V + 0.4 + v.weights * SLAB];
        if (ctx.locked.has(id)) { say('잠금', ...beside); return; }
        const to = Math.max(0, Math.min(5, grab.value + Math.round((p.up - grab.from.up) / p.rise / SLAB)));   // a weight more for each of its heights
        if (to !== v[id]) { ctx.set(id, to); grab.moved = true; }
        say(id === 'weightsTo' ? `추 ${v.weights}개 → ${v.weightsTo}개` : `추 ${v.weights}개 · ${100 + 10 * v.weights} kPa`, ...beside);
      },
      end(held) {
        if (held.kind === 'pile') {   // wrapped: the weights are changed to what was set, at once
          if (held.id === 'weightsTo' && held.moved && ctx.values.weightsTo !== ctx.values.weights) ctx.setPlaying(true);
          return;
        }
        if (carry === null || Math.abs(carry - held.at) < 0.15) {   // pressed without being moved: the plate is changed for the other kind
          carry = null;
          if (ctx.advanced && !ctx.locked.has('source')) ctx.set('source', ctx.values.source === 'cool' ? 'heat' : 'cool');
          return;
        }
        const under = Math.abs(carry) < 1.3;   // near enough: it goes into its place under the table
        carry = null;
        if (under !== ctx.values[held.id]) ctx.set(held.id, under);
        if (under && gas.state === 'ready') ctx.setPlaying(true);   // put in place, it works at once
      },
      changed(id) {
        if (id === 'plate') { if (!ctx.values.plate) work.finish(); return; }   // the plate is put under the table or taken away; taken away while it works, the process ends there
        if (!['weights', 'weightsTo', 'seconds', 'process', 'source'].includes(id)) return;   // (the other kind of plate stands where the one before stood)
        if (gas.state !== 'ready') ctx.emit('action', 'reset'); else work.toStart();   // a run under way is taken back first
      },
      draw() {
        const v = ctx.values, working = gas.state === 'run', closed = gas.kind === 'adiabatic', steady = gas.kind === 'isothermal', chilly = gas.sign < 0;
        const n = closed || steady ? Math.round((gas.P - 100) / 10) : Math.round((gas.P1 - 100) / 10);   // weights on the piston now
        piston.position.y = BASE + gas.V; slabs.forEach((slab, i) => { slab.visible = i < n; });
        pileHandle.scale.y = 0.16 + n * SLAB + 0.5;
        pin.visible = gas.kind === 'isochoric'; sleeve.visible = closed;
        // the plate: put away when the cylinder is wrapped; a plate that keeps its temperature stays under the table and is not handled
        heater.visible = !closed; heaterHandle.userData.off = steady; heater.position.x = steady ? 0 : carry !== null ? carry : v.plate ? 0 : PARK;
        const tops = steady ? TOP.even : chilly ? TOP.cold : TOP.hot;
        housing.color.copy(steady ? HOUSING.even : chilly ? HOUSING.cold : HOUSING.hot); coil.material.color.copy(tops[0]).lerp(tops[1], working && !closed ? 1 : 0); lamp.material.color.set(steady ? 0x4f9d6b : chilly ? 0x3f7fe6 : 0xd9584a);
        // Heat and work as bands, each as wide as its energy so far. Heat: between the plate and the gas, upwards into the
        // gas when it is taken in and downwards when it is given up. Work: at the piston, upwards when the gas does it
        // (it pushes the piston out) and downwards when it is done on the gas.
        const taken = Math.abs(gas.Q) >= 0.5, done = Math.abs(gas.W) >= 0.5, crown = BASE + gas.V + 0.16 + n * SLAB + 0.2;   // crown: just above what stands on the piston
        gasFlows.visible = v.flow; heatBand.group.visible = taken; workBand.group.visible = done;
        heatTag.show(v.flow && taken); workTag.show(v.flow && done);
        if (v.flow && taken) {
          const low = 1.0, high = BASE + 0.9, wide = Math.max(0.06, WIDE * Math.abs(gas.Q));
          heatBand.paint.color.set(gas.Q > 0 ? 0xe8843c : 0x5f8fd0);
          if (gas.Q > 0) heatBand.lay(0, low, 0, high, wide, working); else heatBand.lay(0, high, 0, low, wide, working);
          heatSpot.set(1.5, (low + high) / 2, 1.3); heatTag.write(ctx.advanced ? `열 ${signed(gas.Q)} J` : '열');
        }
        if (v.flow && done) {
          const wide = Math.max(0.06, WIDE * Math.abs(gas.W));
          if (gas.W > 0) workBand.lay(0, crown, 0, crown + 1.4, wide, working); else workBand.lay(0, crown + 1.4, 0, crown, wide, working);
          workTagSpot.set(1.5, crown + 0.5, 1.3); workTag.write(`일 ${ctx.advanced ? signed(gas.W) : minus(one(gas.W))} J`);
        }
        heatBand.paint.opacity = workBand.paint.opacity = 0.85;   // what has passed stays plain to see when the process is over
        cloud.mesh.visible = v.particles;
        if (gas.T >= ROOM) cloud.mesh.material.color.copy(CALM).lerp(QUICK, Math.min(1, (gas.T - ROOM) / 200)); else cloud.mesh.material.color.copy(CALM).lerp(CHILL, Math.min(1, (ROOM - gas.T) / 150));
        // the forces on the piston: the gas pushes it up; the air and the weights press it down (a pin, if there is one, takes the rest)
        const force = ctx.advanced && v.forceArrow, up = gas.P * 10, down = (100 + 10 * n) * 10;   // kPa on 100 cm^2, in N
        push.visible = press.visible = force;
        if (force) {
          push.position.set(0.25, BASE + gas.V - NEWTON * up, BORE + 0.25); push.setLength(NEWTON * up); push.aim(UP);
          press.position.set(-0.25, BASE + gas.V + 0.16 + NEWTON * down, BORE + 0.25); press.setLength(NEWTON * down); press.aim(DOWN);
        }
        label.show(v.numbers);
        if (!v.numbers) return;
        if (tall()) spot.set(0.6, BASE + TUBE + 0.5, 0); else spot.set(-4.2, 3, 0);   // beside the rule; near enough to stay in sight on a screen that is not wide
        const dV = minus((gas.V - gas.V1).toFixed(3));
        if (!ctx.advanced) {
          label.write(`압력 ${gas.P1} kPa (대기압 100${n ? ` + 추 ${n * 10}` : ''})<br>부피 ${gas.V1.toFixed(3)} L → ${gas.V.toFixed(3)} L<br>부피 변화 ${dV} L<br>기체가 한 일 <b>${minus(one(gas.W))} J</b>`);
          return;
        }
        const held = gas.kind === 'isochoric' && Math.abs(up - down) > 0.5 ? ` · 핀이 버티는 힘 ${Math.abs(up - down).toFixed(0)} N` : '';
        label.write(`압력 ${gas.P1.toFixed(0)} → ${gas.P.toFixed(0)} kPa<br>부피 ${gas.V1.toFixed(3)} → ${gas.V.toFixed(3)} L (${dV} L)<br>온도 ${ROOM} → ${gas.T.toFixed(0)} K${
          force ? `<br>기체가 미는 힘 ${up.toFixed(0)} N · 누르는 힘 ${down} N${held}` : ''
        }<br>받은 열 ${signed(gas.Q)} J<br>기체가 한 일 <b>${signed(gas.W)} J</b><br>내부 에너지 변화 ${signed(gas.Q - gas.W)} J`);
      },
    };

    // ==================== a heat engine ====================
    // The engine: an upright cylinder of gas whose piston turns a wheel by a crank. The hot body stands against its
    // left side and the cold body against its right; each can be slid away along the bench.
    const ENGINE = { base: 0.5, bore: 0.75, tall: 2.9, axle: 4.8, crank: 0.4, rod: 2.3 }, SEAT = 1.87, AWAY = 4.6, MID = 1.05;   // SEAT, AWAY: where a body stands against the engine and apart from it; MID: the height of the bands
    const plant = new T.Group(); world.add(plant);
    add(plant, box(2.4, ENGINE.base, 2.2), M.dark, 0, ENGINE.base / 2, 0);
    const jar = add(plant, new T.CylinderGeometry(ENGINE.bore + 0.05, ENGINE.bore + 0.05, ENGINE.tall, 40, 1, true), mat(0xdfe9f2, { transparent: true, opacity: 0.28, roughness: 0.2, depthWrite: false, side: T.DoubleSide }), 0, ENGINE.base + ENGINE.tall / 2, 0, false, false);
    jar.renderOrder = 3;
    add(plant, new T.TorusGeometry(ENGINE.bore + 0.05, 0.03, 8, 40).rotateX(Math.PI / 2), M.steel, 0, ENGINE.base + ENGINE.tall, 0, false);
    const ram = add(plant, cyl(ENGINE.bore - 0.01, ENGINE.bore - 0.01, 0.16, 36).translate(0, 0.08, 0), M.dark, 0, 0, 0);    // the piston: its underside is the top of the gas
    const link = add(plant, cyl(0.05, 0.05, 1, 10).translate(0, 0.5, 0), M.steel, 0, 0, 0);                                 // the rod from the piston to the crank
    add(plant, box(0.3, ENGINE.axle + 0.2, 0.3), M.steel, 0, (ENGINE.axle + 0.2) / 2, -1.45);                               // the post that carries the wheel
    add(plant, box(1.2, 0.12, 1.2), M.dark, 0, 0.06, -1.45);
    add(plant, cyl(0.08, 0.08, 0.9, 12).rotateX(Math.PI / 2), M.steel, 0, ENGINE.axle, -1.05);
    const wheel = new T.Group(); wheel.position.set(0, ENGINE.axle, -0.6); plant.add(wheel);                               // it turns about the line towards the viewer
    add(wheel, new T.TorusGeometry(1.0, 0.1, 10, 48), M.brass, 0, 0, 0);
    for (let i = 0; i < 3; i++) add(wheel, box(2, 0.1, 0.06), M.brassDark, 0, 0, 0).rotation.z = i * Math.PI / 3;
    add(wheel, cyl(0.06, 0.06, 0.55, 10).rotateX(Math.PI / 2), M.body, ENGINE.crank, 0, 0.3);                               // the crank pin
    const engineHandle = add(plant, cyl(1.2, 1.2, ENGINE.axle + 1, 14), M.dark, 0, (ENGINE.axle + 1) / 2, -0.3, false, false); engineHandle.visible = false;
    engineHandle.userData.grip = { kind: 'tube' };
    const haze = swarm(46, ENGINE.bore, 1.2); haze.mesh.position.y = ENGINE.base; plant.add(haze.mesh);
    // a body that gives or takes heat: its name is written on its front
    function body(name, colour, plateColour, kind) {
      const group = new T.Group(); plant.add(group);
      add(group, box(2, 2.4, 1.8), mat(colour, { roughness: 0.85 }), 0, 1.2, 0);
      add(group, new T.PlaneGeometry(1.7, 0.56), mat(0xffffff, { map: canvasTexture(510, 168, (g, w, h) => {
        g.fillStyle = plateColour; g.fillRect(0, 0, w, h); g.fillStyle = '#ffffff';
        g.font = '700 104px "Noto Serif KR", serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(name, w / 2, h / 2 + 6);
      }) }), 0, 2.02, 0.905, false);
      const handle = add(group, box(2.3, 2.7, 2.1), M.dark, 0, 1.3, 0, false, false); handle.visible = false; handle.userData.grip = { kind };
      return { group, handle };
    }
    const furnace = body('고열원', 0xb5523f, '#8f3b2c', 'hot'), sink = body('저열원', 0x8fb4d6, '#4d7fb0', 'cold');
    // bands of energy in front of it all, each as wide as the energy it stands for: from the hot body into the engine,
    // from there on to the cold body, and up from it as work
    const flows = new T.Group(); flows.position.z = 1.05; plant.add(flows);
    const dashes = canvasTexture(64, 8, (g, w, h) => { g.clearRect(0, 0, w, h); g.fillStyle = 'rgba(255,255,255,0.6)'; g.fillRect(0, 0, w * 0.3, h); });
    const point = new T.BufferGeometry(); point.setAttribute('position', new T.Float32BufferAttribute([0, -0.5, 0, 1, 0, 0, 0, 0.5, 0], 3));
    function band(colour, parent = flows) {
      const paint = new T.MeshBasicMaterial({ color: colour, transparent: true, opacity: 0.8, depthTest: false, depthWrite: false, side: T.DoubleSide });
      const map = dashes.clone(); map.wrapS = T.RepeatWrapping; map.needsUpdate = true;
      const group = new T.Group(), strip = new T.Mesh(new T.PlaneGeometry(1, 1), paint), marks = new T.Mesh(new T.PlaneGeometry(1, 1), new T.MeshBasicMaterial({ map, transparent: true, depthTest: false, depthWrite: false })), head = new T.Mesh(point, paint);
      strip.renderOrder = head.renderOrder = 12; marks.renderOrder = 13; group.add(strip, marks, head); parent.add(group);
      // from (ax, ay) to (bx, by), wide across; live: the energy is flowing (brighter, with marks that move along it)
      function lay(ax, ay, bx, by, wide, live) {
        const long = Math.hypot(bx - ax, by - ay), tip = Math.min(0.55, long * 0.4), shaft = long - tip;
        group.position.set(ax, ay, 0); group.rotation.z = Math.atan2(by - ay, bx - ax);
        strip.scale.set(shaft, wide, 1); strip.position.x = shaft / 2; marks.scale.copy(strip.scale); marks.position.x = shaft / 2; map.repeat.x = shaft / 0.8;
        head.scale.set(tip, wide * 1.7, 1); head.position.x = shaft;
        paint.opacity = live ? 0.85 : 0.3; marks.visible = live;
      }
      return { group, map, lay, paint };
    }
    const bandIn = band(0xe8843c), bandOut = band(0x5f8fd0), bandWork = band(0xd9b23c);
    // and for the gas in its cylinder: the heat that passes between the plate and the gas, and the work at the piston
    const gasFlows = new T.Group(); gasFlows.position.z = 1.3; rig.add(gasFlows);
    const heatBand = band(0xe8843c, gasFlows), workBand = band(0xd9b23c, gasFlows);
    const heatSpot = new T.Vector3(), workTagSpot = new T.Vector3(), heatTag = view.label(heatSpot), workTag = view.label(workTagSpot), gasTags = [heatTag, workTag];
    const inSpot = new T.Vector3(), outSpot = new T.Vector3(), workSpot = new T.Vector3();
    const inLabel = view.label(inSpot), outLabel = view.label(outSpot, false, -0.25), workLabel = view.label(workSpot, true), engineLabels = [inLabel, outLabel, workLabel];
    const WIDE = 0.003;   // the width of a band for 1 J in a turn

    // ---------- physics ----------
    // Each turn the engine takes Q1 from the hot body, does the work W = e Q1 and gives Q2 = Q1 − W to the cold body,
    // where e is its efficiency. It turns CYCLES times, one turn in TURN seconds; the energies are taken as flowing
    // steadily, so that Q1 = W + Q2 holds at every moment.
    // No engine between a hot body at Th and a cold one at Tc (in K) can have an efficiency above 1 − Tc / Th
    // (advanced): one set higher is brought down to that, and with Th = Tc nothing can be done at all.
    // Without the cold body the gas is heated once, pushes the piston up and stays there: no turn is made.
    // mill: t: seconds so far; q: Q1 for a turn (J); e: the efficiency in use; cap: the most it could be; stuck: there is no cold body.
    const mill = { state: 'ready', t: 0, q: 300, e: 0.3, cap: 1, th: 600, tc: 300, stuck: false, set: 0.3 };
    const TURN = 1.2, CYCLES = 5;
    const turns = () => (mill.stuck ? 0 : mill.t / TURN);                                              // how many turns it has made
    // taken in, done as work, given out so far (J): in whole joules, with the first the sum of the other two, so that what is written always adds up
    const sums = () => { const n = turns(), w = Math.round(mill.q * mill.e * n), out = Math.round(mill.q * (1 - mill.e) * n); return [w + out, w, out]; };
    const angle = () => -Math.PI / 2 + 2 * Math.PI * (mill.stuck ? Math.min(mill.t, TURN / 2) : mill.t) / TURN;       // where the crank is: it starts with the piston at the bottom
    const percent = (share) => String(Number((share * 100).toFixed(1)));
    const places = { hot: null, cold: null };   // where a body is while it is in hand
    const engine = {
      run: mill,
      toStart() {
        const v = ctx.values, cap = ctx.advanced ? Math.max(0, 1 - v.coldT / v.hotT) : 1, set = v.effic / 100;
        Object.assign(mill, { state: 'ready', t: 0, q: v.intake, set, e: Math.min(set, cap), cap, th: v.hotT, tc: v.coldT, stuck: false });
        ctx.charts.engine.set(0, [0, 0, 0]); moved = true;
      },
      launch() {
        engine.toStart();
        const v = ctx.values, over = [0, ENGINE.axle + 1.9];
        if (!v.hotOn) { stopSoon = true; say('고열원을 열기관에 대면 작동합니다', ...over, 3); return; }
        if (mill.cap <= 0) { stopSoon = true; say('두 열원의 온도가 같으면 열이 흐르지 않아 일을 하지 못합니다', ...over, 3.5); return; }
        if (mill.set > mill.cap + 1e-9) say(`이 두 온도에서는 열효율이 ${percent(mill.cap)} %를 넘을 수 없습니다`, ...over, 3.5);
        mill.state = 'run'; mill.stuck = !v.coldOn;
        ctx.seek(0); engine.advance(0);
      },
      advance(dt) {
        mill.t = Math.min(mill.stuck ? TURN / 2 : CYCLES * TURN, mill.t + dt);
        for (const one2 of [bandIn, bandOut, bandWork]) one2.map.offset.x -= dt * 1.4;   // the marks on the bands move along with the energy
        ctx.charts.engine.set(0, sums()); moved = true;
        if (mill.t >= (mill.stuck ? TURN / 2 : CYCLES * TURN) - 1e-9) engine.finish();
      },
      // it stops (its turns are made, a body has been taken away, or it could not go on): a line of the table
      finish() {
        if (mill.state !== 'run') return;
        mill.state = 'done'; stopSoon = true;
        const [q1, w, q2] = sums();
        ctx.tables.engineTable.add([turns().toFixed(1), q1.toFixed(0), w.toFixed(0), q2.toFixed(0), percent(mill.e), ...(ctx.advanced ? [String(mill.th), String(mill.tc), percent(mill.cap)] : ['', '', ''])]);   // the temperatures and the limit belong to the advanced mode
        if (mill.stuck) say('저열원이 없으면 열을 내보내지 못해 순환이 이어지지 않습니다', 0, ENGINE.axle + 1.9, 4);
        moved = true;
      },
      // the two bodies can be handled at any time; a press on the engine itself puts it back to the start
      touch: (state, grip) => (grip.kind === 'tube' ? { kind: 'reset' } : grip),
      handles: [furnace.handle, sink.handle, engineHandle],
      dial: (grip) => (grip.kind === 'hot' ? 'hotOn' : 'coldOn'),
      at: (grip) => (grip.kind === 'hot' ? furnace : sink).group.position.x,
      fly(dt) { const warm = (1 + Math.sin(angle() + 0.5)) / 2; haze.fly(dt, ram.position.y - ENGINE.base, 1.9 + 1.7 * (mill.state === 'ready' ? 0.2 : warm)); },
      move(p) {
        if (ctx.locked.has(grab.id)) { say('잠금', grab.at, 3.2); return; }
        const to = grab.at + p.x - grab.from.x;   // slid along the bench: no nearer than against the engine
        places[grab.kind] = grab.kind === 'hot' ? Math.max(-AWAY - 0.6, Math.min(-SEAT, to)) : Math.min(AWAY + 0.6, Math.max(SEAT, to));
        moved = true;
      },
      end(held) {
        const x = places[held.kind];
        places[held.kind] = null;
        if (x === null) return;
        const near = Math.abs(Math.abs(x) - SEAT) < 0.9;   // near enough: it goes against the engine
        if (near !== ctx.values[held.id]) ctx.set(held.id, near);
        if (ctx.values.hotOn && near && held.kind === 'hot' && mill.state === 'ready') ctx.setPlaying(true);   // the hot body put against it, the engine starts at once
      },
      changed(id) {
        if (id === 'hotOn' || id === 'coldOn') { if (mill.state === 'run' && !ctx.values[id]) engine.finish(); else moved = true; return; }   // a body taken away while it turns: it stops there
        if (!['intake', 'effic', 'hotT', 'coldT'].includes(id)) return;
        if (mill.state !== 'ready') ctx.emit('action', 'reset'); else engine.toStart();   // a run under way is taken back first
      },
      draw() {
        const v = ctx.values, turning = mill.state === 'run', a = angle();
        // the wheel, the crank and the piston
        wheel.rotation.z = a;
        const pinX = ENGINE.crank * Math.cos(a), pinY = ENGINE.axle + ENGINE.crank * Math.sin(a), top = pinY - Math.sqrt(ENGINE.rod ** 2 - pinX ** 2);
        ram.position.y = top - 0.16;
        link.position.set(0, top, 0); link.scale.y = Math.hypot(pinX, pinY - top); link.rotation.z = -Math.atan2(pinX, pinY - top);
        furnace.group.position.x = places.hot !== null ? places.hot : v.hotOn ? -SEAT : -AWAY;
        sink.group.position.x = places.cold !== null ? places.cold : v.coldOn ? SEAT : AWAY;
        const warm = mill.state === 'ready' ? 0.2 : (1 + Math.sin(a + 0.5)) / 2;   // the gas is hottest as it pushes the piston up
        haze.mesh.visible = v.particles; haze.mesh.material.color.copy(CALM).lerp(QUICK, warm);
        // the bands: Q1 comes in from the left; its upper part turns up as W, its lower part goes on to the right as Q2
        const e = mill.state === 'ready' ? Math.min(v.effic / 100, mill.cap) : mill.e, q = mill.state === 'ready' ? v.intake : mill.q;
        const w1 = WIDE * q, wW = Math.max(0.04, w1 * e), w2 = Math.max(0.04, w1 - w1 * e), live = turning && !mill.stuck;
        flows.visible = v.flow;
        bandIn.group.visible = v.hotOn && mill.cap > 0; bandOut.group.visible = bandWork.group.visible = v.hotOn && v.coldOn && mill.cap > 0;
        bandIn.lay(furnace.group.position.x - 0.7, MID, -0.05, MID, w1, turning);   // from the middle of the hot body to the engine
        bandOut.lay(0, MID - w1 / 2 + w2 / 2, sink.group.position.x + 0.8, MID - w1 / 2 + w2 / 2, w2, live);
        bandWork.lay(-0.2 + wW / 2, MID + w1 / 2 - wW, -0.2 + wW / 2, ENGINE.axle - 1.5, wW, live);
        // what is written: the energies of a turn before it starts, and those so far once it turns
        for (const text of engineLabels) text.show(v.numbers);
        if (!v.numbers) return;
        const [q1, w, q2] = mill.state === 'ready' ? [q, q * e, q * (1 - e)] : sums(), lead = mill.state === 'ready' ? '한 순환에 ' : '';
        inSpot.set(-SEAT, 2.85, 1.05); inLabel.write(`${lead}받은 열 ${q1.toFixed(0)} J${ctx.advanced ? ` · ${ctx.values.hotT} K` : ''}`);
        outSpot.set(SEAT + 0.3, 0.05, 1.3); outLabel.write(`${lead}방출한 열 ${q2.toFixed(0)} J${ctx.advanced ? ` · ${ctx.values.coldT} K` : ''}`);
        workSpot.set(2.6, ENGINE.axle - 1.2, 0); workLabel.write(`${lead}한 일 <b>${w.toFixed(0)} J</b><br>열효율 ${percent(e)} %${ctx.advanced ? `<br>열효율의 한계 ${percent(mill.cap)} %` : ''}`);
      },
    };

    // ==================== handling ====================
    // The plate is slid under the table and away again; the pile of weights on the piston is made higher or lower.
    const ray = new T.Raycaster(), upright = new T.Plane(new T.Vector3(0, 0, 1), 0), flat = new T.Plane(new T.Vector3(0, 1, 0), -1.5), hit = new T.Vector3();
    // where the pointer is: along the bench (x) and "up" (height, or away from the viewer when seen from above)
    function pointer(r) {
      if (Math.abs(r.direction.z) > 0.25 && r.intersectPlane(upright, hit)) return { x: hit.x, up: hit.y, rise: 1 };
      return r.intersectPlane(flat, hit) ? { x: hit.x, up: -hit.z, rise: 2 } : null;
    }
    const SCENES = { gas: work, engine }, now = () => SCENES[ctx.values.scene];
    view.setTool({
      pick(r) {
        ray.ray.copy(r); world.updateMatrixWorld(true);
        const found = ray.intersectObjects(now().handles.filter((handle) => handle.parent.visible && !handle.userData.off), false)[0];   // a plate that is put away or fixed cannot be taken hold of
        if (!found) return null;
        const state = now().run.state, grip = found.object.userData.grip;
        if (state === 'ready') return grip;
        return now().touch ? now().touch(state, grip) : { kind: 'reset' };
      },
      cursor: (grip) => (!grip ? '' : grip.kind === 'reset' ? 'pointer' : grip.kind === 'tube' ? '' : 'grab'),
      start(grip, r) {
        if (grip.kind === 'reset') { ctx.emit('action', 'reset'); return false; }   // a press on the cylinder after a run puts the gas back
        if (grip.kind === 'tube') return false;                                    // before a run there is nothing to put back (the cylinder, or the engine itself)
        const p = pointer(r);
        if (!p) return false;
        const id = now().dial(grip);
        grab = { ...grip, id, from: p, value: ctx.values[id], at: now().at(grip), moved: false };
        return true;
      },
      move(r) { const p = pointer(r); if (p && grab) now().move(p); },
      end() {
        const held = grab;
        grab = null; tip.show(false); tipTime = 0; moved = true;
        if (held) now().end(held);
      },
    });

    ctx.on('play', (on) => {
      if (!on) return;
      if (now().run.state === 'done') now().toStart();
      if (now().run.state === 'ready') now().launch();
    });
    ctx.on('tick', (t, dt) => {
      if (!dt) return;
      if (now().run.state === 'ready') now().launch();
      if (now().run.state === 'run') now().advance(dt);
    });
    ctx.on('action', (id) => { if (id === 'reset') now().toStart(); });
    ctx.on('change', (id) => {
      moved = true;
      if (id === 'scene') {   // the other arrangement starts afresh; the engine is first shown with its cold body against it and the bands of energy on
        for (const trace of Object.values(ctx.traces)) trace.clear();
        if (ctx.values.scene === 'engine') for (const on of ['coldOn', 'flow']) if (!ctx.values[on]) ctx.set(on, true);
        ctx.emit('action', 'reset'); work.toStart(); engine.toStart(); frame();
        return;
      }
      now().changed(id);
    });
    ctx.on('mode', () => {   // the other processes and the cold plate belong to the advanced mode
      if (!ctx.advanced) { if (ctx.values.process !== 'isobaric') ctx.set('process', 'isobaric'); if (ctx.values.source !== 'heat') ctx.set('source', 'heat'); }
      if (now().run.state !== 'ready') ctx.emit('action', 'reset'); else now().toStart();
      moved = true;
    });
    // An upright screen stands further back, so that the whole of the cylinder is in sight.
    // The engine with its two bodies is wide and low.
    const frame = () => view.look(ctx.values.scene === 'engine' ? (tall() ? { target: [0, 3.2, 0], r: 27, theta: 0.12, phi: 1.38 } : { target: [0, 2.7, 0], r: 15, theta: 0.15, phi: 1.38 })
      : tall() ? { target: [0.4, 5.3, 0], r: 23, theta: 0.15, phi: 1.42 } : { target: [0.4, 4, 0], r: 13.5, theta: 0.2, phi: 1.42 });
    function draw() {
      const turning = ctx.values.scene === 'engine';
      rig.visible = !turning; plant.visible = turning;
      for (const text of [label, ...engineLabels, ...gasTags]) text.show(false);   // each arrangement shows its own writing
      now().draw();
    }

    work.toStart(); engine.toStart(); work.fly(0);
    return {
      state: () => ({ ...now().run }),
      update(dt) {
        if (!framed) { framed = true; if (tall()) frame(); }
        if (stopSoon) { stopSoon = false; ctx.setPlaying(false); }
        if (tipTime > 0) { tipTime -= dt; if (tipTime <= 0) { tip.show(false); moved = true; } }
        if (ctx.values.particles) { now().fly(Math.min(dt, 0.05)); moved = true; }   // the particles never rest
        if (!moved) return false;
        moved = false; draw();
        return true;
      },
    };
  },
};
