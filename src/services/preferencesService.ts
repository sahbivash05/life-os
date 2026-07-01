import { createStore } from "@/utils/store";
import { getJson, setJson, storageKey, subscribeStorageKey } from "@/services/storage";

export type ThemeMode = "light" | "dark" | "system";

export type Preferences = {
  theme: ThemeMode;
};

const KEY = storageKey("preferences");

type PreferencesState = {
  hydrated: boolean;
  prefs: Preferences;
};

const DEFAULT_PREFS: Preferences = { theme: "system" };
const store = createStore<PreferencesState>({ hydrated: false, prefs: DEFAULT_PREFS });

function hydrate() {
  const s = store.getState();
  if (s.hydrated) return;
  const prefs = getJson<Preferences>(KEY, DEFAULT_PREFS);
  store.setState({ hydrated: true, prefs: { ...DEFAULT_PREFS, ...prefs } });
}

subscribeStorageKey(KEY, () => {
  const prefs = getJson<Preferences>(KEY, DEFAULT_PREFS);
  store.setState({ hydrated: true, prefs: { ...DEFAULT_PREFS, ...prefs } });
});

function setPrefs(next: Preferences) {
  setJson(KEY, next);
  store.setState({ hydrated: true, prefs: next });
}

export const preferencesService = {
  store: {
    getSnapshot() {
      hydrate();
      return store.getState().prefs;
    },
    subscribe(listener: () => void) {
      hydrate();
      return store.subscribe(() => listener());
    },
  },
  get(): Preferences {
    hydrate();
    return store.getState().prefs;
  },
  setTheme(theme: ThemeMode) {
    const cur = preferencesService.get();
    if (cur.theme === theme) return;
    setPrefs({ ...cur, theme });
  },
};

