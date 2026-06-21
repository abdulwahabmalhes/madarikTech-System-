<?php

namespace App\Http\Controllers\Api\V1\Crm;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use App\Models\Client;
use App\Models\MarketingSpend;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LeadController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Lead::where('tenant_id', $request->user()->tenant_id)
            ->with(['assignedUser:id,name', 'currency:id,code,symbol']);

        // Filters
        if ($request->stage) $query->where('stage', $request->stage);
        if ($request->source) $query->where('source', $request->source);
        if ($request->assigned_to) $query->where('assigned_to', $request->assigned_to);
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('company_name', 'like', "%{$request->search}%")
                  ->orWhere('mobile', 'like', "%{$request->search}%");
            });
        }

        $leads = $query->orderByDesc('created_at')->paginate($request->per_page ?? 20);
        return response()->json($leads);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'              => 'required|string|max:255',
            'company_name'      => 'nullable|string|max:255',
            'mobile'            => 'required|string|max:20',
            'whatsapp'          => 'nullable|string|max:20',
            'email'             => 'nullable|email|max:255',
            'source'            => 'required|string',
            'country'           => 'nullable|string|max:100',
            'stage'             => 'required|string',
            'priority'          => 'required|in:low,normal,high',
            'estimated_value'   => 'nullable|numeric',
            'expected_close_date' => 'nullable|date',
            'assigned_to'       => 'nullable|exists:users,id',
            'notes'             => 'nullable|string',
            'campaign_name'     => 'nullable|string',
        ]);

        $validated['tenant_id'] = $request->user()->tenant_id;
        $validated['created_by'] = $request->user()->id;

        // Generate lead number
        $count = Lead::where('tenant_id', $validated['tenant_id'])->count() + 1;
        $validated['lead_number'] = 'LD-' . now()->year . '-' . str_pad($count, 4, '0', STR_PAD_LEFT);

        $lead = Lead::create($validated);
        return response()->json($lead->load('assignedUser'), 201);
    }

    public function show(Request $request, Lead $lead): JsonResponse
    {
        $this->authorizeTenant($request, $lead->tenant_id);
        $lead->load(['assignedUser:id,name', 'convertedClient:id,name,company_name', 'currency:id,code,symbol', 'notes', 'activities']);
        return response()->json($lead);
    }

    public function update(Request $request, Lead $lead): JsonResponse
    {
        $this->authorizeTenant($request, $lead->tenant_id);
        $validated = $request->validate([
            'name'            => 'sometimes|string|max:255',
            'company_name'    => 'nullable|string',
            'mobile'          => 'sometimes|string',
            'whatsapp'        => 'nullable|string',
            'email'           => 'nullable|email',
            'source'          => 'sometimes|string',
            'stage'           => 'sometimes|string',
            'priority'        => 'sometimes|in:low,normal,high',
            'estimated_value' => 'nullable|numeric',
            'assigned_to'     => 'nullable|exists:users,id',
            'notes'           => 'nullable|string',
        ]);

        $lead->update($validated);
        return response()->json($lead);
    }

    public function destroy(Request $request, Lead $lead): JsonResponse
    {
        $this->authorizeTenant($request, $lead->tenant_id);
        $lead->delete();
        return response()->json(['message' => 'تم حذف العميل المحتمل.']);
    }

    public function convert(Request $request, Lead $lead): JsonResponse
    {
        $this->authorizeTenant($request, $lead->tenant_id);

        if ($lead->isConverted()) {
            return response()->json(['message' => 'هذا العميل المحتمل تم تحويله مسبقاً.'], 422);
        }

        $client = Client::create([
            'tenant_id'    => $lead->tenant_id,
            'name'         => $lead->name,
            'company_name' => $lead->company_name,
            'mobile'       => $lead->mobile,
            'whatsapp'     => $lead->whatsapp,
            'email'        => $lead->email,
            'country'      => $lead->country,
            'source'       => $lead->source,
            'lead_id'      => $lead->id,
            'assigned_to'  => $lead->assigned_to,
            'status'       => 'active',
            'created_by'   => $request->user()->id,
        ]);

        $lead->update([
            'stage'                => 'won',
            'converted_to_client_id' => $client->id,
        ]);

        return response()->json([
            'message' => 'تم تحويل العميل المحتمل إلى عميل بنجاح.',
            'client'  => $client,
        ]);
    }

    public function sourceAnalytics(Request $request): JsonResponse
    {
        $tenantId = $request->user()->tenant_id;
        $year = $request->year ?? now()->year;
        $month = $request->month ?? null;

        $query = Lead::where('tenant_id', $tenantId)
            ->whereYear('created_at', $year);

        if ($month) $query->whereMonth('created_at', $month);

        $bySource = $query->selectRaw('source, COUNT(*) as total_leads, SUM(CASE WHEN stage = "won" THEN 1 ELSE 0 END) as converted, SUM(estimated_value) as pipeline_value')
            ->groupBy('source')
            ->orderByDesc('total_leads')
            ->get()
            ->map(function ($item) {
                $item->conversion_rate = $item->total_leads > 0
                    ? round(($item->converted / $item->total_leads) * 100, 1)
                    : 0;
                return $item;
            });

        $spendData = MarketingSpend::where('tenant_id', $tenantId)
            ->whereYear('created_at', $year)
            ->when($month, fn($q) => $q->where('month', $month))
            ->selectRaw('source, SUM(amount) as total_spend')
            ->groupBy('source')
            ->pluck('total_spend', 'source');

        $result = $bySource->map(function ($item) use ($spendData) {
            $spend = $spendData[$item->source] ?? 0;
            $item->total_spend = $spend;
            $item->cpl = $item->total_leads > 0 && $spend > 0
                ? round($spend / $item->total_leads, 2)
                : null;
            $item->roi = $spend > 0
                ? round((($item->pipeline_value - $spend) / $spend) * 100, 1)
                : null;
            return $item;
        });

        return response()->json($result);
    }

    private function authorizeTenant(Request $request, int $tenantId): void
    {
        if ($request->user()->tenant_id !== $tenantId) {
            abort(403);
        }
    }
}
