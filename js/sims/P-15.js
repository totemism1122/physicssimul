// P-15 The refraction of light and lenses (3D).
//
// The refraction of light: a dark disc with a scale of angles lies on the bench, and on it a half-round block of
// glass (or of water) with its flat face along the 90°–90° line, after the textbook's activity. A laser on the disc
// always points at the middle of that face. It is carried round the disc to set the angle of incidence; the light
// goes on into the block bent towards the normal (n1 sin i = n2 sin r) and leaves it through the round face without
// bending, as it meets that face squarely. Part of the light is thrown back at the flat face.
// Advanced: any index from 1.00 to 2.50, and the laser may be carried to the round side: the light then meets the
// flat face from inside the block and leaves it bent away from the normal, or, beyond the critical angle, not at all.
//
// The fronts of the light can be shown as well (a model, with a wavelength far longer than the real one): they are
// closer together in the block, as the light is slower there.
//
// The image a convex lens makes: an object (a plate with a bright letter), a convex lens with a focal length of 10 cm
// and a screen on a rail, after the textbook's experiment, all as large as they are (a unit is 10 cm). The object and
// the screen are carried along the rail; the lens stays. The screen shows the light that falls on it: sharp where it
// stands at the image (1/a + 1/b = 1/f), blurred elsewhere, turned upside down and left to right. The three rays the
// textbook draws from the top of the object, the whole sheet of light the lens takes from that point, the foci and
// the image itself can be shown.
// Advanced: the focal length is set (5 cm to 20 cm), and the lens may be a concave one, which makes no image on a
// screen. The numbers are set out as 1/a + 1/b = 1/f, with b less than nought for an image on the object's side and f
// less than nought for a concave lens.
//
// Prisms and lenses (advanced only): a flat piece of glass on a dark board (a prism, two prisms base to base, a convex
// or a concave lens) and five lines of light, each followed from face to face by the law of refraction alone. It
// shows why a lens brings light to a point, and how far that holds: the lines far from the axis meet nearer the
// lens, and each colour of white light at its own place. The index of the glass and the curve of the faces are set.
//
// What is set by hand can be set from the menu as well, over the same ranges and in the same steps.
const GOLD = '#e3c26b';
const MATTER = { glass: { name: '유리', n: 1.5, tint: 0xbdf0e6 }, water: { name: '물', n: 1.33, tint: 0x8cc4ff } };
const C = 30;   // the speed of light in empty space, in 10 000 km/s
const isLens = (values) => values.glass === 'lens' || values.glass === 'hollow';
const rad = (deg) => deg * Math.PI / 180, deg = (r) => r * 180 / Math.PI;
const onBend = (values) => values.scene === 'bend', onLens = (values) => values.scene === 'lens', onGlass = (values) => values.scene === 'pieces';   // which arrangement an item of a menu belongs to

