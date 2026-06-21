<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use App\Http\Controllers\Controller;

class DatabaseResetController extends Controller
{
    /**
     * Clear all business data (clients, projects, etc.) but keep users and settings.
     */
    public function reset(Request $request)
    {
        Schema::disableForeignKeyConstraints();
        
        $tables = [
            'leads', 'clients', 'projects', 'tasks', 'quotations', 
            'quotation_items', 'quotation_sections', 'contracts', 
            'invoices', 'invoice_items', 'payments', 'expenses', 
            'incomes', 'daily_reports', 'meetings', 'deliverables', 
            'goals', 'renewals', 'support_tickets', 'notifications',
            'assets', 'opportunities', 'reminders', 'files', 'activities',
            'products', 'product_categories'
        ];

        foreach ($tables as $table) {
            if (Schema::hasTable($table)) {
                DB::table($table)->truncate();
            }
        }

        Schema::enableForeignKeyConstraints();

        return response()->json([
            'message' => 'Business data has been cleared successfully.',
        ]);
    }

    /**
     * Inject dummy data for demo purposes.
     */
    public function seedDummy(Request $request)
    {
        \Illuminate\Support\Facades\Artisan::call('db:seed', ['--class' => 'ProductSeeder']);
        \Illuminate\Support\Facades\Artisan::call('db:seed', ['--class' => 'ClientSeeder']);
        \Illuminate\Support\Facades\Artisan::call('db:seed', ['--class' => 'LeadSeeder']);
        \Illuminate\Support\Facades\Artisan::call('db:seed', ['--class' => 'ProjectSeeder']);
        \Illuminate\Support\Facades\Artisan::call('db:seed', ['--class' => 'QuotationSeeder']);
        \Illuminate\Support\Facades\Artisan::call('db:seed', ['--class' => 'ContractSeeder']);
        \Illuminate\Support\Facades\Artisan::call('db:seed', ['--class' => 'InvoiceSeeder']);
        \Illuminate\Support\Facades\Artisan::call('db:seed', ['--class' => 'TaskSeeder']);

        return response()->json([
            'message' => 'Demo data has been injected successfully.',
        ]);
    }
}
