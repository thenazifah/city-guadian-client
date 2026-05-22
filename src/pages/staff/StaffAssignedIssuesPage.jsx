import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { StaffStatusSelect } from "@/components/dashboard/StaffStatusSelect";
import { queryKeys } from "@/config/queryKeys";
import { issuesService } from "@/services/issues.service";
import {
  getCategoryLabel,
  getIssueLocationText,
  getPriorityBadgeClass,
  getPriorityLabel,
  getStatusBadgeClass,
  getStatusLabel,
  sortIssuesForFeed,
} from "@/utils/issueHelpers";
import { notifyError, notifySuccess } from "@/utils/toast";

export function StaffAssignedIssuesPage() {
  const queryClient = useQueryClient();

  const { data: issues = [], isLoading, isError, error } = useQuery({
    queryKey: queryKeys.issues.staffAssigned(),
    queryFn: () => issuesService.listStaffAssigned(),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) =>
      issuesService.updateByStaff(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.issues.staffAssigned(),
      });
      queryClient.invalidateQueries({ queryKey: ["issues", "public"] });
      notifySuccess("Status updated. Timeline entry recorded.");
    },
    onError: (err) => notifyError(err.message || "Status update failed"),
  });

  const sorted = sortIssuesForFeed(issues);

  function handleAdvance(issue, nextStatus) {
    statusMutation.mutate({ id: issue.id, status: nextStatus });
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Assigned issues</h1>
      <p className="mt-2 text-slate-600">
        High-priority issues appear first. Advance status one step at a time:
        Pending → In progress → Working → Resolved → Closed.
      </p>

      {isLoading && (
        <div className="mt-8 h-64 animate-pulse rounded-2xl bg-slate-100" />
      )}

      {isError && (
        <p className="mt-6 text-red-600">{error?.message || "Failed to load"}</p>
      )}

      {!isLoading && !isError && sorted.length === 0 && (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-600">
          No issues are assigned to you yet.
        </div>
      )}

      {!isLoading && sorted.length > 0 && (
        <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Issue</th>
                <th className="px-4 py-3 font-semibold">Location</th>
                <th className="px-4 py-3 font-semibold">Priority</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sorted.map((issue) => (
                <tr
                  key={issue.id}
                  className={`hover:bg-slate-50 ${
                    issue.priority === "high" ? "bg-orange-50/40" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">{issue.title}</p>
                    <p className="text-xs text-slate-500">
                      {getCategoryLabel(issue.category)}
                    </p>
                  </td>
                  <td className="max-w-[200px] truncate px-4 py-3 text-slate-600">
                    {getIssueLocationText(issue)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${getPriorityBadgeClass(issue.priority)}`}
                    >
                      {getPriorityLabel(issue.priority)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusBadgeClass(issue.status)}`}
                    >
                      {getStatusLabel(issue.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-2">
                      <StaffStatusSelect
                        issue={issue}
                        onAdvance={handleAdvance}
                        isUpdating={statusMutation.isPending}
                      />
                      <Link
                        to={`/issue-details/${issue.id}`}
                        className="text-xs text-emerald-700 hover:underline"
                      >
                        View details
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
