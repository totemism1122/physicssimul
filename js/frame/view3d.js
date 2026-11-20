// The 3D view shared by every 3D simulation: renderer, camera, viewpoints and pointer handling.
// Free view: dragging empty space turns the camera, dragging an object works it.
// Fixed view (left, right, front, top): dragging only works objects.
// cam: the simulation's starting camera { target: [x, y, z], r, theta, phi }, with two optional extras:
// rMax (how far back the camera may go) and tall ({ theta, phi, r } to start from on an upright screen).
export function createView3D(T, canvas, ctx, cam = {}) {
  const renderer = new T.WebGLRenderer({ canvas, antialias: true });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFSoftShadowMap;
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;

  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(40, 1, 0.1, 200);
  const homeTarget = cam.target || [0.5, 1.75, 0], target = new T.Vector3(...homeTarget);
  const home = { r: cam.r || 12, theta: cam.theta === undefined ? 0.45 : cam.theta, phi: cam.phi === undefined ? 1.2 : cam.phi };
  const orbit = { theta: home.theta, phi: home.phi, r: home.r };   // r before the tall-screen factor
  const FIXED = { front: [0, 1.45], left: [-Math.PI / 2, 1.45], right: [Math.PI / 2, 1.45], top: [0, 0.02] };   // theta, phi
  const R_MIN = 5, R_MAX = cam.rMax || 16, PHI_MIN = 0.45, PHI_MAX = 1.5;
  let goal = null;       // { theta, phi } the camera is gliding towards
  let aim = null;        // { target, r } the point looked at and the distance are gliding towards
  let tallFactor = 1;    // tall screens stand 1.3 times farther back so the apparatus fits
  function placeCamera() {
    const r = orbit.r * tallFactor, s = Math.sin(orbit.phi);
    camera.position.set(target.x + r * s * Math.sin(orbit.theta), target.y + r * Math.cos(orbit.phi), target.z + r * s * Math.cos(orbit.theta));
    camera.lookAt(target);
    // From far back, whatever stands between the camera and the working bench (the next bench, its stools) is left out.
    const near = Math.max(0.1, r - 10.8);
    if (Math.abs(near - camera.near) > 0.01) { camera.near = near; camera.updateProjectionMatrix(); }
  }
  let freeAngle = null;  // where the free view was left, so it can be picked up again after a fixed view
  function applyViewpoint(view) {
    if (view.kind === 'fixed') {
      if (!freeAngle) freeAngle = { theta: orbit.theta, phi: orbit.phi };
      goal = { theta: FIXED[view.dir][0], phi: FIXED[view.dir][1] };
    } else { goal = freeAngle || { theta: orbit.theta, phi: orbit.phi }; freeAngle = null; }
    dirty = true;
  }
  ctx.on('view', applyViewpoint);
  // moves the point looked at (and the distance), for an arrangement that needs other framing; no argument: back to the start.
  // theta, phi: where the free view looks from, from then on (a fixed view is left as it is); without them: as it was
  function look(to = {}) {
    aim = { target: new T.Vector3(...(to.target || homeTarget)), r: to.r || home.r };
    if (to.phi !== undefined) {
      const angle = { theta: to.theta === undefined ? orbit.theta : to.theta, phi: to.phi };
      if (ctx.view.kind === 'free') goal = angle; else freeAngle = angle;
    }
    dirty = true;
  }

  // ---------- labels: a little writing that stays beside a point of the scene ----------
  const labels = [], spot = new T.Vector3(), screenUp = new T.Vector3();
  // at: a Vector3 in the scene, which may be moved afterwards.  lines: true for a small block of several lines.
  // shift: how far up the screen from that point the writing sits, in lengths of the scene; negative: below the point, hanging down
  function label(at, lines, shift = 0) {
    const el = document.createElement('div'); el.className = `scene-label${lines ? ' lines' : ''}`; el.hidden = true; canvas.after(el);
    const one = { el, at, shift, show(on) { if (el.hidden === on) { el.hidden = !on; dirty = true; } }, write(html) { if (el.innerHTML !== html) el.innerHTML = html; } };
    labels.push(one);
    return one;
  }
  function placeLabels() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    screenUp.set(0, 1, 0).applyQuaternion(camera.quaternion);
    for (const { el, at, shift } of labels) if (!el.hidden) {
      spot.copy(at).addScaledVector(screenUp, shift).project(camera);
      el.style.transform = `translate(${((spot.x + 1) / 2 * w).toFixed(1)}px, ${((1 - spot.y) / 2 * h).toFixed(1)}px) translate(-50%, ${shift < 0 ? 0 : -100}%)`;
    }
  }

  // ---------- quality: fewer pixels and fewer shadows on slower devices ----------
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const weak = navigator.deviceMemory ? navigator.deviceMemory <= 4 : (navigator.hardwareConcurrency || 8) <= 4;
  let level = coarse && weak ? 1 : 0, onQuality = () => {}, slow = 0, lastRender = 0;
  function applyQuality() {
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, [2, 1.5, 1][level]));
    onQuality(level); sized = ''; dirty = true;
  }

  // ---------- pointer: work an object, turn the camera, or zoom ----------
  const ray = new T.Raycaster(), ndc = new T.Vector2(), pointers = new Map();
  let tool = null, held = null, pinch = 0;
  function rayAt(e) {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    return ray.ray;
  }
  const zoom = (factor) => { orbit.r = Math.min(R_MAX, Math.max(R_MIN, orbit.r * factor)); if (aim) aim.r = orbit.r; dirty = true; };
  function down(e) {
    pointers.set(e.pointerId, [e.clientX, e.clientY]);
    try { canvas.setPointerCapture(e.pointerId); } catch (error) { /* a pointer that cannot be captured still works */ }
    if (pointers.size !== 1 || !tool) return;
    const grip = tool.pick(rayAt(e));
    if (grip && tool.start(grip, ray.ray) !== false) { held = grip; canvas.style.cursor = 'grabbing'; dirty = true; }
  }
  function up(e) {
    pointers.delete(e.pointerId); pinch = 0;
    if (held) { held = null; tool.end(); canvas.style.cursor = ''; dirty = true; }
  }
  function move(e) {
    if (!pointers.has(e.pointerId)) { if (tool) canvas.style.cursor = tool.cursor(tool.pick(rayAt(e))); return; }
    const prev = pointers.get(e.pointerId); pointers.set(e.pointerId, [e.clientX, e.clientY]);
    if (held) { tool.move(rayAt(e)); dirty = true; }
    else if (pointers.size === 1 && ctx.view.kind === 'free') {
      goal = null;
      orbit.theta -= (e.clientX - prev[0]) * 0.006;
      orbit.phi = Math.min(PHI_MAX, Math.max(PHI_MIN, orbit.phi - (e.clientY - prev[1]) * 0.005));
      dirty = true;
    } else if (pointers.size === 2) {
      const pts = [...pointers.values()], d = Math.hypot(pts[0][0] - pts[1][0], pts[0][1] - pts[1][1]);
      if (pinch) zoom(pinch / d);
      pinch = d;
    }
  }
  const wheel = (e) => { e.preventDefault(); zoom(1 + e.deltaY * 0.001); };
  canvas.addEventListener('pointerdown', down); canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
  canvas.addEventListener('pointermove', move); canvas.addEventListener('wheel', wheel, { passive: false });

  // ---------- frame loop: simulations update every frame, the picture is redrawn only when something changed ----------
  const updaters = [];
  let raf = 0, last = 0, dirty = true, sized = '', framed = false;
  function fit() {
    const w = canvas.clientWidth, h = canvas.clientHeight, key = `${w}x${h}`;
    if (!w || !h || key === sized) return;
    sized = key; renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    tallFactor = w / h < 0.8 ? 1.3 : 1;
    if (!framed) { framed = true; if (tallFactor > 1 && cam.tall) { Object.assign(home, cam.tall); Object.assign(orbit, home); } }
    dirty = true;
  }
  function step(dt) {
    fit();
    if (goal) {
      const turn = Math.atan2(Math.sin(goal.theta - orbit.theta), Math.cos(goal.theta - orbit.theta)), tilt = goal.phi - orbit.phi, k = Math.min(1, dt * 9);
      if (Math.abs(turn) + Math.abs(tilt) < 0.002) { orbit.theta = goal.theta; orbit.phi = goal.phi; goal = null; }
      else { orbit.theta += turn * k; orbit.phi += tilt * k; }
      dirty = true;
    }
    if (aim) {
      const k = Math.min(1, dt * 6);
      target.lerp(aim.target, k); orbit.r += (aim.r - orbit.r) * k;
      if (target.distanceTo(aim.target) + Math.abs(aim.r - orbit.r) < 0.004) { target.copy(aim.target); orbit.r = aim.r; aim = null; }
      dirty = true;
    }
    for (const update of updaters) if (update(dt)) dirty = true;
    if (!dirty) return false;
    dirty = false; placeCamera(); renderer.render(scene, camera); placeLabels();
    return true;
  }
  function frame(now) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, Math.max(0.004, (now - last) / 1000)); last = now;
    if (!step(dt)) { lastRender = 0; return; }
    // a run of slow frames while the picture is changing steps the quality down once
    if (lastRender && now - lastRender > 34) slow++; else slow = Math.max(0, slow - 1);
    lastRender = now;
    if (slow > 45 && level < 2) { level++; slow = 0; applyQuality(); }
  }

  return {
    T, scene, camera, renderer,
    onUpdate: (fn) => updaters.push(fn),          // fn(dt) returns true when the picture must be redrawn
    onQuality(fn) { onQuality = fn; },
    setTool(next) { tool = next; },               // { pick(ray), cursor(grip), start(grip, ray), move(ray), end() }
    invalidate() { dirty = true; },
    look, label,
    step,                                         // advance and draw one frame by hand (checks)
    start() { applyQuality(); last = performance.now(); step(0.016); raf = requestAnimationFrame(frame); },
    dispose() {
      cancelAnimationFrame(raf);
      for (const { el } of labels) el.remove();
      canvas.removeEventListener('pointerdown', down); canvas.removeEventListener('pointerup', up); canvas.removeEventListener('pointercancel', up);
      canvas.removeEventListener('pointermove', move); canvas.removeEventListener('wheel', wheel);
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        for (const m of [].concat(o.material || [])) { if (m.map) m.map.dispose(); m.dispose(); }
      });
      renderer.dispose();
    },
  };
}
