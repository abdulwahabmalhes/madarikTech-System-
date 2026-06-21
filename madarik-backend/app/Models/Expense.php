<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Expense extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'tenant_id', 'project_id', 'created_by',
        'title', 'category', 'amount', 'currency_code',
        'date', 'receipt_path', 'notes', 'is_billable',
        'approved_by', 'approved_at', 'status',
        'vendor', 'payment_method', 'reference',
    ];

    protected $casts = [
        'date' => 'date',
        'approved_at' => 'datetime',
        'amount' => 'decimal:2',
        'is_billable' => 'boolean',
    ];

    public function project(): BelongsTo { return $this->belongsTo(Project::class); }
    public function createdBy(): BelongsTo { return $this->belongsTo(User::class, 'created_by'); }
    public function approvedBy(): BelongsTo { return $this->belongsTo(User::class, 'approved_by'); }
    public function tenant(): BelongsTo { return $this->belongsTo(Tenant::class); }
}
