import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ExpenseList from './ExpenseList';
import * as expensesApi from '../api/expenses';

vi.mock('../api/expenses');

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('ExpenseList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state initially', () => {
    expensesApi.getExpenses.mockReturnValue(new Promise(() => {}));
    renderWithRouter(<ExpenseList />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('displays a list of expenses after loading', async () => {
    expensesApi.getExpenses.mockResolvedValue({
      data: [
        { id: 1, date: '2026-08-23', cost_gbp: 1500, description: 'Lunch', expense_type: 'food' },
        { id: 2, date: '2026-08-22', cost_gbp: 500, description: 'Bus fare', expense_type: 'travel' },
      ],
    });

    renderWithRouter(<ExpenseList />);

    await waitFor(() => {
      expect(screen.getByText('Lunch')).toBeInTheDocument();
    });

    expect(screen.getByText('Bus fare')).toBeInTheDocument();
  });

  it('shows a message when there are no expenses', async () => {
    expensesApi.getExpenses.mockResolvedValue({ data: [] });

    renderWithRouter(<ExpenseList />);

    await waitFor(() => {
      expect(screen.getByText(/no expenses yet/i)).toBeInTheDocument();
    });
  });

  it('shows an error message when the API call fails', async () => {
    expensesApi.getExpenses.mockRejectedValue(new Error('Network error'));

    renderWithRouter(<ExpenseList />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });
});