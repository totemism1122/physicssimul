// P-02 Force and acceleration (3D): a cart on a low-friction track, in two arrangements chosen in the menu.
//
// Force and acceleration: the cart is pulled along by a spring balance that keeps the same reading, after the
// textbook's figure of a body pulled with forces F, 2F, 3F and of bodies m, 2m, 3m. The force is set by pulling
// the balance out (the cart sets off when it is let go) and the mass by the pile of weights on the cart.
//
// Braking distance: the cart is pulled back and let go, runs on at a steady speed and, from the braking line on,
// is slowed by a steady braking force until it stops (the textbook's car that brakes: v0^2 = −2 a s).
//
// Cart and weight: a string from the cart runs over a pulley at the end of the bench to hanging weights, which fall
// and pull the cart along. Cart (M) and weights (m) speed up together: a = m g / (M + m), and the string pulls the
// cart with M a, which is less than the weight m g of what hangs.
//
// What is set by hand can be set from the menu as well, over the same ranges and in the same steps.
// Lengths are life-size: one unit of the scene is 10 cm, and the rule beside the track reads in cm.
// The motion is worked out from the textbook's formulas: a = F / m, v = v0 + a t, s = v0 t + a t^2 / 2.
const GOLD = '#e3c26b', DIM = 'rgba(227, 194, 107, 0.6)', FAINT = 'rgba(227, 194, 107, 0.34)';
const minus = (text) => text.replace('-', '−');
// The graphs show the present run and the two before it, one over the other. "axis" is an empty record as long as
// the longest of them, which sets the time axis for all three.
const RUNS = [[0, GOLD, '이번'], [1, DIM, '앞'], [2, FAINT, '그 앞']];
const lines = (kind) => [{ trace: 'axis', color: 'rgba(0, 0, 0, 0)' }, ...RUNS.map(([i, color, name]) => ({ trace: kind + i, color, name }))];
const reading = (digits, unit) => (value) => (value === undefined ? '–' : `${minus(value.toFixed(digits))} ${unit}`);
const KINDS = { v: { window: 6, range: 1, read: reading(2, 'm/s') }, x: { window: 6, range: 0.5, read: reading(2, 'm') }, a: { window: 6, range: 1, read: reading(2, 'm/s²') } };
const pulled = (values) => values.scene === 'pull', braked = (values) => values.scene === 'brake', hung = (values) => values.scene === 'hang';   // which arrangement an item of a menu belongs to
const bars = (name, digits) => ({ names: [name], colors: [GOLD], groups: [''], signed: false, range: 0.5, read: (value) => value.toFixed(digits) });

