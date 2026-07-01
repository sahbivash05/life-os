import { useMemo, useSyncExternalStore } from "react";

import type { Habit } from "@/types/habit";
import { HabitFrequency } from "@/types/habit";
import { habitService } from "@/services/habitService";

export function useHabits(): Habit[] {
  return useSyncExternalStore(
    habitService.store.subscribe,
    habitService.store.getSnapshot,
    habitService.store.getSnapshot,
  );
}

export function useActiveHabits(): Habit[] {
  const habits = useHabits();
  return useMemo(() => habits.filter((h) => h.active), [habits]);
}

export function useHabitsByFrequency(freq: HabitFrequency, opts?: { activeOnly?: boolean }) {
  const habits = useHabits();
  const activeOnly = opts?.activeOnly ?? true;
  return useMemo(() => {
    const filtered = habits.filter((h) => h.frequency === freq);
    return activeOnly ? filtered.filter((h) => h.active) : filtered;
  }, [habits, freq, activeOnly]);
}

