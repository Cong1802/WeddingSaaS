<?php
namespace Tests\Feature;

use App\Models\User;
use App\Models\Order;
use App\Models\WeddingCard;
use App\Models\SystemSetting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminFlowsTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        $user = User::factory()->create(['role' => 'admin']);
        Sanctum::actingAs($user);
        return $user;
    }

    public function test_every_admin_endpoint_rejects_guests_and_normal_users(): void
    {
        $routes = collect(app('router')->getRoutes())->filter(fn ($route) => str_starts_with($route->uri(), 'api/admin/'));
        foreach ($routes as $route) {
            $uri = '/'.preg_replace('/\{[^}]+\}/', '999', $route->uri());
            $this->json($route->methods()[0], $uri)->assertUnauthorized();
        }
        Sanctum::actingAs(User::factory()->create(['role' => 'user']));
        foreach ($routes as $route) {
            $uri = '/'.preg_replace('/\{[^}]+\}/', '999', $route->uri());
            $this->json($route->methods()[0], $uri)->assertForbidden();
        }
    }

    public function test_template_and_plan_crud_visibility_and_duplicate_validation(): void
    {
        $this->admin();
        foreach ([['templates', ['code' => 'flow-template', 'name' => 'Flow Template', 'category' => 'Test', 'thumbnail' => '/image.png', 'price' => 99000]],
            ['plans', ['code' => 'flow-plan', 'name' => 'Flow Plan', 'price' => 99000, 'features' => ['Feature']]]] as [$resource, $data]) {
            $singular = $resource === 'templates' ? 'template' : 'plan';
            $response = $this->postJson('/api/admin/'.$resource, [...$data, 'is_active' => true])->assertOk();
            $id = $response->json($singular.'.id');
            if ($resource === 'plans') $this->postJson('/api/admin/'.$resource, $data)->assertUnprocessable();
            $this->postJson('/api/admin/'.$resource, [...$data, 'id' => $id, 'name' => 'Updated'])->assertOk()->assertJsonPath($singular.'.name', 'Updated');
            $this->getJson('/api/admin/'.$resource)->assertOk()->assertJsonFragment(['id' => $id]);
            $this->getJson('/api/public/'.$resource)->assertOk()->assertJsonFragment(['id' => $id]);
            $this->postJson('/api/admin/'.$resource.'/'.$id.'/toggle')->assertOk();
            $this->getJson('/api/public/'.$resource)->assertJsonMissing(['id' => $id]);
            $this->deleteJson('/api/admin/'.$resource.'/'.$id)->assertOk();
            $this->deleteJson('/api/admin/'.$resource.'/'.$id)->assertNotFound();
        }
    }

    public function test_music_crud_and_invalid_edit(): void
    {
        $this->admin();
        $data = ['title' => 'Music Test', 'url' => '/music.wav', 'is_active' => true];
        $id = $this->postJson('/api/admin/music', $data)->assertOk()->json('music.id');
        $this->postJson('/api/admin/music', [...$data, 'id' => $id, 'title' => 'Updated'])->assertOk();
        $this->getJson('/api/public/music')->assertJsonFragment(['title' => 'Updated']);
        $this->postJson('/api/admin/music/'.$id.'/toggle')->assertOk();
        $this->getJson('/api/public/music')->assertJsonMissing(['title' => 'Updated']);
        $this->postJson('/api/admin/music', [...$data, 'id' => 999999])->assertNotFound();
        $this->deleteJson('/api/admin/music/'.$id)->assertOk();
    }

    public function test_user_detail_update_credit_role_and_safe_delete(): void
    {
        $admin = $this->admin();
        $user = User::factory()->create(['role' => 'user', 'paid_credits' => 0]);
        $user->createToken('session');
        WeddingCard::create(['user_id' => $user->id, 'slug' => 'flow-card', 'template_id' => 'template_01', 'card_data' => []]);
        $this->getJson('/api/admin/users/'.$user->id)->assertOk()->assertJsonCount(1, 'user.cards');
        $this->postJson('/api/admin/users/'.$user->id.'/update', ['name' => 'Updated', 'email' => 'UPDATED@example.com', 'paid_credits' => 2])->assertOk()->assertJsonPath('user.email', 'updated@example.com');
        $this->postJson('/api/admin/users/'.$user->id.'/grant-credit', ['amount' => -2])->assertUnprocessable();
        $this->postJson('/api/admin/users/'.$user->id.'/grant-credit', ['amount' => 3])->assertOk();
        $this->assertSame(5, $user->fresh()->paid_credits);
        $this->postJson('/api/admin/users/'.$user->id.'/toggle-role')->assertOk()->assertJsonPath('user.role', 'admin');
        $this->postJson('/api/admin/users/'.$admin->id.'/toggle-role')->assertStatus(400);
        $this->deleteJson('/api/admin/users/'.$admin->id)->assertStatus(400);
        $this->deleteJson('/api/admin/users/'.$user->id)->assertOk();
        $this->assertDatabaseMissing('wedding_cards', ['slug' => 'flow-card']);
        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_order_approval_grants_one_credit_and_terminal_states_are_protected(): void
    {
        $this->admin();
        $user = User::factory()->create(['paid_credits' => 0]);
        $order = Order::create(['user_id' => $user->id, 'order_code' => 'FLOW1', 'amount' => 99000, 'package_name' => 'Pro', 'status' => 'pending']);
        $this->postJson('/api/admin/orders/'.$order->id.'/approve')->assertOk();
        $this->assertSame(1, $user->fresh()->paid_credits);
        $this->postJson('/api/admin/orders/'.$order->id.'/approve')->assertStatus(409);
        $this->postJson('/api/admin/orders/'.$order->id.'/cancel')->assertStatus(409);
        $this->getJson('/api/admin/stats')->assertOk()->assertJsonPath('stats.total_revenue', 99000);
        $cancelled = Order::create(['user_id' => $user->id, 'order_code' => 'FLOW2', 'amount' => 99000, 'package_name' => 'Pro', 'status' => 'pending']);
        $this->postJson('/api/admin/orders/'.$cancelled->id.'/cancel')->assertOk();
        $this->postJson('/api/admin/orders/'.$cancelled->id.'/approve')->assertStatus(409);
        $this->assertSame(1, $user->fresh()->paid_credits);
    }

    public function test_checkout_uses_catalog_price_and_admin_bank_settings(): void
    {
        $this->admin();
        $this->postJson('/api/admin/plans', ['code' => 'pro', 'id' => \App\Models\Plan::where('code', 'pro')->value('id'), 'name' => 'Pro Updated', 'price' => 129000])->assertOk();
        foreach (['vietqr_bank_bin' => 'VCB', 'vietqr_account_no' => '123456789', 'vietqr_account_name' => 'TEST BANK'] as $key => $value) {
            SystemSetting::updateOrCreate(['key' => $key], ['value' => $value]);
        }
        $this->postJson('/api/orders/create', ['plan_code' => 'pro', 'template_code' => 'template_01', 'amount' => 10000])->assertCreated()
            ->assertJsonPath('order.amount', 129000)->assertJsonPath('bank_info.account_no', '123456789')->assertJsonPath('bank_info.account_name', 'TEST BANK');
        $this->postJson('/api/orders/create', ['amount' => 10000])->assertUnprocessable();
    }

    public function test_card_ownership_and_admin_delete(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();
        $data = ['slug' => 'owned-card', 'template_id' => 'template_01', 'card_data' => ['title' => 'Owned']];
        $this->postJson('/api/cards/save', $data)->assertUnauthorized();
        Sanctum::actingAs($user);
        \App\Models\TemplateLicense::create(['user_id' => $user->id, 'template_code' => 'template_01', 'expires_at' => now()->addMonthsNoOverflow(6)]);
        $this->postJson('/api/cards/save', $data)->assertOk();
        $id = WeddingCard::where('slug', 'owned-card')->value('id');
        Sanctum::actingAs($other);
        $this->postJson('/api/cards/save', $data)->assertForbidden();
        $this->deleteJson('/api/user/cards/'.$id)->assertNotFound();
        $this->admin();
        $this->getJson('/api/admin/cards')->assertOk()->assertJsonFragment(['slug' => 'owned-card']);
        $this->deleteJson('/api/admin/cards/'.$id)->assertOk();
        $this->getJson('/api/cards/view/owned-card')->assertNotFound();
    }

    public function test_uploads_accept_valid_files_and_reject_executable_content(): void
    {
        $this->admin();
        $png = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j4l8AAAAASUVORK5CYII=');
        $response = $this->postJson('/api/admin/upload/image', ['file' => UploadedFile::fake()->createWithContent('photo.png', $png)])->assertOk();
        $this->assertStringEndsWith('.png', $response->json('url'));
        unlink(public_path(ltrim($response->json('url'), '/')));
        $this->postJson('/api/admin/upload/image', ['file' => UploadedFile::fake()->createWithContent('code.php', '<?php echo 1;')])->assertUnprocessable();
        $wav = 'RIFF'.pack('V', 36).'WAVEfmt '.pack('VvvVVvv', 16, 1, 1, 8000, 16000, 2, 16).'data'.pack('V', 0);
        $response = $this->postJson('/api/admin/music/upload', ['file' => UploadedFile::fake()->createWithContent('test.wav', $wav)])->assertOk();
        unlink(public_path(ltrim($response->json('url'), '/')));
    }

    public function test_google_configuration_saved_in_admin_is_used(): void
    {
        $this->admin();
        $this->postJson('/api/admin/settings', ['google_client_id' => 'configured-client'])->assertOk();
        $this->getJson('/api/auth/config')->assertOk()->assertJsonPath('google_client_id', 'configured-client');
    }

    public function test_order_telegram_notification_and_failure_preserve_order(): void
    {
        $this->admin();
        foreach (['telegram_notify_bot_token' => 'fake-token', 'telegram_chat_id' => '123'] as $key => $value) {
            SystemSetting::updateOrCreate(['key' => $key], ['value' => $value]);
        }
        \Illuminate\Support\Facades\Http::fake(['api.telegram.org/*' => \Illuminate\Support\Facades\Http::response(['ok' => true])]);
        $this->postJson('/api/orders/create', ['plan_code' => 'pro', 'template_code' => 'template_01'])->assertCreated();
        \Illuminate\Support\Facades\Http::assertSent(fn ($request) => $request['chat_id'] === '123' && str_contains($request['text'], 'PAY_'));
        \Illuminate\Support\Facades\Http::fake(['api.telegram.org/*' => \Illuminate\Support\Facades\Http::response(['ok' => false], 502)]);
        $this->postJson('/api/orders/create', ['plan_code' => 'pro', 'template_code' => 'template_01'])->assertCreated();
        $this->assertDatabaseCount('orders', 2);
    }
}
