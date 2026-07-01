export type StorageNamespace = "habits" | "progress" | "preferences";

const APP_PREFIX = "life-os:v1";

export function storageKey(ns: StorageNamespace) {
  return `${APP_PREFIX}:${ns}`;
}

type StorageEventDetail = { key: string };
const emitter = new EventTarget();

function emitChange(key: string) {
  emitter.dispatchEvent(new CustomEvent<StorageEventDetail>("change", { detail: { key } }));
}

export function subscribeStorageKey(key: string, listener: () => void) {
  const onEmitter = (ev: Event) => {
    const ce = ev as CustomEvent<StorageEventDetail>;
    if (ce.detail.key === key) listener();
  };
  emitter.addEventListener("change", onEmitter);

  const onStorage = (ev: StorageEvent) => {
    if (ev.storageArea !== window.localStorage) return;
    if (ev.key !== key) return;
    listener();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    emitter.removeEventListener("change", onEmitter);
    window.removeEventListener("storage", onStorage);
  };
}

export function getString(key: string) {
  return window.localStorage.getItem(key);
}

export function setString(key: string, value: string) {
  window.localStorage.setItem(key, value);
  emitChange(key);
}

export function removeKey(key: string) {
  window.localStorage.removeItem(key);
  emitChange(key);
}

export function getJson<T>(key: string, fallback: T): T {
  const raw = getString(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function setJson<T>(key: string, value: T) {
  setString(key, JSON.stringify(value));
}