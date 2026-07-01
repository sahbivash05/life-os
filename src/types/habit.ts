export type HabitFrequency = "daily" | "weekly" | "monthly" | "one-time";

export type HabitCategory =
  | "health"
  | "fitness"
  | "mind"
  | "career"
  | "social"
  | "personal";

export interface Habit {
  id: string;
  name: string;
  description?: string;

  category: HabitCategory;
  frequency: HabitFrequency;

  target: number; // e.g., 1/day, 3/week, 4/month
  unit: string;   // times, minutes, liters, steps

  points: number;

  streak: boolean;

  active: boolean;
}