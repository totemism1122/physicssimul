// The starry background behind the first screen and the unit list. Drawn once per size, no animation.
export function startSky(canvas) {
  const g = canvas.getContext('2d');
  function draw() {
    const w = window.innerWidth, h = window.innerHeight, ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * ratio); canvas.height = Math.round(h * ratio);
    g.setTransform(ratio, 0, 0, ratio, 0, 0);
    g.clearRect(0, 0, w, h);
    let seed = 20261118;                         // fixed seed: the same sky every time
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const count = Math.round(Math.min(420, Math.max(90, w * h / 5200)));
    const scale = Math.max(0.8, Math.min(1.5, Math.min(w, h) / 900));
    g.fillStyle = '#f3eedf';
    for (let i = 0; i < count; i++) {
      const x = rnd() * w, y = rnd() * h, big = rnd() < 0.12;
      g.globalAlpha = big ? 0.55 + rnd() * 0.4 : 0.18 + rnd() * 0.45;
      g.beginPath(); g.arc(x, y, (big ? 1.0 + rnd() * 0.7 : 0.4 + rnd() * 0.5) * scale, 0, Math.PI * 2); g.fill();
    }
    g.globalAlpha = 1;
  }
  let timer = 0;
  window.addEventListener('resize', () => { clearTimeout(timer); timer = setTimeout(draw, 120); });
  draw();
}
