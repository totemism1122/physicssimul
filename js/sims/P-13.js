// P-13 Electromagnetic induction (3D): a bar magnet, a coil and a galvanometer. Menus follow
// docs/plan_v0.4.md section 3.7; the scene and the flux calculation follow the approved sample (docs/sample).
// Item kinds: slider, choice, graph, table, note open a panel; toggle and action act at once.
// advanced: true shows the item only in the advanced mode.
const signed = (value) => { const s = value.toFixed(1); return (s === '-0.0' ? '0.0' : s).replace('-', '−'); };

export default {
  view: '3d',
  fixedViews: ['left', 'right', 'front', 'top'],
  camera: { target: [0.5, 1.75, 0], r: 12, theta: 0.45, phi: 1.2 },
  // what the graphs record. current: 1 is the full scale of the galvanometer. flux: the same number as the magnet's
  // strength when the magnet sits in the middle of the coil. range is the least height of the graph; it grows to fit.
  // read: how a value is written when a point of the graph is pressed (the current in divisions of the galvanometer).
  traces: { current: { window: 8, range: 1, read: (v) => `${signed(v * 10)}칸` }, flux: { window: 8, range: 5, read: (v) => signed(v) } },
  menus: {
    vars: [
      { id: 'strength', label: '자석의 세기', kind: 'slider', min: 1, max: 25, step: 1, value: 10 },
      { id: 'turns', label: '코일의 감은 수', kind: 'slider', min: 50, max: 300, step: 10, value: 200, unit: '회' },
      { id: 'autoSpeed', label: '자동 시연 속력', kind: 'slider', min: 0.1, max: 0.5, step: 0.1, value: 0.2, unit: ' m/s', digits: 1 },
    ],
    graph: [
      { id: 'current', label: '유도 전류–시간', kind: 'graph', x: '시간', plots: [{ trace: 'current', y: '유도 전류' }] },
      { id: 'flux', label: '자기선속–시간', kind: 'graph', x: '시간', plots: [{ trace: 'flux', y: '자기선속' }, { trace: 'current', y: '유도 전류' }], advanced: true },
    ],
    time: [
      { id: 'slow', label: '느리게', kind: 'toggle' },
      { id: 'reset', label: '처음으로', kind: 'action' },
      { id: 'step', label: '한 단계씩', kind: 'action', advanced: true },
    ],
    layers: [
      { id: 'field', label: '자기장 선(모형)', kind: 'toggle' },
      { id: 'currentDir', label: '유도 전류의 방향', kind: 'toggle' },
      { id: 'inducedField', label: '유도 전류의 자기장', kind: 'toggle' },
      { id: 'force', label: '자석이 받는 자기력', kind: 'toggle', advanced: true },
      { id: 'fluxValue', label: '자기선속 값', kind: 'toggle', advanced: true },
    ],
    inquiry: [
      { id: 'compare', label: '세기 비교', kind: 'table', text: '재생 단추로 자석을 한 번 넣었다 뺄 때마다, 바늘이 가장 많이 움직인 눈금이 한 줄씩 적힙니다.',
        columns: [{ label: '속력', unit: 'm/s' }, { label: '자석의', unit: '세기' }, { label: '감은 수', unit: '회' }, { label: '바늘', unit: '칸', result: true }] },
      { id: 'fall', label: '자유 낙하', kind: 'toggle' },
      { id: 'lying', label: '눕힌 자석', kind: 'toggle', advanced: true },
    ],
  },

  // writing on the chalkboard (1024 x 400)
  board(g) {
    g.fillStyle = 'rgba(255,255,255,0.9)'; g.font = '56px Georgia, serif'; g.fillText('전자기 유도', 60, 96);
    g.font = 'italic 60px Georgia, serif'; g.fillText('V = − N  ΔΦ / Δt', 60, 200);
    g.strokeStyle = 'rgba(255,255,255,0.8)'; g.lineWidth = 4;
    for (let i = 0; i < 6; i++) { g.beginPath(); g.ellipse(720, 150 + i * 22, 90, 26, 0, 0, Math.PI * 2); g.stroke(); }
    g.strokeRect(690, 40, 60, 90); g.font = '34px Georgia, serif'; g.fillText('N', 708, 118); g.fillText('S', 710, 76);
  },

  // Builds the apparatus on the bench (world) and returns { update(dt) }. Lengths are in units of 10 cm.
  create({ T, kit, world, view, ctx }) {
    const { mat, add, box, cyl, canvasTexture, letterTexture, roundedBox, ringGeometry, Helix } = kit;
    const COIL_X = -1.35, GALV_X = 2.35, LIFT = 2.85;
    const M = {
      wire: mat(0xe0935a, { roughness: 0.9 }), former: mat(0xf1eee8, { side: T.DoubleSide }), flange: mat(0xc9cedb), post: mat(0x8f96a8),
      north: mat(0xd9584a), south: mat(0x4f7fd0), body: mat(0xe4e7ee), bezel: mat(0xb9bfce), needle: mat(0xd9584a), lead: mat(0x4b5163),
    };
    const INK = { field: 0x2f6fd6, current: 0x1d2440, induced: 0x1f9d6b, force: 0x9a3fc2 };   // colours of the marks
    const UPY = new T.Vector3(0, 1, 0), DOWNY = new T.Vector3(0, -1, 0);
    const empty = (group) => { for (const o of group.children) if (o.geometry) o.geometry.dispose(); group.clear(); };

    // ---------- coil on a former ----------
    // lift: height of the coil above the bench; it stands on the bench except when the magnet is to fall right through.
    const COIL = { h: 1.5, bore: 0.66, outer: 1.08, windR: 0.73 };
    let lift = 0;
    const coil = new T.Group(), former = new T.Group(), winding = new T.Group(); coil.add(former, winding); world.add(coil);
    const flow = new T.Group(); flow.visible = false; coil.add(flow);   // the mark for the induced current, round the middle of the coil
    const flowMat = new T.MeshBasicMaterial({ color: INK.current, transparent: true });
    const flowRing = new T.Mesh(new T.TorusGeometry(1, 0.016, 8, 72), flowMat); flowRing.rotation.x = Math.PI / 2; flow.add(flowRing);
    const heads = [0, 1, 2, 3, 4, 5].map(() => { const cone = new T.Mesh(new T.ConeGeometry(0.085, 0.26, 16), flowMat); flow.add(cone); return cone; });
    const tangent = new T.Vector3();
    let flowSign = 0;
    function setFlow(sign) {   // sign 1: anticlockwise seen from above
      const r = flowRing.scale.x;
      heads.forEach((cone, i) => {
        const a = i * Math.PI / 3 + 0.5;
        cone.position.set(r * Math.sin(a), 0, r * Math.cos(a));
        cone.quaternion.setFromUnitVectors(UPY, tangent.set(Math.cos(a) * sign, 0, -Math.sin(a) * sign));
      });
      flowSign = sign;
    }
    const inducedArrow = kit.arrow(INK.induced, 0.07); inducedArrow.visible = false; coil.add(inducedArrow);   // along the axis of the coil

    // the turns drawn are a fifth of the real number (two layers of a tenth each), so more turns look closer wound
    function wind() {
      empty(winding);
      const shown = ctx.values.turns / 10;
      for (const r of [0.70, 0.765]) add(winding, new T.TubeGeometry(new Helix(r, shown, COIL.h - 0.12), Math.round(shown * 40), 0.03, 8, false), M.wire, 0, 0.13, 0);
    }

    // terminal posts beside the coil, the stand that holds the coil up, and the wires
    const posts = new T.Group(), stand = new T.Group(), wires = new T.Group(); world.add(posts, stand, wires);
    for (const z of [-0.5, 0.5]) { add(posts, cyl(0.07, 0.085, 0.3, 20), M.post, 0, 0.15, z); add(posts, cyl(0.11, 0.11, 0.07, 20), M.post, 0, 0.33, z); }
    const gPosts = [-0.6, 0.6].map((x) => { add(world, cyl(0.07, 0.085, 0.26, 20), M.post, GALV_X + x, 0.13, 0.95); return new T.Vector3(GALV_X + x, 0.24, 0.95); });
    const fluxSpot = new T.Vector3(), fluxLabel = view.label(fluxSpot);
    function arrange() {
      lift = ctx.values.fall ? LIFT : 0;
      coil.position.set(COIL_X, lift, 0);
      empty(former);
      add(former, new T.CylinderGeometry(COIL.bore, COIL.bore, COIL.h, 48, 1, true), M.former, 0, COIL.h / 2 + 0.06, 0);
      for (const y of [0, COIL.h + 0.05]) add(former, ringGeometry(0.62, COIL.outer, 0.07), M.flange, 0, y, 0);
      wind();
      flow.position.y = COIL.h / 2 + 0.06; flowRing.scale.set(0.765 + 0.13, 0.765 + 0.13, 1); setFlow(flowSign || 1);
      fluxSpot.set(COIL_X + COIL.outer + 1.1, lift + COIL.h + 0.3, 0);   // beside the top of the coil, in sight on upright screens too

      const edge = COIL.outer, px = COIL_X + edge + 0.37;
      posts.position.x = px;
      empty(stand);
      if (lift) {   // a ring on an arm, on a rod behind the coil
        const z = -(edge + 0.85);
        add(stand, box(1.7, 0.14, 1.1), M.lead, COIL_X, 0.07, z); add(stand, cyl(0.07, 0.07, lift + 1.1, 14), M.post, COIL_X, (lift + 1.1) / 2, z);
        add(stand, box(0.3, 0.24, 0.3), M.post, COIL_X, lift - 0.045, z); add(stand, box(0.14, 0.1, 0.9), M.post, COIL_X, lift - 0.045, z + 0.45);
        add(stand, ringGeometry(0.64, edge + 0.05, 0.07), M.post, COIL_X, lift - 0.08, 0);
        add(stand, roundedBox(1.5, 1.5, 0.12, 0.05), mat(0x7d9a8c), COIL_X, 0.1, 0).rotation.x = Math.PI / 2;   // a soft mat for the magnet to land on
      }
      empty(wires);
      [[0.5, 0, 0.55], [-0.5, 1, -0.9]].forEach(([z, to, bend]) => {
        const a = new T.Vector3(px, 0.28, z), b = gPosts[to];
        const from = new T.Vector3(COIL_X + edge - 0.06, lift + 0.1, z * 0.6), sag = from.clone().lerp(a, 0.5); sag.x += 0.2; sag.y -= lift * 0.12;
        add(wires, new T.TubeGeometry(new T.CatmullRomCurve3([from, sag, a]), 24, 0.022, 8, false), M.wire, 0, 0, 0);   // from the winding to the post
        const mid = a.clone().lerp(b, 0.5); mid.y = 0.05; mid.z += bend;
        const curve = new T.CatmullRomCurve3([a, a.clone().add(new T.Vector3(0.25, -0.12, bend * 0.3)), mid, b.clone().add(new T.Vector3(-0.1, -0.1, 0.25)), b]);
        add(wires, new T.TubeGeometry(curve, 60, 0.032, 10, false), M.lead, 0, 0, 0);                                   // from the post to the galvanometer
      });
    }

    // ---------- bar magnet: local +Y is the south end. It stays in the upright plane z = 0, which contains the coil axis ----------
    const MAG = { w: 0.44, h: 1.9 };
    const magnet = new T.Group(); world.add(magnet);
    const halves = [add(magnet, box(MAG.w, MAG.h / 2, MAG.w), M.north, 0, -MAG.h / 4, 0), add(magnet, box(MAG.w, MAG.h / 2, MAG.w), M.south, 0, MAG.h / 4, 0)];
    for (const [ch, y] of [['N', -MAG.h / 4], ['S', MAG.h / 4]]) for (const side of [1, -1]) {
      const tag = new T.Mesh(new T.PlaneGeometry(0.34, 0.34), new T.MeshBasicMaterial({ map: letterTexture(ch), transparent: true }));
      tag.position.set(0, y, side * (MAG.w / 2 + 0.004)); if (side < 0) tag.rotation.y = Math.PI; magnet.add(tag);
    }
    const guide = add(world, new T.PlaneGeometry(17, 7.4), new T.MeshBasicMaterial({ color: 0x4f7fd0, transparent: true, opacity: 0.08, side: T.DoubleSide, depthWrite: false }), 0, 3.7, 0, false, false);
    guide.visible = false;   // shown while dragging, so the plane of motion is clear

    // Field lines (a model): they leave the north end and come back to the south end. A stronger magnet is drawn
    // with more lines. All the lines are one object and all the arrowheads another, to keep the drawing cheap.
    const SHELLS = [1.3, 2.0, 2.9], MOST = 14, STEPS = 48;
    const fieldLines = new T.Group(); fieldLines.visible = false; magnet.add(fieldLines);
    const lineGeo = new T.BufferGeometry(); lineGeo.setAttribute('position', new T.BufferAttribute(new Float32Array(SHELLS.length * MOST * STEPS * 6), 3));
    fieldLines.add(new T.LineSegments(lineGeo, new T.LineBasicMaterial({ color: INK.field, transparent: true, opacity: 0.75 })));
    const lineHeads = new T.InstancedMesh(new T.ConeGeometry(0.05, 0.17, 12), kit.glow(INK.field), SHELLS.length * MOST); fieldLines.add(lineHeads);
    function drawField() {
      const planes = 4 + 2 * Math.round(ctx.values.strength / 5), at = lineGeo.attributes.position, place = new T.Matrix4();
      let n = 0, lines = 0;
      for (const L of SHELLS) for (let k = 0; k < planes; k++) {
        const a = k * Math.PI * 2 / planes, c = Math.cos(a), s = Math.sin(a);
        const point = (i) => { const th = 0.2 + (Math.PI - 0.4) * i / STEPS, r = L * Math.sin(th) ** 2; return [r * Math.sin(th) * c, -r * Math.cos(th), -r * Math.sin(th) * s]; };
        for (let i = 0; i < STEPS; i++) { at.setXYZ(n++, ...point(i)); at.setXYZ(n++, ...point(i + 1)); }
        lineHeads.setMatrixAt(lines++, place.makeTranslation(L * c, 0, -L * s));   // outside the magnet the field points from N towards S
      }
      at.needsUpdate = true; lineGeo.setDrawRange(0, n); lineHeads.count = lines; lineHeads.instanceMatrix.needsUpdate = true;
    }

    // ---------- galvanometer ----------
    const dial = canvasTexture(768, 512, (g, w, h) => {
      g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h);
      const cx = w / 2, cy = h * 0.92, R = h * 0.72, ink = '#3a4057';
      g.strokeStyle = ink; g.fillStyle = ink; g.lineCap = 'round';
      g.lineWidth = 5; g.beginPath(); g.arc(cx, cy, R, Math.PI * 1.22, Math.PI * 1.78); g.stroke();
      for (let i = -10; i <= 10; i++) {
        const a = -Math.PI / 2 + i * (Math.PI * 0.28 / 10), len = i % 5 === 0 ? 34 : 20;
        g.lineWidth = i % 5 === 0 ? 5 : 2.5;
        g.beginPath(); g.moveTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
        g.lineTo(cx + Math.cos(a) * (R - len), cy + Math.sin(a) * (R - len)); g.stroke();
      }
      g.font = '700 44px Helvetica, Arial, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText('0', cx, cy - R + 66); g.fillText('−', cx - R * 0.62, cy - R * 0.6); g.fillText('+', cx + R * 0.62, cy - R * 0.6);
      g.font = '700 78px Helvetica, Arial, sans-serif'; g.fillText('G', cx, cy - R * 0.36);
    });
    const galv = new T.Group(); galv.position.set(GALV_X, 0.78, 0.15); galv.rotation.x = -0.3; world.add(galv);
    const bw = 1.9, bh = 1.45, bd = 0.6;
    add(galv, roundedBox(bw, bh, bd, 0.1), M.body, 0, 0, 0);
    add(galv, roundedBox(bw - 0.18, bh - 0.18, 0.03, 0.06), M.bezel, 0, 0, bd / 2 + 0.035, false);
    add(galv, new T.PlaneGeometry(bw - 0.3, bh - 0.3), mat(0xffffff, { map: dial }), 0, 0, bd / 2 + 0.092, false);
    const needle = new T.Group(); needle.position.set(0, -(bh - 0.3) * 0.42, bd / 2 + 0.108); galv.add(needle);
    add(needle, box(0.022, 0.82, 0.012), M.needle, 0, 0.41, 0, false, false);
    add(needle, cyl(0.05, 0.05, 0.03, 20), M.bezel, 0, 0, 0, false, false).rotation.x = Math.PI / 2;

    // ---------- physics: flux through the coil from the magnet's position and direction ----------
    // The magnet is a chain of small dipoles along its length. The flux through each loop of the coil is the
    // line integral of the dipoles' vector potential A = (m x r) / r^3 round that loop (constants dropped).
    // The result is for a magnet of strength 1; it is the average over the loops, that is, the flux through one turn.
    const LOOPS = [0.25, 0.53, 0.81, 1.09, 1.37], SEG = 32, DIPOLES = 9;
    const axisDir = new T.Vector3(), mDir = new T.Vector3(), dip = new T.Vector3(), rv = new T.Vector3(), av = new T.Vector3();
    function fluxFor(pos, quat) {
      axisDir.set(0, 1, 0).applyQuaternion(quat); mDir.copy(axisDir).negate();   // moment points from S to N
      const R = COIL.windR;
      let sum = 0;
      for (let i = 0; i < DIPOLES; i++) {
        const s = (i / (DIPOLES - 1) - 0.5) * MAG.h * 0.86;
        dip.copy(pos).addScaledVector(axisDir, s);
        for (const ly of LOOPS) for (let j = 0; j < SEG; j++) {
          const ph = (j + 0.5) / SEG * Math.PI * 2, c = Math.cos(ph), sn = Math.sin(ph);
          rv.set(COIL_X + R * c - dip.x, lift + ly - dip.y, R * sn - dip.z);
          const r2 = rv.lengthSq() + 0.01;
          av.crossVectors(mDir, rv).multiplyScalar(1 / (r2 * Math.sqrt(r2)));
          sum += av.x * sn - av.z * c;        // dl taken so that upward flux counts as positive
        }
      }
      return sum * (R * 2 * Math.PI / SEG) / DIPOLES / LOOPS.length;
    }
    // the magnet may not pass through the bench or the coil wall (it fits inside the bore)
    const probe = new T.Vector3();
    function allowed(pos, quat) {
      axisDir.set(0, 1, 0).applyQuaternion(quat);
      for (let i = 0; i < 7; i++) {
        probe.copy(pos).addScaledVector(axisDir, (i / 6 - 0.5) * MAG.h);
        if (probe.y < 0.24) return false;
        if (probe.y > lift - 0.34 && probe.y < lift + COIL.h + 0.34) { const rho = Math.hypot(probe.x - COIL_X, probe.z); if (rho > COIL.bore - 0.3 && rho < COIL.outer + 0.3) return false; }
      }
      return Math.abs(pos.x) < 9 && Math.abs(pos.z) < 3.4 && pos.y < 7.5;
    }

    // Scales, found once from the starting coil with the magnet moving along the axis:
    // GAIN  the needle shows 3 of its 10 divisions at the starting settings (strength 10, 200 turns, 0.2 m/s);
    // FLUX  the flux shown equals the magnet's strength when the magnet is in the middle of the coil;
    // FORCE the force arrow is 0.6 long at the strongest moment of the starting settings.
    const START = { strength: 10, turns: 200, speed: 2, needle: 0.3 };
    const at = new T.Vector3(), upright = new T.Quaternion();
    let steepest = 0;
    for (let y = 0.5; y < 4.2; y += 0.02) steepest = Math.max(steepest, Math.abs(fluxFor(at.set(COIL_X, y + 0.01, 0), upright) - fluxFor(at.set(COIL_X, y - 0.01, 0), upright)) / 0.02);
    const GAIN = START.needle / (steepest * START.speed * START.turns * START.strength);
    const FLUX = 1 / Math.abs(fluxFor(at.set(COIL_X, 0.81, 0), upright));
    const FORCE = 0.6 / (START.turns * START.strength * START.needle * steepest);

    // ---------- state ----------
    // rate: minus the rate of change of the flux (for strength 1), smoothed; the induced emf is turns x strength x rate.
    // frozen: the automatic demonstration is paused, so the instant is held. Taking the magnet in hand lets time run again.
    let moved = true, playing = false, frozen = false, onPath = false, ended = false;
    let lastFlux = null, unitFlux = 0, rate = 0, current = 0, deflection = 0;
    let recorded = 0, quiet = 9, held = true, cycleClean = true, peak = 0;   // held: the graphs are standing still
    const LYING = new T.Quaternion().setFromAxisAngle(new T.Vector3(0, 0, 1), Math.PI / 2), FLIPPED = new T.Quaternion().setFromAxisAngle(new T.Vector3(0, 0, 1), Math.PI);
    const demo = { y: 0, dir: -1, wait: 0, time: 0 };
    const G = 98;   // 9.8 m/s^2, in units of 10 cm
    // where the automatic demonstration takes the middle of the magnet: [top, bottom]
    const path = () => (ctx.values.fall ? [lift + 0.78 + 2.4, 1.2] : ctx.values.lying ? [3.6, COIL.h + 0.67] : [3.6, 1.2]);
    function jump(x, y, quat) { magnet.position.set(x, y, 0); magnet.quaternion.copy(quat); lastFlux = null; moved = true; }   // a jump induces nothing
    function toStart() {
      jump(COIL_X, ctx.values.fall ? path()[0] : 3.1, ctx.values.lying ? LYING : upright);
      onPath = frozen = false; rate = 0; recorded = 0; quiet = 9; held = true;
      for (const trace of Object.values(ctx.traces)) trace.clear();
    }

    // One step of time: the flux is found anew and the induced current follows from its change.
    // quick: how fast the reading follows (per second). Hand movements are smoothed; a fall is followed closely.
    function advance(dt, quick = 18) {
      unitFlux = fluxFor(magnet.position, magnet.quaternion);
      const raw = lastFlux === null ? 0 : -(unitFlux - lastFlux) / dt;
      lastFlux = unitFlux;
      rate += (raw - rate) * Math.min(1, dt * quick);
      // the graphs move on only while something is happening, so two tries stay side by side
      const live = playing || Math.abs(raw) > 1e-7 || Math.abs(rate) * GAIN * ctx.values.turns * ctx.values.strength > 0.004;
      quiet = live ? 0 : quiet + dt;
      if (quiet < 0.1) {
        const fresh = held && recorded > 0;   // a dotted line marks where the graph stood still
        held = false; recorded += dt;
        ctx.traces.current.add(recorded, GAIN * ctx.values.turns * ctx.values.strength * rate, fresh);
        ctx.traces.flux.add(recorded, ctx.values.strength * unitFlux * FLUX, fresh);
      } else held = true;
    }

    // ---------- dragging: the middle of the magnet moves it, the outer part of either end turns it ----------
    // Seen from the side or from above, the plane of motion is edge-on: the magnet then slides along the one
    // direction that can be told apart on screen (up-down from the side, left-right from above) and does not turn.
    const plane = new T.Plane(new T.Vector3(0, 0, 1), 0), hit = new T.Vector3(), grab = new T.Vector3(), cand = new T.Vector3(), tryPos = new T.Vector3();
    const q = new T.Quaternion(), ZAXIS = new T.Vector3(0, 0, 1), from = new T.Vector3(), along = new T.Vector3(), gap = new T.Vector3();
    const ray = new T.Raycaster(), look = new T.Vector3();
    let mode = '', grabbedEnd = 1, slideStart = 0;
    const planePoint = (r) => r.intersectPlane(plane, hit);
    function slideAt(r) {   // how far along the slide line the pointer is: closest approach of the pointer ray to the line
      gap.subVectors(from, r.origin);
      const b = along.dot(r.direction), d = along.dot(gap), e = r.direction.dot(gap), det = 1 - b * b;
      return det < 1e-6 ? 0 : (b * e - d) / det;
    }
    function tryMove(to) {
      if (allowed(to, magnet.quaternion)) magnet.position.copy(to);
      else if (allowed(tryPos.set(magnet.position.x, to.y, 0), magnet.quaternion)) magnet.position.copy(tryPos);   // slide along the obstacle
      else if (allowed(tryPos.set(to.x, magnet.position.y, 0), magnet.quaternion)) magnet.position.copy(tryPos);
      moved = true;
    }
    view.setTool({
      pick(r) {
        ray.ray.copy(r); magnet.updateMatrixWorld(true);   // the magnet may have moved since the last drawn frame
        const h = ray.intersectObjects(halves, false)[0];
        if (!h) return null;
        const ly = magnet.worldToLocal(h.point.clone()).y;
        return { end: ly > 0 ? 1 : -1, turn: Math.abs(ly) > MAG.h * 0.27 };
      },
      cursor: (grip) => (!grip ? '' : grip.turn && Math.abs(view.camera.getWorldDirection(look).z) >= 0.25 ? 'alias' : 'grab'),
      start(grip, r) {
        if (Math.abs(r.direction.z) < 0.25) {
          mode = 'slide'; from.copy(magnet.position);
          along.set(Math.abs(r.direction.y) > Math.abs(r.direction.x) ? 1 : 0, Math.abs(r.direction.y) > Math.abs(r.direction.x) ? 0 : 1, 0);
          slideStart = slideAt(r);
        } else {
          const p = planePoint(r);
          if (!p) return false;
          mode = grip.turn ? 'turn' : 'move'; grabbedEnd = grip.end;
          grab.subVectors(magnet.position, p);
        }
        ctx.setPlaying(false); frozen = onPath = false; guide.visible = true;
        return true;
      },
      move(r) {
        if (mode === 'slide') { tryMove(cand.copy(from).addScaledVector(along, slideAt(r) - slideStart)); return; }
        const p = planePoint(r);
        if (!p) return;
        if (mode === 'move') { cand.addVectors(p, grab); cand.z = 0; tryMove(cand); }
        else {
          cand.subVectors(p, magnet.position); if (cand.lengthSq() < 0.01) return;
          q.setFromAxisAngle(ZAXIS, Math.atan2(cand.y * grabbedEnd, cand.x * grabbedEnd) - Math.PI / 2);   // turn about the normal of the plane
          if (allowed(magnet.position, q)) { magnet.quaternion.copy(q); moved = true; }
        }
      },
      end() { mode = ''; guide.visible = false; },
    });

    // ---------- automatic demonstration (the play button) ----------
    // The magnet goes into the coil and out again at a steady speed, resting a moment at each end. If the magnet
    // was turned over by hand it stays turned over. "Free fall": the magnet is let go above the raised coil and falls through it on to the mat.
    function startDemo() {
      const [top] = path(), south = new T.Vector3(0, 1, 0).applyQuaternion(magnet.quaternion);
      jump(COIL_X, top, ctx.values.lying ? LYING : south.y < -0.5 ? FLIPPED : upright);
      demo.y = top; demo.dir = -1; demo.wait = 0; demo.time = 0; onPath = true; cycleClean = true; peak = 0;
    }
    function endCycle() {   // one line in the comparison table for each time in and out
      const v = ctx.values, clean = cycleClean, most = peak;
      cycleClean = true; peak = 0;
      if (!clean || v.fall || v.lying) return;
      const row = [v.autoSpeed.toFixed(1), String(v.strength), String(v.turns), most > 1 ? '끝까지' : (most * 10).toFixed(1)];
      const rows = ctx.tables.compare.rows, last = rows[rows.length - 1];
      ctx.tables.compare.add(row, Boolean(last) && last.slice(0, 3).every((cell, i) => cell === row[i]));
    }
    ctx.on('play', (on) => {
      playing = on;
      if (on) { frozen = false; if (!onPath) startDemo(); }
      else if (ended) ended = false; else frozen = true;
    });
    ctx.on('tick', (t, dt) => {
      if (!dt) return;
      if (!onPath) startDemo();
      const [top, bottom] = path();
      if (ctx.values.fall) {   // from rest, with gravity alone: y = top - g t^2 / 2. It is fast, so time is taken in steps of 2 ms.
        const steps = Math.ceil(dt / 0.002), h = dt / steps;
        for (let i = 0; i < steps && onPath; i++) {
          demo.time += h; demo.y = top - G * demo.time * demo.time / 2;
          if (demo.y <= bottom) { demo.y = bottom; onPath = false; }   // landed
          magnet.position.y = demo.y; advance(h, 1e6);
        }
        moved = true;
        if (!onPath) { rate = 0; if (playing) { ended = true; ctx.setPlaying(false); } else frozen = false; }   // the magnet now rests
        return;
      }
      if (demo.wait > 0) demo.wait -= dt;
      else {
        demo.y += demo.dir * ctx.values.autoSpeed * 10 * dt;   // 1 m is 10 units
        if (demo.dir < 0 && demo.y <= bottom) { demo.y = bottom; demo.dir = 1; demo.wait = 0.25; }
        else if (demo.dir > 0 && demo.y >= top) { demo.y = top; demo.dir = -1; demo.wait = 0.25; endCycle(); }
      }
      magnet.position.y = demo.y; moved = true;
      advance(dt);
      peak = Math.max(peak, Math.abs(GAIN * ctx.values.turns * ctx.values.strength * rate));
    });
    ctx.on('action', (id) => { if (id === 'reset') toStart(); });
    ctx.on('change', (id, value) => {
      moved = true;
      if (id === 'field') fieldLines.visible = value;
      if (id === 'strength') drawField();
      if (id === 'turns') wind();
      if (id === 'strength' || id === 'turns' || id === 'autoSpeed') cycleClean = false;
      if (id === 'fall' || id === 'lying') {   // the two arrangements exclude each other
        const other = id === 'fall' ? 'lying' : 'fall';
        if (value && ctx.values[other]) ctx.set(other, false);
        arrange(); ctx.emit('action', 'reset');   // the frame stops the clock; toStart() follows from the action
        view.look(ctx.values.fall ? { target: [0.5, 3.4, 0], r: 13.5 } : undefined);
      }
    });

    // ---------- every frame: needle, marks and readings follow the induced current ----------
    const forceArrow = kit.arrow(INK.force, 0.06); forceArrow.visible = false; world.add(forceArrow);
    const pull = new T.Vector3();
    arrange(); drawField(); toStart();
    return {
      magnet, fluxFor, state: () => ({ current, deflection, flux: ctx.values.strength * unitFlux * FLUX, playing, frozen, onPath, y: magnet.position.y }),
      update(dt) {
        if (!playing && !frozen) advance(dt);
        const v = ctx.values;
        current = GAIN * v.turns * v.strength * rate;   // 1 is the full scale of the galvanometer
        const before = deflection;
        deflection += (Math.max(-1, Math.min(1, current)) - deflection) * Math.min(1, dt * 12);
        // the dial is drawn a little narrower than it is tall, so the angle follows the printed divisions
        needle.rotation.z = -Math.sign(deflection) * Math.atan(0.927 * Math.tan(Math.abs(deflection) * 0.88));
        const size = Math.abs(deflection), sign = deflection < 0 ? -1 : 1, shown = size > 0.012;

        flow.visible = v.currentDir && shown;
        if (flow.visible) { if (sign !== flowSign) setFlow(sign); flowMat.opacity = Math.min(1, size / 0.08); }
        inducedArrow.visible = v.inducedField && shown;
        if (inducedArrow.visible) {   // upward when the current runs anticlockwise seen from above
          const length = 0.45 + 1.25 * size;
          inducedArrow.setLength(length); inducedArrow.aim(sign > 0 ? UPY : DOWNY);
          inducedArrow.position.y = COIL.h / 2 + 0.06 - sign * length / 2; inducedArrow.material.opacity = Math.min(0.9, size / 0.08);
        }
        forceArrow.visible = false;
        if (v.force && Math.abs(current) > 0.01) {   // force = turns x current x gradient of the flux, which always works against the motion
          const p = magnet.position, q = magnet.quaternion, h = 0.02;
          pull.set(fluxFor(at.set(p.x + h, p.y, 0), q) - fluxFor(at.set(p.x - h, p.y, 0), q), fluxFor(at.set(p.x, p.y + h, 0), q) - fluxFor(at.set(p.x, p.y - h, 0), q), 0)
            .multiplyScalar(FORCE * v.turns * v.strength * current / (2 * h));
          const length = Math.min(2.4, pull.length());
          if (length > 0.08) { forceArrow.visible = true; forceArrow.position.copy(p); forceArrow.setLength(length); forceArrow.aim(pull.normalize()); }
        }
        fluxLabel.show(v.fluxValue);
        if (v.fluxValue) fluxLabel.write(`자기선속 Φ = <b>${signed(v.strength * unitFlux * FLUX)}</b>`);

        const changed = moved || Math.abs(deflection - before) > 1e-5;
        moved = false;
        return changed;
      },
    };
  },
};
