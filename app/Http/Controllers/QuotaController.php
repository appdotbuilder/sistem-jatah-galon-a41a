<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\ActivityLog;

class QuotaController extends Controller
{
    /**
     * Reset monthly quotas for all employees.
     */
    public function store()
    {
        if (!auth()->user()->isHR()) {
            abort(403, 'Only HR can reset quotas.');
        }

        Employee::resetMonthlyQuotas();

        // Log the activity
        ActivityLog::log(
            'quota.reset',
            'Monthly quotas reset for all employees',
            null,
            auth()->id()
        );

        return back()->with('success', 'Monthly quotas reset successfully for all employees.');
    }
}