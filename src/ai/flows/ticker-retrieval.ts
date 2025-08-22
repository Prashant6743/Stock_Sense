'use server';

/**
 * @fileOverview Converts a company name or ticker-like input into a valid stock ticker symbol.
 *
 * - getTickerSymbol - A function that handles the ticker symbol conversion.
 */

import { ai } from '@/ai/genkit';
import { TickerInput, TickerInputSchema, TickerOutput, TickerOutputSchema } from './ticker-retrieval.schema';

export async function getTickerSymbol(input: TickerInput): Promise<TickerOutput> {
  return tickerRetrievalFlow(input);
}

const prompt = ai.definePrompt({
  name: 'tickerRetrievalPrompt',
  input: { schema: TickerInputSchema },
  output: { schema: TickerOutputSchema },
  prompt: `You are an AI assistant that converts company names or user queries into their official stock market ticker symbol.
  
  User Query: {{{query}}}
  
  Please provide only the stock ticker symbol for the company mentioned in the query. For example, if the query is "Apple", the output should be "AAPL". If the input is already a valid ticker, just return it.`,
});

const tickerRetrievalFlow = ai.defineFlow(
  {
    name: 'tickerRetrievalFlow',
    inputSchema: TickerInputSchema,
    outputSchema: TickerOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
