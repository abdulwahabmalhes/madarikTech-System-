<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductCategory extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'tenant_id',
        'name',
        'name_ar',
        'badge_color',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }
}
