// P-11 Magnetic materials (3D).
//
// A small piece of a material stands between the poles of a magnet that is slid down over it or lifted away. Beside
// it the inside of the piece is drawn large, after the textbook's figures: 8 x 8 atomic magnets, each a needle with
// a red (N) and a blue (S) half, with the side of the N pole at the left and that of the S pole at the right.
// Three kinds of material are compared.
// - A ferromagnet (iron): the atomic magnets of a domain point the same way, and the domains, uneven patches that
//   are different every time, point so many each way that the piece as a whole is not a magnet. In a field the walls between the domains move, the domains along the
//   field grow, and when the field is taken away about half of the order stays.
// - A paramagnet (aluminium): the atomic magnets turn at random with the heat; in a field they lean a little towards
//   it, and without it they are at random again.
// - A diamagnet (copper): the atoms are no magnets until a field is there; then each is a weak magnet against the field.
// Advanced: the temperature (above the Curie temperature the iron loses its domains and behaves as a paramagnet), and
// the magnet turned round, so that the magnetisation can be drawn against the field (hysteresis).
//
// How far the atomic magnets of the paramagnet lean, and how strong those of the diamagnet are, is drawn about a
// thousand times too large: at their true size nothing would be seen. The ferromagnet is to scale with itself.
// What is set by hand can be set from the menu as well, over the same ranges and in the same steps.
// One unit of the scene is 10 cm.
const two = (value) => (Math.abs(value) < 0.005 ? '0.00' : value.toFixed(2)), whole = (value) => String(Math.round(value) || 0);   // (no "-0")
const B0 = 0.3;        // the field midway between the poles with the magnet right over the block (T)
const NEAR = 0.02;     // a field weaker than this counts as none (T)
const CURIE = 1043;    // the Curie temperature of iron (K)
const KINDS = { ferro: ['강자성체', '철'], para: ['상자성체', '알루미늄'], dia: ['반자성체', '구리'] };
const onIron = (values) => values.kind === 'ferro';