export default {
  // what is taken for granted, written on screen by the frame
  premise: (v, advanced) => (v.scene === 'hang' ? '마찰과 공기 저항은 없고, 줄과 도르래의 질량은 무시합니다' : v.scene === 'brake' ? '제동력 말고는 마찰과 공기 저항이 없다고 봅니다'
    : advanced && v.drag > 0 ? '수레와 트랙 사이의 마찰은 없다고 봅니다' : '마찰과 공기 저항은 없다고 봅니다'),
  fixedViews: ['front', 'top'],
  camera: { target: [1.2, 0.9, 0], r: 16.5, theta: 0.2, phi: 1.1, rMax: 34 },
  stepTime: 0.02,                 // "one step at a time" moves on by this many seconds
  traces: {
    axis: { window: 6, range: 0.001, read: () => '' },
    ...Object.fromEntries(Object.entries(KINDS).flatMap(([kind, options]) => RUNS.map(([i]) => [kind + i, options]))),
  },
  charts: {
    // what has been found so far, set out against one quantity for the present values of the others
    byForce: bars('가속도', 2), byMass: bars('가속도', 2), stopBySpeed: bars('제동 거리', 2), stopByMass: bars('제동 거리', 2),
    byHang: bars('가속도', 2), byCart: bars('가속도', 2),
  },
  menus: {
    vars: [
      { id: 'scene', label: '장면 선택', kind: 'choice', value: 'pull', options: [{ id: 'pull', label: '힘과 가속도' }, { id: 'brake', label: '제동 거리' }, { id: 'hang', label: '수레와 추' }] },
      { id: 'force', label: '끄는 힘', kind: 'slider', min: 0.5, max: 6, step: 0.5, value: 1, digits: 1, unit: ' N', when: pulled },
      { id: 'speed', label: '처음 속도', kind: 'slider', min: 0.5, max: 1.5, step: 0.1, value: 1, digits: 1, unit: ' m/s', when: braked },
      { id: 'hang', label: '추의 질량', kind: 'slider', min: 0.1, max: 0.5, step: 0.1, value: 0.1, digits: 1, unit: ' kg', when: hung },
      { id: 'mass', label: '수레의 질량', kind: 'slider', min: 1, max: 3, step: 0.5, value: 1, digits: 1, unit: ' kg' },
      { id: 'brake', label: '제동력', kind: 'slider', min: 3, max: 9, step: 1, value: 3, unit: ' N', when: braked },
      { id: 'drag', label: '저항 계수', kind: 'slider', min: 0, max: 3, step: 0.5, value: 0, digits: 1, unit: ' N·s/m', when: pulled, advanced: true },
    ],
    graph: [
      { id: 'velocity', label: '속도–시간', kind: 'graph', x: '시간', plots: [{ y: '속도', lines: lines('v') }] },
      { id: 'position', label: '위치–시간', kind: 'graph', x: '시간', plots: [{ y: '위치', lines: lines('x') }] },
      { id: 'rate', label: '가속도–시간', kind: 'graph', x: '시간', plots: [{ y: '가속도', lines: lines('a') }] },
      { id: 'byForce', label: '가속도–알짜힘', kind: 'graph', bars: 'byForce', when: pulled },
      { id: 'byMass', label: '가속도–질량', kind: 'graph', bars: 'byMass', when: pulled },
      { id: 'stopBySpeed', label: '제동 거리–처음 속도', kind: 'graph', bars: 'stopBySpeed', when: braked },
      { id: 'stopByMass', label: '제동 거리–질량', kind: 'graph', bars: 'stopByMass', when: braked },
      { id: 'byHang', label: '가속도–추의 질량', kind: 'graph', bars: 'byHang', when: hung },
      { id: 'byCart', label: '가속도–수레의 질량', kind: 'graph', bars: 'byCart', when: hung },
    ],
    time: [
      { id: 'slow', label: '느리게', kind: 'toggle' },
      { id: 'reset', label: '처음으로', kind: 'action' },
      { id: 'step', label: '한 단계씩', kind: 'action', advanced: true },
    ],
    layers: [
      { id: 'forceArrow', label: '힘 화살표', kind: 'toggle' },
      { id: 'velocityArrow', label: '속도 화살표', kind: 'toggle' },
      { id: 'strobe', label: '같은 시간 간격의 위치', kind: 'toggle' },
      { id: 'numbers', label: '값', kind: 'toggle' },
      { id: 'rateArrow', label: '가속도 화살표', kind: 'toggle', advanced: true },
    ],
    inquiry: [
      { id: 'table', label: '기록 표', kind: 'table', wide: true, when: pulled, text: '수레가 끝 선에 닿을 때마다 한 줄씩 적힙니다.',
        columns: [{ label: '알짜힘', unit: 'N' }, { label: '질량', unit: 'kg' }, { label: '가속도', unit: 'm/s²', result: true }, { label: '걸린 시간', unit: 's', result: true },
          { label: '저항 계수', unit: 'N·s/m', advanced: true }] },
      { id: 'stops', label: '기록 표', kind: 'table', wide: true, when: braked, text: '수레가 멈출 때마다 한 줄씩 적힙니다. 제동 거리는 제동 선에서 멈춘 곳까지입니다.',
        columns: [{ label: '처음 속도', unit: 'm/s' }, { label: '질량', unit: 'kg' }, { label: '제동력', unit: 'N' }, { label: '가속도', unit: 'm/s²', result: true }, { label: '제동 거리', unit: 'm', result: true }] },
      { id: 'falls', label: '기록 표', kind: 'table', wide: true, when: hung, text: '수레가 끝 선에 닿을 때마다 한 줄씩 적힙니다.',
        columns: [{ label: '추의 질량', unit: 'kg' }, { label: '추의 무게', unit: 'N' }, { label: '수레의 질량', unit: 'kg' }, { label: '줄이 당기는 힘', unit: 'N', result: true }, { label: '가속도', unit: 'm/s²', result: true }] },
    ],
  },

  // writing on the chalkboard (1024 x 400)
  board(g) {
    g.fillStyle = 'rgba(255,255,255,0.9)'; g.font = '56px Georgia, serif'; g.fillText('힘과 가속도', 60, 96);
    g.font = 'italic 60px Georgia, serif'; g.fillText('a = F / m', 60, 200); g.fillText('v = v', 60, 310); g.fillText('+ at', 250, 310);
    g.font = 'italic 34px Georgia, serif'; g.fillText('0', 206, 326);
    g.strokeStyle = 'rgba(255,255,255,0.8)'; g.lineWidth = 5;
    g.beginPath(); g.moveTo(600, 330); g.lineTo(600, 90); g.moveTo(600, 330); g.lineTo(960, 330); g.stroke();   // a speed-time graph: three slopes
    g.lineWidth = 4; for (const y of [250, 180, 110]) { g.beginPath(); g.moveTo(600, 330); g.lineTo(930, y); g.stroke(); }
  },

  // Builds the apparatus on the bench (world) and returns { update(dt) }.
  create({ T, kit, world, view, ctx }) {
    const { mat, add, box, cyl, canvasTexture, roundedBox } = kit;
    world.userData.things.visible = false;   // the track and its rule take the whole bench
    const M = {
      rail: mat(0xc9cedb, { roughness: 0.6 }), runner: mat(0xe4e7ee, { roughness: 0.5 }), steel: mat(0x8f96a8), dark: mat(0x3a4057), body: mat(0xd9584a),
      deck: mat(0xf1eee8), wheel: mat(0x2f3446), brass: mat(0xc9a35a, { roughness: 0.7 }), brassDark: mat(0xad8843, { roughness: 0.7 }), casing: mat(0xf1eee8), red: mat(0xc8392f),
    };
    const INK = { force: 0x9a3fc2, velocity: 0x1f9d6b, rate: 0xd98a1c, drag: 0x6b7280 };   // colours of the marks
    const RIGHT = new T.Vector3(1, 0, 0), LEFT = new T.Vector3(-1, 0, 0), UP = new T.Vector3(0, 1, 0), DOWN = new T.Vector3(0, -1, 0);
    const scene = () => ctx.values.scene, pulling = () => scene() === 'pull';
    const G = 9.8, DROP = 0.7, NEAR = -1.7;   // with the string and pulley: how far the cart runs and the weights fall (m), and where the cart starts, nearer the pulley

    // ---------- the track, and a rule in cm on the bench beside it ----------
    // Pulled along, the cart starts at X0 (0 cm) and runs COURSE metres to the finishing line. Braking, it waits at REST,
    // is pulled back from there, and brakes from LINE on, which is then the 0 of the rule.
    const RAIL = { half: 8.2, top: 0.46 }, X0 = -7.2, COURSE = 1.2, REST = X0 + 2.5, LINE = X0 + 3.3, BACK = 2.3;   // BACK: units pulled back for each 1 m/s above 0.4 m/s
    const rail = new T.Group(); world.add(rail);
    add(rail, box(RAIL.half * 2, 0.16, 0.9), M.rail, 0, 0.33, 0);
    add(rail, box(RAIL.half * 2, 0.012, 0.22), M.steel, 0, 0.416, 0, false);
    for (const z of [-0.3, 0.3]) add(rail, box(RAIL.half * 2, 0.05, 0.14), M.runner, 0, 0.435, z);
    for (const x of [-6.2, 6.2]) add(rail, box(0.5, 0.25, 0.9), M.steel, x, 0.125, 0);
    const RULE = { from: X0 - 0.3, to: X0 + 14.6, z: 0.88, wide: 0.5 };
    add(world, box(RULE.to - RULE.from, 0.03, RULE.wide), mat(0xf2d675), (RULE.from + RULE.to) / 2, 0.015, RULE.z);
    // zero: where on the bench the rule reads 0;  red: the cm at which a red line is drawn
    const ruleFace = (zero, red) => add(world, new T.PlaneGeometry(RULE.to - RULE.from, RULE.wide), mat(0xffffff, { map: canvasTexture(4096, 140, (g, w, h) => {
      g.fillStyle = '#f2d675'; g.fillRect(0, 0, w, h); g.strokeStyle = g.fillStyle = '#4a3f1c';
      g.font = '700 52px Helvetica, Arial, sans-serif'; g.textAlign = 'center';
      const px = w / (RULE.to - RULE.from) / 10, at = (c) => (zero - RULE.from) * 10 * px + c * px;   // px: pixels to a cm
      for (let c = Math.ceil((RULE.from - zero) * 10) + 1; at(c) < w - 4; c++) {
        const long = c % 10 === 0 ? 0.42 : c % 5 === 0 ? 0.3 : 0.17;
        g.lineWidth = c % 10 === 0 ? 5 : 2.5; g.beginPath(); g.moveTo(at(c), 0); g.lineTo(at(c), h * long); g.stroke();
        if (c % 10 === 0 && c >= 0) g.fillText(String(c), at(c), h - 22);
      }
      g.strokeStyle = '#c8392f'; g.lineWidth = 9; g.beginPath(); g.moveTo(at(red), 0); g.lineTo(at(red), h * 0.62); g.stroke();
    }) }), (RULE.from + RULE.to) / 2, 0.032, RULE.z, false);
    const rules = { pull: ruleFace(X0, COURSE * 100), brake: ruleFace(LINE, 0), hang: ruleFace(NEAR, DROP * 100) };
    for (const face of Object.values(rules)) face.rotation.x = -Math.PI / 2;
    const brakeLine = add(world, box(0.07, 0.012, 1.5), M.red, LINE, 0.47, 0.2, false);   // across the track: braking starts here

    // ---------- the cart: 1 kg, with a pile of weights of 0.5 kg and a pointer over the rule ----------
    const CART = { half: 0.8, wide: 0.4, deck: 1.0, most: 4, slab: 0.16 };
    const cart = new T.Group(); world.add(cart);
    const bodyGeo = roundedBox(CART.half * 2 - 0.08, 0.36, CART.wide * 2 - 0.08, 0.08);
    const bodyMesh = add(cart, bodyGeo, M.body, 0, 0.78, 0);
    add(cart, box(CART.half * 2 - 0.3, 0.03, CART.wide * 2 - 0.22), M.deck, 0, CART.deck - 0.005, 0, false);
    for (const x of [-0.5, 0.5]) for (const z of [-1, 1]) {
      add(cart, cyl(0.15, 0.15, 0.1, 22), M.wheel, x, RAIL.top + 0.15, z * 0.3).rotation.x = Math.PI / 2;
      add(cart, cyl(0.06, 0.06, 0.03, 14), M.rail, x, RAIL.top + 0.15, z * 0.36, false).rotation.x = Math.PI / 2;
    }
    add(cart, cyl(0.025, 0.025, 0.9, 10), M.steel, 0, CART.deck + 0.45, 0);
    const weights = Array.from({ length: CART.most }, (_, i) => add(cart, cyl(0.32, 0.32, CART.slab - 0.012, 28), i % 2 ? M.brassDark : M.brass, 0, CART.deck + CART.slab / 2 + i * CART.slab, 0));
    add(cart, box(0.03, 0.72, 0.03), M.dark, 0, 0.4, CART.wide + 0.2, false);                     // the pointer: it stands over the rule
    add(cart, box(0.03, 0.03, 0.2), M.dark, 0, 0.75, CART.wide + 0.1, false);
    const sail = add(cart, box(0.05, 1, 1.1), mat(0xf4f1ea), -0.55, CART.deck + 0.5, 0); sail.visible = false;   // catches the air when there is resistance
    const pileHandle = add(cart, cyl(0.4, 0.4, 1, 14), M.dark, 0, CART.deck + 0.5, 0, false, false); pileHandle.visible = false;
    pileHandle.userData.grip = { kind: 'pile' }; bodyMesh.userData.grip = { kind: 'cart' };
    // the brake: a lever at the back of the cart, higher for a larger braking force, and a lamp that lights while it brakes
    const brakeParts = new T.Group(); cart.add(brakeParts);
    const lever = add(brakeParts, cyl(0.03, 0.03, 1, 10).translate(0, 0.5, 0), M.steel, -0.66, CART.deck, 0);
    const knob = add(brakeParts, new T.SphereGeometry(0.11, 16, 12), M.red, -0.66, CART.deck, 0);
    const knobHandle = add(brakeParts, box(0.44, 1.6, 0.7), M.dark, -0.8, CART.deck + 0.65, 0, false, false); knobHandle.visible = false;
    knobHandle.userData.grip = { kind: 'knob' };
    const lampOff = mat(0x6e2a25), lampOn = new T.MeshBasicMaterial({ color: 0xff3b2f });
    const lamp = add(brakeParts, box(0.04, 0.14, 0.5), lampOff, -CART.half + 0.01, 0.8, 0, false);

    // ---------- the spring balance: hooked to the front of the cart, pulled by the ring at its far end ----------
    // Pulled out, its rod shows more and the marker on it stands at the force on the scale (0 to 6 N).
    const STRETCH = 0.2, SCALE = { rod: 0.4, body: 1.95, zero: 1.5 };   // STRETCH: units of length to a newton
    const balance = new T.Group(); balance.position.set(CART.half, 0.78, 0); cart.add(balance);
    const rod = add(balance, cyl(0.022, 0.022, 1, 10).rotateZ(Math.PI / 2).translate(0.5, 0, 0), M.steel, 0, 0, 0);
    const casing = new T.Group(); balance.add(casing);
    add(casing, roundedBox(SCALE.body, 0.3, 0.26, 0.05), M.casing, SCALE.body / 2, 0, 0);
    const face = canvasTexture(768, 128, (g, w, h) => {
      g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h); g.strokeStyle = g.fillStyle = '#3a4057';
      g.font = '700 44px Helvetica, Arial, sans-serif'; g.textAlign = 'center';
      for (let n = 0; n <= 12; n++) {   // every 0.5 N
        const x = (SCALE.zero - n / 2 * STRETCH - 0.12) / (SCALE.body - 0.24) * w;   // the plate starts 0.12 in from the end of the casing
        g.lineWidth = n % 2 ? 3 : 6; g.beginPath(); g.moveTo(x, 0); g.lineTo(x, n % 2 ? 34 : 52); g.stroke();
        if (n % 2 === 0) g.fillText(String(n / 2), x, h - 22);
      }
    });
    for (const [y, z, turn] of [[0, 0.158, 0], [0.178, 0, -Math.PI / 2]]) {   // the scale shows on the front and on the top
      const plate = add(casing, new T.PlaneGeometry(SCALE.body - 0.24, 0.2), mat(0xffffff, { map: face }), SCALE.body / 2, y, z, false); plate.rotation.x = turn;
    }
    const marker = add(casing, box(0.035, 0.37, 0.33), M.red, 0, 0, 0, false);
    add(casing, new T.TorusGeometry(0.15, 0.03, 10, 28), M.steel, SCALE.body + 0.17, 0, 0);
    const ringHandle = add(casing, box(1.0, 0.9, 0.9), M.dark, SCALE.body + 0.1, 0, 0, false, false); ringHandle.visible = false;
    ringHandle.userData.grip = { kind: 'ring' };

    // ---------- the pulley at the end of the bench, the string over it, and the hanging weights of 0.1 kg ----------
    const PULLEY = { x: 10.35, y: 0.48, r: 0.3 }, HANG = { top: -0.1, slab: 0.18, most: 5 };   // top: where the hanger starts, just under the pulley
    const hangParts = new T.Group(); world.add(hangParts);
    add(hangParts, box(0.5, 0.6, 0.6), M.steel, 9.75, 0.3, 0);                                    // the clamp on the edge of the bench
    for (const z of [-0.11, 0.11]) add(hangParts, box(0.75, 0.1, 0.04), M.steel, 10.0, PULLEY.y, z);
    const wheel = add(hangParts, cyl(PULLEY.r, PULLEY.r, 0.1, 32), M.casing, PULLEY.x, PULLEY.y, 0); wheel.rotation.x = Math.PI / 2;
    for (const y of [-0.052, 0.052]) add(wheel, cyl(0.045, 0.045, 0.01, 12), M.red, 0.18, y, 0, false);   // a mark that shows the wheel turning
    const cord = mat(0x4b5163);
    const strand = add(hangParts, cyl(0.014, 0.014, 1, 8).rotateZ(Math.PI / 2).translate(0.5, 0, 0), cord, 0, PULLEY.y + PULLEY.r, 0, false);   // from the cart to the top of the wheel
    add(hangParts, new T.TorusGeometry(PULLEY.r, 0.014, 6, 14, Math.PI / 2), cord, PULLEY.x, PULLEY.y, 0, false);                                 // over the wheel
    const drop = add(hangParts, cyl(0.014, 0.014, 1, 8).translate(0, -0.5, 0), cord, PULLEY.x + PULLEY.r, PULLEY.y, 0, false);                     // down to the hanger
    const hanger = new T.Group(); hanger.position.x = PULLEY.x + PULLEY.r; hangParts.add(hanger);
    const stem = add(hanger, cyl(0.022, 0.022, 1, 8).translate(0, -0.5, 0), M.steel, 0, 0, 0);
    const slabs = Array.from({ length: HANG.most }, (_, i) => add(hanger, cyl(0.26, 0.26, HANG.slab - 0.015, 26), i % 2 ? M.brassDark : M.brass, 0, -0.3 - HANG.slab / 2 - i * HANG.slab, 0));
    const plate = add(hanger, cyl(0.29, 0.29, 0.035, 26), M.steel, 0, 0, 0);
    const hangHandle = add(hanger, cyl(0.6, 0.6, 1.7, 14), M.dark, 0, -0.75, 0, false, false); hangHandle.visible = false;
    hangHandle.userData.grip = { kind: 'hang' };
    add(hangParts, box(1.5, 0.16, 1.5), mat(0x7d9a8c), PULLEY.x + PULLEY.r, -8.42, 0);          // a soft mat on the floor under the weights
    const weightArrow = kit.arrow(0x9a3fc2, 0.045), liftArrow = kit.arrow(0x9a3fc2, 0.045); world.add(weightArrow, liftArrow);
    const hangSpot = new T.Vector3(), hangLabel = view.label(hangSpot, true);

    // ---------- marks: arrows, the places at equal intervals of time, readings ----------
    const forceArrow = kit.arrow(INK.force, 0.045), dragArrow = kit.arrow(INK.drag, 0.04), speedArrow = kit.arrow(INK.velocity, 0.045), rateArrow = kit.arrow(INK.rate, 0.045);
    world.add(forceArrow, dragArrow, speedArrow, rateArrow);
    const NEWTON = 0.28, PER_SPEED = 0.5, PER_RATE = 0.28;   // lengths of the arrows for 1 N, 1 m/s, 1 m/s^2
    const GHOSTS = 24;
    const ghosts = new T.InstancedMesh(bodyGeo, new T.MeshBasicMaterial({ color: 0xd9584a, transparent: true, opacity: 0.2, depthWrite: false }), GHOSTS);
    ghosts.count = 0; ghosts.frustumCulled = false; world.add(ghosts);
    const spot = new T.Vector3(), label = view.label(spot, true, 0.2), tipSpot = new T.Vector3(), tip = view.label(tipSpot);

    // ---------- physics ----------
    // run: one run. pull: whether it is the cart pulled along; x: the cart on the bench; s: its place in metres from the
    // 0 of the rule; flash: the interval at which its place is kept (s).
    // Pulled along by a steady F: a = F / m, v = a t, s = a t^2 / 2. With a resistance k v (advanced) the net force is
    // F − k v, so the speed tends to F / k: v = (F / k)(1 − e^(−k t / m)).
    // Braking: v0 until the line (lead metres on), then a = −F / m, v = v0 + a t, s = v0 t + a t^2 / 2, at rest after v0 / |a|.
    // Cart and weight: both have the same a. For the weights m g − T = m a, for the cart T = M a, so a = m g / (M + m)
    // (kept as a0; h is the hanging mass and F the pull of the string, T).
    const run = { state: 'ready', pull: true, kind: 'pull', h: 0, a0: 0, t: 0, s: 0, v: 0, a: 0, F: 0, m: 0, k: 0, v0: 0, lead: 0, end: 0, sampled: -1, flashed: -1, flash: 0.2 };
    const STEP = 0.02;   // the graphs are sampled on this grid of time, the same for every run, so that runs can be compared
    function motion(t) {
      const { F, m, k, v0, lead } = run;
      if (run.kind === 'hang') return [run.a0 * t * t / 2, run.a0 * t, run.a0];
      if (!run.pull) {
        const coast = lead / v0;
        if (t <= coast) return [v0 * t - lead, v0, 0];
        const a = -F / m, tau = Math.min(t - coast, -v0 / a);
        return [v0 * tau + a * tau * tau / 2, v0 + a * tau, a];
      }
      if (!k) { const a = F / m; return [a * t * t / 2, a * t, a]; }
      const top = F / k, e = Math.exp(-k * t / m);
      return [top * (t - m / k * (1 - e)), top * (1 - e), F / m * e];
    }
    function endTime() {   // when the cart reaches the finishing line, or stands still
      if (run.kind === 'hang') return Math.sqrt(2 * DROP / run.a0);
      if (!run.pull) return run.lead / run.v0 + run.v0 * run.m / run.F;
      if (!run.k) return Math.sqrt(2 * COURSE * run.m / run.F);
      let low = 0, high = 120;
      for (let i = 0; i < 60; i++) { const mid = (low + high) / 2; if (motion(mid)[0] < COURSE) low = mid; else high = mid; }
      return high;
    }
    // "force/mass" -> acceleration (runs without resistance); "speed/mass/force" -> braking distance; "hanging mass/mass of the cart" -> acceleration
    const found = { pull: new Map(), brake: new Map(), hang: new Map() };
    const kinds = Object.keys(KINDS);
    function shiftRuns() {   // the present run becomes the one before, and so on
      const tr = ctx.traces;
      if (!tr.v0.t.length) return;
      for (const kind of kinds) for (const i of [2, 1]) { const from = tr[kind + (i - 1)], to = tr[kind + i]; to.t = from.t.slice(); to.v = from.v.slice(); to.gap = from.gap.slice(); to.stamp++; }
      for (const kind of kinds) tr[kind + 0].clear();
      tr.axis.clear();
      for (let i = 0, n = Math.max(tr.v1.t.length, tr.v2.t.length); i < n; i++) tr.axis.add(i * STEP, 0);
    }
    function clearRuns() { for (const trace of Object.values(ctx.traces)) trace.clear(); ghosts.count = 0; }
    // A bar for each value tried, set out along the axis in even steps (values not tried leave a gap), so that the
    // tops of the bars show how the result goes with that quantity.
    function chart(id, title, records, first, step, pick) {
      const one = ctx.charts[id], tried = new Map([...records].map(([key, value]) => [pick(key.split('/').map(Number)), value]).filter(([x]) => x !== null));
      const steps = [], last = Math.max(first, ...tried.keys());
      for (let i = 0; first + i * step <= last + 1e-9; i++) steps.push(Math.round((first + i * step) * 10) / 10);
      one.title = title; one.groups = steps.map((x) => (tried.has(x) ? String(x) : '')); one.values = steps.map((x) => (tried.has(x) ? [tried.get(x)] : null)); one.stamp++;
    }
    function charts() {
      const v = ctx.values, m = v.mass.toFixed(1);
      chart('byForce', `질량 ${m} kg · 가로 알짜힘(N)`, found.pull, 0.5, 0.5, ([F, mass]) => (mass === v.mass ? F : null));
      chart('byMass', `알짜힘 ${v.force.toFixed(1)} N · 가로 질량(kg)`, found.pull, 1, 0.5, ([F, mass]) => (F === v.force ? mass : null));
      chart('stopBySpeed', `${m} kg · ${v.brake} N · 가로 처음 속도(m/s)`, found.brake, 0.5, 0.1, ([v0, mass, F]) => (mass === v.mass && F === v.brake ? v0 : null));
      chart('stopByMass', `${v.speed.toFixed(1)} m/s · ${v.brake} N · 가로 질량(kg)`, found.brake, 1, 0.5, ([v0, mass, F]) => (v0 === v.speed && F === v.brake ? mass : null));
      chart('byHang', `수레 ${m} kg · 가로 추의 질량(kg)`, found.hang, 0.1, 0.1, ([h, mass]) => (mass === v.mass ? h : null));
      chart('byCart', `추 ${v.hang.toFixed(1)} kg · 가로 수레의 질량(kg)`, found.hang, 1, 0.5, ([h, mass]) => (h === v.hang ? mass : null));
    }

    // ---------- state ----------
    let moved = true, stopSoon = false, tipTime = 0, framed = false;
    const count = () => Math.round((ctx.values.mass - 1) / 0.5);
    const waiting = () => (scene() === 'brake' ? REST - (ctx.values.speed - 0.4) * BACK : scene() === 'hang' ? NEAR : X0);   // where the cart stands before a run
    // at: where the writing goes (by the cart, unless another place is given)
    function say(text, seconds = 0, at = [run.x + 0.4, CART.deck + count() * CART.slab + 1.3]) { tip.write(text); tipSpot.set(at[0], at[1], 0); tip.show(true); tipTime = seconds; moved = true; }
    function toStart() { Object.assign(run, { state: 'ready', pull: pulling(), kind: scene(), t: 0, s: 0, v: 0, a: 0, x: waiting() }); moved = true; }
    function launch() {
      const v = ctx.values, pull = pulling();
      Object.assign(run, { state: 'run', pull, kind: scene(), t: 0, v: 0, m: v.mass, sampled: -1, flashed: -1, flash: pull ? 0.2 : 0.1 });
      if (pull) Object.assign(run, { F: v.force, k: ctx.advanced ? v.drag : 0, zero: X0 });
      else if (run.kind === 'hang') { const a0 = v.hang * G / (v.mass + v.hang); Object.assign(run, { h: v.hang, a0, F: v.mass * a0, k: 0, zero: NEAR }); }
      else Object.assign(run, { F: v.brake, k: 0, v0: v.speed, lead: (LINE - waiting()) / 10, zero: LINE });
      run.end = endTime();
      shiftRuns(); ghosts.count = 0; ctx.seek(0); advance(0);
    }
    const place = new T.Matrix4();
    function advance(dt) {
      const tr = ctx.traces;
      run.t = Math.min(run.end, run.t + dt);
      [run.s, run.v, run.a] = motion(run.t); run.x = run.zero + run.s * 10;
      while ((run.sampled + 1) * STEP <= run.t + 1e-9) {
        const at = ++run.sampled * STEP, [s, v, a] = motion(at);
        tr.v0.add(at, v); tr.x0.add(at, s); tr.a0.add(at, a);
        if (tr.axis.t.length <= run.sampled) tr.axis.add(at, 0);
      }
      while ((run.flashed + 1) * run.flash <= run.t + 1e-9 && ghosts.count < GHOSTS) {
        const s = motion(++run.flashed * run.flash)[0];
        ghosts.setMatrixAt(ghosts.count++, place.makeTranslation(run.zero + s * 10, 0.78, 0)); ghosts.instanceMatrix.needsUpdate = true;
      }
      moved = true;
      if (run.t >= run.end) finish();
    }
    function finish() {   // at the finishing line, or at rest: one line in the table, and a bar in each chart
      run.state = 'done'; stopSoon = true;
      if (run.pull) {
        const first = run.F / run.m, steady = !run.k;
        ctx.tables.table.add([steady ? run.F.toFixed(1) : `${run.F.toFixed(1)} → ${(run.a * run.m).toFixed(1)}`, run.m.toFixed(1),
          steady ? first.toFixed(2) : `${first.toFixed(2)} → ${run.a.toFixed(2)}`, run.end.toFixed(2), run.k.toFixed(1)]);
        if (steady) found.pull.set(`${run.F}/${run.m}`, first);
      } else if (run.kind === 'hang') {
        ctx.tables.falls.add([run.h.toFixed(1), (run.h * G).toFixed(2), run.m.toFixed(1), run.F.toFixed(2), run.a0.toFixed(2)]);
        found.hang.set(`${run.h}/${run.m}`, run.a0);
      } else {
        run.v = 0;
        ctx.tables.stops.add([run.v0.toFixed(1), run.m.toFixed(1), String(run.F), minus((-run.F / run.m).toFixed(2)), run.s.toFixed(3)]);
        found.brake.set(`${run.v0}/${run.m}/${run.F}`, run.s);
      }
      charts();
    }

    // ---------- handling ----------
    // Pulled along: the ring of the balance is pulled out. Braking: the cart is pulled back, and the lever of the brake
    // is raised or lowered. In both, the pile of weights grows and shrinks.
    const ray = new T.Raycaster(), upright = new T.Plane(new T.Vector3(0, 0, 1), 0), level = new T.Plane(new T.Vector3(0, 1, 0), -0.8), hit = new T.Vector3();
    // where the pointer is: along the track (x) and "up" (height, or away from the viewer when seen from above)
    function pointer(r) {
      if (Math.abs(r.direction.z) > 0.25 && r.intersectPlane(upright, hit)) return { x: hit.x, up: hit.y, rise: 1 };
      return r.intersectPlane(level, hit) ? { x: hit.x, up: -hit.z, rise: 2 } : null;
    }
    // what each handle sets: [value, least, most, step, units of the pointer's travel for one step, how it is written]
    const DIALS = {
      ring: ['force', 0.5, 6, 0.5, STRETCH / 2, (v) => `${v.toFixed(1)} N`], pile: ['mass', 1, 3, 0.5, CART.slab, (v) => `${v.toFixed(1)} kg`],
      cart: ['speed', 0.5, 1.5, 0.1, BACK / 10, (v) => `${v.toFixed(1)} m/s`], knob: ['brake', 3, 9, 1, 0.15, (v) => `제동력 ${v} N`],
      hang: ['hang', 0.1, 0.5, 0.1, HANG.slab, (v) => `추 ${v.toFixed(1)} kg`],
    };
    let grab = null;
    view.setTool({
      pick(r) {
        ray.ray.copy(r); cart.updateMatrixWorld(true); hangParts.updateMatrixWorld(true);
        const hits = ray.intersectObjects([{ pull: ringHandle, brake: knobHandle, hang: hangHandle }[scene()], pileHandle, bodyMesh], false)[0];
        if (!hits) return null;
        const grip = hits.object.userData.grip;
        if (run.state !== 'ready') return { kind: 'reset' };
        // the cart itself: pulled back to set its speed (braking), pressed to let it go (cart and weight), not handled when pulled along
        return grip.kind !== 'cart' || scene() === 'brake' ? grip : scene() === 'hang' ? { kind: 'go' } : null;
      },
      cursor: (grip) => (!grip ? '' : grip.kind === 'reset' || grip.kind === 'go' ? 'pointer' : 'grab'),
      start(grip, r) {
        if (grip.kind === 'reset') { ctx.emit('action', 'reset'); return false; }   // a touch after a run puts the cart back first
        if (grip.kind === 'go') { ctx.setPlaying(true); return false; }             // the cart is let go
        const p = pointer(r);
        if (!p) return false;
        grab = { ...grip, from: p, value: ctx.values[DIALS[grip.kind][0]], moved: false };
        return true;
      },
      move(r) {
        const p = pointer(r);
        if (!p) return;
        const [id, least, most, step, travel, write] = DIALS[grab.kind], now = ctx.values[id];
        const beside = grab.kind === 'hang' ? [hanger.position.x + 1.5, hanger.position.y - 0.3] : undefined;   // the hanging weights have their writing beside them
        if (ctx.locked.has(id)) { say(`${write(now)} · 잠금`, 0, beside); return; }
        // the ring is pulled forwards, the cart back; the pile and the lever go up and down; the hanging pile grows downwards
        const rise = (p.up - grab.from.up) / p.rise;
        const gone = grab.kind === 'ring' ? p.x - grab.from.x : grab.kind === 'cart' ? grab.from.x - p.x : grab.kind === 'hang' ? -rise : rise;
        const to = Math.max(least, Math.min(most, Math.round((grab.value + Math.round(gone / travel) * step) * 10) / 10));
        if (to !== now) ctx.set(id, to);
        grab.moved = true; say(write(ctx.values[id]), 0, beside);
      },
      end() {
        const go = grab && grab.moved && (grab.kind === 'ring' || grab.kind === 'cart') && !ctx.locked.has(DIALS[grab.kind][0]);
        grab = null; tip.show(false); tipTime = 0; moved = true;
        if (go) ctx.setPlaying(true);   // let go, the cart sets off at once
      },
    });

    ctx.on('play', (on) => {
      if (!on) return;
      if (run.state === 'done') toStart();
      if (run.state === 'ready') launch();
    });
    ctx.on('tick', (t, dt) => {
      if (!dt) return;
      if (run.state === 'ready') launch();
      if (run.state === 'run') advance(dt);
    });
    ctx.on('action', (id) => { if (id === 'reset') toStart(); });
    ctx.on('change', (id) => {
      moved = true;
      if (id === 'scene') { clearRuns(); ctx.emit('action', 'reset'); charts(); view.look(looks()); return; }   // the other arrangement starts with empty graphs
      if (!['force', 'mass', 'drag', 'speed', 'brake', 'hang'].includes(id)) return;
      if (run.state !== 'ready') ctx.emit('action', 'reset'); else toStart();   // a run under way is taken back first
      charts();
    });
    ctx.on('mode', () => { if (!ctx.advanced && ctx.values.drag !== 0) ctx.set('drag', 0); moved = true; });

    // ---------- every frame: the cart, the balance or the brake, and the marks follow the run ----------
    function draw() {
      const v = ctx.values, n = count(), x = run.x, ready = run.state === 'ready', kind = scene(), pull = kind === 'pull';
      const m = ready ? v.mass : run.m, high = CART.deck + n * CART.slab;
      cart.position.x = x;
      weights.forEach((slab, i) => { slab.visible = i < n; });
      pileHandle.scale.y = n * CART.slab + 0.6; pileHandle.position.y = CART.deck + pileHandle.scale.y / 2;
      for (const [id, face] of Object.entries(rules)) face.visible = id === kind;
      balance.visible = pull; brakeParts.visible = brakeLine.visible = kind === 'brake'; hangParts.visible = kind === 'hang';
      ghosts.visible = v.strobe; sail.visible = false;
      weightArrow.visible = liftArrow.visible = false; hangLabel.show(kind === 'hang' && v.numbers);
      let force = 0, back = 0;   // the forces on the cart along the track: forwards and backwards
      if (pull) {
        const F = ready ? v.force : run.F, k = ready ? (ctx.advanced ? v.drag : 0) : run.k;
        force = F; back = k * run.v;
        sail.visible = k > 0; sail.scale.y = 0.5 + 0.3 * k; sail.position.y = CART.deck + sail.scale.y / 2;
        const out = SCALE.rod + F * STRETCH;   // the rod shows this much; the casing has moved out with it
        rod.scale.x = out + SCALE.zero - F * STRETCH; casing.position.x = out; marker.position.x = SCALE.zero - F * STRETCH;
      } else if (kind === 'brake') {
        const F = ready ? v.brake : run.F, braking = run.state === 'run' && run.a < 0;
        back = braking ? F : 0;
        lever.scale.y = 0.2 + (F - 3) * 0.15; knob.position.y = CART.deck + lever.scale.y; lamp.material = braking ? lampOn : lampOff;
      } else {   // the string pulls the cart, and the weights hang as much lower as the cart has gone
        const h = ready ? v.hang : run.h, many = Math.round(h * 10), y = HANG.top - (ready ? 0 : run.s) * 10, front = x + CART.half, deep = 0.3 + many * HANG.slab;
        force = ready ? 0 : run.F;   // before the start the cart is held, and the string's pull is not shown
        hanger.position.y = y; slabs.forEach((slab, i) => { slab.visible = i < many; }); stem.scale.y = deep; plate.position.y = -deep - 0.018;
        strand.position.x = front; strand.scale.x = PULLEY.x - front; drop.scale.y = PULLEY.y - y; wheel.rotation.y = -(ready ? 0 : run.s) * 10 / PULLEY.r;
        weightArrow.visible = v.forceArrow; liftArrow.visible = v.forceArrow && !ready;
        if (weightArrow.visible) { weightArrow.position.set(hanger.position.x, y - 0.3 - many * HANG.slab / 2, 0.4); weightArrow.setLength(NEWTON * h * G); weightArrow.aim(DOWN); }
        if (liftArrow.visible) { liftArrow.position.set(hanger.position.x, y, 0.4); liftArrow.setLength(NEWTON * run.F); liftArrow.aim(UP); }
        if (v.numbers) { hangSpot.set(hanger.position.x + 1.7, y - 0.2, 0); hangLabel.write(`추 ${h.toFixed(1)} kg<br>무게 ${(h * G).toFixed(2)} N`); }
      }
      const net = force - back, rate = ready ? 0 : pull ? net / m : run.a;
      forceArrow.visible = v.forceArrow && force > 0;
      if (forceArrow.visible) { forceArrow.position.set(x, 0.78, CART.wide + 0.35); forceArrow.setLength(NEWTON * force); forceArrow.aim(RIGHT); }
      dragArrow.visible = v.forceArrow && back > 0.02;
      if (dragArrow.visible) { dragArrow.material.color.set(pull ? INK.drag : INK.force); dragArrow.position.set(x, 0.78, CART.wide + 0.35); dragArrow.setLength(NEWTON * back); dragArrow.aim(LEFT); }
      speedArrow.visible = v.velocityArrow && run.v > 0.02;
      if (speedArrow.visible) { speedArrow.position.set(x, high + 0.55, 0); speedArrow.setLength(PER_SPEED * run.v); speedArrow.aim(RIGHT); }
      rateArrow.visible = v.rateArrow && run.state === 'run' && Math.abs(rate) > 0.02;
      if (rateArrow.visible) { rateArrow.position.set(x, high + 0.9, 0); rateArrow.setLength(PER_RATE * Math.abs(rate)); rateArrow.aim(rate > 0 ? RIGHT : LEFT); }
      label.show(v.numbers);
      if (!v.numbers) return;
      spot.set(x, high + 1.2, 0);
      const two = (value) => minus(value.toFixed(2)), mass = `질량 ${m.toFixed(1)} kg`;
      // before the start the cart is held still: only what has been set is shown
      if (pull) label.write(ready ? `${mass}<br>끄는 힘 ${force.toFixed(1)} N`
        : `${mass}${back ? `<br>끄는 힘 ${force.toFixed(1)} N · 저항력 ${back.toFixed(1)} N` : ''}<br>알짜힘 ${net.toFixed(1)} N<br>가속도 <b>${two(rate)} m/s²</b><br>속도 ${two(run.v)} m/s`);
      else if (kind === 'hang') label.write(ready ? `수레 ${m.toFixed(1)} kg`
        : `수레 ${m.toFixed(1)} kg<br>줄이 당기는 힘 ${force.toFixed(2)} N<br>가속도 <b>${two(rate)} m/s²</b><br>속도 ${two(run.v)} m/s`);
      else label.write(ready ? `${mass}<br>처음 속도 ${v.speed.toFixed(1)} m/s<br>제동력 ${v.brake} N`
        : run.state === 'done' ? `${mass}<br>처음 속도 ${run.v0.toFixed(1)} m/s<br>제동력 ${run.F} N · 가속도 ${two(-run.F / m)} m/s²<br>제동 거리 <b>${run.s.toFixed(3)} m</b>`
          : `${mass}<br>알짜힘 ${two(back ? -back : 0)} N<br>가속도 ${two(rate)} m/s²<br>속도 ${two(run.v)} m/s<br>제동 거리 <b>${Math.max(0, run.s).toFixed(3)} m</b>`);
    }

    // Where the bench is looked at from. With the string and pulley the weights hang beside the end of the bench, so the
    // view comes round to that end. An upright screen looks along the track, so that all of it is in sight.
    const tall = () => window.matchMedia('(max-aspect-ratio: 4/5)').matches;
    const looks = () => (scene() === 'hang' ? (tall() ? { target: [5.5, -2.6, 0], r: 24, theta: 1.15, phi: 1.3 } : { target: [5, -2.4, 0], r: 25.5, theta: 0.85, phi: 1.3 })
      : tall() ? { target: [1.2, 0.9, 0], r: 20, theta: 1.1, phi: 1.1 } : { target: [1.2, 0.9, 0], r: 16.5, theta: 0.2, phi: 1.1 });

    charts(); toStart();
    return {
      state: () => ({ ...run }), found,
      update(dt) {
        if (!framed) { framed = true; if (tall()) view.look(looks()); }
        if (stopSoon) { stopSoon = false; ctx.setPlaying(false); }
        if (tipTime > 0) { tipTime -= dt; if (tipTime <= 0) { tip.show(false); moved = true; } }
        if (!moved) return false;
        moved = false; draw();
        return true;
      },
    };
  },
};
