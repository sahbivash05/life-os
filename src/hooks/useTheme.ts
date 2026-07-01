import { useEffect, useMemo, useSyncExternalStore } from "react";

import type { ThemeMode } from "@/services/preferencesService";
import { preferencesService } from "@/services/preferencesService";

function resolveTheme(mode: ThemeMode) {
  if (mode === "light") return "light";
  if (mode === "dark") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyResolvedTheme(resolved: "light" | "dark") {
  const root = document.documentElement;
  if (resolved === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
  root.style.colorScheme = resolved;
}

export function useTheme() {
  const prefs = useSyncExternalStore(
    preferencesService.store.subscribe,
    preferencesService.store.getSnapshot,
    preferencesService.store.getSnapshot,
  );

  const resolved = useMemo(() => resolveTheme(prefs.theme), [prefs.theme]);

  useEffect(() => {
    applyResolvedTheme(resolved);
  }, [resolved]);

  useEffect(() => {
    if (prefs.theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyResolvedTheme(resolveTheme("system"));
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [prefs.theme]);

  return {
    mode: prefs.theme,
    resolved,
    setMode: (m: ThemeMode) => preferencesService.setTheme(m),
  };
}

