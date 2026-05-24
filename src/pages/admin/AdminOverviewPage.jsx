import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { StatCard } from "@/components/dashboard/StatCard";
import { SimpleBarChart } from "@/components/dashboard/SimpleBarChart";
import { queryKeys } from "@/config/queryKeys";
import { ROLES } from "@/config/constants";
import { issuesService } from "@/services/issues.service";
import { usersService } from "@/services/users.service";
import {
  buildAdminIssueChartData,
  computeAdminStats,
} from "@/utils/dashboardStats";
import {
  getCategoryLabel,
  getStatusBadgeClass,
  getStatusLabel,
  sortIssuesForFeed,
} from "@/utils/issueHelpers";

export function AdminOverviewPage() {
  const issuesQuery = useQuery({
    queryKey: queryKeys.issues.adminAll(),
    queryFn: () => issuesService.listAll(),
  });

  const usersQuery = useQuery({
    queryKey: queryKeys.users.all(),
    queryFn: () => usersService.listAll(),
  });

  const isLoading = issuesQuery.isLoading || usersQuery.isLoading;
  const issues = issuesQuery.data ?? [];
  const users = usersQuery.data ?? [];
  const stats = computeAdminStats(issues, users);
  const chartData = buildAdminIssueChartData(stats);
  const latestIssues = sortIssuesForFeed(issues).slice(0, 5);
  const recentUsers = [...users]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
        Admin overview
      </h1>
      <p className="mt-2 text-slate-600">
        System-wide metrics, latest activity, and registration trends.
      </p>

      {isLoading ? (
        <div className="mt-8 h-48 animate-pulse rounded-2xl bg-slate-100" />
      ) : (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <StatCard label="Total issues" value={stats.totalIssues} />
            <StatCard label="Pending" value={stats.pending} accent="amber" />
            <StatCard label="Resolved" value={stats.resolved} />
            <StatCard label="Rejected" value={stats.rejected} accent="slate" />
            
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">
                Issues by status
              </h2>
              <div className="mt-6">
                <SimpleBarChart data={chartData} />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">
                Community
              </h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Citizens</dt>
                  <dd className="font-semibold text-slate-900">{stats.citizens}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Staff</dt>
                  <dd className="font-semibold text-slate-900">{stats.staff}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">
                  Latest issues
                </h2>
                <Link
                  to="/admin/issues"
                  className="text-sm font-medium text-emerald-700 hover:underline"
                >
                  Manage →
                </Link>
              </div>
              <ul className="mt-4 divide-y divide-slate-100">
                {latestIssues.map((issue) => (
                  <li key={issue.id} className="py-3">
                    <p className="font-medium text-slate-900">{issue.title}</p>
                    <div className="mt-1 flex flex-wrap gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${getStatusBadgeClass(issue.status)}`}
                      >
                        {getStatusLabel(issue.status)}
                      </span>
                      <span className="text-xs text-slate-500">
                        {getCategoryLabel(issue.category)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">
                  Recently registered
                </h2>
                <Link
                  to="/admin/users"
                  className="text-sm font-medium text-emerald-700 hover:underline"
                >
                  View users →
                </Link>
              </div>
              <ul className="mt-4 divide-y divide-slate-100">
                {recentUsers.map((u) => (
                  <li key={u.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-slate-900">
                        {u.displayName}
                      </p>
                      <p className="text-xs text-slate-500">{u.email}</p>
                    </div>
                    <span className="text-xs capitalize text-slate-600">
                      {u.role === ROLES.CITIZEN ? "Citizen" : u.role}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
