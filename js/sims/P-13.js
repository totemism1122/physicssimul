// P-13 Electromagnetic induction (3D): a bar magnet, a coil and a galvanometer. Menus follow
// docs/plan_v0.4.md section 3.7; the scene and the flux calculation follow the approved sample (docs/sample).
// Item kinds: slider, choice, graph, note open a panel; toggle and action act at once.
// advanced: true shows the item only in the advanced mode.
export default {
  view: '3d',
  fixedViews: ['left', 'right', 'front', 'top'],
  camera: { target: [0.5, 1.75, 0], r: 12, theta: 0.45, phi: 1.2 },
  menus: {
    vars: [
      { id: 'strength', label: '자석의 세기', kind: 'slider', min: 1, max: 25, step: 1, value: 10 },
      { id: 'turns', label: '코일의 감은 수', kind: 'slider', min: 50, max: 300, step: 10, value: 200, unit: '회' },
      { id: 'autoSpeed', label: '자동 시연 속력', kind: 'slider', min: 0.2, max: 1, step: 0.1, value: 0.6, unit: ' m/s', digits: 1 },
      { id: 'area', label: '코일의 단면적', kind: 'slider', min: 1, max: 3, step: 0.5, value: 1, unit: '배', digits: 1, advanced: true },
    ],
    graph: [
      { id: 'current', label: '유도 전류–시간', kind: 'graph', x: '시간', y: '전류' },
      { id: 'flux', label: '자기선속–시간', kind: 'graph', x: '시간', y: '자기선속', advanced: true },
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
      { id: 'compare', label: '세기 비교', kind: 'note', text: '빠르기, 자석의 세기, 감은 수를 하나씩 바꾸며 바늘이 움직이는 정도를 비교합니다.' },
      { id: 'through', label: '등속으로 통과', kind: 'note', text: '자석이 코일을 일정한 빠르기로 지나갑니다.', advanced: true },
      { id: 'lying', label: '눕힌 자석', kind: 'note', text: '자석을 눕혀서 코일에 가까이 가져갑니다.', advanced: true },
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

  // Builds the apparatus on the bench (world) and returns { update(dt) }. Lengths are in units of about 10 cm.
  create({ T, kit, world, view, ctx }) {
    const { mat, add, box, cyl, canvasTexture, letterTexture, roundedBox, ringGeometry, Helix } = kit;
    const COIL_X = -1.35, GALV_X = 2.35;
    const M = {
      wire: mat(0xe0935a, { roughness: 0.9 }), former: mat(0xf1eee8, { side: T.DoubleSide }), flange: mat(0xc9cedb), post: mat(0x8f96a8),
      north: mat(0xd9584a), south: mat(0x4f7fd0), body: mat(0xe4e7ee), bezel: mat(0xb9bfce), needle: mat(0xd9584a), lead: mat(0x4b5163),
    };

    // coil on a former, with two terminal posts
    const COIL = { h: 1.5, bore: 0.66, outer: 1.08, windR: 0.73, turns: 22 };
    const coil = new T.Group(); coil.position.set(COIL_X, 0, 0); world.add(coil);
    add(coil, new T.CylinderGeometry(COIL.bore, COIL.bore, COIL.h, 48, 1, true), M.former, 0, COIL.h / 2 + 0.06, 0);
    add(coil, ringGeometry(0.62, COIL.outer, 0.07), M.flange, 0, 0, 0);
    add(coil, ringGeometry(0.62, COIL.outer, 0.07), M.flange, 0, COIL.h + 0.05, 0);
    for (const r of [0.70, 0.765]) add(coil, new T.TubeGeometry(new Helix(r, COIL.turns, COIL.h - 0.12), COIL.turns * 40, 0.03, 8, false), M.wire, 0, 0.13, 0);
    const posts = [], gPosts = [];
    for (const z of [-0.5, 0.5]) {
      add(world, cyl(0.07, 0.085, 0.3, 20), M.post, COIL_X + 1.45, 0.15, z); add(world, cyl(0.11, 0.11, 0.07, 20), M.post, COIL_X + 1.45, 0.33, z);
      posts.push(new T.Vector3(COIL_X + 1.45, 0.28, z));
    }

    // bar magnet: local +Y is the south end. It stays in the upright plane z = 0, which contains the coil axis.
    const MAG = { w: 0.44, h: 1.9, start: new T.Vector3(COIL_X, 3.1, 0) };
    const magnet = new T.Group(); magnet.position.copy(MAG.start); world.add(magnet);
    const halves = [add(magnet, box(MAG.w, MAG.h / 2, MAG.w), M.north, 0, -MAG.h / 4, 0), add(magnet, box(MAG.w, MAG.h / 2, MAG.w), M.south, 0, MAG.h / 4, 0)];
    for (const [ch, y] of [['N', -MAG.h / 4], ['S', MAG.h / 4]]) for (const side of [1, -1]) {
      const tag = new T.Mesh(new T.PlaneGeometry(0.34, 0.34), new T.MeshBasicMaterial({ map: letterTexture(ch), transparent: true }));
      tag.position.set(0, y, side * (MAG.w / 2 + 0.004)); if (side < 0) tag.rotation.y = Math.PI; magnet.add(tag);
    }
    const guide = add(world, new T.PlaneGeometry(17, 7.4), new T.MeshBasicMaterial({ color: 0x4f7fd0, transparent: true, opacity: 0.08, side: T.DoubleSide, depthWrite: false }), 0, 3.7, 0, false, false);
    guide.visible = false;   // shown while dragging, so the plane of motion is clear
    const fieldLines = new T.Group(); fieldLines.visible = false; magnet.add(fieldLines);
    const lineMat = new T.LineBasicMaterial({ color: 0x2f6fd6, transparent: true, opacity: 0.75 });
    for (const L of [1.3, 2.0, 2.9]) for (let k = 0; k < 8; k++) {
      const pts = [];
      for (let i = 0; i <= 60; i++) { const th = 0.2 + (Math.PI - 0.4) * i / 60, r = L * Math.sin(th) ** 2; pts.push(new T.Vector3(r * Math.sin(th), -r * Math.cos(th), 0)); }
      const line = new T.Line(new T.BufferGeometry().setFromPoints(pts), lineMat); line.rotation.y = k * Math.PI / 4; fieldLines.add(line);
    }

    // galvanometer and its two leads
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
    for (const x of [-0.6, 0.6]) { add(world, cyl(0.07, 0.085, 0.26, 20), M.post, GALV_X + x, 0.13, 0.95); gPosts.push(new T.Vector3(GALV_X + x, 0.24, 0.95)); }
    [[posts[1], gPosts[0], 0.55], [posts[0], gPosts[1], -0.9]].forEach(([a, b, bend]) => {
      const mid = a.clone().lerp(b, 0.5); mid.y = 0.05; mid.z += bend;
      const curve = new T.CatmullRomCurve3([a, a.clone().add(new T.Vector3(0.25, -0.12, bend * 0.3)), mid, b.clone().add(new T.Vector3(-0.1, -0.1, 0.25)), b]);
      add(world, new T.TubeGeometry(curve, 60, 0.032, 10, false), M.lead, 0, 0, 0);
    });

    // ---------- physics: flux through the coil from the magnet's position and direction ----------
    // The magnet is a chain of small dipoles along its length. The flux through each loop of the coil is the
    // line integral of the dipoles' vector potential A = (m x r) / r^3 around that loop (constants dropped).
    const LOOPS = [0.25, 0.53, 0.81, 1.09, 1.37], SEG = 32, DIPOLES = 9;
    const axisDir = new T.Vector3(), mDir = new T.Vector3(), dip = new T.Vector3(), rv = new T.Vector3(), av = new T.Vector3();
    function fluxFor(pos, quat) {
      axisDir.set(0, 1, 0).applyQuaternion(quat); mDir.copy(axisDir).negate();   // moment points from S to N
      let sum = 0;
      for (let i = 0; i < DIPOLES; i++) {
        const s = (i / (DIPOLES - 1) - 0.5) * MAG.h * 0.86;
        dip.copy(pos).addScaledVector(axisDir, s);
        for (const ly of LOOPS) for (let j = 0; j < SEG; j++) {
          const ph = (j + 0.5) / SEG * Math.PI * 2, c = Math.cos(ph), sn = Math.sin(ph);
          rv.set(COIL_X + COIL.windR * c - dip.x, ly - dip.y, COIL.windR * sn - dip.z);
          const r2 = rv.lengthSq() + 0.01;
          av.crossVectors(mDir, rv).multiplyScalar(1 / (r2 * Math.sqrt(r2)));
          sum += av.x * sn - av.z * c;        // dl taken so that upward flux counts as positive
        }
      }
      return sum * (COIL.windR * 2 * Math.PI / SEG) / DIPOLES;
    }
    // the magnet may not pass through the bench or the coil wall (it fits inside the bore)
    const probe = new T.Vector3();
    function allowed(pos, quat) {
      axisDir.set(0, 1, 0).applyQuaternion(quat);
      for (let i = 0; i < 7; i++) {
        probe.copy(pos).addScaledVector(axisDir, (i / 6 - 0.5) * MAG.h);
        if (probe.y < 0.24) return false;
        if (probe.y < COIL.h + 0.34) { const rho = Math.hypot(probe.x - COIL_X, probe.z); if (rho > COIL.bore - 0.3 && rho < COIL.outer + 0.3) return false; }
      }
      return Math.abs(pos.x) < 9 && Math.abs(pos.z) < 3.4 && pos.y < 7.5;
    }

    // ---------- dragging: the middle of the magnet moves it, the outer part of either end turns it ----------
    // Seen from the side or from above, the plane of motion is edge-on: the magnet then slides along the one
    // direction that can be told apart on screen (up-down from the side, left-right from above) and does not turn.
    const plane = new T.Plane(new T.Vector3(0, 0, 1), 0), hit = new T.Vector3(), grab = new T.Vector3(), cand = new T.Vector3(), tryPos = new T.Vector3();
    const q = new T.Quaternion(), ZAXIS = new T.Vector3(0, 0, 1), from = new T.Vector3(), along = new T.Vector3(), gap = new T.Vector3();
    const ray = new T.Raycaster(), look = new T.Vector3();
    let mode = '', grabbedEnd = 1, slideStart = 0, moved = true;
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
        ctx.setPlaying(false); guide.visible = true;
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

    // ---------- automatic demonstration (the play button): the magnet goes in and out of the coil ----------
    let phase = 0;
    ctx.on('play', (on) => { if (on) { magnet.quaternion.identity(); magnet.position.set(COIL_X, 2.45 + 1.35 * Math.cos(phase), 0); moved = true; } });
    ctx.on('tick', (t, dt) => { if (!dt) return; phase += dt * 1.5; magnet.position.set(COIL_X, 2.45 + 1.35 * Math.cos(phase), 0); moved = true; });
    ctx.on('action', (id) => { if (id === 'reset') { phase = 0; magnet.position.copy(MAG.start); magnet.quaternion.identity(); moved = true; } });
    ctx.on('change', (id, value) => { if (id === 'field') { fieldLines.visible = value; moved = true; } });

    // ---------- every frame: the needle follows the induced emf, minus the rate of change of flux ----------
    let lastFlux = fluxFor(magnet.position, magnet.quaternion), emf = 0, deflection = 0;
    const GAIN = 0.18;
    return {
      magnet, fluxFor, state: () => ({ emf, deflection, mode }),
      update(dt) {
        const flux = fluxFor(magnet.position, magnet.quaternion);
        emf += (-(flux - lastFlux) / dt - emf) * Math.min(1, dt * 18); lastFlux = flux;
        const before = deflection;
        deflection += (Math.max(-1, Math.min(1, emf * GAIN)) - deflection) * Math.min(1, dt * 12);
        needle.rotation.z = -deflection * 0.7;
        const changed = moved || Math.abs(deflection - before) > 1e-5;
        moved = false;
        return changed;
      },
    };
  },
};
