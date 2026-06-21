<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuotationSection extends Model
{
    use HasFactory;

    protected $fillable = [
        'quotation_id',
        'title',
        'description',
        'bullet_points',
        'order',
    ];

    protected $casts = [
        'bullet_points' => 'array',
    ];

    public function quotation()
    {
        return $this->belongsTo(Quotation::class);
    }
}
