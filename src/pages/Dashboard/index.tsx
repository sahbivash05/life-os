import { PageHeader } from "@/components/common/PageHeader";
import { ScoreTrendChart } from "@/components/charts/ScoreTrendChart";
import { PendingHabits } from "@/components/dashboard/PendingHabits";
import { ProgressCard } from "@/components/dashboard/ProgressCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { StreakCard } from "@/components/dashboard/StreakCard";
import { Badge } from "@/components/ui/badge";
import { useDashboardAnalytics } from "@/hooks/useDashboardAnalytics";
import { dayjs } from "@/utils/dayjs";

export function DashboardPage() {
  const a = useDashboardAnalytics();
  const todayPct =
    a.todaySummary.possible > 0
      ? Math.round((a.todaySummary.earned / a.todaySummary.possible) * 100)
      : 0;
  const weekPct =
    a.weekSummary.possible > 0
      ? Math.round((a.weekSummary.earned / a.weekSummary.possible) * 100)
      : 0;
  const monthPct =
    a.monthSummary.possible > 0
      ? Math.round((a.monthSummary.earned / a.monthSummary.possible) * 100)
      : 0;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle={`Overview for ${dayjs().format("MMM D, YYYY")}`}
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          label="Today score"
          value={`${Math.round(a.todaySummary.earned)} / ${a.todaySummary.possible}`}
          hint={`${todayPct}% pace`}
        />
        <StatCard
          label="Week score"
          value={`${Math.round(a.weekSummary.earned)} / ${Math.round(a.weekSummary.possible)}`}
          hint={`${weekPct}% pace`}
        />
        <StatCard
          label="Month score"
          value={`${Math.round(a.monthSummary.earned)} / ${Math.round(a.monthSummary.possible)}`}
          hint={`${monthPct}% pace`}
        />
        <StatCard
          label="Completion"
          value={`${a.todaySummary.completed} / ${a.todaySummary.total}`}
          hint="Daily habits done"
          right={<Badge variant="muted">{todayPct}%</Badge>}
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="grid gap-4 md:grid-cols-2">
            <ProgressCard
              title="Today"
              subtitle="Daily habits"
              summaryLeft={`${a.todaySummary.completed} complete`}
              summaryRight={`${a.todaySummary.total - a.todaySummary.completed} pending`}
              items={a.todayItems}
            />
            <ProgressCard
              title="This week"
              subtitle="Weekly habits"
              summaryLeft={`${a.weekItems.filter((x) => x.status === "done").length} on-track`}
              summaryRight={`${a.weekItems.filter((x) => x.status === "pending").length} behind`}
              items={a.weekItems}
            />
          </div>

          <ScoreTrendChart
            title="Score trend"
            subtitle="Last 14 days"
            data={a.trend14}
          />
        </div>

        <div className="space-y-4">
          <PendingHabits items={a.pending} />
          <StreakCard title="Current streaks" items={a.streaks} />
        </div>
      </div>
    </div>
  );
}

