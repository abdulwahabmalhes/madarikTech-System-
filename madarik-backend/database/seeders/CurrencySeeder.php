<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Currency;

class CurrencySeeder extends Seeder
{
    public function run(): void
    {
        $currencies = [
            ['code' => 'AED', 'name' => 'UAE Dirham', 'name_ar' => 'درهم إماراتي', 'symbol' => 'د.إ', 'exchange_rate' => 1, 'is_default' => true, 'is_active' => true],
            ['code' => 'SAR', 'name' => 'Saudi Riyal', 'name_ar' => 'ريال سعودي', 'symbol' => 'ر.س', 'exchange_rate' => 1.02, 'is_default' => false, 'is_active' => true],
            ['code' => 'USD', 'name' => 'US Dollar', 'name_ar' => 'دولار أمريكي', 'symbol' => '$', 'exchange_rate' => 0.272, 'is_default' => false, 'is_active' => true],
            ['code' => 'KWD', 'name' => 'Kuwaiti Dinar', 'name_ar' => 'دينار كويتي', 'symbol' => 'د.ك', 'exchange_rate' => 0.083, 'is_default' => false, 'is_active' => true],
            ['code' => 'EUR', 'name' => 'Euro', 'name_ar' => 'يورو', 'symbol' => '€', 'exchange_rate' => 0.25, 'is_default' => false, 'is_active' => true],
            ['code' => 'GBP', 'name' => 'British Pound', 'name_ar' => 'جنيه إسترليني', 'symbol' => '£', 'exchange_rate' => 0.21, 'is_default' => false, 'is_active' => false],
        ];

        foreach ($currencies as $currency) {
            Currency::firstOrCreate(['code' => $currency['code']], $currency);
        }
    }
}
