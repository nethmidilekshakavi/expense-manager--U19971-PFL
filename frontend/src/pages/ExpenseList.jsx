import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getExpenses, deleteExpense } from '../api/expenses';
import MonthlyChart from '../components/MonthlyChart';

function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');

  const [filters, setFilters] = useState({
    search: '',
    expense_type: '',
    date_from: '',
    date_to: '',
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async (activeFilters = {}) => {
    try {
      setLoading(true);
      const response = await getExpenses(activeFilters);
      setExpenses(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load expenses. Is the backend server running?');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const activeFilterCount = Object.values(filters).filter((v) => v !== '').length;

  const applyFilters = (e) => {
    e.preventDefault();
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== '')
    );
    fetchExpenses(activeFilters);
  };

  const clearFilters = () => {
    setFilters({ search: '', expense_type: '', date_from: '', date_to: '' });
    fetchExpenses();
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

  const exportToCsv = () => {
    if (expenses.length === 0) return;

    const headers = ['Date', 'Description', 'Type', 'Cost (GBP)'];
    const rows = expenses.map((e) => [
      e.date,
      `"${e.description.replace(/"/g, '""')}"`,
      e.expense_type,
      parseFloat(e.cost_gbp).toFixed(2),
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `expenses-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading && expenses.length === 0) {
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
    <div className="container py-4">
      {/* Header row */}
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h1 className="h3 mb-0">My Expenses</h1>
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary position-relative"
            onClick={() => setShowFilters((s) => !s)}
          >
            🔍 Search & Filter
            {activeFilterCount > 0 && (
              <span className="badge rounded-pill text-bg-primary ms-1">{activeFilterCount}</span>
            )}
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={exportToCsv}
            disabled={expenses.length === 0}
          >
            ⬇ CSV
          </button>
          <Link to="/add" className="btn btn-sm btn-primary">
            + Add Expense
          </Link>
        </div>
      </div>

      {/* Collapsible filter bar */}
      {showFilters && (
        <div className="card shadow-sm mb-3">
          <div className="card-body py-3">
            <form onSubmit={applyFilters} className="row g-2 align-items-end">
              <div className="col-md-3">
                <label htmlFor="search" className="form-label small text-muted mb-1">Search</label>
                <input
                  type="text" id="search" name="search" className="form-control form-control-sm"
                  placeholder="Description..." value={filters.search} onChange={handleFilterChange}
                />
              </div>
              <div className="col-md-2">
                <label htmlFor="expense_type" className="form-label small text-muted mb-1">Type</label>
                <select
                  id="expense_type" name="expense_type" className="form-select form-select-sm"
                  value={filters.expense_type} onChange={handleFilterChange}
                >
                  <option value="">All</option>
                  <option value="travel">Travel</option>
                  <option value="food">Food</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="col-md-2">
                <label htmlFor="date_from" className="form-label small text-muted mb-1">From</label>
                <input
                  type="date" id="date_from" name="date_from" className="form-control form-control-sm"
                  value={filters.date_from} onChange={handleFilterChange}
                />
              </div>
              <div className="col-md-2">
                <label htmlFor="date_to" className="form-label small text-muted mb-1">To</label>
                <input
                  type="date" id="date_to" name="date_to" className="form-control form-control-sm"
                  value={filters.date_to} onChange={handleFilterChange}
                />
              </div>
              <div className="col-md-3 d-flex gap-2">
                <button type="submit" className="btn btn-sm btn-primary flex-fill">Apply</button>
                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={clearFilters}>Clear</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {expenses.length > 0 && (
        <div className="card shadow-sm mb-3">
          <div className="card-body py-2">
            {/* Compact stats strip */}
            <div className="d-flex justify-content-around text-center flex-wrap py-2 border-bottom mb-2">
              <div>
                <span className="text-muted small me-1">Total:</span>
                <span className="fw-bold">£{total.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-muted small me-1">Entries:</span>
                <span className="fw-bold">{expenses.length}</span>
              </div>
              <div>
                <span className="text-muted small me-1">Top:</span>
                <span className="fw-bold text-capitalize">{topCategory}</span>
              </div>
            </div>

            {/* Tabs for extra detail */}
            <ul className="nav nav-tabs nav-tabs-sm border-0" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  type="button"
                  className={`nav-link py-1 px-3 small ${activeTab === 'summary' ? 'active' : ''}`}
                  onClick={() => setActiveTab('summary')}
                >
                  By Category
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  type="button"
                  className={`nav-link py-1 px-3 small ${activeTab === 'chart' ? 'active' : ''}`}
                  onClick={() => setActiveTab('chart')}
                >
                  Monthly Chart
                </button>
              </li>
            </ul>

            <div className="pt-3">
              {activeTab === 'summary' && (
                <div className="d-flex flex-wrap gap-3">
                  {Object.entries(byType).map(([type, amount]) => (
                    <div key={type} className="d-flex align-items-center gap-2">
                      <span className={`badge text-bg-${typeColors[type] || 'secondary'} text-capitalize`}>
                        {type}
                      </span>
                      <span className="fw-semibold small">£{amount.toFixed(2)}</span>
                      <span className="text-muted small">({((amount / total) * 100).toFixed(0)}%)</span>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === 'chart' && <MonthlyChart expenses={expenses} compact />}
            </div>
          </div>
        </div>
      )}

      {expenses.length === 0 ? (
        <div className="alert alert-info" role="status">
          No expenses match your filters.
        </div>
      ) : (
        <div className="card shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover table-sm align-middle mb-0" aria-label="List of expenses">
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