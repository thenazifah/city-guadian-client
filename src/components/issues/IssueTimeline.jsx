import {
  getRoleLabel,
  getStatusBadgeClass,
  getStatusLabel,
} from "@/utils/issueHelpers";

function formatDateTime(dateString) {
  return new Date(dateString).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function IssueTimeline({ entries }) {
  if (!entries?.length) {
    return (
      <p className="text-sm text-slate-500">No timeline updates recorded yet.</p>
    );
  }

  return (
    <ol className="relative space-y-0">
      {entries.map((entry, index) => (
        <li key={entry.id} className="relative flex gap-4 pb-8 last:pb-0">
          {index < entries.length - 1 && (
            <span
              className="absolute left-[11px] top-6 h-full w-0.5 bg-slate-200"
              aria-hidden="true"
            />
          )}

          <span
            className="relative z-10 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 ring-4 ring-white"
            aria-hidden="true"
          >
            <span className="h-2 w-2 rounded-full bg-white" />
          </span>

          <div className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusBadgeClass(entry.toStatus)}`}
              >
                {getStatusLabel(entry.toStatus)}
              </span>
              {entry.fromStatus && entry.fromStatus !== entry.toStatus && (
                <span className="text-xs text-slate-400">
                  from {getStatusLabel(entry.fromStatus)}
                </span>
              )}
            </div>

            <p className="mt-2 text-sm font-medium text-slate-900">
              {entry.message}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Updated by{" "}
              <span className="font-medium text-slate-700">
                {entry.changedByName}
              </span>{" "}
              ({getRoleLabel(entry.changedByRole)})
            </p>

            <p className="mt-1 text-xs text-slate-400">
              {formatDateTime(entry.createdAt)}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
