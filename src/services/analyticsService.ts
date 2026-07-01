import type { Habit } from "@/types/habit";
import { HabitFrequency, HabitKind } from "@/types/habit";
import type { IsoDate, ProgressIndex } from "@/types/progress";
import { formatValue, isComplete, pointsEarned, targetValue } from "@/services/habitEngine";
import { currentStreak } from "@/services/streakEngine";
import { dayjs } from "@/utils/dayjs";
import { eachDay, endOfIsoWeek, endOfMonth, isoDate, startOfIsoWeek, startOfMonth } from "@/utils/date";
import { progressKey } from "@/utils/progress";

export type ScoreSummary = {
  earned: number;
  possible: number;
  completed: number;
  total: number;
};

export type PendingItem = { id: string; label: string; meta: string; href: "/today" | "/weekly" | "/monthly" | "/goals" };
export type ProgressItem = { id: string; label: string; valueText: string; status: "done" | "pending" };
export type StreakItem = { id: string; label: string; count: number; unit: "day" | "week" | "month"; kind?: "positive" | "negative" };

export function summarizeDay(date: IsoDate, habits: Habit[], progress: ProgressIndex): ScoreSummary {
  const daily = habits.filter((h) => h.active && h.frequency === HabitFrequency.Daily);
  return daily.reduce(
    (acc, h) => {
      const v = progress[progressKey(h.id, date)]?.value ?? 0;
      acc.earned += pointsEarned(h, v);
      acc.possible += h.points;
      acc.completed += isComplete(h, v) ? 1 : 0;
      acc.total += 1;
      return acc;
    },
    { earned: 0, possible: 0, completed: 0, total: 0 },
  );
}

export function summarizeWeek(asOf: IsoDate, habits: Habit[], progress: ProgressIndex): ScoreSummary {
  const start = startOfIsoWeek(asOf);
  const end = endOfIsoWeek(asOf);
  const days = eachDay(start, end);

  const weeklyHabits = habits.filter((h) => h.active && h.frequency === HabitFrequency.Weekly);

  let earned = 0;
  let possible = 0;
  let completed = 0;
  let total = 0;

  for (const d of days) {
    const day = summarizeDay(d, habits, progress);
    earned += day.earned;
    possible += day.possible;
    completed += day.completed;
    total += day.total;
  }

  for (const h of weeklyHabits) {
    const totalValue = days.reduce((acc, d) => acc + (progress[progressKey(h.id, d)]?.value ?? 0), 0);
    earned += pointsEarned(h, totalValue);
    possible += h.points;
    completed += isComplete(h, totalValue) ? 1 : 0;
    total += 1;
  }

  // Ensure the daily habits count isn't treated as "completed habits" for the whole week UI.
  // Consumers can compute % based on earned/possible.
  return { earned, possible, completed, total };
}

export function summarizeMonth(asOf: IsoDate, habits: Habit[], progress: ProgressIndex): ScoreSummary {
  const start = startOfMonth(asOf);
  const end = endOfMonth(asOf);
  const days = eachDay(start, end);

  const weeklyHabits = habits.filter((h) => h.active && h.frequency === HabitFrequency.Weekly);
  const monthlyHabits = habits.filter((h) => h.active && h.frequency === HabitFrequency.Monthly);

  let earned = 0;
  let possible = 0;
  let completed = 0;
  let total = 0;

  for (const d of days) {
    const day = summarizeDay(d, habits, progress);
    earned += day.earned;
    possible += day.possible;
    completed += day.completed;
    total += day.total;
  }

  // Weekly habits: compute per-week completion inside the month.
  const weeksInMonth = buildIsoWeeksCoveringRange(start, end);
  for (const h of weeklyHabits) {
    for (const w of weeksInMonth) {
      const wDays = eachDay(w.start, w.end);
      const totalValue = wDays.reduce((acc, d) => acc + (progress[progressKey(h.id, d)]?.value ?? 0), 0);
      earned += pointsEarned(h, totalValue);
      possible += h.points;
      completed += isComplete(h, totalValue) ? 1 : 0;
      total += 1;
    }
  }

  for (const h of monthlyHabits) {
    const totalValue = days.reduce((acc, d) => acc + (progress[progressKey(h.id, d)]?.value ?? 0), 0);
    earned += pointsEarned(h, totalValue);
    possible += h.points;
    completed += isComplete(h, totalValue) ? 1 : 0;
    total += 1;
  }

  return { earned, possible, completed, total };
}

