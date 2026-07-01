import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/utils/cn";

export function StatCard(props: {
  label: string;
  value: string;
  hint?: string;
  right?: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("overflow-hidden", props.className)}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="text-sm font-medium text-muted-foreground">
          {props.label}
        </div>
        {props.right ? <div className="mt-0.5">{props.right}</div> : null}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold tracking-tight">{props.value}</div>
        {props.hint ? (
          <div className="mt-1 text-xs text-muted-foreground">{props.hint}</div>
        ) : null}
      </CardContent>
    </Card>
  );
}

