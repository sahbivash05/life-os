import { describe, expect, it } from "vitest";

import { generateWeeklyReport } from "@/services/reportService";
import { progressKey } from "@/utils/progress";
import type { ProgressIndex } from "@/types/progress";
import {
  HabitCategory,
  HabitFrequency,
  HabitKind,
  HabitMetricType,
  type Habit,
} from "@/types/habit";
import { eachDay, endOfIsoWeek, startOfIsoWeek } from "@/utils/date";

describe("reportService", () => {
  it("generates weekly report rows for daily and weekly habits", () => {
    const daily: Habit = {
      id: "journal",
      name: "Journal",
      category: HabitCategory.Mind,
      frequency: HabitFrequency.Daily,
      kind: HabitKind.Positive,
      points: 3,
      target: { type: HabitMetricType.Checkbox },
      active: true,
      sortOrder: 1,
      createdAt: "2026-01-01T00:00:00.000Z",
    };
    const weekly: Habit = {
      id: "bath",
      name: "Bath",
      category: HabitCategory.PersonalCare,
      frequency: HabitFrequency.Weekly,
      kind: HabitKind.Positive,
      points: 3,
      target: { type: HabitMetricType.Number, target: 4, unit: "times", step: 1 },
      active: true,
      sortOrder: 2,
      createdAt: "2026-01-01T00:00:00.000Z",
    };

    const asOf = "2026-07-01";
    const start = startOfIsoWeek(asOf);
    const end = endOfIsoWeek(asOf);
    const days = eachDay(start, end);

    const progress: ProgressIndex = {};
    // Journal completed 5/7
    for (const d of days.slice(0, 5)) {
      progress[progressKey(daily.id, d)] = { habitId: daily.id, date: d, value: 1, updatedAt: "x" };
    }
    // Bath completed 3 times in week
    for (const d of days.slice(0, 3)) {
      progress[progressKey(weekly.id, d)] = { habitId: weekly.id, date: d, value: 1, updatedAt: "x" };
    }

    const report = generateWeeklyReport(asOf, [daily, weekly], progress);
    expect(report.period).toBe("week");
    expect(report.rows).toHaveLength(2);

    const journalRow = report.rows.find((r) => r.habitId === "journal");
    expect(journalRow?.completed).toBe(5);
    expect(journalRow?.target).toBe(7);

    const bathRow = report.rows.find((r) => r.habitId === "bath");
    expect(bathRow?.completed).toBe(3);
    expect(bathRow?.target).toBe(4);
  });
});

