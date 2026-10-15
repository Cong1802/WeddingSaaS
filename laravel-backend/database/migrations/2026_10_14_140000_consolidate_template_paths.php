<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
return new class extends Migration {
 public function up(): void {
  $mapping = [
            '/template.html' => '/templates/mau-thiep-1/mau-thiep-1.html',
            '/https___www.lovecard.click_thiepso48/www.lovecard.click/thiepso48.html' => '/templates/mau-thiep-2/mau-thiep-2.html',
            '/templates/minimalism_red/minimalism_red.html' => '/templates/mau-thiep-3/mau-thiep-3.html',
            '/templates/passport/index.html' => '/templates/mau-thiep-4/mau-thiep-4.html',
            '/templates/pearl/pearl.html' => '/templates/mau-thiep-5/mau-thiep-5.html'
  ];
  foreach (DB::table('templates')->get() as $template) {
   $thumbnail = str_replace(['/templates/minimalism_red/minimalism_red_files/', '/templates/passport/assets/', '/templates/pearl/pearl_files/'], ['/templates/mau-thiep-3/assets/', '/templates/mau-thiep-4/assets/', '/templates/mau-thiep-5/assets/'], $template->thumbnail);
   DB::table('templates')->where('id', $template->id)->update(['file_url' => $mapping[$template->file_url] ?? $template->file_url, 'thumbnail' => $thumbnail]);
  }
 }
 public function down(): void {}
};
