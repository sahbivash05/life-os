import { describe, expect, it } from "vitest";

import { completionRatio, pointsEarned } from "@/services/habitEngine";
import {
  HabitCategory,
  HabitFrequency,
  HabitKind,
  HabitMetricType,
  type Habit,
} from "@/types/habit";

const baseHabit: Habit = {
  id: "h1",
  name: "Test",
  category: HabitCategory.Health,
  frequency: HabitFrequency.Daily,
  kind: HabitKind.Positive,
  points: 10,
  target: { type: HabitMetricType.Number, target: 20, unit: "min", step: 5 },
  active: true,
  sortOrder: 1,
  createdAt: "2026-01-01T00:00:00.000Z",
};

describe("habitEngine", () => {
  it("computes numeric completion ratio", () => {
    expect(completionRatio(baseHabit, 0)).toBe(0);
    expect(completionRatio(baseHabit, 10)).toBeCloseTo(0.5);
    expect(completionRatio(baseHabit, 20)).toBe(1);
    expect(completionRatio(baseHabit, 50)).toBe(1);
  });

  it("computes points earned proportionally", () => {
    expect(pointsEarned(baseHabit, 10)).toBeCloseTo(5);
    expect(pointsEarned(baseHabit, 20)).toBeCloseTo(10);
  });

  it("handles checkbox completion", () => {
    const checkboxHabit: Habit = {
      ...baseHabit,
      target: { type: HabitMetricType.Checkbox },
    };
    expect(completionRatio(checkboxHabit, 0)).toBe(0);
    expect(completionRatio(checkboxHabit, 1)).toBe(1);
    expect(pointsEarned(checkboxHabit, 1)).toBe(10);
  });
});

