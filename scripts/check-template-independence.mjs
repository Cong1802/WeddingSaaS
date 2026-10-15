import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import path from 'node:path';
import { parseHTML } from 'linkedom';

// Validate each design as a closed resource graph. Links opened by the user are not load dependencies.
for (let number = 1; number <= 5; number++) {
  const root = path.resolve(`laravel-backend/public/templates/mau-thiep-${number}`);
  const checked = new Set();
  function inspect(file) {
    file = path.resolve(file);
    assert(file.startsWith(root + path.sep), `Cross-template dependency: ${file}`);
    assert(existsSync(file), `Missing local resource: ${file}`);
    if (checked.has(file)) return;
    checked.add(file);
    if (/\.(woff2?|ttf|otf)$/.test(file)) {
      const bytes = readFileSync(file);
      assert(bytes.length > 1000 && (['wOF2', 'wOFF', 'OTTO'].includes(bytes.toString('ascii', 0, 4)) || bytes.readUInt32BE(0) === 65536), `Invalid font: ${file}`);
    }
    if (!/\.(html|css|js|svg)$/.test(file)) return;
    const text = readFileSync(file, 'utf8');
    const references = [];
    if (file.endsWith('.html')) {
      const { document } = parseHTML(text);
      assert(document.querySelector('meta[http-equiv="Content-Security-Policy"]')?.content.includes("connect-src 'self'"));
      for (const element of document.querySelectorAll('[src],[href]')) {
        const ref = element.getAttribute('src') || element.getAttribute('href');
        if (element.tagName === 'A' && /^https?:/.test(ref)) continue;
        references.push(ref);
      }
    }
    for (const match of text.matchAll(/url\((['"]?)([^)'"\s]+)\1\)/g)) references.push(match[2]);
    for (const match of text.matchAll(/["'](\.\.?\/[^"'\s]+\.(?:css|js|png|jpg|jpeg|webp|gif|svg|mp3|woff2?|ttf|otf)(?:\?[^"']*)?)["']/g)) references.push(match[1]);
    for (const ref of references) {
      if (!ref || /^(#|data:|blob:|mailto:|tel:|javascript:)/.test(ref)) continue;
      assert(!/^https?:/.test(ref), `External load dependency: ${ref}`);
      const clean = decodeURIComponent(ref.replaceAll('&quot;', '').split('?')[0].split('#')[0]);
      assert(!clean.startsWith('/'), `Root-relative dependency: ${clean}`);
      inspect(path.resolve(path.dirname(file), clean));
    }
  }
  inspect(path.join(root, `mau-thiep-${number}.html`));
  console.log(`PASS mẫu ${number}: ${checked.size} local resources; valid fonts; no external or cross-template load dependencies.`);
}
