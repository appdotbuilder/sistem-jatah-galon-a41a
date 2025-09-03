<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Employee;
use App\Models\GallonRequest;
use App\Models\ActivityLog;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin users with different roles
        User::create([
            'name' => 'HR Manager',
            'email' => 'hr@company.com',
            'password' => Hash::make('password'),
            'role' => 'hr',
        ]);

        User::create([
            'name' => 'System Administrator',
            'email' => 'admin@company.com',
            'password' => Hash::make('password'),
            'role' => 'administrator',
        ]);

        User::create([
            'name' => 'Warehouse Staff',
            'email' => 'gudang@company.com',
            'password' => Hash::make('password'),
            'role' => 'gudang',
        ]);

        // Create sample employees
        $employees = Employee::factory()->count(15)->create();

        // Create some specific employees with known employee_ids for testing
        Employee::factory()->create([
            'employee_id' => 'EMP001',
            'nama_lengkap' => 'John Doe',
            'nik' => '1234567890123456',
            'grade' => 'G7',
            'department' => 'IT Department',
            'jabatan' => 'Manager',
            'email' => 'john.doe@company.com',
            'hp' => '08123456789',
            'monthly_quota' => 24,
            'current_quota' => 20,
            'total_taken_current_month' => 4,
        ]);

        Employee::factory()->create([
            'employee_id' => 'EMP002',
            'nama_lengkap' => 'Jane Smith',
            'nik' => '1234567890123457',
            'grade' => 'G10',
            'department' => 'Human Resources',
            'jabatan' => 'Senior Staff',
            'email' => 'jane.smith@company.com',
            'hp' => '08123456788',
            'monthly_quota' => 10,
            'current_quota' => 8,
            'total_taken_current_month' => 2,
        ]);

        Employee::factory()->create([
            'employee_id' => 'EMP003',
            'nama_lengkap' => 'Bob Johnson',
            'nik' => '1234567890123458',
            'grade' => 'G13',
            'department' => 'Operations',
            'jabatan' => 'Staff',
            'email' => 'bob.johnson@company.com',
            'hp' => '08123456787',
            'monthly_quota' => 7,
            'current_quota' => 5,
            'total_taken_current_month' => 2,
        ]);

        // Create sample gallon requests
        $allEmployees = Employee::all();
        
        foreach ($allEmployees as $employee) {
            // Create some historical requests
            GallonRequest::factory()->count(random_int(0, 3))->provided()->create([
                'employee_id' => $employee->id,
            ]);

            // Create some pending requests
            if (fake()->boolean(40)) {
                GallonRequest::factory()->pending()->input()->create([
                    'employee_id' => $employee->id,
                ]);
            }

            // Create some approved requests
            if (fake()->boolean(30)) {
                GallonRequest::factory()->approved()->input()->create([
                    'employee_id' => $employee->id,
                ]);
            }
        }

        // Create activity logs
        ActivityLog::factory()->count(50)->create();

        $this->command->info('Database seeded successfully!');
        $this->command->info('Test credentials:');
        $this->command->info('HR: hr@company.com / password');
        $this->command->info('Admin: admin@company.com / password');
        $this->command->info('Gudang: gudang@company.com / password');
        $this->command->info('Test employee IDs: EMP001, EMP002, EMP003');
    }
}