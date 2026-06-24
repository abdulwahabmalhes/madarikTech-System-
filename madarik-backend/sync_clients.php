<?php
$clients = \App\Models\Client::whereNull('lead_id')->get();
foreach($clients as $c) {
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
    echo "Synced: {$c->name}\n";
}
echo "Done.\n";
