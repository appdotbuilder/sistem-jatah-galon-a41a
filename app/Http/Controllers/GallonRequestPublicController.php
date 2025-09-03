<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\GallonRequest;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GallonRequestPublicController extends Controller
{
    /**
     * Create a gallon request (Input).
     */
    public function store(Request $request)
    {
        $request->validate([
            'employee_id' => 'required|string|exists:employees,employee_id',
        ]);

        $employee = Employee::where('employee_id', $request->employee_id)->first();

        if (!$employee) {
            return back()->withErrors(['employee_id' => 'Employee not found.']);
        }

        // Check if employee has remaining quota
        if ($employee->current_quota <= 0) {
            return back()->withErrors(['quota' => 'Employee has no remaining quota for this month.']);
        }

        // Check if there's already a pending request
        $existingPending = $employee->gallonRequests()
            ->where('status', 'pending')
            ->where('type', 'input')
            ->exists();

        if ($existingPending) {
            return back()->withErrors(['pending' => 'Employee already has a pending gallon request.']);
        }

        // Create the request
        $gallonRequest = GallonRequest::create([
            'employee_id' => $employee->id,
            'type' => 'input',
            'status' => 'pending',
            'requested_at' => now(),
        ]);

        // Log the activity
        ActivityLog::log(
            'request.created',
            "Gallon request created for {$employee->nama_lengkap} ({$employee->employee_id})",
            $employee->id,
            null
        );

        return Inertia::render('request-created', [
            'employee' => $employee,
            'request' => $gallonRequest,
        ]);
    }
}