import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createExpense } from '../api/expenses';

function AddExpense() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: '',
    cost: '',
    description: '',
    expense_type: 'travel',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    try {
      await createExpense(formData);
      navigate('/');
    } catch (err) {
      if (err.response && err.response.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        setErrors({ general: 'Failed to add expense. Please try again.' });
      }
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app-container">
      <Link to="/" className="link-back">&larr; Back to list</Link>
      <h1>Add New Expense</h1>

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
              {submitting ? 'Saving...' : 'Save Expense'}
            </button>
            <Link to="/" className="btn btn-secondary">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddExpense;
