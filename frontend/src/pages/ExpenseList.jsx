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

  if (loading) return <p>Loading expenses...</p>;
  if (error) return <p role="alert" style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h1>My Expenses</h1>
      <Link to="/add">+ Add New Expense</Link>

      {expenses.length === 0 ? (
        <p>No expenses yet. Add your first one!</p>
      ) : (
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
                <td>{expense.expense_type}</td>
                <td>{expense.cost}</td>
                <td>
                  <Link to={`/expenses/${expense.id}`}>View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ExpenseList;