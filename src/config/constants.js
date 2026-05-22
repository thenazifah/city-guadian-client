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
  WORKING: "working",
  RESOLVED: "resolved",
  CLOSED: "closed",
  REJECTED: "rejected",
};

export const MAX_CITIZEN_ISSUES = 3;

export const STAFF_STATUS_FLOW = [
  ISSUE_STATUS.OPEN,
  ISSUE_STATUS.IN_PROGRESS,
  ISSUE_STATUS.WORKING,
  ISSUE_STATUS.RESOLVED,
  ISSUE_STATUS.CLOSED,
];

export const ISSUE_CATEGORIES = [
  "pothole",
  "lighting",
  "sanitation",
  "graffiti",
  "traffic",
  "other",
];
