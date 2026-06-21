<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Meeting extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'tenant_id', 'meeting_number', 'title', 'type', 'client_id', 'project_id',
        'date', 'start_time', 'end_time', 'location', 'internal_attendees',
        'external_attendees', 'agenda', 'notes', 'decisions', 'next_meeting_date',
        'status', 'pdf_path', 'sent_via', 'sent_at', 'created_by'
    ];

    protected $casts = [
        'meeting_date' => 'datetime',
        'attendees' => 'array',
    ];

    public function client(): BelongsTo { return $this->belongsTo(Client::class); }
    public function lead(): BelongsTo { return $this->belongsTo(Lead::class); }
    public function project(): BelongsTo { return $this->belongsTo(Project::class); }
    public function createdUser(): BelongsTo { return $this->belongsTo(User::class, 'created_by'); }
    public function tenant(): BelongsTo { return $this->belongsTo(Tenant::class); }
}
