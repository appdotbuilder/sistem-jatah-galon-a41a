<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ActivityLogController extends Controller
{
    /**
     * Display a listing of activity logs.
     */
    public function index(Request $request)
    {
        if (!auth()->user()->isAdministrator()) {
            abort(403, 'Only administrators can view activity logs.');
        }

        $query = ActivityLog::with(['user', 'employee']);

        // Apply filters
        if ($request->action) {
            $query->where('action', 'like', "%{$request->action}%");
        }

        if ($request->user_search) {
            $query->whereHas('user', function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->user_search}%")
                  ->orWhere('email', 'like', "%{$request->user_search}%");
            });
        }

        if ($request->employee_search) {
            $query->whereHas('employee', function ($q) use ($request) {
                $q->where('nama_lengkap', 'like', "%{$request->employee_search}%")
                  ->orWhere('employee_id', 'like', "%{$request->employee_search}%");
            });
        }

        if ($request->date_from) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->date_to) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $logs = $query->orderBy('created_at', 'desc')->paginate(25);

        return Inertia::render('activity-logs/index', [
            'logs' => $logs,
            'filters' => $request->only(['action', 'user_search', 'employee_search', 'date_from', 'date_to']),
        ]);
    }

    /**
     * Display the specified activity log.
     */
    public function show(ActivityLog $activityLog)
    {
        if (!auth()->user()->isAdministrator()) {
            abort(403, 'Only administrators can view activity logs.');
        }

        $activityLog->load(['user', 'employee']);

        return Inertia::render('activity-logs/show', [
            'log' => $activityLog,
        ]);
    }
}