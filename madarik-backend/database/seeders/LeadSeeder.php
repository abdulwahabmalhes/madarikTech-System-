<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Lead;
use App\Models\User;

class LeadSeeder extends Seeder
{
    public function run(): void
    {
        $salesUserId = User::where('email', 'khalid@madariktech.com')->value('id') ?? 2;
        $ownerUserId = User::where('email', 'admin@madariktech.com')->value('id') ?? 1;

        $stages = ['new', 'contacted', 'follow-up', 'meeting-scheduled', 'proposal-sent', 'negotiation', 'won', 'lost'];
        $sources = ['Meta Ads', 'Google Ads', 'Instagram Organic', 'LinkedIn', 'Website Contact Form', 'WhatsApp Direct', 'Referral', 'Cold Outreach', 'Exhibition / Event'];
        $priorities = ['low', 'normal', 'high'];

        $leads = [
            ['name' => 'أيمن البكري', 'company_name' => 'مجموعة البكري', 'mobile' => '+966551234501', 'source' => 'Meta Ads', 'stage' => 'new', 'priority' => 'high', 'estimated_value' => 25000, 'country' => 'KSA'],
            ['name' => 'سلمى الكيلاني', 'company_name' => null, 'mobile' => '+971551234502', 'source' => 'Instagram Organic', 'stage' => 'contacted', 'priority' => 'normal', 'estimated_value' => 8000, 'country' => 'UAE'],
            ['name' => 'فيصل الأمير', 'company_name' => 'شركة الأمير للتجارة', 'mobile' => '+966551234503', 'source' => 'Google Ads', 'stage' => 'follow-up', 'priority' => 'high', 'estimated_value' => 45000, 'country' => 'KSA'],
            ['name' => 'هالة السيد', 'company_name' => 'مركز هالة الطبي', 'mobile' => '+971551234504', 'source' => 'Referral', 'stage' => 'meeting-scheduled', 'priority' => 'high', 'estimated_value' => 35000, 'country' => 'UAE'],
            ['name' => 'نادر الخليل', 'company_name' => 'الخليل للاستشارات', 'mobile' => '+966551234505', 'source' => 'LinkedIn', 'stage' => 'proposal-sent', 'priority' => 'normal', 'estimated_value' => 60000, 'country' => 'KSA'],
            ['name' => 'رانيا حسن', 'company_name' => null, 'mobile' => '+971551234506', 'source' => 'Meta Ads', 'stage' => 'negotiation', 'priority' => 'high', 'estimated_value' => 15000, 'country' => 'UAE'],
            ['name' => 'كريم الجمال', 'company_name' => 'شركة الجمال للأزياء', 'mobile' => '+96551234507', 'source' => 'Instagram Organic', 'stage' => 'won', 'priority' => 'normal', 'estimated_value' => 12000, 'country' => 'Kuwait'],
            ['name' => 'ليلى العسكري', 'company_name' => 'مدرسة العسكري الخاصة', 'mobile' => '+966551234508', 'source' => 'Website Contact Form', 'stage' => 'lost', 'priority' => 'low', 'estimated_value' => 20000, 'country' => 'KSA'],
            ['name' => 'تامر رضوان', 'company_name' => 'رضوان للتصنيع', 'mobile' => '+971551234509', 'source' => 'Cold Outreach', 'stage' => 'new', 'priority' => 'normal', 'estimated_value' => 80000, 'country' => 'UAE'],
            ['name' => 'منيرة الصالح', 'company_name' => null, 'mobile' => '+966551234510', 'source' => 'Referral', 'stage' => 'contacted', 'priority' => 'high', 'estimated_value' => 18000, 'country' => 'KSA'],
            ['name' => 'وائل الخطيب', 'company_name' => 'الخطيب للمقاولات', 'mobile' => '+974551234511', 'source' => 'LinkedIn', 'stage' => 'follow-up', 'priority' => 'high', 'estimated_value' => 120000, 'country' => 'Qatar'],
            ['name' => 'شيماء النور', 'company_name' => 'مركز النور للجمال', 'mobile' => '+971551234512', 'source' => 'Meta Ads', 'stage' => 'new', 'priority' => 'normal', 'estimated_value' => 9000, 'country' => 'UAE'],
            ['name' => 'إبراهيم الوهيبي', 'company_name' => 'الوهيبي للعقارات', 'mobile' => '+968551234513', 'source' => 'Google Ads', 'stage' => 'proposal-sent', 'priority' => 'high', 'estimated_value' => 95000, 'country' => 'Oman'],
            ['name' => 'صفاء المالكي', 'company_name' => null, 'mobile' => '+966551234514', 'source' => 'WhatsApp Direct', 'stage' => 'contacted', 'priority' => 'normal', 'estimated_value' => 7500, 'country' => 'KSA'],
            ['name' => 'جاسم الكوهجي', 'company_name' => 'شركة الكوهجي للتقنية', 'mobile' => '+97355123415', 'source' => 'Exhibition / Event', 'stage' => 'meeting-scheduled', 'priority' => 'high', 'estimated_value' => 150000, 'country' => 'Bahrain'],
        ];

        foreach ($leads as $i => $leadData) {
            $leadData['tenant_id'] = 1;
            $leadData['assigned_to'] = $salesUserId;
            $leadData['created_by'] = $salesUserId;
            $leadData['currency_id'] = 1; // AED
            $leadData['lead_number'] = 'LD-2026-' . str_pad($i + 1, 4, '0', STR_PAD_LEFT);
            $leadData['expected_close_date'] = now()->addDays(rand(5, 60))->format('Y-m-d');
            $leadData['whatsapp'] = $leadData['mobile'];

            Lead::firstOrCreate(['mobile' => $leadData['mobile']], $leadData);
        }
    }
}
