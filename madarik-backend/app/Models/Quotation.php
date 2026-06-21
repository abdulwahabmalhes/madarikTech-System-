<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Quotation extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'tenant_id', 'client_id', 'lead_id', 'project_id', 'created_by',
        'quotation_number', 'project_name', 'subject', 'issue_date', 'expiry_date',
        'subtotal', 'discount_type', 'discount_value', 'discount_percent',
        'discount_amount',
        'tax_percent',
        'tax_amount',
        'total', 'currency_code',
        'payment_terms',
        'notes', 'terms',
        'terms_conditions',
        'status',
        'pdf_path',
        'sent_at', 'accepted_at', 'rejected_at', 'rejection_reason',
        'created_by',
        'project_overview',
        'project_goals',
        'project_type',
        'execution_days',
        'delivery_date',
        'support_duration',
        'support_includes',
        'support_excludes',
        'ui_ux_design',
        'deliverables',
        'payment_mechanism',
    ];

    protected $casts = [
        'issue_date' => 'date',
        'expiry_date' => 'date',
        'delivery_date' => 'date',
        'sent_at' => 'datetime',
        'accepted_at' => 'datetime',
        'rejected_at' => 'datetime',
        'subtotal' => 'decimal:2',
        'discount_percent' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'tax_percent' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'total' => 'decimal:2',
        'support_includes' => 'array',
        'support_excludes' => 'array',
        'ui_ux_design' => 'array',
        'deliverables' => 'array',
        'payment_mechanism' => 'array',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function items()
    {
        return $this->hasMany(QuotationItem::class);
    }

    public function sections()
    {
        return $this->hasMany(QuotationSection::class)->orderBy('order');
    }

    public function lead(): BelongsTo { return $this->belongsTo(Lead::class); }
    public function project(): BelongsTo { return $this->belongsTo(Project::class); }
    public function createdBy(): BelongsTo { return $this->belongsTo(User::class, 'created_by'); }
    public function tenant(): BelongsTo { return $this->belongsTo(Tenant::class); }
}
