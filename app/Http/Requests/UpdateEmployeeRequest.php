<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEmployeeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->user()->isHR();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $employee = $this->route('employee');
        
        return [
            'employee_id' => 'required|string|max:50|unique:employees,employee_id,' . $employee->id,
            'nama_lengkap' => 'required|string|max:255',
            'nik' => 'required|string|max:16|unique:employees,nik,' . $employee->id,
            'grade' => 'required|in:G7,G8,G9,G10,G11,G12,G13',
            'department' => 'required|string|max:255',
            'jabatan' => 'required|string|max:255',
            'foto' => 'nullable|string|max:500',
            'email' => 'nullable|email|max:255',
            'hp' => 'nullable|string|max:20',
            'hire_date' => 'required|date|before_or_equal:today',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'employee_id.required' => 'Employee ID is required.',
            'employee_id.unique' => 'This Employee ID is already in use by another employee.',
            'nama_lengkap.required' => 'Full name is required.',
            'nik.required' => 'NIK (Employee Identification Number) is required.',
            'nik.unique' => 'This NIK is already registered to another employee.',
            'grade.required' => 'Employee grade is required.',
            'grade.in' => 'Please select a valid grade (G7-G13).',
            'department.required' => 'Department is required.',
            'jabatan.required' => 'Position/Job title is required.',
            'hire_date.required' => 'Hire date is required.',
            'hire_date.before_or_equal' => 'Hire date cannot be in the future.',
        ];
    }
}