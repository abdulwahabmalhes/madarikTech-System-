<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'tenant_id', 'project_number', 'name', 'client_id', 'description',
        'type', 'template_id', 'start_date', 'expected_end_date', 'actual_end_date',
        'priority', 'status', 'progress_percent', 'health_score',
        'assigned_manager', 'contract_value', 'currency_id',
        'linked_quotation_id', 'created_by',
    ];

    protected $casts = [
        'start_date'        => 'date',
        'expected_end_date' => 'date',
        'actual_end_date'   => 'date',
        'contract_value'    => 'decimal:2',
        'progress_percent'  => 'integer',
        'health_score'      => 'integer',
    ];

    // Relationships
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function manager(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_manager');
    }

    public function template(): BelongsTo
    {
        return $this->belongsTo(ProjectTemplate::class);
    }

    public function currency(): BelongsTo
    {
        return $this->belongsTo(Currency::class);
    }

    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'project_members')
            ->withPivot('role')
            ->withTimestamps();
    }

    public function milestones(): HasMany
    {
        return $this->hasMany(ProjectMilestone::class)->orderBy('due_date');
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class)->orderBy('due_date');
    }

    public function dailyReports(): HasMany
    {
        return $this->hasMany(DailyReport::class)->orderByDesc('report_date');
    }

    public function deliverables(): HasMany
    {
        return $this->hasMany(Deliverable::class)->orderBy('sort_order');
    }

    public function meetings(): HasMany
    {
        return $this->hasMany(Meeting::class)->orderByDesc('date');
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }

    public function expenses(): HasMany
    {
        return $this->hasMany(Expense::class);
    }

    public function contracts(): HasMany
    {
        return $this->hasMany(Contract::class);
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

    // Financial helpers
    public function getTotalInvoicedAttribute(): float
    {
        return $this->invoices()->sum('total');
    }

    public function getTotalPaidAttribute(): float
    {
        return $this->invoices()->sum('paid_amount');
    }

    public function getTotalExpensesAttribute(): float
    {
        return $this->expenses()->sum('amount');
    }

    public function getNetProfitAttribute(): float
    {
        return $this->total_paid - $this->total_expenses;
    }

    public function getProfitMarginAttribute(): float
    {
        if (!$this->contract_value || $this->contract_value == 0) {
            return 0;
        }
        return round(($this->net_profit / $this->contract_value) * 100, 2);
    }

    public function getRemainingDaysAttribute(): int
    {
        return max(0, now()->diffInDays($this->expected_end_date, false));
    }

    public function getDeadlineStatusAttribute(): string
    {
        $days = $this->remaining_days;
        if ($days > 14) return 'green';
        if ($days > 7) return 'yellow';
        return 'red';
    }
}
