<?php
namespace App\Http\Controllers;
use App\Models\WeddingCard;
use App\Services\CardAccess;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
class CardRsvpController extends Controller {
 public function store(Request $request, string $slug) {
  $card = WeddingCard::where('slug', $slug)->firstOrFail();
  abort_unless($card->is_published, 404);
  $owner = $card->user;
  abort_unless($owner && CardAccess::primarySlug($owner) === $slug && CardAccess::status($owner->id, $card->template_id)['active'], 410);
  $data = $request->validate([
   'name' => 'required|string|max:150', 'attendance' => 'required|in:yes,no',
   'guest_count' => 'required|integer|min:1|max:50', 'message' => 'nullable|string|max:2000',
  ]);
  $name = trim($data['name']);
  abort_if($name === '', 422, 'Vui lòng nhập họ tên.');
  DB::table('card_rsvps')->insert([
   'wedding_card_id' => $card->id, 'name' => $name, 'attending' => $data['attendance'] === 'yes',
   'guest_count' => $data['attendance'] === 'yes' ? $data['guest_count'] : 0,
   'message' => $data['message'] ?? null, 'created_at' => now(), 'updated_at' => now(),
  ]);
  return response()->json(['success' => true, 'message' => 'Đã gửi xác nhận và lời chúc. Cảm ơn bạn!'], 201);
 }
 public function index(Request $request, int $id) {
  $card = WeddingCard::where('user_id', $request->user()->id)->findOrFail($id);
  return response()->json(['success' => true, 'responses' => DB::table('card_rsvps')->where('wedding_card_id', $card->id)->latest('id')->paginate(50)]);
 }
}
