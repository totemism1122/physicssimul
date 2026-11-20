// P-04 Conservation of momentum (3D): two carts on a rail and, in the advanced mode, two discs that slide on the
// bench (collision in a plane). Menus follow docs/plan_v0.4.md section 3.7.
// Mass (the pile of weights), initial velocity (pulling a cart or a disc back) and the kind of collision (the
// bumpers, the rims of the discs) are set by hand in the scene, so they are not in the menu.
// Velocity and momentum count as positive to the right (+x); in the plane, +y points away across the bench.
// Distances: the bench is drawn life-size, but one unit of the scene is taken as 1 m, so that speeds of
// 1 to 20 m/s can be followed by eye. No lengths are shown.
const RED = '#e58373', BLUE = '#7fa6e6', GOLD = '#e3c26b';
// a number with its sign, as it is written on screen: +6.0, −2.5, 0.0
const signed = (value, digits = 1) => { const s = Math.abs(value).toFixed(digits); return Number(s) === 0 ? s : (value > 0 ? '+' : '−') + s; };
const speedText = (v) => signed(v, Math.abs(v * 10 - Math.round(v * 10)) < 1e-6 ? 1 : 2);   // a second decimal only when it is needed
const onRail = (values) => values.scene !== 'plane', onPlane = (values) => values.scene === 'plane';   // which arrangement an item of a menu belongs to
const SPEED = { window: 8, range: 2, read: (v) => `${speedText(v)} m/s` };

