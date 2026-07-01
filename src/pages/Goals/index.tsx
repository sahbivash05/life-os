import { PageHeader } from "@/components/common/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useHabitsByFrequency } from "@/hooks/useHabits";
import { useProgressIndex } from "@/hooks/useProgress";
import { progressService } from "@/services/progressService";
import type { IsoDate, ProgressIndex } from "@/types/progress";
import { HabitFrequency, HabitMetricType } from "@/types/habit";
import { dayjs } from "@/utils/dayjs";
import { isoDate } from "@/utils/date";

export function GoalsPage() {
  const today = isoDate();
  const goals = useHabitsByFrequency(HabitFrequency.OneTime, { activeOnly: true });
  const progress = useProgressIndex();

  return (
    <div>
      <PageHeader title="Goals" subtitle="One-time goals and milestones." />
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">One-time goals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {goals.length === 0 ? (
            <div className="text-sm text-muted-foreground">No goals configured.</div>
          ) : (
            goals.map((g) => {
              if (g.target.type !== HabitMetricType.Checkbox) return null;

              const completedAt = completionDate(g.id, progress);
              const checked = completedAt !== null;

              return (
                <div
                  key={g.id}
                  className="flex items-center justify-between gap-4 rounded-xl border bg-background px-4 py-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="truncate text-sm font-medium">{g.name}</div>
                      {checked ? <Badge variant="secondary">Completed</Badge> : null}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {g.points} pts
                      {completedAt ? (
                        <>
                          {" "}
                          • done {dayjs(completedAt).format("MMM D, YYYY")}
                        </>
                      ) : null}
                    </div>
                  </div>

                  <Checkbox
                    checked={checked}
                    onCheckedChange={(v) => {
                      if (v) {
                        progressService.setValue(g.id, today, 1);
                        return;
                      }
                      progressService.removeAllForHabit(g.id);
                    }}
                    aria-label={checked ? "Mark goal incomplete" : "Mark goal complete"}
                  />
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function completionDate(goalId: string, progress: ProgressIndex): IsoDate | null {
  let best: IsoDate | null = null;
  for (const entry of Object.values(progress)) {
    if (entry.habitId !== goalId) continue;
    if (entry.value < 1) continue;
    if (best === null || entry.date < best) best = entry.date;
  }
  return best;
}

