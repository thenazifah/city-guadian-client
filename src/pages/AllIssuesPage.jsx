import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { IssueFeedCard } from "@/components/issues/IssueFeedCard";
import { queryKeys } from "@/config/queryKeys";
import { useAuth } from "@/hooks/useAuth";
import { issuesService } from "@/services/issues.service";
import { notifyError, notifySuccess } from "@/utils/toast";
import { sortIssuesForFeed } from "@/utils/issueHelpers";

export function AllIssuesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuth();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: queryKeys.issues.publicAll(50),
    queryFn: () => issuesService.getPublicAll(50),
  });

  const upvoteMutation = useMutation({
    mutationFn: (issueId) => issuesService.upvote(issueId),
    onSuccess: (updatedIssue) => {
      queryClient.setQueryData(queryKeys.issues.publicAll(50), (old) => {
        if (!old) return old;
        const next = old.map((item) =>
          item.id === updatedIssue.id ? updatedIssue : item
        );
        return sortIssuesForFeed(next);
      });
      queryClient.invalidateQueries({ queryKey: ["issues", "public"] });
      notifySuccess("Thanks for supporting this issue!");
    },
    onError: (err) => {
      notifyError(err.message || "Could not upvote");
    },
  });

  function handleUpvote(issue) {
    if (!isAuthenticated) {
      notifyError("Please sign in to upvote issues.");
      navigate("/login", { state: { from: { pathname: "/all-issues" } } });
      return;
    }

    if (issue.isOwnIssue) {
      notifyError("You cannot upvote your own issue.");
      return;
    }

    if (issue.hasUpvoted) {
      notifyError("You have already upvoted this issue.");
      return;
    }

    upvoteMutation.mutate(issue.id);
  }

  const issues = data ? sortIssuesForFeed(data) : [];
  const highPriorityCount = issues.filter((i) => i.priority === "high").length;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            All Issues
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Browse community-reported infrastructure problems. High-priority
            issues stay at the top. Sign in to upvote reports you want addressed
            sooner.
          </p>
        </div>
        {!isAuthenticated && (
          <p className="rounded-lg bg-amber-50 px-4 py-2 text-sm text-amber-800">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-semibold underline"
            >
              Sign in
            </button>{" "}
            to upvote issues
          </p>
        )}
      </div>

      {highPriorityCount > 0 && (
        <p className="mt-4 text-sm font-medium text-orange-700">
          {highPriorityCount} high-priority issue{highPriorityCount > 1 ? "s" : ""}{" "}
          pinned to the top
        </p>
      )}

      {isLoading && (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-96 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      )}

      {isError && (
        <div className="mt-10 rounded-xl border border-red-200 bg-red-50 px-4 py-6 text-sm text-red-700">
          Could not load issues. {error?.message}
        </div>
      )}

      {!isLoading && !isError && issues.length === 0 && (
        <div className="mt-10 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
          <p className="font-medium text-slate-800">No issues reported yet</p>
          <p className="mt-2 text-sm text-slate-600">
            Be the first to report a problem in your area.
          </p>
        </div>
      )}

      {!isLoading && !isError && issues.length > 0 && (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {issues.map((issue) => (
            <IssueFeedCard
              key={issue.id}
              issue={issue}
              onUpvote={handleUpvote}
              isUpvoting={
                upvoteMutation.isPending &&
                upvoteMutation.variables === issue.id
              }
              isAuthenticated={isAuthenticated}
            />
          ))}
        </div>
      )}

      {isAuthenticated && user && (
        <p className="mt-8 text-center text-xs text-slate-500">
          Logged in as {user.displayName} — upvotes are limited to one per issue
          and cannot be applied to your own reports.
        </p>
      )}
    </section>
  );
}
