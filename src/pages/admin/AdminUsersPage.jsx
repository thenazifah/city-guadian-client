import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { queryKeys } from "@/config/queryKeys";
import { ROLES } from "@/config/constants";
import { usersService } from "@/services/users.service";
import { notifyError, notifySuccess } from "@/utils/toast";

export function AdminUsersPage() {
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: queryKeys.users.all(),
    queryFn: () => usersService.listAll(),
  });

  const citizens = users.filter((u) => u.role === ROLES.CITIZEN);

  const statusMutation = useMutation({
    mutationFn: ({ userId, isActive }) =>
      usersService.updateCitizenStatus(userId, isActive),
    onSuccess: (_, { isActive }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all() });
      notifySuccess(isActive ? "User unblocked." : "User blocked.");
    },
    onError: (err) => notifyError(err.message || "Update failed"),
  });

  async function handleToggle(user) {
    const blocking = user.isActive !== false;
    const result = await Swal.fire({
      title: blocking ? "Block this citizen?" : "Unblock this citizen?",
      text: blocking
        ? "They will lose access to report and manage issues until unblocked."
        : "They will regain full citizen dashboard access.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: blocking ? "#dc2626" : "#059669",
      cancelButtonColor: "#64748b",
      confirmButtonText: blocking ? "Yes, block" : "Yes, unblock",
    });

    if (result.isConfirmed) {
      statusMutation.mutate({ userId: user.id, isActive: !blocking });
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Manage users</h1>
      <p className="mt-2 text-slate-600">
        View registered citizens and block or unblock accounts.
      </p>

      {isLoading && (
        <div className="mt-8 h-64 animate-pulse rounded-2xl bg-slate-100" />
      )}

      {!isLoading && (
        <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Citizen</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Joined</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {citizens.map((user) => {
                const isBlocked = user.isActive === false;
                return (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {user.displayName}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{user.email}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          isBlocked
                            ? "bg-red-100 text-red-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleToggle(user)}
                        disabled={statusMutation.isPending}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold disabled:opacity-50 ${
                          isBlocked
                            ? "bg-emerald-600 text-white hover:bg-emerald-700"
                            : "bg-red-600 text-white hover:bg-red-700"
                        }`}
                      >
                        {isBlocked ? "Unblock" : "Block"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {citizens.length === 0 && (
            <p className="p-8 text-center text-slate-500">No citizens found.</p>
          )}
        </div>
      )}
    </div>
  );
}
