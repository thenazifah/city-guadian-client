import { useEffect, useState } from "react";

const emptyForm = {
  displayName: "",
  email: "",
  phone: "",
  avatarUrl: "",
  password: "",
};

export function StaffFormModal({
  mode,
  staff,
  isOpen,
  onClose,
  onSubmit,
  isSaving,
}) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && staff) {
        setForm({
          displayName: staff.displayName || "",
          email: staff.email || "",
          phone: staff.phone || "",
          avatarUrl: staff.avatarUrl || "",
          password: "",
        });
      } else {
        setForm(emptyForm);
      }
    }
  }, [isOpen, mode, staff]);

  if (!isOpen) return null;

  function updateField(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (mode === "create") {
      onSubmit({
        displayName: form.displayName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        avatarUrl: form.avatarUrl.trim() || undefined,
        password: form.password,
      });
    } else {
      onSubmit({
        displayName: form.displayName.trim(),
        phone: form.phone.trim() || undefined,
        avatarUrl: form.avatarUrl.trim() || undefined,
      });
    }
  }

  const title = mode === "create" ? "Add staff member" : "Update staff member";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/50"
        onClick={onClose}
        aria-label="Close modal"
      />
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Name
            </label>
            <input
              required
              minLength={2}
              value={form.displayName}
              onChange={updateField("displayName")}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>

          {mode === "create" && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={updateField("email")}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <input
                  required
                  minLength={6}
                  type="password"
                  value={form.password}
                  onChange={updateField("password")}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Phone
            </label>
            <input
              value={form.phone}
              onChange={updateField("phone")}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Photo URL
            </label>
            <input
              type="url"
              value={form.avatarUrl}
              onChange={updateField("avatarUrl")}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {isSaving ? "Saving…" : mode === "create" ? "Add staff" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
