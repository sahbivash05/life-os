import { CheckCircle2, Circle, Clock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/utils/cn";

export type ProgressCardItem = {
  id: string;
  label: string;
  valueText: string;
  status: "done" | "pending";
};

export function ProgressCard(props: {
  title: string;
  subtitle?: string;
  summaryLeft: string;
  summaryRight: string;
  items: ProgressCardItem[];
  className?: string;
}) {
  return (
    <Card className={cn(props.className)}>
      <CardHeader className="space-y-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="truncate text-base">{props.title}</CardTitle>
            {props.subtitle ? (
              <div className="mt-1 text-xs text-muted-foreground">
                {props.subtitle}
              </div>
            ) : null}
          </div>
          <Badge variant="muted" className="shrink-0">
            <Clock className="mr-1 h-3.5 w-3.5" />
            Live
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="text-sm font-medium">{props.summaryLeft}</div>
          <div className="text-sm text-muted-foreground">{props.summaryRight}</div>
        </div>

        <div className="space-y-2">
          {props.items.slice(0, 6).map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 rounded-lg border bg-background px-3 py-2"
            >
              <div className="flex min-w-0 items-center gap-2">
                {item.status === "done" ? (
                  <CheckCircle2 className="h-4 w-4 text-chart-2" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground" />
                )}
                <div className="truncate text-sm">{item.label}</div>
              </div>
              <div className="text-xs text-muted-foreground">{item.valueText}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

