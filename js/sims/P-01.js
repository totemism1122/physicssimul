// P-01 Equilibrium and stability (3D), two arrangements chosen in the menu of variables.
//
// The lever: a bar on a support with two piles of wooden blocks, A and B, after the textbook's activity
// "levelling a lever" (blocks of equal weight, distances measured from the support).
// Torque = distance from the support x weight; anticlockwise counts as positive, as in the textbook.
// The bar is a metre rule: the places of the piles and of the support are read on it from its left end, and each
// may be anywhere along it, independently of the others. What matters for the torque, the distance from the
// support, is shown in the scene.
//
// Centre of gravity and stability: an object of blocks that is tipped by hand and let go (the textbook's figure of
// an object falling back or falling over). It falls over once the vertical through its centre of gravity has left
// its base. It is taken not to slide (it stands on a rubber mat).
//
// Things are worked by hand in the scene; what is set that way can be set from the menu as well, over the same
// ranges and in the same steps, and the two always show the same values.
// Lengths in the scene are life-size: one unit is 10 cm, so the bar of 1 m is 10 units long.
const RED = '#e58373', BLUE = '#7fa6e6', GOLD = '#e3c26b', GREY = '#b9bfce', GREEN = '#7fc7a0';
// a number with its sign, as it is written on screen: +0.20, −0.20, 0.00
const signed = (value, digits = 2) => { const s = Math.abs(value).toFixed(digits); return Number(s) === 0 ? s : (value > 0 ? '+' : '−') + s; };
const greek = (letter) => `<i style="font-family: Georgia, serif">${letter}</i>`;   // the Korean face draws Greek letters full width
const TAU = greek('τ'), THETA = greek('θ');
const cm = (value) => Math.round(value * 100) / 100;   // places go in steps of 1 cm
const onLever = (values) => values.scene === 'lever', onBoard = (values) => values.scene === 'tilt';   // which arrangement an item of a menu belongs to
const MOST = 5, GAP = 0.05;                                // blocks in a pile at most; two piles sit at least a block's width apart
const COUNT = { kind: 'slider', min: 0, max: MOST, step: 1, unit: '개', when: onLever }, PLACE = { kind: 'slider', min: 0.03, max: 0.97, step: 0.01, digits: 2, unit: ' m', when: onLever };
const LEAN = 60;                                           // the object is tipped by this many degrees at most
// the three objects of the textbook: the height of the centre of gravity (cm) of each
const KINDS = { ga: 6, na: 8, da: 4 }, NAMES = { ga: '(가)', na: '(나)', da: '(다)' };

