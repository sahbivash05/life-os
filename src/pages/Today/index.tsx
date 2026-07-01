import { PageHeader } from "@/components/common/PageHeader";
import { HabitCard } from "@/components/habits/HabitCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHabitsByFrequency } from "@/hooks/useHabits";
import { useProgressIndex } from "@/hooks/useProgress";
import { pointsEarned } from "@/services/habitEngine";
import { progressService } from "@/services/progressService";
import { isoDate } from "@/utils/date";
import { progressKey } from "@/utils/progress";
import { HabitFrequency, HabitKind } from "@/types/habit";
import { dayjs } from "@/utils/dayjs";

export function TodayPage() {
  const today = isoDate();
  const habits = useHabitsByFrequency(HabitFrequency.Daily, { activeOnly: true });
  const progress = useProgressIndex();

  const positive = habits.filter((h) => h.kind === HabitKind.Positive);
  const negative = habits.filter((h) => h.kind === HabitKind.Negative);

  const totals = habits.reduce(
    (acc, h) => {
      const v = progress[progressKey(h.id, today)]?.value ?? 0;
      acc.earned += pointsEarned(h, v);
      acc.possible += h.points;
      acc.completed += pointsEarned(h, v) >= h.points ? 1 : 0;
      acc.count += 1;
      return acc;
    },
    { earned: 0, possible: 0, completed: 0, count: 0 },
  );

  return (
    <div>
      <PageHeader
        title="Today"
        subtitle={dayjs().format("dddd, MMM D")}
        right={
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              Score {Math.round(totals.earned)} / {totals.possible}
            </Badge>
            <Badge variant="muted">
              {totals.completed} / {totals.count} done
            </Badge>
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="space-y-3">
            <div className="text-sm font-semibold">Daily habits</div>
            <div className="grid gap-3">
              {positive.map((h) => {
                const v = progress[progressKey(h.id, today)]?.value ?? 0;
                return (
                  <HabitCard
                    key={h.id}
                    habit={h}
                    value={v}
                    onChangeValue={(next) =>
                      progressService.setValue(h.id, today, next)
                    }
                  />
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-semibold">Negative habits</div>
            <div className="grid gap-3">
              {negative.map((h) => {
                const v = progress[progressKey(h.id, today)]?.value ?? 0;
                return (
                  <HabitCard
                    key={h.id}
                    habit={h}
                    value={v}
                    onChangeValue={(next) =>
                      progressService.setValue(h.id, today, next)
                    }
                  />
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Points earned</span>
                <span className="font-medium">
                  {Math.round(totals.earned)} / {totals.possible}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Completion</span>
                <span className="font-medium">
                  {totals.completed} / {totals.count}
                </span>
              </div>
              <div className="pt-2 text-xs text-muted-foreground">
                Progress is saved locally on this device.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

