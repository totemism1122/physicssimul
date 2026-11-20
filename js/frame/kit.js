// Small helpers for building 3D scenes in the house style: matt materials, simple shapes, textures drawn
// on a canvas. Lengths are in units of about 10 cm. Taken from the approved scene sample (docs/sample).
export function createKit(T) {
  const made = new Map();
  // matt material; the same colour and options always give the same material, so static parts can be merged
  const mat = (color, extra) => {
    if (extra && (extra.map || extra.side)) return new T.MeshStandardMaterial(Object.assign({ color, roughness: 1, metalness: 0 }, extra));
    const key = color + JSON.stringify(extra || {});
    if (!made.has(key)) made.set(key, new T.MeshStandardMaterial(Object.assign({ color, roughness: 1, metalness: 0 }, extra || {})));
    return made.get(key);
  };
  const glow = (color) => { const key = `glow${color}`; if (!made.has(key)) made.set(key, new T.MeshBasicMaterial({ color })); return made.get(key); };
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
  const textTexture = (w, h, bg, draw) => canvasTexture(w, h, (g) => { g.fillStyle = bg; g.fillRect(0, 0, w, h); draw(g, w, h); });
  const gridTexture = (fill, line, lw) => canvasTexture(256, 256, (g, w, h) => { g.fillStyle = fill; g.fillRect(0, 0, w, h); g.strokeStyle = line; g.lineWidth = lw; g.strokeRect(0, 0, w, h); });
  const letterTexture = (ch) => canvasTexture(128, 128, (g, w, h) => {
    g.fillStyle = '#ffffff'; g.font = '700 96px Georgia, "Times New Roman", serif';
    g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(ch, w / 2, h / 2 + 6);
  });
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

  // An arrow for marking a direction in the scene (a current, a field, a force). It starts at its position and
  // points along +Y until aimed. It is drawn over everything else, like a mark on a diagram, unless overlay is false.
  const UP = new T.Vector3(0, 1, 0);
  function arrow(color, thick = 0.05, overlay = true) {
    const material = new T.MeshBasicMaterial({ color, transparent: true, depthTest: !overlay, depthWrite: false });
    const g = new T.Group(), head = thick * 6;
    const shaft = new T.Mesh(cyl(thick, thick, 1, 14), material), tip = new T.Mesh(new T.ConeGeometry(thick * 2.6, head, 18), material);
    if (overlay) shaft.renderOrder = tip.renderOrder = 10;
    g.add(shaft, tip);
    g.material = material;
    g.setLength = (length) => {
      const body = Math.max(0.001, length - head);
      shaft.scale.y = body; shaft.position.y = body / 2; tip.position.y = body + head / 2;
    };
    g.aim = (direction) => g.quaternion.setFromUnitVectors(UP, direction);   // direction: a unit vector
    g.setLength(1);
    return g;
  }

  // Replaces the many small meshes of a static group by one mesh per material, so a detailed room costs
  // a few dozen draw calls instead of several hundred.
  function mergeStatic(group) {
    group.updateMatrixWorld(true);
    const buckets = new Map();
    group.traverse((o) => {
      if (!o.isMesh) return;
      const key = `${o.material.uuid}/${o.receiveShadow}`;
      if (!buckets.has(key)) buckets.set(key, { material: o.material, receive: o.receiveShadow, parts: [] });
      const g = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone();
      g.applyMatrix4(o.matrixWorld);
      buckets.get(key).parts.push(g);
    });
    const merged = new T.Group();
    for (const { material, receive, parts } of buckets.values()) {
      const count = parts.reduce((sum, g) => sum + g.attributes.position.count, 0);
      const position = new Float32Array(count * 3), normal = new Float32Array(count * 3), uv = new Float32Array(count * 2);
      let at = 0;
      for (const g of parts) {
        position.set(g.attributes.position.array, at * 3); normal.set(g.attributes.normal.array, at * 3);
        if (g.attributes.uv) uv.set(g.attributes.uv.array, at * 2);
        at += g.attributes.position.count; g.dispose();
      }
      const geometry = new T.BufferGeometry();
      geometry.setAttribute('position', new T.BufferAttribute(position, 3));
      geometry.setAttribute('normal', new T.BufferAttribute(normal, 3));
      geometry.setAttribute('uv', new T.BufferAttribute(uv, 2));
      const mesh = new T.Mesh(geometry, material); mesh.castShadow = false; mesh.receiveShadow = receive;
      merged.add(mesh);
    }
    return merged;
  }

  return { mat, glow, add, box, cyl, canvasTexture, tiled, textTexture, gridTexture, letterTexture, marbleTexture, roundedBox, ringGeometry, Helix, arrow, mergeStatic };
}