export function trendLastNDays(n: number, habits: Habit[], progress: ProgressIndex, asOf: IsoDate) {
  const start = isoDate(dayjs(asOf).subtract(n - 1, "day"));
  const days = eachDay(start, asOf);
  return days.map((d) => {
    const summary = summarizeDay(d, habits, progress);
    return { label: dayjs(d).format("D"), score: Math.round(summary.earned) };
  });
}

export function buildDashboardCards(habits: Habit[], progress: ProgressIndex, asOf: IsoDate) {
  const todaySummary = summarizeDay(asOf, habits, progress);
  const weekSummary = summarizeWeek(asOf, habits, progress);
  const monthSummary = summarizeMonth(asOf, habits, progress);

  const dailyHabits = habits.filter((h) => h.active && h.frequency === HabitFrequency.Daily);
  const weeklyHabits = habits.filter((h) => h.active && h.frequency === HabitFrequency.Weekly);
  const monthlyHabits = habits.filter((h) => h.active && h.frequency === HabitFrequency.Monthly);
  const goals = habits.filter((h) => h.active && h.frequency === HabitFrequency.OneTime);

  const todayItems: ProgressItem[] = dailyHabits.map((h) => {
    const v = progress[progressKey(h.id, asOf)]?.value ?? 0;
    return { id: h.id, label: h.name, valueText: formatValue(h, v), status: isComplete(h, v) ? "done" : "pending" };
  });

  const weekStart = startOfIsoWeek(asOf);
  const weekEnd = endOfIsoWeek(asOf);
  const weekDays = eachDay(weekStart, weekEnd);
  const weekItems: ProgressItem[] = weeklyHabits.map((h) => {
    const total = weekDays.reduce((acc, d) => acc + (progress[progressKey(h.id, d)]?.value ?? 0), 0);
    return {
      id: h.id,
      label: h.name,
      valueText: `${Math.round(total * 100) / 100} / ${targetValue(h)}`,
      status: isComplete(h, total) ? "done" : "pending",
    };
  });

  const monthStart = startOfMonth(asOf);
  const monthEnd = endOfMonth(asOf);
  const monthDays = eachDay(monthStart, monthEnd);
  const monthItems: ProgressItem[] = monthlyHabits.map((h) => {
    const total = monthDays.reduce((acc, d) => acc + (progress[progressKey(h.id, d)]?.value ?? 0), 0);
    return {
      id: h.id,
      label: h.name,
      valueText: `${Math.round(total * 100) / 100} / ${targetValue(h)}`,
      status: isComplete(h, total) ? "done" : "pending",
    };
  });

  const pending: PendingItem[] = [
    ...todayItems
      .filter((x) => x.status === "pending")
      .slice(0, 6)
      .map((x) => ({ id: x.id, label: x.label, meta: x.valueText, href: "/today" as const })),
    ...weekItems
      .filter((x) => x.status === "pending")
      .slice(0, 4)
      .map((x) => ({ id: x.id, label: x.label, meta: x.valueText, href: "/weekly" as const })),
    ...monthItems
      .filter((x) => x.status === "pending")
      .slice(0, 2)
      .map((x) => ({ id: x.id, label: x.label, meta: x.valueText, href: "/monthly" as const })),
    ...goals
      .filter((g) => {
        const anyDone = Object.values(progress).some((p) => p.habitId === g.id && p.value >= 1);
        return !anyDone;
      })
      .slice(0, 2)
      .map((g) => ({ id: g.id, label: g.name, meta: "Not started", href: "/goals" as const })),
  ];

  const streaks: StreakItem[] = habits
    .filter((h) => h.active && h.frequency !== HabitFrequency.OneTime)
    .map((h) => {
      const s = currentStreak(h, progress, asOf);
      return {
        id: h.id,
        label: h.name,
        count: s.count,
        unit: s.unit,
        kind: h.kind === HabitKind.Negative ? ("negative" as const) : ("positive" as const),
      };
    })
    .filter((s) => s.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  return {
    todaySummary,
    weekSummary,
    monthSummary,
    todayItems,
    weekItems,
    monthItems,
    pending,
    streaks,
  };
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

