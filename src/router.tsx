import { Navigate, createBrowserRouter } from "react-router-dom";

import { MainLayout } from "@/layouts/MainLayout";
import { DashboardPage } from "@/pages/Dashboard";
import { TodayPage } from "@/pages/Today";
import { WeeklyPage } from "@/pages/Weekly";
import { MonthlyPage } from "@/pages/Monthly";
import { GoalsPage } from "@/pages/Goals";
import { ReportsPage } from "@/pages/Reports";
import { NotFoundPage } from "@/pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "today", element: <TodayPage /> },
      { path: "weekly", element: <WeeklyPage /> },
      { path: "monthly", element: <MonthlyPage /> },
      { path: "goals", element: <GoalsPage /> },
      { path: "reports", element: <ReportsPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

