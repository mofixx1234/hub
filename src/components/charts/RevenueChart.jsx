import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const COULEUR = '#ff6b35';

function formatFcfa(n) {
  return `${Number(n).toLocaleString('fr-CI')} FCFA`;
}

export function RevenueChart({ data }) {
  if (!data?.length) {
    return <p className="text-sm text-slate-500">Aucune donnée sur la période.</p>;
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="couleurRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COULEUR} stopOpacity={0.35} />
              <stop offset="95%" stopColor={COULEUR} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#64748b" />
          <YAxis tick={{ fontSize: 11 }} stroke="#64748b" />
          <Tooltip
            formatter={(value) => [formatFcfa(value), 'Encaissements']}
            labelFormatter={(label) => label}
          />
          <Area
            type="monotone"
            dataKey="montant"
            stroke={COULEUR}
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#couleurRevenue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
