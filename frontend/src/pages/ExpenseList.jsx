import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getExpenses, deleteExpense } from '../api/expenses';

function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await getExpenses();
      setExpenses(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load expenses. Is the backend server running?');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, description) => {
    const confirmed = window.confirm(`Delete "${description}"? This cannot be undone.`);
    if (!confirmed) return;

    try {
      setDeletingId(id);
      await deleteExpense(id);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      setError('Failed to delete expense. Please try again.');
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading expenses...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  const typeColors = {
    travel: 'primary',
    food: 'success',
    other: 'secondary',
  };

  const total = expenses.reduce((sum, e) => sum + Number(e.cost_gbp), 0);
  const byType = expenses.reduce((acc, e) => {
    acc[e.expense_type] = (acc[e.expense_type] || 0) + Number(e.cost_gbp);
    return acc;
  }, {});
  const topCategory = Object.entries(byType).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>My Expenses</h1>
        <Link to="/add" className="btn btn-primary">
          + Add New Expense
        </Link>
      </div>

      {expenses.length > 0 && (
        <div className="card shadow-sm mb-4">
          <div className="card-body d-flex justify-content-around text-center flex-wrap gap-3">
            <div>
              <div className="text-muted small">Total Spent</div>
              <div className="fs-4 fw-bold">£{total.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-muted small">Entries</div>
              <div className="fs-4 fw-bold">{expenses.length}</div>
            </div>
            <div>
              <div className="text-muted small">Top Category</div>
              <div className="fs-4 fw-bold text-capitalize">{topCategory}</div>
            </div>
          </div>
        </div>
      )}

      {expenses.length === 0 ? (
        <div className="alert alert-info" role="status">
          No expenses yet. Add your first one!
        </div>
      ) : (
        <div className="card shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0" aria-label="List of expenses">
              <caption className="visually-hidden">A table of your recorded expenses</caption>
              <thead>
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col">Description</th>
                  <th scope="col">Type</th>
                  <th scope="col" className="text-end">Cost (£)</th>
                  <th scope="col">
                    <span className="visually-hidden">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.id}>
                    <td>{expense.date}</td>
                    <td>{expense.description}</td>
                    <td>
                      <span className={`badge text-bg-${typeColors[expense.expense_type] || 'secondary'} text-capitalize`}>
                        {expense.expense_type}
                      </span>
                    </td>
                    <td className="text-end">{parseFloat(expense.cost_gbp).toFixed(2)}</td>
                    <td>
                      <div className="d-flex gap-2 justify-content-end">
                        <Link
                          to={`/expenses/${expense.id}`}
                          className="btn btn-sm btn-outline-primary"
                          aria-label={`View details for ${expense.description}`}
                        >
                          View
                        </Link>
                        <Link
                          to={`/expenses/${expense.id}/edit`}
                          className="btn btn-sm btn-outline-secondary"
                          aria-label={`Edit ${expense.description}`}
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(expense.id, expense.description)}
                          disabled={deletingId === expense.id}
                          aria-label={`Delete expense: ${expense.description}`}
                        >
                          {deletingId === expense.id ? '...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExpenseList;