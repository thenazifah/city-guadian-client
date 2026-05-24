export const CITIZEN_NAV = [
  { to: "/citizen", label: "Overview", end: true },
  { to: "/citizen/issues", label: "My issues" },
  { to: "/citizen/report", label: "Report issue" },
  { to: "/citizen/profile", label: "Profile" },
];

export const STAFF_NAV = [
  { to: "/staff", label: "Overview", end: true },
  { to: "/staff/issues", label: "Assigned issues" },
  { to: "/staff/profile", label: "Profile" },
];

export const ADMIN_NAV = [
  { to: "/admin", label: "Overview", end: true },
  { to: "/admin/issues", label: "All issues" },
  { to: "/admin/users", label: "Manage users" },
  { to: "/admin/staff", label: "Manage staff" },
];
