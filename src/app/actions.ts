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

// Helper to generate mock chart data array from historical string
const parseHistoricalDataToChart = (historicalData: string): ChartDataPoint[] => {
    return historicalData.split('\n')
        .map((line, index) => {
            const priceMatch = line.match(/Close Price: \$([\d.]+)/);
            if (priceMatch) {
                return {
                    day: 30 - index,
                    price: parseFloat(priceMatch[1]),
                };
            }
            return null;
        })
        .filter((item): item is ChartDataPoint => item !== null)
        .reverse();
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

    const retrievedData = await getStockData({ ticker });

    if (!retrievedData || typeof retrievedData.price !== 'number' || typeof retrievedData.volume !== 'number') {
      return { error: 'Could not retrieve data for the specified ticker. Please check the symbol and try again.' };
    }
    
    const stockData = {
        price: retrievedData.price,
        volume: retrievedData.volume,
    }

    const historicalData = retrievedData.historicalData;

    const prediction = await predictStockTrend({
      ticker,
      historicalData,
    });

    const chartData = parseHistoricalDataToChart(historicalData);

    return { stockData, prediction, chartData };
  } catch (e: any) {
    console.error(e);
    return { error: e.message || 'An unexpected error occurred while fetching stock data. Please try again later.' };
  }
}
