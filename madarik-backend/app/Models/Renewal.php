<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Renewal extends Model
{
    protected $fillable = [
        'tenant_id',
        'client_id',
        'project_id',
        'type',
        'name',
        'description',
        'start_date',
        'expiry_date',
        'cost',
        'price',
        'status',
        'auto_renew',
        'notes',
    ];

    protected $casts = [
        'start_date' => 'date',
        'expiry_date' => 'date',
        'cost' => 'decimal:2',
        'price' => 'decimal:2',
        'auto_renew' => 'boolean',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
