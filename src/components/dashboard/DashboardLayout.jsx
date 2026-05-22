import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

function navLinkClass({ isActive }) {
  return `block rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive
      ? "bg-emerald-600 text-white"
      : "text-slate-700 hover:bg-slate-100"
  }`;
}

export function DashboardLayout({ title, navItems }) {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
      <div className="mb-6 flex items-center justify-between gap-4 lg:hidden">
        <div>
          <h1 className="text-xl font-bold text-slate-900">{title}</h1>
          <p className="text-sm text-slate-600">{user?.displayName}</p>
        </div>
        <button
          type="button"
          onClick={() => setSidebarOpen((v) => !v)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700"
        >
          Menu
        </button>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <aside
          className={`lg:w-56 lg:shrink-0 ${
            sidebarOpen ? "block" : "hidden lg:block"
          }`}
        >
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="hidden text-xs font-semibold uppercase tracking-wide text-slate-500 lg:block">
              {title}
            </p>
            <nav className="mt-0 flex flex-col gap-1 lg:mt-3">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={navLinkClass}
                  onClick={() => setSidebarOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
