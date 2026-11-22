// P-06 Conservation of energy (3D).
//
// A box on an incline: the box is pulled up an incline and let go. It slides down and along a level board, where
// friction brings it to rest. The mechanical energy it loses is the work done by friction, and it has turned into
// thermal energy: with that counted, the whole of the energy stays the same. Where the box has rubbed, the surfaces
// are warmer, and a lens shows the particles there moving about more.
//
// Joule's experiment: a heavy weight on a string turns paddles in a pot of water as it sinks slowly to the floor, after
// the textbook's figure of Joule's apparatus. The water grows a little warmer each time: the mechanical energy the
// weight has lost is the thermal energy the water has gained.
//
// What is set by hand can be set from the menu as well, over the same ranges and in the same steps.
// Lengths are life-size: one unit of the scene is 10 cm. g = 9.8 m/s^2.
const RED = '#e58373', BLUE = '#7fa6e6', GOLD = '#e3c26b', ORANGE = '#e8a05c';
// to two places; a value that ends in 5 goes up whichever side of it the arithmetic left it, so that equal energies are written alike
const two = (value) => (Math.round(value * 100 + 1e-6) / 100).toFixed(2);
const joules = (e) => `${two(e)} J`;
const one = (value) => (Math.round(value * 10 + 1e-6) / 10).toFixed(1);
const it = (text) => `<i style="font-family: Georgia, serif">${text}</i>`;
const sloping = (values) => values.scene !== 'joule', stirring = (values) => values.scene === 'joule';   // which arrangement an item of a menu belongs to
const ENERGY = { window: 10, range: 1, read: joules }, PATH = { window: 1.8, range: 1, read: joules };
const SURFACES = [{ id: 'smooth', label: '매끄러운 면', mu: 0.2 }, { id: 'plain', label: '보통 면', mu: 0.3 }, { id: 'rough', label: '거친 면', mu: 0.4 }];

