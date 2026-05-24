import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ADMIN_NAV } from "@/config/dashboardNav";

export function AdminDashboardLayout() {
  return <DashboardLayout title="Admin dashboard" navItems={ADMIN_NAV} />;
}
