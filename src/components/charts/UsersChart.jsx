import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export function UsersChart({ data }) {
  if (!data?.length) {
    return <p className="text-sm text-slate-500">Pas encore assez d’historique.</p>;
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="periode" tick={{ fontSize: 10 }} stroke="#64748b" />
          <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="#64748b" />
          <Tooltip />
          <Legend />
          <Bar dataKey="nouveaux" name="Nouveaux comptes" fill="#22c55e" radius={[4, 4, 0, 0]} />
          <Bar dataKey="churn" name="Abonnements expirés" fill="#ef4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