export default {
  // what is taken for granted, written on screen by the frame
  premise: (v, advanced) => (v.scene !== 'joule' ? '공기 저항은 없고, 빗면 끝의 모서리에서 속력은 변하지 않는다고 봅니다'
    : advanced && v.potHeat > 0 ? '주위로 새는 열은 없다고 봅니다' : '열량계의 열용량과 주위로 새는 열은 없다고 봅니다'),
  fixedViews: ['front', 'top'],
  camera: { target: [0, 1.5, 0], r: 18, theta: 0.15, phi: 1.25, rMax: 34 },
  stepTime: 0.02,                 // "one step at a time" moves on by this many seconds
  traces: {
    eP: ENERGY, eK: ENERGY, eQ: ENERGY, eT: ENERGY,
    pM: PATH, pQ: PATH,           // against the distance the box has slid (m), not against time
    rise: { window: 60, range: 0.05, read: (t) => `${t.toFixed(3)} ℃` },   // how much warmer the water is than at the start
  },
  charts: {
    energy: { names: ['위치 에너지', '운동 에너지', '열에너지', '합'], colors: [BLUE, RED, ORANGE, GOLD], groups: ['J'], signed: false, range: 1, read: two },
    joule: { names: ['감소한 역학적 에너지', '물이 얻은 열에너지'], colors: [BLUE, ORANGE, GOLD], groups: ['J'], signed: false, range: 20, read: one },
  },
  menus: {
    vars: [
      { id: 'scene', label: '장면 선택', kind: 'choice', value: 'slope', options: [{ id: 'slope', label: '빗면 위의 상자' }, { id: 'joule', label: '줄의 실험' }] },
      { id: 'along', label: '놓는 위치', kind: 'slider', min: 0.1, max: 0.55, step: 0.01, value: 0.4, digits: 2, unit: ' m', when: sloping },
      { id: 'angle', label: '기울기', kind: 'slider', min: 10, max: 35, step: 1, value: 25, unit: '°', when: sloping },
      { id: 'mass', label: '질량', kind: 'slider', min: 0.5, max: 2, step: 0.5, value: 1, digits: 1, unit: ' kg', when: sloping },
      { id: 'surface', label: '면의 종류', kind: 'choice', value: 'plain', when: sloping, options: SURFACES.map(({ id, label }) => ({ id, label })) },
      { id: 'mu', label: '마찰 계수', kind: 'slider', min: 0.2, max: 0.5, step: 0.05, value: 0.3, digits: 2, advanced: true, when: sloping },
      { id: 'count', label: '추의 개수', kind: 'slider', min: 1, max: 6, step: 1, value: 4, unit: '개', when: stirring },   // discs of 5 kg
      { id: 'drop', label: '낙하 높이', kind: 'slider', min: 0.2, max: 0.6, step: 0.05, value: 0.5, digits: 2, unit: ' m', when: stirring },
      { id: 'water', label: '물의 질량', kind: 'slider', min: 0.1, max: 0.5, step: 0.1, value: 0.2, digits: 1, unit: ' kg', when: stirring },
      { id: 'potHeat', label: '열량계의 열용량', kind: 'slider', min: 0, max: 200, step: 50, value: 0, unit: ' J/℃', advanced: true, when: stirring },
    ],
    graph: [
      { id: 'energy', label: '에너지 막대', kind: 'graph', bars: 'energy', when: sloping },
      { id: 'energyTime', label: '에너지–시간', kind: 'graph', x: '시간', when: sloping, plots: [{ y: '에너지', lines: [{ trace: 'eP', color: BLUE, name: '위치' }, { trace: 'eK', color: RED, name: '운동' }, { trace: 'eQ', color: ORANGE, name: '열' }, { trace: 'eT', color: GOLD, name: '합' }] }] },
      // the mechanical energy falls and the thermal energy rises by the friction for every metre slid
      { id: 'energyPath', label: '에너지–이동 거리', kind: 'graph', x: '이동 거리', xUnit: 'm', advanced: true, when: sloping, plots: [{ y: '에너지', lines: [{ trace: 'pM', color: BLUE, name: '역학적' }, { trace: 'pQ', color: ORANGE, name: '열' }] }] },
      { id: 'jouleBars', label: '에너지 막대', kind: 'graph', bars: 'joule', when: stirring },
      { id: 'riseTime', label: '온도 변화–시간', kind: 'graph', x: '시간', plots: [{ y: '온도 변화', trace: 'rise' }], when: stirring },
    ],
    time: [
      { id: 'slow', label: '느리게', kind: 'toggle' },
      { id: 'reset', label: '처음으로', kind: 'action' },
      { id: 'step', label: '한 단계씩', kind: 'action', advanced: true },
    ],
    layers: [
      { id: 'warmth', label: '접촉면 온도', kind: 'toggle', value: true, when: sloping },   // on from the start: where the box has rubbed is what this is about
      { id: 'particles', label: '입자 운동', kind: 'toggle' },
      { id: 'velocityArrow', label: '속도 화살표', kind: 'toggle' },
      { id: 'heightMark', label: '높이', kind: 'toggle', when: sloping },
      { id: 'numbers', label: '값', kind: 'toggle' },
      { id: 'forceArrow', label: '힘 화살표', kind: 'toggle', advanced: true },
    ],
    inquiry: [
      { id: 'table', label: '기록 표', kind: 'table', wide: true, when: sloping, text: '상자가 멈출 때마다 한 줄씩 적힙니다.',
        columns: [{ label: '높이', unit: 'm' }, { label: '질량', unit: 'kg' }, { label: '기울기', unit: '°' }, { label: '면' }, { label: '마찰 계수', advanced: true },
          { label: '빗면<br>이동 거리', unit: 'm' }, { label: '수평면<br>이동 거리', unit: 'm', result: true },
          { label: '감소한<br>역학적<br>에너지', unit: 'J', result: true }, { label: '마찰력이<br>한 일', unit: 'J', result: true }] },   // narrow headings, so that the table fits an upright phone
      { id: 'jouleTable', label: '기록 표', kind: 'table', wide: true, when: stirring, text: '추가 받침에 닿을 때마다 한 줄씩, 처음부터 더한 값으로 적힙니다.',
        columns: [{ label: '추의<br>질량', unit: 'kg' }, { label: '낙하<br>높이', unit: 'm' }, { label: '물의<br>질량', unit: 'kg' }, { label: '낙하<br>횟수' },
          { label: '감소한<br>역학적<br>에너지', unit: 'J', result: true }, { label: '온도<br>변화', unit: '℃', result: true }, { label: '물이<br>얻은<br>열에너지', unit: 'J', result: true },
          { label: '열량계가<br>얻은<br>열에너지', unit: 'J', result: true, advanced: true }, { label: '열량', unit: 'cal', result: true, advanced: true }, { label: '열의<br>일당량', unit: 'J/cal', result: true, advanced: true }] },
      // what is taken for granted, and how the heat is worked out: for the plain pot, and for a pot that takes heat itself
      { id: 'premise', label: '실험의 가정', kind: 'note', when: (v) => stirring(v) && !(v.potHeat > 0),
        text: '열량계 자체의 열용량과 주위로 새는 열은 없다고 봅니다. 추가 잃은 역학적 에너지는 모두 물의 열에너지가 됩니다.<br><br>물이 얻은 열에너지 = 4200 J/(kg·℃) × 물의 질량 × 온도 변화' },
      { id: 'premisePot', label: '실험의 가정', kind: 'note', when: (v) => stirring(v) && v.potHeat > 0,
        text: '주위로 새는 열은 없다고 봅니다. 추가 잃은 역학적 에너지는 물과 열량계의 열에너지가 됩니다.<br><br>물이 얻은 열에너지 = 4200 J/(kg·℃) × 물의 질량 × 온도 변화<br>열량계가 얻은 열에너지 = 열량계의 열용량 × 온도 변화' },
      { id: 'equivalent', label: '열의 일당량', kind: 'note', advanced: true, when: stirring,
        text: `일 ${it('W')}(J)와 그 일로 생긴 열량 ${it('Q')}(cal)는 비례합니다.<br><br>${it('W')} = ${it('J')}${it('Q')}, ${it('J')} = ${it('W')} ÷ ${it('Q')} ≈ 4.2 J/cal<br><br>비례 상수 ${it('J')}가 열의 일당량입니다. 1 cal은 물 1 g의 온도를 1 ℃ 높이는 열량입니다.` },
    ],
  },

  // writing on the chalkboard (1024 x 400)
  board(g) {
    g.fillStyle = 'rgba(255,255,255,0.9)'; g.font = '56px Georgia, serif'; g.fillText('에너지 보존', 60, 96);
    g.font = 'italic 54px Georgia, serif'; g.fillText('E', 60, 210); g.fillText('+ E', 132, 210); g.fillText('+ Q = 일정', 282, 210);
    g.font = 'italic 30px Georgia, serif'; g.fillText('P', 96, 226); g.fillText('K', 240, 226);
    g.font = '40px Georgia, serif'; g.fillText('감소한 역학적 에너지 = 마찰력이 한 일', 60, 320);
    g.strokeStyle = 'rgba(255,255,255,0.8)'; g.lineWidth = 5;
    g.beginPath(); g.moveTo(700, 120); g.lineTo(820, 240); g.lineTo(980, 240); g.moveTo(700, 240); g.lineTo(820, 240); g.stroke();   // an incline and a level board
    g.strokeRect(728, 118, 44, 30);
  },

  // Builds the apparatus on the bench (world) and returns { update(dt) }.
  create({ T, kit, world, view, ctx }) {
    const { mat, add, box, cyl, canvasTexture, roundedBox } = kit;
    world.userData.things.visible = false;   // the boards take the whole bench
    const G = 9.8, RAD = Math.PI / 180;
    const M = { steel: mat(0x8f96a8), dark: mat(0x3a4057), body: mat(0xd9584a), knob: mat(0xe3a52b), brass: mat(0xc9a35a, { roughness: 0.7 }), brassDark: mat(0xad8843, { roughness: 0.7 }), wood: mat(0xd9b38c, { roughness: 0.9 }), sole: mat(0x7a4a3a) };
    const INK = { velocity: 0x1f9d6b, weight: 0x9a3fc2, normal: 0x3f6fd0, rub: 0xc8571f, mark: 0x1d2440 };
    const UP = new T.Vector3(0, 1, 0), DOWN = new T.Vector3(0, -1, 0), aim = new T.Vector3();
    const COOL = new T.Color(0x7a4a3a), HOT = new T.Color(0xff5a2a), SMOOTH = new T.Color(0xdcbd97), ROUGH = new T.Color(0x9a7a5e);

    // ==================== a box on an incline ====================
    // The incline turns about its foot, where it meets a level board. FOOT: where they meet; LONG: the length of the
    // incline; END: the far end of the level board; TOP: the upper face of the boards above the bench.
    const FOOT = -3.2, LONG = 6.4, END = 9.4, TOP = 0.12, WIDE = 1.7, STRIP = { z: 0.62, wide: 0.3 }, HALF = 0.4;   // HALF: half the length of the box
    const rule = (length, back) => canvasTexture(Math.round(length * 160), 48, (g, w, h) => {   // a rule in cm; back: 0 at its right-hand end
      g.fillStyle = '#f2d675'; g.fillRect(0, 0, w, h); g.strokeStyle = g.fillStyle = '#4a3f1c';
      g.font = '700 22px Helvetica, Arial, sans-serif'; g.textAlign = 'center';
      for (let c = 0; c <= length * 10; c++) {
        const x = back ? w - c * 16 : c * 16, long = c % 10 === 0 ? 0.5 : c % 5 === 0 ? 0.36 : 0.2;
        g.lineWidth = c % 10 === 0 ? 3 : 1.5; g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h * long); g.stroke();
        if (c % 10 === 0 && c > 0 && c < length * 10) g.fillText(String(c), x, h - 5);
      }
    });
    const rig = new T.Group(); world.add(rig);
    add(rig, box(END - FOOT, TOP, WIDE), M.wood, (FOOT + END) / 2, TOP / 2, 0);
    add(rig, new T.PlaneGeometry(END - FOOT, STRIP.wide), mat(0xffffff, { map: rule(END - FOOT, false) }), (FOOT + END) / 2, TOP + 0.003, STRIP.z, false).rotation.x = -Math.PI / 2;
    add(rig, box(0.25, 0.7, WIDE), M.dark, END + 0.125, 0.35, 0);                               // the end of the board
    add(rig, cyl(0.07, 0.07, WIDE + 0.1, 14).rotateX(Math.PI / 2), M.steel, FOOT, TOP - 0.05, 0);   // the hinge
    const ramp = new T.Group(); ramp.position.set(FOOT, TOP, 0); rig.add(ramp);                  // its upper face runs from the hinge along −x
    add(ramp, box(LONG, TOP, WIDE), M.wood, -LONG / 2, -TOP / 2, 0);
    add(ramp, new T.PlaneGeometry(LONG, STRIP.wide), mat(0xffffff, { map: rule(LONG, true) }), -LONG / 2, 0.003, STRIP.z, false).rotation.x = -Math.PI / 2;
    add(ramp, new T.SphereGeometry(0.17, 18, 12), M.knob, -LONG - 0.1, -TOP / 2, 0);   // what the incline is raised by
    const tiltHandle = add(ramp, box(1.1, 1.1, WIDE + 0.4), M.dark, -LONG - 0.1, -TOP / 2, 0, false, false); tiltHandle.visible = false;
    tiltHandle.userData.grip = { kind: 'tilt' };
    const prop = add(rig, cyl(0.06, 0.06, 1, 12).translate(0, 0.5, 0), M.steel, 0, 0, -0.5), propFoot = add(rig, box(0.7, 0.06, 0.9), M.dark, 0, 0.03, -0.5);   // holds the incline up
    // where the box has rubbed, the boards glow: brighter for a larger force of friction
    const glow = () => new T.Mesh(new T.PlaneGeometry(1, HALF * 2 - 0.1).rotateX(-Math.PI / 2), new T.MeshBasicMaterial({ color: 0xff5a2a, transparent: true, opacity: 0.4, depthWrite: false }));
    const rampTrail = glow(), levelTrail = glow(); ramp.add(rampTrail); rig.add(levelTrail);
    rampTrail.position.y = 0.006; levelTrail.position.y = TOP + 0.006;

    // ---------- the box: 0.5 kg, with weights of 0.5 kg on it, and a pointer over the rule ----------
    const crate = new T.Group(); rig.add(crate);   // its origin is the middle of its underside
    const sole = add(crate, box(HALF * 2, 0.05, 0.7), M.sole, 0, 0.025, 0);
    add(crate, roundedBox(HALF * 2, 0.46, 0.7, 0.05), M.body, 0, 0.28, 0);
    add(crate, box(0.025, 0.025, 0.55), M.dark, 0, 0.03, 0.6, false);
    const slabs = Array.from({ length: 3 }, (_, i) => add(crate, cyl(0.27, 0.27, 0.11, 26), i % 2 ? M.brassDark : M.brass, 0, 0.51 + 0.06 + i * 0.12, 0));
    const crateHandle = add(crate, box(1.3, 1.6, 1.3), M.dark, 0, 0.6, 0, false, false); crateHandle.visible = false;
    crateHandle.userData.grip = { kind: 'crate' };

    // ---------- a lens on the surfaces in contact: the particles of the box above, those of the board below ----------
    const lens = new T.Group(); world.add(lens);
    const over = (geo, color, opacity, order) => { const one = new T.Mesh(geo, new T.MeshBasicMaterial({ color, transparent: true, opacity, depthTest: false, depthWrite: false })); one.renderOrder = order; lens.add(one); return one; };
    over(new T.CircleGeometry(1.3, 48), 0x161b2e, 0.92, 20); over(new T.RingGeometry(1.3, 1.37, 48), 0xe3c26b, 1, 21);
    const seam = over(new T.PlaneGeometry(2.3, 0.02), 0xf3eedf, 0.5, 21);   // where the two surfaces meet
    const SITES = [];   // where each particle rests in the lens, and how it moves about there
    for (const row of [0.5, 0.2, -0.2, -0.5]) for (let i = 0; i < 7; i++) if (Math.hypot((i - 3) * 0.3, row) < 1.12) SITES.push({ x: (i - 3) * 0.3, y: row, a: Math.random() * 6.28, b: Math.random() * 6.28, f: 0.7 + Math.random() * 0.6 });
    const dots = new T.InstancedMesh(new T.CircleGeometry(0.1, 16), new T.MeshBasicMaterial({ transparent: true, depthTest: false, depthWrite: false }), SITES.length);
    dots.renderOrder = 22; dots.frustumCulled = false; lens.add(dots);
    const where = new T.Matrix4(), DOT = { box: new T.Color(0xe0584a), board: new T.Color(0xcfa56a), water: new T.Color(0x7fb6ea) };
    const lensSpot = new T.Vector3(), lensLabel = view.label(lensSpot);
    let wet = null;   // whether the lens last showed water
    // The lens at a place, facing the viewer. warm (0 to 1): how far and how fast the particles move about. liquid: the
    // particles of water, which also wander; otherwise those of the box above and of the board below, each about its own place.
    function showLens(on, x, y, z, warm, liquid, text) {
      lens.visible = on; lensLabel.show(on);
      if (!on) return;
      if (wet !== liquid) {
        wet = liquid; seam.visible = !liquid;
        SITES.forEach((site, i) => dots.setColorAt(i, liquid ? DOT.water : site.y > 0 ? DOT.box : DOT.board)); dots.instanceColor.needsUpdate = true;
      }
      lens.position.set(x, y, z); lens.quaternion.copy(view.camera.quaternion);
      const reach = (liquid ? 0.03 : 0.012) + 0.075 * warm, rate = 5 + 16 * warm, drift = liquid ? 0.07 : 0;
      SITES.forEach((site, i) => {
        where.makeTranslation(site.x + reach * Math.sin(clock * rate * site.f + site.a) + drift * Math.sin(clock * 0.9 * site.f + site.b),
          site.y + reach * Math.sin(clock * rate * site.f * 1.31 + site.b) + drift * Math.sin(clock * 0.7 * site.f + site.a), 0.01);
        dots.setMatrixAt(i, where);
      });
      dots.instanceMatrix.needsUpdate = true;
      lensSpot.set(x, y + 1.45, z); lensLabel.write(text);
    }

    // ---------- marks ----------
    const speedArrow = kit.arrow(INK.velocity, 0.045), weightArrow = kit.arrow(INK.weight, 0.04), normalArrow = kit.arrow(INK.normal, 0.04), rubArrow = kit.arrow(INK.rub, 0.04);
    const heightLine = new T.Mesh(box(0.028, 1, 0.028).translate(0, 0.5, 0), new T.MeshBasicMaterial({ color: INK.mark, depthTest: false, transparent: true, opacity: 0.85 })); heightLine.renderOrder = 10;
    rig.add(speedArrow, weightArrow, normalArrow, rubArrow, heightLine);
    const spot = new T.Vector3(), label = view.label(spot, true, -0.3), heightSpot = new T.Vector3(), heightLabel = view.label(heightSpot), angleSpot = new T.Vector3(), angleLabel = view.label(angleSpot), tipSpot = new T.Vector3(), tip = view.label(tipSpot);
    const NEWTON = 0.12, PER_SPEED = 0.5;   // lengths of the arrows for 1 N and for 1 m/s

    // ---------- physics ----------
    // On the incline (angle th) the box speeds up by a1 = g (sin th − mu cos th): gravity along the incline less the
    // friction mu N, where N = m g cos th. If that is not positive, friction holds the box where it is.
    // From rest, s0 up the incline: it reaches the foot after t1 = sqrt(2 s0 / a1) at v1 = a1 t1. The corner is taken
    // as rounded, so that it keeps its speed there. On the level board friction mu m g slows it by a2 = mu g, and it
    // stops after v1 / a2, having gone v1^2 / (2 a2) along the board.
    // The work of friction is its force times the distance slid: mu m g cos th on the incline, mu m g on the level.
    // That work has become thermal energy, so potential + kinetic + thermal stays m g h0 throughout.
    // run: one run. gone: how far the box has slid since it was let go (m); s0: how far up the incline it started.
    const run = { state: 'ready', t: 0, gone: 0, v: 0, s0: 0.4, th: 25 * RAD, m: 1, mu: 0.3, a1: 0, grid: -1, cm: -1 };
    const STEP = 0.02, PACE = 0.01;   // the graphs are kept every STEP seconds, and every PACE metres slid
    const muOf = (id) => SURFACES.find((one) => one.id === id).mu;                               // the coefficient of friction of a kind of board
    const friction = () => (ctx.advanced ? ctx.values.mu : muOf(ctx.values.surface));           // the coefficient of friction in use
    const onLevel = () => Math.max(0, run.gone - run.s0), onRamp = () => Math.min(run.gone, run.s0);                  // how far it has slid on each board
    const rubs = () => [run.mu * run.m * G * Math.cos(run.th), run.mu * run.m * G];                                   // the force of friction on the incline and on the level
    // the energies when it has slid `gone` and moves at v: potential (heights from the level board), kinetic, thermal, and all three together
    function energies(gone = run.gone, v = run.v) {
      const [f1, f2] = rubs(), p = run.m * G * Math.sin(run.th) * Math.max(0, run.s0 - gone), k = run.m * v * v / 2;
      const q = f1 * Math.min(gone, run.s0) + f2 * Math.max(0, gone - run.s0);
      return [p, k, q, p + k + q];
    }
    // where it is t seconds after it was let go: [how far it has slid, its speed, whether it has stopped]
    function at(t) {
      const t1 = Math.sqrt(2 * run.s0 / run.a1), v1 = run.a1 * t1, a2 = run.mu * G;
      if (t <= t1) return [run.a1 * t * t / 2, run.a1 * t, false];
      const more = Math.min(t - t1, v1 / a2);
      return [run.s0 + v1 * more - a2 * more * more / 2, v1 - a2 * more, t - t1 >= v1 / a2];
    }
    // its speed when it has slid `gone` (m), for the graph against distance
    const speedAt = (gone) => Math.sqrt(Math.max(0, gone <= run.s0 ? 2 * run.a1 * gone : 2 * run.a1 * run.s0 - 2 * run.mu * G * (gone - run.s0)));

    // ---------- state ----------
    let moved = true, stopSoon = false, tipTime = 0, framed = false, grab = null, clock = 0;
    function say(text, x, y, seconds = 0) { tip.write(text); tipSpot.set(x, y, 0); tip.show(true); tipTime = seconds; moved = true; }
    function bars() { ctx.charts.energy.set(0, energies()); }
    const slope = {
      run,
      // held on the incline where it has been put, ready to be let go
      toStart() {
        const v = ctx.values, th = v.angle * RAD, mu = friction();
        Object.assign(run, { state: 'ready', t: 0, gone: 0, v: 0, s0: v.along, th, m: v.mass, mu, a1: G * (Math.sin(th) - mu * Math.cos(th)), grid: -1, cm: -1 });
        bars(); moved = true;
      },
      launch() {
        slope.toStart(); run.state = 'run';
        for (const trace of Object.values(ctx.traces)) trace.clear();
        ctx.seek(0);
        if (run.a1 <= 1e-9) {   // friction is enough to hold it
          run.state = 'done'; stopSoon = true; slope.note();
          say('마찰 때문에 미끄러지지 않습니다', crate.position.x, crate.position.y + 2, 2.5);
          return;
        }
        slope.advance(0);
      },
      advance(dt) {
        run.t += dt;
        const [gone, v, still] = at(run.t);
        run.gone = gone; run.v = v;
        while ((run.grid + 1) * STEP <= run.t + 1e-9) {       // the energies against time
          const t = ++run.grid * STEP, [far, fast] = at(t), [p, k, q, sum] = energies(far, fast);
          ctx.traces.eP.add(t, p); ctx.traces.eK.add(t, k); ctx.traces.eQ.add(t, q); ctx.traces.eT.add(t, sum);
        }
        while ((run.cm + 1) * PACE <= run.gone + 1e-9) {      // and against the distance slid
          const far = ++run.cm * PACE, [p, k, q] = energies(far, speedAt(far));
          ctx.traces.pM.add(far, p + k); ctx.traces.pQ.add(far, q);
        }
        bars(); moved = true;
        if (still) { run.state = 'done'; stopSoon = true; slope.note(); }
      },
      // one line of the table: what was set, how far it slid, the mechanical energy it lost and the work of friction
      note() {
        const [f1, f2] = rubs(), [p, k] = energies(), lost = run.m * G * Math.sin(run.th) * run.s0 - (p + k), work = f1 * onRamp() + f2 * onLevel();
        const face = SURFACES.find((one) => Math.abs(one.mu - run.mu) < 1e-9);
        ctx.tables.table.add([(run.s0 * Math.sin(run.th)).toFixed(2), run.m.toFixed(1), String(Math.round(run.th / RAD)), face ? face.label.replace(' 면', '') : '', run.mu.toFixed(2),
          onRamp().toFixed(2), onLevel().toFixed(2), two(lost), two(work)]);
      },
      handles: [crateHandle, tiltHandle],
      dial: (grip) => (grip.kind === 'tilt' ? 'angle' : 'along'),
      move(p) {
        const v = ctx.values, id = grab.id;
        if (grab.kind === 'tilt') {   // the incline turns about its foot, 1 degree at a time
          const high = FOOT - LONG * Math.cos(run.th), far = TOP + LONG * Math.sin(run.th) + 0.9;
          if (ctx.locked.has(id)) { say('잠금', high, far); return; }
          const to = Math.round(Math.max(10, Math.min(35, grab.value + (p.up - grab.from.up) / p.rise / (LONG * Math.cos(grab.value * RAD)) / RAD)));
          if (to !== v.angle) ctx.set('angle', to);
          say(`${v.angle}°`, FOOT - LONG * Math.cos(v.angle * RAD), TOP + LONG * Math.sin(v.angle * RAD) + 0.9);
        } else {                      // the box goes along the incline, 1 cm at a time
          const beside = [crate.position.x, crate.position.y + 2];
          if (ctx.locked.has(id)) { say('잠금', ...beside); return; }
          const to = Math.round(Math.max(0.1, Math.min(0.55, grab.value - (p.x - grab.from.x) / 10 / Math.cos(run.th))) * 100) / 100;
          if (to !== v.along) ctx.set('along', to);
          grab.moved = true; say(`높이 ${(v.along * Math.sin(run.th)).toFixed(2)} m`, FOOT - v.along * 10 * Math.cos(run.th), TOP + v.along * 10 * Math.sin(run.th) + 2);
        }
      },
      end(held) { if (held.kind === 'crate' && held.moved && !ctx.locked.has('along')) ctx.setPlaying(true); },   // let go, the box sets off at once
      changed(id) {
        if (id === 'surface' && ctx.values.mu !== muOf(ctx.values.surface)) { ctx.set('mu', muOf(ctx.values.surface)); return; }   // a board is chosen: its coefficient is set, in the basic mode too, so that the advanced mode starts from the board in use (which comes back here)
        if (!['along', 'angle', 'mass', 'surface', 'mu'].includes(id)) return;
        if (run.state !== 'ready') ctx.emit('action', 'reset'); else slope.toStart();   // a run under way is taken back first
      },
      draw() {
        const v = ctx.values, th = run.th, cos = Math.cos(th), sin = Math.sin(th), far = onLevel() * 10, up = (run.s0 - onRamp()) * 10;   // units along the level, and up the incline
        const [p, k, q, sum] = energies(), [f1, f2] = rubs(), down = run.gone < run.s0;
        // the boards: the incline at its angle, its prop under it, and their colour for the roughness
        ramp.rotation.z = -th;
        const under = LONG - 0.8; prop.position.x = propFoot.position.x = FOOT - under * cos; prop.scale.y = Math.max(0.05, TOP + under * sin - TOP / cos - 0.02);
        M.wood.color.copy(SMOOTH).lerp(ROUGH, (run.mu - 0.2) / 0.3);
        // the box: on the incline, or on the level; near the foot it tips from one onto the other
        const tilt = th * Math.max(0, Math.min(1, 0.5 - (down ? -up : far) / (2 * HALF)));
        crate.position.set(down ? FOOT - up * cos : FOOT + far, TOP + (down ? up * sin : 0), 0); crate.rotation.z = -tilt;
        const n = Math.round((run.m - 0.5) / 0.5);
        slabs.forEach((slab, i) => { slab.visible = i < n; });
        const cx = crate.position.x + 0.28 * Math.sin(tilt), cy = crate.position.y + 0.28 * Math.cos(tilt);   // about the middle of the box
        // where it has rubbed: the glow on the boards, and the underside of the box
        const warm = Math.min(1, Math.sqrt(q / 6));   // how warm the surfaces are, for the pictures (0 to 1)
        rampTrail.visible = v.warmth && onRamp() > 0.005; levelTrail.visible = v.warmth && far > 0.05;
        rampTrail.scale.x = Math.max(0.01, onRamp() * 10); rampTrail.position.x = -(run.s0 * 10 + up) / 2; rampTrail.material.opacity = 0.18 + 0.05 * f1;
        levelTrail.scale.x = Math.max(0.01, far); levelTrail.position.x = FOOT + far / 2; levelTrail.material.opacity = 0.18 + 0.05 * f2;
        sole.material.color.copy(COOL).lerp(HOT, v.warmth ? warm : 0);
        // the lens: over the box, facing the viewer
        showLens(v.particles, crate.position.x, crate.position.y + 3 + n * 0.12, 0.6, warm, false, '접촉면의 입자');
        // arrows
        const going = run.state === 'run' && run.v > 0.02;
        speedArrow.visible = v.velocityArrow && going;
        if (speedArrow.visible) { speedArrow.position.set(cx, cy + 0.6 + n * 0.12, 0); speedArrow.setLength(PER_SPEED * run.v); speedArrow.aim(aim.set(Math.cos(tilt), -Math.sin(tilt), 0)); }
        // the forces: its weight, the push of the board square to it, and while it slides the friction against its motion
        const force = ctx.advanced && v.forceArrow, push = run.m * G * Math.cos(tilt);
        weightArrow.visible = normalArrow.visible = force; rubArrow.visible = force && going;
        if (force) {
          weightArrow.position.set(cx, cy, 0.45); weightArrow.setLength(NEWTON * run.m * G); weightArrow.aim(DOWN);
          normalArrow.position.set(cx, cy, 0.45); normalArrow.setLength(Math.max(0.3, NEWTON * push)); normalArrow.aim(aim.set(Math.sin(tilt), Math.cos(tilt), 0));
          if (rubArrow.visible) { rubArrow.position.set(crate.position.x, crate.position.y + 0.05, 0.45); rubArrow.setLength(Math.max(0.3, NEWTON * run.mu * push)); rubArrow.aim(aim.set(-Math.cos(tilt), Math.sin(tilt), 0)); }
        }
        // the height of the box above the level board, and the angle of the incline
        const high = up * sin;
        heightLine.visible = v.heightMark && high > 0.02; heightLabel.show(v.heightMark); angleLabel.show(v.heightMark);
        if (v.heightMark) {
          heightLine.position.set(crate.position.x, TOP, STRIP.z + 0.35); heightLine.scale.y = Math.max(0.01, high);
          heightSpot.set(crate.position.x - 1.1, TOP + high / 2, STRIP.z + 0.35); heightLabel.write(`${(high / 10).toFixed(2)} m`);
          angleSpot.set(FOOT - 1.9, TOP + 0.15, STRIP.z + 0.5); angleLabel.write(`${Math.round(th / RAD)}°`);
        }
        label.show(v.numbers);
        if (v.numbers) {
          spot.set(1.5, 0, 2.3);   // on the bench in front of the boards, hanging below that point: clear of the box, the lens and the panels at the side
          const rub = run.state === 'run' ? `<br>마찰력 ${(down ? f1 : f2).toFixed(2)} N` : run.state === 'done' ? `<br>수평면 이동 거리 <b>${onLevel().toFixed(2)} m</b>` : '';
          label.write(`높이 ${(high / 10).toFixed(2)} m · 속력 ${run.v.toFixed(2)} m/s${rub}<br>위치 에너지 ${two(p)} J<br>운동 에너지 ${two(k)} J<br>열에너지 ${two(q)} J<br>합 <b>${two(sum)} J</b>`);
        }
      },
    };

    // ==================== Joule's experiment ====================
    // A pot of water stands near the end of the bench. Paddles in it hang on an upright shaft with a drum at its top; a
    // string wound on the drum runs level to a wheel over the edge of the bench and down to a weight, which sinks to a mat on the floor.
    const POT = { x: 6.4, base: 0.2, tall: 1.3, inner: 0.5, outer: 0.85 }, DRUM = { y: 2.5, r: 0.25 }, WHEEL = { x: 10.8, r: 0.3 }, MAT = -8.34;   // MAT: the top of the mat
    const DISC = { r: 0.9, tall: 0.25, each: 5 }, DEEP = 1.273;   // the weight: discs of iron of 5 kg; DEEP: the depth of 1 kg of water in the pot (units)
    const still = new T.Group(); world.add(still);
    add(still, cyl(POT.outer, POT.outer, POT.base, 40), M.dark, POT.x, POT.base / 2, 0);
    const shell = add(still, new T.CylinderGeometry(POT.outer, POT.outer, POT.tall, 40, 1, true), mat(0xe3e9f1, { transparent: true, opacity: 0.3, roughness: 0.3, depthWrite: false, side: T.DoubleSide }), POT.x, POT.base + POT.tall / 2, 0, false, false);
    shell.renderOrder = 3;
    const pond = add(still, cyl(POT.inner, POT.inner, 1, 32).translate(0, 0.5, 0), mat(0x6fa8dc, { transparent: true, opacity: 0.85, roughness: 0.2 }), POT.x, POT.base, 0, false, false);
    add(still, new T.TorusGeometry(POT.outer, 0.04, 8, 40).rotateX(Math.PI / 2), M.dark, POT.x, POT.base + POT.tall, 0, false);
    add(still, cyl(0.03, 0.03, 1.7, 10), mat(0xf4f6f8, { roughness: 0.3 }), POT.x - 0.33, POT.base + 0.95, 0.27, false);   // the thermometer
    add(still, new T.SphereGeometry(0.06, 12, 10), M.body, POT.x - 0.33, POT.base + 0.1, 0.27, false);
    const spinner = new T.Group(); spinner.position.set(POT.x, 0, 0); still.add(spinner);   // the shaft, the paddles and the drum turn together
    add(spinner, cyl(0.035, 0.035, DRUM.y + 0.4 - POT.base, 12).translate(0, (DRUM.y + 0.4 - POT.base) / 2, 0), M.steel, 0, POT.base + 0.03, 0);
    for (let i = 0; i < 4; i++) { const blade = add(spinner, box(0.4, 0.26, 0.03), M.steel, 0.24 * Math.cos(i * Math.PI / 2), POT.base + 0.16, -0.24 * Math.sin(i * Math.PI / 2), false); blade.rotation.y = i * Math.PI / 2; }
    add(spinner, cyl(DRUM.r, DRUM.r, 0.36, 28), M.wood, 0, DRUM.y, 0);
    for (let i = 0; i < 4; i++) {   // vanes fixed to the pot between the paddles: the water cannot simply turn with the paddles, and is hard to stir
      const turn = Math.PI / 4 + i * Math.PI / 2, vane = add(still, box(0.16, 0.3, 0.03), M.dark, POT.x + 0.42 * Math.cos(turn), POT.base + 0.16, -0.42 * Math.sin(turn), false);
      vane.rotation.y = turn;
    }
    add(spinner, box(0.05, 0.37, 0.05), M.body, DRUM.r, DRUM.y, 0, false);                      // a mark that shows the drum turning
    add(still, box(0.2, DRUM.y + 0.6, 0.2), M.steel, POT.x - 1.5, (DRUM.y + 0.6) / 2, 0);       // a frame that holds the top of the shaft
    add(still, box(1.7, 0.12, 0.2), M.steel, POT.x - 0.75, DRUM.y + 0.5, 0);
    add(still, box(1.2, 0.08, 1.2), M.dark, POT.x - 1.5, 0.04, 0);
    // the string, the wheel on its bracket, and the weight
    const cord = mat(0x4b5163);
    add(still, cyl(0.016, 0.016, WHEEL.x - POT.x, 8).rotateZ(Math.PI / 2), cord, (POT.x + WHEEL.x) / 2, DRUM.y, DRUM.r, false);
    add(still, new T.TorusGeometry(WHEEL.r, 0.016, 6, 14, Math.PI / 2), cord, WHEEL.x, DRUM.y - WHEEL.r, DRUM.r, false);
    const wheel = add(still, cyl(WHEEL.r, WHEEL.r, 0.1, 32), mat(0xf1eee8), WHEEL.x, DRUM.y - WHEEL.r, DRUM.r); wheel.rotation.x = Math.PI / 2;
    for (const y of [-0.052, 0.052]) add(wheel, cyl(0.045, 0.045, 0.01, 12), M.body, 0.18, y, 0, false);
    add(still, box(0.3, DRUM.y - WHEEL.r + 0.1, 0.5), M.steel, 9.7, (DRUM.y - WHEEL.r + 0.1) / 2, DRUM.r);
    for (const z of [-0.11, 0.11]) add(still, box(WHEEL.x - 9.6, 0.1, 0.04), M.steel, (WHEEL.x + 9.6) / 2, DRUM.y - WHEEL.r, DRUM.r + z);
    const line = add(still, cyl(0.016, 0.016, 1, 8).translate(0, -0.5, 0), cord, WHEEL.x + WHEEL.r, DRUM.y - WHEEL.r, DRUM.r, false);   // down to the weight
    const sinker = new T.Group(); sinker.position.set(WHEEL.x + WHEEL.r, 0, DRUM.r); still.add(sinker);   // its top is the end of the string
    add(sinker, cyl(0.03, 0.03, 0.3, 8), M.steel, 0, -0.15, 0);
    const discs = Array.from({ length: 6 }, (_, i) => add(sinker, cyl(DISC.r, DISC.r, DISC.tall - 0.02, 36), i % 2 ? M.dark : M.steel, 0, -0.3 - DISC.tall / 2 - i * DISC.tall, 0));
    const sinkHandle = add(sinker, cyl(1.3, 1.3, 1, 16).translate(0, -0.5, 0), M.dark, 0, 0.2, 0, false, false); sinkHandle.visible = false;
    sinkHandle.userData.grip = { kind: 'sinker' };
    add(still, box(2.6, 0.16, 2.6), mat(0x7d9a8c), WHEEL.x + WHEEL.r, MAT - 0.08, DRUM.r);    // a soft mat on the floor
    // a rule standing on the floor: how high the underside of the weight is above the mat
    const POLE = { x: WHEEL.x + WHEEL.r + 1.35, long: 7.2, wide: 0.5 };
    add(still, box(POLE.wide, POLE.long, 0.05), mat(0xf2d675), POLE.x, MAT + POLE.long / 2, DRUM.r - 0.03);
    add(still, box(1, 0.1, 1), M.dark, POLE.x, MAT - 0.1, DRUM.r);
    add(still, new T.PlaneGeometry(POLE.wide, POLE.long), mat(0xffffff, { map: canvasTexture(96, 1382, (g, w, h) => {
      g.fillStyle = '#f2d675'; g.fillRect(0, 0, w, h); g.strokeStyle = g.fillStyle = '#4a3f1c';
      g.font = '700 34px Helvetica, Arial, sans-serif'; g.textAlign = 'right'; g.textBaseline = 'middle';
      for (let c = 0; c <= 72; c++) {
        const y = h - c * h / 72, long = c % 10 === 0 ? 0.42 : c % 5 === 0 ? 0.3 : 0.17;
        g.lineWidth = c % 10 === 0 ? 4 : 2; g.beginPath(); g.moveTo(0, y); g.lineTo(w * long, y); g.stroke();
        if (c % 10 === 0 && c > 0 && c < 72) g.fillText(String(c), w - 6, y);
      }
    }) }), POLE.x, MAT + POLE.long / 2, DRUM.r, false);
    const pointer2 = add(sinker, box(0.6, 0.025, 0.025), M.body, DISC.r + 0.25, 0, 0, false);    // from the underside of the weight to the rule
    const pull = kit.arrow(INK.weight, 0.05), hold = kit.arrow(INK.normal, 0.05), sinkSpeed = kit.arrow(INK.velocity, 0.05); still.add(pull, hold, sinkSpeed);
    const thermoSpot = new T.Vector3(POT.x - 0.33, POT.base + 2.05, 0.27), thermoLabel = view.label(thermoSpot);
    const COLD = new T.Color(0x6fa8dc), TEPID = new T.Color(0xe8a05c);

    // ---------- physics ----------
    // The paddles are hard to turn: the water is driven through the gaps between them and the fixed vanes, and holds
    // them back the more the faster they go, about as the square of the speed. With that hold on the string K v^2,
    // M a = M g − K v^2 for the weight (M). Its speed therefore does grow, but only up to vt = sqrt(M g / K), where the
    // hold is as large as the weight: v = vt tanh(t / tau) with tau = vt / g, and it has sunk vt tau ln cosh(t / tau).
    // With vt about 0.1 m/s, tau is about 0.01 s: it is within 1 % of vt after about 0.03 s and 2 mm, and sinks
    // steadily from there. (v^2 = vt^2 (1 − e^(−2 K y / M)) gives its speed when it has sunk y.)
    // The work it does on the paddles is the mechanical energy it has lost, M g y − M v^2 / 2, and all of it becomes
    // thermal energy of the water, and of the pot if that has a heat capacity (advanced): rise of temperature =
    // Q / (c m + C pot), with c = 4200 J/(kg ℃). Nothing leaks away. When the weight lands, the little kinetic energy
    // it still has is lost in the mat. Wound up again, it sinks again, and the water is warmer by as much once more.
    // fall: y: how far the weight has sunk this time (m); n: how many times it has landed; Q: the thermal energy made
    // in those times (J); total: the seconds it has been sinking, all the times together; pot: the heat capacity of the pot (J/℃).
    const fall = { state: 'ready', t: 0, y: 0, v: 0, M: 20, h: 0.5, mw: 0.2, pot: 0, n: 0, Q: 0, total: 0, grid: -1, fresh: true };
    const HOLD = 19600, HEAT = 4200, START = 20, BEAT = 0.05;   // HOLD: K (N s^2/m^2); HEAT: c of water; START: the water at first (℃); BEAT: the graph is kept this often (s)
    const steady = () => Math.sqrt(fall.M * G / HOLD);                                       // vt
    const speedWhen = (y) => steady() * Math.sqrt(1 - Math.exp(-2 * HOLD * y / fall.M));     // its speed when it has sunk y
    function sunk(t) {   // [how far it has sunk, its speed] t seconds after it was let go
      const vt = steady(), x = t * G / vt, y = vt * vt / G * (x + Math.log1p(Math.exp(-2 * x)) - Math.LN2);   // ln cosh x, written so that a large x does no harm
      return y >= fall.h ? [fall.h, speedWhen(fall.h)] : [y, vt * Math.tanh(x)];
    }
    // the mechanical energy lost this time while it sinks (once it has landed, that is counted in Q)
    const given = (y = fall.y, v = fall.v) => (fall.state === 'done' ? 0 : fall.M * G * y - fall.M * v * v / 2);
    const rise = (now = given()) => (fall.Q + now) / (HEAT * fall.mw + fall.pot);          // how much warmer the water (and the pot) is than at first
    function jouleBars() {
      const chart = ctx.charts.joule, warmer = rise();
      chart.names = fall.pot ? ['감소한 역학적 에너지', '물', '열량계'] : ['감소한 역학적 에너지', '물이 얻은 열에너지'];   // with a pot that takes heat: what the water has gained, and what the pot has
      chart.set(0, fall.pot ? [fall.Q + given(), HEAT * fall.mw * warmer, fall.pot * warmer] : [fall.Q + given(), HEAT * fall.mw * warmer]);
    }
    const joule = {
      run: fall,
      // everything as at first: the weight wound up, the water as it was
      toStart() {
        const v = ctx.values;
        Object.assign(fall, { state: 'ready', t: 0, y: 0, v: 0, M: v.count * DISC.each, h: v.drop, mw: v.water, pot: ctx.advanced ? v.potHeat : 0, n: 0, Q: 0, total: 0, grid: -1, fresh: true });
        jouleBars(); moved = true;
      },
      // wound up once more: the water keeps what it has gained
      again() { Object.assign(fall, { state: 'ready', t: 0, y: 0, v: 0, fresh: true }); moved = true; },
      touch: (state) => (state === 'done' ? { kind: 'go' } : null),   // a touch on the weight when it has landed winds it up and lets it go again
      launch() {
        if (fall.n === 0) { for (const trace of Object.values(ctx.traces)) trace.clear(); ctx.seek(0); }
        fall.state = 'run'; joule.advance(0);
      },
      advance(dt) {
        const before = fall.total - fall.t;   // the seconds of the earlier times
        fall.t += dt; fall.total += dt;
        [fall.y, fall.v] = sunk(fall.t);
        while ((fall.grid + 1) * BEAT <= fall.total + 1e-9) {
          const t = ++fall.grid * BEAT, [y, v] = sunk(Math.max(0, t - before));
          ctx.traces.rise.add(t, rise(given(y, v)), fall.fresh); fall.fresh = false;
        }
        jouleBars(); moved = true;
        if (fall.y >= fall.h - 1e-12) {   // it lands: what it has given the water is added up, and a line is written
          fall.Q += given(); fall.n++; fall.state = 'done'; stopSoon = true;
          const warmer = rise(), cal = (HEAT * fall.mw + fall.pot) * warmer / 4.2;   // the heat in cal: 1 cal warms 1 g of water by 1 ℃, which takes 4.2 J
          ctx.tables.jouleTable.add([String(fall.M), fall.h.toFixed(2), fall.mw.toFixed(1), String(fall.n), one(fall.Q), warmer.toFixed(4), one(HEAT * fall.mw * warmer), one(fall.pot * warmer), one(cal), (fall.Q / cal).toFixed(2)]);
          fall.y = fall.h; fall.v = 0;   // at rest on the mat
          ctx.traces.rise.add(fall.total, rise());   // the graph ends where the water has ended
        }
      },
      handles: [sinkHandle],
      dial: () => 'drop',
      // the weight is raised or lowered, 5 cm at a time
      move(p) {
        const v = ctx.values, beside = [sinker.position.x - 2.3, sinker.position.y - 0.6];
        if (ctx.locked.has('drop')) { say('잠금', ...beside); return; }
        const to = Math.round(Math.max(0.2, Math.min(0.6, grab.value + Math.round((p.up - grab.from.up) / p.rise / 10 / 0.05) * 0.05)) * 100) / 100;
        if (to !== v.drop) ctx.set('drop', to);
        grab.moved = true; say(`높이 ${v.drop.toFixed(2)} m`, ...beside);
      },
      end(held) { if (held.moved && !ctx.locked.has('drop')) ctx.setPlaying(true); },   // let go, it sinks at once
      changed(id) {
        if (!['count', 'drop', 'water', 'potHeat'].includes(id)) return;
        if (fall.state !== 'ready' || fall.n > 0) ctx.emit('action', 'reset'); else joule.toStart();   // what has been added up belongs to the old setting
      },
      draw() {
        const v = ctx.values, n = Math.round(fall.M / DISC.each), high = (fall.h - fall.y) * 10, top = MAT + high + 0.3 + n * DISC.tall;   // high: its underside above the mat (units)
        const turned = (fall.n * fall.h + (fall.state === 'done' ? 0 : fall.y)) * 10, warmer = rise(), warm = Math.min(1, Math.sqrt(warmer / 2));
        sinker.position.y = top; discs.forEach((disc, i) => { disc.visible = i < n; });
        sinkHandle.scale.y = 0.6 + n * DISC.tall + 0.4; pointer2.position.y = -0.3 - n * DISC.tall + 0.012;
        line.scale.y = DRUM.y - WHEEL.r - top; spinner.rotation.y = turned / DRUM.r; wheel.rotation.y = -turned / WHEEL.r;
        pond.scale.y = fall.mw * DEEP; pond.material.color.copy(COLD).lerp(TEPID, warm);
        thermoLabel.show(true); thermoLabel.write(`${(START + warmer).toFixed(3)} ℃`);
        showLens(v.particles, POT.x - (tall() ? 2.2 : 3.2), tall() ? 3.4 : 2.7, 0.8, warm, true, '물의 입자');   // on an upright screen there is less room at the side
        const going = fall.state === 'run', middle = top - 0.3 - n * DISC.tall / 2;
        sinkSpeed.visible = v.velocityArrow && going;
        if (sinkSpeed.visible) { sinkSpeed.position.set(sinker.position.x - DISC.r - 0.4, middle, DRUM.r); sinkSpeed.setLength(Math.max(0.35, 4 * fall.v)); sinkSpeed.aim(DOWN); }
        // the forces on the weight: its weight, and the pull of the string, which is as large once it sinks steadily
        const force = ctx.advanced && v.forceArrow;
        pull.visible = force; hold.visible = force && going;
        if (force) {
          pull.position.set(sinker.position.x - 0.15, middle, DRUM.r + DISC.r + 0.05); pull.setLength(0.01 * fall.M * G); pull.aim(DOWN);
          if (going) { hold.position.set(sinker.position.x + 0.15, middle, DRUM.r + DISC.r + 0.05); hold.setLength(Math.max(0.3, 0.01 * HOLD * fall.v * fall.v)); hold.aim(UP); }
        }
        label.show(v.numbers);
        if (!v.numbers) return;
        if (tall()) spot.set(POT.x + 3.6, -4.4, 2.6); else spot.set(POT.x - 1.2, 0, 2.4);   // on the front of the bench: lower on an upright screen, clear of the menu
        const lost = fall.Q + given(), cal = (HEAT * fall.mw + fall.pot) * warmer / 4.2;
        label.write(`추 ${n}개(${fall.M} kg) · 높이 ${(high / 10).toFixed(2)} m · 속력 ${fall.v.toFixed(2)} m/s<br>낙하 ${fall.n}회${ctx.advanced ? ` · 추의 운동 에너지 ${two(fall.M * fall.v * fall.v / 2)} J` : ''}<br>감소한 역학적 에너지 ${one(lost)} J<br>물이 얻은 열에너지 <b>${one(HEAT * fall.mw * warmer)} J</b>${
          fall.pot ? `<br>열량계가 얻은 열에너지 <b>${one(fall.pot * warmer)} J</b>` : ''}${
          ctx.advanced && cal > 0.05 ? `<br>열의 일당량 = ${one(lost)} J ÷ ${one(cal)} cal = <b>${(lost / cal).toFixed(2)} J/cal</b>` : ''}`);
      },
    };

    // ==================== handling ====================
    // The box is put on the incline where it should start and let go; the incline is raised or lowered by the knob at its upper end.
    const ray = new T.Raycaster(), upright = new T.Plane(new T.Vector3(0, 0, 1), 0), flat = new T.Plane(new T.Vector3(0, 1, 0), -1.5), hit = new T.Vector3();
    // where the pointer is: along the bench (x) and "up" (height, or away from the viewer when seen from above)
    function pointer(r) {
      if (Math.abs(r.direction.z) > 0.25 && r.intersectPlane(upright, hit)) return { x: hit.x, up: hit.y, rise: 1 };
      return r.intersectPlane(flat, hit) ? { x: hit.x, up: -hit.z, rise: 2 } : null;
    }
    const SCENES = { slope, joule }, now = () => SCENES[ctx.values.scene];
    view.setTool({
      pick(r) {
        ray.ray.copy(r); world.updateMatrixWorld(true);
        const found = ray.intersectObjects(now().handles, false)[0];
        if (!found) return null;
        const state = now().run.state;
        if (state === 'ready') return found.object.userData.grip;
        return now().touch ? now().touch(state) : { kind: 'reset' };
      },
      cursor: (grip) => (!grip ? '' : grip.kind === 'reset' || grip.kind === 'go' ? 'pointer' : 'grab'),
      start(grip, r) {
        if (grip.kind === 'reset') { ctx.emit('action', 'reset'); return false; }   // a touch after a run puts the box back first
        if (grip.kind === 'go') { ctx.setPlaying(true); return false; }             // the weight is wound up and let go again
        const p = pointer(r);
        if (!p) return false;
        const id = now().dial(grip);
        grab = { ...grip, id, from: p, value: ctx.values[id], moved: false };
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
      if (now().run.state === 'done') (now().again || now().toStart)();
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
      if (id === 'scene') {   // the other arrangement starts with empty graphs
        for (const trace of Object.values(ctx.traces)) trace.clear();
        ctx.emit('action', 'reset'); slope.toStart(); joule.toStart(); frame();
        return;
      }
      now().changed(id);
    });
    ctx.on('mode', () => {   // the coefficient of friction set by hand and a pot that takes heat belong to the advanced mode
      if (!ctx.advanced && ctx.values.potHeat !== 0) ctx.set('potHeat', 0);
      if (!ctx.advanced && ctx.values.mu !== muOf(ctx.values.surface)) ctx.set('mu', muOf(ctx.values.surface));   // back to the coefficient of the board that is chosen
      if (now().run.state === 'ready') now().toStart();
      if (!ctx.advanced && fall.pot) joule.toStart();
      moved = true;
    });
    // An upright screen looks along the boards, so that all of them are in sight.
    const tall = () => window.matchMedia('(max-aspect-ratio: 4/5)').matches;
    // The weight of Joule's experiment sinks beside the end of the bench, so the view comes round to that end.
    const frame = () => view.look(ctx.values.scene === 'joule' ? (tall() ? { target: [9.4, -2.2, 0], r: 27, theta: 0.8, phi: 1.32 } : { target: [8.3, -2.1, 0], r: 23, theta: 0.4, phi: 1.32 })
      : tall() ? { target: [1.5, 1.2, 0], r: 24, theta: 1.05, phi: 1.2 } : { target: [0, 1.5, 0], r: 18, theta: 0.15, phi: 1.25 });
    function draw() {
      const stir = ctx.values.scene === 'joule';
      rig.visible = !stir; still.visible = stir;
      for (const text of [heightLabel, angleLabel, thermoLabel]) text.show(false);   // each arrangement shows its own writing
      now().draw();
    }

    slope.toStart(); joule.toStart();
    return {
      state: () => ({ ...now().run, energies: energies() }),
      update(dt) {
        if (!framed) { framed = true; if (tall()) frame(); }
        if (stopSoon) { stopSoon = false; ctx.setPlaying(false); }
        if (tipTime > 0) { tipTime -= dt; if (tipTime <= 0) { tip.show(false); moved = true; } }
        if (ctx.values.particles) { clock += dt; moved = true; }   // the particles never rest
        if (!moved) return false;
        moved = false; draw();
        return true;
      },
    };
  },
};
