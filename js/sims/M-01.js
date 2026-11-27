// M-01 Composition of forces (3D). Three scenes, chosen from the variables menu: the spring scales (described here), the
// force table and the incline with a pulley (each described where it is built, further down).
//
// Spring scales (the textbook's "weighing with two spring scales"): a weight hangs from a short cross-bar, and the
// cross-bar hangs from two spring scales whose tops are hooked to sleeves on two level bars, one a little in front of
// the other (so that at no angle the two scales are in each other's way). Sliding a sleeve along its bar sets the angle
// between the two scales; the two sleeves move together, the same distance either side of the middle. The cross-bar
// with the weight is at rest, so the pulls of the two scales together hold up the weight: each scale reads
// W ÷ (2 cos(θ/2)), the weight at 0° shared half and half, the whole weight at 120°, nearly twice it at 150°.
// The scales stretch as they pull (1 cm for every newton), so where the cross-bar hangs is found from the angle:
// a scale is L0 + T × EXT long from hook to hook, at θ/2 from the vertical.
// Moved apart (a switch): the two tops are held by hand, each anywhere in its upright plane, and the cross-bar hangs
// where the two stretched scales and the weight balance; the two readings now differ, and the pulls of the two
// scales together are still the weight, straight up. The graph keeps the readings against cos(θ/2), with the sleeves together only.
// One scale: the weight hangs from it alone.
// Advanced: the weight is 1 to 4 N (a pile of 1 N discs, dragged up or down); three scales hung from a level ring,
// each slid round it, hold the weight in three dimensions (the cross-bar's place, a little ring, found the same way);
// the rule for a scale's reading with the sleeves together, and its curve on the graph.
// The three may be taken off the ring and held by hand too, each top anywhere within reach: looked at from the side a top
// is moved in the upright plane facing the eye; looked at from above, in the level plane at its height.
// Lengths are life-size: one unit of the scene is 10 cm. g = 9.8 m/s².

const L0 = 2.6, EXT = 0.1, K = 1 / EXT;   // a scale from hook to hook unstretched (26 cm); how far it stretches for each newton (1 cm); so its stiffness (N per unit)
const MOST = 150;                     // the widest angle between the scales (°)
const PER_N = 0.4;                    // the arrows: 4 cm for each newton
const RATE = 10;                      // the demonstration opens the scales by this many degrees a second
const FULL = 10;                      // a scale reads up to 10 N
const RAD = Math.PI / 180;
const round2 = (x) => Math.round(x * 100 + 1e-9) / 100, two = (x) => round2(x).toFixed(2);   // (a sum of readings is the sum of the readings as written: 1.00 + 1.00 is written 2.00, not 2.01)
const it = (text) => `<i style="font-family: Georgia, serif">${text}</i>`;
const F = (k) => `${it('F')}<sub>${k}</sub>`;
const weightOf = (v, advanced) => (advanced ? v.load : 2);   // the weight (N): 2 N in the basic mode
const pull = (angle, w) => w / (2 * Math.cos(angle / 2 * RAD));   // what each of the two scales reads with the sleeves together (N)
const reach = (angle, w) => (L0 + EXT * pull(angle, w)) * Math.sin(angle / 2 * RAD);   // how far from the middle a sleeve is at that angle
const BLUE = 0x2f6fd6, RED = 0xd9584a, ORANGE = 0xe0912f, PURPLE = 0x8a4fc4, LILAC = 0xb69ad8, GREEN = 0x2e9d5b;
const onScalesV = (v) => v.scene === 'scales', onTableV = (v) => v.scene === 'table', onSlopeV = (v) => v.scene === 'slope';
const together = (v) => onScalesV(v) && v.count === 'two' && !v.free;

