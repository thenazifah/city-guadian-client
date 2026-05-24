import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { StatCard } from "@/components/dashboard/StatCard";
import { SimpleBarChart } from "@/components/dashboard/SimpleBarChart";
import { BlockedAccountBanner } from "@/components/dashboard/BlockedAccountBanner";
import { queryKeys } from "@/config/queryKeys";
import { MAX_CITIZEN_ISSUES } from "@/config/constants";
import { useAuth } from "@/hooks/useAuth";
import { issuesService } from "@/services/issues.service";
import {
  buildStatusChartData,
  computeCitizenStats,
} from "@/utils/dashboardStats";

export function CitizenOverviewPage() {
  const { user } = useAuth();
  const isBlocked = user?.isActive === false;

  const { data: issues = [], isLoading } = useQuery({
    queryKey: queryKeys.issues.myList(),
    queryFn: () => issuesService.listMine(),
  });

  const stats = computeCitizenStats(issues);
  const chartData = buildStatusChartData(stats);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
        Dashboard overview
      </h1>
      <p className="mt-2 text-slate-600">
        Track your infrastructure reports and community impact.
      </p>

      {isBlocked && <div className="mt-6"><BlockedAccountBanner /></div>}

      {isLoading ? (
        <div className="mt-8 h-48 animate-pulse rounded-2xl bg-slate-100" />
      ) : (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <StatCard label="Total submitted" value={stats.total} />
            <StatCard label="Pending" value={stats.pending} accent="amber" />
            <StatCard
              label="In progress"
              value={stats.inProgress}
              accent="blue"
            />
            <StatCard label="Resolved" value={stats.resolved} />
            
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

            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
              <h2 className="text-lg font-semibold text-emerald-900">
                Report limit
              </h2>
              <p className="mt-2 text-sm text-emerald-800">
                Free accounts can submit up to {MAX_CITIZEN_ISSUES} issues. You
                have used {stats.total} of {MAX_CITIZEN_ISSUES}.
              </p>
              {!isBlocked && stats.total < MAX_CITIZEN_ISSUES && (
                <Link
                  to="/citizen/report"
                  className="mt-4 inline-flex rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Report new issue
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
