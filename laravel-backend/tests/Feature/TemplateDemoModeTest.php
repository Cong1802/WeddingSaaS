<?php
namespace Tests\Feature;
use App\Models\User;
use App\Models\SystemSetting;
use App\Models\TemplateLicense;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
class TemplateDemoModeTest extends TestCase {
 use RefreshDatabase;
 public function test_demo_catalog_is_public_but_customer_creation_and_orders_are_blocked(): void {
  $this->getJson('/api/public/templates')->assertOk()->assertJsonFragment(['code'=>'template_pearl'])->assertJsonFragment(['code'=>'template_minimalism_red']);
  $this->getJson('/api/public/settings')->assertJsonPath('settings.templates_demo_only','1');
  Sanctum::actingAs(User::factory()->create());
  $this->postJson('/api/cards/save',[])->assertForbidden();
  $this->postJson('/api/orders/create',[])->assertForbidden();
  $this->patchJson('/api/admin/templates/catalog-mode',['demo_only'=>false])->assertForbidden();
 }
 public function test_admin_can_reopen_editing_and_customer_can_save_afterward(): void {
  Sanctum::actingAs(User::factory()->create(['role'=>'admin']));
  $this->patchJson('/api/admin/templates/catalog-mode',['demo_only'=>false])->assertOk()->assertJsonPath('demo_only',false);
  $user=User::factory()->create();Sanctum::actingAs($user);
  TemplateLicense::create(['user_id'=>$user->id,'template_code'=>'template_01','expires_at'=>now()->addMonth()]);
  $this->postJson('/api/cards/save',['slug'=>'demo-mode-test','template_id'=>'template_01','card_data'=>['title'=>'Thiệp thử']])->assertOk();
  $this->assertDatabaseHas('wedding_cards',['slug'=>'demo-mode-test']);
 }
}
