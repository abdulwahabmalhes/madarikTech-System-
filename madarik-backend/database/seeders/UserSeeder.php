<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'name' => 'خالد العلي', 'name_ar' => 'خالد العلي',
                'email' => 'khalid@madariktech.com',
                'password' => Hash::make('password123'),
                'position' => 'Sales Manager', 'department' => 'Sales',
                'mobile' => '+971502345678', 'is_active' => true,
                'role' => 'sales-manager',
            ],
            [
                'name' => 'سارة محمد', 'name_ar' => 'سارة محمد',
                'email' => 'sara@madariktech.com',
                'password' => Hash::make('password123'),
                'position' => 'Project Manager', 'department' => 'Projects',
                'mobile' => '+971503456789', 'is_active' => true,
                'role' => 'project-manager',
            ],
            [
                'name' => 'فاطمة الأحمد', 'name_ar' => 'فاطمة الأحمد',
                'email' => 'fatima@madariktech.com',
                'password' => Hash::make('password123'),
                'position' => 'Finance Manager', 'department' => 'Finance',
                'mobile' => '+971504567890', 'is_active' => true,
                'role' => 'accountant',
            ],
            [
                'name' => 'محمد الهاشمي', 'name_ar' => 'محمد الهاشمي',
                'email' => 'mohammed@madariktech.com',
                'password' => Hash::make('password123'),
                'position' => 'Full Stack Developer', 'department' => 'Development',
                'mobile' => '+971505678901', 'is_active' => true,
                'role' => 'employee',
            ],
            [
                'name' => 'نورة الكندي', 'name_ar' => 'نورة الكندي',
                'email' => 'noura@madariktech.com',
                'password' => Hash::make('password123'),
                'position' => 'UI/UX Designer', 'department' => 'Design',
                'mobile' => '+971506789012', 'is_active' => true,
                'role' => 'employee',
            ],
        ];

        foreach ($users as $userData) {
            $role = $userData['role'];
            unset($userData['role']);
            $userData['tenant_id'] = 1;

            $user = User::firstOrCreate(
                ['email' => $userData['email']],
                $userData
            );
            $user->assignRole($role);
        }
    }
}
