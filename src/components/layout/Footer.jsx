import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-lg font-bold text-white">City Guardian</p>
          <p className="mt-2 text-sm leading-relaxed">
            A public infrastructure issue reporting platform connecting citizens with municipal staff.
          </p>
        </div>
        <div>
          <p className="font-semibold text-white">Explore</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-emerald-400">
                Home
              </Link>
            </li>
            <li>
              <Link to="/all-issues" className="hover:text-emerald-400">
                All Issues
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-white">Account</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link to="/login" className="hover:text-emerald-400">
                Login
              </Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-emerald-400">
                Register
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-white">Contact</p>
          <p className="mt-3 text-sm leading-relaxed">
            Report road damage, lighting failures, sanitation problems, and other civic issues in your neighborhood.
          </p>
        </div>
      </div>
      <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} City Guardian. All rights reserved.
      </div>
    </footer>
  );
}
