import { useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { ROLE_HOME_ROUTES } from "@/config/constants";
import { useAuth } from "@/hooks/useAuth";
import { notifySuccess } from "@/utils/toast";

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors ${
    isActive ? "text-emerald-700" : "text-slate-600 hover:text-emerald-700"
  }`;

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    await logout();
    setMenuOpen(false);
    notifySuccess("You have been signed out.");
  }

  const dashboardPath = user ? ROLE_HOME_ROUTES[user.role] : "/";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-sm font-bold text-white">
            CG
          </span>
          <span className="text-base font-bold text-slate-900 sm:text-lg">
            City Guardian
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <NavLink to="/" className={navLinkClass} end>
            Home
          </NavLink>
          <NavLink to="/all-issues" className={navLinkClass}>
            All Issues
          </NavLink>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Register
              </Link>
            </>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full ring-2 ring-transparent hover:ring-emerald-200 focus:outline-none focus:ring-emerald-400"
                aria-label="Open profile menu"
              >
                <img
                  src={
                    user.avatarUrl ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName)}&background=059669&color=fff`
                  }
                  alt={user.displayName}
                  className="h-10 w-10 rounded-full object-cover"
                />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-200 bg-white py-2 shadow-lg">
                  <p className="border-b border-slate-100 px-4 py-2 text-sm font-semibold text-slate-900">
                    {user.displayName}
                  </p>
                  <p className="px-4 pb-2 text-xs text-slate-500">{user.email}</p>
                  <Link
                    to={dashboardPath}
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-slate-200 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <NavLink to="/" className={navLinkClass} end onClick={() => setMobileOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/all-issues" className={navLinkClass} onClick={() => setMobileOpen(false)}>
              All Issues
            </NavLink>
            {!isAuthenticated ? (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-slate-700">
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-center text-sm font-medium text-white"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-slate-900">{user.displayName}</p>
                <Link to={dashboardPath} onClick={() => setMobileOpen(false)} className="text-sm text-slate-700">
                  Dashboard
                </Link>
                <button type="button" onClick={handleLogout} className="text-left text-sm text-red-600">
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
