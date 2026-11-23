// P-12 The magnetic field of a current (3D).
//
// A board with a wire through it, joined to a supply, and six small compasses that are carried about on the board,
// after the textbook's experiment. The wire is one of three: a straight one, upright through the middle of the
// board; a ring, standing with its axis along the board; a solenoid, lying with its axis along the board. So the
// field at the board always lies in the board, and a compass shows its direction.
// The field is found by cutting the wire into straight pieces and adding up what each piece gives (the law of Biot
// and Savart): for the straight wire that is μ0 I / 2πr, for the middle of the ring μ0 I / 2R, and inside the
// solenoid nearly μ0 n I (a little less, as the solenoid is not endless).
// In the basic mode there is no field of the Earth: with no current a needle stays as it was left. Advanced: the
// Earth's field (30 μT along the bench) is there as well, towards a north that is different every time, the needles
// show the sum, and the whole apparatus is turned round on the bench to set it to that north. The straight wire then
// lies over the board, at a height that is set, so that it can be laid along the needles: under it its field is
// square to the Earth's, and how far a needle turns tells how strong it is (tan θ = B / B of the Earth).
//
// The current is set by the knob of the supply, its direction by the switch beside it; both can be set from the
// menu as well, over the same range and in the same steps. Where the compasses stand is set by hand only.
// One unit of the scene is 10 cm. Fields are in μT, and with lengths in these units the field of a piece of wire
// with 1 A in it needs no factor: μ0 / 4π is 0.1 μT m / A, and a unit is 0.1 m.
const MU = '<span style="font-family: Georgia, serif">μ</span>', MATH = (letters) => `<i style="font-family: Georgia, serif">${letters}</i>`;
const tenth = (value) => (Math.abs(value) < 0.05 ? '0.0' : value.toFixed(1)), whole = (value) => String(Math.round(value) || 0);
const EARTH = 30;   // the part of the Earth's field along the bench (μT)
const SHAPES = { line: '직선 도선', loop: '원형 도선', coil: '솔레노이드' };
const isLine = (values) => values.shape === 'line', isLoop = (values) => values.shape === 'loop', isCoil = (values) => values.shape === 'coil';

