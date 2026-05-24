import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { GuestRoute } from "@/routes/GuestRoute";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { RoleRoute } from "@/routes/RoleRoute";
import { ROLES } from "@/config/constants";
import { HomePage } from "@/pages/HomePage";
import { IssueDetailsPage } from "@/pages/IssueDetailsPage";
import { AllIssuesPage } from "@/pages/AllIssuesPage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { CitizenDashboardLayout } from "@/pages/dashboard/CitizenDashboardLayout";
import { StaffDashboardLayout } from "@/pages/dashboard/StaffDashboardLayout";
import { AdminDashboardLayout } from "@/pages/dashboard/AdminDashboardLayout";
import { CitizenOverviewPage } from "@/pages/citizen/CitizenOverviewPage";
import { CitizenMyIssuesPage } from "@/pages/citizen/CitizenMyIssuesPage";
import { CitizenReportIssuePage } from "@/pages/citizen/CitizenReportIssuePage";
import { CitizenProfilePage } from "@/pages/citizen/CitizenProfilePage";
import { StaffOverviewPage } from "@/pages/staff/StaffOverviewPage";
import { StaffAssignedIssuesPage } from "@/pages/staff/StaffAssignedIssuesPage";
import { StaffProfilePage } from "@/pages/staff/StaffProfilePage";
import { AdminOverviewPage } from "@/pages/admin/AdminOverviewPage";
import { AdminIssuesPage } from "@/pages/admin/AdminIssuesPage";
import { AdminUsersPage } from "@/pages/admin/AdminUsersPage";
import { AdminStaffPage } from "@/pages/admin/AdminStaffPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "all-issues", element: <AllIssuesPage /> },
      { path: "issue-details/:id", element: <IssueDetailsPage /> },
      {
        element: <GuestRoute />,
        children: [
          { path: "login", element: <LoginPage /> },
          { path: "register", element: <RegisterPage /> },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "citizen",
            element: <RoleRoute allowedRoles={[ROLES.CITIZEN]} />,
            children: [
              {
                element: <CitizenDashboardLayout />,
                children: [
                  { index: true, element: <CitizenOverviewPage /> },
                  { path: "issues", element: <CitizenMyIssuesPage /> },
                  { path: "report", element: <CitizenReportIssuePage /> },
                  { path: "profile", element: <CitizenProfilePage /> },
                ],
              },
            ],
          },
          {
            path: "staff",
            element: <RoleRoute allowedRoles={[ROLES.STAFF]} />,
            children: [
              {
                element: <StaffDashboardLayout />,
                children: [
                  { index: true, element: <StaffOverviewPage /> },
                  { path: "issues", element: <StaffAssignedIssuesPage /> },
                  { path: "profile", element: <StaffProfilePage /> },
                ],
              },
            ],
          },
          {
            path: "admin",
            element: <RoleRoute allowedRoles={[ROLES.ADMIN]} />,
            children: [
              {
                element: <AdminDashboardLayout />,
                children: [
                  { index: true, element: <AdminOverviewPage /> },
                  { path: "issues", element: <AdminIssuesPage /> },
                  { path: "users", element: <AdminUsersPage /> },
                  { path: "staff", element: <AdminStaffPage /> },
                ],
              },
            ],
          },
        ],
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
