import { useMemo } from "react";

import { useHabits } from "@/hooks/useHabits";
import { useProgressIndex } from "@/hooks/useProgress";
import { buildDashboardCards, trendLastNDays } from "@/services/analyticsService";
import { isoDate } from "@/utils/date";

export function useDashboardAnalytics() {
  const habits = useHabits();
  const progress = useProgressIndex();
  const today = isoDate();

  return useMemo(() => {
    const cards = buildDashboardCards(habits, progress, today);
    const trend14 = trendLastNDays(14, habits, progress, today);
    return { ...cards, trend14 };
  }, [habits, progress, today]);
}

