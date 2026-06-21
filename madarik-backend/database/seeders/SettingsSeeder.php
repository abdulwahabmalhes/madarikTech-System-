<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Setting;

class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            // Company Profile
            ['group' => 'company', 'key' => 'company_name_en', 'value' => 'Madarik Tech'],
            ['group' => 'company', 'key' => 'company_name_ar', 'value' => 'مدارك تك'],
            ['group' => 'company', 'key' => 'license_number', 'value' => 'CN-2024-001234'],
            ['group' => 'company', 'key' => 'phone', 'value' => '+971 50 123 4567'],
            ['group' => 'company', 'key' => 'whatsapp', 'value' => '+971501234567'],
            ['group' => 'company', 'key' => 'email', 'value' => 'info@madariktech.com'],
            ['group' => 'company', 'key' => 'website', 'value' => 'https://madariktech.com'],
            ['group' => 'company', 'key' => 'address_en', 'value' => 'Dubai, United Arab Emirates'],
            ['group' => 'company', 'key' => 'address_ar', 'value' => 'دبي، الإمارات العربية المتحدة'],
            ['group' => 'company', 'key' => 'country', 'value' => 'UAE'],

            // Branding
            ['group' => 'branding', 'key' => 'primary_color', 'value' => '#1E40AF'],
            ['group' => 'branding', 'key' => 'secondary_color', 'value' => '#0891B2'],
            ['group' => 'branding', 'key' => 'logo_path', 'value' => ''],
            ['group' => 'branding', 'key' => 'signature_path', 'value' => ''],
            ['group' => 'branding', 'key' => 'stamp_path', 'value' => ''],

            // Document Defaults
            ['group' => 'documents', 'key' => 'default_currency', 'value' => 'AED'],
            ['group' => 'documents', 'key' => 'default_vat_percent', 'value' => '5'],
            ['group' => 'documents', 'key' => 'default_payment_terms', 'value' => 'Payment due within 30 days'],
            ['group' => 'documents', 'key' => 'invoice_prefix', 'value' => 'INV'],
            ['group' => 'documents', 'key' => 'quotation_prefix', 'value' => 'QT'],
            ['group' => 'documents', 'key' => 'contract_prefix', 'value' => 'CT'],
            ['group' => 'documents', 'key' => 'project_prefix', 'value' => 'PRJ'],
            ['group' => 'documents', 'key' => 'lead_prefix', 'value' => 'LD'],
            ['group' => 'documents', 'key' => 'meeting_prefix', 'value' => 'MTG'],
            ['group' => 'documents', 'key' => 'default_quotation_terms', 'value' => "This quotation is valid for 30 days from the date of issue.\nPrices are subject to change after expiry date.\nPayment terms: 50% advance, 50% on delivery."],
            ['group' => 'documents', 'key' => 'default_invoice_terms', 'value' => "Payment is due within 30 days of invoice date.\nLate payments may incur a 2% monthly penalty.\nBank transfer details available upon request."],

            // Notifications
            ['group' => 'notifications', 'key' => 'payment_reminder_enabled', 'value' => '1'],
            ['group' => 'notifications', 'key' => 'renewal_reminder_enabled', 'value' => '1'],
            ['group' => 'notifications', 'key' => 'task_overdue_reminder', 'value' => '1'],

            // System
            ['group' => 'system', 'key' => 'default_locale', 'value' => 'ar'],
            ['group' => 'system', 'key' => 'dark_mode_default', 'value' => '0'],
        ];

        foreach ($settings as $setting) {
            Setting::firstOrCreate(
                ['key' => $setting['key'], 'tenant_id' => 1],
                ['group' => $setting['group'], 'value' => $setting['value'], 'tenant_id' => 1]
            );
        }
    }
}
