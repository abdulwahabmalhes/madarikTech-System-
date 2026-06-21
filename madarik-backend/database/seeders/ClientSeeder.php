<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Client;
use App\Models\User;

class ClientSeeder extends Seeder
{
    public function run(): void
    {
        $salesUserId = User::where('email', 'khalid@madariktech.com')->value('id') ?? 2;
        $pmUserId = User::where('email', 'sara@madariktech.com')->value('id') ?? 3;

        $clients = [
            ['name' => 'أحمد الشامسي', 'company_name' => 'مجموعة الشامسي للاستثمار', 'mobile' => '+971501111001', 'email' => 'ahmed@shamsi.ae', 'country' => 'UAE', 'city' => 'دبي', 'industry' => 'Real Estate', 'type' => 'company', 'status' => 'active', 'source' => 'Referral', 'assigned_to' => $salesUserId],
            ['name' => 'محمد البلوشي', 'company_name' => 'شركة بلوشي للتجارة', 'mobile' => '+971501111002', 'email' => 'mbalooshi@gmail.com', 'country' => 'UAE', 'city' => 'أبوظبي', 'industry' => 'Retail', 'type' => 'company', 'status' => 'active', 'source' => 'Meta Ads', 'assigned_to' => $salesUserId],
            ['name' => 'سلطان الكعبي', 'company_name' => null, 'mobile' => '+971501111003', 'email' => 'sultan.k@hotmail.com', 'country' => 'UAE', 'city' => 'الشارقة', 'industry' => 'Restaurant', 'type' => 'individual', 'status' => 'active', 'source' => 'Instagram Organic', 'assigned_to' => $salesUserId],
            ['name' => 'فهد الرشيدي', 'company_name' => 'مطاعم الرشيدي', 'mobile' => '+966501111004', 'email' => 'fahad@rashidi.sa', 'country' => 'KSA', 'city' => 'الرياض', 'industry' => 'Food & Beverage', 'type' => 'company', 'status' => 'active', 'source' => 'Google Ads', 'assigned_to' => $salesUserId],
            ['name' => 'نورة المطيري', 'company_name' => 'نورة للتجميل والعناية', 'mobile' => '+966501111005', 'email' => 'noura@beauty.sa', 'country' => 'KSA', 'city' => 'جدة', 'industry' => 'Beauty & Wellness', 'type' => 'company', 'status' => 'active', 'source' => 'Instagram Organic', 'assigned_to' => $salesUserId],
            ['name' => 'عبدالله الغامدي', 'company_name' => 'الغامدي للعقارات', 'mobile' => '+966501111006', 'email' => 'aghamdi@realestate.sa', 'country' => 'KSA', 'city' => 'الرياض', 'industry' => 'Real Estate', 'type' => 'company', 'status' => 'active', 'source' => 'Referral', 'assigned_to' => $pmUserId],
            ['name' => 'يوسف الحربي', 'company_name' => 'مجموعة الحربي للتقنية', 'mobile' => '+966501111007', 'email' => 'yharbi@techgroup.sa', 'country' => 'KSA', 'city' => 'الدمام', 'industry' => 'Technology', 'type' => 'company', 'status' => 'active', 'source' => 'LinkedIn', 'assigned_to' => $pmUserId],
            ['name' => 'حمد المنصوري', 'company_name' => 'شركة المنصوري للخدمات', 'mobile' => '+971501111008', 'email' => 'hmansouri@services.ae', 'country' => 'UAE', 'city' => 'دبي', 'industry' => 'Services', 'type' => 'company', 'status' => 'active', 'source' => 'Website Contact Form', 'assigned_to' => $salesUserId],
            ['name' => 'مريم الزهراني', 'company_name' => null, 'mobile' => '+966501111009', 'email' => 'maryam.z@gmail.com', 'country' => 'KSA', 'city' => 'مكة المكرمة', 'industry' => 'Education', 'type' => 'individual', 'status' => 'active', 'source' => 'Referral', 'assigned_to' => $salesUserId],
            ['name' => 'راشد الدوسري', 'company_name' => 'دوسري للمقاولات', 'mobile' => '+974501111010', 'email' => 'rdosari@contracting.qa', 'country' => 'Qatar', 'city' => 'الدوحة', 'industry' => 'Construction', 'type' => 'company', 'status' => 'active', 'source' => 'LinkedIn', 'assigned_to' => $pmUserId],
            ['name' => 'عمر العبدالله', 'company_name' => 'عمر للتطوير الرقمي', 'mobile' => '+971501111011', 'email' => 'omar@digitaldev.ae', 'country' => 'UAE', 'city' => 'دبي', 'industry' => 'Technology', 'type' => 'company', 'status' => 'active', 'source' => 'Google Ads', 'assigned_to' => $salesUserId],
            ['name' => 'لطيفة الجابري', 'company_name' => 'مركز لطيفة التعليمي', 'mobile' => '+971501111012', 'email' => 'latifa@edcenter.ae', 'country' => 'UAE', 'city' => 'الشارقة', 'industry' => 'Education', 'type' => 'company', 'status' => 'active', 'source' => 'Meta Ads', 'assigned_to' => $salesUserId],
            ['name' => 'سعيد النعيمي', 'company_name' => 'مجموعة النعيمي الطبية', 'mobile' => '+971501111013', 'email' => 'snaimi@medical.ae', 'country' => 'UAE', 'city' => 'أبوظبي', 'industry' => 'Healthcare', 'type' => 'company', 'status' => 'active', 'source' => 'Referral', 'assigned_to' => $pmUserId],
            ['name' => 'خديجة البريكي', 'company_name' => null, 'mobile' => '+971501111014', 'email' => 'khadija.b@outlook.com', 'country' => 'UAE', 'city' => 'عجمان', 'industry' => 'Fashion', 'type' => 'individual', 'status' => 'active', 'source' => 'Instagram Organic', 'assigned_to' => $salesUserId],
            ['name' => 'ماجد الشهري', 'company_name' => 'شهري للأغذية والمشروبات', 'mobile' => '+966501111015', 'email' => 'majed@shehri.sa', 'country' => 'KSA', 'city' => 'الرياض', 'industry' => 'Food & Beverage', 'type' => 'company', 'status' => 'active', 'source' => 'Google Ads', 'assigned_to' => $salesUserId],
            ['name' => 'ريم الفهد', 'company_name' => 'استوديو ريم للتصميم', 'mobile' => '+966501111016', 'email' => 'reem@design.sa', 'country' => 'KSA', 'city' => 'جدة', 'industry' => 'Design', 'type' => 'company', 'status' => 'active', 'source' => 'Instagram Organic', 'assigned_to' => $salesUserId],
            ['name' => 'طارق السبيعي', 'company_name' => 'السبيعي للاستشارات', 'mobile' => '+966501111017', 'email' => 'tariq@subaie.sa', 'country' => 'KSA', 'city' => 'الرياض', 'industry' => 'Consulting', 'type' => 'company', 'status' => 'on-hold', 'source' => 'Cold Outreach', 'assigned_to' => $pmUserId],
            ['name' => 'بشار الكويتي', 'company_name' => 'شركة بشار للتكنولوجيا', 'mobile' => '+96501111018', 'email' => 'bashar@tech.kw', 'country' => 'Kuwait', 'city' => 'الكويت', 'industry' => 'Technology', 'type' => 'company', 'status' => 'active', 'source' => 'LinkedIn', 'assigned_to' => $pmUserId],
            ['name' => 'هند العوضي', 'company_name' => null, 'mobile' => '+96501111019', 'email' => 'hind.a@yahoo.com', 'country' => 'Kuwait', 'city' => 'الكويت', 'industry' => 'Retail', 'type' => 'individual', 'status' => 'active', 'source' => 'Referral', 'assigned_to' => $salesUserId],
            ['name' => 'وليد الحسن', 'company_name' => 'الحسن للتجارة الإلكترونية', 'mobile' => '+971501111020', 'email' => 'walid@ecom.ae', 'country' => 'UAE', 'city' => 'دبي', 'industry' => 'E-Commerce', 'type' => 'company', 'status' => 'active', 'source' => 'Meta Ads', 'assigned_to' => $salesUserId],
            ['name' => 'أسماء العمري', 'company_name' => 'مركز أسماء للتدريب', 'mobile' => '+966501111021', 'email' => 'asma@training.sa', 'country' => 'KSA', 'city' => 'المدينة المنورة', 'industry' => 'Education', 'type' => 'company', 'status' => 'active', 'source' => 'Website Contact Form', 'assigned_to' => $salesUserId],
            ['name' => 'ناصر القحطاني', 'company_name' => 'القحطاني للمقاولات والبناء', 'mobile' => '+966501111022', 'email' => 'nasser@build.sa', 'country' => 'KSA', 'city' => 'الدمام', 'industry' => 'Construction', 'type' => 'company', 'status' => 'closed', 'source' => 'Referral', 'assigned_to' => $pmUserId],
            ['name' => 'زينب الأنصاري', 'company_name' => 'متجر زينب الإلكتروني', 'mobile' => '+971501111023', 'email' => 'zainab@store.ae', 'country' => 'UAE', 'city' => 'دبي', 'industry' => 'E-Commerce', 'type' => 'company', 'status' => 'active', 'source' => 'Instagram Organic', 'assigned_to' => $salesUserId],
            ['name' => 'حسين المرزوقي', 'company_name' => 'مرزوقي للعقارات والتطوير', 'mobile' => '+971501111024', 'email' => 'hussain@marzouqi.ae', 'country' => 'UAE', 'city' => 'أبوظبي', 'industry' => 'Real Estate', 'type' => 'company', 'status' => 'active', 'source' => 'LinkedIn', 'assigned_to' => $pmUserId],
            ['name' => 'دلال الراشد', 'company_name' => 'دلال للتسويق الرقمي', 'mobile' => '+966501111025', 'email' => 'dalal@marketing.sa', 'country' => 'KSA', 'city' => 'الرياض', 'industry' => 'Marketing', 'type' => 'company', 'status' => 'active', 'source' => 'Google Ads', 'assigned_to' => $salesUserId],
        ];

        foreach ($clients as $clientData) {
            $clientData['tenant_id'] = 1;
            $clientData['created_by'] = $salesUserId;
            Client::firstOrCreate(['mobile' => $clientData['mobile']], $clientData);
        }
    }
}
