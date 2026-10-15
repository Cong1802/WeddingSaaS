from pathlib import Path
mapping={
'/template.html':'/templates/mau-thiep-1/mau-thiep-1.html',
'/https___www.lovecard.click_thiepso48/www.lovecard.click/thiepso48.html':'/templates/mau-thiep-2/mau-thiep-2.html',
'/templates/minimalism_red/minimalism_red.html':'/templates/mau-thiep-3/mau-thiep-3.html',
'/templates/passport/index.html':'/templates/mau-thiep-4/mau-thiep-4.html',
'/templates/pearl/pearl.html':'/templates/mau-thiep-5/mau-thiep-5.html',
}
for root in [Path('src'),Path('laravel-backend/app'),Path('laravel-backend/tests')]:
 for p in root.rglob('*'):
  if p.suffix not in ['.jsx','.js','.php','.css']:continue
  s=p.read_text(encoding='utf-8-sig');old=s
  for a,b in mapping.items():s=s.replace(a,b)
  s=s.replace('/templates/minimalism_red/minimalism_red_files/','/templates/mau-thiep-3/assets/').replace('/templates/pearl/pearl_files/','/templates/mau-thiep-5/assets/').replace('/templates/passport/assets/','/templates/mau-thiep-4/assets/')
  if s!=old:p.write_text(s,encoding='utf-8')
p=Path('laravel-backend/app/Http/Controllers/AdminController.php');s=p.read_text(encoding='utf-8');start=s.index('        $designs = [',s.index('private function templateDesigns'));end=s.index('        $directory =',start);s=s[:start]+'        $designs = [];\n'+s[end:];s=s.replace("'~(?:^|/)[^/]+_files/|(?:^|/)assets/|(?:^|/)maps\\.html$~i'", "'~(?:^|/)[^/]+_files/|(?:^|/)assets/|(?:^|/)maps\\.html$~i'");p.write_text(s,encoding='utf-8')
p=Path('laravel-backend/routes/web.php');s=p.read_text(encoding='utf-8');redirects='\n'.join(f"Route::redirect('{a}', '{b}', 302);" for a,b in mapping.items());s=s.replace("Route::get('/sitemap.xml'",redirects+"\n\nRoute::get('/sitemap.xml'",1);p.write_text(s,encoding='utf-8')
# Migrate stored URLs, including uploaded thumbnails that already use local design assets.
entries=',\n'.join(f"            '{a}' => '{b}'" for a,b in mapping.items())
php='''<?php
use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Support\\Facades\\DB;
return new class extends Migration {
 public function up(): void {
  $mapping = [
ENTRIES
  ];
  foreach (DB::table('templates')->get() as $template) {
   $thumbnail = str_replace(['/templates/minimalism_red/minimalism_red_files/', '/templates/passport/assets/', '/templates/pearl/pearl_files/'], ['/templates/mau-thiep-3/assets/', '/templates/mau-thiep-4/assets/', '/templates/mau-thiep-5/assets/'], $template->thumbnail);
   DB::table('templates')->where('id', $template->id)->update(['file_url' => $mapping[$template->file_url] ?? $template->file_url, 'thumbnail' => $thumbnail]);
  }
 }
 public function down(): void {}
};
'''.replace('ENTRIES',entries)
Path('laravel-backend/database/migrations/2026_10_14_140000_consolidate_template_paths.php').write_text(php,encoding='utf-8')
