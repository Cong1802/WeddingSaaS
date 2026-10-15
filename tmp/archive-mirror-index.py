from pathlib import Path
workspace=Path.cwd().resolve()
for root in ['public','laravel-backend/public']:
 p=(workspace/root/'templates/mau-thiep-2/index.html').resolve()
 target=p.with_name('mirror-index.txt')
 if not p.is_relative_to(workspace) or not target.is_relative_to(workspace):raise RuntimeError('Outside workspace')
 p.rename(target)
print('Archived crawler index as text so only the five actual designs appear in the dropdown.')
