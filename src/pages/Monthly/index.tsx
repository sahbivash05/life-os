import { PageHeader } from "@/components/common/PageHeader";
import { Minus, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHabitsByFrequency } from "@/hooks/useHabits";
import { useProgressIndex } from "@/hooks/useProgress";
import { completionRatio, targetValue } from "@/services/habitEngine";
import { progressService } from "@/services/progressService";
import { dayjs } from "@/utils/dayjs";
import { eachDay, endOfMonth, isoDate, startOfMonth } from "@/utils/date";
import { progressKey } from "@/utils/progress";
import { HabitFrequency, HabitMetricType } from "@/types/habit";

export function MonthlyPage() {
  const today = isoDate();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const monthDays = eachDay(monthStart, monthEnd);

  const habits = useHabitsByFrequency(HabitFrequency.Monthly, { activeOnly: true });
  const progress = useProgressIndex();

  return (
    <div>
      <PageHeader
        title="Monthly"
        subtitle={`${dayjs(monthStart).format("MMMM YYYY")} • ${dayjs(
          monthStart,
        ).format("MMM D")} – ${dayjs(monthEnd).format("MMM D")}`}
      />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Monthly habits</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {habits.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No monthly habits configured.
            </div>
          ) : (
            habits.map((h) => {
              const total = monthDays.reduce((acc, d) => {
                return acc + (progress[progressKey(h.id, d)]?.value ?? 0);
              }, 0);
              const ratio = completionRatio(h, total);
              const done = ratio >= 1;
              const t = targetValue(h);
              const step = h.target.type === HabitMetricType.Number ? h.target.step ?? 1 : 1;

              return (
                <div
                  key={h.id}
                  className="flex flex-col gap-2 rounded-xl border bg-background p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="truncate text-sm font-medium">{h.name}</div>
                      {done ? <Badge variant="secondary">Done</Badge> : null}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {Math.round(total * 100) / 100} / {t} • {h.points} pts
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-primary transition-[width]"
                        style={{ width: `${Math.round(ratio * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 md:pl-6">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => progressService.increment(h.id, today, -step)}
                      aria-label="Decrement today"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => progressService.increment(h.id, today, step)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add today
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}

