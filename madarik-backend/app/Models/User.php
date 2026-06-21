<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles, SoftDeletes;

    protected $fillable = [
        'tenant_id', 'name', 'name_ar', 'email', 'password',
        'position', 'department', 'mobile', 'avatar',
        'is_active', 'last_login_at',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'last_login_at'     => 'datetime',
        'is_active'         => 'boolean',
        'password'          => 'hashed',
    ];

    // Relationships
    public function assignedLeads(): HasMany
    {
        return $this->hasMany(Lead::class, 'assigned_to');
    }

    public function assignedProjects(): HasMany
    {
        return $this->hasMany(Project::class, 'assigned_manager');
    }

    public function assignedTasks(): HasMany
    {
        return $this->hasMany(Task::class, 'assigned_to');
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(AppNotification::class, 'user_id');
    }

    public function unreadNotificationsCount(): int
    {
        return $this->notifications()->whereNull('read_at')->count();
    }
}
