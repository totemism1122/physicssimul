// P-14 The superposition and interference of light (3D).
//
// The superposition of waves: a long, thick spring lies on the bench between two grips, A at the left and B at the
// right, after the textbook's activity. Each grip is pulled sideways to set how far and which way it will shake the
// spring; on play both shake at the same moment. Shaken once, each sends a pulse along the spring: where the two
// meet their displacements add (y = y1 + y2), and afterwards each goes on as it was. Shaken steadily, A sends a
// wave whose wavelength is the speed divided by the frequency; in the basic mode B then only holds its end.
// A ribbon tied to the spring marks the point that is watched: it only moves sideways, and its displacement is
// drawn against time for each wave and for their sum.
// Advanced: how long one shake takes (the width of a pulse), and B shaking steadily as well, at the same
// frequency (the two waves then make a standing wave).
//
// One unit of that scene is 20 cm. The spring is 3.2 m long and a wave runs along it at 1 m/s without changing its
// shape; at the ends nothing is thrown back. Displacements are in cm, + towards the back of the bench.
//
// The double slit: a laser, a card with two slits and a screen on a rail, after the textbook's experiment. The
// light on the screen is found from the real sizes (a wavelength of 530 nm or 700 nm, slits 0.10 mm to 0.30 mm
// apart, a metre to the screen); the card and the face of the screen are drawn many times their size, as nothing
// could be seen otherwise. A point P of the screen is carried along it: the light from each slit to P is drawn as
// a wave (a model, with a wavelength far longer than the real one), and how much longer one way is than the other,
// counted in wavelengths, tells whether the two meet in step (bright) or out of step (dark). The card is pulled
// sideways to set the gap between the slits; the laser is pressed for the other colour. The fronts of the light
// can be shown as well (a model): straight ones from the laser to the card, round ones from each slit behind it.
// The slits are drawn 50 times their size; with the fronts shown 800 times, as the gap between the slits has to be
// a few of the model's wavelengths for the lines along which the two waves meet in step to show.
//
// What is set by hand can be set from the menu as well, over the same ranges and in the same steps.
// Advanced: the screen is carried along the rail (0.5 m to 1.5 m from the slits), the wavelength is set anywhere
// from 400 nm to 700 nm, and white light (many wavelengths at once) gives its coloured bands.
//
// The film that stops reflection (advanced only): a plate of glass with a thin film on it, after the textbook's
// figure of the coating on a solar cell. Light falls on it, and some comes back from the top of the film and some
// from where the film meets the glass: the second has gone down the film and up again, and is so much behind the
// first. Where that is half a wavelength (as long as the wave is in the film) the two are out of step and little
// light comes back. The top of the film is pulled up or down to set how thick it is. How much comes back is found
// for light that falls straight on the film; it is drawn slanting, so that the two can be told apart. The film
// and the waves are drawn to one scale, 300 000 times their size.
const GOLD = '#e3c26b', RED = '#e58373', BLUE = '#7fa6e6';
const UNIT = 0.2, LONG = 3.2, SPEED = 1;   // metres to a unit of the scene; the length of the spring (m); the speed of a wave on it (m/s)
const LIGHT = { green: { name: '녹색', nm: 530 }, red: { name: '적색', nm: 700 } };   // the two lasers
// the colour of light of a wavelength (nm), as it is drawn: between a few that are fixed (the two lasers among them); and its name
const HUES = [[400, 150, 60, 255], [440, 80, 80, 255], [490, 0, 200, 255], [530, 40, 225, 80], [580, 255, 235, 40], [620, 255, 120, 30], [700, 255, 48, 36]];
function hue(nm) {
  const k = Math.max(1, HUES.findIndex((one) => one[0] >= nm)), a = HUES[k - 1], b = HUES[k], s = (nm - a[0]) / (b[0] - a[0]);
  return [1, 2, 3].map((i) => a[i] + (b[i] - a[i]) * s);
}
const named = (nm) => (nm < 450 ? '보라색' : nm < 495 ? '청색' : nm < 570 ? '녹색' : nm < 590 ? '황색' : nm < 620 ? '주황색' : '적색');
const WHITE = Array.from({ length: 31 }, (unused, k) => 400 + 10 * k);   // white light: these wavelengths (nm) together, each as strong as the others
const milli = (mm) => (Math.abs(mm) < 0.05 ? '0.0' : `${mm > 0 ? '' : '−'}${Math.abs(mm).toFixed(1)}`);
const signed = (cm) => (Math.abs(cm) < 0.05 ? '0.0' : `${cm > 0 ? '+' : '−'}${Math.abs(cm).toFixed(1)}`);
const onWave = (values) => values.scene === 'wave', onSlit = (values) => values.scene === 'slit', onFilm = (values) => values.scene === 'film';   // which arrangement an item of a menu belongs to
const once = (values) => onWave(values) && values.how === 'once', steady = (values) => onWave(values) && values.how === 'steady';
const twoHands = (values) => once(values) || (steady(values) && values.both);   // B shakes as well

