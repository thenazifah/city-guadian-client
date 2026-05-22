import { Link } from "react-router-dom";
import {
  getCategoryLabel,
  getIssueImage,
  getIssueLocationText,
  getStatusBadgeClass,
  getStatusLabel,
  formatIssueDate,
} from "@/utils/issueHelpers";

export function IssueCard({ issue }) {
  const imageUrl =   getIssueImage(issue);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative aspect-[16/10] bg-slate-100">
        {imageUrl ? (
          <img
            src={ imageUrl}
            alt={issue.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-emerald-100 to-teal-100 px-4 text-center">
            <span className="text-3xl" aria-hidden="true">
              🏙️
            </span>
            <p className="mt-2 text-xs font-medium text-emerald-800">
              {getCategoryLabel(issue.category)}
            </p>
          </div>
        )}
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusBadgeClass(issue.status)}`}
        >
          {getStatusLabel(issue.status)}
        </span>
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
        <p className="mt-3 text-xs text-slate-500">
          {getIssueLocationText(issue)}
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Resolved {formatIssueDate(issue.resolvedAt || issue.updatedAt)}
        </p>
        <Link
           to={`/issue-details/${issue.id}`}
          className="mt-4 inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
           View Details
        </Link>
      </div>
    </article>
  );
}
