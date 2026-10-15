<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
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
