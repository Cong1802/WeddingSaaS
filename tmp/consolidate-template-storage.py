from pathlib import Path
import shutil,re
workspace=Path.cwd().resolve()
def checked(path):
 p=path.resolve()
 if not p.is_relative_to(workspace): raise RuntimeError(f'Outside workspace: {p}')
 return p
for root in [workspace/'public',workspace/'laravel-backend/public']:
 base=checked(root/'templates');base.mkdir(exist_ok=True)
 # Move each existing design package into one numbered folder.
 one=checked(base/'mau-thiep-1');one.mkdir(exist_ok=True)
 shutil.move(str(checked(root/'template.html')),str(one/'mau-thiep-1.html'))
 two=checked(base/'mau-thiep-2');shutil.move(str(checked(root/'https___www.lovecard.click_thiepso48')),str(two))
 old=checked(two/'www.lovecard.click/thiepso48.html');new=two/'mau-thiep-2.html'
 s=old.read_text(encoding='utf-8');s=s.replace('../','./').replace('href="thiepso48.html"','href="mau-thiep-2.html"');new.write_text(s,encoding='utf-8');old.unlink();(two/'www.lovecard.click').rmdir()
 for number,folder,filename in [(3,'minimalism_red','minimalism_red.html'),(4,'passport','index.html'),(5,'pearl','pearl.html')]:
  target=checked(base/f'mau-thiep-{number}');shutil.move(str(checked(base/folder)),str(target));shutil.move(str(checked(target/filename)),str(target/f'mau-thiep-{number}.html'))
 # Normalize associated resource folders without breaking relative paths.
 for number,oldfolder in [(3,'minimalism_red_files'),(5,'pearl_files')]:
  target=base/f'mau-thiep-{number}';original=checked(target/oldfolder)
  if original.exists():
   shutil.move(str(original),str(checked(target/'assets')))
   p=target/f'mau-thiep-{number}.html';p.write_text(p.read_text(encoding='utf-8').replace(oldfolder+'/','assets/'),encoding='utf-8')
print('Moved all 5 designs into numbered templates folders in source and backend public roots.')
