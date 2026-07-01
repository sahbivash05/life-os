import type { Habit } from "@/types/habit";
import { HabitFrequency } from "@/types/habit";
import type { IsoDate, ProgressIndex } from "@/types/progress";
import { isComplete } from "@/services/habitEngine";
import { dayjs } from "@/utils/dayjs";
import { eachDay, endOfIsoWeek, endOfMonth, isoDate, startOfIsoWeek, startOfMonth } from "@/utils/date";
import { progressKey } from "@/utils/progress";

export type StreakUnit = "day" | "week" | "month";
export type Streak = { count: number; unit: StreakUnit };

export function currentStreak(habit: Habit, progress: ProgressIndex, asOf: IsoDate): Streak {
  switch (habit.frequency) {
    case HabitFrequency.Daily:
      return { count: dailyStreak(habit, progress, asOf), unit: "day" };
    case HabitFrequency.Weekly:
      return { count: weeklyStreak(habit, progress, asOf), unit: "week" };
    case HabitFrequency.Monthly:
      return { count: monthlyStreak(habit, progress, asOf), unit: "month" };
    case HabitFrequency.OneTime:
      return { count: 0, unit: "day" };
    default: {
      const _exhaustive: never = habit.frequency;
      return _exhaustive;
    }
  }
}

function dailyStreak(habit: Habit, progress: ProgressIndex, asOf: IsoDate) {
  let streak = 0;
  let cur = dayjs(asOf, "YYYY-MM-DD");
  for (let i = 0; i < 730; i += 1) {
    const d = isoDate(cur);
    const v = progress[progressKey(habit.id, d)]?.value ?? 0;
    if (!isComplete(habit, v)) break;
    streak += 1;
    cur = cur.subtract(1, "day");
  }
  return streak;
}

function weeklyStreak(habit: Habit, progress: ProgressIndex, asOf: IsoDate) {
  let streak = 0;
  let cur = dayjs(asOf, "YYYY-MM-DD");
  for (let i = 0; i < 104; i += 1) {
    const start = startOfIsoWeek(cur);
    const end = endOfIsoWeek(cur);
    const days = eachDay(start, end);
    const total = days.reduce((acc, d) => acc + (progress[progressKey(habit.id, d)]?.value ?? 0), 0);
    if (!isComplete(habit, total)) break;
    streak += 1;
    cur = cur.subtract(1, "week");
  }
  return streak;
}

function monthlyStreak(habit: Habit, progress: ProgressIndex, asOf: IsoDate) {
  let streak = 0;
  let cur = dayjs(asOf, "YYYY-MM-DD");
  for (let i = 0; i < 36; i += 1) {
    const start = startOfMonth(cur);
    const end = endOfMonth(cur);
    const days = eachDay(start, end);
    const total = days.reduce((acc, d) => acc + (progress[progressKey(habit.id, d)]?.value ?? 0), 0);
    if (!isComplete(habit, total)) break;
    streak += 1;
    cur = cur.subtract(1, "month");
  }
  return streak;
}

