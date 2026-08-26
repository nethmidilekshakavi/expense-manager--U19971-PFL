import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getExpense, deleteExpense } from '../api/expenses';

function ExpenseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

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

  const handleDelete = async () => {
    const confirmed = window.confirm('Delete this expense? This cannot be undone.');
    if (!confirmed) return;

    try {
      setDeleting(true);
      await deleteExpense(id);
      navigate('/');
    } catch (err) {
      setError('Failed to delete expense. Please try again.');
      console.error(err);
      setDeleting(false);
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

        <div className="detail-actions">
          <Link to={`/expenses/${id}/edit`} className="btn btn-primary">Edit</Link>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExpenseDetail;