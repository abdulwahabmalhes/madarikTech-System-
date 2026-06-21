<?php

namespace App\Http\Controllers\Api\V1\Settings;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $tenantId = $request->user()->tenant_id;
        $settings = Setting::where('tenant_id', $tenantId)
            ->get()
            ->keyBy('key')
            ->map(fn($s) => $s->value);

        return response()->json($settings);
    }

    public function update(Request $request): JsonResponse
    {
        $tenantId = $request->user()->tenant_id;
        $data = $request->all();
        \Log::info('Settings Data:', $data);
        \Log::info('Files:', $request->allFiles());

        foreach ($data as $key => $value) {
            if ($key === '_method') continue; // skip laravel method spoofing

            if ($request->hasFile($key)) {
                $file = $request->file($key);
                if (is_array($file)) {
                    $file = $file[0]; // just in case it's an array
                }
                $path = $file->store('settings', 'public');
                $value = '/storage/' . $path;
            }

            // Skip updating files if they were not uploaded in this request
            if (($value === null || $value === 'null') && in_array($key, ['logo', 'logo_path', 'qr_code'])) {
                continue; 
            }

            if (is_array($value)) {
                // If it's still an array, JSON encode it to avoid exception
                $value = json_encode($value);
            } elseif (is_object($value)) {
                // If it's an uploaded file object but hasFile failed or something
                continue;
            }

            Setting::updateOrCreate(
                ['key' => $key, 'tenant_id' => $tenantId],
                ['value' => (string)$value]
            );
        }

        return response()->json(['message' => 'تم حفظ الإعدادات بنجاح.']);
    }
}
