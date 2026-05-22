import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { usersService } from "@/services/users.service";
import { notifyError, notifySuccess } from "@/utils/toast";

export function StaffProfilePage() {
  const { user, refreshUser } = useAuth();

  const [form, setForm] = useState({
    displayName: user?.displayName || "",
    avatarUrl: user?.avatarUrl || "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        displayName: user.displayName || "",
        avatarUrl: user.avatarUrl || "",
      });
    }
  }, [user]);

  const updateMutation = useMutation({
    mutationFn: (payload) => usersService.updateProfile(user.id, payload),
    onSuccess: async () => {
      await refreshUser();
      notifySuccess("Profile updated.");
    },
    onError: (err) => notifyError(err.message || "Update failed"),
  });

  function handleSubmit(event) {
    event.preventDefault();
    updateMutation.mutate({
      displayName: form.displayName.trim(),
      avatarUrl: form.avatarUrl.trim() || undefined,
    });
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Staff profile</h1>
      <p className="mt-2 text-slate-600">
        Update your name and profile image shown to citizens.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <img
              src={
                user?.avatarUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || "Staff")}&background=059669&color=fff`
              }
              alt={user?.displayName}
              className="h-20 w-20 rounded-full object-cover"
            />
            <div>
              <p className="text-lg font-semibold text-slate-900">
                {user?.displayName}
              </p>
              <p className="text-sm text-slate-600">{user?.email}</p>
              {user?.phone && (
                <p className="text-sm text-slate-600">{user.phone}</p>
              )}
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-slate-900">
            Edit profile
          </h2>

          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Display name
              </label>
              <input
                required
                minLength={2}
                value={form.displayName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, displayName: e.target.value }))
                }
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Profile image URL
              </label>
              <input
                type="url"
                value={form.avatarUrl}
                onChange={(e) =>
                  setForm((p) => ({ ...p, avatarUrl: e.target.value }))
                }
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="mt-6 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {updateMutation.isPending ? "Saving…" : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
