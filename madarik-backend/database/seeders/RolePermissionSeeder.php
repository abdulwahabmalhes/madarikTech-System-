<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $modules = [
            'dashboard', 'leads', 'clients', 'projects', 'tasks',
            'quotations', 'contracts', 'invoices', 'expenses', 'reports',
            'products', 'meetings', 'opportunities', 'reminders',
            'knowledge', 'calendar', 'team', 'settings', 'files',
            'notifications', 'deliverables', 'renewals', 'goals',
            'assets', 'support', 'analytics', 'ai',
        ];

        $actions = ['view', 'create', 'edit', 'delete'];

        foreach ($modules as $module) {
            foreach ($actions as $action) {
                Permission::firstOrCreate(['name' => "{$module}.{$action}", 'guard_name' => 'web']);
            }
        }

        // Extra permissions
        $extras = [
            'invoices.view-financials', 'projects.view-all',
            'settings.manage', 'assets.view-credentials',
        ];
        foreach ($extras as $perm) {
            Permission::firstOrCreate(['name' => $perm, 'guard_name' => 'web']);
        }

        // Roles
        $owner = Role::firstOrCreate(['name' => 'owner', 'guard_name' => 'web']);
        $salesManager = Role::firstOrCreate(['name' => 'sales-manager', 'guard_name' => 'web']);
        $projectManager = Role::firstOrCreate(['name' => 'project-manager', 'guard_name' => 'web']);
        $accountant = Role::firstOrCreate(['name' => 'accountant', 'guard_name' => 'web']);
        $employee = Role::firstOrCreate(['name' => 'employee', 'guard_name' => 'web']);
        $client = Role::firstOrCreate(['name' => 'client', 'guard_name' => 'web']);
        $superAdmin = Role::firstOrCreate(['name' => 'super-admin', 'guard_name' => 'web']);

        // Owner gets everything
        $owner->givePermissionTo(Permission::all());
        $superAdmin->givePermissionTo(Permission::all());

        // Sales Manager
        $salesManagerPerms = [
            'dashboard.view', 'leads.view', 'leads.create', 'leads.edit', 'leads.delete',
            'clients.view', 'clients.create', 'clients.edit',
            'quotations.view', 'quotations.create', 'quotations.edit', 'quotations.delete',
            'contracts.view', 'contracts.create',
            'products.view', 'meetings.view', 'meetings.create', 'meetings.edit',
            'opportunities.view', 'opportunities.create', 'opportunities.edit',
            'reminders.view', 'reminders.create', 'reminders.edit',
            'files.view', 'files.create', 'notifications.view',
            'calendar.view', 'calendar.create', 'analytics.view', 'ai.view',
        ];
        $salesManager->syncPermissions($salesManagerPerms);

        // Project Manager
        $pmPerms = [
            'dashboard.view', 'clients.view',
            'projects.view', 'projects.create', 'projects.edit',
            'tasks.view', 'tasks.create', 'tasks.edit', 'tasks.delete',
            'reports.view', 'reports.create', 'reports.edit',
            'deliverables.view', 'deliverables.create', 'deliverables.edit',
            'meetings.view', 'meetings.create', 'meetings.edit',
            'expenses.create', 'expenses.view',
            'files.view', 'files.create', 'notifications.view',
            'calendar.view', 'calendar.create', 'team.view', 'ai.view',
        ];
        $projectManager->syncPermissions($pmPerms);

        // Accountant
        $accountantPerms = [
            'dashboard.view', 'clients.view',
            'invoices.view', 'invoices.create', 'invoices.edit', 'invoices.delete',
            'invoices.view-financials', 'expenses.view', 'expenses.create',
            'expenses.edit', 'expenses.delete', 'analytics.view',
            'reports.view', 'files.view', 'notifications.view',
            'renewals.view', 'renewals.create', 'calendar.view',
        ];
        $accountant->syncPermissions($accountantPerms);

        // Employee
        $employeePerms = [
            'dashboard.view', 'tasks.view', 'tasks.edit',
            'reports.create', 'files.view', 'notifications.view',
            'calendar.view', 'knowledge.view',
        ];
        $employee->syncPermissions($employeePerms);

        // Client (portal only)
        $clientPerms = [
            'dashboard.view', 'projects.view', 'invoices.view',
            'quotations.view', 'contracts.view', 'reports.view',
            'files.view', 'deliverables.view',
        ];
        $client->syncPermissions($clientPerms);

        // Create default Owner user
        $ownerUser = User::firstOrCreate(
            ['email' => 'admin@madariktech.com'],
            [
                'name'       => 'مدير النظام',
                'name_ar'    => 'مدير النظام',
                'password'   => Hash::make('password123'),
                'position'   => 'Owner & CEO',
                'department' => 'Management',
                'mobile'     => '+971501234567',
                'is_active'  => true,
                'tenant_id'  => 1,
            ]
        );
        $ownerUser->assignRole('owner');
    }
}
