<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Expense>
 */
class ExpenseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'date' => $this->faker->dateTimeBetween('-30 days', 'now')->format('Y-m-d'),
            'cost' => $this->faker->randomFloat(2, 5, 5000),
            'description' => $this->faker->sentence(3),
            'expense_type' => $this->faker->randomElement(['travel', 'food', 'other']),
        ];
    }
}
