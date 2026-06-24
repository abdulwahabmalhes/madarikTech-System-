<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    $meeting = \App\Models\Meeting::create([
        'tenant_id' => 1,
        'title' => 'Test Meeting',
        'type' => 'online',
        'client_id' => 1,
        'project_id' => 1,
        'date' => '2026-06-24',
        'start_time' => '10:00',
        'end_time' => '11:00',
        'location' => 'test',
        'status' => 'scheduled',
        'external_attendees' => ['سليمان'],
        'created_by' => 1,
    ]);
    echo "Success: " . $meeting->id . "\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
