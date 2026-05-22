import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { EditIssueModal } from "@/components/issues/EditIssueModal";
import { BlockedAccountBanner } from "@/components/dashboard/BlockedAccountBanner";
import { queryKeys } from "@/config/queryKeys";
import { useAuth } from "@/hooks/useAuth";
import { issuesService } from "@/services/issues.service";
import {
  getCategoryLabel,
  getStatusBadgeClass,
  getStatusLabel,
  isPendingStatus,
} from "@/utils/issueHelpers";
import { notifyError, notifySuccess } from "@/utils/toast";

export function CitizenMyIssuesPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [editingIssue, setEditingIssue] = useState(null);
  const isBlocked = user?.isActive === false;

  const { data: issues = [], isLoading, isError, error } = useQuery({
    queryKey: queryKeys.issues.myList(),
    queryFn: () => issuesService.listMine(),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => issuesService.updateByCitizen(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.issues.myList() });
      queryClient.invalidateQueries({ queryKey: ["issues", "public"] });
      setEditingIssue(null);
      notifySuccess("Issue updated.");
    },
    onError: (err) => notifyError(err.message || "Update failed"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => issuesService.deleteIssue(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.issues.myList() });
      queryClient.invalidateQueries({ queryKey: ["issues", "public"] });
      notifySuccess("Issue deleted.");
    },
    onError: (err) => notifyError(err.message || "Delete failed"),
  });

  async function handleDelete(issue) {
    const result = await Swal.fire({
      title: "Delete this issue?",
      text: "This pending report will be removed permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it",
    });

    if (result.isConfirmed) {
      deleteMutation.mutate(issue.id);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">My issues</h1>
      <p className="mt-2 text-slate-600">
        Manage reports you have submitted to City Guardian.
      </p>

      {isBlocked && (
        <div className="mt-6">
          <BlockedAccountBanner />
        </div>
      )}

      {isLoading && (
        <div className="mt-8 h-64 animate-pulse rounded-2xl bg-slate-100" />
      )}

      {isError && (
        <p className="mt-6 text-red-600">{error?.message || "Failed to load"}</p>
      )}

      {!isLoading && !isError && issues.length === 0 && (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 p-10 text-center">
          <p className="text-slate-600">You have not reported any issues yet.</p>
          {!isBlocked && (
            <Link
              to="/citizen/report"
              className="mt-4 inline-flex rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Report your first issue
            </Link>
          )}
        </div>
      )}

      {!isLoading && issues.length > 0 && (
        <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {issues.map((issue) => {
                const canModify =
                  !isBlocked && isPendingStatus(issue.status);

                return (
                  <tr key={issue.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {issue.title}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {getCategoryLabel(issue.category)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusBadgeClass(issue.status)}`}
                      >
                        {getStatusLabel(issue.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          to={`/issue-details/${issue.id}`}
                          className="text-emerald-700 hover:underline"
                        >
                          View
                        </Link>
                        {canModify && (
                          <>
                            <button
                              type="button"
                              onClick={() => setEditingIssue(issue)}
                              className="text-slate-700 hover:underline"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(issue)}
                              disabled={deleteMutation.isPending}
                              className="text-red-600 hover:underline disabled:opacity-50"
                            >
                              Delete
                            </button>
                          </>
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

      <EditIssueModal
        issue={editingIssue}
        isOpen={Boolean(editingIssue)}
        onClose={() => setEditingIssue(null)}
        onSave={(payload) =>
          updateMutation.mutate({ id: editingIssue.id, payload })
        }
        isSaving={updateMutation.isPending}
      />
    </div>
  );
}
