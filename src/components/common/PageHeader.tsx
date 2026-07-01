import { cn } from "@/utils/cn";

export function PageHeader(props: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-6 flex items-start justify-between gap-4", props.className)}>
      <div className="min-w-0">
        <h1 className="truncate text-xl font-semibold tracking-tight">
          {props.title}
        </h1>
        {props.subtitle ? (
          <p className="mt-1 text-sm text-muted-foreground">{props.subtitle}</p>
        ) : null}
      </div>
      {props.right ? <div className="shrink-0">{props.right}</div> : null}
    </div>
  );
}

