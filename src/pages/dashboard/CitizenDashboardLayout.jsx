import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { CITIZEN_NAV } from "@/config/dashboardNav";

export function CitizenDashboardLayout() {
  return <DashboardLayout title="Citizen dashboard" navItems={CITIZEN_NAV} />;
}
