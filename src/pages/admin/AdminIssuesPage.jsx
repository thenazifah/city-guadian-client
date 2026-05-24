import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { AssignStaffModal } from "@/components/admin/AssignStaffModal";
import { queryKeys } from "@/config/queryKeys";
import { ISSUE_STATUS, ROLES } from "@/config/constants";
import { issuesService } from "@/services/issues.service";
import { usersService } from "@/services/users.service";
import {
  getCategoryLabel,
  getPriorityBadgeClass,
  getPriorityLabel,
  getStatusBadgeClass,
  getStatusLabel,
  isPendingStatus,
  sortIssuesForFeed,
} from "@/utils/issueHelpers";
import { notifyError, notifySuccess } from "@/utils/toast";

export function AdminIssuesPage() {
  const queryClient = useQueryClient();
  const [assignIssue, setAssignIssue] = useState(null);

  const { data: issues = [], isLoading } = useQuery({
    queryKey: queryKeys.issues.adminAll(),
    queryFn: () => issuesService.listAll(),
  });

  const { data: users = [] } = useQuery({
    queryKey: queryKeys.users.all(),
    queryFn: () => usersService.listAll(),
  });

  const staffMembers = users.filter(
    (u) =>
      (u.role === ROLES.STAFF || u.role === ROLES.ADMIN) && u.isActive !== false
  );

  const assignMutation = useMutation({
    mutationFn: ({ issueId, staffId }) =>
      issuesService.updateByAdmin(issueId, { assignedTo: staffId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.issues.adminAll() });
      queryClient.invalidateQueries({ queryKey: ["issues", "public"] });
      setAssignIssue(null);
      notifySuccess("Staff assigned. Timeline updated.");
    },
    onError: (err) => notifyError(err.message || "Assignment failed"),
  });

  const rejectMutation = useMutation({
    mutationFn: (issueId) =>
      issuesService.updateByAdmin(issueId, { status: ISSUE_STATUS.REJECTED }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.issues.adminAll() });
      queryClient.invalidateQueries({ queryKey: ["issues", "public"] });
      notifySuccess("Issue rejected.");
    },
    onError: (err) => notifyError(err.message || "Reject failed"),
  });

  async function handleReject(issue) {
    const result = await Swal.fire({
      title: "Reject this issue?",
      text: "The report will be marked as rejected and removed from the active queue.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, reject it",
    });

    if (result.isConfirmed) {
      rejectMutation.mutate(issue.id);
    }
  }

  const sorted = sortIssuesForFeed(issues);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">All issues</h1>
      <p className="mt-2 text-slate-600">
        High-priority issues stay at the top. Assign staff or reject pending
        reports.
      </p>

      {isLoading && (
        <div className="mt-8 h-64 animate-pulse rounded-2xl bg-slate-100" />
      )}

      {!isLoading && (
        <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Issue</th>
                <th className="px-4 py-3 font-semibold">Priority</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Assigned</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sorted.map((issue) => {
                const assignee = staffMembers.find(
                  (s) => s.id === issue.assignedTo
                );
                const canAssign = !issue.assignedTo;
                const canReject = isPendingStatus(issue.status);

                return (
                  <tr
                    key={issue.id}
                    className={`hover:bg-slate-50 ${
                      issue.priority === "high" ? "bg-orange-50/40" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">
                        {issue.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {getCategoryLabel(issue.category)}
                      </p>
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
                    <td className="px-4 py-3 text-slate-600">
                      {assignee ? assignee.displayName : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          to={`/issue-details/${issue.id}`}
                          className="text-emerald-700 hover:underline"
                        >
                          View
                        </Link>
                        {canAssign && (
                          <button
                            type="button"
                            onClick={() => setAssignIssue(issue)}
                            className="text-blue-700 hover:underline"
                          >
                            Assign staff
                          </button>
                        )}
                        {canReject && (
                          <button
                            type="button"
                            onClick={() => handleReject(issue)}
                            disabled={rejectMutation.isPending}
                            className="text-red-600 hover:underline disabled:opacity-50"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <AssignStaffModal
        issue={assignIssue}
        staffMembers={staffMembers}
        isOpen={Boolean(assignIssue)}
        onClose={() => setAssignIssue(null)}
        onAssign={({ issueId, staffId }) =>
          assignMutation.mutate({ issueId, staffId })
        }
        isAssigning={assignMutation.isPending}
      />
    </div>
  );
}
