import { getNextStaffStatus, getStatusLabel } from "@/utils/issueHelpers";

export function StaffStatusSelect({ issue, onAdvance, isUpdating }) {
  const nextStatus = getNextStaffStatus(issue.status);

  if (!nextStatus) {
    return (
      <span className="text-xs text-slate-500">Final status reached</span>
    );
  }

  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
      <label className="sr-only" htmlFor={`status-${issue.id}`}>
        Change status for {issue.title}
      </label>
      <select
        id={`status-${issue.id}`}
        defaultValue=""
        disabled={isUpdating}
        onChange={(e) => {
          if (e.target.value === nextStatus) {
            onAdvance(issue, nextStatus);
          }
          e.target.value = "";
        }}
        className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm disabled:opacity-60"
      >
        <option value="">Change status…</option>
        <option value={nextStatus}>
          Advance to {getStatusLabel(nextStatus)}
        </option>
      </select>
    </div>
  );
}
