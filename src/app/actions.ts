'use server';

import { getStockData } from '@/ai/flows/stock-data-retrieval';
import { z } from 'zod';

const FormSchema = z.object({
  ticker: z.string().min(1, 'Ticker is required').max(50, 'Input is too long'),
});

// Define types for the data payload
export type StockData = { price: number; volume: number };
export type Prediction = { recommendation: 'buy' | 'sell' | 'hold' };
export type ChartDataPoint = { day: number; price: number };
export type StockInfoPayload = {
  stockData: StockData;
  prediction: Prediction;
  chartData: ChartDataPoint[];
  ticker: string;
};

// Helper to generate chart data array from historical string
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

// Helper to generate simple prediction based on price trend
const generateSimplePrediction = (chartData: ChartDataPoint[]): Prediction => {
    if (chartData.length < 2) {
        return { recommendation: 'hold' };
    }
    
    const recent = chartData.slice(-5); // Last 5 days
    const older = chartData.slice(-10, -5); // Previous 5 days
    
    const recentAvg = recent.reduce((sum, point) => sum + point.price, 0) / recent.length;
    const olderAvg = older.length > 0 ? older.reduce((sum, point) => sum + point.price, 0) / older.length : recentAvg;
    
    const trend = ((recentAvg - olderAvg) / olderAvg) * 100;
    
    if (trend > 2) return { recommendation: 'buy' };
    if (trend < -2) return { recommendation: 'sell' };
    return { recommendation: 'hold' };
};

export async function fetchStockInfo(
  values: z.infer<typeof FormSchema>
): Promise<{ error: string } | StockInfoPayload> {
  try {
    const validatedFields = FormSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: 'Invalid input.' };
    }
    const { ticker: query } = validatedFields.data;

    // Clean and validate ticker input (no AI conversion)
    const ticker = query.trim().toUpperCase();
    
    // Basic ticker validation (2-5 characters, letters only)
    if (!/^[A-Z]{1,5}$/.test(ticker)) {
      return { error: `"${query}" doesn't look like a valid ticker symbol. Please use ticker symbols like AAPL, GOOGL, MSFT, etc.` };
    }

    const retrievedData = await getStockData({ ticker });

    if (!retrievedData || typeof retrievedData.price !== 'number' || typeof retrievedData.volume !== 'number') {
      return { error: 'Could not retrieve data for the specified ticker. Please check the symbol and try again.' };
    }
    
    const stockData = {
        price: retrievedData.price,
        volume: retrievedData.volume,
    }

    const historicalData = retrievedData.historicalData;
    const chartData = parseHistoricalDataToChart(historicalData);
    
    // Generate simple trend-based prediction (no AI)
    const prediction = generateSimplePrediction(chartData);

    return { stockData, prediction, chartData, ticker };
  } catch (e: any) {
    console.error(e);
    return { error: e.message || 'An unexpected error occurred while fetching stock data. Please try again later.' };
  }
}
