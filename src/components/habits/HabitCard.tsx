import { Minus, Plus } from "lucide-react";

import type { Habit } from "@/types/habit";
import { HabitMetricType } from "@/types/habit";
import { clampNumberInput, completionRatio, formatTarget } from "@/services/habitEngine";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils/cn";

export function HabitCard(props: {
  habit: Habit;
  value: number;
  onChangeValue: (next: number) => void;
}) {
  const ratio = completionRatio(props.habit, props.value);
  const complete = ratio >= 1;
  const targetText = formatTarget(props.habit);

  return (
    <Card
      className={cn(
        "p-4 transition-colors",
        complete ? "bg-secondary/40" : "bg-card",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="truncate text-sm font-medium">{props.habit.name}</div>
            {complete ? <Badge variant="secondary">Done</Badge> : null}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            Target: {targetText} • {props.habit.points} pts
          </div>
        </div>

        <div className="shrink-0">
          <HabitValueInput
            habit={props.habit}
            value={props.value}
            onChangeValue={props.onChangeValue}
          />
        </div>
      </div>

      {props.habit.target.type === HabitMetricType.Number ? (
        <div className="mt-3">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary transition-[width]"
              style={{ width: `${Math.round(ratio * 100)}%` }}
            />
          </div>
        </div>
      ) : null}
    </Card>
  );
}

function HabitValueInput(props: {
  habit: Habit;
  value: number;
  onChangeValue: (next: number) => void;
}) {
  switch (props.habit.target.type) {
    case HabitMetricType.Checkbox: {
      const checked = props.value >= 1;
      return (
        <div className="flex items-center gap-2">
          <Checkbox
            checked={checked}
            onCheckedChange={(v) => props.onChangeValue(v ? 1 : 0)}
            aria-label={checked ? "Mark incomplete" : "Mark complete"}
          />
        </div>
      );
    }
    case HabitMetricType.Number: {
      const step = props.habit.target.step ?? 1;
      const precision = props.habit.target.precision ?? 0;
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => props.onChangeValue(clampNumberInput(props.value - step))}
            aria-label="Decrement"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <div className="w-28">
            <Input
              inputMode="decimal"
              type="number"
              step={step}
              value={Number.isFinite(props.value) ? props.value : 0}
              onChange={(e) =>
                props.onChangeValue(clampNumberInput(Number(e.target.value)))
              }
              className="h-9 text-right"
            />
            <div className="mt-1 text-right text-[11px] text-muted-foreground">
              {precision > 0 ? props.value.toFixed(precision) : props.value}{" "}
              {props.habit.target.unit}
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => props.onChangeValue(clampNumberInput(props.value + step))}
            aria-label="Increment"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      );
    }
    default: {
      const _exhaustive: never = props.habit.target;
      return _exhaustive;
    }
  }
}

