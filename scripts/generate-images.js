import sharp from 'sharp';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(__dirname, '../public');

async function generate() {
  // OG Card — render SVG base then composite portrait on the right
  const ogSvg = readFileSync(resolve(publicDir, 'og-card.svg'));
  const ogBase = await sharp(ogSvg).resize(1200, 630).png().toBuffer();

  // Portrait: fill the right half of the card, grayscale, faded left edge
  const portraitHeight = 630;
  const portraitResized = await sharp(resolve(publicDir, 'images/portrait.webp'))
    .resize({ height: portraitHeight, withoutEnlargement: true })
    .grayscale()
    .modulate({ brightness: 0.8 })
    .png()
    .toBuffer();

  const portraitMeta = await sharp(portraitResized).metadata();
  const pW = portraitMeta.width;
  const pH = portraitMeta.height;

  // Remove white background pixels
  const { data: rawPortrait, info } = await sharp(portraitResized)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < rawPortrait.length; i += 4) {
    const r = rawPortrait[i], g = rawPortrait[i + 1], b = rawPortrait[i + 2];
    if (r > 220 && g > 220 && b > 220) {
      rawPortrait[i + 3] = 0;
    } else if (r > 180 && g > 180 && b > 180) {
      const avg = (r + g + b) / 3;
      rawPortrait[i + 3] = Math.round(255 * (1 - (avg - 180) / 75));
    }
  }

  const portraitNoWhite = await sharp(rawPortrait, {
    raw: { width: info.width, height: info.height, channels: 4 }
  }).png().toBuffer();

  // Fade mask: transparent left, opaque right — blends portrait into dark bg
  const fadeSvg = Buffer.from(`<svg width="${pW}" height="${pH}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="fade" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="black"/>
        <stop offset="35%" stop-color="white"/>
        <stop offset="100%" stop-color="white"/>
      </linearGradient>
      <linearGradient id="fadeBottom" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="white"/>
        <stop offset="80%" stop-color="white"/>
        <stop offset="100%" stop-color="black"/>
      </linearGradient>
    </defs>
    <rect width="${pW}" height="${pH}" fill="url(#fade)"/>
    <rect width="${pW}" height="${pH}" fill="url(#fadeBottom)" style="mix-blend-mode:multiply"/>
  </svg>`);
  const fadeMask = await sharp(fadeSvg).resize(pW, pH).png().toBuffer();

  const portraitFaded = await sharp(portraitNoWhite)
    .composite([{ input: fadeMask, blend: 'dest-in' }])
    .ensureAlpha()
    .png()
    .toBuffer();

  // Position portrait on right half, vertically centered
  const portraitLeft = 1200 - pW + 20;
  const portraitTop = Math.round((630 - pH) / 2);

  await sharp(ogBase)
    .composite([{
      input: portraitFaded,
      top: portraitTop,
      left: portraitLeft,
      blend: 'over',
    }])
    .png({ quality: 90 })
    .toFile(resolve(publicDir, 'og-card.png'));
  console.log('Generated og-card.png');

  // Favicon
  const faviconSvg = readFileSync(resolve(publicDir, 'favicon.svg'));
  await sharp(faviconSvg)
    .resize(32, 32)
    .png()
    .toFile(resolve(publicDir, 'favicon-32.png'));
  console.log('Generated favicon-32.png');
}

generate().catch(console.error);
