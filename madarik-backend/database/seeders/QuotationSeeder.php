<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Quotation;
use App\Models\QuotationItem;
use App\Models\Client;
use App\Models\User;

class QuotationSeeder extends Seeder
{
    public function run(): void
    {
        $salesUserId = User::where('email', 'khalid@madariktech.com')->value('id') ?? 2;
        $clients = Client::take(15)->get();

        $quotations = [
            ['project_name' => 'تطوير موقع احترافي', 'total' => 18000, 'status' => 'accepted', 'tax' => 5, 'items' => [['name' => 'تصميم الموقع', 'qty' => 1, 'price' => 8000], ['name' => 'تطوير الواجهة الأمامية', 'qty' => 1, 'price' => 6000], ['name' => 'الخلفية والـ API', 'qty' => 1, 'price' => 4000]]],
            ['project_name' => 'تطبيق جوال iOS & Android', 'total' => 45000, 'status' => 'accepted', 'tax' => 5, 'items' => [['name' => 'تصميم UI/UX', 'qty' => 1, 'price' => 10000], ['name' => 'تطوير iOS', 'qty' => 1, 'price' => 15000], ['name' => 'تطوير Android', 'qty' => 1, 'price' => 15000], ['name' => 'نشر وإطلاق', 'qty' => 1, 'price' => 5000]]],
            ['project_name' => 'نظام ERP مخصص', 'total' => 80000, 'status' => 'sent', 'tax' => 5, 'items' => [['name' => 'تحليل الأعمال', 'qty' => 1, 'price' => 10000], ['name' => 'تطوير النظام', 'qty' => 1, 'price' => 50000], ['name' => 'التدريب والدعم', 'qty' => 1, 'price' => 20000]]],
            ['project_name' => 'هوية بصرية متكاملة', 'total' => 9500, 'status' => 'accepted', 'tax' => 5, 'items' => [['name' => 'تصميم الشعار', 'qty' => 1, 'price' => 3000], ['name' => 'دليل الهوية', 'qty' => 1, 'price' => 3500], ['name' => 'مواد التسويق', 'qty' => 1, 'price' => 3000]]],
            ['project_name' => 'إدارة السوشيال ميديا (3 أشهر)', 'total' => 9000, 'status' => 'accepted', 'tax' => 5, 'items' => [['name' => 'إدارة منصات التواصل', 'qty' => 3, 'price' => 3000]]],
            ['project_name' => 'حملة إعلانات Meta', 'total' => 6000, 'status' => 'draft', 'tax' => 5, 'items' => [['name' => 'إدارة الحملة', 'qty' => 1, 'price' => 2000], ['name' => 'إنشاء المحتوى الإبداعي', 'qty' => 1, 'price' => 2000], ['name' => 'تقرير الأداء', 'qty' => 2, 'price' => 1000]]],
            ['project_name' => 'متجر إلكتروني + بوابة دفع', 'total' => 28000, 'status' => 'accepted', 'tax' => 5, 'items' => [['name' => 'تطوير المتجر', 'qty' => 1, 'price' => 18000], ['name' => 'بوابات الدفع', 'qty' => 1, 'price' => 5000], ['name' => 'التدريب والإطلاق', 'qty' => 1, 'price' => 5000]]],
            ['project_name' => 'وكيل واتساب AI', 'total' => 25000, 'status' => 'sent', 'tax' => 5, 'items' => [['name' => 'تطوير الوكيل الذكي', 'qty' => 1, 'price' => 15000], ['name' => 'التكامل مع الأنظمة', 'qty' => 1, 'price' => 7000], ['name' => 'التدريب والاختبار', 'qty' => 1, 'price' => 3000]]],
            ['project_name' => 'خدمات SEO (6 أشهر)', 'total' => 15000, 'status' => 'under-review', 'tax' => 5, 'items' => [['name' => 'تحسين محركات البحث', 'qty' => 6, 'price' => 2500]]],
            ['project_name' => 'منصة تعليمية إلكترونية', 'total' => 35000, 'status' => 'draft', 'tax' => 5, 'items' => [['name' => 'تطوير المنصة', 'qty' => 1, 'price' => 25000], ['name' => 'تطبيق الجوال', 'qty' => 1, 'price' => 10000]]],
        ];

        foreach ($quotations as $i => $data) {
            $client = $clients[$i % $clients->count()];
            $subtotal = array_sum(array_map(fn($item) => $item['qty'] * $item['price'], $data['items']));
            $taxAmount = $subtotal * ($data['tax'] / 100);
            $total = $subtotal + $taxAmount;

            $quotation = Quotation::create([
                'tenant_id'        => 1,
                'quotation_number' => 'QT-2026-' . str_pad($i + 1, 4, '0', STR_PAD_LEFT),
                'client_id'        => $client->id,
                'project_name'     => $data['project_name'],
                'issue_date'       => now()->subDays(rand(5, 60))->format('Y-m-d'),
                'expiry_date'      => now()->addDays(rand(15, 30))->format('Y-m-d'),
                'currency_id'      => 1,
                'subtotal'         => $subtotal,
                'tax_percent'      => $data['tax'],
                'tax_amount'       => $taxAmount,
                'total'            => $total,
                'payment_terms'    => '50% دفعة مقدمة، 50% عند التسليم',
                'status'           => $data['status'],
                'created_by'       => $salesUserId,
                'sent_at'          => in_array($data['status'], ['sent', 'accepted', 'under-review']) ? now()->subDays(rand(1, 10)) : null,
            ]);

            foreach ($data['items'] as $j => $item) {
                QuotationItem::create([
                    'quotation_id' => $quotation->id,
                    'type'         => 'service',
                    'name'         => $item['name'],
                    'quantity'     => $item['qty'],
                    'unit_price'   => $item['price'],
                    'total'        => $item['qty'] * $item['price'],
                    'sort_order'   => $j + 1,
                ]);
            }
        }
    }
}
