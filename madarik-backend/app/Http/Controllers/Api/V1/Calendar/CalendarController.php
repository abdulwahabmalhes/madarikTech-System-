<?php

namespace App\Http\Controllers\Api\V1\Calendar;

use App\Http\Controllers\Controller;
use App\Models\CalendarEvent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CalendarController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = CalendarEvent::where('tenant_id', $request->user()->tenant_id);
        
        if ($request->start_at && $request->end_at) {
            $query->whereBetween('start_at', [$request->start_at, $request->end_at]);
        }

        return response()->json($query->orderBy('start_at')->get());
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'nullable|string',
            'start_at' => 'required|date',
            'end_at' => 'nullable|date',
            'all_day' => 'boolean',
            'color' => 'nullable|string',
        ]);
        
        $data['tenant_id'] = $request->user()->tenant_id;
        $data['created_by'] = $request->user()->id;
        
        return response()->json(CalendarEvent::create($data), 201);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $record = CalendarEvent::where('tenant_id', $request->user()->tenant_id)->findOrFail($id);
        return response()->json($record);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $record = CalendarEvent::where('tenant_id', $request->user()->tenant_id)->findOrFail($id);
        
        $data = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'type' => 'nullable|string',
            'start_at' => 'sometimes|date',
            'end_at' => 'nullable|date',
            'all_day' => 'boolean',
            'color' => 'nullable|string',
        ]);

        $record->update($data);
        return response()->json($record);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $record = CalendarEvent::where('tenant_id', $request->user()->tenant_id)->findOrFail($id);
        $record->delete();
        return response()->json(['message' => 'تم الحذف بنجاح.']);
    }
}
