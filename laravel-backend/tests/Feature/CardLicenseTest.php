<?php
namespace Tests\Feature;

use App\Models\User;
use App\Models\Order;
use App\Models\Template;
use App\Models\WeddingCard;
use App\Models\TemplateLicense;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CardLicenseTest extends TestCase
{
    use RefreshDatabase;

    private function license(User $user, string $template = 'template_01'): void
    {
        TemplateLicense::create(['user_id' => $user->id, 'template_code' => $template, 'expires_at' => now()->addMonthsNoOverflow(6)]);
    }

    public function test_purchase_is_bound_to_template_and_approval_grants_exactly_six_months_once(): void
    {
        $this->travelTo(now()->setDate(2026, 1, 31)->setTime(12, 0));
        $user = User::factory()->create();
        Sanctum::actingAs($user);
        $id = $this->postJson('/api/orders/create', ['plan_code' => 'pro', 'template_code' => 'template_01', 'amount' => 10000])->assertCreated()->assertJsonPath('order.amount', 99000)->json('order.id');
        $this->assertDatabaseCount('template_licenses', 0);
        Sanctum::actingAs(User::factory()->create(['role' => 'admin']));
        $this->postJson('/api/admin/orders/'.$id.'/approve')->assertOk();
        $license = TemplateLicense::firstOrFail();
        $this->assertSame('2026-07-31 12:00:00', $license->expires_at->format('Y-m-d H:i:s'));
        $this->assertSame('template_01', $license->template_code);
        $this->postJson('/api/admin/orders/'.$id.'/approve')->assertStatus(409);
        $this->assertSame('2026-07-31 12:00:00', $license->fresh()->expires_at->format('Y-m-d H:i:s'));
        $this->assertSame(0, $user->fresh()->paid_credits);
    }

    public function test_fixed_url_cannot_be_changed_and_new_template_requires_its_own_purchase(): void
    {
        $user = User::factory()->create(); Sanctum::actingAs($user);
        $data = ['slug' => 'fixed-url', 'template_id' => 'template_01', 'card_data' => ['title' => 'Original']];
        $this->postJson('/api/cards/save', $data)->assertForbidden();
        $this->license($user);
        $this->postJson('/api/cards/save', $data)->assertOk();
        $this->postJson('/api/cards/save', [...$data, 'slug' => 'second-url'])->assertStatus(409);
        $this->postJson('/api/cards/save', [...$data, 'template_id' => 'template_02'])->assertForbidden();
        $this->license($user, 'template_02');
        $this->postJson('/api/cards/save', [...$data, 'template_id' => 'template_02'])->assertOk()->assertJsonPath('slug', 'fixed-url');
        $this->assertDatabaseCount('wedding_cards', 1);
        $this->getJson('/api/cards/view/fixed-url')->assertOk()->assertJsonPath('template.file_url', Template::where('code', 'template_02')->value('file_url'));
    }

    public function test_expiration_locks_editing_and_public_view_without_revealing_card_data(): void
    {
        $user = User::factory()->create(); Sanctum::actingAs($user); $this->license($user);
        $data = ['slug' => 'expires-card', 'template_id' => 'template_01', 'card_data' => ['title' => 'Private expired title']];
        $this->postJson('/api/cards/save', $data)->assertOk();
        $this->travelTo(TemplateLicense::first()->expires_at);
        $this->postJson('/api/cards/save', $data)->assertForbidden();
        $this->getJson('/api/cards/view/expires-card')->assertStatus(410)->assertJsonMissing(['card_data' => $data['card_data']]);
        $this->getJson('/api/user/cards')->assertOk()->assertJsonPath('cards.0.access.active', false);
    }

    public function test_renewal_restores_same_url_and_early_renewal_preserves_remaining_time(): void
    {
        $user = User::factory()->create(); Sanctum::actingAs($user); $this->license($user);
        $data = ['slug' => 'renew-url', 'template_id' => 'template_01', 'card_data' => ['title' => 'Renew']];
        $this->postJson('/api/cards/save', $data)->assertOk();
        $original = TemplateLicense::first()->expires_at->copy();
        $id = $this->postJson('/api/orders/create', ['plan_code' => 'pro', 'template_code' => 'template_01'])->json('order.id');
        Sanctum::actingAs(User::factory()->create(['role' => 'admin']));
        $this->postJson('/api/admin/orders/'.$id.'/approve')->assertOk();
        $this->assertTrue(TemplateLicense::first()->expires_at->equalTo($original->addMonthsNoOverflow(6)));
        $this->travelTo(TemplateLicense::first()->expires_at->copy()->addDay());
        $this->getJson('/api/cards/view/renew-url')->assertStatus(410);
        Sanctum::actingAs($user);
        $id = $this->postJson('/api/orders/create', ['plan_code' => 'pro', 'template_code' => 'template_01'])->json('order.id');
        Sanctum::actingAs(User::factory()->create(['role' => 'admin']));
        $this->postJson('/api/admin/orders/'.$id.'/approve')->assertOk();
        $this->getJson('/api/cards/view/renew-url')->assertOk();
        $this->assertTrue(TemplateLicense::first()->expires_at->equalTo(now()->addMonthsNoOverflow(6)));
    }

    public function test_hidden_card_is_not_public_and_primary_url_survives_deletion_attempts(): void
    {
        $user = User::factory()->create(); Sanctum::actingAs($user); $this->license($user);
        $this->postJson('/api/cards/save', ['slug' => 'hidden-url', 'template_id' => 'template_01', 'card_data' => ['title' => 'Hidden']])->assertOk();
        $id = WeddingCard::first()->id;
        $this->deleteJson('/api/user/cards/'.$id)->assertStatus(409);
        $this->patchJson('/api/user/cards/visibility', ['is_published' => false])->assertOk();
        $this->getJson('/api/cards/view/hidden-url')->assertNotFound();
        $this->patchJson('/api/user/cards/visibility', ['is_published' => true])->assertOk();
        $this->getJson('/api/cards/view/hidden-url')->assertOk();
    }

    public function test_legacy_primary_choice_is_owned_one_time_and_preserves_archived_data(): void
    {
        $user = User::factory()->create(); $user->primary_selection_pending = true; $user->save();
        $first = WeddingCard::create(['user_id' => $user->id, 'slug' => 'old-first', 'template_id' => 'template_01', 'card_data' => []]);
        $second = WeddingCard::create(['user_id' => $user->id, 'slug' => 'old-second', 'template_id' => 'template_02', 'card_data' => []]);
        $other = WeddingCard::create(['user_id' => User::factory()->create()->id, 'slug' => 'another-user', 'template_id' => 'template_01', 'card_data' => []]);
        Sanctum::actingAs($user);
        $this->postJson('/api/user/cards/select-primary', ['card_id' => $other->id])->assertNotFound();
        $this->postJson('/api/user/cards/select-primary', ['card_id' => $second->id])->assertOk();
        $this->postJson('/api/user/cards/select-primary', ['card_id' => $first->id])->assertStatus(409);
        $this->getJson('/api/user/cards')->assertJsonCount(1, 'cards')->assertJsonPath('card_slug', 'old-second')->assertJsonPath('archived_count', 1);
        $this->getJson('/api/cards/view/old-first')->assertStatus(410);
        $this->assertDatabaseCount('wedding_cards', 3);
    }

    public function test_invalid_or_disabled_template_cannot_be_purchased_and_cancelled_orders_grant_nothing(): void
    {
        $user = User::factory()->create(); Sanctum::actingAs($user);
        $this->postJson('/api/orders/create', ['plan_code' => 'pro'])->assertUnprocessable();
        Template::where('code', 'template_02')->update(['is_active' => false]);
        $this->postJson('/api/orders/create', ['plan_code' => 'pro', 'template_code' => 'template_02'])->assertUnprocessable();
        $id = $this->postJson('/api/orders/create', ['plan_code' => 'pro', 'template_code' => 'template_01'])->json('order.id');
        Sanctum::actingAs(User::factory()->create(['role' => 'admin']));
        $this->postJson('/api/admin/orders/'.$id.'/cancel')->assertOk();
        $this->postJson('/api/admin/orders/'.$id.'/approve')->assertStatus(409);
        $this->assertDatabaseCount('template_licenses', 0);
    }
}
