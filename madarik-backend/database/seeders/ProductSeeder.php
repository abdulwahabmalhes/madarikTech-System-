<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            // SaaS Products
            ['name' => 'POS Pixel Pro', 'name_ar' => 'بوس بيكسل برو', 'category' => 'saas', 'pricing_model' => 'monthly', 'base_price' => 299, 'short_description' => 'نظام نقاط بيع متكامل للمطاعم والمحلات', 'features' => ['إدارة المخزون', 'تقارير المبيعات', 'دعم فني 24/7', 'تطبيق جوال'], 'is_active' => true],
            ['name' => 'PRO SYS', 'name_ar' => 'برو سيس', 'category' => 'saas', 'pricing_model' => 'monthly', 'base_price' => 499, 'short_description' => 'نظام إدارة الأعمال الشامل', 'features' => ['CRM متكامل', 'إدارة مشاريع', 'فواتير ومحاسبة', 'تقارير متقدمة'], 'is_active' => true],
            ['name' => 'WhatsApp AI Agent', 'name_ar' => 'وكيل واتساب الذكي', 'category' => 'saas', 'pricing_model' => 'monthly', 'base_price' => 399, 'short_description' => 'أتمتة خدمة العملاء عبر واتساب بالذكاء الاصطناعي', 'features' => ['ردود تلقائية', 'ذكاء اصطناعي', 'تكامل مع الأنظمة', 'لوحة تحكم'], 'is_active' => true],

            // Development Services
            ['name' => 'تطوير موقع إلكتروني', 'name_ar' => 'تطوير موقع إلكتروني', 'category' => 'service', 'pricing_model' => 'fixed', 'base_price' => 15000, 'short_description' => 'تصميم وتطوير مواقع احترافية متجاوبة', 'features' => ['تصميم مخصص', 'SEO محسّن', 'لوحة تحكم', 'دعم 3 أشهر'], 'is_active' => true],
            ['name' => 'تطوير تطبيق جوال', 'name_ar' => 'تطوير تطبيق جوال', 'category' => 'service', 'pricing_model' => 'fixed', 'base_price' => 35000, 'short_description' => 'تطبيقات iOS و Android احترافية', 'features' => ['iOS & Android', 'UI/UX احترافي', 'API backend', 'نشر على المتاجر'], 'is_active' => true],
            ['name' => 'تطوير متجر إلكتروني', 'name_ar' => 'تطوير متجر إلكتروني', 'category' => 'service', 'pricing_model' => 'fixed', 'base_price' => 20000, 'short_description' => 'متاجر إلكترونية متكاملة مع بوابات الدفع', 'features' => ['بوابات دفع', 'إدارة مخزون', 'SEO محسّن', 'تقارير مبيعات'], 'is_active' => true],
            ['name' => 'تطوير نظام ERP', 'name_ar' => 'تطوير نظام ERP', 'category' => 'service', 'pricing_model' => 'custom', 'base_price' => null, 'short_description' => 'أنظمة تخطيط موارد المؤسسات المخصصة', 'features' => ['تحليل الاحتياجات', 'تطوير مخصص', 'تدريب الفريق', 'دعم مستمر'], 'is_active' => true],
            ['name' => 'تطوير نظام CRM', 'name_ar' => 'تطوير نظام CRM', 'category' => 'service', 'pricing_model' => 'custom', 'base_price' => null, 'short_description' => 'أنظمة إدارة علاقات العملاء المخصصة', 'features' => ['إدارة عملاء', 'خط مبيعات', 'تقارير وتحليلات', 'تكامل مع الأنظمة'], 'is_active' => true],
            ['name' => 'حلول الذكاء الاصطناعي', 'name_ar' => 'حلول الذكاء الاصطناعي', 'category' => 'service', 'pricing_model' => 'custom', 'base_price' => null, 'short_description' => 'تطوير حلول ذكاء اصطناعي مخصصة', 'features' => ['نماذج ML', 'معالجة لغات', 'أتمتة ذكية', 'تكامل API'], 'is_active' => true],

            // Marketing Services
            ['name' => 'إدارة منصات التواصل الاجتماعي', 'name_ar' => 'إدارة منصات التواصل الاجتماعي', 'category' => 'service', 'pricing_model' => 'monthly', 'base_price' => 3000, 'short_description' => 'إدارة احترافية لحساباتك على منصات التواصل', 'features' => ['إنشاء محتوى', 'جدولة نشر', 'تقارير شهرية', 'تفاعل مع الجمهور'], 'is_active' => true],
            ['name' => 'خدمات SEO', 'name_ar' => 'خدمات تحسين محركات البحث', 'category' => 'service', 'pricing_model' => 'monthly', 'base_price' => 2500, 'short_description' => 'تحسين ترتيب موقعك في نتائج البحث', 'features' => ['تحليل كلمات مفتاحية', 'تحسين المحتوى', 'بناء روابط', 'تقارير شهرية'], 'is_active' => true],
            ['name' => 'إدارة حملات الإعلانات الرقمية', 'name_ar' => 'إدارة حملات الإعلانات الرقمية', 'category' => 'service', 'pricing_model' => 'monthly', 'base_price' => 2000, 'short_description' => 'حملات إعلانية محترفة على Meta وGoogle', 'features' => ['استهداف دقيق', 'إعلانات إبداعية', 'تحسين مستمر', 'تقارير أداء'], 'is_active' => true],

            // Design Services
            ['name' => 'تصميم هوية بصرية', 'name_ar' => 'تصميم هوية بصرية', 'category' => 'service', 'pricing_model' => 'fixed', 'base_price' => 8000, 'short_description' => 'هوية بصرية احترافية ومتكاملة', 'features' => ['شعار', 'ألوان وخطوط', 'دليل الهوية', 'مواد تسويقية'], 'is_active' => true],
            ['name' => 'تصميم UI/UX', 'name_ar' => 'تصميم واجهات المستخدم', 'category' => 'service', 'pricing_model' => 'fixed', 'base_price' => 12000, 'short_description' => 'تصميم واجهات مستخدم احترافية وجذابة', 'features' => ['بحث المستخدم', 'Wireframes', 'نماذج تفاعلية', 'مكتبة تصميم'], 'is_active' => true],

            // Support Services
            ['name' => 'صيانة وإدارة النظام', 'name_ar' => 'صيانة وإدارة النظام', 'category' => 'maintenance', 'pricing_model' => 'monthly', 'base_price' => 1500, 'short_description' => 'صيانة شاملة وإدارة استباقية لأنظمتك', 'features' => ['مراقبة 24/7', 'نسخ احتياطي', 'تحديثات أمنية', 'دعم تقني'], 'is_active' => true],
            ['name' => 'استشارات تقنية', 'name_ar' => 'استشارات تقنية', 'category' => 'service', 'pricing_model' => 'hourly', 'base_price' => 500, 'short_description' => 'استشارات تقنية متخصصة من خبراء مدارك', 'features' => ['تحليل الاحتياجات', 'خارطة طريق تقنية', 'توصيات متخصصة', 'تقرير مفصل'], 'is_active' => true],
        ];

        foreach ($products as $product) {
            $product['tenant_id'] = 1;
            $product['currency_id'] = 1; // AED
            $product['features'] = json_encode($product['features']);
            Product::firstOrCreate(['name' => $product['name']], $product);
        }
    }
}
