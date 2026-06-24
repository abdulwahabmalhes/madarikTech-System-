<?php

namespace App\Http\Controllers\Api\V1\Projects;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Project::where('tenant_id', $request->user()->tenant_id)
            ->with(['client:id,name,company_name', 'manager:id,name']);
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('project_number', 'like', "%{$request->search}%");
            });
        }
        if ($request->status) $query->where('status', $request->status);
        return response()->json($query->orderByDesc('created_at')->paginate($request->per_page ?? 20));
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->all();
        $data['tenant_id'] = $request->user()->tenant_id;
        $data['created_by'] = $request->user()->id;
        
        if (empty($data['project_number'])) {
            $data['project_number'] = 'PRJ-' . date('Y') . '-' . rand(1000, 9999);
        }
        if (empty($data['start_date'])) {
            $data['start_date'] = now()->format('Y-m-d');
        }
        
        $project = Project::create($data);
        return response()->json($project, 201);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $project = Project::where('tenant_id', $request->user()->tenant_id)
            ->with([
                'client:id,name,company_name', 
                'manager:id,name', 
                'milestones', 
                'tasks',
                'contracts:id,project_id,contract_number,value,status,start_date,end_date',
                'invoices:id,project_id,invoice_number,total,status,issue_date,due_date',
                'expenses:id,project_id,title,amount,category,date,notes',
                'meetings'
            ])
            ->findOrFail($id);
        
        $project->loadCount(['tasks', 'milestones']);
        return response()->json($project);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $project = Project::where('tenant_id', $request->user()->tenant_id)->findOrFail($id);
        $project->update($request->all());
        return response()->json($project);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $project = Project::where('tenant_id', $request->user()->tenant_id)->findOrFail($id);
        $project->delete();
        return response()->json(['message' => 'تم حذف المشروع.']);
    }

    public function milestones(Request $request, int $id): JsonResponse
    {
        $project = Project::where('tenant_id', $request->user()->tenant_id)->findOrFail($id);
        return response()->json($project->milestones);
    }

    public function health(Request $request, int $id): JsonResponse
    {
        $project = Project::where('tenant_id', $request->user()->tenant_id)->findOrFail($id);
        $project->recalculateHealth();
        return response()->json(['health_score' => $project->health_score]);
    }
}