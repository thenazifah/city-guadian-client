import { Link } from "react-router-dom";

export function NeighborhoodImpactSection() {
  return (
    <section className="py-16 sm:py-20" aria-labelledby="impact-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 rounded-2xl bg-emerald-50 p-8 lg:grid-cols-2 lg:items-center lg:p-12">
          <div>
            <h2
              id="impact-heading"
              className="text-2xl font-bold text-slate-900 sm:text-3xl"
            >
              Stronger neighborhoods through faster repairs
            </h2>
            <p className="mt-4 text-slate-700 leading-relaxed">
              Delayed road repairs and broken utilities affect daily commutes, school
              routes, and local businesses. City Guardian gives residents a direct
              channel to surface problems before they create safety risks or costly
              emergency fixes.
            </p>
            <p className="mt-4 text-slate-700 leading-relaxed">
              When maintenance teams close issues quickly, property values stabilize,
              foot traffic returns, and public confidence in city services grows.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: "24h", label: "Typical first response target" },
              { value: "6+", label: "Infrastructure categories" },
              { value: "100%", label: "Location-tagged reports" },
              { value: "Open", label: "Public resolved archive" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl bg-white p-4 text-center shadow-sm"
              >
                <p className="text-2xl font-bold text-emerald-700">{stat.value}</p>
                <p className="mt-1 text-xs text-slate-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function SafetyStandardsSection() {
  return (
    <section
      className="border-t border-slate-200 bg-white py-16 sm:py-20"
      aria-labelledby="safety-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            id="safety-heading"
            className="text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Infrastructure safety starts with accurate reports
          </h2>
          <p className="mt-4 text-slate-600 leading-relaxed">
            Potholes damage vehicles, dark streets increase crime risk, and blocked
            drainage causes flooding during storms. Clear photos, categories, and GPS
            coordinates help crews bring the right equipment the first time — reducing
            repeat visits and lane closures.
          </p>
          <Link
            to="/register"
            className="mt-8 inline-flex rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Start reporting in your area
          </Link>
        </div>
      </div>
    </section>
  );
}
