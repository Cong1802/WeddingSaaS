from pathlib import Path
p=Path('src/templates/passportTemplate.js')
s=p.read_text(encoding='utf-8-sig')
s=s.replace("  const month =", """  const images = { heroImage: '#IMAGE3', groomPhoto: '#passport-IMAGE49', bridePhoto: '#passport-IMAGE47' };
  Object.entries(images).forEach(([field, selector]) => {
    if (!data[field]) return;
    doc.querySelectorAll(`${selector} .ladi-image-background`).forEach(element => {
      element.style.backgroundImage = `url(${JSON.stringify(data[field])})`;
    });
  });
  const month =""")
p.write_text(s,encoding='utf-8')
# Remove publisher rules for deleted elements, including QR images.
import re
for root in ['public/templates/passport','laravel-backend/public/templates/passport']:
 p=Path(root)/'index.html';s=p.read_text(encoding='utf-8')
 ids=set(re.findall(r'\bid="([^"]+)"',s))
 def clean_style(m):
  def rule(r):
   selectors,body=r.group(1),r.group(2)
   parts=[v for v in selectors.split(',') if all(i in ids for i in re.findall(r'#([A-Za-z][\w-]*)',v))]
   return ','.join(parts)+'{'+body+'}' if parts else ''
  return '<style'+m.group(1)+'>'+re.sub(r'([^{}]+)\{([^{}]*)\}',rule,m.group(2))+'</style>'
 s=re.sub(r'<style([^>]*)>(.*?)</style>',clean_style,s,flags=re.S)
 p.write_text(s,encoding='utf-8')
