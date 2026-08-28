<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ExpenseFactory extends Factory
{
    public function definition(): array
    {
        return [
            'date' => $this->faker->dateTimeBetween('-30 days', 'now')->format('Y-m-d'),
            'cost_gbp' => $this->faker->randomFloat(2, 5, 5000),
            'description' => $this->faker->sentence(3),
            'expense_type' => $this->faker->randomElement(['travel', 'food', 'other']),
        ];
    }
}
