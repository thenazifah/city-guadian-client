import { useState } from "react";

export function AssignStaffModal({
  issue,
  staffMembers,
  isOpen,
  onClose,
  onAssign,
  isAssigning,
}) {
  const [staffId, setStaffId] = useState("");

  if (!isOpen || !issue) return null;

  function handleSubmit(event) {
    event.preventDefault();
    if (!staffId) return;
    onAssign({ issueId: issue.id, staffId });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/50"
        onClick={onClose}
        aria-label="Close modal"
      />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-bold text-slate-900">Assign staff</h2>
        <p className="mt-1 text-sm text-slate-600">
          Assign a staff member to &ldquo;{issue.title}&rdquo;. This cannot be
          changed from this screen after assignment.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Staff member
            </label>
            <select
              required
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="">Select staff…</option>
              {staffMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.displayName} ({member.email})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isAssigning || !staffId}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {isAssigning ? "Assigning…" : "Confirm assignment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
