<?php
namespace Tests\Feature;
use App\Models\User;
use App\Models\WeddingCard;
use App\Models\TemplateLicense;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
class CardRsvpTest extends TestCase {
 use RefreshDatabase;
 public function test_rsvp_is_saved_for_a_live_card_and_only_visible_to_owner(): void {
  $owner=User::factory()->create();
  $card=WeddingCard::create(['user_id'=>$owner->id,'slug'=>'rsvp-test','template_id'=>'template_passport','card_data'=>[],'is_published'=>true]);
  TemplateLicense::create(['user_id'=>$owner->id,'template_code'=>'template_passport','expires_at'=>now()->addMonth()]);
  $payload=['name'=>'Khách thử','attendance'=>'yes','guest_count'=>2,'message'=>'Chúc hạnh phúc'];
  $this->postJson('/api/cards/view/rsvp-test/rsvp',$payload)->assertCreated()->assertJsonPath('success',true);
  $this->assertDatabaseHas('card_rsvps',['wedding_card_id'=>$card->id,'name'=>'Khách thử','guest_count'=>2]);
  $this->postJson('/api/cards/view/rsvp-test/rsvp',[...$payload,'guest_count'=>999])->assertUnprocessable();
  Sanctum::actingAs(User::factory()->create());
  $this->getJson('/api/user/cards/'.$card->id.'/rsvps')->assertNotFound();
  Sanctum::actingAs($owner);
  $this->getJson('/api/user/cards/'.$card->id.'/rsvps')->assertOk()->assertJsonPath('responses.data.0.name','Khách thử');
  $card->update(['is_published'=>false]);
  $this->postJson('/api/cards/view/rsvp-test/rsvp',$payload)->assertNotFound();
 }
}
