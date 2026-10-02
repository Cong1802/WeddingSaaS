<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\WeddingCard;
use App\Models\Template;
use App\Models\Plan;
use App\Models\Order;
use App\Models\SystemSetting;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    /**
     * Middleware bọc kiểm tra quyền Admin
     */
    private function checkAdmin(Request $request)
    {
        $user = $request->user();
        if (!$user || $user->role !== 'admin') {
            abort(response()->json([
                'success' => false,
                'message' => 'Quyền truy cập bị từ chối. Cần tài khoản Quản trị viên (Admin).'
            ], 403));
        }
    }

    /**
     * 1. Thống kê Báo cáo Tổng quan Admin
     */
    public function getStats(Request $request)
    {
        $this->checkAdmin($request);

        $totalUsers = User::count();
        $totalCards = WeddingCard::count();
        $totalViews = WeddingCard::sum('views_count');
        $totalOrders = Order::count();
        $totalRevenue = Order::where('status', 'completed')->sum('amount');
        $pendingOrdersCount = Order::where('status', 'pending')->count();

        $templatesCount = WeddingCard::select('template_id', DB::raw('count(*) as count'))
            ->groupBy('template_id')
            ->get();

        $recentUsers = User::orderBy('created_at', 'desc')->take(5)->get();
        $recentOrders = Order::with('user:id,name,email,avatar')->orderBy('created_at', 'desc')->take(5)->get();

        return response()->json([
            'success' => true,
            'stats' => [
                'total_users' => $totalUsers,
                'total_cards' => $totalCards,
                'total_views' => (int)$totalViews,
                'total_orders' => $totalOrders,
                'total_revenue' => (float)$totalRevenue,
                'pending_orders' => $pendingOrdersCount,
                'templates' => $templatesCount,
                'recent_users' => $recentUsers,
                'recent_orders' => $recentOrders,
            ]
        ], 200);
    }

    /**
     * 2. Danh sách Quản lý Người Dùng
     */
    public function getUsers(Request $request)
    {
        $this->checkAdmin($request);

        $users = User::where('role', 'user')
            ->withCount('cards')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'users' => $users
        ], 200);
    }

    /**
     * Chi tiết người dùng kèm danh sách Thiệp & Lịch sử đơn hàng
     */
    public function getUserDetail(Request $request, $id)
    {
        $this->checkAdmin($request);

        $user = User::with([
            'cards' => function($q) {
                $q->orderBy('created_at', 'desc');
            },
            'orders' => function($q) {
                $q->orderBy('created_at', 'desc');
            }
        ])->findOrFail($id);

        return response()->json([
            'success' => true,
            'user' => $user
        ], 200);
    }

    /**
     * Cập nhật thông tin User
     */
    public function updateUser(Request $request, $id)
    {
        $this->checkAdmin($request);

        $user = User::findOrFail($id);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => "required|email|unique:users,email,{$id}",
            'phone' => 'nullable|string|max:50',
            'paid_credits' => 'nullable|integer|min:0',
        ]);

        $user->update($validated);

        return response()->json([
            'success' => true,
            'message' => "Đã cập nhật thông tin người dùng {$user->name} thành công.",
            'user' => $user
        ], 200);
    }

    /**
     * 3. Thay đổi quyền Người dùng (User <-> Admin)
     */
    public function toggleUserRole(Request $request, $id)
    {
        $this->checkAdmin($request);

        $user = User::findOrFail($id);

        if ($user->id === $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Bạn không thể hạ quyền Admin của chính mình.'
            ], 400);
        }

        $user->role = $user->role === 'admin' ? 'user' : 'admin';
        $user->save();

        return response()->json([
            'success' => true,
            'message' => "Đã chuyển đổi quyền của {$user->name} thành {$user->role}.",
            'user' => $user
        ], 200);
    }

    /**
     * 4. Xóa Người Dùng
     */
    public function deleteUser(Request $request, $id)
    {
        $this->checkAdmin($request);

        $user = User::findOrFail($id);

        if ($user->id === $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Bạn không thể tự xóa tài khoản của chính mình.'
            ], 400);
        }

        try {
            DB::transaction(function () use ($user) {
                Order::where('user_id', $user->id)->delete();
                WeddingCard::where('user_id', $user->id)->delete();
                $user->delete();
            });

            return response()->json([
                'success' => true,
                'message' => 'Đã xóa người dùng thành công.'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi xóa người dùng: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * 5. Quản lý Mẫu Thiệp (Template CMS)
     */
    public function getTemplates(Request $request)
    {
        $this->checkAdmin($request);

        $templates = Template::orderBy('sort_order', 'asc')->get();

        return response()->json([
            'success' => true,
            'templates' => $templates
        ], 200);
    }

    public function saveTemplate(Request $request)
    {
        $this->checkAdmin($request);

        $validated = $request->validate([
            'id' => 'nullable|integer',
            'code' => 'required|string|max:100',
            'name' => 'required|string|max:255',
            'category' => 'required|string',
            'tag' => 'nullable|string',
            'thumbnail' => 'required|string',
            'file_url' => 'nullable|string',
            'price' => 'numeric|min:0',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        if (isset($validated['id']) && $validated['id']) {
            $template = Template::findOrFail($validated['id']);
            $template->update($validated);
            $msg = 'Đã cập nhật mẫu thiệp thành công!';
        } else {
            $template = Template::create($validated);
            $msg = 'Đã thêm mẫu thiệp mới thành công!';
        }

        return response()->json([
            'success' => true,
            'message' => $msg,
            'template' => $template
        ], 200);
    }

    public function toggleTemplate(Request $request, $id)
    {
        $this->checkAdmin($request);

        $template = Template::findOrFail($id);
        $template->is_active = !$template->is_active;
        $template->save();

        return response()->json([
            'success' => true,
            'message' => "Đã chuyển trạng thái mẫu thiệp sang " . ($template->is_active ? 'Bật' : 'Tắt'),
            'template' => $template
        ], 200);
    }

    public function deleteTemplate(Request $request, $id)
    {
        $this->checkAdmin($request);

        $template = Template::findOrFail($id);
        $template->delete();

        return response()->json([
            'success' => true,
            'message' => 'Đã xóa mẫu thiệp thành công.'
        ], 200);
    }

    /**
     * 6. Quản lý Gói Cước (Plan CMS)
     */
    public function getPlans(Request $request)
    {
        $this->checkAdmin($request);

        $plans = Plan::all();

        return response()->json([
            'success' => true,
            'plans' => $plans
        ], 200);
    }

    public function savePlan(Request $request)
    {
        $this->checkAdmin($request);

        $validated = $request->validate([
            'id' => 'nullable|integer',
            'code' => 'required|string',
            'name' => 'required|string',
            'price' => 'required|numeric|min:0',
            'period' => 'required|string',
            'description' => 'nullable|string',
            'features' => 'nullable|array',
            'is_popular' => 'boolean',
            'is_active' => 'boolean',
        ]);

        if (isset($validated['id']) && $validated['id']) {
            $plan = Plan::findOrFail($validated['id']);
            $plan->update($validated);
            $msg = 'Đã cập nhật gói cước thành công!';
        } else {
            $plan = Plan::create($validated);
            $msg = 'Đã tạo gói cước mới thành công!';
        }

        return response()->json([
            'success' => true,
            'message' => $msg,
            'plan' => $plan
        ], 200);
    }

    public function togglePlan(Request $request, $id)
    {
        $this->checkAdmin($request);

        $plan = Plan::findOrFail($id);
        $plan->is_active = !$plan->is_active;
        $plan->save();

        return response()->json([
            'success' => true,
            'message' => "Đã chuyển trạng thái gói cước sang " . ($plan->is_active ? 'Kích hoạt' : 'Ẩn'),
            'plan' => $plan
        ], 200);
    }

    public function deletePlan(Request $request, $id)
    {
        $this->checkAdmin($request);

        $plan = Plan::findOrFail($id);
        $plan->delete();

        return response()->json([
            'success' => true,
            'message' => 'Đã xóa gói cước thành công.'
        ], 200);
    }

    /**
     * 7. Quản lý Đơn Hàng (Order CMS)
     */
    public function getOrders(Request $request)
    {
        $this->checkAdmin($request);

        $orders = Order::with('user:id,name,email,avatar')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'orders' => $orders
        ], 200);
    }

    public function approveOrder(Request $request, $id)
    {
        $this->checkAdmin($request);

        $order = Order::findOrFail($id);
        if ($order->status === 'completed') {
            return response()->json([
                'success' => false,
                'message' => 'Đơn hàng này đã được phê duyệt trước đó.'
            ], 400);
        }

        $order->status = 'completed';
        $order->save();

        return response()->json([
            'success' => true,
            'message' => "Đã duyệt đơn hàng {$order->order_code} thành công!",
            'order' => $order
        ], 200);
    }

    public function cancelOrder(Request $request, $id)
    {
        $this->checkAdmin($request);

        $order = Order::findOrFail($id);
        $order->status = 'cancelled';
        $order->save();

        return response()->json([
            'success' => true,
            'message' => "Đã hủy đơn hàng {$order->order_code}.",
            'order' => $order
        ], 200);
    }

    /**
     * 8. Quản lý Thiệp Cưới
     */
    public function getCards(Request $request)
    {
        $this->checkAdmin($request);

        $cards = WeddingCard::with('user:id,name,email,avatar')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'cards' => $cards
        ], 200);
    }

    public function deleteCard(Request $request, $id)
    {
        $this->checkAdmin($request);

        $card = WeddingCard::findOrFail($id);
        $card->delete();

        return response()->json([
            'success' => true,
            'message' => 'Đã xóa thiệp cưới thành công.'
        ], 200);
    }

    /**
     * 9. Admin Cấp lượt cho User
     */
    public function grantCredit(Request $request, $id)
    {
        $this->checkAdmin($request);

        $targetUser = User::findOrFail($id);
        $amount = (int)($request->input('amount', 1));
        $targetUser->increment('paid_credits', $amount);

        return response()->json([
            'success' => true,
            'message' => "Đã cấp thêm {$amount} lượt mua thiệp cho {$targetUser->name}! Số lượt hiện tại: {$targetUser->paid_credits}",
            'user' => $targetUser
        ], 200);
    }

    /**
     * 10. Quản lý Cấu Hình Hệ Thống (System Settings)
     */
    public function getSettings(Request $request)
    {
        $this->checkAdmin($request);

        $settings = SystemSetting::all()->pluck('value', 'key');

        return response()->json([
            'success' => true,
            'settings' => $settings
        ], 200);
    }

    public function saveSettings(Request $request)
    {
        $this->checkAdmin($request);

        $inputs = $request->except(['_token']);
        foreach ($inputs as $key => $value) {
            SystemSetting::updateOrCreate(
                ['key' => $key],
                ['value' => (string)$value]
            );
        }

        return response()->json([
            'success' => true,
            'message' => 'Đã lưu cấu hình hệ thống thành công!'
        ], 200);
    }

    /**
     * 11. Public Endpoints
     */
    public function getUserCards(Request $request)
    {
        $user = $request->user();
        $cards = WeddingCard::where('user_id', $user->id)
            ->orderBy('updated_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'cards' => $cards
        ], 200);
    }

    public function deleteMyCard(Request $request, $id)
    {
        $user = $request->user();
        $card = WeddingCard::where('id', $id)->where('user_id', $user->id)->firstOrFail();
        $card->delete();

        return response()->json([
            'success' => true,
            'message' => 'Đã xóa thiệp cưới của bạn thành công.'
        ], 200);
    }

    public function getPublicTemplates()
    {
        $templates = Template::where('is_active', true)->orderBy('sort_order', 'asc')->get();
        return response()->json(['success' => true, 'templates' => $templates]);
    }

    public function getPublicPlans()
    {
        $plans = Plan::where('is_active', true)->get();
        return response()->json(['success' => true, 'plans' => $plans]);
    }

    /**
     * 12. Quản lý Nhạc Nền (Music Tracks CMS)
     */
    public function getMusicTracks(Request $request)
    {
        $this->checkAdmin($request);

        $musicTracks = \App\Models\MusicTrack::orderBy('sort_order', 'asc')->get();

        return response()->json([
            'success' => true,
            'music' => $musicTracks
        ], 200);
    }

    public function saveMusicTrack(Request $request)
    {
        $this->checkAdmin($request);

        $validated = $request->validate([
            'id' => 'nullable|integer',
            'title' => 'required|string|max:255',
            'artist' => 'nullable|string|max:255',
            'url' => 'required|string',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        $music = \App\Models\MusicTrack::updateOrCreate(
            ['id' => $validated['id'] ?? null],
            [
                'title' => $validated['title'],
                'artist' => $validated['artist'] ?? null,
                'url' => $validated['url'],
                'is_active' => $validated['is_active'] ?? true,
                'sort_order' => $validated['sort_order'] ?? 1,
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Đã lưu bài nhạc nền thành công!',
            'music' => $music
        ], 200);
    }

    public function uploadMusicFile(Request $request)
    {
        $this->checkAdmin($request);

        $request->validate([
            'file' => 'required|file|mimes:mp3,wav,ogg,m4a,aac|max:25600', // max 25MB
        ]);

        $file = $request->file('file');
        $filename = 'music_' . time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
        
        $destinationPath = public_path('uploads/music');
        if (!file_exists($destinationPath)) {
            mkdir($destinationPath, 0777, true);
        }

        $file->move($destinationPath, $filename);
        $fileUrl = '/uploads/music/' . $filename;

        return response()->json([
            'success' => true,
            'message' => 'Đã tải lên tệp nhạc MP3 thành công!',
            'url' => $fileUrl
        ], 200);
    }

    public function uploadImageFile(Request $request)
    {
        $this->checkAdmin($request);

        $request->validate([
            'file' => 'required|file|mimes:jpg,jpeg,png,webp,gif,svg,ico|max:10240', // max 10MB
        ]);

        $file = $request->file('file');
        $filename = 'img_' . time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
        
        $destinationPath = public_path('uploads/images');
        if (!file_exists($destinationPath)) {
            mkdir($destinationPath, 0777, true);
        }

        $file->move($destinationPath, $filename);
        $fileUrl = '/uploads/images/' . $filename;

        return response()->json([
            'success' => true,
            'message' => 'Đã tải ảnh lên hệ thống thành công!',
            'url' => $fileUrl
        ], 200);
    }

    public function toggleMusicTrack(Request $request, $id)
    {
        $this->checkAdmin($request);

        $track = \App\Models\MusicTrack::findOrFail($id);
        $track->is_active = !$track->is_active;
        $track->save();

        return response()->json([
            'success' => true,
            'message' => "Đã " . ($track->is_active ? 'Bật' : 'Tắt') . " bài nhạc thành công!",
            'music' => $track
        ], 200);
    }

    public function deleteMusicTrack(Request $request, $id)
    {
        $this->checkAdmin($request);

        $track = \App\Models\MusicTrack::findOrFail($id);
        $track->delete();

        return response()->json([
            'success' => true,
            'message' => 'Đã xóa bài nhạc nền thành công.'
        ], 200);
    }

    public function getPublicMusicTracks()
    {
        $music = \App\Models\MusicTrack::where('is_active', true)->orderBy('sort_order', 'asc')->get();
        return response()->json(['success' => true, 'music' => $music]);
    }

    public function getPublicSettings()
    {
        $settings = SystemSetting::all()->pluck('value', 'key');
        return response()->json([
            'success' => true,
            'settings' => $settings
        ], 200);
    }
}
