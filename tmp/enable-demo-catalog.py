from pathlib import Path
files={
'laravel-backend/app/Services/TemplateAvailability.php':'''<?php
namespace App\\Services;
use App\\Models\\SystemSetting;
class TemplateAvailability {
 public static function demoOnly(): bool {
  return SystemSetting::where('key', 'templates_demo_only')->value('value') === '1';
 }
}
''',
'laravel-backend/database/migrations/2026_10_14_120000_enable_template_demo_catalog.php':'''<?php
use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Support\\Facades\\DB;
return new class extends Migration {
 public function up(): void {
  DB::table('system_settings')->updateOrInsert(['key'=>'templates_demo_only'],['value'=>'1','description'=>'Chỉ xem demo mẫu thiệp','created_at'=>now(),'updated_at'=>now()]);
  foreach ([
   ['template_pearl','Pearl Hoàng Gia','Sang Trọng','VIP','https://static.ladipage.net/6833feb01c8070001239a3de/c9a53bce-62ce-4c0c-bf0c-65b83fc4d64d-20260629133038-cdvig.png','/templates/pearl/pearl.html',6],
   ['template_minimalism_red','Minimalism Đỏ Đô','Tối Giản','NEW','/templates/minimalism_red/minimalism_red_files/b85505cb-14fc-410e-9788-388897a9be30.webp','/templates/minimalism_red/minimalism_red.html',7],
  ] as [$code,$name,$category,$tag,$thumbnail,$url,$sort]) {
   DB::table('templates')->insertOrIgnore(['code'=>$code,'name'=>$name,'category'=>$category,'tag'=>$tag,'thumbnail'=>$thumbnail,'file_url'=>$url,'price'=>0,'is_active'=>true,'sort_order'=>$sort,'created_at'=>now(),'updated_at'=>now()]);
  }
 }
 public function down(): void {
  DB::table('system_settings')->where('key','templates_demo_only')->delete();
  DB::table('templates')->whereIn('code',['template_pearl','template_minimalism_red'])->delete();
 }
};
'''}
for path,s in files.items():Path(path).write_text(s,encoding='utf-8')
p=Path('laravel-backend/app/Http/Controllers/AdminController.php');s=p.read_text(encoding='utf-8');s=s.replace("'designs' => $this->templateDesigns(),","'designs' => $this->templateDesigns(),\n            'demo_only' => \\App\\Services\\TemplateAvailability::demoOnly(),",1)
s=s.replace('    public function saveTemplate(Request $request)', '''    public function setTemplateCatalogMode(Request $request)
    {
        $this->checkAdmin($request);
        $data = $request->validate(['demo_only' => 'required|boolean']);
        SystemSetting::updateOrCreate(['key' => 'templates_demo_only'], ['value' => $data['demo_only'] ? '1' : '0']);
        return response()->json(['success' => true, 'demo_only' => $data['demo_only']]);
    }

    public function saveTemplate(Request $request)''')
s=s.replace("        return response()->json([\n            'success' => true,\n            'settings' => $settings", "        $settings['templates_demo_only'] = \\App\\Services\\TemplateAvailability::demoOnly() ? '1' : '0';\n        return response()->json([\n            'success' => true,\n            'settings' => $settings")
p.write_text(s,encoding='utf-8')
p=Path('laravel-backend/routes/api.php');s=p.read_text(encoding='utf-8').replace("        Route::get('/templates',", "        Route::patch('/templates/catalog-mode', [AdminController::class, 'setTemplateCatalogMode']);\n        Route::get('/templates',");p.write_text(s,encoding='utf-8')
for file,method in [('WeddingCardController.php','saveCard'),('OrderController.php','createOrder')]:
 p=Path('laravel-backend/app/Http/Controllers')/file;s=p.read_text(encoding='utf-8');needle=f'    public function {method}(Request $request)\n    {{';s=s.replace(needle,needle+"\n        abort_if(\\App\\Services\\TemplateAvailability::demoOnly() && $request->user()?->role !== 'admin', 403, 'Hiện chỉ mở xem demo mẫu thiệp. Tính năng tạo và chỉnh sửa sẽ được mở sau.');");p.write_text(s,encoding='utf-8')
