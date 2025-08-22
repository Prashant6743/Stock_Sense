// This file is used to fetch the stock data.
'use server';
/**
 * @fileOverview Fetches stock data based on the provided ticker symbol.
 *
 * - getStockData - A function that retrieves stock data.
 * - StockDataInput - The input type for the getStockData function.
 * - StockDataOutput - The return type for the getStockData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StockDataInputSchema = z.object({
  ticker: z.string().describe('The ticker symbol of the stock.'),
});
export type StockDataInput = z.infer<typeof StockDataInputSchema>;

const StockDataOutputSchema = z.object({
  price: z.number().describe('The current price of the stock.'),
  volume: z.number().describe('The current trading volume of the stock.'),
  historicalData: z.string().describe('The historical stock data as a string for recent 1-minute intervals.'),
  latestTimestamp: z.string().describe('The timestamp of the most recent data point.'),
});
export type StockDataOutput = z.infer<typeof StockDataOutputSchema>;

export async function getStockData(input: StockDataInput): Promise<StockDataOutput> {
  return stockDataRetrievalFlow(input);
}

const stockDataRetrievalFlow = ai.defineFlow(
  {
    name: 'stockDataRetrievalFlow',
    inputSchema: StockDataInputSchema,
    outputSchema: StockDataOutputSchema,
  },
  async (input) => {
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
    if (!apiKey) {
      throw new Error('ALPHA_VANTAGE_API_KEY is not set in the environment variables.');
    }

    const quoteUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${input.ticker}&apikey=${apiKey}`;
    const historyUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${input.ticker}&interval=1min&apikey=${apiKey}`;

    try {
      const [quoteResponse, historyResponse] = await Promise.all([
        fetch(quoteUrl),
        fetch(historyUrl),
      ]);

      if (!quoteResponse.ok || !historyResponse.ok) {
          throw new Error('Failed to fetch data from Alpha Vantage API');
      }

      const quoteData = await quoteResponse.json();
      const historyData = await historyResponse.json();
      
      const globalQuote = quoteData['Global Quote'];
      if (!globalQuote || Object.keys(globalQuote).length === 0) {
        throw new Error(`No quote data found for ticker ${input.ticker}. The API limit might have been reached or the ticker is invalid.`);
      }

      const timeSeries = historyData['Time Series (1min)'];
       if (!timeSeries) {
        throw new Error(`No historical data found for ticker ${input.ticker}. The API limit might have been reached or the ticker is invalid.`);
      }

      const price = parseFloat(globalQuote['05. price']);
      const volume = parseInt(globalQuote['06. volume'], 10);
      const latestTimestamp = globalQuote['07. latest trading day'];
      
      const historicalDataEntries = Object.entries(timeSeries)
        .slice(0, 29) // Take the last 29 available 1-min intervals
        .reverse(); // reverse to have oldest first

      const historicalDataPoints = historicalDataEntries.map(([dateTime, data]) => {
            const closePrice = (data as any)['4. close'];
            const time = new Date(dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return `Time: ${time}, Close Price: $${parseFloat(closePrice).toFixed(2)}`;
        });
      
      // Add the real-time quote as the last data point
      const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      historicalDataPoints.push(`Time: ${nowTime}, Close Price: $${price.toFixed(2)}`);
        
      const historicalData = historicalDataPoints.join('\n');

      return { price, volume, historicalData, latestTimestamp };
    } catch (error: any) {
      console.error("Error fetching from Alpha Vantage:", error);
      // Add a check for API limit messages
      if (error.message.includes("API call frequency") || (error.note && error.note.includes("call frequency"))) {
        throw new Error("Alpha Vantage API limit reached. Please try again later.");
      }
      throw new Error(`Failed to retrieve stock data for ${input.ticker}. Please ensure the ticker is correct and your API key is valid.`);
    }
  }
);
