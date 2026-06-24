<?php
use Illuminate\Contracts\Http\Kernel;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Boot Laravel
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Kernel::class);
$response = $kernel->handle(Request::capture());

// Sync logic
$clients = \App\Models\Client::whereNull('lead_id')->get();
$count = 0;
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
    $count++;
}

echo "<h1>Synced {$count} clients successfully.</h1>";
echo "<p>You can now delete this file from the server.</p>";
