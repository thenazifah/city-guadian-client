import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { IssueCard } from "@/components/issues/IssueCard";
import { queryKeys } from "@/config/queryKeys";
import { issuesService } from "@/services/issues.service";

export function ResolvedIssuesSection() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: queryKeys.issues.publicResolved(6),
    queryFn: () => issuesService.getPublicResolved(6),
  });

  const issues = data ?? [];

  return (
    <section
      id="resolved-issues"
      className="bg-white py-16 sm:py-20"
      aria-labelledby="resolved-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="resolved-heading"
              className="text-2xl font-bold text-slate-900 sm:text-3xl"
            >
              Latest resolved issues
            </h2>
            <p className="mt-2 max-w-2xl text-slate-600">
              Recent fixes completed by city staff — proof that reported problems
              are being addressed across neighborhoods.
            </p>
          </div>
          <Link
            to="/all-issues"
            className="text-sm font-semibold text-emerald-700 hover:underline"
          >
            View all issues →
          </Link>
        </div>

        {isLoading && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-80 animate-pulse rounded-2xl bg-slate-100"
              />
            ))}
          </div>
        )}

        {isError && (
          <div className="mt-10 rounded-xl border border-red-200 bg-red-50 px-4 py-6 text-sm text-red-700">
            Could not load resolved issues. {error?.message || "Please try again later."}
            <br />
            <span className="text-red-600">
              Make sure the backend server is running on port 3000.
            </span>
          </div>
        )}

        {!isLoading && !isError && issues.length === 0 && (
          <div className="mt-10 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
            <p className="font-medium text-slate-800">No resolved issues yet</p>
            <p className="mt-2 text-sm text-slate-600">
              When staff mark issues as resolved, they will appear here for the community to see.
            </p>
          </div>
        )}

        {!isLoading && !isError && issues.length > 0 && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {issues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
