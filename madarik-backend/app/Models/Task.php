<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Task extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'tenant_id', 'project_id', 'milestone_id', 'parent_task_id',
        'title', 'description', 'status', 'priority', 'type',
        'assigned_to', 'assigned_by', 'created_by',
        'start_date', 'due_date', 'estimated_hours', 'actual_hours',
        'completed_at', 'completed_by', 'tags', 'attachments',
        'is_billable', 'sort_order',
    ];

    protected $casts = [
        'tags' => 'array',
        'attachments' => 'array',
        'is_billable' => 'boolean',
        'start_date' => 'date',
        'due_date' => 'date',
        'completed_at' => 'datetime',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function milestone(): BelongsTo
    {
        return $this->belongsTo(Milestone::class);
    }

    public function assignedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function assignedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_by');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function completedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'completed_by');
    }

    public function comments(): HasMany
    {
        return $this->hasMany(TaskComment::class);
    }

    public function subTasks(): HasMany
    {
        return $this->hasMany(Task::class, 'parent_task_id');
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }
}
