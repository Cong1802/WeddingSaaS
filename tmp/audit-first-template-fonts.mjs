import {readFileSync} from 'node:fs';const h=readFileSync('public/templates/mau-thiep-1/mau-thiep-1.html','utf8');console.log([...new Set(h.match(/font-family:[^;}]+/g))].slice(0,22));
