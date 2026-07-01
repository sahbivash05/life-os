export enum HabitFrequency {
  Daily = "daily",
  Weekly = "weekly",
  Monthly = "monthly",
  OneTime = "one-time",
}

export enum HabitCategory {
  Health = "health",
  Fitness = "fitness",
  Mind = "mind",
  Career = "career",
  Social = "social",
  PersonalCare = "personal-care",
  Productivity = "productivity",
  Finance = "finance",
  Negative = "negative",
}

export enum HabitKind {
  Positive = "positive",
  Negative = "negative",
}

export enum HabitMetricType {
  Checkbox = "checkbox",
  Number = "number",
}

export type HabitTarget =
  | {
      type: HabitMetricType.Checkbox;
    }
  | {
      type: HabitMetricType.Number;
      target: number;
      unit: string;
      step?: number;
      precision?: number;
    };

export interface Habit {
  id: string;
  name: string;
  description?: string;

  category: HabitCategory;
  frequency: HabitFrequency;
  kind: HabitKind;
  points: number;
  target: HabitTarget;

  active: boolean;
  sortOrder: number;
  createdAt: string; // ISO
  archivedAt?: string; // ISO
}

export type HabitId = Habit["id"];