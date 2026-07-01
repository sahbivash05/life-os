import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type ScorePoint = { label: string; score: number };

export function ScoreTrendChart(props: {
  title: string;
  subtitle?: string;
  data: ScorePoint[];
}) {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-base">{props.title}</CardTitle>
        {props.subtitle ? (
          <div className="text-xs text-muted-foreground">{props.subtitle}</div>
        ) : null}
      </CardHeader>
      <CardContent>
        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={props.data} margin={{ left: 8, right: 8 }}>
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                fontSize={12}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                fontSize={12}
                width={28}
              />
              <Tooltip
                cursor={{ stroke: "hsl(var(--border))", strokeWidth: 1 }}
                contentStyle={{
                  background: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 12,
                }}
                labelStyle={{ color: "hsl(var(--muted-foreground))" }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

