import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BlockedAccountBanner } from "@/components/dashboard/BlockedAccountBanner";
import { ISSUE_CATEGORIES, MAX_CITIZEN_ISSUES } from "@/config/constants";
import { queryKeys } from "@/config/queryKeys";
import { useAuth } from "@/hooks/useAuth";
import { issuesService } from "@/services/issues.service";
import { notifyError, notifySuccess } from "@/utils/toast";

const initialForm = {
  title: "",
  description: "",
  category: "pothole",
  imageUrl: "",
  address: "",
  lng: "",
  lat: "",
};

export function CitizenReportIssuePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(initialForm);
  const isBlocked = user?.isActive === false;

  const { data: issues = [] } = useQuery({
    queryKey: queryKeys.issues.myList(),
    queryFn: () => issuesService.listMine(),
  });

  const atLimit = issues.length >= MAX_CITIZEN_ISSUES;
  const canSubmit = !isBlocked && !atLimit;

  const createMutation = useMutation({
    mutationFn: (payload) => issuesService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.issues.myList() });
      queryClient.invalidateQueries({ queryKey: ["issues", "public"] });
      notifySuccess("Issue reported successfully.");
      navigate("/citizen/issues");
    },
    onError: (err) => notifyError(err.message || "Could not submit report"),
  });

  function updateField(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!canSubmit) return;

    const lng = Number(form.lng);
    const lat = Number(form.lat);

    createMutation.mutate({
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      address: form.address.trim() || null,
      images: form.imageUrl.trim() ? [form.imageUrl.trim()] : [],
      location: { coordinates: [lng, lat] },
    });
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Report an issue</h1>
      <p className="mt-2 text-slate-600">
        Tell us about infrastructure problems in your neighborhood.
      </p>

      {isBlocked && (
        <div className="mt-6">
          <BlockedAccountBanner />
        </div>
      )}

      {atLimit && !isBlocked && (
        <div className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 p-5">
          <p className="font-semibold text-amber-900">Report limit reached</p>
          <p className="mt-1 text-sm text-amber-800">
            Free accounts can submit up to {MAX_CITIZEN_ISSUES} issues. Visit your{" "}
            <Link to="/citizen/profile" className="font-semibold underline">
              profile
            </Link>{" "}
            for account details or contact support.
          </p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-8 max-w-2xl space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
      >
        <div>
          <label className="block text-sm font-medium text-slate-700">Title</label>
          <input
            required
            minLength={3}
            disabled={!canSubmit}
            value={form.title}
            onChange={updateField("title")}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-100"
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
            disabled={!canSubmit}
            value={form.description}
            onChange={updateField("description")}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Category
          </label>
          <select
            disabled={!canSubmit}
            value={form.category}
            onChange={updateField("category")}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-100"
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
            Image URL
          </label>
          <input
            type="url"
            disabled={!canSubmit}
            value={form.imageUrl}
            onChange={updateField("imageUrl")}
            placeholder="https://example.com/photo.jpg"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Location address
          </label>
          <input
            disabled={!canSubmit}
            value={form.address}
            onChange={updateField("address")}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-100"
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
              disabled={!canSubmit}
              value={form.lng}
              onChange={updateField("lng")}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-100"
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
              disabled={!canSubmit}
              value={form.lat}
              onChange={updateField("lat")}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-100"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!canSubmit || createMutation.isPending}
          className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {createMutation.isPending ? "Submitting…" : "Submit report"}
        </button>
      </form>
    </div>
  );
}
