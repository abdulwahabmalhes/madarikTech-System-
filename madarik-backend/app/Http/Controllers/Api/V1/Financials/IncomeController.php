<?php

namespace App\Http\Controllers\Api\V1\Financials;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Income;

class IncomeController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Income::with(['project', 'client'])
            ->where('tenant_id', $request->user()->tenant_id);

        if ($request->has('project_id')) {
            $query->where('project_id', $request->project_id);
        }

        if ($request->has('client_id')) {
            $query->where('client_id', $request->client_id);
        }

        $perPage = $request->input('per_page', 15);
        $incomes = $query->latest('date')->paginate($perPage);

        return response()->json($incomes);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'amount' => 'required|numeric|min:0',
            'currency_id' => 'nullable|exists:currencies,id',
            'date' => 'required|date',
            'project_id' => 'nullable|exists:projects,id',
            'client_id' => 'nullable|exists:clients,id',
            'source' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $validated['tenant_id'] = $request->user()->tenant_id;
        $validated['created_by'] = $request->user()->id;
        $validated['category'] = $validated['category'] ?? 'general';

        $income = Income::create($validated);

        return response()->json($income->load(['project', 'client']), 201);
    }

    public function show(Request $request, Income $income): JsonResponse
    {
        abort_if($income->tenant_id !== $request->user()->tenant_id, 403);
        
        return response()->json($income->load(['project', 'client']));
    }

    public function update(Request $request, Income $income): JsonResponse
    {
        abort_if($income->tenant_id !== $request->user()->tenant_id, 403);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'category' => 'sometimes|string|max:255',
            'amount' => 'sometimes|numeric|min:0',
            'currency_id' => 'nullable|exists:currencies,id',
            'date' => 'sometimes|date',
            'project_id' => 'nullable|exists:projects,id',
            'client_id' => 'nullable|exists:clients,id',
            'source' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $income->update($validated);

        return response()->json($income->load(['project', 'client']));
    }

    public function destroy(Request $request, Income $income): JsonResponse
    {
        abort_if($income->tenant_id !== $request->user()->tenant_id, 403);
        
        $income->delete();
        
        return response()->json(null, 204);
    }
}
