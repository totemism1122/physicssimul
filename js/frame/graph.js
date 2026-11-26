// Graphs drawn straight onto a canvas: axes with their names, no numbers on the axes.
// A trace is the record of one quantity against time; the simulation adds samples to it and every graph
// that shows it redraws itself. Pressing a graph marks the nearest moment and writes the values there.
// A chart holds the numbers of a bar chart (a few bars in each of a few groups).

const INK = 'rgba(243, 238, 223, 0.7)', AXIS = 'rgba(243, 238, 223, 0.55)', LINE = '#e3c26b';

// window: the most seconds shown across the graph.  range: the least value at the top edge (the bottom edge is -range).
// A graph always shows the whole of its record: the time axis starts short and widens up to the window, and the
// value axis widens to hold the largest value on show. Both widen in steps, so the picture does not creep.
// read(value): how a value is written when a point of the graph is pressed.
export function createTrace({ window = 8, range = 1, read = (value) => value.toFixed(1) } = {}) {
  const trace = {
    window, range, read, t: [], v: [], gap: [], stamp: 0,
    // gap: true starts a new stretch (the recording was standing still before this sample)
    add(t, v, gap = false) {
      trace.t.push(t); trace.v.push(v); trace.gap.push(gap); trace.stamp++;
      while (trace.t.length > 2 && trace.t[1] < t - window) { trace.t.shift(); trace.v.shift(); trace.gap.shift(); }
    },
    clear() { trace.t.length = trace.v.length = trace.gap.length = 0; trace.stamp++; },
  };
  return trace;
}

// names: one for each bar of a group.  colors: likewise.  groups: the names of the groups.
// signed: bars may point down from a middle line.  range: the least value at the top edge.
// title: what the chart shows, written at its top right (used when several charts share a panel).
export function createChart({ names, colors, groups, title = '', signed = true, range = 1, read = (value) => value.toFixed(1) }) {
  const chart = {
    names, colors, groups, title, signed, range, read, stamp: 0,
    values: groups.map(() => null),                      // one list of numbers for each group, or null while it is not known
    set(group, numbers) { chart.values[group] = numbers; chart.stamp++; },
    clear() { chart.values = groups.map(() => null); chart.stamp++; },
  };
  return chart;
}

const ROUND = [1, 1.5, 2, 3, 5, 7.5];
function roomFor(most, least) {   // the smallest step of the range that holds the value with a little to spare
  let range = least;
  for (let k = 1; range < most * 1.08; k++) range = least * ROUND[k % 6] * 10 ** Math.floor(k / 6);
  return range;
}
function roundRect(g, x, y, w, h, r) {   // a path, for browsers without roundRect
  const c = Math.min(r, w / 2, h / 2);
  g.beginPath(); g.moveTo(x + c, y); g.arcTo(x + w, y, x + w, y + h, c); g.arcTo(x + w, y + h, x, y + h, c);
  g.arcTo(x, y + h, x, y, c); g.arcTo(x, y, x + w, y, c); g.closePath();
}
// Sizes the canvas for sharp drawing and calls paint(g, w, h, size) whenever key() gives a new answer.
function keepDrawn(canvas, key, paint) {
  const g = canvas.getContext('2d');
  let drawn = '', frame = 0;
  function draw() {
    const w = canvas.clientWidth, h = canvas.clientHeight, ratio = Math.min(window.devicePixelRatio || 1, 2);
    if (!w || !h) return;
    canvas.width = Math.round(w * ratio); canvas.height = Math.round(h * ratio);
    g.setTransform(ratio, 0, 0, ratio, 0, 0); g.clearRect(0, 0, w, h);
    const style = getComputedStyle(canvas), size = parseFloat(style.fontSize) || 12;
    g.font = `${size}px ${style.fontFamily}`; g.textBaseline = 'middle';
    paint(g, w, h, size);
  }
  function tick() {
    frame = requestAnimationFrame(tick);
    const now = `${canvas.clientWidth}x${canvas.clientHeight}/${key()}`;
    if (now !== drawn) { drawn = now; draw(); }
  }
  tick();
  return { stop: () => cancelAnimationFrame(frame) };
}

