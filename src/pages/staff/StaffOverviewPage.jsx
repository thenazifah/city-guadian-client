import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { StatCard } from "@/components/dashboard/StatCard";
import { queryKeys } from "@/config/queryKeys";
import { issuesService } from "@/services/issues.service";
import { sortIssuesForFeed } from "@/utils/issueHelpers";
import { computeStaffStats } from "@/utils/dashboardStats";
import { ISSUE_STATUS } from "@/config/constants";
import {
  getCategoryLabel,
  getPriorityBadgeClass,
  getPriorityLabel,
  getStatusBadgeClass,
  getStatusLabel,
} from "@/utils/issueHelpers";

export function StaffOverviewPage() {
  const { data: issues = [], isLoading } = useQuery({
    queryKey: queryKeys.issues.staffAssigned(),
    queryFn: () => issuesService.listStaffAssigned(),
  });

  const sorted = sortIssuesForFeed(issues);
  const stats = computeStaffStats(sorted);
  const activeTasks = sorted
    .filter(
      (i) =>
        i.status !== ISSUE_STATUS.RESOLVED && i.status !== ISSUE_STATUS.CLOSED
    )
    .slice(0, 5);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
        Staff overview
      </h1>
      <p className="mt-2 text-slate-600">
        Your assigned infrastructure tasks and progress at a glance.
      </p>

      {isLoading ? (
        <div className="mt-8 h-48 animate-pulse rounded-2xl bg-slate-100" />
      ) : (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <StatCard label="Assigned issues" value={stats.assigned} />
            <StatCard
              label="Resolved / closed"
              value={stats.resolved}
              accent="emerald"
            />
            <StatCard
              label="Active tasks"
              value={stats.active}
              accent="blue"
            />
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-slate-900">
                Task overview
              </h2>
              <Link
                to="/staff/issues"
                className="text-sm font-medium text-emerald-700 hover:underline"
              >
                View all →
              </Link>
            </div>

            {activeTasks.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">
                No active assignments. Check back when an admin assigns you
                issues.
              </p>
            ) : (
              <ul className="mt-4 divide-y divide-slate-100">
                {activeTasks.map((issue) => (
                  <li
                    key={issue.id}
                    className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-medium text-slate-900">{issue.title}</p>
                      <p className="text-xs text-slate-500">
                        {getCategoryLabel(issue.category)}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${getStatusBadgeClass(issue.status)}`}
                      >
                        {getStatusLabel(issue.status)}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${getPriorityBadgeClass(issue.priority)}`}
                      >
                        {getPriorityLabel(issue.priority)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
