<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Payment;
use App\Models\Project;
use App\Models\User;

class InvoiceSeeder extends Seeder
{
    public function run(): void
    {
        $accountant = User::where('email', 'fatima@madariktech.com')->value('id') ?? 3;
        $projects = Project::with('client')->take(12)->get();

        foreach ($projects as $i => $project) {
            $subtotal = $project->contract_value * 0.5;
            $taxAmount = $subtotal * 0.05;
            $total = $subtotal + $taxAmount;

            $isPaid = in_array($project->status, ['completed', 'in-progress']) && $i % 3 !== 0;
            $isOverdue = !$isPaid && $i % 4 === 0;

            $invoice = Invoice::create([
                'tenant_id'      => 1,
                'invoice_number' => 'INV-2026-' . str_pad($i + 1, 4, '0', STR_PAD_LEFT),
                'client_id'      => $project->client_id,
                'project_id'     => $project->id,
                'issue_date'     => $project->start_date->format('Y-m-d'),
                'due_date'       => $isOverdue ? now()->subDays(rand(5, 30))->format('Y-m-d') : now()->addDays(30)->format('Y-m-d'),
                'currency_id'    => 1,
                'subtotal'       => $subtotal,
                'tax_percent'    => 5,
                'tax_amount'     => $taxAmount,
                'total'          => $total,
                'paid_amount'    => $isPaid ? $total : 0,
                'remaining_amount' => $isPaid ? 0 : $total,
                'notes'          => 'دفعة أولى - 50% من قيمة العقد',
                'terms'          => 'السداد خلال 30 يوماً من تاريخ الفاتورة',
                'status'         => $isPaid ? 'paid' : ($isOverdue ? 'overdue' : 'sent'),
                'sent_at'        => now()->subDays(rand(2, 15)),
                'created_by'     => $accountant,
            ]);

            InvoiceItem::create([
                'invoice_id'  => $invoice->id,
                'description' => 'دفعة أولى - ' . $project->name,
                'quantity'    => 1,
                'unit_price'  => $subtotal,
                'total'       => $subtotal,
                'sort_order'  => 1,
            ]);

            if ($isPaid) {
                Payment::create([
                    'tenant_id'    => 1,
                    'invoice_id'   => $invoice->id,
                    'client_id'    => $project->client_id,
                    'amount'       => $total,
                    'currency_id'  => 1,
                    'payment_date' => now()->subDays(rand(1, 20))->format('Y-m-d'),
                    'method'       => ['bank_transfer', 'cash', 'cheque'][rand(0, 2)],
                    'reference'    => 'REF-' . strtoupper(substr(md5($invoice->id), 0, 8)),
                    'recorded_by'  => $accountant,
                ]);
            }
        }
    }
}
