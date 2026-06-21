<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Models\User;
use App\Models\Currency;
use App\Models\Setting;
use App\Models\Product;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            CurrencySeeder::class,
            RolePermissionSeeder::class,
            SettingsSeeder::class,
            UserSeeder::class,
            ProductSeeder::class,
            ClientSeeder::class,
            LeadSeeder::class,
            ProjectSeeder::class,
            QuotationSeeder::class,
            ContractSeeder::class,
            InvoiceSeeder::class,
            TaskSeeder::class,
        ]);
    }
}
