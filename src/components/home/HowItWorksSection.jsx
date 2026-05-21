const STEPS = [
  {
    step: "01",
    title: "Citizen reports",
    description:
      "A resident documents a pothole, broken streetlight, or sanitation issue with photos and location details.",
  },
  {
    step: "02",
    title: "Admin reviews & assigns",
    description:
      "City administrators validate the report and assign the right field staff member for the job.",
  },
  {
    step: "03",
    title: "Staff resolves",
    description:
      "Assigned staff update status as work progresses — from in-progress through to resolved on site.",
  },
  {
    step: "04",
    title: "Community sees results",
    description:
      "Resolved issues appear publicly so neighbors know the city responded and the fix is complete.",
  },
];

export function HowItWorksSection() {
  return (
    <section
      className="bg-slate-900 py-16 text-white sm:py-20"
      aria-labelledby="how-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="how-heading" className="text-2xl font-bold sm:text-3xl">
          How it works
        </h2>
        <p className="mt-3 max-w-2xl text-slate-300">
          From first report to public resolution — a straightforward flow that keeps
          citizens, staff, and administrators aligned.
        </p>

        <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((item) => (
            <li key={item.step} className="relative">
              <span className="text-4xl font-bold text-emerald-500/80">
                {item.step}
              </span>
              <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                {item.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
