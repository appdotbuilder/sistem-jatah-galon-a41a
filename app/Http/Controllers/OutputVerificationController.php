<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\GallonRequest;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OutputVerificationController extends Controller
{
    /**
     * Display pending requests for verification (Output).
     */
    public function index(Request $request)
    {
        $request->validate([
            'employee_id' => 'required|string|exists:employees,employee_id',
        ]);

        $employee = Employee::where('employee_id', $request->employee_id)->first();

        if (!$employee) {
            return back()->withErrors(['employee_id' => 'Employee not found.']);
        }

        $pendingRequests = $employee->getPendingRequests();

        return Inertia::render('check-output', [
            'employee' => $employee,
            'pendingRequests' => $pendingRequests,
        ]);
    }

    /**
     * Verify gallon collection (Output verification).
     */
    public function store(Request $request)
    {
        $request->validate([
            'request_id' => 'required|integer|exists:gallon_requests,id',
        ]);

        $gallonRequest = GallonRequest::with('employee')->find($request->request_id);

        if (!$gallonRequest) {
            return back()->withErrors(['request' => 'Request not found.']);
        }

        if ($gallonRequest->status !== 'pending') {
            return back()->withErrors(['request' => 'Request is not pending.']);
        }

        // Update the request status and employee quota
        $gallonRequest->update([
            'status' => 'provided',
            'verified_at' => now(),
            'provided_at' => now(),
        ]);

        // Update employee quota
        $employee = $gallonRequest->employee;
        $employee->decrement('current_quota');
        $employee->increment('total_taken_current_month');

        // Log the activity
        ActivityLog::log(
            'request.verified',
            "Gallon collection verified for {$employee->nama_lengkap} ({$employee->employee_id})",
            $employee->id,
            null
        );

        return Inertia::render('collection-verified', [
            'employee' => $employee,
            'request' => $gallonRequest,
        ]);
    }
}