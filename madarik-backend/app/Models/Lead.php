<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Lead extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'tenant_id', 'lead_number', 'name', 'company_name', 'mobile',
        'whatsapp', 'email', 'source', 'country', 'stage', 'priority',
        'estimated_value', 'currency_id', 'expected_close_date',
        'assigned_to', 'converted_to_client_id', 'notes', 'tags',
        'referrer_name', 'referrer_type', 'campaign_name', 'created_by',
    ];

    protected $casts = [
        'tags'                => 'array',
        'expected_close_date' => 'date',
        'estimated_value'     => 'decimal:2',
    ];

    public function assignedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function convertedClient(): BelongsTo
    {
        return $this->belongsTo(Client::class, 'converted_to_client_id');
    }

    public function currency(): BelongsTo
    {
        return $this->belongsTo(Currency::class);
    }

    public function activities(): MorphMany
    {
        return $this->morphMany(Activity::class, 'subject');
    }

    public function notes(): MorphMany
    {
        return $this->morphMany(Note::class, 'noteable');
    }

    // Helper: is this lead converted?
    public function isConverted(): bool
    {
        return !is_null($this->converted_to_client_id);
    }

    // WhatsApp link
    public function getWhatsappLinkAttribute(): string
    {
        $phone = $this->whatsapp ?? $this->mobile;
        return 'https://wa.me/' . preg_replace('/\D/', '', $phone);
    }
}
