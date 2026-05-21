const FEATURES = [
  {
    title: "Precise issue reporting",
    description:
      "Citizens submit title, description, category, photo URL, and map coordinates so crews know exactly where to go.",
    icon: "📍",
  },
  {
    title: "Role-based dashboards",
    description:
      "Separate workspaces for citizens, staff, and admins keep permissions clear and workflows efficient.",
    icon: "👥",
  },
  {
    title: "Status tracking",
    description:
      "Every report moves through open, in-progress, resolved, or rejected states with a visible history.",
    icon: "📋",
  },
  {
    title: "Staff assignment",
    description:
      "Admins assign field staff to urgent reports so high-priority infrastructure work starts faster.",
    icon: "🛠️",
  },
  {
    title: "Community visibility",
    description:
      "Resolved issues are published on the home page and all-issues feed to build public trust.",
    icon: "✅",
  },
  {
    title: "Secure authentication",
    description:
      "Firebase sign-in with JWT-backed API access protects accounts and personal data.",
    icon: "🔐",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-16 sm:py-20" aria-labelledby="features-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2
            id="features-heading"
            className="text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Built for modern city maintenance
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            City Guardian connects residents and municipal teams with tools designed
            for real infrastructure workflows — not generic ticketing.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <span className="text-2xl" aria-hidden="true">
                {feature.icon}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
