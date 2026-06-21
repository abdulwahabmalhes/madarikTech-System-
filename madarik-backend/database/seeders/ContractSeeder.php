<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Contract;
use App\Models\Client;
use App\Models\Project;
use App\Models\User;

class ContractSeeder extends Seeder
{
    public function run(): void
    {
        $salesUserId = User::where('email', 'khalid@madariktech.com')->value('id') ?? 2;
        $projects = Project::take(10)->get();

        foreach ($projects as $i => $project) {
            Contract::create([
                'tenant_id'      => 1,
                'contract_number' => 'CT-2026-' . str_pad($i + 1, 4, '0', STR_PAD_LEFT),
                'title'          => 'عقد تطوير - ' . $project->name,
                'client_id'      => $project->client_id,
                'project_id'     => $project->id,
                'type'           => 'development',
                'value'          => $project->contract_value,
                'currency_id'    => 1,
                'start_date'     => $project->start_date->format('Y-m-d'),
                'end_date'       => $project->expected_end_date->format('Y-m-d'),
                'payment_schedule' => json_encode([
                    ['milestone' => 'بدء المشروع', 'percent' => 50, 'amount' => $project->contract_value * 0.5],
                    ['milestone' => 'منتصف المشروع', 'percent' => 25, 'amount' => $project->contract_value * 0.25],
                    ['milestone' => 'التسليم النهائي', 'percent' => 25, 'amount' => $project->contract_value * 0.25],
                ]),
                'status'         => $project->status === 'completed' ? 'completed' : 'active',
                'signed_by_client' => true,
                'signed_date'    => $project->start_date->format('Y-m-d'),
                'created_by'     => $salesUserId,
            ]);
        }
    }
}
