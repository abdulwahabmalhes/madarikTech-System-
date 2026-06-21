<?php

namespace App\Http\Controllers\Api\V1\Tasks;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Task::where('tenant_id', $request->user()->tenant_id)
            ->with(['project:id,name', 'assignedUser:id,name', 'assignedBy:id,name']);
        if ($request->search) {
            $query->where('title', 'like', "%{$request->search}%");
        }
        if ($request->status) $query->where('status', $request->status);
        if ($request->project_id) $query->where('project_id', $request->project_id);
        if ($request->assigned_to) $query->where('assigned_to', $request->assigned_to);
        return response()->json($query->orderBy('due_date')->orderByDesc('created_at')->paginate($request->per_page ?? 50));
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->all();
        $data['tenant_id'] = $request->user()->tenant_id;
        $data['created_by'] = $request->user()->id;
        $task = Task::create($data);
        return response()->json($task, 201);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $task = Task::where('tenant_id', $request->user()->tenant_id)
            ->with(['project:id,name', 'assignedUser:id,name', 'comments'])
            ->findOrFail($id);
        return response()->json($task);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $task = Task::where('tenant_id', $request->user()->tenant_id)->findOrFail($id);
        $task->update($request->all());
        return response()->json($task);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $task = Task::where('tenant_id', $request->user()->tenant_id)->findOrFail($id);
        $task->delete();
        return response()->json(['message' => 'تم حذف المهمة.']);
    }

    public function complete(Request $request, int $id): JsonResponse
    {
        $task = Task::where('tenant_id', $request->user()->tenant_id)->findOrFail($id);
        $task->update([
            'status'       => 'completed',
            'completed_at' => now(),
            'completed_by' => $request->user()->id,
        ]);
        return response()->json($task);
    }
}