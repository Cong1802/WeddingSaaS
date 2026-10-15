from pathlib import Path
p=Path('src/components/TemplateAdminModal.jsx');s=p.read_text(encoding='utf-8').replace('X, FileText, LayoutGrid, ExternalLink','X, ExternalLink').replace('<FileText size={20} />','').replace('<LayoutGrid size={20} />','');p.write_text(s,encoding='utf-8')
p=Path('src/components/TemplateAdminModal.css');s=p.read_text(encoding='utf-8');s+='\n.template-admin-select{padding-left:14px}\n';p.write_text(s,encoding='utf-8')
p=Path('src/components/AdminCMS.jsx');s=p.read_text(encoding='utf-8');s=s.replace("setTemplateForm({ id: null, code: '', name: '', category:","setTemplateForm({ id: null, code: '', name: `Mẫu thiệp cưới ${templates.length + 1}`, category:");p.write_text(s,encoding='utf-8')
p=Path('laravel-backend/database/migrations/2026_10_14_130000_number_template_names.php');p.write_text('''<?php
use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Support\\Facades\\DB;
return new class extends Migration {
 public function up(): void {
  $templates = DB::table('templates')->orderBy('sort_order')->orderBy('id')->get();
  foreach ($templates as $index => $template) {
   DB::table('templates')->where('id', $template->id)->update(['name' => 'Mẫu thiệp cưới '.($index + 1), 'updated_at' => now()]);
  }
 }
 public function down(): void {
  // Display names are editable content; preserve subsequent admin edits on rollback.
 }
};
''',encoding='utf-8')
