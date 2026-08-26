import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ExpenseList from './pages/ExpenseList';
import AddExpense from './pages/AddExpense';
import ExpenseDetail from './pages/ExpenseDetail';
import EditExpense from './pages/EditExpense';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">
            💰 Expense Manager
          </Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<ExpenseList />} />
        <Route path="/add" element={<AddExpense />} />
        <Route path="/expenses/:id" element={<ExpenseDetail />} />
        <Route path="/expenses/:id/edit" element={<EditExpense />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;