'use server';

/**
 * @fileOverview Predicts the future trend (up/down/hold) of a stock based on historical data.
 *
 * - predictStockTrend - A function that handles the stock trend prediction process.
 * - PredictStockTrendInput - The input type for the predictStockTrend function.
 * - PredictStockTrendOutput - The return type for the predictStockTrend function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictStockTrendInputSchema = z.object({
  ticker: z.string().describe('The ticker symbol of the stock.'),
  historicalData: z.string().describe('Historical stock data as a string.'),
});
export type PredictStockTrendInput = z.infer<typeof PredictStockTrendInputSchema>;

const PredictStockTrendOutputSchema = z.object({
  recommendation: z
    .enum(['buy', 'sell', 'hold'])
    .describe('A buy, sell, or hold recommendation.'),
});
export type PredictStockTrendOutput = z.infer<typeof PredictStockTrendOutputSchema>;

export async function predictStockTrend(input: PredictStockTrendInput): Promise<PredictStockTrendOutput> {
  return predictStockTrendFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictStockTrendPrompt',
  input: {schema: PredictStockTrendInputSchema},
  output: {schema: PredictStockTrendOutputSchema},
  prompt: `You are an AI stock trend predictor. Based on the historical stock data provided, predict whether the stock will trend up, down, or stay relatively the same, and provide a simple recommendation of "buy", "sell", or "hold".\n\nHistorical Data:\n{{{historicalData}}}`,
});

const predictStockTrendFlow = ai.defineFlow(
  {
    name: 'predictStockTrendFlow',
    inputSchema: PredictStockTrendInputSchema,
    outputSchema: PredictStockTrendOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
