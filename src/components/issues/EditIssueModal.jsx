import { useEffect, useState } from "react";
import { ISSUE_CATEGORIES } from "@/config/constants";

export function EditIssueModal({ issue, isOpen, onClose, onSave, isSaving }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "pothole",
    priority: "medium",
    address: "",
    imageUrl: "",
    lng: "",
    lat: "",
  });

  useEffect(() => {
    if (issue && isOpen) {
      const coords = issue.location?.coordinates || [];
      setForm({
        title: issue.title || "",
        description: issue.description || "",
        category: issue.category || "pothole",
        priority: issue.priority || "medium",
        address: issue.address || "",
        imageUrl: issue.images?.[0] || "",
        lng: coords[0]?.toString() || "",
        lat: coords[1]?.toString() || "",
      });
    }
  }, [issue, isOpen]);

  if (!isOpen || !issue) return null;

  function updateField(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const lng = Number(form.lng);
    const lat = Number(form.lat);

    onSave({
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      priority: form.priority,
      address: form.address.trim() || null,
      images: form.imageUrl.trim() ? [form.imageUrl.trim()] : [],
      location: {
        coordinates: [lng, lat],
      },
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/50"
        onClick={onClose}
        aria-label="Close modal"
      />
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-bold text-slate-900">Edit issue report</h2>
        <p className="mt-1 text-sm text-slate-600">
          Only pending issues can be edited.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Title</label>
            <input
              required
              minLength={3}
              value={form.title}
              onChange={updateField("title")}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              required
              minLength={10}
              rows={4}
              value={form.description}
              onChange={updateField("description")}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Category
              </label>
              <select
                value={form.category}
                onChange={updateField("category")}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                {ISSUE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Priority
              </label>
              <select
                value={form.priority}
                onChange={updateField("priority")}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Image URL
            </label>
            <input
              type="url"
              value={form.imageUrl}
              onChange={updateField("imageUrl")}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Address</label>
            <input
              value={form.address}
              onChange={updateField("address")}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Longitude
              </label>
              <input
                required
                type="number"
                step="any"
                value={form.lng}
                onChange={updateField("lng")}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Latitude
              </label>
              <input
                required
                type="number"
                step="any"
                value={form.lat}
                onChange={updateField("lat")}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {isSaving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
