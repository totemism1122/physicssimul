// P-16 The two natures of light and of matter (3D).
//
// The photoelectric effect: an electroscope with a plate of zinc on it, charged with negative charge so that its two
// leaves of foil stand apart, after the textbook's activity. A light is carried to its place over the plate: the
// lamps of a phone (one, two or three of them) or an ultraviolet lamp. While light falls on the plate whose
// frequency is above the threshold of the metal, electrons leave the plate, its charge grows less and the leaves
// close; light below the threshold does nothing, however strong it is and however long it shines. A rod rubbed with
// fur is carried to the plate to charge it again.
// Advanced: a lamp whose frequency and strength are set, other metals (each with its own threshold), a positive
// charge (the electrons that light frees come back to the plate, and the leaves stay apart), and a pane of glass
// (which stops the ultraviolet) between the lamp and the plate.
//
// The double slit for electrons: a gun, a card with two slits and a screen that marks where each electron arrives,
// on a rail (as the double slit of P-14 stands). The sizes are near those of the real experiment: slits 50 nm wide
// and 250 nm apart, the screen 0.25 m behind them, electrons of 1.0 to 2.0 × 10^7 m/s (a wavelength of 73 pm to
// 36 pm), so that the bands on the screen are some tens of μm apart. Neither the slits nor the bands could be seen
// at the scale of the rest: the slits are drawn 10 000 times their size, the face of the screen 250 times. While
// the clock runs electrons leave the gun one after another, and each makes a dot on the screen where it arrives:
// one cannot tell where the next will be, yet the dots gather in bands. The way an electron takes is not drawn.
// The card is carried out of its holder and back: without it the dots gather in one broad patch. What would be
// seen were electrons grains and nothing else (a band behind each slit) can be shown.
// Advanced: the speed of the electrons is set by the voltage that speeds them up; neutrons or molecules of
// fullerene (C60) are sent instead of electrons, each within the speeds that give it the same wavelengths (the
// heavier, the slower); the gap between the slits is set.
//
// One unit is 5 cm. The photons and electrons that can be shown are a model: far larger and far fewer than they are.
//
// What is set by hand can be set from the menu as well.
const GOLD = '#e3c26b';
const PLANCK = 0.4136;   // Planck's constant: the energy of a photon in eV is this times its frequency in 10^14 Hz
const METALS = { zinc: { name: '아연', work: 4.3, tint: 0xa9b0b8 }, copper: { name: '구리', work: 4.7, tint: 0xb87333 }, calcium: { name: '칼슘', work: 2.9, tint: 0xd8d6cc }, sodium: { name: '나트륨', work: 2.3, tint: 0xc9ccd2 } };   // (work: the energy an electron needs to leave the metal, eV)
const WHITE = [4.0, 7.5], ULTRA = 11.8, GLASS = 9.0;   // the frequencies of the phone's light and of the ultraviolet lamp (10^14 Hz); glass stops light above this
// the colour of light of a wavelength (nm), as it is drawn (as in P-14)
const HUES = [[400, 150, 60, 255], [440, 80, 80, 255], [490, 0, 200, 255], [530, 40, 225, 80], [580, 255, 235, 40], [620, 255, 120, 30], [700, 255, 48, 36]];
function hue(nm) {
  const at = Math.max(400, Math.min(700, nm)), k = Math.max(1, HUES.findIndex((one) => one[0] >= at)), a = HUES[k - 1], b = HUES[k], s = (at - a[0]) / (b[0] - a[0]);
  return [1, 2, 3].map((i) => a[i] + (b[i] - a[i]) * s);
}
const tintOf = (f) => (f > 7.9 ? [180, 140, 255] : hue(2998 / f));   // of a frequency (10^14 Hz); the ultraviolet, which is not seen, is drawn pale violet
const rad = (deg) => deg * Math.PI / 180;
const onGlow = (values) => values.scene === 'glow', onBeam = (values) => values.scene === 'beam';   // which arrangement an item of a menu belongs to
const H = 6.626e-34, CHARGE = 1.602e-19;   // Planck's constant (J s); the charge of an electron (C)
// what is sent at the two slits: its mass (kg; kg: as it is written) and the name of what sends it
const KINDS = {
  electron: { name: '전자', mass: 9.109e-31, kg: '9.11 ×10<sup>−31</sup>', source: '전자총' },
  neutron: { name: '중성자', mass: 1.675e-27, kg: '1.675 ×10<sup>−27</sup>', source: '중성자 발생 장치' },
  c60: { name: '풀러렌', mass: 1.196e-24, kg: '1.196 ×10<sup>−24</sup>', source: '풀러렌 발생 장치' },
};
const sent = (v, advanced) => KINDS[advanced ? v.kind : 'electron'];
const RATES = { slow: 2, mid: 20, fast: 200 };   // how many electrons arrive at the screen in a second

