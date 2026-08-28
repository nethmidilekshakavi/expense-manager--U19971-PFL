import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import AddExpense from './AddExpense';
import * as expensesApi from '../api/expenses';

vi.mock('../api/expenses');

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('AddExpense', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all form fields', () => {
    renderWithRouter(<AddExpense />);

    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cost/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/type/i)).toBeInTheDocument();
  });

  it('submits the form with entered data and navigates on success', async () => {
    const user = userEvent.setup();
    expensesApi.createExpense.mockResolvedValue({
      data: { id: 1, date: '2026-08-23', cost_gbp: 1500, description: 'Lunch', expense_type: 'food' },
    });

    renderWithRouter(<AddExpense />);

    await user.type(screen.getByLabelText(/date/i), '2026-08-23');
    await user.type(screen.getByLabelText(/cost/i), '1500');
    await user.type(screen.getByLabelText(/description/i), 'Lunch');
    await user.selectOptions(screen.getByLabelText(/type/i), 'food');

    await user.click(screen.getByRole('button', { name: /save expense/i }));

    await waitFor(() => {
      expect(expensesApi.createExpense).toHaveBeenCalledWith({
        date: '2026-08-23',
        cost_gbp: '1500',
        description: 'Lunch',
        expense_type: 'food',
      });
    });

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('shows validation errors returned from the backend', async () => {
    const user = userEvent.setup();
    expensesApi.createExpense.mockRejectedValue({
      response: {
        status: 422,
        data: {
          errors: {
            description: ['The description field is required.'],
          },
        },
      },
    });

    renderWithRouter(<AddExpense />);

    await user.type(screen.getByLabelText(/date/i), '2026-08-23');
    await user.type(screen.getByLabelText(/cost/i), '100');
    await user.selectOptions(screen.getByLabelText(/type/i), 'other');

    await user.click(screen.getByRole('button', { name: /save expense/i }));

    await waitFor(() => {
      expect(screen.getByText(/description field is required/i)).toBeInTheDocument();
    });
  });
});