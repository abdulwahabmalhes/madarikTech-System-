<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DailyReport extends Model
{
    protected $fillable = [
        'tenant_id', 'title', 'project_id', 'client_id', 'report_date',
        'period_type', 'work_completed', 'issues', 'next_steps',
        'completion_percent', 'hours_logged', 'status', 'pdf_path',
        'sent_via', 'sent_at', 'created_by'
    ];

    protected $casts = [
        'report_date' => 'date',
        'sent_at' => 'datetime',
        'completion_percent' => 'integer',
        'hours_logged' => 'decimal:2',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
