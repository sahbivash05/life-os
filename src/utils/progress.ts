import type { HabitId } from "@/types/habit";
import type { IsoDate, ProgressKey } from "@/types/progress";

export function progressKey(habitId: HabitId, date: IsoDate): ProgressKey {
  return `${habitId}:${date}`;
}

