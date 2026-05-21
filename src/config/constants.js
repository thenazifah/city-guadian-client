export const ROLES = {
  CITIZEN: "citizen",
  STAFF: "staff",
  ADMIN: "admin",
};

export const ROLE_HOME_ROUTES = {
  [ROLES.CITIZEN]: "/citizen",
  [ROLES.STAFF]: "/staff",
  [ROLES.ADMIN]: "/admin",
};

export const ISSUE_STATUS = {
  OPEN: "open",
  IN_PROGRESS: "in_progress",
  RESOLVED: "resolved",
  REJECTED: "rejected",
};

export const ISSUE_CATEGORIES = [
  "pothole",
  "lighting",
  "sanitation",
  "graffiti",
  "traffic",
  "other",
];
