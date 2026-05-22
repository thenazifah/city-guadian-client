import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { STAFF_NAV } from "@/config/dashboardNav";

export function StaffDashboardLayout() {
  return <DashboardLayout title="Staff dashboard" navItems={STAFF_NAV} />;
}
