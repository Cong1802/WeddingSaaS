from pathlib import Path
p=Path('tmp/prune-and-deploy-independent-templates.mjs');s=p.read_text(encoding='utf-8-sig');s=s.replace("const clean=decodeURIComponent(ref.split('?')[0].split('#')[0]);", "const clean=decodeURIComponent(ref.replaceAll('&quot;','').split('?')[0].split('#')[0]);");p.write_text(s,encoding='utf-8')
