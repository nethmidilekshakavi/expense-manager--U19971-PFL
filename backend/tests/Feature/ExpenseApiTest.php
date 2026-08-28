<?php

namespace Tests\Feature;

use App\Models\Expense;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExpenseApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_expenses(): void
    {
        Expense::factory()->count(3)->create();

        $response = $this->getJson('/api/expenses');

        $response->assertStatus(200)
                 ->assertJsonCount(3);
    }

    public function test_can_create_expense(): void
    {
        $data = [
            'date' => '2026-08-23',
            'cost_gbp' => 1500.50,
            'description' => 'Lunch meeting',
            'expense_type' => 'food',
        ];

        $response = $this->postJson('/api/expenses', $data);

        $response->assertStatus(201)
                 ->assertJsonFragment(['description' => 'Lunch meeting']);

        $this->assertDatabaseHas('expenses', ['description' => 'Lunch meeting']);
    }

    public function test_create_expense_fails_with_missing_fields(): void
    {
        $response = $this->postJson('/api/expenses', []);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['date', 'cost_gbp', 'description', 'expense_type']);
    }

    public function test_create_expense_fails_with_invalid_type(): void
    {
        $data = [
            'date' => '2026-08-23',
            'cost_gbp' => 100,
            'description' => 'Test',
            'expense_type' => 'invalid_type',
        ];

        $response = $this->postJson('/api/expenses', $data);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['expense_type']);
    }

    public function test_can_view_single_expense(): void
    {
        $expense = Expense::factory()->create([
            'description' => 'Taxi fare',
        ]);

        $response = $this->getJson("/api/expenses/{$expense->id}");

        $response->assertStatus(200)
                 ->assertJsonFragment(['description' => 'Taxi fare']);
    }

    public function test_viewing_nonexistent_expense_returns_404(): void
    {
        $response = $this->getJson('/api/expenses/999');

        $response->assertStatus(404);
    }

    public function test_can_update_expense(): void
    {
        $expense = Expense::factory()->create();

        $response = $this->putJson("/api/expenses/{$expense->id}", [
            'description' => 'Updated description',
        ]);

        $response->assertStatus(200)
                 ->assertJsonFragment(['description' => 'Updated description']);

        $this->assertDatabaseHas('expenses', ['description' => 'Updated description']);
    }

    public function test_can_delete_expense(): void
    {
        $expense = Expense::factory()->create();

        $response = $this->deleteJson("/api/expenses/{$expense->id}");

        $response->assertStatus(204);

        $this->assertDatabaseMissing('expenses', ['id' => $expense->id]);
    }
}
