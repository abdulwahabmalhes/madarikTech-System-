<?php

namespace App\Http\Controllers\Api\V1\Reminders;

use App\Http\Controllers\Controller;
use App\Models\Reminder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReminderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Reminder::where('tenant_id', $request->user()->tenant_id);
        if ($request->search) {
            $query->where('name', 'like', "%{$request->search}%")
                  ->orWhere('title', 'like', "%{$request->search}%");
        }
        if ($request->status) $query->where('status', $request->status);
        $data = $query->with(['client:id,name,company_name'])->orderByDesc('created_at')->paginate($request->per_page ?? 20);
        return response()->json($data);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate(['title' => 'sometimes|string', 'name' => 'sometimes|string']);
        $validated['tenant_id'] = $request->user()->tenant_id;
        $validated['created_by'] = $request->user()->id;
        $record = Reminder::create($validated);
        return response()->json($record, 201);
    }

    public function show(Request $request, Reminder $record): JsonResponse
    {
        abort_if($record->tenant_id !== $request->user()->tenant_id, 403);
        return response()->json($record);
    }

    public function update(Request $request, Reminder $record): JsonResponse
    {
        abort_if($record->tenant_id !== $request->user()->tenant_id, 403);
        $record->update($request->all());
        return response()->json($record);
    }

    public function destroy(Request $request, Reminder $record): JsonResponse
    {
        abort_if($record->tenant_id !== $request->user()->tenant_id, 403);
        $record->delete();
        return response()->json(['message' => 'تم الحذف بنجاح.']);
    }
}
