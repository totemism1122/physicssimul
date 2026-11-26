// P-17 Energy levels (3D).
//
// A hydrogen atom as Bohr's model has it: about the nucleus the orbits n = 1 to 6, each drawn as a sphere of lines,
// their radii in the true ratio (n²). The electron sits on one of the orbits and is carried to another: nowhere
// between them can it stay (it is not drawn going round). Carried inwards, it gives out a photon whose energy is
// the difference of the two levels (−13.6 eV ÷ n²); carried outwards, it takes one in. A photon that is given out
// flies, with a tail of light, to the strip in front of the atom, where a line is left at its wavelength
// (1240 eV nm ÷ its energy): the lines gathered there are compared with the lines of hydrogen as they are measured
// (from the ultraviolet to the infrared, 0 to 2000 nm; the few that are longer are written in a box at the end).
// While the clock runs an electron above the lowest level falls of itself, after a little while, to one of the
// levels below, and one on the lowest level takes in light that lifts it to one of the levels above (not while the
// lamp of the advanced mode is used). The energy levels can be shown on a board beside the atom, as the textbook draws them: a line for
// each n, as high as its energy, so that the upper ones lie close together.
// Advanced: a lamp sends photons of an energy that is set at the atom, one each time it is pressed (on the board
// of the levels an arrow from the electron's level shows how far up that energy reaches). A photon is taken in
// only if its energy is the difference to one of the levels above; if it is as much as frees the electron or more,
// the electron leaves the atom with what is left over as its energy of motion; any other photon goes by. And the
// nucleus may hold two or three protons (the ions He+ and Li2+, with one electron as hydrogen has): the energies
// are then 4 or 9 times as great and the orbits a half or a third as wide (the picture stays as large: it is drawn
// that much magnified).
//
// The cloud (advanced only): the same atom as it is understood now. Where the electron is cannot be told
// beforehand, only how likely each place is (the square of the wave function of the state: 1s, 2s, 2p, 3s, 3p or
// 3d; of those that point some way, the one along the upright). While the clock runs a dot is put where the
// electron is found, one finding after another, each in an atom made ready in the same state: the dots gather
// into the cloud. All the states are drawn to one scale (the view comes nearer for the small ones); the sphere of
// Bohr's orbit of that n can be shown, and how many dots lie how far from the nucleus is drawn as a graph.
//
// What is set by hand can be set from the menu as well.
const GOLD = '#e3c26b';
const RYD = 13.6, HC = 1240, TOP = 6, BOHR = 0.0529;   // the energy that frees the electron from the lowest level (eV); Planck's constant times the speed of light (eV nm); the highest level the electron is put on; the radius of the first orbit (nm)
const level = (n) => -RYD / (n * n);   // the energy of the level n (eV)
// the colour of light of a wavelength (nm), as it is drawn (as in P-14); what is not seen is drawn pale violet (ultraviolet) or dull red (infrared)
const HUES = [[400, 150, 60, 255], [440, 80, 80, 255], [490, 0, 200, 255], [530, 40, 225, 80], [580, 255, 235, 40], [620, 255, 120, 30], [700, 255, 48, 36]];
function hue(nm) {
  const at = Math.max(400, Math.min(700, nm)), k = Math.max(1, HUES.findIndex((one) => one[0] >= at)), a = HUES[k - 1], b = HUES[k], s = (at - a[0]) / (b[0] - a[0]);
  return [1, 2, 3].map((i) => a[i] + (b[i] - a[i]) * s);
}
const tintOf = (nm) => (nm < 380 ? [186, 150, 255] : nm > 780 ? [170, 64, 54] : hue(nm));
const paint = (tint) => `rgb(${tint.map(Math.round).join()})`;
const bandOf = (nm) => (nm < 380 ? '자외선' : nm <= 780 ? '가시광선' : '적외선');
const SERIES = { 1: '라이먼 계열', 2: '발머 계열', 3: '파셴 계열' };   // the lines that end on the level 1, 2 and 3
const SEEN = [121.6, 102.6, 97.3, 95.0, 93.8, 656.3, 486.1, 434.0, 410.2, 1875, 1282, 1094];   // the lines of hydrogen as they are measured (nm): those between the levels up to TOP that are shorter than 2000 nm
const wave = (nm) => (nm < 200 ? nm.toFixed(1) : nm.toFixed(0));   // a wavelength as it is written
const minus = (text) => text.replace('-', '−');
// (advanced) the atoms with one electron, by the number of protons: their names in full and in short
const ATOMS = { 1: { name: '수소 원자', kind: '수소' }, 2: { name: '헬륨 이온 He<sup>+</sup>', kind: '헬륨 이온' }, 3: { name: '리튬 이온 Li<sup>2+</sup>', kind: '리튬 이온' } };
// (the cloud) the states that can be shown (n, l), the part of the wave function that goes by the distance r from the nucleus (in Bohr radii), and how far out the dots of each n are looked for
const ORBITALS = { '1s': [1, 0], '2s': [2, 0], '2p': [2, 1], '3s': [3, 0], '3p': [3, 1], '3d': [3, 2] };
const RADIAL = {
  '1s': (r) => 2 * Math.exp(-r), '2s': (r) => (2 - r) * Math.exp(-r / 2) / (2 * Math.SQRT2), '2p': (r) => r * Math.exp(-r / 2) / (2 * Math.sqrt(6)),
  '3s': (r) => 2 * (27 - 18 * r + 2 * r * r) * Math.exp(-r / 3) / (81 * Math.sqrt(3)), '3p': (r) => 8 * r * (1 - r / 6) * Math.exp(-r / 3) / (27 * Math.sqrt(6)), '3d': (r) => 4 * r * r * Math.exp(-r / 3) / (81 * Math.sqrt(30)),
};
const REACH = { 1: 8, 2: 20, 3: 34 }, PACE = { slow: 20, mid: 200, fast: 2000 };   // (PACE: dots a second)
const dense = (name, r) => (r * RADIAL[name](r)) ** 2;   // how likely the electron is to be found at the distance r, whatever the direction
const onOrbit = (v) => v.scene === 'orbit', onCloud = (v) => v.scene === 'cloud';   // which arrangement an item of a menu belongs to
const BEAM = { 1: { id: 'photon', most: 15, first: 10 }, 2: { id: 'photon2', most: 60, first: 40 }, 3: { id: 'photon3', most: 135, first: 90 } };   // (advanced) the lamp's photons for each of those atoms: the item of the menu, the most energy in eV, and what it is set to at first