export default {
  premise: (v, advanced) => (onSlopeV(v) ? `실과 도르래의 질량과 마찰, 공기 저항은 없다고 봅니다${v.mu === 'none' || (advanced && v.muS !== 'same') ? '' : '. 정지 마찰 계수도 운동 마찰 계수와 같다고 봅니다(실제로는 조금 더 큽니다)'}. 중력 가속도는 9.8 m/s², 힘의 화살표는 1 N에 0.6 cm입니다`
    : onTableV(v) ? `실과 도르래의 무게와 마찰은 없다고 봅니다(실이 당기는 힘 = 추의 무게). 힘의 화살표는 1 N에 1 cm입니다${v.pinOut ? '. 방향을 1°씩 맞추므로, 알짜힘이 0.05 N보다 작으면 평형으로 봅니다' : ''}`
    : `저울과 고리의 무게는 없다고 봅니다. 추의 무게는 ${weightOf(v, advanced).toFixed(1)} N이고, 힘의 화살표는 1 N에 4 cm입니다`),
  fixedViews: ['front', 'top'],
  camera: { target: [0, 2.85, 0], r: 9.5, theta: 0.22, phi: 1.32, rMax: 30 },
  // (the sleeves together) against cos(angle ÷ 2), not against time: what a scale read at each angle tried, and (advanced) the rule (NaN: none there)
  traces: { reading: { window: 200, range: 1, read: (v) => `${two(v)} N` }, law: { window: 200, range: 1, read: (v) => `${two(v)} N` },
    // (the force table, two forces) against the angle between them (°): the size of their sum at each angle tried, and (advanced) the rule
    sum2: { window: 400, range: 1, read: (v) => `${two(v)} N` }, sum2law: { window: 400, range: 1, read: (v) => `${two(v)} N` },
    // (the incline) this run and the two before it
    ...Object.fromEntries([0, 1, 2].flatMap((k) => [[`v${k}`, { window: 30, range: 0.5, read: (v) => `${v.toFixed(2)} m/s` }], [`s${k}`, { window: 30, range: 0.5, read: (v) => `${v.toFixed(3)} m` }]])) },
  stepTime: 0.1,
  menus: {
    vars: [
      { id: 'scene', label: '장면 선택', kind: 'choice', value: 'scales', options: [{ id: 'scales', label: '두 용수철저울' }, { id: 'table', label: '힘의 합성대' }, { id: 'slope', label: '빗면과 도르래' }] },
      { id: 'count', label: '저울의 수', kind: 'choice', value: 'two', when: onScalesV, options: [{ id: 'one', label: '1개' }, { id: 'two', label: '2개' }, { id: 'three', label: '3개', advanced: true }] },
      { id: 'free', label: (v) => (v.count === 'three' ? '저울을 틀에서 떼어 움직이기' : '저울을 따로 움직이기'), kind: 'toggle', when: (v) => onScalesV(v) && v.count !== 'one' },
      { id: 'angle', label: '두 저울 사이의 각', kind: 'slider', min: 0, max: MOST, step: 1, value: 0, unit: '°', when: together },
      { id: 'load', label: '추의 무게', kind: 'slider', min: 1, max: 4, step: 1, value: 2, unit: ' N', digits: 1, advanced: true, when: onScalesV },
      { id: 'forces2', label: '힘의 수', kind: 'choice', value: 'two', when: onTableV, options: [{ id: 'two', label: '2개' }, { id: 'three', label: '3개' }] },
      ...[[1, 6, 0], [2, 8, 90], [3, 10, 225]].flatMap(([k, f, a]) => {
        const on = k < 3 ? onTableV : (v) => onTableV(v) && v.forces2 === 'three', sub = '₀₁₂₃'[k];
        return [{ id: `f${k}`, label: `F${sub}의 크기`, kind: 'slider', min: 0.5, max: 10, step: 0.5, value: f, unit: ' N', digits: 1, when: on },
          { id: `a${k}`, label: `F${sub}의 방향`, kind: 'slider', min: 0, max: 359, step: 1, value: a, unit: '°', when: on }];
      }),
      { id: 'pinOut', label: '핀 뽑기', kind: 'toggle', when: onTableV },
      { id: 'massA', label: 'A의 질량', kind: 'slider', min: 1, max: 5, step: 1, value: 3, unit: ' kg', when: onSlopeV },
      { id: 'massB', label: 'B의 질량', kind: 'slider', min: 0, max: 5, step: 1, value: 2, unit: ' kg', when: onSlopeV },
      { id: 'tilt', label: '빗면의 기울기', kind: 'slider', min: 10, max: 60, step: 1, value: 30, unit: '°', when: onSlopeV },
      { id: 'mu', label: '운동 마찰 계수', kind: 'choice', value: 'none', when: onSlopeV,
        options: [{ id: 'none', label: '없음' }, { id: 'm2', label: '0.2' }, { id: 'r6', label: '√3/6 (0.289)' }, { id: 'm4', label: '0.4' }, { id: 'r3', label: '√3/3 (0.577)' }] },
      { id: 'muS', label: '정지 마찰 계수', kind: 'choice', value: 'same', advanced: true, when: onSlopeV,
        options: [{ id: 'same', label: '운동 마찰 계수와 같음' }, { id: 's3', label: '0.3' }, { id: 's5', label: '0.5' }, { id: 's7', label: '0.7' }] },
      { id: 'cut', label: '실 끊기', kind: 'action', advanced: true, when: (v) => onSlopeV(v) && v.massB > 0 },
    ],
    graph: [
      { id: 'readingCos', label: '눈금–cos(각 ÷ 2)', kind: 'graph', x: 'cos(각 ÷ 2)', xUnit: ' ', span: [0, 1], marks: [[0.5, '0.5'], [1, '1']], when: together,
        plots: [{ y: '저울의 눈금', floor: true, marks: [[1, '1 N'], [2, '2 N']], lines: [{ trace: 'law', color: '#9aa7c7', name: '식' }, { trace: 'reading', color: '#e3c26b', name: '잰 값', dots: true }] }] },
      { id: 'sumAngle', label: '알짜힘–두 힘 사이의 각', kind: 'graph', x: '두 힘 사이의 각', xUnit: '°', span: [0, 180], marks: [[90, '90°'], [180, '180°']], when: (v) => onTableV(v) && v.forces2 !== 'three',
        plots: [{ y: '알짜힘의 크기', floor: true, lines: [{ trace: 'sum2law', color: '#9aa7c7', name: '식' }, { trace: 'sum2', color: '#e3c26b', name: '잰 값', dots: true }] }] },
      ...[['v', '속력–시간', '속력'], ['s', '이동 거리–시간', '이동 거리']].map(([q, label, y]) => ({ id: `${q}t`, label, kind: 'graph', x: '시간', when: onSlopeV,
        plots: [{ y, floor: true, lines: [{ trace: `${q}2`, color: '#6b7080', name: '그 앞' }, { trace: `${q}1`, color: '#9aa7c7', name: '앞' }, { trace: `${q}0`, color: '#e3c26b', name: '이번' }] }] })),
    ],
    time: [
      { id: 'reset', label: '처음으로', kind: 'action' },
      { id: 'slow', label: '느리게', kind: 'toggle' },
      { id: 'step', label: '한 단계씩', kind: 'action', advanced: true },
    ],
    layers: [
      { id: 'forces', label: '힘', kind: 'toggle' },
      { id: 'net', label: '알짜힘', kind: 'toggle' },
      { id: 'parallel', label: '평행사변형법', kind: 'toggle', when: onTableV },
      { id: 'triangle', label: '삼각형법', kind: 'toggle', when: onTableV },
      { id: 'balance', label: '평형을 이루는 힘', kind: 'toggle', advanced: true, when: onTableV },
      { id: 'marks', label: '같은 시간 간격의 위치', kind: 'toggle', when: onSlopeV },
      { id: 'accel', label: '가속도', kind: 'toggle', advanced: true, when: onSlopeV },
      { id: 'parts', label: '성분', kind: 'toggle' },
      { id: 'numbers', label: '값', kind: 'toggle' },
    ],
    inquiry: [
      { id: 'table', label: '기록 표', kind: 'table', rows: 8, wide: true, when: onScalesV, text: '걸이나 손잡이를 끌어 놓을 때마다(재생하면 30°마다) 저울의 눈금이 적힙니다.',
        columns: [{ label: '두 저울<br>사이의 각', unit: '°' }, { label: '저울 1', unit: 'N' }, { label: '저울 2', unit: 'N' }, { label: '저울 3', unit: 'N', advanced: true },
          { label: '눈금의 합', unit: 'N', result: true }, { label: '추의 무게', unit: 'N' }] },
      { id: 'table2', label: '기록 표', kind: 'table', rows: 8, wide: true, when: onTableV, text: '핀을 뽑을 때(뽑은 채로 도르래나 추를 옮기고 놓을 때)마다 한 줄씩 적힙니다.',
        columns: [{ label: 'F₁', unit: 'N' }, { label: 'F₁ 방향', unit: '°' }, { label: 'F₂', unit: 'N' }, { label: 'F₂ 방향', unit: '°' }, { label: 'F₃', unit: 'N' }, { label: 'F₃ 방향', unit: '°' },
          { label: '실이 당기는<br>힘의 알짜힘', unit: 'N', result: true }, { label: '그 방향', unit: '°', result: true }, { label: '핀을 뽑으면', result: true }] },
      { id: 'axes', label: '축 돌리기', kind: 'toggle', when: onTableV },
      { id: 'skew', label: '두 방향으로 나누기', kind: 'toggle', advanced: true, when: onTableV },
      { id: 'table3', label: '기록 표', kind: 'table', rows: 8, wide: true, when: onSlopeV, text: '재생 단추로 손을 놓은 뒤 멈출 때마다 한 줄씩 적힙니다. 1초가 되기 전에 끝에 닿으면 1초 칸은 비어 있습니다.',
        columns: [{ label: 'A 질량', unit: 'kg' }, { label: 'B 질량', unit: 'kg' }, { label: '기울기', unit: '°' }, { label: '마찰<br>계수' }, { label: '가속도', unit: 'm/s²', result: true },
          { label: '걸린<br>시간', unit: 's', result: true }, { label: '이동<br>거리', unit: 'm', result: true }, { label: '나중<br>속력', unit: 'm/s', result: true }, { label: '1초 뒤<br>속력', unit: 'm/s', result: true }, { label: '1초 뒤<br>이동 거리', unit: 'm', result: true }] },
    ],
  },

  // writing on the chalkboard (1024 x 400)
  board(g) {
    g.fillStyle = 'rgba(255,255,255,0.9)'; g.font = '56px Georgia, serif'; g.fillText('힘의 합성', 60, 96);
    g.strokeStyle = 'rgba(255,255,255,0.85)'; g.lineWidth = 5;
    const o = [120, 330], a = [320, 330], b = [200, 190], c = [400, 190];
    const line = (p, q) => { g.beginPath(); g.moveTo(...p); g.lineTo(...q); g.stroke(); };
    line(o, a); line(o, b); line(o, c);
    g.setLineDash([12, 10]); line(a, c); line(b, c); g.setLineDash([]);
    g.font = 'italic 56px Georgia, serif'; g.fillText('F = F₁ + F₂', 520, 290);
  },

  create({ T, kit, world, view, ctx }) {
    const { mat, add, box, cyl } = kit;
    const M = {
      steel: mat(0x9aa1b1, { roughness: 0.5, metalness: 0.4 }), dark: mat(0x3a4057), base: mat(0x4b5163),
      body: mat(0xf1eee6), cap: mat(0x6c7486), rod: mat(0xb9bfce, { roughness: 0.45, metalness: 0.5 }),
      brass: mat(0xc9a24a, { roughness: 0.45, metalness: 0.55 }), string: mat(0xe9e4d6), pointer: mat(0xd9584a), hand: mat(0xe2b48f),
    };
    const UP = new T.Vector3(0, 1, 0), DOWN = new T.Vector3(0, -1, 0);
    const tall = () => window.matchMedia('(max-aspect-ratio: 4/5)').matches;
    const tipSpot = new T.Vector3(), tip = view.label(tipSpot);
    let moved = true, tipTime = 0, grab = null, quiet = false, playing = false, stopSoon = false, framed = false;
    function say(text, at, seconds = 0) { tip.write(text); tipSpot.copy(at); tip.show(true); tipTime = seconds; moved = true; }
    const W = () => weightOf(ctx.values, ctx.advanced);
    const S1 = new T.Group(); world.add(S1);   // (everything of the scales scene)
    const onScales = () => ctx.values.scene === 'scales', onTable = () => ctx.values.scene === 'table', onSlope = () => ctx.values.scene === 'slope';

    // ---------- the stand: two posts on feet, and two level bars between them, ZS in front of the middle and behind it ----------
    const H = 5.0, POST = 3.4, ZS = 0.15, HOOK = 0.24, TOP = H - HOOK;   // the bars' height (50 cm); the posts' distance from the middle; the bars' distance from the middle plane; a sleeve's hook below its bar; so a top hook's height
    const standParts = new T.Group();
    for (const x of [-POST, POST]) {
      add(standParts, box(1.2, 0.12, 1.4), M.base, x, 0.06, 0);
      add(standParts, cyl(0.08, 0.08, H + 0.5, 16), M.steel, x, (H + 0.5) / 2, -0.35);
      add(standParts, box(0.3, 0.3, 0.9), M.dark, x, H, -0.1);   // the clamp that holds both bars
    }
    for (const z of [ZS, -ZS]) add(standParts, cyl(0.05, 0.05, 2 * POST, 14), M.steel, 0, H, z).rotation.z = Math.PI / 2;
    const stand = kit.mergeStatic(standParts); S1.add(stand);   // (put away while the scales are held by hand, or hung from the ring)
    // (advanced, three scales) a level ring of radius RING at the bars' height, held from the right by an arm on a post
    const RING = 1.5, ARM = 0, CLEAR = 15, APART = 30;   // where the arm meets the ring (°, round from the right, towards the front); how near to the arm, and to each other, the sleeves may come (°)
    const ringParts = new T.Group();
    add(ringParts, new T.TorusGeometry(RING, 0.04, 10, 72), M.steel, 0, H, 0).rotation.x = Math.PI / 2;
    add(ringParts, box(1.2, 0.12, 1.2), M.base, 2.7, 0.06, 0);
    add(ringParts, cyl(0.08, 0.08, H + 0.5, 16), M.steel, 2.7, (H + 0.5) / 2, 0);
    add(ringParts, box(1.2, 0.12, 0.12), M.steel, 2.1, H, 0); add(ringParts, box(0.3, 0.3, 0.3), M.dark, 2.7, H, 0);
    const ringStand = kit.mergeStatic(ringParts); S1.add(ringStand); ringStand.visible = false;

    // ---------- a spring scale: hung from its top hook (the group's origin), its own −Y pointing along it ----------
    // The pointer and the lower hook go down together by EXT for each newton; the rod between them is of one length.
    const BODY = { top: 0.2, long: 1.9, r: 0.12 }, ZERO = 0.45;   // the body from 0.2 to 2.1 below the top hook; the pointer at nought, below the top hook
    const strip = kit.canvasTexture(64, 1024, (g, w, h) => {
      g.fillStyle = '#f7f4ec'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#2b2f3a'; g.font = '600 30px Georgia, serif'; g.textAlign = 'right'; g.textBaseline = 'middle';
      for (let n = 0; n <= 20; n++) {   // a mark for each half newton, longer for each newton, a number for each two
        const y = (ZERO - BODY.top + EXT * n / 2) / BODY.long * h, long = n % 2 === 0;
        g.fillRect(0, y - 1.5, long ? 26 : 14, 3);
        if (n % 4 === 0) g.fillText(String(n / 2), w - 4, y);
      }
    });
    function scale(z) {
      const group = new T.Group(); S1.add(group);
      const loop = add(group, new T.TorusGeometry(0.07, 0.016, 8, 20), M.rod, 0, -0.07, 0); loop.rotation.y = Math.PI / 2;
      add(group, cyl(0.03, 0.03, 0.14, 8), M.rod, 0, -0.16, 0);
      const body = add(group, cyl(BODY.r, BODY.r, BODY.long, 20), M.body, 0, -BODY.top - BODY.long / 2, 0);
      add(group, cyl(BODY.r + 0.012, BODY.r + 0.012, 0.08, 20), M.cap, 0, -BODY.top - 0.04, 0);
      add(group, cyl(BODY.r + 0.012, BODY.r + 0.012, 0.08, 20), M.cap, 0, -BODY.top - BODY.long + 0.04, 0);
      const face = add(group, new T.PlaneGeometry(0.11, BODY.long - 0.16), new T.MeshStandardMaterial({ map: strip, roughness: 0.9 }), 0, -BODY.top - BODY.long / 2, BODY.r + 0.004, false);
      face.material.map.repeat.set(1, (BODY.long - 0.16) / BODY.long); face.material.map.offset.set(0, 0.08 / BODY.long);
      const moving = new T.Group(); group.add(moving);   // the pointer, the rod and the lower hook
      add(moving, box(0.17, 0.025, 0.03), M.pointer, 0, -ZERO, BODY.r + 0.01, false);
      const rodLong = L0 - ZERO - 0.08;
      add(moving, cyl(0.025, 0.025, rodLong, 8), M.rod, 0, -ZERO - rodLong / 2, 0);
      const hook = add(moving, new T.TorusGeometry(0.06, 0.015, 8, 20), M.rod, 0, -L0 + 0.04, 0); hook.rotation.y = Math.PI / 2;
      body.userData.grip = { kind: 'scale' };
      return { group, moving, body, z };
    }
    // scale 1 hangs from the front bar, to the left; scale 2 from the back bar, to the right; (three) scale 3 at the front of the ring
    const scales = [scale(ZS), scale(-ZS), scale(0)];
    function sleeve(z, side) {
      const group = new T.Group(); S1.add(group);
      const grip = add(group, box(0.3, 0.26, 0.2), M.dark, 0, 0, 0);
      add(group, cyl(0.025, 0.025, HOOK - 0.1, 8), M.rod, 0, -0.13 - (HOOK - 0.1) / 2 + 0.03, 0);
      grip.userData.grip = { kind: 'sleeve', side };
      group.position.set(0, H, z);
      return { group, grip };
    }
    const sleeves = [sleeve(ZS, -1), sleeve(-ZS, 1)];
    const ringSleeves = [0, 1, 2].map((k) => { const one = sleeve(0, 0); one.grip.userData.grip = { kind: 'ring', k }; return one; });
    // (free) a hand holds each top: a round grip just above it
    const hands = [0, 1, 2].map((k) => { const m = add(S1, new T.SphereGeometry(0.13, 20, 14), M.hand, 0, 0, 0); m.userData.grip = { kind: 'hand', k }; m.visible = false; return m; });

    // ---------- the cross-bar (or, three scales, a little ring) and the weight: a pile of 1 N discs ----------
    const hanger = new T.Group(); S1.add(hanger);
    const crossBar = add(hanger, cyl(0.03, 0.03, 2 * ZS + 0.12, 10), M.rod, 0, 0, 0); crossBar.rotation.x = Math.PI / 2;
    const knot = add(hanger, new T.TorusGeometry(0.06, 0.016, 8, 20), M.rod, 0, 0, 0); knot.rotation.x = Math.PI / 2;
    const STRING = 0.4, DISC = { r: 0.17, h: 0.12 }, PILE = STRING + 0.08;   // the discs hang below the string and a little hook
    add(hanger, cyl(0.008, 0.008, STRING, 6), M.string, 0, -STRING / 2, 0);
    add(hanger, new T.TorusGeometry(0.045, 0.012, 8, 16), M.brass, 0, -STRING - 0.04, 0);
    const discs = [0, 1, 2, 3].map((k) => {
      const m = add(hanger, cyl(DISC.r, DISC.r, DISC.h - 0.008, 28), M.brass, 0, -PILE - DISC.h * (k + 0.5), 0);
      m.userData.grip = { kind: 'load' };
      return m;
    });
    const bottomOf = (w) => PILE + DISC.h * w;   // how far below the cross-bar the pile ends

    // ---------- the protractor behind the cross-bar, the angle marked on it ----------
    const PROT = 0.6;
    const protTex = kit.canvasTexture(512, 256, (g, w, h) => {
      g.clearRect(0, 0, w, h);
      g.fillStyle = 'rgba(246,243,234,0.9)'; g.beginPath(); g.arc(w / 2, h, h - 2, Math.PI, 0); g.fill();
      g.strokeStyle = '#2b2f3a'; g.lineWidth = 2;
      for (let a = 0; a <= 180; a += 5) {
        const long = a % 30 === 0 ? 0.2 : a % 10 === 0 ? 0.12 : 0.07, c = Math.cos(a * RAD), s = Math.sin(a * RAD);
        g.beginPath(); g.moveTo(w / 2 + c * (h - 4), h - s * (h - 4)); g.lineTo(w / 2 + c * (h - 4) * (1 - long), h - s * (h - 4) * (1 - long)); g.stroke();
      }
    });
    const protractor = add(S1, new T.PlaneGeometry(2 * PROT, PROT), new T.MeshBasicMaterial({ map: protTex, transparent: true, depthWrite: false, side: T.DoubleSide }), 0, 0, 0, false, false);
    const wedge = new T.Mesh(new T.BufferGeometry(), new T.MeshBasicMaterial({ color: 0xe3c26b, transparent: true, opacity: 0.55, depthWrite: false, side: T.DoubleSide }));
    S1.add(wedge);
    function shapeWedge(fromDeg, toDeg, at) {   // the opening between the two scales, on the protractor (° from the right, anticlockwise)
      const pts = [new T.Vector2(0, 0)], from = fromDeg * RAD, to = toDeg * RAD, n = Math.max(2, Math.ceil((toDeg - fromDeg) / 4));
      for (let k = 0; k <= n; k++) { const a = from + (to - from) * k / n; pts.push(new T.Vector2(Math.cos(a) * PROT * 0.7, Math.sin(a) * PROT * 0.7)); }
      wedge.geometry.dispose(); wedge.geometry = new T.ShapeGeometry(new T.Shape(pts));
      wedge.position.copy(at).add(new T.Vector3(0, 0, 0.003));
    }

    // ---------- the marks: arrows (drawn over everything), dashed lines, writing ----------
    const INK = [BLUE, RED, ORANGE];
    const pulls = INK.map((c) => kit.arrow(c, 0.035)), levels = INK.map((c) => kit.arrow(c, 0.025)), uprights = INK.map((c) => kit.arrow(c, 0.025));
    const arrows = { net: kit.arrow(PURPLE, 0.045), part: kit.arrow(LILAC, 0.04), weight: kit.arrow(GREEN, 0.035) };
    for (const a of [...pulls, ...levels, ...uprights, ...Object.values(arrows)]) S1.add(a);
    // dashed lines: short bars laid end to end with gaps, drawn over everything like the arrows
    const DASH = 0.06, GAP = 0.04, DASHES = 240;
    const dashes = new T.InstancedMesh(cyl(0.014, 0.014, 1, 6), new T.MeshBasicMaterial({ color: 0x5b3d82, transparent: true, opacity: 0.9, depthTest: false, depthWrite: false }), DASHES);
    dashes.renderOrder = 9; dashes.frustumCulled = false; S1.add(dashes);
    const piece = new T.Object3D(), way = new T.Vector3();
    function dashLines(pts, mesh = dashes) {   // pts: pairs of points, each pair one dashed line
      let n = 0;
      for (let k = 0; k + 1 < pts.length; k += 2) {
        const a = pts[k], b = pts[k + 1], long = a.distanceTo(b);
        if (long < 1e-4) continue;
        way.copy(b).sub(a).divideScalar(long);
        for (let s = 0; s < long && n < DASHES; s += DASH + GAP) {
          const l = Math.min(DASH, long - s);
          piece.position.copy(a).addScaledVector(way, s + l / 2); piece.quaternion.setFromUnitVectors(UP, way); piece.scale.set(1, l, 1);
          piece.updateMatrix(); mesh.setMatrixAt(n++, piece.matrix);
        }
      }
      mesh.count = n; mesh.instanceMatrix.needsUpdate = true; mesh.visible = n > 0;
    }
    const spots = {}, labels = {};
    for (const [id, lines, shift] of [['s0', false, 0.18], ['s1', false, 0.18], ['s2', false, 0.18], ['angle', false, 0], ['f0', false, 0.1], ['f1', false, 0.1], ['f2', false, 0.1],
      ['part', false, 0.1], ['net', false, 0.1], ['weight', false, -0.1], ['list', true, 0]]) {
      spots[id] = new T.Vector3(); labels[id] = view.label(spots[id], lines, shift);
    }

    // ---------- the state ----------
    // one: the weight from one scale. two: the sleeves together, the angle is the state (layout from the angle).
    // free: two scales held by hand, each top anywhere in its upright plane (within REACH). three: hung from the ring,
    // each top at an angle round it (round). With free and three the cross-bar hangs where the stretched scales and the
    // weight balance (solve).
    const mode = () => (ctx.values.count === 'one' ? 'one' : ctx.values.count === 'three' ? (ctx.values.free ? 'free3' : 'three') : ctx.values.free ? 'free' : 'two');   // (free3: three scales taken off the ring and held by hand, each top anywhere within REACH)
    const count = () => ({ one: 1, three: 3, free3: 3 })[mode()] || 2;
    const REACH = { x: 3.2, z: 2.2, low: 3.6, high: 6.2 }, SLACK = 0.1;   // where a hand may hold a top; the least pull a scale held or hung must keep (N)
    const ROUND = [210, 330, 90];   // (three) where the sleeves start round the ring (°): back left, back right, front
    const held = [new T.Vector2(), new T.Vector2()], held3 = [new T.Vector3(), new T.Vector3(), new T.Vector3()], round = [...ROUND];
    const lay = { tops: [new T.Vector3(), new T.Vector3(), new T.Vector3()], J: new T.Vector3(), pulls: [0, 0, 0], angle: 0, n: 2 };
    // The cross-bar's place where the scales and the weight balance: least energy, w × height + Σ ½ K (stretch)² (a convex
    // function, so Newton's method from the last place finds it). tops: Vector3s. Returns { x, y, z, pulls }.
    const guesses = {};
    function solve(tops, w, key) {
      const g0 = guesses[key];
      let x = g0 ? g0.x : tops.reduce((s, q) => s + q.x, 0) / tops.length, y = g0 ? g0.y : Math.min(...tops.map((q) => q.y)) - L0 - EXT * w;
      let z = g0 ? g0.z : tops.reduce((s, q) => s + q.z, 0) / tops.length;
      const energy = (a, b, c) => w * b + tops.reduce((s, q) => { const st = Math.max(0, Math.hypot(a - q.x, b - q.y, c - q.z) - L0); return s + K * st * st / 2; }, 0);
      for (let k = 0; k < 80; k++) {
        const g = [0, w, 0], h = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        for (const q of tops) {
          const d = [x - q.x, y - q.y, z - q.z], l = Math.hypot(...d), st = l - L0;
          if (st <= 0 || l < 1e-9) continue;
          const n = d.map((e) => e / l), a = K * (1 - L0 / l), b = K * L0 / l;
          for (let i = 0; i < 3; i++) { g[i] += K * st * n[i]; for (let j = 0; j < 3; j++) h[i][j] += (i === j ? a : 0) + b * n[i] * n[j]; }
        }
        let s = solve3(h, g.map((e) => -e));
        if (!s) s = g.map((e) => -e * 0.05);
        let step = 1;
        const now = energy(x, y, z);
        while (step > 1e-4 && energy(x + s[0] * step, y + s[1] * step, z + s[2] * step) > now + 1e-12) step /= 2;
        x += s[0] * step; y += s[1] * step; z += s[2] * step;
        if (Math.hypot(...s) * step < 1e-10) break;
      }
      guesses[key] = { x, y, z };
      return { x, y, z, pulls: tops.map((q) => K * Math.max(0, Math.hypot(x - q.x, y - q.y, z - q.z) - L0)) };
    }
    function solve3(a, b) {   // a 3 × 3 linear system by Cramer's rule (null if singular)
      const det = (m) => m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
      const d = det(a);
      if (Math.abs(d) < 1e-12) return null;
      return [0, 1, 2].map((c) => det(a.map((row, i) => row.map((e, j) => (j === c ? b[i] : e)))) / d);
    }
    const onRing = (deg) => new T.Vector3(RING * Math.cos(deg * RAD), TOP, RING * Math.sin(deg * RAD));
    function layout(override) {   // override: { held, held3, round, w } to try an arrangement without taking it
      const m = mode(), w = override && override.w !== undefined ? override.w : W(), J = lay.J;
      lay.n = count();
      if (m === 'one') {
        lay.tops[0].set(0, TOP, ZS); lay.pulls = [w, 0, 0]; J.set(0, TOP - (L0 + EXT * w), ZS); lay.angle = 0;
      } else if (m === 'free') {
        const hh = override && override.held || held;
        const found = solve([new T.Vector3(hh[0].x, hh[0].y, 0), new T.Vector3(hh[1].x, hh[1].y, 0)], w, 'free');
        lay.tops[0].set(hh[0].x, hh[0].y, ZS); lay.tops[1].set(hh[1].x, hh[1].y, -ZS);
        J.set(found.x, found.y, 0); lay.pulls = [...found.pulls, 0];
        const u = [0, 1].map((k) => new T.Vector2(lay.tops[k].x - found.x, lay.tops[k].y - found.y).normalize());
        lay.angle = Math.acos(Math.max(-1, Math.min(1, u[0].dot(u[1])))) / RAD;
      } else if (m === 'free3') {
        const hh = override && override.held3 || held3;
        hh.forEach((one, k) => lay.tops[k].copy(one));
        const found = solve(lay.tops, w, 'free3');
        J.set(found.x, found.y, found.z); lay.pulls = found.pulls; lay.angle = NaN;
      } else if (m === 'three') {
        const rr = override && override.round || round;
        rr.forEach((deg, k) => lay.tops[k].copy(onRing(deg)));
        const found = solve(lay.tops, w, 'three');
        J.set(found.x, found.y, found.z); lay.pulls = found.pulls; lay.angle = NaN;
      } else {
        const angle = ctx.values.angle, half = angle / 2 * RAD, t = pull(angle, w), len = L0 + EXT * t, d = len * Math.sin(half);
        lay.tops[0].set(-d, TOP, ZS); lay.tops[1].set(d, TOP, -ZS);
        J.set(0, TOP - len * Math.cos(half), 0); lay.pulls = [t, t, 0]; lay.angle = angle;
      }
      return lay;
    }
    // can the scales hold the weight like this? (no scale slack, none past its scale, the weight clear of the bench)
    function trouble(override) {
      const l = layout(override), w = override && override.w !== undefined ? override.w : W(), on = l.pulls.slice(0, l.n);
      const why = Math.min(...on) < SLACK ? '저울이 느슨해집니다' : Math.max(...on) > FULL ? '저울의 눈금을 넘습니다' : l.J.y - bottomOf(w) < 0.05 ? '추가 실험대에 닿습니다' : '';
      layout();
      return why;
    }
    function holdFromLayout() {   // (into the free mode) the hands take the tops where the sleeves had them
      const was = ctx.values.free;
      ctx.values.free = false; layout(); ctx.values.free = was;
      if (lay.n === 3) held3.forEach((one, k) => one.copy(lay.tops[k])); else { held[0].set(lay.tops[0].x, lay.tops[0].y); held[1].set(lay.tops[1].x, lay.tops[1].y); }
      delete guesses.free; delete guesses.free3;
    }
    let tried = new Map(), triedFor = 2;   // (the sleeves together) angle -> what a scale read there, for one weight
    function plot() {   // against cos(angle ÷ 2)
      if (triedFor !== W()) { tried = new Map(); triedFor = W(); }
      const reading = ctx.traces.reading, law = ctx.traces.law; reading.clear(); law.clear();
      for (let a = 0; a <= MOST; a++) {
        const x = Math.cos(a / 2 * RAD);
        reading.add(x, tried.has(a) ? tried.get(a) : NaN); law.add(x, ctx.advanced ? pull(a, W()) : NaN);
      }
    }
    function note() {
      if (triedFor !== W()) plot();
      if (mode() === 'two') { const a = ctx.values.angle; if (!tried.has(a)) { tried.set(a, pull(a, W())); plot(); } }
    }
    function record() {
      const l = layout(), m = mode(), r = l.pulls.map((p, k) => (k < l.n ? two(p) : '—'));
      const sum = l.pulls.slice(0, l.n).reduce((s, p) => s + round2(p), 0);
      const row = [m === 'one' || l.n === 3 ? '—' : String(Math.round(l.angle)), ...r, two(sum), two(W())];
      const table = ctx.tables.table;
      if (table.rows.some((one) => one.join() === row.join())) return;
      table.add(row);
    }
    // where the angle is set by the sleeves: the angle whose sleeves stand d from the middle (the reach grows with the angle)
    function angleFor(d) {
      const w = W();
      if (d <= 0) return 0;
      if (d >= reach(MOST, w)) return MOST;
      let lo = 0, hi = MOST;
      for (let k = 0; k < 40; k++) { const mid = (lo + hi) / 2; if (reach(mid, w) < d) lo = mid; else hi = mid; }
      return Math.round((lo + hi) / 2);
    }

    // ---------- drawing ----------
    const tmp = new T.Vector3(), centre = new T.Vector3();
    function setArrow(a, from, vec) {   // an arrow from a point along a vector (its length is that of the vector)
      const n = vec.length();
      a.visible = n > 1e-4;
      if (!a.visible) return;
      a.position.copy(from); a.setLength(n); a.aim(way.copy(vec).divideScalar(n));
    }
    const heading = (vec) => { let a = Math.atan2(vec.y, vec.x) / RAD; if (a < -90) a += 360; return a; };   // (°, from the right, anticlockwise, between −90 and 270)
    function draw() {
      const l = layout(), v = ctx.values, m = mode(), n = l.n, w = W(), J = l.J, tops = l.tops, angle = l.angle;
      stand.visible = m === 'one' || m === 'two'; ringStand.visible = m === 'three';
      scales.forEach((one, k) => {
        const on = k < n;
        one.group.visible = on;
        if (k < 2) { sleeves[k].group.visible = on && (m === 'one' || m === 'two'); sleeves[k].group.position.x = tops[k].x; }
        hands[k].visible = on && (m === 'free' || m === 'free3'); hands[k].position.copy(tops[k]).add(new T.Vector3(0, 0.12, 0));
        ringSleeves[k].group.visible = m === 'three';
        if (m === 'three') { const at = onRing(round[k]); ringSleeves[k].group.position.set(at.x, H, at.z); ringSleeves[k].group.rotation.y = -(round[k] + 90) * RAD; }
        if (!on) return;
        const bottom = n === 3 ? J : tmp.set(J.x, J.y, m === 'one' ? ZS : one.z);
        one.group.position.copy(tops[k]);
        one.group.quaternion.setFromUnitVectors(DOWN, way.copy(bottom).sub(tops[k]).normalize());
        one.moving.position.y = -EXT * l.pulls[k];
      });
      hanger.position.copy(J); crossBar.visible = n === 2; knot.visible = n === 3;
      discs.forEach((d, k) => { d.visible = k < w; });

      // the pulls on the cross-bar, all drawn from its middle (three: from the little ring); gravity from the middle of the pile
      const f = [0, 1, 2].map((k) => {
        if (k >= n) return new T.Vector3();
        const d = n === 3 ? tops[k].clone().sub(J) : new T.Vector3(tops[k].x - J.x, tops[k].y - J.y, 0);
        return d.normalize().multiplyScalar(l.pulls[k] * PER_N);
      });
      protractor.visible = wedge.visible = n === 2;
      protractor.position.set(J.x, J.y + PROT / 2, 0);
      if (n === 2) { const a1 = heading(f[0]), a2 = heading(f[1]); shapeWedge(Math.min(a1, a2), Math.max(a1, a2) + (angle < 0.5 ? 0.5 : 0), J); }

      const showF = v.forces || v.net || v.parts, from = hanger.position, dim = v.parts ? 0.3 : 1;
      pulls.forEach((a, k) => { setArrow(a, from, f[k]); a.visible = showF && k < n; a.material.opacity = dim; });
      const part = f[0].clone().add(f[1]), sum = part.clone().add(f[2]);   // (three) F1 + F2 first, then + F3
      setArrow(arrows.part, from, part); arrows.part.visible = v.net && n === 3;
      setArrow(arrows.net, from, sum); arrows.net.visible = v.net && n > 1;
      centre.set(from.x, from.y - PILE - DISC.h * w / 2, from.z);
      setArrow(arrows.weight, centre, new T.Vector3(0, -w * PER_N, 0)); arrows.weight.visible = v.forces;
      // the parts: each pull split into level and upright; the upright parts end to end, so that together they are the weight
      let rise = 0;
      for (let k = 0; k < 3; k++) {
        const flat = new T.Vector3(f[k].x, 0, f[k].z), on = v.parts && n > 1 && k < n;
        setArrow(levels[k], from, flat); levels[k].visible = on && flat.length() > 1e-3;
        setArrow(uprights[k], tmp.copy(from).add(new T.Vector3(0, rise, 0)), new T.Vector3(0, f[k].y, 0)); uprights[k].visible = on;
        rise += k < n ? f[k].y : 0;
      }
      // the parallelograms (and, with the parts, the box of each pull)
      const pts = [], at = (vec) => from.clone().add(vec);
      if (v.net && n > 1) pts.push(at(f[0]), at(part), at(f[1]), at(part));
      if (v.net && n === 3) pts.push(at(part), at(sum), at(f[2]), at(sum));
      if (v.parts && n > 1) for (let k = 0; k < n; k++) if (Math.hypot(f[k].x, f[k].z) > 1e-3) pts.push(at(f[k]), at(new T.Vector3(f[k].x, 0, f[k].z)));
      dashLines(pts);

      // the writing: each scale's reading beside it, the angle beside the protractor, the names of the arrows
      scales.forEach((one, k) => {
        const id = `s${k}`, on = k < n;
        labels[id].show(on);
        if (!on) return;
        const dx = tops[k].x - J.x, tilt = Math.atan2(Math.hypot(dx, n === 3 ? tops[k].z - J.z : 0), tops[k].y - J.y), side = Math.abs(dx) > 1e-3 ? Math.sign(dx) : (k ? 1 : -1);
        spots[id].copy(one.group.position).lerp(hanger.position, 0.5);   // beside its middle: outwards while it hangs steep, above it as it lies flatter
        if (n === 3) { const out = new T.Vector2(tops[k].x - J.x, tops[k].z - J.z); if (out.length() < 1e-3) out.set(k === 1 ? 1 : -1, 0); out.normalize(); spots[id].copy(tops[k]).add(new T.Vector3(out.x * 0.45, 0.35, out.y * 0.45)); } else {   // (three: by its top, outwards)
          spots[id].x += side * 0.45 * Math.cos(tilt); spots[id].y += 0.45 * Math.sin(tilt); spots[id].z = 0; }
        labels[id].write(`저울 ${k + 1} <b>${two(l.pulls[k])} N</b>`);
      });
      labels.angle.show(n === 2);
      if (n === 2) { spots.angle.set(J.x + PROT + 0.45, J.y - 0.3, 0); labels.angle.write(`각 <b>${Math.round(angle)}°</b>`); }
      const tipOf = (id, vec, dy, side) => { spots[id].copy(from).add(vec); spots[id].x += (Math.abs(vec.x) > 0.02 ? Math.sign(vec.x) : side) * 0.25; spots[id].y += dy; };
      [0, 1, 2].forEach((k) => { tipOf(`f${k}`, f[k], 0, k === 1 ? 1 : -1); labels[`f${k}`].write(F(k + 1)); labels[`f${k}`].show(showF && !v.parts && k < n); });
      tipOf('part', part, 0.05, 0); tipOf('net', sum, 0.05, 0); spots.weight.copy(centre).add(new T.Vector3(0.45, -w * PER_N, 0));
      labels.part.write(`${F(1)} + ${F(2)}`); labels.part.show(v.net && n === 3);
      labels.net.write(n === 3 ? `${F(1)} + ${F(2)} + ${F(3)}` : `${F(1)} + ${F(2)}`); labels.net.show(v.net && n > 1);
      labels.weight.write('중력'); labels.weight.show(v.forces);
      // the values
      labels.list.show(v.numbers);
      if (v.numbers) {
        const readings = l.pulls.slice(0, n), sumR = readings.reduce((s, p) => s + round2(p), 0), names = n === 3 ? `${F(1)} + ${F(2)} + ${F(3)}` : `${F(1)} + ${F(2)}`;
        const lines = n === 1 ? [`저울 1 <b>${two(w)} N</b>`, `추의 무게 ${two(w)} N ↓`]
          : [...(n === 2 ? [`두 저울 사이의 각 <b>${Math.round(angle)}°</b>`] : []), readings.map((p, k) => `저울 ${k + 1} ${two(p)} N`).join(' · '), `눈금의 합 <b>${two(sumR)} N</b>`,
            `${n === 3 ? '세' : '두'} 저울이 당기는 힘의 알짜힘(${names}) <b>${two(sum.length() / PER_N)} N</b> ↑`, `추의 무게 ${two(w)} N ↓`];
        if (v.parts && n > 1) {
          lines.push(`연직 성분 ${f.slice(0, n).map((e) => `${two(e.y / PER_N)} N`).join(' + ')} = ${two(f.slice(0, n).reduce((s, e) => s + e.y, 0) / PER_N)} N`);
          if (n === 2) lines.push(`수평 성분 ${two(Math.abs(f[0].x) / PER_N)} N ${f[0].x < 0 ? '←' : '→'}, ${two(Math.abs(f[1].x) / PER_N)} N ${f[1].x < 0 ? '←' : '→'}`);
          else { const flat = new T.Vector3(sum.x, 0, sum.z); lines.push(`수평 성분의 합 ${two(flat.length() / PER_N)} N`); }
        }
        if (ctx.advanced && m === 'two') lines.push(`저울 하나의 눈금(${it('T')}) = 추의 무게(${it('W')}) ÷ (2 cos(각/2))`, `${two(l.pulls[0])} N = ${two(w)} N ÷ (2 × cos ${(angle / 2).toFixed(1)}°)`);
        labels.list.write(lines.join('<br>'));
        labels.list.shift = tall() ? -0.01 : 0;   // (tall: hung under the name of gravity; wide: on the bench in front, at the right)
        if (tall()) spots.list.set(centre.x, centre.y - w * PER_N - 0.5, centre.z); else spots.list.set(4.2, 1.0, 1.0);
      }
    }

    // ---------- handling ----------
    const ray = new T.Raycaster(), hit = new T.Vector3(), upright = new T.Plane(new T.Vector3(0, 0, 1), 0), level = new T.Plane(new T.Vector3(0, 1, 0), -H);
    // the place along a level bar (x) that the pointer points at: the point of the bar's line nearest to the pointer's line
    function along(r, z) {
      const b = r.direction.x, w0x = -r.origin.x, w0y = H - r.origin.y, w0z = z - r.origin.z;
      const d = w0x, e = r.direction.x * w0x + r.direction.y * w0y + r.direction.z * w0z, denom = 1 - b * b;
      if (denom < 1e-4) return null;
      return (b * e - d) / denom;
    }
    function inPlane(r, z) { upright.constant = -z; return r.intersectPlane(upright, hit) ? hit.clone() : null; }   // where the pointer meets an upright plane (z)
    const wrap = (deg) => ((deg % 360) + 360) % 360, gap = (a, b) => { const d = Math.abs(wrap(a) - wrap(b)); return Math.min(d, 360 - d); };
    const above = (y = 1.5) => hanger.position.clone().add(new T.Vector3(0, y, 0));
    const scalesTool = ({
      pick(r) {
        ray.ray.copy(r); world.updateMatrixWorld(true);
        const m = mode(), n = count();
        const targets = [...scales.slice(0, n).map((one) => one.body), ...(ctx.advanced ? discs.filter((d) => d.visible) : []),
          ...(m === 'free' ? hands.slice(0, 2) : m === 'free3' ? hands : m === 'three' ? ringSleeves.map((one) => one.grip) : m === 'two' ? sleeves.map((one) => one.grip) : [])];
        const found = ray.intersectObjects(targets, false)[0];
        if (!found) return null;
        const grip = found.object.userData.grip;
        // (held by hand, or hung from the ring, a scale is dragged as its top is; pressing it changes the number of scales only on the bars)
        const k = scales.findIndex((one) => one.body === found.object);
        return grip.kind === 'scale' && (m === 'free' || m === 'free3') ? { kind: 'hand', k } : grip.kind === 'scale' && m === 'three' ? { kind: 'ring', k } : grip;
      },
      cursor: (grip) => (!grip ? '' : grip.kind === 'scale' ? 'pointer' : 'grab'),
      start(grip, r) {
        const m = mode();
        if (grip.kind === 'scale') {   // pressing a scale: one scale, two, (advanced) three
          if (ctx.locked.has('count')) { say('잠금', above(), 1.2); return false; }
          ctx.setPlaying(false);
          const next = ctx.advanced ? { one: 'two', two: 'three', three: 'one' } : { one: 'two', two: 'one', three: 'two' };
          ctx.set('count', next[ctx.values.count]);
          return false;
        }
        ctx.setPlaying(false);
        if (grip.kind === 'load') {   // (advanced) the pile of discs: up for more, down for fewer
          const p = inPlane(r, hanger.position.z);
          if (!p) return false;
          grab = { kind: 'load', from: p.y, w: ctx.values.load, moved: false };
          return true;
        }
        if (grip.kind === 'hand' && m === 'free3') {
          // (three held by hand) looked at from the side, a top moves in the upright plane facing the eye (across, up and down);
          // looked at from above, in the level plane at its height (across, to and fro). Chosen when the drag begins, so it never jumps.
          const k = grip.k, flat = new T.Vector3(r.direction.x, 0, r.direction.z);
          const plane = Math.abs(r.direction.y) < 0.6 && flat.lengthSq() > 1e-6 ? new T.Plane().setFromNormalAndCoplanarPoint(flat.normalize(), held3[k]) : new T.Plane(new T.Vector3(0, 1, 0), -held3[k].y);
          if (!r.intersectPlane(plane, hit)) return false;
          grab = { kind: 'hand3', k, plane, offset: hit.clone().sub(held3[k]), moved: false };
          return true;
        }
        if (grip.kind === 'hand') {   // (free) a top held by hand, moved in the scale's upright plane
          const z = grip.k ? -ZS : ZS, p = inPlane(r, z);
          if (!p) return false;
          grab = { kind: 'hand', k: grip.k, z, offset: new T.Vector2(p.x - held[grip.k].x, p.y - held[grip.k].y), moved: false };
          return true;
        }
        if (grip.kind === 'ring') { grab = { kind: 'ring', k: grip.k, moved: false }; return true; }
        if (m !== 'two') return false;
        const x = along(r, grip.side < 0 ? ZS : -ZS);
        if (x === null) return false;
        grab = { kind: 'sleeve', side: grip.side, offset: x - sleeves[grip.side < 0 ? 0 : 1].group.position.x, moved: false };
        return true;
      },
      move(r) {
        if (!grab) return;
        if (grab.kind === 'load') {
          const p = inPlane(r, hanger.position.z);
          if (!p) return;
          if (ctx.locked.has('load')) { say('잠금', above(0.6)); return; }
          const to = Math.max(1, Math.min(4, grab.w + Math.round((p.y - grab.from) / 0.25)));
          if (to !== ctx.values.load) {
            const why = trouble({ w: to });
            if (why) { say(why, above(0.6), 1.2); return; }
            ctx.set('load', to); grab.moved = true;
          }
          say(`추의 무게 ${ctx.values.load.toFixed(1)} N`, above(0.6));
          return;
        }
        if (grab.kind === 'hand') {
          const p = inPlane(r, grab.z);
          if (!p) return;
          const k = grab.k, next = held.map((h) => h.clone());
          next[k].set(Math.max(-REACH.x, Math.min(REACH.x, p.x - grab.offset.x)), Math.max(REACH.low, Math.min(REACH.high, p.y - grab.offset.y)));
          const where = hands[k].position.clone().add(new T.Vector3(0, 0.5, 0)), why = trouble({ held: next });
          if (why) { say(why, where, 1.2); return; }   // (a hand may not let its scale go slack, pull it past its scale, or let the weight down onto the bench)
          held[k].copy(next[k]); grab.moved = true; moved = true;
          layout(); say(`저울 ${k + 1} ${two(lay.pulls[k])} N`, where);
          return;
        }
        if (grab.kind === 'hand3') {
          if (!r.intersectPlane(grab.plane, hit)) return;
          const k = grab.k, next = held3.map((h) => h.clone()), p = hit.clone().sub(grab.offset);
          next[k].set(Math.max(-REACH.x, Math.min(REACH.x, p.x)), Math.max(REACH.low, Math.min(REACH.high, p.y)), Math.max(-REACH.z, Math.min(REACH.z, p.z)));
          const where = hands[k].position.clone().add(new T.Vector3(0, 0.5, 0)), why = trouble({ held3: next });
          if (why) { say(why, where, 1.2); return; }
          held3[k].copy(next[k]); grab.moved = true; moved = true;
          layout(); say(`저울 ${k + 1} ${two(lay.pulls[k])} N`, where);
          return;
        }
        if (grab.kind === 'ring') {   // (three) a sleeve slid round the ring, in steps of 5°
          if (!r.intersectPlane(level, hit)) return;
          const k = grab.k, deg = wrap(Math.round(Math.atan2(hit.z, hit.x) / RAD / 5) * 5), where = onRing(round[k]).add(new T.Vector3(0, 0.7, 0));
          if (deg === round[k]) return;
          if (gap(deg, ARM) < CLEAR || round.some((other, j) => j !== k && gap(deg, other) < APART)) return;   // (not onto the arm, nor too near another sleeve)
          const next = [...round]; next[k] = deg;
          const why = trouble({ round: next });
          if (why) { say(why, where, 1.2); return; }
          round[k] = deg; grab.moved = true; moved = true;
          layout(); say(`저울 ${k + 1} ${two(lay.pulls[k])} N`, where);
          return;
        }
        const x = along(r, grab.side < 0 ? ZS : -ZS);
        if (x === null) return;
        const where = sleeves[grab.side < 0 ? 0 : 1].group.position.clone().add(new T.Vector3(0, 0.55, 0));
        if (ctx.locked.has('angle')) { say('잠금', where); return; }
        const to = angleFor((x - grab.offset) * grab.side);
        if (to !== ctx.values.angle) { ctx.set('angle', to); grab.moved = true; }
        say(`각 ${ctx.values.angle}°`, where);
      },
      end() {
        if (grab && grab.moved) record();
        grab = null; tip.show(false); tipTime = 0; moved = true;
      },
    });

    // ---------- the demonstration: the sleeves open slowly from 0° to the widest angle ----------
    let demoAngle = 0;
    ctx.on('play', (on) => {
      playing = on; moved = true;
      if (!on || !onScales()) return;
      quiet = true;
      if (ctx.values.count === 'one' && !ctx.locked.has('count')) ctx.set('count', 'two');
      if (mode() === 'two' && ctx.values.angle >= MOST) ctx.set('angle', 0);
      quiet = false;
      demoAngle = ctx.values.angle;
      const m = mode(), why = m === 'one' || m === 'three' || m === 'free3' ? '저울이 2개일 때 재생합니다' : m === 'free' ? '대칭으로 움직일 때 재생합니다' : ctx.locked.has('angle') ? '각이 잠겨 있습니다' : '';
      if (why) { say(why, above(), 1.8); stopSoon = true; return; }
      note(); record();
    });
    ctx.on('tick', (t, dt) => {
      if (!dt || stopSoon || !onScales() || mode() !== 'two' || ctx.locked.has('angle')) return;   // (a tick while not playing is one step at a time)
      demoAngle = Math.min(MOST, demoAngle + RATE * dt);
      const to = Math.floor(demoAngle + 1e-9);
      if (to !== ctx.values.angle) {
        quiet = true; ctx.set('angle', to); quiet = false;
        if (to % 30 === 0) record();
      }
      if (demoAngle >= MOST && playing) stopSoon = true;
    });
    ctx.on('action', (id) => {
      if (id !== 'reset' || !onScales()) return;
      quiet = true; if (!ctx.locked.has('angle')) ctx.set('angle', 0); quiet = false;
      if (mode() === 'free') holdFromLayout();   // (held by hand: the hands go back to where the sleeves would be at that angle)
      if (mode() === 'three') { round.splice(0, 3, ...ROUND); delete guesses.three; }
      if (mode() === 'free3') { round.splice(0, 3, ...ROUND); holdFromLayout(); }   // (three held by hand: back to where the ring held them)
      demoAngle = ctx.values.angle; moved = true;
    });
    ctx.on('view', () => { moved = true; });
    ctx.on('change', (id) => {
      moved = true;
      if (!onScales()) return;
      if (id === 'angle') { note(); if (!quiet) { demoAngle = ctx.values.angle; if (playing) ctx.setPlaying(false); } }
      if (id === 'count' && ctx.values.count === lastCount) return;   // (the same choice pressed again)
      if (id === 'count') { lastCount = ctx.values.count; if (!quiet && playing) ctx.setPlaying(false); if (ctx.values.free && ctx.values.count !== 'one') holdFromLayout(); note(); record(); }
      if (id === 'free') { if (playing) ctx.setPlaying(false); if (ctx.values.free) holdFromLayout(); else note(); }
      if (id === 'load') {
        // a heavier weight held by hand may pull a scale past its scale or the weight onto the bench: the hands go back to the sleeves' places
        if (mode() === 'free' && trouble()) holdFromLayout();
        if (mode() === 'three' && trouble()) round.splice(0, 3, ...ROUND);
        if (mode() === 'free3' && trouble()) { round.splice(0, 3, ...ROUND); holdFromLayout(); }
        plot(); note(); if (!quiet && !grab) record();
      }
    });
    let lastCount = ctx.values.count, wasAdvanced = ctx.advanced;
    ctx.on('mode', () => {
      moved = true;
      if (ctx.advanced === wasAdvanced) return;   // (this comes for the class and inquiry buttons too, and when the screen opens)
      wasAdvanced = ctx.advanced;
      // back in the basic mode the weight is 2 N again (its slider is put away; the frame puts three scales back to two)
      if (mode() === 'free' && trouble()) holdFromLayout();
      plot(); note();
    });

    // ====================================== the force table ======================================
    // A round table with a scale of degrees round its edge. A ring in the middle is pulled by two or three strings, each
    // over a pulley clamped to the edge and down to a hanger of slotted weights: each string pulls the ring with the
    // weight of its hanger, towards its pulley. A pin through the ring holds it in the middle. Pulled out, the ring is
    // free as far as the short post in the middle lets it (CLEAR): if the pulls of the strings add up to nothing, it stays
    // in the middle; if not, it moves off on the side towards which their sum points, until the strings (turned a little)
    // balance — a few millimetres for a small sum — or it leans on the post, at most CLEAR from the middle. (Let go of the
    // post as well, the ring would not move off along that sum: the hangers would fall with it and the pulls would no
    // longer be the weights. The post keeps the test what the textbook's force table is for: in balance or not.)
    // Angles are read round the table from its 0° mark, anticlockwise seen from above.
    const S2 = new T.Group(); world.add(S2); S2.visible = false;
    const TB = { y: 3.0, R: 2.0, CLEAR: 0.15, ring: 0.2, lift: 0.08, wheel: 0.12, per: 0.1, drop: 1.1, TOL: 0.05, APART: 15 };
    // (the table's top TB.y above the bench; the strings LIFT above it; each pulley's wheel at R + wheel from the middle, its
    // top at the strings' height, so that a string goes down at R + 2 wheel; an arrow PER long for each newton; a hanger
    // DROP below its pulley with the ring in the middle; the least sum that moves the ring (N); the least angle between two pulleys)
    const along2 = (deg) => new T.Vector3(Math.cos(deg * RAD), 0, -Math.sin(deg * RAD));   // the way a direction (°) points on the table
    const headingOf = (x, z) => { let a = Math.atan2(-z, x) / RAD; if (a < 0) a += 360; return a; };
    const tableParts = new T.Group(), GREEN_STAND = mat(0x4f9a63);
    add(tableParts, cyl(TB.R, TB.R, 0.06, 72), mat(0x2b2f3a), 0, TB.y - 0.03, 0);
    add(tableParts, cyl(0.09, 0.12, TB.y - 0.12, 16), GREEN_STAND, 0, (TB.y - 0.12) / 2 + 0.06, 0);
    for (const a of [90, 210, 330]) { const leg = add(tableParts, box(1.2, 0.08, 0.24), GREEN_STAND, Math.cos(a * RAD) * 0.55, 0.06, -Math.sin(a * RAD) * 0.55); leg.rotation.y = a * RAD; }
    add(tableParts, cyl(0.03, 0.03, 0.14, 10), M.steel, 0, TB.y + 0.07, 0);   // the short post in the middle
    S2.add(kit.mergeStatic(tableParts));
    const face = kit.canvasTexture(1024, 1024, (g, w, h) => {
      const cx = w / 2, cy = h / 2, r = w / 2 - 6;
      g.fillStyle = '#2b2f3a'; g.fillRect(0, 0, w, h);
      g.strokeStyle = '#f3eedf'; g.fillStyle = '#f3eedf'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '600 30px Georgia, serif';
      for (let a = 0; a < 360; a++) {
        const long = a % 10 === 0 ? 34 : a % 5 === 0 ? 22 : 12, c = Math.cos(a * RAD), s = Math.sin(a * RAD);
        g.lineWidth = a % 10 === 0 ? 3 : 1.5;
        g.beginPath(); g.moveTo(cx + c * r, cy - s * r); g.lineTo(cx + c * (r - long), cy - s * (r - long)); g.stroke();
        if (a % 30 === 0) g.fillText(String(a), cx + c * (r - 62), cy - s * (r - 62));
      }
      g.globalAlpha = 0.25; g.lineWidth = 2; g.beginPath(); g.arc(cx, cy, r * 0.5, 0, Math.PI * 2); g.stroke(); g.globalAlpha = 1;
    });
    const faceMesh = add(S2, new T.CircleGeometry(TB.R, 96), new T.MeshStandardMaterial({ map: face, roughness: 0.9 }), 0, TB.y + 0.002, 0, false);
    faceMesh.rotation.x = -Math.PI / 2;
    // the ring, and the pin that holds it (in it, or laid on the bench beside the table)
    const ring2 = add(S2, new T.TorusGeometry(TB.ring, 0.022, 10, 36), M.rod, 0, TB.y + TB.lift, 0); ring2.rotation.x = Math.PI / 2;
    const pin = new T.Group(); S2.add(pin);
    add(pin, cyl(0.17, 0.17, 0.2, 24), M.steel, 0, 0.1, 0).userData.grip = { kind: 'pin' };
    add(pin, new T.SphereGeometry(0.09, 16, 12), M.dark, 0, 0.26, 0).userData.grip = { kind: 'pin' };
    // a pulley and a hanger for each string
    const DISCS = 19, SLOT = 0.04;   // slotted weights of 0.5 N each on a hanger that is itself 0.5 N
    function pulley(k) {
      const group = new T.Group(); S2.add(group);
      const clamp = add(group, box(0.34, 0.24, 0.2), M.dark, TB.R + 0.02, TB.y - 0.02, 0); clamp.userData.grip = { kind: 'pulley', k };
      add(group, box(0.2, 0.05, 0.06), M.steel, TB.R + 0.12, TB.y + TB.lift - TB.wheel, -0.06);
      const wheel = add(group, cyl(TB.wheel, TB.wheel, 0.04, 24), M.cap, TB.R + TB.wheel, TB.y + TB.lift - TB.wheel, 0); wheel.rotation.x = Math.PI / 2; wheel.userData.grip = { kind: 'pulley', k };
      const hang = new T.Group(); S2.add(hang);
      add(hang, cyl(0.012, 0.012, 0.18, 6), M.steel, 0, -0.09, 0);
      const plate = add(hang, cyl(0.13, 0.13, 0.025, 20), M.brass, 0, -0.19, 0); plate.userData.grip = { kind: 'hanger', k };
      const slots = [];
      for (let n = 0; n < DISCS; n++) { const d = add(hang, cyl(0.125, 0.125, SLOT - 0.006, 20), M.brass, 0, -0.2 + SLOT * (n + 0.5), 0); d.userData.grip = { kind: 'hanger', k }; slots.push(d); }
      add(hang, cyl(0.012, 0.012, DISCS * SLOT + 0.05, 6), M.steel, 0, -0.2 + (DISCS * SLOT + 0.05) / 2, 0);
      const across = add(S2, cyl(0.007, 0.007, 1, 6), M.string, 0, 0, 0), down = add(S2, cyl(0.007, 0.007, 1, 6), M.string, 0, 0, 0);
      return { group, hang, slots, plate, across, down, grips: [clamp, wheel, plate, ...slots] };
    }
    const wheels = [0, 1, 2].map(pulley);
    // the axes along which the pulls are split (turned, an inquiry)
    const axisLines = [0, 1].map(() => add(S2, box(2 * TB.R * 0.95, 0.006, 0.012), mat(0x9fb6d9), 0, TB.y + 0.01, 0, false));
    const axisKnob = add(S2, new T.SphereGeometry(0.08, 16, 12), M.hand, 0, 0, 0); axisKnob.userData.grip = { kind: 'axis' };
    // (advanced) the two ways, not at right angles, along which the sum is split: a line and a knob at the edge for each
    const skew = [0, 60], SKEW_INK = 0x6b4fa0;
    const skewLines = [0, 1].map(() => add(S2, box(2 * TB.R * 0.95, 0.006, 0.012), mat(0xc9b6e6), 0, TB.y + 0.012, 0, false));
    const skewKnobs = [0, 1].map((k) => { const m = add(S2, new T.SphereGeometry(0.08, 16, 12), mat(0xb69ad8), 0, 0, 0); m.userData.grip = { kind: 'skew', k }; return m; });

    // the marks: arrows (1 N for each PER), the parallelograms and the moved arrows of the triangle way, the parts
    const pulls2 = INK.map((c) => kit.arrow(c, 0.022)), moved2 = INK.map((c) => kit.arrow(c, 0.018)), parts2 = [...INK, ...INK].map((c) => kit.arrow(c, 0.014));
    const net2 = kit.arrow(PURPLE, 0.03), part2 = kit.arrow(LILAC, 0.026);
    for (const a of moved2) a.material.opacity = 0.45;
    const balance2 = kit.arrow(0x1f9d8f, 0.026), skewArrows = [0, 1].map(() => kit.arrow(SKEW_INK, 0.02));   // (advanced) the force that would balance the sum; the sum split two ways
    for (const a of [...pulls2, ...moved2, ...parts2, net2, part2, balance2, ...skewArrows]) S2.add(a);
    const dashes2 = new T.InstancedMesh(cyl(0.008, 0.008, 1, 6), new T.MeshBasicMaterial({ color: 0x5b3d82, transparent: true, opacity: 0.9, depthTest: false, depthWrite: false }), DASHES);
    dashes2.renderOrder = 9; dashes2.frustumCulled = false; S2.add(dashes2);
    const spots2 = {}, labels2 = {};
    for (const [id, lines, shift] of [['w0', false, -0.05], ['w1', false, -0.05], ['w2', false, -0.05], ['f0', false, 0.06], ['f1', false, 0.06], ['f2', false, 0.06], ['part', false, 0.06], ['net', false, 0.06],
      ['state', false, 0.25], ['ax', false, 0.04], ['ay', false, 0.04], ['bal', false, 0.06], ['d0', false, 0.04], ['d1', false, 0.04], ['list', true, 0]]) { spots2[id] = new T.Vector3(); labels2[id] = view.label(spots2[id], lines, shift); }
    const hideLabels = (set) => { for (const one of Object.values(set)) one.show(false); };

    // ---------- the state ----------
    const many2 = () => (ctx.values.forces2 === 'three' ? 3 : 2);
    const F2 = (k) => ctx.values[`f${k + 1}`], A2 = (k) => ctx.values[`a${k + 1}`];
    const ringAt = new T.Vector2(), ringTo = new T.Vector2();   // where the ring is, on the table (x, z), and where it is going
    let axis = 0, moved2Flag = true, demo2 = null;   // the axes' turn (°); (the demonstration) the angle between F1 and F2 it has reached
    const wheelTop = (k) => along2(A2(k)).multiplyScalar(TB.R + TB.wheel);   // where a string leaves the ring's level for its pulley
    function pullsAt(c) {   // the pulls of the strings on a ring at c (Vector2, x and z): weight × the way to its pulley
      return [0, 1, 2].map((k) => {
        if (k >= many2()) return new T.Vector3();
        const p = wheelTop(k), d = new T.Vector3(p.x - c.x, 0, p.z - c.y);
        return d.normalize().multiplyScalar(F2(k));
      });
    }
    const sumOf = (list) => list.reduce((s, f) => s.add(f), new T.Vector3());
    let restKey = '', restAt = new T.Vector2();
    function restPlace() {   // where the ring comes to rest (worked out again only when the pulls or the pin have changed)
      const key = [ctx.values.pinOut, many2(), F2(0), A2(0), F2(1), A2(1), F2(2), A2(2)].join();
      if (key !== restKey) { restKey = key; restAt = findRest(); }
      return restAt.clone();
    }
    function findRest() {   // in the middle while the pin is in, or while the pulls (nearly) cancel
      if (!ctx.values.pinOut || sumOf(pullsAt(new T.Vector2())).length() < TB.TOL) return new T.Vector2();
      // the least of Σ weight × string's length across (the hangers' height), with the ring no farther than CLEAR from the middle
      const c = new T.Vector2();
      for (let k = 0; k < 2000; k++) {
        const s = sumOf(pullsAt(c));
        if (s.length() * 0.0015 < 1e-7) break;
        c.x += s.x * 0.0015; c.y += s.z * 0.0015;
        if (c.length() > TB.CLEAR) c.setLength(TB.CLEAR);
      }
      return c;
    }
    const between = () => { const d = Math.abs(A2(0) - A2(1)) % 360; return Math.min(d, 360 - d); };
    let tried2 = new Map(), triedKey = '';   // (two forces) the angle between them -> the size of their sum, for one pair of sizes
    function plot2() {
      const key = `${F2(0)}/${F2(1)}`;
      if (key !== triedKey) { tried2 = new Map(); triedKey = key; }
      const t = ctx.traces.sum2, law = ctx.traces.sum2law; t.clear(); law.clear();
      for (let a = 0; a <= 180; a++) { t.add(a, tried2.has(a) ? tried2.get(a) : NaN); law.add(a, ctx.advanced ? Math.sqrt(F2(0) ** 2 + F2(1) ** 2 + 2 * F2(0) * F2(1) * Math.cos(a * RAD)) : NaN); }
    }
    function note2() {
      if (`${F2(0)}/${F2(1)}` !== triedKey) plot2();
      if (many2() !== 2) return;
      const a = Math.round(between());
      if (!tried2.has(a)) { tried2.set(a, sumOf(pullsAt(new T.Vector2())).length()); plot2(); }
    }
    function record2() {
      const n = many2(), s = sumOf(pullsAt(new T.Vector2())), col = (k) => (k < n ? [F2(k).toFixed(1), String(A2(k))] : ['—', '—']);
      const row = [...col(0), ...col(1), ...col(2), s.length().toFixed(2), s.length() < TB.TOL ? '—' : String(Math.round(headingOf(s.x, s.z)) % 360), restPlace().length() > 1e-4 ? '평형이 아님' : '평형'];
      const table = ctx.tables.table2;
      if (table.rows.some((one) => one.join() === row.join())) return;
      table.add(row);
    }

    // ---------- drawing ----------
    function draw2() {
      const v = ctx.values, n = many2(), y = TB.y + TB.lift + 0.01, ringIn = !v.pinOut;
      const c = new T.Vector3(ringAt.x, y, ringAt.y), at = (vec) => c.clone().add(vec);
      ring2.position.set(ringAt.x, TB.y + TB.lift, ringAt.y);
      if (ringIn) { pin.position.set(0, TB.y + 0.02, 0); pin.rotation.set(0, 0, 0); } else { pin.position.set(-2.7, 0.17, 1.4); pin.rotation.set(0, 0.4, Math.PI / 2); }
      // the pulls as set on the table (each towards its pulley from the middle): drawn from the ring wherever it is, and written
      // (pushed against the post, the ring is at most CLEAR off the middle: the strings then turn by a few degrees)
      const f = pullsAt(new T.Vector2());
      wheels.forEach((one, k) => {
        const on = k < n;
        one.group.visible = one.hang.visible = one.across.visible = one.down.visible = on;
        if (!on) return;
        one.group.rotation.y = A2(k) * RAD;
        const top = wheelTop(k), dir = along2(A2(k)), fall = dir.clone().multiplyScalar(TB.R + 2 * TB.wheel);
        // the string: across from the ring's edge to the top of the wheel, and down to the hanger (the farther the ring from its pulley, the higher the hanger)
        const centre2 = new T.Vector3(ringAt.x, TB.y + TB.lift, ringAt.y), to = new T.Vector3(top.x, TB.y + TB.lift, top.z), from = centre2.clone().add(to.clone().sub(centre2).setLength(TB.ring)), span = to.clone().sub(from);
        one.across.position.copy(from).addScaledVector(span, 0.5); one.across.scale.y = span.length(); one.across.quaternion.setFromUnitVectors(UP, span.normalize());
        const drop = TB.drop - (centre2.distanceTo(to) - (TB.R + TB.wheel)), axle = TB.y + TB.lift - TB.wheel;
        one.hang.position.set(fall.x, axle - drop, fall.z);
        one.down.position.set(fall.x, axle - drop / 2, fall.z); one.down.scale.y = drop; one.down.quaternion.identity();
        const count = Math.round(F2(k) / 0.5) - 1;
        one.slots.forEach((d, j) => { d.visible = j < count; });
        spots2[`w${k}`].set(fall.x, axle - drop - 0.25, fall.z); labels2[`w${k}`].write(`F<sub>${k + 1}</sub> ${F2(k).toFixed(1)} N`);
        labels2[`w${k}`].show(!(tall() && v.numbers));   // (on a tall screen the list of values says the same, where these would be covered)
      });
      for (let k = n; k < 3; k++) labels2[`w${k}`].show(false);
      // the pulls from the ring (hidden while it is moving)
      const still = ringAt.distanceTo(ringTo) < 0.002, show = (on) => on && still;
      const dim = v.parts ? 0.3 : 1, ff = f.map((one) => one.clone().multiplyScalar(TB.per));
      pulls2.forEach((a, k) => { setArrow(a, c, ff[k]); a.visible = show(v.forces || v.parallel || v.triangle || v.parts) && k < n; a.material.opacity = dim; });
      const part = ff[0].clone().add(ff[1]), sum = part.clone().add(ff[2]);
      setArrow(part2, c, part); part2.visible = show(v.parallel && n === 3);
      setArrow(net2, c, sum); net2.visible = show(v.net || v.parallel || v.triangle);
      // the triangle way: F2 moved to the head of F1 (and F3 to the head of F1 + F2), faint
      moved2[0].visible = false;   // (F1 is never moved)
      setArrow(moved2[1], at(ff[0]), ff[1]); moved2[1].visible = show(v.triangle);
      setArrow(moved2[2], at(part), ff[2]); moved2[2].visible = show(v.triangle && n === 3);
      // the parts along the two axes (turned by axis)
      const e1 = along2(axis), e2 = along2(axis + 90), pts = [];
      for (let k = 0; k < 3; k++) {
        const p1 = e1.clone().multiplyScalar(ff[k].dot(e1)), p2 = e2.clone().multiplyScalar(ff[k].dot(e2)), on = show(v.parts) && k < n;
        setArrow(parts2[k], c, p1); parts2[k].visible = on && p1.length() > 1e-3;
        setArrow(parts2[k + 3], c, p2); parts2[k + 3].visible = on && p2.length() > 1e-3;
        if (on) pts.push(at(ff[k]), at(p1), at(ff[k]), at(p2));
      }
      if (show(v.parallel)) { pts.push(at(ff[0]), at(part), at(ff[1]), at(part)); if (n === 3) pts.push(at(part), at(sum), at(ff[2]), at(sum)); }
      const axesOn = v.parts || v.axes;
      axisLines.forEach((line, k) => { line.visible = axesOn; line.rotation.y = (axis + k * 90) * RAD; line.position.set(0, TB.y + 0.01, 0); });
      axisKnob.visible = v.axes; axisKnob.position.copy(e1.clone().multiplyScalar(TB.R * 0.95)).setY(TB.y + 0.06);
      const prime = v.axes ? '′' : '';
      spots2.ax.copy(e1.clone().multiplyScalar(TB.R * 0.95 + 0.25)).setY(TB.y + 0.02); spots2.ay.copy(e2.clone().multiplyScalar(TB.R * 0.95 + 0.25)).setY(TB.y + 0.02);
      labels2.ax.write(`${it('x')}${prime}`); labels2.ay.write(`${it('y')}${prime}`); labels2.ax.show(axesOn); labels2.ay.show(axesOn);
      // (advanced) the force that balances the sum: as large, the other way
      setArrow(balance2, c, sum.clone().negate()); balance2.visible = show(v.balance) && sum.length() > TB.TOL * TB.per;
      // (advanced) the sum split along two ways that need not be at right angles: sum = a e₁ + b e₂ (a parallelogram on those two lines)
      const d = skew.map((deg) => along2(deg)), det = d[0].x * d[1].z - d[0].z * d[1].x;
      const ab = [(sum.x * d[1].z - sum.z * d[1].x) / det, (d[0].x * sum.z - d[0].z * sum.x) / det];
      const skewOn = Boolean(v.skew) && ctx.advanced;
      skewArrows.forEach((a, k) => { const piece = d[k].clone().multiplyScalar(ab[k]); setArrow(a, c, piece); a.visible = show(skewOn) && piece.length() > 1e-3; if (show(skewOn)) pts.push(at(piece), at(sum)); });
      skewLines.forEach((line, k) => { line.visible = skewOn; line.rotation.y = skew[k] * RAD; line.position.set(0, TB.y + 0.012, 0); });
      skewKnobs.forEach((knob, k) => { knob.visible = skewOn; knob.position.copy(d[k].clone().multiplyScalar(TB.R * 0.95)).setY(TB.y + 0.06); spots2[`d${k}`].copy(d[k].clone().multiplyScalar(TB.R * 0.95 + 0.3)).setY(TB.y + 0.02); labels2[`d${k}`].write(`방향 ${k + 1}`); labels2[`d${k}`].show(skewOn); });
      dashLines(pts, dashes2);
      // the names of the arrows
      const tip2 = (id, vec) => { spots2[id].copy(at(vec)).add(vec.clone().normalize().multiplyScalar(0.12)); };
      [0, 1, 2].forEach((k) => { tip2(`f${k}`, ff[k]); labels2[`f${k}`].write(F(k + 1)); labels2[`f${k}`].show(pulls2[k].visible && !v.parts); });
      tip2('part', part); labels2.part.write(`${F(1)} + ${F(2)}`); labels2.part.show(part2.visible);
      tip2('net', sum); labels2.net.write(n === 3 ? `${F(1)} + ${F(2)} + ${F(3)}` : `${F(1)} + ${F(2)}`);   // (the sum of the strings' pulls: the ring is held by the pin or the post as well)
      labels2.net.show(net2.visible);
      tip2('bal', sum.clone().negate()); labels2.bal.write('평형을 이루는 힘'); labels2.bal.show(balance2.visible);
      // the pin's result
      const off = ringTo.length() > 1e-4;
      labels2.state.show(Boolean(v.pinOut) && still);
      spots2.state.set(ringAt.x, TB.y + 0.05, ringAt.y + 0.75); labels2.state.write(off ? '<b>평형이 아님</b>' : '<b>평형</b>');
      // the values
      labels2.list.show(v.numbers);
      if (v.numbers) {
        const s = sumOf(f), lines = [0, 1, 2].slice(0, n).map((k) => `${F(k + 1)} ${F2(k).toFixed(1)} N · ${A2(k)}°`);
        if (n === 2) lines.push(`두 힘 사이의 각(${it('θ')}) <b>${Math.round(between())}°</b>`);
        lines.push(`실이 당기는 힘의 알짜힘 <b>${s.length().toFixed(2)} N</b>${s.length() < TB.TOL ? '' : ` · ${Math.round(headingOf(s.x, s.z)) % 360}°`}`);
        if (v.parts) {
          for (const [e, name] of [[e1, `${it('x')}${prime}`], [e2, `${it('y')}${prime}`]]) {
            const comps = f.slice(0, n).map((one) => one.dot(e));
            const signed = (x) => (Math.abs(x) < 0.005 ? '0.00' : x.toFixed(2)).replace('-', '−');
            const plain = (x) => (Math.abs(x) < 0.005 ? '0.00' : x.toFixed(2));
            lines.push(`${name} 성분 ${comps.map(plain).join(' + ').replace(/\+ -/g, '− ').replace(/^-/, '−')} = ${signed(comps.reduce((a, b) => a + b, 0))} N`);
          }
        }
        const minus = (x) => (Math.abs(x) < 0.005 ? '0.00' : x.toFixed(2).replace('-', '−'));
        if (ctx.advanced && v.balance && s.length() >= TB.TOL) lines.push(`평형을 이루는 힘 ${s.length().toFixed(2)} N · ${Math.round(headingOf(-s.x, -s.z)) % 360}°`);
        if (skewOn) lines.push(`나눈 힘: 방향 1(${skew[0]}°) ${minus(ab[0] / TB.per)} N, 방향 2(${skew[1]}°) ${minus(ab[1] / TB.per)} N`);
        if (ctx.advanced && n === 2) {
          const th = Math.round(between()), x1 = F2(0).toFixed(1), x2 = F2(1).toFixed(1);
          lines.push(`알짜힘의 크기(${it('F')}) = √(${F(1)}² + ${F(2)}² + 2${F(1)}${F(2)} cos θ)`, `${s.length().toFixed(2)} N = √(${x1}² + ${x2}² + 2 × ${x1} × ${x2} × cos ${th}°)`);
        }
        if (v.pinOut) lines.push(`핀을 뽑으면 <b>${off ? '평형이 아님' : '평형'}</b>`);
        labels2.list.write(lines.join('<br>'));
        if (tall()) spots2.list.set(0, 0.2, 3.4); else spots2.list.set(3.6, 3.9, 0.4);
      }
    }

    // ---------- handling ----------
    const tableLevel = new T.Plane(new T.Vector3(0, 1, 0), -TB.y);
    const tableTool = {
      pick(r) {
        ray.ray.copy(r); world.updateMatrixWorld(true);
        const targets = [...wheels.slice(0, many2()).flatMap((one) => one.grips.filter((m) => m.visible)), ...pin.children, ...(ctx.values.axes ? [axisKnob] : []), ...(ctx.values.skew && ctx.advanced ? skewKnobs : [])];
        const found = ray.intersectObjects(targets, false)[0];
        return found ? found.object.userData.grip : null;
      },
      cursor: (grip) => (!grip ? '' : grip.kind === 'pin' ? 'pointer' : 'grab'),
      start(grip, r) {
        ctx.setPlaying(false);
        if (grip.kind === 'pin') { ctx.set('pinOut', !ctx.values.pinOut); return false; }
        if (grip.kind === 'hanger') {
          const at = wheels[grip.k].hang.position.clone(), flat = new T.Vector3(r.direction.x, 0, r.direction.z);
          if (flat.lengthSq() < 1e-6) flat.set(0, 0, -1);
          const plane = new T.Plane().setFromNormalAndCoplanarPoint(flat.normalize(), at);
          if (!r.intersectPlane(plane, hit)) return false;
          grab = { kind: 'hanger', k: grip.k, plane, from: hit.y, f: F2(grip.k), moved: false };
          return true;
        }
        grab = { kind: grip.kind, k: grip.k, moved: false };
        return true;
      },
      move(r) {
        if (!grab) return;
        if (grab.kind === 'hanger') {
          if (!r.intersectPlane(grab.plane, hit)) return;
          const id = `f${grab.k + 1}`, where = wheels[grab.k].hang.position.clone().add(new T.Vector3(0, 0.45, 0));
          if (ctx.locked.has(id)) { say('잠금', where); return; }
          const to = Math.max(0.5, Math.min(10, grab.f + Math.round((hit.y - grab.from) / 0.12) * 0.5));
          if (to !== F2(grab.k)) { ctx.set(id, to); grab.moved = true; }
          say(`${F(grab.k + 1)} ${F2(grab.k).toFixed(1)} N`, where);
          return;
        }
        if (!r.intersectPlane(tableLevel, hit)) return;
        if (grab.kind === 'skew') {   // (advanced) one of the two ways turned, in steps of 5°, never parallel to the other
          const k = grab.k, to = Math.round(headingOf(hit.x, hit.z) / 5) * 5 % 360, where = skewKnobs[k].position.clone().add(new T.Vector3(0, 0.35, 0));
          if (to === skew[k]) return;
          if (Math.abs(Math.sin((to - skew[1 - k]) * RAD)) < Math.sin(10 * RAD)) { say('두 방향이 나란하면 나눌 수 없습니다', where, 1.2); return; }
          skew[k] = to; moved2Flag = true; say(`방향 ${k + 1} ${to}°`, where);
          return;
        }
        if (grab.kind === 'axis') {
          const to = Math.round(headingOf(hit.x, hit.z) / 5) * 5 % 360;
          if (to !== axis) { axis = to; moved2Flag = true; }
          say(`${it('x')}′축 ${axis}°`, axisKnob.position.clone().add(new T.Vector3(0, 0.35, 0)));
          return;
        }
        const k = grab.k, id = `a${k + 1}`, deg = Math.round(headingOf(hit.x, hit.z)) % 360, where = wheelTop(k).setY(TB.y + 0.5);
        if (ctx.locked.has(id)) { say('잠금', where); return; }
        if (deg === A2(k)) return;
        if (clash(k, deg)) return;   // (a pulley may not run into another)
        ctx.set(id, deg); grab.moved = true;
        say(`${F(k + 1)} ${deg}°`, wheelTop(k).setY(TB.y + 0.5));
      },
      end() {
        if (grab && grab.moved && ctx.values.pinOut) record2();
        grab = null; tip.show(false); tipTime = 0; moved2Flag = true;
      },
    };
    const gapDeg = (a, b) => { const d = Math.abs(a - b) % 360; return Math.min(d, 360 - d); };
    const clash = (k, deg) => [0, 1, 2].some((j) => j !== k && j < many2() && gapDeg(deg, A2(j)) < TB.APART);
    const lastAngles = {};

    function update2(dt) {
      const target = restPlace();
      if (!target.equals(ringTo)) { ringTo.copy(target); moved2Flag = true; }
      if (ringAt.distanceTo(ringTo) > 1e-5) { ringAt.lerp(ringTo, 1 - Math.exp(-dt * 10)); if (ringAt.distanceTo(ringTo) < 0.001) ringAt.copy(ringTo); moved2Flag = true; }
      if (!moved2Flag) return false;
      moved2Flag = false; draw2();
      return true;
    }
    // the demonstration (two forces): F2 is carried round from 15° past F1 to the far side of it, the sum's size kept on the graph
    function play2(on) {
      if (!on) return;
      if (many2() !== 2) { say('힘이 2개일 때 재생합니다', new T.Vector3(0, TB.y + 0.8, 0), 1.8); stopSoon = true; return; }
      if (ctx.locked.has('a2')) { say('방향이 잠겨 있습니다', new T.Vector3(0, TB.y + 0.8, 0), 1.8); stopSoon = true; return; }
      const now = Math.round(between());
      demo2 = now >= 180 ? TB.APART : now;
      quiet = true; ctx.set('a2', (A2(0) + Math.round(demo2)) % 360); quiet = false; note2();
    }
    function tick2(dt) {
      if (demo2 === null || many2() !== 2) return;
      demo2 = Math.min(180, demo2 + 15 * dt);
      const to = (A2(0) + Math.floor(demo2 + 1e-9)) % 360;
      if (to !== A2(1)) { quiet = true; ctx.set('a2', to); quiet = false; }
      if (demo2 >= 180 && playing) { stopSoon = true; demo2 = null; }
    }
    function change2(id, value) {
      moved2Flag = true;
      if (/^a\d$/.test(id)) {
        const k = Number(id[1]) - 1;
        if (k < many2() && clash(k, value)) {   // (set from the menu next to another pulley: it stays where it was)
          quiet = true; ctx.set(id, lastAngles[id] !== undefined ? lastAngles[id] : value); quiet = false;
          say('도르래끼리 15°보다 가까이 둘 수 없습니다', new T.Vector3(0, TB.y + 0.8, 0), 1.6); return;
        }
        lastAngles[id] = ctx.values[id];
        if (!quiet) demo2 = null;   // (moved by hand: the demonstration starts afresh next time)
        if (!quiet && playing) ctx.setPlaying(false);
        note2();
      }
      if (/^f\d$/.test(id)) { if (!quiet && playing) ctx.setPlaying(false); plot2(); note2(); }
      if (id === 'forces2') {
        if (value === 'three' && clash(2, A2(2))) {   // the third pulley goes to the widest gap between the other two
          const a = A2(0), b = A2(1), mid = (a + b) / 2, far = gapDeg(mid, a) < 90 ? (mid + 180) % 360 : mid;
          quiet = true; ctx.set('a3', Math.round(far) % 360); quiet = false;
        }
        note2(); plot2();
      }
      if (id === 'pinOut') { if (value) { ringTo.copy(restPlace()); record2(); } }
      if (id === 'axes' && !value) { axis = 0; }
    }
    for (const id of ['a1', 'a2', 'a3']) lastAngles[id] = ctx.values[id];

    // ====================================== the incline and the pulley ======================================
    // A board 1.2 m long leans from the bench up to a post at its right-hand end; its top rides up and down the post (the
    // slope), its foot slides on the bench. Box A (1 kg, with 1 kg slabs on it) sits on the board; a string from A runs
    // parallel to the board over a pulley beyond its top and down past the end of the bench to hanger B (1 kg slabs).
    // The two move together, as one body along the string (the textbook's way): what drives them is B's weight less the
    // part of A's weight along the slope; friction μN (N = m_A g cosθ) acts against the motion, and while the drive is no
    // more than the most static friction can give they do not move at all (in the basic mode with the same coefficient). Then
    // a = (m_B g − m_A g sinθ ∓ μ m_A g cosθ) ÷ (m_A + m_B), v = at, s = ½at² — worked out by the rule, not stepped.
    // The run ends when A reaches the stop at the foot or comes near the pulley, or B the floor or the pulley.
    // B at 0 kg: the string is off and A is alone on the slope (the textbook's figure I-7).
    const S3 = new T.Group(); world.add(S3); S3.visible = false;
    const G = 9.8, SL = { L: 12, XT: 9.9, T: 0.12, W: 1.4, AH: 0.7, AW: 1.0, AD: 0.9, UMIN: 0.85, UMAX: 10.9, PR: 0.25, FLOOR: -8.42, per: 0.06, DISC: 0.22 };
    // (the board's length and where its top rests; its thickness and width; A's height, length along the board and depth;
    // where A's middle may be along the board (from the foot); the pulley's radius; the floor; an arrow PER long for each newton; B's slabs)
    const MUS = { none: 0, m2: 0.2, r6: Math.sqrt(3) / 6, m4: 0.4, r3: Math.sqrt(3) / 3 };
    const mu = () => MUS[ctx.values.mu] || 0, th = () => ctx.values.tilt * RAD, mA = () => ctx.values.massA, mB = () => ctx.values.massB;
    const dir = () => new T.Vector3(Math.cos(th()), Math.sin(th()), 0), nrm = () => new T.Vector3(-Math.sin(th()), Math.cos(th()), 0);
    const foot = () => new T.Vector3(SL.XT - SL.L * Math.cos(th()), 0, 0);
    const surface = (u) => foot().add(dir().multiplyScalar(u)).add(nrm().multiplyScalar(SL.T));
    const centreA = (u) => surface(u).add(nrm().multiplyScalar(SL.AH / 2));
    const pulleyAt = () => surface(SL.L + 0.6).add(nrm().multiplyScalar(SL.AH / 2 - SL.PR));
    const lenB = () => 0.3 + SL.DISC * mB();
    const topB = (u) => pulleyAt().y - 0.7 - (u - SL.UMIN);   // (the string's length is set so that B hangs 7 cm under the pulley when A is at the foot)
    const M3 = { board: mat(0xd8c3a0, { roughness: 0.85 }), boxA: mat(0x6f8fc9), slab: mat(0x4c6aa8), wood: mat(0x8f6b45), brass: M.brass };
    // the post at the end of the bench and the collar on it that holds the board's top
    const post3 = new T.Group(); S3.add(post3);
    add(post3, box(0.7, 0.12, 1.4), M.base, SL.XT - 0.1, 0.06, -1.2); add(post3, cyl(0.07, 0.07, 11.8, 16), M.steel, SL.XT, 5.9, -1.2);
    const collar = add(S3, box(0.45, 0.45, 0.45), M.hand, SL.XT, 0, -1.2); collar.userData.grip = { kind: 'tilt' };
    const arm = add(S3, box(0.08, 0.08, 1), M.steel, SL.XT, 0, -0.7);
    // the board, with a scale in cm along its front edge and a stop at its foot
    const scaleTex = kit.canvasTexture(2048, 64, (g, w, h) => {
      g.fillStyle = '#efe3c8'; g.fillRect(0, 0, w, h); g.fillStyle = '#3a3226'; g.font = '600 26px Georgia, serif'; g.textAlign = 'center';
      for (let cm = 0; cm <= 120; cm++) { const x = cm / 120 * w; g.fillRect(x - 1, 0, 2, cm % 10 === 0 ? 30 : cm % 5 === 0 ? 20 : 11); if (cm % 10 === 0 && cm > 0 && cm < 120) g.fillText(String(cm), x, 56); }
    });
    const board = new T.Group(); S3.add(board);
    add(board, box(SL.L, SL.T, SL.W), M3.board, SL.L / 2, SL.T / 2, 0);
    add(board, new T.PlaneGeometry(SL.L, 0.22), new T.MeshStandardMaterial({ map: scaleTex, roughness: 0.9 }), SL.L / 2, SL.T / 2, SL.W / 2 + 0.003, false);
    add(board, box(0.12, 0.3, SL.W), M3.wood, 0.25, SL.T + 0.15, 0);   // the stop at the foot
    add(board, box(0.12, 0.3, SL.W), M3.wood, SL.UMAX + SL.AW / 2 + 0.06, SL.T + 0.15, 0);   // and one before the pulley (where A stops going up)
    // box A and its slabs
    const boxA = new T.Group(); S3.add(boxA);
    const bodyA = add(boxA, box(SL.AW, SL.AH, SL.AD), M3.boxA, 0, 0, 0); bodyA.userData.grip = { kind: 'boxA' };
    add(boxA, new T.PlaneGeometry(0.4, 0.4), new T.MeshBasicMaterial({ map: kit.letterTexture('A'), transparent: true }), 0, 0, SL.AD / 2 + 0.004, false);
    const slabsA = [0, 1, 2, 3].map((k) => { const m = add(boxA, box(SL.AW * 0.8, 0.1, SL.AD * 0.8), M3.slab, 0, SL.AH / 2 + 0.05 + k * 0.105, 0); m.userData.grip = { kind: 'slabA' }; return m; });
    // the pulley, the string, hanger B
    const wheel3 = add(S3, cyl(SL.PR, SL.PR, 0.08, 28), M.cap, 0, 0, 0); wheel3.rotation.x = Math.PI / 2;
    const pulleyArm = add(S3, box(0.08, 0.08, 1.2), M.steel, 0, 0, -0.6);
    const string3 = add(S3, cyl(0.012, 0.012, 1, 6), M.string, 0, 0, 0), drop3 = add(S3, cyl(0.012, 0.012, 1, 6), M.string, 0, 0, 0);
    const hangerB = new T.Group(); S3.add(hangerB);
    const hookB = add(hangerB, new T.TorusGeometry(0.07, 0.016, 8, 16), M.steel, 0, -0.07, 0); hookB.userData.grip = { kind: 'slabB' };
    const rodB = add(hangerB, cyl(0.02, 0.02, 0.2, 8), M.steel, 0, -0.2, 0); rodB.userData.grip = { kind: 'slabB' };
    const slabsB = [0, 1, 2, 3, 4].map((k) => { const m = add(hangerB, cyl(0.3, 0.3, SL.DISC - 0.01, 28), M.brass, 0, -0.3 - SL.DISC * (k + 0.5), 0); m.userData.grip = { kind: 'slabB' }; return m; });
    const tagB = add(hangerB, new T.PlaneGeometry(0.3, 0.3), new T.MeshBasicMaterial({ map: kit.letterTexture('B'), transparent: true }), 0, 0, 0.305, false);
    add(S3, box(1.6, 0.14, 1.6), mat(0x7d9a8c), 10.6, SL.FLOOR, 0);   // a soft mat on the floor under B
    // where A was every 0.2 s (a mark, faint)
    const ghosts = new T.InstancedMesh(box(SL.AW, SL.AH, SL.AD), new T.MeshBasicMaterial({ color: 0x6f8fc9, transparent: true, opacity: 0.22, depthWrite: false }), 40);
    ghosts.count = 0; ghosts.frustumCulled = false; S3.add(ghosts);
    // the arrows: on A from its middle (friction at its foot), on B from its middle (the string's pull at its top)
    const A3 = {
      gravity: kit.arrow(GREEN, 0.03), along: kit.arrow(GREEN, 0.02), into: kit.arrow(GREEN, 0.02), normal: kit.arrow(0x8a6d3b, 0.03), friction: kit.arrow(0xc0392b, 0.03),
      tension: kit.arrow(BLUE, 0.03), net: kit.arrow(PURPLE, 0.04), gravityB: kit.arrow(GREEN, 0.03), tensionB: kit.arrow(BLUE, 0.03), netB: kit.arrow(PURPLE, 0.04),
      accA: kit.arrow(0xe0912f, 0.03), accB: kit.arrow(0xe0912f, 0.03),
    };
    A3.along.material.opacity = A3.into.material.opacity = 0.85;
    for (const a of Object.values(A3)) S3.add(a);
    const dashes3 = new T.InstancedMesh(cyl(0.01, 0.01, 1, 6), new T.MeshBasicMaterial({ color: 0x2e7d4f, transparent: true, opacity: 0.9, depthTest: false, depthWrite: false }), DASHES);
    dashes3.renderOrder = 9; dashes3.frustumCulled = false; S3.add(dashes3);
    const spots3 = {}, labels3 = {};
    for (const [id, lines, shift] of [['A', false, 0.15], ['B', false, 0], ['tilt', false, 0], ['state', false, 0.3], ['gravity', false, -0.05], ['along', false, 0.05], ['into', false, -0.05],
      ['normal', false, 0.05], ['friction', false, 0.05], ['tension', false, 0.05], ['net', false, 0.05], ['gravityB', false, -0.05], ['tensionB', false, 0.05], ['netB', false, 0.05], ['accA', false, 0.05], ['accB', false, 0.05], ['list', true, 0]]) {
      spots3[id] = new T.Vector3(); labels3[id] = view.label(spots3[id], lines, shift);
    }

    // ---------- the run ----------
    // The motion is followed stretch by stretch, each with its own steady acceleration (worked out by the rule, not
    // stepped): A and B together along the string; or (advanced) after the string is cut, A alone on the slope (slowing,
    // stopping, and sliding back down only if the slope is steeper than static friction can hold) and B falling freely.
    // A stretch ends when A stops or reaches an end, or B reaches the floor or the pulley; the run ends when nothing moves.
    // u: A's place along the board (units from the foot); v: A's velocity up the slope (m/s); yB, vB: B's top (units) and
    // its velocity downwards (m/s), once it falls on its own. run.state: 'ready' (held by hand), 'run', 'stuck' (let go,
    // held still by friction), 'done'.
    const STATIC = { s3: 0.3, s5: 0.5, s7: 0.7 };
    const muS = () => (ctx.advanced && STATIC[ctx.values.muS] !== undefined ? Math.max(mu(), STATIC[ctx.values.muS]) : mu());   // (basic: the same as the kinetic coefficient)
    const run = { state: 'ready', u0: 2.0, u: 2.0, v: 0, hit: null, tA: null, pinned: false, slack: false, uLand: null, t: 0, path: 0, cut: false, yB: 0, vB: 0, stopA: false, stopB: false, a1: 0, at1: null, marks: 0 };
    let moved3 = true, runs = [];   // runs: the samples of this run and the two before it, for the graphs
    // A and B move together along the string; not once it is cut, nor while it is slack (B on the floor, A gone on up)
    const joined = () => mB() > 0 && !run.cut && !run.slack;
    function phase() {   // the forces on A along the board (up +) and its acceleration, as things are now
      const ma = mA(), together = joined(), mb = together ? mB() : 0, s = Math.sin(th()), c = Math.cos(th());
      const N = ma * G * c, drive = mb * G - ma * G * s, mass = ma + mb, v = run.v;
      if (Math.abs(v) < 1e-9 && Math.abs(drive) <= muS() * N + 1e-9) return { N, drive, friction: -drive, a: 0, still: true, together, tension: mb * G };
      const friction = -Math.sign(Math.abs(v) < 1e-9 ? drive : v) * mu() * N, a = (drive + friction) / mass;
      return { N, drive, friction, a, still: false, together, tension: together ? mb * (G - a) : 0 };
    }
    const bottomOfB = (yTop) => yTop - lenB();
    // while joined, how far A may go: up to the pulley or until B is on the floor; down to the stop or until B is at the pulley
    const highest = () => Math.min(SL.UMAX, joined() ? SL.UMIN + (pulleyAt().y - 0.7 - lenB() - (SL.FLOOR + 0.12)) : SL.UMAX);
    const lowest = () => SL.UMIN;   // (going down, A reaches the stop before B can reach the pulley)
    const uNow = () => (run.state === 'ready' ? run.u0 : run.u);
    function toReady() {
      Object.assign(run, { state: 'ready', u: run.u0, v: 0, hit: null, tA: null, pinned: false, slack: false, uLand: null, t: 0, path: 0, cut: false, stopA: false, stopB: false, a1: 0, at1: null, marks: 0 });
      ghosts.count = 0; ctx.seek(0); moved3 = true;
    }
    function letGo() {
      Object.assign(run, { u: run.u0, v: 0, hit: null, tA: null, pinned: false, slack: false, uLand: null, t: 0, path: 0, cut: false, stopA: false, stopB: false, at1: null, marks: 0 });
      ghosts.count = 0; ctx.seek(0);
      const p = phase();
      // (pressed against an end already — against the stop at the foot, or B on the floor or at the pulley — it cannot move off)
      run.pinned = !p.still && ((run.u >= highest() - 1e-9 && p.a > 0) || (run.u <= lowest() + 1e-9 && p.a < 0));
      run.a1 = run.pinned ? 0 : p.a;
      run.state = p.still || run.pinned ? 'stuck' : 'run';
      if (run.state === 'run') { runs.unshift({ t: [0], v: [0], s: [0] }); runs = runs.slice(0, 3); refill(); mark(); }
      moved3 = true;
    }
    function cutString() {   // (advanced) the string is cut: from now on A is alone on the slope and B falls freely
      if (run.cut || mB() <= 0) return;
      if (run.state !== 'run') { say(run.state === 'ready' ? '손을 놓은 뒤에 끊을 수 있습니다' : '움직이는 동안 끊을 수 있습니다', boxA.position.clone().add(new T.Vector3(0, 1.2, 0)), 1.6); return; }
      if (!run.slack) { run.yB = topB(run.u); run.vB = run.v; run.stopB = false; }   // (slack already: B stays on the floor)
      run.cut = true;
      moved3 = true;
    }
    function refill() {   // the graphs: this run in gold, the two before it fainter
      ['v', 's'].forEach((q) => [0, 1, 2].forEach((k) => {
        const trace = ctx.traces[`${q}${k}`]; trace.clear();
        const one = runs[k];
        if (one) one.t.forEach((t, i) => trace.add(t, one[q][i]));
      }));
    }
    function mark() {   // where A is, every 0.2 s
      while (run.marks * 0.2 <= run.t + 1e-9 && run.marks < 40) {
        piece.position.copy(centreA(run.u)); piece.rotation.set(0, 0, th()); piece.scale.set(1, 1, 1); piece.updateMatrix(); ghosts.setMatrixAt(run.marks++, piece.matrix);
      }
      ghosts.count = run.marks; ghosts.instanceMatrix.needsUpdate = true;
    }
    // the first time τ in (0, most] at which x0 + v τ + ½ a τ² reaches x1 (x in units, v and a in m/s and m/s²), or Infinity
    function reach(x0, v, a, x1, most) {
      const d = (x1 - x0) / 10, roots = [];
      if (Math.abs(a) < 1e-12) { if (Math.abs(v) > 1e-12) roots.push(d / v); } else {
        const disc = v * v + 2 * a * d;
        if (disc >= 0) { const r = Math.sqrt(disc); roots.push((-v + r) / a, (-v - r) / a); }
      }
      const ok = roots.filter((t) => t > 1e-9 && t <= most + 1e-12);
      return ok.length ? Math.min(...ok) : Infinity;
    }
    function advance3(dt) {
      if (run.state === 'ready') { ctx.seek(0); return; }   // (one step at a time before letting go: nothing moves, the clock stays at nought)
      if (run.state !== 'run') { ctx.seek(run.t); return; }
      let left = dt;
      for (let guard = 0; guard < 12 && left > 1e-12 && run.state === 'run'; guard++) {
        const p = phase(), falling = run.cut && !run.stopB;
        if (!run.stopA) {
          const pushOut = (run.u >= highest() - 1e-9 && p.a > 0 && run.v >= 0) || (run.u <= lowest() + 1e-9 && p.a < 0 && run.v <= 0);
          if (p.still || pushOut) { run.v = 0; run.stopA = true; run.tA = run.t; }   // (A at rest and held by friction, or pressed against an end)
        }
        // what happens first: A comes to rest for a moment, A reaches an end, B (falling on its own) reaches the floor
        const cands = [];
        if (!run.stopA) {
          const a = p.a, v = run.v;
          if (Math.abs(v) > 1e-9 && a * v < 0) cands.push({ t: -v / a, what: 'turn' });
          cands.push({ t: reach(run.u, v, a, highest(), left), what: 'top' }, { t: reach(run.u, v, a, lowest(), left), what: 'bottom' });
        }
        if (falling) cands.push({ t: reach(-run.yB, run.vB, G, -(SL.FLOOR + 0.12 + lenB()), left), what: 'floor' });
        if (falling && run.vB < 0) cands.push({ t: reach(-run.yB, run.vB, G, -(pulleyAt().y - 0.4), left), what: 'wheel' });   // (B thrown upwards by the cut, up to the pulley)
        if (run.slack && !run.cut && !run.stopA && run.v < 0) cands.push({ t: reach(run.u, run.v, p.a, run.uLand, left), what: 'taut' });   // (coming back down, A pulls the slack string taut again)
        if (!run.at1 && run.t < 1) cands.unshift({ t: 1 - run.t, what: 'one' });   // (the moment 1 s after letting go, for the table)
        let h = left, what = '';
        for (const c of cands) if (c.t <= h) { h = c.t; what = c.what; }   // (an end reached just as A comes to rest counts as the end)
        // move everything on by h
        if (!run.stopA) {
          const a = p.still ? 0 : p.a, du = (run.v * h + a * h * h / 2) * 10;
          run.u += du; run.v += a * h; run.path += Math.abs(du) / 10;
          if (what === 'turn') { run.v = 0; }
          if (what === 'top' && joined() && highest() < SL.UMAX - 1e-9) {
            // B has reached the floor: the string goes slack and A goes on by itself, as fast as it was going
            run.u = highest(); run.slack = true; run.uLand = run.u; run.yB = topB(run.u); run.vB = 0; run.stopB = true;
          } else if (what === 'taut') {   // the string is taut again: B would be jerked up from the floor — the record ends here
            run.u = run.uLand; run.hit = Math.abs(run.v); run.v = 0; run.stopA = true; run.tA = run.t + h;
          } else if (what === 'top' || what === 'bottom') {   // (hit: its speed as it reached the end)
            run.u = what === 'top' ? highest() : lowest(); run.hit = Math.abs(run.v); run.v = 0;
            if (joined() || what === 'bottom') { run.stopA = true; run.tA = run.t + h; }   // (A alone at the top is stopped only for a moment: it may slide back)
          }
        }
        if (falling) {
          run.yB -= (run.vB * h + G * h * h / 2) * 10; run.vB += G * h;
          if (what === 'floor') { run.yB = SL.FLOOR + 0.12 + lenB(); run.vB = 0; run.stopB = true; }
          if (what === 'wheel') { run.yB = pulleyAt().y - 0.4; run.vB = 0; }
        }
        const before = run.t;
        run.t += h; left -= h;
        if (!run.at1 && before < 1 - 1e-9 && run.t >= 1 - 1e-9) run.at1 = { v: Math.abs(run.v), s: run.path };
        const one = runs[0];
        if (one) { one.t.push(run.t); one.v.push(Math.abs(run.v)); one.s.push(run.path); ctx.traces.v0.add(run.t, Math.abs(run.v)); ctx.traces.s0.add(run.t, run.path); }
        mark();
        // the pair stops together; after a cut, the run is over when A has stopped and B is on the floor
        if (run.stopA && (!run.cut || run.stopB || mB() <= 0)) { run.state = 'done'; record3(); stopSoon = true; }
      }
      moved3 = true;
    }
    function record3() {
      const moved = run.a1 !== 0, one = run.at1;
      const muName = { none: '0', m2: '0.2', r6: '0.289', m4: '0.4', r3: '0.577' }[ctx.values.mu] + (muS() > mu() + 1e-9 ? ` (정지 ${muS().toFixed(1)})` : '');
      const row = [String(mA()), String(mB()), String(ctx.values.tilt), muName, moved ? Math.abs(run.a1).toFixed(2) : '0', moved ? (run.tA !== null ? run.tA : run.t).toFixed(2) : '—', moved ? run.path.toFixed(3) : '0',
        moved ? (run.hit !== null ? run.hit : Math.abs(run.v)).toFixed(2) : '0', one ? one.v.toFixed(2) : '—', one ? one.s.toFixed(3) : '—'];
      if (run.cut) row[4] += ' (끊음)'; else if (run.slack) row[4] += ' (B 바닥)';
      const table = ctx.tables.table3;
      if (table.rows.some((r) => r.join() === row.join())) return;
      table.add(row);
    }

    // ---------- drawing ----------
    function draw3() {
      const v = ctx.values, p = phase(), u = uNow(), d = dir(), n = nrm(), ang = th(), state = run.state, ready = state === 'ready';
      const F0 = foot();
      board.position.copy(F0); board.rotation.set(0, 0, ang);
      const topEnd = F0.clone().add(d.clone().multiplyScalar(SL.L));
      collar.position.set(SL.XT, topEnd.y, -1.2); arm.position.set(SL.XT, topEnd.y, -0.7);
      const cA = centreA(u);
      boxA.position.copy(cA); boxA.rotation.set(0, 0, ang);
      slabsA.forEach((s, k) => { s.visible = k < mA() - 1; });
      const pc = pulleyAt();
      wheel3.position.copy(pc); wheel3.rotation.set(Math.PI / 2, 0, 0);
      pulleyArm.position.set(pc.x, pc.y, -0.6);
      const hasB = mB() > 0, tied = hasB && !run.cut && !run.slack;   // (tied: the string pulls)
      string3.visible = hasB && !run.cut; drop3.visible = hasB;
      const from = cA.clone().add(d.clone().multiplyScalar(SL.AW / 2)), to = pc.clone().add(n.clone().multiplyScalar(SL.PR));
      if (hasB && !run.cut) {
        const span = to.clone().sub(from);
        string3.position.copy(from).addScaledVector(span, 0.5); string3.scale.y = span.length(); string3.quaternion.setFromUnitVectors(UP, span.normalize());
      }
      const yTop = !hasB ? pc.y - 0.7 : run.cut || run.slack ? run.yB : topB(u), xB = pc.x + SL.PR;
      hangerB.position.set(xB, yTop, 0);
      slabsB.forEach((s, k) => { s.visible = k < mB(); });
      // (cut: what is left of the string hangs from B a little way)
      const dropTop = run.cut ? yTop + 0.6 : pc.y;
      drop3.position.set(xB, (dropTop + yTop) / 2, 0); drop3.scale.y = Math.max(0.01, dropTop - yTop); drop3.quaternion.identity();
      tagB.visible = hangerB.visible = hasB; tagB.position.y = -0.3 - SL.DISC * Math.min(1, mB()) / 2;   // (B at 0 kg: no hanger, no string)

      // the forces (1 N for each PER). Held by hand: gravity, its parts and the normal force only. Let go: the string's
      // pull, friction and the net force too. Once A has stopped at an end: no net force, friction or pull on it (what
      // holds it then is the stop); once B is on the floor, likewise.
      const per = SL.per, wA = mA() * G, cB = new T.Vector3(xB, yTop - 0.3 - SL.DISC * mB() / 2, 0);
      const after = !ready, movingA = state === 'run' && !run.stopA, heldStill = (state === 'stuck' && !run.pinned) || (state !== 'ready' && run.stopA && p.still && !atEnd());
      const set = (a, at, vec, on) => { setArrow(a, at, vec); a.visible = on && vec.length() > 1e-4; };
      set(A3.gravity, cA, new T.Vector3(0, -wA * per, 0), v.forces || v.parts);
      A3.gravity.material.opacity = v.parts ? 0.3 : 1;
      set(A3.along, cA, d.clone().multiplyScalar(-wA * Math.sin(ang) * per), v.parts);
      set(A3.into, cA, n.clone().multiplyScalar(-wA * Math.cos(ang) * per), v.parts);
      set(A3.normal, cA, n.clone().multiplyScalar(p.N * per), v.forces);
      const fr = movingA || heldStill ? p.friction : 0;
      set(A3.friction, surface(u).add(n.clone().multiplyScalar(0.02)), d.clone().multiplyScalar(fr * per), v.forces && after && Math.abs(fr) > 1e-6);
      const T3 = tied && (movingA || state === 'stuck') ? p.tension : 0;   // (at an end the string's pull is not shown: what holds the pair then is the stop or the floor)
      set(A3.tension, cA, d.clone().multiplyScalar(T3 * per), v.forces && T3 > 0);
      const aA = movingA ? p.a : 0, fallingB = run.cut && !run.stopB && state === 'run', aB = tied ? aA : fallingB ? G : 0;
      set(A3.net, cA, d.clone().multiplyScalar(mA() * aA * per), v.net && movingA);
      set(A3.gravityB, cB, new T.Vector3(0, -mB() * G * per, 0), (v.forces || v.parts) && hasB);
      set(A3.tensionB, new T.Vector3(xB, yTop, 0), new T.Vector3(0, T3 * per, 0), v.forces && T3 > 0);
      set(A3.netB, cB, new T.Vector3(0, -mB() * aB * per, 0), v.net && hasB && aB !== 0);
      // (advanced) the accelerations: 5 cm for each m/s²
      set(A3.accA, cA.clone().add(n.clone().multiplyScalar(0.55)), d.clone().multiplyScalar(aA * 0.5), ctx.advanced && v.accel && movingA);
      set(A3.accB, cB.clone().add(new T.Vector3(0.55, 0, 0)), new T.Vector3(0, -aB * 0.5, 0), ctx.advanced && v.accel && aB !== 0);
      const pts = [];
      if (v.parts) { const tipG = cA.clone().add(new T.Vector3(0, -wA * per, 0)); pts.push(tipG, cA.clone().add(d.clone().multiplyScalar(-wA * Math.sin(ang) * per)), tipG, cA.clone().add(n.clone().multiplyScalar(-wA * Math.cos(ang) * per))); }
      dashLines(pts, dashes3);
      ghosts.visible = Boolean(v.marks);
      // the names of the arrows
      const name = (id, a, at, text) => { const on = a.visible; labels3[id].show(on); if (!on) return; spots3[id].copy(at); labels3[id].write(text); };
      const ends = (at, vec, out = 0.2) => at.clone().add(vec).add(vec.clone().normalize().multiplyScalar(out));
      name('gravity', A3.gravity, ends(cA, new T.Vector3(0, -wA * per, 0)), '중력');
      name('along', A3.along, ends(cA, d.clone().multiplyScalar(-wA * Math.sin(ang) * per), 0.35), `${it('mg')} sin ${it('θ')}`);
      name('into', A3.into, ends(cA, n.clone().multiplyScalar(-wA * Math.cos(ang) * per), 0.3), `${it('mg')} cos ${it('θ')}`);
      name('normal', A3.normal, ends(cA, n.clone().multiplyScalar(p.N * per)), '수직 항력');
      name('friction', A3.friction, ends(surface(u), d.clone().multiplyScalar(fr * per), 0.3), heldStill ? '정지 마찰력' : '마찰력');
      name('tension', A3.tension, ends(cA, d.clone().multiplyScalar(T3 * per)), '실이 당기는 힘');
      name('net', A3.net, ends(cA, d.clone().multiplyScalar(mA() * aA * per)), '알짜힘');
      name('gravityB', A3.gravityB, ends(cB, new T.Vector3(0, -mB() * G * per, 0)), '중력');
      name('tensionB', A3.tensionB, ends(new T.Vector3(xB, yTop, 0), new T.Vector3(0, T3 * per, 0)), '실이 당기는 힘');
      name('netB', A3.netB, ends(cB, new T.Vector3(0, -mB() * aB * per, 0), 0.25).add(new T.Vector3(0.6, 0, 0)), '알짜힘');
      name('accA', A3.accA, ends(cA.clone().add(n.clone().multiplyScalar(0.55)), d.clone().multiplyScalar(aA * 0.5)), '가속도');
      name('accB', A3.accB, ends(cB.clone().add(new T.Vector3(0.55, 0, 0)), new T.Vector3(0, -aB * 0.5, 0)), '가속도');
      // the names of the two bodies, the slope's angle, and what happened
      spots3.A.copy(cA).add(n.clone().multiplyScalar(SL.AH / 2 + 0.12 + 0.105 * (mA() - 1))); labels3.A.write(`A <b>${mA()} kg</b>`); labels3.A.show(true);
      spots3.B.set(xB + 0.75, yTop - 0.4, 0); labels3.B.write(`B <b>${mB()} kg</b>`); labels3.B.show(hasB);
      spots3.tilt.copy(F0).add(new T.Vector3(1.6, 0.35, SL.W / 2)); labels3.tilt.write(`<b>${v.tilt}°</b>`); labels3.tilt.show(true);
      spots3.state.copy(cA).add(n.clone().multiplyScalar(1.1)); labels3.state.show(heldStill || run.pinned || ready); labels3.state.write(ready ? '손으로 잡고 있음' : run.pinned ? '<b>끝에 닿아 있어 움직이지 않음</b>' : '<b>움직이지 않음</b>');
      // the values
      labels3.list.show(v.numbers);
      if (v.numbers) {
        const f2 = (x) => x.toFixed(2), lines = [];
        const muText = { none: '없음', m2: '0.2', r6: '√3/6 (0.289)', m4: '0.4', r3: '√3/3 (0.577)' }[v.mu] + (muS() > mu() + 1e-9 ? ` · 정지 마찰 계수 ${muS().toFixed(1)}` : '');
        lines.push(`A ${mA()} kg · B ${mB()} kg · 기울기 ${v.tilt}°`, `마찰 계수 ${muText}`);
        lines.push(hasB ? `B의 무게 ${f2(mB() * G)} N · A의 중력의 빗면 방향 성분 ${f2(wA * Math.sin(ang))} N` : `A의 중력의 빗면 방향 성분 ${f2(wA * Math.sin(ang))} N (실 없음)`);
        if (after) {
          const fric = Math.abs(p.friction);
          if (heldStill) lines.push(`<b>움직이지 않음</b> — 정지 마찰력 ${f2(fric)} N (최대 ${f2(muS() * p.N)} N)`);
          else if (movingA && p.together) {
            lines.push(`두 물체를 움직이는 힘 ${f2(Math.abs(p.drive))} N − 마찰력 ${f2(fric)} N = <b>${f2(Math.abs(p.drive) - fric)} N</b>`);
            lines.push(`가속도 <b>${f2(Math.abs(p.a))} m/s²</b> = ${f2(Math.abs(p.drive) - fric)} N ÷ ${mA() + mB()} kg`);
          } else if (movingA) lines.push(`A 혼자: 알짜힘 ${f2(Math.abs(mA() * p.a))} N · 가속도 <b>${f2(Math.abs(p.a))} m/s²</b> (${run.v > 0 ? '올라가며 느려짐' : '내려가며 빨라짐'})`);
          lines.push(`시간 ${run.t.toFixed(2)} s · 속력 ${f2(Math.abs(run.v))} m/s · 이동 거리 ${run.path.toFixed(3)} m`);
          if (T3 > 0) lines.push(`실이 당기는 힘 ${f2(T3)} N`);
          if (run.cut) lines.push(`실을 끊음${run.stopB ? ' — B는 바닥에 닿음' : ' — B는 자유 낙하'}`);
          else if (run.slack) lines.push(state === 'done' && Math.abs(run.u - run.uLand) < 1e-6 ? 'B가 바닥에 닿은 뒤 A 혼자 움직이다가 실이 다시 팽팽해짐(기록 끝)' : 'B가 바닥에 닿아 실이 느슨해짐 — A 혼자 움직임');
          if (state === 'done' && atEnd()) lines.push('끝에 닿아 멈춤');
        }
        if (ctx.advanced && p.together) lines.push(`가속도(${it('a')}) = (${it('m')}<sub>B</sub>${it('g')} − ${it('m')}<sub>A</sub>${it('g')} sin ${it('θ')} ∓ μ${it('m')}<sub>A</sub>${it('g')} cos ${it('θ')}) ÷ (${it('m')}<sub>A</sub> + ${it('m')}<sub>B</sub>)`);
        if (ctx.advanced && !p.together) lines.push(`가속도(${it('a')}) = −${it('g')} sin ${it('θ')} ∓ μ${it('g')} cos ${it('θ')} (빗면 위쪽이 +)`);
        labels3.list.write(lines.join('<br>'));
        if (tall()) spots3.list.set(7.2, -2.2, 1.6); else spots3.list.set(0.2, -0.6, 3.6);
      }
    }
    const atEnd = () => Math.abs(run.u - highest()) < 1e-6 || Math.abs(run.u - lowest()) < 1e-6;

    // ---------- handling ----------
    const upright3 = new T.Plane(new T.Vector3(0, 0, 1), 0);
    const slopeTool = {
      pick(r) {
        ray.ray.copy(r); world.updateMatrixWorld(true);
        const targets = [bodyA, ...slabsA.filter((m) => m.visible), collar, hookB, rodB, ...slabsB.filter((m) => m.visible), ...(ctx.advanced && run.state === 'run' && joined() ? [string3] : [])];
        const found = ray.intersectObjects(targets, false)[0];
        return found ? (found.object === string3 ? { kind: 'cut' } : found.object.userData.grip) : null;
      },
      cursor: (grip) => (!grip ? '' : grip.kind === 'cut' ? 'pointer' : 'grab'),
      start(grip, r) {
        if (grip.kind === 'cut') { cutString(); return false; }   // (advanced) pressing the string while the pair moves cuts it
        ctx.setPlaying(false);
        if (run.state !== 'ready') toReady();   // (a touch after letting go puts everything back first)
        if (!r.intersectPlane(upright3, hit)) return false;
        grab = { kind: grip.kind, from: hit.clone(), u: run.u0, mA: mA(), mB: mB(), moved: false };
        return true;
      },
      move(r) {
        if (!grab || !r.intersectPlane(upright3, hit)) return;
        const rise = hit.y - grab.from.y;
        if (grab.kind === 'boxA') {   // along the board, kept clear of the stop, the pulley, and (with B) the floor
          const u = grab.u + hit.clone().sub(grab.from).dot(dir());
          run.u0 = Math.max(SL.UMIN, Math.min(highest(), Math.round(u * 10) / 10)); run.u = run.u0; grab.moved = true; moved3 = true;   // (in steps of 1 cm)
          say(`발치에서 ${Math.round((run.u0 - SL.AW / 2) * 10 + 1e-6)} cm`, centreA(run.u0).add(nrm().multiplyScalar(1.0)));
          return;
        }
        if (grab.kind === 'tilt') {   // the board's top up or down the post
          if (ctx.locked.has('tilt')) { say('잠금', collar.position.clone().add(new T.Vector3(0, 0.6, 0))); return; }
          const y = Math.max(SL.L * Math.sin(10 * RAD), Math.min(SL.L * Math.sin(60 * RAD), hit.y));
          const to = Math.round(Math.asin(y / SL.L) / RAD);
          if (to !== ctx.values.tilt) ctx.set('tilt', to);
          grab.moved = true; say(`기울기 ${ctx.values.tilt}°`, collar.position.clone().add(new T.Vector3(0, 0.6, 0)));
          return;
        }
        const id = grab.kind === 'slabA' ? 'massA' : 'massB', least = id === 'massA' ? 1 : 0, was = grab[id === 'massA' ? 'mA' : 'mB'];
        const where = id === 'massA' ? boxA.position.clone().add(new T.Vector3(0, 1.2, 0)) : hangerB.position.clone().add(new T.Vector3(0.9, 0.2, 0));
        if (ctx.locked.has(id)) { say('잠금', where); return; }
        const to = Math.max(least, Math.min(5, was + Math.round(rise / 0.3)));
        if (to !== ctx.values[id]) ctx.set(id, to);
        grab.moved = true; say(`${id === 'massA' ? 'A' : 'B'} ${ctx.values[id]} kg`, where);
      },
      end() { grab = null; tip.show(false); tipTime = 0; moved3 = true; },
    };
    function keepClear() {   // after a change, A's start stays where B still clears the floor
      run.u0 = Math.max(SL.UMIN, Math.min(highest(), run.u0)); run.u = run.u0;
    }
    function play3(on) {
      if (!on) return;
      if (run.state === 'done' || run.state === 'stuck') toReady();
      if (run.state === 'ready') letGo(); else ctx.seek(run.t);   // (going on after a pause, perhaps in another scene: the clock is set back to this run's time)
      if (run.state === 'stuck') { record3(); stopSoon = true; }
    }
    function update3() {
      if (!moved3) return false;
      moved3 = false; draw3();
      return true;
    }
    const last3 = {};
    function change3(id) {
      moved3 = true;
      if (!['massA', 'massB', 'tilt', 'mu', 'muS'].includes(id) || last3[id] === ctx.values[id]) return;   // (the same choice pressed again changes nothing)
      last3[id] = ctx.values[id];
      if (run.state !== 'ready') { ctx.setPlaying(false); toReady(); }
      keepClear();
    }
    for (const id of ['massA', 'massB', 'tilt', 'mu', 'muS']) last3[id] = ctx.values[id];

    // ====================================== all three scenes ======================================
    const toolNow = () => (onSlope() ? slopeTool : onTable() ? tableTool : scalesTool);
    view.setTool({
      pick: (r) => toolNow().pick(r),
      cursor: (grip) => toolNow().cursor(grip),
      start: (grip, r) => toolNow().start(grip, r),
      move: (r) => toolNow().move(r),
      end: () => toolNow().end(),
    });
    const LOOK = { scales: [{ target: [0, 2.85, 0], r: 9.5, theta: 0.22, phi: 1.32 }, { target: [0, 2.9, 0], r: 14, theta: 0.12, phi: 1.32 }],
      table: [{ target: [0.2, 2.7, 0.3], r: 8.2, theta: 0.25, phi: 1.02 }, { target: [0, 2.2, 0.6], r: 12.5, theta: 0.15, phi: 0.95 }],
      slope: [{ target: [5.0, 2.2, 0], r: 16, theta: 0.3, phi: 1.36 }, { target: [5.6, 1.6, 0], r: 19, theta: 1.08, phi: 1.32 }] };
    ctx.on('play', (on) => { if (onTable()) play2(on); if (onSlope()) play3(on); });
    ctx.on('tick', (t, dt) => { if (dt && onTable() && !stopSoon) tick2(dt); if (dt && onSlope()) advance3(dt); });
    ctx.on('action', (id) => { if (id === 'reset' && onSlope()) toReady(); if (id === 'cut' && onSlope()) cutString(); if (id === 'reset' && onTable()) { demo2 = null; if (ctx.values.pinOut) ctx.set('pinOut', false); moved2Flag = true; } });
    ctx.on('view', () => { moved2Flag = true; moved3 = true; });
    let lastScene = ctx.values.scene;
    ctx.on('change', (id, value) => {
      if (id === 'axes' && !value) { axis = 0; moved2Flag = true; }   // (also when the frame puts the switch away on leaving the table)
      if (id === 'scene' && value === lastScene) return;   // (the same scene pressed again)
      if (id === 'scene') {   // the other scene from its start, standing still
        lastScene = value;
        ctx.setPlaying(false); demo2 = null; tip.show(false);
        hideLabels(labels); hideLabels(labels2); hideLabels(labels3);
        S1.visible = onScales(); S2.visible = onTable(); S3.visible = onSlope();
        view.look(LOOK[value][tall() ? 1 : 0]);
        moved = moved2Flag = moved3 = true;
        return;
      }
      if (onTable()) change2(id, value);
      if (onSlope()) change3(id);
    });
    let wasAdv3 = ctx.advanced;
    ctx.on('mode', () => {
      plot2(); moved2Flag = moved3 = true;
      if (ctx.advanced !== wasAdv3) { wasAdv3 = ctx.advanced; if (run.state !== 'ready') { ctx.setPlaying(false); toReady(); } }   // (the incline: a run begun under the other mode's friction or with the string cut starts afresh)
    });

    note(); plot(); plot2();
    return {
      state3: () => ({ ...run, p: phase(), muS: muS(), highest: highest(), topB: topB(uNow()) }),
      state2: () => ({ forces: [0, 1, 2].slice(0, many2()).map((k) => [F2(k), A2(k)]), sum: sumOf(pullsAt(new T.Vector2())).toArray(), ringAt: ringAt.toArray(), ringTo: ringTo.toArray(), pinOut: ctx.values.pinOut, between: between(), tried: [...tried2.entries()] }),
      state: () => { const l = layout(); return { mode: mode(), w: W(), angle: l.angle, pulls: l.pulls.slice(0, l.n), junction: l.J.toArray(), tops: l.tops.slice(0, l.n).map((t) => t.toArray()), held: held.map((h) => h.toArray()), round: [...round], tried: [...tried.entries()] }; },
      update(dt) {
        if (!framed) { framed = true; if (tall()) view.look(LOOK[ctx.values.scene][1]); }
        if (stopSoon) { stopSoon = false; ctx.setPlaying(false); demo2 = null; }
        let drawn = false;
        if (tipTime > 0) { tipTime -= dt; if (tipTime <= 0) { tip.show(false); drawn = true; } }
        if (onSlope()) return update3(dt) || drawn;
        if (onTable()) return update2(dt) || drawn;
        if (!moved) return drawn;
        moved = false; draw();
        return true;
      },
    };
  },
};