export default {
  // what is taken for granted, written on screen by the frame
  premise: (v) => (onFilm(v) ? '막의 두께와 빛의 파장은 30만 배로 확대해 그렸습니다. 빛이 막에 수직으로 들어올 때의 값이며, 두 반사광을 구분하려고 비스듬히 그렸습니다' : onSlit(v) ? `스크린의 무늬는 10배, 슬릿은 ${v.fronts && v.color !== 'white' ? '파면(모형)을 켠 동안 800배' : '50배'}로 확대해 그렸${v.color === 'white' || !(v.paths || v.fronts) ? '습니다' : '고, 모형의 파장은 실제보다 훨씬 길게 그렸습니다'}`
    : '파동이 진행하는 동안 모양과 속력이 변하지 않고, 용수철의 끝에서 반사하지 않는다고 봅니다'),
  fixedViews: ['top', 'left'],
  camera: { target: [-1.4, 0.2, 0.3], r: 16.5, theta: 0, phi: 0.72, rMax: 30 },   // (a little to the right of the middle of the screen: the menu opens at the left)
  stepTime: 0.05,                 // "one step at a time" moves on by this many seconds
  traces: {
    // the displacement of the point that is watched against time: of each wave, and of the two together
    ya: { window: 16, range: 22, read: (y) => `${signed(y)} cm` }, yb: { window: 16, range: 22, read: (y) => `${signed(y)} cm` }, y: { window: 16, range: 22, read: (y) => `${signed(y)} cm` },
    // the double slit: how bright the screen is (1 at its middle) against the place on it (mm), and the same at P alone;
    // how far apart the bright bands are (mm) against the gap between the slits (mm)
    ix: { window: 100, range: 1.1, read: (y) => y.toFixed(2) }, ip: { window: 100, range: 1.1, read: (y) => y.toFixed(2) },
    gd: { window: 100, range: 2, read: (mm) => `${mm.toFixed(2)} mm` },
    gl: { window: 100, range: 2, read: (mm) => `${mm.toFixed(2)} mm` },   // (advanced) the same against how far the screen is (m)
    // the film: how much of the light comes back (%) against how thick the film is (nm) and against the wavelength (nm); each with the film or the light as it is now
    rt: { window: 1000, range: 5, read: (y) => `${y.toFixed(2)} %` }, rp: { window: 1000, range: 5, read: (y) => `${y.toFixed(2)} %` },
    rw: { window: 1000, range: 5, read: (y) => `${y.toFixed(2)} %` }, rq: { window: 1000, range: 5, read: (y) => `${y.toFixed(2)} %` },
  },
  menus: {
    vars: [
      { id: 'scene', label: '장면 선택', kind: 'choice', value: 'wave', options: [{ id: 'wave', label: '파동의 중첩' }, { id: 'slit', label: '이중 슬릿' }, { id: 'film', label: '반사 방지막', advanced: true }] },
      { id: 'how', label: '흔드는 방식', kind: 'choice', value: 'once', options: [{ id: 'once', label: '한 번' }, { id: 'steady', label: '계속' }], when: onWave },
      { id: 'ampA', label: 'A의 진폭', kind: 'slider', min: 0, max: 30, step: 5, value: 20, unit: ' cm', when: onWave },
      { id: 'ampB', label: 'B의 진폭', kind: 'slider', min: 0, max: 30, step: 5, value: 20, unit: ' cm', when: twoHands },
      { id: 'dir', label: '흔드는 방향', kind: 'choice', value: 'same', options: [{ id: 'same', label: '같은 방향' }, { id: 'opposite', label: '반대 방향' }], when: twoHands },
      { id: 'freq', label: '진동수', kind: 'slider', min: 0.75, max: 2, step: 0.25, value: 1, digits: 2, unit: ' Hz', when: steady },
      { id: 'both', label: 'B도 계속 흔들기', kind: 'toggle', advanced: true, when: steady },
      { id: 'shake', label: '한 번 흔드는 시간', kind: 'slider', min: 0.3, max: 0.8, step: 0.1, value: 0.6, digits: 1, unit: ' s', advanced: true, when: once },
      { id: 'spot', label: '관찰하는 점 (A에서의 거리)', kind: 'slider', min: 0.2, max: 3, step: 0.05, value: 1.6, digits: 2, unit: ' m', when: onWave },
      // the double slit
      { id: 'color', label: '빛의 색', kind: 'choice', value: 'green', when: (v) => !onWave(v),
        options: [...Object.keys(LIGHT).map((id) => ({ id, label: `${LIGHT[id].name} (${LIGHT[id].nm} nm)` })), { id: 'custom', label: '파장 정하기', advanced: true }, { id: 'white', label: '백색광', advanced: true }] },
      { id: 'wave', label: '파장', kind: 'slider', min: 400, max: 700, step: 10, value: 530, unit: ' nm', advanced: true, when: (v) => !onWave(v) && v.color === 'custom' },
      { id: 'slits', label: '슬릿 사이의 간격', kind: 'slider', min: 0.1, max: 0.3, step: 0.05, value: 0.1, digits: 2, unit: ' mm', when: onSlit },
      { id: 'far', label: '스크린까지의 거리', kind: 'slider', min: 0.5, max: 1.5, step: 0.1, value: 1, digits: 1, unit: ' m', advanced: true, when: onSlit },
      // the film
      { id: 'thick', label: '막의 두께', kind: 'slider', min: 0, max: 300, step: 2, value: 50, unit: ' nm', when: onFilm },
      { id: 'index', label: '막의 굴절률', kind: 'slider', min: 1.2, max: 1.5, step: 0.01, value: 1.38, digits: 2, when: onFilm },
      { id: 'point', label: 'P의 위치 (O에서의 거리)', kind: 'slider', min: -24, max: 24, step: 0.1, value: 0, digits: 1, unit: ' mm', when: onSlit },
    ],
    graph: [
      { id: 'spotTime', label: '변위–시간', kind: 'graph', x: '시간', when: onWave,
        plots: [{ y: '변위', lines: [{ trace: 'y', color: GOLD, name: '합성파' }, { trace: 'ya', color: RED, name: '파동 A' }, { trace: 'yb', color: BLUE, name: '파동 B' }] }] },   // (on one scale, so that the sum can be compared with its parts)
      { id: 'glareSpot', label: '조도–위치', kind: 'graph', x: '스크린에서의 위치', xUnit: 'mm', span: [-24, 24], when: onSlit,
        plots: [{ y: '조도 (가운데를 1로)', floor: true, lines: [{ trace: 'ix', color: '#f3eedf' }, { trace: 'ip', color: GOLD, name: 'P' }] }] },
      { id: 'fringeGap', label: '무늬 간격–슬릿 간격', kind: 'graph', x: '슬릿 사이의 간격', xUnit: 'mm', span: [0, 0.35], plots: [{ y: '무늬 간격', trace: 'gd', dots: true }], when: onSlit },
      { id: 'fringeFar', label: '무늬 간격–스크린 거리', kind: 'graph', x: '스크린까지의 거리', xUnit: 'm', span: [0, 1.6], plots: [{ y: '무늬 간격', trace: 'gl', dots: true }], advanced: true, when: onSlit },
      { id: 'backThick', label: '반사율–막의 두께', kind: 'graph', x: '막의 두께', xUnit: 'nm', span: [0, 300], when: onFilm,
        plots: [{ y: '반사율', floor: true, lines: [{ trace: 'rt', color: '#f3eedf' }, { trace: 'rp', color: GOLD, name: '지금' }] }] },
      { id: 'backWave', label: '반사율–파장', kind: 'graph', x: '파장', xUnit: 'nm', span: [400, 700], when: onFilm,
        plots: [{ y: '반사율', floor: true, lines: [{ trace: 'rw', color: '#f3eedf' }, { trace: 'rq', color: GOLD, name: '지금' }] }] },
    ],
    time: [
      { id: 'slow', label: '느리게', kind: 'toggle' },
      { id: 'reset', label: '처음으로', kind: 'action' },
      { id: 'step', label: '한 단계씩', kind: 'action' },
    ],
    layers: [
      { id: 'parts', label: '각 파동(점선)', kind: 'toggle', value: true, when: onWave },
      { id: 'marks', label: '파장과 진폭', kind: 'toggle', when: steady },
      { id: 'paths', label: '두 빛의 파동(모형)', kind: 'toggle', when: onSlit },
      { id: 'fronts', label: '파면(모형)', kind: 'toggle', when: onSlit },
      { id: 'echo', label: '두 반사광의 파동(모형)', kind: 'toggle', when: onFilm },
      { id: 'numbers', label: '값', kind: 'toggle' },
    ],
    inquiry: [
      { id: 'table', label: '기록 표', kind: 'table', wide: true, rows: 8, when: once, text: '두 파동이 지나갈 때마다 한 줄씩 적힙니다. 변위는 관찰하는 점에서 잰 값입니다.',
        columns: [{ label: 'A의<br>진폭', unit: 'cm' }, { label: 'B의<br>진폭', unit: 'cm' }, { label: '흔드는<br>방향' }, { label: '관찰하는<br>점', unit: 'm' }, { label: '합성파의<br>가장 큰 변위', unit: 'cm', result: true }] },
      { id: 'table2', label: '기록 표', kind: 'table', wide: true, rows: 8, when: steady, text: '멈출 때마다 한 줄씩 적힙니다.',
        columns: [{ label: 'A의<br>진폭', unit: 'cm' }, { label: 'B의<br>진폭', unit: 'cm', advanced: true }, { label: '흔드는<br>방향', advanced: true }, { label: '진동수', unit: 'Hz' }, { label: '파장', unit: 'm', result: true }, { label: '속력', unit: 'm/s', result: true },
          { label: '관찰하는<br>점', unit: 'm', advanced: true }, { label: '관찰하는 점의<br>진폭', unit: 'cm', result: true, advanced: true }] },
      { id: 'table4', label: '기록 표', kind: 'table', wide: true, rows: 8, when: onFilm, text: '값을 바꿀 때마다 한 줄씩 적힙니다.',
        columns: [{ label: '빛의 색' }, { label: '파장', unit: 'nm' }, { label: '막의<br>굴절률' }, { label: '막의<br>두께', unit: 'nm' }, { label: '반사율', unit: '%', result: true }] },
      { id: 'table3', label: '기록 표', kind: 'table', wide: true, rows: 8, when: onSlit, text: '값을 바꿀 때마다 한 줄씩 적힙니다.',
        columns: [{ label: '빛의 색' }, { label: '파장', unit: 'nm' }, { label: '슬릿 사이의<br>간격', unit: 'mm' }, { label: '스크린까지의<br>거리', unit: 'm', advanced: true }, { label: '무늬 간격', unit: 'mm', result: true }] },
    ],
  },

  // writing on the chalkboard (1024 x 400)
  board(g) {
    g.fillStyle = 'rgba(255,255,255,0.9)'; g.font = '56px Georgia, serif'; g.fillText('빛의 중첩과 간섭', 60, 96);
    // two pulses on their way to each other, and the bright and dark bands
    g.strokeStyle = 'rgba(255,255,255,0.85)'; g.lineWidth = 5; g.lineJoin = 'round';
    g.beginPath(); g.moveTo(90, 300);
    for (let x = 90; x <= 560; x += 4) g.lineTo(x, 300 - (x > 150 && x < 250 ? 80 * Math.sin(Math.PI * (x - 150) / 100) ** 2 : 0) - (x > 400 && x < 500 ? 50 * Math.sin(Math.PI * (x - 400) / 100) ** 2 : 0));
    g.stroke();
    g.lineWidth = 4;
    for (const [x, way] of [[270, 1], [380, -1]]) { g.beginPath(); g.moveTo(x, 250); g.lineTo(x + way * 60, 250); g.moveTo(x + way * 42, 238); g.lineTo(x + way * 60, 250); g.lineTo(x + way * 42, 262); g.stroke(); }
    for (let k = -3; k <= 3; k++) { g.fillStyle = `rgba(255,255,255,${0.85 - 0.12 * Math.abs(k)})`; g.fillRect(790 + k * 44 - 11, 190, 22, 130); }
  },

  // Builds the apparatus on the bench (world) and returns { update(dt) }.
  create({ T, kit, world, view, ctx }) {
    const { mat, glow, add, box, cyl, canvasTexture } = kit;
    world.userData.things.visible = false;   // the spring and the rail take the whole length of the bench
    const UP = new T.Vector3(0, 1, 0);
    const M = { dark: mat(0x3a4057), steel: mat(0x9aa1b1, { roughness: 0.5, metalness: 0.5 }), wood: mat(0xc39f72) };
    const INK = { gold: 0xe3c26b, a: 0xd9584a, b: 0x4f7fd0 };
    const tipSpot = new T.Vector3(), tip = view.label(tipSpot);   // what is being set, while something is handled
    let moved = true, stopSoon = false, tipTime = 0, framed = false, grab = null, playing = false, fresh = false, since = 0;
    function say(text, x, y, z, seconds = 0) { tip.write(text); tipSpot.set(x, y, z); tip.show(true); tipTime = seconds; moved = true; }
    const tall = () => window.matchMedia('(max-aspect-ratio: 4/5)').matches;

    // ====================================== the superposition of waves ======================================
    // ---------- the spring, the two grips and the ribbon ----------
    // The spring lies along x from XA to XB with its middle line at z = 0; RING: the radius of its turns. It is drawn
    // as rings, each where the spring is and square to it.
    const XA = -LONG / UNIT / 2, XB = LONG / UNIT / 2, RING = 0.2, RINGS = 200, DOTS = 97;
    const rig = new T.Group(); world.add(rig);
    add(rig, box(XB - XA, 0.004, 0.02), mat(0x8a8478), 0, 0.003, 0, false, false);   // the line the spring lies on at rest
    const coil = new T.InstancedMesh(new T.TorusGeometry(RING, 0.026, 8, 28).rotateY(Math.PI / 2), M.steel, RINGS); coil.frustumCulled = false; coil.castShadow = true; rig.add(coil);
    // a grip: a wooden peg with a cap of its colour; over it a gold arrow, as long as the grip will swing
    const hands = [['A', XA, INK.a], ['B', XB, INK.b]].map(([name, x, color], k) => {
      const body = new T.Group(); body.position.set(x, 0, 0); rig.add(body);
      add(body, cyl(0.13, 0.13, 0.62, 20), M.wood, 0, 0.31, 0); add(body, cyl(0.15, 0.15, 0.1, 20), mat(color), 0, 0.67, 0);
      const handle = add(rig, box(1.5, 1.2, 4.4), M.dark, x + (k ? 0.4 : -0.4), 0.5, 0, false, false); handle.visible = false; handle.userData.grip = { kind: 'hand', k };   // (as wide as the grip may be carried)
      const arrow = kit.arrow(INK.gold, 0.055); arrow.visible = false; rig.add(arrow);
      const spot = new T.Vector3();
      return { name, x, body, handle, arrow, spot, label: view.label(spot) };
    });
    // the ribbon: a gold band round one turn of the spring, at the point that is watched
    const ribbon = add(rig, new T.TorusGeometry(RING + 0.045, 0.045, 8, 28).rotateY(Math.PI / 2), mat(0xe3a93b), 0, RING, 0);
    const ribbonHandle = add(rig, box(0.9, 1.0, 1.3), M.dark, 0, 0.4, 0, false, false); ribbonHandle.visible = false; ribbonHandle.userData.grip = { kind: 'spot' };
    // each wave by itself, where the two lie over each other: a row of dots of its colour, drawn through the spring
    const dots = [INK.a, INK.b].map((color, k) => {   // (A's are larger, so that both show where the two waves are alike)
      const mesh = new T.InstancedMesh(new T.SphereGeometry(k ? 0.045 : 0.075, 8, 6), new T.MeshBasicMaterial({ color, transparent: true, depthTest: false, depthWrite: false }), DOTS);
      mesh.frustumCulled = false; mesh.renderOrder = 9 + k; mesh.visible = false; rig.add(mesh); return mesh;
    });
    // the wavelength (from one crest to the next) and the amplitude (from the middle line to a crest), for a steady wave
    const span = [0, 1].map(() => { const arrow = kit.arrow(INK.gold, 0.03); arrow.visible = false; rig.add(arrow); return arrow; }), rise = kit.arrow(INK.gold, 0.03); rise.visible = false; rig.add(rise);
    const spanSpot = new T.Vector3(), spanLabel = view.label(spanSpot), riseSpot = new T.Vector3(), riseLabel = view.label(riseSpot);
    const listSpot = new T.Vector3(), listLabel = view.label(listSpot, true, -0.1);   // with the values on: the displacements of the point that is watched, in front of it

    // ---------- physics ----------
    // run.t: the time since the grips began to shake; run.state: 'ready' (nothing sent yet), 'running', 'done' (the pulses have left the spring).
    // sideA: the way A swings first (+1: towards the back); B swings the same way or the other, as set.
    const run = { t: 0, state: 'ready', wrote: null };   // (wrote: the line of the table this steady wave has got)
    let sideA = 1, marksKept = true, quiet = false;
    const isSteady = () => ctx.values.how === 'steady', shakeTime = () => (ctx.advanced ? ctx.values.shake : 0.6);
    const sideB = () => sideA * (ctx.values.dir === 'same' ? 1 : -1);
    const amp = (k) => (k === 0 ? ctx.values.ampA : twoHands(ctx.values) ? ctx.values.ampB : 0);   // how far a grip swings (cm): B only when it shakes
    const endTime = () => LONG / SPEED + shakeTime();   // when both pulses have left the spring
    // the displacement a grip gives its end of the spring, a time tau after it began (cm)
    function hand(k, tau) {
      if (tau <= 0) return 0;
      const a = amp(k) * (k ? sideB() : sideA);
      if (isSteady()) return a * Math.sin(2 * Math.PI * ctx.values.freq * tau);
      const whole = shakeTime();
      return tau >= whole ? 0 : a * Math.sin(Math.PI * tau / whole) ** 2;
    }
    // the two waves at the distance s from A (m) at the time t: each is what its grip did, a time s / v (or (L − s) / v) earlier
    const waveA = (s, t) => hand(0, t - s / SPEED), waveB = (s, t) => hand(1, t - (LONG - s) / SPEED);
    const total = (s, t) => waveA(s, t) + waveB(s, t);
    function sample(t) { const s = ctx.values.spot, a = waveA(s, t), b = waveB(s, t); ctx.traces.ya.add(t, a); ctx.traces.yb.add(t, b); ctx.traces.y.add(t, a + b); }
    // the record of the point that is watched, made anew (the point was moved): the waves are known for every moment
    function retrace() {
      for (const id of ['ya', 'yb', 'y']) ctx.traces[id].clear();
      if (run.t <= 0) return;
      for (let t = Math.max(0, run.t - 16); t < run.t - 1e-9; t += 1 / 60) sample(t);
      sample(run.t);
    }
    // a line of the table, unless the line last written reads the same in the columns on show in this mode
    // (same(above): it takes the place of that line); gives the line that stands there
    function write(id, row, same) {
      const table = ctx.tables[id], columns = ctx.spec.menus.inquiry.find((item) => item.id === id).columns;
      const rows = table.rows, above = rows[rows.length - 1];
      if (above && above.every((cell, i) => cell === row[i] || (columns[i].advanced && !ctx.advanced))) return above;
      table.add(row, Boolean(above) && same(above));
      return row;
    }
    // the pulses have gone by: the largest displacement the point that is watched had
    function noteOnce() {
      const v = ctx.values, end = endTime();
      let top = 0;
      for (let t = 0; t <= end; t += 1 / 480) { const y = total(v.spot, t); if (Math.abs(y) > Math.abs(top) + 1e-6) top = y; }
      write('table', [String(v.ampA), String(v.ampB), v.ampA > 0 && v.ampB > 0 ? (v.dir === 'same' ? '같은 방향' : '반대 방향') : '–', v.spot.toFixed(2), signed(top)], () => false);
    }
    // the steady wave was stopped: its wavelength and speed, and how far the point that is watched swung in the last period
    function noteSteady() {
      const v = ctx.values, period = 1 / v.freq;
      let top = 0;
      for (let t = Math.max(0, run.t - period); t <= run.t; t += period / 240) top = Math.max(top, Math.abs(total(v.spot, t)));
      const row = [String(v.ampA), v.both ? String(v.ampB) : '–', v.both && v.ampA > 0 && v.ampB > 0 ? (v.dir === 'same' ? '같은 방향' : '반대 방향') : '–', v.freq.toFixed(2), (SPEED / v.freq).toFixed(2), SPEED.toFixed(1), v.spot.toFixed(2), top.toFixed(1)];
      run.wrote = write('table2', row, (above) => above === run.wrote && above[6] === row[6]);   // the same wave at the same point, stopped again: its line is written anew
    }
    function note() { fresh = false; if (isSteady()) { if (run.t > 0) noteSteady(); } else if (run.state === 'done') noteOnce(); }
    function toStart() {
      run.t = 0; run.state = 'ready'; run.wrote = null; fresh = false;
      for (const id of ['ya', 'yb', 'y']) ctx.traces[id].clear();
      moved = true;
    }
    function advance(t, dt) {
      if (run.state === 'done') { stopSoon = true; ctx.seek(run.t); return; }   // the pulses have left: there is nothing more to come
      run.state = 'running'; run.t += dt;
      if (!isSteady() && run.t >= endTime()) { run.t = endTime(); sample(run.t); run.state = 'done'; stopSoon = true; ctx.seek(run.t); noteOnce(); return; }
      sample(run.t);
    }

    // ---------- handling ----------
    // A grip is carried sideways: how far sets its amplitude (5 cm a step), to which side sets the way it swings.
    // Pressed without being carried, it starts or stops the shaking, as the play button does. The ribbon is carried
    // along the spring (0.05 m a step).
    const ray = new T.Raycaster(), level = new T.Plane(new T.Vector3(0, 1, 0), 0), hit = new T.Vector3();
    function pointer(r, y) { level.constant = -y; return r.intersectPlane(level, hit) ? [hit.x, hit.z] : null; }
    const tool = {
      handles: () => [ribbonHandle, hands[0].handle, ...(twoHands(ctx.values) ? [hands[1].handle] : [])],
      start(grip, r) {
        const p = pointer(r, 0.3);
        if (!p) return false;
        grab = { ...grip, from: p, moved: false, z: 0 };
        if (grip.kind === 'spot') {
          if (ctx.locked.has('spot')) { say('잠금', p[0], 1.2, p[1], 1.2); grab = null; return false; }
          grab.off = XA + ctx.values.spot / UNIT - p[0];
        }
        return true;
      },
      move(r) {
        const p = pointer(r, 0.3);
        if (!p) return;
        if (grab.kind === 'spot') {
          const to = Math.max(0.2, Math.min(3, Math.round((p[0] + grab.off - XA) * UNIT * 20) / 20));
          if (to !== ctx.values.spot) ctx.set('spot', to);
          say(`A에서 ${ctx.values.spot.toFixed(2)} m`, XA + ctx.values.spot / UNIT, 1.1, 0);
          return;
        }
        if (!grab.moved && Math.hypot(p[0] - grab.from[0], p[1] - grab.from[1]) < 0.15) return;   // (a press is not a pull)
        const one = hands[grab.k], key = grab.k ? 'ampB' : 'ampA';
        if (ctx.locked.has(key)) { if (!grab.moved) say('잠금', one.x, 1.3, 0, 1.2); grab.moved = true; return; }
        grab.moved = true;
        const far = Math.max(0, Math.min(30, Math.round(Math.abs(p[1]) * 100 * UNIT / 5) * 5)), side = p[1] < 0 ? 1 : -1;
        if (far > 0 && !ctx.locked.has('dir')) {   // to the other side: B keeps to its own side when A is carried over
          if (grab.k === 0 && side !== sideA) { const keep = sideB(); sideA = side; if (twoHands(ctx.values) && sideB() !== keep) ctx.set('dir', ctx.values.dir === 'same' ? 'opposite' : 'same'); }
          if (grab.k === 1 && side !== sideB()) ctx.set('dir', ctx.values.dir === 'same' ? 'opposite' : 'same');
        } else if (far > 0 && grab.k === 0) sideA = side;   // (with the way locked, B goes over with A)
        if (far !== ctx.values[key]) ctx.set(key, far);
        grab.z = -(grab.k ? sideB() : sideA) * far / (100 * UNIT);
        say(`${far} cm`, one.x, 1.3, grab.z);
      },
      end(done) { if (done.kind === 'hand' && !done.moved) ctx.setPlaying(!playing); },
    };

    const place = new T.Matrix4(), way = new T.Vector3(), none = new T.Matrix4().makeScale(0, 0, 0);
    const lean = (s, t) => Math.atan(total(s + 0.005, t) - total(s - 0.005, t));   // how the spring is turned from its line at s: its slope is the change of the displacement (cm) over 1 cm
    function draw() {
      const v = ctx.values, t = run.t, ready = run.state === 'ready', many = twoHands(v), wide = 100 * UNIT;   // (wide: cm to a unit)
      for (let k = 0; k < RINGS; k++) {
        const s = LONG * (k + 0.5) / RINGS;
        coil.setMatrixAt(k, place.makeRotationY(lean(s, t)).setPosition(XA + s / UNIT, RING, -total(s, t) / wide));
      }
      coil.instanceMatrix.needsUpdate = true;
      // the grips: each where its end of the spring is, or where it is being carried; the arrow from where it rests to where it will swing
      hands.forEach((one, k) => {
        const held = grab && grab.kind === 'hand' && grab.k === k && grab.moved, far = amp(k), side = k ? sideB() : sideA;
        one.body.position.z = held ? grab.z : -total(k ? LONG : 0, t) / wide;
        one.arrow.visible = ready && far > 0;
        if (one.arrow.visible) { one.arrow.position.set(one.x, 0.8, 0); one.arrow.aim(way.set(0, 0, -side)); one.arrow.setLength(far / wide); }
        one.spot.set(one.x + (k ? 0.5 : -0.5), 1.1, one.body.position.z);
        one.label.write(ready && (k === 0 || many) ? `<b>${one.name}</b> ${far} cm` : `<b>${one.name}</b>`); one.label.show(true);
      });
      // the ribbon
      const s = v.spot, a = waveA(s, t), b = waveB(s, t), xs = XA + s / UNIT, zs = -(a + b) / wide;
      ribbon.position.set(xs, RING, zs); ribbon.rotation.y = lean(s, t); ribbonHandle.position.set(xs, 0.4, zs);
      // each wave by itself, where both are there
      for (const mesh of dots) mesh.visible = v.parts;
      if (v.parts) {
        for (let j = 0; j < DOTS; j++) {
          const at = LONG * j / (DOTS - 1), ya = waveA(at, t), yb = waveB(at, t), both = Math.abs(ya) > 0.3 && Math.abs(yb) > 0.3;
          dots[0].setMatrixAt(j, both ? place.makeTranslation(XA + at / UNIT, RING, -ya / wide) : none);
          dots[1].setMatrixAt(j, both ? place.makeTranslation(XA + at / UNIT, RING, -yb / wide) : none);
        }
        for (const mesh of dots) mesh.instanceMatrix.needsUpdate = true;
      }
      // the wavelength and the amplitude of A's wave: from the crest that is farthest along the spring back to the one behind it
      // (a crest leaves A a quarter of a period after a swing to the + side begins, three quarters after one to the − side)
      const f = v.freq, wave = SPEED / f, lead = SPEED * (t - (Math.max(0, Math.ceil(f * (t - LONG / SPEED) - (sideA > 0 ? 0.25 : 0.75) - 1e-9)) + (sideA > 0 ? 0.25 : 0.75)) / f);
      const marked = isSteady() && v.marks && !many && v.ampA > 0 && lead >= 0, crest = -v.ampA / wide;
      rise.visible = marked; span[0].visible = span[1].visible = marked && lead - wave >= 0; spanLabel.show(span[0].visible); riseLabel.show(marked);
      if (span[0].visible) {
        const mid = XA + (lead - wave / 2) / UNIT, back = crest - 0.3;
        span.forEach((arrow, k) => { arrow.position.set(mid, RING, back); arrow.aim(way.set(k ? -1 : 1, 0, 0)); arrow.setLength(wave / UNIT / 2); });
        spanSpot.set(mid, RING, back - 0.25); spanLabel.write(`파장 <b>${wave.toFixed(2)} m</b>`);
      }
      if (marked) {
        rise.position.set(XA + lead / UNIT, RING, 0); rise.aim(way.set(0, 0, -1)); rise.setLength(Math.abs(crest));
        riseSpot.set(XA + lead / UNIT, RING, 0.55); riseLabel.write(`진폭 <b>${v.ampA} cm</b>`);
      }
      // the values at the point that is watched
      listLabel.show(v.numbers);
      if (v.numbers) {
        const lines = [`A에서 ${s.toFixed(2)} m`, `파동 A <b>${signed(a)} cm</b>`];
        if (many) lines.push(`파동 B <b>${signed(b)} cm</b>`, `합성파 <b>${signed(a + b)} cm</b>`);
        if (isSteady()) lines.push(`진동수 ${f.toFixed(2)} Hz · 주기 ${(1 / f).toFixed(2)} s`, `파장 ${wave.toFixed(2)} m · 속력 ${SPEED.toFixed(1)} m/s`);
        listLabel.write(lines.join('<br>'));
        if (tall()) listSpot.set(xs + 1.2, 0, -3.3); else listSpot.set(xs, 0, 2.0);   // (an upright screen looks along the spring from B: at the right of the point, clear of the menu)
      }
    }

    const waveScene = {
      rig, ids: ['how', 'ampA', 'ampB', 'dir', 'freq', 'both', 'shake', 'spot'], keep: ['parts'], kept: { parts: true },
      look: [{ target: [-1.4, 0.2, 0.3], r: 16.5, theta: 0, phi: 0.72 }, { target: [1.2, 0.2, 0], r: 25.5, theta: Math.PI / 2, phi: 0.42 }],
      handles: tool.handles, start: tool.start, move: tool.move, end: tool.end,
      enter() { rig.visible = true; },
      leave() { toStart(); rig.visible = false; for (const label of [hands[0].label, hands[1].label, spanLabel, riseLabel, listLabel]) label.show(false); },
      changed(id, value) {
        if (id === 'spot') { retrace(); if (!playing && (run.state === 'done' || (isSteady() && run.t > 0))) { fresh = true; since = performance.now(); } return; }   // the same waves, watched at another point
        if (id === 'how' && value === 'steady' && ctx.values.marks !== marksKept) ctx.set('marks', marksKept);   // (the frame switches off what is out of sight)
        again();
      },
      play(on) {
        if (on && run.state === 'done') { toStart(); ctx.seek(0); }   // once more
        if (on) { run.state = 'running'; stopSoon = false; } else if (!quiet && isSteady() && run.t > 0) noteSteady();
      },
      tick: advance, toStart, draw, note,
      mode: again,   // how long a shake takes and B's steady shaking count in the advanced mode only
    };
    // another wave: from its start (the wave that was under way gets no line of the table: what it was is no longer set)
    function again() { if (run.t > 0) { quiet = true; ctx.emit('action', 'reset'); quiet = false; } else toStart(); }

    // ====================================== the double slit ======================================
    // ---------- the rail, the laser, the card with the two slits and the screen ----------
    // The beam runs along x at the height BY: from the laser through the card at XS to the screen, a metre further on
    // (RAIL units to a metre: half the size of the room, to keep the screen near). Across the beam nothing could be seen
    // at that scale, so the slits (SLOT mm wide) and the gap between them are drawn 50 times their size (CARD units
    // to a mm), or 800 times while the fronts of the waves are shown (MODEL units to a mm), and the face of the screen
    // 10 times (SHOW units to a mm; REACH: how far from the middle the point P may be carried, in mm). The gap is set
    // by pulling the card sideways: GEAR units of the hand to a mm of the gap. + on the screen is towards the
    // front of the bench: to the right for someone who looks along the beam. S1 is the slit at the back, S2 the one
    // at the front. The brightness on the screen is that of two slits of that width: cos² of half the phase between
    // the two ways, times the square of sin β / β for one slit.
    const XS = -3.4, BY = 1.3, RAIL = 5, CARD = 0.5, MODEL = 8, GEAR = 8, SHOW = 0.1, SLOT = 0.04, REACH = 24, LASER = -6.0;
    const white = () => ctx.values.color === 'white';
    const lightHeld = () => ctx.locked.has('color') || (ctx.values.color === 'custom' && ctx.locked.has('wave'));   // pressing the laser may not give other light: the colour is locked, or the wavelength set by hand is
    const wide = () => (ctx.values.fronts && !white() ? MODEL : CARD);   // units to a mm, for the slits as they are drawn now
    const rig2 = new T.Group(); world.add(rig2);
    add(rig2, box(12.4, 0.12, 0.5), M.steel, -1.1, 0.06, 0);
    const lit = new T.MeshBasicMaterial({ color: 0xffffff }), beamInk = new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5, depthWrite: false });
    // the laser: pressed, it gives light of the other colour
    add(rig2, cyl(0.21, 0.21, 1.6, 20).rotateZ(Math.PI / 2), M.dark, LASER, BY, 0); add(rig2, cyl(0.12, 0.12, 0.04, 16).rotateZ(Math.PI / 2), lit, LASER + 0.81, BY, 0, false, false);
    add(rig2, cyl(0.06, 0.06, BY - 0.5, 10), M.steel, LASER, (BY + 0.1) / 2, 0); add(rig2, box(0.9, 0.2, 0.9), M.dark, LASER, 0.2, 0);
    add(rig2, cyl(0.022, 0.022, XS - LASER - 0.83, 8).rotateZ(Math.PI / 2), beamInk, (XS + LASER + 0.83) / 2, BY, 0, false, false);
    const laserHandle = add(rig2, box(2.0, 1.1, 1.1), M.dark, LASER, BY, 0, false, false); laserHandle.visible = false; laserHandle.userData.grip = { kind: 'laser' };
    const laserSpot = new T.Vector3(LASER, BY + 0.45, 0), laserLabel = view.label(laserSpot);
    // the card in its holder, and the two slits: either half of the card is pulled outwards for a wider gap, inwards for a narrower one
    add(rig2, box(0.05, 1.2, 3.4), mat(0x2b2b2b, { roughness: 0.8 }), XS, BY - 0.15, 0);   // (low above the beam, so that what goes on behind it can be seen over it)
    add(rig2, box(0.6, 0.2, 3.9), M.dark, XS, 0.2, 0);
    for (const z of [-1.76, 1.76]) add(rig2, cyl(0.05, 0.05, BY + 0.2, 10), M.steel, XS, (BY + 0.8) / 2, z);
    const slots = [-1, 1].map((side, k) => {
      const bar = add(rig2, box(0.07, 0.7, 1), lit, XS, BY, 0, false, false);
      const handle = add(rig2, box(0.6, 1.3, 1.7), M.dark, XS, BY, side * 0.85, false, false); handle.visible = false; handle.userData.grip = { kind: 'slit', k };
      const spot = new T.Vector3();
      return { side, bar, handle, spot, label: view.label(spot, false, k ? -0.02 : 0) };
    });
    const gapSpot = new T.Vector3(), gapLabel = view.label(gapSpot);
    // the screen: a board on a carriage. Its face is a picture (FACE.px dots to a unit; row: where the beam meets it)
    // with the light and a rule in mm below; a ledge along its top carries the same light, to be seen from above.
    const FACE = { w: 5.2, h: 2.4, px: 200, row: 280 };
    const screen = new T.Group(); rig2.add(screen);
    const face = canvasTexture(FACE.w * FACE.px, FACE.h * FACE.px, () => {}), pen = face.image.getContext('2d'), faceInk = new T.MeshBasicMaterial({ map: face, toneMapped: false });
    add(screen, box(0.12, FACE.h, FACE.w), mat(0x30333d), 0.06, BY + 0.2, 0); add(screen, box(0.6, 0.22, 1.4), M.dark, 0.06, 0.19, 0);
    add(screen, new T.PlaneGeometry(FACE.w, FACE.h).rotateY(-Math.PI / 2), faceInk, -0.002, BY + 0.2, 0, false, false);
    { const ledge = new T.PlaneGeometry(FACE.w, 0.34).rotateX(-Math.PI / 2).rotateY(-Math.PI / 2), uv = ledge.attributes.uv;
      for (let i = 0; i < uv.count; i++) uv.setY(i, 1 - FACE.row / (FACE.h * FACE.px));
      add(screen, box(0.34, 0.03, FACE.w), mat(0x30333d), -0.05, BY + 0.2 + FACE.h / 2 + 0.015, 0); add(screen, ledge, faceInk, -0.05, BY + 0.2 + FACE.h / 2 + 0.032, 0, false, false); }
    // the point P of the screen: a gold ring, carried along the screen
    const ring = add(screen, new T.TorusGeometry(0.17, 0.028, 8, 28).rotateY(Math.PI / 2), glow(INK.gold), -0.04, BY, 0, false, false);
    const pointHandle = add(screen, box(0.9, 1.5, 0.9), M.dark, -0.2, BY, 0, false, false); pointHandle.visible = false; pointHandle.userData.grip = { kind: 'point' };
    const pointSpot = new T.Vector3(), pointLabel = view.label(pointSpot);
    // (advanced) the screen is carried along the rail by its foot and the rule along the bottom of its face
    const screenHandle = add(screen, box(0.8, 0.8, FACE.w), M.dark, 0.06, 0.4, 0, false, false); screenHandle.visible = false; screenHandle.userData.grip = { kind: 'screen' };
    const farSpot = new T.Vector3(), farLabel = view.label(farSpot);
    // the light from each slit to P as a wave (a model): beads along its way for the first waves after the slit and
    // the last before P, and a thin line for all that lies between (a million waves or more could not be drawn).
    // S1's is of the colour of the light, S2's darker; S1's runs a little above the beam and S2's as much below it,
    // as the two lie one upon the other nearly all the way. A gold ball before the screen swings as the two do together.
    const NEAR = 70, FAR = 120, SWING = 0.2, APART = 0.08;
    const trains = [1, 0.5].map((shade) => {
      const ink = new T.MeshBasicMaterial({ color: 0xffffff }), mesh = new T.InstancedMesh(new T.SphereGeometry(0.055, 8, 6), ink, NEAR + FAR); mesh.frustumCulled = false; rig2.add(mesh);
      const line = add(rig2, cyl(0.012, 0.012, 1, 6), new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.45, depthWrite: false }), 0, 0, 0, false, false);
      return { shade, ink, mesh, line };
    });
    const bob = add(rig2, new T.SphereGeometry(0.09, 14, 10), glow(INK.gold), 0, BY, 0, false, false);
    // the fronts of the waves (a model): dark plates at the height of the beam, on which the crests are bright.
    // From the laser to the card they are straight, across a beam wide enough for both slits; behind the card they
    // are the circles round each slit, for a little way. (at: how far along the beam from the card, and how far to the front)
    const PLATE = { long: 2.2, wide: 4.4, from: LASER + 0.9, beam: 3.4 };
    const plateInk = new T.ShaderMaterial({
      uniforms: { uHalf: { value: 0.4 }, uWave: { value: 0.3 }, uPhase: { value: 0 }, uTint: { value: new T.Vector3(1, 1, 1) } },
      vertexShader: `varying vec2 at; void main() { at = vec2(position.x + ${(-XS).toFixed(2)}, position.z); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: 'uniform float uHalf; uniform float uWave; uniform float uPhase; uniform vec3 uTint; varying vec2 at;\n'
        + 'void main() { float k = 6.2831853 / uWave; float high;\n'
        + `  if (at.x < 0.0) high = (0.5 + 0.5 * sin(k * at.x - uPhase)) * (1.0 - smoothstep(${(PLATE.beam / 2 - 0.25).toFixed(2)}, ${(PLATE.beam / 2).toFixed(2)}, abs(at.y)));\n`
        + '  else high = 0.5 + 0.25 * (sin(k * length(vec2(at.x, at.y + uHalf)) - uPhase) + sin(k * length(vec2(at.x, at.y - uHalf)) - uPhase));\n'
        + '  gl_FragColor = vec4(mix(vec3(0.07, 0.08, 0.13), uTint, high * high), 1.0); }',
    });
    const plates = [
      add(rig2, new T.PlaneGeometry(XS - 0.03 - PLATE.from, PLATE.beam).rotateX(-Math.PI / 2).translate((XS - 0.03 + PLATE.from) / 2, BY - 0.06, 0), plateInk, 0, 0, 0, false, false),
      add(rig2, new T.PlaneGeometry(PLATE.long, PLATE.wide).rotateX(-Math.PI / 2).translate(XS + 0.03 + PLATE.long / 2, BY - 0.06, 0), plateInk, 0, 0, 0, false, false),
    ];
    const listSpot2 = new T.Vector3(), listLabel2 = view.label(listSpot2, true);   // with the values on: the difference of the two ways to P, and how far the bands are apart

    // ---------- physics ----------
    // Lengths across the beam are in mm. run2.t: the time the model waves have run (the green light swings once a second).
    // tried: the gaps between the slits tried with this light, each with how far apart the bright bands were.
    // tried2: likewise, how far the screen was (advanced). White light (advanced) is many wavelengths at once: it has no
    // one wavelength, and the models are not drawn for it.
    const run2 = { t: 0 }, tried = { key: '', at: new Map() }, tried2 = { key: '', at: new Map() };
    let settling = false;   // the values are being put back one by one: what stands between was never shown, and is not kept
    function light() {   // the light as it is now: its name, its wavelength (nm) and its colour
      const v = ctx.values, nm = v.color === 'custom' ? v.wave : white() ? 550 : LIGHT[v.color].nm;
      return white() ? { name: '백색광', nm, rgb: [255, 255, 255] } : { name: v.color === 'custom' ? named(nm) : LIGHT[v.color].name, nm, rgb: hue(nm) };
    }
    const lambda = () => light().nm * 1e-6, far = () => (ctx.advanced ? ctx.values.far * 1000 : 1000);   // the wavelength; from the slits to the screen (a metre in the basic mode)
    const fringe = () => lambda() * far() / ctx.values.slits;   // from one bright band to the next
    // how much longer the way from S1 is than the way from S2, to the point x of the screen (S1 is at −d/2, S2 at +d/2)
    const lag = (x) => Math.hypot(far(), x + ctx.values.slits / 2) - Math.hypot(far(), x - ctx.values.slits / 2);
    function glare(x, wave = lambda()) {
      const turn = Math.PI * SLOT * x / Math.hypot(far(), x) / wave, half = Math.PI * lag(x) / wave;
      return (Math.abs(turn) < 1e-9 ? 1 : (Math.sin(turn) / turn) ** 2) * Math.cos(half) ** 2;
    }
    const shine = (x) => (white() ? WHITE.reduce((sum, nm) => sum + glare(x, nm * 1e-6), 0) / WHITE.length : glare(x));   // how bright the screen is at x (1 at its middle)
    // where P is: the place set, or the middle of a bright or a dark band if that is within half a step of it
    function pointAt() {
      const x = ctx.values.point;
      if (white()) return x;
      const waves = lag(x) / lambda(), to = x - (waves - Math.round(2 * waves) / 2) * fringe();
      return Math.abs(to - x) <= 0.051 ? to : x;
    }
    // where P is, written the same beside the hand and in the list of values: to a hundredth where it stands at the middle of a band, off the step of the menu
    const placed = () => { const at = pointAt(); return `O에서 ${Math.abs(at - ctx.values.point) < 1e-9 ? milli(at) : `${at > 0 ? '' : '−'}${Math.abs(at).toFixed(2)}`} mm`; };
    // the face of the screen, dark as in the textbook's figures: the light as it falls on it (dim bands are drawn brighter than they are, as the eye sees them), and the rule
    function paint() {
      const ink = light().rgb, w = FACE.w * FACE.px, paper = [24, 26, 34], TALL = 70, top = FACE.row - TALL;
      pen.fillStyle = `rgb(${paper.join()})`; pen.fillRect(0, 0, w, FACE.h * FACE.px);
      const band = pen.createImageData(w, 2 * TALL), data = band.data;
      // (white light: each wavelength falls in its own bands and with its own colour; all together are white at the middle)
      const tints = white() ? WHITE.map(hue) : null, whole = tints && [0, 1, 2].map((c) => tints.reduce((sum, one) => sum + one[c], 0)), part = [0, 0, 0];
      for (let px = 0; px < w; px++) {
        const x = (px + 0.5 - w / 2) / (FACE.px * SHOW);
        if (tints) {
          part.fill(0);
          WHITE.forEach((nm, n) => { const some = glare(x, nm * 1e-6); for (let c = 0; c < 3; c++) part[c] += tints[n][c] * some; });
          for (let c = 0; c < 3; c++) part[c] = (part[c] / whole[c]) ** 0.55;
        } else part.fill(glare(x) ** 0.55);
        for (let row = 0; row < 2 * TALL; row++) {
          const soft = Math.exp(-(((row - TALL) / 26) ** 2) / 2), i = (row * w + px) * 4;
          for (let c = 0; c < 3; c++) data[i + c] = paper[c] + (ink[c] - paper[c]) * part[c] * soft;
          data[i + 3] = 255;
        }
      }
      pen.putImageData(band, 0, top);
      pen.strokeStyle = pen.fillStyle = '#d8d2c4'; pen.lineWidth = 2; pen.textAlign = 'center'; pen.font = '26px Georgia, serif';
      pen.beginPath();
      for (let mm = -25; mm <= 25; mm++) { const x = w / 2 + mm * FACE.px * SHOW; pen.moveTo(x, 394); pen.lineTo(x, mm % 10 === 0 ? 428 : mm % 5 === 0 ? 418 : 408); }
      pen.stroke();
      for (const mm of [-20, -10, 0, 10, 20]) pen.fillText(milli(mm).replace('.0', ''), w / 2 + mm * FACE.px * SHOW, 458);
      pen.fillText('mm', w - 40, 458); pen.font = 'italic 30px Georgia, serif'; pen.fillText('O', w / 2, 384);
      face.needsUpdate = true;
    }
    // for the graphs: how bright the screen is from end to end, and (as an upright line) how bright it is at P
    function curve() {
      ctx.traces.ix.clear();
      for (let n = -REACH * 20; n <= REACH * 20; n++) ctx.traces.ix.add(n / 20, shine(n / 20));
    }
    function pointMark() { const x = pointAt(); ctx.traces.ip.clear(); ctx.traces.ip.add(x, 0); ctx.traces.ip.add(x, shine(x)); }
    // for the graphs: the gaps tried with this light and the screen this far, and how far the screen was with this light and this gap
    function collect() {
      const v = ctx.values;
      for (const [one, key, at, id] of [[tried, `${light().nm}/${far()}`, v.slits, 'gd'], [tried2, `${light().nm}/${v.slits}`, far() / 1000, 'gl']]) {
        if (key !== one.key || white()) { one.key = white() ? '' : key; one.at.clear(); }
        if (!white()) one.at.set(at, fringe());
        ctx.traces[id].clear();
        for (const [x, apart] of [...one.at].sort((a, b) => a[0] - b[0])) ctx.traces[id].add(x, apart);
      }
    }
    function noteSlit() {
      fresh = false;
      write('table3', [light().name, white() ? '–' : String(light().nm), ctx.values.slits.toFixed(2), (far() / 1000).toFixed(1), white() ? '–' : fringe().toFixed(2)], () => false);
    }
    function toStartSlit() {
      run2.t = 0;
      const back = [['color', 'green'], ['wave', 530], ['slits', 0.1], ['far', 1], ['point', 0]].filter(([key, value]) => !ctx.locked.has(key) && ctx.values[key] !== value);
      settling = true; for (const [key, value] of back) ctx.set(key, value); settling = false;
      if (back.length) slitScene.changed(back.every(([key]) => key === 'point') ? 'point' : 'all');   // (once, for the values as they stand at last)
      moved = true;
    }
    function advanceSlit(t, dt) { run2.t += dt; }   // (only the models move: the light on the screen stays as it is)

    // ---------- handling ----------
    // P is carried along the screen (0.1 mm a step), a half of the card sideways (0.05 mm of the gap a step); the laser is pressed.
    // How far along a line the pointer is: the point of that line nearest the line of sight. The line runs along the
    // rail ('x') or across it ('z'), through the place at which the thing was taken (grab.at). (One rule for every line
    // of sight, as in P-15: with a level plane for some and an upright one for others, the thing leapt where the
    // pointer passed from the one to the other.)
    function slide(r, axis) {
      const d = r.direction, lean = 1 - d[axis] * d[axis];
      if (lean < 1e-3) return null;   // (none for someone who looks straight along that line)
      hit.copy(grab.at); hit[axis] = 0; hit.sub(r.origin);
      return (d[axis] * hit.dot(d) - hit[axis]) / lean;
    }
    const slitTool = {
      handles: () => (ctx.advanced ? [pointHandle, slots[0].handle, slots[1].handle, laserHandle, screenHandle] : [pointHandle, slots[0].handle, slots[1].handle, laserHandle]),
      start(grip, r) {
        if (grip.kind === 'laser') { grab = { ...grip }; return true; }
        ray.ray.copy(r);
        const held = ray.intersectObject(grip.kind === 'screen' ? screenHandle : grip.kind === 'point' ? pointHandle : slots[grip.k].handle, false)[0];
        if (!held) return false;
        const at = held.point;
        if (grip.kind === 'screen') {
          if (ctx.locked.has('far')) { say('잠금', screen.position.x, BY + 1.7, 0, 1.2); return false; }
          grab = { ...grip, at, off: screen.position.x - at.x };
          return true;
        }
        const key = grip.kind === 'point' ? 'point' : 'slits', x = grip.kind === 'point' ? screen.position.x : XS, z = at.z;
        if (ctx.locked.has(key)) { say('잠금', x, BY + 1, z, 1.2); return false; }
        grab = { ...grip, at, x, off: pointAt() * SHOW - z, from: z, gap: ctx.values.slits };
        return true;
      },
      move(r) {
        if (grab.kind === 'laser') return;
        if (grab.kind === 'screen') {   // 0.1 m a step
          const x = slide(r, 'x');
          if (x === null) return;
          const to = Math.max(0.5, Math.min(1.5, Math.round((x + grab.off - XS) / RAIL * 10) / 10));
          if (to !== ctx.values.far) ctx.set('far', to);
          say(`${to.toFixed(1)} m`, XS + to * RAIL, BY + 1.75, 0);
          return;
        }
        const z = slide(r, 'z');
        if (z === null) return;
        if (grab.kind === 'point') {
          const to = Math.max(-REACH, Math.min(REACH, Math.round((z + grab.off) / SHOW * 10) / 10));
          if (to !== ctx.values.point) ctx.set('point', to);
          say(placed(), grab.x, BY + 0.95, to * SHOW);
        } else {
          const to = Math.max(0.1, Math.min(0.3, Math.round((grab.gap + slots[grab.k].side * (z - grab.from) * 2 / GEAR) * 20) / 20));
          if (to !== ctx.values.slits) ctx.set('slits', to);
          say(`${to.toFixed(2)} mm`, XS, BY + 1.25, 0);
        }
      },
      end(done) {
        if (done.kind !== 'laser') return;
        const turns = ctx.advanced ? ['green', 'red', 'white'] : ['green', 'red'];   // (a wavelength of one's own is set from the menu)
        if (lightHeld()) say('잠금', LASER, BY + 0.9, 0, 1.2); else ctx.set('color', turns[(turns.indexOf(ctx.values.color) + 1) % turns.length]);
      },
    };

    function drawSlit() {
      const v = ctx.values, [r, g, b] = light().rgb, half = v.slits * wide() / 2, xs = XS + far() / 1000 * RAIL, x = pointAt(), zp = x * SHOW, waves = lag(x) / lambda();
      const wave = light().nm / 700 * 0.4, turn = 2 * Math.PI * run2.t * 530 / light().nm;   // the wavelength as the models draw it; how far the waves have swung
      screen.position.x = xs;
      lit.color.setRGB(r / 255, g / 255, b / 255, T.SRGBColorSpace); beamInk.color.copy(lit.color);
      if (tall()) laserSpot.set(LASER, BY, 1.5); else laserSpot.set(LASER, BY + 0.45, 0);
      laserLabel.write(white() ? '<b>백색광</b>' : `${light().name} <b>${light().nm} nm</b>`); laserLabel.show(true);
      slots.forEach((one, k) => {
        const z = one.side * half;
        one.bar.position.z = z; one.bar.scale.z = SLOT * wide();
        one.spot.set(XS, BY + (k ? -0.78 : 0.5), z + one.side * (wide() === MODEL ? 0 : 0.22)); one.label.write(`S<sub>${k + 1}</sub>`); one.label.show(true);   // (the two names apart, where the slits are close)
      });
      if (tall()) gapSpot.set(XS, BY + 1.15, 1.0); else gapSpot.set(XS, BY - 0.25, 2.5);   // (on an upright screen: over the card, clear of the laser)
      gapLabel.write(`슬릿 사이의 간격 <b>${v.slits.toFixed(2)} mm</b>`); gapLabel.show(true);
      ring.position.z = pointHandle.position.z = zp;
      pointSpot.set(xs, BY + 1.48, zp); pointLabel.write('<b>P</b>'); pointLabel.show(true);
      farLabel.show(ctx.advanced);
      if (ctx.advanced) { farSpot.set((XS + xs) / 2, 0.35, 1.0); farLabel.write(`스크린까지의 거리 <b>${(far() / 1000).toFixed(1)} m</b>`); }
      // the two waves: in step where they leave the slits; at P as far out of step as the ways differ (in wavelengths)
      const paths = v.paths && !white(), fronts = v.fronts && !white();
      trains.forEach((one, k) => {
        one.mesh.visible = one.line.visible = paths;
        if (!paths) return;
        one.ink.color.setRGB(one.shade * r / 255, one.shade * g / 255, one.shade * b / 255, T.SRGBColorSpace); one.line.material.color.copy(one.ink.color);
        const z0 = (k ? 1 : -1) * half, dx = xs - 0.03 - XS, dz = zp - z0, long = Math.hypot(dx, dz), ux = dx / long, uz = dz / long, last = (k ? 1 : -1) * Math.PI * waves;
        const y = BY + (k ? -APART : APART), near = Math.min(2.5, 0.3 * long / wave) * wave, end = Math.min(4, 0.5 * long / wave) * wave;   // (shorter stretches where the screen is near)
        const bead = (n, s, swing) => one.mesh.setMatrixAt(n, place.makeTranslation(XS + ux * s - uz * swing, y, z0 + uz * s + ux * swing));
        for (let n = 0; n < NEAR; n++) { const s = near * n / (NEAR - 1); bead(n, s, SWING * Math.min(1, (near - s) / (0.75 * wave)) * Math.sin(2 * Math.PI * s / wave - turn)); }
        for (let n = 0; n < FAR; n++) { const back = end * n / (FAR - 1); bead(NEAR + n, long - back, SWING * Math.min(1, (end - back) / (0.75 * wave)) * Math.sin(last - 2 * Math.PI * back / wave - turn)); }
        one.mesh.instanceMatrix.needsUpdate = true;
        one.line.position.set(XS + dx / 2, y, z0 + dz / 2); one.line.quaternion.setFromUnitVectors(UP, way.set(ux, 0, uz)); one.line.scale.y = long;
      });
      bob.visible = paths; bob.position.set(xs - 0.14, BY, zp + 2 * SWING * Math.cos(Math.PI * waves) * Math.sin(-turn));
      plates[0].visible = plates[1].visible = fronts;
      if (fronts) { const u = plateInk.uniforms; u.uHalf.value = half; u.uWave.value = wave; u.uPhase.value = turn % (2 * Math.PI); u.uTint.value.set(r / 255, g / 255, b / 255); }
      listLabel2.show(v.numbers);
      if (v.numbers) {
        const size = Math.abs(waves), halves = Math.round(2 * size), sharp = Math.abs(2 * size - halves) < 0.02;
        const lines = [`<b>P</b> ${placed()}`, white() ? `경로차 <b>${Math.round(Math.abs(lag(x)) * 1e6)} nm</b>` : `경로차 <b>${size.toFixed(2)} 파장</b>`];
        if (!white()) {
          if (sharp) lines.push(halves === 0 ? '보강 간섭' : halves % 2 ? `반파장의 홀수 배(${halves}배) → 상쇄 간섭` : `반파장의 짝수 배(${halves}배) → 보강 간섭`);
          lines.push(`무늬 간격 <b>${fringe().toFixed(2)} mm</b>`);
          if (ctx.advanced) lines.push(tall() ? '= 스크린까지의 거리 × 파장<br>÷ 슬릿 사이의 간격' : '= 스크린까지의 거리 × 파장 ÷ 슬릿 사이의 간격', `= ${(far() / 1000).toFixed(1)} m × ${light().nm} nm ÷ ${v.slits.toFixed(2)} mm`);   // (the bright bands are evenly apart where the screen is far off)
        }
        listLabel2.write(lines.join('<br>')); if (tall()) { if (ctx.advanced) listSpot2.set(-7.2, 0.1, 2.05); else listSpot2.set(xs, BY + 2.2, 0); } else if (ctx.advanced) { if (ctx.view.kind === 'fixed' && ctx.view.dir === 'top') listSpot2.set((XS + xs) / 2, 0.3, -2.1); else listSpot2.set(0.2, 0.3, 4.2); } else listSpot2.set(xs + 1.9, BY + 0.6, 1.2);   // (behind the screen; at the front of the bench where the screen may be carried far off (from above: at the back, between the card and the screen); over it on an upright screen)
      }
    }

    const slitScene = {
      rig: rig2, ids: ['color', 'wave', 'slits', 'far', 'point'], keep: ['paths', 'fronts'], kept: { paths: false, fronts: false },
      look: [{ target: [-1.4, 1.1, 0.2], r: 13, theta: -0.8, phi: 0.9 }, { target: [-1.5, 0.9, 0], r: 16.5, theta: -1.45, phi: 0.95 }],
      handles: slitTool.handles, start: slitTool.start, move: slitTool.move, end: slitTool.end,
      enter() { rig2.visible = true; run2.t = 0; paint(); curve(); pointMark(); collect(); fresh = true; since = performance.now(); },
      leave() { rig2.visible = false; for (const label of [laserLabel, gapLabel, pointLabel, farLabel, listLabel2, slots[0].label, slots[1].label]) label.show(false); },
      changed(id) {
        if (settling) return;
        if (id !== 'point') { paint(); curve(); collect(); fresh = true; since = performance.now(); }
        pointMark();
      },
      play() {},
      tick: advanceSlit, toStart: toStartSlit, draw: drawSlit, note: noteSlit,
      mode() { paint(); curve(); pointMark(); collect(); fresh = true; since = performance.now(); },   // (the screen is a metre off in the basic mode, wherever it was left)
    };

    // ====================================== the film that stops reflection ======================================
    // ---------- the glass, the film on it and the light ----------
    // All of it lies in the upright plane x = 0, across the bench (seen face on from the left): the glass is GLASS
    // high, and the film on it SCALE units to a nm (300 000 times its size, as are the waves). The light comes down
    // from the back at SLANT from the upright and would meet the bare glass at z = FOOT. Part comes back from the
    // top of the film (at A), part goes into the film (bent as its index asks), comes back from the glass (at B) and
    // leaves the film again (at C). The two that come back are drawn as waves for RUN units, each as high as it is
    // strong (HIGH units for the light that falls on the film), and then, for SUM units more, what they are together.
    const GLASS = 1.2, SCALE = 0.003, SLANT = 35 * Math.PI / 180, FOOT = -0.5, REACH3 = 4.2, RUN = 3.6, SUM = 2.8, HIGH = 2.5, PULL = 3, NS = 1.52;
    const SIN = Math.sin(SLANT), COS = Math.cos(SLANT);
    const rig3 = new T.Group(); world.add(rig3);
    const glassInk = new T.MeshStandardMaterial({ color: 0x9fd6d0, roughness: 0.25, transparent: true, opacity: 0.5, depthWrite: false });
    const filmInk = new T.MeshStandardMaterial({ color: 0x9a82ee, roughness: 0.3, transparent: true, opacity: 0.62, depthWrite: false });
    add(rig3, box(2.8, GLASS, 6.4), glassInk, 0, GLASS / 2 + 0.01, 0, false, true);
    // a dark board behind it all, against which the light shows
    add(rig3, box(0.08, 8.3, 8.6), mat(0x565c78, { roughness: 0.9 }), 1.75, 4.15 + 0.2, -0.3); for (const z of [-3.9, 3.3]) add(rig3, box(0.9, 0.2, 0.5), M.dark, 1.75, 0.1, z);
    const slab = add(rig3, box(2.8, 1, 6.4), filmInk, 0, GLASS, 0, false, false);
    const filmHandle = add(rig3, box(3.0, 0.7, 6.6), M.dark, 0, GLASS, 0, false, false); filmHandle.visible = false; filmHandle.userData.grip = { kind: 'film' };
    // the laser on a stand, pointing down the slant; pressed, it gives other light
    const LAMP = { y: GLASS + (REACH3 + 0.6) * COS, z: FOOT - (REACH3 + 0.6) * SIN };
    { const body = add(rig3, cyl(0.21, 0.21, 1.2, 20), M.dark, 0, LAMP.y, LAMP.z); body.rotation.x = -SLANT;
      const front = add(rig3, cyl(0.12, 0.12, 0.04, 16), lit, 0, LAMP.y - 0.61 * COS, LAMP.z + 0.61 * SIN, false, false); front.rotation.x = -SLANT;
      add(rig3, cyl(0.05, 0.05, LAMP.y + 0.4, 10), M.steel, 0.36, (LAMP.y + 0.4) / 2, LAMP.z); add(rig3, box(1.1, 0.16, 0.9), M.dark, 0.2, 0.08, LAMP.z);
      add(rig3, box(0.5, 0.12, 0.12), M.steel, 0.2, LAMP.y, LAMP.z); }
    const lampHandle = add(rig3, box(1.0, 1.6, 1.4), M.dark, 0, LAMP.y, LAMP.z, false, false); lampHandle.visible = false; lampHandle.userData.grip = { kind: 'laser' };
    const lampSpot = new T.Vector3(0, LAMP.y + 0.95, LAMP.z), lampLabel = view.label(lampSpot);
    // the light as lines: falling on the film, down and up in it, on into the glass, and the two that come back
    const dimInk = new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4, depthWrite: false });
    const rod = (radius, ink) => add(rig3, cyl(radius, radius, 1, 8), ink, 0, 0, 0, false, false);
    const rods = { fall: rod(0.024, beamInk), down: rod(0.02, lit), up: rod(0.02, lit), on: rod(0.022, beamInk), one: rod(0.012, dimInk), two: rod(0.012, dimInk) };
    function lay(mesh, y0, z0, y1, z1) {   // a line from one point of the plane to another
      const long = Math.hypot(y1 - y0, z1 - z0);
      mesh.position.set(0, (y0 + y1) / 2, (z0 + z1) / 2); mesh.quaternion.setFromUnitVectors(UP, way.set(0, (y1 - y0) / long, (z1 - z0) / long)); mesh.scale.y = long;
    }
    // the two waves that come back, and the two together (gold)
    const BEADS = 110;
    const echoes = [1, 0.5, 0].map((shade) => {
      const ink = shade ? new T.MeshBasicMaterial({ color: 0xffffff }) : glow(INK.gold), mesh = new T.InstancedMesh(new T.SphereGeometry(shade ? 0.05 : 0.06, 8, 6), ink, BEADS); mesh.frustumCulled = false; rig3.add(mesh);
      return { shade, ink, mesh };
    });
    const backSpot = new T.Vector3(), backLabel = view.label(backSpot), thickSpot = new T.Vector3(), thickLabel = view.label(thickSpot);
    const glassSpot = new T.Vector3(0, GLASS / 2, 3.55), glassLabel = view.label(glassSpot), listSpot3 = new T.Vector3(), listLabel3 = view.label(listSpot3, true);

    // ---------- physics ----------
    // Light that falls straight on a film of index n and thickness t (nm) on glass of index NS: r1 and r2 are the
    // parts of the wave thrown back at the top of the film and at the glass, and the one from the glass is behind by
    // the turn 4πnt/λ. back(): the part of the light that comes back (of its energy), every later going to and fro counted.
    const run3 = { t: 0 };
    function back(nm, thick = ctx.values.thick, n = ctx.values.index) {
      const r1 = (n - 1) / (n + 1), r2 = (NS - n) / (NS + n), c = Math.cos(4 * Math.PI * n * thick / nm);
      return (r1 * r1 + r2 * r2 + 2 * r1 * r2 * c) / (1 + r1 * r1 * r2 * r2 + 2 * r1 * r2 * c);
    }
    const backNow = (thick) => (white() ? WHITE.reduce((sum, nm) => sum + back(nm, thick), 0) / WHITE.length : back(light().nm, thick));
    const quarter = () => light().nm / ctx.values.index / 4;   // the thinnest film from which the least comes back (nm)
    function curves() {   // for the graphs
      const t = ctx.traces, v = ctx.values;
      for (const id of ['rt', 'rp', 'rw', 'rq']) t[id].clear();
      for (let thick = 0; thick <= 300; thick += 2) t.rt.add(thick, 100 * backNow(thick));
      t.rp.add(v.thick, 0); t.rp.add(v.thick, 100 * backNow(v.thick));
      for (let nm = 400; nm <= 700; nm += 5) t.rw.add(nm, 100 * back(nm));
      if (!white()) { t.rq.add(light().nm, 0); t.rq.add(light().nm, 100 * back(light().nm)); }
    }
    function noteFilm() {
      fresh = false;
      write('table4', [light().name, white() ? '–' : String(light().nm), ctx.values.index.toFixed(2), String(ctx.values.thick), (100 * backNow(ctx.values.thick)).toFixed(2)], () => false);
    }
    function toStartFilm() {
      run3.t = 0;
      for (const [key, value] of [['color', 'green'], ['wave', 530], ['thick', 50], ['index', 1.38]]) if (!ctx.locked.has(key) && ctx.values[key] !== value) ctx.set(key, value);
      moved = true;
    }

    // ---------- handling ----------
    // The top of the film is pulled up or down: it goes a PULL-th as far as the hand, 2 nm a step. The laser is pressed.
    const facing = new T.Plane(new T.Vector3(1, 0, 0), 0);
    function height(r) {   // how high the pointer is, on the upright plane through the film that faces the eye (none from straight above)
      if (Math.abs(r.direction.y) > 0.9) return null;
      facing.normal.set(r.direction.x, 0, r.direction.z).normalize(); facing.constant = 0;
      return r.intersectPlane(facing, hit) ? hit.y : null;
    }
    const filmTool = {
      handles: () => [filmHandle, lampHandle],
      start(grip, r) {
        if (grip.kind === 'laser') { grab = { ...grip }; return true; }
        const y = height(r);
        if (y === null) return false;
        if (ctx.locked.has('thick')) { say('잠금', 0, GLASS + 1.6, 0, 1.2); return false; }
        grab = { ...grip, from: y, thick: ctx.values.thick };
        return true;
      },
      move(r) {
        if (grab.kind === 'laser') return;
        const y = height(r);
        if (y === null) return;
        const to = Math.max(0, Math.min(300, Math.round((grab.thick + (y - grab.from) / SCALE / PULL) / 2) * 2));
        if (to !== ctx.values.thick) ctx.set('thick', to);
        say(to ? `${to} nm` : '막 없음', 0, GLASS + to * SCALE + 0.75, 0);
      },
      end(done) {
        if (done.kind !== 'laser') return;
        const turns = ['green', 'red', 'white'];
        if (lightHeld()) say('잠금', 0, LAMP.y + 1.2, LAMP.z, 1.2); else ctx.set('color', turns[(turns.indexOf(ctx.values.color) + 1) % turns.length]);
      },
    };

    function drawFilm() {
      const v = ctx.values, [r, g, b] = light().rgb, n = v.index, deep = v.thick * SCALE, top = GLASS + deep;
      const inSin = SIN / n, inTan = inSin / Math.sqrt(1 - inSin * inSin), glassSin = SIN / NS, glassTan = glassSin / Math.sqrt(1 - glassSin * glassSin);
      const za = FOOT - deep * SIN / COS, zb = za + deep * inTan, zc = zb + deep * inTan;   // A and C on the top of the film, B on the glass
      lit.color.setRGB(r / 255, g / 255, b / 255, T.SRGBColorSpace); beamInk.color.copy(lit.color); dimInk.color.copy(lit.color);
      slab.visible = v.thick > 0; slab.scale.y = Math.max(deep, 1e-3); slab.position.y = GLASS + deep / 2; filmHandle.position.y = top;
      lay(rods.fall, LAMP.y - 0.62 * COS, LAMP.z + 0.62 * SIN, top, za);
      rods.down.visible = rods.up.visible = v.thick > 0;
      if (v.thick > 0) { lay(rods.down, top, za, GLASS, zb); lay(rods.up, GLASS, zb, top, zc); }
      lay(rods.on, GLASS, zb, 0.02, zb + (GLASS - 0.02) * glassTan);
      // the two that come back: side by side, the one from the glass behind the other by as much of a turn as its way through the film asks
      const long = RUN + SUM, gap = zc - za, model = v.echo && !white();
      const wave = light().nm * SCALE, turn = 2 * Math.PI * run3.t * 530 / light().nm, late = 4 * Math.PI * n * v.thick / light().nm;
      const r1 = (n - 1) / (n + 1), r2 = (NS - n) / (NS + n), high = v.thick > 0 ? [HIGH * r1, HIGH * r2 * (1 - r1 * r1)] : [HIGH * (NS - 1) / (NS + 1), 0];
      // The two that come back are thin lines whatever the light (they are a few hundredths of what falls on the film).
      // White light: the lines, and a dot by the number, have the colour of what comes back: each wavelength as much as
      // comes back of it, the whole as bright as can be drawn so that the colour shows (white where all come back alike).
      let dot = '';
      if (white()) {
        const tint = [0, 1, 2].map((c) => WHITE.reduce((sum, nm) => sum + hue(nm)[c] * back(nm), 0) / WHITE.reduce((sum, nm) => sum + hue(nm)[c], 0)), most = Math.max(...tint);
        dimInk.color.setRGB(tint[0] / most, tint[1] / most, tint[2] / most, T.SRGBColorSpace);
        dot = ` <span style="display:inline-block;width:0.75em;height:0.75em;border-radius:50%;vertical-align:-0.05em;margin-left:0.25em;background:rgb(${tint.map((one) => Math.round(255 * one / most)).join()})"></span>`;
      }
      lay(rods.one, top, za, top + long * COS, za + long * SIN);
      if (v.thick > 0) lay(rods.two, top, zc, top + (long - gap * SIN) * COS, zc + (long - gap * SIN) * SIN);
      rods.two.visible = v.thick > 0;
      echoes.forEach((one, k) => {
        one.mesh.visible = model && !(k === 1 && v.thick === 0);
        if (!one.mesh.visible) return;
        if (one.shade) one.ink.color.setRGB(one.shade * r / 255, one.shade * g / 255, one.shade * b / 255, T.SRGBColorSpace);
        // u: how far along the way back, counted from the front of the wave through A; a bead stands to the side of its line by its swing
        const from = k === 2 ? RUN - 0.4 : k === 1 ? gap * SIN : 0, to = k === 2 ? long : RUN, z0 = k === 2 ? (za + zc) / 2 : k === 1 ? zc - gap * SIN * SIN : za, y0 = k === 1 ? top - gap * SIN * COS : top;
        for (let i = 0; i < BEADS; i++) {
          const u = from + (to - from) * i / (BEADS - 1), fade = Math.min(1, (k === 2 ? u - from : to - u) / (0.5 * wave), (k === 2 ? to - u : Infinity) / (0.5 * wave));
          const swing = fade * (k === 2 ? high[0] * Math.sin(2 * Math.PI * u / wave - turn) + high[1] * Math.sin(2 * Math.PI * u / wave - turn - late) : high[k] * Math.sin(2 * Math.PI * u / wave - turn - k * late));
          one.mesh.setMatrixAt(i, place.makeTranslation(0, y0 + u * COS - swing * SIN, z0 + u * SIN + swing * COS));
        }
        one.mesh.instanceMatrix.needsUpdate = true;
      });
      // the writing
      lampLabel.write(white() ? '<b>백색광</b>' : `${light().name} <b>${light().nm} nm</b>`); lampLabel.show(true);
      backSpot.set(0, top + long * COS + 0.45, (za + zc) / 2 + long * SIN); backLabel.write(`반사율 <b>${(100 * backNow(v.thick)).toFixed(2)} %</b>${dot}`); backLabel.show(true);
      thickSpot.set(0, top + 0.1, tall() ? 2.3 : 3.55); thickLabel.write(v.thick ? `막의 두께 <b>${v.thick} nm</b>` : '막 없음'); thickLabel.show(true);
      glassLabel.write('유리'); glassLabel.show(true);
      listLabel3.show(v.numbers);
      if (v.numbers) {
        const lines = [`투과율 <b>${(100 - 100 * backNow(v.thick)).toFixed(2)} %</b>`];
        if (!white()) {
          const inside = light().nm / n, trips = 2 * v.thick / inside, halves = Math.round(2 * trips);
          lines.push(`막 속 파장 <b>${inside.toFixed(0)} nm</b>`);
          if (v.thick) {
            lines.push(`막 속에서 왕복한 거리 <b>${2 * v.thick} nm</b>`, `= 막 속 파장의 <b>${trips.toFixed(2)}배</b>`);
            if (Math.abs(2 * trips - halves) < 0.015 && halves > 0) lines.push(halves % 2 ? `반파장의 홀수 배(${halves}배) → 상쇄 간섭` : `반파장의 짝수 배(${halves}배) → 보강 간섭`);
          }
          lines.push('가장 덜 반사하는 두께', `= 막 속 파장 ÷ 4 = <b>${quarter().toFixed(0)} nm</b>`);
        }
        listLabel3.write(lines.join('<br>')); if (tall()) listSpot3.set(-5.0, 0, -0.2); else listSpot3.set(0, GLASS + 4.0, FOOT);   // (in the open angle between the light that falls and the light that comes back; on an upright screen, on the bench before the glass)
      }
    }

    const filmScene = {
      rig: rig3, ids: ['color', 'wave', 'thick', 'index'], keep: ['echo'], kept: { echo: false },
      look: [{ target: [0, 3.5, -0.6], r: 15, theta: -1.4, phi: 1.3 }, { target: [0, 3.4, -0.3], r: 23, theta: -1.45, phi: 1.3 }],
      handles: filmTool.handles, start: filmTool.start, move: filmTool.move, end: filmTool.end,
      enter() { rig3.visible = true; run3.t = 0; curves(); fresh = true; since = performance.now(); ctx.setView('left'); },   // (it is seen face on from the left, the others from above)
      leave() { if (rig3.visible) ctx.setView('top'); rig3.visible = false; for (const label of [lampLabel, backLabel, thickLabel, glassLabel, listLabel3]) label.show(false); },
      changed() { curves(); fresh = true; since = performance.now(); },
      play() {},
      tick(t, dt) { run3.t += dt; }, toStart: toStartFilm, draw: drawFilm, note: noteFilm,
      mode() {},
    };

    const SCENES = { wave: waveScene, slit: slitScene, film: filmScene }, scene = () => SCENES[ctx.values.scene];
    const frame = () => view.look(scene().look[tall() ? 1 : 0]);
    view.setTool({
      pick(r) {
        ray.ray.copy(r); scene().rig.updateMatrixWorld(true);
        const found = ray.intersectObjects(scene().handles(), false)[0];
        return found ? found.object.userData.grip : null;
      },
      cursor: (grip) => (!grip ? '' : grip.kind === 'laser' ? 'pointer' : 'grab'),
      start: (grip, r) => scene().start(grip, r),
      move(r) { scene().move(r); moved = true; },
      end() {
        const done = grab;
        grab = null; tip.show(false); tipTime = 0; moved = true; since = performance.now();
        if (done) scene().end(done);
      },
    });
    ctx.on('play', (on) => { playing = on; scene().play(on); moved = true; });
    ctx.on('tick', (t, dt) => {
      if (!dt || stopSoon) return;
      scene().tick(t, dt); moved = true;
    });
    ctx.on('action', (id) => { if (id === 'reset') scene().toStart(); });
    ctx.on('view', () => { moved = true; });   // (some of the writing stands elsewhere when the bench is seen from above)
    ctx.on('change', (id, value) => {
      const at = scene();
      moved = true;
      if (id === 'scene') {   // the other arrangement: its switches as they were left, the clock at nought
        for (const one of Object.values(SCENES)) if (one !== at) one.leave();
        for (const key of at.keep) if (ctx.values[key] !== at.kept[key]) ctx.set(key, at.kept[key]);
        at.enter(); frame(); stopSoon = true; ctx.seek(0); tip.show(false); tipTime = 0;
        return;
      }
      if (at.keep.includes(id)) at.kept[id] = value;
      if (id === 'marks' && isSteady()) marksKept = value;
      if (at.ids.includes(id)) at.changed(id, value);
    });
    // (the frame tells of the class and inquiry buttons as well: only a change between basic and advanced counts here)
    let wasAdvanced = ctx.advanced;
    ctx.on('mode', () => { moved = true; if (ctx.advanced === wasAdvanced) return; wasAdvanced = ctx.advanced; scene().mode(); });

    slitScene.leave(); filmScene.leave();
    return {
      film: () => ({ t: run3.t, back: backNow(ctx.values.thick), quarter: quarter(), back0: back(light().nm, 0), at: (nm, thick, n) => back(nm, thick, n) }),
      slit: () => ({ t: run2.t, far: far(), nm: light().nm, shine: shine(pointAt()), point: pointAt(), waves: lag(pointAt()) / lambda(), fringe: fringe(), here: glare(pointAt()), glare, screen: screen.position.x }),
      state: () => ({ t: run.t, state: run.state, sideA, sideB: sideB(), end: endTime(), spot: ctx.values.spot, a: waveA(ctx.values.spot, run.t), b: waveB(ctx.values.spot, run.t), ends: [total(0, run.t), total(LONG, run.t)],
        shape: Array.from({ length: 33 }, (unused, k) => total(k / 10, run.t)) }),
      update(dt) {
        if (!framed) { framed = true; if (tall()) frame(); }
        if (stopSoon) { stopSoon = false; ctx.setPlaying(false); }
        if (tipTime > 0) { tipTime -= dt; if (tipTime <= 0) { tip.show(false); moved = true; } }
        if (fresh && !grab && performance.now() - since >= 600) scene().note();
        if (!moved) return false;
        moved = false; scene().draw();
        return true;
      },
    };
  },
};
