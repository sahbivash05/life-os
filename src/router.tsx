import { Navigate, createBrowserRouter, createHashRouter } from "react-router-dom";

import { MainLayout } from "@/layouts/MainLayout";
import { DashboardPage } from "@/pages/Dashboard";
import { TodayPage } from "@/pages/Today";
import { WeeklyPage } from "@/pages/Weekly";
import { MonthlyPage } from "@/pages/Monthly";
import { GoalsPage } from "@/pages/Goals";
import { ReportsPage } from "@/pages/Reports";
import { NotFoundPage } from "@/pages/NotFound";

const routes = [
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
];

function isGitHubPages() {
  if (typeof window === "undefined") return false;
  return window.location.hostname.endsWith("github.io");
}

function normalizeBasename(baseUrl: string) {
  const trimmed = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  return trimmed.length === 0 ? "/" : trimmed;
}

const basename = normalizeBasename(import.meta.env.BASE_URL);

export const router = isGitHubPages()
  ? createHashRouter(routes, { basename })
  : createBrowserRouter(routes, { basename });

