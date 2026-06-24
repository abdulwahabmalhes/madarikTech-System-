<?php

namespace App\Http\Controllers\Api\V1\Team;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

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

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'position' => 'nullable|string',
            'department' => 'nullable|string',
            'mobile' => 'nullable|string',
            'role' => 'required|string|exists:roles,name',
        ]);

        $user = clone $request->user();
        
        $newUser = clone $user;
        $newUser = new User();
        $newUser->tenant_id = $request->user()->tenant_id;
        $newUser->name = $validated['name'];
        $newUser->email = $validated['email'];
        $newUser->password = Hash::make($validated['password']);
        $newUser->position = $validated['position'] ?? null;
        $newUser->department = $validated['department'] ?? null;
        $newUser->mobile = $validated['mobile'] ?? null;
        $newUser->is_active = true;
        $newUser->save();

        $newUser->assignRole($validated['role']);

        $newUser->roles = $newUser->getRoleNames();

        return response()->json($newUser, 201);
    }

    public function update(Request $request, User $user): JsonResponse
    {
        abort_if($user->tenant_id !== $request->user()->tenant_id, 403);
        
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,'.$user->id,
            'password' => 'nullable|string|min:6',
            'position' => 'nullable|string',
            'department' => 'nullable|string',
            'mobile' => 'nullable|string',
            'role' => 'nullable|string|exists:roles,name',
            'is_active' => 'boolean'
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        if (!empty($validated['role'])) {
            $user->syncRoles([$validated['role']]);
        }

        $user->roles = $user->getRoleNames();
        
        return response()->json($user);
    }

    public function deactivate(Request $request, User $user): JsonResponse
    {
        abort_if($user->tenant_id !== $request->user()->tenant_id, 403);
        
        if ($user->id === $request->user()->id) {
            return response()->json(['message' => 'لا يمكنك إيقاف/حذف حسابك الشخصي.'], 403);
        }

        // We use soft delete for maximum safety as requested, which sets deleted_at
        $user->delete();
        
        return response()->json(['message' => 'تم حذف العضو بنجاح.']);
    }
}
