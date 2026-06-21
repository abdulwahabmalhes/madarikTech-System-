<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Asset extends Model
{
    protected $fillable = [
        'tenant_id', 'name', 'type', 'client_id', 'project_id', 'provider', 
        'account_email', 'username', 'password', 'notes', 'monthly_cost', 
        'annual_cost', 'currency_id', 'purchase_date'
    ];
}
