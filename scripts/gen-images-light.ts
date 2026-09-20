import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const OUT_DIR = '/home/z/my-project/public/images';

// Light, airy, plant-filled spa aesthetic — bright daylight, soft cream + sage tones
const jobs: { name: string; prompt: string; size: string }[] = [
  {
    name: 'hero-light',
    size: '1344x768',
    prompt:
      'Bright airy photograph of a calm plant-filled reflexology studio at morning, soft natural daylight streaming through tall windows, warm cream walls, lush green ferns and potted plants in foreground, a polished light wood treatment bench with folded linen towel, smooth pale river stones, single white orchid, sheer linen curtains gently moving, soft sage green and warm cream color palette, high-key lighting, editorial wellness photography, ultra-detailed, serene and luxurious, no people, no text',
  },
  {
    name: 'philosophy-light',
    size: '864x1152',
    prompt:
      'Bright intimate close-up photograph of gentle hands performing foot reflexology on a clean cream linen surface, soft natural daylight from a side window, warm sand and pale sage green tones, fresh fern leaves softly blurred in background, single white orchid, soft shadows with delicate highlights, fine art editorial photography, ultra-detailed skin texture, airy and grounding mood, plant-filled zen luxury spa aesthetic, no text',
  },
  {
    name: 'texture-light',
    size: '1344x768',
    prompt:
      'Abstract minimalist background of layered pale sage green and warm cream organic shapes, subtle paper grain texture, soft gradient from cream at top to muted sage at bottom, faint botanical line drawings of leaves, atmospheric and meditative, light luxury spa branding background, bright and airy, no text, no people',
  },
  {
    name: 'booking-bg-light',
    size: '1344x768',
    prompt:
      'Bright atmospheric photograph of a light-filled reflexology treatment room interior, warm cream plaster wall, tall window with sheer linen drapes diffusing morning light, pale oak wood treatment bench with folded cream towel, smooth pale river stones on floor, lush potted fern, soft sage green accents, airy and serene, no people, editorial architectural photography, light luxury wellness aesthetic, no text',
  },
  {
    name: 'cta-bg-light',
    size: '1344x768',
    prompt:
      'Overhead flat lay photograph on a pale cream linen surface, arranged botanical composition with soft sage leaves, eucalyptus sprigs, smooth pale river stones, single white ceramic bowl, dried lavender, fresh white orchid, soft natural daylight, earthy light zen luxury spa still life, editorial photography, bright airy mood with soft shadows, no text, no people',
  },
  {
    name: 'og-cover-light',
    size: '1344x768',
    prompt:
      'Elegant minimalist composition: a single smooth pale river stone resting on a cream linen surface with a fresh sage leaf curled on top, soft natural side light, warm cream and pale sage color palette, light luxury spa branding hero image, fine art photography, ultra-detailed, bright meditative mood, no text, no people',
  },
];

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const toRun = jobs.filter(j => !fs.existsSync(path.join(OUT_DIR, `${j.name}.png`)));
  if (toRun.length === 0) {
    console.log('All images already exist. Nothing to do.');
    return;
  }

  console.log(`Generating ${toRun.length} image(s)...`);
  const zai = await ZAI.create();
  const failed: string[] = [];

  for (const job of toRun) {
    let lastErr: any;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`→ [${attempt}] ${job.name} (${job.size})`);
        const t0 = Date.now();
        const resp = await zai.images.generations.create({
          prompt: job.prompt,
          size: job.size as any,
        });
        const b64 = resp.data[0].base64;
        const buf = Buffer.from(b64, 'base64');
        const outPath = path.join(OUT_DIR, `${job.name}.png`);
        fs.writeFileSync(outPath, buf);
        const dt = ((Date.now() - t0) / 1000).toFixed(1);
        console.log(`  ✓ ${job.name} → ${outPath} (${(buf.length / 1024).toFixed(0)} KB, ${dt}s)`);
        lastErr = null;
        break;
      } catch (e: any) {
        lastErr = e;
        console.error(`  ✗ attempt ${attempt} failed: ${e?.message?.slice(0, 120) || e}`);
        if (String(e?.message || '').includes('429')) {
          console.log('  rate limited, waiting 25s...');
          await sleep(25000);
        } else {
          await sleep(4000);
        }
      }
    }
    if (lastErr) failed.push(job.name);
    await sleep(3000);
  }

  if (failed.length) {
    console.log(`\n${failed.length} image(s) still failed: ${failed.join(', ')}`);
    process.exit(1);
  }
  console.log('\nAll target images generated successfully.');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
