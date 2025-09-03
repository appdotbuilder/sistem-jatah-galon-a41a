<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\GallonRequest
 *
 * @property int $id
 * @property int $employee_id
 * @property string $status
 * @property string $type
 * @property \Illuminate\Support\Carbon $requested_at
 * @property \Illuminate\Support\Carbon|null $approved_at
 * @property \Illuminate\Support\Carbon|null $provided_at
 * @property \Illuminate\Support\Carbon|null $verified_at
 * @property int|null $approved_by
 * @property int|null $provided_by
 * @property int|null $verified_by
 * @property string|null $notes
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Employee $employee
 * @property-read \App\Models\User|null $approver
 * @property-read \App\Models\User|null $provider
 * @property-read \App\Models\User|null $verifier
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|GallonRequest newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|GallonRequest newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|GallonRequest query()
 * @method static \Illuminate\Database\Eloquent\Builder|GallonRequest whereEmployeeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GallonRequest whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GallonRequest whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GallonRequest whereRequestedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GallonRequest whereApprovedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GallonRequest whereProvidedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GallonRequest whereVerifiedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GallonRequest whereApprovedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GallonRequest whereProvidedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GallonRequest whereVerifiedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GallonRequest whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GallonRequest whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GallonRequest whereUpdatedAt($value)
 * @method static \Database\Factories\GallonRequestFactory factory($count = null, $state = [])
 * @method static GallonRequest create(array $attributes = [])
 * @method static GallonRequest firstOrCreate(array $attributes = [], array $values = [])
 * 
 * @mixin \Eloquent
 */
class GallonRequest extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'employee_id',
        'status',
        'type',
        'requested_at',
        'approved_at',
        'provided_at',
        'verified_at',
        'approved_by',
        'provided_by',
        'verified_by',
        'notes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'requested_at' => 'datetime',
        'approved_at' => 'datetime',
        'provided_at' => 'datetime',
        'verified_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the employee that owns the gallon request.
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    /**
     * Get the user who approved the request.
     */
    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * Get the user who provided the gallon.
     */
    public function provider(): BelongsTo
    {
        return $this->belongsTo(User::class, 'provided_by');
    }

    /**
     * Get the user who verified the collection.
     */
    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    /**
     * Scope a query to only include pending requests.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope a query to only include approved requests.
     */
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    /**
     * Scope a query to only include input requests.
     */
    public function scopeInput($query)
    {
        return $query->where('type', 'input');
    }

    /**
     * Scope a query to only include output requests.
     */
    public function scopeOutput($query)
    {
        return $query->where('type', 'output');
    }
}