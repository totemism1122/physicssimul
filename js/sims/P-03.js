// P-03 Action and reaction (3D): carts on a low-friction track, in three arrangements chosen in the menu.
//
// Pushing each other: a spring plunger is pressed between carts A and B and let go, after the textbook's activity with
// two people on chairs with wheels (one pushes, the other pushes, both push; or one pushes a wall). Whichever cart
// carries the plunger and whatever the masses, the force of A on B and the force of B on A are equal in size and
// opposite in direction at every moment; what differs is how each cart speeds up (a = F / m).
//
// Action-reaction and balance: cart B is pushed by A from the left and by C from the right (the textbook's figure of a
// box pushed by one person, and by two). The two forces of a pair act on different bodies (A on B, B on A); the two
// forces that may balance act on the same body (A on B, C on B). B speeds up with the net force on it.
//
// Propulsion: a cart with a fan pushes air backwards and the air pushes the cart forwards. Advanced: a rocket cart
// throws out its fuel, so its mass falls and its acceleration grows (thrust = fuel thrown out per second x its speed).
//
// What is set by hand can be set from the menu as well, over the same ranges and in the same steps.
// Lengths are life-size: one unit of the scene is 10 cm. Forces, velocities and accelerations count as positive
// to the right.
const RED = '#e58373', BLUE = '#7fa6e6', GOLD = '#e3c26b', VIOLET = '#c79be0', SKY = '#8fc7dc';
// a number with its sign, as it is written on screen: +0.42, −0.42, 0.00
const signed = (value, digits = 2) => { const s = Math.abs(value).toFixed(digits); return Number(s) === 0 ? s : (value > 0 ? '+' : '−') + s; };
const pair = (kind) => [{ trace: `${kind}A`, color: RED, name: 'A' }, { trace: `${kind}B`, color: BLUE, name: 'B' }];
const newtons = (f) => `${signed(f, 1)} N`, speeds = (v) => `${signed(v)} m/s`, rates = (a) => `${signed(a)} m/s²`;
const SHORT = 0.4, LONG_RUN = 6;   // the push of the spring is over in a fraction of a second; the other runs last seconds
const MASS = { kind: 'slider', min: 1, max: 3, step: 0.5, digits: 1, unit: ' kg' }, PUSH = { kind: 'slider', min: 0, max: 5, step: 0.5, digits: 1, unit: ' N' };
// which arrangement an item of a menu belongs to
const inPush = (v) => v.scene === 'push', inBalance = (v) => v.scene === 'balance', inThrust = (v) => v.scene === 'thrust';
const withCart = (v) => inPush(v) && v.partner === 'cart', byFan = (v) => inThrust(v) && v.engine !== 'rocket', byRocket = (v) => inThrust(v) && v.engine === 'rocket';
const BURN = 0.5;   // the rocket throws out this much fuel each second (kg/s)

