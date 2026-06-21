<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuotationItem extends Model
{
    protected $guarded = [];
    public $timestamps = false; // Assuming items might not need timestamps if they are just line items
}