export default {
  // what is taken for granted, written on screen by the frame
  premise: (v) => (onCloud(v) ? `점 하나는 같은 상태의 수소 원자에서 전자의 위치를 한 번 잰 결과입니다. 원자핵은 훨씬 크게 그렸습니다${/[pd]/.test(v.orbital) ? '. 방향이 여럿인 오비탈은 위아래 방향의 것 하나를 그렸습니다' : ''}` : `궤도의 반지름은 실제 비율(n²)대로, 원자핵과 전자는 훨씬 크게 그렸습니다${v.z !== '1' ? `(궤도는 ${v.z}배로 확대)` : ''}. 재생 중에는 ${v.shine ? '들뜬 전자가' : '바닥상태의 전자가 알맞은 빛을 흡수해 들뜨고, 들뜬 전자는'} 아래 궤도 가운데 하나로 내려간다고 보았습니다(실제보다 훨씬 느리게, 어느 궤도로 갈지는 같은 확률로)${v.chart ? '. 에너지 준위 그림의 높이는 에너지에 비례합니다' : ''}${v.shine ? '. 바닥상태의 전자는 등에서 쏜 광자를 흡수할 때만 들뜨고, 비춘 빛은 전자를 높은 준위로만 옮긴다고 보았습니다' : ''}`),   // (while the lamp is used the electron on the lowest level is not lifted of itself)
  fixedViews: ['front'],
  camera: { target: [0.6, 2.7, 0.4], r: 16, theta: 0, phi: 1.3, rMax: 40 },   // (low, so that the strip stands clear of the writing along the foot of the screen)
  traces: {
    // the cloud: how many dots lie in each shell about the nucleus, against how far out the shell is (nm); and a mark at the radius of Bohr's orbit (it is no count: nothing is written for it where the graph is pressed)
    cr: { window: 2, range: 10, read: (y) => `${Math.round(y)}개` }, cb: { window: 2, range: 10, read: () => '' },
  },
  menus: {
    vars: [
      { id: 'scene', label: '장면 선택', kind: 'choice', value: 'orbit', advanced: true, options: [{ id: 'orbit', label: '궤도와 전이' }, { id: 'cloud', label: '전자구름', advanced: true }] },
      { id: 'orbital', label: '오비탈', kind: 'choice', value: '1s', options: Object.keys(ORBITALS).map((id) => ({ id, label: id })), when: onCloud },
      { id: 'pace', label: '점을 찍는 빠르기', kind: 'choice', value: 'mid', options: [{ id: 'slow', label: '1초에 20개' }, { id: 'mid', label: '1초에 200개' }, { id: 'fast', label: '1초에 2000개' }], when: onCloud },
      { id: 'n', label: '전자의 궤도(n)', kind: 'choice', value: '1', when: onOrbit, options: [1, 2, 3, 4, 5, 6].map((n) => ({ id: String(n), label: `n = ${n}` })) },   // (the names of the choices are text)
      { id: 'z', label: '원자핵의 양성자 수(Z)', kind: 'choice', value: '1', advanced: true, when: onOrbit, options: [{ id: '1', label: 'Z = 1 (수소)' }, { id: '2', label: 'Z = 2 (헬륨 이온)' }, { id: '3', label: 'Z = 3 (리튬 이온)' }] },   // (in the basic mode it is always hydrogen: the simulation puts it back when the advanced mode is left)
      { id: 'shine', label: '빛 비추기', kind: 'toggle', advanced: true, when: onOrbit },
      ...[1, 2, 3].map((z) => ({ id: BEAM[z].id, label: '광자의 에너지', kind: 'slider', min: 0.1, max: BEAM[z].most, step: 0.01, value: BEAM[z].first, digits: 2, unit: ' eV', advanced: true, when: (v) => onOrbit(v) && v.shine && v.z === String(z) })),
      { id: 'more', label: '0.01 eV 올리기', kind: 'action', advanced: true, when: (v) => onOrbit(v) && v.shine },
      { id: 'less', label: '0.01 eV 내리기', kind: 'action', advanced: true, when: (v) => onOrbit(v) && v.shine },
      { id: 'fire', label: '광자 쏘기', kind: 'action', advanced: true, when: (v) => onOrbit(v) && v.shine },
    ],
    graph: [
      { id: 'far', label: '점의 수–거리', kind: 'graph', x: '원자핵에서의 거리', xUnit: 'nm', when: onCloud,
        plots: [{ y: '점의 수', floor: true, lines: [{ trace: 'cr', color: '#f3eedf' }, { trace: 'cb', color: GOLD, name: '보어 궤도의 반지름' }] }] },
    ],
    time: [
      { id: 'reset', label: '처음으로', kind: 'action' },
    ],
    layers: [
      { id: 'chart', label: '에너지 준위 그림', kind: 'toggle', when: onOrbit },
      { id: 'ring', label: '보어 궤도의 반지름', kind: 'toggle', when: onCloud },
      { id: 'numbers', label: '값', kind: 'toggle' },
    ],
    inquiry: [
      { id: 'table', label: '기록 표', kind: 'table', wide: true, rows: 10, when: onOrbit, text: '전자가 전이할 때마다 한 줄씩 적힙니다.',
        columns: [{ label: '원자', advanced: true }, { label: '전이' }, { label: '빛' }, { label: '광자의<br>에너지', unit: 'eV', result: true }, { label: '파장', unit: 'nm', result: true }, { label: '영역', result: true }, { label: '계열', result: true }] },
    ],
  },

  // writing on the chalkboard (1024 x 400)
  board(g) {
    g.fillStyle = 'rgba(255,255,255,0.9)'; g.font = '56px Georgia, serif'; g.fillText('에너지 준위', 60, 96);
    g.strokeStyle = 'rgba(255,255,255,0.85)'; g.lineWidth = 4;
    // the levels, and a step down from one to another
    for (const y of [350, 222, 186, 172]) { g.beginPath(); g.moveTo(90, y); g.lineTo(360, y); g.stroke(); }
    g.beginPath(); g.moveTo(230, 190); g.lineTo(230, 338); g.moveTo(218, 318); g.lineTo(230, 342); g.lineTo(242, 318); g.stroke();
    g.beginPath(); for (let x = 250; x <= 330; x += 3) { const y = 280 - 14 * Math.sin((x - 250) / 6); if (x === 250) g.moveTo(x, y); else g.lineTo(x, y); } g.stroke();
    // the lines of a spectrum
    g.strokeRect(470, 200, 480, 110);
    for (const x of [520, 548, 590, 700]) { g.beginPath(); g.moveTo(x, 206); g.lineTo(x, 304); g.stroke(); }
  },

  // Builds the apparatus on the bench (world) and returns { update(dt) }.
  create({ T, kit, world, view, ctx }) {
    const { mat, add, box, cyl } = kit;
    world.userData.things.visible = false;
    const hit = new T.Vector3(), way = new T.Vector3();
    const M = { dark: mat(0x3a4057), steel: mat(0x9aa1b1, { roughness: 0.5, metalness: 0.5 }), slate: mat(0x23262f, { roughness: 0.9 }) };
    const tipSpot = new T.Vector3(), tip = view.label(tipSpot);   // a word beside what is handled
    let moved = true, tipTime = 0, framed = false, grab = null;
    function say(text, x, y, z, seconds = 0) { tip.write(text); tipSpot.set(x, y, z); tip.show(true); tipTime = seconds; moved = true; }
    const tall = () => window.matchMedia('(max-aspect-ratio: 4/5)').matches;
    // (advanced) how many protons the nucleus holds; the energy of the level n of that atom (eV); the lamp's photons for it, and their energy now
    const zed = () => (ctx.advanced ? Number(ctx.values.z) : 1), lev = (n) => level(n) * zed() * zed(), beam = () => BEAM[zed()], shot = () => ctx.values[beam().id];
    const told2 = (energy) => minus(energy.toFixed(Math.abs(energy) >= 10 ? 1 : 2));   // an energy as it is written on the board
    // With how many decimals the energies of a step between two levels are written, in the list of values and in the
    // table: two, or three where two would not give the results written beside them when the sums are done with the
    // numbers as written. No more than three (the user's rule for the digits that count), though a few steps between
    // high levels then give a wavelength a little off the one written.
    function digits(one, other) {
      const energy = Math.abs(lev(one) - lev(other)), upper = Math.max(lev(one), lev(other)), lower = Math.min(lev(one), lev(other));
      for (let d = 2; d < 3; d++) if ((Number(upper.toFixed(d)) - Number(lower.toFixed(d))).toFixed(d) === energy.toFixed(d) && wave(HC / Number(energy.toFixed(d))) === wave(HC / energy)) return d;
      return 3;
    }
    const UP = new T.Vector3(0, 1, 0), DOWN = new T.Vector3(0, -1, 0), RIGHT = new T.Vector3(1, 0, 0), LEFT = new T.Vector3(-1, 0, 0);

    // ---------- the atom ----------
    // The nucleus is at C, before a dark board that the lines are seen against. The orbit n is a sphere n² × A0
    // across (half): three rings (one facing the front, one level, one edge on from the front). The electron is a
    // bead on its orbit, to the right of the nucleus; the last step it made is an arrow a little below that line.
    const C = new T.Vector3(0, 3.8, -0.4), A0 = 0.07, wide = (n) => n * n * A0;
    const rig = new T.Group(); world.add(rig);
    add(rig, box(5.8, 5.8, 0.1), M.slate, C.x, C.y, C.z - 2.62);
    for (const x of [-2.2, 2.2]) { add(rig, box(0.14, C.y - 2.9, 0.14), M.steel, C.x + x, (C.y - 2.9) / 2, C.z - 2.62); add(rig, box(0.5, 0.1, 0.8), M.dark, C.x + x, 0.05, C.z - 2.4); }
    add(rig, cyl(0.022, 0.022, C.y, 8), M.steel, C.x, C.y / 2, C.z); add(rig, cyl(0.45, 0.5, 0.1, 24), M.dark, C.x, 0.05, C.z);   // (the rod that holds the nucleus up)
    const atom = new T.Group(); atom.position.copy(C); rig.add(atom);
    const only = new T.Group(), orbs = new T.Group(); rig.add(only); atom.add(orbs);   // what belongs to the orbits and their steps alone (not shown with the cloud): on the bench, and about the nucleus
    add(atom, new T.SphereGeometry(0.035, 16, 12), kit.glow(0xe58373), 0, 0, 0, false, false);
    const ringInk = { main: new T.MeshBasicMaterial({ color: 0xcfd6e6 }), side: new T.MeshBasicMaterial({ color: 0x6f7890 }), now: new T.MeshBasicMaterial({ color: 0xe3c26b }), aim: new T.MeshBasicMaterial({ color: 0x7fa6e6 }) };
    const shells = [1, 2, 3, 4, 5, 6].map((n) => {
      const r = wide(n), main = add(orbs, new T.TorusGeometry(r, 0.012, 8, 96), ringInk.main, 0, 0, 0, false, false);
      add(orbs, new T.TorusGeometry(r, 0.008, 6, 96).rotateX(Math.PI / 2), ringInk.side, 0, 0, 0, false, false); add(orbs, new T.TorusGeometry(r, 0.008, 6, 96).rotateY(Math.PI / 2), ringInk.side, 0, 0, 0, false, false);
      return { n, main };
    });
    const halo = add(orbs, new T.SphereGeometry(1, 40, 28), new T.MeshBasicMaterial({ color: 0xe3c26b, transparent: true, opacity: 0.08, depthWrite: false }), 0, 0, 0, false, false); halo.renderOrder = 2;   // (the sphere of the orbit the electron is on, faintly)
    { const px = 1024 / 5.4, names = kit.canvasTexture(1024, 1024, (g) => { g.fillStyle = '#aab2c5'; g.font = '28px Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; for (let n = 1; n <= TOP; n++) g.fillText(`n = ${n}`, 512, 512 - (wide(n) + 0.11) * px); });   // the names of the orbits, over the top of each
      add(orbs, new T.PlaneGeometry(5.4, 5.4), new T.MeshBasicMaterial({ map: names, transparent: true, depthWrite: false, toneMapped: false }), 0, 0, 0.01, false, false).renderOrder = 3; }
    const bead = add(orbs, new T.SphereGeometry(0.065, 18, 12), kit.glow(0x4f8fe0), wide(1), 0, 0, false, false);
    const handle = add(orbs, box(0.45, 0.7, 0.5), M.dark, wide(1), 0, 0, false, false); handle.visible = false; handle.userData.grip = { kind: 'electron' };
    const hop = kit.arrow(0xe3c26b, 0.022); hop.visible = false; orbs.add(hop);
    const seatOf = (n, out) => out.set(C.x + wide(n), C.y, C.z);   // where the electron is on the orbit n

    // ---------- the strip ----------
    // The strip leans on the bench in front of the atom: across it the wavelengths from 0 to 2000 nm (STRIP.per
    // units to a nm, from STRIP.left), in a box at its end what is longer. Upper row: the lines of hydrogen as
    // they are measured; lower row: the light given out by the steps the electron has made.
    const STRIP = { w: 9.4, h: 2.2, px: 128, left: -4.3, per: 0.004, lean: Math.PI / 2 - 0.75, y: 0.1, z: 2.7, box: 4.15 };
    const strip = new T.Group(); strip.position.set(0, STRIP.y, STRIP.z); strip.rotation.x = -STRIP.lean; only.add(strip);
    add(strip, box(STRIP.w + 0.2, STRIP.h + 0.2, 0.1), M.slate, 0, STRIP.h / 2, -0.06);
    const band = kit.canvasTexture(Math.round(STRIP.w * STRIP.px), Math.round(STRIP.h * STRIP.px), () => {}), pen = band.image.getContext('2d');
    add(strip, new T.PlaneGeometry(STRIP.w, STRIP.h), new T.MeshBasicMaterial({ map: band, toneMapped: false }), 0, STRIP.h / 2, 0, false, false);
    for (const x of [-4.2, 4.2]) add(only, box(0.12, 1.5, 0.12), M.steel, x, 0.75, 1.02);
    const onStrip = (x, up, out) => out.set(x, STRIP.y + up * Math.cos(STRIP.lean) + 0.04, STRIP.z - up * Math.sin(STRIP.lean) + 0.04);   // a point of the strip: x across it, up from its lower edge
    const place = (nm) => (nm <= 2000 ? STRIP.left + nm * STRIP.per : STRIP.box);

    // ---------- the board with the levels (shown or not) ----------
    // The level of the energy E is drawn Y0 + (E + 13.6) × EV high, so that nought (the electron free) is 6.8
    // units above the lowest level. A bead marks the level the electron is on; the last step is an arrow at x = AX,
    // as long as the levels are apart. All of it is one group: beside the atom or, on an upright screen, over it
    // and a little smaller.
    const Y0 = 1.4, EV = 0.5, EX = -1.2, AX = -0.4, RX = -2.05, FACE = { w: 6, lo: 0.9, hi: 9.2, px: 128 }, SMALL = 0.8;
    const high = (n) => Y0 + (level(n) + RYD) * EV;   // (the same for every atom: the board is drawn to the scale of its own energies)
    const chart = new T.Group(); only.add(chart);
    add(chart, box(FACE.w + 0.2, FACE.hi - FACE.lo + 0.2, 0.12), M.slate, 0, (FACE.hi + FACE.lo) / 2, -0.07);
    const legs = new T.Group(); chart.add(legs);
    for (const x of [-2.4, 2.4]) { add(legs, box(0.14, FACE.lo, 0.14), M.steel, x, FACE.lo / 2, -0.07); add(legs, box(0.5, 0.1, 1.2), M.dark, x, 0.05, -0.07); }
    const sheet = kit.canvasTexture(FACE.w * FACE.px, Math.round((FACE.hi - FACE.lo) * FACE.px), () => {}), ink = sheet.image.getContext('2d');
    add(chart, new T.PlaneGeometry(FACE.w, FACE.hi - FACE.lo), new T.MeshBasicMaterial({ map: sheet, toneMapped: false }), 0, (FACE.hi + FACE.lo) / 2, 0, false, false);
    const dot = add(chart, new T.SphereGeometry(0.15, 20, 14), kit.glow(0x4f8fe0), EX, high(1), 0.14, false, false);
    const rise = kit.arrow(0xe3c26b, 0.035); rise.visible = false; chart.add(rise);
    // (advanced) the arrow that shows how far up the lamp's photons would lift the electron (at x = RX, as long as their energy), with a part at its tip by which it is pulled
    const reach = kit.arrow(0xffffff, 0.03); reach.visible = false; chart.add(reach);
    const reachHandle = add(chart, box(0.6, 0.5, 0.3), M.dark, RX, 0, 0.2, false, false); reachHandle.visible = false; reachHandle.userData.grip = { kind: 'reach' };
    const rate = () => EV / (zed() * zed());   // units of the board to an eV
    const onChart = (x, y, out) => out.set(chart.position.x + x * chart.scale.x, chart.position.y + y * chart.scale.y, chart.position.z + 0.2);   // a point of the board, in the scene

    // ---------- (advanced) the lamp, at the left of the atom ----------
    const LAMP = new T.Vector3(-3.95, 5.6, C.z + 0.3);
    const lamp = new T.Group(); only.add(lamp);
    add(lamp, cyl(0.32, 0.32, 0.9, 24).rotateZ(Math.PI / 2), M.dark, LAMP.x, LAMP.y, LAMP.z);
    const glass = add(lamp, cyl(0.26, 0.26, 0.04, 24).rotateZ(Math.PI / 2), new T.MeshBasicMaterial({ color: 0xffffff }), LAMP.x + 0.47, LAMP.y, LAMP.z, false, false);
    add(lamp, cyl(0.06, 0.06, LAMP.y - 0.3, 10), M.steel, LAMP.x, (LAMP.y - 0.3) / 2, LAMP.z); add(lamp, box(0.9, 0.12, 0.9), M.dark, LAMP.x, 0.06, LAMP.z);
    const lampHandle = add(lamp, box(1.3, 1.0, 1.0), M.dark, LAMP.x, LAMP.y, LAMP.z, false, false); lampHandle.visible = false; lampHandle.userData.grip = { kind: 'lamp' };

    // ---------- the photons on their way ----------
    // Each is a ball of light with a glow about it and a tail behind: bright and clear where the light is seen,
    // dim where it is not (ultraviolet, infrared).
    const pool = Array.from({ length: 8 }, () => {
      const group = new T.Group(); group.visible = false; only.add(group);
      const inks = [1, 0.3, 0.55].map((opacity) => new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity, depthWrite: false }));
      const head = add(group, new T.SphereGeometry(0.1, 14, 10), inks[0], 0, 0, 0, false, false), glow = add(group, new T.SphereGeometry(0.21, 14, 10), inks[1], 0, 0, 0, false, false);
      const tail = add(group, new T.ConeGeometry(0.095, 1, 14, 1, true).translate(0, 0.5, 0), inks[2], 0, 0, 0, false, false);   // (its wide end at the ball, its point behind)
      for (const part of [head, glow, tail]) part.renderOrder = 6;
      return { group, inks, tail };
    });
    const spots = { electron: new T.Vector3(), line: new T.Vector3(), list: new T.Vector3(), lamp: new T.Vector3(LAMP.x, LAMP.y + 0.6, LAMP.z), name: new T.Vector3(C.x - 1.75, C.y + 2.35, C.z - 2.5), count: new T.Vector3(C.x + 2.0, C.y + 2.35, C.z - 2.5) };
    const labels = { electron: view.label(spots.electron, false, -0.12), line: view.label(spots.line), list: view.label(spots.list, true), lamp: view.label(spots.lamp, true), name: view.label(spots.name), count: view.label(spots.count) };

    // ---------- physics ----------
    // at: the level the electron is on; seat: where its bead is drawn (it goes outwards only when the photon it
    // takes in has come). last: the last step (from, to, the energy of the photon in eV, its wavelength in nm, out:
    // given out). made: the wavelengths given out so far, each with the step that gave it. flights: the photons on
    // their way. wait: how long until an electron above the lowest level falls of itself.
    // (advanced) at is nought once the electron has left the atom: gone, what it left with (ke: its energy of
    // motion, eV; from: the level it was on; t: how long ago). told: what became of the lamp's last photon.
    // lit: the step that is being made is one the lamp's photon has caused.
    let at = 1, seat = 1, last = null, latest = null, wait = 1, quiet = false, gone = null, told = '', lit = false;
    const made = new Map(), flights = [];
    const shining = () => ctx.advanced && ctx.values.shine;
    function launch(from, to, time, nm, into, done) {
      if (flights.length === pool.length) land(flights[0]);
      const ball = pool.find((one) => !one.group.visible), tint = tintOf(nm), seen = nm >= 380 && nm <= 780;
      ball.inks.forEach((one, k) => { one.color.setRGB(tint[0] / 255, tint[1] / 255, tint[2] / 255, T.SRGBColorSpace); one.opacity = [1, 0.3, 0.55][k] * (seen ? 1 : 0.5); });
      ball.group.position.copy(from); ball.group.quaternion.setFromUnitVectors(UP, way.copy(from).sub(to).normalize()); ball.tail.scale.y = 0.001; ball.group.visible = true;
      flights.push({ ball, from, to, far: from.distanceTo(to), time, t: 0, into, done });
    }
    function land(flight) { flight.ball.group.visible = false; flights.splice(flights.indexOf(flight), 1); flight.done(); moved = true; }
    // the electron goes from one level to another
    function jump(from, to) {
      if (from === to) return;   // (no step, no light)
      for (const flight of flights.filter((one) => one.into)) land(flight);   // (what was coming to the electron has come)
      const energy = Math.abs(lev(from) - lev(to)), nm = HC / energy, out = to < from;
      last = { from, to, energy, nm, out };
      if (out) {
        seat = to;
        launch(new T.Vector3(C.x + (wide(from) + wide(to)) / 2, C.y, C.z + 0.05), onStrip(place(nm), 0.78, new T.Vector3()), 0.9, nm, false, () => { made.set(`${from} → ${to}`, nm); latest = nm; paintStrip(); });
      } else if (lit) seat = to;   // (the photon has come already)
      else launch(new T.Vector3(C.x - 3.3, C.y + 2.4, C.z + 0.8), seatOf(from, new T.Vector3()), 0.55, nm, true, () => { seat = to; });
      ctx.tables.table.add([ATOMS[zed()].kind, `${from} → ${to}`, out ? '방출' : '흡수', energy.toFixed(digits(from, to)), wave(nm), bandOf(nm), (zed() === 1 && SERIES[Math.min(from, to)]) || '–']);
      say(`${out ? '빛을 방출' : '빛을 흡수'} <b>${wave(nm)} nm</b>`, C.x + 1.4, C.y - 1.9, C.z, 2.2);
      wait = 0.8 + Math.random() * 1.2;
    }
    // (advanced) a photon leaves the lamp for the electron; and what becomes of it there
    function cast() {
      const energy = shot(), nm = HC / energy, from = new T.Vector3(LAMP.x + 0.55, LAMP.y, LAMP.z), to = seatOf(seat || 1, new T.Vector3());
      launch(from, to, 0.6, nm, false, () => {
        const up = at ? [2, 3, 4, 5, 6].find((n) => n > at && Math.abs(lev(n) - lev(at) - energy) < 0.005) : 0;
        if (up) { told = '흡수됨'; lit = true; ctx.set('n', String(up)); lit = false; return; }
        if (at && energy > -lev(at) - 0.005) { leave(energy); return; }
        if (at) told = '흡수되지 않음';
        launch(to, to.clone().add(to.clone().sub(from).normalize().multiplyScalar(5.5)), 0.55, nm, false, () => {});   // (it goes by)
      });
    }
    function leave(energy) {
      const from = at, nm = HC / energy, ke = Math.max(0, energy + lev(from));
      for (const flight of flights.filter((one) => one.into)) land(flight);
      last = { from, to: 0, energy, nm, out: false, ke }; gone = { ke, from, t: 0 }; at = seat = 0; told = '이온화';
      quiet = true; ctx.set('n', '0'); quiet = false;   // (no level is chosen now)
      ctx.tables.table.add([ATOMS[zed()].kind, `${from} → ∞`, '흡수(이온화)', energy.toFixed(2), wave(nm), bandOf(nm), '–']);
      say('이온화: 전자가 원자를 벗어남', C.x + 1.4, C.y - 1.9, C.z, 3);
    }
    // While the clock runs: an electron above the lowest level falls to any of the levels below, each as likely as
    // the others; one on the lowest level takes in light that lifts it to any of the levels above (not while the
    // lamp is used: there the lamp's photons alone lift it).
    function advance(t, dt) {
      if (!at || grab || (at === 1 && shining())) return;
      wait -= dt;
      if (wait <= 0) ctx.set('n', String(at === 1 ? 2 + Math.floor(Math.random() * (TOP - 1)) : 1 + Math.floor(Math.random() * (at - 1))));
    }
    // another trial: the electron on the lowest level, nothing given out yet
    function clear() {
      for (const flight of flights) flight.ball.group.visible = false;
      flights.length = 0; made.clear(); last = latest = null; at = seat = 1; gone = null; told = ''; tip.show(false);
      if (ctx.values.n !== '1') { quiet = true; ctx.set('n', '1'); quiet = false; }
      paintStrip(); paintBoard(); moved = true;
    }
    function toStart() {
      const held = ctx.locked.has('n') ? { at, gone } : null;   // (an electron whose orbit is held stays where it is)
      if (ctx.advanced) {
        if (ctx.values.shine) ctx.set('shine', false);
        for (const one of Object.values(BEAM)) if (ctx.values[one.id] !== one.first && !ctx.locked.has(one.id)) ctx.set(one.id, one.first);
        if (ctx.values.z !== '1' && !ctx.locked.has('z')) ctx.set('z', '1');
      }
      clear();
      if (held) { at = seat = held.at; gone = held.gone; if (ctx.values.n !== String(at)) { quiet = true; ctx.set('n', String(at)); quiet = false; } }
    }

    // ---------- the pictures ----------
    // the board: a line for each level, its name beside it (the names of the upper ones set apart, each tied to its line)
    function paintBoard() {
      const px = FACE.px, X = (x) => (x + FACE.w / 2) * px, Y = (y) => (FACE.hi - y) * px, numbers = ctx.values.numbers;
      ink.fillStyle = '#1b1e27'; ink.fillRect(0, 0, sheet.image.width, sheet.image.height);
      ink.strokeStyle = ink.fillStyle = '#8f98ad'; ink.lineWidth = 3;
      ink.beginPath(); ink.moveTo(X(-2.7), Y(Y0 - 0.2)); ink.lineTo(X(-2.7), Y(8.75)); ink.stroke();
      ink.beginPath(); ink.moveTo(X(-2.7), Y(8.98)); ink.lineTo(X(-2.8), Y(8.72)); ink.lineTo(X(-2.6), Y(8.72)); ink.fill();
      ink.font = '28px Georgia, serif'; ink.textAlign = 'left'; ink.textBaseline = 'middle'; ink.fillText('에너지', X(-2.5), Y(8.9));
      for (const [n, name] of [[1, high(1)], [2, high(2)], [3, high(3)], [4, 7.8], [5, 8.15], [6, 8.5], [0, 8.85]]) {
        const y = n ? high(n) : Y0 + RYD * EV;
        ink.strokeStyle = n ? '#dfe6f5' : '#8f98ad'; ink.lineWidth = n ? 3 : 2; ink.setLineDash(n ? [] : [10, 8]);
        ink.beginPath(); ink.moveTo(X(-2.3), Y(y)); ink.lineTo(X(1.0), Y(y)); ink.stroke(); ink.setLineDash([]);
        ink.strokeStyle = '#6f7890'; ink.lineWidth = 1.5; ink.beginPath(); ink.moveTo(X(1.0), Y(y)); ink.lineTo(X(1.25), Y(name)); ink.stroke();
        ink.fillStyle = n ? '#f3eedf' : '#aab2c5'; ink.fillText(`n = ${n || '∞'}`, X(1.32), Y(name));
        if (numbers) { ink.fillStyle = GOLD; ink.fillText(n ? `${told2(lev(n))} eV` : '0 eV', X(2.0), Y(name)); }
      }
      sheet.needsUpdate = true;
    }
    // the strip
    function paintStrip() {
      const px = STRIP.px, X = (x) => (x + STRIP.w / 2) * px, Y = (up) => (STRIP.h - up) * px, of = (nm) => X(STRIP.left + nm * STRIP.per), row = 0.45 * px;
      pen.fillStyle = '#15171e'; pen.fillRect(0, 0, band.image.width, band.image.height);
      pen.fillStyle = '#0b0c11'; pen.fillRect(of(0), Y(1.6), of(2000) - of(0), row); pen.fillRect(of(0), Y(1.0), of(2000) - of(0), row);
      for (const [from, to, tint] of [[0, 380, 'rgba(150,120,230,0.13)'], [380, 780, 'rgba(255,255,255,0.10)'], [780, 2000, 'rgba(200,70,60,0.13)']]) { pen.fillStyle = tint; pen.fillRect(of(from), Y(2.16), of(to) - of(from), (2.16 - 0.5) * px); }
      pen.textAlign = 'center'; pen.textBaseline = 'middle'; pen.font = '21px Georgia, serif'; pen.fillStyle = '#aab2c5';
      pen.fillText('자외선', of(215), Y(2.04)); pen.fillText('가시광선', of(580), Y(2.04)); pen.fillText('적외선', of(1390), Y(2.04));
      // the three families of lines: from where each crowds together to its longest line
      pen.strokeStyle = '#8f98ad'; pen.lineWidth = 2; pen.fillStyle = '#d8d2c4'; pen.font = '20px Georgia, serif';
      for (const [lo, hi, name, mid] of zed() === 1 ? [[91.2, 121.6, SERIES[1], 130], [364.7, 656.5, SERIES[2], 510], [820.6, 1875.6, SERIES[3], 1350]] : []) {
        pen.beginPath(); pen.moveTo(of(lo), Y(1.64)); pen.lineTo(of(lo), Y(1.7)); pen.lineTo(of(hi), Y(1.7)); pen.lineTo(of(hi), Y(1.64)); pen.stroke();
        pen.fillText(name, of(mid), Y(1.83));
      }
      pen.fillStyle = '#6f7890'; pen.font = '19px Georgia, serif';
      const words = zed() === 1 ? 1580 : 1450;   // (where no line of that atom falls)
      pen.fillText(zed() === 1 ? '관찰한 수소 선스펙트럼' : `식으로 구한 ${ATOMS[zed()].kind}의 선스펙트럼`, of(words), Y(1.375)); pen.fillText('전이에서 방출된 빛', of(words), Y(0.775));
      // (the lines of the ions are not measured ones: they are reckoned, and lie where hydrogen's would, at a quarter or a ninth of the wavelength)
      const seen = zed() === 1 ? SEEN : [1, 2, 3, 4, 5].flatMap((lo) => [2, 3, 4, 5, 6].filter((hi) => hi > lo).map((hi) => HC / (lev(hi) - lev(lo)))).filter((nm) => nm <= 2000);
      for (const nm of seen) { pen.fillStyle = paint(tintOf(nm)); pen.fillRect(of(nm) - 1.5, Y(1.6), 3, row); }
      const long = [];
      for (const nm of made.values()) { if (nm > 2000) { long.push(`${wave(nm)} nm`); continue; } pen.fillStyle = paint(tintOf(nm)); pen.fillRect(of(nm) - 1.5, Y(1.0), 3, row); }
      // the rule, and the box for what is longer than it holds
      pen.strokeStyle = pen.fillStyle = '#d8d2c4'; pen.lineWidth = 2; pen.font = '20px Georgia, serif';
      pen.beginPath(); for (let nm = 0; nm <= 2000; nm += 100) { pen.moveTo(of(nm), Y(0.5)); pen.lineTo(of(nm), Y(nm % 500 ? 0.43 : 0.36)); } pen.stroke();
      for (let nm = 0; nm <= 2000; nm += 500) pen.fillText(String(nm), of(nm), Y(0.2));
      pen.fillText('nm', X(STRIP.box), Y(0.2));
      pen.strokeStyle = '#6f7890'; pen.strokeRect(X(3.78), Y(1.6), 0.76 * px, 1.05 * px);
      pen.fillStyle = '#aab2c5'; pen.font = '17px Georgia, serif'; pen.fillText('더 긴 파장', X(STRIP.box), Y(1.47));
      pen.fillStyle = paint(tintOf(3000)); long.sort().forEach((text, k) => pen.fillText(text, X(STRIP.box), Y(1.2 - 0.24 * k)));
      band.needsUpdate = true;
    }

    // ====================================== the cloud ======================================
    // A dot for each finding, about the same nucleus: UNIT units to a Bohr radius, for every state. mist: how
    // many dots there are, the part of a dot that is owed, and how many lie in each of SHELLS shells out to REACH.
    const UNIT = 0.1, MOST = 30000, SHELLS = 60;
    const clouded = () => ctx.advanced && ctx.values.scene === 'cloud';
    const cloud = new T.Group(); cloud.position.copy(C); cloud.visible = false; rig.add(cloud);
    const places = new Float32Array(MOST * 3), dots = new T.BufferGeometry(); dots.setAttribute('position', new T.BufferAttribute(places, 3)); dots.setDrawRange(0, 0);
    const haze = new T.Points(dots, new T.PointsMaterial({ color: 0xa9c8ff, size: 0.03, sizeAttenuation: true, transparent: true, opacity: 0.5, depthWrite: false })); haze.frustumCulled = false; haze.renderOrder = 4; cloud.add(haze);
    const guides = [1, 2, 3].map((n) => {   // the sphere of Bohr's orbit of each n: three rings, as the orbits are drawn
      const group = new T.Group(), r = n * n * UNIT; cloud.add(group);
      for (const turn of [null, 'rotateX', 'rotateY']) { const ring = new T.TorusGeometry(r, 0.006 * n, 6, 96); if (turn) ring[turn](Math.PI / 2); add(group, ring, ringInk.now, 0, 0, 0, false, false); }
      return group;
    });
    // for each state: the greatest of its likelihood by distance, and where that is (in Bohr radii)
    const PEAK = Object.fromEntries(Object.keys(ORBITALS).map((name) => { let top = 0, at = 0; for (let r = 0; r <= REACH[ORBITALS[name][0]]; r += 0.01) if (dense(name, r) > top) { top = dense(name, r); at = r; } return [name, { top, at }]; }));
    const mist = { count: 0, due: 0, bins: new Array(SHELLS).fill(0) };
    const shape = () => ORBITALS[ctx.values.orbital];
    // the electron is found somewhere: how far out by the likelihood of each distance, which way by that of each direction (the upright is the axis)
    function find() {
      const name = ctx.values.orbital, [n, l] = shape(), reach = REACH[n];
      let r, u;
      do r = Math.random() * reach; while (Math.random() * PEAK[name].top > dense(name, r));
      if (l === 0) u = Math.random() * 2 - 1; else if (l === 1) u = Math.cbrt(Math.random()) * (Math.random() < 0.5 ? -1 : 1); else do u = Math.random() * 2 - 1; while (Math.random() * 4 > (3 * u * u - 1) ** 2);
      const round = Math.random() * 2 * Math.PI, flat = Math.sqrt(1 - u * u) * r * UNIT;
      places.set([flat * Math.cos(round), u * r * UNIT, flat * Math.sin(round)], mist.count * 3);
      mist.count++; mist.bins[Math.min(SHELLS - 1, Math.floor(r / reach * SHELLS))]++;
    }
    function curve() {   // for the graph: the dots by distance (nm), and the mark at the radius of Bohr's orbit
      const n = shape()[0], wideOf = REACH[n] / SHELLS * BOHR;
      ctx.traces.cr.clear(); ctx.traces.cb.clear();
      mist.bins.forEach((some, k) => ctx.traces.cr.add((k + 0.5) * wideOf, some));
      ctx.traces.cb.add(n * n * BOHR, 0); ctx.traces.cb.add(n * n * BOHR, Math.max(1, ...mist.bins));
    }
    function rain(dt) {
      const before = mist.count;
      for (mist.due += PACE[ctx.values.pace] * dt; mist.due >= 1; mist.due--) if (mist.count < MOST) find();
      if (mist.count !== before) { dots.attributes.position.needsUpdate = true; dots.setDrawRange(0, mist.count); curve(); }
    }
    function wipe() { mist.count = 0; mist.due = 0; mist.bins.fill(0); dots.setDrawRange(0, 0); curve(); moved = true; }
    function drawCloud() {
      const v = ctx.values, [n] = shape(), name = v.orbital;
      haze.material.size = 0.008 + 0.009 * n;   // (the view is further off for the larger states)
      guides.forEach((group, k) => { group.visible = v.ring && k === n - 1; });
      for (const key of ['electron', 'line', 'lamp']) labels[key].show(false);
      labels.name.write('수소 원자 (전자구름 모형)'); labels.name.show(true);
      spots.count.set(C.x + (n === 1 ? 0.55 : n === 2 ? 1.25 : 2.0), C.y + (n === 1 ? 0.62 : n === 2 ? 1.45 : 2.35), C.z - (n === 3 ? 2.5 : 0)); spots.name.set(C.x - (n === 1 ? 0.45 : n === 2 ? 1.1 : 1.75), C.y + (n === 1 ? 0.62 : n === 2 ? 1.45 : 2.35), C.z - (n === 3 ? 2.5 : 0));
      labels.count.write(`${name} · 점 <b>${mist.count}개</b>`); labels.count.show(true);
      labels.list.show(v.numbers);
      if (v.numbers) {
        labels.list.write([`오비탈 <b>${name}</b> (n = ${n})`, `에너지 <b>${minus(level(n).toFixed(2))} eV</b>`, `가장 많이 발견되는 거리 <b>${(PEAK[name].at * BOHR).toFixed(3)} nm</b>`, `보어 궤도의 반지름 = ${n}² × ${BOHR} nm = <b>${(n * n * BOHR).toFixed(3)} nm</b>`].join('<br>'));
        spots.list.set(C.x, C.y - (n === 1 ? 0.75 : n === 2 ? 1.6 : 2.75), C.z); labels.list.shift = -0.02;
      }
    }
    // the things of the one arrangement or of the other
    function stage() {
      const on = clouded();
      only.visible = orbs.visible = !on; cloud.visible = on; labels.count.show(false); labels.list.shift = 0;
      spots.name.set(C.x - 1.75, C.y + 2.35, C.z - 2.5);
      if (on) { while (flights.length) land(flights[0]); tip.show(false); tipTime = 0; wipe(); }   // (the photons on their way arrive at once, so that the electron, the strip and the table agree when this arrangement is come back to)
      moved = true;
    }

    // ---------- handling ----------
    // The electron is carried in and out along the line it is drawn on. It stays where it is until it is let go:
    // only the orbit nearest the hand is marked, and there it goes. (advanced) The lamp is pressed for a photon; the
    // tip of the arrow on the board of the levels is pulled up and down to set the energy of its photons.
    const ray = new T.Raycaster(), face = new T.Plane(new T.Vector3(0, 0, 1), 0);
    function along(r) {   // how far out from the nucleus the pointer is: where the line the electron is drawn on comes nearest the line of sight
      way.copy(C).sub(r.origin);
      const b = RIGHT.dot(r.direction), less = 1 - b * b;
      return less < 1e-6 ? null : (b * r.direction.dot(way) - RIGHT.dot(way)) / less;
    }
    view.setTool({
      pick(r) {
        if (clouded()) return null;   // (nothing is handled there)
        ray.ray.copy(r); rig.updateMatrixWorld(true);
        const found = ray.intersectObjects([...(at ? [handle] : []), ...(shining() ? [lampHandle] : []), ...(shining() && ctx.values.chart && at ? [reachHandle] : [])], false)[0];
        return found ? found.object.userData.grip : null;
      },
      cursor: (grip) => (!grip ? '' : grip.kind === 'lamp' ? 'pointer' : 'grab'),
      start(grip, r) {
        if (grip.kind === 'lamp') { grab = { ...grip }; return true; }   // (pressed: a photon leaves it)
        if (grip.kind === 'reach') {
          face.constant = -(chart.position.z + 0.14 * chart.scale.z);
          if (!r.intersectPlane(face, hit)) return false;
          if (ctx.locked.has(beam().id)) { onChart(RX, reachHandle.position.y + 0.5, way); say('잠금', way.x, way.y, way.z, 1.2); return false; }
          grab = { ...grip, off: reachHandle.position.y - (hit.y - chart.position.y) / chart.scale.y };
          return true;
        }
        const out = along(r);
        if (out === null) return false;
        if (ctx.locked.has('n')) { say('잠금', C.x + wide(seat), C.y + 0.6, C.z, 1.2); return false; }
        grab = { ...grip, off: wide(seat) - out, to: at };
        return true;
      },
      move(r) {
        if (grab.kind === 'lamp') return;
        if (grab.kind === 'reach') {   // (the tip keeps to a level that it comes near; elsewhere it goes by 0.01 eV)
          if (!r.intersectPlane(face, hit)) return;
          const y = (hit.y - chart.position.y) / chart.scale.y + grab.off;
          let energy = (y - high(at)) / rate(), near = 0.04;
          for (let n = at + 1; n <= TOP; n++) if (Math.abs(high(n) - y) < near) { near = Math.abs(high(n) - y); energy = lev(n) - lev(at); }
          const to = Math.max(0.1, Math.min(beam().most, Math.round(energy * 100) / 100));
          if (to !== shot()) ctx.set(beam().id, to);
          onChart(RX - 0.9, high(at) + to * rate(), way); say(`${to.toFixed(2)} eV`, way.x, way.y, way.z); moved = true;
          return;
        }
        const out = along(r);
        if (out === null) return;
        let best = 1;
        for (let n = 2; n <= TOP; n++) if (Math.abs(wide(n) - out - grab.off) < Math.abs(wide(best) - out - grab.off)) best = n;
        grab.to = best; say(`n = ${best}`, C.x + wide(best), C.y - 0.75, C.z); moved = true;
      },
      end() {
        const done = grab;
        grab = null; tip.show(false); tipTime = 0; moved = true;
        if (done && done.kind === 'electron' && done.to !== at) ctx.set('n', String(done.to));
        if (done && done.kind === 'lamp') cast();
      },
    });

    // an arrow from one place to another along a line, drawn small (head and all) where it is short
    function point(arrow, from, to, least) { const long = Math.abs(to - from), size = Math.min(1, long / least); arrow.scale.setScalar(size); arrow.setLength(long / size); }
    function draw() {
      if (clouded()) { drawCloud(); return; }
      const v = ctx.values, lamped = shining(), carried = grab && grab.kind === 'electron' ? grab.to : 0;
      // the atom: the orbit the electron is on, and the one it is being carried to
      for (const shell of shells) shell.main.material = shell.n === seat ? ringInk.now : shell.n === carried ? ringInk.aim : ringInk.main;
      halo.visible = seat > 0; if (seat) halo.scale.setScalar(wide(seat));
      bead.visible = seat > 0 || Boolean(gone && gone.t < 1);
      if (seat) { bead.position.x = wide(seat); handle.position.x = wide(seat); } else if (gone) bead.position.x = wide(gone.from) + 6 * gone.t * gone.t;   // (once it has left the atom it goes off)
      hop.visible = Boolean(last);
      if (last) { const from = wide(last.from), to = last.to ? wide(last.to) : wide(TOP) + 0.45; hop.position.set(from, -0.2, 0.02); hop.aim(to > from ? RIGHT : LEFT); point(hop, from, to, 0.2); }
      if (seat) { spots.electron.set(C.x + wide(seat) + 0.35, C.y - 0.12, C.z + 0.1); labels.electron.write(`전자 <b>n = ${seat}</b>`); } else { spots.electron.set(C.x + 1.3, C.y + 0.9, C.z + 0.1); labels.electron.write(`자유 전자 <b>운동 에너지 ${gone ? gone.ke.toFixed(2) : '0.00'} eV</b>`); }
      labels.electron.show(true); labels.name.write(`${ATOMS[zed()].name} (보어 모형)`); labels.name.show(true);
      labels.line.show(latest !== null);
      if (latest !== null) { onStrip(place(latest), STRIP.h + 0.15, spots.line); labels.line.write(`<b>${wave(latest)} nm</b>`); }
      // the board of the levels
      chart.visible = v.chart;
      if (v.chart) {
        if (tall()) { chart.scale.setScalar(SMALL); chart.position.set(C.x, C.y + 3.15, C.z - 2.6); } else { chart.scale.setScalar(1); chart.position.set(6.3, 0, C.z - 1.0); }
        legs.visible = !tall(); dot.visible = seat > 0; if (seat) dot.position.y = high(seat);
        rise.visible = Boolean(last);
        if (last) { const from = high(last.from), to = last.to ? high(last.to) : from + last.energy * rate(); rise.position.set(AX, from, 0.1); rise.aim(last.out ? DOWN : UP); point(rise, from, to, 0.32); }
      }
      // (advanced) the lamp, and on the board how far up its photons reach from the electron's level
      lamp.visible = lamped; labels.lamp.show(lamped); reach.visible = lamped && v.chart && at > 0;
      if (lamped) {
        const energy = shot(), tint = tintOf(HC / energy);
        glass.material.color.setRGB(tint[0] / 255, tint[1] / 255, tint[2] / 255, T.SRGBColorSpace); reach.material.color.copy(glass.material.color);
        labels.lamp.write(`광자 <b>${energy.toFixed(2)} eV</b>${told ? `<br>${told}` : ''}`);
        if (at) { reach.position.set(RX, high(at), 0.1); point(reach, 0, energy * rate(), 0.28); reachHandle.position.y = high(at) + energy * rate(); }
      }
      labels.list.show(v.numbers);
      if (v.numbers) {
        const lines = [at ? `n = ${at} (${at === 1 ? '바닥상태' : '들뜬상태'}) <b>${minus(lev(at).toFixed(2))} eV</b>` : '전자가 원자를 벗어남(이온화)'];
        if (at) lines.push(`궤도의 반지름 = ${at}² × ${BOHR} nm${zed() > 1 ? ` ÷ ${zed()}` : ''} = <b>${(at * at * BOHR / zed()).toFixed(3)} nm</b>`);
        if (lamped) lines.push(`비춘 빛: 광자의 에너지 <b>${shot().toFixed(2)} eV</b> (${wave(HC / shot())} nm)`, ...(at ? [`n = ${at}의 이온화 에너지 <b>${(-lev(at)).toFixed(2)} eV</b>`] : []));
        if (last && !last.to) lines.push(`n = ${last.from}에서 이온화: 빛을 흡수`, `전자의 운동 에너지 = ${last.energy.toFixed(2)} − ${(-lev(last.from)).toFixed(2)} = <b>${last.ke.toFixed(2)} eV</b>`);
        else if (last && lamped) lines.push(`n = ${last.from} → n = ${last.to}: 빛을 ${last.out ? '방출' : '흡수'} <b>${last.energy.toFixed(2)} eV</b>, <b>${wave(last.nm)} nm</b>`);
        else if (last) {
          const d = digits(last.from, last.to), a = minus(lev(last.from).toFixed(d)), b = minus(lev(last.to).toFixed(d)), [hi, lo] = last.out ? [a, b] : [b, a];
          lines.push(`n = ${last.from} → n = ${last.to}: 빛을 ${last.out ? '방출' : '흡수'}`, '광자의 에너지 = 두 준위의 에너지 차', `= ${hi} − (${lo}) = <b>${last.energy.toFixed(d)} eV</b>`, `파장 = 1240 ÷ ${last.energy.toFixed(d)} = <b>${wave(last.nm)} nm</b>`, `${bandOf(last.nm)}${zed() === 1 && SERIES[Math.min(last.from, last.to)] ? ` · ${SERIES[Math.min(last.from, last.to)]}` : ''}`);
        } else lines.push(`준위의 에너지 = −13.6${zed() > 1 ? ` × ${zed()}²` : ''} ÷ n² (eV)`);
        labels.list.write(lines.join('<br>'));
        if (tall()) spots.list.set(C.x, v.chart ? C.y + 3.15 + SMALL * (FACE.hi + 0.15) : C.y + 3.1, C.z - 2.6); else if (v.chart) spots.list.set(C.x, C.y + 3.1, C.z - 2.6); else spots.list.set(5.2, 1.9, C.z);
      }
    }
    // (with the board of the levels shown there is more to hold on screen)
    const frame = () => {
      if (clouded()) { view.look({ target: [C.x, C.y, C.z], r: [5.5, 9.5, 14.5][shape()[0] - 1], theta: 0, phi: 1.3 }); return; }   // (nearer for the small states)
      const more = ctx.values.chart; view.look(tall() ? { target: [0, more ? 8.4 : 3.9, 0.4], r: more ? 33 : 25, theta: 0, phi: 1.3 } : { target: [more ? 3.3 : 0.6, more ? 3.8 : 2.7, 0.4], r: more ? 21 : 16, theta: 0, phi: 1.3 });
    };

    ctx.on('play', () => { wait = 0.8 + Math.random() * 1.2; moved = true; });
    ctx.on('tick', (t, dt) => { if (!dt) return; if (clouded()) rain(dt); else advance(t, dt); moved = true; });
    ctx.on('action', (id) => {
      if (id === 'reset' && clouded()) { for (const [key, value] of [['orbital', '1s'], ['pace', 'mid']]) if (!ctx.locked.has(key) && ctx.values[key] !== value) ctx.set(key, value); wipe(); }
      else if (id === 'reset') toStart();
      if (id === 'fire' && shining()) cast();
      if ((id === 'more' || id === 'less') && !ctx.locked.has(beam().id)) ctx.set(beam().id, Math.max(0.1, Math.min(beam().most, Math.round((shot() + (id === 'more' ? 0.01 : -0.01)) * 100) / 100)));
    });
    ctx.on('view', () => { moved = true; });
    const was = { ...ctx.values };   // the values as they last were: pressing what is chosen already changes nothing
    ctx.on('change', (id, value) => {
      if (was[id] === value) return;
      was[id] = value;
      moved = true;
      if (id === 'n' && !quiet) {
        if (at) { const from = at; at = Number(value); jump(from, at); } else { at = seat = Number(value); gone = null; last = null; told = ''; say(`전자를 n = ${at}에 놓음`, C.x + wide(at), C.y - 0.75, C.z, 2); }   // (after the electron has left: another is put on an orbit, and nothing is given out)
      }
      if (id === 'shine' || id.startsWith('photon')) told = '';
      if (id === 'z') clear();   // (another atom: its own levels and lines)
      if (id === 'numbers') paintBoard();
      if (id === 'chart') frame();
      if (id === 'scene') { stage(); frame(); ctx.setPlaying(false); ctx.seek(0); }   // (the other arrangement: the clock at nought)
      if (id === 'orbital') { wipe(); frame(); }
    });
    // (the frame tells of the class and inquiry buttons as well: only a change between basic and advanced counts here)
    let wasAdvanced = ctx.advanced;
    ctx.on('mode', () => {
      moved = true;
      if (ctx.advanced === wasAdvanced) return;
      wasAdvanced = ctx.advanced;
      if (!ctx.advanced && ctx.values.z !== '1') ctx.set('z', '1');   // (in the basic mode the atom is hydrogen ...)
      else if (!ctx.advanced && !at) { quiet = true; ctx.set('n', '1'); quiet = false; at = seat = 1; gone = null; last = null; }   // (... and its electron is always in it)
      paintStrip(); paintBoard();
    });

    paintBoard(); paintStrip(); chart.visible = false; lamp.visible = false; stage();
    return {
      cloud: () => ({ count: mist.count, bins: mist.bins, peak: PEAK, places }),
      levels: () => ({ at, seat, last, latest, gone, told, made: [...made], flights: flights.length, radii: [1, 2, 3, 4, 5, 6].map(wide) }),
      update(dt) {
        if (!framed) { framed = true; if (tall()) frame(); }
        if (tipTime > 0) { tipTime -= dt; if (tipTime <= 0) { tip.show(false); moved = true; } }
        if (gone && gone.t < 1) { gone.t = Math.min(1, gone.t + dt); moved = true; }
        for (const flight of [...flights]) {   // (the photons fly whether the clock runs or not)
          flight.t += dt;
          if (flight.t >= flight.time) { land(flight); continue; }
          const s = flight.t / flight.time, eased = s * s * (3 - 2 * s);
          flight.ball.group.position.lerpVectors(flight.from, flight.to, eased); flight.ball.tail.scale.y = Math.max(0.001, Math.min(1.5, flight.far * eased)); moved = true;
        }
        if (!moved) return false;
        moved = false; draw();
        return true;
      },
    };
  },
};
