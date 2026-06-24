<?php

namespace App\Http\Controllers\Api\V1\Clients;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        // Auto-sync existing clients to leads (Temporary logic to bypass SSH)
        $unsynced = \App\Models\Client::whereNull('lead_id')->get();
        foreach($unsynced as $c) {
            $l = \App\Models\Lead::create([
                'tenant_id' => $c->tenant_id,
                'name' => $c->name,
                'company_name' => $c->company_name,
                'mobile' => $c->mobile,
                'whatsapp' => $c->whatsapp,
                'email' => $c->email,
                'country' => $c->country,
                'source' => $c->source ?? 'إضافة مباشرة',
                'stage' => 'won',
                'priority' => 'normal',
                'assigned_to' => $c->assigned_to,
                'created_by' => $c->created_by,
                'converted_to_client_id' => $c->id,
                'lead_number' => 'LD-'.date('Y').'-'.str_pad(\App\Models\Lead::where('tenant_id', $c->tenant_id)->count()+1, 4, '0', STR_PAD_LEFT)
            ]);
            $c->update(['lead_id' => $l->id]);
        }

        $query = Client::where('tenant_id', $request->user()->tenant_id)
            ->with(['assignedUser:id,name']);

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('company_name', 'like', "%{$request->search}%")
                  ->orWhere('mobile', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%");
            });
        }
        if ($request->status) $query->where('status', $request->status);
        if ($request->type) $query->where('type', $request->type);

        $clients = $query->orderByDesc('created_at')->paginate($request->per_page ?? 20);
        return response()->json($clients);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'         => 'required|string|max:255',
            'company_name' => 'nullable|string',
            'mobile'       => 'required|string|max:20',
            'whatsapp'     => 'nullable|string',
            'email'        => 'nullable|email',
            'country'      => 'nullable|string',
            'city'         => 'nullable|string',
            'industry'     => 'nullable|string',
            'type'         => 'required|in:company,individual',
            'source'       => 'nullable|string',
            'assigned_to'  => 'nullable|exists:users,id',
            'notes'        => 'nullable|string',
        ]);
        $validated['tenant_id'] = $request->user()->tenant_id;
        $validated['created_by'] = $request->user()->id;
        
        if (empty($validated['client_code'])) {
            $validated['client_code'] = 'CL-' . date('Y') . '-' . rand(1000, 9999);
        }

        $client = Client::create($validated);

        // Automatically create a 'won' lead so this client appears in the CRM Leads board
        $lead = \App\Models\Lead::create([
            'tenant_id' => $client->tenant_id,
            'name' => $client->name,
            'company_name' => $client->company_name,
            'mobile' => $client->mobile,
            'whatsapp' => $client->whatsapp,
            'email' => $client->email,
            'country' => $client->country,
            'source' => $client->source ?? 'إضافة مباشرة',
            'stage' => 'won',
            'priority' => 'normal',
            'assigned_to' => $client->assigned_to,
            'created_by' => $client->created_by,
            'converted_to_client_id' => $client->id,
            'lead_number' => 'LD-' . date('Y') . '-' . str_pad(\App\Models\Lead::where('tenant_id', $client->tenant_id)->count() + 1, 4, '0', STR_PAD_LEFT),
        ]);

        $client->update(['lead_id' => $lead->id]);

        return response()->json($client, 201);
    }

    public function show(Request $request, Client $client): JsonResponse
    {
        abort_if($client->tenant_id !== $request->user()->tenant_id, 403);
        $client->load([
            'assignedUser:id,name', 
            'projects:id,client_id,name,status,progress_percent,health_score',
            'invoices:id,client_id,invoice_number,total,status',
            'quotations:id,client_id,quotation_number,project_name,total,status',
            'contracts:id,client_id,title,value,status',
            'lead:id,stage,source,estimated_value'
        ]);
        return response()->json($client);
    }

    public function update(Request $request, Client $client): JsonResponse
    {
        abort_if($client->tenant_id !== $request->user()->tenant_id, 403);
        $client->update($request->only([
            'name','company_name','mobile','whatsapp','email','country','city',
            'industry','type','source','status','assigned_to','notes'
        ]));
        return response()->json($client);
    }

    public function destroy(Request $request, Client $client): JsonResponse
    {
        abort_if($client->tenant_id !== $request->user()->tenant_id, 403);
        $client->delete();
        return response()->json(['message' => 'تم حذف العميل.']);
    }

    public function projects(Request $request, Client $client): JsonResponse
    {
        abort_if($client->tenant_id !== $request->user()->tenant_id, 403);
        return response()->json($client->projects);
    }

    public function timeline(Request $request, Client $client): JsonResponse
    {
        abort_if($client->tenant_id !== $request->user()->tenant_id, 403);
        return response()->json($client->activities()->latest()->take(20)->get());
    }

    public function financials(Request $request, Client $client): JsonResponse
    {
        abort_if($client->tenant_id !== $request->user()->tenant_id, 403);
        return response()->json([
            'total_invoiced' => $client->invoices()->sum('total'),
            'total_paid'     => $client->invoices()->where('status','paid')->sum('total'),
            'outstanding'    => $client->invoices()->whereIn('status',['sent','overdue','partial'])->sum('remaining_amount'),
        ]);
    }

    public function invitePortal(Request $request, Client $client): JsonResponse
    {
        return response()->json(['message' => 'ميزة بوابة العملاء ستُفعّل قريباً.']);
    }
}
