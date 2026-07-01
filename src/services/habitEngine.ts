import type { Habit } from "@/types/habit";
import { HabitMetricType } from "@/types/habit";

export function targetValue(habit: Habit): number {
  switch (habit.target.type) {
    case HabitMetricType.Checkbox:
      return 1;
    case HabitMetricType.Number:
      return habit.target.target;
    default: {
      const _exhaustive: never = habit.target;
      return _exhaustive;
    }
  }
}

export function formatTarget(habit: Habit): string {
  switch (habit.target.type) {
    case HabitMetricType.Checkbox:
      return "Done";
    case HabitMetricType.Number: {
      const precision = habit.target.precision ?? 0;
      const target = precision > 0 ? habit.target.target.toFixed(precision) : String(habit.target.target);
      return `${target} ${habit.target.unit}`.trim();
    }
    default: {
      const _exhaustive: never = habit.target;
      return _exhaustive;
    }
  }
}

export function completionRatio(habit: Habit, value: number): number {
  switch (habit.target.type) {
    case HabitMetricType.Checkbox:
      return value >= 1 ? 1 : 0;
    case HabitMetricType.Number: {
      const t = habit.target.target;
      if (t <= 0) return 0;
      return Math.max(0, Math.min(1, value / t));
    }
    default: {
      const _exhaustive: never = habit.target;
      return _exhaustive;
    }
  }
}

export function isComplete(habit: Habit, value: number): boolean {
  return completionRatio(habit, value) >= 1;
}

export function pointsEarned(habit: Habit, value: number): number {
  const ratio = completionRatio(habit, value);
  return habit.points * ratio;
}

export function formatValue(habit: Habit, value: number): string {
  switch (habit.target.type) {
    case HabitMetricType.Checkbox:
      return value >= 1 ? "✅" : "—";
    case HabitMetricType.Number: {
      const precision = habit.target.precision ?? 0;
      const v = precision > 0 ? value.toFixed(precision) : String(Math.round(value * 100) / 100);
      const t = precision > 0 ? habit.target.target.toFixed(precision) : String(habit.target.target);
      return `${v} / ${t} ${habit.target.unit}`.trim();
    }
    default: {
      const _exhaustive: never = habit.target;
      return _exhaustive;
    }
  }
}

export function clampNumberInput(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, value);
}

