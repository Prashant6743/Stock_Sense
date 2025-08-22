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
  // Add more fields as needed
});
export type StockDataOutput = z.infer<typeof StockDataOutputSchema>;

export async function getStockData(input: StockDataInput): Promise<StockDataOutput> {
  return stockDataRetrievalFlow(input);
}

const getStockDataTool = ai.defineTool({
  name: 'getStockData',
  description: 'Returns the current market data of a stock, including price and volume.',
  inputSchema: z.object({
    ticker: z.string().describe('The ticker symbol of the stock.'),
  }),
  outputSchema: z.object({
    price: z.number().describe('The current price of the stock.'),
    volume: z.number().describe('The current trading volume of the stock.'),
  }),
},
async (input) => {
  // Mock implementation - replace with actual data retrieval logic
  console.log(`Fetching stock data for ${input.ticker}`);
  return {
    price: Math.random() * 100,
    volume: Math.floor(Math.random() * 10000),
  };
}
);

const prompt = ai.definePrompt({
  name: 'stockDataRetrievalPrompt',
  tools: [getStockDataTool],
  input: {schema: StockDataInputSchema},
  output: {schema: StockDataOutputSchema},
  prompt: `You are a financial expert providing stock data.

  The user will provide a stock ticker, and you should respond with the current stock price and volume, using the available tools.

  Stock ticker: {{{ticker}}}`, // Access ticker from input
});

const stockDataRetrievalFlow = ai.defineFlow(
  {
    name: 'stockDataRetrievalFlow',
    inputSchema: StockDataInputSchema,
    outputSchema: StockDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
