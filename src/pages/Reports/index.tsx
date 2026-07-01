import { PageHeader } from "@/components/common/PageHeader";
import { HeatmapCalendar } from "@/components/charts/HeatmapCalendar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useHabits } from "@/hooks/useHabits";
import { useProgressIndex } from "@/hooks/useProgress";
import { summarizeDay } from "@/services/analyticsService";
import { generateMonthlyReport, generateWeeklyReport } from "@/services/reportService";
import { dayjs } from "@/utils/dayjs";
import { eachDay, endOfMonth, isoDate, startOfMonth, startOfIsoWeek } from "@/utils/date";
import type { HabitReport } from "@/types/report";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

export function ReportsPage() {
  const habits = useHabits();
  const progress = useProgressIndex();
  const today = isoDate();

  const [weekOffset, setWeekOffset] = useState(0);
  const [monthOffset, setMonthOffset] = useState(0);

  const weekAsOf = isoDate(dayjs(today).add(weekOffset, "week"));
  const monthAsOf = isoDate(dayjs(today).add(monthOffset, "month"));

  const weekly = useMemo(
    () => generateWeeklyReport(weekAsOf, habits, progress),
    [weekAsOf, habits, progress],
  );
  const monthly = useMemo(
    () => generateMonthlyReport(monthAsOf, habits, progress),
    [monthAsOf, habits, progress],
  );

  const heatmap = useMemo(() => {
    const end = today;
    const start = isoDate(dayjs(end).subtract(364, "day"));
    const values: Record<string, number> = {};
    for (const d of eachDay(start, end)) {
      const s = summarizeDay(d, habits, progress);
      values[d] = s.possible > 0 ? s.earned / s.possible : 0;
    }
    return values;
  }, [today, habits, progress]);

  return (
    <div>
      <PageHeader
        title="Reports"
        subtitle="Weekly and monthly performance summaries."
      />

      <Tabs defaultValue="weekly" className="space-y-4">
        <TabsList>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="space-y-4">
          <PeriodHeader
            title={`Week ${dayjs(startOfIsoWeek(weekAsOf)).week()}`}
            subtitle={`${dayjs(weekly.startDate).format("MMM D")} – ${dayjs(
              weekly.endDate,
            ).format("MMM D, YYYY")}`}
            onPrev={() => setWeekOffset((x) => x - 1)}
            onNext={() => setWeekOffset((x) => x + 1)}
          />
          <ReportSummary report={weekly} habits={habits} />
          <ReportRows report={weekly} />
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          <PeriodHeader
            title={dayjs(monthAsOf).format("MMMM YYYY")}
            subtitle={`${dayjs(startOfMonth(monthAsOf)).format("MMM D")} – ${dayjs(
              endOfMonth(monthAsOf),
            ).format("MMM D, YYYY")}`}
            onPrev={() => setMonthOffset((x) => x - 1)}
            onNext={() => setMonthOffset((x) => x + 1)}
          />
          <ReportSummary report={monthly} habits={habits} />
          <ReportRows report={monthly} />
        </TabsContent>
      </Tabs>

      <div className="mt-8 space-y-3">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-sm font-semibold">Activity heatmap</div>
            <div className="mt-1 text-xs text-muted-foreground">
              Last 365 days • intensity = completion score
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>Less</span>
            <span className="h-3 w-3 rounded-[3px] bg-muted ring-1 ring-border" />
            <span className="h-3 w-3 rounded-[3px] bg-chart-2/25 ring-1 ring-border" />
            <span className="h-3 w-3 rounded-[3px] bg-chart-2/45 ring-1 ring-border" />
            <span className="h-3 w-3 rounded-[3px] bg-chart-2/70 ring-1 ring-border" />
            <span className="h-3 w-3 rounded-[3px] bg-chart-2 ring-1 ring-border" />
            <span>More</span>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <HeatmapCalendar endDate={today} days={365} values={heatmap} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function PeriodHeader(props: {
  title: string;
  subtitle: string;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
      <div>
        <div className="text-sm font-semibold">{props.title}</div>
        <div className="mt-1 text-xs text-muted-foreground">{props.subtitle}</div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={props.onPrev} aria-label="Previous">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={props.onNext} aria-label="Next">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function ReportSummary(props: { report: HabitReport; habits: { id: string; name: string }[] }) {
  const nameById = useMemo(() => {
    const m = new Map<string, string>();
    for (const h of props.habits) m.set(h.id, h.name);
    return m;
  }, [props.habits]);

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Score</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <div className="text-2xl font-semibold">{props.report.scorePercent}%</div>
          <div className="text-xs text-muted-foreground">
            {Math.round(props.report.totalPointsEarned)} /{" "}
            {Math.round(props.report.totalPointsPossible)} points
          </div>
        </CardContent>
      </Card>

      <MetaCard label="Best habit" value={nameById.get(props.report.bestHabitId ?? "") ?? "—"} />
      <MetaCard label="Most missed" value={nameById.get(props.report.mostMissedHabitId ?? "") ?? "—"} />
      <MetaCard
        label="Longest streak"
        value={nameById.get(props.report.longestStreakHabitId ?? "") ?? "—"}
      />
    </div>
  );
}

function MetaCard(props: { label: string; value: string }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{props.label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="truncate text-sm font-medium">{props.value}</div>
      </CardContent>
    </Card>
  );
}

function ReportRows(props: { report: HabitReport }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {props.report.rows.map((r) => (
          <div
            key={r.habitId}
            className="flex flex-col gap-2 rounded-xl border bg-background p-4 md:flex-row md:items-center md:justify-between"
          >
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">{r.habitName}</div>
              <div className="mt-1 text-xs text-muted-foreground">
                {Math.round(r.completed * 100) / 100} / {Math.round(r.target * 100) / 100} •{" "}
                {Math.round(r.pointsEarned * 10) / 10} pts
              </div>
            </div>
            <Badge variant={r.completionRate >= 1 ? "secondary" : "muted"}>
              {Math.round(r.completionRate * 100)}%
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

