<?php

namespace App\Http\Controllers\Api\V1\Team;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $members = User::where('tenant_id', $request->user()->tenant_id)
            ->with('roles')
            ->orderByDesc('created_at')
            ->get(['id', 'name', 'name_ar', 'email', 'mobile', 'position', 'department', 'avatar', 'is_active', 'last_login_at'])
            ->map(function ($user) {
                $user->roles = $user->getRoleNames();
                return $user;
            });

        return response()->json($members);
    }

    public function invite(Request $request): JsonResponse
    {
        return response()->json(['message' => 'ميزة دعوة الأعضاء ستُفعّل قريباً.']);
    }

    public function update(Request $request, User $user): JsonResponse
    {
        abort_if($user->tenant_id !== $request->user()->tenant_id, 403);
        $user->update($request->only(['name', 'name_ar', 'position', 'department', 'mobile', 'is_active']));
        return response()->json($user);
    }

    public function deactivate(Request $request, User $user): JsonResponse
    {
        abort_if($user->tenant_id !== $request->user()->tenant_id, 403);
        $user->update(['is_active' => false]);
        return response()->json(['message' => 'تم إيقاف حساب المستخدم.']);
    }
}
