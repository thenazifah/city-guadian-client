import { Link, useParams } from "react-router-dom";

/**
 * Placeholder until Step 4 — linked from home issue cards.
 */
export function IssueDetailsPage() {
  const { id } = useParams();

  return (
    <section className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">Issue details</h1>
      <p className="mt-2 text-slate-600">
        Full details for issue <span className="font-mono text-sm">{id}</span> will
        be built in Step 4.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
      >
        Back to home
      </Link>
    </section>
  );
}
