import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getExpense, updateExpense } from '../api/expenses';

function EditExpense() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: '',
    cost: '',
    description: '',
    expense_type: 'travel',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchExpense();
  }, [id]);

  const fetchExpense = async () => {
    try {
      setLoading(true);
      const response = await getExpense(id);
      const expense = response.data;
      setFormData({
        date: expense.date,
        cost: expense.cost,
        description: expense.description,
        expense_type: expense.expense_type,
      });
      setErrors({});
    } catch (err) {
      setErrors({ general: 'Could not load this expense.' });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    try {
      await updateExpense(id, formData);
      navigate(`/expenses/${id}`);
    } catch (err) {
      if (err.response && err.response.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        setErrors({ general: 'Failed to update expense. Please try again.' });
      }
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading expense...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5" style={{ maxWidth: '600px' }}>
      <Link to={`/expenses/${id}`} className="d-inline-block mb-3 text-decoration-none">
        &larr; Back to details
      </Link>
      <h1 className="mb-4">Edit Expense</h1>

      <div className="card shadow-sm">
        <div className="card-body p-4">
          {errors.general && (
            <div className="alert alert-danger" role="alert">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="date" className="form-label">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                value={formData.date}
                onChange={handleChange}
                required
                aria-describedby={errors.date ? 'date-error' : undefined}
              />
              {errors.date && (
                <div id="date-error" className="invalid-feedback">{errors.date[0]}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="cost" className="form-label">Cost (Rs.)</label>
              <input
                type="number"
                id="cost"
                name="cost"
                step="0.01"
                min="0"
                className={`form-control ${errors.cost ? 'is-invalid' : ''}`}
                value={formData.cost}
                onChange={handleChange}
                required
                aria-describedby={errors.cost ? 'cost-error' : undefined}
              />
              {errors.cost && (
                <div id="cost-error" className="invalid-feedback">{errors.cost[0]}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description</label>
              <input
                type="text"
                id="description"
                name="description"
                className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                value={formData.description}
                onChange={handleChange}
                required
                aria-describedby={errors.description ? 'description-error' : undefined}
              />
              {errors.description && (
                <div id="description-error" className="invalid-feedback">{errors.description[0]}</div>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="expense_type" className="form-label">Type</label>
              <select
                id="expense_type"
                name="expense_type"
                className="form-select"
                value={formData.expense_type}
                onChange={handleChange}
              >
                <option value="travel">Travel</option>
                <option value="food">Food</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
              <Link to={`/expenses/${id}`} className="btn btn-outline-secondary">Cancel</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditExpense;