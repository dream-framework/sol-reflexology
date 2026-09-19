import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const OUT_DIR = '/home/z/my-project/public/images';

// Only valid sizes that worked: must be 512-2880, divisible by 32, max 2^22 px
// Verified working: 864x1152, 1344x768, 1024x1024
const jobs: { name: string; prompt: string; size: string }[] = [
  {
    name: 'hero',
    size: '1344x768',
    prompt:
      'Cinematic wide photograph of a serene reflexology spa sanctuary at golden hour, soft warm sunlight filtering through linen curtains, smooth river stones and fresh green botanical leaves arranged on a dark walnut wood surface, a single brass bowl with water and floating gardenia flowers, deep forest green and warm sand color palette, candlelight, atmospheric mist, ultra-detailed editorial photography, shallow depth of field, luxury wellness aesthetic, calm meditative mood, no people, no text',
  },
  {
    name: 'texture',
    size: '1344x768',
    prompt:
      'Abstract minimalist background of layered sage green and warm sand colored organic shapes, subtle paper grain texture, soft gradient from deep forest green at top to cream at bottom, faint botanical line drawings, atmospheric and meditative, luxury spa branding background, no text, no people',
  },
  {
    name: 'booking-bg',
    size: '1344x768',
    prompt:
      'Moody atmospheric photograph of a luxury reflexology treatment room interior, dark forest green wall, warm sand linen drapes, single brass pendant light casting golden glow, wooden reflexology bench with folded cream towel, smooth river stones on floor, soft shadows, no people, editorial architectural photography, deep luxury wellness aesthetic, no text',
  },
  {
    name: 'cta-bg',
    size: '1344x768',
    prompt:
      'Overhead flat lay photograph on a dark walnut wood surface, arranged botanical composition with sage leaves, eucalyptus sprigs, smooth river stones, brass singing bowl, dried lavender, soft cream linen, warm candlelight, earthy zen luxury spa still life, editorial photography, deep shadows with golden highlights, no text, no people',
  },
  {
    name: 'og-cover',
    size: '1344x768',
    prompt:
      'Elegant minimalist composition: a single smooth dark river stone resting on a cream linen surface with a fresh sage leaf curled on top, soft golden side light, deep forest green shadow background, luxury spa branding hero image, fine art photography, ultra-detailed, meditative mood, no text, no people',
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
    await sleep(3000); // pace between jobs
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
