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
  timestamp: string;
}

const chartConfig = {
  price: {
    label: 'Price',
    color: 'hsl(var(--accent))',
  },
} satisfies ChartConfig;

export function StockChart({ data, ticker, timestamp }: StockChartProps) {
  const chartDate = new Date(timestamp).toLocaleDateString([], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{ticker.toUpperCase()} Price Trend (Last 30 Mins)</CardTitle>
        <CardDescription>Intraday 1-minute interval data for {chartDate}.</CardDescription>
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
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value, index) => {
                // Display a tick every 5 minutes
                if (index % 5 === 0) {
                  return value;
                }
                return '';
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={['dataMin', 'dataMax']}
              tickFormatter={(value) => `$${Number(value).toFixed(2)}`}
            />
            <ChartTooltip
              cursor={true}
              content={
                <ChartTooltipContent
                  labelFormatter={(label) => `Time ${label}`}
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
