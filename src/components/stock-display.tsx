'use client';

import type { Icon } from 'lucide-react';
import { TrendingUp, TrendingDown, Minus, DollarSign, BarChart3, BrainCircuit } from 'lucide-react';
import { StockChart } from './stock-chart';
import type { StockInfoPayload } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StockDisplayProps {
  data: StockInfoPayload;
  ticker: string;
}

const recommendationMap: Record<
  'buy' | 'sell' | 'hold',
  { label: string; Icon: Icon; colorClass: string, bgColorClass: string }
> = {
  buy: {
    label: 'Buy',
    Icon: TrendingUp,
    colorClass: 'text-[hsl(var(--chart-2))]',
    bgColorClass: 'bg-[hsl(var(--chart-2))]',
  },
  sell: {
    label: 'Sell',
    Icon: TrendingDown,
    colorClass: 'text-[hsl(var(--chart-1))]',
    bgColorClass: 'bg-[hsl(var(--chart-1))]',
  },
  hold: {
    label: 'Hold',
    Icon: Minus,
    colorClass: 'text-muted-foreground',
    bgColorClass: 'bg-muted-foreground',
  },
};

export function StockDisplay({ data, ticker }: StockDisplayProps) {
  const { stockData, prediction, chartData } = data;
  const recommendation = recommendationMap[prediction.recommendation];

  return (
    <div className="space-y-4 animate-in fade-in-0 duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InfoCard
          title="AI Recommendation"
          Icon={BrainCircuit}
          value={recommendation.label}
          ValueIcon={recommendation.Icon}
          valueColorClass={recommendation.colorClass}
        />
        <InfoCard
          title="Current Price"
          Icon={DollarSign}
          value={`$${stockData.price.toFixed(2)}`}
        />
        <InfoCard
          title="Trading Volume"
          Icon={BarChart3}
          value={stockData.volume.toLocaleString()}
        />
      </div>
      <StockChart data={chartData} ticker={ticker} />
    </div>
  );
}

interface InfoCardProps {
  title: string;
  Icon: Icon;
  value: string;
  ValueIcon?: Icon;
  valueColorClass?: string;
}

function InfoCard({ title, Icon, value, ValueIcon, valueColorClass }: InfoCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold flex items-center gap-2", valueColorClass)}>
          {ValueIcon && <ValueIcon className="h-6 w-6" />}
          {value}
        </div>
      </CardContent>
    </Card>
  );
}
