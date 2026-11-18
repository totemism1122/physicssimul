// The clock behind the play/pause button. It runs only while an automatic demonstration is playing;
// what the user does by hand in the scene does not depend on it.
export function createClock(onTick) {
  let last = 0, frame = 0;
  const clock = {
    t: 0, running: false, rate: 1,
    start() { if (clock.running) return; clock.running = true; last = performance.now(); frame = requestAnimationFrame(tick); },
    pause() { clock.running = false; cancelAnimationFrame(frame); },
    reset() { clock.pause(); clock.t = 0; onTick(clock.t, 0); },
    step(dt) { clock.pause(); clock.t += dt; onTick(clock.t, dt); },
  };
  function tick(now) {
    const dt = Math.min(0.25, (now - last) / 1000) * clock.rate; last = now;   // long gaps (a hidden tab) are not counted
    clock.t += dt; onTick(clock.t, dt);
    if (clock.running) frame = requestAnimationFrame(tick);
  }
  return clock;
}
