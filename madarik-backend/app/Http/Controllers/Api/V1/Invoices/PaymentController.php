<?php

namespace App\Http\Controllers\Api\V1\Invoices;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Payment::query();
        if ($request->tenant_id_scoped) {
            $query->where('tenant_id', $request->user()->tenant_id);
        } else {
            $query->where('tenant_id', $request->user()->tenant_id);
        }
        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('title', 'like', "%{$request->search}%");
            });
        }
        if ($request->status) $query->where('status', $request->status);
        return response()->json($query->with(['client:id,name,company_name'])->orderByDesc('created_at')->paginate($request->per_page ?? 20));
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->all();
        $data['tenant_id'] = $request->user()->tenant_id;
        $data['created_by'] = $request->user()->id;
        return response()->json(Payment::create($data), 201);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $record = Payment::where('tenant_id', $request->user()->tenant_id)->findOrFail($id);
        return response()->json($record->load(['client:id,name,company_name']));
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $record = Payment::where('tenant_id', $request->user()->tenant_id)->findOrFail($id);
        $record->update($request->all());
        return response()->json($record);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $record = Payment::where('tenant_id', $request->user()->tenant_id)->findOrFail($id);
        $record->delete();
        return response()->json(['message' => 'تم الحذف بنجاح.']);
    }
}