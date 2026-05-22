export function BlockedAccountBanner() {
  return (
    <div className="mb-6 rounded-2xl border border-red-300 bg-red-50 p-5 sm:p-6">
      <h2 className="text-lg font-bold text-red-900">Account restricted</h2>
      <p className="mt-2 text-sm text-red-800">
        Your account has been disabled by an administrator. You cannot report,
        edit, or delete issues until access is restored. Please contact City
        Guardian support for assistance.
      </p>
    </div>
  );
}
