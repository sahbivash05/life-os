import { Flame } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/utils/cn";

export type StreakItem = {
  id: string;
  label: string;
  count: number;
  unit: "day" | "week" | "month";
  kind?: "positive" | "negative";
};

export function StreakCard(props: {
  title: string;
  items: StreakItem[];
  className?: string;
}) {
  return (
    <Card className={cn(props.className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{props.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {props.items.length === 0 ? (
          <div className="text-sm text-muted-foreground">No streaks yet.</div>
        ) : (
          props.items.slice(0, 6).map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between rounded-lg border bg-background px-3 py-2"
            >
              <div className="flex min-w-0 items-center gap-2">
                <Flame className="h-4 w-4 text-chart-3" />
                <div className="truncate text-sm">{s.label}</div>
              </div>
              <Badge variant="secondary" className="shrink-0">
                {s.count}
                {s.unit === "day" ? "d" : s.unit === "week" ? "w" : "m"}
              </Badge>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