export default {
  // what is taken for granted, written on screen by the frame
  premise: (v) => (onBeam(v) ? '슬릿은 1만 배, 스크린의 무늬는 250배로 확대해 그렸습니다' : `검전기의 전하는 빛을 비출 때만 줄어든다고 보고, 금속박이 벌어진 각은 전하량에 비례하게 그렸습니다${v.photons || v.electrons ? '. 광자와 전자(모형)는 실제보다 훨씬 크고 적게 그렸습니다' : ''}`),
  fixedViews: ['front', 'top'],
  camera: { target: [0.4, 3.0, 0], r: 16, theta: 0.22, phi: 1.36, rMax: 30 },
  traces: {
    leaf: { window: 40, range: 45, read: (deg) => `${deg.toFixed(1)}°` },   // how far apart the leaves stand (the angle of each from the upright) against time
    // (advanced) not against time, for what has been tried: the greatest energy of the electrons freed (eV) against the
    // frequency of the light (10^14 Hz), with this metal (kf) and with the others (kg); and how many electrons are freed
    // in a second (1 for the ultraviolet lamp on zinc) against the strength of the light, with this light (nf) and with
    // the others (ng). k0, n0: a point that is not seen, so that the axes are drawn whichever of them is empty
    k0: { window: 100, range: 2 }, kf: { window: 100, range: 2, read: (y) => `${y.toFixed(2)} eV` }, kg: { window: 100, range: 2, read: (y) => `${y.toFixed(2)} eV` },
    // the double slit: how many electrons have arrived in each strip of the screen, against the place of the strip (μm)
    nx: { window: 3000, range: 10, read: (y) => `${Math.round(y)}개` },
    n0: { window: 100, range: 3.2 }, nf: { window: 100, range: 3.2, read: (y) => y.toFixed(2) }, ng: { window: 100, range: 3.2, read: (y) => y.toFixed(2) },
  },
  menus: {
    vars: [
      { id: 'scene', label: '장면 선택', kind: 'choice', value: 'glow', options: [{ id: 'glow', label: '광전 효과' }, { id: 'beam', label: '전자의 이중 슬릿' }] },
      { id: 'light', label: '빛', kind: 'choice', value: 'none', when: onGlow,
        options: [{ id: 'none', label: '비추지 않음' }, { id: 'phone', label: '스마트폰 조명' }, { id: 'uv', label: '자외선등' }, { id: 'tune', label: '진동수를 정하는 등', advanced: true }] },
      { id: 'count', label: '조명의 수', kind: 'slider', min: 1, max: 3, step: 1, value: 1, unit: '개', when: (v) => onGlow(v) && v.light === 'phone' },
      { id: 'freq', label: '빛의 진동수(f)', kind: 'slider', min: 4, max: 15, step: 0.1, value: 6, digits: 1, unit: ' ×10¹⁴ Hz', advanced: true, when: (v) => onGlow(v) && v.light === 'tune' },
      { id: 'power', label: '빛의 세기', kind: 'slider', min: 1, max: 3, step: 1, value: 1, advanced: true, when: (v) => onGlow(v) && v.light === 'tune' },
      { id: 'metal', label: '금속판', kind: 'choice', value: 'zinc', options: Object.keys(METALS).map((id) => ({ id, label: METALS[id].name })), advanced: true, when: onGlow },
      { id: 'sign', label: '검전기의 전하', kind: 'choice', value: 'minus', options: [{ id: 'minus', label: '음(−)전하' }, { id: 'plus', label: '양(+)전하' }], advanced: true, when: onGlow },
      { id: 'pane', label: '유리판 끼우기', kind: 'toggle', advanced: true, when: onGlow },
      { id: 'charge', label: '다시 대전하기', kind: 'action', when: onGlow },
      // the double slit for electrons
      // (in the basic mode it is always electrons whose speed is set: the simulation puts kind, by and gap back when the advanced mode is left)
      { id: 'kind', label: '입자', kind: 'choice', value: 'electron', options: [{ id: 'electron', label: '전자' }, { id: 'neutron', label: '중성자' }, { id: 'c60', label: '풀러렌' }], advanced: true, when: onBeam },
      { id: 'by', label: '전자의 속력을 정하는 것', kind: 'choice', value: 'speed', options: [{ id: 'speed', label: '속력' }, { id: 'volt', label: '가속 전압' }], advanced: true, when: (v) => onBeam(v) && v.kind === 'electron' },
      { id: 'speed', label: '전자의 속력', kind: 'slider', min: 1, max: 2, step: 0.1, value: 1.5, digits: 1, unit: ' ×10⁷ m/s', when: (v) => onBeam(v) && v.kind === 'electron' && v.by === 'speed' },
      { id: 'volt', label: '가속 전압', kind: 'slider', min: 300, max: 1100, step: 10, value: 600, unit: ' V', advanced: true, when: (v) => onBeam(v) && v.kind === 'electron' && v.by === 'volt' },
      { id: 'speedN', label: '중성자의 속력', kind: 'slider', min: 5.4, max: 10.9, step: 0.1, value: 8.2, digits: 1, unit: ' km/s', advanced: true, when: (v) => onBeam(v) && v.kind === 'neutron' },
      { id: 'speedC', label: '풀러렌의 속력', kind: 'slider', min: 7.6, max: 15.2, step: 0.1, value: 11.4, digits: 1, unit: ' m/s', advanced: true, when: (v) => onBeam(v) && v.kind === 'c60' },
      { id: 'gap', label: '슬릿 사이의 간격', kind: 'slider', min: 150, max: 350, step: 50, value: 250, unit: ' nm', advanced: true, when: onBeam },
      { id: 'rate', label: '쏘는 빠르기', kind: 'choice', value: 'mid', options: [{ id: 'slow', label: '1초에 2개' }, { id: 'mid', label: '1초에 20개' }, { id: 'fast', label: '1초에 200개' }], when: onBeam },
      { id: 'card', label: '슬릿판 끼우기', kind: 'toggle', value: true, when: onBeam },
    ],
    graph: [
      { id: 'leafTime', label: '금속박의 각–시간', kind: 'graph', x: '시간', plots: [{ y: '금속박이 벌어진 각', trace: 'leaf', floor: true }], when: onGlow },
      { id: 'energyFreq', label: '운동 에너지–진동수', kind: 'graph', x: '빛의 진동수(f)', xUnit: '×10¹⁴ Hz', span: [0, 15], advanced: true, when: onGlow,
        plots: [{ y: '최대 운동 에너지', dots: true, floor: true, lines: [{ trace: 'k0', color: 'rgba(0,0,0,0)' }, { trace: 'kg', color: '#9aa7c7', name: '다른 금속' }, { trace: 'kf', color: GOLD, name: '지금 금속' }] }] },
      { id: 'countPower', label: '광전자 수–빛의 세기', kind: 'graph', x: '빛의 세기', xUnit: ' ', span: [0, 3.5], advanced: true, when: onGlow,
        plots: [{ y: '광전자의 수', dots: true, floor: true, lines: [{ trace: 'n0', color: 'rgba(0,0,0,0)' }, { trace: 'ng', color: '#9aa7c7', name: '다른 조건' }, { trace: 'nf', color: GOLD, name: '지금 조건' }] }] },
      { id: 'hitsSpot', label: (v, advanced) => `${sent(v, advanced).name}의 수–위치`, kind: 'graph', x: '스크린에서의 위치', xUnit: 'μm', span: [-520, 520], plots: [{ y: '스크린에 도달한 수', trace: 'nx', floor: true }], when: onBeam },
    ],
    time: [
      { id: 'reset', label: '처음으로', kind: 'action' },
    ],
    layers: [
      { id: 'photons', label: '광자(모형)', kind: 'toggle', when: onGlow },
      { id: 'electrons', label: '광전자(모형)', kind: 'toggle', when: onGlow },
      { id: 'grains', label: '입자라면 예상되는 무늬', kind: 'toggle', when: onBeam },
      { id: 'numbers', label: '값', kind: 'toggle' },
    ],
    inquiry: [
      { id: 'table', label: '기록 표', kind: 'table', wide: true, rows: 8, when: onGlow, text: '빛을 비추다가 멈추거나 금속박이 다 오므라들면 한 줄씩 적힙니다.',
        columns: [{ label: '금속판', advanced: true }, { label: '검전기의<br>전하', advanced: true }, { label: '빛' }, { label: '빛의<br>세기' }, { label: '진동수', unit: '×10¹⁴ Hz' }, { label: '금속박', result: true }, { label: '비춘<br>시간', unit: 's', result: true }] },
      { id: 'table2', label: '기록 표', kind: 'table', wide: true, rows: 8, when: onBeam, text: '슬릿판을 끼우고 쏘다가 멈추거나 값을 바꾸면 한 줄씩 적힙니다.',
        columns: [{ label: '입자', advanced: true }, { label: '속력' }, { label: '운동량', unit: '×10<sup>−24</sup> kg·m/s', result: true }, { label: '물질파<br>파장', unit: 'pm', result: true }, { label: '슬릿<br>간격', unit: 'nm', advanced: true }, { label: '무늬<br>간격', unit: 'μm', result: true }, { label: '도달한<br>수', unit: '개', result: true }] },
    ],
  },

  // writing on the chalkboard (1024 x 400)
  board(g) {
    g.fillStyle = 'rgba(255,255,255,0.9)'; g.font = '56px Georgia, serif'; g.fillText('빛과 물질의 이중성', 60, 96);
    g.strokeStyle = 'rgba(255,255,255,0.85)'; g.lineWidth = 4; g.lineJoin = 'round';
    // a wave that comes in, and grains that go out
    g.beginPath(); for (let x = 90; x <= 420; x += 4) { const y = 250 - 38 * Math.sin((x - 90) / 22); if (x === 90) g.moveTo(x, y); else g.lineTo(x, y); } g.stroke();
    g.beginPath(); g.moveTo(470, 330); g.lineTo(700, 330); g.stroke();
    for (const [x, y] of [[520, 270], [585, 220], [655, 255], [610, 300]]) { g.beginPath(); g.arc(x, y, 11, 0, Math.PI * 2); g.fill(); }
    for (let k = -3; k <= 3; k++) { g.fillStyle = `rgba(255,255,255,${0.85 - 0.12 * Math.abs(k)})`; for (let n = 0; n < 14 - 3 * Math.abs(k); n++) g.fillRect(860 + k * 30 - 4 + (n * 37 % 9), 180 + (n * 53 % 150), 5, 5); }
  },

  // Builds the apparatus on the bench (world) and returns { update(dt) }.
  create({ T, kit, world, view, ctx }) {
    const { mat, add, box, cyl } = kit;
    world.userData.things.visible = false;
    const way = new T.Vector3(), hit = new T.Vector3();
    const M = { dark: mat(0x3a4057), steel: mat(0x9aa1b1, { roughness: 0.5, metalness: 0.5 }) };
    const tipSpot = new T.Vector3(), tip = view.label(tipSpot);   // a word beside what is handled
    let moved = true, tipTime = 0, framed = false, grab = null;
    function say(text, x, y, z, seconds = 0) { tip.write(text); tipSpot.set(x, y, z); tip.show(true); tipTime = seconds; moved = true; }
    const tall = () => window.matchMedia('(max-aspect-ratio: 4/5)').matches;

    // ====================================== the photoelectric effect ======================================
    // ---------- the electroscope, the lights and the rod ----------
    // The electroscope stands at EX: a jar with a metal rod through its lid, the plate (PLATE across, its top at
    // TOP) on the rod and two leaves of foil hanging from the rod's lower end (HINGE high). A light shines down on
    // the plate from its place at SLOT, held by a stand; the others lie on the bench.
    const EX = 0.6, PLATE = 2.2, TOP = 4.37, HINGE = 1.75, SLOT = new T.Vector3(EX, 6.35, 0), TOUCH = new T.Vector3(EX, TOP, 0), PANE = 5.3;
    const rig = new T.Group(); world.add(rig);
    add(rig, cyl(1.5, 1.6, 0.16, 40), M.dark, EX, 0.08, 0);
    { const jar = add(rig, new T.CylinderGeometry(1.45, 1.45, 2.9, 40, 1, true), new T.MeshStandardMaterial({ color: 0xcfe8ee, roughness: 0.15, transparent: true, opacity: 0.26, side: T.DoubleSide, depthWrite: false }), EX, 1.61, 0, false, false); jar.renderOrder = 3; }
    add(rig, cyl(1.5, 1.5, 0.14, 40), M.dark, EX, 3.13, 0); add(rig, cyl(0.22, 0.22, 0.5, 20), mat(0x2b2b2b), EX, 3.3, 0);
    add(rig, cyl(0.05, 0.05, TOP - HINGE - 0.05, 12), M.steel, EX, (TOP + HINGE - 0.05) / 2, 0);
    const plateInk = new T.MeshStandardMaterial({ color: METALS.zinc.tint, roughness: 0.55, metalness: 0.6 });
    add(rig, box(PLATE, 0.07, PLATE), plateInk, EX, TOP - 0.035, 0);
    const leaves = [-1, 1].map((side) => {
      const hinge = new T.Group(); hinge.position.set(EX, HINGE, 0); rig.add(hinge);
      add(hinge, box(0.02, 1.15, 0.32), mat(0xd9b756, { roughness: 0.45, metalness: 0.6 }), 0, -0.575, 0);
      return { side, hinge };
    });
    // the stand that holds the light over the plate
    add(rig, box(0.9, 0.14, 0.9), M.dark, EX, 0.07, -2.0); add(rig, cyl(0.07, 0.07, 6.8, 12), M.steel, EX, 3.4, -2.0);
    add(rig, box(0.1, 0.1, 2.0), M.steel, EX, 6.78, -1.0); add(rig, box(0.5, 0.16, 0.5), M.dark, EX, 6.68, 0);
    // the light as it falls on the plate; and (advanced) a pane of glass in its way
    const beam = add(rig, new T.CylinderGeometry(1.02, 1.08, SLOT.y - 0.2 - TOP, 32, 1, true), new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.14, side: T.DoubleSide, depthWrite: false }), EX, (SLOT.y - 0.2 + TOP) / 2, 0, false, false); beam.renderOrder = 4;
    const pane = new T.Group(); rig.add(pane);
    add(pane, box(2.9, 0.05, 2.9), new T.MeshStandardMaterial({ color: 0xbdf0e6, roughness: 0.2, transparent: true, opacity: 0.4, depthWrite: false }), EX, PANE, 0, false, false).renderOrder = 5;
    add(pane, cyl(0.05, 0.05, PANE, 10), M.steel, EX + 1.75, PANE / 2, 0.9); add(pane, box(0.6, 0.12, 0.6), M.dark, EX + 1.75, 0.06, 0.9); add(pane, box(0.5, 0.08, 0.2), M.steel, EX + 1.55, PANE, 0.9);
    // the things that are carried: each a group with a part that is not seen, by which it is taken
    const glowInk = (color) => new T.MeshBasicMaterial({ color });
    function thing(kind, x, y, z, w, h, d) {
      const group = new T.Group(), rest = new T.Vector3(x, y, z); group.position.copy(rest); rig.add(group);
      const handle = add(group, box(w, h, d), M.dark, 0, 0, 0, false, false); handle.visible = false; handle.userData.grip = { kind };
      const spot = new T.Vector3();
      return { kind, group, rest, handle, spot, label: view.label(spot) };
    }
    const phone = thing('phone', -2.2, 0.08, 0.3, 1.9, 0.7, 1.2), uv = thing('uv', 2.7, 0.42, 2.2, 2.5, 0.9, 1.0), tune = thing('tune', 3.0, 0.5, 0.2, 1.4, 1.2, 1.4), rod = thing('rod', -1.3, 0.14, 2.6, 2.9, 0.6, 0.7);   // (all near the electroscope, so that an upright screen holds them)
    add(phone.group, box(1.5, 0.1, 0.78), mat(0x23252e, { roughness: 0.5 }), 0, 0, 0); add(phone.group, box(1.36, 0.01, 0.66), mat(0x4a5066, { roughness: 0.3 }), 0, 0.056, 0, false, false);
    const lamps = [0, 1, 2].map((k) => add(phone.group, cyl(0.075, 0.075, 0.03, 16), glowInk(0x55524a), -0.5 + 0.2 * k, -0.06, 0.2, false, false));
    add(uv.group, box(2.2, 0.3, 0.5), mat(0x2b2d36, { roughness: 0.6 }), 0, 0, 0);
    const tube = add(uv.group, cyl(0.09, 0.09, 1.9, 16).rotateZ(Math.PI / 2), glowInk(0x6b6490), 0, -0.2, 0, false, false);
    add(tune.group, cyl(0.5, 0.62, 0.55, 28), mat(0x2b2d36, { roughness: 0.6 }), 0, 0, 0); add(tune.group, cyl(0.16, 0.16, 0.3, 16), M.steel, 0, 0.4, 0);
    const lens = add(tune.group, cyl(0.46, 0.46, 0.04, 28), glowInk(0x55524a), 0, -0.29, 0, false, false);
    const rodInk = new T.MeshStandardMaterial({ color: 0x1c1c20, roughness: 0.5 });
    add(rod.group, cyl(0.085, 0.085, 2.7, 16).rotateZ(Math.PI / 2), rodInk, 0, 0, 0);
    add(rig, box(1.5, 0.1, 1.0), mat(0xb89a72, { roughness: 1 }), -2.1, 0.05, 2.6);   // the fur the rod is rubbed with
    const things = { phone, uv, tune, rod };
    // the model: photons on their way down to the plate, and the electrons that leave it
    const SEEDS = 90, GRAINS = 50, ball = new T.SphereGeometry(1, 12, 8);
    const seeds = new T.InstancedMesh(ball, new T.MeshBasicMaterial({ color: 0xffffff }), SEEDS), grains = new T.InstancedMesh(ball, new T.MeshBasicMaterial({ color: 0x4f8fe0 }), GRAINS);
    for (const mesh of [seeds, grains]) { mesh.frustumCulled = false; mesh.renderOrder = 6; mesh.visible = false; rig.add(mesh); }
    const place = new T.Matrix4(), none = new T.Matrix4().makeScale(0, 0, 0), size = new T.Vector3(), still = new T.Quaternion(), paint = new T.Color();
    const spots = { plate: new T.Vector3(EX + 1.9, TOP + 0.05, 0), lamp: new T.Vector3(EX + 2.4, SLOT.y + 0.1, 0), leaf: new T.Vector3(EX - 2.3, 1.75, 0), list: new T.Vector3() };
    const labels = { plate: view.label(spots.plate), lamp: view.label(spots.lamp), leaf: view.label(spots.leaf), list: view.label(spots.list, true) };

    // ---------- physics ----------
    // q: the charge of the electroscope, as a part of the charge the rod gives it (−1: as much negative charge as it
    // gets; 0: none). A light of the strength 1 whose photons can all free electrons takes FULL seconds to carry
    // that charge off. run: what has gone on since the light, the plate or the charge was last changed.
    const FULL = 8, RAIN = 10, FALL = 3.4, GRAIN = 30;   // (RAIN: photons of the model a second for the strength 1; FALL: how fast they are drawn to move; GRAIN: a photon or an electron of the model is this part of the plate across)
    let q = -1;
    const run = { shone: 0, from: -1, tell: null, line: null, done: null }, flying = [], freed = [];
    let pour = 0;
    const sign = () => (ctx.advanced && ctx.values.sign === 'plus' ? 1 : -1);
    const metal = () => METALS[ctx.advanced ? ctx.values.metal : 'zinc'], threshold = () => metal().work / PLANCK;
    const glassed = () => ctx.advanced && ctx.values.pane;
    // the light on the plate now: its name, its frequencies (10^14 Hz, from lo to hi) and its strength; none where no light is in place
    function light() {
      const v = ctx.values;
      if (v.light === 'phone') return { name: '스마트폰 조명', lo: WHITE[0], hi: WHITE[1], power: v.count };
      if (v.light === 'uv') return { name: '자외선등', lo: ULTRA, hi: ULTRA, power: 1 };
      if (v.light === 'tune' && ctx.advanced) return { name: '진동수를 정하는 등', lo: v.freq, hi: v.freq, power: v.power };
      return null;
    }
    const frees = (f) => f > threshold() && !(glassed() && f > GLASS);   // a photon of this frequency reaches the plate and frees an electron
    // the part of the light's photons that free electrons
    function share(one) {
      if (one.lo === one.hi) return frees(one.lo) ? 1 : 0;
      return Math.max(0, (glassed() ? Math.min(one.hi, GLASS) : one.hi) - Math.max(one.lo, threshold())) / (one.hi - one.lo);
    }
    const angle = () => 38 * Math.abs(q);   // how far each leaf stands from the upright (degrees)
    const band = (one) => (one.lo === one.hi ? one.lo.toFixed(1) : `${one.lo.toFixed(1)}~${one.hi.toFixed(1)}`);
    // what is being tried is told as it was when it began; a line of the table for it (written anew while the same trial goes on)
    function begin() { const one = light(); run.shone = 0; run.from = q; run.line = null; run.done = null; run.tell = one ? [metal().name, sign() > 0 ? '양(+)' : '음(−)', one.name, String(one.power), band(one)] : null; }
    function note() {
      if (!run.tell || run.shone < 0.5) return;
      const table = ctx.tables.table, above = table.rows[table.rows.length - 1];
      const row = [...run.tell, run.done !== null ? '오므라듦' : Math.abs(q) < Math.abs(run.from) - 0.02 ? '조금 오므라듦' : '그대로', (run.done !== null ? run.done : run.shone).toFixed(1)];
      if (above && above.every((cell, i) => cell === row[i])) return;
      table.add(row, Boolean(above) && above === run.line); run.line = table.rows[table.rows.length - 1];
    }
    // For the two graphs of what has been tried (a little after the last change): with light of one frequency on the
    // plate, the greatest energy an electron leaves with (hf less the work; nought below the threshold), kept for each
    // metal; and with any light, how many electrons are freed in a second, kept for each light on each metal.
    const tried = { energy: new Map(), count: new Map() };
    let fresh = true, since = performance.now();
    function mark() {
      fresh = false;
      const one = light(), id = ctx.advanced ? ctx.values.metal : 'zinc';
      const own = (store, key) => { if (!store.has(key)) store.set(key, new Map()); return store.get(key); };
      const kind = one ? `${id}/${band(one)}/${glassed()}` : '';
      if (one) {
        if (one.lo === one.hi && !(glassed() && one.lo > GLASS)) own(tried.energy, id).set(one.lo, Math.max(0, PLANCK * one.lo - metal().work));
        own(tried.count, kind).set(one.power, one.power * share(one));
      }
      for (const [store, mine, now, rest] of [[tried.energy, id, 'kf', 'kg'], [tried.count, kind, 'nf', 'ng']]) {
        ctx.traces[now].clear(); ctx.traces[rest].clear();
        for (const [key, points] of store) for (const [x, y] of [...points].sort((a, b) => a[0] - b[0])) ctx.traces[key === mine ? now : rest].add(x, y);
      }
    }
    function charge() { note(); q = sign(); begin(); moved = true; }
    function advance(t, dt) {
      const one = light();
      if (one) {
        run.shone += dt;
        if (q < 0) { q = Math.min(0, q + one.power * share(one) * dt / FULL); if (q === 0) { run.done = run.shone; note(); } }
      }
      ctx.traces.leaf.add(t, angle());
      // the model
      const v = ctx.values;
      if (!one || !(v.photons || v.electrons)) { flying.length = 0; pour = 0; } else {
        for (pour += one.power * RAIN * dt; pour >= 1; pour--) if (flying.length < SEEDS) flying.push({ x: (Math.random() * 2 - 1) * 0.9, y: SLOT.y - 0.25, z: (Math.random() * 2 - 1) * 0.9, f: one.lo + Math.random() * (one.hi - one.lo) });
        for (let k = flying.length - 1; k >= 0; k--) {
          const seed = flying[k]; seed.y -= FALL * dt;
          if (glassed() && seed.f > GLASS && seed.y <= PANE + 0.04) { flying.splice(k, 1); continue; }   // (the glass takes it)
          if (seed.y > TOP) continue;
          flying.splice(k, 1);
          if (frees(seed.f) && Math.random() < 0.6 && freed.length < GRAINS) {   // an electron leaves the plate; it comes back unless the plate has negative charge to spare
            const lean = Math.random() * 0.9, round = Math.random() * 2 * Math.PI;
            freed.push({ x: seed.x, y: TOP + 0.03, z: seed.z, vx: 2.5 * Math.sin(lean) * Math.cos(round), vy: 2.5 * Math.cos(lean), vz: 2.5 * Math.sin(lean) * Math.sin(round), age: 0, back: q >= 0 });
          }
        }
      }
      for (let k = freed.length - 1; k >= 0; k--) {
        const grain = freed[k]; grain.age += dt;
        if (grain.back) grain.vy -= 9 * dt;
        grain.x += grain.vx * dt; grain.y += grain.vy * dt; grain.z += grain.vz * dt;
        if (grain.back ? grain.y < TOP : grain.age > 1.4) freed.splice(k, 1);
      }
    }
    function toStart() {
      note();
      for (const [key, value] of [['light', 'none'], ['count', 1], ['freq', 6], ['power', 1], ['metal', 'zinc'], ['sign', 'minus'], ['pane', false]]) if (!ctx.locked.has(key) && ctx.values[key] !== value) ctx.set(key, value);
      q = sign(); flying.length = freed.length = 0; pour = 0; ctx.traces.leaf.clear(); begin(); moved = true;
    }

    // ---------- handling ----------
    // A light is carried in the plane that faces the eye; near its place over the plate it goes into it, and it
    // stays there when it is let go (let go anywhere else, it goes back to the bench). The rod charges the
    // electroscope when it comes to the plate. The phone, pressed, lights one lamp more.
    const ray = new T.Raycaster(), plane = new T.Plane();
    const tool = {
      handles: () => [phone.handle, uv.handle, rod.handle, ...(ctx.advanced ? [tune.handle] : [])],
      start(grip, r) {
        const one = things[grip.kind];
        plane.setFromNormalAndCoplanarPoint(way.copy(r.direction).negate(), one.group.position);
        if (!r.intersectPlane(plane, hit)) return false;
        if (grip.kind !== 'rod' && ctx.locked.has('light')) { say('잠금', one.group.position.x, one.group.position.y + 0.9, one.group.position.z, 1.2); return false; }
        grab = { ...grip, off: one.group.position.clone().sub(hit), from: hit.clone(), at: one.group.position.clone(), moved: false, near: false, done: false };
        return true;
      },
      move(r) {
        if (!r.intersectPlane(plane, hit)) return;
        if (!grab.moved && hit.distanceTo(grab.from) < 0.12) return;   // (a press is not a pull)
        grab.moved = true; grab.at.copy(hit).add(grab.off); grab.at.y = Math.max(0.1, grab.at.y);
        grab.near = r.distanceToPoint(grab.kind === 'rod' ? TOUCH : SLOT) < (grab.kind === 'rod' ? 1.0 : 1.3);
        if (grab.kind === 'rod' && grab.near && !grab.done) { grab.done = true; charge(); }
      },
      end(done) {
        if (done.kind === 'rod') return;
        if (!done.moved) {   // the phone was pressed
          if (done.kind === 'phone' && !ctx.locked.has('count')) ctx.set('count', ctx.values.count % 3 + 1);
          return;
        }
        const to = done.near ? done.kind : ctx.values.light === done.kind ? 'none' : ctx.values.light;
        if (to !== ctx.values.light) ctx.set('light', to);
        if (done.near) ctx.setPlaying(true);   // (the light is on from the moment it is in its place)
      },
    };

    function draw() {
      const v = ctx.values, one = light(), on = v.light;
      for (const leaf of leaves) leaf.hinge.rotation.z = leaf.side * rad(angle());
      plateInk.color.setHex(metal().tint);
      pane.visible = glassed();
      // the things that are carried: in the hand, in place over the plate (or at the plate, for the rod), or on the bench
      for (const item of Object.values(things)) {
        const held = grab && grab.kind === item.kind && grab.moved, placed = held ? grab.near : item.kind !== 'rod' && on === item.kind;
        item.group.visible = item.kind !== 'tune' || ctx.advanced;
        if (placed) item.group.position.copy(item.kind === 'rod' ? TOUCH : SLOT); else if (held) item.group.position.copy(grab.at); else item.group.position.copy(item.rest);
        if (item.kind === 'rod') { item.group.rotation.z = placed ? 0.35 : 0; if (placed) item.group.position.set(EX - 1.25, TOP + 0.52, 0); }
        item.label.show(item.group.visible && !held && !placed);
        item.spot.set(item.rest.x, item.rest.y + (item.kind === 'tune' ? 0.9 : 0.55), item.rest.z);
      }
      phone.label.write('스마트폰'); uv.label.write('자외선등'); tune.label.write('진동수를 정하는 등'); rod.label.write(sign() > 0 ? '유리 막대' : '에보나이트 막대');
      rodInk.color.setHex(sign() > 0 ? 0xa9d8e0 : 0x1c1c20);
      lamps.forEach((lamp, k) => lamp.material.color.setHex(on === 'phone' && k < v.count ? 0xfff3c4 : 0x55524a));
      tube.material.color.setHex(on === 'uv' ? 0xb48cff : 0x6b6490);
      const tint = one ? (one.lo === one.hi ? tintOf(one.lo) : [255, 244, 214]) : [85, 82, 74];
      lens.material.color.setRGB((on === 'tune' ? tint[0] : 85) / 255, (on === 'tune' ? tint[1] : 82) / 255, (on === 'tune' ? tint[2] : 74) / 255, T.SRGBColorSpace);
      beam.visible = Boolean(one);
      if (one) { beam.material.color.setRGB(tint[0] / 255, tint[1] / 255, tint[2] / 255, T.SRGBColorSpace); beam.material.opacity = 0.07 + 0.045 * one.power; }
      // the model: each grain as wide as its part of the plate
      const wide = PLATE / GRAIN / 2;
      seeds.visible = v.photons && flying.length > 0; grains.visible = v.electrons && freed.length > 0;
      if (seeds.visible) {
        for (let k = 0; k < SEEDS; k++) {
          const seed = flying[k];
          if (!seed) { seeds.setMatrixAt(k, none); continue; }
          const ink = tintOf(seed.f);
          seeds.setMatrixAt(k, place.compose(way.set(EX + seed.x, seed.y, seed.z), still, size.setScalar(wide))); seeds.setColorAt(k, paint.setRGB(ink[0] / 255, ink[1] / 255, ink[2] / 255, T.SRGBColorSpace));
        }
        seeds.instanceMatrix.needsUpdate = true; if (seeds.instanceColor) seeds.instanceColor.needsUpdate = true;
      }
      if (grains.visible) {
        for (let k = 0; k < GRAINS; k++) { const grain = freed[k]; grains.setMatrixAt(k, grain ? place.compose(way.set(EX + grain.x, grain.y, grain.z), still, size.setScalar(wide)) : none); }
        grains.instanceMatrix.needsUpdate = true;
      }
      // the writing
      labels.plate.write(`${metal().name}판`); labels.plate.show(true);
      labels.lamp.show(Boolean(one)); if (one) labels.lamp.write(on === 'phone' ? `스마트폰 조명 <b>${v.count}개</b>` : on === 'uv' ? '자외선등' : `빛 <b>${one.lo.toFixed(1)} ×10¹⁴ Hz</b>`);
      labels.leaf.write(q < 0 ? '음(−)전하' : q > 0 ? '양(+)전하' : '전하 없음'); labels.leaf.show(true);
      labels.list.show(v.numbers);
      if (v.numbers) {
        const f0 = threshold(), lines = [`${metal().name}의 문턱 진동수 <b>${f0.toFixed(1)} ×10¹⁴ Hz</b>`];
        if (one) {
          const part = share(one), energy = (f) => (PLANCK * f).toFixed(1);
          lines.push(`빛의 진동수(f) <b>${band(one)} ×10¹⁴ Hz</b>`, `광자 1개의 에너지 = hf = <b>${one.lo === one.hi ? energy(one.lo) : `${energy(one.lo)}~${energy(one.hi)}`} eV</b>`);
          if (glassed() && one.hi > GLASS) lines.push('유리판이 자외선을 막음');
          lines.push(part > 0 ? (one.lo === one.hi || part === 1 ? '문턱 진동수보다 큼 → 광전자가 방출됨' : '문턱 진동수보다 큰 빛만 광전자를 방출함') : one.hi > f0 ? '광전자가 방출되지 않음' : '문턱 진동수보다 작음 → 광전자가 방출되지 않음');
          if (ctx.advanced && part > 0) lines.push('광전자의 최대 운동 에너지 = hf − 일함수', `= ${energy(Math.min(one.hi, glassed() ? GLASS : one.hi))} − ${metal().work.toFixed(1)} = <b>${(PLANCK * Math.min(one.hi, glassed() ? GLASS : one.hi) - metal().work).toFixed(1)} eV</b>`);
          if (part > 0 && q >= 0) lines.push(q > 0 ? '양(+)전하를 띤 판으로 광전자가 되돌아옴' : '전하가 없는 판으로 광전자가 되돌아옴');
        }
        labels.list.write(lines.join('<br>')); if (tall()) spots.list.set(EX, 0, 3.2); else spots.list.set(EX - 5.0, 2.6, 0);
      }
    }

    const glowScene = {
      rig, ids: ['light', 'count', 'freq', 'power', 'metal', 'sign', 'pane'], keep: ['photons', 'electrons'], kept: { photons: false, electrons: false },
      look: [{ target: [0.4, 3.0, 0], r: 16, theta: 0.22, phi: 1.36 }, { target: [EX, 3.2, 0], r: 17, theta: 0.2, phi: 1.25 }],
      handles: tool.handles, start: tool.start, move: tool.move, end: tool.end,
      enter() { rig.visible = true; ctx.setView('front'); },
      leave() { rig.visible = false; for (const label of [...Object.values(labels), ...Object.values(things).map((item) => item.label)]) label.show(false); },
      // (what was being tried is over: its line is written as it stood, and another trial begins)
      changed(id) { note(); if (id === 'sign') q = sign(); if (id === 'metal' || id === 'light') flying.length = freed.length = 0; begin(); fresh = true; since = performance.now(); },
      play(on) { if (!on) note(); },
      tick: advance, toStart, draw, mark,
      mode() { note(); if (Math.sign(q) === 1 && sign() < 0) q = -1; begin(); fresh = true; since = performance.now(); },   // (the positive charge, the other metals, the glass and the lamp that is set count in the advanced mode only)
    };

    // ====================================== the double slit for electrons ======================================
    // ---------- the rail, the gun, the card with the two slits and the screen ----------
    // The electrons go along x at the height BY: from the gun through the card at XS to the screen, FAR metres
    // (5 units) further on. Across their way nothing could be seen at that scale: the slits (WIDE nm wide, gap() nm
    // apart: 250 nm in the basic mode) are drawn CARD units to a nm (10 000 times), the face of the screen SHOW units
    // to a μm (250 times; REACH: how far from its middle it reaches, in μm), with a rule in μm along its foot. + on
    // the screen is towards the front of the bench.
    const XS = -3.4, BY = 1.3, GUN = -6.0, FAR = 0.25, WIDE = 50, CARD = 0.0002, SHOW = 0.005, REACH = 520;
    const rig2 = new T.Group(); world.add(rig2);
    add(rig2, box(12.4, 0.12, 0.5), M.steel, -1.1, 0.06, 0);
    // the gun; its mouth is bright for a moment as an electron leaves
    add(rig2, cyl(0.34, 0.34, 1.5, 28).rotateZ(Math.PI / 2), M.dark, GUN - 0.2, BY, 0); add(rig2, cyl(0.3, 0.3, 0.1, 28).rotateZ(Math.PI / 2), M.steel, GUN - 1.0, BY, 0);
    add(rig2, cyl(0.3, 0.12, 0.45, 24).rotateZ(Math.PI / 2), M.steel, GUN + 0.77, BY, 0);
    const mouth = add(rig2, cyl(0.07, 0.07, 0.03, 14).rotateZ(Math.PI / 2), new T.MeshBasicMaterial({ color: 0x15161c }), GUN + 1.0, BY, 0, false, false);
    add(rig2, cyl(0.07, 0.07, BY - 0.5, 10), M.steel, GUN - 0.2, (BY + 0.1) / 2, 0); add(rig2, box(1.1, 0.2, 0.9), M.dark, GUN - 0.2, 0.2, 0);
    // the holder, and the card with the two slits: in the holder (IN) or lying on the bench (OUT)
    add(rig2, box(0.6, 0.2, 3.9), M.dark, XS, 0.2, 0);
    for (const z of [-1.76, 1.76]) add(rig2, cyl(0.05, 0.05, BY + 0.2, 10), M.steel, XS, (BY + 0.8) / 2, z);
    const IN = new T.Vector3(XS, BY - 0.15, 0), OUT = new T.Vector3(-0.6, 0.03, 2.35);
    const card = new T.Group(); rig2.add(card);
    add(card, box(0.05, 1.2, 3.4), mat(0x2b2b2b, { roughness: 0.8 }), 0, 0, 0);   // (low above the way of the electrons, so that the screen can be seen over it)
    const gapInk = new T.MeshBasicMaterial({ color: 0xe6ecf7 }), bars = [-1, 1].map(() => add(card, box(0.07, 0.7, 1), gapInk, 0, 0.15, 0, false, false));
    const cardHandle = add(card, box(0.6, 1.4, 3.6), M.dark, 0, 0, 0, false, false); cardHandle.visible = false; cardHandle.userData.grip = { kind: 'card' };
    // the screen: a board on a foot. Its face is a picture (FACE.px dots to a unit) with a dot for each electron
    // that has arrived (between the rows top and top + tall) and a rule below; a ledge along its top carries the
    // same dots, to be seen from above. The last electron to arrive is bright for a moment.
    const FACE = { w: 5.2, h: 2.4, px: 200, top: 50, tall: 300 }, XF = XS + FAR * 20;
    const screen = new T.Group(); screen.position.x = XF; rig2.add(screen);
    const face = kit.canvasTexture(FACE.w * FACE.px, FACE.h * FACE.px, () => {}), pen = face.image.getContext('2d'), faceInk = new T.MeshBasicMaterial({ map: face, toneMapped: false });
    add(screen, box(0.12, FACE.h, FACE.w), mat(0x30333d), 0.06, BY + 0.2, 0); add(screen, box(0.6, 0.22, 1.4), M.dark, 0.06, 0.19, 0);
    add(screen, new T.PlaneGeometry(FACE.w, FACE.h).rotateY(-Math.PI / 2), faceInk, -0.002, BY + 0.2, 0, false, false);
    { const ledge = new T.PlaneGeometry(FACE.w, 0.34).rotateX(-Math.PI / 2).rotateY(-Math.PI / 2), uv = ledge.attributes.uv, high = FACE.h * FACE.px;
      for (let i = 0; i < uv.count; i++) uv.setY(i, 1 - (FACE.top + (uv.getY(i) > 0.5 ? 0 : FACE.tall)) / high);
      add(screen, box(0.34, 0.03, FACE.w), mat(0x30333d), -0.05, BY + 0.2 + FACE.h / 2 + 0.015, 0); add(screen, ledge, faceInk, -0.05, BY + 0.2 + FACE.h / 2 + 0.032, 0, false, false); }
    const spark = add(screen, new T.SphereGeometry(0.055, 12, 8), new T.MeshBasicMaterial({ color: 0xffffff }), -0.03, BY, 0, false, false);
    const spots2 = { gun: new T.Vector3(GUN - 0.2, BY + 0.6, 0), card: new T.Vector3(), screen: new T.Vector3(XF, BY + 1.75, -2.2), list: new T.Vector3() };
    const labels2 = { gun: view.label(spots2.gun), card: view.label(spots2.card), screen: view.label(spots2.screen, true), list: view.label(spots2.list, true) };

    // ---------- physics ----------
    // Lengths across the way are in μm on the screen and in nm at the slits. Where an electron arrives cannot be
    // told beforehand, only how likely each place is: with the card in, as bright as two slits of that width make
    // the screen for a wave of the electron's wavelength (cos² of half the phase between the two ways, times the
    // square of sin β / β for one slit); without the card, one broad patch (SPREAD: how wide, μm).
    // run2: due: the part of an electron that is owed; at, row: where each
    // electron arrived (μm; how far down the band, 0 to 1); bins: how many in each strip STRIP μm wide; spark,
    // flash: how long the last dot and the gun's mouth stay bright yet; line: the line of the table for this trial.
    const SPREAD = 170, STRIP = 5, STRIPS = 2 * Math.round(REACH / STRIP) + 1;
    const run2 = { due: 0, at: [], row: [], bins: new Array(STRIPS).fill(0), spark: 0, flash: 0, line: null, tell: null };
    // (advanced) what is sent, how far apart the slits are, and whether the electrons' speed comes from the voltage that speeds them up
    const kind = () => sent(ctx.values, ctx.advanced), gap = () => (ctx.advanced ? ctx.values.gap : 250), volted = () => ctx.advanced && ctx.values.kind === 'electron' && ctx.values.by === 'volt';
    function speed() {   // how fast it goes (m/s)
      const v = ctx.values, one = kind();
      if (one === KINDS.neutron) return v.speedN * 1000;
      if (one === KINDS.c60) return v.speedC;
      return volted() ? Math.sqrt(2 * CHARGE * v.volt / one.mass) : v.speed * 1e7;   // (the energy it gets from the voltage is all its energy of motion)
    }
    const fast = () => (kind() === KINDS.neutron ? `${ctx.values.speedN.toFixed(1)} km/s` : kind() === KINDS.c60 ? `${ctx.values.speedC.toFixed(1)} m/s` : `${(speed() / 1e7).toFixed(volted() ? 2 : 1)} ×10⁷ m/s`);   // (as it is written)
    const push = () => kind().mass * speed();   // its momentum (kg m/s)
    const lambda = () => H / push() * 1e12;   // the wavelength of its matter wave (pm)
    const fringe = () => lambda() * FAR / gap() * 1000;   // from one band where many arrive to the next (μm)
    function chance(x) {   // how likely an electron is to arrive at x (1 at the middle)
      if (!ctx.values.card) return Math.exp(-((x / SPREAD) ** 2) / 2);
      const half = Math.PI * x / fringe(), turn = half * WIDE / gap();
      return (Math.abs(turn) < 1e-9 ? 1 : (Math.sin(turn) / turn) ** 2) * Math.cos(half) ** 2;
    }
    const DOT = 'rgba(190,214,255,0.5)';
    const dot = (x, row) => pen.fillRect(FACE.w * FACE.px / 2 + x * SHOW * FACE.px - 3, FACE.top + row * FACE.tall - 3, 6, 6);
    // the face of the screen: what would be seen were electrons grains and nothing else, the dots, and the rule
    function paintFace() {
      const w = FACE.w * FACE.px;
      pen.globalCompositeOperation = 'source-over'; pen.fillStyle = '#171920'; pen.fillRect(0, 0, w, FACE.h * FACE.px);
      if (ctx.values.grains && ctx.values.card) {   // a band behind each slit, as the slits are drawn
        const half = gap() * CARD / 2 * FACE.px, wide = Math.max(3, WIDE * CARD * FACE.px);
        pen.fillStyle = 'rgba(229,131,115,0.6)'; for (const side of [-1, 1]) pen.fillRect(w / 2 + side * half - wide / 2, FACE.top, wide, FACE.tall);
      }
      pen.strokeStyle = pen.fillStyle = '#d8d2c4'; pen.lineWidth = 2; pen.textAlign = 'center'; pen.font = '26px Georgia, serif';
      pen.beginPath();
      for (let k = -25; k <= 25; k++) { const x = w / 2 + k * FACE.px / 10; pen.moveTo(x, 394); pen.lineTo(x, k % 10 === 0 ? 428 : k % 5 === 0 ? 418 : 408); }
      pen.stroke();
      for (const k of [-20, -10, 0, 10, 20]) pen.fillText(String(Math.round(k / 10 / SHOW)).replace('-', '−'), w / 2 + k * FACE.px / 10, 458);
      pen.fillText('μm', w - 44, 458);
      pen.globalCompositeOperation = 'lighter'; pen.fillStyle = DOT;
      for (let n = 0; n < run2.at.length; n++) dot(run2.at[n], run2.row[n]);
      face.needsUpdate = true;
    }
    function curve() { ctx.traces.nx.clear(); for (let k = 0; k < STRIPS; k++) ctx.traces.nx.add((k - (STRIPS - 1) / 2) * STRIP, run2.bins[k]); }
    // an electron arrives
    function land() {
      let x;
      do x = (Math.random() * 2 - 1) * REACH; while (Math.random() > chance(x));
      const row = Math.random();
      run2.at.push(x); run2.row.push(row); run2.bins[Math.round(x / STRIP) + (STRIPS - 1) / 2]++;
      dot(x, row); face.needsUpdate = true;
      spark.position.set(-0.03, BY + 0.2 + FACE.h / 2 - (FACE.top + row * FACE.tall) / FACE.px, x * SHOW);
      run2.spark = 0.3; run2.flash = 0.12;
    }
    // what is being tried is told as it was when it began; a line of the table for it (written anew while the same trial goes on)
    function beginBeam() {
      run2.due = 0; run2.at.length = run2.row.length = 0; run2.bins.fill(0); run2.spark = run2.flash = 0; run2.line = null;
      run2.tell = ctx.values.card ? [kind().name, fast(), (push() * 1e24).toFixed(1), lambda().toFixed(1), String(gap()), fringe().toFixed(1)] : null;
      paintFace(); curve();
    }
    function noteBeam() {
      if (!run2.tell || run2.at.length < 20) return;
      const table = ctx.tables.table2, above = table.rows[table.rows.length - 1], row = [...run2.tell, String(run2.at.length)];
      if (above && above.every((cell, i) => cell === row[i])) return;
      table.add(row, Boolean(above) && above === run2.line); run2.line = table.rows[table.rows.length - 1];
    }
    function advanceBeam(t, dt) {
      run2.spark = Math.max(0, run2.spark - dt); run2.flash = Math.max(0, run2.flash - dt);
      const before = run2.at.length;
      for (run2.due += RATES[ctx.values.rate] * dt; run2.due >= 1; run2.due--) land();
      if (run2.at.length !== before) curve();
    }
    function toStartBeam() {
      noteBeam();
      for (const [key, value] of [['kind', 'electron'], ['by', 'speed'], ['speed', 1.5], ['volt', 600], ['speedN', 8.2], ['speedC', 11.4], ['gap', 250], ['rate', 'mid'], ['card', true]]) if (!ctx.locked.has(key) && ctx.values[key] !== value) ctx.set(key, value);
      beginBeam(); moved = true;
    }
    // (in the basic mode it is electrons, their speed set as it is, and the slits 250 nm apart: what the menu then offers goes by these)
    function settle() { if (!ctx.advanced) for (const [key, value] of [['kind', 'electron'], ['by', 'speed'], ['gap', 250]]) if (ctx.values[key] !== value) ctx.set(key, value); }

    // ---------- handling ----------
    // The card is carried in the plane that faces the eye; near its holder it goes into it, and it stays there when
    // it is let go (let go anywhere else, it lies down on the bench).
    const beamTool = {
      handles: () => [cardHandle],
      start(grip, r) {
        plane.setFromNormalAndCoplanarPoint(way.copy(r.direction).negate(), card.position);
        if (!r.intersectPlane(plane, hit)) return false;
        if (ctx.locked.has('card')) { say('잠금', card.position.x, card.position.y + 0.9, card.position.z, 1.2); return false; }
        grab = { ...grip, off: card.position.clone().sub(hit), from: hit.clone(), at: card.position.clone(), moved: false, near: false };
        return true;
      },
      move(r) {
        if (!r.intersectPlane(plane, hit)) return;
        if (!grab.moved && hit.distanceTo(grab.from) < 0.12) return;   // (a press is not a pull)
        grab.moved = true; grab.at.copy(hit).add(grab.off); grab.at.y = Math.max(0.65, grab.at.y);
        grab.near = r.distanceToPoint(IN) < 1.3;
      },
      end(done) { if (done.moved && done.near !== ctx.values.card) ctx.set('card', done.near); },
    };

    function drawBeam() {
      const v = ctx.values, held = grab && grab.kind === 'card' && grab.moved, inside = held ? grab.near : v.card, half = gap() * CARD / 2, one = kind();
      // the card: in the hand, in its holder or on the bench
      if (inside) card.position.copy(IN); else if (held) card.position.copy(grab.at); else card.position.copy(OUT);
      if (inside || held) card.rotation.set(0, 0, 0); else card.rotation.set(0, Math.PI / 2, Math.PI / 2, 'YXZ');
      bars.forEach((bar, k) => { bar.position.z = (k ? 1 : -1) * half; bar.scale.z = WIDE * CARD; });
      mouth.material.color.setHex(run2.flash > 0 ? 0xcfe0ff : 0x15161c); spark.visible = run2.spark > 0;
      labels2.gun.write(one.source); labels2.gun.show(!(tall() && ctx.advanced && v.numbers));   // (on an upright screen the long list of the advanced mode lies over the gun)
      if (!inside && !held) spots2.card.set(OUT.x, 0.5, OUT.z); else if (tall()) spots2.card.set(card.position.x, card.position.y + 1.3, card.position.z + 1.0); else spots2.card.set(card.position.x, card.position.y - 0.1, card.position.z + 2.5);
      labels2.card.write('이중 슬릿'); labels2.card.show(!held);
      if (tall()) spots2.screen.set(XF - 0.3, 0.3, -1.9); else spots2.screen.set(XF + 1.0, BY + 1.3, 2.3);
      labels2.screen.write(`검출 스크린<br>${one.name} <b>${run2.at.length}개</b>`); labels2.screen.show(true);
      labels2.list.show(v.numbers);
      if (v.numbers) {
        const lines = [];
        if (volted()) lines.push(`가속 전압 <b>${v.volt} V</b>`, `운동 에너지 = 전하량 × 전압 = <b>${v.volt} eV</b>`);
        if (ctx.advanced) lines.push(`${one.name}의 질량(m) <b>${one.kg} kg</b>`);
        lines.push(`${one.name}의 속력(v) <b>${fast()}</b>`, `운동량(p) <b>${(push() * 1e24).toFixed(1)} ×10<sup>−24</sup> kg·m/s</b>`, `물질파 파장(λ) = h ÷ 운동량 = <b>${lambda().toFixed(1)} pm</b>`);
        if (!v.card) lines.push('슬릿판이 없음 → 무늬가 생기지 않음');
        else if (ctx.advanced) lines.push('무늬 간격 = 거리 × 파장 ÷ 슬릿 간격', `= ${FAR.toFixed(2)} m × ${lambda().toFixed(1)} pm ÷ ${gap()} nm = <b>${fringe().toFixed(1)} μm</b>`);
        else lines.push(`슬릿 사이의 간격 <b>${gap()} nm</b>`, `스크린까지의 거리 <b>${FAR.toFixed(2)} m</b>`, `무늬 간격 <b>${fringe().toFixed(1)} μm</b>`);
        if (ctx.advanced) lines.push('야구공의 물질파 파장 <b>약 10<sup>−34</sup> m</b>');
        labels2.list.write(lines.join('<br>'));
        if (tall()) { if (ctx.advanced) spots2.list.set(GUN - 1.4, 0.06, 0); else spots2.list.set(XF, BY + 1.85, 0.9); } else if (ctx.view.kind === 'fixed' && ctx.view.dir === 'top') spots2.list.set(-0.9, 0.3, -2.0); else if (ctx.advanced) spots2.list.set(3.3, 0.1, 5.0); else spots2.list.set(3.6, 0.3, 4.0);
      }
    }
    const beamScene = {
      rig: rig2, ids: ['kind', 'by', 'speed', 'volt', 'speedN', 'speedC', 'gap', 'rate', 'card', 'grains'], keep: ['card', 'grains'], kept: { card: true, grains: false },   // (the frame switches off the toggles of the other arrangement: the card is put back as it was left)
      look: [{ target: [-1.4, 1.1, 0.2], r: 13, theta: -0.8, phi: 0.9 }, { target: [-1.5, 0.9, 0], r: 16.5, theta: -1.45, phi: 0.95 }],
      handles: beamTool.handles, start: beamTool.start, move: beamTool.move, end: beamTool.end,
      enter() { rig2.visible = true; settle(); beginBeam(); ctx.setView('top'); },
      leave() { noteBeam(); rig2.visible = false; for (const label of Object.values(labels2)) label.show(false); },
      // (what was being tried is over: its line is written as it stood, the screen is cleared and another trial begins)
      changed(id) { if (id === 'rate') return; if (id === 'grains') { paintFace(); return; } noteBeam(); beginBeam(); },
      play(on) { if (!on) noteBeam(); },
      tick: advanceBeam, toStart: toStartBeam, draw: drawBeam, mark() { fresh = false; },
      mode() { noteBeam(); settle(); beginBeam(); },
    };

    const SCENES = { glow: glowScene, beam: beamScene }, scene = () => SCENES[ctx.values.scene];
    const frame = () => view.look(scene().look[tall() ? 1 : 0]);
    view.setTool({
      pick(r) {
        ray.ray.copy(r); scene().rig.updateMatrixWorld(true);
        const found = ray.intersectObjects(scene().handles(), false)[0];
        return found ? found.object.userData.grip : null;
      },
      cursor: (grip) => (!grip ? '' : 'grab'),
      start: (grip, r) => scene().start(grip, r),
      move(r) { scene().move(r); moved = true; },
      end() {
        const done = grab;
        grab = null; tip.show(false); tipTime = 0; moved = true;
        if (done) scene().end(done);
      },
    });
    ctx.on('play', (on) => { scene().play(on); moved = true; });
    ctx.on('tick', (t, dt) => { if (!dt) return; scene().tick(t, dt); moved = true; });
    ctx.on('action', (id) => { if (id === 'reset') scene().toStart(); if (id === 'charge' && onGlow(ctx.values)) charge(); });
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

    ctx.traces.k0.add(0, 0); ctx.traces.n0.add(0, 0);
    begin(); beamScene.leave(); glowScene.enter();
    return {
      beam: () => ({ kind: kind().name, gap: gap(), speed: speed(), push: push(), lambda: lambda(), fringe: fringe(), chance, count: run2.at.length, bins: run2.bins, card: card.position.toArray(), strip: STRIP }),
      glow: () => ({ q, angle: angle(), light: light(), share: light() ? share(light()) : 0, threshold: threshold(), shone: run.shone, flying: flying.length, freed: freed.length }),
      update(dt) {
        if (!framed) { framed = true; if (tall()) frame(); }
        if (tipTime > 0) { tipTime -= dt; if (tipTime <= 0) { tip.show(false); moved = true; } }
        if (fresh && !grab && performance.now() - since >= 600) scene().mark();
        if (!moved) return false;
        moved = false; scene().draw();
        return true;
      },
    };
  },
};
