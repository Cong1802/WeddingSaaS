const sharp = require('sharp');

const source = 'tmp/template6-page.png';
const outputs = [
  'public/templates/mau-thiep-6/assets/thumbnail.webp',
  'laravel-backend/public/templates/mau-thiep-6/assets/thumbnail.webp',
];

async function main() {
  const metadata = await sharp(source).metadata();
  const height = Math.min(900, metadata.height);
  for (const output of outputs) {
    await sharp(source)
      .extract({ left: 0, top: 0, width: Math.min(390, metadata.width), height })
      .resize({ width: 500 })
      .webp({ quality: 88 })
      .toFile(output);
  }
  process.stdout.write(`Updated template 6 preview from ${metadata.width}x${metadata.height} page capture.\n`);
}

main().catch(error => {
  process.stderr.write(`${error.stack}\n`);
  process.exitCode = 1;
});
