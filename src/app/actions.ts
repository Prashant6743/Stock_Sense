'use server';

import { getStockData } from '@/ai/flows/stock-data-retrieval';
import { predictStockTrend } from '@/ai/flows/price-prediction';
import { z } from 'zod';

const FormSchema = z.object({
  ticker: z.string().min(1, 'Ticker is required').max(10, 'Ticker is too long'),
});

// Define types for the data payload
export type StockData = { price: number; volume: number };
export type Prediction = { recommendation: 'buy' | 'sell' | 'hold' };
export type ChartDataPoint = { day: number; price: number };
export type StockInfoPayload = {
  stockData: StockData;
  prediction: Prediction;
  chartData: ChartDataPoint[];
};

// Helper to generate mock historical data string for the prediction model
const generateMockHistoricalDataString = (price: number): string => {
  const dataPoints = [];
  let currentPrice = price;
  for (let i = 0; i < 30; i++) {
    const change = (Math.random() - 0.45) * (currentPrice * 0.05);
    currentPrice += change;
    dataPoints.push(`Day ${30 - i}: $${currentPrice.toFixed(2)}`);
  }
  return dataPoints.join('\n');
};

// Helper to generate mock chart data array
const generateMockChartData = (price: number): ChartDataPoint[] => {
    let lastPrice = price * (1 + (Math.random() - 0.6) * 0.2);
    return Array.from({ length: 30 }, (_, i) => {
        lastPrice *= 1 + (Math.random() - 0.48) * 0.08;
        return {
            day: i + 1,
            price: parseFloat(lastPrice.toFixed(2)),
        }
    });
};


export async function fetchStockInfo(
  values: z.infer<typeof FormSchema>
): Promise<{ error: string } | StockInfoPayload> {
  try {
    const validatedFields = FormSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: 'Invalid ticker symbol.' };
    }
    const { ticker } = validatedFields.data;

    const stockData = await getStockData({ ticker });

    if (!stockData || typeof stockData.price !== 'number' || typeof stockData.volume !== 'number') {
      return { error: 'Could not retrieve data for the specified ticker. Please check the symbol and try again.' };
    }

    const historicalData = generateMockHistoricalDataString(stockData.price);

    const prediction = await predictStockTrend({
      ticker,
      historicalData,
    });

    const chartData = generateMockChartData(stockData.price);

    return { stockData, prediction, chartData };
  } catch (e) {
    console.error(e);
    return { error: 'An unexpected error occurred while fetching stock data. Please try again later.' };
  }
}
