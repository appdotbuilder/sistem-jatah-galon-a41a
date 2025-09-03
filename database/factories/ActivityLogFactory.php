<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Employee;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ActivityLog>
 */
class ActivityLogFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $actions = [
            'employee.created',
            'employee.updated',
            'employee.deleted',
            'request.created',
            'request.approved',
            'request.rejected',
            'request.provided',
            'request.verified',
            'quota.reset',
            'user.login',
            'user.logout',
        ];

        $action = fake()->randomElement($actions);
        
        return [
            'user_id' => fake()->boolean(80) ? User::factory() : null,
            'employee_id' => fake()->boolean(60) ? Employee::factory() : null,
            'action' => $action,
            'description' => $this->generateDescription($action),
            'old_values' => fake()->boolean(40) ? $this->generateOldValues() : null,
            'new_values' => fake()->boolean(40) ? $this->generateNewValues() : null,
            'ip_address' => fake()->ipv4(),
            'user_agent' => fake()->userAgent(),
        ];
    }

    /**
     * Generate description based on action.
     */
    protected function generateDescription(string $action): string
    {
        return match ($action) {
            'employee.created' => 'New employee was created',
            'employee.updated' => 'Employee information was updated',
            'employee.deleted' => 'Employee was deleted',
            'request.created' => 'New gallon request was created',
            'request.approved' => 'Gallon request was approved',
            'request.rejected' => 'Gallon request was rejected',
            'request.provided' => 'Gallon was provided to employee',
            'request.verified' => 'Gallon collection was verified',
            'quota.reset' => 'Monthly quotas were reset',
            'user.login' => 'User logged in',
            'user.logout' => 'User logged out',
            default => 'System activity performed',
        };
    }

    /**
     * Generate sample old values.
     */
    protected function generateOldValues(): array
    {
        return [
            'status' => 'pending',
            'quota' => fake()->numberBetween(5, 24),
            'department' => fake()->company(),
        ];
    }

    /**
     * Generate sample new values.
     */
    protected function generateNewValues(): array
    {
        return [
            'status' => 'approved',
            'quota' => fake()->numberBetween(5, 24),
            'department' => fake()->company(),
        ];
    }
}