<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\Employee
 *
 * @property int $id
 * @property string $employee_id
 * @property string $nama_lengkap
 * @property string $nik
 * @property string $grade
 * @property string $department
 * @property string $jabatan
 * @property string|null $foto
 * @property string|null $email
 * @property string|null $hp
 * @property \Illuminate\Support\Carbon $hire_date
 * @property int $monthly_quota
 * @property int $current_quota
 * @property int $total_taken_current_month
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\GallonRequest> $gallonRequests
 * @property-read int|null $gallon_requests_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ActivityLog> $activityLogs
 * @property-read int|null $activity_logs_count
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Employee newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Employee newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Employee query()
 * @method static \Illuminate\Database\Eloquent\Builder|Employee whereEmployeeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Employee whereNamaLengkap($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Employee whereNik($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Employee whereGrade($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Employee whereDepartment($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Employee whereJabatan($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Employee whereFoto($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Employee whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Employee whereHp($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Employee whereHireDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Employee whereMonthlyQuota($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Employee whereCurrentQuota($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Employee whereTotalTakenCurrentMonth($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Employee whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Employee whereUpdatedAt($value)
 * @method static \Database\Factories\EmployeeFactory factory($count = null, $state = [])
 * @method static Employee create(array $attributes = [])
 * @method static Employee firstOrCreate(array $attributes = [], array $values = [])
 * 
 * @mixin \Eloquent
 */
class Employee extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'employee_id',
        'nama_lengkap',
        'nik',
        'grade',
        'department',
        'jabatan',
        'foto',
        'email',
        'hp',
        'hire_date',
        'monthly_quota',
        'current_quota',
        'total_taken_current_month',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'hire_date' => 'date',
        'monthly_quota' => 'integer',
        'current_quota' => 'integer',
        'total_taken_current_month' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the gallon requests for the employee.
     */
    public function gallonRequests(): HasMany
    {
        return $this->hasMany(GallonRequest::class);
    }

    /**
     * Get the activity logs for the employee.
     */
    public function activityLogs(): HasMany
    {
        return $this->hasMany(ActivityLog::class);
    }

    /**
     * Get the quota based on grade.
     *
     * @param string $grade
     * @return int
     */
    public static function getQuotaByGrade(string $grade): int
    {
        return match ($grade) {
            'G7', 'G8' => 24,
            'G9' => 12,
            'G10' => 10,
            'G11', 'G12', 'G13' => 7,
            default => 0,
        };
    }

    /**
     * Reset monthly quotas for all employees.
     */
    public static function resetMonthlyQuotas(): void
    {
        self::chunk(100, function ($employees) {
            foreach ($employees as $employee) {
                $employee->update([
                    'current_quota' => $employee->monthly_quota,
                    'total_taken_current_month' => 0,
                ]);
            }
        });
    }

    /**
     * Get pending requests for this employee.
     */
    public function getPendingRequests()
    {
        return $this->gallonRequests()
            ->where('status', 'pending')
            ->where('type', 'input')
            ->orderBy('requested_at', 'desc')
            ->get();
    }
}