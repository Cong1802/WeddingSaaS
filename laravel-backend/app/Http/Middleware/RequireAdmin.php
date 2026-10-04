<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RequireAdmin
{
    public function handle(Request $request, Closure $next)
    {
        if ($request->user()?->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Bạn không có quyền truy cập.'], 403);
        }
        return $next($request);
    }
}
