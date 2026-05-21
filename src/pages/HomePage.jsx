import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 px-6 py-14 text-white shadow-lg sm:px-12">
        <h1 className="max-w-2xl text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
          Report public infrastructure issues in your city
        </h1>
        <p className="mt-4 max-w-xl text-base text-emerald-50 sm:text-lg">
          City Guardian helps citizens report potholes, broken lights, sanitation problems, and more — then tracks resolution with municipal staff.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            to="/register"
            className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-emerald-800 hover:bg-emerald-50"
          >
            Get started
          </Link>
          <Link
            to="/all-issues"
            className="rounded-lg border border-white/60 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
          >
            Browse issues
          </Link>
        </div>
      </div>
    </section>
  );
}