export default {
  fixedViews: ['front', 'top'],
  camera: { target: [0, 0.9, 0], r: 15, theta: 0.25, phi: 1.1, rMax: 34 },
  stepTime: 0.005,                // "one step at a time" moves on by this many seconds
  traces: {
    fA: { window: SHORT, range: 5, read: newtons }, fB: { window: SHORT, range: 5, read: newtons }, aA: { window: SHORT, range: 5, read: rates }, aB: { window: SHORT, range: 5, read: rates },
    vA: { window: LONG_RUN, range: 0.5, read: speeds }, vB: { window: LONG_RUN, range: 0.5, read: speeds },
    onB1: { window: LONG_RUN, range: 2, read: newtons }, onB2: { window: LONG_RUN, range: 2, read: newtons }, net: { window: LONG_RUN, range: 2, read: newtons },   // on B: from A, from C, and their sum
    onCart: { window: LONG_RUN, range: 2, read: newtons }, onAir: { window: LONG_RUN, range: 2, read: newtons },                                                     // propulsion: the pair
    rate: { window: LONG_RUN, range: 1, read: rates }, mass: { window: LONG_RUN, range: 2, read: (m) => `${m.toFixed(2)} kg` },
  },
  menus: {
    vars: [
      { id: 'scene', label: '장면 선택', kind: 'choice', value: 'push', options: [{ id: 'push', label: '서로 밀기' }, { id: 'balance', label: '작용 반작용과 평형' }, { id: 'thrust', label: '추진' }] },
      { id: 'partner', label: '상대', kind: 'choice', value: 'cart', when: inPush, options: [{ id: 'cart', label: '수레 B' }, { id: 'wall', label: '벽' }] },
      { id: 'pusher', label: '미는 쪽', kind: 'choice', value: 'a', when: withCart, options: [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }, { id: 'both', label: '둘 다' }] },
      { id: 'engine', label: '추진 방식', kind: 'choice', value: 'fan', when: inThrust, advanced: true, options: [{ id: 'fan', label: '팬' }, { id: 'rocket', label: '로켓' }] },
      { id: 'forceA', label: 'A가 미는 힘', value: 3, ...PUSH, when: inBalance }, { id: 'forceC', label: 'C가 미는 힘', value: 0, ...PUSH, when: inBalance },
      { id: 'power', label: '팬의 세기', kind: 'slider', min: 0.5, max: 3, step: 0.5, value: 1, digits: 1, unit: ' N', when: byFan },
      { id: 'jet', label: '분출 속도', kind: 'slider', min: 2, max: 8, step: 1, value: 4, unit: ' m/s', when: byRocket },
      { id: 'fuel', label: '연료의 양', kind: 'slider', min: 0.5, max: 2, step: 0.5, value: 1, digits: 1, unit: ' kg', when: byRocket },
      { id: 'massA', label: 'A의 질량', value: 1, ...MASS, when: (v) => !inBalance(v) }, { id: 'massB', label: 'B의 질량', value: 1, ...MASS, when: (v) => withCart(v) || inBalance(v) },
      { id: 'press', label: '용수철 누름', kind: 'slider', min: 2, max: 15, step: 1, value: 10, unit: ' cm', when: inPush },
    ],
    graph: [
      { id: 'force', label: '힘–시간', kind: 'graph', x: '시간', when: inPush, plots: [{ y: '받는 힘', area: 'N·s', lines: pair('f') }] },
      { id: 'forceB', label: '힘–시간', kind: 'graph', x: '시간', when: inBalance, plots: [{ y: 'B가 받는 힘', lines: [{ trace: 'onB1', color: RED, name: 'A가' }, { trace: 'onB2', color: VIOLET, name: 'C가' }, { trace: 'net', color: GOLD, name: '알짜힘' }] }] },
      { id: 'forceT', label: '힘–시간', kind: 'graph', x: '시간', when: inThrust, plots: [{ y: '받는 힘', area: 'N·s', lines: [{ trace: 'onCart', color: RED, name: '수레' }, { trace: 'onAir', color: SKY, name: '공기' }] }] },
      { id: 'velocity', label: '속도–시간', kind: 'graph', x: '시간', when: inPush, plots: [{ y: '속도', lines: pair('v') }] },
      { id: 'velocityB', label: '속도–시간', kind: 'graph', x: '시간', when: inBalance, plots: [{ y: 'B의 속도', trace: 'vB' }] },
      { id: 'velocityT', label: '속도–시간', kind: 'graph', x: '시간', when: inThrust, plots: [{ y: '수레의 속도', trace: 'vA' }] },
      { id: 'rate', label: '가속도–시간', kind: 'graph', x: '시간', when: inPush, plots: [{ y: '가속도', lines: pair('a') }], advanced: true },
      { id: 'rateT', label: '가속도–시간', kind: 'graph', x: '시간', when: inThrust, plots: [{ y: '수레의 가속도', trace: 'rate' }], advanced: true },
      { id: 'massT', label: '질량–시간', kind: 'graph', x: '시간', when: byRocket, plots: [{ y: '수레의 질량', trace: 'mass' }], advanced: true },
    ],
    time: [
      { id: 'slow', label: '느리게', kind: 'toggle' },
      { id: 'reset', label: '처음으로', kind: 'action' },
      { id: 'step', label: '한 단계씩', kind: 'action', advanced: true },
    ],
    layers: [
      { id: 'pair', label: '서로 미는 힘', kind: 'toggle' },
      { id: 'body', label: '물체별로 보기', kind: 'choice', value: 'all', when: inPush, options: [{ id: 'all', label: '전체' }, { id: 'a', label: 'A' }, { id: 'b', label: 'B' }] },
      { id: 'bodyB', label: '물체별로 보기', kind: 'choice', value: 'all', when: inBalance, options: [{ id: 'all', label: '전체' }, { id: 'a', label: 'A' }, { id: 'b', label: 'B' }, { id: 'c', label: 'C' }] },
      { id: 'bodyT', label: '물체별로 보기', kind: 'choice', value: 'all', when: inThrust, options: [{ id: 'all', label: '전체' }, { id: 'a', label: '수레' }, { id: 'b', label: '공기' }] },
      { id: 'netArrow', label: '알짜힘', kind: 'toggle', when: inBalance },
      { id: 'velocityArrow', label: '속도 화살표', kind: 'toggle' },
      { id: 'numbers', label: '값', kind: 'toggle' },
      { id: 'rateArrow', label: '가속도 화살표', kind: 'toggle', advanced: true },
    ],
    inquiry: [
      { id: 'table', label: '기록 표', kind: 'table', wide: true, when: inPush, text: '용수철이 다 펴져 서로 떨어질 때마다 한 줄씩 적힙니다. 힘은 가장 클 때의 값입니다.',
        columns: [{ label: 'A 질량', unit: 'kg' }, { label: 'B 질량', unit: 'kg' }, { label: 'A가 받은 힘', unit: 'N', result: true }, { label: 'B가 받은 힘', unit: 'N', result: true },
          { label: 'A 속도', unit: 'm/s', result: true }, { label: 'B 속도', unit: 'm/s', result: true }] },
      { id: 'tableB', label: '기록 표', kind: 'table', wide: true, when: inBalance, text: '수레 B를 놓을 때마다 한 줄씩 적힙니다. 힘은 크기입니다.',
        columns: [{ label: 'A가 B를', unit: '미는 힘 N' }, { label: 'B가 A를', unit: '미는 힘 N' }, { label: 'C가 B를', unit: '미는 힘 N' }, { label: 'B가 C를', unit: '미는 힘 N' },
          { label: 'B의 알짜힘', unit: 'N', result: true }, { label: 'B의 가속도', unit: 'm/s²', result: true }] },
      { id: 'tableT', label: '기록 표', kind: 'table', wide: true, when: inThrust, text: '수레가 트랙 끝에 닿을 때마다 한 줄씩 적힙니다.',
        columns: [{ label: '수레의 질량', unit: 'kg' }, { label: '수레가 받은 힘', unit: 'N' }, { label: '공기가 받은 힘', unit: 'N' }, { label: '가속도', unit: 'm/s²', result: true }, { label: '끝 속도', unit: 'm/s', result: true }] },
    ],
  },

  // writing on the chalkboard (1024 x 400)
  board(g) {
    g.fillStyle = 'rgba(255,255,255,0.9)'; g.font = '56px Georgia, serif'; g.fillText('작용 반작용', 60, 96);
    g.font = 'italic 64px Georgia, serif'; g.fillText('F', 60, 220); g.fillText('= − F', 190, 220);
    g.font = 'italic 34px Georgia, serif'; g.fillText('AB', 100, 238); g.fillText('BA', 376, 238);
    g.strokeStyle = 'rgba(255,255,255,0.8)'; g.lineWidth = 5;
    g.strokeRect(600, 180, 110, 70); g.strokeRect(790, 180, 110, 70);
    g.beginPath(); g.moveTo(700, 150); g.lineTo(610, 150); g.lineTo(628, 138); g.moveTo(610, 150); g.lineTo(628, 162);
    g.moveTo(800, 150); g.lineTo(890, 150); g.lineTo(872, 138); g.moveTo(890, 150); g.lineTo(872, 162); g.stroke();
  },

  // Builds the apparatus on the bench (world) and returns { update(dt) }.
  create({ T, kit, world, view, ctx }) {
    const { mat, add, box, cyl, letterTexture, roundedBox, Helix } = kit;
    const M = {
      rail: mat(0xc9cedb, { roughness: 0.6 }), runner: mat(0xe4e7ee, { roughness: 0.5 }), steel: mat(0x8f96a8), dark: mat(0x3a4057), red: mat(0xc8392f),
      a: mat(0xd9584a), b: mat(0x4f7fd0), c: mat(0x9a63c4), deck: mat(0xf1eee8), wheel: mat(0x2f3446), brass: mat(0xc9a35a, { roughness: 0.7 }), brassDark: mat(0xad8843, { roughness: 0.7 }),
    };
    // a force is drawn in the colour of the body it acts on
    const INK = { a: 0xd9584a, b: 0x3f6fd0, c: 0x8a4fbf, air: 0x3d93b3, net: 0xb8860b, velocity: 0x1f9d6b, rate: 0xd98a1c };
    const RIGHT = new T.Vector3(1, 0, 0), LEFT = new T.Vector3(-1, 0, 0);
    const tag = (ch, size) => new T.Mesh(new T.PlaneGeometry(size, size), new T.MeshBasicMaterial({ map: letterTexture(ch), transparent: true }));
    const scene = () => ctx.values.scene;

    // ---------- the track ----------
    const RAIL = { half: 8.2, top: 0.46 }, EDGE = 7.3;   // EDGE: how far from the middle the middle of a cart can go
    const rail = new T.Group(); world.add(rail);
    add(rail, box(RAIL.half * 2, 0.16, 0.9), M.rail, 0, 0.33, 0);
    add(rail, box(RAIL.half * 2, 0.012, 0.22), M.steel, 0, 0.416, 0, false);
    for (const z of [-0.3, 0.3]) add(rail, box(RAIL.half * 2, 0.05, 0.14), M.runner, 0, 0.435, z);
    for (const x of [-6.2, 6.2]) {
      add(rail, box(0.5, 0.25, 1.3), M.steel, x, 0.125, 0);
      for (const z of [-0.5, 0.5]) add(rail, cyl(0.09, 0.11, 0.06, 16), M.dark, x, 0.03, z);
    }
    for (const side of [-1, 1]) {
      add(rail, box(0.18, 0.5, 0.8), M.steel, side * (RAIL.half - 0.09), 0.66, 0);
      add(rail, box(0.06, 0.3, 0.5), M.dark, side * (RAIL.half - 0.21), 0.72, 0);
    }

    // ---------- the carts: 1 kg each, with a pile of weights of 0.5 kg; A is on the left ----------
    const CART = { half: 0.8, wide: 0.4, deck: 1.0, most: 4, slab: 0.16 };
    function buildCart(key, name, material) {
      const g = new T.Group(); world.add(g);
      const body = add(g, roundedBox(CART.half * 2 - 0.08, 0.36, CART.wide * 2 - 0.08, 0.08), material, 0, 0.78, 0);
      add(g, box(CART.half * 2 - 0.3, 0.03, CART.wide * 2 - 0.22), M.deck, 0, CART.deck - 0.005, 0, false);
      for (const x of [-0.5, 0.5]) for (const z of [-1, 1]) {
        add(g, cyl(0.15, 0.15, 0.1, 22), M.wheel, x, RAIL.top + 0.15, z * 0.3).rotation.x = Math.PI / 2;
        add(g, cyl(0.06, 0.06, 0.03, 14), M.rail, x, RAIL.top + 0.15, z * 0.36, false).rotation.x = Math.PI / 2;
      }
      add(g, cyl(0.025, 0.025, 0.9, 10), M.steel, 0, CART.deck + 0.45, 0);
      for (const z of [-1, 1]) { const t = tag(name, 0.36); t.position.set(0, 0.78, z * (CART.wide + 0.004)); if (z < 0) t.rotation.y = Math.PI; g.add(t); }
      const weights = Array.from({ length: CART.most }, (_, i) => add(g, cyl(0.32, 0.32, CART.slab - 0.012, 28), i % 2 ? M.brassDark : M.brass, 0, CART.deck + CART.slab / 2 + i * CART.slab, 0));
      const pile = add(g, cyl(0.4, 0.4, 1, 14), M.dark, 0, CART.deck + 0.5, 0, false, false); pile.visible = false;
      const cart = { key, name, group: g, body, weights, pile, mass: `mass${name}`, spot: new T.Vector3(), speed: kit.arrow(INK.velocity, 0.045), rate: kit.arrow(INK.rate, 0.045) };
      world.add(cart.speed, cart.rate);
      cart.label = view.label(cart.spot, true, 0.2);
      body.userData.grip = { kind: 'cart', cart }; pile.userData.grip = { kind: 'pile', cart };
      return cart;
    }
    const A = buildCart('a', 'A', M.a), B = buildCart('b', 'B', M.b);

    // ---------- spring plungers, the wall, and the two pushers of the second arrangement ----------
    // A plunger is a spring with a pad at its end. Pressed, it is shorter by the press and pushes with k x.
    const K = 100, LONG = 2.0, REACH = 1.4;   // stiffness of every spring (N/m); own length of a cart's plunger and of a pusher's (units)
    function buildPlunger(parent, at, way) {   // at: where it is fixed on the parent; way: +1 points to the right, −1 to the left
      const g = new T.Group(); g.position.set(at, 0.78, 0); g.rotation.z = -way * Math.PI / 2; parent.add(g);   // its own +Y points away from the parent
      const coil = add(g, new T.TubeGeometry(new Helix(0.11, 9, 1), 200, 0.02, 8, false), M.steel, 0, 0, 0);
      const pad = add(g, cyl(0.17, 0.17, 0.05, 20), M.dark, 0, 0, 0);
      return { group: g, set(length) { coil.scale.y = Math.max(0.05, length - 0.05); pad.position.y = length - 0.025; } };
    }
    const plungers = { a: buildPlunger(A.group, CART.half, 1), b: buildPlunger(B.group, -CART.half, -1) };
    const WALL = 1.0;   // where the face of the wall is
    const wall = new T.Group(); world.add(wall);
    add(wall, box(0.5, 1.3, 1.3), M.dark, WALL + 0.25, RAIL.top + 0.65, 0);
    add(wall, box(0.9, 0.3, 1.5), M.steel, WALL + 0.25, 0.15, 0);
    const springHandle = add(world, box(1, 0.6, 0.7), M.dark, 0, 0.78, 0, false, false); springHandle.visible = false;   // between the carts: pressing it changes who carries the plunger
    springHandle.userData.grip = { kind: 'spring' };
    // a pusher: a block held in the hand, with a spring and a pad that rests against cart B
    function buildPusher(key, name, material, way) {
      const g = new T.Group(); world.add(g);
      const block = add(g, roundedBox(0.62, 0.62, 0.62, 0.08), material, 0, 0.78, 0);
      for (const z of [-1, 1]) { const t = tag(name, 0.36); t.position.set(0, 0.78, z * 0.36); if (z < 0) t.rotation.y = Math.PI; g.add(t); }
      const handle = add(g, box(1.1, 1.1, 1.0), M.dark, 0, 0.78, 0, false, false); handle.visible = false;
      const pusher = { key, name, group: g, way, id: `force${name}`, plunger: buildPlunger(g, way * 0.35, way) };
      handle.userData.grip = { kind: 'push', pusher };
      return Object.assign(pusher, { handle, block });
    }
    const PA = buildPusher('a', 'A', M.a, 1), PC = buildPusher('c', 'C', M.c, -1);

    // ---------- the fan and the rocket of the third arrangement, on cart A ----------
    const drive = new T.Group(); A.group.add(drive);
    const fan = new T.Group(); drive.add(fan);
    add(fan, box(0.08, 0.8, 0.08), M.steel, -0.58, CART.deck + 0.4, 0);
    const blades = new T.Group(); blades.position.set(-0.68, CART.deck + 0.8, 0); fan.add(blades);
    for (let i = 0; i < 3; i++) { const blade = add(blades, box(0.03, 0.62, 0.14), M.dark, 0, 0, 0); blade.rotation.x = i * Math.PI / 3; }
    const guard = add(fan, new T.TorusGeometry(0.36, 0.02, 8, 30), M.steel, -0.68, CART.deck + 0.8, 0); guard.rotation.y = Math.PI / 2;
    const rocket = new T.Group(); drive.add(rocket);
    const tank = add(rocket, cyl(0.2, 0.2, 1, 20).translate(0, 0.5, 0), mat(0xe8a23c), -0.5, CART.deck, 0);            // as tall as there is fuel left
    add(rocket, cyl(0.2, 0.2, 0.04, 20), M.steel, -0.5, CART.deck + 0.02, 0);
    const nozzle = add(rocket, new T.ConeGeometry(0.14, 0.3, 16), M.dark, -0.86, 0.78, 0); nozzle.rotation.z = -Math.PI / 2;
    // the lever that sets how hard it pushes: higher for more
    const stem = add(drive, cyl(0.03, 0.03, 1, 10).translate(0, 0.5, 0), M.steel, 0.62, CART.deck, 0), knob = add(drive, new T.SphereGeometry(0.11, 16, 12), M.red, 0.62, CART.deck, 0);
    const leverHandle = add(drive, box(0.44, 1.6, 0.7), M.dark, 0.76, CART.deck + 0.65, 0, false, false); leverHandle.visible = false;
    leverHandle.userData.grip = { kind: 'lever' };
    // what is pushed out behind: a few puffs that drift back from the cart
    const PUFFS = 14, puffMat = new T.MeshBasicMaterial({ color: 0x8fc7dc, transparent: true, opacity: 0.45, depthWrite: false });
    const puffs = new T.InstancedMesh(new T.SphereGeometry(1, 10, 8), puffMat, PUFFS); puffs.count = 0; puffs.frustumCulled = false; world.add(puffs);
    const puffAt = new T.Matrix4();

    // ---------- marks: five force arrows with their names, written above or below ----------
    const marks = [0.12, -0.12, 0.12, -0.12, 0.12].map((shift) => { const m = { arrow: kit.arrow(INK.a, 0.05), spot: new T.Vector3() }; m.label = view.label(m.spot, false, shift); world.add(m.arrow); return m; });
    const NEWTON = 0.12, GENTLE = 0.3, PER_SPEED = 1.6, PER_RATE = 0.12;   // lengths of the arrows for 1 N (the spring's push; the smaller forces of the other arrangements), 1 m/s, 1 m/s^2
    // i: which mark; on: whether it shows; x, y: where the force acts; way: +1 to the right; f: its size; text: its name; lx, ly: where the name stands
    function mark(i, on, x, y, way, f, color, text, lx, ly, per = NEWTON, z = 0) {   // per: length for 1 N; z: how far towards the viewer
      const m = marks[i]; m.arrow.visible = on; m.label.show(on);
      if (!on) return;
      m.arrow.material.color.set(color); m.arrow.position.set(x, y, z); m.arrow.setLength(Math.max(0.3, per * f)); m.arrow.aim(way > 0 ? RIGHT : LEFT);
      m.spot.set(lx, ly, z); m.label.write(`${text} <b>${f.toFixed(1)} N</b>`);
    }
    const tipSpot = new T.Vector3(), tip = view.label(tipSpot);

    // ---------- state shared by the three arrangements ----------
    // run.state: 'ready' (set up, held still), 'run', 'done'.  now: this instant — where the carts are (units), how fast
    // (m/s), and the size of the force between them.
    const run = { state: 'ready', kind: 'push', t: 0, grid: -1 };
    const now = { f: 0, xA: 0, xB: 0, vA: 0, vB: 0, a: 0, m: 1 };
    const V_STEP = 0.02;   // the grid of time on which the longer runs are recorded
    let moved = true, stopSoon = false, tipTime = 0, framed = false;
    function say(text, x, y, seconds = 0) { tip.write(text); tipSpot.set(x, y, 0); tip.show(true); tipTime = seconds; moved = true; }
    const piled = (mass) => Math.round((mass - 1) / 0.5);

    // ====================================== pushing each other ======================================
    // The spring pushes the two bodies apart with the same force F on each, in opposite directions. Seen from one
    // another they move like a single body of mass mu = mA mB / (mA + mB) on the spring, so the press shrinks as
    // x0 cos(wt) with w = sqrt(k / mu), and F = k x. Each body gets a share of that motion in inverse proportion to
    // its mass: a = F / m. With two plungers in line each is pressed x0, so the force is the same and the push lasts longer.
    // A wall does not move: all of the motion is the cart's.
    const F_STEP = 0.002;   // the grid of time on which the short push is recorded
    const walled = () => ctx.values.partner === 'wall';
    const many = () => (!walled() && ctx.values.pusher === 'both' ? 2 : 1);
    const gap = () => many() * (LONG - ctx.values.press / 10);   // between the two faces while the spring is held pressed (units)
    // Before a run one of the two faces stays where it is and the other gives way as the spring is pressed. The cart
    // that gives way, and so the one moved by hand, is the cart that pushes (with both pushing, either; before the wall, A).
    let faceA = -1.5, faceB = 0.5, giving = null;   // giving: the cart being moved by hand just now
    const giver = () => (walled() ? 'a' : giving || (ctx.values.pusher === 'a' ? 'a' : 'b'));
    const probe = {};
    const push = {
      at(t, out = {}) {
        const whole = run.n * run.x0, shareA = run.wall ? 1 : run.mB / (run.mA + run.mB), shareB = 1 - shareA;
        let gone, speed, f;   // how far the two have moved apart (m), how fast, and the force
        if (t < run.free) { const c = Math.cos(run.w * t); gone = whole * (1 - c); speed = whole * run.w * Math.sin(run.w * t); f = K * run.x0 * c; }
        else { gone = whole + whole * run.w * (t - run.free); speed = whole * run.w; f = 0; }
        out.f = f; out.vA = -shareA * speed; out.vB = shareB * speed;
        out.xA = run.a0 - shareA * gone * 10; out.xB = run.b0 + shareB * gone * 10;
        if (out.xA <= -EDGE) { out.xA = -EDGE; out.vA = 0; }   // the end of the track
        if (out.xB >= EDGE) { out.xB = EDGE; out.vB = 0; }
        return out;
      },
      toStart() {
        if (walled()) faceB = WALL;
        if (giver() === 'a') faceA = faceB - gap(); else faceB = faceA + gap();
        const slide = walled() ? 0 : faceA < -3.5 ? -3.5 - faceA : faceB > 3.5 ? 3.5 - faceB : 0;   // the pair is kept near the middle of the track
        faceA += slide; faceB += slide;
        Object.assign(now, { f: 0, vA: 0, vB: 0, xA: faceA - CART.half, xB: faceB + CART.half });
      },
      launch() {
        const v = ctx.values, isWall = walled(), n = many();
        Object.assign(run, { wall: isWall, n, x0: v.press / 100, mA: v.massA, mB: v.massB, a0: now.xA, b0: now.xB, noted: false, fGrid: -1 });
        const mu = isWall ? run.mA : run.mA * run.mB / (run.mA + run.mB);
        run.w = Math.sqrt(K / n / mu); run.free = Math.PI / 2 / run.w;
      },
      advance() {
        const tr = ctx.traces;
        push.at(run.t, now);
        while ((run.fGrid + 1) * F_STEP <= Math.min(run.t, run.free + 0.06) + 1e-9) {   // the force, and the accelerations it gives, while the push lasts and a little after
          const t = ++run.fGrid * F_STEP, f = push.at(t, probe).f;
          tr.fA.add(t, -f); tr.fB.add(t, f); tr.aA.add(t, -f / run.mA); tr.aB.add(t, run.wall ? 0 : f / run.mB);
        }
        while ((run.grid + 1) * V_STEP <= run.t + 1e-9) { const t = ++run.grid * V_STEP; push.at(t, probe); tr.vA.add(t, probe.vA); tr.vB.add(t, probe.vB); }
        if (!run.noted && run.t >= run.free) {   // they have come apart: one line in the table
          run.noted = true;
          const peak = K * run.x0, away = push.at(run.free, probe);
          ctx.tables.table.add([run.mA.toFixed(1), run.wall ? '벽' : run.mB.toFixed(1), signed(-peak, 1), signed(peak, 1), signed(away.vA), signed(away.vB)]);
        }
        return run.t >= run.free && ((now.vA === 0 && now.vB === 0) || run.t > run.free + 4);
      },
      handles: () => (walled() ? [A.pile, A.body] : [A.pile, B.pile, A.body, B.body, springHandle]),
      grip(grip) {   // which cart can be moved by hand: the one that pushes
        const mine = walled() ? 'a' : ctx.values.pusher;
        return grip.kind === 'cart' ? (mine === 'both' || grip.cart.key === mine ? { kind: 'press', cart: grip.cart } : null) : grip;
      },
      draw(v, ready) {
        const isWall = ready ? walled() : run.wall, n = ready ? many() : run.n;
        const f = ready ? K * v.press / 100 : now.f;   // held pressed, the spring already pushes both with k x
        B.group.visible = !isWall; wall.visible = isWall;
        const left = now.xA + CART.half, right = isWall ? WALL : now.xB - CART.half, each = Math.min(LONG, (right - left) / n), carried = isWall ? 'a' : v.pusher;
        plungers.a.group.visible = carried !== 'b'; plungers.b.group.visible = !isWall && carried !== 'a';
        plungers.a.set(each); plungers.b.set(each);
        springHandle.position.x = (left + right) / 2; springHandle.scale.x = Math.max(0.3, right - left);
        // the two forces of the pair: each acts where the spring meets the body, and points away from the other one
        const shown = v.pair && f > 0.05, other = isWall ? '벽' : 'B';
        mark(0, shown && v.body !== 'b', left, 1.35, -1, f, INK.a, `${other}${isWall ? '이' : '가'} A를 미는 힘`, left - NEWTON * f / 2, 1.5);
        mark(1, shown && v.body !== 'a', right, 1.35, 1, f, INK.b, `A가 ${other}${isWall ? '을' : '를'} 미는 힘`, right + NEWTON * f / 2, 1.2);
        figures(A, v.massA, ready ? v.massA : run.mA, now.vA, ready ? 0 : -f, ready, -1);
        if (!isWall) figures(B, v.massB, ready ? v.massB : run.mB, now.vB, ready ? 0 : f, ready, 1);
        else { B.speed.visible = B.rate.visible = false; B.label.show(false); }   // the wall stands in B's place
      },
    };

    // ====================================== action-reaction and balance ======================================
    // A pushes B to the right with FA and C pushes B to the left with FC, each through its spring; B pushes back on
    // each with the same size of force. On B the two pushes add up: net = FA − FC, and a = net / mB. The pushers
    // follow the cart, so the forces stay as they were set.
    const TRIP = 0.5;   // B runs this far (m), or stands for a moment when the forces balance
    const balance = {
      at(t, out = {}) { const s = run.a * t * t / 2; out.xB = s * 10; out.vB = run.a * t; return out; },
      toStart() { Object.assign(now, { f: 0, vA: 0, vB: 0, xB: 0 }); },
      launch() {
        const v = ctx.values;
        Object.assign(run, { FA: v.forceA, FC: v.forceC, mB: v.massB, a: (v.forceA - v.forceC) / v.massB });
        run.end = run.a ? Math.sqrt(2 * TRIP / Math.abs(run.a)) : 1.2;
      },
      advance() {
        const tr = ctx.traces;
        balance.at(Math.min(run.t, run.end), now);
        while ((run.grid + 1) * V_STEP <= Math.min(run.t, run.end) + 1e-9) {
          const t = ++run.grid * V_STEP;
          tr.onB1.add(t, run.FA); tr.onB2.add(t, -run.FC); tr.net.add(t, run.FA - run.FC); tr.vB.add(t, run.a * t);
        }
        if (run.t < run.end) return false;
        ctx.tables.tableB.add([run.FA.toFixed(1), run.FA.toFixed(1), run.FC.toFixed(1), run.FC.toFixed(1), signed(run.FA - run.FC, 1), signed(run.a)]);
        return true;
      },
      handles: () => [PA.handle, PC.handle, B.pile, B.body],
      grip: (grip) => (grip.kind === 'cart' ? { kind: 'go' } : grip),
      draw(v, ready) {
        const FA = ready ? v.forceA : run.FA, FC = ready ? v.forceC : run.FC, net = FA - FC, left = now.xB - CART.half, right = now.xB + CART.half;
        // each pusher's spring is pressed 1 cm for every newton
        for (const [p, face, f] of [[PA, left, FA], [PC, right, FC]]) { const length = REACH - f * 100 / K / 10; p.group.position.x = face - p.way * (0.35 + length); p.plunger.set(length); }
        const all = v.bodyB === 'all';
        mark(0, v.pair && FA > 0 && (all || v.bodyB === 'a'), left, 1.35, -1, FA, INK.a, 'B가 A를 미는 힘', left - 1.9, 1.5, GENTLE);
        mark(1, v.pair && FA > 0 && (all || v.bodyB === 'b'), left, 0.78, 1, FA, INK.b, 'A가 B를 미는 힘', left - 1.6, 0.5, GENTLE, 0.62);   // the forces on B are drawn in front of it, where its own colour does not hide them
        mark(2, v.pair && FC > 0 && (all || v.bodyB === 'c'), right, 1.35, 1, FC, INK.c, 'B가 C를 미는 힘', right + 1.9, 1.5, GENTLE);
        mark(3, v.pair && FC > 0 && (all || v.bodyB === 'b'), right, 0.78, -1, FC, INK.b, 'C가 B를 미는 힘', right + 1.6, 0.5, GENTLE, 0.62);
        const high = CART.deck + piled(v.massB) * CART.slab;
        mark(4, v.netArrow, now.xB, high + 0.5, net >= 0 ? 1 : -1, Math.abs(net), INK.net, net ? 'B의 알짜힘' : 'B의 알짜힘(평형)', now.xB, high + 0.75, GENTLE);
        if (v.netArrow && !net) marks[4].arrow.visible = false;
        figures(B, v.massB, ready ? v.massB : run.mB, now.vB, ready ? 0 : net, ready, 1);
      },
    };

    // ====================================== propulsion ======================================
    // The fan pushes air backwards with a steady force and the air pushes the cart forwards with the same: a = F / m.
    // The rocket throws out BURN kg of fuel each second at speed u (relative to itself), which pushes it forwards with
    // BURN x u. Its mass falls, m = m0 − BURN t, so a = BURN u / m grows; v = u ln(m0 / m) while the fuel lasts.
    const HOME = -6.3, COURSE = 1.26;   // where cart A starts, and how far it runs (m)
    const thrust = {
      at(t, out = {}) {   // s: how far it has gone (m)
        if (!run.rocket) { out.a = run.F / run.m0; out.vA = out.a * t; out.s = out.a * t * t / 2; out.m = run.m0; out.f = run.F; return out; }
        const burning = Math.min(t, run.burn), m = run.m0 - BURN * burning, u = run.u;
        const v = u * Math.log(run.m0 / m), s = u * (burning + m / BURN * Math.log(m / run.m0));
        out.m = m; out.vA = v; out.s = s + v * (t - burning); out.f = t < run.burn ? run.F : 0; out.a = out.f / m;
        return out;
      },
      toStart() { Object.assign(now, { f: 0, vA: 0, vB: 0, xA: HOME, a: 0, m: ctx.values.massA + (ctx.values.engine === 'rocket' ? ctx.values.fuel : 0) }); },
      launch() {
        const v = ctx.values, isRocket = v.engine === 'rocket';
        Object.assign(run, { rocket: isRocket, u: v.jet, F: isRocket ? BURN * v.jet : v.power, m0: v.massA + (isRocket ? v.fuel : 0), dry: v.massA, burn: isRocket ? v.fuel / BURN : Infinity });
        let low = 0, high = 60;   // when the cart reaches the end of the track
        for (let i = 0; i < 50; i++) { const mid = (low + high) / 2; if (thrust.at(mid, probe).s < COURSE) low = mid; else high = mid; }
        run.end = high; run.first = thrust.at(0, probe).a;
      },
      advance() {
        const tr = ctx.traces, t1 = Math.min(run.t, run.end);
        thrust.at(t1, now); now.xA = HOME + now.s * 10;
        while ((run.grid + 1) * V_STEP <= t1 + 1e-9) {
          const t = ++run.grid * V_STEP; thrust.at(t, probe);
          tr.onCart.add(t, probe.f); tr.onAir.add(t, -probe.f); tr.vA.add(t, probe.vA); tr.rate.add(t, probe.a); tr.mass.add(t, probe.m);
        }
        if (run.t < run.end) return false;
        const lastPush = thrust.at(Math.min(run.end, run.burn) - 1e-6, probe);
        ctx.tables.tableT.add([run.rocket ? `${run.m0.toFixed(1)} → ${now.m.toFixed(1)}` : run.m0.toFixed(1), signed(run.F, 1), signed(-run.F, 1),
          run.rocket ? `${run.first.toFixed(2)} → ${lastPush.a.toFixed(2)}` : run.first.toFixed(2), now.vA.toFixed(2)]);
        return true;
      },
      handles: () => [leverHandle, A.pile, A.body],
      grip: (grip) => (grip.kind === 'cart' ? { kind: 'go' } : grip),
      draw(v, ready) {
        const isRocket = ready ? v.engine === 'rocket' : run.rocket, running = run.state === 'run', f = running ? now.f : 0;
        fan.visible = !isRocket; rocket.visible = isRocket;
        const set = isRocket ? (v.jet - 2) / 6 : (v.power - 0.5) / 2.5;   // the lever: from its lowest to its highest
        stem.scale.y = 0.2 + 0.75 * set; knob.position.y = CART.deck + stem.scale.y;
        if (isRocket) tank.scale.y = Math.max(0.02, (now.m - (ready ? v.massA : run.dry)) * 0.5);   // 5 cm of tank for each 100 g of fuel left
        else blades.rotation.x = running ? run.t * (10 + 12 * run.F) : 0;
        // what is thrown out drifts back from the cart while it pushes
        const out = isRocket ? 0.78 : CART.deck + 0.8, from = now.xA - (isRocket ? 1.0 : 0.85);
        puffMat.color.set(isRocket ? 0xe8a23c : 0x8fc7dc); puffs.count = f > 0 ? PUFFS : 0;
        for (let i = 0; i < puffs.count; i++) {
          const age = (run.t * 1.6 + i / PUFFS) % 1, size = 0.07 + 0.16 * age;
          puffAt.makeScale(size, size, size).setPosition(from - age * 2.6, out + Math.sin(i * 2.4) * 0.22 * age, Math.cos(i * 1.7) * 0.22 * age);
          puffs.setMatrixAt(i, puffAt);
        }
        puffs.instanceMatrix.needsUpdate = true;
        const thing = isRocket ? '가스' : '공기', name = isRocket ? '로켓' : '수레';
        mark(0, v.pair && f > 0 && v.bodyT !== 'b', now.xA - 0.2, out + 0.55, 1, f, INK.a, `${thing}가 ${name}${isRocket ? '을' : '를'} 미는 힘`, now.xA + 0.4, out + 0.7, GENTLE);
        mark(1, v.pair && f > 0 && v.bodyT !== 'a', from, out - 0.45, -1, f, INK.air, `${name}${isRocket ? '이' : '가'} ${thing}${isRocket ? '를' : '를'} 미는 힘`, from - 1.2, out - 0.6, GENTLE);
        figures(A, v.massA, now.m, now.vA, running ? f : 0, ready, 1, isRocket ? 1.3 : 1.1);
      },
    };
    const SCENES = { push, balance, thrust };

    // the pile of weights, the arrows of velocity and acceleration and the readings of one cart
    // shown: the mass set in the menu (for the pile); mass: the mass that moves; force: the net force on it; way: which side its reading stands on
    function figures(cart, shown, mass, speed, force, ready, way, lift = 0) {
      const v = ctx.values, count = piled(shown), x = cart.group.position.x, high = CART.deck + Math.max(count * CART.slab, lift), rate = force / mass;
      cart.weights.forEach((slab, i) => { slab.visible = i < count; });
      cart.pile.scale.y = count * CART.slab + 0.6; cart.pile.position.y = CART.deck + cart.pile.scale.y / 2;
      cart.speed.visible = v.velocityArrow && Math.abs(speed) > 0.01;
      if (cart.speed.visible) { cart.speed.position.set(x, high + 0.55, 0); cart.speed.setLength(PER_SPEED * Math.abs(speed)); cart.speed.aim(speed > 0 ? RIGHT : LEFT); }
      cart.rate.visible = v.rateArrow && Math.abs(rate) > 0.05;
      if (cart.rate.visible) { cart.rate.position.set(x, high + 0.9, 0); cart.rate.setLength(Math.max(0.3, PER_RATE * Math.abs(rate))); cart.rate.aim(rate > 0 ? RIGHT : LEFT); }
      cart.label.show(v.numbers);
      if (!v.numbers) return;
      cart.spot.set(x + way * 0.9, high + 1.2, 0);   // before the start the carts are held still: only the mass is shown
      const name = scene() === 'thrust' ? '수레' : cart.name, digits = scene() === 'thrust' && ctx.values.engine === 'rocket' ? 2 : 1;
      cart.label.write(ready ? `<b>${name}</b>  ${mass.toFixed(digits)} kg`
        : `<b>${name}</b>  ${mass.toFixed(digits)} kg<br>받는 힘 ${signed(force, 1)} N<br>가속도 ${signed(rate)} m/s²<br>속도 ${signed(speed)} m/s`);
    }

    function toStart() { run.state = 'ready'; run.kind = scene(); run.t = 0; SCENES[run.kind].toStart(); moved = true; }
    function launch() {
      Object.assign(run, { state: 'run', kind: scene(), t: 0, grid: -1 });
      SCENES[run.kind].launch();
      for (const trace of Object.values(ctx.traces)) trace.clear();
      ctx.seek(0); advance(0);
    }
    function advance(dt) {
      run.t += dt; moved = true;
      if (SCENES[run.kind].advance()) { run.state = 'done'; stopSoon = true; }
    }

    // ---------- handling ----------
    // Pushing each other: the cart that pushes is pushed towards the other to press the spring, and let go; a press on
    // the spring changes which cart carries the plunger. Balance: a pusher is pushed towards B to push harder; a
    // press on B lets it go. Propulsion: the lever is raised for more push; a press on the cart starts it.
    // In all three the piles of weights grow and shrink.
    const ray = new T.Raycaster(), upright = new T.Plane(new T.Vector3(0, 0, 1), 0), level = new T.Plane(new T.Vector3(0, 1, 0), -0.8), hit = new T.Vector3();
    // where the pointer is: along the track (x) and "up" (height, or away from the viewer when seen from above)
    function pointer(r) {
      if (Math.abs(r.direction.z) > 0.25 && r.intersectPlane(upright, hit)) return { x: hit.x, up: hit.y, rise: 1 };
      return r.intersectPlane(level, hit) ? { x: hit.x, up: -hit.z, rise: 2 } : null;
    }
    const above = (cart) => [cart.group.position.x, CART.deck + 1.9];
    // what a handle sets: [value, least, most, step, how it is written]
    const dial = (grip) => {
      const v = ctx.values;
      if (grip.kind === 'press') return ['press', 2, 15, 1, (x) => `누름 ${x} cm`];
      if (grip.kind === 'pile') return [grip.cart.mass, 1, 3, 0.5, (x) => `${scene() === 'thrust' ? '수레' : grip.cart.name} ${x.toFixed(1)} kg`];
      if (grip.kind === 'push') return [grip.pusher.id, 0, 5, 0.5, (x) => `${grip.pusher.name}가 미는 힘 ${x.toFixed(1)} N`];
      return v.engine === 'rocket' ? ['jet', 2, 8, 1, (x) => `분출 속도 ${x} m/s`] : ['power', 0.5, 3, 0.5, (x) => `팬의 세기 ${x.toFixed(1)} N`];
    };
    let grab = null;
    view.setTool({
      pick(r) {
        ray.ray.copy(r); world.updateMatrixWorld(true);
        const found = ray.intersectObjects(SCENES[scene()].handles(), false)[0];
        if (!found) return null;
        return run.state !== 'ready' ? { kind: 'reset' } : SCENES[scene()].grip(found.object.userData.grip);
      },
      cursor: (grip) => (!grip ? '' : ['reset', 'spring', 'go'].includes(grip.kind) ? 'pointer' : 'grab'),
      start(grip, r) {
        if (grip.kind === 'reset') { ctx.emit('action', 'reset'); return false; }   // a touch after a run puts everything back first
        if (grip.kind === 'go') { ctx.setPlaying(true); return false; }             // the cart is let go
        if (grip.kind === 'spring') {
          if (!ctx.locked.has('pusher')) ctx.set('pusher', { a: 'b', b: 'both', both: 'a' }[ctx.values.pusher]);
          return false;
        }
        const p = pointer(r);
        if (!p) return false;
        grab = { ...grip, from: p, value: ctx.values[dial(grip)[0]], moved: false };
        if (grip.kind === 'press') giving = grip.cart.key;
        return true;
      },
      move(r) {
        const p = pointer(r);
        if (!p) return;
        const [id, least, most, step, write] = dial(grab), v = ctx.values, across = p.x - grab.from.x, rise = (p.up - grab.from.up) / p.rise;
        // how many steps the pointer has gone: a pressed spring gives 1 cm for a cm (shared by plungers in line), a pusher 0.5 N for every 2 cm
        const steps = grab.kind === 'press' ? (grab.cart === A ? 1 : -1) * across * 10 / many() : grab.kind === 'push' ? grab.pusher.way * across * 10 / 2
          : grab.kind === 'pile' ? rise / CART.slab : rise / 0.15;
        const where = grab.kind === 'press' ? [(now.xA + now.xB) / 2, CART.deck + 1.7] : grab.kind === 'push' ? [grab.pusher.group.position.x, 2.2] : above(grab.cart || A);
        if (ctx.locked.has(id)) { say(`${write(v[id])} · 잠금`, ...where); return; }
        const to = Math.max(least, Math.min(most, Math.round((grab.value + Math.round(steps) * step) * 10) / 10));
        if (to !== v[id]) ctx.set(id, to);
        grab.moved = true; say(write(v[id]), ...where);
      },
      end() {
        const go = grab && grab.kind === 'press' && grab.moved && !ctx.locked.has('press');
        grab = null; giving = null; tip.show(false); tipTime = 0; moved = true;
        if (go) ctx.setPlaying(true);   // let go, the spring pushes the two apart at once
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
    const SETTINGS = ['partner', 'pusher', 'massA', 'massB', 'press', 'forceA', 'forceC', 'engine', 'power', 'jet', 'fuel'];
    ctx.on('change', (id) => {
      moved = true;
      if (id === 'scene') { for (const trace of Object.values(ctx.traces)) trace.clear(); ctx.emit('action', 'reset'); return; }   // the other arrangement starts with empty graphs
      if (!SETTINGS.includes(id)) return;
      if (run.state !== 'ready') ctx.emit('action', 'reset'); else toStart();   // a run under way is taken back first
    });
    ctx.on('mode', () => { if (!ctx.advanced && ctx.values.engine !== 'fan') ctx.set('engine', 'fan'); moved = true; });   // the rocket belongs to the advanced mode

    // ---------- every frame: what belongs to the arrangement is shown, and follows the run ----------
    function draw() {
      const v = ctx.values, kind = scene(), ready = run.state === 'ready';
      A.group.visible = kind !== 'balance'; B.group.visible = kind !== 'thrust'; wall.visible = false;
      plungers.a.group.visible = plungers.b.group.visible = false; PA.group.visible = PC.group.visible = kind === 'balance'; drive.visible = kind === 'thrust';
      for (const cart of [A, B]) if (!cart.group.visible) { cart.speed.visible = cart.rate.visible = false; cart.label.show(false); }
      if (kind !== 'thrust') puffs.count = 0;
      for (const m of marks) { m.arrow.visible = false; m.label.show(false); }
      A.group.position.x = now.xA; B.group.position.x = now.xB;
      SCENES[kind].draw(v, ready);
    }

    toStart();
    return {
      state: () => ({ ...run, ...now }),
      update(dt) {
        if (!framed) { framed = true; if (window.matchMedia('(max-aspect-ratio: 4/5)').matches) view.look({ r: 20, theta: 1.1, phi: 1.1 }); }   // an upright screen looks along the track
        if (stopSoon) { stopSoon = false; ctx.setPlaying(false); }
        if (tipTime > 0) { tipTime -= dt; if (tipTime <= 0) { tip.show(false); moved = true; } }
        if (!moved) return false;
        moved = false; draw();
        return true;
      },
    };
  },
};
