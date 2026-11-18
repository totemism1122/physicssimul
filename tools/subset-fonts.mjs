// Keeps only the characters the site actually uses, so the Korean font stays small.
// Run from the repository root after any change to on-screen text:  node tools/subset-fonts.mjs
// Sources: tools/src-fonts/NotoSerifKR-{Regular,Bold}.otf (not committed; from github.com/notofonts/noto-cjk,
// Serif/SubsetOTF/KR) and assets/fonts/IMFellEnglishSC.ttf.
import subsetFont from 'subset-font';
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function textFiles(dir) {
  const found = [];
  for (const entry of await readdir(path.join(root, dir), { withFileTypes: true })) {
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) { if (entry.name !== 'vendor') found.push(...await textFiles(rel)); }
    else if (/\.(js|css|html)$/.test(entry.name)) found.push(rel);
  }
  return found;
}

const ascii = Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i)).join('');
const used = new Set(ascii);
for (const file of ['index.html', ...await textFiles('css'), ...await textFiles('js')]) {
  for (const ch of await readFile(path.join(root, file), 'utf8')) if (ch.codePointAt(0) > 126) used.add(ch);
}
const all = [...used].join('');
console.log(`${used.size} characters (${[...used].filter((c) => c >= '가' && c <= '힣').length} Hangul)`);

const jobs = [
  ['tools/src-fonts/NotoSerifKR-Regular.otf', 'assets/fonts/NotoSerifKR-Regular-sub.woff2', all],
  ['tools/src-fonts/NotoSerifKR-Bold.otf', 'assets/fonts/NotoSerifKR-Bold-sub.woff2', all],
  ['assets/fonts/IMFellEnglishSC.ttf', 'assets/fonts/IMFellEnglishSC-sub.woff2', ascii],
];
for (const [from, to, text] of jobs) {
  const out = await subsetFont(await readFile(path.join(root, from)), text, { targetFormat: 'woff2' });
  await writeFile(path.join(root, to), out);
  console.log(`${to}  ${(out.length / 1024).toFixed(0)} KB`);
}
