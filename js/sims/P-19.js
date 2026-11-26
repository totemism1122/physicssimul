// P-19 Time dilation and length contraction (3D).
//
// The light clock: a model on the bench. On a long base (the ground) stands a light clock: two mirrors, one over
// the other, and a grain of light going up and down between them. Above the base a model ship flies along it,
// clear, so that the same clock is seen inside it. Each clock counts the time by its own light.
// What is drawn is what the chosen observer measures: the observer on the ground (the ground at rest, the ship
// moving) or the one in the ship (the ship at rest, the ground moving the other way). The light leaves a dot
// where it is every 1/DOTS of the observer's second, at the same spacing for both clocks (the same speed): the
// other side's light goes a slanting way, longer than straight up and down, so that its clock ticks more slowly
// (by γ = 1 ÷ √(1 − v²/c²)); and the other side is shorter along its motion (by 1 ÷ γ).
// Light is drawn slow, C lengths (30 cm) a second, so that a clock at rest ticks once a second and the clock
// by the play button is the observer's own time. What moves off one end of the stage comes in at the other.
// The rod and the ship: a rod lies at rest on the ground, as long at rest as the ship (ROD). A needle hangs under
// the ship. Event A: the needle is over the rod's left end; event B: over its right end. The chosen observer's
// stopwatch runs from A to B, and the rod's length is the speed times that time: for the observer on the ground
// the ship takes ROD ÷ v; for the one in the ship the rod (moving, and shorter by 1 ÷ γ) takes ROD ÷ γv.
// Only the chosen observer's stopwatch is shown: the other's time between the two events is not what one clock
// of the other side is seen to count (that needs two clocks, at the two places, which this observer finds not
// set alike), so it is read by choosing the other observer, and the table keeps both.
// The barn (advanced only): a barn stands at rest on the ground, shorter at rest (BARN) than the ship from tail
// to nose (SHIP), with a door at each end, both open. For the observer on the ground the ship is shorter (by
// 1 ÷ γ): faster than 0.6c it is all inside for a while. That observer shuts both doors at once the moment the
// tail is in, and opens both at once the moment the nose is at the way out: the ship is shut in, and is not
// struck. (Slower than 0.6c it does not fit, and the doors are left open. At 0.6c it just fits: the doors are
// shut and opened at the same moment. A door shut for less than SEEN_FOR is kept in sight: when it is opened the
// scene stands still, the clock with it, for the rest of that time, the door still down.) For the observer in the ship the
// barn is the shorter, and the same shuttings are not at once: the door of the way out is shut first, by
// γ × v × BARN ÷ c², and opened as the nose comes to it; the door of the way in is shut only when the tail is
// in. The two doors are never shut together for that observer. In this scene the speed is no more than 0.9c:
// faster, the barn would be off the stage at one of the two shuttings as the observer in the ship finds them.
// The diagram (a graph of the barn scene): place across, time upwards, as the chosen observer measures them. The barn
// and the ship are each the band between the lines of their two ends; a level line is now, and what the bands cut
// from it is the scene at this moment. A door's line is drawn heavy while the door is shut. The two shuttings are
// marked; and through the shutting of the way in goes the line of what the other observer calls the same time
// (it rises by v ÷ c² along the way that observer moves): the other shutting lies on it or under it.
// (advanced, the rod scene) The rule for the length is written with the values, and a graph keeps the rod's length
// as each observer found it at each speed tried.
// Advanced: the speed goes up to DEEP of c in hundredths; the rule with the square root is written with the values;
// and a graph keeps, for each speed tried, how many times longer the observer found the moving clock's round trip
// than that clock itself counted (with the curve of the rule as far as the fastest speed tried).

const L = 1.5, C = 3, TICK = 2 * L / C;   // the mirrors of a clock are this far apart (15 cm); how far light goes in a second (30 cm); a round trip of the light in a clock at rest (1 s)
const BETA_MAX = 0.9, DEEP = 0.99, DOTS = 48;   // the most the speed can be (of c), and in the advanced mode; how many dots the light leaves in a second
const most = (advanced) => (advanced ? DEEP : BETA_MAX), grain = (advanced) => (advanced ? 0.01 : 0.05);   // the speed's range and step in each mode
const ROD = 3.6, LEAD = 1.2;   // the rod at rest (36 cm); how far before the rod a pass begins, and how far after it it ends
const SEEN_FOR = 0.3;   // (the barn scene) the least time, of the watching, that a shut door is seen shut
const SHIP = 5, NOSE = 2.8, BARN = 4;   // the ship from tail to nose (50 cm), and how far its nose is ahead of its middle; the barn at rest (40 cm)
const onRod = (v) => v.scene === 'rod', onBarn = (v) => v.scene === 'barn', onClock = (v) => !onRod(v) && !onBarn(v);
const SAME = '빛이 1초에 30 cm를 간다고 두고 느리게 그렸습니다(실제로는 10억분의 1초에 30 cm). 그림은 눈에 보이는 모습이 아니라 고른 관찰자가 같은 시각에 잰 위치입니다. ';
const cm = (y) => (Number.isFinite(y) ? `${y.toFixed(1)} cm` : '');
const GOLD = '#e3c26b', ratio = (y) => (Number.isFinite(y) ? `${y.toFixed(2)}배` : '');
const gamma = (beta) => 1 / Math.sqrt(1 - beta * beta);
const WHO = { ground: '지면', ship: '우주선' }, AMBER = 0xffb637;

