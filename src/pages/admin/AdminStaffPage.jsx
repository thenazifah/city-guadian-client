import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { StaffFormModal } from "@/components/admin/StaffFormModal";
import { queryKeys } from "@/config/queryKeys";
import { ROLES } from "@/config/constants";
import { usersService } from "@/services/users.service";
import { notifyError, notifySuccess } from "@/utils/toast";

export function AdminStaffPage() {
  const queryClient = useQueryClient();
  const [modalMode, setModalMode] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);

  const { data: users = [], isLoading } = useQuery({
    queryKey: queryKeys.users.all(),
    queryFn: () => usersService.listAll(),
  });

  const staffMembers = users.filter((u) => u.role === ROLES.STAFF);

  const createMutation = useMutation({
    mutationFn: (payload) => usersService.createStaff(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all() });
      setModalMode(null);
      notifySuccess("Staff member created.");
    },
    onError: (err) => notifyError(err.message || "Could not create staff"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => usersService.updateStaff(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all() });
      setModalMode(null);
      setSelectedStaff(null);
      notifySuccess("Staff member updated.");
    },
    onError: (err) => notifyError(err.message || "Update failed"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => usersService.deleteStaff(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all() });
      notifySuccess("Staff member removed.");
    },
    onError: (err) => notifyError(err.message || "Delete failed"),
  });

  async function handleDelete(staff) {
    const result = await Swal.fire({
      title: "Remove this staff member?",
      text: "Their account will be deleted from City Guardian and Firebase (if applicable).",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete",
    });

    if (result.isConfirmed) {
      deleteMutation.mutate(staff.id);
    }
  }

  function openCreate() {
    setSelectedStaff(null);
    setModalMode("create");
  }

  function openEdit(staff) {
    setSelectedStaff(staff);
    setModalMode("edit");
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage staff</h1>
          <p className="mt-2 text-slate-600">
            Add, update, or remove staff who handle assigned issues.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Add staff
        </button>
      </div>

      {isLoading && (
        <div className="mt-8 h-64 animate-pulse rounded-2xl bg-slate-100" />
      )}

      {!isLoading && (
        <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Phone</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staffMembers.map((staff) => (
                <tr key={staff.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          staff.avatarUrl ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(staff.displayName)}&background=059669&color=fff`
                        }
                        alt=""
                        className="h-9 w-9 rounded-full object-cover"
                      />
                      <span className="font-medium text-slate-900">
                        {staff.displayName}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{staff.email}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {staff.phone || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => openEdit(staff)}
                        className="text-emerald-700 hover:underline"
                      >
                        Update
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(staff)}
                        disabled={deleteMutation.isPending}
                        className="text-red-600 hover:underline disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {staffMembers.length === 0 && (
            <p className="p-8 text-center text-slate-500">
              No staff members yet. Click &ldquo;Add staff&rdquo; to register one.
            </p>
          )}
        </div>
      )}

      <StaffFormModal
        mode={modalMode === "create" ? "create" : "edit"}
        staff={selectedStaff}
        isOpen={modalMode !== null}
        onClose={() => {
          setModalMode(null);
          setSelectedStaff(null);
        }}
        onSubmit={(payload) => {
          if (modalMode === "create") {
            createMutation.mutate(payload);
          } else {
            updateMutation.mutate({ id: selectedStaff.id, payload });
          }
        }}
        isSaving={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}