export default {
  // what is taken for granted, written on screen by the frame
  premise: (v) => (onGlass(v) ? `빛은 각 면에서 굴절 법칙대로 꺾어 그렸고, 면에서 반사하는 빛은 그리지 않았습니다${v.tint === 'white' ? '. 백색광은 적색·녹색·청색 세 빛으로 나눠 그렸습니다' : ''}` : onLens(v) ? '렌즈는 매우 얇다고 보고, 빛이 렌즈의 중심면에서 한 번만 꺾이는 것으로 그립니다' : `공기의 굴절률은 1로 봅니다${v.fronts ? '. 파면(모형)의 파장은 실제보다 훨씬 길게 그렸습니다' : ''}`),
  fixedViews: ['top', 'front'],
  camera: { target: [0.2, 0.2, 0.3], r: 10.5, theta: 0, phi: 0.6, rMax: 30 },   // (the disc a little to the right of the middle of the screen: the menu opens at the left)
  traces: {
    // the sine of the angle of refraction against the sine of the angle of incidence, for the angles tried (not against time):
    // with the block as it is now, and with the other blocks tried. s0: a point that is not seen, so that the axes are drawn whichever of them is empty
    s0: { window: 1, range: 1.1 }, sn: { window: 1, range: 1.1, read: (y) => y.toFixed(3) }, so: { window: 1, range: 1.1, read: (y) => y.toFixed(3) },
    // the lens: how far the screen stood from the lens with a sharp image (cm) against how far the object stood (cm), for the places tried
    ba: { window: 100, range: 30, read: (cm) => `${cm.toFixed(1)} cm` },
    ib: { window: 100, range: 12, read: (y) => `${y.toFixed(2)} /m` },   // (advanced) one over the one against one over the other, both taken in metres
  },
  menus: {
    vars: [
      { id: 'scene', label: '장면 선택', kind: 'choice', value: 'bend', options: [{ id: 'bend', label: '빛의 굴절' }, { id: 'lens', label: '볼록 렌즈에 의한 상' }, { id: 'pieces', label: '프리즘과 렌즈', advanced: true }] },
      { id: 'matter', label: '물질', kind: 'choice', value: 'glass', when: onBend,
        options: [...Object.keys(MATTER).map((id) => ({ id, label: `${MATTER[id].name} (굴절률 ${MATTER[id].n.toFixed(2)})` })), { id: 'custom', label: '굴절률 정하기', advanced: true }] },
      { id: 'index', label: '굴절률(n)', kind: 'slider', min: 1, max: 2.5, step: 0.01, value: 1.5, digits: 2, advanced: true, when: (v) => onBend(v) && v.matter === 'custom' },
      { id: 'way', label: '빛이 나아가는 방향', kind: 'choice', value: 'in', options: [{ id: 'in', label: '공기 → 물질' }, { id: 'out', label: '물질 → 공기' }], advanced: true, when: onBend },
      { id: 'angle', label: '입사각(i)', kind: 'slider', min: 0, max: 85, step: 1, value: 30, unit: '°', when: onBend },
      // the lens
      { id: 'thing', label: '물체', kind: 'choice', value: 'letter', options: [{ id: 'letter', label: '글자 “가”' }, { id: 'mask', label: '회로 무늬(마스크)' }], when: onLens },
      { id: 'kind', label: '렌즈', kind: 'choice', value: 'convex', options: [{ id: 'convex', label: '볼록 렌즈' }, { id: 'concave', label: '오목 렌즈' }], advanced: true, when: onLens },
      { id: 'focal', label: '초점 거리(f)', kind: 'slider', min: 5, max: 20, step: 1, value: 10, unit: ' cm', advanced: true, when: onLens },
      { id: 'near', label: '물체까지의 거리(a)', kind: 'slider', min: 5, max: 40, step: 1, value: 25, unit: ' cm', when: onLens },
      { id: 'screen', label: '스크린까지의 거리', kind: 'slider', min: 5, max: 70, step: 0.1, value: 30, digits: 1, unit: ' cm', when: onLens },
      // prisms and lenses
      { id: 'glass', label: '유리 모양', kind: 'choice', value: 'lens', options: [{ id: 'prism', label: '프리즘' }, { id: 'twin', label: '맞붙인 두 프리즘' }, { id: 'lens', label: '볼록 렌즈' }, { id: 'hollow', label: '오목 렌즈' }], when: onGlass },
      { id: 'gindex', label: '유리의 굴절률(n)', kind: 'slider', min: 1.3, max: 1.9, step: 0.01, value: 1.5, digits: 2, when: onGlass },
      { id: 'curve', label: '곡률 반지름(R)', kind: 'slider', min: 6, max: 20, step: 1, value: 10, unit: ' cm', when: (v) => onGlass(v) && isLens(v) },
      { id: 'gap', label: '광선 사이의 간격', kind: 'slider', min: 0.5, max: 1.8, step: 0.1, value: 0.5, digits: 1, unit: ' cm', when: onGlass },
      { id: 'shift', label: '광원의 위치 (광축에서)', kind: 'slider', min: -2.6, max: 2.6, step: 0.2, value: 0, digits: 1, unit: ' cm', when: (v) => onGlass(v) && !(v.glass === 'lens' && v.source) },
      { id: 'tint', label: '빛', kind: 'choice', value: 'red', options: [{ id: 'red', label: '적색 빛' }, { id: 'white', label: '백색광' }], when: onGlass },
      { id: 'source', label: '초점에 광원 놓기', kind: 'toggle', when: (v) => onGlass(v) && v.glass === 'lens' },
    ],
    graph: [
      { id: 'sines', label: 'sin r–sin i', kind: 'graph', x: 'sin(입사각)', xUnit: ' ', span: [0, 1], when: onBend,
        plots: [{ y: 'sin(굴절각)', dots: true, floor: true, lines: [{ trace: 's0', color: 'rgba(0,0,0,0)' }, { trace: 'so', color: '#9aa7c7', name: '다른 물질' }, { trace: 'sn', color: GOLD, name: '지금 물질' }] }] },
      { id: 'imageFar', label: '상의 거리–물체의 거리', kind: 'graph', x: '물체까지의 거리(a)', xUnit: 'cm', span: [0, 40], plots: [{ y: '상까지의 거리(b)', trace: 'ba', dots: true, floor: true }], when: onLens },
      { id: 'turns', label: '1÷b–1÷a', kind: 'graph', x: '1 ÷ 물체까지의 거리(a)', xUnit: '/m', span: [0, 20], plots: [{ y: '1 ÷ 상까지의 거리(b)', trace: 'ib', dots: true, floor: true }], advanced: true, when: onLens },
    ],
    time: [
      { id: 'reset', label: '처음으로', kind: 'action' },
    ],
    layers: [
      { id: 'mirror', label: '반사 광선', kind: 'toggle', value: true, when: onBend },
      { id: 'marks', label: '입사각과 굴절각', kind: 'toggle', when: onBend },
      { id: 'fronts', label: '파면(모형)', kind: 'toggle', when: onBend },
      { id: 'rays', label: '광선 추적', kind: 'toggle', when: onLens },
      { id: 'bundle', label: '빛다발', kind: 'toggle', when: onLens },
      { id: 'focus', label: '초점과 초점 거리의 2배', kind: 'toggle', when: onLens },
      { id: 'image', label: '상(모형)', kind: 'toggle', when: onLens },
      { id: 'normals', label: '법선과 각', kind: 'toggle', when: onGlass },
      { id: 'numbers', label: '값', kind: 'toggle' },
    ],
    inquiry: [
      { id: 'glassTable', label: '기록 표', kind: 'table', wide: true, rows: 8, when: (v) => onGlass(v) && isLens(v), text: '값을 바꿀 때마다 한 줄씩 적힙니다. 초점은 렌즈 중심에서 잰 거리이고, 렌즈 앞쪽이면 −입니다.',
        columns: [{ label: '렌즈' }, { label: '굴절률<br>(n)' }, { label: '곡률<br>반지름(R)', unit: 'cm' }, { label: '바깥 광선의<br>높이', unit: 'cm' }, { label: '초점<br>(가운데 광선)', unit: 'cm', result: true }, { label: '초점<br>(바깥 광선)', unit: 'cm', result: true }] },
      { id: 'table', label: '기록 표', kind: 'table', wide: true, rows: 8, when: onBend, text: '값을 바꿀 때마다 한 줄씩 적힙니다.',
        columns: [{ label: '물질' }, { label: '빛의<br>방향', advanced: true }, { label: '입사각', unit: '°' }, { label: '굴절각', unit: '°', result: true }, { label: 'sin(입사각)', result: true }, { label: 'sin(굴절각)', result: true }] },
      { id: 'lensTable', label: '기록 표', kind: 'table', wide: true, rows: 8, when: onLens, text: '물체를 옮길 때마다 한 줄씩 적히고, 스크린을 옮기면 그 줄이 바뀝니다.',
        columns: [{ label: '초점<br>거리(f)', unit: 'cm', advanced: true }, { label: '물체까지의<br>거리(a)', unit: 'cm' }, { label: '스크린까지의<br>거리', unit: 'cm' }, { label: '스크린의 상', result: true }, { label: '상의 크기', result: true }] },
    ],
  },

  // writing on the chalkboard (1024 x 400)
  board(g) {
    g.fillStyle = 'rgba(255,255,255,0.9)'; g.font = '56px Georgia, serif'; g.fillText('빛의 굴절과 렌즈', 60, 96);
    g.strokeStyle = 'rgba(255,255,255,0.85)'; g.lineWidth = 4; g.lineJoin = 'round';
    // a ray bent at a surface
    g.beginPath(); g.moveTo(70, 250); g.lineTo(330, 250); g.stroke();
    g.setLineDash([10, 10]); g.beginPath(); g.moveTo(200, 150); g.lineTo(200, 350); g.stroke(); g.setLineDash([]);
    g.beginPath(); g.moveTo(110, 160); g.lineTo(200, 250); g.lineTo(245, 345); g.stroke();
    // a lens that brings three rays to a point
    g.beginPath(); g.ellipse(620, 250, 26, 100, 0, 0, Math.PI * 2); g.stroke();
    for (const y of [-60, 0, 60]) { g.beginPath(); g.moveTo(450, 250 + y); g.lineTo(620, 250 + y); g.lineTo(860, 250 - y * 0.42); g.stroke(); }
  },

  // Builds the apparatus on the bench (world) and returns { update(dt) }.
  create({ T, kit, world, view, ctx }) {
    const { mat, add, box, cyl, canvasTexture } = kit;
    world.userData.things.visible = false;
    const UP = new T.Vector3(0, 1, 0), way = new T.Vector3();
    const M = { dark: mat(0x3a4057), steel: mat(0x9aa1b1, { roughness: 0.5, metalness: 0.5 }) };
    const tipSpot = new T.Vector3(), tip = view.label(tipSpot);   // a word beside what is handled
    let moved = true, tipTime = 0, framed = false, grab = null, fresh = true, since = performance.now();
    function say(text, x, y, z, seconds = 0) { tip.write(text); tipSpot.set(x, y, z); tip.show(true); tipTime = seconds; moved = true; }
    const tall = () => window.matchMedia('(max-aspect-ratio: 4/5)').matches, squat = () => window.matchMedia('(max-aspect-ratio: 3/2)').matches;
    // a line of the table, unless it is the line last written
    function write(table, row) {
      const above = table.rows[table.rows.length - 1];
      if (!above || !above.every((cell, i) => cell === row[i])) table.add(row, false);
    }

    // ====================================== the refraction of light ======================================
    // ---------- the disc, the block and the laser ----------
    // The disc (DISC in radius) lies with its middle at (CX, CZ). The normal is its 0°–0° line, along x; the flat face
    // of the block (RG in radius, GH high) lies along its 90°–90° line, and the block is on the +x side. The laser
    // stands RL from the middle and its light runs RY above the bench. side: +1 with the laser towards the back of
    // the bench (−z), −1 towards the front.
    const CX = 0.9, CZ = 0, DISC = 2.8, RG = 1.35, GH = 0.42, RL = 2.35, RY = 0.24, RIM = 2.62, TOP = 0.062;
    const rig = new T.Group(); rig.position.set(CX, 0, CZ); world.add(rig);
    add(rig, cyl(DISC, DISC, 0.06, 72), mat(0x1d2130), 0, 0.03, 0);
    // the face of the disc: a mark for every degree, a longer one for every five, a number for every ten (0 on the normal, 90 along the flat face)
    const scale = canvasTexture(1024, 1024, (g, w) => {
      const mid = w / 2, px = mid / DISC, R = DISC * px;
      g.fillStyle = '#232838'; g.fillRect(0, 0, w, w);
      g.strokeStyle = 'rgba(240,236,224,0.9)'; g.fillStyle = 'rgba(240,236,224,0.92)'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '26px Georgia, serif';
      for (let a = 0; a < 360; a++) {
        const long = a % 10 === 0 ? 34 : a % 5 === 0 ? 24 : 13, c = Math.cos(rad(a)), s = Math.sin(rad(a));
        g.lineWidth = a % 5 === 0 ? 2.4 : 1.3;
        g.beginPath(); g.moveTo(mid + c * (R - 8), mid + s * (R - 8)); g.lineTo(mid + c * (R - 8 - long), mid + s * (R - 8 - long)); g.stroke();
        if (a % 10 === 0) { const from = a % 180; g.fillText(String(from > 90 ? 180 - from : from), mid + c * (R - 64), mid + s * (R - 64)); }
      }
      g.lineWidth = 2; g.beginPath(); g.moveTo(mid, mid - R + 90); g.lineTo(mid, mid + R - 90); g.stroke();   // the line the flat face lies on
      g.setLineDash([14, 10]); g.beginPath(); g.moveTo(mid - R + 90, mid); g.lineTo(mid + R - 90, mid); g.stroke(); g.setLineDash([]);   // the normal
    });
    add(rig, new T.CircleGeometry(DISC - 0.03, 72).rotateX(-Math.PI / 2), mat(0xffffff, { map: scale, roughness: 0.9 }), 0, TOP, 0, false, true);
    // the block: half a disc of glass, or as much water
    const blockInk = new T.MeshStandardMaterial({ color: MATTER.glass.tint, roughness: 0.25, transparent: true, opacity: 0.5, depthWrite: false });
    { const half = new T.Shape(); half.moveTo(0, -RG); half.absarc(0, 0, RG, -Math.PI / 2, Math.PI / 2, false); half.lineTo(0, -RG);
      const block = add(rig, new T.ExtrudeGeometry(half, { depth: GH, bevelEnabled: false, curveSegments: 48 }).rotateX(-Math.PI / 2), blockInk, 0, TOP + 0.004, 0, false, false); block.renderOrder = 2; }
    // the laser, lying on the disc: it is carried round the middle
    const gun = new T.Group(); rig.add(gun);
    const beamInk = new T.MeshBasicMaterial({ color: 0xff4136, transparent: true, opacity: 0.95, depthWrite: false });
    const passInk = beamInk.clone(), backInk = beamInk.clone();
    add(gun, cyl(0.16, 0.16, 0.9, 20).rotateZ(Math.PI / 2), M.dark, -RL, RY, 0); add(gun, cyl(0.09, 0.09, 0.04, 16).rotateZ(Math.PI / 2), new T.MeshBasicMaterial({ color: 0xff4136 }), -RL + 0.46, RY, 0, false, false);
    add(gun, box(0.5, 0.1, 0.5), M.steel, -RL, 0.11, 0);
    const gunHandle = add(gun, box(1.5, 0.9, 1.1), M.dark, -RL, 0.4, 0, false, false); gunHandle.visible = false; gunHandle.userData.grip = { kind: 'laser' };
    // the light as lines: to the flat face, on from it, and back from it
    const rod = (ink) => { const mesh = add(rig, cyl(0.024, 0.024, 1, 8), ink, 0, 0, 0, false, false); mesh.renderOrder = 4; return mesh; };
    const rods = { fall: rod(beamInk), pass: rod(passInk), back: rod(backInk) };
    function lay(mesh, x0, z0, x1, z1) {   // a line from one point of the disc to another, at the height of the light
      const long = Math.hypot(x1 - x0, z1 - z0);
      mesh.position.set((x0 + x1) / 2, RY, (z0 + z1) / 2); mesh.quaternion.setFromUnitVectors(UP, way.set((x1 - x0) / long, 0, (z1 - z0) / long)); mesh.scale.y = long;
    }
    // the angles: a gold sector between the normal and each line of light (the angles of incidence, refraction and reflection)
    const sectors = [0.55, 0.42, 0.3].map((opacity) => {
      const mesh = add(rig, new T.CircleGeometry(1, 8), new T.MeshBasicMaterial({ color: 0xe3c26b, transparent: true, opacity, depthWrite: false }), 0, TOP + 0.012, 0, false, false);
      mesh.renderOrder = 1; mesh.visible = false; return mesh;
    });
    // (from: the angle of the normal there, counted from +x towards the back; turn: the angle from it to the line, with its sign)
    function sector(mesh, on, from, turn, radius) {
      mesh.visible = on && Math.abs(turn) > 1e-3;
      if (!mesh.visible) return;
      mesh.geometry.dispose(); mesh.geometry = new T.CircleGeometry(radius, 32, from + Math.min(0, turn), Math.abs(turn)).rotateX(-Math.PI / 2);
    }
    // the fronts of the light (a model): bright lines across the beam on a plate just above the disc. Before the flat
    // face they are WAVE apart in air; in the block they are closer by its index, and they meet along the face.
    const WAVE = 0.42, BEAM = 0.34;
    const plateInk = new T.ShaderMaterial({
      transparent: true, depthWrite: false,
      uniforms: { uIn: { value: new T.Vector2(1, 0) }, uOn: { value: new T.Vector2(1, 0) }, uK: { value: new T.Vector2(1, 1) }, uHalf: { value: new T.Vector2(0.3, 0.3) }, uPhase: { value: 0 }, uPass: { value: 1 }, uInside: { value: 0 } },
      vertexShader: 'varying vec2 at; void main() { at = position.xz; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
      fragmentShader: 'uniform vec2 uIn; uniform vec2 uOn; uniform vec2 uK; uniform vec2 uHalf; uniform float uPhase; uniform float uPass; uniform float uInside; varying vec2 at;\n'
        + 'void main() { float far = length(at); float high = -1.0;\n'
        + `  if (far > ${(DISC - 0.5).toFixed(2)}) discard;\n`
        + '  if (at.x * uIn.x < 0.0) {\n'   // before the flat face (uInside: the light comes through the block)
        + `    if (abs(at.x * uIn.y - at.y * uIn.x) < uHalf.x && (uInside < 0.5 || far < ${RG.toFixed(2)})) high = 0.5 + 0.5 * sin(uK.x * dot(at, uIn) - uPhase);\n`
        + '  } else if (uPass > 0.5) {\n'
        + `    if (abs(at.x * uOn.y - at.y * uOn.x) < uHalf.y && (uInside > 0.5 || far < ${RG.toFixed(2)})) high = 0.5 + 0.5 * sin(uK.y * dot(at, uOn) - uPhase);\n`
        + '  }\n'
        + '  if (high < 0.0) discard;\n'
        + '  gl_FragColor = vec4(mix(vec3(0.16, 0.07, 0.08), vec3(1.0, 0.36, 0.3), high * high), 0.92); }',
    });
    const plate = add(rig, new T.PlaneGeometry(2 * DISC, 2 * DISC).rotateX(-Math.PI / 2), plateInk, 0, TOP + 0.008, 0, false, false); plate.renderOrder = 1; plate.visible = false;
    // the writing
    const spots = { angle: new T.Vector3(), bend: new T.Vector3(), back: new T.Vector3(), matter: new T.Vector3(), air: new T.Vector3(), list: new T.Vector3() };
    const labels = { angle: view.label(spots.angle), bend: view.label(spots.bend), back: view.label(spots.back), matter: view.label(spots.matter), air: view.label(spots.air), list: view.label(spots.list, true) };

    // ---------- physics ----------
    // run.t: the time the model's fronts have run. tried: the angles tried with each block, each with the sines of its two angles
    // (for the way the light goes now; a block is known by its index).
    const run = { t: 0 }, tried = { out: false, at: new Map() };
    let side = 1;
    const index = () => (ctx.values.matter === 'custom' ? (ctx.advanced ? ctx.values.index : MATTER.glass.n) : MATTER[ctx.values.matter].n);
    const outward = () => ctx.advanced && ctx.values.way === 'out';   // the light meets the flat face from inside the block
    const named = () => (ctx.values.matter === 'custom' ? `굴절률 ${index().toFixed(2)}` : MATTER[ctx.values.matter].name);
    // The light as it is now. i, r: the angles of incidence and refraction (r: null when none of the light goes on);
    // back: the part of the light thrown back at the face (of its energy, for light that is not polarised)
    function bend() {
      const n = index(), out = outward(), n1 = out ? n : 1, n2 = out ? 1 : n, i = rad(ctx.values.angle), sinI = Math.sin(i), sinR = n1 * sinI / n2;
      const limit = out && n > 1 ? Math.asin(1 / n) : null;   // the critical angle
      if (sinR >= 1) return { n, out, i, sinI, r: null, sinR: null, back: 1, limit };
      const r = Math.asin(sinR), ci = Math.cos(i), cr = Math.cos(r);
      const rs = ((n1 * ci - n2 * cr) / (n1 * ci + n2 * cr)) ** 2, rp = ((n1 * cr - n2 * ci) / (n1 * cr + n2 * ci)) ** 2;
      return { n, out, i, sinI, r, sinR, back: (rs + rp) / 2, limit };
    }
    const wayName = () => (outward() ? `${named()} → 공기` : `공기 → ${named()}`);
    function note() {
      fresh = false;
      const now = bend(), v = ctx.values;
      write(ctx.tables.table, [named(), outward() ? '물질 → 공기' : '공기 → 물질', String(v.angle), now.r === null ? '전반사' : deg(now.r).toFixed(1), now.sinI.toFixed(3), now.r === null ? '–' : now.sinR.toFixed(3)]);
      if (now.out !== tried.out) { tried.out = now.out; tried.at.clear(); }
      const key = now.n.toFixed(2);
      if (!tried.at.has(key)) tried.at.set(key, new Map());
      if (now.r !== null) tried.at.get(key).set(v.angle, [now.sinI, now.sinR]);
      ctx.traces.sn.clear(); ctx.traces.so.clear();
      for (const [one, at] of tried.at) for (const [, [x, y]] of [...at].sort((a, b) => a[0] - b[0])) ctx.traces[one === key ? 'sn' : 'so'].add(x, y);
    }
    function toStart() {
      run.t = 0; side = 1;
      for (const [key, value] of [['matter', 'glass'], ['index', 1.5], ['way', 'in'], ['angle', 30]]) if (!ctx.locked.has(key) && ctx.values[key] !== value) ctx.set(key, value);
      moved = true;
    }

    // ---------- handling ----------
    // The laser is carried round the middle of the disc: where the pointer is, seen from the middle, sets the angle
    // (1° a step) and the side of the normal. In the advanced mode it may be carried over to the round side of the block.
    const ray = new T.Raycaster(), level = new T.Plane(new T.Vector3(0, 1, 0), -RY), hit = new T.Vector3();
    const tool = {
      handles: () => [gunHandle],
      start(grip, r) {
        if (!r.intersectPlane(level, hit)) return false;
        if (ctx.locked.has('angle')) { say('잠금', hit.x, 1.0, hit.z, 1.2); return false; }
        grab = { ...grip };
        return true;
      },
      move(r) {
        if (!r.intersectPlane(level, hit)) return;
        let dx = hit.x - CX; const dz = hit.z - CZ;
        if (Math.hypot(dx, dz) < 0.5) return;   // (too near the middle to tell the angle)
        const over = dx > 0;
        if (over !== outward()) { if (ctx.advanced && !ctx.locked.has('way')) ctx.set('way', over ? 'out' : 'in'); else dx = 0; }
        if (Math.abs(dz) > 0.03) side = dz < 0 ? 1 : -1;
        const to = Math.max(0, Math.min(85, Math.round(deg(Math.atan2(Math.abs(dz), Math.abs(dx))))));
        if (to !== ctx.values.angle) ctx.set('angle', to);
      },
      end() {},
    };

    function draw() {
      const v = ctx.values, now = bend(), sx = now.out ? 1 : -1;   // sx: the side of the flat face the laser is on
      const ux = sx * Math.cos(now.i), uz = -side * Math.sin(now.i);   // from the middle towards the laser
      blockInk.color.setHex(v.matter === 'custom' ? 0xc9c2e8 : MATTER[v.matter].tint);
      gun.rotation.y = Math.atan2(uz, -ux);
      lay(rods.fall, ux * (RL - 0.48), uz * (RL - 0.48), 0, 0);
      // on from the face: bent as the two indices ask; back from it: at the same angle on the other side of the normal. Each as bright as its share of the light
      rods.pass.visible = now.r !== null; rods.back.visible = v.mirror || now.r === null;
      const px = now.r === null ? 0 : -sx * Math.cos(now.r), pz = now.r === null ? 0 : side * Math.sin(now.r), bx = ux, bz = -uz;
      if (rods.pass.visible) { lay(rods.pass, 0, 0, px * RIM, pz * RIM); passInk.opacity = 0.12 + 0.83 * Math.sqrt(1 - now.back); }
      if (rods.back.visible) { lay(rods.back, 0, 0, bx * RIM, bz * RIM); backInk.opacity = 0.12 + 0.83 * Math.sqrt(now.back); }
      // the angles
      const from = sx > 0 ? 0 : Math.PI, turn = sx * side * now.i;
      sector(sectors[0], v.marks, from, turn, 1.15);
      sector(sectors[1], v.marks && now.r !== null, Math.PI - from, sx * side * (now.r || 0), 1.15);
      sector(sectors[2], v.marks && rods.back.visible, from, -turn, 0.85);
      // the fronts
      plate.visible = v.fronts;
      if (v.fronts) {
        const u = plateInk.uniforms, k = 2 * Math.PI / WAVE, half = Math.min(BEAM, 0.95 * RG * Math.cos(now.i));   // (no wider than the flat face can take)
        u.uIn.value.set(-ux, -uz); u.uOn.value.set(px, pz); u.uK.value.set(k * (now.out ? now.n : 1), k * (now.out ? 1 : now.n));
        u.uHalf.value.set(half, now.r === null ? 0 : half * Math.cos(now.r) / Math.cos(now.i)); u.uPass.value = now.r === null ? 0 : 1; u.uInside.value = now.out ? 1 : 0; u.uPhase.value = 2 * Math.PI * run.t;
      }
      // the writing
      spots.angle.set(CX + ux * (RL + 0.75), 0.45, CZ + uz * (RL + 0.75)); labels.angle.write(`입사각(i) <b>${v.angle}°</b>`); labels.angle.show(true);
      labels.bend.show(now.r === null || v.marks);
      if (now.r === null) { spots.bend.set(CX + bx * (RIM + 0.35), 0.3, CZ + bz * (RIM + 0.35)); labels.bend.write('<b>전반사</b>'); }
      else if (v.marks) { spots.bend.set(CX + px * (RIM + 0.35), 0.3, CZ + pz * (RIM + 0.35)); labels.bend.write(`굴절각(r) <b>${deg(now.r).toFixed(1)}°</b>`); }
      labels.back.show(v.marks && v.mirror && now.r !== null && v.angle >= 8);
      if (v.marks) { spots.back.set(CX + bx * (RIM + 0.35), 0.3, CZ + bz * (RIM + 0.35)); labels.back.write(`반사각 <b>${v.angle}°</b>`); }
      spots.matter.set(CX + 2.45, 0.1, CZ + 2.55); labels.matter.write(named()); labels.matter.show(true);   // (off the disc at its front corners, clear of the writing at the ends of the lines of light)
      spots.air.set(CX - 2.45, 0.1, CZ + 2.55); labels.air.write('공기'); labels.air.show(true);
      labels.list.show(v.numbers);
      if (v.numbers) {
        const lines = [`sin(입사각) <b>${now.sinI.toFixed(3)}</b>`];
        if (now.r !== null) lines.push(`sin(굴절각) <b>${now.sinR.toFixed(3)}</b>`, `sin(입사각) ÷ sin(굴절각) = <b>${now.sinI > 1e-9 ? (now.sinI / now.sinR).toFixed(2) : '–'}</b>`);
        lines.push(`${named()} 속 빛의 속력(v)`, `= ${C}만 km/s ÷ ${now.n.toFixed(2)} = <b>${(C / now.n).toFixed(1)}만 km/s</b>`);
        if (now.limit !== null) {
          lines.push(`sin(임계각) = 1 ÷ 굴절률(n) = <b>${(1 / now.n).toFixed(3)}</b>`, `임계각 <b>${deg(now.limit).toFixed(1)}°</b>`);
          if (now.r === null) lines.push('입사각이 임계각보다 큼 → <b>전반사</b>');
        }
        labels.list.write(lines.join('<br>'));
        if (tall()) spots.list.set(CX, 0, CZ + DISC + 2.4); else if (squat()) spots.list.set(CX - DISC - 0.9, 0, CZ + 2.9); else spots.list.set(CX + DISC + 1.75, 0, CZ + 1.0);   // (beside the disc where there is room: at its right on a wide screen, before its left on a squarer one)
      }
    }

    const bendScene = {
      rig, ids: ['matter', 'index', 'way', 'angle'], keep: ['mirror', 'marks', 'fronts'], kept: { mirror: true, marks: false, fronts: false },
      look: [{ target: [0.2, 0.2, 0.3], r: 10.5, theta: 0, phi: 0.6 }, { target: [CX - 0.25, 0.2, 1.2], r: 18.5, theta: 0, phi: 0.5 }],
      handles: tool.handles, start: tool.start, move: tool.move, end: tool.end,
      enter() { rig.visible = true; ctx.setView('top'); },
      leave() { rig.visible = false; for (const label of Object.values(labels)) label.show(false); },
      changed() { fresh = true; since = performance.now(); },
      play() {},
      tick(t, dt) { run.t += dt; }, toStart, draw, note,
      mode() { fresh = true; since = performance.now(); },   // the index set by hand and the way out of the block count in the advanced mode only
    };

    // ====================================== the image a convex lens makes ======================================
    // ---------- the rail, the object, the lens and the screen ----------
    // One unit is 10 cm here, as it is (CM units to a cm). The rail runs along x; the lens (LENS in radius, its focal
    // length F cm) stands at XL with its axis AY above the bench. The object is to its left: a thin plate with a bright
    // letter that shows on both its sides (it reads as written for someone who looks along the light, from behind
    // it); the letter reaches TIP above the axis and as far below it. The screen is to the right, its face (FACE2
    // across) towards the lens. Both are carried along the rail; the lens stays.
    // Heights on the axis' upright plane (z = 0) are counted from the axis.
    const CM = 0.1, XL = -1.5, AY = 1.85, F = 10, LENS = 0.5, TIP = 0.4, PLATE = 1.1, FACE2 = 3.0, REACH = 1.5, EDGE = 1.7, WALL = -18.5;   // (WALL: an image that is only seen through the lens is drawn as far to the left as this, short of the cupboards along the wall of the room)
    const SHINE = '#ffe9b0', GLOW = [255, 233, 176], PAPER = [118, 121, 130], BRIGHT = 15;   // the light of the object; the paper of the screen in the light of the room; how far off (cm) the screen shows that light at its full strength
    const rig2 = new T.Group(); world.add(rig2);
    add(rig2, box(12.6, 0.12, 0.5), M.steel, 0, 0.06, 0);
    // a dark board behind the rail, against which the lines of light show
    add(rig2, box(12.6, 3.7, 0.08), mat(0x565c78, { roughness: 0.9 }), 0, 1.95, -1.9); for (const x of [-5.6, 5.6]) add(rig2, box(0.5, 0.2, 0.9), M.dark, x, 0.1, -1.9);
    // a rule on the bench before the rail: a mark for every cm, counted from the lens to either side
    add(rig2, new T.PlaneGeometry(12.4, 0.42).rotateX(-Math.PI / 2), mat(0xffffff, { roughness: 0.9, map: canvasTexture(2480, 84, (g, w, h) => {
      g.fillStyle = '#ece6d6'; g.fillRect(0, 0, w, h); g.strokeStyle = g.fillStyle = '#2b2f3c'; g.textAlign = 'center'; g.font = '30px Georgia, serif';
      for (let cm = -47; cm <= 77; cm++) {
        const x = (XL + cm * CM + 6.2) * 200;
        g.lineWidth = cm % 5 === 0 ? 3 : 1.6; g.beginPath(); g.moveTo(x, 0); g.lineTo(x, cm % 10 === 0 ? 34 : cm % 5 === 0 ? 26 : 16); g.stroke();
        if (cm % 10 === 0) g.fillText(String(Math.abs(cm)), x, 70);
      }
    }) }), 0, 0.012, 0.6, false, true);
    const stand = (group, high) => { add(group, box(0.5, 0.18, 0.7), M.dark, 0, 0.21, 0); add(group, cyl(0.04, 0.04, high - 0.3, 10), M.steel, 0, (high + 0.3) / 2, 0); };
    // the lens in its ring: a convex one or (advanced) a concave one, the more curved the shorter its focal length
    const glasses = {};
    { const lens = new T.Group(); lens.position.x = XL; rig2.add(lens); stand(lens, AY - LENS - 0.04);
      const deep = 0.12, round = (LENS * LENS + deep * deep) / (2 * deep), edge = [];
      for (let k = 0; k <= 16; k++) { const t = -deep + 2 * deep * k / 16; edge.push(new T.Vector2(Math.sqrt(Math.max(0, round * round - (round - deep + Math.abs(t)) ** 2)), t)); }
      const hollow = [], dip = (r) => 0.03 + round - Math.sqrt(round * round - r * r);   // (a concave lens: thin at its middle, thicker towards its rim)
      for (let k = 0; k <= 12; k++) hollow.push(new T.Vector2(LENS * k / 12, -dip(LENS * k / 12)));
      for (let k = 12; k >= 0; k--) hollow.push(new T.Vector2(LENS * k / 12, dip(LENS * k / 12)));
      const ink = new T.MeshStandardMaterial({ color: 0xbfe6f2, roughness: 0.15, transparent: true, opacity: 0.55, depthWrite: false });
      for (const [name, outline] of [['convex', edge], ['concave', hollow]]) { glasses[name] = add(lens, new T.LatheGeometry(outline, 40).rotateZ(Math.PI / 2), ink, 0, AY, 0, false, false); glasses[name].renderOrder = 3; }
      add(lens, new T.TorusGeometry(LENS + 0.035, 0.035, 10, 40).rotateY(Math.PI / 2), M.steel, 0, AY, 0); }
    // the object: its picture is drawn on a sheet that is clear but for the bright lines, and shows on both faces of the plate
    const sheet = canvasTexture(256, 256, () => {}), sheetPen = sheet.image.getContext('2d');
    const thing = new T.Group(); rig2.add(thing); stand(thing, AY - PLATE / 2 - 0.05);
    add(thing, box(0.05, PLATE + 0.1, PLATE + 0.1), mat(0x171a23), 0, AY, 0);
    { const ink = new T.MeshBasicMaterial({ map: sheet, transparent: true, side: T.DoubleSide, toneMapped: false, depthWrite: false });
      for (const x of [-0.027, 0.027]) add(thing, new T.PlaneGeometry(PLATE, PLATE).rotateY(-Math.PI / 2), ink, x, AY, 0, false, false); }
    const thingHandle = add(thing, box(0.7, AY + 0.7, PLATE + 0.3), M.dark, 0, (AY + 0.7) / 2, 0, false, false); thingHandle.visible = false; thingHandle.userData.grip = { kind: 'thing' };
    // the screen: a board whose face is a picture of the light that falls on it
    const screen = new T.Group(); rig2.add(screen); stand(screen, 0.36);
    const face = canvasTexture(448, 448, () => {}), pen = face.image.getContext('2d'), blur = document.createElement('canvas'), blurPen = blur.getContext('2d');
    const soft = document.createElement('canvas'); soft.width = soft.height = 448;
    const softPen = soft.getContext('2d', { willReadFrequently: true }), glare = pen.createImageData(448, 448);
    const toLight = (byte) => (byte / 255) ** 2.2, toByte = (light) => Math.round(255 * Math.min(1, light) ** (1 / 2.2));   // (the numbers of a picture are not light itself: light is added as light)
    add(screen, box(0.08, FACE2 + 0.1, FACE2 + 0.1), mat(0xd9d4c8), 0.045, AY, 0);
    add(screen, new T.PlaneGeometry(FACE2, FACE2).rotateY(-Math.PI / 2), new T.MeshBasicMaterial({ map: face, toneMapped: false }), -0.002, AY, 0, false, false);
    const screenHandle = add(screen, box(0.6, AY + 1.6, FACE2 + 0.2), M.dark, 0, (AY + 1.6) / 2, 0, false, false); screenHandle.visible = false; screenHandle.userData.grip = { kind: 'screen' };
    // lines of dashes: a rod with a picture of one dash and one gap, repeated along it
    const dash = canvasTexture(4, 32, (g) => { g.fillStyle = '#fff'; g.fillRect(0, 0, 4, 18); });
    function dashed(color, radius) {
      const map = dash.clone(); map.wrapT = T.RepeatWrapping; map.needsUpdate = true;
      const mesh = add(rig2, cyl(radius, radius, 1, 6), new T.MeshBasicMaterial({ color, map, alphaTest: 0.5 }), 0, 0, 0, false, false); mesh.userData.map = map; return mesh;
    }
    function lay2(mesh, x0, y0, x1, y1) {   // a line in the upright plane of the axis, from one point to another
      const long = Math.hypot(x1 - x0, y1 - y0);
      if (long < 1e-6) { mesh.visible = false; return; }
      mesh.position.set((x0 + x1) / 2, AY + (y0 + y1) / 2, 0); mesh.quaternion.setFromUnitVectors(UP, way.set((x1 - x0) / long, (y1 - y0) / long, 0)); mesh.scale.y = long;
      if (mesh.userData.map) mesh.userData.map.repeat.set(1, long / 0.24);
    }
    const axis = dashed(0x3a4057, 0.01), middle = dashed(0x3a4057, 0.012);   // the axis, and the middle plane of the lens, at which the lines of light are bent
    lay2(axis, -6.3, 0, 6.3, 0); lay2(middle, XL, -REACH, XL, REACH);
    // the three rays from the top of the object, as the textbook draws them: (1) along the axis, then through the far
    // focus; (2) through the near focus, then along the axis; (3) through the middle of the lens, straight on
    const rays = [0x2f6fd6, 0x2e9a4b, 0xd9483b].map((color, k) => {
      const ink = new T.MeshBasicMaterial({ color }), rod2 = () => add(rig2, cyl(0.02, 0.02, 1, 8), ink, 0, 0, 0, false, false), spot = new T.Vector3();
      return { fall: rod2(), on: rod2(), back: dashed(color, 0.014), spot, tag: view.label(spot, false, k === 1 ? -0.03 : 0) };
    });
    const aim = dashed(0x2e9a4b, 0.014);   // (a concave lens: where ray 2 was making for, the focus beyond the lens)
    // all the light from that point that the lens takes, as a sheet in the same plane (it holds the three rays)
    const sheaf = new T.Mesh(new T.BufferGeometry(), new T.MeshBasicMaterial({ color: 0xf2b34a, transparent: true, opacity: 0.3, side: T.DoubleSide, depthWrite: false }));
    sheaf.geometry.setAttribute('position', new T.BufferAttribute(new Float32Array(27), 3)); sheaf.frustumCulled = false; sheaf.renderOrder = 2; rig2.add(sheaf);
    // the foci and the points twice as far from the lens; the image as it would stand (a model): the picture of the object, and an arrow for each
    // (each named above it, the nearer two lower than the farther two, with a line of dashes up to the name)
    const dots2 = [-2, -1, 1, 2].map((n) => {
      const high = Math.abs(n) === 1 ? 0.95 : 1.36, spot = new T.Vector3();
      return { mesh: add(rig2, new T.SphereGeometry(0.055, 14, 10), kit.glow(0xe3a93b), 0, AY, 0, false, false), line: dashed(0xb9853a, 0.008), spot, label: view.label(spot), n, high };
    });
    const ghost = add(rig2, new T.PlaneGeometry(PLATE, PLATE).rotateY(-Math.PI / 2), new T.MeshBasicMaterial({ map: sheet, transparent: true, opacity: 0.55, side: T.DoubleSide, toneMapped: false, depthWrite: false, color: 0xffd27a }), 0, AY, 0, false, false); ghost.renderOrder = 5;
    const arrows = [0xe3a93b, 0xb9853a].map((color) => { const arrow = kit.arrow(color, 0.022); arrow.visible = false; rig2.add(arrow); return arrow; });
    function point(arrow, x, tall2) {   // an arrow from the axis at x, up (or down) to the height tall2
      const long = Math.abs(tall2), small = Math.min(1, long / 0.22);
      arrow.visible = long > 1e-3; arrow.position.set(x, AY, 0); arrow.aim(way.set(0, Math.sign(tall2) || 1, 0)); arrow.scale.setScalar(small); arrow.setLength(long / small);
    }
    const spots2 = { lens: new T.Vector3(XL, 0.15, 2.1), near: new T.Vector3(), far: new T.Vector3(), ghost: new T.Vector3(), key: new T.Vector3(), list: new T.Vector3() };
    const labels2 = { lens: view.label(spots2.lens), near: view.label(spots2.near), far: view.label(spots2.far), ghost: view.label(spots2.ghost, false, -0.01), key: view.label(spots2.key, true), list: view.label(spots2.list, true) };

    // ---------- physics ----------
    // a: from the object to the lens, s: from the lens to the screen, b: from the lens to the image (all cm).
    // 1/a + 1/b = 1/f: b is negative for an image on the object's side (one that is only seen through the lens),
    // and there is none where the object stands at the focus. found: where the screen stood with a sharp image, for each a tried.
    // (found.f: the focal length they were found with)
    const found = { f: F, at: new Map() };
    const lensNow = () => (ctx.advanced ? (ctx.values.kind === 'concave' ? -1 : 1) * ctx.values.focal : F);   // the focal length in use (cm), less than nought for a concave lens; the textbook's lens in the basic mode
    function image() {
      const a = ctx.values.near, s = ctx.values.screen, f = lensNow(), turn = 1 / f - 1 / a, b = Math.abs(turn) < 1e-9 ? Infinity : 1 / turn;
      return { a, s, f, b, real: b > 0 && b !== Infinity, size: b === Infinity ? Infinity : Math.abs(b) / a, sharp: b > 0 && Math.abs(s - b) < 0.051 };
    }
    // the picture of the object: its lines reach TIP above and below the middle
    function paintThing() {
      const g = sheetPen, w = 256, tall2 = 2 * TIP / PLATE * w;
      g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, w, w); g.fillStyle = g.strokeStyle = SHINE;
      if (ctx.values.thing === 'mask') {   // a pattern of tracks, as on the mask for a circuit: unlike from side to side and from top to bottom
        const u = tall2 / 10; g.translate(w / 2 - 5 * u, w / 2 - 5 * u); g.lineWidth = 0.55 * u; g.lineJoin = 'miter';
        g.strokeRect(0.6 * u, 0.3 * u, 3.6 * u, 3 * u); g.fillRect(1.5 * u, 1.1 * u, 1.8 * u, 1.4 * u);
        g.beginPath(); g.moveTo(4.2 * u, 1 * u); g.lineTo(6.5 * u, 1 * u); g.lineTo(6.5 * u, 4.5 * u); g.lineTo(9.6 * u, 4.5 * u);
        g.moveTo(4.2 * u, 2.4 * u); g.lineTo(5.3 * u, 2.4 * u); g.lineTo(5.3 * u, 7 * u); g.lineTo(2 * u, 7 * u); g.lineTo(2 * u, 9.7 * u);
        g.moveTo(2.4 * u, 3.3 * u); g.lineTo(2.4 * u, 5.4 * u); g.lineTo(0.3 * u, 5.4 * u);
        g.moveTo(7.8 * u, 0.3 * u); g.lineTo(7.8 * u, 2.6 * u); g.lineTo(9.7 * u, 2.6 * u); g.stroke();
        for (const [x, y] of [[9.3, 6.4], [9.3, 8], [9.3, 9.4], [7.6, 9.4], [5.9, 9.4]]) { g.beginPath(); g.arc(x * u, y * u, 0.5 * u, 0, Math.PI * 2); g.fill(); }
        g.fillRect(6.9 * u, 6 * u, 1.3 * u, 2.2 * u);
      } else {
        g.font = '700 200px "Noto Serif KR", serif'; g.textAlign = 'left'; g.textBaseline = 'alphabetic';
        const m = g.measureText('가'), k = tall2 / (m.actualBoundingBoxAscent + m.actualBoundingBoxDescent);
        g.translate(w / 2, w / 2); g.scale(k, k); g.fillText('가', (m.actualBoundingBoxLeft - m.actualBoundingBoxRight) / 2, (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2);
      }
      sheet.needsUpdate = true;
    }
    // The light on the screen. Each point of the object lights a round patch: its middle is where the line through the
    // middle of the lens meets the screen (the picture turned half round, s/a its size), and it is as wide as the
    // light from the whole lens is there: nothing where the screen stands at the image, wider the farther it is from
    // it. The patches are added up from copies of the picture set round a circle, on a smaller sheet where they are wide.
    // The light of each point is shared out over its patch, so a blurred picture is as much fainter as it is wider.
    function paintScreen() {
      const { a, s, f } = image(), w = 448, unit = w / FACE2, size = (s / a) * PLATE * unit / 256, wide = LENS * Math.abs(1 - s * (1 / f - 1 / a)) * unit;
      const less = wide > 10 ? 10 / wide : 1, small = Math.max(16, Math.round(w * less)), q = small / w, rings = wide * q < 0.5 ? 0 : Math.min(4, Math.ceil(wide * q / 2.4));
      blur.width = blur.height = small; blurPen.globalCompositeOperation = 'lighter'; blurPen.globalAlpha = 1 / (1 + 3 * rings * (rings + 1));
      for (let ring = 0; ring <= rings; ring++) for (let n = 0; n < Math.max(1, 6 * ring); n++) {
        const far = rings ? wide * q * 0.95 * ring / rings : 0, at = 2 * Math.PI * (n + 0.5 * ring) / Math.max(1, 6 * ring);
        blurPen.setTransform(-size * q, 0, 0, -size * q, small / 2 + far * Math.cos(at), small / 2 + far * Math.sin(at)); blurPen.drawImage(sheet.image, -128, -128);
      }
      // How strong: all the light the lens takes from the object falls on a picture whose area grows as s², so the
      // screen is lit as 1/s² (in full at BRIGHT cm). It is added to the light of the room that the paper throws back.
      const strong = (BRIGHT / s) ** 2, shades = PAPER.map((byte, c) => { const table = new Uint8ClampedArray(256); for (let n = 0; n < 256; n++) table[n] = toByte(toLight(byte) + strong * (n / 255) * toLight(GLOW[c])); return table; });
      softPen.clearRect(0, 0, w, w); softPen.drawImage(blur, 0, 0, small, small, 0, 0, w, w);
      const part = softPen.getImageData(0, 0, w, w).data, data = glare.data;   // (how much of the light each dot of the screen gets: kept in how opaque the sheet is there)
      for (let i = 0; i < data.length; i += 4) { const n = part[i + 3]; data[i] = shades[0][n]; data[i + 1] = shades[1][n]; data[i + 2] = shades[2][n]; data[i + 3] = 255; }
      pen.putImageData(glare, 0, 0); face.needsUpdate = true;
    }
    function noteLens() {
      fresh = false;
      const now = image(), table = ctx.tables.lensTable, above = table.rows[table.rows.length - 1];
      const row = [String(now.f).replace('-', '−'), String(now.a), now.s.toFixed(1), now.sharp ? '또렷함' : now.real ? '흐림' : '맺히지 않음', now.sharp ? `물체의 ${now.size.toFixed(2)}배` : '–'];
      if (!above || !above.every((cell, i) => cell === row[i])) table.add(row, Boolean(above) && above[0] === row[0] && above[1] === row[1]);   // (one line for each place of the object: moving the screen writes it anew)
      if (found.f !== now.f) { found.f = now.f; found.at.clear(); }   // (another lens: its own points)
      if (now.sharp) found.at.set(now.a, now.s);
      ctx.traces.ba.clear(); ctx.traces.ib.clear();
      const points = [...found.at].sort((p, q) => p[0] - q[0]);
      for (const [x, y] of points) ctx.traces.ba.add(x, y);
      for (const [x, y] of points.reverse()) ctx.traces.ib.add(100 / x, 100 / y);
    }
    function toStartLens() {
      for (const [key, value] of [['thing', 'letter'], ['kind', 'convex'], ['focal', 10], ['near', 25], ['screen', 30]]) if (!ctx.locked.has(key) && ctx.values[key] !== value) ctx.set(key, value);
      moved = true;
    }

    // ---------- handling ----------
    // The object and the screen are carried along the rail: the object 1 cm a step, the screen 0.1 cm a step. Within
    // a quarter of a cm of the image the screen is taken to stand at it.
    // How far along the rail the pointer is: the point nearest the line of sight, on the line along the rail through
    // the place at which the thing was taken. (One rule for every line of sight: with a level plane for some and an
    // upright one for others, the thing leapt where the pointer passed from the one to the other.)
    function along(r) {
      const d = r.direction, wx = -r.origin.x, turn = d.x * wx + d.y * (grab.y - r.origin.y) + d.z * (grab.z - r.origin.z), lean = 1 - d.x * d.x;
      return lean < 1e-3 ? null : (d.x * turn - wx) / lean;   // (none for someone who looks straight along the rail)
    }
    const lensTool = {
      handles: () => [thingHandle, screenHandle],
      start(grip, r) {
        const body = grip.kind === 'thing' ? thing : screen, key = grip.kind === 'thing' ? 'near' : 'screen';
        ray.ray.copy(r);
        const held = ray.intersectObject(grip.kind === 'thing' ? thingHandle : screenHandle, false)[0];
        if (!held) return false;
        if (ctx.locked.has(key)) { say('잠금', body.position.x, AY + 1.7, 0, 1.2); return false; }
        grab = { ...grip, y: held.point.y, z: held.point.z }; grab.off = body.position.x - held.point.x;
        return true;
      },
      move(r) {
        const x = along(r);
        if (x === null) return;
        if (grab.kind === 'thing') {
          const to = Math.max(5, Math.min(40, Math.round((XL - x - grab.off) / CM)));
          if (to !== ctx.values.near) ctx.set('near', to);
          say(`${to} cm`, XL - to * CM, AY + 0.85, 0);
        } else {
          const { b, real } = image(), raw = (x + grab.off - XL) / CM, to = Math.max(5, Math.min(70, Math.round((real && Math.abs(raw - b) <= 0.25 ? b : raw) * 10) / 10));
          if (to !== ctx.values.screen) ctx.set('screen', to);
          say(`${to.toFixed(1)} cm`, XL + to * CM, AY + FACE2 / 2 + 0.35, 0);
        }
      },
      end() {},
    };

    const corners = sheaf.geometry.attributes.position;
    function drawLens() {
      const v = ctx.values, now = image(), { a, s, b, f } = now, xo = XL - a * CM, xs = XL + s * CM, shown = v.rays || v.bundle;
      thing.position.x = xo; screen.position.x = xs;
      glasses.convex.visible = f > 0; glasses.concave.visible = f < 0; glasses.convex.scale.x = glasses.concave.scale.x = Math.max(0.6, Math.min(1.8, 10 / Math.abs(f)));
      axis.visible = shown || v.focus || v.image; middle.visible = shown;
      // a line of light that meets the middle plane of the lens at the height y goes on with its slope less y / f
      const slope = (y) => (y - TIP) / (a * CM) - y / (f * CM);
      const second = a === f ? null : -TIP * f / (a - f), meets = [TIP, second !== null && Math.abs(second) <= REACH ? second : null, 0];
      rays.forEach((one, k) => {
        const y = meets[k], on = v.rays && y !== null;
        one.fall.visible = one.on.visible = on; one.back.visible = false; one.tag.show(on); if (k === 1) aim.visible = false;
        if (!on) return;
        const go = slope(y);
        let far = s * CM;   // as far as the screen, or as far as the line stays over the bench
        for (const edge of [-EDGE, EDGE]) { const t = (edge - y) / go; if (t > 0 && t < far) far = t; }
        lay2(one.fall, xo, TIP, XL, y); lay2(one.on, XL, y, XL + far, y + go * far);
        if (b < 0 && XL + b * CM > WALL) { one.back.visible = true; lay2(one.back, XL + b * CM, y + go * b * CM, XL, y); }   // (where it seems to come from, for someone who looks through the lens)
        one.tag.write('①②③'[k]);
        if (k === 1 && f < 0) { aim.visible = true; lay2(aim, XL, y, XL - f * CM, 0); one.tag.shift = -0.03; one.spot.set(XL + 0.3, AY + y - 0.02, 0); return; }   // (its name beyond the lens, below it: before the lens the three run close)
        if (k === 1) one.tag.shift = y > 0 ? 0 : -0.03;
        one.spot.set(XL - 0.22, AY + y + (TIP - y) * 0.22 / (a * CM) + (k === 1 && y <= 0 ? -0.02 : 0.02), 0);
      });
      // the sheet of light: from the top of the object to the lens (and as far up and down its middle plane as the three rays meet it), then on to the screen
      sheaf.visible = v.bundle;
      if (v.bundle) {
        const high = Math.max(LENS, TIP, meets[1] === null ? 0 : meets[1]), low = Math.min(-LENS, meets[1] === null ? 0 : meets[1]), far = s * CM, list = [];
        const at = (x, y) => [x, AY + Math.max(-EDGE, Math.min(EDGE, y)), 0];
        list.push(at(xo, TIP), at(XL, high), at(XL, low));
        if (now.real && b < s) { const xi = XL + b * CM, yi = -TIP * b / a; list.push(at(XL, high), at(XL, low), at(xi, yi), at(xi, yi), at(xs, high + slope(high) * far), at(xs, low + slope(low) * far)); }
        else list.push(at(XL, high), at(XL, low), at(xs, low + slope(low) * far), at(XL, high), at(xs, low + slope(low) * far), at(xs, high + slope(high) * far));
        list.forEach((p, n) => corners.setXYZ(n, p[0], p[1], p[2])); corners.needsUpdate = true;
      }
      // the foci
      for (const one of dots2) {
        const x = XL + one.n * Math.abs(f) * CM;
        one.mesh.position.x = x; one.spot.set(x, AY + one.high, 0); one.mesh.visible = one.line.visible = v.focus; one.label.show(v.focus); if (v.focus) lay2(one.line, x, 0.07, x, one.high - 0.02);
        if (v.focus) one.label.write(Math.abs(one.n) === 1 ? `초점(F${one.n > 0 ? '′' : ''})` : `초점 거리의 2배(G${one.n > 0 ? '′' : ''})`); }
      // the image as it would stand
      // (an image on a screen: as far as the rail goes. One seen through the lens: wherever it is in the room, off the bench as well, and however large, short of the floor)
      const xi = XL + b * CM, near = b !== Infinity && (now.real ? xi < 6.3 && now.size <= 6 : xi > WALL && now.size <= 25);
      if (axis.visible) lay2(axis, !now.real && b !== Infinity && xi > WALL && xi < -5.9 && (v.rays || v.image) ? xi - 0.4 : -6.3, 0, 6.3, 0);   // (the axis reaches back to such an image)
      ghost.visible = v.image && near; labels2.ghost.show(v.image);
      if (ghost.visible) { ghost.position.x = xi; ghost.scale.set(1, now.size, now.size); ghost.rotation.x = now.real ? Math.PI : 0; }
      point(arrows[0], xo, v.rays || v.image ? TIP : 0); point(arrows[1], near ? xi : XL, v.image && near ? (now.real ? -1 : 1) * now.size * TIP : 0);
      if (v.image) {
        if (near) spots2.ghost.set(xi, AY - now.size * TIP - 0.12, 0); else spots2.ghost.set(XL, AY - LENS - 0.2, 0);
        labels2.ghost.write(b === Infinity ? '상이 생기지 않음' : !near ? (now.real ? '실상이 실험대 밖에 생김' : '허상이 방 밖에 생김') : now.real ? '실상' : '허상');
      }
      // the writing
      spots2.near.set(Math.min((xo + XL) / 2, XL - 1.15), 0.15, 1.25); labels2.near.write(`물체까지의 거리(a) <b>${a} cm</b>`); labels2.near.show(true);
      spots2.far.set(Math.max((xs + XL) / 2, XL + 1.15), 0.15, 1.25); labels2.far.write(`스크린까지의 거리 <b>${s.toFixed(1)} cm</b>`); labels2.far.show(true);
      labels2.key.show(v.rays);
      if (v.rays) { labels2.key.write(`① 광축에 나란한 빛<br>② ${f < 0 ? '초점을 향하는 빛' : a < f ? '초점에서 나온 것처럼 나아가는 빛' : '초점을 지나는 빛'}<br>③ 렌즈 중심을 지나는 빛`); spots2.key.set(XL - 4.3, AY + 1.25, 0); }
      labels2.lens.show(ctx.advanced); if (ctx.advanced) labels2.lens.write(`${f < 0 ? '오목 렌즈 · ' : ''}초점 거리(f) <b>${Math.abs(f)} cm</b>`);
      labels2.list.show(v.numbers);
      if (v.numbers) {
        const less = (cm, digits) => (cm < 0 ? `(−${(-cm).toFixed(digits)})` : cm.toFixed(digits));   // (a length that counts as less than nought, as it stands in the sum)
        const lines = [`초점 거리(f) <b>${Math.abs(f)} cm</b>${f < 0 ? ' (오목 렌즈)' : ''}`, `물체까지의 거리(a) <b>${a} cm</b>`];
        if (b === Infinity) lines.push('상이 생기지 않음');
        else {
          lines.push(now.real ? `상까지의 거리(b) <b>${b.toFixed(1)} cm</b>` : `허상까지의 거리(b) <b>${(-b).toFixed(1)} cm</b> (물체 쪽)`);
          if (ctx.advanced) {
            lines.push('1 ÷ a + 1 ÷ b = 1 ÷ f', `1 ÷ ${a} + 1 ÷ ${less(b, 1)} = 1 ÷ ${less(f, 0)}`);
            if (b < 0) lines.push(f < 0 ? '허상의 b와 오목 렌즈의 f는 −로 적음' : '허상의 b는 −로 적음');
            lines.push(`상의 크기 = b ÷ a = ${Math.abs(b).toFixed(1)} ÷ ${a} = <b>${now.size.toFixed(2)}배</b>`);
          } else lines.push(`상의 크기: 물체의 <b>${now.size.toFixed(2)}배</b>`);
          lines.push(now.real ? '거꾸로 선 실상' : '바로 선 허상');
        }
        labels2.list.write(lines.join('<br>')); if (tall()) spots2.list.set(XL + 3, 0.2, 2.2); else spots2.list.set(XL + 5.2, 0.2, 2.6);
      }
    }

    const lensScene = {
      rig: rig2, ids: ['thing', 'kind', 'focal', 'near', 'screen'], keep: ['rays', 'bundle', 'focus', 'image'], kept: { rays: false, bundle: false, focus: false, image: false },
      look: [{ target: [-0.6, 1.5, 0], r: 11.5, theta: -1.05, phi: 1.2 }, { target: [-0.6, 1.4, 0.2], r: 13.5, theta: -1.3, phi: 1.12 }],
      handles: lensTool.handles, start: lensTool.start, move: lensTool.move, end: lensTool.end,
      enter() { rig2.visible = true; paintThing(); paintScreen(); fresh = true; since = performance.now(); ctx.setView('front'); },   // (the rays are drawn as the textbook draws them, seen from the front)
      leave() { rig2.visible = false; for (const label of [...Object.values(labels2), ...rays.map((one) => one.tag), ...dots2.map((one) => one.label)]) label.show(false); },
      changed(id) { if (id === 'thing') paintThing(); paintScreen(); fresh = true; since = performance.now(); },
      play() {},
      tick() {}, toStart: toStartLens, draw: drawLens, note: noteLens,
      mode() { paintScreen(); fresh = true; since = performance.now(); },   // (the lens set by hand counts in the advanced mode only)
    };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (rig2.visible) { paintThing(); paintScreen(); moved = true; } });   // (the letter in the page's own type, once that has come)

    // ====================================== prisms and lenses (advanced only) ======================================
    // ---------- the board, the piece of glass and the light ----------
    // A dark board with a grid of centimetres lies on the bench; a flat piece of glass stands on it at X0, and five
    // lines of light run along the board from a box at the left. Lengths here are in cm, SC units to a cm: x along the
    // axis from the middle of the glass, y across it, + towards the front of the bench. Every line is followed from
    // face to face and bent at each as the law of refraction asks (thrown back where it cannot leave the glass), with
    // no approximation: a prism turns all of them by one angle; two prisms base to base turn the upper and the lower
    // ones towards each other; a lens with round faces brings those near its axis to one point, and those far from the
    // axis to a nearer one. The lenses are HL high from the axis to the rim, a prism's faces meet at 40°.
    const SC = 0.4, X0 = -1, HL = 4, RY3 = 0.24, FROM = -10.5, LEFT = -17.6, RIGHT = 22.6, ACROSS = 6.8, APEX = 20 * Math.PI / 180;
    const TINTS = { red: [[0xff4136, 0, '적색']], white: [[0xff4136, -0.3, '적색'], [0x3ddc6a, 0.24, '녹색'], [0x5a8cff, 0.7, '청색']] };   // each colour: how it is drawn, how far its index is from the index set (in parts of the spread from red to blue), its name
    const rig3 = new T.Group(); world.add(rig3);
    add(rig3, box(16.4, 0.06, 5.6), mat(0x1d2130), 0, 0.03, 0);
    add(rig3, new T.PlaneGeometry(16.3, 5.5).rotateX(-Math.PI / 2), mat(0xffffff, { roughness: 0.9, map: canvasTexture(2038, 688, (g, w, h) => {
      const px = w / 16.3, at = (cm) => (X0 + cm * SC + 8.15) * px, down = (cm) => h / 2 + cm * SC * px;
      g.fillStyle = '#232838'; g.fillRect(0, 0, w, h);
      for (let cm = -17; cm <= 22; cm++) { g.strokeStyle = `rgba(240,236,224,${cm % 5 === 0 ? 0.3 : 0.1})`; g.lineWidth = 1.5; g.beginPath(); g.moveTo(at(cm), 0); g.lineTo(at(cm), h); g.stroke(); }
      for (let cm = -6; cm <= 6; cm++) { g.strokeStyle = `rgba(240,236,224,${cm % 5 === 0 ? 0.3 : 0.1})`; g.beginPath(); g.moveTo(0, down(cm)); g.lineTo(w, down(cm)); g.stroke(); }
      g.strokeStyle = 'rgba(240,236,224,0.85)'; g.lineWidth = 2.2; g.setLineDash([16, 12]); g.beginPath(); g.moveTo(0, h / 2); g.lineTo(w, h / 2); g.stroke(); g.setLineDash([]);   // the axis
      g.fillStyle = 'rgba(240,236,224,0.92)'; g.textAlign = 'center'; g.font = '30px Georgia, serif';
      for (let cm = -15; cm <= 20; cm += 5) g.fillText(String(Math.abs(cm)), at(cm), h - 14);   // (counted from the middle of the glass, to either side)
    }) }), 0, TOP, 0, false, true);
    const glassInk = new T.MeshStandardMaterial({ color: 0xbdf0e6, roughness: 0.25, transparent: true, opacity: 0.45, depthWrite: false });
    const piece = add(rig3, box(0.1, 0.1, 0.1), glassInk, X0, TOP + 0.004, 0, false, false); piece.renderOrder = 2;
    // the box the light comes from: it is carried across the board; and a small lamp for light from one point
    const lightBox = new T.Group(); rig3.add(lightBox);
    const boxBody = add(lightBox, box(0.62, 0.42, 1), M.dark, X0 + (FROM - 0.8) * SC, TOP + 0.21, 0);
    const boxHandle = add(lightBox, box(1.4, 1.0, 1), M.dark, X0 + (FROM - 0.8) * SC, 0.5, 0, false, false); boxHandle.visible = false; boxHandle.userData.grip = { kind: 'box' };
    const lamp = add(rig3, cyl(0.16, 0.16, 0.42, 20), mat(0x8a4a3f), 0, TOP + 0.21, 0);
    // the lines of light: one rod for each stretch, each of the colour of its light
    const RODS = 200, unitRod = new T.InstancedMesh(cyl(0.022, 0.022, 1, 6), new T.MeshBasicMaterial({ color: 0xffffff }), RODS); unitRod.frustumCulled = false; unitRod.renderOrder = 4; rig3.add(unitRod);
    const paint3 = new T.Color(), spot3 = new T.Vector3(), turn3 = new T.Quaternion(), size3 = new T.Vector3(), place3 = new T.Matrix4(), none3 = new T.Matrix4().makeScale(0, 0, 0);
    let rodCount = 0;
    function rod3(x0, y0, x1, y1, color) {   // a stretch of light from one point of the board to another (cm)
      const long = Math.hypot(x1 - x0, y1 - y0) * SC;
      if (long < 1e-6 || rodCount >= RODS) return;
      unitRod.setMatrixAt(rodCount, place3.compose(spot3.set(X0 + (x0 + x1) / 2 * SC, RY3, (y0 + y1) / 2 * SC), turn3.setFromUnitVectors(UP, way.set((x1 - x0) * SC / long, 0, (y1 - y0) * SC / long)), size3.set(1, long, 1)));
      unitRod.setColorAt(rodCount++, paint3.setHex(color));
    }
    // lines of dashes: where light that spreads seems to come from, and the normals of the faces
    function dashed3(color, radius) {
      const map = dash.clone(); map.wrapT = T.RepeatWrapping; map.needsUpdate = true;
      const mesh = add(rig3, cyl(radius, radius, 1, 6), new T.MeshBasicMaterial({ color, map, alphaTest: 0.5 }), 0, 0, 0, false, false); mesh.userData.map = map; mesh.visible = false; return mesh;
    }
    function lay3(mesh, x0, y0, x1, y1) {
      const long = Math.hypot(x1 - x0, y1 - y0) * SC;
      mesh.visible = long > 1e-6; if (!mesh.visible) return;
      mesh.position.set(X0 + (x0 + x1) / 2 * SC, RY3, (y0 + y1) / 2 * SC); mesh.quaternion.setFromUnitVectors(UP, way.set((x1 - x0) * SC / long, 0, (y1 - y0) * SC / long)); mesh.scale.y = long; mesh.userData.map.repeat.set(1, long / 0.24);
    }
    const backs = Array.from({ length: 15 }, () => dashed3(0xffffff, 0.012)), normals = [0, 1].map(() => dashed3(0xd8d2c4, 0.01));
    const focusDot = add(rig3, new T.SphereGeometry(0.07, 14, 10), kit.glow(0xe3a93b), 0, RY3, 0, false, false);
    const spots3 = { focus: new T.Vector3(), list: new T.Vector3(), a: new T.Vector3(), b: new T.Vector3(), word: new T.Vector3() };
    const labels3 = { focus: view.label(spots3.focus), list: view.label(spots3.list, true), a: view.label(spots3.a), b: view.label(spots3.b), word: view.label(spots3.word) };

    // ---------- physics ----------
    // The outline of the glass: straight sides, and arcs for the faces of a lens (cx: the middle of the circle on the
    // axis; side: +1 for the part of the circle to the right of its middle, −1 for the part to the left).
    const lensy = (values) => values.glass === 'lens' || values.glass === 'hollow';
    function outline() {
      const v = ctx.values, R = v.curve, sag = R - Math.sqrt(R * R - HL * HL), w = HL * Math.tan(APEX), line = (ax, ay, bx, by) => ({ ax, ay, bx, by });
      if (v.glass === 'prism') return { sides: [line(-w, 2, w, 2), line(w, 2, 0, -2), line(0, -2, -w, 2)], points: [[-w, 2], [w, 2], [0, -2]] };
      if (v.glass === 'twin') return { sides: [line(-w, 0, 0, -HL), line(0, -HL, w, 0), line(w, 0, 0, HL), line(0, HL, -w, 0)], points: [[-w, 0], [0, -HL], [w, 0], [0, HL]] };
      const hollow = v.glass === 'hollow', half = hollow ? 0.2 : sag + 0.1, rim = hollow ? half + sag : 0.1, cx = hollow ? half + R : R - half, points = [];   // half: from the middle to a face, along the axis; rim: the same at the rim
      const face = (y) => (hollow ? cx - Math.sqrt(R * R - y * y) : Math.sqrt(R * R - y * y) - cx);   // how far to the right of the middle the right face is, at the height y
      for (let k = 0; k <= 24; k++) { const y = -HL + 2 * HL * k / 24; points.push([-face(y), y]); }
      for (let k = 24; k >= 0; k--) { const y = -HL + 2 * HL * k / 24; points.push([face(y), y]); }
      return { sides: [{ cx: hollow ? -cx : cx, r: R, side: hollow ? 1 : -1 }, { cx: hollow ? cx : -cx, r: R, side: hollow ? -1 : 1 }, line(-rim, -HL, rim, -HL), line(-rim, HL, rim, HL)], points, thick: 2 * half };
    }
    // A line of light from (ox, oy) along (dx, dy), in glass of the index n: the points at which it is bent, and where and which way it goes on at last
    function follow(sides, ox, oy, dx, dy, n) {
      const path = [[ox, oy]], hits = [];
      let inside = false;
      for (let turn = 0; turn < 12; turn++) {
        let best = Infinity, nx = 0, ny = 0;
        for (const one of sides) {
          if (one.r) {   // an arc
            const fx = ox - one.cx, b = fx * dx + oy * dy, root = b * b - (fx * fx + oy * oy - one.r * one.r);
            if (root < 0) continue;
            for (const t of [-b - Math.sqrt(root), -b + Math.sqrt(root)]) {
              const px = ox + t * dx, py = oy + t * dy;
              if (t > 1e-7 && t < best && Math.abs(py) <= HL && (px - one.cx) * one.side > 0) { best = t; nx = (px - one.cx) / one.r; ny = py / one.r; }
            }
          } else {
            const ex = one.bx - one.ax, ey = one.by - one.ay, den = dx * ey - dy * ex;
            if (Math.abs(den) < 1e-12) continue;
            const t = ((one.ax - ox) * ey - (one.ay - oy) * ex) / den, u = ((one.ax - ox) * dy - (one.ay - oy) * dx) / den;
            if (t > 1e-7 && t < best && u >= 0 && u <= 1) { best = t; const long = Math.hypot(ex, ey); nx = ey / long; ny = -ex / long; }
          }
        }
        if (best === Infinity) break;
        ox += best * dx; oy += best * dy; path.push([ox, oy]);
        let cos = -(dx * nx + dy * ny);
        if (cos < 0) { nx = -nx; ny = -ny; cos = -cos; }   // (the normal towards the side the light comes from)
        const ratio = inside ? n : 1 / n, under = 1 - ratio * ratio * (1 - cos * cos), i = Math.acos(Math.min(1, cos));
        hits.push({ x: ox, y: oy, nx, ny, i, r: under < 0 ? null : Math.asin(Math.min(1, ratio * Math.sin(i))) });
        if (under < 0) { dx += 2 * cos * nx; dy += 2 * cos * ny; }   // it cannot leave the glass: thrown back
        else { const go = ratio * cos - Math.sqrt(under); dx = ratio * dx + go * nx; dy = ratio * dy + go * ny; inside = !inside; }
      }
      return { path, hits, ox, oy, dx, dy, meet: Math.abs(dy) < 1e-12 ? null : ox - oy * dx / dy };   // meet: where its last stretch (or that stretch drawn back) crosses the axis
    }
    const spread = () => (ctx.values.gindex - 1) / 30;   // how much greater the index is for blue light than for red: that of a glass that parts the colours widely
    const colours = () => TINTS[ctx.values.tint].map(([color, part, name]) => ({ color, name, n: ctx.values.gindex + part * spread() }));
    const reach = () => ctx.values.shift;   // how far the box stands from the axis (a line that passes the glass by goes straight on)
    const pointed = () => ctx.values.glass === 'lens' && ctx.values.source;   // the light comes from one point, at the focus
    // where light near the axis comes together (or seems to come from), counted from the middle of the glass, for the index n; and the same by the formula for a thin lens
    const focusOf = (sides, n) => follow(sides, FROM, 0.02, 1, 0, n).meet;
    const thinFocus = (n) => (ctx.values.glass === 'hollow' ? -1 : 1) * ctx.values.curve / (2 * (n - 1));
    let shape = { key: '', sides: [], points: [] }, last = null;
    function build() {
      const v = ctx.values, key = `${v.glass}/${v.curve}`;
      if (key === shape.key) return;
      shape = { key, ...outline() };
      const flat = new T.Shape(); shape.points.forEach(([x, y], k) => (k ? flat.lineTo(x * SC, -y * SC) : flat.moveTo(x * SC, -y * SC)));
      piece.geometry.dispose(); piece.geometry = new T.ExtrudeGeometry(flat, { depth: 0.4, bevelEnabled: false }).rotateX(-Math.PI / 2);
    }
    function noteGlass() {
      fresh = false; drawGlass();   // (what is written is what is drawn: the lines are followed anew first)
      if (!last || !lensy(ctx.values) || pointed()) return;
      const v = ctx.values;
      write(ctx.tables.glassTable, [v.glass === 'hollow' ? '오목' : '볼록', v.gindex.toFixed(2), String(v.curve), last.high.toFixed(1), last.near === null ? '–' : last.near.toFixed(1).replace('-', '−'), last.far === null ? '–' : last.far.toFixed(1).replace('-', '−')]);
    }
    function toStartGlass() {
      for (const [key, value] of [['glass', 'lens'], ['gindex', 1.5], ['curve', 10], ['gap', 0.5], ['shift', 0], ['tint', 'red'], ['source', false]]) if (!ctx.locked.has(key) && ctx.values[key] !== value) ctx.set(key, value);
      moved = true;
    }

    // ---------- handling ----------
    // The box of light is carried across the board, 0.2 cm a step, as far as 2.6 cm from the axis whatever the gap between its lines.
    const glassTool = {
      handles: () => (pointed() ? [] : [boxHandle]),
      start(grip, r) {
        if (!r.intersectPlane(level, hit)) return false;
        if (ctx.locked.has('shift')) { say('잠금', hit.x, 1.0, hit.z, 1.2); return false; }
        grab = { ...grip, off: reach() * SC - hit.z };
        return true;
      },
      move(r) {
        if (!r.intersectPlane(level, hit)) return;
        const to = Math.max(-2.6, Math.min(2.6, Math.round((hit.z + grab.off) / SC * 5) / 5));
        if (to !== ctx.values.shift) ctx.set('shift', to);
      },
      end() {},
    };

    function drawGlass() {
      const v = ctx.values, list = colours(), lead = list[Math.min(1, list.length - 1)], off = reach(), point = pointed();
      build();
      // where the light starts: five lines side by side from the box, or five from a lamp at the focus towards as many heights of the lens
      const near = focusOf(shape.sides, lead.n), lit = !point || (near !== null && near > 0 && near < -LEFT - 0.5), heights = [-2, -1, 0, 1, 2].map((k) => (point ? 0 : off) + k * v.gap);
      lightBox.visible = !point; lamp.visible = point && lit;
      lightBox.position.z = off * SC; boxBody.scale.z = boxHandle.scale.z = (4 * v.gap + 1.2) * SC;
      if (lamp.visible) lamp.position.set(X0 - near * SC, TOP + 0.21, 0);
      rodCount = 0; let dashes = 0, far = null, outer = -1, first = null;   // (far: the line farthest from the axis of those that meet the glass)
      if (lit) for (const one of list) for (const high of heights) {
        const long = Math.hypot(near, high), ray = point ? follow(shape.sides, -near, 0, near / long, high / long, one.n) : follow(shape.sides, FROM, high, 1, 0, one.n);
        // (white light is white until the glass parts its colours: that stretch is drawn once, for the first of them)
        const whole = list.length > 1, plain = whole && ray.path.length === 1;
        ray.path.forEach((p, k) => { if (k > 1 || (k === 1 && !whole)) rod3(ray.path[k - 1][0], ray.path[k - 1][1], p[0], p[1], one.color); else if (k === 1 && one === list[0]) rod3(ray.path[0][0], ray.path[0][1], p[0], p[1], 0xffffff); });
        // its last stretch: on to the edge of the board
        let t = Infinity;
        if (ray.dx > 0) t = Math.min(t, (RIGHT - ray.ox) / ray.dx); else if (ray.dx < 0) t = Math.min(t, (LEFT - ray.ox) / ray.dx);
        if (ray.dy > 0) t = Math.min(t, (ACROSS - ray.oy) / ray.dy); else if (ray.dy < 0) t = Math.min(t, (-ACROSS - ray.oy) / ray.dy);
        if (!plain || one === list[0]) rod3(ray.ox, ray.oy, ray.ox + t * ray.dx, ray.oy + t * ray.dy, plain ? 0xffffff : one.color);
        // light that spreads from a concave lens: drawn back to where it seems to come from
        if (v.glass === 'hollow' && ray.meet !== null && ray.meet < ray.ox && ray.meet > LEFT && Math.abs(high) > 1e-9 && dashes < backs.length) { const back = backs[dashes++]; back.material.color.setHex(one.color); lay3(back, ray.meet, 0, ray.ox, ray.oy); }
        if (one === lead && ray.hits.length && Math.abs(high) > outer) { far = ray; outer = Math.abs(high); }
        if (one === lead && !first && ray.hits.length) first = ray;   // (the line nearest the back of the bench: its angles are the ones written)
      }
      for (let k = rodCount; k < RODS; k++) unitRod.setMatrixAt(k, none3);
      unitRod.count = RODS; unitRod.instanceMatrix.needsUpdate = true; if (unitRod.instanceColor) unitRod.instanceColor.needsUpdate = true;
      for (let k = dashes; k < backs.length; k++) backs[k].visible = false;
      last = lensy(v) ? { near, far: far ? far.meet : null, high: Math.max(0, outer) } : null;
      // the normals of the faces where the first line is bent, and its angles there
      [0, 1].forEach((k) => {
        const at = v.normals && first ? first.hits[k] : null, label = k ? labels3.b : labels3.a, spot = k ? spots3.b : spots3.a;
        normals[k].visible = false; label.show(Boolean(at));
        if (!at) return;
        lay3(normals[k], at.x - 1.6 * at.nx, at.y - 1.6 * at.ny, at.x + 1.6 * at.nx, at.y + 1.6 * at.ny);
        spot.set(X0 + (at.x + (k ? 4.6 : -4.6)) * SC, RY3 + 0.1, (at.y - 1.2) * SC);
        label.write(at.r === null ? `입사각 <b>${deg(at.i).toFixed(1)}°</b> → 전반사` : `입사각 <b>${deg(at.i).toFixed(1)}°</b> → 굴절각 <b>${deg(at.r).toFixed(1)}°</b>`);
      });
      // the writing
      labels3.word.show(point && !lit); if (point && !lit) { labels3.word.write('초점이 판 밖에 있어 광원을 놓을 수 없음'); spots3.word.set(X0, 0.5, 0); }
      const marked = v.numbers && lensy(v) && near !== null && near > LEFT && near < RIGHT && !point;
      focusDot.visible = marked; labels3.focus.show(marked);
      if (marked) { focusDot.position.set(X0 + near * SC, RY3, 0); spots3.focus.set(X0 + near * SC, RY3 + 0.15, 0); labels3.focus.write('초점'); }
      labels3.list.show(v.numbers);
      if (v.numbers) {
        const lines = [], cm = (x) => (x === null ? '–' : `${x < 0 ? '−' : ''}${Math.abs(x).toFixed(1)}`);
        if (lensy(v)) {
          lines.push(`굴절률(n) <b>${v.gindex.toFixed(2)}</b> · 곡률 반지름(R) <b>${v.curve} cm</b>`, '얇은 렌즈의 식: 1 ÷ f = (n − 1) × 2 ÷ R', `→ 초점 거리(f) <b>${cm(thinFocus(v.gindex))} cm</b>`, `광선을 따라가 찾은 초점 (${v.glass === 'hollow' ? '렌즈 앞쪽이 −' : '렌즈 중심에서'})`);
          if (list.length > 1) lines.push(list.map((one) => `${one.name} <b>${cm(focusOf(shape.sides, one.n))}</b>`).join(' · ') + ' cm');
          else lines.push(`가운데 광선 <b>${cm(near)} cm</b>${point ? '' : ` · 바깥 광선 <b>${cm(last.far)} cm</b>`}`);
        } else {
          const turned = (n) => { const ray = follow(shape.sides, FROM, v.glass === 'twin' ? -1 : 0, 1, 0, n); return deg(Math.abs(Math.atan2(ray.dy, ray.dx))); };
          lines.push(`굴절률(n) <b>${v.gindex.toFixed(2)}</b>`, list.length > 1 ? '꺾인 각 ' + list.map((one) => `${one.name} <b>${turned(one.n).toFixed(1)}°</b>`).join(' · ') : `꺾인 각 <b>${turned(lead.n).toFixed(1)}°</b>`);
        }
        labels3.list.write(lines.join('<br>')); if (tall()) spots3.list.set(-8.25, 0.1, 0); else spots3.list.set(-5.6, 0.1, -1.75);   // (an upright screen looks along the board from the box: at the near end of the board, behind the box)
      }
    }

    const glassScene = {
      rig: rig3, ids: ['glass', 'gindex', 'curve', 'gap', 'shift', 'tint', 'source'], keep: ['normals'], kept: { normals: false },
      look: [{ target: [-0.7, 0.2, 0.4], r: 15.2, theta: 0, phi: 0.6 },   // (the box of light clear of the menu button at the left)
        { target: [-0.9, 0.2, 0], r: 22, theta: -Math.PI / 2, phi: 0.45 }],
      handles: glassTool.handles, start: glassTool.start, move: glassTool.move, end: glassTool.end,
      enter() { rig3.visible = true; fresh = true; since = performance.now(); ctx.setView('top'); },
      leave() { rig3.visible = false; for (const label of Object.values(labels3)) label.show(false); },
      changed() { fresh = true; since = performance.now(); },
      play() {},
      tick() {}, toStart: toStartGlass, draw: drawGlass, note: noteGlass,
      mode() {},
    };

    ctx.traces.s0.add(0, 0);
    const SCENES = { bend: bendScene, lens: lensScene, pieces: glassScene }, scene = () => SCENES[ctx.values.scene];
    const frame = () => view.look(scene().look[tall() ? 1 : 0]);
    view.setTool({
      pick(r) {
        ray.ray.copy(r); scene().rig.updateMatrixWorld(true);
        const found = ray.intersectObjects(scene().handles(), false)[0];
        return found ? found.object.userData.grip : null;
      },
      cursor: (grip) => (grip ? 'grab' : ''),
      start: (grip, r) => scene().start(grip, r),
      move(r) { scene().move(r); moved = true; },
      end() {
        const done = grab;
        grab = null; tip.show(false); tipTime = 0; moved = true; since = performance.now();
        if (done) scene().end(done);
      },
    });
    ctx.on('play', (on) => { scene().play(on); moved = true; });
    ctx.on('tick', (t, dt) => { if (!dt) return; scene().tick(t, dt); moved = true; });
    ctx.on('action', (id) => { if (id === 'reset') scene().toStart(); });
    ctx.on('view', () => { moved = true; });
    ctx.on('change', (id, value) => {
      const at = scene();
      moved = true;
      if (id === 'scene') {   // the other arrangement: its switches as they were left, the clock at nought
        for (const one of Object.values(SCENES)) if (one !== at) one.leave();
        for (const key of at.keep) if (ctx.values[key] !== at.kept[key]) ctx.set(key, at.kept[key]);
        at.enter(); frame(); ctx.setPlaying(false); ctx.seek(0); tip.show(false); tipTime = 0;
        return;
      }
      if (at.keep.includes(id)) at.kept[id] = value;
      if (at.ids.includes(id)) at.changed(id, value);
    });
    // (the frame tells of the class and inquiry buttons as well: only a change between basic and advanced counts here)
    let wasAdvanced = ctx.advanced;
    ctx.on('mode', () => { moved = true; if (ctx.advanced === wasAdvanced) return; wasAdvanced = ctx.advanced; scene().mode(); });

    lensScene.leave(); glassScene.leave(); bendScene.enter();   // (the disc is read from straight above)
    return {
      bend: () => ({ ...bend(), side, t: run.t }),
      glass: () => ({ ...last, thin: thinFocus(ctx.values.gindex), follow: (y, n = ctx.values.gindex) => { const one = follow(shape.sides, FROM, y, 1, 0, n); return { meet: one.meet, hits: one.hits.map((hit2) => [deg(hit2.i), hit2.r === null ? null : deg(hit2.r)]), turn: deg(Math.atan2(one.dy, one.dx)) }; } }),
      lens: () => ({ ...image(), thing: thing.position.x, screen: screen.position.x }),
      lit: () => { const data = pen.getImageData(0, 0, 448, 448).data, row = []; let top = 0, sum = 0; for (let i = 0; i < data.length; i += 4) { top = Math.max(top, data[i]); sum += data[i]; } for (let x = 0; x < 448; x += 32) row.push(data[(224 * 448 + x) * 4]); return { top, mean: sum / (448 * 448), row }; },
      update(dt) {
        if (!framed) { framed = true; if (tall()) frame(); }
        if (tipTime > 0) { tipTime -= dt; if (tipTime <= 0) { tip.show(false); moved = true; } }
        if (fresh && !grab && performance.now() - since >= 600) scene().note();
        if (!moved) return false;
        moved = false; scene().draw();
        return true;
      },
    };
  },
};
