<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Renewal;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RenewalController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $tenantId = $request->user()->tenant_id;
        $renewals = Renewal::where('tenant_id', $tenantId)
            ->with(['client:id,name,company_name', 'project:id,name'])
            ->orderBy('expiry_date', 'asc')
            ->get();

        return response()->json($renewals);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'client_id' => 'nullable|exists:clients,id',
            'project_id' => 'nullable|exists:projects,id',
            'type' => 'required|string',
            'name' => 'required|string',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'expiry_date' => 'required|date|after_or_equal:start_date',
            'cost' => 'nullable|numeric|min:0',
            'price' => 'nullable|numeric|min:0',
            'status' => 'required|string|in:active,expired,renewed,cancelled',
            'auto_renew' => 'boolean',
            'notes' => 'nullable|string',
        ]);

        $validated['tenant_id'] = $request->user()->tenant_id;

        $renewal = Renewal::create($validated);

        return response()->json($renewal->load(['client', 'project']), 201);
    }

    public function show(Request $request, string $id): JsonResponse
    {
        $renewal = Renewal::where('tenant_id', $request->user()->tenant_id)
            ->with(['client', 'project'])
            ->findOrFail($id);
            
        return response()->json($renewal);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $renewal = Renewal::where('tenant_id', $request->user()->tenant_id)->findOrFail($id);

        $validated = $request->validate([
            'client_id' => 'nullable|exists:clients,id',
            'project_id' => 'nullable|exists:projects,id',
            'type' => 'required|string',
            'name' => 'required|string',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'expiry_date' => 'required|date|after_or_equal:start_date',
            'cost' => 'nullable|numeric|min:0',
            'price' => 'nullable|numeric|min:0',
            'status' => 'required|string|in:active,expired,renewed,cancelled',
            'auto_renew' => 'boolean',
            'notes' => 'nullable|string',
        ]);

        $renewal->update($validated);

        return response()->json($renewal->load(['client', 'project']));
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $renewal = Renewal::where('tenant_id', $request->user()->tenant_id)->findOrFail($id);
        $renewal->delete();

        return response()->json(null, 204);
    }
}
