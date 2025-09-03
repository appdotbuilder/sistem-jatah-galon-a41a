<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Employee;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\GallonRequest>
 */
class GallonRequestFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $requestedAt = fake()->dateTimeBetween('-30 days', 'now');
        $status = fake()->randomElement(['pending', 'approved', 'provided', 'rejected']);
        
        return [
            'employee_id' => Employee::factory(),
            'status' => $status,
            'type' => fake()->randomElement(['input', 'output']),
            'requested_at' => $requestedAt,
            'approved_at' => $status !== 'pending' ? fake()->dateTimeBetween($requestedAt, 'now') : null,
            'provided_at' => $status === 'provided' ? fake()->dateTimeBetween($requestedAt, 'now') : null,
            'verified_at' => $status === 'provided' && fake()->boolean(80) ? fake()->dateTimeBetween($requestedAt, 'now') : null,
            'approved_by' => $status !== 'pending' ? User::factory() : null,
            'provided_by' => $status === 'provided' ? User::factory() : null,
            'verified_by' => $status === 'provided' && fake()->boolean(80) ? User::factory() : null,
            'notes' => fake()->boolean(30) ? fake()->sentence() : null,
        ];
    }

    /**
     * Indicate that the request is pending.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
            'approved_at' => null,
            'provided_at' => null,
            'verified_at' => null,
            'approved_by' => null,
            'provided_by' => null,
            'verified_by' => null,
        ]);
    }

    /**
     * Indicate that the request is approved.
     */
    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'approved',
            'approved_at' => fake()->dateTimeBetween($attributes['requested_at'], 'now'),
            'approved_by' => User::factory(),
            'provided_at' => null,
            'verified_at' => null,
            'provided_by' => null,
            'verified_by' => null,
        ]);
    }

    /**
     * Indicate that the request is provided.
     */
    public function provided(): static
    {
        return $this->state(function (array $attributes) {
            $approvedAt = fake()->dateTimeBetween($attributes['requested_at'], 'now');
            $providedAt = fake()->dateTimeBetween($approvedAt, 'now');
            
            return [
                'status' => 'provided',
                'approved_at' => $approvedAt,
                'approved_by' => User::factory(),
                'provided_at' => $providedAt,
                'provided_by' => User::factory(),
                'verified_at' => fake()->boolean(80) ? fake()->dateTimeBetween($providedAt, 'now') : null,
                'verified_by' => fake()->boolean(80) ? User::factory() : null,
            ];
        });
    }

    /**
     * Indicate that the request is rejected.
     */
    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'rejected',
            'approved_at' => fake()->dateTimeBetween($attributes['requested_at'], 'now'),
            'approved_by' => User::factory(),
            'provided_at' => null,
            'verified_at' => null,
            'provided_by' => null,
            'verified_by' => null,
        ]);
    }

    /**
     * Indicate that the request is input type.
     */
    public function input(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'input',
        ]);
    }

    /**
     * Indicate that the request is output type.
     */
    public function output(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'output',
        ]);
    }
}