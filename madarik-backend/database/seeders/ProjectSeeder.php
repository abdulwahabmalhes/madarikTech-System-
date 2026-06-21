<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Project;
use App\Models\Client;
use App\Models\User;
use App\Models\Task;
use App\Models\ProjectMilestone;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        $pm = User::where('email', 'sara@madariktech.com')->value('id') ?? 3;
        $dev = User::where('email', 'mohammed@madariktech.com')->value('id') ?? 4;
        $clients = Client::where('status', 'active')->take(20)->get();

        $projectData = [
            ['name' => 'تطوير موقع مجموعة الشامسي', 'type' => 'website', 'status' => 'in-progress', 'priority' => 'high', 'progress_percent' => 65, 'health_score' => 78, 'contract_value' => 18000, 'days_ago' => 45, 'duration' => 90],
            ['name' => 'تطبيق بلوشي للتجارة', 'type' => 'mobile_app', 'status' => 'in-progress', 'priority' => 'urgent', 'progress_percent' => 40, 'health_score' => 55, 'contract_value' => 45000, 'days_ago' => 30, 'duration' => 120],
            ['name' => 'نظام POS لمطاعم الرشيدي', 'type' => 'erp_crm', 'status' => 'completed', 'priority' => 'normal', 'progress_percent' => 100, 'health_score' => 92, 'contract_value' => 25000, 'days_ago' => 150, 'duration' => 60],
            ['name' => 'حملة تسويقية لنورة للتجميل', 'type' => 'marketing', 'status' => 'in-progress', 'priority' => 'normal', 'progress_percent' => 80, 'health_score' => 85, 'contract_value' => 12000, 'days_ago' => 20, 'duration' => 30],
            ['name' => 'موقع الغامدي للعقارات', 'type' => 'website', 'status' => 'completed', 'priority' => 'high', 'progress_percent' => 100, 'health_score' => 95, 'contract_value' => 22000, 'days_ago' => 200, 'duration' => 75],
            ['name' => 'نظام CRM لمجموعة الحربي', 'type' => 'erp_crm', 'status' => 'in-progress', 'priority' => 'urgent', 'progress_percent' => 25, 'health_score' => 42, 'contract_value' => 80000, 'days_ago' => 15, 'duration' => 180],
            ['name' => 'تطبيق المنصوري للخدمات', 'type' => 'mobile_app', 'status' => 'planning', 'priority' => 'normal', 'progress_percent' => 5, 'health_score' => 90, 'contract_value' => 38000, 'days_ago' => 5, 'duration' => 150],
            ['name' => 'هوية بصرية عمر للتطوير', 'type' => 'design', 'status' => 'completed', 'priority' => 'normal', 'progress_percent' => 100, 'health_score' => 88, 'contract_value' => 9000, 'days_ago' => 60, 'duration' => 21],
            ['name' => 'متجر إلكتروني وليد الحسن', 'type' => 'website', 'status' => 'in-progress', 'priority' => 'high', 'progress_percent' => 55, 'health_score' => 70, 'contract_value' => 28000, 'days_ago' => 35, 'duration' => 60],
            ['name' => 'حملة سوشيال ميديا دلال للتسويق', 'type' => 'marketing', 'status' => 'in-progress', 'priority' => 'normal', 'progress_percent' => 90, 'health_score' => 93, 'contract_value' => 8000, 'days_ago' => 25, 'duration' => 30],
            ['name' => 'ذكاء اصطناعي بشار للتكنولوجيا', 'type' => 'ai_solution', 'status' => 'in-progress', 'priority' => 'urgent', 'progress_percent' => 30, 'health_score' => 61, 'contract_value' => 120000, 'days_ago' => 20, 'duration' => 180],
            ['name' => 'منصة تعليمية لطيفة الجابري', 'type' => 'website', 'status' => 'planning', 'priority' => 'high', 'progress_percent' => 10, 'health_score' => 85, 'contract_value' => 35000, 'days_ago' => 7, 'duration' => 120],
            ['name' => 'نظام الحجز مجموعة النعيمي الطبية', 'type' => 'mobile_app', 'status' => 'on-hold', 'priority' => 'normal', 'progress_percent' => 45, 'health_score' => 40, 'contract_value' => 55000, 'days_ago' => 90, 'duration' => 120],
            ['name' => 'SEO وتحسين زينب الأنصاري', 'type' => 'marketing', 'status' => 'completed', 'priority' => 'low', 'progress_percent' => 100, 'health_score' => 96, 'contract_value' => 6000, 'days_ago' => 80, 'duration' => 90],
            ['name' => 'نظام إدارة حسين المرزوقي', 'type' => 'erp_crm', 'status' => 'in-progress', 'priority' => 'high', 'progress_percent' => 70, 'health_score' => 75, 'contract_value' => 95000, 'days_ago' => 75, 'duration' => 120],
        ];

        foreach ($projectData as $i => $data) {
            $client = $clients[$i % $clients->count()];
            $startDate = now()->subDays($data['days_ago'])->format('Y-m-d');
            $endDate = now()->subDays($data['days_ago'])->addDays($data['duration'])->format('Y-m-d');

            $project = Project::create([
                'tenant_id'          => 1,
                'project_number'     => 'PRJ-2026-' . str_pad($i + 1, 4, '0', STR_PAD_LEFT),
                'name'               => $data['name'],
                'client_id'          => $client->id,
                'type'               => $data['type'],
                'start_date'         => $startDate,
                'expected_end_date'  => $endDate,
                'actual_end_date'    => $data['status'] === 'completed' ? $endDate : null,
                'priority'           => $data['priority'],
                'status'             => $data['status'],
                'progress_percent'   => $data['progress_percent'],
                'health_score'       => $data['health_score'],
                'assigned_manager'   => $pm,
                'contract_value'     => $data['contract_value'],
                'currency_id'        => 1,
                'created_by'         => $pm,
            ]);

            // Add 3 milestones per project
            $milestones = [
                ['title' => 'المرحلة الأولى - التحليل والتصميم', 'days' => 20, 'status' => $data['progress_percent'] > 33 ? 'completed' : 'pending'],
                ['title' => 'المرحلة الثانية - التطوير', 'days' => 50, 'status' => $data['progress_percent'] > 66 ? 'completed' : ($data['progress_percent'] > 33 ? 'in-progress' : 'pending')],
                ['title' => 'المرحلة الثالثة - التسليم والإطلاق', 'days' => 90, 'status' => $data['progress_percent'] === 100 ? 'completed' : 'pending'],
            ];

            foreach ($milestones as $m) {
                ProjectMilestone::create([
                    'tenant_id'      => 1,
                    'project_id'     => $project->id,
                    'title'          => $m['title'],
                    'due_date'       => now()->subDays($data['days_ago'])->addDays($m['days'])->format('Y-m-d'),
                    'status'         => $m['status'],
                    'payment_linked' => true,
                ]);
            }

            // Add tasks per project
            $taskTitles = [
                'تحليل المتطلبات وكتابة المواصفات',
                'تصميم قاعدة البيانات',
                'تطوير الواجهة الأمامية',
                'تطوير الواجهة الخلفية',
                'اختبار وضمان الجودة',
                'نشر على السيرفر',
            ];

            foreach ($taskTitles as $j => $taskTitle) {
                $taskStatus = 'pending';
                if ($j < ($data['progress_percent'] / 100 * count($taskTitles))) {
                    $taskStatus = 'completed';
                } elseif ($j === (int)($data['progress_percent'] / 100 * count($taskTitles))) {
                    $taskStatus = 'in-progress';
                }

                Task::create([
                    'tenant_id'    => 1,
                    'title'        => $taskTitle,
                    'project_id'   => $project->id,
                    'client_id'    => $client->id,
                    'assigned_to'  => $dev,
                    'created_by'   => $pm,
                    'due_date'     => now()->subDays($data['days_ago'])->addDays($j * 15 + 10)->format('Y-m-d'),
                    'priority'     => $j === 0 ? 'high' : 'normal',
                    'status'       => $taskStatus,
                    'estimated_hours' => rand(8, 40),
                    'completed_at'   => $taskStatus === 'completed' ? now()->subDays(rand(1, 30)) : null,
                ]);
            }
        }
    }
}
