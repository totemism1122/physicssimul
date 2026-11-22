// P-05 Conservation of mechanical energy (3D).
//
// The roller coaster: a cart runs without friction on a curved track, after the textbook's figure of a roller
// coaster with bars for its energies. The track is shaped by five posts that are raised and lowered; the cart is
// put on the track wherever it should start and let go. As it runs, the potential energy m g h and the kinetic
// energy m v^2 / 2 change into each other and their sum stays the same. With friction switched on, the sum falls by
// the work done against friction, which turns into heat.
//
// Work and kinetic energy: a cart on a level track is pulled by a string that runs over a pulley to hanging weights,
// after the textbook's experiment with two photogates. The gates give the speed of the cart at two places a distance
// d apart; the work F d done on the cart by the pull of the string equals the change of its kinetic energy. For the cart
// and the weights together, the potential energy that the falling weights lose equals the kinetic energy that both gain.
//
// A weight on a spring: a spring hangs from a stand with a weight on it, after the textbook's experiment; pulled down
// and let go, the weight swings up and down, and its potential energy from gravity, the potential energy of the spring
// and its kinetic energy change into one another while their sum stays the same. The spring can also be laid along a
// track with a cart on its end, where only the last two take part.
//
// What is set by hand can be set from the menu as well, over the same ranges and in the same steps.
// Lengths are life-size: one unit of the scene is 10 cm. g = 9.8 m/s^2.
const RED = '#e58373', BLUE = '#7fa6e6', GOLD = '#e3c26b', GREY = '#b9bfce';
const joules = (e) => `${e.toFixed(2)} J`;
// to three places; a value that ends in 5 goes up whichever side of it the arithmetic left it (0.3375 is 0.338 every time, so that equal sums are written alike)
const milli = (value) => (Math.round(value * 1000 + 1e-6) / 1000).toFixed(3);
const coasting = (values) => values.scene === 'coaster', working = (values) => values.scene === 'work', springy = (values) => values.scene === 'spring';   // which arrangement an item of a menu belongs to
const hung = (values) => springy(values) && values.way !== 'level', laid = (values) => springy(values) && values.way === 'level';   // the spring upright, or along the track
const GREEN = '#8fc7a4', it = (text) => `<i style="font-family: Georgia, serif">${text}</i>`;
const SWING = { window: 4, range: 0.1, read: (e) => `${milli(e)} J` };   // the weight swings fast: a graph shows the last 4 s
const V1 = '<i style="font-family: Georgia, serif">v</i><sub>1</sub>', V2 = '<i style="font-family: Georgia, serif">v</i><sub>2</sub>';
const GATE_AT = { kind: 'slider', step: 0.01, digits: 2, unit: ' m', when: working };
const ENERGY = { window: 12, range: 2, read: joules };
const POSTS = ['①', '②', '③', '④', '⑤'];
const HEIGHT = { kind: 'slider', min: 0.03, max: 1, step: 0.01, digits: 2, unit: ' m', when: coasting };

