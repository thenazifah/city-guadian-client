import { ISSUE_STATUS } from "@/config/constants";

export function computeCitizenStats(issues) {
  const list = issues ?? [];
  const inProgressStatuses = [
    ISSUE_STATUS.IN_PROGRESS,
    ISSUE_STATUS.WORKING,
  ];
  const resolvedStatuses = [ISSUE_STATUS.RESOLVED, ISSUE_STATUS.CLOSED];

  return {
    total: list.length,
    pending: list.filter((i) => i.status === ISSUE_STATUS.OPEN).length,
    inProgress: list.filter((i) => inProgressStatuses.includes(i.status))
      .length,
    resolved: list.filter((i) => resolvedStatuses.includes(i.status)).length,
    payments: 0,
  };
}

export function computeStaffStats(issues) {
  const list = issues ?? [];
  const resolvedStatuses = [ISSUE_STATUS.RESOLVED, ISSUE_STATUS.CLOSED];

  return {
    assigned: list.length,
    resolved: list.filter((i) => resolvedStatuses.includes(i.status)).length,
    active: list.filter((i) => !resolvedStatuses.includes(i.status)).length,
  };
}

export function buildStatusChartData(stats) {
  return [
    { label: "Pending", value: stats.pending, color: "bg-amber-500" },
    { label: "In progress", value: stats.inProgress, color: "bg-blue-500" },
    { label: "Resolved", value: stats.resolved, color: "bg-emerald-500" },
  ].filter((item) => item.value > 0);
}
