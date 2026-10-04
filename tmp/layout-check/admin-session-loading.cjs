const fs = require('node:fs');
const filename = require('node:path').join(__dirname, 'admin-routes.cjs');
let source = fs.readFileSync(filename, 'utf8');
source = source.replace("if(url==='/api/auth/me') return", "if(url==='/api/auth/me') { await new Promise(r=>setTimeout(r,700)); return").replace("role:'admin'}})};", "role:'admin'}})}; }");
source = source.replace('await delay(1400);', `await delay(350);
  if(await evaluate('!!document.querySelector("input[type=password]")')) throw Error('Login flashed during session verification');
  if(!await evaluate('!!document.querySelector("[role=status]")')) throw Error('Missing session loading state');
  await delay(1200);`);
eval(source);
