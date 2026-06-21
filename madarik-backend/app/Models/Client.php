<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Client extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'tenant_id', 'name', 'client_code', 'company_name', 'mobile', 'whatsapp', 'email',
        'country', 'city', 'industry', 'type', 'status', 'source',
        'lead_id', 'assigned_to', 'tags', 'notes',
        'portal_access', 'portal_email', 'portal_password', 'avatar', 'created_by',
    ];

    protected $hidden = ['portal_password'];

    protected $casts = [
        'tags'          => 'array',
        'portal_access' => 'boolean',
    ];

    // Relationships
    public function lead(): BelongsTo
    {
        return $this->belongsTo(Lead::class);
    }

    public function assignedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }

    public function quotations(): HasMany
    {
        return $this->hasMany(Quotation::class);
    }

    public function contracts(): HasMany
    {
        return $this->hasMany(Contract::class);
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }

    public function expenses(): HasMany
    {
        return $this->hasMany(Expense::class);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    public function dailyReports(): HasMany
    {
        return $this->hasMany(DailyReport::class);
    }

    public function meetings(): HasMany
    {
        return $this->hasMany(Meeting::class);
    }

    public function communications(): HasMany
    {
        return $this->hasMany(ClientCommunication::class);
    }

    public function supportTickets(): HasMany
    {
        return $this->hasMany(SupportTicket::class);
    }

    public function renewals(): HasMany
    {
        return $this->hasMany(Renewal::class);
    }

    public function assets(): HasMany
    {
        return $this->hasMany(Asset::class);
    }

    public function files(): MorphMany
    {
        return $this->morphMany(File::class, 'fileable');
    }

    public function notes(): MorphMany
    {
        return $this->morphMany(Note::class, 'noteable');
    }

    public function activities(): MorphMany
    {
        return $this->morphMany(Activity::class, 'subject');
    }

    // Financial Summary
    public function getTotalRevenueAttribute(): float
    {
        return $this->invoices()->sum('paid_amount');
    }

    public function getTotalOutstandingAttribute(): float
    {
        return $this->invoices()->where('status', '!=', 'paid')->sum('remaining_amount');
    }

    public function getWhatsappLinkAttribute(): string
    {
        $phone = $this->whatsapp ?? $this->mobile;
        return 'https://wa.me/' . preg_replace('/\D/', '', $phone);
    }
}
