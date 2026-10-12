import sharp from 'sharp';
import { readFile, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';

const components = ['LandingPage', 'HeroSection', 'WhyUsSection', 'HowItWorksSection', 'FeaturesSection', 'PricingSection', 'TestimonialsSection', 'FaqSection', 'SiteFooter', 'MobileLandingMenu', 'TemplateGallery'];
const converted = new Set();
let before = 0;
let after = 0;
for (const component of components) {
  const file = `src/components/${component}.jsx`;
  let source = await readFile(file, 'utf8');
  const imports = [...source.matchAll(/from ['"]([^'"]+\.(?:png|webp))['"]/g)];
  for (const [, relative] of imports) {
    const original = path.resolve(path.dirname(file), relative.replace(/\.webp$/, '.png'));
    const output = original.replace(/\.png$/, '.webp');
    if (!converted.has(original)) {
      const logo = path.basename(original) === 'logo.png';
      await sharp(original).resize({ width: logo ? 320 : 1536, withoutEnlargement: true }).webp({ quality: 82, effort: 6 }).toFile(output);
      before += (await stat(original)).size;
      after += (await stat(output)).size;
      converted.add(original);
    }
    source = source.replaceAll(relative, relative.replace(/\.png$/, '.webp'));
  }
  await writeFile(file, source);
}
await sharp('images/section-01-hero/hero-reference-product.png').resize({ width: 1200 }).jpeg({ quality: 85, mozjpeg: true }).toFile('laravel-backend/public/seo/thiep-cuoi-online.jpg');
console.log(`Optimized ${converted.size} landing assets: ${(before / 1e6).toFixed(2)} MB -> ${(after / 1e6).toFixed(2)} MB`);
