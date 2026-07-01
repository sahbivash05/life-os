import type { HabitId } from "@/types/habit";

export type IsoDate = string; // YYYY-MM-DD

export interface HabitProgressEntry {
  habitId: HabitId;
  date: IsoDate;
  value: number;
  updatedAt: string; // ISO timestamp
}

export type ProgressKey = string; // `${habitId}:${date}`

export type ProgressIndex = Record<ProgressKey, HabitProgressEntry>;

