// Procesa las imágenes finales (generadas con IA) a los formatos/medidas del sitio.
//  - Hero  -> public/assets/fotos/hero-ezplay.webp  (fondo del hero)
//  - Share -> public/og-ezplay.jpg                  (Open Graph / WhatsApp, 1200x630)
// Uso: node scripts/process-images.mjs
import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const DL = '/Users/erwing/Downloads';
const heroSrc = path.join(DL, 'ChatGPT Image 1 jul 2026, 02_24_43 p.m..png');
const shareSrc = path.join(DL, 'ChatGPT Image 1 jul 2026, 02_24_15 p.m..png');

// Hero: ancho 1920 (nítido en desktop), WebP liviano
await sharp(heroSrc)
  .resize({ width: 1920 })
  .webp({ quality: 82 })
  .toFile(path.join(root, '../public/assets/fotos/hero-ezplay.webp'));

// Compartir (OG): 1200x630 exacto, JPG (máxima compatibilidad con redes)
await sharp(shareSrc)
  .resize(1200, 630, { fit: 'cover' })
  .jpeg({ quality: 86 })
  .toFile(path.join(root, '../public/og-ezplay.jpg'));

console.log('Imágenes procesadas: hero-ezplay.webp + og-ezplay.jpg');
