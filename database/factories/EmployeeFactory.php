<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Employee;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Employee>
 */
class EmployeeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $grade = fake()->randomElement(['G7', 'G8', 'G9', 'G10', 'G11', 'G12', 'G13']);
        $quota = Employee::getQuotaByGrade($grade);
        
        return [
            'employee_id' => 'EMP' . fake()->unique()->numberBetween(10000, 99999),
            'nama_lengkap' => fake()->name(),
            'nik' => fake()->unique()->numerify('############'),
            'grade' => $grade,
            'department' => fake()->randomElement([
                'Human Resources',
                'IT Department',
                'Finance',
                'Operations',
                'Marketing',
                'Sales',
                'Production',
                'Quality Control'
            ]),
            'jabatan' => fake()->randomElement([
                'Manager',
                'Supervisor',
                'Staff',
                'Senior Staff',
                'Team Lead',
                'Specialist',
                'Analyst',
                'Coordinator'
            ]),
            'foto' => fake()->boolean(30) ? 'photos/' . fake()->uuid() . '.jpg' : null,
            'email' => fake()->boolean(80) ? fake()->unique()->safeEmail() : null,
            'hp' => fake()->boolean(90) ? fake()->phoneNumber() : null,
            'hire_date' => fake()->dateTimeBetween('-5 years', '-1 month'),
            'monthly_quota' => $quota,
            'current_quota' => fake()->numberBetween(0, $quota),
            'total_taken_current_month' => fake()->numberBetween(0, $quota - 2),
        ];
    }

    /**
     * Indicate that the employee has high grade.
     */
    public function highGrade(): static
    {
        return $this->state(fn (array $attributes) => [
            'grade' => fake()->randomElement(['G7', 'G8']),
            'jabatan' => fake()->randomElement(['Manager', 'Senior Manager', 'Director']),
        ]);
    }

    /**
     * Indicate that the employee has low grade.
     */
    public function lowGrade(): static
    {
        return $this->state(fn (array $attributes) => [
            'grade' => fake()->randomElement(['G11', 'G12', 'G13']),
            'jabatan' => fake()->randomElement(['Staff', 'Junior Staff', 'Intern']),
        ]);
    }

    /**
     * Indicate that the employee has full quota remaining.
     */
    public function fullQuota(): static
    {
        return $this->state(function (array $attributes) {
            $quota = Employee::getQuotaByGrade($attributes['grade']);
            return [
                'current_quota' => $quota,
                'total_taken_current_month' => 0,
            ];
        });
    }

    /**
     * Indicate that the employee has used all quota.
     */
    public function noQuota(): static
    {
        return $this->state(function (array $attributes) {
            $quota = Employee::getQuotaByGrade($attributes['grade']);
            return [
                'current_quota' => 0,
                'total_taken_current_month' => $quota,
            ];
        });
    }
}