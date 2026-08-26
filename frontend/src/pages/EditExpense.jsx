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
      <div className="app-container">
        <p className="loading-state">Loading...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Link to={`/expenses/${id}`} className="link-back">&larr; Back to details</Link>
      <h1>Edit Expense</h1>

      <div className="card">
        {errors.general && (
          <p role="alert" className="alert alert-error">{errors.general}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
            {errors.date && <p className="field-error">{errors.date[0]}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="cost">Cost (Rs.)</label>
            <input
              type="number"
              id="cost"
              name="cost"
              step="0.01"
              min="0"
              value={formData.cost}
              onChange={handleChange}
              required
            />
            {errors.cost && <p className="field-error">{errors.cost[0]}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
            {errors.description && <p className="field-error">{errors.description[0]}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="expense_type">Type</label>
            <select
              id="expense_type"
              name="expense_type"
              value={formData.expense_type}
              onChange={handleChange}
            >
              <option value="travel">Travel</option>
              <option value="food">Food</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
            <Link to={`/expenses/${id}`} className="btn btn-secondary">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditExpense;