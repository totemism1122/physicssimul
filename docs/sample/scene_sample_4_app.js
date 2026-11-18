/* Scene-design sample v3: warm, detailed lab room lit by a grid of ceiling panels; a bar magnet that can be
   moved and turned within the upright plane that contains the coil axis; flux through the coil computed from the magnet's position and direction.
   Uses the global THREE. Lengths are in units of about 10 cm. */
(function () {
  const T = THREE;
  const canvas = document.getElementById('c');
  const renderer = new T.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFSoftShadowMap;
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;

  const scene = new T.Scene();
  scene.background = new T.Color(0xefe7d9);
  const camera = new T.PerspectiveCamera(40, 1, 0.1, 200);
  const orbit = { target: new T.Vector3(0.5, 1.75, 0), r: 12, theta: 0.45, phi: 1.2 };
  function placeCamera() {
    const s = Math.sin(orbit.phi);
    camera.position.set(orbit.target.x + orbit.r * s * Math.sin(orbit.theta),
      orbit.target.y + orbit.r * Math.cos(orbit.phi),
      orbit.target.z + orbit.r * s * Math.cos(orbit.theta));
    camera.lookAt(orbit.target);
  }

  // ---------- helpers ----------
  const mat = (color, extra) => new T.MeshStandardMaterial(Object.assign({ color, roughness: 1, metalness: 0 }, extra || {}));
  const glow = (color) => new T.MeshBasicMaterial({ color });
  function add(parent, geo, material, x, y, z, cast, receive) {
    const m = new T.Mesh(geo, material); m.position.set(x, y, z);
    m.castShadow = cast !== false; m.receiveShadow = receive !== false; parent.add(m); return m;
  }
  const box = (w, h, d) => new T.BoxGeometry(w, h, d);
  const cyl = (r1, r2, h, n) => new T.CylinderGeometry(r1, r2, h, n || 24);
  function canvasTexture(w, h, draw) {
    const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
    draw(cv.getContext('2d'), w, h);
    const tex = new T.CanvasTexture(cv); tex.colorSpace = T.SRGBColorSpace; tex.anisotropy = 8;
    return tex;
  }
  function tiled(tex, rx, ry) { tex.wrapS = tex.wrapT = T.RepeatWrapping; tex.repeat.set(rx, ry); return tex; }
  function marbleTexture() {
    return canvasTexture(1024, 1024, (g, w, h) => {
      g.fillStyle = '#f0eeea'; g.fillRect(0, 0, w, h);
      let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
      const vein = (width, alpha, color) => {
        let x = rnd() * w, y = -20, dir = Math.PI / 2 + (rnd() - 0.5) * 1.2;
        g.strokeStyle = color; g.globalAlpha = alpha; g.lineWidth = width; g.lineCap = 'round'; g.lineJoin = 'round';
        g.beginPath(); g.moveTo(x, y);
        while (y < h + 20 && x > -40 && x < w + 40) {
          dir += (rnd() - 0.5) * 0.7; dir = Math.max(0.5, Math.min(2.6, dir));
          x += Math.cos(dir) * 26; y += Math.sin(dir) * 26; g.lineTo(x, y);
        }
        g.stroke();
      };
      for (let i = 0; i < 9; i++) vein(60 + rnd() * 70, 0.05, '#9a958c');
      for (let i = 0; i < 12; i++) vein(5 + rnd() * 7, 0.17, '#8d8a84');
      for (let i = 0; i < 16; i++) vein(1 + rnd() * 1.8, 0.55, '#757470');
      g.globalAlpha = 1;
    });
  }
  function gridTexture(fill, line, lw) {
    return canvasTexture(256, 256, (g, w, h) => { g.fillStyle = fill; g.fillRect(0, 0, w, h); g.strokeStyle = line; g.lineWidth = lw; g.strokeRect(0, 0, w, h); });
  }
  function textTexture(w, h, bg, draw) { return canvasTexture(w, h, (g) => { g.fillStyle = bg; g.fillRect(0, 0, w, h); draw(g); }); }
  function letterTexture(ch) {
    return canvasTexture(128, 128, (g, w, h) => {
      g.fillStyle = '#ffffff'; g.font = '700 96px Georgia, "Times New Roman", serif';
      g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(ch, w / 2, h / 2 + 6);
    });
  }
  function dialTexture() {
    return canvasTexture(768, 512, (g, w, h) => {
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
  }
  function roundedBox(w, h, d, r) {
    const s = new T.Shape(), x = -w / 2, y = -h / 2;
    s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
    const g = new T.ExtrudeGeometry(s, { depth: d, bevelEnabled: true, bevelThickness: r * 0.5, bevelSize: r * 0.5, bevelSegments: 4, curveSegments: 10 });
    g.translate(0, 0, -d / 2); return g;
  }
  function ringGeometry(inner, outer, thick) {
    const s = new T.Shape(); s.absarc(0, 0, outer, 0, Math.PI * 2, false);
    const hole = new T.Path(); hole.absarc(0, 0, inner, 0, Math.PI * 2, true); s.holes.push(hole);
    const g = new T.ExtrudeGeometry(s, { depth: thick, bevelEnabled: false, curveSegments: 48 });
    g.rotateX(-Math.PI / 2); return g;
  }
  class Helix extends T.Curve {
    constructor(radius, turns, height) { super(); this.radius = radius; this.turns = turns; this.height = height; }
    getPoint(t, target) {
      const a = t * this.turns * Math.PI * 2;
      return (target || new T.Vector3()).set(this.radius * Math.cos(a), this.height * t, this.radius * Math.sin(a));
    }
  }

  // ---------- the laboratory ----------
  const ROOM = { w: 46, d: 46, floor: -8.5, ceil: 17 };
  const PANELS = [-13.5, -4.5, 4.5, 13.5];           // ceiling light panels on a regular grid
  (function buildRoom() {
    const room = new T.Group(); scene.add(room);
    const wall = mat(0xf1e9db), trim = mat(0xfaf6ee), birch = mat(0xe3cfad), birchDark = mat(0xc9ad84), counter = mat(0xf6f3ee);
    const steel = mat(0xb9bcc2, { roughness: 0.45, metalness: 0.6 }), dark = mat(0x4a4038), wood = mat(0xc39f72);
    const hw = ROOM.w / 2, hd = ROOM.d / 2, mid = (ROOM.floor + ROOM.ceil) / 2, hgt = ROOM.ceil - ROOM.floor;
    const floor = add(room, new T.PlaneGeometry(ROOM.w, ROOM.d), mat(0xffffff, { map: tiled(gridTexture('#d9c8ad', '#c4b294', 5), 12, 12) }), 0, ROOM.floor, 0, false); floor.rotation.x = -Math.PI / 2;
    const ceil = add(room, new T.PlaneGeometry(ROOM.w, ROOM.d), mat(0xffffff, { map: tiled(gridTexture('#f6f3ec', '#ddd8cc', 5), 10, 10) }), 0, ROOM.ceil, 0, false, false); ceil.rotation.x = Math.PI / 2;
    for (const x of PANELS) for (const z of PANELS) {
      add(room, box(4.3, 0.16, 4.3), glow(0xffffff), x, ROOM.ceil - 0.1, z, false, false);
      add(room, box(4.7, 0.1, 4.7), trim, x, ROOM.ceil - 0.04, z, false, false);
    }
    add(room, box(ROOM.w, hgt, 0.4), wall, 0, mid, -hd, false);
    add(room, box(ROOM.w, hgt, 0.4), wall, 0, mid, hd, false);
    add(room, box(0.4, hgt, ROOM.d), wall, -hw, mid, 0, false);
    add(room, box(0.4, hgt, ROOM.d), wall, hw, mid, 0, false);
    for (const [x, z, w, d] of [[0, -hd + 0.3, ROOM.w, 0.3], [0, hd - 0.3, ROOM.w, 0.3], [-hw + 0.3, 0, 0.3, ROOM.d], [hw - 0.3, 0, 0.3, ROOM.d]]) add(room, box(w, 1.0, d), birchDark, x, ROOM.floor + 0.5, z, false);

    // back wall: chalkboard with writing, tray, eraser, clock, speaker, two posters
    const board = textTexture(1024, 400, '#2f5247', (g) => {
      g.fillStyle = 'rgba(255,255,255,0.9)'; g.font = '56px Georgia, serif'; g.fillText('전자기 유도', 60, 96);
      g.font = 'italic 60px Georgia, serif'; g.fillText('V = − N  ΔΦ / Δt', 60, 200);
      g.strokeStyle = 'rgba(255,255,255,0.8)'; g.lineWidth = 4;
      for (let i = 0; i < 6; i++) { g.beginPath(); g.ellipse(720, 150 + i * 22, 90, 26, 0, 0, Math.PI * 2); g.stroke(); }
      g.strokeRect(690, 40, 60, 90); g.font = '34px Georgia, serif'; g.fillText('N', 708, 118); g.fillText('S', 710, 76);
    });
    add(room, box(22.6, 9.2, 0.3), birchDark, 0, 6.2, -hd + 0.4, false);
    add(room, box(21.6, 8.2, 0.2), mat(0xffffff, { map: board }), 0, 6.2, -hd + 0.55, false);
    add(room, box(21.6, 0.3, 0.9), wood, 0, 1.9, -hd + 0.9, false);
    add(room, box(1.4, 0.4, 0.6), mat(0x5b6b8c), -8, 2.25, -hd + 0.95, false);
    for (const [x, c] of [[-5.6, 0xffffff], [-5.2, 0xf4d35e], [-4.8, 0xe98a8a]]) add(room, cyl(0.09, 0.09, 0.8, 10), mat(c), x, 2.15, -hd + 0.95, false).rotation.z = Math.PI / 2;
    const clockTex = canvasTexture(256, 256, (g) => { g.fillStyle = '#fff'; g.beginPath(); g.arc(128, 128, 126, 0, 7); g.fill(); g.strokeStyle = '#333'; g.lineWidth = 6;
      for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; g.beginPath(); g.moveTo(128 + Math.cos(a) * 100, 128 + Math.sin(a) * 100); g.lineTo(128 + Math.cos(a) * 116, 128 + Math.sin(a) * 116); g.stroke(); }
      g.lineWidth = 8; g.beginPath(); g.moveTo(128, 128); g.lineTo(128, 52); g.moveTo(128, 128); g.lineTo(178, 150); g.stroke(); });
    add(room, cyl(1.6, 1.6, 0.3, 40), dark, 15.5, 11.5, -hd + 0.45, false).rotation.x = Math.PI / 2;
    const cf = add(room, new T.CircleGeometry(1.42, 40), mat(0xffffff, { map: clockTex }), 15.5, 11.5, -hd + 0.62, false);
    add(room, box(2.6, 1.4, 0.8), mat(0x6b6259), -15.5, 12.5, -hd + 0.7, false);
    const poster = (x, y, z, w, h, ry, bg, draw) => { const p = add(room, new T.PlaneGeometry(w, h), mat(0xffffff, { map: textTexture(512, Math.round(512 * h / w), bg, draw) }), x, y, z, false); p.rotation.y = ry; return p; };
    poster(-15.5, 6, -hd + 0.42, 5, 7, 0, '#fbf7ee', (g) => { g.fillStyle = '#3a4a66'; g.font = '700 46px Georgia, serif'; g.fillText('실험실 안전 수칙', 60, 90);
      g.font = '32px Georgia, serif'; ['1. 보안경을 쓴다', '2. 전원을 확인한다', '3. 기구를 정리한다', '4. 뛰지 않는다'].forEach((s, i) => g.fillText(s, 60, 190 + i * 90)); });
    poster(15.5, 5, -hd + 0.42, 5, 6.2, 0, '#eef4f8', (g) => { g.strokeStyle = '#3d6fb3'; g.lineWidth = 6;
      for (let k = 0; k < 5; k++) { g.beginPath(); g.ellipse(256, 300, 60 + k * 44, 110 + k * 44, 0, 0, 7); g.stroke(); }
      g.fillStyle = '#d9584a'; g.fillRect(226, 300, 60, 90); g.fillStyle = '#4f7fd0'; g.fillRect(226, 210, 60, 90); g.fillStyle = '#3a4a66'; g.font = '700 44px Georgia, serif'; g.fillText('자기장', 190, 80); });

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
    const sky = canvasTexture(64, 256, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#bfe0ff'); gr.addColorStop(0.7, '#eef7ff'); gr.addColorStop(1, '#fff6e6'); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
    for (const z of [-9, 7]) {
      add(room, box(0.3, 13.4, 11.4), trim, hw - 0.35, 6, z, false);
      add(room, box(0.2, 12.4, 10.4), new T.MeshBasicMaterial({ map: sky }), hw - 0.5, 6, z, false, false);
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
    add(room, box(2.2, 4.2, 0.1), new T.MeshBasicMaterial({ color: 0xdcecf5 }), -11, ROOM.floor + 11, hd - 0.68, false, false);
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
    room.traverse((o) => { o.castShadow = false; });   // only things on the working bench cast shadows
  })();

  // ---------- lights: a grid of ceiling panels; the four panels nearest the bench cast the shadows ----------
  scene.add(new T.HemisphereLight(0xfff6e6, 0xcdb99a, 1.25));
  for (const x of [-4.5, 4.5]) for (const z of [-4.5, 4.5]) {
    const lamp = new T.DirectionalLight(0xfff3df, 0.62);
    lamp.position.set(x, ROOM.ceil - 0.5, z); lamp.target.position.set(x * 0.25, 0, z * 0.25); scene.add(lamp.target);
    lamp.castShadow = true; lamp.shadow.mapSize.set(1024, 1024);
    Object.assign(lamp.shadow.camera, { left: -11, right: 11, top: 6, bottom: -6, near: 2, far: 40 });
    lamp.shadow.bias = -0.0005; lamp.shadow.radius = 7; scene.add(lamp);
  }
  const daylight = new T.DirectionalLight(0xfff0d8, 0.5); daylight.position.set(12, 8, 2); scene.add(daylight);

  // ---------- the bench and the apparatus ----------
  const COIL_X = -1.35, GALV_X = 2.35;
  const world = new T.Group(); scene.add(world);
  add(world, box(20, 0.5, 8), new T.MeshStandardMaterial({ map: tiled(marbleTexture(), 2, 1), roughness: 0.35 }), 0, -0.25, 0, true);
  add(world, box(19, 7.6, 7), mat(0xe3cfad), 0, -4.3, 0, true);
  add(world, box(19.2, 0.9, 7.1), mat(0xc9ad84), 0, -8.05, 0, false);
  // a few things left on the bench, away from the working area
  const steelB = mat(0xb9bcc2, { roughness: 0.45, metalness: 0.6 });
  add(world, box(1.6, 0.14, 1.0), mat(0x4a4038), -7.6, 0.07, -2.4); add(world, cyl(0.07, 0.07, 3.6, 12), steelB, -7.6, 1.9, -2.4);
  add(world, box(0.3, 0.2, 0.3), steelB, -7.6, 2.9, -2.4); add(world, cyl(0.05, 0.05, 1.4, 10), steelB, -6.9, 2.9, -2.4).rotation.z = Math.PI / 2;
  add(world, box(1.7, 1.0, 1.1), mat(0x5b6b8c), 8.6, 0.5, -2.7); add(world, box(0.7, 0.36, 0.05), glow(0xcfe9d2), 8.3, 0.62, -2.14, false, false);
  for (const [x, c] of [[8.95, 0xd9584a], [9.2, 0x333333]]) add(world, cyl(0.08, 0.08, 0.1, 12), mat(c), x, 0.4, -2.13, false).rotation.x = Math.PI / 2;
  add(world, box(2.2, 0.1, 3.0), mat(0xfdfbf3), 6.6, 0.05, 2.0).rotation.y = 0.18; add(world, cyl(0.05, 0.05, 1.6, 8), mat(0x3f6aa6), 7.9, 0.06, 2.3).rotation.set(Math.PI / 2, 0, 0.5);
  add(world, cyl(0.45, 0.5, 1.1), new T.MeshStandardMaterial({ color: 0xdff0f4, roughness: 0.2, transparent: true, opacity: 0.5 }), -6.2, 0.55, 2.4);

  const M = {
    wire: mat(0xe0935a, { roughness: 0.9 }), former: mat(0xf1eee8, { side: T.DoubleSide }), flange: mat(0xc9cedb), post: mat(0x8f96a8),
    north: mat(0xd9584a), south: mat(0x4f7fd0), body: mat(0xe4e7ee), bezel: mat(0xb9bfce), needle: mat(0xd9584a), lead: mat(0x4b5163),
  };
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

  // bar magnet: local +Y is the south end. Drag the middle to move it, drag either end to turn it.
  // It stays in the upright plane z = 0, which contains the coil axis.
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

  // galvanometer
  const galv = new T.Group(); galv.position.set(GALV_X, 0.78, 0.15); galv.rotation.x = -0.3; world.add(galv);
  const bw = 1.9, bh = 1.45, bd = 0.6;
  add(galv, roundedBox(bw, bh, bd, 0.1), M.body, 0, 0, 0);
  add(galv, roundedBox(bw - 0.18, bh - 0.18, 0.03, 0.06), M.bezel, 0, 0, bd / 2 + 0.035, false);
  add(galv, new T.PlaneGeometry(bw - 0.3, bh - 0.3), mat(0xffffff, { map: dialTexture() }), 0, 0, bd / 2 + 0.092, false);
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

  // ---------- pointer: move the magnet, turn the magnet, or look around ----------
  const ray = new T.Raycaster(), ndc = new T.Vector2(), plane = new T.Plane(), hit = new T.Vector3();
  const pointers = new Map(), grab = new T.Vector3(), cand = new T.Vector3(), tryPos = new T.Vector3(), q = new T.Quaternion(), UP = new T.Vector3(0, 1, 0), ZAXIS = new T.Vector3(0, 0, 1);
  let mode = '', pinch = 0, auto = false;
  function setRay(e) {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
  }
  let grabbedEnd = 1;
  function pick(e) {   // the middle of the magnet moves it; the outer part of either end turns it
    setRay(e);
    const h = ray.intersectObjects(halves, false)[0];
    if (!h) return '';
    const ly = magnet.worldToLocal(h.point.clone()).y;
    grabbedEnd = ly > 0 ? 1 : -1;
    return Math.abs(ly) > MAG.h * 0.27 ? 'turn' : 'move';
  }
  plane.set(new T.Vector3(0, 0, 1), 0);
  function planePoint(e) {   // point under the pointer on the plane of motion, z = 0
    setRay(e);
    if (Math.abs(ray.ray.direction.z) < 0.1) return null;   // looking along the plane: no stable point
    return ray.ray.intersectPlane(plane, hit);
  }
  const hint = document.getElementById('hint');
  canvas.addEventListener('pointerdown', (e) => {
    pointers.set(e.pointerId, [e.clientX, e.clientY]); canvas.setPointerCapture(e.pointerId);
    if (pointers.size !== 1) return;
    const what = pick(e), p = what && planePoint(e);
    if (!p) return;
    mode = what; setAuto(false); canvas.style.cursor = 'grabbing'; guide.visible = true;
    if (mode === 'move') grab.subVectors(magnet.position, p);
  });
  const release = (e) => { pointers.delete(e.pointerId); pinch = 0; if (mode) { mode = ''; canvas.style.cursor = ''; guide.visible = false; } };
  canvas.addEventListener('pointerup', release); canvas.addEventListener('pointercancel', release);
  canvas.addEventListener('pointermove', (e) => {
    if (!pointers.has(e.pointerId)) { const w = pick(e); canvas.style.cursor = w === 'move' ? 'grab' : w === 'turn' ? 'alias' : ''; return; }
    const prev = pointers.get(e.pointerId); pointers.set(e.pointerId, [e.clientX, e.clientY]);
    if (mode === 'move') {
      const p = planePoint(e); if (!p) return;
      cand.addVectors(p, grab); cand.z = 0;
      if (allowed(cand, magnet.quaternion)) magnet.position.copy(cand);
      else if (allowed(tryPos.set(magnet.position.x, cand.y, magnet.position.z), magnet.quaternion)) magnet.position.copy(tryPos);   // slide along the obstacle
      else if (allowed(tryPos.set(cand.x, magnet.position.y, cand.z), magnet.quaternion)) magnet.position.copy(tryPos);
    } else if (mode === 'turn') {
      const p = planePoint(e); if (!p) return;
      cand.subVectors(p, magnet.position); if (cand.lengthSq() < 0.01) return;
      q.setFromAxisAngle(ZAXIS, Math.atan2(cand.y * grabbedEnd, cand.x * grabbedEnd) - Math.PI / 2);   // turn about the normal of the plane
      if (allowed(magnet.position, q)) magnet.quaternion.copy(q);
    } else if (pointers.size === 1) {
      orbit.theta -= (e.clientX - prev[0]) * 0.006;
      orbit.phi = Math.min(1.5, Math.max(0.45, orbit.phi - (e.clientY - prev[1]) * 0.005));
    } else if (pointers.size === 2) {
      const pts = [...pointers.values()], d = Math.hypot(pts[0][0] - pts[1][0], pts[0][1] - pts[1][1]);
      if (pinch) orbit.r = Math.min(16, Math.max(5, orbit.r * pinch / d));
      pinch = d;
    }
  });
  canvas.addEventListener('wheel', (e) => { e.preventDefault(); orbit.r = Math.min(16, Math.max(5, orbit.r * (1 + e.deltaY * 0.001))); }, { passive: false });

  // ---------- motion: the needle follows the induced emf, minus the rate of change of flux ----------
  let last = performance.now(), lastFlux = fluxFor(magnet.position, magnet.quaternion), emf = 0, deflection = 0, phase = 0;
  const GAIN = 0.18;
  function step(now) {
    const dt = Math.min(0.05, Math.max(0.004, (now - last) / 1000)); last = now;
    if (auto && !mode) { phase += dt * 1.5; magnet.position.set(COIL_X, 2.45 + 1.35 * Math.cos(phase), 0); }
    const flux = fluxFor(magnet.position, magnet.quaternion);
    emf += (-(flux - lastFlux) / dt - emf) * Math.min(1, dt * 18); lastFlux = flux;
    deflection += (Math.max(-1, Math.min(1, emf * GAIN)) - deflection) * Math.min(1, dt * 12);
    needle.rotation.z = -deflection * 0.7;
    const w = canvas.clientWidth, h = canvas.clientHeight, pr = renderer.getPixelRatio();
    if (canvas.width !== Math.floor(w * pr) || canvas.height !== Math.floor(h * pr)) { renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
    placeCamera(); renderer.render(scene, camera);
    requestAnimationFrame(step);
  }

  // ---------- page controls ----------
  const autoBtn = document.getElementById('auto');
  function setAuto(on) {
    auto = on; autoBtn.classList.toggle('on', on);
    if (on) { magnet.quaternion.identity(); phase = 0; }
  }
  autoBtn.addEventListener('click', () => setAuto(!auto));
  document.getElementById('reset').addEventListener('click', () => { setAuto(false); magnet.position.copy(MAG.start); magnet.quaternion.identity(); });
  document.getElementById('lay').addEventListener('click', () => {
    setAuto(false);
    const upright = Math.abs(axisDir.set(0, 1, 0).applyQuaternion(magnet.quaternion).y) > 0.7;
    q.setFromAxisAngle(ZAXIS, upright ? -Math.PI / 2 : 0);
    if (!allowed(magnet.position, q)) magnet.position.y = Math.max(magnet.position.y, 3.2);
    magnet.quaternion.copy(q);
  });
  document.getElementById('field').addEventListener('change', (e) => { fieldLines.visible = e.target.checked; });
  window.__sample = {
    orbit, flux: () => fluxFor(magnet.position, magnet.quaternion), emf: () => emf, needle: () => needle.rotation.z,
    pos: () => magnet.position.toArray().map((v) => +v.toFixed(2)), up: () => +axisDir.set(0, 1, 0).applyQuaternion(magnet.quaternion).y.toFixed(2),
    screen: (obj) => { const p = (obj === 'end' ? magnet.localToWorld(new T.Vector3(0, MAG.h * 0.42, 0)) : magnet.position.clone()).project(camera), r = canvas.getBoundingClientRect(); return [(p.x + 1) / 2 * r.width, (1 - p.y) / 2 * r.height]; },
    pickAt: (x, y) => pick({ clientX: x, clientY: y }), mode: () => mode,
    fluxAt: (x, y, z, lay) => fluxFor(new T.Vector3(x, y, z), lay ? new T.Quaternion().setFromUnitVectors(UP, new T.Vector3(1, 0, 0)) : new T.Quaternion()),
  };
  requestAnimationFrame(step);
})();