export default {
  // what is taken for granted, written on screen by the frame
  premise: (v, advanced) => `${isLine(v) ? '도선은 매우 길다고 보고' : '전원에 이어진 도선이 만드는 자기장은 무시하고'}, ${advanced ? `지구 자기장의 수평 성분은 ${EARTH} ${MU}T로 봅니다` : '지구 자기장은 없다고 봅니다'}`,
  fixedViews: ['top', 'front'],
  camera: { target: [0, 1.0, 0.5], r: 7.6, theta: 0.2, phi: 0.78, rMax: 30 },
  traces: {
    br: { window: 100, range: 10, read: (b) => `${tenth(b)} μT` },   // the field where each compass stands against its distance from the straight wire (cm): not against time
    bi: { window: 100, range: 10, read: (b) => `${tenth(b)} μT` },   // the field where compass 1 stands against the current (A), for the currents tried
    bR: { window: 100, range: 10, read: (b) => `${tenth(b)} μT` },   // the field at the middle of the ring against its radius (cm), for the radii tried
  },
  menus: {
    vars: [
      { id: 'shape', label: '도선의 모양', kind: 'choice', value: 'line', options: Object.keys(SHAPES).map((id) => ({ id, label: SHAPES[id] })) },
      { id: 'amps', label: '전류의 세기', kind: 'slider', min: 0, max: 5, step: 0.5, value: 0, digits: 1, unit: ' A' },
      { id: 'reversed', label: '전류의 방향 바꾸기', kind: 'toggle' },
      { id: 'radius', label: '원형 도선의 반지름', kind: 'slider', min: 4, max: 8, step: 1, value: 6, unit: ' cm', when: isLoop },
      { id: 'turns', label: '솔레노이드의 감은 수', kind: 'slider', min: 20, max: 60, step: 10, value: 40, unit: '회', when: isCoil },
      { id: 'gap', label: '도선의 높이', kind: 'slider', min: 2, max: 10, step: 1, value: 4, unit: ' cm', advanced: true, when: isLine },
      { id: 'turn', label: '실험 장치를 돌린 각', kind: 'slider', min: 0, max: 345, step: 15, value: 0, unit: '°', advanced: true },
    ],
    graph: [
      { id: 'fieldDistance', label: '자기장–거리', kind: 'graph', x: '도선에서의 거리', xUnit: 'cm', span: [0, 25], plots: [{ y: '자기장', trace: 'br', dots: true }], when: isLine },
      { id: 'fieldCurrent', label: '자기장–전류', kind: 'graph', x: '전류', xUnit: 'A', span: [0, 5], plots: [{ y: '나침반 1 자리의 자기장', trace: 'bi', dots: true }] },
      { id: 'fieldRadius', label: '중심 자기장–반지름', kind: 'graph', x: '원형 도선의 반지름', xUnit: 'cm', span: [0, 10], plots: [{ y: '중심의 자기장', trace: 'bR', dots: true }], when: isLoop },
    ],
    time: [
      { id: 'reset', label: '처음으로', kind: 'action' },
    ],
    layers: [
      { id: 'flow', label: '전류의 방향', kind: 'toggle', value: true },
      { id: 'arrows', label: '자기장 화살표', kind: 'toggle' },
      { id: 'lines', label: '자기장 선(모형)', kind: 'toggle' },
      { id: 'filings', label: '철 가루(모형)', kind: 'toggle' },
      { id: 'north', label: '북쪽 방향', kind: 'toggle', advanced: true },
      { id: 'numbers', label: '값', kind: 'toggle' },
    ],
    inquiry: [
      { id: 'table', label: '기록 표', kind: 'table', wide: true, rows: 8, text: '전류나 도선을 바꾸거나 나침반 1을 옮길 때마다 한 줄씩 적힙니다. 자기장은 나침반 1이 놓인 곳에서 도선이 만드는 자기장(판에 나란한 성분)입니다.',
        columns: [{ label: '도선' }, { label: '조건' }, { label: '전류', unit: 'A' }, { label: '도선에서<br>거리', unit: 'cm' }, { label: '자기장', unit: 'μT', result: true }, { label: '자침이<br>돌아간 각', unit: '°', result: true, advanced: true }] },
      { id: 'law', label: '전류가 만드는 자기장의 세기', kind: 'note', advanced: true,
        text: `직선 도선: ${MATH('B')} = ${MATH('μ<sub>0</sub>I')} ÷ 2π${MATH('r')}<br>원형 도선의 중심: ${MATH('B')} = ${MATH('μ<sub>0</sub>I')} ÷ 2${MATH('R')}<br>솔레노이드의 내부: ${MATH('B')} = ${MATH('μ<sub>0</sub>nI')}<br>(${MATH('μ<sub>0</sub>')} = 4π × 10<sup>−7</sup> T·m/A, ${MATH('n')}: 1 m당 감은 수)<br><br>도선의 자기장이 지구 자기장과 수직인 곳에서는 자침이 북쪽에서 돌아간 각 ${MATH('θ')}가 tan ${MATH('θ')} = ${MATH('B')} ÷ ${MATH('B')}<sub>지구</sub>를 따릅니다. 심화에서 직선 도선은 판 위에 눕혀 있습니다. 장치를 돌려 도선을 자침과 나란히 놓으면, 도선 바로 아래에서 도선의 자기장이 지구 자기장과 수직이 됩니다.` },
    ],
  },

  // writing on the chalkboard (1024 x 400)
  board(g) {
    g.fillStyle = 'rgba(255,255,255,0.9)'; g.font = '56px Georgia, serif'; g.fillText('전류의 자기 작용', 60, 96);
    // a wire through a board, and the circles of its field
    g.strokeStyle = 'rgba(255,255,255,0.85)'; g.lineWidth = 4;
    for (const r of [34, 68, 102]) { g.beginPath(); g.ellipse(420, 260, r * 2, r * 0.7, 0, 0, Math.PI * 2); g.stroke(); }
    g.lineWidth = 6; g.beginPath(); g.moveTo(420, 150); g.lineTo(420, 260); g.moveTo(420, 300); g.lineTo(420, 370); g.stroke();
    g.beginPath(); g.moveTo(406, 172); g.lineTo(420, 148); g.lineTo(434, 172); g.stroke();
    g.font = '34px Georgia, serif'; g.fillText('I', 444, 176); g.fillText('B', 650, 268);
  },

  // Builds the apparatus on the bench (world) and returns { update(dt) }.
  create({ T, kit, world, view, ctx }) {
    const { mat, glow, add, box, cyl, canvasTexture } = kit;
    world.userData.things.visible = false;   // the apparatus is turned round on the bench: it needs the room
    const M = { dark: mat(0x3a4057), steel: mat(0x8f96a8), pale: mat(0xf2efe9), copper: mat(0xc58a4f, { roughness: 0.45, metalness: 0.3 }), red: mat(0xc8392f, { roughness: 0.7 }), black: mat(0x2b2b2b, { roughness: 0.7 }) };
    const INK = { field: 0x2f7d5c, flow: 0xe3a93b };

    // ---------- the board, the supply and the three wires ----------
    // Everything stands in one group (rig), which is turned about the upright in the advanced mode. Inside it x runs
    // to the right, z towards the viewer; the top of the board is at the height BY, and heights of the wires are
    // counted from there. COIL: the solenoid, 28 cm long and 7 cm across.
    const BY = 1.0, WIDE = 5.2, DEEP = 3.6, COIL = { long: 2.8, r: 0.35 }, SUPPLY = [-1.7, 2.7];
    const rig = new T.Group(); world.add(rig);
    add(rig, box(WIDE, 0.04, DEEP), mat(0xe4d5b0, { roughness: 0.95 }), 0, BY - 0.02, 0);
    for (const x of [-1, 1]) for (const z of [-1, 1]) add(rig, cyl(0.05, 0.05, BY - 0.04, 10), M.steel, x * (WIDE / 2 - 0.15), (BY - 0.04) / 2, z * (DEEP / 2 - 0.15));
    // the supply: its knob sets the current, the switch at its right turns the current round
    add(rig, box(1.5, 0.7, 1.0), mat(0x5b6b8c), SUPPLY[0], 0.35, SUPPLY[1]); add(rig, box(0.6, 0.02, 0.3), glow(0xcfe9d2), SUPPLY[0] - 0.3, 0.71, SUPPLY[1] - 0.2, false, false);
    const KNOB = [SUPPLY[0] + 0.3, SUPPLY[1] + 0.15];
    const knob = add(rig, cyl(0.18, 0.18, 0.14, 24), M.dark, KNOB[0], 0.77, KNOB[1]); add(knob, box(0.04, 0.02, 0.16), glow(0xf3eedf), 0, 0.075, -0.07, false, false);
    const knobHandle = add(rig, cyl(0.36, 0.36, 0.5, 12), M.dark, KNOB[0], 0.8, KNOB[1], false, false); knobHandle.visible = false; knobHandle.userData.grip = { kind: 'knob' };
    const rocker = add(rig, box(0.16, 0.08, 0.3), mat(0xc8392f), SUPPLY[0] + 0.6, 0.73, SUPPLY[1] - 0.2);
    const rockerHandle = add(rig, box(0.4, 0.5, 0.6), M.dark, SUPPLY[0] + 0.6, 0.85, SUPPLY[1] - 0.2, false, false); rockerHandle.visible = false; rockerHandle.userData.grip = { kind: 'switch' };
    // a thin lead through the given points
    const UP = new T.Vector3(0, 1, 0), from = new T.Vector3(), to = new T.Vector3();
    function lead(parent, paint, points) {
      for (let k = 1; k < points.length; k++) {
        from.set(...points[k - 1]); to.set(...points[k]);
        const line = add(parent, cyl(0.02, 0.02, from.distanceTo(to), 6), paint, (from.x + to.x) / 2, (from.y + to.y) / 2, (from.z + to.z) / 2, false);
        line.quaternion.setFromUnitVectors(UP, to.sub(from).normalize());
      }
    }
    const OUT = [[SUPPLY[0] - 0.3, 0.03, SUPPLY[1] - 0.5], [SUPPLY[0] + 0.3, 0.03, SUPPLY[1] - 0.5]];   // where the two leads leave the supply
    const wires = { line: new T.Group(), flat: new T.Group(), loop: new T.Group(), coil: new T.Group() };
    for (const one of Object.values(wires)) rig.add(one);
    // the straight wire: upright through the middle, held at its top by a stand behind the board
    add(wires.line, cyl(0.03, 0.03, 2.6, 12), M.copper, 0, 1.33, 0);
    add(wires.line, cyl(0.04, 0.04, 2.7, 10), M.steel, 0, 1.35, -DEEP / 2 - 0.4); add(wires.line, box(0.5, 0.08, 0.5), M.dark, 0, 0.04, -DEEP / 2 - 0.4); add(wires.line, box(0.06, 0.06, DEEP / 2 + 0.4), M.dark, 0, 2.63, -(DEEP / 2 + 0.4) / 2);
    lead(wires.line, M.red, [OUT[0], [-0.6, 0.03, 2.0], [-0.6, 0.03, 0], [0, 0.03, 0]]);
    lead(wires.line, M.black, [OUT[1], [2.9, 0.03, 2.2], [2.9, 0.03, -DEEP / 2 - 0.7], [0.15, 0.03, -DEEP / 2 - 0.7], [0.15, 2.6, -DEEP / 2 - 0.45], [0, 2.6, 0]]);
    // the straight wire of the advanced mode: lying over the board from front to back, on two stands, at the height set
    const REACH = DEEP / 2 + 0.5, lying = new T.Group(); wires.flat.add(lying);   // (lying: the wire and its clamps, at the height of the wire)
    add(lying, cyl(0.03, 0.03, 2 * REACH, 12).rotateX(Math.PI / 2), M.copper, 0, 0, 0);
    for (const z of [-REACH, REACH]) { add(lying, box(0.14, 0.1, 0.1), M.dark, 0, 0, z); add(wires.flat, cyl(0.04, 0.04, 2.3, 10), M.steel, 0.1, 1.15, z); add(wires.flat, box(0.5, 0.08, 0.5), M.dark, 0.1, 0.04, z); }
    const flatLeads = new T.Group(); wires.flat.add(flatLeads);
    const wireHandles = [-REACH, REACH].map((z) => { const handle = add(rig, box(0.6, 0.6, 0.6), M.dark, 0, 0, z, false, false); handle.visible = false; handle.userData.grip = { kind: 'wire' }; return handle; });
    let flatFor = 0;   // the height the leads of the lying wire were last made for
    // the ring: a hoop of radius 1, drawn to the radius set, half above the board and half below
    const hoop = add(wires.loop, new T.TorusGeometry(1, 0.045, 10, 72), M.copper, 0, BY, 0);
    const loopLeads = new T.Group(); wires.loop.add(loopLeads);
    let leadsFor = 0;   // the radius the leads of the ring were last made for
    // the solenoid: a hoop for each turn
    const TURNS = 60, hoops = new T.InstancedMesh(new T.TorusGeometry(COIL.r, 0.018, 8, 40).rotateY(Math.PI / 2), M.copper, TURNS); hoops.frustumCulled = false; wires.coil.add(hoops);
    lead(wires.coil, M.red, [OUT[0], [-COIL.long / 2 - 0.2, 0.03, 2.0], [-COIL.long / 2 - 0.2, 0.03, 0], [-COIL.long / 2 - 0.2, BY - COIL.r, 0], [-COIL.long / 2, BY - COIL.r, 0]]);
    lead(wires.coil, M.black, [OUT[1], [COIL.long / 2 + 0.2, 0.03, 2.2], [COIL.long / 2 + 0.2, 0.03, 0], [COIL.long / 2 + 0.2, BY - COIL.r, 0], [COIL.long / 2, BY - COIL.r, 0]]);
    // which way the current runs: an arrow beside the straight wire, over the ring, over three turns of the solenoid
    const flows = [0, 1, 2].map(() => { const arrow = kit.arrow(INK.flow, 0.035); arrow.setLength(0.55); arrow.visible = false; rig.add(arrow); return arrow; });
    // in the advanced mode: a gold knob at the near right corner of the board, by which the apparatus is turned, and the north marked on the bench
    const corner = add(rig, new T.SphereGeometry(0.09, 16, 10), glow(0xe3c26b), WIDE / 2, BY + 0.05, DEEP / 2, false, false);
    const cornerHandle = add(rig, new T.SphereGeometry(0.3, 10, 8), M.dark, WIDE / 2, BY + 0.05, DEEP / 2, false, false); cornerHandle.visible = false; cornerHandle.userData.grip = { kind: 'turn' };
    const north = new T.Group(); north.position.set(-4.4, 0.02, 1.9); world.add(north);
    add(north, box(0.1, 0.02, 1.1), M.red, 0, 0, 0, false, false); add(north, new T.ConeGeometry(0.2, 0.4, 3).rotateX(-Math.PI / 2), M.red, 0, 0, -0.72, false, false).scale.y = 0.15;
    const northSpot = new T.Vector3(-3.9, 0.02, 1.5), northLabel = view.label(northSpot);

    // ---------- the compasses and the marks ----------
    // HOME: where the six compasses stand at first with each wire; number 1 is the one the table and the graph of the current go by.
    const COMPASSES = 6, CASE = 0.14;
    const HOME = { line: [[0.5, 0], [0, 0.5], [-0.5, 0], [0, -0.5], [1.0, 0], [1.5, 0]], flat: [[0, 0], [0, 1.0], [0, -1.0], [0.5, 0], [1.0, 0], [-0.5, 0]], loop: [[0, 0], [0, 0.9], [0, -0.9], [-1.4, 0], [1.4, 0], [1.3, 0.9]], coil: [[0, 0], [-1.9, 0], [1.9, 0], [0, 1.0], [0, -1.0], [0.9, 0]] };
    const spots = { line: HOME.line.map((p) => [...p]), flat: HOME.flat.map((p) => [...p]), loop: HOME.loop.map((p) => [...p]), coil: HOME.coil.map((p) => [...p]) };
    const compasses = Array.from({ length: COMPASSES }, (unused, k) => {
      const body = new T.Group(); rig.add(body);
      add(body, cyl(CASE, CASE, 0.05, 28), M.pale, 0, 0.025, 0); add(body, cyl(CASE + 0.012, CASE + 0.012, 0.035, 28), M.dark, 0, 0.0175, 0);
      const needle = new T.Group(); needle.position.y = 0.06; body.add(needle);
      add(needle, box(0.11, 0.012, 0.036), mat(0xd8402f), 0.055, 0, 0, false, false); add(needle, box(0.11, 0.012, 0.036), mat(0x2a5fd0), -0.055, 0, 0, false, false); add(needle, cyl(0.014, 0.014, 0.02, 8), M.dark, 0, 0, 0, false, false);
      const handle = add(rig, cyl(0.28, 0.28, 0.3, 12), M.dark, 0, 0, 0, false, false); handle.visible = false; handle.userData.grip = { kind: 'compass', k };   // (wider than the compass, for a finger)
      const spot = new T.Vector3();
      return { body, needle, handle, spot, label: view.label(spot), aim: Math.random() * Math.PI * 2, unit: [0, 0] };   // (aim: the way its needle points; unit: the field there for 1 A)
    });
    // the field on the board as arrows, as long as it is strong: a tail at every point of a grid (none close to the wire)
    const GRID = [];
    for (let j = -4; j <= 4; j++) for (let i = -6; i <= 6; i++) GRID.push([i * 0.4, j * 0.4]);
    const LONG = { line: 0.03, flat: 0.02, loop: 0.012, coil: 0.0007 }, HEAD = 0.11;   // the length of an arrow for 1 μT with each wire; the length of its head
    const fieldInk = new T.MeshBasicMaterial({ color: INK.field });
    const shafts = new T.InstancedMesh(box(1, 0.008, 0.04).translate(0.5, 0, 0), fieldInk, GRID.length), heads = new T.InstancedMesh(new T.ConeGeometry(0.065, HEAD, 3).rotateZ(-Math.PI / 2).translate(HEAD / 2, 0, 0).scale(1, 0.12, 1), fieldInk, GRID.length);
    // iron filings (a model): many small dark grains all over the board, of several sizes and shades, each a little
    // longer than wide and turned along the field where that is strong enough
    const DASHES = 2400, dashes = new T.InstancedMesh(cyl(0.5, 0.5, 0.008, 6).scale(0.05, 1, 0.022), new T.MeshBasicMaterial({ color: 0xffffff }), DASHES);
    const grains = Array.from({ length: DASHES }, (unused, k) => [-WIDE / 2 + 0.08 + (WIDE - 0.16) * ((k % 60) + Math.random()) / 60, -DEEP / 2 + 0.08 + (DEEP - 0.16) * (Math.floor(k / 60) + Math.random()) / 40, Math.random() * Math.PI, 0, 0, 0.6 + 0.8 * Math.random()]);   // x, z, the way it lies at first, the way of the field, the field for 1 A, its size
    { const shade = new T.Color(); grains.forEach((grain, k) => dashes.setColorAt(k, shade.setScalar(0.1 + 0.2 * Math.random()))); }
    const FIRM = { line: 4, flat: 4, loop: 8, coil: 30 };   // the field in which the filings lie fully along it (μT)
    for (const mesh of [shafts, heads, dashes]) { mesh.frustumCulled = false; mesh.visible = false; rig.add(mesh); }
    // lines of the field (a model): thin lines on the board, the more of them the stronger the current, with a head on each
    const MOST = 14000, linePlaces = new T.BufferAttribute(new Float32Array(MOST * 6), 3), lineGeo = new T.BufferGeometry(); lineGeo.setAttribute('position', linePlaces);
    const lineMesh = new T.LineSegments(lineGeo, new T.LineBasicMaterial({ color: INK.field })); lineMesh.frustumCulled = false; lineMesh.visible = false; rig.add(lineMesh);
    const lineHeads = new T.InstancedMesh(new T.ConeGeometry(0.06, 0.16, 3).rotateZ(-Math.PI / 2).scale(1, 0.12, 1), fieldInk, 16); lineHeads.frustumCulled = false; lineHeads.visible = false; rig.add(lineHeads);
    const supplySpot = new T.Vector3(), supplyLabel = view.label(supplySpot);
    const listSpot = new T.Vector3(), listLabel = view.label(listSpot, true);   // with the values on: what is found where each compass stands and, in the advanced mode, what the formula gives
    const tipSpot = new T.Vector3(), tip = view.label(tipSpot);   // what is being set, while something is handled

    // ---------- physics ----------
    // geo: the wire as straight pieces [ax, ay, az, bx, by, bz, …] with the current running from a to b (heights from
    // the board), made anew when the wire is changed. The field of a piece at the point P, with u = a − P and
    // v = b − P, is (u × v) (|u| + |v|) / (|u| |v| (|u| |v| + u·v)) for 1 A, in μT.
    const geo = { key: '', pieces: new Float32Array(0), lines: null, sifted: false };   // (sifted: the field at the filings has been found for this wire)
    function pieces(shape, radius, turns) {
      const list = [];
      if (shape === 'line') list.push(0, -500, 0, 0, 500, 0);   // (50 m each way: as good as endless)
      else if (shape === 'flat') list.push(0, gap(), 500, 0, gap(), -500);   // (the lying wire: from the front to the back)
      else if (shape === 'loop') for (let k = 0; k < 96; k++) { const a = 2 * Math.PI * k / 96, b = 2 * Math.PI * (k + 1) / 96; list.push(radius * Math.cos(a), radius * Math.sin(a), 0, radius * Math.cos(b), radius * Math.sin(b), 0); }
      else for (let n = 0; n < turns; n++) { const x = -COIL.long / 2 + COIL.long * (n + 0.5) / turns; for (let k = 0; k < 24; k++) { const a = 2 * Math.PI * k / 24, b = 2 * Math.PI * (k + 1) / 24; list.push(x, COIL.r * Math.cos(a), COIL.r * Math.sin(a), x, COIL.r * Math.cos(b), COIL.r * Math.sin(b)); } }
      return Float32Array.from(list);
    }
    function fieldAt(x, z, out) {   // the field on the board at (x, z) for 1 A: out = [along x, along z]
      const p = geo.pieces; let bx = 0, bz = 0;
      for (let i = 0; i < p.length; i += 6) {
        const ux = p[i] - x, uy = p[i + 1], uz = p[i + 2] - z, vx = p[i + 3] - x, vy = p[i + 4], vz = p[i + 5] - z;
        const a = Math.sqrt(ux * ux + uy * uy + uz * uz), b = Math.sqrt(vx * vx + vy * vy + vz * vz), k = (a + b) / (a * b * (a * b + ux * vx + uy * vy + uz * vz));
        bx += k * (uy * vz - uz * vy); bz += k * (ux * vy - uy * vx);
      }
      out[0] = bx; out[1] = bz;
    }
    const radius = () => ctx.values.radius / 10, gap = () => ctx.values.gap / 10, amps = () => (ctx.values.reversed ? -1 : 1) * ctx.values.amps, turnBy = () => (ctx.advanced ? ctx.values.turn * Math.PI / 180 : 0);
    const wire = () => (ctx.advanced && ctx.values.shape === 'line' ? 'flat' : ctx.values.shape);   // which wire is there: in the advanced mode the straight one lies over the board
    // how far a point of the board is from where the wire goes through it
    function clear(x, z) {
      const shape = wire();
      if (shape === 'flat') return Infinity;
      if (shape === 'line') return Math.hypot(x, z);
      if (shape === 'loop') return Math.min(Math.hypot(x - radius(), z), Math.hypot(x + radius(), z));
      const past = Math.max(0, Math.abs(x) - COIL.long / 2);
      return Math.min(Math.hypot(past, z - COIL.r), Math.hypot(past, z + COIL.r));
    }
    // A line of the field from a start, followed both ways along the field (half a step ahead, then the whole step)
    // until it closes on itself, leaves the board or comes to the wire: [x, z, x, z, …].
    const f = [0, 0];
    function follow(x0, z0) {
      const STEP = 0.04, ways = [];
      let closed = false;
      for (const sign of [1, -1]) {
        const run = []; let x = x0, z = z0;
        for (let n = 0; n < 700 && !closed; n++) {
          fieldAt(x, z, f); let size = Math.hypot(f[0], f[1]) || 1;
          fieldAt(x + sign * STEP / 2 * f[0] / size, z + sign * STEP / 2 * f[1] / size, f); size = Math.hypot(f[0], f[1]) || 1;
          x += sign * STEP * f[0] / size; z += sign * STEP * f[1] / size;
          if (Math.abs(x) > WIDE / 2 || Math.abs(z) > DEEP / 2 || clear(x, z) < 0.05) break;
          run.push(x, z);
          if (n > 8 && Math.hypot(x - x0, z - z0) < STEP * 0.9) closed = true;
        }
        ways.push(run);
      }
      const back = []; for (let k = ways[1].length - 2; k >= 0; k -= 2) back.push(ways[1][k], ways[1][k + 1]);
      return closed ? [x0, z0, ...ways[0], x0, z0] : [...back, x0, z0, ...ways[0]];
    }
    // the lines there may be with this wire, the first to be shown first, each { points: [x, y, z, …], mid: where its
    // head goes }: circles round the straight wire with radii that grow by the same factor (the same share of the
    // field between each two), on the board for the upright wire and standing round the lying one; lines on the
    // board through the ring and the solenoid
    function lines() {
      if (geo.lines) return geo.lines;
      const shape = wire();
      if (shape === 'flat') {
        geo.lines = [0.32, 0.2, 0.5].flatMap((r) => [0, 1.2, -1.2].map((z) => {
          const points = [];
          for (let k = 0; k <= 64; k++) { const a = -2 * Math.PI * k / 64; points.push(r * Math.cos(a), BY + gap() + r * Math.sin(a), z); }   // (round the way the field goes with the current running to the back)
          return { points, mid: 48 * 3 };   // the head at the top of the circle
        }));
        return geo.lines;
      }
      const starts = shape === 'line' ? [0.76, 0.36, 1.6, 0.25, 0.53, 1.1].map((r) => [r, 0]) : [0, 0.62, -0.62, 0.35, -0.35, 0.82, -0.82].map((part) => (shape === 'loop' ? [part * radius(), 0] : [0, part * COIL.r]));
      geo.lines = starts.map(([x, z]) => { const flat = follow(x, z), points = []; for (let i = 0; i < flat.length; i += 2) points.push(flat[i], BY + 0.012, flat[i + 1]); return { points, mid: Math.floor(points.length / 6) * 3 }; });
      return geo.lines;
    }
    // now: what is found where compass 1 stands; tried: the currents tried with everything else as it is; radii: the radii of the ring tried with the current as it is
    // heights: the heights of the lying wire tried with everything else as it is; bearing: where the north lies, as an angle from the far wall of the room towards the right
    const now = { field: 0, far: 0, swing: 0 }, tried = { key: '', at: new Map() }, radii = { key: '', at: new Map() }, heights = { key: '', at: new Map() };
    let bearing = 0;
    let moved = true, stopSoon = false, tipTime = 0, framed = false, grab = null, fresh = false, since = 0;
    const tall = () => window.matchMedia('(max-aspect-ratio: 4/5)').matches;
    const spotAt = (spot, x, y, z) => spot.set(x, y, z).applyAxisAngle(UP, turnBy());   // a point of the rig, as the room has it
    function say(text, x, y, z, seconds = 0) { tip.write(text); spotAt(tipSpot, x, y, z); tip.show(true); tipTime = seconds; moved = true; }
    // the Earth's field as the rig has it: towards the north of the room, whichever way the rig is turned
    const earth = () => (ctx.advanced ? [EARTH * Math.sin(bearing + turnBy()), -EARTH * Math.cos(bearing + turnBy())] : [0, 0]);
    const away = (x, z) => (wire() === 'flat' ? Math.hypot(x, gap()) : Math.hypot(x, z)) * 10;   // how far a point of the board is from the straight wire (cm)
    // Everything that follows from the wire, the current and where the compasses stand.
    function reckon() {
      const v = ctx.values, shape = wire(), key = `${shape}/${shape === 'loop' ? v.radius : shape === 'coil' ? v.turns : shape === 'flat' ? v.gap : ''}`;
      if (key !== geo.key) {   // another wire: its pieces, and the field at the grid for 1 A
        geo.key = key; geo.pieces = pieces(shape, radius(), v.turns); geo.lines = null;
        for (const point of GRID) { fieldAt(point[0], point[1], f); point[2] = f[0]; point[3] = f[1]; point[4] = clear(point[0], point[1]) >= 0.25; }
        geo.sifted = false;
      }
      const places = spots[shape];
      compasses.forEach((one, k) => { fieldAt(places[k][0], places[k][1], f); one.unit[0] = f[0]; one.unit[1] = f[1]; });
      // compass 1: the field of the wire there, how far it is from the straight wire, how far its needle is turned from the north
      const first = compasses[0], I = amps(), E = earth(), bx = I * first.unit[0], bz = I * first.unit[1];
      now.field = Math.hypot(bx, bz); now.far = away(places[0][0], places[0][1]);
      now.swing = ctx.advanced ? Math.abs(Math.atan2((bx + E[0]) * E[1] - (bz + E[1]) * E[0], (bx + E[0]) * E[0] + (bz + E[1]) * E[1])) * 180 / Math.PI : 0;
      // the graphs: the field against the distance (the six compasses round the upright wire; compass 1 under the lying
      // wire, for the heights tried); the field at compass 1 against the current, for the currents tried
      const where = `${places[0][0].toFixed(2)},${places[0][1].toFixed(2)}`;
      ctx.traces.br.clear();
      if (shape === 'line') for (const [far, field] of compasses.map((one, k) => [away(places[k][0], places[k][1]), Math.abs(I) * Math.hypot(one.unit[0], one.unit[1])]).sort((a, b) => a[0] - b[0])) ctx.traces.br.add(far, field);
      if (shape === 'flat') {
        if (heights.key !== `${v.amps}/${where}`) { heights.key = `${v.amps}/${where}`; heights.at.clear(); }
        heights.at.set(v.gap, [now.far, now.field]);
        for (const [far, field] of [...heights.at.values()].sort((a, b) => a[0] - b[0])) ctx.traces.br.add(far, field);
      }
      const same = `${key}/${where}`;
      if (same !== tried.key) { tried.key = same; tried.at.clear(); }
      tried.at.set(v.amps, now.field);
      ctx.traces.bi.clear();
      for (const [current, field] of [...tried.at].sort((a, b) => a[0] - b[0])) ctx.traces.bi.add(current, field);
      // the field at the middle of the ring against its radius, for the radii tried with this current
      if (shape === 'loop') {
        if (radii.key !== String(v.amps)) { radii.key = String(v.amps); radii.at.clear(); }
        fieldAt(0, 0, f); radii.at.set(v.radius, Math.abs(I) * Math.hypot(f[0], f[1]));
      }
      ctx.traces.bR.clear();
      for (const [far, field] of [...radii.at].sort((a, b) => a[0] - b[0])) ctx.traces.bR.add(far, field);
      fresh = true; since = performance.now(); moved = true;
    }
    // a line of the table for how things stand, unless it is the line last written
    function note() {
      fresh = false;
      const v = ctx.values, shape = wire(), row = [SHAPES[v.shape], shape === 'loop' ? `반지름 ${v.radius} cm` : shape === 'coil' ? `${v.turns}회` : shape === 'flat' ? `높이 ${v.gap} cm` : '–', tenth(v.amps), v.shape === 'line' ? tenth(now.far) : '–', tenth(now.field), whole(now.swing)];
      const rows = ctx.tables.table.rows, above = rows[rows.length - 1];
      if (!above || above.some((cell, i) => cell !== row[i])) ctx.tables.table.add(row);
    }
    // Where a compass may stand: on the board, clear of the wire and of the other compasses.
    function settle(k, x, z) {
      const shape = wire(), places = spots[shape], KEEP = CASE + 0.08;
      x = Math.max(-WIDE / 2 + CASE, Math.min(WIDE / 2 - CASE, x)); z = Math.max(-DEEP / 2 + CASE, Math.min(DEEP / 2 - CASE, z));
      if (clear(x, z) < KEEP) {
        if (shape === 'coil' && Math.abs(x) <= COIL.long / 2) { const row = z > 0 ? COIL.r : -COIL.r; z = row + (z >= row ? KEEP : -KEEP); }   // off the row of turns, to the side it is on
        else {   // away from the nearest place where the wire goes through
          const hole = shape === 'line' ? [0, 0] : shape === 'loop' ? [x > 0 ? radius() : -radius(), 0] : [x > 0 ? COIL.long / 2 : -COIL.long / 2, z > 0 ? COIL.r : -COIL.r];
          const far = Math.hypot(x - hole[0], z - hole[1]) || 1e-6; x = hole[0] + (x - hole[0]) / far * KEEP; z = hole[1] + (z - hole[1]) / far * KEEP;
        }
      }
      for (let other = 0; other < COMPASSES; other++) if (other !== k) {
        const far = Math.hypot(x - places[other][0], z - places[other][1]);
        if (far < 2 * CASE + 0.02) { const push = far || 1e-6; x = places[other][0] + (x - places[other][0]) / push * (2 * CASE + 0.02); z = places[other][1] + (z - places[other][1]) / push * (2 * CASE + 0.02); }
      }
      return [x, z];
    }
    function toStart() {
      for (const shape of Object.keys(HOME)) spots[shape] = HOME[shape].map((p) => [...p]);
      for (const one of compasses) one.aim = Math.random() * Math.PI * 2;   // (with no field a needle may point any way)
      bearing = (1 + Math.floor(Math.random() * 23)) * 15 * Math.PI / 180;   // the north: somewhere else every time, a whole number of the steps the rig is turned by
      tried.key = ''; tried.at.clear(); radii.key = ''; radii.at.clear(); heights.key = ''; heights.at.clear();
      reckon();
    }

    // ---------- handling ----------
    // A compass is carried over the board. The knob of the supply is turned by sliding it sideways, its switch is
    // pressed; in the advanced mode the gold corner of the board is carried round to turn the apparatus, and the lying
    // wire is lifted or lowered by either of its ends.
    const ray = new T.Raycaster(), level = new T.Plane(new T.Vector3(0, 1, 0), 0), hit = new T.Vector3();
    function pointer(r, y) {   // where the pointer meets the height y, as the rig has it; and how far to the right that is as the room has it
      level.constant = -y;
      if (!r.intersectPlane(level, hit)) return null;
      const across = hit.x;
      hit.applyAxisAngle(UP, -turnBy());
      return [hit.x, hit.z, across];
    }
    const tool = {
      handles: () => [...(ctx.advanced ? [cornerHandle] : []), ...(wire() === 'flat' ? wireHandles : []), knobHandle, rockerHandle, ...compasses.map((one) => one.handle)],
      start(grip, r) {
        const p = pointer(r, grip.kind === 'compass' || grip.kind === 'turn' ? BY : grip.kind === 'wire' ? BY + gap() : 0.8), key = { knob: 'amps', switch: 'reversed', turn: 'turn', wire: 'gap' }[grip.kind];
        if (!p) return false;
        if (key && ctx.locked.has(key)) { say('잠금', p[0], 1.6, p[1], 1.2); return false; }
        grab = { ...grip, from: p, amps: ctx.values.amps, turn: ctx.values.turn, gap: ctx.values.gap, moved: false };
        if (grip.kind === 'compass') { const place = spots[wire()][grip.k]; grab.off = [place[0] - p[0], place[1] - p[1]]; }
        if (grip.kind === 'wire') {   // an upright plane through the middle of the rig, as square to the view as may be: the height of the pointer on it
          grab.plane = new T.Plane(Math.abs(r.direction.z) >= Math.abs(r.direction.x) ? new T.Vector3(0, 0, 1) : new T.Vector3(1, 0, 0), 0);
          if (!r.intersectPlane(grab.plane, hit)) { grab = null; return false; }
          grab.height = hit.y;
        }
        if (grip.kind === 'turn') { level.constant = -BY; r.intersectPlane(level, hit); grab.angle = Math.atan2(hit.x, hit.z); }   // (where the pointer is round the middle of the rig, as the room has it)
        return true;
      },
      move(r) {
        if (grab.kind === 'turn') {
          level.constant = -BY;
          if (!r.intersectPlane(level, hit)) return;
          const swung = (Math.atan2(hit.x, hit.z) - grab.angle) * 180 / Math.PI, toward = ((Math.round((grab.turn + swung) / 15) * 15) % 360 + 360) % 360;
          if (toward !== ctx.values.turn) ctx.set('turn', toward);
          say(`${toward}°`, WIDE / 2, BY + 0.6, DEEP / 2);
          return;
        }
        if (grab.kind === 'wire') {
          if (!r.intersectPlane(grab.plane, hit)) return;
          const toward = Math.max(2, Math.min(10, Math.round(grab.gap + (hit.y - grab.height) * 10)));
          if (toward !== ctx.values.gap) ctx.set('gap', toward);
          say(`높이 ${toward} cm`, 0, BY + toward / 10 + 0.5, REACH);
          return;
        }
        const p = pointer(r, grab.kind === 'compass' ? BY : 0.8);
        if (!p) return;
        if (Math.hypot(p[0] - grab.from[0], p[1] - grab.from[1]) > 0.08) grab.moved = true;
        if (grab.kind === 'knob') {   // 3 cm sideways for each 0.5 A: sideways as the room has it, however the apparatus is turned
          const toward = Math.max(0, Math.min(5, grab.amps + Math.round((p[2] - grab.from[2]) / 0.3) * 0.5));
          if (toward !== ctx.values.amps) ctx.set('amps', toward);
          say(`${tenth(ctx.values.amps)} A`, KNOB[0], 1.5, KNOB[1]);
        } else if (grab.kind === 'compass') {
          const place = spots[wire()][grab.k], next = settle(grab.k, p[0] + grab.off[0], p[1] + grab.off[1]);
          place[0] = next[0]; place[1] = next[1];
          reckon();
        }
      },
      end(done) { if (done.kind === 'switch') ctx.set('reversed', !ctx.values.reversed); },
    };

    const place = new T.Matrix4(), turnTo = new T.Matrix4(), way = new T.Vector3(), stretch = new T.Vector3();
    function draw() {
      const v = ctx.values, shape = wire(), I = amps(), size = Math.abs(I), deep = ctx.advanced, places = spots[shape], E = earth();
      rig.rotation.y = turnBy();
      for (const [id, group] of Object.entries(wires)) group.visible = id === shape;
      knob.rotation.y = -v.amps / 5 * 4.2; rocker.rotation.z = v.reversed ? -0.25 : 0.25;
      corner.visible = deep; north.visible = deep && v.north; northLabel.write('북(N)'); northLabel.show(deep && v.north);
      if (tall()) { north.position.set(2.4, 0.02, 3.9); northSpot.set(2.4, 0.3, 3.9); } else { north.position.set(-4.4, 0.02, 1.9); northSpot.set(-4.4, 0.3, 1.9); }   // (the north, if it is shown: marked at the near left of the bench; on an upright screen at the near right)
      north.rotation.y = -bearing;
      // the lying wire at its height
      if (shape === 'flat') {
        lying.position.y = BY + gap(); for (const handle of wireHandles) handle.position.y = BY + gap();
        if (flatFor !== v.gap) {
          flatFor = v.gap;
          while (flatLeads.children.length) { flatLeads.children[0].geometry.dispose(); flatLeads.remove(flatLeads.children[0]); }
          lead(flatLeads, M.red, [OUT[0], [-0.3, 0.03, REACH + 0.2], [0, BY + gap(), REACH]]);
          lead(flatLeads, M.black, [OUT[1], [2.9, 0.03, 2.2], [2.9, 0.03, -REACH - 0.3], [0.3, 0.03, -REACH - 0.3], [0, BY + gap(), -REACH]]);
        }
      }
      // the ring at its radius, the turns of the solenoid
      if (shape === 'loop') {
        hoop.scale.setScalar(radius());
        if (leadsFor !== v.radius) {
          leadsFor = v.radius;
          while (loopLeads.children.length) { loopLeads.children[0].geometry.dispose(); loopLeads.remove(loopLeads.children[0]); }
          lead(loopLeads, M.red, [OUT[0], [-0.25, 0.03, 2.0], [-0.25, 0.03, 0], [-0.06, BY - radius(), 0]]);
          lead(loopLeads, M.black, [OUT[1], [0.6, 0.03, 2.2], [0.25, 0.03, 0], [0.06, BY - radius(), 0]]);
        }
      }
      if (shape === 'coil') {
        for (let n = 0; n < v.turns; n++) hoops.setMatrixAt(n, place.makeTranslation(-COIL.long / 2 + COIL.long * (n + 0.5) / v.turns, BY, 0));
        hoops.count = v.turns; hoops.instanceMatrix.needsUpdate = true;
      }
      // which way the current runs
      const marks = shape === 'line' ? [[0.16, BY + 1.0, 0, 0, 1, 0]] : shape === 'flat' ? [[0, BY + gap() + 0.14, 0.9, 0, 0, -1]] : shape === 'loop' ? [[0, BY + radius() + 0.14, 0, -1, 0, 0]] : [-0.9, 0, 0.9].map((x) => [x, BY + COIL.r + 0.12, 0, 0, 0, 1]);
      flows.forEach((arrow, k) => {
        arrow.visible = v.flow && size > 0 && k < marks.length;
        if (!arrow.visible) return;
        const [x, y, z, dx, dy, dz] = marks[k], sign = I > 0 ? 1 : -1;
        arrow.position.set(x - sign * dx * 0.275, y - sign * dy * 0.275, z - sign * dz * 0.275); arrow.aim(way.set(sign * dx, sign * dy, sign * dz));
      });
      // the compasses
      compasses.forEach((one, k) => {
        one.body.position.set(places[k][0], BY, places[k][1]); one.handle.position.set(places[k][0], BY + 0.1, places[k][1]);
        one.needle.rotation.y = -one.aim;
        spotAt(one.spot, places[k][0], BY + 0.16, places[k][1]);
        one.label.write(`<b>${k + 1}</b>`); one.label.show(true);
      });
      // the values: a line for each compass and, in the advanced mode, what the formula gives for this wire, in one block at the right of the board
      listLabel.show(v.numbers);
      if (v.numbers) {
        const R = radius() / 10, perMetre = v.turns / (COIL.long / 10), middle = [0, 0];
        if (shape === 'loop' || shape === 'coil') fieldAt(0, 0, middle);
        const law = !deep ? [] : shape === 'flat' ? [`나침반 1: ${MATH('μ<sub>0</sub>I')} ÷ 2π${MATH('r')} = ${tenth(0.2 * size / (now.far / 100 || 1))} ${MU}T`]
          : shape === 'loop' ? [`중심: ${MATH('μ<sub>0</sub>I')} ÷ 2${MATH('R')} = ${tenth(0.2 * Math.PI * size / R)} ${MU}T`, `중심의 계산값 ${tenth(size * Math.hypot(middle[0], middle[1]))} ${MU}T`]
            : [`내부: ${MATH('μ<sub>0</sub>nI')} = ${tenth(0.4 * Math.PI * perMetre * size)} ${MU}T (${MATH('n')} = ${whole(perMetre)}회/m)`, `가운데의 계산값 ${tenth(size * Math.hypot(middle[0], middle[1]))} ${MU}T`];
        listLabel.write(compasses.map((one, k) => {
          const field = size * Math.hypot(one.unit[0], one.unit[1]), bx = I * one.unit[0] + E[0], bz = I * one.unit[1] + E[1], parts = [`나침반 <b>${k + 1}</b>`];
          if (shape === 'line' || shape === 'flat') parts.push(`도선에서 ${tenth(away(places[k][0], places[k][1]))} cm`);
          parts.push(`<b>${tenth(field)} ${MU}T</b>`);
          if (deep) parts.push(`북에서 ${whole(Math.abs(Math.atan2(bx * E[1] - bz * E[0], bx * E[0] + bz * E[1])) * 180 / Math.PI)}°`);
          return parts.join(' · ');
        }).concat(law).join('<br>'));
        if (tall()) listSpot.set(0, 0, 4.9); else listSpot.set(WIDE / 2 + 1.0, BY + 0.2, -0.3);   // (it stays where it is in the room when the apparatus is turned)
      }
      // the arrows of the field
      shafts.visible = heads.visible = v.arrows && size > 0;
      if (shafts.visible) {
        let n = 0;
        for (const [x, z, bx, bz, far] of GRID) {
          if (!far) continue;
          const long = LONG[shape] * size * Math.hypot(bx, bz), tip2 = Math.min(1, long / HEAD), stem = Math.max(0, long - HEAD);
          turnTo.makeRotationY(-Math.atan2(I * bz, I * bx));
          place.copy(turnTo).scale(stretch.set(Math.max(stem, 1e-4), 1, 1)).setPosition(x, BY + 0.02, z); shafts.setMatrixAt(n, place);
          way.set(stem, 0, 0).applyMatrix4(turnTo);
          place.copy(turnTo).scale(stretch.set(tip2, 1, tip2)).setPosition(x + way.x, BY + 0.02, z + way.z); heads.setMatrixAt(n, place);
          n++;
        }
        shafts.count = heads.count = n; shafts.instanceMatrix.needsUpdate = heads.instanceMatrix.needsUpdate = true;
      }
      // the filings: each as it lay, turned towards the field by as much as the field is strong
      dashes.visible = v.filings;
      if (v.filings) {
        if (!geo.sifted) {   // the field where each grain lies, for 1 A: found only when the filings are on show
          geo.sifted = true;
          for (const grain of grains) { fieldAt(grain[0], grain[1], f); grain[3] = Math.atan2(f[1], f[0]); grain[4] = clear(grain[0], grain[1]) >= 0.08 ? Math.hypot(f[0], f[1]) : -1; }
        }
        grains.forEach((grain, n) => {
          const share = grain[4] < 0 ? 0 : Math.min(1, size * grain[4] / FIRM[shape]);
          let swing = grain[3] - grain[2]; swing -= Math.PI * Math.round(swing / Math.PI);   // (a grain looks the same turned half round)
          place.makeRotationY(-(grain[2] + swing * share)).scale(stretch.set(grain[5], 1, grain[5])).setPosition(grain[0], BY + 0.005, grain[1]);
          if (grain[4] < 0) place.scale(stretch.set(0, 0, 0));
          dashes.setMatrixAt(n, place);
        });
        dashes.instanceMatrix.needsUpdate = true;
      }
      // the lines of the field: the more of them the stronger the current
      lineMesh.visible = lineHeads.visible = v.lines && size > 0;
      if (lineMesh.visible) {
        const all = lines(), count = Math.max(1, Math.round(all.length * size / 5)), at = linePlaces.array;
        let n = 0;
        for (let k = 0; k < count; k++) {
          const line = all[k].points, mid = all[k].mid;
          for (let i = 0; i + 5 < line.length && n < MOST; i += 3, n++) for (let part = 0; part < 6; part++) at[n * 6 + part] = line[i + part];
          const ahead = Math.min(line.length - 3, mid + 3), back = Math.max(0, ahead - 3), sign = I > 0 ? 1 : -1;
          place.makeRotationY(-Math.atan2(sign * (line[ahead + 2] - line[back + 2]), sign * (line[ahead] - line[back]))).setPosition(line[mid], line[mid + 1] + 0.002, line[mid + 2]); lineHeads.setMatrixAt(k, place);
        }
        linePlaces.needsUpdate = true; lineGeo.setDrawRange(0, n * 2); lineHeads.count = count; lineHeads.instanceMatrix.needsUpdate = true;
      }
      spotAt(supplySpot, SUPPLY[0], 1.1, SUPPLY[1] - 0.3); supplyLabel.write(`전류 <b>${tenth(v.amps)} A</b>`); supplyLabel.show(true);
    }

    const frame = () => view.look(tall() ? { target: [0, 1.0, 1.1], r: 13.5, theta: 0.15, phi: 0.5 } : { target: [0, 1.0, 0.5], r: 7.6, theta: 0.2, phi: 0.78 });
    view.setTool({
      pick(r) {
        ray.ray.copy(r); rig.updateMatrixWorld(true);
        const found = ray.intersectObjects(tool.handles(), false)[0];
        return found ? found.object.userData.grip : null;
      },
      cursor: (grip) => (!grip ? '' : grip.kind === 'switch' ? 'pointer' : 'grab'),
      start: (grip, r) => tool.start(grip, r),
      move(r) { tool.move(r); moved = true; },
      end() {
        const done = grab;
        grab = null; tip.show(false); tipTime = 0; moved = true; since = performance.now();
        if (done) tool.end(done);
      },
    });
    // nothing here changes with time: the clock stops as soon as it is started
    ctx.on('play', (on) => { if (on) { stopSoon = true; say('시간에 따라 변하는 것이 없는 장면입니다', 0, BY + 2.2, 0, 2); } });
    ctx.on('action', (id) => {
      if (id !== 'reset') return;
      for (const [key, value] of [['amps', 0], ['reversed', false], ['radius', 6], ['turns', 40], ['gap', 4], ['turn', 0]]) if (!ctx.locked.has(key) && ctx.values[key] !== value) ctx.set(key, value);
      toStart();
    });
    ctx.on('change', (id) => { moved = true; if (['shape', 'amps', 'reversed', 'radius', 'turns', 'gap', 'turn'].includes(id)) { if (id === 'radius') spots.loop.forEach((p, k) => { const next = settle(k, p[0], p[1]); p[0] = next[0]; p[1] = next[1]; }); reckon(); } });
    ctx.on('mode', () => { reckon(); });   // the Earth's field and the turning of the apparatus count in the advanced mode only

    toStart(); fresh = false;
    return {
      state: () => ({ shape: ctx.values.shape, wire: wire(), bearing: Math.round(bearing * 180 / Math.PI), amps: amps(), now: { ...now }, spots: spots[wire()].map((p) => [...p]), fields: compasses.map((one) => [amps() * one.unit[0], amps() * one.unit[1]]), aims: compasses.map((one) => one.aim), earth: earth(), pieces: geo.pieces.length / 6 }),
      update(dt) {
        if (!framed) { framed = true; if (tall()) frame(); }
        if (stopSoon) { stopSoon = false; ctx.setPlaying(false); }
        if (tipTime > 0) { tipTime -= dt; if (tipTime <= 0) { tip.show(false); moved = true; } }
        if (fresh && !grab && performance.now() - since >= 600) note();
        // each needle turns towards the field where it stands, the faster the stronger the field; with no field it stays
        const I = amps(), E = earth();
        for (const one of compasses) {
          const bx = I * one.unit[0] + E[0], bz = I * one.unit[1] + E[1], strength = Math.hypot(bx, bz);
          if (strength < 0.2) continue;
          let swing = Math.atan2(bz, bx) - one.aim; swing -= 2 * Math.PI * Math.round(swing / (2 * Math.PI));
          if (Math.abs(swing) < 0.002) continue;
          one.aim += swing * (1 - Math.exp(-dt * 7 * Math.min(1, strength / 8))); moved = true;
        }
        if (!moved) return false;
        moved = false; draw();
        return true;
      },
    };
  },
};
