import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/utils/cn";
import { dayjs } from "@/utils/dayjs";
import type { IsoDate } from "@/types/progress";
import { isoDate, parseIsoDate } from "@/utils/date";

function bucket(ratio: number) {
  if (ratio <= 0) return 0;
  if (ratio < 0.25) return 1;
  if (ratio < 0.5) return 2;
  if (ratio < 0.75) return 3;
  return 4;
}

const bucketClasses = [
  "bg-muted",
  "bg-chart-2/25",
  "bg-chart-2/45",
  "bg-chart-2/70",
  "bg-chart-2",
];

export function HeatmapCalendar(props: {
  endDate: IsoDate;
  days: number;
  values: Record<IsoDate, number>; // 0..1
  className?: string;
}) {
  const end = parseIsoDate(props.endDate).endOf("isoWeek");
  const start = end.subtract(props.days - 1, "day").startOf("isoWeek");

  const allDays: IsoDate[] = [];
  let cur = start;
  while (cur.isSame(end) || cur.isBefore(end)) {
    allDays.push(isoDate(cur));
    cur = cur.add(1, "day");
  }

  const weeks: IsoDate[][] = [];
  for (let i = 0; i < allDays.length; i += 7) {
    weeks.push(allDays.slice(i, i + 7));
  }

  return (
    <div className={cn("overflow-x-auto", props.className)}>
      <div className="inline-flex gap-1">
        {weeks.map((week, wIdx) => (
          <div key={wIdx} className="flex flex-col gap-1">
            {week.map((d) => {
              const ratio = props.values[d] ?? 0;
              const b = bucket(ratio);
              const d0 = dayjs(d);
              const end0 = dayjs(props.endDate);
              const inRange = d0.isSame(end0) || d0.isBefore(end0);
              const cls = inRange ? bucketClasses[b] : "bg-transparent";
              const label = `${dayjs(d).format("MMM D, YYYY")} • ${Math.round(
                ratio * 100,
              )}%`;

              return (
                <Tooltip key={d}>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        "h-3 w-3 rounded-[3px] ring-1 ring-border",
                        cls,
                        !inRange && "opacity-0",
                      )}
                      aria-label={label}
                    />
                  </TooltipTrigger>
                  <TooltipContent>{label}</TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

