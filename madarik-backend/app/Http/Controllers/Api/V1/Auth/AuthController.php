<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['البريد الإلكتروني أو كلمة المرور غير صحيحة.'],
            ]);
        }

        if (!$user->is_active) {
            return response()->json(['message' => 'الحساب غير نشط. تواصل مع مدير النظام.'], 403);
        }

        $user->update(['last_login_at' => now()]);

        $token = $user->createToken('madarik-app-token')->plainTextToken;

        return response()->json([
            'user'  => $this->formatUser($user),
            'token' => $token,
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->load('roles', 'permissions');
        return response()->json($this->formatUser($user));
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'تم تسجيل الخروج بنجاح.']);
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();
        $validated = $request->validate([
            'name'       => 'sometimes|string|max:255',
            'name_ar'    => 'sometimes|string|max:255',
            'position'   => 'sometimes|string|max:255',
            'department' => 'sometimes|string|max:255',
            'mobile'     => 'sometimes|string|max:20',
        ]);

        $user->update($validated);
        return response()->json($this->formatUser($user));
    }

    public function changePassword(Request $request): JsonResponse
    {
        $request->validate([
            'current_password' => 'required',
            'password'         => 'required|string|min:8|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'كلمة المرور الحالية غير صحيحة.'], 422);
        }

        $user->update(['password' => Hash::make($request->password)]);
        return response()->json(['message' => 'تم تغيير كلمة المرور بنجاح.']);
    }

    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate(['email' => 'required|email|exists:users,email']);
        Password::sendResetLink($request->only('email'));
        return response()->json(['message' => 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.']);
    }

    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'token'    => 'required',
            'email'    => 'required|email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->update(['password' => Hash::make($password)]);
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json(['message' => 'تم إعادة تعيين كلمة المرور بنجاح.']);
        }

        return response()->json(['message' => 'الرابط غير صالح أو منتهي الصلاحية.'], 422);
    }

    private function formatUser(User $user): array
    {
        return [
            'id'              => $user->id,
            'name'            => $user->name,
            'name_ar'         => $user->name_ar,
            'email'           => $user->email,
            'position'        => $user->position,
            'department'      => $user->department,
            'mobile'          => $user->mobile,
            'avatar'          => $user->avatar,
            'is_active'       => $user->is_active,
            'last_login_at'   => $user->last_login_at,
            'roles'           => $user->getRoleNames(),
            'permissions'     => $user->getPermissionNames(),
            'tenant_id'       => $user->tenant_id,
        ];
    }
}
