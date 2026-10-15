<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
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
