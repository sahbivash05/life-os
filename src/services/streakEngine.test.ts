import { describe, expect, it } from "vitest";

import { currentStreak } from "@/services/streakEngine";
import { progressKey } from "@/utils/progress";
import { isoDate } from "@/utils/date";
import { dayjs } from "@/utils/dayjs";
import type { ProgressIndex } from "@/types/progress";
import {
  HabitCategory,
  HabitFrequency,
  HabitKind,
  HabitMetricType,
  type Habit,
} from "@/types/habit";

describe("streakEngine", () => {
  it("computes daily streak count", () => {
    const habit: Habit = {
      id: "no-smoking",
      name: "No Smoking",
      category: HabitCategory.Negative,
      frequency: HabitFrequency.Daily,
      kind: HabitKind.Negative,
      points: 10,
      target: { type: HabitMetricType.Checkbox },
      active: true,
      sortOrder: 1,
      createdAt: "2026-01-01T00:00:00.000Z",
    };

    const asOf = isoDate("2026-07-01");
    const d0 = asOf;
    const d1 = isoDate(dayjs(asOf).subtract(1, "day"));
    const d2 = isoDate(dayjs(asOf).subtract(2, "day"));
    const d3 = isoDate(dayjs(asOf).subtract(3, "day"));

    const progress: ProgressIndex = {
      [progressKey(habit.id, d0)]: { habitId: habit.id, date: d0, value: 1, updatedAt: "x" },
      [progressKey(habit.id, d1)]: { habitId: habit.id, date: d1, value: 1, updatedAt: "x" },
      [progressKey(habit.id, d2)]: { habitId: habit.id, date: d2, value: 1, updatedAt: "x" },
      [progressKey(habit.id, d3)]: { habitId: habit.id, date: d3, value: 0, updatedAt: "x" },
    };

    expect(currentStreak(habit, progress, asOf)).toEqual({ count: 3, unit: "day" });
  });
});