export default {
  // what is taken for granted, written on screen by the frame
  premise: (v) => (v.scene === 'tilt' ? '물체는 받침 위에서 미끄러지지 않는다고 봅니다' : '막대는 굵기와 재질이 고르다고 봅니다'),
  fixedViews: ['front', 'top'],
  camera: { target: [0, 1.7, 0], r: 13, theta: 0.3, phi: 1.2, rMax: 30 },
  charts: {
    // torques about the support (N·m) and forces on the bar (N, upward positive); the last bar of each is the sum
    torque: { names: ['A', 'B', '막대', '합'], colors: [RED, BLUE, GREY, GOLD], groups: ['N·m'], range: 0.5, read: (t) => signed(t) },
    force: { names: ['A', 'B', '막대', '받침점', '합'], colors: [RED, BLUE, GREY, GREEN, GOLD], groups: ['N'], range: 5, read: (f) => signed(f, 1) },
    // the smallest tilt from which each object fell over when let go
    tip: { names: ['넘어진 가장 작은 각'], colors: [GOLD], groups: ['(가)', '(나)', '(다)'], signed: false, range: 45, read: (a) => `${a}°` },
  },
  menus: {
    vars: [
      { id: 'scene', label: '장면 선택', kind: 'choice', value: 'lever', options: [{ id: 'lever', label: '지레' }, { id: 'tilt', label: '무게 중심과 안정성' }] },
      { id: 'aCount', label: 'A 나무 도막', value: 1, ...COUNT }, { id: 'aPos', label: 'A의 위치', value: 0.3, ...PLACE },
      { id: 'bCount', label: 'B 나무 도막', value: 2, ...COUNT }, { id: 'bPos', label: 'B의 위치', value: 0.75, ...PLACE },
      { id: 'pivot', label: '받침점의 위치', kind: 'slider', min: 0, max: 1, step: 0.01, value: 0.5, digits: 2, unit: ' m', when: onLever, advanced: true },
      { id: 'barWeight', label: '막대의 무게', kind: 'slider', min: 1, max: 4, step: 0.5, value: 2, digits: 1, unit: ' N', when: onLever, advanced: true },
      { id: 'object', label: '물체', kind: 'choice', value: 'ga', when: onBoard, options: Object.keys(KINDS).map((id) => ({ id, label: NAMES[id] })) },
      { id: 'baseWidth', label: '받침면의 너비', kind: 'slider', min: 4, max: 10, step: 1, value: 6, unit: ' cm', when: onBoard },
      { id: 'lean', label: '기울인 각', kind: 'slider', min: 0, max: LEAN, step: 1, value: 0, unit: '°', when: onBoard },
      { id: 'cgHeight', label: '무게 중심의 높이', kind: 'slider', min: 4, max: 8, step: 0.1, value: 6, digits: 1, unit: ' cm', when: onBoard, advanced: true },
    ],
    graph: [
      { id: 'torque', label: '돌림힘 막대', kind: 'graph', bars: 'torque', when: onLever },
      { id: 'force', label: '힘 막대', kind: 'graph', bars: 'force', when: onLever, advanced: true },
      { id: 'tip', label: '넘어진 각', kind: 'graph', bars: 'tip', when: onBoard },
    ],
    time: [
      { id: 'slow', label: '느리게', kind: 'toggle' },
      { id: 'reset', label: '처음으로', kind: 'action' },
      { id: 'step', label: '한 단계씩', kind: 'action', advanced: true },
    ],
    layers: [
      { id: 'forces', label: '힘 화살표', kind: 'toggle', when: onLever },
      { id: 'arms', label: '거리', kind: 'toggle', when: onLever },
      { id: 'support', label: '떠받치는 힘', kind: 'toggle', when: onLever },
      { id: 'centre', label: '무게 중심', kind: 'toggle', when: onBoard },
      { id: 'gravity', label: '중력과 연직선', kind: 'toggle', when: onBoard },
      { id: 'base', label: '받침면', kind: 'toggle', when: onBoard },
      { id: 'numbers', label: '값', kind: 'toggle' },
      { id: 'barCentre', label: '막대의 무게 중심', kind: 'toggle', when: onLever, advanced: true },
      { id: 'critical', label: '넘어지는 각', kind: 'toggle', when: onBoard, advanced: true },
    ],
    inquiry: [
      { id: 'table', label: '기록 표', kind: 'table', wide: true, when: onLever, text: '지레 막대가 수평을 이룰 때마다 한 줄씩 적힙니다. 거리는 받침점에서 잰 것입니다.',
        columns: [{ label: 'A 무게', unit: 'N' }, { label: 'A 거리', unit: 'm' }, { label: 'A 돌림힘', unit: 'N·m', result: true },
          { label: 'B 무게', unit: 'N' }, { label: 'B 거리', unit: 'm' }, { label: 'B 돌림힘', unit: 'N·m', result: true },
          { label: '막대 돌림힘', unit: 'N·m', result: true, advanced: true }] },
      { id: 'tipTable', label: '기록 표', kind: 'table', wide: true, when: onBoard, text: '기울인 물체를 놓을 때마다 한 줄씩 적힙니다. 물체는 고무판 위에서 미끄러지지 않습니다.',
        columns: [{ label: '물체' }, { label: '무게 중심', unit: '높이 cm' }, { label: '받침면', unit: '너비 cm' }, { label: '기울인 각', unit: '°' }, { label: '결과', result: true }] },
    ],
  },

  // writing on the chalkboard (1024 x 400)
  board(g) {
    g.fillStyle = 'rgba(255,255,255,0.9)'; g.font = '56px Georgia, serif'; g.fillText('평형과 안정성', 60, 96);
    g.font = 'italic 60px Georgia, serif'; g.fillText('τ = r × F', 60, 200);
    g.fillText('aF', 60, 310); g.fillText('= bF', 190, 310);
    g.font = 'italic 34px Georgia, serif'; g.fillText('1', 136, 326); g.fillText('2', 330, 326);
    g.strokeStyle = 'rgba(255,255,255,0.8)'; g.lineWidth = 5;
    g.beginPath(); g.moveTo(560, 230); g.lineTo(940, 230); g.moveTo(700, 236); g.lineTo(660, 310); g.lineTo(740, 310); g.closePath(); g.stroke();
    g.strokeRect(580, 170, 56, 56); g.strokeRect(860, 170, 56, 56); g.strokeRect(860, 114, 56, 56);
  },

  // Builds the apparatus on the bench (world) and returns { update(dt) }.
  create({ T, kit, world, view, ctx }) {
    const { mat, glow, add, box, canvasTexture, letterTexture } = kit;
    const G = 9.8, RAD = Math.PI / 180, DOWN = new T.Vector3(0, -1, 0);
    const M = { bar: mat(0xe6cda3), wood: mat(0xd2b084), ghost: new T.MeshStandardMaterial({ color: 0x8f6040, roughness: 1, transparent: true, opacity: 0.22, depthWrite: false }) };
    const lever = () => ctx.values.scene === 'lever';
    const tallScreen = () => window.matchMedia('(max-aspect-ratio: 4/5)').matches;
    // the mark of a centre of gravity: a disc in four quarters, always facing the viewer and never hidden
    const centreMark = (size) => {
      const sprite = new T.Sprite(new T.SpriteMaterial({ depthTest: false, map: canvasTexture(64, 64, (g) => {
        g.fillStyle = '#fff'; g.beginPath(); g.arc(32, 32, 29, 0, 7); g.fill(); g.fillStyle = '#1d2440';
        for (const a of [0, Math.PI]) { g.beginPath(); g.moveTo(32, 32); g.arc(32, 32, 29, a, a + Math.PI / 2); g.fill(); }
        g.strokeStyle = '#1d2440'; g.lineWidth = 5; g.beginPath(); g.arc(32, 32, 29, 0, 7); g.stroke();
      }) }));
      sprite.scale.set(size, size, 1); sprite.renderOrder = 11; sprite.visible = false; return sprite;
    };
    // a thin line drawn over everything, like a line on a diagram; it runs up from its position and is stretched to length
    const rule = (color) => { const line = new T.Mesh(box(0.028, 1, 0.028).translate(0, 0.5, 0), new T.MeshBasicMaterial({ color, depthTest: false, transparent: true, opacity: 0.85 })); line.renderOrder = 10; return line; };

    // ---------- state shared by the two arrangements ----------
    // auto: the demonstration is under way.  frozen: it was paused, so the instant is held until something is handled.
    let moved = true, playing = false, auto = false, frozen = false, ended = false, stopSoon = false, byDemo = false, resetting = false, tipTime = 0;
    const demo = { wait: 0, time: 0, search: false };
    const tipSpot = new T.Vector3(), tip = view.label(tipSpot);   // what is being set, while something is handled
    function say(text, x, y, seconds = 0) { tip.write(text); tipSpot.set(x, y, 0); tip.show(true); tipTime = seconds; moved = true; }
    const ray = new T.Raycaster(), upright = new T.Plane(new T.Vector3(0, 0, 1), 0), hit = new T.Vector3();

    // ====================================== the lever ======================================
    const BLOCK = 1;                                            // one block weighs 1 N
    const H = 0.9, BAR = { len: 10, thick: 0.16, deep: 0.9 }, CUBE = 0.5;
    const NEWTON = 0.3;                                         // length of a force arrow for 1 N
    const STEEPEST = 0.45;                                      // the bar never tilts further than this (rad), even on a support near its end
    const INK = { a: 0xd9584a, b: 0x3f6fd0, bar: 0x6b7280, support: 0x1f9d6b, arm: 0x1d2440 };

    // ---------- a support, a metre rule for a bar, two piles of blocks ----------
    const rig = new T.Group(); world.add(rig);
    const wedge = new T.Shape(); wedge.moveTo(-0.62, 0); wedge.lineTo(0.62, 0); wedge.lineTo(0, H); wedge.closePath();
    const prism = new T.ExtrudeGeometry(wedge, { depth: 0.8, bevelEnabled: false }); prism.translate(0, 0, -0.4);
    const fulcrum = add(rig, prism, M.wood, 0, 0, 0);
    const bar = new T.Group(); bar.position.y = H; rig.add(bar);                 // turns about the top edge of the support
    const beam = new T.Group(); bar.add(beam);                                   // the bar itself, which keeps its place when the support is moved
    add(beam, box(BAR.len, BAR.thick, BAR.deep), M.bar, 0, BAR.thick / 2, 0);
    // the scale reads in cm from the left end of the bar
    const ticks = (tall, numbers) => canvasTexture(2048, tall, (g, w, h) => {
      g.fillStyle = '#ecd6ae'; g.fillRect(0, 0, w, h); g.strokeStyle = g.fillStyle = '#5b4a36';
      g.font = '700 28px Helvetica, Arial, sans-serif'; g.textAlign = 'center';
      for (let c = 0; c <= 100; c++) {
        const x = Math.min(w - 2, Math.max(2, c / 100 * w)), long = c % 10 === 0 ? 0.5 : c % 5 === 0 ? 0.36 : 0.2;
        g.lineWidth = c % 10 === 0 ? 3.5 : 2; g.beginPath(); g.moveTo(x, h); g.lineTo(x, h * (1 - long)); g.stroke();
        if (numbers && c % 10 === 0 && c > 0 && c < 100) g.fillText(String(c), x, 26);
      }
    });
    add(beam, new T.PlaneGeometry(BAR.len, 0.3), mat(0xffffff, { map: ticks(64, true) }), 0, BAR.thick + 0.003, BAR.deep / 2 - 0.15, false).rotation.x = -Math.PI / 2;
    add(beam, new T.PlaneGeometry(BAR.len, BAR.thick), mat(0xffffff, { map: ticks(32, false) }), 0, BAR.thick / 2, BAR.deep / 2 + 0.003, false);
    const barCentre = centreMark(0.3); barCentre.position.set(0, BAR.thick / 2, BAR.deep / 2 + 0.01); beam.add(barCentre);

    // The blocks are alike in weight and shape; a letter on each tells the two piles apart, and dark edges the blocks of a pile.
    const armMat = glow(INK.arm), cube = box(CUBE, CUBE, CUBE), cubeEdges = new T.EdgesGeometry(cube), edgeMat = new T.LineBasicMaterial({ color: 0x5b3a26 });
    const tagGeo = new T.PlaneGeometry(0.34, 0.34);
    const piles = [['a', 'A', 0x8f6040, -0.17], ['b', 'B', 0x9b6a45, -0.31]].map(([key, name, wood, armY]) => {
      const group = new T.Group(); group.position.y = BAR.thick; bar.add(group);
      const tagMat = new T.MeshBasicMaterial({ map: letterTexture(name), transparent: true });
      const blocks = Array.from({ length: MOST }, (_, i) => {
        const block = add(group, cube, mat(wood), 0, CUBE / 2 + i * CUBE + 0.002, 0); block.add(new T.LineSegments(cubeEdges, edgeMat));
        for (const [z, turn] of [[1, 0], [-1, Math.PI]]) { const tag = new T.Mesh(tagGeo, tagMat); tag.position.z = z * (CUBE / 2 + 0.004); tag.rotation.y = turn; block.add(tag); }
        const top = new T.Mesh(tagGeo, tagMat); top.position.y = CUBE / 2 + 0.004; top.rotation.x = -Math.PI / 2; block.add(top);
        return block;
      });
      const ghost = add(group, cube, M.ghost, 0, CUBE / 2, 0, false, false);   // an empty place: drag upwards to put a block there
      const handle = add(group, box(0.95, 1, 0.95), M.ghost, 0, 0, 0, false, false); handle.visible = false;   // what is caught hold of: a little larger than the pile
      const arm = add(bar, box(1, 0.035, 0.035), armMat, 0, armY, BAR.deep / 2 + 0.05, false, false), end = add(bar, box(0.035, 0.2, 0.035), armMat, 0, armY, BAR.deep / 2 + 0.05, false, false);
      const arrow = kit.arrow(INK[key], 0.04); rig.add(arrow);
      const p = { name, count: `${key}Count`, pos: `${key}Pos`, group, blocks, ghost, handle, arm, end, armY, arrow,
        force: 0, far: 0, torque: 0, spot: new T.Vector3(), armSpot: new T.Vector3() };
      handle.userData.grip = { kind: 'pile', pile: p };
      p.label = view.label(p.spot, true, 0.35); p.armLabel = view.label(p.armSpot, false, -0.12);
      return p;
    });
    piles[0].other = piles[1]; piles[1].other = piles[0];
    const pivotEnd = add(bar, box(0.035, 0.38, 0.035), armMat, 0, -0.24, BAR.deep / 2 + 0.05, false, false);
    fulcrum.userData.grip = { kind: 'pivot' };
    const barArrow = kit.arrow(INK.bar, 0.04), supportArrow = kit.arrow(INK.support, 0.04); rig.add(barArrow, supportArrow);
    const barSpot = new T.Vector3(), barLabel = view.label(barSpot, true, -1.05), supportSpot = new T.Vector3(), supportLabel = view.label(supportSpot);

    // ---------- physics: the two conditions of equilibrium ----------
    // Torques about the support, anticlockwise positive: a weight F at x, with the support at x0, turns the bar by
    // (x0 − x) F, that is, distance from the support x weight, positive on the left of the support. The bar's own
    // weight acts at its centre of gravity, the middle of the bar.
    // Forces on the bar: the weights downward and the support's push upward, which is as large as all the weights together.
    const S = {};
    function weigh() {
      const v = ctx.values;
      S.x0 = v.pivot; S.W = v.barWeight; S.bar = (S.x0 - 0.5) * S.W;
      let sum = S.bar, inertia = S.W * (1 / 12 + (S.x0 - 0.5) ** 2);            // the bar is 1 m long
      for (const p of piles) {
        p.force = v[p.count] * BLOCK; p.far = Math.abs(cm(S.x0 - v[p.pos])); p.torque = cm(S.x0 - v[p.pos]) * p.force;
        sum += p.torque; inertia += p.force * p.far * p.far;
      }
      S.net = Math.round(sum * 1000) / 1000;                                    // the values go in steps, so a balance is exact
      S.push = piles[0].force + piles[1].force + S.W;
      S.inertia = inertia / G;                                                  // kg m^2
      ctx.charts.torque.set(0, [piles[0].torque, piles[1].torque, S.bar, S.net]);
      ctx.charts.force.set(0, [-piles[0].force, -piles[1].force, -S.W, S.push, 0]);
    }
    // The place nearest x that is on the bar and clear of the other pile; toward: the side to take when x falls on that pile (else the nearer side).
    function clear(x, other, toward) {
      const to = cm(Math.max(PLACE.min, Math.min(PLACE.max, x)));
      if (Math.abs(to - other) > GAP - 0.005) return to;
      const side = toward || (to >= other ? 1 : -1), beside = cm(other + side * GAP);
      return beside < PLACE.min || beside > PLACE.max ? cm(other - side * GAP) : beside;
    }

    // The bar turns towards the larger torque until an end rests on the bench; with the torques in balance it comes
    // to rest level. How fast it turns is kept within bounds, so that a small difference shows as clearly as a large one.
    let theta = 0, omega = 0, noted = '';
    const rest = (arm) => (arm * 10 > H ? Math.min(STEEPEST, Math.asin((H - 0.03) / (arm * 10))) : STEEPEST);   // the tilt at which an end, arm metres from the support, meets the bench
    function swing(dt) {
      const top = rest(S.x0), low = -rest(1 - S.x0);
      for (let n = Math.ceil(dt / 0.004), h = dt / n, i = 0; i < n; i++) {
        if (S.net === 0) omega += (-25 * theta - 10 * omega) * h;
        else omega += (Math.sign(S.net) * Math.min(12, Math.max(1.5, Math.abs(S.net) * Math.cos(theta) / S.inertia)) - 0.6 * omega) * h;
        theta += omega * h;
        if (theta >= top) { theta = top; omega = Math.min(0, omega); } else if (theta <= low) { theta = low; omega = Math.max(0, omega); }
      }
      if (S.net === 0 && Math.abs(theta) < 2e-4 && Math.abs(omega) < 2e-3) theta = omega = 0;
    }
    function place() {   // every part where the values say
      const v = ctx.values, px = (v.pivot - 0.5) * 10;
      fulcrum.position.x = bar.position.x = px; beam.position.x = -px;
      for (const p of piles) {
        const n = v[p.count], x = (v[p.pos] - v.pivot) * 10;
        p.group.position.x = x; p.blocks.forEach((block, i) => { block.visible = i < n; }); p.ghost.visible = n === 0;
        p.handle.scale.y = Math.max(1, n) * CUBE + 0.3; p.handle.position.y = p.handle.scale.y / 2;
        p.arm.scale.x = Math.max(0.001, Math.abs(x)); p.arm.position.x = x / 2; p.end.position.x = x;
      }
      moved = true;
    }
    function note() {   // one line in the table each time the bar has come to rest level with blocks in both piles
      const [a, b] = piles;
      if (S.net !== 0 || theta !== 0 || !a.force || !b.force) return;
      const row = [a.force.toFixed(1), a.far.toFixed(2), signed(a.torque), b.force.toFixed(1), b.far.toFixed(2), signed(b.torque), signed(S.bar)];
      if (row.join() === noted && ctx.tables.table.rows.length) return;   // the same arrangement is not written twice, unless the table has been wiped since
      noted = row.join(); ctx.tables.table.add(row);
    }

    // ---------- handling: a pile goes sideways along the bar or grows and shrinks; the support slides (advanced) ----------
    const level = new T.Plane(new T.Vector3(0, 1, 0), -H);
    // where the pointer is: along the bar (x) and "up" (height, or away from the viewer when seen from above)
    function pointer(r) {
      if (Math.abs(r.direction.z) > 0.25 && r.intersectPlane(upright, hit)) return { x: hit.x, up: hit.y, rise: CUBE };
      return r.intersectPlane(level, hit) ? { x: hit.x, up: -hit.z, rise: 0.8 } : null;
    }
    const topOf = (p) => H + BAR.thick + Math.max(1, ctx.values[p.count]) * CUBE + 0.75;
    const sceneX = (p) => bar.position.x + p.group.position.x;   // where a pile stands on the bench, the bar being nearly level
    let grab = null;
    const leverTool = {
      pick(r) {
        rig.updateMatrixWorld(true);
        const found = ray.intersectObjects(ctx.advanced ? [piles[0].handle, piles[1].handle, fulcrum] : [piles[0].handle, piles[1].handle], false)[0];
        return found ? found.object.userData.grip : null;
      },
      start(grip, r) {
        const at = pointer(r);
        if (!at) return false;
        ctx.setPlaying(false); auto = frozen = false;
        const p = grip.pile;
        grab = { ...grip, from: at, unsure: Boolean(p), count: p ? ctx.values[p.count] : 0, offset: at.x - (p ? sceneX(p) : bar.position.x) };
        return true;
      },
      move(r) {
        const at = pointer(r), v = ctx.values;
        if (!at) return;
        const x = (at.x - grab.offset) / 10 + 0.5;   // the place on the bar under the pointer, in metres from its left end
        if (grab.kind === 'pivot') {
          if (ctx.locked.has('pivot')) { say('잠금', bar.position.x, H + 1.6); return; }
          const to = cm(Math.max(0, Math.min(1, x)));
          if (to !== v.pivot) ctx.set('pivot', to);
          say(`${v.pivot.toFixed(2)} m`, bar.position.x, H + 1.6);
          return;
        }
        const p = grab.pile;
        if (grab.unsure) {   // up or down: how many blocks; sideways: where the pile sits
          if (Math.hypot(at.x - grab.from.x, at.up - grab.from.up) < 0.12) return;
          grab.unsure = false; grab.kind = Math.abs(at.x - grab.from.x) > Math.abs(at.up - grab.from.up) ? 'slide' : 'count';
        }
        const id = grab.kind === 'slide' ? p.pos : p.count;
        if (ctx.locked.has(id)) { say('잠금', sceneX(p), topOf(p)); return; }
        if (grab.kind === 'slide') {   // a pile passes over the other one by stepping to its far side
          const to = clear(x, v[p.other.pos], x >= v[p.other.pos] ? 1 : -1);
          if (to !== v[id]) ctx.set(id, to);
          say(`받침점에서 ${p.far.toFixed(2)} m`, sceneX(p), topOf(p));
        } else {
          const to = Math.max(0, Math.min(MOST, grab.count + Math.round((at.up - grab.from.up) / at.rise)));
          if (to !== v[id]) ctx.set(id, to);
          say(`${v[id]}개`, sceneX(p), topOf(p));
        }
      },
      end() {},
    };

    // ---------- automatic demonstration: pile B goes from the left end of the bar to the right end, 1 cm at a time,
    // stepping over pile A, and waits a moment wherever the torques are in balance ----------
    function leverDemo() {
      const B = piles[1];
      if (!ctx.values.bCount || ctx.locked.has('bPos')) {
        say(ctx.values.bCount ? 'B의 위치 · 잠금' : 'B에 나무 도막을 올리세요', sceneX(B), topOf(B), 2.5);
        stopSoon = true; return false;
      }
      auto = true; demo.time = 0; demo.wait = 0.6;
      const first = clear(PLACE.min, ctx.values.aPos, 1);
      byDemo = true; if (ctx.values.bPos !== first) ctx.set('bPos', first); byDemo = false;
      return true;
    }
    function leverTick(dt) {
      if (demo.wait > 0) demo.wait -= dt;
      else {
        demo.time += dt;
        while (auto && demo.time >= 0.12) {
          demo.time -= 0.12;
          const next = clear(ctx.values.bPos + 0.01, ctx.values.aPos, 1);
          if (next <= ctx.values.bPos) { auto = false; stopSoon = true; break; }     // the far end: the demonstration is over
          byDemo = true; ctx.set('bPos', next); byDemo = false;
          if (S.net === 0) { demo.wait = 2; demo.time = 0; break; }
        }
      }
      if (frozen) swing(dt);
    }
    const LEVER = ['aCount', 'aPos', 'bCount', 'bPos', 'pivot', 'barWeight'];
    const START = Object.fromEntries(LEVER.map((id) => [id, ctx.values[id]]));
    function leverReset() {   // the starting arrangement, all at once
      resetting = true;
      for (const one of LEVER) if (!ctx.locked.has(one) && ctx.values[one] !== START[one]) ctx.set(one, START[one]);
      resetting = false;
      // a locked pile may be in the way: the one that is not locked steps aside
      for (const p of [...piles].sort((a, b) => ctx.locked.has(a.pos) - ctx.locked.has(b.pos))) { const to = clear(ctx.values[p.pos], ctx.values[p.other.pos]); if (to !== ctx.values[p.pos]) ctx.set(p.pos, to); }
      theta = omega = 0; weigh(); place();
    }
    function leverChange(id) {
      if (resetting) return;
      for (const p of piles) if (id === p.pos) {   // a pile set from the menu steps over the other one too
        const to = clear(ctx.values[id], ctx.values[p.other.pos]);
        if (to !== ctx.values[id]) { ctx.set(id, to); return; }
      }
      weigh(); place();
    }

    // ---------- the marks and readings of the lever ----------
    const at = (x, y, out) => { const c = Math.cos(theta), s = Math.sin(theta); return out.set(bar.position.x + x * c - y * s, H + x * s + y * c, 0); };   // a point of the bar, in the scene
    function leverMark() {
      const v = ctx.values, on = lever(), bx = -(S.x0 - 0.5) * 10;   // bx: the middle of the bar, measured along it from the support
      bar.rotation.z = theta;
      for (const p of piles) {
        const n = v[p.count], x = p.group.position.x;
        p.arrow.visible = v.forces && n > 0;
        if (p.arrow.visible) { at(x, BAR.thick + n * CUBE / 2, p.arrow.position); p.arrow.setLength(NEWTON * p.force); p.arrow.aim(DOWN); }
        p.arm.visible = p.end.visible = v.arms;
        p.armLabel.show(on && v.arms);
        if (v.arms) { at(x / 2, p.armY - 0.12, p.armSpot); p.armLabel.write(`${p.far.toFixed(2)} m`); }
        p.label.show(on && v.numbers);
        if (v.numbers) {
          at(x, BAR.thick + Math.max(1, n) * CUBE, p.spot);
          p.label.write(`<b>${p.name}</b>  ${p.force.toFixed(1)} N<br>받침점에서 ${p.far.toFixed(2)} m<br>${TAU} = ${signed(p.torque)} N·m`);
        }
      }
      if (v.numbers) {   // the two readings keep clear of each other when the piles are close together
        const [a, b] = piles, left = a.spot.x <= b.spot.x ? a : b, right = left.other, short = 4.6 - (right.spot.x - left.spot.x);
        if (short > 0) { left.spot.x -= short / 2; right.spot.x += short / 2; }
      }
      pivotEnd.visible = v.arms;
      barArrow.visible = v.forces;
      if (v.forces) { at(bx, BAR.thick / 2, barArrow.position); barArrow.setLength(NEWTON * S.W); barArrow.aim(DOWN); }
      barCentre.visible = v.barCentre;
      const barNote = on && v.numbers && (ctx.advanced || v.forces);
      barLabel.show(barNote);
      if (barNote) { at(bx, 0, barSpot); barLabel.write(`<b>막대</b>  ${S.W.toFixed(1)} N<br>${TAU} = ${signed(S.bar)} N·m`); }
      supportArrow.visible = v.support; supportLabel.show(on && v.support);
      if (v.support) {
        supportArrow.position.set(bar.position.x, H, 0); supportArrow.setLength(NEWTON * S.push);
        supportSpot.set(bar.position.x, H + NEWTON * S.push + 0.1, 0); supportLabel.write(`떠받치는 힘 <b>${S.push.toFixed(1)} N</b>`);
      }
    }

    // ====================================== centre of gravity and stability ======================================
    // The object stands on a rubber mat, so it turns about an edge of its base without sliding. It is 12 cm tall and
    // made of light green blocks with a band of heavy white ones 4 cm thick, as heavy again as the whole green part:
    // with the middle of the band at height y, the centre of gravity is at 3 + y / 2 cm (4 to 8 cm). The width of
    // the base can be changed. Tipped by hand and let go, it falls back on to its base or falls over.
    const MAT = 0.05, BODY = { tall: 1.2, deep: 0.5, band: 0.4 }, FRONT = BODY.deep / 2 + 0.09;
    const slab = new T.Group(); slab.visible = false; world.add(slab);
    add(slab, box(4.4, MAT, 1.7), mat(0x56635d), 0, MAT / 2, 0);   // the rubber mat
    const thing = new T.Group(); slab.add(thing);
    const bodyMesh = add(thing, box(1, BODY.tall, BODY.deep), mat(0xffffff, { map: canvasTexture(64, 192, (g, w, h) => {   // six rows of blocks
      g.fillStyle = '#3f9a5c'; g.fillRect(0, 0, w, h); g.strokeStyle = '#2b7343'; g.lineWidth = 3;
      for (let i = 0; i <= 6; i++) { g.beginPath(); g.moveTo(0, i * h / 6); g.lineTo(w, i * h / 6); g.stroke(); }
    }) }), 0, BODY.tall / 2, 0);
    const bandGeo = box(1, BODY.band, BODY.deep + 0.1), bandMesh = add(thing, bandGeo, mat(0xf4f1ea), 0, 0.6, 0);
    bandMesh.add(new T.LineSegments(new T.EdgesGeometry(bandGeo), new T.LineBasicMaterial({ color: 0x9a968c })));
    bodyMesh.userData.grip = { kind: 'thing' }; bandMesh.userData.grip = { kind: 'band' };
    const centre = centreMark(0.24); thing.add(centre);
    const weightArrow = kit.arrow(INK.a, 0.04), plumb = rule(INK.a), foot = new T.Mesh(new T.SphereGeometry(0.055, 12, 8), plumb.material); foot.renderOrder = 10;
    const baseStrip = add(slab, box(1, 0.02, BODY.deep + 0.24), new T.MeshBasicMaterial({ color: 0xe3a52b }), 0, MAT + 0.011, 0, false, false);
    const edges = [rule(INK.arm), rule(INK.arm)];
    slab.add(weightArrow, plumb, foot, ...edges);
    const infoSpot = new T.Vector3(), infoLabel = view.label(infoSpot, true), critSpot = new T.Vector3(), critLabel = view.label(critSpot, true);

    // ---------- physics: whether the tipped object falls back or falls over ----------
    // K: the object, from the values. w, h: width of the base and height of the centre of gravity (cm);
    // k2: the square of its radius of gyration about the centre of gravity (cm^2), for how fast it turns.
    const K = {};
    // falls: for each object tried (height of the centre of gravity / width of the base), the smallest tilt it fell over from
    const falls = new Map();
    function chartFalls() {   // the bars: the textbook's three objects on the present width of base, and the present object if it is none of them
      const chart = ctx.charts.tip, kinds = Object.keys(KINDS), least = (h) => (falls.has(`${h}/${K.w}`) ? [falls.get(`${h}/${K.w}`)] : null);
      chart.groups = kinds.map((kind) => NAMES[kind]); chart.values = kinds.map((kind) => least(KINDS[kind]));
      if (!kinds.some((kind) => KINDS[kind] === K.h)) { chart.groups.push(`${K.h.toFixed(1)} cm`); chart.values.push(least(K.h)); }
      chart.stamp++;
    }
    function shape() {
      const v = ctx.values, w = v.baseWidth, h = v.cgHeight, y = 2 * (h - 3);
      K.w = w; K.h = h; K.band = y;
      K.k2 = ((w * w + 144) / 12 + (6 - h) ** 2 + (w * w + 16) / 12 + (y - h) ** 2) / 2;
      K.critical = Math.atan(w / 2 / h);        // tan(angle) = half the width of the base / height of the centre of gravity
      chartFalls(); moved = true;
    }
    // psi: how far the object has turned from standing, anticlockwise positive: about its left edge (psi > 0) or its
    // right edge (psi < 0).  held: it is kept at that tilt (by the hand, or set from the menu) until it is let go.
    // trial: the tilt in degrees it was let go at, while the outcome is not yet known.
    const tilt = { psi: 0, spin: 0, down: false, held: false, side: 1, trial: 0 };
    let quiet = false;   // the tilt in the menu is being put back to 0 without touching the object
    // How far inside the edge it rests on the centre of gravity is (m). Negative: beyond the edge, so the weight turns
    // the object over; positive: the weight turns it back on to its base.
    const inside = (psi) => K.w / 200 * Math.cos(psi) - K.h / 100 * Math.sin(Math.abs(psi));
    function pose(deg) { tilt.psi = tilt.side * deg * RAD; tilt.spin = 0; tilt.down = false; tilt.held = deg > 0; tilt.trial = 0; moved = true; }
    function stand() {   // upright again; a tilt that is locked in the menu is taken up again instead
      if (ctx.locked.has('lean')) pose(ctx.values.lean);
      else if (ctx.values.lean !== 0) ctx.set('lean', 0);   // pose(0) follows from the change
      else pose(0);
    }
    function letGo() {
      if (!tilt.held) return;
      tilt.held = false; tilt.trial = Math.round(Math.abs(tilt.psi) / RAD); moved = true;
      if (Math.abs(inside(tilt.psi)) < 1e-9) tilt.spin = -tilt.side * 0.3;   // exactly over the edge it could go either way: it is taken to fall back
    }
    function outcome(fell) {   // every time it is let go: one line in the table, and the chart keeps the smallest tilt that tipped it over
      const v = ctx.values;
      if (tilt.trial) {
        ctx.tables.tipTable.add([NAMES[v.object] || '–', K.h.toFixed(1), String(K.w), String(tilt.trial), fell ? '넘어짐' : '되돌아옴']);
        if (fell) { const key = `${K.h}/${K.w}`; falls.set(key, Math.min(falls.get(key) || 99, tilt.trial)); chartFalls(); }
      }
      tilt.trial = 0;
      if (v.lean !== 0 && !ctx.locked.has('lean')) { quiet = true; ctx.set('lean', 0); quiet = false; }
      if (auto) { auto = false; stopSoon = true; }
    }
    // Let go, it turns about the edge it rests on. The weight's torque about that edge is M g x (inside), which brings
    // it back while the centre of gravity is above the base and tips it over once it is beyond the edge.
    function fall(dt) {
      if (tilt.held || tilt.down || (tilt.psi === 0 && tilt.spin === 0)) return;
      const about = K.k2 / 1e4 + (K.w / 200) ** 2 + (K.h / 100) ** 2;   // moment of inertia about the edge, per unit mass (m^2)
      for (let n = Math.ceil(dt / 0.002), step = dt / n, i = 0; i < n; i++) {
        const before = tilt.psi;
        tilt.spin += -Math.sign(before) * G * inside(before) / about * step; tilt.psi += tilt.spin * step; moved = true;
        if (Math.abs(tilt.psi) >= Math.PI / 2) { tilt.psi = Math.sign(tilt.psi) * Math.PI / 2; tilt.spin = 0; tilt.down = true; outcome(true); return; }   // it lies on its side
        if (before * tilt.psi <= 0) { tilt.psi = tilt.spin = 0; outcome(false); return; }                                                                // back on its base
      }
    }

    // ---------- handling: the object is tipped by hand and let go; the white band slides up and down ----------
    const onMat = (r) => (Math.abs(r.direction.z) < 0.25 || !r.intersectPlane(upright, hit) ? null : { u: hit.x, n: hit.y });   // the pointer on the upright plane through the object
    const turn = (a) => Math.atan2(Math.sin(a), Math.cos(a));
    const ABOVE = MAT + 2.2;   // where the writing goes while the object is handled
    const boardTool = {
      pick() {
        slab.updateMatrixWorld(true);
        const found = ray.intersectObjects([bandMesh, bodyMesh], false)[0];
        return !found ? null : tilt.down ? { kind: 'reset' } : found.object.userData.grip;
      },
      start(grip, r) {
        if (grip.kind === 'reset') { ctx.emit('action', 'reset'); return false; }   // a touch stands the fallen object up again
        const p = onMat(r);
        if (!p) return false;
        ctx.setPlaying(false); auto = frozen = false;
        grab = { ...grip, from: p, band: K.band / 10, unsure: grip.kind === 'band' && tilt.psi === 0 };
        if (grab.kind === 'band' && !grab.unsure) grab.kind = 'thing';
        if (grab.kind === 'thing') this.hold(p);
        return true;
      },
      hold(p) {   // where on the object it was caught hold of, in the object's own frame
        const dx = p.u - thing.position.x, dy = p.n - thing.position.y, c = Math.cos(tilt.psi), s = Math.sin(tilt.psi);
        grab.gx = dx * c + dy * s; grab.gy = Math.max(0.35, -dx * s + dy * c);
        tilt.held = true; tilt.spin = 0; tilt.trial = 0; tilt.down = false;
      },
      move(r) {
        const p = onMat(r), v = ctx.values;
        if (!p) return;
        if (grab.unsure) {   // up or down: the band; sideways: the object is tipped
          if (Math.hypot(p.u - grab.from.u, p.n - grab.from.n) < 0.1) return;
          grab.unsure = false;
          if (Math.abs(p.u - grab.from.u) > Math.abs(p.n - grab.from.n)) { grab.kind = 'thing'; this.hold(grab.from); }
        }
        if (grab.kind === 'band') {   // the band's height sets the height of the centre of gravity: 3 + y / 2 cm
          const y = Math.max(2, Math.min(10, (grab.band + p.n - grab.from.n) * 10)), id = ctx.advanced ? 'cgHeight' : 'object';
          if (ctx.locked.has(id)) { say('잠금', 0, ABOVE); return; }
          if (ctx.advanced) { const to = Math.round((3 + y / 2) * 10) / 10; if (to !== v.cgHeight) ctx.set('cgHeight', to); }
          else { const to = y < 4 ? 'da' : y > 8 ? 'na' : 'ga'; if (to !== v.object) ctx.set('object', to); }
          say(`무게 중심의 높이 ${v.cgHeight.toFixed(1)} cm`, 0, ABOVE);
          return;
        }
        // tipped by hand, a degree at a time: the object turns about whichever edge the pointer has taken it over
        if (ctx.locked.has('lean')) { say('잠금', 0, ABOVE); return; }
        const half = K.w / 20;
        const left = turn(Math.atan2(p.n - MAT, p.u + half) - Math.atan2(grab.gy, grab.gx + half));
        const right = turn(Math.atan2(p.n - MAT, p.u - half) - Math.atan2(grab.gy, grab.gx - half));
        const psi = left > 0 ? left : right < 0 ? right : 0, deg = Math.min(LEAN, Math.round(Math.abs(psi) / RAD));
        if (deg) tilt.side = psi > 0 ? 1 : -1;
        if (deg !== v.lean) ctx.set('lean', deg); else pose(deg);
        say(`${deg}°`, 0, ABOVE);
      },
      end() { if (grab && grab.kind === 'thing') letGo(); },   // let go, it sets off at once
    };

    // ---------- the play button: an object held at a tilt is let go; one that stands is tipped a degree at a time,
    // as if by a slow hand, until its centre of gravity has passed the edge and it falls over ----------
    function boardDemo() {
      if (tilt.held) { auto = true; demo.search = false; letGo(); return true; }
      if (ctx.locked.has('lean')) { say('기울인 각 · 잠금', 0, ABOVE, 2.5); stopSoon = true; return false; }
      auto = true; demo.search = true; demo.time = 0; demo.wait = 0.5;
      byDemo = true; stand(); byDemo = false;
      return true;
    }
    function boardTick(dt) {
      if (demo.search && !tilt.trial && !tilt.down) {
        if (demo.wait > 0) demo.wait -= dt;
        else {
          demo.time += dt;
          while (auto && !tilt.trial && demo.time >= 0.25) {
            demo.time -= 0.25;
            if (inside(tilt.psi) < 0 || ctx.values.lean >= LEAN) { letGo(); break; }
            byDemo = true; ctx.set('lean', ctx.values.lean + 1); byDemo = false;
          }
        }
      }
      if (frozen) fall(dt);
    }
    function boardChange(id, value) {
      const v = ctx.values;
      if (id === 'lean') { if (!quiet) pose(value); return; }
      if (id === 'object' && value && v.cgHeight !== KINDS[value]) { ctx.set('cgHeight', KINDS[value]); return; }
      if (id === 'cgHeight') { const kind = Object.keys(KINDS).find((one) => KINDS[one] === value) || null; if (v.object !== kind) { ctx.set('object', kind); return; } }
      shape(); stand();
    }

    // ---------- the marks and readings of the object ----------
    const cg = new T.Vector3();
    function boardMark() {
      const v = ctx.values, on = !lever(), w = K.w / 10, h = K.h / 10, cp = Math.cos(tilt.psi), sp = Math.sin(tilt.psi);
      bodyMesh.scale.x = w; bandMesh.scale.x = w + 0.04; bandMesh.position.y = K.band / 10; centre.position.set(0, h, FRONT);
      const side = tilt.psi < 0 ? -1 : 1;   // it turns about its left edge, or about its right one
      thing.position.set(-side * w / 2 * (1 - cp), MAT + side * w / 2 * sp, 0); thing.rotation.z = tilt.psi;
      cg.set(thing.position.x - h * sp, thing.position.y + h * cp, FRONT);
      centre.visible = v.centre;
      weightArrow.visible = plumb.visible = foot.visible = v.gravity;
      if (v.gravity) {   // the weight acts at the centre of gravity; the vertical through it is drawn down to the mat
        weightArrow.position.copy(cg); weightArrow.setLength(0.8); weightArrow.aim(DOWN);
        plumb.position.set(cg.x, MAT, FRONT); plumb.scale.y = Math.max(0.01, cg.y - MAT); foot.position.set(cg.x, MAT, FRONT);
      }
      baseStrip.visible = v.base; baseStrip.scale.x = w;
      edges.forEach((line, i) => { line.visible = v.base; line.position.set((i ? 1 : -1) * w / 2, MAT, FRONT); line.scale.y = 2.3; });   // verticals through the two ends of the base
      // the two readings stand beside the object, or above it on an upright screen, which has no room at the sides
      if (tallScreen()) { infoSpot.set(-0.85, 2.9, 0); critSpot.set(0.95, 2.9, 0); } else { infoSpot.set(-2.6, 1.3, 0); critSpot.set(2.6, 1.3, 0); }
      infoLabel.show(on && v.numbers);
      if (v.numbers) infoLabel.write(`기울인 각 <b>${Math.round(Math.abs(tilt.psi) / RAD)}°</b><br>무게 중심의 높이 ${K.h.toFixed(1)} cm<br>받침면의 너비 ${K.w} cm`);
      critLabel.show(on && v.critical);
      if (v.critical) critLabel.write(`넘어지는 각 ${THETA}<br>tan ${THETA} = ${(K.w / 2).toFixed(1)} / ${K.h.toFixed(1)}<br>${THETA} = <b>${(K.critical / RAD).toFixed(1)}°</b>`);
    }

    // ====================================== both arrangements ======================================
    const tool = () => (lever() ? leverTool : boardTool);
    view.setTool({
      pick(r) { ray.ray.copy(r); return tool().pick(r); },
      cursor: (grip) => (!grip ? '' : grip.kind === 'reset' ? 'pointer' : 'grab'),
      start(grip, r) { return tool().start(grip, r); },
      move(r) { tool().move(r); },
      end() { tool().end(); grab = null; tip.show(false); tipTime = 0; moved = true; },
    });
    const startDemo = () => (lever() ? leverDemo() : boardDemo());
    ctx.on('play', (on) => {
      playing = on;
      if (on) { frozen = false; if (!auto) startDemo(); }
      else if (ended) ended = false; else frozen = true;
    });
    ctx.on('tick', (t, dt) => {
      if (!dt || stopSoon) return;
      if (!playing) frozen = true;                    // one step at a time
      if (!auto && !startDemo()) return;
      if (lever()) leverTick(dt); else boardTick(dt);
    });
    ctx.on('action', (id) => {
      if (id !== 'reset') return;
      auto = frozen = false;
      if (lever()) leverReset(); else stand();
      moved = true;
    });
    // where each arrangement is looked at from: on a wide screen, and on an upright one (the bar is then looked along, so that all of it is in sight)
    const LOOK = {
      lever: [{ target: [0, 1.7, 0], r: 13, theta: 0.3, phi: 1.2 }, { target: [0, 1.7, 0], r: 14.5, theta: 1.1, phi: 1.2 }],
      tilt: [{ target: [0, 1.0, 0], r: 6.5, theta: 0.22, phi: 1.3 }, { target: [0, 1.3, 0], r: 8, theta: 0.22, phi: 1.3 }],
    };
    ctx.on('change', (id, value) => {
      moved = true;
      if (id === 'scene') {
        rig.visible = lever(); slab.visible = !lever();
        view.look(LOOK[value][tallScreen() ? 1 : 0]);
        ctx.emit('action', 'reset');   // the frame stops the clock; the arrangement now on the bench starts afresh
        return;
      }
      if (LEVER.includes(id)) { if (!byDemo && !playing) auto = frozen = false; leverChange(id); }
      if (['object', 'cgHeight', 'baseWidth', 'lean'].includes(id)) {
        if (!byDemo && !playing) auto = frozen = false;
        boardChange(id, value);
        if (auto && !demo.search && !byDemo && !quiet) { auto = false; stopSoon = true; }   // set anew while an object that was let go is falling: it stands again, and that demonstration is over
      }
    });
    ctx.on('mode', () => {   // the basic mode keeps the support under the middle of the bar, and the object one of the textbook's three
      if (ctx.advanced) return;
      if (ctx.values.pivot !== START.pivot) ctx.set('pivot', START.pivot);
      if (ctx.values.barWeight !== START.barWeight) ctx.set('barWeight', START.barWeight);
      if (!ctx.values.object) { const h = ctx.values.cgHeight; ctx.set('object', h < 5 ? 'da' : h > 7 ? 'na' : 'ga'); }
    });

    let framed = false;
    weigh(); place(); shape();
    return {
      state: () => ({ theta, omega, auto, frozen, playing, ...S, a: piles[0].torque, b: piles[1].torque, tilt: { ...tilt }, K: { ...K } }),
      update(dt) {
        if (!framed) { framed = true; if (tallScreen()) view.look(LOOK.lever[1]); }
        if (stopSoon) { stopSoon = false; ended = true; ctx.setPlaying(false); }
        const pace = dt * (ctx.values.slow ? 0.25 : 1);
        if (lever()) {
          const before = theta;
          if (!frozen) swing(pace);
          if (theta !== before) moved = true;
          note();
        } else if (!frozen) fall(pace);
        if (tipTime > 0) { tipTime -= dt; if (tipTime <= 0) { tip.show(false); moved = true; } }
        if (!moved) return false;
        moved = false;
        leverMark(); boardMark();
        return true;
      },
    };
  },
};
