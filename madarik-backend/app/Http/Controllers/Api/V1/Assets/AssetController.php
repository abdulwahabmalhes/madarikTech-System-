<?php

namespace App\Http\Controllers\Api\V1\Assets;

use App\Http\Controllers\Controller;
use App\Models\Asset;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AssetController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Asset::where('tenant_id', $request->user()->tenant_id);
        
        if ($request->search) {
            $query->where('name', 'like', "%{$request->search}%");
        }
        
        if ($request->type) {
            $query->where('type', $request->type);
        }

        return response()->json($query->orderByDesc('created_at')->get());
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string',
            'client_id' => 'nullable|integer',
            'project_id' => 'nullable|integer',
            'provider' => 'nullable|string',
            'account_email' => 'nullable|email',
            'username' => 'nullable|string',
            'password' => 'nullable|string',
            'notes' => 'nullable|string',
            'monthly_cost' => 'nullable|numeric',
            'annual_cost' => 'nullable|numeric',
            'currency_id' => 'nullable|integer',
            'purchase_date' => 'nullable|date',
        ]);
        
        $data['tenant_id'] = $request->user()->tenant_id;
        
        return response()->json(Asset::create($data), 201);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $record = Asset::where('tenant_id', $request->user()->tenant_id)->findOrFail($id);
        return response()->json($record);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $record = Asset::where('tenant_id', $request->user()->tenant_id)->findOrFail($id);
        
        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'type' => 'sometimes|string',
            'client_id' => 'nullable|integer',
            'project_id' => 'nullable|integer',
            'provider' => 'nullable|string',
            'account_email' => 'nullable|email',
            'username' => 'nullable|string',
            'password' => 'nullable|string',
            'notes' => 'nullable|string',
            'monthly_cost' => 'nullable|numeric',
            'annual_cost' => 'nullable|numeric',
            'currency_id' => 'nullable|integer',
            'purchase_date' => 'nullable|date',
        ]);

        $record->update($data);
        return response()->json($record);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $record = Asset::where('tenant_id', $request->user()->tenant_id)->findOrFail($id);
        $record->delete();
        return response()->json(['message' => 'تم الحذف بنجاح.']);
    }
}