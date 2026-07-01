import { Outlet } from "react-router-dom";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopNav } from "@/components/layout/TopNav";

export function MainLayout() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopNav />
          <main className="flex-1 py-6">
            <div className="container-page">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

