<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Contract extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'tenant_id', 'contract_number', 'title', 'client_id', 'project_id', 'quotation_id',
        'type', 'value', 'currency_id', 'start_date', 'end_date', 'payment_schedule',
        'template_id', 'content', 'dynamic_fields', 'status', 'signed_by_client',
        'signed_date', 'signatory_name', 'notes', 'pdf_path', 'sent_at', 'created_by'
    ];

    protected $casts = [
        'start_date' => 'date', 'end_date' => 'date',
        'signed_at' => 'datetime',
        'auto_renew' => 'boolean',
        'signed_by_client' => 'boolean',
        'value' => 'decimal:2',
    ];

    public function client(): BelongsTo { return $this->belongsTo(Client::class); }
    public function project(): BelongsTo { return $this->belongsTo(Project::class); }
    public function quotation(): BelongsTo { return $this->belongsTo(Quotation::class); }
    public function createdBy(): BelongsTo { return $this->belongsTo(User::class, 'created_by'); }
    public function invoices(): HasMany { return $this->hasMany(Invoice::class); }
    public function tenant(): BelongsTo { return $this->belongsTo(Tenant::class); }
}
