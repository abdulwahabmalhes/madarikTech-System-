<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CalendarEvent extends Model
{
    protected $fillable = [
        'tenant_id', 'title', 'description', 'type', 'start_at', 
        'end_at', 'all_day', 'color', 'eventable_type', 'eventable_id',
        'created_by', 'assigned_to'
    ];
    
    protected $casts = [
        'start_at' => 'datetime',
        'end_at' => 'datetime',
        'all_day' => 'boolean',
    ];
}
