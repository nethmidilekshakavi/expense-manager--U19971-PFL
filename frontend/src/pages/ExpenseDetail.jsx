import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getExpense } from '../api/expenses';

function ExpenseDetail() {
  const { id } = useParams();
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchExpense();
  }, [id]);

  const fetchExpense = async () => {
    try {
      setLoading(true);
      const response = await getExpense(id);
      setExpense(response.data);
      setError(null);
    } catch (err) {
      setError('Expense not found.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="app-container">
        <p className="loading-state">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <Link to="/" className="link-back">&larr; Back to list</Link>
        <p role="alert" className="alert alert-error">{error}</p>
      </div>
    );
  }

  if (!expense) return null;

  return (
    <div className="app-container">
      <Link to="/" className="link-back">&larr; Back to list</Link>
      <h1>Expense Details</h1>

      <div className="card">
        <dl className="detail-grid">
          <div className="detail-item">
            <dt>Date</dt>
            <dd>{expense.date}</dd>
          </div>

          <div className="detail-item">
            <dt>Type</dt>
            <dd>
              <span className={`type-badge ${expense.expense_type}`}>
                {expense.expense_type}
              </span>
            </dd>
          </div>

          <div className="detail-item">
            <dt>Description</dt>
            <dd>{expense.description}</dd>
          </div>

          <div className="detail-item cost">
            <dt>Cost</dt>
            <dd>Rs. {expense.cost}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

export default ExpenseDetail;
