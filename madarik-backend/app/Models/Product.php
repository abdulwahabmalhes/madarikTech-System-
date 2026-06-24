<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'tenant_id', 'created_by',
        'name', 'name_ar', 'code', 'category',
        'short_description', 'description',
        'pricing_model', 'base_price', 'currency_code',
        'features', 'deliverables', 'unit',
        'is_active', 'sort_order',
        'setup_fee', 'setup_days',
        'min_contract_months',
        'video_url', 'documentation_url', 'delivery_method', 'ideas',
    ];

    protected $casts = [
        'features' => 'array',
        'deliverables' => 'array',
        'base_price' => 'decimal:2',
        'setup_fee' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function createdBy(): BelongsTo { return $this->belongsTo(User::class, 'created_by'); }
    public function tenant(): BelongsTo { return $this->belongsTo(Tenant::class); }
    
    public function invoiceItems()
    {
        return $this->hasMany(InvoiceItem::class);
    }

    public function invoices()
    {
        // Get unique invoices through invoice items
        return $this->hasManyThrough(Invoice::class, InvoiceItem::class, 'product_id', 'id', 'id', 'invoice_id')
                    ->distinct();
    }
}
