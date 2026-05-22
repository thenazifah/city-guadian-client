import { ISSUE_STATUS } from "@/config/constants";

const STATUS_STYLES = {
  [ISSUE_STATUS.OPEN]: "bg-amber-100 text-amber-800",
  [ISSUE_STATUS.IN_PROGRESS]: "bg-blue-100 text-blue-800",
  [ISSUE_STATUS.RESOLVED]: "bg-emerald-100 text-emerald-800",
  [ISSUE_STATUS.REJECTED]: "bg-red-100 text-red-800",
};

const STATUS_LABELS = {
  [ISSUE_STATUS.OPEN]: "Pending",
  [ISSUE_STATUS.IN_PROGRESS]: "In progress",
  [ISSUE_STATUS.RESOLVED]: "Resolved",
  [ISSUE_STATUS.REJECTED]: "Rejected",
};

const ROLE_LABELS = {
  citizen: "Citizen",
  staff: "Staff",
  admin: "Admin",
};

const CATEGORY_LABELS = {
  pothole: "Pothole",
  lighting: "Street lighting",
  sanitation: "Sanitation",
  graffiti: "Graffiti",
  traffic: "Traffic",
  other: "Other",
};

export function getStatusBadgeClass(status) {
  return STATUS_STYLES[status] || "bg-slate-100 text-slate-700";
}

export function getStatusLabel(status) {
  return STATUS_LABELS[status] || status;
}

export function getRoleLabel(role) {
  return ROLE_LABELS[role] || role;
}

export function isPendingStatus(status) {
  return status === ISSUE_STATUS.OPEN;
}

export function getCategoryLabel(category) {
  return CATEGORY_LABELS[category] || category;
}

export function getPriorityLabel(priority) {
  return priority === "high" ? "High" : "Normal";
}

export function getPriorityBadgeClass(priority) {
  return priority === "high"
    ? "bg-orange-100 text-orange-800 ring-1 ring-orange-200"
    : "bg-slate-100 text-slate-700";
}

export function formatIssueDate(dateString) {
  if (!dateString) return "Date unavailable";
  return new Date(dateString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getIssueImage(issue) {
  if (issue.images?.length > 0 && issue.images[0]) {
    return issue.images[0];
  }
  return null;
}

export function getIssueLocationText(issue) {
  if (issue.address) return issue.address;
  const coords = issue.location?.coordinates;
  if (coords?.length === 2) {
    return `Near ${coords[1].toFixed(4)}, ${coords[0].toFixed(4)}`;
  }
  return "Location on file";
}

export function sortIssuesForFeed(issues) {
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  return [...issues].sort((a, b) => {
    const pa = priorityOrder[a.priority] ?? 1;
    const pb = priorityOrder[b.priority] ?? 1;
    if (pa !== pb) return pa - pb;
    const voteDiff = (b.upvoteCount ?? 0) - (a.upvoteCount ?? 0);
    if (voteDiff !== 0) return voteDiff;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
}
