import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerWithEmail } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { notifyError, notifySuccess } from "@/utils/toast";
import { ROLE_HOME_ROUTES } from "@/config/constants";
import { env } from "@/config/env";

export function RegisterPage() {
  const navigate = useNavigate();
  const { loginWithIdToken } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    photoURL: "",
  });
  const [submitting, setSubmitting] = useState(false);

  function updateField(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!env.isFirebaseConfigured()) {
      notifyError("Firebase is not configured. Check your .env file.");
      return;
    }

    if (form.password.length < 6) {
      notifyError("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    try {
      const idToken = await registerWithEmail({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        photoURL: form.photoURL.trim() || null,
      });

      const user = await loginWithIdToken(idToken);
      notifySuccess(`Account created. Welcome, ${user.displayName}!`);
      navigate(ROLE_HOME_ROUTES[user.role] || "/", { replace: true });
    } catch (err) {
      notifyError(err.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto flex max-w-md flex-col px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">Create an account</h1>
      <p className="mt-1 text-sm text-slate-600">
        Join City Guardian to report infrastructure problems in your community.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700">
            Full name
          </label>
          <input
            id="name"
            type="text"
            required
            minLength={2}
            value={form.name}
            onChange={updateField("name")}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={updateField("email")}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            value={form.password}
            onChange={updateField("password")}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          />
        </div>
        <div>
          <label htmlFor="photoURL" className="block text-sm font-medium text-slate-700">
            Profile photo URL (optional)
          </label>
          <input
            id="photoURL"
            type="url"
            placeholder="https://example.com/photo.jpg"
            value={form.photoURL}
            onChange={updateField("photoURL")}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {submitting ? "Creating account…" : "Register"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-emerald-700 hover:underline">
          Sign in
        </Link>
      </p>
    </section>
  );
}
