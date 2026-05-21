import { createBrowserRouter, Navigate } from "react-router-dom";
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
import { DashboardPlaceholder } from "@/pages/dashboard/DashboardPlaceholder";

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
                index: true,
                element: <DashboardPlaceholder title="Citizen Dashboard" />,
              },
            ],
          },
          {
            path: "staff",
            element: <RoleRoute allowedRoles={[ROLES.STAFF]} />,
            children: [
              {
                index: true,
                element: <DashboardPlaceholder title="Staff Dashboard" />,
              },
            ],
          },
          {
            path: "admin",
            element: <RoleRoute allowedRoles={[ROLES.ADMIN]} />,
            children: [
              {
                index: true,
                element: <DashboardPlaceholder title="Admin Dashboard" />,
              },
            ],
          },
        ],
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
