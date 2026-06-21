<?php

namespace App\Http\Controllers\Api\V1\Expenses;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Expense::where('tenant_id', $request->user()->tenant_id)
            ->with(['project:id,name', 'createdBy:id,name']);
        if ($request->search) {
            $query->where('title', 'like', "%{$request->search}%");
        }
        if ($request->category) $query->where('category', $request->category);
        if ($request->project_id) $query->where('project_id', $request->project_id);
        return response()->json($query->orderByDesc('date')->paginate($request->per_page ?? 50));
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->all();
        $data['tenant_id'] = $request->user()->tenant_id;
        $data['created_by'] = $request->user()->id;
        if (empty($data['date'])) $data['date'] = now()->toDateString();
        return response()->json(Expense::create($data), 201);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $expense = Expense::where('tenant_id', $request->user()->tenant_id)->findOrFail($id);
        return response()->json($expense);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $expense = Expense::where('tenant_id', $request->user()->tenant_id)->findOrFail($id);
        $expense->update($request->all());
        return response()->json($expense);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $expense = Expense::where('tenant_id', $request->user()->tenant_id)->findOrFail($id);
        $expense->delete();
        return response()->json(['message' => 'تم حذف المصروف.']);
    }

    public function summary(Request $request): JsonResponse
    {
        $tenantId = $request->user()->tenant_id;
        $byCategory = Expense::where('tenant_id', $tenantId)
            ->selectRaw('category, SUM(amount) as total')
            ->groupBy('category')
            ->get();

        $monthlyTotal = Expense::where('tenant_id', $tenantId)
            ->whereYear('date', now()->year)
            ->whereMonth('date', now()->month)
            ->sum('amount');

        return response()->json([
            'by_category' => $byCategory,
            'monthly_total' => $monthlyTotal,
        ]);
    }
}