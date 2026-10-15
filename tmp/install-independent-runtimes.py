from pathlib import Path
for n in range(1,6):
 root=Path(f'public/templates/mau-thiep-{n}')
 if n<3:(root/'assets/standalone.js').write_text(Path('tmp/standalone-ladi-runtime.js').read_text(encoding='utf-8-sig'),encoding='utf-8')
 if n!=4:(root/'assets/local-interactions.js').write_text(Path('tmp/local-template-interactions.js').read_text(encoding='utf-8-sig'),encoding='utf-8')
 p=root/f'mau-thiep-{n}.html';s=p.read_text(encoding='utf-8').replace('<html ',f'<html data-design-number="{n}" ',1);p.write_text(s,encoding='utf-8')
p=Path('public/templates/mau-thiep-3/opening.js');s=p.read_text(encoding='utf-8').replace('gate.remove(); window.scrollTo(0, 0);',"gate.remove(); document.dispatchEvent(new CustomEvent('invitation-opened')); window.scrollTo(0, 0);");p.write_text(s,encoding='utf-8')
