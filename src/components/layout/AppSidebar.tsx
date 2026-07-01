import { NavLink } from "react-router-dom";
import {
  BarChart3,
  CalendarDays,
  CalendarRange,
  CalendarSearch,
  Goal,
  LayoutDashboard,
} from "lucide-react";

import { cn } from "@/utils/cn";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/today", label: "Today", icon: CalendarDays },
  { to: "/weekly", label: "Weekly", icon: CalendarRange },
  { to: "/monthly", label: "Monthly", icon: CalendarSearch },
  { to: "/goals", label: "Goals", icon: Goal },
  { to: "/reports", label: "Reports", icon: BarChart3 },
] as const;

export function AppSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r bg-background md:block">
      <div className="flex h-14 items-center px-4">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-sm font-semibold">LO</span>
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold">Life OS</div>
            <div className="text-xs text-muted-foreground">Habits & reports</div>
          </div>
        </div>
      </div>

      <nav className="px-2 py-3">
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                  isActive && "bg-accent text-accent-foreground",
                )
              }
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </aside>
  );
}

