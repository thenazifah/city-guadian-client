import { ISSUE_STATUS } from "@/config/constants";

const STATUS_STYLES = {
  [ISSUE_STATUS.OPEN]: "bg-amber-100 text-amber-800",
  [ISSUE_STATUS.IN_PROGRESS]: "bg-blue-100 text-blue-800",
  [ISSUE_STATUS.RESOLVED]: "bg-emerald-100 text-emerald-800",
  [ISSUE_STATUS.REJECTED]: "bg-red-100 text-red-800",
};

const STATUS_LABELS = {
  [ISSUE_STATUS.OPEN]: "Open",
  [ISSUE_STATUS.IN_PROGRESS]: "In progress",
  [ISSUE_STATUS.RESOLVED]: "Resolved",
  [ISSUE_STATUS.REJECTED]: "Rejected",
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

export function getCategoryLabel(category) {
  return CATEGORY_LABELS[category] || category;
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
