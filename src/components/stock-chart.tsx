'use client';

import { Line, LineChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { ChartDataPoint } from '@/app/actions';

interface StockChartProps {
  data: ChartDataPoint[];
  ticker: string;
}

const chartConfig = {
  price: {
    label: 'Price',
    color: 'hsl(var(--accent))',
  },
} satisfies ChartConfig;

export function StockChart({ data, ticker }: StockChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{ticker.toUpperCase()} Price Trend (30 Days)</CardTitle>
        <CardDescription>Mock historical data visualization for trend analysis.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 10,
              bottom: 10,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => (value % 5 === 0 ? `Day ${value}` : '')}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={['dataMin', 'dataMax']}
              tickFormatter={(value) => `$${Number(value).toFixed(0)}`}
            />
            <ChartTooltip
              cursor={true}
              content={
                <ChartTooltipContent
                  labelFormatter={(label) => `Day ${label}`}
                  formatter={(value) => `$${(value as number).toFixed(2)}`}
                  indicator="dot"
                />
              }
            />
            <Line
              dataKey="price"
              type="monotone"
              stroke="var(--color-price)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
