<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\WeddingCard;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class TemplateCatalogTest extends TestCase
{
    use RefreshDatabase;

    public function test_html_design_files_are_discovered_and_can_be_selected(): void
    {
        Sanctum::actingAs(User::factory()->create(['role' => 'admin']));
        $directory = public_path('templates/catalog-test-'.uniqid());
        mkdir($directory, 0777, true);
        file_put_contents($directory.'/index.html', '<html><body>Test design</body></html>');
        file_put_contents($directory.'/notes.txt', 'Not a design');
        $url = '/templates/'.basename($directory).'/index.html';
        try {
            $this->getJson('/api/admin/templates')->assertOk()->assertJsonFragment(['url' => $url]);
            $this->postJson('/api/admin/templates', ['name' => 'File design', 'category' => 'Test', 'thumbnail' => '/image.png', 'file_url' => $url])
                ->assertOk()->assertJsonPath('template.file_url', $url);
            $this->postJson('/api/admin/templates', ['name' => 'Invalid file', 'category' => 'Test', 'thumbnail' => '/image.png', 'file_url' => '/templates/'.basename($directory).'/notes.txt'])
                ->assertUnprocessable();
        } finally {
            unlink($directory.'/index.html');
            unlink($directory.'/notes.txt');
            rmdir($directory);
        }
    }

    public function test_generated_codes_are_unique_and_immutable_and_design_reaches_shared_card(): void
    {
        $user = User::factory()->create(['role' => 'admin']);
        Sanctum::actingAs($user);
        $payload = ['name' => 'New design', 'category' => 'Vintage', 'thumbnail' => '/image.png', 'file_url' => '/template.html'];
        $first = $this->postJson('/api/admin/templates', $payload)->assertOk()->json('template');
        $second = $this->postJson('/api/admin/templates', $payload)->assertOk()->json('template');
        $this->assertNotSame($first['code'], $second['code']);
        $this->assertSame(0, $first['price']);
        $this->postJson('/api/admin/templates', [...$payload, 'id' => $first['id'], 'code' => 'changed', 'name' => 'Updated', 'price' => 999])
            ->assertOk()->assertJsonPath('template.code', $first['code'])->assertJsonPath('template.price', 0);
        $this->postJson('/api/admin/templates', [...$payload, 'file_url' => 'https://example.com/template.html'])->assertUnprocessable();
        $this->postJson('/api/admin/templates', [...$payload, 'file_url' => '/missing.html'])->assertUnprocessable();
        WeddingCard::create(['user_id' => $user->id, 'slug' => 'new-template-card', 'template_id' => $first['code'], 'card_data' => []]);
        \App\Models\TemplateLicense::create(['user_id' => $user->id, 'template_code' => $first['code'], 'expires_at' => now()->addMonthsNoOverflow(6)]);
        $this->postJson('/api/admin/templates/'.$first['id'].'/toggle')->assertOk();
        $this->getJson('/api/public/templates')->assertJsonMissing(['id' => $first['id']]);
        $this->getJson('/api/cards/view/new-template-card')->assertOk()->assertJsonPath('template.file_url', '/template.html');
        $this->getJson('/api/user/cards')->assertOk()->assertJsonPath('cards.0.template.code', $first['code']);
        $this->getJson('/api/admin/templates')->assertOk()->assertJsonFragment(['url' => '/template.html']);
    }
}
