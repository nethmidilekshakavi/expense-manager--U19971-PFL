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
      <div className="app-container">
        <p className="loading-state">Loading expenses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <p role="alert" className="alert alert-error">{error}</p>
      </div>
    );
  }

  const total = expenses.reduce((sum, e) => sum + Number(e.cost), 0);
  const byType = expenses.reduce((acc, e) => {
    acc[e.expense_type] = (acc[e.expense_type] || 0) + Number(e.cost);
    return acc;
  }, {});

  return (
    <div className="app-container">
      <div className="page-header">
        <h1>My Expenses</h1>
        <Link to="/add" className="btn btn-primary">+ Add New Expense</Link>
      </div>

      {expenses.length > 0 && (
        <div className="summary-pill">
          <div className="summary-item">
            <div className="summary-label">Total Spent</div>
            <div className="summary-value">Rs. {total.toFixed(2)}</div>
          </div>
          <div className="divider" />
          <div className="summary-item">
            <div className="summary-label">Entries</div>
            <div className="summary-value">{expenses.length}</div>
          </div>
          <div className="divider" />
          <div className="summary-item">
            <div className="summary-label">Top Category</div>
            <div className="summary-value">
              {Object.entries(byType).sort((a, b) => b[1] - a[1])[0]?.[0] || '-'}
            </div>
          </div>
        </div>
      )}

      {expenses.length === 0 ? (
        <div className="table-wrapper">
          <p className="empty-state">No expenses yet. Add your first one!</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Type</th>
                <th>Cost (Rs.)</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id}>
                  <td>{expense.date}</td>
                  <td>{expense.description}</td>
                  <td>
                    <span className={`type-badge ${expense.expense_type}`}>
                      {expense.expense_type}
                    </span>
                  </td>
                  <td className="cost-cell">Rs. {expense.cost}</td>
                  <td>
                    <Link to={`/expenses/${expense.id}`} className="view-link">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ExpenseList;
