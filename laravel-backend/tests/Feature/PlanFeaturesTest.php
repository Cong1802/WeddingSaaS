<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PlanFeaturesTest extends TestCase
{
    use RefreshDatabase;

    public function test_features_preserve_basic_formatting_and_remove_attributes(): void
    {
        Sanctum::actingAs(User::factory()->create(['role' => 'admin']));
        $this->postJson('/api/admin/plans', [
            'code' => 'rich-features', 'name' => 'Rich Features', 'price' => 99000,
            'features' => ['<strong onclick="alert(1)">12 months</strong>', '<img src=x onerror=alert(1)><em>VietQR</em>'],
            'is_active' => true, 'is_popular' => false,
        ])->assertOk()->assertJsonPath('plan.features.0', '<strong>12 months</strong>')
            ->assertJsonPath('plan.features.1', '<em>VietQR</em>');
        $this->getJson('/api/public/plans')->assertOk()->assertJsonFragment(['features' => ['<strong>12 months</strong>', '<em>VietQR</em>']]);
    }
}