// item: { x: name of the time axis, plots: [{ y: name, trace: id }] }. Several plots share the time axis, one above
// the other. xUnit: the unit of that axis where a record is kept against something other than time ('m'; 's' if left out).
// A plot may hold several lines instead of one: { y, lines: [{ trace, color, name }] }.
// span: [from, to]. The horizontal axis then shows just that stretch, whatever the record: for a quantity that may go
// back and forth or stand still, like the volume of a gas. The record is drawn as a path from sample to sample, the
// area is counted with its sign along that path (negative where it runs backwards) and is always that of the whole
// record, and a marked point is written with its place on the axis.
// area: a unit (for a force against time, 'N·s'). The plot is then shaded between each line and the time axis and the
// area is written under it, with its sign: that of the whole record on show, or (without span) up to the marked moment.
// dots: true. The samples of the plot are drawn as separate points, not joined: for values tried one by one.
// floor: true. For a quantity that is never below nought: the axis lies along the bottom and the plot takes the whole height.
// marks: [[value, name], …]. Numbers on an axis, each with a faint line across the plot: on a plot for its value axis,
// on the item for the horizontal axis (written under the last plot; one that would run into the axis's name is left out).
// A line may have dots: true of its own. A sample may be NaN: a place of the record that is empty (a line breaks there).
// What read() gives as '' is left out of the writing at a marked point.
export function createGraph(canvas, item, traces) {
  const none = createTrace();   // a plot without a record shows its axes only
  const plots = (item.plots || [{ y: item.y }]).map((plot) => ({
    y: plot.y, area: plot.area, dots: plot.dots, floor: plot.floor, marks: plot.marks, lines: (plot.lines || [{ trace: plot.trace, color: LINE }]).map((line) => ({ ...line, trace: traces[line.trace] || none })),
  }));
  const first = plots[0].lines[0].trace;
  let mark = null;       // the moment marked by pressing the graph (a time of the record), or null
  let scale = null;      // how the time axis was last drawn: { left, right, start, span, end }
  function note(g, text, x, y, size, limit) {   // a small dark plate with writing, kept inside the picture (limit: its right edge)
    const width = g.measureText(text).width + size * 0.9, height = size * 1.5;
    const px = Math.max(1, Math.min(limit - width - 1, x + size * 0.6)), py = Math.max(1, y - height - size * 0.3);
    g.fillStyle = 'rgba(12, 15, 24, 0.92)'; roundRect(g, px, py, width, height, height / 2); g.fill();
    g.fillStyle = '#f3eedf'; g.textAlign = 'left'; g.fillText(text, px + size * 0.45, py + height / 2 + 0.5);
  }
  function paint(g, w, h, size) {
    const left = size * 0.9, right = w - 4, each = (h - size * 1.5) / plots.length, notes = [];
    scale = null;
    plots.forEach(({ y, lines, area, dots, floor, marks }, i) => {
      const top = i * each + size * 1.7, bottom = (i + 1) * each - size * 0.2, mid = floor ? bottom : (top + bottom) / 2, half = floor ? bottom - top : (bottom - top) / 2;
      g.strokeStyle = AXIS; g.lineWidth = 1.2; g.setLineDash([]);
      g.beginPath(); g.moveTo(left, top); g.lineTo(left, bottom); g.moveTo(left, mid); g.lineTo(right, mid); g.stroke();
      g.fillStyle = INK; g.textAlign = 'left'; g.fillText(y, 0, i * each + size * 0.75);
      let nameX = g.measureText(y).width + size * 0.9;   // the names of the lines, each in its own colour
      for (const line of lines) if (line.name) { g.fillStyle = line.color; g.fillText(line.name, nameX, i * each + size * 0.75); nameX += g.measureText(line.name).width + size * 0.7; }
      const lead = lines[0].trace, n = lead.t.length;
      if (!n) return;
      const fixed = item.span, length = lead.t[n - 1] - lead.t[0];
      const span = fixed ? fixed[1] - fixed[0] : [lead.window / 16, lead.window / 4].find((one) => one >= length) || lead.window;
      const start = fixed ? fixed[0] : Math.max(lead.t[0], lead.t[n - 1] - span), end = fixed ? fixed[1] : lead.t[n - 1];
      let most = 0;
      for (const { trace } of lines) for (let k = 0; k < trace.t.length; k++) if (trace.t[k] >= start && Number.isFinite(trace.v[k])) most = Math.max(most, Math.abs(trace.v[k]));
      const range = roomFor(most, lead.range);
      const px = (t) => left + (t - start) / span * (right - left), py = (v) => mid - v / range * half;
      if (i === 0) scale = { left, right, start, span, end };
      if (marks || item.marks) {
        const across = item.marks || [], under = i === plots.length - 1 ? w - g.measureText(item.x).width - size * 0.8 : 0;
        g.strokeStyle = 'rgba(243, 238, 223, 0.16)'; g.lineWidth = 1; g.setLineDash([2, 3]);
        g.beginPath();
        for (const [value] of marks || []) { g.moveTo(left, py(value)); g.lineTo(right, py(value)); }
        for (const [value] of across) { g.moveTo(px(value), top); g.lineTo(px(value), bottom); }
        g.stroke();
        const font = g.font;
        g.font = font.replace(/[\d.]+px/, `${size * 0.88}px`); g.fillStyle = 'rgba(243, 238, 223, 0.5)'; g.textAlign = 'left';
        for (const [value, name] of marks || []) g.fillText(name, left + size * 0.35, py(value) - size * 0.55);
        g.textAlign = 'center';
        for (const [value, name] of across) if (px(value) + g.measureText(name).width / 2 < under) g.fillText(name, px(value), h - size * 0.75);
        g.font = font;
      }
      g.save(); g.beginPath(); g.rect(left, top - size * 0.4, right - left, bottom - top + size * 0.8); g.clip();
      g.strokeStyle = 'rgba(243, 238, 223, 0.3)'; g.lineWidth = 1; g.setLineDash([2, 4]);
      g.beginPath();
      for (let k = 1; k < n; k++) if (lead.gap[k] && lead.t[k] > start) { g.moveTo(px(lead.t[k]), top); g.lineTo(px(lead.t[k]), bottom); }
      g.stroke();
      const until = !fixed && mark !== null && mark >= start && mark <= end ? mark : Infinity;   // areas are taken up to here
      if (area) for (const { trace, color } of lines) {
        let last = -1;
        g.beginPath();
        for (let k = 0; k < trace.t.length && trace.t[k] <= until + 1e-9; k++) { if (last < 0) g.moveTo(px(trace.t[k]), mid); g.lineTo(px(trace.t[k]), py(trace.v[k])); last = k; }
        if (last < 1) continue;
        g.lineTo(px(trace.t[last]), mid); g.closePath(); g.globalAlpha = 0.22; g.fillStyle = color; g.fill(); g.globalAlpha = 1;
      }
      g.lineWidth = 2; g.lineJoin = 'round'; g.setLineDash([]);
      for (const { trace, color, dots: own } of lines) {
        if (dots || own) { g.fillStyle = color; for (let k = 0; k < trace.t.length; k++) { g.beginPath(); g.arc(px(trace.t[k]), py(trace.v[k]), 2.6, 0, Math.PI * 2); g.fill(); } continue; }
        g.strokeStyle = color; g.beginPath();
        for (let k = 0; k < trace.t.length; k++) { if (k && Number.isFinite(trace.v[k - 1])) g.lineTo(px(trace.t[k]), py(trace.v[k])); else g.moveTo(px(trace.t[k]), py(trace.v[k])); }
        g.stroke();
      }
      g.restore();
      if (area) {   // by the trapezium rule over the samples
        const sums = lines.filter(({ trace }) => trace.t.length > 1).map(({ trace, name }) => {
          let sum = 0;
          for (let k = 1; k < trace.t.length && trace.t[k] <= until + 1e-9; k++) if (trace.t[k - 1] >= start - 1e-9) sum += (trace.v[k] + trace.v[k - 1]) / 2 * (trace.t[k] - trace.t[k - 1]);
          const size2 = Math.abs(sum).toFixed(2);
          return (name ? name + ' ' : '') + (Number(size2) === 0 ? size2 : (sum > 0 ? '+' : '−') + size2);
        });
        const last = i === plots.length - 1;   // under the last plot the writing shares the row of the time axis's name
        g.fillStyle = INK; g.textAlign = last ? 'left' : 'right';
        g.fillText('넓이 ' + sums.join('  ') + ' ' + area, last ? left : right, (i + 1) * each + size * 0.75);
      }
      if (mark === null || mark < start || mark > end) return;
      let k = 0;                                   // the sample nearest the marked moment
      for (let j = 1; j < n; j++) if (Math.abs(lead.t[j] - mark) < Math.abs(lead.t[k] - mark)) k = j;
      let from = k;                                // time is counted from where this stretch of the record began
      while (from > 0 && !lead.gap[from]) from--;
      const x = px(lead.t[k]), at = (trace) => trace.v[Math.min(k, trace.v.length - 1)];
      g.strokeStyle = 'rgba(243, 238, 223, 0.5)'; g.lineWidth = 1;
      g.beginPath(); g.moveTo(x, top); g.lineTo(x, bottom); g.stroke();
      g.fillStyle = '#f3eedf';
      for (const { trace } of lines) { g.beginPath(); g.arc(x, py(at(trace)), 3.5, 0, Math.PI * 2); g.fill(); }
      const text = lines.map(({ trace, name }) => { const value = trace.read(at(trace)); return value && `${name ? `${name} ` : ''}${value}`; }).filter(Boolean).join('   ');
      if (text) notes.push(() => note(g, text, x, lines.length > 1 ? top + size * 1.6 : py(at(lead)), size, w));
      if (i === plots.length - 1) notes.push(() => note(g, `${(fixed ? lead.t[k] : lead.t[k] - lead.t[from]).toFixed(2)} ${item.xUnit || 's'}`, x, bottom + size * 1.9, size, w - g.measureText(item.x).width - size * 0.8));
    });
    for (const write of notes) write();            // the writing goes on top of every plot
    g.fillStyle = INK; g.textAlign = 'right'; g.fillText(item.x, w - 2, h - size * 0.75);
  }
  const stamps = () => plots.map((plot) => plot.lines.map((line) => line.trace.stamp).join('.')).join('/');
  const kept = keepDrawn(canvas, () => { if (mark !== null && !first.t.length) mark = null; return `${mark}/${stamps()}`; }, paint);

  // Pressing or dragging marks a moment. A press on the mark itself, without dragging, takes it away.
  let pressed = false, dragged = false, onMark = false;
  function timeAt(e) {   // the moment under the pointer, kept within the record
    const r = canvas.getBoundingClientRect(), t = scale.start + (e.clientX - r.left - scale.left) / (scale.right - scale.left) * scale.span;
    return Math.max(scale.start, Math.min(scale.end, t));
  }
  function down(e) {
    if (!scale) return;
    const t = timeAt(e);
    onMark = mark !== null && Math.abs(t - mark) < scale.span * 0.03;
    pressed = true; dragged = false; mark = t;
    try { canvas.setPointerCapture(e.pointerId); } catch (error) { /* works without capture too */ }
  }
  function move(e) { if (pressed && scale) { dragged = true; mark = timeAt(e); } }
  function up() { if (pressed && onMark && !dragged) mark = null; pressed = false; }
  canvas.addEventListener('pointerdown', down); canvas.addEventListener('pointermove', move);
  canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
  return kept;
}

