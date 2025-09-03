<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuotaCheckController extends Controller
{
    /**
     * Check employee quota by scanning employee ID.
     */
    public function store(Request $request)
    {
        $request->validate([
            'employee_id' => 'required|string|exists:employees,employee_id',
        ]);

        $employee = Employee::where('employee_id', $request->employee_id)
            ->with(['gallonRequests' => function ($query) {
                $query->orderBy('requested_at', 'desc');
            }])
            ->first();

        if (!$employee) {
            return back()->withErrors(['employee_id' => 'Employee not found.']);
        }

        // Log the quota check activity
        ActivityLog::log(
            'quota.checked',
            "Employee quota checked for {$employee->nama_lengkap} ({$employee->employee_id})",
            $employee->id,
            null
        );

        return Inertia::render('check-quota', [
            'employee' => $employee,
            'history' => $employee->gallonRequests->take(10), // Last 10 records
        ]);
    }
}