<?php

namespace App\Http\Controllers\Api\V1\Contracts;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContractController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Contract::where('tenant_id', $request->user()->tenant_id)
            ->with(['client:id,name,company_name', 'project:id,name']);
        if ($request->search) {
            $query->where('contract_number', 'like', "%{$request->search}%");
        }
        if ($request->status) $query->where('status', $request->status);
        return response()->json($query->orderByDesc('created_at')->paginate($request->per_page ?? 20));
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $data = $request->all();
            $data['tenant_id'] = $request->user()->tenant_id;
            $data['created_by'] = $request->user()->id;
            
            if (empty($data['contract_number'])) {
                $data['contract_number'] = 'CT-' . date('Y') . '-' . strtoupper(substr(uniqid(), -4));
            }

            if (empty($data['type'])) {
                $data['type'] = 'standard';
            }

            return response()->json(Contract::create($data), 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $c = Contract::where('tenant_id', $request->user()->tenant_id)
            ->with(['client', 'project', 'quotation'])
            ->findOrFail($id);
        return response()->json($c);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        try {
            $c = Contract::where('tenant_id', $request->user()->tenant_id)->findOrFail($id);
            $c->update($request->all());
            return response()->json($c);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $c = Contract::where('tenant_id', $request->user()->tenant_id)->findOrFail($id);
        $c->delete();
        return response()->json(['message' => 'تم حذف العقد.']);
    }

    public function markSigned(Request $request, int $id): JsonResponse
    {
        $c = Contract::where('tenant_id', $request->user()->tenant_id)->findOrFail($id);
        $c->update(['signed_by_client' => true, 'signed_date' => now(), 'status' => 'active']);
        return response()->json(['message' => 'تم توقيع العقد.']);
    }

    public function convertToInvoice(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'amount_type' => 'required|in:full,partial',
            'amount' => 'nullable|numeric|min:1',
        ]);

        $c = Contract::where('tenant_id', $request->user()->tenant_id)->findOrFail($id);
        
        $invoiceNumber = 'INV-' . date('Y') . '-' . strtoupper(substr(uniqid(), -4));

        $amount = $request->amount_type === 'full' ? $c->value : $request->amount;
        if (!$amount || $amount > $c->value) {
            return response()->json(['message' => 'مبلغ غير صالح.'], 400);
        }

        $invoice = \App\Models\Invoice::create([
            'tenant_id' => $c->tenant_id,
            'client_id' => $c->client_id,
            'project_id' => $c->project_id,
            'contract_id' => $c->id,
            'created_by' => $request->user()->id,
            'invoice_number' => $invoiceNumber,
            'issue_date' => now(),
            'due_date' => now()->addDays(7),
            'subtotal' => $amount,
            'tax_percent' => 5,
            'tax_amount' => $amount * 0.05,
            'total' => $amount * 1.05,
            'remaining_amount' => $amount * 1.05,
            'status' => 'unpaid',
            'notes' => 'فاتورة للعقد رقم ' . $c->contract_number,
        ]);

        $invoice->items()->create([
            'description' => 'دفعة تعاقدية - ' . ($request->amount_type === 'full' ? 'كامل المبلغ' : 'دفعة جزئية'),
            'quantity' => 1,
            'unit_price' => $amount,
            'total' => $amount,
        ]);

        return response()->json(['message' => 'تم إنشاء الفاتورة بنجاح.', 'invoice_id' => $invoice->id]);
    }
}