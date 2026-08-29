import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function MonthlyChart({ expenses, compact = false }) {
  const byMonth = expenses.reduce((acc, e) => {
    const month = e.date.slice(0, 7);
    acc[month] = (acc[month] || 0) + Number(e.cost_gbp);
    return acc;
  }, {});

  const data = Object.entries(byMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, total]) => ({ month, total: Number(total.toFixed(2)) }));

  if (data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={compact ? 180 : 250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip formatter={(value) => [`£${value}`, 'Total']} />
        <Bar dataKey="total" fill="#0d6efd" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default MonthlyChart;