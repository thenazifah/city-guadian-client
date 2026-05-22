import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { EditIssueModal } from "@/components/issues/EditIssueModal";
import { IssueTimeline } from "@/components/issues/IssueTimeline";
import { queryKeys } from "@/config/queryKeys";
import { useAuth } from "@/hooks/useAuth";
import { issuesService } from "@/services/issues.service";
import {
  getCategoryLabel,
  getIssueImage,
  getIssueLocationText,
  getPriorityBadgeClass,
  getPriorityLabel,
  getStatusBadgeClass,
  getStatusLabel,
  isPendingStatus,
} from "@/utils/issueHelpers";
import { notifyError, notifySuccess } from "@/utils/toast";

export function IssueDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();
  const [editOpen, setEditOpen] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: queryKeys.issues.detail(id),
    queryFn: () => issuesService.getPublicDetails(id),
    enabled: Boolean(id),
  });

  const updateMutation = useMutation({
    mutationFn: (payload) => issuesService.updateByCitizen(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.issues.detail(id) });
      queryClient.invalidateQueries({ queryKey: ["issues", "public"] });
      setEditOpen(false);
      notifySuccess("Issue updated successfully.");
    },
    onError: (err) => notifyError(err.message || "Update failed"),
  });

  const deleteMutation = useMutation({
    mutationFn: () => issuesService.deleteIssue(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues", "public"] });
      notifySuccess("Issue deleted.");
      navigate("/all-issues", { replace: true });
    },
    onError: (err) => notifyError(err.message || "Delete failed"),
  });

  const issue = data?.issue;
  const assignee = data?.assignee;
  const timeline = data?.timeline ?? [];

  const canEdit =
    isAuthenticated &&
    user &&
    issue?.isOwnIssue &&
    isPendingStatus(issue?.status);

  const canDelete = canEdit;

  async function handleDelete() {
    const result = await Swal.fire({
      title: "Delete this issue?",
      text: "This pending report will be removed. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it",
    });

    if (result.isConfirmed) {
      deleteMutation.mutate();
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="h-96 animate-pulse rounded-2xl bg-slate-100" />
      </div>
    );
  }

  if (isError || !issue) {
    return (
      <section className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
        <h1 className="text-xl font-bold text-slate-900">Issue not found</h1>
        <p className="mt-2 text-slate-600">{error?.message}</p>
        <Link
          to="/all-issues"
          className="mt-6 inline-flex rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white"
        >
          Back to all issues
        </Link>
      </section>
    );
  }

  const imageUrl = getIssueImage(issue);

  return (
    <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
      <Link
        to="/all-issues"
        className="text-sm font-medium text-emerald-700 hover:underline"
      >
        ← Back to all issues
      </Link>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={issue.title}
            className="aspect-[21/9] w-full object-cover"
          />
        ) : (
          <div className="flex aspect-[21/9] items-center justify-center bg-gradient-to-br from-slate-100 to-emerald-50 text-4xl">
            🏙️
          </div>
        )}

        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeClass(issue.status)}`}
                >
                  {getStatusLabel(issue.status)}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${getPriorityBadgeClass(issue.priority)}`}
                >
                  {getPriorityLabel(issue.priority)} priority
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  {getCategoryLabel(issue.category)}
                </span>
              </div>
              <h1 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">
                {issue.title}
              </h1>
            </div>

            {(canEdit || canDelete) && (
              <div className="flex flex-wrap gap-2">
                {canEdit && (
                  <button
                    type="button"
                    onClick={() => setEditOpen(true)}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Edit
                  </button>
                )}
                {canDelete && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleteMutation.isPending}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
                  >
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>

          <p className="mt-6 whitespace-pre-wrap text-slate-700 leading-relaxed">
            {issue.description}
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase text-slate-500">
                Location
              </p>
              <p className="mt-1 text-sm text-slate-800">
                {getIssueLocationText(issue)}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase text-slate-500">
                Community support
              </p>
              <p className="mt-1 text-sm text-slate-800">
                {issue.upvoteCount ?? 0} upvote
                {(issue.upvoteCount ?? 0) === 1 ? "" : "s"}
              </p>
            </div>
          </div>

          {assignee && (
            <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
                Assigned staff
              </p>
              <div className="mt-3 flex items-center gap-4">
                <img
                  src={
                    assignee.avatarUrl ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(assignee.displayName)}&background=059669&color=fff`
                  }
                  alt={assignee.displayName}
                  className="h-14 w-14 rounded-full object-cover ring-2 ring-white"
                />
                <div>
                  <p className="font-semibold text-slate-900">
                    {assignee.displayName}
                  </p>
                  <p className="text-sm text-slate-600">{assignee.email}</p>
                  {assignee.phone && (
                    <p className="text-sm text-slate-600">{assignee.phone}</p>
                  )}
                  <p className="mt-1 text-xs capitalize text-emerald-700">
                    {assignee.role}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <h2 className="text-xl font-bold text-slate-900">Activity timeline</h2>
        <p className="mt-1 text-sm text-slate-600">
          Latest updates appear first — track how this report moved through the
          system.
        </p>
        <div className="mt-8">
          <IssueTimeline entries={timeline} />
        </div>
      </div>

      <EditIssueModal
        issue={issue}
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        onSave={(payload) => updateMutation.mutate(payload)}
        isSaving={updateMutation.isPending}
      />
    </section>
  );
}
