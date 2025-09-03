<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\GallonRequest;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GallonRequestController extends Controller
{
    /**
     * Display a listing of gallon requests.
     */
    public function index(Request $request)
    {
        $query = GallonRequest::with(['employee', 'approver', 'provider', 'verifier']);

        // Apply filters based on user role
        if (auth()->user()->isGudang()) {
            // Gudang can only see approved requests
            $query->where('status', 'approved');
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->type) {
            $query->where('type', $request->type);
        }

        if ($request->employee_search) {
            $query->whereHas('employee', function ($q) use ($request) {
                $q->where('nama_lengkap', 'like', "%{$request->employee_search}%")
                  ->orWhere('employee_id', 'like', "%{$request->employee_search}%");
            });
        }

        if ($request->date_from) {
            $query->whereDate('requested_at', '>=', $request->date_from);
        }

        if ($request->date_to) {
            $query->whereDate('requested_at', '<=', $request->date_to);
        }

        $requests = $query->orderBy('requested_at', 'desc')->paginate(20);

        return Inertia::render('gallon-requests/index', [
            'requests' => $requests,
            'filters' => $request->only(['status', 'type', 'employee_search', 'date_from', 'date_to']),
            'canManageRequests' => auth()->user()->isAdministrator(),
            'canProvideGallons' => auth()->user()->isGudang() || auth()->user()->isAdministrator(),
        ]);
    }

    /**
     * Display the specified gallon request.
     */
    public function show(GallonRequest $gallonRequest)
    {
        $gallonRequest->load(['employee', 'approver', 'provider', 'verifier']);

        return Inertia::render('gallon-requests/show', [
            'request' => $gallonRequest,
            'canManageRequests' => auth()->user()->isAdministrator(),
            'canProvideGallons' => auth()->user()->isGudang() || auth()->user()->isAdministrator(),
        ]);
    }

    /**
     * Update the specified gallon request (handles approve/reject/provide).
     */
    public function update(Request $request, GallonRequest $gallonRequest)
    {
        $action = $request->input('action');
        
        switch ($action) {
            case 'approve':
                return $this->handleApprove($gallonRequest);
            case 'reject':
                return $this->handleReject($request, $gallonRequest);
            case 'provide':
                return $this->handleProvide($gallonRequest);
            default:
                return back()->withErrors(['action' => 'Invalid action.']);
        }
    }

    /**
     * Handle approve action.
     */
    protected function handleApprove(GallonRequest $gallonRequest)
    {
        if (!auth()->user()->isAdministrator()) {
            abort(403, 'Only administrators can approve requests.');
        }

        if ($gallonRequest->status !== 'pending') {
            return back()->withErrors(['request' => 'Only pending requests can be approved.']);
        }

        $gallonRequest->update([
            'status' => 'approved',
            'approved_at' => now(),
            'approved_by' => auth()->id(),
        ]);

        // Log the activity
        ActivityLog::log(
            'request.approved',
            "Gallon request approved for {$gallonRequest->employee->nama_lengkap}",
            $gallonRequest->employee_id,
            auth()->id()
        );

        return back()->with('success', 'Request approved successfully.');
    }

    /**
     * Handle reject action.
     */
    protected function handleReject(Request $request, GallonRequest $gallonRequest)
    {
        if (!auth()->user()->isAdministrator()) {
            abort(403, 'Only administrators can reject requests.');
        }

        if ($gallonRequest->status !== 'pending') {
            return back()->withErrors(['request' => 'Only pending requests can be rejected.']);
        }

        $request->validate([
            'notes' => 'nullable|string|max:500',
        ]);

        $gallonRequest->update([
            'status' => 'rejected',
            'approved_at' => now(),
            'approved_by' => auth()->id(),
            'notes' => $request->notes,
        ]);

        // Log the activity
        ActivityLog::log(
            'request.rejected',
            "Gallon request rejected for {$gallonRequest->employee->nama_lengkap}",
            $gallonRequest->employee_id,
            auth()->id()
        );

        return back()->with('success', 'Request rejected successfully.');
    }

    /**
     * Handle provide action.
     */
    protected function handleProvide(GallonRequest $gallonRequest)
    {
        if (!auth()->user()->isGudang() && !auth()->user()->isAdministrator()) {
            abort(403, 'Only warehouse staff can mark gallons as provided.');
        }

        if ($gallonRequest->status !== 'approved') {
            return back()->withErrors(['request' => 'Only approved requests can be marked as provided.']);
        }

        $gallonRequest->update([
            'status' => 'provided',
            'provided_at' => now(),
            'provided_by' => auth()->id(),
        ]);

        // Update employee quota
        $employee = $gallonRequest->employee;
        $employee->decrement('current_quota');
        $employee->increment('total_taken_current_month');

        // Log the activity
        ActivityLog::log(
            'request.provided',
            "Gallon provided to {$gallonRequest->employee->nama_lengkap}",
            $gallonRequest->employee_id,
            auth()->id()
        );

        return back()->with('success', 'Gallon marked as provided successfully.');
    }
}