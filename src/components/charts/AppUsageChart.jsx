import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export function AppUsageChart({ data }) {
  if (!data?.length) {
    return <p className="text-sm text-slate-500">Aucune activité applicative enregistrée.</p>;
  }

  return (
    <div className="h-[min(28rem,70vh)] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 8, right: 16, left: 8, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
          <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
          <YAxis
            type="category"
            dataKey="app"
            width={120}
            tick={{ fontSize: 11 }}
            stroke="#64748b"
          />
          <Tooltip formatter={(v) => [`${v} sessions`, '']} />
          <Bar dataKey="sessions" fill="#0369a1" radius={[0, 4, 4, 0]} name="Sessions" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
