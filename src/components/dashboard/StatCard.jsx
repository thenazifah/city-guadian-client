export function StatCard({ label, value, hint, accent = "emerald" }) {
  const accents = {
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-800",
    amber: "border-amber-200 bg-amber-50 text-amber-800",
    blue: "border-blue-200 bg-blue-50 text-blue-800",
    slate: "border-slate-200 bg-slate-50 text-slate-800",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
      {hint && (
        <p
          className={`mt-2 inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${
            accents[accent] || accents.emerald
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
}
