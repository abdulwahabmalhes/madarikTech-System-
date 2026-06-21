<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KnowledgeArticle extends Model
{
    protected $fillable = [
        'tenant_id', 'title', 'title_ar', 'content', 'content_ar', 
        'category_id', 'tags', 'is_published', 'version', 
        'created_by', 'updated_by'
    ];
    
    protected $casts = [
        'tags' => 'array',
        'is_published' => 'boolean',
    ];
}
