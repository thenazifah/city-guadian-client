import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { BlockedAccountBanner } from "@/components/dashboard/BlockedAccountBanner";
import { useAuth } from "@/hooks/useAuth";
import { usersService } from "@/services/users.service";
import { notifyError, notifySuccess } from "@/utils/toast";

export function CitizenProfilePage() {
  const { user, refreshUser } = useAuth();
  const isBlocked = user?.isActive === false;

  const [form, setForm] = useState({
    displayName: user?.displayName || "",
    phone: user?.phone || "",
    avatarUrl: user?.avatarUrl || "",
  });

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
    if (isBlocked) return;

    updateMutation.mutate({
      displayName: form.displayName.trim(),
      phone: form.phone.trim() || undefined,
      avatarUrl: form.avatarUrl.trim() || undefined,
    });
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
      <p className="mt-2 text-slate-600">Your City Guardian account details.</p>

      {isBlocked && (
        <div className="mt-6">
          <BlockedAccountBanner />
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <img
              src={
                user?.avatarUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || "User")}&background=059669&color=fff`
              }
              alt={user?.displayName}
              className="h-20 w-20 rounded-full object-cover ring-2 ring-emerald-100"
            />
            <div>
              <p className="text-lg font-semibold text-slate-900">
                {user?.displayName}
              </p>
              <p className="text-sm text-slate-600">{user?.email}</p>
              <p className="mt-1 text-xs capitalize text-emerald-700">
                {user?.role}
              </p>
            </div>
          </div>

          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <dt className="text-slate-500">Account status</dt>
              <dd
                className={
                  isBlocked ? "font-medium text-red-600" : "font-medium text-emerald-700"
                }
              >
                {isBlocked ? "Disabled" : "Active"}
              </dd>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <dt className="text-slate-500">Member since</dt>
              <dd className="text-slate-800">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "—"}
              </dd>
            </div>
          </dl>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-slate-900">
            Update information
          </h2>

          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Display name
              </label>
              <input
                required
                minLength={2}
                disabled={isBlocked}
                value={form.displayName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, displayName: e.target.value }))
                }
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Phone
              </label>
              <input
                disabled={isBlocked}
                value={form.phone}
                onChange={(e) =>
                  setForm((p) => ({ ...p, phone: e.target.value }))
                }
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Profile image URL
              </label>
              <input
                type="url"
                disabled={isBlocked}
                value={form.avatarUrl}
                onChange={(e) =>
                  setForm((p) => ({ ...p, avatarUrl: e.target.value }))
                }
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-100"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isBlocked || updateMutation.isPending}
            className="mt-6 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {updateMutation.isPending ? "Saving…" : "Save profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
