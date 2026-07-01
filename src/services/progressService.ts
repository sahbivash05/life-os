import type { HabitId } from "@/types/habit";
import type { HabitProgressEntry, IsoDate, ProgressIndex } from "@/types/progress";
import { createStore } from "@/utils/store";
import { isoDate } from "@/utils/date";
import { dayjs } from "@/utils/dayjs";
import {
  getJson,
  setJson,
  storageKey,
  subscribeStorageKey,
} from "@/services/storage";

const KEY = storageKey("progress");

type ProgressState = {
  hydrated: boolean;
  index: ProgressIndex;
};

const store = createStore<ProgressState>({ hydrated: false, index: {} });

function makeKey(habitId: HabitId, date: IsoDate) {
  return `${habitId}:${date}`;
}

function hydrate() {
  const s = store.getState();
  if (s.hydrated) return;
  const index = getJson<ProgressIndex>(KEY, {});
  store.setState({ hydrated: true, index });
}

subscribeStorageKey(KEY, () => {
  const index = getJson<ProgressIndex>(KEY, {});
  store.setState({ hydrated: true, index });
});

function setIndex(next: ProgressIndex) {
  setJson(KEY, next);
  store.setState({ hydrated: true, index: next });
}

function upsertEntry(entry: HabitProgressEntry) {
  const cur = progressService.getIndex();
  const key = makeKey(entry.habitId, entry.date);
  setIndex({ ...cur, [key]: entry });
}

export const progressService = {
  store: {
    getSnapshot() {
      hydrate();
      return store.getState().index;
    },
    subscribe(listener: () => void) {
      hydrate();
      return store.subscribe(() => listener());
    },
  },

  getIndex(): ProgressIndex {
    hydrate();
    return store.getState().index;
  },

  getValue(habitId: HabitId, date: IsoDate): number {
    hydrate();
    const key = makeKey(habitId, date);
    return store.getState().index[key]?.value ?? 0;
  },

  setValue(habitId: HabitId, date: IsoDate, value: number) {
    const clamped = Number.isFinite(value) ? value : 0;
    upsertEntry({
      habitId,
      date,
      value: clamped,
      updatedAt: dayjs().toISOString(),
    });
  },

  remove(habitId: HabitId, date: IsoDate) {
    hydrate();
    const cur = store.getState().index;
    const key = makeKey(habitId, date);
    if (!cur[key]) return;
    const next = { ...cur };
    delete next[key];
    setIndex(next);
  },

  removeAllForHabit(habitId: HabitId) {
    hydrate();
    const cur = store.getState().index;
    const next: ProgressIndex = {};
    for (const [k, v] of Object.entries(cur)) {
      if (v.habitId === habitId) continue;
      next[k] = v;
    }
    setIndex(next);
  },

  toggle(habitId: HabitId, date: IsoDate, nextChecked: boolean) {
    progressService.setValue(habitId, date, nextChecked ? 1 : 0);
  },

  increment(habitId: HabitId, date: IsoDate, delta: number) {
    const cur = progressService.getValue(habitId, date);
    progressService.setValue(habitId, date, Math.max(0, cur + delta));
  },

  getEntriesForDate(date: IsoDate): HabitProgressEntry[] {
    hydrate();
    const index = store.getState().index;
    return Object.values(index).filter((e) => e.date === date);
  },

  getEntriesForHabitInRange(habitId: HabitId, start: IsoDate, end: IsoDate) {
    hydrate();
    const index = store.getState().index;
    const s = dayjs(start, "YYYY-MM-DD");
    const e = dayjs(end, "YYYY-MM-DD");
    return Object.values(index)
      .filter((x) => x.habitId === habitId)
      .filter((x) => {
        const d = dayjs(x.date, "YYYY-MM-DD");
        return d.isSame(s) || d.isSame(e) || (d.isAfter(s) && d.isBefore(e));
      })
      .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  },

  clearAll() {
    setIndex({});
  },

  today(): IsoDate {
    return isoDate();
  },
};

