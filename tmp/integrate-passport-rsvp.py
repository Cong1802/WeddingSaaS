from pathlib import Path
files={
'laravel-backend/database/migrations/2026_10_14_110000_create_card_rsvps_table.php':'''<?php
use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;
return new class extends Migration {
 public function up(): void {
  Schema::create('card_rsvps', function (Blueprint $table) {
   $table->id(); $table->foreignId('wedding_card_id')->constrained('wedding_cards')->cascadeOnDelete();
   $table->string('name', 150); $table->boolean('attending'); $table->unsignedSmallInteger('guest_count');
   $table->text('message')->nullable(); $table->timestamps();
  });
 }
 public function down(): void { Schema::dropIfExists('card_rsvps'); }
};
''',
'laravel-backend/app/Http/Controllers/CardRsvpController.php':'''<?php
namespace App\\Http\\Controllers;
use App\\Models\\WeddingCard;
use App\\Services\\CardAccess;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\DB;
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
'''}
for filename,content in files.items():Path(filename).write_text(content,encoding='utf-8')
p=Path('laravel-backend/routes/api.php');s=p.read_text(encoding='utf-8');s=s.replace("Route::get('/cards/view/{slug}',", "Route::post('/cards/view/{slug}/rsvp', [\\App\\Http\\Controllers\\CardRsvpController::class, 'store'])->middleware('throttle:5,1');\nRoute::get('/cards/view/{slug}',");s=s.replace("    Route::get('/auth/me',", "    Route::get('/user/cards/{id}/rsvps', [\\App\\Http\\Controllers\\CardRsvpController::class, 'index']);\n    Route::get('/auth/me',");p.write_text(s,encoding='utf-8')
p=Path('src/components/GuestCardViewer.jsx');s=p.read_text(encoding='utf-8').replace('      syncPassportTemplate(doc, card_data);','      doc.documentElement.dataset.cardSlug = slug;\n      syncPassportTemplate(doc, card_data);');p.write_text(s,encoding='utf-8')
for root in ['public/templates/passport','laravel-backend/public/templates/passport']:
 p=Path(root)/'assets/passport.js';s=p.read_text(encoding='utf-8');s=s.replace('  const countdown = () => {','''  const form = document.querySelector('#passport-FORM2 form');
  form?.addEventListener('submit', async event => {
    event.preventDefault();
    const status = document.getElementById('passport-rsvp-status');
    const slug = document.documentElement.dataset.cardSlug;
    if (!slug) {
      status.textContent = 'Đây là bản xem mẫu. Xác nhận sẽ được gửi khi mở link thiệp đã xuất bản.';
      return;
    }
    const button = form.querySelector('button[type="submit"]');
    if (button.disabled) return;
    button.disabled = true;
    status.textContent = 'Đang gửi…';
    try {
      const values = new FormData(form);
      const response = await fetch(`/api/cards/view/${encodeURIComponent(slug)}/rsvp`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({name: values.get('name'), attendance: values.get('attendance'), guest_count: Number(values.get('form_item8') || 1), message: values.get('message')})
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || 'Chưa gửi được xác nhận. Vui lòng thử lại.');
      status.textContent = result.message;
      form.reset();
    } catch (error) { status.textContent = error.message || 'Lỗi kết nối. Vui lòng thử lại.'; }
    finally { button.disabled = false; }
  });
  const countdown = () => {''');p.write_text(s,encoding='utf-8')
