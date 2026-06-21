<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Goal extends Model
{
    protected $fillable = [
        'tenant_id', 'title', 'type', 'target_value', 'current_value', 'unit', 'period_type', 
        'period_start', 'period_end', 'assigned_to', 'description', 'status', 'created_by'
    ];
}
