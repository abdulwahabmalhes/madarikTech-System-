<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Invoice extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'tenant_id', 'invoice_number', 'client_id', 'project_id',
        'contract_id', 'quotation_id', 'issue_date', 'due_date',
        'currency_id', 'subtotal', 'discount_amount', 'tax_percent', 'tax_amount',
        'total', 'paid_amount', 'remaining_amount', 'notes', 'terms',
        'status', 'pdf_path', 'sent_at', 'created_by',
    ];

    protected $casts = [
        'issue_date'      => 'date',
        'due_date'        => 'date',
        'sent_at'         => 'datetime',
        'subtotal'        => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'tax_amount'      => 'decimal:2',
        'total'           => 'decimal:2',
        'paid_amount'     => 'decimal:2',
        'remaining_amount' => 'decimal:2',
    ];

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function contract(): BelongsTo
    {
        return $this->belongsTo(Contract::class);
    }

    public function currency(): BelongsTo
    {
        return $this->belongsTo(Currency::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(InvoiceItem::class)->orderBy('sort_order');
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function files(): MorphMany
    {
        return $this->morphMany(File::class, 'fileable');
    }

    public function getIsOverdueAttribute(): bool
    {
        return $this->status !== 'paid'
            && $this->due_date->isPast()
            && $this->remaining_amount > 0;
    }

    public function getDaysOverdueAttribute(): int
    {
        if (!$this->is_overdue) return 0;
        return now()->diffInDays($this->due_date);
    }
}
