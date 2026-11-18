// Makes the web copies of the bust drawings: assets/busts/*.png -> assets/img/*-360.webp and *-760.webp.
// Run from the repository root:  node tools/make-images.mjs
import sharp from 'sharp';
import { readdir, mkdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'assets/busts'), out = path.join(root, 'assets/img');
await mkdir(out, { recursive: true });

let total = 0;
for (const file of (await readdir(src)).filter((f) => f.endsWith('.png')).sort()) {
  const name = path.basename(file, '.png');
  for (const width of [360, 760]) {
    const target = path.join(out, `${name}-${width}.webp`);
    await sharp(path.join(src, file)).resize({ width }).webp({ quality: 62, alphaQuality: 80, effort: 6 }).toFile(target);
    const { size } = await stat(target); total += size;
    console.log(`${name}-${width}.webp  ${(size / 1024).toFixed(0)} KB`);
  }
}
console.log(`total ${(total / 1024).toFixed(0)} KB`);
