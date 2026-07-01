import dayjs from "dayjs";
import { Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/utils/cn";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/today": "Today",
  "/weekly": "Weekly",
  "/monthly": "Monthly",
  "/goals": "Goals",
  "/reports": "Reports",
};

const mobileLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/today", label: "Today" },
  { href: "/weekly", label: "Weekly" },
  { href: "/monthly", label: "Monthly" },
  { href: "/goals", label: "Goals" },
  { href: "/reports", label: "Reports" },
] as const;

export function TopNav() {
  const location = useLocation();
  const title = titles[location.pathname] ?? "Life OS";

  return (
    <header className="sticky top-0 z-40 border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center gap-3 px-4 md:px-6">
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open navigation">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <div className="flex h-14 items-center px-4">
                <Link to="/" className="text-sm font-semibold">
                  Life OS
                </Link>
              </div>
              <Separator />
              <nav className="p-2">
                {mobileLinks.map((l) => (
                  <Link
                    key={l.href}
                    to={l.href}
                    className={cn(
                      "block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                      location.pathname === l.href &&
                        "bg-accent text-accent-foreground",
                    )}
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold">{title}</div>
          <div className="text-xs text-muted-foreground">
            {dayjs().format("ddd, MMM D")}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

