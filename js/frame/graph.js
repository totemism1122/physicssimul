// A graph drawn straight onto a canvas: axes with their names, no numbers on the axes.
// Simulations add their traces in later stages; this stage draws the empty axes.
export function createGraph(canvas, { x = '', y = '' }) {
  const g = canvas.getContext('2d');
  function draw() {
    const w = canvas.clientWidth, h = canvas.clientHeight, ratio = Math.min(window.devicePixelRatio || 1, 2);
    if (!w || !h) return;
    canvas.width = Math.round(w * ratio); canvas.height = Math.round(h * ratio);
    g.setTransform(ratio, 0, 0, ratio, 0, 0);
    g.clearRect(0, 0, w, h);
    const size = parseFloat(getComputedStyle(canvas).fontSize) || 12, left = size * 0.9, top = size * 1.7, bottom = h - size * 1.7, mid = (top + bottom) / 2;
    g.strokeStyle = 'rgba(243, 238, 223, 0.55)'; g.lineWidth = 1.2;
    g.beginPath(); g.moveTo(left, top); g.lineTo(left, bottom); g.moveTo(left, mid); g.lineTo(w - 4, mid); g.stroke();
    g.fillStyle = 'rgba(243, 238, 223, 0.7)';
    g.font = `${size}px ${getComputedStyle(canvas).fontFamily}`;
    g.textBaseline = 'middle';
    g.textAlign = 'left'; g.fillText(y, 0, size * 0.75);
    g.textAlign = 'right'; g.fillText(x, w - 2, h - size * 0.75);
  }
  const watch = new ResizeObserver(draw);
  watch.observe(canvas);
  draw();
  return { draw, stop: () => watch.disconnect() };
}
