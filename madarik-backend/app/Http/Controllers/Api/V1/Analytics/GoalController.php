<?php

namespace App\Http\Controllers\Api\V1\Analytics;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Goal;

class GoalController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $goals = Goal::where('tenant_id', $request->user()->tenant_id)
            ->latest()
            ->get();
            
        return response()->json($goals);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|string',
            'target_value' => 'required|numeric',
            'current_value' => 'nullable|numeric',
            'unit' => 'nullable|string',
            'period_type' => 'required|string',
            'period_start' => 'required|date',
            'period_end' => 'required|date',
            'assigned_to' => 'nullable|exists:users,id',
            'description' => 'nullable|string',
            'status' => 'nullable|string',
        ]);

        $validated['tenant_id'] = $request->user()->tenant_id;
        $validated['created_by'] = $request->user()->id;

        $goal = Goal::create($validated);

        return response()->json($goal, 201);
    }

    public function show(Request $request, Goal $goal): JsonResponse
    {
        abort_if($goal->tenant_id !== $request->user()->tenant_id, 403);
        return response()->json($goal);
    }

    public function update(Request $request, Goal $goal): JsonResponse
    {
        abort_if($goal->tenant_id !== $request->user()->tenant_id, 403);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'type' => 'sometimes|string',
            'target_value' => 'sometimes|numeric',
            'current_value' => 'sometimes|numeric',
            'unit' => 'nullable|string',
            'period_type' => 'sometimes|string',
            'period_start' => 'sometimes|date',
            'period_end' => 'sometimes|date',
            'assigned_to' => 'nullable|exists:users,id',
            'description' => 'nullable|string',
            'status' => 'nullable|string',
        ]);

        $goal->update($validated);

        return response()->json($goal);
    }

    public function destroy(Request $request, Goal $goal): JsonResponse
    {
        abort_if($goal->tenant_id !== $request->user()->tenant_id, 403);
        $goal->delete();
        return response()->json(null, 204);
    }
}
