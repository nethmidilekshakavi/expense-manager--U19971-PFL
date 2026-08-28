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
    const confirmed = window.confirm(
      `Are you sure you want to delete "${expense.description}"? This cannot be undone.`
    );
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
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading expense details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5" style={{ maxWidth: '600px' }}>
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <Link to="/" className="btn btn-outline-secondary">&larr; Back to list</Link>
      </div>
    );
  }

  if (!expense) return null;

  const typeColors = {
    travel: 'primary',
    food: 'success',
    other: 'secondary',
  };

  return (
    <div className="container py-5" style={{ maxWidth: '600px' }}>
      <Link to="/" className="d-inline-block mb-3 text-decoration-none">
        &larr; Back to list
      </Link>

      <div className="card shadow-sm">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <h1 className="h3 mb-0">Expense Details</h1>
            <span className={`badge text-bg-${typeColors[expense.expense_type] || 'secondary'} text-capitalize fs-6`}>
              {expense.expense_type}
            </span>
          </div>

          <dl className="row mb-4">
            <dt className="col-sm-4 text-muted">Date</dt>
            <dd className="col-sm-8">{expense.date}</dd>

            <dt className="col-sm-4 text-muted">Description</dt>
            <dd className="col-sm-8">{expense.description}</dd>

            <dt className="col-sm-4 text-muted">Cost</dt>
            <dd className="col-sm-8 fs-4 fw-bold">
              £{parseFloat(expense.cost_gbp).toFixed(2)}
            </dd>
          </dl>

          <div className="d-flex gap-2">
            <Link to={`/expenses/${id}/edit`} className="btn btn-primary">
              Edit
            </Link>
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={handleDelete}
              disabled={deleting}
              aria-label={`Delete expense: ${expense.description}`}
            >
              {deleting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExpenseDetail;