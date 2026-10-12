import { build } from 'vite';
import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { DOMParser } from 'linkedom';

await build();
await build({
  build: {
    ssr: 'src/landing-ssr.jsx',
    outDir: 'tmp/seo-ssr',
    emptyOutDir: false,
    rollupOptions: { output: { entryFileNames: 'landing.mjs' } },
  },
});
const { render } = await import(pathToFileURL(path.resolve('tmp/seo-ssr/landing.mjs')));
globalThis.DOMParser = class extends DOMParser {
  parseFromString(source, type) {
    return super.parseFromString(`<!doctype html><html><head></head><body>${source}</body></html>`, type);
  }
};
const template = await readFile('laravel-backend/public/dist/index.html', 'utf8');
await writeFile('laravel-backend/public/dist/landing.html', template.replace('<div id="root"></div>', () => `<div id="root">${render()}</div>`));
console.log('Landing HTML generated with visible content for crawlers.');