export default {
  // what is taken for granted, written on screen by the frame
  premise: (v) => (onBarn(v) ? '빛이 1초에 30 cm를 간다고 두고 느리게 그렸습니다. 그림은 고른 관찰자가 같은 시각에 잰 위치입니다. 멈춰 있을 때 헛간은 40 cm, 우주선은 50 cm입니다. 지면의 관찰자는 우주선이 헛간 안에 다 들어온 순간 두 문을 동시에 닫고, 앞끝이 출구에 닿는 순간 동시에 엽니다'
    : SAME + (onRod(v) ? '막대는 지면에 놓여 있고, 멈춰 있을 때의 길이는 우주선의 몸통과 같은 36 cm입니다' : '움직이는 쪽은 무대 끝에 닿으면 반대쪽 끝에서 다시 나타납니다')),
  fixedViews: ['front'],
  camera: { target: [0, 1.8, 0], r: 14.5, theta: 0, phi: 1.3, rMax: 44 },
  // (advanced) against the speed in hundredths of c, not against time: law, the rule's curve as far as the fastest
  // speed tried; tried, what was measured at each speed tried (NaN: a speed not tried yet)
  // lenLaw: the rule for a moving rod's length (cm), as far as the fastest speed tried; lenGround, lenShip: what each observer found
  traces: { law: { window: 100, range: 1.6, read: ratio }, tried: { window: 100, range: 1.6, read: ratio },
    lenLaw: { window: 100, range: 40, read: cm }, lenGround: { window: 100, range: 40, read: cm }, lenShip: { window: 100, range: 40, read: cm } },
  menus: {
    vars: [
      { id: 'scene', label: '장면 선택', kind: 'choice', value: 'clock', options: [{ id: 'clock', label: '빛 시계' }, { id: 'rod', label: '막대와 우주선' }, { id: 'barn', label: '헛간의 역설', advanced: true }] },
      { id: 'observer', label: '관찰자', kind: 'choice', value: 'ground', options: Object.keys(WHO).map((id) => ({ id, label: `${WHO[id]}의 관찰자` })) },
      { id: 'speed', label: (v) => `${WHO[v.observer === 'ground' ? 'ship' : 'ground']}의 속력`, kind: 'slider', min: 0, max: (v, advanced) => (onBarn(v) ? BETA_MAX : most(advanced)), step: (v, advanced) => grain(advanced), value: 0, digits: 2, unit: 'c' },
    ],
    graph: [
      { id: 'ratioSpeed', label: '시간의 비–속력', kind: 'graph', x: '속력', xUnit: 'c', span: [0, 1], marks: [[0.5, '0.5c'], [0.8, '0.8c']], advanced: true, when: onClock,
        plots: [{ y: '시간의 비', floor: true, marks: [[1, '1배']], lines: [{ trace: 'law', color: '#9aa7c7', name: '식' }, { trace: 'tried', color: GOLD, name: '잰 값', dots: true }] }] },
      { id: 'lengthSpeed', label: '막대의 길이–속력', kind: 'graph', x: '속력', xUnit: 'c', span: [0, 1], marks: [[0.5, '0.5c'], [0.8, '0.8c']], advanced: true, when: onRod,
        plots: [{ y: '막대의 길이', floor: true, marks: [[36, '36 cm']], lines: [{ trace: 'lenLaw', color: '#9aa7c7', name: '식' }, { trace: 'lenGround', color: '#6fc3ae', name: '지면', dots: true }, { trace: 'lenShip', color: GOLD, name: '우주선', dots: true }] }] },
      { id: 'diagram', label: '시공간 도표', kind: 'graph', picture: 'diagram', tall: true, advanced: true, when: onBarn },
    ],
    time: [
      { id: 'reset', label: '처음으로', kind: 'action' },
      { id: 'slow', label: '느리게', kind: 'toggle' },
    ],
    layers: [
      { id: 'numbers', label: '값', kind: 'toggle' },
    ],
    inquiry: [
      { id: 'table', label: '기록 표', kind: 'table', rows: 8, wide: true, when: onClock, text: '움직이는 시계의 빛이 한 번 왕복하면, 그동안 두 시계가 센 시간이 적힙니다.',
        columns: [{ label: '관찰자' }, { label: '움직이는 쪽의<br>속력', unit: 'c' }, { label: '움직이는 시계가<br>센 시간', unit: 's' }, { label: '관찰자의 시계로<br>잰 시간', unit: 's', result: true }] },
      { id: 'table3', label: '기록 표', kind: 'table', rows: 8, wide: true, when: onBarn, text: '고른 관찰자에게 두 문이 닫힌 시각이 적힙니다(재생을 시작한 때부터).',
        columns: [{ label: '관찰자' }, { label: '움직이는 쪽의<br>속력', unit: 'c' }, { label: '입구가 닫힌<br>시각', unit: 's' }, { label: '출구가 닫힌<br>시각', unit: 's' }, { label: '먼저<br>닫힌 문', result: true }] },
      { id: 'table2', label: '기록 표', kind: 'table', rows: 8, wide: true, when: onRod, text: '우주선의 바늘이 막대의 왼쪽 끝을 지날 때(A)부터 오른쪽 끝을 지날 때(B)까지, 고른 관찰자가 잰 시간이 적힙니다.',
        columns: [{ label: '관찰자' }, { label: '움직이는 쪽의<br>속력', unit: 'c' }, { label: 'A에서 B까지<br>잰 시간', unit: 's' }, { label: '속력 × 시간<br>(막대의 길이)', unit: 'cm', result: true }] },
    ],
  },

  // writing on the chalkboard (1024 x 400)
  board(g) {
    g.fillStyle = 'rgba(255,255,255,0.9)'; g.font = '56px Georgia, serif'; g.fillText('시간 팽창과 길이 수축', 60, 96);
    g.strokeStyle = 'rgba(255,255,255,0.85)'; g.lineWidth = 4;
    // a clock at rest, and one that moves
    for (const [x, w] of [[90, 80], [300, 300]]) for (const y of [170, 300]) { g.beginPath(); g.moveTo(x, y); g.lineTo(x + w, y); g.stroke(); }
    g.setLineDash([10, 8]);
    g.beginPath(); g.moveTo(130, 296); g.lineTo(130, 174); g.stroke();
    g.beginPath(); g.moveTo(320, 296); g.lineTo(450, 174); g.lineTo(580, 296); g.stroke();
    g.setLineDash([]);
  },

  // Builds the apparatus on the bench (world) and returns { update(dt) }.
  create({ T, kit, world, view, ctx }) {
    const { mat, add, box, cyl } = kit;
    world.userData.things.visible = false;
    const way = new T.Vector3(), hit = new T.Vector3();
    const M = { dark: mat(0x3a4057), steel: mat(0x9aa1b1, { roughness: 0.5, metalness: 0.5 }), slate: mat(0x23262f, { roughness: 0.9 }), pale: mat(0xd9dde6, { roughness: 0.6 }), mirror: mat(0xcfe3f2, { roughness: 0.2, metalness: 0.6 }) };
    const tipSpot = new T.Vector3(), tip = view.label(tipSpot);   // a word beside what is handled
    let moved = true, tipTime = 0, framed = false, grab = null, running = false, quiet = false, stopSoon = false;   // (running: the clock runs; quiet: the scene itself is setting a value, which is not to start the playing)
    function say(text, x, y, z, seconds = 0) { tip.write(text); tipSpot.set(x, y, z); tip.show(true); tipTime = seconds; moved = true; }
    const tall = () => window.matchMedia('(max-aspect-ratio: 4/5)').matches;

    // ---------- the stage: the base, the two clocks, the ship, the two observers, the lever ----------
    // The stage is 2 × half() long (shorter on a tall screen, where all of it is drawn smaller); at rest the ship
    // stands rest() to the left of the middle and the clock on the ground as far to the right. Z: how far to the
    // front all of it stands; the ship flies SHIP_Y above the bench. Y0: a clock's lower mirror, from its foot.
    const WIDE = 6.5, NARROW = 4.2, Z = 0.4, TOP = 0.16, SHIP_Y = 2.15, Y0 = 0.3, HULL = { long: 3.6, high: 2.1, deep: 1.2 }, LEVER = { x: 0, z: 2.5 };
    const half = () => (tall() ? NARROW : WIDE), rest = () => (tall() ? 2.0 : 3.2);
    const rig = new T.Group(); world.add(rig);
    const base = add(rig, box(2 * WIDE, TOP, 1.5), M.slate, 0, TOP / 2, Z);
    // (the marks on the base: one for each 10 cm of the ground, closer together when the ground moves)
    const marks = kit.canvasTexture(64, 64, (g, w, h) => { g.fillStyle = '#2b2f3a'; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(243,238,223,0.75)'; g.fillRect(0, 0, 3, h * 0.45); });
    marks.wrapS = marks.wrapT = T.RepeatWrapping;
    const face = add(rig, new T.PlaneGeometry(2 * WIDE, 1.5), new T.MeshStandardMaterial({ map: marks, roughness: 0.9 }), 0, TOP + 0.004, Z, false);
    face.rotation.x = -Math.PI / 2;

    function lightClock(parent) {   // two mirrors L apart on a post behind them
      const group = new T.Group(); parent.add(group);
      add(group, box(0.8, 0.07, 0.6), M.mirror, 0, Y0 - 0.035, 0); add(group, box(0.8, 0.07, 0.6), M.mirror, 0, Y0 + L + 0.035, 0);
      add(group, cyl(0.035, 0.035, L + 0.5, 10), M.steel, 0, Y0 + L / 2 - 0.1, -0.36); add(group, box(0.5, 0.06, 0.3), M.dark, 0, 0.03, -0.3);
      return group;
    }
    const RING = new T.MeshBasicMaterial({ color: 0xe3c26b });
    function doll(parent, x, tint, id) {   // an observer: pressed, the scene is drawn as this one measures it (a gold ring at the feet of the chosen one)
      const group = new T.Group(); group.position.x = x; parent.add(group);
      add(group, cyl(0.12, 0.17, 0.5, 16), mat(tint), 0, 0.25, 0); add(group, new T.SphereGeometry(0.15, 16, 12), mat(0xf0d2b6), 0, 0.64, 0);
      const ring = add(group, new T.TorusGeometry(0.27, 0.035, 8, 28), RING, 0, 0.03, 0, false, false); ring.rotation.x = Math.PI / 2;
      const grip = add(group, box(0.8, 1.2, 0.9), M.dark, 0, 0.5, 0, false, false); grip.visible = false; grip.userData.grip = { kind: 'who', id };
      return { group, ring, grip };
    }
    // the ground's things (they move, and are shorter, when the ship's observer is chosen)
    const ground = new T.Group(); ground.position.set(0, TOP, Z); rig.add(ground);
    const clocks = [lightClock(ground)];
    const DOLL = { ground: 1.05, ship: -1.15 }, onGround = doll(ground, DOLL.ground, 0x3f8f7f, 'ground');
    // the ship: a clear hull with a nose and fins, the same clock inside it, and its observer
    const ship = new T.Group(); ship.position.set(0, SHIP_Y, Z); rig.add(ship);
    const hull = box(HULL.long, HULL.high, HULL.deep);
    add(ship, hull, new T.MeshStandardMaterial({ color: 0xbcd6ee, transparent: true, opacity: 0.2, roughness: 0.2, depthWrite: false }), 0, HULL.high / 2, 0, false, false);
    const edges = new T.LineSegments(new T.EdgesGeometry(hull), new T.LineBasicMaterial({ color: 0x5b6b8c })); edges.position.y = HULL.high / 2; ship.add(edges);
    add(ship, new T.ConeGeometry(HULL.high * 0.42, 1.0, 24), M.pale, HULL.long / 2 + 0.5, HULL.high / 2, 0).rotation.z = -Math.PI / 2;
    add(ship, cyl(0.42, 0.55, 0.4, 20), M.dark, -HULL.long / 2 - 0.2, HULL.high / 2, 0).rotation.z = Math.PI / 2;   // (from its end to the tip of the nose: SHIP)
    for (const y of [0.12, HULL.high - 0.12]) add(ship, box(0.7, 0.3, 0.06), mat(0xa8473f), -HULL.long / 2 + 0.25, y + (y < 1 ? -0.2 : 0.2), 0);
    add(ship, box(HULL.long, 0.06, HULL.deep), M.pale, 0, 0.03, 0);
    clocks.push(lightClock(ship));
    // (the rod scene) the rod on the ground, a pole at each end of it with a pennant put up once the needle has been over it; the needle under the ship
    const rodGroup = new T.Group(); ground.add(rodGroup);
    add(rodGroup, box(ROD, 0.22, 0.34), mat(0xc98f52, { roughness: 0.7 }), 0, 0.11, 0);
    const pennants = [-1, 1].map((side) => {
      add(rodGroup, box(0.06, 0.24, 0.36), mat(0x7a4f2a), side * (ROD / 2 - 0.03), 0.12, 0);
      add(rodGroup, cyl(0.025, 0.025, 0.9, 8), M.steel, side * ROD / 2, 0.45, 0.3);
      return add(rodGroup, box(0.34, 0.2, 0.02), new T.MeshBasicMaterial({ color: 0xe3c26b }), side * ROD / 2 + 0.17, 0.78, 0.3, false, false);
    });
    // (the barn scene) a frame on the ground with a clear back and roof, and a door at each end: down is shut, up over the roof is open
    const barn = new T.Group(), HIGH = 3, LOW = 0.35, WOOD = mat(0x8a5a3c, { roughness: 0.8 }), clear = () => new T.MeshStandardMaterial({ color: 0xb5553c, transparent: true, opacity: 0.22, roughness: 0.8, depthWrite: false });
    ground.add(barn);   // (LOW: how far over the base the ship flies in this scene)
    for (const x of [-BARN / 2, BARN / 2]) { for (const z of [-0.72, 0.72]) add(barn, box(0.12, HIGH, 0.12), WOOD, x, HIGH / 2, z); add(barn, box(0.12, 0.12, 1.56), WOOD, x, HIGH + 0.06, 0); }
    for (const z of [-0.72, 0.72]) add(barn, box(BARN + 0.12, 0.12, 0.12), WOOD, 0, HIGH + 0.06, z);
    add(barn, box(BARN, HIGH, 0.03), clear(), 0, HIGH / 2, -0.74, false, false); add(barn, box(BARN, 0.04, 1.5), clear(), 0, HIGH + 0.14, 0, false, false);
    const doors = [-1, 1].map((side) => add(barn, box(0.08, HIGH - 0.25, 1.3), mat(0xa8473f, { roughness: 0.7 }), side * BARN / 2, HIGH / 2, 0));
    const needle = new T.Group(), REACH = SHIP_Y - TOP - 0.5; ship.add(needle);
    add(needle, cyl(0.03, 0.03, REACH, 8), M.steel, 0, -REACH / 2, 0); add(needle, new T.ConeGeometry(0.09, 0.22, 12), mat(0xb8433a, { roughness: 0.5 }), 0, -REACH - 0.11, 0).rotation.z = Math.PI;
    const inShip = doll(ship, DOLL.ship, 0xd07a3a, 'ship');
    // the light of each clock, and the dots it leaves
    const glint = () => { const ball = add(rig, new T.SphereGeometry(0.11, 16, 12), new T.MeshBasicMaterial({ color: AMBER }), 0, 0, Z, false, false); add(ball, new T.SphereGeometry(0.2, 16, 12), new T.MeshBasicMaterial({ color: AMBER, transparent: true, opacity: 0.3, depthWrite: false }), 0, 0, 0, false, false); return ball; };
    const lights = { ground: glint(), ship: glint() };
    const MOST = 420, dots = new T.InstancedMesh(new T.SphereGeometry(0.04, 8, 6), new T.MeshBasicMaterial({ color: AMBER }), MOST), spot = new T.Object3D();
    dots.frustumCulled = false; rig.add(dots);
    // the lever by which the ship's speed is set: leaning left at nought, right at the most
    const lever = new T.Group(); lever.position.set(LEVER.x, 0, LEVER.z); rig.add(lever);
    add(lever, box(1.9, 0.3, 0.8), M.dark, 0, 0.15, 0); add(lever, box(1.5, 0.02, 0.12), M.slate, 0, 0.305, 0, false);
    const arm = new T.Group(); arm.position.y = 0.3; lever.add(arm);
    add(arm, cyl(0.045, 0.045, 0.55, 12), M.steel, 0, 0.27, 0); add(arm, new T.SphereGeometry(0.15, 18, 12), mat(0xb8433a, { roughness: 0.5 }), 0, 0.58, 0);   // (short, so that it does not stand in front of what is on the base)
    const leverHandle = add(lever, box(2.4, 1.7, 1.1), M.dark, 0, 0.75, 0, false, false); leverHandle.visible = false; leverHandle.userData.grip = { kind: 'lever' };
    const spots = { ground: new T.Vector3(), ship: new T.Vector3(), who: new T.Vector3(), lever: new T.Vector3(), list: new T.Vector3(), rule: new T.Vector3(), a: new T.Vector3(), b: new T.Vector3() };
    const labels = { ground: view.label(spots.ground), ship: view.label(spots.ship), who: view.label(spots.who), lever: view.label(spots.lever), list: view.label(spots.list, true), rule: view.label(spots.rule, true), a: view.label(spots.a), b: view.label(spots.b) };

    // ---------- what goes on ----------
    // mine: the observer's time since the start (s); own: what the moving clock has counted by then (mine ÷ γ);
    // shift: how far the moving side has gone. trail: where the moving clock's light was at each 1/DOTS s of the
    // observer's time, for its last round trip. A round trip that the speed was not changed in is written in the table.
    const state = { mine: 0, own: 0, shift: 0, next: 0, trail: [], laps: 0, lapAt: 0, clean: true, done: false, hold: 0, held: [] };   // (done: the pass is over; hold: how much longer the scene stands still, and held: the doors kept down meanwhile)
    const tried = new Map();   // the speeds tried (in hundredths of c) and the ratio of the two times found at each
    function plot() {
      const top = Math.max(0, ...tried.keys());
      ctx.traces.law.clear(); ctx.traces.tried.clear();
      for (let k = 0; k <= 99; k++) { ctx.traces.law.add(k / 100, k <= top ? gamma(k / 100) : NaN); ctx.traces.tried.add(k / 100, tried.has(k) ? tried.get(k) : NaN); }
    }
    plot();
    const found = { ground: new Map(), ship: new Map() };   // the rod's length (cm) as each observer found it, by the speed in hundredths of c
    function plotRod() {
      const top = Math.max(0, ...found.ground.keys(), ...found.ship.keys()), { lenLaw, lenGround, lenShip } = ctx.traces;
      lenLaw.clear(); lenGround.clear(); lenShip.clear();
      for (let k = 0; k <= 99; k++) { lenLaw.add(k / 100, k <= top ? ROD * 10 / gamma(k / 100) : NaN); lenGround.add(k / 100, found.ground.has(k) ? found.ground.get(k) : NaN); lenShip.add(k / 100, found.ship.has(k) ? found.ship.get(k) : NaN); }
    }
    plotRod();
    const moving = () => (ctx.values.observer === 'ground' ? 'ship' : 'ground');
    const climb = (time) => L * (1 - Math.abs(2 * (time / TICK - Math.floor(time / TICK)) - 1));   // how high the light of a clock is over its lower mirror when the clock has counted this long
    const wrap = (x) => { const h = half(); return ((x + h) % (2 * h) + 2 * h) % (2 * h) - h; };
    function restart() { Object.assign(state, { mine: 0, own: 0, shift: 0, next: 0, trail: [], laps: 0, lapAt: 0, clean: true, done: false, hold: 0, held: [] }); moved = true; }
    // (the rod scene) One pass, by the observer's time: the moving side goes LEAD before the needle is over the rod's
    // left end (a), then the rod's length as this observer finds it (len) to its right end (b), then LEAD more (end).
    // (the barn scene) The moving side goes its lead before the nose is at the way in (o), and on until the tail is
    // LEAD past the way out. shut: for each door, when it is shut and when it is opened (nothing if the ship does not
    // fit). For the observer in the ship the pass begins early enough for the shutting of the way out to be seen, and
    // goes on, while the barn is on the stage, until the way in is opened again.
    const NOSE_AT = 1.5;   // (the barn scene) where the nose of the ship at rest is: left of the middle, for the barn to come from far enough
    const passing = () => !onClock(ctx.values), fastest = () => (onBarn(ctx.values) ? BETA_MAX : most(ctx.advanced));
    function pass() {
      const beta = ctx.values.speed, v = beta * C, g = gamma(beta), short = (length, whose) => length / (moving() === whose ? g : 1);
      if (onBarn(ctx.values)) {
        const aboard = moving() === 'ground', own = short(SHIP, 'ship'), room = short(BARN, 'ground');
        // (counted from the nose at the way in) on the ground: both shut when the tail is in, both opened when the nose is at the way out; in the ship: the same events as that observer finds them
        const turns = !(SHIP / g <= BARN + 1e-9) ? null : aboard ? { in: [SHIP / v, g * BARN / v], out: [SHIP / v - g * beta * BARN / C, BARN / g / v] } : { in: [SHIP / g / v, BARN / v], out: [SHIP / g / v, BARN / v] };
        const lead = aboard && turns ? Math.max(LEAD, v * (0.3 - turns.out[0])) : LEAD, o = lead / v, usual = (room + own + LEAD) / v;
        const last = !aboard ? usual : Math.max(SHIP / v + 0.5, Math.min(turns ? Math.max(usual, turns.in[1] + 0.3) : usual, (NOSE_AT + 6.4) / v));
        return { v, own, room, lead, o, end: o + last, shut: turns && { in: turns.in.map((time) => time + o), out: turns.out.map((time) => time + o) } };
      }
      const len = short(ROD, 'ground');
      return { v, len, a: LEAD / v, b: (LEAD + len) / v, end: (2 * LEAD + len) / v };
    }
    const first = (run) => (Math.abs(run.shut.in[0] - run.shut.out[0]) < 0.005 ? '동시' : run.shut.in[0] < run.shut.out[0] ? '입구' : '출구');   // (the barn scene) which door was shut first
    function go(dt) {
      const run = pass(), { v, a, b, end } = run, before = state.mine;
      if (!v || state.done) { stopSoon = true; return; }
      if (state.hold > 0) { state.hold -= dt; if (state.hold <= 0) state.held = []; ctx.seek(before); return; }   // (standing still: the clock by the play button too)
      let next = Math.min(end, before + dt);
      if (onBarn(ctx.values) && run.shut) {   // a door opened in this step that was shut too short a time to be seen: so far and no further, and the scene stands still
        const brief = ['in', 'out'].filter((id) => run.shut[id][1] > before && run.shut[id][1] <= next && run.shut[id][1] - run.shut[id][0] < SEEN_FOR);
        if (brief.length) {
          next = Math.min(...brief.map((id) => run.shut[id][1]));
          state.held = brief.filter((id) => run.shut[id][1] === next); state.hold = SEEN_FOR - (run.shut[state.held[0]][1] - run.shut[state.held[0]][0]);
        }
      }
      state.mine = next;
      if (onBarn(ctx.values)) {
        const last = run.shut ? Math.max(run.shut.in[0], run.shut.out[0]) : end;
        if (before < last && state.mine >= last) {   // both doors have been shut (or the pass is over with neither shut): kept
          const row = [WHO[ctx.values.observer], ctx.values.speed.toFixed(2), ...(run.shut ? [run.shut.in[0].toFixed(2), run.shut.out[0].toFixed(2), first(run)] : ['–', '–', '닫지 않음'])];
          if (!ctx.tables.table3.rows.some((one) => one[0] === row[0] && one[1] === row[1])) ctx.tables.table3.add(row);
        }
      } else if (before < b && state.mine >= b) {   // the stopwatch is stopped: the time, and the length it gives, are kept
        const row = [WHO[ctx.values.observer], ctx.values.speed.toFixed(2), (b - a).toFixed(2), (v * 10 * (b - a)).toFixed(1)];
        if (!ctx.tables.table2.rows.some((one) => one[0] === row[0] && one[1] === row[1])) ctx.tables.table2.add(row);
        const k = Math.round(ctx.values.speed * 100), mine = found[ctx.values.observer];
        if (!mine.has(k)) { mine.set(k, v * 10 * (b - a)); plotRod(); }
      }
      if (state.mine >= end) { state.done = true; stopSoon = true; }
    }
    // (the barn scene) The diagram. In this observer's measure (the middle of what is at rest at nought): where the
    // way in, the way out, the tail and the nose are at a time of the pass.
    function ends(run, time) {
      const far = run.v * time;
      if (moving() === 'ship') { const nose = -BARN / 2 - run.lead + far; return { in: -BARN / 2, out: BARN / 2, nose, tail: nose - run.own }; }
      const way = NOSE_AT + run.lead - far;
      return { in: way, out: way + run.room, nose: NOSE_AT, tail: NOSE_AT - SHIP };
    }
    ctx.pictures.diagram = {
      key: () => `${ctx.values.observer}/${ctx.values.speed}/${state.mine.toFixed(2)}`,
      paint(g, w, h, size) {
        const INK = 'rgba(243, 238, 223, 0.7)', small = g.font.replace(/[\d.]+px/, `${size * 0.88}px`), font = g.font;
        const left = size * 1.2, right = w - 4, top = size * 1.6, bottom = h - size * 1.7;
        g.strokeStyle = 'rgba(243, 238, 223, 0.55)'; g.lineWidth = 1.2;
        g.beginPath(); g.moveTo(left, top); g.lineTo(left, bottom); g.lineTo(right, bottom); g.stroke();
        g.fillStyle = INK; g.textAlign = 'left'; g.fillText('시간', 0, size * 0.75); g.textAlign = 'right'; g.fillText('위치', w - 2, h - size * 0.75);
        const run = pass();
        if (!(run.v > 0)) return;
        const from = ends(run, 0), to = ends(run, run.end), all = [from, to].flatMap((one) => [one.in, one.out, one.nose, one.tail]);
        const least = Math.min(...all) - 0.4, most = Math.max(...all) + 0.4;
        const px = (x) => left + (x - least) / (most - least) * (right - left), py = (time) => bottom - time / run.end * (bottom - top);
        const band = (a, b, tint) => { g.fillStyle = tint; g.beginPath(); g.moveTo(px(from[a]), py(0)); g.lineTo(px(to[a]), py(run.end)); g.lineTo(px(to[b]), py(run.end)); g.lineTo(px(from[b]), py(0)); g.closePath(); g.fill(); };
        band('in', 'out', 'rgba(214, 120, 88, 0.42)'); band('tail', 'nose', 'rgba(150, 190, 235, 0.42)');
        // a door's line: light, and heavy while the door is shut
        const line = (end, t0, t1, heavy) => { if (!(t1 > t0)) return; const a = ends(run, t0), b = ends(run, t1); g.strokeStyle = heavy ? '#e0704f' : 'rgba(224, 112, 79, 0.45)'; g.lineWidth = heavy ? 2.6 : 1; g.beginPath(); g.moveTo(px(a[end]), py(t0)); g.lineTo(px(b[end]), py(t1)); g.stroke(); };
        for (const id of ['in', 'out']) { line(id, 0, run.end, false); if (run.shut) line(id, Math.max(0, run.shut[id][0]), Math.min(run.end, run.shut[id][1]), true); }
        // what the other observer calls the same time as the shutting of the way in
        const shutAt = run.shut && { in: ends(run, run.shut.in[0]).in, out: ends(run, run.shut.out[0]).out }, rise = (moving() === 'ship' ? 1 : -1) * ctx.values.speed / C;
        if (run.shut) {
          g.save(); g.beginPath(); g.rect(left, top, right - left, bottom - top); g.clip();
          g.strokeStyle = 'rgba(243, 238, 223, 0.75)'; g.lineWidth = 1; g.setLineDash([4, 3]);
          g.beginPath(); g.moveTo(px(least), py(run.shut.in[0] + rise * (least - shutAt.in))); g.lineTo(px(most), py(run.shut.in[0] + rise * (most - shutAt.in))); g.stroke();
          g.restore(); g.setLineDash([]);
        }
        // now
        const now = py(state.mine);
        g.strokeStyle = GOLD; g.lineWidth = 1.4; g.beginPath(); g.moveTo(left, now); g.lineTo(right, now); g.stroke();
        // the two events, and the names
        g.font = small;
        const dot = (x, time, name, side) => {
          g.fillStyle = '#f3eedf'; g.beginPath(); g.arc(px(x), py(time), 3.2, 0, Math.PI * 2); g.fill();
          g.textAlign = side < 0 ? 'right' : 'left'; g.fillText(name, px(x) + side * size * 0.5, py(time));
        };
        if (run.shut) { dot(shutAt.in, run.shut.in[0], '입구 닫힘', -1); dot(shutAt.out, run.shut.out[0], '출구 닫힘', moving() === 'ship' ? 1 : -1); }
        else { g.fillStyle = INK; g.textAlign = 'center'; g.fillText('두 문을 닫지 않음', (left + right) / 2, top + size); }
        g.textAlign = 'center';
        g.fillStyle = '#f0b9a5'; g.fillText('헛간', px((from.in + from.out) / 2), bottom - size * 0.7);
        g.fillStyle = '#c6dcf5'; g.fillText('우주선', px((from.tail + from.nose) / 2), bottom - size * (moving() === 'ship' ? 0.7 : 1.9));
        g.fillStyle = GOLD; g.textAlign = 'right'; g.fillText('지금', right - 2, now - size * 0.6);
        if (run.shut) { g.fillStyle = INK; g.textAlign = 'left'; g.fillText(`점선: ${WHO[moving()]}의 관찰자에게 같은 시각`, size * 3.2, size * 0.75); }   // (beside the name of the upright axis)
        g.font = font;
      },
    };
    function advance(dt) {
      if (passing()) { go(dt); return; }
      const beta = ctx.values.speed, g = gamma(beta), u = beta * C * (moving() === 'ship' ? 1 : -1), t0 = state.mine, p0 = state.own, s0 = state.shift;
      state.mine += dt; state.own += dt / g; state.shift += u * dt;
      for (; state.next <= state.mine; state.next += 1 / DOTS) { const f = state.next - t0; state.trail.push({ x: s0 + u * f, own: p0 + f / g }); }
      const keep = Math.min(MOST - 30, Math.ceil(g * TICK * DOTS));
      if (state.trail.length > keep) state.trail.splice(0, state.trail.length - keep);
      const laps = Math.floor(state.own / TICK + 1e-9);
      if (laps > state.laps) {   // the moving clock's light is back at the lower mirror
        const at = t0 + (laps * TICK - p0) * g, row = [WHO[ctx.values.observer], beta.toFixed(2), TICK.toFixed(2), (at - state.lapAt).toFixed(2)];
        if (state.clean && laps === state.laps + 1) {
          if (!ctx.tables.table.rows.some((one) => one[0] === row[0] && one[1] === row[1])) ctx.tables.table.add(row);
          const k = Math.round(beta * 100);
          if (!tried.has(k)) { tried.set(k, (at - state.lapAt) / TICK); plot(); }
        }
        Object.assign(state, { laps, lapAt: at, clean: true });
      }
    }

    // ---------- handling ----------
    // The lever is pulled sideways (all its range for 3 lengths of the bench); an observer is pressed.
    const ray = new T.Raycaster(), plane = new T.Plane(), onRig = (x, y, z, out) => out.set(x, y, z).multiplyScalar(rig.scale.x);
    view.setTool({
      pick(r) {
        ray.ray.copy(r); rig.updateMatrixWorld(true);
        const found = ray.intersectObjects([leverHandle, onGround.grip, inShip.grip], false)[0];
        return found ? found.object.userData.grip : null;
      },
      cursor: (grip) => (!grip ? '' : grip.kind === 'lever' ? 'grab' : 'pointer'),
      start(grip, r) {
        const key = grip.kind === 'lever' ? 'speed' : 'observer';
        if (grip.kind === 'lever') onRig(LEVER.x, 0.9, LEVER.z, way); else way.copy(spots.who);
        if (ctx.locked.has(key)) { say('잠금', way.x, way.y + 0.6, way.z, 1.2); return false; }
        plane.setFromNormalAndCoplanarPoint(hit.copy(r.direction).negate(), way);
        if (!r.intersectPlane(plane, hit)) return false;
        grab = { ...grip, start: hit.clone(), from: ctx.values.speed };
        return true;
      },
      move(r) {
        if (grab.kind !== 'lever' || !r.intersectPlane(plane, hit)) return;
        const top = fastest(), step = grain(ctx.advanced);
        const to = Math.max(0, Math.min(top, Math.round((grab.from + (hit.x - grab.start.x) / (3 * rig.scale.x) * top) / step) * step));
        if (Math.abs(to - ctx.values.speed) > 1e-6) ctx.set('speed', Number(to.toFixed(2)));
        moved = true;
      },
      end() {
        const done = grab;
        grab = null; moved = true;
        if (done && done.kind === 'who' && ctx.values.observer !== done.id) ctx.set('observer', done.id);
      },
    });

    function draw() {
      const v = ctx.values, up = tall(), h = half(), beta = v.speed, g = gamma(beta), mover = moving(), size = up ? 0.7 : 1, rodded = onRod(v), barned = onBarn(v), plain = !rodded && !barned;
      rig.scale.setScalar(size);
      for (const one of clocks) one.visible = plain;
      lights.ground.visible = lights.ship.visible = dots.visible = plain; rodGroup.visible = needle.visible = rodded; barn.visible = barned;
      const shipY = barned ? TOP + LOW : SHIP_Y;   // (through the barn the ship flies low over the base)
      ship.position.y = shipY;
      // (where the two observers stand: beside their clocks; in the rod scene the one on the ground behind the middle of the rod, the one in the ship over the needle)
      // (in the barn scene the one on the ground on the barn's roof)
      const stand = plain ? DOLL : { ground: 0, ship: 0 }, run = plain ? null : pass(), gone = beta * C * state.mine;
      onGround.group.position.set(stand.ground, barned ? HIGH + 0.16 : 0, rodded ? -0.45 : 0); inShip.group.position.x = stand.ship;
      // the base as long as the stage, its marks a tenth of a metre of the ground apart (closer when the ground moves)
      const squeeze = mover === 'ground' ? g : 1, home = { ship: -rest(), ground: rest() }, at = { ...home };
      if (plain) at[mover] = wrap(home[mover] + state.shift);
      else if (barned && mover === 'ship') { at.ground = 0; at.ship = -BARN / 2 - run.lead + gone - NOSE / g; }                       // (the barn in the middle, the ship's nose coming to its way in)
      else if (barned) { at.ship = NOSE_AT - NOSE; at.ground = NOSE_AT + run.lead - gone + BARN / 2 / g; }   // (the ship in the middle, the barn's way in coming to its nose)
      else if (mover === 'ship') { at.ground = 0; at.ship = -(ROD / 2 + LEAD) + gone; }   // (the rod in the middle, the ship coming from its left)
      else { at.ship = 0; at.ground = LEAD - gone + run.len / 2; }                         // (the ship in the middle, the rod coming from its right)
      base.scale.x = face.scale.x = h / WIDE; marks.repeat.set(2 * h * squeeze, 1);
      marks.offset.x = ((-(at.ground + h) * squeeze) % 1 + 1) % 1;
      ship.position.x = at.ship; ship.scale.x = mover === 'ship' ? 1 / g : 1;
      ground.position.x = at.ground; ground.scale.x = mover === 'ground' ? 1 / g : 1;
      onGround.ring.visible = v.observer === 'ground'; inShip.ring.visible = v.observer === 'ship';
      // the light of the two clocks, and its dots: the clock at rest by the observer's time, the other by its own
      const foot = { ground: TOP + Y0, ship: SHIP_Y + Y0 }, still = v.observer;
      lights[still].position.set(at[still], foot[still] + climb(state.mine), Z); lights[mover].position.set(at[mover], foot[mover] + climb(state.own), Z);
      let n = 0;
      const put = (x, y) => { spot.position.set(x, y, Z); spot.updateMatrix(); dots.setMatrixAt(n++, spot.matrix); };
      for (let k = 0; k <= DOTS * TICK / 2; k++) put(at[still], foot[still] + climb(k / DOTS));
      if (plain) for (const one of state.trail) put(wrap(home[mover] + one.x), foot[mover] + climb(one.own));
      dots.count = n; dots.instanceMatrix.needsUpdate = true;
      arm.rotation.z = 0.9 - 1.8 * beta / fastest();
      // the writing
      const time = { [still]: state.mine, [mover]: state.own };
      // (the ground clock's: beside it, under where the ship passes; on a tall screen it and the lever's hang below what they name)
      const keep = (x) => (up ? Math.max(-1.9, Math.min(1.9, x)) : x);   // (on a tall screen a clock's writing stays on screen when the clock is at an end of the stage)
      if (up) onRig(keep(at.ground), 0, Z + 0.9, spots.ground); else onRig(Math.max(-6, at.ground - 1.9), TOP + 0.45, Z, spots.ground);
      onRig(keep(at.ship), SHIP_Y + HULL.high + 0.25, Z, spots.ship); labels.ground.shift = labels.lever.shift = up ? -0.12 : 0;
      if (plain) onRig(at[still] + stand[still], (still === 'ground' ? TOP : SHIP_Y) + 0.95, Z, spots.who);
      else if (still === 'ship') onRig(at.ship, shipY + HULL.high + 0.25, Z, spots.who);
      else if (barned) onRig(at.ground, TOP + HIGH + 1.15, Z, spots.who); else onRig(at.ground, TOP + 1.15, Z - 0.45, spots.who);
      if (up) onRig(LEVER.x, 0, LEVER.z + 0.6, spots.lever); else onRig(LEVER.x - 1.9, 0.2, LEVER.z, spots.lever);
      for (const id of ['ground', 'ship']) labels[id].write(`${WHO[id]}의 시계 <b>${time[id].toFixed(2)} s</b> · 왕복 ${Math.floor(time[id] / TICK + 1e-9)}번`);
      // (the rod scene) the two events by their letters, gold once they have happened; the observer's stopwatch, which runs from A to B
      // (the barn scene) each door is down while it is shut
      const moves = barned && beta > 0, seen = rodded && beta > 0 ? [state.mine >= run.a, state.mine >= run.b] : [false, false];
      const watch = rodded && beta > 0 ? Math.max(0, Math.min(run.b, state.mine) - run.a) : 0;
      pennants.forEach((one, k) => { one.visible = seen[k]; });
      const shut = ['in', 'out'].map((id) => moves && !!run.shut && ((state.mine >= run.shut[id][0] && state.mine < run.shut[id][1]) || (state.hold > 0 && state.held.includes(id))));
      doors.forEach((one, k) => { one.position.y = HIGH / 2 + (shut[k] ? 0 : HIGH); });
      ['a', 'b'].forEach((id, k) => {
        if (barned) { onRig(at.ground + (k ? 1 : -1) * BARN / 2 * ground.scale.x, TOP + HIGH + 0.3, Z + 0.72, spots[id]); labels[id].shift = 0; labels[id].write(`${k ? '출구' : '입구'} <b>${shut[k] ? '닫힘' : '열림'}</b>`); return; }
        onRig(at.ground + (k ? 1 : -1) * ROD / 2 * ground.scale.x, up ? 0 : TOP + 1.15, Z + (up ? 0.9 : 0.3), spots[id]); labels[id].shift = up ? -0.12 : 0;   // (on a tall screen under the base, clear of the stopwatch's writing)
        labels[id].write(seen[k] ? `<b>${id.toUpperCase()}</b>` : id.toUpperCase());
      });
      labels.who.write(rodded ? `<b>관찰자</b>의 초시계 <b>${watch.toFixed(2)} s</b>` : '<b>관찰자</b>'); labels.lever.write(`${WHO[mover]}의 속력 <b>${beta.toFixed(2)}c</b>`);
      // (advanced) the rule, with the values in it: on a wide screen by itself at the front left, on a tall one under the list
      const rule = !ctx.advanced || barned ? [] : rodded
        ? ['움직이는 물체의 길이(L) = 고유 길이(L<sub>고유</sub>) × √(1 − v²/c²)', `${mover === 'ship' ? '우주선' : '막대'}의 길이 <b>${(ROD * 10 / g).toFixed(1)} cm</b> = ${(ROD * 10).toFixed(1)} cm × √(1 − ${beta.toFixed(2)}²)`]
        : ['관찰자가 잰 시간(Δt) = 고유 시간(Δt<sub>고유</sub>) ÷ √(1 − v²/c²)', `<b>${(TICK * g).toFixed(2)} s</b> = ${TICK.toFixed(2)} s ÷ √(1 − ${beta.toFixed(2)}²)`];
      labels.rule.write(rule.join('<br>')); onRig(-4.7, 0, 3.4, spots.rule);
      for (const key of Object.keys(labels)) labels[key].show(key === 'list' ? v.numbers : key === 'rule' ? v.numbers && !up && rule.length > 0 : key === 'a' || key === 'b' ? !plain : key === 'ground' || key === 'ship' ? plain : true);
      if (v.numbers && barned) {
        // (what this observer finds: how long the two are, and when each door was shut and opened, from the start of the playing)
        const turns = moves && run.shut, when = (time) => (state.mine >= time ? `${time.toFixed(2)} s` : '?'), door = (id, name) => `${name}: 닫힘 <b>${when(turns[id][0])}</b> · 열림 <b>${when(turns[id][1])}</b>`;
        labels.list.write([`<b>${WHO[still]}의 관찰자</b>가 잰 값`,
          `우주선의 길이 ${(run.own * 10).toFixed(1)} cm · 헛간의 길이 ${(run.room * 10).toFixed(1)} cm`,
          ...(!turns ? [`${still === 'ground' ? '우주선이' : '지면에서 우주선이'} 헛간보다 길어 문을 닫지 않음`]
            : [door('in', '입구'), door('out', '출구'), state.mine < Math.max(turns.in[0], turns.out[0]) ? '먼저 닫힌 문 <b>?</b>'
              : first(run) === '동시' ? '두 문이 <b>동시</b>에 닫힘' : `출구가 입구보다 <b>${Math.abs(turns.in[0] - turns.out[0]).toFixed(2)} s</b> 먼저 닫힘`])].join('<br>'));
        if (up) onRig(0, 6.2, Z, spots.list); else onRig(4.4, 0, 3.4, spots.list);
      } else if (v.numbers && rodded) {
        // (what this observer measures: the speed of the other side, the time from A to B, and so the rod's length)
        labels.list.write([`<b>${WHO[still]}의 관찰자</b>가 잰 값`,
          `${mover === 'ship' ? '우주선' : '막대'}의 속력 ${beta.toFixed(2)}c = ${(beta * C * 10).toFixed(1)} cm/s`,
          `A에서 B까지 걸린 시간 <b>${watch.toFixed(2)} s</b>`,
          `막대의 길이 = 속력 × 시간 = <b>${seen[1] ? `${(beta * C * 10 * watch).toFixed(1)} cm` : '?'}</b>`,
          ...(up ? rule : [])].join('<br>'));
        if (up) onRig(0, 6.2, Z, spots.list); else onRig(4.4, 0, 3.4, spots.list);
      } else if (v.numbers) {
        const far = (2 * L * 10).toFixed(1), slant = (2 * L * 10 * g).toFixed(1);
        // (every time is said with the clock that counted it: the moving clock's own second is the longer one for the observer)
        labels.list.write([`<b>${WHO[still]}의 관찰자</b>가 잰 값`,
          `${WHO[still]}의 시계(멈춤): 빛의 왕복 ${far} cm ÷ ${TICK.toFixed(2)} s = 30 cm/s`,
          `${WHO[mover]}의 시계(${beta ? '움직임' : '멈춤'}): 빛의 왕복 ${slant} cm ÷ ${(TICK * g).toFixed(2)} s = 30 cm/s`,
          `${WHO[mover]}의 시계가 <b>${TICK.toFixed(2)} s</b> 가는 동안 ${WHO[still]}의 시계는 <b>${(TICK * g).toFixed(2)} s</b> 감`,
          ...(up ? rule : [])].join('<br>'));
        if (up) onRig(0, 6.2, Z, spots.list); else onRig(4.4, 0, 3.4, spots.list);   // (wide: on the bench in front, at the right, clear of the menu; tall: over the ship)
      }
    }

    ctx.on('play', (on) => {
      running = on; moved = true;
      if (!on || !passing()) return;
      // (the rod scene) nothing passes at no speed; a pass that is over is begun again
      if (!ctx.values.speed) { onRig(LEVER.x, 1.6, LEVER.z, way); say('속력을 올려 보세요', way.x, way.y, way.z, 1.8); stopSoon = true; } else if (state.done) { restart(); ctx.seek(0); }
    });
    ctx.on('tick', (t, dt) => { if (!dt) return; advance(dt); moved = true; });
    ctx.on('action', (id) => { if (id === 'reset') restart(); });   // (back to the start as the chosen observer finds it, at the speed set)
    ctx.on('view', () => { moved = true; });
    ctx.on('change', (id) => {
      moved = true;
      if (id === 'observer') { restart(); ctx.seek(0); ctx.setPlaying(false); }   // the same thing as the other observer measures it: at its start, standing still
      if (id === 'speed' && passing()) { restart(); if (!quiet) { ctx.seek(0); if (ctx.values.speed) ctx.setPlaying(true); } }   // (the rod scene: the pass over again at the new speed)
      else if (id === 'speed') { state.clean = false; if (!quiet && !running) ctx.setPlaying(true); }   // (what is changed is shown at once, without the play button)
      if (id === 'scene') {   // the other scene from its start, standing still (the rod scene with a speed, so that the play button has something to show)
        restart(); quiet = true;
        // (the barn scene with a speed at which the ship fits, and no more than this scene's most)
        const speed = ctx.values.speed, fit = onBarn(ctx.values) ? (speed > BETA_MAX ? BETA_MAX : speed < 0.6 ? 0.8 : speed) : passing() && !speed ? 0.6 : speed;
        if (fit !== speed && !ctx.locked.has('speed')) ctx.set('speed', fit);
        quiet = false; ctx.seek(0); ctx.setPlaying(false);
      }
    });
    let wasAdvanced = ctx.advanced;
    ctx.on('mode', () => {
      moved = true;
      if (ctx.advanced === wasAdvanced) return;   // (this comes for the class and inquiry buttons too, and when the screen opens)
      wasAdvanced = ctx.advanced;
      // back in the basic mode the speed is one of its steps, and no more than its most
      const fit = Math.min(BETA_MAX, Number((Math.round(ctx.values.speed / 0.05) * 0.05).toFixed(2)));
      if (!ctx.advanced && fit !== ctx.values.speed) { quiet = true; ctx.set('speed', fit); quiet = false; }
    });

    return {
      barn: () => ({ ...pass(), mine: state.mine, done: state.done, ground: ground.position.x, ship: ship.position.x, squeeze: [ship.scale.x, ground.scale.x], doors: doors.map((one) => one.position.y < HIGH) }),
      rod: () => ({ ...pass(), mine: state.mine, done: state.done, ground: ground.position.x, ship: ship.position.x, squeeze: [ship.scale.x, ground.scale.x], seen: pennants.map((one) => one.visible), found: { ground: [...found.ground], ship: [...found.ship] } }),
      clock: () => ({ observer: ctx.values.observer, beta: ctx.values.speed, gamma: gamma(ctx.values.speed), mine: state.mine, own: state.own, shift: state.shift, dots: state.trail.length, laps: state.laps, ship: ship.position.x, ground: ground.position.x, squeeze: [ship.scale.x, ground.scale.x], light: { ground: lights.ground.position.toArray(), ship: lights.ship.position.toArray() }, trail: state.trail.slice(-3) }),
      update(dt) {
        if (!framed) { framed = true; if (tall()) view.look({ target: [0, 1.8, 0], r: 16.5, theta: 0, phi: 1.3 }); }
        if (stopSoon) { stopSoon = false; ctx.setPlaying(false); if (passing() && state.done) ctx.seek(state.mine); }
        if (tipTime > 0) { tipTime -= dt; if (tipTime <= 0) { tip.show(false); moved = true; } }
        if (!moved) return false;
        moved = false; draw();
        return true;
      },
    };
  },
};
