<?php

namespace App\Http\Controllers\Api\V1\Analytics;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CashFlowController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $tenantId = $request->user()->tenant_id;

        $inflows = \App\Models\Invoice::where('tenant_id', $tenantId)
            ->where('status', 'paid')
            ->sum('total');

        $outflows = \App\Models\Expense::where('tenant_id', $tenantId)
            ->sum('amount');

        $currentBalance = $inflows - $outflows;

        return response()->json([
            'inflows' => $inflows,
            'outflows' => $outflows,
            'current_balance' => $currentBalance
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        return response()->json(['message' => 'تم الإنشاء.'], 201);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        return response()->json([]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        return response()->json(['message' => 'تم التحديث.']);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        return response()->json(['message' => 'تم الحذف.']);
    }
}

