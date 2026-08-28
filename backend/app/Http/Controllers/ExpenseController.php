<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    public function index()
    {
        return Expense::latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'cost_gbp' => 'required|numeric|min:0',
            'description' => 'required|string|max:255',
            'expense_type' => 'required|in:travel,food,other',
        ]);

        $expense = Expense::create($validated);

        return response()->json($expense, 201);
    }

    public function show(Expense $expense)
    {
        return $expense;
    }

    public function update(Request $request, Expense $expense)
    {
        $validated = $request->validate([
            'date' => 'sometimes|required|date',
            'cost_gbp' => 'sometimes|required|numeric|min:0',
            'description' => 'sometimes|required|string|max:255',
            'expense_type' => 'sometimes|required|in:travel,food,other',
        ]);

        $expense->update($validated);

        return response()->json($expense);
    }

    public function destroy(Expense $expense)
    {
        $expense->delete();

        return response()->json(null, 204);
    }
}
