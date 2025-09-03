<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\GallonRequest;
use App\Models\ActivityLog;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the dashboard.
     */
    public function index()
    {
        $stats = [
            'totalEmployees' => Employee::count(),
            'pendingRequests' => GallonRequest::where('status', 'pending')->count(),
            'approvedRequests' => GallonRequest::where('status', 'approved')->count(),
            'totalQuotaUsed' => Employee::sum('total_taken_current_month'),
            'recentActivities' => ActivityLog::with(['user', 'employee'])
                ->latest()
                ->take(10)
                ->get()
                ->map(function ($log) {
                    return [
                        'id' => $log->id,
                        'action' => $log->action,
                        'description' => $log->description,
                        'created_at' => $log->created_at->toISOString(),
                        'user' => $log->user ? ['name' => $log->user->name] : null,
                        'employee' => $log->employee ? ['nama_lengkap' => $log->employee->nama_lengkap] : null,
                    ];
                }),
        ];

        return Inertia::render('dashboard', [
            'stats' => $stats,
        ]);
    }
}