const fs = require('node:fs');
const sharp = require('sharp');

const source = {
  lotus: 'C:/Users/Administrator/.codex/generated_images/01a13fa2-ad2c-76c3-99f0-19c8ff0b33d2/exec-e3d25f20-863c-4577-9383-32af3c3adbc1.png',
  envelope: 'C:/Users/Administrator/.codex/generated_images/01a13fa2-ad2c-76c3-99f0-19c8ff0b33d2/exec-fc31d026-2281-40b9-81c8-9ede8d205e3a.png',
};
const folders = [
  'public/templates/mau-thiep-6/assets',
  'laravel-backend/public/templates/mau-thiep-6/assets',
];

async function main() {
  for (const folder of folders) {
    fs.mkdirSync(folder, { recursive: true });
    await sharp(source.lotus).webp({ quality: 94, alphaQuality: 100, effort: 5 }).toFile(`${folder}/lotus-betel.webp`);
    await sharp(source.envelope).webp({ quality: 94, alphaQuality: 100, effort: 5 }).toFile(`${folder}/envelope-ivory.webp`);
  }
  process.stdout.write('Converted and copied new template 6 artwork to both public roots.\n');
}

main().catch(error => {
  process.stderr.write(`${error.stack}\n`);
  process.exitCode = 1;
});