export default {
  // what is taken for granted, written on screen by the frame
  premise: (v, advanced) => (v.scene === 'work' ? '마찰과 공기 저항은 없고, 줄과 도르래의 질량은 무시합니다' : v.scene === 'spring' ? '용수철의 질량과 마찰, 공기 저항은 없다고 봅니다'
    : advanced && v.body === 'ball' ? '공은 미끄러지지 않고 구르며, 공기 저항은 없다고 봅니다' : v.friction ? '공기 저항은 없다고 봅니다' : '마찰과 공기 저항은 없다고 봅니다'),
  fixedViews: ['front', 'top'],
  camera: { target: [0, 2.1, 0], r: 16.5, theta: 0.2, phi: 1.2, rMax: 34 },
  stepTime: 0.02,                 // "one step at a time" moves on by this many seconds
  traces: {
    eP: ENERGY, eK: ENERGY, eT: ENERGY, eH: ENERGY, speed: { window: 12, range: 1, read: (v) => `${v.toFixed(2)} m/s` },
    // against the distance gone since the first photogate (m), not against time
    sG: SWING, sS: SWING, sK: SWING, sT: SWING, sV: { window: 4, range: 0.5, read: (v) => `${v.toFixed(2)} m/s` },
    fs: { window: 0.72, range: 1, read: (f) => `${f.toFixed(2)} N` }, ks: { window: 0.72, range: 0.2, read: joules },
  },
  charts: {
    energy: { names: ['위치 에너지', '운동 에너지', '합'], colors: [BLUE, RED, GOLD], groups: ['J'], range: 2, read: (e) => e.toFixed(2) },
    work: { names: ['받은 일', '운동 에너지 변화량'], colors: [GOLD, RED], groups: ['J'], signed: false, range: 0.2, read: (e) => e.toFixed(2) },
    // the cart and the weights together: what the weights lose in potential energy, and what each gains in kinetic energy
    spring: { names: ['위치(중력)', '위치(탄성력)', '운동', '합'], colors: [BLUE, GREEN, RED, GOLD], groups: ['J'], signed: false, range: 0.1, read: milli },
    system: { names: ['위치 에너지 감소량', '운동 에너지 증가량'], colors: [BLUE, RED], groups: ['추', '수레', '전체'], signed: false, range: 0.2, read: milli },
  },
  menus: {
    vars: [
      { id: 'scene', label: '장면 선택', kind: 'choice', value: 'coaster', options: [{ id: 'coaster', label: '롤러코스터' }, { id: 'work', label: '일과 운동 에너지' }, { id: 'spring', label: '용수철' }] },
      { id: 'way', label: '용수철의 방향', kind: 'choice', value: 'upright', when: springy, options: [{ id: 'upright', label: '연직' }, { id: 'level', label: '수평' }] },
      { id: 'bob', label: '질량', kind: 'slider', min: 0.1, max: 0.3, step: 0.05, value: 0.2, digits: 2, unit: ' kg', when: springy },
      { id: 'stiff', label: '용수철 상수', kind: 'slider', min: 10, max: 30, step: 5, value: 20, unit: ' N/m', when: springy },
      { id: 'pull', label: '당긴 길이', kind: 'slider', min: 0.01, max: 0.15, step: 0.01, value: 0.08, digits: 2, unit: ' m', when: springy },
      { id: 'body', label: '물체', kind: 'choice', value: 'cart', advanced: true, when: coasting, options: [{ id: 'cart', label: '수레' }, { id: 'ball', label: '구르는 공' }] },
      { id: 'mass', label: '질량', kind: 'slider', min: 0.5, max: 2, step: 0.5, value: 1, digits: 1, unit: ' kg', when: coasting },
      { id: 'start', label: '출발 위치', kind: 'slider', min: 0.02, max: 1.38, step: 0.01, value: 0.02, digits: 2, unit: ' m', when: coasting },
      ...[0.36, 0.16, 0.07, 0.2, 0.28].map((value, i) => ({ id: `h${i + 1}`, label: `${POSTS[i]} 높이`, value, ...HEIGHT })),
      { id: 'friction', label: '마찰', kind: 'toggle', when: (v) => coasting(v) && v.body !== 'ball' },
      { id: 'mu', label: '마찰 계수', kind: 'slider', min: 0.05, max: 0.3, step: 0.05, value: 0.1, digits: 2, when: (v) => coasting(v) && v.friction === true, advanced: true },
      { id: 'ground', label: '기준점의 높이', kind: 'slider', min: 0, max: 1, step: 0.01, value: 0, digits: 2, unit: ' m', advanced: true, when: coasting },
      { id: 'hang', label: '추의 질량', kind: 'slider', min: 0.1, max: 0.5, step: 0.1, value: 0.1, digits: 1, unit: ' kg', when: working },
      { id: 'cartMass', label: '수레의 질량', kind: 'slider', min: 1, max: 3, step: 0.5, value: 1, digits: 1, unit: ' kg', when: working },
      { id: 'gate1', label: '포토게이트 1 위치', min: 0, max: 0.6, value: 0.1, ...GATE_AT },
      { id: 'gate2', label: '포토게이트 2 위치', min: 0.1, max: 0.7, value: 0.5, ...GATE_AT },
    ],
    graph: [
      { id: 'energy', label: '에너지 막대', kind: 'graph', bars: 'energy', when: coasting },
      { id: 'energyTime', label: '에너지–시간', kind: 'graph', x: '시간', when: coasting, plots: [{ y: '에너지', lines: [{ trace: 'eP', color: BLUE, name: '위치' }, { trace: 'eK', color: RED, name: '운동' }, { trace: 'eT', color: GOLD, name: '합' }, { trace: 'eH', color: GREY, name: '열' }] }] },
      { id: 'speedTime', label: '속력–시간', kind: 'graph', x: '시간', plots: [{ y: '속력', trace: 'speed' }], advanced: true, when: coasting },
      { id: 'springBars', label: '에너지 막대', kind: 'graph', bars: 'spring', when: springy },
      { id: 'springTime', label: '에너지–시간', kind: 'graph', x: '시간', when: hung, plots: [{ y: '에너지', lines: [{ trace: 'sG', color: BLUE, name: '중력' }, { trace: 'sS', color: GREEN, name: '탄성력' }, { trace: 'sK', color: RED, name: '운동' }, { trace: 'sT', color: GOLD, name: '합' }] }] },
      { id: 'laidTime', label: '에너지–시간', kind: 'graph', x: '시간', when: laid, plots: [{ y: '에너지', lines: [{ trace: 'sS', color: GREEN, name: '탄성력' }, { trace: 'sK', color: RED, name: '운동' }, { trace: 'sT', color: GOLD, name: '합' }] }] },
      { id: 'swingSpeed', label: '속력–시간', kind: 'graph', x: '시간', plots: [{ y: '속력', trace: 'sV' }], advanced: true, when: springy },
      { id: 'workBars', label: '일과 운동 에너지', kind: 'graph', bars: 'work', when: working },
      // the area under the force is the work done; both graphs start at the first photogate
      { id: 'forceDistance', label: '힘–이동 거리', kind: 'graph', x: '이동 거리', xUnit: 'm', plots: [{ y: '힘', trace: 'fs', area: 'J' }], when: working },
      { id: 'kineticDistance', label: '운동 에너지–이동 거리', kind: 'graph', x: '이동 거리', xUnit: 'm', plots: [{ y: '운동 에너지', trace: 'ks' }], when: working },
      { id: 'systemBars', label: '역학적 에너지 보존', kind: 'graph', bars: 'system', when: working },
    ],
    time: [
      { id: 'slow', label: '느리게', kind: 'toggle' },
      { id: 'reset', label: '처음으로', kind: 'action' },
      { id: 'step', label: '한 단계씩', kind: 'action', advanced: true },
    ],
    layers: [
      { id: 'pullArrow', label: '힘 화살표', kind: 'toggle', when: working },
      { id: 'velocityArrow', label: '속도 화살표', kind: 'toggle' },
      { id: 'heightMark', label: '높이', kind: 'toggle', when: coasting },
      { id: 'stretchMark', label: '늘어난 길이', kind: 'toggle', when: springy },
      { id: 'numbers', label: '값', kind: 'toggle' },
      { id: 'forceArrow', label: '힘 화살표', kind: 'toggle', advanced: true, when: (v) => !working(v) },
    ],
    inquiry: [
      { id: 'table', label: '기록 표', kind: 'table', wide: true, rows: 7, when: coasting, text: '수레가 출발할 때와 기둥 위를 지날 때마다 한 줄씩 적힙니다.',
        columns: [{ label: '지점' }, { label: '높이', unit: 'm' }, { label: '속력', unit: 'm/s' }, { label: '위치 에너지', unit: 'J', result: true }, { label: '운동 에너지', unit: 'J', result: true }, { label: '합', unit: 'J', result: true }] },
      { id: 'workTable', label: '기록 표: 일과 운동 에너지', kind: 'table', wide: true, when: working, text: '수레가 포토게이트 2를 지날 때마다 한 줄씩 적힙니다. 거리는 두 포토게이트 사이의 거리입니다.',
        columns: [{ label: '거리', unit: 'm' }, { label: '질량', unit: 'kg' }, { label: V1, unit: 'm/s', result: true }, { label: V2, unit: 'm/s', result: true }, { label: '힘', unit: 'N', result: true },
          { label: '받은 일', unit: 'J', result: true }, { label: '운동 에너지 변화량', unit: 'J', result: true }] },
      { id: 'systemTable', label: '기록 표: 역학적 에너지', kind: 'table', wide: true, when: working, text: '두 포토게이트 사이에서 추가 잃은 위치 에너지와 수레와 추가 얻은 운동 에너지입니다.',
        columns: [{ label: '거리', unit: 'm' }, { label: '추의<br>위치 에너지<br>감소량', unit: 'J', result: true }, { label: '수레의<br>운동 에너지<br>증가량', unit: 'J', result: true },
          { label: '추의<br>운동 에너지<br>증가량', unit: 'J', result: true }, { label: '운동 에너지<br>증가량의<br>합', unit: 'J', result: true }] },   // narrow headings, so that the table fits an upright phone
      // as the table of the textbook's experiment: the lowest point, the highest point and O, where it is fastest
      { id: 'springTable', label: '기록 표', kind: 'table', wide: true, rows: 6, when: hung, text: '추를 놓은 최저점, 가장 빠른 O 지점, 최고점에서 한 줄씩 적힙니다. h는 최저점에서 잰 높이, x는 용수철의 늘어난 길이입니다.',
        columns: [{ label: '지점' }, { label: it('h'), unit: 'm' }, { label: it('mgh'), unit: 'J', result: true }, { label: it('v'), unit: 'm/s' }, { label: `½${it('mv')}²`, unit: 'J', result: true },
          { label: it('x'), unit: 'm' }, { label: `½${it('kx')}²`, unit: 'J', result: true }, { label: '합', unit: 'J', result: true }] },
      { id: 'laidTable', label: '기록 표', kind: 'table', wide: true, rows: 6, when: laid, text: '수레를 놓은 곳, 가장 빠른 O 지점, 반대쪽 끝에서 한 줄씩 적힙니다. x는 용수철의 늘어난 길이입니다.',
        columns: [{ label: '지점' }, { label: it('x'), unit: 'm' }, { label: `½${it('kx')}²`, unit: 'J', result: true }, { label: it('v'), unit: 'm/s' }, { label: `½${it('mv')}²`, unit: 'J', result: true }, { label: '합', unit: 'J', result: true }] },
    ],
  },

  // writing on the chalkboard (1024 x 400)
  board(g) {
    g.fillStyle = 'rgba(255,255,255,0.9)'; g.font = '56px Georgia, serif'; g.fillText('역학적 에너지 보존', 60, 96);
    g.font = 'italic 56px Georgia, serif'; g.fillText('E = E', 60, 210); g.fillText('+ E', 268, 210); g.fillText('mgh + ½mv² = 일정', 60, 320);
    g.font = 'italic 30px Georgia, serif'; g.fillText('P', 222, 226); g.fillText('K', 372, 226);
    g.strokeStyle = 'rgba(255,255,255,0.8)'; g.lineWidth = 5;
    g.beginPath(); g.moveTo(640, 110); g.bezierCurveTo(720, 110, 740, 320, 820, 320); g.bezierCurveTo(880, 320, 900, 200, 960, 180); g.stroke();
  },

  // Builds the apparatus on the bench (world) and returns { update(dt) }.
  create({ T, kit, world, view, ctx }) {
    const { mat, add, box, cyl, canvasTexture, letterTexture, roundedBox, Helix } = kit;
    world.userData.things.visible = false;   // the track takes the whole bench
    const G = 9.8;
    const M = {
      rail: mat(0xc9cedb, { roughness: 0.5 }), steel: mat(0x8f96a8), dark: mat(0x3a4057), body: mat(0xd9584a), wheel: mat(0x2f3446), knob: mat(0xe3a52b), ball: mat(0xd9584a),
      runner: mat(0xe4e7ee, { roughness: 0.5 }), deck: mat(0xf1eee8), brass: mat(0xc9a35a, { roughness: 0.7 }), brassDark: mat(0xad8843, { roughness: 0.7 }), red: mat(0xc8392f), cord: mat(0x4b5163),
    };
    const INK = { velocity: 0x1f9d6b, weight: 0x9a3fc2, normal: 0x3f6fd0, mark: 0x1d2440 };
    const UP = new T.Vector3(0, 1, 0), DOWN = new T.Vector3(0, -1, 0), RIGHT = new T.Vector3(1, 0, 0), LEFT = new T.Vector3(-1, 0, 0), aim = new T.Vector3();
    const working = () => ctx.values.scene === 'work', swinging = () => ctx.values.scene === 'spring', hanging = () => ctx.values.way !== 'level';

    // ---------- the track: a smooth curve through the tops of five posts, in the upright plane through the middle of the bench ----------
    // XS: where the posts stand (units). The curve between two posts is a cubic that takes the slope at each post from its
    // neighbours (a Catmull-Rom curve), so raising one post bends the track only near it.
    const XS = [-7, -3.5, 0, 3.5, 7], SPAN = 3.5, EDGE = 6.8;   // EDGE: how far from the middle the cart can go
    const tops = () => XS.map((_, i) => ctx.values[`h${i + 1}`] * 10);
    let H = tops();
    const slope = (i) => (i === 0 ? H[1] - H[0] : i === 4 ? H[4] - H[3] : (H[i + 1] - H[i - 1]) / 2);   // per span
    // the height of the track at x, with its first and second derivative (all in units of the scene)
    function shape(x, out = {}) {
      const i = Math.max(0, Math.min(3, Math.floor((x - XS[0]) / SPAN))), t = (x - XS[i]) / SPAN, a = H[i], b = H[i + 1], m = slope(i), n = slope(i + 1);
      out.y = (2 * t ** 3 - 3 * t * t + 1) * a + (t ** 3 - 2 * t * t + t) * m + (-2 * t ** 3 + 3 * t * t) * b + (t ** 3 - t * t) * n;
      out.d1 = ((6 * t * t - 6 * t) * a + (3 * t * t - 4 * t + 1) * m + (-6 * t * t + 6 * t) * b + (3 * t * t - 2 * t) * n) / SPAN;
      out.d2 = ((12 * t - 6) * a + (6 * t - 4) * m + (-12 * t + 6) * b + (6 * t - 2) * n) / SPAN / SPAN;
      return out;
    }
    const track = new T.Group(); world.add(track);
    const rails = [0.2, -0.2].map((z) => { const rail = new T.Mesh(new T.BufferGeometry(), M.rail); rail.castShadow = true; rail.userData.z = z; track.add(rail); return rail; });
    const posts = XS.map((x, i) => {
      const post = add(track, cyl(0.06, 0.06, 1, 12).translate(0, 0.5, 0), M.steel, x, 0, 0);
      add(track, box(0.7, 0.06, 0.9), M.dark, x, 0.03, 0);
      const number = new T.Mesh(new T.PlaneGeometry(0.42, 0.42), new T.MeshBasicMaterial({ map: letterTexture(String(i + 1)), transparent: true }));
      number.position.set(x, 0.065, 0.62); number.rotation.x = -Math.PI / 2; track.add(number);
      const knob = add(track, new T.SphereGeometry(0.16, 18, 12), M.knob, x, 0, 0.42);   // what the post is raised by
      const handle = add(track, box(0.9, 0.9, 1.2), M.dark, x, 0, 0.2, false, false); handle.visible = false;
      handle.userData.grip = { kind: 'post', i };
      return { post, knob, handle };
    });
    const point = {}, curve = [];
    function lay() {   // the rails and posts are made anew for the heights set
      H = tops();
      for (const rail of rails) {
        curve.length = 0;
        for (let k = 0; k <= 70; k++) { const x = XS[0] + (XS[4] - XS[0]) * k / 70; curve.push(new T.Vector3(x, shape(x, point).y, rail.userData.z)); }
        rail.geometry.dispose(); rail.geometry = new T.TubeGeometry(new T.CatmullRomCurve3(curve), 140, 0.04, 6, false);
      }
      posts.forEach(({ post, knob, handle }, i) => { post.scale.y = H[i] - 0.03; knob.position.y = handle.position.y = H[i] - 0.22; });
      moved = true;
    }

    // ---------- the cart (and, advanced, a ball that rolls) ----------
    const rider = new T.Group(); world.add(rider);
    const car = new T.Group(); rider.add(car);
    add(car, roundedBox(0.72, 0.24, 0.5, 0.06), M.body, 0, 0.27, 0);
    for (const x of [-0.24, 0.24]) for (const z of [-1, 1]) add(car, cyl(0.09, 0.09, 0.08, 16), M.wheel, x, 0.09, z * 0.2).rotation.x = Math.PI / 2;
    const ROUND = 0.26, ball = new T.Group(); ball.position.y = ROUND; rider.add(ball);
    add(ball, new T.SphereGeometry(ROUND, 28, 18), M.ball, 0, 0, 0);
    add(ball, new T.TorusGeometry(ROUND + 0.004, 0.022, 6, 36), mat(0xf4f1ea), 0, 0, 0, false).rotation.y = Math.PI / 2;   // a band, so that the rolling shows
    const riderHandle = add(rider, box(1.2, 1.0, 1.0), M.dark, 0, 0.35, 0, false, false); riderHandle.visible = false;
    riderHandle.userData.grip = { kind: 'rider' };

    // ---------- marks ----------
    const speedArrow = kit.arrow(INK.velocity, 0.045), weightArrow = kit.arrow(INK.weight, 0.04), normalArrow = kit.arrow(INK.normal, 0.04);
    const line = (color) => { const one = new T.Mesh(box(0.028, 1, 0.028).translate(0, 0.5, 0), new T.MeshBasicMaterial({ color, depthTest: false, transparent: true, opacity: 0.85 })); one.renderOrder = 10; return one; };
    const heightLine = line(INK.mark), groundLine = new T.Mesh(box(15, 0.02, 1.4), new T.MeshBasicMaterial({ color: 0x3f6fd0, transparent: true, opacity: 0.35, depthWrite: false }));
    world.add(speedArrow); track.add(weightArrow, normalArrow, heightLine, groundLine);   // the speed arrow serves both arrangements
    const spot = new T.Vector3(), label = view.label(spot, true, 0.25), heightSpot = new T.Vector3(), heightLabel = view.label(heightSpot), tipSpot = new T.Vector3(), tip = view.label(tipSpot);
    const NEWTON = 0.08, PER_SPEED = 0.5;   // lengths of the arrows for 1 N and for 1 m/s

    // ---------- physics ----------
    // Along the track the cart speeds up by the part of gravity that points along it: a = −g sin(slope). Its speed at
    // any height then follows from m g h + m v^2 / 2 = the same as at the start, so v = sqrt(2 g (h0 − h)); the speed
    // found step by step is set to that at every step, which keeps the sum of the energies exact.
    // A rolling ball also turns: of the energy that gravity gives it, 5/7 goes into moving along and 2/7 into turning
    // (a solid ball that does not slip), so a = −(5/7) g sin(slope) and m v^2 / 2 + (1/5) m v^2 = m g (h0 − h).
    // With friction (the cart only) the track drags on the cart with mu N, where N is the push of the track on the cart:
    // N = m (g cos + v^2 x curvature). The mechanical energy then falls, and what is lost has turned into heat.
    const run = { state: 'ready', t: 0, x: 0, v: 0, top: 0, m: 1, share: 1, mu: 0, grid: -1, turned: 0 };   // x: along the bench (units); v: along the track (m/s); top: the height it started from (units)
    const here = {}, STEP = 0.02;
    const rolling = () => ctx.advanced && ctx.values.body === 'ball';
    const levelOf = () => (ctx.advanced ? ctx.values.ground : 0);   // heights are measured from here (m)
    // the energies at height y (units) and speed v: potential, kinetic (of a ball: moving along and turning together), and their sum
    function energies(y, v, m = run.m, share = run.share) { const p = m * G * (y / 10 - levelOf()), k = m * v * v / 2 / share; return [p, k, p + k]; }
    function note(name, y, v) { const [p, k, sum] = energies(y, v); ctx.tables.table.add([name, (y / 10 - levelOf()).toFixed(2), v.toFixed(2), p.toFixed(2), k.toFixed(2), sum.toFixed(2)]); }
    function go(dt) {
      for (let n = Math.ceil(dt / 0.0005), h = dt / n, i = 0; i < n && run.state === 'run'; i++) {
        const before = run.x, { d1, d2 } = shape(run.x, here), steep = Math.sqrt(1 + d1 * d1), drive = -run.share * G * d1 / steep;
        if (run.mu) {
          const drag = run.mu * Math.max(0, G / steep + run.v * run.v * d2 * 10 / steep ** 3);   // friction for each kg
          if (Math.abs(run.v) < 1e-3 && Math.abs(drive) <= drag) { run.v = 0; run.state = 'done'; break; }   // too gentle a slope to move it: it stays
          const next = run.v + (drive - Math.sign(run.v || drive) * drag) * h;
          run.v = run.v !== 0 && next * run.v < 0 ? 0 : next;   // friction slows it to a stop; it does not push it back
        } else run.v += drive * h;
        run.x += run.v * h / steep * 10;
        const y = shape(run.x, here).y, fallen = (run.top - y) / 10;
        if (!run.mu && fallen > 2e-4) run.v = Math.sign(run.v) * Math.sqrt(2 * run.share * G * fallen);
        run.turned += (run.x - before) * steep;   // how far it has gone along the track, for the turning of the ball
        for (let k = 0; k < 5; k++) if ((before - XS[k]) * (run.x - XS[k]) < 0) note(POSTS[k], H[k], run.mu ? Math.abs(run.v) : Math.sqrt(Math.max(0, 2 * run.share * G * (run.top - H[k]) / 10)));
        if (Math.abs(run.x) >= EDGE) { run.x = Math.sign(run.x) * EDGE; run.state = 'done'; }   // the end of the track
      }
    }

    // ---------- state ----------
    let moved = true, stopSoon = false, tipTime = 0, framed = false, grab = null;
    function say(text, x, y, seconds = 0) { tip.write(text); tipSpot.set(x, y, 0); tip.show(true); tipTime = seconds; moved = true; }
    const startX = () => -7 + ctx.values.start * 10;
    const rubbing = () => (ctx.values.friction && !rolling() ? (ctx.advanced ? ctx.values.mu : 0.1) : 0);   // the coefficient of friction in use
    // the mechanical energy it started with less what it has now: turned into heat by friction
    const heat = () => (run.state === 'ready' || !run.mu ? 0 : Math.max(0, run.m * G * (run.top / 10 - levelOf()) - energies(shape(run.x, here).y, run.v)[2]));
    function bars() {
      const chart = ctx.charts.energy, ready = run.state === 'ready', warm = ready ? rubbing() > 0 : run.mu > 0;
      chart.names = warm ? ['위치 에너지', '운동 에너지', '합', '열'] : ['위치 에너지', '운동 에너지', '합'];   // "열": what has turned into heat, named as in the graph against time chart.colors = [BLUE, RED, GOLD, GREY];
      const now = energies(shape(run.x, here).y, run.v, ready ? ctx.values.mass : run.m, ready ? (rolling() ? 5 / 7 : 1) : run.share);
      chart.set(0, warm ? [...now, heat()] : now);
    }
    function toStart() { Object.assign(run, { state: 'ready', t: 0, x: startX(), v: 0, turned: 0 }); bars(); moved = true; }
    function launch() {
      Object.assign(run, { state: 'run', t: 0, x: startX(), v: 0, m: ctx.values.mass, share: rolling() ? 5 / 7 : 1, mu: rubbing(), grid: -1, turned: 0 });
      run.top = shape(run.x, here).y;
      for (const trace of Object.values(ctx.traces)) trace.clear();
      note('출발', run.top, 0);
      ctx.seek(0); advance(0);
    }
    function advance(dt) {
      go(dt); run.t += dt;
      while ((run.grid + 1) * STEP <= run.t + 1e-9) {   // the energies against time
        const t = ++run.grid * STEP, [p, k, sum] = energies(shape(run.x, here).y, run.v);
        ctx.traces.eP.add(t, p); ctx.traces.eK.add(t, k); ctx.traces.eT.add(t, sum); ctx.traces.eH.add(t, heat()); ctx.traces.speed.add(t, Math.abs(run.v));
      }
      bars(); moved = true;
      if (run.state === 'run' && run.t > 12) run.state = 'done';   // a cart that swings between two hills is left to it for a while
      if (run.state === 'done') { stopSoon = true; if (run.mu && run.turned === 0) say('마찰 때문에 움직이지 않습니다', run.x, shape(run.x, here).y + 1.6, 2.5); }
    }

    // ==================== work and kinetic energy ====================
    // ---------- a level track, with a rule in cm on the bench beside it ----------
    const RAIL = { half: 8.2, top: 0.46 }, START = -1.7, RUN = 0.7;   // the cart starts with its middle at START and runs RUN metres
    const rig = new T.Group(); world.add(rig);
    add(rig, box(RAIL.half * 2, 0.16, 0.9), M.rail, 0, 0.33, 0);
    add(rig, box(RAIL.half * 2, 0.012, 0.22), M.steel, 0, 0.416, 0, false);
    for (const z of [-0.3, 0.3]) add(rig, box(RAIL.half * 2, 0.05, 0.14), M.runner, 0, 0.435, z);
    for (const x of [-6.2, 6.2]) add(rig, box(0.5, 0.25, 0.9), M.steel, x, 0.125, 0);
    const RULE = { from: START - 0.3, to: START + 8.2, z: 0.88, wide: 0.5 };   // 0 where the cart starts
    add(rig, box(RULE.to - RULE.from, 0.03, RULE.wide), mat(0xf2d675), (RULE.from + RULE.to) / 2, 0.015, RULE.z);
    add(rig, new T.PlaneGeometry(RULE.to - RULE.from, RULE.wide), mat(0xffffff, { map: canvasTexture(2048, 120, (g, w, h) => {
      g.fillStyle = '#f2d675'; g.fillRect(0, 0, w, h); g.strokeStyle = g.fillStyle = '#4a3f1c';
      g.font = '700 46px Helvetica, Arial, sans-serif'; g.textAlign = 'center';
      const px = w / (RULE.to - RULE.from) / 10, at = (c) => (START - RULE.from) * 10 * px + c * px;   // px: pixels to a cm
      for (let c = 0; at(c) < w - 4; c++) {
        const long = c % 10 === 0 ? 0.42 : c % 5 === 0 ? 0.3 : 0.17;
        g.lineWidth = c % 10 === 0 ? 5 : 2.5; g.beginPath(); g.moveTo(at(c), 0); g.lineTo(at(c), h * long); g.stroke();
        if (c % 10 === 0) g.fillText(String(c), at(c), h - 18);
      }
    }) }), (RULE.from + RULE.to) / 2, 0.032, RULE.z, false).rotation.x = -Math.PI / 2;

    // ---------- the cart: 1 kg with its force sensor, a pile of weights of 0.5 kg, and a pointer over the rule ----------
    const CART = { half: 0.8, wide: 0.4, deck: 1.0, most: 4, slab: 0.16, hook: 0.22 };   // hook: the force sensor at the front, to which the string is tied
    const wagon = new T.Group(); rig.add(wagon);
    const wagonBody = add(wagon, roundedBox(CART.half * 2 - 0.08, 0.36, CART.wide * 2 - 0.08, 0.08), M.body, 0, 0.78, 0);
    add(wagon, box(CART.half * 2 - 0.3, 0.03, CART.wide * 2 - 0.22), M.deck, 0, CART.deck - 0.005, 0, false);
    for (const x of [-0.5, 0.5]) for (const z of [-1, 1]) {
      add(wagon, cyl(0.15, 0.15, 0.1, 22), M.wheel, x, RAIL.top + 0.15, z * 0.3).rotation.x = Math.PI / 2;
      add(wagon, cyl(0.06, 0.06, 0.03, 14), M.rail, x, RAIL.top + 0.15, z * 0.36, false).rotation.x = Math.PI / 2;
    }
    add(wagon, cyl(0.025, 0.025, 0.9, 10), M.steel, 0, CART.deck + 0.45, 0);
    const weights = Array.from({ length: CART.most }, (_, i) => add(wagon, cyl(0.32, 0.32, CART.slab - 0.012, 28), i % 2 ? M.brassDark : M.brass, 0, CART.deck + CART.slab / 2 + i * CART.slab, 0));
    add(wagon, box(0.03, 0.72, 0.03), M.dark, 0, 0.4, CART.wide + 0.2, false);
    add(wagon, box(0.03, 0.03, 0.2), M.dark, 0, 0.75, CART.wide + 0.1, false);
    add(wagon, box(CART.hook + 0.04, 0.2, 0.26), M.dark, CART.half + CART.hook / 2 - 0.04, 0.78, 0);
    const pileHandle = add(wagon, cyl(0.4, 0.4, 1, 14), M.dark, 0, CART.deck + 0.5, 0, false, false); pileHandle.visible = false;
    pileHandle.userData.grip = { kind: 'pile' }; wagonBody.userData.grip = { kind: 'go' };

    // ---------- two photogates: frames that stand over the track and the rule, each with a beam of light across the track ----------
    const GATE = { back: -0.62, front: 1.3, top: 2.3 }, GATES = [[0, 0.6], [0.1, 0.7]], GAP = 0.1;   // GATES: how far from the start each may stand (m), from where the cart starts to where it stops; GAP: the least between them
    const gates = [0, 1].map((i) => {
      const gate = new T.Group(), wide = GATE.front - GATE.back, mid = (GATE.back + GATE.front) / 2; rig.add(gate);
      for (const z of [GATE.back, GATE.front]) {
        add(gate, cyl(0.045, 0.045, GATE.top, 10).translate(0, GATE.top / 2, 0), M.dark, 0, 0, z);
        add(gate, box(0.5, 0.05, 0.36), M.dark, 0, 0.025, z);
        add(gate, box(0.12, 0.2, 0.1), M.steel, 0, 0.78, z + (z < 0 ? 0.06 : -0.06));   // the lamp, and the eye that watches it
      }
      add(gate, box(0.09, 0.09, wide + 0.09), M.dark, 0, GATE.top, mid);
      const beam = new T.Mesh(box(0.02, 0.02, wide - 0.2), new T.MeshBasicMaterial({ color: 0xff4a3d, transparent: true, opacity: 0.75 })); beam.position.set(0, 0.78, mid); gate.add(beam);
      add(gate, box(0.03, 0.012, RULE.wide), M.red, 0, 0.04, RULE.z, false);                // a line over the rule: where the gate stands
      add(gate, box(0.44, 0.44, 0.05), M.dark, 0, GATE.top + 0.3, GATE.front);
      const number = new T.Mesh(new T.PlaneGeometry(0.4, 0.4), new T.MeshBasicMaterial({ map: letterTexture(String(i + 1)), transparent: true }));
      number.position.set(0, GATE.top + 0.3, GATE.front + 0.03); gate.add(number);
      const handles = [add(gate, box(0.7, GATE.top + 0.7, 0.7), M.dark, 0, (GATE.top + 0.7) / 2, GATE.front, false, false), add(gate, box(0.7, 0.6, wide), M.dark, 0, GATE.top, mid, false, false)];
      for (const handle of handles) { handle.visible = false; handle.userData.grip = { kind: 'gate', i }; }
      return { group: gate, beam, handles };
    });

    // ---------- the pulley at the end of the bench, the string over it, and the hanging weights of 0.1 kg ----------
    const PULLEY = { x: 10.35, y: 0.48, r: 0.3 }, HANG = { top: -0.1, slab: 0.18, most: 5 };   // top: where the hanger starts, just under the pulley
    add(rig, box(0.5, 0.6, 0.6), M.steel, 9.75, 0.3, 0);                                    // the clamp on the edge of the bench
    for (const z of [-0.11, 0.11]) add(rig, box(0.75, 0.1, 0.04), M.steel, 10.0, PULLEY.y, z);
    const wheel = add(rig, cyl(PULLEY.r, PULLEY.r, 0.1, 32), M.deck, PULLEY.x, PULLEY.y, 0); wheel.rotation.x = Math.PI / 2;
    for (const y of [-0.052, 0.052]) add(wheel, cyl(0.045, 0.045, 0.01, 12), M.red, 0.18, y, 0, false);   // a mark that shows the wheel turning
    const strand = add(rig, cyl(0.014, 0.014, 1, 8).rotateZ(Math.PI / 2).translate(0.5, 0, 0), M.cord, 0, PULLEY.y + PULLEY.r, 0, false);   // from the cart to the top of the wheel
    add(rig, new T.TorusGeometry(PULLEY.r, 0.014, 6, 14, Math.PI / 2), M.cord, PULLEY.x, PULLEY.y, 0, false);                                 // over the wheel
    const drop = add(rig, cyl(0.014, 0.014, 1, 8).translate(0, -0.5, 0), M.cord, PULLEY.x + PULLEY.r, PULLEY.y, 0, false);                     // down to the hanger
    const hanger = new T.Group(); hanger.position.x = PULLEY.x + PULLEY.r; rig.add(hanger);
    const stem = add(hanger, cyl(0.022, 0.022, 1, 8).translate(0, -0.5, 0), M.steel, 0, 0, 0);
    const slabs = Array.from({ length: HANG.most }, (_, i) => add(hanger, cyl(0.26, 0.26, HANG.slab - 0.015, 26), i % 2 ? M.brassDark : M.brass, 0, -0.3 - HANG.slab / 2 - i * HANG.slab, 0));
    const plate = add(hanger, cyl(0.29, 0.29, 0.035, 26), M.steel, 0, 0, 0);
    const hangHandle = add(hanger, cyl(0.6, 0.6, 1.7, 14), M.dark, 0, -0.75, 0, false, false); hangHandle.visible = false;
    hangHandle.userData.grip = { kind: 'hang' };
    add(rig, box(1.5, 0.16, 1.5), mat(0x7d9a8c), PULLEY.x + PULLEY.r, -8.42, 0);          // a soft mat on the floor under the weights
    const pullArrow = kit.arrow(INK.weight, 0.045), hangWeight = kit.arrow(INK.weight, 0.045), hangLift = kit.arrow(INK.weight, 0.045); rig.add(pullArrow, hangWeight, hangLift);
    const hangSpot = new T.Vector3(), hangLabel = view.label(hangSpot, true), gateSpot = new T.Vector3(), gateLabel = view.label(gateSpot, true, -0.25);
    const PULL = 0.28;   // the length of these arrows for 1 N

    // ---------- physics ----------
    // The cart (M) and the hanging weights (m) have the same acceleration. For the weights m g − T = m a, for the cart
    // T = M a, so a = m g / (M + m) and the string pulls the cart with T = M a, which is less than the weight m g.
    // From rest: s = a t^2 / 2, v = a t, so v^2 = 2 a s at s metres from the start. Between the gates, d apart, the pull
    // does the work W = T d on the cart, and the kinetic energy of the cart changes by M v2^2 / 2 − M v1^2 / 2: the same.
    // The weights fall d as well and lose the potential energy m g d, which is what the cart and the weights gain in
    // kinetic energy together: m g d = (M + m)(v2^2 − v1^2) / 2. (The string takes T d from the weights and gives it to the cart.)
    // haul: one run. s: metres from the start; g1, g2: where the gates stand; passed: how many gates it has gone through.
    const haul = { state: 'ready', t: 0, s: 0, v: 0, M: 1, h: 0.1, a: 0, F: 0, g1: 0.1, g2: 0.5, v1: 0, v2: 0, passed: 0, grid: -1 };
    const SPACING = 0.005, round2 = (value) => Math.round(value * 100) / 100;
    const pile = () => Math.round(((haul.state === 'ready' ? ctx.values.cartMass : haul.M) - 1) / 0.5);   // weights on the cart
    // since the first gate: how far it has gone between the gates, and how much v^2 has grown
    const between = () => Math.max(0, Math.min(haul.s, haul.g2) - haul.g1);
    const faster = () => (haul.passed ? (haul.passed === 2 ? haul.v2 : haul.v) ** 2 - haul.v1 ** 2 : 0);
    // the work done on the cart and the change of its kinetic energy; the potential energy the weights have lost and the kinetic energy they have gained
    const done = () => haul.F * between(), gained = () => haul.M * faster() / 2, fallen = () => haul.h * G * between(), hangGained = () => haul.h * faster() / 2;
    function workBars() {
      ctx.charts.work.set(0, [done(), gained()]);
      const system = ctx.charts.system;
      system.set(0, [fallen(), hangGained()]); system.set(1, [0, gained()]); system.set(2, [fallen(), gained() + hangGained()]);
    }
    const work = {
      run: haul,
      toStart() { Object.assign(haul, { state: 'ready', t: 0, s: 0, v: 0, passed: 0 }); workBars(); moved = true; },
      launch() {
        const v = ctx.values, a = v.hang * G / (v.cartMass + v.hang);
        Object.assign(haul, { state: 'run', t: 0, s: 0, v: 0, M: v.cartMass, h: v.hang, a, F: v.cartMass * a, g1: v.gate1, g2: v.gate2, v1: 0, v2: 0, passed: 0, grid: -1 });
        for (const trace of Object.values(ctx.traces)) trace.clear();
        ctx.seek(0); work.advance(0);
      },
      advance(dt) {
        const end = Math.sqrt(2 * RUN / haul.a);   // when it reaches the end of its run
        haul.t = Math.min(end, haul.t + dt); haul.s = haul.a * haul.t ** 2 / 2; haul.v = haul.a * haul.t;
        if (haul.t >= end) haul.s = RUN;   // exactly at the end, where the second gate may stand
        if (haul.passed < 1 && haul.s >= haul.g1) { haul.passed = 1; haul.v1 = Math.sqrt(2 * haul.a * haul.g1); }
        // between the gates, every 5 mm: the pull of the string, and the kinetic energy M v^2 / 2 with v^2 = 2 a s
        for (const most = Math.floor((Math.min(haul.s, haul.g2) - haul.g1) / SPACING + 1e-6); haul.grid < most;) {
          const gone = ++haul.grid * SPACING;
          ctx.traces.fs.add(gone, haul.F); ctx.traces.ks.add(gone, haul.M * 2 * haul.a * (haul.g1 + gone) / 2);
        }
        if (haul.passed < 2 && haul.s >= haul.g2) {
          haul.passed = 2; haul.v2 = Math.sqrt(2 * haul.a * haul.g2);
          ctx.tables.workTable.add([(haul.g2 - haul.g1).toFixed(2), haul.M.toFixed(1), haul.v1.toFixed(3), haul.v2.toFixed(3), haul.F.toFixed(2), done().toFixed(2), gained().toFixed(2)]);
          ctx.tables.systemTable.add([(haul.g2 - haul.g1).toFixed(2), milli(fallen()), milli(gained()), milli(hangGained()), milli(gained() + hangGained())]);
        }
        workBars(); moved = true;
        if (haul.t >= end) { haul.state = 'done'; stopSoon = true; }
      },
      // what a handle sets
      dial: (grip) => (grip.kind === 'gate' ? `gate${grip.i + 1}` : grip.kind === 'hang' ? 'hang' : 'cartMass'),
      move(p) {
        const v = ctx.values, id = grab.id;
        const beside = grab.kind === 'gate' ? [gates[grab.i].group.position.x, GATE.top + 1.1] : grab.kind === 'hang' ? [hanger.position.x + 1.5, hanger.position.y - 0.3] : [wagon.position.x, CART.deck + pile() * CART.slab + 1.2];
        if (ctx.locked.has(id)) { say('잠금', ...beside); return; }
        if (grab.kind === 'gate') {   // along the track, 1 cm at a time; one gate pushes the other along
          const [least, most] = GATES[grab.i], to = round2(Math.max(least, Math.min(most, grab.value + (p.x - grab.from.x) / 10)));
          if (to !== v[id]) ctx.set(id, to);
          say(`${v[id].toFixed(2)} m`, START + v[id] * 10, beside[1]);
        } else {                      // the pile on the cart grows upwards, the hanging pile downwards
          const [least, most, step, travel, name] = grab.kind === 'hang' ? [0.1, 0.5, 0.1, HANG.slab, '추'] : [1, 3, 0.5, CART.slab, '수레'];
          const rise = (p.up - grab.from.up) / p.rise * (grab.kind === 'hang' ? -1 : 1);
          const to = Math.max(least, Math.min(most, Math.round((grab.value + Math.round(rise / travel) * step) * 10) / 10));
          if (to !== v[id]) ctx.set(id, to);
          say(`${name} ${v[id].toFixed(1)} kg`, ...beside);
        }
      },
      end() {},
      changed(id) {
        if (!['hang', 'cartMass', 'gate1', 'gate2'].includes(id)) return;
        const v = ctx.values;
        if (v.gate2 - v.gate1 < GAP - 1e-9) {   // the gates stay 10 cm apart at least: one pushes the other along, unless that one is locked
          const [other, way] = id === 'gate2' ? ['gate1', -1] : ['gate2', 1], from = other === 'gate1' ? 'gate2' : 'gate1';
          if (ctx.locked.has(other)) ctx.set(from, round2(v[other] - way * GAP)); else ctx.set(other, round2(v[from] + way * GAP));
          return;                               // which comes back here with the gates apart
        }
        if (haul.state !== 'ready') ctx.emit('action', 'reset'); else work.toStart();   // a run under way is taken back first
      },
      draw() {
        const v = ctx.values, ready = haul.state === 'ready', going = haul.state === 'run', n = pile(), h = ready ? v.hang : haul.h, many = Math.round(h * 10);
        const x = START + haul.s * 10, high = CART.deck + n * CART.slab, front = x + CART.half + CART.hook, y = HANG.top - haul.s * 10, deep = 0.3 + many * HANG.slab;
        wagon.position.x = x;
        weights.forEach((slab, i) => { slab.visible = i < n; });
        pileHandle.scale.y = n * CART.slab + 0.6; pileHandle.position.y = CART.deck + pileHandle.scale.y / 2;
        gates.forEach(({ group, beam }, i) => { group.position.x = START + v[`gate${i + 1}`] * 10; beam.visible = Math.abs(x - group.position.x) > CART.half; });   // the cart cuts the beam
        // the string pulls the cart, and the weights hang as much lower as the cart has gone
        hanger.position.y = y; slabs.forEach((slab, i) => { slab.visible = i < many; }); stem.scale.y = deep; plate.position.y = -deep - 0.018;
        strand.position.x = front; strand.scale.x = PULLEY.x - front; drop.scale.y = PULLEY.y - y; wheel.rotation.y = -haul.s * 10 / PULLEY.r;
        // before the start the cart is held, and at the end the weights rest on the mat: the pull of the string is shown while it runs
        pullArrow.visible = hangLift.visible = v.pullArrow && going; hangWeight.visible = v.pullArrow;
        if (pullArrow.visible) {
          pullArrow.position.set(x, 0.78, CART.wide + 0.35); pullArrow.setLength(PULL * haul.F); pullArrow.aim(RIGHT);
          hangLift.position.set(hanger.position.x, y, 0.4); hangLift.setLength(PULL * haul.F); hangLift.aim(UP);
        }
        if (hangWeight.visible) { hangWeight.position.set(hanger.position.x, y - 0.3 - many * HANG.slab / 2, 0.4); hangWeight.setLength(PULL * h * G); hangWeight.aim(DOWN); }
        speedArrow.visible = v.velocityArrow && going && haul.v > 0.02;
        if (speedArrow.visible) { speedArrow.position.set(x, high + 0.55, 0); speedArrow.setLength(PER_SPEED * haul.v); speedArrow.aim(RIGHT); }
        label.show(v.numbers); hangLabel.show(v.numbers); gateLabel.show(v.numbers);
        if (!v.numbers) return;
        const m = ready ? v.cartMass : haul.M;
        spot.set(x, high + 1.2, 0);
        label.write(ready ? `수레 ${m.toFixed(1)} kg`
          : going ? `수레 ${m.toFixed(1)} kg<br>줄이 당기는 힘 ${haul.F.toFixed(2)} N<br>속력 ${haul.v.toFixed(2)} m/s<br>운동 에너지 <b>${(m * haul.v * haul.v / 2).toFixed(2)} J</b>`
            : `수레 ${m.toFixed(1)} kg<br>받은 일 <b>${done().toFixed(2)} J</b><br>운동 에너지 변화량 <b>${gained().toFixed(2)} J</b>`);
        hangSpot.set(hanger.position.x + 1.7, y - 0.2, 0); hangLabel.write(`추 ${h.toFixed(1)} kg<br>무게 ${(h * G).toFixed(2)} N`);
        gateSpot.set(START + (v.gate1 + v.gate2) * 5, 0, GATE.front + 0.2);   // it hangs below the gates, clear of what is written over the cart
        gateLabel.write(`포토게이트 사이 거리 <b>${(v.gate2 - v.gate1).toFixed(2)} m</b>${ready || !haul.passed ? '' : `<br>${V1} ${haul.v1.toFixed(3)} m/s${haul.passed === 2 ? ` · ${V2} ${haul.v2.toFixed(3)} m/s` : ''}`}`);
      },
    };

    // ==================== a weight on a spring ====================
    // The spring is 0.20 m long by itself. Upright it hangs from the arm of a stand beside a rule whose 0 is at the end
    // of the spring by itself; level it is fixed to a block at the end of a track, with a rule whose 0 is at O.
    const SPRING = { top: 8.3, long: 2, wall: -2.6, axis: 0.78 }, REST = SPRING.top - SPRING.long, ORIGIN = SPRING.wall + SPRING.long;   // REST, ORIGIN: the free end of the spring by itself
    const swingRig = new T.Group(), stand = new T.Group(), bed = new T.Group(); world.add(swingRig); swingRig.add(stand, bed);
    const coilGeo = new T.TubeGeometry(new Helix(0.13, 11, 1), 240, 0.02, 8, false);   // one unit long: stretched by its scale
    // upright: the stand, the spring, the rule, and the weight (slabs of 0.05 kg on a hook)
    add(stand, box(3.6, 0.14, 2), M.dark, -0.8, 0.07, 0);
    add(stand, cyl(0.07, 0.07, SPRING.top + 0.6, 14).translate(0, (SPRING.top + 0.6) / 2, 0), M.steel, -2, 0, 0);
    add(stand, cyl(0.045, 0.045, 3.3, 12).rotateZ(Math.PI / 2), M.steel, -0.55, SPRING.top + 0.1, 0);
    add(stand, box(0.3, 0.34, 0.3), M.dark, -2, SPRING.top + 0.1, 0);
    const coil = add(stand, coilGeo, M.steel, 0, SPRING.top + 0.06, 0); coil.rotation.x = Math.PI;   // it hangs down
    const SCALE = { x: 0.85, top: REST + 0.6, long: 6.4, wide: 0.5 };   // the rule: from 6 cm above the end of the spring to 58 cm below it
    add(stand, box(SCALE.wide, SCALE.long, 0.05), mat(0xf2d675), SCALE.x, SCALE.top - SCALE.long / 2, -0.03);
    add(stand, box(0.05, SPRING.top + 0.1 - SCALE.top, 0.05), M.steel, SCALE.x, (SPRING.top + 0.1 + SCALE.top) / 2, -0.03);
    add(stand, new T.PlaneGeometry(SCALE.wide, SCALE.long), mat(0xffffff, { map: canvasTexture(128, 1638, (g, w, h) => {
      g.fillStyle = '#f2d675'; g.fillRect(0, 0, w, h); g.strokeStyle = g.fillStyle = '#4a3f1c';
      g.font = '700 44px Helvetica, Arial, sans-serif'; g.textAlign = 'right'; g.textBaseline = 'middle';
      const px = h / SCALE.long / 10, at = (c) => (SCALE.top - REST) * 10 * px + c * px;   // px: pixels to a cm
      for (let c = -5; at(c) < h - 4; c++) {
        const long = c % 10 === 0 ? 0.42 : c % 5 === 0 ? 0.3 : 0.17;
        g.lineWidth = c % 10 === 0 ? 5 : 2.5; g.beginPath(); g.moveTo(0, at(c)); g.lineTo(w * long, at(c)); g.stroke();
        if (c % 10 === 0 && c >= 0) g.fillText(String(c), w - 8, at(c));
      }
    }) }), SCALE.x, SCALE.top - SCALE.long / 2, 0, false);
    const bob = new T.Group(); stand.add(bob);   // its top is the end of the spring
    add(bob, cyl(0.02, 0.02, 0.3, 8), M.steel, 0, -0.15, 0);
    add(bob, box(0.6, 0.02, 0.02), M.red, 0.3, 0, 0, false);                                // a pointer to the rule
    const bobSlabs = Array.from({ length: 6 }, (_, i) => add(bob, cyl(0.3, 0.3, 0.128, 26), i % 2 ? M.brassDark : M.brass, 0, -0.37 - i * 0.14, 0));
    const bobHandle = add(bob, cyl(0.8, 0.8, 1.9, 14), M.dark, 0, -0.6, 0, false, false); bobHandle.visible = false;
    // level: the block, the spring, a short track with a rule, and the cart (0.1 kg, with slabs of 0.05 kg)
    add(bed, box(6.8, 0.16, 0.9), M.rail, 0.6, 0.33, 0);
    for (const z of [-0.3, 0.3]) add(bed, box(6.8, 0.05, 0.14), M.runner, 0.6, 0.435, z);
    add(bed, box(0.4, 1.3, 1.1), M.dark, SPRING.wall - 0.2, 0.65, 0);
    const flatCoil = add(bed, coilGeo, M.steel, SPRING.wall, SPRING.axis, 0); flatCoil.rotation.z = -Math.PI / 2;   // along the track
    const TAPE = { from: ORIGIN - 1.9, to: ORIGIN + 2.1, z: 0.85, wide: 0.5 };
    add(bed, box(TAPE.to - TAPE.from, 0.03, TAPE.wide), mat(0xf2d675), (TAPE.from + TAPE.to) / 2, 0.015, TAPE.z);
    add(bed, new T.PlaneGeometry(TAPE.to - TAPE.from, TAPE.wide), mat(0xffffff, { map: canvasTexture(1024, 128, (g, w, h) => {
      g.fillStyle = '#f2d675'; g.fillRect(0, 0, w, h); g.strokeStyle = g.fillStyle = '#4a3f1c';
      g.font = '700 46px Helvetica, Arial, sans-serif'; g.textAlign = 'center';
      const px = w / (TAPE.to - TAPE.from) / 10, at = (c) => (ORIGIN - TAPE.from) * 10 * px + c * px;
      for (let c = -18; at(c) < w - 4; c++) {
        const long = c % 10 === 0 ? 0.42 : c % 5 === 0 ? 0.3 : 0.17;
        g.lineWidth = c % 10 === 0 ? 5 : 2.5; g.beginPath(); g.moveTo(at(c), 0); g.lineTo(at(c), h * long); g.stroke();
        if (c % 10 === 0) g.fillText(c < 0 ? `−${-c}` : String(c), at(c), h - 18);
      }
    }) }), (TAPE.from + TAPE.to) / 2, 0.032, TAPE.z, false).rotation.x = -Math.PI / 2;
    const glider = new T.Group(); bed.add(glider);   // its left end is the end of the spring
    add(glider, roundedBox(0.9, 0.3, 0.6, 0.06), M.body, 0.5, SPRING.axis, 0);
    for (const x of [0.25, 0.75]) for (const z of [-1, 1]) add(glider, cyl(0.1, 0.1, 0.08, 16), M.wheel, x, RAIL.top + 0.1, z * 0.26).rotation.x = Math.PI / 2;
    add(glider, box(0.03, 0.03, 0.34), M.dark, 0.06, SPRING.axis, 0.46, false);
    add(glider, box(0.03, 0.74, 0.03), M.dark, 0.06, 0.41, 0.62, false);                   // a pointer over the rule
    const gliderSlabs = Array.from({ length: 4 }, (_, i) => add(glider, cyl(0.2, 0.2, 0.1, 22), i % 2 ? M.brassDark : M.brass, 0.5, SPRING.axis + 0.2 + i * 0.11, 0));
    const gliderHandle = add(glider, box(1.6, 1.5, 1.3), M.dark, 0.5, 0.9, 0, false, false); gliderHandle.visible = false;
    bobHandle.userData.grip = gliderHandle.userData.grip = { kind: 'bob' };
    // marks: where the spring ends by itself, O, how much longer the spring is, and the forces
    const bar = (color) => { const one = new T.Mesh(box(1, 1, 1), new T.MeshBasicMaterial({ color, depthTest: false, transparent: true, opacity: 0.85 })); one.renderOrder = 10; swingRig.add(one); return one; };
    const restMark = bar(INK.mark), originMark = bar(0xc8392f), stretchBar = bar(INK.mark);
    const springForce = kit.arrow(INK.normal, 0.045), bobWeight = kit.arrow(INK.weight, 0.045); swingRig.add(springForce, bobWeight);
    const originSpot = new T.Vector3(), originLabel = view.label(originSpot), stretchSpot = new T.Vector3(), stretchLabel = view.label(stretchSpot);
    const FORCE = 0.3, signed = (value, digits) => (Number(value.toFixed(digits)) < 0 ? '−' : '') + Math.abs(value).toFixed(digits);

    // ---------- physics ----------
    // Hung on the spring, the weight rests where the spring's pull balances its weight: k x0 = m g. That place is O.
    // Pulled A away from O and let go, it swings about O: u = A cos(w t) from O, with w = sqrt(k / m), at the speed
    // A w |sin(w t)|. The spring is then longer than by itself by x = x0 + u (level: x0 = 0).
    // Heights are taken from the lowest point, where it is let go, as in the textbook's table: h = A − u. Then
    // m g h + k x^2 / 2 + m v^2 / 2 stays k (x0 + A)^2 / 2 (level: k x^2 / 2 + m v^2 / 2 stays k A^2 / 2).
    // swing: one run. u: metres from O, the way it was pulled; v: its velocity that way; noted: how many of O and the far end are written down.
    const swing = { state: 'ready', t: 0, u: 0, v: 0, A: 0.08, m: 0.2, k: 20, x0: 0, flat: false, grid: -1, noted: 0 };
    const TICK = 0.01, LAST = 10;   // the graphs are kept every TICK seconds; a run ends after LAST seconds
    // A weight on a hook is not pushed by the spring: pulled further than the spring was stretched at rest, it would come
    // off at the top. So the upright spring is pulled x0 at most (in whole cm).
    const reach = () => (hanging() ? Math.max(0.01, Math.min(0.15, Math.floor(ctx.values.bob * G / ctx.values.stiff * 100 + 1e-6) / 100)) : 0.15);
    // the energies u from O at the velocity v: from gravity, of the spring, of the motion, and their sum
    function swingEnergies(u = swing.u, v = swing.v) {
      const g = swing.flat ? 0 : swing.m * G * (swing.A - u), e = swing.k * (swing.x0 + u) ** 2 / 2, k = swing.m * v * v / 2;
      return [g, e, k, g + e + k];
    }
    function swingBars() {
      const chart = ctx.charts.spring, [g, e, k, sum] = swingEnergies();
      chart.names = swing.flat ? ['위치(탄성력)', '운동', '합'] : ['위치(중력)', '위치(탄성력)', '운동', '합']; chart.colors = swing.flat ? [GREEN, RED, GOLD] : [BLUE, GREEN, RED, GOLD];
      chart.set(0, swing.flat ? [e, k, sum] : [g, e, k, sum]);
    }
    function jot(name, u, v) {
      const [g, e, k, sum] = swingEnergies(u, v), x = swing.x0 + u, three = milli;
      if (swing.flat) ctx.tables.laidTable.add([name, signed(x, 3), three(e), three(Math.abs(v)), three(k), three(sum)]);
      else ctx.tables.springTable.add([name, three(swing.A - u), three(g), three(Math.abs(v)), three(k), three(x), three(e), three(sum)]);
    }
    const spring = {
      run: swing,
      get handles() { return [hanging() ? bobHandle : gliderHandle]; },
      // held where it has been pulled to, ready to be let go
      toStart() {
        const v = ctx.values, flat = !hanging();
        Object.assign(swing, { state: 'ready', t: 0, A: v.pull, m: v.bob, k: v.stiff, x0: flat ? 0 : v.bob * G / v.stiff, flat, u: v.pull, v: 0, grid: -1, noted: 0 });
        swingBars(); moved = true;
      },
      launch() {
        spring.toStart(); swing.state = 'run';
        for (const trace of Object.values(ctx.traces)) trace.clear();
        jot(swing.flat ? '놓은 곳' : '최저점', swing.A, 0);
        ctx.seek(0); spring.advance(0);
      },
      advance(dt) {
        const w = Math.sqrt(swing.k / swing.m), quarter = Math.PI / 2 / w;   // a quarter of the time of one swing
        swing.t += dt; swing.u = swing.A * Math.cos(w * swing.t); swing.v = -swing.A * w * Math.sin(w * swing.t);
        if (swing.noted < 1 && swing.t >= quarter) { swing.noted = 1; jot('O 지점', 0, -swing.A * w); }
        if (swing.noted < 2 && swing.t >= 2 * quarter) { swing.noted = 2; jot(swing.flat ? '반대쪽 끝' : '최고점', -swing.A, 0); }
        while ((swing.grid + 1) * TICK <= swing.t + 1e-9) {
          const t = ++swing.grid * TICK, u = swing.A * Math.cos(w * t), v = -swing.A * w * Math.sin(w * t), [g, e, k, sum] = swingEnergies(u, v);
          ctx.traces.sG.add(t, g); ctx.traces.sS.add(t, e); ctx.traces.sK.add(t, k); ctx.traces.sT.add(t, sum); ctx.traces.sV.add(t, Math.abs(v));
        }
        swingBars(); moved = true;
        if (swing.t >= LAST) { swing.state = 'done'; stopSoon = true; }
      },
      dial: () => 'pull',
      // the weight is pulled down (the cart along the track), 1 cm at a time
      move(p) {
        const v = ctx.values, beside = swing.flat ? [glider.position.x + 0.5, 2.1] : [-1.5, bob.position.y - 0.4];
        if (ctx.locked.has('pull')) { say('잠금', ...beside); return; }
        const gone = swing.flat ? p.x - grab.from.x : -(p.up - grab.from.up) / p.rise;
        const to = round2(Math.max(0.01, Math.min(reach(), grab.value + gone / 10)));
        if (to !== v.pull) ctx.set('pull', to);
        grab.moved = true; say(`${v.pull.toFixed(2)} m`, ...beside);
      },
      end(held) { if (held.moved && !ctx.locked.has('pull')) ctx.setPlaying(true); },   // let go, it swings at once
      changed(id) {
        if (!['way', 'bob', 'stiff', 'pull'].includes(id)) return;
        if (ctx.values.pull > reach() + 1e-9) {   // the weight would come off its hook at the top
          ctx.set('pull', reach());
          if (!grab) say('최고점에서도 용수철이 늘어나 있도록 당긴 길이를 줄였습니다', 0.5, REST + 1.2, 3);
          return;                                 // which comes back here
        }
        if (id === 'way') { for (const trace of Object.values(ctx.traces)) trace.clear(); frame(true); }
        if (swing.state !== 'ready') ctx.emit('action', 'reset'); else spring.toStart();   // a run under way is taken back first
      },
      draw() {
        const v = ctx.values, up = !swing.flat, x = swing.x0 + swing.u, n = Math.round(swing.m / 0.05), fast = Math.abs(swing.v);
        stand.visible = up; bed.visible = !up;
        const end = up ? REST - x * 10 : ORIGIN + x * 10, rest = up ? REST - swing.x0 * 10 : ORIGIN;   // where the spring ends now, and where O is
        if (up) { coil.scale.y = SPRING.top + 0.06 - end; bob.position.y = end; bobSlabs.forEach((slab, i) => { slab.visible = i < n; }); }
        else { flatCoil.scale.y = end - SPRING.wall; glider.position.x = end; gliderSlabs.forEach((slab, i) => { slab.visible = i < n - 2; }); }
        const middle = up ? -0.37 - (n - 1) * 0.07 : 0;   // the middle of the pile of slabs, below the end of the spring
        speedArrow.visible = v.velocityArrow && fast > 0.02;
        if (speedArrow.visible) {
          speedArrow.setLength(PER_SPEED * fast);
          if (up) { speedArrow.position.set(-0.75, end + middle, 0); speedArrow.aim(swing.v > 0 ? DOWN : UP); }
          else { speedArrow.position.set(end + 0.5, SPRING.axis + 0.85, 0); speedArrow.aim(swing.v > 0 ? RIGHT : LEFT); }
        }
        // the forces: the pull (or push) of the spring, towards where it is by itself, and upright the weight as well
        const force = ctx.advanced && v.forceArrow, tug = swing.k * x;
        springForce.visible = force && Math.abs(tug) > 0.02; bobWeight.visible = force && up;
        if (springForce.visible) {
          springForce.setLength(Math.max(0.3, FORCE * Math.abs(tug)));
          if (up) { springForce.position.set(0.12, end + middle, 0.5); springForce.aim(tug > 0 ? UP : DOWN); }
          else { springForce.position.set(end + 0.5, SPRING.axis, 0.5); springForce.aim(tug > 0 ? LEFT : RIGHT); }
        }
        if (bobWeight.visible) { bobWeight.position.set(-0.12, end + middle, 0.5); bobWeight.setLength(FORCE * swing.m * G); bobWeight.aim(DOWN); }
        // how much longer the spring is than by itself, and where O is
        restMark.visible = v.stretchMark && up; originMark.visible = stretchBar.visible = v.stretchMark;
        originLabel.show(v.stretchMark); stretchLabel.show(v.stretchMark);
        if (v.stretchMark) {
          if (up) {
            restMark.scale.set(1.9, 0.025, 0.025); restMark.position.set(0.45, REST, 0.2);
            originMark.scale.set(1.9, 0.03, 0.03); originMark.position.set(0.45, rest, 0.2);
            stretchBar.scale.set(0.03, Math.max(0.01, Math.abs(x) * 10), 0.03); stretchBar.position.set(1.4, (REST + end) / 2, 0.2);
            originSpot.set(-0.85, rest - 0.2, 0.2); stretchSpot.set(3.1, (REST + end) / 2 - 0.2, 0.2);
          } else {
            originMark.scale.set(0.03, 1.5, 0.03); originMark.position.set(ORIGIN, 1.2, 0.5);
            stretchBar.scale.set(Math.max(0.01, Math.abs(x) * 10), 0.03, 0.03); stretchBar.position.set((ORIGIN + end) / 2, 1.7, 0.5);
            originSpot.set(ORIGIN, 2.0, 0.5); stretchSpot.set(ORIGIN + 2.5, 1.9, 0.5);   // to one side, clear of the O
          }
          originLabel.write('O'); stretchLabel.write(`늘어난 길이 ${signed(x, 3)} m`);
        }
        label.show(v.numbers);
        if (!v.numbers) return;
        const [g, e, k, sum] = swingEnergies(), three = milli;
        // the writing stays in one place while the weight swings: beside the stand, or over it on an upright screen
        if (!up) spot.set(0.5, 3.1, 0); else if (tall()) spot.set(0.6, SPRING.top + 1.2, 0); else spot.set(-5.2, REST - 2.2, 0);
        label.write(up ? `높이 ${three(swing.A - swing.u)} m · 속력 ${fast.toFixed(2)} m/s<br>중력에 의한 위치 에너지 ${three(g)} J<br>탄성력에 의한 위치 에너지 ${three(e)} J<br>운동 에너지 ${three(k)} J<br>합 <b>${three(sum)} J</b>`
          : `속력 ${fast.toFixed(2)} m/s<br>탄성력에 의한 위치 에너지 ${three(e)} J<br>운동 에너지 ${three(k)} J<br>합 <b>${three(sum)} J</b>`);
      },
    };

    // ==================== handling ====================
    // The coaster: a post is raised or lowered by its knob; the cart is put on the track and let go.
    // Work: the photogates are moved along the track, the piles of weights are made higher or lower, and a press on the cart lets it go.
    const ray = new T.Raycaster(), upright = new T.Plane(new T.Vector3(0, 0, 1), 0), level = new T.Plane(new T.Vector3(0, 1, 0), -1.5), hit = new T.Vector3();
    // where the pointer is: along the bench (x) and "up" (height, or away from the viewer when seen from above)
    function pointer(r) {
      if (Math.abs(r.direction.z) > 0.25 && r.intersectPlane(upright, hit)) return { x: hit.x, up: hit.y, rise: 1 };
      return r.intersectPlane(level, hit) ? { x: hit.x, up: -hit.z, rise: 2 } : null;
    }
    const SETTINGS = ['body', 'mass', 'start', 'ground', 'friction', 'mu', 'h1', 'h2', 'h3', 'h4', 'h5'];
    const coaster = {
      run, toStart, launch, advance, draw: drawCoaster,
      handles: [riderHandle, ...posts.map((post) => post.handle)],
      dial: (grip) => (grip.kind === 'post' ? `h${grip.i + 1}` : 'start'),
      move(p) {
        const v = ctx.values;
        if (grab.kind === 'post') {   // up and down, 1 cm at a time
          if (ctx.locked.has(grab.id)) { say('잠금', XS[grab.i], H[grab.i] + 0.9); return; }
          const to = Math.round(Math.max(HEIGHT.min, Math.min(HEIGHT.max, grab.value + (p.up - grab.from.up) / p.rise / 10)) * 100) / 100;
          if (to !== v[grab.id]) ctx.set(grab.id, to);
          say(`${POSTS[grab.i]} ${v[grab.id].toFixed(2)} m`, XS[grab.i], H[grab.i] + 0.9);
        } else {   // along the track: it stays on the rails
          const to = Math.round(Math.max(0.02, Math.min(1.38, grab.value + (p.x - grab.from.x) / 10)) * 100) / 100;
          if (ctx.locked.has('start')) { say('잠금', run.x, shape(run.x, here).y + 1.4); return; }
          if (to !== v.start) ctx.set('start', to);
          grab.moved = true; say(`높이 ${(shape(run.x, here).y / 10 - levelOf()).toFixed(2)} m`, run.x, shape(run.x, here).y + 1.4);
        }
      },
      end(held) {
        if (held.kind === 'post') frame();
        if (held.kind === 'rider' && held.moved && !ctx.locked.has('start')) ctx.setPlaying(true);   // let go, the cart sets off at once
      },
      changed(id) {
        if (!SETTINGS.includes(id)) return;
        if (/^h\d$/.test(id)) { lay(); if (!grab) frame(); }   // while a post is in hand the view waits, and moves when it is let go
        if (run.state !== 'ready') ctx.emit('action', 'reset'); else toStart();   // a run under way is taken back first
      },
    };
    work.handles = [...gates.flatMap((gate) => gate.handles), hangHandle, pileHandle, wagonBody];
    const SCENES = { coaster, work, spring }, now = () => SCENES[ctx.values.scene];
    view.setTool({
      pick(r) {
        ray.ray.copy(r); world.updateMatrixWorld(true);
        const found = ray.intersectObjects(now().handles, false)[0];
        if (!found) return null;
        return now().run.state !== 'ready' ? { kind: 'reset' } : found.object.userData.grip;
      },
      cursor: (grip) => (!grip ? '' : grip.kind === 'reset' || grip.kind === 'go' ? 'pointer' : 'grab'),
      start(grip, r) {
        if (grip.kind === 'reset') { ctx.emit('action', 'reset'); return false; }   // a touch after a run puts the cart back first
        if (grip.kind === 'go') { ctx.setPlaying(true); return false; }             // the cart is let go
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
      if (now().run.state === 'done') now().toStart();
      if (now().run.state === 'ready') now().launch();
    });
    ctx.on('tick', (t, dt) => {
      if (!dt) return;
      if (now().run.state === 'ready') now().launch();
      if (now().run.state === 'run') now().advance(dt);
    });
    ctx.on('action', (id) => { if (id === 'reset') now().toStart(); });
    // Where the bench is looked at from. The track of the coaster may rise to 1 m: the view draws back, and looks higher,
    // so that all of it stays in sight. With the string and pulley the weights hang beside the end of the bench, so the
    // view comes round to that end. An upright screen looks along the track.
    const tall = () => window.matchMedia('(max-aspect-ratio: 4/5)').matches;
    function frame(turn = false) {   // turn: come round to the side this arrangement is looked at from
      if (working()) { view.look(tall() ? { target: [5.5, -2.6, 0], r: 24, theta: 1.15, phi: 1.3 } : { target: [5, -2.4, 0], r: 25.5, theta: 0.85, phi: 1.3 }); return; }
      if (swinging()) {   // the stand is tall and narrow; the level spring is low and short
        view.look(hanging() ? (tall() ? { target: [0.6, 4.8, 0], r: 22, theta: 0.15, phi: 1.42 } : { target: [-0.6, 4.2, 0], r: 15.5, theta: 0.2, phi: 1.42 })
          : tall() ? { target: [0, 1.2, 0], r: 15, theta: 0.2, phi: 1.2 } : { target: [0.2, 1.1, 0], r: 9.5, theta: 0.2, phi: 1.2 });
        return;
      }
      const top = Math.max(...H, 3.6);
      view.look(tall() ? { target: [2, 1.6 + (top - 3.6) * 0.5, 0], r: 22 + (top - 3.6), theta: 1.05, phi: 1.2 }
        : { target: [0, 2.1 + (top - 3.6) * 0.5, 0], r: 16.5 + (top - 3.6) * 0.9, ...(turn ? { theta: 0.2, phi: 1.2 } : {}) });
    }
    ctx.on('change', (id) => {
      moved = true;
      if (id === 'scene') {   // the other arrangement starts with empty graphs
        for (const trace of Object.values(ctx.traces)) trace.clear();
        ctx.emit('action', 'reset'); toStart(); work.toStart(); spring.toStart(); frame(true);
        return;
      }
      now().changed(id);
    });
    ctx.on('mode', () => {   // the ball and the moved level belong to the advanced mode
      if (!ctx.advanced) { if (ctx.values.body !== 'cart') ctx.set('body', 'cart'); if (ctx.values.ground !== 0) ctx.set('ground', 0); if (ctx.values.mu !== 0.1) ctx.set('mu', 0.1); }
      if (ctx.values.scene === 'coaster') toStart();
      moved = true;
    });

    // ---------- every frame: the cart sits on the track, and the marks and readings follow ----------
    function drawCoaster() {
      const v = ctx.values, { y, d1, d2 } = shape(run.x, here), steep = Math.sqrt(1 + d1 * d1), tilt = Math.atan(d1), isBall = rolling();
      const m = run.state === 'ready' ? v.mass : run.m, base = levelOf() * 10;
      rider.position.set(run.x - 0.04 * d1 / steep, y + 0.04 / steep, 0); rider.rotation.z = tilt;   // on top of the rails
      car.visible = !isBall; ball.visible = isBall; ball.rotation.z = -run.turned / ROUND;
      const cx = rider.position.x - 0.3 * d1 / steep, cy = rider.position.y + 0.3 / steep;       // about the middle of the cart
      speedArrow.visible = v.velocityArrow && Math.abs(run.v) > 0.02;
      if (speedArrow.visible) { speedArrow.position.set(cx, cy + 0.5, 0); speedArrow.setLength(PER_SPEED * Math.abs(run.v)); speedArrow.aim(aim.set(Math.sign(run.v) / steep, Math.sign(run.v) * d1 / steep, 0)); }
      // the forces on the cart: its weight, and the push of the track square to it, which also bends its path: N = m (g cos + v^2 x curvature)
      weightArrow.visible = normalArrow.visible = v.forceArrow;
      if (v.forceArrow) {
        const push = Math.max(0, m * (G / steep + run.v * run.v * d2 * 10 / steep ** 3));
        weightArrow.position.set(cx, cy, 0); weightArrow.setLength(NEWTON * m * G); weightArrow.aim(DOWN);
        normalArrow.position.set(cx, cy, 0); normalArrow.setLength(Math.max(0.3, NEWTON * push)); normalArrow.aim(aim.set(-d1 / steep, 1 / steep, 0));
      }
      heightLine.visible = v.heightMark; heightLabel.show(v.heightMark);
      if (v.heightMark) {   // from the level heights are measured from, up to the track under the cart
        heightLine.position.set(run.x, Math.min(base, y), 0.5); heightLine.scale.y = Math.max(0.01, Math.abs(y - base));
        heightSpot.set(run.x + 0.9, (y + base) / 2, 0.5); heightLabel.write(`${((y - base) / 10).toFixed(2)} m`);
      }
      groundLine.visible = base > 0; groundLine.position.set(0, base, 0);
      label.show(v.numbers);
      if (v.numbers) {
        const [p, k, sum] = energies(y, run.v, m, run.state === 'ready' ? (isBall ? 5 / 7 : 1) : run.share);
        spot.set(cx + (run.x < 3 ? 2.2 : -2.2), cy + 0.5, 0);   // beside the cart, on the side with room
        label.write(`높이 ${((y - base) / 10).toFixed(2)} m · 속력 ${Math.abs(run.v).toFixed(2)} m/s<br>위치 에너지 ${p.toFixed(2)} J<br>운동 에너지 ${k.toFixed(2)} J${isBall ? ` (회전 ${(k * 2 / 7).toFixed(2)} J)` : ''}<br>합 <b>${sum.toFixed(2)} J</b>${run.state !== 'ready' && run.mu ? `<br>열로 바뀐 에너지 ${heat().toFixed(2)} J` : ''}`);
      }
    }

    function draw() {
      const scene = ctx.values.scene;
      track.visible = rider.visible = scene === 'coaster'; rig.visible = scene === 'work'; swingRig.visible = scene === 'spring';
      for (const one of [heightLabel, hangLabel, gateLabel, originLabel, stretchLabel]) one.show(false);   // each arrangement shows its own writing
      now().draw();
    }

    lay(); toStart(); work.toStart(); spring.toStart();
    return {
      state: () => ({ scene: ctx.values.scene, ...now().run }), shape,
      update(dt) {
        if (!framed) { framed = true; if (tall()) frame(); }   // an upright screen looks along the track
        if (stopSoon) { stopSoon = false; ctx.setPlaying(false); }
        if (tipTime > 0) { tipTime -= dt; if (tipTime <= 0) { tip.show(false); moved = true; } }
        if (!moved) return false;
        moved = false; draw();
        return true;
      },
    };
  },
};
