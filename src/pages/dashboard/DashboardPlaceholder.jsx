import { useAuth } from "@/hooks/useAuth";

export function DashboardPlaceholder({ title }) {
  const { user } = useAuth();

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      <p className="mt-2 text-slate-600">
        Signed in as <span className="font-medium">{user?.displayName}</span> ({user?.role}).
        Full dashboard UI arrives in later steps.
      </p>
    </section>
  );
}
