<?php

use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\GallonRequestController;
use App\Http\Controllers\GallonRequestPublicController;
use App\Http\Controllers\OutputVerificationController;
use App\Http\Controllers\PublicController;
use App\Http\Controllers\QuotaCheckController;
use App\Http\Controllers\QuotaController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public routes (no authentication required)
Route::get('/', [PublicController::class, 'index'])->name('public.index');

// Check Quota feature
Route::post('/check-quota', [QuotaCheckController::class, 'store'])->name('public.check-quota');

// Input feature (request gallon)
Route::post('/request-gallon', [GallonRequestPublicController::class, 'store'])->name('public.request-gallon');

// Output feature (verify collection)
Route::post('/check-output', [OutputVerificationController::class, 'index'])->name('public.check-output');
Route::post('/verify-collection', [OutputVerificationController::class, 'store'])->name('public.verify-collection');

// Dashboard (requires authentication)
Route::get('/dashboard', [App\Http\Controllers\DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

// Admin routes (requires authentication)
Route::middleware('auth')->group(function () {
    // Employee management (HR only)
    Route::resource('employees', EmployeeController::class);
    Route::post('quota/reset', [QuotaController::class, 'store'])->name('quota.reset');
    
    // Gallon request management
    Route::resource('gallon-requests', GallonRequestController::class)->only(['index', 'show', 'update']);
    
    // Activity logs (Administrator only)
    Route::resource('activity-logs', ActivityLogController::class)->only(['index', 'show']);
    
    // Profile routes (if ProfileController exists)
    // Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    // Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    // Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';