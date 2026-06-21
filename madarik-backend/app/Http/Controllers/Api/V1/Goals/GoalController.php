<?php

namespace App\Http\Controllers\Api\V1\Goals;

use App\Http\Controllers\Controller;
use App\Models\Goal;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GoalController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Goal::where('tenant_id', $request->user()->tenant_id);
        
        if ($request->search) {
            $query->where('title', 'like', "%{$request->search}%");
        }
        
        if ($request->status) {
            $query->where('status', $request->status);
        }

        return response()->json($query->orderByDesc('created_at')->get());
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|string',
            'target_value' => 'required|numeric',
            'unit' => 'nullable|string',
            'period_type' => 'required|string',
            'period_start' => 'required|date',
            'period_end' => 'required|date',
            'assigned_to' => 'nullable|exists:users,id',
            'description' => 'nullable|string',
            'status' => 'nullable|string',
        ]);
        
        $data['tenant_id'] = $request->user()->tenant_id;
        $data['created_by'] = $request->user()->id;
        
        return response()->json(Goal::create($data), 201);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $record = Goal::where('tenant_id', $request->user()->tenant_id)->findOrFail($id);
        return response()->json($record);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $record = Goal::where('tenant_id', $request->user()->tenant_id)->findOrFail($id);
        $record->update($request->all());
        return response()->json($record);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $record = Goal::where('tenant_id', $request->user()->tenant_id)->findOrFail($id);
        $record->delete();
        return response()->json(['message' => 'تم الحذف بنجاح.']);
    }
}