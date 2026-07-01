import type { Habit } from "@/types/habit";
import { HabitFrequency } from "@/types/habit";
import type { HabitReport, HabitReportRow } from "@/types/report";
import type { IsoDate, ProgressIndex } from "@/types/progress";
import { completionRatio, isComplete, pointsEarned, targetValue } from "@/services/habitEngine";
import { currentStreak } from "@/services/streakEngine";
import { dayjs } from "@/utils/dayjs";
import { eachDay, endOfIsoWeek, endOfMonth, isoDate, startOfIsoWeek, startOfMonth } from "@/utils/date";
import { progressKey } from "@/utils/progress";

export function generateWeeklyReport(asOf: IsoDate, habits: Habit[], progress: ProgressIndex): HabitReport {
  const start = startOfIsoWeek(asOf);
  const end = endOfIsoWeek(asOf);
  const days = eachDay(start, end);

  const rows: HabitReportRow[] = [];

  for (const h of habits) {
    if (!h.active) continue;
    if (h.frequency !== HabitFrequency.Daily && h.frequency !== HabitFrequency.Weekly) continue;

    if (h.frequency === HabitFrequency.Daily) {
      const completed = days.reduce((acc, d) => {
        const v = progress[progressKey(h.id, d)]?.value ?? 0;
        return acc + (isComplete(h, v) ? 1 : 0);
      }, 0);

      const pointsPossible = h.points * days.length;
      const pointsEarnedTotal = days.reduce((acc, d) => {
        const v = progress[progressKey(h.id, d)]?.value ?? 0;
        return acc + pointsEarned(h, v);
      }, 0);

      rows.push({
        habitId: h.id,
        habitName: h.name,
        frequency: h.frequency,
        completed,
        target: days.length,
        completionRate: days.length > 0 ? completed / days.length : 0,
        pointsEarned: pointsEarnedTotal,
        pointsPossible,
      });
      continue;
    }

    // Weekly
    const totalValue = days.reduce((acc, d) => acc + (progress[progressKey(h.id, d)]?.value ?? 0), 0);
    const target = targetValue(h);
    rows.push({
      habitId: h.id,
      habitName: h.name,
      frequency: h.frequency,
      completed: totalValue,
      target,
      completionRate: completionRatio(h, totalValue),
      pointsEarned: pointsEarned(h, totalValue),
      pointsPossible: h.points,
    });
  }

  return finalizeReport("week", start, end, rows, habits, progress, asOf);
}