export default {
  // what is taken for granted, written on screen by the frame
  premise: '원자 자석은 크게 그린 모형이며, 실제 물질에는 훨씬 많은 원자가 있습니다',
  fixedViews: ['front'],
  camera: { target: [-0.4, 2.3, 0], r: 11.5, theta: 0.12, phi: 1.32, rMax: 30 },
  stepTime: 0.05,                 // "one step at a time" moves on by this many seconds
  traces: {
    b: { window: 20, range: 0.3, read: (b) => `${two(b)} T` },   // the field at the block against time
    m: { window: 20, range: 50, read: (m) => `${whole(m)} %` },   // how far the block is magnetised (+: along +x), against time
    loop: { window: 1000, range: 50, read: (m) => `${whole(m)} %` },   // and against the field (T), not against time
  },
  menus: {
    vars: [
      { id: 'kind', label: '물질의 종류', kind: 'choice', value: 'ferro', options: Object.keys(KINDS).map((id) => ({ id, label: `${KINDS[id][0]} (${KINDS[id][1]})` })) },
      { id: 'lift', label: '자석을 들어 올린 높이', kind: 'slider', min: 0, max: 15, step: 0.5, value: 15, digits: 1, unit: ' cm' },
      { id: 'temp', label: '온도', kind: 'slider', min: 20, max: 1000, step: 10, value: 20, unit: ' ℃', advanced: true },
      { id: 'flipped', label: '자석 뒤집기', kind: 'toggle', advanced: true },
    ],
    graph: [
      { id: 'fieldTime', label: '자기장·자기화–시간', kind: 'graph', x: '시간', plots: [{ y: '외부 자기장', trace: 'b' }, { y: '자기화된 정도', trace: 'm' }] },
      { id: 'loopGraph', label: '자기화–외부 자기장', kind: 'graph', x: '외부 자기장', xUnit: 'T', span: [-B0, B0], plots: [{ y: '자기화된 정도', trace: 'loop' }], advanced: true },
    ],
    time: [
      { id: 'slow', label: '느리게', kind: 'toggle' },
      { id: 'reset', label: '처음으로', kind: 'action' },
      { id: 'step', label: '한 단계씩', kind: 'action', advanced: true },
    ],
    layers: [
      { id: 'cells', label: '자구', kind: 'toggle', value: true, when: onIron },
      { id: 'field', label: '외부 자기장', kind: 'toggle', value: true },
      { id: 'sum', label: '물질 전체의 자성', kind: 'toggle', value: true },
      { id: 'numbers', label: '값', kind: 'toggle' },
    ],
    inquiry: [
      { id: 'table', label: '기록 표', kind: 'table', wide: true, rows: 8, text: '자석을 옮기거나 값을 바꾸고 잠시 두면 한 줄씩 적힙니다(상자성체는 5초쯤). 자기화된 정도는 원자 자석이 모두 한 방향일 때를 100 %로 한 값이고, 오른쪽 방향을 +로 적습니다.',
        columns: [{ label: '물질' }, { label: '온도', unit: '℃', advanced: true }, { label: '외부 자기장', unit: 'T' }, { label: '상태' }, { label: '자기화된<br>정도', unit: '%', result: true }] },
    ],
  },

  // writing on the chalkboard (1024 x 400)
  board(g) {
    g.fillStyle = 'rgba(255,255,255,0.9)'; g.font = '56px Georgia, serif'; g.fillText('자성체', 60, 96);
    // atomic magnets between an N pole and an S pole
    g.strokeStyle = 'rgba(255,255,255,0.85)'; g.lineWidth = 5; g.lineCap = 'round';
    g.strokeRect(250, 170, 28, 180); g.strokeRect(570, 170, 28, 180);
    g.font = '34px Georgia, serif'; g.fillText('N', 205, 272); g.fillText('S', 615, 272);
    g.lineWidth = 4;
    for (let j = 0; j < 3; j++) for (let i = 0; i < 4; i++) {
      const x = 320 + i * 62, y = 200 + j * 60;
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + 36, y); g.moveTo(x + 26, y - 8); g.lineTo(x + 36, y); g.lineTo(x + 26, y + 8); g.stroke();
    }
  },

  // Builds the apparatus on the bench (world) and returns { update(dt) }.
  create({ T, kit, world, view, ctx }) {
    const { mat, add, box, cyl, canvasTexture } = kit;
    const M = { dark: mat(0x3a4057), steel: mat(0x8f96a8) };
    world.userData.things.visible = false;   // the stand left on the bench would be taken for part of this

    // ---------- the piece, the magnet and its stand ----------
    // The piece, a cube of 3 cm, stands on a post with its middle at the height SY. The magnet is a U turned over: its
    // N pole at the left of the piece and its S pole at the right when it is right down (the field then runs from
    // left to right, along +x), a bar across the top. It rides up and down a rod, TRAVEL at most.
    const SY = 0.7, POLE = { x: 0.35, thick: 0.1, tall: 0.4, deep: 0.4, apart: 0.6 }, TRAVEL = 1.5;
    const bench = new T.Group(); world.add(bench);   // the real things; where they stand depends on the screen (see place())
    add(bench, box(0.5, 0.06, 0.5), M.dark, 0, 0.03, 0); add(bench, cyl(0.03, 0.03, SY - 0.21, 10), M.steel, 0, (SY - 0.09) / 2, 0);
    const piecePaint = new T.MeshStandardMaterial({ color: 0x6e737d, roughness: 0.55, metalness: 0.3, emissive: 0x000000 }), SHADE = { ferro: 0x6e737d, para: 0xcfd3d8, dia: 0xc5814f };
    add(bench, box(0.3, 0.3, 0.3), piecePaint, 0, SY, 0);
    add(bench, cyl(0.03, 0.03, 2.9, 10), M.steel, 0.8, 1.45, 0); add(bench, box(0.5, 0.06, 0.5), M.dark, 0.8, 0.03, 0);
    const carrier = new T.Group(); bench.add(carrier);   // what rides on the rod: at the height of the middle of the poles
    add(carrier, box(0.42, 0.06, 0.08), M.dark, 0.6, 0.51, 0);
    const magnet = new T.Group(); carrier.add(magnet);   // the magnet itself, which is turned round about the upright
    const letter = (text) => new T.MeshBasicMaterial({ transparent: true, map: canvasTexture(64, 64, (g) => { g.fillStyle = '#ffffff'; g.font = '700 50px Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, 32, 35); }) });
    for (const [side, colour, text] of [[-1, 0xc8392f, 'N'], [1, 0x2a5fd0, 'S']]) {
      add(magnet, box(POLE.thick, POLE.tall, POLE.deep), mat(colour, { roughness: 0.6 }), side * POLE.x, 0, 0);
      add(magnet, box(POLE.thick, 0.25, POLE.deep), M.steel, side * POLE.x, POLE.tall / 2 + 0.125, 0);
      for (const face of [1, -1]) add(magnet, new T.PlaneGeometry(0.14, 0.14), letter(text), side * (POLE.x + 0.002), 0, face * (POLE.deep / 2 + 0.004), false, false).rotation.y = face > 0 ? 0 : Math.PI;
    }
    add(magnet, box(2 * POLE.x + POLE.thick, 0.12, POLE.deep), M.steel, 0, POLE.tall / 2 + 0.25 + 0.06, 0);
    const handle = add(carrier, box(1.5, 1.5, 1.0), M.dark, 0, 0.15, 0, false, false); handle.visible = false; handle.userData.grip = { kind: 'magnet' };
    const pieceSpot = new T.Vector3(), pieceLabel = view.label(pieceSpot, false, -0.04);

    // ---------- the inside of the piece, drawn large ----------
    // A square pane with the 8 x 8 atoms SPACE apart in the plane that faces the viewer; a bar at each side shows
    // which pole lies that way, the more clearly the stronger the field; two thin lines lead to it from the piece.
    const SIDE = 8, ATOMS = SIDE * SIDE, SPACE = 0.42, PANE = 3.7, HALF = 0.19;   // (HALF: half the length of an atomic magnet)
    const rig = new T.Group(); world.add(rig);
    const glass = new T.MeshStandardMaterial({ color: 0xbfc5cf, roughness: 0.5, transparent: true, opacity: 0.32, depthWrite: false, emissive: 0x000000 });
    add(rig, box(PANE, PANE, 0.5), glass, 0, 0, 0, false, false); add(rig, box(PANE, PANE, 0.03), mat(0xe6e8ec, { roughness: 0.9 }), 0, 0, -0.25, false, false);   // (a back, so that the room does not show through)
    for (const [w, h, x, y] of [[PANE + 0.1, 0.05, 0, PANE / 2], [PANE + 0.1, 0.05, 0, -PANE / 2], [0.05, PANE, PANE / 2, 0], [0.05, PANE, -PANE / 2, 0]]) add(rig, box(w, h, 0.54), M.dark, x, y, 0, false, false);
    const sides = [-1, 1].map((side) => {
      const paint = new T.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6, transparent: true, opacity: 0, depthWrite: false });
      add(rig, box(0.16, PANE, 0.5), paint, side * (PANE / 2 + 0.16), 0, 0, false, false);
      const marks = ['N', 'S'].map((text) => add(rig, new T.PlaneGeometry(0.3, 0.3), letter(text), side * (PANE / 2 + 0.16), PANE / 2 + 0.25, 0.26, false, false));
      return { paint, marks };
    });
    const leaders = [0, 1].map(() => add(world, cyl(0.012, 0.012, 1, 6), new T.MeshBasicMaterial({ color: 0x3a4057, transparent: true, opacity: 0.55 }), 0, 0, 0, false, false));
    // where things stand: side by side on a wide screen, the pane above the magnet on an upright one
    const tall = () => window.matchMedia('(max-aspect-ratio: 4/5)').matches;
    const place = () => (tall() ? { bench: [1.3, 0.8], pane: [0.3, 5.3], ends: [[-1, -1], [1, -1]] } : { bench: [-3.8, 0.3], pane: [1.9, 2.6], ends: [[-1, 1], [-1, -1]] });   // (ends: the corners of the pane the lines lead to)

    // The field midway between the two pole faces, each a sheet of pole strength, with the magnet lifted by s: summed
    // over patches of the faces (the parts across the axis cancel), and kept as a share of the field at s = 0.
    function reach(s) {
      const n = 16; let sum = 0;
      for (let a = 0; a < n; a++) for (let b = 0; b < n; b++) { const y = s + POLE.tall * ((a + 0.5) / n - 0.5), z = POLE.deep * ((b + 0.5) / n - 0.5); sum += (POLE.apart / 2) / Math.pow(POLE.apart * POLE.apart / 4 + y * y + z * z, 1.5); }
      return sum;
    }
    const FALL = Array.from({ length: 101 }, (unused, k) => reach(k * TRAVEL / 100));
    function share(lift) {   // lift in cm
      const at = lift / 10 / (TRAVEL / 100), k = Math.min(99, Math.floor(at));
      return (FALL[k] + (FALL[k + 1] - FALL[k]) * (at - k)) / FALL[0];
    }

    // ---------- the atomic magnets and the marks ----------
    const spots = Array.from({ length: ATOMS }, (unused, k) => [(k % SIDE - (SIDE - 1) / 2) * SPACE, (Math.floor(k / SIDE) - (SIDE - 1) / 2) * SPACE]);
    const many = (geometry, material) => { const mesh = new T.InstancedMesh(geometry, material, ATOMS); mesh.frustumCulled = false; rig.add(mesh); return mesh; };
    const balls = many(new T.SphereGeometry(0.055, 12, 8), mat(0x8a8f99, { roughness: 0.5 }));
    const norths = many(new T.ConeGeometry(0.075, HALF, 12).rotateZ(-Math.PI / 2).translate(HALF / 2, 0, 0), new T.MeshBasicMaterial({ color: 0xd8402f }));
    const souths = many(cyl(0.038, 0.038, HALF, 10).rotateZ(Math.PI / 2).translate(-HALF / 2, 0, 0), new T.MeshBasicMaterial({ color: 0x2a5fd0 }));
    // the domains of the ferromagnet: a tile behind each atom, coloured by the way its domain points
    const tiles = many(new T.PlaneGeometry(SPACE, SPACE), new T.MeshBasicMaterial({ transparent: true, opacity: 0.7, depthWrite: false }));
    const TINT = [0xf2b872, 0x8fd0a8, 0x8fb4e8, 0xd9a0d6].map((hex) => new T.Color(hex));   // +x, +y, -x, -y
    for (let k = 0; k < ATOMS; k++) { tiles.setMatrixAt(k, new T.Matrix4().makeTranslation(spots[k][0], spots[k][1], -0.2)); balls.setMatrixAt(k, new T.Matrix4().makeTranslation(spots[k][0], spots[k][1], 0)); tiles.setColorAt(k, TINT[0]); }
    // the field at the block: arrows behind the atoms, as long as it is strong
    const FIELD = 1.0;   // the length of an arrow for the field B0
    const fields = [-1.26, 0, 1.26].flatMap((y) => [-1.2, 0, 1.2].map((x) => { const arrow = kit.arrow(0x5fb98a, 0.035, false); arrow.userData.least = 0.035 * 7; arrow.visible = false; rig.add(arrow); return { arrow, x, y }; }));
    // how far the piece as a whole is a magnet: an arrow under the pane, 2 long with every atomic magnet along the field
    const WHOLE = 2, sumArrow = kit.arrow(0xe3c26b, 0.07); sumArrow.userData.least = 0.07 * 7; sumArrow.visible = false; rig.add(sumArrow);
    const sumSpot = new T.Vector3(), sumLabel = view.label(sumSpot, false, -0.04);
    const stateSpot = new T.Vector3(), stateLabel = view.label(stateSpot, true), valueSpot = new T.Vector3(), valueLabel = view.label(valueSpot, true);   // (the values: under the state on a wide screen, beside the magnet on an upright one)
    const tipSpot = new T.Vector3(), tip = view.label(tipSpot);   // what is being set, while the magnet is handled

    // ---------- physics ----------
    // The ferromagnet. Each atomic magnet belongs to a domain that points along +x, +y, -x or -y (the easy ways of
    // the crystal): s. An atom changes over to another way only if that lowers the energy by more than what pins it
    // there (pin): the energy of its bonds (-J for a neighbour the same way, +J for one the opposite way, 0 across),
    // of the field h (-h along it), and of the block being a magnet as a whole (D / 2 for each atom times the square
    // of the mean, which is what brings some of the domains back when the field goes). So the walls move, a few
    // atoms at a time; nothing moves by heat alone below the Curie temperature.
    // With the temperature T the order inside a domain is ms, from ms = tanh(ms Tc / T) (the mean field of the
    // neighbours); the field counts for 1 / ms as much, and above Tc there are no domains left.
    const DIR = [[1, 0], [0, 1], [-1, 0], [0, -1]], LAW = { J: 1, D: 3.6, pin: [2, 3.2], h: 11, rate: 30 };   // (h: the field B0 on this scale of energy; rate: tries for each atom in a second)
    const grid = { s: new Int8Array(ATOMS), pin: Float32Array.from({ length: ATOMS }, () => LAW.pin[0] + (LAW.pin[1] - LAW.pin[0]) * Math.random()), sum: [0, 0], owed: 0, lost: false };
    const tally = () => { grid.sum[0] = grid.sum[1] = 0; for (let k = 0; k < ATOMS; k++) { grid.sum[0] += DIR[grid.s[k]][0]; grid.sum[1] += DIR[grid.s[k]][1]; } };
    function closure() {   // four domains that close on one another: the upper +x, the right -y, the lower -x, the left +y
      for (let k = 0; k < ATOMS; k++) { const x = k % SIDE - (SIDE - 1) / 2, y = Math.floor(k / SIDE) - (SIDE - 1) / 2; grid.s[k] = Math.abs(y) > Math.abs(x) ? (y > 0 ? 0 : 2) : (x > 0 ? 3 : 1); }
      tally();
    }
    const beside = (k) => { const i = k % SIDE, j = (k - i) / SIDE, list = []; for (const [di, dj] of DIR) { const a = i + di, b = j + dj; if (a >= 0 && b >= 0 && a < SIDE && b < SIDE) list.push(b * SIDE + a); } return list; };
    // Uneven domains: patches grown from five or six seeds that do not touch, the way with the fewest atoms growing
    // next by the free atom that touches one of its patches most (with some chance in it), so that each of the four
    // ways ends with the same number of atoms and the piece as a whole is no magnet. false: a way could not grow.
    function patches(seeds) {
      const owner = new Int8Array(ATOMS).fill(-1), ways = [0, 1, 2, 3, ...[0, 1, 2, 3].sort(() => Math.random() - 0.5)].slice(0, seeds), count = [0, 0, 0, 0];
      ways.forEach((way, patch) => { let k; do k = Math.floor(Math.random() * ATOMS); while (owner[k] >= 0 || beside(k).some((other) => owner[other] >= 0)); owner[k] = patch; count[way]++; });
      for (let left = ATOMS - seeds; left > 0; left--) {
        let grown = false;
        for (const way of [0, 1, 2, 3].sort((a, b) => count[a] - count[b] || Math.random() - 0.5)) {
          let best = null;
          for (let k = 0; k < ATOMS; k++) if (owner[k] < 0) {
            const touch = new Array(seeds).fill(0);
            for (const other of beside(k)) if (owner[other] >= 0 && ways[owner[other]] === way) touch[owner[other]]++;
            const patch = touch.indexOf(Math.max(...touch)), weight = touch[patch] + Math.random() * 0.9;
            if (touch[patch] > 0 && (!best || weight > best[2])) best = [k, patch, weight];
          }
          if (!best) continue;
          owner[best[0]] = best[1]; count[way]++; grown = true; break;
        }
        if (!grown) return false;
      }
      for (let k = 0; k < ATOMS; k++) grid.s[k] = ways[owner[k]];
      tally(); return true;
    }
    // the domains of a piece that has not been in a field: uneven ones that stay as they are with no field (else, after many tries, the four that close on one another)
    function domains() {
      for (let n = 0; n < 400; n++) { grid.owed = 0; if (patches(5 + n % 2) && walls(2, 0) === 0 && grid.sum[0] === 0 && grid.sum[1] === 0) return; }
      closure();
    }
    function scramble() { for (let k = 0; k < ATOMS; k++) grid.s[k] = Math.floor(Math.random() * 4); tally(); }
    function bonds(k, way) {
      const i = k % SIDE, j = (k - i) / SIDE; let energy = 0;
      for (const [di, dj] of DIR) { const a = i + di, b = j + dj; if (a < 0 || b < 0 || a >= SIDE || b >= SIDE) continue; const other = DIR[grid.s[b * SIDE + a]]; energy -= LAW.J * (DIR[way][0] * other[0] + DIR[way][1] * other[1]); }
      return energy;
    }
    function walls(seconds, h) {   // so many seconds of tries with the field h; returns how many atoms changed over
      let changed = 0;
      for (grid.owed += seconds * LAW.rate * ATOMS; grid.owed >= 1; grid.owed -= 1) {
        const k = Math.floor(Math.random() * ATOMS), was = grid.s[k], to = (was + 1 + Math.floor(Math.random() * 3)) % 4, dx = DIR[to][0] - DIR[was][0], dy = DIR[to][1] - DIR[was][1];
        const gain = bonds(k, to) - bonds(k, was) - h * dx + LAW.D / ATOMS * (grid.sum[0] * dx + grid.sum[1] * dy + (dx * dx + dy * dy) / 2);
        if (gain + grid.pin[k] < 0) { grid.s[k] = to; grid.sum[0] += dx; grid.sum[1] += dy; changed++; }
      }
      return changed;
    }
    function order(kelvin) { if (kelvin >= CURIE) return 0; let ms = 1; for (let k = 0; k < 200; k++) ms = Math.tanh(ms * CURIE / kelvin); return ms; }
    const langevin = (a) => (a < 1e-4 ? a / 3 : 1 / Math.tanh(a) - 1 / a);   // the mean lean of magnets held with the strength a (energy / kT)
    function hold(mean) {   // the strength that gives that mean lean
      if (mean > 0.995) return 1 / (1 - mean);
      let low = 0, high = 200; for (let k = 0; k < 40; k++) { const mid = (low + high) / 2; if (langevin(mid) < mean) low = mid; else high = mid; }
      return low;
    }
    // The way each atomic magnet points: v. With the heat it tries small turns at random, and a turn away from what
    // holds it (its domain, or the field) by the energy e is taken with the chance exp(-e / kT): so the ways settle
    // into the spread exp(a cos θ), whose mean lean is the Langevin function of a.
    // The block as a whole stands for far more atoms than the 64 that are drawn, so what is shown and recorded of it
    // is the mean those would have (the Langevin function, or the order of the domains times ms), which it nears as
    // fast as the magnets turn; the 64 drawn flicker about it.
    // LEAN: a for the paramagnet in the field B0 at 20 ℃; WEAK: the strength of the magnets of the diamagnet in B0,
    // against that of an atomic magnet of the others. Both far larger than in a real metal (see the head of the file).
    // What is drawn (seen) follows v smoothly, within a sixth of a second, so that the needles turn and do not jump.
    const LEAN = 2.2, WEAK = 0.4, ROOM = 293, SLOW = 0.5;   // (SLOW: how fast the magnets of the paramagnet turn at random at 20 ℃, rad² / s: slow enough for the lean to be seen)
    const v = Array.from({ length: ATOMS }, () => [1, 0, 0]), seen = Array.from({ length: ATOMS }, () => [1, 0, 0]);
    const run = { B: 0, shown: 0, met: false, calm: 0, wait: 2, fresh: false, sumM: 0, sumT: 0, last: [0, 0] };
    const temp = () => (ctx.advanced ? ctx.values.temp : 20) + 273, turned = () => ctx.advanced && ctx.values.flipped;
    const fieldNow = () => (turned() ? -1 : 1) * B0 * share(ctx.values.lift);
    const gauss = () => Math.sqrt(-2 * Math.log(1 - Math.random())) * Math.cos(2 * Math.PI * Math.random());
    function atRandom() { for (const one of v) { const z = 2 * Math.random() - 1, turn = 2 * Math.PI * Math.random(), r = Math.sqrt(1 - z * z); one[0] = r * Math.cos(turn); one[1] = r * Math.sin(turn); one[2] = z; } }
    function mean() { let sum = 0; for (const one of v) sum += one[0]; return sum / ATOMS; }
    let moved = true, tipTime = 0, framed = false, grab = null, byScene = false, spin = 0, keptCells = true;
    function say(text, seconds = 0) { const [x, z] = place().bench; tip.write(text); tipSpot.set(x, SY + ctx.values.lift / 10 + 1.0, z); tip.show(true); tipTime = seconds; moved = true; }   // above the magnet
    // the block as it is before any field: its magnets, the graphs, what the table waits for
    function toStart() {
      domains(); grid.lost = false; grid.owed = 0;
      if (ctx.values.kind === 'ferro' && temp() < CURIE) v.forEach((one, k) => { one[0] = DIR[grid.s[k]][0]; one[1] = DIR[grid.s[k]][1]; one[2] = 0; }); else atRandom();
      v.forEach((one, k) => { seen[k][0] = one[0]; seen[k][1] = one[1]; seen[k][2] = one[2]; });
      run.B = fieldNow(); run.shown = ctx.values.kind === 'dia' ? -100 * WEAK * run.B / B0 : 0; run.met = Math.abs(run.B) >= NEAR; run.calm = 0; run.fresh = true; run.sumM = run.sumT = 0; run.last = [run.B, run.shown];
      for (const id of ['b', 'm', 'loop']) ctx.traces[id].clear();
      if (!run.met) note();   // how it stands before any field: a line of the table at once
      moved = true;
    }
    const phase = () => (Math.abs(run.B) >= NEAR ? '가했을 때' : run.met ? '제거했을 때' : '가하기 전');
    function advance(t, dt) {
      const kind = ctx.values.kind, kelvin = temp(), B = fieldNow(), part = B / B0;
      run.B = B; if (Math.abs(B) >= NEAR) run.met = true;
      if (kind === 'dia') { run.shown = -100 * WEAK * part; run.wait = 2; } else {
        // what holds each magnet: its domain (iron below the Curie temperature), else the field, the more weakly the
        // hotter (iron above its Curie temperature is taken to lean as the paramagnet does at that temperature)
        const ms = kind === 'ferro' ? order(kelvin) : 0, held = ms > 0.05;
        if (kind === 'ferro') {
          if (!held) grid.lost = true;
          else { if (grid.lost) { scramble(); grid.lost = false; } walls(dt, LAW.h * part / ms); }
        }
        const firm = held ? hold(ms) : LEAN * Math.abs(part) * ROOM / kelvin, way = part < 0 ? -1 : 1;
        const quick = held ? 4 : SLOW * Math.sqrt(kelvin / ROOM), spread = Math.sqrt(2 * quick * dt), follow = 1 - Math.exp(-6 * dt);   // (quick: how fast the magnets turn at random, rad² / s)
        run.wait = held ? 2 : 2 + 1.5 / quick;   // (how long the table waits: the lean of the paramagnet takes a few seconds to settle)
        for (let k = 0; k < ATOMS; k++) {
          const one = v[k], to = held ? DIR[grid.s[k]] : [way, 0], g = [gauss(), gauss(), gauss()], along = g[0] * one[0] + g[1] * one[1] + g[2] * one[2];
          const w = [spread * (g[0] - along * one[0]), spread * (g[1] - along * one[1]), spread * (g[2] - along * one[2])], angle = Math.hypot(w[0], w[1], w[2]) || 1e-9, c = Math.cos(angle), s = Math.sin(angle) / angle;
          const next = [one[0] * c + w[0] * s, one[1] * c + w[1] * s, one[2] * c + w[2] * s], gain = firm * ((next[0] - one[0]) * to[0] + (next[1] - one[1]) * to[1]);
          if (gain >= 0 || Math.random() < Math.exp(gain)) { one[0] = next[0]; one[1] = next[1]; one[2] = next[2]; }
          for (let axis = 0; axis < 3; axis++) seen[k][axis] += (one[axis] - seen[k][axis]) * follow;
        }
        const aim = held ? ms * grid.sum[0] / ATOMS : way * langevin(firm);
        run.shown += (100 * aim - run.shown) * (1 - Math.exp(-dt * (held ? 10 : 2 * quick)));
      }
      ctx.traces.b.add(t, B); ctx.traces.m.add(t, run.shown);
      if (Math.abs(B - run.last[0]) >= 0.004 || Math.abs(run.shown - run.last[1]) >= 1.5) {
        const loop = ctx.traces.loop;
        loop.add(B, run.shown); run.last = [B, run.shown];
        if (loop.t.length > 2500) { loop.t.shift(); loop.v.shift(); loop.gap.shift(); }
      }
      // a line of the table once things have stood for a while (run.wait): the mean over the last half second of it
      run.calm += dt;
      if (run.fresh && run.calm >= run.wait - 0.5) { run.sumM += run.shown * dt; run.sumT += dt; }
      if (run.fresh && run.calm >= run.wait && !grab) note();
    }
    function note() {
      run.fresh = false;
      const row = [KINDS[ctx.values.kind][0], whole(temp() - 273), two(run.B), phase(), whole(run.sumT ? run.sumM / run.sumT : run.shown)], rows = ctx.tables.table.rows, above = rows[rows.length - 1];
      if (!above || above.some((cell, i) => cell !== row[i])) ctx.tables.table.add(row);
    }
    // something was set anew: the table waits for things to settle again, and the clock runs
    function stir() { run.calm = 0; run.fresh = true; run.sumM = run.sumT = 0; moved = true; ctx.setPlaying(true); }

    // ---------- handling ----------
    // The magnet is carried up and down; in the advanced mode a press on it turns it round, which is allowed only
    // with the magnet away from the block.
    const ray = new T.Raycaster(), wall = new T.Plane(), hit = new T.Vector3();
    const height = (r, plane) => { wall.set(plane.normal, plane.constant); return r.intersectPlane(wall, hit) ? hit.y : null; };
    function flip() {
      if (Math.abs(run.B) >= NEAR) { say('자석을 멀리 치운 뒤에 뒤집을 수 있습니다', 2); return false; }
      return true;
    }
    const tool = {
      start(grip, r) {
        const [x, z] = place().bench, across = Math.abs(r.direction.z) >= Math.abs(r.direction.x), plane = { normal: new T.Vector3(across ? 0 : 1, 0, across ? 1 : 0), constant: across ? -z : -x }, y = height(r, plane);   // an upright plane through the magnet, as square to the view as may be
        if (y === null) return false;
        if (ctx.locked.has('lift')) { say('잠금', 1.2); return false; }
        grab = { ...grip, plane, from: y, lift: ctx.values.lift, moved: false };
        return true;
      },
      move(r) {
        const y = height(r, grab.plane);
        if (y === null) return;
        if (Math.abs(y - grab.from) > 0.12) grab.moved = true;
        if (!grab.moved) return;
        const to = Math.max(0, Math.min(15, Math.round((grab.lift + (y - grab.from) * 10) * 2) / 2));
        if (to !== ctx.values.lift) ctx.set('lift', to);
        say(`외부 자기장 ${two(Math.abs(fieldNow()))} T`);
      },
      end(done) { if (!done.moved && ctx.advanced && flip()) ctx.set('flipped', !ctx.values.flipped); },
    };

    const turn = new T.Matrix4(), ex = new T.Vector3(), ey = new T.Vector3(), ez = new T.Vector3(), way = new T.Vector3(), UP = new T.Vector3(0, 1, 0), from = new T.Vector3(), end = new T.Vector3();
    function draw() {
      const values = ctx.values, kind = values.kind, kelvin = temp(), part = run.B / B0, narrow = tall(), set = place(), strong = Math.min(1, Math.abs(part));
      bench.position.set(set.bench[0], 0, set.bench[1]); rig.position.set(set.pane[0], set.pane[1], 0);
      carrier.position.y = SY + values.lift / 10;
      magnet.rotation.y = spin;
      piecePaint.color.setHex(SHADE[kind]);
      // the lines from the piece to the pane, and the sides of the pane: red towards the N pole, blue towards the S pole
      from.set(set.bench[0], SY, set.bench[1]);
      leaders.forEach((line, k) => {
        end.set(set.pane[0] + set.ends[k][0] * PANE / 2, set.pane[1] + set.ends[k][1] * PANE / 2, 0);
        line.position.copy(from).add(end).multiplyScalar(0.5); line.scale.y = from.distanceTo(end); line.quaternion.setFromUnitVectors(UP, end.sub(from).normalize());
      });
      sides.forEach(({ paint, marks }, k) => {
        const north = (k === 0) === (part >= 0);
        paint.color.setHex(north ? 0xc8392f : 0x2a5fd0); paint.opacity = 0.85 * strong;
        marks[0].visible = north && strong > 0.05; marks[1].visible = !north && strong > 0.05; marks[north ? 0 : 1].material.opacity = Math.min(1, strong * 2);
      });
      // the needles: along v; those of the diamagnet against the field, as long as it is strong, and none without it
      const stub = kind === 'dia' ? WEAK * Math.abs(part) : 1, shown = stub > 0.02;
      for (let k = 0; k < ATOMS && shown; k++) {
        if (kind === 'dia') ex.set(part > 0 ? -1 : 1, 0, 0); else ex.set(seen[k][0], seen[k][1], seen[k][2]).normalize();
        ey.set(0, 0, 1); if (Math.abs(ex.z) > 0.9) ey.set(0, 1, 0);
        ey.crossVectors(ey, ex).normalize(); ez.crossVectors(ex, ey);
        turn.makeBasis(ex.multiplyScalar(stub), ey, ez).setPosition(spots[k][0], spots[k][1], 0);
        norths.setMatrixAt(k, turn); souths.setMatrixAt(k, turn);
      }
      for (const mesh of [norths, souths]) { mesh.count = shown ? ATOMS : 0; mesh.instanceMatrix.needsUpdate = true; }
      // the tiles of the domains: iron below its Curie temperature only
      tiles.visible = values.cells && kind === 'ferro' && !grid.lost && kelvin < CURIE;
      if (tiles.visible) { for (let k = 0; k < ATOMS; k++) tiles.setColorAt(k, TINT[grid.s[k]]); tiles.instanceColor.needsUpdate = true; }
      const hot = Math.max(0, (kelvin - 773) / 500); glass.emissive.setRGB(0.5 * hot, 0.12 * hot, 0); piecePaint.emissive.setRGB(0.9 * hot, 0.2 * hot, 0);   // the piece glows from about 500 ℃ on
      for (const one of fields) {
        one.arrow.visible = values.field && Math.abs(part) > 0.01;
        if (!one.arrow.visible) continue;
        const long = FIELD * Math.abs(part), least = one.arrow.userData.least, dir = part > 0 ? 1 : -1;
        one.arrow.setLength(Math.max(long, least)); one.arrow.scale.y = Math.min(1, long / least);
        one.arrow.position.set(one.x - dir * long / 2, one.y, -0.12); one.arrow.aim(way.set(dir, 0, 0));
      }
      const size = Math.abs(run.shown) / 100;
      sumArrow.visible = values.sum && size > 0.02;
      if (sumArrow.visible) {
        const long = WHOLE * size, least = sumArrow.userData.least, dir = run.shown > 0 ? 1 : -1;
        sumArrow.setLength(Math.max(long, least)); sumArrow.scale.y = Math.min(1, long / least);
        sumArrow.position.set(-dir * long / 2, -PANE / 2 - 0.4, 0); sumArrow.aim(way.set(dir, 0, 0));
      }
      sumSpot.set(set.pane[0], set.pane[1] - PANE / 2 - 0.55, 0); sumLabel.write('물질 전체의 자성'); sumLabel.show(values.sum);
      pieceSpot.set(set.bench[0], 0, set.bench[1] + 0.45); pieceLabel.write(`${KINDS[kind][1]} 조각과 자석`); pieceLabel.show(true);
      const lines = [`<b>${KINDS[kind][0]}</b>(${KINDS[kind][1]})를 확대해서 본 모형`, `외부 자기장을 <b>${phase()}</b>`], more = [];
      if (values.numbers) {
        const side = (value, least) => (Math.abs(value) >= least ? ` (${value > 0 ? '오른쪽' : '왼쪽'}으로)` : '');
        more.push(`외부 자기장 <b>${two(Math.abs(run.B))} T</b>${side(run.B, 0.005)}`, `자기화된 정도 <b>${whole(Math.abs(run.shown))} %</b>${side(run.shown, 0.5)}`);
        if (ctx.advanced) more.push(`온도 ${whole(kelvin - 273)} ℃`, ...(kind === 'ferro' ? [`철의 퀴리 온도 ${CURIE - 273} ℃`] : []));
      }
      stateSpot.set(set.pane[0], set.pane[1] + PANE / 2 + 0.55, 0);   // above the pane
      stateLabel.write((narrow ? lines : lines.concat(more)).join('<br>')); stateLabel.show(true);
      valueSpot.set(-0.85, 0.9, 0.8); valueLabel.write(more.join('<br>')); valueLabel.show(narrow && more.length > 0);
    }

    const frame = () => view.look(tall() ? { target: [0.3, 3.9, 0], r: 13, theta: 0.1, phi: 1.38 } : { target: [-0.4, 2.3, 0], r: 11.5, theta: 0.12, phi: 1.32 });
    view.setTool({
      pick(r) {
        ray.ray.copy(r); bench.updateMatrixWorld(true);
        const found = ray.intersectObjects([handle], false)[0];
        return found ? found.object.userData.grip : null;
      },
      cursor: (grip) => (grip ? 'grab' : ''),
      start: (grip, r) => tool.start(grip, r),
      move(r) { tool.move(r); },
      end() {
        const done = grab;
        grab = null; tip.show(false); tipTime = 0; moved = true;
        if (done) tool.end(done);
      },
    });
    ctx.on('tick', (t, dt) => { if (dt) { advance(t, dt); moved = true; } });
    ctx.on('action', (id) => {
      if (id !== 'reset') return;
      byScene = true;
      for (const [key, value] of [['lift', 15], ['temp', 20], ['flipped', false]]) if (!ctx.locked.has(key) && ctx.values[key] !== value) ctx.set(key, value);
      byScene = false;
      toStart();
    });
    ctx.on('change', (id, value) => {
      moved = true;
      if (id === 'cells' && ctx.values.kind === 'ferro') keptCells = value;
      if (byScene) return;
      if (id === 'kind') {   // another block: as it is before any field, wherever the magnet stands
        if (value === 'ferro' && ctx.values.cells !== keptCells) ctx.set('cells', keptCells);   // (the frame puts the switch off with the other kinds)
        toStart(); stir();
      }
      if (id === 'flipped' && ctx.advanced && !flip()) { byScene = true; ctx.set('flipped', !value); byScene = false; return; }
      if (id === 'lift' || id === 'temp' || id === 'flipped') stir();
    });
    ctx.on('mode', () => { run.calm = 0; run.fresh = true; run.sumM = run.sumT = 0; moved = true; });   // the temperature and the turned magnet count in the advanced mode only

    toStart();
    return {
      state: () => ({ B: run.B, shown: run.shown, mean: ctx.values.kind === 'dia' ? -WEAK * run.B / B0 : mean(), phase: phase(), grid: Array.from(grid.s), domains: [grid.sum[0] / ATOMS, grid.sum[1] / ATOMS], lost: grid.lost, order: order(temp()), share: share(ctx.values.lift) }),
      update(dt) {
        if (!framed) { framed = true; if (tall()) frame(); }
        const aim = turned() ? Math.PI : 0;
        if (Math.abs(aim - spin) > 0.001) { spin += (aim - spin) * Math.min(1, dt * 8); if (Math.abs(aim - spin) < 0.01) spin = aim; moved = true; }
        if (tipTime > 0) { tipTime -= dt; if (tipTime <= 0) { tip.show(false); moved = true; } }
        if (!moved) return false;
        moved = false; draw();
        return true;
      },
    };
  },
};
