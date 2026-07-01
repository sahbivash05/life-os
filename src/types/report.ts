import type { HabitFrequency } from "@/types/habit";

export type ReportPeriod = "week" | "month";

export type HabitReportRow = {
  habitId: string;
  habitName: string;
  frequency: HabitFrequency;
  completed: number;
  target: number;
  completionRate: number; // 0..1
  pointsEarned: number;
  pointsPossible: number;
};

export type HabitReport = {
  period: ReportPeriod;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  scorePercent: number; // 0..100
  totalPointsEarned: number;
  totalPointsPossible: number;
  rows: HabitReportRow[];
  bestHabitId?: string;
  worstHabitId?: string;
  mostMissedHabitId?: string;
  longestStreakHabitId?: string;
};

