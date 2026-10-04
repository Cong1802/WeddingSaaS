<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    private string $backupKey = 'migration.six_month_catalog_backup';

    public function up(): void
    {
        $plans = DB::table('plans')->get();
        $backup = $plans->map(fn ($plan) => ['id' => $plan->id, 'period' => $plan->period, 'features' => $plan->features, 'description' => $plan->description, 'action' => $plan->action])->all();
        DB::table('system_settings')->updateOrInsert(['key' => $this->backupKey], ['value' => json_encode($backup), 'created_at' => now(), 'updated_at' => now()]);
        foreach ($plans as $plan) {
            $features = json_decode($plan->features ?? '[]', true) ?: [];
            $features = array_map(function ($feature) use ($plan) {
                $feature = str_replace('12 tháng', '6 tháng', $feature);
                if (str_contains(strip_tags($feature), 'Sử dụng toàn bộ mẫu thiệp')) return 'Quyền sử dụng một mẫu thiệp trong 6 tháng';
                if ($plan->price == 0 && str_contains(strip_tags($feature), 'Xuất file HTML')) return '- Cần mua mẫu để lưu và công khai thiệp';
                return $feature;
            }, $features);
            $changes = ['features' => json_encode($features, JSON_UNESCAPED_UNICODE)];
            if ($plan->price > 0) $changes['period'] = '/mẫu · 6 tháng';
            else { $changes['description'] = 'Xem thử thiết kế; mua mẫu để lưu và chia sẻ thiệp.'; $changes['action'] = 'Xem thử mẫu'; }
            DB::table('plans')->where('id', $plan->id)->update($changes);
        }
    }

    public function down(): void
    {
        $backup = json_decode(DB::table('system_settings')->where('key', $this->backupKey)->value('value') ?? '[]', true);
        foreach ($backup as $plan) { $id = $plan['id']; unset($plan['id']); DB::table('plans')->where('id', $id)->update($plan); }
        DB::table('system_settings')->where('key', $this->backupKey)->delete();
    }
};
