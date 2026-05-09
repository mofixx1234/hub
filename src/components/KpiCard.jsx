export function KpiCard({ titre, valeur, sousTitre, accent = 'border-slate-200' }) {
  return (
    <div
      className={`rounded-2xl border bg-white p-5 shadow-sm ${accent}`}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{titre}</p>
      <p className="mt-2 text-2xl font-bold tabular-nums text-slate-900">{valeur}</p>
      {sousTitre && <p className="mt-1 text-xs text-slate-600">{sousTitre}</p>}
    </div>
  );
}
