import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type PendingHabitItem = {
  id: string;
  label: string;
  meta: string;
  href: "/today" | "/weekly" | "/monthly" | "/goals";
};

export function PendingHabits(props: { items: PendingHabitItem[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-base">Pending</CardTitle>
        <Button asChild variant="ghost" size="sm">
          <Link to="/today">
            Open tracker
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {props.items.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            Nothing pending. Nice work.
          </div>
        ) : (
          props.items.slice(0, 8).map((h) => (
            <Link
              key={h.id}
              to={h.href}
              className="block rounded-lg border bg-background px-3 py-2 hover:bg-accent"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 truncate text-sm">{h.label}</div>
                <div className="shrink-0 text-xs text-muted-foreground">
                  {h.meta}
                </div>
              </div>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  );
}