// A bar chart: the groups stand side by side, each with one bar for every name. The value is written at the end of each bar.
// charts: one chart, or several drawn one above the other to the same scale.
export function createBars(canvas, charts) {
  const list = [].concat(charts);
  function paint(g, w, h, size) {
    let most = 0;
    for (const chart of list) for (const numbers of chart.values) if (numbers) for (const value of numbers) most = Math.max(most, Math.abs(value));
    const range = roomFor(most, list[0].range), each = h / list.length, left = size * 0.9, right = w - 4;
    let nameX = 0;   // the names of the bars, each in its own colour; set closer together when there are too many for the line
    g.textAlign = 'left';
    const written = list[0].names.reduce((sum, name) => sum + g.measureText(name).width, 0), between = Math.min(size * 0.8, Math.max(size * 0.25, (w - written) / Math.max(1, list[0].names.length - 1)));
    list[0].names.forEach((name, i) => { g.fillStyle = list[0].colors[i]; g.fillText(name, nameX, size * 0.75); nameX += g.measureText(name).width + between; });
    list.forEach((chart, n) => {
      const top = each * n + size * 2.6, bottom = each * (n + 1) - size * 1.9;
      const zero = chart.signed ? (top + bottom) / 2 : bottom, reach = (chart.signed ? (bottom - top) / 2 : bottom - top) - size * 1.2;
      g.fillStyle = INK; g.textAlign = 'right'; g.fillText(chart.title, right, each * n + size * 0.75);
      g.strokeStyle = AXIS; g.lineWidth = 1.2;
      g.beginPath(); g.moveTo(left, top - size); g.lineTo(left, bottom); g.moveTo(left, zero); g.lineTo(right, zero); g.stroke();
      const room = (right - left) / chart.groups.length, bar = Math.min(size * 2.6, room * 0.8 / chart.names.length);
      chart.groups.forEach((group, k) => {
        const mid = left + room * (k + 0.5), numbers = chart.values[k];
        g.fillStyle = INK; g.textAlign = 'center'; g.fillText(group, mid, each * (n + 1) - size * 0.75);
        if (!numbers) return;
        // the bars stand a little apart, and further where the numbers written over them would run together
        const wide = Math.max(...numbers.map((value) => g.measureText(chart.read(value)).width));
        const step = Math.min(room / numbers.length, Math.max(bar * 1.12, wide + size * 0.35));
        numbers.forEach((value, i) => {
          const x = mid + (i - (numbers.length - 1) / 2) * step, tall = value / range * reach;
          g.fillStyle = chart.colors[i]; g.fillRect(x - bar / 2, Math.min(zero, zero - tall), bar, Math.max(1.5, Math.abs(tall)));
          g.fillStyle = '#f3eedf'; g.fillText(chart.read(value), x, zero - tall + (tall < 0 ? size * 0.8 : -size * 0.7));
        });
      });
    });
  }
  return keepDrawn(canvas, () => list.map((chart) => chart.stamp).join(), paint);
}
