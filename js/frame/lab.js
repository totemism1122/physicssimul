// The laboratory every 3D simulation stands in: a bright, warm room lit by a grid of ceiling panels, with a
// marble bench in the middle. Taken from the approved scene sample (docs/sample/scene_sample_4_app.js).
// board(g): draws the simulation's own writing on the chalkboard (a 1024 x 400 canvas).
export function buildLab(T, kit, scene, board) {
  const { mat, glow, add, box, cyl, canvasTexture, tiled, textTexture, gridTexture, marbleTexture, mergeStatic } = kit;
  scene.background = new T.Color(0xefe7d9);

  const ROOM = { w: 46, d: 46, floor: -8.5, ceil: 17 };
  const PANELS = [-13.5, -4.5, 4.5, 13.5];           // ceiling light panels on a regular grid
  const room = new T.Group();
  const wall = mat(0xf1e9db), trim = mat(0xfaf6ee), birch = mat(0xe3cfad), birchDark = mat(0xc9ad84), counter = mat(0xf6f3ee);
  const steel = mat(0xb9bcc2, { roughness: 0.45, metalness: 0.6 }), dark = mat(0x4a4038), wood = mat(0xc39f72);
  const hw = ROOM.w / 2, hd = ROOM.d / 2, mid = (ROOM.floor + ROOM.ceil) / 2, hgt = ROOM.ceil - ROOM.floor;
  const floor = add(room, new T.PlaneGeometry(ROOM.w, ROOM.d), mat(0xffffff, { map: tiled(gridTexture('#d9c8ad', '#c4b294', 5), 12, 12) }), 0, ROOM.floor, 0, false); floor.rotation.x = -Math.PI / 2;
  const ceil = add(room, new T.PlaneGeometry(ROOM.w, ROOM.d), mat(0xffffff, { map: tiled(gridTexture('#f6f3ec', '#ddd8cc', 5), 10, 10) }), 0, ROOM.ceil, 0, false, false); ceil.rotation.x = Math.PI / 2;
  const lampGlow = glow(0xffffff);
  for (const x of PANELS) for (const z of PANELS) {
    add(room, box(4.3, 0.16, 4.3), lampGlow, x, ROOM.ceil - 0.1, z, false, false);
    add(room, box(4.7, 0.1, 4.7), trim, x, ROOM.ceil - 0.04, z, false, false);
  }
  add(room, box(ROOM.w, hgt, 0.4), wall, 0, mid, -hd, false);
  add(room, box(ROOM.w, hgt, 0.4), wall, 0, mid, hd, false);
  add(room, box(0.4, hgt, ROOM.d), wall, -hw, mid, 0, false);
  add(room, box(0.4, hgt, ROOM.d), wall, hw, mid, 0, false);
  for (const [x, z, w, d] of [[0, -hd + 0.3, ROOM.w, 0.3], [0, hd - 0.3, ROOM.w, 0.3], [-hw + 0.3, 0, 0.3, ROOM.d], [hw - 0.3, 0, 0.3, ROOM.d]]) add(room, box(w, 1.0, d), birchDark, x, ROOM.floor + 0.5, z, false);

  // back wall: chalkboard with writing, tray, eraser, clock, speaker, two posters
  add(room, box(22.6, 9.2, 0.3), birchDark, 0, 6.2, -hd + 0.4, false);
  add(room, box(21.6, 8.2, 0.2), mat(0xffffff, { map: textTexture(1024, 400, '#2f5247', board || (() => {})) }), 0, 6.2, -hd + 0.55, false);
  add(room, box(21.6, 0.3, 0.9), wood, 0, 1.9, -hd + 0.9, false);
  add(room, box(1.4, 0.4, 0.6), mat(0x5b6b8c), -8, 2.25, -hd + 0.95, false);
  for (const [x, c] of [[-5.6, 0xffffff], [-5.2, 0xf4d35e], [-4.8, 0xe98a8a]]) add(room, cyl(0.09, 0.09, 0.8, 10), mat(c), x, 2.15, -hd + 0.95, false).rotation.z = Math.PI / 2;
  const clockTex = canvasTexture(256, 256, (g) => {
    g.fillStyle = '#fff'; g.beginPath(); g.arc(128, 128, 126, 0, 7); g.fill(); g.strokeStyle = '#333'; g.lineWidth = 6;
    for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; g.beginPath(); g.moveTo(128 + Math.cos(a) * 100, 128 + Math.sin(a) * 100); g.lineTo(128 + Math.cos(a) * 116, 128 + Math.sin(a) * 116); g.stroke(); }
    g.lineWidth = 8; g.beginPath(); g.moveTo(128, 128); g.lineTo(128, 52); g.moveTo(128, 128); g.lineTo(178, 150); g.stroke();
  });
  add(room, cyl(1.6, 1.6, 0.3, 40), dark, 15.5, 11.5, -hd + 0.45, false).rotation.x = Math.PI / 2;
  add(room, new T.CircleGeometry(1.42, 40), mat(0xffffff, { map: clockTex }), 15.5, 11.5, -hd + 0.62, false);
  add(room, box(2.6, 1.4, 0.8), mat(0x6b6259), -15.5, 12.5, -hd + 0.7, false);
  const poster = (x, y, z, w, h, ry, bg, draw) => { const p = add(room, new T.PlaneGeometry(w, h), mat(0xffffff, { map: textTexture(512, Math.round(512 * h / w), bg, draw) }), x, y, z, false); p.rotation.y = ry; return p; };
  poster(-15.5, 6, -hd + 0.42, 5, 7, 0, '#fbf7ee', (g) => {
    g.fillStyle = '#3a4a66'; g.font = '700 46px Georgia, serif'; g.fillText('실험실 안전 수칙', 60, 90);
    g.font = '32px Georgia, serif'; ['1. 보안경을 쓴다', '2. 전원을 확인한다', '3. 기구를 정리한다', '4. 뛰지 않는다'].forEach((s, i) => g.fillText(s, 60, 190 + i * 90));
  });
  poster(15.5, 5, -hd + 0.42, 5, 6.2, 0, '#eef4f8', (g) => {
    g.strokeStyle = '#3d6fb3'; g.lineWidth = 6;
    for (let k = 0; k < 5; k++) { g.beginPath(); g.ellipse(256, 300, 60 + k * 44, 110 + k * 44, 0, 0, 7); g.stroke(); }
    g.fillStyle = '#d9584a'; g.fillRect(226, 300, 60, 90); g.fillStyle = '#4f7fd0'; g.fillRect(226, 210, 60, 90); g.fillStyle = '#3a4a66'; g.font = '700 44px Georgia, serif'; g.fillText('자기장', 190, 80);
  });

  // left wall: base cabinets with doors and handles, a sink with a tap, shelves with glassware and boxes
  const lx = -hw + 2.1;
  add(room, box(3.6, 6.2, 30), birch, lx, ROOM.floor + 3.1, -2, true);
  add(room, box(4.0, 0.4, 30.6), counter, lx + 0.1, ROOM.floor + 6.4, -2, true);
  for (let i = 0; i < 10; i++) {
    const z = -15.5 + i * 3;
    add(room, box(0.1, 5.2, 2.7), mat(0xedddbf), lx + 1.84, ROOM.floor + 3.2, z, false);
    add(room, box(0.14, 1.1, 0.12), steel, lx + 1.95, ROOM.floor + 4.9, z + (i % 2 ? -1.0 : 1.0), false);
  }
  add(room, box(2.4, 0.5, 3.6), steel, lx, ROOM.floor + 6.42, 6, false);
  add(room, box(2.0, 0.1, 3.2), mat(0x8e9299, { roughness: 0.5, metalness: 0.5 }), lx, ROOM.floor + 6.3, 6, false);
  add(room, cyl(0.12, 0.12, 1.8, 12), steel, lx - 1.2, ROOM.floor + 7.5, 6, false);
  add(room, cyl(0.1, 0.1, 1.2, 12), steel, lx - 0.65, ROOM.floor + 8.35, 6, false).rotation.z = Math.PI / 2;
  const glass = new T.MeshStandardMaterial({ color: 0xdff0f4, roughness: 0.2, transparent: true, opacity: 0.5 });
  const colours = [0x6f9bd1, 0xe09a63, 0x7fb89a, 0xdcc06a, 0xb193cf];
  [3.4, 8.2, 12.6].forEach((y, row) => {
    add(room, box(2.6, 0.25, 28), wood, -hw + 1.6, y, -2, true);
    for (const z of [-15.6, -6.4, 2.6, 11.6]) add(room, box(2.2, 0.9, 0.2), birchDark, -hw + 1.4, y - 0.55, z, false);
    for (let i = 0; i < 10; i++) {
      const z = -14.5 + i * 2.8, kind = (i + row) % 4, sx = -hw + 1.7;
      if (kind === 0) { add(room, cyl(0.5, 0.6, 1.5), glass, sx, y + 0.9, z); add(room, cyl(0.47, 0.57, 0.6), mat(colours[(i + row) % 5]), sx, y + 0.45, z, false); }
      else if (kind === 1) { add(room, box(1.5, 1.2, 1.9), mat(colours[(i * 2 + row) % 5]), sx, y + 0.72, z); add(room, box(0.05, 0.5, 1.1), mat(0xffffff), sx + 0.78, y + 0.75, z, false); }
      else if (kind === 2) { add(room, cyl(0.2, 0.75, 1.3), glass, sx, y + 0.78, z); add(room, cyl(0.2, 0.2, 0.7), glass, sx, y + 1.75, z); add(room, cyl(0.19, 0.7, 0.5), mat(colours[(i + 2) % 5]), sx, y + 0.38, z, false); }
      else { for (let k = 0; k < 3; k++) add(room, box(1.7, 0.32, 1.3), mat([0xa9443b, 0x3f6aa6, 0x4f8a63][k]), sx, y + 0.29 + k * 0.34, z + (k - 1) * 0.08); }
    }
  });

  // right wall: two tall windows with sky, mullions, sills and half-raised blinds
  const sky = new T.MeshBasicMaterial({ map: canvasTexture(64, 256, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#bfe0ff'); gr.addColorStop(0.7, '#eef7ff'); gr.addColorStop(1, '#fff6e6'); g.fillStyle = gr; g.fillRect(0, 0, w, h); }) });
  for (const z of [-9, 7]) {
    add(room, box(0.3, 13.4, 11.4), trim, hw - 0.35, 6, z, false);
    add(room, box(0.2, 12.4, 10.4), sky, hw - 0.5, 6, z, false, false);
    for (const dz of [-3.5, 0, 3.5]) add(room, box(0.25, 12.4, 0.25), trim, hw - 0.55, 6, z + dz, false);
    add(room, box(0.25, 0.25, 10.4), trim, hw - 0.55, 6, z, false);
    add(room, box(1.3, 0.3, 11.8), trim, hw - 0.85, -0.25, z, false);
    for (let k = 0; k < 9; k++) add(room, box(0.5, 0.06, 10.6), mat(0xf3ece0), hw - 0.8, 12.1 - k * 0.42, z, false);
    add(room, cyl(0.6, 0.45, 1.0), mat(0xc8805a), hw - 0.9, 0.4, z - 3.6); add(room, new T.SphereGeometry(0.95, 14, 10), mat(0x6fa873), hw - 0.9, 1.6, z - 3.6);
  }
  add(room, box(0.8, 5.5, 8), mat(0xf4f1ec), hw - 0.6, ROOM.floor + 3.2, -1, false);
  for (let k = 0; k < 14; k++) add(room, box(0.9, 4.9, 0.12), mat(0xddd7cc), hw - 0.6, ROOM.floor + 3.2, -4.6 + k * 0.55, false);

  // front wall: door with a window and handle, notice board with papers, fire extinguisher, switch
  add(room, box(7.2, 15.2, 0.3), birchDark, -11, ROOM.floor + 7.6, hd - 0.4, false);
  add(room, box(6.4, 14.4, 0.2), mat(0xd9b98c), -11, ROOM.floor + 7.3, hd - 0.55, false);
  add(room, box(2.2, 4.2, 0.1), glow(0xdcecf5), -11, ROOM.floor + 11, hd - 0.68, false, false);
  add(room, cyl(0.16, 0.16, 1.2, 12), steel, -8.7, ROOM.floor + 6.8, hd - 0.85, false).rotation.z = Math.PI / 2;
  add(room, box(12.4, 7.4, 0.3), birchDark, 8, 6, hd - 0.4, false); add(room, box(11.8, 6.8, 0.1), mat(0xc79a67), 8, 6, hd - 0.58, false);
  [[4.2, 7.4, 0xfdfbf3], [7.4, 7.0, 0xdfeaf5], [10.6, 7.5, 0xf6e1dc], [4.8, 4.6, 0xe3f0e0], [8.2, 4.4, 0xfdf3c8], [11.2, 4.7, 0xfdfbf3]].forEach(([x, y, c]) => add(room, box(2.5, 2.1, 0.05), mat(c), x, y, hd - 0.66, false));
  add(room, cyl(0.55, 0.55, 2.6, 16), mat(0xc8392f), -5.6, ROOM.floor + 3.4, hd - 1.0); add(room, cyl(0.16, 0.16, 0.6, 10), dark, -5.6, ROOM.floor + 5.0, hd - 1.0);
  add(room, box(0.9, 1.3, 0.12), trim, -6.6, ROOM.floor + 12, hd - 0.48, false);

  // other benches with stools, set on the same grid as real lab rows
  const benchTop = mat(0xf2efe9, { roughness: 0.4 });
  for (const [bx, bz] of [[-2, -14], [-2, 14]]) {
    add(room, box(18, 0.5, 6), benchTop, bx, -0.25, bz, true);
    add(room, box(17, 7.8, 5), birch, bx, ROOM.floor + 4.1, bz, true);
    for (let i = 0; i < 5; i++) { add(room, box(3.1, 6.4, 0.1), mat(0xedddbf), bx - 6.8 + i * 3.4, ROOM.floor + 4.2, bz + (bz < 0 ? 2.56 : -2.56), false); add(room, box(1.0, 0.14, 0.12), steel, bx - 6.8 + i * 3.4, ROOM.floor + 6.8, bz + (bz < 0 ? 2.66 : -2.66), false); }
    for (const x of [-7, -2, 3]) { const sz = bz + (bz < 0 ? 4.4 : -4.4); add(room, cyl(1.1, 1.1, 0.3), dark, bx + x + 2, ROOM.floor + 5.2, sz); add(room, cyl(0.12, 0.12, 5.2, 10), steel, bx + x + 2, ROOM.floor + 2.6, sz); add(room, cyl(1.0, 1.0, 0.15), steel, bx + x + 2, ROOM.floor + 0.1, sz); }
    add(room, box(2.2, 1.6, 1.6), mat(0x5b6b8c), bx - 5, 0.8, bz); add(room, cyl(0.5, 0.6, 1.4), glass, bx + 4, 0.7, bz + 0.6); add(room, cyl(0.07, 0.07, 3.4, 10), steel, bx + 1, 1.7, bz - 0.8); add(room, box(1.6, 0.2, 1.1), dark, bx + 1, 0.1, bz - 0.8);
  }
  scene.add(mergeStatic(room));   // the room casts no shadows; only things on the working bench do

  // lights: a grid of ceiling panels; the four panels nearest the bench cast the shadows
  scene.add(new T.HemisphereLight(0xfff6e6, 0xcdb99a, 1.25));
  const lamps = [];
  for (const x of [-4.5, 4.5]) for (const z of [-4.5, 4.5]) {
    const lamp = new T.DirectionalLight(0xfff3df, 0.62);
    lamp.position.set(x, ROOM.ceil - 0.5, z); lamp.target.position.set(x * 0.25, 0, z * 0.25); scene.add(lamp.target);
    lamp.castShadow = true; lamp.shadow.mapSize.set(1024, 1024);
    Object.assign(lamp.shadow.camera, { left: -11, right: 11, top: 6, bottom: -6, near: 2, far: 40 });
    lamp.shadow.bias = -0.0005; lamp.shadow.radius = 7; scene.add(lamp); lamps.push(lamp);
  }
  const daylight = new T.DirectionalLight(0xfff0d8, 0.5); daylight.position.set(12, 8, 2); scene.add(daylight);

  // the working bench, and a few things left on it away from the working area
  const world = new T.Group(); scene.add(world);
  add(world, box(20, 0.5, 8), new T.MeshStandardMaterial({ map: tiled(marbleTexture(), 2, 1), roughness: 0.35 }), 0, -0.25, 0, true);
  add(world, box(19, 7.6, 7), birch, 0, -4.3, 0, true);
  add(world, box(19.2, 0.9, 7.1), birchDark, 0, -8.05, 0, false);
  // world.userData.things: those things, for an experiment that needs the whole bench and puts them away
  const things = new T.Group(); world.add(things); world.userData.things = things;
  add(things, box(1.6, 0.14, 1.0), dark, -7.6, 0.07, -2.4); add(things, cyl(0.07, 0.07, 3.6, 12), steel, -7.6, 1.9, -2.4);
  add(things, box(0.3, 0.2, 0.3), steel, -7.6, 2.9, -2.4); add(things, cyl(0.05, 0.05, 1.4, 10), steel, -6.9, 2.9, -2.4).rotation.z = Math.PI / 2;
  add(things, box(1.7, 1.0, 1.1), mat(0x5b6b8c), 8.6, 0.5, -2.7); add(things, box(0.7, 0.36, 0.05), glow(0xcfe9d2), 8.3, 0.62, -2.14, false, false);
  for (const [x, c] of [[8.95, 0xd9584a], [9.2, 0x333333]]) add(things, cyl(0.08, 0.08, 0.1, 12), mat(c), x, 0.4, -2.13, false).rotation.x = Math.PI / 2;
  add(things, box(2.2, 0.1, 3.0), mat(0xfdfbf3), 6.6, 0.05, 2.0).rotation.y = 0.18; add(things, cyl(0.05, 0.05, 1.6, 8), mat(0x3f6aa6), 7.9, 0.06, 2.3).rotation.set(Math.PI / 2, 0, 0.5);
  add(things, cyl(0.45, 0.5, 1.1), glass, -6.2, 0.55, 2.4);

  // Shadows are the costly part on phones. level 0: all four lamps cast; 1: one lamp casts; 2: none.
  function setShadowLevel(level) {
    lamps.forEach((lamp, i) => { lamp.castShadow = level === 0 || (level === 1 && i === 3); });
    scene.traverse((o) => { if (o.material) o.material.needsUpdate = true; });
  }
  return { world, setShadowLevel };
}
