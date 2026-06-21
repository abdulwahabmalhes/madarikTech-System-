<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Income extends Model
{
    use \Illuminate\Database\Eloquent\SoftDeletes;

    protected $fillable = [
        'tenant_id', 'title', 'category', 'amount', 'currency_id', 'date',
        'project_id', 'client_id', 'source', 'notes', 'created_by'
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }
}
