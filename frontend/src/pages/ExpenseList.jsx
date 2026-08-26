import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getExpenses } from '../api/expenses';

function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const total = expenses.reduce((sum, e) => sum + parseFloat(e.cost), 0);

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>My Expenses</h1>
        <Link to="/add" className="btn btn-primary">
          + Add New Expense
        </Link>
      </div>

      {expenses.length === 0 ? (
        <div className="alert alert-info" role="status">
          No expenses yet. Add your first one!
        </div>
      ) : (
        <>
          <p className="text-muted">
            Total spent: <strong>Rs. {total.toFixed(2)}</strong> across {expenses.length} expense
            {expenses.length !== 1 ? 's' : ''}
          </p>
          <div className="table-responsive">
            <table className="table table-hover align-middle" aria-label="List of expenses">
              <caption className="visually-hidden">A table of your recorded expenses</caption>
              <thead>
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col">Description</th>
                  <th scope="col">Type</th>
                  <th scope="col" className="text-end">Cost (Rs.)</th>
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
                      <span className="badge text-bg-secondary text-capitalize">
                        {expense.expense_type}
                      </span>
                    </td>
                    <td className="text-end">{parseFloat(expense.cost).toFixed(2)}</td>
                    <td>
                      <Link
                        to={`/expenses/${expense.id}`}
                        className="btn btn-sm btn-outline-primary"
                        aria-label={`View details for ${expense.description}`}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default ExpenseList;