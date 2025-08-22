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
  historicalData: z.string().describe('The historical stock data as a string for the last 30 days.'),
});
export type StockDataOutput = z.infer<typeof StockDataOutputSchema>;

export async function getStockData(input: StockDataInput): Promise<StockDataOutput> {
  return stockDataRetrievalFlow(input);
}

const getStockDataTool = ai.defineTool({
  name: 'getStockData',
  description: 'Returns the current market data and 30-day historical data of a stock.',
  inputSchema: z.object({
    ticker: z.string().describe('The ticker symbol of the stock.'),
  }),
  outputSchema: z.object({
    price: z.number().describe('The current price of the stock.'),
    volume: z.number().describe('The current trading volume of the stock.'),
    historicalData: z.string().describe('The historical stock data as a string for the last 30 days.'),
  }),
},
async (input) => {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  if (!apiKey) {
    throw new Error('ALPHA_VANTAGE_API_KEY is not set in the environment variables.');
  }

  const quoteUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${input.ticker}&apikey=${apiKey}`;
  const historyUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${input.ticker}&apikey=${apiKey}`;

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

    const timeSeries = historyData['Time Series (Daily)'];
     if (!timeSeries) {
      throw new Error(`No historical data found for ticker ${input.ticker}. The API limit might have been reached or the ticker is invalid.`);
    }

    const price = parseFloat(globalQuote['05. price']);
    const volume = parseInt(globalQuote['06. volume'], 10);

    const historicalDataPoints = Object.entries(timeSeries)
      .slice(0, 30)
      .map(([date, data]) => {
          const closePrice = (data as any)['4. close'];
          return `Date: ${date}, Close Price: $${parseFloat(closePrice).toFixed(2)}`;
      });
      
    const historicalData = historicalDataPoints.join('\n');

    return { price, volume, historicalData };
  } catch (error: any) {
    console.error("Error fetching from Alpha Vantage:", error);
    // Add a check for API limit messages
    if (error.message.includes("API call frequency")) {
      throw new Error("Alpha Vantage API limit reached. Please try again later.");
    }
    throw new Error(`Failed to retrieve stock data for ${input.ticker}. Please ensure the ticker is correct and your API key is valid.`);
  }
}
);

const stockDataRetrievalFlow = ai.defineFlow(
  {
    name: 'stockDataRetrievalFlow',
    inputSchema: StockDataInputSchema,
    outputSchema: StockDataOutputSchema,
  },
  async (input) => {
    // Directly call the tool to get real data
    const output = await getStockDataTool(input);
    return output;
  }
);
