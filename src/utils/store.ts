export type Unsubscribe = () => void;
export type Listener = () => void;

export function createStore<TState>(initial: TState) {
  let state = initial;
  const listeners = new Set<Listener>();

  function getState() {
    return state;
  }

  function setState(next: TState | ((prev: TState) => TState)) {
    const nextState = typeof next === "function" ? (next as (p: TState) => TState)(state) : next;
    if (Object.is(nextState, state)) return;
    state = nextState;
    listeners.forEach((l) => l());
  }

  function subscribe(listener: Listener): Unsubscribe {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }

  return { getState, setState, subscribe };
}

