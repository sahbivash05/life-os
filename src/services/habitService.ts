import type { Habit, HabitId } from "@/types/habit";
import { DEFAULT_HABITS } from "@/data/habits";
import { createStore } from "@/utils/store";
import {
  getJson,
  setJson,
  storageKey,
  subscribeStorageKey,
} from "@/services/storage";

const KEY = storageKey("habits");

type HabitsState = {
  hydrated: boolean;
  habits: Habit[];
};

const store = createStore<HabitsState>({ hydrated: false, habits: [] });

function sortHabits(habits: Habit[]) {
  return [...habits].sort((a, b) => a.sortOrder - b.sortOrder);
}

function ensureSeeded(): Habit[] {
  const stored = getJson<Habit[]>(KEY, []);
  if (stored.length > 0) return sortHabits(stored);
  const seeded = sortHabits(DEFAULT_HABITS);
  setJson(KEY, seeded);
  return seeded;
}

function hydrate() {
  const s = store.getState();
  if (s.hydrated) return;
  store.setState({ hydrated: true, habits: ensureSeeded() });
}

subscribeStorageKey(KEY, () => {
  const next = getJson<Habit[]>(KEY, []);
  store.setState({ hydrated: true, habits: sortHabits(next) });
});

function setHabits(next: Habit[]) {
  const sorted = sortHabits(next);
  setJson(KEY, sorted);
  store.setState({ hydrated: true, habits: sorted });
}

export const habitService = {
  store: {
    getSnapshot() {
      hydrate();
      return store.getState().habits;
    },
    subscribe(listener: () => void) {
      hydrate();
      return store.subscribe(() => listener());
    },
  },

  getAll(): Habit[] {
    hydrate();
    return store.getState().habits;
  },

  getById(id: HabitId): Habit | undefined {
    hydrate();
    return store.getState().habits.find((h) => h.id === id);
  },

  upsert(habit: Habit) {
    const all = habitService.getAll();
    const idx = all.findIndex((h) => h.id === habit.id);
    if (idx === -1) {
      setHabits([...all, habit]);
      return;
    }
    const next = [...all];
    next[idx] = habit;
    setHabits(next);
  },

  setActive(id: HabitId, active: boolean) {
    const all = habitService.getAll();
    setHabits(all.map((h) => (h.id === id ? { ...h, active } : h)));
  },

  resetToDefaults() {
    setHabits(DEFAULT_HABITS);
  },
};

