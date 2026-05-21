import { Link } from "react-router-dom";
import {
  getCategoryLabel,
  getIssueImage,
  getIssueLocationText,
  getPriorityBadgeClass,
  getPriorityLabel,
  getStatusBadgeClass,
  getStatusLabel,
} from "@/utils/issueHelpers";

export function IssueFeedCard({
  issue,
  onUpvote,
  isUpvoting,
  isAuthenticated,
}) {
  const imageUrl = getIssueImage(issue);
  const canUpvote =
    isAuthenticated && !issue.isOwnIssue && !issue.hasUpvoted;
  const upvoteDisabled =
    isUpvoting || issue.hasUpvoted || issue.isOwnIssue;

  return (
    <article
      className={`flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md ${
        issue.priority === "high"
          ? "border-orange-300 ring-1 ring-orange-100"
          : "border-slate-200"
      }`}
    >
      <div className="relative aspect-[16/10] bg-slate-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={issue.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-emerald-50 px-4 text-center">
            <span className="text-3xl" aria-hidden="true">
              🏙️
            </span>
            <p className="mt-2 text-xs font-medium text-slate-600">
              {getCategoryLabel(issue.category)}
            </p>
          </div>
        )}

        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusBadgeClass(issue.status)}`}
          >
            {getStatusLabel(issue.status)}
          </span>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getPriorityBadgeClass(issue.priority)}`}
          >
            {getPriorityLabel(issue.priority)}
          </span>
        </div>

        {issue.priority === "high" && (
          <span className="absolute right-3 top-3 rounded-full bg-orange-500 px-2 py-0.5 text-xs font-bold text-white">
            Boosted
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">
          {getCategoryLabel(issue.category)}
        </p>
        <h3 className="mt-1 line-clamp-2 text-base font-bold text-slate-900">
          {issue.title}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-slate-600">
          {issue.description}
        </p>

        <p className="mt-3 flex items-start gap-1.5 text-xs text-slate-500">
          <span aria-hidden="true">📍</span>
          <span>{getIssueLocationText(issue)}</span>
        </p>

        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onUpvote(issue)}
            disabled={upvoteDisabled && isAuthenticated}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition ${
              issue.hasUpvoted
                ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                : canUpvote
                  ? "border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
                  : "border-slate-100 bg-slate-50 text-slate-400"
            } ${isUpvoting ? "opacity-60" : ""}`}
            title={
              issue.isOwnIssue
                ? "You cannot upvote your own issue"
                : issue.hasUpvoted
                  ? "You already upvoted this issue"
                  : !isAuthenticated
                    ? "Sign in to upvote"
                    : "Upvote this issue"
            }
          >
            <svg
              className={`h-4 w-4 ${issue.hasUpvoted ? "fill-current" : ""}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
            <span>{issue.upvoteCount ?? 0}</span>
          </button>

          <Link
            to={`/issue-details/${issue.id}`}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
