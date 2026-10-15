<?php
namespace App\Services;
use App\Models\SystemSetting;
class TemplateAvailability {
 public static function demoOnly(): bool {
  return SystemSetting::where('key', 'templates_demo_only')->value('value') === '1';
 }
}
