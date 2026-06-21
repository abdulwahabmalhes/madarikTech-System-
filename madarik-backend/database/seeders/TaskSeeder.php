<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class TaskSeeder extends Seeder
{
    public function run(): void
    {
        // Tasks are already created in ProjectSeeder (6 tasks per project)
        // This seeder adds standalone/non-project tasks
        $dev = \App\Models\User::where('email', 'mohammed@madariktech.com')->value('id') ?? 4;
        $pm = \App\Models\User::where('email', 'sara@madariktech.com')->value('id') ?? 3;

        $standaloneTaskData = [
            ['title' => 'تحديث سيرفر الشركة', 'priority' => 'urgent', 'status' => 'pending', 'assigned_to' => $dev, 'due_date' => now()->addDays(2)->format('Y-m-d')],
            ['title' => 'مراجعة عروض أسعار الأسبوع', 'priority' => 'high', 'status' => 'in-progress', 'assigned_to' => $pm, 'due_date' => now()->addDays(1)->format('Y-m-d')],
            ['title' => 'إعداد تقرير المبيعات الشهري', 'priority' => 'normal', 'status' => 'pending', 'assigned_to' => $pm, 'due_date' => now()->endOfMonth()->format('Y-m-d')],
            ['title' => 'تجديد شهادة SSL الشركة', 'priority' => 'high', 'status' => 'pending', 'assigned_to' => $dev, 'due_date' => now()->addDays(7)->format('Y-m-d')],
            ['title' => 'نسخ احتياطي قاعدة البيانات', 'priority' => 'normal', 'status' => 'completed', 'assigned_to' => $dev, 'due_date' => now()->subDays(2)->format('Y-m-d')],
        ];

        foreach ($standaloneTaskData as $taskData) {
            $taskData['tenant_id'] = 1;
            $taskData['created_by'] = $pm;
            \App\Models\Task::create($taskData);
        }
    }
}
