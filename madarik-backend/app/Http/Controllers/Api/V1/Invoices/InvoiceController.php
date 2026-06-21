<?php

namespace App\Http\Controllers\Api\V1\Invoices;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Invoice::where('tenant_id', $request->user()->tenant_id)
            ->with(['client:id,name,company_name']);
        if ($request->search) {
            $query->where('invoice_number', 'like', "%{$request->search}%");
        }
        if ($request->status) $query->where('status', $request->status);
        return response()->json($query->orderByDesc('created_at')->paginate($request->per_page ?? 20));
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->all();
        $data['tenant_id'] = $request->user()->tenant_id;
        $data['created_by'] = $request->user()->id;
        
        $invoice = Invoice::create($data);
        
        if (!empty($data['items']) && is_array($data['items'])) {
            foreach ($data['items'] as $item) {
                $invoice->items()->create([
                    'description' => $item['description'] ?? '',
                    'quantity' => $item['quantity'] ?? 1,
                    'unit_price' => $item['unit_price'] ?? 0,
                    'total' => $item['total'] ?? 0,
                ]);
            }
        }
        
        return response()->json($invoice->load('items'), 201);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $inv = Invoice::where('tenant_id', $request->user()->tenant_id)
            ->with(['client', 'items', 'payments', 'contract'])
            ->findOrFail($id);
        return response()->json($inv);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $inv = Invoice::where('tenant_id', $request->user()->tenant_id)->findOrFail($id);
        
        \DB::beginTransaction();
        try {
            $inv->update($request->except(['items']));
            
            if ($request->has('items') && is_array($request->items)) {
                $inv->items()->delete();
                foreach ($request->items as $item) {
                    $inv->items()->create([
                        'description' => $item['description'] ?? '',
                        'quantity' => $item['quantity'] ?? 1,
                        'unit_price' => $item['unit_price'] ?? 0,
                        'total' => $item['total'] ?? 0,
                    ]);
                }
            }
            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }

        return response()->json($inv);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $inv = Invoice::where('tenant_id', $request->user()->tenant_id)->findOrFail($id);
        $inv->delete();
        return response()->json(['message' => 'تم حذف الفاتورة.']);
    }

    public function send(Request $request, int $id): JsonResponse
    {
        $inv = Invoice::where('tenant_id', $request->user()->tenant_id)->findOrFail($id);
        $inv->update(['status' => 'sent', 'sent_at' => now()]);
        return response()->json(['message' => 'تم إرسال الفاتورة.']);
    }

    public function markPaid(Request $request, int $id): JsonResponse
    {
        $inv = Invoice::where('tenant_id', $request->user()->tenant_id)->findOrFail($id);
        $inv->update([
            'status' => 'paid',
            'paid_at' => now(),
            'remaining_amount' => 0,
        ]);
        return response()->json(['message' => 'تم تسجيل الدفع.', 'invoice' => $inv]);
    }

    public function payments(Request $request, int $id): JsonResponse
    {
        $inv = Invoice::where('tenant_id', $request->user()->tenant_id)->findOrFail($id);
        return response()->json($inv->payments);
    }

    public function pdf(Request $request, int $id): JsonResponse
    {
        return response()->json(['message' => 'PDF generation coming soon.']);
    }
}