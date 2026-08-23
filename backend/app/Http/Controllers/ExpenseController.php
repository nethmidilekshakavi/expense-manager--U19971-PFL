<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Expense::latest()->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'cost' => 'required|numeric|min:0',
            'description' => 'required|string|max:255',
            'expense_type' => 'required|in:travel,food,other',
        ]);

        $expense = Expense::create($validated);

        return response()->json($expense, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Expense $expense)
    {
        return $expense;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Expense $expense)
    {
        $validated = $request->validate([
            'date' => 'sometimes|required|date',
            'cost' => 'sometimes|required|numeric|min:0',
            'description' => 'sometimes|required|string|max:255',
            'expense_type' => 'sometimes|required|in:travel,food,other',
        ]);

        $expense->update($validated);

        return response()->json($expense);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Expense $expense)
    {
        $expense->delete();

        return response()->json(null, 204);
    }
}
