import { useSyncExternalStore } from "react";

import type { ProgressIndex } from "@/types/progress";
import { progressService } from "@/services/progressService";

export function useProgressIndex(): ProgressIndex {
  return useSyncExternalStore(
    progressService.store.subscribe,
    progressService.store.getSnapshot,
    progressService.store.getSnapshot,
  );
}