export default {
  view: '3d',
  fixedViews: ['front', 'top'],   // along the rail (left, right) the two carts hide each other
  // tall: where an upright screen starts, looking along the rail so that all of it is in sight
  camera: { target: [0, 0.9, 0], r: 14, theta: 0.32, phi: 1.1, rMax: 34, tall: { theta: 1.1, r: 20 } },
  stepTime: 0.01,                 // "one step at a time" moves on by this many seconds
  traces: {
    vA: SPEED, vB: SPEED, vAx: SPEED, vAy: SPEED, vBx: SPEED, vBy: SPEED,   // on the rail; in the plane, by components
    fA: { window: 0.48, range: 10, read: (f) => `${signed(f, 0)} N` }, fB: { window: 0.48, range: 10, read: (f) => `${signed(f, 0)} N` },
  },
  charts: {
    momentum: { names: ['A', 'B', '합'], colors: [RED, BLUE, GOLD], groups: ['전', '후'], range: 2, read: (p) => signed(p) },
    momentumX: { title: 'x성분', names: ['A', 'B', '합'], colors: [RED, BLUE, GOLD], groups: ['전', '후'], range: 2, read: (p) => signed(p) },
    momentumY: { title: 'y성분', names: ['A', 'B', '합'], colors: [RED, BLUE, GOLD], groups: ['전', '후'], range: 2, read: (p) => signed(p) },
    energy: { names: ['A', 'B', '합'], colors: [RED, BLUE, GOLD], groups: ['전', '후'], signed: false, range: 2, read: (e) => e.toFixed(1) },
  },
  menus: {
    vars: [
      { id: 'scene', label: '장면 선택', kind: 'choice', value: 'collide', options: [
        { id: 'collide', label: '충돌' }, { id: 'split', label: '분리' }, { id: 'plane', label: '평면 충돌', advanced: true },
      ] },
      { id: 'friction', label: '마찰', kind: 'toggle' },
      { id: 'bounce', label: '튕기는 정도', kind: 'slider', min: 0, max: 1, step: 0.1, value: 1, digits: 1, advanced: true },
    ],
    graph: [
      { id: 'momentum', label: '운동량 막대', kind: 'graph', bars: 'momentum', when: onRail },
      { id: 'momentumXY', label: '운동량 막대', kind: 'graph', bars: ['momentumX', 'momentumY'], when: onPlane },
      { id: 'velocity', label: '속도–시간', kind: 'graph', x: '시간', when: onRail, plots: [{ y: '속도', lines: [{ trace: 'vA', color: RED, name: 'A' }, { trace: 'vB', color: BLUE, name: 'B' }] }] },
      { id: 'velocityXY', label: '속도–시간', kind: 'graph', x: '시간', when: onPlane, plots: [
        { y: '속도의 x성분', lines: [{ trace: 'vAx', color: RED, name: 'A' }, { trace: 'vBx', color: BLUE, name: 'B' }] },
        { y: '속도의 y성분', lines: [{ trace: 'vAy', color: RED, name: 'A' }, { trace: 'vBy', color: BLUE, name: 'B' }] }] },
      { id: 'forceTime', label: '힘–시간', kind: 'graph', x: '시간', plots: [{ y: '힘', lines: [{ trace: 'fA', color: RED, name: 'A' }, { trace: 'fB', color: BLUE, name: 'B' }] }], advanced: true },
      { id: 'kinetic', label: '운동 에너지 막대', kind: 'graph', bars: 'energy', advanced: true },
    ],
    time: [
      { id: 'slow', label: '느리게', kind: 'toggle' },
      { id: 'reset', label: '처음으로', kind: 'action' },
      { id: 'toImpact', label: '충돌 순간으로', kind: 'action', advanced: true },
      { id: 'step', label: '한 단계씩', kind: 'action', advanced: true },
    ],
    layers: [
      { id: 'velocityArrow', label: '속도 화살표', kind: 'toggle' },
      { id: 'momentumArrow', label: '운동량 화살표', kind: 'toggle' },
      { id: 'numbers', label: '값', kind: 'toggle' },
      { id: 'trail', label: '지나간 길', kind: 'toggle', when: onPlane },
      { id: 'pairForce', label: '주고받는 힘', kind: 'toggle', advanced: true },
      { id: 'centre', label: '질량 중심', kind: 'toggle', advanced: true },
    ],
    inquiry: [
      { id: 'table', label: '기록 표', kind: 'table', wide: true, when: onRail, text: '충돌이나 분리가 끝날 때마다 한 줄씩 적힙니다.',
        columns: [{ label: 'm<sub>A</sub>', unit: 'kg' }, { label: 'm<sub>B</sub>', unit: 'kg' }, { label: 'v<sub>A</sub>', unit: 'm/s' }, { label: 'v<sub>B</sub>', unit: 'm/s' },
          { label: 'v<sub>A</sub>′', unit: 'm/s', result: true }, { label: 'v<sub>B</sub>′', unit: 'm/s', result: true }, { label: '운동량 합', unit: '전', result: true }, { label: '운동량 합', unit: '후', result: true }] },
      // in the plane every cell holds two numbers: the x component above the y component
      { id: 'tablePlane', label: '기록 표', kind: 'table', wide: true, rows: 4, when: onPlane, text: '충돌이 끝날 때마다 x성분(위)과 y성분(아래)이 한 줄씩 적힙니다.',
        columns: [{ label: '성분' }, { label: 'm<sub>A</sub>', unit: 'kg' }, { label: 'm<sub>B</sub>', unit: 'kg' }, { label: 'v<sub>A</sub>', unit: 'm/s' }, { label: 'v<sub>B</sub>', unit: 'm/s' },
          { label: 'v<sub>A</sub>′', unit: 'm/s', result: true }, { label: 'v<sub>B</sub>′', unit: 'm/s', result: true }, { label: '운동량 합', unit: '전', result: true }, { label: '운동량 합', unit: '후', result: true }] },
      { id: 'cases', label: '예제 상황', kind: 'choice', value: null, options: [
        { id: 'bounce', label: '정지한 수레에 충돌' }, { id: 'stick', label: '붙는 충돌' }, { id: 'headon', label: '마주 보고 충돌' }, { id: 'push', label: '밀기' }, { id: 'apart', label: '분리' },
        { id: 'glance', label: '비스듬히 충돌', advanced: true }, { id: 'heavy', label: '무거운 원판에 비스듬히', advanced: true }, { id: 'cross', label: '직각으로 만나 붙음', advanced: true },
      ] },
      { id: 'energy', label: '운동 에너지 비교', kind: 'table', advanced: true, text: '충돌이 끝날 때마다 충돌 전과 후의 운동 에너지가 한 줄씩 적힙니다.',
        columns: [{ label: '튕기는', unit: '정도' }, { label: '충돌 전', unit: 'J', result: true }, { label: '충돌 후', unit: 'J', result: true }, { label: '남은', unit: '비율', result: true }] },
    ],
  },

  // writing on the chalkboard (1024 x 400)
  board(g) {
    g.fillStyle = 'rgba(255,255,255,0.9)'; g.font = '56px Georgia, serif'; g.fillText('운동량 보존', 60, 96);
    let x = 60;
    for (const [text, sub] of [['m', 'A'], ['v', 'A'], [' + ', ''], ['m', 'B'], ['v', 'B'], [' = ', ''], ['m', 'A'], ['v', 'A′'], [' + ', ''], ['m', 'B'], ['v', 'B′']]) {
      g.font = 'italic 60px Georgia, serif'; g.fillText(text, x, 210); x += g.measureText(text).width;
      g.font = 'italic 34px Georgia, serif'; g.fillText(sub, x, 226); x += g.measureText(sub).width + (sub ? 8 : 0);
    }
    g.strokeStyle = 'rgba(255,255,255,0.8)'; g.lineWidth = 4;   // two carts about to meet
    g.strokeRect(120, 290, 130, 50); g.strokeRect(560, 290, 130, 50); g.beginPath(); g.moveTo(60, 352); g.lineTo(760, 352);
    g.moveTo(275, 315); g.lineTo(370, 315); g.lineTo(352, 303); g.moveTo(370, 315); g.lineTo(352, 327);
    g.moveTo(535, 315); g.lineTo(470, 315); g.lineTo(488, 303); g.moveTo(470, 315); g.lineTo(488, 327); g.stroke();
  },

  // Builds the apparatus on the bench (world) and returns { update(dt) }.
  create({ T, kit, world, view, ctx }) {
    const { mat, add, box, cyl, letterTexture, roundedBox, Helix } = kit;
    const M = {
      rail: mat(0xc9cedb, { roughness: 0.6 }), runner: mat(0xe4e7ee, { roughness: 0.5 }), steel: mat(0x8f96a8), dark: mat(0x3a4057),
      a: mat(0xd9584a), b: mat(0x4f7fd0), deck: mat(0xf1eee8), wheel: mat(0x2f3446), brass: mat(0xc9a35a, { roughness: 0.7 }), brassDark: mat(0xad8843, { roughness: 0.7 }),
    };
    const INK = { velocity: 0x1f9d6b, momentum: 0xd98a1c, force: 0x9a3fc2, centre: 0x1d2440 };   // colours of the marks
    const tag = (ch, size) => new T.Mesh(new T.PlaneGeometry(size, size), new T.MeshBasicMaterial({ map: letterTexture(ch), transparent: true }));

    // ---------- the rail: a level track with two runners, feet and end stops ----------
    const RAIL = { half: 8.2, top: 0.46 };   // top: height of the runners, where the wheels roll
    const rail = new T.Group(); world.add(rail);
    add(rail, box(RAIL.half * 2, 0.16, 0.9), M.rail, 0, 0.33, 0);
    add(rail, box(RAIL.half * 2, 0.012, 0.22), M.steel, 0, 0.416, 0, false);                       // the groove down the middle
    for (const z of [-0.3, 0.3]) add(rail, box(RAIL.half * 2, 0.05, 0.14), M.runner, 0, 0.435, z);
    for (const x of [-6.2, 6.2]) {
      add(rail, box(0.5, 0.25, 1.3), M.steel, x, 0.125, 0);
      for (const z of [-0.5, 0.5]) add(rail, cyl(0.09, 0.11, 0.06, 16), M.dark, x, 0.03, z);
    }
    for (const side of [-1, 1]) {
      add(rail, box(0.18, 0.5, 0.8), M.steel, side * (RAIL.half - 0.09), 0.66, 0);
      add(rail, box(0.06, 0.3, 0.5), M.dark, side * (RAIL.half - 0.21), 0.72, 0);                  // rubber face
    }

    // ---------- a cart: body on four wheels, a peg for slotted weights, a bumper on the side that meets the other cart ----------
    const CART = { half: 0.8, wide: 0.4, deck: 1.0, most: 10 };   // deck: height of the top of the body
    function buildCart(name, material, side) {
      const g = new T.Group(); world.add(g);
      add(g, roundedBox(CART.half * 2 - 0.08, 0.36, CART.wide * 2 - 0.08, 0.08), material, 0, 0.78, 0);
      add(g, box(CART.half * 2 - 0.3, 0.03, CART.wide * 2 - 0.22), M.deck, 0, CART.deck - 0.005, 0, false);
      for (const x of [-0.5, 0.5]) for (const z of [-1, 1]) {
        add(g, cyl(0.15, 0.15, 0.1, 22), M.wheel, x, RAIL.top + 0.15, z * 0.3).rotation.x = Math.PI / 2;
        add(g, cyl(0.06, 0.06, 0.03, 14), M.rail, x, RAIL.top + 0.15, z * 0.36, false).rotation.x = Math.PI / 2;
      }
      add(g, cyl(0.025, 0.025, 1.0, 10), M.steel, 0, CART.deck + 0.5, 0);
      for (const z of [-1, 1]) { const t = tag(name, 0.36); t.position.set(-side * 0.12, 0.78, z * (CART.wide + 0.004)); if (z < 0) t.rotation.y = Math.PI; g.add(t); }
      const top = tag(name, 0.34); top.material.color.set(0x3a4057); top.rotation.x = -Math.PI / 2; top.position.set(-side * 0.5, CART.deck + 0.012, 0); g.add(top);
      // weights of 100 g: all ten are made once and shown as needed
      const weights = [];
      for (let i = 0; i < CART.most; i++) weights.push(add(g, cyl(0.3, 0.3, 0.082, 28), i % 2 ? M.brassDark : M.brass, 0, CART.deck + 0.05 + i * 0.09, 0));
      // spring bumper (the carts bounce apart) and sticky bumper (they go on as one)
      const springy = new T.Group(), sticky = new T.Group(); g.add(springy, sticky);
      springy.position.set(side * CART.half, 0.78, 0); springy.rotation.z = -side * Math.PI / 2;   // its own +Y points away from the cart
      add(springy, new T.TubeGeometry(new Helix(0.1, 5, 0.36), 200, 0.018, 8, false), M.steel, 0, 0, 0);
      add(springy, cyl(0.15, 0.15, 0.04, 20), M.dark, 0, 0.38, 0);
      add(sticky, box(0.12, 0.3, 0.5), M.dark, side * (CART.half + 0.06), 0.78, 0);
      // the pin that lets a pressed spring go (used when the carts are pushed apart)
      const pin = new T.Group(); g.add(pin);
      add(pin, cyl(0.02, 0.02, 0.22, 8), M.steel, side * (CART.half - 0.18), CART.deck + 0.11, 0.24);
      add(pin, new T.SphereGeometry(0.06, 14, 10), M.dark, side * (CART.half - 0.18), CART.deck + 0.24, 0.24);
      return { name, side, group: g, weights, springy, sticky, pin, count: 0, bumper: 'spring' };
    }
    const carts = [buildCart('A', M.a, 1), buildCart('B', M.b, -1)];

    // ---------- plane collision (advanced): two discs that slide on the bench, inside a low rubber frame ----------
    const DISC = { r: 0.6, high: 0.22 }, FIELD = { x: 8.8, y: 3.0 };   // FIELD: how far from the middle of the bench the middle of a disc can go
    const RIGHT = new T.Vector3(1, 0, 0), LEFT = new T.Vector3(-1, 0, 0), AWAY = new T.Vector3(0, 0, -1), aimAt = new T.Vector3(), dummy = new T.Object3D();
    const flat = new T.Group(); world.add(flat);
    for (const side of [-1, 1]) {
      add(flat, box((FIELD.x + DISC.r) * 2 + 0.36, 0.14, 0.12), M.dark, 0, 0.07, side * (FIELD.y + DISC.r + 0.12));
      add(flat, box(0.12, 0.14, (FIELD.y + DISC.r) * 2 + 0.12), M.dark, side * (FIELD.x + DISC.r + 0.12), 0.07, 0);
    }
    for (const [name, to, x, z] of [['x', RIGHT, 1.2, 0], ['y', AWAY, 0, -1.2]]) {   // which way x and y count as positive
      const axis = kit.arrow(INK.centre, 0.022, false); axis.position.set(-9.0, 0.03, 3.2); axis.setLength(0.95); axis.aim(to); flat.add(axis);
      const t = tag(name, 0.36); t.material.color.set(INK.centre); t.rotation.x = -Math.PI / 2; t.position.set(-9.0 + x, 0.012, 3.2 + z); flat.add(t);
    }
    const discHandles = [], faint = new T.MeshBasicMaterial({ color: INK.centre, transparent: true, opacity: 0.45 });
    function buildDisc(name, material, ink, x, angle) {
      const g = new T.Group(); flat.add(g);
      add(g, cyl(DISC.r - 0.03, DISC.r - 0.03, DISC.high, 48), material, 0, DISC.high / 2, 0);
      add(g, cyl(0.47, 0.47, 0.02, 44), M.deck, 0, DISC.high + 0.004, 0, false);
      const t = tag(name, 0.28); t.material.color.set(material.color); t.rotation.x = -Math.PI / 2; t.position.set(0, DISC.high + 0.02, 0.32); g.add(t);
      add(g, cyl(0.02, 0.02, 1.0, 10), M.steel, 0, DISC.high + 0.5, 0);
      const weights = [];
      for (let i = 0; i < CART.most; i++) weights.push(add(g, cyl(0.2, 0.2, 0.082, 24), i % 2 ? M.brassDark : M.brass, 0, DISC.high + 0.05 + i * 0.09, 0));
      // spring rim (the discs bounce apart) and sticky rim (they go on as one)
      const springy = add(g, new T.TorusGeometry(DISC.r - 0.02, 0.035, 10, 56), M.steel, 0, DISC.high / 2, 0); springy.rotation.x = Math.PI / 2;
      const sticky = add(g, cyl(DISC.r, DISC.r, 0.13, 56), M.dark, 0, DISC.high / 2, 0);
      const disc = { name, flat: true, group: g, weights, springy, sticky, count: 0, speed: 0, angle, home: { x, y: 0 }, x, y: 0, vx: 0, vy: 0, caught: false, arm: [0, 0] };
      // handles for the pointer (not drawn): the pile of weights, and the disc with some room around it
      for (const [part, radius, high, y] of [['stack', 0.24, 1.1, DISC.high + 0.55], ['pull', 1.0, 0.4, 0.2]]) {
        const m = add(g, cyl(radius, radius, high, 20), M.dark, 0, y, 0, false, false); m.visible = false; m.userData = { disc, part }; discHandles.push(m);
      }
      disc.arrows = { velocity: kit.arrow(INK.velocity, 0.05), momentum: kit.arrow(INK.momentum, 0.05), force: kit.arrow(INK.force, 0.06) };
      for (const arrow of Object.values(disc.arrows)) { arrow.visible = false; flat.add(arrow); }
      disc.spot = new T.Vector3(); disc.label = view.label(disc.spot, true, name === 'A' ? 0.75 : -0.85);   // the reading of A above it on the screen, that of B below: they keep clear of each other
      // where it will go (a dashed line), the place it was pulled back from (a ring), where it has been (a dot every DOT seconds)
      disc.aim = new T.InstancedMesh(box(0.2, 0.012, 0.045), faint, 60); disc.ring = add(flat, kit.ringGeometry(DISC.r + 0.03, DISC.r + 0.07, 0.008), faint, 0, 0.004, 0, false, false);
      disc.trail = new T.InstancedMesh(cyl(0.05, 0.05, 0.012, 10), new T.MeshBasicMaterial({ color: ink }), 300);
      for (const marks of [disc.aim, disc.trail]) { marks.frustumCulled = false; marks.count = 0; flat.add(marks); }
      return disc;
    }
    const discs = [buildDisc('A', M.a, 0xb0392d, -2.4, 0), buildDisc('B', M.b, 0x2f5fb0, 2.4, 180)];
    const sum = kit.arrow(0x8a6a12, 0.075); sum.visible = false; flat.add(sum);   // the momentum of both together, drawn at the centre of mass

    // each cart: handles for the pointer (not drawn), its marks and its readings
    const handles = [];
    for (const cart of carts) {
      const handle = (part, w, h, d, x, y, z) => { const m = add(cart.group, box(w, h, d), M.dark, x, y, z, false, false); m.visible = false; m.userData = { cart, part }; handles.push(m); };
      handle('stack', 0.8, 1.05, 0.8, 0, CART.deck + 0.55, 0); handle('body', CART.half * 2 + 0.1, 0.7, 0.95, 0, 0.72, 0);
      handle('bumper', 0.5, 0.5, 0.7, cart.side * (CART.half + 0.22), 0.78, 0); handle('pin', 0.3, 0.42, 0.3, cart.side * (CART.half - 0.18), CART.deck + 0.2, 0.24);
      cart.arrows = { velocity: kit.arrow(INK.velocity, 0.05), momentum: kit.arrow(INK.momentum, 0.05), force: kit.arrow(INK.force, 0.06) };
      for (const arrow of Object.values(cart.arrows)) { arrow.visible = false; world.add(arrow); }
      cart.spot = new T.Vector3(); cart.label = view.label(cart.spot, true);
      Object.assign(cart, { speed: 0, x: 0, v: 0, caught: false });
    }
    const [A, B] = carts, [DA, DB] = discs;
    const tipSpot = new T.Vector3(), tip = view.label(tipSpot);          // what is being set, while a cart or a disc is handled
    const centre = new T.Group(); centre.visible = false; world.add(centre);   // the mark for the centre of mass
    const centreInk = new T.MeshBasicMaterial({ color: INK.centre, depthTest: false });
    for (const part of [new T.Mesh(new T.OctahedronGeometry(0.13), centreInk), new T.Mesh(cyl(0.012, 0.012, 1.3, 6), centreInk)]) { part.renderOrder = 10; centre.add(part); }
    centre.children[0].position.y = 1.85; centre.children[1].position.y = 1.2;

    // ---------- what the user has set (kept when a run is taken back to its start) ----------
    const START = 2.4, PULL = 0.22, MOST = 20;   // a cart rests START from the middle; each PULL further back adds 1 m/s
    const DRAW = 0.145, TOUCH = DISC.r * 2;       // a disc: each DRAW back from its place adds 1 m/s; the middles are TOUCH apart when the rims meet
    const setup = { bumper: 'spring', level: 2 };  // level: how far the spring is pressed before the carts are pushed apart (1 to 3)
    A.count = 2; A.speed = 5; B.count = 5; B.speed = 0; DA.speed = 5;
    const mass = (body) => 1 + 0.1 * body.count;   // a cart or a disc is 1 kg, each weight 100 g
    const apart = () => ctx.values.scene === 'split', plane = () => ctx.values.scene === 'plane';
    const bounce = () => (setup.bumper === 'sticky' ? 0 : ctx.advanced ? ctx.values.bounce : 1);   // how much of the meeting speed they part with
    const way = (disc) => { const a = disc.angle * Math.PI / 180; return [Math.cos(a), Math.sin(a)]; };   // the heading of a disc: 0 degrees is +x, 90 is +y
    const turning = (disc) => 0.5 * DISC.r * DISC.r + 0.002 * disc.count;   // moment of inertia about its own middle (a 1 kg disc, weights of radius 0.2)

    // ---------- the run ----------
    // state: 'ready' (being set up), 'run' (under way, perhaps paused), 'done' (everything has come to rest).
    // contact: while the two press on each other { k, e, unloading, most, u }.
    // The force between them is that of a spring that gives back only part of its energy: k x on the way in,
    // (k / e^2)(x - x0) on the way out, which makes them part at e times the speed they met with.
    // Discs push each other along the line of their middles only (smooth rims, so nothing sets them turning).
    const SPRING = 2000, PAD = 20000, PUSHER = 800, DRAG = 0.2 * 9.8, REACH = 7.16, DOT = 0.04;   // N/m, N/m, N/m, m/s^2, how far a cart can go, s
    const run = { state: 'ready', t: 0, contact: null, joined: false, before: null, after: null, force: 0, touch: 2.4, spin: 0, normal: [1, 0] };
    const pair = { x: 0, y: 0, vx: 0, vy: 0, turn: 0, inertia: 1, lever: 0 };   // two discs that go on as one body
    let moved = true, tipTime = 0, stopSoon = false, trailNext = 0;
    const snapshot = () => ({ mA: mass(A), mB: mass(B), vA: A.v, vB: B.v });
    const sums = ({ mA, mB, vA, vB }) => ({ p: [mA * vA, mB * vB, mA * vA + mB * vB], e: [mA * vA * vA / 2, mB * vB * vB / 2, (mA * vA * vA + mB * vB * vB) / 2] });
    function chart(group, shot) { const s = sums(shot); ctx.charts.momentum.set(group, s.p); ctx.charts.energy.set(group, s.e); }
    // the discs at one moment: masses, velocities (planned: those they are set to start with) and the kinetic energy of each, turning included
    function flatShot(planned) {
      const m = discs.map(mass), v = discs.map((d) => (planned ? way(d).map((c) => c * d.speed) : [d.vx, d.vy]));
      return { m, v, e: discs.map((d, i) => m[i] * (v[i][0] ** 2 + v[i][1] ** 2) / 2 + turning(d) * run.spin ** 2 / 2) };
    }
    const along = ({ m, v }, k) => [m[0] * v[0][k], m[1] * v[1][k], m[0] * v[0][k] + m[1] * v[1][k]];   // momentum along x (k = 0) or y (k = 1): A, B, both
    function flatChart(group, shot) {
      ctx.charts.momentumX.set(group, along(shot, 0)); ctx.charts.momentumY.set(group, along(shot, 1));
      ctx.charts.energy.set(group, [shot.e[0], shot.e[1], shot.e[0] + shot.e[1]]);
    }
    function sample(gap) {
      const t = ctx.traces;
      if (plane()) { t.vAx.add(run.t, DA.vx, gap); t.vAy.add(run.t, DA.vy, gap); t.vBx.add(run.t, DB.vx, gap); t.vBy.add(run.t, DB.vy, gap); }
      else { t.vA.add(run.t, A.v, gap); t.vB.add(run.t, B.v, gap); }
    }
    function force(value, gap) { run.force = value; ctx.traces.fA.add(run.t, -value, gap); ctx.traces.fB.add(run.t, value, gap); }

    function toStart() {   // the carts or the discs go back to where they were set, with what was set
      Object.assign(run, { state: 'ready', t: 0, contact: null, joined: false, before: null, after: null, force: 0, spin: 0 });
      for (const trace of Object.values(ctx.traces)) trace.clear();
      for (const bars of Object.values(ctx.charts)) bars.clear();
      for (const body of [...carts, ...discs]) body.weights.forEach((weight, i) => { weight.visible = i < body.count; });
      if (plane()) {
        for (const d of discs) {   // pulled back from its place, against the way it will go, as far as the frame lets it
          const [cx, cy] = way(d);
          let back = DRAW * d.speed;
          if (Math.abs(cx) > 1e-9) back = Math.min(back, (FIELD.x + Math.sign(cx) * d.home.x) / Math.abs(cx));
          if (Math.abs(cy) > 1e-9) back = Math.min(back, (FIELD.y + Math.sign(cy) * d.home.y) / Math.abs(cy));
          Object.assign(d, { x: d.home.x - cx * back, y: d.home.y - cy * back, vx: 0, vy: 0, caught: false });
          d.trail.count = 0;
        }
        trailNext = 0; flatChart(0, flatShot(true));
      } else {
        const gap = 0.4 - 0.1 * setup.level;   // pressed spring and its plate, between the two bodies
        for (const cart of carts) { cart.x = -cart.side * (apart() ? CART.half + gap / 2 : START + PULL * cart.speed); cart.v = 0; cart.caught = false; }
        run.touch = apart() ? CART.half * 2 + 0.4 : CART.half * 2 + (setup.bumper === 'spring' ? 0.8 : 0.24);   // distance between the middles when the bumpers meet
        chart(0, { mA: mass(A), mB: mass(B), vA: apart() ? 0 : A.speed, vB: apart() ? 0 : -B.speed });
      }
      moved = true;
    }
    function launch() {
      run.state = 'run';
      if (plane()) for (const d of discs) [d.vx, d.vy] = way(d).map((c) => c * d.speed);
      else if (apart()) {   // the pin is out: the pressed spring pushes the carts apart
        run.before = snapshot(); run.contact = { k: PUSHER, e: 1, unloading: true, most: 0.1 * setup.level, u: 0, push: true };
        force(0, true);
      } else { A.v = A.speed; B.v = -B.speed; }
      sample(true);
    }

    // ----- on the rail -----
    function meet() {
      run.contact = { k: setup.bumper === 'sticky' ? PAD : SPRING, e: bounce(), unloading: false, most: 0, u: A.v - B.v };
      if (!run.before) { run.before = snapshot(); chart(0, run.before); }
      sample(); force(0, true);
    }
    function partCarts() {   // the push is over: the carts go on with their new velocities
      const c = run.contact, mA = mass(A), mB = mass(B), total = mA + mB, p = mA * A.v + mB * B.v;
      if (c.push) {
        if (!ctx.values.friction) { const energy = c.k * c.most * c.most / 2; A.v = -Math.sqrt(2 * energy * mB / (mA * total)); B.v = Math.sqrt(2 * energy * mA / (mB * total)); }
      } else { A.v = (p - mB * c.e * c.u) / total; B.v = A.v + c.e * c.u; }   // exactly: momentum kept, parting speed e times the meeting speed
      run.joined = !c.push && c.e === 0; run.contact = null;
      force(0); sample();
      if (run.after) return;
      run.after = snapshot(); chart(1, run.after);
      const b = sums(run.before), a = sums(run.after);
      ctx.tables.table.add([run.before.mA.toFixed(1), run.before.mB.toFixed(1), speedText(run.before.vA), speedText(run.before.vB), speedText(A.v), speedText(B.v), signed(b.p[2]), signed(a.p[2])]);
      if (!c.push) ctx.tables.energy.add([c.e.toFixed(1), b.e[2].toFixed(1), a.e[2].toFixed(1), `${Math.round(a.e[2] / b.e[2] * 100)} %`]);
    }
    function pressing(depth, closing) {   // the force between the two for this depth of pressing
      const c = run.contact;
      if (!c.unloading) {
        if (closing > 0) return c.k * depth + (depth > 0.66 ? 50000 * (depth - 0.66) : 0);   // a spring pressed flat goes hard
        c.unloading = true; c.most = depth;
        if (c.e === 0) { part(); return 0; }       // sticky bumpers hold: the two go on as one
      }
      const f = c.k / (c.e * c.e) * (depth - c.most * (1 - c.e * c.e));
      if (f <= 0) { part(); return 0; }
      return f;
    }
    function step(h) {
      run.t += h;
      // Friction is left out while the carts press on each other: a real collision is over too quickly for it to count.
      const drag = ctx.values.friction && !run.contact ? DRAG : 0, between = B.x - A.x;
      let f = 0;
      if (!run.joined) {
        if (!run.contact && between <= run.touch && A.v - B.v > 0) {
          if (A.caught || B.caught) { A.v = B.v = 0; A.caught = B.caught = true; }   // held against the end of the rail
          else meet();
        }
        if (run.contact) { f = pressing(run.touch - between, A.v - B.v); if (run.contact) force(f); }
      }
      for (const cart of carts) {
        const before = cart.v;
        cart.v += (cart === A ? -f : f) / mass(cart) * h - Math.sign(cart.v) * drag * h;
        if (drag && before * cart.v < 0) cart.v = 0;     // friction stops a cart; it does not turn it round
        cart.x += cart.v * h;
        if (Math.abs(cart.x) > REACH) { cart.x = Math.sign(cart.x) * REACH; cart.v = 0; cart.caught = true; }   // the rubber stop
      }
      if (run.joined && (A.caught || B.caught)) { A.v = B.v = 0; A.caught = B.caught = true; }
    }

    // ----- in the plane -----
    function meetDiscs(nx, ny, closing) {   // (nx, ny): from the middle of A towards the middle of B
      // u: how fast they close in along that line; slide: how fast B passes across it as seen from A
      run.contact = { k: setup.bumper === 'sticky' ? PAD : SPRING, e: bounce(), unloading: false, most: 0, u: closing, slide: (DA.vx - DB.vx) * ny - (DA.vy - DB.vy) * nx };
      if (!run.before) { run.before = flatShot(); flatChart(0, run.before); }
      sample(); force(0, true);
    }
    function carry(h) {   // the two discs as one body: its centre of mass goes straight on while the body turns about it
      pair.x += pair.vx * h; pair.y += pair.vy * h; pair.turn += run.spin * h;
      const c = Math.cos(pair.turn), s = Math.sin(pair.turn);
      for (const d of discs) {
        const ax = d.arm[0] * c - d.arm[1] * s, ay = d.arm[0] * s + d.arm[1] * c;
        Object.assign(d, { x: pair.x + ax, y: pair.y + ay, vx: pair.vx - run.spin * ay, vy: pair.vy + run.spin * ax });
      }
    }
    function partDiscs() {   // the push is over: the discs go on with their new velocities
      const c = run.contact, mA = mass(DA), mB = mass(DB), total = mA + mB, reduced = mA * mB / total;
      const dx = DB.x - DA.x, dy = DB.y - DA.y, far = Math.hypot(dx, dy), nx = dx / far, ny = dy / far;
      const vx = (mA * DA.vx + mB * DB.vx) / total, vy = (mA * DA.vy + mB * DB.vy) / total;   // the centre of mass keeps its velocity
      const swing = reduced * TOUCH * c.slide;   // angular momentum of the two about their centre of mass: the push, along the line of the middles, left it as it was
      if (c.e === 0) {   // held rim to rim they go on as one body, which turns if they met off-centre
        Object.assign(pair, { x: (mA * DA.x + mB * DB.x) / total, y: (mA * DA.y + mB * DB.y) / total, vx, vy, turn: 0, inertia: reduced * far * far + turning(DA) + turning(DB), lever: 2 * reduced * far });
        run.spin = swing / pair.inertia; run.joined = true;
        DA.arm = [-mB / total * dx, -mB / total * dy]; DB.arm = [mA / total * dx, mA / total * dy];
        carry(0);
      } else {   // exactly: along the line of the middles they part at e times the speed they met with
        const out = c.e * c.u, across = swing / (reduced * (TOUCH - c.most * (1 - c.e * c.e)));
        const wx = out * nx - across * ny, wy = out * ny + across * nx;   // the velocity of B as seen from A
        Object.assign(DA, { vx: vx - mB / total * wx, vy: vy - mB / total * wy }); Object.assign(DB, { vx: vx + mA / total * wx, vy: vy + mA / total * wy });
      }
      run.contact = null; force(0); sample();
      if (run.after) return;
      const b = run.before, a = run.after = flatShot(), two = (x, y, text = speedText) => `${text(x)}<br>${text(y)}`;
      flatChart(1, a);
      ctx.tables.tablePlane.add(['x<br>y', b.m[0].toFixed(1), b.m[1].toFixed(1), two(...b.v[0]), two(...b.v[1]), two(...a.v[0]), two(...a.v[1]),
        two(along(b, 0)[2], along(b, 1)[2], signed), two(along(a, 0)[2], along(a, 1)[2], signed)]);
      const was = b.e[0] + b.e[1], is = a.e[0] + a.e[1];
      ctx.tables.energy.add([c.e.toFixed(1), was.toFixed(1), is.toFixed(1), `${Math.round(is / was * 100)} %`]);
    }
    const part = () => (plane() ? partDiscs() : partCarts());
    const outside = (d) => Math.abs(d.x) > FIELD.x || Math.abs(d.y) > FIELD.y;
    function stepDiscs(h) {
      run.t += h;
      const drag = ctx.values.friction && !run.contact ? DRAG * h : 0;   // as on the rail, no friction while they press on each other
      const slowed = (vx, vy) => { const speed = Math.hypot(vx, vy); return speed > drag ? (speed - drag) / speed : 0; };   // friction takes speed away; it never turns anything round
      if (run.joined) {
        const keep = slowed(pair.vx, pair.vy), less = drag * pair.lever / pair.inertia;   // the turning is slowed too (roughly: the friction on each disc, at its distance from the centre of mass)
        pair.vx *= keep; pair.vy *= keep; run.spin = Math.abs(run.spin) > less ? run.spin - Math.sign(run.spin) * less : 0;
        carry(h);
        if (discs.some(outside)) { pair.vx = pair.vy = run.spin = 0; carry(0); DA.caught = DB.caught = true; }   // the rubber frame holds them
      } else {
        const dx = DB.x - DA.x, dy = DB.y - DA.y, far = Math.hypot(dx, dy), nx = dx / far, ny = dy / far, closing = (DA.vx - DB.vx) * nx + (DA.vy - DB.vy) * ny;
        let f = 0;
        if (!run.contact && far <= TOUCH && closing > 0) {
          if (DA.caught || DB.caught) { for (const d of discs) Object.assign(d, { vx: 0, vy: 0, caught: true }); }   // held against the frame
          else meetDiscs(nx, ny, closing);
        }
        if (run.contact) { f = pressing(TOUCH - far, closing); if (run.contact) { force(f); run.normal = [nx, ny]; } }
        for (const d of discs) {
          const push = (d === DA ? -f : f) / mass(d) * h;
          d.vx += push * nx; d.vy += push * ny;
          const keep = drag ? slowed(d.vx, d.vy) : 1;
          d.vx *= keep; d.vy *= keep; d.x += d.vx * h; d.y += d.vy * h;
          if (outside(d)) Object.assign(d, { x: Math.max(-FIELD.x, Math.min(FIELD.x, d.x)), y: Math.max(-FIELD.y, Math.min(FIELD.y, d.y)), vx: 0, vy: 0, caught: true });   // the rubber frame
        }
      }
      if (run.t >= trailNext - 1e-9) {
        trailNext += DOT;
        for (const d of discs) if (d.trail.count < 300) { dummy.position.set(d.x, 0.008, -d.y); dummy.rotation.y = 0; dummy.updateMatrix(); d.trail.setMatrixAt(d.trail.count++, dummy.matrix); d.trail.instanceMatrix.needsUpdate = true; }
      }
    }

    const still = (body) => Math.hypot(body.vx || body.v || 0, body.vy || 0) < 1e-4;
    function advance(dt) {
      const onBench = plane(), bodies = onBench ? discs : carts;
      let left = dt;
      while (left > 1e-7 && run.state === 'run') {
        let h = left;
        if (run.contact) h = Math.min(left, 0.0002);   // the push is short, so it is taken in fine steps
        else if (onBench) {
          if (!run.joined) {   // up to the meeting, if they are closing in
            const dx = DB.x - DA.x, dy = DB.y - DA.y, far = Math.hypot(dx, dy), closing = ((DA.vx - DB.vx) * dx + (DA.vy - DB.vy) * dy) / far;
            if (closing > 0) h = Math.min(left, Math.max(0.0002, (far - TOUCH) / closing));
          }
          h = Math.min(h, Math.max(1e-6, trailNext - run.t));   // and up to the next dot of the trail
        } else if (!run.joined && A.v - B.v > 0) h = Math.min(left, Math.max(0.0002, (B.x - A.x - run.touch) / (A.v - B.v)));   // up to the meeting
        if (onBench) stepDiscs(h); else step(h);
        left -= h;
        if (!run.contact && !run.spin && bodies.every(still)) run.state = 'done';
      }
      sample(); moved = true;
    }

    ctx.on('play', (on) => {
      if (!on) return;
      if (run.state === 'done') toStart();
      if (run.state === 'ready') {
        const onBench = plane();
        if (!apart() && !(onBench ? discs : carts).some((body) => body.speed)) {
          tip.write(`${onBench ? '원판을' : '수레를'} 뒤로 당겨 속력을 정하세요`); tipSpot.set(0, onBench ? 1.7 : 2.6, 0); tip.show(true); tipTime = 2.5; stopSoon = true; return;
        }
        launch();
      }
    });
    ctx.on('tick', (t, dt) => {
      if (!dt) return;
      if (run.state === 'ready') launch();
      advance(dt);
      if (run.state === 'done') stopSoon = true;
    });
    ctx.on('action', (id) => {
      if (id === 'reset') toStart();
      if (id === 'toImpact') {   // runs ahead, unseen, to the moment the two meet
        ctx.emit('action', 'reset'); launch();
        for (let i = 0; i < 20000 && run.state === 'run' && !run.contact && !run.after; i++) advance(0.002);
        ctx.seek(run.t);
      }
    });

    // ---------- examples: situations set up ready to run ----------
    // scene, bumper, then for A and for B: weights, speed and (a disc) heading; last, how far towards the viewer the discs start
    const CASES = {
      bounce: ['collide', 'spring', [0, 4], [0, 0]],
      stick: ['collide', 'sticky', [0, 6], [10, 0]],
      headon: ['collide', 'sticky', [0, 6], [10, 3]],
      push: ['split', 'spring', [0, 0], [0, 0]],
      apart: ['split', 'spring', [0, 0], [10, 0]],
      glance: ['plane', 'spring', [0, 6, 8], [0, 0, 180], 0],      // equal masses, off-centre: they part at right angles
      heavy: ['plane', 'spring', [0, 8, 6], [10, 0, 180], 0],
      cross: ['plane', 'sticky', [0, 4, 45], [10, 4, 135], 1.4],   // paths at right angles; they meet and go on as one
    };
    const things = world.userData.things;   // what else lies on the bench is put away while the discs need the room
    let framing = 'rail';
    ctx.on('change', (id, value) => {
      moved = true;
      if (id === 'cases' && CASES[value]) {
        const [scene, bumper, a, b, near] = CASES[value], bodies = scene === 'plane' ? discs : carts;
        Object.assign(setup, { bumper, level: 2 });
        [a, b].forEach(([count, speed, angle], i) => { Object.assign(bodies[i], { count, speed }); if (scene === 'plane') { bodies[i].angle = angle; bodies[i].home.y = -near; } });
        if (ctx.values.scene !== scene) ctx.set('scene', scene); else ctx.emit('action', 'reset');
      }
      if (id === 'scene') {
        ctx.emit('action', 'reset');   // the frame stops the clock; toStart() follows from the action
        const now = value === 'plane' ? 'bench' : 'rail';
        if (now === framing) return;
        framing = now;
        // the discs are watched from above: across the bench, or along it on an upright screen
        const upright = window.matchMedia('(max-aspect-ratio: 4/5)').matches;
        if (now === 'bench') view.look({ target: [0, 0.2, 0], r: 21, theta: upright ? Math.PI / 2 : 0, phi: 0.6 });
        else view.look({ theta: upright ? 1.1 : 0.32, phi: 1.1 });
      }
    });

    // ---------- handling: weights, pulling back, bumpers, the pin ----------
    const ray = new T.Raycaster(), upright = new T.Plane(new T.Vector3(0, 0, 1), 0), level = new T.Plane(new T.Vector3(0, 1, 0), -0.8), hit = new T.Vector3();
    const benchTop = new T.Plane(new T.Vector3(0, 1, 0), -DISC.high / 2);   // where a disc is held
    // where the pointer is: along the rail (x) and "up" (height, or away from the viewer when seen from above)
    function pointer(r) {
      if (Math.abs(r.direction.z) > 0.25 && r.intersectPlane(upright, hit)) return { x: hit.x, up: hit.y, rise: 0.09 };
      return r.intersectPlane(level, hit) ? { x: hit.x, up: -hit.z, rise: 0.16 } : null;
    }
    let grab = null;
    function say(body, text) { tip.write(text); tipSpot.set(body.x, body.flat ? 1.75 : CART.deck + 1.45, body.flat ? -body.y : 0); tip.show(true); tipTime = 0; }
    view.setTool({
      pick(r) {
        ray.ray.copy(r);
        if (plane()) {
          for (const d of discs) d.group.updateMatrixWorld(true);
          const found = ray.intersectObjects(discHandles, false)[0];
          if (!found) return null;
          return run.state !== 'ready' ? { kind: 'reset' } : { kind: found.object.userData.part, cart: found.object.userData.disc };
        }
        for (const cart of carts) cart.group.updateMatrixWorld(true);
        const found = ray.intersectObjects(handles, false)[0];
        if (!found) return null;
        const { cart, part: which } = found.object.userData;
        if (run.state !== 'ready') return { kind: 'reset' };            // a touch after a run puts the carts back first
        if (which === 'pin') return apart() && cart === A ? { kind: 'pin' } : { kind: 'stack', cart };
        if (which === 'bumper') return apart() ? null : { kind: 'bumper' };
        if (which === 'body' && apart() && cart === A) return null;      // the spring is set by pushing B
        return { kind: which, cart };
      },
      cursor: (grip) => (!grip ? '' : ['stack', 'body', 'pull'].includes(grip.kind) ? 'grab' : 'pointer'),
      start(grip, r) {
        if (grip.kind === 'reset') { ctx.emit('action', 'reset'); return false; }
        if (grip.kind === 'pin') { ctx.setPlaying(true); return false; }
        if (grip.kind === 'bumper') { setup.bumper = setup.bumper === 'spring' ? 'sticky' : 'spring'; toStart(); return false; }
        const held = grip.cart.flat && r.intersectPlane(benchTop, hit) ? { at: [hit.x, -hit.z], shift: [hit.x - grip.cart.x, -hit.z - grip.cart.y] } : null;   // where on the bench a disc is held
        if (grip.kind === 'pull') {
          if (!held) return false;
          grab = { ...grip, ...held, moved: false };
          return true;
        }
        const p = pointer(r);
        if (!p) return false;
        // Seen from above, the pile of a disc lies right over its middle, where a pull would start too:
        // which of the two is meant shows in the way the pointer first goes (unsure, until then).
        grab = { ...grip, ...held, from: p, count: grip.cart.count, offset: p.x - grip.cart.x, unsure: Boolean(held) };
        return true;
      },
      move(r) {
        const cart = grab.cart;
        if (grab.unsure) {   // up or down: the weights; sideways: the disc is being pulled
          const p = pointer(r);
          if (!p || Math.hypot(p.x - grab.from.x, p.up - grab.from.up) < 0.1) return;
          grab.unsure = false;
          if (Math.abs(p.x - grab.from.x) > Math.abs(p.up - grab.from.up)) grab.kind = 'pull';
        }
        if (grab.kind === 'pull') {   // a disc pulled back from its place sets off the other way: how far back sets the speed
          if (!r.intersectPlane(benchTop, hit)) return;
          if (Math.hypot(hit.x - grab.at[0], -hit.z - grab.at[1]) > 0.12) grab.moved = true;
          if (!grab.moved) return;
          const x = cart.home.x - (hit.x - grab.shift[0]), y = cart.home.y - (-hit.z - grab.shift[1]);
          cart.speed = Math.max(0, Math.min(MOST, Math.round(Math.hypot(x, y) / DRAW)));
          if (cart.speed) { const angle = Math.round(Math.atan2(y, x) * 180 / Math.PI); cart.angle = angle === -180 ? 180 : angle || 0; }
          toStart(); say(cart, cart.speed ? `${cart.speed} m/s · ${String(cart.angle).replace('-', '−')}°` : '0 m/s');
          return;
        }
        const p = pointer(r);
        if (!p) return;
        if (grab.kind === 'stack') {
          cart.count = Math.max(0, Math.min(CART.most, grab.count + Math.round((p.up - grab.from.up) / (cart.flat ? p.rise * 1.6 : p.rise))));   // the discs are watched from farther off
          toStart(); say(cart, `${mass(cart).toFixed(1)} kg`);
        } else if (apart()) {   // pushing B towards A presses the spring further
          setup.level = Math.max(1, Math.min(3, Math.round((0.4 - 2 * (p.x - grab.offset - CART.half)) / 0.1)));
          toStart(); say(cart, `용수철 ${setup.level}단`);
        } else {                // pulling a cart back from the other one sets its speed
          cart.speed = Math.max(0, Math.min(MOST, Math.round((-cart.side * (p.x - grab.offset) - START) / PULL)));
          toStart(); say(cart, `${cart.speed} m/s`);
        }
      },
      end() {
        tipTime = 0.8;
        if (grab.cart.flat && (grab.kind === 'pull' ? !grab.moved : grab.unsure)) {   // a disc pressed and let go: the rims are changed, as the bumpers of the carts are
          setup.bumper = setup.bumper === 'spring' ? 'sticky' : 'spring'; toStart();
          say(grab.cart, setup.bumper === 'sticky' ? '붙는 테두리' : '튕기는 테두리'); tipTime = 1.4;
        } else if ((grab.kind === 'pull' || (grab.kind === 'body' && !apart())) && grab.cart.speed) {
          // a disc or a cart pulled back and let go: off it goes, like a stone from a catapult
          // (the other one sets off too, if it was left pulled back)
          tipTime = 0.4; ctx.setPlaying(true);
        }
        grab = null;
      },
    });

    // ---------- every frame: the carts and the discs, their springs, marks and readings ----------
    function point(arrow, x, y, value, perUnit, show) {
      const length = Math.min(3.2, Math.abs(value) * perUnit);
      arrow.visible = show && length > 0.06;
      if (arrow.visible) { arrow.position.set(x, y, 0); arrow.setLength(Math.max(0.32, length)); arrow.aim(value > 0 ? RIGHT : LEFT); }
    }
    // an arrow lying over the bench: from (x, y) towards (ux, uy), a unit vector
    function lay(arrow, x, y, ux, uy, size, show) {
      const length = Math.min(3.2, size);
      arrow.visible = show && length > 0.06;
      if (arrow.visible) { arrow.position.set(x, 0.5, -y); arrow.setLength(Math.max(0.32, length)); arrow.aim(aimAt.set(ux, 0, -uy)); }
    }
    const pairText = (x, y, text) => `(${text(x)}, ${text(y)})`;
    function drawDiscs(v, ready) {
      const sticky = setup.bumper === 'sticky', both = v.velocityArrow && v.momentumArrow ? 0.16 : 0, total = [0, 0];
      discs.forEach((d, i) => {
        d.group.position.set(d.x, 0, -d.y); d.group.rotation.y = run.joined ? pair.turn : 0;
        d.springy.visible = !sticky; d.sticky.visible = sticky;
        const [cx, cy] = way(d), vx = ready ? cx * d.speed : d.vx, vy = ready ? cy * d.speed : d.vy, m = mass(d);   // before the start: the velocity it will set off with
        const speed = Math.hypot(vx, vy), ux = speed > 1e-6 ? vx / speed : cx, uy = speed > 1e-6 ? vy / speed : cy;
        total[0] += m * vx; total[1] += m * vy;
        // side by side when both are shown: velocity on the right of the way it goes, momentum on the left
        lay(d.arrows.velocity, d.x + uy * both, d.y - ux * both, ux, uy, speed * 0.18, v.velocityArrow);
        lay(d.arrows.momentum, d.x - uy * both, d.y + ux * both, ux, uy, m * speed * 0.14, v.momentumArrow);
        const side = i ? 1 : -1;   // the push on A points away from B, the push on B away from A
        lay(d.arrows.force, d.x, d.y, side * run.normal[0], side * run.normal[1], run.force / 220, v.pairForce && run.force > 0);
        d.label.show(v.numbers);
        if (v.numbers) {
          d.spot.set(d.x, i ? 0.1 : 1.3, -d.y);   // A: clear of its pile of weights
          d.label.write(`<b>${d.name}</b>  ${m.toFixed(1)} kg<br>v = ${pairText(vx, vy, speedText)} m/s<br>p = ${pairText(m * vx, m * vy, signed)} kg·m/s`);
        }
        const aiming = ready && d.speed > 0;
        d.ring.visible = aiming; d.ring.position.set(d.home.x, 0.004, -d.home.y);
        d.aim.visible = aiming; d.trail.visible = v.trail;
        if (aiming) {   // dashes from the disc along the way it will go, as far as the frame
          let n = 0;
          for (let s = DISC.r + 0.25; n < 60; s += 0.36, n++) {
            const x = d.x + cx * s, y = d.y + cy * s;
            if (Math.abs(x) > FIELD.x + DISC.r || Math.abs(y) > FIELD.y + DISC.r) break;
            dummy.position.set(x, 0.01, -y); dummy.rotation.y = d.angle * Math.PI / 180; dummy.updateMatrix(); d.aim.setMatrixAt(n, dummy.matrix);
          }
          d.aim.count = n; d.aim.instanceMatrix.needsUpdate = true;
        }
      });
      const mA = mass(DA), mB = mass(DB), x = (mA * DA.x + mB * DB.x) / (mA + mB), y = (mA * DA.y + mB * DB.y) / (mA + mB), size = Math.hypot(total[0], total[1]);
      lay(sum, x, y, size > 1e-6 ? total[0] / size : 1, size > 1e-6 ? total[1] / size : 0, size * 0.14, v.momentumArrow);
      centre.visible = v.centre; centre.position.set(x, -0.5, -y);
    }
    toStart();
    return {
      carts, discs, pair, run, setup,
      update(dt) {
        if (stopSoon) { stopSoon = false; ctx.setPlaying(false); }
        if (tipTime > 0) { tipTime -= dt; if (tipTime <= 0) { tip.show(false); moved = true; } }
        const v = ctx.values, onBench = plane(), ready = run.state === 'ready';
        rail.visible = !onBench; flat.visible = onBench; things.visible = !onBench;
        const pressed = run.contact ? Math.max(0, run.touch - (B.x - A.x)) : 0, total = mass(A) + mass(B);
        for (const cart of carts) {
          cart.group.visible = !onBench; cart.group.position.x = cart.x;
          const spring = apart() ? cart === A : setup.bumper === 'spring';
          cart.springy.visible = spring; cart.sticky.visible = !apart() && !spring; cart.pin.visible = apart() && cart === A;
          // the spring is as long as the room it has: pressed before a push apart, squeezed during a collision
          cart.springy.scale.y = apart() ? Math.max(0.12, Math.min(1, (B.x - A.x - CART.half * 2 - 0.04) / 0.36)) : Math.max(0.15, 1 - pressed / 2 / 0.36);
          const speed = ready && !apart() ? cart.side * cart.speed : cart.v, m = mass(cart), on = !onBench;   // before the start: the velocity it will set off with
          point(cart.arrows.velocity, cart.x, 2.35, speed, 0.13, on && v.velocityArrow);
          point(cart.arrows.momentum, cart.x, 2.7, m * speed, 0.085, on && v.momentumArrow);
          point(cart.arrows.force, cart.x, 0.78, (cart === A ? -1 : 1) * run.force, 1 / 220, on && v.pairForce && run.force > 0);
          cart.label.show(on && v.numbers);
          if (on && v.numbers) {
            cart.spot.set(cart.x, cart === B && B.x - A.x < 3 ? 4.05 : 3.05, 0);   // close together, the reading of B steps up clear of A's
            cart.label.write(`<b>${cart.name}</b>  ${m.toFixed(1)} kg<br>v = ${speedText(speed)} m/s<br>p = ${signed(m * speed)} kg·m/s`);
          }
        }
        if (onBench) drawDiscs(v, ready);
        else {
          for (const d of discs) d.label.show(false);
          centre.visible = v.centre; centre.position.set((mass(A) * A.x + mass(B) * B.x) / total, 0, 0);
        }
        const changed = moved;
        moved = false;
        return changed;
      },
    };
  },
};
