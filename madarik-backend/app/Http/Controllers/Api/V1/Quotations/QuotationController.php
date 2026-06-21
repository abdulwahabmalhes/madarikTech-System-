<?php

namespace App\Http\Controllers\Api\V1\Quotations;

use App\Http\Controllers\Controller;
use App\Models\Quotation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class QuotationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Quotation::where('tenant_id', $request->user()->tenant_id)
            ->with(['client:id,name,company_name']);
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('quotation_number', 'like', "%{$request->search}%")
                  ->orWhere('project_name', 'like', "%{$request->search}%");
            });
        }
        if ($request->status) $query->where('status', $request->status);
        return response()->json($query->orderByDesc('created_at')->paginate($request->per_page ?? 20));
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->except(['items', 'sections']);
        $data['tenant_id'] = $request->user()->tenant_id;
        $data['created_by'] = $request->user()->id;
        
        if (empty($data['quotation_number'])) {
            $data['quotation_number'] = 'QT-' . date('Y') . '-' . strtoupper(substr(uniqid(), -4));
        }

        $q = Quotation::create($data);

        if ($request->has('items') && is_array($request->items)) {
            $q->items()->createMany($request->items);
        }

        if ($request->has('sections') && is_array($request->sections)) {
            $q->sections()->createMany($request->sections);
        }

        return response()->json($q, 201);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $q = Quotation::where('tenant_id', $request->user()->tenant_id)
            ->with(['client', 'items', 'sections', 'createdBy:id,name'])
            ->findOrFail($id);
        return response()->json($q);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $q = Quotation::where('tenant_id', $request->user()->tenant_id)->findOrFail($id);
        $q->update($request->except(['items', 'sections']));

        if ($request->has('items') && is_array($request->items)) {
            $q->items()->delete();
            $q->items()->createMany($request->items);
        }

        if ($request->has('sections') && is_array($request->sections)) {
            $q->sections()->delete();
            $q->sections()->createMany($request->sections);
        }

        return response()->json($q);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $q = Quotation::where('tenant_id', $request->user()->tenant_id)->findOrFail($id);
        $q->delete();
        return response()->json(['message' => 'تم حذف عرض السعر.']);
    }

    public function send(Request $request, int $id): JsonResponse
    {
        $q = Quotation::where('tenant_id', $request->user()->tenant_id)->findOrFail($id);
        $q->update(['status' => 'sent', 'sent_at' => now()]);
        return response()->json(['message' => 'تم إرسال عرض السعر.', 'quotation' => $q]);
    }

    public function accept(Request $request, int $id): JsonResponse
    {
        $q = Quotation::where('tenant_id', $request->user()->tenant_id)->findOrFail($id);
        $q->update(['status' => 'accepted']);
        return response()->json(['message' => 'تم قبول عرض السعر.']);
    }

    public function reject(Request $request, int $id): JsonResponse
    {
        $q = Quotation::where('tenant_id', $request->user()->tenant_id)->findOrFail($id);
        $q->update(['status' => 'rejected', 'rejection_reason' => $request->reason]);
        return response()->json(['message' => 'تم رفض عرض السعر.']);
    }

    public function convert(Request $request, int $id): JsonResponse
    {
        $q = Quotation::where('tenant_id', $request->user()->tenant_id)->findOrFail($id);
        
        $contractNumber = 'CT-' . date('Y') . '-' . strtoupper(substr(uniqid(), -4));

        $contract = \App\Models\Contract::create([
            'tenant_id' => $q->tenant_id,
            'client_id' => $q->client_id,
            'quotation_id' => $q->id,
            'created_by' => $request->user()->id,
            'contract_number' => $contractNumber,
            'title' => 'عقد: ' . $q->project_name,
            'type' => 'project',
            'status' => 'draft',
            'start_date' => now(),
            'end_date' => now()->addDays($q->execution_days ?? 30),
            'value' => $q->total,
            'payment_schedule' => $q->payment_mechanism ? (is_string($q->payment_mechanism) ? $q->payment_mechanism : json_encode($q->payment_mechanism)) : null,
            'content' => "<h2>نطاق العمل:</h2>\n<p>{$q->project_overview}</p>\n<h2>الشروط والأحكام:</h2>\n<p>{$q->terms_conditions}</p>",
            'notes' => $q->notes,
        ]);

        return response()->json(['message' => 'تم تحويل عرض السعر إلى عقد بنجاح.', 'contract_id' => $contract->id]);
    }

    public function pdf(Request $request, int $id): \Illuminate\Http\Response
    {
        $q = Quotation::where('tenant_id', $request->user()->tenant_id)
            ->with(['client', 'items'])
            ->findOrFail($id);
        // TODO: generate PDF with DomPDF
        return response()->json(['message' => 'PDF generation coming soon.']);
    }
}