export function generateMonthlyReport(asOf: IsoDate, habits: Habit[], progress: ProgressIndex): HabitReport {
  const start = startOfMonth(asOf);
  const end = endOfMonth(asOf);
  const days = eachDay(start, end);

  const weeks = buildIsoWeeksCoveringRange(start, end);

  const rows: HabitReportRow[] = [];

  for (const h of habits) {
    if (!h.active) continue;
    if (
      h.frequency !== HabitFrequency.Daily &&
      h.frequency !== HabitFrequency.Weekly &&
      h.frequency !== HabitFrequency.Monthly
    )
      continue;

    if (h.frequency === HabitFrequency.Daily) {
      const completed = days.reduce((acc, d) => {
        const v = progress[progressKey(h.id, d)]?.value ?? 0;
        return acc + (isComplete(h, v) ? 1 : 0);
      }, 0);

      const pointsPossible = h.points * days.length;
      const pointsEarnedTotal = days.reduce((acc, d) => {
        const v = progress[progressKey(h.id, d)]?.value ?? 0;
        return acc + pointsEarned(h, v);
      }, 0);

      rows.push({
        habitId: h.id,
        habitName: h.name,
        frequency: h.frequency,
        completed,
        target: days.length,
        completionRate: days.length > 0 ? completed / days.length : 0,
        pointsEarned: pointsEarnedTotal,
        pointsPossible,
      });
      continue;
    }

    if (h.frequency === HabitFrequency.Weekly) {
      const perWeek = weeks.map((w) => {
        const wDays = eachDay(w.start, w.end);
        const totalValue = wDays.reduce((acc, d) => acc + (progress[progressKey(h.id, d)]?.value ?? 0), 0);
        return { totalValue, earned: pointsEarned(h, totalValue), possible: h.points };
      });

      const completed = perWeek.reduce((acc, x) => acc + x.totalValue, 0);
      const target = targetValue(h) * weeks.length;
      const pointsEarnedTotal = perWeek.reduce((acc, x) => acc + x.earned, 0);
      const pointsPossible = perWeek.reduce((acc, x) => acc + x.possible, 0);
      const completionRate = pointsPossible > 0 ? pointsEarnedTotal / pointsPossible : 0;

      rows.push({
        habitId: h.id,
        habitName: h.name,
        frequency: h.frequency,
        completed,
        target,
        completionRate,
        pointsEarned: pointsEarnedTotal,
        pointsPossible,
      });
      continue;
    }

    // Monthly
    const totalValue = days.reduce((acc, d) => acc + (progress[progressKey(h.id, d)]?.value ?? 0), 0);
    const target = targetValue(h);
    rows.push({
      habitId: h.id,
      habitName: h.name,
      frequency: h.frequency,
      completed: totalValue,
      target,
      completionRate: completionRatio(h, totalValue),
      pointsEarned: pointsEarned(h, totalValue),
      pointsPossible: h.points,
    });
  }

  return finalizeReport("month", start, end, rows, habits, progress, asOf);
}

function finalizeReport(
  period: "week" | "month",
  startDate: IsoDate,
  endDate: IsoDate,
  rows: HabitReportRow[],
  habits: Habit[],
  progress: ProgressIndex,
  asOf: IsoDate,
): HabitReport {
  const totals = rows.reduce(
    (acc, r) => {
      acc.earned += r.pointsEarned;
      acc.possible += r.pointsPossible;
      return acc;
    },
    { earned: 0, possible: 0 },
  );

  const scorePercent = totals.possible > 0 ? (totals.earned / totals.possible) * 100 : 0;

  const byRate = [...rows].sort((a, b) => b.completionRate - a.completionRate);
  const best = byRate[0];
  const worst = [...rows].sort((a, b) => a.completionRate - b.completionRate)[0];

  const mostMissed = [...rows]
    .filter((r) => r.completionRate < 1)
    .sort((a, b) => a.completionRate - b.completionRate)[0];

  const streakBest = habits
    .filter((h) => h.active && h.frequency !== HabitFrequency.OneTime)
    .map((h) => ({ habitId: h.id, s: currentStreak(h, progress, asOf) }))
    .sort((a, b) => b.s.count - a.s.count)[0];

  const report: HabitReport = {
    period,
    startDate,
    endDate,
    scorePercent: Math.round(scorePercent * 10) / 10,
    totalPointsEarned: Math.round(totals.earned * 100) / 100,
    totalPointsPossible: Math.round(totals.possible * 100) / 100,
    rows: rows.sort((a, b) => b.completionRate - a.completionRate),
  };

  if (best) report.bestHabitId = best.habitId;
  if (worst) report.worstHabitId = worst.habitId;
  if (mostMissed) report.mostMissedHabitId = mostMissed.habitId;
  if (streakBest) report.longestStreakHabitId = streakBest.habitId;

  return report;
}

function buildIsoWeeksCoveringRange(start: IsoDate, end: IsoDate) {
  const weeks: Array<{ start: IsoDate; end: IsoDate }> = [];
  let cur = dayjs(start).startOf("isoWeek");
  const endD = dayjs(end);
  for (let i = 0; i < 64; i += 1) {
    const wStart = isoDate(cur);
    const wEnd = isoDate(cur.endOf("isoWeek"));
    weeks.push({ start: wStart, end: wEnd });
    cur = cur.add(1, "week");
    if (cur.isAfter(endD)) break;
  }
  return weeks;
}

