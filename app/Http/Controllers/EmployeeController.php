<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEmployeeRequest;
use App\Http\Requests\UpdateEmployeeRequest;
use App\Models\Employee;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the employees.
     */
    public function index(Request $request)
    {
        if (!auth()->user()->isHR() && !auth()->user()->isAdministrator() && !auth()->user()->isGudang()) {
            abort(403, 'Unauthorized access.');
        }

        $query = Employee::query();

        // Apply filters
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('nama_lengkap', 'like', "%{$request->search}%")
                  ->orWhere('employee_id', 'like', "%{$request->search}%")
                  ->orWhere('nik', 'like', "%{$request->search}%")
                  ->orWhere('department', 'like', "%{$request->search}%");
            });
        }

        if ($request->grade) {
            $query->where('grade', $request->grade);
        }

        if ($request->department) {
            $query->where('department', 'like', "%{$request->department}%");
        }

        $employees = $query->latest()->paginate(15);

        return Inertia::render('employees/index', [
            'employees' => $employees,
            'filters' => $request->only(['search', 'grade', 'department']),
        ]);
    }

    /**
     * Show the form for creating a new employee.
     */
    public function create()
    {
        if (!auth()->user()->isHR()) {
            abort(403, 'Only HR can create employees.');
        }

        return Inertia::render('employees/create');
    }

    /**
     * Store a newly created employee in storage.
     */
    public function store(StoreEmployeeRequest $request)
    {
        if (!auth()->user()->isHR()) {
            abort(403, 'Only HR can create employees.');
        }

        $data = $request->validated();
        $data['monthly_quota'] = Employee::getQuotaByGrade($data['grade']);
        $data['current_quota'] = $data['monthly_quota'];

        $employee = Employee::create($data);

        // Log the activity
        ActivityLog::log(
            'employee.created',
            "New employee created: {$employee->nama_lengkap} ({$employee->employee_id})",
            $employee->id,
            auth()->id(),
            null,
            $employee->toArray()
        );

        return redirect()->route('employees.show', $employee)
            ->with('success', 'Employee created successfully.');
    }

    /**
     * Display the specified employee.
     */
    public function show(Employee $employee)
    {
        if (!auth()->user()->isHR() && !auth()->user()->isAdministrator() && !auth()->user()->isGudang()) {
            abort(403, 'Unauthorized access.');
        }

        $employee->load(['gallonRequests' => function ($query) {
            $query->orderBy('requested_at', 'desc')->take(20);
        }]);

        return Inertia::render('employees/show', [
            'employee' => $employee,
        ]);
    }

    /**
     * Show the form for editing the specified employee.
     */
    public function edit(Employee $employee)
    {
        if (!auth()->user()->isHR()) {
            abort(403, 'Only HR can edit employees.');
        }

        return Inertia::render('employees/edit', [
            'employee' => $employee,
        ]);
    }

    /**
     * Update the specified employee in storage.
     */
    public function update(UpdateEmployeeRequest $request, Employee $employee)
    {
        if (!auth()->user()->isHR()) {
            abort(403, 'Only HR can update employees.');
        }

        $oldData = $employee->toArray();
        $data = $request->validated();
        
        // Update quota if grade changed
        if ($data['grade'] !== $employee->grade) {
            $data['monthly_quota'] = Employee::getQuotaByGrade($data['grade']);
            $data['current_quota'] = $data['monthly_quota'] - $employee->total_taken_current_month;
        }

        $employee->update($data);

        // Log the activity
        ActivityLog::log(
            'employee.updated',
            "Employee updated: {$employee->nama_lengkap} ({$employee->employee_id})",
            $employee->id,
            auth()->id(),
            $oldData,
            $employee->toArray()
        );

        return redirect()->route('employees.show', $employee)
            ->with('success', 'Employee updated successfully.');
    }

    /**
     * Remove the specified employee from storage.
     */
    public function destroy(Employee $employee)
    {
        if (!auth()->user()->isHR()) {
            abort(403, 'Only HR can delete employees.');
        }

        $employeeData = $employee->toArray();

        // Log the activity before deletion
        ActivityLog::log(
            'employee.deleted',
            "Employee deleted: {$employee->nama_lengkap} ({$employee->employee_id})",
            $employee->id,
            auth()->id(),
            $employeeData,
            null
        );

        $employee->delete();

        return redirect()->route('employees.index')
            ->with('success', 'Employee deleted successfully.');
    }


}