// Optimiza (redimensiona + comprime) las fotos usadas en el sitio, EN SU LUGAR.
// Mismos nombres de archivo -> cero cambios de código. Reversible con git.
// Uso: node scripts/optimize-photos.mjs
import sharp from 'sharp';
import { readFileSync, writeFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const pub = path.join(root, '../public');

// [ruta relativa, ancho máximo, calidad]
const jobs = [
  ['assets/founders/founder-erwing.jpg', 1200, 82],
  ['assets/founders/founder-richard.jpg', 1200, 82],
  ['assets/founders/founder-roberto.jpg', 1200, 82],
  ['assets/founders/founders-team.jpg', 1600, 82],
  ['assets/fotos/futbol-1.jpg', 1600, 80],
  ['assets/fotos/volley-arena-1.jpg', 1600, 80],
  ['assets/fotos/volley-arena-2.jpg', 1600, 80],
  ['assets/fotos/volley-piso-1.jpg', 1600, 80],
  ['assets/fotos/volley-piso-2.jpg', 1600, 80],
];

let before = 0, after = 0;
for (const [rel, width, quality] of jobs) {
  const file = path.join(pub, rel);
  const b0 = statSync(file).size;
  const buf = await sharp(readFileSync(file))
    .rotate() // respeta orientación EXIF
    .resize({ width, withoutEnlargement: true })
    .jpeg({ quality, mozjpeg: true })
    .toBuffer();
  writeFileSync(file, buf);
  const b1 = buf.length;
  before += b0; after += b1;
  console.log(`${rel.padEnd(40)} ${(b0/1024|0)}KB -> ${(b1/1024|0)}KB`);
}
console.log(`\nTOTAL: ${(before/1024/1024).toFixed(2)}MB -> ${(after/1024/1024).toFixed(2)}MB`);
