<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    $contract = \App\Models\Contract::create([
        'tenant_id' => 1,
        'title' => 'Test Contract',
        'client_id' => 1,
        'project_id' => 1,
        'value' => 150,
        'status' => 'active',
        'start_date' => '2026-06-24',
        'end_date' => '2026-06-30',
        'content' => 'Test',
        'created_by' => 1,
    ]);
    echo "Success: " . $contract->id . "\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
